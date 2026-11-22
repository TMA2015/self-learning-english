# SLE Listening — turn-to-sentence original-MP3 review bridge

**Date:** 2026-11-23  
**Status:** source-only Draft / QA tool; **NOT human-audited; NOT learner-visible; NOT LIVE**  
**Dependency:** source-only audio alignment Draft #220 at technical QA-PASS SHA `3f3bab7d33c9df5de3a9a3ec05239058826e8091`.

## What this fixes

Actual FFmpeg audio analysis from Draft #220 produced **9/7/6 unverified speaker-turn ranges**, whereas the production post-submit Dictation displays **18/13/10 sentence fragments**. Speaker-turn timestamps cannot safely substitute for sentence timestamps. This bridge preserves a one-to-many mapping:

| Lesson | Original speaker turns | Actual Dictation line IDs |
|---|---:|---:|
| LIS-A1-03 | 9 | L1–L18 |
| LIS-A2-01 | 7 | L1–L13 |
| LIS-B1-01 | 6 | L1–L10 |

The mapping is built by calling the *same* existing `splitDictationLines()` on each original transcript newline turn, flattening the results and requiring exact equality to the production line sequence. If sentence text or ordering differs, the offline builder fails rather than guessing a mapping. **No graded passage, MP3, transcript package, lesson, browser player or attempt is changed.**

## How to use offline

In `sites-p0-phase-a-20260926` with the original repository MP3s and Node dependencies installed:

```sh
node scripts/build-listening-segment-audit.cjs
node scripts/build-listening-turn-audit.cjs
```

Each lesson has a sentence-level `LIS-…-offline-audit.html` and a turn-level `LIS-…-turn-suggestions.json`. Files reside only under `.sites-runtime/listening-segment-audit/`, never under public hosting assets.

1. Open the **sentence-level** HTML locally, using a trusted localhost server if browser cryptographic hashing is unavailable via `file://`.
2. Select the original local MP3. The browser must confirm its **exact manifest SHA-256 and duration**; otherwise all timing controls stay disabled.
3. Under **Optional: import reviewed-later speaker-TURN suggestions**, select the corresponding `…-turn-suggestions.json`. The tool accepts only the precise lesson, source SHA, duration, `SPEAKER_TURN_ONLY` identity and correctly ordered turn ranges. It rejects mismatched files.
4. Select sentence L1/L2/etc. The UI shows which source turn it belongs to and whether a turn window is available. **Play approximate parent turn** helps the reviewer navigate. It deliberately **does not** populate any sentence `startMs/endMs` values, and replaying a parent turn **does not** mark a sentence checked.
5. Use **Mark start**, **Mark end** and **Replay selected region** on the exact original audio for that individual sentence. Playing to the end merely changes its state to *played; confirmation required*.
6. Only after actually checking the words and the beginning/end of that sentence by ear may the reviewer press **I listened — confirm this exact sentence/turn**. If the reviewer adjusts a time, the confirmation is cleared and the clip must be replayed again.
7. Do this for all **41 sentence fragments across the three lessons**. Export remains gated until every line has explicit human confirmation. Even then the JSON stays `CANDIDATE_UNVERIFIED` with `productionEnabled:false` and requires an independent review of the clips and real iPad Safari testing.

## Failure-closed boundaries

- **A proposal is never a verified audio segment.** The precise manual boundaries can differ from the FFmpeg silence midpoint.
- Turn-level `lineId` values differ from sentence-level `lineId` values after the first multi-sentence turn. The reader cannot import those as sentence clips.
- A completed playback does **not** equal human audio review. The separate explicit click is mandatory; a browser click is an audit assertion, **not** cryptographic proof of hearing.
- Importing a new MP3 resets suggested windows, sentence times, and confirmation flags. Importing a same-lesson suggestion never bypasses SHA checks, does not change sentence times or check flags, and cannot use an unknown source turn count.
- Do not commit generated transcript-bearing HTML or JSON to GitHub/public; do not copy into `public/`, `dist/client` or deployed Firebase hosting output.
- Neither the post-submission Dictation client nor the assessed full-Listening audio verification may read these QA artifacts. The **One sentence at a time** button remains disabled until a separately accepted, SHA-matched and device-tested 41-segment manifest is approved.

## Technical and human gates

`tests/listening-turn-to-sentence-audit.cjs` builds the real three original-MP3 tools and verifies all 22 turn relationships to 41 displayed sentence fragments, exact text parity, import SHA/order checks, manual confirmation gate, and zero student integration. Full no-deploy CI, TypeScript and static build must PASS on this exact source.

**Next blocker to resolve:** Reviewer must actually listen to all 41 sentence clips, correct boundaries, export candidates, and obtain a second reviewer/device sign-off. No human-perceptual QA has been performed by this source-only change and no LIVE deploy is authorized.
