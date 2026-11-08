#!/usr/bin/env python3
"""Source-only, read-only STOS migration seal and dependency ledger.

Runs in the explicit GitHub audit workflow; never executes application code.
Writes only to the requested output directory, never to tracked source.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
CRITICAL = {
    "index.html", "CNAME", "SECURITY.md", "CHANGE_CONTROL.md",
    "ecosystem/browser-sovereign-authority-contract.json",
    "ecosystem/test_browser_sovereign_authority_contract.py",
    "assets/vnv-header-autopopulate.js",
    "assets/vnv-ecosystem-toolbar.js", "assets/vnv-ecosystem-menu.js",
    "assets/vnv-333-ticker.js", "assets/vnv-ticker-autopopulate.js",
    "ecosystem/master-ecosystem-directory.json",
    "registry/ecosystem-pages-a.json", "registry/ecosystem-pages-b.json",
    "ecosystem/sync-status.json", "core/directory-agi/directory-agi-v1.1.js",
    ".github/workflows/ecosystem-public-sync.yml",
    ".github/workflows/normalize-vnv-ecosystem-toolbar.yml",
}
RULES = (
    ("workflow", re.compile(r"^\.github/workflows/")),
    ("directory-cloud", re.compile(r"^(ecosystem/|registry/|core/directory-agi/)")),
    ("assessment-mentor", re.compile(r"^(assessment-engine/|family/|matrix/|reports/)")),
    ("public-stos-bridge", re.compile(r"^(stos/|assets/stos-public-config\.js$)")),
    ("browser-ui", re.compile(r"^(assets/|index\.html$|cloud/)")),
)
TEXT_EXT = {".js", ".mjs", ".html", ".htm", ".css", ".json", ".yml", ".yaml", ".py", ".md"}
MARKERS = (
    ("browser-local-storage", re.compile(rb"\blocalStorage\b|\bsessionStorage\b")),
    ("browser-indexeddb", re.compile(rb"\bindexedDB\b")),
    ("browser-webcrypto", re.compile(rb"\bcrypto\.subtle\b")),
    ("network", re.compile(rb"\bfetch\s*\(|\bWebSocket\b|\bXMLHttpRequest\b")),
    ("external-http-reference", re.compile(rb"https?://")),
    ("node-runtime-reference", re.compile(rb"node:|\bnode\s+|\bnpm\b")),
    ("python-runtime-reference", re.compile(rb"\bpython3?\b")),
    ("iframe", re.compile(rb"<iframe\b|createElement\s*\(\s*['\"]iframe", re.I)),
)
def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, stderr=subprocess.DEVNULL)
def classify(name):
    for label, match in RULES:
        if match.search(name):
            return label
    return "other-source"
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", required=True)
    args = ap.parse_args()
    output = Path(args.output_dir).resolve()
    if output == ROOT or ROOT in output.parents:
        raise SystemExit("HOLD: outputs must be outside the source repository")
    output.mkdir(parents=True, exist_ok=True)
    revision = git("rev-parse", "HEAD").decode().strip()
    tracked = [os.fsdecode(x) for x in git("ls-files", "-z").split(b"\0") if x]
    manifest, ledger, errors = [], [], []
    for name in tracked:
        p = ROOT / name
        if p.is_symlink() or not p.is_file():
            errors.append({"path": name, "code": "NON_REGULAR_TRACKED_PATH"})
            continue
        raw = p.read_bytes()
        manifest.append({
            "path": name, "size": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "critical": name in CRITICAL,
        })
        if p.suffix.lower() in TEXT_EXT and len(raw) <= 2_000_000:
            detected = [label for label, regex in MARKERS if regex.search(raw)]
            if detected:
                ledger.append({
                    "path": name, "sourceClass": classify(name),
                    "sourceIndicators": detected,
                    "stosImportStatus": "unverified",
                    "sandboxCertification": "unverified",
                    "executionAuthorized": False,
                    "note": "Static indicators only; not proof of runtime use or deployment",
                })
    if sorted(x["path"] for x in manifest) != sorted(tracked):
        errors.append({"code": "TRACKED_FILE_COVERAGE_INCOMPLETE"})
    missing = sorted(CRITICAL - {x["path"] for x in manifest})
    if missing:
        errors.append({"code": "CRITICAL_PATH_MISSING", "paths": missing})
    evidence = {
        "schema": "vnv-migration-source-seal-v1", "repository": "vervenveda/vervenveda.github.io",
        "gitCommit": revision, "tree": git("rev-parse", "HEAD^{tree}").decode().strip(),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "scope": "tracked GitHub source only; no browser, account, STOS or runtime examination",
        "files": manifest, "errors": errors,
        "noExecutionOrAuthorityGrant": True,
    }
    compatibility = {
        "schema": "vnv-stos-compatibility-ledger-v1", "gitCommit": revision,
        "sourceIndicatorsOnly": True, "stosRuntimeAudited": False,
        "liveSandboxCertified": False,
        "entries": ledger,
        "interpretation": "Entries require STOS-side evidence and authorization before promotion",
    }
    for filename, data in (
        ("tracked-source-seal.json", evidence),
        ("stos-compatibility-ledger.json", compatibility),
    ):
        (output / filename).write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print("SOURCE_SEAL_FILES=", len(manifest))
    print("COMPATIBILITY_INDICATOR_FILES=", len(ledger))
    print("ERROR_COUNT=", len(errors))
    print("SOURCE_MODIFICATIONS=NONE")
    return 1 if errors else 0
if __name__ == "__main__":
    raise SystemExit(main())
