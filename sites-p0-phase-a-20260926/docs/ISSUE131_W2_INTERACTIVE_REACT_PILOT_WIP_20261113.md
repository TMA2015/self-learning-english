# Issue #131 — Writing Coach Week 2 interactive pilot (Draft WIP)

Status: implementation branch; NOT MERGED; NOT DEPLOYED; release NO_GO.

## Academic provenance

- Source: `SLE-LEF-V1-W2-INTERACTIVE-PILOT-R2-20261113`, NotebookLM academic PASS; required corrections: [].
- Normative source of truth: `SLE-MASTER-001 v1.2.0` on main.
- Base main: `4e727310cecd2ae5107134f08a804f64c10c42db`.
- Independent from Issue #131 Unit-10 Draft PR #152.

## Implemented in this branch

- Week 2-specific static teaching and independent *neighbourhood park* worked demonstration (never used as graded item).
- Optional `community art exhibition` four-card conceptual sorting, unscored; displays reviewed explanations on request.
- Idea-card add/edit/remove/reorder using original canonical `WeekWork.fields.ideas`, with an accessible button-only alternative to drag-and-drop. Old drafts with blanks, indentation or CRLF remain in the original textarea, without silent conversion. New cards can be appended without rewriting old bytes.
- Explicit selection of one idea via original `WeekWork.fields.best` and learner-controlled explanation/rejection using original fields `reject` and `fit`.
- Session-only learner-chosen provisional labels (`Promising`, `Needs explanation`, `Maybe off topic`), a live text-based idea map reflecting canonical notes, and deterministic process hints (not semantic grading). Tags are honestly disclosed as not saved.
- Version comparison identifies which canonical text fields have changed, without awarding quality scores.
- Save/history is **only** existing `WeekWork` and `home-client` actions, not a second storage ledger. A new draft edit invalidates the submitted-current signature as before.
- Original `WCV2-W2-G1..G4`, options, correct answers, retry logic, scoring, and all Weeks 3–12 remain as originally defined.
- Read-only side-by-side display of prior saved Week 2 submissions. Optional unsaved/unscored Saturday community-centre transfer scratchpad.
- Week 2 AI draft review is not invoked by the new renderer. Existing Weeks 3–6 behavior was not edited.
- A pure idea-card helper module and synthetic contract test, registered in the regular full QA list.
- No curriculum, audio/media, scoring, auth, security rules, Firebase, learner record or production change.

## Known limitations / future refinements

- Card status tagging is available in **authored optional Guided sorting** and as learner-selected provisional tags in Main Practice. The Main Practice tags are session-only and are not persisted. No second hidden storage format was invented.
- The live idea map is a semantic text view generated from saved fields, not a freehand canvas.
- Rich freehand mind map, pointer drag, persistent vocabulary scratchpad and active Gemini semantic review are **not yet** part of this code.
- Optional transfer scratchpad is intentionally labeled unsaved, with no proficiency score.
- This is a lightweight first iteration, **not** an assertion of measured learning outcomes.

## Acceptance and QA status

| Evidence | Status |
| --- | --- |
| Direct source inspection / change isolation | PARTIAL; connector patch and semantic code review |
| Synthetic helper checks during authoring | 7 simple design checks observed; full repo test NOT TESTED |
| New `tests/writing-week2-interactive.cjs` | Authored and registered in full QA. Initial PR-head QA passed on earlier commit `a96f337...`; exact latest HEAD requires a fresh run. |
| Existing Writing Weeks 2–12 regressions | NOT TESTED |
| TypeScript, build, full test suite | NOT TESTED |
| Exact HEAD GitHub Actions `qa` | PENDING fresh final-head execution. Previous commit `a96f337...` successful, but never substitute old SHA for current SHA. |
| Browser at 320px / iPad / keyboard navigation | NOT TESTED |
| Persistence/reload and historical version browser tests | NOT TESTED |
| Real Gemini data transmission checks | New components have no fetch/provider calls; end-to-end NOT TESTED |
| Production acceptance | NO_GO |

Do not merge until required checks PASS on final HEAD, review of real browser behavior, and explicit owner approval. Do not change or merge Draft PR #152 as part of this pilot.
