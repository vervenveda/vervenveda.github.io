/* Verve N Veda · Beta Program universal button widget · v1.3.0 */
(() => {
  "use strict";

  const ID="vnvBetaProgramLink";
  const FALLBACK_ID="vnvBetaProgramFallback";
  const STYLE_ID="vnvBetaProgramLinkStyles";
  const SCRIPT_MARK="vnvBetaProgramScript";
  const BETA_URL="https://vervenveda.com/beta/";
  const SCRIPT_URL="https://vervenveda.com/assets/vnv-beta-link.js";

  const clean=(value,max)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").slice(0,max);

  const safeSource=()=>{
    try{
      /* Deliberately limited to public routing metadata. Never include query,
         hash, learner IDs, family IDs, form values, course state, or storage. */
      const host=clean(location.hostname||"",120).replace(/[^a-z0-9.:-]/gi,"");
      const path=clean(location.pathname||"/",240);
      return `${host}${path}`.slice(0,320)||"ecosystem";
    }catch{return "ecosystem"}
  };

  const safeSurface=()=>{
    try{
      const path=String(location.pathname||"/").toLowerCase();
      const base=(path.split("/").pop()||"").toLowerCase();
      const indexLike=!base||base==="index.html"||base.endsWith("_index.html")||base.endsWith("-index.html");
      const homeworkLike=/(^|\/)(homework|assignment|assignments|lesson|lessons|unit|units|worksheet|worksheets)(\/|$)/.test(path);
      const assessmentLike=/(^|\/)(assessment|assessments|quiz|quizzes|exam|exams)(\/|$)/.test(path);
      if(indexLike&&homeworkLike)return "homework-index";
      if(indexLike&&assessmentLike)return "assessment-index";
      if(indexLike)return "interactive-index";
      if(homeworkLike)return "homework-surface";
      if(assessmentLike)return "assessment-surface";
      return "interactive-surface";
    }catch{return "interactive-surface"}
  };

  const betaHref=()=>`${BETA_URL}?source=${encodeURIComponent(safeSource())}&surface=${encodeURIComponent(safeSurface())}`;

  function mount(){
    if(document.getElementById(ID)||!document.body)return;

    if(!document.getElementById(STYLE_ID)){
      const style=document.createElement("style");
      style.id=STYLE_ID;
      style.textContent=`
        #${ID}{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482000;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:8px 12px;border:1px solid rgba(183,147,77,.72);border-radius:999px;color:#f7efe0;background:rgba(15,25,37,.94);box-shadow:0 8px 24px rgba(0,0,0,.18);font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.045em;text-decoration:none;backdrop-filter:blur(9px);cursor:pointer;-webkit-tap-highlight-color:transparent}
        #${ID}:hover{transform:translateY(-1px);border-color:#dfc48e;background:#152538}
        #${ID}:focus-visible{outline:3px solid #dfc48e;outline-offset:3px}
        #${ID} .vnv-beta-mark{font:600 15px/1 Georgia,serif;color:#dfc48e}
        #${FALLBACK_ID}{display:none!important}
        @media(max-width:520px){#${ID}{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));min-height:38px;padding:7px 10px}}
        @media print{#${ID},#${FALLBACK_ID}{display:none!important}}
        @media(prefers-reduced-motion:reduce){#${ID}{transition:none!important;transform:none!important}}
      `;
      (document.head||document.documentElement).append(style);
    }

    const fallback=document.getElementById(FALLBACK_ID);
    if(fallback){
      fallback.setAttribute("href",betaHref());
      fallback.setAttribute("aria-hidden","true");
      fallback.tabIndex=-1;
    }

    /* A button is intentional: several Verve N Veda surfaces guard anchor
       navigation. Programmatic same-origin navigation avoids interfering with
       those link policies while remaining keyboard accessible. */
    const button=document.createElement("button");
    button.id=ID;
    button.type="button";
    button.dataset.betaSurface=safeSurface();
    button.setAttribute("aria-label","Open the Verve N Veda Beta Program for this page");

    const mark=document.createElement("span");
    mark.className="vnv-beta-mark";
    mark.setAttribute("aria-hidden","true");
    mark.textContent="β";
    const label=document.createElement("span");
    label.textContent="Beta Program";
    button.append(mark,label);

    button.addEventListener("click",()=>{
      try{window.location.assign(betaHref())}catch{window.location.href=BETA_URL}
    });
    document.body.append(button);
  }

  function attachToFrame(frame){
    if(!frame||frame.dataset?.vnvBetaBound==="1")return;
    try{frame.dataset.vnvBetaBound="1"}catch{}
    const install=()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc||!doc.documentElement)return; // cross-origin or unavailable: fail closed
        if(doc.getElementById(ID)||doc.querySelector(`script[data-${SCRIPT_MARK}]`))return;
        const script=doc.createElement("script");
        script.src=SCRIPT_URL;
        script.defer=true;
        script.setAttribute(`data-${SCRIPT_MARK}`,"1");
        (doc.head||doc.documentElement).appendChild(script);
      }catch{/* Cross-origin frames are intentionally untouched. */}
    };
    frame.addEventListener("load",install,{passive:true});
    install();
  }

  function bindVisibleFrames(){
    if(!document.querySelectorAll)return;
    document.querySelectorAll("iframe").forEach(attachToFrame);
    if(typeof MutationObserver!=="function")return;
    const observer=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes||[]){
          if(node?.nodeType!==1)continue;
          if(node.tagName==="IFRAME")attachToFrame(node);
          node.querySelectorAll?.("iframe").forEach(attachToFrame);
        }
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  function start(){mount();bindVisibleFrames()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();

  window.VNVBetaProgram=Object.freeze({version:"1.3.0",mount,source:safeSource,surface:safeSurface,href:betaHref});
})();
