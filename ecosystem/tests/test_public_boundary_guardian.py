"""Synthetic negative cases plus actual checked-out source baseline."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("guardian", ROOT / "ecosystem/public_boundary_guardian.py")
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)

class GuardianTests(unittest.TestCase):
    def test_current_source(self):
        self.assertEqual(g.check(ROOT)["errors"], [])

    def test_url_policy(self):
        self.assertTrue(g.public_url("https://vervenveda.com/"))
        for url in ("http://vervenveda.com/", "https://stosme.github.io/",
                    "https://khaemenesacademy.github.io/", "https://user@vervenveda.com/",
                    "https://vervenveda.com:8443/", "https://vervenveda.com.evil.invalid/"):
            with self.subTest(url=url):
                self.assertFalse(g.public_url(url))

    def test_boundary_mutations(self):
        files = list(g.ADMIN_PAGES) + ["assets/stos-public-config.js",
            "cloud/gateway-map.json", "ecosystem/sync-status.json",
            "ecosystem-manifest.json", "ecosystem/master-ecosystem-directory.json"]
        cases = [
            ("admin/index.html", None, "ADMIN_PLACEHOLDER_CHANGED"),
            ("assets/stos-public-config.js", None, "STOS_BRIDGE_CONFIG_CHANGED"),
            ("cloud/gateway-map.json", lambda d: d.update(authority="admin"), "CLOUD_AUTHORITY_CHANGED"),
            ("cloud/gateway-map.json", lambda d: d["publicDestinations"].update(home="http://localhost/"), "CLOUD_DESTINATION_INVALID"),
            ("ecosystem/sync-status.json", lambda d: d["stos"].update(includedInPublicSync=True), "STOS_SYNC_BOUNDARY_CHANGED"),
            ("ecosystem-manifest.json", lambda d: next(x for x in d["reservedModules"] if x["id"]=="stos-public-front-door").update(publicNavigation=True), "RESERVED_FRONT_DOOR_ACTIVATED"),
            ("ecosystem/master-ecosystem-directory.json", lambda d: d["entries"].append({"directoryVisible":True,"url":"https://stosme.github.io/"}), "PUBLIC_ENTRY_ORIGIN_INVALID"),
        ]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for file in files:
                dest = root / file
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes((ROOT / file).read_bytes())
            for file, mutate, error in cases:
                with self.subTest(error=error):
                    dest = root / file
                    original = dest.read_bytes()
                    try:
                        if mutate is None:
                            dest.write_bytes(original + b"\n")
                        else:
                            data = json.loads(original)
                            mutate(data)
                            dest.write_text(json.dumps(data), encoding="utf-8")
                        report = g.check(root)
                        self.assertFalse(report["ok"])
                        self.assertIn(error, report["errors"])
                    finally:
                        dest.write_bytes(original)

if __name__ == "__main__":
    unittest.main()
