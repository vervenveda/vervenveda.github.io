# Workflow · Development & Conversation Journal

This is the canonical dated development archive for the **full Verve N Veda gateway repository** (`vervenveda/vervenveda.github.io`). The separate `KhaemenesAcademy/vervenveda.github.io` front door is a minimal published entry, not the primary record of ecosystem decisions.

## Archive layout

- `workflow/README.md` — rules and repository role
- `workflow/INDEX.md` — dated session register
- `workflow/templates/SESSION_LOG_TEMPLATE.md` — canonical session blueprint
- `workflow/logs/YYYY/MM/YYYY-MM-DD-short-topic.md` — audits, repairs, upgrades, test evidence, decisions and follow-ups

## Rules

1. Create one dated entry per substantial change; use ISO dates and America/New_York.
2. Archive evidence, exact source paths, commit SHAs, validation results, rollback instructions and unresolved issues.
3. Distinguish observed source facts, implemented code, executed tests, browser acceptance and uncommissioned proposals.
4. Do not duplicate source repositories into gateways or copy unrelated histories. Link across repository archives.
5. Never commit credentials, student data, parent records, personal identifiers, secrets or private STOS snapshots.
6. Retain prior entries; correct them through an addendum rather than overwriting history.
7. All future GitHub ↔ front-door ↔ STOS synchronization must be explicit, versioned, checked for byte/hash identity, non-destructive and subject to authorization. **No STOS write, automatic deployment, background sync or domain migration is enabled by this archive.**
8. The front doors expose published websites, not GitHub repository editors/source pages.

## Repository roles

| Repository | Intended role |
| --- | --- |
| `vervenveda/vervenveda.github.io` | Full Verve N Veda source and public experience; this repository's archival authority |
| `KhaemenesAcademy/vervenveda.github.io` | Minimal front door / gateway mirror |
| `vervenveda/Khaemenes_Academy.github.io` | Full Khaemenes Academy experience, account surfaces, Academy modules and integrations |
| `vervenveda/KhaemenesAcademy_Home.github.io` | Academy Home landing/entry experience; separate full workstream archive |
| `KhaemenesAcademy/KhaemenesAcademy.github.io` | Proposed minimal Academy front door; operational access and publication require separate validation |
| STOS | Proposed sovereign storage/operating-system endpoint; **not commissioned by these documents** |

Do not confuse publishing the gateway with turning on STOS access or moving `vervenveda.com`.
