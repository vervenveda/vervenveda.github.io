#!/usr/bin/env python3
"""Create an integrity-checked ZIP of the canonical public Directory Cloud.

The archive contains the live master, both current catalog shards, approved
public directory UI/source code, sync machinery and public audit metadata.
It excludes privileged/admin directories, historical catalog shards, secrets,
and unrelated ecosystem assets. It does not alter live source files.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path(os.environ.get("DIRECTORY_CLOUD_ZIP", ROOT / "directory-cloud.zip"))
FILES = [
    "ecosystem/master-ecosystem-directory.json",
    "registry/ecosystem-pages-a.json",
    "registry/ecosystem-pages-b.json",
    "ecosystem/sync_public_ecosystem.py",
    "ecosystem/sync-status.json",
    "ecosystem/discovered-candidates.json",
    "ecosystem/audit_public_navigation.py",
    "ecosystem/NAVIGATION_AUDIT.md",
    "ecosystem/tests/test_navigation_paths.py",
    "core/directory-agi/index.html",
    "core/directory-agi/directory-agi-v1.1.js",
    "core/directory-agi/tools/validate-directory-agi-v1.1.mjs",
    "assets/vnv-header-autopopulate.js",
    "assets/vnv-ecosystem-menu.js",
    "assets/vnv-ecosystem-menu.css",
    "assets/vnv-ecosystem-toolbar.js",
    "index.html",
    ".github/workflows/ecosystem-public-sync.yml",
    ".github/workflows/ecosystem-navigation-audit.yml",
]
EXCLUDED = {"admin", "private", "secrets", "stos", "backup", "backups", "vault"}
def main() -> int:
    master = json.loads((ROOT / FILES[0]).read_text(encoding="utf-8"))
    shards = [json.loads((ROOT / f).read_text(encoding="utf-8")) for f in FILES[1:3]]
    pages = [page for shard in shards for page in shard["pages"]]
    if master["entryCount"] != len(master["entries"]):
        raise RuntimeError("canonical entry count does not match")
    if master["pageCatalog"]["parts"] != ["/" + x for x in FILES[1:3]]:
        raise RuntimeError("canonical catalog part pointers do not match")
    if master["pageCatalog"]["publicPageCount"] != len(pages):
        raise RuntimeError("canonical catalog page count does not match")
    if len({e["id"] for e in master["entries"]}) != len(master["entries"]):
        raise RuntimeError("duplicate curated ID")
    if len({e["url"].rstrip("/").lower() for e in master["entries"]}) != len(master["entries"]):
        raise RuntimeError("duplicate curated URL")
    if len({p["url"].rstrip("/").lower() for p in pages}) != len(pages):
        raise RuntimeError("duplicate generated page URL")
    if len({s.get("generatedAt") for s in shards}) != 1:
        raise RuntimeError("catalog shards have inconsistent generations")
    hashes = {}
    for name in FILES:
        path = ROOT / name
        if not path.is_file():
            raise RuntimeError("required Directory Cloud file missing: " + name)
        if set(Path(name).parts) & EXCLUDED:
            raise RuntimeError("unexpected sensitive path in archive: " + name)
        hashes[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    manifest = {
        "schema": "verve-n-veda-directory-cloud-backup-v1",
        "source": "vervenveda/vervenveda.github.io",
        "sourceOfTruth": FILES[0],
        "catalogParts": FILES[1:3],
        "catalogGeneration": shards[0]["generatedAt"],
        "curatedEntryCount": len(master["entries"]),
        "publicPageCount": len(pages),
        "files": hashes,
        "note": "Public Directory Cloud backup only; no private storage, passwords or STOS data.",
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED, compresslevel=8) as zf:
        for name in FILES:
            zf.write(ROOT / name, arcname="Directory-Cloud/" + name)
        zf.writestr("Directory-Cloud/MANIFEST.json",
                    json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
        zf.writestr("Directory-Cloud/START-HERE.md",
                    "# Verve N Veda Directory Cloud — Public Backup\n\n"
                    "The sole authoritative destination registry is "
                    "`ecosystem/master-ecosystem-directory.json`. "
                    "The two `registry/ecosystem-pages-*.json` shards form "
                    "one generated page catalog, not separate inventories.\n\n"
                    "Validate against `MANIFEST.json` SHA-256 digests before restore. "
                    "This archive is public and contains no confidential vault data.\n")
    with zipfile.ZipFile(OUTPUT) as zf:
        if zf.testzip() is not None:
            raise RuntimeError("archive integrity test failed")
    print(json.dumps({"archive": str(OUTPUT), "bytes": OUTPUT.stat().st_size,
                      "curated": len(master["entries"]), "publicPages": len(pages),
                      "fileCount": len(FILES) + 2}))
    return 0

if __name__ == "__main__":
    sys.exit(main())
