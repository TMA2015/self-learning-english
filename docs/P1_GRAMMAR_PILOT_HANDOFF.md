# P1 Grammar A2 content pilot — release handoff

**State:** Candidate authored and source-level checked, NOT imported or deployed. Live Site remains version 8 with Foundation content `1.0.0`. Keep the learner's paused Diagnostic draft untouched.

## Files
- Candidate import JSON: `content/packages/ai_english_tutor_academic_seed_v1_0_2_grammar_pilot.json` (72,411 bytes).
- Repeatable source QA: `node scripts/check_foundation_grammar_pilot.mjs`.
- Editorial draft: `docs/PILOT_GRA_A2_01_SELF_STUDY.md`.
- Previous `1.0.1` candidate remains unimported; `1.0.2` includes its three short-answer corrections.

## Content delta and validated scope
- Same `package_id`, 13 lesson IDs, seven skill domains and seven-step demo path.
- Version `1.0.0` → `1.0.2` is immutable; no in-place edit of old package or attempts.
- `GRA-A2-01` changes from 6 to 10 tasks: additional mixed-tense contrast, continuous question order, simple negative form and plural-subject negative; clearer explanation, worked examples, meaningful distractors and expanded answer-specific explanations.
- `GRA-B1-01` only receives two corrected accepted-answer lists; `GRA-A2-01-Q5` also keeps the earlier correction.
- Other eleven lesson objects are unchanged.
- Total activities: 59 (46 MCQ, 8 short-answer, 5 open response).
- Source-level schema/type, ID uniqueness, valid answer choice, question count, tag, weight, and version/isolation checks passed. This is **not** an actual Sites importer or learner browser test.
- Existing importer permits exactly 13 lesson IDs and at most 10 activities per lesson; the pilot fits this boundary. A new data model is not required for this content-only iteration.

## Import dry-run expectations (with only v1.0.0 currently present)
Open Parent View → Foundation content importer (admin account); select the candidate JSON, preview first. Expected:
- Add: 0
- Update: 2 (GRA-A2-01, GRA-B1-01)
- Skip: 11
- Conflict: 0
- Version: 1.0.2

If any counts, IDs, digest or conflicts differ, STOP without importing and inspect the actual package state. Check that a current `1.0.1` import is not already installed; the above expected counts assume v1.0.0 is the latest.

After explicit admin confirmation, import content only; do not run migrations, overwrite lesson attempts or change source/build version. Then verify the published lesson view loads v1.0.2, has ten questions and both negative/question forms. Start **a new attempt** to test the new version; old revisions remain pinned to their original package version. Confirm the old `1.0.0` Writing pending-review record and paused Diagnostic are still accessible.

## Do not call the pilot a finished teaching UI
The existing frontend renders a paragraph of explanation and a list of examples; it displays answer explanations after submission. It does not yet provide per-question pre-answer hints, distractor-specific selection feedback or automatic targeted follow-up. Those require an independently reviewed player/content schema change.

## Learner acceptance
One learner trial should check that the instruction for each gap expects only the missing phrase, that corrections explain the underlying error and the extra items measure routine/now/temporary meaning, negative/questions and agreement. Review questions against the source before generalising this structure to other lessons. Preserve the user's choice to complete Diagnostic later rather than restarting it just for QA.
