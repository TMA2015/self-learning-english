# Curriculum Blueprint v1 — one reviewed content bank, multiple learning routes

**Status:** source-only architecture prototype; NOT LIVE, NOT IMPORTABLE, NO D1/learner-state changes. **Base:** Academic Batch03 Draft PR #12 checkpoint `711200fd1359b3cb02ecaf9b1f7f3da6615c045a`. The existing private Site remains v15 / curriculum 1.2.0. Academic 1.3.0 is pending independent final confirmation of the corrected GRA-A2-03-Q7 key, then a separate owner-authorized compatible application release and safe content-import preview.

## 1. Intent and important boundary

A textbook is not just a fact list. Different courses sequence topics differently, choose themes/examples, pace practice, integrate skills and choose assessment evidence. The long-term goal is to reuse verified original knowledge, exercise content and learner evidence across multiple *original* pathways. Aligning with a published textbook's learning outcomes is different from copying its protected text, exercises, layout, illustrations or audio; licensed material requires actual rights. Avoid claiming this 36-lesson seed recreates a complete CEFR course or any named book.

The **blueprint** holds only stable references to lesson content and their concept/skill/dependency metadata. It never embeds personal learner state, raw content duplicate payloads, an unreviewed AI-generated answer key or a replacement academic package.

## 2. Concrete source files and IDs

- `content/curriculum-blueprint-v1.json`: 36 pinned lesson references to the same proposed cumulative curriculum 1.3.0 package; 65 module-scoped concept IDs, 44 skill IDs, advisory prerequisites and assessment modes; two pilot curricula.
- `domain/curriculum-blueprint-v1.cjs`: pure, source-only functions for schema/dependency validation, prerequisite-aware manual plans, deterministic skill-based drafts, and external attempt projections.
- `tests/curriculum-blueprint-v1.cjs`: two orders over the same 13 actual lessons, shared attempt identity, no evidence duplication, version isolation and regression of the corrected Q7 answer.
- `.github/workflows/curriculum-blueprint-v1-qa.yml`: source tests, prior Batch02/Batch03 checks and production build. No Site deployment.
- `content/curriculum-coverage-1.3.0-candidate.json` stays the authoritative *candidate* graph for this proof, pending editorial reconciliation.

`concept_id` is namespaced by module (e.g. `concept.reading.detail` vs `concept.listening.detail`) because identical generic labels need not mean identical competence. `skill_id` uses the existing activity tag, such as `grammar.past_simple` or `writing.task_understanding`. `content_ref` pins `package_id + content_version + lesson_id` and only points to already authored units; do not duplicate the underlying text or exercises. `assessment` distinguishes deterministically scored activities, adult-reviewed open responses and unassessed activities.

## 3. Two pilot teaching sequences

Both pilots contain **exactly the same 13 A1 lessons**, with different ordering and identical content references:

- `CUR-FOUNDATION-GRAMMAR-FIRST-V1`: introduces sentence forms and other grammar before the main reading/writing applications.
- `CUR-FOUNDATION-COMMUNICATION-FIRST-V1`: introduces vocabulary, the first notice, and guided personal writing earlier, inserting necessary grammar foundations before dependent tasks.

The order in each manifest is checked against the currently authored advisory prerequisites. Neither pilot claims to be a complete course; both require teacher/academic review before user-facing release.

## 4. Learner records and shared evidence

The learner's **existing authenticated attempt store** remains the sole source of truth. A pathway is only a *view* of canonical lessons: switching tracks does not reset or copy attempts or create duplicate evidence.

The source-only `projectTrack(blueprint, curriculum_id, attempts)` illustrates this with mock external attempts. It projects the same saved draft, submitted score or pending adult review onto each curriculum whenever the pinned package version and lesson ID match. The track ID is never part of the attempt's identity. It does not award proficiency from lesson completion, text-only speaking plans, or a pending Writing review.

**Version caveat:** Existing attempt records include `packageId`, `version` and `lessonId`. The v1 prototype reuses evidence *within the same pinned version only*. It does not automatically bridge 1.2.0 evidence into 1.3.0 even where lesson objects happen to be unchanged. Cross-version equivalence needs an independently checked content fingerprint/map plus explicit compatibility in a later release; no historical attempt may be rewritten to claim a new version.

## 5. User and AI curriculum creation

Manual builder: select canonical lesson IDs or skill IDs. The prototype calculates a closure of prerequisites and returns a proposed topological order, recording the prerequisites inserted. A missing skill or nonexistent lesson causes a clear coverage-gap/validation result. Do not silently hide prerequisite warnings.

AI builder (future): translate a learner's natural-language goal into a structured request with age, time, actual tested evidence, domain, CEFR lesson target and allowed units; call the same deterministic composer; render a reviewable draft. The AI must not invent a scored exercise, declare mastery or bypass missing audio/review. Start with reviewed, curated templates; only later allow owner-controlled public sharing of custom plans.

Under this prototype `composeFromSkills` is deliberately a **simple heuristic**, not an expert adaptive planner: it picks an A1/A2 available lesson by matching skill tags and ordering prerequisites. The output explicitly says `draft_not_published` and requires academic review.

## 6. Academic reconciliation issues, not silently fixed here

The existing source graph marks `GRA-B1-01` as dependent on `GRA-A2-01` only, although the new A2 past-simple lesson `GRA-A2-02` is clearly pedagogically relevant to its Past Simple/Present Perfect contrast. Similarly, `WRI-A2-02` currently lacks an explicit dependency on past-simple preparation. Recommend an academic review of proposed edges before building general personalized plans. Do not modify already imported lesson objects or reinterpret old progress.

The three A1 audio-dependent gaps (Listening, Speaking and Pronunciation) remain open. No scored audio tasks from placeholder resources; no overall CEFR certification inferred from target labels. The 44 skill IDs reflect current *used activity tags*, not a universal validated inventory; deliberate deduplication, fine-grained outcomes and independent academic validation are required before scalable curriculum building.

## 7. Release/validation boundary

1. Finish independent key confirmation of `GRA-A2-03-Q7`: A = `some milk` (B = `many milk`). Structural test has passed, but a self-check is not independent review.
2. Approve the actual cumulative 1.3.0 candidate only after content review; stage compatible tag/catalog application code against **deployed v15**, not the older academic branch's application shell.
3. In the existing Parent View, Preview Import against the actually deployed 1.2.0 export. The conditional expectation for unchanged production is **Add 7 / Update 0 / Skip 29 / Conflict 0**. Stop on discrepancy. Preserve all 1.2 attempts, drafts, reviews, auth, D1 and audio.
4. Verify post-import export and owner authenticated learner QA.
5. Only then consider production integration of this curriculum blueprint behind a separate feature flag, with educator approval of each curated pathway, transparent prerequisite warnings and no learner-state migration.

**No Site creation, deployment, content import, D1/schema operation, PR merge or user-account modification is part of this blueprint work.**
