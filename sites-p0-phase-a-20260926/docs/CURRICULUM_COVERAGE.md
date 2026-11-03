# AI English Tutor — actual content coverage, not CEFR marketing

**Status:** Source-level planning record for Curriculum Batch 02 `1.2.0` candidate, not proof of a deployed curriculum or a completed CEFR syllabus. Canonical machine-readable map: `content/curriculum-coverage-v1.json`. Check with `node tests/curriculum-coverage.cjs`.

## What is actually authored

| Source | Lessons | Notes |
| --- | ---: | --- |
| Original P0 demo | 13 | Demonstrates all seven domains but many units are thin. Grammar A2 was upgraded to 10 questions. |
| Batch 01, v1.1.0 candidate | 8 | Three foundational A1 Grammar, two Vocabulary, two Reading, one Writing. |
| Batch 02, v1.2.0 candidate | 8 | Three more A1 Grammar, one A1 Vocabulary, two Reading, two Writing. |
| **Cumulative candidate** | **29** | **190 tasks.** Not a certified A1, A2 or B1 curriculum. |

Do not translate authored task counts into CEFR coverage percentages: no exhaustive, independently agreed denominator for every descriptor has been established. The first 13 demo lessons remain visible but must not be represented as deep teaching units.

## Prerequisites, actual teaching sequence and known gaps

The dependency graph uses stable lesson IDs. It is **advisory metadata**, not currently enforced by the player; a learner can still navigate manually. No diagnostic result automatically assigns an entire CEFR level.

The A1 start is: be and subject pronouns → present-simple routines → articles/plurals → there is/are → place prepositions. School and daily vocabulary supports A1 notices, museum text and first Writing tasks. A2 extends present tenses, text comprehension and email writing. Existing B1 materials are still demonstration samples, not a fully scaffolded pathway.

The next **content** production focus should address:
- `GRA-A2-02`: finished events with past simple forms, negatives, questions. Needed before assuming A2 event-email and B1 past/present-perfect contrast are independently learnable.
- `GRA-A2-03`: countable/uncountable, some/any and quantities, following A1 plurals.
- `GRA-A2-04`: comparisons for reasoned choices.
- `GRA-A1-07`: can/can't and functional requests.
- `REA-A1-03` and `WRI-A1-03`: short personal messages and an independent descriptive paragraph, broadening genres beyond notices.
- A1 Listening, Speaking and Pronunciation need genuine playable audio and/or actual recordings before they can yield evidence. Text-only practice is allowed but must be labeled unassessed for spoken ability.

Additional useful vocabulary progression: A2 event/travel collocations. There are ten explicit gap records in the machine-readable file. A dependency such as `WRI-A2-02` needing new past-simple teaching is a **known gap**, not a reason to block a learner from using other lessons.

## Repeatable authoring discipline

Each lesson's intended concept, prerequisite and origin are recorded without modifying the immutable content source or adding database tables. New content batches should:
1. pick a gap with an explicit learner outcome;
2. author original bilingual explanation, worked contrasts, guided/independent/transfer questions, valid answers and misconception feedback;
3. cross-check every answer and text evidence independently;
4. check the prerequisite graph for a cycle, missing lesson or misleading course ordering;
5. assemble and import a new immutable version with a separate owner preview.

This dependency/coverage record will guide skill tags and later adaptive recommendations. It cannot itself teach a lesson, enforce unlocks or assign CEFR levels; those require separate tested player logic and adequate real learner evidence.

**Release order:** The owner's P1 Site v9 exists per report; Curriculum Batch 01 code/tests/import are still not confirmed here. Do not import Batch 02 directly over the old P1 code or before confirming the live source/content compatibility.
