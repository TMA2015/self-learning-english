# Self-Learning English — Project Handoff — 2026-09-30 — Sites v29

## Current production baseline

- Existing private Site: same Site and URL.
- Sites version: **v29**
- Deployed Sites source: `d31f43d2e4383f218697705d96a6ab1334a90798`
- Deployment ID: `appgdep_6abd28e108448191a4ec593abe22efc5`
- GitHub implementation reference:
  - Draft PR #25
  - Branch: `fix/version-aware-current-practice-20260930`
  - Checkpoint: `f890d2322986b978bc5601ce7aec9e6b10f5c7c5`
- PR #25 remains unmerged.

## Curriculum baseline

- Curriculum version: **1.5.0**
- Lessons: **45**
- Activities: **359**
- 323 original activities preserved with IDs/order.
- Batch05 added 36 activities across 8 existing lessons.
- No new lesson IDs were added in 1.5.0.

Known Batch05 expanded lessons:
- GRA-A1-08: 10 -> 14
- GRA-A2-05: 10 -> 14
- GRA-A2-06: 10 -> 14
- VOC-A2-01: 5 -> 11
- VOC-A2-03: 8 -> 12
- REA-A2-01: 5 -> 11
- REA-A2-04: 8 -> 12
- WRI-A2-01: 3 -> 7

## Version-aware attempt UX hotfix

Problem discovered during owner QA:
- WRI-A2-01 historical work was bound to content 1.0.0 and therefore correctly showed only 3 activities.
- The old UI did not clearly provide a separate path to start the latest 1.5.0 lesson while preserving the historical attempt.

Implemented behavior in v29:
- Historical attempts remain bound to their stored content version.
- Historical Writing revisions keep their `parentId` chain and old content version.
- Old-version attempts disclose their stored version and the current curriculum version.
- Separate **Start current practice · v1.5.0** action creates a new root attempt on the current curriculum with no `parentId`.
- Attempt/revision history displays stored content versions.
- Same-version attempts retain the simpler existing UX.
- Existing started draft is saved before creation of a separate current root attempt.

No backend version-binding semantics were changed.

## Validation completed

- Five GitHub workflows: PASS.
- Previous 16 local test commands: PASS.
- TypeScript: PASS.
- Production build: PASS.
- Focused version-aware test: PASS again before deployment.
- Production smoke checks: Dashboard, 45-lesson Catalog, Writing and Parent View PASS.
- No application errors observed in captured logs; browser-extension errors were present and treated as unrelated.

## Data safety / release boundaries

The v29 release did NOT perform:
- curriculum import,
- D1 migration,
- D1 reset,
- historical attempt mutation,
- historical regrading,
- learner attempt creation by Work,
- authentication change,
- Site identity change.

Curriculum remains 1.5.0 and learner history remains version-bound.

## Owner QA status

Confirmed on the real authenticated learner account:
- Historical WRI-A2-01 opens as **content 1.0.0** with **3 activities**.
- Version notice appears.
- **Start current practice · v1.5.0** appears.
- Starting current practice creates a new root attempt on **content 1.5.0** with exactly **7 activities**.
- VOC-A2-01 shows **11 activities**.
- REA-A2-01 shows **11 activities**.

Observed UX behavior after creating/saving the new WRI-A2-01 root:
- The old 1.0.0 card no longer appears separately in **Recent work**.
- Code review confirms this is expected from `recentSkillWork()`, which intentionally calls `latestAttemptForLesson()` and shows only the latest attempt per lesson.
- No delete path is involved in the current-practice flow. The previous started draft is saved before the new root is created.
- All attempts for the lesson remain addressable through **Attempt & revision history**, which filters the full catalog attempt list by lesson ID and displays stored content versions.

Owner QA is now COMPLETE for the version-aware attempt flow.

Final owner confirmation:
- **Attempt & revision history** shows:
  - current root: content **1.5.0**
  - historical revision: content **1.0.0**
  - historical pending-review root: content **1.0.0**
- Opening the historical 1.0.0 record still shows the original **3 activities**.
- Historical records remain readable and version-bound.
- New current root remains separate on 1.5.0 with 7 activities.
- No evidence of historical learner-data loss.
- The disappearance of the old card from **Recent work** is expected because that panel shows only the latest attempt per lesson.

The v29 hotfix release gate is CLOSED/PASS.

Optional mobile/iPad spot-check remains useful but is not a blocker for closing this checkpoint.

No submission of the new Writing QA attempt is required.

## Recovery points

Code-only rollback:
- Sites v27 source: `0a84b8f889102192eed0f3f29958d8fea0d40fb4`

Rollback must preserve:
- Curriculum 1.5.0
- learner data
- historical attempts/results
- Writing data
- course selection

Do not roll back curriculum or learner records as part of a code rollback.

## Next planned step

The v29 owner QA gate is complete.

New official production baseline:
- **Sites v29**
- source `d31f43d2e4383f218697705d96a6ab1334a90798`
- **Curriculum 1.5.0**
- **45 lessons / 359 activities**
- version-aware historical/current attempt UX confirmed on the real learner account.

Next:
1. preserve this baseline and rollback reference;
2. proceed to **P2B Adaptive Learning / Suggested Practice v2** before further large content expansion;
3. defer Batch06 until P2B has established how learner evidence should drive targeted practice.

P2B target loop:
**Evidence -> detect weakness -> suggest targeted practice -> learner practices -> update mastery -> refresh recommendations.**


## P2B + Grammar parallel planning started

Architecture planning branch:
- `architecture/p2b-grammar-roadmap-20260930`

Planning artifacts created from the v29 implementation reference; no production mutation:
- `sites-p0-phase-a-20260926/content/grammar-roadmap-v1.json`
- `sites-p0-phase-a-20260926/content/adaptive-map-v1.json`
- `sites-p0-phase-a-20260926/docs/P2B_ADAPTIVE_GRAMMAR_PARALLEL_PLAN.md`

Current Grammar audit:
- 15 current Grammar lessons in Curriculum 1.5.0
- A1: 8, A2: 6, B1: 1
- approximately 158 Grammar activities
- working roadmap target: 40 Grammar lessons (A1 12 / A2 16 / B1 12), not a CEFR coverage percentage or quota

Important P2B architecture finding:
- P2A broad reporting maps multiple tense source tags (present simple, present continuous, past simple, present perfect) into `tense-and-aspect`.
- P2B must use a finer deterministic adaptive concept layer based on the existing granular source tags rather than changing or reinterpreting historical evidence.
- The new adaptive map preserves immutable versioned question identity and introduces concept-to-remediation/prerequisite metadata without changing the curriculum importer schema.

First proposed Grammar expansion wave after P2B metadata/code support is ready:
- GRA-A1-09 — This, that, these and those
- GRA-A1-10 — Object pronouns and possessive pronouns
- GRA-A1-11 — Imperatives and everyday instructions
- GRA-A1-12 — Prepositions of time: at, on and in
- GRA-A2-07 — Present continuous: form and use
- GRA-A2-09 — Present perfect: experiences with ever and never

Highest structural gaps are GRA-A2-07 and GRA-A2-09 because existing A2/B1 contrast lessons currently rely on those foundations without dedicated teaching units.

Next implementation gate:
- P2B-1 deterministic recommendation engine using the adaptive map, read-only and version-safe.
- No Grammar mass authoring/import until this mapping is proven usable.


## 2026-10-03 — P2B core + Suggested Practice staging

Production remains unchanged:
- Sites v29
- source `d31f43d2e4383f218697705d96a6ab1334a90798`
- Curriculum 1.5.0
- 45 lessons / 359 activities

### P2B-1 core

Draft PR #26:
- Branch: `feature/p2b-core-recommendations-20261003`
- Validated checkpoint: `b2744e7aa90065ebbe862d57ca48d61fc0b0a3a5`

Implemented:
- fine-grained Grammar concepts from existing granular source tags;
- exact package/version/question evidence identity;
- drafts/unassessed work excluded;
- states: not enough evidence / needs practice / developing / stable for now;
- prerequisite-first remediation only when the prerequisite itself has weak evidence;
- unobserved prerequisites are unknown, not failed;
- recommendations route only to lessons present in the current package;
- read-only projection; no regrading or learner-data write.

Validation:
- P2B Adaptive Core QA PASS.
- P2A regression PASS.
- TypeScript/build and academic/course/draft/Writing/content regressions PASS.

### P2B-2 learner UI

Draft PR #27, stacked on #26:
- Branch: `feature/p2b-suggested-practice-ui-20261003`
- Validated checkpoint: `d3341289fc855c3870341eb94660f26daaf1d1c3`

Implemented:
- explainable Grammar Suggested Practice cards;
- visibly distinguishes insufficient evidence from weak evidence;
- Foundation-first label for prerequisite remediation;
- suppresses broad legacy Grammar suggestions when they would conflict with conservative P2B;
- preserves non-Grammar legacy suggestions;
- direct **Practice this lesson** action;
- direct action opens CURRENT curriculum content only;
- current-version attempt may resume; historical navigation remains immutable/version-bound.

Validation at the checkpoint:
- P2B Suggested Practice UI QA PASS.
- Learning Evidence P2A QA PASS.
- Course v21 P1 QA PASS.
- UX v20 Lesson IDs and Navigation QA PASS.
- Focused Foundation player QA PASS.
- Writing navigation and draft feedback QA PASS.
- v16 Listening Submit Feedback QA PASS.
- v17 Listening Retake Audio Readiness QA PASS.
- G Learning English brand QA PASS.
- TypeScript and production build passed inside the P2B UI gate.

Release status:
- staging/code only;
- no Site deployment;
- no curriculum import;
- no D1 migration/reset;
- no learner-state mutation.

Next parallel step:
- begin Grammar Wave 1 academic authoring;
- prioritize the structural gaps GRA-A2-07 Present continuous foundation and GRA-A2-09 Present perfect foundation first;
- keep the wider six-lesson Wave 1 roadmap, but do not mass-author/import before independent academic review.
