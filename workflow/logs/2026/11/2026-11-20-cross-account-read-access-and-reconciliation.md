# 2026-11-20 — Cross-account read access and source reconciliation (v0.2)
**Types:** audit · upgrade · tests · decision
**Scope:** full VNV source, Academy private Account Cloud read access through connected GitHub accounts; no public gateway or runtime modifications.

## Authenticated access evidence
- Connected VNV GitHub account successfully read `vervenveda/vervenveda.github.io` with `main` commit `5cb11b68ee24026149c434ee8b0073e4b8bf2a96`. Inspected pinned files: `workflow/README.md` (Git blob `c59354a42593ae8867adf572e496233dcb5a9d30`) and `STOS_PUBLIC_BRIDGE.md` (Git blob `c1f11c64df790da3f4231bc0d091c479d64e6951`).
- Connected Academy GitHub account successfully read private `KhaemenesAcademy/Account-Cloud.github.io` with `main` commit `2c21b1fe9d8059eeb6e6b34f173e889d43b79a24`. Inspected pinned files: `STOS_INTAKE_MANIFEST.json` (Git blob `cbac89dc53d001006ebbbb8f6cc8f0ffda70c097`) and `contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md` (Git blob `90216c0833375ebf543c5bd7522b5229d8d9c28a`).
- Git blob SHA values above are Git identifiers, **not** SHA-256 hashes. The standalone Node caller calculates its own file SHA-256 when it has authorized local API access.
- **Boundary:** connected plugin authorization does not demonstrate a GitHub token is configured for the owner Mac's standalone Node caller. No new credential was created, copied, requested or displayed.

## Implemented v0.2 source-only additions
- `tools/account-cloud-reconcile-dry-run.mjs`: independently validates strict schema, exact repository names, approved file paths, byte bounds, SHA-256 format and both read reports. Outputs only a bounded source inventory; `proposedWrites=[]`, `authorizedTransfer=false`, `accountCloudCommissioned=false`.
- `tests/account-cloud-reconcile-dry-run.test.mjs`: five fail-closed synthetic tests, including access hold, repository substitution, invalid digest, unexpected files, and asserted transfer authority.
- Dedicated existing GitHub CI workflow extended to invoke original four mocked caller tests and new five manifest tests on changes.
- No syncing is inferred: compared files have distinct purposes and no approved equivalence mappings. Actual file-to-file diff, data migration, writes, or automatic mirroring remain OUT OF SCOPE.

## Pending
- Confirm new CI run for exact commit containing test and workflow changes.
- Execute `node tools/account-cloud-source-caller.mjs` and/or `node tools/account-cloud-reconcile-dry-run.mjs` on owner Mac **only if** an authorized private-read credential already exists, and inspect the redacted report.
- Separately obtain explicit approval for any future allowed transfer mapping and destination changes. No STOS/T03 commissioning.
