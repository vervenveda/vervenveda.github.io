# Khaemenes Mentor · Phase 1.1 Resource Intelligence + Search

Target repository:

`vervenveda/vervenveda.github.io`

This package upgrades the existing live Mentor Core without replacing the working repository-discovery architecture.

## What this phase does

1. Preserves advanced resource-policy metadata during registry generation.
2. Adds a centralized resource policy evaluator.
3. Adds conditional handling for:
   - freshness/current-information verification;
   - preference-aware faith/cultural resources;
   - account/privacy-aware network resources;
   - sensitive-topic resources.
4. Adds a structured Mentor Search service.
5. Connects the existing Sovereign Problem-Solving Agent **after** eligibility filtering.
6. Adds a Preschool bridge for the first end-to-end school integration.
7. Hardens the GitHub Actions indexer against the `fetch first` push collision.
8. Updates GitHub Actions to Node-24-native action releases.

## Safety architecture

```text
Query
  ↓
Intent + learner/family context
  ↓
Stage / role / resource policy
  ↓
BLOCKED resources removed
  ↓
Conditional resources annotated
  ↓
Lexical + curriculum proximity ranking
  ↓
Sovereign Agent ranks only legal survivors
  ↓
Freshness / account requirements explained
  ↓
Mentor recommendation
```

The Sovereign Agent cannot override age, role, Admin, campaign, preference, or safety constraints.

## Upload

Copy the contents of this package into the matching repository paths.

This package contains **only new or replacement files**. It does not contain the generated `ecosystem-resources.json` or `ecosystem-repositories.json`; those remain generated artifacts.

After upload:

1. Open **Actions → Mentor Resource Index**.
2. Choose **Run workflow** on `main`.
3. The workflow will rebuild the live registry with preserved policy metadata.
4. Verify that the run is green.

## Attribution

Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy
