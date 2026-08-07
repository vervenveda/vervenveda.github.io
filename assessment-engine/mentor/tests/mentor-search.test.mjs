import test from "node:test";
import assert from "node:assert/strict";
import { ResourceRegistry } from "../registry/resource-registry.js";
import { MentorSearch } from "../search/mentor-search.js";

const registry = new ResourceRegistry({
  resources: [
    {
      id: "math-school",
      title: "Geometry Lab",
      description: "Visual geometry practice",
      recommendable: true,
      classification: "educational",
      audiences: ["high"],
      roles: ["student"],
      domains: ["mathematics"],
      skills: ["geometry"],
      tags: ["geometry", "visual"],
      repository: "vervenveda/Khaemenes_High.github.io",
      sourceId: "khaemenes.high",
      minutes: 20,
      mentorEligible: true
    },
    {
      id: "news",
      title: "Current Math News",
      description: "Changing news resource",
      recommendable: true,
      classification: "research-information",
      audiences: ["high"],
      roles: ["student"],
      domains: ["mathematics", "research"],
      skills: [],
      tags: ["news", "current-info"],
      repository: "vervenveda/theverifier.github.io",
      sourceId: "verve.verifier",
      requiresFreshnessCheck: true,
      dynamicContent: true,
      mentorEligible: true
    },
    {
      id: "faith",
      title: "Quranic Arabic",
      description: "Quranic root study",
      recommendable: true,
      classification: "educational",
      audiences: ["high"],
      roles: ["student"],
      domains: ["language-literacy"],
      skills: ["arabic"],
      tags: ["quranic-study"],
      repository: "vervenveda/Khaemenes_Linguistics.github.io",
      sourceId: "khaemenes.linguistics",
      requiresPreferenceMatch: ["faith", "quranic-study"],
      mentorEligible: true
    }
  ]
});

test("search prefers current-school geometry resource", () => {
  const search = new MentorSearch({
    registry,
    learner: {
      learnerId: "test",
      stage: "high",
      interests: ["visual"]
    },
    role: "student"
  });

  const result = search.search("practice geometry", {
    currentSchoolRepository: "vervenveda/Khaemenes_High.github.io",
    preferredMinutes: 20
  });

  assert.equal(result.recommendations[0].id, "math-school");
});

test("faith-specific resource does not appear for generic Arabic request", () => {
  const search = new MentorSearch({
    registry,
    learner: {
      learnerId: "test",
      stage: "high",
      interests: ["arabic"]
    },
    role: "student"
  });

  const result = search.search("practice Arabic");
  assert.equal(result.recommendations.some(item => item.id === "faith"), false);
});

test("explicit Quranic query permits preference-gated resource", () => {
  const search = new MentorSearch({
    registry,
    learner: {
      learnerId: "test",
      stage: "high",
      interests: ["arabic"]
    },
    role: "student"
  });

  const result = search.search("study Quranic Arabic roots");
  assert.equal(result.recommendations.some(item => item.id === "faith"), true);
});
