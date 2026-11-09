# GitHub-source vs STOS-acceptance receipt contract

Status: Proposed interface; read-only GitHub evidence; STOS uncommissioned for this handoff.

A GitHub commit, archive, checksum, or passed workflow proves **source provenance**, not a sovereign STOS admission. Never use a GitHub-hosted field to self-certify that STOS accepted an import.

## Independent evidence stages

| Stage | Producing authority | Evidence | Allowed claim |
|---|---|---|---|
| SOURCE_IDENTIFIED | GitHub Master | Full immutable commit ID and Git tree OID | Exact source revision exists |
| SOURCE_MANIFESTED | GitHub Master audit | Proposed manifest plus SHA256 of manifest and eligible source files | Export candidate accounted for |
| SOURCE_REVIEWED | Owner's review process | Explicit release approval; signed release policy when available | Approved for authorized STOS evaluation |
| STOS_STAGED | STOS native intake | Native authenticated staging receipt | Bytes were staged, **not activated** |
| STOS_ACCEPTED | STOS sovereign authority only | Authenticated signed receipt tied to source revision, digest, destination snapshot, and policy | Exact version accepted |
| STOS_ACTIVE | STOS commissioned runtime only | Separate runtime activation receipt and health evidence | Activated and verified |

## Mandatory reconciliation fields

- `sourceRepository`, `sourceCommit`, `sourceTreeOid`
- `manifestSha256`, `sourceFileCount`, `policyVersion`
- `targetIdentity` (held and authenticated *within STOS*, not in public reports)
- `sourceRevisionBefore`, `sourceRevisionAfter` (native target receipt, not a GitHub assumption)
- `receiptKind`, `receiptId`, `issuedAt`, `authorityProof`
- `decision`: one of PENDING / REJECTED / ACCEPTED / ACTIVE
- `protectedLocalStatePreserved` and `rollbackReference` (native-only evidence)
- `verificationStatus`: UNVERIFIED until STOS validates authority and signature independently

## Fail-closed conditions

- STOS receipt missing, invalid, inconsistent, expired, untrusted or for a different source revision.
- Manifest is unsigned/unapproved or any protected file appears.
- STOS current snapshot differs from expected and approval does not specify reconciliation.
- A partial transfer, unordered delete, or unacknowledged write occurs.

Do not publish secrets, native terminal internals, protected target paths, actual credentials, or privileged receipts to the public GitHub repository. Publish only a redacted, nonauthoritative acknowledgement digest if STOS expressly permits it.

## Example public status

```json
{
  "sourceRepository": "vervenveda/vervenveda.github.io",
  "sourceCommit": "SOURCE_COMMIT_TO_BE_FILLED",
  "sourceManifest": "PROPOSED_ONLY",
  "stosIntake": "NOT_VERIFIED",
  "stosActivation": "NOT_VERIFIED",
  "synchronization": "PENDING"
}
```

No runtime sync, authority delegation, or DNS migration is performed by this contract.
