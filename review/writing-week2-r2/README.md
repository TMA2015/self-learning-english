# SLE Writing Week 2 · Visual UX Prototype R2 (Review Only)

**Status:** isolated, unsaved browser demonstration. **Not released to SLE, not an academic R2 approval, and not a replacement for R1 PR #153.**

## What to try

- **Tab 2 — Sort Ideas:** tap a card then choose Fits, Needs explanation or Off topic. On desktop, grab the ⠿ handle and drag into a destination. On iPad, tap/tap is the reliable fallback. Move the cards between columns, reset, then compare explanations after all four are sorted.
- **Tab 3 — My Idea Board:** tap the task root to add an activity. Tap any idea to edit it, then add a *Reason*, *Example*, *Vocabulary* or *Sub-idea*. Mark the best idea, set one aside, remove branches and zoom the canvas.
- **Desktop:** canvas with an editing inspector on the right. **iPad/tablet:** tap a node to open a bottom editing panel, which can be closed without losing the diagram.
- **Tab 1, 4, 5:** use the academically approved R1 content to see how the two R2 interactions fit into the original five-stage learning process.

## Important boundaries

This static HTML is generated from React source in independent [Draft PR #155](https://github.com/TMA2015/self-learning-english/pull/155). It is an isolated preview, not an SLE account session. Refreshing resets all ideas. No Firebase, Gemini, account sign-in, real learner data, CEFR grading or cloud persistence is present. The HTML includes a CSP with `connect-src 'none'`, and the external preview service only displays the static file.

The R2 branching map is a **new draft UI state**, and cannot be stored losslessly in the four canonical Week 2 fields `ideas/reject/best/fit`. A read-only projection is shown for transparency; nested branch and vocabulary storage requires a future explicit design review. Never copy raw node JSON into legacy fields.

## Owner review checklist

1. **Desktop:** Does pointer dragging place the right idea in the right category, and can you correct a placement easily?
2. **iPad Safari:** Can you tap a card and then a category without accidental scrolling? Does attempting a handle drag work naturally?
3. **Mind Map:** Can you add an idea from the task root, then add a child reason and a vocabulary keyword without scrolling away to a detached form?
4. Can you edit the text of an existing node, delete a branch safely, mark one idea best, and change it later?
5. Is the right-side inspector / bottom sheet easy to understand without guidance? Is the node map too busy on smaller screens?
6. Use portrait and landscape. Record any overflow, hidden buttons, unpredictable touch gestures and Safari version.

**Real authenticated save/resume is intentionally out of scope.** R2 academic/pedagogical differences should be reviewed by NotebookLM after owner usability feedback. PR #155 and PR #153 must remain Draft; do not merge or deploy without separate authorization.
