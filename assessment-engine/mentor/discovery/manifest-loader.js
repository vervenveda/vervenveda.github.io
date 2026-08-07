function authHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "khaemenes-mentor-indexer"
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function loadMentorManifest(repo, {
  token = "",
  filename = "mentor-manifest.json"
} = {}) {
  const url = `https://api.github.com/repos/${repo.full_name}/contents/${encodeURIComponent(filename)}`;
  const response = await fetch(url, { headers: authHeaders(token) });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Manifest fetch failed for ${repo.full_name}: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.type !== "file" || !payload.content) return null;

  const text = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");
  const manifest = JSON.parse(text);
  return {
    manifest,
    sha: payload.sha,
    path: payload.path,
    htmlUrl: payload.html_url
  };
}
