# 2026-11-16 · Full Source, Minimal Gateways and Future STOS Topology

- **Repository:** `vervenveda/vervenveda.github.io`
- **Types:** source inspection · architectural decision · cross-repository archival alignment
- **Status:** Documentation committed. **STOS integration, public-domain migration and automatic bidirectional sync HOLD.**

## Decision

Maintain the full Verve N Veda source and separate minimal front-door gateway. The gateway must never become an uncontrolled second codebase. Future STOS participation is **planned**, not a current synchronization capability. Never treat GitHub, browser local storage or a public Pages gateway as the sovereign account cloud.

## Repository responsibilities

- Full VNV: `vervenveda/vervenveda.github.io`; owns canonical public gateway code, registry and tested public utilities.
- Minimal VNV entry: `KhaemenesAcademy/vervenveda.github.io`; mirror validated public entry content and only its necessary assets.
- Full Academy: `vervenveda/Khaemenes_Academy.github.io`; owns school application, modules, profiles and Academy-specific integrations.
- Academy Home: `vervenveda/KhaemenesAcademy_Home.github.io`; landing experience with an independent workflow record, consuming Academy assets where explicitly appropriate.
- Minimal Academy entry: `KhaemenesAcademy/KhaemenesAcademy.github.io`; must stay lean and be validated for actual publication and links.
- STOS: sovereign runtime/storage destination once bound, commissioned and expressly authorized; no live data handoff implemented by this note.

## Verified inspection observations

- Full VNV `index.html` is a large self-contained gateway page with canonical registry and menu scripting; previous source audit detected repaired menu and Hall navigation, Civic routing and legibility improvements.
- Academy Home and Academy front-door markup load Academy scripts via existing published `vervenveda.com/Khaemenes_Academy.github.io/assets/` URLs. Before migration, verify their availability and eventual replacement; do not silently rewrite these links.
- Both front-door repositories already have independent `workflow/` archives; full Academy and Academy Home already contained archives at inspection time. Full VNV was the missing archive.

## Sovereign triangle acceptance gates (future only)

1. Verify source identity, permissions and SHA-256 of each candidate GitHub revision.
2. Export a limited allowlisted manifest and corresponding static assets with no real learner content.
3. Validate target identity, STOS terminal binding, active native bridge and fail-closed authorization.
4. Produce a deterministic dry-run diff and a rollback snapshot. Withhold ambiguous, conflicting or missing records.
5. Require explicit human approval for every promotion or write; never infer authority from a front-door click.
6. Confirm published links, offline behavior and browser views with smoke tests before any domain switch.
7. Keep reversible lineage: Git SHA, STOS source digest, target digest, approval and restoration record.

No changes were made to STOS, DNS, `CNAME`, student profiles or runtime credentials.
