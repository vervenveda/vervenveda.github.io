"""Regression checks for public navigation path normalization (stdlib only)."""
import importlib.util
import tempfile
import unittest
from pathlib import Path

AUDITOR_PATH = Path(__file__).resolve().parents[1] / "audit_public_navigation.py"
spec = importlib.util.spec_from_file_location("vnv_navigation_audit", AUDITOR_PATH)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class NavigationPathTests(unittest.TestCase):
    def test_gateway_root_relative_cloud_route(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / "vervenveda.github.io"
            (root / "cloud").mkdir(parents=True)
            (root / "cloud" / "index.html").write_text("public gateway", encoding="utf-8")
            source = root / "index.html"
            source.write_text('<a href="/cloud/">Cloud</a>', encoding="utf-8")
            self.assertEqual(audit.normalize_candidate(root, source, "/cloud/"), root / "cloud" / "index.html")

    def test_gateway_root_relative_directory_route(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / "vervenveda.github.io"
            path = root / "core" / "directory-agi" / "index.html"
            path.parent.mkdir(parents=True)
            path.write_text("directory", encoding="utf-8")
            self.assertEqual(audit.normalize_candidate(root, root / "index.html", "/core/directory-agi/"), path)

    def test_gateway_does_not_claim_child_repository(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / "vervenveda.github.io"
            root.mkdir()
            self.assertIsNone(audit.normalize_candidate(
                root, root / "index.html", "/Khaemenes_Academy.github.io/student/"
            ))

    def test_project_root_relative_assets_are_not_local(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / "Khaemenes_Academy.github.io"
            root.mkdir()
            self.assertIsNone(audit.normalize_candidate(root, root / "index.html", "/assets/vnv-ecosystem-menu.js"))

    def test_linguistics_week_return_is_specific_to_course(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / "Khaemenes_Linguistics.github.io"
            course = root / "Halls" / "courses" / "arabic-1"
            source = course / "week-01" / "index.html"
            source.parent.mkdir(parents=True)
            (course / "index.html").write_text("Arabic I", encoding="utf-8")
            self.assertEqual(audit.normalize_candidate(root, source, "../index.html"), course / "index.html")


if __name__ == "__main__":
    unittest.main()
