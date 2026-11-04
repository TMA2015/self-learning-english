# Self-Learning English — Master Content & Self-Learning Standard

**Standard ID:** SLE-MASTER-001  
**Document version:** 1.1.1 (editorial learner-path clarification proposed on v1.19 content branch; effective only after review and owner-approved merge)  
**Status:** ACTIVE / SOLE NORMATIVE STANDARD. Academic adoption was completed by merged PR #71 on 2026-11-02; the owner unified SLE project rules on 2026-11-03. The current curriculum candidate is v1.18.1; this policy revision does not itself certify untested browser behavior.  
**Prepared:** 2026-11-02; living revision 2026-11-03  
**Canonical path:** `sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md` in `TMA2015/self-learning-english`. Do not create a second copy under root `docs/`.  
**Scope:** One unified Self-Learning English (SLE) GitHub + Firebase website/app. This is **not** the independent ChatGPT-in-chat English Tutor project.  
**Current development checkpoint:** v1.18.1: 109 lessons, 913 activities and 38 currently approved baseline MP3s. Historical PR snapshots remain evidence, not separate release policy. Code in GitHub is not automatically the deployed version.

## 0. Authority, document control, and adoption (MUST)

**The aim is exactly one authoritative, living standard; not two development branches, not separate academic versus release standards, and not dozens of independent requirements.** After owner approval and merge into the agreed canonical repository line, this file alone defines the normative requirements for authoring, editing, reviewing, testing, integrating, and releasing SLE learning content and associated learner-facing teaching behavior. The same standard applies regardless of who or what performs the work (ChatGPT, Work, human contributor, QA or an automation).

- ``MUST`` = blocking requirement unless a documented exception has been separately approved; ``SHOULD`` = default good practice, requiring a documented reason to depart; ``MAY`` = optional.
- A previous review verdict, historical design document, chat message, issue, test or implementation note is **supporting evidence**, not a second competing policy. An externally approved academic decision becomes normative only when intentionally incorporated into this file as a versioned change.
- An approved release must declare `standard_version`, `content_version`, source commit, and QA/academic verdict. These are *release-report fields* unless separately introduced into a validated runtime schema; do not insert unknown keys into the existing curriculum JSON.
- The standard's version is independent of the curriculum package version. Changing the standard does **not** automatically edit lesson IDs, content packages, attempts, evidence, grades, dashboards or deployed UI.
- This standard took effect when **PR #71 was merged on 2026-11-02**. Later approved changes amend this same file in place, with Git history as the version record. The 2026-11-03 owner decision consolidates content, authoring, independent NotebookLM review, technical QA, browser acceptance and release rules here; separate dated reports and older policy-like files are evidence only. An approval to consolidate documents is not permission to invent a passing test or change saved learner data.
- One **temporary Git feature branch / draft PR** may be used for safe review; this is a technical change-isolation method, **not** a second permanent project or a split development process.

### 0.1 Relationship to historical documents after adoption

| Existing document or source | Role after adoption | Rule |
| --- | --- | --- |
| `docs/CONTENT_AUTHORING_STANDARD.md` | Historical authoring reference | Superseded where overlapping; useful rationale, not a parallel authority |
| `docs/LEARNER_ACTION_FEEDBACK_STANDARD.md` | Historical UX/feedback reference | Consolidated by Sections 2, 3, 8 and 10 here |
| `docs/CROSS_SKILL_QUALITY_STANDARD.md` | Historical technical QA reference | Consolidated by Sections 7–10 here |
| `docs/COURSE_ARCHITECTURE_V21.md` / `COURSE_V21_QA_MATRIX.md` | Design proposals / test ideas | Not evidence that conceptual modules are deployed; adopt only implemented and reviewed portions |
| NotebookLM lesson/batch verdicts and Stage 1–3 pedagogy verdicts | Traceable academic decisions | Required corrections must be reconciled here before they become permanent policy |
| `domain/academic.ts`, current curriculum JSON and runtime tests | Actual implementation contracts and evidence | They constrain what can be shipped today; a normative change requiring code work does not magically make that work complete |
| `content/audio-rights-register.json` and release audit records | Per-asset provenance and authorization evidence | Keep as factual records; they are not a separate pedagogical standard |

**Permanent academic baseline and single local authority:** `SLE-MASTER-001` unifies and supersedes historical **local** authoring and QA documents (`docs/CONTENT_AUTHORING_STANDARD.md`, `docs/LEARNER_ACTION_FEEDBACK_STANDARD.md`, `docs/CROSS_SKILL_QUALITY_STANDARD.md`). It remains subject to the five permanent English-project academic baseline sources (`00_NOTEBOOK_ENGLISH_PERMANENT_v2.md` through `04_GRAMMAR_ADAPTIVE_ROADMAP_v2.md`), and its compatibility with those sources MUST be checked whenever substantive rules change. NotebookLM baseline documents provide review evidence and academic constraints, not a second active repository authoring checklist. Conflicts require documented reconciliation; never claim compliance from document naming alone.

When legacy prose differs from validated current runtime behavior, **do not assume either is safe**: record the discrepancy, apply the more conservative learner-data/evidence guard, and require a versioned resolution before deployment. Avoid deleting historical documentation; mark it archival in a later explicitly reviewed documentation-only task. Maintain **one canonical version of this file**; Git history is the change record. Historical issue/PR/dated QA documents are never normative. Do not create `MASTER_v1`, `MASTER_v2`, separate CI-rule documents, or parallel active checklists. GitHub workflows/tests are executable implementations of this standard, not competing policy. The old repo-root `docs/REPO_TESTING_AND_QUALITY_RULES.md`, `docs/P0_RELEASE_GATE.md` and `docs/releases/2026-11-ci-quota-policy.md` are archived historical references.

## 1. Product promise and non-negotiable learner outcome (MUST)

SLE must be a usable, affordable **self-learning platform**, not merely a question bank. A learner who has not already mastered the topic must be able to understand a concept or strategy, see how it works, practise without being handed test answers, receive actionable explanations, and know a reasonable next learning action.

For each released teaching lesson, reviewer MUST answer **YES** with observable evidence to all questions:

1. Can a learner understand **what** they will learn, **why** it is useful in an age-appropriate situation, and what they must do?
2. Is the **new concept or skill strategy actually taught** accurately, in small enough steps, rather than hidden in a list of MCQs?
3. Does a **worked demonstration use independent material** and visibly explain the reasoning or method?
4. Can the learner apply that method in **independent tasks** that are not answer-copied from the lesson notes or worked example?
5. On a typical wrong answer, does feedback explain the misconception and give a **next action**, not merely “Incorrect”?
6. Do completion, accuracy, saved progress, review status and claimed language ability represent **different kinds of evidence**, rather than false mastery?
7. Can the learner proceed using the **free deterministic core without mandatory AI, paid account, AI API or a human tutor** for ordinary objective practice? Unassessable free responses must be clearly labeled.
8. Are the actual limits of devices, audio, offline availability, and optional AI transparent rather than advertised as working when untested?

**Release BLOCKER:** any “teaching lesson” that is a bare question bank without explanation/demonstration/feedback, or whose learner cannot recover from foreseeable mistakes. Practice-only resources can exist, but MUST be unmistakably labeled as practice rather than a complete taught lesson.

### 1.1 Long-range learning pathway and audience (editorial clarification)

The same **free self-learning website** serves school study, independent practical English and long-term preparation for higher education, IELTS/TOEFL and possible study abroad. Exams are later applications of a broad language foundation, **not** the curriculum's sole target. Course paths MUST remain meaningful when optional AI is unavailable and cannot promise exam scores or formally certified CEFR outcomes.

- The active sequence develops **A1 → A2 → B1 → B2** with explicit prerequisites, separate skill development, cumulative practice and transfer into unfamiliar contexts. Higher **C1/C2** academic and professional directions should be mapped for future expansion, but the current validated import schema only accepts A1–B2 IDs; do not publish fake C1/C2 labels or bypass import validation.
- **Depth and breadth develop in parallel:** strengthen foundational A1/A2 material for beginners and targeted review while promptly introducing authentic B2 Reading, Writing, Listening and Vocabulary for capable learners. Do not make an A1 restart a condition for a learner with demonstrated B1/B2 readiness. A low-level review is a recommended repair for an observed prerequisite gap, not a compulsory detour for everyone.
- Treat diagnostic estimates and individual skill profiles as **provisional evidence**: a learner may be stronger in Reading than productive Writing. Choose accessible prerequisites and targeted next steps rather than assign a single permanent ability label or mistake B2 lesson completion for verified B2 competence.
- For each new lesson the existing CORE1–CORE4 standard already requires **an observable new ability, what must be understood first, independent transfer and a useful next practice action**. When planning lesson sequences, identify the entry skill, the new use of English, and the next skill to build. Mere item counts or multiple-choice strategy scores are never a substitute for productive skills.
- Practical school use and future academic use should reinforce one another: topic analysis, brainstorming, evidence-based inference, communication and revision can grow from short age-appropriate tasks into mature reasoned essays and source evaluation. Add exam-specific strategies on top of general competence instead of reducing teaching to tricks.

This paragraph clarifies the existing self-study promise, CEFR honesty and lesson contract. **It adds no Preview, separate QA policy, new learner data operation, or unreviewed technical release gate.**

## 2. Universal lesson contract: four core steps plus adaptive support (MUST)

Every taught lesson, proportionate to age, CEFR target, task type and device, has **four core learning functions**:

**CORE-1 — Goal & meaningful context.** Specific, observable outcome(s), a useful real-life or school situation, concise task expectations and (when needed) advisory entry knowledge. Avoid vague goals such as “know vocabulary” or circular goals such as “do 10 exercises.”

**CORE-2 — Explicit concept/strategy and independent worked demonstration.** Teach what/why/how, show a correct worked process and a typical pitfall, using examples **different from active scored stems, passage facts, answer options, or answer keys**. Model comprehension and decisions, not rote pattern matching. Teach “how to approach the task” where knowledge is procedural.

**CORE-3 — Independent practice.** Sufficient distinct tasks or a suitable authentic performance to observe the stated objective. Scored items require independently answerable material, a defined key/rubric, unambiguous instructions and appropriate cognitive demand. Do not count a guided task as independent evidence.

**CORE-4 — Explanatory feedback and next action.** For correct and incorrect responses: what was assessed, why the answer is supported or not, the relevant rule/text/audio cue, and what to review/try next. If scores are impossible, say “Unassessed/Pending review” and offer a useful self-check rather than fabricating a numeric result.

The four functions do **not** have to occupy four large screens. One compact overview and clear practice/results may suffice. Avoid forcing eight separate compulsory steps onto young learners or mobile layouts.

**ADAPTIVE / OPTIONAL** and closed or lightweight by default: (a) prerequisite links, (b) graduated hints or guided attempts, (c) a simple reflection/self-check, (d) suggestions for spaced review. A hint MUST not reveal the active answer before submit. Review intervals are recommendations, not guarantees of memory retention. Guided activities are useful but MUST not delay motivated students who can proceed independently.

**Suggested time/pace** is advisory, not a universal 30-minute requirement; a roughly 25–30-minute unit MAY be divided into two optional ~15-minute visits (A: Learn + Demonstrate; B: Independent Practice + Feedback) if the current platform can resume reliably. Do not claim that pause/resume exists unless tested; progress and next action must remain clear.

## 3. Learner experience, feedback and recovery (MUST)

- Use clear, age-appropriate **English-first** student-facing teaching; optional short Vietnamese explanations are available when useful. Do not replace essential English examples with Vietnamese-only study.
- State answer format precisely: choose one, enter only the missing word/phrase, give a short original response, or complete an adult-reviewed task. Never have learners guess what input format the grader expects.
- Give visible progress and separate blocking conditions. For Listening, “all questions answered” and “full audio verified for this attempt” are independent conditions.
- Present explicit actions (Start, Next, Save, Submit, Retry, Resume, More Practice, Finish) only when actually supported. No inert or misleading controls.
- Saving, submitting, failed save, restored attempt, pending review, unassessed and scored states MUST truthfully reflect committed state. Never claim save or assessment succeeded before confirmation.
- Preserve draft work during failures, navigation, delayed writes, refresh, retakes and route transitions as supported by the validated store. Offer a safe retry and do not double-submit. A read-only old result stays read-only.
- Feedback should distinguish the targeted misconception, a useful explanation, a narrowly scoped remedial hint/task, and next progression. If the learner repeats the same error, SHOULD link the Error Bank misconception to one compact, clearly identified prerequisite review card before a retake, **only when that feature has been implemented and verified**. Otherwise give a text-based prerequisite recommendation; never invent a functioning link or adaptive score.
- **Accessibility gate:** usable with keyboard, readable on narrow mobile screens, focusable next/submit controls, visible error/status text, legible tables and sufficient contrast. Do not encode success/failure only by color.
- **Content gate:** Markdown/formatting must render safely using supported text/React components; do not execute untrusted HTML or leak active assessment answer keys by sending quiz data to a helper.

## 4. Common academic and assessment-authoring rules (MUST)

**Target and audience.** CEFR A1/A2/B1/B2, when used, is a **target of instruction**, never an automatic grade certification. Match grammar, vocabulary, authentic communication, passage length and inference load to the stated target and young-learner topic suitability. Grade/age must not be equated automatically with CEFR.

**Originality and rights.** Author or appropriately license passages, dialogue, scripts, example tasks, model answers, and media. Check source provenance and record usage scope; do not copy copyrighted commercial exercise banks. Audio/voice production and third-party art need their own rights/provenance record. Owner attestation is evidence of authorization, not proof of exhaustive third-party clearance.

**Question quality.** Every scored MCQ has a demonstrably best answer; distractors are plausible, nontrivial and explainable. Do not rely on trick wording, nonsensical options or the original A/B/C/D order; answer options may be shuffled. “First option” or “Option A” in feedback must not break under shuffle. Verify spelling, grammar, variety, bias, time/location logic, and all candidate response forms.

**Short answer.** Accepted variants, safe normalization and sentence-fit must be defined in advance; reject arbitrary substring matching. Verify each variant inserted into the literal question. Do not claim freeform semantic quality from exact-match rules.

**Extended response.** Mark unreviewed writing, original sentence production, keyword notes and speech performance as pending/provisional/unassessed as appropriate. Do not assign writing quality, argument sophistication, fluency, pronunciation or CEFR level from word count, presence of connectors, multiple-choice recognition, spelling alone or unchecked AI output.

**Feedback and evidence.** For every scored item, identify the reason for the correct answer and the misconception of likely wrong alternatives when useful. Answer explanations must refer to the passage/audio/meaning **without displaying hidden keys before submission**.

**Quality over quantity.** Adding lessons, activities or apparent coverage is not itself a quality outcome. Prioritize actual instructional density, subskill diversity, progression and learner success; a count or percent is not CEFR coverage without a defensible denominator.

## 5. Seven domain standards (MUST)

### 5.1 Grammar — form, meaning and transfer

Teach use/meaning first, show form and contrast, then an independent worked example; highlight common errors and limits of each rule. A1 requires short explanations and familiar contexts; A2/B1 must include genuine distinctions and transfer. Correct gap keys must make literal grammatical sentences, and accepted variations must be defensible. An optional “Remember/Compare”, hints or short Vietnamese clarification may be collapsed by default. Do not treat repeated near-identical forms as independent mastery.

**GRA acceptance:** correct concept and usage; non-leaking demonstration; distinct assessed contexts; misconception-based explanations; no leaked stems/options; valid accepted forms; no inflated mastery statement.

### 5.2 Vocabulary — contextual meaning, chunks, retrieval and use

Teach useful collocations, multiword chunks, word patterns, register and situational use instead of isolated translation lists. Combine **recognition** with at least an opportunity for **retrieval** and an appropriate **new-context use/choice** (the latter may be unscored). Distinguish passive selection from active recall; a chosen definition does not establish productive mastery. Check naturalness, alternatives, form class, spelling and dialect tolerance. Follow-up retrieval timing is advisory.

**VOC acceptance:** authentic context; natural phrases; recognition/retrieval/new context; correct normalized short-answer variants; productive open sentences not blindly scored; no demonstration copying active items.

### 5.3 Reading — real comprehension, strategies and evidence

Use a coherent, original and level-appropriate text. Demonstrate **gist**, **detail**, **inference**, and, where suitable, **purpose** and **vocabulary from context**. Distinguish explicitly stated information from reasonable implications; do not label an almost literal quote as sophisticated inference. Teach skim/scan/meaning as flexible strategies, not a mandatory keyword-finding algorithm. Optional highlight/line-evidence assist or post-submission annotation is allowed; **never require a literal text span before every answer**, especially for inference.

**REA acceptance:** grounded key per item; faithful distractors; inference not invented; independent worked mini-text different from graded passage; optional text evidence; genuine understanding beyond keyword matching.

### 5.4 Listening — actual audio and meaning

Teach a brief listening purpose and situation, then allow a first gist listen and additional focused listen(s) for detail/intent. Clip length and complexity should scale with level; never force an arbitrary number of plays as proof of competence. Use a playable, aligned and rights-cleared **real audio asset** for any audio-based graded item; verify actual full playback by the supported runtime guard **for the corresponding attempt**. Keep transcript, hidden key and other answer-revealing text unavailable before graded submission. If audio is missing or playback cannot be validated, the work is **UNASSESSED for Listening**; a transcript-only script is not hearing evidence. A post-submit transcript/replay is part of feedback.

**LIS acceptance:** original source script matches approved MP3/manifest; comprehension outcomes and plausible options; real-playback guard and transcript timing; device playback QA; shuffling preserves ID/score mapping; no audio => no Listening credit.

### 5.5 Writing — task interpretation through revision

Require the **four-part task model**: Topic / Task / Must Include / Boundary (audience, purpose, required details, length/register limits where relevant). Teach prompt analysis, brainstorm relevant ideas, select/organize, build an outline, draft, self-check and revise. Include a clearly annotated model **on a different prompt** where models would otherwise leak a graded task. Allow a learner to proceed with or without optional AI. Preserve drafts and provide feedback on task response, clarity, organisation, grammar/vocabulary and revision opportunities; judge semantics and argument quality only via a **validated rubric and trusted review**. Form-only/word-count feedback must be explicitly labeled as such. AI feedback is provisional and MUST be checked for unsupported claims, invented content or suspicious over-scoring.

**WRI acceptance:** correct prompt analysis, scaffolded ideation, safe draft persistence, concrete improvements, distinction of form-only vs substantive review, no unsupported CEFR or perfect score.

### 5.6 Speaking — Prepare & Practise, not imaginary automated oral testing

The current core self-learning offering is **“Speaking · Prepare & Practise”**: Situation -> Idea Bank -> Functional Language Toolkit -> Independent Annotated Model -> Keyword Planning -> Unassisted Speak-Aloud -> Self-Check. It should teach how to build a communicative response, not pretend to measure live speech without validated acoustic/human feedback. Phrase-choice multiple-choice tasks check **language-preparation knowledge**, not fluency, intelligibility or oral proficiency. Keyword notes, checkboxes and “I spoke aloud” are **Self-Reported Practice** and oral proficiency **weight 0**. Do not mandate a microphone, upload a private recording or assign a CEFR speaking level. An optional future reviewed recording requires separate consent, privacy, retention, playback and rubric QA.

**Historical safeguard / required forward-only runtime projection:** v1.18.0 `SPE-A2-02` Q1–Q4 have legacy objective MCQ weights of 1 in source data; the inspected Foundation evidence-ingestion path does not treat them as oral Skill Map evidence. MUST preserve all immutable historical attempt records, version-pinned objective scores, results and package digests. At runtime, the learner-facing result and any dashboard/Skill Map aggregation MUST use a **version-aware, read-only semantic projection** for those historical question IDs: `language_preparation_knowledge` with projected `oral_proficiency_weight: 0`. Keep the original correctness score visible *only as language-preparation practice*; never inflate oral Speaking evidence or alter persisted evidence/snapshots. Projection metadata is a presentation/derived-view contract, **not** permission to insert unknown fields into the current curriculum schema. Until the UI projection is implemented and tested, mark its implementation gate NOT TESTED rather than claiming it already works.

**SPE acceptance:** communicative scenario, useful phrase functions, independent model, short keyword plan, unsupervised rehearsal, explicit self-report and non-scoring status, historical preservation.

### 5.7 Pronunciation — sound-symbol versus hearing versus production

Treat three types of task distinctly:
1. **Written/IPA awareness** (e.g., choosing which written word contains a symbol): tests symbol knowledge, **not** evidence that the learner heard or produced that sound.
2. **Audio discrimination** (minimal pairs, stress/intonation heard from verified recordings): may become objectively scored only with real linked audio, blind stimulus presentation, validated keys, actual playback and independent review.
3. **Oral production** (repetition, shadowing, recording/self-listening): **unassessed** for phonetic accuracy until human or validated acoustic assessment.

Teach clear word/sentence models, contrasting sounds, stress cues and simple mouth-placement guidance without pretending every spoken voice follows an absolute rule. Different stimuli in demonstrations and scored trials prevent leakage. No filename/alt text/tooltip may reveal a test stimulus before its answer.

**PRO example gate:** planned `feet/fit` and `beat/bit` MP3 trials in Stage 3 are not scored merely because an owner listening checklist was ticked. **All audio-discrimination tasks lacking verified physical audio files, aligned manifests and verified playback MUST default to `UNASSESSED` (`evidence_weight: 0`)**, not a zero score or a synthetic written answer. Before audio playback, their multiple-choice options and stimulus controls MUST NOT expose any IPA symbols, text labels, spelling cues, filenames or accessibility metadata that identify the correct heard word or otherwise leak the hidden audio key. After verified playback, answer choices may be displayed if they do not identify the correct choice before the learner responds. This gate applies to *heard-word discrimination*, not separate explicitly labeled unassessed/knowledge-only written IPA awareness exercises. Asset provenance, blind-listening QA, browser mapping, rights and player safeguards must pass before any audio-based score. Keep an independently inspectable asset manifest (actual SHA-256 and measured duration only after files exist).

**PRO acceptance:** phonetic accuracy, authentic differentiated audio if tested, clear ear-training vs speech labels, no unsupported pronunciation/CEFR score.

## 6. Evidence taxonomy, progress and CEFR integrity (MUST)

| Category | Examples | Can show | Cannot claim |
| --- | --- | --- | --- |
| **Progress / exposure** (weight 0 for proficiency) | explanation viewed, guided step, self-check, self-reported speaking | “Viewed”, “Practised”, “Completed step” when actually recorded | independently demonstrated proficiency |
| **Objective practice evidence** (task-level weight 1 only when validated) | fully independent grammar/vocab/reading MCQ or short answer; listening/audio-choice after genuine playback | accuracy, subskill/error pattern with coverage caveats | formal CEFR certification or productive spoken/written ability |
| **Provisional / review-required** (weight 0 until trusted review) | original writing, open sentence, planning note, oral recording without authorised review | submitted/pending review, feedback once actually supplied | automatic semantic perfection, oral fluency, CEFR result |

**CEFR target ≠ objective item score ≠ progress completion ≠ supported proficiency estimate ≠ certified CEFR level.** Never conflate these. A Skill Map / diagnostic estimate requires an explicitly documented validated rule, repeated sufficiently diverse evidence and honest confidence/coverage notes; a single activity or correlated retakes do not prove level. Not all seven displayed domains are necessarily independently assessed.

- Preserve existing `skill_tags`, answer keys, stored attempts, evidence IDs, prior review status and snapshots. Revisions to tag meaning or evidence meaning require a reviewed **new content/runtime version** and never retroactive grading.
- Avoid duplicate counting of evidence across course views. Separate unique questions, attempt-level accuracy, attempts/retries, pending human review, completion and claimed ability.
- Display “Not assessed”, “Pending review”, “Objective practice result” or “Provisional AI feedback” where appropriate; never silently convert missing media to a numeric zero or score.
- The schema's historical `evidence_weight` is not itself proof that every module feeds a particular ability aggregator; verify actual data flow.

## 7. AI, affordability, privacy and honesty (MUST)

- **Free-first, static/deterministic teaching core:** learner should be able to read lessons, practise objective items and receive pre-authored feedback **without paid AI or a live Gemini call**. AI can enrich explanations or help review writing when explicitly requested; it must not become a mandatory dependency for ordinary study.
- **AI Tutor language, rendering and privacy contract:** AI Tutor is **opt-in** and limited to learner-visible knowledge/overview context. Do not send unsubmitted assessment items or answers, secret keys, arbitrary private Drive files, credentials, or unrelated learner data to Gemini. When an opt-in question is asked in **Vietnamese (accented or unaccented)**, the response MUST be in **Vietnamese**, retaining English target examples and phrases; a question in English receives a clear English explanation. AI output MUST be rendered with **safe React text/Markdown components** so supported `**bold**` and lists display as formatting, never as raw unrendered markers, and untrusted HTML/scripts never execute. Treat the question and lesson text as untrusted content. Preserve concise age-appropriate guidance and honest uncertainty/fallback messaging.
- AI grading and natural-language feedback are not automatically reliable or certified. A model's high score, unsupported factual correction or invented quote MUST not be promoted to durable mastery evidence without the applicable validation/review rule.
- Collect minimum learner data required; no public personal details or private credentials embedded in content, GitHub, prompts or logs. Use learner-safe, age-appropriate examples; do not solicit real addresses, phone numbers, secrets or legal identity to complete speaking/writing exercises.
- **AI independence and full offline are different requirements.** A free static site that still needs a network is not “100% offline.” Only claim offline support after real pre-cached bundle/audio, local attempt persistence, reload and reconnection testing, including mobile. Until proven, report **OFFLINE NOT VERIFIED / NOT READY**. Do not invent a paid backend requirement.
- Preserve the English site's separation from Math; never alter Math Firebase hosting, Auth, rules, billing or database namespaces as an incidental English content release.

## 8. Versioning, media provenance and data protection (MUST)

- Use an immutable **cumulative curriculum package** compatible with the live importer, not a partial lesson JSON pasted over a released package. New `schema_version`, unchanged prior package, stable globally unique lesson/item IDs, validated sequence, answer keys and required fields. Do not invent runtime fields unsupported by `validateSeed`.
- Each candidate records expected *Add / Update / Skip / Conflict* and a defensible diff (new lesson, changed approved fields, unchanged activities/media, etc.). Unexpected changes are blockers; compare source texts and package hashes.
- Source-level output, candidate file, code merged, curriculum **imported** and production **deployed** are five distinct states. A preview or GitHub commit must not be presented as a live lesson.
- Audio manifests MUST include true source-to-asset mapping, actual decoded/played file identity where possible, SHA-256 and metadata from **real** artifacts, licensing/provenance and human listening QA. A trial MP3 without proof is not automatically release-ready.
- An attempted/submitted record is pinned to its content version. An old attempt views old questions, keys, content, original order if stored, score and review as saved. Retake/revision is a new attempt linked to historical provenance, not mutation. No destructive migrations, bulk resets or regrading without explicit separately reviewed authorization.
- **Implementation compatibility:** runtime restrictions (importer file size, max lessons, allowed tags, media capabilities) must be freshly measured from current code/tests. Do not hardcode historically obsolete size/count claims into this standard.

## 9. One practical workflow per task (MUST)

The following is the **only active SLE operating process**. All other dated guidance is historical evidence, not a parallel checklist. The core rule is *one source of truth, one PR QA, one deliberate release, one brief learner check*.

**A. Create or revise educational content:** (1) Define the missing learning outcome and learner-visible explanation/model/practice/feedback; (2) validate keys, CEFR target, copyrights and media provenance; (3) obtain independent NotebookLM review only for substantive pedagogy/meaning/evidence changes; (4) reconcile required changes in this canonical standard and/or source code; (5) create a new cumulative immutable curriculum version when scored item/tag/meaning changes; (6) use one PR and its automatic `qa` check. Small UI-only or documentation-only fixes do **not** need another full independent academic review if they preserve item meaning and evidence.

**B. NotebookLM review — the only active review method:** Maintain the current permanent English academic sources and current version of this standard as durable references. KEEP permanent sources, REMOVE previous temporary packets, ADD only the current human-readable packet. Put full questions, evidence, conditions and verdict format *in the packet*. Use a **short** NotebookLM chat request. One .md/.txt source is linked directly; two or more new sources are bundled into one ZIP. Do not upload raw machine JSON or duplicate active baseline rules. After the verdict, make required corrections in GitHub and record reconciliation in the PR; no new permanent review-rule document.

**C. Technical QA — one automatic check:** A PR into `main` runs the existing `qa` GitHub Actions job once on the latest source. It checks current tests, code, permissions/rights where applicable, audio, TypeScript and build. The required `qa` check must PASS on the **actual PR head/merge candidate**; old PASS or a cancelled run is not evidence. No extra user-initiated QA workflow and no Preview Hosting prerequisite. Retire obsolete release branches after their content is integrated, rather than accumulating new long-lived tracks.

**D. Release — one approved path:** After content, rights, migration and PR QA gates pass, the owner authorizes production release; the reviewed PR is squash-merged into protected `main` with an explicit `[release-english]` marker. A GitHub Actions release workflow runs full `qa:release` **before** deploying the exact checked commit to Firebase project `roadmap-toan-ai`, target `english`, channel `live`. Pushes without that marker cannot deploy. No separate Firebase Preview and no deploy of Math. Record the deployment action and HTTP/MP3 live checks separately; a deployment can succeed while later smoke fails.

**E. Learner-facing acceptance after release:** For small, backwards-compatible improvements with deterministic PASS, **one compact owner spot-check on the actual live English website** suffices: read/practise/feedback, Listening audio, resume one fictional attempt, optionally Gemini and phone layout. Unverified capabilities are marked NOT TESTED; do not claim AI quality, perfect accessibility, fully offline access or CEFR certification without appropriate real evidence. For destructive storage changes, unclear rights, wrong answer keys, private data exposure or changes to scored evidence, STOP before LIVE until the relevant pre-release verification is complete. Keep rollback available.

**Operating economy:** Use public standard GitHub Actions Linux runners and one bounded job per PR; cancel superseded PR runs, no paid/self-hosted runners, duplicate push-build loops or scheduled deployment checks. Source-level CI, live Gemini responses and real-device usability remain distinct facts, but should be recorded in the **same PR**, not three new governance documents. Work/browser tools are optional, not required to navigate GitHub on every release.

## 10. Release gates and pass/fail checklist (MUST)

A candidate is **not releasable** unless applicable gates below have recorded **PASS**, or **NOT APPLICABLE with defensible reason**. “Not tested”, “planned” and “owner ticked a trial checklist” do not equal technical PASS.

| Gate | Mandatory observable evidence | Reject / block when |
| --- | --- | --- |
| **EDU-01 Goal & context** | learner-visible meaningful outcome, age/level, specific use case | vague or purely score-driven lesson |
| **EDU-02 Concept & worked method** | correct explicit teaching and independent worked demonstration | question-only page; model leaks active quiz |
| **EDU-03 Independent transfer** | distinct valid exercise/context; proper objective or unassessed label | answer copied; trivia instead of target skill |
| **EDU-04 Explanatory repair** | feedback explains likely errors and useful next action | only right/wrong, false success |
| **ACA-01 Accuracy & originality** | whole text, every key/variant/tag checked; rights/provenance | ambiguous key, factual error, unlicensed content |
| **ACA-02 CEFR & evidence honesty** | target level and evidence type separated; no unearned ability | CEFR “certified”, speech score from text |
| **MOD-01 Domain guard** | skill-specific checks from Section 5 | e.g. Reading literal-match-only, Listening without audio |
| **DAT-01 Immutability & scope** | version diff, stable IDs, preserved old attempts, count comparison | old keys/attempts silently rewritten |
| **MED-01 Media integrity (if applicable)** | real file, aligned manifest, rights and verified playback; audio-discrimination task defaults to `UNASSESSED` / weight 0 until verified; no pre-playback visible/accessible spelling or IPA key cue | absent/unverified audio scored; stimulus exposed before listening |
| **UX-01 Accessibility & resilience** | deterministic test of save/error/retake + one short post-release live owner check for low-risk additions; pre-release real-device check for destructive/unknown migration or high-risk changes | actual data loss, user blocked without guidance, or untested dangerous migration |
| **AI-01 Optional and safe (if applicable)** | deterministic fallback, context-only prompt, safe rendering, no answer leak | mandatory AI, private content sent, unsafe rendering |
| **OFF-01 Honest offline disclosure** | tested real offline paths or explicit “not verified” | unsupported offline marketing claim |
| **REL-01 Final release check** | applicable academic verdict/reconciled required changes, exact-current-commit CI, approved rights/data protection, explicit owner authorization, English-only deployment then live smoke + spot check/rollback | unapproved deployment, unresolved hard blocker, failed CI or calling a draft/commit 'live' |

**Status vocabulary:** `PASS`; `PASS_WITH_REQUIRED_CHANGES` (blocked pending corrections); `FAIL`; `NOT_TESTED`; `NOT_APPLICABLE`. For independent review, return required changes with exact lesson/item ID, problem, correction and retest requirement; optional improvements separately. Academic approval and engineering/production approval are independent gates.

**UX exception for small backwards-compatible releases:** A reviewer verdict of NO-GO **solely** because a real-device smoke has not yet been performed may be resolved by owner-authorized direct production release followed by a short live check, provided deterministic QA passed, old records cannot be lost by the change, all required academic corrections are implemented and the release has rollback. Record that browser/Gemini remain unverified until actually tested. This does **not** waive audio rights, correct scoring, storage invariants, protected learner data or any other zero-tolerance blocker.

**Zero-tolerance blockers:** wrong assessment key, pre-submit answer leak, fabricated proficiency/CEFR, scoring Listening without real playback, false save success, historical record corruption, insecure private data exposure, unapproved media rights, or unverified production deployment claim.

**Policy scope note (2026-11-03):** From this date all operational CI, NotebookLM review, QA, deployment and release gates are governed here, not in separate dated documents. The prior Stage 3 `NO-GO` from NotebookLM remains preserved as historical evidence; current mitigations do not convert untested live Gemini/mobile UX into PASS. Owner-initiated release after full CI is treated as a deliberate acceptance of a limited post-release visual spot check only for backwards-compatible changes.

## 11. Updating this single living standard (MUST)

Use `major.minor.patch`: **major** for a policy redesign or changed evidence meaning; **minor** for new or substantially revised subject-specific obligations; **patch** for unambiguous clarifications/examples without changed requirements. Each change requires:

1. A brief change proposal identifying the learner problem, exact affected sections, reason/source (including NotebookLM verdict where applicable) and compatibility with current curriculum/runtime.
2. A Git diff to **this same canonical file**, plus an entry in the change register below; never create parallel current rule documents.
3. Independent NotebookLM review for new/changed substantive academic, pedagogical or evidence rules; engineering/privacy review when the change affects technology or data.
4. Owner approval, adoption commit, effective version/date and explicit downstream checklist/test changes.
5. No retroactive rewriting of immutable released curriculum, attempts or recorded grades. A new standard may require **prospective** lessons or tooling changes, with an explicit migration plan only if separately authorized.

**Disagreements:** prefer protecting learners and stored evidence while questions are unresolved; mark `REQUIRES_DECISION` and do not declare production-ready. A proposed exception must name its scope, expiration/review trigger, risk and approval. Exceptions do not become de facto new standards.

### Change register

| Standard version | Date | Status | Summary | Approval / effective commit |
| --- | --- | --- | --- | --- |
| 1.1.1 | 2026-11-04 | PROPOSED EDITORIAL CLARIFICATION — not effective before merge | State long-term A1–B2, future C1/C2, exam preparation as downstream application, varied learner paths and honest provisional skill evidence; no new authoring/release gates | Owner direction in SLE conversation, 2026-11-04; academic review if reviewer identifies a substantive rule change; owner-approved merge required |
| 1.0.0 | 2026-11-02 | ACADEMIC GO / ADOPTION ON PR #71 MERGE | Unified existing authoring/UX/evidence standards; incorporated NotebookLM mandatory amendments C1–C4 (baseline relationship, legacy Speaking projection, audio gate/masking, bilingual safe AI rendering). No curriculum/code release implied | Owner instructed adoption after review (2026-11-02); effective when GitHub PR #71 merge is confirmed; refer to its merge commit |

### Independent academic review record (2026-11-02)

NotebookLM returned `PASS_WITH_REQUIRED_CHANGES`, `ACADEMIC ADOPTION GO`, and `PRODUCTION NO-GO` for standard draft 1.0.0. Required corrections were incorporated in Sections 0.1, 5.6, 5.7, 7 and MED-01. The existing independently approved pedagogical baseline is retained; a standards approval must not be misread as final QA or authorization to merge/deploy pending website PRs #68–#70. Optional one-screen prerequisite Error Bank repair and split study visits are guidance, not required new runtime features. The owner directed adoption after NotebookLM review on 2026-11-02; successful PR #71 merge establishes the effective Git revision. No code or content PR becomes approved merely because this policy is adopted.

## 12. Historical checkpoint evidence (dated snapshots, not standing policy)

This section is a **snapshot**, not a live status dashboard; review it when adopting the standard.

- The base production checkpoint stated in the project is v1.18.0 with 109 lessons, 913 activities and 38 MP3 assets; do not confuse approved pedagogy with a deployed version. Candidate v1.18.1 and associated UI PRs #68, #69, #70 are review changes.
- Stage 3 academic packet was reported `PASS_WITH_REQUIRED_CHANGES` with **academic GO**, **production NO-GO**. The academic design is not proof that code is built, media audited, mobile UI checked, learner storage offline, or deployed.
- Source code has a per-attempt option-shuffling implementation for modern curriculum versions, but specific Listening browser QA must be performed; original all-A source keys alone are not proof of a defect.
- Speaking legacy objective MCQs represent language-preparation knowledge; they do not certify oral ability. A new self-check is non-scoring.
- Pronunciation audio trial reports include owner listening acceptance, but blind listening/media linking/provenance/runtime release checks must be separate.
- The repo's historical authoring document mentions obsolete bounded package counts; the current importer `MAX_CURRICULUM_LESSONS` is 150 at the inspected release branch, with up to 24 activities per lesson. Other importer/server limits must be freshly reverified rather than assumed.
- Full offline operation remains unverified, and English AI Tutor bilingual/Markdown changes on draft PR #68 remain unverified in live browser.

**Revision 2026-11-03 (1.1.0):** Single authoritative rules file for academic authoring, NotebookLM review, CI, release and short owner QA. Manual Preview workflow removed; release occurs only after an explicitly authorized protected-main merge with a release marker and mandatory QA. No rewrite of existing scored content or learner attempts.

## 13. Independent NotebookLM review checklist for initial adoption and future revisions

The reviewer must evaluate the **entire candidate** against the five current permanent English sources and applicable approved Stage 1–3 verdicts. Where a source is absent or contradicts another, name the evidence limit. Do not infer tested runtime behavior from proposed standards.

**Q1.** Are Sections 0 and 11 logically sufficient to guarantee one current standard, controlled amendments, no retroactive learner-record impact and no duplicated governing documents?  
**Q2.** Is the 4-core / 4-adaptive lesson contract sound, proportionate for A1–B1 young learners, and realistic for mobile self-study without forced screen overload?  
**Q3.** Does the standard adequately distinguish a **teaching platform** from a question bank, including error repair, independent demonstration, authentic transfer and clear next action?  
**Q4.** Are the Grammar and Vocabulary rules academically accurate, CEFR appropriate, and precise about productive versus recognition evidence?  
**Q5.** Are Reading gist/detail/inference/author-purpose and optional evidence-highlighting safeguards clear enough to prevent mechanical keyword-matching?  
**Q6.** Are Listening audio/playback/transcript constraints rigorous without adding impossible or unsupported restrictions?  
**Q7.** Are Writing task analysis, model separation, draft safety and semantic review boundaries sufficient?  
**Q8.** Are Speaking Preparation and Pronunciation correctly separated into language-knowledge, heard discrimination, oral self-practice and reviewed performance without false ability/CEFR claims?  
**Q9.** Is the evidence/progress taxonomy, versioned immutable attempt logic, MCQ shuffling and retake treatment coherent with current source contracts?  
**Q10.** Are optional AI, child privacy, originality/media provenance and offline honesty requirements comprehensive and proportionate?  
**Q11.** Does the single pipeline in Sections 9–10 give testable and efficient approval gates without implying that NotebookLM review automatically deploys code?  
**Q12.** Identify exact contradictions, obsolete claims, missing blockers, ambiguous terminology or rules that cannot be implemented in the inspected runtime. For each give an exact corrected sentence or section and severity.

**Required verdict:** `PASS` / `PASS_WITH_REQUIRED_CHANGES` / `FAIL` / `INSUFFICIENT_EVIDENCE`; return (a) critical contradictions and line/section references; (b) required corrected text; (c) optional improvements; (d) academic adoption GO/NO-GO; (e) engineering implementation GO/NO-GO **separately**. A PASS approves a policy proposal, not any pending curriculum/audio/code or production release.
