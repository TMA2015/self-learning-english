# Curriculum 1.11.0 — Listening + B1 Writing Density Wave 2

Status: **ACADEMIC PASS / TECHNICAL PASS / AUDIO READY / GITHUB-FIRST RUNTIME PASS**

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

## Audio assets

Curriculum 1.11.0 now has real MP3 playback assets for **5/5 Listening lessons**.

Wave 2 assets were generated reproducibly inside GitHub Actions using free local tools (`espeak` + `ffmpeg`), with no external TTS account or paid service:

- LIS-A1-01 — 32.758 s — SHA-256 `7f7b514e30f1239d29cde08fe4e7b2ee2a448460dc392b4d4f390690adb9ae34`
- LIS-A2-02 — 49.058 s — SHA-256 `3cbe8e37ab59d454f97852eb45e6db8a60cd5bc61aad47ce732a1eecbc898b14`
- LIS-B1-02 — 70.975 s — SHA-256 `24c0c59ba28b1b87a4cba4a6f862a197f3f9d7cafd96b1516f734ac531b7dbe0`

The manifest source text must match the reviewed `audio_asset.source_text` exactly.

## GitHub-first runtime proof

The browser-local runtime is bundled with Curriculum 1.11.0.

QA now proves:
- the three new Listening lessons expose real manifest-backed audio;
- submission before verified playback is rejected;
- transcript access before a played/submitted attempt is rejected;
- after full playback, objective Listening evidence enters the local ledger with `playbackCompleted=true`;
- WRI-B1-02 submits as `pending_review` with no Writing evidence before review;
- after adult review, Writing rubric evidence enters the local ledger;
- both Listening and Writing progress survive local runtime recreation.

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

GitHub-first browser runtime is now on **1.11.0** and local-runtime QA passes. Sites/D1 production import and deployment remain separately unauthorized.
