import { rankResources } from "./resource-ranker.js";
import { resourceAllowedForStage } from "../safety/age-policy.js";

const NEVER_RECOMMEND = new Set(["admin-only", "restricted", "unclassified", "archived"]);

function roleAllowed(resource, role) {
  const roles = resource.roles || ["student", "parent", "educator"];
  return roles.includes(role);
}

function classificationAllowed(resource, role) {
  const classification = resource.classification || "unclassified";
  if (NEVER_RECOMMEND.has(classification)) return false;

  // Campaign/political sources are never part of ordinary student recommendations.
  if (classification === "campaign") return role === "parent" && resource.explicitAdultOptIn === true;

  return true;
}

export class ResourceResolver {
  constructor({ registry } = {}) {
    this.registry = registry;
  }

  resolve({
    query = "",
    learner,
    role = "student",
    limit = 5,
    preferredDomains = [],
    favoriteResourceIds = [],
    recentResourceIds = [],
    includeAdultResources = false
  } = {}) {
    const resources = this.registry?.all?.() || [];

    const filtered = resources.filter(resource => {
      if (resource.recommendable !== true) return false;
      if (!roleAllowed(resource, role)) return false;
      if (!classificationAllowed(resource, role)) return false;
      if (!resourceAllowedForStage(resource, learner?.stage || "preschool", {
        includeAdultResources,
        role
      })) return false;
      return true;
    });

    return rankResources(filtered, {
      query,
      learner,
      preferredDomains,
      favoriteResourceIds,
      recentResourceIds
    }).slice(0, Math.max(1, Math.min(20, limit)));
  }
}
