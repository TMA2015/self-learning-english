# SLE LIS-B2-01 — Verified Local Kokoro Media Intake, v2 (2026-11-22)

**Scope:** Media QA evidence for reviewed Batch03. Technical evidence only; NOT an import, runtime activation, academic re-review, or release approval.

## Academic/source provenance

- Packet: `SLE-B2-U10-B03-R1-20261122`; owner-supplied NotebookLM R1 `ACADEMIC_VERDICT: PASS`, 3/3 lessons, 6/6 Reading, 6/6 Listening-script, 1/1 unscored Writing; `MUST_FIX: NONE`.
- Separate source-only Draft #205 baseline: v1.30 Draft PR #201 HEAD `29ffcc510609092f6084e20d5144118792d82322`. Staging JSON under `content/review-packets/` deliberately **NOT IMPORTABLE**.
- Media identity: `LIS-B2-01-v1.mp3` (canonical name; byte-identical to owner-uploaded `LIS-B2-01-v1-v1.mp3`). SHA-256 `995521c99ec8715758cd295a4de04a1788b8772a9e73d703cc72dd977b415056`; 853,944 bytes; actual FFmpeg duration 119.448 s; MP3 mono 24 kHz, full decode PASS.
- Approved authoring A/B script SHA-256 `d3ff29610866c42649b41abfb4922b796ac6c1c6325366cb710941904a7f201d`, exactly nine alternating A/B source turns; full script text is in the reviewed authoring packet. Matching hashes **do not prove** that every word in the final MP3 matches the script.
- Owner personally confirmed recorded audio is clear/easy to hear and generated with **local Kokoro on owner's computer**. This is subjective intelligibility acceptance and tool provenance, not exact audio-to-script or voice license certification.

## Reproducible technical browser receipt

- **Isolated real Chromium headless** mobile-sized HTML5 `<audio>` fixture loaded the actual MP3 as a `data:audio/mpeg;base64` URL (not the application's runtime).
- PASS: metadata duration 119.392 s (difference from FFmpeg 56 ms, container metadata rounding), start/play, pause, seek to 35 s, resume, `ended` event, replay after ended. Evidence: portable QA bundle `SLE_LIS_B2_01_MEDIA_HANDOFF_v2_20261122.zip` retained outside GitHub; ZIP SHA-256 `ada651347799d22123fffd85ca2b58663a63e150a74ea1115c9cefc203de6ea8`; `verify_media.py` hashes/decodes original MP3 without mutating it.
- An earlier attempt to test `http://127.0.0.1` streaming in the isolated runtime encountered the environment's `ERR_BLOCKED_BY_ADMINISTRATOR` before loading the page. This is **NOT** an audio codec failure; HTTP Range/service hosting remain **NOT TESTED**.
- Chromium probe is **NOT** Safari/iPad or the genuine SLE lesson player. It has not tested attempts, full-play security, pre-submit transcript concealment, answer-key exposure, seek/retake policy or mobile Safari.

## License/provenance status

Official upstream model card `https://huggingface.co/hexgrad/Kokoro-82M` states **Apache-2.0** for `hexgrad/Kokoro-82M` weights and describes production use. The owner's installed model revision, voice pack IDs, actual library provenance and applicable notices for **this specific audio** have not been supplied. Therefore `OFFICIAL_UPSTREAM_MODEL_LICENSE_REFERENCED` but `EXACT_VOICE_LICENSE_REVIEW_PENDING`. Do not imply all redistribution and voice rights are definitively cleared.

## Production integration gates (hard hold)

1. Confirm the *spoken* MP3 words, changes/omissions, correct Mara/Jon turn ordering and all assessed evidence-bearing phrases against nine original approved turns. Correct/review script or regenerate on mismatch.
2. Verify exact Kokoro model + A/B voice packs and licenses/attribution.
3. Upload the **byte-identical** MP3 at `sites-p0-phase-a-20260926/public/foundation-audio/LIS-B2-01-v1.mp3` **on an isolated draft only**, and add a manifest record to `content/foundation-audio.json`: exact source, URL, FFmpeg duration and MP3 SHA above. Asset is **NOT** committed by this receipt.
4. Recheck lesson/item IDs, create source candidate only after media and provenance gates, retain `audio_asset.requires_real_playback=true`, `transcript_reveal=after_submission`, unchanged historical attempts and `RUBRIC-WRITING-B2` unscored Writing.
5. Exact-head full regression + built MP3 bytes/hash + actual site/player attempt full-listen/retake + pre-submit transcript/hidden-key checks + physical Safari/iPad Preview acceptance. An MP3 being playable in a standalone audio tag is NOT proof the SLE graded-Listening gate works.

**Current verdict:** `AUDIO_DECODE_PASS; OWNER_CLARITY_PASS; ISOLATED_CHROMIUM_PLAYBACK_PASS; WORD_PARITY_PENDING; VOICE_RIGHTS_PENDING; SLE_RUNTIME_NOT_TESTED; PHYSICAL_SAFARI_NOT_TESTED; RELEASE_NO_GO`.

No GitHub binary asset upload, no MP3 import/score activation, no source content replacement, no merge, no deployment or learner data writes.
