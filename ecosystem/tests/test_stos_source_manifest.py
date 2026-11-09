"""Offline checks for proposed STOS manifest policy; does not contact STOS."""
import importlib.util
import hashlib
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "build_stos_source_manifest.py"
spec = importlib.util.spec_from_file_location("vnv_stos_manifest", SCRIPT)
manifest = importlib.util.module_from_spec(spec)
spec.loader.exec_module(manifest)

OID = "a" * 40


class ManifestPolicyTests(unittest.TestCase):
    def test_allowed_public_paths(self):
        for path in ("index.html", "ecosystem/master-ecosystem-directory.json",
                     "assets/vnv-ecosystem-toolbar.js", "learning/course/index.html"):
            with self.subTest(path=path):
                self.assertTrue(manifest.safe_path(path))

    def test_protected_or_ambiguous_paths(self):
        for path in (".github/workflows/build.yml", "secrets/key.txt",
                     "assets/private/lesson.json", "admin/index.html",
                     "assets/.env.production", ".stos/state",
                     "assets/../index.html", "/index.html", "assets//x.js",
                     "assets\\x.js", "assets/é.html", "assets/x:y",
                     "runtime/cache.json", "node_modules/pkg/index.js"):
            with self.subTest(path=path):
                self.assertFalse(manifest.safe_path(path))

    def test_exact_commit_and_regular_files(self):
        data = b"hello world\n"
        tree = (f"100644 blob {'b' * 40}\tindex.html".encode() + b"\x00"
                + f"100644 blob {'c' * 40}\t.github/workflows/ci.yml".encode() + b"\x00"
                + f"120000 blob {'d' * 40}\tassets/link".encode() + b"\x00")
        def fake_git(*args):
            if args[:2] == ("rev-parse", "--verify"):
                return (OID + "\n").encode()
            if args[:2] == ("ls-tree", "-rz"):
                return tree
            if args[:2] == ("cat-file", "blob"):
                return data
            raise AssertionError(args)
        with patch.object(manifest, "git_bytes", side_effect=fake_git):
            record = manifest.plan_revision(OID)
        self.assertEqual(record["decision"], "UNAPPROVED")
        self.assertEqual(record["fileCount"], 1)
        self.assertEqual(record["excludedCount"], 2)
        self.assertEqual(record["files"][0]["sha256"], hashlib.sha256(data).hexdigest())
        self.assertEqual(len(record["manifestSha256"]), 64)

    def test_refuse_short_revision(self):
        with self.assertRaises(ValueError):
            manifest.plan_revision("a" * 7)


if __name__ == "__main__":
    unittest.main()
