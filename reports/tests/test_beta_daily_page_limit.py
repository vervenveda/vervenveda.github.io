#!/usr/bin/env python3
"""Offline checks: distinct Beta issues retain stable IDs and safe retry semantics."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
BETA = ROOT / "beta" / "index.html"
TOOLBAR = ROOT / "assets" / "vnv-ecosystem-toolbar.js"

class BetaIssueIdentity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = BETA.read_text(encoding="utf-8")
        cls.toolbar = TOOLBAR.read_text(encoding="utf-8")

    def test_historical_records_remain_intact(self):
        self.assertIn('DAILY_LIMIT_KEY="vervenveda_beta_daily_page_limit_v1"', self.html)
        self.assertIn('function existingDailyReport()', self.html)
        self.assertIn('function claimDailyReport(report)', self.html)
        self.assertIn('function outbox()', self.html)

    def test_new_report_has_independent_issue_id(self):
        self.assertIn('let activeReportId=null;', self.html)
        self.assertIn('const reusable=activeReportId?outbox().find(item=>item.id===activeReportId):null;', self.html)
        self.assertIn('id:uid()', self.html)
        self.assertIn('dailySlotKey(base.date,base.sourceKey,base.id)', self.html)
        self.assertIn('idempotencyKey:report.dailyKey', self.html)

    def test_reopening_explicitly_selects_issue(self):
        self.assertIn('activeReportId=item.id;', self.html)
        self.assertIn('Reopen / Retry', self.html)
        self.assertIn('Update / Retry Selected Issue', self.html)
        self.assertIn('persistDailyReport(report,"email-prepared")', self.html)
        self.assertIn('persistDailyReport(report,"ready")', self.html)

    def test_new_issue_does_not_erase_existing_outbox(self):
        clear = self.html.split('clearBtn.addEventListener("click"', 1)[1].split(
            'form.addEventListener("submit"', 1)[0]
        self.assertIn('activeReportId=null;', clear)
        self.assertIn('localStorage.removeItem(DRAFT_KEY)', clear)
        self.assertNotIn('localStorage.removeItem(OUTBOX_KEY)', clear)
        self.assertNotIn('localStorage.removeItem(DAILY_LIMIT_KEY)', clear)

    def test_public_source_excludes_query_and_fragment(self):
        self.assertIn('function betaPublicSource()', self.toolbar)
        self.assertIn('const pathname=decodeURIComponent(url.pathname);', self.toolbar)
        self.assertIn('encodeURIComponent(source)', self.toolbar)
        self.assertNotIn('encodeURIComponent(location.href)', self.toolbar)

    def test_no_broken_print_script_boundary(self):
        self.assertEqual(self.html.count('<script>'), 1)
        self.assertEqual(self.html.count('</script>'), 1)

if __name__ == "__main__":
    unittest.main()
