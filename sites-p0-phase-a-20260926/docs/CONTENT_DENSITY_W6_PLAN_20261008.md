# Content Density Wave 6 — A2/B1 Vocabulary + Reading + Listening

Date: 2026-10-08  
Status: ACADEMICALLY APPROVED CONTENT DESIGN — candidate composition not started  
Base branch lineage: PR #50 / `content-density-wave5-draft-20261005`  
Base SHA: `892aac03901b29316b44455bd231bdbafac8376b`

## Why this is Wave 6

A repository lineage audit after NotebookLM review found that earlier staged content already reserved:

- Curriculum 1.12.0 in PR #46;
- Curriculum 1.13.0 in PR #49;
- planned Curriculum 1.14.0 in PR #50;
- lesson IDs `VOC-A2-04`, `VOC-B1-04`, `REA-A2-05`, `REA-B1-04`, and `LIS-B1-03`.

The newly reviewed Vocabulary/Reading/Listening packet therefore cannot reuse those IDs or the 1.12.0 version slot.

The academic content itself does not change. Only administrative IDs/version lineage are remapped.

## NotebookLM verdict

Original review packet:
`EN-VOC-REA-LIS-DENSITY-W5-20261008`

Verdict:
**PASS**

Required changes:
**0**

All 48 objective activities across all six lessons were academically approved.

Listening scripts/questions are academically approved but remain blocked from curriculum import until real playable MP3 assets exist and pass human listening QA.

## Administrative remap

Approved content now reserves:

- `VOC-A2-05` — Food preparation and simple instructions — 8 activities
- `VOC-B1-05` — Learning goals, progress and feedback — 8 activities
- `REA-A2-06` — Which club fits you? — 8 activities
- `REA-B1-05` — Can short breaks help you learn? — 8 activities
- `LIS-A2-03` — Choosing a class at the sports centre — 8 activities
- `LIS-B1-04` — Planning a student podcast episode — 8 activities

Repository check confirms all six remapped IDs are free on the staged PR #50 lineage.

No lesson text, passage, audio script, question, option, answer key, explanation, tag intent or evidence rule is altered by this remap.

## Version lineage

Verified staged state:

- Curriculum 1.13.0 candidate: 90 lessons / 779 activities.
- PR #50 proposes 4 lessons / 23 activities for planned Curriculum 1.14.0.
- If PR #50 clears academic review and composition, planned 1.14.0 becomes:
  94 lessons / 802 activities.

This Wave 6 then reserves:

**Curriculum 1.15.0 — 100 lessons / 850 activities**

This is a reservation/plan only. Do not compose 1.15.0 until the predecessor line is cleared.

## Portable reviewed packet

Administrative-remap packet:
`EN-VOC-REA-LIS-DENSITY-W6-20261008.md`

SHA-256:
`b5e21efaae158168f5b654e0c24fd29c9ad7ead12953bc868d08237caf7c3242`

This is the same academically reviewed instructional content with only ID/version metadata remapped.

A second NotebookLM review is not required unless instructional content changes.

## Listening hard gate

Before `LIS-A2-03` or `LIS-B1-04` can enter a cumulative candidate:

1. produce real playable MP3;
2. use distinct voices;
3. preserve answer-bearing wording exactly;
4. validate file integrity and duration;
5. human-listen on ordinary speakers/headphones;
6. reject clipping, missing words, misleading pronunciation or meaning-changing pauses;
7. preserve transcript-after-submit only;
8. preserve no-audio/no-credit;
9. preserve full-playback-before-scoring.

NotebookLM academic PASS is not audio-production PASS.

## Next work

1. Convert the reviewed/remapped packet into an incremental batch JSON.
2. Validate schema, IDs, tags and objective evidence rules locally.
3. Produce two Listening MP3 assets locally/free-first.
4. Human audio QA.
5. Only after predecessor PR #50 is academically reconciled, compose cumulative Curriculum 1.15.0.
6. Run local curriculum/import-preview regression gates.
7. No GitHub Actions until quota reset.
8. No live import/deploy/merge without owner authorization.
