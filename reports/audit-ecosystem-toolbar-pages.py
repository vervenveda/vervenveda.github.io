#!/usr/bin/env python3
from pathlib import Path
import re, sys

EXCLUDED={".git",".github","node_modules","vendor","archive","archives","backup","backups","deprecated","private","admin","stos"}
TOOLBAR=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>',re.I)
LEGACY=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-beta-link\.js[^"\']*["\'][^>]*>',re.I)
FALLBACK=re.compile(r'id=["\'](?:vnvBetaProgramLink|vnvBetaProgramFallback)["\']',re.I)
CUSTOM_BETA=re.compile(
    r'<(?:a|button)\b[^>]*(?:href=["\']https://vervenveda\.com/beta/?["\']|'
    r'aria-label=["\']Open the Verve N Veda Beta Program["\'])[^>]*>',
    re.I,
)
CUSTOM_DOCK=re.compile(
    r'(?:createElement\(["\']nav["\']\)[\s\S]{0,500}vnvEcosystemUtilityDock|'
    r'#vnvEcosystemUtilityDock\s*\{)',
    re.I,
)

rows=[]; failures=[]
for p in sorted(Path(".").rglob("*.html")):
    rel=p.as_posix()
    if {x.lower() for x in p.parts}&EXCLUDED or rel.lower().startswith("beta/"):
        continue
    try:
        src=p.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    if not re.search(r"<!doctype\s+html|<html\b|<body\b",src,re.I):
        continue

    toolbar=len(TOOLBAR.findall(src))
    legacy=len(LEGACY.findall(src))
    fallback=bool(FALLBACK.search(src))
    custom_beta=bool(CUSTOM_BETA.search(src))
    custom_dock=bool(CUSTOM_DOCK.search(src))
    rows.append((rel,toolbar,legacy,fallback,custom_beta,custom_dock))

    if legacy or fallback:
        failures.append(f"{rel}: legacy Beta surface remains")
    if custom_beta:
        failures.append(f"{rel}: custom standalone Beta control remains")
    if custom_dock:
        failures.append(f"{rel}: page-specific ecosystem dock implementation/style remains")
    if toolbar>1:
        failures.append(f"{rel}: duplicate official toolbar scripts ({toolbar})")

print(
    f"publicHtml={len(rows)} "
    f"legacy={sum(1 for _,_,l,f,_,_ in rows if l or f)} "
    f"customBeta={sum(1 for *_,b,_ in rows if b)} "
    f"customDock={sum(1 for *_,d in rows if d)} "
    f"directToolbar={sum(1 for _,t,*_ in rows if t)}"
)
for failure in failures:
    print("FAIL:",failure)

sys.exit(1 if failures else 0)
