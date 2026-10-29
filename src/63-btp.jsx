// ═══ MODULE ═══
// @module Btp
// @depends EC_CSS, Plus, StatsBloc, ecBorder, ecBtn, ecBtnGold, ecDateFr, ecInput, ecPastille
//   ecTelecharger, fmt, isFutureDate, isLocked, statMois, statSomme, todayStr, uid, useBrouillon
//   useState
// @exports BtpModule
// ═══ FIN DE L'EN-TÊTE ═══
// Bloc BTP et construction : clients (maîtres d'ouvrage), chantiers avec bordereau de prix (devis imprimable), avances de démarrage,
// situations de travaux (décomptes) avec retenue de garantie et récupération de l'avance, encaissements, libération de la retenue,
// dépenses par chantier (matériaux, main-d'œuvre, sous-traitance, engins, transport, autres) avec règlement des dettes,
// rapports de rentabilité par chantier, statistiques.
// Rien n'est préréglé : prix, quantités, pourcentage de retenue, budget, dates et taxe sont saisis par l'entreprise.
//
// Comptabilité (tout en gourdes) :
//  • situation de travaux : Débit 411 (net à payer), 4117 (retenue de garantie), 4191 (avance récupérée) /
//    Crédit 706 (travaux facturés, hors taxe) et 445 (taxe, seulement si activée) ;
//  • avance de démarrage reçue : Débit caisse ou banque / Crédit 4191 ;
//  • encaissement d'une situation : Débit caisse ou banque / Crédit 411 ;
//  • retenue de garantie libérée : Débit caisse ou banque / Crédit 4117 ;
//  • dépense : Débit 601 matériaux, 661 main-d'œuvre, 611 sous-traitance, 622 engins et matériel loué, 618 transport, 628 autres /
//    Crédit caisse, banque ou 401 (à payer) ; règlement d'une dette : Débit 401 / Crédit caisse ou banque ;
//  • toute annulation passe une écriture inverse.
// Les comptes 706, 4117, 4191, 601, 661, 611, 622, 618 et 628 sont à confirmer avec l'expert-comptable.

const BT_DEPENSES = [["materiaux", "Matériaux", "601"], ["maindoeuvre", "Main-d'œuvre (ouvriers, journaliers)", "661"], ["soustraitance", "Sous-traitance", "611"], ["engins", "Location d'engins et de matériel", "622"], ["transport", "Transport", "618"], ["autre", "Autres frais de chantier", "628"]];
const BT_ETATS = [["preparation", "En préparation"], ["encours", "En cours"], ["suspendu", "Suspendu"], ["termine", "Terminé"]];
const BT_COMPTES = {
  "411": { name: "Clients", type: "Actif" },
  "4117": { name: "Clients — retenues de garantie", type: "Actif" },
  "4191": { name: "Clients — avances et acomptes reçus", type: "Passif" },
  "401": { name: "Fournisseurs", type: "Passif" },
  "445": { name: "Taxe collectée sur ventes (IVA/TCA)", type: "Passif" },
  "706": { name: "Travaux et prestations de services", type: "Produit" },
  "601": { name: "Achats de matériaux de chantier", type: "Charge" },
  "661": { name: "Main-d'œuvre de chantier", type: "Charge" },
  "611": { name: "Sous-traitance générale", type: "Charge" },
  "622": { name: "Locations d'engins et de matériel", type: "Charge" },
  "618": { name: "Transports de chantier", type: "Charge" },
  "628": { name: "Autres frais de chantier", type: "Charge" },
  "512": { name: "Banque", type: "Actif" },
  "530": { name: "Caisse", type: "Actif" },
};
const btR2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const btQ = (n) => Math.round((Number(n) || 0) * 1000) / 1000;
const btId = () => String(uid());
const btRows = (rows, type) => (rows || []).filter((r) => r && r.type === type);
const btJours = (a, b) => (a && b ? Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000) : 0);
const btNom = (x) => String(x || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const btUniq = (arr) => Array.from(new Set(arr.map((x) => String(x || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
const btMarche = (s) => btR2(((s && s.lines) || []).reduce((t, l) => t + (Number(l.qty) || 0) * (Number(l.pu) || 0), 0));
function btAjouterComptes(accounts, setAccounts, codes) {
  const missing = [...new Set(codes)].filter((k) => BT_COMPTES[k] && !accounts.some((a) => a.code === k)).map((k) => ({ code: k, name: BT_COMPTES[k].name, type: BT_COMPTES[k].type }));
  if (missing.length) setAccounts((prev) => [...prev, ...missing.filter((m) => !prev.some((a) => a.code === m.code))]);
}
// Solde d'une situation : le net à payer moins les encaissements valides
function btSolde(s) {
  const paye = btR2((s.payments || []).filter((p) => p.status !== "annulé").reduce((t, p) => t + p.amount, 0));
  return { paye, reste: btR2((s.net || 0) - paye) };
}
function btResteDep(d) {
  if (d.status === "annulé" || d.mode !== "apayer") return 0;
  return btR2(d.amount - (d.settlements || []).filter((x) => x.status !== "annulé").reduce((t, x) => t + x.amount, 0));
}

function BtpModule({ btp, setBtp, entries, setEntries, accounts, setAccounts, settings, role, showToast, logAudit, currentUserEmail }) {
  const canEdit = role === "Administrateur" || role === "Éditeur";
  const isVendeur = role === "Vendeur"; // secrétariat : clients, situations et encaissements
  const canFront = canEdit || isVendeur;
  const today = todayStr();
  const [tab, setTab] = useState("apercu");
  const clients = btRows(btp, "client");
  const sites = btRows(btp, "site");
  const sits = btRows(btp, "sit");
  const deps = btRows(btp, "dep");
  const rels = btRows(btp, "retrel");
  const cfg = btRows(btp, "config")[0] || {};
  const tcaOn = !!cfg.tcaOn;
  const tcaRate = tcaOn ? Number(settings.taxRate) || 0 : 0;
  const nomClient = (id) => (clients.find((x) => x.id === id) || {}).name || "—";
  const nomSite = (id) => (sites.find((x) => x.id === id) || {}).name || "—";
  const compteMode = (m) => (m === "banque" ? "512" : m === "apayer" ? "401" : "530");
  const maj = (id, fn) => setBtp((prev) => (prev || []).map((r) => (r.id === id ? fn(r) : r)));
  const ajouter = (rec) => setBtp((prev) => [...(prev || []), rec]);
  const ecrire = (date, label, lines, dossierId) => {
    const e = { id: uid(), date, createdAt: new Date().toISOString(), label, lines: lines.filter((l) => l.debit > 0 || l.credit > 0), kind: "btp", dossierId };
    setEntries((prev) => [...prev, e]);
    return e;
  };
  const contre = (entryId, label, date, dossierId) => {
    const e = (entries || []).find((x) => x.id === entryId);
    if (!e) return null;
    return ecrire(date, label, e.lines.map((l) => ({ account: l.account, debit: l.credit, credit: l.debit })), dossierId);
  };
  const verifDate = (date, action) => {
    if (!date || isFutureDate(date)) { showToast("La date ne peut pas être dans le futur."); return false; }
    if (isLocked(date, settings)) { showToast("La période comptable est clôturée jusqu'au " + settings.lockDate + " inclus : impossible de " + action + " à cette date."); return false; }
    return true;
  };
  const numero = (prefix, rows, date) => {
    const yy = String((date || today).slice(0, 4));
    const n = rows.filter((r) => String(r.number || "").startsWith(prefix + "-" + yy + "-")).reduce((m, r) => Math.max(m, Number(String(r.number).split("-")[2]) || 0), 0) + 1;
    return prefix + "-" + yy + "-" + String(n).padStart(4, "0");
  };
  // ── Calculs d'un chantier ──
  const sitsDe = (siteId) => sits.filter((x) => x.siteId === siteId && x.status !== "annulee").sort((a, b) => a.n - b.n);
  const derniere = (siteId) => { const l = sitsDe(siteId); return l.length ? l[l.length - 1] : null; };
  const avancesDe = (s) => (s.avances || []).filter((a) => a.status !== "annulé");
  const avanceTotale = (s) => btR2(avancesDe(s).reduce((t, a) => t + a.amount, 0));
  const avanceRecuperee = (siteId) => btR2(sitsDe(siteId).reduce((t, x) => t + (x.recup || 0), 0));
  const retenueDue = (siteId) => btR2(sitsDe(siteId).reduce((t, x) => t + (x.retenue || 0), 0) - rels.filter((r) => r.siteId === siteId && r.status !== "annulé").reduce((t, r) => t + r.amount, 0));
  const factureHt = (siteId) => { const d = derniere(siteId); return d ? d.cumHt : 0; };
  const depensesDe = (siteId) => btR2(deps.filter((d) => d.siteId === siteId && d.status !== "annulé").reduce((t, d) => t + d.amount, 0));
  const calcSit = (site, cumQty) => {
    const prev = derniere(site.id);
    const prevHt = prev ? prev.cumHt : 0;
    const cumHt = btR2((site.lines || []).reduce((t, l) => t + Math.min(Number(cumQty[l.id]) || 0, l.qty) * l.pu, 0));
    const ht = btR2(cumHt - prevHt);
    const tca = tcaOn ? btR2(ht * tcaRate / 100) : 0;
    const ttc = btR2(ht + tca);
    const retenue = btR2(ht * (Number(site.retPct) || 0) / 100);
    const marche = btMarche(site);
    const avTot = avanceTotale(site), avRest = btR2(avTot - avanceRecuperee(site.id));
    let recup = 0;
    if (avRest > 0 && marche > 0 && ht > 0) recup = cumHt >= marche - 0.004 ? avRest : btR2(avTot * ht / marche);
    recup = btR2(Math.max(0, Math.min(recup, avRest, ttc - retenue)));
    const net = btR2(ttc - retenue - recup);
    return { prevHt, cumHt, ht, tca, ttc, retenue, recup, net };
  };
  const [imprimer, setImprimer] = useState(null); // { kind: "devis" | "situation", id }
  const [selSite, setSelSite] = useState("");
  const [selSit, setSelSit] = useState("");
  const [selDep, setSelDep] = useState("");
  const listes = (<><datalist id="bt-dl-unite">{btUniq(["m²", "m³", "ml", "unité", "kg", "tonne", "forfait", "jour", "heure", ...sites.flatMap((s) => (s.lines || []).map((l) => l.unit))]).map((n) => <option key={n} value={n} />)}</datalist><datalist id="bt-dl-tiers">{btUniq(deps.map((d) => d.supplier)).map((n) => <option key={n} value={n} />)}</datalist><datalist id="bt-dl-ligne">{btUniq(sites.flatMap((s) => (s.lines || []).map((l) => l.label))).map((n) => <option key={n} value={n} />)}</datalist></>);

  // ───────── Clients ─────────
  const [fcl, setFcl] = useBrouillon("btp-client", { name: "", phone: "", address: "" });
  const [cq, setCq] = useState("");
  const ajouterClient = () => {
    if (!canFront) return;
    if (!fcl.name.trim()) { showToast("Indiquez le nom du client (maître d'ouvrage)."); return; }
    if (clients.some((c) => btNom(c.name) === btNom(fcl.name))) { showToast("Un client de ce nom existe déjà."); return; }
    ajouter({ type: "client", id: btId(), name: fcl.name.trim(), phone: fcl.phone.trim(), address: fcl.address.trim() });
    setFcl({ name: "", phone: "", address: "" }); showToast("Client ajouté.");
  };
  const resteClient = (id) => btR2(sits.filter((x) => x.clientId === id && x.status !== "annulee").reduce((t, x) => t + btSolde(x).reste, 0));
  const Clients = () => {
    const cF = clients.filter((c) => !cq.trim() || [c.name, c.phone, c.address].join(" ").toLowerCase().includes(cq.trim().toLowerCase()));
    return (
      <div>
        {canFront && (<div className="ec-card p-4 mb-5"><div className="grid md:grid-cols-4 gap-2 items-end">
          <div className="md:col-span-2"><label className="text-xs" style={{ color: "#8A8370" }}>Nom du client (maître d'ouvrage)</label><input value={fcl.name} onChange={(e) => setFcl({ ...fcl, name: e.target.value })} data-testid="bt-client-nom" className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Téléphone</label><input type="tel" value={fcl.phone} onChange={(e) => setFcl({ ...fcl, phone: e.target.value })} className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Adresse</label><input value={fcl.address} onChange={(e) => setFcl({ ...fcl, address: e.target.value })} className={ecInput} style={ecBorder} /></div>
        </div><button onClick={ajouterClient} className="mt-2 px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-client-ajouter">Ajouter le client</button></div>)}
        <div className="mb-2"><label className="text-xs" style={{ color: "#8A8370" }}>Rechercher (nom, téléphone, adresse)</label><input value={cq} onChange={(e) => setCq(e.target.value)} data-testid="bt-client-recherche" className={ecInput} style={{ ...ecBorder, maxWidth: 360 }} /></div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Client</th><th>Téléphone</th><th>Adresse</th><th className="text-right">Chantiers</th><th className="text-right">Reste à payer</th></tr></thead>
          <tbody>{cF.map((c) => (<tr key={c.id} data-testid="bt-client-ligne"><td className="py-1.5">{c.name}</td><td>{c.phone || "—"}</td><td className="text-xs">{c.address || "—"}</td><td className="text-right tabular">{sites.filter((s) => s.clientId === c.id).length}</td><td className="text-right tabular">{fmt(resteClient(c.id))}</td></tr>))}</tbody>
          {cF.length > 0 && <tfoot><tr style={{ fontWeight: 600, borderTop: "2px solid #152238" }} data-testid="bt-client-total-ligne"><td colSpan={4}>Total ({cF.length})</td><td className="text-right tabular" data-testid="bt-client-tot-reste">{fmt(btR2(cF.reduce((t, c) => t + resteClient(c.id), 0)))}</td></tr></tfoot>}</table></div>
        {cF.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>{clients.length === 0 ? "Aucun client." : "Aucun résultat."}</div>}
      </div>
    );
  };

  // ───────── Chantiers ─────────
  const [fs, setFs] = useBrouillon("btp-chantier", { name: "", clientId: "", address: "", start: todayStr(), end: "", retPct: "", budget: "" });
  const [sq, setSq] = useState(""); const [sst, setSst] = useState("");
  const [fl, setFl] = useState({ label: "", unit: "", qty: "", pu: "" });
  const [fav, setFav] = useState({ amount: "", mode: "caisse", date: todayStr() });
  const [frt, setFrt] = useState({ amount: "", mode: "caisse", date: todayStr() });
  const creerChantier = () => {
    if (!canEdit) return;
    const name = fs.name.trim();
    if (!name) { showToast("Indiquez le nom du chantier."); return; }
    if (!fs.clientId) { showToast("Choisissez le client."); return; }
    if (sites.some((x) => btNom(x.name) === btNom(name))) { showToast("Un chantier de ce nom existe déjà."); return; }
    if (fs.end && fs.start && fs.end < fs.start) { showToast("La date de fin prévue doit être après le début."); return; }
    const ret = Number(fs.retPct) || 0;
    if (ret < 0 || ret > 30) { showToast("La retenue de garantie doit être comprise entre 0 et 30 %."); return; }
    const s = { type: "site", id: btId(), number: numero("CH", sites, fs.start || today), name, clientId: fs.clientId, address: fs.address.trim(), start: fs.start, end: fs.end, retPct: ret, budget: Number(fs.budget) || 0, status: "encours", lines: [], avances: [], createdAt: new Date().toISOString(), by: currentUserEmail || "" };
    ajouter(s);
    setFs({ ...fs, name: "", address: "", end: "", retPct: "", budget: "" });
    setSelSite(s.id);
    showToast("Chantier " + s.number + " créé : ajoutez maintenant son bordereau de prix."); logAudit("BTP", "Chantier créé", s.number + " — " + name);
  };
  const ajouterLigne = (s) => {
    if (!canEdit) return;
    const qty = btQ(fl.qty), pu = btR2(fl.pu);
    if (!fl.label.trim()) { showToast("Indiquez la désignation des travaux."); return; }
    if (!(qty > 0)) { showToast("Indiquez la quantité (supérieure à zéro)."); return; }
    if (!(pu >= 0) || fl.pu === "") { showToast("Indiquez le prix unitaire (en gourdes)."); return; }
    maj(s.id, (r) => ({ ...r, lines: [...(r.lines || []), { id: btId(), label: fl.label.trim(), unit: fl.unit.trim(), qty, pu }] }));
    setFl({ label: "", unit: fl.unit, qty: "", pu: "" });
  };
  const retirerLigne = (s, l) => {
    if (!canEdit || sitsDe(s.id).length > 0) return;
    maj(s.id, (r) => ({ ...r, lines: r.lines.filter((x) => x.id !== l.id) }));
  };
  const recevoirAvance = (s) => {
    if (!canEdit) return;
    const amount = btR2(fav.amount);
    if (!(amount > 0)) { showToast("Indiquez le montant de l'avance."); return; }
    if (!verifDate(fav.date, "enregistrer cette avance")) return;
    const cpt = compteMode(fav.mode === "banque" ? "banque" : "caisse");
    btAjouterComptes(accounts, setAccounts, [cpt, "4191"]);
    const e = ecrire(fav.date, "Avance de démarrage — " + s.name + " (" + nomClient(s.clientId) + ")", [{ account: cpt, debit: amount, credit: 0 }, { account: "4191", debit: 0, credit: amount }], s.id);
    maj(s.id, (r) => ({ ...r, avances: [...(r.avances || []), { id: btId(), date: fav.date, amount, mode: fav.mode, entryId: e.id, status: "valide" }] }));
    setFav({ ...fav, amount: "" }); showToast("Avance de " + fmt(amount) + " enregistrée."); logAudit("BTP", "Avance reçue", s.name + " — " + fmt(amount));
  };
  const annulerAvance = (s, a) => {
    if (!canEdit || a.status === "annulé") return;
    if (avanceRecuperee(s.id) > 0) { showToast("Une partie de l'avance est déjà récupérée sur des situations : annulez d'abord ces situations."); return; }
    if (!verifDate(today, "annuler cette avance")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler cette avance ? Une écriture inverse sera passée.")) return;
    const e = contre(a.entryId, "Annulation avance — " + s.name + " (écriture inverse)", today, s.id);
    maj(s.id, (r) => ({ ...r, avances: r.avances.map((x) => (x.id === a.id ? { ...x, status: "annulé", reversalEntryId: e ? e.id : "" } : x)) }));
    showToast("Avance annulée.");
  };
  const liberer = (s) => {
    if (!canEdit) return;
    if (s.status !== "termine") { showToast("La retenue se libère à la réception : passez d'abord le chantier à « Terminé »."); return; }
    const due = retenueDue(s.id);
    const amount = frt.amount === "" ? due : btR2(frt.amount);
    if (!(amount > 0) || amount > due + 0.004) { showToast("Le montant doit être compris entre 0 et la retenue à libérer (" + fmt(due) + ")."); return; }
    if (!verifDate(frt.date, "enregistrer cette libération")) return;
    const cpt = compteMode(frt.mode === "banque" ? "banque" : "caisse");
    btAjouterComptes(accounts, setAccounts, [cpt, "4117"]);
    const e = ecrire(frt.date, "Retenue de garantie encaissée — " + s.name + " (" + nomClient(s.clientId) + ")", [{ account: cpt, debit: amount, credit: 0 }, { account: "4117", debit: 0, credit: amount }], s.id);
    ajouter({ type: "retrel", id: btId(), siteId: s.id, date: frt.date, amount, mode: frt.mode, entryId: e.id, status: "valide" });
    setFrt({ ...frt, amount: "" }); showToast("Retenue de garantie encaissée : " + fmt(amount) + "."); logAudit("BTP", "Retenue libérée", s.name + " — " + fmt(amount));
  };
  const annulerLiberation = (r) => {
    if (!canEdit || r.status === "annulé") return;
    if (!verifDate(today, "annuler cet encaissement")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler cet encaissement de retenue ? Une écriture inverse sera passée.")) return;
    const e = contre(r.entryId, "Annulation encaissement de retenue (écriture inverse)", today, r.siteId);
    maj(r.id, (x) => ({ ...x, status: "annulé", reversalEntryId: e ? e.id : "" }));
    showToast("Encaissement de retenue annulé.");
  };
  const Chantiers = () => {
    const s = sites.find((x) => x.id === selSite);
    const sF = sites.filter((x) => (!sst || x.status === sst) && (!sq.trim() || [x.number, x.name, nomClient(x.clientId), x.address].join(" ").toLowerCase().includes(sq.trim().toLowerCase()))).sort((a, b) => String(b.number).localeCompare(String(a.number)));
    const avanc = (x) => { const m = btMarche(x); return m > 0 ? Math.round(factureHt(x.id) * 100 / m) : 0; };
    return (
      <div>
        {canEdit && (<div className="ec-card p-4 mb-5" data-testid="bt-nouveau-chantier"><div className="display text-base mb-2" style={{ color: "#152238" }}>Nouveau chantier</div>
          <div className="grid md:grid-cols-4 gap-2 items-end">
            <div className="md:col-span-2"><label className="text-xs" style={{ color: "#8A8370" }}>Nom du chantier</label><input value={fs.name} onChange={(e) => setFs({ ...fs, name: e.target.value })} data-testid="bt-ch-nom" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Client</label><select value={fs.clientId} onChange={(e) => setFs({ ...fs, clientId: e.target.value })} data-testid="bt-ch-client" className={ecInput} style={ecBorder}><option value="">— choisir —</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Adresse du chantier</label><input value={fs.address} onChange={(e) => setFs({ ...fs, address: e.target.value })} className={ecInput} style={ecBorder} /></div>
          </div>
          <div className="grid md:grid-cols-5 gap-2 items-end mt-2">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Début</label><input type="date" value={fs.start} onChange={(e) => setFs({ ...fs, start: e.target.value })} data-testid="bt-ch-debut" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Fin prévue (facultatif)</label><input type="date" value={fs.end} onChange={(e) => setFs({ ...fs, end: e.target.value })} data-testid="bt-ch-fin" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Retenue de garantie (% — selon le marché)</label><input type="number" min="0" max="30" step="0.5" value={fs.retPct} onChange={(e) => setFs({ ...fs, retPct: e.target.value })} data-testid="bt-ch-retenue" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Budget de dépenses (facultatif)</label><input type="number" min="0" value={fs.budget} onChange={(e) => setFs({ ...fs, budget: e.target.value })} data-testid="bt-ch-budget" className={ecInput + " tabular"} style={ecBorder} /></div>
            <button onClick={creerChantier} className="px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-ch-creer">Créer le chantier</button>
          </div>
          {clients.length === 0 && <div className="text-xs mt-2" style={{ color: "#8A8370" }}>Aucun client : enregistrez d'abord le maître d'ouvrage dans l'onglet Clients.</div>}
        </div>)}
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <div className="flex-1 min-w-[150px]"><label className="text-xs" style={{ color: "#8A8370" }}>Rechercher (n°, chantier, client, adresse)</label><input value={sq} onChange={(e) => setSq(e.target.value)} data-testid="bt-ch-recherche" className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>État</label><select value={sst} onChange={(e) => setSst(e.target.value)} data-testid="bt-ch-filtre-etat" className={ecInput} style={ecBorder}><option value="">Tous</option>{BT_ETATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
        </div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">N°</th><th>Chantier</th><th>Client</th><th className="text-right">Marché</th><th className="text-right">Avancement</th><th className="text-right">Facturé (HT)</th><th className="text-right">Dépenses</th><th>État</th><th></th></tr></thead>
          <tbody>{sF.map((x) => (<tr key={x.id} data-testid="bt-ch-ligne" style={{ background: x.id === selSite ? "#E6F1EE" : undefined }}><td className="py-1.5 tabular text-xs">{x.number}</td><td className="font-semibold">{x.name}</td><td>{nomClient(x.clientId)}</td><td className="text-right tabular">{fmt(btMarche(x))}</td><td className="text-right tabular">{avanc(x)} %</td><td className="text-right tabular">{fmt(factureHt(x.id))}</td><td className="text-right tabular">{fmt(depensesDe(x.id))}</td>
            <td>{x.status === "termine" ? ecPastille("Terminé", "ok") : x.status === "suspendu" ? ecPastille("Suspendu", "alerte") : x.status === "preparation" ? ecPastille("En préparation", "neutre") : ecPastille("En cours", "attente")}</td>
            <td className="text-right whitespace-nowrap"><button onClick={() => setSelSite(x.id === selSite ? "" : x.id)} className="text-xs underline" data-testid="bt-ch-ouvrir">{x.id === selSite ? "Fermer" : "Ouvrir"}</button></td></tr>))}</tbody>
          {sF.length > 0 && <tfoot><tr style={{ fontWeight: 600, borderTop: "2px solid #152238" }} data-testid="bt-ch-total-ligne"><td colSpan={3}>Total ({sF.length} chantier{sF.length > 1 ? "s" : ""})</td><td className="text-right tabular" data-testid="bt-ch-tot-marche">{fmt(btR2(sF.reduce((t, x) => t + btMarche(x), 0)))}</td><td></td><td className="text-right tabular" data-testid="bt-ch-tot-fact">{fmt(btR2(sF.reduce((t, x) => t + factureHt(x.id), 0)))}</td><td className="text-right tabular" data-testid="bt-ch-tot-dep">{fmt(btR2(sF.reduce((t, x) => t + depensesDe(x.id), 0)))}</td><td colSpan={2}></td></tr></tfoot>}</table></div>
        {sF.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>{sites.length === 0 ? "Aucun chantier." : "Aucun chantier ne correspond à ces filtres."}</div>}
        {s && (<div className="ec-card p-4 mt-5" data-testid="bt-ch-detail">
          <div className="display text-lg mb-1" style={{ color: "#152238" }}>{s.number} — {s.name}</div>
          <div className="text-sm mb-3" style={{ color: "#5B563F" }}>Client : {nomClient(s.clientId)}{s.address ? " · " + s.address : ""} · du {ecDateFr(s.start)}{s.end ? " au " + ecDateFr(s.end) : ""}</div>
          <div className="grid md:grid-cols-4 gap-2 mb-4 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>État du chantier</label><select value={s.status} disabled={!canEdit} onChange={(e) => maj(s.id, (r) => ({ ...r, status: e.target.value }))} data-testid="bt-ch-etat" className={ecInput} style={ecBorder}>{BT_ETATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Fin prévue</label><input type="date" value={s.end || ""} disabled={!canEdit} onChange={(e) => maj(s.id, (r) => ({ ...r, end: e.target.value }))} className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Retenue de garantie (%)</label><input type="number" min="0" max="30" step="0.5" value={s.retPct || ""} disabled={!canEdit || sitsDe(s.id).length > 0} onChange={(e) => maj(s.id, (r) => ({ ...r, retPct: Math.min(30, Math.max(0, Number(e.target.value) || 0)) }))} className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Budget de dépenses</label><input type="number" min="0" value={s.budget || ""} disabled={!canEdit} onChange={(e) => maj(s.id, (r) => ({ ...r, budget: Number(e.target.value) || 0 }))} data-testid="bt-ch-budget-edit" className={ecInput + " tabular"} style={ecBorder} /></div>
          </div>
          <div className="flex items-center justify-between mb-2"><div className="display text-base" style={{ color: "#152238" }}>Bordereau de prix (devis)</div><button onClick={() => setImprimer({ kind: "devis", id: s.id })} className="text-xs underline" data-testid="bt-ch-devis">Imprimer le devis</button></div>
          <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Désignation</th><th>Unité</th><th className="text-right">Quantité</th><th className="text-right">Prix unitaire</th><th className="text-right">Montant</th><th></th></tr></thead>
            <tbody>{(s.lines || []).map((l) => (<tr key={l.id} data-testid="bt-ligne"><td className="py-1.5">{l.label}</td><td>{l.unit || "—"}</td><td className="text-right tabular">{l.qty}</td><td className="text-right tabular">{fmt(l.pu)}</td><td className="text-right tabular">{fmt(btR2(l.qty * l.pu))}</td><td className="text-right">{canEdit && sitsDe(s.id).length === 0 && <button onClick={() => retirerLigne(s, l)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-ligne-retirer">Retirer</button>}</td></tr>))}</tbody>
            {(s.lines || []).length > 0 && <tfoot><tr style={{ fontWeight: 600, borderTop: "2px solid #152238" }}><td colSpan={4}>Total du marché (hors taxe)</td><td className="text-right tabular" data-testid="bt-marche">{fmt(btMarche(s))}</td><td></td></tr></tfoot>}</table></div>
          {(s.lines || []).length === 0 && <div className="text-sm mb-2" style={{ color: "#8A8370" }}>Aucune ligne : ajoutez les travaux du marché ci-dessous.</div>}
          {canEdit && (<div className="grid md:grid-cols-5 gap-2 mt-2 items-end">
            <div className="md:col-span-2"><label className="text-xs" style={{ color: "#8A8370" }}>Désignation des travaux</label><input list="bt-dl-ligne" value={fl.label} onChange={(e) => setFl({ ...fl, label: e.target.value })} data-testid="bt-lg-label" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Unité</label><input list="bt-dl-unite" value={fl.unit} onChange={(e) => setFl({ ...fl, unit: e.target.value })} data-testid="bt-lg-unite" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Quantité</label><input type="number" min="0" step="0.01" value={fl.qty} onChange={(e) => setFl({ ...fl, qty: e.target.value })} data-testid="bt-lg-qte" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Prix unitaire (gourdes)</label><input type="number" min="0" value={fl.pu} onChange={(e) => setFl({ ...fl, pu: e.target.value })} data-testid="bt-lg-pu" className={ecInput + " tabular"} style={ecBorder} /></div>
          </div>)}
          {canEdit && <button onClick={() => ajouterLigne(s)} className="mt-2 px-3 py-2 rounded text-sm" style={ecBtn} data-testid="bt-lg-ajouter">Ajouter la ligne</button>}
          <div className="display text-base mb-2 mt-5" style={{ color: "#152238" }}>Avance de démarrage</div>
          <div className="text-sm mb-2" style={{ color: "#5B563F" }}>Reçue : <b className="tabular" data-testid="bt-avance-recue">{fmt(avanceTotale(s))}</b> · récupérée sur les situations : <b className="tabular" data-testid="bt-avance-recup">{fmt(avanceRecuperee(s.id))}</b> · reste à récupérer : <b className="tabular">{fmt(btR2(avanceTotale(s) - avanceRecuperee(s.id)))}</b></div>
          {(s.avances || []).length > 0 && (<div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Date</th><th>Mode</th><th className="text-right">Montant</th><th>État</th><th></th></tr></thead>
            <tbody>{s.avances.map((a) => (<tr key={a.id} data-testid="bt-avance-ligne" style={{ opacity: a.status === "annulé" ? 0.55 : 1 }}><td className="py-1.5">{ecDateFr(a.date)}</td><td>{a.mode === "banque" ? "Banque" : "Espèces"}</td><td className="text-right tabular">{fmt(a.amount)}</td><td>{a.status === "annulé" ? ecPastille("Annulée", "neutre") : ecPastille("Reçue", "ok")}</td><td className="text-right">{canEdit && a.status !== "annulé" && <button onClick={() => annulerAvance(s, a)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-avance-annuler">Annuler</button>}</td></tr>))}</tbody></table></div>)}
          {canEdit && (<div className="grid md:grid-cols-4 gap-2 mt-2 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant de l'avance</label><input type="number" min="0" value={fav.amount} onChange={(e) => setFav({ ...fav, amount: e.target.value })} data-testid="bt-avance-montant" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Mode</label><select value={fav.mode} onChange={(e) => setFav({ ...fav, mode: e.target.value })} className={ecInput} style={ecBorder}><option value="caisse">Espèces</option><option value="banque">Banque</option></select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={fav.date} max={todayStr()} onChange={(e) => setFav({ ...fav, date: e.target.value })} className={ecInput} style={ecBorder} /></div>
            <button onClick={() => recevoirAvance(s)} className="px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-avance-valider">Enregistrer l'avance</button>
          </div>)}
          <div className="display text-base mb-2 mt-5" style={{ color: "#152238" }}>Retenue de garantie</div>
          <div className="text-sm mb-2" style={{ color: "#5B563F" }}>Retenue à libérer : <b className="tabular" data-testid="bt-retenue-due">{fmt(retenueDue(s.id))}</b> (taux de {s.retPct || 0} % sur chaque situation ; elle se libère à la réception du chantier)</div>
          {rels.filter((r) => r.siteId === s.id).length > 0 && (<div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Date</th><th>Mode</th><th className="text-right">Montant</th><th>État</th><th></th></tr></thead>
            <tbody>{rels.filter((r) => r.siteId === s.id).map((r) => (<tr key={r.id} data-testid="bt-retrel-ligne" style={{ opacity: r.status === "annulé" ? 0.55 : 1 }}><td className="py-1.5">{ecDateFr(r.date)}</td><td>{r.mode === "banque" ? "Banque" : "Espèces"}</td><td className="text-right tabular">{fmt(r.amount)}</td><td>{r.status === "annulé" ? ecPastille("Annulé", "neutre") : ecPastille("Encaissée", "ok")}</td><td className="text-right">{canEdit && r.status !== "annulé" && <button onClick={() => annulerLiberation(r)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-retrel-annuler">Annuler</button>}</td></tr>))}</tbody></table></div>)}
          {canEdit && retenueDue(s.id) > 0.004 && (<div className="grid md:grid-cols-4 gap-2 mt-2 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant reçu (vide = tout)</label><input type="number" min="0" value={frt.amount} onChange={(e) => setFrt({ ...frt, amount: e.target.value })} data-testid="bt-retrel-montant" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Mode</label><select value={frt.mode} onChange={(e) => setFrt({ ...frt, mode: e.target.value })} className={ecInput} style={ecBorder}><option value="caisse">Espèces</option><option value="banque">Banque</option></select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={frt.date} max={todayStr()} onChange={(e) => setFrt({ ...frt, date: e.target.value })} className={ecInput} style={ecBorder} /></div>
            <button onClick={() => liberer(s)} className="px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-retrel-valider">Encaisser la retenue</button>
          </div>)}
        </div>)}
      </div>
    );
  };

  // ───────── Situations de travaux ─────────
  const [sd, setSd] = useState({ siteId: "", cum: {} });
  const [pp, setPp] = useBrouillon("btp-paiement", { amount: "", mode: "caisse", date: todayStr() });
  const [xq, setXq] = useState(""); const [xet, setXet] = useState(""); const [xd1, setXd1] = useState(""); const [xd2, setXd2] = useState("");
  const etatSit = (x) => (x.status === "annulee" ? "annulee" : btSolde(x).reste <= 0.004 ? "soldee" : "encaisser");
  const siteChoisi = sites.find((x) => x.id === sd.siteId);
  const prevQty = (site, l) => { const d = derniere(site.id); return d && d.cum ? Number(d.cum[l.id]) || 0 : 0; };
  const cumEff = (site) => { const o = {}; (site.lines || []).forEach((l) => { const v = sd.cum[l.id]; o[l.id] = v === undefined || v === "" ? prevQty(site, l) : Number(v) || 0; }); return o; };
  const emettreSituation = () => {
    if (!canFront) return;
    const site = siteChoisi;
    if (!site) { showToast("Choisissez le chantier."); return; }
    if (!(site.lines || []).length) { showToast("Ce chantier n'a pas encore de bordereau de prix."); return; }
    const cum = cumEff(site);
    for (const l of site.lines) {
      if (cum[l.id] > l.qty + 0.0001) { showToast("« " + l.label + " » : la quantité cumulée dépasse la quantité du marché (" + l.qty + ")."); return; }
      if (cum[l.id] < prevQty(site, l) - 0.0001) { showToast("« " + l.label + " » : la quantité cumulée ne peut pas être inférieure à la situation précédente (" + prevQty(site, l) + ")."); return; }
    }
    const c = calcSit(site, cum);
    if (!(c.ht > 0)) { showToast("Aucun avancement nouveau : augmentez la quantité cumulée d'au moins une ligne."); return; }
    if (!verifDate(today, "émettre cette situation")) return;
    const number = numero("DC", sits, today);
    const n = sits.filter((x) => x.siteId === site.id).reduce((m, x) => Math.max(m, x.n || 0), 0) + 1;
    btAjouterComptes(accounts, setAccounts, ["411", "706", ...(c.retenue > 0 ? ["4117"] : []), ...(c.recup > 0 ? ["4191"] : []), ...(c.tca > 0 ? ["445"] : [])]);
    const e = ecrire(today, "Situation n° " + n + " " + number + " — " + site.name + " (" + nomClient(site.clientId) + ")", [{ account: "411", debit: c.net, credit: 0 }, { account: "4117", debit: c.retenue, credit: 0 }, { account: "4191", debit: c.recup, credit: 0 }, { account: "706", debit: 0, credit: c.ht }, { account: "445", debit: 0, credit: c.tca }], number);
    const id = btId();
    const lignes = site.lines.map((l) => ({ id: l.id, label: l.label, unit: l.unit, qty: l.qty, pu: l.pu, prevQty: prevQty(site, l), cumQty: cum[l.id], montant: btR2(cum[l.id] * l.pu) }));
    ajouter({ type: "sit", id, number, n, date: today, siteId: site.id, clientId: site.clientId, cum, lignes, marche: btMarche(site), cumHt: c.cumHt, prevHt: c.prevHt, ht: c.ht, tcaRate: c.tca > 0 ? tcaRate : 0, tca: c.tca, ttc: c.ttc, retPct: Number(site.retPct) || 0, retenue: c.retenue, recup: c.recup, net: c.net, entryId: e.id, status: "emise", payments: [], createdAt: new Date().toISOString(), by: currentUserEmail || "" });
    setSd({ siteId: site.id, cum: {} }); setSelSit(id);
    showToast("Situation n° " + n + " émise : net à payer " + fmt(c.net) + "."); logAudit("BTP", "Situation émise", number + " — " + site.name + " — " + fmt(c.net));
  };
  const encaisser = (x) => {
    if (!canFront || x.status === "annulee") return;
    const amount = btR2(pp.amount);
    const s = btSolde(x);
    if (!(amount > 0)) { showToast("Indiquez un montant supérieur à zéro."); return; }
    if (amount > s.reste + 0.004) { showToast("Le montant dépasse le reste à payer (" + fmt(s.reste) + ")."); return; }
    if (!verifDate(pp.date, "enregistrer cet encaissement")) return;
    const cpt = compteMode(pp.mode === "banque" ? "banque" : "caisse");
    btAjouterComptes(accounts, setAccounts, [cpt, "411"]);
    const e = ecrire(pp.date, "Encaissement " + x.number + " — " + nomSite(x.siteId), [{ account: cpt, debit: amount, credit: 0 }, { account: "411", debit: 0, credit: amount }], x.id);
    maj(x.id, (r) => ({ ...r, payments: [...(r.payments || []), { id: btId(), date: pp.date, amount, mode: pp.mode, entryId: e.id, status: "valide", by: currentUserEmail || "" }] }));
    setPp({ ...pp, amount: "" }); showToast("Encaissement de " + fmt(amount) + " enregistré."); logAudit("BTP", "Situation encaissée", x.number + " — " + fmt(amount));
  };
  const annulerPaiement = (x, p) => {
    if (!canEdit || p.status === "annulé") return;
    if (!verifDate(today, "annuler cet encaissement")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler cet encaissement ? Une écriture inverse sera passée.")) return;
    const e = contre(p.entryId, "Annulation encaissement " + x.number + " (écriture inverse)", today, x.id);
    maj(x.id, (r) => ({ ...r, payments: r.payments.map((y) => (y.id === p.id ? { ...y, status: "annulé", reversalEntryId: e ? e.id : "" } : y)) }));
    showToast("Encaissement annulé.");
  };
  const annulerSituation = (x) => {
    if (!canEdit || x.status === "annulee") return;
    const last = derniere(x.siteId);
    if (!last || last.id !== x.id) { showToast("Seule la dernière situation du chantier peut être annulée : annulez d'abord les situations suivantes."); return; }
    if ((x.payments || []).some((p) => p.status !== "annulé")) { showToast("Annulez d'abord les encaissements de cette situation."); return; }
    if (rels.some((r) => r.siteId === x.siteId && r.status !== "annulé")) { showToast("Une retenue de garantie a déjà été encaissée sur ce chantier : annulez-la d'abord."); return; }
    if (!verifDate(today, "annuler cette situation")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler la situation " + x.number + " ? Une écriture inverse sera passée.")) return;
    const e = contre(x.entryId, "Annulation situation " + x.number + " (écriture inverse)", today, x.id);
    maj(x.id, (r) => ({ ...r, status: "annulee", reversalEntryId: e ? e.id : "" }));
    showToast("Situation annulée : le chantier revient à l'avancement précédent.");
  };
  const Situations = () => {
    const x = sits.find((y) => y.id === selSit);
    const xF = sits.filter((y) => (!xet || etatSit(y) === xet) && (!xd1 || y.date >= xd1) && (!xd2 || y.date <= xd2) && (!xq.trim() || [y.number, nomSite(y.siteId), nomClient(y.clientId)].join(" ").toLowerCase().includes(xq.trim().toLowerCase()))).sort((a, b) => String(b.number).localeCompare(String(a.number)));
    const xFA = xF.filter((y) => y.status !== "annulee");
    const ouverts = sites.filter((s) => s.status !== "termine");
    const cum = siteChoisi ? cumEff(siteChoisi) : {};
    const c = siteChoisi ? calcSit(siteChoisi, cum) : null;
    const erreurs = siteChoisi ? (siteChoisi.lines || []).flatMap((l) => (cum[l.id] > l.qty + 0.0001 ? ["« " + l.label + " » : la quantité cumulée dépasse celle du marché (" + l.qty + ")."] : cum[l.id] < prevQty(siteChoisi, l) - 0.0001 ? ["« " + l.label + " » : la quantité cumulée ne peut pas être inférieure à la situation précédente (" + prevQty(siteChoisi, l) + ")."] : [])) : [];
    return (
      <div>
        {canFront && (<div className="ec-card p-4 mb-5" data-testid="bt-situation-bloc"><div className="display text-base mb-2" style={{ color: "#152238" }}>Nouvelle situation de travaux</div>
          <div className="flex flex-wrap items-end gap-3 mb-2">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Chantier</label><select value={sd.siteId} onChange={(e) => setSd({ siteId: e.target.value, cum: {} })} data-testid="bt-sit-chantier" className={ecInput} style={ecBorder}><option value="">— choisir —</option>{ouverts.map((s) => <option key={s.id} value={s.id}>{s.number} — {s.name}</option>)}</select></div>
            <div className="text-sm" style={{ color: "#5B563F" }}>{siteChoisi ? <>Situation n° <b>{sits.filter((y) => y.siteId === siteChoisi.id).reduce((m, y) => Math.max(m, y.n || 0), 0) + 1}</b> · client {nomClient(siteChoisi.clientId)} · retenue {siteChoisi.retPct || 0} %</> : "Choisissez un chantier pour saisir l'avancement des travaux."}</div>
          </div>
          {siteChoisi && !(siteChoisi.lines || []).length && <div className="text-sm p-2 rounded" style={{ background: "#FFF6E0", color: "#152238" }} data-testid="bt-sit-sansligne">Ce chantier n'a pas de bordereau de prix : ouvrez-le dans l'onglet Chantiers et ajoutez les travaux du marché.</div>}
          {siteChoisi && (siteChoisi.lines || []).length > 0 && (<>
            <div className="text-xs mb-1" style={{ color: "#7A7460" }}>Saisissez, pour chaque ligne, la <b>quantité cumulée</b> réellement exécutée depuis le début du chantier (elle ne peut pas diminuer ni dépasser la quantité du marché).</div>
            <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Désignation</th><th>Unité</th><th className="text-right">Marché</th><th className="text-right">Prix unitaire</th><th className="text-right">Déjà exécuté</th><th className="text-right">Cumul à ce jour</th><th className="text-right">Montant cumulé</th></tr></thead>
              <tbody>{siteChoisi.lines.map((l) => (<tr key={l.id} data-testid="bt-sit-ligne"><td className="py-1.5">{l.label}</td><td>{l.unit || "—"}</td><td className="text-right tabular">{l.qty}</td><td className="text-right tabular">{fmt(l.pu)}</td><td className="text-right tabular">{prevQty(siteChoisi, l)}</td>
                <td className="text-right"><input type="number" min="0" step="0.01" value={sd.cum[l.id] === undefined ? String(prevQty(siteChoisi, l)) : sd.cum[l.id]} onChange={(e) => setSd({ ...sd, cum: { ...sd.cum, [l.id]: e.target.value } })} data-testid="bt-sit-cum" className="border rounded px-1 py-0.5 text-xs tabular" style={{ ...ecBorder, width: 90, background: "#fff" }} /></td><td className="text-right tabular">{fmt(btR2(cum[l.id] * l.pu))}</td></tr>))}</tbody></table></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm" style={{ color: "#152238" }} data-testid="bt-sit-calcul">
              <div>Cumul des travaux<div className="tabular font-semibold" data-testid="bt-sit-cumht">{fmt(c.cumHt)}</div></div>
              <div>Déjà facturé<div className="tabular font-semibold">{fmt(c.prevHt)}</div></div>
              <div>Cette situation (hors taxe)<div className="tabular font-semibold" data-testid="bt-sit-ht">{fmt(c.ht)}</div></div>
              <div>Taxe<div className="tabular font-semibold">{fmt(c.tca)}</div></div>
              <div>Retenue de garantie<div className="tabular font-semibold" data-testid="bt-sit-ret">− {fmt(c.retenue)}</div></div>
              <div>Avance récupérée<div className="tabular font-semibold" data-testid="bt-sit-recup">− {fmt(c.recup)}</div></div>
              <div className="md:col-span-2">Net à payer par le client<div className="tabular font-semibold text-lg" data-testid="bt-sit-net">{fmt(c.net)}</div></div>
            </div>
            {erreurs.length > 0 && <div className="text-sm mt-2 p-2 rounded" style={{ background: "#FBE9E5", color: "#A6432F" }} data-testid="bt-sit-erreur">{erreurs.map((m, i) => <div key={i}>{m}</div>)}</div>}
            {erreurs.length === 0 && !(c.ht > 0) && <div className="text-xs mt-2" style={{ color: "#7A7460" }} data-testid="bt-sit-aide">Augmentez la quantité cumulée d'au moins une ligne pour faire apparaître le montant de la situation.</div>}
            <button onClick={emettreSituation} disabled={!(c.ht > 0) || erreurs.length > 0} className="mt-3 px-3 py-2 rounded text-sm" style={{ ...ecBtnGold, opacity: c.ht > 0 && erreurs.length === 0 ? 1 : 0.5 }} data-testid="bt-sit-emettre">Émettre la situation</button>
          </>)}
          {canEdit && <label className="text-xs flex items-center gap-2 mt-3"><input type="checkbox" checked={tcaOn} onChange={(e) => { const on = e.target.checked; setBtp((prev) => [...(prev || []).filter((r) => !(r.type === "config")), { type: "config", id: "config", tcaOn: on }]); showToast(on ? "Taxe activée sur les prochaines situations (" + (Number(settings.taxRate) || 0) + " %, taux des Réglages)." : "Taxe désactivée."); }} data-testid="bt-tca" />Appliquer la taxe (TCA) sur les situations (taux des Réglages : {Number(settings.taxRate) || 0} %). À confirmer avec votre expert-comptable.</label>}
        </div>)}
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <div className="flex-1 min-w-[150px]"><label className="text-xs" style={{ color: "#8A8370" }}>Rechercher (n°, chantier, client)</label><input value={xq} onChange={(e) => setXq(e.target.value)} data-testid="bt-sit-recherche" className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>État</label><select value={xet} onChange={(e) => setXet(e.target.value)} data-testid="bt-sit-filtre-etat" className={ecInput} style={ecBorder}><option value="">Tous</option><option value="encaisser">À encaisser</option><option value="soldee">Soldée</option><option value="annulee">Annulée</option></select></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Du</label><input type="date" value={xd1} onChange={(e) => setXd1(e.target.value)} className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Au</label><input type="date" value={xd2} onChange={(e) => setXd2(e.target.value)} className={ecInput} style={ecBorder} /></div>
        </div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">N°</th><th>Date</th><th>Chantier</th><th className="text-right">Situation</th><th className="text-right">Travaux (HT)</th><th className="text-right">Net à payer</th><th className="text-right">Reste à payer</th><th>État</th><th></th></tr></thead>
          <tbody>{xF.map((y) => { const s = btSolde(y); return (<tr key={y.id} data-testid="bt-sit-ligne-liste" style={{ background: y.id === selSit ? "#E6F1EE" : undefined, opacity: y.status === "annulee" ? 0.55 : 1 }}><td className="py-1.5 tabular text-xs">{y.number}</td><td>{ecDateFr(y.date)}</td><td>{nomSite(y.siteId)}</td><td className="text-right tabular">n° {y.n}</td><td className="text-right tabular">{fmt(y.ht)}</td><td className="text-right tabular">{fmt(y.net)}</td><td className="text-right tabular">{y.status === "annulee" ? "—" : fmt(s.reste)}</td>
            <td>{etatSit(y) === "annulee" ? ecPastille("Annulée", "neutre") : etatSit(y) === "soldee" ? ecPastille("Soldée", "ok") : ecPastille("À encaisser", "attente")}</td>
            <td className="text-right whitespace-nowrap"><button onClick={() => setSelSit(y.id === selSit ? "" : y.id)} className="text-xs underline mr-3" data-testid="bt-sit-ouvrir">{y.id === selSit ? "Fermer" : "Ouvrir"}</button><button onClick={() => setImprimer({ kind: "situation", id: y.id })} className="text-xs underline" data-testid="bt-sit-imprimer">Imprimer</button></td></tr>); })}</tbody>
          {xF.length > 0 && <tfoot><tr style={{ fontWeight: 600, borderTop: "2px solid #152238" }} data-testid="bt-sit-total-ligne"><td colSpan={4}>Total ({xFA.length} situation{xFA.length > 1 ? "s" : ""}, hors annulées)</td><td className="text-right tabular" data-testid="bt-sit-tot-ht">{fmt(btR2(xFA.reduce((t, y) => t + y.ht, 0)))}</td><td className="text-right tabular" data-testid="bt-sit-tot-net">{fmt(btR2(xFA.reduce((t, y) => t + y.net, 0)))}</td><td className="text-right tabular" data-testid="bt-sit-tot-reste">{fmt(btR2(xFA.reduce((t, y) => t + btSolde(y).reste, 0)))}</td><td colSpan={2}></td></tr></tfoot>}</table></div>
        {xF.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>{sits.length === 0 ? "Aucune situation émise." : "Aucune situation ne correspond à ces filtres."}</div>}
        {x && (<div className="ec-card p-4 mt-5" data-testid="bt-sit-detail">
          <div className="display text-lg mb-2" style={{ color: "#152238" }}>{x.number} — situation n° {x.n} — {nomSite(x.siteId)}</div>
          <div className="text-sm mb-3" style={{ color: "#5B563F" }}>Travaux {fmt(x.ht)}{x.tca > 0 ? " + taxe " + fmt(x.tca) : ""} − retenue {fmt(x.retenue)} − avance récupérée {fmt(x.recup)} = net {fmt(x.net)} · payé {fmt(btSolde(x).paye)} · reste <b data-testid="bt-sit-reste">{fmt(btSolde(x).reste)}</b></div>
          <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Date</th><th>Mode</th><th className="text-right">Montant</th><th>État</th><th></th></tr></thead>
            <tbody>{(x.payments || []).map((p) => (<tr key={p.id} data-testid="bt-pay-ligne" style={{ opacity: p.status === "annulé" ? 0.55 : 1 }}><td className="py-1.5">{ecDateFr(p.date)}</td><td>{p.mode === "banque" ? "Banque" : "Espèces"}</td><td className="text-right tabular">{fmt(p.amount)}</td><td>{p.status === "annulé" ? ecPastille("Annulé", "neutre") : ecPastille("Valide", "ok")}</td><td className="text-right">{canEdit && p.status !== "annulé" && <button onClick={() => annulerPaiement(x, p)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-pay-annuler">Annuler</button>}</td></tr>))}</tbody></table></div>
          {canFront && x.status !== "annulee" && (<div className="grid md:grid-cols-4 gap-2 mt-3 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant reçu</label><input type="number" min="0" value={pp.amount} onChange={(e) => setPp({ ...pp, amount: e.target.value })} data-testid="bt-pay-montant" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Mode</label><select value={pp.mode} onChange={(e) => setPp({ ...pp, mode: e.target.value })} className={ecInput} style={ecBorder}><option value="caisse">Espèces</option><option value="banque">Banque</option></select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={pp.date} max={todayStr()} onChange={(e) => setPp({ ...pp, date: e.target.value })} className={ecInput} style={ecBorder} /></div>
            <button onClick={() => encaisser(x)} className="px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-pay-valider">Enregistrer l'encaissement</button>
          </div>)}
          {canEdit && x.status !== "annulee" && <button onClick={() => annulerSituation(x)} className="mt-3 text-xs underline" style={{ color: "#A6432F" }} data-testid="bt-sit-annuler">Annuler cette situation</button>}
        </div>)}
      </div>
    );
  };

  // ───────── Dépenses de chantier ─────────
  const [fd, setFd] = useBrouillon("btp-depense", { siteId: "", kind: "materiaux", date: todayStr(), supplier: "", label: "", amount: "", mode: "caisse" });
  const [rg, setRg] = useState({ amount: "", mode: "caisse", date: todayStr() });
  const [dq, setDq] = useState(""); const [dk, setDk] = useState(""); const [dv, setDv] = useState(""); const [de, setDe] = useState("");
  const enregistrerDepense = () => {
    if (!canEdit) return;
    const amount = btR2(fd.amount);
    if (!fd.siteId) { showToast("Choisissez le chantier."); return; }
    if (!(amount > 0)) { showToast("Indiquez le montant (en gourdes)."); return; }
    if (fd.mode === "apayer" && !fd.supplier.trim()) { showToast("Pour une dépense à payer plus tard, indiquez le fournisseur ou le sous-traitant."); return; }
    if (!verifDate(fd.date, "enregistrer cette dépense")) return;
    const def = BT_DEPENSES.find((x) => x[0] === fd.kind) || BT_DEPENSES[0];
    const compte = def[2], cpt = compteMode(fd.mode);
    const label = fd.label.trim() || def[1];
    btAjouterComptes(accounts, setAccounts, [compte, cpt]);
    const e = ecrire(fd.date, "Chantier " + nomSite(fd.siteId) + " — " + label + (fd.supplier.trim() ? " (" + fd.supplier.trim() + ")" : ""), [{ account: compte, debit: amount, credit: 0 }, { account: cpt, debit: 0, credit: amount }], fd.siteId);
    ajouter({ type: "dep", id: btId(), date: fd.date, siteId: fd.siteId, kind: fd.kind, supplier: fd.supplier.trim(), label, amount, mode: fd.mode, entryId: e.id, status: "valide", settlements: [], by: currentUserEmail || "" });
    setFd({ ...fd, supplier: "", label: "", amount: "" });
    showToast("Dépense enregistrée : " + fmt(amount) + "."); logAudit("BTP", "Dépense de chantier", nomSite(fd.siteId) + " — " + label + " — " + fmt(amount));
  };
  const annulerDepense = (d) => {
    if (!canEdit || d.status === "annulé") return;
    if ((d.settlements || []).some((x) => x.status !== "annulé")) { showToast("Annulez d'abord les règlements de cette dépense."); return; }
    if (!verifDate(today, "annuler cette dépense")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler cette dépense ? Une écriture inverse sera passée.")) return;
    const e = contre(d.entryId, "Annulation — " + nomSite(d.siteId) + " — " + d.label + " (écriture inverse)", today, d.siteId);
    maj(d.id, (r) => ({ ...r, status: "annulé", reversalEntryId: e ? e.id : "" }));
    showToast("Dépense annulée.");
  };
  const reglerDepense = (d) => {
    if (!canEdit || d.mode !== "apayer" || d.status === "annulé") return;
    const reste = btResteDep(d);
    const amount = rg.amount === "" ? reste : btR2(rg.amount);
    if (!(amount > 0) || amount > reste + 0.004) { showToast("Le montant doit être compris entre 0 et le reste à payer (" + fmt(reste) + ")."); return; }
    if (!verifDate(rg.date, "enregistrer ce règlement")) return;
    const cpt = compteMode(rg.mode === "banque" ? "banque" : "caisse");
    btAjouterComptes(accounts, setAccounts, [cpt, "401"]);
    const e = ecrire(rg.date, "Règlement " + (d.supplier || "fournisseur") + " — " + nomSite(d.siteId) + " — " + d.label, [{ account: "401", debit: amount, credit: 0 }, { account: cpt, debit: 0, credit: amount }], d.id);
    maj(d.id, (r) => ({ ...r, settlements: [...(r.settlements || []), { id: btId(), date: rg.date, amount, mode: rg.mode, entryId: e.id, status: "valide" }] }));
    setRg({ ...rg, amount: "" }); showToast("Règlement de " + fmt(amount) + " enregistré."); logAudit("BTP", "Dette réglée", (d.supplier || "") + " — " + fmt(amount));
  };
  const annulerReglement = (d, s) => {
    if (!canEdit || s.status === "annulé") return;
    if (!verifDate(today, "annuler ce règlement")) return;
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Annuler ce règlement ? Une écriture inverse sera passée.")) return;
    const e = contre(s.entryId, "Annulation règlement " + (d.supplier || "") + " (écriture inverse)", today, d.id);
    maj(d.id, (r) => ({ ...r, settlements: r.settlements.map((x) => (x.id === s.id ? { ...x, status: "annulé", reversalEntryId: e ? e.id : "" } : x)) }));
    showToast("Règlement annulé.");
  };
  const Depenses = () => {
    const d = deps.find((x) => x.id === selDep);
    const etatDep = (x) => (x.status === "annulé" ? "annule" : btResteDep(x) > 0.004 ? "apayer" : "valide");
    const dF = deps.filter((x) => (!dk || x.kind === dk) && (!dv || x.siteId === dv) && (!de || etatDep(x) === de) && (!dq.trim() || [x.label, x.supplier, nomSite(x.siteId)].join(" ").toLowerCase().includes(dq.trim().toLowerCase()))).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const dFA = dF.filter((x) => x.status !== "annulé");
    return (
      <div>
        {canEdit && (<div className="ec-card p-4 mb-5" data-testid="bt-nouvelle-depense"><div className="display text-base mb-2" style={{ color: "#152238" }}>Nouvelle dépense de chantier</div>
          <div className="grid md:grid-cols-4 gap-2 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Chantier</label><select value={fd.siteId} onChange={(e) => setFd({ ...fd, siteId: e.target.value })} data-testid="bt-dep-chantier" className={ecInput} style={ecBorder}><option value="">— choisir —</option>{sites.map((s) => <option key={s.id} value={s.id}>{s.number} — {s.name}</option>)}</select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Nature</label><select value={fd.kind} onChange={(e) => setFd({ ...fd, kind: e.target.value })} data-testid="bt-dep-nature" className={ecInput} style={ecBorder}>{BT_DEPENSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={fd.date} max={todayStr()} onChange={(e) => setFd({ ...fd, date: e.target.value })} data-testid="bt-dep-date" className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Payé par</label><select value={fd.mode} onChange={(e) => setFd({ ...fd, mode: e.target.value })} data-testid="bt-dep-mode" className={ecInput} style={ecBorder}><option value="caisse">Caisse</option><option value="banque">Banque</option><option value="apayer">À payer plus tard (dette)</option></select></div>
          </div>
          <div className="grid md:grid-cols-4 gap-2 items-end mt-2">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Fournisseur ou sous-traitant</label><input list="bt-dl-tiers" value={fd.supplier} onChange={(e) => setFd({ ...fd, supplier: e.target.value })} data-testid="bt-dep-tiers" className={ecInput} style={ecBorder} /></div>
            <div className="md:col-span-2"><label className="text-xs" style={{ color: "#8A8370" }}>Détail (facultatif)</label><input value={fd.label} onChange={(e) => setFd({ ...fd, label: e.target.value })} className={ecInput} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant (gourdes)</label><input type="number" min="0" value={fd.amount} onChange={(e) => setFd({ ...fd, amount: e.target.value })} data-testid="bt-dep-montant" className={ecInput + " tabular"} style={ecBorder} /></div>
          </div>
          <button onClick={enregistrerDepense} className="mt-2 px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-dep-valider">Enregistrer la dépense</button></div>)}
        <div className="flex flex-wrap gap-2 items-end mb-2">
          <div className="flex-1 min-w-[150px]"><label className="text-xs" style={{ color: "#8A8370" }}>Rechercher (détail, fournisseur, chantier)</label><input value={dq} onChange={(e) => setDq(e.target.value)} data-testid="bt-dep-recherche" className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Nature</label><select value={dk} onChange={(e) => setDk(e.target.value)} data-testid="bt-dep-filtre-nature" className={ecInput} style={ecBorder}><option value="">Toutes</option>{BT_DEPENSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Chantier</label><select value={dv} onChange={(e) => setDv(e.target.value)} className={ecInput} style={ecBorder}><option value="">Tous</option>{sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>État</label><select value={de} onChange={(e) => setDe(e.target.value)} data-testid="bt-dep-filtre-etat" className={ecInput} style={ecBorder}><option value="">Tous</option><option value="valide">Payée</option><option value="apayer">À payer</option><option value="annule">Annulée</option></select></div>
        </div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Date</th><th>Chantier</th><th>Nature</th><th>Fournisseur / détail</th><th className="text-right">Montant</th><th className="text-right">Reste à payer</th><th>État</th><th></th></tr></thead>
          <tbody>{dF.map((x) => (<tr key={x.id} data-testid="bt-dep-ligne" style={{ background: x.id === selDep ? "#E6F1EE" : undefined, opacity: x.status === "annulé" ? 0.55 : 1 }}><td className="py-1.5">{ecDateFr(x.date)}</td><td>{nomSite(x.siteId)}</td><td className="text-xs">{(BT_DEPENSES.find((k) => k[0] === x.kind) || [0, x.kind])[1]}</td><td className="text-xs">{x.supplier ? x.supplier + " — " : ""}{x.label}</td><td className="text-right tabular">{fmt(x.amount)}</td><td className="text-right tabular">{fmt(btResteDep(x))}</td>
            <td>{etatDep(x) === "annule" ? ecPastille("Annulée", "neutre") : etatDep(x) === "apayer" ? ecPastille("À payer", "attente") : ecPastille("Payée", "ok")}</td>
            <td className="text-right whitespace-nowrap">{x.mode === "apayer" && x.status !== "annulé" && <button onClick={() => setSelDep(x.id === selDep ? "" : x.id)} className="text-xs underline mr-2" data-testid="bt-dep-ouvrir">{x.id === selDep ? "Fermer" : "Règlements"}</button>}{canEdit && x.status !== "annulé" && <button onClick={() => annulerDepense(x)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-dep-annuler">Annuler</button>}</td></tr>))}</tbody>
          {dF.length > 0 && <tfoot><tr style={{ fontWeight: 600, borderTop: "2px solid #152238" }} data-testid="bt-dep-total-ligne"><td colSpan={4}>Total ({dFA.length}, hors annulées)</td><td className="text-right tabular" data-testid="bt-dep-tot">{fmt(btR2(dFA.reduce((t, x) => t + x.amount, 0)))}</td><td className="text-right tabular" data-testid="bt-dep-tot-reste">{fmt(btR2(dFA.reduce((t, x) => t + btResteDep(x), 0)))}</td><td colSpan={2}></td></tr></tfoot>}</table></div>
        {dF.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>{deps.length === 0 ? "Aucune dépense." : "Aucune dépense ne correspond à ces filtres."}</div>}
        {d && (<div className="ec-card p-4 mt-5" data-testid="bt-dep-detail">
          <div className="display text-base mb-2" style={{ color: "#152238" }}>{d.supplier || "Fournisseur"} — {d.label} — {fmt(d.amount)}</div>
          <div className="text-sm mb-2" style={{ color: "#5B563F" }}>Reste à payer : <b className="tabular" data-testid="bt-dep-reste">{fmt(btResteDep(d))}</b></div>
          {(d.settlements || []).length > 0 && (<div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Date</th><th>Mode</th><th className="text-right">Montant</th><th>État</th><th></th></tr></thead>
            <tbody>{d.settlements.map((s) => (<tr key={s.id} data-testid="bt-regl-ligne" style={{ opacity: s.status === "annulé" ? 0.55 : 1 }}><td className="py-1.5">{ecDateFr(s.date)}</td><td>{s.mode === "banque" ? "Banque" : "Espèces"}</td><td className="text-right tabular">{fmt(s.amount)}</td><td>{s.status === "annulé" ? ecPastille("Annulé", "neutre") : ecPastille("Réglé", "ok")}</td><td className="text-right">{canEdit && s.status !== "annulé" && <button onClick={() => annulerReglement(d, s)} className="text-xs" style={{ color: "#A6432F" }} data-testid="bt-regl-annuler">Annuler</button>}</td></tr>))}</tbody></table></div>)}
          {canEdit && btResteDep(d) > 0.004 && (<div className="grid md:grid-cols-4 gap-2 mt-2 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant payé (vide = tout)</label><input type="number" min="0" value={rg.amount} onChange={(e) => setRg({ ...rg, amount: e.target.value })} data-testid="bt-regl-montant" className={ecInput + " tabular"} style={ecBorder} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Mode</label><select value={rg.mode} onChange={(e) => setRg({ ...rg, mode: e.target.value })} className={ecInput} style={ecBorder}><option value="caisse">Espèces</option><option value="banque">Banque</option></select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={rg.date} max={todayStr()} onChange={(e) => setRg({ ...rg, date: e.target.value })} className={ecInput} style={ecBorder} /></div>
            <button onClick={() => reglerDepense(d)} className="px-3 py-2 rounded text-sm" style={ecBtnGold} data-testid="bt-regl-valider">Enregistrer le règlement</button>
          </div>)}
        </div>)}
      </div>
    );
  };

  // ───────── Documents imprimables (A4) ─────────
  const entete = (titre) => (
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      {settings.companyLogo && <img src={settings.companyLogo} alt="" style={{ width: 60, height: 60, objectFit: "contain", margin: "0 auto 6px", display: "block" }} />}
      <div style={{ fontWeight: 700, fontSize: 20 }}>{settings.companyName || "Entreprise de construction"}</div>
      {settings.companyAddress && <div style={{ fontSize: 12 }}>{settings.companyAddress}</div>}
      {settings.companyPhone && <div style={{ fontSize: 12 }}>{settings.companyPhone}</div>}
      {settings.companyNIF && <div style={{ fontSize: 12 }}>NIF : {settings.companyNIF}</div>}
      <div style={{ fontWeight: 700, fontSize: 18, marginTop: 10 }}>{titre}</div>
    </div>
  );
  const cellule = { padding: "4px 6px", border: "1px solid #bbb" };
  const DevisSheet = ({ s }) => (
    <div style={{ color: "#152238", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 12, width: "100%", maxWidth: 794, margin: "0 auto", padding: "32px 36px", boxSizing: "border-box" }} data-testid="bt-devis-feuille">
      {entete("DEVIS ESTIMATIF — BORDEREAU DE PRIX")}
      <div style={{ marginBottom: 4 }}>Chantier : <b>{s.name}</b> ({s.number}){s.address ? " — " + s.address : ""}</div>
      <div style={{ marginBottom: 10 }}>Client : <b>{nomClient(s.clientId)}</b> · établi le {ecDateFr(today)}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}><thead><tr style={{ background: "#F4F1E6" }}><th style={{ ...cellule, textAlign: "left" }}>Désignation</th><th style={cellule}>Unité</th><th style={{ ...cellule, textAlign: "right" }}>Quantité</th><th style={{ ...cellule, textAlign: "right" }}>Prix unitaire</th><th style={{ ...cellule, textAlign: "right" }}>Montant</th></tr></thead>
        <tbody>{(s.lines || []).map((l) => (<tr key={l.id}><td style={cellule}>{l.label}</td><td style={{ ...cellule, textAlign: "center" }}>{l.unit}</td><td style={{ ...cellule, textAlign: "right" }}>{l.qty}</td><td style={{ ...cellule, textAlign: "right" }}>{fmt(l.pu)}</td><td style={{ ...cellule, textAlign: "right" }}>{fmt(btR2(l.qty * l.pu))}</td></tr>))}</tbody></table>
      <div style={{ textAlign: "right", fontWeight: 700, fontSize: 15 }}>Total hors taxe : {fmt(btMarche(s))}</div>
      {tcaRate > 0 && <div style={{ textAlign: "right" }}>Taxe ({tcaRate} %) : {fmt(btR2(btMarche(s) * tcaRate / 100))} · Total toutes taxes : {fmt(btR2(btMarche(s) * (1 + tcaRate / 100)))}</div>}
      {Number(s.retPct) > 0 && <div style={{ fontSize: 11, marginTop: 6 }}>Retenue de garantie prévue : {s.retPct} % de chaque situation.</div>}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 40 }}>
        <div style={{ flex: 1, borderTop: "1px solid #152238", paddingTop: 4, textAlign: "center", fontSize: 12 }}>Pour l'entreprise</div>
        <div style={{ flex: 1, borderTop: "1px solid #152238", paddingTop: 4, textAlign: "center", fontSize: 12 }}>Bon pour accord du client (date et signature)</div>
      </div>
    </div>
  );
  const SituationSheet = ({ x }) => {
    const s = btSolde(x);
    const ligne = (a, b, bold) => <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontWeight: bold ? 700 : 400, fontSize: bold ? 15 : 12 }}><span>{a}</span><span className="tabular">{b}</span></div>;
    return (
      <div style={{ color: "#152238", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 12, width: "100%", maxWidth: 794, margin: "0 auto", padding: "32px 36px", boxSizing: "border-box" }} data-testid="bt-situation-feuille">
        {entete("SITUATION DE TRAVAUX N° " + x.n + (x.status === "annulee" ? " — ANNULÉE" : ""))}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Décompte <b>{x.number}</b></span><span>Établi le {ecDateFr(x.date)}</span></div>
        <div style={{ marginBottom: 4 }}>Chantier : <b>{nomSite(x.siteId)}</b></div>
        <div style={{ marginBottom: 10 }}>Client : <b>{nomClient(x.clientId)}</b></div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}><thead><tr style={{ background: "#F4F1E6" }}><th style={{ ...cellule, textAlign: "left" }}>Désignation</th><th style={cellule}>Unité</th><th style={{ ...cellule, textAlign: "right" }}>Marché</th><th style={{ ...cellule, textAlign: "right" }}>P.U.</th><th style={{ ...cellule, textAlign: "right" }}>Précédent</th><th style={{ ...cellule, textAlign: "right" }}>Cumul</th><th style={{ ...cellule, textAlign: "right" }}>Montant cumulé</th></tr></thead>
          <tbody>{(x.lignes || []).map((l) => (<tr key={l.id}><td style={cellule}>{l.label}</td><td style={{ ...cellule, textAlign: "center" }}>{l.unit}</td><td style={{ ...cellule, textAlign: "right" }}>{l.qty}</td><td style={{ ...cellule, textAlign: "right" }}>{fmt(l.pu)}</td><td style={{ ...cellule, textAlign: "right" }}>{l.prevQty}</td><td style={{ ...cellule, textAlign: "right" }}>{l.cumQty}</td><td style={{ ...cellule, textAlign: "right" }}>{fmt(l.montant)}</td></tr>))}</tbody></table>
        <div style={{ maxWidth: 380, marginLeft: "auto", borderTop: "1px dashed #152238", paddingTop: 6 }}>
          {ligne("Cumul des travaux exécutés", fmt(x.cumHt))}
          {ligne("Déjà facturé (situations précédentes)", "− " + fmt(x.prevHt))}
          {ligne("Travaux de cette situation (hors taxe)", fmt(x.ht))}
          {x.tca > 0 && ligne("Taxe (" + x.tcaRate + " %)", fmt(x.tca))}
          {x.retenue > 0 && ligne("Retenue de garantie (" + x.retPct + " %)", "− " + fmt(x.retenue))}
          {x.recup > 0 && ligne("Avance de démarrage récupérée", "− " + fmt(x.recup))}
          {ligne("NET À PAYER", fmt(x.net), true)}
          {s.paye > 0 && <div style={{ marginTop: 4 }}>Déjà payé : <span className="tabular">{fmt(s.paye)}</span> — reste : <span className="tabular">{fmt(s.reste)}</span></div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 40 }}>
          <div style={{ flex: 1, borderTop: "1px solid #152238", paddingTop: 4, textAlign: "center", fontSize: 12 }}>L'entreprise</div>
          <div style={{ flex: 1, borderTop: "1px solid #152238", paddingTop: 4, textAlign: "center", fontSize: 12 }}>Vu et accepté par le client ou son représentant</div>
        </div>
      </div>
    );
  };

  // ───────── Tableau de bord ─────────
  const Apercu = () => {
    const sA = sits.filter((x) => x.status !== "annulee");
    const mois = today.slice(0, 7);
    const factMois = btR2(sA.filter((x) => String(x.date).startsWith(mois)).reduce((t, x) => t + x.ht, 0));
    const encMois = btR2(sA.flatMap((x) => x.payments || []).filter((p) => p.status !== "annulé" && String(p.date).startsWith(mois)).reduce((t, p) => t + p.amount, 0));
    const depMois = btR2(deps.filter((x) => x.status !== "annulé" && String(x.date).startsWith(mois)).reduce((t, x) => t + x.amount, 0));
    const dus = btR2(sA.reduce((t, x) => t + btSolde(x).reste, 0));
    const enCours = sites.filter((s) => s.status === "encours");
    const marcheCours = btR2(enCours.reduce((t, s) => t + btMarche(s), 0));
    const retenues = btR2(sites.reduce((t, s) => t + retenueDue(s.id), 0));
    const dettes = btR2(deps.reduce((t, d) => t + btResteDep(d), 0));
    const afaire = [];
    sA.filter((x) => btSolde(x).reste > 0.004 && btJours(x.date, today) > 30).forEach((x) => afaire.push({ tab: "situations", sel: x.id, nom: nomClient(x.clientId), txt: "Situation " + x.number + " (" + nomSite(x.siteId) + ") impayée depuis " + btJours(x.date, today) + " jours : reste " + fmt(btSolde(x).reste) }));
    sites.filter((s) => (s.status === "encours" || s.status === "preparation") && s.end && s.end < today).forEach((s) => afaire.push({ tab: "chantiers", sel: s.id, nom: s.name, txt: "Fin prévue le " + ecDateFr(s.end) + " dépassée (" + btJours(s.end, today) + " jours) : chantier toujours ouvert" }));
    sites.filter((s) => s.budget > 0 && depensesDe(s.id) > s.budget).forEach((s) => afaire.push({ tab: "chantiers", sel: s.id, nom: s.name, txt: "Dépenses " + fmt(depensesDe(s.id)) + " au-dessus du budget de " + fmt(s.budget) }));
    sites.filter((s) => s.status === "encours" && depensesDe(s.id) > 0 && !derniere(s.id)).forEach((s) => afaire.push({ tab: "situations", nom: s.name, txt: "Dépenses engagées (" + fmt(depensesDe(s.id)) + ") mais aucune situation encore émise" }));
    sites.filter((s) => s.status === "termine" && retenueDue(s.id) > 0.004).forEach((s) => afaire.push({ tab: "chantiers", sel: s.id, nom: s.name, txt: "Chantier terminé : retenue de garantie de " + fmt(retenueDue(s.id)) + " à réclamer au client" }));
    deps.filter((d) => btResteDep(d) > 0.004 && btJours(d.date, today) > 30).forEach((d) => afaire.push({ tab: "depenses", sel: d.id, nom: d.supplier || nomSite(d.siteId), txt: "Dette de " + fmt(btResteDep(d)) + " à régler depuis " + btJours(d.date, today) + " jours (" + d.label + ")" }));
    const etapes = [
      ["Clients", "Enregistrez vos clients (maîtres d'ouvrage) : nom, téléphone, adresse.", "clients", clients.length > 0],
      ["Premier chantier", "Créez le chantier : client, adresse, dates, pourcentage de retenue de garantie prévu au marché.", "chantiers", sites.length > 0],
      ["Bordereau de prix", "Dans le chantier, ajoutez les travaux : désignation, unité, quantité, prix unitaire ; imprimez le devis.", "chantiers", sites.some((s) => (s.lines || []).length > 0)],
      ["Avance de démarrage", "Si le client verse une avance, enregistrez-la (étape facultative) : elle sera récupérée au fil des situations.", "chantiers", sites.some((s) => avancesDe(s).length > 0)],
      ["Dépenses", "Enregistrez matériaux, main-d'œuvre, sous-traitance, engins : chaque dépense est rattachée à son chantier.", "depenses", deps.length > 0],
      ["Première situation", "Saisissez les quantités cumulées exécutées : le net à payer (retenue et avance déduites) se calcule seul ; imprimez la situation.", "situations", sits.length > 0],
      ["Premier encaissement", "Ouvrez la situation et enregistrez le paiement du client : la comptabilité se fait automatiquement.", "situations", sA.some((x) => (x.payments || []).some((p) => p.status !== "annulé"))],
    ];
    const toutFait = etapes.every((e) => e[3]);
    const kpis = [["Chantiers en cours", String(enCours.length), "bt-kpi-encours"], ["Marchés en cours (HT)", fmt(marcheCours), "bt-kpi-marches"], ["Travaux facturés ce mois (HT)", fmt(factMois), "bt-kpi-fact"], ["Encaissé ce mois", fmt(encMois), "bt-kpi-encaisse"], ["À recevoir des clients", fmt(dus), "bt-kpi-dus"], ["Retenues de garantie à libérer", fmt(retenues), "bt-kpi-retenues"], ["Dépenses ce mois", fmt(depMois), "bt-kpi-depenses"], ["Dettes fournisseurs", fmt(dettes), "bt-kpi-dettes"]];
    return (
      <div>
        {!toutFait && (<div className="ec-card p-4 mb-5" data-testid="bt-guide">
          <div className="display text-base mb-2" style={{ color: "#152238" }}>Pour démarrer, en 7 étapes</div>
          <ol className="text-sm" style={{ color: "#152238", listStyle: "none", paddingLeft: 0 }}>{etapes.map(([t, d, tb, fait], i) => (<li key={i} data-testid="bt-etape" className="mb-1.5 flex flex-wrap gap-2 items-baseline"><span style={{ color: fait ? "#0F6B5C" : "#8A8370", fontWeight: 700 }}>{fait ? "✓" : (i + 1) + "."}</span><span><b>{t}</b> — <span style={{ color: "#5B563F" }}>{d}</span></span>{!fait && !(isVendeur && (tb === "chantiers" || tb === "depenses")) && <button className="text-xs underline" data-testid="bt-etape-ouvrir" onClick={() => setTab(tb)}>Ouvrir</button>}</li>))}</ol>
        </div>)}
        {sites.length === 0 && <div className="p-4 rounded text-sm mb-4" style={{ background: "#FFF6E0", color: "#152238" }} data-testid="bt-vide">Pour commencer : enregistrez vos <b>clients</b>, créez un <b>chantier</b> avec son bordereau de prix, puis suivez les <b>dépenses</b> et émettez les <b>situations de travaux</b>.</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {kpis.map(([l, v, t]) => (<div key={t} className="ec-kpi"><div className="text-xs" style={{ color: "#8A8370" }}>{l}</div><div className="display text-lg tabular" data-testid={t} style={{ color: "#152238" }}>{v}</div></div>))}
        </div>
        <div className="display text-base mb-2" style={{ color: "#152238" }}>À faire <span className="text-xs" style={{ color: "#8A8370", fontWeight: 400 }}>({afaire.length})</span></div>
        <div style={{ display: "none" }} data-testid="bt-kpi-afaire">{afaire.length}</div>
        {afaire.length === 0 ? <div className="text-sm mb-5" style={{ color: "#8A8370" }}>Rien en attente.</div> : (
          <div className="ec-wrap mb-5"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Concerné</th><th>À faire</th><th></th></tr></thead>
            <tbody>{afaire.slice(0, 15).map((x, i) => (<tr key={i} data-testid="bt-afaire-ligne"><td className="py-1.5">{x.nom}</td><td>{x.txt}</td><td className="text-right"><button className="text-xs underline" data-testid="bt-afaire-ouvrir" onClick={() => { if (isVendeur && (x.tab === "chantiers" || x.tab === "depenses")) return; setTab(x.tab); if (x.sel && x.tab === "chantiers") setSelSite(x.sel); if (x.sel && x.tab === "situations") setSelSit(x.sel); if (x.sel && x.tab === "depenses") setSelDep(x.sel); }}>Ouvrir</button></td></tr>))}</tbody></table></div>
        )}
        <div className="display text-base mb-2" style={{ color: "#152238" }}>Chantiers en cours</div>
        {enCours.length === 0 ? <div className="text-sm" style={{ color: "#8A8370" }}>Aucun chantier en cours.</div> : (
          <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Chantier</th><th>Client</th><th className="text-right">Marché</th><th className="text-right">Avancement facturé</th><th>Fin prévue</th></tr></thead>
            <tbody>{enCours.map((s) => { const m = btMarche(s); return (<tr key={s.id} data-testid="bt-encours-ligne"><td className="py-1.5">{s.name}</td><td>{nomClient(s.clientId)}</td><td className="text-right tabular">{fmt(m)}</td><td className="text-right tabular">{m > 0 ? Math.round(factureHt(s.id) * 100 / m) : 0} %</td><td>{s.end ? ecDateFr(s.end) : "—"}</td></tr>); })}</tbody></table></div>
        )}
      </div>
    );
  };

  // ───────── Rapports ─────────
  const [rd, setRd] = useState(""); const [rf, setRf] = useState("");
  const Rapports = () => {
    const dansP = (d) => (!rd || d >= rd) && (!rf || d <= rf);
    const sP = sits.filter((x) => x.status !== "annulee" && dansP(x.date));
    const dP = deps.filter((x) => x.status !== "annulé" && dansP(x.date));
    const S = (arr, f) => btR2(arr.reduce((t, x) => t + f(x), 0));
    const tf = { fontWeight: 600, borderTop: "2px solid #152238" };
    const parSite = sites.map((s) => { const mine = sP.filter((x) => x.siteId === s.id); const fact = S(mine, (x) => x.ht); const enc = S(mine, (x) => btSolde(x).paye); const dep = S(dP.filter((d) => d.siteId === s.id), (d) => d.amount); const m = btMarche(s); return { s, marche: m, avanc: m > 0 ? Math.round(factureHt(s.id) * 100 / m) : 0, fact, enc, dep, marge: btR2(fact - dep), reste: btR2(m - factureHt(s.id)), ret: retenueDue(s.id) }; });
    const impayes = clients.map((c) => { const mine = sP.filter((x) => x.clientId === c.id && btSolde(x).reste > 0.004); const age = (x) => btJours(x.date, today); return { c, n: mine.length, b0: S(mine.filter((x) => age(x) <= 30), (x) => btSolde(x).reste), b1: S(mine.filter((x) => age(x) > 30 && age(x) <= 60), (x) => btSolde(x).reste), b2: S(mine.filter((x) => age(x) > 60), (x) => btSolde(x).reste), reste: S(mine, (x) => btSolde(x).reste) }; }).filter((x) => x.reste > 0.004);
    const parNature = BT_DEPENSES.map(([k, l]) => ({ l, n: dP.filter((x) => x.kind === k).length, m: S(dP.filter((x) => x.kind === k), (x) => x.amount) })).filter((x) => x.n > 0);
    const dettes = deps.filter((d) => btResteDep(d) > 0.004);
    const parTiers = {}; dettes.forEach((d) => { const k = d.supplier || "—"; parTiers[k] = btR2((parTiers[k] || 0) + btResteDep(d)); });
    const lignesTiers = Object.keys(parTiers).sort().map((k) => ({ k, m: parTiers[k] }));
    const exporterSite = () => ecTelecharger("rentabilite-chantiers-" + today + ".csv", [["Chantier", "Marché HT", "Avancement facturé %", "Facturé HT", "Encaissé", "Dépenses", "Marge", "Reste à facturer", "Retenue à libérer"], ...parSite.map((x) => [x.s.name, x.marche, x.avanc, x.fact, x.enc, x.dep, x.marge, x.reste, x.ret]), ["Total", S(parSite, (x) => x.marche), "", S(parSite, (x) => x.fact), S(parSite, (x) => x.enc), S(parSite, (x) => x.dep), S(parSite, (x) => x.marge), S(parSite, (x) => x.reste), S(parSite, (x) => x.ret)]]);
    const exporterImp = () => ecTelecharger("situations-impayees-" + today + ".csv", [["Client", "Situations", "0 à 30 j", "31 à 60 j", "Plus de 60 j", "Reste à payer"], ...impayes.map((x) => [x.c.name, x.n, x.b0, x.b1, x.b2, x.reste]), ["Total", S(impayes, (x) => x.n), S(impayes, (x) => x.b0), S(impayes, (x) => x.b1), S(impayes, (x) => x.b2), S(impayes, (x) => x.reste)]]);
    return (
      <div>
        <div className="flex flex-wrap gap-2 items-end mb-4">
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Du</label><input type="date" value={rd} onChange={(e) => setRd(e.target.value)} data-testid="bt-rapport-du" className={ecInput} style={ecBorder} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Au</label><input type="date" value={rf} onChange={(e) => setRf(e.target.value)} data-testid="bt-rapport-au" className={ecInput} style={ecBorder} /></div>
          {(rd || rf) && <button className="text-xs underline" onClick={() => { setRd(""); setRf(""); }}>Tout afficher</button>}
          <div className="text-xs" style={{ color: "#7A7460" }}>Le filtre porte sur la date des situations et des dépenses ; marché, avancement, reste à facturer et retenue sont toujours à ce jour.</div>
        </div>
        <div className="flex items-center justify-between mb-2"><div className="display text-base" style={{ color: "#152238" }}>Rentabilité par chantier</div><button onClick={exporterSite} className="text-xs underline" data-testid="bt-rapport-export-ch">Exporter</button></div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Chantier</th><th className="text-right">Marché (HT)</th><th className="text-right">Avancement</th><th className="text-right">Facturé (HT)</th><th className="text-right">Encaissé</th><th className="text-right">Dépenses</th><th className="text-right">Marge</th><th className="text-right">Reste à facturer</th><th className="text-right">Retenue à libérer</th></tr></thead>
          <tbody>{parSite.map((x) => (<tr key={x.s.id} data-testid="bt-rapport-ch"><td className="py-1.5">{x.s.name}</td><td className="text-right tabular">{fmt(x.marche)}</td><td className="text-right tabular">{x.avanc} %</td><td className="text-right tabular">{fmt(x.fact)}</td><td className="text-right tabular">{fmt(x.enc)}</td><td className="text-right tabular">{fmt(x.dep)}</td><td className="text-right tabular">{fmt(x.marge)}</td><td className="text-right tabular">{fmt(x.reste)}</td><td className="text-right tabular">{fmt(x.ret)}</td></tr>))}</tbody>
          {parSite.length > 0 && <tfoot><tr style={tf} data-testid="bt-rapport-ch-total"><td>Total</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-marche">{fmt(S(parSite, (x) => x.marche))}</td><td></td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-fact">{fmt(S(parSite, (x) => x.fact))}</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-enc">{fmt(S(parSite, (x) => x.enc))}</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-dep">{fmt(S(parSite, (x) => x.dep))}</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-marge">{fmt(S(parSite, (x) => x.marge))}</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-reste">{fmt(S(parSite, (x) => x.reste))}</td><td className="text-right tabular" data-testid="bt-rapport-ch-tot-ret">{fmt(S(parSite, (x) => x.ret))}</td></tr></tfoot>}</table></div>
        <div className="flex items-center justify-between mb-2 mt-5"><div className="display text-base" style={{ color: "#152238" }}>Situations impayées par client (ancienneté)</div><button onClick={exporterImp} className="text-xs underline" data-testid="bt-rapport-export-imp">Exporter</button></div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Client</th><th className="text-right">Situations</th><th className="text-right">0 à 30 j</th><th className="text-right">31 à 60 j</th><th className="text-right">Plus de 60 j</th><th className="text-right">Reste à payer</th></tr></thead>
          <tbody>{impayes.map((x) => (<tr key={x.c.id} data-testid="bt-rapport-imp"><td className="py-1.5">{x.c.name}</td><td className="text-right tabular">{x.n}</td><td className="text-right tabular">{fmt(x.b0)}</td><td className="text-right tabular">{fmt(x.b1)}</td><td className="text-right tabular">{fmt(x.b2)}</td><td className="text-right tabular">{fmt(x.reste)}</td></tr>))}</tbody>
          {impayes.length > 0 && <tfoot><tr style={tf} data-testid="bt-rapport-imp-total"><td>Total</td><td className="text-right tabular">{S(impayes, (x) => x.n)}</td><td className="text-right tabular">{fmt(S(impayes, (x) => x.b0))}</td><td className="text-right tabular">{fmt(S(impayes, (x) => x.b1))}</td><td className="text-right tabular">{fmt(S(impayes, (x) => x.b2))}</td><td className="text-right tabular" data-testid="bt-rapport-imp-tot-reste">{fmt(S(impayes, (x) => x.reste))}</td></tr></tfoot>}</table></div>
        {impayes.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>Aucune situation impayée sur cette période.</div>}
        <div className="display text-base mb-2 mt-5" style={{ color: "#152238" }}>Dépenses par nature</div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Nature</th><th className="text-right">Opérations</th><th className="text-right">Montant</th></tr></thead>
          <tbody>{parNature.map((x) => (<tr key={x.l} data-testid="bt-rapport-nature"><td className="py-1.5">{x.l}</td><td className="text-right tabular">{x.n}</td><td className="text-right tabular">{fmt(x.m)}</td></tr>))}</tbody>
          {parNature.length > 0 && <tfoot><tr style={tf}><td>Total</td><td className="text-right tabular">{S(parNature, (x) => x.n)}</td><td className="text-right tabular" data-testid="bt-rapport-nature-tot">{fmt(S(parNature, (x) => x.m))}</td></tr></tfoot>}</table></div>
        <div className="display text-base mb-2 mt-5" style={{ color: "#152238" }}>Dettes envers les fournisseurs et sous-traitants (à ce jour)</div>
        <div className="ec-wrap"><table className="ec-table"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">Fournisseur / sous-traitant</th><th className="text-right">Reste à payer</th></tr></thead>
          <tbody>{lignesTiers.map((x) => (<tr key={x.k} data-testid="bt-rapport-dette"><td className="py-1.5">{x.k}</td><td className="text-right tabular">{fmt(x.m)}</td></tr>))}</tbody>
          {lignesTiers.length > 0 && <tfoot><tr style={tf}><td>Total</td><td className="text-right tabular" data-testid="bt-rapport-dette-tot">{fmt(S(lignesTiers, (x) => x.m))}</td></tr></tfoot>}</table></div>
        {lignesTiers.length === 0 && <div className="text-sm" style={{ color: "#8A8370" }}>Aucune dette en cours.</div>}
      </div>
    );
  };

  // ───────── Statistiques ─────────
  const Stats = () => {
    const sA = sits.filter((x) => x.status !== "annulee");
    const dA = deps.filter((x) => x.status !== "annulé");
    const fT = btR2(sA.reduce((t, x) => t + x.ht, 0));
    const depT = btR2(dA.reduce((t, x) => t + x.amount, 0));
    const encT = btR2(sA.reduce((t, x) => t + btSolde(x).paye, 0));
    const mois = statMois(6, today);
    const data = mois.map((m) => ({ mois: m.label, ca: statSomme(sA, "date", m.key, (x) => x.ht), dep: statSomme(dA, "date", m.key, (x) => x.amount) }));
    const parSite = {}; sA.forEach((x) => { const k = nomSite(x.siteId); parSite[k] = btR2((parSite[k] || 0) + x.ht); });
    const depSite = {}; dA.forEach((x) => { const k = nomSite(x.siteId); depSite[k] = btR2((depSite[k] || 0) + x.amount); });
    const parNat = {}; dA.forEach((x) => { const k = (BT_DEPENSES.find((d) => d[0] === x.kind) || [0, x.kind])[1]; parNat[k] = btR2((parNat[k] || 0) + x.amount); });
    const parEtat = {}; sites.forEach((s) => { const k = (BT_ETATS.find((e) => e[0] === s.status) || [0, s.status])[1]; parEtat[k] = (parEtat[k] || 0) + 1; });
    const parCli = {}; sA.forEach((x) => { const r = btSolde(x).reste; if (r > 0.004) { const k = nomClient(x.clientId); parCli[k] = btR2((parCli[k] || 0) + r); } });
    return <StatsBloc
      vide={sites.length + sits.length === 0 ? "Aucun chantier pour le moment : les statistiques apparaîtront avec vos premières situations et dépenses." : ""}
      kpis={[["Travaux facturés (hors taxe)", fmt(fT), "bt-stat-fact"], ["Encaissé", fmt(encT), "bt-stat-enc"], ["Dépenses de chantier", fmt(depT), "bt-stat-dep"], ["Marge", fmt(btR2(fT - depT)), "bt-stat-marge"]]}
      evolution={{ titre: "Travaux facturés et dépenses — 6 derniers mois", data, series: [{ key: "ca", name: "Travaux facturés", color: "#0F6B5C" }, { key: "dep", name: "Dépenses", color: "#9A7B1E" }] }}
      repartitions={[{ titre: "Travaux facturés par chantier", data: Object.keys(parSite).map((k) => ({ name: k, value: parSite[k] })) }, { titre: "Dépenses par chantier", data: Object.keys(depSite).map((k) => ({ name: k, value: depSite[k] })) }, { titre: "Dépenses par nature", data: Object.keys(parNat).map((k) => ({ name: k, value: parNat[k] })) }, { titre: "Chantiers par état", unite: "nombre", data: Object.keys(parEtat).map((k) => ({ name: k, value: parEtat[k] })) }, { titre: "Situations impayées par client", data: Object.keys(parCli).map((k) => ({ name: k, value: parCli[k] })) }]} />;
  };

  const tabs = isVendeur
    ? [["apercu", "Tableau de bord"], ["clients", "Clients"], ["situations", "Situations"]]
    : [["apercu", "Tableau de bord"], ["chantiers", "Chantiers"], ["clients", "Clients"], ["situations", "Situations"], ["depenses", "Dépenses"], ["rapports", "Rapports"], ["stats", "Statistiques"]];
  const imprDoc = (() => {
    if (!imprimer) return null;
    if (imprimer.kind === "devis") { const s = sites.find((x) => x.id === imprimer.id); return s ? { titre: "Devis " + s.number, node: <DevisSheet s={s} /> } : null; }
    const x = sits.find((y) => y.id === imprimer.id);
    return x ? { titre: "Situation " + x.number, node: <SituationSheet x={x} /> } : null;
  })();
  return (
    <>
      {listes}
      <div className={"p-4 md:p-8 max-w-6xl" + (imprDoc ? " no-print" : "")} data-testid="btp-module">
        <style>{EC_CSS + '[data-testid="btp-module"] .display.text-base{border-left:3px solid #C9A24B;padding-left:10px;margin-bottom:12px}[data-testid="btp-module"] input,[data-testid="btp-module"] select{background:#fff}'}</style>
        <div className="mb-4"><div className="display text-2xl" style={{ color: "#152238" }}>BTP et construction</div><div className="text-xs" style={{ color: "#8A8370" }}>Chantiers, bordereaux de prix, situations de travaux, retenues de garantie, dépenses et rentabilité par chantier</div></div>
        {!canFront && <div className="text-xs mb-3 p-2 rounded" style={{ background: "#F4F1E6", color: "#5B563F" }}>Consultation seule : votre rôle ne permet pas de modifier les données.</div>}
        {isVendeur && <div className="text-xs mb-3 p-2 rounded" style={{ background: "#F4F1E6", color: "#5B563F" }} data-testid="bt-secretariat-note">Secrétariat : vous pouvez enregistrer les clients, émettre les situations de travaux, encaisser et imprimer. Chantiers, dépenses, annulations et rapports sont réservés au responsable.</div>}
        <div className="ec-tabs">
          {tabs.map(([id, l]) => (<button key={id} onClick={() => setTab(id)} data-testid={"bt-tab-" + id} className="px-3 py-2 text-sm rounded-lg transition-colors" style={{ background: tab === id ? "#152238" : "transparent", color: tab === id ? "#EFE9DD" : "#6B6552", fontWeight: tab === id ? 600 : 500 }}>{l}</button>))}
        </div>
        {tab === "apercu" && Apercu()}
        {tab === "chantiers" && !isVendeur && Chantiers()}
        {tab === "clients" && Clients()}
        {tab === "situations" && Situations()}
        {tab === "depenses" && !isVendeur && Depenses()}
        {tab === "rapports" && !isVendeur && Rapports()}
        {tab === "stats" && !isVendeur && Stats()}
      </div>
      {imprDoc && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-3 md:p-8 no-print" style={{ background: "rgba(21,34,56,0.55)" }} onClick={() => setImprimer(null)} data-testid="bt-apercu">
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 820 }}>
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap"><div className="text-sm" style={{ color: "#EFE9DD" }}>{imprDoc.titre}</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { try { window.print(); } catch (e) {} }} className="px-3 py-1.5 rounded text-sm" style={ecBtnGold} data-testid="bt-imprimer-ok">Imprimer / enregistrer en PDF</button>
                <button onClick={() => setImprimer(null)} className="px-3 py-1.5 rounded text-sm" style={ecBtn} data-testid="bt-apercu-fermer">Fermer</button></div></div>
            <div className="rounded shadow-lg overflow-auto" style={{ background: "#fff" }}>{imprDoc.node}</div>
          </div>
        </div>
      )}
      {imprDoc && <div className="print-only">{imprDoc.node}</div>}
    </>
  );
}
