# Verve N Veda → Khaemenes Academy Account Cloud source caller (v0.1)

**Status:** read-only provenance preflight; not GitHub cross-account authorization, not source sync, not an STOS account service.

## Purpose and trust boundary
The full VNV repository owns a local operator-only source inspector that reads four allowlisted, non-secret source/contract files from exactly two GitHub repositories. It pins reads to each repository's resolved branch commit SHA, derives SHA-256 file fingerprints and emits a redacted JSON review report. It does not write to either GitHub account, deploy, store tokens, run in a browser, grant inter-account rights, create STOS namespaces, or modify student records.

Pinned endpoints:
- `vervenveda/vervenveda.github.io` (public): `workflow/README.md`, `STOS_PUBLIC_BRIDGE.md`
- `KhaemenesAcademy/Account-Cloud.github.io` (private): `STOS_INTAKE_MANIFEST.json`, `contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md`

## Local invocation
From a trusted terminal, in an approved local clone of the **full VNV repo**:

```sh
node tools/account-cloud-source-caller.mjs
```

The VNV public source typically requires no token; a private Academy Account Cloud source read requires existing credentials with **read access only**. The caller recognizes `ACADEMY_GITHUB_TOKEN` and optional `VNV_GITHUB_TOKEN` as process environment variables. Do not paste tokens in chat, place them in files in the repository, put them in shell history, or add them to public GitHub Actions. Tokens are never printed, and the tool makes no authenticated request to any non-GitHub host.

**Preferred first run:** run the safe synthetic tests, which use a mocked GitHub API and require no credentials:

```sh
node --test tests/account-cloud-source-caller.test.mjs
```

Only if a suitable authorized read credential already exists should the owner run the real preflight in the trusted terminal. Failure to read the Academy private repository produces `HOLD`; it does not grant missing permissions.

## Report meaning
- `READ_ONLY_VERIFIED`: exact GitHub repository identity and allowlisted source bytes were read at a pinned commit.
- `HOLD`: missing access, inconsistent identity, absent files or failed validation. No fallback to a different repository.
- `bothReadable` is **not** transfer authorization. `authorizedTransfer` and `accountCloudCommissioned` stay false by construction.
- File SHA-256 is only a provenance fingerprint; different files across VNV/Academy are not expected to have identical hashes.
- Output contains only repository identifiers, visibility, branch, commit, file path, byte counts and hashes; no document bodies or secret values.

## Explicitly out of scope
No direct GitHub account-to-account grant, bidirectional sync, automatic mirroring, runtime storage access, T03 commissioning, family data, personal account migration, or Verve N Veda `index.html` edits. Future approved handoff needs an explicit signed allowlist, destination branch authorization, an independent dry-run diff, source/target SHAs, rollback snapshot, and owner approval.
