# Reusable Reading EvidenceHighlighter — engineering pilot

**Date:** 2026-11-22  
**Status:** DRAFT / academic design review pending / engineering QA pending / NOT LIVE  
**Dependency:** PR #212 tested CardSortBoard + ResponsePlanner source; this follow-on PR is stacked on that reviewed draft. It is not a separate SLE workstream.

## What is implemented
- A reusable, **stateless** `EvidenceHighlighter` with native touch/keyboard sentence buttons. A learner selects a sentence from an **independent reviewed model** and presses Check to view a factual comparison; changing the selection hides earlier feedback.
- First lesson: `REA-B1-03` on the existing B1 school-garden demonstration in `rwg-depth-pilot-r1.json`. Prompt: “Which sentence introduces a limitation to the positive claim about school gardens?” Candidate answer: the second sentence starting “However, rainy days...”.
- The reviewed explanation is initially collapsed behind a `<details>` control so the answer is not displayed by default before the optional practice.
- Explicit version gate: current v1.28 lesson `REA-B1-03` is **strictly identical** to original reviewed v1.25 data; v1.28 fallback is limited to this Reading lesson, not Grammar/Writing or future versions.

## What does not change
- No scored Reading passage/question/key/feedback, existing 10 graded Reading exercises, source packages, audio, Firebase rules or learner state.
- No new CEFR/proficiency score, lesson attempt, AI call, network request, persistence, or drag-and-drop claim.
- No automatic grading of open-ended inference: the selected sentence is an **unscored model demonstration**, not evidence of certified B1 proficiency.
- No Math/Auth, v1.32 source package activation, merge or LIVE deploy.

## Testing
- Add source/version parity assertions for reviewed v1.25 vs bundled v1.28.
- Extend real Chromium Reading pilot: checked/unchecked choice transitions, exact model sentences, absence of scored passage, small layouts, and forward-version guard (1.29 remains unavailable).
- Keep full SLE release QA and build. QA success on PR #212 is historical and does not certify this follow-on source until its own exact-head QA passes.

## Academic gate
A new learner-facing interaction has new prompt and feedback wording. **Independent NotebookLM review is therefore required** under SLE-MASTER-001 before adoption. The portable single-file packet `SLE_READING_EVIDENCE_HIGHLIGHTER_REVIEW_R1_20261122.md` was prepared outside GitHub with exact model, S1/S2/S3, candidate key, proposed feedback, eight questions and required verdict. NotebookLM verdict NOT YET RECEIVED; technical CI is independent and cannot approve content.

## Future cross-skill use
After academic review and real iPad acceptance, reuse EvidenceHighlighter for B2 Reading with an independent approved source passage and source-specific spans. No blind migration of historical graded passages or keys.
