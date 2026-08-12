/* Verve N Veda Admin · Integrity Review Panel
   Local reviewer interface for sanitized Creative Spark integrity records.

   This module injects one Integrity view into the existing admin portal.
   It does not alter the administrator gate, does not perform network transport,
   and does not modify Creative Spark memory, canon, or truth findings.

   Immediate intake:
     - JSON import
     - window.VNVIntegrityReviewPanel.ingest(record)
     - window.VNVIntegrityReviewPanel.ingestMany(records)

   Future bridge:
     a bridge may call the same ingest/ingestMany API with sanitized records.
*/

(() => {
  "use strict";

  if (typeof document === "undefined" || typeof window === "undefined") return;

  const SCHEMA_VERSION = 1;
  const STORAGE_KEY = "VNV_ADMIN_INTEGRITY_REVIEWS_V1";
  const PANEL_EVENT = "verve-admin:integrity-review-ingested";

  const STATES = [
    "open",
    "in-review",
    "resolved",
    "dismissed",
    "corrected"
  ];

  const DISPOSITIONS = [
    "",
    "substantiated",
    "partially-substantiated",
    "unsubstantiated",
    "misclassified",
    "context-dependent",
    "duplicative",
    "inconclusive",
    "resolved-no-further-action"
  ];

  let queue = [];
  let selectedId = "";

  function now() {
    return new Date().toISOString();
  }

  function uid(prefix = "review") {
    if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`;
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  }

  function clean(value, max = 3000) {
    return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function clone(value) {
    if (value == null) return value;
    if (typeof structuredClone === "function") {
      try { return structuredClone(value); } catch {}
    }
    return JSON.parse(JSON.stringify(value));
  }

  function safe(value, depth = 0) {
    if (depth > 5) return "[depth-limit]";
    if (value == null) return value;
    if (typeof value === "string") return clean(value, 1600);
    if (typeof value === "number" || typeof value === "boolean") return value;

    if (Array.isArray(value)) {
      return value.slice(0, 100).map(item => safe(item, depth + 1));
    }

    if (typeof value === "object") {
      const out = {};
      let count = 0;
      for (const [key, item] of Object.entries(value)) {
        if (count >= 120) break;
        count += 1;
        out[clean(key, 120)] = safe(item, depth + 1);
      }
      return out;
    }

    return clean(value, 500);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function readQueue() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      queue = Array.isArray(parsed) ? parsed : [];
    } catch {
      queue = [];
    }
  }

  function writeQueue() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(0, 5000)));
  }

  function normalizeReview(record = {}) {
    const raw = safe(record);
    let reviewType = clean(raw.reviewType, 40);

    if (!["abuse", "truth"].includes(reviewType)) {
      if (raw.incidentId || raw.categories || raw.severity) reviewType = "abuse";
      else if (raw.evaluationId || raw.claimId || raw.promotion) reviewType = "truth";
      else reviewType = "truth";
    }

    const sourceReference = clean(
      raw.sourceReference ||
      raw.incidentId ||
      raw.evaluationId ||
      raw.reviewId ||
      "",
      220
    );

    const existingReviewId = clean(raw.reviewId, 220);
    const reviewId = existingReviewId || uid(`admin_${reviewType}`);

    const state = STATES.includes(raw.state) ? raw.state : "open";
    const disposition = DISPOSITIONS.includes(raw.disposition)
      ? raw.disposition
      : "";

    return {
      schemaVersion: SCHEMA_VERSION,
      reviewId,
      reviewType,
      namespace: clean(raw.namespace || "creative-spark", 120),
      createdAt: clean(raw.createdAt || now(), 100),
      updatedAt: clean(raw.updatedAt || raw.createdAt || now(), 100),
      state,
      disposition,
      reviewer: clean(raw.reviewer, 220),
      reviewedAt: clean(raw.reviewedAt, 100),
      rationale: clean(raw.rationale, 5000),
      correctionNote: clean(raw.correctionNote, 5000),
      sourceReference,
      sessionId: clean(raw.sessionId, 220),
      traceId: clean(raw.traceId, 220),
      orchestrationId: clean(raw.orchestrationId, 220),
      severity: clean(raw.severity, 80),
      categories: Array.isArray(raw.categories)
        ? raw.categories.map(item => clean(item, 120)).slice(0, 50)
        : [],
      summary: safe(raw.summary || raw),
      originalSanitizedReport: safe(raw.originalSanitizedReport || raw),
      history: Array.isArray(raw.history)
        ? raw.history.slice(-200).map(safe)
        : [{
            at: now(),
            action: "admin-intake-created",
            by: "system"
          }]
    };
  }

  function ingest(record = {}) {
    const normalized = normalizeReview(record);

    const duplicateIndex = queue.findIndex(item =>
      item.reviewId === normalized.reviewId ||
      (
        normalized.sourceReference &&
        item.sourceReference === normalized.sourceReference &&
        item.reviewType === normalized.reviewType
      )
    );

    if (duplicateIndex >= 0) {
      const existing = queue[duplicateIndex];
      queue[duplicateIndex] = {
        ...existing,
        ...normalized,
        reviewId: existing.reviewId,
        createdAt: existing.createdAt,
        history: [
          ...(Array.isArray(existing.history) ? existing.history : []),
          {
            at: now(),
            action: "intake-refreshed",
            by: "system"
          }
        ].slice(-200)
      };
      selectedId = queue[duplicateIndex].reviewId;
    } else {
      queue.unshift(normalized);
      selectedId = normalized.reviewId;
    }

    queue = queue.slice(0, 5000);
    writeQueue();
    render();

    try {
      window.dispatchEvent(new CustomEvent(PANEL_EVENT, {
        detail: {
          reviewId: selectedId,
          reviewType: normalized.reviewType,
          sourceReference: normalized.sourceReference
        }
      }));
    } catch {}

    return clone(queue.find(item => item.reviewId === selectedId));
  }

  function ingestMany(records = []) {
    if (!Array.isArray(records)) return [];
    const added = [];
    records.slice(0, 5000).forEach(record => {
      const item = ingest(record);
      if (item) added.push(item);
    });
    return added;
  }

  function findSelected() {
    return queue.find(item => item.reviewId === selectedId) || null;
  }

  function optionList(values, current) {
    return values.map(value => {
      const label = value || "—";
      return `<option value="${escapeHTML(value)}"${value === current ? " selected" : ""}>${escapeHTML(label)}</option>`;
    }).join("");
  }

  function formatDate(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? clean(value, 100) : d.toLocaleString();
  }

  function injectStyles() {
    if (document.getElementById("integrityReviewStyles")) return;

    const style = document.createElement("style");
    style.id = "integrityReviewStyles";
    style.textContent = `
      .integrity-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}
      .integrity-stat{padding:16px;border:1px solid #263a50;border-radius:10px;background:#0d1926}
      .integrity-stat span{display:block;color:#8395a7;font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
      .integrity-stat strong{display:block;margin-top:8px;color:#fff;font:500 28px/1 var(--display)}
      .integrity-layout{display:grid;grid-template-columns:minmax(320px,.9fr) minmax(380px,1.1fr);gap:14px}
      .integrity-list{display:grid;gap:8px;max-height:650px;overflow:auto;padding-right:3px}
      .integrity-item{width:100%;padding:12px;border:1px solid #263a50;border-radius:9px;color:inherit;background:#0b1725;text-align:left}
      .integrity-item:hover,.integrity-item.active{border-color:#8d7243;background:#111f30}
      .integrity-item-top{display:flex;justify-content:space-between;gap:10px;align-items:center}
      .integrity-kind{color:var(--gold2);font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
      .integrity-state{padding:3px 6px;border:1px solid #30465d;border-radius:999px;color:#9fb0bf;font-size:8px;text-transform:uppercase}
      .integrity-item strong{display:block;margin-top:7px;font-size:11px;line-height:1.35}
      .integrity-item small{display:block;margin-top:5px;color:#748596;font-size:9px;line-height:1.4}
      .integrity-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .integrity-field{display:grid;gap:5px}
      .integrity-field.full{grid-column:1/-1}
      .integrity-field label{color:#8fa0af;font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
      .integrity-input,.integrity-textarea,.integrity-select{width:100%;border:1px solid #30455c;border-radius:7px;color:#eef2f6;background:#0b1724}
      .integrity-input,.integrity-select{min-height:40px;padding:0 10px}
      .integrity-textarea{min-height:100px;padding:10px;resize:vertical}
      .integrity-summary{margin-top:12px;padding:12px;border:1px solid #263a50;border-radius:8px;background:#091522}
      .integrity-summary pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#aebdca;font:9px/1.55 var(--mono)}
      .integrity-empty{padding:32px;border:1px dashed #30465d;border-radius:9px;color:#7e91a2;text-align:center;font-size:10px}
      .integrity-note{margin-top:10px;color:#7d8fa0;font-size:9px;line-height:1.55}
      .integrity-file{display:none}
      @media(max-width:1050px){.integrity-layout{grid-template-columns:1fr}.integrity-metrics{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:560px){.integrity-detail-grid,.integrity-metrics{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function injectNav() {
    if (document.querySelector('[data-view="integrity-review"]')) return;

    const nav = document.querySelector(".nav");
    if (!nav) return;

    const button = document.createElement("button");
    button.className = "nav-button";
    button.type = "button";
    button.dataset.view = "integrity-review";
    button.innerHTML = `
      <span class="nav-icon">◇</span>
      <span class="nav-label">Integrity</span>
      <span class="nav-count" id="navIntegrityCount">0</span>
    `;

    const settingsButton = nav.querySelector('[data-view="settings"]');
    if (settingsButton) nav.insertBefore(button, settingsButton);
    else nav.appendChild(button);

    button.addEventListener("click", () => activateView());
  }

  function injectView() {
    if (document.getElementById("view-integrity-review")) return;

    const main = document.querySelector("#adminRoot main");
    if (!main) return;

    const section = document.createElement("section");
    section.className = "view";
    section.id = "view-integrity-review";
    section.dataset.viewPanel = "integrity-review";

    section.innerHTML = `
      <div class="view-head">
        <div>
          <p class="eyebrow">Human Review</p>
          <h1>Integrity Review</h1>
          <p>Review sanitized abuse and evidence-integrity records. Detection is not punishment; disputed findings remain reviewable and correctable.</p>
        </div>
      </div>

      <div class="integrity-metrics">
        <article class="integrity-stat"><span>Open</span><strong id="integrityMetricOpen">0</strong></article>
        <article class="integrity-stat"><span>Abuse</span><strong id="integrityMetricAbuse">0</strong></article>
        <article class="integrity-stat"><span>Truth</span><strong id="integrityMetricTruth">0</strong></article>
        <article class="integrity-stat"><span>Corrected</span><strong id="integrityMetricCorrected">0</strong></article>
      </div>

      <div class="toolbar-row">
        <select class="select" id="integrityTypeFilter">
          <option value="">All Review Types</option>
          <option value="abuse">Abuse / Conditioning</option>
          <option value="truth">Truth / Evidence</option>
        </select>
        <select class="select" id="integrityStateFilter">
          <option value="">All States</option>
          ${STATES.map(state => `<option value="${state}">${state}</option>`).join("")}
        </select>
        <input class="search" id="integritySearch" type="search" placeholder="Search review, category, claim, reference…">
        <button class="action-btn" id="integrityImportBtn" type="button">Import JSON</button>
        <button class="action-btn" id="integrityExportBtn" type="button">Export Queue</button>
        <input class="integrity-file" id="integrityImportFile" type="file" accept="application/json,.json">
      </div>

      <div class="integrity-layout">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2>Review Queue</h2>
              <p>Sanitized integrity records stored in this browser.</p>
            </div>
            <span class="panel-tag" id="integrityQueueTag">0 records</span>
          </div>
          <div class="integrity-list" id="integrityReviewList"></div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h2>Human Disposition</h2>
              <p>Preserve the original report while recording human review separately.</p>
            </div>
            <span class="panel-tag" id="integrityDetailTag">No selection</span>
          </div>

          <div id="integrityDetailEmpty" class="integrity-empty">Select a review record from the queue.</div>

          <form id="integrityReviewForm" hidden>
            <div class="integrity-detail-grid">
              <div class="integrity-field">
                <label for="integrityReviewState">State</label>
                <select class="integrity-select" id="integrityReviewState"></select>
              </div>
              <div class="integrity-field">
                <label for="integrityDisposition">Disposition</label>
                <select class="integrity-select" id="integrityDisposition"></select>
              </div>
              <div class="integrity-field full">
                <label for="integrityReviewer">Reviewer</label>
                <input class="integrity-input" id="integrityReviewer" autocomplete="off">
              </div>
              <div class="integrity-field full">
                <label for="integrityRationale">Rationale</label>
                <textarea class="integrity-textarea" id="integrityRationale"></textarea>
              </div>
              <div class="integrity-field full">
                <label for="integrityCorrection">Correction Note</label>
                <textarea class="integrity-textarea" id="integrityCorrection"></textarea>
              </div>
            </div>

            <div class="toolbar-row" style="margin-top:12px">
              <button class="action-btn green" type="submit">Save Review</button>
              <button class="action-btn" id="integrityMarkCorrected" type="button">Mark Corrected</button>
            </div>

            <div class="integrity-summary">
              <pre id="integritySummary"></pre>
            </div>
            <p class="integrity-note">This panel records review and correction only. It does not punish users, rewrite AI memory, modify canon, or override evidence automatically.</p>
          </form>
        </article>
      </div>
    `;

    main.appendChild(section);
  }

  function activateView() {
    document.querySelectorAll(".nav-button").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.view === "integrity-review"
      );
    });

    document.querySelectorAll(".view").forEach(view => {
      view.classList.toggle(
        "active",
        view.dataset.viewPanel === "integrity-review"
      );
    });

    const title = document.getElementById("topbarViewTitle");
    if (title) title.textContent = "Integrity Review";

    render();
  }

  function filteredQueue() {
    const type = document.getElementById("integrityTypeFilter")?.value || "";
    const state = document.getElementById("integrityStateFilter")?.value || "";
    const search = clean(
      document.getElementById("integritySearch")?.value || "",
      500
    ).toLowerCase();

    return queue.filter(item => {
      if (type && item.reviewType !== type) return false;
      if (state && item.state !== state) return false;
      if (!search) return true;

      const haystack = JSON.stringify({
        reviewId: item.reviewId,
        reviewType: item.reviewType,
        sourceReference: item.sourceReference,
        severity: item.severity,
        categories: item.categories,
        state: item.state,
        disposition: item.disposition,
        summary: item.summary
      }).toLowerCase();

      return haystack.includes(search);
    });
  }

  function renderMetrics() {
    const open = queue.filter(item => item.state === "open" || item.state === "in-review").length;
    const abuse = queue.filter(item => item.reviewType === "abuse").length;
    const truth = queue.filter(item => item.reviewType === "truth").length;
    const corrected = queue.filter(item => item.state === "corrected").length;

    const values = {
      integrityMetricOpen: open,
      integrityMetricAbuse: abuse,
      integrityMetricTruth: truth,
      integrityMetricCorrected: corrected,
      navIntegrityCount: open
    };

    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value);
    });
  }

  function recordTitle(item) {
    if (item.reviewType === "abuse") {
      const cats = Array.isArray(item.categories) ? item.categories.join(", ") : "";
      return cats || item.summary?.category || "Abuse integrity review";
    }

    return (
      item.summary?.claimId ||
      item.originalSanitizedReport?.claimId ||
      "Truth / evidence review"
    );
  }

  function recordSubtitle(item) {
    if (item.reviewType === "abuse") {
      return [
        item.severity ? `Severity: ${item.severity}` : "",
        item.sourceReference ? `Ref: ${item.sourceReference}` : ""
      ].filter(Boolean).join(" · ");
    }

    return [
      item.summary?.status ? `Status: ${item.summary.status}` : "",
      item.summary?.promotion ? `Promotion: ${item.summary.promotion}` : "",
      item.sourceReference ? `Ref: ${item.sourceReference}` : ""
    ].filter(Boolean).join(" · ");
  }

  function renderList() {
    const list = document.getElementById("integrityReviewList");
    const tag = document.getElementById("integrityQueueTag");
    if (!list) return;

    const records = filteredQueue();
    if (tag) tag.textContent = `${records.length} record${records.length === 1 ? "" : "s"}`;

    if (!records.length) {
      list.innerHTML = `<div class="integrity-empty">No review records match the current filters.</div>`;
      return;
    }

    list.innerHTML = records.map(item => `
      <button class="integrity-item${item.reviewId === selectedId ? " active" : ""}"
              type="button"
              data-integrity-id="${escapeHTML(item.reviewId)}">
        <div class="integrity-item-top">
          <span class="integrity-kind">${escapeHTML(item.reviewType)}</span>
          <span class="integrity-state">${escapeHTML(item.state)}</span>
        </div>
        <strong>${escapeHTML(recordTitle(item))}</strong>
        <small>${escapeHTML(recordSubtitle(item))}</small>
        <small>${escapeHTML(formatDate(item.updatedAt || item.createdAt))}</small>
      </button>
    `).join("");

    list.querySelectorAll("[data-integrity-id]").forEach(button => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.integrityId;
        render();
      });
    });
  }

  function renderDetail() {
    const item = findSelected();
    const empty = document.getElementById("integrityDetailEmpty");
    const form = document.getElementById("integrityReviewForm");
    const tag = document.getElementById("integrityDetailTag");
    if (!empty || !form) return;

    if (!item) {
      empty.hidden = false;
      form.hidden = true;
      if (tag) tag.textContent = "No selection";
      return;
    }

    empty.hidden = true;
    form.hidden = false;
    if (tag) tag.textContent = item.reviewType;

    document.getElementById("integrityReviewState").innerHTML =
      optionList(STATES, item.state);
    document.getElementById("integrityDisposition").innerHTML =
      optionList(DISPOSITIONS, item.disposition);
    document.getElementById("integrityReviewer").value = item.reviewer || "";
    document.getElementById("integrityRationale").value = item.rationale || "";
    document.getElementById("integrityCorrection").value = item.correctionNote || "";

    document.getElementById("integritySummary").textContent = JSON.stringify({
      reviewId: item.reviewId,
      reviewType: item.reviewType,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      sourceReference: item.sourceReference,
      severity: item.severity,
      categories: item.categories,
      summary: item.summary,
      history: item.history
    }, null, 2);
  }

  function render() {
    renderMetrics();
    renderList();
    renderDetail();
  }

  function saveSelected({ markCorrected = false } = {}) {
    const item = findSelected();
    if (!item) return;

    const state = markCorrected
      ? "corrected"
      : document.getElementById("integrityReviewState").value;

    const disposition = markCorrected
      ? "misclassified"
      : document.getElementById("integrityDisposition").value;

    item.state = STATES.includes(state) ? state : item.state;
    item.disposition = DISPOSITIONS.includes(disposition)
      ? disposition
      : item.disposition;
    item.reviewer = clean(document.getElementById("integrityReviewer").value, 220);
    item.rationale = clean(document.getElementById("integrityRationale").value, 5000);
    item.correctionNote = clean(document.getElementById("integrityCorrection").value, 5000);
    item.updatedAt = now();

    if (["resolved", "dismissed", "corrected"].includes(item.state)) {
      item.reviewedAt = now();
    }

    item.history = Array.isArray(item.history) ? item.history : [];
    item.history.push({
      at: now(),
      action: markCorrected ? "marked-corrected" : "human-review-updated",
      by: item.reviewer || "human-reviewer",
      state: item.state,
      disposition: item.disposition
    });
    item.history = item.history.slice(-200);

    writeQueue();
    render();
  }

  function exportQueue() {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      source: "verve-n-veda-admin-integrity-review",
      reviews: queue
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "verve-n-veda-integrity-reviews.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function importFile(file) {
    if (!file) return;

    const text = await file.text();
    const parsed = JSON.parse(text);

    let records = [];
    if (Array.isArray(parsed)) records = parsed;
    else if (Array.isArray(parsed.reviews)) records = parsed.reviews;
    else if (Array.isArray(parsed.records)) records = parsed.records;
    else records = [parsed];

    ingestMany(records);
  }

  function wire() {
    document.getElementById("integrityTypeFilter")?.addEventListener("change", render);
    document.getElementById("integrityStateFilter")?.addEventListener("change", render);
    document.getElementById("integritySearch")?.addEventListener("input", render);

    const fileInput = document.getElementById("integrityImportFile");

    document.getElementById("integrityImportBtn")?.addEventListener("click", () => {
      if (fileInput) {
        fileInput.value = "";
        fileInput.click();
      }
    });

    fileInput?.addEventListener("change", async () => {
      try {
        await importFile(fileInput.files?.[0]);
      } catch (error) {
        alert(`Could not import integrity review JSON: ${clean(error?.message || error, 500)}`);
      }
    });

    document.getElementById("integrityExportBtn")?.addEventListener("click", exportQueue);

    document.getElementById("integrityReviewForm")?.addEventListener("submit", event => {
      event.preventDefault();
      saveSelected();
    });

    document.getElementById("integrityMarkCorrected")?.addEventListener("click", () => {
      saveSelected({ markCorrected: true });
    });
  }

  function init() {
    readQueue();
    injectStyles();
    injectNav();
    injectView();
    wire();
    render();

    window.VNVIntegrityReviewPanel = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      ingest,
      ingestMany,
      list: () => clone(queue),
      get: reviewId => clone(queue.find(item => item.reviewId === clean(reviewId, 220)) || null),
      exportQueue,
      activate: activateView,
      status: () => ({
        schemaVersion: SCHEMA_VERSION,
        storage: "localStorage",
        records: queue.length,
        open: queue.filter(item => item.state === "open" || item.state === "in-review").length,
        networkTransport: false,
        altersAdminGate: false,
        performsPunitiveAction: false,
        mutatesAIMemory: false,
        mutatesCanon: false,
        overridesTruthFindings: false,
        importExport: true,
        futureBridgeIntakeReady: true
      })
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
