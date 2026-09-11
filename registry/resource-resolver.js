import { rankResources } from "./resource-ranker.js";
import { resourceAllowedForStage } from "../safety/age-policy.js";
import { evaluateResourcePolicy } from "../safety/resource-policy.js";

function roleAllowed(resource, role) {
  const roles = resource.roles || ["student", "parent", "educator"];
  return roles.includes(role);
}

export class ResourceResolver {
  constructor({ registry } = {}) {
    this.registry = registry;
  }

  evaluate({
    query = "",
    learner,
    role = "student",
    familyPreferences = [],
    explicitPreferenceTags = [],
    includeAdultResources = false,
    accountAware = false,
    explicitAdultOptIn = false
  } = {}) {
    const resources = this.registry?.all?.() || [];
    const ready = [];
    const conditional = [];
    const blocked = [];

    for (const resource of resources) {
      if (!roleAllowed(resource, role)) {
        blocked.push({ resource, reason: "role-not-eligible" });
        continue;
      }

      if (!resourceAllowedForStage(resource, learner?.stage || "preschool", {
        includeAdultResources,
        role
      })) {
        blocked.push({ resource, reason: "stage-not-eligible" });
        continue;
      }

      const policy = evaluateResourcePolicy(resource, {
        learner,
        role,
        query,
        familyPreferences,
        explicitPreferenceTags,
        accountAware,
        explicitAdultOptIn
      });

      const decorated = { ...resource, _mentorPolicy: policy };

      if (!policy.allowed) blocked.push({ resource: decorated, reason: policy.reasons[0] || "policy-blocked" });
      else if (policy.ready) ready.push(decorated);
      else conditional.push(decorated);
    }

    return { ready, conditional, blocked };
  }

  resolve({
    query = "",
    learner,
    role = "student",
    limit = 5,
    preferredDomains = [],
    intentDomains = [],
    favoriteResourceIds = [],
    recentResourceIds = [],
    includeAdultResources = false,
    includeConditional = false,
    familyPreferences = [],
    explicitPreferenceTags = [],
    accountAware = false,
    explicitAdultOptIn = false,
    sourcePriorityByRepository = {},
    preferredMinutes
  } = {}) {
    const evaluated = this.evaluate({
      query,
      learner,
      role,
      familyPreferences,
      explicitPreferenceTags,
      includeAdultResources,
      accountAware,
      explicitAdultOptIn
    });

    const candidates = includeConditional
      ? [...evaluated.ready, ...evaluated.conditional]
      : evaluated.ready;

    return rankResources(candidates, {
      query,
      learner,
      preferredDomains,
      intentDomains,
      favoriteResourceIds,
      recentResourceIds,
      sourcePriorityByRepository,
      preferredMinutes
    }).slice(0, Math.max(1, Math.min(20, limit)));
  }
}
