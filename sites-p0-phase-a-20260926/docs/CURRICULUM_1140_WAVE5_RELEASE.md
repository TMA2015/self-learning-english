# Curriculum 1.14.0 release candidate — Wave 5

Base checkpoint: cedd09401d30b5e00d42eb867ff010d15806e785 (Draft PR #50).
Candidate: `content/curriculum-1.14.0-candidate.json`.

Academic review: NotebookLM PASS, required corrections 0. Pronunciation audio technical validation PASS; owner final audio QA PASS by byte-identity inheritance. The reviewed lesson objects are unchanged.

## Composition

- Base: Curriculum 1.13.0 — all 90 lessons / 779 activities unchanged.
- Batch: speaking-pronunciation-density-wave5.json — all 4 lessons / 23 activities unchanged.
- New IDs: SPE-A1-01, SPE-B1-03, PRO-A2-03, PRO-B1-02.
- Candidate: 94 lessons / 802 activities.
- Grammar 40; Vocabulary 12; Reading 13; Writing 11; Listening 7; Speaking 6; Pronunciation 5.
- No new runtime tags. Extended responses remain review-required, evidence weight 0. Audio/playback/privacy safeguards preserved.

## Local importer preview

Isolated in-memory repository only, using the existing application importer. Add 4 / Update 0 / Skip 90 / Conflict 0; exact per-lesson actions verified. Preview produces no writes. This is not a production preview/import.

## Candidate identity

- Raw SHA-256: `df301a3669a3976664f3cd1574d99287a76d88d464e365d8ef595cd685accc27`
- Canonical SHA-256: `5dc6ad1d5f6c634a1d84b8bac6916470556cc5c14d059290623024e368c71f79`
- UTF-8 bytes: 890648
- Importer digest equals canonical SHA-256: PASS.

## Local validation

PASS: frozen dependency install; content-density-wave5-draft; pronunciation-audio-wave5; content-quality; curriculum; academic; curriculum-1140-speaking-pronunciation-density-wave5.

The new candidate gate runs reproducible composition, validateSeed, validateContent(mapSeed), count/ID/tag/preservation checks, pronunciation file/hash/duration checks and decoded MP3 F0 checks. F0: -5.1698 / +2.0837 / +2.0099 semitones.

The audio test requires ffmpeg/ffprobe and Python with numpy/praat-parselmouth. Set `PRAAT_PYTHON` to that interpreter before invoking the candidate gate. An initially missing local Python environment was restored and the full gate rerun successfully; no test was skipped.

## Boundaries

Import and deployment are NOT authorized. No GitHub Actions, merge, production data operation, Firebase/security/billing change, or Curriculum 1.15.0 composition.

Pronunciation assets and their dedicated manifest are staged, as documented in WAVE5_PRONUNCIATION_AUDIO.md. This content-only candidate does not wire the new manifest into the player; runtime playback integration and browser QA remain a separate release prerequisite. Existing Listening architecture is unchanged.
