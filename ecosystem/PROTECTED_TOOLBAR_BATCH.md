# Protected Ecosystem Toolbar Batch

Audited: October 30, 2026

These repositories were blocked from automated workflow installation by connector safety checks. No protection was bypassed.

Canonical toolbar:

`https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`

## Findings

- **Khaemenes Preschool** — 60 HTML files; 7 canonical toolbar matches; 55 legacy Beta-script matches. Requires repository-local normalization.
- **Aurora** — 46 HTML files; no canonical toolbar and no legacy Beta script.
- **My Art Gallery** — 1 HTML file; no canonical toolbar.
- **One Nation For All** — 24 HTML files; no canonical toolbar.
- **River to Road** — 3 HTML files; no canonical toolbar.
- **Noema** — 3 HTML files; public `index.html` is eligible. `admin/docs-vault/index.html` and `internal/core/noema-core.html` remain exempt.
- **Eiren** — 1 HTML file; no canonical toolbar.
- **Zelle** — 1 HTML file; no canonical toolbar.
- **STOS** — 1 HTML file; review separately before normalization because STOS remains outside ordinary public-page migration policy.

## Approved local execution

From a checked-out repository root, use the canonical normalizer from the gateway repository:

```bash
python3 /path/to/vervenveda.github.io/ecosystem/apply-ecosystem-toolbar.py --apply --repo OWNER/REPOSITORY
```

For a repository-local copy of the normalizer, use:

```bash
python3 ecosystem/apply-ecosystem-toolbar.py --apply
```

Run without `--apply` first for a dry run. Do not use `--push` until the dry-run receipt is reviewed.

Protected quiz/exam/assessment/closed-book surfaces and admin/internal paths remain excluded.
