# VNV Continuum Codex · 02 · Universal toolbar and translation

**Frozen 2026-11-08.** Source-backed full-code snapshot. The lower-right utility dock is the official `vnvEcosystemUtilityDock`, supplied by the single shared toolbar asset. Never add another independent floating utility. Do not embed protected student data or STOS authority in this public layer.

## Placement and functionality requirements

- Official dock: bottom-right, fixed; 3 columns × 2 rows; a single six-control interface. Layout is sourced from the JS below, not from separate page overrides.
- Controls: Profile, Search, Updates, Mentor (Archaemenes), Support, Beta. Preserve routing, accessibility, closed-book suppression, focus management and existing data-boundary checks.
- Visual: charcoal `#243038`, parchment `#f4f0e7`, cream `#fff8e9`, gold `#b48b45`, 7px corners. Current live toolbar has its own additional color accents; do not claim those have already been replaced.
- Translator: use Linguistics as canonical resource owner; gateway rail is a lightweight UI/fallback. Do not remove local translation until canonical parity and browser tests pass.

## Gateway translator placeholder — exact source

```html
<!-- The canonical translator populates this existing rail without inserting a new block. -->
<div id="vnv-language-rail" role="group" aria-label="Page translation tools"></div>
```

## Gateway translator script order and canonical handoff — exact source

```html
<!-- Khaemenes Linguistics is the canonical translator resource owner.
     This is an additive, opt-in resource handoff; gateway local translator is fallback. -->
<script src="https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1" defer></script>
<script src="assets/vnv-language.js?v=20261108-cream-buttons" defer></script>
<script id="vnv-linguistics-canonical-resource-handoff">
document.addEventListener("DOMContentLoaded",()=>{
  const loader=window.KhaemenesTranslatorLoader;
  if(!loader?.ensure)return; // Preserve current gateway translator if Linguistics is unreachable.
  loader.ensure({full:true,upgradeLegacyCore:true}).then(report=>{
    if(!report?.canonicalCore||report.records?.some(r=>r.state==="unavailable"||r.state==="skipped-incomplete-resources"))return;
    document.documentElement.dataset.vnvTranslatorAuthority="linguistics";
    window.VNVLanguage?.refresh?.();
  }).catch(()=>{}); // Never block the public gateway or change student storage.
},{once:true});
</script>
```

## Universal ecosystem toolbar — FULL JavaScript source

**Source:** `assets/vnv-ecosystem-toolbar.js`, blob `1018290c6c29ca4ed527df1febbd8b718e97c7bd`.

```javascript
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
function academyStudentSurface(){
 try{
  const host=String(location.hostname||"").toLowerCase();
  const path=String(location.pathname||"").toLowerCase();
  return (host.includes("khaemenes_high")||path.includes("/khaemenes_high.github.io/")||host.includes("khaemenes_academy")||path.includes("/khaemenes_academy.github.io/"))
    && (/\/student-profile\//.test(path)||/\/student\//.test(path)||/\/grades\/grade-(?:09|10|11|12)\//.test(path));
 }catch{return false}
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
\nhtml:root body #vnvEcosystemUtilityDock{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;z-index:2147482500!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;width:min(480px,calc(100vw - 24px))!important;box-sizing:border-box!important;gap:7px!important;padding:10px!important;border:1px solid rgba(180,139,69,.48)!important;border-radius:7px!important;background:rgba(255,253,248,.97)!important;box-shadow:0 10px 30px rgba(15,25,37,.17)!important;backdrop-filter:blur(10px)!important}\nhtml:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;height:auto!important;min-height:52px!important;max-height:none!important;border:1px solid rgba(23,57,47,.35)!important;border-radius:7px!important;background:#f5f8f6!important;color:#17392f!important;padding:5px!important;text-align:center!important;font:400 16px/1.2 "Nunito","Brandon Grotesque","Avenir Next",Arial,sans-serif!important;letter-spacing:0!important;white-space:normal!important;overflow:visible!important;cursor:pointer!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"profile\"]{background:#fffdf8!important;border-color:rgba(180,139,69,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"updates\"]{background:#f8f4e9!important;border-color:rgba(114,95,130,.35)!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"mentor\"]{background:#fff4d8!important;color:#493719!important;border-color:#b48b45!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"support\"]{background:#6d8374!important;color:#fff!important;border-color:#516b5b!important}\nhtml:root body #vnvEcosystemUtilityDock [data-vnv-tool=\"beta\"]{background:#0f1925!important;color:#f7efe0!important;border-color:rgba(183,147,77,.72)!important}\nhtml:root body #vnvEcosystemUtilityDock>a:focus-visible,html:root body #vnvEcosystemUtilityDock>button:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}\n#vnvEcosystemUtilityUpdates{border:1px solid #b48b45;border-radius:7px;background:#fffdf8;color:#17211d;padding:22px;max-width:min(560px,calc(100vw - 28px))}\n#vnvEcosystemUtilityUpdates::backdrop{background:rgba(7,21,33,.52)}\n@media(max-width:380px){html:root body #vnvEcosystemUtilityDock{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:min(354px,calc(100vw - 16px))!important;right:8px!important;bottom:8px!important;padding:7px!important;gap:5px!important}html:root body #vnvEcosystemUtilityDock>a,html:root body #vnvEcosystemUtilityDock>button{height:auto!important;min-height:52px!important;max-height:none!important;font-size:16px!important;padding:5px!important}}\n#vnvArchaemenesMentorDialog{position:fixed!important;inset:0!important;margin:auto!important;width:min(1080px,calc(100vw - 28px))!important;max-width:1080px!important;height:min(90vh,880px)!important;max-height:90vh!important;padding:0!important;overflow:hidden!important;border:4px solid #caa862!important;border-radius:7px!important;background:#fffdf8!important;color:#102b48!important;box-shadow:0 24px 80px rgba(0,0,0,.4)!important;z-index:2147483000!important}\n#vnvArchaemenesMentorDialog::backdrop{background:rgba(8,20,33,.78)!important}\n#vnvArchaemenesMentorDialog[open]{display:flex!important;flex-direction:column!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:12px 16px;background:#102b48;color:#fffdf8}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font:400 18px Cinzel,Georgia,serif!important;color:#fffdf8!important}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions{display:flex;gap:8px;align-items:center}\n#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a,#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button{padding:9px 12px;min-height:40px;box-sizing:border-box;border:1px solid #f3ca71;border-radius:7px;background:#f3ca71;color:#102b48;font:400 16px Nunito,Arial,sans-serif;cursor:pointer;text-decoration:none}\n#vnvArchaemenesMentorDialog iframe{display:block;width:100%;flex:1;min-height:0;border:0;background:#fffdf8}\n@media(max-width:600px){#vnvArchaemenesMentorDialog{width:calc(100vw - 12px)!important;height:94dvh!important;max-height:94dvh!important}#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{font-size:16px!important}}\n\n/* Crisp shared VNV framing for Archaemenes; the embedded site retains its own design. */
#vnvArchaemenesMentorDialog{
 border:2px solid #b48b45!important;
 background:#f4f0e7!important;
 color:#243038!important;
 box-shadow:0 24px 70px rgba(8,18,15,.42)!important;
}
#vnvArchaemenesMentorDialog::backdrop{background:rgba(8,19,16,.72)!important}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-header{
 display:flex!important;
 align-items:center!important;
 justify-content:space-between!important;
 padding:13px 18px!important;
 min-height:64px!important;
 gap:12px!important;
 border-bottom:2px solid #b48b45!important;
 background:#243038!important;
 color:#fff8e9!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{
 font:400 clamp(17px,2vw,20px)/1.3 Cinzel,Georgia,serif!important;
 color:#fff8e9!important;
 -webkit-text-fill-color:#fff8e9!important;
 letter-spacing:.015em!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions{
 display:flex!important;gap:8px!important;flex-wrap:wrap!important;justify-content:center!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a,
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button{
 min-height:40px!important;padding:8px 13px!important;
 border:1px solid #b48b45!important;border-radius:7px!important;
 background:#fff8e9!important;color:#243038!important;
 -webkit-text-fill-color:#243038!important;
 font:400 16px/1.3 Nunito,Arial,sans-serif!important;
 text-align:center!important;
 box-shadow:none!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions a:hover,
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions button:hover{
 background:#f0e3cf!important;
}
#vnvArchaemenesMentorDialog .vnv-mentor-popup-actions :is(a,button):focus-visible{
 outline:3px solid #e1c287!important;outline-offset:2px!important;
}
#vnvArchaemenesMentorDialog iframe{background:#f4f0e7!important}
@media(max-width:700px){
 #vnvArchaemenesMentorDialog .vnv-mentor-popup-header{
  flex-direction:column!important;justify-content:center!important;padding:12px!important;
 }
 #vnvArchaemenesMentorDialog .vnv-mentor-popup-header strong{text-align:center!important}
}
@media print{#vnvEcosystemUtilityDock,#vnvEcosystemUtilityUpdates,#vnvArchaemenesMentorDialog{display:none!important}}`;document.head.append(style);
 const dock=document.createElement("nav");dock.id=ROOT;dock.setAttribute("aria-label","Verve N Veda ecosystem utilities");
// Legacy campus dock is removed only after the canonical dock can mount;
// never touch lesson-specific evidence and assessment controls.
for(const legacy of ["khaeLandingUtilityDock","khaemenesHomeUtilityDock"]){
 const other=document.getElementById(legacy);
 if(other)other.style.setProperty("display","none","important");
}
 const link=(key,label,url)=>{const e=document.createElement("a");e.dataset.vnvTool=key;e.textContent=label;e.href=url;e.setAttribute("aria-label",label==="Profile"?"Open learner or scholar profile":label);dock.append(e);return e};
 const protectStudentResource=(anchor,label)=>{
  if(!academyStudentSurface())return anchor;
  anchor.target="_blank";anchor.rel="noopener noreferrer";
  anchor.setAttribute("aria-label",label+" — opens in a new tab");
  return anchor;
 };
 // One canonical chooser; no learner selection or account mutation.
 const profileLink=link("profile","Profile","#choose-profile");
 profileLink.setAttribute("aria-haspopup","dialog");
 profileLink.setAttribute("aria-controls","vnvProfileGradeChooser");
 profileLink.setAttribute("aria-label","Choose a Student or Parent Profile");
 const profileDialog=document.createElement("dialog");profileDialog.id="vnvProfileGradeChooser";profileDialog.setAttribute("aria-labelledby","vnvProfileChooseHeading");
 const chooserCss=document.createElement("style");chooserCss.id="vnvProfileGradeChooserCSS";
 chooserCss.textContent=`
 #vnvProfileGradeChooser{width:min(94vw,850px);max-height:calc(100dvh - 24px);margin:auto;padding:25px;overflow:auto;background:#fff8e9;color:#202724;border:2px solid #b48b45;border-radius:7px;box-shadow:0 22px 60px #0006}
 #vnvProfileGradeChooser::backdrop{background:rgba(10,20,18,.75)}
 #vnvProfileGradeChooser *{box-sizing:border-box}
 #vnvProfileGradeChooser header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
 #vnvProfileGradeChooser h2{font:400 33px/1.25 Cinzel,Georgia,serif;color:#202724;margin:0}
 #vnvProfileGradeChooser h3{font:400 24px/1.25 Cinzel,Georgia,serif;color:#202724;margin:19px 0 10px}
 #vnvProfileGradeChooser p{font:400 18px/1.55 Nunito,Arial,sans-serif;color:#34463b}
 #vnvProfileGradeChooser .vnv-profile-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
 #vnvProfileGradeChooser a{display:flex;align-items:center;justify-content:center;min-height:53px;padding:9px;border:1px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;text-align:center;text-decoration:none;font:400 16px/1.3 Nunito,Arial,sans-serif}
 #vnvProfileGradeChooser a:hover{background:#3a5449}
 #vnvProfileGradeChooser button{min-height:47px;padding:9px 16px;border:1px solid #202724;border-radius:7px;background:#fff8e9;color:#202724;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer}
 #vnvProfileGradeChooser a:focus-visible,#vnvProfileGradeChooser button:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
 @media(max-width:650px){#vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#vnvProfileGradeChooser{padding:15px}}
 /* Unified charcoal/parchment modal system: only these two utility dialogs. */
 #vnvProfileGradeChooser,#vnvEcosystemUtilityUpdates{
   box-sizing:border-box!important;
   border:2px solid #b48b45!important;
   border-radius:7px!important;
   background:#f4f0e7!important;
   color:#243038!important;
   box-shadow:0 24px 70px rgba(10,20,18,.38)!important;
   max-height:calc(100dvh - 32px)!important;
   overflow:auto!important;
   padding:0!important;
 }
 #vnvProfileGradeChooser{width:min(860px,calc(100vw - 32px))!important;}
 #vnvEcosystemUtilityUpdates{width:min(590px,calc(100vw - 32px))!important;max-width:none!important;}
 #vnvProfileGradeChooser::backdrop,#vnvEcosystemUtilityUpdates::backdrop{background:rgba(8,19,16,.70)!important;}
 #vnvProfileGradeChooser > header,#vnvEcosystemUtilityUpdates > header{
   display:flex!important;align-items:center!important;justify-content:center!important;
   flex-wrap:wrap!important;gap:13px!important;
   margin:0!important;padding:24px 24px 20px!important;
   border-bottom:2px solid #b48b45!important;
   background:#243038!important;color:#fff8e9!important;
   text-align:center!important;
 }
 #vnvProfileGradeChooser > header h2,#vnvEcosystemUtilityUpdates > header h2{
   flex:1 1 100%!important;margin:0!important;
   font:400 clamp(26px,4vw,33px)/1.25 Cinzel,Georgia,serif!important;
   color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
   text-align:center!important;
 }
 #vnvProfileGradeChooser > header button,#vnvEcosystemUtilityUpdates > header button{
   min-height:39px!important;padding:7px 20px!important;
   border:1px solid #c8ad76!important;border-radius:7px!important;
   background:#fff8e9!important;color:#243038!important;
   -webkit-text-fill-color:#243038!important;
   font:400 16px/1.35 Nunito,Arial,sans-serif!important;
   cursor:pointer!important;
 }
 #vnvProfileGradeChooser > p{
   max-width:730px!important;
   margin:20px auto!important;padding:0 24px!important;
   font:400 18px/1.55 Nunito,Arial,sans-serif!important;
   color:#34463b!important;text-align:center!important;
 }
 #vnvProfileGradeChooser > h3{
   margin:24px 24px 12px!important;
   font:400 24px/1.3 Cinzel,Georgia,serif!important;
   text-align:center!important;color:#243038!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid{
   display:grid!important;
   grid-template-columns:repeat(4,minmax(0,1fr))!important;
   gap:10px!important;margin:0 24px!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid a{
   min-height:48px!important;padding:10px 12px!important;
   border:1px solid #b48b45!important;border-radius:7px!important;
   background:#243038!important;color:#fff8e9!important;
   -webkit-text-fill-color:#fff8e9!important;
   font:400 16px/1.3 Nunito,Arial,sans-serif!important;
   text-align:center!important;text-decoration:none!important;
 }
 #vnvProfileGradeChooser .vnv-profile-grid a:hover{background:#394a43!important;}
 #vnvEcosystemUtilityUpdates .vnv-updates-body{
   padding:26px 26px 28px!important;text-align:center!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-body p{
   margin:0 auto 22px!important;max-width:460px!important;
   font:400 18px/1.6 Nunito,Arial,sans-serif!important;
   color:#34463b!important;text-align:center!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions{
   display:flex!important;justify-content:center!important;flex-wrap:wrap!important;gap:10px!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions a{
   display:inline-flex!important;align-items:center!important;justify-content:center!important;
   min-height:44px!important;padding:10px 18px!important;
   border:1px solid #b48b45!important;border-radius:7px!important;
   background:#243038!important;color:#fff8e9!important;
   -webkit-text-fill-color:#fff8e9!important;
   font:400 16px/1.35 Nunito,Arial,sans-serif!important;
   text-decoration:none!important;
 }
 #vnvEcosystemUtilityUpdates .vnv-updates-actions a:hover{background:#394a43!important;}
 #vnvProfileGradeChooser :is(a,button):focus-visible,
 #vnvEcosystemUtilityUpdates :is(a,button):focus-visible{outline:3px solid #b48b45!important;outline-offset:3px!important;}
 @media(max-width:650px){
   #vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;margin:0 15px!important;}
   #vnvProfileGradeChooser > header,#vnvEcosystemUtilityUpdates > header{padding:19px 14px!important;}
   #vnvProfileGradeChooser > h3{margin-inline:15px!important;}
   #vnvProfileGradeChooser > p{padding-inline:15px!important;}
   #vnvEcosystemUtilityUpdates .vnv-updates-body{padding:20px 15px!important;}
 }
 @media(max-width:360px){
   #vnvProfileGradeChooser .vnv-profile-grid{grid-template-columns:minmax(0,1fr)!important;}
 }
 `;document.head.append(chooserCss);
 const chooserHead=document.createElement("header");
 const chooserHeading=document.createElement("h2");chooserHeading.id="vnvProfileChooseHeading";chooserHeading.textContent="Choose Your Profile";
 const chooserClose=document.createElement("button");chooserClose.type="button";chooserClose.textContent="Close";chooserClose.addEventListener("click",()=>profileDialog.close());
 chooserHead.append(chooserHeading,chooserClose);profileDialog.append(chooserHead);
 const intro=document.createElement("p");intro.textContent="Choose a student grade or parent portal. Opening a grade does not change any learner's enrollment or records.";profileDialog.append(intro);
 const chooserGroups=[
  ["Early Learning",[["Pre-K",V+"Khaemenes_Preschool.github.io/student-profile/#learningStudio"],["Kindergarten",V+"Khaemenes_KinderGarden.github.io/student-profile/"]]],
  ["Elementary Grades 1–5",[1,2,3,4,5].map(n=>["Grade "+n,V+"Khaemenes_Elementary.github.io/student-profile/"] )],
  ["Middle Grades 6–8",[6,7,8].map(n=>["Grade "+n,V+"Khaemenes_Middle.github.io/grades/grade-"+String(n).padStart(2,"0")+"/"])],
  ["High School Grades 9–12",[9,10,11,12].map(n=>["Grade "+n,V+"Khaemenes_High.github.io/grades/grade-"+String(n).padStart(2,"0")+"/student-profile/"])],
  ["Family & Adult",[["Parent / Guardian",A+"family/#khaeFamilyParentProfileHero"],["Higher Learning",A+"adult/"]]]
 ];
 for(const [name,items] of chooserGroups){
  const h=document.createElement("h3");h.textContent=name;profileDialog.append(h);
  const grid=document.createElement("nav");grid.className="vnv-profile-grid";grid.setAttribute("aria-label",name);
  for(const [label,url] of items){const item=document.createElement("a");item.href=url;item.textContent=label;grid.append(item)}
  profileDialog.append(grid);
 }
 const qualifier=document.createElement("p");qualifier.textContent="Elementary grades share their current profile page. Middle School choices currently open the grade landing pages.";profileDialog.append(qualifier);
 profileLink.addEventListener("click",e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();if(!profileDialog.open)profileDialog.showModal();chooserClose.focus();
 });
 profileDialog.addEventListener("click",e=>{if(e.target===profileDialog)profileDialog.close()});
 profileDialog.addEventListener("close",()=>profileLink.focus());
 protectStudentResource(link("search","Search",V+"PLERASearch.github.io/"),"Search");
 const updates=document.createElement("button");updates.type="button";updates.dataset.vnvTool="updates";updates.textContent="Updates";dock.append(updates);
 const mentorUrl="https://artist1970.github.io/Archaemenes.github.io/#archaemenesConversation";
  // The in-dialog frame opens at the page hero, not at the lower conversation anchor.
  const mentorLandingUrl="https://artist1970.github.io/Archaemenes.github.io/";
 const mentor=link("mentor","Mentor",mentorUrl);
 mentor.setAttribute("aria-haspopup","dialog");
 mentor.setAttribute("aria-controls","vnvArchaemenesMentorDialog");
 const mentorDialog=document.createElement("dialog");
 mentorDialog.id="vnvArchaemenesMentorDialog";
 mentorDialog.setAttribute("aria-label","Conversation with Archaemenes");
 const mentorHeader=document.createElement("div");mentorHeader.className="vnv-mentor-popup-header";
 const mentorTitle=document.createElement("strong");mentorTitle.textContent="Archaemenes · Scholarly Conversation";
 const mentorActions=document.createElement("div");mentorActions.className="vnv-mentor-popup-actions";
 const mentorDirect=document.createElement("a");mentorDirect.href=mentorUrl;mentorDirect.target="_blank";mentorDirect.rel="noopener noreferrer";mentorDirect.textContent="Open Mentor in New Tab";
 const mentorClose=document.createElement("button");mentorClose.type="button";mentorClose.textContent="Close";mentorClose.setAttribute("aria-label","Close Archaemenes conversation");
 mentorClose.addEventListener("click",()=>mentorDialog.close());
 mentorActions.append(mentorDirect,mentorClose);mentorHeader.append(mentorTitle,mentorActions);
 const mentorFrame=document.createElement("iframe");mentorFrame.title="Archaemenes public mentor conversation";mentorFrame.loading="lazy";mentorFrame.referrerPolicy="no-referrer";
 mentorDialog.append(mentorHeader,mentorFrame);
 mentor.addEventListener("click",e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();try{mentorDialog.showModal();mentorFrame.src=mentorLandingUrl;mentorClose.focus()}catch{window.open(mentorUrl,"_blank","noopener,noreferrer")}});
 mentorDialog.addEventListener("click",e=>{if(e.target===mentorDialog)mentorDialog.close()});
 mentorDialog.addEventListener("close",()=>mentorFrame.removeAttribute("src"));
 protectStudentResource(link("support","Support","https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s"),"Support");
 // Beta reports carry public route context only. Never transmit search/hash,
// user state, identifiers from protected routes or filesystem/network internals.
 const betaLink=protectStudentResource(link("beta","Beta",V+"beta/"),"Beta");
 function betaPublicSource(){
  try{
   const url=new URL(location.href);
   if(url.protocol!=="https:"&&url.protocol!=="http:")return "";
   const host=url.hostname.toLowerCase();
   if(host!=="vervenveda.com"&&host!=="www.vervenveda.com"&&!/^(?:[a-z0-9-]+)\.github\.io$/.test(host))return "";
   const pathname=decodeURIComponent(url.pathname);
   const parts=pathname.split("/").filter(Boolean);
   if(parts.length>12||parts.some(part=>part.length>64||!/^[-a-zA-Z0-9_.]+$/.test(part)||/[0-9]{7,}/.test(part)||/@/.test(part)))return "";
   if(parts.some(part=>/^(?:admin|private|internal|api|account|auth|session|token|checkout|payment|vault)$/i.test(part)))return "";
   const path="/"+parts.join("/");
   return (host==="vervenveda.com"||host==="www.vervenveda.com"?path:host+path).slice(0,240);
  }catch{return ""}
 }
 const refreshBeta=()=>{
  const source=betaPublicSource();
  betaLink.href=V+"beta/"+(source?"?source="+encodeURIComponent(source):"");
 };
 betaLink.addEventListener("pointerenter",refreshBeta);
 betaLink.addEventListener("focus",refreshBeta);
 betaLink.addEventListener("click",refreshBeta,true);
 window.addEventListener("pageshow",refreshBeta);
 refreshBeta();
 const dialog=document.createElement("dialog");dialog.id="vnvEcosystemUtilityUpdates";dialog.setAttribute("aria-labelledby","vnvUpdatesHeading");
 const updatesHeader=document.createElement("header");
 const title=document.createElement("h2");title.id="vnvUpdatesHeading";title.textContent="Updates & Help";
 const close=document.createElement("button");close.type="button";close.textContent="Close";close.setAttribute("aria-label","Close Updates and Help");
 close.addEventListener("click",()=>dialog.close());updatesHeader.append(title,close);
 const updatesBody=document.createElement("div");updatesBody.className="vnv-updates-body";
 const note=document.createElement("p");note.textContent="Academy information and assistance.";
 const updatesActions=document.createElement("nav");updatesActions.className="vnv-updates-actions";updatesActions.setAttribute("aria-label","Academy assistance");
 const help=document.createElement("a");help.href=A+"#help";help.textContent="Academy Help Desk";
 updatesActions.append(help);updatesBody.append(note,updatesActions);dialog.append(updatesHeader,updatesBody);
 updates.addEventListener("click",()=>{if(!dialog.open)dialog.showModal();close.focus()});
 dialog.addEventListener("close",()=>updates.focus());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.body.append(dock,dialog,mentorDialog,profileDialog);mounted=true;
}
window.VNVEcosystemToolbar=Object.freeze({version:"1.0.7",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
```

## Gateway translator interface — FULL JavaScript source

**Source:** `assets/vnv-language.js`, blob `b65ef766cfbd0adcd88b4e7cc970a1e3ee35bd7c`.

```javascript
/* Verve N Veda 13-language public interface layer.
 * Curated translations are private/offline. An installed browser translation model
 * can finish public UI; MyMemory is never contacted without explicit confirmation.
 * Page-local learner responses and admin inputs are excluded from remote translation.
 * Content remains English when no verified translation is available. */
(()=>{"use strict";
const CODES=["en","es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"];
const ROWS=[["Explore","Explorar","Explorer","استكشف","探索","Entdecken","Исследовать"],["Halls","Salas","Salles","القاعات","展馆","Hallen","Залы"],["Matrix","Matriz","Matrice","المصفوفة","矩阵","Matrix","Матрица"],["Civic","Cívica","Civique","المدنية","公民","Bürgerwesen","Гражданское"],["Promise","Compromiso","Engagement","الوعد","承诺","Versprechen","Обещание"],["Donate","Donar","Faire un don","تبرع","捐助","Spenden","Пожертвовать"],["News","Noticias","Actualités","الأخبار","新闻","Nachrichten","Новости"],["Weather","Clima","Météo","الطقس","天气","Wetter","Погода"],["Creative","Creatividad","Créativité","الإبداع","创意","Kreatives","Творчество"],["Professional","Profesional","Professionnel","المهني","专业","Berufliches","Профессиональное"],["Education","Educación","Éducation","التعليم","教育","Bildung","Образование"],["Games","Juegos","Jeux","الألعاب","游戏","Spiele","Игры"],["Earth","Tierra","Terre","الأرض","地球","Erde","Земля"],["Health","Salud","Santé","الصحة","健康","Gesundheit","Здоровье"],["Connect","Conectar","Connexion","تواصل","连接","Verbinden","Связь"],["Finance","Finanzas","Finance","المالية","金融","Finanzen","Финансы"],["Research","Investigación","Recherche","البحث","研究","Forschung","Исследования"],["Knowledge","Conocimiento","Connaissances","المعرفة","知识","Wissen","Знания"],["Public Service","Servicio público","Service public","الخدمة العامة","公共服务","Öffentlicher Dienst","Общественная служба"],["Creative & Professional","Creativo y profesional","Créativité et métiers","الإبداع والمهن","创意与专业","Kreatives und Berufliches","Творчество и профессии"],["Gateways","Portales","Portails","البوابات","门户","Portale","Порталы"],["Pages","Páginas","Pages","الصفحات","页面","Seiten","Страницы"],["Apps","Aplicaciones","Applications","التطبيقات","应用","Apps","Приложения"],["Tools","Herramientas","Outils","الأدوات","工具","Werkzeuge","Инструменты"],["Courses","Cursos","Cours","الدورات","课程","Kurse","Курсы"],["Resources","Recursos","Ressources","الموارد","资源","Ressourcen","Ресурсы"],["Portals","Portales","Portails","البوابات","门户","Portale","Порталы"],["Workshops","Talleres","Ateliers","ورش العمل","工作坊","Workshops","Мастер-классы"],["Studios","Estudios","Studios","الاستوديوهات","工作室","Studios","Студии"],["Assessments","Evaluaciones","Évaluations","التقييمات","测评","Bewertungen","Оценивания"],["Mentors & Guides","Mentores y guías","Mentors et guides","الموجهون والمرشدون","导师与指南","Mentoren und Begleiter","Наставники и гиды"],["Explore the Ecosystem","Explorar el ecosistema","Explorer l'écosystème","استكشف المنظومة","探索生态系统","Ökosystem entdecken","Исследовать экосистему"],["Discover the Halls","Descubrir las salas","Découvrir les salles","اكتشف القاعات","发现各展馆","Hallen entdecken","Открыть залы"],["Open 333 Network","Abrir la red 333","Ouvrir le réseau 333","افتح شبكة 333","打开 333 网络","333-Netzwerk öffnen","Открыть сеть 333"],["Scroll to Explore","Desplázate para explorar","Défiler pour explorer","مرّر للاستكشاف","滚动探索","Zum Entdecken scrollen","Листайте для знакомства"],["Featured Sites","Sitios destacados","Sites à découvrir","المواقع المميزة","精选网站","Ausgewählte Seiten","Избранные сайты"],["Choose a doorway or browse its complete resources.","Elige una entrada o explora todos sus recursos.","Choisissez un portail ou parcourez toutes ses ressources.","اختر بوابة أو تصفح مواردها الكاملة.","选择入口或浏览全部资源。","Wählen Sie einen Zugang oder erkunden Sie alle Ressourcen.","Выберите раздел или изучите все его ресурсы."],["The Four Great Halls","Las cuatro grandes salas","Les quatre grandes salles","القاعات الأربع الكبرى","四大展馆","Die vier großen Hallen","Четыре главных зала"],["Many public resources. One organized home.","Muchos recursos públicos. Un espacio organizado.","De nombreuses ressources publiques. Un espace organisé.","موارد عامة كثيرة في مكان واحد منظم.","众多公共资源，汇于一处。","Viele öffentliche Ressourcen. Ein geordnetes Zuhause.","Множество открытых ресурсов. Единая система."],["Featured Public Destinations","Destinos públicos destacados","Destinations publiques à découvrir","وجهات عامة مميزة","精选公共站点","Ausgewählte öffentliche Angebote","Избранные общественные ресурсы"],["Featured across Verve N Veda","Destacado en Verve N Veda","À découvrir dans Verve N Veda","مميز عبر فيرف إن فيدا","Verve N Veda 精选","Vorgestellt bei Verve N Veda","Рекомендуем в Verve N Veda"],["Discover the ecosystem","Descubre el ecosistema","Découvrez l'écosystème","اكتشف المنظومة","发现生态系统","Entdecken Sie das Ökosystem","Откройте экосистему"],["Open in ecosystem viewer","Abrir en el visor","Ouvrir dans la visionneuse","افتح في عارض المنظومة","在站点查看器中打开","Im Ökosystem-Betrachter öffnen","Открыть в просмотрщике"],["Pause","Pausar","Pause","إيقاف مؤقت","暂停","Pause","Пауза"],["Resume","Reanudar","Reprendre","استئناف","继续","Fortsetzen","Продолжить"],["Print","Imprimir","Imprimer","طباعة","打印","Drucken","Печать"],["Verve N Veda Directory","Directorio Verve N Veda","Annuaire Verve N Veda","دليل فيرف إن فيدا","Verve N Veda 目录","Verve N Veda Verzeichnis","Каталог Verve N Veda"],["Search the complete directory","Buscar en el directorio completo","Rechercher dans tout l'annuaire","ابحث في الدليل الكامل","搜索完整目录","Gesamtes Verzeichnis durchsuchen","Поиск по всему каталогу"],["Search education, law, weather, art, veterans…","Buscar educación, derecho, clima, arte, veteranos…","Rechercher éducation, droit, météo, art, anciens combattants…","ابحث عن التعليم والقانون والطقس والفن والمحاربين القدامى…","搜索教育、法律、天气、艺术、退伍军人…","Bildung, Recht, Wetter, Kunst, Veteranen suchen…","Поиск: образование, право, погода, искусство, ветераны…"],["The Verve N Veda Promise","El compromiso de Verve N Veda","L'engagement de Verve N Veda","وعد فيرف إن فيدا","Verve N Veda 的承诺","Das Verve N Veda Versprechen","Обещание Verve N Veda"],["Welcome Home","Bienvenidos","Bienvenue","أهلاً بكم","欢迎","Willkommen","Добро пожаловать"],["Support Independent Creation","Apoya la creación independiente","Soutenir la création indépendante","ادعم الإبداع المستقل","支持独立创作","Unabhängige Kreativität unterstützen","Поддержать независимое творчество"],["Accounts","Cuentas","Comptes","الحسابات","账户","Konten","Аккаунты"],["Find My School","Encontrar mi escuela","Trouver mon école","ابحث عن مدرستي","寻找学校","Meine Schule finden","Найти школу"],["Academy Services","Servicios de la Academia","Services de l'Académie","خدمات الأكاديمية","学院服务","Akademie-Dienste","Услуги Академии"],["Beta Program","Programa beta","Programme bêta","البرنامج التجريبي","测试计划","Beta-Programm","Бета-программа"],["Help Desk","Centro de ayuda","Centre d'aide","مركز المساعدة","帮助中心","Hilfezentrum","Служба помощи"],["Front Desk","Recepción","Accueil","الاستقبال","服务台","Empfang","Приёмная"],["Schools","Escuelas","Écoles","المدارس","学校","Schulen","Школы"],["Services","Servicios","Services","الخدمات","服务","Dienste","Услуги"],["Beta","Beta","Bêta","تجريبي","测试版","Beta","Бета"],["Help","Ayuda","Aide","مساعدة","帮助","Hilfe","Помощь"],["Student Entry","Acceso de estudiantes","Accès élève","دخول الطالب","学生入口","Schülerzugang","Вход ученика"],["Create / Manage Account","Crear o gestionar cuenta","Créer ou gérer un compte","إنشاء أو إدارة حساب","创建或管理账户","Konto erstellen oder verwalten","Создать или управлять аккаунтом"],["What do you need today?","¿Qué necesitas hoy?","De quoi avez-vous besoin aujourd'hui ?","ما الذي تحتاجه اليوم؟","今天需要什么帮助？","Was brauchen Sie heute?","Что вам нужно сегодня?"],["One calm path through the front desk.","Un camino claro desde la recepción.","Un parcours serein depuis l'accueil.","مسار واضح عبر مكتب الاستقبال.","从服务台开始的清晰路径。","Ein klarer Weg durch den Empfang.","Понятный путь через приёмную."],["Go directly to the learning stage you need.","Ve directamente a la etapa educativa que necesitas.","Accédez directement au niveau d'études souhaité.","انتقل مباشرة إلى المرحلة التعليمية التي تحتاجها.","直达所需学习阶段。","Direkt zur passenden Lernstufe.","Перейдите сразу к нужной ступени обучения."],["Common questions, direct answers.","Preguntas frecuentes, respuestas claras.","Questions fréquentes, réponses directes.","أسئلة شائعة وإجابات مباشرة.","常见问题，直接解答。","Häufige Fragen, klare Antworten.","Частые вопросы, прямые ответы."],["Preschool","Preescolar","Maternelle","مرحلة ما قبل المدرسة","学前班","Vorschule","Дошкольное обучение"],["Kinder Garden","Jardín de infancia","Jardin d'enfants","رياض الأطفال","幼儿园","Kindergarten","Детский сад"],["Elementary","Primaria","École primaire","الابتدائية","小学","Grundschule","Начальная школа"],["Middle School","Escuela intermedia","Collège","المرحلة المتوسطة","初中","Mittelstufe","Средняя школа"],["High School","Secundaria superior","Lycée","المرحلة الثانوية","高中","Oberstufe","Старшая школа"],["Higher Learning","Educación superior","Enseignement supérieur","التعليم العالي","高等教育","Höhere Bildung","Высшее образование"],["Linguistics","Lingüística","Linguistique","اللغويات","语言学","Linguistik","Лингвистика"],["Student","Estudiante","Élève","طالب","学生","Lernende","Ученик"],["Family","Familia","Famille","الأسرة","家庭","Familie","Семья"],["Family / Parent","Familia / Padres","Famille / Parents","الأسرة / الوالدين","家庭／家长","Familie / Eltern","Семья / Родители"],["Teacher / Faculty","Docentes","Enseignants","المعلمون","教师","Lehrkräfte","Преподаватели"],["Adult Scholar","Estudiante adulto","Apprenant adulte","متعلم بالغ","成人学员","Erwachsene Lernende","Взрослый учащийся"],["Account","Cuenta","Compte","الحساب","账户","Konto","Аккаунт"],["School","Escuela","École","المدرسة","学校","Schule","Школа"],["Learning","Aprendizaje","Apprentissage","التعلم","学习","Lernen","Обучение"],["Records","Expedientes","Dossiers","السجلات","记录","Unterlagen","Документы"],["Academy Compass","Guía de la Academia","Boussole de l'Académie","بوصلة الأكاديمية","学院导航","Akademie-Kompass","Навигатор Академии"],["Open Student Portal","Abrir portal del estudiante","Ouvrir l'espace élève","افتح بوابة الطالب","打开学生门户","Schülerportal öffnen","Открыть портал ученика"],["Open Family Portal","Abrir portal familiar","Ouvrir l'espace famille","افتح بوابة الأسرة","打开家庭门户","Familienportal öffnen","Открыть семейный портал"],["Teacher Administration","Administración docente","Administration pédagogique","إدارة المعلمين","教师管理","Lehrerverwaltung","Управление преподавателями"],["Adult Learning","Aprendizaje para adultos","Formation des adultes","تعليم الكبار","成人学习","Erwachsenenbildung","Образование взрослых"],["Open Preschool","Abrir preescolar","Ouvrir la maternelle","افتح ما قبل المدرسة","打开学前班","Vorschule öffnen","Открыть дошкольное обучение"],["Open Kindergarten","Abrir jardín de infancia","Ouvrir le jardin d'enfants","افتح الروضة","打开幼儿园","Kindergarten öffnen","Открыть детский сад"],["Open Elementary","Abrir primaria","Ouvrir l'école primaire","افتح الابتدائية","打开小学","Grundschule öffnen","Открыть начальную школу"],["Open Middle School","Abrir escuela intermedia","Ouvrir le collège","افتح المرحلة المتوسطة","打开初中","Mittelstufe öffnen","Открыть среднюю школу"],["Open High School","Abrir secundaria","Ouvrir le lycée","افتح الثانوية","打开高中","Oberstufe öffnen","Открыть старшую школу"],["Open Higher Learning","Abrir educación superior","Ouvrir l'enseignement supérieur","افتح التعليم العالي","打开高等教育","Höhere Bildung öffnen","Открыть высшее образование"],["Open Linguistics","Abrir lingüística","Ouvrir linguistique","افتح اللغويات","打开语言学","Linguistik öffnen","Открыть лингвистику"],["Open Help Desk →","Abrir centro de ayuda →","Ouvrir l'aide →","افتح مركز المساعدة ←","打开帮助中心 →","Hilfe öffnen →","Открыть помощь →"],["Join Beta Testing →","Participar en pruebas beta →","Rejoindre le programme bêta →","انضم للاختبار التجريبي ←","加入测试 →","Am Betatest teilnehmen →","Участвовать в бета-тесте →"],["Placement & Pathways","Asignación y trayectorias","Placement et parcours","التسكين والمسارات","分班与学习路径","Einstufung und Lernwege","Распределение и траектории"],["Records & Reports","Expedientes e informes","Dossiers et rapports","السجلات والتقارير","记录与报告","Unterlagen und Berichte","Документы и отчёты"],["Help & Orientation","Ayuda y orientación","Aide et orientation","المساعدة والإرشاد","帮助与指引","Hilfe und Orientierung","Помощь и ориентация"],["Beta & Improvement","Pruebas y mejoras","Tests et améliorations","الاختبار والتحسين","测试与改进","Beta und Verbesserung","Тестирование и улучшения"]];
const POLYGLOT_ROWS=[["Language Apps","Aplicaciones de idiomas","Applications linguistiques","تطبيقات اللغات","语言应用","Sprach-Apps","Языковые приложения"],["Voice Studio","Estudio de voz","Studio vocal","استوديو الصوت","语音工作室","Sprachstudio","Голосовая студия"],["World Atlas","Atlas mundial","Atlas mondial","الأطلس العالمي","世界图集","Weltatlas","Мировой атлас"],["The World in Words","El mundo en palabras","Le monde en mots","العالم بالكلمات","语言中的世界","Die Welt in Worten","Мир в словах"],["Formal Academy","Academia formal","Académie des langues","الأكاديمية النظامية","正式学院","Sprachakademie","Языковая академия"],["Arabic Suite","Estudio de árabe","Atelier d'arabe","مجموعة العربية","阿拉伯语学习","Arabisch-Lernwelt","Арабский комплекс"],["German Studio","Estudio de alemán","Atelier d'allemand","استوديو الألمانية","德语工作室","Deutschstudio","Студия немецкого"],["Russian Studio","Estudio de ruso","Atelier de russe","استوديو الروسية","俄语工作室","Russischstudio","Студия русского"],["Language Tools","Herramientas lingüísticas","Outils linguistiques","أدوات اللغات","语言工具","Sprachwerkzeuge","Языковые инструменты"],["Enter Five-Language Academy","Entrar a la Academia de cinco idiomas","Entrer dans l'Académie des cinq langues","ادخل أكاديمية اللغات الخمس","进入五语学院","Fünf-Sprachen-Akademie öffnen","Войти в Академию пяти языков"],["Choose a voice","Elegir una voz","Choisir une voix","اختر صوتًا","选择语音","Stimme wählen","Выбрать голос"],["Begin with a greeting.","Comienza con un saludo.","Commencez par une salutation.","ابدأ بتحية.","从问候语开始。","Beginne mit einer Begrüßung.","Начните с приветствия."],["Hear phrase","Escuchar frase","Écouter la phrase","استمع للعبارة","播放短语","Satz anhören","Прослушать фразу"],["Next phrase","Siguiente frase","Phrase suivante","العبارة التالية","下一句","Nächster Satz","Следующая фраза"],["Formal Language Academy","Academia de idiomas","Académie des langues","أكاديمية اللغات","语言学院","Sprachakademie","Языковая академия"],["Open the Academy","Abrir la Academia","Ouvrir l'Académie","افتح الأكاديمية","打开学院","Akademie öffnen","Открыть Академию"],["Language Studios & Tools","Estudios y herramientas lingüísticas","Ateliers et outils linguistiques","استوديوهات وأدوات اللغات","语言工作室与工具","Sprachstudios und Werkzeuge","Языковые студии и инструменты"],["Clear","Limpiar","Effacer","مسح","清除","Löschen","Очистить"],["Hear practice text","Escuchar texto de práctica","Écouter le texte","استمع إلى نص التدريب","朗读练习文本","Übungstext anhören","Прослушать учебный текст"],["Stop speech","Detener audio","Arrêter la lecture","أوقف النطق","停止朗读","Sprachausgabe stoppen","Остановить речь"],["Use browser default","Usar voz predeterminada","Utiliser la voix par défaut","استخدم الصوت الافتراضي","使用浏览器默认语音","Browserstandard verwenden","По умолчанию"],["Listening","Comprensión auditiva","Écoute","الاستماع","听力","Hören","Аудирование"],["Speaking","Expresión oral","Expression orale","التحدث","口语","Sprechen","Говорение"],["Reading","Lectura","Lecture","القراءة","阅读","Lesen","Чтение"],["Writing","Escritura","Écriture","الكتابة","写作","Schreiben","Письмо"],["Mediation","Mediación","Médiation","الوساطة اللغوية","语言调解","Sprachmittlung","Медиация"],["Translation","Traducción","Traduction","الترجمة","翻译","Übersetzung","Перевод"],["Culture","Cultura","Culture","الثقافة","文化","Kultur","Культура"],["Formal Study","Estudios formales","Études structurées","الدراسة النظامية","正式学习","Formales Lernen","Формальное обучение"],["Local Studios","Estudios locales","Ateliers locaux","استوديوهات محلية","本地工作室","Lokale Studios","Локальные студии"],["Campus & Support","Campus y ayuda","Campus et assistance","الحرم والدعم","校园与支持","Campus und Hilfe","Кампус и поддержка"],["Return to Top","Volver arriba","Retour en haut","العودة للأعلى","返回顶部","Nach oben","Наверх"],["Connected Learning Matrix","Red de aprendizaje conectado","Réseau d'apprentissage connecté","شبكة التعلم المتصل","互联学习矩阵","Vernetzte Lernmatrix","Матрица взаимосвязанного обучения"],["Support Polyglot","Apoyar Polyglot","Soutenir Polyglot","ادعم بوليغلوت","支持 Polyglot","Polyglot unterstützen","Поддержать Polyglot"],["Open Academy","Abrir Academia","Ouvrir l'Académie","افتح الأكاديمية","打开学院","Akademie öffnen","Открыть Академию"],["Open Field Lab","Abrir laboratorio de campo","Ouvrir le laboratoire de terrain","افتح المختبر الميداني","打开实地实验室","Feldlabor öffnen","Открыть полевую лабораторию"],["Open PROSE","Abrir PROSE","Ouvrir PROSE","افتح PROSE","打开 PROSE","PROSE öffnen","Открыть PROSE"],["Open ARSHIF","Abrir ARSHIF","Ouvrir ARSHIF","افتح أرشيف","打开 ARSHIF","ARSHIF öffnen","Открыть ARSHIF"],["Switch color theme","Cambiar tema visual","Changer le thème","بدّل المظهر","切换主题","Farbschema wechseln","Сменить тему"],["Open navigation","Abrir navegación","Ouvrir la navigation","افتح التنقل","打开导航","Navigation öffnen","Открыть навигацию"],["Search language apps","Buscar aplicaciones de idiomas","Rechercher les applications","ابحث عن تطبيقات اللغات","搜索语言应用","Sprach-Apps suchen","Поиск языковых приложений"],["Language filter","Filtro de idioma","Filtre de langue","مرشح اللغة","语言筛选","Sprachfilter","Фильтр языка"],["Voice","Voz","Voix","الصوت","语音","Stimme","Голос"],["Practice text","Texto de práctica","Texte d'entraînement","نص التدريب","练习文本","Übungstext","Текст для практики"],["Speech rate","Velocidad de voz","Débit de parole","سرعة النطق","语速","Sprechtempo","Темп речи"],["Voice pitch","Tono de voz","Hauteur de voix","طبقة الصوت","音高","Tonhöhe","Высота голоса"],["All available languages","Todos los idiomas disponibles","Toutes les langues disponibles","جميع اللغات المتاحة","所有可用语言","Alle verfügbaren Sprachen","Все доступные языки"],["Browser default voice","Voz predeterminada","Voix par défaut","الصوت الافتراضي","浏览器默认语音","Browser-Standardstimme","Голос браузера по умолчанию"],["Primary navigation","Navegación principal","Navigation principale","التنقل الرئيسي","主导航","Hauptnavigation","Основная навигация"],["Quick access","Acceso rápido","Accès rapide","وصول سريع","快速访问","Schnellzugriff","Быстрый доступ"]];
for(const row of POLYGLOT_ROWS){if(!ROWS.some(existing=>existing[0]===row[0]))ROWS.push(row)}
const REVIEWED_PUBLIC_COPY={"One calm entrance to formal language study, linguistics, pronunciation, scripts, translation, cultural understanding and a growing library of local language applications—from first words through lower-division collegiate study.":{"es":"Un acceso sereno al estudio formal de idiomas, la lingüística, la pronunciación, los sistemas de escritura, la traducción, la comprensión cultural y una biblioteca creciente de aplicaciones locales, desde las primeras palabras hasta los estudios universitarios iniciales.","fr":"Une entrée sereine vers l'étude structurée des langues, la linguistique, la prononciation, les écritures, la traduction, la compréhension culturelle et une bibliothèque croissante d'applications locales, des premiers mots aux premières années d'études supérieures."},"Hear a phrase using voices already available in the learner's browser or operating system.":{"es":"Escucha una frase con las voces disponibles en el navegador o sistema operativo del estudiante.","fr":"Écoutez une phrase avec les voix déjà disponibles dans le navigateur ou le système de l'apprenant."},"Five complete pathways. Middle school through College 202.":{"es":"Cinco trayectorias completas. Desde secundaria básica hasta el nivel universitario 202.","fr":"Cinq parcours complets, du collège jusqu'au niveau universitaire 202."},"The Five-Language Academy is now the academic centerpiece of this Linguistics repository. Its 206-dossier World Language Atlas remains open beyond these five formal programs.":{"es":"La Academia de Cinco Idiomas es el núcleo académico de este repositorio de Lingüística. Su Atlas de Lenguas del Mundo, con 206 expedientes, sigue abierto más allá de estos cinco programas formales.","fr":"L'Académie des cinq langues constitue le cœur pédagogique de ce dépôt de linguistique. Son Atlas des langues du monde, riche de 206 dossiers, reste accessible au-delà de ces cinq programmes."},"Thirty local applications for focused study, practice, play, reference and exploration.":{"es":"Treinta aplicaciones locales para estudiar, practicar, jugar, consultar y explorar.","fr":"Trente applications locales pour étudier, s'exercer, jouer, consulter et explorer."},"Choose a browser voice, pace and pitch that support your practice.":{"es":"Elige una voz del navegador, una velocidad y un tono adecuados para practicar.","fr":"Choisissez une voix du navigateur, une vitesse et une hauteur adaptées à vos exercices."},"No voice recordings are collected or uploaded. The page stores only the selected voice name, language filter, rate and pitch in this browser.":{"es":"No se recopilan ni suben grabaciones de voz. Esta página solo guarda en el navegador el nombre de la voz, el filtro de idioma, la velocidad y el tono seleccionados.","fr":"Aucun enregistrement vocal n'est collecté ni téléversé. La page conserve uniquement dans ce navigateur le nom de la voix choisie, le filtre de langue, le débit et la hauteur."},"The formal Academy begins with five pathways; the archive remains open to 206 language dossiers.":{"es":"La Academia formal comienza con cinco trayectorias; el archivo mantiene disponibles 206 expedientes lingüísticos.","fr":"L'Académie formelle commence par cinq parcours; les archives restent ouvertes à 206 dossiers linguistiques."},"Language study can move naturally into research, writing, experiential learning and the wider Academy.":{"es":"El aprendizaje de idiomas puede continuar de forma natural hacia la investigación, la escritura, el aprendizaje práctico y el resto de la Academia.","fr":"L'étude des langues peut se prolonger naturellement par la recherche, l'écriture, l'apprentissage pratique et les autres espaces de l'Académie."},"Return to the central campus, student and family pathways.":{"es":"Vuelve al campus central y a los recorridos para estudiantes y familias.","fr":"Retournez au campus central et aux parcours pour les élèves et les familles."},"Think of this page as the Academy front desk. Create or resume an account, find the right school or grade, enter student and family portals, reach teacher administration, join the beta program, or simply explore the Academy.":{"es":"Piensa en esta página como la recepción de la Academia. Crea o retoma una cuenta, encuentra la escuela o el grado adecuado, entra en los portales de estudiantes y familias, accede a la administración docente, participa en el programa beta o simplemente explora la Academia.","fr":"Considérez cette page comme l'accueil de l'Académie. Créez ou reprenez un compte, trouvez l'école ou le niveau adapté, accédez aux portails élèves et familles, à l'administration pédagogique, au programme bêta, ou explorez simplement l'Académie."},"Choose the doorway that matches your role. You should not need to understand the Academy's internal architecture just to get where you are going.":{"es":"Elige el acceso correspondiente a tu función. No necesitas conocer la estructura interna de la Academia para llegar a tu destino.","fr":"Choisissez l'entrée correspondant à votre rôle. Vous n'avez pas besoin de comprendre l'organisation interne de l'Académie pour trouver votre chemin."},"All campuses remain publicly browsable. Formal enrollment and placement are handled through the appropriate learner/family account.":{"es":"Todos los campus pueden explorarse públicamente. La inscripción y la asignación de nivel se gestionan mediante la cuenta correspondiente del estudiante o la familia.","fr":"Tous les campus restent accessibles à la consultation publique. L'inscription et le placement officiel passent par le compte élève ou famille approprié."},"Common questions, direct answers.":{"es":"Preguntas frecuentes, respuestas claras.","fr":"Questions fréquentes, réponses directes."},"Keep the learner record clear and portable.":{"es":"Mantén el expediente del estudiante claro y transferible.","fr":"Gardez le dossier de l'apprenant clair et transférable."},"Free learning, even without internet access.":{"es":"Aprendizaje gratuito, incluso sin conexión a internet.","fr":"Un apprentissage gratuit, même sans connexion internet."},"An elegant public gateway to education, research, creativity, health, civic knowledge, environmental stewardship, compassionate service, and intelligent navigation through the connected Verve N Veda ecosystem.":{"es":"Un elegante portal público hacia la educación, la investigación, la creatividad, la salud, el conocimiento cívico, la protección ambiental, el servicio solidario y la navegación inteligente por el ecosistema conectado de Verve N Veda.","fr":"Un portail public élégant vers l'éducation, la recherche, la créativité, la santé, les savoirs civiques, la protection de l'environnement, la solidarité et une navigation intelligente dans l'écosystème connecté de Verve N Veda."},"Choose a doorway or browse its complete resources.":{"es":"Elige una entrada o explora todos sus recursos.","fr":"Choisissez une entrée ou parcourez l'ensemble de ses ressources."},"The ecosystem is arranged into four balanced families so visitors can find the right doorway without being overwhelmed.":{"es":"El ecosistema se organiza en cuatro grupos equilibrados para que los visitantes encuentren el acceso adecuado sin sentirse abrumados.","fr":"L'écosystème est organisé en quatre ensembles équilibrés afin que les visiteurs trouvent facilement leur entrée, sans être submergés."},"Many public resources. One organized home.":{"es":"Muchos recursos públicos. Un hogar organizado.","fr":"De nombreuses ressources publiques, réunies en un lieu organisé."},"A network designed to connect rather than divide.":{"es":"Una red diseñada para unir, no para dividir.","fr":"Un réseau conçu pour rassembler plutôt que diviser."},"Enter through one doorway. Discover an entire world.":{"es":"Entra por una puerta. Descubre un mundo entero.","fr":"Franchissez une porte. Découvrez tout un monde."},"Verve N Veda is built as a public bridge between knowledge, creativity, service, community, and the lifelong practice of becoming.":{"es":"Verve N Veda es un puente público entre el conocimiento, la creatividad, el servicio, la comunidad y el aprendizaje y desarrollo personal a lo largo de la vida.","fr":"Verve N Veda est un pont ouvert à tous entre les connaissances, la créativité, le service, la communauté et l'évolution personnelle tout au long de la vie."}};
const EXPANDED_PHRASES={"All":{"es":"Todos","fr":"Tout","ar":"الكل","zh":"全部","de":"Alle","ru":"Все","pt":"Todos","hi":"सभी","ja":"すべて","ko":"전체","it":"Tutti","bn":"সব"},"Open":{"es":"Abrir","fr":"Ouvrir","ar":"افتح","zh":"打开","de":"Öffnen","ru":"Открыть","pt":"Abrir","hi":"खोलें","ja":"開く","ko":"열기","it":"Apri","bn":"খুলুন"},"Browse 30 local apps":{"es":"Explorar 30 aplicaciones locales","fr":"Explorer 30 applications locales","ar":"تصفح 30 تطبيقًا محليًا","zh":"浏览30个本地应用","de":"30 lokale Apps entdecken","ru":"Посмотреть 30 локальных приложений","pt":"Explorar 30 aplicativos locais","hi":"30 स्थानीय ऐप देखें","ja":"30個のアプリを見る","ko":"로컬 앱 30개 보기","it":"Esplora 30 app locali","bn":"৩০টি স্থানীয় অ্যাপ দেখুন"},"Five-Language Academy":{"es":"Academia de cinco idiomas","fr":"Académie des cinq langues","ar":"أكاديمية اللغات الخمس","zh":"五语学院","de":"Fünf-Sprachen-Akademie","ru":"Академия пяти языков","pt":"Academia de cinco idiomas","hi":"पाँच भाषा अकादमी","ja":"五言語アカデミー","ko":"5개 언어 아카데미","it":"Accademia delle cinque lingue","bn":"পাঁচ ভাষার একাডেমি"},"Sovereign Translator":{"es":"Traductor soberano","fr":"Traducteur souverain","ar":"المترجم المستقل","zh":"自主翻译工具","de":"Souveräner Übersetzer","ru":"Независимый переводчик","pt":"Tradutor soberano","hi":"स्वतंत्र अनुवादक","ja":"自主翻訳ツール","ko":"독립 번역기","it":"Traduttore sovrano","bn":"স্বাধীন অনুবাদক"},"Arabic Language":{"es":"Lengua árabe","fr":"Langue arabe","ar":"اللغة العربية","zh":"阿拉伯语","de":"Arabische Sprache","ru":"Арабский язык","pt":"Língua árabe","hi":"अरबी भाषा","ja":"アラビア語","ko":"아랍어","it":"Lingua araba","bn":"আরবি ভাষা"},"English / ESL":{"es":"Inglés / ESL","fr":"Anglais / ALS","ar":"الإنجليزية / تعليمها لغير الناطقين","zh":"英语／第二语言学习","de":"Englisch / ESL","ru":"Английский / ESL","pt":"Inglês / ESL","hi":"अंग्रेज़ी / ESL","ja":"英語／ESL","ko":"영어 / ESL","it":"Inglese / ESL","bn":"ইংরেজি / ESL"},"Qur'anic Arabic":{"es":"Árabe coránico","fr":"Arabe coranique","ar":"العربية القرآنية","zh":"古兰经阿拉伯语","de":"Koranarabisch","ru":"Коранический арабский","pt":"Árabe corânico","hi":"क़ुरआनी अरबी","ja":"クルアーン・アラビア語","ko":"꾸란 아랍어","it":"Arabo coranico","bn":"কোরআনিক আরবি"},"Language Compass":{"es":"Brújula de idiomas","fr":"Boussole des langues","ar":"بوصلة اللغات","zh":"语言指南针","de":"Sprachenkompass","ru":"Языковой компас","pt":"Bússola de idiomas","hi":"भाषा दिशा-सूचक","ja":"言語コンパス","ko":"언어 나침반","it":"Bussola linguistica","bn":"ভাষা দিকদর্শন"},"Start at the Front Desk":{"es":"Empezar en recepción","fr":"Commencer à l'accueil","ar":"ابدأ من الاستقبال","zh":"从服务台开始","de":"Am Empfang beginnen","ru":"Начать с приёмной","pt":"Começar na recepção","hi":"स्वागत कक्ष से शुरू करें","ja":"受付から始める","ko":"안내 데스크에서 시작","it":"Inizia dall'accoglienza","bn":"অভ্যর্থনা থেকে শুরু করুন"},"Welcome to the Academy":{"es":"Bienvenidos a la Academia","fr":"Bienvenue à l'Académie","ar":"أهلًا بك في الأكاديمية","zh":"欢迎来到学院","de":"Willkommen in der Akademie","ru":"Добро пожаловать в Академию","pt":"Boas-vindas à Academia","hi":"अकादमी में स्वागत है","ja":"アカデミーへようこそ","ko":"아카데미에 오신 것을 환영합니다","it":"Benvenuti all'Accademia","bn":"একাডেমিতে স্বাগতম"},"The Four Great Halls":{"es":"Las cuatro grandes salas","fr":"Les quatre grandes salles","ar":"القاعات الأربع الكبرى","zh":"四大展馆","de":"Die vier großen Hallen","ru":"Четыре великих зала","pt":"Os quatro grandes salões","hi":"चार विशाल सभागार","ja":"四大ホール","ko":"네 개의 큰 홀","it":"Le quattro grandi sale","bn":"চারটি প্রধান হল"},"Welcome Home":{"es":"Bienvenidos a casa","fr":"Bienvenue chez vous","ar":"أهلًا بك في بيتك","zh":"欢迎回家","de":"Willkommen zu Hause","ru":"Добро пожаловать домой","pt":"Boas-vindas ao lar","hi":"घर में स्वागत है","ja":"おかえりなさい","ko":"집에 오신 것을 환영합니다","it":"Benvenuti a casa","bn":"বাড়িতে স্বাগতম"},"Browse Every Public Hall":{"es":"Explorar todas las salas públicas","fr":"Explorer toutes les salles publiques","ar":"تصفح جميع القاعات العامة","zh":"浏览所有公共展馆","de":"Alle öffentlichen Hallen entdecken","ru":"Все открытые залы","pt":"Explorar todos os salões públicos","hi":"सभी सार्वजनिक सभागार देखें","ja":"すべての公開ホールを見る","ko":"모든 공개 홀 보기","it":"Esplora tutte le sale pubbliche","bn":"সব উন্মুক্ত হল দেখুন"}};
const TITLE_TRANSLATIONS={"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"es":"Polyglot | Khaemenes Academy: Lingüística e idiomas del mundo","fr":"Polyglot | Khaemenes Academy : linguistique et langues du monde","ar":"Polyglot | أكاديمية خيمينيس: اللغويات ولغات العالم","zh":"Polyglot | Khaemenes 学院：语言学与世界语言","de":"Polyglot | Khaemenes Academy: Linguistik und Weltsprachen","ru":"Polyglot | Академия Хеменес: лингвистика и языки мира","pt":"Polyglot | Academia Khaemenes: Linguística e línguas do mundo","hi":"Polyglot | खेमेनेस अकादमी: भाषाविज्ञान और विश्व भाषाएँ","ja":"Polyglot | Khaemenes Academy：言語学と世界の言語","ko":"Polyglot | Khaemenes Academy: 언어학과 세계 언어","it":"Polyglot | Accademia Khaemenes: linguistica e lingue del mondo","bn":"Polyglot | খেমেনেস একাডেমি: ভাষাবিজ্ঞান ও বিশ্বভাষা"},"Khaemenes Academy | Front Desk":{"es":"Khaemenes Academy | Recepción","fr":"Khaemenes Academy | Accueil","ar":"أكاديمية خيمينيس | الاستقبال","zh":"Khaemenes 学院 | 服务台","de":"Khaemenes Academy | Empfang","ru":"Академия Хеменес | Приёмная","pt":"Academia Khaemenes | Recepção","hi":"खेमेनेस अकादमी | स्वागत कक्ष","ja":"Khaemenes Academy | 受付","ko":"Khaemenes Academy | 안내 데스크","it":"Accademia Khaemenes | Accoglienza","bn":"খেমেনেস একাডেমি | অভ্যর্থনা"},"Verve N Veda | Public Gateway":{"es":"Verve N Veda | Portal público","fr":"Verve N Veda | Portail public","ar":"فيرف إن فيدا | البوابة العامة","zh":"Verve N Veda | 公共门户","de":"Verve N Veda | Öffentliches Portal","ru":"Verve N Veda | Общедоступный портал","pt":"Verve N Veda | Portal público","hi":"Verve N Veda | सार्वजनिक पोर्टल","ja":"Verve N Veda | 公開ポータル","ko":"Verve N Veda | 공개 포털","it":"Verve N Veda | Portale pubblico","bn":"Verve N Veda | উন্মুক্ত প্রবেশদ্বার"}};
const EXTENDED={"Language":["Idioma","भाषा","言語","언어","Lingua","ভাষা"],"Explore":["Explorar","देखें","探索","탐색","Esplora","অন্বেষণ"],"Halls":["Salões","सभागार","ホール","홀","Sale","হল"],"Matrix":["Matriz","मैट्रिक्स","マトリックス","매트릭스","Matrice","ম্যাট্রিক্স"],"Academy":["Academia","अकादमी","アカデミー","아카데미","Accademia","একাডেমি"],"Education":["Educação","शिक्षा","教育","교육","Istruzione","শিক্ষা"],"Language Apps":["Aplicativos de idiomas","भाषा ऐप","語学アプリ","언어 앱","App linguistiche","ভাষা অ্যাপ"],"Voice Studio":["Estúdio de voz","वॉइस स्टूडियो","音声スタジオ","음성 스튜디오","Studio vocale","ভয়েস স্টুডিও"],"World Atlas":["Atlas mundial","विश्व एटलस","世界地図帳","세계 지도책","Atlante mondiale","বিশ্ব অ্যাটলাস"],"Research":["Pesquisa","अनुसंधान","研究","연구","Ricerca","গবেষণা"],"News":["Notícias","समाचार","ニュース","뉴스","Notizie","সংবাদ"],"Weather":["Clima","मौसम","天気","날씨","Meteo","আবহাওয়া"],"Creative":["Criatividade","सृजनात्मक","創作","창작","Creatività","সৃজনশীল"],"Professional":["Profissional","पेशेवर","専門","전문","Professionale","পেশাদার"],"Games":["Jogos","खेल","ゲーム","게임","Giochi","গেম"],"Earth":["Terra","पृथ्वी","地球","지구","Terra","পৃথিবী"],"Health":["Saúde","स्वास्थ्य","健康","건강","Salute","স্বাস্থ্য"],"Connect":["Conectar","जुड़ें","つながる","연결","Connetti","সংযুক্ত করুন"],"Finance":["Finanças","वित्त","金融","재정","Finanza","অর্থব্যবস্থা"],"Civic":["Cidadania","नागरिक","市民","시민","Civico","নাগরিক"],"Promise":["Compromisso","वादा","約束","약속","Impegno","প্রতিশ্রুতি"],"Donate":["Doar","दान करें","寄付","기부","Dona","অনুদান দিন"],"Gateways":["Portais","प्रवेश द्वार","入口","포털","Portali","প্রবেশপথ"],"Pages":["Páginas","पृष्ठ","ページ","페이지","Pagine","পৃষ্ঠা"],"Apps":["Aplicativos","ऐप","アプリ","앱","App","অ্যাপ"],"Tools":["Ferramentas","उपकरण","ツール","도구","Strumenti","সরঞ্জাম"],"Courses":["Cursos","पाठ्यक्रम","コース","과정","Corsi","কোর্স"],"Resources":["Recursos","संसाधन","資料","자료","Risorse","রিসোর্স"],"Portals":["Portais","पोर्टल","ポータル","포털","Portali","পোর্টাল"],"Workshops":["Oficinas","कार्यशालाएँ","ワークショップ","워크숍","Laboratori","কর্মশালা"],"Studios":["Estúdios","स्टूडियो","スタジオ","스튜디오","Studi","স্টুডিও"],"Assessments":["Avaliações","मूल्यांकन","評価","평가","Valutazioni","মূল্যায়ন"],"Language Tools":["Ferramentas de idiomas","भाषा उपकरण","言語ツール","언어 도구","Strumenti linguistici","ভাষার সরঞ্জাম"],"Formal Academy":["Academia formal","औपचारिक अकादमी","正規アカデミー","정규 아카데미","Accademia formale","আনুষ্ঠানিক একাডেমি"],"Formal Study":["Estudo formal","औपचारिक अध्ययन","正規学習","정규 학습","Studi formali","আনুষ্ঠানিক শিক্ষা"],"Local Studios":["Estúdios locais","स्थानीय स्टूडियो","ローカルスタジオ","로컬 스튜디오","Studi locali","স্থানীয় স্টুডিও"],"Schools":["Escolas","विद्यालय","学校","학교","Scuole","স্কুল"],"Services":["Serviços","सेवाएँ","サービス","서비스","Servizi","সেবা"],"Accounts":["Contas","खाते","アカウント","계정","Account","অ্যাকাউন্ট"],"Help Desk":["Central de ajuda","सहायता केंद्र","ヘルプデスク","안내 데스크","Centro assistenza","সহায়তা কেন্দ্র"],"Beta Program":["Programa beta","बीटा कार्यक्रम","ベータプログラム","베타 프로그램","Programma beta","বিটা প্রোগ্রাম"],"Help":["Ajuda","सहायता","ヘルプ","도움말","Aiuto","সাহায্য"],"Beta":["Beta","बीटा","ベータ","베타","Beta","বিটা"],"Student":["Estudante","विद्यार्थी","学生","학생","Studente","শিক্ষার্থী"],"Family":["Família","परिवार","家族","가족","Famiglia","পরিবার"],"Teacher":["Professor","शिक्षक","教師","교사","Insegnante","শিক্ষক"],"Learning":["Aprendizagem","सीखना","学習","학습","Apprendimento","শেখা"],"Records":["Registros","अभिलेख","記録","기록","Documenti","নথি"],"Linguistics":["Linguística","भाषाविज्ञान","言語学","언어학","Linguistica","ভাষাবিজ্ঞান"],"Spanish":["Espanhol","स्पेनिश","スペイン語","스페인어","Spagnolo","স্প্যানিশ"],"French":["Francês","फ़्रेंच","フランス語","프랑스어","Francese","ফরাসি"],"German":["Alemão","जर्मन","ドイツ語","독일어","Tedesco","জার্মান"],"Russian":["Russo","रूसी","ロシア語","러시아어","Russo","রুশ"],"Arabic":["Árabe","अरबी","アラビア語","아랍어","Arabo","আরবি"],"Mandarin Chinese":["Chinês mandarim","मंदारिन चीनी","中国語（普通話）","중국어(표준어)","Cinese mandarino","ম্যান্ডারিন চীনা"],"Japanese":["Japonês","जापानी","日本語","일본어","Giapponese","জাপানি"],"Listening":["Escuta","सुनना","聞くこと","듣기","Ascolto","শোনা"],"Speaking":["Fala","बोलना","話すこと","말하기","Conversazione","বলা"],"Reading":["Leitura","पढ़ना","読むこと","읽기","Lettura","পড়া"],"Writing":["Escrita","लिखना","書くこと","쓰기","Scrittura","লেখা"],"Translation":["Tradução","अनुवाद","翻訳","번역","Traduzione","অনুবাদ"],"Culture":["Cultura","संस्कृति","文化","문화","Cultura","সংস্কৃতি"],"Mediation":["Mediação","मध्यस्थता","仲介","중재","Mediazione","মধ্যস্থতা"],"Voice":["Voz","आवाज़","音声","음성","Voce","কণ্ঠ"],"Search":["Pesquisar","खोजें","検索","검색","Cerca","অনুসন্ধান"],"Clear":["Limpar","साफ़ करें","クリア","지우기","Cancella","মুছুন"],"Begin with a greeting.":["Comece com uma saudação.","एक अभिवादन से शुरू करें।","あいさつから始めましょう。","인사말로 시작하세요.","Inizia con un saluto.","একটি অভিবাদন দিয়ে শুরু করুন।"],"Hear phrase":["Ouvir frase","वाक्य सुनें","フレーズを聞く","문구 듣기","Ascolta la frase","বাক্যটি শুনুন"],"Next phrase":["Próxima frase","अगला वाक्य","次のフレーズ","다음 문구","Frase successiva","পরবর্তী বাক্য"],"Choose a voice":["Escolher uma voz","आवाज़ चुनें","音声を選択","음성 선택","Scegli una voce","কণ্ঠ বেছে নিন"],"Open the Academy":["Abrir a Academia","अकादमी खोलें","アカデミーを開く","아카데미 열기","Apri l'Accademia","একাডেমি খুলুন"],"Open Academy":["Abrir Academia","अकादमी खोलें","アカデミーを開く","아카데미 열기","Apri Accademia","একাডেমি খুলুন"],"Support Polyglot":["Apoiar o Polyglot","पॉलीग्लॉट का समर्थन करें","Polyglotを支援","Polyglot 후원","Sostieni Polyglot","Polyglot-কে সহায়তা করুন"],"Switch color theme":["Alterar tema de cores","रंग थीम बदलें","テーマを切り替える","테마 변경","Cambia tema","রঙের থিম বদলান"],"Open navigation":["Abrir navegação","नेविगेशन खोलें","ナビゲーションを開く","탐색 메뉴 열기","Apri navigazione","নেভিগেশন খুলুন"],"Language filter":["Filtro de idioma","भाषा फ़िल्टर","言語フィルター","언어 필터","Filtro lingua","ভাষা ফিল্টার"],"Practice text":["Texto de prática","अभ्यास पाठ","練習テキスト","연습 텍스트","Testo di esercizio","অনুশীলনের পাঠ্য"],"Speech rate":["Velocidade da fala","बोलने की गति","読み上げ速度","말하기 속도","Velocità voce","বলার গতি"],"Voice pitch":["Tom da voz","आवाज़ की पिच","声の高さ","음성 높이","Tono della voce","কণ্ঠের স্বর"],"Hear practice text":["Ouvir texto de prática","अभ्यास पाठ सुनें","練習テキストを聞く","연습 텍스트 듣기","Ascolta testo","অনুশীলনের পাঠ্য শুনুন"],"Stop speech":["Parar fala","बोलना रोकें","読み上げを停止","음성 중지","Ferma lettura","কণ্ঠ বন্ধ করুন"],"Use browser default":["Usar padrão do navegador","ब्राउज़र डिफ़ॉल्ट उपयोग करें","ブラウザーの既定を使用","브라우저 기본값 사용","Usa predefinito","ব্রাউজারের ডিফল্ট ব্যবহার করুন"],"Return to Top":["Voltar ao topo","ऊपर जाएँ","ページの先頭へ","맨 위로","Torna su","উপরে ফিরুন"],"Primary navigation":["Navegação principal","मुख्य नेविगेशन","メインナビゲーション","기본 탐색","Navigazione principale","প্রধান নেভিগেশন"],"Quick access":["Acesso rápido","त्वरित पहुँच","クイックアクセス","빠른 접근","Accesso rapido","দ্রুত প্রবেশ"],"World Language Atlas":["Atlas das línguas do mundo","विश्व भाषा एटलस","世界言語アトラス","세계 언어 지도","Atlante delle lingue del mondo","বিশ্ব ভাষা অ্যাটলাস"]};
const MAP=new Map(ROWS.map(row=>[row[0],row]));
const META={"en":["English","Language"],"es":["Español","Idioma"],"fr":["Français","Langue"],"ar":["العربية","اللغة"],"zh":["中文","语言"],"de":["Deutsch","Sprache"],"ru":["Русский","Язык"],"pt":["Português","Idioma"],"hi":["हिन्दी","भाषा"],"ja":["日本語","言語"],"ko":["한국어","언어"],"it":["Italiano","Lingua"],"bn":["বাংলা","ভাষা"]};
const CONTROL_LABELS={"en":["Translate remaining text","Translation audit","Working…","English source","translated","phrases to review"],"es":["Traducir texto pendiente","Informe de traducción","Traduciendo…","Texto original en inglés","traducido","frases por revisar"],"fr":["Traduire le texte restant","Rapport de traduction","Traduction…","Texte original anglais","traduit","expressions à revoir"],"ar":["ترجمة النص المتبقي","تقرير الترجمة","جارٍ الترجمة…","النص الأصلي بالإنجليزية","مترجم","عبارات للمراجعة"],"zh":["翻译剩余文本","翻译检查报告","翻译中…","英文原文","已翻译","条待审核"],"de":["Restlichen Text übersetzen","Übersetzungsbericht","Übersetzung läuft…","Englischer Originaltext","übersetzt","Einträge zur Prüfung"],"ru":["Перевести оставшийся текст","Отчёт о переводе","Перевод…","Английский оригинал","переведено","фраз на проверку"],"pt":["Traduzir texto restante","Relatório de tradução","Traduzindo…","Texto original em inglês","traduzido","frases para revisar"],"hi":["शेष पाठ का अनुवाद","अनुवाद रिपोर्ट","अनुवाद जारी…","मूल अंग्रेज़ी पाठ","अनूदित","वाक्यांश समीक्षा के लिए"],"ja":["残りの文章を翻訳","翻訳レポート","翻訳中…","英語の原文","翻訳済み","要確認の文"],"ko":["남은 텍스트 번역","번역 검토 보고서","번역 중…","영어 원문","번역됨","검토할 문구"],"it":["Traduci testo rimanente","Rapporto traduzioni","Traduzione in corso…","Testo inglese originale","tradotto","frasi da rivedere"],"bn":["বাকি পাঠ্য অনুবাদ করুন","অনুবাদ প্রতিবেদন","অনুবাদ চলছে…","মূল ইংরেজি পাঠ্য","অনূদিত","পর্যালোচনার বাক্য"]};
const KEY="vnv_language_v1",PARAM="lang";
const original=new WeakMap(),lastRendered=new WeakMap(),attributeBase=new WeakMap(),lastAttrs=new WeakMap();
const titleState={source:document.title,rendered:null};
let coverageScheduled=false;
/* Translation coverage engine: static and dynamically inserted public UI only. */
const LANG_CACHE_KEY="vnv_translated_phrases_v2";
const SESSION_TRANSLATION_KEY="vnv_public_translation_consent_v1";
let translationsCache={};
try{translationsCache=JSON.parse(localStorage.getItem(LANG_CACHE_KEY)||"{}")||{}}catch{}
let translationBusy=false,translationStop=false;
function getConsent(){try{return sessionStorage.getItem(SESSION_TRANSLATION_KEY)}catch{return null}}
function setConsent(v){try{sessionStorage.setItem(SESSION_TRANSLATION_KEY,v)}catch{}}
function requestOnlineConsent(){
 const answer=window.confirm("Complete this public page's untranslated text with MyMemory? Only public page text is sent to the translation service. Learner answers, account data and private workspaces are excluded. Cancel keeps this page offline.");
 setConsent(answer?"yes":"no");return answer;
}
function cacheKey(src,code){return code+"|"+src}
function cachedTranslation(src,code){return translationsCache[cacheKey(src,code)]||null}
function cacheTranslation(src,code,value){
 if(!value||!value.trim())return;
 translationsCache[cacheKey(src,code)]=value;
 const all=Object.entries(translationsCache);if(all.length>1600)translationsCache=Object.fromEntries(all.slice(-1200));
 try{localStorage.setItem(LANG_CACHE_KEY,JSON.stringify(translationsCache))}catch{}
}
function shouldTranslateText(src){return /[\p{L}]/u.test(src) && src.length>=2}
function translationEvidence(source){
 if(lang==="en")return "source-language";
 const hit=window.KhaemenesSovereignTranslate?.lookupLocal?.({from:"en",to:lang,text:source});
 if(hit?.verified===true&&hit.translation)return "locally-reviewed";
 const idx=CODES.indexOf(lang),row=MAP.get(source);
 if(EXPANDED_PHRASES[source]?.[lang]||(row&&idx<7&&row[idx])||(idx>=7&&EXTENDED[source]?.[idx-7])||TITLE_TRANSLATIONS[source]?.[lang]||REVIEWED_PUBLIC_COPY[source]?.[lang])return "curated-public-copy";
 if(/^Open (.+)$/.test(source)&&EXPANDED_PHRASES.Open?.[lang]&&translate(source))return "composed-interface";
 if(hit?.translation)return "unreviewed-source-draft";
 if(cachedTranslation(source,lang))return "machine-or-browser-cache";
 return "untranslated";
}
function coverage(){
 const missing=new Set();let total=0,covered=0;
 const evidence={"source-language":0,"locally-reviewed":0,"curated-public-copy":0,"composed-interface":0,"unreviewed-source-draft":0,"machine-or-browser-cache":0,"untranslated":0};
 function count(source){const type=translationEvidence(source);total++;evidence[type]++;if(type==="untranslated")missing.add(source);else covered++;}

 const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=walk.nextNode())){if(!n.parentElement||ignored(n.parentElement))continue;
  const source=normalize(original.get(n)===undefined?n.nodeValue:original.get(n));
  if(!shouldTranslateText(source))continue;
  count(source);
 }
 for(const el of document.querySelectorAll("[placeholder],[aria-label],[title],[alt]")){
  if(ignored(el))continue;
  const attrs=attributeBase.get(el)||{};
  for(const key of ["placeholder","aria-label","title","alt"]){
   const source=normalize(attrs[key]??el.getAttribute(key)??"");
   if(!shouldTranslateText(source))continue;
   count(source);
  }
 }
 if(shouldTranslateText(titleState.source)){
  total++;if(lang==="en"||translate(titleState.source))covered++;else missing.add(titleState.source);
 }
 return {language:lang,total,translated:covered,missing:missing.size,evidence,coverageMeaning:"Source-string lookup categories; not independent human accuracy verification.",samples:[...missing].slice(0,20),untranslated:[...missing]};
}
function updateCoverage(){
 const c=coverage(),labels=CONTROL_LABELS[lang]||CONTROL_LABELS.en;
 for(const el of document.querySelectorAll("[data-vnv-coverage]")){
  // Show provenance rather than suggesting every available phrase is independently verified.
  const e=c.evidence;
  const drafts=e["unreviewed-source-draft"]+e["machine-or-browser-cache"];
  el.textContent=lang==="en"?labels[3]:
   `${Math.round(100*c.translated/Math.max(c.total,1))}% available · ${e["locally-reviewed"]} reviewed · ${e["curated-public-copy"]} curated · ${drafts} drafts · ${e.untranslated} untranslated`;
  el.title="Source-string matches, not a human accuracy score. Composed interface: "+e["composed-interface"]+
   "; unreviewed source: "+e["unreviewed-source-draft"]+"; machine/browser cache: "+e["machine-or-browser-cache"]+
   "; original language: "+e["source-language"]+". Export Translation audit for full details.";
  el.lang="en";el.dir="ltr";
 }
}
function scheduleCoverage(){
 if(coverageScheduled)return;
 coverageScheduled=true;
 requestAnimationFrame(()=>{coverageScheduled=false;updateCoverage()});
}
function exportTranslationAudit(){
 const report={version:1,page:location.pathname,language:lang,generatedAt:new Date().toISOString(),...coverage()};
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.download="translation-coverage-"+lang+".json";a.href=url;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function addCoverageControl(wrap){
 const progress=document.createElement("span");progress.dataset.vnvCoverage="1";progress.setAttribute("role","status");progress.setAttribute("data-i18n-ignore","");progress.style.cssText="font-size:11px;line-height:1.4;color:#544f42;white-space:normal;max-width:165px";
 const btn=document.createElement("button");btn.type="button";btn.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[0];btn.className="vnv-translate-complete";
 btn.title="Complete missing public-page translations on this device when possible; online service only after consent";btn.setAttribute("data-i18n-ignore","");
 btn.addEventListener("click",completeMissingTranslations);
 const audit=document.createElement("button");audit.type="button";
 audit.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[1];audit.className="vnv-translation-audit";
 audit.setAttribute("data-i18n-ignore","");
 audit.title="Export missing visible public page phrases as JSON";
 audit.addEventListener("click",exportTranslationAudit);
 wrap.append(progress,btn,audit);
}
async function localTranslator(target){
 const api=window.Translator;
 if(!api||typeof api.create!=="function")return null;
 let result;try{result=typeof api.availability==="function"?await api.availability({sourceLanguage:"en",targetLanguage:target}):"available"}catch{return null}
 if(result==="unavailable")return null;
 try{return await api.create({sourceLanguage:"en",targetLanguage:target})}catch{return null}
}
async function onlineTranslate(src,target){
 if(src.length>410){
  const words=src.split(/\s+/u),pieces=[],parts=[];let part="";
  for(const word of words){
   if((part+" "+word).length>380&&part){pieces.push(part);part=word}else part+=(part?" ":"")+word;
  }
  if(part)pieces.push(part);
  for(const piece of pieces)parts.push(await onlineTranslate(piece,target));
  return parts.join(" ");
 }
 const query=new URL("https://api.mymemory.translated.net/get");
 query.searchParams.set("q",src);query.searchParams.set("langpair","en|"+target);
 const response=await fetch(query.href,{method:"GET",credentials:"omit",referrerPolicy:"no-referrer",cache:"no-store"});
 if(!response.ok)throw Error("Translation service unavailable");
 const payload=await response.json();
 const txt=String(payload?.responseData?.translatedText||"").trim();
 if(!txt||Number(payload.responseStatus||200)>=400)throw Error("Translation service rejected request");
 const holder=document.createElement("textarea");holder.innerHTML=txt;return holder.value;
}
function updateProgress(msg){for(const el of document.querySelectorAll("[data-vnv-coverage]"))el.textContent=msg}
async function completeMissingTranslations(){
 if(lang==="en"||translationBusy)return;
 const target=lang;translationBusy=true;translationStop=false;
 document.querySelectorAll(".vnv-translate-complete").forEach(b=>{b.disabled=true;b.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[2]});
 try{
  const originals=new Set();const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(!node.parentElement||ignored(node.parentElement)||node.parentElement.closest("#adminGate,form,[data-private],[data-learner],[data-student],[data-account],[data-i18n-no-online]"))continue;
   const text=normalize(original.get(node)??node.nodeValue);
   if(shouldTranslateText(text)&&!translate(text))originals.add(text);
  }
  for(const el of document.querySelectorAll("[placeholder],[aria-label],[title],[alt]")){
   if(ignored(el)||el.closest("#adminGate,form,[data-private],[data-learner],[data-student],[data-account],[data-i18n-no-online]"))continue;
   const attrs=attributeBase.get(el)||{};
   for(const key of ["placeholder","aria-label","title","alt"]){
    const text=normalize(attrs[key]??el.getAttribute(key)??"");
    if(shouldTranslateText(text)&&!translate(text))originals.add(text);
   }
  }
  if(shouldTranslateText(titleState.source)&&!translate(titleState.source))originals.add(titleState.source);
  const remaining=[...originals];if(!remaining.length){updateCoverage();return}
  let machine=await localTranslator(target),useOnline=false;
  if(!machine){
   const approved=getConsent()==="yes"||requestOnlineConsent();
   if(!approved){updateProgress("Offline translations only · online translation declined");return}
   useOnline=true;
  }
  let done=0,failed=0;
  for(const text of remaining){
   if(target!==lang||translationStop)break;
   try{
    const value=useOnline?await onlineTranslate(text,target):await machine.translate(text);
    if(value&&value.trim()&&normalize(value)!==text)cacheTranslation(text,target,value.trim());
    else failed++;
   }catch{failed++}
   done++;if(done%3===0||done===remaining.length){translateTree(document.body);updateProgress(`${done}/${remaining.length} checked · ${failed} unavailable`)}
   if(useOnline)await new Promise(r=>setTimeout(r,260));
  }
  translateTree(document.body);translatePageTitle();updateCoverage();
  if(failed)updateProgress(`${coverage().translated}/${coverage().total} translated · ${failed} automated translations unavailable`);
  if(machine&&typeof machine.destroy==="function")machine.destroy();
 }finally{translationBusy=false;document.querySelectorAll(".vnv-translate-complete").forEach(b=>{b.disabled=false;b.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[0]})}
}
const normalize=s=>String(s).replace(/\s+/g," ").trim();
function readPref(){try{return localStorage.getItem(KEY)}catch{return null}}
function storePref(v){try{localStorage.setItem(KEY,v)}catch{}}
const params=new URLSearchParams(location.search);
const urlLang=params.get(PARAM);
let lang=CODES.includes(urlLang)?urlLang:(CODES.includes(readPref())?readPref():"en");
if(urlLang&&CODES.includes(urlLang))storePref(lang);
function translate(s){
 const source=normalize(s),idx=CODES.indexOf(lang);
 if(idx===0)return source;
 // Reuse the canonical sovereign Interlingual library. A genuinely reviewed
 // browser-local pair outranks public draft interface translations.
 const sovereign=window.KhaemenesSovereignTranslate?.lookupLocal?.({from:"en",to:lang,text:source});
 if(sovereign?.verified===true&&sovereign.translation)return sovereign.translation;
 if(EXPANDED_PHRASES[source]?.[lang])return EXPANDED_PHRASES[source][lang];
 const row=MAP.get(source);
 if(row&&idx<7&&row[idx])return row[idx];
 if(idx>=7&&EXTENDED[source]?.[idx-7])return EXTENDED[source][idx-7];
 if(TITLE_TRANSLATIONS[source]?.[lang])return TITLE_TRANSLATIONS[source][lang];
 if(EXPANDED_PHRASES[source]?.[lang])return EXPANDED_PHRASES[source][lang];
 if(REVIEWED_PUBLIC_COPY[source]?.[lang])return REVIEWED_PUBLIC_COPY[source][lang];
 if(lang!=="en"){
  const match=source.match(/^Open (.+)$/);
  if(match&&EXPANDED_PHRASES.Open?.[lang])return EXPANDED_PHRASES.Open[lang]+" "+(translate(match[1])||match[1]);
 }
 return (sovereign?.translation||cachedTranslation(source,lang));
}
function ignored(el){
 return !!(el&&el.closest("script,style,noscript,svg,math,code,pre,textarea,select,option,[contenteditable],#adminGate,[data-i18n-ignore],.world-ribbon,.phrase-main,.phrase-translation,.phrase-language"));
}
function textTranslate(n){
 const parent=n.parentElement;
 if(!parent||ignored(parent))return;
 let base=original.get(n);
 if(base===undefined||n.nodeValue!==lastRendered.get(n)){base=n.nodeValue;original.set(n,base)}
 const phrase=normalize(base);if(!phrase)return;
 const replacement=translate(phrase);
 const value=replacement?base.replace(phrase,replacement):base;
 if(n.nodeValue!==value)n.nodeValue=value;
 lastRendered.set(n,value);
}
function attrsTranslate(el){
 if(ignored(el))return;
 let base=attributeBase.get(el),recent=lastAttrs.get(el);
 if(!base){base={};recent={};attributeBase.set(el,base);lastAttrs.set(el,recent)}
 for(const key of ["placeholder","aria-label","title","alt"]){
  const current=el.getAttribute(key);if(current===null)continue;
  if(!(key in base)||current!==recent[key])base[key]=current;
  const replacement=translate(base[key]),next=replacement||base[key];
  if(current!==next)el.setAttribute(key,next);
  recent[key]=next;
 }
}
function translatePageTitle(){
 const current=document.title;
 if(current!==titleState.rendered&&current!==titleState.source)titleState.source=current;
 const replacement=translate(titleState.source),next=replacement||titleState.source;
 if(current!==next)document.title=next;
 titleState.rendered=next;
}
function translateTree(root){
 if(root.nodeType===Node.TEXT_NODE){textTranslate(root);return}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE){if(ignored(root))return;attrsTranslate(root)}
 const tree=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 let node;
 while((node=tree.nextNode())){
  if(node.nodeType===Node.TEXT_NODE)textTranslate(node);
  else if(!ignored(node))attrsTranslate(node);
 }
}
const styles=document.createElement("style");
styles.textContent=`
#vnv-language-actions{display:flex;justify-self:end;align-items:center;justify-content:flex-end;gap:8px;min-width:0}
.vnv-language-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;justify-self:end;min-width:0}
.vnv-language-actions .menu-button{flex:0 0 40px}
#vnv-language-switch-drawer{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;margin:10px auto 16px;max-width:100%;padding:8px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 Arial,sans-serif}
#vnv-language-switch-drawer select{max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-switch-drawer label{white-space:nowrap}
body > #vnv-language-switch{display:flex;width:max-content;max-width:calc(100% - 24px);margin:10px auto;min-height:45px}
#vnv-language-switch{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;padding:7px 10px;margin:7px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 "Brandon Grotesque","Avenir Next",Arial,sans-serif;text-align:center;max-width:100%;position:relative;z-index:1550}
#vnv-language-switch label{font-weight:400;white-space:nowrap}
#vnv-language-select{appearance:auto;max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-select:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
html[dir="rtl"] #vnv-language-switch,html[dir="rtl"] #vnv-language-switch-drawer{direction:rtl}
.vnv-translate-complete,.vnv-translation-audit{padding:6px 9px;border:1px solid #a89a79;border-radius:7px;background:#f5f0e4;color:#14261c;cursor:pointer;font:inherit;font-size:11px}.vnv-translate-complete:disabled{opacity:.6;cursor:wait}
/* Compact parchment language rail, preserving all translation functions. */
#vnv-language-switch{
  gap:6px;padding:6px 10px;margin:7px auto;
  border-color:rgba(87,74,48,.18);background:rgba(255,253,248,.88);
  box-shadow:0 2px 12px rgba(40,45,35,.045);
  font-size:11px;line-height:1.35;
}
body > #vnv-language-switch{
  min-height:40px;width:fit-content;max-width:calc(100% - 20px);
  margin:8px auto 10px;
}
#vnv-language-select{
  min-height:40px;min-width:104px;max-width:155px;
  padding:5px 8px;border-color:rgba(87,74,48,.26);background:#fffdf9;
}
#vnv-language-switch .vnv-translate-complete,
#vnv-language-switch .vnv-translation-audit{
  min-height:40px;padding:6px 9px;
  border-color:rgba(87,74,48,.2);background:#f5f0e6;font-size:10px;
}
@media(max-width:480px){
  #vnv-language-switch{gap:5px;padding:6px;justify-content:center}
  #vnv-language-switch label{font-size:10px}
}
/* Canonical charcoal translation rail. Preserve selectors and translation controls. */
#vnv-language-switch,
#vnv-language-switch-drawer{
  background:#243038;
  color:#fff8e9;
  border:1px solid #b48b45;
  box-shadow:0 2px 12px rgba(20,28,24,.14);
}
#vnv-language-switch label,
#vnv-language-switch-drawer label{
  color:#fff8e9;
  -webkit-text-fill-color:#fff8e9;
}
#vnv-language-switch #vnv-language-select,
#vnv-language-switch-drawer #vnv-language-select-drawer{
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border-color:#b48b45;
}
#vnv-language-switch .vnv-translate-complete,
#vnv-language-switch .vnv-translation-audit,
#vnv-language-switch-drawer .vnv-translate-complete,
#vnv-language-switch-drawer .vnv-translation-audit{
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border-color:#b48b45;
}
#vnv-language-switch :is(select,button):focus-visible,
#vnv-language-switch-drawer :is(select,button):focus-visible{
  outline:3px solid #e3c389;
  outline-offset:2px;
}
/* Full-width charcoal language band beneath the VNV gateway header. */
#vnv-language-rail{
  box-sizing:border-box;
  width:100%;
  padding:7px 16px 8px;
  background:#243038;
  border-bottom:1px solid #b48b45;
}
#vnv-language-rail #vnv-language-switch{
  display:flex;
  width:fit-content;
  max-width:100%;
  min-height:36px;
  gap:8px;
  margin:0 auto;
  padding:0;
  border:0;
  border-radius:7px;
  box-shadow:none;
  background:transparent;
  color:#fff8e9;
  font-size:16px;
}
#vnv-language-rail #vnv-language-switch label{
  font-size:16px;
  color:#fff8e9;
  -webkit-text-fill-color:#fff8e9;
}
#vnv-language-rail #vnv-language-select,
#vnv-language-rail .vnv-translate-complete,
#vnv-language-rail .vnv-translation-audit{
  box-sizing:border-box;
  min-height:36px;
  height:auto;
  padding:6px 11px;
  border:1px solid #b48b45;
  border-radius:7px;
  font-size:16px;
  line-height:1.3;
  font-weight:400;
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
}
#vnv-language-rail #vnv-language-switch [data-vnv-coverage]{
  font-size:13px!important;
  color:#fff8e9!important;
  -webkit-text-fill-color:#fff8e9!important;
}
@media(max-width:650px){
  #vnv-language-rail{padding:8px 12px;}
  #vnv-language-rail #vnv-language-switch{width:100%;justify-content:center;gap:7px;flex-wrap:wrap;}
  #vnv-language-rail #vnv-language-select,
  #vnv-language-rail .vnv-translate-complete,
  #vnv-language-rail .vnv-translation-audit{min-height:38px;}
}
/* Crisp cream translator controls, scoped to the full-width gateway band. */
#vnv-language-rail #vnv-language-switch .vnv-translate-complete,
#vnv-language-rail #vnv-language-switch .vnv-translation-audit,
#vnv-language-rail #vnv-language-switch #vnv-language-select{
  background-color:#fffaf0;
  background-image:none;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border:1px solid #cab58c;
  border-radius:7px;
  min-height:38px;
  padding:7px 13px;
  font:400 16px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif;
  letter-spacing:.005em;
  box-shadow:0 1px 2px rgba(0,0,0,.12);
  transition:background-color .15s ease,border-color .15s ease;
}
#vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit):hover{
  background-color:#f3e6d0;
  border-color:#b48b45;
}
#vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit):disabled{
  opacity:.7;
  cursor:wait;
}
#vnv-language-switch-drawer :is(.vnv-translate-complete,.vnv-translation-audit),
#vnv-language-switch-drawer #vnv-language-select-drawer{
  background-color:#fffaf0;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border:1px solid #cab58c;
  border-radius:7px;
  font:400 16px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif;
}
@media(prefers-reduced-motion:reduce){
  #vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit){transition:none}
}
html[dir="rtl"] .ecosystem-category-grid,html[dir="rtl"] .quick-grid,html[dir="rtl"] .school-grid{direction:ltr}
html[dir="rtl"] .ecosystem-category-grid > *,html[dir="rtl"] .quick-grid > *,html[dir="rtl"] .school-grid > *{direction:rtl}
@media(max-width:480px){#vnv-language-switch{margin:6px auto}#vnv-language-select{min-width:106px}}
`;
document.head.append(styles);
function makeSelector(){
 if(document.getElementById("vnv-language-switch"))return;
 const wrap=document.createElement("div");wrap.id="vnv-language-switch";wrap.setAttribute("data-i18n-ignore","");
 const label=document.createElement("label");label.htmlFor="vnv-language-select";
 const select=document.createElement("select");select.id="vnv-language-select";
 select.setAttribute("aria-label","Choose interface language");
 for(const c of CODES){const opt=document.createElement("option");opt.value=c;opt.textContent=META[c][0];select.append(opt)}
 select.value=lang;wrap.append(label,select);addCoverageControl(wrap);
 let target;
 if(document.querySelector(".site-header .header-inner")){
  const main=document.querySelector("main");
  if(main){
   let rail=document.getElementById("vnv-language-rail");
   if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");main.before(rail)}
   rail.append(wrap);
  }else document.body.append(wrap);
  const drawer=document.getElementById("menuDrawer");
  if(drawer){
   const mirror=wrap.cloneNode(true);
   mirror.id="vnv-language-switch-drawer";
   mirror.querySelector("label").htmlFor="vnv-language-select-drawer";
   const mirrorSelect=mirror.querySelector("select");
   mirrorSelect.id="vnv-language-select-drawer";
   const heading=drawer.querySelector(".drawer-top");
   if(heading)heading.after(mirror);else drawer.prepend(mirror);
   mirrorSelect.addEventListener("change",()=>setLanguage(mirrorSelect.value,true));
   const mirrorButton=mirror.querySelector(".vnv-translate-complete");
   if(mirrorButton)mirrorButton.addEventListener("click",completeMissingTranslations);
   const auditButton=mirror.querySelector(".vnv-translation-audit");
   if(auditButton)auditButton.addEventListener("click",exportTranslationAudit);
  }
 }else if(document.querySelector(".header-main-inner")){
  const main=document.querySelector("main");if(main)main.before(wrap);else document.body.append(wrap);
 }else if(document.querySelector(".ribbon")){
  const main=document.querySelector("main");
  if(main)main.before(wrap);else{target=document.querySelector(".ribbon");target.after(wrap)}
 }else{
  const main=document.querySelector("main");
  if(main)main.before(wrap);else document.body.prepend(wrap);
 }
 select.addEventListener("change",()=>setLanguage(select.value,true));
 updateLabel();
}
function updateLabel(){
 document.querySelectorAll('#vnv-language-switch label,#vnv-language-switch-drawer label').forEach(lab=>lab.textContent=META[lang][1]+":");
 for(const name of ["vnv-language-select","vnv-language-select-drawer"]){const sel=document.getElementById(name);if(sel)sel.value=lang;}
 const control=CONTROL_LABELS[lang]||CONTROL_LABELS.en;
 document.querySelectorAll(".vnv-translate-complete").forEach(b=>{if(!translationBusy)b.textContent=control[0]});
 document.querySelectorAll(".vnv-translation-audit").forEach(b=>b.textContent=control[1]);
}
async function completeWithInstalledModel(selected,interactive=false){
 if(selected==="en"||!coverage().missing)return;
 let available=false;
 try{
  if(window.Translator?.availability){
   const state=await window.Translator.availability({sourceLanguage:"en",targetLanguage:selected});
   available=state==="available";
  }
 }catch{}
 if(lang!==selected)return;
 if(available){completeMissingTranslations();return}
 if(getConsent()==="yes"){completeMissingTranslations();return}
 if(interactive&&getConsent()!=="no"&&requestOnlineConsent()){completeMissingTranslations()}
}
function setLanguage(next,interactive=false){
 if(!CODES.includes(next))return;
 lang=next;storePref(lang);
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 translationStop=true;
 updateLabel();translateTree(document.body);translatePageTitle();updateCoverage();
 completeWithInstalledModel(lang,interactive);
 document.dispatchEvent(new CustomEvent("vnv:language-change",{detail:{language:lang}}));
}
function internalRoute(url){
 // Only first-party ecosystem hosts receive the interface preference.
 // Never append it to unrelated links, downloads, mail, or third-party sites.
 if(url.protocol!=="https:")return false;
 const host=url.hostname.toLowerCase();
 return host==="vervenveda.com"||host==="www.vervenveda.com"||
  host==="vervenveda.github.io"||host==="khaemenesacademy.github.io"||
  host==="artist1970.github.io";
}
document.addEventListener("click",event=>{
 const link=event.target.closest&&event.target.closest("a[href]");
 if(!link||lang==="en"||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const href=link.getAttribute("href");if(!href||href.startsWith("#"))return;
 let url;try{url=new URL(href,location.href)}catch{return}
 if(!internalRoute(url))return;
 url.searchParams.set(PARAM,lang);
 link.href=url.href;
},true);
function init(){
 makeSelector();
 setLanguage(lang);
 const observer=new MutationObserver(records=>{
  let changed=false;
  for(const record of records){
   if(record.type==="childList"){
    for(const node of record.addedNodes){translateTree(node);changed=true}
   }else if(record.type==="characterData"){
    translateTree(record.target);changed=true;
   }else if(record.type==="attributes"){
    attrsTranslate(record.target);changed=true;
   }
  }
  if(changed)scheduleCoverage();
 });
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["placeholder","aria-label","title","alt"]});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.VNVLanguage=Object.freeze({getLanguage:()=>lang,setLanguage,availableLanguages:()=>CODES.slice(),coverage,refresh:()=>{translateTree(document.body);translatePageTitle();updateCoverage()},translateRemaining:completeMissingTranslations,exportAudit:exportTranslationAudit});
})();
```

## Local interlingual core — FULL JavaScript source

**Source:** `assets/khaemenes-interlingual-core.js`, blob `13955ca419bcdb785ba1289137553f67306b0d77`. Legacy/local fallback is not automatically equivalent to canonical Linguistics.

```javascript
/* Khaemenes Sovereign Interlingual — shared offline translation bridge v1
 * No fetch, network APIs, external dependencies, secret access, or student record sync.
 * Imported user-confirmed v2 phrases are origin-local; campus seed is a public draft.
 * "Translation" is an exact phrase lookup, not general machine translation.
 */
(function(root){"use strict";
const LIBRARY_KEY="khaemenes_interlingual_library_v2";
const SEED=root.KhaemenesSovereignSeeds||{phrases:{}};
const DICTIONARY=root.KhaemenesSovereignDictionary||{entries:[],creativeVocabulary:[]};
const dictionaryEntries=Array.isArray(DICTIONARY.entries)?DICTIONARY.entries:[];
const fold=text=>String(text||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
function publicEntry(entry){
 // Preschool bilingual theme lists contain translations, not definitions.
 if(entry?.provenance?.path==="assets/dictionary.js")return {...entry,definition:null,editorial:{...entry.editorial,status:"translation-only-no-definition"}};
 return entry;
}
function lookupDefinition(word,{limit=12}={}){
 const wanted=fold(word);if(!wanted)return [];
 return dictionaryEntries.filter(e=>fold(e.term)===wanted).slice(0,Math.min(50,Math.max(1,limit))).map(publicEntry);
}
function searchDictionary(query,{limit=25,domain="",includeCreative=false}={}){
 const q=fold(query);if(!q)return [];
 const max=Math.min(100,Math.max(1,Number(limit)||25));
 const scored=[];
 for(const e of dictionaryEntries){
  if(domain&&e.domain!==domain)continue;
  const term=fold(e.term),definition=fold(e.definition),synonyms=(e.synonyms||[]).map(fold);
  const rank=term===q?0:term.startsWith(q)?1:term.includes(q)?2:synonyms.some(x=>x.includes(q))?3:definition.includes(q)?4:99;
  if(rank<99)scored.push({rank,entry:publicEntry(e)});
 }
 scored.sort((a,b)=>a.rank-b.rank||a.entry.term.localeCompare(b.entry.term));
 const found=scored.slice(0,max).map(x=>x.entry);
 if(includeCreative&&found.length<max){
  const creative=(DICTIONARY.creativeVocabulary||[]).filter(e=>fold(e.term).includes(q)).slice(0,max-found.length);
  found.push(...creative.map(e=>({...e,editorial:{status:"creative-prompt-not-dictionary-definition"}})));
 }
 return found;
}
/* Thesaurus is limited to terms actually cited by existing source records.
 * Explanatory phrases and reverse connections are NOT promoted to strict synonyms. */
function lookupThesaurus(word,{limit=35,includeReverse=true}={}){
 const wanted=fold(word),max=Math.min(75,Math.max(1,Number(limit)||35));
 const links=new Map(),sourceRecords=[];
 if(!wanted)return {headword:word,sourceRecords,related:[],status:"no-term"};
 function add(term,direction,entry){
  const normalized=fold(term);if(!normalized||normalized===wanted)return;
  let item=links.get(normalized);
  if(!item){item={term:String(term).trim(),direct:false,reverse:false,sourceRecords:[]};links.set(normalized,item)}
  item[direction]=true;
  if(!item.sourceRecords.some(ref=>ref.id===entry.id)){
   item.sourceRecords.push({id:entry.id,term:entry.term,partOfSpeech:entry.partOfSpeech,source:entry.provenance});
  }
 }
 for(const e of dictionaryEntries){
  if(fold(e.term)===wanted){
   sourceRecords.push(publicEntry(e));
   for(const synonym of e.synonyms||[])add(synonym,"direct",e);
  }else if(includeReverse){
   for(const synonym of e.synonyms||[])if(fold(synonym)===wanted)add(e.term,"reverse",e);
  }
 }
 const related=[...links.values()].sort((a,b)=>(Number(b.direct)-Number(a.direct))||a.term.localeCompare(b.term)).slice(0,max);
 return {headword:word,sourceRecords,related,status:related.length?"source-linked":"no-source-linked-terms",notice:"Source-listed related expressions, not guaranteed interchangeable synonyms or antonyms."};
}
function thesaurusStats(){
 let withLinks=0,links=0;const unique=new Set();
 for(const entry of dictionaryEntries){
  const terms=entry.synonyms||[];if(terms.length)withLinks++;
  links+=terms.length;
  for(const term of terms)if(fold(term))unique.add(fold(term));
 }
 return {entriesWithRelatedTerms:withLinks,sourceListedLinks:links,distinctRelatedTerms:unique.size,automaticInferences:0,antonymsSupported:false};
}
function dictionaryStats(){
 return {definedEntries:dictionaryEntries.filter(e=>e.provenance?.path!=="assets/dictionary.js").length,translationOnlyEntries:dictionaryEntries.filter(e=>e.provenance?.path==="assets/dictionary.js").length,allRecords:dictionaryEntries.length,creativeVocabulary:(DICTIONARY.creativeVocabulary||[]).length,duplicateForms:(DICTIONARY.duplicateSurfaceForms||[]).length,network:"never"};
}

const legacyCode=code=>String(code||"").trim().toLowerCase()==="zh"?"zh-CN":String(code||"").trim();
const normalize=text=>String(text??"").trim().normalize("NFC");
const bucketKeys=(from,to)=>{
 const f=legacyCode(from),t=legacyCode(to);
 const result=[f+"→"+t];
 if(t==="zh-CN")result.push(f+"→zh");
 if(t==="zh")result.push(f+"→zh-CN");
 return result;
};
function loadUserLibrary(){
 try{
  const value=JSON.parse(root.localStorage.getItem(LIBRARY_KEY)||"null");
  if(value?.schema==="khaemenes-interlingual-library"&&Number(value.version)===2&&value.pairs&&typeof value.pairs==="object"&&!Array.isArray(value.pairs))return value;
 }catch{}
 return null;
}
function lookupLocal({from="en",to="es",text=""}={}){
 const phrase=normalize(text),target=legacyCode(to);
 if(!phrase||phrase.length>12000)return null;
 if(legacyCode(from)===target)return {translation:phrase,verified:true,source:"same-language",status:"identity"};
 const library=loadUserLibrary();
 for(const pk of bucketKeys(from,to)){
  const record=library?.pairs?.[pk]?.[phrase];
  if(record?.verified===true&&typeof record.translation==="string"&&record.translation.trim()){
   return {translation:record.translation,verified:true,source:"sovereign-local-reviewed",status:"user-reviewed"};
  }
 }
 // Reverse bilingual lookups use explicit Preschool translations only.
 // Do not pivot between two non-English languages or guess ambiguous meanings.
 if(legacyCode(from)!=="en"){
  if(target!=="en")return null;
  const language=legacyCode(from)==="zh-CN"?"zh":legacyCode(from);
  const matches=dictionaryEntries.filter(e=>e.provenance?.path==="assets/dictionary.js"&&fold(e.translations?.[language])===fold(phrase));
  if(matches.length===1)return {translation:matches[0].term,verified:false,source:"sovereign-preschool-reverse",status:"source-vocabulary-draft",provenance:matches[0].provenance};
  return null;
 }
 const short=target==="zh-CN"?"zh":target;
 // Bilingual Preschool entries are a small draft vocabulary, not a translation model.
 const word=fold(phrase);
 const translationRecord=dictionaryEntries.find(e=>e.provenance?.path==="assets/dictionary.js"&&fold(e.term)===word&&typeof e.translations?.[short]==="string");
 if(translationRecord){
  return {translation:translationRecord.translations[short],verified:false,source:"sovereign-preschool-dictionary",status:"source-vocabulary-draft",provenance:translationRecord.provenance};
 }
 const record=SEED.phrases?.[short]?.[phrase];
 if(record&&typeof record.text==="string"&&record.text.trim()){
  return {translation:record.text,verified:false,source:"sovereign-campus-draft",status:record.status||"draft"};
 }
 return null;
}
function stats(){
 const count={};let total=0;
 for(const [code,phrases] of Object.entries(SEED.phrases||{})){
  count[code]=Object.keys(phrases).length;total+=count[code];
 }
 let reviewed=0;const lib=loadUserLibrary();
 for(const bucket of Object.values(lib?.pairs||{}))for(const record of Object.values(bucket||{}))if(record?.verified===true)reviewed++;
 return {campusDraftPairs:total,campusLanguages:Object.keys(count).length,reviewedBrowserPairs:reviewed,byLanguage:count,network:"never"};
}
function portablePack(){
 const pairs=Object.create(null);
 for(const [language,phrases] of Object.entries(SEED.phrases||{})){
  const key="en→"+(language==="zh"?"zh-CN":language);
  const bucket=Object.create(null);
  for(const [source,record] of Object.entries(phrases)){
   if(!record?.text)continue;
   bucket[source]={translation:record.text,verified:false,source:"khaemenes-campus-curated-draft",purpose:"interface"};
  }
  pairs[key]=bucket;
 }
 return {schema:"khaemenes-interlingual-library",version:2,updatedAt:new Date().toISOString(),pairs};
}
root.KhaemenesSovereignTranslate=Object.freeze({
 version:"1.1",
 lookupLocal,
 lookupDefinition,
 searchDictionary,
 lookupThesaurus,
 thesaurusStats,
 dictionaryStats,
 stats,
 portablePack,
 languages:()=>Object.keys(SEED.phrases||{}),
 storageKey:LIBRARY_KEY
});
})(window);
```

## Local campus phrase resources — FULL JavaScript source

**Source:** `assets/khaemenes-campus-phrases.js`, blob `2a7c6c8030df3d62df7312cb9111acfe7a5534f6`.

```javascript
/* Khaemenes Sovereign Interlingual Campus Seed v1.
 * Exact, public interface phrases only. Curated drafts need human language review.
 * No network requests. Never contains learner work or profile data. */
(function(root){"use strict";const seed={"schema":"khaemenes-interlingual-campus-seed","version":1,"sourceLanguage":"en","languages":["es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"],"reviewNote":"Public curated interface draft, NOT a verified learner assessment, professional or certified translation.","phrases":{"es":{"Explore":{"text":"Explorar","status":"curated-draft"},"Halls":{"text":"Salas","status":"curated-draft"},"Matrix":{"text":"Matriz","status":"curated-draft"},"Civic":{"text":"Cívica","status":"curated-draft"},"Promise":{"text":"Compromiso","status":"curated-draft"},"Donate":{"text":"Donar","status":"curated-draft"},"News":{"text":"Noticias","status":"curated-draft"},"Weather":{"text":"Clima","status":"curated-draft"},"Creative":{"text":"Creatividad","status":"curated-draft"},"Professional":{"text":"Profesional","status":"curated-draft"},"Education":{"text":"Educación","status":"curated-draft"},"Games":{"text":"Juegos","status":"curated-draft"},"Earth":{"text":"Tierra","status":"curated-draft"},"Health":{"text":"Salud","status":"curated-draft"},"Connect":{"text":"Conectar","status":"curated-draft"},"Finance":{"text":"Finanzas","status":"curated-draft"},"Research":{"text":"Investigación","status":"curated-draft"},"Knowledge":{"text":"Conocimiento","status":"curated-draft"},"Public Service":{"text":"Servicio público","status":"curated-draft"},"Creative & Professional":{"text":"Creativo y profesional","status":"curated-draft"},"Gateways":{"text":"Portales","status":"curated-draft"},"Pages":{"text":"Páginas","status":"curated-draft"},"Apps":{"text":"Aplicaciones","status":"curated-draft"},"Tools":{"text":"Herramientas","status":"curated-draft"},"Courses":{"text":"Cursos","status":"curated-draft"},"Resources":{"text":"Recursos","status":"curated-draft"},"Portals":{"text":"Portales","status":"curated-draft"},"Workshops":{"text":"Talleres","status":"curated-draft"},"Studios":{"text":"Estudios","status":"curated-draft"},"Assessments":{"text":"Evaluaciones","status":"curated-draft"},"Mentors & Guides":{"text":"Mentores y guías","status":"curated-draft"},"Explore the Ecosystem":{"text":"Explorar el ecosistema","status":"curated-draft"},"Discover the Halls":{"text":"Descubrir las salas","status":"curated-draft"},"Open 333 Network":{"text":"Abrir la red 333","status":"curated-draft"},"Scroll to Explore":{"text":"Desplázate para explorar","status":"curated-draft"},"Featured Sites":{"text":"Sitios destacados","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"Elige una entrada o explora todos sus recursos.","status":"reviewed-draft"},"The Four Great Halls":{"text":"Las cuatro grandes salas","status":"curated-draft"},"Many public resources. One organized home.":{"text":"Muchos recursos públicos. Un hogar organizado.","status":"reviewed-draft"},"Featured Public Destinations":{"text":"Destinos públicos destacados","status":"curated-draft"},"Featured across Verve N Veda":{"text":"Destacado en Verve N Veda","status":"curated-draft"},"Discover the ecosystem":{"text":"Descubre el ecosistema","status":"curated-draft"},"Open in ecosystem viewer":{"text":"Abrir en el visor","status":"curated-draft"},"Pause":{"text":"Pausar","status":"curated-draft"},"Resume":{"text":"Reanudar","status":"curated-draft"},"Print":{"text":"Imprimir","status":"curated-draft"},"Verve N Veda Directory":{"text":"Directorio Verve N Veda","status":"curated-draft"},"Search the complete directory":{"text":"Buscar en el directorio completo","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"Buscar educación, derecho, clima, arte, veteranos…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"El compromiso de Verve N Veda","status":"curated-draft"},"Welcome Home":{"text":"Bienvenidos a casa","status":"curated-draft"},"Support Independent Creation":{"text":"Apoya la creación independiente","status":"curated-draft"},"Accounts":{"text":"Cuentas","status":"curated-draft"},"Find My School":{"text":"Encontrar mi escuela","status":"curated-draft"},"Academy Services":{"text":"Servicios de la Academia","status":"curated-draft"},"Beta Program":{"text":"Programa beta","status":"curated-draft"},"Help Desk":{"text":"Centro de ayuda","status":"curated-draft"},"Front Desk":{"text":"Recepción","status":"curated-draft"},"Schools":{"text":"Escuelas","status":"curated-draft"},"Services":{"text":"Servicios","status":"curated-draft"},"Help":{"text":"Ayuda","status":"curated-draft"},"Student Entry":{"text":"Acceso de estudiantes","status":"curated-draft"},"Create / Manage Account":{"text":"Crear o gestionar cuenta","status":"curated-draft"},"What do you need today?":{"text":"¿Qué necesitas hoy?","status":"curated-draft"},"One calm path through the front desk.":{"text":"Un camino claro desde la recepción.","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"Ve directamente a la etapa educativa que necesitas.","status":"curated-draft"},"Common questions, direct answers.":{"text":"Preguntas frecuentes, respuestas claras.","status":"reviewed-draft"},"Preschool":{"text":"Preescolar","status":"curated-draft"},"Kinder Garden":{"text":"Jardín de infancia","status":"curated-draft"},"Elementary":{"text":"Primaria","status":"curated-draft"},"Middle School":{"text":"Escuela intermedia","status":"curated-draft"},"High School":{"text":"Secundaria superior","status":"curated-draft"},"Higher Learning":{"text":"Educación superior","status":"curated-draft"},"Linguistics":{"text":"Lingüística","status":"curated-draft"},"Student":{"text":"Estudiante","status":"curated-draft"},"Family":{"text":"Familia","status":"curated-draft"},"Family / Parent":{"text":"Familia / Padres","status":"curated-draft"},"Teacher / Faculty":{"text":"Docentes","status":"curated-draft"},"Adult Scholar":{"text":"Estudiante adulto","status":"curated-draft"},"Account":{"text":"Cuenta","status":"curated-draft"},"School":{"text":"Escuela","status":"curated-draft"},"Learning":{"text":"Aprendizaje","status":"curated-draft"},"Records":{"text":"Expedientes","status":"curated-draft"},"Academy Compass":{"text":"Guía de la Academia","status":"curated-draft"},"Open Student Portal":{"text":"Abrir portal del estudiante","status":"curated-draft"},"Open Family Portal":{"text":"Abrir portal familiar","status":"curated-draft"},"Teacher Administration":{"text":"Administración docente","status":"curated-draft"},"Adult Learning":{"text":"Aprendizaje para adultos","status":"curated-draft"},"Open Preschool":{"text":"Abrir preescolar","status":"curated-draft"},"Open Kindergarten":{"text":"Abrir jardín de infancia","status":"curated-draft"},"Open Elementary":{"text":"Abrir primaria","status":"curated-draft"},"Open Middle School":{"text":"Abrir escuela intermedia","status":"curated-draft"},"Open High School":{"text":"Abrir secundaria","status":"curated-draft"},"Open Higher Learning":{"text":"Abrir educación superior","status":"curated-draft"},"Open Linguistics":{"text":"Abrir lingüística","status":"curated-draft"},"Open Help Desk →":{"text":"Abrir centro de ayuda →","status":"curated-draft"},"Join Beta Testing →":{"text":"Participar en pruebas beta →","status":"curated-draft"},"Placement & Pathways":{"text":"Asignación y trayectorias","status":"curated-draft"},"Records & Reports":{"text":"Expedientes e informes","status":"curated-draft"},"Help & Orientation":{"text":"Ayuda y orientación","status":"curated-draft"},"Beta & Improvement":{"text":"Pruebas y mejoras","status":"curated-draft"},"Language Apps":{"text":"Aplicaciones de idiomas","status":"curated-draft"},"Voice Studio":{"text":"Estudio de voz","status":"curated-draft"},"World Atlas":{"text":"Atlas mundial","status":"curated-draft"},"The World in Words":{"text":"El mundo en palabras","status":"curated-draft"},"Formal Academy":{"text":"Academia formal","status":"curated-draft"},"Arabic Suite":{"text":"Estudio de árabe","status":"curated-draft"},"German Studio":{"text":"Estudio de alemán","status":"curated-draft"},"Russian Studio":{"text":"Estudio de ruso","status":"curated-draft"},"Language Tools":{"text":"Herramientas lingüísticas","status":"curated-draft"},"Enter Five-Language Academy":{"text":"Entrar a la Academia de cinco idiomas","status":"curated-draft"},"Choose a voice":{"text":"Elegir una voz","status":"curated-draft"},"Begin with a greeting.":{"text":"Comienza con un saludo.","status":"curated-draft"},"Hear phrase":{"text":"Escuchar frase","status":"curated-draft"},"Next phrase":{"text":"Siguiente frase","status":"curated-draft"},"Formal Language Academy":{"text":"Academia de idiomas","status":"curated-draft"},"Open the Academy":{"text":"Abrir la Academia","status":"curated-draft"},"Language Studios & Tools":{"text":"Estudios y herramientas lingüísticas","status":"curated-draft"},"Clear":{"text":"Limpiar","status":"curated-draft"},"Hear practice text":{"text":"Escuchar texto de práctica","status":"curated-draft"},"Stop speech":{"text":"Detener audio","status":"curated-draft"},"Use browser default":{"text":"Usar voz predeterminada","status":"curated-draft"},"Listening":{"text":"Comprensión auditiva","status":"curated-draft"},"Speaking":{"text":"Expresión oral","status":"curated-draft"},"Reading":{"text":"Lectura","status":"curated-draft"},"Writing":{"text":"Escritura","status":"curated-draft"},"Mediation":{"text":"Mediación","status":"curated-draft"},"Translation":{"text":"Traducción","status":"curated-draft"},"Culture":{"text":"Cultura","status":"curated-draft"},"Formal Study":{"text":"Estudios formales","status":"curated-draft"},"Local Studios":{"text":"Estudios locales","status":"curated-draft"},"Campus & Support":{"text":"Campus y ayuda","status":"curated-draft"},"Return to Top":{"text":"Volver arriba","status":"curated-draft"},"Connected Learning Matrix":{"text":"Red de aprendizaje conectado","status":"curated-draft"},"Support Polyglot":{"text":"Apoyar Polyglot","status":"curated-draft"},"Open Academy":{"text":"Abrir Academia","status":"curated-draft"},"Open Field Lab":{"text":"Abrir laboratorio de campo","status":"curated-draft"},"Open PROSE":{"text":"Abrir PROSE","status":"curated-draft"},"Open ARSHIF":{"text":"Abrir ARSHIF","status":"curated-draft"},"Switch color theme":{"text":"Cambiar tema visual","status":"curated-draft"},"Open navigation":{"text":"Abrir navegación","status":"curated-draft"},"Search language apps":{"text":"Buscar aplicaciones de idiomas","status":"curated-draft"},"Language filter":{"text":"Filtro de idioma","status":"curated-draft"},"Voice":{"text":"Voz","status":"curated-draft"},"Practice text":{"text":"Texto de práctica","status":"curated-draft"},"Speech rate":{"text":"Velocidad de voz","status":"curated-draft"},"Voice pitch":{"text":"Tono de voz","status":"curated-draft"},"All available languages":{"text":"Todos los idiomas disponibles","status":"curated-draft"},"Browser default voice":{"text":"Voz predeterminada","status":"curated-draft"},"Primary navigation":{"text":"Navegación principal","status":"curated-draft"},"Quick access":{"text":"Acceso rápido","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes Academy: Lingüística e idiomas del mundo","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes Academy | Recepción","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Portal público","status":"curated-draft"},"All":{"text":"Todos","status":"curated-draft"},"Open":{"text":"Abrir","status":"curated-draft"},"Browse 30 local apps":{"text":"Explorar 30 aplicaciones locales","status":"curated-draft"},"Five-Language Academy":{"text":"Academia de cinco idiomas","status":"curated-draft"},"Sovereign Translator":{"text":"Traductor soberano","status":"curated-draft"},"Arabic Language":{"text":"Lengua árabe","status":"curated-draft"},"English / ESL":{"text":"Inglés / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"Árabe coránico","status":"curated-draft"},"Language Compass":{"text":"Brújula de idiomas","status":"curated-draft"},"Start at the Front Desk":{"text":"Empezar en recepción","status":"curated-draft"},"Welcome to the Academy":{"text":"Bienvenidos a la Academia","status":"curated-draft"},"Browse Every Public Hall":{"text":"Explorar todas las salas públicas","status":"curated-draft"},"One calm entrance to formal language study, linguistics, pronunciation, scripts, translation, cultural understanding and a growing library of local language applications—from first words through lower-division collegiate study.":{"text":"Un acceso sereno al estudio formal de idiomas, la lingüística, la pronunciación, los sistemas de escritura, la traducción, la comprensión cultural y una biblioteca creciente de aplicaciones locales, desde las primeras palabras hasta los estudios universitarios iniciales.","status":"reviewed-draft"},"Hear a phrase using voices already available in the learner's browser or operating system.":{"text":"Escucha una frase con las voces disponibles en el navegador o sistema operativo del estudiante.","status":"reviewed-draft"},"Five complete pathways. Middle school through College 202.":{"text":"Cinco trayectorias completas. Desde secundaria básica hasta el nivel universitario 202.","status":"reviewed-draft"},"The Five-Language Academy is now the academic centerpiece of this Linguistics repository. Its 206-dossier World Language Atlas remains open beyond these five formal programs.":{"text":"La Academia de Cinco Idiomas es el núcleo académico de este repositorio de Lingüística. Su Atlas de Lenguas del Mundo, con 206 expedientes, sigue abierto más allá de estos cinco programas formales.","status":"reviewed-draft"},"Thirty local applications for focused study, practice, play, reference and exploration.":{"text":"Treinta aplicaciones locales para estudiar, practicar, jugar, consultar y explorar.","status":"reviewed-draft"},"Choose a browser voice, pace and pitch that support your practice.":{"text":"Elige una voz del navegador, una velocidad y un tono adecuados para practicar.","status":"reviewed-draft"},"No voice recordings are collected or uploaded. The page stores only the selected voice name, language filter, rate and pitch in this browser.":{"text":"No se recopilan ni suben grabaciones de voz. Esta página solo guarda en el navegador el nombre de la voz, el filtro de idioma, la velocidad y el tono seleccionados.","status":"reviewed-draft"},"The formal Academy begins with five pathways; the archive remains open to 206 language dossiers.":{"text":"La Academia formal comienza con cinco trayectorias; el archivo mantiene disponibles 206 expedientes lingüísticos.","status":"reviewed-draft"},"Language study can move naturally into research, writing, experiential learning and the wider Academy.":{"text":"El aprendizaje de idiomas puede continuar de forma natural hacia la investigación, la escritura, el aprendizaje práctico y el resto de la Academia.","status":"reviewed-draft"},"Return to the central campus, student and family pathways.":{"text":"Vuelve al campus central y a los recorridos para estudiantes y familias.","status":"reviewed-draft"},"Think of this page as the Academy front desk. Create or resume an account, find the right school or grade, enter student and family portals, reach teacher administration, join the beta program, or simply explore the Academy.":{"text":"Piensa en esta página como la recepción de la Academia. Crea o retoma una cuenta, encuentra la escuela o el grado adecuado, entra en los portales de estudiantes y familias, accede a la administración docente, participa en el programa beta o simplemente explora la Academia.","status":"reviewed-draft"},"Choose the doorway that matches your role. You should not need to understand the Academy's internal architecture just to get where you are going.":{"text":"Elige el acceso correspondiente a tu función. No necesitas conocer la estructura interna de la Academia para llegar a tu destino.","status":"reviewed-draft"},"All campuses remain publicly browsable. Formal enrollment and placement are handled through the appropriate learner/family account.":{"text":"Todos los campus pueden explorarse públicamente. La inscripción y la asignación de nivel se gestionan mediante la cuenta correspondiente del estudiante o la familia.","status":"reviewed-draft"},"Keep the learner record clear and portable.":{"text":"Mantén el expediente del estudiante claro y transferible.","status":"reviewed-draft"},"Free learning, even without internet access.":{"text":"Aprendizaje gratuito, incluso sin conexión a internet.","status":"reviewed-draft"},"An elegant public gateway to education, research, creativity, health, civic knowledge, environmental stewardship, compassionate service, and intelligent navigation through the connected Verve N Veda ecosystem.":{"text":"Un elegante portal público hacia la educación, la investigación, la creatividad, la salud, el conocimiento cívico, la protección ambiental, el servicio solidario y la navegación inteligente por el ecosistema conectado de Verve N Veda.","status":"reviewed-draft"},"The ecosystem is arranged into four balanced families so visitors can find the right doorway without being overwhelmed.":{"text":"El ecosistema se organiza en cuatro grupos equilibrados para que los visitantes encuentren el acceso adecuado sin sentirse abrumados.","status":"reviewed-draft"},"A network designed to connect rather than divide.":{"text":"Una red diseñada para unir, no para dividir.","status":"reviewed-draft"},"Enter through one doorway. Discover an entire world.":{"text":"Entra por una puerta. Descubre un mundo entero.","status":"reviewed-draft"},"Verve N Veda is built as a public bridge between knowledge, creativity, service, community, and the lifelong practice of becoming.":{"text":"Verve N Veda es un puente público entre el conocimiento, la creatividad, el servicio, la comunidad y el aprendizaje y desarrollo personal a lo largo de la vida.","status":"reviewed-draft"}},"fr":{"Explore":{"text":"Explorer","status":"curated-draft"},"Halls":{"text":"Salles","status":"curated-draft"},"Matrix":{"text":"Matrice","status":"curated-draft"},"Civic":{"text":"Civique","status":"curated-draft"},"Promise":{"text":"Engagement","status":"curated-draft"},"Donate":{"text":"Faire un don","status":"curated-draft"},"News":{"text":"Actualités","status":"curated-draft"},"Weather":{"text":"Météo","status":"curated-draft"},"Creative":{"text":"Créativité","status":"curated-draft"},"Professional":{"text":"Professionnel","status":"curated-draft"},"Education":{"text":"Éducation","status":"curated-draft"},"Games":{"text":"Jeux","status":"curated-draft"},"Earth":{"text":"Terre","status":"curated-draft"},"Health":{"text":"Santé","status":"curated-draft"},"Connect":{"text":"Connexion","status":"curated-draft"},"Research":{"text":"Recherche","status":"curated-draft"},"Knowledge":{"text":"Connaissances","status":"curated-draft"},"Public Service":{"text":"Service public","status":"curated-draft"},"Creative & Professional":{"text":"Créativité et métiers","status":"curated-draft"},"Gateways":{"text":"Portails","status":"curated-draft"},"Apps":{"text":"Applications","status":"curated-draft"},"Tools":{"text":"Outils","status":"curated-draft"},"Courses":{"text":"Cours","status":"curated-draft"},"Resources":{"text":"Ressources","status":"curated-draft"},"Portals":{"text":"Portails","status":"curated-draft"},"Workshops":{"text":"Ateliers","status":"curated-draft"},"Assessments":{"text":"Évaluations","status":"curated-draft"},"Mentors & Guides":{"text":"Mentors et guides","status":"curated-draft"},"Explore the Ecosystem":{"text":"Explorer l'écosystème","status":"curated-draft"},"Discover the Halls":{"text":"Découvrir les salles","status":"curated-draft"},"Open 333 Network":{"text":"Ouvrir le réseau 333","status":"curated-draft"},"Scroll to Explore":{"text":"Défiler pour explorer","status":"curated-draft"},"Featured Sites":{"text":"Sites à découvrir","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"Choisissez une entrée ou parcourez l'ensemble de ses ressources.","status":"reviewed-draft"},"The Four Great Halls":{"text":"Les quatre grandes salles","status":"curated-draft"},"Many public resources. One organized home.":{"text":"De nombreuses ressources publiques, réunies en un lieu organisé.","status":"reviewed-draft"},"Featured Public Destinations":{"text":"Destinations publiques à découvrir","status":"curated-draft"},"Featured across Verve N Veda":{"text":"À découvrir dans Verve N Veda","status":"curated-draft"},"Discover the ecosystem":{"text":"Découvrez l'écosystème","status":"curated-draft"},"Open in ecosystem viewer":{"text":"Ouvrir dans la visionneuse","status":"curated-draft"},"Resume":{"text":"Reprendre","status":"curated-draft"},"Print":{"text":"Imprimer","status":"curated-draft"},"Verve N Veda Directory":{"text":"Annuaire Verve N Veda","status":"curated-draft"},"Search the complete directory":{"text":"Rechercher dans tout l'annuaire","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"Rechercher éducation, droit, météo, art, anciens combattants…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"L'engagement de Verve N Veda","status":"curated-draft"},"Welcome Home":{"text":"Bienvenue chez vous","status":"curated-draft"},"Support Independent Creation":{"text":"Soutenir la création indépendante","status":"curated-draft"},"Accounts":{"text":"Comptes","status":"curated-draft"},"Find My School":{"text":"Trouver mon école","status":"curated-draft"},"Academy Services":{"text":"Services de l'Académie","status":"curated-draft"},"Beta Program":{"text":"Programme bêta","status":"curated-draft"},"Help Desk":{"text":"Centre d'aide","status":"curated-draft"},"Front Desk":{"text":"Accueil","status":"curated-draft"},"Schools":{"text":"Écoles","status":"curated-draft"},"Beta":{"text":"Bêta","status":"curated-draft"},"Help":{"text":"Aide","status":"curated-draft"},"Student Entry":{"text":"Accès élève","status":"curated-draft"},"Create / Manage Account":{"text":"Créer ou gérer un compte","status":"curated-draft"},"What do you need today?":{"text":"De quoi avez-vous besoin aujourd'hui ?","status":"curated-draft"},"One calm path through the front desk.":{"text":"Un parcours serein depuis l'accueil.","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"Accédez directement au niveau d'études souhaité.","status":"curated-draft"},"Common questions, direct answers.":{"text":"Questions fréquentes, réponses directes.","status":"reviewed-draft"},"Preschool":{"text":"Maternelle","status":"curated-draft"},"Kinder Garden":{"text":"Jardin d'enfants","status":"curated-draft"},"Elementary":{"text":"École primaire","status":"curated-draft"},"Middle School":{"text":"Collège","status":"curated-draft"},"High School":{"text":"Lycée","status":"curated-draft"},"Higher Learning":{"text":"Enseignement supérieur","status":"curated-draft"},"Linguistics":{"text":"Linguistique","status":"curated-draft"},"Student":{"text":"Élève","status":"curated-draft"},"Family":{"text":"Famille","status":"curated-draft"},"Family / Parent":{"text":"Famille / Parents","status":"curated-draft"},"Teacher / Faculty":{"text":"Enseignants","status":"curated-draft"},"Adult Scholar":{"text":"Apprenant adulte","status":"curated-draft"},"Account":{"text":"Compte","status":"curated-draft"},"School":{"text":"École","status":"curated-draft"},"Learning":{"text":"Apprentissage","status":"curated-draft"},"Records":{"text":"Dossiers","status":"curated-draft"},"Academy Compass":{"text":"Boussole de l'Académie","status":"curated-draft"},"Open Student Portal":{"text":"Ouvrir l'espace élève","status":"curated-draft"},"Open Family Portal":{"text":"Ouvrir l'espace famille","status":"curated-draft"},"Teacher Administration":{"text":"Administration pédagogique","status":"curated-draft"},"Adult Learning":{"text":"Formation des adultes","status":"curated-draft"},"Open Preschool":{"text":"Ouvrir la maternelle","status":"curated-draft"},"Open Kindergarten":{"text":"Ouvrir le jardin d'enfants","status":"curated-draft"},"Open Elementary":{"text":"Ouvrir l'école primaire","status":"curated-draft"},"Open Middle School":{"text":"Ouvrir le collège","status":"curated-draft"},"Open High School":{"text":"Ouvrir le lycée","status":"curated-draft"},"Open Higher Learning":{"text":"Ouvrir l'enseignement supérieur","status":"curated-draft"},"Open Linguistics":{"text":"Ouvrir linguistique","status":"curated-draft"},"Open Help Desk →":{"text":"Ouvrir l'aide →","status":"curated-draft"},"Join Beta Testing →":{"text":"Rejoindre le programme bêta →","status":"curated-draft"},"Placement & Pathways":{"text":"Placement et parcours","status":"curated-draft"},"Records & Reports":{"text":"Dossiers et rapports","status":"curated-draft"},"Help & Orientation":{"text":"Aide et orientation","status":"curated-draft"},"Beta & Improvement":{"text":"Tests et améliorations","status":"curated-draft"},"Language Apps":{"text":"Applications linguistiques","status":"curated-draft"},"Voice Studio":{"text":"Studio vocal","status":"curated-draft"},"World Atlas":{"text":"Atlas mondial","status":"curated-draft"},"The World in Words":{"text":"Le monde en mots","status":"curated-draft"},"Formal Academy":{"text":"Académie des langues","status":"curated-draft"},"Arabic Suite":{"text":"Atelier d'arabe","status":"curated-draft"},"German Studio":{"text":"Atelier d'allemand","status":"curated-draft"},"Russian Studio":{"text":"Atelier de russe","status":"curated-draft"},"Language Tools":{"text":"Outils linguistiques","status":"curated-draft"},"Enter Five-Language Academy":{"text":"Entrer dans l'Académie des cinq langues","status":"curated-draft"},"Choose a voice":{"text":"Choisir une voix","status":"curated-draft"},"Begin with a greeting.":{"text":"Commencez par une salutation.","status":"curated-draft"},"Hear phrase":{"text":"Écouter la phrase","status":"curated-draft"},"Next phrase":{"text":"Phrase suivante","status":"curated-draft"},"Formal Language Academy":{"text":"Académie des langues","status":"curated-draft"},"Open the Academy":{"text":"Ouvrir l'Académie","status":"curated-draft"},"Language Studios & Tools":{"text":"Ateliers et outils linguistiques","status":"curated-draft"},"Clear":{"text":"Effacer","status":"curated-draft"},"Hear practice text":{"text":"Écouter le texte","status":"curated-draft"},"Stop speech":{"text":"Arrêter la lecture","status":"curated-draft"},"Use browser default":{"text":"Utiliser la voix par défaut","status":"curated-draft"},"Listening":{"text":"Écoute","status":"curated-draft"},"Speaking":{"text":"Expression orale","status":"curated-draft"},"Reading":{"text":"Lecture","status":"curated-draft"},"Writing":{"text":"Écriture","status":"curated-draft"},"Mediation":{"text":"Médiation","status":"curated-draft"},"Translation":{"text":"Traduction","status":"curated-draft"},"Formal Study":{"text":"Études structurées","status":"curated-draft"},"Local Studios":{"text":"Ateliers locaux","status":"curated-draft"},"Campus & Support":{"text":"Campus et assistance","status":"curated-draft"},"Return to Top":{"text":"Retour en haut","status":"curated-draft"},"Connected Learning Matrix":{"text":"Réseau d'apprentissage connecté","status":"curated-draft"},"Support Polyglot":{"text":"Soutenir Polyglot","status":"curated-draft"},"Open Academy":{"text":"Ouvrir l'Académie","status":"curated-draft"},"Open Field Lab":{"text":"Ouvrir le laboratoire de terrain","status":"curated-draft"},"Open PROSE":{"text":"Ouvrir PROSE","status":"curated-draft"},"Open ARSHIF":{"text":"Ouvrir ARSHIF","status":"curated-draft"},"Switch color theme":{"text":"Changer le thème","status":"curated-draft"},"Open navigation":{"text":"Ouvrir la navigation","status":"curated-draft"},"Search language apps":{"text":"Rechercher les applications","status":"curated-draft"},"Language filter":{"text":"Filtre de langue","status":"curated-draft"},"Voice":{"text":"Voix","status":"curated-draft"},"Practice text":{"text":"Texte d'entraînement","status":"curated-draft"},"Speech rate":{"text":"Débit de parole","status":"curated-draft"},"Voice pitch":{"text":"Hauteur de voix","status":"curated-draft"},"All available languages":{"text":"Toutes les langues disponibles","status":"curated-draft"},"Browser default voice":{"text":"Voix par défaut","status":"curated-draft"},"Primary navigation":{"text":"Navigation principale","status":"curated-draft"},"Quick access":{"text":"Accès rapide","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes Academy : linguistique et langues du monde","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes Academy | Accueil","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Portail public","status":"curated-draft"},"All":{"text":"Tout","status":"curated-draft"},"Open":{"text":"Ouvrir","status":"curated-draft"},"Browse 30 local apps":{"text":"Explorer 30 applications locales","status":"curated-draft"},"Five-Language Academy":{"text":"Académie des cinq langues","status":"curated-draft"},"Sovereign Translator":{"text":"Traducteur souverain","status":"curated-draft"},"Arabic Language":{"text":"Langue arabe","status":"curated-draft"},"English / ESL":{"text":"Anglais / ALS","status":"curated-draft"},"Qur'anic Arabic":{"text":"Arabe coranique","status":"curated-draft"},"Language Compass":{"text":"Boussole des langues","status":"curated-draft"},"Start at the Front Desk":{"text":"Commencer à l'accueil","status":"curated-draft"},"Welcome to the Academy":{"text":"Bienvenue à l'Académie","status":"curated-draft"},"Browse Every Public Hall":{"text":"Explorer toutes les salles publiques","status":"curated-draft"},"One calm entrance to formal language study, linguistics, pronunciation, scripts, translation, cultural understanding and a growing library of local language applications—from first words through lower-division collegiate study.":{"text":"Une entrée sereine vers l'étude structurée des langues, la linguistique, la prononciation, les écritures, la traduction, la compréhension culturelle et une bibliothèque croissante d'applications locales, des premiers mots aux premières années d'études supérieures.","status":"reviewed-draft"},"Hear a phrase using voices already available in the learner's browser or operating system.":{"text":"Écoutez une phrase avec les voix déjà disponibles dans le navigateur ou le système de l'apprenant.","status":"reviewed-draft"},"Five complete pathways. Middle school through College 202.":{"text":"Cinq parcours complets, du collège jusqu'au niveau universitaire 202.","status":"reviewed-draft"},"The Five-Language Academy is now the academic centerpiece of this Linguistics repository. Its 206-dossier World Language Atlas remains open beyond these five formal programs.":{"text":"L'Académie des cinq langues constitue le cœur pédagogique de ce dépôt de linguistique. Son Atlas des langues du monde, riche de 206 dossiers, reste accessible au-delà de ces cinq programmes.","status":"reviewed-draft"},"Thirty local applications for focused study, practice, play, reference and exploration.":{"text":"Trente applications locales pour étudier, s'exercer, jouer, consulter et explorer.","status":"reviewed-draft"},"Choose a browser voice, pace and pitch that support your practice.":{"text":"Choisissez une voix du navigateur, une vitesse et une hauteur adaptées à vos exercices.","status":"reviewed-draft"},"No voice recordings are collected or uploaded. The page stores only the selected voice name, language filter, rate and pitch in this browser.":{"text":"Aucun enregistrement vocal n'est collecté ni téléversé. La page conserve uniquement dans ce navigateur le nom de la voix choisie, le filtre de langue, le débit et la hauteur.","status":"reviewed-draft"},"The formal Academy begins with five pathways; the archive remains open to 206 language dossiers.":{"text":"L'Académie formelle commence par cinq parcours; les archives restent ouvertes à 206 dossiers linguistiques.","status":"reviewed-draft"},"Language study can move naturally into research, writing, experiential learning and the wider Academy.":{"text":"L'étude des langues peut se prolonger naturellement par la recherche, l'écriture, l'apprentissage pratique et les autres espaces de l'Académie.","status":"reviewed-draft"},"Return to the central campus, student and family pathways.":{"text":"Retournez au campus central et aux parcours pour les élèves et les familles.","status":"reviewed-draft"},"Think of this page as the Academy front desk. Create or resume an account, find the right school or grade, enter student and family portals, reach teacher administration, join the beta program, or simply explore the Academy.":{"text":"Considérez cette page comme l'accueil de l'Académie. Créez ou reprenez un compte, trouvez l'école ou le niveau adapté, accédez aux portails élèves et familles, à l'administration pédagogique, au programme bêta, ou explorez simplement l'Académie.","status":"reviewed-draft"},"Choose the doorway that matches your role. You should not need to understand the Academy's internal architecture just to get where you are going.":{"text":"Choisissez l'entrée correspondant à votre rôle. Vous n'avez pas besoin de comprendre l'organisation interne de l'Académie pour trouver votre chemin.","status":"reviewed-draft"},"All campuses remain publicly browsable. Formal enrollment and placement are handled through the appropriate learner/family account.":{"text":"Tous les campus restent accessibles à la consultation publique. L'inscription et le placement officiel passent par le compte élève ou famille approprié.","status":"reviewed-draft"},"Keep the learner record clear and portable.":{"text":"Gardez le dossier de l'apprenant clair et transférable.","status":"reviewed-draft"},"Free learning, even without internet access.":{"text":"Un apprentissage gratuit, même sans connexion internet.","status":"reviewed-draft"},"An elegant public gateway to education, research, creativity, health, civic knowledge, environmental stewardship, compassionate service, and intelligent navigation through the connected Verve N Veda ecosystem.":{"text":"Un portail public élégant vers l'éducation, la recherche, la créativité, la santé, les savoirs civiques, la protection de l'environnement, la solidarité et une navigation intelligente dans l'écosystème connecté de Verve N Veda.","status":"reviewed-draft"},"The ecosystem is arranged into four balanced families so visitors can find the right doorway without being overwhelmed.":{"text":"L'écosystème est organisé en quatre ensembles équilibrés afin que les visiteurs trouvent facilement leur entrée, sans être submergés.","status":"reviewed-draft"},"A network designed to connect rather than divide.":{"text":"Un réseau conçu pour rassembler plutôt que diviser.","status":"reviewed-draft"},"Enter through one doorway. Discover an entire world.":{"text":"Franchissez une porte. Découvrez tout un monde.","status":"reviewed-draft"},"Verve N Veda is built as a public bridge between knowledge, creativity, service, community, and the lifelong practice of becoming.":{"text":"Verve N Veda est un pont ouvert à tous entre les connaissances, la créativité, le service, la communauté et l'évolution personnelle tout au long de la vie.","status":"reviewed-draft"}},"ar":{"Explore":{"text":"استكشف","status":"curated-draft"},"Halls":{"text":"القاعات","status":"curated-draft"},"Matrix":{"text":"المصفوفة","status":"curated-draft"},"Civic":{"text":"المدنية","status":"curated-draft"},"Promise":{"text":"الوعد","status":"curated-draft"},"Donate":{"text":"تبرع","status":"curated-draft"},"News":{"text":"الأخبار","status":"curated-draft"},"Weather":{"text":"الطقس","status":"curated-draft"},"Creative":{"text":"الإبداع","status":"curated-draft"},"Professional":{"text":"المهني","status":"curated-draft"},"Education":{"text":"التعليم","status":"curated-draft"},"Games":{"text":"الألعاب","status":"curated-draft"},"Earth":{"text":"الأرض","status":"curated-draft"},"Health":{"text":"الصحة","status":"curated-draft"},"Connect":{"text":"تواصل","status":"curated-draft"},"Finance":{"text":"المالية","status":"curated-draft"},"Research":{"text":"البحث","status":"curated-draft"},"Knowledge":{"text":"المعرفة","status":"curated-draft"},"Public Service":{"text":"الخدمة العامة","status":"curated-draft"},"Creative & Professional":{"text":"الإبداع والمهن","status":"curated-draft"},"Gateways":{"text":"البوابات","status":"curated-draft"},"Pages":{"text":"الصفحات","status":"curated-draft"},"Apps":{"text":"التطبيقات","status":"curated-draft"},"Tools":{"text":"الأدوات","status":"curated-draft"},"Courses":{"text":"الدورات","status":"curated-draft"},"Resources":{"text":"الموارد","status":"curated-draft"},"Portals":{"text":"البوابات","status":"curated-draft"},"Workshops":{"text":"ورش العمل","status":"curated-draft"},"Studios":{"text":"الاستوديوهات","status":"curated-draft"},"Assessments":{"text":"التقييمات","status":"curated-draft"},"Mentors & Guides":{"text":"الموجهون والمرشدون","status":"curated-draft"},"Explore the Ecosystem":{"text":"استكشف المنظومة","status":"curated-draft"},"Discover the Halls":{"text":"اكتشف القاعات","status":"curated-draft"},"Open 333 Network":{"text":"افتح شبكة 333","status":"curated-draft"},"Scroll to Explore":{"text":"مرّر للاستكشاف","status":"curated-draft"},"Featured Sites":{"text":"المواقع المميزة","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"اختر بوابة أو تصفح مواردها الكاملة.","status":"curated-draft"},"The Four Great Halls":{"text":"القاعات الأربع الكبرى","status":"curated-draft"},"Many public resources. One organized home.":{"text":"موارد عامة كثيرة في مكان واحد منظم.","status":"curated-draft"},"Featured Public Destinations":{"text":"وجهات عامة مميزة","status":"curated-draft"},"Featured across Verve N Veda":{"text":"مميز عبر فيرف إن فيدا","status":"curated-draft"},"Discover the ecosystem":{"text":"اكتشف المنظومة","status":"curated-draft"},"Open in ecosystem viewer":{"text":"افتح في عارض المنظومة","status":"curated-draft"},"Pause":{"text":"إيقاف مؤقت","status":"curated-draft"},"Resume":{"text":"استئناف","status":"curated-draft"},"Print":{"text":"طباعة","status":"curated-draft"},"Verve N Veda Directory":{"text":"دليل فيرف إن فيدا","status":"curated-draft"},"Search the complete directory":{"text":"ابحث في الدليل الكامل","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"ابحث عن التعليم والقانون والطقس والفن والمحاربين القدامى…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"وعد فيرف إن فيدا","status":"curated-draft"},"Welcome Home":{"text":"أهلًا بك في بيتك","status":"curated-draft"},"Support Independent Creation":{"text":"ادعم الإبداع المستقل","status":"curated-draft"},"Accounts":{"text":"الحسابات","status":"curated-draft"},"Find My School":{"text":"ابحث عن مدرستي","status":"curated-draft"},"Academy Services":{"text":"خدمات الأكاديمية","status":"curated-draft"},"Beta Program":{"text":"البرنامج التجريبي","status":"curated-draft"},"Help Desk":{"text":"مركز المساعدة","status":"curated-draft"},"Front Desk":{"text":"الاستقبال","status":"curated-draft"},"Schools":{"text":"المدارس","status":"curated-draft"},"Services":{"text":"الخدمات","status":"curated-draft"},"Beta":{"text":"تجريبي","status":"curated-draft"},"Help":{"text":"مساعدة","status":"curated-draft"},"Student Entry":{"text":"دخول الطالب","status":"curated-draft"},"Create / Manage Account":{"text":"إنشاء أو إدارة حساب","status":"curated-draft"},"What do you need today?":{"text":"ما الذي تحتاجه اليوم؟","status":"curated-draft"},"One calm path through the front desk.":{"text":"مسار واضح عبر مكتب الاستقبال.","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"انتقل مباشرة إلى المرحلة التعليمية التي تحتاجها.","status":"curated-draft"},"Common questions, direct answers.":{"text":"أسئلة شائعة وإجابات مباشرة.","status":"curated-draft"},"Preschool":{"text":"مرحلة ما قبل المدرسة","status":"curated-draft"},"Kinder Garden":{"text":"رياض الأطفال","status":"curated-draft"},"Elementary":{"text":"الابتدائية","status":"curated-draft"},"Middle School":{"text":"المرحلة المتوسطة","status":"curated-draft"},"High School":{"text":"المرحلة الثانوية","status":"curated-draft"},"Higher Learning":{"text":"التعليم العالي","status":"curated-draft"},"Linguistics":{"text":"اللغويات","status":"curated-draft"},"Student":{"text":"طالب","status":"curated-draft"},"Family":{"text":"الأسرة","status":"curated-draft"},"Family / Parent":{"text":"الأسرة / الوالدين","status":"curated-draft"},"Teacher / Faculty":{"text":"المعلمون","status":"curated-draft"},"Adult Scholar":{"text":"متعلم بالغ","status":"curated-draft"},"Account":{"text":"الحساب","status":"curated-draft"},"School":{"text":"المدرسة","status":"curated-draft"},"Learning":{"text":"التعلم","status":"curated-draft"},"Records":{"text":"السجلات","status":"curated-draft"},"Academy Compass":{"text":"بوصلة الأكاديمية","status":"curated-draft"},"Open Student Portal":{"text":"افتح بوابة الطالب","status":"curated-draft"},"Open Family Portal":{"text":"افتح بوابة الأسرة","status":"curated-draft"},"Teacher Administration":{"text":"إدارة المعلمين","status":"curated-draft"},"Adult Learning":{"text":"تعليم الكبار","status":"curated-draft"},"Open Preschool":{"text":"افتح ما قبل المدرسة","status":"curated-draft"},"Open Kindergarten":{"text":"افتح الروضة","status":"curated-draft"},"Open Elementary":{"text":"افتح الابتدائية","status":"curated-draft"},"Open Middle School":{"text":"افتح المرحلة المتوسطة","status":"curated-draft"},"Open High School":{"text":"افتح الثانوية","status":"curated-draft"},"Open Higher Learning":{"text":"افتح التعليم العالي","status":"curated-draft"},"Open Linguistics":{"text":"افتح اللغويات","status":"curated-draft"},"Open Help Desk →":{"text":"افتح مركز المساعدة ←","status":"curated-draft"},"Join Beta Testing →":{"text":"انضم للاختبار التجريبي ←","status":"curated-draft"},"Placement & Pathways":{"text":"التسكين والمسارات","status":"curated-draft"},"Records & Reports":{"text":"السجلات والتقارير","status":"curated-draft"},"Help & Orientation":{"text":"المساعدة والإرشاد","status":"curated-draft"},"Beta & Improvement":{"text":"الاختبار والتحسين","status":"curated-draft"},"Language Apps":{"text":"تطبيقات اللغات","status":"curated-draft"},"Voice Studio":{"text":"استوديو الصوت","status":"curated-draft"},"World Atlas":{"text":"الأطلس العالمي","status":"curated-draft"},"The World in Words":{"text":"العالم بالكلمات","status":"curated-draft"},"Formal Academy":{"text":"الأكاديمية النظامية","status":"curated-draft"},"Arabic Suite":{"text":"مجموعة العربية","status":"curated-draft"},"German Studio":{"text":"استوديو الألمانية","status":"curated-draft"},"Russian Studio":{"text":"استوديو الروسية","status":"curated-draft"},"Language Tools":{"text":"أدوات اللغات","status":"curated-draft"},"Enter Five-Language Academy":{"text":"ادخل أكاديمية اللغات الخمس","status":"curated-draft"},"Choose a voice":{"text":"اختر صوتًا","status":"curated-draft"},"Begin with a greeting.":{"text":"ابدأ بتحية.","status":"curated-draft"},"Hear phrase":{"text":"استمع للعبارة","status":"curated-draft"},"Next phrase":{"text":"العبارة التالية","status":"curated-draft"},"Formal Language Academy":{"text":"أكاديمية اللغات","status":"curated-draft"},"Open the Academy":{"text":"افتح الأكاديمية","status":"curated-draft"},"Language Studios & Tools":{"text":"استوديوهات وأدوات اللغات","status":"curated-draft"},"Clear":{"text":"مسح","status":"curated-draft"},"Hear practice text":{"text":"استمع إلى نص التدريب","status":"curated-draft"},"Stop speech":{"text":"أوقف النطق","status":"curated-draft"},"Use browser default":{"text":"استخدم الصوت الافتراضي","status":"curated-draft"},"Listening":{"text":"الاستماع","status":"curated-draft"},"Speaking":{"text":"التحدث","status":"curated-draft"},"Reading":{"text":"القراءة","status":"curated-draft"},"Writing":{"text":"الكتابة","status":"curated-draft"},"Mediation":{"text":"الوساطة اللغوية","status":"curated-draft"},"Translation":{"text":"الترجمة","status":"curated-draft"},"Culture":{"text":"الثقافة","status":"curated-draft"},"Formal Study":{"text":"الدراسة النظامية","status":"curated-draft"},"Local Studios":{"text":"استوديوهات محلية","status":"curated-draft"},"Campus & Support":{"text":"الحرم والدعم","status":"curated-draft"},"Return to Top":{"text":"العودة للأعلى","status":"curated-draft"},"Connected Learning Matrix":{"text":"شبكة التعلم المتصل","status":"curated-draft"},"Support Polyglot":{"text":"ادعم بوليغلوت","status":"curated-draft"},"Open Academy":{"text":"افتح الأكاديمية","status":"curated-draft"},"Open Field Lab":{"text":"افتح المختبر الميداني","status":"curated-draft"},"Open PROSE":{"text":"افتح PROSE","status":"curated-draft"},"Open ARSHIF":{"text":"افتح أرشيف","status":"curated-draft"},"Switch color theme":{"text":"بدّل المظهر","status":"curated-draft"},"Open navigation":{"text":"افتح التنقل","status":"curated-draft"},"Search language apps":{"text":"ابحث عن تطبيقات اللغات","status":"curated-draft"},"Language filter":{"text":"مرشح اللغة","status":"curated-draft"},"Voice":{"text":"الصوت","status":"curated-draft"},"Practice text":{"text":"نص التدريب","status":"curated-draft"},"Speech rate":{"text":"سرعة النطق","status":"curated-draft"},"Voice pitch":{"text":"طبقة الصوت","status":"curated-draft"},"All available languages":{"text":"جميع اللغات المتاحة","status":"curated-draft"},"Browser default voice":{"text":"الصوت الافتراضي","status":"curated-draft"},"Primary navigation":{"text":"التنقل الرئيسي","status":"curated-draft"},"Quick access":{"text":"وصول سريع","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | أكاديمية خيمينيس: اللغويات ولغات العالم","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"أكاديمية خيمينيس | الاستقبال","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"فيرف إن فيدا | البوابة العامة","status":"curated-draft"},"All":{"text":"الكل","status":"curated-draft"},"Open":{"text":"افتح","status":"curated-draft"},"Browse 30 local apps":{"text":"تصفح 30 تطبيقًا محليًا","status":"curated-draft"},"Five-Language Academy":{"text":"أكاديمية اللغات الخمس","status":"curated-draft"},"Sovereign Translator":{"text":"المترجم المستقل","status":"curated-draft"},"Arabic Language":{"text":"اللغة العربية","status":"curated-draft"},"English / ESL":{"text":"الإنجليزية / تعليمها لغير الناطقين","status":"curated-draft"},"Qur'anic Arabic":{"text":"العربية القرآنية","status":"curated-draft"},"Language Compass":{"text":"بوصلة اللغات","status":"curated-draft"},"Start at the Front Desk":{"text":"ابدأ من الاستقبال","status":"curated-draft"},"Welcome to the Academy":{"text":"أهلًا بك في الأكاديمية","status":"curated-draft"},"Browse Every Public Hall":{"text":"تصفح جميع القاعات العامة","status":"curated-draft"}},"zh":{"Explore":{"text":"探索","status":"curated-draft"},"Halls":{"text":"展馆","status":"curated-draft"},"Matrix":{"text":"矩阵","status":"curated-draft"},"Civic":{"text":"公民","status":"curated-draft"},"Promise":{"text":"承诺","status":"curated-draft"},"Donate":{"text":"捐助","status":"curated-draft"},"News":{"text":"新闻","status":"curated-draft"},"Weather":{"text":"天气","status":"curated-draft"},"Creative":{"text":"创意","status":"curated-draft"},"Professional":{"text":"专业","status":"curated-draft"},"Education":{"text":"教育","status":"curated-draft"},"Games":{"text":"游戏","status":"curated-draft"},"Earth":{"text":"地球","status":"curated-draft"},"Health":{"text":"健康","status":"curated-draft"},"Connect":{"text":"连接","status":"curated-draft"},"Finance":{"text":"金融","status":"curated-draft"},"Research":{"text":"研究","status":"curated-draft"},"Knowledge":{"text":"知识","status":"curated-draft"},"Public Service":{"text":"公共服务","status":"curated-draft"},"Creative & Professional":{"text":"创意与专业","status":"curated-draft"},"Gateways":{"text":"门户","status":"curated-draft"},"Pages":{"text":"页面","status":"curated-draft"},"Apps":{"text":"应用","status":"curated-draft"},"Tools":{"text":"工具","status":"curated-draft"},"Courses":{"text":"课程","status":"curated-draft"},"Resources":{"text":"资源","status":"curated-draft"},"Portals":{"text":"门户","status":"curated-draft"},"Workshops":{"text":"工作坊","status":"curated-draft"},"Studios":{"text":"工作室","status":"curated-draft"},"Assessments":{"text":"测评","status":"curated-draft"},"Mentors & Guides":{"text":"导师与指南","status":"curated-draft"},"Explore the Ecosystem":{"text":"探索生态系统","status":"curated-draft"},"Discover the Halls":{"text":"发现各展馆","status":"curated-draft"},"Open 333 Network":{"text":"打开 333 网络","status":"curated-draft"},"Scroll to Explore":{"text":"滚动探索","status":"curated-draft"},"Featured Sites":{"text":"精选网站","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"选择入口或浏览全部资源。","status":"curated-draft"},"The Four Great Halls":{"text":"四大展馆","status":"curated-draft"},"Many public resources. One organized home.":{"text":"众多公共资源，汇于一处。","status":"curated-draft"},"Featured Public Destinations":{"text":"精选公共站点","status":"curated-draft"},"Featured across Verve N Veda":{"text":"Verve N Veda 精选","status":"curated-draft"},"Discover the ecosystem":{"text":"发现生态系统","status":"curated-draft"},"Open in ecosystem viewer":{"text":"在站点查看器中打开","status":"curated-draft"},"Pause":{"text":"暂停","status":"curated-draft"},"Resume":{"text":"继续","status":"curated-draft"},"Print":{"text":"打印","status":"curated-draft"},"Verve N Veda Directory":{"text":"Verve N Veda 目录","status":"curated-draft"},"Search the complete directory":{"text":"搜索完整目录","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"搜索教育、法律、天气、艺术、退伍军人…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"Verve N Veda 的承诺","status":"curated-draft"},"Welcome Home":{"text":"欢迎回家","status":"curated-draft"},"Support Independent Creation":{"text":"支持独立创作","status":"curated-draft"},"Accounts":{"text":"账户","status":"curated-draft"},"Find My School":{"text":"寻找学校","status":"curated-draft"},"Academy Services":{"text":"学院服务","status":"curated-draft"},"Beta Program":{"text":"测试计划","status":"curated-draft"},"Help Desk":{"text":"帮助中心","status":"curated-draft"},"Front Desk":{"text":"服务台","status":"curated-draft"},"Schools":{"text":"学校","status":"curated-draft"},"Services":{"text":"服务","status":"curated-draft"},"Beta":{"text":"测试版","status":"curated-draft"},"Help":{"text":"帮助","status":"curated-draft"},"Student Entry":{"text":"学生入口","status":"curated-draft"},"Create / Manage Account":{"text":"创建或管理账户","status":"curated-draft"},"What do you need today?":{"text":"今天需要什么帮助？","status":"curated-draft"},"One calm path through the front desk.":{"text":"从服务台开始的清晰路径。","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"直达所需学习阶段。","status":"curated-draft"},"Common questions, direct answers.":{"text":"常见问题，直接解答。","status":"curated-draft"},"Preschool":{"text":"学前班","status":"curated-draft"},"Kinder Garden":{"text":"幼儿园","status":"curated-draft"},"Elementary":{"text":"小学","status":"curated-draft"},"Middle School":{"text":"初中","status":"curated-draft"},"High School":{"text":"高中","status":"curated-draft"},"Higher Learning":{"text":"高等教育","status":"curated-draft"},"Linguistics":{"text":"语言学","status":"curated-draft"},"Student":{"text":"学生","status":"curated-draft"},"Family":{"text":"家庭","status":"curated-draft"},"Family / Parent":{"text":"家庭／家长","status":"curated-draft"},"Teacher / Faculty":{"text":"教师","status":"curated-draft"},"Adult Scholar":{"text":"成人学员","status":"curated-draft"},"Account":{"text":"账户","status":"curated-draft"},"School":{"text":"学校","status":"curated-draft"},"Learning":{"text":"学习","status":"curated-draft"},"Records":{"text":"记录","status":"curated-draft"},"Academy Compass":{"text":"学院导航","status":"curated-draft"},"Open Student Portal":{"text":"打开学生门户","status":"curated-draft"},"Open Family Portal":{"text":"打开家庭门户","status":"curated-draft"},"Teacher Administration":{"text":"教师管理","status":"curated-draft"},"Adult Learning":{"text":"成人学习","status":"curated-draft"},"Open Preschool":{"text":"打开学前班","status":"curated-draft"},"Open Kindergarten":{"text":"打开幼儿园","status":"curated-draft"},"Open Elementary":{"text":"打开小学","status":"curated-draft"},"Open Middle School":{"text":"打开初中","status":"curated-draft"},"Open High School":{"text":"打开高中","status":"curated-draft"},"Open Higher Learning":{"text":"打开高等教育","status":"curated-draft"},"Open Linguistics":{"text":"打开语言学","status":"curated-draft"},"Open Help Desk →":{"text":"打开帮助中心 →","status":"curated-draft"},"Join Beta Testing →":{"text":"加入测试 →","status":"curated-draft"},"Placement & Pathways":{"text":"分班与学习路径","status":"curated-draft"},"Records & Reports":{"text":"记录与报告","status":"curated-draft"},"Help & Orientation":{"text":"帮助与指引","status":"curated-draft"},"Beta & Improvement":{"text":"测试与改进","status":"curated-draft"},"Language Apps":{"text":"语言应用","status":"curated-draft"},"Voice Studio":{"text":"语音工作室","status":"curated-draft"},"World Atlas":{"text":"世界图集","status":"curated-draft"},"The World in Words":{"text":"语言中的世界","status":"curated-draft"},"Formal Academy":{"text":"正式学院","status":"curated-draft"},"Arabic Suite":{"text":"阿拉伯语学习","status":"curated-draft"},"German Studio":{"text":"德语工作室","status":"curated-draft"},"Russian Studio":{"text":"俄语工作室","status":"curated-draft"},"Language Tools":{"text":"语言工具","status":"curated-draft"},"Enter Five-Language Academy":{"text":"进入五语学院","status":"curated-draft"},"Choose a voice":{"text":"选择语音","status":"curated-draft"},"Begin with a greeting.":{"text":"从问候语开始。","status":"curated-draft"},"Hear phrase":{"text":"播放短语","status":"curated-draft"},"Next phrase":{"text":"下一句","status":"curated-draft"},"Formal Language Academy":{"text":"语言学院","status":"curated-draft"},"Open the Academy":{"text":"打开学院","status":"curated-draft"},"Language Studios & Tools":{"text":"语言工作室与工具","status":"curated-draft"},"Clear":{"text":"清除","status":"curated-draft"},"Hear practice text":{"text":"朗读练习文本","status":"curated-draft"},"Stop speech":{"text":"停止朗读","status":"curated-draft"},"Use browser default":{"text":"使用浏览器默认语音","status":"curated-draft"},"Listening":{"text":"听力","status":"curated-draft"},"Speaking":{"text":"口语","status":"curated-draft"},"Reading":{"text":"阅读","status":"curated-draft"},"Writing":{"text":"写作","status":"curated-draft"},"Mediation":{"text":"语言调解","status":"curated-draft"},"Translation":{"text":"翻译","status":"curated-draft"},"Culture":{"text":"文化","status":"curated-draft"},"Formal Study":{"text":"正式学习","status":"curated-draft"},"Local Studios":{"text":"本地工作室","status":"curated-draft"},"Campus & Support":{"text":"校园与支持","status":"curated-draft"},"Return to Top":{"text":"返回顶部","status":"curated-draft"},"Connected Learning Matrix":{"text":"互联学习矩阵","status":"curated-draft"},"Support Polyglot":{"text":"支持 Polyglot","status":"curated-draft"},"Open Academy":{"text":"打开学院","status":"curated-draft"},"Open Field Lab":{"text":"打开实地实验室","status":"curated-draft"},"Open PROSE":{"text":"打开 PROSE","status":"curated-draft"},"Open ARSHIF":{"text":"打开 ARSHIF","status":"curated-draft"},"Switch color theme":{"text":"切换主题","status":"curated-draft"},"Open navigation":{"text":"打开导航","status":"curated-draft"},"Search language apps":{"text":"搜索语言应用","status":"curated-draft"},"Language filter":{"text":"语言筛选","status":"curated-draft"},"Voice":{"text":"语音","status":"curated-draft"},"Practice text":{"text":"练习文本","status":"curated-draft"},"Speech rate":{"text":"语速","status":"curated-draft"},"Voice pitch":{"text":"音高","status":"curated-draft"},"All available languages":{"text":"所有可用语言","status":"curated-draft"},"Browser default voice":{"text":"浏览器默认语音","status":"curated-draft"},"Primary navigation":{"text":"主导航","status":"curated-draft"},"Quick access":{"text":"快速访问","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes 学院：语言学与世界语言","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes 学院 | 服务台","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | 公共门户","status":"curated-draft"},"All":{"text":"全部","status":"curated-draft"},"Open":{"text":"打开","status":"curated-draft"},"Browse 30 local apps":{"text":"浏览30个本地应用","status":"curated-draft"},"Five-Language Academy":{"text":"五语学院","status":"curated-draft"},"Sovereign Translator":{"text":"自主翻译工具","status":"curated-draft"},"Arabic Language":{"text":"阿拉伯语","status":"curated-draft"},"English / ESL":{"text":"英语／第二语言学习","status":"curated-draft"},"Qur'anic Arabic":{"text":"古兰经阿拉伯语","status":"curated-draft"},"Language Compass":{"text":"语言指南针","status":"curated-draft"},"Start at the Front Desk":{"text":"从服务台开始","status":"curated-draft"},"Welcome to the Academy":{"text":"欢迎来到学院","status":"curated-draft"},"Browse Every Public Hall":{"text":"浏览所有公共展馆","status":"curated-draft"}},"de":{"Explore":{"text":"Entdecken","status":"curated-draft"},"Halls":{"text":"Hallen","status":"curated-draft"},"Civic":{"text":"Bürgerwesen","status":"curated-draft"},"Promise":{"text":"Versprechen","status":"curated-draft"},"Donate":{"text":"Spenden","status":"curated-draft"},"News":{"text":"Nachrichten","status":"curated-draft"},"Weather":{"text":"Wetter","status":"curated-draft"},"Creative":{"text":"Kreatives","status":"curated-draft"},"Professional":{"text":"Berufliches","status":"curated-draft"},"Education":{"text":"Bildung","status":"curated-draft"},"Games":{"text":"Spiele","status":"curated-draft"},"Earth":{"text":"Erde","status":"curated-draft"},"Health":{"text":"Gesundheit","status":"curated-draft"},"Connect":{"text":"Verbinden","status":"curated-draft"},"Finance":{"text":"Finanzen","status":"curated-draft"},"Research":{"text":"Forschung","status":"curated-draft"},"Knowledge":{"text":"Wissen","status":"curated-draft"},"Public Service":{"text":"Öffentlicher Dienst","status":"curated-draft"},"Creative & Professional":{"text":"Kreatives und Berufliches","status":"curated-draft"},"Gateways":{"text":"Portale","status":"curated-draft"},"Pages":{"text":"Seiten","status":"curated-draft"},"Tools":{"text":"Werkzeuge","status":"curated-draft"},"Courses":{"text":"Kurse","status":"curated-draft"},"Resources":{"text":"Ressourcen","status":"curated-draft"},"Portals":{"text":"Portale","status":"curated-draft"},"Assessments":{"text":"Bewertungen","status":"curated-draft"},"Mentors & Guides":{"text":"Mentoren und Begleiter","status":"curated-draft"},"Explore the Ecosystem":{"text":"Ökosystem entdecken","status":"curated-draft"},"Discover the Halls":{"text":"Hallen entdecken","status":"curated-draft"},"Open 333 Network":{"text":"333-Netzwerk öffnen","status":"curated-draft"},"Scroll to Explore":{"text":"Zum Entdecken scrollen","status":"curated-draft"},"Featured Sites":{"text":"Ausgewählte Seiten","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"Wählen Sie einen Zugang oder erkunden Sie alle Ressourcen.","status":"curated-draft"},"The Four Great Halls":{"text":"Die vier großen Hallen","status":"curated-draft"},"Many public resources. One organized home.":{"text":"Viele öffentliche Ressourcen. Ein geordnetes Zuhause.","status":"curated-draft"},"Featured Public Destinations":{"text":"Ausgewählte öffentliche Angebote","status":"curated-draft"},"Featured across Verve N Veda":{"text":"Vorgestellt bei Verve N Veda","status":"curated-draft"},"Discover the ecosystem":{"text":"Entdecken Sie das Ökosystem","status":"curated-draft"},"Open in ecosystem viewer":{"text":"Im Ökosystem-Betrachter öffnen","status":"curated-draft"},"Resume":{"text":"Fortsetzen","status":"curated-draft"},"Print":{"text":"Drucken","status":"curated-draft"},"Verve N Veda Directory":{"text":"Verve N Veda Verzeichnis","status":"curated-draft"},"Search the complete directory":{"text":"Gesamtes Verzeichnis durchsuchen","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"Bildung, Recht, Wetter, Kunst, Veteranen suchen…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"Das Verve N Veda Versprechen","status":"curated-draft"},"Welcome Home":{"text":"Willkommen zu Hause","status":"curated-draft"},"Support Independent Creation":{"text":"Unabhängige Kreativität unterstützen","status":"curated-draft"},"Accounts":{"text":"Konten","status":"curated-draft"},"Find My School":{"text":"Meine Schule finden","status":"curated-draft"},"Academy Services":{"text":"Akademie-Dienste","status":"curated-draft"},"Beta Program":{"text":"Beta-Programm","status":"curated-draft"},"Help Desk":{"text":"Hilfezentrum","status":"curated-draft"},"Front Desk":{"text":"Empfang","status":"curated-draft"},"Schools":{"text":"Schulen","status":"curated-draft"},"Services":{"text":"Dienste","status":"curated-draft"},"Help":{"text":"Hilfe","status":"curated-draft"},"Student Entry":{"text":"Schülerzugang","status":"curated-draft"},"Create / Manage Account":{"text":"Konto erstellen oder verwalten","status":"curated-draft"},"What do you need today?":{"text":"Was brauchen Sie heute?","status":"curated-draft"},"One calm path through the front desk.":{"text":"Ein klarer Weg durch den Empfang.","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"Direkt zur passenden Lernstufe.","status":"curated-draft"},"Common questions, direct answers.":{"text":"Häufige Fragen, klare Antworten.","status":"curated-draft"},"Preschool":{"text":"Vorschule","status":"curated-draft"},"Kinder Garden":{"text":"Kindergarten","status":"curated-draft"},"Elementary":{"text":"Grundschule","status":"curated-draft"},"Middle School":{"text":"Mittelstufe","status":"curated-draft"},"High School":{"text":"Oberstufe","status":"curated-draft"},"Higher Learning":{"text":"Höhere Bildung","status":"curated-draft"},"Linguistics":{"text":"Linguistik","status":"curated-draft"},"Student":{"text":"Lernende","status":"curated-draft"},"Family":{"text":"Familie","status":"curated-draft"},"Family / Parent":{"text":"Familie / Eltern","status":"curated-draft"},"Teacher / Faculty":{"text":"Lehrkräfte","status":"curated-draft"},"Adult Scholar":{"text":"Erwachsene Lernende","status":"curated-draft"},"Account":{"text":"Konto","status":"curated-draft"},"School":{"text":"Schule","status":"curated-draft"},"Learning":{"text":"Lernen","status":"curated-draft"},"Records":{"text":"Unterlagen","status":"curated-draft"},"Academy Compass":{"text":"Akademie-Kompass","status":"curated-draft"},"Open Student Portal":{"text":"Schülerportal öffnen","status":"curated-draft"},"Open Family Portal":{"text":"Familienportal öffnen","status":"curated-draft"},"Teacher Administration":{"text":"Lehrerverwaltung","status":"curated-draft"},"Adult Learning":{"text":"Erwachsenenbildung","status":"curated-draft"},"Open Preschool":{"text":"Vorschule öffnen","status":"curated-draft"},"Open Kindergarten":{"text":"Kindergarten öffnen","status":"curated-draft"},"Open Elementary":{"text":"Grundschule öffnen","status":"curated-draft"},"Open Middle School":{"text":"Mittelstufe öffnen","status":"curated-draft"},"Open High School":{"text":"Oberstufe öffnen","status":"curated-draft"},"Open Higher Learning":{"text":"Höhere Bildung öffnen","status":"curated-draft"},"Open Linguistics":{"text":"Linguistik öffnen","status":"curated-draft"},"Open Help Desk →":{"text":"Hilfe öffnen →","status":"curated-draft"},"Join Beta Testing →":{"text":"Am Betatest teilnehmen →","status":"curated-draft"},"Placement & Pathways":{"text":"Einstufung und Lernwege","status":"curated-draft"},"Records & Reports":{"text":"Unterlagen und Berichte","status":"curated-draft"},"Help & Orientation":{"text":"Hilfe und Orientierung","status":"curated-draft"},"Beta & Improvement":{"text":"Beta und Verbesserung","status":"curated-draft"},"Language Apps":{"text":"Sprach-Apps","status":"curated-draft"},"Voice Studio":{"text":"Sprachstudio","status":"curated-draft"},"World Atlas":{"text":"Weltatlas","status":"curated-draft"},"The World in Words":{"text":"Die Welt in Worten","status":"curated-draft"},"Formal Academy":{"text":"Sprachakademie","status":"curated-draft"},"Arabic Suite":{"text":"Arabisch-Lernwelt","status":"curated-draft"},"German Studio":{"text":"Deutschstudio","status":"curated-draft"},"Russian Studio":{"text":"Russischstudio","status":"curated-draft"},"Language Tools":{"text":"Sprachwerkzeuge","status":"curated-draft"},"Enter Five-Language Academy":{"text":"Fünf-Sprachen-Akademie öffnen","status":"curated-draft"},"Choose a voice":{"text":"Stimme wählen","status":"curated-draft"},"Begin with a greeting.":{"text":"Beginne mit einer Begrüßung.","status":"curated-draft"},"Hear phrase":{"text":"Satz anhören","status":"curated-draft"},"Next phrase":{"text":"Nächster Satz","status":"curated-draft"},"Formal Language Academy":{"text":"Sprachakademie","status":"curated-draft"},"Open the Academy":{"text":"Akademie öffnen","status":"curated-draft"},"Language Studios & Tools":{"text":"Sprachstudios und Werkzeuge","status":"curated-draft"},"Clear":{"text":"Löschen","status":"curated-draft"},"Hear practice text":{"text":"Übungstext anhören","status":"curated-draft"},"Stop speech":{"text":"Sprachausgabe stoppen","status":"curated-draft"},"Use browser default":{"text":"Browserstandard verwenden","status":"curated-draft"},"Listening":{"text":"Hören","status":"curated-draft"},"Speaking":{"text":"Sprechen","status":"curated-draft"},"Reading":{"text":"Lesen","status":"curated-draft"},"Writing":{"text":"Schreiben","status":"curated-draft"},"Mediation":{"text":"Sprachmittlung","status":"curated-draft"},"Translation":{"text":"Übersetzung","status":"curated-draft"},"Culture":{"text":"Kultur","status":"curated-draft"},"Formal Study":{"text":"Formales Lernen","status":"curated-draft"},"Local Studios":{"text":"Lokale Studios","status":"curated-draft"},"Campus & Support":{"text":"Campus und Hilfe","status":"curated-draft"},"Return to Top":{"text":"Nach oben","status":"curated-draft"},"Connected Learning Matrix":{"text":"Vernetzte Lernmatrix","status":"curated-draft"},"Support Polyglot":{"text":"Polyglot unterstützen","status":"curated-draft"},"Open Academy":{"text":"Akademie öffnen","status":"curated-draft"},"Open Field Lab":{"text":"Feldlabor öffnen","status":"curated-draft"},"Open PROSE":{"text":"PROSE öffnen","status":"curated-draft"},"Open ARSHIF":{"text":"ARSHIF öffnen","status":"curated-draft"},"Switch color theme":{"text":"Farbschema wechseln","status":"curated-draft"},"Open navigation":{"text":"Navigation öffnen","status":"curated-draft"},"Search language apps":{"text":"Sprach-Apps suchen","status":"curated-draft"},"Language filter":{"text":"Sprachfilter","status":"curated-draft"},"Voice":{"text":"Stimme","status":"curated-draft"},"Practice text":{"text":"Übungstext","status":"curated-draft"},"Speech rate":{"text":"Sprechtempo","status":"curated-draft"},"Voice pitch":{"text":"Tonhöhe","status":"curated-draft"},"All available languages":{"text":"Alle verfügbaren Sprachen","status":"curated-draft"},"Browser default voice":{"text":"Browser-Standardstimme","status":"curated-draft"},"Primary navigation":{"text":"Hauptnavigation","status":"curated-draft"},"Quick access":{"text":"Schnellzugriff","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes Academy: Linguistik und Weltsprachen","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes Academy | Empfang","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Öffentliches Portal","status":"curated-draft"},"All":{"text":"Alle","status":"curated-draft"},"Open":{"text":"Öffnen","status":"curated-draft"},"Browse 30 local apps":{"text":"30 lokale Apps entdecken","status":"curated-draft"},"Five-Language Academy":{"text":"Fünf-Sprachen-Akademie","status":"curated-draft"},"Sovereign Translator":{"text":"Souveräner Übersetzer","status":"curated-draft"},"Arabic Language":{"text":"Arabische Sprache","status":"curated-draft"},"English / ESL":{"text":"Englisch / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"Koranarabisch","status":"curated-draft"},"Language Compass":{"text":"Sprachenkompass","status":"curated-draft"},"Start at the Front Desk":{"text":"Am Empfang beginnen","status":"curated-draft"},"Welcome to the Academy":{"text":"Willkommen in der Akademie","status":"curated-draft"},"Browse Every Public Hall":{"text":"Alle öffentlichen Hallen entdecken","status":"curated-draft"}},"ru":{"Explore":{"text":"Исследовать","status":"curated-draft"},"Halls":{"text":"Залы","status":"curated-draft"},"Matrix":{"text":"Матрица","status":"curated-draft"},"Civic":{"text":"Гражданское","status":"curated-draft"},"Promise":{"text":"Обещание","status":"curated-draft"},"Donate":{"text":"Пожертвовать","status":"curated-draft"},"News":{"text":"Новости","status":"curated-draft"},"Weather":{"text":"Погода","status":"curated-draft"},"Creative":{"text":"Творчество","status":"curated-draft"},"Professional":{"text":"Профессиональное","status":"curated-draft"},"Education":{"text":"Образование","status":"curated-draft"},"Games":{"text":"Игры","status":"curated-draft"},"Earth":{"text":"Земля","status":"curated-draft"},"Health":{"text":"Здоровье","status":"curated-draft"},"Connect":{"text":"Связь","status":"curated-draft"},"Finance":{"text":"Финансы","status":"curated-draft"},"Research":{"text":"Исследования","status":"curated-draft"},"Knowledge":{"text":"Знания","status":"curated-draft"},"Public Service":{"text":"Общественная служба","status":"curated-draft"},"Creative & Professional":{"text":"Творчество и профессии","status":"curated-draft"},"Gateways":{"text":"Порталы","status":"curated-draft"},"Pages":{"text":"Страницы","status":"curated-draft"},"Apps":{"text":"Приложения","status":"curated-draft"},"Tools":{"text":"Инструменты","status":"curated-draft"},"Courses":{"text":"Курсы","status":"curated-draft"},"Resources":{"text":"Ресурсы","status":"curated-draft"},"Portals":{"text":"Порталы","status":"curated-draft"},"Workshops":{"text":"Мастер-классы","status":"curated-draft"},"Studios":{"text":"Студии","status":"curated-draft"},"Assessments":{"text":"Оценивания","status":"curated-draft"},"Mentors & Guides":{"text":"Наставники и гиды","status":"curated-draft"},"Explore the Ecosystem":{"text":"Исследовать экосистему","status":"curated-draft"},"Discover the Halls":{"text":"Открыть залы","status":"curated-draft"},"Open 333 Network":{"text":"Открыть сеть 333","status":"curated-draft"},"Scroll to Explore":{"text":"Листайте для знакомства","status":"curated-draft"},"Featured Sites":{"text":"Избранные сайты","status":"curated-draft"},"Choose a doorway or browse its complete resources.":{"text":"Выберите раздел или изучите все его ресурсы.","status":"curated-draft"},"The Four Great Halls":{"text":"Четыре великих зала","status":"curated-draft"},"Many public resources. One organized home.":{"text":"Множество открытых ресурсов. Единая система.","status":"curated-draft"},"Featured Public Destinations":{"text":"Избранные общественные ресурсы","status":"curated-draft"},"Featured across Verve N Veda":{"text":"Рекомендуем в Verve N Veda","status":"curated-draft"},"Discover the ecosystem":{"text":"Откройте экосистему","status":"curated-draft"},"Open in ecosystem viewer":{"text":"Открыть в просмотрщике","status":"curated-draft"},"Pause":{"text":"Пауза","status":"curated-draft"},"Resume":{"text":"Продолжить","status":"curated-draft"},"Print":{"text":"Печать","status":"curated-draft"},"Verve N Veda Directory":{"text":"Каталог Verve N Veda","status":"curated-draft"},"Search the complete directory":{"text":"Поиск по всему каталогу","status":"curated-draft"},"Search education, law, weather, art, veterans…":{"text":"Поиск: образование, право, погода, искусство, ветераны…","status":"curated-draft"},"The Verve N Veda Promise":{"text":"Обещание Verve N Veda","status":"curated-draft"},"Welcome Home":{"text":"Добро пожаловать домой","status":"curated-draft"},"Support Independent Creation":{"text":"Поддержать независимое творчество","status":"curated-draft"},"Accounts":{"text":"Аккаунты","status":"curated-draft"},"Find My School":{"text":"Найти школу","status":"curated-draft"},"Academy Services":{"text":"Услуги Академии","status":"curated-draft"},"Beta Program":{"text":"Бета-программа","status":"curated-draft"},"Help Desk":{"text":"Служба помощи","status":"curated-draft"},"Front Desk":{"text":"Приёмная","status":"curated-draft"},"Schools":{"text":"Школы","status":"curated-draft"},"Services":{"text":"Услуги","status":"curated-draft"},"Beta":{"text":"Бета","status":"curated-draft"},"Help":{"text":"Помощь","status":"curated-draft"},"Student Entry":{"text":"Вход ученика","status":"curated-draft"},"Create / Manage Account":{"text":"Создать или управлять аккаунтом","status":"curated-draft"},"What do you need today?":{"text":"Что вам нужно сегодня?","status":"curated-draft"},"One calm path through the front desk.":{"text":"Понятный путь через приёмную.","status":"curated-draft"},"Go directly to the learning stage you need.":{"text":"Перейдите сразу к нужной ступени обучения.","status":"curated-draft"},"Common questions, direct answers.":{"text":"Частые вопросы, прямые ответы.","status":"curated-draft"},"Preschool":{"text":"Дошкольное обучение","status":"curated-draft"},"Kinder Garden":{"text":"Детский сад","status":"curated-draft"},"Elementary":{"text":"Начальная школа","status":"curated-draft"},"Middle School":{"text":"Средняя школа","status":"curated-draft"},"High School":{"text":"Старшая школа","status":"curated-draft"},"Higher Learning":{"text":"Высшее образование","status":"curated-draft"},"Linguistics":{"text":"Лингвистика","status":"curated-draft"},"Student":{"text":"Ученик","status":"curated-draft"},"Family":{"text":"Семья","status":"curated-draft"},"Family / Parent":{"text":"Семья / Родители","status":"curated-draft"},"Teacher / Faculty":{"text":"Преподаватели","status":"curated-draft"},"Adult Scholar":{"text":"Взрослый учащийся","status":"curated-draft"},"Account":{"text":"Аккаунт","status":"curated-draft"},"School":{"text":"Школа","status":"curated-draft"},"Learning":{"text":"Обучение","status":"curated-draft"},"Records":{"text":"Документы","status":"curated-draft"},"Academy Compass":{"text":"Навигатор Академии","status":"curated-draft"},"Open Student Portal":{"text":"Открыть портал ученика","status":"curated-draft"},"Open Family Portal":{"text":"Открыть семейный портал","status":"curated-draft"},"Teacher Administration":{"text":"Управление преподавателями","status":"curated-draft"},"Adult Learning":{"text":"Образование взрослых","status":"curated-draft"},"Open Preschool":{"text":"Открыть дошкольное обучение","status":"curated-draft"},"Open Kindergarten":{"text":"Открыть детский сад","status":"curated-draft"},"Open Elementary":{"text":"Открыть начальную школу","status":"curated-draft"},"Open Middle School":{"text":"Открыть среднюю школу","status":"curated-draft"},"Open High School":{"text":"Открыть старшую школу","status":"curated-draft"},"Open Higher Learning":{"text":"Открыть высшее образование","status":"curated-draft"},"Open Linguistics":{"text":"Открыть лингвистику","status":"curated-draft"},"Open Help Desk →":{"text":"Открыть помощь →","status":"curated-draft"},"Join Beta Testing →":{"text":"Участвовать в бета-тесте →","status":"curated-draft"},"Placement & Pathways":{"text":"Распределение и траектории","status":"curated-draft"},"Records & Reports":{"text":"Документы и отчёты","status":"curated-draft"},"Help & Orientation":{"text":"Помощь и ориентация","status":"curated-draft"},"Beta & Improvement":{"text":"Тестирование и улучшения","status":"curated-draft"},"Language Apps":{"text":"Языковые приложения","status":"curated-draft"},"Voice Studio":{"text":"Голосовая студия","status":"curated-draft"},"World Atlas":{"text":"Мировой атлас","status":"curated-draft"},"The World in Words":{"text":"Мир в словах","status":"curated-draft"},"Formal Academy":{"text":"Языковая академия","status":"curated-draft"},"Arabic Suite":{"text":"Арабский комплекс","status":"curated-draft"},"German Studio":{"text":"Студия немецкого","status":"curated-draft"},"Russian Studio":{"text":"Студия русского","status":"curated-draft"},"Language Tools":{"text":"Языковые инструменты","status":"curated-draft"},"Enter Five-Language Academy":{"text":"Войти в Академию пяти языков","status":"curated-draft"},"Choose a voice":{"text":"Выбрать голос","status":"curated-draft"},"Begin with a greeting.":{"text":"Начните с приветствия.","status":"curated-draft"},"Hear phrase":{"text":"Прослушать фразу","status":"curated-draft"},"Next phrase":{"text":"Следующая фраза","status":"curated-draft"},"Formal Language Academy":{"text":"Языковая академия","status":"curated-draft"},"Open the Academy":{"text":"Открыть Академию","status":"curated-draft"},"Language Studios & Tools":{"text":"Языковые студии и инструменты","status":"curated-draft"},"Clear":{"text":"Очистить","status":"curated-draft"},"Hear practice text":{"text":"Прослушать учебный текст","status":"curated-draft"},"Stop speech":{"text":"Остановить речь","status":"curated-draft"},"Use browser default":{"text":"По умолчанию","status":"curated-draft"},"Listening":{"text":"Аудирование","status":"curated-draft"},"Speaking":{"text":"Говорение","status":"curated-draft"},"Reading":{"text":"Чтение","status":"curated-draft"},"Writing":{"text":"Письмо","status":"curated-draft"},"Mediation":{"text":"Медиация","status":"curated-draft"},"Translation":{"text":"Перевод","status":"curated-draft"},"Culture":{"text":"Культура","status":"curated-draft"},"Formal Study":{"text":"Формальное обучение","status":"curated-draft"},"Local Studios":{"text":"Локальные студии","status":"curated-draft"},"Campus & Support":{"text":"Кампус и поддержка","status":"curated-draft"},"Return to Top":{"text":"Наверх","status":"curated-draft"},"Connected Learning Matrix":{"text":"Матрица взаимосвязанного обучения","status":"curated-draft"},"Support Polyglot":{"text":"Поддержать Polyglot","status":"curated-draft"},"Open Academy":{"text":"Открыть Академию","status":"curated-draft"},"Open Field Lab":{"text":"Открыть полевую лабораторию","status":"curated-draft"},"Open PROSE":{"text":"Открыть PROSE","status":"curated-draft"},"Open ARSHIF":{"text":"Открыть ARSHIF","status":"curated-draft"},"Switch color theme":{"text":"Сменить тему","status":"curated-draft"},"Open navigation":{"text":"Открыть навигацию","status":"curated-draft"},"Search language apps":{"text":"Поиск языковых приложений","status":"curated-draft"},"Language filter":{"text":"Фильтр языка","status":"curated-draft"},"Voice":{"text":"Голос","status":"curated-draft"},"Practice text":{"text":"Текст для практики","status":"curated-draft"},"Speech rate":{"text":"Темп речи","status":"curated-draft"},"Voice pitch":{"text":"Высота голоса","status":"curated-draft"},"All available languages":{"text":"Все доступные языки","status":"curated-draft"},"Browser default voice":{"text":"Голос браузера по умолчанию","status":"curated-draft"},"Primary navigation":{"text":"Основная навигация","status":"curated-draft"},"Quick access":{"text":"Быстрый доступ","status":"curated-draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Академия Хеменес: лингвистика и языки мира","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Академия Хеменес | Приёмная","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Общедоступный портал","status":"curated-draft"},"All":{"text":"Все","status":"curated-draft"},"Open":{"text":"Открыть","status":"curated-draft"},"Browse 30 local apps":{"text":"Посмотреть 30 локальных приложений","status":"curated-draft"},"Five-Language Academy":{"text":"Академия пяти языков","status":"curated-draft"},"Sovereign Translator":{"text":"Независимый переводчик","status":"curated-draft"},"Arabic Language":{"text":"Арабский язык","status":"curated-draft"},"English / ESL":{"text":"Английский / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"Коранический арабский","status":"curated-draft"},"Language Compass":{"text":"Языковой компас","status":"curated-draft"},"Start at the Front Desk":{"text":"Начать с приёмной","status":"curated-draft"},"Welcome to the Academy":{"text":"Добро пожаловать в Академию","status":"curated-draft"},"Browse Every Public Hall":{"text":"Все открытые залы","status":"curated-draft"}},"pt":{"Language":{"text":"Idioma","status":"draft"},"Explore":{"text":"Explorar","status":"draft"},"Halls":{"text":"Salões","status":"draft"},"Matrix":{"text":"Matriz","status":"draft"},"Academy":{"text":"Academia","status":"draft"},"Education":{"text":"Educação","status":"draft"},"Language Apps":{"text":"Aplicativos de idiomas","status":"draft"},"Voice Studio":{"text":"Estúdio de voz","status":"draft"},"World Atlas":{"text":"Atlas mundial","status":"draft"},"Research":{"text":"Pesquisa","status":"draft"},"News":{"text":"Notícias","status":"draft"},"Weather":{"text":"Clima","status":"draft"},"Creative":{"text":"Criatividade","status":"draft"},"Professional":{"text":"Profissional","status":"draft"},"Games":{"text":"Jogos","status":"draft"},"Earth":{"text":"Terra","status":"draft"},"Health":{"text":"Saúde","status":"draft"},"Connect":{"text":"Conectar","status":"draft"},"Finance":{"text":"Finanças","status":"draft"},"Civic":{"text":"Cidadania","status":"draft"},"Promise":{"text":"Compromisso","status":"draft"},"Donate":{"text":"Doar","status":"draft"},"Gateways":{"text":"Portais","status":"draft"},"Pages":{"text":"Páginas","status":"draft"},"Apps":{"text":"Aplicativos","status":"draft"},"Tools":{"text":"Ferramentas","status":"draft"},"Courses":{"text":"Cursos","status":"draft"},"Resources":{"text":"Recursos","status":"draft"},"Portals":{"text":"Portais","status":"draft"},"Workshops":{"text":"Oficinas","status":"draft"},"Studios":{"text":"Estúdios","status":"draft"},"Assessments":{"text":"Avaliações","status":"draft"},"Language Tools":{"text":"Ferramentas de idiomas","status":"draft"},"Formal Academy":{"text":"Academia formal","status":"draft"},"Formal Study":{"text":"Estudo formal","status":"draft"},"Local Studios":{"text":"Estúdios locais","status":"draft"},"Schools":{"text":"Escolas","status":"draft"},"Services":{"text":"Serviços","status":"draft"},"Accounts":{"text":"Contas","status":"draft"},"Help Desk":{"text":"Central de ajuda","status":"draft"},"Beta Program":{"text":"Programa beta","status":"draft"},"Help":{"text":"Ajuda","status":"draft"},"Student":{"text":"Estudante","status":"draft"},"Family":{"text":"Família","status":"draft"},"Teacher":{"text":"Professor","status":"draft"},"Learning":{"text":"Aprendizagem","status":"draft"},"Records":{"text":"Registros","status":"draft"},"Linguistics":{"text":"Linguística","status":"draft"},"Spanish":{"text":"Espanhol","status":"draft"},"French":{"text":"Francês","status":"draft"},"German":{"text":"Alemão","status":"draft"},"Russian":{"text":"Russo","status":"draft"},"Arabic":{"text":"Árabe","status":"draft"},"Mandarin Chinese":{"text":"Chinês mandarim","status":"draft"},"Japanese":{"text":"Japonês","status":"draft"},"Listening":{"text":"Escuta","status":"draft"},"Speaking":{"text":"Fala","status":"draft"},"Reading":{"text":"Leitura","status":"draft"},"Writing":{"text":"Escrita","status":"draft"},"Translation":{"text":"Tradução","status":"draft"},"Culture":{"text":"Cultura","status":"draft"},"Mediation":{"text":"Mediação","status":"draft"},"Voice":{"text":"Voz","status":"draft"},"Search":{"text":"Pesquisar","status":"draft"},"Clear":{"text":"Limpar","status":"draft"},"Begin with a greeting.":{"text":"Comece com uma saudação.","status":"draft"},"Hear phrase":{"text":"Ouvir frase","status":"draft"},"Next phrase":{"text":"Próxima frase","status":"draft"},"Choose a voice":{"text":"Escolher uma voz","status":"draft"},"Open the Academy":{"text":"Abrir a Academia","status":"draft"},"Open Academy":{"text":"Abrir Academia","status":"draft"},"Support Polyglot":{"text":"Apoiar o Polyglot","status":"draft"},"Switch color theme":{"text":"Alterar tema de cores","status":"draft"},"Open navigation":{"text":"Abrir navegação","status":"draft"},"Language filter":{"text":"Filtro de idioma","status":"draft"},"Practice text":{"text":"Texto de prática","status":"draft"},"Speech rate":{"text":"Velocidade da fala","status":"draft"},"Voice pitch":{"text":"Tom da voz","status":"draft"},"Hear practice text":{"text":"Ouvir texto de prática","status":"draft"},"Stop speech":{"text":"Parar fala","status":"draft"},"Use browser default":{"text":"Usar padrão do navegador","status":"draft"},"Return to Top":{"text":"Voltar ao topo","status":"draft"},"Primary navigation":{"text":"Navegação principal","status":"draft"},"Quick access":{"text":"Acesso rápido","status":"draft"},"World Language Atlas":{"text":"Atlas das línguas do mundo","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Academia Khaemenes: Linguística e línguas do mundo","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Academia Khaemenes | Recepção","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Portal público","status":"curated-draft"},"All":{"text":"Todos","status":"curated-draft"},"Open":{"text":"Abrir","status":"curated-draft"},"Browse 30 local apps":{"text":"Explorar 30 aplicativos locais","status":"curated-draft"},"Five-Language Academy":{"text":"Academia de cinco idiomas","status":"curated-draft"},"Sovereign Translator":{"text":"Tradutor soberano","status":"curated-draft"},"Arabic Language":{"text":"Língua árabe","status":"curated-draft"},"English / ESL":{"text":"Inglês / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"Árabe corânico","status":"curated-draft"},"Language Compass":{"text":"Bússola de idiomas","status":"curated-draft"},"Start at the Front Desk":{"text":"Começar na recepção","status":"curated-draft"},"Welcome to the Academy":{"text":"Boas-vindas à Academia","status":"curated-draft"},"The Four Great Halls":{"text":"Os quatro grandes salões","status":"curated-draft"},"Welcome Home":{"text":"Boas-vindas ao lar","status":"curated-draft"},"Browse Every Public Hall":{"text":"Explorar todos os salões públicos","status":"curated-draft"}},"hi":{"Language":{"text":"भाषा","status":"draft"},"Explore":{"text":"देखें","status":"draft"},"Halls":{"text":"सभागार","status":"draft"},"Matrix":{"text":"मैट्रिक्स","status":"draft"},"Academy":{"text":"अकादमी","status":"draft"},"Education":{"text":"शिक्षा","status":"draft"},"Language Apps":{"text":"भाषा ऐप","status":"draft"},"Voice Studio":{"text":"वॉइस स्टूडियो","status":"draft"},"World Atlas":{"text":"विश्व एटलस","status":"draft"},"Research":{"text":"अनुसंधान","status":"draft"},"News":{"text":"समाचार","status":"draft"},"Weather":{"text":"मौसम","status":"draft"},"Creative":{"text":"सृजनात्मक","status":"draft"},"Professional":{"text":"पेशेवर","status":"draft"},"Games":{"text":"खेल","status":"draft"},"Earth":{"text":"पृथ्वी","status":"draft"},"Health":{"text":"स्वास्थ्य","status":"draft"},"Connect":{"text":"जुड़ें","status":"draft"},"Finance":{"text":"वित्त","status":"draft"},"Civic":{"text":"नागरिक","status":"draft"},"Promise":{"text":"वादा","status":"draft"},"Donate":{"text":"दान करें","status":"draft"},"Gateways":{"text":"प्रवेश द्वार","status":"draft"},"Pages":{"text":"पृष्ठ","status":"draft"},"Apps":{"text":"ऐप","status":"draft"},"Tools":{"text":"उपकरण","status":"draft"},"Courses":{"text":"पाठ्यक्रम","status":"draft"},"Resources":{"text":"संसाधन","status":"draft"},"Portals":{"text":"पोर्टल","status":"draft"},"Workshops":{"text":"कार्यशालाएँ","status":"draft"},"Studios":{"text":"स्टूडियो","status":"draft"},"Assessments":{"text":"मूल्यांकन","status":"draft"},"Language Tools":{"text":"भाषा उपकरण","status":"draft"},"Formal Academy":{"text":"औपचारिक अकादमी","status":"draft"},"Formal Study":{"text":"औपचारिक अध्ययन","status":"draft"},"Local Studios":{"text":"स्थानीय स्टूडियो","status":"draft"},"Schools":{"text":"विद्यालय","status":"draft"},"Services":{"text":"सेवाएँ","status":"draft"},"Accounts":{"text":"खाते","status":"draft"},"Help Desk":{"text":"सहायता केंद्र","status":"draft"},"Beta Program":{"text":"बीटा कार्यक्रम","status":"draft"},"Help":{"text":"सहायता","status":"draft"},"Beta":{"text":"बीटा","status":"draft"},"Student":{"text":"विद्यार्थी","status":"draft"},"Family":{"text":"परिवार","status":"draft"},"Teacher":{"text":"शिक्षक","status":"draft"},"Learning":{"text":"सीखना","status":"draft"},"Records":{"text":"अभिलेख","status":"draft"},"Linguistics":{"text":"भाषाविज्ञान","status":"draft"},"Spanish":{"text":"स्पेनिश","status":"draft"},"French":{"text":"फ़्रेंच","status":"draft"},"German":{"text":"जर्मन","status":"draft"},"Russian":{"text":"रूसी","status":"draft"},"Arabic":{"text":"अरबी","status":"draft"},"Mandarin Chinese":{"text":"मंदारिन चीनी","status":"draft"},"Japanese":{"text":"जापानी","status":"draft"},"Listening":{"text":"सुनना","status":"draft"},"Speaking":{"text":"बोलना","status":"draft"},"Reading":{"text":"पढ़ना","status":"draft"},"Writing":{"text":"लिखना","status":"draft"},"Translation":{"text":"अनुवाद","status":"draft"},"Culture":{"text":"संस्कृति","status":"draft"},"Mediation":{"text":"मध्यस्थता","status":"draft"},"Voice":{"text":"आवाज़","status":"draft"},"Search":{"text":"खोजें","status":"draft"},"Clear":{"text":"साफ़ करें","status":"draft"},"Begin with a greeting.":{"text":"एक अभिवादन से शुरू करें।","status":"draft"},"Hear phrase":{"text":"वाक्य सुनें","status":"draft"},"Next phrase":{"text":"अगला वाक्य","status":"draft"},"Choose a voice":{"text":"आवाज़ चुनें","status":"draft"},"Open the Academy":{"text":"अकादमी खोलें","status":"draft"},"Open Academy":{"text":"अकादमी खोलें","status":"draft"},"Support Polyglot":{"text":"पॉलीग्लॉट का समर्थन करें","status":"draft"},"Switch color theme":{"text":"रंग थीम बदलें","status":"draft"},"Open navigation":{"text":"नेविगेशन खोलें","status":"draft"},"Language filter":{"text":"भाषा फ़िल्टर","status":"draft"},"Practice text":{"text":"अभ्यास पाठ","status":"draft"},"Speech rate":{"text":"बोलने की गति","status":"draft"},"Voice pitch":{"text":"आवाज़ की पिच","status":"draft"},"Hear practice text":{"text":"अभ्यास पाठ सुनें","status":"draft"},"Stop speech":{"text":"बोलना रोकें","status":"draft"},"Use browser default":{"text":"ब्राउज़र डिफ़ॉल्ट उपयोग करें","status":"draft"},"Return to Top":{"text":"ऊपर जाएँ","status":"draft"},"Primary navigation":{"text":"मुख्य नेविगेशन","status":"draft"},"Quick access":{"text":"त्वरित पहुँच","status":"draft"},"World Language Atlas":{"text":"विश्व भाषा एटलस","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | खेमेनेस अकादमी: भाषाविज्ञान और विश्व भाषाएँ","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"खेमेनेस अकादमी | स्वागत कक्ष","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | सार्वजनिक पोर्टल","status":"curated-draft"},"All":{"text":"सभी","status":"curated-draft"},"Open":{"text":"खोलें","status":"curated-draft"},"Browse 30 local apps":{"text":"30 स्थानीय ऐप देखें","status":"curated-draft"},"Five-Language Academy":{"text":"पाँच भाषा अकादमी","status":"curated-draft"},"Sovereign Translator":{"text":"स्वतंत्र अनुवादक","status":"curated-draft"},"Arabic Language":{"text":"अरबी भाषा","status":"curated-draft"},"English / ESL":{"text":"अंग्रेज़ी / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"क़ुरआनी अरबी","status":"curated-draft"},"Language Compass":{"text":"भाषा दिशा-सूचक","status":"curated-draft"},"Start at the Front Desk":{"text":"स्वागत कक्ष से शुरू करें","status":"curated-draft"},"Welcome to the Academy":{"text":"अकादमी में स्वागत है","status":"curated-draft"},"The Four Great Halls":{"text":"चार विशाल सभागार","status":"curated-draft"},"Welcome Home":{"text":"घर में स्वागत है","status":"curated-draft"},"Browse Every Public Hall":{"text":"सभी सार्वजनिक सभागार देखें","status":"curated-draft"}},"ja":{"Language":{"text":"言語","status":"draft"},"Explore":{"text":"探索","status":"draft"},"Halls":{"text":"ホール","status":"draft"},"Matrix":{"text":"マトリックス","status":"draft"},"Academy":{"text":"アカデミー","status":"draft"},"Education":{"text":"教育","status":"draft"},"Language Apps":{"text":"語学アプリ","status":"draft"},"Voice Studio":{"text":"音声スタジオ","status":"draft"},"World Atlas":{"text":"世界地図帳","status":"draft"},"Research":{"text":"研究","status":"draft"},"News":{"text":"ニュース","status":"draft"},"Weather":{"text":"天気","status":"draft"},"Creative":{"text":"創作","status":"draft"},"Professional":{"text":"専門","status":"draft"},"Games":{"text":"ゲーム","status":"draft"},"Earth":{"text":"地球","status":"draft"},"Health":{"text":"健康","status":"draft"},"Connect":{"text":"つながる","status":"draft"},"Finance":{"text":"金融","status":"draft"},"Civic":{"text":"市民","status":"draft"},"Promise":{"text":"約束","status":"draft"},"Donate":{"text":"寄付","status":"draft"},"Gateways":{"text":"入口","status":"draft"},"Pages":{"text":"ページ","status":"draft"},"Apps":{"text":"アプリ","status":"draft"},"Tools":{"text":"ツール","status":"draft"},"Courses":{"text":"コース","status":"draft"},"Resources":{"text":"資料","status":"draft"},"Portals":{"text":"ポータル","status":"draft"},"Workshops":{"text":"ワークショップ","status":"draft"},"Studios":{"text":"スタジオ","status":"draft"},"Assessments":{"text":"評価","status":"draft"},"Language Tools":{"text":"言語ツール","status":"draft"},"Formal Academy":{"text":"正規アカデミー","status":"draft"},"Formal Study":{"text":"正規学習","status":"draft"},"Local Studios":{"text":"ローカルスタジオ","status":"draft"},"Schools":{"text":"学校","status":"draft"},"Services":{"text":"サービス","status":"draft"},"Accounts":{"text":"アカウント","status":"draft"},"Help Desk":{"text":"ヘルプデスク","status":"draft"},"Beta Program":{"text":"ベータプログラム","status":"draft"},"Help":{"text":"ヘルプ","status":"draft"},"Beta":{"text":"ベータ","status":"draft"},"Student":{"text":"学生","status":"draft"},"Family":{"text":"家族","status":"draft"},"Teacher":{"text":"教師","status":"draft"},"Learning":{"text":"学習","status":"draft"},"Records":{"text":"記録","status":"draft"},"Linguistics":{"text":"言語学","status":"draft"},"Spanish":{"text":"スペイン語","status":"draft"},"French":{"text":"フランス語","status":"draft"},"German":{"text":"ドイツ語","status":"draft"},"Russian":{"text":"ロシア語","status":"draft"},"Arabic":{"text":"アラビア語","status":"draft"},"Mandarin Chinese":{"text":"中国語（普通話）","status":"draft"},"Japanese":{"text":"日本語","status":"draft"},"Listening":{"text":"聞くこと","status":"draft"},"Speaking":{"text":"話すこと","status":"draft"},"Reading":{"text":"読むこと","status":"draft"},"Writing":{"text":"書くこと","status":"draft"},"Translation":{"text":"翻訳","status":"draft"},"Culture":{"text":"文化","status":"draft"},"Mediation":{"text":"仲介","status":"draft"},"Voice":{"text":"音声","status":"draft"},"Search":{"text":"検索","status":"draft"},"Clear":{"text":"クリア","status":"draft"},"Begin with a greeting.":{"text":"あいさつから始めましょう。","status":"draft"},"Hear phrase":{"text":"フレーズを聞く","status":"draft"},"Next phrase":{"text":"次のフレーズ","status":"draft"},"Choose a voice":{"text":"音声を選択","status":"draft"},"Open the Academy":{"text":"アカデミーを開く","status":"draft"},"Open Academy":{"text":"アカデミーを開く","status":"draft"},"Support Polyglot":{"text":"Polyglotを支援","status":"draft"},"Switch color theme":{"text":"テーマを切り替える","status":"draft"},"Open navigation":{"text":"ナビゲーションを開く","status":"draft"},"Language filter":{"text":"言語フィルター","status":"draft"},"Practice text":{"text":"練習テキスト","status":"draft"},"Speech rate":{"text":"読み上げ速度","status":"draft"},"Voice pitch":{"text":"声の高さ","status":"draft"},"Hear practice text":{"text":"練習テキストを聞く","status":"draft"},"Stop speech":{"text":"読み上げを停止","status":"draft"},"Use browser default":{"text":"ブラウザーの既定を使用","status":"draft"},"Return to Top":{"text":"ページの先頭へ","status":"draft"},"Primary navigation":{"text":"メインナビゲーション","status":"draft"},"Quick access":{"text":"クイックアクセス","status":"draft"},"World Language Atlas":{"text":"世界言語アトラス","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes Academy：言語学と世界の言語","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes Academy | 受付","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | 公開ポータル","status":"curated-draft"},"All":{"text":"すべて","status":"curated-draft"},"Open":{"text":"開く","status":"curated-draft"},"Browse 30 local apps":{"text":"30個のアプリを見る","status":"curated-draft"},"Five-Language Academy":{"text":"五言語アカデミー","status":"curated-draft"},"Sovereign Translator":{"text":"自主翻訳ツール","status":"curated-draft"},"Arabic Language":{"text":"アラビア語","status":"curated-draft"},"English / ESL":{"text":"英語／ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"クルアーン・アラビア語","status":"curated-draft"},"Language Compass":{"text":"言語コンパス","status":"curated-draft"},"Start at the Front Desk":{"text":"受付から始める","status":"curated-draft"},"Welcome to the Academy":{"text":"アカデミーへようこそ","status":"curated-draft"},"The Four Great Halls":{"text":"四大ホール","status":"curated-draft"},"Welcome Home":{"text":"おかえりなさい","status":"curated-draft"},"Browse Every Public Hall":{"text":"すべての公開ホールを見る","status":"curated-draft"}},"ko":{"Language":{"text":"언어","status":"draft"},"Explore":{"text":"탐색","status":"draft"},"Halls":{"text":"홀","status":"draft"},"Matrix":{"text":"매트릭스","status":"draft"},"Academy":{"text":"아카데미","status":"draft"},"Education":{"text":"교육","status":"draft"},"Language Apps":{"text":"언어 앱","status":"draft"},"Voice Studio":{"text":"음성 스튜디오","status":"draft"},"World Atlas":{"text":"세계 지도책","status":"draft"},"Research":{"text":"연구","status":"draft"},"News":{"text":"뉴스","status":"draft"},"Weather":{"text":"날씨","status":"draft"},"Creative":{"text":"창작","status":"draft"},"Professional":{"text":"전문","status":"draft"},"Games":{"text":"게임","status":"draft"},"Earth":{"text":"지구","status":"draft"},"Health":{"text":"건강","status":"draft"},"Connect":{"text":"연결","status":"draft"},"Finance":{"text":"재정","status":"draft"},"Civic":{"text":"시민","status":"draft"},"Promise":{"text":"약속","status":"draft"},"Donate":{"text":"기부","status":"draft"},"Gateways":{"text":"포털","status":"draft"},"Pages":{"text":"페이지","status":"draft"},"Apps":{"text":"앱","status":"draft"},"Tools":{"text":"도구","status":"draft"},"Courses":{"text":"과정","status":"draft"},"Resources":{"text":"자료","status":"draft"},"Portals":{"text":"포털","status":"draft"},"Workshops":{"text":"워크숍","status":"draft"},"Studios":{"text":"스튜디오","status":"draft"},"Assessments":{"text":"평가","status":"draft"},"Language Tools":{"text":"언어 도구","status":"draft"},"Formal Academy":{"text":"정규 아카데미","status":"draft"},"Formal Study":{"text":"정규 학습","status":"draft"},"Local Studios":{"text":"로컬 스튜디오","status":"draft"},"Schools":{"text":"학교","status":"draft"},"Services":{"text":"서비스","status":"draft"},"Accounts":{"text":"계정","status":"draft"},"Help Desk":{"text":"안내 데스크","status":"draft"},"Beta Program":{"text":"베타 프로그램","status":"draft"},"Help":{"text":"도움말","status":"draft"},"Beta":{"text":"베타","status":"draft"},"Student":{"text":"학생","status":"draft"},"Family":{"text":"가족","status":"draft"},"Teacher":{"text":"교사","status":"draft"},"Learning":{"text":"학습","status":"draft"},"Records":{"text":"기록","status":"draft"},"Linguistics":{"text":"언어학","status":"draft"},"Spanish":{"text":"스페인어","status":"draft"},"French":{"text":"프랑스어","status":"draft"},"German":{"text":"독일어","status":"draft"},"Russian":{"text":"러시아어","status":"draft"},"Arabic":{"text":"아랍어","status":"draft"},"Mandarin Chinese":{"text":"중국어(표준어)","status":"draft"},"Japanese":{"text":"일본어","status":"draft"},"Listening":{"text":"듣기","status":"draft"},"Speaking":{"text":"말하기","status":"draft"},"Reading":{"text":"읽기","status":"draft"},"Writing":{"text":"쓰기","status":"draft"},"Translation":{"text":"번역","status":"draft"},"Culture":{"text":"문화","status":"draft"},"Mediation":{"text":"중재","status":"draft"},"Voice":{"text":"음성","status":"draft"},"Search":{"text":"검색","status":"draft"},"Clear":{"text":"지우기","status":"draft"},"Begin with a greeting.":{"text":"인사말로 시작하세요.","status":"draft"},"Hear phrase":{"text":"문구 듣기","status":"draft"},"Next phrase":{"text":"다음 문구","status":"draft"},"Choose a voice":{"text":"음성 선택","status":"draft"},"Open the Academy":{"text":"아카데미 열기","status":"draft"},"Open Academy":{"text":"아카데미 열기","status":"draft"},"Support Polyglot":{"text":"Polyglot 후원","status":"draft"},"Switch color theme":{"text":"테마 변경","status":"draft"},"Open navigation":{"text":"탐색 메뉴 열기","status":"draft"},"Language filter":{"text":"언어 필터","status":"draft"},"Practice text":{"text":"연습 텍스트","status":"draft"},"Speech rate":{"text":"말하기 속도","status":"draft"},"Voice pitch":{"text":"음성 높이","status":"draft"},"Hear practice text":{"text":"연습 텍스트 듣기","status":"draft"},"Stop speech":{"text":"음성 중지","status":"draft"},"Use browser default":{"text":"브라우저 기본값 사용","status":"draft"},"Return to Top":{"text":"맨 위로","status":"draft"},"Primary navigation":{"text":"기본 탐색","status":"draft"},"Quick access":{"text":"빠른 접근","status":"draft"},"World Language Atlas":{"text":"세계 언어 지도","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Khaemenes Academy: 언어학과 세계 언어","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Khaemenes Academy | 안내 데스크","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | 공개 포털","status":"curated-draft"},"All":{"text":"전체","status":"curated-draft"},"Open":{"text":"열기","status":"curated-draft"},"Browse 30 local apps":{"text":"로컬 앱 30개 보기","status":"curated-draft"},"Five-Language Academy":{"text":"5개 언어 아카데미","status":"curated-draft"},"Sovereign Translator":{"text":"독립 번역기","status":"curated-draft"},"Arabic Language":{"text":"아랍어","status":"curated-draft"},"English / ESL":{"text":"영어 / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"꾸란 아랍어","status":"curated-draft"},"Language Compass":{"text":"언어 나침반","status":"curated-draft"},"Start at the Front Desk":{"text":"안내 데스크에서 시작","status":"curated-draft"},"Welcome to the Academy":{"text":"아카데미에 오신 것을 환영합니다","status":"curated-draft"},"The Four Great Halls":{"text":"네 개의 큰 홀","status":"curated-draft"},"Welcome Home":{"text":"집에 오신 것을 환영합니다","status":"curated-draft"},"Browse Every Public Hall":{"text":"모든 공개 홀 보기","status":"curated-draft"}},"it":{"Language":{"text":"Lingua","status":"draft"},"Explore":{"text":"Esplora","status":"draft"},"Halls":{"text":"Sale","status":"draft"},"Matrix":{"text":"Matrice","status":"draft"},"Academy":{"text":"Accademia","status":"draft"},"Education":{"text":"Istruzione","status":"draft"},"Language Apps":{"text":"App linguistiche","status":"draft"},"Voice Studio":{"text":"Studio vocale","status":"draft"},"World Atlas":{"text":"Atlante mondiale","status":"draft"},"Research":{"text":"Ricerca","status":"draft"},"News":{"text":"Notizie","status":"draft"},"Weather":{"text":"Meteo","status":"draft"},"Creative":{"text":"Creatività","status":"draft"},"Professional":{"text":"Professionale","status":"draft"},"Games":{"text":"Giochi","status":"draft"},"Earth":{"text":"Terra","status":"draft"},"Health":{"text":"Salute","status":"draft"},"Connect":{"text":"Connetti","status":"draft"},"Finance":{"text":"Finanza","status":"draft"},"Civic":{"text":"Civico","status":"draft"},"Promise":{"text":"Impegno","status":"draft"},"Donate":{"text":"Dona","status":"draft"},"Gateways":{"text":"Portali","status":"draft"},"Pages":{"text":"Pagine","status":"draft"},"Apps":{"text":"App","status":"draft"},"Tools":{"text":"Strumenti","status":"draft"},"Courses":{"text":"Corsi","status":"draft"},"Resources":{"text":"Risorse","status":"draft"},"Portals":{"text":"Portali","status":"draft"},"Workshops":{"text":"Laboratori","status":"draft"},"Studios":{"text":"Studi","status":"draft"},"Assessments":{"text":"Valutazioni","status":"draft"},"Language Tools":{"text":"Strumenti linguistici","status":"draft"},"Formal Academy":{"text":"Accademia formale","status":"draft"},"Formal Study":{"text":"Studi formali","status":"draft"},"Local Studios":{"text":"Studi locali","status":"draft"},"Schools":{"text":"Scuole","status":"draft"},"Services":{"text":"Servizi","status":"draft"},"Accounts":{"text":"Account","status":"draft"},"Help Desk":{"text":"Centro assistenza","status":"draft"},"Beta Program":{"text":"Programma beta","status":"draft"},"Help":{"text":"Aiuto","status":"draft"},"Student":{"text":"Studente","status":"draft"},"Family":{"text":"Famiglia","status":"draft"},"Teacher":{"text":"Insegnante","status":"draft"},"Learning":{"text":"Apprendimento","status":"draft"},"Records":{"text":"Documenti","status":"draft"},"Linguistics":{"text":"Linguistica","status":"draft"},"Spanish":{"text":"Spagnolo","status":"draft"},"French":{"text":"Francese","status":"draft"},"German":{"text":"Tedesco","status":"draft"},"Russian":{"text":"Russo","status":"draft"},"Arabic":{"text":"Arabo","status":"draft"},"Mandarin Chinese":{"text":"Cinese mandarino","status":"draft"},"Japanese":{"text":"Giapponese","status":"draft"},"Listening":{"text":"Ascolto","status":"draft"},"Speaking":{"text":"Conversazione","status":"draft"},"Reading":{"text":"Lettura","status":"draft"},"Writing":{"text":"Scrittura","status":"draft"},"Translation":{"text":"Traduzione","status":"draft"},"Culture":{"text":"Cultura","status":"draft"},"Mediation":{"text":"Mediazione","status":"draft"},"Voice":{"text":"Voce","status":"draft"},"Search":{"text":"Cerca","status":"draft"},"Clear":{"text":"Cancella","status":"draft"},"Begin with a greeting.":{"text":"Inizia con un saluto.","status":"draft"},"Hear phrase":{"text":"Ascolta la frase","status":"draft"},"Next phrase":{"text":"Frase successiva","status":"draft"},"Choose a voice":{"text":"Scegli una voce","status":"draft"},"Open the Academy":{"text":"Apri l'Accademia","status":"draft"},"Open Academy":{"text":"Apri Accademia","status":"draft"},"Support Polyglot":{"text":"Sostieni Polyglot","status":"draft"},"Switch color theme":{"text":"Cambia tema","status":"draft"},"Open navigation":{"text":"Apri navigazione","status":"draft"},"Language filter":{"text":"Filtro lingua","status":"draft"},"Practice text":{"text":"Testo di esercizio","status":"draft"},"Speech rate":{"text":"Velocità voce","status":"draft"},"Voice pitch":{"text":"Tono della voce","status":"draft"},"Hear practice text":{"text":"Ascolta testo","status":"draft"},"Stop speech":{"text":"Ferma lettura","status":"draft"},"Use browser default":{"text":"Usa predefinito","status":"draft"},"Return to Top":{"text":"Torna su","status":"draft"},"Primary navigation":{"text":"Navigazione principale","status":"draft"},"Quick access":{"text":"Accesso rapido","status":"draft"},"World Language Atlas":{"text":"Atlante delle lingue del mondo","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | Accademia Khaemenes: linguistica e lingue del mondo","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"Accademia Khaemenes | Accoglienza","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | Portale pubblico","status":"curated-draft"},"All":{"text":"Tutti","status":"curated-draft"},"Open":{"text":"Apri","status":"curated-draft"},"Browse 30 local apps":{"text":"Esplora 30 app locali","status":"curated-draft"},"Five-Language Academy":{"text":"Accademia delle cinque lingue","status":"curated-draft"},"Sovereign Translator":{"text":"Traduttore sovrano","status":"curated-draft"},"Arabic Language":{"text":"Lingua araba","status":"curated-draft"},"English / ESL":{"text":"Inglese / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"Arabo coranico","status":"curated-draft"},"Language Compass":{"text":"Bussola linguistica","status":"curated-draft"},"Start at the Front Desk":{"text":"Inizia dall'accoglienza","status":"curated-draft"},"Welcome to the Academy":{"text":"Benvenuti all'Accademia","status":"curated-draft"},"The Four Great Halls":{"text":"Le quattro grandi sale","status":"curated-draft"},"Welcome Home":{"text":"Benvenuti a casa","status":"curated-draft"},"Browse Every Public Hall":{"text":"Esplora tutte le sale pubbliche","status":"curated-draft"}},"bn":{"Language":{"text":"ভাষা","status":"draft"},"Explore":{"text":"অন্বেষণ","status":"draft"},"Halls":{"text":"হল","status":"draft"},"Matrix":{"text":"ম্যাট্রিক্স","status":"draft"},"Academy":{"text":"একাডেমি","status":"draft"},"Education":{"text":"শিক্ষা","status":"draft"},"Language Apps":{"text":"ভাষা অ্যাপ","status":"draft"},"Voice Studio":{"text":"ভয়েস স্টুডিও","status":"draft"},"World Atlas":{"text":"বিশ্ব অ্যাটলাস","status":"draft"},"Research":{"text":"গবেষণা","status":"draft"},"News":{"text":"সংবাদ","status":"draft"},"Weather":{"text":"আবহাওয়া","status":"draft"},"Creative":{"text":"সৃজনশীল","status":"draft"},"Professional":{"text":"পেশাদার","status":"draft"},"Games":{"text":"গেম","status":"draft"},"Earth":{"text":"পৃথিবী","status":"draft"},"Health":{"text":"স্বাস্থ্য","status":"draft"},"Connect":{"text":"সংযুক্ত করুন","status":"draft"},"Finance":{"text":"অর্থব্যবস্থা","status":"draft"},"Civic":{"text":"নাগরিক","status":"draft"},"Promise":{"text":"প্রতিশ্রুতি","status":"draft"},"Donate":{"text":"অনুদান দিন","status":"draft"},"Gateways":{"text":"প্রবেশপথ","status":"draft"},"Pages":{"text":"পৃষ্ঠা","status":"draft"},"Apps":{"text":"অ্যাপ","status":"draft"},"Tools":{"text":"সরঞ্জাম","status":"draft"},"Courses":{"text":"কোর্স","status":"draft"},"Resources":{"text":"রিসোর্স","status":"draft"},"Portals":{"text":"পোর্টাল","status":"draft"},"Workshops":{"text":"কর্মশালা","status":"draft"},"Studios":{"text":"স্টুডিও","status":"draft"},"Assessments":{"text":"মূল্যায়ন","status":"draft"},"Language Tools":{"text":"ভাষার সরঞ্জাম","status":"draft"},"Formal Academy":{"text":"আনুষ্ঠানিক একাডেমি","status":"draft"},"Formal Study":{"text":"আনুষ্ঠানিক শিক্ষা","status":"draft"},"Local Studios":{"text":"স্থানীয় স্টুডিও","status":"draft"},"Schools":{"text":"স্কুল","status":"draft"},"Services":{"text":"সেবা","status":"draft"},"Accounts":{"text":"অ্যাকাউন্ট","status":"draft"},"Help Desk":{"text":"সহায়তা কেন্দ্র","status":"draft"},"Beta Program":{"text":"বিটা প্রোগ্রাম","status":"draft"},"Help":{"text":"সাহায্য","status":"draft"},"Beta":{"text":"বিটা","status":"draft"},"Student":{"text":"শিক্ষার্থী","status":"draft"},"Family":{"text":"পরিবার","status":"draft"},"Teacher":{"text":"শিক্ষক","status":"draft"},"Learning":{"text":"শেখা","status":"draft"},"Records":{"text":"নথি","status":"draft"},"Linguistics":{"text":"ভাষাবিজ্ঞান","status":"draft"},"Spanish":{"text":"স্প্যানিশ","status":"draft"},"French":{"text":"ফরাসি","status":"draft"},"German":{"text":"জার্মান","status":"draft"},"Russian":{"text":"রুশ","status":"draft"},"Arabic":{"text":"আরবি","status":"draft"},"Mandarin Chinese":{"text":"ম্যান্ডারিন চীনা","status":"draft"},"Japanese":{"text":"জাপানি","status":"draft"},"Listening":{"text":"শোনা","status":"draft"},"Speaking":{"text":"বলা","status":"draft"},"Reading":{"text":"পড়া","status":"draft"},"Writing":{"text":"লেখা","status":"draft"},"Translation":{"text":"অনুবাদ","status":"draft"},"Culture":{"text":"সংস্কৃতি","status":"draft"},"Mediation":{"text":"মধ্যস্থতা","status":"draft"},"Voice":{"text":"কণ্ঠ","status":"draft"},"Search":{"text":"অনুসন্ধান","status":"draft"},"Clear":{"text":"মুছুন","status":"draft"},"Begin with a greeting.":{"text":"একটি অভিবাদন দিয়ে শুরু করুন।","status":"draft"},"Hear phrase":{"text":"বাক্যটি শুনুন","status":"draft"},"Next phrase":{"text":"পরবর্তী বাক্য","status":"draft"},"Choose a voice":{"text":"কণ্ঠ বেছে নিন","status":"draft"},"Open the Academy":{"text":"একাডেমি খুলুন","status":"draft"},"Open Academy":{"text":"একাডেমি খুলুন","status":"draft"},"Support Polyglot":{"text":"Polyglot-কে সহায়তা করুন","status":"draft"},"Switch color theme":{"text":"রঙের থিম বদলান","status":"draft"},"Open navigation":{"text":"নেভিগেশন খুলুন","status":"draft"},"Language filter":{"text":"ভাষা ফিল্টার","status":"draft"},"Practice text":{"text":"অনুশীলনের পাঠ্য","status":"draft"},"Speech rate":{"text":"বলার গতি","status":"draft"},"Voice pitch":{"text":"কণ্ঠের স্বর","status":"draft"},"Hear practice text":{"text":"অনুশীলনের পাঠ্য শুনুন","status":"draft"},"Stop speech":{"text":"কণ্ঠ বন্ধ করুন","status":"draft"},"Use browser default":{"text":"ব্রাউজারের ডিফল্ট ব্যবহার করুন","status":"draft"},"Return to Top":{"text":"উপরে ফিরুন","status":"draft"},"Primary navigation":{"text":"প্রধান নেভিগেশন","status":"draft"},"Quick access":{"text":"দ্রুত প্রবেশ","status":"draft"},"World Language Atlas":{"text":"বিশ্ব ভাষা অ্যাটলাস","status":"draft"},"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"text":"Polyglot | খেমেনেস একাডেমি: ভাষাবিজ্ঞান ও বিশ্বভাষা","status":"curated-draft"},"Khaemenes Academy | Front Desk":{"text":"খেমেনেস একাডেমি | অভ্যর্থনা","status":"curated-draft"},"Verve N Veda | Public Gateway":{"text":"Verve N Veda | উন্মুক্ত প্রবেশদ্বার","status":"curated-draft"},"All":{"text":"সব","status":"curated-draft"},"Open":{"text":"খুলুন","status":"curated-draft"},"Browse 30 local apps":{"text":"৩০টি স্থানীয় অ্যাপ দেখুন","status":"curated-draft"},"Five-Language Academy":{"text":"পাঁচ ভাষার একাডেমি","status":"curated-draft"},"Sovereign Translator":{"text":"স্বাধীন অনুবাদক","status":"curated-draft"},"Arabic Language":{"text":"আরবি ভাষা","status":"curated-draft"},"English / ESL":{"text":"ইংরেজি / ESL","status":"curated-draft"},"Qur'anic Arabic":{"text":"কোরআনিক আরবি","status":"curated-draft"},"Language Compass":{"text":"ভাষা দিকদর্শন","status":"curated-draft"},"Start at the Front Desk":{"text":"অভ্যর্থনা থেকে শুরু করুন","status":"curated-draft"},"Welcome to the Academy":{"text":"একাডেমিতে স্বাগতম","status":"curated-draft"},"The Four Great Halls":{"text":"চারটি প্রধান হল","status":"curated-draft"},"Welcome Home":{"text":"বাড়িতে স্বাগতম","status":"curated-draft"},"Browse Every Public Hall":{"text":"সব উন্মুক্ত হল দেখুন","status":"curated-draft"}}}};Object.freeze(seed);
root.KhaemenesSovereignSeeds=seed;})(window);
```

## Linguistics-owned canonical resource loader — FULL JavaScript source

**Source:** `vervenveda/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js`, blob `1ebfa3c7e427cc416695cb45f935ba56a456c9b8`. Cross-repository dependency; snapshot here is informational, not permission to fork the authority.

```javascript
/* Khaemenes shared translator loader v1.0
 * Additive and local-first. Runs after pre-existing page engines without replacing them.
 * Loads missing optional vocabulary resources in dependency order; never sends text.
 */
(function(root){"use strict";
const VERSION="1.1.0";
const script=document.currentScript;
const base=new URL(".",script.src);
const definitions=[
 ["campus","khaemenes-campus-phrases.js",()=>!!root.KhaemenesSovereignSeeds],
 ["dictionary","sovereign-dictionary.generated.js",()=>!!root.KhaemenesSovereignDictionary],
 ["lexicon","khaemenes-lexicon-expansion.js",()=>!!root.KhaemenesLexiconExpansion],
 ["transliteration","khaemenes-transliteration.js",()=>!!root.KhaemenesTransliteration],
 ["core","khaemenes-interlingual-core.js",()=>!!root.KhaemenesSovereignTranslate],
 ["reviewPolicy","khaemenes-review-policy.js",()=>!!root.KhaemenesReviewPolicy]
];
let lastReport=null,active=null;
function loadFile(name){
 return new Promise((resolve,reject)=>{
  const tag=document.createElement("script");
  tag.src=new URL(name,base).href;tag.async=false;
  tag.addEventListener("load",()=>resolve(),{once:true});
  tag.addEventListener("error",()=>reject(Error("Local resource missing: "+name)),{once:true});
  document.head.appendChild(tag);
 });
}
async function ensure({full=false,upgradeLegacyCore=false}={}){
 if(active)return active;
 active=(async()=>{
  const records=[];
  for(const [key,file,ready] of definitions){
   if(!full&&["dictionary","lexicon","transliteration"].includes(key))continue;
   const coreUpgrade=key==="core"&&upgradeLegacyCore&&typeof root.KhaemenesSovereignTranslate?.listLocalEntries!=="function";
   if(coreUpgrade&&full&&records.some(r=>["dictionary","lexicon","transliteration"].includes(r.key)&&!["existing","loaded"].includes(r.state))){records.push({key,state:"skipped-incomplete-resources"});continue}
   if(ready()&&!coreUpgrade){records.push({key,state:"existing"});continue}
   try{await loadFile(file);records.push({key,state:ready()?"loaded":"loaded-no-global"})}
   catch(error){records.push({key,state:"unavailable",reason:error.message})}
  }
  const canonicalCore=typeof root.KhaemenesSovereignTranslate?.listLocalEntries==="function";
  lastReport={version:VERSION,mode:full?"complete":"base",upgradeLegacyCore,canonicalCore,records,externalRequests:0};
  root.dispatchEvent(new CustomEvent("khaemenes:translator-resources",{detail:lastReport}));
  return lastReport;
 })();
 try{return await active}finally{active=null}
}
root.KhaemenesTranslatorLoader=Object.freeze({version:VERSION,ensure,status:()=>lastReport,resources:definitions.map(([key])=>key)});
})(window);
```

