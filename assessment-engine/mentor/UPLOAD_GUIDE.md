# Khaemenes Mentor Core Foundation — Upload Guide

Upload these paths into:

`vervenveda/vervenveda.github.io`

## New subsystem

Copy the complete folder:

`assessment-engine/mentor/`

into the existing:

`assessment-engine/`

directory.

Do not replace the existing `assessment-engine/agents/`, `engine/`, `schemas/`, `apps/`, `assets/`, `banks/`, or `docs/` folders.

## GitHub Action

Also add:

`.github/workflows/mentor-resource-index.yml`

at the repository root.

This workflow:

1. scans the approved public GitHub accounts;
2. acknowledges every public repository;
3. classifies repository-level access;
4. checks for `mentor-manifest.json`;
5. adds manifest resources to the central resource index;
6. runs Mentor Core tests;
7. commits registry changes when the public ecosystem changes.

## Initial approved account families

- vervenveda
- JenniferPearl2028
- artist1970

## Important policy

Admin/infrastructure repositories are indexed only as restricted lineage records and are never learner or parent destinations.

Campaign repositories are acknowledged but segregated from ordinary Khaemenes learner recommendations.

## After upload

Run the workflow manually once using GitHub Actions → Mentor Resource Index → Run workflow.

That first run will populate:

- `assessment-engine/mentor/registry/ecosystem-repositories.json`
- `assessment-engine/mentor/registry/ecosystem-resources.json`

The scheduled job then checks again every six hours.
