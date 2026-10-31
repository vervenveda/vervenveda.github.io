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

const MENU_BRANCHES=Object.freeze([
  {id:"home",label:"Verve N Veda Home",desc:"Main gateway, ecosystem search, and network entry points.",categoryIds:[],special:"home"},
  {id:"academy",label:"Khaemenes Academy",desc:"Schools, courses, learning portals, assessments, and academic tools.",categoryIds:["education"]},
  {id:"professional",label:"Professional",desc:"Professional studios, practical tools, resources, and workspaces.",categoryIds:["professional"]},
  {id:"creative",label:"Creative",desc:"Art, music, studios, creative tools, galleries, and games.",categoryIds:["creative","games"]},
  {id:"communication",label:"Communication",desc:"Networks, mail, meetings, publishing, and connected communication tools.",categoryIds:["communication"],siteTitles:["333 Network"]},
  {id:"citizen",label:"Citizen Resources",desc:"Health, finance, weather, Earth, legal, veteran, research, and practical public resources.",categoryIds:["health","finance","weather","environmental","research"],siteTitles:["Firmament Law","Veterans"]},
  {id:"civic",label:"Civic and Political",desc:"Civic learning, public policy, elections, diplomacy, campaigns, and news.",categoryIds:["civic","diplomacy","news"],siteTitles:["One Nation for All","Jennifer Pearl 2028 · GitHub","Jennifer Pearl 2028 · Campaign Home"]},
  {id:"ai",label:"AI Mentors",desc:"NAIB and the ecosystem's registered mentors, guides, and AI learning companions.",categoryIds:[],siteTitles:["NAIB"],special:"mentors"}
]);
const MENU_REGISTRY=HOME+"ecosystem/master-ecosystem-directory.json";
let menuEntries=[],menuCatalog=[],menuParts=[],menuLoading=null,activeMenuBranch="",lastMenuFocus=null,previousMenuOverflow="";
const menuEsc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function menuSafeUrl(value){try{const url=new URL(value,location.href);return /^https?:$/.test(url.protocol)?url.href:""}catch{return""}}

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
    return options.actions.map(item=>({label:cleanText(item.label),href:item.href})).filter(item=>item.label&&item.href).slice(0,7);
  }
  const selectors=options.actionSelectors||["[data-khae-nav] a[href]","[data-khae-actions] a[href]",".header-links a[href]",".head-actions a[href]"];
  const out=[],seen=new Set();
  for(const selector of selectors){
    document.querySelectorAll(selector).forEach(a=>{
      const label=cleanText(a.textContent),href=a.getAttribute("href");
      if(!label||!href)return;
      const key=label+"|"+href;
      if(seen.has(key))return;
      seen.add(key);
      out.push({label,href});
    });
  }
  return out.slice(0,7);
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
#${ROOT_ID}{position:sticky;top:var(--vnv-header-top);z-index:2147480000;height:var(--vnv-header-height);box-sizing:border-box;border-bottom:1px solid rgba(18,23,19,.14);background:rgba(244,240,231,.97);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;color:#080b0f}
#${ROOT_ID} .vnv-header-inner{height:100%;display:grid;grid-template-columns:minmax(220px,1fr) auto minmax(44px,1fr);align-items:center;gap:14px;padding:0 11px}
#${ROOT_ID} .vnv-header-home{min-width:0;display:flex;align-items:center;gap:11px;color:inherit!important;text-decoration:none!important;text-align:left}
#${ROOT_ID} .vnv-header-logo{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;overflow:hidden;border:1px solid #080b0f;border-radius:7px;color:#fff;background:#080b0f;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:12px;font-weight:400;letter-spacing:.04em;line-height:1}
#${ROOT_ID} .vnv-header-logo img{width:100%;height:100%;object-fit:cover;display:block}
#${ROOT_ID} .vnv-header-copy{min-width:0;display:grid;gap:3px}
#${ROOT_ID} .vnv-header-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:15px;font-weight:400;letter-spacing:.055em;line-height:1.1}
#${ROOT_ID} .vnv-header-subtitle{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#30413d;font-size:9px;font-weight:400;letter-spacing:.05em;line-height:1.2}
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
#${PANEL_ID} .vnv-header-menu-panel{width:min(94vw,500px);text-align:left}
#${PANEL_ID} .vnv-header-menu-kicker{margin:0 0 5px;color:#91733f;font-size:10px;letter-spacing:.13em;text-transform:uppercase}
#${PANEL_ID} .vnv-header-menu-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
#${PANEL_ID} .vnv-header-menu-search{width:100%;min-height:42px;margin:14px 0;padding:0 12px;border:1px solid rgba(18,23,19,.18);border-radius:7px;background:#fff;color:#202d28;font:400 13px/1.2 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif}
#${PANEL_ID} .menu-branch-home{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
#${PANEL_ID} .menu-branch-button{min-height:88px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:11px;padding:14px;border:1px solid rgba(49,73,62,.15);border-radius:7px;color:#202d28;background:#fff;text-align:left;cursor:pointer}
#${PANEL_ID} .menu-branch-button:hover,#${PANEL_ID} .menu-branch-button:focus-visible{border-color:#b48b45;background:#f4f0e7}
#${PANEL_ID} .menu-branch-button strong{display:block;font:400 13px/1.25 Cinzel,Georgia,serif}
#${PANEL_ID} .menu-branch-button small{display:block;margin-top:5px;color:#6b756f;font-size:10px;line-height:1.4}
#${PANEL_ID} .menu-branch-arrow{color:#b48b45;font-size:20px}
#${PANEL_ID} .menu-branch-toolbar{display:flex;align-items:center;justify-content:space-between;gap:11px;padding-bottom:10px;border-bottom:1px solid rgba(49,73,62,.14)}
#${PANEL_ID} .menu-branch-back{min-height:34px;padding:7px 10px;border:1px solid rgba(49,73,62,.2);border-radius:7px;background:#fff;color:#243a32;cursor:pointer}
#${PANEL_ID} .menu-branch-title{font:400 13px/1.2 Cinzel,Georgia,serif}
#${PANEL_ID} .menu-subgroup-title,#${PANEL_ID} .menu-group{margin:15px 0 7px;color:#92743f;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
#${PANEL_ID} .menu-list{display:grid;gap:6px}
#${PANEL_ID} .menu-link{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid rgba(49,73,62,.12);border-radius:7px;color:#25362f!important;background:#fff;text-decoration:none!important}
#${PANEL_ID} .menu-link:hover,#${PANEL_ID} .menu-link:focus-visible{border-color:rgba(145,115,63,.46);background:#fffefb}
#${PANEL_ID} .menu-link i{width:28px;height:28px;display:grid;place-items:center;border-radius:7px;background:#f4f0e7;color:#6f5935;font:400 9px/1 Cinzel,Georgia,serif;font-style:normal}
#${PANEL_ID} .menu-link strong{display:block;font-size:12px;font-weight:400;line-height:1.3}
#${PANEL_ID} .menu-link small{display:block;margin-top:2px;color:#7b837f;font-size:9px;line-height:1.35}
@media(max-width:1120px){#${ROOT_ID} .vnv-header-actions a:nth-child(n+5){display:none}}\n@media(max-width:860px){#${ROOT_ID} .vnv-header-inner{grid-template-columns:minmax(0,1fr) 44px}#${ROOT_ID} .vnv-header-actions{display:none}}\n@media(max-width:560px){#${PANEL_ID} .menu-branch-home{grid-template-columns:1fr}:root{--vnv-header-height:64px}#${ROOT_ID} .vnv-header-inner{grid-template-columns:minmax(0,1fr) 40px;padding:0 7px}#${ROOT_ID} .vnv-header-logo{width:38px;height:38px;flex-basis:38px}#${ROOT_ID} .vnv-header-title{font-size:13px}#${ROOT_ID} .vnv-header-subtitle{font-size:8px}}
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
function loadMenuData(){
  if(menuLoading)return menuLoading;
  menuLoading=(async()=>{
    try{
      const response=await fetch(MENU_REGISTRY,{cache:"no-store"});
      if(!response.ok)throw new Error("registry "+response.status);
      const data=await response.json();
      menuEntries=(data.entries||[]).filter(item=>item&&item.directoryVisible===true&&item.status==="active"&&item.access==="free-public"&&menuSafeUrl(item.url)).map(item=>({...item,url:menuSafeUrl(item.url)}));
      menuParts=Array.isArray(data?.pageCatalog?.parts)?data.pageCatalog.parts.map(part=>new URL(part,HOME).href):[];
    }catch{
      menuEntries=[
        {title:"Khaemenes Academy",url:HOME+"Khaemenes_Academy.github.io/",category:"education",type:"gateway"},
        {title:"PLERA Search",url:"https://vervenveda.github.io/PLERASearch.github.io/",category:"research",type:"gateway"},
        {title:"The Verifier",url:"https://vervenveda.github.io/theverifier.github.io/",category:"news",type:"gateway"},
        {title:"Bazaar Art",url:"https://vervenveda.github.io/bazaarart.github.io/",category:"creative",type:"gateway"},
        {title:"333 Network",url:"https://vervenveda.github.io/333.github.io/",category:"communication",type:"network"}
      ];
    }
    if(menuParts.length){
      const settled=await Promise.allSettled(menuParts.map(async part=>{
        const response=await fetch(part,{cache:"no-store"});
        if(!response.ok)throw new Error("HTTP "+response.status);
        const data=await response.json();
        return Array.isArray(data?.pages)?data.pages:[];
      }));
      const seen=new Set();
      menuCatalog=settled.filter(result=>result.status==="fulfilled").flatMap(result=>result.value).filter(page=>{
        const url=menuSafeUrl(page?.url);
        const key=String(page?.repo||"")+"|"+String(page?.path||"");
        if(!url||seen.has(key))return false;
        seen.add(key);page.url=url;return true;
      });
    }
  })();
  return menuLoading;
}
function menuLinkHtml(item){
  return '<a class="menu-link" href="'+menuEsc(item.url)+'"><i aria-hidden="true">'+menuEsc(item.icon||initials(item.title))+'</i><span><strong>'+menuEsc(item.title)+'</strong><small>'+menuEsc(item.desc||item.description||item.type||"Verve N Veda ecosystem destination.")+'</small></span><span aria-hidden="true">→</span></a>';
}
function branchDirectoryItems(branch){
  const sections=[],seen=new Set();
  const add=(title,items)=>{
    const unique=items.filter(item=>{
      const url=menuSafeUrl(item.url);
      if(!url||seen.has(url))return false;
      seen.add(url);item.url=url;return true;
    });
    if(unique.length)sections.push({title,items:unique});
  };
  if(branch.special==="home"){
    add("Main Gateways",[
      {title:"Verve N Veda Home",url:HOME,icon:"V",desc:"Return to the main Verve N Veda public gateway."},
      {title:"Explore the Ecosystem",url:HOME+"#directory",icon:"◎",desc:"Open the complete public ecosystem directory."},
      {title:"PLERA Search",url:"https://vervenveda.github.io/PLERASearch.github.io/",icon:"⌕",desc:"Search connected public learning and resource destinations."},
      {title:"333 Network",url:"https://vervenveda.github.io/333.github.io/",icon:"333",desc:"Open the Verve N Veda communication and network gateway."}
    ]);
    return sections;
  }
  for(const categoryId of branch.categoryIds||[]){
    add(categoryId.replace(/(^|[-_ ])\w/g,m=>m.toUpperCase()),menuEntries.filter(item=>item.category===categoryId).map(item=>({...item,icon:initials(item.title)})));
  }
  if(branch.siteTitles?.length)add("Gateways",menuEntries.filter(item=>branch.siteTitles.includes(item.title)).map(item=>({...item,icon:initials(item.title)})));
  if(branch.special==="mentors"){
    add("Mentors & Guides",menuEntries.filter(item=>/(mentor|guide|naib|ai companion|assistant)/i.test([item.title,item.description,item.type].join(" "))).map(item=>({...item,icon:initials(item.title)})));
  }
  return sections;
}
function renderMenuRoot(){
  activeMenuBranch="";
  const content=document.querySelector("#"+PANEL_ID+" [data-vnv-menu-content]");
  if(!content)return;
  content.innerHTML='<div class="menu-branch-home" aria-label="Verve N Veda main menu folders">'+MENU_BRANCHES.map(branch=>
    '<button class="menu-branch-button" type="button" data-menu-branch="'+menuEsc(branch.id)+'" aria-label="Open '+menuEsc(branch.label)+' folder"><span><strong>'+menuEsc(branch.label)+'</strong><small>'+menuEsc(branch.desc)+'</small></span><span class="menu-branch-arrow" aria-hidden="true">›</span></button>'
  ).join("")+'</div>';
}
function renderMenuBranch(branchId){
  const branch=MENU_BRANCHES.find(item=>item.id===branchId);
  if(!branch)return renderMenuRoot();
  activeMenuBranch=branch.id;
  const content=document.querySelector("#"+PANEL_ID+" [data-vnv-menu-content]");
  if(!content)return;
  const sections=branchDirectoryItems(branch);
  content.innerHTML='<div class="menu-branch-toolbar"><button class="menu-branch-back" type="button" data-menu-home>← Main folders</button><div class="menu-branch-title">'+menuEsc(branch.label)+'</div></div>'+
    (sections.length?sections.map(section=>'<section><div class="menu-subgroup-title">'+menuEsc(section.title)+'</div><div class="menu-list">'+section.items.map(menuLinkHtml).join("")+'</div></section>').join(""):'<p role="status">This branch is ready for registered destinations.</p>');
}
function renderMenuSearch(query){
  const term=cleanText(query).toLowerCase();
  if(!term){if(activeMenuBranch)renderMenuBranch(activeMenuBranch);else renderMenuRoot();return}
  const content=document.querySelector("#"+PANEL_ID+" [data-vnv-menu-content]");
  if(!content)return;
  const gateways=menuEntries.filter(item=>[item.title,item.category,item.type,item.description].join(" ").toLowerCase().includes(term));
  const pages=term.length>=2?menuCatalog.filter(page=>[page.title,page.category,page.repo,page.path,page.source].join(" ").toLowerCase().includes(term)).slice(0,80):[];
  content.innerHTML='<div class="menu-branch-toolbar"><button class="menu-branch-back" type="button" data-menu-home>← Main folders</button><div class="menu-branch-title">Search</div></div>'+
    (gateways.length?'<section><div class="menu-group">Gateway Matches</div><div class="menu-list">'+gateways.map(item=>menuLinkHtml({...item,icon:initials(item.title)})).join("")+'</div></section>':"")+
    (pages.length?'<section><div class="menu-group">Complete Page Index · '+pages.length+' shown</div><div class="menu-list">'+pages.map(page=>menuLinkHtml({title:page.title||page.path,url:page.url,icon:"↗",desc:(page.source||page.repo)+" · "+page.path})).join("")+'</div></section>':"")+
    (!gateways.length&&!pages.length?'<p role="status">No public ecosystem page matches this search.</p>':"");
}
function buildMenu(){
  let overlay=document.getElementById(PANEL_ID);
  if(overlay)return overlay;
  overlay=document.createElement("div");
  overlay.id=PANEL_ID;
  overlay.dataset.open="false";
  overlay.setAttribute("aria-hidden","true");
  overlay.innerHTML='<aside class="vnv-header-menu-panel" role="dialog" aria-modal="true" aria-label="Verve N Veda menu"><div class="vnv-header-menu-top"><div><p class="vnv-header-menu-kicker">One Connected Public Campus</p><strong>Verve N Veda</strong></div><button class="vnv-header-menu-close" type="button" aria-label="Close menu">×</button></div><label class="vnv-header-menu-label" for="vnvHeaderMenuSearch">Search ecosystem</label><input class="vnv-header-menu-search" id="vnvHeaderMenuSearch" type="search" autocomplete="off" placeholder="Search the complete ecosystem…"><div data-vnv-menu-content></div></aside>';
  document.body.append(overlay);
  overlay.querySelector(".vnv-header-menu-close")?.addEventListener("click",()=>setMenu(false));
  overlay.addEventListener("click",event=>{if(event.target===overlay)setMenu(false)});
  overlay.querySelector("[data-vnv-menu-content]")?.addEventListener("click",event=>{
    const branch=event.target.closest("[data-menu-branch]");
    if(branch){renderMenuBranch(branch.dataset.menuBranch);return}
    if(event.target.closest("[data-menu-home]")){
      activeMenuBranch="";
      const search=overlay.querySelector(".vnv-header-menu-search");
      if(search)search.value="";
      renderMenuRoot();
    }
  });
  overlay.querySelector(".vnv-header-menu-search")?.addEventListener("input",event=>{activeMenuBranch="";renderMenuSearch(event.target.value)});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&overlay.dataset.open==="true")setMenu(false)});
  renderMenuRoot();
  loadMenuData().then(()=>{if(overlay.dataset.open==="true")renderMenuSearch(overlay.querySelector(".vnv-header-menu-search")?.value||"")});
  return overlay;
}
function setMenu(open){
  const overlay=buildMenu();
  const button=document.querySelector("#"+ROOT_ID+" .vnv-header-menu-button");
  if(open){
    lastMenuFocus=document.activeElement;
    previousMenuOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    activeMenuBranch="";
    const search=overlay.querySelector(".vnv-header-menu-search");
    if(search)search.value="";
    renderMenuRoot();
  }else{
    document.body.style.overflow=previousMenuOverflow;
  }
  overlay.dataset.open=String(open);
  overlay.setAttribute("aria-hidden",String(!open));
  button?.setAttribute("aria-expanded",String(open));
  if(open)setTimeout(()=>overlay.querySelector(".vnv-header-menu-search")?.focus(),0);
  else lastMenuFocus?.focus?.();
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

  const actions=captureActions(options);\n\n  removeLegacy(options);

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

  const actionNav=createActions(actions);\n\n  const button=document.createElement("button");
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