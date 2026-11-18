# 2026-11-18 · Canonical VNV Chrome Foundation & Academy Recovery Boundary

- **Repository:** `vervenveda/vervenveda.github.io`
- **Types:** forensic source audit · architectural decision · recovery handoff
- **Status:** Source inspected and baseline logged; no application code or cross-repository runtime altered; end-to-end browser proof pending.

## Baseline
- Current `main` tree: 470 entries, Git tree complete (`truncated=false`).
- `index.html` blob SHA `2a168b2aa4c0e476d0beb1c1bc0feead82a936b7`.
- Canonical shared assets:
  - `assets/vnv-333-ticker.js` SHA `9cee1e33022043060a8e7a2e5f0cdcce55d0b592`.
  - `assets/vnv-ticker-autopopulate.js` SHA `0bd454d19f16dc7d253c3ef37c86449d57d4e213`.
  - `assets/vnv-header-autopopulate.js` SHA `31c617d30ee778a8686401ce5a26f868d72daee1`.
  - `assets/vnv-ecosystem-toolbar.js` SHA `338074634014da2e51e708db0a2ed8c22e187d0c`.
  - `assets/vnv-class-tools-toolbar.js` SHA `59b2ce78a34acd5f90eca5d3e5f27fba2c8bec7d`.

## Confirmed source behavior
1. The main VNV `index.html` intentionally sends public Education doorways to `https://vervenveda.com/KhaemenesAcademy_Home.github.io/` and uses Full Academy student/family services for enrolled entrants. Do not flatten these distinct routes.
2. The 333 and AutoPopulate ticker scripts have distinct idempotent root IDs; the AutoPopulate ticker explicitly protects the frozen gateway homepage when not enabled there. Its special-case root must not be overwritten by Academy defaults.
3. The VNV header engine uses root ID `vnvHeaderAutoPopulate`, updates an existing header instead of creating a second one, and mounts the enriched hamburger. Academy pages must use it as the sole header owner.
4. The official six-control ecosystem toolbar uses `vnvEcosystemUtilityDock`, suppresses redundant legacy floating docks and does not mount on protected assessment routes.
5. The lower-left class tools module is `vnv-class-tools-toolbar.js`; its declared mount is idempotent and conditioned on route. Verify it is actually loaded on Grade 09 in a browser before attributing missing tools to its own logic.
6. A separate visitor invitation is supplied from Full Academy `assets/khaemenes-guest-tour-invitation.js`, not from this VNV repo. Its grade-routing/popup guards were recently updated following a repeat-popup report.
7. Shared chrome source parity alone cannot certify DOM instances or click behavior in the High School grade profile; independent browser checks and script ownership tests remain required.

## Relevant repository evidence
- `.github/workflows/academy-gateway-handoff.yml` and `tests/academy-gateway-handoff.test.mjs` protect Academy public Home versus enrolled Full Academy routing.
- Latest inspected VNV CI at audit time: Ecosystem Navigation Audit passed on November 18, and VNV Pages deployment also passed. These prove specific CI/deployment steps, not the High School student UI.
- `workflow/README.md` defines VNV as the full-source/archive authority. The separate `KhaemenesAcademy/vervenveda.github.io` gateway remains a minimal front door.

## Recovery acceptance plan
1. Freeze VNV shared component source while identifying the broken learner/guest behavior at its consumer.
2. Draw a source-of-truth map for each visible layer: ticker333, AutoPopulate, VNV header+menu, right dock, left dock, local student dialogs and guest tour.
3. Test one instance of each eligible shared component; no auto-mounter should repeatedly rewrite a page after manual initialization.
4. Validate anonymous/guest and fictional registered Grade 09 click paths separately: Start Daily Lessons, Profile, Class Progress, Schedule, Creative Tools, Portfolio, KlasaiPeer and Background.
5. Resolve failing targeted CI and run a real desktop/tablet browser interaction check before considering Grades 10–12.

## Safety
No student data, grade, mastery, learner ID, account-cloud authorization, STOS storage, custom domain, DNS, or third-party authentication was modified or commissioned by this audit.
