# Self-Learning English — Academic development checkpoint

**Date:** 2026-11-02  
**Branch:** `content/self-learning-academic-development` ONLY.  
**Project:** Self-Learning English GitHub + Firebase website; NOT the separate ChatGPT English Tutor.  
**Current baseline:** curriculum v1.18.0, 109 lessons/913 activities, source immutable.  
**Run outcome:** real content authoring + source-based QA completed; no release branch writes, GitHub Actions, Firebase deployment, billing, Math changes, learner-data mutation or offline claims.

## Stage 6 — existing content improvement

**Scope examined:** `REA-A1-02`, `REA-A1-03`, `REA-A1-04`, including actual reading passages, 24 existing questions, source keys, explanations, worked examples and feedback.

**Finding:** Current worked examples expose exact assessed details (times, rooms, materials, deadlines), enabling answer copying. This is a source-level pedagogical risk, not a proven browser failure.

**Completed authoring:** Replacement English/Vietnamese explanations and **independent mini-text worked demonstrations** for all three lessons, plus optional collapsed hints and post-submission error repair. All existing QIDs/keys/reading assets are preserved in the proposal.

**One NotebookLM review source:** [SLE_S6_REA_A1_02_04_SELF_STUDY_REVIEW_20261102.md](../../content/review-packets/SLE_S6_REA_A1_02_04_SELF_STUDY_REVIEW_20261102.md)  
**Status:** `ACADEMIC_REVIEW_PENDING`; no approved/imported changes.  
**Progress:** 3/109 existing lessons now have source-inspected, authored Stage 6 improvement proposals; 106 are not yet processed in this Stage 6 pass. This does not mean the remaining lessons are defective. Earlier Stage 3 work is separately tracked.

## Stage 7 — new integrated thematic content

**Theme:** `P01 School & Everyday Communication`, 15 proposed units, Pre-A1–A2 (part of the wider Pre-A1–C2 roadmap).

**New original authoring source:** [P01_SCHOOL_COMMUNICATION_AUTHORING_UNITS_R1_20261102.json](../../content/drafts/P01_SCHOOL_COMMUNICATION_AUTHORING_UNITS_R1_20261102.json) — 7 full four-stage lesson units, `U01/U02/U05/U07/U08/U10/U12`, with objectives, prerequisites, optional Vietnamese support, distinct worked models, 34 draft items, answer keys, rationale, hints and remediation. This is a **draft authoring schema**, not an importer-ready package.

**Earlier P01 draft repaired:** [P01_SCHOOL_EVERYDAY_COMMUNICATION_WORKING_DRAFT_20261101.md](../../content/review-packets/P01_SCHOOL_EVERYDAY_COMMUNICATION_WORKING_DRAFT_20261101.md). `U03` Q6 ambiguous after-deadline inference replaced by an explicit fee detail; `U04` Q2 syntax, Q4 two-word answer format, Q5 options repaired. Both remain `CONTENT_DRAFT`.

**One NotebookLM source for first cohesive sub-pack:** [SLE_P01_A_PREA1_A1_NOTEBOOKLM_REVIEW_20261102.md](../../content/review-packets/SLE_P01_A_PREA1_A1_NOTEBOOKLM_REVIEW_20261102.md). It contains U01–U07 in order: six newly authored units plus U06 reuse of existing `LIS-A1-01`, with answer-key tables clearly reviewer-only. **Status:** `ACADEMIC_REVIEW_PENDING`. No review or deployment occurred.

**P01 authoring coverage:** 9/15 units newly authored in draft (U01–U05, U07, U08, U10, U12), 1/15 reuses existing LIS-A1-01 (U06), and 5/15 remain to be authored (U09, U11, U13, U14, U15). This is authoring progress, not release readiness.

## QA results and limitations

| Test | Result | Evidence/limit |
| --- | --- | --- |
| Source lesson inspection | PASS | Three real reading passages, 24 original QIDs/keys and examples checked |
| Stage 6 proposal answer-key preservation | PASS in authoring | No original question objects edited; every original key resolves to an option |
| Stage 6 literal leakage screen | PASS (limited) | New model blocks do not contain full existing correct-option texts >8 chars; semantic leakage needs NotebookLM |
| Stage 7 authoring schema completeness | PASS | 7 JSON units have goals, teaching strategy, worked model, practice, hint, feedback |
| Stage 7 draft item integrity | PASS | 34 unique draft IDs, 30 objective candidates with mapped keys/accepted strings, 4 unassessed free responses |
| Speaking Prep oral evidence | PASS in draft | All 4 U07 tasks oral proficiency weight 0; no recorded audio/CEFR claims |
| U03/U04 editorial repairs | PASS in source text | Ambiguous inference and answer-format errors corrected |
| Academic NotebookLM verdicts | NOT RUN | Two standalone packets queued; no automatic PASS |
| Full cumulative curriculum schema/importer | NOT RUN | Markdown/authoring JSON only, not approved production schema |
| Browser/iPad QA, real audio, historical attempt restore | NOT RUN | Must be performed in separate release/owner QA |
| GitHub Actions, Firebase deploy, Math modifications | NOT RUN by design | No release authorization; production unchanged |

## Academic review queue — no owner upload requested yet

1. `SLE-S6-REA-A1-02-04-R1`: three existing Reading lesson improvements; `ACADEMIC_REVIEW_PENDING`. Priority because existing worked examples reveal quiz answers.
2. `SLE-P01-A-PREA1-A1-ACADEMIC-R1-20261102`: first large integrated School & Everyday Communication sub-pack; `ACADEMIC_REVIEW_PENDING`.

For each review: keep the permanent NotebookLM English sources, replace only the previous temporary review source with **one Markdown packet**, ask for independent-study sufficiency, exact item/answer issues, required vs optional fixes and separate academic/production verdicts. **Do not** send multiple intermediate files or ZIPs to the owner. Review packets can accumulate while authoring continues.

## Next content cycle — no wait for Stage 5

- **Stage 6:** inspect and upgrade the next connected group `VOC-A1-03`, `WRI-A1-02` and `LIS-A1-02` where appropriate. Pay attention to model-answer leakage in Writing and the genuine-audio gate in Listening. Do not change legacy keys or infer browser behavior from source alone.
- **Stage 7:** continue P01-B with `U09` audio script/manifest **unassessed until real MP3**, `U11` existing Grammar reuse, `U13` Speaking Preparation weight 0, `U14` integrated reading/writing, `U15` retrieval review. Then assemble **one** coherent P01-B NotebookLM packet and proceed to P02 theme if P01-A review is still pending.
- Preserve v1.18.0 historical records and the distinct English release-staging branch. Human/parent Stage 5 QA is ongoing and may report issues at any time; it is not a block on content authoring.
