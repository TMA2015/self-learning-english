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


## 2026-10-03 — Grammar Wave 1A ready for NotebookLM review

Draft PR #28:
- Branch: `academic/grammar-wave1a-a2-foundations-20261003`
- Structural-review checkpoint: `d8c542367a53c368b91825a87bb5a1aa8265de16`

Scope:
- `GRA-A2-07` — Present continuous: form and use
- `GRA-A2-09` — Present perfect: experiences with ever and never
- 2 lessons / 20 activities
- review-only fragment, deliberately not an importable curriculum package

Files:
- `sites-p0-phase-a-20260926/content/grammar-wave1a-a2-foundations-draft.json`
- `sites-p0-phase-a-20260926/docs/GRAMMAR_WAVE1A_NOTEBOOKLM_REVIEW.md`
- `sites-p0-phase-a-20260926/tests/grammar-wave1a-authoring.cjs`

Technical gate:
- initial run correctly caught three prompts that did not explicitly state the answer format;
- corrected items: GRA-A2-07-Q7, GRA-A2-09-Q6, GRA-A2-09-Q8;
- Grammar Wave 1A Authoring QA: PASS;
- existing academic/content regressions in the same gate: PASS.

Next mandatory gate:
- independent NotebookLM academic review of all 20 items with per-item PASS / REVISE / BLOCK;
- reconcile any corrections before assembling any cumulative curriculum candidate;
- no import/deploy authorization yet.


## NotebookLM handoff packaging rule — owner workflow preference

For future NotebookLM review rounds:
- when the temporary review batch has only a few source files, provide direct download links in chat instead of a ZIP;
- when the review batch has many source files, package the temporary review sources into one ZIP for the owner to upload;
- when the NotebookLM prompt is short, provide it directly in the chat for copy/paste;
- use a separate prompt/instruction file only when the prompt is long or needs durable structured detail;
- continue separating permanent baseline Notebook sources from temporary per-batch review sources.


## 2026-10-03 — Grammar Wave 1A independent review reconciliation

NotebookLM audit result:
- 20/20 activities reviewed.
- Overall verdict: REVISIONS_REQUIRED.
- 18 PASS / 2 REVISION_REQUIRED / 0 BLOCK.
- Revision items: GRA-A2-07-Q2 and GRA-A2-09-Q7, both for missing contracted variants.

Reconciliation decision:
- Do not add bare contracted fragments after a printed subject, because literal insertion would yield invalid spacing such as `We 're...` or `He 's...`.
- Instead move the subject into the missing phrase and accept both full and contracted forms:
  - GRA-A2-07-Q2: `we are studying`, `we're studying`, `we’re studying`
  - GRA-A2-09-Q7: `he has never eaten`, `he's never eaten`, `he’s never eaten`
- Feedback text updated accordingly.
- NotebookLM TXT mirror refreshed.
- Regression assertions added to lock these variants.

GitHub:
- Academic branch: `academic/grammar-wave1a-a2-foundations-20261003`
- Reconciled code/test checkpoint: `68403275611a58ffe0594ad0cb00d22229bdfa81`
- Grammar Wave 1A Authoring QA: PASS.
- Existing academic/content regressions in the same gate: PASS.
- Draft PR #28 remains review-only and unmerged.

Next mandatory academic gate:
- targeted NotebookLM recheck of only GRA-A2-07-Q2 and GRA-A2-09-Q7;
- if both PASS, close Wave 1A academic review and proceed to cumulative candidate assembly planning;
- no import/deploy authorization yet.


## 2026-10-03 — Grammar Wave 1A academic review CLOSED / PASS

Independent NotebookLM audit:
- 20/20 activities reviewed.
- Initial result: 18 PASS / 2 REVISION_REQUIRED / 0 BLOCK.
- Revision items: GRA-A2-07-Q2 and GRA-A2-09-Q7.

Reconciliation:
- both prompts were changed so the subject is inside the blank;
- accepted full and contracted forms are now literal-gap safe.

Targeted NotebookLM recheck:
- GRA-A2-07-Q2: PASS
- GRA-A2-09-Q7: PASS
- WAVE1A_FINAL_VERDICT: PASS

Final academic record:
- `sites-p0-phase-a-20260926/docs/GRAMMAR_WAVE1A_FINAL_ACADEMIC_REVIEW.md`
- academic branch commit: `ca08fb149b256d3d4de6104eaeca25d5dce88732`

Status:
- Grammar Wave 1A is academically approved.
- It is eligible for cumulative immutable curriculum candidate assembly.
- No curriculum import, Site deployment, D1 change or learner-data mutation is authorized yet.

Next:
- assemble a cumulative candidate from production Curriculum 1.5.0 + approved GRA-A2-07 + GRA-A2-09;
- validate exact lesson/activity counts, stable IDs, course ordering, answer keys, adaptive-map compatibility and versioning;
- run authenticated Preview before requesting import approval.


## Curriculum 1.6.0 candidate checkpoint — 2026-10-03

Draft PR #29 on `release/curriculum-1.6.0-wave1a-20261003` now contains a validated cumulative candidate built from the verified 1.5.0 production package plus approved GRA-A2-07 and GRA-A2-09. Candidate: 47 lessons / 379 activities. Existing 45 lessons / 359 activities are preserved. Expected production Preview: Add 2 / Update 0 / Skip 45 / Conflict 0. Candidate raw SHA-256 `10d171f1c703e3be13085b0f3eee4ebc76494fb69a620a65508d1b5de3a20aff`; canonical SHA-256 `1d89087e01b742936a0ed9dad73c647365df4370b86ffd1b1812bac66866a10b`. Automated candidate gate, regressions, TypeScript and production build PASS. Production remains on Sites v29 / Curriculum 1.5.0. Next gate is authenticated Preview only; stop before import.


## 2026-10-03 — Curriculum 1.6.0 authenticated Preview PASS

Production verified before Preview: Sites v29, Curriculum 1.5.0, 45 lessons / 359 activities. Candidate raw and canonical hashes both MATCH the approved 1.6.0 candidate. Authenticated Parent View Preview result: Add 2 / Update 0 / Skip 45 / Conflict 0. Add rows exactly GRA-A2-07 and GRA-A2-09. Course order verified: GRA-A2-07 immediately before GRA-A2-01; GRA-A2-09 immediately after GRA-A2-02. No deletions, unexpected updates, ID conflicts, schema warnings, D1 migration/reset, learner-data operation, historical regrading, Site deployment or import occurred. Confirmation remained unchecked and Import disabled. Production remains unchanged. Next gate requires separate owner authorization for a controlled Curriculum 1.6.0 import.


## 2026-10-03 — Project priority reset: content-first Grammar program

Owner clarified the near-term goal: this is a private family/friends learning tool first, not a public product. Current learner data is considered test data and must not slow content development. Preserve the good version-aware architecture, but do not over-optimize for historical test-data retention during the content-build phase.

Primary milestone before treating the app as a real learning program: Grammar must become a coherent curriculum rather than scattered exercises. Use the existing roadmap target of about 40 Grammar lessons (A1 12 / A2 16 / B1 12) as the working minimum-complete Grammar program. Prefer larger authoring waves (roughly 8–12 lessons each), review them in smaller NotebookLM packets, and release/import only after a substantial wave is complete rather than after every 2 lessons. Content depth and coherent progression now take priority over frequent production imports.


## 2026-10-03 — MASTER GOAL RESET / durable project direction

### Near-term purpose of Self-Learning English

The project is first and foremost a practical English-learning tool for the owner's daughter, family members and close friends. It is NOT currently being optimized as a public product, commercial service, or large-scale multi-user platform.

The immediate success criterion is not user count, public reach, or preservation of prototype learner records. The immediate success criterion is that the Site contains enough coherent, well-sequenced learning content that a learner can actually follow it as a program rather than encounter scattered exercises.

### Content-first priority

For the current development phase, CONTENT DEPTH and LEARNING PATH COHERENCE take priority over production-like release conservatism.

The first major curriculum milestone is Grammar:
- turn the existing scattered Grammar coverage into a coherent A1 -> A2 -> B1 learning path;
- use the existing working roadmap of about 40 Grammar lessons (A1 12 / A2 16 / B1 12) as the current planning target, not a rigid quota or CEFR-completeness claim;
- each lesson should function as a real self-study unit with explanation/examples, guided practice, independent practice and transfer/review rather than only a few isolated questions;
- the Grammar program should be substantial enough that the owner can reasonably regard it as a minimum viable learning program.

Only after the Grammar core is sufficiently complete should Reading/Writing/Listening/Speaking expansion and broader platform concerns become equally important.

### Development-mode learner data policy

Current learner records/attempts are test data. They are not yet valuable production learner history and must not slow curriculum construction.

Keep the good version-aware architecture and safe-import concepts because they will matter later, but during this CONTENT BUILD phase:
- prototype/test learner data may be reset or migrated when technically justified;
- do not spend disproportionate effort preserving every historical test attempt;
- do not let test-data preservation block schema, importer, curriculum or UX improvements;
- switch to strict real-learner data preservation only when the owner explicitly declares that the curriculum is mature enough for real ongoing study.

### Release cadence

Do not repeat a full production release workflow for every 1-2 lessons.

Preferred pattern:
- author larger waves, roughly 8-12 lessons at a time (or another sensible substantial batch);
- split academic review into smaller NotebookLM packets, typically 3-4 lessons per packet;
- reconcile each packet independently;
- assemble and import only after a meaningful content wave is complete;
- use production Preview/import less frequently, for substantial curriculum milestones.

The completed two-lesson Grammar Wave 1A (GRA-A2-07 and GRA-A2-09) is treated as a PILOT that validated the authoring/review/import pipeline, not the intended ongoing batch size.

### NotebookLM durable workflow

Notebook English uses exactly 7 permanent sources:
1. 00_NOTEBOOK_ENGLISH_PERMANENT_v1.md
2. 01_ENGLISH_MASTER_PLAN_v1.md
3. 01_CONTENT_AUTHORING_STANDARD.md
4. 02_CURRICULUM_COVERAGE.md
5. 03_P2B_ADAPTIVE_GRAMMAR_PARALLEL_PLAN.md
6. 04_GRAMMAR_ROADMAP_v1.txt
7. 05_ADAPTIVE_MAP_v1.txt

Temporary review sources are replaced for each review round.
NotebookLM does not accept JSON source uploads in the current UI, so JSON source-of-truth files must be mirrored losslessly to TXT/MD for review.
Few review files -> direct links. Many -> one ZIP. Short prompt -> chat. Long structured rubric -> MD source. Long audit output may be exported as an artifact file.

### Current release state

Production remains:
- Sites v29
- Curriculum 1.5.0
- 45 lessons / 359 activities

Curriculum 1.6.0 candidate exists but is NOT imported:
- 47 lessons / 379 activities
- adds GRA-A2-07 and GRA-A2-09
- academic review PASS
- automated release gate PASS
- authenticated Preview PASS
- Preview result: Add 2 / Update 0 / Skip 45 / Conflict 0
- production remains unchanged

Do NOT import 1.6.0 merely because it is ready. Keep it as a validated checkpoint while building a larger Grammar wave unless the owner explicitly changes direction.

### Importer/scaling policy

The current 60-lesson importer ceiling and ~1 MB cumulative-package guardrails are application-level limits written by this project, not GitHub limits and not established ChatGPT Sites platform limits.

Before substantial Grammar expansion reaches those limits:
- raise/test the importer capacity deliberately;
- stress-test preview, validation, hashing, storage, catalog loading and historical-version handling;
- longer term, consider a manifest/module/batch architecture instead of one ever-growing cumulative JSON package.

This scaling work is secondary to the main goal: produce enough coherent learning content for the Site to be genuinely useful.

### Next recommended milestone

Do not import the two-lesson 1.6.0 candidate yet.

Next work should be:
1. define the next substantial Grammar build wave from the existing roadmap;
2. author roughly 8-12 lessons with adequate practice depth;
3. review them through multiple small NotebookLM packets;
4. reconcile and validate;
5. in parallel or before the next large release, raise the importer capacity safely;
6. assemble one larger cumulative curriculum release and Preview/import once.

The project should be judged first by whether the learner can open Grammar and follow a meaningful learning path from foundations upward.


## 2026-10-03 — Grammar Wave 1B authored: 12 lessons / 120 activities

Content-first expansion is active in Draft PR #30, branch `academic/grammar-wave1b-a1-a2-completion-20261003`, head `a39f4415ff2474d54c9c1bcd15a7e102519b1cd1`.

Wave 1B is fully authored before independent academic review:
- Packet A / A1 completion: GRA-A1-09, A1-10, A1-11, A1-12 — 40 activities.
- Packet B / A2 core: GRA-A2-08, A2-10, A2-11, A2-12 — 40 activities.
- Packet C / A2 completion: GRA-A2-13, A2-14, A2-15, A2-16 — 40 activities.

Total: 12 lessons / 120 activities. Combined with approved Wave 1A, the planned next cumulative milestone would have 29 Grammar lessons: A1 12/12 roadmap, A2 16/16 roadmap, B1 1/12. If assembled from still-live production 1.5.0 after review, whole curriculum would be 59 lessons / about 499 activities, still inside the current 60-lesson guardrail.

Grammar Wave 1B Authoring QA PASS on the latest head: packet structure, exact counts, unique IDs, MCQ keys, short-answer literal-gap guard, planned tags, existing academic/content regressions, TypeScript and production build all PASS. One malformed conditional key and two short feedback strings were caught by the first QA attempt and corrected; distractor quality was also tightened before final PASS.

NotebookLM review strategy: one packet at a time, 40 activities + 4 lesson explanations/examples per round. Seven permanent Notebook sources remain unchanged. Temporary sources for each round are the selected packet TXT mirror plus `GRAMMAR_WAVE1B_NOTEBOOKLM_REVIEW.md`. No production import or cumulative candidate assembly until all three packets independently PASS.


## 2026-10-03 — Grammar Wave 1B Packet A CLOSED / PASS

NotebookLM independently reviewed all 40 Packet A activities and all 4 lesson explanations/examples. Initial result: 39 PASS / 1 REVISE / 0 BLOCK. The only revision was GRA-A1-11-Q6, where the reviewer required the smart-apostrophe variant `don’t` in addition to `don't` and `do not`. The exact prescribed correction was applied with no semantic or learning-objective change. Reviewer explicitly stated that this patch yields full PASS, so no redundant second NotebookLM round was required.

Packet A approved lessons:
- GRA-A1-09 — This, that, these and those
- GRA-A1-10 — Object pronouns and possessive pronouns
- GRA-A1-11 — Imperatives and everyday instructions
- GRA-A1-12 — Prepositions of time: at, on and in

Final Packet A review record: `sites-p0-phase-a-20260926/docs/GRAMMAR_WAVE1B_PACKET_A_FINAL_REVIEW.md` on PR #30 branch. Latest PR #30 head: `bc0a6c5cc6ea61cb693793997070591456561a82`. Grammar Wave 1B Authoring QA on the latest head PASS: packet structure, existing academic/content regressions, TypeScript and production build all PASS.

Next gate: independent NotebookLM review of Packet B (GRA-A2-08, A2-10, A2-11, A2-12), 40 activities. Production remains unchanged and no cumulative candidate should be assembled until Packets B and C also PASS.


## 2026-10-03 — Grammar Wave 1B Packet B CLOSED / PASS

NotebookLM independently reviewed all 40 Packet B activities and all 4 lesson explanations/examples. Initial result: 37 PASS / 3 REVISE / 0 BLOCK. Revision items: GRA-A2-08-Q9, GRA-A2-10-Q6 and GRA-A2-12-Q6. All three issues were identical mechanical accepted-answer compatibility gaps: missing U+2019 smart-apostrophe variants for correct negative contractions. Exact reviewer-prescribed variants were added; no learning objective, semantic content, answer key, prerequisite, source tag or lesson order changed.

Packet B approved lessons:
- GRA-A2-08 — Past continuous and interrupted actions
- GRA-A2-10 — Present perfect: just, already and yet
- GRA-A2-11 — Choosing future forms: will, going to and present continuous
- GRA-A2-12 — Advice with should and shouldn't

Final Packet B review record: `sites-p0-phase-a-20260926/docs/GRAMMAR_WAVE1B_PACKET_B_FINAL_REVIEW.md`. Latest PR #30 head: `b984db84d9e14a596aa391f6f9601137cc0255b1`. Grammar Wave 1B Authoring QA on the latest head PASS: packet structure, existing academic/content regressions, TypeScript and production build all PASS.

Next gate: independent NotebookLM review of Packet C (GRA-A2-13, A2-14, A2-15, A2-16), 40 activities. Production remains unchanged and no cumulative candidate should be assembled until Packet C also PASS.


## 2026-10-03 — Grammar Wave 1B COMPLETE / all three packets PASS

Packet C independent NotebookLM audit: 40/40 activities PASS, 4/4 lesson explanations/examples reviewed, 0 REVISE, 0 BLOCK. Approved Packet C lessons: GRA-A2-13, GRA-A2-14, GRA-A2-15, GRA-A2-16.

Wave 1B consolidated academic status:
- Packet A: PASS after exact accepted-answer typography reconciliation
- Packet B: PASS after exact accepted-answer typography reconciliation
- Packet C: PASS directly
- Total: 12 lessons / 120 activities academically approved

Together with previously approved Wave 1A (GRA-A2-07 and GRA-A2-09), 14 new Grammar lessons / 140 activities are now approved-not-imported. Grammar roadmap/adaptive metadata was updated accordingly on PR #30.

A substantial Curriculum 1.6.0 release candidate is now being assembled on Draft PR #31, branch `release/curriculum-1.6.0-grammar-a1a2-20261003`, from the still-live production Curriculum 1.5.0 baseline. Target candidate: 59 total lessons / 499 total activities / 29 Grammar lessons (A1 12, A2 16, B1 1). Expected future authenticated Preview: Add 14 / Update 0 / Skip 45 / Conflict 0. Production remains unchanged until an explicit later import approval.


## 2026-10-03 — Curriculum 1.6.0 Grammar A1/A2 milestone candidate VALIDATED

Draft PR #31: `release/curriculum-1.6.0-grammar-a1a2-20261003`, final validated head `16c504e27588f6bd6d375c1ad803e0773d6e1c89`.

Candidate: Curriculum 1.6.0 / 59 lessons / 499 activities / 29 Grammar lessons. Adds 14 academically approved Grammar lessons / 140 activities to the verified production Curriculum 1.5.0 base. Grammar milestone after import would be A1 12 lessons, A2 16 lessons, B1 1 lesson. Existing 45 lessons / 359 activities are preserved.

Candidate hashes locked and CI-verified:
- raw SHA-256: `555ea690f51066ae47365bcb25cafd9c7aa4fa4b126be70db0a6847120787d48`
- canonical SHA-256: `2227598673d682ec9fe6b8f4b64b403343d2c491edd3f7381695304572965cb5`
- size: 544500 bytes

Final release gate PASS: deterministic compose, importer/content validation, exact production-base digest, preservation checks, approved new tag compatibility, academic/content regressions, version-aware attempt regressions, P2A/P1 regressions, TypeScript and production build.

Expected future authenticated Preview: Add 14 / Update 0 / Skip 45 / Conflict 0.

Important: production Site v29 still lacks the newly approved fine-grained Grammar source tags. Therefore the next gate is a controlled CODE-ONLY content-compatibility deployment that extends tagMap while keeping Curriculum 1.5.0 / 45 / 359 unchanged. Only after that deployment should Work run authenticated Preview of the exact PR #31 candidate. Stop before Import.

The earlier Draft PR #29 two-lesson 1.6.0 pilot candidate has been marked superseded and closed to prevent accidental import.


## 2026-10-03 — PR #31 compatibility guard corrected / ALL CI GREEN

Work correctly stopped because the old Batch04 compatibility test expected exactly 47 runtime tag mappings. That count guard was outdated after the academically approved Grammar A1/A2 expansion added 13 new mappings.

Fix applied on PR #31 without weakening protection:
- all 44 frozen historical mappings are still checked for exact tag -> slug equality;
- all original 3 Batch04 additions are still checked exactly;
- all 13 approved Grammar A1/A2 additions are checked exactly;
- the obsolete fixed-count check was replaced by a closed-world exact-key-set assertion, so any unreviewed addition/removal still fails;
- importer validation exercises every reviewed additive mapping;
- an unknown/unreviewed tag is still explicitly rejected.

New approved checkpoint: `281fcedbb9d059282187ac5dce5f133d3885c6e0`.

At this exact checkpoint both required workflows PASS:
- Curriculum 1.3 / Batch04 Compatibility QA — PASS
- Curriculum 1.6.0 Grammar A1/A2 Milestone QA — PASS
Both production-build steps PASS.

No Site deployment, Curriculum import, D1 migration/reset or learner-data operation occurred. Production remains Sites v29 / Curriculum 1.5.0 / 45 lessons / 359 activities.

Use this new checkpoint, not `16c504e27588f6bd6d375c1ad803e0773d6e1c89`, for the next controlled Work run: code-only compatibility deployment first, then authenticated Preview only, then STOP before Import.


## 2026-10-03 — Sites v30 compatibility deployment PASS / Curriculum 1.6.0 authenticated Preview PASS

Code-only compatibility deployment completed successfully to the same private Site:
- Sites v30
- source `03f642124e3d84ee584649430e4ba4c446f6b07b`
- reconciled from approved GitHub checkpoint `281fcedbb9d059282187ac5dce5f133d3885c6e0`
- both required CI workflows, 11 local regression suites, TypeScript and production build PASS

Production curriculum remained unchanged after code deployment:
- Curriculum 1.5.0
- 45 lessons / 359 activities
- exact production digest unchanged

Authenticated Preview of the exact Curriculum 1.6.0 Grammar A1/A2 milestone candidate PASS:
- raw SHA-256 MATCH
- canonical SHA-256 MATCH
- Add 14 / Update 0 / Skip 45 / Conflict 0
- exact Add IDs: GRA-A1-09, GRA-A1-10, GRA-A1-11, GRA-A1-12, GRA-A2-07, GRA-A2-08, GRA-A2-09, GRA-A2-10, GRA-A2-11, GRA-A2-12, GRA-A2-13, GRA-A2-14, GRA-A2-15, GRA-A2-16
- both required Grammar learning sequences MATCH
- all existing 45 lesson objects and 359 activities preserved
- no deletions, unexpected updates, conflicts or schema warnings

No curriculum import, D1 reset/migration, learner-data edit or PR merge occurred. Import confirmation remained unchecked.

Code-only rollback remains available at Sites v29 source `d31f43d2e4383f218697705d96a6ab1334a90798`.

Next gate: separate owner-authorized controlled Curriculum 1.6.0 import. After import require production to report 1.6.0 / 59 lessons / 499 activities and verify the 14 new Grammar lessons are available. Then perform owner QA; do not merge PR #31 merely because import succeeds.


## 2026-10-03 — Curriculum 1.6.0 IMPORT PASS / one academic QA hotfix required

Controlled import completed successfully on Sites v30 source `03f642124e3d84ee584649430e4ba4c446f6b07b`.

Production is now:
- Curriculum 1.6.0
- 59 lessons / 499 activities
- Grammar: A1 12 / A2 16 / B1 1 = 29 lessons
- live exported package exactly matches the approved candidate
- import result Add 14 / Update 0 / Skip 45 / Conflict 0
- all 14 new Grammar IDs visible
- both requested Grammar sequences verified
- all prior 45 lessons / 359 activities preserved

Representative browser QA:
- GRA-A1-09: 10/10 PASS
- GRA-A1-12: 10/10 PASS
- GRA-A2-08: 10/10 PASS
- GRA-A2-16: 9/10; one academic grading defect found

Defect: GRA-A2-16-Q5, prompt `The coach ___ works with our team is from Da Nang.`, accepts only `who`. In a defining relative clause referring to a person, `that` is also grammatically valid. The lesson explanation also overstates the simplified rule by saying who for people and which/that for things.

No content was silently changed and no historical result was regraded. No D1 reset/migration occurred. PR #31 remains unmerged.

Hotfix strategy: keep imported 1.6.0 immutable; create Curriculum 1.6.1 candidate changing only GRA-A2-16. Draft PR #32: `hotfix/curriculum-1.6.1-relative-that-20261003`. Proposed correction: teach who or that for people in defining clauses, update Q5 accepted answers to [who, that], and clarify feedback/explanation. Require targeted academic review plus Preview before import.


## 2026-10-03 — Curriculum 1.6.1 relative-clause hotfix candidate prepared

Draft PR #32: `hotfix/curriculum-1.6.1-relative-that-20261003`. Production remains Curriculum 1.6.0 / 59 / 499 on Sites v30.

Hotfix candidate 1.6.1 changes exactly one lesson: GRA-A2-16. It corrects the lesson objective/explanation to state that defining clauses about people may use who or that, adds a person + that example, and changes GRA-A2-16-Q5 accepted answers from [who] to [who, that]. No other activity changes.

Technical gate PASS. Expected Preview from live 1.6.0: Add 0 / Update 1 / Skip 58 / Conflict 0. Candidate raw SHA-256 `0767455e886a819c3f42b3b9e6bb1dec8222345ea8559192cb0dee1d66ddc7ef`; canonical SHA-256 `2760b5395d9a9ca822f27bd06f36a6bcde790996467cdaa8a82044b683650339`.

Next gate: targeted independent NotebookLM review using `GRAMMAR_1601_RELATIVE_THAT_HOTFIX.txt`. Do not Preview/import the hotfix until that targeted academic review is PASS.


## 2026-10-03 — Academic review proportionality rule

Owner clarified that the academic-review process must not become mechanical overhead. NotebookLM is NOT required for every tiny correction.

Use NotebookLM when a change involves meaningful academic judgment, ambiguity, new lesson/content authoring, answer-key uncertainty, level/sequence decisions, broad explanation changes, or possible knock-on effects across multiple items.

A small hotfix may be handled directly without NotebookLM when ALL are true:
- the issue is narrow and objectively identifiable;
- the correction is supported by an authoritative reference or an already-established project rule;
- the correction does not materially change the construct, lesson objective, dependency, CEFR scope or broader pedagogy;
- the change can be tightly bounded to one/few fields or accepted-answer variants;
- targeted automated validation/regression can prove no unrelated content changed.

Examples that normally do NOT require a new NotebookLM round:
- adding an equivalent smart-apostrophe input variant;
- correcting a typo/punctuation/spacing issue;
- adding a clearly valid accepted-answer variant already confirmed by an authoritative grammar source;
- repairing an obviously stale test guard without changing runtime semantics.

For such hotfixes, document the source/reason, apply the minimal change, run targeted regression/Preview, and proceed without unnecessary external academic review. Escalate to NotebookLM whenever there is real ambiguity or pedagogical judgment.
