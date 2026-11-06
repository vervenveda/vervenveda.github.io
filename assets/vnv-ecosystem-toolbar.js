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
\nhtml:root body #vnvEcosystemUtilityDock{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;z-index:2147482500!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;width:min(480px,calc(100vw - 24px))!important;box-sizing:border-box!important;gap:7px!important;padding:10px!important;border:1px solid rgba(180,139,69,.48)!important;border-radius:7px!important;background:rgba(255,253,248,.97)!important;box-shadow:0 10px 30px rgba(15,25,37,.17)!important;backdrop-filter:blur(10px)!important}\nhtml:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;height:auto!important;min-height:52px!important;max-height:none!important;border:1px solid rgba(23,57,47,.35)!important;border-radius:7px!important;background:#f5f8f6!important;color:#17392f!important;padding:5px!important;text-align:center!important;font:400 16px/1.2 "Nunito","Brandon Grotesque","Avenir Next",Arial,sans-serif!important;letter-spacing:0!important;white-space:normal!important;overflow:visible!important;cursor:pointer!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"profile\"]{background:#fffdf8!important;border-color:rgba(180,139,69,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"updates\"]{background:#f8f4e9!important;border-color:rgba(114,95,130,.35)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"mentor\"]{background:#fff4d8!important;color:#493719!important;border-color:#b48b45!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"support\"]{background:#6d8374!important;color:#fff!important;border-color:#516b5b!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"beta\"]{background:#0f1925!important;color:#f7efe0!important;border-color:rgba(183,147,77,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock>a:focus-visible,html:root body #vnvEcosystemUtilityDock>button:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}\n#vnvEcosystemUtilityUpdates{border:1px solid #b48b45;border-radius:7px;background:#fffdf8;color:#17211d;padding:22px;max-width:min(560px,calc(100vw - 28px))}\n#vnvEcosystemUtilityUpdates::backdrop{background:rgba(7,21,33,.52)}\n@media(max-width:380px){html:root body #vnvEcosystemUtilityDock{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:min(354px,calc(100vw - 16px))!important;right:8px!important;bottom:8px!important;padding:7px!important;gap:5px!important}html:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{height:auto!important;min-height:52px!important;max-height:none!important;font-size:16px!important;padding:5px!important}}\n#vnvArchaemenesMentorDialog{position:fixed!important;inset:0!important;margin:auto!important;width:min(1080px,calc(100vw - 28px))!important;max-width:1080px!important;height:min(90vh,880px)!important;max-height:90vh!important;padding:0!important;overflow:hidden!important;border:4px solid #caa862!important;border-radius:7px!important;background:#fffdf8!important;color:#102b48!important;box-shadow:0 24px 80px rgba(0,0,0,.4)!important;z-index:2147483000!important}\n#vnvArchaemenesMentorDialog::backdrop{background:rgba(8,20,33,.78)!important}\n#vnvArchaemenesMentorDialog[open]{display:flex!important;flex-direction:column!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:12px 16px;background:#102b48;color:#fffdf8}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font:400 18px Cinzel,Georgia,serif!important;color:#fffdf8!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions{display:flex;gap:8px;align-items:center}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a,#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button{padding:9px 12px;min-height:40px;box-sizing:border-box;border:1px solid #f3ca71;border-radius:7px;background:#f3ca71;color:#102b48;font:400 13px Nunito,Arial,sans-serif;cursor:pointer;text-decoration:none}\n#vnvArchaemenesMentorDialog iframe{display:block;width:100%;flex:1;min-height:0;border:0;background:#fffdf8}\n@media(max-width:600px){#vnvArchaemenesMentorDialog{width:calc(100vw - 12px)!important;height:94dvh!important;max-height:94dvh!important}#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font-size:14px!important}}\n\n@media print{#vnvEcosystemUtilityDock,#vnvEcosystemUtilityUpdates,#vnvArchaemenesMentorDialog{display:none!important}}`;document.head.append(style);
 const dock=document.createElement("nav");dock.id=ROOT;dock.setAttribute("aria-label","Verve N Veda ecosystem utilities");
// Legacy campus dock is removed only after the canonical dock can mount;
// never touch lesson-specific evidence and assessment controls.
for(const legacy of ["khaeLandingUtilityDock","khaemenesHomeUtilityDock"]){
 const other=document.getElementById(legacy);
 if(other)other.style.setProperty("display","none","important");
}
 const link=(key,label,url)=>{const e=document.createElement("a");e.dataset.vnvTool=key;e.textContent=label;e.href=url;e.setAttribute("aria-label",label==="Profile"?"Open learner or scholar profile":label);dock.append(e);return e};
 // The canonical Profile doorway is resolved from the selected Academy
 // learner on every activation, not from the page currently being visited.
 // No registration or private records are modified by this navigation.
 function registeredProfileDestination(){
  const tour=A+"tour/";
  // Read, never mutate, the selected Academy identity. One learner = one
  // deterministic destination even after repeat mounts or grade visits.
  try{
   const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
   const family=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
   const record=typeof id==="string"?family?.learners?.[id]:null;
   const person=record?.learnerId===id?record:null;
   if(!person)return tour;
   const linked=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
   if(linked&&String(linked)!==id)return tour;
   const stage=String(person.stage||"").toLowerCase();
   const grade=String(person.grade||"").replace(/^grade[- ]?/i,"").trim().toLowerCase();
   if(stage==="high"){
    const n=Number(grade);
    return [9,10,11,12].includes(n)?V+"Khaemenes_High.github.io/grades/grade-"+String(n).padStart(2,"0")+"/student-profile/":tour;
   }
   if(stage==="higher"||person.selfDirectedAdult===true)return A+"adult/";
   if(["preschool","kindergarten","elementary","middle"].includes(stage))return A+"student/profile.html";
  }catch{}
  return tour;
 }
 const profileLink=link("profile","Profile",registeredProfileDestination());
 // A click re-resolves immediately before navigation. The live destination
 // never goes through the general Student Portal for High School learners.
 const refreshProfile=()=>{const target=registeredProfileDestination();if(profileLink.href!==target)profileLink.href=target;return target};
 const navigateProfile=event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const target=refreshProfile();
  event.preventDefault();
  event.stopImmediatePropagation();
  location.assign(target);
 };
 profileLink.addEventListener("click",navigateProfile,true);
 profileLink.addEventListener("pointerenter",refreshProfile);
 profileLink.addEventListener("focus",refreshProfile);
 window.addEventListener("pageshow",refreshProfile);
 window.addEventListener("khaemenes-family-changed",refreshProfile);
 window.addEventListener("storage",event=>{
  if(!event.key||/khaemenes_(active_learner|family_registry)_v1/.test(event.key))refreshProfile();
 });
 link("search","Search",V+"PLERASearch.github.io/");
 const updates=document.createElement("button");updates.type="button";updates.dataset.vnvTool="updates";updates.textContent="Updates";dock.append(updates);
 const mentorUrl="https://artist1970.github.io/Archaemenes.github.io/#archaemenesConversation";
 const mentor=link("mentor","Mentor",mentorUrl);
 mentor.setAttribute("aria-haspopup","dialog");
 mentor.setAttribute("aria-controls","vnvArchaemenesMentorDialog");
 const mentorDialog=document.createElement("dialog");
 mentorDialog.id="vnvArchaemenesMentorDialog";
 mentorDialog.setAttribute("aria-label","Conversation with Archaemenes");
 const mentorHeader=document.createElement("div");mentorHeader.className="vnv-mentor-popup-header";
 const mentorTitle=document.createElement("strong");mentorTitle.textContent="Archaemenes · Scholarly Conversation";
 const mentorActions=document.createElement("div");mentorActions.className="vnv-mentor-popup-actions";
 const mentorDirect=document.createElement("a");mentorDirect.href=mentorUrl;mentorDirect.target="_blank";mentorDirect.rel="noopener noreferrer";mentorDirect.textContent="Open full page";
 const mentorClose=document.createElement("button");mentorClose.type="button";mentorClose.textContent="Close";mentorClose.setAttribute("aria-label","Close Archaemenes conversation");
 mentorClose.addEventListener("click",()=>mentorDialog.close());
 mentorActions.append(mentorDirect,mentorClose);mentorHeader.append(mentorTitle,mentorActions);
 const mentorFrame=document.createElement("iframe");mentorFrame.title="Archaemenes public mentor conversation";mentorFrame.loading="lazy";mentorFrame.referrerPolicy="no-referrer";
 mentorDialog.append(mentorHeader,mentorFrame);
 mentor.addEventListener("click",e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();try{mentorDialog.showModal();mentorFrame.src=mentorUrl;mentorClose.focus()}catch{window.open(mentorUrl,"_blank","noopener,noreferrer")}});
 mentorDialog.addEventListener("click",e=>{if(e.target===mentorDialog)mentorDialog.close()});
 mentorDialog.addEventListener("close",()=>mentorFrame.removeAttribute("src"));
 link("support","Support","https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s");
 link("beta","Beta",V+"beta/");
 const dialog=document.createElement("dialog");dialog.id="vnvEcosystemUtilityUpdates";
 const title=document.createElement("h2");title.textContent="Updates & Help";dialog.append(title);
 const note=document.createElement("p");note.textContent="Academy information and assistance.";dialog.append(note);
 const help=document.createElement("a");help.href=A+"#help";help.textContent="Academy Help Desk";dialog.append(help);
 const close=document.createElement("button");close.type="button";close.textContent="Close";close.addEventListener("click",()=>dialog.close());dialog.append(close);
 updates.addEventListener("click",()=>dialog.showModal());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.body.append(dock,dialog,mentorDialog);mounted=true;
}
window.VNVEcosystemToolbar=Object.freeze({version:"1.0.4",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();