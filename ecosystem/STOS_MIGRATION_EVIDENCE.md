# Verve N Veda — STOS Migration Evidence (Source Only)

This is a **read-only GitHub source inventory**, not STOS approval, proof of sandboxing, a deployed service, a key escrow, or a family-account backup.

## Manual evidence procedure

The manual `Vervenveda Pre-Migration Integrity Gate` workflow runs the existing source-contract preflight and `ecosystem/migration_source_seal.py`. Its downloadable audit artifact contains:

- `source-integrity-manifest.json`: existing critical-source integrity contract.
- `tracked-source-seal.json`: SHA-256 and byte lengths for **all tracked regular files**, pinned to the Git commit and Git tree.
- `stos-compatibility-ledger.json`: source-code indicators for storage, runtimes, networking, and embedded pages; every STOS status is deliberately **unverified**.

The seal is a content fingerprint, **not a signature** or independent proof of code provenance. Evidence must be produced from an approved checkout and reviewed before migration. It does not touch browser storage, personal Directory AGI overlays, family vaults, or production STOS.

## Change-control boundary

The bulk toolbar normalizer must not rewrite the protected root `index.html`. It may inspect eligible non-protected HTML under its established eligibility rules. No automatic code-migration or third-party replacement is authorized by the evidence workflow.

## Promotion rules

1. Inventory the *actual* STOS import using STOS authorization and sandbox requirements.
2. Compare both source trees using pinned revisions and file hashes.
3. Preserve STOS-only changes, runtime secrets, independent cloud state, and educational records.
4. Review compatibility gaps and complete sandboxed tests.
5. Obtain human approval and independent STOS authorization before any promotion.

A GitHub workflow is an external CI process, **not a STOS sandbox**. This source-audit workflow performs no STOS execution or account writes.

## Browser-to-sovereign authority evidence gate

The source-only contract at `ecosystem/browser-sovereign-authority-contract.json` declares a default-deny boundary: browser local state is never verified identity, administrative authority, resource ownership, paid entitlement or terminal commissioning approval. Public navigation, directory search, translation and local UI preferences remain available.

The manual pre-migration workflow also runs `ecosystem/test_browser_sovereign_authority_contract.py` using synthetic fixtures. Its negative tests cover local unlock impersonation, cross-family authorization gaps, arbitrary report endpoints and direct terminal/storage actions; the exercises do **not** contact or certify any production account endpoint.

Before genuine cross-device Academy persistence or Mother–Child Cloud provisioning, separate STOS-side integration tests must prove authenticated sessions, per-family ownership, approved endpoint routing, durable audit receipts, and fail-closed native authority. T01 and all uncommissioned terminals remain untouched by this contract.
