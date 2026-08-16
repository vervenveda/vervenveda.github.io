/*
  Khaemenes Academy Aggregate Data Dashboard
  Verve N Veda Administration
  Version 1.0.0 — 2026-08-16

  Public-safe administrator reporting layer.
  This module intentionally reports aggregate counts only from browser-local
  Academy state or a future protected Data Bridge. It does not expose passwords,
  passcodes, verification codes, private risk signals, or child PII.
*/
(() => {
  "use strict";

  const VERSION = "1.0.0";
  const REGISTRY_KEY = "khaemenes_family_registry_v1";
  const SETTINGS_KEY = "VNV_ADMIN_SETTINGS_V1";
  const BETA_KEY = "VNV_ADMIN_BETA_V1";
  const SNAPSHOT_KEY = "VNV_ADMIN_ACADEMY_AGGREGATES_V1";
  const COURSE_PREFIX = "khaemenes.course:";
  const REFRESH_MS = 5 * 60 * 1000;

  const GRADES = ["pre-k","k","01","02","03","04","05","06","07","08","09","10","11","12"];
  const GRADE_LABELS = {
    "pre-k":"Pre-K", k:"Kindergarten", "01":"Grade 01", "02":"Grade 02", "03":"Grade 03", "04":"Grade 04",
    "05":"Grade 05", "06":"Grade 06", "07":"Grade 07", "08":"Grade 08", "09":"Grade 09", "10":"Grade 10",
    "11":"Grade 11", "12":"Grade 12"
  };
  const STAGE_LABELS = {
    preschool:"Preschool", kindergarten:"Kinder Garden", elementary:"Elementary", middle:"Middle School", high:"High School", higher:"Higher Learning"
  };

  const $ = id => document.getElementById(id);
  const safe = (v,max=240) => String(v ?? "").trim().slice(0,max);
  const esc = v => safe(v,1000).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const readJSON = (key,fallback) => { try { const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; } catch { return fallback; } };
  const writeJSON = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } };

  function normalizeGrade(v){
    const raw=safe(v,30).toLowerCase().replace(/grade|gr\.?/g,"").replace(/[_\s]+/g,"-").trim();
    if(["pre-k","prek","pk","preschool"].includes(raw))return "pre-k";
    if(["k","kg","kindergarten","kinder","kinder-garden"].includes(raw))return "k";
    const n=Number(raw.replace(/[^0-9]/g,""));
    return Number.isInteger(n)&&n>=1&&n<=12?String(n).padStart(2,"0"):null;
  }

  function localRegistry(){
    const raw=readJSON(REGISTRY_KEY,null);
    return raw&&typeof raw==="object"?raw:null;
  }

  function courseStats(learners){
    const learnerIds=new Set(learners.map(l=>safe(l.learnerId,220)).filter(Boolean));
    const perLearner={};
    let records=0;
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||"";
        if(!key.startsWith(COURSE_PREFIX))continue;
        const rest=key.slice(COURSE_PREFIX.length);
        const learnerId=[...learnerIds].find(id=>rest.startsWith(`${id}:`));
        if(!learnerId)continue;
        records++;
        perLearner[learnerId]=(perLearner[learnerId]||0)+1;
      }
    }catch{}
    return {records,learnersWithCourseState:Object.keys(perLearner).length};
  }

  function buildLocalSnapshot(){
    const registry=localRegistry();
    const families=Object.values(registry?.families||{}).filter(Boolean);
    const adults=Object.values(registry?.adults||{}).filter(Boolean);
    const learners=Object.values(registry?.learners||{}).filter(Boolean);
    const students=learners.filter(l=>l?.selfDirectedAdult!==true&&safe(l?.stage,40)!=="higher");
    const scholars=learners.filter(l=>l?.selfDirectedAdult===true||safe(l?.stage,40)==="higher");
    const grades=Object.fromEntries(GRADES.map(g=>[g,0]));
    const stages={preschool:0,kindergarten:0,elementary:0,middle:0,high:0,higher:0};
    let confirmedIds=0,provisionalIds=0,missingIds=0;

    for(const learner of learners){
      const grade=normalizeGrade(learner?.grade);
      if(grade&&Object.prototype.hasOwnProperty.call(grades,grade))grades[grade]++;
      const stage=safe(learner?.stage,40).toLowerCase();
      if(Object.prototype.hasOwnProperty.call(stages,stage))stages[stage]++;
      if(learner?.institutionalId){
        if(learner?.institutionalIdProvisional===false)confirmedIds++;
        else provisionalIds++;
      }else missingIds++;
    }

    const courses=courseStats(learners);
    const beta=readJSON(BETA_KEY,[]);
    return {
      format:"vnv-academy-aggregate-snapshot-v1",
      version:VERSION,
      source:"browser-local",
      capturedAt:new Date().toISOString(),
      families:families.length,
      adults:adults.length,
      students:students.length,
      scholars:scholars.length,
      learners:learners.length,
      grades,
      stages,
      courseRecords:courses.records,
      learnersWithCourseState:courses.learnersWithCourseState,
      institutionalIds:{confirmed:confirmedIds,provisional:provisionalIds,missing:missingIds},
      beta:{total:Array.isArray(beta)?beta.length:0},
      privacy:"Aggregate counts only. Browser-local data reflects this browser/origin, not global Academy enrollment."
    };
  }

  function normalizeRemote(payload){
    const source=payload?.academy||payload?.metrics?.academy||payload?.academyMetrics||null;
    if(!source||typeof source!=="object")return null;
    const num=v=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
    const grades={};
    for(const g of GRADES)grades[g]=num(source?.grades?.[g]??source?.gradeCounts?.[g]);
    return {
      format:"vnv-academy-aggregate-snapshot-v1",
      version:VERSION,
      source:"protected-bridge",
      capturedAt:safe(source.capturedAt||payload.capturedAt||new Date().toISOString(),80),
      families:num(source.families),
      adults:num(source.adults),
      students:num(source.students),
      scholars:num(source.scholars),
      learners:num(source.learners??(num(source.students)+num(source.scholars))),
      grades,
      stages:{
        preschool:num(source?.stages?.preschool),kindergarten:num(source?.stages?.kindergarten),elementary:num(source?.stages?.elementary),
        middle:num(source?.stages?.middle),high:num(source?.stages?.high),higher:num(source?.stages?.higher)
      },
      courseRecords:num(source.courseRecords??source.classes??source.activeClasses),
      learnersWithCourseState:num(source.learnersWithCourseState),
      institutionalIds:{confirmed:num(source?.institutionalIds?.confirmed),provisional:num(source?.institutionalIds?.provisional),missing:num(source?.institutionalIds?.missing)},
      beta:{total:num(source?.beta?.total??payload?.metrics?.betaParticipants??payload?.metrics?.beta)},
      privacy:"Protected bridge aggregate. No child PII is requested by this dashboard."
    };
  }

  async function fetchRemote(){
    const settings=readJSON(SETTINGS_KEY,{bridgeEndpoint:""});
    const endpoint=safe(settings?.bridgeEndpoint,1200);
    if(!endpoint)return null;
    let url;
    try{url=new URL(endpoint,location.href)}catch{return null}
    if(url.protocol!=="https:")return null;
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),5000);
    try{
      const response=await fetch(url.href,{method:"GET",credentials:"omit",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:controller.signal});
      if(!response.ok)return null;
      return normalizeRemote(await response.json());
    }catch{return null}finally{clearTimeout(timer)}
  }

  function injectStyles(){
    if($("academyDataDashboardStyles"))return;
    const style=document.createElement("style");style.id="academyDataDashboardStyles";
    style.textContent=`
      .academy-data-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin-bottom:14px}
      .academy-data-stat{min-height:112px;padding:14px;border:1px solid #293f55;border-radius:10px;background:#0b1724;text-align:center;display:flex;flex-direction:column;justify-content:center}
      .academy-data-stat span{color:#8ea0af;font-size:8px;font-weight:750;letter-spacing:.1em;text-transform:uppercase}.academy-data-stat strong{display:block;margin-top:7px;color:#fff;font:500 32px/1 var(--display,Georgia,serif)}.academy-data-stat small{display:block;margin-top:7px;color:#718394;font-size:8.5px;line-height:1.4}
      .academy-data-layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:14px}.academy-grade-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.academy-grade{padding:10px;border:1px solid #293f55;border-radius:8px;background:#0d1a28;text-align:center}.academy-grade strong{display:block;font-size:10px}.academy-grade span{display:block;margin-top:4px;color:#d8bd82;font:500 22px/1 var(--display,Georgia,serif)}.academy-stage-list{display:grid;gap:7px}.academy-stage{display:grid;grid-template-columns:minmax(120px,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border:1px solid #293f55;border-radius:8px;background:#0d1926}.academy-stage strong{font-size:9.5px}.academy-stage span{color:#d8bd82;font:500 20px/1 var(--display,Georgia,serif)}.academy-data-note{margin-top:12px;padding:11px 12px;border-left:3px solid #b48b45;border-radius:7px;color:#8193a3;background:#0b1724;font-size:9px;line-height:1.55}.academy-data-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
      body[data-theme="light"] .academy-data-stat,body[data-theme="light"] .academy-grade,body[data-theme="light"] .academy-stage,body[data-theme="light"] .academy-data-note{color:#14212b;background:#fff;border-color:#d1dbe3}body[data-theme="light"] .academy-data-stat strong{color:#14212b}body[data-theme="light"] .academy-data-stat span,body[data-theme="light"] .academy-data-stat small,body[data-theme="light"] .academy-data-note{color:#697b89}
      @media(max-width:1180px){.academy-data-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.academy-data-layout{grid-template-columns:1fr}}@media(max-width:720px){.academy-data-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.academy-grade-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:430px){.academy-data-grid,.academy-grade-grid{grid-template-columns:1fr}}
    `;
    document.head.append(style);
  }

  function injectNav(){
    if(document.querySelector('[data-view="academy-data"]'))return;
    const nav=document.querySelector(".nav");if(!nav)return;
    const beta=document.querySelector('[data-view="beta"]');
    const button=document.createElement("button");button.className="nav-button";button.type="button";button.dataset.view="academy-data";
    button.innerHTML='<span class="nav-icon">KA</span><span class="nav-label">Academy Data</span><span class="nav-count" id="navAcademyCount">0</span>';
    nav.insertBefore(button,beta||null);
    button.addEventListener("click",()=>showAcademyView());
  }

  function injectView(){
    if($("view-academy-data"))return;
    const main=document.querySelector(".workspace main");if(!main)return;
    const beta=$("view-beta");
    const section=document.createElement("section");section.className="view";section.id="view-academy-data";section.dataset.viewPanel="academy-data";
    section.innerHTML=`
      <div class="view-head"><div><p class="eyebrow">Khaemenes Academy Operations</p><h1>Academy Data</h1><p>Aggregate family, learner, grade, course-state, institutional-ID, and beta-program counts. Sensitive learner records remain outside this public static dashboard.</p></div></div>
      <div class="academy-data-actions"><button class="action-btn gold" id="refreshAcademyData" type="button">Refresh Academy Data</button><button class="action-btn" id="exportAcademyData" type="button">Export Aggregate JSON</button></div>
      <div class="academy-data-grid">
        <div class="academy-data-stat"><span>Families</span><strong id="academyFamilies">0</strong><small>family containers</small></div>
        <div class="academy-data-stat"><span>K–12 Students</span><strong id="academyStudents">0</strong><small>school-stage learners</small></div>
        <div class="academy-data-stat"><span>Adult Scholars</span><strong id="academyScholars">0</strong><small>Higher Learning identities</small></div>
        <div class="academy-data-stat"><span>Total Learners</span><strong id="academyLearners">0</strong><small>students + scholars</small></div>
        <div class="academy-data-stat"><span>Course Records</span><strong id="academyCourses">0</strong><small>learner-scoped course/class states</small></div>
        <div class="academy-data-stat"><span>Beta Queue</span><strong id="academyBeta">0</strong><small>beta-program records</small></div>
      </div>
      <div class="academy-data-layout">
        <article class="panel"><div class="panel-head"><div><h2>Grade Distribution</h2><p>Exact K–12 placement counts.</p></div><span class="panel-tag" id="academySourceTag">Local</span></div><div class="academy-grade-grid" id="academyGradeGrid"></div></article>
        <article class="panel"><div class="panel-head"><div><h2>Campus & Identity Health</h2><p>Stage totals and Institutional ID readiness.</p></div></div><div class="academy-stage-list" id="academyStageList"></div><div class="academy-data-note" id="academyIdentityNote"></div></article>
      </div>
      <p class="academy-data-note" id="academyDataBoundary" style="max-width:900px;margin:14px auto 0;text-align:center"></p>
    `;
    if(beta)main.insertBefore(section,beta);else main.append(section);
    $("refreshAcademyData").addEventListener("click",()=>refresh(true));
    $("exportAcademyData").addEventListener("click",exportAggregate);
  }

  function setTopbar(){
    const title=$("topbarViewTitle");if(title)title.textContent="Academy Data";
  }

  function showAcademyView(){
    document.querySelectorAll("[data-view-panel]").forEach(p=>p.classList.toggle("active",p.dataset.viewPanel==="academy-data"));
    document.querySelectorAll(".nav-button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view==="academy-data"));
    setTopbar();render(readJSON(SNAPSHOT_KEY,buildLocalSnapshot()));
  }

  function render(snapshot){
    if(!snapshot)return;
    $("academyFamilies").textContent=String(snapshot.families||0);
    $("academyStudents").textContent=String(snapshot.students||0);
    $("academyScholars").textContent=String(snapshot.scholars||0);
    $("academyLearners").textContent=String(snapshot.learners||0);
    $("academyCourses").textContent=String(snapshot.courseRecords||0);
    $("academyBeta").textContent=String(snapshot?.beta?.total||0);
    const nav=$("navAcademyCount");if(nav)nav.textContent=String(snapshot.learners||0);
    const source=$("academySourceTag");if(source)source.textContent=snapshot.source==="protected-bridge"?"Protected Bridge":"This Browser";
    $("academyGradeGrid").innerHTML=GRADES.map(g=>`<div class="academy-grade"><strong>${esc(GRADE_LABELS[g])}</strong><span>${Number(snapshot?.grades?.[g])||0}</span></div>`).join("");
    $("academyStageList").innerHTML=Object.keys(STAGE_LABELS).map(stage=>`<div class="academy-stage"><strong>${esc(STAGE_LABELS[stage])}</strong><span>${Number(snapshot?.stages?.[stage])||0}</span></div>`).join("");
    const ids=snapshot.institutionalIds||{};
    $("academyIdentityNote").innerHTML=`<strong>Institutional IDs</strong><br>${Number(ids.confirmed)||0} confirmed · ${Number(ids.provisional)||0} provisional · ${Number(ids.missing)||0} missing`;
    $("academyDataBoundary").textContent=snapshot.source==="protected-bridge"
      ? "Protected Data Bridge aggregate. This page requests counts only; credentials, verification secrets, child PII, and private anti-abuse signals remain outside the static admin portal."
      : "Browser-local snapshot only. These counts describe Academy data stored on this browser/origin and are not global enrollment statistics. Connect the protected Data Bridge for authoritative system-wide totals.";
  }

  async function refresh(manual=false){
    const button=$("refreshAcademyData");if(button){button.disabled=true;button.textContent="Refreshing…"}
    try{
      const remote=await fetchRemote();
      const snapshot=remote||buildLocalSnapshot();
      writeJSON(SNAPSHOT_KEY,snapshot);render(snapshot);
      document.dispatchEvent(new CustomEvent("vnv:academy-aggregate-updated",{detail:{source:snapshot.source,families:snapshot.families,students:snapshot.students,scholars:snapshot.scholars,learners:snapshot.learners,courseRecords:snapshot.courseRecords,beta:snapshot?.beta?.total||0}}));
    }finally{if(button){button.disabled=false;button.textContent="Refresh Academy Data"}}
  }

  function exportAggregate(){
    const snapshot=readJSON(SNAPSHOT_KEY,null)||buildLocalSnapshot();
    const payload={...snapshot,exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`khaemenes-academy-aggregate-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function initialize(){
    injectStyles();injectNav();injectView();
    const cached=readJSON(SNAPSHOT_KEY,null);render(cached||buildLocalSnapshot());
    const observer=new MutationObserver(()=>{if(document.body.classList.contains("unlocked"))refresh(false)});
    observer.observe(document.body,{attributes:true,attributeFilter:["class"]});
    if(document.body.classList.contains("unlocked"))setTimeout(()=>refresh(false),700);
    setInterval(()=>{if(document.body.classList.contains("unlocked"))refresh(false)},REFRESH_MS);
    window.addEventListener("storage",e=>{if(e.key===REGISTRY_KEY||e.key===BETA_KEY)refresh(false)});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();
