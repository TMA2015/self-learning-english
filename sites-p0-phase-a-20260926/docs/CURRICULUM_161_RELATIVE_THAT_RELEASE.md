# Curriculum 1.6.1 — Relative-Clause Hotfix Release Candidate

Status: **academically approved and technically validated; authenticated production Preview still required**

## Production baseline

Current production:
- Sites v30
- source `03f642124e3d84ee584649430e4ba4c446f6b07b`
- Curriculum 1.6.0
- 59 lessons
- 499 activities
- Grammar: A1 12 / A2 16 / B1 1

## Candidate

- Curriculum 1.6.1
- 59 lessons
- 499 activities
- changed lessons: exactly `GRA-A2-16`

Raw SHA-256:
`0767455e886a819c3f42b3b9e6bb1dec8222345ea8559192cb0dee1d66ddc7ef`

Canonical SHA-256:
`2760b5395d9a9ca822f27bd06f36a6bcde790996467cdaa8a82044b683650339`

Candidate file:
`content/curriculum-1.6.1-candidate.json`

## Exact hotfix

GRA-A2-16 now:
- teaches `who` or `that` for people in defining relative clauses;
- keeps `which` or `that` for things;
- updates the EN/VI explanation and examples;
- changes GRA-A2-16-Q5 accepted answers from `["who"]` to `["who","that"]`;
- updates Q5 feedback.

No other activity changes.

## Academic gate

Targeted NotebookLM audit:
- 10/10 activities PASS
- lesson objectives/explanations/examples PASS
- 0 REVISE
- 0 BLOCK

## Expected authenticated Preview

Against live Curriculum 1.6.0:

- Add: **0**
- Update: **1**
- Skip: **58**
- Conflict: **0**

The single updated lesson must be exactly:
- `GRA-A2-16`

STOP if any other lesson is updated.

## Release boundary

No Site code deployment is needed for this hotfix.

Do not import until authenticated Preview matches exactly and the owner separately authorizes the import.
