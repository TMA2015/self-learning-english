# SLE — Learning Path Pilot v0.1 (implementation proposal)
**Status:** PROPOSED / NOT A PRODUCTION FEATURE / NOT A NEW GOVERNING STANDARD
**Date:** 2026-11-04
**Authority:** The only normative standard is `SLE-MASTER-001 v1.1.0` on `main`. Programme architecture: `SLE_MASTER_CURRICULUM_FRAMEWORK_v1.0.md` (60 A1–C2 Units); baseline source: `curriculum-1.18.1-candidate.json` (109 lessons, 913 activities). Candidate `1.19.0` (121 lessons, 1009 activities) is in Draft PR #83 and must NOT be presented as LIVE before release.
**Source of improvement ideas:** selective discussion of Claude's independent programme review and 2026-11-04 owner direction. Claude's proposals are advisory; they do not replace project standards.

## 1. Problem and product outcome
SLE already has a lesson catalog, skill views, Error Bank, diagnostic and versioned learner records. The approved Framework defines an academic map, **not** a working daily path. A learner should open SLE and find a small, clearly justified next step without having to decide among unrelated skill catalogs.

**MVP user promise:** "I can see what to practise today, why it was recommended, which lesson it opens, what evidence is or is not checked, and what to do after finishing." Avoid implying a full CEFR tutor or automated speaking assessment.

## 2. Minimum learner flow (mobile-first, optional ~25 minutes)
1. Show a simple **Today** panel near the existing entry points, not a replacement for seven-skill navigation.
2. If a genuinely saved draft exists, **Resume** the exact immutable lesson/attempt version before proposing a new lesson. Never confuse latest content version with historical attempt version.
3. Offer at most three actionable steps: **Review** (5 min, one known misconception when genuinely available); **Learn/Practice** (15 min, one available lesson); **Transfer** (5 min, a genuinely available independent application or clearly labelled manual written task). Times are optional suggestions, not a timer or compliance target.
4. Show a truthful reason, e.g. "Your most recent submitted Grammar practice shows errors in past tense" or "Next unattempted Reading lesson in this Unit". Do not fabricate skill mastery, error patterns or a functional link.
5. After feedback, show a simple "Continue / Review explanation / Choose another skill" action. Preserve direct free browsing: no compulsory locks, forced streaks, mandatory AI, accounts beyond supported auth, or auto-generated scores.
6. If a selected Unit has no released lesson or no integrated checkpoint, show "**Planned — not available yet**" in descriptive programme view only; never render a clickable assessment or false "Complete Unit" badge.

## 3. Data boundaries and source design
- **Read only first:** derive path suggestions from the actual `Catalog` API's released `course.sequence`, `lessons` and `attempts`, plus the canonical 109-ID planning crosswalk. Make no attempt-state changes for recommendation views.
- **Provisional overlay:** `SLE_V119_12_LESSON_UNIT_PLACEMENTS_PROPOSED_20261104.md` proposes 12 candidate lesson placements. Overlay is not activated until v1.19.0 is in the **actually imported catalog**. Never infer availability from a GitHub file or PR branch.
- **Keep model small:** `level`, `unit_id`, `lesson_id`, `ordinal`, `available`, `source_content_version`, `rationale_code` are suggested read-only derived view fields, NOT additions to curriculum JSON or an approved runtime schema.
- **Historical invariants:** no rewrites of existing lesson IDs, scored items, grades, attempts, prior content versions, reviewer records or saved drafts.
- **Placement = advisory:** one primary Unit per lesson for navigation; allow documented secondary relevance without duplicated practice evidence or independent scores.
- **Cache/stale state:** if the content catalog is unavailable, show a clear retry and retained historic draft access, not an inferred static lesson list.
- **Privacy/free-first:** no birthday, school name, exam score or precise identity required to use the default path; a learner alias or voluntary goal is enough if future configuration is added.

## 4. Candidate prioritisation algorithm (to implement and unit-test)
For each actual catalog state:
A. Most recent **IN_PROGRESS/started** attempt with an available version and safe resume → priority 1. Preserve unsaved-state protection.
B. If the application has a *real recorded misconception* linked to a reviewed lesson prerequisite, offer one compact Review recommendation → priority 2. Never auto-score a self-reported oral rehearsal or pending Writing as a misconception.
C. Within learner-selected CEFR reference band (or a provisional diagnostic suggestion if one exists), choose the first unattempted **released** lesson in the current Unit that is consistent with advisory prerequisites → priority 3.
D. If none, offer a related released practice lesson or let learner choose a skill. If no released content exists, say so.
E. Optional **unit transfer** appears only when an independently designed, reviewed and technically available task exists. A count of viewed lessons does not imply Unit mastery; no automatic CEFR award.

Explicitly avoid using a single objective score to claim B2 readiness. For skip/test-out, collect a diverse fresh transfer sample and, when necessary, trusted review of productive evidence. A score threshold such as 85% may be a *recommendation heuristic* only, never automatic verified CEFR promotion.

## 5. Pilot selection (not daughter-specific code)
**Pilot A:** `A2-U09` — writing-task analysis and brainstorming. Released baseline already has WRI-A2-01..04 and GRA-A2-16; Draft PR #83 proposes WRI-A2-05/06, only after import.
**Pilot B:** `B1-U02` — claims, evidence and recommendations. Baseline SPE-B1-01 + VOC-B1-04; PR #83 proposes VOC-B1-06 and REA-B1-06.
**Pilot C:** `B1-U09` — organising and revising opinion writing. Baseline includes WRI-B1-01..03, GRA-B1-11 and VOC-B1-02; PR #83 proposes WRI-B1-04..07.
**Stretch after release:** `B2-U02` and `B2-U03` for Vocabulary / Reading source-evaluation practice (PR #83 candidates VOC-B2-01 and REA-B2-01). These do **not** validate full B2 competence.

The pilot intentionally provides multiple entry points. A learner with a provisional B1+/B2 diagnostic should not be forced through A1/A2 or assigned a fixed age-to-CEFR schedule. Recommended work follows observed *domain* skills, confidence and learner choice.

## 6. Optional learner verification sprint (outside production feature scope)
**Why:** the learner is in Grade 6 with a **reported website diagnostic B1+/B2 estimate**. Treat this as provisional and likely recognition-heavy, not proof of equal proficiency in Listening, Reading, Writing and Speaking.

**Suggested two-week, adaptable plan:** short Reading and Listening probes from released content with genuine audio; a Grammar/Vocabulary error review; **two original age-appropriate Writing prompts** reviewed by a trusted parent/teacher against explicit content/organisation/language/task-response dimensions; optional observed Speaking interview outside SLE; if appropriate, an age-suitable independently sourced external sample (e.g. Cambridge B1 Preliminary for Schools/B2 First for Schools). No requirement to buy an exam, upload private speech recordings or create an identity dossier. Nine sessions is optional, not a mandatory product requirement.

**Output:** provisional per-skill profile: `Reading: practice evidence only / observed transfer / unknown`, similarly for Listening, Writing, Speaking, Grammar/Vocabulary. Record *evidence type, task date, source, confidence and reviewer status* where a supported local/private store exists; until then a parent may retain observations offline. No automatic CEFR certification. Recommendations must not silently convert provisional diagnostic to assessed productive proficiency.

## 7. Minimal review and acceptance gates
**UX-1** Today panel renders from verified current catalog, never a hard-coded 1.19.0 PR file as "released".
**UX-2** Existing draft Resume opens the immutable prior package even after a new content version.
**UX-3** More errors/retries never multiply the same evidence as independent mastery.
**UX-4** Pending Writing, unassessed Speaking and absent audio cannot become scored proficiency or Unit "completed".
**UX-5** All three suggested actions work or are clearly disabled with honest text; direct Catalog and Skill Map stay usable.
**UX-6** Narrow mobile / keyboard / screen-reader labels work; refresh, offline warnings and failed saves do not lose drafts.
**UX-7** Unit mapping cannot contain unknown lesson/Unit IDs or duplicate primary assignments; prerequisite guidance has no cycles/automatic locks.
**UX-8** Real-browser acceptance is separate from source-only tests, CI and document review; do not call LIVE before owner release approval and actual deployment.

## 8. What is deliberately NOT part of v0.1
No site redesign, no new CEFR scoring, no automatic test-out, no spaced-repetition scheduling stored as a guarantee, no parental dashboard redesign, no AI requirement, no uploads of speech recordings, no new content lesson IDs, no curriculum JSON schema changes, no automatic Firebase deployment. A compact "School Bridge" may later map school *topics* to already released lesson IDs, without copying copyrighted textbooks.

## 9. Proposed implementation order
1. Confirm actual catalogue/attempt payload and current navigation, including draft retention, and choose a minimally invasive placement for Today panel.
2. Implement pure deterministic read-only selection with fixtures from current released catalog and proposed mapping; verify historical-version and pending-review cases.
3. Integrate pilot UI for A2-U09, B1-U02 and B1-U09 on a **separate reviewed code PR**; run a single exact-head PR QA.
4. Verify the actual deployed English website only after explicit owner authorisation and release, with a short mobile learner check. Then decide whether to expand B2 and review scheduling.

**Document status:** proposal for discussion with owner/Claude. No new rules override SLE-MASTER-001.
