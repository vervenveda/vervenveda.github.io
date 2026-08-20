/* Verve N Veda Beta Program Coverage · Admin module v1.2.0 */
(() => {
  "use strict";

  const URL = "https://vervenveda.com/beta/COVERAGE.json";
  const FALLBACK = "../beta/COVERAGE.json";
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;

  function normalizeRow(row){
    const status = String(row?.status || "review");
    return {
      surface: row?.surface || row?.name || row?.repository || "Unknown surface",
      repository: row?.repository || "",
      branch: row?.branch || "main",
      status,
      mechanism: row?.mechanism || "Repository-local Beta index coverage workflow",
      scope: row?.scope || row?.note || "Visible public index surfaces",
      directIndexCount: num(row?.directIndexCount ?? row?.coveredIndexPages),
      unresolved: num(row?.unresolved ?? row?.unresolvedVisibleIndexSurfaces)
    };
  }

  function normalizeRegistry(data){
    const source = Array.isArray(data?.coverage)
      ? data.coverage
      : (Array.isArray(data?.surfaces) ? data.surfaces : null);

    if(!source) throw new Error("invalid coverage registry");

    const rows = source.map(normalizeRow);
    const direct = num(data?.summary?.directIndexSurfacesCovered) ||
      rows.reduce((n, r) => n + r.directIndexCount, 0);
    const unresolved = num(data?.summary?.unresolvedVisibleIndexSurfacesInTrackedRepositories) ||
      rows.reduce((n, r) => n + r.unresolved, 0);
    const held = num(data?.summary?.releaseHoldRepositories) ||
      rows.filter(r => /release-hold|hardening-branch/.test(r.status)).length;

    return {
      ...data,
      coverage: rows,
      summary: {
        ...(data.summary || {}),
        trackedRepositories: num(data?.summary?.trackedRepositories) || rows.length,
        directIndexSurfacesCovered: direct,
        unresolvedVisibleIndexSurfacesInTrackedRepositories: unresolved,
        releaseHoldRepositories: held
      }
    };
  }

  async function readCoverage(){
    let lastError = null;
    for(const url of [URL, FALLBACK]){
      try{
        const res = await fetch(url, {
          cache:"no-store",
          credentials:"omit",
          headers:{Accept:"application/json"}
        });
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return normalizeRegistry(await res.json());
      }catch(error){
        lastError = error;
      }
    }
    throw lastError || new Error("coverage unavailable");
  }

  function styles(){
    if($("betaCoverageStyles")) return;
    const s = document.createElement("style");
    s.id = "betaCoverageStyles";
    s.textContent = `
      .beta-cover-panel{margin-top:14px}.beta-cover-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:12px}
      .beta-cover-stat{padding:14px;border:1px solid #293f55;border-radius:9px;background:#0b1724;text-align:center}.beta-cover-stat span{display:block;color:#8497a8;font-size:8px;font-weight:750;letter-spacing:.1em;text-transform:uppercase}.beta-cover-stat strong{display:block;margin-top:7px;color:#fff;font:500 30px/1 var(--display,Georgia,serif)}
      .beta-cover-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.beta-cover-row{padding:11px;border:1px solid #293f55;border-radius:8px;background:#0d1926}.beta-cover-row strong{display:block;font-size:10px}.beta-cover-row small{display:block;margin-top:4px;color:#758899;font-size:8.5px;line-height:1.45}.beta-cover-badge{display:inline-flex;margin-top:7px;padding:3px 6px;border:1px solid #38516a;border-radius:999px;color:#a9bccb;font-size:7.5px}.beta-cover-badge.ok{border-color:#315d43;color:#bfe1ca}.beta-cover-badge.warn{border-color:#745f36;color:#ead19e}.beta-cover-count{color:#9fc5dd}
      body[data-theme="light"] .beta-cover-stat,body[data-theme="light"] .beta-cover-row{color:#14212b;background:#fff;border-color:#d1dbe3}body[data-theme="light"] .beta-cover-stat strong{color:#14212b}body[data-theme="light"] .beta-cover-row small{color:#697b89}
      @media(max-width:900px){.beta-cover-metrics,.beta-cover-list{grid-template-columns:1fr 1fr}}@media(max-width:560px){.beta-cover-metrics,.beta-cover-list{grid-template-columns:1fr}}
    `;
    document.head.append(s);
  }

  function inject(){
    if($("betaCoveragePanel")) return true;
    const beta = $("view-beta");
    if(!beta) return false;

    const panel = document.createElement("article");
    panel.className = "panel beta-cover-panel";
    panel.id = "betaCoveragePanel";
    panel.innerHTML = `
      <div class="panel-head"><div><h2>Beta Program Coverage</h2><p>Tracks direct Beta doorway coverage across visible homework, course, assessment, game, tool and interactive index surfaces.</p></div><span class="panel-tag" id="betaCoverageTag">Loading</span></div>
      <div class="beta-cover-metrics">
        <div class="beta-cover-stat"><span>Tracked Repositories</span><strong id="betaCoverTotal">—</strong></div>
        <div class="beta-cover-stat"><span>Direct Index Surfaces</span><strong id="betaCoverIndexes">—</strong></div>
        <div class="beta-cover-stat"><span>Unresolved Visible</span><strong id="betaCoverPending">—</strong></div>
        <div class="beta-cover-stat"><span>Release Holds</span><strong id="betaCoverHeld">—</strong></div>
      </div>
      <div class="beta-cover-list" id="betaCoverageList"></div>
      <p class="safety-note" id="betaCoverageNote">Coverage reporting contains public route/status counts only. Beta source attribution excludes learner IDs, family IDs, grades, answers, form values, query strings, URL hashes, browser storage and credentials.</p>`;
    beta.append(panel);
    return true;
  }

  function isCovered(status){
    return status === "covered" || /^covered[-_]/.test(status);
  }

  function render(data){
    const rows = data.coverage || [];
    const summary = data.summary || {};
    const held = num(summary.releaseHoldRepositories) ||
      rows.filter(x => /release-hold|hardening-branch/.test(String(x.status || ""))).length;
    const unresolved = num(summary.unresolvedVisibleIndexSurfacesInTrackedRepositories) ||
      rows.reduce((n, r) => n + num(r.unresolved), 0);
    const direct = num(summary.directIndexSurfacesCovered) ||
      rows.reduce((n, r) => n + num(r.directIndexCount), 0);

    $("betaCoverTotal").textContent = num(summary.trackedRepositories) || rows.length;
    $("betaCoverIndexes").textContent = direct.toLocaleString();
    $("betaCoverPending").textContent = unresolved.toLocaleString();
    $("betaCoverHeld").textContent = held.toLocaleString();
    $("betaCoverageTag").textContent = `Updated ${data.updatedAt || "—"}`;

    $("betaCoverageList").innerHTML = rows.map(r => {
      const ok = isCovered(String(r.status || ""));
      const heldRow = /release-hold|hardening-branch/.test(String(r.status || ""));
      const label = heldRow ? "Covered · release held" : (ok ? "Covered" : "Review");
      const count = num(r.directIndexCount);
      const repo = r.repository ? `<br>${esc(r.repository)} · ${esc(r.branch || "main")}` : "";
      return `<div class="beta-cover-row"><strong>${esc(r.surface)}</strong><small>${esc(r.mechanism || "")}${repo}<br>${esc(r.scope || "")}${count ? `<br><span class="beta-cover-count">${count.toLocaleString()} direct index surfaces</span>` : ""}</small><span class="beta-cover-badge ${ok ? "ok" : "warn"}">${esc(label)}</span></div>`;
    }).join("");
  }

  async function refresh(){
    if(!inject()) return;
    try{
      render(await readCoverage());
    }catch(error){
      $("betaCoverageTag").textContent = "Coverage unavailable";
      $("betaCoverageList").innerHTML = `<div class="empty">${esc(error?.message || error)}</div>`;
    }
  }

  function init(){
    styles();
    inject();
    refresh();
    document.addEventListener("vnv:repository-architecture-updated", refresh);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
