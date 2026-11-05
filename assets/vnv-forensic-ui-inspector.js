/* VNV Forensic UI Inspector v1.0.0
 * Sovereign, opt-in, read-only page diagnostics.
 * Load from a page and activate with ?vnv_inspect=1.
 * No network calls, storage access, student-record access or automatic repairs.
 */
(()=>{"use strict";
if(window.VNV_UI_INSPECTOR||!new URLSearchParams(location.search).has("vnv_inspect"))return;
const version="1.0.0", START=performance.now();
const ids=["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","vnvEnrichedMenuOverlay"];
const names=["333 ticker","Auto ticker","VNV header","Branched menu"];
const events=[];let panel,content,status,observed=false,scheduled=false,lastReport=null;
const shifts=[];const layoutSamples=[];const STYLE_LIMIT=30;
const watchSelectors=["#vnv333NetworkTicker","#vnvTickerAutoPopulate","#vnvHeaderAutoPopulate",".grade09-local-masthead","#grade09ProfileFirst","#khaeProfileToolRail","#learningToday","#grade09BlueprintTools"];
const stableName=(n)=>{
 if(!n||n.nodeType!==1)return "unknown";
 if(n.id)return "#"+n.id;
 if(n.classList?.length)return n.tagName.toLowerCase()+"."+[...n.classList].slice(0,2).join(".");
 return n.tagName.toLowerCase();
};
function recordGeometry(stage){
 const list=[];
 for(const selector of watchSelectors){
  const node=document.querySelector(selector);
  if(!node)continue;
  const r=node.getBoundingClientRect();
  list.push({node:selector,x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)});
 }
 if(layoutSamples.length<40)layoutSamples.push({at:now(),stage,items:list});
}
if(typeof PerformanceObserver==="function"){
 try{
  const po=new PerformanceObserver(entryList=>{
   for(const entry of entryList.getEntries()){
    const sources=(entry.sources||[]).map(a=>stableName(a.node)).slice(0,6);
    const item={at:Math.round(entry.startTime)+"ms",value:Number(entry.value.toFixed(4)),recentInput:entry.hadRecentInput,sources};
    shifts.push(item);if(shifts.length>35)shifts.shift();
    if(!entry.hadRecentInput)event("LAYOUT SHIFT "+item.value+" "+sources.join(", "));
   }
   schedule();
  });
  po.observe({type:"layout-shift",buffered:true});
 }catch{}
}

const MAX=55,NO_SCAN="vnv-inspector-root";
const now=()=>Math.round(performance.now()-START)+"ms";
function event(msg){
 events.push(now()+" "+msg.slice(0,170));if(events.length>MAX)events.shift();
}
function own(el){return !el?.closest?.("#"+NO_SCAN)}
function shortPath(raw){
 try{const u=new URL(raw,location.href);return u.origin===location.origin?u.pathname+u.hash:u.hostname+u.pathname+u.hash}
 catch{return "(invalid URL)"}
}
function ancestors(el){
 const problems=[];
 for(let n=el;n&&n.nodeType===1;n=n.parentElement){
  const cs=getComputedStyle(n);
  if(n.hidden||cs.display==="none"||cs.visibility==="hidden"||Number(cs.opacity)===0)
   problems.push(n.tagName.toLowerCase()+(n.id?"#"+n.id:"")+": hidden");
  if(n.tagName==="DIALOG"&&!n.open)problems.push("closed dialog#"+(n.id||"(unnamed)"));
  if(n.getAttribute("aria-hidden")==="true")problems.push(n.tagName.toLowerCase()+": aria-hidden");
 }
 return problems;
}
function chrome(){
 return ids.map((id,i)=>{
  const el=document.getElementById(id),name=names[i];
  if(!el)return {name,state:"MISSING",parent:null,reason:[]};
  const rect=el.getBoundingClientRect(),css=getComputedStyle(el);
  const reasons=ancestors(el);
  const overlay=id==="vnvEnrichedMenuOverlay";
  const closed=overlay&&el.dataset.open!=="true";
  const visible=!closed&&!reasons.length&&rect.width>0&&rect.height>0;
  return {name,state:closed?"CLOSED (expected)":visible?"VISIBLE":"HIDDEN",
   parent:el.parentElement?.tagName.toLowerCase()||null,
   size:[Math.round(rect.width),Math.round(rect.height)],
   xy:[Math.round(rect.x),Math.round(rect.y)],
   display:css.display,
   reason:reasons};
 });
}
function contrast(el){
 const style=getComputedStyle(el);
 function rgba(input){
  const m=String(input).match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/);
  return m?[Number(m[1]),Number(m[2]),Number(m[3]),m[4]===undefined?1:Number(m[4])]:null;
 }
 const fg=rgba(style.color);
 let bg=null;
 for(let n=el;n;n=n.parentElement){
  const col=rgba(getComputedStyle(n).backgroundColor);
  if(col&&col[3]>=.98){bg=col;break}
 }
 if(!fg||!bg||fg[3]<.98)return null;
 const lum=c=>{
  const rgb=c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
 };
 const a=lum(fg),b=lum(bg);return Math.round(100*(Math.max(a,b)+.05)/(Math.min(a,b)+.05))/100;
}
function interactive(){
 const elements=[...document.querySelectorAll("a[href],button,[role=button]")].filter(own);
 const flags=[],seen=new Map();let links=0,buttons=0;
 for(const el of elements){
  const isLink=el.tagName==="A";if(isLink)links++;else buttons++;
  const label=(el.getAttribute("aria-label")||el.textContent||"").replace(/\s+/g," ").trim();
  const loc=""+(isLink?shortPath(el.href):el.tagName.toLowerCase());
  const descriptor=(label||"(unlabeled)").slice(0,55);
  const style=getComputedStyle(el);
  if(style.display==="none"||style.visibility==="hidden"||el.closest("[hidden],dialog:not([open])"))continue;
  const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;
  if(!label&&!el.getAttribute("title"))flags.push({type:"unlabeled control",where:loc});
  if(isLink){
   const href=el.getAttribute("href")||"";
   if(href==="#"||/^javascript:/i.test(href))flags.push({type:"placeholder link",where:loc,label:descriptor});
   if(href.startsWith("#")&&href.length>1){
    let exists=false;try{exists=!!document.getElementById(decodeURIComponent(href.slice(1)))}catch{}
    if(!exists)flags.push({type:"missing on-page anchor",where:href.slice(0,90),label:descriptor});
   }
   if(!href.startsWith("#")&&!/^javascript:/i.test(href)){
    const key=shortPath(el.href),list=seen.get(key)||new Set();list.add(descriptor);seen.set(key,list);
   }
  }
  if((el.tagName==="BUTTON"||el.getAttribute("role")==="button")&&!el.disabled){
   const ratio=contrast(el);
   // Heuristic only: translucent/gradient backgrounds are not measured.
   if(ratio!==null&&ratio<3)flags.push({type:"possible low contrast",where:loc,label:descriptor,ratio});
  }
 }
 const repeated=[...seen].filter(([,labels])=>labels.size>1).slice(0,20).map(([destination,labels])=>({destination,labels:[...labels].slice(0,5)}));
 return {links,buttons,flags:flags.slice(0,55),repeatedDestinations:repeated};
}
function dialogs(){
 return [...document.querySelectorAll("dialog")].filter(own).map(d=>({
  id:d.id||"(unnamed)",open:d.open,
  containsVnvChrome:ids.slice(0,3).some(id=>!!d.querySelector("#"+id))
 })).slice(0,40);
}
function inspect(){
 const components=chrome(),actions=interactive(),popup=dialogs();
 return {tool:"VNV Forensic UI Inspector",version,page:location.pathname,
  timestamp:new Date().toISOString(),chrome:components,
  controls:actions,dialogs:popup,events:events.slice(),layoutShifts:shifts.slice(),layoutSamples:layoutSamples.slice(),
  limitations:"Read-only structural scan. Cannot confirm server availability, click event wiring, or complex gradient/transparency contrast."};
}
function el(tag,label){const e=document.createElement(tag);if(label!==undefined)e.textContent=label;return e}
function render(){
 if(!panel||!panel.isConnected)return;
 lastReport=inspect();
 const c=lastReport.chrome,a=lastReport.controls;
 const summary=c.map(x=>x.name+": "+x.state+(x.parent?" · parent "+x.parent:"")+
  (x.size?" · "+x.size.join("×"):"")+
  (x.reason?.length?" · "+x.reason.join("; "):"")).join("\n");
 const issues=a.flags.map(x=>x.type+" · "+(x.label||x.where)+(x.ratio?" · ratio "+x.ratio:"")).join("\n");
 const duplicates=a.repeatedDestinations.map(x=>x.destination+" ← "+x.labels.join(" / ")).join("\n");
 const dialogsText=lastReport.dialogs.map(x=>x.id+" · "+(x.open?"open":"closed")+(x.containsVnvChrome?" · CONTAINS VNV CHROME":"")).join("\n");
 content.textContent="PAGE COMPONENTS\n"+summary+
  "\n\nBUTTONS & LINKS · "+a.buttons+" buttons / "+a.links+" links\n"+
  (issues||"No structural or obvious contrast warnings.")+
  "\n\nSHARED DESTINATIONS (inspect for loops)\n"+(duplicates||"None detected")+
  "\n\nDIALOGS\n"+(dialogsText||"None")+
  "\n\nLAYOUT SHIFTS\n"+(lastReport.layoutShifts.map(x=>x.at+" · "+x.value+" · "+x.sources.join(", ")).join("\n")||"No layout shifts detected")+
  "\n\nTIMELINE\n"+lastReport.events.slice(-22).join("\n");
 status.textContent="Read-only · "+new Date().toLocaleTimeString()+" · No academic records scanned";
}
function schedule(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;render()});
}
function record(msg){event(msg);schedule()}
function build(){
 if(panel)return;
 panel=el("aside");panel.id=NO_SCAN;panel.setAttribute("aria-label","VNV UI forensic inspector");
 panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:9px;bottom:9px;width:min(760px,calc(100vw - 18px));height:min(60vh,590px);display:flex;flex-direction:column;gap:9px;box-sizing:border-box;padding:14px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;box-shadow:0 12px 34px #0008;font:400 14px/1.45 ui-monospace,monospace!important";
 const title=el("strong","VNV · Forensic UI Inspector");title.style.cssText="font:400 20px/1.3 Cinzel,Georgia,serif;color:#fff8e9!important";
 const row=el("div");row.style.cssText="display:flex;flex-wrap:wrap;gap:8px";
 const button=(label,fn)=>{const b=el("button",label);b.type="button";b.style.cssText="min-height:38px;padding:7px 12px;border:1px solid #b48b45;border-radius:7px;background:#fff8e9!important;color:#243038!important;font:400 14px Nunito,Arial,sans-serif";b.addEventListener("click",fn);row.append(b);return b};
 button("Rescan",()=>{record("Manual rescan")});
 button("Copy report",async()=>{lastReport=inspect();try{await navigator.clipboard.writeText(JSON.stringify(lastReport,null,2));status.textContent="Report copied — no student data collected"}catch{status.textContent="Clipboard blocked; use the browser console inspector.report() instead"}});
 button("Close",()=>{observer.disconnect();panel.remove();panel=null;});
 content=el("pre");content.style.cssText="flex:1;min-height:0;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:10px;background:#152420!important;color:#fff8e9!important;font:400 13px/1.5 ui-monospace,monospace!important";
 status=el("div");status.style.cssText="color:#e8dabf!important;font:400 13px Nunito,Arial,sans-serif";
 panel.append(title,row,content,status);document.body.append(panel);
}
const observer=new MutationObserver(changes=>{
 let stylesAdded=0,removedSections=0;
 for(const m of changes)if(m.type==="childList"){
  for(const n of m.addedNodes){
   if(n.nodeType!==1||!own(n))continue;
   if(n.matches?.('style,link[rel="stylesheet"]'))stylesAdded++;
   else stylesAdded+=n.querySelectorAll?.('style,link[rel="stylesheet"]').length||0;
   if(n.matches?.('.grade09-profile-first,#grade09ProfileFirst,#khaeProfileToolRail'))event("MOUNT "+stableName(n));
  }
  for(const n of m.removedNodes)if(n.nodeType===1&&own(n)&&n.matches?.('.grade09-profile-first,#grade09ProfileFirst,#khaeProfileToolRail'))removedSections++;
 }
 if(stylesAdded)event("STYLE INSERTED count="+stylesAdded);
 if(removedSections)event("PROFILE BLOCK MOVED/REMOVED count="+removedSections);

 let altered=false;
 for(const m of changes){
  if(!own(m.target))continue;
  if(m.type==="attributes"){
   const node=m.target;
   if(ids.includes(node.id)){event("STYLE/STATE "+node.id);altered=true}
   continue;
  }
  for(const node of [...m.addedNodes,...m.removedNodes]){
   if(node.nodeType!==1||!own(node))continue;
   for(const id of ids)if(node.id===id||node.querySelector?.("#"+id)){
    event((Array.prototype.includes.call(m.removedNodes,node)?"REMOVED ":"ADDED ")+id);altered=true;
   }
  }
 }
 if(altered)schedule();
});
function start(){
 if(panel)return;build();
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden","style","class","aria-hidden","open"]});
 event("Inspector started");recordGeometry("startup");
 requestAnimationFrame(()=>recordGeometry("first frame"));
 window.addEventListener("load",()=>{recordGeometry("window load");requestAnimationFrame(()=>recordGeometry("after load"))},{once:true});
 setTimeout(()=>{recordGeometry("1.5 seconds");schedule()},1500);
 schedule();
}
window.addEventListener("error",e=>{
 if(e.target!==window&&e.target?.tagName==="SCRIPT")record("Script load failed: "+shortPath(e.target.src));
 else if(e.message)record("JS error: "+String(e.message).slice(0,145));
},true);
window.addEventListener("unhandledrejection",e=>record("Promise rejection: "+String(e.reason?.message||"unknown").slice(0,145)));
window.addEventListener("pageshow",()=>record("pageshow"));
window.addEventListener("load",()=>record("window load"),{once:true});
if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});
window.VNV_UI_INSPECTOR=Object.freeze({version,report:inspect,rescan:schedule,events:()=>events.slice()});
})();