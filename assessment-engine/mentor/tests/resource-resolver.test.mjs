import test from "node:test";
import assert from "node:assert/strict";
import { ResourceRegistry } from "../registry/resource-registry.js";
import { ResourceResolver } from "../registry/resource-resolver.js";

const registry = new ResourceRegistry({
  resources: [
    {
      id: "math-1",
      title: "Fraction Garden",
      recommendable: true,
      classification: "educational",
      audiences: ["elementary"],
      roles: ["student","parent"],
      domains: ["mathematics"],
      skills: ["fractions"]
    },
    {
      id: "admin-1",
      title: "Admin Console",
      recommendable: true,
      classification: "admin-only",
      audiences: ["adult"],
      roles: ["parent"]
    },
    {
      id: "campaign-1",
      title: "Campaign Policies",
      recommendable: true,
      classification: "campaign",
      explicitAdultOptIn: true,
      audiences: ["adult","parent"],
      roles: ["parent"]
    }
  ]
});

test("Elementary student can receive educational resource", () => {
  const resolver = new ResourceResolver({ registry });
  const result = resolver.resolve({
    query: "fractions",
    learner: { stage: "elementary", interests: [] },
    role: "student"
  });
  assert.equal(result[0].id, "math-1");
});

test("Admin resource is never recommended", () => {
  const resolver = new ResourceResolver({ registry });
  const result = resolver.resolve({
    query: "admin",
    learner: { stage: "adult", interests: [] },
    role: "parent",
    includeAdultResources: true
  });
  assert.equal(result.some(item => item.id === "admin-1"), false);
});
