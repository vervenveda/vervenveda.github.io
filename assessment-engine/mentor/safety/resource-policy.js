const NEVER_RECOMMEND = new Set([
  "admin-only",
  "restricted",
  "unclassified",
  "archived"
]);

const GENERIC_PREFERENCE_WORDS = new Set([
  "study", "learning", "learn", "resource", "resources", "tool", "tools",
  "reading", "read", "help", "information"
]);

function tokens(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[’']/g, "")
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
  );
}

function normalizedTags(values = []) {
  return new Set(
    values.flatMap(value => [...tokens(value)])
  );
}

function hasMeaningfulOverlap(required = [], supplied = []) {
  const requiredTokens = normalizedTags(required);
  const suppliedTokens = normalizedTags(supplied);

  for (const token of requiredTokens) {
    if (!GENERIC_PREFERENCE_WORDS.has(token) && suppliedTokens.has(token)) return true;
  }
  return false;
}

function queryMatchesProtectedTerms(required = [], query = "") {
  const q = tokens(query);
  const protectedTokens = normalizedTags(required);

  for (const token of protectedTokens) {
    if (!GENERIC_PREFERENCE_WORDS.has(token) && q.has(token)) return true;
  }
  return false;
}

function queryExplicitlyMatchesResource(resource, query) {
  const q = tokens(query);
  if (!q.size) return false;

  const identifiers = [
    resource.title,
    resource.sourceId,
    resource.repository,
    ...(resource.tags || []),
    ...(resource.sensitiveTopics || [])
  ];

  const candidates = normalizedTags(identifiers);
  for (const token of q) {
    if (GENERIC_PREFERENCE_WORDS.has(token)) continue;
    if (candidates.has(token)) return true;
  }
  return false;
}

export function evaluateResourcePolicy(resource, {
  learner,
  role = "student",
  query = "",
  familyPreferences = [],
  explicitPreferenceTags = [],
  accountAware = false,
  explicitAdultOptIn = false
} = {}) {
  const classification = resource?.classification || "unclassified";
  const reasons = [];
  const requirements = [];

  if (resource?.recommendable !== true) {
    return {
      allowed: false,
      ready: false,
      policyState: "blocked",
      reasons: ["resource-not-recommendable"],
      requirements
    };
  }

  if (NEVER_RECOMMEND.has(classification)) {
    return {
      allowed: false,
      ready: false,
      policyState: "blocked",
      reasons: [`classification:${classification}`],
      requirements
    };
  }

  if (classification === "campaign") {
    const permitted = role === "parent" &&
      explicitAdultOptIn === true &&
      resource.explicitAdultOptIn === true;

    if (!permitted) {
      return {
        allowed: false,
        ready: false,
        policyState: "blocked",
        reasons: ["campaign-not-eligible-for-ordinary-mentor-search"],
        requirements: ["explicit-adult-opt-in"]
      };
    }
  }

  const requiredPreferences = resource.requiresPreferenceMatch || [];
  if (requiredPreferences.length) {
    const supplied = [
      ...(familyPreferences || []),
      ...(explicitPreferenceTags || []),
      ...(learner?.interests || [])
    ];

    const matched =
      hasMeaningfulOverlap(requiredPreferences, supplied) ||
      queryMatchesProtectedTerms(requiredPreferences, query);

    if (!matched) {
      return {
        allowed: false,
        ready: false,
        policyState: "blocked",
        reasons: ["preference-match-required"],
        requirements: requiredPreferences.map(value => `preference:${value}`)
      };
    }
  }

  const sensitiveTopics = resource.sensitiveTopics || [];
  if (sensitiveTopics.length &&
      !hasMeaningfulOverlap(sensitiveTopics, [...explicitPreferenceTags, query]) &&
      !queryMatchesProtectedTerms(sensitiveTopics, query)) {
    return {
      allowed: false,
      ready: false,
      policyState: "blocked",
      reasons: ["sensitive-topic-requires-explicit-query"],
      requirements: sensitiveTopics.map(value => `explicit-topic:${value}`)
    };
  }

  if (resource.requiresExplicitQuery === true && !queryExplicitlyMatchesResource(resource, query)) {
    return {
      allowed: false,
      ready: false,
      policyState: "blocked",
      reasons: ["explicit-query-required"],
      requirements: ["explicit-query"]
    };
  }

  if (resource.requiresAccountAwareness === true && accountAware !== true) {
    reasons.push("account-context-required");
    requirements.push("account-awareness");
  }

  if (resource.requiresFreshnessCheck === true || resource.dynamicContent === true) {
    reasons.push("freshness-verification-required");
    requirements.push("freshness-verification");
  }

  const conditional = requirements.includes("account-awareness") ||
    requirements.includes("freshness-verification");

  return {
    allowed: true,
    ready: !conditional,
    policyState: conditional ? "conditional" : "ready",
    reasons,
    requirements
  };
}

export function resourcePolicyAllows(resource, context = {}) {
  return evaluateResourcePolicy(resource, context).allowed;
}
