# Academic Batch 03 — original A1/A2 Core (draft, NOT LIVE)

**Date:** 2026-09-27. **Basis:** corrected `content/releases/curriculum-1.2.0-production-import.json` archived from the owner's v12 production export (29 lessons, 190 activities), not the obsolete unreconciled 1.2.0 candidate.

**User-accepted application baseline:** v15, deployed source `d327285b0d07aefece4585c0cb279ccd99a9e5cb`, with learner QA 6/6 for Writing position, draft-save confirmation/restoration and mobile layout. That application source remains unchanged by this source-only academic branch.

## Content deliverables

- `content/batches/batch03-grammar.json`: GRA-A1-07 can/can't (10), GRA-A2-02 past simple (10), GRA-A2-03 countability/quantifiers (10), GRA-A2-04 comparison (10).
- `content/batches/batch03-lexical-reading-writing.json`: VOC-A2-02 travel/event collocations (8), REA-A1-03 personal art-club message (8), WRI-A1-03 describe a school person/place (5, final response **review required**, word count never a score).
- `content/curriculum-1.3.0-candidate.json`: cumulative 36 lessons / 251 activities. **The prior 29 entire lesson objects are byte-semantically unchanged**; 21 legacy/8 second-batch reconciled lessons are not regenerated. Prior rubrics, seven-step journey and import contract are unchanged. New course sequence preserves the relative order of all 29 old IDs and inserts new prerequisite units in advisory order.
- `content/reviews/batch03-reading-evidence.json`: eight exact passage anchors, one per Reading answer.
- `content/reviews/batch03-independent-review-packet.json`: portable 61-item packet for second-pass English-language and pedagogy review, including passage and answer keys; status PENDING.
- `content/curriculum-coverage-1.3.0-candidate.json` and `content/lesson-groups-1.3.0-candidate.json`: proposed dependencies and bilingual navigation covering 36 IDs. Do not overwrite the deployed v12 coverage or v13–v15 catalog manifest by blindly copying these.
- `domain/academic.ts`: four new grammar tag mappings. This requires a **compatible app-code release before** the new import; otherwise the 1.3.0 importer may reject tags.

## Academic guardrails

1. **Source and answers:** Check exact grammar meaning, context, unique best MCQ option, accepted short-answer variants, all 60 objective explanations, all 61 skill-tag mappings, and eight explicit Reading evidence quotes. Structural QA cannot establish that every item is pedagogically unambiguous.
2. **Grade-6 independent learning:** Instructions say whether to choose or enter *only* a missing phrase; bilingual rules and worked examples should enable self-repair, without hiding a repeated subject in the answer.
3. **Writing:** Open response gets pending review, not an automatic score or CEFR certification. Review actual task coverage, content, organisation, grammar and vocabulary; give strengths and a learner-owned revision task. Keep source text/version and all attempts.
4. **Audio:** A1 Listening/Speaking/Pronunciation remain separate audio-dependent gaps. No simulated playback or text-only scoring is added here.
5. **CEFR:** A1/A2 tags describe lesson targets, not learner placement. No score from completion or word count.

## Second-pass review requirements (before any import)

Submit the review packet to an independent reviewer. Require a response per item ID: PASS / REVISE / BLOCK, with correction and rationale. Specifically audit some/any exceptions, past-simple base forms after did, can vs can't meaning, comparative/superlative scope and irregular forms, travel collocations and semantic alternatives, and the Reading passage's time/place/transport/conditions. Reconcile each criticism to the source (never auto-accept feedback), then run `node tests/content-batch03.cjs`, full academic and application suites, and production build. Update packet + candidate if a correction is accepted.

## Safe release sequence AFTER academic approval

A. Stage the compatible `domain/academic.ts` tag mapping and proposed catalog taxonomy in the **existing** v15 Site, run tests/controlled code deployment first. No learner-state migration.

B. Download the owner-approved reconciled cumulative 1.3.0 JSON. Parent View → Preview Import. **Only if production remains exactly 1.2.0 with 29 matching lessons, expected preview is Add 7 · Update 0 · Skip 29 · Conflict 0.** Treat this as a conditional source-derived expectation, not a live result. If any update/conflict appears, STOP, export live 1.2.0 and reconcile; do not confirm.

C. Owner confirms once. Verify export v1.3.0, 36 lessons and 251 activities, exact hash/content reconciliation. Confirm all old attempts, drafts, Writing review and listening safeguards remain intact.

D. Authenticated desktop/mobile learner QA: can requests, past-simple negative/question, some/any contextual examples, comparative exceptions, exact Reading evidence, Writing pending review, Previous Work, G Learning navigation and draft saving.

**This PR is academic authoring only.** Do not merge merely to publish the Site, deploy, import, reset D1, re-upload historical 1.2.0 candidate or alter existing learner records. For this release, PR green means structured/source tests passed, not independent academic approval.
