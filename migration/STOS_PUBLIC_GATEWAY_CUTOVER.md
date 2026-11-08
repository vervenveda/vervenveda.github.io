# Verve N Veda → STOS: staged gateway cutover (HOLD)

**Status:** preparation only. No automatic STOS writes, DNS edits, CNAME reassignment, public asset removal, or repository-visibility changes are authorized by this document.

## Pinned source snapshot

- Full GitHub source: `vervenveda/vervenveda.github.io`, starting commit `836bdb78769f70b255e5c0bc7773b6f6de61a28d`.
- Proposed public gateway: `KhaemenesAcademy/vervenveda.github.io`, snapshot `9c33d833da151394b533ad52a9de2098cc9ac090`.
- Both `index.html` files currently share Git blob `a883f035329a89e55d526160c54ffdac3c7af2f9`. Identical file content is **not** evidence that the second site can independently serve its dependencies.
- The original repository alone has a root `CNAME` containing `vervenveda.com`. The proposed public gateway has no root `CNAME` yet.
- STOS import location, STOS index.html hash, secure-server commissioning and native execution authority **have not been verified by GitHub**.

## Intended architecture

```text
GitHub full source (eventually private, editable)
    | authenticated read from STOS, pinned SHA; NEVER direct privileged webhook
    v
STOS inbound quarantine → manifest/hash checks → source comparison
    → native sandbox tests → human + sovereign authorization → atomic release
    |                                      |
    | approved source change              | signed/verified release receipt
    v                                      v
STOS protected runtime                Public site build/export
                                         |
                                         v
KhaemenesAcademy/vervenveda.github.io
     → verve n veda public gateway and approved public static assets
```

**Direction:** GitHub commits are *proposals* to STOS. STOS pulls revisions with least-privilege read credentials, reconciles against existing native modifications, and promotes only authorized releases. No GitHub workflow can directly command T01/T02/T03 or vault storage. Keep a signed/pinned release receipt and previous release rollback. A later STOS-to-GitHub export is a separately reviewed PR, never uncontrolled two-way overwriting.

## Critical public dependency problem

The new public repository currently has only `index.html` and `README.md`. The homepage includes same-origin static paths including:
- `/assets/vervenveda-global-standard.css`, `/assets/vnv-global-standard.css`
- `assets/khaemenes-campus-phrases.js`, `assets/khaemenes-interlingual-core.js`
- `assets/vnv-language.js`, `/assets/vnv-ticker-autopopulate.js`
- `/assets/vnv-gateway-chrome-forensic-probe.js`
- `site.webmanifest`, `icon-192.png`, `apple-touch-icon.png`
- dynamic requests to `/ecosystem/master-ecosystem-directory.json`, shared toolbar, and assessment/apps routes.

Before privatizing the original repository, host **all required public assets**, directories and linked public application paths on stable approved public endpoints. A public GitHub Pages site cannot depend on private repo assets being accessible over the same original domain. The simplified repository may remain a small *authoring* repo while its published build artifact contains a vetted static asset bundle. If keeping exactly one HTML file public, supply a separate stable public asset host and rewrite URLs with explicit testing; no silent implicit fallback.

## Cutover gates

1. **Record baseline:** independently archive complete full repository + refs/history and source hash inventory; capture DNS records, GitHub Pages source/HTTPS/domain ownership state, old root and deep-route HTTP responses.
2. **Locate STOS import:** read-only on the local STOS host; hash actual gateway and identify native-only changes; do not alter T01.
3. **Build importer as native service:** STOS-initiated authenticated fetch, pinned ref, immutable quarantine, denylist for secrets, validation of path/bytes/manifest, provenance log, no execution of repository code in privileged context.
4. **Staging parity:** verify exact approved `index.html` contents; test CSS, JS, JSON, icons, public deep paths, browser features, student tour and profile navigation; test HTTPS and accessibility, including failure paths.
5. **Domain transfer:** keep old site online; explicitly confirm new GitHub Pages publication, certificate readiness, and domain ownership. Transfer the apex custom domain in a controlled window (only one Pages site should claim it); configure new `CNAME` and relevant Pages settings in a coordinated sequence. Preserve separate `www` service until verified. Re-test the apex and deep links from outside a logged-in session.
6. **Private-source switch:** only after independent public assets and deep routes are proven. Change the full repository visibility using owner-approved GitHub settings; account for GitHub Pages plan limits and externally cached/public history. Do not archive it if ongoing edits/actions are needed.
7. **Promote sync:** GitHub change → STOS pull → compare/review → sovereign approval → release; release cannot be triggered by untrusted browser storage, webhooks or public toolbar. Default on conflicts: HOLD, never last-writer-wins.
8. **Rollback:** retain previous site release, verified DNS record set, old CNAME snapshot, STOS previous state and reverse cutover procedure. Do not destroy the old host or GitHub history at handoff.

## Acceptance evidence

- Every public resource requested by the new gateway returns expected content (not merely HTTP 200 with a fallback HTML page).
- Current public root, meaningful deep links, two tickers, header, toolbar, translator, directory and student paths work as before.
- GitHub-sourced STOS candidate is reproducible at a pinned commit; source-to-STOS divergence documented; all privileged operations independently authorized.
- Unauthorized GitHub account, forged webhook, tampered file hash and STOS unavailability cannot update the live STOS runtime.
- T01 unchanged; no admin credentials, private learner data or native internal topology in a public artifact.
- Signed human sign-off and reversible cutover receipt precede retirement.

**HOLD:** No STOS write path, GitHub-to-STOS automation or production DNS transition should be claimed complete until the actual STOS host and Pages site have passed these gates.
