# Issue #131 · Writing Week 2 Visual UX Prototype R2 (DRAFT)

**Status:** UX CONCEPT IMPLEMENTED ON ISOLATED BRANCH; no academic R2 approval, production changes or storage migration.  
**Baseline:** PR #153 R1 exact tested HEAD `00b6cd39e4d96e620602fe79ab131f7168c2c186` — Academic PASS, technical QA PASS.  
**Governing authority:** `SLE-MASTER-001 v1.2.0`, permanently subordinate. **Do not treat this document as a new normative standard.**

## Objective / rationale

Owner's direct feedback on desktop preview: the staged pedagogical path is useful, but drop-down sorting is cumbersome and the previous idea-map is display-only and separated vertically from editing. The R2 prototype aims to make learning by *manipulating and expanding ideas* natural for children without changing the academic progression.

## 1. Guided Sort Ideas — spatial card classification

- Keep the same **independent community-art-exhibition practice** and the four ungraded idea cards.
- Place cards in **Fits**, **Needs explanation**, **Off topic** using pointer drag from a clearly labelled grip, or **tap card → tap destination**. Keyboard focus and Enter/Space can select a card. Cards can be returned and reclassified.
- Explanations unlock only when all four cards are placed; learners may change decisions. Offer **one defensible reading + why**, never claim to grade free-form reasoning.
- The existing recycling-team **repair bridge** remains below this activity in the preview.
- Source: `app/writing-week2-r2-sort.tsx`. No drag/drop package or paid service.

## 2. Main Practice — edit the concept map in place

- The writing task is a selectable root node. **Add Idea** creates top-level activity branches.
- Selecting a branch opens an inspector to **edit**, **add a sub-idea**, **add a reason**, **add an example**, **add vocabulary**, **choose best**, **set aside** or **delete branch**. Child nodes can be expanded to a controlled depth.
- Layout is automatic, with visible parent/child connectors and zoom. No manual positioning burden for the student.
- Desktop: scrolling, zoomable canvas + right-side editing inspector. Tablet/phone: full-width canvas + on-demand bottom editing sheet. No need to scroll between remote text entry fields and a detached map.
- Example branch data is synthetic and editable; no AI-generations or model grading.
- Source: `app/writing-week2-r2-mind.tsx`, styles in `app/writing-week2-r2-visual.css`.

## 3. Storage safety (R2 prototype deliberately UNSAVED)

Original Week 2 storage remains **only** `ideas/reject/best/fit` with existing history and assessment semantics. R2 mind map holds hierarchical data **only in React component state**; a read-only projection shows how top-level ideas, one selected idea and one first-level reason *could* correspond to existing canonical fields. It **does not write these fields** or persist child nodes/keywords.

Adding durable multi-level nodes requires a **separate technical schema proposal** (stable node IDs, validation, version migration, recovery, integrity, undo/redo and compatibility with old drafts). This needs a future explicit review/approval and independent academic review where the learning experience materially changes. Do not store raw nested JSON inside `ideas` or change `WeekWork` behind the owner's back.

No Firebase/production writes, storage APIs, Gemini calls, uploads, real learner accounts, proficiency metrics or grading.

## 4. Acceptance matrix

- UX-SORT-01: mouse/pointer drag card to a category and reclassify.
- UX-SORT-02: iPad tap card then category, including a return to unsorted.
- UX-SORT-03: keyboard focus and Enter/Space selection; authored explanations gated by completion.
- UX-MAP-01: tap task → add idea; tap idea → add a nested reason/keyword/example/sub-idea.
- UX-MAP-02: edit/delete/re-parent safety (deletion includes children), select/reject mutually exclusive.
- UX-MAP-03: desktop inspector and iPad bottom sheet keep canvas and editing together.
- UX-MAP-04: current canonical data is not mutated, including complex legacy notes.
- QA-01: exact HEAD TypeScript, build, synthetic Chromium and full regression.
- EDU-R2: independent NotebookLM scope review **after owner UX feedback**, not inherited from Academic R1 PASS.
- REL-01: owner approval, real Safari acceptance and authenticated save/resume under an authorized protocol before any release.

## Source routing

Only one temporary R2 design packet should be selected in NotebookLM when academic review becomes necessary; retain permanent project sources, remove superseded temporary packets and use a short review prompt as directed by `NOTEBOOKLM_REVIEW_WORKFLOW_RULES_v1.0`.

## Release boundary

This is a **standalone UX experiment**, not an approved R2 learning release. It is not wired into the main SLE app, not merged into PR #153, and not deployed. **NO_GO** for production.
