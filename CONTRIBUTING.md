# Contributing to Verve N Veda

## Protected File Notice

`index.html` is a **Protected Production Artifact — Surgical Changes Only**.

Do not submit broad refactors, automated formatting, framework migrations, dependency substitutions, wholesale regeneration, or unrelated cleanup of `index.html`.

A change affecting it should solve one clearly identified problem, contain the smallest practical diff, preserve existing behavior, disclose any new external resource or permission, include testing notes, and include a rollback approach.

When documentation, configuration, or authenticated infrastructure can solve a security concern without altering `index.html`, prefer the non-invasive solution.

## Preferred Implementation

- Standard HTML
- Standard CSS
- Vanilla JavaScript
- GitHub Pages compatibility
- Local-only storage when appropriate
- Graceful operation without third-party services

Avoid unnecessary frameworks, trackers, advertisements, and external dependencies.

## Security and Privacy

Do not submit passwords, API keys, private keys, production secrets, private user information, sensitive datasets, or code that transmits personal information without clear disclosure.

Public browser code must never act as the sole authorization mechanism for privileged systems.

## Pull Requests

Keep unrelated edits separate. Preserve working features. Test affected behavior. Disclose third-party code/assets. Changes to protected production files must also follow `CHANGE_CONTROL.md`.

All contributions remain subject to project-owner review.
