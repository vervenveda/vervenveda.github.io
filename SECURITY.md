# Security Policy

## Security Commitment

Verve N Veda is committed to protecting the privacy, integrity, and security of its public websites and resources.

This repository is a **public presentation and navigation surface**, not a privileged control plane.

## Protected Production Artifact

The root `index.html` is designated **Surgical Changes Only**. Do not automatically refactor, reformat, migrate, regenerate, or replace it. Necessary modifications must follow `CHANGE_CONTROL.md`.

## Public / Private Trust Boundary

Everything committed publicly must be assumed readable by anyone.

Public code may contain static HTML/CSS/JavaScript, public navigation and documentation, public assets, and non-secret local preferences.

It must not contain production credentials, API secrets, administrator passwords, personal access tokens, cloud/registrar/DNS/database/server credentials, private keys, recovery codes, authenticated sessions, or privileged remote-execution authority.

Sensitive operations belong on separately secured and authenticated infrastructure.

## Client-Side Boundary

Because browser code is visible:

- `localStorage` is not secure storage.
- JavaScript source is public.
- Browser-side PINs/passwords are convenience gates only.
- Hidden menus and obscured URLs are not access controls.
- Disabled buttons and client-side role flags are not authorization.

No sensitive service should trust a browser-side assertion without independent server-side authentication and authorization.

## Secret Handling

If a secret is accidentally committed:

1. Treat it as compromised.
2. Do not rely on deleting it from the latest file.
3. Revoke or rotate it at its authority source.
4. Determine where it may have been exposed.
5. Preserve necessary evidence without publicly reproducing the secret.
6. Follow `INCIDENT_RESPONSE.md`.

Never copy discovered secrets into public issues, documentation, commit messages, screenshots, or chat transcripts.

## Responsible Testing

Respect user privacy. Do not perform denial-of-service testing, credential attacks, social engineering, malware deployment, destructive testing, or unauthorized testing of third-party systems. Stop immediately if sensitive information becomes visible.

## Privacy

Avoid unnecessary personal-data collection, behavioral analytics, fingerprinting, advertising identifiers, and hidden tracking. Local browser storage should contain only non-secret material.

## Third-Party Resources

External resources should use HTTPS, come from reputable providers, request minimal permissions, and degrade gracefully. Self-hosting is preferred when practical. Newly introduced third-party executable code requires review.

## Change Integrity

Unexpected changes to `index.html`, `CNAME`, deployment configuration, or security documentation should be treated as security-significant until explained.

## Reporting

Do not disclose vulnerabilities publicly before review. Reports should contain only the information necessary to reproduce and understand the issue and must not include secrets or sensitive personal information.
