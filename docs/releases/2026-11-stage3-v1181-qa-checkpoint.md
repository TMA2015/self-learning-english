# SLE Stage 3 v1.18.1 — technical QA checkpoint

**Date:** 2026-11-03
**Target:** [PR #72](https://github.com/TMA2015/self-learning-english/pull/72)
**Base:** `release/nov2026-content-v1.18.0` (draft release branch)
**Status:** TECHNICAL QA REQUESTED; academic/runtime acceptance remains independent.

## Gate design

- Automatically execute the secretless public Pull Request QA workflow on the current Stage 3 source commit, targeting the approved release branch.
- Validate workflow policy, frozen package versions, full existing release QA, TypeScript and static build when the source tree is complete.
- **No Firebase deployment**, no production credential, no learner-data writes and no course import.
- A PASS validates that Stage 3 preserves the existing technical release baseline. It does **not** independently approve new teacher/coaching pedagogy, scoring semantics, academic content or live Gemini behavior.
- A FAIL requires diagnosis of the first failing step against this exact commit before any rerun; do not bypass or weaken academic and privacy gates.

## Release decisions remain separate

The v1.18.0 source [PR #67](https://github.com/TMA2015/self-learning-english/pull/67) and Stage 3 v1.18.1 [PR #72](https://github.com/TMA2015/self-learning-english/pull/72) stay Draft. No promotion, merge or Firebase LIVE deploy is authorized by this checkpoint.
