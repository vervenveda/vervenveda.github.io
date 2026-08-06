# Verve Sovereign Problem-Solving Agent

Version 0.1.0 establishes a reusable, dependency-free reasoning agent for the central Verve N Veda Assessment Engine.

## Capabilities

- Required-action constraint filtering
- Weighted heuristic evaluation
- Seeded Monte Carlo outcome simulation
- Generic minimax search with alpha-beta pruning
- Transparent backtracking constraint solver
- Bounded, local-only outcome memory
- Human-readable decision explanations
- Standardized assessment evidence events

## Public entry point

```js
import { SovereignProblemSolvingAgent }
  from '/assessment-engine/agents/core/sovereign-agent.js';

const agent = new SovereignProblemSolvingAgent({
  sourceApp: 'my-program',
  learnerId: 'local-anonymous'
});
```

## Core decision loop

```text
Observe → Constrain → Evaluate → Simulate/Search → Select → Explain → Learn → Report
```

## Privacy position

The default implementation stores only bounded action-value memory in the browser. It does not require names, email addresses, free-form writing, or centralized learner records. Evidence is exported only through an explicit user action or a future authorized adapter.

## Formal assessment safeguard

Agent events set `formalGradeEligible` to `false`. The agent may guide, simulate, rank, or provide evidence, but it does not independently assign high-stakes grades.

## Demonstration

Open:

```text
/assessment-engine/agents/demos/
```

The demonstration includes:

1. Hybrid adaptive learning-path recommendation
2. Minimax strategy search
3. Constraint-based study scheduling
4. Local outcome feedback and evidence export

## Arcade integration

Existing Arcade games keep their specialized legal-move and evaluation logic. An adapter should expose state, legal actions, decisions, explanations, outcomes, and evidence without moving the complete game into the Assessment Engine.
