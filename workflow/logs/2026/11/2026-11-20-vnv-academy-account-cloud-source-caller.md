# 2026-11-20 · VNV → Academy Account Cloud source caller recovered and built

**Type:** implementation · security gate · test · decision
**Repository:** `vervenveda/vervenveda.github.io`
**Scope:** source-only. **Real GitHub private-account read:** not performed by this workflow. **Transfer/commissioning:** HOLD.

## Source change
- `tools/account-cloud-source-caller.mjs`: Node standard library; exact two-repository identity allowlist, read-only GitHub API GET, pinned commit ref, bounded four-file allowlist, SHA-256 fingerprints, sanitized failures and fail-closed report.
- `tests/account-cloud-source-caller.test.mjs`: four synthetic tests for read-only two-repository success, denied private repo, repository substitution and rejected non-file response.
- `.github/workflows/account-cloud-source-caller-tests.yml`: isolated mock-only Node test job; `contents: read`; no configured private credentials, network read or write to Academy Account Cloud.
- `tools/ACCOUNT_CLOUD_SOURCE_CALLER.md`: operator boundary and instructions.
- **No** modification to `index.html`, public cloud gateway, live Academy, T01/T03, protected records, GitHub credentials or STOS runtime.

## Evidence / interpretation
GitHub source commits: `8b2be8537e8a2817053a9f46f8de5e3e720a62e6` (caller), `b986b04fd2c7c78ae073cff0c24e03071efaf846` (tests), `9a2efc2123dfc57fe0a744c010dba36b344434d5` (CI workflow). Await exact-SHA CI result before labeling mock test PASS.

This caller is **not** a cross-account installation or source mirroring authority. On a trusted owner terminal, a private Academy read requires an already approved read-only credential. Lack of such access returns HOLD, not a requested permissions escalation.

## Next gates
1. Verify synthetic test CI success against exact SHA and record run ID.
2. Optional owner-authorized local source inspection with read access to both repositories; preserve a redacted report and file hashes only.
3. Compare desired allowlisted source transfer paths and establish an explicit dry-run manifest, review/approval, and rollback requirements in a separate future proposal.
4. Keep actual source writes, bidirectional sync, STOS T03, and student account migrations disabled.

## CI acceptance addendum
GitHub Actions run [44828308513](https://github.com/vervenveda/vervenveda.github.io/actions/runs/44828308513) finished `completed/success` at exact head SHA `9a2efc2123dfc57fe0a744c010dba36b344434d5`. This covers the four synthetic, mock-only read boundary tests. It does **not** verify authenticated private Academy access, authorize source transfer, or commission STOS.
