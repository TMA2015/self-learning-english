# Curriculum 1.6.0 — Grammar Wave 1A Release Candidate

Status: **candidate validated; production Preview still required; no import authorized**

## Production base

- Site: existing private Self-Learning English Site
- Production Site version: v29
- Production curriculum: 1.5.0
- Lessons: 45
- Activities: 359
- Verified production canonical SHA-256:
  `c4bef52f57238497b9c0529d94ef93736d266e1feaf1329a3c5b4d813848bcc1`

The exact verified 1.5.0 package is archived in:
`content/releases/curriculum-1.5.0-production-import.json`

## Candidate

- Version: **1.6.0**
- Lessons: **47**
- Activities: **379**
- New lessons:
  - `GRA-A2-07` — Present continuous: form and use — 10 activities
  - `GRA-A2-09` — Present perfect: experiences with ever and never — 10 activities
- Existing lessons preserved: 45/45
- Existing activities preserved: 359/359 with IDs and order unchanged
- Raw SHA-256:
  `10d171f1c703e3be13085b0f3eee4ebc76494fb69a620a65508d1b5de3a20aff`
- Canonical SHA-256:
  `1d89087e01b742936a0ed9dad73c647365df4370b86ffd1b1812bac66866a10b`
- File size: 422207 bytes, below the current 1 MB importer limit.

Candidate file:
`content/curriculum-1.6.0-candidate.json`

Batch source:
`content/batches/grammar-wave1a.json`

## Learning-path placement

The cumulative course sequence places:
- `GRA-A2-07` immediately before the existing `GRA-A2-01` present-tense contrast lesson;
- `GRA-A2-09` immediately after `GRA-A2-02` Past Simple foundation.

A2 Grammar sequence in this candidate:

`GRA-A2-07 → GRA-A2-01 → GRA-A2-02 → GRA-A2-09 → GRA-A2-03 → GRA-A2-04 → GRA-A2-05 → GRA-A2-06`

The numbering reflects stable IDs, not the display/learning sequence.

## Academic gate

Grammar Wave 1A independent review is closed PASS:
- 20/20 activities reviewed
- final targeted recheck PASS
- 0 unresolved BLOCK/REVISION items

Academic review source record:
`docs/GRAMMAR_WAVE1A_FINAL_ACADEMIC_REVIEW.md` on the academic branch.

## Automated release gate

Dedicated Curriculum 1.6.0 QA PASS:
- deterministic compose check PASS;
- candidate schema/content validation PASS;
- current content model validation PASS;
- exact 1.5.0 base digest check PASS;
- 45 existing lessons unchanged PASS;
- 359 existing activities/ID order unchanged PASS;
- new lesson field compatibility PASS;
- version-aware attempt regression PASS;
- P2A learning-evidence regression PASS;
- P1 course regression PASS;
- existing academic/content regressions PASS;
- TypeScript PASS;
- production build PASS.

## Expected authenticated Preview

Against production Curriculum 1.5.0:

- Add: **2**
- Update: **0**
- Skip: **45**
- Conflict: **0**

STOP if actual production Preview differs.

## Release boundary

This candidate is NOT authorized for import yet.

Next mandatory step:
1. verify production still reports Curriculum 1.5.0 / 45 / 359;
2. verify candidate hashes;
3. run authenticated Parent View Preview;
4. verify Add 2 / Update 0 / Skip 45 / Conflict 0;
5. inspect the two added lesson rows and absence of destructive changes;
6. report results and stop before Import.

No D1 migration/reset, Site deployment, learner-data mutation, historical regrading or curriculum import is authorized at the Preview gate.
