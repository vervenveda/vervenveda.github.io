# Verve N Veda Universal Assessment, Simulation, and Problem-Solving Engine

Central foundation release **v0.3.0** establishes a reusable assessment and reasoning service for Khaemenes Academy and every compatible Verve N Veda application.

## Permanent network location

```text
https://vervenveda.com/assessment-engine/
```

The complete `assessment-engine/` folder belongs at the root of the main `vervenveda.github.io` repository. The included `.nojekyll` file belongs at the repository root beside the main `index.html`.

## New in v0.3

- Central Verve N Veda breadcrumb routing.
- Canonical URLs for the engine and specialized applications.
- Sovereign Problem-Solving Agent v0.1.
- Constraint filtering and transparent backtracking.
- Weighted heuristic evaluation.
- Seeded Monte Carlo simulation.
- Generic minimax search with alpha-beta pruning.
- Local-only adaptive outcome memory.
- Human-readable explanations and evidence export.
- Agent registry and JSON schemas.
- Working learning-path, strategy-search, and scheduling demonstrations.

## Existing assessment capabilities

- Fixed and constrained-adaptive assessment delivery.
- Local autosave, resume, restart, and JSON export.
- Objective, exploratory, and human-review evidence records.
- Domain mastery and confidence summaries.
- Universal schemas for assessments, items, attempts, and learner profiles.
- Career assessment, Career Star, and mentor-review applications.

## Directory structure

```text
assessment-engine/
├── index.html
├── README.md
├── agents/
│   ├── agent-registry.json
│   ├── core/
│   ├── strategies/
│   ├── adapters/
│   ├── demos/
│   ├── schemas/
│   └── tests/
├── apps/
├── assets/
├── banks/
├── docs/
├── engine/
└── schemas/
```

## Agent demonstration

```text
https://vervenveda.com/assessment-engine/agents/demos/
```

## App integration

```js
import { SovereignProblemSolvingAgent }
  from '/assessment-engine/agents/core/sovereign-agent.js';

const agent = new SovereignProblemSolvingAgent({
  sourceApp: 'my-verve-program',
  learnerId: 'local-anonymous'
});
```

Apps should contribute specialized state, legal actions, evaluation features, simulations, constraints, and outcome feedback. The central agent supplies the reusable decision loop, memory, explanations, and evidence format.

## Non-negotiable safeguards

- Randomness may explore eligible outcomes; it never assigns an arbitrary grade.
- Formal assessments retain fixed blueprints and teacher authority.
- Agent evidence defaults to `formalGradeEligible: false`.
- Interests, preferences, and game results are temporary evidence—not permanent labels.
- Local adaptive memory contains bounded action values, not names or private writing.
- Learners can export and reset local evidence and memory.
- No agent receives authority to send messages, publish content, make purchases, or modify repositories without a separate explicit user action.

## Typography and presentation

- Centered page structure and controls.
- Black typography.
- Cinzel title stack.
- Brandon Grotesque preferred body stack with safe fallbacks.
- Light parchment, white, black, and gold presentation.
