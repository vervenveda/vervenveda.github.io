/* Verve N Veda Administration module loader · 2026-08-21 */
(() => {
  "use strict";
  const STYLE_ID="vnvAdminLightTheme";
  const modules=["repository-architecture-core.js","academy-data-dashboard.js","beta-coverage-dashboard.js"];

  function loadTheme(){
    if(!document.getElementById(STYLE_ID)){
      const link=document.createElement("link");
      link.id=STYLE_ID;
      link.rel="stylesheet";
      link.href="vnv-admin-light.css";
      document.head.append(link);
    }
    /* Default to the readable Verve N Veda light presentation.
       The existing theme toggle remains available for a deliberate dark-mode choice. */
    try{
      if(typeof window.applyTheme==="function")window.applyTheme("light");
      else document.body.dataset.theme="light";
    }catch{document.body.dataset.theme="light"}
  }

  function loadNext(index){
    if(index>=modules.length)return;
    const src=modules[index];
    if(document.querySelector(`script[data-admin-module="${src}"]`)){loadNext(index+1);return}
    const script=document.createElement("script");
    script.src=src;
    script.defer=true;
    script.dataset.adminModule=src;
    script.onload=()=>loadNext(index+1);
    script.onerror=()=>{console.warn(`Admin module failed to load: ${src}`);loadNext(index+1)};
    document.head.append(script);
  }

  function start(){loadTheme();loadNext(0)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
