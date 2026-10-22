/*
  Verve N Veda · Khaemenes Student Workspace Adapter v2.0
  Applies learner-owned accessibility/workspace preferences across Khaemenes campuses.
  Presentation only: never grades, placement, mastery, identity, or assessment state.
*/
(()=>{
"use strict";

const VERSION="2.0.0";
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
    'html[data-khae-workspace-contrast="high"] :where(a,button,input,textarea,select,[tabindex]):focus-visible{outline:4px solid currentColor!important;outline-offset:4px!important}',
    'html[data-khae-workspace-contrast="high"] a{text-decoration-thickness:2px;text-underline-offset:3px}',
    'html[data-khae-workspace-reduced-motion="true"] *,html[data-khae-workspace-reduced-motion="true"] *::before,html[data-khae-workspace-reduced-motion="true"] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}',
    '@media(prefers-reduced-motion:reduce){html[data-khae-workspace-active="1"] *,html[data-khae-workspace-active="1"] *::before,html[data-khae-workspace-active="1"] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}'
  ].join("\n");
  (document.head||document.documentElement).append(style);
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
    if(event.key==="khaemenes_student_profile_v2"||event.key==="khaemenes_active_learner_v1"||event.key==="khaemenes_family_registry_v1")apply();
  });
  window.addEventListener("pageshow",apply);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.KhaemenesStudentWorkspaceV2=Object.freeze({version:VERSION,apply});
})();