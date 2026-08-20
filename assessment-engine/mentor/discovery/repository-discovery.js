import { classifyRepository } from "./repository-classifier.js";

function headers(token) {
  const result = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "khaemenes-mentor-indexer"
  };
  if (token) result.Authorization = `Bearer ${token}`;
  return result;
}

function normalizedSet(values) {
  return new Set((Array.isArray(values) ? values : [])
    .map(value => String(value || "").trim().toLowerCase())
    .filter(Boolean));
}

export function repositoryAllowedByAccountPolicy(repo, accountPolicy = {}) {
  if (!repo || repo.private === true) return false;

  const include = normalizedSet(accountPolicy.includeRepositories);
  if (include.size && !include.has(String(repo.name || "").toLowerCase())) return false;

  return true;
}

async function listPublicRepos(login, token) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/users/${encodeURIComponent(login)}/repos?type=owner&sort=full_name&per_page=100&page=${page}`;
    const response = await fetch(url, { headers: headers(token) });
    if (!response.ok) throw new Error(`Repository discovery failed for ${login}: ${response.status}`);
    const batch = await response.json();
    all.push(...batch.filter(repo => repo.private !== true));
    if (batch.length < 100) break;
  }
  return all;
}

export async function discoverRepositories(accountPolicies, { token = "" } = {}) {
  const repositories = [];

  for (const account of accountPolicies.filter(item => item.enabled !== false)) {
    const repos = await listPublicRepos(account.login, token);

    for (const repo of repos) {
      if (!repositoryAllowedByAccountPolicy(repo, account)) continue;

      const classification = classifyRepository(repo, account);
      if (classification.classification === "admin-only") continue;

      repositories.push({
        id: `github:${repo.full_name.toLowerCase()}`,
        owner: repo.owner.login,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        htmlUrl: repo.html_url,
        homepage: repo.homepage || "",
        defaultBranch: repo.default_branch || "main",
        archived: Boolean(repo.archived),
        disabled: Boolean(repo.disabled),
        hasPages: Boolean(repo.has_pages),
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        discoveryStatus: "discovered",
        ...classification
      });
    }
  }

  return repositories;
}
