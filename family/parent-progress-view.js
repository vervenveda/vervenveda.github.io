export function buildParentProgressView(summary = {}) {
  return {
    learner: summary.nickname || "Learner",
    stage: summary.stage || "",
    completedAdventures: summary.totalCompleted || 0,
    mostExplored: summary.mostExploredDomains || [],
    feedback: summary.feedbackCounts || {},
    recentResources: summary.recentResources || [],
    note: summary.interpretiveLimits ||
      "This is a structured activity summary, not a diagnosis or grade."
  };
}
