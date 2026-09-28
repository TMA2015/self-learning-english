# G Learning — Course Architecture v21 (design contract)
Status: architecture proposal for owner review; DOCUMENTATION ONLY. No production release, content import, learner migration, D1 operation or authentication change.
Prepared against GitHub PR #18 checkpoint 6da694b5223581e0bc81784defd16b714c58560f; the actual deployed Sites v20 source is 7ffc690ba63461322eff7d259b483531c224e053. GitHub branch != deployed Site. Reconcile any future code delta against the latter.

## 0. Baseline and vocabulary
- Accepted Curriculum 1.4.0: 45 Foundation lessons, 323 activities; canonical SHA256 70eb0d13477a647ae2ab0ca5b11bfd1f52a99772f1ca206d701718d08ffb56da.
- Existing English Writing Coach: 12-week outline, Week 1 full interactive practice, Weeks 2–12 presently previews. Retain old progress fields and written work; do not present previews as delivered teaching units.
- Batch05 +36 question proposal is REVIEW ONLY; not a source release and not a prerequisite for designing courses.
- Current domain/course.ts is a small portable vocabulary, not a full enrollment/active-course engine. app/page.tsx fixes sidebar YOUR JOURNEY to Writing week/stage. app/core-panels.tsx "Choose a course" is a link to Foundation and Writing, not course enrollment.
- There are seven content/skill domains (Grammar, Vocabulary, Reading, Listening, Writing, Speaking, Pronunciation); existing CEFR learner-model only represents six, with pronunciation evidence not equivalent to an assessed overall speaking level. Do not invent missing estimates.

Separate four concepts:
1. Content Library / Course Catalog: immutable, approved lesson/activity assets and their metadata. Browsing is not enrollment.
2. Course Template: author-curated or AI-composed syllabus of references to approved content. Its version and published scope are explicit.
3. Enrollment / My Courses: per-learner course instance with a frozen plan revision, lifecycle and selected active context.
4. Global Evidence / Skill Map: append-only account-scoped question attempts and approved reviews; the same attempt is never duplicated because it contributes to more than one course.

"Learning Plan" will become My Courses + Course Library + Create AI Course; AI recommendations remain a distinct Recommendations view/tab, not a fabricated course. "Course Catalog" still permits unstructured free practice.

## 1. Conceptual data contract
See docs/contracts/course-v1.schema.json. It is a portable design artifact, NOT an authorized API payload/importer or migration.

CourseTemplate:
- id, version, kind: predefined | ai_custom; title, description, target CEFR, covered domains, availability: preview | available.
- template units and source references; stable unit and item IDs, required/optional, estimated time, allowed order and prerequisites.
- source refs: foundation lesson/activity [contentId + immutable contentVersion + packageId/digest] or legacy Writing week/stage [stable adapter ref + writing-course revision]. Do not copy answer keys or raw lesson bodies into courses.
- A1/A2 templates may be published ONLY for academically supported portions; call a partial course "A1 Foundation — developing", not a fully certified CEFR A1 curriculum. One-week-complete Writing course must visibly distinguish 11 preview weeks.

CourseEnrollment (server-owned scope):
- unique enrollment ID, template id+version, kind, status: active | paused | completed | archived, created/last-engaged timestamps, planRevision, immutable item snapshot, optional course notes.
- Exactly one selected active enrollment per learner (selection record). "Continue learning" or "Set active" explicitly sets it. Merely viewing or clicking a free Catalog lesson must not hijack YOUR JOURNEY.
- At most TWO non-archived, non-completed ai_custom enrollments; predefined enrollments are independent. Paused custom courses still occupy a slot. Completing or archiving releases the slot.
- Archiving removes course from active list and selection if applicable, never deletes global attempts, writing submissions, reviews, Error Bank, skill evidence or past plans. No hard delete in the first release.
- Only server-authenticated principal selects scope: never trust ownerId in a client payload.

CourseItemRef:
- stable itemRefId and unitId; content type, content ID, exact source version, required/optional, order, skill and metadata. A course is a list of references, not a cloned question bank.
- Every saved attempt remains pinned to its source contentVersion. Historical attempts are not regraded when curriculum or course plan changes.
- One completed attempt may fulfill matching eligible references in multiple courses; it contributes to global Evidence exactly once.
- If an old attempt uses a different version, credit only explicitly certified equivalent item IDs, or display prior study separately. No silent cross-version reinterpretation.

CourseProgress (derived, never a replacement for source attempts):
- completedRequired / availableRequired, plus pendingReview and availableUnits/previewUnits; also separate uniqueQuestions and practiceAccuracy metrics.
- Objective task completion = saved submitted/scored result. Writing/open response = submitted progress with an Awaiting review state; it must not count as reviewed proficiency until approved. Legacy guided Writing stage completion means saved process stage, not graded writing.
- "100% available units" is not the same as complete full 12-week outline or CEFR proficiency. No fake progress for unpublished weeks.
- Freeze required denominator for a plan revision; new content enters recommendations/optional extension until learner approves an append-only revision. Revisions never rewrite completed tasks or destroy historic progress. A completed course stays completed after later expansions.
- A course may show completed available tasks and separately pending publication; do not promise an exact release date for preview weeks.

PlacementRecord for ai_custom:
- target CEFR and working/starting level, assessment blueprint/version, source evidence refs, assessed domain coverage, unassessed domain labels, completeness, explicit learner/parent confirmation, audit timestamps.
- A target level, a lesson's CEFR target, a provisional screening placement and formal CEFR certification are four different things.
- A level-specific, multi-domain assessment must actually run to its published blueprint. Until complete, show "Placement pending"; no ai_custom course creation. If Writing/audio/review unavailable, show the corresponding missing evidence; do not manufacture an overall level. Stage 1 may restrict custom generation to domains with adequate validated placement evidence.
- An explicit learner/parent-confirmed WORKING LEVEL for planning, with listed limitations, is required. This is not a credential.
- Allow a requested skill mix (e.g. Grammar 50, Vocabulary 20, Reading 30) only when weights total 100 and selected domains are eligible. Weights indicate planned time/activities, not percentage mastery or fabricated correctness.

Generated Course:
- AI selects ONLY published, approved, stable Content Library IDs/versions via a validated structured contract; includes prerequisites, realistic duration and rationale.
- Preview before enrollment; reject hallucinated/nonapproved refs and plans that skip compulsory foundations, omit targets, duplicate IDs or promise unavailable audio/Writing grading.
- One/two concurrent custom courses max. Explicit preview/confirm to create or revise. The learner can override proposed priorities within valid constraints.
- No AI-initiated silent change to active course, learner CEFR or evidence history.

## 2. Source updates
- Future approved curriculum updates create a non-mutating suggestion list by tags, CEFR target and prerequisites. Default policy: suggest and confirm.
- If learner explicitly enables automatic extension, append only eligible OPTIONAL material to an unstarted segment and notify; preserve original required denominator and completion event references. Do not reduce past completion percentage retrospectively.
- A user can accept a new plan revision; review the changes before acceptance, keep previous revision for inspection.
- This does not require auto-importing academic content. Parent Preview and separate owner Import approval remain mandatory. Batch05 1.5.0 is not yet approved.

## 3. Navigation and menu
- MY LEARNING: Dashboard, Diagnostic/Placement, Learner Profile, Learning Plan (My Courses / Course Library / Create AI Course / Recommendations), Skill Map, Course Catalog (free practice).
- SKILLS: Grammar, Vocabulary, Reading, Writing, Listening, Speaking, Pronunciation.
- No separate top-level "WRITING · 12 WEEKS" cluster; its Curriculum/Practice appears inside My Courses > English Writing Coach, while Writing skill remains independent.
- Sidebar YOUR JOURNEY and Dashboard hero derive ONLY from explicit activeEnrollmentId + progress. If none, show "Choose a course" state. If old Writing is the only active prior workflow, render a read-only compatibility view rather than wipe or invent an enrollment.
- "Continue" selects and enters a course; mere browsing an individual lesson does not change active course. Enrollment and activity identity are independent; one course's dismissal cannot erase evidence for another.
- Existing selected skill and read-only submitted history navigation remain intact.

## 4. Writing evaluation
- Distinguish two existing mechanisms: the legacy 12-week Writing tutor and Foundation Writing activities. The old course's Week 1 can submit an original text; Foundation extended responses currently queue adult rubric review. Do not describe them as one fully automatic service.
- Design a shared Writing Review interface: submission status, rubric, criterion scores, evidence-based strengths/corrections, original text, revision, adult/validated AI attribution, confirmed time, source/version.
- Pending/failed AI evaluation is a preserved submission but no quality score; manual review is a supported fallback. Scores are never guessed from word count or completion.
- Rubric-review/CEFR evidence and course-completion bookkeeping are separate.

## 5. v21 clean-draft navigation micro-optimization (separate code-only gate)
- Today routeGuardRef awaits confirmLatestDraft/saveDraft on started attempts even after the exact revision is server-confirmed; this safely causes a redundant network round trip on tab changes.
- Track last confirmed {attemptId, revision} and serialized in-flight writes. **Clean + no in-flight write**: switch tabs without an extra draft POST. **Pending/dirty**: await latest server confirmation, including edits made while a request is in flight. **Failed**: block all navigation and give Retry.
- Keep original lesson and audio visible on failed lesson fetch. Protect Dashboard, Parent View, seven skills, full Catalog, Back-to-lessons, and rapid repeated clicks.
- DO NOT remove v20's save-before-leave guard, fake saved feedback, or cache unsaved responses as if durable. Compare timings on the same device/network; CI does not prove a speedup.

## 6. Implementation and release boundaries
1. Architecture-only Work run: verify design against ACTUAL v20 deployed Sites source and existing data adapter, document discrepancies, write mock/fixture tests, stage a Draft PR only. No D1 write, migration, import or deployment.
2. v21-P1 Course enrollment + active context + legacy Writing compatibility (one focused code-only release after separate approval).
3. v21-P2 progress from actual attempts + better practice metrics and clean-draft navigation (separate QA gate).
4. v21-P3 constrained predefined A1/A2 courses (only validated published lessons), course revision suggestions, unified Writing review.
5. v21-P4 placement screening and AI custom course generation; only after reviewed assessment blueprint and safe guards.
6. Batch05 remains independent academic-review track. No content import until separate Preview and owner approval.

Use docs/COURSE_V21_QA_MATRIX.md for invariants. Never silently merge PR #18/#19 or overwrite actual v20 source with a GitHub checkpoint; retain URL/identity/auth/D1/learner history and exact rollback.


## 7. Reconciliation with deployed v20 (reviewed 2026-09-28)
- Source of truth for implementation is the Sites commit `7ffc690ba63461322eff7d259b483531c224e053`, whose parent is the deployed v19 commit. PR #20's base is GitHub PR #18 and is NOT a deployable application replacement. Use a fresh diff against the Sites commit for P1; reject any unrelated UI/content/schema/auth changes.
- Identity: `app/api/identity.ts` derives `accountId` from SitesAuthentication; repository scope is `{ownerId, learnerId:'primary'}`. New course reads and mutations must derive this server-side, reject missing identity, and use account-scoped composite keys. Never accept account/owner/learner IDs from request bodies.
- Existing stores: `learner_states.payload` contains `week`, `stage`, process drafts, `completed`, `feedbacks`, `history`, `revision`, diagnostic and model fields. `academic_attempts` stores lesson ID, package ID, exact version, status, results, audio state and review. `writing_submissions`, `writing_evaluations` and `writing_approvals` are separate saved records. `learning_evidence` has an account-scoped event ID primary key. Do not copy or replace any of these records with course progress.
- `GET /api/state` currently calls `importLegacy` and `rebuild`; it is not a guaranteed side-effect-free compatibility read. Course GET must use a pure read path, without import/backfill/snapshot. The existing broad `PUT /api/state` accepts a merged client snapshot. Reserve a server-owned `courseV1` namespace, strip/ignore that field in legacy PUT, and provide a separate authenticated, idempotent course-selection mutation. Use a persisted revision/compare-and-set or transactional equivalent so a stale Writing save cannot overwrite a newer course selection; a mere JavaScript queue on one browser is insufficient. No P1 schema migration is assumed: the field can be additive in the existing `learner_states` payload, but require a separately approved storage implementation and concurrency test before coding.
- Foundation attempts remain source-of-truth: a lesson-level reference matches a saved attempt's `packageId + version + lessonId`; activity-level references additionally match a result/activity ID. `started` drafts do not complete an item; `scored` can complete an objective task regardless of correctness, while `pending_review` is a submission milestone and `approved` is the separate review milestone. `unassessed` Listening without playback must never be counted as scored. For repeated attempts, choose the earliest eligible submitted/approved event for completion and keep all attempts for accuracy/history. A shared attempt can map to more than one enrollment; the global evidence/event key is inserted once and course progress is derived by reference, never appended again.
- Curriculum package digest must be verified from the canonical approved package record at template publication. A lesson's `version` is a package content version; old attempts remain pinned to it. No cross-version credit without an independently approved equivalence mapping. Current Site source alone does not prove the live D1 digest.
- Current `domain/course.ts` is only a portable type vocabulary and the existing imported Foundation `course.sequence` is a catalog sequence, not an enrollment. Do not repurpose or rewrite either. `app/page.tsx` and `app/core-panels.tsx` hard-code Writing journey/course links, so P1 must replace only those display/selection surfaces while preserving the v20 Foundation player's mounted state and route guard.
- Writing compatibility: the virtual `COURSE-WRITING-12W` enrollment is derived from existing saved state and never materialized on a read. With no explicit selection, My Courses lists it and YOUR JOURNEY asks the learner to choose; do not silently set it active. Week 1 has four required submitted process stages (indexes 0–3); saved `completed` flags are process progress, not quality or rubric scores. Revision index 4 is optional and separately labelled. Draft text, `stage`, `week` and sample `history` do not prove completion. Preserve and display saved feedback, submission/revision history and adult review without recoding old records. If old state points at Week 2–12, preserve the pointer but show Preview and offer Week 1 without granting completion. The first milestone may present four-step progress only for published Week 1, with 11 preview weeks shown separately.
- Existing navigation uses a parent `createNavigationGate` and a mounted Foundation `routeGuardRef`; My Courses, Choose/Continue and nested Writing routes must use the same route gate. Do not bypass draft confirmation by changing the navigation component. Legacy Writing state also autosaves with an 800 ms debounce; P1 must avoid losing dirty Writing edits when moving the old screens into My Courses.

## 8. P1 boundary, persistence and rollback checklist
1. Implement a read-only projection of My Courses from the legacy Writing state and any approved predefined templates; no auto-enrollment on GET and no A1 course publishing based on the mock fixture.
2. Add explicit active selection with null allowed, deterministic virtual Writing ID, server-owned owner scope, idempotency key/revision and an atomic conflict response. Only an explicit Continue/Set active mutation persists the selection; free Catalog browsing never changes it. Define a safe fallback if a selected enrollment is archived/unavailable: clear or mark invalid on explicit mutation, and render Choose a course on read without writing.
3. Render sidebar YOUR JOURNEY and Dashboard from the selected course; preserve old Writing dashboard data in the Writing course view. Show available Week 1 progress as 0–4 saved process stages and 11 Preview weeks separately. Do not call this 12-week completion, CEFR mastery or a score.
4. Keep existing `/api/state` Writing fields, `/api/foundation`, `/api/writing`, navigation guard and versioned attempt access intact. Selection writes must not rewrite these payloads. Document expected responses for missing auth (401), stale revision (409), unavailable course (422), and storage failure (503).
5. For P1 code-only rollback, retain the v20 saved archive and source `7ffc690ba63461322eff7d259b483531c224e053`. Before release, prove a v20 code rollback can read a state containing `courseV1` while preserving that unknown field through subsequent legacy state saves. If it cannot, P1 requires a separate additive table/migration approval or an adapter repair before deployment. Rollback never deletes selection or global evidence; hide the new UI only. If a schema migration is later chosen, separately approve migration, backup, dual-read, idempotent backfill, forward recovery and rollback compatibility before any D1 operation.
6. Keep clean-draft navigation as a separate code-only change and test gate: skip a draft POST only when the same `attemptId` AND exact revision have a successful server acknowledgement and the serialized write queue is empty. New edits, recording changes, attempt switches, pending or failed writes must save/await or block. Keep the original audio/player visible on failure. Do not couple this optimization to P1 rollout.
7. P1 tests: authenticated isolation, pure GET/no legacy write, no auto-selection, explicit selection persistence across reload, stale concurrent selection versus Writing PUT, idempotent retry, null/archived selection, Week 1 process flags and Week 2–12 previews, separate Writing reviews, unchanged Foundation history/content version, shared-attempt projection without new evidence, all sidebar/nested routes and dirty Writing/Foundation draft failure. Build and owner desktop/mobile QA are separate release gates.
