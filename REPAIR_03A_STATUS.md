# Repair 03A — Specialist Federation Anchors

Date: 2026-08-09

## Result

PASS — seven provisional root manifests generated.

These are intentionally *not* deep inventories. The repositories are active products that will continue to be upgraded and expanded.

## Generated provisional anchors

1. `vervenveda/solanar.github.io`
   - sourceId: `verve.solanar`
   - classification: `educational`

2. `vervenveda/firmament.github.io`
   - sourceId: `verve.firmament`
   - classification: `research-information`
   - high-stakes domain marker: `legal`

3. `vervenveda/medicament-hub.github.io`
   - sourceId: `verve.medicament`
   - classification: `wellness`
   - high-stakes domain marker: `medical`

4. `vervenveda/bazaarart.github.io`
   - sourceId: `verve.bazaar-art`
   - classification: `creative-cultural`

5. `vervenveda/river_to_road.github.io`
   - sourceId: `verve.river-to-road`
   - classification: `civic`

6. `vervenveda/veterans.github.io`
   - sourceId: `verve.veterans`
   - classification: `civic`
   - high-stakes domain marker: `public-services`

7. `vervenveda/Homeless.github.io`
   - sourceId: `verve.homeless-services`
   - classification: `civic`
   - high-stakes domain marker: `housing-support`

## Deliberately deferred

- `vervenveda/finance.github.io`
  - Active build with substantial uploads still expected.
  - Do not freeze its current partial inventory into a deep manifest yet.

## Finished anchors left unchanged

- Verve N Veda Home
- Khaemenes Preschool / Crechè

## Provisional manifest policy

Each generated manifest:

- exposes only the stable repository root;
- uses `inventoryAuthority: "provisional-root-anchor"`;
- keeps the root Mentor-searchable;
- marks the root as a supplemental hub;
- does not claim unlisted apps are missing;
- uses `featured: false` while the repository remains under expansion;
- preserves a stable `sourceId` that can survive later deep-manifest upgrades.

## Validation

- JSON parse: PASS for all 7 manifests
- one resource per manifest: PASS
- stable HTTPS homepage: PASS
- root URL equals resource URL: PASS
- `mentorSearchable: true`: PASS
- `mentorEligible: true`: PASS
- `featured: false`: PASS
- `resourceType: hub`: PASS
- `inventoryAuthority: provisional-root-anchor`: PASS

## Upload pattern

For each repository, upload only its corresponding:

`mentor-manifest.json`

to the repository root.

Do not replace app files, indexes, READMEs, or existing content.

## Future promotion rule

When a repository is declared finished or structurally stable:

1. inventory the live repository;
2. verify canonical child paths;
3. expand the existing manifest;
4. retain the same `sourceId`;
5. change `inventoryAuthority` from provisional to the appropriate verified authority;
6. regenerate the ecosystem registry.
