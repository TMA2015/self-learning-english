# Stage 3 v1.18.1 — NotebookLM verdict reconciliation

**Date:** 2026-11-03 · **Source:** Owner-provided independent NotebookLM integration verdict for packet `SLE-STAGE3-INTEGRATION-20261103`.
**ACADEMIC_VERDICT:** `PASS_WITH_REQUIRED_CHANGES` · **RELEASE_VERDICT:** `NO-GO`.
**Normative rule:** `docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md` (SLE-MASTER-001 v1.0.0).
**Integration:** [Draft PR #72](https://github.com/TMA2015/self-learning-english/pull/72); inherited v1.18.0 baseline remains separate [Draft PR #67](https://github.com/TMA2015/self-learning-english/pull/67).

## Required corrections and reconciliation

| Reviewer finding | Implementation / disposition | Acceptance evidence |
| --- | --- | --- |
| `SPE-A2-02`: worked model visible during speak-aloud rehearsal | `app/speaking-preparation-guide.tsx` now has an explicit **Start speaking practice** control: clicking it collapses the model; reopening the model exits rehearsal. No voice recording, AI, persistence or scoring introduced. | `tests/stage3-notebooklm-remediation.cjs` exercises the **actual transpiled component state closures**; real browser/mobile test still required. |
| `GLOBAL_UI_FEEDBACK`: explanations lack next-action recovery | `domain/foundation-recovery-tip.ts` supplies a graded-only `Next step` for incorrect Foundation results. The 16 unchanged Reading/Vocabulary assessment IDs have specific, version-bounded hints; other domains have cautious generic recovery guidance. `app/foundation.tsx` displays it only after a graded incorrect result; existing explanations and historical result bytes unchanged. | Same test checks targeted hints, fallback domains and source-level conditional rendering. Real learner UI test still required. |
| `REA-A1-01-Q7`: historical `reading.inference` tag describes an explicit/paraphrased detail | **Do not change v1.18.0 or v1.18.1**: preserving old item tags, attempts and evidence is mandatory. Created [issue #75](https://github.com/TMA2015/self-learning-english/issues/75) for a separately reviewed, forward-only **v1.19.0** correction to `reading.detail`. | Future v1.19.0 schema, import-preview, version-pinned history and Skill Map ingestion tests; **not** treated as fixed by this PR. |

## Status of other NotebookLM gates

- `EDU-01/02/03`, `ACA-01`, `MOD-01`, `DAT-01`: independent reviewer recorded PASS for the material presented. No change to 109 lessons / 913 activities, keys or old content versions.
- `EDU-04`: code change now implemented with deterministic test; still **needs real browser UX observation** to close the complete release gate.
- `ACA-02`: v1.18.1 keeps the reviewed adjusted objective, while Q7 reclassification is tracked for v1.19.0. Do not report this historical tag mismatch as resolved.
- `MED-01`: 38 existing media assets were verified by CI build. Four provisional feet/fit, beat/bit sound clips remain **not in the release**, have no independent blind listening/rights/browser proof, and cannot count as scored hearing evidence. No change to their status.
- `AI-01`: safe opt-in source code/SSR tests passed; **live Gemini bilingual output, mobile readability and network error cases NOT TESTED**.
- `UX-01`: real desktop/mobile (including narrow viewport), keyboard and fresh reload tests **NOT TESTED**.
- `OFF-01`: static build and simulated browser-local **localStorage** tests do not prove offline app availability. NotebookLM's mention of `IndexedDB` is not evidence of an existing IndexedDB path; implementation currently uses localStorage. Do not advertise 100% offline.
- `REL-01`: **NO-GO** until applicable academic corrections are reconciled, real learner browser QA and rights/AI gates are assessed, and the owner separately authorizes release.

## Invariants and next gate

- No curriculum JSON, item tag, score, source audio, Firebase target or learner data modified in this reconciliation.
- PR #72 must remain Draft; technical QA (including actual static build) is a separate gate from academic release.
- **NEXT_GATE:** run a realistic local preview/browser QA on desktop, narrow viewport and keyboard for Speaking collapse, incorrect-answer feedback, listening option order persistence, AI response quality/unavailable fallback, and localStorage resilience. Test offline claims only if app is designed to support them; absence of a tested offline mode must be disclosed.
- Do not deploy production or merge this Draft solely because regression QA is green.
