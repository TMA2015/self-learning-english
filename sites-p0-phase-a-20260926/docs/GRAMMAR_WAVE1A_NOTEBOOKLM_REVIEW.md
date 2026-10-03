# Grammar Wave 1A — NotebookLM independent academic review

**Packet:** `GRAMMAR-WAVE1A-A2-FOUNDATIONS-20261003`  
**Status:** DRAFT FOR REVIEW ONLY — do not import to the Site.

## Why this packet exists

Self-Learning English production remains Curriculum 1.5.0 (45 lessons / 359 activities).

The long-term Grammar roadmap is approximately 40 lessons. Before mass expansion, P2B now has a fine-grained adaptive concept model in staging. Wave 1A fills the two highest-priority structural gaps:

- `GRA-A2-07` — Present continuous: form and use
- `GRA-A2-09` — Present perfect: experiences with ever and never

These are foundations for existing contrast lessons:
- GRA-A2-07 supports the already-existing GRA-A2-01 Present simple vs present continuous.
- GRA-A2-09 supports the already-existing GRA-B1-01 Past simple vs present perfect.

The new lessons must teach foundations rather than duplicate those contrast lessons.

## NotebookLM source management

Use the dedicated English-project Notebook.

### Permanent baseline sources — keep

If already present, keep these baseline sources:

1. `docs/CONTENT_AUTHORING_STANDARD.md`
2. `docs/CURRICULUM_COVERAGE.md`
3. `docs/P2B_ADAPTIVE_GRAMMAR_PARALLEL_PLAN.md`
4. `content/grammar-roadmap-v1.json`
5. `content/adaptive-map-v1.json`

Do not remove other established permanent project/rules sources already used by this Notebook.

### Temporary review sources — replace the previous batch packet

Upload these two files for this review round:

1. `content/grammar-wave1a-a2-foundations-draft.json`
2. `docs/GRAMMAR_WAVE1A_NOTEBOOKLM_REVIEW.md`

After this batch is reconciled and closed, these temporary batch sources may be replaced by the next audit packet. Do not treat them as permanent baseline sources.

## Review task for NotebookLM

Review the exact draft source. Do not merely summarize it.

Audit **all 20 activities individually** and both lesson-level explanations/examples.

### Check every lesson

For each lesson verify:

- grammatical accuracy;
- age-appropriate A2 difficulty and wording;
- learning progression from guided to independent to transfer;
- explanation accuracy and clarity;
- Vietnamese support is concise and does not introduce a different rule;
- prerequisite logic;
- overlap with the existing contrast lesson;
- whether the scope is too broad or too narrow;
- whether examples teach the same rule the activities assess.

### Check every activity

For every item ID verify:

- prompt has exactly one reasonable interpretation;
- MCQ has exactly one defensible correct answer;
- distractors are plausible but clearly wrong;
- short-answer accepted variants are complete but not over-permissive;
- the requested answer format matches the accepted answer;
- answer key is correct;
- explanation is correct and pedagogically useful;
- source tags match the evidence actually produced;
- no trick question or unnecessary ambiguity;
- no accidental dependence on cultural knowledge;
- no commercial textbook wording or suspiciously derivative wording.

### Specific risk checks

For `GRA-A2-07`:

- Do not let it become a duplicate of GRA-A2-01.
- It should establish present-continuous form/use first.
- Check whether the spelling rule examples are appropriate at this stage.
- Verify subject–verb agreement tagging only where evidence genuinely supports it.
- Check the routine-vs-now transfer items without turning the lesson into a full tense-contrast lesson.

For `GRA-A2-09`:

- Keep it focused on experience with present perfect.
- Check ever/never placement.
- Check all irregular participles.
- Verify the distinction between unspecified experience and a finished past time.
- Do not turn it into the broader B1 Past Simple vs Present Perfect contrast lesson.
- Check `been` vs `gone` implications carefully.
- Check whether contracted accepted answers are technically safe for a gap after a printed subject.

## Required verdict format

Return one structured review using this shape:

```json
{
  "packet_id": "GRAMMAR-WAVE1A-A2-FOUNDATIONS-20261003",
  "overall_verdict": "PASS | REVISIONS_REQUIRED | BLOCK",
  "lesson_reviews": [
    {
      "lesson_id": "GRA-A2-07",
      "status": "PASS | REVISE | BLOCK",
      "lesson_level_findings": []
    },
    {
      "lesson_id": "GRA-A2-09",
      "status": "PASS | REVISE | BLOCK",
      "lesson_level_findings": []
    }
  ],
  "item_reviews": [
    {
      "item_id": "GRA-A2-07-Q1",
      "status": "PASS | REVISE | BLOCK",
      "issue": null,
      "correction": null
    }
  ],
  "dependency_and_overlap_findings": [],
  "tag_findings": [],
  "final_counts": {
    "pass": 0,
    "revise": 0,
    "block": 0
  }
}
```

Requirements:

- Include exactly one `item_reviews` entry for each of the 20 activity IDs.
- If an item is REVISE or BLOCK, state the exact issue and a concrete correction.
- Do not silently rewrite the source and then report PASS.
- Do not give a blanket PASS without item-level checks.
- If a lesson-level problem affects several items, still mark each affected item appropriately.
- Treat CEFR labels as curriculum targets, not proficiency certification.
- A green structural CI result, when available later, is not a substitute for this academic review.

## Release boundary

This review does **not** authorize:

- curriculum import;
- production deployment;
- D1 changes;
- learner-data mutation;
- automatic CEFR claims.

After review, corrections must be reconciled into the exact draft, all structural/content checks rerun, and a second focused review performed if any material academic changes were made.
