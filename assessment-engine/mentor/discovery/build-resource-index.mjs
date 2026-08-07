import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverRepositories } from "./repository-discovery.js";
import { loadMentorManifest } from "./manifest-loader.js";

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

function cleanArray(value) {
  return Array.isArray(value) ? [...new Set(value.map(String).map(v => v.trim()).filter(Boolean))] : [];
}

function normalizedResource(resource, repoRecord, manifest, index) {
  const localId = String(resource.id || `resource-${index + 1}`).trim();
  const owner = repoRecord.owner.toLowerCase();
  const repoName = repoRecord.name.toLowerCase();
  const id = localId.includes(":") ? localId : `${owner}.${repoName}.${localId}`;

  return {
    id,
    title: String(resource.title || manifest.name || repoRecord.name),
    description: String(resource.description || ""),
    url: String(resource.url || manifest.homepage || repoRecord.homepage || repoRecord.htmlUrl),
    sourceId: String(manifest.sourceId || `github:${repoRecord.fullName.toLowerCase()}`),
    repository: repoRecord.fullName,
    classification: String(resource.classification || manifest.classification || repoRecord.classification),
    audiences: cleanArray(resource.audiences?.length ? resource.audiences : manifest.audiences),
    roles: cleanArray(resource.roles?.length ? resource.roles : manifest.roles).length
      ? cleanArray(resource.roles?.length ? resource.roles : manifest.roles)
      : ["student", "parent", "educator"],
    domains: cleanArray(resource.domains),
    skills: cleanArray(resource.skills),
    tags: cleanArray(resource.tags),
    minutes: Number.isFinite(Number(resource.minutes)) ? Number(resource.minutes) : null,
    energy: String(resource.energy || ""),
    featured: Boolean(resource.featured),
    mentorEligible: resource.mentorEligible !== false,
    recommendable:
      manifest.mentorSearchable === true &&
      resource.mentorEligible !== false &&
      !["admin-only", "restricted", "unclassified", "archived"].includes(
        String(resource.classification || manifest.classification || repoRecord.classification)
      ),
    explicitAdultOptIn: Boolean(resource.explicitAdultOptIn),
    manifestPath: "mentor-manifest.json"
  };
}

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
      resources.push(normalizedResource(resource, repoRecord, manifest, index));
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
  version: 1,
  generatedAt,
  accounts: (accounts.accounts || []).map(item => item.login),
  repositories
}, null, 2) + "\n");

await fs.writeFile(resourcesPath, JSON.stringify({
  version: 1,
  generatedAt,
  resources
}, null, 2) + "\n");

console.log(`Indexed ${repositories.length} public repositories.`);
console.log(`Indexed ${resources.length} Mentor-manifest resources.`);
