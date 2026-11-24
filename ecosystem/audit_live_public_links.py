#!/usr/bin/env python3
"""Read-only HTTPS audit of approved master-directory destinations."""
import argparse
import collections
import hashlib
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit, urljoin, unquote
from urllib.request import Request, build_opener, HTTPRedirectHandler, ProxyHandler
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[1]
HOSTS = {"vervenveda.com", "www.vervenveda.com", "vervenveda.github.io", "artist1970.github.io"}
MAX_BYTES = 65536

def allowed(url):
    try:
        p = urlsplit(url)
        return (p.scheme == "https" and p.hostname in HOSTS and
                not p.username and not p.password and p.port in (None, 443)
                and not p.query and not p.fragment
                and not re.search(r"(?i)(^|/)(admin|private|credentials?|vault|backups?|stos)(/|$)", unquote(p.path))
                and not re.search(r"(?i)%|\\\\", unquote(p.path)))
    except (ValueError, TypeError):
        return False

def approved(data):
    entries = data["entries"]
    if not isinstance(entries, list) or data["entryCount"] != len(entries):
        raise ValueError("Registry count mismatch")
    rows = [e for e in entries if e.get("directoryVisible") is True
            and e.get("access") == "free-public" and e.get("status") == "active"]
    if not rows or len({e["id"] for e in rows}) != len(rows):
        raise ValueError("Empty registry or duplicate active IDs")
    return rows

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def classify(status, content_type, body):
    if status in (404, 410):
        return "missing"
    if status in (401, 403):
        return "access-review"
    if status == 429 or status >= 500:
        return "transient"
    if not 200 <= status < 300:
        return "http-review"
    if "html" not in content_type.lower():
        return "content-review"
    title = re.search(rb"<title[^>]*>(.*?)</title\s*>", body, re.I | re.S)
    if title and re.search(rb"\b404\b|page not found|site not found", title.group(1), re.I):
        return "possible-soft-404"
    return "http-ok"

def probe(url, timeout=10, opener=None):
    opener = opener or build_opener(ProxyHandler({}), NoRedirect())
    current, chain = url, []
    for _ in range(6):
        if not allowed(current):
            return {"result":"blocked-url", "redirects":chain}
        try:
            req = Request(current, headers={"User-Agent":"VNV-Public-Link-Audit/1.0", "Accept":"text/html", "Accept-Encoding":"identity"})
            try:
                response = opener.open(req, timeout=timeout)
            except HTTPError as exc:
                response = exc
            with response:
                status = response.code
                if status in (301, 302, 303, 307, 308):
                    target = response.headers.get("Location")
                    if not target:
                        return {"result":"redirect-review", "status":status, "redirects":chain}
                    target = urljoin(current, target)
                    chain.append({"from":current,"to":target,"status":status})
                    current = target
                    continue
                kind = classify(status, response.headers.get("Content-Type",""), response.read(MAX_BYTES))
                return {"result":kind,"status":status,"finalUrl":current,"redirects":chain,
                        "redirectReview":bool(chain)}
        except (URLError, OSError, ValueError) as exc:
            return {"result":"network-error","error":str(exc)[:200],"redirects":chain}
    return {"result":"redirect-limit","redirects":chain}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--limit", type=int)
    p.add_argument("--timeout", type=int, default=10)
    args = p.parse_args()
    if args.limit is not None and args.limit < 1 or not 1 <= args.timeout <= 30:
        p.error("Invalid limit or timeout")
    raw = (ROOT/"ecosystem/master-ecosystem-directory.json").read_bytes()
    rows = approved(json.loads(raw))
    results = []
    for e in rows[:args.limit]:
        results.append({"id":e["id"],"url":e["url"],**probe(e["url"],args.timeout)})
        time.sleep(.2)
    report = {"version":1,"generatedAt":datetime.now(timezone.utc).isoformat(),
              "registrySha256":hashlib.sha256(raw).hexdigest(),"approvedCount":len(rows),
              "checkedCount":len(results),"summary":dict(collections.Counter(r["result"] for r in results)),
              "results":results,"limitations":"HTTP only; no JavaScript execution. Redirects and possible soft 404s require review."}
    # Exclusive creation prevents overwriting existing files, including registry data.
    with args.output.open("x", encoding="utf-8") as f:
        json.dump(report,f,indent=2)
        f.write("\n")
    print(json.dumps(report["summary"],sort_keys=True))

if __name__ == "__main__":
    main()
