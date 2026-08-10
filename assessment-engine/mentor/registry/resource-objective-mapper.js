/* Khaemenes Curriculum ↔ Resource Objective Mapper
 * Repair 09 · deterministic, metadata-first, local/browser compatible.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.KhaemenesObjectiveMapper = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STAGE_ORDER = ["preschool","kindergarten","elementary","middle","high","higher-learning","adult"];
  const ALIGNMENT_WEIGHT = {core:5,"direct-practice":4,support:3,"transfer-practice":2,exploration:1};

  const norm = value => String(value ?? "").toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g," ").replace(/[^a-z0-9]+/g," ").trim();

  const arr = value => Array.isArray(value) ? value : value == null ? [] : [value];
  const uniq = xs => [...new Set(xs.filter(Boolean))];

  function localId(resource) {
    const id = String(resource?.id || "");
    if (!id.includes(".")) return id;
    const sourceHint = String(resource?.sourceId || "");
    if (sourceHint === "verve.arcade") return id.split(".").slice(-1)[0];
    const parts = id.split(".");
    return parts[parts.length - 1];
  }

  function stageAllowed(stage, floor, ceiling) {
    if (!stage) return true;
    const pos = STAGE_ORDER.indexOf(stage);
    if (pos < 0) return true;
    if (floor && STAGE_ORDER.includes(floor) && pos < STAGE_ORDER.indexOf(floor)) return false;
    if (ceiling && STAGE_ORDER.includes(ceiling) && pos > STAGE_ORDER.indexOf(ceiling)) return false;
    return true;
  }

  function buildAliasIndex(taxonomy) {
    const out = [];
    for (const o of taxonomy.objectives || []) {
      const aliases = uniq([o.id,o.label,...arr(o.aliases)]).map(norm).filter(Boolean);
      out.push({id:o.id, subject:o.subject, aliases, mastery:o.canContributeToMasteryEvidence !== false});
    }
    return out;
  }

  function detectObjectives(text, aliasIndex, anchors) {
    const raw = String(text || "");
    const n = norm(raw);
    const found = new Set();

    for (const item of aliasIndex) {
      for (const alias of item.aliases) {
        if (alias.length >= 4 && n.includes(alias)) { found.add(item.id); break; }
      }
    }
    for (const a of anchors || []) {
      try {
        if (new RegExp(a.pattern,"i").test(raw)) for (const id of a.objectives || []) found.add(id);
      } catch {}
    }
    return [...found];
  }

  function findOverride(resource, overrides) {
    const lid = localId(resource);
    return (overrides || []).find(o =>
      o.sourceId === resource.sourceId &&
      (o.localId === lid || String(resource.id||"").endsWith("." + o.localId))
    ) || null;
  }

  function inferResourceObjectives(resource, aliasIndex, override) {
    if (override?.objectiveIds?.length) return uniq(override.objectiveIds);
    const text = [
      resource.title,resource.description,
      ...arr(resource.skills),...arr(resource.domains),...arr(resource.tags),
      ...arr(resource.subjects),...arr(resource.learningObjectives)
    ].join(" ");
    return detectObjectives(text, aliasIndex, []);
  }

  function lessonObjectives(context, aliasIndex, anchors, stageTargets) {
    const explicit = uniq(arr(context?.objectiveIds));
    const text = [
      context?.title,context?.objective,context?.essentialQuestion,context?.concepts,
      ...arr(context?.objectives),...arr(context?.skills),...arr(context?.standards),
      ...arr(context?.subjects)
    ].join(" ");
    const detected = detectObjectives(text, aliasIndex, anchors);
    const subjectDefaults = [];
    const stage = context?.stage;
    for (const subject of arr(context?.subjects)) {
      const obj = stageTargets?.stages?.[stage]?.subjects?.[subject];
      if (obj) subjectDefaults.push(...obj);
    }
    return uniq([...explicit,...detected,...subjectDefaults]);
  }

  function preferenceSatisfied(required, prefs) {
    if (!required?.length) return true;
    const have = new Set(arr(prefs));
    return required.every(x => have.has(x));
  }

  function enrichResource(resource, data, context={}) {
    const taxonomy = data.taxonomy || {objectives:[]};
    const aliasIndex = data.aliasIndex || buildAliasIndex(taxonomy);
    const override = findOverride(resource, data.overrides?.overrides || data.overrides || []);
    const objectiveIds = inferResourceObjectives(resource, aliasIndex, override);
    const subjects = uniq([
      ...arr(resource.subjects),
      ...arr(override?.subjects),
      ...objectiveIds.map(id => aliasIndex.find(x=>x.id===id)?.subject)
    ]);
    return {
      ...resource,
      objectiveIds,
      subjects,
      objectiveAlignment: override?.alignment || (objectiveIds.length ? "support" : "unmapped"),
      objectiveMappingSource: override ? "curated-override" : (objectiveIds.length ? "metadata-inference" : "unmapped"),
      objectiveNotes: override?.notes || "",
      canCountAsMasteryEvidence: override?.canCountAsMasteryEvidence === true,
      stageFloor: override?.stageFloor || null,
      stageCeiling: override?.stageCeiling || null,
      objectiveRequiresPreferenceMatch: uniq([
        ...arr(resource.requiresPreferenceMatch),
        ...arr(override?.requiresPreferenceMatch)
      ])
    };
  }

  function scoreResource(resource, context, data) {
    const aliasIndex = data.aliasIndex || buildAliasIndex(data.taxonomy || {objectives:[]});
    const enriched = enrichResource(resource,{...data,aliasIndex},context);
    const targets = lessonObjectives(context,aliasIndex,data.anchors?.anchors || data.anchors || [],data.stageTargets);

    const reasons = [];
    const blockers = [];

    if (resource.mentorEligible === false) blockers.push("mentorEligible=false");
    if (resource.recommendable === false) blockers.push("recommendable=false");
    if (resource.requiresLinkedLearner && !context.linkedLearner) blockers.push("linked learner required");
    if (!preferenceSatisfied(enriched.objectiveRequiresPreferenceMatch,context.preferences)) blockers.push("preference match required");
    if (!stageAllowed(context.stage,enriched.stageFloor,enriched.stageCeiling)) blockers.push("stage outside curated range");
    if (context.stage && Array.isArray(resource.audiences) && resource.audiences.length && !resource.audiences.includes(context.stage) && !resource.audiences.includes("adult")) {
      blockers.push("audience mismatch");
    }

    const overlap = enriched.objectiveIds.filter(x => targets.includes(x));
    let score = overlap.length * 22;

    if (overlap.length) reasons.push(`objective match: ${overlap.join(", ")}`);

    const requestedSubjects = new Set(arr(context.subjects));
    const subjectOverlap = enriched.subjects.filter(x => requestedSubjects.has(x));
    if (subjectOverlap.length) {
      score += subjectOverlap.length * 6;
      reasons.push(`subject match: ${subjectOverlap.join(", ")}`);
    }

    const aw = ALIGNMENT_WEIGHT[enriched.objectiveAlignment] || 0;
    score += aw * 3;
    if (aw) reasons.push(`alignment: ${enriched.objectiveAlignment}`);

    if (context.stage && arr(resource.audiences).includes(context.stage)) {
      score += 5;
      reasons.push(`audience: ${context.stage}`);
    }

    if (resource.featured) score += 1;

    // Prevent broad/support resources from outranking strong direct practice just by tag density.
    if (enriched.objectiveAlignment === "support") score = Math.min(score,74);
    if (enriched.objectiveAlignment === "transfer-practice") score = Math.min(score,58);
    if (enriched.objectiveAlignment === "exploration") score = Math.min(score,48);
    if (enriched.objectiveAlignment === "unmapped") score = Math.min(score,12);

    // High-stakes guardrails.
    if (resource.highStakesDomain === "medical" && !arr(context.subjects).includes("health") && !arr(context.subjects).includes("physical-education")) {
      score -= 15;
      reasons.push("medical-domain relevance penalty");
    }

    if (blockers.length) score = -999;

    return {
      resource: enriched,
      score,
      targetObjectiveIds: targets,
      matchedObjectiveIds: overlap,
      reasons,
      blockers,
      requiresFreshnessCheck: !!resource.requiresFreshnessCheck,
      canCountAsMasteryEvidence: enriched.canCountAsMasteryEvidence && overlap.length > 0
    };
  }

  function rankResources(resources, context, data, options={}) {
    const minScore = options.minScore ?? 18;
    const max = options.max ?? 12;
    return arr(resources)
      .map(r => scoreResource(r,context,data))
      .filter(x => x.score >= minScore && !x.blockers.length)
      .sort((a,b)=>b.score-a.score || String(a.resource.title).localeCompare(String(b.resource.title)))
      .slice(0,max);
  }

  async function load(base="./") {
    const clean = String(base).replace(/\/?$/,"/");
    const [taxonomy,overrides,anchors,stageTargets] = await Promise.all([
      fetch(clean+"curriculum-objective-taxonomy.json").then(r=>r.json()),
      fetch(clean+"resource-objective-overrides.json").then(r=>r.json()),
      fetch(clean+"curriculum-lesson-anchors.json").then(r=>r.json()),
      fetch(clean+"stage-subject-objectives.json").then(r=>r.json())
    ]);
    return {taxonomy,overrides,anchors,stageTargets,aliasIndex:buildAliasIndex(taxonomy)};
  }

  return {norm,buildAliasIndex,detectObjectives,enrichResource,lessonObjectives,scoreResource,rankResources,load};
});
