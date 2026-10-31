/* Verve N Veda · canonical 333 Network ecosystem ticker · v1.0.0
   Shared implementation of the original Verve N Veda gateway ticker.
   Authorized ticker pair: this ecosystem ticker + vnv-ticker-autopopulate.js only. */
(()=>{"use strict";
if(window.VNV333Ticker)return;
const ROOT="vnv333NetworkTicker",STYLE="vnv333NetworkTickerStyles",PAUSE_KEY="VNV_333_TICKER_PAUSED";
const H=33;
const links=[
 ["HOLLO","https://vervenveda.github.io/333.github.io/app/HOLLO_333_direct_connect_index.html","app"],
 ["KANSEE","https://vervenveda.github.io/333.github.io/app/KANSEE_333_meeting_rooms_index.html","app"],
 ["E=Ven Mail","https://vervenveda.github.io/333.github.io/app/EVen_mail_index.html","app"],
 ["Bazaar Art Live","https://vervenveda.github.io/333.github.io/app/Bazaar_Art_Live_index.html","app"],
 ["SIte Studio","https://vervenveda.github.io/333.github.io/app/SIte_builder_index.html","app"],
 ["Bunya","https://vervenveda.github.io/333.github.io/app/Bunya_digital_infrastructure_index.html","app"],
 ["Support Free Access","https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s","call"],
 ["Open 333 →","https://vervenveda.github.io/333.github.io/","call"]
];
function frozenGateway(){
 const host=String(location.hostname||"").toLowerCase();
 const path=(String(location.pathname||"/").replace(/\/+$/,"")||"/").toLowerCase();
 return path==="/"&&(host==="vervenveda.com"||host==="www.vervenveda.com"||host==="vervenveda.github.io");
}
function ensureStyle(){
 if(document.getElementById(STYLE))return;
 const s=document.createElement("style");s.id=STYLE;s.textContent=`
:root{--vnv-333-ticker-height:33px}
#${ROOT}{position:sticky;top:0;z-index:2147481200;height:var(--vnv-333-ticker-height);display:grid;grid-template-columns:minmax(0,1fr) 44px;overflow:hidden;color:#f4ead1;background:linear-gradient(90deg,#07101d,#10243b 48%,#07101d);border-bottom:1px solid rgba(255,255,255,.13);box-shadow:0 4px 14px rgba(6,15,27,.15);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif}
#${ROOT} .vnv333-viewport{min-width:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%)}
#${ROOT} .vnv333-track{width:max-content;height:100%;display:flex;align-items:center;white-space:nowrap;animation:vnv333Move 26s linear infinite;will-change:transform}
#${ROOT}:hover .vnv333-track,#${ROOT}:focus-within .vnv333-track,#${ROOT}[data-paused="true"] .vnv333-track{animation-play-state:paused}
#${ROOT} .vnv333-set{height:100%;display:flex;align-items:center;gap:24px;padding-inline:11px}
#${ROOT} .vnv333-label{flex:0 0 auto;color:#e7d7b6;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:11px;font-weight:444;letter-spacing:.25em;text-transform:uppercase}
#${ROOT} a{min-height:24px;display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;color:#eef3f7!important;text-decoration:none!important;font-size:11px!important;font-weight:444!important;letter-spacing:.1em!important;text-transform:uppercase!important;white-space:nowrap!important}
#${ROOT} a[data-kind="app"]::before{content:"";width:3px;height:3px;border-radius:50%;background:#b48b45;box-shadow:0 0 0 2px rgba(180,139,69,.13)}
#${ROOT} a[data-kind="call"]{padding:4px 11px;border:1px solid rgba(231,215,182,.3);border-radius:7px;background:rgba(255,255,255,.05)}
#${ROOT} a:hover,#${ROOT} a:focus-visible{color:#fff!important;text-decoration:underline!important;text-underline-offset:3px!important}
#${ROOT} .vnv333-control{width:44px;height:var(--vnv-333-ticker-height);display:grid;place-items:center;padding:0;border:0;border-left:1px solid rgba(255,255,255,.13);border-radius:0;color:#f4ead1;background:rgba(0,0,0,.14);font:400 11px/1 Arial,sans-serif;cursor:pointer}
#${ROOT} .vnv333-control:hover{background:rgba(255,255,255,.09)}
#vnvTickerAutoPopulate{top:var(--vnv-333-ticker-height)!important}
@keyframes vnv333Move{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(max-width:560px){:root{--vnv-333-ticker-height:32px}#${ROOT}{grid-template-columns:minmax(0,1fr) 36px}#${ROOT} .vnv333-track{animation-duration:24s}#${ROOT} .vnv333-set{gap:18px;padding-inline:9px}#${ROOT} .vnv333-label{font-size:9px}#${ROOT} a{font-size:10px!important}#${ROOT} .vnv333-control{width:36px}}
@media(prefers-reduced-motion:reduce){#${ROOT} .vnv333-track{animation:none!important;transform:none!important;overflow-x:auto}}
@media print{#${ROOT}{display:none!important}}
`;document.head.append(s);
}
function makeSet(hidden=false){
 const set=document.createElement("div");set.className="vnv333-set";if(hidden)set.setAttribute("aria-hidden","true");
 const label=document.createElement("span");label.className="vnv333-label";label.textContent="333 Network";set.append(label);
 for(const [text,url,kind] of links){const a=document.createElement("a");a.href=url;a.textContent=text;a.dataset.kind=kind;if(hidden)a.tabIndex=-1;set.append(a)}
 return set;
}
function syncStack(){
 const local=document.getElementById("vnvTickerAutoPopulate");
 const total=H+(local?Math.ceil(local.getBoundingClientRect().height||33):0);
 document.documentElement.style.setProperty("--vnv-ticker-stack-height",total+"px");
 document.documentElement.style.setProperty("--ticker-height",total+"px");
}
function mount(){
 if(frozenGateway()||!document.body||document.getElementById(ROOT))return;
 ensureStyle();
 const ticker=document.createElement("div");ticker.id=ROOT;ticker.dataset.paused="false";ticker.setAttribute("aria-label","333 Network ecosystem ticker");
 const viewport=document.createElement("div");viewport.className="vnv333-viewport";
 const track=document.createElement("div");track.className="vnv333-track";track.append(makeSet(false),makeSet(true));viewport.append(track);
 const button=document.createElement("button");button.className="vnv333-control";button.type="button";
 let paused=false;try{paused=localStorage.getItem(PAUSE_KEY)==="true"}catch{}
 const apply=v=>{ticker.dataset.paused=String(v);button.setAttribute("aria-pressed",String(v));button.setAttribute("aria-label",v?"Resume 333 Network ticker":"Pause 333 Network ticker");button.textContent=v?"▶":"Ⅱ";try{localStorage.setItem(PAUSE_KEY,String(v))}catch{}};
 apply(paused);button.addEventListener("click",()=>apply(ticker.dataset.paused!=="true"));
 ticker.append(viewport,button);
 const anchor=document.getElementById("vnvTickerAutoPopulate")||document.querySelector("[data-khae-header],.site-header,header");
 if(anchor?.parentNode)anchor.parentNode.insertBefore(ticker,anchor);else document.body.prepend(ticker);
 syncStack();
 const mo=new MutationObserver(()=>syncStack());mo.observe(document.body,{childList:true,subtree:false});
 window.addEventListener("resize",syncStack,{passive:true});
}
window.VNV333Ticker=Object.freeze({version:"1.0.0",mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();