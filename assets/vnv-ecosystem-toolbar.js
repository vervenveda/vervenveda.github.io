/* Verve N Veda · single-source ecosystem utility rail. No grades, profile writes or assessments. */
(()=>{"use strict";
if(window.VNVEcosystemToolbar)return;
const A="https://vervenveda.com/Khaemenes_Academy.github.io/",V="https://vervenveda.com/";
const ROOT="vnvEcosystemUtilityDock";
const ACADEMY_TICKER="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-academy-ticker.js";
let mounted=false;

function ensureAcademyTicker(){
 try{
  const host=String(location.hostname||"").toLowerCase();
  const path=String(location.pathname||"").toLowerCase();
  const academy=host.includes("khaemenes_academy")||path.includes("/khaemenes_academy.github.io/");
  if(!academy)return;
  /* AutoPopulate migration guard: never resurrect the legacy Academy ticker on a migrated page. */
  if(window.VNV_TICKER?.autoPopulate||document.getElementById("vnvTickerAutoPopulate")||document.querySelector('script[data-vnv-ticker-autopopulate]'))return;
  if(window.KhaemenesAcademyTicker?.mount){window.KhaemenesAcademyTicker.mount();return;}
  if(document.querySelector('script[data-khaemenes-academy-ticker]'))return;
  const s=document.createElement("script");
  s.src=ACADEMY_TICKER;
  s.defer=true;
  s.dataset.khaemenesAcademyTicker="1";
  (document.head||document.documentElement).append(s);
 }catch{}
}
function mount(){
 if(mounted||!document.body)return;
 // Existing protected examinations must not gain study/search shortcuts.
 if(/\/(quiz|quizzes|exam|exams|assessment|assessments)\//i.test(location.pathname)||document.documentElement.hasAttribute("data-closed-book")||document.body.hasAttribute("data-closed-book"))return;
 ensureAcademyTicker();
 if(document.getElementById(ROOT))return;
 const style=document.createElement("style");style.id="vnvEcosystemUtilityStyles";style.textContent=`/* Verve N Veda canonical ecosystem toolbar — six controls, isolated from page layout. */
/* Hide only duplicate floating utility launchers; retain lesson-specific in-page tools. */
body:has(#vnvEcosystemUtilityDock) :is(#khaemenesLearnerUtilityToolbar,#khaeLandingUtilityDock,#khaemenesHomeUtilityDock,#vnvBetaProgramLink,#vnvBetaProgramFallback,a[aria-label="Open the Verve N Veda Beta Program"]){display:none!important}
\nhtml:root body #vnvEcosystemUtilityDock{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;z-index:2147482500!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;width:min(354px,calc(100vw - 24px))!important;box-sizing:border-box!important;gap:7px!important;padding:10px!important;border:1px solid rgba(180,139,69,.48)!important;border-radius:7px!important;background:rgba(255,253,248,.97)!important;box-shadow:0 10px 30px rgba(15,25,37,.17)!important;backdrop-filter:blur(10px)!important}\nhtml:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;height:42px!important;min-height:42px!important;max-height:42px!important;border:1px solid rgba(23,57,47,.35)!important;border-radius:7px!important;background:#f5f8f6!important;color:#17392f!important;padding:5px!important;text-align:center!important;font:400 9px/1.1 Arial,sans-serif!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden!important;cursor:pointer!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"profile\"]{background:#fffdf8!important;border-color:rgba(180,139,69,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"updates\"]{background:#f8f4e9!important;border-color:rgba(114,95,130,.35)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"mentor\"]{background:#fff4d8!important;color:#493719!important;border-color:#b48b45!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"support\"]{background:#6d8374!important;color:#fff!important;border-color:#516b5b!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"beta\"]{background:#0f1925!important;color:#f7efe0!important;border-color:rgba(183,147,77,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock>a:focus-visible,html:root body #vnvEcosystemUtilityDock>button:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}\n#vnvEcosystemUtilityUpdates{border:1px solid #b48b45;border-radius:7px;background:#fffdf8;color:#17211d;padding:22px;max-width:min(560px,calc(100vw - 28px))}\n#vnvEcosystemUtilityUpdates::backdrop{background:rgba(7,21,33,.52)}\n@media(max-width:380px){html:root body #vnvEcosystemUtilityDock{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:min(294px,calc(100vw - 16px))!important;right:8px!important;bottom:8px!important;padding:7px!important;gap:5px!important}html:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{height:40px!important;min-height:40px!important;max-height:40px!important;font-size:8px!important;padding:4px!important}}\n@media print{#vnvEcosystemUtilityDock,#vnvEcosystemUtilityUpdates{display:none!important}}`;document.head.append(style);
 const dock=document.createElement("nav");dock.id=ROOT;dock.setAttribute("aria-label","Verve N Veda ecosystem utilities");
// Legacy campus dock is removed only after the canonical dock can mount;
// never touch lesson-specific evidence and assessment controls.
for(const legacy of ["khaeLandingUtilityDock","khaemenesHomeUtilityDock"]){
 const other=document.getElementById(legacy);
 if(other)other.style.setProperty("display","none","important");
}
 const link=(key,label,url)=>{const e=document.createElement("a");e.dataset.vnvTool=key;e.textContent=label;e.href=url;e.setAttribute("aria-label",label==="Profile"?"Open learner or scholar profile":label);dock.append(e);return e};
 let path=location.pathname.toLowerCase();
 let profile=A+"student/";
 if(path.includes("higher_learning")||path.includes("/adult/"))profile=A+"adult/";
 link("profile","Profile",profile);
 link("search","Search",V+"PLERASearch.github.io/");
 const updates=document.createElement("button");updates.type="button";updates.dataset.vnvTool="updates";updates.textContent="Updates";dock.append(updates);
 link("mentor","Mentor",A+"mentor/");
 link("support","Support","https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s");
 link("beta","Beta",V+"beta/");
 const dialog=document.createElement("dialog");dialog.id="vnvEcosystemUtilityUpdates";
 const title=document.createElement("h2");title.textContent="Updates & Help";dialog.append(title);
 const note=document.createElement("p");note.textContent="Academy information and assistance.";dialog.append(note);
 const help=document.createElement("a");help.href=A+"#help";help.textContent="Academy Help Desk";dialog.append(help);
 const close=document.createElement("button");close.type="button";close.textContent="Close";close.addEventListener("click",()=>dialog.close());dialog.append(close);
 updates.addEventListener("click",()=>dialog.showModal());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.body.append(dock,dialog);mounted=true;
}
window.VNVEcosystemToolbar=Object.freeze({version:"1.0.2",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();