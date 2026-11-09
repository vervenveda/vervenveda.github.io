# GitHub Master → Gateway / STOS synchronization contract
Date: 2026-11-09
Status: REVIEW ONLY — NOT COMMISSIONED

## Authority and boundaries

- **Master**: `vervenveda/vervenveda.github.io`, branch `main`.
- **Public front door**: `KhaemenesAcademy/vervenveda.github.io`, branch `main`.
- **Sovereign target**: existing full Vervenveda repository within STOS; its storage identifier and authorized commissioning interface remain **unverified on the GitHub side**.
- No downstream copy has automatic write authority over the GitHub Master.
- Gateway receives **only the full bytes of `index.html`**. Its supporting assets, migration-wave files, workflows, and local documentation remain independently owned.
- STOS is intended to receive the **complete approved tracked source tree** from the master, not merely `index.html`, subject to STOS's own admission and safety policies.

## Gateway index-only publisher

1. Check out the gateway and read `index.html` from the public master using read-only HTTPS.
2. Compare Git blob hashes and identify a last common `index.html` blob in both histories.
3. If hashes match: no action. If only the master advanced from the common blob: stage and commit **only** the exact master `index.html` bytes into the gateway.
4. If the gateway was independently edited, including when the master is unchanged: **HOLD**. Never overwrite downstream work; never push downstream changes to master.
5. If no common baseline is provable, or integrity/race checks fail: **HOLD**.
6. Only the gateway's own workflow token can write to the gateway. It has no master write credential.
7. GitHub Actions cron is best-effort, not instantaneous. No claim of live synchronization until the reviewed workflow is merged, permissions work, and the first guarded receipt passes.

**Existing migration-wave caution:** the gateway's Wave 04 source-integrity check pins `index.html` to blob `a883f035329a89e55d526160c54ffdac3c7af2f9`. Reconcile those checks before approving a future master homepage revision. Do not disable protections indiscriminately.

## STOS full-tree consumer (handoff — no GitHub-to-STOS authority assumed)

The producer is the master source revision. A **read-only source manifest** should identify:
- Master repository, exact commit, parent revisions, generation time, and tracked-file list.
- For each tracked file: normalized relative path, Git blob ID and SHA-256 content digest, type/size, and policy decision.
- File additions, modifications and deletions relative to the **last STOS-acknowledged revision**.
- A manifest digest, signing/approval evidence, target terminal identity (only inside STOS), and a recovery reference.
- Exclusion/denial reason for unsafe material. A "full mirror" does NOT override restrictions on secrets, private data, operational credentials, local state, terminal configuration, or executable activation.

STOS alone authenticates the publisher, verifies every byte, holds a rollback snapshot, applies a staged atomic update through its authorized local interface and publishes a signed acceptance/rejection receipt. A missing receipt or conflict means **NOT SYNCHRONIZED**.

Do not turn a public GitHub workflow into a direct STOS administrator, embed STOS access material in files, or enable GitHub remote writes to STOS. GitHub workflow metadata, if mirrored, is inert data and not automatically executable by STOS.

## Cross-system convergence states

- `MATCH`: the exact accepted source revision and all admissible bytes match.
- `PENDING`: newer master revision exists but no accepted STOS receipt.
- `CONFLICT`: STOS local edits or protected paths require owner review.
- `REJECTED`: validation/policy failed, no replacement applied.
- `DORMANT`: STOS target or authority not commissioned.

## Academy synchronization is separate

Khaemenes Academy uses its **own** master/front-door relationship. Do not infer that its two existing GitHub `index.html` files are byte-identical; they currently serve different routes. The Academy gateway's public and account-cloud continuity must be verified before introducing any mirroring.

## Invariants

- Never auto-write to either master from downstream environments.
- Never alter the live domain/DNS as a side effect of sync.
- Never alter the Vervenveda master `index.html` to implement sync.
- Never delete gateway-local assets to force repository parity.
- No STOS import, startup, or commissioning from a GitHub-side change.
