# Issue #131 · Writing Course Week 2 Simplification (ISOLATED DRAFT)

**Status:** code candidate only; **NOT merged, deployed, or release-approved**.  
**Product decision:** Keep the 12-week Writing Course as a guided lesson sequence; develop Writing Lab / Idea Explorer separately as an optional reusable practice tool.  
**Academic review:** NotebookLM packet `SLE-W2-COURSE-SIMPLIFY-R0-20261115` returned **PASS**, 0 mandatory corrections (owner-supplied verdict, 2026-11-15).  
**Normative authority:** `SLE-MASTER-001 v1.2.0` on `main` governs.  
**Prior references:** Draft PR #153 (R1 learning prototype / academic + technical PASS); Draft PR #155 (R2 visual UX experiment); neither is merged into this branch.

## Implemented in this candidate

- Reuses the original Week 2 route screens `learn → guided → main → feedback → review`.
- A1–A4 lesson cards teach task analysis / raw generation / relevance filtering / reason + optional example via an independent neighbourhood-park prompt.
- A1 uses a four-part responsive prompt-analysis strip; raw candidate ideas have no instant correctness/strength labels.
- A3 reveals one defensible set of category explanations after a learner request. Natural A2–early B1 language only; no C1/C2 labels or unsupported numerical benefit claims.
- Optional science-museum prediction/why/reveal check is independent, unsaved, and unscored.
- Original **four canonical rainy-afternoon Guided Practice MCQs** and their keys/attempt behavior are unmodified. A short recycling-team repair bridge follows them; additional art-exhibition classification is collapsed and unscored.
- Main Practice offers four small instructions corresponding to existing `ideas/reject/best/fit` fields; no complex editable tree, zoom, tags, or AI drawer.
- Feedback has an unsaved learner-controlled self-check and keeps structural presence feedback honest. **Week 2 AI review is not rendered.**
- Optional independent community-centre transfer scratchpad in Review explicitly declares that its notes are temporary and not saved; no broken link to a not-yet-built Lab route.

## Unchanged boundaries

- `domain/writing-course-v2-b.ts` (Week 2 question IDs `WCV2-W2-G1..G4`, four fields, learner history, grades, retry/save/review contracts; Weeks 3–6).
- Weeks 3–12 of the course and other skills; imported curriculum v1.25.0; audio assets; auth/Firebase; learner records; existing website URL and branding.
- AI provider Gate #114 **remains OPEN**. No Gemini learner-authored payload or new external API calls. This PR does not claim existing deployed provider compliance.

## QA evidence status (do not inflate)

| Check | Status |
|---|---|
| Scoped new static integrity regression `tests/writing-week2-course-simplified.cjs` | Written and registered in full QA; execution pending |
| Existing full Writing test suite and full repo regression | Pending |
| TypeScript check, build, full QA against exact final HEAD | Pending |
| Native Chromium 320px and keyboard/touch | Pending |
| Actual iPad Safari | NOT TESTED |
| Authenticated preview save/resume; legacy multiline drafts | NOT TESTED |
| New course academic design | PASS (NotebookLM); not a technical pass |

The Course must remain usable and completable without the Writing Lab or AI. No Week 2 completion score is produced by unscored exercises or local checklists.

## Follow-up

1. Run exact-head TypeScript/build/QA and native browser tests on an isolated preview.
2. Check real legacy save/resume and history, 320px layout and iPad Safari.
3. Only after relevant QA, ask for **new owner approval** to merge/deploy.
4. Develop Writing Lab separately with `LabDraft` namespace, stable node IDs, local restore/recovery, accessibility, export and default-OFF external AI.


## R1 owner visual acceptance · 2026-11-15

**Academic delta verdict:** NotebookLM reviewed `SLE-W2-COURSE-OWNER-VISUAL-R1-20261115` and returned **PASS**, with **zero mandatory academic corrections** and `ACADEMIC_ADOPTION: GO` for isolated prototype implementation. This is not a technical or production release PASS.

Changes in the R1 code candidate:

- The Learn substeps A1–A4 share three stable cases: E1 Park, E2 Museum, E3 Library. At each step, the task, instruction, worked thinking and comparison are visually distinct. One example is primary; the other cases can be selected or compared on demand.
- Global `showVi` alone controls short secondary Vietnamese instructions. The separate Vietnamese disclosure is removed.
- The recurring extra science-museum exercise and obsolete lunchtime-club expander are removed. Museum is now one coherent worked case across all four moves.
- Guided Practice G1 (understand), G2 (own unsaved idea scratch), G3 (original exact four MCQs + retry) and G4 (brief own-choice/reason bridge) mirror Learn. Recycling repair is optional, only reveals a worked answer after the student attempts it. The art-exhibition sorting UI is not mandatory.
- Main Practice is visually **editable** with the canonical `ideas`, `reject`, `best`, `fit` fields, A1 read-only prompt and no new schema. Feedback is a **read-only** four-field summary, presence-only check, three manual self-review items and a clear `Edit my ideas` action.
- Review preserves original reflection and save/history/model gates. Transfer remains optional and explicitly unsaved. No fake Writing Lab link.
- Canonical domain source `domain/writing-course-v2-b.ts` remains untouched. Other weeks, imported curriculum and audio remain untouched.

**QA:** Updated both `tests/writing-week2-course-simplified.cjs` (contract/static guards) and `tests/writing-week2-preview-acceptance.cjs` (synthetic React interaction + storage adapter) to match R1, registered in existing full QA. Real Chrome/Safari preview and owner visual acceptance are **NOT TESTED** by these tests.

**Release:** Keep PR #158 DRAFT. Gate #114 still blocks all minor-authored upstream AI transmission. Require exact final-HEAD CI, real browser QA where possible and separate owner approval before merge/deployment.
