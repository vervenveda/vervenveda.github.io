# Repair 09 — Curriculum ↔ Resource Intelligence

## Purpose

Repair #9 connects existing games, apps, tools, readers, studios, specialist hubs, and learning portals to the Khaemenes curriculum **without pretending every resource is a course**.

The existing generated Mentor registry already exposes fields such as `learningObjectives`, `subjects`, `learningValue`, and `curricularWeight`, but many current resources do not yet populate those fields.

This repair adds a deterministic overlay beside the generated registry.

## Files

- `curriculum-objective-taxonomy.json`
  - canonical Khaemenes objective IDs;
  - aliases used to recognize lesson language and resource metadata;
  - stage and mastery-evidence flags.

- `curriculum-lesson-anchors.json`
  - curriculum language patterns derived from current Khaemenes weekly/course terminology;
  - converts titles such as “Equivalent Fractions and Visual Models” or “Forces, Motion, and Fair Tests” into canonical objective IDs.

- `stage-subject-objectives.json`
  - fallback objective families for Kindergarten, Elementary, Middle, and High subject halls.

- `resource-objective-overrides.json`
  - curated, high-confidence mappings for known resources;
  - distinguishes core, direct practice, support, transfer practice, and exploration;
  - preserves preference gating and prevents weak transfer games from being called subject mastery.

- `resource-objective-mapper.js`
  - browser/Node-compatible mapper;
  - enriches resources;
  - extracts lesson objectives;
  - ranks current registry resources;
  - honors audience, recommendability, linked-learner, preference, freshness, and high-stakes metadata.

- `objective-map-diagnostics.html`
  - loads the live `ecosystem-resources.json`;
  - reports mapped/unmapped coverage;
  - lets an educator test a lesson and inspect Mentor-style rankings.

- `resource-manifest-gaps.json`
  - records places where the ecosystem contains more material than current source manifests safely expose.

- `curriculum-context-examples.json`
  - grounded test contexts from Kindergarten, Elementary weekly titles, Middle subject halls, High science course maps, and High Health.

- `validate-objective-map.mjs`
  - local deterministic regression tests.

## Important design rule

The generated file `ecosystem-resources.json` is **not modified by hand**.

Repair 09 is an overlay. This preserves the Repair #4 registry builder as the source of normalized repository/resource inventory.

## Alignment strength

`core`
: The resource is an instructional program for the target. Evidence is allowed only where its own assessments/rubrics support it.

`direct-practice`
: The resource directly practices the target skill or concept.

`support`
: The tool supports learning, but using it is not evidence of mastery.

`transfer-practice`
: The resource exercises a transferable reasoning skill. Example: chess → planning/strategy, not “algebra.”

`exploration`
: Optional enrichment or broad discovery.

## Mentor integration pattern

Load:

```html
<script src="/assessment-engine/mentor/registry/resource-objective-mapper.js"></script>
```

Then:

```js
const data = await KhaemenesObjectiveMapper.load(
  "/assessment-engine/mentor/registry/"
);

const registry = await fetch(
  "/assessment-engine/mentor/registry/ecosystem-resources.json"
).then(r => r.json());

const ranked = KhaemenesObjectiveMapper.rankResources(
  registry.resources,
  {
    stage: "elementary",
    subjects: ["science"],
    title: "Forces, Motion, and Fair Tests",
    objective: "Investigate force and motion with data.",
    linkedLearner: true,
    preferences: []
  },
  data
);
```

## Source ownership

This map does not transfer authority.

Arcade still owns Arcade games.
Elementary still owns its K–5 labs.
Medicament still owns the High School Health Academy.
ARSHIF still owns archive/reference courses.
Solanar, River-to-Road, Bazaar Art, Firmament, etc. remain source authorities for their own inventories.

## Next Repair

Repair #10 should add Matrix validation for:
- stale manifest URLs;
- orphan apps;
- unmanifested repositories;
- duplicate authorities;
- broken routes;
- objective-map references to missing resources/objectives.
