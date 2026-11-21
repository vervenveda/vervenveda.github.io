# 2026-11-21 — Ecosystem Directory Five-Bubble Remediation

**Scope:** Verve N Veda master public directory, non-invasive source checks and reporting only. **Hard boundary:** `index.html` was not changed; no family accounts, grades, student records, translator settings, credential stores, 333 accounts or STOS services were touched.

## Canonical system
- `index.html` still fetches `/ecosystem/master-ecosystem-directory.json` with `cache:"no-store"`; on failure it uses its original smaller embedded `SITES` and `ECOSYSTEM_DIRECTORY` fallback lists.
- Native gateway 333 ticker and native `.site-header` + hamburger remain source owners; the auto-populating ticker is opted in specifically for the gateway. Shared `vnv-header-autopopopulate.js` is for other pages, **not** a script loaded on gateway root.
- Existing translator ownership is Khaemenes Linguistics full-loader with local `vnv-language.js` fallback and reserved rail. Lower-left class tools and lower-right ecosystem dock are separate intended controls.
- Optional `?chrome_audit=1` is an existing browser inspection probe, not enabled on ordinary visits.
- The browser-local 10-digit admin shortcut explicitly says it is not authenticated admin access.

## Five bubbles addressed
1. **Associates-Level discoverability — UPDATED.** Inserted `higher-associates` in the public Education master directory immediately after existing `higher` and preserved the existing Higher Learning entry. HTTPS path `https://vervenveda.com/Khaemenes_HL_Associates-Level.github.io/`; separate repo `vervenveda/Khaemenes_HL_Associates-Level.github.io`, `developmentStatus:"partial"` and public `status:"active"`. Master count **196 → 197**; public eligible count **183 → 184**. Canonical IDs/URLs remain unique. No gateway HTML edit.
2. **Origin parity — SOURCE AUDITED, runtime HOLD.** Preserved original stage links, while the new test prints `VNV_ACADEMY_ORIGIN_AUDIT` with all seven stage hosts. Pre-K/Kinder/Elementary/Middle/older Higher Learning still use `vervenveda.github.io`; High and Associates use `vervenveda.com`. Because `localStorage` is origin-specific, independent browser redirect and records checks are necessary before changing these destinations. **No records were copied or IDs invented.**
3. **Fallback parity — GUARDED, difference disclosed.** Embedded emergency lists still contain 32 `SITES` and 130 categorized items, intentionally not the entire master; the separate validator reports `VNV_DIRECTORY_PARITY_REPORT`, including the missing Associates-Level **emergency** link and duplicate fallback campaign title. The canonical public registry is current; fallback reconciliation remains a future minimal/index review, not a reason to rewrite a fragile 273KB root page.
4. **Ticker/header/toolbar ownership — SOURCE GUARD PASS, browser HOLD.** New regression confirms one native 333 markup, reserved auto ticker, native site header/menu, translator rail, lower-left class tools, lower-right ecosystem dock, and the opt-in browser audit probe. It checks the idempotent bootstrap. First-paint desktop/mobile/tablet positioning remains a real-browser acceptance task, not a claimed runtime pass.
5. **Menu/translator fallback and security — SOURCE GUARD PASS, browser HOLD.** New tests preserve menu close/focus restoration, search, the canonical Linguistics loader and local fallback, and local-admin-gate non-authentication language. Live keyboard, mobile and translator-offline acceptance remains HOLD.

## Regressions and verification
- `tests/gateway-ecosystem-directory-five-bubble.test.mjs` includes **six** offline Node cases covering the five bubbles and reports both fallback and origin parity.
- `.github/workflows/vnv-ecosystem-directory-five-bubble.yml` runs these six checks plus the existing `tests/academy-gateway-handoff.test.mjs` regression to protect the Academy Home and returning-learner entry.
- First CI run failed on a **test expectation** that assumed `closeMenu()` had no arguments; the actual stable native method is `closeMenu(restoreFocus = true)`. Corrected only the test assertion; **no runtime gateway modification**.
- [GitHub Actions #44876574506](https://github.com/vervenveda/vervenveda.github.io/actions/runs/44876574506) **completed SUCCESS**, exact tested code/workflow SHA `f6fb431facb14d2e77e8ae6f6c3d82e8c2d5ad18` (six new checks plus preexisting Academy handoff).

## Residual HOLDs
- Browser test with `https://vervenveda.com/?chrome_audit=1` on desktop, tablet landscape and mobile, including native+autoticker/header/translator geometry and no duplicate dock.
- Real keyboard/focus and translator offline/fallback; verify dynamic canonical directory fetch on deployed domain.
- Redirect behavior for seven stage URLs and whether the exact existing learner ID remains on the authorized destination; do not automatically synchronize or migrate local browser storage.
- Full emergency fallback parity, which by design **cannot be repaired without modifying `index.html`**. Leave frozen unless a minimal reviewed index change is separately authorized.
- `pageCatalog.publicPageCount` describes a separately scanned page catalog, not the 197 top-level directory entries; adding a gateway entry does not by itself establish Associates course-page catalog indexing.

**Files changed in gateway:** `ecosystem/master-ecosystem-directory.json`, one independent regression test and one independent GitHub Actions workflow. **Unchanged:** `index.html`, shared chrome scripts, all Academy account and course sources.
