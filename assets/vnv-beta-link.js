/* Verve N Veda · Beta Program universal link widget · v1.0.0 */
(() => {
  "use strict";
  if(document.getElementById("vnvBetaProgramLink"))return;

  const BETA_URL="https://vervenveda.com/beta/";
  const source=(()=>{try{return `${location.hostname}${location.pathname}`.slice(0,240)}catch{return "ecosystem"}})();
  const href=`${BETA_URL}?source=${encodeURIComponent(source)}`;

  const style=document.createElement("style");
  style.id="vnvBetaProgramLinkStyles";
  style.textContent=`
    #vnvBetaProgramLink{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482000;display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:7px 11px;border:1px solid rgba(183,147,77,.72);border-radius:999px;color:#f7efe0;background:rgba(15,25,37,.94);box-shadow:0 8px 24px rgba(0,0,0,.18);font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.045em;text-decoration:none;backdrop-filter:blur(9px)}
    #vnvBetaProgramLink:hover{transform:translateY(-1px);border-color:#dfc48e;background:#152538}#vnvBetaProgramLink span:first-child{font:600 15px/1 Georgia,serif;color:#dfc48e}@media print{#vnvBetaProgramLink{display:none!important}}@media(prefers-reduced-motion:reduce){#vnvBetaProgramLink{transition:none!important}}
  `;
  document.head.append(style);

  const a=document.createElement("a");
  a.id="vnvBetaProgramLink";
  a.href=href;
  a.setAttribute("aria-label","Open the Verve N Veda Beta Program");
  a.innerHTML='<span>β</span><span>Beta Program</span>';
  document.body.append(a);
})();
