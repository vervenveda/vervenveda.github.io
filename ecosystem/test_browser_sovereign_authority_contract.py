#!/usr/bin/env python3
"""Read-only contract invariants and synthetic negative decisions.

This is NOT an authentication implementation, server test, or STOS authority.
"""
from __future__ import annotations
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "ecosystem/browser-sovereign-authority-contract.json"
CLIENT_ALLOW = {"allow-local", "navigation-hint-only", "request-only", "no-direct-access", "deny"}
PROTECTED = {
    "student-route-selection", "beta-report-submission", "student-progress-read",
    "student-progress-write", "account-record-change", "admin-workspace-access",
    "sovereign-storage-mutation", "terminal-commissioning",
}
def synthetic_decision(operation, *, authenticated=False, authorized=False,
                       owner_verified=False, endpoint_approved=False,
                       browser_unlocked=False, browser_learner_selected=False):
    """A deliberately simple oracle for policy regression fixtures, not a deployed guard."""
    del browser_unlocked, browser_learner_selected
    if operation["client"] == "deny":
        return False
    if operation["client"] == "no-direct-access":
        return False
    if operation["protectedAuthority"]:
        return authenticated and authorized and owner_verified and endpoint_approved
    return operation["client"] == "allow-local"

class BrowserAuthorityContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.ops = {o["id"]: o for o in cls.data["operationClasses"]}

    def test_default_deny(self):
        self.assertEqual(self.data["defaultPolicy"], "deny")
        self.assertEqual(self.data["deploymentStatus"], "not-enforced-by-this-file")
        self.assertFalse(self.data["browser"]["mayAuthorizePrivilegedOperations"])
        self.assertFalse(self.data["browser"]["mayProvideVerifiedIdentity"])

    def test_unique_operation_ids_and_known_modes(self):
        self.assertEqual(len(self.ops), len(self.data["operationClasses"]))
        self.assertTrue(all(o["client"] in CLIENT_ALLOW for o in self.ops.values()))
        self.assertTrue(PROTECTED.issubset(self.ops))
        for name in PROTECTED:
            self.assertTrue(self.ops[name]["protectedAuthority"])

    def test_public_features_continue_locally(self):
        for name in ("public-navigation", "public-directory-search", "public-translation", "local-ui-preferences"):
            with self.subTest(operation=name):
                self.assertTrue(synthetic_decision(self.ops[name]))

    def test_untrusted_local_unlock_never_grants_authority(self):
        for name in ("admin-workspace-access", "account-record-change", "student-progress-read"):
            with self.subTest(operation=name):
                self.assertFalse(synthetic_decision(self.ops[name],
                    browser_unlocked=True, browser_learner_selected=True))

    def test_identity_without_resource_authorization_denied(self):
        for name in ("student-progress-read", "student-progress-write", "account-record-change"):
            with self.subTest(operation=name):
                self.assertFalse(synthetic_decision(self.ops[name], authenticated=True,
                    authorized=True, owner_verified=False, endpoint_approved=True))

    def test_unapproved_endpoints_denied(self):
        self.assertFalse(synthetic_decision(self.ops["beta-report-submission"],
            authenticated=True, authorized=True, owner_verified=True,
            endpoint_approved=False))
        self.assertFalse(self.data["serviceEndpoints"]["allowArbitraryBrowserChosenProtectedEndpoints"])

    def test_browser_never_executes_native_operations(self):
        for name in ("sovereign-storage-mutation", "terminal-commissioning"):
            with self.subTest(operation=name):
                self.assertFalse(synthetic_decision(self.ops[name], authenticated=True,
                    authorized=True, owner_verified=True, endpoint_approved=True))
        self.assertFalse(self.data["stos"]["browserCommissioningAllowed"])
        self.assertFalse(self.data["stos"]["browserVaultAccessAllowed"])

    def test_protected_authority_must_remain_external(self):
        p=self.data["protectedServices"]
        for key in ("requireServerAuthentication", "requirePerOperationAuthorization",
                    "validateResourceOwnership", "rejectBrowserLocalUnlockClaims",
                    "rejectUnapprovedServiceEndpoints", "auditConsequentialOperations",
                    "requireSeparateNativeExecutionAuthority"):
            self.assertTrue(p[key], key)
        self.assertFalse(self.data["governance"]["noemaMayExecute"])
        self.assertFalse(self.data["evidence"]["contractIsAuthorization"])
        self.assertTrue(self.data["evidence"]["liveAuthenticationAndOwnershipTestsPending"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
