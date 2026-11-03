# Curriculum 1.7.0 — Grammar B1 Wave 2A Release Candidate

Status: **ACADEMIC PASS / TECHNICAL RELEASE-CANDIDATE QA**

Date: 2026-10-04

## Scope

Base curriculum: 1.6.1  
Candidate curriculum: 1.7.0

New lessons:

- GRA-B1-02 — Present perfect simple or continuous?
- GRA-B1-03 — Past perfect and narrative order
- GRA-B1-04 — Past habits with used to and would
- GRA-B1-05 — Modal deduction: must, might and can't

New content: 4 lessons / 40 activities.

Cumulative candidate:

- 63 lessons
- 539 activities
- 33 Grammar lessons

## Academic review

Packet: `EN-GRA-B1-W2A-20261004`

Round 1 verdict: **REVISIONS_REQUIRED**

Five short-answer issues were corrected:

- GRA-B1-02-Q5
- GRA-B1-02-Q7
- GRA-B1-02-Q9
- GRA-B1-03-Q3
- GRA-B1-03-Q8

Targeted recheck verdict: **PASS**

Structured review record:

`content/reviews/EN-GRA-B1-W2A-20261004-academic-review-v1.0.json`

## Closed-world skill-tag gate

The following source tags were blocked until independent review PASS, then explicitly admitted:

- `grammar.present_perfect_continuous` -> `tense-and-aspect`
- `grammar.past_perfect` -> `tense-and-aspect`
- `grammar.narrative_order` -> `tense-and-aspect`
- `grammar.used_to` -> `tense-and-aspect`
- `grammar.would_past_habit` -> `tense-and-aspect`
- `grammar.modal_deduction` -> `modal-deduction`

Historical tag mappings remain unchanged.

## Candidate immutability

Candidate path:

`content/curriculum-1.7.0-candidate.json`

Candidate bytes: **587,216**

Raw SHA-256:

`322361db1fcc529891679367861e772605b02c8860e3d758d9699d6763868a57`

Canonical SHA-256:

`be2f904d9694a93bc323edb9566f26450067c64f6faba16ea200463c496e36c9`

Both hashes are pinned in the release-candidate regression test.

## Preservation gate

Curriculum 1.6.1 baseline:

- 59 lessons
- 499 activities

All 59 baseline lesson objects must remain unchanged in 1.7.0.

All historical activity IDs and ordering for preserved lessons must remain unchanged.

The 4 new lessons must match the academically reviewed batch exactly.

## Import preview

Dry-run from 1.6.1 to 1.7.0:

- Add: **4**
- Update: **0**
- Skip: **59**
- Conflict: **0**

This is the required production preview shape.

## Automated gates

Release-candidate QA covers:

- reproducible batch composition;
- Markdown NotebookLM source generated from JSON;
- final academic-review record PASS;
- approved tag mappings only;
- adaptive-concept compatibility;
- content-model validation;
- importer validation;
- 59-lesson preservation;
- short-answer correction locks;
- import dry run;
- existing curriculum regressions;
- learner-history/version-aware attempt regressions;
- P2A progress regressions;
- portable core;
- TypeScript;
- production build.

## Release boundary

This document does **not** authorize production import or deployment.

Before production import:

1. all current CI checks must be green;
2. production preview must match Add 4 / Update 0 / Skip 59 / Conflict 0;
3. candidate hashes must match the pinned values;
4. owner must explicitly authorize the controlled import.

No D1 reset or migration is part of this content release.
