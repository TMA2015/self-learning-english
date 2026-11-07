# SLE Unit-10 A1/A2/B1 — NotebookLM disposition and candidate engineering

**Review packet:** `SLE-UNIT10-A1A2B1-TRANSFER-20261107-R1`  
**NotebookLM verdict supplied by owner 2026-11-07:** `PASS_WITH_REQUIRED_CHANGES`.  
**Academic adoption:** GO after required six canonical skill-tag corrections.  
**Technical candidate:** New source-only bundle derived from **v1.20.0 (123 lessons / 1025 activities)**; **v1.21.0 candidate = 132 lessons / 1055 activities**.  
**Production:** NO-GO. No MP3s for the three new Listening lessons; no real playback/browser acceptance or authorized media release. No commit `[release-english]`.

## Exact mandatory reconciliations

| NotebookLM item ID | Incorrect tag | Canonical replacement | Immutable candidate item ID |
| --- | --- | --- | --- |
| A2U10-R03 | `reading.inference/detail distinction` | `reading.detail` | `REA-A2-08-Q3` |
| A2U10-R04 | `reading.detail/condition` | `reading.detail` | `REA-A2-08-Q4` |
| A2U10-L01 | `listening.gist/detail` | `listening.gist` | `LIS-A2-07-Q1` |
| B1U10-R03 | `reading.inference/evidence limit` | `reading.inference` | `REA-B1-07-Q3` |
| B1U10-R04 | `reading.evidence_limits` | `reading.inference` | `REA-B1-07-Q4` |
| B1U10-L04 | `listening.stance` | `listening.speaker_intention` | `LIS-B1-08-Q4` |

All other scholarly item meanings, keys and new scenarios remain unchanged. An original review ID maps to a runtime ID because `validateSeed()` requires each question ID to start with its canonical Lesson ID.

## New content and Unit assignment

| Unit | Reading | Listening (MP3 BLOCKED) | Writing (0 weight) |
| --- | --- | --- | --- |
| A1-U10 | `REA-A1-05` (4 MCQs) | `LIS-A1-06` (4 audio + 1 cross-source MCQ) | `WRI-A1-05` (1 extended) |
| A2-U10 | `REA-A2-08` (4 MCQs) | `LIS-A2-07` (4 audio + 1 cross-source MCQ) | `WRI-A2-07` (1 extended) |
| B1-U10 | `REA-B1-07` (4 MCQs) | `LIS-B1-08` (4 audio + 1 cross-source MCQ) | `WRI-B1-08` (1 extended) |

One primary Unit per newly authored Lesson ID. Existing current Unit map `content/sle-unit-navigation-map-v1.json` is **not** changed while media blocks import. At eventual release, add exactly these nine mappings and retest 60-Unit UI. No historical lesson or scored answer is rewritten.

The X01 cross-source activity is placed inside its Unit's Listening lesson and assigned a canonical `listening.inference` tag. Its **original written stimulus** is also displayed by that player through the existing `reading_asset` field; the clip and transcript must remain playback-gated. Reusing a reading text on two lesson views is not a second score/attempt for the same question. Full cross-source interaction requires a real browser test.

## Audio production blockers

These are **scripts only**: `LIS-A1-06`, `LIS-A2-07`, `LIS-B1-08` do not have real MP3 assets or entries in `content/foundation-audio.json`.

**Never** score these four Listening questions + X01 per level before: (1) voice/rendering and rights provenance, (2) source transcript vs decoded audio human verification, (3) measured duration and physical SHA-256 manifest, (4) real browser play-to-completion, (5) subsequent independent scored submit gate test and owner release authorization. Missing audio is NOT a learner error, and must NOT become numeric zero. The scripts' `Speaker(...):` labels were converted into separate speaker roles; `source_text` contains the words actually to be recorded.

**Writing:** the three responses use `answer:null`, `evidence_weight:0`, `rubric_id:RUBRIC-WRITING-A1/A2/B1`, and existing schema-compatible `review_mode:'assisted_ai_or_human'`. The NotebookLM wording `human_or_verified_optional_AI` is preserved as the **meaning** (trusted review required), not added as a new unsupported runtime enum. Automatic semantic scores, Unit mastery and CEFR certifications are prohibited.

## Files and technical gates

- `content/batches/unit10-a1a2b1-academic-packet-r1.md`: exact original submitted packet, held as review evidence (six original tags remain visible there; they are NOT the machine candidate).
- `content/batches/unit10-a1a2b1-9-lessons-v121-draft.json`: machine-readable nine-lesson source with all six corrections, exact review-ID→runtime-ID mapping and explicit media NO-GO.
- `scripts/compose-unit10-v121-candidate.cjs`: additive, non-importing composer from the unchanged 1.20.0 source to a 1.21.0 candidate in `.sites-runtime/unit10/`; no public package JSON is written or imported automatically.
- `tests/unit10-academic-candidate-v121.cjs`: validates real schema and converted content, 132/1055 counts, 1.20.0 immutable prefix, all six canonical tags, 3×U10, option order and **absence** of fabricated MP3 assets. Integrated in the existing full PR QA.

Run `node scripts/compose-unit10-v121-candidate.cjs` for review-only local generation. Do not use the resulting `.sites-runtime` JSON in a learner browser or production import: it contains audio-dependent items for which media is unverified.

## Unmet release gates

- [x] Academic review returned by owner.
- [x] Six required tag string normalizations applied in draft source.
- [ ] Real TS `validateSeed` and `validateContent` on full 132-lesson candidate — CI evidence pending.
- [ ] Exact-head full PR QA, TypeScript and build — CI evidence pending.
- [ ] Physical MP3 generation, legal clearance and alignment, SHA, verified playback — NOT TESTED.
- [ ] Browser/iPhone learner-flow QA with Unit 10, cross-source and Writing pending state — NOT TESTED.
- [ ] Owner explicit production authorization and Firebase English-only publish — NOT GRANTED.

Do not merge this Draft content PR automatically. Keep Site live curriculum at approved 1.20.0 until every applicable gate passes. This working note is evidence, not a second project standard.

## 2026-11-07 — Owner-uploaded Kokoro MP3 source QA (not yet Git assets)

The owner has since uploaded **three real MP3 files** and matching producer JSON sidecars to the ChatGPT conversation: `A1-U10-v1.mp3`, `A2-U10-v1.mp3`, `B1-U10-v1.mp3`. The original bytes are available in a separately downloadable **SLE_Unit10_Audio_QA_Handoff_20261107.zip**; they are **not yet committed in this Git branch**. See `content/batches/unit10-owner-audio-receipts-20261107.json` for expected hashes, canonical path, sample rate and provenance.

| Approved Listening Lesson ID | Original user MP3 | Expected SHA-256 | Decoded seconds | Mean words/min (approx.) |
| --- | --- | --- | ---: | ---: |
| LIS-A1-06 | A1-U10-v1.mp3 | `91f736e9934476b44df0f4ab59eb2b381326bb144acd4475dcfa91e0fbe5bac6` | 22.200 | 186.5 |
| LIS-A2-07 | A2-U10-v1.mp3 | `91ba3cc5e3ca9528d07abbcff7c872308bb3a63fb7b41c87ac5aa056824cd514` | 24.375 | 233.8 |
| LIS-B1-08 | B1-U10-v1.mp3 | `379686f8290915aa437d42a0285be845143e471b30dd5c2c6f3769adbc69410b` | 38.475 | 191.8 |

**Local verification performed:** all 3 byte SHA-256 match supplied sidecar; sidecar `source_text` matches the immutable PR #117 original lesson script character-for-character; MP3 decodes at 24 kHz mono with no clipping; container padding differences are 0.048–0.069 seconds. The producer used Kokoro 0.9.4, local inference, single `bf_emma` voice. Distinguish this source-sidecar parity from **hearing every spoken word**, which is still **pending owner audio QA**.

**Pace warning:** New A2-U10 is approximately 234 words/minute including pauses, considerably faster than the current A2 Listening corpus (about 139–182 WPM). B1-U10 is approximately 192 WPM vs existing B1 corpus ~140–174 WPM. These are not formal CEFR limits, but the difference warrants owner listening acceptance. The downloadable handoff provides two OPTIONAL pitch-preserving slow playback previews (A2 0.77× → ~180 WPM, B1 0.90× → ~173 WPM) for comparison; **previews are not approved final originals** and have different hashes. Rerendering with slower native TTS is preferable if preview processing sounds distorted. A1 pace ~186 WPM is within current A1 corpus spread.

**Next media gate:** After final owner audio QA and selection of ORIGINAL vs renewed recording, put exactly the selected original media bytes under `public/foundation-audio/LIS-A1-06-v1.mp3`, `LIS-A2-07-v1.mp3`, `LIS-B1-08-v1.mp3`; register source+URL+duration+SHA in `content/foundation-audio.json`; reconcile rights register for new assets without automatically inheriting clearance for a different SHA; update current-curriculum audio coverage tests for approved 1.21.0; perform actual browser listen-to-end/Submit/retake/Save/Resume with transcript concealed pre-submit. `node tests/unit10-audio-owner-receipts.cjs --require-media` is deliberately a **strict fail gate** while the MP3 files are absent.

**Current status remains:** Source metadata PASS, AUDIO HEARING PENDING, BINARY REPO INTEGRATION NOT DONE, FIREBASE LIVE NOT CHANGED.
