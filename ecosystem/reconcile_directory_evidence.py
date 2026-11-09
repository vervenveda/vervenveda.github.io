#!/usr/bin/env python3
"""Read-only comparison of curated, synchronized, and navigation-audited scope.

This tool never edits the canonical directory, shards, or report files.
Different populations must not be subtracted as though they were equivalent.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_json(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected JSON object: {path}")
    return data


def reconcile(master: dict, sync: dict, navigation: dict) -> dict:
    entries = master.get("entries", [])
    if not isinstance(entries, list):
        raise ValueError("Master entries are not a list")
    active = [e for e in entries if isinstance(e, dict)
              and e.get("status") == "active"
              and e.get("directoryVisible") is True
              and e.get("access") == "free-public"]
    approved = sorted({str(e.get("repository", "")).strip()
                       for e in active if e.get("repository")})
    synced = sorted(set(sync.get("syncedRepositories", [])))
    audited = sorted({r["repository"] for r in navigation.get("repositories", [])
                      if isinstance(r, dict) and isinstance(r.get("repository"), str)})
    foreign = sorted(set(approved) - set(synced))
    missing = sorted(set(approved) - set(audited))
    unexpected = sorted(set(audited) - set(approved))
    same_synced = set(synced).issubset(set(approved))
    count_ok = (master.get("entryCount") == len(entries)
                and sync.get("syncedRepositoryCount") == len(synced)
                and navigation.get("summary", {}).get("repositoryCount") == len(audited))
    return {
        "schema": "vnv-directory-evidence-reconciliation-v1",
        "mode": "read-only",
        "curated": {"entries": len(entries), "activeVisible": len(active),
                    "approvedRepositoryCount": len(approved)},
        "publicSync": {"generation": sync.get("generatedAt"),
                       "owner": sync.get("account"), "repositories": len(synced),
                       "cataloguedPagesReported": sync.get("publicPageCount"),
                       "excludedHtmlReported": sync.get("catalogExcludedHtmlCount"),
                       "driftReported": sync.get("driftCount")},
        "navigation": {"generation": navigation.get("generatedAt"),
                       "repositories": len(audited),
                       "htmlReported": navigation.get("summary", {}).get("htmlCount"),
                       "brokenReferencesReported": navigation.get("summary", {}).get("brokenLocalLinkCount")},
        "scopeDifferences": {"approvedNotInPublicSync": foreign,
                             "approvedNotInNavigation": missing,
                             "navigationNotApproved": unexpected},
        "checks": {"reportCountsConsistent": count_ok,
                   "syncedRepositoriesAreApproved": same_synced,
                   "navigationScopeMatchesApproved": not missing and not unexpected},
        "limitations": [
            "Reported page totals have different eligibility and owner scopes; do not subtract them.",
            "This check does not re-read both large catalogue shards or verify live URLs.",
            "Repository revision pinning and browser validation require separate receipts."
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    root = args.root
    result = reconcile(
        read_json(root / "ecosystem/master-ecosystem-directory.json"),
        read_json(root / "ecosystem/sync-status.json"),
        read_json(root / "ecosystem/navigation-audit.json"))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if all(result["checks"].values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
