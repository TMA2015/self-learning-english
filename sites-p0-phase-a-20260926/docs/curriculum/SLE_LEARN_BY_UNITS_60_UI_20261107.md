# SLE Learn by Units — 60 Unit learner UI (implementation pilot)

**Date:** 2026-11-07  
**Status:** Draft feature PR / no production release until exact-head QA and owner browser acceptance.

## Objective
The owner approved the responsive 60-Unit interface prototype v2. The existing seven independent skills must continue working. Units are a **new read-only navigation/index layer** on top of exactly the same authored Lesson IDs and saved attempts; they are not a second course copy, a separate scoring system, a new release or a claim that all 60 Units are academically finished.

## Delivered in this branch
- A new left menu **Learn by Units** with a dedicated explorer and 6 CEFR tabs (A1 to C2), 10 Unit cards per level, Unit details and per-lesson buttons.
- Source of exact 60 Unit ID/title pairs: approved \`SLE_MASTER_CURRICULUM_FRAMEWORK_v1.0.md\`, extracted into \`content/sle-unit-catalog-v1.json\`; no invented Unit IDs or titles.
- Source of primary Lesson ID assignments: existing \`content/sle-unit-navigation-map-v1.json\` (109 baseline plus 12 conditional assignments).
- Source of available lessons, titles and minutes: only the **actual current browser catalog**, not an unreachable candidate file. If a lesson is unavailable/not yet imported, do not show it as ready for learning.
- Source of saved work: the **same** original Foundation \`AcademicAttempt[]\`; statuses computed via existing \`lessonProgressForLesson\` and \`latestAttemptForLesson\`. An old draft or prior grade opens in the **same Foundation player** with all existing version pinning, Save/Resume/Submit, audio and answer-key protections.
- No alternate attempt ID, Unit-specific score, fake mastery badge, duplicate lesson content or new learner key.
- Units without available content show Planned / No lessons mapped. Integrated U10 checkpoints are **not** graded or marked complete unless reviewed transfer tasks exist.
- Existing independent 7-skill library and 12-week Writing remain available. The sidebar is regrouped into Today; Learn; Skill Library; Assessments & Exam Prep; Progress & Review; Settings & Family; no existing screen was removed. IELTS/TOEFL remains explicitly *planned*, not a live exam offering.
- Responsive desktop/mobile visual style follows approved HTML concept v2; no live CSS changes to the Grammar teaching blocks in this PR (separate Draft #113).

## Actual curriculum evidence
v1.20.0: 123 lessons, of which 121 map to primary Unit and 2 (\`REA-C1-01\`, \`VOC-C2-01\`) await academically approved primary placement. Across 60 Unit definitions, 29 currently have at least one mapped lesson. These figures are navigational coverage, **not** proof of completion or teaching quality.

## QA + release gates
- \`tests/unit-guide-60.cjs\` verifies 60 exact IDs (10/level), 123/121 mapping, 29 populated Unit IDs, A2-U03's three correct Lesson IDs, absence of invented C1/C2 assignments, canonical lesson references, preserved menu links and original player callback, responsive CSS.
- Existing full \`qa-free-first\` and Next static build required. Real desktop / iPhone Safari visual acceptance is not implied by CI.
- **Do not merge/deploy automatically**. Verify authenticated (where applicable) browser: navigate Unit -> existing versioned attempt -> Save draft -> back to same Unit -> Resume -> Submit -> Skill Library -> same result -> back; check blocked save, Listening audio and historical version. No reset, no V2/V3 migration, no clearing browser storage.
- This is programme UI structure only. Academic review for Unit outcome completeness and new integrated transfer tasks is separate, following SLE-MASTER-001. The 60 visible Units are **not** 60 finished teaching Units.
