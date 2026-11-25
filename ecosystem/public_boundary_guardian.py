#!/usr/bin/env python3
"""Offline regression guard for declared public gateway boundaries.
Not an authentication test or secret scanner. Fixed error codes only.
"""
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit

ADMIN_PAGES = ("admin/index.html", "admin/2index.html", "admin/index-disabled.html")
ADMIN_BLOB = "e494720140a8431b1eadd961c61b5ea4baade436"
CONFIG_BLOB = "aee43faf009960f7d78934b9c9a376e8b57d0107"
RESERVED = {"stos-public-front-door": "stosme.github.io",
            "academy-public-front-door": "khaemenesacademy.github.io"}
HOSTS = {"vervenveda.com", "www.vervenveda.com", "vervenveda.github.io",
         "artist1970.github.io", "jenniferpearl2028.github.io"}

def blob(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def public_url(value):
    if not isinstance(value, str) or any(c.isspace() for c in value):
        return False
    try:
        u = urlsplit(value)
        return (u.scheme == "https" and u.hostname in HOSTS
                and u.port in (None, 443) and u.username is None
                and u.password is None and "\\" not in value)
    except ValueError:
        return False

def check(root):
    errors = set()
    def read(path):
        try:
            return (root / path).read_bytes()
        except OSError:
            errors.add("REQUIRED_SOURCE_UNREADABLE")
            return b""
    def obj(path):
        try:
            value = json.loads(read(path))
            if isinstance(value, dict):
                return value
        except (ValueError, UnicodeError):
            pass
        errors.add("JSON_BOUNDARY_INVALID")
        return {}
    for path in ADMIN_PAGES:
        if blob(read(path)) != ADMIN_BLOB:
            errors.add("ADMIN_PLACEHOLDER_CHANGED")
    cloud = obj("cloud/gateway-map.json")
    if (cloud.get("visibility") != "public-static" or cloud.get("authority") != "none"
            or cloud.get("accountState") is not False
            or cloud.get("privilegedRoutes") is not False):
        errors.add("CLOUD_AUTHORITY_CHANGED")
    destinations = cloud.get("publicDestinations")
    if not isinstance(destinations, dict) or not destinations or not all(
            public_url(v) for v in destinations.values()):
        errors.add("CLOUD_DESTINATION_INVALID")
    if blob(read("assets/stos-public-config.js")) != CONFIG_BLOB:
        errors.add("STOS_BRIDGE_CONFIG_CHANGED")
    if obj("ecosystem/sync-status.json").get("stos") != {
            "state": "dormant", "includedInPublicSync": False}:
        errors.add("STOS_SYNC_BOUNDARY_CHANGED")
    manifest = obj("ecosystem-manifest.json")
    modules = manifest.get("reservedModules")
    owners = manifest.get("owners")
    if not isinstance(modules, list) or not isinstance(owners, list):
        errors.add("RESERVED_MANIFEST_INVALID")
        modules, owners = [], []
    for ident, host in RESERVED.items():
        matches = [x for x in modules if isinstance(x, dict) and x.get("id") == ident]
        if len(matches) != 1:
            errors.add("RESERVED_FRONT_DOOR_MISSING_OR_DUPLICATE")
            continue
        item = matches[0]
        urls = item.get("urls")
        if (item.get("status") != "reserved" or item.get("publicNavigation") is not False
                or not isinstance(urls, dict) or "public" not in urls or urls["public"] is not None):
            errors.add("RESERVED_FRONT_DOOR_ACTIVATED")
        matching = [x for x in owners if isinstance(x, dict) and x.get("id") == item.get("owner")]
        if len(matching) != 1 or matching[0].get("publicRoot") != "https://" + host + "/":
            errors.add("RESERVED_OWNER_CHANGED")
    master = obj("ecosystem/master-ecosystem-directory.json")
    entries = master.get("entries")
    if not isinstance(entries, list):
        errors.add("MASTER_ENTRIES_INVALID")
    else:
        for item in entries:
            if not isinstance(item, dict):
                errors.add("MASTER_ENTRIES_INVALID")
            elif item.get("directoryVisible") is True and not public_url(item.get("url")):
                errors.add("PUBLIC_ENTRY_ORIGIN_INVALID")
    return {"ok": not errors, "errors": sorted(errors),
            "scope": "declared-source-boundaries-only"}

if __name__ == "__main__":
    report = check(Path(__file__).resolve().parents[1])
    print(json.dumps(report, sort_keys=True))
    raise SystemExit(0 if report["ok"] else 1)
