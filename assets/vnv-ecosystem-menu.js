(() => {
  "use strict";

  const IDS = Object.freeze({
    button:"vnvEcosystemMenuButton",
    overlay:"vnvEcosystemMenuOverlay",
    drawer:"vnvEcosystemMenuDrawer",
    search:"vnvEcosystemMenuSearch",
    content:"vnvEcosystemMenuContent",
    status:"vnvEcosystemMenuStatus",
    style:"vnvEcosystemMenuStyles"
  });
  const publicHost=/^(?:www\.)?vervenveda\.com$|^vervenveda\.github\.io$/i.test(location.hostname||"");
  const PUBLIC_ROOT=publicHost ? location.origin+"/" : "https://vervenveda.com/";
  const REGISTRY=PUBLIC_ROOT+"ecosystem/master-ecosystem-directory.json";
  const HOME=PUBLIC_ROOT;
  const CATEGORY_ORDER=["education","research","news","weather","creative","professional","games","health","finance","civic","environmental","communication","gateway"];
  const CATEGORY_LABELS={
    education:"Education",research:"Research & Discovery",news:"News & Verification",
    weather:"Weather & Space",creative:"Art, Music & Creativity",professional:"Professional Tools",
    games:"Games & Play",health:"Health & Wellness",finance:"Finance",civic:"Civic & Community",
    environmental:"Earth & Environment",communication:"Communication",gateway:"Main Gateways"
  };

  if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
  if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;

  let entries=[];
  let catalogParts=[];
  let catalogPages=[];
  let catalogLoaded=false;
  let catalogLoading=null;
  let ecosystemCounts={repositories:0,pages:0};
  let lastFocus=null;
  let previousBodyOverflow=null;

  const esc=(value)=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl=(value)=>{
    try{
      const url=new URL(value,location.href);
      if(url.protocol!=="https:") return null;
      const allowed=["vervenveda.com","www.vervenveda.com","vervenveda.github.io","artist1970.github.io","jenniferpearl2028.github.io"];
      if(!allowed.includes(url.hostname)) return null;
      return url.href;
    }catch{return null}
  };

  function installStyle(){
    if(document.getElementById(IDS.style))return;
    const style=document.createElement("style");
    style.id=IDS.style;
    style.textContent=`
      #${IDS.button}{
        min-height:34px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
        padding:6px 10px;border:1px solid rgba(49,73,62,.24);border-radius:7px;
        color:#233b32;background:rgba(255,253,248,.86);
        box-shadow:none;font:500 10px/1.1 "Avenir Next","Segoe UI",Arial,sans-serif;
        letter-spacing:.075em;text-transform:uppercase;white-space:nowrap;cursor:pointer;
      }
      #${IDS.button}:hover,#${IDS.button}:focus-visible{background:#fff;border-color:rgba(49,73,62,.48)}
      #${IDS.button}.vnv-eco-text-only{
        min-height:34px;padding:6px 9px;letter-spacing:.03em;
        white-space:normal;text-align:center;
      }
      #${IDS.button} .vnv-eco-lines{width:14px;height:10px;display:grid;align-content:space-between}
      #${IDS.button} .vnv-eco-lines::before,#${IDS.button} .vnv-eco-lines::after,#${IDS.button} .vnv-eco-lines span{
        content:"";display:block;height:1px;background:currentColor
      }
      #${IDS.overlay}{
        position:fixed;inset:0;z-index:2147483500;display:grid;justify-items:end;overflow:hidden;contain:layout paint;
        visibility:hidden;opacity:0;background:rgba(9,15,13,.34);backdrop-filter:blur(4px);
        transition:opacity .18s ease,visibility .18s ease
      }
      #${IDS.overlay}[data-open="true"]{visibility:visible;opacity:1}
      #${IDS.overlay}:not([data-open="true"]) #${IDS.drawer}{display:none}
      #${IDS.drawer}{
        width:min(92vw,420px);max-width:100vw;height:100%;overflow:auto;box-sizing:border-box;padding:24px 20px 30px;
        transform:translateX(102%);transition:transform .2s ease;
        color:#202d28;background:#fbf8ef;border-left:1px solid rgba(49,73,62,.18);
        box-shadow:-20px 0 54px rgba(20,30,25,.15)
      }
      #${IDS.overlay}[data-open="true"] #${IDS.drawer}{transform:none}
      .vnv-eco-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .vnv-eco-kicker{margin:0 0 5px;color:#91733f;font:500 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}
      #${IDS.drawer} h2{margin:0;color:#233b32;font:500 29px/1.05 Georgia,"Times New Roman",serif}
      .vnv-eco-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#243a32;font-size:21px;cursor:pointer}
      .vnv-eco-intro{margin:13px 0 0;color:#69736e;font:400 12px/1.6 "Avenir Next","Segoe UI",Arial,sans-serif}
      #${IDS.search}{width:100%;min-height:42px;margin:17px 0 5px;padding:0 12px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#202d28;font:400 13px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif}
      #${IDS.status}{min-height:20px;margin:6px 0 0;color:#7b837f;font:400 10px/1.45 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-home{display:flex;justify-content:center;margin:12px 0 2px}
      .vnv-eco-home a{min-height:34px;display:inline-flex;align-items:center;justify-content:center;padding:7px 11px;border:1px solid rgba(145,115,63,.28);border-radius:7px;color:#6f5935;background:#fff;text-decoration:none;font:500 10px/1.1 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}
      .vnv-eco-group{margin:20px 0 7px;color:#92743f;font:500 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
      .vnv-eco-list{display:grid;gap:6px}
      .vnv-eco-link{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid rgba(49,73,62,.12);border-radius:7px;color:#25362f;background:#fff;text-decoration:none}
      .vnv-eco-link:hover,.vnv-eco-link:focus-visible{border-color:rgba(145,115,63,.46);background:#fffefb}
      .vnv-eco-link strong{display:block;font:500 12px/1.3 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-link small{display:block;margin-top:2px;color:#7b837f;font:400 9px/1.35 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-arrow{color:#9a7b43;font-size:12px}
      #${IDS.button}.vnv-eco-fixed{position:fixed;right:12px;top:12px;z-index:2147482500;box-shadow:0 6px 18px rgba(20,30,25,.08)}
      @media(max-width:620px){
        #${IDS.button}{font-size:9px;padding:6px 8px}
        #${IDS.button} .vnv-eco-label{display:none}
        #${IDS.button} .vnv-eco-lines{width:17px;height:12px}
        #${IDS.drawer}{width:min(94vw,390px);padding:20px 15px 26px}
      }
      @media(prefers-reduced-motion:reduce){#${IDS.overlay},#${IDS.drawer}{transition:none!important}}
      @media print{#${IDS.button},#${IDS.overlay}{display:none!important}}
    `;
    (document.head||document.documentElement).append(style);
  }

  function mountButton(){
    const button=document.createElement("button");
    button.id=IDS.button;
    button.type="button";
    button.setAttribute("aria-expanded","false");
    button.setAttribute("aria-controls",IDS.overlay);
    button.setAttribute("aria-label","Open Verve N Veda ecosystem directory");
    const nativeMenu=document.querySelector('#menuButton, .menu-button[aria-controls], .hamburger[aria-controls], [data-menu-toggle]');
    if(ecosystemSlot){
      button.innerHTML='<span class="vnv-eco-lines" aria-hidden="true"><span></span></span>';
      button.classList.add("vnv-eco-icon-only");
      button.title="Ecosystem Directory";
    }else{
      button.innerHTML=nativeMenu
        ? '<span class="vnv-eco-label">Ecosystem Directory</span>'
        : '<span class="vnv-eco-lines" aria-hidden="true"><span></span></span><span class="vnv-eco-label">Ecosystem</span>';
      if(nativeMenu)button.classList.add("vnv-eco-text-only");
    }

    const ecosystemSlot=document.querySelector("[data-vnv-ecosystem-slot]");
    const target=
      ecosystemSlot ||
      document.querySelector("[data-vnv-global-tools]") ||
      document.querySelector(".header-actions") ||
      document.querySelector(".nav-utilities") ||
      document.querySelector(".topbar-inner") ||
      document.querySelector(".site-header .nav") ||
      document.querySelector(".site-header .header-inner") ||
      document.querySelector("header nav");

    if(target) target.append(button);
    else {button.classList.add("vnv-eco-fixed");document.body.append(button);}
    return button;
  }

  function mountDrawer(){
    const overlay=document.createElement("div");
    overlay.id=IDS.overlay;
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    overlay.innerHTML=`
      <aside id="${IDS.drawer}" role="dialog" aria-modal="true" aria-labelledby="vnvEcosystemMenuTitle">
        <div class="vnv-eco-top">
          <div><p class="vnv-eco-kicker">One Connected Public Campus</p><h2 id="vnvEcosystemMenuTitle">Ecosystem Directory</h2></div>
          <button class="vnv-eco-close" type="button" aria-label="Close ecosystem directory">×</button>
        </div>
        <p class="vnv-eco-intro">Browse curated doorways or search every synchronized public page across Verve N Veda.</p>
        <div class="vnv-eco-home"><a href="${HOME}">Verve N Veda Home</a></div>
        <label style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)" for="${IDS.search}">Search the ecosystem</label>
        <input id="${IDS.search}" type="search" autocomplete="off" placeholder="Search education, art, news, tools…">
        <p id="${IDS.status}" role="status" aria-live="polite">Loading public directory…</p>
        <div id="${IDS.content}"></div>
      </aside>`;
    document.body.append(overlay);
    return overlay;
  }

  function render(query=""){
    const box=document.getElementById(IDS.content);
    const status=document.getElementById(IDS.status);
    if(!box)return;
    const q=String(query||"").trim().toLowerCase();

    if(q.length>=2 && !catalogLoaded){
      status.textContent="Searching the synchronized public page catalog…";
      ensureCatalog().then(()=>render(query)).catch(()=>render(query));
      return;
    }

    if(q.length>=2 && catalogLoaded){
      const matches=catalogPages.filter(page=>
        [page.title,page.category,page.repo,page.path,page.source]
          .join(" ").toLowerCase().includes(q)
      ).slice(0,60);
      box.innerHTML=matches.length
        ? '<section><h3 class="vnv-eco-group">Complete Public Index</h3><div class="vnv-eco-list">'+matches.map(page=>
            '<a class="vnv-eco-link" href="'+esc(page.url)+'"><span><strong>'+esc(page.title||page.path)+'</strong><small>'+esc((page.source||page.repo||"Verve N Veda")+' · '+(page.path||""))+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
          ).join("")+'</div></section>'
        : '<p class="vnv-eco-intro">No synchronized public page matches this search.</p>';
      status.textContent=matches.length
        ? "Showing "+matches.length+" of "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages."
        : "No match across "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages.";
      return;
    }

    const filtered=entries.filter(e=>!q || [e.title,e.category,e.type,e.description].join(" ").toLowerCase().includes(q));
    const groups=new Map();
    filtered.forEach(e=>{
      const key=e.category||"gateway";
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(e);
    });
    const order=[...CATEGORY_ORDER,...[...groups.keys()].filter(k=>!CATEGORY_ORDER.includes(k))];
    box.innerHTML=order.filter(k=>groups.has(k)).map(k=>{
      const list=groups.get(k).sort((a,b)=>a.title.localeCompare(b.title));
      return '<section><h3 class="vnv-eco-group">'+esc(CATEGORY_LABELS[k]||k)+'</h3><div class="vnv-eco-list">'+list.map(e=>
        '<a class="vnv-eco-link" href="'+esc(e.url)+'"><span><strong>'+esc(e.title)+'</strong><small>'+esc(e.type||"public doorway")+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
      ).join("")+'</div></section>';
    }).join("");
    const repoText=ecosystemCounts.repositories ? " · "+ecosystemCounts.repositories+" repositories" : "";
    const pageText=ecosystemCounts.pages ? " · "+ecosystemCounts.pages.toLocaleString()+" searchable pages" : "";
    status.textContent=filtered.length+" curated "+(filtered.length===1?"doorway":"doorways")+repoText+pageText+".";
  }

  async function ensureCatalog(){
    if(catalogLoaded)return catalogPages;
    if(catalogLoading)return catalogLoading;
    catalogLoading=(async()=>{
      const parts=catalogParts.length ? catalogParts : [
        "/registry/ecosystem-pages-a.json",
        "/registry/ecosystem-pages-b.json"
      ];
      const settled=await Promise.allSettled(parts.map(async part=>{
        const url=new URL(part,PUBLIC_ROOT).href;
        const response=await fetch(url,{cache:"no-store",credentials:"same-origin"});
        if(!response.ok)throw new Error("HTTP "+response.status);
        const data=await response.json();
        return Array.isArray(data?.pages)?data.pages:[];
      }));
      const seen=new Set();
      catalogPages=settled
        .filter(result=>result.status==="fulfilled")
        .flatMap(result=>result.value)
        .filter(page=>{
          const url=safeUrl(page?.url);
          if(!url)return false;
          const key=String(page.repo||"").toLowerCase()+"|"+String(page.path||"").toLowerCase();
          if(seen.has(key))return false;
          seen.add(key);
          page.url=url;
          return true;
        });
      if(!catalogPages.length)throw new Error("catalog unavailable");
      catalogLoaded=true;
      return catalogPages;
    })().finally(()=>{catalogLoading=null});
    return catalogLoading;
  }

  async function load(){
    const status=document.getElementById(IDS.status);
    try{
      const response=await fetch(REGISTRY,{cache:"no-store",credentials:"same-origin"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=await response.json();
      if(!Array.isArray(data?.entries))throw new Error("entries missing");
      catalogParts=Array.isArray(data?.pageCatalog?.parts)
        ? data.pageCatalog.parts.filter(part=>/^\/registry\/[A-Za-z0-9._/-]+\.json$/i.test(String(part||"")))
        : [];
      ecosystemCounts={
        repositories:Number(data?.pageCatalog?.repositoryCount)||0,
        pages:Number(data?.pageCatalog?.publicPageCount)||0
      };
      entries=data.entries.filter(e=>{
        if(!e||e.directoryVisible!==true||e.access!=="free-public"||e.status!=="active"||!e.title)return false;
        const url=safeUrl(e.url);
        if(!url)return false;
        e.url=url;
        return true;
      });
      render("");
    }catch(err){
      entries=[
        {title:"Khaemenes Academy",url:"/Khaemenes_Academy.github.io/",category:"education",type:"gateway"},
        {title:"PLERA Search",url:"/PLERASearch.github.io/",category:"research",type:"gateway"},
        {title:"The Verifier",url:"/theverifier.github.io/",category:"news",type:"gateway"},
        {title:"Bazaar Art",url:"/bazaarart.github.io/",category:"creative",type:"gateway"},
        {title:"Aurora",url:"/aurora.github.io/",category:"health",type:"gateway"},
        {title:"333 Network",url:"/333.github.io/",category:"communication",type:"network"}
      ].map(e=>({...e,url:new URL(e.url,location.origin).href}));
      render("");
      if(status)status.textContent="Core ecosystem gateways available; full directory is temporarily unavailable.";
    }
  }

  function open(){
    lastFocus=document.activeElement;
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.dataset.open="true";
    overlay.setAttribute("aria-hidden","false");
    button.setAttribute("aria-expanded","true");
    previousBodyOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    setTimeout(()=>document.getElementById(IDS.search)?.focus(),0);
  }
  function close(){
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    button.setAttribute("aria-expanded","false");
    if(previousBodyOverflow!==null)document.body.style.overflow=previousBodyOverflow;
    previousBodyOverflow=null;
    if(lastFocus?.focus)lastFocus.focus();
  }
  function bind(){
    const button=document.getElementById(IDS.button);
    const overlay=document.getElementById(IDS.overlay);
    const closeButton=overlay.querySelector(".vnv-eco-close");
    button.addEventListener("click",open);
    closeButton.addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
    document.getElementById(IDS.search).addEventListener("input",e=>render(e.target.value));
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"&&overlay.dataset.open==="true")close();
      if(e.key==="Tab"&&overlay.dataset.open==="true"){
        const focusable=[...overlay.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);
        if(!focusable.length)return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }

  function start(){
    if(!document.body)return;
    if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
    if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;
    if(window.__VNV_ECOSYSTEM_MENU_MOUNTING__) return;
    window.__VNV_ECOSYSTEM_MENU_MOUNTING__=true;
    try{
      installStyle();
      mountButton();
      mountDrawer();
      bind();
      load();
    }finally{
      window.__VNV_ECOSYSTEM_MENU_MOUNTING__=false;
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();

  window.VNVEcosystemMenu=Object.freeze({version:"1.1.0",open,close});
})();