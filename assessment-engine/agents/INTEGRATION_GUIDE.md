# Agent Integration Guide

## 1. Create the agent once

```js
import { SovereignProblemSolvingAgent }
  from '/assessment-engine/agents/core/sovereign-agent.js';

const agent = new SovereignProblemSolvingAgent({
  sourceApp: 'arcade.my-game',
  memoryKey: 'my_game_agent_memory_v1'
});
```

## 2. Supply an app-specific problem

A hybrid decision problem needs:

- stable `id` and `domainId`;
- candidate `actions` with stable IDs;
- optional hard constraints;
- weighted action features;
- a simulation function returning utility.

```js
const problem = {
  id: 'next-action-001',
  domainId: 'my-app.next-action',
  strategy: 'hybrid',
  context: { difficultyBand: 'medium' },
  weights: { progress: 1, safety: 0.9, engagement: 0.5 },
  actions: [
    {
      id: 'action-a',
      label: 'Action A',
      features: { progress: 0.8, safety: 1, engagement: 0.6 }
    }
  ],
  hardConstraints: [
    {
      id: 'legal-action',
      message: 'The action must be legal.',
      test: action => action.legal !== false
    }
  ],
  simulate(action, rng) {
    return action.features.progress + (rng() - 0.5) * 0.2;
  }
};
```

## 3. Choose and explain

```js
const decision = agent.chooseAction(problem, {
  strategy: 'hybrid',
  seed: 'reproducible-preview'
});

console.log(decision.action);
console.log(agent.explainDecision(decision));
```

## 4. Feed back the real outcome

```js
agent.receiveOutcome({
  decision,
  reward: 1,
  label: 'helpful'
});
```

Rewards are bounded from `-1` to `1`. The local memory changes gradually and is contextual rather than global.

## 5. Export evidence explicitly

```js
const evidence = agent.exportEvidence();
```

No network request is made by the agent core. A separate authorized adapter is required for synchronization.

## Arcade adapters

Do not move complete games into the Assessment Engine. Keep legal move generation, rendering, and game-specific evaluation in the Arcade. Wrap each game with a small adapter that exposes:

- current state;
- legal actions;
- selected action;
- explanation;
- outcome feedback;
- standardized evidence.
