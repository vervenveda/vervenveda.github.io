export const AGE_POLICIES = Object.freeze({
  preschool: {
    allowedAudiences: ["preschool"],
    allowNews: false,
    allowCampaign: false,
    allowOpenResearch: false
  },
  kindergarten: {
    allowedAudiences: ["preschool", "kindergarten"],
    allowNews: false,
    allowCampaign: false,
    allowOpenResearch: false
  },
  elementary: {
    allowedAudiences: ["elementary"],
    allowNews: false,
    allowCampaign: false,
    allowOpenResearch: false
  },
  middle: {
    allowedAudiences: ["middle"],
    allowNews: true,
    allowCampaign: false,
    allowOpenResearch: true
  },
  high: {
    allowedAudiences: ["high"],
    allowNews: true,
    allowCampaign: false,
    allowOpenResearch: true
  },
  "higher-learning": {
    allowedAudiences: ["higher-learning", "adult"],
    allowNews: true,
    allowCampaign: false,
    allowOpenResearch: true
  },
  adult: {
    allowedAudiences: ["adult", "parent", "higher-learning"],
    allowNews: true,
    allowCampaign: true,
    allowOpenResearch: true
  }
});

export function resourceAllowedForStage(resource, stage, {
  role = "student",
  includeAdultResources = false
} = {}) {
  const policy = AGE_POLICIES[stage] || AGE_POLICIES.preschool;
  const audiences = Array.isArray(resource.audiences) ? resource.audiences : [];

  if (resource.classification === "campaign") {
    return role === "parent" &&
      stage !== "preschool" &&
      resource.explicitAdultOptIn === true &&
      policy.allowCampaign;
  }

  if (resource.classification === "research-information" &&
      /news/i.test((resource.tags || []).join(" ")) &&
      !policy.allowNews) {
    return false;
  }

  if (audiences.length === 0) return role === "parent" && includeAdultResources;
  if (audiences.some(audience => policy.allowedAudiences.includes(audience))) return true;

  return role === "parent" &&
    includeAdultResources &&
    audiences.some(audience => ["adult", "parent"].includes(audience));
}
