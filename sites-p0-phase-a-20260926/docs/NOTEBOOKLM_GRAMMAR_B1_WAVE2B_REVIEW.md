# NotebookLM Review Packet — Grammar B1 Wave 2B

Packet ID: `EN-GRA-B1-W2B-20261004`

Status: **ACADEMIC PASS — RELEASE CANDIDATE QA IN PROGRESS**

## Sources

Permanent NotebookLM sources: keep the five current Self-Learning English v2 baseline files.

Temporary source:
- remove the previous Wave 2A temporary source;
- add only `content/review-packets/EN-GRA-B1-W2B-20261004.md`.

The JSON batch remains in GitHub and is not uploaded to NotebookLM.

## Scope

Review exactly four B1 Grammar lessons:

- GRA-B1-06 — Second conditional: imaginary situations
- GRA-B1-07 — Wish and if only for present situations
- GRA-B1-08 — Passive voice in the present and past
- GRA-B1-09 — Reported statements and questions

Total: 4 lessons / 40 activities.

Base curriculum: 1.7.0. Proposed next version after PASS: 1.8.0.

## Special checks

### GRA-B1-06
- second-conditional meaning vs first/zero conditional;
- no `would` in the standard if-clause;
- `If I were you` guidance is accurate;
- contractions are accepted where the gap follows a pronoun subject.

### GRA-B1-07
- present wish/regret, not past regret;
- `could` for desired ability;
- avoid forcing a form where more than one standard variety is acceptable;
- distinguish present wish from future hope.

### GRA-B1-08
- correct be + past participle;
- present vs past passive agreement;
- agent use with `by`;
- active/passive focus is explained accurately.

### GRA-B1-09
- reported-question statement word order;
- if/whether for yes/no questions;
- backshift examples must be contextualized so optional non-backshift does not create an unintended second answer;
- pronoun/time-reference changes must be natural.

## Review result — 2026-10-04

Verdict: **PASS**

NotebookLM reviewed all 4 lessons / 40 activities against the five permanent Self-Learning English v2 sources.

Confirmed PASS:
- grammar accuracy and naturalness;
- ambiguity and deterministic scoring;
- CEFR B1 appropriateness;
- English explanations;
- Vietnamese support;
- distractor quality;
- all 5 proposed skill tags;
- lesson-contract alignment;
- originality and safety.

No academic correction was required.

The 5 reviewed source tags may now enter the runtime only through explicit tag mapping, adaptive-map update and regression tests.

Production import/deploy remains unauthorized until the Curriculum 1.8.0 release-candidate gate passes and the owner explicitly authorizes a controlled import.

## Required verdict

Return exactly `PASS` or `REVISIONS_REQUIRED`.

If revisions are needed, give the exact lesson/activity ID, the precise issue and a concrete correction. Silence does not mean PASS.
