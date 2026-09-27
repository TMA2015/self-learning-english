# AI English Tutor — Foundation academic audit (2026-09-27)

**Scope:** existing production P0 course content package `1.0.0`, checked against `main/content/packages/ai_english_tutor_academic_seed_v1.json` and the same content in the P0 source checkpoint (`sites-p0-phase-a-20260926`). This is a source/content review, **not** a live learner-data audit or new deployment.

## Baseline

- 13 lessons, seven domains; A2 and B1 samples (Pronunciation has only an A2 sample).
- 55 activities: 44 single-choice, six short-answer, five open response.
- Module distribution: Grammar 12; Vocabulary 10; Reading 10; Listening 10; Writing 6; Speaking 4; Pronunciation 3.
- Two reading passages (118 and 166 words); two prepared Listening audio tracks (A2 ~25 seconds, B1 ~40 seconds); no Pronunciation model audio.
- The package itself is marked `seed_content_for_end_to_end_testing_not_a_complete_cefr_curriculum`. CEFR values are curricular targets, not externally calibrated proof of level. Avoid marketing this as a complete self-study CEFR syllabus.
- Objectives and introductory explanations exist for every lesson, but the teaching explanation is generally one short paragraph (18–42 English words). Examples are explicitly populated in seven of 13 records. Reading passages and listening tracks provide their own input material in other lessons.

## Lesson-by-lesson inventory

| ID | Lesson | Tasks | Immediate academic priority |
| --- | --- | ---: | --- |
| GRA-A2-01 | Present simple / present continuous | 6 | Add contrast-by-meaning guide, forms including questions/negative and targeted practice; correct Q5 accepted-answer boundary. |
| GRA-B1-01 | Past simple / present perfect | 6 | Clarify finished time vs present result/experience; correct Q3 and Q6 accepted-answer boundary. |
| VOC-A2-01 | Routine phrases | 5 | Introduce retrieval/production in new contexts, not merely phrase recognition. |
| VOC-B1-01 | Sustainable choices | 5 | Replace implausible distractors such as “lower rubbishings” with realistic learner confusions; add contextual use. |
| REA-A2-01 | Community garden | 5 | Add explicit evidence-location practice and a brief “why the other choice is wrong” example. |
| REA-B1-01 | Effective practice | 5 | Teach main claim vs qualifying evidence, inference vs directly stated fact. |
| LIS-A2-01 | Library workshop | 5 | Keep playback gate; differentiate workshop start (10:30) vs arrival (10:20) and show listening strategies after submission. |
| LIS-B1-01 | Reliable journey | 5 | Highlight contrast, viewpoint and qualification; add another practice track eventually. |
| WRI-A2-01 | Helpful email | 3 | Add task analysis → brainstorm → outline → draft → self-check; short placeholder text may currently be submitted pending review. |
| WRI-B1-01 | Opinion paragraph | 3 | Add independent idea selection, reason/example development and revision scaffolding. |
| SPE-A2-01 | Daily routine | 2 | Preserve text-only planning as unassessed and provide a no-microphone practice path. |
| SPE-B1-01 | Support an opinion | 2 | Add reason/example/follow-up coaching; never assess speech from text alone. |
| PRO-A2-01 | /iː/ vs /ɪ/ | 3 | The instructions refer to audio models, but the seed/manifest contains no Pronunciation model. Do not claim listening/pronunciation assessment without that asset and real recording. |

## Confirmed content defects: fix in a NEW content version

Three short-answer items accept an answer containing a subject even though the prompt already supplies that subject. Inserted literally, these yield duplicated subjects:
- `GRA-A2-01-Q5`: “Look! It ___ (rain).” accepts `it's raining`. Keep `is raining` for this blank; or rewrite the prompt to accept the full sentence unambiguously.
- `GRA-B1-01-Q3`: “We ___ (never / try) kayaking before.” accepts `we have never tried`. Blank answer should be `have never tried`.
- `GRA-B1-01-Q6`: “He ___ (finish) the report...” accepts `he has finished`. Blank answer should be `has finished`.

The UI says “Type only the missing word or phrase”; accepted answers must obey that contract. Keep the original package `1.0.0` immutable to preserve history; prepare `1.0.1` or later, preview/digest check and import explicitly. Review all six short-answer prompts systematically, not only these three.

## Teaching / assessment gaps

1. **Recognition-heavy:** 44/55 tasks are multiple choice, six are short-answer, five are open responses. Most lessons have 2–6 tasks; this is a usable demo, not enough independent retrieval or transfer for a full self-study lesson.
2. **One-pass feedback:** Objective feedback mostly describes the correct answer; the player shows results after attempt submission. It does not yet teach the specific misconception behind a chosen distractor, offer a hint before revealing, or require a new analogous item after an error.
3. **Context and progression:** No lesson-level dependency graph or A1 entry sequence. A2/B1 sample topics are suitable for development, but a Grade-6 learner may need prerequisite A1 content determined by actual performance rather than age alone.
4. **Writing scaffold:** The Writing tasks directly ask for a complete email/paragraph after two recognition items. They do not explicitly walk the learner through task analysis, brainstorm, select ideas, plan, develop, self-check and revise; this is the separately agreed 12-week Writing program's key purpose.
5. **Insufficient evidence path:** A very short open answer can be submitted into `pending_review` and should remain **unassessed**. A reviewer needs a “return for revision / insufficient evidence” decision rather than being forced to assign all rubric scores to an empty/placeholder response. Never infer CEFR from word count.
6. **Tag granularity:** Stored source `skill_tags` distinguish present simple vs continuous, but `tagMap` collapses them to `tense-and-aspect` in evidence. Keep both fine-grained error tags and broader mastery concepts if targeting a precise error bank.
7. **Audio limits:** Listening assets and playback guard exist. Pronunciation model audio is absent; microphone cannot be assumed; Speaking/Pronunciation remain unassessed without suitable audio and authorized review.

## Content and learner-experience standard for every future lesson

- A **single clear objective** with prerequisite check, optional Vietnamese help and age-appropriate examples.
- **Learn:** a short structured explanation and positive/negative contrasting examples.
- **Guided practice:** 2–3 items with optional graduated hints; clarify expected answer format (word/phrase vs full sentence).
- **Independent practice:** 4–6 meaningful new-context items and plausible distractors; no trick questions or ambiguous accepted answers.
- **Review/transfer:** one different-context application, concise misconception-specific explanation, and a tagged follow-up after an error.
- **Record:** keep original attempt, content version, fine-grained concept/error tags, repeat accuracy and pending human review where applicable. Do not equate single-attempt success or raw word count with CEFR proficiency.
- **Writing:** prompt analysis → brainstorming → choice/development → outline → draft → self-check → human/AI-assisted feedback with uncertainty → independent revision.
- **Audio domains:** a playable model and actual recording are prerequisites for speech judgments; provide a safe unassessed text-planning fallback when recording is unavailable.

## Recommended implementation order (do not confuse these with deployed status)

**P1-A — content correctness, no new UI:** Audit all 55 question-answer-feedback mappings; fix the three short-answer entries; tighten implausible distractors and missing evidence-based explanations. Author immutable candidate package `1.0.1` without rewriting `1.0.0`. Validate importer preview, idempotency and old-attempt version integrity using isolated tests.

**P1-B — one complete pilot:** Upgrade **GRA-A2-01** to the new guided self-study model, then **WRI-A2-01** to the seven-step Writing process. Test one actual learner session and revise the template before spreading to 13 lessons.

**P1-C — content/player contract:** Add structured sections, hint tiers, distractor-specific feedback, explicit answer format and targeted retry where current shape is insufficient. Keep front-end and data-model changes modular. Current bounded importer requires the same 13 IDs and permits at most ten activities per lesson; any expansion beyond this needs a separately tested schema/versioning change rather than silently editing the seed.

**P1-D — expand deliberately:** Build A1 prerequisites and the A2/B1 grammar/reading/writing curriculum in original wording (no copied *English Grammar in Use* exercises), then vocabulary/listening; postpone full Speaking/Pronunciation evaluation until hardware and validated audio review are available.

## Release gates

Preserve live version 8 and the current `1.0.0` learner attempts. Do not deploy merely because an academic document or unimported JSON exists. Each content increment needs independent subject-matter answer review, automated structural validation, preview of version conflicts, one learner-facing dry run, and verification that progress data remains attached to its original content version. The unfinished Diagnostic submission remains a separate open P0 check; do not restart the learner's paused v4 assessment.
