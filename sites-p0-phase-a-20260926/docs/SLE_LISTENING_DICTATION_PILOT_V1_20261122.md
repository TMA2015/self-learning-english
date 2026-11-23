# SLE Listening Dictation — Phase 1 engineering pilot, source-only Draft

**Date:** 2026-11-22
**Status:** Independent NotebookLM R1 academic PASS with both MUST_FIX implemented; exact-head CI pending, NOT LIVE
**Owner intent:** Reuse original approved MP3 and transcript in appropriate Listening lessons, not only newly created lessons; provide whole-track and verified sentence-level replay modes plus gap-fill; Karaoke and Shadowing remain later phases.

## Current working feature in Draft

- Three explicit initial pilot IDs only: `LIS-A1-03`, `LIS-A2-01`, `LIS-B1-01`, all in current 21-entry audio manifest with source, MP3 path, duration and SHA.
- The existing server reveals the transcript only after the scored Listening attempt is finished. The new `Start fill-the-gaps listening practice` button uses that already-authorized endpoint, with request/attempt-ID guard against stale responses; the transcript is **not pre-bundled** into the practice JS or revealed as plaintext while the learner starts Dictation.
- Separate audio playback element replays the same original MP3 for practice. It is **not** the verified graded-playback audio ref, and it makes no `action:'play'`, submit, grading or learner-write API request.
- Locally generated deterministic gap masks from the submitted transcript; Easy ~10%, Medium ~20%, Challenge ~30%; exact word spellings only; manual Check, reset and retry. No fixed-answer scoring/CEFR credit, AI requests, profile writes, cross-device sync or persistence.
- Sentence playback control is present but remains **disabled** until exact matching-MP3 timestamps and asset SHA are available, validated against duration. No guessed offsets, no substitute TTS. Karaoke and Shadowing NOT implemented.
- Browser-native text inputs and audio controls accommodate keyboard and touch; physical iPad/Safari acceptance NOT TESTED.

## Pre-adoption academic check
`content/review-packets/SLE_LISTENING_DICTATION_NOTEBOOKLM_R1_20261122.md` preserves the exact A1/A2/B1 academic packet. **NotebookLM R1 verdict received: PASS, two MUST_FIX requirements**; the original evaluator response and per-question conclusions are in `content/review-packets/SLE_LISTENING_DICTATION_NOTEBOOKLM_PASS_RECEIPT_20261122.md`. Speaker labels are now excluded explicitly from gap selection and spoken word counts; learner instructions require “Type the exact word spoken in the recording” and the grade-like check is labeled “Literal Word Match”. The separate Chromium stale-feedback-on-density-change failure has also been repaired. Broad rollout to remaining lessons is deferred. No semantic AI/proficiency grading is introduced.

## Technical test gates
- `tests/listening-dictation-contract.cjs`: source/density determinism on three real transcripts, exact reconstructed text, orthographic normalization, missing verified segments fail closed, post-submit UI authorization and attempt identity, independent practice audio and no score/AI/storage writes.
- `tests/listening-dictation-browser-entry.tsx` + `tests/listening-dictation-browser.cjs`: real Chromium synthetic UI with replay mode gated, expected blanks, form input, Check, density reset, no production requests or state changes.
- Existing Listening full playback/skip/retake, media integrity, recovery, Writing save and scored attempt tests MUST remain PASS. TypeScript and full app build MUST PASS on exact PR HEAD before owner review.
- No curriculum content/version changes, no MP3 replacements, no Firebase LIVE, no Math/Auth or real learner data writes.

## Next implementation steps after review/QA
1. Incorporate NotebookLM MUST_FIX (if any) and re-run exact-head QA. If exact-head QA fails, correct it and keep the feature disabled until revalidated.
2. Obtain actual MP3-aligned sentence/turn segments and verified asset SHA for the pilot clips; enable per-sentence replay only for those exact verified assets, then repeat iPad Safari QA.
3. Expand reusable widget to the rest of eligible Listening assets, avoiding legacy recordings with missing integrity or transcript ambiguity.
4. Only after owner approval, progress to release Preview, physical iPad acceptance and explicitly approved English LIVE.
