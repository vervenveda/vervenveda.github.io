# Supplemental Resource Discovery Patch

This patch extends the existing six-hour Mentor Resource Index without replacing manifest authority.

## Files to upload to `vervenveda/vervenveda.github.io`

- `.github/workflows/mentor-resource-index.yml` — replaces the current workflow and adds one supplemental build step.
- `assessment-engine/mentor/discovery/supplemental-discovery-policy.json`
- `assessment-engine/mentor/discovery/repository-file-discovery.js`
- `assessment-engine/mentor/discovery/build-supplemental-resource-index.mjs`
- `assessment-engine/mentor/tests/repository-file-discovery.test.mjs`

## How it works

1. Existing `build-resource-index.mjs` runs first. Mentor manifests remain authoritative.
2. The supplemental builder reads the generated `ecosystem-resources.json`.
3. It scans only repositories and folders listed in `supplemental-discovery-policy.json`.
4. Only approved HTML files are converted into supplemental resource records.
5. Existing manifest/registry URLs win during de-duplication.
6. The Career Portal reads the final registry and categorizes the resources dynamically.
7. GitHub Actions repeats the process every six hours and whenever the discovery files change.

## Initial allowlist

- ProReSources: `Protools/` and `templates/`
- Arcade: repository-root HTML games
- Khaemenes Higher Learning: `Technology/`
- Finance: `apps/` and `workshops/`
- Firmament: public HTML pages, excluding admin/support paths
- Khaemenes Linguistics: `apps/`

You can add or remove scan roots later by editing only `supplemental-discovery-policy.json`.
No Career landing-page edit is required.

## Security boundary

This is deliberately **allowlist-based**. It does not crawl every file in every account.
Admin, test, support, validation, 404/403, and other excluded paths are filtered.
Only public GitHub repositories are reachable by this indexer.
