# Khaemenes Academy — Universal Lesson Presentation Standard v1

Applies to Pre-K, Kindergarten, Elementary 01–05, Middle 06–08, High 09–12, and Higher Learning. The shared contract is **opt-in** and presentation-only. It is not a mandate to replace specialist educational layouts or learning engines.

## Canonical presentation
- Verve N Veda / Khaemenes Academy official two tickers where appropriate, one canonical full-bleed Academy header and enriched top-right hamburger; breadcrumbs **below**, never embedded in, the header.
- One canonical six-button ecosystem toolbar on ordinary learner pages; examination restrictions may suppress it intentionally. Do not create local Mentor, Beta, or profile duplicates.
- Centered footer with charcoal background and cream lettering.
- Cinzel for Academy, unit, and lesson headings. Branded body fonts with fallback, regular weights at or below 444. Unit/day secondary heading: centered 24–33px. Body and controls: at least 16px; Pre-K and Kindergarten at least 18px.
- Charcoal (#202724), cream (#fff8e9), parchment (#f4f0e7), gold (#b8995c), restrained forest accents; 7px corners, responsive fluid widths and generous vertical spacing.
- Interactive mathematical workspaces, readings, science experiments, writing surfaces, accessibility, printable packets, saved progress, quizzes, exam gates, mastery and student records remain under their existing subject owners.

## Adoption
1. Audit actual lesson markup, existing shared styles and all runtime DOM owners. Search for obsolete embedded typography, competing parchment overrides, native headers, legacy menus and floating Mentor/Beta buttons.
2. Add the shared stylesheet `https://vervenveda.com/assets/khaemenes-lesson-standard-v1.css` ahead of the subject-specific lesson stylesheet.
3. Add `data-ka-lesson-standard="v1"` to the lesson body and use `ka-lesson-*` classes or the documented `data-ka-*` attributes only for the intended elements.
4. Keep original learning engines and student-record scripts byte-for-byte unchanged unless a separate, explicitly scoped academic repair is necessary.
5. Verify one pilot lesson at desktop, tablet, and phone sizes, then check the console for script errors and DOM duplicates. Test print and protected assessment states separately before rollout.
6. Compare link navigation, lesson completion, persistence, workspace and mastery behavior before and after each batch. Retain regression evidence and a clear rollback commit.

## Rollout status
- Shared standard created and installed on two representative High School Grade 9 lessons: Science 9 Unit 00 Day 01 and Pre-Algebra Unit 01 Lesson 01.
- Additional courses, high-school grades 10–12, middle grades, elementary grades, preschool and kindergarten, and Higher Learning have **not** been migrated or live-certified by this initial contract commit.
- Adoption should proceed by grade-band pilots. Grade landing pages already using their own approved presentation remain untouched until separately audited.
- Avoid mass inserting scripts into examinations or proprietary/custom lesson canvases; their dedicated runtime owners must be inspected first.
