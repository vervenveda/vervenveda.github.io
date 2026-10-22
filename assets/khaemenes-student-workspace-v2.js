/*
  Verve N Veda · Khaemenes Student Workspace Adapter v2.0
  Applies learner-owned accessibility/workspace preferences across Khaemenes campuses.
  Presentation only: never grades, placement, mastery, identity, or assessment state.
*/
(()=>{
"use strict";

const VERSION="2.1.0";
const STYLE_ID="khaemenesStudentWorkspaceV2Styles";
const CONTRACT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-student-profile-v2.js";
const CONTRACT_MARK="khaemenesStudentProfileV2Contract";

function ensureStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=[
    'html[data-khae-workspace-text-size="small"] body{font-size:.94em}',
    'html[data-khae-workspace-text-size="large"] body{font-size:1.08em}',
    'html[data-khae-workspace-text-size="extra-large"] body{font-size:1.18em}',
    'html[data-khae-workspace-line-spacing="wide"] :where(p,li,dd,dt,td,th,label){line-height:1.9}',
    'html[data-khae-workspace-line-spacing="comfortable"] :where(p,li,dd,dt,td,th,label){line-height:1.7}',
    'html[data-khae-workspace-theme="academy"]{--khae-workspace-accent:#a8843f}',
    'html[data-khae-workspace-theme="parchment"]{--khae-workspace-accent:#7f6433}',
    'html[data-khae-workspace-theme="forest"]{--khae-workspace-accent:#4f7f7a}',
    'html[data-khae-workspace-theme="midnight"]{--khae-workspace-accent:#9bb7d9}',
    'html[data-khae-workspace-theme="ocean"]{--khae-workspace-accent:#3d7c99}',
    'html[data-khae-workspace-theme="plum"]{--khae-workspace-accent:#866487}',
    'html[data-khae-workspace-active="1"] :where(input,textarea,select){accent-color:var(--khae-workspace-accent,currentColor)}',
    'html[data-khae-workspace-contrast="high"] :where(a,button,input,textarea,select,[tabindex]):focus-visible{outline:4px solid var(--khae-workspace-accent,currentColor)!important;outline-offset:4px!important}',
    'html[data-khae-workspace-contrast="high"] a{text-decoration-thickness:2px;text-underline-offset:3px}',
    'html[data-khae-workspace-reading-width="narrow"] :where(main p,main blockquote,main .reading,main .prose,main .lesson-text){max-width:62ch}',
    'html[data-khae-workspace-reading-width="comfortable"] :where(main p,main blockquote,main .reading,main .prose,main .lesson-text){max-width:78ch}',
    'html[data-khae-workspace-reading-width="wide"] :where(main p,main blockquote,main .reading,main .prose,main .lesson-text){max-width:96ch}',
    'html[data-khae-workspace-density="compact"] :where(.grid,.profile-v2-grid,.lesson-grid,.card-grid){gap:10px!important}',
    'html[data-khae-workspace-density="compact"] :where(.card,.profile-v2-card,.lesson-card,[data-khae-density-aware]){padding-block:clamp(10px,1.6vw,16px)!important}',
    'html[data-khae-workspace-tts="true"] :where([data-tts],[data-tts-control],.tts-button,[aria-label*="read aloud" i],[aria-label*="text-to-speech" i]){outline:1px solid var(--khae-workspace-accent,currentColor);outline-offset:2px}',
    'html[data-khae-workspace-simplified="true"] :where([data-khae-optional="true"],[data-khae-simplifiable="optional"]){display:none!important}',
    'html[data-khae-workspace-reduced-motion="true"] *,html[data-khae-workspace-reduced-motion="true"] *::before,html[data-khae-workspace-reduced-motion="true"] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}',
    '@media(prefers-reduced-motion:reduce){html[data-khae-workspace-active="1"] *,html[data-khae-workspace-active="1"] *::before,html[data-khae-workspace-active="1"] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}'
  ].join("\n");
  (document.head||document.documentElement).append(style);
}

const LANGUAGE_ALIASES=Object.freeze({
  english:"en",en:"en",spanish:"es",es:"es",french:"fr",fr:"fr",arabic:"ar",ar:"ar",
  chinese:"zh",mandarin:"zh","mandarin chinese":"zh",zh:"zh",german:"de",de:"de",russian:"ru",ru:"ru",
  portuguese:"pt",pt:"pt",hindi:"hi",hi:"hi",japanese:"ja",ja:"ja",korean:"ko",ko:"ko",
  italian:"it",it:"it",bengali:"bn",bn:"bn"
});
let languageAppliedFor="";

function preferredLanguageCode(value){
  const raw=String(value||"").trim().toLowerCase();
  return LANGUAGE_ALIASES[raw]||"";
}
function handoffLanguage(learnerId,value){
  const code=preferredLanguageCode(value),token=String(learnerId||"")+"|"+code;
  if(!code||languageAppliedFor===token)return;
  const V=window.VNVLanguage;
  if(!V?.setLanguage||!V.availableLanguages?.().includes(code))return;
  if(V.getLanguage?.()!==code)V.setLanguage(code,false);
  languageAppliedFor=token;
}
function announceCapabilities(workspace){
  try{
    window.dispatchEvent(new CustomEvent("khaemenes-workspace-preferences",{
      detail:{tts:Boolean(workspace.tts),simplifiedDashboard:Boolean(workspace.simplifiedDashboard),readingWidth:workspace.readingWidth||"comfortable",density:workspace.density||"comfortable"}
    }));
  }catch{}
}

function clearWorkspace(){
  const root=document.documentElement;
  ["Active","Theme","TextSize","LineSpacing","ReadingWidth","Contrast","Density","ReducedMotion","Tts","Simplified"].forEach(key=>{
    delete root.dataset["khaeWorkspace"+key];
  });
}

function apply(){
  const P=window.KhaemenesStudentProfileV2;
  const learner=P&&typeof P.activeLearner==="function"?P.activeLearner():null;
  const record=learner&&learner.learnerId&&typeof P.read==="function"?P.read(learner.learnerId):null;
  if(!record||!record.workspace){clearWorkspace();return false}
  ensureStyles();
  const w=record.workspace,root=document.documentElement;
  root.dataset.khaeWorkspaceActive="1";
  root.dataset.khaeWorkspaceTheme=w.theme||"academy";
  root.dataset.khaeWorkspaceTextSize=w.textSize||"standard";
  root.dataset.khaeWorkspaceLineSpacing=w.lineSpacing||"comfortable";
  root.dataset.khaeWorkspaceReadingWidth=w.readingWidth||"comfortable";
  root.dataset.khaeWorkspaceContrast=w.contrast||"standard";
  root.dataset.khaeWorkspaceDensity=w.density||"comfortable";
  root.dataset.khaeWorkspaceReducedMotion=String(Boolean(w.reducedMotion));
  root.dataset.khaeWorkspaceTts=String(Boolean(w.tts));
  root.dataset.khaeWorkspaceSimplified=String(Boolean(w.simplifiedDashboard));
  root.dataset.khaeWorkspacePreferredLanguage=preferredLanguageCode(w.preferredLanguage)||"";
  handoffLanguage(learner.learnerId,w.preferredLanguage);
  announceCapabilities(w);
  return true;
}

function loadContract(){
  if(window.KhaemenesStudentProfileV2){apply();return}
  const selector='script[data-'+CONTRACT_MARK+'],script[src="'+CONTRACT_URL+'"]';
  const existing=document.querySelector(selector);
  if(existing){
    existing.addEventListener("load",apply,{once:true});
    setTimeout(apply,500);
    return;
  }
  const script=document.createElement("script");
  script.src=CONTRACT_URL;script.async=false;script.setAttribute("data-"+CONTRACT_MARK,"1");
  script.onload=apply;
  (document.head||document.documentElement).append(script);
}

function boot(){
  ensureStyles();loadContract();
  window.addEventListener("khaemenes-student-profile-changed",apply);
  window.addEventListener("khaemenes-family-changed",apply);
  window.addEventListener("storage",event=>{
    const key=String(event.key||"");
    if(key==="khaemenes_student_profile_v2"||key.startsWith("khaemenes.student-profile.v3:")||key==="khaemenes_active_learner_v1"||key==="khaemenes_family_registry_v1")apply();
  });
  window.addEventListener("pageshow",apply);
  let tries=0;const languageRetry=setInterval(()=>{
    tries++;apply();
    const P=window.KhaemenesStudentProfileV2,learner=P?.activeLearner?.(),record=learner?.learnerId?P.read?.(learner.learnerId):null;
    const code=preferredLanguageCode(record?.workspace?.preferredLanguage);
    if(!code||window.VNVLanguage?.setLanguage||tries>=8)clearInterval(languageRetry);
  },350);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.KhaemenesStudentWorkspaceV2=Object.freeze({version:VERSION,apply,preferredLanguageCode});
})();