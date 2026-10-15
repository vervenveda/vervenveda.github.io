/* Verve N Veda · Canonical Ecosystem Menu
   Public GitHub navigation only. No STOS runtime dependency.
   Canonical source: /ecosystem/master-ecosystem-directory.json */
(() => {
  "use strict";

  const VERSION="2026-10-14-directory-v1";
  const SOURCE="/ecosystem/master-ecosystem-directory.json";
  const CATEGORY_ORDER=[
    "education","research","news","weather","health","civic",
    "finance","creative","professional","games","communication","environmental","gateway"
  ];
  const CATEGORY_LABELS=Object.freeze({
    gateway:"Verve N Veda",
    education:"Education",
    research:"Research",
    news:"News",
    weather:"Weather & Earth Systems",
    health:"Health",
    civic:"Civic & Public Service",
    finance:"Finance",
    creative:"Creative",
    professional:"Professional",
    games:"Games",
    communication:"Connect",
    environmental:"Earth & Environment"
  });
  const TYPE_LABELS=Object.freeze({
    gateway:"Gateway",page:"Page",app:"App",tool:"Tool",game:"Game",hall:"Hall",
    portal:"Portal",course:"Course",assessment:"Assessment",archive:"Archive",
    mentor:"Mentor",resource:"Resource",workshop:"Workshop",studio:"Studio",network:"Network"
  });
  const MAX_SEARCH_RESULTS=60;

  const menus=[...document.querySelectorAll("[data-vnv-ecosystem-menu]")];
  if(!menus.length) return;

  const clean=value=>String(value??"").trim();
  const orderOf=category=>{
    const i=CATEGORY_ORDER.indexOf(category);
    return i<0?CATEGORY_ORDER.length:i;
  };
  const searchText=entry=>
    `${entry.title||""} ${entry.repository||""} ${entry.path||""} ${entry.category||""} ${entry.type||""}`.toLowerCase();

  function canonicalEntries(payload){
    const entries=Array.isArray(payload?.entries)?payload.entries:[];
    return entries.filter(entry=>
      entry &&
      entry.directoryVisible===true &&
      entry.access==="free-public" &&
      entry.status==="active" &&
      clean(entry.title) &&
      clean(entry.url)
    );
  }

  function el(tag,className,text){
    const node=document.createElement(tag);
    if(className) node.className=className;
    if(text!==undefined) node.textContent=text;
    return node;
  }

  function addLink(parent,{href,label,className="",meta="",current=false}){
    const a=el("a",className);
    a.href=href;
    a.setAttribute("aria-label",`Open ${label}`);
    if(current) a.setAttribute("aria-current","page");
    const strong=el("strong","",label);
    a.append(strong);
    if(meta) a.append(el("small","",meta));
    parent.append(a);
    return a;
  }

  function samePage(url){
    try{
      const target=new URL(url,window.location.href);
      const current=new URL(window.location.href);
      return target.pathname.replace(/index\.html$/i,"")===current.pathname.replace(/index\.html$/i,"");
    }catch{return false}
  }

  function renderCanonicalMenu(menu,entries){
    const nav=menu.querySelector(".vnv-ecosystem-dropdown");
    if(!nav) return;

    nav.replaceChildren();
    nav.dataset.directorySource=SOURCE;
    nav.dataset.directoryVersion=VERSION;

    nav.append(el("p","vnv-ecosystem-kicker","Verve N Veda"));

    const directory=el("a","vnv-ecosystem-primary","Ecosystem Directory");
    directory.href="https://vervenveda.com/#directory";
    nav.append(directory);

    const home=el("a","","Verve N Veda Home");
    home.href="https://vervenveda.com/";
    nav.append(home);

    const searchWrap=el("div","vnv-ecosystem-search-wrap");
    const search=el("input","vnv-ecosystem-search");
    search.type="search";
    search.autocomplete="off";
    search.placeholder="Search the public ecosystem…";
    search.setAttribute("aria-label","Search the Verve N Veda public ecosystem");
    const status=el("p","vnv-ecosystem-status");
    status.setAttribute("role","status");
    status.setAttribute("aria-live","polite");
    searchWrap.append(search,status);
    nav.append(searchWrap);

    const results=el("div","vnv-ecosystem-results");
    nav.append(results);

    function render(query=""){
      const term=clean(query).toLowerCase();
      const source=term
        ? entries.filter(entry=>searchText(entry).includes(term))
        : entries.filter(entry=>entry.type==="gateway"||entry.type==="network");

      const ordered=[...source].sort((a,b)=>
        orderOf(a.category)-orderOf(b.category) ||
        String(a.title).localeCompare(String(b.title),undefined,{sensitivity:"base"})
      );
      const visible=ordered.slice(0,MAX_SEARCH_RESULTS);
      const groups=new Map();

      visible.forEach(entry=>{
        const key=entry.category||"gateway";
        if(!groups.has(key)) groups.set(key,[]);
        groups.get(key).push(entry);
      });

      results.replaceChildren();

      [...groups.entries()]
        .sort((a,b)=>orderOf(a[0])-orderOf(b[0]))
        .forEach(([category,items])=>{
          const section=el("section","vnv-ecosystem-group");
          section.setAttribute("aria-label",CATEGORY_LABELS[category]||category);
          section.append(el("p","vnv-ecosystem-group-title",CATEGORY_LABELS[category]||category));
          items.forEach(entry=>{
            addLink(section,{
              href:entry.url,
              label:entry.title,
              className:"vnv-ecosystem-result",
              meta:`${TYPE_LABELS[entry.type]||entry.type||"Destination"} · ${entry.repository||"Verve N Veda"}`,
              current:samePage(entry.url)
            });
          });
          results.append(section);
        });

      if(!visible.length){
        results.append(el("p","vnv-ecosystem-empty",`No public destination matches “${query}”.`));
      }

      if(term){
        status.textContent=`${ordered.length.toLocaleString()} match${ordered.length===1?"":"es"} · ${Math.min(ordered.length,MAX_SEARCH_RESULTS).toLocaleString()} shown`;
      }else{
        status.textContent=`${entries.length.toLocaleString()} active public destinations · showing primary gateways`;
      }
    }

    search.addEventListener("input",()=>render(search.value));
    menu.addEventListener("toggle",()=>{
      if(menu.open) window.setTimeout(()=>search.focus(),40);
    });

    render();
    menu.dataset.directoryState="ready";
  }

  fetch(SOURCE,{cache:"no-store",credentials:"same-origin"})
    .then(response=>{
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(payload=>{
      const entries=canonicalEntries(payload);
      if(!entries.length) throw new Error("canonical directory has no active public entries");
      menus.forEach(menu=>renderCanonicalMenu(menu,entries));
    })
    .catch(error=>{
      menus.forEach(menu=>menu.dataset.directoryState="fallback");
      console.warn("Verve N Veda canonical ecosystem menu fallback:",error);
    });
})();
