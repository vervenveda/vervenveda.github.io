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

test("learning, authority, learner-boundary, and high-stakes metadata survive normalization", () => {
  const normalized = normalizeMentorResource({
    id: "firmament-home",
    title: "Firmament",
    url: "https://vervenveda.com/firmament.github.io/",
    mentorEligible: true,
    resourceType: "hub",
    learningValue: "supplemental",
    curricularWeight: "supplemental",
    learningObjectives: ["organize evidence", "review sources"],
    subjects: ["civics", "law"],
    highStakesDomain: "legal",
    requiresLinkedLearner: true,
    requiredStage: "high",
    policyTags: ["source-owned"]
  }, {
    owner: "vervenveda",
    name: "firmament.github.io",
    fullName: "vervenveda/firmament.github.io",
    classification: "research-information"
  }, {
    version: 1,
    sourceId: "verve.firmament",
    mentorSearchable: true,
    classification: "research-information",
    inventoryAuthority: "provisional-root-anchor",
    audiences: ["high", "adult"],
    roles: ["student", "educator"]
  });

  assert.equal(normalized.resourceType, "hub");
  assert.equal(normalized.learningValue, "supplemental");
  assert.equal(normalized.curricularWeight, "supplemental");
  assert.deepEqual(normalized.learningObjectives, ["organize evidence", "review sources"]);
  assert.deepEqual(normalized.subjects, ["civics", "law"]);
  assert.equal(normalized.highStakesDomain, "legal");
  assert.equal(normalized.inventoryAuthority, "provisional-root-anchor");
  assert.equal(normalized.requiresLinkedLearner, true);
  assert.equal(normalized.requiredStage, "high");
  assert.equal(normalized.policy.highStakesDomain, "legal");
  assert.equal(normalized.policy.requiresLinkedLearner, true);
  assert.equal(normalized.policy.requiredStage, "high");
  assert.equal(normalized.recommendable, true);
});
