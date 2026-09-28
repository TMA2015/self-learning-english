# G Learning / Self-Learning English — Master Plan v1.0
Status: proposed governance charter, 2026-09-28. This document establishes durable principles and architecture; it is not authorization for deploy, content import, migration or PR merge.

## Vision and learning audience
Free-first, mobile-usable, self-study English for an early-secondary learner, expanding from strong A1/A2 foundations and selected B1 examples to later IELTS Reading/Writing and authentic Listening/Speaking. Seven instructional domains: Grammar, Vocabulary, Reading, Writing, Listening, Speaking, Pronunciation. Teach the process of learning—clear instructions, examples, independent response, specific feedback, revision and spaced/error-driven review—not just score accumulation. Original lessons and appropriately licensed media only: English Grammar in Use may inspire pedagogical sequence but may not be copied as a question bank.

## Four layers that MUST remain distinct
1. **Versioned Content Library / Course Catalog**: approved lesson/activity IDs, CEFR lesson target, original explanations, skill tags, prerequisites, answers, feedback, rubric, content source/version. Free Catalog browsing is not course enrollment.
2. **Course Template**: predefined or later AI-composed sequence of references to approved immutable content, with stable unit IDs, prerequisites, availability and version. Do not clone question/answer bodies into every course.
3. **My Courses / Enrollment**: authenticated server-owned learner course instances, explicit active selection, source-pinned plan revisions, course status and derived progress. A learner can enroll in multiple courses; browsing a lesson never changes the explicit active course.
4. **Global Evidence / Skill Map**: original attempts and approved reviews retained independently from enrollment. One attempt can satisfy several courses but generates global Evidence once; source version, attempt and review IDs are immutable.

**Learning Plan** = My Courses, Course Library, future Create AI Course, separate Recommendations. **Your Journey** follows only the explicitly active course or shows Choose a course. **Writing 12 Weeks** appears under My Courses, while Writing skill practice remains independent. Currently Week 1 has four complete saved process stages; Weeks 2–12 are preview content and must not be represented as delivered.

## Measurement is not a single percentage
Keep separate: saved process stage, submitted activity, objective accuracy with actual numerator/denominator, unique question coverage, per-tag practice, reviewed Writing rubric, provisional placement/working CEFR, and formal certification. No CEFR label inferred from a lesson count or uncalibrated multiple-choice accuracy. Do not infer Speaking or Pronunciation competence from typed text or Listening competence from unverified playback. Pending/unavailable Writing review saves original work but does not create a quality grade.

## Product roadmap, with independent release gates
- Foundation: accurate original instructional breadth and practice for seven skill domains, usable by younger independent learners. Add authentic media/review before claiming Listening/Speaking/Pronunciation assessment.
- v21-P1: My Courses, explicit active course, Your Journey, legacy Writing compatibility. Must prove pure GET, atomic selection vs stale Writing PUT, account isolation and v20 source-only rollback before release.
- v21-P2: accurate evidence projections and clean-draft fast navigation as separately verified code-only scope.
- v21-P3: bounded, academically complete portions of predefined A1/A2 paths; versioned optional content suggestions; unified Writing review. A catalog of 45 lessons is not a certified complete A1–B1 course.
- v21-P4: reviewed level-specific placement blueprint and constrained AI Custom Courses, at most two incomplete/non-archived simultaneously. Learner/parent confirms a working level; AI selects approved content references only, weights sum to 100. No credential claim.
- Later: broader B1, IELTS Reading/Writing, and genuine audio/speech modules according to evidence and QA readiness.

Academic batches and application code are independent workstreams. Gemini academic PASS does not authorize Site Preview, Import or production deploy.

## Long-term academic invariants
One explicit answer format per activity; accept all valid short-answer variants or narrow the prompt. Independently solve every new question, check plausible distractors and full Reading source. Open Writing requires adult/validated AI rubric review, not word-count grading. Preserve every original ID, passage, rubric, old lesson object and historical attempt when making a new content version. Reorder answer choices only with correct-answer **text** invariant tests. New course items may be suggested/added only through a versioned, auditable plan revision without retroactively removing earned completion.

## Durable source-of-truth hierarchy
Verified deployed Sites runtime and account-scoped saved records are operational truth. Exact GitHub commit/PR is code truth but not necessarily deployed. Last owner-approved imported JSON and its canonical SHA are academic production truth. Approved architecture/contracts and this charter govern design. Old chats, docs-only PRs, seed/demo files and review-only candidates cannot silently replace current runtime/content. If sources disagree, record discrepancy in a dated status record and request a decision before irreversible action.

## People and governance
ChatGPT: master/source manifest, task packets, academic+technical QA, review reconciliation and integration proposals. Gemini: independent academic author/reviewer of the exact attached scope; no production authority. Work: tightly scoped code/testing/staging and only separately approved deployment/import operations. Owner: distinct Preview, Import, deploy, merge and D1/migration permissions.

**Pipeline:** draft → independent academic PASS → correction/retest → structural/semantic tests → separate owner Preview authorization → separate Import authorization → code/build/browser QA and separate deployment approval → published.

Update this Master Plan only when a durable decision changes. Keep current counts, PR heads, CI problems, staging and rollbacks in a dated status document. See PROJECT_RULES_G_LEARNING_V1.md, PROJECT_STATUS_20260928.md, ACADEMIC_AND_SOURCE_MANIFEST.json, GEMINI_RELAY_PROTOCOL_V1.md, and existing COURSE_ARCHITECTURE_V21.md / COURSE_V21_QA_MATRIX.md.