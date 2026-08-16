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

The `vervenveda.com` domain has already been verified at the GitHub account level. The repository Pages screen may still show a temporary DNS check while GitHub re-validates the custom-domain configuration after deployment.

GitHub's Pages API may separately expose `protected_domain_state` as `unverified`. In this repository, that API field must not be treated by itself as proof that account-level domain ownership verification has failed. The GitHub account's **Settings → Pages → Verified domains** status is the authoritative operational check for ownership verification.

Do not remove, re-add, or alter the working custom domain, `CNAME`, DNS records, or verification TXT record solely because a repository-level DNS check is in progress or because that API field reports `unverified`.

## Change-control rule

Treat `CNAME` and DNS changes as production infrastructure changes.

Before changing the custom domain:

1. create a dedicated repair or migration branch;
2. verify the intended live destination;
3. review DNS records and HTTPS status;
4. merge through a pull request into protected `main`; and
5. verify the live site after deployment.

Do not edit the production `CNAME` merely to resolve documentation drift.
