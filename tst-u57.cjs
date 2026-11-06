// v321 : l'échec d'activation de la 2FA affiche un message clair + une « référence » technique.
const {chromium}=require('playwright');const {boot}=require('./tst-harness.cjs');
let fails=0;const ok=(n,c,i)=>{console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+JSON.stringify(i)));if(!c)fails++};
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
const {p,errs}=await boot(b,{settings:{companyName:"Lakay SA",currency:"HTG",requireAdminMfa:true},primary:true,pageInit:()=>{try{localStorage.removeItem('compta-plus-active-tab')}catch(e){}}});
await p.waitForTimeout(1500);
await p.evaluate(()=>{window.supabase_forced_fail=1;const c=[...document.querySelectorAll('button')].find(x=>/Activer la double/.test(x.innerText));c&&c.click();});
await p.waitForTimeout(800);
const txt=await p.evaluate(()=>document.body.innerText);
ok('message clair affiché',/Impossible de démarrer l'activation/.test(txt),txt.slice(0,200));
ok('référence technique affichée',await p.evaluate(()=>!!document.querySelector('[data-testid="mfa-ref"]')));
await p.close();await b.close();console.log(fails?'ECHECS '+fails:'TOUT PASSE');process.exit(fails?1:0)})();
