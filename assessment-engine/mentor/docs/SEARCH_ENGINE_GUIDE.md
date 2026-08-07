# Mentor Resource Search Guide

## Basic use

```js
import {
  ResourceRegistry,
  MentorSearch
} from "/assessment-engine/mentor/index.js";

const registry = await ResourceRegistry.fromUrls();

const search = new MentorSearch({
  registry,
  learner: {
    learnerId: "local-anonymous",
    stage: "high",
    interests: ["space", "drawing"]
  },
  role: "student"
});

const result = search.search("I need another way to practice geometry", {
  currentSchoolRepository: "vervenveda/Khaemenes_High.github.io",
  preferredMinutes: 20
});

console.log(result.recommendations);
```

## Fresh/current information

Dynamic resources are allowed to appear as possible sources, but are marked `verify-before-use` unless the caller supplies freshness evidence.

```js
search.search("What is happening in Congress today?", {
  freshnessEvidence: {
    "verve.verifier": {
      verifiedAt: new Date().toISOString()
    }
  }
});
```

The freshness evidence indicates that a calling integration has actually refreshed/verified the source for the session. The static Mentor Core does not pretend that old registry metadata is current news.

## Preference-aware resources

Resources declaring:

```json
{
  "requiresPreferenceMatch": ["faith", "quranic-study"]
}
```

are blocked from proactive recommendation unless the learner/family has a matching preference or the query explicitly asks for that material.

## Account-aware resources

Resources such as the 333 Network can declare:

```json
{
  "requiresAccountAwareness": true
}
```

They remain conditional until the calling experience confirms account/network context.

## Sovereign Agent boundary

The search sequence is:

1. Role and stage eligibility
2. Resource policy
3. Lexical/curriculum ranking
4. Freshness annotation
5. Sovereign ranking

The Sovereign Agent receives only resources that have survived the policy layer. It cannot make an Admin or stage-ineligible resource legal.

## Adaptive outcomes

The Mentor may record bounded feedback:

```js
search.recordOutcome({
  reward: 0.8,
  label: "helpful"
});
```

This uses the existing local-only Sovereign memory and never requires names or free-form learner writing.
