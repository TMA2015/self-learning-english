# G Learning · Learner Action & Feedback Standard v1

**Owner-approved product principle:** Learners should never have to guess why an action cannot proceed or what to do next. Preserve Self-Learning English's own teaching method and academic progression; this standard is presentation/feedback guidance, not a replacement curriculum or an AI Curriculum Builder.

## Universal learner-facing contract

Every actionable learning screen communicates, in ordinary age-appropriate English and optional Vietnamese help:

1. **Goal and instruction:** what to do, expected answer format (choose one / missing phrase / short response / adult-reviewed task), any time or word-count guidance, and whether audio/recording is required.
2. **Progress and prerequisites:** completed vs remaining items; when multiple independent conditions apply, display each separately (e.g. Listening answers 5/5 **and** verified audio for this attempt). Only say "ready" when all actual gates are satisfied.
3. **Next action:** label controls with verbs and meaningful outcomes (Play full audio, Answer question 3, Save draft, Submit, Retry save, Resume draft). No silently disabled primary action: explain blockers adjacent to it; provide a reachable route to resolve the blocker. For irreversible/important submission, allow an explicit feedback click when safe.
4. **Feedback and data safety:** unsaved → saving → saved / failed + retry; submitting → submitted / failed with reason. Do not claim persistence until the server confirms it. On failure keep learner's work, focus the relevant control, never silently discard or double-submit.
5. **Result and learning meaning:** show objective scores and explanations separately from responses awaiting adult review. A practice score or lesson completion is not a certified CEFR level. Unavailable real audio cannot generate Listening/Speaking/Pronunciation evidence.
6. **Accessibility and mobile:** place message at the action point as well as a global summary when useful; use visible text, role=status or role=alert, focus/scroll target, readable mobile spacing; do not rely solely on color or transient toast. A message must be accurate after switching lessons/attempts and after page refresh.

## Module audit and incremental application

| Area | Essential conditions and next-step message | Priority and release guard |
|---|---|---|
| Grammar | Required answer format, unanswered count, correction/explanation, next practice. | Implement shared Foundation completeness feedback; do not alter keys. |
| Vocabulary | Choice vs missing phrase, progress, meaningful feedback and next topic. | Reuse the same completeness component and tested answer normalization. |
| Reading | Passage/answer navigation, unanswered count, correct evidence explanation; draft return. | Reuse shared component; preserve original passage and scoring. |
| Writing | Prompt, idea/outline/revision steps, saved-draft confirmation; submitted open response = pending adult review, not an automatic score. | Preserve v15 Writing navigation and review-required rubric. |
| Listening | **Separate** answer completion from verified full playback *per attempt*; clear missing-answer/audio guidance; unavailable audio = unassessed. | PR #16 focused UX fix; backend playback proof unchanged. |
| Speaking | State recording permission/format, whether a saved recording exists, retry path and adult evaluation required; a planning note is not speaking evidence. | Audit before adding recording UX; never infer score from text alone. |
| Pronunciation | Distinguish sound-symbol awareness vs actual spoken audio; permission and adult review requirements. | No imaginary audio model, automatic pronunciation rating or CEFR award. |

The module audit is a **backlog and release acceptance checklist**. It does not mean all workflows have been fully implemented or browser-tested. The already shared Foundation player should receive reusable feedback in small, separately testable changes; do not mass-edit all modules during Listening hotfix or delay curriculum 1.3.0.

## Reusable UI state vocabulary

- `not_started`: what the learner should start.
- `in_progress`: answered N/total, unsaved/saving/saved status.
- `blocked`: explicit condition, remaining count, what to do, target/focus (e.g. answer question 3; play verified audio).
- `ready`: **all** current attempt prerequisites satisfied, not merely one.
- `submitting`: disabled while active to prevent duplicate writes, with clear progress.
- `submitted_scored` / `pending_review` / `unassessed`: explicit result type and next action.
- `failed`: concrete recovery action, untouched existing work and retry.

Backend validation remains the authority. The UI mirrors it; the UI must never relax authentication, scoring, playback duration, review permissions, learner-data integrity, or import policy.

## Acceptance tests for every new or revised module

A. Attempt submission with zero, one and multiple blank answers; error appears next to the action, identifies a resolvable question, does not issue a score.
B. Complete all required answers; status changes to ready only if any other prerequisites are also satisfied.
C. Force a recoverable save or submit error; no false saved/success label; retry without losing work.
D. Reopen and retake; new attempt begins with its own requirements, old submitted result remains read-only and visible.
E. Check iPhone-width and desktop keyboard/scroll/focus, Vietnamese-help toggle, screen-reader status, and authenticated learner context.
F. For audio and open responses, verify no evidence/CEFR claim without actual authorized evidence.

## Implementation plan (non-blocking)

1. Finish and owner-QA Listening dual-condition feedback on the EXISTING private Site. Confirm original playback is untouched.
2. Record this contract in future UI/review prompts. On the next normal Foundation UX sprint, generalize the existing incomplete-answer feedback for Grammar, Vocabulary, Reading, Writing, Speaking and Pronunciation, carefully accommodating recorded audio as a valid open response.
3. Review remaining Dashboard, Catalog, lesson overview and Parent View operations during their natural feature sprints, not as a sweeping rewrite. Prioritize any actual user-blocking ambiguity.
4. Resume independent academic 1.3.0 release procedure only after the Listening patch is accepted; keep Curriculum Blueprint PR #13 deferred and out of scope.

**No production deployment, curriculum import, D1 migration/reset or user-record mutation is implied by this document.**
