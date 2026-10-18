#!/usr/bin/env python3
"""Read-only public HTML Beta coverage audit. Run in each repository checkout.
No network, third-party dependencies, or STOS reads. Exits 1 for uncovered public HTML.
"""
import argparse
import json
import re
from pathlib import Path

EXCLUDED = {".git", ".github", "node_modules", "vendor", "archive", "archives",
            "backup", "backups", "deprecated", "private", "admin", "stos"}
WIDGET = re.compile(r'<script\b[^>]*\bsrc\s*=\s*["\'][^"\']*vnv-beta-link\.js[^"\']*["\'][^>]*>', re.I)
DIRECT = re.compile(r'<a\b[^>]*\bhref\s*=\s*["\']https://(?:www\.)?vervenveda\.com/beta/[^"\']*["\']', re.I)
INDEX = re.compile(r'(?:^|[_-])in?dex\.html$', re.I)

def audit(root):
    rows = []
    for file in sorted(root.rglob("*.html")):
        rel = file.relative_to(root).as_posix()
        if set(map(str.lower, file.relative_to(root).parts)) & EXCLUDED or rel.lower().startswith("beta/"):
            continue
        try:
            source = file.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            rows.append({"path": rel, "status": "unreadable", "index": bool(INDEX.search(file.name))})
            continue
        # HTML fragments used as include/snippet material are not standalone
        # navigable pages and cannot host a page-level Beta doorway.
        if not re.search(r"<!doctype\s+html|<html\b|<body\b", source, re.I):
            continue
        mechanisms = []
        if WIDGET.search(source):
            mechanisms.append("widget")
        if DIRECT.search(source):
            mechanisms.append("direct-link")
        rows.append({"path": rel, "status": "covered" if mechanisms else "missing",
                     "index": bool(INDEX.search(file.name)), "mechanisms": mechanisms})
    return rows

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", default=".")
    parser.add_argument("--json", dest="json_file", help="Optional local JSON report path")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    rows = audit(root)
    missing = [r for r in rows if r["status"] != "covered"]
    summary = {"publicHtml": len(rows), "covered": len(rows)-len(missing),
               "uncovered": len(missing), "uncoveredIndex": sum(r["index"] for r in missing)}
    print(json.dumps(summary, sort_keys=True))
    for row in missing:
        print(f'{row["status"]}: {row["path"]}')
    if args.json_file:
        Path(args.json_file).write_text(json.dumps({"summary": summary, "pages": rows}, indent=2)+"\n", encoding="utf-8")
    return 1 if missing else 0

if __name__ == "__main__":
    raise SystemExit(main())
