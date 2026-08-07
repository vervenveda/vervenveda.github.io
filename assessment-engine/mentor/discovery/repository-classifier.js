import { DISCOVERY_POLICY } from "./discovery-policy.js";

function matches(name, patterns) {
  return patterns.some(pattern => pattern.test(name));
}

export function classifyRepository(repo, accountPolicy = {}) {
  const name = String(repo?.name || "");
  const fullName = String(repo?.full_name || "");
  const owner = String(repo?.owner?.login || fullName.split("/")[0] || "");

  if (matches(name, DISCOVERY_POLICY.adminPatterns)) {
    return {
      classification: "admin-only",
      confidence: 1,
      recommendable: false,
      reason: "Restricted infrastructure naming policy."
    };
  }

  if (/jenniferpearl2028/i.test(owner)) {
    return {
      classification: "campaign",
      confidence: 1,
      recommendable: false,
      reason: "Campaign account is segregated from ordinary educational recommendations."
    };
  }

  const rules = [
    ["educational", DISCOVERY_POLICY.educationalPatterns],
    ["creative-cultural", DISCOVERY_POLICY.creativePatterns],
    ["wellness", DISCOVERY_POLICY.wellnessPatterns],
    ["civic", DISCOVERY_POLICY.civicPatterns],
    ["research-information", DISCOVERY_POLICY.researchPatterns],
    ["professional-practical", DISCOVERY_POLICY.professionalPatterns]
  ];

  for (const [classification, patterns] of rules) {
    if (matches(name, patterns)) {
      return {
        classification,
        confidence: 0.72,
        recommendable: false,
        reason: "Heuristic repository classification; a valid Mentor manifest is required for resource recommendation."
      };
    }
  }

  return {
    classification: accountPolicy.defaultClassification || "unclassified",
    confidence: 0.25,
    recommendable: false,
    reason: "Repository acknowledged but not yet classified for recommendation."
  };
}
