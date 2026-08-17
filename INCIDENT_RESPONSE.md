# Verve N Veda Public Repository Incident Response

Use this procedure for suspected compromise, accidental secret exposure, unexplained production changes, malicious content, or other security-significant events.

## 1. Contain

Avoid broad corrective edits. If production is actively unsafe, use the least disruptive action available while preserving a path to the last known-good state.

## 2. Preserve Evidence

Record non-secret information needed to understand the event: affected file/service, approximate discovery time, relevant commit/deployment identifier, observed behavior, and known-good version when available.

Do not reproduce secrets publicly.

## 3. Rotate Exposed Authority

If a credential, token, password, private key, or other secret may have been exposed, assume compromise and revoke or rotate it at its issuing authority. Removing visible text from Git history does not make the old credential safe.

## 4. Restore Integrity

Compare affected production artifacts with known-good versions. For `index.html`, prefer restoration or a minimal corrective patch over a rewrite.

Verify high-impact files such as `CNAME` and deployment/security configuration when relevant.

## 5. Verify

After containment/restoration, verify HTTPS loading, critical navigation, browser-console behavior, unexpected third-party resources, resolution of the reported issue, and removal of exposed secrets from active production.

## 6. Document

Keep sensitive incident details private. Public summaries must not reveal secrets, private topology, or information that materially weakens security.

## 7. Improve Carefully

After closure, identify narrowly scoped preventive improvements and follow `CHANGE_CONTROL.md`.

**Contain first. Preserve evidence. Rotate exposed authority. Restore known-good state. Then improve carefully.**
