import { AgentMemoryStore } from './memory-store.js';
import { EvidenceEmitter } from './evidence-emitter.js';
import { rankHeuristicActions } from '../strategies/heuristic.js';
import { rankMonteCarloActions } from '../strategies/monte-carlo.js';
import { minimaxSearch } from '../strategies/minimax.js';
import { solveConstraintProblem } from '../strategies/constraint-solver.js';

function nowMs() {
  return globalThis.performance?.now?.() ?? Date.now();
}

function normalize(values, key = 'score') {
  if (!values.length) return new Map();
  const nums = values.map(item => Number(item[key]) || 0);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;
  return new Map(values.map(item => [item.action.id, ((Number(item[key]) || 0) - min) / span]));
}

function confidenceFromRanking(ranking, uncertainty = 0) {
  if (!ranking.length) return 0;
  if (ranking.length === 1) return Math.max(0.55, 1 - uncertainty);
  const gap = Math.max(0, ranking[0].score - ranking[1].score);
  const scale = Math.max(0.25, Math.abs(ranking[0].score), Math.abs(ranking[1].score));
  return Math.max(0.05, Math.min(0.98, 0.5 + (gap / scale) * 0.35 - uncertainty * 0.2));
}

export class SovereignProblemSolvingAgent {
  constructor(config = {}) {
    this.id = config.id || 'verve.sovereign-problem-solving-agent';
    this.version = config.version || '0.1.0';
    this.name = config.name || 'Verve Sovereign Problem-Solving Agent';
    this.memory = config.memory || new AgentMemoryStore({ key: config.memoryKey });
    this.evidence = config.evidence || new EvidenceEmitter({
      sourceApp: config.sourceApp || this.id,
      learnerId: config.learnerId || 'local-anonymous'
    });
    this.config = {};
    this.currentObservation = null;
    this.lastDecision = null;
    this.initialize(config);
  }

  initialize(config = {}) {
    this.config = {
      heuristicWeight: 0.42,
      simulationWeight: 0.58,
      simulations: 280,
      riskTolerance: 0.55,
      timeBudgetMs: 140,
      ...this.config,
      ...config
    };
    return this;
  }

  observe(observation) {
    this.currentObservation = observation;
    return observation;
  }

  legalActions(problem) {
    const violations = [];
    const legal = [];
    const constraints = problem.hardConstraints || [];

    for (const action of problem.actions || []) {
      const failed = [];
      for (const constraint of constraints) {
        let ok = false;
        try { ok = constraint.test(action, problem); } catch { ok = false; }
        if (!ok) failed.push({
          id: constraint.id || 'constraint',
          message: constraint.message || 'Action did not satisfy a required constraint.'
        });
      }
      if (failed.length) violations.push({ action, failed });
      else legal.push(action);
    }

    return { legal, violations };
  }

  evaluate(problem, action) {
    const clone = { ...problem, actions: [action] };
    return rankHeuristicActions(clone, { memory: this.memory })[0] || null;
  }

  chooseAction(problem, options = {}) {
    if (!problem?.id) throw new TypeError('A stable problem.id is required.');
    const startedAt = nowMs();
    const strategy = options.strategy || problem.strategy || 'hybrid';
    const decisionId = `${problem.id}:${Date.now()}`;
    let decision;

    if (strategy === 'minimax' || problem.type === 'adversarial') {
      const result = minimaxSearch({ ...problem.minimax, depth: options.depth || problem.minimax?.depth || 4 });
      decision = {
        decisionId,
        problemId: problem.id,
        domainId: problem.domainId || problem.id,
        strategy: 'minimax-alpha-beta',
        action: result.action,
        score: result.score,
        confidence: result.action ? 0.86 : 0,
        ranking: result.alternatives,
        diagnostics: result.diagnostics,
        explanation: {
          summary: result.action
            ? 'Selected the action with the strongest adversarial search result.'
            : 'No legal action was available.',
          principalVariation: result.principalVariation
        }
      };
    } else if (strategy === 'constraint' || problem.type === 'constraint') {
      const result = solveConstraintProblem(problem.constraintProblem || problem, options);
      decision = {
        decisionId,
        problemId: problem.id,
        domainId: problem.domainId || problem.id,
        strategy: 'constraint-backtracking',
        action: result.solution,
        score: result.solution ? 1 : 0,
        confidence: result.solution ? Math.min(0.98, 0.65 + result.solutions.length * 0.03) : 0.1,
        ranking: result.solutions,
        diagnostics: result.diagnostics,
        explanation: {
          summary: result.solution
            ? `Found ${result.solutions.length} valid solution${result.solutions.length === 1 ? '' : 's'} within the search budget.`
            : 'No valid solution was found within the search budget.',
          frequentRejections: result.diagnostics.frequentRejections
        }
      };
    } else {
      const { legal, violations } = this.legalActions(problem);
      if (!legal.length) {
        decision = {
          decisionId,
          problemId: problem.id,
          domainId: problem.domainId || problem.id,
          strategy,
          action: null,
          score: -Infinity,
          confidence: 0,
          ranking: [],
          violations,
          explanation: { summary: 'Every candidate action violated at least one required constraint.' }
        };
      } else {
        const legalProblem = { ...problem, actions: legal };
        const heuristic = rankHeuristicActions(legalProblem, { memory: this.memory });
        const heuristicNorm = normalize(heuristic);
        let monteCarlo = [];
        let simulationNorm = new Map();

        if (strategy === 'monte-carlo' || strategy === 'hybrid') {
          monteCarlo = rankMonteCarloActions(legalProblem, {
            simulations: options.simulations || this.config.simulations,
            seed: options.seed || `${problem.id}:${problem.seed || 'default'}`,
            riskTolerance: options.riskTolerance ?? this.config.riskTolerance,
            timeBudgetMs: options.timeBudgetMs || this.config.timeBudgetMs
          });
          simulationNorm = normalize(monteCarlo);
        }

        const combined = legal.map(action => {
          const heuristicResult = heuristic.find(item => item.action.id === action.id);
          const simulationResult = monteCarlo.find(item => item.action.id === action.id);
          const h = heuristicNorm.get(action.id) ?? 0;
          const m = simulationNorm.get(action.id) ?? h;
          const score = strategy === 'heuristic'
            ? heuristicResult.score
            : h * this.config.heuristicWeight + m * this.config.simulationWeight;
          return {
            action,
            score,
            heuristicScore: heuristicResult?.score ?? 0,
            simulationScore: simulationResult?.score ?? null,
            expectedUtility: simulationResult?.average ?? null,
            uncertainty: simulationResult?.standardDeviation ?? 0,
            downside: simulationResult?.downside ?? null,
            upside: simulationResult?.upside ?? null,
            simulations: simulationResult?.simulations ?? 0,
            memoryBias: heuristicResult?.memoryBias ?? 0,
            contributions: heuristicResult?.contributions ?? []
          };
        }).sort((a, b) => b.score - a.score);

        const top = combined[0];
        const uncertainty = top?.uncertainty || 0;
        decision = {
          decisionId,
          problemId: problem.id,
          domainId: problem.domainId || problem.id,
          strategy: strategy === 'hybrid' ? 'hybrid-heuristic-monte-carlo' : strategy,
          action: top?.action || null,
          score: top?.score ?? 0,
          confidence: confidenceFromRanking(combined, uncertainty),
          ranking: combined,
          violations,
          diagnostics: {
            legalActions: legal.length,
            rejectedActions: violations.length,
            simulations: combined.reduce((sum, item) => sum + item.simulations, 0)
          },
          explanation: {
            summary: top
              ? `Recommended “${top.action.label || top.action.id}” after checking constraints, weighted factors, simulated outcomes, and local outcome memory.`
              : 'No recommendation was produced.',
            strongestFactors: (top?.contributions || []).slice(0, 4),
            expectedUtility: top?.expectedUtility ?? null,
            uncertainty: top?.uncertainty ?? null,
            memoryBias: top?.memoryBias ?? 0
          }
        };
      }
    }

    decision.elapsedMs = nowMs() - startedAt;
    decision.context = problem.context || {};
    this.lastDecision = decision;
    this.evidence.emit('agent.decision', {
      problemId: decision.problemId,
      domainId: decision.domainId,
      strategy: decision.strategy,
      selectedActionId: decision.action?.id || null,
      confidence: decision.confidence,
      elapsedMs: decision.elapsedMs,
      diagnostics: decision.diagnostics || {}
    });
    return decision;
  }

  explainDecision(decision = this.lastDecision) {
    if (!decision) return { summary: 'No decision has been made yet.' };
    return decision.explanation || { summary: 'No explanation was recorded.' };
  }

  receiveOutcome(outcome = {}) {
    const decision = outcome.decision || this.lastDecision;
    if (!decision?.action?.id) throw new TypeError('An outcome requires a prior selected action.');
    const reward = Math.max(-1, Math.min(1, Number(outcome.reward) || 0));
    const memoryEntry = this.memory.update(
      decision.domainId,
      decision.action.id,
      reward,
      decision.context || {},
      outcome.learningRate || 0.24
    );

    const event = this.evidence.emit('agent.outcome', {
      problemId: decision.problemId,
      domainId: decision.domainId,
      selectedActionId: decision.action.id,
      reward,
      outcomeLabel: outcome.label || null,
      memoryValue: memoryEntry.value,
      observationCount: memoryEntry.count
    });
    return { memoryEntry, event };
  }

  exportEvidence() {
    return this.evidence.export();
  }

  resetMemory() {
    this.memory.reset();
    this.evidence.emit('agent.memory-reset', { reason: 'user-requested' });
  }
}
