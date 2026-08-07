export function explainRecommendation(resource, {
  intent,
  learner,
  rank = 1
} = {}) {
  const reasons = [];
  const signals = resource._mentorSignals || {};
  const policy = resource._mentorPolicy || {};
  const freshness = resource._freshness || {};

  if (signals.sourcePriority >= 5) reasons.push("It is close to the learner's current course or resource.");
  else if (signals.sourcePriority >= 4) reasons.push("It comes from the learner's current school.");
  if (signals.queryOverlap > 0) reasons.push("Its title, skills, or tags match the request.");
  if (signals.domainMatches > 0) reasons.push("It matches the requested learning domain.");
  if (signals.interestOverlap > 0) reasons.push("It also overlaps with recent learner interests.");
  if (signals.timeFit >= 0.8 && Number.isFinite(Number(resource.minutes))) {
    reasons.push(`Its estimated ${resource.minutes}-minute length fits the current time preference.`);
  }
  if (resource.featured) reasons.push("It is marked as a featured resource by its source repository.");

  if (freshness.verificationRequired) {
    reasons.push("Its information can change, so current facts should be verified before the Mentor relies on them.");
  }

  if (policy.requirements?.includes("account-awareness")) {
    reasons.push("It involves an account or network context, so the Mentor should explain that context before opening it.");
  }

  const source = resource.sourceId || resource.repository || "the ecosystem";
  const prefix = rank === 1 ? "Best match" : `Option ${rank}`;

  return {
    title: `${prefix}: ${resource.title}`,
    summary: reasons[0] || `This resource was selected from ${source} after eligibility and relevance checks.`,
    reasons,
    source,
    readiness: freshness.verificationRequired
      ? "verify-before-use"
      : (policy.policyState === "conditional" ? "conditional" : "ready"),
    learnerStage: learner?.stage || "",
    intent: intent?.type || "general"
  };
}
