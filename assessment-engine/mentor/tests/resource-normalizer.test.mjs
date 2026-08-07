import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMentorResource } from "../discovery/resource-normalizer.js";

test("policy metadata survives normalization", () => {
  const normalized = normalizeMentorResource({
    id: "news",
    title: "Current News",
    url: "https://example.invalid/news",
    mentorEligible: true,
    requiresFreshnessCheck: true,
    dynamicContent: true,
    requiresPreferenceMatch: ["faith"],
    requiresAccountAwareness: true,
    sensitiveTopics: ["election"],
    externalInformation: true,
    policyTags: ["current-info"]
  }, {
    owner: "vervenveda",
    name: "sample",
    fullName: "vervenveda/sample",
    classification: "research-information"
  }, {
    sourceId: "sample.source",
    mentorSearchable: true,
    classification: "research-information",
    audiences: ["high"]
  });

  assert.equal(normalized.requiresFreshnessCheck, true);
  assert.equal(normalized.dynamicContent, true);
  assert.deepEqual(normalized.requiresPreferenceMatch, ["faith"]);
  assert.equal(normalized.requiresAccountAwareness, true);
  assert.deepEqual(normalized.sensitiveTopics, ["election"]);
  assert.equal(normalized.externalInformation, true);
  assert.equal(normalized.policy.requiresFreshnessCheck, true);
});
