/* Verve N Veda · Header AutoPopulate · canonical idempotent header engine · v2.0.0
   Purpose: one simple page-identity header per migrated public page.
   Ticker systems remain separate: this file never mounts, removes, or styles tickers. */
(()=>{"use strict";
if(window.VNV_HEADER?.mount)return;

const VERSION="2.0.0";
const ROOT_ID="vnvHeaderAutoPopulate";
const STYLE_ID="vnvHeaderAutoPopulateStyles";
const PANEL_ID="vnvHeaderMenu";
const HOME="https://vervenveda.com/";

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
  const legacy=cleanText(
    document.querySelector("[data-khae-brand-sub]")?.textContent ||
    document.querySelector(".page-subtitle,.hero-subtitle,.brand-sub,.brand-copy small")?.textContent
  );
  if(legacy)return legacy.slice(0,90);
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
  const legacyImg=document.querySelector("[data-khae-brand-mark] img,.brand-mark img,.seal img,.logo img,header img[src]");
  const legacySrc=cleanText(legacyImg?.currentSrc||legacyImg?.src);
  if(legacySrc)return legacySrc;
  const icon=document.querySelector('link[rel="apple-touch-icon"][href],link[rel~="icon"][href]');
  return cleanText(icon?.href);
}
function iconText(options={},title=""){
  const explicit=cleanText(options.icon||document.body?.dataset.vnvHeaderIcon);
  if(explicit)return explicit;
  const legacy=cleanText(
    document.querySelector("[data-khae-brand-mark]")?.textContent ||
    document.querySelector(".brand-mark,.seal")?.textContent
  );
  if(legacy && legacy.length<=5)return legacy;
  return initials(title);
}
function homeHref(options={}){
  return cleanText(options.home||document.body?.dataset.vnvHeaderHome)||location.href;
}
function captureActions(options={}){
  if(Array.isArray(options.actions)){
    return options.actions.map(item=>({label:cleanText(item.label),href:item.href})).filter(item=>item.label&&item.href).slice(0,5);
  }
  const selectors=options.actionSelectors||["[data-khae-nav] a[href]","[data-khae-actions] a[href]",".header-links a[href]",".head-actions a[href]"];
  const out=[],seen=new Set();
  for(const selector of selectors){
    document.querySelectorAll(selector).forEach(a=>{
      const label=cleanText(a.textContent),href=a.getAttribute("href");
      if(!label||!href)return;
      const key=label+"|"+href;
      if(seen.has(key))return;
      seen.add(key);out.push({label,href});
    });
  }
  return out.slice(0,5);
}
function createActions(actions){
  const nav=document.createElement("nav");
  nav.className="vnv-header-actions";
  nav.setAttribute("aria-label","Page shortcuts");
  for(const item of actions){
    const a=document.createElement("a");
    a.href=item.href;
    a.textContent=item.label;
    nav.append(a);
  }
  return nav;
}
function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement("style");
  s.id=STYLE_ID;
  s.textContent=`
:root{--vnv-header-height:66px;--vnv-header-top:0px}
#${ROOT_ID}{position:sticky;top:var(--vnv-header-top);z-index:2147480000;min-height:var(--vnv-header-height);height:auto;box-sizing:border-box;border-bottom:1px solid rgba(18,23,19,.14);background:rgba(244,240,231,.97);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;color:#080b0f}
#${ROOT_ID} .vnv-header-inner{min-height:var(--vnv-header-height);height:auto;display:grid;grid-template-columns:minmax(220px,1fr) auto minmax(44px,1fr);align-items:center;gap:14px;padding:0 11px}
#${ROOT_ID} .vnv-header-home{min-width:0;width:max-content;max-width:100%;display:flex;align-items:center;gap:11px;color:inherit!important;text-decoration:none!important;text-align:left}
#${ROOT_ID} .vnv-header-logo{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;overflow:hidden;border:1px solid #080b0f;border-radius:7px;color:#fff;background:#080b0f;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:12px;font-weight:400;letter-spacing:.04em;line-height:1}
#${ROOT_ID} .vnv-header-logo img{width:100%;height:100%;object-fit:cover;display:block}
#${ROOT_ID} .vnv-header-copy{min-width:0;max-width:min(42vw,520px);display:grid;gap:3px;align-content:center}
#${ROOT_ID} .vnv-header-title{min-width:0;max-width:100%;overflow:visible;text-overflow:clip;white-space:normal;overflow-wrap:anywhere;word-break:normal;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:clamp(11px,1.15vw,15px);font-weight:400;letter-spacing:clamp(.025em,.06vw,.055em);line-height:1.08}
#${ROOT_ID} .vnv-header-subtitle{min-width:0;max-width:100%;overflow:visible;text-overflow:clip;white-space:normal;overflow-wrap:anywhere;color:#30413d;font-size:clamp(8px,.72vw,9px);font-weight:400;letter-spacing:.045em;line-height:1.15}
#${ROOT_ID} .vnv-header-actions{min-width:0;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
#${ROOT_ID} .vnv-header-actions a{min-height:38px;display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border:1px solid rgba(18,23,19,.16);border-radius:7px;color:#30413d!important;background:rgba(255,255,255,.5);text-decoration:none!important;font-size:9px;font-weight:400;letter-spacing:.055em;text-transform:uppercase;white-space:nowrap}
#${ROOT_ID} .vnv-header-actions a:hover,#${ROOT_ID} .vnv-header-actions a:focus-visible{color:#080b0f!important;background:#fff;border-color:#b48b45}
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
@media(max-width:860px){#${ROOT_ID} .vnv-header-inner{grid-template-columns:minmax(0,1fr) 44px}#${ROOT_ID} .vnv-header-actions{display:none}}
@media(max-width:560px){:root{--vnv-header-height:64px}#${ROOT_ID} .vnv-header-inner{grid-template-columns:minmax(0,1fr) 40px;padding:0 7px}#${ROOT_ID} .vnv-header-logo{width:38px;height:38px;flex-basis:38px}#${ROOT_ID} .vnv-header-title{font-size:13px}#${ROOT_ID} .vnv-header-subtitle{font-size:8px}}
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
function legacyCandidates(options={}){
  if(Array.isArray(options.legacySelectors))return options.legacySelectors;
  return [
    "[data-vnv-header-legacy]",
    "header.site-header",
    "header[data-khae-header]",
    "body > header:first-of-type"
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

  const actions=captureActions(options);

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

  const actionNav=createActions(actions);

  const button=document.createElement("button");
  button.className="vnv-header-menu-button";
  button.type="button";
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-controls","vnvEnrichedMenuOverlay");
  button.setAttribute("aria-label","Open Verve N Veda menu");
  const lines=document.createElement("span");
  lines.className="vnv-header-lines";
  lines.setAttribute("aria-hidden","true");
  button.append(lines);
  button.dataset.vnvEnrichedTrigger="true";
  button.addEventListener("click",()=>window.VNV_ENRICHED_MENU?.open());

  inner.append(home,actionNav,button);
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

  window.VNV_ENRICHED_MENU?.mount({noButton:true});
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

/* Verve N Veda · Enriched Branched Ecosystem Menu · canonical shared menu · v1.0.0
   One menu authority for migrated headers. Folder-first, registry-backed, searchable. */
(()=>{"use strict";
if(window.VNV_ENRICHED_MENU?.mount)return;

const VERSION="1.0.0";
const IDS=Object.freeze({
  button:"vnvEnrichedMenuButton",
  overlay:"vnvEnrichedMenuOverlay",
  drawer:"vnvEnrichedMenuDrawer",
  search:"vnvEnrichedMenuSearch",
  content:"vnvEnrichedMenuContent",
  style:"vnvEnrichedMenuStyles"
});
const HOME="https://vervenveda.com/";
const REGISTRY=HOME+"ecosystem/master-ecosystem-directory.json";
const CATALOG_FALLBACK=[
  HOME+"registry/ecosystem-pages-2026-10-14-a.json",
  HOME+"registry/ecosystem-pages-2026-10-14-b.json",
  HOME+"registry/ecosystem-pages-2026-10-14-c.json",
  HOME+"registry/ecosystem-pages-2026-10-14-d.json",
  HOME+"registry/ecosystem-pages-2026-10-14-e.json",
  HOME+"registry/ecosystem-pages-2026-10-14-f.json",
  HOME+"registry/ecosystem-pages-2026-10-14-g.json"
];
const BRANCHES=Object.freeze([
 {id:"home",label:"Verve N Veda Home",desc:"Main gateway, ecosystem search, and network entry points.",special:"home"},
 {id:"academy",label:"Khaemenes Academy",desc:"Schools, courses, learning portals, assessments, and academic tools.",categories:["education"]},
 {id:"professional",label:"Professional",desc:"Professional studios, practical tools, resources, and workspaces.",categories:["professional"]},
 {id:"creative",label:"Creative",desc:"Art, music, studios, creative tools, galleries, and games.",categories:["creative","games"]},
 {id:"communication",label:"Communication",desc:"Networks, mail, meetings, publishing, and connected communication tools.",categories:["communication"],titles:["333 Network"]},
 {id:"citizen",label:"Citizen Resources",desc:"Health, finance, weather, Earth, legal, veteran, research, and practical public resources.",categories:["health","finance","weather","environmental","research"],titles:["Firmament Law","Veterans"]},
 {id:"civic",label:"Civic and Political",desc:"Civic learning, public policy, elections, diplomacy, campaigns, and news.",categories:["civic","diplomacy","news"],titles:["One Nation for All","Jennifer Pearl 2028 · GitHub","Jennifer Pearl 2028 · Campaign Home"]},
 {id:"ai",label:"AI Mentors",desc:"NAIB and the ecosystem's registered mentors, guides, and AI learning companions.",special:"mentors",titles:["NAIB"]}
]);

const ACADEMY_REPOSITORIES=Object.freeze([
 {id:"preschool",label:"PreK / Crèche",desc:"Preschool, Crèche, early learning, family and teacher resources.",root:"https://vervenveda.com/Khaemenes_Preschool.github.io/",patterns:["khaemenes_preschool.github.io","khaemenes preschool","crèche","creche"]},
 {id:"kindergarten",label:"Kindergarten",desc:"Kindergarten profile, lessons, curriculum, games and family tools.",root:"https://vervenveda.com/Khaemenes_KinderGarden.github.io/",patterns:["khaemenes_kindergarden.github.io","khaemenes kinder garden","kindergarten"]},
 {id:"elementary",label:"Elementary",desc:"Grades 1–5 learning, student profile, curriculum and resources.",root:"https://vervenveda.com/Khaemenes_Elementary.github.io/",patterns:["khaemenes_elementary.github.io","khaemenes elementary"]},
 {id:"middle",label:"Middle School",desc:"Grades 6–8 pathways, lessons, basecamp and resources.",root:"https://vervenveda.com/Khaemenes_Middle.github.io/",patterns:["khaemenes_middle.github.io","middle school"]},
 {id:"high",label:"High School",desc:"High-school portals, departments, courses, profiles and resources.",root:"https://vervenveda.com/Khaemenes_High.github.io/",patterns:["khaemenes_high.github.io","high school"]},
 {id:"higher",label:"Higher Learning",desc:"Collegiate, advanced, research, career and university pathways.",root:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/",patterns:["khaemenes_higher_learning.github.io","higher learning"]},
 {id:"linguistics",label:"Linguistics",desc:"Languages, halls, courses, readers and linguistic tools.",root:"https://vervenveda.com/Khaemenes_Linguistics.github.io/",patterns:["khaemenes_linguistics.github.io","linguistics"]},
 {id:"life-skills",label:"Life Skills",desc:"Practical independence, wellness, health and daily-life learning.",root:"https://vervenveda.com/Khaemenes_Academy_Life_Skills.github.io/",patterns:["khaemenes_academy_life_skills.github.io","life skills"]},
 {id:"proresources",label:"ProReSources / Tools",desc:"Professional and practical tools available across the Academy ecosystem.",root:"https://vervenveda.github.io/proresource_hub.github.io/ProReSources_updated_index.html",patterns:["proresource_hub.github.io","proresources"]},
 {id:"arcade",label:"Arcade / Games",desc:"Learning games, practice environments and playful study tools.",root:"https://vervenveda.github.io/arcade.github.io/",patterns:["arcade.github.io","arcade"]}
]);
const ACADEMY_FOLDERS=Object.freeze([
 {id:"profile",label:"Profile",desc:"Student profiles, accounts, dashboards and learner identity.",match:/profile|account|dashboard|learner|student[-_ ]?portal/i},
 {id:"lessons",label:"Lessons",desc:"Lessons, units, weeks, curriculum and daily learning.",match:/lesson|week|unit|curriculum|daily|roadmap/i},
 {id:"courses",label:"Courses",desc:"Courses, subjects, departments, halls and academic pathways.",match:/course|subject|department|hall|class|101|102|201|202/i},
 {id:"games",label:"Games",desc:"Games, play, practice and interactive learning.",match:/game|play|arcade|practice|lab/i},
 {id:"family",label:"Family / Parent",desc:"Family portals, parent resources, enrollment and evidence.",match:/family|parent|enroll|guardian|homeschool|transcript|diploma/i},
 {id:"teacher",label:"Teacher",desc:"Teacher tools, administration, rubrics and instructional resources.",match:/teacher|admin|rubric|instructor|faculty/i},
 {id:"resources",label:"Resources",desc:"Libraries, readers, reference tools, support and general resources.",match:/resource|library|reader|reading|reference|support|tool|guide|directory|search/i}
]);
let academyRepositoryId="";
let academyFolderId="";
let entries=[],catalog=[],catalogParts=[],activeBranch="",lastFocus=null,previousOverflow="";
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function safeUrl(value){try{const u=new URL(value,location.href);return /^https?:$/.test(u.protocol)?u.href:""}catch{return""}}
function initials(title){const w=String(title||"").replace(/[^A-Za-z0-9 ]+/g," ").trim().split(/\s+/).filter(Boolean);return !w.length?"V":w.length===1?w[0].slice(0,3).toUpperCase():w.slice(0,3).map(x=>x[0]).join("").toUpperCase()}

function installStyle(){
 if(document.getElementById(IDS.style))return;
 const s=document.createElement("style");s.id=IDS.style;s.textContent=`
#${IDS.button}{width:44px;height:44px;min-height:44px;display:grid;place-items:center;padding:0;border:1px solid rgba(18,23,19,.25);border-radius:7px;color:#080b0f;background:transparent;cursor:pointer}
#${IDS.button}:hover,#${IDS.button}:focus-visible{background:#fff}
#${IDS.button} .vnv-menu-lines,#${IDS.button} .vnv-menu-lines::before,#${IDS.button} .vnv-menu-lines::after{content:"";display:block;width:14px;height:1.5px;border-radius:7px;background:currentColor}
#${IDS.button} .vnv-menu-lines{position:relative}
#${IDS.button} .vnv-menu-lines::before,#${IDS.button} .vnv-menu-lines::after{position:absolute;left:0}
#${IDS.button} .vnv-menu-lines::before{top:-6px}#${IDS.button} .vnv-menu-lines::after{top:6px}
#${IDS.overlay}{position:fixed;inset:0;z-index:2147483500;display:none;justify-items:end;background:rgba(9,15,13,.42);backdrop-filter:blur(4px)}
#${IDS.overlay}[data-open="true"]{display:grid}
#${IDS.drawer}{width:min(94vw,500px);height:100%;overflow:auto;box-sizing:border-box;padding:22px;color:#202d28;background:#fbf8ef;border-left:1px solid rgba(49,73,62,.18);box-shadow:-20px 0 54px rgba(20,30,25,.18);text-align:left}
#${IDS.drawer} .vnv-menu-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
#${IDS.drawer} .vnv-menu-kicker{margin:0 0 5px;color:#91733f;font:400 10px/1.2 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}
#${IDS.drawer} h2{margin:0;color:#233b32;font:400 29px/1.05 Cinzel,Georgia,serif}
#${IDS.drawer} .vnv-menu-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#243a32;font-size:21px;cursor:pointer}
#${IDS.search}{width:100%;min-height:42px;margin:17px 0 14px;padding:0 12px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#202d28;font:400 13px/1.2 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif}
#${IDS.content}{display:grid;gap:14px}
.vnv-menu-branch-home{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.vnv-menu-branch-button{min-height:88px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:11px;padding:14px;border:1px solid rgba(49,73,62,.15);border-radius:7px;color:#202d28;background:#fff;text-align:left;cursor:pointer}
.vnv-menu-branch-button:hover,.vnv-menu-branch-button:focus-visible{border-color:#b48b45;background:#f4f0e7}
.vnv-menu-branch-button strong{display:block;font:400 13px/1.25 Cinzel,Georgia,serif;letter-spacing:.035em}
.vnv-menu-branch-button small{display:block;margin-top:5px;color:#6b756f;font:400 10px/1.4 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif}
.vnv-menu-arrow{color:#b48b45;font-size:20px}
.vnv-menu-toolbar{display:flex;align-items:center;justify-content:space-between;gap:11px;padding-bottom:10px;border-bottom:1px solid rgba(49,73,62,.14)}
.vnv-menu-back{min-height:34px;padding:7px 10px;border:1px solid rgba(49,73,62,.2);border-radius:7px;background:#fff;color:#243a32;cursor:pointer}
.vnv-menu-title{font:400 13px/1.2 Cinzel,Georgia,serif}
.vnv-menu-subgroup-title{margin:15px 0 7px;color:#92743f;font:400 10px/1.2 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
.vnv-menu-list{display:grid;gap:6px}
.vnv-menu-link{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid rgba(49,73,62,.12);border-radius:7px;color:#25362f;background:#fff;text-decoration:none}
.vnv-menu-link:hover,.vnv-menu-link:focus-visible{border-color:rgba(145,115,63,.46);background:#fffefb}
.vnv-menu-link i{width:28px;height:28px;display:grid;place-items:center;border-radius:7px;background:#f4f0e7;color:#6f5935;font:400 9px/1 Cinzel,Georgia,serif;font-style:normal}
.vnv-menu-link strong{display:block;font:400 12px/1.3 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif}
.vnv-menu-link small{display:block;margin-top:2px;color:#7b837f;font:400 9px/1.35 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif}
@media(max-width:560px){#${IDS.button}{width:40px;height:40px;min-height:40px}.vnv-menu-branch-home{grid-template-columns:1fr}.vnv-menu-branch-button{min-height:72px}#${IDS.drawer}{padding:18px 14px}}
@media print{#${IDS.button},#${IDS.overlay}{display:none!important}}
`;document.head.append(s);
}
function linkHtml(item){return `<a class="vnv-menu-link" href="${esc(item.url)}"><i aria-hidden="true">${esc(item.icon||initials(item.title))}</i><span><strong>${esc(item.title)}</strong><small>${esc(item.desc||item.type||"Verve N Veda ecosystem destination.")}</small></span><span class="vnv-menu-arrow" aria-hidden="true">→</span></a>`}
function renderRoot(){
 activeBranch="";
 const box=document.getElementById(IDS.content);if(!box)return;
 box.innerHTML=`<div class="vnv-menu-branch-home" aria-label="Verve N Veda main menu folders">${BRANCHES.map(b=>`<button class="vnv-menu-branch-button" type="button" data-vnv-branch="${b.id}"><span><strong>${esc(b.label)}</strong><small>${esc(b.desc)}</small></span><span class="vnv-menu-arrow">›</span></button>`).join("")}</div>`;
}
function academyHaystack(item){
 return [item?.title,item?.repo,item?.path,item?.source,item?.url,item?.description,item?.type].join(" ").toLowerCase();
}
function academyRepositoryFor(item){
 const haystack=academyHaystack(item);
 return ACADEMY_REPOSITORIES.find(repo=>repo.patterns.some(pattern=>haystack.includes(pattern)))||null;
}
function academyPages(repoId){
 return catalog.filter(page=>academyRepositoryFor(page)?.id===repoId);
}
function academyGateway(repo){
 return {title:"Open "+repo.label,url:repo.root,icon:initials(repo.label),desc:"Open the main "+repo.label+" landing page."};
}
function academyFolderPages(repoId,folderId){
 const folder=ACADEMY_FOLDERS.find(item=>item.id===folderId);
 if(!folder)return[];
 const pages=academyPages(repoId);
 return pages.filter(page=>folder.match.test([page.title,page.path,page.source].join(" ")));
}
function renderAcademyRoot(){
 activeBranch="academy";academyRepositoryId="";academyFolderId="";
 const box=document.getElementById(IDS.content);if(!box)return;
 box.innerHTML='<div class="vnv-menu-toolbar"><button class="vnv-menu-back" type="button" data-vnv-home>← Main folders</button><div class="vnv-menu-title">Khaemenes Academy</div></div>'+
 '<div class="menu-subgroup-title">Academy Repositories</div><div class="vnv-menu-branch-home">'+
 ACADEMY_REPOSITORIES.map(repo=>'<button class="vnv-menu-branch-button" type="button" data-academy-repo="'+esc(repo.id)+'"><span><strong>'+esc(repo.label)+'</strong><small>'+esc(repo.desc)+'</small></span><span class="vnv-menu-arrow">›</span></button>').join("")+
 '</div>';
}
function renderAcademyRepository(repoId){
 const repo=ACADEMY_REPOSITORIES.find(item=>item.id===repoId);if(!repo)return renderAcademyRoot();
 academyRepositoryId=repoId;academyFolderId="";
 const box=document.getElementById(IDS.content);if(!box)return;
 const pages=academyPages(repoId);
 box.innerHTML='<div class="vnv-menu-toolbar"><button class="vnv-menu-back" type="button" data-academy-root>← Academy</button><div class="vnv-menu-title">'+esc(repo.label)+'</div></div>'+
 '<div class="vnv-menu-list">'+linkHtml(academyGateway(repo))+'</div>'+
 '<div class="menu-subgroup-title">Browse '+esc(repo.label)+'</div><div class="vnv-menu-branch-home">'+
 ACADEMY_FOLDERS.map(folder=>{
   const count=academyFolderPages(repoId,folder.id).length;
   return '<button class="vnv-menu-branch-button" type="button" data-academy-folder="'+esc(folder.id)+'"><span><strong>'+esc(folder.label)+'</strong><small>'+esc(folder.desc)+(count?' · '+count+' found':'')+'</small></span><span class="vnv-menu-arrow">›</span></button>';
 }).join("")+
 '</div>';
}
function renderAcademyFolder(folderId){
 const repo=ACADEMY_REPOSITORIES.find(item=>item.id===academyRepositoryId);
 const folder=ACADEMY_FOLDERS.find(item=>item.id===folderId);
 if(!repo||!folder)return renderAcademyRoot();
 academyFolderId=folderId;
 const box=document.getElementById(IDS.content);if(!box)return;
 const pages=academyFolderPages(repo.id,folder.id);
 box.innerHTML='<div class="vnv-menu-toolbar"><button class="vnv-menu-back" type="button" data-academy-repo-back>← '+esc(repo.label)+'</button><div class="vnv-menu-title">'+esc(folder.label)+'</div></div>'+
 (pages.length?'<div class="vnv-menu-list">'+pages.slice(0,80).map(page=>linkHtml({title:page.title||page.path,url:page.url,icon:"↗",desc:(page.source||page.repo||repo.label)+" · "+(page.path||"")})).join("")+'</div>':'<p>No indexed '+esc(folder.label.toLowerCase())+' pages are registered here yet.</p>');
}
function branchSections(branch){
 if(branch.special==="home")return [{title:"Main Gateways",items:[
  {title:"Verve N Veda Home",url:HOME,icon:"V",desc:"Return to the main Verve N Veda public gateway."},
  {title:"Explore the Ecosystem",url:HOME+"#directory",icon:"◎",desc:"Open the complete public ecosystem directory."},
  {title:"PLERA Search",url:"https://vervenveda.github.io/PLERASearch.github.io/",icon:"PS",desc:"Search connected public learning and resource destinations."},
  {title:"333 Network",url:"https://vervenveda.github.io/333.github.io/",icon:"333",desc:"Open the communication and network gateway."}
 ]}];
 const seen=new Set(),sections=[];
 const add=(title,items)=>{
   const unique=items.filter(x=>{const u=safeUrl(x.url);if(!u||seen.has(u))return false;seen.add(u);x.url=u;return true});
   if(unique.length)sections.push({title,items:unique});
 };
 for(const cat of branch.categories||[]){
   const items=entries.filter(e=>e.category===cat).map(e=>({...e,desc:e.description||e.type,icon:initials(e.title)}));
   add(cat.replace(/(^|[-_ ])\w/g,m=>m.toUpperCase()),items);
 }
 if(branch.titles?.length)add("Gateways",entries.filter(e=>branch.titles.includes(e.title)).map(e=>({...e,desc:e.description||e.type,icon:initials(e.title)})));
 if(branch.special==="mentors"){
   const mentor=entries.filter(e=>/(mentor|guide|naib|assistant|companion)/i.test([e.title,e.description,e.type].join(" "))).map(e=>({...e,desc:e.description||e.type,icon:initials(e.title)}));
   add("Mentors & Guides",mentor);
 }
 return sections;
}
function renderBranch(id){
 if(id==="academy")return renderAcademyRoot();
 const branch=BRANCHES.find(b=>b.id===id);if(!branch)return renderRoot();
 activeBranch=id;const box=document.getElementById(IDS.content);if(!box)return;
 const sections=branchSections(branch);
 box.innerHTML=`<div class="vnv-menu-toolbar"><button class="vnv-menu-back" type="button" data-vnv-home>← Main folders</button><div class="vnv-menu-title">${esc(branch.label)}</div></div>${sections.map(s=>`<section><div class="vnv-menu-subgroup-title">${esc(s.title)}</div><div class="vnv-menu-list">${s.items.map(linkHtml).join("")}</div></section>`).join("")||'<p>No registered destinations in this branch yet.</p>'}`;
}
function renderSearch(query){
 const q=String(query||"").trim().toLowerCase();
 if(!q)return activeBranch?renderBranch(activeBranch):renderRoot();
 const doorway=entries.filter(e=>[e.title,e.category,e.type,e.description].join(" ").toLowerCase().includes(q));
 const pages=catalog.filter(p=>[p.title,p.category,p.repo,p.path,p.source].join(" ").toLowerCase().includes(q)).slice(0,80);
 const box=document.getElementById(IDS.content);if(!box)return;
 box.innerHTML=`<div class="vnv-menu-toolbar"><button class="vnv-menu-back" type="button" data-vnv-home>← Main folders</button><div class="vnv-menu-title">Search</div></div>
 ${doorway.length?`<section><div class="vnv-menu-subgroup-title">Gateway Matches</div><div class="vnv-menu-list">${doorway.map(e=>linkHtml({...e,desc:e.description||e.type,icon:initials(e.title)})).join("")}</div></section>`:""}
 ${pages.length?`<section><div class="vnv-menu-subgroup-title">Complete Page Index</div><div class="vnv-menu-list">${pages.map(p=>linkHtml({title:p.title||p.path,url:p.url,icon:"↗",desc:(p.source||p.repo)+" · "+p.path})).join("")}</div></section>`:""}
 ${!doorway.length&&!pages.length?'<p>No public ecosystem page matches this search.</p>':""}`;
}
async function loadData(){
 try{
  const r=await fetch(REGISTRY,{cache:"no-store"});if(!r.ok)throw 0;const d=await r.json();
  entries=(d.entries||[]).filter(e=>e.directoryVisible===true&&e.status==="active"&&e.access==="free-public"&&safeUrl(e.url)).map(e=>({...e,url:safeUrl(e.url)}));
  catalogParts=Array.isArray(d?.pageCatalog?.parts)?d.pageCatalog.parts.map(p=>new URL(p,HOME).href):CATALOG_FALLBACK;
 }catch{
  entries=[
   {title:"Khaemenes Academy",url:"https://vervenveda.com/Khaemenes_Academy.github.io/",category:"education",type:"gateway"},
   {title:"PLERA Search",url:"https://vervenveda.github.io/PLERASearch.github.io/",category:"research",type:"gateway"},
   {title:"The Verifier",url:"https://vervenveda.github.io/theverifier.github.io/",category:"news",type:"gateway"},
   {title:"Bazaar Art",url:"https://vervenveda.github.io/bazaarart.github.io/",category:"creative",type:"gateway"},
   {title:"333 Network",url:"https://vervenveda.github.io/333.github.io/",category:"communication",type:"network"}
  ];
  catalogParts=CATALOG_FALLBACK;
 }
 const settled=await Promise.allSettled(catalogParts.map(async url=>{const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw 0;const d=await r.json();return d.pages||[]}));
 const seen=new Set();
 catalog=settled.filter(x=>x.status==="fulfilled").flatMap(x=>x.value).filter(p=>{const u=safeUrl(p.url);const k=(p.repo||"")+"|"+(p.path||"");if(!u||seen.has(k))return false;seen.add(k);p.url=u;return true});
}
function mountDrawer(){
 let overlay=document.getElementById(IDS.overlay);if(overlay)return overlay;
 overlay=document.createElement("div");overlay.id=IDS.overlay;overlay.dataset.open="false";overlay.setAttribute("aria-hidden","true");
 overlay.innerHTML=`<aside id="${IDS.drawer}" role="dialog" aria-modal="true" aria-labelledby="vnvEnrichedMenuTitle"><div class="vnv-menu-top"><div><p class="vnv-menu-kicker">One Connected Public Campus</p><h2 id="vnvEnrichedMenuTitle">Verve N Veda</h2></div><button class="vnv-menu-close" type="button" aria-label="Close menu">×</button></div><label style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)" for="${IDS.search}">Search ecosystem</label><input id="${IDS.search}" type="search" autocomplete="off" placeholder="Search the complete ecosystem…"><div id="${IDS.content}"></div></aside>`;
 document.body.append(overlay);
 overlay.querySelector(".vnv-menu-close").addEventListener("click",close);
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 overlay.querySelector("#"+IDS.content).addEventListener("click",e=>{
 const branch=e.target.closest("[data-vnv-branch]");if(branch){renderBranch(branch.dataset.vnvBranch);return}
 const repo=e.target.closest("[data-academy-repo]");if(repo){renderAcademyRepository(repo.dataset.academyRepo);return}
 const folder=e.target.closest("[data-academy-folder]");if(folder){renderAcademyFolder(folder.dataset.academyFolder);return}
 if(e.target.closest("[data-academy-root]")){renderAcademyRoot();return}
 if(e.target.closest("[data-academy-repo-back]")){renderAcademyRepository(academyRepositoryId);return}
 if(e.target.closest("[data-vnv-home]")){document.getElementById(IDS.search).value="";renderRoot()}
});
 document.getElementById(IDS.search).addEventListener("input",e=>{activeBranch="";renderSearch(e.target.value)});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.dataset.open==="true")close()});
 return overlay;
}
function mountButton(options={}){
 let button=document.getElementById(IDS.button);if(button)return button;
 button=document.createElement("button");button.id=IDS.button;button.type="button";button.setAttribute("aria-expanded","false");button.setAttribute("aria-controls",IDS.overlay);button.setAttribute("aria-label","Open Verve N Veda menu");button.innerHTML='<span class="vnv-menu-lines" aria-hidden="true"></span>';
 const target=options.target?document.querySelector(options.target):document.querySelector("[data-vnv-ecosystem-slot]");
 if(target)target.replaceChildren(button);else document.body.append(button);
 button.addEventListener("click",open);return button;
}
function open(){
 const overlay=mountDrawer(),button=document.getElementById(IDS.button);lastFocus=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow="hidden";overlay.dataset.open="true";overlay.setAttribute("aria-hidden","false");button?.setAttribute("aria-expanded","true");document.querySelectorAll("[data-vnv-enriched-trigger]").forEach(el=>el.setAttribute("aria-expanded","true"));activeBranch="";document.getElementById(IDS.search).value="";renderRoot();setTimeout(()=>document.getElementById(IDS.search)?.focus(),0);
}
function close(){
 const overlay=document.getElementById(IDS.overlay),button=document.getElementById(IDS.button);if(!overlay)return;overlay.dataset.open="false";overlay.setAttribute("aria-hidden","true");button?.setAttribute("aria-expanded","false");document.querySelectorAll("[data-vnv-enriched-trigger]").forEach(el=>el.setAttribute("aria-expanded","false"));document.body.style.overflow=previousOverflow;lastFocus?.focus?.();
}
async function mount(options={}){
 if(!document.body)return null;installStyle();if(options.noButton!==true)mountButton(options);mountDrawer();renderRoot();await loadData();return document.getElementById(IDS.button)||document.querySelector("[data-vnv-enriched-trigger]");
}
window.VNV_ENRICHED_MENU=Object.freeze({version:VERSION,mount,open,close});
})();
