import { detectQueryIntent } from "./query-intent.js";
import { buildSearchContext } from "./context-builder.js";
import { RecommendationEngine } from "./recommendation-engine.js";

export class MentorSearch {
  constructor({
    registry,
    learner,
    role = "student",
    recommendationEngine
  } = {}) {
    this.registry = registry;
    this.learner = learner || {};
    this.role = role;
    this.engine = recommendationEngine || new RecommendationEngine({
      registry,
      learnerId: learner?.learnerId || "local-anonymous"
    });
    this.lastResult = null;
  }

  search(query, options = {}) {
    const intent = detectQueryIntent(query);

    const context = buildSearchContext({
      query,
      intent,
      learner: options.learner || this.learner,
      role: options.role || this.role,
      familyPreferences: options.familyPreferences || [],
      currentRepository: options.currentRepository || "",
      currentCourseRepository: options.currentCourseRepository || "",
      currentSchoolRepository: options.currentSchoolRepository || "",
      favoriteResourceIds: options.favoriteResourceIds || [],
      recentResourceIds: options.recentResourceIds || [],
      preferredDomains: options.preferredDomains || [],
      preferredMinutes: options.preferredMinutes,
      accountAware: options.accountAware || false,
      explicitAdultOptIn: options.explicitAdultOptIn || false,
      freshnessEvidence: options.freshnessEvidence || {}
    });

    const result = this.engine.recommend(context, {
      limit: options.limit || 5,
      includeConditional: options.includeConditional !== false
    });

    this.lastResult = {
      query: String(query || ""),
      intent,
      context: {
        stage: context.learner?.stage || "",
        role: context.role,
        preferredDomains: context.preferredDomains,
        intentDomains: context.intentDomains,
        sourcePriorityByRepository: context.sourcePriorityByRepository
      },
      recommendations: result.recommendations,
      candidateCount: result.candidateCount,
      returnedCount: result.returnedCount
    };

    return this.lastResult;
  }

  recordOutcome({ reward = 0, label = "" } = {}) {
    return this.engine.receiveOutcome({ reward, label });
  }
}
