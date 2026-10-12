# Beta Feedback → GitHub Issues: secure delivery plan

Status: design / not yet deployed
Scope: public Beta feedback from Verve N Veda ecosystem
Branch policy: work only on existing `main`; do not create candidate branches.
Privacy policy: do not expose STOS internals, credentials, learner data, or private infrastructure.

## Verified baseline (2026-10-12)
- The public repository `vervenveda/vervenveda.github.io` has `main` as default branch.
- `index.html` includes an `ECOSYSTEM_DIRECTORY` with 120 distinct destination URLs in 12 categories.
- `ecosystem/master-ecosystem-directory.json` declares 126 entries; scopes require reconciliation.
- `beta/index.html` stages reports in browser localStorage and reads an optional HTTPS `bridgeEndpoint` from browser-local `VNV_ADMIN_SETTINGS_V1`. A missing endpoint produces a local-only report. A successful HTTP response is not proof of issue creation.
- `assets/vnv-beta-link.js` links to the existing Beta form with public pathname context only.
- `.github/workflows/beta-index-coverage.yml` and `.github/workflows/beta-index-rollout.yml` both rewrite public index pages and can disagree about widget URL and CSP handling.
- `vervenveda/beta-feedback` was not accessible through the connected GitHub account (404). Do not assume it exists.
- `STOS_PUBLIC_BRIDGE.md` requires public HTTPS handoffs and prohibits internal network details, filesystem paths, credentials, and private topology.

## Delivery architecture
1. Administrator creates or selects a **private** GitHub repository with Issues enabled and grants a narrowly scoped GitHub App installation permission to create issues there. Confirm repository access before activation.
2. Deploy a minimal HTTPS gateway with secrets held server-side only. GitHub Pages and browser JavaScript must never contain a token, GitHub App private key, webhook secret, or private endpoint configuration.
3. Public form submits `{type:"beta_report", report:{id, at, page, message}}` to the configured HTTPS gateway. Keep query strings, fragments, cookies, student IDs, localStorage, and STOS details out of the payload.
4. Gateway enforces origin policy, body size, schema validation, content minimization/redaction, bot/abuse protection, rate limiting, and a server-side idempotency key. CORS is not authentication or abuse protection.
5. Gateway creates a private GitHub Issue and returns a minimal signed/validated success response such as `{ok:true, receiptId:"opaque-id"}`. Do not expose a private issue URL or repository name to the public client.
6. Beta page shows **Delivered** only after the gateway confirms issue creation. Other states: **Draft saved locally**, **Sending**, **Delivery failed; retry**. Preserve a draft on failure; do not clear it prematurely.
7. Avoid duplicating the entire report into local admin-notification keys; provide explicit user controls to clear browser-local copies. Never present browser-local storage as a shared administrator inbox.
8. Administrator triages Issues with labels such as `beta-feedback`, `bug`, `accessibility`, `broken-link`, `content`, and `resolved`; ensure the repository remains private.

## Rollout and validation gates
- First inspect the existing Beta form and widget; reuse rather than replace.
- Consolidate the two Beta index workflows into one canonical, idempotent rule before broad rollout. Test CSP fallback and avoid action-triggered commit loops.
- Reconcile homepage directory against the master registry by URL and classification; never propagate admin/private/internal destinations.
- Audit live HTTP destinations, path casing, redirects, iframe behavior, and breadcrumb navigation separately; unique URLs alone do not prove links work.
- Breadcrumb hierarchy: Verve N Veda → Ecosystem Directory → Category → Subgroup → Destination. Provide a visible, keyboard-accessible return path on destination pages, not just the embedded viewer.
- Preserve `stos/`, `assets/stos-public-config.js`, `STOS_PUBLIC_BRIDGE.md`, and all dormant STOS material unchanged.
- Test valid delivery, invalid input, rate limit, outage, duplicate retry, mobile keyboard flow, no-JavaScript fallback, private issue visibility, and no-token-in-bundle checks.
- Commit only validated public-safe changes directly to `main`; verify Actions and resulting site after each bounded change.

## Blocking dependencies
- A confirmed private GitHub Issues repository accessible to the selected account.
- A deployed HTTPS gateway or an explicit decision to require visitors to authenticate to GitHub and submit via issue forms instead.
- Gateway credentials provisioned securely outside this public repository.

This file is a plan, not evidence of a functioning delivery service.
