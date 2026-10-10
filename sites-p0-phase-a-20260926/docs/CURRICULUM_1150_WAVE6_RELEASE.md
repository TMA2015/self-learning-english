# Curriculum 1.15.0 Wave 6 release candidate

Starting checkpoint: 635e1130c80b0bba3da619d5e64208fd494fa5a7 (Draft PR #59).
Exact predecessor: 4a77f8acbd1b2a8271ca5aa5a9f48eb12bba22b4 (PR #50).
Lineage was reconciled by replaying the complete Wave 6 net delta onto this predecessor, with all existing blobs preserved; no overlapping file conflicts.

## Candidate

`content/curriculum-1.15.0-candidate.json`

100 lessons / 850 activities: Grammar 40, Vocabulary 14, Reading 15, Writing 11, Listening 9, Speaking 6, Pronunciation 5.
All 94 base lesson objects and all 6 reviewed Wave 6 lesson objects are unchanged. Base 1.14.0 file hash is pinned in the release gate. No new runtime tags.

Added IDs: VOC-A2-05, VOC-B1-05, REA-A2-06, REA-B1-05, LIS-A2-03, LIS-B1-04.
Academic PASS: zero required corrections. Final human audio QA: OWNER PASS, as recorded in PR #59 comment 6055012981 and committed production audit.

## Recovered audio

Attached MP3s matched the committed files exactly; no regeneration or audio repository changes.
- LIS-A2-03: 9142946715f6108c8b8ea7bca13f0d253cbe4f4770d87edad9d0905b2f17aaef
- LIS-B1-04: 4f515a56283db80d5342f4b6ce408b65d7a1888db6dad5b39d6c046d1c28511d

Existing five Listening assets and manifest entries are unchanged. Exact reviewed scripts, source/manifest/file mapping, measured duration, MP3 decoding and non-silent signal pass.

## Local QA

- pnpm install --frozen-lockfile: PASS
- content-density-wave6-draft: 15/15 PASS
- content-density-wave6-audio: 11/11 PASS
- listening-audio-manifest-coverage: PASS
- content-quality, curriculum, academic: PASS
- listening-submit-feedback, listening-retake-audio-readiness: PASS
- curriculum-1150-density-wave6: PASS (reproducible composition, schema/map validation, counts, preservation, tags, pure preview and digest).

The initial audio test had a stale OWNER PENDING assertion although committed metadata already recorded OWNER PASS. Corrected only the assertion/report labels and batch/generator approval status; all regressions rerun successfully. No academic prose or answer changes.

## Import preview and identity

Local in-memory importer only: Add 6 / Update 0 / Skip 94 / Conflict 0. Exact per-lesson rows checked, no preview writes, no validation errors.

- Raw SHA-256: 981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426
- Canonical SHA-256: 66663bb61cf60b266d25e8abd890e81ad27398d3ebee9b7cd5cd211de878b1e8
- Bytes: 950429
- Importer digest equals canonical hash: PASS

## Release boundary

Candidate preparation only. No production preview/import, deployment, PR merge, GitHub Actions, audio regeneration or Firebase/security/billing change. Existing predecessor runtime integration limitations remain unchanged; candidate validation does not establish browser playback QA for every cumulative lesson.
