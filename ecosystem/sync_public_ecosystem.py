#!/usr/bin/env python3
"""Synchronize the live public Verve N Veda GitHub ecosystem.

Safety model:
- STOS is dormant and is never discovered or activated by this script.
- The curated master ecosystem directory remains the publication allowlist.
- New public repositories are discovered into a candidate file, never silently published.
- New public HTML inside already-approved repositories is automatically added to the page catalog.
- Private, archived, disabled, admin/private/backup/STOS and diagnostic surfaces are excluded.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER_PATH = ROOT / "ecosystem" / "master-ecosystem-directory.json"
CANDIDATES_PATH = ROOT / "ecosystem" / "discovered-candidates.json"
STATUS_PATH = ROOT / "ecosystem" / "sync-status.json"
PART_A_PATH = ROOT / "registry" / "ecosystem-pages-a.json"
PART_B_PATH = ROOT / "registry" / "ecosystem-pages-b.json"

ACCOUNT = "vervenveda"
API = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()

EXCLUDED_PARTS = {
    ".git", ".github", "node_modules", "vendor",
    "private", "admin", "admins", "backup", "backups",
    "deprecated", "stos",
}
EXCLUDED_FILE_NAMES = {
    "404.html", "404.htm", "offline.html", "offline.htm",
    "recovery.html", "recovery.htm",
}
EXCLUDED_PATH_WORDS = re.compile(
    r"(^|[/_.-])(diagnostic|diagnostics|source[-_ ]?snippet|error[-_ ]?page)([/_.-]|$)",
    re.I,
)
# Public files may remain available without being appropriate Ecosystem search
# destinations. Keep implementation fragments, integration helpers, and
# unmistakable archival aliases out of the searchable public catalog.
CATALOG_HELPER_HTML = re.compile(
    r"""(?ix)
    (^|/)
    (?:
      seo[-_]?head[-_]?snippet |
      structured[-_]?data |
      .*?(?:profile|head|schema)[-_]?snippet |
      .*?portal[-_]?integration |
      .*?(?:old|legacy|backup|bak|deprecated|superseded)(?:[-_].*)?
    )
    \.html?$
    """
)
CATALOG_INTERNAL_PATH = re.compile(
    r"""(?ix)
    (^|/)
    (?:
      teacher[-_]?keys |
      objective[-_]?map[-_]?diagnostics |
      source[-_]?snippets?
    )
    (/|$)
    """
)
CATALOG_PRIVILEGED_HTML = re.compile(
    r"""(?ix)
    (^|/)
    [^/]*(?:
      admin |
      administrator |
      private |
      operator[-_ ]?console |
      control[-_ ]?panel |
      credential |
      secret |
      vault
    )[^/]*\.html?$
    """
)
MIN_PUBLIC_HTML_BYTES = 64
CATALOG_COMPATIBILITY_ALIAS = re.compile(
    r"""(?ix)
    ^courses/social-studies/grade-09/week-(?:06|07|09|10)/
    student-packet(?:-v2)?\.html?$
    """
)
NEW_REPO_BLOCK = re.compile(r"(^|[._-])(stos|dummy)([._-]|$)", re.I)


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def api_json(url: str):
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "verve-n-veda-public-ecosystem-sync",
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")[:500]
        raise RuntimeError(f"GitHub API {exc.code} for {url}: {body}") from exc


def list_public_account_repos(login: str) -> list[dict]:
    repos: list[dict] = []
    for page in range(1, 11):
        url = (
            f"{API}/users/{urllib.parse.quote(login)}/repos"
            f"?type=owner&sort=full_name&per_page=100&page={page}"
        )
        batch = api_json(url)
        if not isinstance(batch, list):
            raise RuntimeError("Unexpected repository discovery response")
        repos.extend(
            repo for repo in batch
            if not repo.get("private", False)
        )
        if len(batch) < 100:
            break
    return repos


def recursive_tree(repo_full_name: str, branch: str) -> tuple[list[dict], bool]:
    quoted_repo = "/".join(urllib.parse.quote(part) for part in repo_full_name.split("/"))
    quoted_branch = urllib.parse.quote(branch, safe="")
    payload = api_json(f"{API}/repos/{quoted_repo}/git/trees/{quoted_branch}?recursive=1")
    return list(payload.get("tree") or []), bool(payload.get("truncated"))


def public_html_path(path: str) -> bool:
    normalized = path.strip("/")
    if not normalized.lower().endswith((".html", ".htm")):
        return False
    parts = [part.lower() for part in normalized.split("/")]
    if set(parts) & EXCLUDED_PARTS:
        return False
    if any(part.endswith(".github.io") for part in parts):
        return False
    if parts[-1] in EXCLUDED_FILE_NAMES:
        return False
    if EXCLUDED_PATH_WORDS.search(normalized):
        return False
    if CATALOG_HELPER_HTML.search(normalized):
        return False
    if CATALOG_INTERNAL_PATH.search(normalized):
        return False
    if CATALOG_PRIVILEGED_HTML.search(normalized):
        return False
    if CATALOG_COMPATIBILITY_ALIAS.search(normalized):
        return False
    return True


def humanize(value: str) -> str:
    value = re.sub(r"[_-]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value.title() if value else "Public Page"


def title_for(path: str, source: str) -> str:
    p = Path(path)
    name = p.name
    if name.lower() in {"index.html", "index.htm"}:
        if len(p.parts) == 1:
            return source
        return humanize(p.parent.name)
    stem = re.sub(r"(?i)(?:_index|-index)?\.html?$", "", name)
    return humanize(stem)


def public_base(repo_name: str) -> str:
    if repo_name.lower() == "vervenveda.github.io":
        return "https://vervenveda.com/"
    return f"https://vervenveda.github.io/{repo_name}/"


def page_url(repo_name: str, path: str) -> str:
    base = public_base(repo_name)
    normalized = path.strip("/")
    if normalized.lower() in {"index.html", "index.htm"}:
        return base
    if normalized.lower().endswith(("/index.html", "/index.htm")):
        normalized = normalized.rsplit("/", 1)[0] + "/"
    quoted = urllib.parse.quote(normalized, safe="/._-~")
    return urllib.parse.urljoin(base, quoted)


def repo_identity(master_entries: list[dict]) -> dict[str, dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for entry in master_entries:
        repo = str(entry.get("repository") or "").strip()
        if repo:
            grouped[repo.lower()].append(entry)

    result: dict[str, dict] = {}
    for key, entries in grouped.items():
        active = [
            e for e in entries
            if e.get("status") == "active" and e.get("directoryVisible") is True
        ]
        gateway = next((e for e in active if e.get("type") in {"gateway", "network", "portal"}), None)
        chosen = gateway or (active[0] if active else entries[0])
        cats = [str(e.get("category") or "") for e in active if e.get("category")]
        category = Counter(cats).most_common(1)[0][0] if cats else str(chosen.get("category") or "gateway")
        result[key] = {
            "repository": chosen.get("repository"),
            "source": chosen.get("title") or chosen.get("repository"),
            "category": category,
        }
    return result


def main() -> int:
    generated_at = now_iso()
    master = json.loads(MASTER_PATH.read_text(encoding="utf-8"))
    entries = list(master.get("entries") or [])
    identities = repo_identity(entries)
    approved = set(identities)

    discovered = list_public_account_repos(ACCOUNT)
    discovered_by_key = {
        str(repo.get("full_name") or "").lower(): repo
        for repo in discovered
        if repo.get("full_name")
    }

    candidates = []
    ignored_new = []
    for repo in discovered:
        full = str(repo.get("full_name") or "")
        key = full.lower()
        if key in approved:
            continue
        record = {
            "repository": full,
            "name": repo.get("name"),
            "defaultBranch": repo.get("default_branch") or "main",
            "hasPages": bool(repo.get("has_pages")),
            "archived": bool(repo.get("archived")),
            "disabled": bool(repo.get("disabled")),
            "updatedAt": repo.get("updated_at"),
            "pushedAt": repo.get("pushed_at"),
            "homepage": repo.get("homepage") or "",
            "state": "under-review",
            "directoryVisible": False,
        }
        if NEW_REPO_BLOCK.search(str(repo.get("name") or "")):
            record["reason"] = "Excluded from automatic publication by reserved-name policy."
            ignored_new.append(record)
        elif repo.get("archived") or repo.get("disabled") or not repo.get("has_pages"):
            record["reason"] = "Not auto-published: repository is archived, disabled, or GitHub Pages is inactive."
            ignored_new.append(record)
        else:
            record["reason"] = "New public Pages repository discovered; manual ecosystem approval required."
            candidates.append(record)

    pages: list[dict] = []
    catalog_excluded_count = 0
    catalog_excluded_tiny_html_count = 0
    drift: list[dict] = []
    truncated_repositories: list[str] = []
    synced_repositories: list[str] = []

    for key in sorted(approved):
        identity = identities[key]
        full_name = str(identity["repository"])
        repo = discovered_by_key.get(key)
        if not repo:
            drift.append({
                "repository": full_name,
                "state": "not-publicly-discovered",
                "reason": "Approved ecosystem repository is absent from current public account discovery.",
            })
            continue

        if repo.get("archived") or repo.get("disabled") or not repo.get("has_pages"):
            drift.append({
                "repository": full_name,
                "state": "publication-drift",
                "archived": bool(repo.get("archived")),
                "disabled": bool(repo.get("disabled")),
                "hasPages": bool(repo.get("has_pages")),
                "reason": "Approved ecosystem repository is not in an active public GitHub Pages state.",
            })
            continue

        branch = str(repo.get("default_branch") or "main")
        tree, truncated = recursive_tree(full_name, branch)
        if truncated:
            truncated_repositories.append(full_name)

        repo_name = str(repo.get("name") or full_name.split("/", 1)[-1])
        source = str(identity["source"])
        category = str(identity["category"])
        for item in tree:
            if item.get("type") != "blob":
                continue
            path = str(item.get("path") or "")
            if not public_html_path(path):
                if path.lower().endswith((".html", ".htm")):
                    catalog_excluded_count += 1
                continue
            size = int(item.get("size") or 0)
            if size < MIN_PUBLIC_HTML_BYTES:
                catalog_excluded_count += 1
                catalog_excluded_tiny_html_count += 1
                continue
            pages.append({
                "title": title_for(path, source),
                "url": page_url(repo_name, path),
                "repo": repo_name,
                "path": path,
                "category": category,
                "source": source,
            })
        synced_repositories.append(full_name)

    # Deterministic catalog ordering and URL/path de-duplication.
    unique = {}
    for page in pages:
        unique[(page["repo"].lower(), page["path"].lower())] = page
    pages = sorted(
        unique.values(),
        key=lambda page: (page["repo"].lower(), page["path"].lower())
    )

    midpoint = (len(pages) + 1) // 2
    common = {
        "version": 4,
        "generatedAt": generated_at,
        "policy": (
            "Automatically synchronized public HTML from approved Verve N Veda repositories; "
            "private/admin/backups/STOS/diagnostic/offline/helper/legacy surfaces excluded. "
            "New repositories require explicit ecosystem approval."
        ),
    }
    part_a = {**common, "part": "a", "pages": pages[:midpoint]}
    part_b = {**common, "part": "b", "pages": pages[midpoint:]}
    PART_A_PATH.write_text(json.dumps(part_a, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    PART_B_PATH.write_text(json.dumps(part_b, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    candidates_payload = {
        "version": 1,
        "generatedAt": generated_at,
        "account": ACCOUNT,
        "policy": (
            "Discovery only. New repositories never become public ecosystem destinations automatically. "
            "STOS and reserved dummy repositories remain excluded."
        ),
        "candidates": sorted(candidates, key=lambda item: item["repository"].lower()),
        "ignored": sorted(ignored_new, key=lambda item: item["repository"].lower()),
    }
    CANDIDATES_PATH.write_text(
        json.dumps(candidates_payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    master.setdefault("pageCatalog", {})
    master["pageCatalog"]["version"] = 2
    master["pageCatalog"]["publicPageCount"] = len(pages)
    master["pageCatalog"]["repositoryCount"] = len(synced_repositories)
    master["pageCatalog"]["parts"] = [
        "/registry/ecosystem-pages-a.json",
        "/registry/ecosystem-pages-b.json",
    ]
    master["pageCatalog"]["lastForensicRefresh"] = generated_at[:10]
    master["pageCatalog"]["autoSync"] = {
        "enabled": True,
        "mode": "approved-repositories-only",
        "newRepositoryPolicy": "discover-under-review",
        "stos": "dormant-excluded",
        "generatedAt": generated_at,
    }
    master["entryCount"] = len(entries)
    MASTER_PATH.write_text(
        json.dumps(master, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    status = {
        "version": 1,
        "generatedAt": generated_at,
        "account": ACCOUNT,
        "approvedRepositoryCount": len(approved),
        "syncedRepositoryCount": len(synced_repositories),
        "publicPageCount": len(pages),
        "catalogExcludedHtmlCount": catalog_excluded_count,
        "catalogExcludedTinyHtmlCount": catalog_excluded_tiny_html_count,
        "candidateRepositoryCount": len(candidates),
        "ignoredRepositoryCount": len(ignored_new),
        "driftCount": len(drift),
        "truncatedTreeCount": len(truncated_repositories),
        "stos": {
            "state": "dormant",
            "includedInPublicSync": False,
        },
        "drift": drift,
        "truncatedRepositories": truncated_repositories,
        "syncedRepositories": synced_repositories,
    }
    STATUS_PATH.write_text(
        json.dumps(status, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(
        f"Synced {len(synced_repositories)}/{len(approved)} approved repositories; "
        f"cataloged {len(pages)} public HTML pages; "
        f"found {len(candidates)} new repository candidate(s); drift={len(drift)}."
    )
    if truncated_repositories:
        print("WARNING: truncated Git trees:", ", ".join(truncated_repositories), file=sys.stderr)
    if drift:
        print("WARNING: approved repository publication drift detected.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
