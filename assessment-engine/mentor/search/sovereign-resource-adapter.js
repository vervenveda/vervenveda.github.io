import { SovereignProblemSolvingAgent } from "../../agents/core/sovereign-agent.js";

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function normalizeScores(resources) {
  const values = resources.map(resource => Number(resource._mentorScore) || 0);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = max - min || 1;
  return new Map(resources.map(resource => [
    resource.id,
    clamp01(((Number(resource._mentorScore) || 0) - min) / span)
  ]));
}

export class SovereignResourceAdapter {
  constructor({ learnerId = "local-anonymous", memory, evidence } = {}) {
    this.agent = new SovereignProblemSolvingAgent({
      sourceApp: "khaemenes-mentor-resource-search",
      learnerId,
      memoryKey: "khaemenes_mentor_resource_memory_v1",
      memory,
      evidence
    });
    this.lastDecision = null;
  }

  rank(resources = [], context = {}, {
    strategy = "heuristic"
  } = {}) {
    if (!resources.length) {
      return {
        resources: [],
        decision: null
      };
    }

    const normalized = normalizeScores(resources);

    const actions = resources.map(resource => {
      const signals = resource._mentorSignals || {};
      const freshness = resource._freshness || {};
      const policy = resource._mentorPolicy || {};

      const sourceProximity = clamp01((Number(signals.sourcePriority) || 0) / 6);
      const interestFit = clamp01((Number(signals.interestOverlap) || 0) / 3);
      const domainFit = clamp01((Number(signals.domainMatches) || 0) / 2);
      const timeFit = clamp01(signals.timeFit ?? 0.5);
      const freshnessFit = context.intent?.requiresFreshness
        ? (resource.requiresFreshnessCheck ? 1 : 0.65)
        : (freshness.verificationRequired ? 0.55 : 1);
      const readiness = policy.policyState === "ready" ? 1 : 0.65;

      return {
        id: resource.id,
        label: resource.title,
        resource,
        features: {
          relevance: normalized.get(resource.id) ?? 0,
          sourceProximity,
          interestFit,
          domainFit,
          timeFit,
          freshnessFit,
          readiness,
          featured: resource.featured ? 1 : 0
        }
      };
    });

    const problem = {
      id: `mentor-resource:${context.intent?.type || "general"}`,
      domainId: `mentor-resource:${context.learner?.stage || "general"}`,
      type: "recommendation",
      actions,
      weights: {
        relevance: 4.2,
        sourceProximity: 2.6,
        domainFit: 2.0,
        interestFit: 1.3,
        timeFit: 0.8,
        freshnessFit: 1.8,
        readiness: 2.0,
        featured: 0.35
      },
      memoryWeight: 0.16,
      hardConstraints: [],
      context: {
        stage: context.learner?.stage || "",
        role: context.role || "student",
        intent: context.intent?.type || "general"
      }
    };

    // Heuristic is intentionally the default. Monte Carlo is not used unless
    // a future resource adapter supplies an explicit simulation/outcome model.
    const decision = this.agent.chooseAction(problem, { strategy });
    this.lastDecision = decision;

    const orderedIds = (decision.ranking || []).map(item => item.action?.id).filter(Boolean);
    const order = new Map(orderedIds.map((id, index) => [id, index]));

    const ranked = [...resources].sort((a, b) => {
      const ai = order.has(a.id) ? order.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bi = order.has(b.id) ? order.get(b.id) : Number.MAX_SAFE_INTEGER;
      return ai - bi;
    });

    return {
      resources: ranked,
      decision
    };
  }

  receiveOutcome({ reward = 0, label = "", decision } = {}) {
    const target = decision || this.lastDecision;
    if (!target?.action?.id) return null;
    return this.agent.receiveOutcome({
      decision: target,
      reward,
      label
    });
  }
}
