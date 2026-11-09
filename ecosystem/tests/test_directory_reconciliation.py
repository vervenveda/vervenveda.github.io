"""Pure, offline regression tests for scope-aware directory evidence reconciliation."""
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "reconcile_directory_evidence.py"
spec = importlib.util.spec_from_file_location("vnv_reconcile", SCRIPT)
reconcile_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reconcile_module)


class EvidenceReconciliationTests(unittest.TestCase):
    def fixture(self):
        entries = [
            {"repository": "vervenveda/public.github.io", "status": "active",
             "directoryVisible": True, "access": "free-public"},
            {"repository": "artist1970/mentor.github.io", "status": "active",
             "directoryVisible": True, "access": "free-public"},
            {"repository": "vervenveda/internal.github.io", "status": "internal",
             "directoryVisible": False, "access": "free-public"},
        ]
        master = {"entryCount": len(entries), "entries": entries}
        sync = {"generatedAt": "2026-11-09T07:12:05Z", "account": "vervenveda",
                "syncedRepositoryCount": 1, "syncedRepositories": ["vervenveda/public.github.io"],
                "publicPageCount": 100, "catalogExcludedHtmlCount": 20, "driftCount": 0}
        nav = {"generatedAt": "2026-11-09T13:53:15Z",
               "summary": {"repositoryCount": 2, "htmlCount": 135, "brokenLocalLinkCount": 2},
               "repositories": [{"repository": "vervenveda/public.github.io"},
                                {"repository": "artist1970/mentor.github.io"}]}
        return master, sync, nav

    def test_cross_owner_differences_do_not_fail_reconciliation(self):
        result = reconcile_module.reconcile(*self.fixture())
        self.assertTrue(all(result["checks"].values()))
        self.assertEqual(result["scopeDifferences"]["approvedNotInPublicSync"],
                         ["artist1970/mentor.github.io"])
        self.assertEqual(result["publicSync"]["cataloguedPagesReported"], 100)
        self.assertEqual(result["navigation"]["htmlReported"], 135)

    def test_missing_navigation_repo_is_detected(self):
        master, sync, nav = self.fixture()
        nav["repositories"].pop()
        nav["summary"]["repositoryCount"] = 1
        result = reconcile_module.reconcile(master, sync, nav)
        self.assertFalse(result["checks"]["navigationScopeMatchesApproved"])

    def test_unapproved_synced_repository_is_detected(self):
        master, sync, nav = self.fixture()
        sync["syncedRepositories"].append("vervenveda/unknown.github.io")
        sync["syncedRepositoryCount"] = 2
        result = reconcile_module.reconcile(master, sync, nav)
        self.assertFalse(result["checks"]["syncedRepositoriesAreApproved"])

    def test_stale_report_count_is_detected(self):
        master, sync, nav = self.fixture()
        nav["summary"]["repositoryCount"] = 900
        result = reconcile_module.reconcile(master, sync, nav)
        self.assertFalse(result["checks"]["reportCountsConsistent"])


if __name__ == "__main__":
    unittest.main()
