# CNAME Configuration — Verified

Last verified: August 15, 2026

## Current production configuration

The Verve N Veda public gateway is intentionally configured to use the apex custom domain:

```text
vervenveda.com
```

The root `CNAME` file must therefore contain only:

```text
vervenveda.com
```

GitHub Pages currently publishes this repository from `main` at `/`, with HTTPS enforcement enabled.

Canonical public address:

```text
https://vervenveda.com/
```

## `www` is not the CNAME for this repository

Do **not** replace the root `CNAME` value with `www.vervenveda.com` unless there is an intentional, coordinated domain migration.

At the time of this verification, `www.vervenveda.com` is being used separately and should not be reassigned casually. Any future change involving `www` must first verify the live destination, DNS records, certificates, redirects, and dependent links.

## Domain ownership verification

GitHub Pages currently reports the custom-domain ownership/protection state as unverified even though the site is built, HTTPS is enforced, and the TLS certificate is approved.

Recommended security action: verify `vervenveda.com` in the Verve N Veda GitHub account's **Settings → Pages** area and retain the GitHub-provided DNS TXT verification record. Domain verification helps prevent another GitHub account from claiming the domain if the Pages binding is ever removed or disabled.

## Change-control rule

Treat `CNAME` and DNS changes as production infrastructure changes.

Before changing the custom domain:

1. create a dedicated repair or migration branch;
2. verify the intended live destination;
3. review DNS records and HTTPS status;
4. merge through a pull request into protected `main`; and
5. verify the live site after deployment.

Do not edit the production `CNAME` merely to resolve documentation drift.
