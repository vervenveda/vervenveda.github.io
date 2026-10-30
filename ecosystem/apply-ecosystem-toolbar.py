#!/usr/bin/env python3
"""Verve N Veda ecosystem toolbar migration.

Default mode is audit-only. --apply edits eligible public HTML files in local
clones, commits per repository, and pushes only when --push is also supplied.

Policy:
- Public repositories owned by vervenveda, artist1970, JenniferPearl2028.
- Exactly one canonical vnv-ecosystem-toolbar.js reference per eligible page.
- Retire vnv-beta-link.js references and legacy Beta fallback elements.
- Skip admin/internal/private/archive/backup/STOS utility paths.
- Skip protected quiz/exam/assessment/closed-book surfaces.
"""
from __future__ import annotations
import argparse, json, os, re, shutil, subprocess, tempfile
from pathlib import Path
from urllib.request import Request, urlopen

OWNERS=("vervenveda","artist1970","JenniferPearl2028")
TOOLBAR_URL="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js"
TOOLBAR_TAG=f'<script src="{TOOLBAR_URL}"></script>'
SKIP_DIRS={".git",".github","node_modules","vendor","admin","internal","private","archive","archives","backup","backups","deprecated","stos"}
PROTECTED_RE=re.compile(r'(^|/)(quiz|quizzes|exam|exams|assessment|assessments)(/|$)',re.I)
CLOSED_RE=re.compile(r'data-closed-book|<body[^>]*data-closed-book',re.I)
TOOLBAR_RE=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>\s*</script>|<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>',re.I)
LEGACY_SCRIPT_RE=re.compile(r'<script\b[^>]*\bsrc=["\'][^"\']*vnv-beta-link\.js[^"\']*["\'][^>]*>\s*</script>|<script\b[^>]*\bsrc=["\'][^"\']*vnv-beta-link\.js[^"\']*["\'][^>]*>',re.I)
LEGACY_NODE_RE=re.compile(r'<(?P<tag>a|button)[^>]*(?:\\bid=["\\'](?:vnvBetaProgramLink|vnvBetaProgramFallback)["\\']|href=["\\']https://vervenveda\\.com/beta/?["\\']|aria-label=["\\']Open the Verve N Veda Beta Program["\\'])[^>]*>[\\s\\S]*?</(?P=tag)>',re.I)
HTML_RE=re.compile(r'<!doctype\s+html|<html\b|<body\b',re.I)

def run(cmd,cwd=None,capture=False):
    return subprocess.run(cmd,cwd=cwd,check=True,text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None).stdout if capture else None

def github_json(url):
    headers={"Accept":"application/vnd.github+json","User-Agent":"vnv-toolbar-migrator"}
    token=os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    if token: headers["Authorization"]=f"Bearer {token}"
    req=Request(url,headers=headers)
    with urlopen(req,timeout=60) as r: return json.load(r)

def discover_repos():
    repos=[]
    for owner in OWNERS:
        page=1
        while True:
            batch=github_json(f"https://api.github.com/users/{owner}/repos?type=public&per_page=100&page={page}")
            if not batch: break
            for x in batch:
                if x.get("private") or x.get("archived") or x.get("disabled"): continue
                repos.append({"full_name":x["full_name"],"default_branch":x.get("default_branch") or "main","has_pages":bool(x.get("has_pages"))})
            if len(batch)<100: break
            page+=1
    return repos

def skipped_path(rel):
    low=[p.lower() for p in rel.parts]
    return any(p in SKIP_DIRS for p in low)

def classify(path,src):
    rel=path.as_posix()
    if skipped_path(path): return "exempt-internal"
    if PROTECTED_RE.search("/"+rel) or CLOSED_RE.search(src): return "exempt-protected"
    if not HTML_RE.search(src): return "exempt-fragment"
    return "eligible"

def normalize(src):
    legacy_script=len(LEGACY_SCRIPT_RE.findall(src))
    legacy_node=bool(LEGACY_NODE_RE.search(src))
    src=LEGACY_SCRIPT_RE.sub("",src)
    src=LEGACY_NODE_RE.sub("",src)
    count=len(TOOLBAR_RE.findall(src))
    if count:
        first=True
        def repl(m):
            nonlocal first
            if first:
                first=False
                return TOOLBAR_TAG
            return ""
        src=TOOLBAR_RE.sub(repl,src)
    else:
        if re.search(r'</body\s*>',src,re.I):
            src=re.sub(r'</body\s*>',TOOLBAR_TAG+"\n</body>",src,count=1,flags=re.I)
        else:
            src+="\n"+TOOLBAR_TAG+"\n"
    return src,{"legacyScript":legacy_script,"legacyNode":legacy_node,"toolbarBefore":count}

def scan_repo(root,apply=False):
    rows=[]; changed=[]
    for p in sorted(root.rglob("*.html"))+sorted(root.rglob("*.htm")):
        rel=p.relative_to(root)
        try: src=p.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            rows.append({"path":rel.as_posix(),"state":"exempt-nonutf8"}); continue
        state=classify(rel,src)
        if state!="eligible":
            rows.append({"path":rel.as_posix(),"state":state}); continue
        toolbar=len(TOOLBAR_RE.findall(src))
        legacy=len(LEGACY_SCRIPT_RE.findall(src))
        fallback=bool(re.search(r'vnvBetaProgramLink|vnvBetaProgramFallback',src,re.I))
        if toolbar==1 and legacy==0 and not fallback:
            rows.append({"path":rel.as_posix(),"state":"pass"}); continue
        new,meta=normalize(src)
        rows.append({"path":rel.as_posix(),"state":"needs-change","toolbarBefore":toolbar,"legacy":legacy,"fallback":fallback})
        if apply and new!=src:
            p.write_text(new,encoding="utf-8")
            changed.append(rel.as_posix())
    return rows,changed

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--apply",action="store_true")
    ap.add_argument("--push",action="store_true")
    ap.add_argument("--report",default="ecosystem/toolbar-population-audit.json")
    ap.add_argument("--repo",action="append",default=[])
    args=ap.parse_args()
    if args.push and not args.apply: ap.error("--push requires --apply")
    repos=discover_repos()
    if args.repo: repos=[r for r in repos if r["full_name"] in set(args.repo)]
    report={"schema":"vnv-ecosystem-toolbar-population-v1","mode":"apply" if args.apply else "dry-run","owners":list(OWNERS),"repositories":[]}
    totals={"repositories":0,"html":0,"eligible":0,"pass":0,"needsChange":0,"exemptProtected":0,"exemptInternal":0,"exemptFragment":0,"changed":0,"failures":0}
    with tempfile.TemporaryDirectory(prefix="vnv-toolbar-") as td:
        base=Path(td)
        for info in repos:
            full=info["full_name"]
            # Public-page repositories only: require Pages or a .github.io repository name.
            if not info["has_pages"] and not full.lower().endswith(".github.io"): continue
            dest=base/full.replace("/","__")
            try:
                run(["git","clone","--depth","1","--branch",info["default_branch"],f"https://github.com/{full}.git",str(dest)])
                rows,changed=scan_repo(dest,args.apply)
                if args.apply and changed:
                    run(["git","config","user.name","Verve N Veda Ecosystem Guardian"],cwd=dest)
                    run(["git","config","user.email","ecosystem@vervenveda.com"],cwd=dest)
                    run(["git","add","-A"],cwd=dest)
                    run(["git","commit","-m","Normalize official Verve N Veda ecosystem toolbar"],cwd=dest)
                    if args.push: run(["git","push","origin",info["default_branch"]],cwd=dest)
                counts={}
                for x in rows: counts[x["state"]]=counts.get(x["state"],0)+1
                report["repositories"].append({"repository":full,"counts":counts,"changed":changed})
                totals["repositories"]+=1; totals["html"]+=len(rows)
                totals["eligible"]+=counts.get("pass",0)+counts.get("needs-change",0)
                totals["pass"]+=counts.get("pass",0); totals["needsChange"]+=counts.get("needs-change",0)
                totals["exemptProtected"]+=counts.get("exempt-protected",0)
                totals["exemptInternal"]+=counts.get("exempt-internal",0)
                totals["exemptFragment"]+=counts.get("exempt-fragment",0)
                totals["changed"]+=len(changed)
            except Exception as e:
                report["repositories"].append({"repository":full,"error":str(e)})
                totals["failures"]+=1
    report["totals"]=totals
    out=Path(args.report); out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(totals,indent=2))
    return 1 if totals["failures"] else 0

if __name__=="__main__":
    raise SystemExit(main())
