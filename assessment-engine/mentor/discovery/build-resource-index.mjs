import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverRepositories } from "./repository-discovery.js";
import { loadMentorManifest } from "./manifest-loader.js";
import { normalizeMentorResource } from "./resource-normalizer.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const mentorRoot = path.resolve(here, "..");
const accountsPath = path.join(here, "accounts.json");
const reposPath = path.join(mentorRoot, "registry", "ecosystem-repositories.json");
const resourcesPath = path.join(mentorRoot, "registry", "ecosystem-resources.json");
const token = process.env.GITHUB_TOKEN || "";

const accounts = JSON.parse(await fs.readFile(accountsPath, "utf8"));
const repositories = await discoverRepositories(accounts.accounts || [], { token });

const latestRepositoryTimestamp = repositories
  .map(repo => repo.pushedAt || repo.updatedAt || repo.createdAt)
  .filter(Boolean)
  .sort()
  .at(-1) || null;

// generatedAt is the time this registry snapshot was actually built.
// The newest repository timestamp is retained separately as source metadata.
const generatedAt = new Date().toISOString();
const resources = [];

for (const repoRecord of repositories) {
  if (repoRecord.archived || repoRecord.disabled) {
    repoRecord.discoveryStatus = "archived";
    repoRecord.recommendable = false;
    repoRecord.reason = "Repository is archived or disabled.";
    continue;
  }

  try {
    const result = await loadMentorManifest(
      { full_name: repoRecord.fullName },
      { token }
    );

    if (!result) continue;

    const manifest = result.manifest || {};
    const listed = Array.isArray(manifest.resources) ? manifest.resources : [];

    repoRecord.discoveryStatus = "manifested";
    repoRecord.manifest = {
      path: result.path,
      sha: result.sha,
      htmlUrl: result.htmlUrl,
      version: manifest.version || 1,
      sourceId: String(manifest.sourceId || ""),
      mentorSearchable: manifest.mentorSearchable === true,
      inventoryAuthority: String(manifest.inventoryAuthority || ""),
      resourceCount: listed.length
    };

    if (manifest.classification && repoRecord.classification !== "admin-only") {
      repoRecord.classification = String(manifest.classification);
      repoRecord.confidence = 1;
    }

    const normalizedResources = listed.map((resource, index) =>
      normalizeMentorResource(resource, repoRecord, manifest, index)
    );
    resources.push(...normalizedResources);

    repoRecord.recommendable = normalizedResources.some(
      resource => resource.recommendable
    );

    repoRecord.reason = repoRecord.recommendable
      ? "Valid Mentor manifest loaded; repository has recommendable source-owned resources."
      : "Valid Mentor manifest loaded; no resources are currently recommendable under manifest policy.";
  } catch (error) {
    repoRecord.discoveryStatus = "manifest-error";
    repoRecord.manifestError = String(error?.message || error);
    repoRecord.recommendable = false;
    repoRecord.reason = "Mentor manifest was found but could not be loaded or normalized.";
  }
}

await fs.writeFile(reposPath, JSON.stringify({
  version: 2,
  generatedAt,
  sourceLatestRepositoryTimestamp: latestRepositoryTimestamp,
  accounts: (accounts.accounts || []).map(item => item.login),
  repositories
}, null, 2) + "\n");

await fs.writeFile(resourcesPath, JSON.stringify({
  version: 2,
  generatedAt,
  sourceLatestRepositoryTimestamp: latestRepositoryTimestamp,
  resources
}, null, 2) + "\n");

console.log(`Indexed ${repositories.length} public repositories.`);
console.log(`Indexed ${resources.length} Mentor-manifest resources.`);
console.log(`Registry generated at ${generatedAt}.`);
console.log(`Newest discovered repository timestamp: ${latestRepositoryTimestamp || "none"}.`);
console.log("Resource metadata preserved: learning, authority, freshness, account boundaries, sensitive topics, and high-stakes domains.");
