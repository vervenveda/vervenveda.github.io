#!/usr/bin/env python3
"""Read-only, source-only migration evidence for the Vervenveda gateway.

Never reads user browser storage or vault contents. Never modifies source files.
Produces a local workflow artifact for manual review, not an approval receipt.
"""
from __future__ import annotations

import argparse
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
CRITICAL = (
    "CHANGE_CONTROL.md",
    "index.html",
    "assets/vnv-header-autopopulate.js",
    "assets/vnv-ecosystem-toolbar.js",
    "assets/vnv-ecosystem-menu.js",
    "assets/vnv-ecosystem-menu.css",
    "ecosystem/master-ecosystem-directory.json",
    "ecosystem/sync-status.json",
    "core/directory-agi/index.html",
    "core/directory-agi/directory-agi-v1.1.js",
    "ecosystem/directory_preflight.py",
    ".github/workflows/ecosystem-directory-preflight.yml",
)
CONTRACTS = {
    "directory_agi_cloud": ("VNV_DIRECTORY_AGI_CLOUD_V2", "VNV_DIRECTORY_AGI_RECOVERY_V2"),
    "directory_canonical": ('CANONICAL_URL="/ecosystem/master-ecosystem-directory.json"',),
}
IGNORED_SCHEMES = ("data:", "mailto:", "tel:", "javascript:", "blob:")

class SourceLinks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        for attr in ("src", "href"):
            value = values.get(attr)
            if isinstance(value, str):
                self.references.append((tag, attr, value))

def local_reference(value):
    value = value.strip()
    if not value or value.startswith(("#", "//", *IGNORED_SCHEMES)):
        return None
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    # Only inspect actual static assets, not JS templates, dynamic routes or user-generated links.
    if any(c in parsed.path for c in ("{", "}", "<", ">")):
        return None
    suffix = Path(parsed.path).suffix.lower()
    if suffix not in {".js", ".mjs", ".css", ".json", ".svg", ".png", ".jpg",
                      ".jpeg", ".webp", ".ico", ".woff", ".woff2"}:
        return None
    return parsed.path.lstrip("/") if parsed.path.startswith("/") else parsed.path

def check(root: Path):
    files = {}
    errors = []
    warnings = []
    for name in CRITICAL:
        target = root / name
        if not target.is_file():
            errors.append("Missing critical source: " + name)
            continue
        raw = target.read_bytes()
        files[name] = {"sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
    runtime = root / "core/directory-agi/directory-agi-v1.1.js"
    if runtime.is_file():
        source = runtime.read_text(encoding="utf-8")
        for group, markers in CONTRACTS.items():
            for marker in markers:
                if marker not in source:
                    errors.append("Missing source contract marker: " + group + "/" + marker)
    master = root / "ecosystem/master-ecosystem-directory.json"
    status = root / "ecosystem/sync-status.json"
    if master.is_file() and status.is_file():
        try:
            registry = json.loads(master.read_text(encoding="utf-8"))
            sync = json.loads(status.read_text(encoding="utf-8"))
            if registry["entryCount"] != len(registry["entries"]):
                errors.append("Curated registry entry count mismatch")
            if registry["pageCatalog"]["publicPageCount"] != sync["publicPageCount"]:
                errors.append("Public catalog count disagrees with sync status")
            if registry["pageCatalog"]["repositoryCount"] != sync["syncedRepositoryCount"]:
                errors.append("Approved repository count disagrees with sync status")
            if sync.get("stos", {}).get("includedInPublicSync") is not False:
                errors.append("STOS exclusion invariant missing from sync status")
        except (ValueError, TypeError, KeyError) as exc:
            errors.append("Invalid directory metadata: " + type(exc).__name__)
    index = root / "index.html"
    if index.is_file():
        scanner = SourceLinks()
        scanner.feed(index.read_text(encoding="utf-8"))
        checked = set()
        for tag, attr, value in scanner.references:
            relative = local_reference(value)
            if relative is None or relative in checked:
                continue
            checked.add(relative)
            candidate = (root / relative).resolve()
            try:
                candidate.relative_to(root.resolve())
            except ValueError:
                warnings.append("Local reference escapes repository root: " + relative)
                continue
            if not candidate.is_file():
                warnings.append("Unresolved local asset reference: " + relative)
    return files, errors, sorted(set(warnings))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="premigration-evidence")
    args = parser.parse_args()
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    files, errors, warnings = check(ROOT)
    report = {
        "schema": "vnv-source-premigration-evidence-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "repository": "vervenveda/vervenveda.github.io",
        "commit": os.getenv("GITHUB_SHA", "unverified-local-checkout"),
        "scope": "repository source and public directory contracts only",
        "notVerified": [
            "Live deployed routes, browser behavior or runtime services",
            "Contents or recoverability of browser-local storage and encrypted vaults",
            "Authenticated STOS connections or migration readiness approval",
        ],
        "files": files,
        "errors": errors,
        "warnings": warnings,
        "result": "FAIL" if errors else "PASS_WITH_WARNINGS" if warnings else "PASS",
    }
    (output / "source-integrity-manifest.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print("Pre-migration source evidence: " + report["result"])
    print(f"Critical files: {len(files)}; errors: {len(errors)}; warnings: {len(warnings)}")
    for issue in errors:
        print("ERROR: " + issue)
    for issue in warnings[:25]:
        print("WARNING: " + issue)
    if len(warnings) > 25:
        print(f"... and {len(warnings)-25} further warnings in the manifest")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
