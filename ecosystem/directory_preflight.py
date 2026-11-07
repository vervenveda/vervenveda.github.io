#!/usr/bin/env python3
"""Read-only, stdlib-only integrity preflight for VNV public directory assets.

Reports only aggregate counts and error codes. Does not network, write, or publish.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, unquote

HOSTS={"vervenveda.com","www.vervenveda.com","vervenveda.github.io",
       "artist1970.github.io","jenniferpearl2028.github.io"}
FORBIDDEN={"admin","admins","private","credential","credentials","vault",
           "backup","backups","offline","diagnostic","diagnostics","stos",".github",".git"}
PART=re.compile(r"^/registry/[A-Za-z0-9._/-]+\.json$")

def safe_path(value):
    if not isinstance(value,str) or not value or "\\" in value:return False
    parts=unquote(value).lower().split("/")
    return not any(p in FORBIDDEN or p==".." or p.startswith(".") for p in parts if p)

def safe_url(value):
    if not isinstance(value,str):return False
    try:
        u=urlsplit(value)
        return (u.scheme=="https" and u.hostname in HOSTS and
                not u.username and not u.password and not u.fragment)
    except ValueError:return False

def check(root):
    errors=set()
    counts={"registryEntries":0,"visibleEntries":0,"catalogPages":0,
            "catalogRepositories":0,"shards":0}
    try:master=json.loads((root/"ecosystem/master-ecosystem-directory.json").read_text(encoding="utf-8"))
    except (OSError,UnicodeError,ValueError):
        return {"ok":False,"errors":["MASTER_UNREADABLE"],"counts":counts}
    entries=master.get("entries")
    if not isinstance(entries,list):
        return {"ok":False,"errors":["ENTRIES_INVALID"],"counts":counts}
    counts["registryEntries"]=len(entries)
    if master.get("entryCount")!=len(entries):errors.add("ENTRY_COUNT_MISMATCH")
    ids=set()
    urls=set()
    for e in entries:
        if not isinstance(e,dict):
            errors.add("ENTRY_INVALID")
            continue
        uid,url,repo,path=(e.get(k) for k in ("id","url","repository","path"))
        if not isinstance(uid,str) or not uid or uid in ids:
            errors.add("ENTRY_ID_INVALID_OR_DUPLICATE")
        else:ids.add(uid)
        if not isinstance(url,str) or not safe_url(url) or url in urls:
            errors.add("ENTRY_URL_INVALID_OR_DUPLICATE")
        else:urls.add(url)
        if not isinstance(repo,str) or "/" not in repo or not safe_path(repo):
            errors.add("ENTRY_REPOSITORY_INVALID")
        if e.get("directoryVisible") is True:
            counts["visibleEntries"]+=1
            if e.get("status")!="active" or e.get("access")!="free-public":
                errors.add("PUBLIC_ENTRY_STATUS_INVALID")
            if not safe_path(path) or not safe_url(url) or not safe_path(urlsplit(url).path):
                errors.add("PUBLIC_ENTRY_PATH_FORBIDDEN")
    meta=master.get("pageCatalog")
    if not isinstance(meta,dict):
        errors.add("CATALOG_METADATA_INVALID")
        return {"ok":False,"errors":sorted(errors),"counts":counts}
    parts=meta.get("parts")
    if not isinstance(parts,list) or len(parts)!=2 or len(set(map(str,parts)))!=2:
        errors.add("SHARD_LIST_INVALID")
        return {"ok":False,"errors":sorted(errors),"counts":counts}
    seen=set()
    repos=set()
    generation=None
    for path in parts:
        if not isinstance(path,str) or not PART.fullmatch(path) or not safe_path(path):
            errors.add("SHARD_PATH_INVALID")
            continue
        try:shard=json.loads((root/path.lstrip("/")).read_text(encoding="utf-8"))
        except (OSError,UnicodeError,ValueError):
            errors.add("SHARD_UNREADABLE")
            continue
        counts["shards"]+=1
        if not isinstance(shard,dict) or not isinstance(shard.get("pages"),list):
            errors.add("SHARD_FORMAT_INVALID")
            continue
        stamp=shard.get("generatedAt")
        if not isinstance(stamp,str) or not stamp:errors.add("SHARD_GENERATION_MISSING")
        elif generation is None:generation=stamp
        elif stamp!=generation:errors.add("SHARD_GENERATION_MISMATCH")
        for page in shard["pages"]:
            if not isinstance(page,dict):
                errors.add("CATALOG_RECORD_INVALID")
                continue
            url,rel,repo=(page.get(k) for k in ("url","path","repo"))
            if not safe_url(url) or not safe_path(urlsplit(url).path) or not safe_path(rel):
                errors.add("CATALOG_PAGE_FORBIDDEN")
                continue
            if url in seen:errors.add("CATALOG_DUPLICATE_URL")
            seen.add(url)
            if not isinstance(repo,str) or not safe_path(repo):
                errors.add("CATALOG_REPO_INVALID")
            else:repos.add(repo)
            counts["catalogPages"]+=1
    counts["catalogRepositories"]=len(repos)
    if meta.get("publicPageCount")!=counts["catalogPages"]:
        errors.add("CATALOG_PAGE_COUNT_MISMATCH")
    if meta.get("repositoryCount")!=len(repos):
        errors.add("CATALOG_REPOSITORY_COUNT_MISMATCH")
    sync=meta.get("autoSync")
    if generation and (not isinstance(sync,dict) or sync.get("generatedAt")!=generation):
        errors.add("MASTER_SHARD_GENERATION_MISMATCH")
    return {"ok":not errors,"errors":sorted(errors),"counts":counts}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--root",type=Path,default=Path(__file__).resolve().parents[1])
    report=check(p.parse_args().root)
    print(json.dumps(report,indent=2,sort_keys=True))
    return 0 if report["ok"] else 1

if __name__=="__main__":
    raise SystemExit(main())
