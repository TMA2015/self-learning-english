# Unit 10 — Kokoro A2/B1 audio licensing evidence (Draft; not a release approval)

Date: 2026-11-07. Scope: `LIS-A2-07`, `LIS-B1-08` (owner-selected new native recordings).
This note is provenance evidence, **not** a legal opinion or a declaration that MEDIA-01 passed.

## Producer metadata (actual sidecars, not the preset UI label)

- Engine: local Kokoro, Python package `kokoro==0.9.4`.
- Render voice: `bf_emma` (single voice) for both; no remote audio service indicated in sidecar.
- A2: `speed=0.9`, `pause_seconds=0.4038`, SHA-256 `04937096a911d5db09b470e97e459ded6e973c970a2ba388a6274883bf82064e`.
- B1: `speed=0.9486`, `pause_seconds=0.4038`, SHA-256 `9082966b597522148eac25d618eff6e698990168a42305110ede1298f384ac82`.
- The owner listened to these two recordings and accepted their audible clarity/quality (owner QA PASS). That is distinct from browser playback or word-by-word transcription verification.

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
- Rights gate for these **specific** two SHAs remains **PENDING FINAL SOURCE CONFIRMATION/OWNER ACCEPTANCE**; this note alone does not set it to PASS.

## Remaining independent gates

1. Physically integrate exact chosen MP3 bytes into Draft PR #117 and include manifest entries matching SHA, transcript and duration.
2. Verify `LIS-A1-06` separately (owner audio QA remains PENDING); do not substitute either A2/B1 audio.
3. MEDIA-01 browser play-to-end/submit/retry, transcript hidden before submit, source comparison and negative missing-media safety.
4. Exact-head PR CI, browser/iPad safeguarding 73 existing attempts, and explicit owner authorization before import/merge/deploy.

Status: **DRAFT PROVENANCE EVIDENCE ONLY — PRODUCTION NO-GO**.
