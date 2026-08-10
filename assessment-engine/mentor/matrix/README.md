# Repair 10 — Mentor Matrix Validator

Repair #10 adds an automated audit layer over the existing Mentor federation.

## What it checks

### Registry structure
- duplicate repository records;
- duplicate `sourceId` authorities;
- recommendable repositories without a valid manifest;
- classified but unmanifested repositories;
- duplicate resource IDs;
- duplicate URLs claimed by different source authorities;
- resource/source/repository authority mismatches.

### Source freshness
For every currently manifested repository, the validator asks GitHub for the current root manifest SHA and compares it with the SHA stored in `ecosystem-repositories.json`.

A mismatch means the source manifest changed after the central registry snapshot and the registry should be rebuilt.

This is already relevant after Repair #8 because Medicament and Khaemenes High were updated after the current central registry snapshot.

### Routes
Every current `recommendable !== false` resource URL is checked.

A failed route is an error because Mentor should not recommend a broken destination.

### Repair #9 objective map
The Matrix validates:
- unique taxonomy objective IDs;
- every override objective reference;
- lesson-anchor objective references;
- stage/subject objective references;
- context-example objective references;
- valid alignment values;
- support/transfer/exploration resources are never marked as mastery evidence;
- curated overrides that no longer resolve to the current generated registry.

### Deep orphan scan
The optional Deep scan also queries each manifested repository tree for likely public app/game/tool entrypoints:
- `apps/`
- `games/`
- `tools/`
- `Protools/`
- root `*_index.html`
- top-level academy gateways

Lesson/assessment/unit files are deliberately excluded to avoid treating ordinary course pages as independent Mentor resources.

A candidate not represented in the source manifest is:
- **warning** for a full inventory;
- **info** for a provisional/partial inventory.

### Nested manifests
Deep scan also finds nested `mentor-manifest.json` files.

Allowed:
- `mentorSearchable: false`
- `inventoryAuthority: delegated-to-root`
- or `delegatedTo` matching the root source.

Flagged:
- active nested manifests that create competing or undocumented authority.

## Browser use

Open:

`https://vervenveda.com/assessment-engine/mentor/matrix/`

The Standard audit runs automatically.

Use **Run Deep Orphan Scan** only when you want repository-tree inspection.

## Node use

Standard:

```bash
node matrix-validator.mjs
```

Deep:

```bash
node matrix-validator.mjs --deep
```

Optional authenticated GitHub API use:

```bash
GITHUB_TOKEN=... node matrix-validator.mjs --deep
```

A token is not required for normal public operation, but GitHub's unauthenticated API rate limit can constrain a large deep scan.

## Important

Repair #10 reports problems. It does not automatically delete, move, rename, de-list, or rewrite source repositories.

That keeps authority with the repository owner and prevents an automated audit from making destructive curriculum decisions.
