/**
 * Small transparent backtracking constraint solver.
 * Variables: [{ id, domain: [...] }]
 * Constraints: [{ id, message, test(assignment, complete) }]
 */
export function solveConstraintProblem(problem, { maxSolutions = 25, timeBudgetMs = 150 } = {}) {
  const variables = (problem.variables || []).map(variable => ({
    ...variable,
    domain: [...(variable.domain || [])]
  }));
  const constraints = problem.constraints || [];
  const solutions = [];
  const rejected = [];
  let nodes = 0;
  const startedAt = globalThis.performance?.now?.() ?? Date.now();

  function valid(assignment, complete = false) {
    for (const constraint of constraints) {
      let ok = false;
      try { ok = constraint.test(assignment, complete); } catch { ok = false; }
      if (!ok) {
        rejected.push({ constraintId: constraint.id, message: constraint.message || constraint.id });
        return false;
      }
    }
    return true;
  }

  function nextVariable(assignment) {
    return variables
      .filter(variable => !(variable.id in assignment))
      .sort((a, b) => a.domain.length - b.domain.length)[0] || null;
  }

  function backtrack(assignment) {
    nodes += 1;
    const elapsed = (globalThis.performance?.now?.() ?? Date.now()) - startedAt;
    if (elapsed > timeBudgetMs || solutions.length >= maxSolutions) return;

    const variable = nextVariable(assignment);
    if (!variable) {
      if (valid(assignment, true)) solutions.push({ ...assignment });
      return;
    }

    for (const value of variable.domain) {
      const next = { ...assignment, [variable.id]: value };
      if (valid(next, false)) backtrack(next);
      if (solutions.length >= maxSolutions) break;
    }
  }

  backtrack({ ...(problem.initialAssignment || {}) });
  return {
    solution: solutions[0] || null,
    solutions,
    diagnostics: {
      nodes,
      solutionCount: solutions.length,
      elapsedMs: (globalThis.performance?.now?.() ?? Date.now()) - startedAt,
      frequentRejections: Object.values(rejected.reduce((acc, item) => {
        const key = item.constraintId;
        acc[key] ??= { ...item, count: 0 };
        acc[key].count += 1;
        return acc;
      }, {})).sort((a, b) => b.count - a.count).slice(0, 5)
    }
  };
}
