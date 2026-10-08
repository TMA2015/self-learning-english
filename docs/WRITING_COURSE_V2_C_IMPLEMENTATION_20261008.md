# WCV2-C implementation — Weeks 7–12

Starting checkpoint: `0bfcfe7be7fb3af6c0469ae8fc52a7c3a318eedb`.
Base application: owner-QA-passed WCV2-B `9a99f73eda9102fd69caa5b0fee869a012975175`.
Source of truth: `docs/WRITING_COURSE_V2_C_RECONCILED_20261008.md`, with NotebookLM reconciliation and handoff. No unreconciled design is used.

## Published course flows

Writing → English Writing Coach · 12 Weeks → Week. Weeks 7–11 have Learn, four fixed-context Guided Practice items with one retry, Main Practice, structural Feedback & Revision, and Review. Week 12 replaces scored Guided Practice with an optional unscored scratchpad and permits direct Main Practice entry.

- Week 7: paragraph roles and annotated reading-corner pieces; optional collapsed plan and Optional Wrap-Up. Completion requires a draft and learner confirmation, never a closing sentence or planning field. Fixed sentence-order practice uses a separate library task.
- Week 8: reader signals, paragraph jobs, optional However, and an optional role reminder; no outline. Fixed paragraph-order practice uses a separate library-guide task.
- Week 9: four reviewed objective mechanics items; immutable source copy from saved learner-owned Week 7/8 work, four self-check toggles and a valid Checked, no change needed outcome.
- Week 10: editing versus revision, Task/Ideas/Sentences/Words lenses, immutable source copy from saved learner-owned Week 8/9 work, a revision goal and change note. Surface comparisons never label a revision better.
- Week 11: 100–140-word / 2–3-paragraph guidance; optional collapsed process checklist, no mandatory plan or prefilled starters. Readiness items use a different welcoming-new-students task.
- Week 12: two prompt choices, 120–150-word guidance, no mandatory structure, starters or scratchpad; three independent-learning reflections.

All word/sentence/paragraph targets are guidance, not proficiency thresholds. Main Practice completion checks required presence and learner-owned self-checks, not semantic quality. Weeks 9/10 additionally require their explicit source/checklist or goal/note; no visible edit is forced.

## Data and evidence boundaries

New additive learner state: `writingCourseV2C.weeks`. Existing Week 1, Weeks 2–6, Foundation attempts, course selection and global evidence are not reconstructed or regraded. The existing repository saves the additive object; no migration or new storage service is introduced.

Sources are copied by value from saved history. Editing updates only the working fields; completed snapshots append to local history with independent fields/source copies. Repeat-saving the same completed signature is idempotent. No source-replacement action overwrites an already captured working copy.

Weeks 9/10 always offer two fallback choices: a learner-authored 40–60-word paragraph or a one-click fixed Sample Student Draft for a separate relative-visit prompt. Sample-based work is explicitly labelled `Sample Student Draft — practice text, not your own writing`, has sample ownership in every snapshot and is excluded from learner-owned cross-week source selection/model unlocking. It may complete the practice activity but is never presented as learner-authored portfolio writing.

Objective records use content version `wcv2-c.1`, kind practice, evidence weight 1 and proficiency weight 0. Practice summaries count answer attempts, with stable record-ID deduplication and week/version filtering. These records do not call CEFR inference. Free-form snapshots use progress, evidence weight 0, proficiency weight 0 and provisional true. Week 12 scratchpad generates no scored ledger record.

## Feedback and model safety

Guided Check (Basic Structure) keeps the explicit full-meaning/grammar limitation. It reports presence, approximate words/sentence parts/paragraphs, visible capitals/punctuation, listed connector presence and approximate changed word positions. Counts and surface markers never assert relevance, coherence, grammar correctness, improvement, argument quality, paragraph quality or CEFR.

Model reveal requires a completed learner-owned saved signature, Review screen and an explicit Compare with a model click. Every Weeks 7–12 model carries exactly `One Possible Sample Response (Not the Only Way)`. Samples are not rendered in active screens; edits invalidate completion and reveal. Week 12 reveals the sample corresponding to the deliberately selected prompt. Sample Student Draft practice cannot unlock a learner-owned model comparison.

## Navigation and regression compatibility

All later week screen changes first confirm the latest dirty snapshot and then use the existing serialized navigation gate. Course-return and Foundation navigation use the same guard. Failed saves prevent departure and offer Retry save. The Week 1 Main Practice back-label now also includes `· 12 Weeks`; its guarded destination is unchanged. About/Foundations retain Back to Writing.

WCV2-B tests retain all content/persistence/model/navigation/evidence assertions. One availability-copy assertion is updated because Weeks 7–12 are now published; standalone B-only cards still preserve their previous preview behavior when no later-week callback is supplied. P1 course-level legacy Week 1 progress remains explicitly labelled; later-week saved progress is shown on individual cards, not substituted for proficiency.

## Local QA / owner handoff

Run frozen pnpm install; focused C/B/A; qa:core; qa:full; qa:release. The focused C suite tests 39 cases including source immutability, ownership, reload/history, retry denominators, model locks, prompt choice, optional Week 12 entry/completion and save failures/rapid navigation. Release gate includes TypeScript, static Firebase build and static/security QA. All AI fixtures are deterministic mocks; no real AI request is required or permitted.

Owner browser QA after a separately authorized preview:

1. On desktop/mobile, open all twelve course cards and confirm hierarchy/back labels.
2. Week 7: omit optional plan/wrap-up; save an own draft; complete Guided Practice and Review.
3. Week 8: use two paragraph jobs without However; confirm counts are guidance.
4. Week 9: copy a saved Week 7/8 draft; select all checks and Checked, no change needed; ensure original unchanged.
5. Week 10: copy learner-owned Week 8/9 work; save goal/change note and revision; inspect source plus before/after history.
6. Separately test each short fallback and Sample Student Draft path; verify sample ownership label and exclusion from learner-owned sources/model unlock.
7. Week 11: write without opening the optional checklist.
8. Week 12: go directly to Main Practice, choose A/B, leave scratchpad empty and finish Review; sample matches chosen prompt.
9. Before completion/in active screens no model appears. After a saved own attempt, reveal only by explicit Review click; edit to relock.
10. Type unsaved work then change screen/return to course; reload and inspect all draft/history state. Simulate storage-save failure only with safe local test storage; departure must be blocked with work retained.
11. Regression-smoke Week 1 four analysis fields, explicit Continue feedback, Weeks 2–6, independent Foundation content, saved course selection and G3-E mocked fallback. Do not send a real AI request during this QA task.

No GitHub Actions, preview/live deployment, PR merge, Firebase/App Check/Fraud Defense/Remote Config/model/billing change, learner-data migration or production data operation is authorized in this implementation run. Browser QA remains owner-pending; SSR/local fixtures are not authenticated browser QA.
