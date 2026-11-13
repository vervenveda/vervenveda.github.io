# Khaemenes Academy — Codex Blueprint for Future Courses (v1.0)

> **Academy principle:** **“Make the learning challenging, not the navigation.”**
>
> Create academically rich, challenging and enjoyable experiences. Reduce visual and navigation complexity, **never** curricular depth.

**Scope:** All future Academy course and lesson creation: Pre-K, Kindergarten, Elementary 1–5, Middle 6–8, High School 9–12 and Higher Learning. Apply this blueprint to new work by default; migrate existing courses in separately certified, reversible batches. The canonical visual contract is `https://vervenveda.com/assets/khaemenes-lesson-standard-v1.css` and its companion `assets/KHAEMENES-LESSON-STANDARD-v1.md` in the VNV gateway repository.

## 1. Codex operating instructions

1. **Inspect before modifying:** Read the target repository's existing `AGENTS.md`, course map, data banks, shared scripts, lesson engine, student-work store and canonical chrome owners. Trace dependencies and identify conflicts. Work on `main` only where that repository's approved workflow requires it.
2. **Preserve educational and student-state integrity:** Never delete questions, worked examples, labs, vocabulary, enrichment, reading, printable responses, learner identity, assessment records, or progress while reorganizing. Preserve 80% mastery gates and retry rules. Never clear or auto-migrate local student records without an explicit, documented and tested owner-aware migration.
3. **Reuse one visual contract:** Avoid inventing a second header, menu, ticker, toolbar, lesson evidence form, popup or footer. Link to the canonical shared asset once, *then* provide a scoped subject-specific stylesheet. Do not apply unscoped `h1`, `button`, `body` or `!important` overrides that break other surfaces.
4. **Design for the student:** Use age-appropriate language, progressive disclosure for optional details only, and a predictable one-column reading path. Core instructional content, safety warnings, required assessment instructions and student work must remain available, never hidden behind decorative accordions.
5. **Audit what you changed:** Verify desktop, tablet, phone, keyboard, contrast, print, theme, real learner saves, failure states, menu/toolbars and mastery. Source inspections are *not* browser certification. Record precise commit and rollback boundaries.

## 2. Universal four-stage instructional journey

Every lesson should present its actual content in the following conceptual stages. Adapt the *labels* to the subject and age rather than forcing one vocabulary on all students.

| Stage | Learner purpose | Typical contents |
|---|---|---|
| **01 — Prepare** | Know the destination and get ready | Objectives, time/materials, safety, prerequisite check, essential question |
| **02 — Learn & Practice** | Build understanding with meaningful guided practice | Full lesson explanation, worked models, examples, exploration, interactive activities, response workspace |
| **03 — Deepen Understanding** | Explain and transfer ideas | Challenging applied problems, investigations, evidence, misconceptions, vocabulary, synthesis, enrichment |
| **04 — Reflect & Finish** | Make learning visible and know what comes next | Retrieval, formative reflection, portfolio handoff, lesson evidence, save status, next-lesson navigation |

- Render a compact **four-stop lesson roadmap** near the top, with working anchors to all four stages. Offer stage navigation without causing page reloads or bypassing assessment.
- Keep **every original section** and its order when upgrading a pre-existing lesson; insert stage landmarks at natural boundaries. Never silently shorten a lesson to fit four stages.
- Use **one main instructional column** with comfortable reading width. Group related content into consistent cards and separate stages using understated gold dividers rather than competing banners.
- Place each response area immediately after its prompt and make **Save response** visually unambiguous. Evidence forms should follow a single-column **explain → review → readiness → save** sequence.
- Reserve a single primary action per immediate task; mentor help, print and optional enrichment are secondary.
- Challenging word problems must contain clear context, numerical or conceptual constraints, reasoning steps, relevant assumptions and an explanation opportunity, not simply a superficial numerical substitution.

## 3. Canonical visual specifications

- Full-width charcoal `#202724` header, cream `#fff8e9` lettering and K badge; canonical top-right **icon-only** enriched hamburger. Official 333 Network ticker and AutoPopulate ticker where appropriate. **Breadcrumbs are a separate centered row immediately below the header**, not inside it.
- One official lower-right ecosystem toolbar on student-facing surfaces. Never inject the toolbar *inside* a chat dialog, popup or examination mode where its host intentionally excludes it.
- Parchment `#f4f0e7` background; ivory paper `#fffdf8` cards; charcoal text `#27302d`; khaki-gold `#b8995c` borders and restrained deep-forest hover. Consistent **7px radius**.
- Cinzel headings and Brandon Grotesque/Nunito body fallbacks; no weights above **444**. Center Academy heading and unit/day label (responsive **24–33px**), followed by a legible main title. Body/controls **at least 16px**; Pre-K and Kindergarten **at least 18px**.
- Charcoal primary buttons with clearly readable cream text *and* `-webkit-text-fill-color` where conflicting legacy themes require it. Ensure hover, focus and disabled states remain legible. No unlabeled icon buttons.
- Center footer with charcoal background and cream text; maintain quiet spacing, symmetry, responsive tables and writing fields, and properly legible print output.

## 4. Source structure for new courses

Prefer a clear course entry page, separate lesson data banks, subject-owned academic engine, and reusable presentation assets.

```text
courses/<subject>/<course>/
  index.html                    # course roadmap and lesson navigation
  course-map.json               # course structure, objectives, prerequisites and sequence
  units/unit-01/
    index.html                  # unit overview and mastery requirements
    lessons/lesson-01.html
    lessons/lesson-02.html
    assets/unit-lesson.css      # scoped visual specialization
  assets/course-engine.js       # course-specific assessment/progress owner
  tests/course-contract.test.cjs
```

Adapt actual file layout to repository conventions; do not move working routes simply to achieve this suggested tree. For lesson pages, opt in using `data-ka-lesson-standard="v1"`, load the canonical shared CSS before the course-specific CSS, and use existing `ka-lesson-*` hooks or scoped `data-ka-*` attributes. Use stable IDs for roadmap destinations and persistent work prompts.

## 5. Data retention and learner protections

- Writing responses must be **editable, keyboard-operable, printable and persistently saved**. Require the official selected learner identity before claiming a response is permanently attached to a student; indicate **unsaved**, **saved on this device**, and **save failed** honestly.
- Use learner-scoped keys with course + lesson + prompt identity. Never copy work between learners. Prefer the Academy learner ledger or an authorized storage adapter; offline local drafts must be clearly distinguished from synchronized records.
- Save failures must not erase student typing. Avoid silently treating `localStorage` as durable cloud backup.
- **Formative** evidence cannot change grades, mastery, placement, protected assessment scores or course unlocking.
- Do not remove legitimate readiness gates to make visual testing easier. Test gates with fixtures or controlled local test data, not forged student progress.

## 6. Accessibility and cognitive-load checks

- One clear page title, meaningful nested headings and logical DOM order; roadmap landmarks are keyboard reachable and do not duplicate the page's h1.
- Group labels with inputs, do not rely on placeholder-only instruction, support screen readers and visible focus, respect `prefers-reduced-motion`.
- Keep the task and its controls together. Use simple language without removing scientific, mathematical or literary precision.
- On small screens, stack multi-column task forms vertically; never squeeze answer options or allow text to wrap below inaccessible controls.
- Keep mandatory safety and mastery notices readable and explicit. Put verbose explanatory policies in details only if the essential instruction stays visible.

## 7. New-course Codex acceptance gate

A course is **not certified** merely because markup, CSS and scripts are present.

- **Source check:** no duplicate header/toolbar/ticker/menu; breadcrumb placement; one style owner; correct links and counts; original instructional text/questions and lesson data still present.
- **Behavior check:** course route, lesson roadmap anchors, activity controls, practice scoring, retries, 80% mastery, blocked/unblocked flows and navigation.
- **Data check:** learner A/B isolation, reload restore, failed-storage handling, formative-vs-graded separation, parent/teacher access where specified, no state resets or cross-grade leakage.
- **Visual check:** desktop/tablet/mobile at normal zoom, light/dark, button contrast, long text, input readability, print, keyboard and dialog focus.
- **Evidence:** log test result and owner, exact main commit, rollback SHA, screenshots or browser assertions, outstanding blockers. Label untested requirements **pending**, never PASS.

## 8. Example Codex task prompt

> Create or upgrade `<course and lesson paths>` according to **Khaemenes Academy Codex Blueprint v1.0**. Start with a dependency and content-preservation inventory. Retain the complete curriculum, all student interactions, 80% mastery and learner records. Organize the lesson into Prepare, Learn & Practice, Deepen Understanding, Reflect & Finish, with a four-stop roadmap and no hidden required content. Apply the canonical charcoal/parchment/cream presentation, tickers/header/hamburger, breadcrumbs directly below header, one toolbar and centered footer. Keep changes scoped, test at three responsive widths and keyboard/print modes, verify learner-scoped saves, and report commits plus explicit certification gaps. Work in the approved repository on `main`; do not touch unrelated pages.

## 9. Reference pilot

**Grade 9 Integrated Science — Unit 00 Days 01–05** is the visual organization pilot: five lessons, nine original sections each, four stage landmarks, editable writing workspaces and the shared end-of-lesson evidence form. This is a **reference pattern**, not evidence that all its runtime or student-record protections have been fully certified. Its current legacy completion key is a documented learner-isolation issue requiring a separately approved migration.

Future courses should inherit the **principle and contract**, then prove their own academic/runtime behavior.
