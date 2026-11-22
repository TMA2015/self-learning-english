# Self-Learning English — EvidenceHighlighter Academic Review R1

**PACKET_ID:** `SLE-INTERACTION-REA-B1-03-EVIDENCE-R1-20261122`  
**Project:** Self-Learning English (single unified project; not Self-Learning Math)  
**Review standard:** SLE-MASTER-001 v1.2.1 and the current permanent English sources in the dedicated NotebookLM  
**Reviewer requested:** Independent NotebookLM academic/pedagogical assessment, not technical QA  
**Status:** PROPOSED INTERACTION / ACADEMIC REVIEW PENDING; GitHub Draft implementation, NOT LIVE  
**Target:** Reading `REA-B1-03` (B1), an existing lesson in the cumulative v1.25.0 and v1.28.0 packages  
**Original assessment:** 10 graded Reading items, all unchanged; no new graded item  
**Source provenance:** Reviewed independent teaching overlay `SLE-RGW-DEPTH-PILOT-R1-20261113` (`content/rwg-depth-pilot-r1.json`). The existing lesson object `REA-B1-03` has an identical parsed lesson object in the v1.25.0 and v1.28.0 cumulative packages. The actual scored Reading passage is not reused here.  
**Related implementation:** Reusable `EvidenceHighlighter` widget, which supplements `CardSortBoard` and `ResponsePlanner` from the separate, already technically QA-passed SLE interaction pilot. Its academic adequacy has NOT been independently approved yet.

## 1. Purpose and educational boundary

SLE should not present every practice task as a multiple-choice question. This proposed optional interaction teaches a B1 reader to identify a specific **source sentence** that limits or qualifies a claim, without changing the existing assessed Reading passage or the ten assessed answers.

The learner reads an **independent worked example** about a school garden, selects one of three sentences by tap/click/keyboard, and selects **Check selected evidence** to compare their choice with the fixed model interpretation. The activity is unscored, does not add an attempt, does not claim reading proficiency, does not use AI, and does not certify CEFR B1 ability. It uses no actual learner records or new backend storage.

This is *sentence selection*, not free-form text-range highlighting, even though the reusable component is named `EvidenceHighlighter`. The interaction must not falsely imply that clicking a sentence establishes understanding of a longer source.

## 2. Exact independent model material already in the reviewed overlay

### Original reviewed model — unchanged

**Title:** Independent worked example — school garden

**Model passage:**

> A school garden can help pupils learn about plants. However, rainy days sometimes interrupt outdoor activities. Teachers may therefore need an indoor backup task.

**Original worked interpretation:**

> The first sentence makes a positive claim. “However” introduces a limit, not a contradiction that gardens are useless. The text supports the conclusion that backup activities may help. It does not prove that every school has the money, space, or staff for a garden.

### Proposed practice prompt

**Student sees:**

> Which sentence introduces a limitation to the positive claim about school gardens?

The student sees three selectable sentence buttons from the exact model passage, identified here only for the review:

- **S1:** A school garden can help pupils learn about plants.
- **S2:** However, rainy days sometimes interrupt outdoor activities.
- **S3:** Teachers may therefore need an indoor backup task.

**Proposed reviewed-key candidate:** S2. There is no additional scored Reading item and no proficiency credit.

**Feedback after the learner explicitly presses Check:**

- If the selected sentence is S2: `This sentence supports the model interpretation.`
- If the selected sentence is S1 or S3: `Review the limitation clue and compare again.`
- Shared explanation: `However marks a limitation: rainy days can interrupt outdoor activities. This does not mean gardens are useless or that every school has a backup plan.`

The original worked interpretation remains available in an optional, initially collapsed **See the worked reasoning (optional)** panel. The learner may consult it if stuck; it is not forcibly blocked because this is an unscored teaching exercise, not a protected assessment. Changing a selected sentence after Check hides the previous feedback, requiring a fresh Check.

**Question for the reviewer:** Are the exact proposed prompt, S2 target, alternative sentence interpretations, and feedback accurate, sufficient and pedagogically fair for B1? Does the sentence-based selection task teach a useful step toward evidence-supported reading, or does it overstate the inference that a learner can draw?

## 3. Why this is NOT a new assessed Reading question

- The original ten `REA-B1-03` objective activities, keys, rationales, weights, historic attempts, Reading source text and course order remain unchanged.
- The tested Reading assessment passage begins `Study apps can make it easier to organise homework`. **None of its words are rendered inside this optional evidence exercise.** The three sentences come exclusively from the unrelated school-garden teaching model.
- The selected sentence is not recorded in the academic repository, does not change total questions answered, and does not call any AI provider.
- The implementation checks only an exact fixed choice: it must not pronounce the learner's general Reading inference skill, evidence strength, or actual B1 level.
- This new interaction is not equivalent to a drag-and-drop/highlighting proficiency assessment. Future widgets used on other passages will require their own content alignment and relevant review.

## 4. Source version and release boundaries

The 2026-11-22 branch stages this UI for `REA-B1-03` in **1.25.0** (the original reviewed instructional overlay) and **1.28.0** (current bundled runtime), because the entire lesson object `REA-B1-03` is equal in those two package source files. No inferred forward compatibility: 1.29+ is not enabled by this change. The v1.28 special handling does **not** activate the old instructional overlay for other Grammar/Writing lessons, despite those lessons also remaining identical.

There is no Firebase LIVE deployment, no merge, no new curriculum import and no change to MP3/media. GitHub CI/TypeScript/browser QA is separately required and **not part of this academic verdict**. Physical Safari/iPad acceptance also remains independent.

## 5. Interaction usability requirements proposed for academic approval

A learner should be able to distinguish the original three sentences; understand what “limitation” means in this example; select a sentence with touch, mouse or keyboard; correct a wrong attempt without penalty; access a worked explanation if confused; and return to the original independently scored Reading assessment unchanged. The UI must label this as practice only and should not claim that clicking demonstrates passage-level mastery.

Potential ambiguity requiring review: the third sentence (`Teachers may therefore need an indoor backup task`) is a *consequence/response to the limitation* rather than the limitation itself. Please verify that S2 is unambiguously the **unique most direct** selection under the exact prompt. Please also check that the feedback phrase “not every school has a backup plan” does not overstate the original model, which says the text does not prove every school has the money, space, or staff for a garden. If necessary, specify a precise correction.

## 6. Mandatory independent review questions

1. **Curriculum fit:** Is this sentence-selection exercise suitable as optional B1 `REA-B1-03` teaching practice and aligned with the Reading aim of finding supporting evidence and recognizing qualification?
2. **Source fidelity:** Does the proposed task preserve the original school-garden passage, reviewed interpretation and scored/independent source separation without inventing external facts?
3. **Uniqueness:** Is S2 the only reasonable primary answer to the exact question? Could S3 plausibly be chosen, and if so how should the prompt be improved?
4. **Feedback accuracy:** Audit the exact positive, corrective and shared explanations. Does “every school has a backup plan” imply a fact not warranted by the reviewed model? Specify exact replacement text for any ambiguity.
5. **Scaffolding:** Is a selectable three-sentence model a useful step before independent Reading questions? Is the optional collapsed explanation an appropriate support, or should the instructional sequence change?
6. **Learning honesty:** Are there misleading proficiency, grade, mastery, automated inference or evidence claims? Does `EvidenceHighlighter` need more precise learner-facing terminology such as “Select the sentence”?
7. **Independence and safety:** Is it academically appropriate to locate this practice on the same lesson Learn screen while keeping the assessed text/keys out of the exercise? Are historical scoring boundaries intact?
8. **Adoption verdict:** Recommend PASS, PASS_WITH_CHANGES (exact mandatory edits), or REJECT for this **new interaction design only**. State whether the exercise can be added after technical and device QA; do not give technical or LIVE approval.

## 7. Required reviewer output

Return this concise structured verdict, followed by answers to Questions 1–8:

```text
PACKET_ID: SLE-INTERACTION-REA-B1-03-EVIDENCE-R1-20261122
STANDARD_VERIFIED: <version / unavailable>
INTERACTION_ACADEMIC_VERDICT: PASS | PASS_WITH_CHANGES | REJECT
MODEL_SOURCE_FIDELITY: PASS | CHANGE | UNVERIFIED
PROMPT_AND_KEY_S2: PASS | CHANGE | REJECT
FEEDBACK_ACCURACY: PASS | CHANGE | REJECT
B1_SCAFFOLDING: PASS | CHANGE | REJECT
ASSESSMENT_BOUNDARY: PASS | CHANGE | REJECT
MUST_FIX: NONE | [exact original → replacement text and reason]
OPTIONAL: NONE | [suggestions]
IMPLEMENTATION_QA: OUT_OF_SCOPE / NOT_TESTED
FIREBASE_LIVE: OUT_OF_SCOPE / NOT_AUTHORIZED
```

Be conservative. Do not assume engineering success or infer unseen actual learner behavior. For any required changes, reference the exact quoted prompt, key or feedback sentence.

## 8. NotebookLM source operations and short instruction

**KEEP:** All currently authoritative permanent/frozen Self-Learning English academic sources, including the active master content standard; no duplicate old versions.

**REMOVE:** The previous completed temporary C1-U04 Batch04 review packet, or any other older temporary packet still selected. Do not remove permanent sources.

**ADD:** This single Markdown file, `SLE_READING_EVIDENCE_HIGHLIGHTER_REVIEW_R1_20261122.md`. No ZIP, raw JSON, QA logs or GitHub PR comments are required in NotebookLM.

**Short NotebookLM chat instruction:**

> Review the current temporary Reading interaction packet against the permanent English sources. Answer all eight questions and return the required verdict. Require exact changes for any unsupported claim.
