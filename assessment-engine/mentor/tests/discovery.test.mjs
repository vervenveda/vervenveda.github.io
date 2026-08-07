import test from "node:test";
import assert from "node:assert/strict";
import { classifyRepository } from "../discovery/repository-classifier.js";

test("Admin repository is restricted", () => {
  const result = classifyRepository({
    name: "admin.github.io",
    full_name: "vervenveda/admin.github.io",
    owner: { login: "vervenveda" }
  });
  assert.equal(result.classification, "admin-only");
  assert.equal(result.recommendable, false);
});

test("Campaign account is segregated", () => {
  const result = classifyRepository({
    name: "policies.github.io",
    full_name: "JenniferPearl2028/policies.github.io",
    owner: { login: "JenniferPearl2028" }
  });
  assert.equal(result.classification, "campaign");
  assert.equal(result.recommendable, false);
});

test("Khaemenes repository is recognized as educational", () => {
  const result = classifyRepository({
    name: "Khaemenes_High.github.io",
    full_name: "vervenveda/Khaemenes_High.github.io",
    owner: { login: "vervenveda" }
  });
  assert.equal(result.classification, "educational");
});
