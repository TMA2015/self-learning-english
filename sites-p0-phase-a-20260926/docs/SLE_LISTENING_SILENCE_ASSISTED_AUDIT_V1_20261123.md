# SLE Listening — Silence-assisted proposals for manual MP3 alignment

**Status:** engineering Draft / original-audio proposals only / **not learner-facing** / **not a verified segment library**
**Date:** 2026-11-23
**Base:** previous source-only Draft PR #216 at exact QA PASS commit `7c5a0a167951d7e71a850490813c801f73433ad0`
**Scope:** `LIS-A1-03`, `LIS-A2-01`, `LIS-B1-01`; no other Listening lesson activated.

## Why
The original SLE lesson MP3s are already available. The learner should be able to play an entire clip or one sentence at a time during **unscored, post-submit Dictation**. Sentence playback cannot be enabled with guessed or unverified time ranges. Purely manual boundary marking requires repetitive audio seeking; the next preparatory step can suggest starting positions based on real MP3 silence while preserving human review.

## What is generated
Run from `sites-p0-phase-a-20260926` on a machine with `ffmpeg`, `ffprobe` and repo dependencies installed:

```sh
node scripts/build-listening-segment-audit.cjs
node scripts/propose-listening-segments.cjs
```

Only files under `.sites-runtime/listening-segment-audit/` are generated. For each pilot, they include:
- `LIS-...-offline-audit.html`: existing local tool with exact-MP3 file selection, SHA and duration check, start/end marking, replay confirmation
- `LIS-...-silence-suggestions.json`: optional **UNVERIFIED** timing ranges derived from the MP3 itself

Silence proposals use a real FFmpeg `silencedetect` pass (`-35dB`, minimum detected silence 0.16s), then match silences to transcript turn boundaries using word-proportional duration estimates. The matching logic **does not understand speech**, align phonemes, identify speakers by voice, or prove that any suggested boundary matches the corresponding transcript. If the original MP3 has too few valid pauses, or cannot be processed/hashed/decoded, the script **does not fabricate equally spaced boundaries** and returns an empty suggestion list. No candidate is marked human-audited.

## How to review
1. Generate HTML and proposal JSON locally. Do not copy these artifacts into `public/`, `dist/client/`, a site deployment or a public link.
2. Open the HTML in a local browser. If browser SHA hashing is unavailable under `file://`, serve only on trusted local `127.0.0.1`.
3. Select **the original MP3** from `public/foundation-audio/`. The page refuses a SHA mismatch or unexpected duration.
4. Import its matching `silence-suggestions.json` under *Optional: import silence-assisted candidate JSON*. The page checks original-asset SHA, selected lesson, duration and ordered nonoverlapping line ranges; **import forcibly resets all `replayChecked` flags to false**, even if a file claims otherwise.
5. Replay **every segment** and move start/end to the audible word boundaries. An automated pause estimate may cut the first or final syllables, group the wrong turns or include silence.
6. Export only after every line has been replayed. Export still carries `status:"CANDIDATE_UNVERIFIED"` and `productionEnabled:false`, because a second independent review and real iPad Safari seeking/stop test remain required.

## Explicit protection
- No scored Listening attempt, transcript endpoint, playback verification ticket, learner state or Firebase data is modified.
- No runtime `verifiedSegments` array is generated or passed to `ListeningDictationPractice`; the "One sentence at a time" button stays disabled.
- Neither the proposed offsets nor the manual audit HTML is committed or published as a production asset.
- No teacher-quality evaluation or CEFR estimate is implied. The existing NotebookLM academic PASS applies to **whole-track post-submit Dictation**, not to accuracy of these generated offsets.
- Any metadata for a different MP3 hash is invalid; changing recordings requires a fresh alignment audit and release decision.

## QA gates
`tests/listening-silence-suggestions.cjs` runs the candidate builder over all three real original MP3 assets, checks manifest integrity via the builder, detects actual silence, verifies all proposal ranges and asserts every output remains unverified and offline. Prior source tests for full Dictation and the manual alignment auditor remain in cumulative QA.

**Next human gate:** review each proposed turn with the original recording and return a reviewed candidate JSON. A subsequent independent validation may certify specific line boundaries and, only after iPad Safari/Preview QA, wire verified segments to the learner's post-submit practice.
