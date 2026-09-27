# English Tutor — real curriculum, Batch 01 (2026-09-27)

**State:** Authored in GitHub feature branch, schema/source checks passed; NOT yet built, deployed or imported on the private Site. Current production is Site v9 with academic content v1.0.2. Owner has accepted that existing demo learner records are disposable, but no reset is needed for this release.

## Scope: first genuinely usable learning units

- New, independently authored units: `GRA-A1-01` be; `GRA-A1-02` pronouns/possessives; `GRA-A1-03` simple routines; `VOC-A1-01` school words; `VOC-A1-02` daily phrases; `REA-A1-01` art club notice; `REA-A2-02` class book exchange; `WRI-A1-01` task analysis, plan and self-introduction.
- New learning tasks: 67 (3×10 Grammar; 2×8 Vocabulary; 2×8 Reading; 5 Writing including one unscored extended response).
- Cumulative `content/curriculum-1.1.0-candidate.json`: 21 lessons, 126 tasks, 7 domains; original 13 units from `1.0.2` unchanged.
- Grammar has meaningful examples and targeted explanations; Reading uses original passages with evidence-based questions; Writing includes prompt analysis, brainstorming/model, planning and self-check. These are **first production units**, not yet a complete A1–B1 curriculum.
- Levels A1/A2/B1 represent **content targets**, not a certified estimate of a learner. Diagnostic may stay paused; no invented A1 placement or IELTS band.

## Technical changes / limitation removed

- The old imported-content validator was locked to exactly 13 known lesson IDs and A2/B1. New validator accepts 13–60 total lessons, existing 13 preserved in the cumulative package, A1–B2 IDs, maximum 24 activities per lesson and properly validated new rubric IDs. Unknown learner-state fields remain rejected.
- The `course.sequence` now represents a complete ordered 21-lesson path and `Next step` follows it. The seven-domain starter route is a subset and still contains some A2 audio/speech samples.
- UI labels refer to learning path and actual lesson count instead of “13 sample lessons / Foundation Demo”. Catalog is held in the parent component across skill-tab remounts: the first load still needs the network, but switching tabs after that should avoid repeated “Loading your course”. Cache invalidates after a successful admin content import.
- Existing Grammar A2 two-step hint pilot is enabled for content v1.1.0 as its questions are unchanged; hints in new A1 lessons are **not yet** implemented.
- Content import accepts at most 1 MB in the browser; API caps requests at 1.2 MB. This is a bounded cumulative-package step, not a finished long-term modular package service. Split into modules before this ceiling matters.

**Reusable lesson standard:** Read `docs/CONTENT_AUTHORING_STANDARD.md` before producing further batches. Run `node tests/content-quality.cjs` to catch missing examples, duplicate choices, accepted-answer formatting and missing review contracts. New lessons must meet the standard; older seed gaps are documented rather than silently declared complete.

## Required Work checks (from nested source root)

```sh
node tests/content-quality.cjs
node tests/foundation-coaching.cjs
node tests/run.cjs
node tests/academic.cjs
node tests/curriculum.cjs
npm run build
```

The existing Work environment's authenticated managed preview/portable-loopback browser QA is unavailable. Do not weaken production authentication or repeat known-unavailable preview experiments. Record tests and build separately, preserve rollback v9 and disclose owner live QA pending.

## Two-step release: code then content

1. Using the exact GitHub feature checkpoint, deploy code-only to the next Sites version after all checks succeed. **No D1 migration, reset or import during code deployment.** Existing v1.0.2 remains readable in the generalized code.
2. In actual signed-in Parent View, owner selects `content/curriculum-1.1.0-candidate.json`, clicks Preview and checks the following counts **assuming production still has v1.0.2 as the latest content**: Add 8 / Update 0 / Skip 13 / Conflict 0. If different, STOP and compare live exported v1.0.2 and candidate. Confirm once, then export v1.1.0 to verify all 21 lessons.
3. Owner opens Course Catalog and checks 21 lessons, Grammar A1 be/new attempt, Vocabulary A1, Reading A1 passage, Writing A1 pending review, and A2 Grammar hints under version 1.1.0. Switch tabs to test perceived loading; reload a disposable completed attempt.
4. Preserve standard private login and live production D1. If code regression, rollback **code only** to v9; do not auto-downgrade imported content or restore D1. For an import-only content issue, publish a corrected immutable 1.1.1 package rather than rewriting a stored version.

**Important rollback sequencing:** Before importer confirmation, rollback code v9 is safe with current content v1.0.2. Once content v1.1.0 has been imported, the old v9 importer/player may reject or mishandle expanded content; use a compatible corrective code release, or keep a code rollback checkpoint that also supports the 1.1.0 schema. Do not automatically roll back to v9 after content import without checking compatibility.

## Acceptance and next actual content batch

First release acceptance requires new A1 lesson navigation, all 67 new tasks' deterministic answer review, original passage display, pending-review Writing and laptop/mobile usability. Independently review educational accuracy; static checks do not certify it.

Next authoring batch: A1 articles/plurals, there is/are, common prepositions; A1/A2 school/home texts; Writing A1 message and A2 descriptive paragraph with explicit question analysis. Add real Listening tracks and adult-reviewed Speaking practice after text-first skills, without guessing speech level from notes.
