# Unit 10 — Kokoro A1/A2/B1 audio licensing and asset provenance (Draft; not release approval)

Date: 2026-11-07. Scope: `LIS-A1-06`, `LIS-A2-07`, `LIS-B1-08` (three owner-rendered native recordings).
This note is provenance evidence, **not** a legal opinion or a declaration that MEDIA-01 passed.

## Producer metadata (the actual sidecars, not the preset UI label)

- Engine: local Kokoro, Python package `kokoro==0.9.4`.
- Render voice: `bf_emma` (single voice) for all three; no remote audio service indicated in sidecar.
- A1: `speed=0.9`, exact producer pause not present in the current receipt; 22.200s decoded, SHA-256 `91f736e9934476b44df0f4ab59eb2b381326bb144acd4475dcfa91e0fbe5bac6`. A1 owner hearing is now **PASS** (owner confirmed the original file is clear and of good quality on 2026-11-07).
- A2: `speed=0.9`, `pause_seconds=0.4038`, SHA-256 `04937096a911d5db09b470e97e459ded6e973c970a2ba388a6274883bf82064e`.
- B1: `speed=0.9486`, `pause_seconds=0.4038`, SHA-256 `9082966b597522148eac25d618eff6e698990168a42305110ede1298f384ac82`.
- The owner confirmed clarity and sound quality for all three A1, A2 and B1 recordings (Owner Audio QA PASS). That is distinct from browser playback or word-by-word transcription verification.

## Primary-source license references

1. Official hexgrad `Kokoro-82M` model card states **Apache-2.0** for model weights and describes production use: https://huggingface.co/hexgrad/Kokoro-82M
2. The historical official model README names `bf_emma` in the original British voicepack releases and describes Apache-2.0 model weights: https://huggingface.co/hexgrad/Kokoro-82M/blob/ad865fa460b4ca202b7e460cb0a514acfd2dcfaf/README.md
3. The published `kokoro` package version `0.9.4` lists Apache Software License: https://pypi.org/project/kokoro/0.9.4/
4. Its project manifest identifies package name/version and Apache license: https://github.com/hexgrad/kokoro/blob/main/pyproject.toml

## Release-boundary interpretation

- Public model/package metadata supports permissive use *if* the user's local model and voice assets were sourced from those official releases. The sidecar does not independently prove the exact downloaded checkpoint or voicepack file hashes.
- Output audio contains author-reviewed original Unit-10 instructional text, but the website release still needs ordinary content/source provenance and acceptance under the project's SLE-MASTER requirements.
- Do not infer that the runtime preset `Listening A2` means these were A2 lessons; the authoritative controls are lesson ID and actual rendered speed/pause.
- No external-voice-clone authorization or third-party recording permission has been presented; do not assert that the generated clips incorporate copied third-party audio.
- Do not claim the Kokoro package/model license resolves every dependency or third-party-asset obligation. For the public site, distribute only the resulting MP3 and keep attribution/license notices for tooling/models in the project provenance register as applicable.
- Rights gate for all **three exact SHAs** remains **PENDING FINAL SOURCE CONFIRMATION/OWNER ACCEPTANCE**; this note alone does not set it to PASS.

## Integration and rights-register status — 2026-11-07

- All three original audio binaries are physically committed in Draft PR #117 and referenced by `content/foundation-audio.json` with exact per-asset SHA, source text and decoded duration. No new MP3 is live in the approved production curriculum yet.
- `content/audio-rights-register.json` retains the 41 historical individually approved MP3 rights records unmodified, and adds **three new records with `release_clearance: PENDING`, `source_originality: PENDING`, and no approver/date**. The scoped draft metadata is `unit10_draft_assets`.
- `tests/audio-rights-release-gate.cjs` recognizes the 41 prior + exactly 3 reviewed Unit-10 media files, rejects unknown/missing assets and verifies the three candidate SHAs against receipts. Its strict `--require-clearance` mode **must continue to fail** while any candidate rights record remains pending. A passing byte-integrity check is not a license approval.
- Source-model license confirmation: the upstream Apache-2.0 package/model sources support permitted deployment in general; actual local voicepack/model download provenance and owner rights decision for these three newly generated assets are not yet fully evidenced.
- Owner's hearing acceptance is recorded for A1/A2/B1 as a separate, explicit quality decision on 2026-11-07, including the original A1 recording; do not infer browser playback or rights clearance from owner hearing.

## Remaining independent gates

1. Confirm original local `bf_emma` model/voicepack source and owner rights/source attribution for **these three exact audio SHAs**. Record a scoped, dated decision; do not inherit historical approvals by analogy.
2. Owner A1-U10 sound/clarity check: **PASS**, confirmed 2026-11-07 for the exact original SHA. No need to regenerate or resubmit it.
3. MEDIA-01 real-browser play-to-end/submit/retry, transcript hidden before submit, missing-media safety, and iPad/Safari QA where applicable. Previous Work execution lacked Chromium; no actual browser PASS evidence exists.
4. Exact-head candidate QA/release gates, independent learner-data safeguards, and explicit owner authorization before curriculum import, merge or deployment.

Status: **THREE ORIGINAL MP3s IN GIT DRAFT; OWNER HEARING ALL THREE PASS; RIGHTS / BROWSER MEDIA-01 PENDING; PRODUCTION NO-GO**.
