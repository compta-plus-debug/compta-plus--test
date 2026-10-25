// ═══ MODULE ═══
// @module Facturation abonnements
// @depends FALLBACK_HTG_PER_USD, SECTEURS_CATALOGUE, fetchHtgPerUsd, friendlyError, supabase, todayStr
//   useEffect, useState
// @exports BillingAdminPanel
// ═══ FIN DE L'EN-TÊTE ═══
// Facturation des abonnements de Compta+ à ses clients.
//  • À la création d'une entreprise : facture d'inscription à 0 (émise par la base, voir le script SQL) ;
//  • chaque mois : facture du forfait + suppléments de blocs, émise par le Super admin (bouton « Émettre les factures du mois ») ;
//  • première facture payante : prorata du mois en cours à la fin de l'essai ;
//  • changement en cours de mois : facture complémentaire au prorata des jours (une baisse s'applique au mois suivant) ;
//  • prix en dollars, facture établie en gourdes au taux affiché ; TCA en option (taux modifiable).
// Une facture n'est jamais effacée : elle s'annule avec un motif.

const FB_PRIX_DEFAUT = { standard: 20, assisted: 80, group: 350, pack: 12, A: 8, B: 5, C: 3 };
const FB_GRILLE_DEFAUT = { ecoles: "A", import_export: "A", industrie: "A", sante: "B", ong: "B", btp: "C", immobilier: "C", restauration: "C", transport: "C", agriculture: "C" };
const FB_DELAI_JOURS = 15; // une facture non payée après 15 jours est « en retard » (rappel)
const fbR2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const fbPad = (n) => String(n).padStart(2, "0");
const fbDateFr = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || "")); return m ? m[3] + "/" + m[2] + "/" + m[1] : String(iso || ""); };
const fbHtg = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " G";
const fbUsd = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
const fbAjouteJours = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + fbPad(d.getMonth() + 1) + "-" + fbPad(d.getDate()); };
const fbEntreJours = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
const fbTier = (t) => (t === "assisted" ? "assisted" : t === "group" ? "group" : "standard");
const fbConfig = (row) => {
  const r = row || {};
  return {
    issuer_name: r.issuer_name || "Compta+", issuer_address: r.issuer_address || "", issuer_phone: r.issuer_phone || "", issuer_email: r.issuer_email || "", issuer_nif: r.issuer_nif || "",
    logo: r.logo || "", thanks: r.thanks || "Merci de votre confiance !", payment_info: r.payment_info || "",
    vat_enabled: !!r.vat_enabled, vat_rate: r.vat_rate != null ? Number(r.vat_rate) : 10, rate_htg_per_usd: Number(r.rate_htg_per_usd) || 0,
    prices: { ...FB_PRIX_DEFAUT, ...(r.prices || {}) }, grid: { ...FB_GRILLE_DEFAUT, ...(r.grid || {}) },
  };
};
// Mois qui contient la date : début, fin, nombre de jours
function fbPeriode(dateIso) {
  const [y, m] = String(dateIso).split("-").map(Number);
  const jours = new Date(y, m, 0).getDate();
  return { start: y + "-" + fbPad(m) + "-01", end: y + "-" + fbPad(m) + "-" + fbPad(jours), jours };
}
// Lignes d'un mois complet pour une entreprise (ou un groupe) : forfait + suppléments de blocs
function fbLignes(entity, cfg) {
  const P = cfg.prices, tier = fbTier(entity.plan_tier);
  const base = { standard: ["Forfait Standard — abonnement mensuel", P.standard], assisted: ["Forfait Assisté — abonnement mensuel", P.assisted], group: ["Forfait Extension (jusqu'à 5 entreprises) — abonnement mensuel", P.group] }[tier];
  const lines = [{ label: base[0], qty: 1, unit_usd: fbR2(base[1]), total_usd: fbR2(base[1]) }];
  if (tier === "standard") {
    if (entity.sector_pack) lines.push({ label: "Pack 3 secteurs d'activité", qty: 1, unit_usd: fbR2(P.pack), total_usd: fbR2(P.pack) });
    else (entity.extra_blocks || []).forEach((id) => {
      const lab = ((typeof SECTEURS_CATALOGUE !== "undefined" ? SECTEURS_CATALOGUE : []).find((s) => s.id === id) || {}).label || id;
      const prix = fbR2(P[cfg.grid[id] || "C"]);
      lines.push({ label: "Bloc « " + lab + " »", qty: 1, unit_usd: prix, total_usd: prix });
    });
  }
  return { lines, full: fbR2(lines.reduce((s, l) => s + l.total_usd, 0)) };
}
// Totaux : sous-total en dollars, converti en gourdes au taux affiché, TCA optionnelle sur le sous-total en gourdes
function fbCalcTotaux(lines, rate, vatEnabled, vatRate) {
  const subUsd = fbR2(lines.reduce((s, l) => s + (Number(l.total_usd) || 0), 0));
  const subHtg = fbR2(subUsd * (Number(rate) || 0));
  const vatHtg = vatEnabled ? fbR2(subHtg * (Number(vatRate) || 0) / 100) : 0;
  return { subtotal_usd: subUsd, subtotal_htg: subHtg, vat_htg: vatHtg, total_htg: fbR2(subHtg + vatHtg) };
}
function fbBrouillon({ company_id, client_name, kind, period, issue_date, lines, full, rate, vatEnabled, vatRate }) {
  const t = fbCalcTotaux(lines, rate, vatEnabled, vatRate);
  return { company_id, client_name, kind, period_start: period.start, period_end: period.end, issue_date, due_date: fbAjouteJours(issue_date, FB_DELAI_JOURS), status: "emise", lines,
    subtotal_usd: t.subtotal_usd, monthly_full_usd: full, rate_htg_per_usd: rate, subtotal_htg: t.subtotal_htg, vat_enabled: !!vatEnabled, vat_rate: vatEnabled ? Number(vatRate) || 0 : 0, vat_htg: t.vat_htg, total_htg: t.total_htg };
}
// Texte ajouté à la ligne du forfait Extension : nom du groupe et entreprises couvertes
function fbNoteGroupe(g, membres) { return " — groupe « " + g.name + " » : " + (membres || []).map((m) => m.name).join(", "); }
// Émission du mois. Renvoie { drafts, inscriptions } : les factures mensuelles à créer et les factures d'inscription (à 0) manquantes.
function fbEmission({ companies, groups, invoices, cfg, date, rate, vatEnabled, vatRate }) {
  const per = fbPeriode(date);
  const actives = (invoices || []).filter((i) => i.status !== "annulee");
  const dejaMensuelle = (cid) => actives.some((i) => i.company_id === cid && i.kind === "mensuelle" && i.period_end === per.end);
  const drafts = [];
  const mensuelle = (co, entity, nom, note) => {
    if (dejaMensuelle(co.id)) return;
    const { lines, full } = fbLignes(entity, cfg);
    let ls = lines, from = per.start;
    if (note) ls = lines.map((l, i) => (i === 0 ? { ...l, label: l.label + note } : l));
    // première facture payante : prorata à partir de la fin de l'essai quand elle tombe dans le mois
    const fin = co.trial_ends_at ? String(co.trial_ends_at).slice(0, 10) : "";
    if (fin && fin >= per.start && fin <= per.end) from = fbAjouteJours(fin, 1);
    if (from > per.end) return; // essai jusqu'à la fin du mois : première facture le mois suivant
    if (from > per.start) {
      const restant = fbEntreJours(from, per.end) + 1;
      ls = lines.map((l) => { const t = fbR2(l.total_usd * restant / per.jours); return { ...l, label: l.label + " (prorata " + restant + "/" + per.jours + " jours)", unit_usd: t, total_usd: t }; });
    }
    drafts.push(fbBrouillon({ company_id: co.id, client_name: nom || co.name, kind: "mensuelle", period: { start: from, end: per.end }, issue_date: date, lines: ls, full, rate, vatEnabled, vatRate }));
    drafts[drafts.length - 1].period_start = from;
  };
  const groupIds = new Set((groups || []).map((g) => g.id));
  (groups || []).filter((g) => g.plan_status === "active").forEach((g) => {
    const membres = (companies || []).filter((c) => c.group_id === g.id).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    // Facturée à l'entreprise principale du groupe (la plus ancienne) : son propre nom, jamais celui d'une autre entreprise ; le groupe et les entreprises couvertes sont rappelés sur la ligne
    if (membres.length) mensuelle({ ...membres[0], trial_ends_at: null }, { plan_tier: "group" }, membres[0].name, fbNoteGroupe(g, membres));
  });
  (companies || []).filter((c) => c.plan_status === "active" && !(c.group_id && groupIds.has(c.group_id)) && !c.group_id).forEach((c) => mensuelle(c, c, c.name));
  const inscriptions = (companies || []).filter((c) => !c.group_id && !actives.some((i) => i.company_id === c.id && i.kind === "inscription")).map((c) => {
    const fin = c.trial_ends_at ? String(c.trial_ends_at).slice(0, 10) : date;
    return { company_id: c.id, client_name: c.name, kind: "inscription", period_start: String(c.created_at || date).slice(0, 10), period_end: fin, issue_date: String(c.created_at || date).slice(0, 10), due_date: null, status: "gratuite",
      lines: [{ label: "Inscription — période d'essai gratuite jusqu'au " + fbDateFr(fin), qty: 1, unit_usd: 0, total_usd: 0 }], subtotal_usd: 0, monthly_full_usd: null, rate_htg_per_usd: rate, subtotal_htg: 0, vat_enabled: false, vat_rate: 0, vat_htg: 0, total_htg: 0 };
  });
  return { drafts, inscriptions };
}
// Facture complémentaire : hausse du forfait ou des blocs en cours de mois, au prorata des jours restants
function fbComplement({ company, group, invoices, cfg, date, rate, vatEnabled, vatRate, membres }) {
  const per = fbPeriode(date);
  const entity = group ? { plan_tier: "group" } : company;
  const nom = company.name;   // toujours le nom de l'entreprise à laquelle la facture est rattachée
  const liste = (invoices || []).filter((i) => i.status !== "annulee" && i.company_id === company.id && (i.kind === "mensuelle" || i.kind === "complement") && String(i.issue_date).slice(0, 7) === per.start.slice(0, 7))
    .sort((a, b) => String(a.number).localeCompare(String(b.number)));
  if (!liste.length) return { error: "Aucune facture mensuelle pour ce mois : utilisez d'abord « Émettre les factures du mois »." };
  const dernier = liste[liste.length - 1];
  const { full } = fbLignes(entity, cfg);
  const ecart = fbR2(full - (Number(dernier.monthly_full_usd) || 0));
  if (ecart <= 0) return { error: "Aucune hausse à facturer : une baisse s'applique au mois suivant (pas d'avoir)." };
  const restant = fbEntreJours(date, per.end) + 1;
  const total = fbR2(ecart * restant / per.jours);
  const lines = [{ label: "Changement d'abonnement" + (group ? " du groupe « " + group.name + " »" : "") + " : + " + fbUsd(ecart) + " par mois, du " + fbDateFr(date) + " au " + fbDateFr(per.end) + " (" + restant + "/" + per.jours + " jours)", qty: 1, unit_usd: total, total_usd: total }];
  return { draft: { ...fbBrouillon({ company_id: company.id, client_name: nom, kind: "complement", period: { start: date, end: per.end }, issue_date: date, lines, full, rate, vatEnabled, vatRate }) } };
}

// ───────── Numérotation : la base attribue FA-AAAA-000001 ; repli local si la fonction n'est pas disponible ─────────
async function fbNumero(date, local) {
  try {
    const { data, error } = await supabase.rpc("billing_next_number", { p_date: date });
    if (!error && typeof data === "string" && data) return data;
  } catch (e) { /* repli */ }
  const yy = String(date).slice(0, 4);
  local.n = Math.max(local.n, ...(local.list || []).filter((i) => String(i.number).startsWith("FA-" + yy + "-")).map((i) => Number(String(i.number).split("-")[2]) || 0)) + 1;
  return "FA-" + yy + "-" + String(local.n).padStart(6, "0");
}

// ───────── Feuille de facture imprimable : du logo au mot de remerciement ─────────
function FbFeuille({ inv, cfg }) {
  const statutNote = inv.status === "annulee" ? "ANNULÉE" : inv.status === "payee" ? "PAYÉE" : inv.status === "gratuite" ? "GRATUITE — période d'essai" : "";
  return (
    <div style={{ color: "#152238", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, width: "100%", maxWidth: 794, margin: "0 auto", padding: "32px 36px", boxSizing: "border-box" }} data-testid="fb-feuille">
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        {cfg.logo ? <img src={cfg.logo} alt="" style={{ maxWidth: 120, maxHeight: 70, objectFit: "contain", margin: "0 auto 6px", display: "block" }} /> : null}
        <div style={{ fontWeight: 700, fontSize: 20 }}>{cfg.issuer_name}</div>
        {cfg.issuer_address && <div style={{ fontSize: 12 }}>{cfg.issuer_address}</div>}
        {(cfg.issuer_phone || cfg.issuer_email) && <div style={{ fontSize: 12 }}>{[cfg.issuer_phone, cfg.issuer_email].filter(Boolean).join(" · ")}</div>}
        {cfg.issuer_nif && <div style={{ fontSize: 12 }}>NIF : {cfg.issuer_nif}</div>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 18, textAlign: "center", marginBottom: 4 }}>FACTURE</div>
      {statutNote && <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 6 }}>{statutNote}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div>N° <b data-testid="fb-feuille-numero">{inv.number}</b><br />Date : {fbDateFr(inv.issue_date)}{inv.due_date ? <><br />À payer avant le : {fbDateFr(inv.due_date)}</> : null}</div>
        <div style={{ textAlign: "right" }}>Facturé à :<br /><b>{inv.client_name}</b>{inv.period_start ? <><br />Période : du {fbDateFr(inv.period_start)} au {fbDateFr(inv.period_end)}</> : null}</div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <thead><tr style={{ borderBottom: "1px solid #152238", textAlign: "left" }}><th style={{ padding: "4px 0" }}>Désignation</th><th style={{ textAlign: "right" }}>Quantité</th><th style={{ textAlign: "right" }}>Prix unitaire</th><th style={{ textAlign: "right" }}>Montant</th></tr></thead>
        <tbody>{(inv.lines || []).map((l, i) => (<tr key={i} style={{ borderBottom: "1px dashed #BBB" }}><td style={{ padding: "5px 0" }}>{l.label}</td><td style={{ textAlign: "right" }}>{l.qty}</td><td style={{ textAlign: "right" }}>{fbUsd(l.unit_usd)}</td><td style={{ textAlign: "right" }}>{fbUsd(l.total_usd)}</td></tr>))}</tbody>
      </table>
      <div style={{ textAlign: "right", lineHeight: 1.7 }}>
        <div>Sous-total : {fbUsd(inv.subtotal_usd)}</div>
        <div>Taux de conversion : 1 USD = {fbHtg(inv.rate_htg_per_usd)}</div>
        <div>Sous-total en gourdes : {fbHtg(inv.subtotal_htg)}</div>
        {inv.vat_enabled && <div>TCA ({inv.vat_rate} %) : {fbHtg(inv.vat_htg)}</div>}
        <div style={{ fontWeight: 700, fontSize: 18 }}>Total à payer : <span data-testid="fb-feuille-total">{fbHtg(inv.total_htg)}</span></div>
      </div>
      {inv.status === "payee" && <div style={{ marginTop: 8 }}>Payée le {fbDateFr(inv.paid_at)}{inv.payment_method ? " — " + inv.payment_method : ""}{inv.payment_ref ? " (réf. " + inv.payment_ref + ")" : ""}.</div>}
      {cfg.payment_info && inv.status === "emise" && <div style={{ marginTop: 12, fontSize: 12, whiteSpace: "pre-line" }}><b>Comment payer :</b><br />{cfg.payment_info}</div>}
      <div style={{ marginTop: 16, textAlign: "center", fontSize: 13 }}>{cfg.thanks}</div>
    </div>
  );
}
function FbApercu({ inv, cfg, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-3 md:p-8 no-print" style={{ background: "rgba(21,34,56,0.55)" }} onClick={onClose} data-testid="fb-apercu">
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 820 }}>
          <div className="flex items-center justify-between mb-2"><div className="text-sm" style={{ color: "#EFE9DD" }}>Facture {inv.number}</div>
            <div className="flex gap-2"><button onClick={() => { try { window.print(); } catch (e) {} }} className="px-3 py-1.5 rounded text-sm" style={{ background: "#C9A24B", color: "#152238", fontWeight: 600 }} data-testid="fb-imprimer">Imprimer</button><button onClick={onClose} className="px-3 py-1.5 rounded text-sm" style={{ background: "#1F3358", color: "#EFE9DD" }}>Fermer</button></div></div>
          <div className="rounded shadow-lg overflow-hidden" style={{ background: "#fff" }}><FbFeuille inv={inv} cfg={cfg} /></div>
        </div>
      </div>
      <div className="print-only"><FbFeuille inv={inv} cfg={cfg} /></div>
    </>
  );
}
const fbEtat = (inv, today) => (inv.status === "annulee" ? ["Annulée", "#8A8370"] : inv.status === "payee" ? ["Payée", "#0F6B5C"] : inv.status === "gratuite" ? ["Gratuite", "#3F4F73"] : inv.due_date && inv.due_date < today ? ["En retard", "#A6432F"] : ["À payer", "#9A7B1E"]);
const fbCell = { border: "1px solid #DDD6C4", borderRadius: 6, padding: "4px 8px", width: "100%", background: "#fff" };
const fbBtn = { background: "#152238", color: "#EFE9DD", borderRadius: 6, padding: "6px 12px", fontSize: 13 };
const fbBtnOr = { background: "#C9A24B", color: "#152238", borderRadius: 6, padding: "6px 12px", fontSize: 13, fontWeight: 600 };

async function fbChargerConfig() {
  try { const { data } = await supabase.from("billing_settings").select("*").eq("id", 1).maybeSingle(); return fbConfig(data); } catch (e) { return fbConfig(null); }
}

// ───────── Écran client : « Abonnement et factures » (administrateur de l'entreprise) ─────────
function BillingClientPanel({ companyId }) {
  const [rows, setRows] = useState(null);
  const [cfg, setCfg] = useState(fbConfig(null));
  const [voir, setVoir] = useState(null);
  const today = todayStr();
  useEffect(() => {
    let vivant = true;
    (async () => {
      const c = await fbChargerConfig();
      const { data, error } = await supabase.from("billing_invoices").select("*").eq("company_id", companyId).order("issue_date", { ascending: false });
      if (!vivant) return;
      setCfg(c); setRows(error ? [] : (data || []).slice().sort((a, b) => String(b.number).localeCompare(String(a.number))));
    })();
    return () => { vivant = false; };
  }, [companyId]);
  if (rows === null) return <div className="text-sm" style={{ color: "#8A8370" }}>Chargement…</div>;
  const dues = rows.filter((i) => i.status === "emise");
  const enRetard = dues.filter((i) => i.due_date && i.due_date < today);
  return (
    <div className="max-w-4xl" style={{ width: "100%", boxSizing: "border-box", minWidth: 0 }} data-testid="fb-client">
      <div className="display text-xl mb-1" style={{ color: "#152238" }}>Abonnement et factures</div>
      <div className="text-xs mb-4" style={{ color: "#8A8370" }}>Vos factures Compta+ : inscription (gratuite pendant l'essai), puis une facture par mois selon votre forfait et vos blocs d'activité. Montants en gourdes au taux indiqué sur chaque facture.</div>
      {enRetard.length > 0 && <div className="p-3 rounded text-sm mb-3" style={{ background: "#F7E9E3", color: "#A6432F" }} data-testid="fb-client-retard">{enRetard.length} facture(s) en retard de paiement. Merci de régulariser.</div>}
      {rows.length === 0 ? <div className="text-sm" style={{ color: "#8A8370" }} data-testid="fb-client-vide">Aucune facture pour le moment.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{rows.map((i) => { const [l, c] = fbEtat(i, today); return (
          <div key={i.id || i.number} data-testid="fb-client-ligne" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 16px", border: "1px solid #E4DFD1", borderRadius: 8, padding: "10px 12px", background: "#fff", boxSizing: "border-box", maxWidth: "100%" }}>
            <div style={{ flex: "1 1 150px", minWidth: 0 }}><div className="text-xs tabular" style={{ color: "#8A8370" }}>{i.number}</div><div className="text-sm">{fbDateFr(i.issue_date)}</div></div>
            <div style={{ flex: "1 1 190px", minWidth: 0 }} className="text-xs"><span style={{ color: "#8A8370" }}>Période</span><br />{i.period_start ? fbDateFr(i.period_start) + " → " + fbDateFr(i.period_end) : "—"}</div>
            <div style={{ flex: "1 1 110px", minWidth: 0, textAlign: "right" }} className="tabular"><b>{fbHtg(i.total_htg)}</b><div className="text-xs" style={{ color: c, fontWeight: 600 }}>{l}</div></div>
            <div style={{ flex: "0 0 auto" }}><button onClick={() => setVoir(i)} className="text-xs underline" data-testid="fb-client-ouvrir">Voir / Imprimer</button></div>
          </div>); })}</div>
      )}
      {voir && <FbApercu inv={voir} cfg={cfg} onClose={() => setVoir(null)} />}
    </div>
  );
}

// ───────── Super admin : réglages et factures (view = "factures" | "reglages") ─────────
function BillingAdminPanel({ view, showToast, currentUserEmail }) {
  const today = todayStr();
  const [cfg, setCfg] = useState(null);
  const [edit, setEdit] = useState(null);
  const [rows, setRows] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filtre, setFiltre] = useState("toutes");
  const [voir, setVoir] = useState(null);
  const [busy, setBusy] = useState(false);
  const [em, setEm] = useState({ date: todayStr(), rate: "", vat: null });
  const [pay, setPay] = useState(null);
  const [comp, setComp] = useState({ companyId: "" });
  const charger = async () => {
    const c = await fbChargerConfig();
    const [inv, co, gr] = await Promise.all([
      supabase.from("billing_invoices").select("*").order("issue_date", { ascending: false }),
      supabase.from("companies").select("id, name, plan_tier, plan_status, trial_ends_at, created_at, group_id, sectors, sector_pack, extra_blocks"),
      supabase.from("company_groups").select("id, name, plan_status"),
    ]);
    setCfg(c); setEdit((e) => e || c);
    setRows(inv.error ? [] : (inv.data || []).slice().sort((a, b) => String(b.number).localeCompare(String(a.number))));
    setCompanies(co.data || []); setGroups(gr.data || []);
    setEm((e) => ({ ...e, rate: e.rate || (c.rate_htg_per_usd ? String(c.rate_htg_per_usd) : ""), vat: e.vat === null ? c.vat_enabled : e.vat }));
  };
  useEffect(() => { charger(); }, []);
  if (!cfg || rows === null) return <div className="text-sm" style={{ color: "#8A8370" }}>Chargement…</div>;

  // ── Réglages ──
  const champ = (k, label, type) => (<div><label className="text-xs" style={{ color: "#8A8370" }}>{label}</label><input type={type || "text"} value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: type === "number" ? e.target.value : e.target.value })} data-testid={"fb-reg-" + k} style={fbCell} /></div>);
  const prixChamp = (k, label) => (<div><label className="text-xs" style={{ color: "#8A8370" }}>{label}</label><input type="number" min="0" value={edit.prices[k]} onChange={(e) => setEdit({ ...edit, prices: { ...edit.prices, [k]: e.target.value } })} data-testid={"fb-prix-" + k} style={fbCell} /></div>);
  const choisirLogo = (file) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { const img = new Image(); img.onload = () => {
      const k = Math.min(1, 240 / Math.max(img.width, img.height)); const cv = document.createElement("canvas"); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); setEdit((e) => ({ ...e, logo: cv.toDataURL("image/png") }));
    }; img.src = rd.result; };
    rd.readAsDataURL(file);
  };
  const actualiserTaux = async () => { const r = await fetchHtgPerUsd(); if (r) { setEdit((e) => ({ ...e, rate_htg_per_usd: String(Math.round(r * 100) / 100) })); showToast("Taux du jour : 1 USD = " + (Math.round(r * 100) / 100) + " G."); } else { setEdit((e) => ({ ...e, rate_htg_per_usd: e.rate_htg_per_usd || String(FALLBACK_HTG_PER_USD) })); showToast("Service de taux indisponible : saisissez le taux manuellement."); } };
  const enregistrerReglages = async () => {
    const prices = {}; Object.keys(FB_PRIX_DEFAUT).forEach((k) => { prices[k] = Math.max(0, Number(edit.prices[k]) || 0); });
    const vr = Number(edit.vat_rate);
    if (!(vr >= 0 && vr <= 100)) { showToast("Le taux de TCA doit être entre 0 et 100 %."); return; }
    const row = { id: 1, issuer_name: String(edit.issuer_name || "Compta+").trim(), issuer_address: edit.issuer_address || "", issuer_phone: edit.issuer_phone || "", issuer_email: edit.issuer_email || "", issuer_nif: edit.issuer_nif || "", logo: edit.logo || "", thanks: edit.thanks || "Merci de votre confiance !", payment_info: edit.payment_info || "",
      vat_enabled: !!edit.vat_enabled, vat_rate: vr, rate_htg_per_usd: Number(edit.rate_htg_per_usd) || 0, prices, grid: cfg.grid, updated_at: new Date().toISOString() };
    setBusy(true);
    const { error } = await supabase.from("billing_settings").upsert(row);
    setBusy(false);
    if (error) { showToast(friendlyError(error)); return; }
    setCfg(fbConfig(row)); setEdit(fbConfig(row)); setEm((e) => ({ ...e, rate: row.rate_htg_per_usd ? String(row.rate_htg_per_usd) : e.rate }));
    showToast("Réglages de facturation enregistrés.");
  };
  if (view === "reglages") {
    return (
      <div className="max-w-3xl space-y-5" data-testid="fb-reglages">
        <div className="bg-white rounded-lg p-5" style={{ border: "1px solid #E4DFD1" }}>
          <div className="display text-base mb-3" style={{ color: "#152238" }}>Émetteur (en-tête de la facture)</div>
          <div className="mb-3 flex items-center gap-3">{edit.logo ? <img src={edit.logo} alt="" style={{ maxHeight: 60, maxWidth: 120 }} /> : <div className="text-xs" style={{ color: "#8A8370" }}>Aucun logo</div>}
            <input type="file" accept="image/*" onChange={(e) => choisirLogo(e.target.files && e.target.files[0])} data-testid="fb-reg-logo" className="text-xs" />{edit.logo && <button onClick={() => setEdit({ ...edit, logo: "" })} className="text-xs underline">Retirer</button>}</div>
          <div className="grid md:grid-cols-2 gap-3">{champ("issuer_name", "Nom")}{champ("issuer_nif", "NIF")}{champ("issuer_address", "Adresse")}{champ("issuer_phone", "Téléphone")}{champ("issuer_email", "E-mail")}</div>
          <div className="mt-3"><label className="text-xs" style={{ color: "#8A8370" }}>Mot de remerciement (dernière ligne de la facture)</label><input value={edit.thanks} onChange={(e) => setEdit({ ...edit, thanks: e.target.value })} data-testid="fb-reg-thanks" style={fbCell} /></div>
          <div className="mt-3"><label className="text-xs" style={{ color: "#8A8370" }}>Comment payer (MonCash, carte, virement… — affiché sur les factures à payer)</label><textarea rows={3} value={edit.payment_info} onChange={(e) => setEdit({ ...edit, payment_info: e.target.value })} data-testid="fb-reg-payment_info" style={fbCell} /></div>
        </div>
        <div className="bg-white rounded-lg p-5" style={{ border: "1px solid #E4DFD1" }}>
          <div className="display text-base mb-3" style={{ color: "#152238" }}>Prix mensuels (en dollars) et taux de change</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{prixChamp("standard", "Forfait Standard")}{prixChamp("assisted", "Forfait Assisté")}{prixChamp("group", "Forfait Extension")}{prixChamp("pack", "Pack 3 secteurs")}{prixChamp("A", "Bloc grille A")}{prixChamp("B", "Bloc grille B")}{prixChamp("C", "Bloc grille C")}</div>
          <div className="grid md:grid-cols-3 gap-3 mt-3 items-end">{champ("rate_htg_per_usd", "Taux affiché : gourdes pour 1 USD", "number")}<button onClick={actualiserTaux} style={fbBtn} data-testid="fb-reg-taux-auto">Taux du jour</button></div>
          <label className="flex items-center gap-2 text-sm mt-4"><input type="checkbox" checked={!!edit.vat_enabled} onChange={(e) => setEdit({ ...edit, vat_enabled: e.target.checked })} data-testid="fb-reg-vat_enabled" /> Appliquer la TCA sur les factures (option)</label>
          <div className="grid md:grid-cols-3 gap-3 mt-2">{champ("vat_rate", "Taux de TCA (%)", "number")}</div>
          <div className="text-xs mt-2" style={{ color: "#7A7460" }}>La TCA sur les abonnements est à confirmer avec l'expert-comptable. Elle reste désactivée tant que vous ne cochez pas la case ; vous pouvez aussi la décider à chaque émission.</div>
        </div>
        <button onClick={enregistrerReglages} disabled={busy} style={fbBtnOr} data-testid="fb-reg-enregistrer">Enregistrer les réglages</button>
      </div>
    );
  }

  // ── Factures ──
  const rate = Number(em.rate) || 0;
  const vatOn = !!em.vat;
  const local = { n: 0, list: rows };
  const inserer = async (draft) => {
    const number = await fbNumero(draft.issue_date, local);
    const row = { id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2), ...draft, number, created_by: currentUserEmail || "" };
    const { error } = await supabase.from("billing_invoices").insert(row);
    if (error) throw error;
    local.list = [...local.list, row];
    return row;
  };
  const emettre = async () => {
    if (!(rate > 0)) { showToast("Indiquez le taux de change (gourdes pour 1 USD)."); return; }
    if (!em.date) { showToast("Indiquez la date d'émission."); return; }
    const { drafts, inscriptions } = fbEmission({ companies, groups, invoices: rows, cfg, date: em.date, rate, vatEnabled: vatOn, vatRate: cfg.vat_rate });
    if (!drafts.length && !inscriptions.length) { showToast("Rien à émettre : toutes les factures de ce mois existent déjà."); return; }
    const total = fbR2(drafts.reduce((s, d) => s + d.total_htg, 0));
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Émettre " + drafts.length + " facture(s) mensuelle(s) pour " + fbHtg(total) + (inscriptions.length ? " et " + inscriptions.length + " facture(s) d'inscription à 0" : "") + " ?")) return;
    setBusy(true);
    try { for (const d of [...inscriptions, ...drafts]) await inserer(d); showToast(drafts.length + " facture(s) émise(s)."); }
    catch (e) { showToast(friendlyError(e)); }
    setBusy(false); charger();
  };
  const complement = async () => {
    const co = companies.find((c) => c.id === comp.companyId);
    if (!co) { showToast("Choisissez l'entreprise."); return; }
    if (!(rate > 0)) { showToast("Indiquez le taux de change."); return; }
    const gr = co.group_id ? groups.find((g) => g.id === co.group_id) : null;
    const base = gr ? companies.filter((c) => c.group_id === gr.id).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))[0] : co;
    const r = fbComplement({ company: base, group: gr, invoices: rows, cfg, date: em.date, rate, vatEnabled: vatOn, vatRate: cfg.vat_rate });
    if (r.error) { showToast(r.error); return; }
    if (typeof window !== "undefined" && window.confirm && !window.confirm("Émettre une facture complémentaire de " + fbHtg(r.draft.total_htg) + " pour « " + r.draft.client_name + " » ?")) return;
    setBusy(true);
    try { await inserer(r.draft); showToast("Facture complémentaire émise."); } catch (e) { showToast(friendlyError(e)); }
    setBusy(false); charger();
  };
  const enregistrerPaiement = async () => {
    if (!pay) return;
    const montant = fbR2(pay.amount);
    if (!(montant > 0)) { showToast("Indiquez le montant reçu."); return; }
    if (!pay.date || pay.date > today) { showToast("La date de paiement ne peut pas être dans le futur."); return; }
    const { error } = await supabase.from("billing_invoices").update({ status: "payee", paid_at: pay.date, paid_amount_htg: montant, payment_method: pay.method, payment_ref: pay.ref || "" }).eq("id", pay.inv.id);
    if (error) { showToast(friendlyError(error)); return; }
    setPay(null); showToast("Paiement enregistré."); charger();
  };
  const annuler = async (inv) => {
    if (inv.status === "payee") { showToast("Une facture payée ne s'annule pas ici : contactez le support comptable."); return; }
    if (inv.status === "annulee") return;
    const motif = typeof window !== "undefined" && window.prompt ? window.prompt("Motif de l'annulation de " + inv.number + " (obligatoire) :", "") : "";
    if (!motif || motif.trim().length < 3) { showToast("Annulation refusée : motif obligatoire."); return; }
    const { error } = await supabase.from("billing_invoices").update({ status: "annulee", cancel_reason: motif.trim() }).eq("id", inv.id);
    if (error) { showToast(friendlyError(error)); return; }
    showToast(inv.number + " annulée."); charger();
  };
  const mois = today.slice(0, 7);
  const actives = rows.filter((i) => i.status !== "annulee");
  const emisMois = fbR2(actives.filter((i) => String(i.issue_date).startsWith(mois)).reduce((s, i) => s + (Number(i.total_htg) || 0), 0));
  const encaisse = fbR2(actives.filter((i) => i.status === "payee").reduce((s, i) => s + (Number(i.paid_amount_htg) || Number(i.total_htg) || 0), 0));
  const aEncaisser = fbR2(actives.filter((i) => i.status === "emise").reduce((s, i) => s + (Number(i.total_htg) || 0), 0));
  const retards = actives.filter((i) => i.status === "emise" && i.due_date && i.due_date < today).length;
  const liste = rows.filter((i) => filtre === "toutes" || (filtre === "retard" ? (i.status === "emise" && i.due_date && i.due_date < today) : i.status === filtre));
  return (
    <div className="max-w-5xl" data-testid="fb-factures">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[["Émis ce mois", fbHtg(emisMois), "fb-kpi-mois"], ["Encaissé", fbHtg(encaisse), "fb-kpi-encaisse"], ["À encaisser", fbHtg(aEncaisser), "fb-kpi-a-encaisser"], ["Factures en retard", String(retards), "fb-kpi-retards"]].map(([l, v, t]) => (
          <div key={t} className="rounded-lg p-3 bg-white" style={{ border: "1px solid #E4DFD1" }}><div className="text-xs" style={{ color: "#8A8370" }}>{l}</div><div className="display text-lg tabular" data-testid={t} style={{ color: "#152238" }}>{v}</div></div>))}
      </div>
      <div className="bg-white rounded-lg p-4 mb-5" style={{ border: "1px solid #E4DFD1" }}>
        <div className="display text-base mb-2" style={{ color: "#152238" }}>Émettre les factures du mois</div>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Date d'émission</label><input type="date" value={em.date} max={today} onChange={(e) => setEm({ ...em, date: e.target.value })} data-testid="fb-em-date" style={fbCell} /></div>
          <div><label className="text-xs" style={{ color: "#8A8370" }}>Taux (gourdes pour 1 USD)</label><input type="number" min="0" value={em.rate} onChange={(e) => setEm({ ...em, rate: e.target.value })} data-testid="fb-em-taux" style={fbCell} /></div>
          <label className="flex items-center gap-2 text-sm pb-1.5"><input type="checkbox" checked={vatOn} onChange={(e) => setEm({ ...em, vat: e.target.checked })} data-testid="fb-em-vat" /> TCA ({cfg.vat_rate} %)</label>
          <button onClick={emettre} disabled={busy} style={fbBtnOr} data-testid="fb-em-emettre">Émettre les factures du mois</button>
        </div>
        <div className="text-xs mt-2" style={{ color: "#7A7460" }}>Une facture par entreprise payante (et par groupe), jamais en double pour le même mois. Première facture payante : prorata dès la fin de l'essai. Les factures d'inscription à 0 manquantes sont aussi créées.</div>
        <div className="grid md:grid-cols-4 gap-3 items-end mt-4">
          <div className="md:col-span-3"><label className="text-xs" style={{ color: "#8A8370" }}>Facture complémentaire (hausse de forfait ou de blocs en cours de mois, au prorata des jours)</label>
            <select value={comp.companyId} onChange={(e) => setComp({ companyId: e.target.value })} data-testid="fb-comp-societe" style={fbCell}><option value="">— entreprise —</option>{companies.filter((c) => c.plan_status === "active").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <button onClick={complement} disabled={busy} style={fbBtn} data-testid="fb-comp-emettre">Facture complémentaire</button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2"><label className="text-xs" style={{ color: "#8A8370" }}>Afficher</label>
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} data-testid="fb-filtre" style={{ ...fbCell, width: "auto" }}><option value="toutes">Toutes</option><option value="emise">À payer</option><option value="retard">En retard</option><option value="payee">Payées</option><option value="gratuite">Gratuites (inscriptions)</option><option value="annulee">Annulées</option></select></div>
      <div style={{ overflowX: "auto" }}><table className="w-full text-sm"><thead><tr className="text-left text-xs" style={{ color: "#8A8370" }}><th className="py-1">N°</th><th>Client</th><th>Type</th><th>Date</th><th className="text-right">Total</th><th>État</th><th></th></tr></thead>
        <tbody>{liste.map((i) => { const [l, c] = fbEtat(i, today); return (
          <tr key={i.id || i.number} data-testid="fb-ligne" style={{ borderTop: "1px solid #EEE9DA", opacity: i.status === "annulee" ? 0.55 : 1 }}><td className="py-1.5 text-xs tabular">{i.number}</td><td>{i.client_name}</td><td className="text-xs">{i.kind === "inscription" ? "Inscription" : i.kind === "complement" ? "Complément" : "Mensuelle"}</td><td>{fbDateFr(i.issue_date)}</td><td className="text-right tabular">{fbHtg(i.total_htg)}</td><td style={{ color: c, fontWeight: 600 }}>{l}</td>
            <td className="text-right whitespace-nowrap"><button onClick={() => setVoir(i)} className="text-xs underline mr-3" data-testid="fb-ouvrir">Voir / Imprimer</button>{i.status === "emise" && <button onClick={() => setPay({ inv: i, amount: String(i.total_htg), method: "MonCash", ref: "", date: today })} className="text-xs underline mr-3" data-testid="fb-payer">Enregistrer le paiement</button>}{(i.status === "emise" || i.status === "gratuite") && <button onClick={() => annuler(i)} className="text-xs" style={{ color: "#A6432F" }} data-testid="fb-annuler">Annuler</button>}</td></tr>); })}</tbody></table></div>
      {liste.length === 0 && <div className="text-sm mt-2" style={{ color: "#8A8370" }}>Aucune facture.</div>}
      {pay && (
        <div className="bg-white rounded-lg p-4 mt-4" style={{ border: "2px solid #C9A24B" }} data-testid="fb-paiement">
          <div className="display text-base mb-2" style={{ color: "#152238" }}>Paiement de {pay.inv.number} — {pay.inv.client_name}</div>
          <div className="grid md:grid-cols-5 gap-3 items-end">
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Montant reçu (gourdes)</label><input type="number" min="0" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} data-testid="fb-pay-montant" style={fbCell} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Mode</label><select value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })} data-testid="fb-pay-mode" style={fbCell}><option>MonCash</option><option>Carte</option><option>Virement</option><option>Espèces</option></select></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Référence</label><input value={pay.ref} onChange={(e) => setPay({ ...pay, ref: e.target.value })} data-testid="fb-pay-ref" style={fbCell} /></div>
            <div><label className="text-xs" style={{ color: "#8A8370" }}>Date</label><input type="date" value={pay.date} max={today} onChange={(e) => setPay({ ...pay, date: e.target.value })} style={fbCell} /></div>
            <div className="flex gap-2"><button onClick={enregistrerPaiement} style={fbBtnOr} data-testid="fb-pay-valider">Valider</button><button onClick={() => setPay(null)} style={fbBtn}>Fermer</button></div>
          </div>
        </div>
      )}
      {voir && <FbApercu inv={voir} cfg={cfg} onClose={() => setVoir(null)} />}
    </div>
  );
}
