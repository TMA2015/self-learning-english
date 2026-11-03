# Listening Retake — truthful answer and audio guidance

**Owner's confirmed iPhone finding (2026-09-27):** The first Listening incomplete-answer hotfix works: missing-answer warning/focus, score after all answers, drafts and history are retained. The owner then identified the apparent Retake issue: they had intentionally tested the missing-answer flow without replaying the audio. On listening to the full audio for the new attempt, Submit worked. **There is no confirmed retake/scoring defect.**

**Actual source UX problem:** “All questions answered. Submit when you are ready” only tested answer completeness. The button independently remained disabled until `attempt.playbackCompleted` for the *current attempt*, without explaining that condition beside Submit. Valid safeguards looked like a broken button.

**Scoped code-only fix:**
- Treat answer count and full audio verification as separate conditions. Display both beside the action. Only state “Ready to submit this attempt” when both are met.
- If the player is otherwise idle, allow Submit to be clicked. Missing answers show the existing focused unanswered-question guidance. Unverified playback shows “Play the full audio for this attempt” next to Submit and scrolls to the audio controls. No scored API call occurs under either missing condition.
- Starting Retake clears old action warnings and uses the existing fresh attempt returned from the server; do **not** carry over prior playback or score.
- If audio fails verification, show a local actionable message as well as the existing global error.
- Retain the **existing** client playback implementation, server playback proof, server-side completeness enforcement and scoring. No audio replacement or changes to saved attempts.

**CI vs live:** pure helper checks, restored v16 incomplete-submit tests, player/legacy navigation/Writing tests and production build. Source tests cannot replace authenticated iPhone Safari playback QA.

**Release boundary:** Draft PR #16 is stacked on GitHub checkpoint `75a45e069a41e4297268b1e64746259388ea3a98`, deployed v16.1 as Sites source `c33252322ab03a83cd2e43dc41c1eb6d2ca503bd`. No deployment, curriculum import/preview, D1 write/migration/reset or learner-data change has been authorized by staging. Keep production curriculum 1.2.0 and its digest `e88162ef5c872e574a2ca0668745f48b7679294dcc0c64f1729bb9f10b2c5873`.

**Post-release owner QA:** independently retake A2 and B1: fill answers without listening -> action explains full audio requirement; play complete audio for that attempt -> status verifies full playback; submit -> new score; earlier attempt remains read-only in history. Also retest missing answer and audio interruption. If no regressions, resume independent approved 1.3.0 Preview Import (not bundled with this patch).

**General product design rule:** `docs/LEARNER_ACTION_FEEDBACK_STANDARD.md` defines reusable actionable feedback principles for every skill without introducing a mass UI rewrite in this hotfix.
