# WCV2-B — implementation and local QA record

Starting branch: `writing-course-v2-b-20261007`  
Starting checkpoint: `d32b4fb1fdbdb7aa2ec1a61875c59b3c05dc8861`  
Stacked PR base: `writing-course-v2-a-20261006` (owner-approved WCV2-A)

## Source and scope

Implemented from `WRITING_COURSE_V2_B_RECONCILED_20261007.md`, its NotebookLM reconciliation and handoff. Weeks 2–6 only. Weeks 7–12 remain previews. Week 1 four-field analysis, hidden legacy `offtopic`, step feedback and explicit model-review gate remain unchanged apart from Back to Writing navigation.

## Teaching implementation

Each published week has Learn → Guided Practice → Main Practice → Feedback & Revision → Review, a Foundation link, optional contextual Vietnamese micro-gloss, saved learner reflections and explicit final model comparison.

- Week 2: lunchtime-club annotation, rainy-afternoon Off-Topic Spotter and four after-school planning fields. Only predetermined objective choices are judged on/off topic.
- Week 3: main idea, reason, and how/why it matters. The extra supporting note is optional.
- Week 4: reason plus one flexible supporting-evidence block; extra evidence and connection are optional. The particular life-skills prompt still asks for an example, so a self-check reminder asks for a specific situation in that support block. No separate Detail AND Example requirement.
- Week 5: because/so/but core practice. Although is Learn-only optional challenge, excluded from core scoring and completion. Sentence starters stay collapsed by default. Counts are guidance, not proficiency thresholds.
- Week 6: 3–7-word outline notes, fragment annotation, and a separate stack of the learner's own notes. No paragraph is generated and no fragment grammar is penalized.

Five separate scaffolding descriptions and field structures make support fade from generate/filter/select to compact outline notes.

## Persistence, evidence and help boundaries

`writingCourseV2B.weeks` is an additive local-state field. It does not replace Garden/Week 1 analysis, drafts, reviews, feedback, existing history, course selection or global evidence. No migration or backfill. Existing local state loading, serialized saving, autosave and route guard are reused.

Guided Practice contains 20 objective items, four per week, each with explanation and one retry. Saved records carry stable question/attempt IDs, `wcv2-b.1`, practice weight 1, proficiency weight 0 and the exact week-specific practice tag. All-attempt numerators/denominators appear in practice and Skill Map; retries count separately and duplicate record IDs do not inflate totals. This is a separate practice ledger, not CEFR evidence.

Main Practice stores progress-only snapshots, evidence/proficiency weight 0, provisional status and append-only own-work history. Earlier snapshots are not reconstructed or regraded. A learner self-check confirms the task has been reviewed; it is not an automatic semantic verdict. Optional fields and word-count guidance do not block completion. Week 5 requires the presence of a core Connecting Word, not a claim that it was used correctly.

Guided Check (Basic Structure) observes only populated required fields, counts, punctuation/capitalization and explicit core words. The full limitation is shown. It does not evaluate meaning, relevance, reason quality, grammar, coherence or proficiency. No AI request is wired into this block.

Models are rendered only on Review, after a completed own attempt was saved and an explicit Compare action. Editing clears completion/submission validity and the compare state. Active stages contain only teaching examples, short optional starters and the learner's own work.

Back to Writing uses the existing guarded navigation. Same-route week/screen changes additionally confirm the latest dirty snapshot before changing selection, so component reuse cannot bypass save-before-leave. Save failure preserves in-memory work and visibly offers retry.

The existing P1 course projection continues to describe legacy Week 1 process progress. Later-week completion is explicitly separate on course cards; no automatic enrollment, active-course change or proficiency claim is introduced. Availability copy in Writing/My Courses/course browsing reflects Weeks 1–6.

## Local QA

The focused suite covers content, objective answers/retries, optional requirements, zero-weight free-form work, final Review reveal, edit invalidation, saved history, local reload preservation, simulated storage failures and latest-snapshot/rapid navigation. It is included in both CI-free-first local QA modes. Existing WCV2-A, Writing navigation/save, P1/P2A, academic, Listening and G3-E tests remain in those modes.

Commands: frozen pnpm install; focused WCV2-B; `pnpm qa:core`; `pnpm qa:full`; `pnpm qa:release` (full suite, TypeScript, Firebase static build and security QA). Final local results: frozen install PASS; WCV2-B 35/35 PASS; WCV2-A 27/27 PASS; qa:core 17/17 commands PASS; qa:full 51/51 commands PASS; qa:release PASS including its repeat of the full 51-command suite, TypeScript, Firebase static production build and static/security QA. G3-E reliability and all preserved regression suites PASS. Only the existing non-blocking Vite chunk-size advisory was emitted.

## Owner browser QA — pending separate preview authorization

1. On desktop/mobile, open each Week 2–6 through the course cards. Check all five screens, Foundation links, optional Vietnamese help and Back to Writing.
2. Answer a guided item incorrectly, read its explanation, retry once, then reload. Confirm answer history and the correct/total denominator remain.
3. Enter your own Main Practice, leave and return, then reload. Confirm every field is restored and Week 1/Garden data remains intact.
4. Check Week 3 without the optional note; Week 4 without separate Detail/Example fields; Week 5 without although; Week 6 with fragments.
5. Save completed work; inspect structural feedback; open Review. Verify no model appears until Compare is explicitly clicked. Edit a required field and confirm comparison locks until a new completed attempt is saved.
6. Use browser-local test data only to simulate storage failure. Verify navigation is blocked, learner text stays visible and retry saves it. Do not overwrite an owner's real saved state.
7. Confirm Weeks 7–12 remain previews, existing Week 1 four-field/step-feedback behavior remains intact, and course selection does not change when browsing.

No Work browser QA, real AI request, Hosting preview/live deploy, Firebase/security/model/billing change, GitHub Actions or PR merge is authorized/performed in this implementation run.


## Owner browser QA navigation follow-up — 2026-10-07

Owner smoke-tested all ten requested WCV2-B areas and reported overall PASS/improvement, but identified a concrete navigation issue: lesson subpages returned to the broad Writing home instead of the English Writing Coach 12-week course overview.

Patch rule:
- About this course and Writing Foundations keep `← Back to Writing`.
- Week lesson subpages (Week 1 Learn/Guided/Review and Weeks 2–6 Learn/Guided/Main/Feedback/Review) use `← English Writing Coach · 12 Weeks`.
- Week 1 Main Practice uses the same course-back label.
- All navigation continues through the existing save-before-leave guard.

This is a UX-only routing/label correction. It does not alter academic content, evidence rules, AI, Firebase, learner-data schema, curriculum or Hosting configuration.
