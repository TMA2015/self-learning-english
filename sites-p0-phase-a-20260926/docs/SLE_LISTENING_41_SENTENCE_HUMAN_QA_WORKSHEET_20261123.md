# SLE original-MP3 sentence-boundary human review worksheet

**Status:** EMPTY REVIEW FORM — no listening has been performed, no segment is verified, and no production activation is authorized. This is a supporting QA artifact for Draft #222, not a policy or academic verdict. Read the existing `docs/SLE_LISTENING_TURN_TO_SENTENCE_REVIEW_BRIDGE_20261123.md` first.

**Scope:** three original MP3s; 22 speaker turns mapped to 41 display sentences. Never copy approximate turn offsets into sentence timestamps. Source audio must match its manifest SHA-256 and duration. Do not upload MP3s, transcript-bearing generated HTML/JSON, learner data or this filled sheet with private review notes to a public repository.

## Reviewer protocol

1. Generate the local offline auditors with `node scripts/build-listening-segment-audit.cjs` and `node scripts/build-listening-turn-audit.cjs`. Load the exact original MP3 and matching turn suggestions. Confirm that SHA/duration checks pass; otherwise STOP.
2. For each sentence ID, use its parent turn as navigation only. Mark the sentence's *own* start and end; replay the exact clip, check all words and edge truncation, then explicitly confirm in the offline UI. A playback-complete flag alone is not a review.
3. Record a row as **REVIEWED** only after the explicit human action. Mark **FIX** for unclear speech, overlapping voices, missing words or bad boundaries; leave times empty until actually measured. Never infer timestamps from proportional text length or FFmpeg silence alone.
4. Export only after all 41 are explicitly confirmed. A second independent reviewer must check the exported clips, then real Safari/iPad seeking and the separately approved release gate must pass. Until then, keep `productionEnabled:false` and the learner's sentence-play button disabled.

## Review identity and evidence (fill locally)

- Reviewer / date: **NOT_REVIEWED**
- Original MP3 manifest SHA checks: **NOT_TESTED**
- First-pass local candidate export location: **NONE**
- Second independent reviewer / date: **NOT_REVIEWED**
- iPad Safari seek / replay: **NOT_TESTED**
- Final release authorization: **NONE**

## Sentence review matrix

Fill start/end only from actual MP3 replay. Status values: `NOT_REVIEWED`, `FIX`, `REVIEWED`. All rows are initially unreviewed.

| Lesson | Sentence ID | Start ms | End ms | Explicit confirmation | Status / notes |
|---|---|---:|---:|---|---|
| LIS-A1-03 | L1 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L2 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L3 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L4 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L5 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L6 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L7 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L8 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L9 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L10 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L11 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L12 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L13 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L14 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L15 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L16 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L17 | — | — | NO | NOT_REVIEWED |
| LIS-A1-03 | L18 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L1 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L2 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L3 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L4 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L5 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L6 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L7 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L8 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L9 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L10 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L11 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L12 | — | — | NO | NOT_REVIEWED |
| LIS-A2-01 | L13 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L1 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L2 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L3 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L4 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L5 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L6 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L7 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L8 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L9 | — | — | NO | NOT_REVIEWED |
| LIS-B1-01 | L10 | — | — | NO | NOT_REVIEWED |

## Release handoff (do not pre-fill)

- **KEEP:** original MP3 SHA, lesson IDs, scored Listening rules, historical attempts, full-track post-submit Dictation and all existing source data.
- **REMOVE:** no existing approved content or source. Reject only invalid candidate timings after human evidence.
- **ADD:** independently checked 41 sentence start/end pairs *only after* separate human, device and release gates; this worksheet alone never constitutes approval.

**NotebookLM:** Not requested for mechanical audio timestamp review; do not present this worksheet as an academic review packet or verdict. The primary blocker is actual human listening and independent device verification.
