# Curriculum 1.9.0 — Grammar Roadmap Complete

Status: **ACADEMIC PASS / TECHNICAL RELEASE-CANDIDATE PASS**

Date: 2026-10-04

## Milestone

Current Grammar roadmap:
- A1: 12 lessons
- A2: 16 lessons
- B1: 12 lessons
- Total: **40 Grammar lessons**

Curriculum 1.9.0:
- **70 lessons**
- **609 activities**
- **40 Grammar lessons**

Wave 2C adds:
- GRA-B1-10 — Defining and non-defining relative clauses
- GRA-B1-11 — Gerunds and infinitives after common verbs
- GRA-B1-12 — Indirect questions and question tags

Academic packet: `EN-GRA-B1-W2C-20261004`  
NotebookLM verdict: **PASS**

## Candidate checkpoint

Path:
`content/curriculum-1.9.0-candidate.json`

Bytes: **663,617**

Raw SHA-256:
`46f7e361925aae3494066bfe0ecd9e382e3a42ff2109bc2016432123aa6fc097`

Canonical SHA-256:
`1a7cae7a63ef2303e41a98f4715a1bb66aa818e61a5b489f364f98f878770d63`

Dry-run 1.8.0 -> 1.9.0:
- Add: **3**
- Update: **0**
- Skip: **67**
- Conflict: **0**

All 67 Curriculum 1.8.0 lesson objects remain unchanged.

## Reviewed new tags

- `grammar.non_defining_relative_clauses` -> `non-defining-relative-clauses`
- `grammar.gerund_infinitive` -> `gerund-infinitive`
- `grammar.indirect_questions` -> `indirect-questions`
- `grammar.question_tags` -> `question-tags`

The existing reviewed tag `grammar.relative_clauses` is reused.

## Release boundary

The GitHub-first browser runtime may use 1.9.0 after local-runtime QA passes.

This checkpoint does not authorize a Sites/D1 production import or deployment. No D1 reset or learner-data migration is included.

## Next academic phase

Do not expand Grammar by lesson count merely because capacity remains.

Next priority:
1. audit Vocabulary evidence density;
2. audit Reading evidence density;
3. identify under-observed skills/subskills and level gaps;
4. expand only where evidence quality requires it.
