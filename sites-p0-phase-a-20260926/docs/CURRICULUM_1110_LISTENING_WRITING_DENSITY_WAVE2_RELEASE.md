# Curriculum 1.11.0 — Listening + B1 Writing Density Wave 2

Status: **ACADEMIC PASS / TECHNICAL RELEASE-CANDIDATE PASS**

Date: 2026-10-04

## Scope

Base: Curriculum 1.10.0  
Candidate: Curriculum 1.11.0

New lessons:
- LIS-A1-01 — A school club announcement
- LIS-A2-02 — A changed plan for Saturday
- LIS-B1-02 — Discussing a group-project problem
- WRI-B1-02 — Build a clear opinion paragraph

New content: **4 lessons / 40 activities**

Cumulative candidate:
- **78 lessons**
- **689 activities**
- **40 Grammar lessons**
- **5 Listening lessons**
- **9 Writing lessons**

## Academic review

Packet: `EN-LIS-WRI-DENSITY-W2-20261004`  
Verdict: **PASS**

No academic correction was required. No new runtime tags were introduced.

## Safeguards

Listening:
- real playback required;
- transcript reveal only after submission;
- transcript-only work does not earn Listening credit.

Writing:
- objective scaffold activities retain deterministic scoring;
- WRI-B1-02-Q10 remains AI/human-reviewed;
- extended-response evidence weight remains 0;
- no automatic CEFR claim.

## Candidate checkpoint

Path:
`content/curriculum-1.11.0-candidate.json`

Bytes: **755,027**

Raw SHA-256:
`26a742adf8748b589b3ad864721fda14d597e73fb2cca6ac20bf7fb608527b62`

Canonical SHA-256:
`1777cbc8d4657aaf19b1ac1fcd1da3aa8797d4ff13122278cbfb8489d7a4bba2`

Both hashes are pinned by regression test.

## Preservation and import preview

All 74 Curriculum 1.10.0 lesson objects remain unchanged.

Dry-run 1.10.0 -> 1.11.0:
- Add: **4**
- Update: **0**
- Skip: **74**
- Conflict: **0**

## Automated gates

PASS:
- reproducible composition;
- NotebookLM Markdown / batch JSON parity;
- academic-review record;
- schema/content validation;
- historical lesson preservation;
- import preview;
- prior curriculum regressions;
- Listening safeguards;
- learner-history/version-aware attempts;
- P2A progress;
- TypeScript;
- production build.

## Release boundary

This checkpoint does not authorize Sites/D1 production import or deployment.

GitHub-first browser runtime may advance to 1.11.0 after local-runtime QA passes.
