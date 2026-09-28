# G Learning — Academic & Evidence Audit (v21 discovery)
Date: 2026-09-28. **READ-ONLY / design only. Not an app release, content import, or learner-model migration.**

## Authoritative boundaries
- Existing private Site v20 Sites source reported: `7ffc690ba63461322eff7d259b483531c224e053`; GitHub PR #18 reference checkpoint `6da694b5223581e0bc81784defd16b714c58560f` is not the Sites deploy commit. Work must reconcile later code changes onto actual deployed source.
- Accepted frozen live-export artifact `foundation-1.4.0.json`; version `1.4.0`; canonical SHA-256 `70eb0d13477a647ae2ab0ca5b11bfd1f52a99772f1ca206d701718d08ffb56da`.
- Source export contains 45 lessons, 323 activities: 230 `single_choice`, 82 `short_answer`, 11 `extended_response`. Levels by target: A1 20 lessons, A2 19, B1 6. Modules: Grammar 15/146 activities, Vocabulary 8/58, Reading 9/66, Writing 8/36, Listening 2/10, Speaking 2/4, Pronunciation 1/3.
- This is a partially authored instructional catalog, **not** a calibrated complete CEFR course or a claim about any learner's level. The prior `content/curriculum-coverage-v1.json` describes the historical 1.2.0 planning stage and must not be reported as 1.4.0 coverage.

## Source-grounded findings (not live learner-profile diagnosis)

| ID | Observation and evidence | Required design/test response |
|---|---|---|
| E01 | `application/academic-service.ts` creates an objective `Evidence` event per mapped skill tag, with actual score, question ID, attempt-derived event ID and immutable `contentVersion`, but **without calibrated `level`**. `domain/learning-model.ts:inference` filters out records without a level and requires broad diagnostic subskill coverage before displaying CEFR. Therefore `insufficient evidence` on Dashboard after Foundation practice is not, by itself, a lost-data bug. | Keep CEFR assessment separate from practice progress. Show *practice-based per-tag accuracy and attempts* without inventing learner CEFR or silently adding difficulty levels to old events. |
| E02 | `deriveLearner` deduplicates `exercise` by `activityId:questionId:tag`. Foundation events use `activityId=foundation:<lessonId>` and a source question ID, so **retakes of the same question collapse to the last observation in the derived learner-model summary**. Raw repository events retain attempt-specific IDs. | Two explicit metrics: (a) all-attempt answer accuracy (e.g. 90/100) and (b) latest/independent question coverage. Keep immutable raw history and dedup semantics documented. Never claim 90 distinct questions when one was repeated. |
| E03 | The source tag map has many detailed Grammar categories; 12 mappings (including question-formation, future-plans, modals-obligation) are not entries in the diagnostic `content/skills.json` Grammar core set. Additional per-tag summaries are dynamically possible; diagnostic `coverage` only refers to its core set. | Define two separate registries/crosswalks: detailed instructional tags and narrower diagnostic CEFR subskills. Do not rename old tags or force false equivalence. Add tests that all released source tags are mapped and no evidence is silently dropped. |
| E04 | 103/323 activities carry more than one source skill tag. `academic-service.submit` emits an evidence event for each mapped tag from a single answer. These are correlated observations, not independent demonstrations. | Show per-tag outcomes while counting a source question only once in overall attempt totals; no inflated global sample size or CEFR confidence from tag multiplication. |
| E05 | `derivePlan` ranks not-assessed skills with a special low rank and otherwise uses accumulated subskill scores. This can prioritize *evidence collection* ahead of the learner's documented practice weakness. | Separate "needs assessment" from "suggested practice"; prioritize 1–3 actionable tagged weak areas, preserve user manual choice, show short rationale/attempt denominator. |
| E06 | Adult-approved Foundation Writing creates criterion-level evidence (0–4) from actual rubric scores. Speaking/Pronunciation still do not produce automatic speech-level evidence from planning text; Listening needs verified playback and transcript guards. | Do not infer Writing/Speaking/Pronunciation quality from word count, text planning, or mere uploaded audio. Keep adult review and playback safeguards. |
| E07 | `academic-service.submit/approve` triggers `learningService.rebuild` and model snapshot. `learningService.rebuild` can establish a provisional model from Foundation events even when no complete diagnostic exists. | Verify evidence→model→plan with deterministic integration tests across submit, review, retake, content-version boundaries; ensure no writes required for read-only audit. |
| UX01 | The v20 route guard unconditionally calls `confirmLatestDraft(...saveDraft...)` for every started attempt, even after `All changes saved`. This preserves data but causes a redundant network write and tab delay when clean. | v21 micro-optimization: skip only when exact current attempt/revision is confirmed persisted and no in-flight write exists. Await pending/dirty saves. Never trust visual status alone or skip a failed write. See detailed acceptance gates below. |

## Safe metric contract
- `attempt_accuracy = sum(correct objective answer events)/sum(all objective answer events)`, shown with numerator/denominator and optional per-skill breakdown. Count one source question answer once, **not** once for every attached tag. Preserve each attempt ID.
- `unique_question_coverage = number of distinct question IDs answered`. Show progress separately from attempt accuracy; optionally show most recent result per unique question.
- `tag_accuracy = correct mapped responses / total mapped responses` and `unique_questions` for each tag. If one question has two tags, it contributes once to each relevant tag, but only once to the overall denominator.
- Open/approved Writing: human-reviewed rubric evidence in its own section; unreviewed drafts get **no** quality grade. No CEFR from aggregate lesson count, practice accuracy or uncalibrated level labels.
- Practice suggestion only after suitable observations; describe "not enough practice data" instead of 0% mastery for missing tags. Keep raw evidence immutable; derived projections must be recalculable.

## UX01 save-state release gates
Implement as a narrow **code-only follow-up** after audit, never in this documentation branch. The player must bind the confirmed revision to the exact attempt ID and preserve a serialized queue. Navigation behavior:
1. No edits since last confirmed server save and no pending write: switch immediately, with no extra draft POST.
2. Pending save: await its success; if an edit arrives during it, save the latest revision and await confirmation.
3. Dirty edit: save before route change; failed save blocks all sidebar destinations, same-skill cards, and Back to lessons, showing Retry. Same on quick repeated clicks.
4. In-progress recording or lesson action remains protected. No false "saved" toast before confirmation.
5. On resume/retake, reset revision and confirmation identity correctly; after a failed fetch, retain old lesson/recording.
6. Measure navigation tap→first visible feedback and tap→completed navigation on the same network/device, against v20. Do not invent measured speedups.

## Next deliverables
- V21-P1: read-only evidence audit fixture and explanation tests; no account changes.
- V21-P2: accurate practice metrics + actionable recommendations, not a fabricated proficiency score; draft-clean navigation fix as separately QA'd code-only release.
- Parallel Batch05: original exercise additions to specific existing A1/A2 lessons; academic QA with independent reviewer. See `docs/BATCH05_EXERCISE_EXPANSION_SPEC.md`.
- Any new content version needs owner-approved Preview and separate Import; keep 1.4.0 and historical attempts frozen.

## Non-goals
No source/database credential access, actual learner data extraction, account merge, force authentication inside Work, D1 schema/migration/reset, retroactive changes to attempt records, new CEFR certification, or deploying work from this audit.
