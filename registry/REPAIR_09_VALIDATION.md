# Repair 09 Validation

Date: 2026-08-09

## Live-source basis inspected

- Central Mentor normalized resource registry.
- Khaemenes Preschool Mentor manifest.
- Khaemenes Kinder Garden Mentor manifest.
- Khaemenes Elementary Mentor manifest and Grade 1–5 weekly assessment indexes.
- Khaemenes Middle Mentor manifest and Grade 6 Mathematics subject hall.
- Khaemenes High Biology 10, Chemistry 11, and Physics & Engineering 12 course maps.
- Arcade Mentor manifest.
- ProReSources Mentor manifest.
- Khaemenes Linguistics / Polyglot Mentor manifest.
- Aurora Mentor manifest.
- ARSHIF Mentor manifest.
- Solanar provisional root manifest.
- River-to-Road provisional root manifest.
- Medicament High School Health ownership established by Repair #8.

## Structural assertions

PASS:
- generated ecosystem registry is not overwritten;
- taxonomy objective IDs are unique;
- every curated override references valid taxonomy objective IDs;
- alignment types are restricted to core/direct-practice/support/transfer-practice/exploration;
- preference-gated resources keep preference metadata;
- support and transfer-practice resources cannot become mastery evidence via the mapper;
- audience/stage blockers are enforced;
- `recommendable=false` and `mentorEligible=false` are blockers;
- linked-learner requirements are blockers when unmet;
- high-stakes medical metadata is preserved;
- freshness-check metadata is surfaced;
- child-resource gaps are explicitly reported rather than guessed.

## Regression tests

- Equivalent Fractions lesson → Fraction Picnic leads.
- Sudoku does not count as fraction mastery evidence.
- High-school research writing → PROSE is available as support.
- Faith-specific ARSHIF resource is excluded without matching preference.
- Lesson-context examples produce expected objective IDs.

Run locally if desired:

`node validate-objective-map.mjs`
