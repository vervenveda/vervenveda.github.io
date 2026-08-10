# Repair 10 Validation

Date: 2026-08-09

## Design assertions

PASS:
- Matrix is read-only.
- Existing generated registries are inputs, not overwritten outputs.
- Standard audit and Deep audit are distinct.
- Deep orphan scan excludes lessons, assessments, records, units, and teacher-tools from app-level orphan detection.
- Provisional/partial repositories downgrade orphan candidates to informational findings.
- Duplicate source authorities are errors.
- Nested delegated manifests are explicitly allowed.
- Active competing nested manifests are surfaced.
- Recommendable broken routes are errors.
- Current source-manifest SHA is compared with the registered SHA.
- Repair #9 taxonomy/override/anchor/stage/example references are validated.
- Weak alignment types cannot be mastery evidence.
- Browser report can be downloaded as JSON.
- Node CLI can emit `matrix-report.json` and returns non-zero exit status on Matrix errors.

## Local deterministic regression test

`fixtures/validate-matrix.mjs` validates:
- unmanifested repository detection;
- valid objective overlay;
- orphan app entrypoint detection;
- active nested authority detection;
- safe delegated nested manifest recognition.

Internet-dependent manifest/route/tree checks are intentionally not faked by the local fixture suite.
