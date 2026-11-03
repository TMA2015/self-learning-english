# Curriculum 1.10.0 — B1 Vocabulary + Reading Density Wave 1

Status: **ACADEMIC PASS / TECHNICAL RELEASE-CANDIDATE PASS**

Date: 2026-10-04

## Scope

Base: Curriculum 1.9.0  
Candidate: Curriculum 1.10.0

New lessons:
- VOC-B1-02 — Word families for study and communication
- VOC-B1-03 — Collocations for plans, problems and decisions
- REA-B1-02 — A repair café comes to school
- REA-B1-03 — Should study apps plan every session?

New content: **4 lessons / 40 activities**

Cumulative candidate:
- **74 lessons**
- **649 activities**
- **40 Grammar lessons**
- **10 Vocabulary lessons**
- **11 Reading lessons**

## Academic review

Packet: `EN-VOC-REA-B1-DENSITY-W1-20261004`  
Verdict: **PASS**

No academic correction was required.

No new runtime tags were introduced.

## Density gain

This wave adds:
- 9 `vocabulary.word_formation` evidence items
- 9 B1 `reading.detail` evidence items
- 4 `reading.vocabulary_in_context` evidence items

## Candidate checkpoint

Path:
`content/curriculum-1.10.0-candidate.json`

Bytes: **709,931**

Raw SHA-256:
`f64bddd5dcaf46f7f98bba8b1155fbb1342f5fc4b4238d76e1fb4ed418d9af62`

Canonical SHA-256:
`fd5a71b0cfe623437026d7d420022f9b41cb724d378f54bdfc980ed614d4b773`

Both hashes are pinned by regression test.

## Preservation and import preview

All 70 Curriculum 1.9.0 lesson objects remain unchanged.

Dry-run 1.9.0 -> 1.10.0:
- Add: **4**
- Update: **0**
- Skip: **70**
- Conflict: **0**

## Automated gates

PASS:
- reproducible composition;
- NotebookLM Markdown / batch JSON parity;
- academic-review record;
- schema/content validation;
- historical lesson preservation;
- import preview;
- prior Grammar milestone regressions;
- learner-history/version-aware attempts;
- P2A progress;
- TypeScript;
- production build.

## Release boundary

This checkpoint does not authorize Sites/D1 production import or deployment.

GitHub-first browser runtime may advance to 1.10.0 after local-runtime QA passes.
