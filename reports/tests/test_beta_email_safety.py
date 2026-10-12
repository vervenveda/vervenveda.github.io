#!/usr/bin/env python3
"""Offline, dependency-free regression checks; never sends email."""
from pathlib import Path
import ast
import unittest

ROOT = Path(__file__).resolve().parents[2]

class BetaEmailSafety(unittest.TestCase):
    def test_smtp_script_syntax(self):
        ast.parse((ROOT / "reports/send-daily-admin-report.py").read_text(encoding="utf-8"))

    def test_encrypted_smtp_and_recipient_guard(self):
        code = (ROOT / "reports/send-daily-admin-report.py").read_text(encoding="utf-8")
        self.assertIn('security not in {"starttls", "ssl"}', code)
        self.assertIn('vervenveda@proton.me', code)
        self.assertIn('accepted by SMTP', code)

    def test_beta_requires_verified_receipt(self):
        html = (ROOT / "beta/index.html").read_text(encoding="utf-8")
        self.assertIn('response?.ok!==true', html)
        self.assertIn('response.receiptId', html)
        self.assertIn('No verified administrator delivery occurred', html)
        self.assertIn('REPORT_SCHEMA="vnv-beta-report-v1"', html)
        self.assertNotIn('const GITHUB_TOKEN', html)
        self.assertNotIn('api.github.com/repos/', html)

    def test_stos_is_not_beta_dependency(self):
        html = (ROOT / "beta/index.html").read_text(encoding="utf-8")
        self.assertNotIn('ss01.sock', html)
        self.assertNotIn('~/.local/share/stos', html)

if __name__ == "__main__":
    unittest.main()
