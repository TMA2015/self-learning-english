# Audio license and release verification checkpoint — 2026-11-01

**Release candidate:** Self-Learning English v1.18.0, PR #67  
**Status:** CONTENT/AUDIO INTEGRATED; NO RELEASE DEPLOYMENT.  
**Purpose:** Separate verified licenses and owner permissions from outstanding release evidence, without adding unnecessary re-recording requirements.

## 1. Complete 38-MP3 audio inventory

Current public tree contains exactly **38 MP3 files**:
- 18 foundation Listening
- 15 Diagnostic
- 5 Pronunciation

Two historically untraceable recordings were replaced by owner-generated, locally synthesized Kokoro 0.9.4 output:
- `LIS-A2-01-v2.mp3`, SHA-256 `3f2bfa2166dd3e1386e41b4337ae7526adc13c13a3207114aa35e2439bdc1478`; duration 30.575 seconds.
- `LIS-B1-01-v2.mp3`, SHA-256 `e14ebf40777dd8bc24ffde008c06ec1053089b9f7919c78c999be2a15e11de1e`; duration 47.600 seconds.

Git blobs match the owner's supplied MP3s, source turns match the approved transcripts, and parent hearing QA for both = **PASS**. The two `-v1` historical binaries are **no longer in the public app tree**. Historical metadata remains in forensic review files; it must not be confused with the publishable assets.

The Listening manifest and the three impacted regression tests were updated in one atomic commit `584e66ffc654022383854fbee393245ad52f6db1`. Other 36 MP3s remain untouched.

## 2. Owner source rights attestation

On 2026-11-01 the project owner confirmed that learning texts/scripts and project audio were independently authored/generated rather than copied from proprietary course recordings, and authorized G Learning website use. This constitutes **owner source/usage attestation**, not evidence of every model revision or a representation that no similarity could possibly occur.

## 3. Official software/model license references

| Audio engine | Number of current MP3s | Primary evidence | Rights interpretation |
| --- | ---: | --- | --- |
| Kokoro (several local editions including 0.9.4) | 34 | https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0), https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md | Model card explicitly licenses Kokoro weights under Apache-2.0. British English voices including `bf_emma` and `bm_lewis` are listed. Original MP3 output is not a commercial third-party recording. Retain model card, license/notice references and individual production evidence. |
| Parler-TTS Mini v1 | 1 | https://huggingface.co/parler-tts/parler-tts-mini-v1 | Official model card expressly lists Apache-2.0. |
| eSpeak/FFmpeg | 3 | https://github.com/espeak-ng/espeak-ng (GPLv3+), https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL and original eSpeak author's clarification https://sourceforge.net/p/espeak/discussion/538920/thread/c6944a60/ | The program's GPL generally does not license the user's independently authored synthesized speech output. Original author explicitly permits generated WAV distribution. No eSpeak executable bundled in the website; only pre-rendered original MP3s. |

**Important:** These are license findings about upstream software/models, not a substitute for asset-level source provenance, output originality or notice reviews. The Kokoro model card contains CC BY training-data acknowledgements; retain or reference those notices as appropriate. Do not assert that this independently certifies the copyright status of all training samples.

## 4. Documented evidence already present in GitHub

- All 38 MP3 hashes and provenance descriptions: `sites-p0-phase-a-20260926/content/audio-rights-register.json`.
- 24 new Kokoro original production sidecars: `docs/releases/2026-11-audio-24-production-provenance.json`.
- Five historical Listening forensic PCM comparison (three matches, two replaced): `docs/releases/2026-11-old5-listening-reproducibility.json`.
- Two new owner-produced metadata exports: `docs/releases/audio-2026-11/producer-export-LIS-A2-01.json` and `producer-export-LIS-B1-01.json`.
- Owner confirmation/authorization: `docs/releases/2026-11-owner-originality-attestation-kokoro-replacements.md`.

## 5. Strict release gate and verification limits

The owner-originality declaration and published model licenses resolve major issues without further recording. However, at this checkpoint the register's per-asset `release_clearance` values remain `PENDING` pending complete evidence reconciliation and final authorization in the register. Do not replace `OWNER_ATTESTED` with `VERIFIED` mechanically or claim the strict `--require-clearance` gate has passed without executing it.

Before publishing:
1. Reconcile applicable upstream license/voice notices and per-item existing evidence in the release register. Mark approved only when all release clearance fields are genuinely supported; preserve the distinction between owner declaration and independent evidence.
2. Run full `pnpm qa:release` on the new exact commit, plus `node tests/audio-rights-release-gate.cjs --require-clearance`; prior QA at another app tree is not sufficient.
3. Confirm Firebase Hosting target is `g-learning-english` within `roadmap-toan-ai`, not the Math site. Check preview deployment, real playback, persisted learner data, rollback.
4. Test actual Firebase AI Logic Writing feedback with a real input and reliable fallback. Do not advertise auto-grading without a live PASS.
5. Only then mark PR ready, merge and promote production under the agreed free-only policy.

**Status of QA:** GitHub tree/manifest cardinality, uploaded blobs and source parity checked; **full post-change release QA and strict rights gate not yet demonstrated**. No automatic GitHub Actions run was triggered by this documentation or by the replacement commit, consistent with the manual-only CI policy.
