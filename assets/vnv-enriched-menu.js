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
 overlay.querySelector("#"+IDS.content).addEventListener("click",e=>{const b=e.target.closest("[data-vnv-branch]");if(b)renderBranch(b.dataset.vnvBranch);if(e.target.closest("[data-vnv-home]")){document.getElementById(IDS.search).value="";renderRoot()}});
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
 const overlay=mountDrawer(),button=document.getElementById(IDS.button);lastFocus=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow="hidden";overlay.dataset.open="true";overlay.setAttribute("aria-hidden","false");button?.setAttribute("aria-expanded","true");activeBranch="";document.getElementById(IDS.search).value="";renderRoot();setTimeout(()=>document.getElementById(IDS.search)?.focus(),0);
}
function close(){
 const overlay=document.getElementById(IDS.overlay),button=document.getElementById(IDS.button);if(!overlay)return;overlay.dataset.open="false";overlay.setAttribute("aria-hidden","true");button?.setAttribute("aria-expanded","false");document.body.style.overflow=previousOverflow;lastFocus?.focus?.();
}
async function mount(options={}){
 if(!document.body)return null;installStyle();mountButton(options);mountDrawer();renderRoot();await loadData();return document.getElementById(IDS.button);
}
window.VNV_ENRICHED_MENU=Object.freeze({version:VERSION,mount,open,close});
})();