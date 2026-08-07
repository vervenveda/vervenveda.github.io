function parseEvidence(value) {
  if (!value) return null;
  if (typeof value === "string") return { verifiedAt: value };
  if (typeof value === "object") return value;
  return null;
}

function validDate(value) {
  const ms = Date.parse(value || "");
  return Number.isFinite(ms) ? ms : null;
}

export class FreshnessController {
  assess(resource, {
    freshnessEvidence = {},
    now = new Date()
  } = {}) {
    const requiresVerification =
      resource?.requiresFreshnessCheck === true ||
      resource?.dynamicContent === true ||
      resource?.policy?.requiresFreshnessCheck === true ||
      resource?.policy?.dynamicContent === true;

    if (!requiresVerification) {
      return {
        state: "stable-resource",
        verificationRequired: false,
        verified: true,
        reason: "Resource does not declare dynamic/current-information requirements."
      };
    }

    const evidence = parseEvidence(
      freshnessEvidence?.[resource.id] ||
      freshnessEvidence?.[resource.sourceId] ||
      freshnessEvidence?.[resource.repository]
    );

    if (!evidence) {
      return {
        state: "verify-before-use",
        verificationRequired: true,
        verified: false,
        reason: "This resource can contain time-sensitive or externally changing information."
      };
    }

    const verifiedAt = validDate(evidence.verifiedAt);
    const validUntil = validDate(evidence.validUntil);

    if (validUntil !== null) {
      const current = now instanceof Date ? now.getTime() : Date.parse(now);
      return {
        state: current <= validUntil ? "verified-current" : "verification-expired",
        verificationRequired: current > validUntil,
        verified: current <= validUntil,
        verifiedAt: evidence.verifiedAt || null,
        validUntil: evidence.validUntil || null,
        reason: current <= validUntil
          ? "Freshness evidence is still within its declared validity period."
          : "Freshness evidence has expired."
      };
    }

    const windowMinutes = Number(resource.freshnessWindowMinutes);
    if (verifiedAt !== null && Number.isFinite(windowMinutes) && windowMinutes > 0) {
      const current = now instanceof Date ? now.getTime() : Date.parse(now);
      const expiresAt = verifiedAt + windowMinutes * 60_000;
      return {
        state: current <= expiresAt ? "verified-current" : "verification-expired",
        verificationRequired: current > expiresAt,
        verified: current <= expiresAt,
        verifiedAt: evidence.verifiedAt || null,
        validUntil: new Date(expiresAt).toISOString(),
        reason: current <= expiresAt
          ? "Freshness evidence is within the resource freshness window."
          : "The resource freshness window has elapsed."
      };
    }

    return {
      state: "verified-for-this-session",
      verificationRequired: false,
      verified: true,
      verifiedAt: evidence.verifiedAt || null,
      reason: "Caller supplied freshness evidence for this session."
    };
  }

  decorate(resources = [], context = {}) {
    return resources.map(resource => ({
      ...resource,
      _freshness: this.assess(resource, context)
    }));
  }
}
