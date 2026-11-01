# Self-Learning English v1.18.0 — Owner-authorized audio rights review

**Decision date:** 2026-11-01 (Asia/Bangkok)  
**Authorized scope:** G Learning / Self-Learning English website, self-created educational listening, diagnostic and pronunciation audio.  
**Review method:** Owner explicit content originality and website-use declaration; app manifest/production metadata corroboration; upstream model licensing cross-check; historical PCM reproductions and replacement of the two ambiguous historical recordings.  
**Legal limitation:** This is a source/permission risk review, **not** a legal opinion or a guarantee of zero copyright risk, a forensic reconstruction of every historical model revision, or an independent exhaustive plagiarism search.

## Evidence reviewed

- Owner declared all lesson scripts/dialogues and produced recordings originally authored/generated for G Learning, not copied from commercial recordings or protected course material, and approved their use on the website on 2026-11-01.
- Content/assessment project independently passed academic reviews, including all 9 new Listening lessons and 15 Diagnostic audio tasks. Historical AQ2 1.17.0 content is carried forward without re-authoring.
- Every current audio item has an individual MP3 SHA-256 in `sites-p0-phase-a-20260926/content/audio-rights-register.json`; the asset file set and the register contain exactly 38 items.
- 24 newly generated Kokoro MP3s have local producer sidecar hashes, tool/voice IDs and project text references in `docs/releases/2026-11-audio-24-production-provenance.json`.
- Three earlier eSpeak/FFmpeg MP3s reproduce **PCM-identically** from the project’s historical script, recorded in `docs/releases/2026-11-old5-listening-reproducibility.json`; exact original software versions were not archived, but the speech was synthesized from project-owned scripts, with no third-party recording used.
- Two older files that could not be reproduced (`LIS-A2-01` and `LIS-B1-01`) have been removed from the *public* app tree and replaced with newly locally produced Kokoro 0.9.4 originals, verified MP3 SHA, exact approved source text and owner listening PASS.
- Nine other historical audio items retain their internal producer/lesson QA references. In particular, `PRO-B1-01` has no independently determined exact original Kokoro voice identifier; its source is recorded as local Kokoro plus PSOLA postprocessing. Do **not** claim this voice ID is known.

## Upstream licenses checked

1. **Kokoro-82M** audio generator/model weights officially carry **Apache-2.0** and document their voices and training provenance: https://huggingface.co/hexgrad/Kokoro-82M and https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md . These sources are references, not copied sound banks. 34 generated items.
2. **Parler-TTS Mini v1** model is **Apache-2.0**: https://huggingface.co/parler-tts/parler-tts-mini-v1 . One generated item; the model's voice is described as Laura in the project record.
3. **eSpeak speech synthesis** is GPL-licensed software, while original speech output from a separately run synthesizer is not inherently GPL-owned by the software author; source/policy reference https://github.com/espeak-ng/espeak-ng and https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL . Three reproducible project-generated items.
4. In all cases **the G Learning website distributes only the project’s generated MP3 files, not model binaries/training datasets/TTS executables**. Review training-source statements and retain this notice in the repository. Claims of zero third-party copyright risk are not made.

## Per-asset release decision and interpretation

The 2026-11-01 owner declaration authorizes publication of the project's **own** dialogue/script and project-generated audio on G Learning. Combined with individual file provenance, matching SHA hashes, license references and curriculum alignment, the register may record `source_originality=VERIFIED` as **project-origin/content traceability verified against owner-authored source + owner attestation**, **not** as an independent internet-wide proof against text similarity. The recorded `release_clearance=APPROVED` means **owner-authorized use of the specific project-generated asset in this website**, not legal certification.

Retain the following honest reservations:
- Exact historical Kokoro versions/revisions and one voice identifier are not fully reproducible; this is not evidence a copyrighted third-party audio file was used. No commercial recordings were knowingly incorporated.
- Model weights and dataset copyright are separate from MP3 output licensing. No model weights are included in the deploy artifact.
- The final release also needs a successful **post-replacement full test run**, Firebase preview browser QA, learner-data preservation checks, and an actual Writing AI test (or an honest Writing AI feature limitation); those are technical release gates, not audio IP gates.
- Audio clearance does not clear unrelated visuals/fonts or learner privacy: use existing static/security QA and parental data protections in the release process.

## Decision trace

- Approved-by basis: **Project owner’s explicit 2026-11-01 originality and G Learning website-use consent**, reviewed against the evidence listed above.
- Reviewer/recorder: ChatGPT project release agent, 2026-11-01.
- No extra audio production or owner hearing QA needed for the two replacements.
- Archive this decision in the private repo; do not expose internal producer metadata or learner data as public site assets.

**When all 38 individual asset SHA fingerprints and records pass the strict gate, audio redistribution review is closed for v1.18.0; this does not by itself authorize a full production deployment without green release QA and Firebase smoke tests.**
