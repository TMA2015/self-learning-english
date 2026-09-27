# AI English Tutor — pedagogical operating model v1

**Status:** Teaching design and a content-authored pilot for a future player iteration. This is NOT a claim that the current Site has a live AI model or adaptive misconception diagnosis. Production Site v9 and the in-flight Curriculum Batch 01 release checkpoint are unchanged.

## Aim

Make a helpful, accurate and increasingly independent learner—not just an answer-checking website. Use CEFR to set language-use outcomes and plan evidence across skills; build the actual teaching system from authored examples, formative checks, misconception diagnosis, scaffolding, repeated retrieval, honest uncertainty and age-appropriate interactions. The learner can study A1 lessons while the long Diagnostic remains paused.

### External evidence, not a ready-made app algorithm

- Council of Europe CEFR Companion Volume (2020) and in-classroom guidance: selected illustrative descriptors align planning, tasks and assessment. https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-in-the-classroom
- AERO: explicitly explain/model small steps, provide worked examples and gradually fade guidance. https://www.edresearch.edu.au/guides-resources/practice-guides/explicit-instruction-practice-guide-full-publication
- EEF (2021): feedback should build understanding and give the learner a way to act on it. https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback
- AERO: spaced retrieval and varied practice provide information about retention and gaps. https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication

Our exact item counts, mastery gates, error categories and review intervals below are **product rules to validate with learner sessions**, not standards issued by CEFR or research-backed universal thresholds. Write our own examples; do not reproduce commercial textbook exercises.

## The teacher loop, per concept

1. **Understand the goal:** one observable outcome, the language situation and a small prerequisite concept graph (e.g. subject pronoun → be agreement → be negative/question). Show the learner what success looks like.
2. **Model:** concise explanation + worked example + a contrast or non-example. Allow concise Vietnamese support, without translating away all English practice.
3. **Guided try:** an initial attempt and an optional tier-one meaning clue, then a tier-two form/strategy clue. A hint never substitutes for independent evidence.
4. **Check:** verify the submitted answer objectively where a deterministic key exists; for Reading point to passage evidence; for an open response ask a qualified adult/validated evaluator. Never guess the learner's internal reasoning solely from a correct/wrong outcome.
5. **Diagnose carefully:** a specific MCQ distractor may support an authored misconception code. A wrong free-text response can have several causes; classify as `uncertain` unless a validated rule or review can distinguish them. An empty response is not an ability score.
6. **Repair:** give one explanation of the relevant misconception, show a contrasting example, then ask **one new analogous question**, not the identical item or an answer-copying exercise. Reduce scaffolding on the follow-up. Preserve the original answer and its evidence.
7. **Transfer and retrieve:** try an independent item in a changed context, then revisit a concept after some time. Report accuracy by concept with attempts, hints and task IDs visible; do not inflate proficiency through repetitive duplicates.
8. **Next decision:** proceed, practise again, review prerequisite or request adult review. Show *why* the next activity was chosen, but allow the parent/learner to follow the course manually.

## Required item-level authoring information

Every future teaching item should be linkable to a stable `concept_id` and `objective_id`, with:
- mode: `modelled`, `guided`, `independent`, `transfer` or `retrieval`;
- clear prompt and answer format; unique response key or a review rubric;
- tiered hints that never include the entire answer;
- plausible distractors linked to an **authored likely misconception** where defensible;
- answer explanation (meaning + form or text evidence), a distinct analogous `followup_item_id`, and a prerequisite pointer where useful;
- coverage markers for production, not just recognition: negatives/questions, writing output or other genuine language use as relevant;
- stable original task/version identifiers, so future corrections are imported under a new immutable package.

**Do not attach raw CEFR level outcomes directly to an item.** The item can target A1 while a learner needs broad, reviewed evidence to support any whole-skill or overall claim.

## Evidence and learner-state contract

Store separately: `question_id`, `concept_id`, `package_version`, `attempt_id`, original response, correctness or pending review, hint tier shown, context family, and timestamp. A mistake repaired with a follow-up remains a mistake in the original record; the follow-up adds a new observation. A hint-assisted answer counts as supported practice, **not** an independent mastery demonstration.

Working states for an individual concept: `not_started`, `developing`, `guided_success`, `independent_practice`, `retention_check_due`, `provisional_mastery`. These are instructional states, **not** CEFR grades. Example provisional gate for pilot only: at least three independent correct observations from different task contexts, plus one later retrieval success, with no unresolved prerequisite error. Track the actual denominator and recency. Before field testing, do not turn this threshold into a high-stakes score or universal rule.

Use three output distinctions:
- `correct/incorrect`: known-key items only.
- `pending_review/insufficient_evidence`: written/spoken open work or missing recording.
- `CEFR provisional/not_assessed`: separate aggregate interpretation. A few perfect A1 exercises are not equivalent to A1 certification.

## Writing-specific loop

Apply the already agreed 12-week Writing progression, reused in the new A1/A2 Writing modules: analyse prompt (audience, purpose, requested content) → brainstorm → select/support ideas → order/outline → draft → check → substantive feedback → **learner's own revision**. A short placeholder should be returned for completion, not given a low-quality proficiency rating. Where automated language feedback is unavailable, use honest authored prompts and adult review. The system must not fabricate an AI evaluation.

## How the teacher itself is assessed

We evaluate teaching quality using meaningful learner outcomes, not number of AI tokens or questions:
- **Content accuracy:** answer keys, wording, plausible distractors, passage evidence, CEFR-target and age appropriateness verified independently.
- **Actionable feedback:** at least one reason tied to the task and a specific next action.
- **Recovery:** how often a learner answers the *new* analogous item correctly after a correction; repeat the check on another day/context.
- **Retention and transfer:** correctness without hints on non-duplicate items after spacing.
- **Calibrated claims:** no open-response quality score without review, no Speaking from a text note, no level inference from word count or a single lesson.
- **User experience:** fast navigation, clear expected response format, optional supports, no forced full Diagnostic before learning.

A second expert/human review should try to **disprove** ambiguous questions and identify incorrect answer variants before publishing. Conflicts in reviewers' judgments require revision, not averaging contradictory answers.

## Scope gates

**Batch 01 is the shipping priority:** eight real A1/A2 lessons on draft PR #2. Do not modify its pinned source while Work is running. It must pass academic/content/tests/build and receive a code-only release before a separate owner-confirmed 1.1.0 import.

**Teacher pilot is a separate branch:** one sidecar on `GRA-A1-01` uses existing stable item IDs, two authored hints per item and a misconception/follow-up mapping. The current importer rejects extra fields: do not inject the sidecar into 1.1.0 or claim it is live. After Batch 01 reaches the learner, implement a versioned importer/player contract for this metadata with tests and small browser QA. Then scale to the rest of the first batch.

Do not suspend daily content authoring for a speculative autonomous agent. Deterministic teaching for well-keyed tasks and reviewed writing is preferable to unverified AI guesses.
