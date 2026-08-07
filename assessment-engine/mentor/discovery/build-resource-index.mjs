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

const generatedAt = latestRepositoryTimestamp;
const resources = [];

for (const repoRecord of repositories) {
  if (repoRecord.archived || repoRecord.disabled) {
    repoRecord.discoveryStatus = "archived";
    repoRecord.recommendable = false;
    continue;
  }

  try {
    const result = await loadMentorManifest(
      { full_name: repoRecord.fullName },
      { token }
    );

    if (!result) continue;

    const manifest = result.manifest || {};
    repoRecord.discoveryStatus = "manifested";
    repoRecord.manifest = {
      path: result.path,
      sha: result.sha,
      htmlUrl: result.htmlUrl,
      version: manifest.version || 1,
      mentorSearchable: manifest.mentorSearchable === true
    };

    if (manifest.classification && repoRecord.classification !== "admin-only") {
      repoRecord.classification = String(manifest.classification);
      repoRecord.confidence = 1;
    }

    const listed = Array.isArray(manifest.resources) ? manifest.resources : [];
    listed.forEach((resource, index) => {
      resources.push(normalizeMentorResource(resource, repoRecord, manifest, index));
    });

    repoRecord.recommendable = resources.some(
      resource => resource.repository === repoRecord.fullName && resource.recommendable
    );
  } catch (error) {
    repoRecord.discoveryStatus = "manifest-error";
    repoRecord.manifestError = String(error?.message || error);
    repoRecord.recommendable = false;
  }
}

await fs.writeFile(reposPath, JSON.stringify({
  version: 2,
  generatedAt,
  accounts: (accounts.accounts || []).map(item => item.login),
  repositories
}, null, 2) + "\n");

await fs.writeFile(resourcesPath, JSON.stringify({
  version: 2,
  generatedAt,
  resources
}, null, 2) + "\n");

console.log(`Indexed ${repositories.length} public repositories.`);
console.log(`Indexed ${resources.length} Mentor-manifest resources.`);
console.log("Resource policy metadata preserved: freshness, preferences, account awareness, sensitive topics.");
