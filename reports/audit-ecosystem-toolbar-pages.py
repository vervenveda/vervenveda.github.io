#!/usr/bin/env python3
from pathlib import Path
import re, sys

EXCLUDED={".git",".github","node_modules","vendor","archive","archives","backup","backups","deprecated","private","admin","stos"}
TOOLBAR=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>',re.I)
LEGACY=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-beta-link\.js[^"\']*["\'][^>]*>',re.I)
FALLBACK=re.compile(r'id=["\'](?:vnvBetaProgramLink|vnvBetaProgramFallback)["\']',re.I)

rows=[]; failures=[]
for p in sorted(Path(".").rglob("*.html")):
    rel=p.as_posix()
    if {x.lower() for x in p.parts}&EXCLUDED or rel.lower().startswith("beta/"):
        continue
    try: src=p.read_text(encoding="utf-8")
    except UnicodeDecodeError: continue
    if not re.search(r"<!doctype\s+html|<html\b|<body\b",src,re.I): continue
    toolbar=len(TOOLBAR.findall(src)); legacy=len(LEGACY.findall(src)); fallback=bool(FALLBACK.search(src))
    rows.append((rel,toolbar,legacy,fallback))
    if legacy or fallback: failures.append(f"{rel}: legacy Beta surface remains")
    if toolbar>1: failures.append(f"{rel}: duplicate official toolbar scripts ({toolbar})")

print(f"publicHtml={len(rows)} legacy={sum(1 for _,_,l,f in rows if l or f)} directToolbar={sum(1 for _,t,_,_ in rows if t)}")
for f in failures: print("FAIL:",f)
sys.exit(1 if failures else 0)
