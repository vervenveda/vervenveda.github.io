# 2026-11-19 · Gateway Five-Point Forensic Hardening

- **Repository:** `vervenveda/vervenveda.github.io`
- **Date/timezone:** 2026-11-19 · America/New_York
- **Types:** forensic audit · targeted CI hardening · decision · follow-up
- **Branch:** `main`
- **State:** PARTIAL IMPLEMENTATION · BROWSER ACCEPTANCE HOLD · STOS COMMISSIONING HOLD

## Objective and user decision
Work systematically on five issues: protected homepage baseline, navigation failures, GitHub Actions quality and write authority, canonical shared browser chrome, and durable workflow journaling. Do not alter learner records or STOS and do not perform unverified broad homepage/UI rewrites.

## Finding 1 — Protected homepage history (verified)
- Archived November 18 source inspection recorded index blob SHA `2a168b2aa4c0e476d0beb1c1bc0feead82a936b7`, matching commit `0190300b5bc552d533f89651db5ab45e2fbf5854` (November 16).
- Current main index blob SHA `d9fa00211c06174e94117fb32ba3806d7db8aeb2`, matching commit `80ccf4d3d57fdbfa904cb78f27f79f3a481e4f38` (November 18).
- The homepage change at 80ccf4d3 was **one added link**: `Enter Full Academy` beside `Begin Learning`. No deletions in that diff. The added link is visible in the published page at `https://vervenveda.com/`.
- Previous revision provides a known recovery reference, **not** permission to roll back. Protected `index.html` was not modified during this five-point pass.

## Finding 2 — Navigation failures (source report, not browser reproduction)
- `ecosystem/navigation-audit.json` generated 2026-11-19T14:24:48Z reports 40 repositories, 12,421 HTML files, and **49 broken local references**:
  - `vervenveda/Khaemenes_High.github.io`: 40
  - `vervenveda/bazaarart.github.io`: 5
  - `artist1970/Archaemenes.github.io`: 3
  - `artist1970/Hope.github.io`: 1
  - `vervenveda/vervenveda.github.io`: 0
- High School's broken references include **28 in one historical** `courses/social-studies/grade-10/workflow/legacy-index-pre-canonical-migration-2026-11-16.html`. Historical records must not be silently deleted to improve the audit score.
- Other High School references affect elective/PE shared class-tools and math assessment dependencies (math-learning-tools-v2.js and vnv-language.js). Verify the intended assets and exact relative paths before any repair. Inspect active student-facing pages first; do not treat all 49 as equal-impact production failures.
- The report identifies source-level missing targets; browser/runtime and deliberate archival exclusions remain unverified.

## Finding 3 — CI quality boundary (implemented)
- Existing `.github/workflows/ecosystem-navigation-audit.yml` validates scan completion, `failedRepositoryCount == 0`, and empty `failures`, **not** `brokenLocalLinkCount == 0`. Thus successful audit workflow results do not certify zero broken links.
- A narrow workflow-only change introduces a GitHub Actions `::warning` when the broken-local-reference count exceeds zero, without failing repository-scan integrity. Commit: `214c88f85c81f91d517584dee31818d120b27a1b`.
- GitHub Actions history inspected: navigation run `44543309846` successful; public sync `44483433080` successful; Pages deployment `44543468037` successful. These were before this targeted workflow amendment and do not certify its execution.
- Future zero-broken-link release gate needs a reviewed exceptions/archival policy and verified fixes before enforcement.

## Finding 4 — Shared chrome and automation ownership (inspection; browser HOLD)
- Shared modules: `assets/vnv-333-ticker.js`, `vnv-ticker-autopopulate.js`, `vnv-header-autopopulate.js`, `vnv-ecosystem-toolbar.js`, `vnv-class-tools-toolbar.js`, and `vnv-language.js`.
- Gateway root uses native `#networkTicker`, `.site-header`, and `#menuOverlay`; grade consumers may use auto-mounted IDs. Never count native and auto-mounted variants as unconditional duplicates.
- Gateway offers opt-in `?chrome_audit=1` and `assets/vnv-gateway-chrome-forensic-probe.js`, with bootstrap verification; source-only review cannot certify interactive browser behavior or tablets.
- Official utility dock CSS permits wrapping (`white-space:normal`) despite a desired one-line control standard. No global CSS mutation made without browser/consumer acceptance.
- Public Ecosystem Sync and Ecosystem Navigation Audit use write permissions and can commit generated artifacts. Toolbar population dry-run also writes its receipt; manual normalization is an explicit writer. Classify these as *auditing plus repository write*, not strictly read-only. Avoid unattended or broad rewrites.

## Finding 5 — Workflow evidence and safety
- `workflow/README.md` is the canonical gateway journal protocol; this note records the five-point audit. Existing entries dated November 16 and 18 remain unchanged.
- Public sync snapshot at 2026-11-19T07:56:10Z: 35/35 approved repositories synchronized, 11,169 catalogued public pages, reported driftCount=0, truncatedTreeCount=0, STOS dormant/excluded.
- `ecosystem/browser-sovereign-authority-contract.json` is evidence only (`deploymentStatus=not-enforced-by-this-file`), not a live authentication system.
- `assets/stos-public-config.js` has blank public URL. No live Account Cloud authentication, private runtime, transport, or T03 commissioning was verified.
- Do not promote private STOS paths, credentials, parent/student data, or local machine Downloads into public gateway authority.

## Verification
- PASS: GitHub source fetch; exact homepage commit and blob comparison; navigation-report classification; workflow source inspection; CI warning commit receipt; live published homepage contents inspection.
- NOT RUN: New GitHub Action after commit, complete browser interaction suite, actual cross-device student flow, accessibility/layout metrics, external link acceptance, native T03 verification.
- HOLD: Shared production UI mutations, navigation repairs in consumer repositories, browser acceptance, cross-repository rollout, domain/DNS migration, STOS commissioning.

## Next safe work
1. Review CI run for warning emission after workflow-only amendment.
2. In the High School repository verify the eight math assessment missing-script paths and the two shared class-tools paths (and other active missing targets), then apply surgical consumer-specific fixes with tests and individual rollback references.
3. Triage historical workflow HTML separately; retain archive.
4. Run live desktop/tablet interaction tests for both `?chrome_audit=1` and student-facing toolbars. Check ticker/header/menu counts, stacking, toolbar button text, tab order, dropdowns, route correctness, and mobile widths.
5. Consider a separately reviewed zero-broken-links acceptance gate once the baseline is clean or explicit exceptions are justified; inspect write permissions for least privilege.

No protected homepage, canonical UI asset, DNS setting, STOS native runtime, T03 state, learner progress, or account record was modified by this pass.
