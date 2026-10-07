# WCV2-A pilot implementation

Starting source: `9848a48d28495b71ad7f45f504a6dfa87cc06444`.
Branch: `writing-course-v2-a-20261006`.
Implementation follows `WRITING_COURSE_V2_RECONCILED_20261006.md`, not the original packet.

## Published pilot scope

- Writing remains the skill/module, with About this course, optional Writing Foundations, and English Writing Coach · 12 Weeks entry points. Independent Foundation lessons remain available; Independent Practice and My Writing / Review are future labels only.
- Overview explains learner age/grade/starting range, the five-part weekly rhythm, 25–35 minutes with two sessions, optional AI and progress/proficiency separation.
- Six concise reference units link to relevant weekly outlines. Week 1 links directly to Understand the Task.
- Twelve cards use the reconciled order and show goals, Learn/Guided/Main, time and scaffold level. Only Week 1 is published; Weeks 2–12 are previews.
- Week 1 Learn annotates the existing garden prompt and contrasts an off-topic home-garden idea. Guided Practice uses a separate Friday reading-club prompt with four objective questions, feedback, explanations and one retry.
- Garden Main Practice preserves analysis → brainstorm → outline → writing → feedback and explicit Continue after checking. Current text is saved before optional AI and stale results are rejected if the draft changed while checking.

## Evidence and persistence

`writingCourseV2` is an additive field in existing learner state; there is no new storage schema or migration. Legacy analysis keys (`keywords`, `limits`, `offtopic`), drafts, revisions and previous evidence are retained. Main Practice renders only `topic`, `task`, `keywords`, and `limits`; its checking payload and Basic Structure denominator use the same four fields. Stored `offtopic` is neither rendered nor required for completion or Review/model unlock, and edits preserve it through the existing nested-state merge. Off-topic ideas remain taught in Learn and Guided Practice.

Guided answer records have versioned question IDs, weight 1, tag `writing.task_understanding`, `kind: practice` and proficiency weight 0. First answer and the permitted retry both count in the displayed correct/total denominator; duplicate record IDs do not count twice. This pilot practice ledger is shown separately in Skill Map and Guided Practice; it is not injected into CEFR inference or the Foundation/P2A historical attempt bank.

New deterministic free-form events record progress only: weight 0, proficiency weight 0, score 0 and provisional status. Existing historical evidence is not rewritten. Validated AI/adult review contracts and reviewed language evidence are retained. P1 course progress continues to show the existing four Main Practice steps; Guided Practice and reflection status are separate.

All new route changes reuse the existing Foundation and Writing save-before-leave gate. Failed saving blocks navigation and leaves work on screen. Guided checks also have a synchronous pending lock to prevent a double click from consuming the retry.

## Feedback and help safety

The four-card Step-by-Step Helper explicitly checks fields and listed words, never semantics. A missing keyword is not treated as proof that alternative wording is wrong. Guided Check (Basic Structure) includes the required meaning/grammar limitation. No deterministic quality scores are produced.

During active work, generated full corrections/examples are not exposed. Validated review observations retain their scores and show the learner's original text, the specific `why` explanation and optional `hint`, followed by an explicit self-revision instruction. They never render `revised` or a correction-reveal control during active work. A presentation-only duplicate-answer guard also suppresses an explanation/hint that repeats the full corrected sentence/paragraph; ordinary explanations remain visible without truncation. Providers, prompts, Firebase transport and stored reviews are unchanged. The previous complete-answer fill shortcut is removed.

The complete comparison response lives only in final Review. It requires all four saved/submitted Main Practice stages, the four nonempty current analysis fields plus nonempty Brainstorm/Outline fields (not legacy `offtopic`), a draft of at least 35 words and an exact matching saved submission signature. It stays hidden until Compare with a model is explicitly clicked. Editing work locks it; a new submission remounts Review with reveal reset. Reflection does not produce proficiency evidence.

## Local release gate

- `pnpm install --frozen-lockfile`
- `node tests/writing-course-v2-a.cjs` (27 cases)
- `pnpm qa:core` (16 commands, including the pilot and G3-E reliability)
- `pnpm qa:full` (50 commands)
- `pnpm qa:release` (full suite, TypeScript, Firebase static production build and static/security QA)

Tests use fixtures, in-memory/browser-storage adapters and mocked providers. No real AI request, deployment or GitHub-hosted Actions is part of this gate.

## Future owner browser QA — not executed in this implementation task

When a separate preview is authorized, check desktop and mobile:

1. Writing exposes all three entry points; future-only labels cannot open unpublished content.
2. Overview, six references and Week 1 links work; Weeks 2–12 remain previews.
3. Guided answers show explanations, exactly one retry and restored correct/total counts after reload.
4. Existing Garden work and feedback remain saved; checks stay on their step until Continue.
5. Editing clears stale completion; failed saves prevent leaving for every new route.
6. Main Practice has exactly four analysis inputs, each with a helper card; legacy `offtopic` remains saved but hidden and optional. Active AI corrections display explanation/hint and the original learner text, but no revised answer or reveal control.
7. No complete answer appears in active work or AI feedback. Final Review comparison is locked until a complete saved submission and an explicit click; an edited or newly submitted draft resets the reveal.
8. Reflection restores after reload; Skill Map practice accuracy remains separate from proficiency, active course selection and Foundation progress.

No preview/live deployment is authorized. Curriculum 1.11.0, Listening MP3s, G3-E lifecycle/provider/model/App Check/Remote Config and Hosting configuration must remain byte-for-byte unchanged.
