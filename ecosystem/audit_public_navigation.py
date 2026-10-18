#!/usr/bin/env python3
"""Audit public Verve N Veda navigation across approved GitHub repositories.

This is a read-only content audit. It clones approved public repositories into a
temporary directory, scans local HTML, validates relative/internal links, builds
an HTML reachability graph, and reports likely orphan/duplicate/superseded files.

STOS remains dormant and is explicitly excluded.
"""

from __future__ import annotations

import json
import hashlib
import os
import re
import shutil
import subprocess
import tempfile
from collections import Counter, defaultdict, deque
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT=Path(__file__).resolve().parents[1]
MASTER=ROOT/"ecosystem"/"master-ecosystem-directory.json"
REPORT_JSON=ROOT/"ecosystem"/"navigation-audit.json"
REPORT_MD=ROOT/"ecosystem"/"NAVIGATION_AUDIT.md"

EXCLUDED_DIRS={".git",".github","node_modules","vendor","private","admin","admins","backup","backups","deprecated","stos"}
HTML_EXT={".html",".htm"}
ASSET_EXT={".css",".js",".json",".png",".jpg",".jpeg",".gif",".svg",".webp",".ico",".mp3",".wav",".ogg",".mp4",".webm",".pdf",".txt",".csv",".xml",".webmanifest"}
REMOTE_HOSTS={"vervenveda.com","www.vervenveda.com","vervenveda.github.io"}
MAX_EXAMPLES=80

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        for key in ("href","src"):
            value=d.get(key)
            if value:
                self.links.append((tag,key,value.strip()))

def now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00","Z")

def run(cmd,cwd=None):
    subprocess.run(cmd,cwd=cwd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

def approved_repositories(master):
    repos={}
    for e in master.get("entries",[]):
        repo=str(e.get("repository") or "").strip()
        if not repo or "stos" in repo.lower():
            continue
        if e.get("status")!="active" or e.get("directoryVisible") is not True:
            continue
        repos.setdefault(repo,{"repo":repo,"category":e.get("category") or "gateway","title":e.get("title") or repo})
    return sorted(repos.values(),key=lambda x:x["repo"].lower())

def should_skip(path:Path):
    lowered=[part.lower() for part in path.parts]
    return any(part in EXCLUDED_DIRS or part.endswith(".github.io") for part in lowered)

def html_files(root:Path):
    return [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in HTML_EXT and not should_skip(p.relative_to(root))]

def normalize_candidate(root:Path,source:Path,raw:str):
    raw=raw.strip()
    if not raw or raw.startswith(("#","mailto:","tel:","javascript:","data:","blob:")):
        return None
    parsed=urlsplit(raw)
    if parsed.scheme and parsed.scheme not in {"http","https"}:
        return None
    if parsed.scheme in {"http","https"}:
        host=parsed.hostname or ""
        if host not in REMOTE_HOSTS:
            return None
        path=unquote(parsed.path or "/")
        # Only resolve same-repository GitHub Pages URLs when they clearly map locally.
        rel=None
        if host in {"vervenveda.com","www.vervenveda.com"}:
            if root.name=="vervenveda.github.io":
                # Umbrella-domain project paths belong to child repositories,
                # not folders inside the gateway checkout.
                first=(path.lstrip("/").split("/",1)[0] if path.lstrip("/") else "")
                if first.lower().endswith(".github.io"):
                    return None
                rel=path.lstrip("/") or "index.html"
            else:
                prefix="/"+root.name+"/"
                if path.lower().startswith(prefix.lower()):
                    rel=path[len(prefix):] or "index.html"
        elif host=="vervenveda.github.io":
            prefix="/"+root.name+"/"
            if root.name=="vervenveda.github.io":
                first=(path.lstrip("/").split("/",1)[0] if path.lstrip("/") else "")
                if first.lower().endswith(".github.io"):
                    return None
                rel=path.lstrip("/") or "index.html"
            elif path.lower().startswith(prefix.lower()):
                rel=path[len(prefix):] or "index.html"
        if rel is None:
            return None
        candidate=(root/rel)
    else:
        path=unquote(parsed.path or "")
        if not path:
            return None
        if path.startswith("/"):
            # Root-relative links on project pages generally point to the umbrella gateway,
            # not the current repository; leave them to ecosystem-level routing.
            return None
        candidate=(source.parent/path)

    candidate=Path(os.path.normpath(str(candidate)))
    try:
        candidate.relative_to(root)
    except ValueError:
        return None

    if str(raw).endswith("/"):
        if candidate.name.lower() not in {"index.html","index.htm"}:
            candidate=candidate/"index.html"
    elif candidate.is_dir():
        candidate=candidate/"index.html"
    elif candidate.suffix=="":
        if (candidate/"index.html").exists():
            candidate=candidate/"index.html"
        elif candidate.with_suffix(".html").exists():
            candidate=candidate.with_suffix(".html")
    return candidate

DYNAMIC_ROUTE_RE = re.compile(
    r"""(?P<q>["'`])(?P<url>(?:https?://(?:www\.)?vervenveda\.com/|https?://vervenveda\.github\.io/)?[^"'\`<>\n]{1,320}?(?:\.html?|/))(?P=q)""",
    re.I,
)

def dynamic_html_targets(root:Path,source:Path,text:str,rels:set[str]):
    """Extract existing HTML destinations embedded in JS route arrays/config objects.
    Dynamic strings improve reachability classification only; they never create broken-link findings.
    """
    found=set()
    for match in DYNAMIC_ROUTE_RE.finditer(text):
        raw=match.group("url").strip()
        if not raw or raw.startswith(("#","data:","javascript:")):
            continue
        candidate=normalize_candidate(root,source,raw)
        if candidate is None:
            continue
        try:
            rel=candidate.relative_to(root).as_posix()
        except ValueError:
            continue
        if rel in rels and candidate.exists() and candidate.suffix.lower() in HTML_EXT:
            found.add(rel)
    return found

def logical_duplicate_key(path:Path):
    s=path.as_posix().lower()
    s=re.sub(r"(?:[_-]?index)?\.html?$","",s)
    s=re.sub(r"[_-]+"," ",s)
    # Only collapse unmistakable archival/copy/version labels. Words such as
    # "final", "updated", and "new" can describe distinct public destinations.
    s=re.sub(r"\b(?:copy|old|legacy|backup|bak|deprecated|superseded|v\d+|version\d+)\b","",s)
    s=re.sub(r"\s+"," ",s).strip()
    return s

def audit_repo(repo_info,tmp:Path,curated_paths:set[str]):
    full=repo_info["repo"]
    name=full.split("/",1)[1]
    dest=tmp/name
    url=f"https://github.com/{full}.git"
    run(["git","clone","--depth","1","--branch","main","--single-branch",url,str(dest)])
    files=html_files(dest)
    rels={p.relative_to(dest).as_posix():p for p in files}
    graph=defaultdict(set)
    broken=[]
    refs=Counter()

    for rel,p in rels.items():
        try:
            text=p.read_text(encoding="utf-8",errors="ignore")
        except Exception:
            continue
        parser=LinkParser()
        try:
            parser.feed(text)
        except Exception:
            pass
        for tag,attr,raw in parser.links:
            candidate=normalize_candidate(dest,p,raw)
            if candidate is None:
                continue
            try:
                target=candidate.relative_to(dest).as_posix()
            except ValueError:
                continue
            refs[target]+=1
            if candidate.exists():
                if candidate.suffix.lower() in HTML_EXT:
                    graph[rel].add(target)
            else:
                # Only treat likely local files as broken.
                if candidate.suffix.lower() in HTML_EXT|ASSET_EXT or "." in candidate.name:
                    broken.append({"source":rel,"target":target,"raw":raw,"tag":tag,"attr":attr})

        # Many portals build cards and course menus from JS arrays rather than literal
        # <a> tags. Count existing route strings as real navigation without treating
        # arbitrary JS strings as broken links.
        for target in dynamic_html_targets(dest,p,text,set(rels)):
            refs[target]+=1
            graph[rel].add(target)

    # Reachability starts at root index plus every curated active public master-directory
    # path for this repository. This avoids labeling legitimate deep portals as orphans.
    seeds=[]
    for seed in ("index.html","index.htm"):
        if seed in rels:
            seeds.append(seed)
    for seed in sorted(curated_paths):
        normalized=seed.strip("/")
        if normalized.endswith("/"):
            normalized += "index.html"
        if normalized in rels and normalized not in seeds:
            seeds.append(normalized)
    reachable=set(seeds)
    q=deque(seeds)
    while q:
        cur=q.popleft()
        for nxt in graph.get(cur,()):
            if nxt in rels and nxt not in reachable:
                reachable.add(nxt);q.append(nxt)

    # Treat pages referenced anywhere in-repo as connected even if not reachable from root,
    # but keep a separate root-orphan metric.
    referenced={r for r in refs if r in rels}
    orphan_pool={
        rel for rel in rels
        if Path(rel).name.lower() not in {"403.html","404.html","500.html","offline.html"}
    }
    root_orphans=sorted(orphan_pool-reachable)
    unreferenced=sorted(orphan_pool-referenced-set(seeds))

    groups=defaultdict(list)
    for rel in rels:
        groups[logical_duplicate_key(Path(rel))].append(rel)

    # Separate true byte-identical duplicates from merely versioned/sibling pages.
    # A final exam and an assessment center, or a v2 packet and a broader packet,
    # should not be called duplicates just because filenames are similar.
    exact_duplicate_groups=[]
    version_sibling_groups=[]
    canonical_aliases=[]
    for members in groups.values():
        if len(members)<2:
            continue
        members=sorted(members)
        hashes=defaultdict(list)
        for rel in members:
            data=rels[rel].read_bytes()
            hashes[hashlib.sha256(data).hexdigest()].append(rel)
        exact_duplicate_groups.extend(sorted(v) for v in hashes.values() if len(v)>1)

        alias_members=set()
        for rel in members:
            text=rels[rel].read_text(encoding="utf-8",errors="ignore")
            m=re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)',text,re.I)
            if not m:
                continue
            candidate=normalize_candidate(dest,rels[rel],m.group(1))
            if candidate is None:
                continue
            try:
                target=candidate.relative_to(dest).as_posix()
            except ValueError:
                continue
            if target in members and target!=rel:
                canonical_aliases.append({"alias":rel,"canonical":target})
                alias_members.add(rel); alias_members.add(target)
        residual=[rel for rel in members if rel not in alias_members]
        if len(residual)>1:
            version_sibling_groups.append(residual)

    superseded=[r for r in rels if re.search(r"(^|[/_.-])(old|legacy|backup|bak|deprecated|superseded)([/_.-]|$)",r,re.I)]

    return {
        "repository":full,
        "htmlCount":len(rels),
        "brokenLocalLinkCount":len(broken),
        "rootReachableHtmlCount":len(reachable),
        "rootOrphanHtmlCount":len(root_orphans),
        "unreferencedHtmlCount":len(unreferenced),
        "duplicateGroupCount":len(exact_duplicate_groups),
        "versionSiblingGroupCount":len(version_sibling_groups),
        "canonicalAliasCount":len(canonical_aliases),
        "supersededNameCount":len(superseded),
        "brokenLocalLinks":broken[:MAX_EXAMPLES],
        "rootOrphans":root_orphans[:MAX_EXAMPLES],
        "unreferencedPages":unreferenced[:MAX_EXAMPLES],
        "duplicateGroups":exact_duplicate_groups[:30],
        "versionSiblingGroups":version_sibling_groups[:30],
        "canonicalAliases":canonical_aliases[:MAX_EXAMPLES],
        "supersededNames":superseded[:MAX_EXAMPLES],
    }

def main():
    master=json.loads(MASTER.read_text(encoding="utf-8"))
    repos=approved_repositories(master)
    curated_by_repo=defaultdict(set)
    for entry in master.get("entries",[]):
        if entry.get("status")=="active" and entry.get("directoryVisible") is True:
            repo=str(entry.get("repository") or "").strip().lower()
            path=str(entry.get("path") or "").strip()
            if repo and path:
                curated_by_repo[repo].add(path)
    results=[]
    failures=[]
    with tempfile.TemporaryDirectory(prefix="vnv-nav-audit-") as td:
        tmp=Path(td)
        for info in repos:
            try:
                results.append(audit_repo(info,tmp,curated_by_repo.get(info["repo"].lower(),set())))
            except Exception as exc:
                failures.append({"repository":info["repo"],"error":str(exc)})

    summary={
        "repositoryCount":len(results),
        "failedRepositoryCount":len(failures),
        "htmlCount":sum(r["htmlCount"] for r in results),
        "brokenLocalLinkCount":sum(r["brokenLocalLinkCount"] for r in results),
        "rootOrphanHtmlCount":sum(r["rootOrphanHtmlCount"] for r in results),
        "unreferencedHtmlCount":sum(r["unreferencedHtmlCount"] for r in results),
        "duplicateGroupCount":sum(r["duplicateGroupCount"] for r in results),
        "versionSiblingGroupCount":sum(r.get("versionSiblingGroupCount",0) for r in results),
        "canonicalAliasCount":sum(r.get("canonicalAliasCount",0) for r in results),
        "supersededNameCount":sum(r["supersededNameCount"] for r in results),
    }
    payload={
        "version":1,
        "generatedAt":now(),
        "policy":"Read-only GitHub public navigation audit. STOS dormant/excluded. Findings are candidates for review, not automatic deletions.",
        "summary":summary,
        "failures":failures,
        "repositories":results,
    }
    REPORT_JSON.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

    lines=[
        "# Verve N Veda Public Navigation Audit",
        "",
        f"Generated: {payload['generatedAt']}",
        "",
        "STOS remains dormant and is excluded from this audit. No files are deleted or renamed automatically.",
        "",
        "## Summary",
        "",
        f"- Repositories audited: {summary['repositoryCount']}",
        f"- Repository audit failures: {summary['failedRepositoryCount']}",
        f"- HTML files inspected: {summary['htmlCount']}",
        f"- Broken local link references: {summary['brokenLocalLinkCount']}",
        f"- HTML pages not reachable from repository root index: {summary['rootOrphanHtmlCount']}",
        f"- HTML pages with no incoming in-repository link: {summary['unreferencedHtmlCount']}",
        f"- Exact duplicate groups: {summary['duplicateGroupCount']}",
        f"- Version/sibling groups requiring review: {summary['versionSiblingGroupCount']}",
        f"- Canonical aliases already resolved: {summary['canonicalAliasCount']}",
        f"- Legacy/superseded-style filenames: {summary['supersededNameCount']}",
        "",
        "## Highest-priority repositories",
        "",
    ]
    ranked=sorted(results,key=lambda r:(r["brokenLocalLinkCount"],r["unreferencedHtmlCount"],r["duplicateGroupCount"]),reverse=True)
    for r in ranked[:15]:
        lines.append(
            f"- **{r['repository']}** — broken {r['brokenLocalLinkCount']}; "
            f"unreferenced {r['unreferencedHtmlCount']}; exact duplicates {r['duplicateGroupCount']}; "
            f"version siblings {r.get('versionSiblingGroupCount',0)}."
        )
    REPORT_MD.write_text("\n".join(lines)+"\n",encoding="utf-8")
    print(json.dumps(summary))
    return 0 if not failures else 1

if __name__=="__main__":
    raise SystemExit(main())
