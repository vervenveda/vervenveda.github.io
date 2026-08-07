import test from "node:test";
import assert from "node:assert/strict";
import { ResourceRegistry } from "../registry/resource-registry.js";
import { PreschoolResourceBridge } from "../adapters/preschool-resource-bridge.js";

test("Preschool bridge prioritizes local mentor-eligible activity", () => {
  const central = new ResourceRegistry({
    resources: [
      {
        id: "high-news",
        title: "News",
        recommendable: true,
        classification: "research-information",
        audiences: ["high"],
        roles: ["student"],
        repository: "vervenveda/theverifier.github.io",
        sourceId: "verve.verifier",
        tags: ["news"],
        mentorEligible: true
      }
    ]
  });

  const bridge = new PreschoolResourceBridge({
    centralRegistry: central,
    learner: { learnerId: "little", stage: "preschool", interests: ["numbers"] },
    activities: [
      {
        id: "numbers",
        title: "Number Garden",
        file: "games/number-garden/",
        domain: "mathematics",
        tags: ["numbers", "counting"],
        mentorEligible: true
      }
    ]
  });

  const result = bridge.find("numbers");
  assert.equal(result.recommendations[0].id, "preschool.local.numbers");
  assert.equal(result.recommendations.some(item => item.id === "high-news"), false);
});
