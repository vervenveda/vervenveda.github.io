# Phase 1.1 File Map

## Add these files
- `assessment-engine/mentor/discovery/resource-normalizer.js`
- `assessment-engine/mentor/safety/resource-policy.js`
- `assessment-engine/mentor/search/query-intent.js`
- `assessment-engine/mentor/search/context-builder.js`
- `assessment-engine/mentor/search/freshness-controller.js`
- `assessment-engine/mentor/search/sovereign-resource-adapter.js`
- `assessment-engine/mentor/search/recommendation-engine.js`
- `assessment-engine/mentor/search/recommendation-explainer.js`
- `assessment-engine/mentor/search/mentor-search.js`
- `assessment-engine/mentor/adapters/preschool-resource-bridge.js`
- `assessment-engine/mentor/docs/SEARCH_ENGINE_GUIDE.md`
- `assessment-engine/mentor/tests/resource-normalizer.test.mjs`
- `assessment-engine/mentor/tests/resource-policy.test.mjs`
- `assessment-engine/mentor/tests/freshness-controller.test.mjs`
- `assessment-engine/mentor/tests/mentor-search.test.mjs`
- `assessment-engine/mentor/tests/preschool-resource-bridge.test.mjs`

## Replace these existing files
- `assessment-engine/mentor/discovery/build-resource-index.mjs`
- `assessment-engine/mentor/registry/resource-ranker.js`
- `assessment-engine/mentor/registry/resource-resolver.js`
- `assessment-engine/mentor/adapters/preschool.js`
- `assessment-engine/mentor/core/mentor-core.js`
- `assessment-engine/mentor/index.js`
- `assessment-engine/mentor/package.json`
- `assessment-engine/mentor/schemas/activity-manifest.schema.json`
- `.github/workflows/mentor-resource-index.yml`

## Do not manually replace generated registries
- `assessment-engine/mentor/registry/ecosystem-resources.json`
- `assessment-engine/mentor/registry/ecosystem-repositories.json`

The workflow regenerates those after upload.
