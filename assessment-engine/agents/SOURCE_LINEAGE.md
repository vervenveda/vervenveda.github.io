# Source Lineage and Reimplementation Notes

The Sovereign Problem-Solving Agent is a clean modular implementation informed by capabilities already present across repositories owned by Jennifer Kay Pearl and the Verve N Veda ecosystem.

## Capability lineage

- **Affix Six:** lightweight heuristic look-ahead, controlled exploration, persistent pattern weighting, outcome feedback.
- **Chess Studio:** minimax, alpha-beta pruning, legal action search, move ordering, persistent action bias.
- **Checkers Variant Lab:** configurable rule systems, position hashing, learned state values, variable learning rate.
- **SixBySix:** Monte Carlo rollouts, decision traces, persistent simulation memory.
- **Sudoku:** constraint validation, randomized backtracking, unique-solution checks, hints and solving.
- **Orion’s Connect Four:** adversarial search combined with adaptive academic problem generation and progression.
- **Backgammon:** multi-feature evaluation and outcome-adjusted feature weights.
- **AuroraCore:** deterministic seeded randomness, bounded transformations, modular explainable language processing.
- **Creative Spark:** local procedural generation and guided creative inputs.
- **HTURT:** registry, federation, ethics, data-policy, and governance concepts.

## Implementation position

This package does not copy whole game implementations. It extracts the recurring reasoning patterns into neutral, reusable modules so each original application can remain independent and connect through an adapter.
