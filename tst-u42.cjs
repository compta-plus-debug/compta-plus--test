// v303 — numérotation de la barre latérale par rang ; Industries : catalogue, stock dès l'ajout, texte libre limité, alerte sous le coût ; achats des métiers visibles dans Achat et fournisseurs.
const {chromium}=require('playwright');const {boot}=require('./tst-harness.cjs');
let fails=0;const ok=(n,c,i)=>{console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+JSON.stringify(i)));if(!c)fails++};
const g=(p,t)=>p.locator('[data-testid="'+t+'"]');
const iso=(d)=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=iso(new Date());
const S='[\\s\\u202f\\u00a0]?';const re=(a,b)=>new RegExp(a+S+b);
const mk=(sec,role)=>new Function("(function(){try{localStorage.clear();sessionStorage.clear()}catch(e){}var S=window.__srv;S.tables.companies[0].plan_tier='assisted';S.tables.companies[0].sectors="+JSON.stringify(sec)+";S.tables.companies[0].sectors_locked="+(sec.length>0)+";S.tables.company_members[0].role="+JSON.stringify(role)+";})()");
const rang=async(p,id)=>(await g(p,'nav-rang-'+id).innerText()).trim();
const cat=(p,c)=>p.evaluate((c)=>window.__srv.getCat(c)||[],c);
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
// 1. numérotation — espace BTP
{const dep={type:'dep',id:'d1',date:today,siteId:'s1',kind:'materiaux',supplier:'Quincaillerie X',label:'Ciment',amount:3000,mode:'apayer',status:'valide',settlements:[],entryId:'e1'};
 const {p}=await boot(b,{settings:{companyName:'X',currency:'HTG'},primary:true,cats:{btp:[{type:'site',id:'s1',name:'Villa',status:'encours',lines:[]},dep]},pageInit:mk(['btp'],'Administrateur')});await p.waitForTimeout(1500);
 const r={};for(const id of ['btp','caisse','achat','rh','compta','rapports','gestion','admin'])r[id]=await rang(p,id);
 ok('espace BTP : métier 1, caisse 2, dépenses et fournisseurs 3, salaires 4, comptabilité 5, rapports 6, gestion 7, administration 8',JSON.stringify(r)===JSON.stringify({btp:'1',caisse:'2',achat:'3',rh:'4',compta:'5',rapports:'6',gestion:'7',admin:'8'}),r);
 await g(p,'nav-rang-achat').click();await p.waitForTimeout(900);
 ok('en-tête du module Achat : « Module 3 » comme dans la barre',/Module 3/.test(await p.locator('body').innerText()));
 // achats des métiers
 await p.getByRole('button',{name:'Achats des métiers'}).click();await p.waitForTimeout(400);
 ok('la dépense BTP apparaît dans Achat et fournisseurs',(await g(p,'ach-metier-ligne').count())===1&&/Quincaillerie X/.test(await g(p,'ach-metier-ligne').innerText())&&/BTP/.test(await g(p,'ach-metier-ligne').innerText()));
 ok('reste à payer 3 000',re('3','000').test(await g(p,'ach-metiers-reste').innerText()),await g(p,'ach-metiers-reste').innerText());
 await p.getByRole('button',{name:'Fournisseurs',exact:true}).click();await p.waitForTimeout(500);
 ok('le fournisseur rejoint la liste commune avec sa dette',/Quincaillerie X/.test(await p.locator('body').innerText())&&re('3','000').test(await p.locator('tr:has-text("Quincaillerie X") [data-testid="ach-four-du"]').innerText()),await g(p,'ach-four-du').count());
 ok('fournisseur enregistré une seule fois',(await cat(p,'suppliers')).filter(x=>x.name==='Quincaillerie X').length===1,(await cat(p,'suppliers')).map(x=>x.name));
 await p.close();}
// numérotation — commerce inchangé
{const {p}=await boot(b,{settings:{companyName:'X',currency:'HTG'},primary:true,cats:{},pageInit:mk([],'Administrateur')});await p.waitForTimeout(1500);
 ok('commerce : comptabilité 1, achat 4',(await rang(p,'compta'))==='1'&&(await rang(p,'achat'))==='4',[await rang(p,'compta'),await rang(p,'achat')]);
 await p.close();}
// 2-3. Industries
{const seed=[{type:'mat',id:'m1',name:'Farine',unit:'kg',min:0,active:true},
 {type:'achat',id:'a1',date:today,matId:'m1',qty:100,amount:1000,supplier:'Moulin A',mode:'caisse',entryId:'x',status:'valide',settlements:[]},
 {type:'prod',id:'p1',name:'Pain',unit:'pièce',price:25,active:true},{type:'prod',id:'p2',name:'Gâteau',unit:'pièce',price:100,active:true},{type:'prod',id:'p3',name:'Biscuit',unit:'pièce',price:5,active:true},
 {type:'lot',id:'l1',number:'LT-1',date:today,productId:'p1',label:'',qty:10,lines:[{matId:'m1',qty:10,pu:10,cost:100}],hours:0,rate:0,frais:0,expire:'',orderId:'',notes:'',status:'valide'},
 {type:'lot',id:'l2',number:'LT-2',date:today,productId:'p2',label:'',qty:2,lines:[{matId:'m1',qty:20,pu:10,cost:200}],hours:0,rate:0,frais:0,expire:'',orderId:'',notes:'',status:'valide'}];
 const {p}=await boot(b,{settings:{companyName:'Atelier',currency:'HTG'},primary:true,cats:{indus:seed},pageInit:mk(['industrie'],'Administrateur')});await p.waitForTimeout(1500);
 await g(p,'in-tab-ventes').click();await p.waitForTimeout(400);
 ok('catalogue de vente : 3 produits listés, rupture signalée pour le produit sans lot',(await g(p,'in-vte-cat-ligne').count())===3&&/Rupture/.test(await g(p,'in-vte-catalogue').innerText()));
 await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('ligne sans produit ni « service » refusée',(await g(p,'in-vte-lignebrouillon').count())===0);
 await g(p,'in-vte-produit').selectOption('__service');await g(p,'in-vte-designation').fill('Livraison');await g(p,'in-vte-qte').fill('1');await g(p,'in-vte-pu').fill('50');await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('service hors stock accepté',(await g(p,'in-vte-lignebrouillon').count())===1);
 await g(p,'in-vte-produit').selectOption('p1');await g(p,'in-vte-qte').fill('11');await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('quantité supérieure au stock (10) refusée dès l\'ajout',(await g(p,'in-vte-lignebrouillon').count())===1);
 await g(p,'in-vte-qte').fill('4');await g(p,'in-vte-pu').fill('5');await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('prix 5 sous le coût 10 : alerte, ligne pas encore ajoutée',(await g(p,'in-vte-perte').count())===1&&(await g(p,'in-vte-lignebrouillon').count())===1&&/10/.test(await g(p,'in-vte-perte').innerText()),await g(p,'in-vte-perte').count());
 await g(p,'in-vte-perte-confirmer').click();await p.waitForTimeout(250);
 ok('confirmation : ligne ajoutée, alerte fermée',(await g(p,'in-vte-lignebrouillon').count())===2&&(await g(p,'in-vte-perte').count())===0);
 await g(p,'in-vte-produit').selectOption('p1');await g(p,'in-vte-qte').fill('7');await g(p,'in-vte-pu').fill('25');await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('4 déjà dans la facture + 7 > 10 : refusé (cumul des lignes)',(await g(p,'in-vte-lignebrouillon').count())===2);
 await g(p,'in-vte-produit').selectOption('p2');await g(p,'in-vte-qte').fill('1');await g(p,'in-vte-pu').fill('100');await g(p,'in-vte-ajouter-ligne').click();await p.waitForTimeout(250);
 ok('prix égal au coût : pas d\'alerte',(await g(p,'in-vte-perte').count())===0&&(await g(p,'in-vte-lignebrouillon').count())===3);
 await g(p,'in-vte-emettre').click();await p.waitForTimeout(500);
 const f=(await cat(p,'indus')).find(r=>r.type==='fact');
 ok('facture émise avec drapeaux : 1 ligne à perte, 1 service',f&&f.lines.filter(l=>l.perte).length===1&&f.lines.filter(l=>l.service).length===1,f&&f.lines);
 await g(p,'in-tab-rapports').click();await p.waitForTimeout(500);
 ok('rapport « Ventes sous le coût » : 1 ligne, perte 20',(await g(p,'in-rap-perte-ligne').count())===1&&re('20','').test(await g(p,'in-rap-perte-total').innerText()),await g(p,'in-rap-perte-total').innerText());
 await g(p,'in-tab-apercu').click();await p.waitForTimeout(500);
 ok('« À faire » signale la vente à perte',/Ventes à perte/.test(await p.locator('body').innerText()));
 await p.close();}
// 4. commande dont le coût de revient dépasse le montant facturé
{const seed=[{type:'mat',id:'m1',name:'Farine',unit:'kg',min:0,active:true},{type:'client',id:'c1',name:'Mme Paul',phone:'',address:''},
 {type:'achat',id:'a1',date:today,matId:'m1',qty:100,amount:1000,supplier:'',mode:'caisse',entryId:'x',status:'valide',settlements:[]},
 {type:'cmd',id:'o1',number:'CD-1',date:today,clientId:'c1',kind:'surmesure',subject:'Buffet',lines:[{id:'k1',label:'Buffet',productId:'',unit:'forfait',qty:1,pu:500}],due:'',status:'confirmee',specs:'',acomptes:[],factId:''},
 {type:'lot',id:'l1',number:'LT-1',date:today,productId:'',label:'Buffet',qty:1,lines:[{matId:'m1',qty:50,pu:10,cost:500}],hours:10,rate:50,frais:0,expire:'',orderId:'o1',notes:'',status:'valide'}];
 const {p}=await boot(b,{settings:{companyName:'Atelier',currency:'HTG'},primary:true,cats:{indus:seed},pageInit:mk(['industrie'],'Administrateur')});await p.waitForTimeout(1500);
 await g(p,'in-tab-commandes').click();await p.waitForTimeout(400);
 await g(p,'in-cmd-ouvrir').first().click();await p.waitForTimeout(300);
 await g(p,'in-cmd-facturer').click();await p.waitForTimeout(400);
 ok('coût 1 000 > 500 facturés : première demande refusée, bouton change',(await cat(p,'indus')).filter(r=>r.type==='fact').length===0&&/quand même/.test(await g(p,'in-cmd-facturer').innerText()));
 await g(p,'in-cmd-facturer').click();await p.waitForTimeout(500);
 ok('seconde demande : facture émise',(await cat(p,'indus')).filter(r=>r.type==='fact').length===1);
 await p.close();}
await b.close();console.log(fails?('ÉCHECS '+fails):'TOUT PASSE');process.exit(fails?1:0)})();
