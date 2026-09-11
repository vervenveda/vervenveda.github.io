# Mentor Core Integration Guide

## Browser use

```js
import {
  ResourceRegistry,
  ChildMentor
} from "/assessment-engine/mentor/index.js";

const registry = await ResourceRegistry.fromUrls();

const mentor = new ChildMentor({
  registry,
  learner: {
    learnerId: "local-id",
    nickname: "Sam",
    stage: "elementary",
    interests: ["drawing", "space"],
    mentorStyleId: "nova"
  }
});

const resources = await mentor.suggestNext("practice fractions");
```

## Parent use

```js
import {
  ResourceRegistry,
  ParentMentor,
  FamilyMentorBridge
} from "/assessment-engine/mentor/index.js";

const registry = await ResourceRegistry.fromUrls();
const familyGuide = new ParentMentor({
  registry,
  learner: {
    learnerId: "local-id",
    stage: "elementary"
  }
});

const resources = await familyGuide.findFamilyResource(
  "help me understand what my child has been practicing"
);

const bridge = new FamilyMentorBridge();
const summary = bridge.buildChildSummary({
  learner,
  completed,
  domainCounts,
  feedback,
  recentResources
});
```

## Preschool adapter

Preschool remains guided and guardian-controlled. The existing Preschool Mentor can continue using local storage while gradually replacing local-only logic with these shared modules.

## Repository discovery

The GitHub Action writes:

- `registry/ecosystem-repositories.json`
- `registry/ecosystem-resources.json`

School pages consume those static generated JSON files instead of crawling GitHub directly.

## Important boundary

Automatic discovery means the system knows a repository exists. It does not mean the resource is safe or appropriate for every learner.

Recommendation requires policy eligibility.
