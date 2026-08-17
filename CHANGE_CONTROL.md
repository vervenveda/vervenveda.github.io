# Verve N Veda Production Change Control

## Classification

The root `index.html` is a **Protected Production Artifact — Surgical Changes Only**.

## Default Rule

If the production page is working and a change is not necessary, leave it alone.

Prefer documentation, hosting configuration, authenticated infrastructure, and isolated supporting files when they can address a requirement without altering the protected page.

## Required Procedure

Before changing `index.html`:

1. Define the exact defect, security issue, accessibility issue, or approved feature.
2. Preserve the known-good production version.
3. Isolate work on a branch or equivalent review boundary when practical.
4. Use the smallest practical diff.
5. Do not rewrite unrelated layout, navigation, styling, scripts, links, or content.
6. Review whether the change introduces origins, scripts, permissions, storage, redirects, forms, iframes, network calls, or authentication assumptions.
7. Test locally and inspect the browser console.
8. Review the complete diff for unexplained changes.
9. Deploy deliberately without unrelated edits.
10. Verify production after deployment.
11. Roll back to known-good state if unexpected behavior appears.

## Prohibited Automated Changes

Without explicit project-owner approval, do not run whole-file AI rewrites, framework conversion, whole-document formatting, minification/beautification rewrites, bulk dependency upgrades, automated DOM restructuring, global unreviewed search-and-replace, or speculative security rewrites against `index.html`.

AI tools may analyze and propose minimal patches, but patches must remain bounded and reviewable.

## Security Boundary

Never solve privileged authentication by adding stronger-looking client-side JavaScript to the public page. Secrets and authority belong on authenticated infrastructure.

## Emergency Changes

Contain and restore first. Do not combine emergency remediation with unrelated refactoring. Document what changed and why after stabilization.
