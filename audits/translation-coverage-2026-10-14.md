# Verve N Veda — Sovereign Translation Integration Audit
Date: 2026-10-14
Scope: six first-party repositories, current main branch
Method: GitHub recursive tree enumeration and targeted HTML source inspection. No browser execution, no private content.

## HTML inventory
- vervenveda/vervenveda.github.io: 23
- vervenveda/Khaemenes_Academy.github.io: 22
- vervenveda/Khaemenes_Linguistics.github.io: 37
- vervenveda/Arshif.github.io: 43
- vervenveda/arcade.github.io: 60
- vervenveda/Khaemenes_Preschool.github.io: 55
TOTAL: 240 HTML files.

## Verified route samples
| Repository | Route | Classification |
|---|---|---|
| Verve N Veda | index.html | shared-engine |
| Verve N Veda | matrix/index.html | no recognized integration |
| Verve N Veda | beta/index.html | no recognized integration; form present |
| Khaemenes Academy | index.html | shared-engine |
| Khaemenes Academy | student/index.html | no recognized integration; preserve student boundaries |
| Khaemenes Academy | family/index.html | no recognized integration; preserve family boundaries |
| Linguistics | index.html | shared-engine |
| Linguistics | Halls/index.html | shared-engine |
| Linguistics | apps/translator.html | separate specialist translator; do NOT equate absence of vnv-language.js with no multilingual function |
| ARSHIF | index.html | curated-navigation-only |
| Arcade | index.html | curated-navigation-only |
| Preschool | index.html | curated-navigation-only |

Further inspected: eight Verve N Veda non-homepage files (404, admin, archive, assessment), none directly loaded vnv-language.js. Some contained forms. This table does not imply all 240 pages were source-inspected.

## Required distinctions
- 13 language options != 13 complete translated pages.
- Propagated ?lang values != translated destination text.
- A loaded interface translation engine != a verified per-language phrase coverage percentage.
- Custom language-learning apps may have legitimate multilingual functions independent of the shared engine.
- Do not machine-translate user inputs, personal records, lesson answers, research quotations, or unreviewed archive text.

## Remediation priority
1. Test and measure gateway index and the public matrix route in each supported language.
2. Add translated navigation labels using curated source strings to the public matrix page, only after a route-level interaction audit.
3. Leave beta forms, student/family portals, and specialist translator under separate privacy-specific reviews.
4. Expand read-only inventory across all 240 HTML pages and publish per-route evidence; run scripts/audit-translation-coverage.mjs on clean clones of each repository.
5. Check Arabic RTL on the translated component (do not blindly flip global layouts), small screens, links, and offline fallback.
6. Do not publish percentage claims until browser coverage exports have been collected and checked.

No private STOS details are part of this report.
