# Self-Learning English 1.18.0 — owner originality attestation and legacy MP3 replacement

**Record date:** 2026-11-01 (Asia/Bangkok)  
**Scope:** Private repo `TMA2015/self-learning-english`, Draft PR #67.  
**Operational status:** Documentation + generator staged; **no new MP3 produced/imported**, no Firebase preview/production deployment and no final rights clearance as of this record.

## 1. Owner decision recorded in conversation

The project owner explicitly accepted that the learning scripts/dialogue and project-created recordings are originally authored/generated for this project, rather than copied from commercial recordings or copyrighted published course material, and consented to their use on the G Learning website. This is an **owner attestation**, not an independent content-similarity audit, not proof of the historical software responsible for every MP3, and not an unconditional rights release for every audio asset.

The owner also explicitly approved replacing **LIS-A2-01** and **LIS-B1-01** with newly generated, fully traceable Kokoro audio if their historical generation provenance remains unsupported. No additional approval to discard or alter the approved transcripts/questions was requested or granted.

## 2. Five historical Listening recordings: forensic evidence

Source: `docs/releases/2026-11-old5-listening-reproducibility.json`.

| Lesson ID | Decoded PCM reproduction using historical eSpeak/FFmpeg script | Direction |
| --- | --- | --- |
| LIS-A1-01 | Exact match | Preserve while independent rights gate continues |
| LIS-A2-02 | Exact match | Preserve while independent rights gate continues |
| LIS-B1-02 | Exact match | Preserve while independent rights gate continues |
| LIS-A2-01 | Nonmatch | Replace with Kokoro; keep old binary out of release |
| LIS-B1-01 | Nonmatch | Replace with Kokoro; keep old binary out of release |

Exact PCM reproduction is evidence of method compatibility, not proof of permission. The historical generator command log and exact tool versions are still unknown.

## 3. Official Kokoro provenance evidence

- Model: https://huggingface.co/hexgrad/Kokoro-82M — official model card lists **Apache-2.0** and Kokoro v1.0 weights SHA-256 `496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4`.
- Official voices catalog: https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md — voices `bf_emma` and `bm_lewis`; published leading SHA-256 fingerprints `d0a423de` and `b5204750` respectively.
- Reference inference code: https://github.com/hexgrad/kokoro — local Python inference, not a purchased or uploaded commercial recording.
- Apache 2.0 license terms: https://www.apache.org/licenses/LICENSE-2.0 .
- Review model weights, voice artifacts, third-party dependencies and applicable notices before final publication. Apache-2.0 model availability does not certify unrelated third-party material or guarantee zero IP risk.
- Do not use voice cloning or imitate any identifiable person. Training-data attribution notes on the model card must remain available in the rights audit.

## 4. Original source of the two replacement lessons

Use exactly the approved text in `sites-p0-phase-a-20260926/content/foundation-audio.json`:

- `LIS-A2-01`: library herb workshop registration, 2 speakers (`Woman`, `Man`).
- `LIS-B1-01`: discussion of commuting reliability, 2 speakers (`Host`, `Guest`).

Use British English voices matching the project's Kokoro audio precedent:

- `Woman` and `Host`: `bf_emma`.
- `Man` and `Guest`: `bm_lewis`.

Preserve source dialogue and speaker order verbatim. Do not synthesize speaker labels. No use of a commercial audio reference.

## 5. Local staging procedure — not a release

From `sites-p0-phase-a-20260926` in a networked local environment:

```bash
python -m pip install "kokoro==0.9.4" soundfile numpy huggingface_hub
python scripts/generate-kokoro-legacy-replacements.py
```

Also require FFmpeg on PATH and a working Kokoro phonemizer (eSpeak NG if required by local installation). The generator obtains and SHA-checks official model and voice assets, generates two **versioned `-v2.mp3`** outputs and structured sidecars in `../kokoro-legacy-replacements/`. It deliberately cannot overwrite `public/` and does not update the app manifests or rights register.

Expected files:
- `LIS-A2-01-v2.mp3` and `LIS-A2-01-v2.metadata.json`.
- `LIS-B1-01-v2.mp3` and `LIS-B1-01-v2.metadata.json`.

The output metadata must contain exact source-text SHA-256, full MP3 SHA-256, voice SHA-256, model SHA-256, package version, FFmpeg version and generation time. No claim is made that these new MP3s already exist.

## 6. Import and release acceptance after generation

1. Compare transcript/source hashes against the currently approved curriculum and manifest; independently listen to both replacements for meaning, punctuation prosody, names/numbers, speaker alternation, omission and truncation.
2. Record parent audio-QA verdict for each replacement. If pronunciation/content fails, rerender **without changing academic text**, with evidence of new takes.
3. Preserve old source binaries as non-distributed forensic evidence outside the website artifact; remove `-v1.mp3` for these two IDs from the public output before release. Import only the approved `-v2.mp3` files.
4. Update `content/foundation-audio.json`, the academic curriculum's embedded audio URL/duration where applicable, `content/audio-rights-register.json`, all dependent MP3 integrity/manifest tests and content package hashes to point to the new versioned files. The rights register must still cover **exactly 38 deployed audio assets**.
5. Complete per-asset license/provenance checks for all 38 MP3; only mark an item `APPROVED` with `source_originality=VERIFIED`, verified tool/voice evidence, `approved_by` and `approved_on` when the full evidence is in hand.
6. Run `pnpm qa:release` and the strict `node tests/audio-rights-release-gate.cjs --require-clearance`; both must PASS on the final tree. The previous green build is **superseded** once binaries/URLs are modified.
7. Only after the rights gate passes, run Firebase Hosting **preview**, inspect real audio loading/retry/continue and retained learner data, and test live Firebase AI Logic/Gemini Writing. Production promotion needs separate evidence for all release gates.

**Until steps 1–7 have passed: keep PR #67 Draft/HOLD; do not merge, deploy, enable billing, or touch the Math app.**

## 7. Rights-register update policy

`audio-rights-register.json` includes a top-level `owner_originality_attestation` and may mark script originality `OWNER_ATTESTED` for the existing 38 assets. That marker **does not satisfy** the strict test, which correctly requires independent `VERIFIED` plus explicit per-file `APPROVED`. The two historical nonmatching MP3s remain `NOT CONFIRMED` and blocked until their Kokoro replacement is actually produced and reviewed.
