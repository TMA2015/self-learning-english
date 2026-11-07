# SLE Unit-10 — Scoped Owner Rights and Provenance Decision (2026-11-07)

**Record type:** Project-owner attestation and scoped permission for specified generated MP3 assets, not an independent copyright determination or permission to release the curriculum.

**Owner decision recorded:** On 2026-11-07, in direct answer to the question "Ba MP3 A1/A2/B1-U10 đều do bạn tự tạo bằng Kokoro với giọng `bf_emma` (không dùng voice clone bên ngoài), và bạn đồng ý sử dụng chúng trên website G Learning, đúng không?", the project owner replied **"đồng ý"**.

This attests, for the three exact files listed below, that the owner generated them locally with Kokoro using the `bf_emma` voice, with no separate third-party voice cloning, and authorizes their use on the **G Learning educational website**. This is an **owner assertion**, not proof of exact weights/voicepack hash, an independent voice licensing audit, or a broad authorization for other recordings.

## Exact approved media fingerprints

| Unit | Lesson | Canonical asset path | SHA-256 |
| --- | --- | --- | --- |
| A1-U10 | `LIS-A1-06` | `public/foundation-audio/LIS-A1-06-v1.mp3` | `91f736e9934476b44df0f4ab59eb2b381326bb144acd4475dcfa91e0fbe5bac6` |
| A2-U10 | `LIS-A2-07` | `public/foundation-audio/LIS-A2-07-v1.mp3` | `04937096a911d5db09b470e97e459ded6e973c970a2ba388a6274883bf82064e` |
| B1-U10 | `LIS-B1-08` | `public/foundation-audio/LIS-B1-08-v1.mp3` | `9082966b597522148eac25d618eff6e698990168a42305110ede1298f384ac82` |

The approved A2/B1 hashes are the later re-rendered, owner-accepted originals, not the two superseded recordings. A1 is the original owner-submitted file. For each, independent project SHA+size checks and transcript/source-sidecar parity exist in PR #117. All three owner audio hearing quality checks are PASS.

## Tool/model licensing evidence

- `kokoro==0.9.4` Python package lists **Apache Software License**: https://pypi.org/project/kokoro/0.9.4/
- `hexgrad/Kokoro-82M` official model release identifies **Apache-2.0** licensed weights: https://huggingface.co/hexgrad/Kokoro-82M
- Its historical official README includes `bf_emma` in the voicepack release dated 2024-12-28: https://huggingface.co/hexgrad/Kokoro-82M/blob/ad865fa460b4ca202b7e460cb0a514acfd2dcfaf/README.md

**Evidence limitation:** Producer sidecars indicate Kokoro 0.9.4, local `bf_emma`, speed and timestamps, but do not contain locally downloaded model-checkpoint or voicepack SHA-256. Official upstream licenses plus owner attestation support the project's scoped **owner-approved website-use decision**; they are not cryptographic proof of which exact upstream file was installed. Record this distinction visibly. Do not invent a voicepack hash.

## Register disposition

For **these exact three SHA-256 recordings only**, the project rights ledger may now record:

- `release_clearance: APPROVED` — scoped owner authorization for educational website use, not general deployment authorization.
- `source_originality: VERIFIED` — *project-origin/owner attestation and authored-source traceability*, not independent plagiarism/legal verification.
- `approved_by: Project owner (explicit confirmation in ChatGPT, 2026-11-07)`.
- `approved_on: 2026-11-07`.
- Rights/provenance decision reference: this document.

The previously approved 41 MP3 records, transcript and audio bytes must remain identical. This decision is **not** transferable to new SHA values, alternate voices or other generated media.

## Independent deployment and QA gates not authorized by this decision

The user has **not** approved merging PR #117, importing curriculum 1.21.0, deploying the website or changing learner records. Full MEDIA-01 product-player flow (browser play-to-completion, submit/retry, transcript hidden before submission, Save/Resume, missing audio fail-closed), Safari/iPad and exact-head full QA require separate evidence. The real-Chrome independent MP3 decode/play-to-end test previously passed, but does not substitute for these product-level validations.

**Status:** OWNER RIGHTS APPROVED FOR THREE HASHES; CANDIDATE STILL DRAFT / PRODUCTION NO-GO.
