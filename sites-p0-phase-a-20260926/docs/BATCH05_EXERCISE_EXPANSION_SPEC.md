# Batch05 — more exercises without changing the accepted 1.4.0 package
**Status: authoring specification, not an approved curriculum candidate. No Site/D1 action.** Date: 2026-09-28.

## Purpose and frozen source
The owner wants more *diverse, meaningful practice*, not only new lesson cards. Author original activities using the exact accepted `foundation-1.4.0.json` export, canonical digest `70eb0d13477a647ae2ab0ca5b11bfd1f52a99772f1ca206d701718d08ffb56da`; never start from stale GitHub demo seed. 1.4.0 stays immutable and available for old attempts. Work integration is deferred until independent academic review and source compatibility.

Focus the first practice-expansion batch on A1/A2 foundations, especially functional forms and existing thin A2 units. B1 lessons are still samples, not a full high-school/IELTS course. No artificial CEFR placement claim.

## Proposed authoring slice (8 existing lessons, +36 original activities)

| Existing lesson | Existing tasks | New tasks (MCQ / short / reviewed writing) | New total | Specific transfer objective |
|---|---:|---|---:|---|
| `GRA-A1-08` Question words and basic question order | 10 | 4 (2/2/0) | 14 | Distinguish subject vs auxiliary order, when/where/why/how in unfamiliar school contexts. |
| `GRA-A2-05` Future intentions with be going to | 10 | 4 (2/2/0) | 14 | Intention vs arranged event and present-continuous distractors; correct be agreement. |
| `GRA-A2-06` Rules: must, must not and have to | 10 | 4 (2/2/0) | 14 | Obligation, prohibition vs lack of obligation; contrast mustn't / don't have to. |
| `VOC-A2-01` Daily routines and useful phrases | 5 | 6 (3/3/0) | 11 | Retrieval in distinct day-to-day contexts; collocations and appropriate meaning. |
| `VOC-A2-03` Shopping, prices and polite requests | 8 | 4 (2/2/0) | 12 | Price/refund/size requests in an authentic but child-appropriate transaction. |
| `REA-A2-01` A garden for everyone | 5 | 6 (6/0/0) | 11 | Gist, detail, evidence-supported inference, vocabulary-in-context; no invented passage facts. |
| `REA-A2-04` An event update: compare plans and conditions | 8 | 4 (4/0/0) | 12 | Reconcile old/new schedule, place, reply condition; cite exact text evidence in rationale. |
| `WRI-A2-01` Write a helpful email | 3 | 4 (3/0/1) | 7 | Audience, purpose, coverage and one original written response requiring adult review. |

Planned totals: **8 updated existing lessons / 37 unchanged / 0 new lesson IDs; 36 new activities = 359 cumulative** (254 MCQ, 93 short-answer, 12 extended-response). Provisional Preview expectations at 1.4.0 baseline: `Add 0 · Update 8 · Skip 37 · Conflict 0`. These are **design arithmetic only**, not a live Preview result or import approval.

## Must remain byte-for-byte/content-object stable
- Every original 1.4.0 activity ID, prompt, options, key, explanation, tag, existing rubric and ordered lesson object content except the appended activities in the 8 named lessons. The 37 other lesson objects stay identical.
- Course order and all previous lesson IDs; new activities get unique IDs prefixed with their lesson ID, after the existing activity sequence.
- All 1.4 historical attempts remain linked to 1.4 through their immutable version. A retake/version choice must follow current application contract and must not silently reinterpret a past answer with 1.5 keys.
- Version must increment to `1.5.0` only after full review; never overwrite an already stored version or update any learner data through import.
- Existing Writing rubric matching and manual review; no automatic grade from response length.
- Listening/Speaking/Pronunciation unchanged in this first exercise-expansion slice, pending authentic audio/model/review assets.

## Quality of each new exercise
1. Every prompt explicitly says **select one option**, **write only the missing phrase**, or **write an original response**. No ambiguous "full sentence vs gap" instruction.
2. Guided → independent → transfer progression. Avoid repeating the same stems, answers or distractor pattern. Do not add a trivial copy of the ten existing grammar questions.
3. Each MCQ must have a single defensible key; all distractors plausible and teachable. Each short answer is literally inserted into its sentence; specify genuinely acceptable variants. Explain why rather than simply naming the option.
4. A Reading answer and explanation must be grounded in the frozen original passage; audit chronology and changes in schedule. An extended-response Writing activity needs an actual original task with audience, purpose, content points and the applicable adult-reviewed rubric.
5. Use the existing source skill tags (and only independently reviewed new mappings if truly necessary). Activity `evidence_weight`: objective 1; reviewed open response 0. Distinguish practice evidence from CEFR certification.
6. No copying commercial textbooks. Age-appropriate A1/A2 contexts; user can manually choose exercises.

## Implementation constraint
The current cumulative importer accepts at most 60 lessons, 24 activities per lesson, and a bounded upload. All proposed lesson counts remain below 24. Assemble one **cumulative** JSON; do not upload fragments or add learner states. Run shape/content, key/rationale, premise-evidence, structural, versioned-diff and old-attempt compatibility tests.

## Review pipeline (separate permissions)
1. Prepare portable review packet with exactly 36 new tasks, IDs, explanations, accepted variants, source-text excerpts and changed-object diff. Independently review every item; require reviewer to identify item-by-item status and corrections, not merely a summary.
2. Reconcile corrections; re-run all checks and compute new canonical SHA-256.
3. Code-only compatibility if required; existing tags preferred. Check all lesson group membership.
4. Parent View `Preview import · no changes` **only after owner authorization**. Expected Add0/Update8/Skip37/Conflict0 iff production still at accepted 1.4.0. A mismatch stops the release.
5. Separate owner approval to import; export the exact package for checksum and old-history QA. Do not merge unrelated PRs or alter Site identity, auth or D1.
