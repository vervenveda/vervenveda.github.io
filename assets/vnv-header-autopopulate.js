/* Verve N Veda · Header AutoPopulate · canonical idempotent header engine · v1.0.0
   Purpose: one simple page-identity header per migrated public page.
   Ticker systems remain separate: this file never mounts, removes, or styles tickers. */
(()=>{"use strict";
if(window.VNV_HEADER?.mount)return;

const VERSION="1.0.0";
const ROOT_ID="vnvHeaderAutoPopulate";
const STYLE_ID="vnvHeaderAutoPopulateStyles";
const PANEL_ID="vnvHeaderMenu";
const HOME="https://vervenveda.com/";

const MENU=Object.freeze([
  ["Verve N Veda Home",HOME],
  ["Khaemenes Academy","https://vervenveda.com/Khaemenes_Academy.github.io/"],
  ["Professional","https://vervenveda.github.io/proresource_hub.github.io/ProReSources_updated_index.html"],
  ["Creative","https://vervenveda.github.io/bazaarart.github.io/"],
  ["Communication","https://vervenveda.github.io/333.github.io/"],
  ["Citizen Resources",HOME+"#directory"],
  ["Civic and Political","https://vervenveda.github.io/onenationforall.github.io/"],
  ["AI Mentors","https://artist1970.github.io/NAIB.github.io/"]
]);

function cleanText(value){
  return String(value||"").replace(/\s+/g," ").trim();
}
function pageTitle(options={}){
  const explicit=cleanText(options.title||document.body?.dataset.vnvHeaderTitle);
  if(explicit)return explicit;
  const h1=[...document.querySelectorAll("main h1,h1")].find(el=>!el.closest("#"+ROOT_ID));
  const fromH1=cleanText(h1?.textContent);
  if(fromH1)return fromH1.slice(0,90);
  const og=cleanText(document.querySelector('meta[property="og:title"]')?.content);
  if(og)return og.split(/\s[|·—–]\s/)[0].trim().slice(0,90);
  const doc=cleanText(document.title);
  if(doc)return doc.split(/\s[|·—–]\s/)[0].trim().slice(0,90);
  return "Verve N Veda";
}
function pageSubtitle(options={}){
  const explicit=cleanText(options.subtitle||document.body?.dataset.vnvHeaderSubtitle);
  if(explicit)return explicit;
  const meta=cleanText(document.querySelector('meta[name="description"]')?.content);
  return meta && meta.length<=90 ? meta : "";
}
function initials(title){
  const words=cleanText(title).replace(/[^A-Za-z0-9 ]+/g," ").split(/\s+/).filter(Boolean);
  if(!words.length)return "V";
  if(words.length===1)return words[0].slice(0,3).toUpperCase();
  return words.slice(0,3).map(word=>word[0]).join("").toUpperCase();
}
function iconSource(options={}){
  const explicit=cleanText(options.logo||document.body?.dataset.vnvHeaderLogo);
  if(explicit)return explicit;
  const meta=cleanText(document.querySelector('meta[name="vnv-header-logo"]')?.content);
  if(meta)return meta;
  const icon=document.querySelector('link[rel="apple-touch-icon"][href],link[rel~="icon"][href]');
  return cleanText(icon?.href);
}
function iconText(options={},title=""){
  return cleanText(options.icon||document.body?.dataset.vnvHeaderIcon)||initials(title);
}
function homeHref(options={}){
  return cleanText(options.home||document.body?.dataset.vnvHeaderHome)||location.href;
}
function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement("style");
  s.id=STYLE_ID;
  s.textContent=`
:root{--vnv-header-height:66px;--vnv-header-top:0px}
#${ROOT_ID}{position:sticky;top:var(--vnv-header-top);z-index:2147480000;height:var(--vnv-header-height);box-sizing:border-box;border-bottom:1px solid rgba(18,23,19,.14);background:rgba(244,240,231,.97);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;color:#080b0f}
#${ROOT_ID} .vnv-header-inner{height:100%;display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:14px;padding:0 11px}
#${ROOT_ID} .vnv-header-home{min-width:0;display:flex;align-items:center;gap:11px;color:inherit!important;text-decoration:none!important;text-align:left}
#${ROOT_ID} .vnv-header-logo{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;overflow:hidden;border:1px solid #080b0f;border-radius:7px;color:#fff;background:#080b0f;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:12px;font-weight:400;letter-spacing:.04em;line-height:1}
#${ROOT_ID} .vnv-header-logo img{width:100%;height:100%;object-fit:cover;display:block}
#${ROOT_ID} .vnv-header-copy{min-width:0;display:grid;gap:3px}
#${ROOT_ID} .vnv-header-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:15px;font-weight:400;letter-spacing:.055em;line-height:1.1}
#${ROOT_ID} .vnv-header-subtitle{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#30413d;font-size:9px;font-weight:400;letter-spacing:.05em;line-height:1.2}
#${ROOT_ID} .vnv-header-menu-button{justify-self:end;width:40px;height:40px;display:grid;place-items:center;padding:0;border:1px solid #080b0f;border-radius:7px;color:#fff;background:#080b0f;cursor:pointer}
#${ROOT_ID} .vnv-header-lines,#${ROOT_ID} .vnv-header-lines::before,#${ROOT_ID} .vnv-header-lines::after{content:"";display:block;width:14px;height:1.5px;border-radius:7px;background:#fff;transition:.18s}
#${ROOT_ID} .vnv-header-lines{position:relative}
#${ROOT_ID} .vnv-header-lines::before,#${ROOT_ID} .vnv-header-lines::after{position:absolute;left:0}
#${ROOT_ID} .vnv-header-lines::before{top:-6px}
#${ROOT_ID} .vnv-header-lines::after{top:6px}
#${ROOT_ID} .vnv-header-menu-button[aria-expanded="true"] .vnv-header-lines{background:transparent}
#${ROOT_ID} .vnv-header-menu-button[aria-expanded="true"] .vnv-header-lines::before{transform:translateY(6px) rotate(45deg)}
#${ROOT_ID} .vnv-header-menu-button[aria-expanded="true"] .vnv-header-lines::after{transform:translateY(-6px) rotate(-45deg)}
#${PANEL_ID}{position:fixed;inset:0;z-index:2147483000;display:grid;justify-items:end;visibility:hidden;opacity:0;background:rgba(6,15,12,.56);transition:opacity .18s ease,visibility .18s ease}
#${PANEL_ID}[data-open="true"]{visibility:visible;opacity:1}
#${PANEL_ID} .vnv-header-menu-panel{width:min(92vw,390px);height:100%;box-sizing:border-box;overflow:auto;padding:18px;background:#fbf9f4;box-shadow:-18px 0 48px rgba(8,11,15,.18);transform:translateX(100%);transition:transform .2s ease}
#${PANEL_ID}[data-open="true"] .vnv-header-menu-panel{transform:none}
#${PANEL_ID} .vnv-header-menu-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:12px;border-bottom:1px solid rgba(18,23,19,.14)}
#${PANEL_ID} .vnv-header-menu-top strong{font-family:Cinzel,Aboreto,Georgia,serif;font-size:15px;font-weight:400;letter-spacing:.05em}
#${PANEL_ID} .vnv-header-menu-close{width:36px;height:36px;display:grid;place-items:center;padding:0;border:1px solid rgba(18,23,19,.25);border-radius:7px;background:#fff;color:#080b0f;font-size:20px;cursor:pointer}
#${PANEL_ID} .vnv-header-menu-list{display:grid;gap:7px;margin-top:14px}
#${PANEL_ID} .vnv-header-menu-list a{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid rgba(18,23,19,.14);border-radius:7px;color:#080b0f!important;background:#fff;text-decoration:none!important;font-size:12px;font-weight:400}
#${PANEL_ID} .vnv-header-menu-list a:hover,#${PANEL_ID} .vnv-header-menu-list a:focus-visible{border-color:#b48b45;background:#f4f0e7}
#${PANEL_ID} .vnv-header-menu-list a::after{content:"›";color:#b48b45;font-size:18px}
@media(max-width:560px){:root{--vnv-header-height:64px}#${ROOT_ID} .vnv-header-inner{padding:0 7px}#${ROOT_ID} .vnv-header-logo{width:38px;height:38px;flex-basis:38px}#${ROOT_ID} .vnv-header-title{font-size:13px}#${ROOT_ID} .vnv-header-subtitle{font-size:8px}}
@media print{#${ROOT_ID},#${PANEL_ID}{display:none!important}}
`;
  (document.head||document.documentElement).append(s);
}
function currentTickerHeight(){
  const ids=["vnv333NetworkTicker","vnvTickerAutoPopulate"];
  let total=0;
  for(const id of ids){
    const el=document.getElementById(id);
    if(el && getComputedStyle(el).display!=="none")total+=Math.ceil(el.getBoundingClientRect().height||0);
  }
  return total;
}
function syncTop(){
  document.documentElement.style.setProperty("--vnv-header-top",currentTickerHeight()+"px");
}
function buildMenu(){
  let overlay=document.getElementById(PANEL_ID);
  if(overlay)return overlay;
  overlay=document.createElement("div");
  overlay.id=PANEL_ID;
  overlay.dataset.open="false";
  overlay.setAttribute("aria-hidden","true");
  overlay.innerHTML=`<aside class="vnv-header-menu-panel" role="dialog" aria-modal="true" aria-label="Verve N Veda menu">
    <div class="vnv-header-menu-top"><strong>Verve N Veda</strong><button class="vnv-header-menu-close" type="button" aria-label="Close menu">×</button></div>
    <nav class="vnv-header-menu-list" aria-label="Verve N Veda main folders">
      ${MENU.map(([label,url])=>`<a href="${url}">${label}</a>`).join("")}
    </nav>
  </aside>`;
  document.body.append(overlay);
  const close=()=>setMenu(false);
  overlay.querySelector(".vnv-header-menu-close")?.addEventListener("click",close);
  overlay.addEventListener("click",event=>{if(event.target===overlay)close()});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&overlay.dataset.open==="true")close()});
  return overlay;
}
function setMenu(open){
  const overlay=buildMenu();
  const button=document.querySelector("#"+ROOT_ID+" .vnv-header-menu-button");
  overlay.dataset.open=String(open);
  overlay.setAttribute("aria-hidden",String(!open));
  button?.setAttribute("aria-expanded",String(open));
  document.body.style.overflow=open?"hidden":"";
  if(open)overlay.querySelector(".vnv-header-menu-close")?.focus();
}
function legacyCandidates(options={}){
  if(Array.isArray(options.legacySelectors))return options.legacySelectors;
  return [
    "[data-vnv-header-legacy]",
    "header.site-header",
    "header[data-khae-header]"
  ];
}
function removeLegacy(options={}){
  if(options.replaceLegacy!==true && document.body?.dataset.vnvHeaderReplace!=="true")return;
  for(const sel of legacyCandidates(options)){
    try{
      document.querySelectorAll(sel).forEach(el=>{if(el.id!==ROOT_ID)el.remove()});
    }catch{}
  }
}
function createLogo(root,title,options={}){
  const box=document.createElement("span");
  box.className="vnv-header-logo";
  const src=iconSource(options);
  if(src){
    const img=document.createElement("img");
    img.src=src;
    img.alt="";
    img.addEventListener("error",()=>{
      img.remove();
      box.textContent=iconText(options,title);
    },{once:true});
    box.append(img);
  }else{
    box.textContent=iconText(options,title);
  }
  return box;
}
function update(root,options={}){
  if(!root)return null;
  const title=pageTitle(options);
  const subtitle=pageSubtitle(options);
  const titleEl=root.querySelector(".vnv-header-title");
  const subtitleEl=root.querySelector(".vnv-header-subtitle");
  if(titleEl)titleEl.textContent=title;
  if(subtitleEl){
    subtitleEl.textContent=subtitle;
    subtitleEl.hidden=!subtitle;
  }
  const home=root.querySelector(".vnv-header-home");
  if(home)home.href=homeHref(options);
  const oldLogo=root.querySelector(".vnv-header-logo");
  oldLogo?.replaceWith(createLogo(root,title,options));
  root.dataset.vnvHeaderVersion=VERSION;
  syncTop();
  return root;
}
function mount(options={}){
  if(!document.body)return null;
  ensureStyle();
  const existing=document.getElementById(ROOT_ID);
  if(existing)return update(existing,options);

  removeLegacy(options);

  const root=document.createElement("header");
  root.id=ROOT_ID;
  root.dataset.vnvHeaderEngine="autopopulate";
  root.dataset.vnvHeaderVersion=VERSION;
  root.setAttribute("aria-label","Page identity and ecosystem menu");

  const inner=document.createElement("div");
  inner.className="vnv-header-inner";

  const home=document.createElement("a");
  home.className="vnv-header-home";
  home.href=homeHref(options);
  home.setAttribute("aria-label","Page home");

  const title=pageTitle(options);
  home.append(createLogo(root,title,options));

  const copy=document.createElement("span");
  copy.className="vnv-header-copy";
  const titleEl=document.createElement("span");
  titleEl.className="vnv-header-title";
  titleEl.textContent=title;
  const sub=document.createElement("span");
  sub.className="vnv-header-subtitle";
  const subtitle=pageSubtitle(options);
  sub.textContent=subtitle;
  sub.hidden=!subtitle;
  copy.append(titleEl,sub);
  home.append(copy);

  const button=document.createElement("button");
  button.className="vnv-header-menu-button";
  button.type="button";
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-controls",PANEL_ID);
  button.setAttribute("aria-label","Open Verve N Veda menu");
  const lines=document.createElement("span");
  lines.className="vnv-header-lines";
  lines.setAttribute("aria-hidden","true");
  button.append(lines);
  button.addEventListener("click",()=>setMenu(button.getAttribute("aria-expanded")!=="true"));

  inner.append(home,button);
  root.append(inner);

  const anchor=document.getElementById("vnvTickerAutoPopulate")||document.getElementById("vnv333NetworkTicker");
  if(anchor){
    const parent=anchor.parentNode;
    let after=anchor;
    const second=document.getElementById("vnvTickerAutoPopulate");
    if(second && second.parentNode===parent)after=second;
    parent.insertBefore(root,after.nextSibling);
  }else{
    document.body.prepend(root);
  }

  buildMenu();
  syncTop();
  if(typeof ResizeObserver==="function"){
    const ro=new ResizeObserver(syncTop);
    ["vnv333NetworkTicker","vnvTickerAutoPopulate"].forEach(id=>{const el=document.getElementById(id);if(el)ro.observe(el)});
  }
  window.addEventListener("resize",syncTop,{passive:true});
  return root;
}

window.VNV_HEADER=Object.freeze({version:VERSION,mount,update});
})();