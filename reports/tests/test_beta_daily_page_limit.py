#!/usr/bin/env python3
"""Regression checks for the Beta one-report-per-page-per-day boundary."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
BETA = ROOT / "beta" / "index.html"

class BetaDailyPageLimit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = BETA.read_text(encoding="utf-8")

    def test_daily_limit_storage_contract_exists(self):
        self.assertIn('DAILY_LIMIT_KEY="vervenveda_beta_daily_page_limit_v1"', self.html)
        self.assertIn('function sourceKeyFromQuery()', self.html)
        self.assertIn('function dailySlotKey(', self.html)
        self.assertIn('function existingDailyReport()', self.html)
        self.assertIn('function claimDailyReport(report)', self.html)

    def test_report_creation_reuses_daily_record(self):
        self.assertIn('function buildDailyReport(text)', self.html)
        self.assertIn('const reusable=existing||', self.html)
        self.assertIn('persistDailyReport(report,"email-prepared")', self.html)
        self.assertIn('persistDailyReport(report,"ready")', self.html)
        self.assertNotIn('const report=same?current:{schema:REPORT_SCHEMA,id:uid()', self.html)

    def test_daily_key_is_source_plus_date(self):
        self.assertIn('return `${date}|${sourceKey}`', self.html)
        self.assertIn('sourceKey:report.sourceKey', self.html)
        self.assertIn('idempotencyKey:report.dailyKey', self.html)

    def test_same_daily_report_can_be_updated_or_retried(self):
        self.assertIn("Update / Retry Today\'s Report", self.html)
        self.assertIn("a second report will not be created", self.html)
        self.assertIn("Reopen / Retry", self.html)

    def test_daily_claim_is_not_removed_by_clear_draft(self):
        clear_fragment = self.html.split('clearBtn.addEventListener("click"', 1)[1].split('form.addEventListener("submit"', 1)[0]
        self.assertIn('localStorage.removeItem(DRAFT_KEY)', clear_fragment)
        self.assertNotIn('localStorage.removeItem(DAILY_LIMIT_KEY)', clear_fragment)

if __name__ == "__main__":
    unittest.main()
