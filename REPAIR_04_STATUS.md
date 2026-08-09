# Repair 04 — Ecosystem Registry Promotion

Date: 2026-08-09

## Purpose

Make the generated three-account Mentor registry accurately recognize source-owned manifests and preserve the richer metadata now carried by those manifests.

## Files to upload

Replace these three files in `vervenveda/vervenveda.github.io`:

1. `assessment-engine/mentor/discovery/resource-normalizer.js`
2. `assessment-engine/mentor/discovery/build-resource-index.mjs`
3. `assessment-engine/mentor/tests/resource-normalizer.test.mjs`

Do not manually edit:
- `assessment-engine/mentor/registry/ecosystem-repositories.json`
- `assessment-engine/mentor/registry/ecosystem-resources.json`

The existing GitHub Action `Mentor Resource Index` rebuilds and commits those generated files.

## Repairs included

### Resource metadata preservation

The discovery normalizer now preserves:

- `resourceType`
- `learningValue`
- `curricularWeight`
- `learningObjectives`
- `subjects`
- `highStakesDomain`
- `inventoryAuthority`
- `requiresLinkedLearner`
- `requiredStage`

The learner-boundary and high-stakes fields are also copied into the nested `policy` object.

### Registry provenance

`generatedAt` now means the actual registry build time.

The previous source-derived timestamp is retained separately as:

`sourceLatestRepositoryTimestamp`

### Repository manifest provenance

Manifested repository records now retain:

- `sourceId`
- `inventoryAuthority`
- `resourceCount`

### Reason/status cleanup

A repository with a valid manifest no longer retains a stale message saying that a manifest is still required.

### Regression test

The normalizer test now verifies that learning, source-authority, learner-boundary, and high-stakes metadata survive registry normalization.

## Existing automation

No new workflow file is required.

The repository already contains:

`.github/workflows/mentor-resource-index.yml`

Changes under:

`assessment-engine/mentor/discovery/**`

trigger the workflow automatically. It:

1. rebuilds the repository/resource index;
2. runs the Mentor Core tests;
3. commits changed generated registry JSON files;
4. pushes the refreshed registry to `main`.

## Expected promotion after workflow completes

The seven Repair 03A repositories should change from plain discovered/unrecommendable records to manifested source-owned repositories:

- Solanar
- Firmament
- Medicament Hub
- Bazaar Art
- River-to-Road
- Veterans
- Homeless Services

Finance remains intentionally unmanifested/deferred until its repository expansion is ready.

The recently updated Elementary and Middle manifests will also be re-read by the same full registry build, so their current manifest versions/resources are incorporated at the same time.
