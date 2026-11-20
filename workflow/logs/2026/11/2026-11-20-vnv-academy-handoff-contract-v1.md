# 2026-11-20 — VNV ↔ Academy Account Cloud Handoff Contract v1

**Type:** source-only contract · offline validator · test · decision
**Scope:** full VNV repository, no public index change, no private account data, no production STOS.
**Status:** proposal implementation committed; live runtime handoff and T03 commissioning HOLD.

## Design and bounded data
- `contracts/VNV_ACADEMY_ACCOUNT_CLOUD_HANDOFF_V1.json` defines a versioned proposal. `enabled=false`; `transport=NONE`; approved purpose `SOURCE_PROVENANCE_REVIEW`.
- The source-only envelope contains exactly `requestId`, `contractVersion`, `purpose`, `callerRepository`, `receiverRepository`, `sourceCommit`, `sourcePath`, `sourceSha256`, and `sourceBytes`.
- Only `workflow/README.md` and `STOS_PUBLIC_BRIDGE.md` from the VNV repository qualify for source review. This **does not authorize their transfer** to Academy.
- `tools/account-cloud-handoff-review.mjs` validates only structural consistency against the local, pinned contract. Successful output is `SHAPE_REVIEW_ONLY` with `authorized=false`, `transfer=false`, `writeActions=[]`, and `accountCloudCommissioned=false`.
- It deliberately does not authenticate GitHub principals, check remote SHA-256 bytes, accept payloads, create GitHub pull requests, connect to STOS, check replay cache, or authorize an account session.

## Security boundaries
- VNV remains public gateway/source owner; Academy Account Cloud remains protected contract owner; STOS native commissioning and family/learner account authority are distinct.
- No runtime account or personal learner data, cookies, session credentials, tokens, recovery codes, mutation authority, records or external service addresses are accepted by the proposal.
- The requestId is a nonsecret correlation identifier only; accepting a requestId does **not** establish uniqueness or freshness, and the reviewer has no persistent replay database.
- Fields not in the allowlist fail closed. Even syntactically valid proposals cannot initiate a write or transfer.
- Independent destination permission, runtime policy, audit, rollback, conflict control and explicit owner approval would be mandatory for any later transfer mechanism.

## Tests
- `tests/account-cloud-handoff-review.test.mjs`: seven synthetic Node tests for valid shape, prohibited extra metadata, wrong identity/purpose/version, invalid file refs, invalid envelopes, missing fields, and the second allowlisted source path.
- Existing caller, reconciliation, and ownership preview tests remain in the same isolated GitHub Actions job; commit-specific CI result appended separately after verified.

## Protection
- Existing VNV `index.html`, its ecosystem directory, Academy source repository, T01/T03, STOS registry, GitHub credentials and family records: **unchanged**.
- No new automatic sync, second account database, or user-side Mac instructions.
