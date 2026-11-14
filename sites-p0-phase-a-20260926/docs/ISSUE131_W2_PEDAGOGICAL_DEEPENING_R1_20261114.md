# Issue #131 — Writing Week 2 pedagogical deepening R1

**Status:** IMPLEMENTATION CANDIDATE / DRAFT ONLY. New academic wording and sequencing require an independent NotebookLM delta review before release. No production approval.

**Authority:** SLE-MASTER-001 v1.2.0 on `main` is the sole normative policy. LEF R2 NotebookLM academic PASS established the prior design, not an automatic approval for subsequent material changes. This R1 is a scoped delta, not a new standard or curriculum import.

## Purpose

Transform five existing stages into a connected path in which the learner does the thinking: **Understand → Predict & explain → Recognize & repair → Generate and choose → Reflect & revise → Transfer independently**.

## Concrete incremental content

1. **Learn:** Preserve existing theory and independent park example. Add a separate 15-minute science-museum challenge: learner chooses between a hands-on magnet experiment and changing the entrance sign; must explain reasoning **before** the reviewed comparison becomes visible. This is unscored and unsaved.
2. **Guided Practice:** Keep the original `WCV2-W2-G1..G4` four objective items, keys and retry/evidence paths unchanged, plus existing optional art-exhibition sorting. Add a **separate unscored repair bridge**: a recycling team's ten-minute visitor activity; learners repair “Buy more recycling bins” into an actual activity and explain its fit before unlocking one possible worked repair. Optional hint is non-answer guidance.
3. **Main Practice:** Bring the interactive visual idea map **above** the idea cards so learners can inspect their task/idea relationships while generating, not only after writing. The same four fields `ideas/reject/best/fit` remain canonical. Card labels are session-only. No new database, evidence record or scoring.
4. **Feedback & Revision:** Keep conservative structural presence checks. Add **manual** learner self-judgements on task fit, alternatives, rejection/repair and explanation. Learner selects a revision focus and acts in the existing text fields; ratings and intention are explicitly unsaved and never treated as proficiency evidence.
5. **Compare:** Display actual previous saved versions read-only. With fewer than two saved submissions, honestly prompt another revision rather than fabricating a comparison. With two or more, show exactly which fields changed and invite the learner to explain whether/why the change improved the task fit. Reflection is optional, unsaved and ungraded.
6. **Transfer:** The fresh Saturday newcomers activity is attempted **before** revealing optional process reminders. A manual checklist tracks the learner's own reasoning without certification. Optional transfer text is unsaved and carries no proficiency score.

## Teaching principles

- All task-specific examples remain independent from the original rainy-afternoon MCQs, original after-school Main Practice and park demonstration.
- No minimum number of ideas, duration or compulsory remedial gate; the learner may navigate the five existing stages.
- One worked example or hint is only revealed after a learner attempt where appropriate; model text is not a canonical answer for Main Practice.
- Deterministic code reports content presence or displays authored explanation, **never semantic mastery or CEFR grades**.
- Gemini provider activation and transmission of new learner-authored Week 2 data remain disabled.
- No changes to Weeks 3–12, `domain/writing-course-v2-b.ts`, canonical question IDs/answers, data format, Firebase, 44 MP3 or the curriculum v1.25.0.

## Implementation refinement

Week 2's previously authored lunchtime-club examples are retained inside an optional expandable section, reducing mandatory reading length on narrow screens. The original five stage buttons remain unchanged. The comparison view defaults to the latest two saved attempts when history becomes available, and a single saved attempt is never presented as a two-version comparison.

## Technical evidence to collect on exact HEAD

- Typescript/static build, existing full `qa:full`, original Writing Weeks 2–12 regression.
- Synthetic native Chromium: predict answer locked until learner explanation, correction model locked until two attempt fields, revision self-check remains outside canonical state, transfer hints locked before independent attempt, history comparison read-only, legacy notes preserved, idea-map selection, true-viewport 320px touch and 768px Enter.
- Existing `BrowserLocalLearningRepository` synthetic round-trip preserves submissions/history; no production or real learner data written.
- iPad Safari, authenticated site save/resume, measured educational outcomes: NOT TESTED by this PR.

## Academic review handoff

Use the dedicated NotebookLM English project, with permanent sources retained and obsolete temporary packets removed. Review only the pedagogical R1 delta and its fit with the prior R2 academic PASS and SLE-MASTER-001. Verify the six changes above, question/answer leakage, calibration, scaffolding and evidence wording. Mandatory corrections must be reconciled **before merge/deploy**.

**Release decision:** NO_GO until academic delta PASS, exact HEAD QA PASS, mobile/real browser acceptance as necessary and explicit owner approval. PR #152 remains isolated.
