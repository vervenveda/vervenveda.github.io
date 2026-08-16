/*
  NAIB Repository Architecture Report
  Verve N Veda Administration
  Version 1.0.0 — 2026-08-11

  Purpose:
  - Read the canonical generated ecosystem repository registry.
  - Build a categorical administrator report.
  - Compare the newest registry with the prior local snapshot.
  - Surface architecture drift without rewriting repository source.
  - Keep reporting separate from NAIB's private Internal Cloud.

  No credentials, tokens, passcodes, private routes, or hidden architecture
  are stored in this module.
*/
(() => {
  "use strict";

  const REPORT_VERSION = "1.0.0";
  const TTL_MS = 15 * 60 * 1000;
  const SNAPSHOT_KEY = "VNV_ADMIN_REPOSITORY_ARCHITECTURE_V1";
  const HISTORY_KEY = "VNV_ADMIN_REPOSITORY_ARCHITECTURE_HISTORY_V1";

  const REGISTRY_URLS = [
    "https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-repositories.json",
    "https://raw.githubusercontent.com/vervenveda/vervenveda.github.io/main/assessment-engine/mentor/registry/ecosystem-repositories.json"
  ];

  const CATEGORY_ORDER = [
    "AI & Intelligence",
    "Education",
    "Creative & Cultural",
    "Research & Information",
    "Archives & Historical",
    "Wellness",
    "Professional & Practical",
    "Civic / Human Services",
    "Campaign",
    "Infrastructure & System",
    "Unclassified / Needs Review"
  ];

  const $ = id => document.getElementById(id);

  function safeText(value, max = 1000) {
    return String(value ?? "").trim().slice(0, max);
  }

  function esc(value) {
    return safeText(value, 4000).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[c]));
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit"
      }).format(new Date(iso));
    } catch {
      return safeText(iso, 80);
    }
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeClassification(value = "") {
    return safeText(value, 300)
      .toLowerCase()
      .split(/[,/|]+/)
      .map(x => x.trim())
      .filter(Boolean);
  }

  function categoryFor(repo = {}) {
    const parts = normalizeClassification(repo.classification);
    const haystack = [
      repo.name, repo.fullName, repo.description,
      repo.classification, repo.manifest?.sourceId
    ].join(" ").toLowerCase();
    if (parts.some(x => /campaign|politic|election/.test(x))) return "Campaign";
    if (parts.some(x => /wellness|health-wellness/.test(x))) return "Wellness";
    if (parts.some(x => /civic|human-service|public-service|community-service/.test(x))) return "Civic / Human Services";
    if (parts.some(x => /creative|cultural|art|music/.test(x))) return "Creative & Cultural";
    if (parts.some(x => /educational|education|curriculum|learning|school/.test(x))) return "Education";
    if (parts.some(x => /research|information|reference|humanities|public-learning/.test(x))) return "Research & Information";
    if (parts.some(x => /professional|practical|finance|business|productivity/.test(x))) return "Professional & Practical";
    if (parts.some(x => /admin|restricted|infrastructure|system/.test(x))) return "Infrastructure & System";
    if (/\b(core|noema|naib|hope|eiren|archaemenes|zelle|moir)\b/i.test(haystack)) return "AI & Intelligence";
    if (/\b(arshif|archive|archives|historical)\b/i.test(haystack)) return "Archives & Historical";
    if (/\b(assessment-engine|registry|infrastructure|gateway|network)\b/i.test(haystack)) return "Infrastructure & System";
    if (safeText(repo.owner).toLowerCase() === "jenniferpearl2028") return "Campaign";
    return "Unclassified / Needs Review";
  }

  function normalizeRepo(repo = {}) {
    const manifest = repo.manifest && typeof repo.manifest === "object" ? repo.manifest : null;
    const fullName = safeText(repo.fullName || `${repo.owner || ""}/${repo.name || ""}`, 320);
    return {
      id: safeText(repo.id || `github:${fullName}`, 360), owner: safeText(repo.owner, 120), name: safeText(repo.name, 220), fullName,
      description: safeText(repo.description, 900), htmlUrl: safeText(repo.htmlUrl, 1200), homepage: safeText(repo.homepage, 1200),
      defaultBranch: safeText(repo.defaultBranch || "main", 100), archived: repo.archived === true, disabled: repo.disabled === true,
      hasPages: repo.hasPages === true, createdAt: safeText(repo.createdAt, 80), updatedAt: safeText(repo.updatedAt, 80), pushedAt: safeText(repo.pushedAt, 80),
      discoveryStatus: safeText(repo.discoveryStatus || "unknown", 80), classification: safeText(repo.classification || "unclassified", 300),
      confidence: Number.isFinite(Number(repo.confidence)) ? Number(repo.confidence) : null, recommendable: repo.recommendable === true,
      reason: safeText(repo.reason, 800),
      manifest: manifest ? {path:safeText(manifest.path,220),sha:safeText(manifest.sha,100),version:manifest.version??null,sourceId:safeText(manifest.sourceId,220),mentorSearchable:manifest.mentorSearchable===true,inventoryAuthority:safeText(manifest.inventoryAuthority,220),resourceCount:Number.isFinite(Number(manifest.resourceCount))?Number(manifest.resourceCount):0}:null,
      category: categoryFor(repo)
    };
  }

  function validRegistry(value){return Boolean(value&&Number(value.version)>=2&&Array.isArray(value.repositories));}
  async function fetchJson(url,timeoutMs=5000){const controller=typeof AbortController!=="undefined"?new AbortController():null;const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;try{const response=await fetch(url,{method:"GET",credentials:"omit",cache:"no-store",headers:{Accept:"application/json"},...(controller?{signal:controller.signal}:{})});if(!response.ok)throw new Error(`HTTP ${response.status}`);return await response.json();}finally{if(timer)clearTimeout(timer)}}
  async function fetchRegistry(){const errors=[];for(const url of REGISTRY_URLS){try{const value=await fetchJson(url);if(!validRegistry(value))throw new Error("invalid repository registry");return {value,url};}catch(error){errors.push(`${url}: ${String(error?.message||error)}`)}}throw new Error(errors.join(" | ").slice(0,1200)||"repository registry unavailable")}
  function repoMap(snapshot){const map=new Map();for(const repo of snapshot?.repositories||[]){const key=safeText(repo.fullName).toLowerCase();if(key)map.set(key,repo)}return map}
  function compareSnapshots(previous,current){if(!previous?.repositories?.length)return {baseline:true,added:[],removed:[],classificationChanged:[],categoryChanged:[],discoveryChanged:[],manifestChanged:[],recommendationChanged:[],accountAdded:[],accountRemoved:[],modified:[]};const prev=repoMap(previous),cur=repoMap(current),added=[],removed=[],classificationChanged=[],categoryChanged=[],discoveryChanged=[],manifestChanged=[],recommendationChanged=[],modified=[];for(const [key,repo] of cur){const old=prev.get(key);if(!old){added.push(repo);continue}if(safeText(old.classification)!==safeText(repo.classification))classificationChanged.push({repo,from:old.classification,to:repo.classification});if(safeText(old.category)!==safeText(repo.category))categoryChanged.push({repo,from:old.category,to:repo.category});if(safeText(old.discoveryStatus)!==safeText(repo.discoveryStatus))discoveryChanged.push({repo,from:old.discoveryStatus,to:repo.discoveryStatus});const oldManifest=old.manifest?.sha||"",newManifest=repo.manifest?.sha||"";if(oldManifest!==newManifest)manifestChanged.push({repo,from:old.manifest?"manifested":"none",to:repo.manifest?"manifested":"none"});if(Boolean(old.recommendable)!==Boolean(repo.recommendable))recommendationChanged.push({repo,from:Boolean(old.recommendable),to:Boolean(repo.recommendable)});if(safeText(old.pushedAt)!==safeText(repo.pushedAt)||safeText(old.updatedAt)!==safeText(repo.updatedAt))modified.push(repo)}for(const [key,repo] of prev){if(!cur.has(key))removed.push(repo)}const oldAccounts=new Set((previous.accounts||[]).map(x=>safeText(x).toLowerCase())),newAccounts=new Set((current.accounts||[]).map(x=>safeText(x).toLowerCase()));return {baseline:false,added,removed,classificationChanged,categoryChanged,discoveryChanged,manifestChanged,recommendationChanged,accountAdded:[...newAccounts].filter(x=>!oldAccounts.has(x)),accountRemoved:[...oldAccounts].filter(x=>!newAccounts.has(x)),modified}}
  function attentionFor(snapshot,configuredAccounts=[]){const signals=[];for(const repo of snapshot.repositories){if(repo.category==="Unclassified / Needs Review")signals.push({level:"warn",repo,reason:"Repository needs categorical review."});if(repo.confidence!==null&&repo.confidence<.75)signals.push({level:"warn",repo,reason:`Low classification confidence (${repo.confidence}).`});if(!repo.manifest&&repo.discoveryStatus!=="ignored")signals.push({level:"info",repo,reason:"No current Mentor manifest in generated registry."});if(repo.archived||repo.disabled)signals.push({level:"warn",repo,reason:repo.disabled?"Repository is disabled.":"Repository is archived."})}const registryAccounts=new Set(snapshot.accounts.map(x=>safeText(x).toLowerCase())),configured=new Set(configuredAccounts.map(x=>safeText(x).toLowerCase()));for(const account of configuredAccounts){if(!registryAccounts.has(account.toLowerCase()))signals.unshift({level:"warn",repo:null,reason:`Configured GitHub monitor "${account}" is not present in the generated repository registry.`})}for(const account of snapshot.accounts){if(configured.size&&!configured.has(account.toLowerCase()))signals.unshift({level:"info",repo:null,reason:`Registry account "${account}" is not present in the Admin GitHub account filter.`})}return signals}
  function configuredAccountsFromAdmin(){const select=$("githubOwnerFilter");if(!select)return [];return [...select.options].map(option=>safeText(option.value)).filter(Boolean)}
  function buildSnapshot(registry,sourceUrl){const repositories=registry.repositories.map(normalizeRepo);const accounts=Array.isArray(registry.accounts)?registry.accounts.map(x=>safeText(x,120)).filter(Boolean):[...new Set(repositories.map(x=>x.owner).filter(Boolean))];return {format:"vnv-repository-architecture-report",formatVersion:1,reportVersion:REPORT_VERSION,capturedAt:nowIso(),sourceUrl,registryVersion:registry.version,generatedAt:registry.generatedAt||null,sourceLatestRepositoryTimestamp:registry.sourceLatestRepositoryTimestamp||null,accounts,repositories}}
  function categoryGroups(snapshot){const groups=new Map(CATEGORY_ORDER.map(name=>[name,[]]));for(const repo of snapshot.repositories){const category=groups.has(repo.category)?repo.category:"Unclassified / Needs Review";groups.get(category).push(repo)}for(const list of groups.values())list.sort((a,b)=>a.fullName.localeCompare(b.fullName));return groups}
  function countChanges(changes){return [changes.added.length,changes.removed.length,changes.classificationChanged.length,changes.categoryChanged.length,changes.discoveryChanged.length,changes.manifestChanged.length,changes.recommendationChanged.length,changes.accountAdded.length,changes.accountRemoved.length].reduce((a,b)=>a+b,0)}

  function injectStyles(){if($("repoArchitectureStyles"))return;const style=document.createElement("style");style.id="repoArchitectureStyles";style.textContent=`.repo-arch-panel{margin-top:14px}.repo-arch-toolbar{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:0 0 14px}.repo-arch-status{min-height:20px;color:#8295a6;font-size:9px;text-align:center;margin:8px 0 0}.repo-arch-metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}.repo-arch-stat{min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:13px;border:1px solid #293f55;border-radius:9px;background:#0b1724;text-align:center}.repo-arch-stat span{color:#8497a8;font-size:8px;font-weight:750;letter-spacing:.1em;text-transform:uppercase}.repo-arch-stat strong{display:block;margin-top:7px;color:#fff;font:500 31px/1 var(--display,Georgia,serif)}.repo-arch-stat small{display:block;margin-top:7px;color:#708394;font-size:8.5px;line-height:1.35}.repo-arch-layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:12px;margin-top:12px}.repo-arch-subpanel{min-width:0;padding:15px;border:1px solid #263a50;border-radius:9px;background:#0c1825}.repo-arch-subpanel h3{margin:0 0 11px;font:500 19px/1.1 var(--display,Georgia,serif);text-align:center}.repo-arch-accounts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.repo-arch-account{padding:10px;border:1px solid #293f55;border-radius:7px;background:#101e2d;text-align:center}.repo-arch-account strong{display:block;font-size:10px;overflow-wrap:anywhere}.repo-arch-account small{display:block;margin-top:4px;color:#728596;font-size:8.5px}.repo-arch-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.repo-arch-category{border:1px solid #293f55;border-radius:7px;background:#0e1b29;overflow:hidden}.repo-arch-category summary{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;cursor:pointer;color:#dce5ec;font-size:9.5px;font-weight:700}.repo-arch-category summary span:last-child{color:#d4b66f}.repo-arch-repos{padding:0 10px 10px;display:grid;gap:5px}.repo-arch-repo{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:7px 0;border-top:1px solid #213448}.repo-arch-repo strong{font-size:9px;overflow-wrap:anywhere}.repo-arch-repo small{display:block;margin-top:3px;color:#6f8293;font-size:8px;line-height:1.35}.repo-arch-badge{align-self:start;padding:3px 6px;border:1px solid #344c64;border-radius:999px;color:#9db0bf;font-size:7.5px;white-space:nowrap}.repo-arch-feed{display:grid;gap:6px}.repo-arch-signal{display:grid;grid-template-columns:8px minmax(0,1fr);gap:8px;padding:8px;border:1px solid #293f55;border-radius:7px;background:#0d1926}.repo-arch-signal i{width:7px;height:7px;margin-top:4px;border-radius:50%;background:#5c82a3}.repo-arch-signal.warn i{background:#b9954f}.repo-arch-signal.error i{background:#a94955}.repo-arch-signal.success i{background:#4aa56a}.repo-arch-signal strong{display:block;font-size:9px}.repo-arch-signal small{display:block;margin-top:3px;color:#748697;font-size:8px;line-height:1.4}.repo-arch-source{margin-top:10px;color:#6d8091;font:8px/1.45 var(--mono,monospace);text-align:center;overflow-wrap:anywhere}body[data-theme="light"] .repo-arch-stat,body[data-theme="light"] .repo-arch-subpanel,body[data-theme="light"] .repo-arch-account,body[data-theme="light"] .repo-arch-category,body[data-theme="light"] .repo-arch-signal{color:#14212b;background:#fff;border-color:#d1dbe3}body[data-theme="light"] .repo-arch-stat strong{color:#14212b}body[data-theme="light"] .repo-arch-stat span,body[data-theme="light"] .repo-arch-stat small,body[data-theme="light"] .repo-arch-account small,body[data-theme="light"] .repo-arch-repo small,body[data-theme="light"] .repo-arch-signal small,body[data-theme="light"] .repo-arch-source{color:#697b89}body[data-theme="light"] .repo-arch-repo{border-color:#d8e0e7}@media(max-width:1100px){.repo-arch-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.repo-arch-layout{grid-template-columns:1fr}}@media(max-width:720px){.repo-arch-categories,.repo-arch-accounts{grid-template-columns:1fr}}@media(max-width:480px){.repo-arch-metrics{grid-template-columns:1fr}}`;document.head.append(style)}

  function injectPanel(){if($("repositoryArchitecturePanel"))return true;const githubView=$("view-github");if(!githubView)return false;const panel=document.createElement("article");panel.className="panel repo-arch-panel";panel.id="repositoryArchitecturePanel";panel.innerHTML=`<div class="panel-head"><div><h2>Repository Architecture</h2><p>Self-updating categorical map generated from the ecosystem repository registry. Changes are compared with the prior local snapshot and surfaced for administrator review.</p></div><span class="panel-tag" id="repoArchitectureTag">Waiting</span></div><div class="repo-arch-toolbar"><button class="action-btn gold" id="refreshRepositoryArchitecture" type="button">Refresh Architecture</button><button class="action-btn" id="exportRepositoryArchitecture" type="button">Export Report JSON</button></div><div class="repo-arch-metrics"><div class="repo-arch-stat"><span>Repositories</span><strong id="repoArchTotal">—</strong><small>registry inventory</small></div><div class="repo-arch-stat"><span>Registry Accounts</span><strong id="repoArchAccounts">—</strong><small>account families represented</small></div><div class="repo-arch-stat"><span>Manifested</span><strong id="repoArchManifested">—</strong><small>manifest-discovered repositories</small></div><div class="repo-arch-stat"><span>Needs Review</span><strong id="repoArchReview">—</strong><small>unclassified or low-confidence</small></div><div class="repo-arch-stat"><span>Architecture Changes</span><strong id="repoArchChanges">—</strong><small>since previous snapshot</small></div></div><div class="repo-arch-layout"><section class="repo-arch-subpanel"><h3>Account & Category Map</h3><div class="repo-arch-accounts" id="repoArchAccountList"></div><div class="repo-arch-categories" id="repoArchCategories" style="margin-top:10px"></div></section><section class="repo-arch-subpanel"><h3>Architecture Drift & Attention</h3><div class="repo-arch-feed" id="repoArchChangesFeed"></div><h3 style="margin-top:16px">Attention Queue</h3><div class="repo-arch-feed" id="repoArchAttention"></div></section></div><div class="repo-arch-status" id="repoArchitectureStatus"></div><div class="repo-arch-source" id="repoArchitectureSource"></div>`;const safetyNote=githubView.querySelector(".safety-note");if(safetyNote)githubView.insertBefore(panel,safetyNote);else githubView.append(panel);$("refreshRepositoryArchitecture").addEventListener("click",()=>refreshArchitecture(true));$("exportRepositoryArchitecture").addEventListener("click",exportLatest);return true}
  function renderChanges(changes){const target=$("repoArchChangesFeed");if(!target)return;if(changes.baseline){target.innerHTML='<div class="repo-arch-signal success"><i></i><div><strong>Baseline established</strong><small>The first local architecture snapshot is now available. Future refreshes will report structural drift.</small></div></div>';return}const rows=[];const add=(level,title,detail)=>rows.push({level,title,detail});for(const repo of changes.added.slice(0,8))add("success",`Added · ${repo.fullName}`,repo.category);for(const repo of changes.removed.slice(0,8))add("warn",`No longer in registry · ${repo.fullName}`,repo.category||repo.classification);for(const item of changes.categoryChanged.slice(0,8))add("warn",`Category changed · ${item.repo.fullName}`,`${item.from||"—"} → ${item.to||"—"}`);for(const item of changes.classificationChanged.slice(0,8))add("warn",`Classification changed · ${item.repo.fullName}`,`${item.from||"—"} → ${item.to||"—"}`);for(const item of changes.discoveryChanged.slice(0,8))add("info",`Discovery changed · ${item.repo.fullName}`,`${item.from||"—"} → ${item.to||"—"}`);for(const item of changes.manifestChanged.slice(0,8))add("info",`Manifest changed · ${item.repo.fullName}`,`${item.from} → ${item.to}`);for(const item of changes.recommendationChanged.slice(0,8))add("info",`Recommendation state · ${item.repo.fullName}`,`${item.from} → ${item.to}`);for(const account of changes.accountAdded)add("success",`Registry account added · ${account}`,"Account-family inventory changed.");for(const account of changes.accountRemoved)add("warn",`Registry account removed · ${account}`,"Account-family inventory changed.");if(!rows.length){target.innerHTML='<div class="repo-arch-signal success"><i></i><div><strong>No structural drift detected</strong><small>The current categorical architecture matches the prior snapshot.</small></div></div>';return}target.innerHTML=rows.slice(0,24).map(row=>`<div class="repo-arch-signal ${esc(row.level)}"><i></i><div><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></div></div>`).join("")}
  function renderAttention(signals){const target=$("repoArchAttention");if(!target)return;if(!signals.length){target.innerHTML='<div class="repo-arch-signal success"><i></i><div><strong>No architecture attention signals</strong><small>The current registry has no obvious classification or configuration drift requiring review.</small></div></div>';return}target.innerHTML=signals.slice(0,18).map(signal=>`<div class="repo-arch-signal ${esc(signal.level||"info")}"><i></i><div><strong>${signal.repo?esc(signal.repo.fullName):"Architecture configuration"}</strong><small>${esc(signal.reason)}</small></div></div>`).join("")}
  function renderSnapshot(snapshot,changes){const groups=categoryGroups(snapshot),configuredAccounts=configuredAccountsFromAdmin(),attention=attentionFor(snapshot,configuredAccounts),reviewCount=snapshot.repositories.filter(repo=>repo.category==="Unclassified / Needs Review"||(repo.confidence!==null&&repo.confidence<.75)).length;$("repoArchTotal").textContent=String(snapshot.repositories.length);$("repoArchAccounts").textContent=String(snapshot.accounts.length);$("repoArchManifested").textContent=String(snapshot.repositories.filter(repo=>repo.discoveryStatus==="manifested"||Boolean(repo.manifest)).length);$("repoArchReview").textContent=String(reviewCount);$("repoArchChanges").textContent=String(countChanges(changes));$("repoArchitectureTag").textContent=`Updated ${fmtDate(snapshot.capturedAt)}`;$("repoArchitectureSource").textContent=`Registry generated ${fmtDate(snapshot.generatedAt)} · latest repository timestamp ${fmtDate(snapshot.sourceLatestRepositoryTimestamp)} · source ${snapshot.sourceUrl}`;const accountCounts=new Map(snapshot.accounts.map(account=>[account,0]));for(const repo of snapshot.repositories)accountCounts.set(repo.owner,(accountCounts.get(repo.owner)||0)+1);$("repoArchAccountList").innerHTML=[...accountCounts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([account,count])=>`<div class="repo-arch-account"><strong>${esc(account)}</strong><small>${count} repositor${count===1?"y":"ies"}</small></div>`).join("");$("repoArchCategories").innerHTML=CATEGORY_ORDER.map(category=>{const repos=groups.get(category)||[];if(!repos.length)return "";return `<details class="repo-arch-category" ${category==="Unclassified / Needs Review"?"open":""}><summary><span>${esc(category)}</span><span>${repos.length}</span></summary><div class="repo-arch-repos">${repos.map(repo=>`<div class="repo-arch-repo"><div><strong>${esc(repo.fullName)}</strong><small>${esc(repo.classification)} · ${esc(repo.discoveryStatus)} · pushed ${esc(fmtDate(repo.pushedAt))}</small></div><span class="repo-arch-badge">${repo.manifest?`manifest ${repo.manifest.resourceCount}`:"no manifest"}</span></div>`).join("")}</div></details>`}).join("");renderChanges(changes);renderAttention(attention)}
  function saveSnapshot(previous,current){if(previous?.repositories?.length){const history=readJSON(HISTORY_KEY,[]);history.unshift({capturedAt:previous.capturedAt,generatedAt:previous.generatedAt,sourceLatestRepositoryTimestamp:previous.sourceLatestRepositoryTimestamp,accounts:previous.accounts,repositoryCount:previous.repositories.length});writeJSON(HISTORY_KEY,history.slice(0,24))}writeJSON(SNAPSHOT_KEY,current)}
  async function refreshArchitecture(manual=false){if(!injectPanel())return;const button=$("refreshRepositoryArchitecture"),status=$("repoArchitectureStatus");if(button){button.disabled=true;button.textContent="Refreshing…"}if(status)status.textContent="Reading current ecosystem repository registry…";try{const previous=readJSON(SNAPSHOT_KEY,null);const {value,url}=await fetchRegistry();const current=buildSnapshot(value,url),changes=compareSnapshots(previous,current);saveSnapshot(previous,current);renderSnapshot(current,changes);if(status){const modifiedNote=changes.modified.length?` ${changes.modified.length} repositor${changes.modified.length===1?"y":"ies"} also show newer push/update timestamps.`:"";status.textContent=manual?`Architecture refreshed successfully.${modifiedNote}`:`Architecture map is current.${modifiedNote}`}document.dispatchEvent(new CustomEvent("vnv:repository-architecture-updated",{detail:{repositoryCount:current.repositories.length,accountCount:current.accounts.length,structuralChanges:countChanges(changes),generatedAt:current.generatedAt}}))}catch(error){const cached=readJSON(SNAPSHOT_KEY,null);if(cached?.repositories?.length){renderSnapshot(cached,compareSnapshots(cached,cached));if($("repoArchitectureTag"))$("repoArchitectureTag").textContent="Cached snapshot";if(status)status.textContent=`Live registry unavailable; showing cached architecture. ${String(error?.message||error).slice(0,420)}`}else if(status)status.textContent=`Repository architecture unavailable: ${String(error?.message||error).slice(0,500)}`}finally{if(button){button.disabled=false;button.textContent="Refresh Architecture"}}}
  function exportLatest(){const snapshot=readJSON(SNAPSHOT_KEY,null);if(!snapshot?.repositories?.length){const status=$("repoArchitectureStatus");if(status)status.textContent="Refresh the architecture before exporting.";return}const payload={...snapshot,exportedAt:nowIso(),localHistoryIndex:readJSON(HISTORY_KEY,[])};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`vnv-repository-architecture-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function autoRefreshIfNeeded(){if(!document.body.classList.contains("unlocked"))return;const cached=readJSON(SNAPSHOT_KEY,null),age=cached?.capturedAt?Date.now()-Date.parse(cached.capturedAt):Infinity;if(cached?.repositories?.length){renderSnapshot(cached,compareSnapshots(cached,cached));if($("repoArchitectureTag"))$("repoArchitectureTag").textContent="Cached snapshot"}if(!cached?.repositories?.length||!Number.isFinite(age)||age>TTL_MS)window.setTimeout(()=>refreshArchitecture(false),450)}
  function initialize(){injectStyles();if(!injectPanel())return;autoRefreshIfNeeded();const observer=new MutationObserver(()=>{if(document.body.classList.contains("unlocked"))autoRefreshIfNeeded()});observer.observe(document.body,{attributes:true,attributeFilter:["class"]});const githubButton=$("refreshGithub");if(githubButton)githubButton.addEventListener("click",()=>window.setTimeout(()=>refreshArchitecture(false),1800))}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();
