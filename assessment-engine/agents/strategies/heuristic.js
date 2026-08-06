function normalizeWeights(weights = {}) {
  const entries = Object.entries(weights);
  const magnitude = entries.reduce((sum, [, value]) => sum + Math.abs(Number(value) || 0), 0) || 1;
  return Object.fromEntries(entries.map(([key, value]) => [key, (Number(value) || 0) / magnitude]));
}

export function scoreHeuristicAction(action, problem, memoryBias = 0) {
  const weights = normalizeWeights(problem.weights || {});
  const features = action.features || {};
  const contributions = [];
  let score = 0;

  for (const [feature, weight] of Object.entries(weights)) {
    const value = Number(features[feature] ?? 0);
    const contribution = value * weight;
    score += contribution;
    contributions.push({ feature, value, weight, contribution });
  }

  const memoryWeight = Number(problem.memoryWeight ?? 0.18);
  const memoryContribution = memoryBias * memoryWeight;
  score += memoryContribution;
  contributions.push({
    feature: 'adaptive-memory',
    value: memoryBias,
    weight: memoryWeight,
    contribution: memoryContribution
  });

  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return { score, contributions };
}

export function rankHeuristicActions(problem, { memory } = {}) {
  return (problem.actions || []).map(action => {
    const memoryBias = memory?.getBias(
      problem.domainId || problem.id || 'general',
      action.id,
      problem.context || {}
    ) || 0;
    return {
      action,
      ...scoreHeuristicAction(action, problem, memoryBias),
      memoryBias
    };
  }).sort((a, b) => b.score - a.score);
}
