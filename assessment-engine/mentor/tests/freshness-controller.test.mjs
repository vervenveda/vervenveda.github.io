import test from "node:test";
import assert from "node:assert/strict";
import { FreshnessController } from "../search/freshness-controller.js";

const freshness = new FreshnessController();

test("stable lesson requires no freshness verification", () => {
  const result = freshness.assess({
    id: "lesson",
    requiresFreshnessCheck: false,
    dynamicContent: false
  });
  assert.equal(result.verificationRequired, false);
  assert.equal(result.verified, true);
});

test("dynamic resource requires verification without evidence", () => {
  const result = freshness.assess({
    id: "news",
    requiresFreshnessCheck: true,
    dynamicContent: true
  });
  assert.equal(result.state, "verify-before-use");
  assert.equal(result.verificationRequired, true);
});

test("session freshness evidence clears verification requirement", () => {
  const result = freshness.assess({
    id: "news",
    requiresFreshnessCheck: true,
    dynamicContent: true
  }, {
    freshnessEvidence: {
      news: { verifiedAt: "2026-08-07T15:00:00Z" }
    }
  });
  assert.equal(result.verified, true);
});
