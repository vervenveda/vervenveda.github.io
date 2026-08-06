import { createSeededRng } from '../core/seeded-rng.js';

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function variance(values, average) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + ((value - average) ** 2), 0) / values.length;
}

export function rankMonteCarloActions(problem, {
  simulations = 240,
  seed = `${problem.id || 'problem'}:${Date.now()}`,
  riskTolerance = 0.5,
  timeBudgetMs = 120
} = {}) {
  if (typeof problem.simulate !== 'function') {
    throw new TypeError('Monte Carlo problems require a simulate(action, rng, problem) function.');
  }

  const rng = createSeededRng(seed);
  const actions = problem.actions || [];
  const perAction = Math.max(1, Math.floor(simulations / Math.max(1, actions.length)));
  const startedAt = globalThis.performance?.now?.() ?? Date.now();
  const results = [];

  for (const action of actions) {
    const samples = [];
    for (let i = 0; i < perAction; i += 1) {
      const elapsed = (globalThis.performance?.now?.() ?? Date.now()) - startedAt;
      if (elapsed > timeBudgetMs && samples.length >= 8) break;
      const outcome = problem.simulate(action, rng, problem);
      const utility = typeof outcome === 'number'
        ? outcome
        : Number(problem.evaluateOutcome?.(outcome, action, problem) ?? outcome?.utility ?? 0);
      samples.push(Number.isFinite(utility) ? utility : 0);
    }

    const average = mean(samples);
    const sampleVariance = variance(samples, average);
    const standardDeviation = Math.sqrt(sampleVariance);
    const downside = samples.length ? Math.min(...samples) : 0;
    const upside = samples.length ? Math.max(...samples) : 0;
    const riskPenalty = standardDeviation * (1 - Math.max(0, Math.min(1, riskTolerance)));
    const score = average - riskPenalty;

    results.push({
      action,
      score,
      average,
      standardDeviation,
      downside,
      upside,
      simulations: samples.length,
      samples
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
