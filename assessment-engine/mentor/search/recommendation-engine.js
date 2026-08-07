import { ResourceResolver } from "../registry/resource-resolver.js";
import { FreshnessController } from "./freshness-controller.js";
import { SovereignResourceAdapter } from "./sovereign-resource-adapter.js";
import { explainRecommendation } from "./recommendation-explainer.js";

export class RecommendationEngine {
  constructor({
    registry,
    resolver,
    freshnessController,
    sovereignAdapter,
    learnerId = "local-anonymous"
  } = {}) {
    this.resolver = resolver || new ResourceResolver({ registry });
    this.freshness = freshnessController || new FreshnessController();
    this.sovereign = sovereignAdapter || new SovereignResourceAdapter({ learnerId });
    this.lastDecision = null;
  }

  recommend(context = {}, {
    limit = 5,
    includeConditional = true
  } = {}) {
    const requestedLimit = Math.max(1, Math.min(10, Number(limit) || 5));
    const broaderLimit = Math.max(requestedLimit * 4, 12);

    const eligible = this.resolver.resolve({
      query: context.query,
      learner: context.learner,
      role: context.role,
      limit: broaderLimit,
      preferredDomains: context.preferredDomains,
      intentDomains: context.intentDomains,
      favoriteResourceIds: context.favoriteResourceIds,
      recentResourceIds: context.recentResourceIds,
      includeAdultResources: context.role === "parent",
      includeConditional,
      familyPreferences: context.familyPreferences,
      explicitPreferenceTags: context.explicitPreferenceTags,
      accountAware: context.accountAware,
      explicitAdultOptIn: context.explicitAdultOptIn,
      sourcePriorityByRepository: context.sourcePriorityByRepository,
      preferredMinutes: context.preferredMinutes
    });

    const decorated = this.freshness.decorate(eligible, {
      freshnessEvidence: context.freshnessEvidence
    });

    const ranked = this.sovereign.rank(decorated, context, {
      strategy: "heuristic"
    });

    this.lastDecision = ranked.decision;

    const recommendations = ranked.resources
      .slice(0, requestedLimit)
      .map((resource, index) => ({
        ...resource,
        recommendation: explainRecommendation(resource, {
          intent: context.intent,
          learner: context.learner,
          rank: index + 1
        })
      }));

    return {
      recommendations,
      decision: ranked.decision,
      candidateCount: eligible.length,
      returnedCount: recommendations.length
    };
  }

  receiveOutcome({ reward = 0, label = "" } = {}) {
    return this.sovereign.receiveOutcome({
      decision: this.lastDecision,
      reward,
      label
    });
  }
}
