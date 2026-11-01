# Verve N Veda Administration · Mentor Council v1

## Status
Installed **only in the inactive preserved administration dashboard**, `admin/2index.html`, via `admin/mentor-council.js`. The active `admin/index.html` is deliberately **"This Passage Is Resting"** and must not be reactivated, bypassed, or modified by this feature.

## User experience
- A navigation button, **Mentor Council**, added to the existing sidebar.
- A button for each registered mentor opens their public page inside an accessible dialog with **Open in new tab** fallback. Some third-party pages may refuse iframe embedding; their own public chatboxes are authoritative.
- **Master Conversation Room** invites multiple mentors by checkbox. Selected mentors can contribute **curated approved public knowledge entries** into the same visible thread.
- Supports Enter to send, Shift+Enter newline, clear, and explicit JSON export of the visible local thread.
- Nothing in the room is automatically stored as a durable conversation or submitted to an administrator inbox.

## Public knowledge connections
- Auren: `artist1970.github.io/Auren.github.io/knowledge/public-qa.v1.json`
- Pierre (actual repository spelling): `artist1970.github.io/Pierre.gihub.io/knowledge/public-qa.v1.json`
- NAIB: `artist1970.github.io/NAIB.github.io/knowledge/public-guidance.v1.json`

Only `approved-public` / `approved-public-seed` entries are considered. The JavaScript fetches these **public files** directly on explicit group-chat interaction; no private COREs, Conversation Archive, STOS tokens, or browser-local mentor vaults are read. Cross-origin deployment, browser policies, and actual page embedding must be tested separately. An unmatched question produces an honest fallback rather than an invented specialist reply.

Other mentors currently offer a public-page pop-up, **not** a fabricated group-chat response. Additional knowledge adapters need explicit approved public bank endpoints or an authenticated orchestration service.

## What genuine group AI conversations require
A real shared, dynamic conversation in which several independently configured specialists reason together is possible, but this static prototype does not claim to implement it. A future protected coordinator should:
1. Authenticate the administrator server-side (a browser passcode or hidden route is not sufficient).
2. Require explicitly invited mentor IDs, purpose, and allowed source scopes.
3. Route to distinct mentor runtimes with their own CORE instructions and private data access policy.
4. Mediate with NAIB/NOEMA and STOS trust boundaries; an AI reply is a proposal, never an authorization.
5. Enforce per-mentor privacy isolation, redaction, rate limits, timeout/cancellation, and revocation.
6. Return labeled responses with reference citations, model/runtime status, and partial-failure indicators.
7. Keep permanent memories or archival writes **opt-in and separately approved**; display recording/retention controls.
8. Test prompt-injection, false delegation, group leakage, child/student data isolation and multi-agent hallucination before operational claims.

## Preservation
Do not replace `admin/index.html`. Do not modify the original second-layer gate in `admin/2index.html`. Do not expose private repository URLs, internal STOS routes, or credentials through the public JS. This add-on is front-end functionality only; it confers no security protection.

## Verification
Source-level checks: presence of the script reference and module, expected mentor roster, approved knowledge endpoints, absence of private API credentials, and unchanged live resting page. Browser rendering, iframe policies, and cross-origin JSON delivery remain **unverified** until tested in an authorized environment.
