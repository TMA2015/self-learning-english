# Curriculum 1.6.0 — Grammar A1/A2 Milestone Release Candidate

Status: **candidate assembled and locally/CI validated; production remains unchanged; authenticated Site Preview not yet run**

## Purpose

This is the first substantial content-first Grammar release.

It replaces the earlier two-lesson 1.6.0 pilot candidate as the intended next curriculum release. The pilot remains only a historical validation checkpoint and must not be imported.

## Production baseline

Current production:
- Sites v29
- Curriculum 1.5.0
- 45 lessons
- 359 activities
- canonical SHA-256:
  `c4bef52f57238497b9c0529d94ef93736d266e1feaf1329a3c5b4d813848bcc1`

Verified production package archived in:
`content/releases/curriculum-1.5.0-production-import.json`

## Candidate

Curriculum:
- version: **1.6.0**
- total lessons: **59**
- total activities: **499**
- Grammar lessons: **29**
- candidate bytes: **544500**

New content:
- **14 Grammar lessons**
- **140 activities**

Grammar roadmap after this candidate:
- A1: **12 / 12**
- A2: **16 / 16**
- B1: **1 / 12**

Candidate hashes:
- Raw SHA-256:
  `555ea690f51066ae47365bcb25cafd9c7aa4fa4b126be70db0a6847120787d48`
- Canonical SHA-256:
  `2227598673d682ec9fe6b8f4b64b403343d2c491edd3f7381695304572965cb5`

Candidate file:
`content/curriculum-1.6.0-candidate.json`

Batch:
`content/batches/grammar-a1-a2-milestone.json`

## Academically approved additions

Wave 1A:
- GRA-A2-07 — Present continuous: form and use
- GRA-A2-09 — Present perfect: experiences with ever and never

Wave 1B Packet A:
- GRA-A1-09 — This, that, these and those
- GRA-A1-10 — Object pronouns and possessive pronouns
- GRA-A1-11 — Imperatives and everyday instructions
- GRA-A1-12 — Prepositions of time: at, on and in

Wave 1B Packet B:
- GRA-A2-08 — Past continuous and interrupted actions
- GRA-A2-10 — Present perfect: just, already and yet
- GRA-A2-11 — Choosing future forms: will, going to and present continuous
- GRA-A2-12 — Advice with should and shouldn't

Wave 1B Packet C:
- GRA-A2-13 — Possibility with may, might and could
- GRA-A2-14 — Zero and first conditionals
- GRA-A2-15 — Common verb patterns: to-infinitive and -ing
- GRA-A2-16 — Defining relative clauses: who, which and that

All 14 lessons have completed independent academic review.

## Grammar learning sequence

A1:
`01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12`

A2:
`07 → 01 → 02 → 08 → 09 → 10 → 03 → 04 → 05 → 11 → 06 → 12 → 13 → 14 → 15 → 16`

The stable lesson ID number is not the learning-order number.

The sequence intentionally places:
- GRA-A2-07 before the existing GRA-A2-01 contrast lesson;
- GRA-A2-08 after Past Simple;
- GRA-A2-09 and A2-10 before B1-01 later uses Present Perfect;
- GRA-A2-11 after the existing going-to lesson;
- GRA-A2-14 after future-form foundations.

## Preservation

Automated candidate checks require:
- all 45 existing lesson objects remain unchanged;
- all 359 existing activity IDs/content/order remain unchanged;
- only 14 lessons are added;
- no planning-only prerequisite/adaptive fields enter the importer package.

Expected future production Preview:

- Add: **14**
- Update: **0**
- Skip: **45**
- Conflict: **0**

STOP if the actual authenticated Preview differs.

## Runtime compatibility patch

The new lessons use approved fine-grained source tags such as:
- grammar.demonstratives
- grammar.object_pronouns
- grammar.prepositions_time
- grammar.past_continuous
- grammar.will_future
- grammar.should_advice
- grammar.modal_possibility
- grammar.conditionals
- grammar.verb_patterns
- grammar.relative_clauses

Production Site v29 does not yet know these new tags.

Therefore, before authenticated Preview of this candidate, the Site code needs a **content-compatibility deployment** containing the extended tag map. That deployment must leave production Curriculum 1.5.0 and learner/test data unchanged.

Do not weaken the new content back to broad legacy tags merely to avoid this compatibility deployment.

## Importer capacity

This candidate has 59 lessons and still fits the current application guardrail of 60 lessons.

Do not begin the B1 expansion release without first raising and stress-testing the importer capacity. The 60-lesson limit is an application-level guardrail, not a GitHub or ChatGPT Sites platform limit.

## Release boundary

This document does NOT authorize:
- Curriculum import;
- D1 reset/migration;
- learner-data mutation;
- historical regrading;
- PR merge.

Next gates:
1. final CI on the hash-locked candidate;
2. controlled code-only compatibility deployment;
3. verify production still Curriculum 1.5.0 / 45 / 359;
4. authenticated candidate Preview;
5. require Add 14 / Update 0 / Skip 45 / Conflict 0;
6. stop before Import and return results for owner approval.
