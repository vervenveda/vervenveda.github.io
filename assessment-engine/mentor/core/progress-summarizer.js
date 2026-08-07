export function summarizeProgress({
  learner,
  completed = {},
  domainCounts = {},
  feedback = {},
  recentResources = []
} = {}) {
  const completedEntries = Object.entries(completed || {});
  const totalCompleted = completedEntries.reduce(
    (sum, [, value]) => sum + Math.max(0, Number(value?.count ?? value ?? 0)),
    0
  );

  const domains = Object.entries(domainCounts || {})
    .map(([domain, count]) => ({ domain, count: Math.max(0, Number(count) || 0) }))
    .sort((a, b) => b.count - a.count);

  const feedbackCounts = Object.values(feedback || {}).reduce((acc, item) => {
    const label = typeof item === "string" ? item : item?.label;
    if (label) acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return {
    learnerId: learner?.learnerId || "",
    nickname: learner?.nickname || "",
    stage: learner?.stage || "",
    totalCompleted,
    mostExploredDomains: domains.slice(0, 3),
    feedbackCounts,
    recentResources: recentResources.slice(0, 10),
    generatedAt: new Date().toISOString(),
    interpretiveLimits:
      "This is a structured activity summary, not a diagnosis, grade, or psychological profile."
  };
}
