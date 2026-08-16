/* Verve N Veda Administration module loader · 2026-08-16 */
(() => {
  "use strict";
  const modules=["repository-architecture-core.js","academy-data-dashboard.js"];
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
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>loadNext(0),{once:true});else loadNext(0);
})();
