# 2026-11-24 · Gateway directory and public HTTP certification

- **Repository:** vervenveda/vervenveda.github.io
- **Date/timezone:** 2026-11-24 · America/New_York
- **Types:** audit / repair / test / decision / follow-up
- **State:** TESTED for curated HTTP connectivity; HOLD for browser and security acceptance

## Objective and user decision
Incremental gateway hardening; retain approved desktop chrome and centered translator. Defer CSS consolidation until after security and governance. User authorized direct PR merges after verification. Update this journal without runtime changes.

## Scope and work performed
| Bubble | Evidence | State |
| --- | --- | --- |
| 02 | Gateway [PR 11](https://github.com/vervenveda/vervenveda.github.io/pull/11), merge 62f697831c1f780f208fc31f1ee90ae2afc45cfd; opt-in chrome probe updated; owner approved desktop screenshot | Desktop approved; mobile, keyboard and offline behavior HOLD |
| 03A | Gateway [PR 12](https://github.com/vervenveda/vervenveda.github.io/pull/12), merge ad94ef56afea399b788e92eb57aa019c24425647; canonical master first, Academy fallback | Merged |
| 03B | Academy mirror [PR 9](https://github.com/KhaemenesAcademy/vervenveda.github.io/pull/9), merge e8be0149548565ac43f273699c98388d136680b1; three matching registry blobs, 198 entries and 12,205 pages at merge | Snapshot parity verified; subsequent master growth to 12,208 pages observed, automatic mirror sync HOLD |
| 03C | PLERASearch [PR 1](https://github.com/vervenveda/PLERASearch.github.io/pull/1), merge 90a9882e18ce147f9c981047149c7b39816f213c; approved snapshot of 41 repository destinations; master-first refresh | Merged, file hash verified; browser runtime HOLD; no CI check results reported |
| 03D | Current master blob c2653cc86ad6be1992272d0c1bd7a9a1b8e0e05a; 41 complete repository trees inspected, 185/185 curated source paths found | PASS for source existence |
| 03E | Gateway [PR 13](https://github.com/vervenveda/vervenveda.github.io/pull/13), rebase result d7c81b662b2795ceecb4dd66a90c0582c24f3539; all three merged file hashes matched | PASS for audit instrument and curated HTTP connectivity |

## Verification and evidence
New instrument: `ecosystem/audit_live_public_links.py`, `ecosystem/tests/test_live_public_links.py`, `.github/workflows/public-http-link-audit.yml`. CI [audit](https://github.com/vervenveda/vervenveda.github.io/actions/runs/45508924549) and [instrument verification](https://github.com/vervenveda/vervenveda.github.io/actions/runs/45508924402) completed successfully on PR head 8f2fee9b9f77c4a8932a2384b66e56c4c0e6a47b. Repository permits rebase only; no settings changed.

Owner supplied the workflow artifact `public-http-audit.zip`, containing `public-http-audit.json` (88,520 bytes). Reopened and verified for this journal entry:
- Generated 2026-11-25T00:14:17.507011+00:00 (November 24, 19:14:17 EST).
- ZIP SHA-256: c62e44953762f425cb97d3e2148e01ee86acb9bf16eb3191fbb5af97394c2c50
- JSON SHA-256: a750dde168f76135c0b8482115ed3803ef6d966437bd299684aad6a3e05a3d9a
- Reported registry SHA-256: 65ac8497ddc04727e10396ba89492831f54be3143a2bce28c355e9f5bb482ae0
- Approved 185; checked 185; summary http-ok: 185; all final HTTP statuses 200.
- 75 direct responses; 110 single-hop HTTP 301 redirects from vervenveda.github.io to vervenveda.com preserving paths. No other redirect patterns found.
- No missing, possible-soft-404, network-error, access-review, transient or blocked-url results reported by this instrument.
- Raw ZIP remains with owner; this journal archives the verified digest and summary, not the full raw payload.

HTTP results are point-in-time only. No JavaScript execution, browser rendering, enrollment, authentication, storage continuity or full page-catalogue HTTP certification is implied. The soft-404 heuristic is limited to error titles.

## Security and STOS boundary
No account or learner records, credentials, storage migration, STOS commissioning or gateway CSS edits authorized in this journal update. Local admin shortcut is not authentication; independent authorization verification remains HOLD. HTTP workflow is manually triggered and read-only, with no automatic route repairs.

## Rollback and next work
- Journal-only rollback: revert the journal/index change through a reviewed PR; preserve earlier entries.
- Runtime rollback if separately required: review linked PRs individually, preserving subsequent dependent work and canonical master authority.
- Bubble 04: sovereignty, security, offline operation, admin authorization and external dependency audit.
- Bubble 05: controlled master-to-mirror synchronization, validate coherent catalogue snapshot before publication; consider recurring HTTP audit only after review.
- Bubble 01: defer CSS work; individual surgical changes only after explicit approval.
