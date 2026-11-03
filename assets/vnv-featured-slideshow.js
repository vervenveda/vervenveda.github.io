/* Verve N Veda · portable Featured Ecosystem Slideshow v1.0.0.
   Read-only public registry. No browser storage, admin, STOS or global navigation changes. */
(()=>{"use strict";
if(window.VNVFeaturedSlideshow)return;
const SOURCE="https://vervenveda.com/ecosystem/master-ecosystem-directory.json";
const STYLE_ID="vnv-featured-slideshow-styles";
const mounted=new WeakSet();
function style(){
 if(document.getElementById(STYLE_ID))return;
 const el=document.createElement("style");el.id=STYLE_ID;el.textContent=`
.vnv-featured{max-width:1040px;margin:38px auto;padding:0 22px;font:400 16px/1.55 "Brandon Grotesque",Nunito,Arial,sans-serif;color:#26302a}
.vnv-featured *{box-sizing:border-box}
.vnv-featured__heading{text-align:center;margin:0 0 16px}
.vnv-featured__heading p{margin:0;color:#8c6c3b;font:400 16px/1.5 Cinzel,Georgia,serif;letter-spacing:.09em;text-transform:uppercase}
.vnv-featured__heading h2{font:400 clamp(25px,3vw,33px)/1.3 Cinzel,Georgia,serif;margin:5px 0 8px;color:#202824}
.vnv-featured__slide{display:grid;grid-template-columns:minmax(165px,27%) 1fr;min-height:240px;border:1px solid #cbbd9d;border-radius:7px;overflow:hidden;background:#f7f2e8;box-shadow:0 10px 30px rgba(0,0,0,.06)}
.vnv-featured__visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:240px;background:linear-gradient(145deg,#0d1713,#27382f);color:#f8f0df;padding:22px;text-align:center}
.vnv-featured__monogram{width:83px;height:83px;border:1px solid #bc9a60;display:grid;place-items:center;font:400 34px/1 Cinzel,Georgia,serif;letter-spacing:.02em}
.vnv-featured__visual-label{font-size:16px;letter-spacing:.07em}
.vnv-featured__content{padding:25px 30px;display:flex;flex-direction:column;justify-content:center;gap:11px;text-align:left;min-width:0}
.vnv-featured__category{font:400 16px Cinzel,Georgia,serif;color:#93703c;letter-spacing:.09em;text-transform:uppercase;margin:0}
.vnv-featured__title{font:400 clamp(23px,2.6vw,32px)/1.3 Cinzel,Georgia,serif;color:#202824;margin:0;overflow-wrap:anywhere}
.vnv-featured__description{margin:0;font-size:16px;color:#3e4a44}
.vnv-featured__actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vnv-featured__actions button,.vnv-featured__actions a{font:400 16px/1.3 Nunito,Arial,sans-serif;border-radius:7px;border:1px solid #a89063;padding:10px 13px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}
.vnv-featured__actions a{background:#222c27;color:#fbf4e7}
.vnv-featured__actions button{background:#fffaf0;color:#222c27}
.vnv-featured__actions :focus-visible{outline:3px solid #b48b45;outline-offset:2px}
.vnv-featured__count{font-size:16px;color:#59665f}
.vnv-featured__preview{border:1px solid #bda77c;border-radius:7px;padding:0;width:min(94vw,1060px);height:min(89vh,820px);max-width:1060px;max-height:820px;overflow:hidden;background:#fff}
.vnv-featured__preview::backdrop{background:rgba(0,0,0,.67)}
.vnv-featured__preview-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;background:#25332b;color:#fff9ed;font-size:16px}
.vnv-featured__preview-bar a,.vnv-featured__preview-bar button{color:#fff9ed;background:#25332b;border:1px solid #d8bf8d;border-radius:7px;padding:8px 12px;font-size:16px}
.vnv-featured__preview iframe{height:calc(100% - 65px);width:100%;border:0;background:#fff}
@media(max-width:650px){.vnv-featured{padding:0 12px;margin:25px auto}.vnv-featured__slide{grid-template-columns:1fr}.vnv-featured__visual{min-height:125px}.vnv-featured__content{padding:18px}.vnv-featured__monogram{height:55px;width:55px;font-size:25px}}
@media(prefers-reduced-motion:reduce){.vnv-featured *{scroll-behavior:auto}}
`;document.head.appendChild(el);
}
const txt=(node,value)=>{node.textContent=value||""};
function mount(root){
 if(!root||mounted.has(root))return;
 mounted.add(root);style();
 const title=root.dataset.vnvFeaturedTitle||"Featured Across Verve N Veda";
 const label=root.dataset.vnvFeaturedLabel||"Public ecosystem";
 const categories=(root.dataset.vnvFeaturedCategories||"").split(",").map(s=>s.trim()).filter(Boolean);
 const keywords=(root.dataset.vnvFeaturedKeywords||"").toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);
 const limit=Math.max(1,Math.min(150,Number(root.dataset.vnvFeaturedLimit)||60));
 root.classList.add("vnv-featured");
 const heading=document.createElement("div");heading.className="vnv-featured__heading";
 const eyebrow=document.createElement("p");txt(eyebrow,label);
 const h2=document.createElement("h2");txt(h2,title);heading.append(eyebrow,h2);
 const slide=document.createElement("article");slide.className="vnv-featured__slide";slide.setAttribute("aria-label","Featured public destination");
 const visual=document.createElement("div");visual.className="vnv-featured__visual";
 const mono=document.createElement("span");mono.className="vnv-featured__monogram";mono.setAttribute("aria-hidden","true");
 const visualLabel=document.createElement("span");visualLabel.className="vnv-featured__visual-label";visual.append(mono,visualLabel);
 const content=document.createElement("div");content.className="vnv-featured__content";
 const category=document.createElement("p");category.className="vnv-featured__category";
 const featureTitle=document.createElement("h3");featureTitle.className="vnv-featured__title";
 const description=document.createElement("p");description.className="vnv-featured__description";
 const actions=document.createElement("div");actions.className="vnv-featured__actions";
 const open=document.createElement("a");open.textContent="Open Full Page";open.target="_blank";open.rel="noopener noreferrer";
 const preview=document.createElement("button");preview.type="button";preview.textContent="Preview";
 const pause=document.createElement("button");pause.type="button";pause.textContent="Pause";pause.setAttribute("aria-pressed","false");
 const counter=document.createElement("span");counter.className="vnv-featured__count";counter.setAttribute("aria-live","off");
 actions.append(open,preview,pause,counter);content.append(category,featureTitle,description,actions);slide.append(visual,content);root.append(heading,slide);
 const dialog=document.createElement("dialog");dialog.className="vnv-featured__preview";
 const bar=document.createElement("div");bar.className="vnv-featured__preview-bar";
 const previewName=document.createElement("span");
 const previewLink=document.createElement("a");previewLink.textContent="Open Full Page";previewLink.target="_blank";previewLink.rel="noopener noreferrer";
 const close=document.createElement("button");close.type="button";close.textContent="Close";
 bar.append(previewName,previewLink,close);
 const frame=document.createElement("iframe");frame.title="Featured destination preview";frame.setAttribute("sandbox","allow-scripts allow-forms allow-same-origin");frame.referrerPolicy="strict-origin-when-cross-origin";
 dialog.append(bar,frame);root.append(dialog);
 close.addEventListener("click",()=>dialog.close());dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>frame.removeAttribute("src"));
 let items=[],index=0,paused=false,timer=null;
 function render(){
  if(!items.length)return;
  const item=items[index];txt(mono,item.title.split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase());
  txt(visualLabel,(item.category||"Ecosystem").replace(/-/g," "));txt(category,item.category);
  txt(featureTitle,item.title);txt(description,item.description||"Explore this free public resource across Verve N Veda.");
  open.href=item.url;txt(counter,(index+1)+" of "+items.length);
  previewLink.href=item.url;txt(previewName,item.title);
 }
 function stop(){if(timer){clearInterval(timer);timer=null}}
 function start(){stop();if(!paused&&items.length>1&&!matchMedia("(prefers-reduced-motion: reduce)").matches)timer=setInterval(()=>{index=(index+1)%items.length;render()},8000)}
 pause.addEventListener("click",()=>{paused=!paused;pause.textContent=paused?"Resume":"Pause";pause.setAttribute("aria-pressed",String(paused));start()});
 preview.addEventListener("click",()=>{if(!items.length)return;stop();frame.src=items[index].url;try{dialog.showModal()}catch{window.open(items[index].url,"_blank","noopener")}});
 dialog.addEventListener("close",start);
 root.addEventListener("mouseenter",stop);root.addEventListener("mouseleave",start);
 root.addEventListener("focusin",stop);root.addEventListener("focusout",event=>{if(!root.contains(event.relatedTarget))start()});
 const fail=()=>{txt(featureTitle,"Verve N Veda public directory");txt(description,"The featured directory is temporarily unavailable. You can still visit the main public gateway.");txt(mono,"V");txt(visualLabel,"Public ecosystem");txt(category,"Directory");open.href="https://vervenveda.com/";preview.disabled=true;pause.disabled=true;txt(counter,"")};
 fail();
 fetch(SOURCE,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Registry unavailable");return r.json()}).then(data=>{
  if(!Array.isArray(data.entries))throw Error("Invalid registry");
  const seen=new Set();
  items=data.entries.filter(e=>{
   if(e.access!=="free-public"||e.status!=="active"||e.directoryVisible!==true||!e.title||!e.url)return false;
   if(categories.length&&!categories.includes(e.category))return false;
   const hay=(e.title+" "+(e.description||"")+" "+e.category+" "+(e.repository||"")).toLowerCase();
   if(keywords.length&&!keywords.some(k=>hay.includes(k)))return false;
   try{const u=new URL(e.url);if(u.protocol!=="https:"||!["vervenveda.com","vervenveda.github.io","artist1970.github.io"].includes(u.hostname))return false}catch{return false}
   if(seen.has(e.url))return false;seen.add(e.url);return true;
  }).slice(0,limit);
  if(!items.length){fail();return}
  render();start();
 }).catch(fail);
}
window.VNVFeaturedSlideshow=Object.freeze({version:"1.0.0",mount,mountAll:()=>document.querySelectorAll("[data-vnv-featured-slideshow]").forEach(mount)});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>window.VNVFeaturedSlideshow.mountAll(),{once:true});
else window.VNVFeaturedSlideshow.mountAll();
})();