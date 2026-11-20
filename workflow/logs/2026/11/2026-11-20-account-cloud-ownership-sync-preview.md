# 2026-11-20 — VNV ↔ Account Cloud ownership-aware synchronization preview

**Type:** audit · source-only tool · synthetic test · decision
**Mode:** READ_ONLY_PREVIEW. No GitHub cross-account writes, no STOS calls, no account records, no browser deployment changes.

## Read-only scope and observed ownership
Source inspected through connected GitHub permissions:
- `vervenveda/vervenveda.github.io` owns `workflow/README.md` and `STOS_PUBLIC_BRIDGE.md` and the operator-only caller.
- `KhaemenesAcademy/Account-Cloud.github.io` owns `STOS_INTAKE_MANIFEST.json`, `contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md`, and its native STOS adapter contract.
- VNV's public STOS bridge documents navigation, explicitly no sensitive service names or credentials; Account Cloud manifest says pre-intake, `productionDataAllowed=false`, `githubRuntimeAuthority=false`.
- These four allowlisted files have different responsibilities. **No path equivalence or approved file transfer mapping identified.** No attempt to copy or compare private records.

## Implementation
- `tools/account-cloud-sync-preview.mjs`: consumes source caller → strict reconciliation result; assigns exact repository ownership and `KEEP_SOURCE_ONLY` decision per allowlisted source; verifies pinned commit and SHA-256 syntax; emits `proposedWrites=[]`, `transferAuthorized=false`, `automatedSync=false`, `accountCloudCommissioned=false`.
- `tests/account-cloud-sync-preview.test.mjs`: six synthetic tests for ownership classification, denial of proposed writes, wrong repo, unauthorized paths/duplicates, hash/authorization errors, and incomplete evidence.
- `.github/workflows/account-cloud-source-caller-tests.yml` extended to include these alongside prior caller/reconciliation tests.
- There is no real cross-account read from the standalone Mac Node process in this workflow. Connected GitHub read permissions were previously inspected separately.

## Preview decision
| Source | Ownership | Preview decision |
| --- | --- | --- |
| VNV workflow README | VNV | KEEP_SOURCE_ONLY |
| VNV STOS public bridge | VNV | KEEP_SOURCE_ONLY |
| Account Cloud STOS intake manifest | Academy Account Cloud | KEEP_SOURCE_ONLY |
| Account Cloud protocol v2 | Academy Account Cloud | KEEP_SOURCE_ONLY |

**Review inventory:** 4 source items; proposed mirrors: 0; approved transfers: 0. This is not evidence that the accounts are automatically connected or that STOS T03 is commissioned.

## Acceptance and follow-up
- Exact SHA CI execution: record separately after run finishes, never infer PASS from source presence.
- Any future *source* bridge should be a new expressly approved allowlisted artifact, not an overwrite of either repository's authoritative contracts.
- Production identity, credential and student records remain under independent native commissioning controls.
- Main VNV `index.html` and ecosystem directory untouched.

## Exact-commit CI acceptance
- [GitHub Actions run 44830261754](https://github.com/vervenveda/vervenveda.github.io/actions/runs/44830261754) returned `completed/success` for commit `ae93526d4b2c6e08cbdf9eca1bd5af5176d9eedf`, containing the preview source, tests and workflow updates.
- CI scope: four caller tests, five reconciliation tests, six preview tests (15 synthetic cases total in the job). This is a mock/source-only acceptance, not a live cross-account deployment or STOS runtime test.
