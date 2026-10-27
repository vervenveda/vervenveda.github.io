/* Verve N Veda · external ecosystem landing controls.
   No private data, no localStorage, no grades and no interference with native menus/tickers.
   Global opt-in via body[data-vnv-outer-landing="true"]. */
(()=>{
"use strict";
const BASE="https://vervenveda.com/";
const URLS=Object.freeze({
 search:BASE+"PLERASearch.github.io/",
 directory:BASE+"#directory",
 updates:BASE+"#directory",
 agi:BASE+"core/directory-agi/",
 cloud:BASE+"cloud/",
 mentor:BASE+"Khaemenes_Academy.github.io/mentor/",
 contribute:BASE+"#support",
 beta:BASE+"beta/"
});
const DOCK_ID="vnvExternalLandingDock",DIALOG_ID="vnvExternalUpdates";
function el(tag,attrs={},text){
 const node=document.createElement(tag);
 Object.entries(attrs).forEach(([name,value])=>node.setAttribute(name,value));
 if(text!==undefined)node.textContent=text;
 return node;
}
function dockLink(rail,id,label,href,symbol){
 const link=el("a",{href,"data-vnv-tool":id,"aria-label":label});
 link.append(el("span",{"class":"vnv-dock-icon","aria-hidden":"true"},symbol),el("span",{},label));
 rail.append(link);
 return link;
}
function updates(){
 let d=document.getElementById(DIALOG_ID);
 if(d)return d;
 d=el("dialog",{id:DIALOG_ID,"aria-label":"Verve N Veda ecosystem updates and resources"});
 const bar=el("div",{"class":"vnv-dialog-top"});
 bar.append(el("h2",{},"Ecosystem & Updates"));
 const dismiss=el("button",{type:"button","aria-label":"Close ecosystem updates"},"Close ✕");
 dismiss.addEventListener("click",()=>d.close());
 bar.append(dismiss);
 const description=el("p",{},"Browse the Verve N Veda public network, directory research and local-first tools. Site updates and private account records are not synchronized through this panel.");
 const nav=el("nav",{"aria-label":"Public ecosystem destinations"});
 const items=[
  ["Verve N Veda Gateway",BASE],
  ["Ecosystem Directory",URLS.directory],
  ["PLERA Search",URLS.search],
  ["Directory AGI",URLS.agi],
  ["Public Cloud Gateway",URLS.cloud],
  ["Beta Program",URLS.beta]
 ];
 items.forEach(([name,href])=>nav.append(el("a",{href},name)));
 d.append(bar,description,nav);
 d.addEventListener("click",event=>{if(event.target===d)d.close()});
 document.body.append(d);
 return d;
}
function install(){
 if(!document.body||document.body.dataset.vnvOuterLanding!=="true"||document.getElementById(DOCK_ID))return;
 const dock=el("nav",{id:DOCK_ID,"class":"vnv-external-dock","aria-label":"Verve N Veda quick utilities"});
 dockLink(dock,"search","Search",URLS.search,"S");
 const up=el("button",{type:"button","data-vnv-tool":"updates","aria-label":"Open ecosystem updates","aria-haspopup":"dialog","aria-controls":DIALOG_ID});
 up.append(el("span",{"class":"vnv-dock-icon","aria-hidden":"true"},"U"),el("span",{},"Updates"));
 up.addEventListener("click",()=>{
  const d=updates();
  if(typeof d.showModal==="function"&&!d.open)d.showModal();
  else if(!d.open)window.location.assign(URLS.directory);
 });
 dock.append(up);
 dockLink(dock,"mentor","Archaemenes",URLS.mentor,"A");
 dockLink(dock,"contribute","Contribute",URLS.contribute,"♡");
 dockLink(dock,"beta","Beta Program",URLS.beta,"β");
 document.body.append(dock);
 // The original page's ecosystem hamburger, scrolling ticker, translations,
 // separate Beta action, support functions and native application menu stay intact.
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
else install();
})();