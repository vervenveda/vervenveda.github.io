# Security Policy

## Verve N Veda Security Commitment

Verve N Veda is committed to protecting the privacy, integrity, and security of its public websites, educational platforms, creative tools, and community resources.

We appreciate responsible security research and welcome reports that help improve the safety of our projects.

---

# Supported Projects

This policy applies to the public Verve N Veda ecosystem, including GitHub Pages websites and official public repositories unless otherwise noted.

Examples include:

- Verve N Veda
- Khaemenes Academy
- Medicament Hub
- Sanctuary
- Solanar
- The Refrain
- ProResources
- Bazaar Art
- One Nation For All
- The Verifier
- PLERA Search
- Other official Verve N Veda projects

---

# Reporting a Security Issue

Please **do not disclose vulnerabilities publicly** before they have been reviewed.

When reporting a concern, please include:

- affected page or application
- URL
- steps to reproduce
- browser and operating system
- screenshots when helpful
- estimated impact

Do **not** include:

- passwords
- authentication tokens
- API keys
- private keys
- personal information
- financial information
- medical information
- educational records

---

# Responsible Testing

Researchers should:

- respect user privacy
- avoid service disruption
- avoid denial-of-service testing
- avoid credential attacks
- avoid social engineering
- avoid malware
- stop immediately if sensitive information becomes visible

Testing should never intentionally affect other users or third-party services.

---

# Static Website Security

Many Verve N Veda applications are delivered as static HTML, CSS, and JavaScript.

Because these applications execute in the user's browser:

- localStorage is not secure storage
- JavaScript is publicly visible
- client-side passwords are convenience features only
- hidden menus are not security controls

Public repositories should never contain:

- registrar credentials
- GitHub personal access tokens
- cloud credentials
- payment secrets
- administrator passwords
- encryption keys
- production API secrets

Sensitive operations should always occur on secured server infrastructure.

---

# Privacy

Verve N Veda values privacy-first design.

Projects should avoid unnecessary collection of:

- personal information
- behavioral analytics
- fingerprinting
- advertising identifiers
- hidden tracking technologies

Local browser storage should be limited to:

- preferences
- accessibility settings
- saved work
- educational progress
- locally generated content

---

# Third-Party Resources

External resources should:

- use HTTPS
- come from reputable providers
- request minimal permissions
- degrade gracefully when unavailable

Self-hosted resources are preferred whenever practical.

---

# HTTPS

Official Verve N Veda websites are intended to be served over HTTPS.

If a browser reports a certificate warning or insecure connection, please verify:

- the URL
- the browser version
- cached DNS information
- mixed-content warnings

These issues are typically configuration-related rather than application vulnerabilities.

---

# Scope

This policy applies only to Verve N Veda-controlled websites and repositories.

It does **not** authorize testing against:

- GitHub
- GitHub Pages
- Namecheap
- DNS providers
- hosting providers
- payment processors
- government systems
- third-party APIs
- external websites linked from Verve N Veda

---

# Disclosure

After a reported issue has been investigated and resolved, Verve N Veda may publicly acknowledge the contribution of the reporting researcher when appropriate and with their permission.

---

# Thank You

Responsible security reporting helps improve the safety and reliability of Verve N Veda for everyone.

Thank you for helping make these resources more secure.
