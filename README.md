# Verve N Veda

Verve N Veda is a public digital gateway connecting educational spaces, creative tools, civic resources, wellness hubs, research portals, and community-centered projects.

## Protected Production Artifact

`index.html` is a **Protected Production Artifact — Surgical Changes Only**.

Do not perform broad refactors, formatting sweeps, framework migrations, dependency substitutions, automated rewrites, or unrelated cleanup on the production page.

Any approved change should identify the exact target, preserve a known-good version, use the smallest practical diff, receive security and functional review, be tested before deployment, and have a rollback path.

AI assistants, automated coding tools, formatters, and refactoring tools must follow the same restrictions.

## Public / Private Boundary

This repository is public-facing and must remain credential-free. It may provide navigation, presentation, public resources, local-only browser features, and links to separately secured services.

Never place production secrets, administrator credentials, API keys, private keys, access tokens, cloud/server/database credentials, recovery information, authenticated session material, or privileged remote-execution authority in this repository.

Browser-only PINs, passwords, hidden menus, obscured routes, and JavaScript checks are not authoritative security controls. Privileged services must remain behind separately authenticated infrastructure.

## Core Principles

- Public access
- Clear navigation
- Educational value
- Creative independence
- Privacy-conscious design
- Local-first tools where practical
- Accessible, responsive presentation
- Least privilege
- Minimal external dependencies
- Reversible production changes

## Main Files

- `index.html` — Protected production landing page
- `404.html` — Custom error page
- `CNAME` — Custom-domain configuration
- `robots.txt` — Search-engine crawler guidance
- `sitemap.xml` — Search-engine sitemap
- `site.webmanifest` — Web-app metadata
- `privacy-policy.html` — Privacy information
- `SECURITY.md` — Security and trust-boundary policy
- `CHANGE_CONTROL.md` — Production change-control procedure
- `INCIDENT_RESPONSE.md` — Public-repository incident procedure
- `CONTRIBUTING.md` — Contribution guidance
- `LICENSE.md` — Repository license

## Development and Deployment

Keep the site lightweight and GitHub Pages compatible. Prefer standard HTML, CSS, and vanilla JavaScript. Experimental work should occur away from the protected production artifact whenever practical.

Production changes should follow `CHANGE_CONTROL.md`.

## Security

For security concerns, follow `SECURITY.md`. For suspected secret exposure or unexpected production changes, follow `INCIDENT_RESPONSE.md`.

## License

See `LICENSE.md`.
