#!/usr/bin/env python3
"""Produce a read-only proposed STOS source manifest, never a release approval.

GitHub is source provenance, not STOS operating authority. All exports must
be reverified inside STOS before any native source replacement.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

BLOCKED = frozenset({
    ".git", ".github", ".stos", "runtime", "secrets", "private",
    "admin", "protected", "node_modules"
})
HEX = re.compile(r"^[0-9a-f]{40}$|^[0-9a-f]{64}$")
MAX_PATH = 1023


def git_bytes(*args: str) -> bytes:
    return subprocess.check_output(["git", *args])


def safe_path(value: str) -> bool:
    if not value or len(value.encode("utf-8")) > MAX_PATH:
        return False
    if not value.isascii() or "\\" in value or ":" in value:
        return False
    if any(ord(c) < 32 or ord(c) == 127 for c in value):
        return False
    segments = value.split("/")
    if any(not s or s in (".", "..") for s in segments):
        return False
    return not any(s.lower() in BLOCKED or s.lower() == ".env"
                   or s.lower().startswith(".env.") for s in segments)


def plan_revision(revision: str) -> dict:
    if not HEX.fullmatch(revision):
        raise ValueError("A full lowercase Git commit OID is required")
    actual = git_bytes("rev-parse", "--verify", f"{revision}^{{commit}}").decode().strip()
    if actual != revision:
        raise ValueError("Requested revision is not an exact commit")
    raw = git_bytes("ls-tree", "-rz", "--full-tree", revision)
    files = []
    excluded = []
    for record in raw.split(b"\x00"):
        if not record:
            continue
        metadata, name = record.split(b"\t", 1)
        mode, typ, oid = metadata.decode("ascii").split()
        try:
            path = name.decode("utf-8", "strict")
        except UnicodeDecodeError:
            raise ValueError("Undecodable Git path; manual review required")
        if not safe_path(path):
            excluded.append({"path": path, "reason": "native-path-policy"})
            continue
        if mode != "100644" and mode != "100755":
            excluded.append({"path": path, "reason": "not-regular-file"})
            continue
        if typ != "blob":
            excluded.append({"path": path, "reason": "not-git-blob"})
            continue
        blob = git_bytes("cat-file", "blob", oid)
        files.append({"path": path, "gitBlobOid": oid,
                      "sha256": hashlib.sha256(blob).hexdigest(),
                      "bytes": len(blob), "executable": mode == "100755"})
    files.sort(key=lambda row: row["path"])
    excluded.sort(key=lambda row: row["path"])
    manifest = {
        "schema": "vnv-proposed-source-manifest-v1",
        "source": "vervenveda/vervenveda.github.io",
        "sourceRevision": revision,
        "decision": "UNAPPROVED",
        "nativeTargetState": "NOT_VERIFIED",
        "fileCount": len(files),
        "excludedCount": len(excluded),
        "files": files,
        "excluded": excluded,
        "limitations": [
            "Provenance only: not an STOS authorization, intake receipt, or deployment.",
            "Requires independent native identity/hold, destination hash, and revision checks.",
            "No deletions are authorized by this manifest.",
            "No symlinks or protected-path contents are exported."
        ],
    }
    digest_payload = json.dumps(manifest, sort_keys=True, separators=(",", ":"),
                                ensure_ascii=True).encode("utf-8")
    manifest["manifestSha256"] = hashlib.sha256(digest_payload).hexdigest()
    return manifest


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--commit", required=True, help="full immutable commit OID")
    args = ap.parse_args()
    print(json.dumps(plan_revision(args.commit), indent=2, ensure_ascii=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
