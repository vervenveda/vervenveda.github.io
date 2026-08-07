# Khaemenes Mentor Core

Shared mentor infrastructure for Khaemenes Academy and the wider Verve N Veda ecosystem.

Version: 0.1.0-foundation  
Status: Foundation / integration-ready  
Home: `/assessment-engine/mentor/`

## Purpose

The Mentor Core provides a common architecture for:

- a persistent child/student mentor that can mature with the learner;
- optional child-created mentor avatars while retaining a controlled communication style;
- a protected parent-facing relationship with the child's same mentor;
- a separate mature Family Guide for parents/guardians;
- structured learner context and progress summaries;
- age-, role-, and safety-aware resource recommendation;
- automatic acknowledgement of new public repositories in approved ecosystem accounts;
- automatic incorporation of resources published through `mentor-manifest.json`;
- a centralized respectful-use and safety boundary;
- adapters for Preschool through Higher Learning.

The Mentor Core is not an accredited school, healthcare provider, therapist, emergency service, guardian, or substitute for responsible adult supervision.

## Architecture

```text
mentor/
├── core/          learner, family, identity, avatar, permissions, mentor engine
├── family/        child mentor, parent mentor, bridge, progress view
├── registry/      sources, resources, ranking, resolution
├── discovery/     GitHub repository discovery and indexing
├── safety/        age policy, respectful use, release validation, escalation
├── adapters/      developmental / school-stage policies
├── schemas/       JSON contracts
├── docs/          integration and manifest guidance
├── examples/      sample repository manifest
└── tests/         Node tests
```

## Automatic repository discovery

Approved account families are configured in:

`discovery/accounts.json`

Initial accounts:

- `vervenveda`
- `JenniferPearl2028`
- `artist1970`

Every public repository discovered under those accounts is acknowledged in the generated repository registry.

**Discovery is automatic. Trust and audience eligibility are deliberate.**

A new public repository can therefore be known to the Mentor ecosystem without immediately becoming a student recommendation.

### Repository states

- `discovered` — public repository is known.
- `manifested` — a valid `mentor-manifest.json` was found.
- `recommendable` — policy and audience rules permit recommendation.
- `campaign` — political/campaign material; separated from ordinary educational recommendations.
- `admin-only` — infrastructure; never surfaced to students or parents.
- `unclassified` — known but not yet approved for recommendations.
- `archived` — retained for lineage but not recommended.

## Resource incorporation

Repositories should add a root-level:

`mentor-manifest.json`

The index builder automatically reads valid manifests and adds their resources to:

`registry/ecosystem-resources.json`

This allows new games, courses, tools, archives, wellness resources, civic tools, and research utilities to enter the Mentor search layer without modifying Mentor code.

See `docs/RESOURCE_MANIFEST_GUIDE.md`.

## Resource resolution order

1. Current lesson
2. Current course
3. Current school
4. Khaemenes Academy resources
5. Approved Verve N Veda ecosystem resources
6. Approved research/search resources

All candidates pass role, age/stage, audience, safety, classification, and availability filters before ranking.

## Family model

```text
                 FAMILY CONTEXT
                       │
          ┌────────────┴────────────┐
          │                         │
    STUDENT MENTOR             FAMILY GUIDE
    age appropriate             adult-facing
          │                         │
          └──────── approved ───────┘
                structured context
```

The parent-facing view of the child's mentor uses structured learning records. Private child feelings are not automatically exposed as psychological interpretations.

## Custom avatars

A learner may use:

- Pip
- Miri
- Nova
- Sage
- a custom visual/name avatar

A custom avatar changes presentation and identity, but a controlled mentor style remains underneath for safety and predictable behavior.

## Safety

The Mentor Core is bounded by:

- age/stage policy;
- role permissions;
- resource policy;
- guardian-release requirements where applicable;
- respectful-use policy;
- interaction guard;
- escalation controller.

Preschool and young learners receive gentle, non-punitive redirection. Developmentally typical experimentation is not treated as adult misconduct.

## Public repository discovery workflow

A GitHub Actions workflow is included at:

`.github/workflows/mentor-resource-index.yml`

It runs the index builder and commits registry changes when public repositories or manifests change. Generated output is deterministic enough to remain unchanged when the public ecosystem has not changed, preventing timestamp-only commits or workflow loops.

## Integration principle

School repositories remain independent. They import the Mentor Core and provide an adapter and resource manifest. The central engine owns shared contracts, not each school's page layout.

## Attribution

Khaemenes Academy / Verve N Veda  
Jennifer Kay Pearl
