# NotebookLM Review Packet — Grammar B1 Wave 2A

Packet ID: `EN-GRA-B1-W2A-20261004`

Status: **REVISIONS APPLIED — TARGETED NOTEBOOKLM RECHECK PENDING**

## Temporary source to upload

Replace the previous temporary English-project review source with:

`content/review-packets/EN-GRA-B1-W2A-20261004.md`

The permanent English-project baseline/rules/reference sources remain unchanged.

NotebookLM source format for this review is Markdown. The JSON batch stays inside GitHub as the machine-readable source and is not uploaded to NotebookLM.

Do not upload learner data, attempts, recordings or exports.

## Scope

Review exactly four new B1 Grammar lessons:

- GRA-B1-02 — Present perfect simple or continuous?
- GRA-B1-03 — Past perfect and narrative order
- GRA-B1-04 — Past habits with used to and would
- GRA-B1-05 — Modal deduction: must, might and can't

Total: 4 lessons / 40 activities.

Base curriculum: 1.6.1.

Proposed next content version after PASS and technical composition: 1.7.0.

## Review criteria

For every lesson and activity check:

1. grammar accuracy;
2. whether the keyed answer is unambiguously correct in the supplied context;
3. whether any distractor is also reasonably acceptable;
4. B1 appropriateness and dependency on A1/A2 prerequisites;
5. explanation accuracy;
6. English naturalness;
7. Vietnamese explanation accuracy;
8. age-appropriate context;
9. duplication/redundancy within this packet;
10. whether the activity actually tests the stated lesson objective;
11. stable skill-tag meaning;
12. no copyrighted textbook reproduction.

Special checks:

### GRA-B1-02
- distinguish result/quantity vs activity/duration;
- do not force simple vs continuous where both are natural;
- stative-verb examples must be safe.

### GRA-B1-03
- avoid pretending past perfect is mandatory where ordinary past simple is equally natural because sequencing words already make order explicit;
- past participles must be correct;
- earlier/later narrative order must be clear.

### GRA-B1-04
- distinguish past states from repeated actions;
- `would` must not be taught as normal for past states;
- questions/negatives must use `did + use to`.

### GRA-B1-05
- present deduction only; do not drift into past modal deduction;
- `can't` for strong negative deduction;
- do not key `mustn't` as negative deduction;
- `may / might / could` alternatives should be accepted where the prompt allows more than one.

## Required verdict format

Return one packet verdict:

- `PASS`
- `REVISIONS_REQUIRED`

Also return one row for every activity ID that needs a change.

Do not infer PASS from silence.

Suggested result structure:

```json
{
  "packet_id": "EN-GRA-B1-W2A-20261004",
  "verdict": "PASS | REVISIONS_REQUIRED",
  "lesson_verdicts": [
    {
      "lesson_id": "GRA-B1-02",
      "verdict": "PASS | REVISIONS_REQUIRED",
      "issues": []
    }
  ],
  "corrections": [
    {
      "item_id": "GRA-B1-02-Q1",
      "type": "GRAMMAR | AMBIGUITY | LEVEL | EXPLANATION | DISTRACTOR | TAG | OTHER",
      "issue": "precise issue",
      "correction": "exact proposed correction"
    }
  ]
}
```

## First review result — 2026-10-04

Verdict: **REVISIONS_REQUIRED**

NotebookLM reviewed all 4 lessons / 40 activities and found no lesson-level grammar, CEFR, explanation, distractor, skill-tag or originality problem. Five short-answer items required deterministic-scoring fixes:

- GRA-B1-02-Q5 — add straight/smart apostrophe contractions for `has been working`.
- GRA-B1-02-Q7 — repair the gap structure. The accepted answer remains `have you been learning`; the suggested fragment `'ve you been learning` is intentionally **not** accepted because it is not a standard standalone interrogative completion after `How long`.
- GRA-B1-02-Q9 — add straight/smart apostrophe contractions for `have been waiting`.
- GRA-B1-03-Q3 — add straight/smart apostrophe contractions for `had left`.
- GRA-B1-03-Q8 — repair the gap structure and add straight/smart apostrophe contractions for `had never seen`.

The machine-readable batch and NotebookLM Markdown source are now locked by CI: the Markdown is regenerated from the JSON and must match exactly.

### Targeted recheck only

For the second NotebookLM pass, recheck only these five activity IDs and confirm that the corrections remove the original issues without introducing a new ambiguity. A full 40-item review is not required.

## Release boundary

A NotebookLM PASS does **not** deploy anything.

After PASS:

1. reconcile every correction;
2. run repository draft QA;
3. compose an immutable 1.7.0 candidate from 1.6.1;
4. verify old 59 lessons are byte/structure-preserved;
5. preview import;
6. only import/deploy with owner authorization.

Until then this batch is review-only.
