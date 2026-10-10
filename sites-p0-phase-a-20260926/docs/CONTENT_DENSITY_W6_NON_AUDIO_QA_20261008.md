# Wave 6 incremental authoring — non-audio QA

Starting source: abca6fd9d616b7d73a951256342bfb4f96990b60, PR #59.

The reviewed packet is preserved byte-for-byte at `content/review-packets/EN-VOC-REA-LIS-DENSITY-W6-20261008.md` (SHA-256 `b5e21efaae158168f5b654e0c24fd29c9ad7ead12953bc868d08237caf7c3242`). The incremental batch contains 6 lessons and 48 objective activities. The authoring script transcribes the packet without rewriting instructional wording. Markdown speaker emphasis is removed from spoken source text; words, punctuation, turn order and paragraph breaks remain unchanged. Reading passages retain their reviewed Markdown. Learn chunks and examples remain together in the English explanation, without inventing additional prose or translations.

## Canonical tag reconciliation

No runtime tag-map changes. The reviewed specific tags remain visible in the packet and the mapping is recorded in batch metadata. Broader runtime tags do not claim separately measured subskills.

| Reviewed tag | Existing accepted tag | Reason |
|---|---|---|
| vocabulary.food_preparation | vocabulary.collocations | Reviewed food items test natural verb–noun combinations. |
| vocabulary.learning_collocations | vocabulary.collocations | Learning chunks are collocations. |
| vocabulary.collocation | vocabulary.collocations | Existing canonical spelling. |
| vocabulary.context | vocabulary.meaning_in_context | Meaning selected from the supplied context. |
| reading.compare_information | reading.detail | Compare explicitly stated notice details. |
| reading.main_claim | reading.gist | Main claim is whole-text meaning. |
| reading.qualification | reading.inference | Interpret a limiting statement's role; broad comprehension evidence only. |
| listening.time | listening.detail | Retrieve explicitly spoken times. |
| listening.speaker_preference | listening.speaker_intention | Interpret the speaker's preference and intention. |
| listening.qualification | listening.inference | Interpret conditions on the speaker's preference/decision. |

Already accepted gist/detail/inference/vocabulary-in-context tags remain unchanged. Each objective activity has evidence_weight 1. The closed-world activity schema has no proficiency_weight property; batch metadata records proficiency_weight 0, and tests verify mapped exercises never set CEFR directly. No new proficiency-scoring semantics are introduced.

## Local QA

- pnpm install --frozen-lockfile: PASS.
- tests/content-density-wave6-draft.cjs: 15 checks PASS, including exact source parity, 6/48 counts, existing-tag/schema validity, ID separation from 1.13.0 and PR #50, answer keys and Listening guards.
- tests/content-quality.cjs: PASS, unchanged.
- tests/curriculum.cjs: PASS, unchanged.
- tests/academic.cjs: PASS; local fixture verifies playback/transcript guards and historical version safety.
- tests/listening-submit-feedback.cjs: PASS.
- tests/listening-retake-audio-readiness.cjs: PASS.
- tests/listening-audio-manifest-coverage.cjs: PASS for existing audio; it does not assert the two new files exist.

Schema validation uses an in-memory fixture only. No cumulative Curriculum 1.15.0 package was composed or written. Existing curriculum files and Listening assets are unchanged.

## Remaining audio-only gates

Audio generation belongs to the separate owner workstream. Work generated no audio and called no AI/TTS provider. Both new MP3s still require commitment, duration/hash validation, exact script/manifest parity and human listening QA (OWNER PENDING). No new audio manifest entry falsely claims a playable file exists. Batch status blocks composition/import pending the audio gates and predecessor PR #50 reconciliation.

No import, merge, deployment, learner-data operation, Firebase/security/model/billing change. Commit uses [skip ci] to avoid GitHub-hosted Actions on legacy branch workflows.

## Subsequent owner-authorized full audio stage

Owner human QA approved the two short Kokoro samples. Both full scripts have now been generated with the same Kokoro-82M v1.0/package 0.9.4 settings, local CPU inference with offline caches, British-English text processing, A2 bf_emma/bm_george at speed 0.87 and B1 bf_isabella/bm_lewis at speed 0.94. Speaker turns use 0.28-second inserted pauses. No espeak waveform generation, cloud inference, AI API request or automatic provider fallback is used.

Kokoro native output is 24 kHz PCM; the new delivery files are encoded as 44.1 kHz, 192 kbps MP3 for playback compatibility. Resampling does not add acoustic information or establish human quality. Full script/turn provenance, hashes, durations and frozen existing manifest/file identities are recorded in `content/reviews/wave6-kokoro-audio-production.json`.

Only LIS-A2-03-v1.mp3 and LIS-B1-04-v1.mp3 are added. Existing five MP3s and manifest entries are unchanged. The coverage test now checks seven entries (five existing plus two staged); the focused Wave 6 test invokes 11 additional audio checks. Decoding, non-silence, finite sample values, no clipping, duration and source parity pass. No cumulative package is composed.

Full-length human listening QA remains **OWNER FINAL LISTENING QA PENDING**. Short-sample PASS does not approve the entire recordings. Batch composition/import status remains blocked pending full listening approval and predecessor PR #50 reconciliation.
