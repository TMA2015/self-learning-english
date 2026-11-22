# SLE Listening — speaker-turn alignment as a QA-only bridge

**Date:** 2026-11-23  
**Status:** Draft engineering aid, **NOT verified**, **NOT released**.  
**Base:** exact QA-PASS Draft PR #218 SHA `40134fcf7605e1b7027b8b24d9e1296cb2b816de`.

## Why the previous silence result needed a second approach

Real-MP3 FFmpeg analysis on #218 produced:
| Original pilot | Transcript sentence fragments | Detected pauses | Complete sentence-fragment candidates |
|---|---:|---:|---:|
| LIS-A1-03 | 18 | 10 | 0 |
| LIS-A2-01 | 13 | 11 | 0 |
| LIS-B1-01 | 10 | 17 | 10 |

The live post-submit Dictation widget uses all 18/13/10 displayed sentence fragments; **its splitter is unchanged**. The MP3 recordings, however, are transcripts organized into **9/7/6 natural speaker turns** separated by source newlines. Silence detection may be more appropriate as an approximate guide to *turn* boundaries, while the boundaries between individual sentences within a turn need manual audio inspection.

## The new offline QA aid

`scripts/build-listening-turn-audit.cjs` reuses the SHA-matched original MP3 verifier, FFmpeg silence detector and existing unverified candidate algorithm. It substitutes physical source newline **speaker turns**, without altering the learner's 18/13/10 sentence presentation.

Run from `sites-p0-phase-a-20260926`:

```sh
node scripts/build-listening-turn-audit.cjs
```

For each of the three original audio IDs it generates **only** local files:

```text
.sites-runtime/listening-segment-audit/
  LIS-A1-03-turn-suggestions.json
  LIS-A1-03-turn-offline-audit.html
  LIS-A2-01-turn-suggestions.json
  LIS-A2-01-turn-offline-audit.html
  LIS-B1-01-turn-suggestions.json
  LIS-B1-01-turn-offline-audit.html
```

The HTML tool is identical to the prior SHA-checking/manual-replay auditor, but displays one line for each *speaker turn*. Optional candidate import does **not** mark any turn as verified; every start/end time still requires listening and correction. Missing sufficient real silences returns an empty proposal list rather than fabricated timecodes.

## Essential boundary: Turn ≠ sentence

Even if the original MP3 yields unverified timings for every speaker turn, these **must never** be passed to the student's `verifiedSegments` API, because the Dictation UI still splits some turns into multiple sentences. A separate, supervised second pass must mark the individual internal sentence boundaries in the approved original MP3, preserve the production `L1...Ln` line IDs, and test every clip on real iPad Safari.

No transcript, candidate JSON or offline HTML is copied into production `public`, `dist/client` or Firebase. No AI/TTS, learner-account data, scored Listening evidence or runtime audio verification ticket is changed. All outputs remain `CANDIDATE_UNVERIFIED`, `productionEnabled:false`, and `independentAudioVerified:false`.

The purpose of this intermediate step is to reduce human searching without falsely labeling an approximate pause as a complete, accurate sentence-level replay feature.

## Independent QA

`tests/listening-turn-audit-staging.cjs` verifies the real three-MP3 output, turn counts, immutable asset SHA, no automatic verified flags, local-only HTML, no learner UI changes and safe fail-closed operation. Existing full SLE QA, TypeScript and static build must remain PASS on exact current HEAD.

**Required human next step:** review candidate speaker-turn segments on original MP3, then mark and independently review each contained sentence. Physical iPad Safari and authenticated Firebase Preview must pass before owner can authorize a later production release.
