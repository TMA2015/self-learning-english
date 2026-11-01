# Self-Learning English — Continuous Development Charter (Owner 2026-11-01)

**Status:** Owner-approved direction, planning and content-work authorization; no implicit production-release authorization.
**Project:** ONLY Self-Learning English GitHub + Firebase website (not the separate ChatGPT English Tutor).

## Correct long-term scope
There is no B1 ceiling. Target **Pre-A1, A1, A2, B1, B2, C1, C2** across appropriate receptive/productive skills, guided by Council of Europe CEFR descriptors as references, not copied curricular content. Align challenge and topics with learner age and capacity. C2 is a long-term coverage objective, not a short-term CEFR mastery claim.

Official references:
- https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context
- https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search

## Two independent workstreams / Git branches
1. **Content development** (this branch `content/self-learning-academic-development`): immutable candidate learning assets, quality audits, lesson enhancements for v1.18.0, new integrated-topic packets, media production specifications, compact Markdown NotebookLM packets, and review tracking. Make progress without waiting for parent browser QA.
2. **Release staging** (`release/self-learning-english-qa-staging`): intake **only approved** content from development with explicit version refs; execute technical QA, security, media rights, source-version compatibility and real browser smoke; deployment and merges to live/protected release branches only with owner authorization. Do not edit the active `release/nov2026-content-v1.18.0` branch unintentionally.
3. **Ongoing learner QA (Stage 5)** is a continuing cross-cutting activity: parent tests existing/new lessons and reports observed issues; triage risk and reduce regression breadth only where safe. Stage 5 is **not** a prerequisite for Stage 6 or 7 work.
4. **Technical remediation (Stage 4)** can occur in parallel and may have its own targeted code PR; do not couple to large academic batches.

## Development stages
- **Stage 6**, improve all existing 109 lessons in theme/skill families, against the four-core teaching design: Goal/Context, Strategy/Concept and Worked Example, Independent Practice, Specific Explanatory Feedback. Optional: hints, prerequisites, self-check and spaced review. Only change lessons actually needing change. Assign KEEP / ENHANCE / REDESIGN / MEDIA-BLOCKED evidence.
- **Stage 7**, build new large coherent topic packs that reuse Grammar/Vocabulary/Reading/Listening/Writing/Speaking Preparation/Pronunciation where appropriate. Each pack covers one theme with supported level range and learning sequence; some specialist packs may target fewer skills if educationally justified. Progress across Pre-A1 through C2 with actual prerequisites, not simply advanced labels.
- **Stage 8**, personal progress, review and cross-skill connection using actual evidence, optionally AI when available. Never depend on AI for basic navigation, learning or deterministic objective scoring.
- Review packets for Stage 6 and 7 may accumulate **unreviewed** as a queue on GitHub. Do not import/deploy until independent academic approval, required changes, human media rights clearance and technical QA.

## Early integrated-topic backlog (proposed, not yet reviewed)
| Order | Topic family / learning scenario | Levels | Cross-skill anchors | Packaging |
|---|---|---|---|---|
| P01 | School, Friends & Everyday Communication | Pre-A1–A2 | classroom chunks, social notices, dialogues, polite requests, short personal writing | one cohesive theme packet with staged subtopics |
| P02 | Family, Hobbies, Food & Travel | A1–B1 | descriptions, comparisons, time, booking dialogues, short narratives | reusable thematic bank |
| P03 | Environment, Science & Healthy Communities | A2–B2 | evidence-based reading, opinion writing, reported speech, debates preparation | differentiated difficulty |
| P04 | Digital Life, Media Literacy & Online Safety | A2–C1 | inference, source reliability, neutral/biased language, explanatory writing, interaction | topic progression |
| P05 | Society, Culture, Ethics & Global Issues | B1–C2 | argument structure, nuance, academic reading, listening to perspectives, spoken discussion preparation | advanced spiral curriculum |
| P06 | Research, Work, Academic Communication & Advanced Discourse | B2–C2 | synthesis, register, rhetorical organization, critical evaluation, presentations | age-appropriate advanced units |

These are topic families, **not a claim that every family already has complete content**. For each create a topic inventory, 4-core lesson templates, explicit prerequisites, staged independent exercises, feedback, proposed audio, assessability tags, and one cumulative review packet per batch. Prefer quality bundles sized to be reviewable; do not interpret "large" as one unreviewable JSON dump.

## Pipeline per cycle, with explicit gates
1. Read latest GitHub checkpoints and audit coverage for missing pedagogical pieces.
2. Select bounded next lesson group or topic; author actual original material + answer-key check + source provenance; do not invent audio tests.
3. Run available validators. Store candidate and issues in GitHub content branch; keep QA artifacts scoped.
4. Assemble one Markdown NotebookLM review packet **only when an independently adjudicable academic batch is ready**; pending review is `ACADEMIC_REVIEW_PENDING`. Do not ask parent to upload files before they return. Continue the next bounded batch.
5. On reported review verdict, fix required changes, reconcile to a new immutable cumulative curriculum version, then hand off approved release candidates to staging.
6. Release staging independently validates; never auto-publish unreviewed candidate, spend on paid services, trigger private GitHub Actions, mutate records or deploy the separate Math site.
7. Keep status accurate: authored vs academically approved vs technically QA'd vs production deployed are four different states.

## Offline clarification / product intent
**Browser-local storage** means a learner's answers/progress may be stored in that device's browser; it does NOT prove the website works when disconnected. True full offline requires service worker/cache and local full media+attempt workflows. The core owner goal is a free web-based self-study site, not a promised airplane-mode app. Continue content and normal online learning even if `OFFLINE_NOT_VERIFIED`; do not claim `100% offline`. Treat offline capability as a separate optional enhancement unless explicitly elevated as a release criterion later.

## Safety & editorial invariants
- Separate English and Math Firebase Hosting targets/data; preserve English production, no billing/paid service authorization.
- Never touch learner history, author-grade exercise keys, or content IDs in place. Versioned future revisions and browser rollback only after testing.
- Optional AI answers, no mandatory AI; safe Markdown, Vietnamese question -> Vietnamese explanation, no assessment answer leak.
- Pronunciation audio only genuine owner-cleared source; all text-only planned audio tasks remain UNASSESSED until produced and verified.
- Speaking Preparation plans/checkboxes/knowledge do not count as observed oral competence.
- CEFR target tags are not formal certification or proof of learner level.
- GitHub Actions for private English remain manually triggered only, subject to owner confirmation and spending considerations.

## First concrete artifact / checkpoint
See `CURRICULUM_1180_SELF_STUDY_COVERAGE_AUDIT_20261101.md` in this directory, generated directly from the 109-lesson base. Continue Stage 6 structural assessment and author P01 Stage 7 theme content in parallel. Do not wait for the parent to finish running every current lesson.
