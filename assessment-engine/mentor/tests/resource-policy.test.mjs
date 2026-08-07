import test from "node:test";
import assert from "node:assert/strict";
import { evaluateResourcePolicy } from "../safety/resource-policy.js";

const base = {
  id: "r",
  title: "Resource",
  recommendable: true,
  classification: "educational",
  tags: []
};

test("Admin is blocked regardless of query", () => {
  const result = evaluateResourcePolicy({
    ...base,
    classification: "admin-only"
  }, { role: "parent", query: "admin" });

  assert.equal(result.allowed, false);
});

test("faith-specific resource requires family preference or explicit query", () => {
  const resource = {
    ...base,
    title: "Quran Root Explorer",
    requiresPreferenceMatch: ["faith", "quranic-study"],
    tags: ["arabic", "quranic-study"]
  };

  const proactive = evaluateResourcePolicy(resource, {
    learner: { interests: ["arabic"] },
    query: "practice Arabic"
  });
  assert.equal(proactive.allowed, false);

  const explicit = evaluateResourcePolicy(resource, {
    learner: { interests: ["arabic"] },
    query: "Quranic Arabic root study"
  });
  assert.equal(explicit.allowed, true);
});

test("dynamic resource is conditional until freshness is handled downstream", () => {
  const result = evaluateResourcePolicy({
    ...base,
    requiresFreshnessCheck: true,
    dynamicContent: true
  }, { query: "latest news" });

  assert.equal(result.allowed, true);
  assert.equal(result.policyState, "conditional");
  assert.ok(result.requirements.includes("freshness-verification"));
});

test("account-aware network resource is conditional without account context", () => {
  const result = evaluateResourcePolicy({
    ...base,
    requiresAccountAwareness: true
  }, { query: "333 Network", accountAware: false });

  assert.equal(result.allowed, true);
  assert.equal(result.policyState, "conditional");
  assert.ok(result.requirements.includes("account-awareness"));
});
