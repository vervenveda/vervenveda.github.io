import assert from 'node:assert/strict';
import { SovereignProblemSolvingAgent } from '../core/sovereign-agent.js';
import { createLearningPathProblem } from '../adapters/learning-path-adapter.js';

const agent = new SovereignProblemSolvingAgent({
  memoryKey: 'test-memory',
  simulations: 120,
  timeBudgetMs: 500
});

const learning = createLearningPathProblem({
  numeracy: 0.3,
  reading: 0.7,
  reasoning: 0.55,
  energy: 0.6,
  challengePreference: 0.55,
  timeAvailable: 25
});
const recommendation = agent.chooseAction(learning, { seed: 'test-seed', simulations: 120, timeBudgetMs: 500 });
assert.ok(recommendation.action, 'learning-path agent should select an action');
assert.ok(recommendation.action.minutes <= 30, 'selected action should satisfy the time constraint');
assert.ok(recommendation.confidence >= 0 && recommendation.confidence <= 1);

const outcome = agent.receiveOutcome({ decision: recommendation, reward: 1, label: 'helpful' });
assert.equal(outcome.memoryEntry.count, 1);
assert.ok(outcome.memoryEntry.value > 0);

const adversarial = {
  id: 'take-away-test',
  type: 'adversarial',
  minimax: {
    state: { tokens: 13, player: 'agent', lastPlayer: null },
    rootPlayer: 'agent',
    depth: 13,
    generateActions: state => [1, 2, 3].filter(n => n <= state.tokens).map(amount => ({ id: `take-${amount}`, amount })),
    applyAction: (state, action, player) => ({
      tokens: state.tokens - action.amount,
      player: player === 'agent' ? 'opponent' : 'agent',
      lastPlayer: player
    }),
    isTerminal: state => state.tokens === 0,
    currentPlayer: state => state.player,
    evaluate: (state, root) => state.tokens === 0 ? (state.lastPlayer === root ? 100 : -100) : 0
  }
};
const strategy = agent.chooseAction(adversarial, { strategy: 'minimax', depth: 13 });
assert.equal(strategy.action.amount, 1, 'with 13 tokens, the winning move should remove one');

const constraint = {
  id: 'constraint-test',
  type: 'constraint',
  variables: [
    { id: 'a', domain: [1, 2] },
    { id: 'b', domain: [1, 2] }
  ],
  constraints: [
    { id: 'different', test: assignment => !('a' in assignment && 'b' in assignment) || assignment.a !== assignment.b }
  ]
};
const solved = agent.chooseAction(constraint, { strategy: 'constraint' });
assert.ok(solved.action);
assert.notEqual(solved.action.a, solved.action.b);

const evidence = agent.exportEvidence();
assert.ok(evidence.events.length >= 4);
assert.ok(evidence.events.every(event => event.formalGradeEligible === false));

console.log('All sovereign agent tests passed.');
