> **ARCHIVED / HISTORICAL — 2026-11-03.** This is NOT an active SLE rulebook. Use only [SLE-MASTER-001](../../sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md). Historical commands, older branches and old quota restrictions below may be obsolete; do not treat them as current instructions.

# English Tutor — repeatable lesson authoring standard (v1)

**Purpose:** Author, review, import and extend *real original* learning content in short batches, without rebuilding the application or turning each new lesson into a new software project. Applies to Grammar, Vocabulary, Reading, Listening, Writing, Speaking and Pronunciation. Current production is a private Site; GitHub JSON is source, **not** a learner-facing release by itself.

## External reference and local decisions

The Council of Europe's CEFR (including the 2020 Companion volume) provides illustrative **can-do descriptors** and a non-prescriptive framework for curriculum, materials and assessment. It does **not** ship this application's English exercises, age-specific sequence, calibrated score boundaries, or a ready-made automatic proficiency test. See:
- https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context
- https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors
- https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-in-the-classroom

Use selected descriptors to set lesson outcomes; derive actual lesson content and rubrics independently. Distinguish a lesson's **CEFR target** from an evidence-supported, provisional learner estimate; no single exercise proves a whole CEFR level. Separate level of language from age/topic suitability (early secondary in this project). Do not copy exercises or explanatory prose from commercial textbooks such as *English Grammar in Use*.

## One stable production template per lesson

1. **Identity:** Stable ID `GRA-A1-04` / `REA-A2-03` etc.; seven allowed domain prefixes; curriculum target A1/A2/B1/B2; short title; estimate of time; module; position in `course.sequence`. Never recycle IDs for a different learning objective.
2. **Outcome and prerequisite:** 2–4 observable student outcomes; link prerequisite concept tags in the curriculum design document. A1 starts at the needed foundations; no assumption that Grade 6 automatically equals A2.
3. **Learn:** One focused concept, positive and contrasting examples, essential form or strategy, short accessible Vietnamese support. Clearly distinguish a general rule from a context-dependent heuristic.
4. **Guided practice:** 2–3 prompts with clear answer format and contextual hints (when supported). Explain the choice; hints do not reveal the complete answer or count as mastery.
5. **Independent practice:** 4–8 genuinely distinct contexts or a suitable equivalent. Use plausible wrong alternatives that map to identifiable misconceptions; never use nonsense distractors or ambiguous correct answers.
6. **Review and transfer:** One different-context application; feedback says *why* the correct response fits and *why the likely wrong alternative fails*. A separate follow-up after an error is new evidence, never overwrites the original error.
7. **Record:** Stable task ID, source skill tags, answer/accepted variants, explanation, rubric where needed and immutable package version. Only objective tasks receive deterministic correct/incorrect scores. Writing/Speaking/Pronunciation needs evidence and authorized review; word count, a text note or computer-played audio is not a certified level.

The current app has a bounded cumulative importer: **13–60 lessons per package, at most 24 activities per lesson, 1 MB browser upload**. These bounds are *implementation limits*, not pedagogical targets. A future modular authoring pipeline can generate one cumulative release without exposing learner records. Do not silently upload standalone lesson fragments to the current importer.

## Domain-specific contracts

| Domain | Input/practice | Quality gate |
| --- | --- | --- |
| Grammar | Meaning → form → affirmative/negative/question → new context | Gap answer inserted literally produces one complete valid sentence; check subject/auxiliary agreement and accepted variants. |
| Vocabulary | Meaning in context and useful chunks; retrieval and use | All distractors are plausible; no unintended synonyms, regional variants or multiple correct collocations. |
| Reading | Original, age-appropriate passage; gist, detail, inference | Evidence for every answer appears in the passage; distinguish directly stated fact from inference; do not contradict chronology. |
| Listening | Original transcript and **real playable audio asset** | Audio source and manifest match; playback guard before scoring; transcript after submission; no score if audio unavailable. |
| Writing | Task analysis → brainstorm → select ideas → outline → draft → self-check → revision | Clear audience/purpose/content, matching reviewed rubric and evidence from actual text. Incomplete text returns for revision instead of assigning unsupported proficiency. |
| Speaking | Prompt/plan, recording and human or validated review | Planning notes are explicitly unassessed for speech. No speaking level from written text or a microphone-less attempt. |
| Pronunciation | Actual word/contrast model + recording when used for production | Sound-symbol recognition may be objectively scored, but pronunciation skill remains unassessed without appropriate audio evidence. |

## Answer, explanation and data contract

For each task record: `id`, `type`, `prompt`, optional `options`, `answer` (or null for extended response), `feedback`, `skill_tags`, `evidence_weight`, and `rubric_id`/word range when relevant. `single_choice` has one intended answer whose option ID exists. `short_answer` specifies **only the missing phrase**, all genuinely acceptable variants and safe normalization. `extended_response` has `answer:null`, weight 0, clear rubric and `pending_review`; no inferred CEFR or automatic quality score. Keep existing `reading_asset` / `audio_asset` field contracts from the current seed.

Keep version immutability: changing an answer or lesson increments `schema_version`; a stored `1.1.0` must never be silently overwritten with different data. For now, all 13 original seed lesson IDs remain in cumulative packages; new IDs may be added up to the limit. `course.sequence` must enumerate every lesson exactly once. User profiles and attempts are never embedded in content packages.

## Quality pipeline for every batch

- **Editorial pass:** Verify CEFR outcome alignment, scope, age, grammar/semantic correctness and originality. Read the whole passage and every answer, not only the JSON schema.
- **Answer pass:** Complete each MCQ independently, insert every gap candidate into its literal sentence, review distractors and explanations; cross-check by a second reviewer (human or independently prompted model) and resolve disagreements before import.
- **Programmatic pass:** `node tests/content-quality.cjs` (content gate) plus `node tests/curriculum.cjs`, `node tests/foundation-coaching.cjs`, `node tests/run.cjs`, `node tests/academic.cjs` and `npm run build` when application code changes.
- **Import pass:** Administrator Preview on the authenticated Site, compare counts and content version; confirm once; export the newly stored package; test one new lesson and one old attempt.
- **Learner pass:** Collect examples of incorrect answers, unclear instructions and missing practice; revise as a **new immutable content version**, not by modifying a live historical attempt.

The incomplete Diagnostic assessment does not block learning in A1 units. Mastery should use several tagged observations across new contexts and time, not force a complete Diagnostic or assign CEFR from one trial.

## Batch 01 / next batch

`content/curriculum-1.1.0-candidate.json` introduces eight original A1/A2 units (67 new activities): be, pronouns/possessives, routines, school vocabulary, daily expressions, art-club notice, book exchange and A1 self-introduction. After a new code version is built/deployed, preview import with expected `Add 8 / Update 0 / Skip 13 / Conflict 0` if live content is still `1.0.2`.

Next batches add grammar articles/plurals, there is/are, prepositions; original reading texts, task-based writing and supported audio. Do not describe Batch 01 or the 21-lesson catalog as a complete A1–B1 syllabus.
