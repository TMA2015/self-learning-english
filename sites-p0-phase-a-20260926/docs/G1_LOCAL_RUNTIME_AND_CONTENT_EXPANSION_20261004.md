# G1 Local Runtime and Academic Expansion Gate — 2026-10-04

Status: **IMPLEMENTING / CONTENT EXPANSION ALLOWED WITH GUARDS**

## 1. Owner direction

Technical work should be automated as far as practical. Do not add paid or unnecessary services. The owner should only need to intervene for account-level approvals, security configuration, or product QA that cannot be performed through repository automation.

AI is optional and shared at the architecture level across Self-Learning English and Self-Learning Math.

## 2. G1 deterministic runtime

The application now has a dual-runtime path:

- Sites/runtime mode -> existing server API + D1.
- Browser mode -> browser-local repositories + the same application/domain services.

Build switch:

`NEXT_PUBLIC_LEARNING_RUNTIME=browser`

The switch is build-time only; it is not learner data and carries no secret.

G1 currently routes these learner flows through the browser runtime when enabled:

- learner state load/save;
- Foundation curriculum catalog and lesson load;
- attempt start;
- draft save;
- deterministic submit/scoring;
- Listening playback state logic where static audio is available;
- local practice progress projection.

Curriculum 1.6.1 is bundled as immutable source content for the browser runtime. It is imported idempotently into the browser repository.

The Sites path remains unchanged for normal production builds.

## 3. Evidence and Skill system readiness

### GO — objective practice expansion

The existing evidence pipeline is sufficiently coherent for expanding objective practice content.

Objective Foundation questions:

1. are scored deterministically from versioned answer keys;
2. retain content/package/version identity;
3. write question-level Evidence;
4. map content tags through the canonical skill-tag map;
5. feed subskill totals, recurring errors and learner priorities;
6. feed Practice Progress, repeated mistakes and Suggested Practice;
7. preserve historical attempts across curriculum versions.

### Important guard: practice must not inflate CEFR

Ordinary practice evidence should improve the learner's skill history and recommendations without automatically pretending to be a formal CEFR measurement.

The current learner model already separates these concerns:

- Practice/lesson accuracy -> subskills, errors, priorities and progress.
- Level-bearing calibrated evidence -> provisional skill-level estimates.
- Writing level -> reviewed/AI evidence only.
- Speaking -> remains unassessed until a reliable evaluator exists.

This separation must be preserved while the question bank grows.

## 4. Expansion status by skill

| Skill | Expansion status | Rule |
| --- | --- | --- |
| Grammar | **GO** | expand breadth/depth using stable canonical tags |
| Vocabulary | **GO** | expand meaning-in-context, collocation, formation and range |
| Reading | **GO** | expand gist/detail/inference/vocabulary-in-context |
| Listening | **GO WITH AUDIO GATE** | only scored when genuine playback requirements are met |
| Writing objective/support exercises | **GO** | deterministic analysis/organization exercises are safe |
| Writing extended responses | **LIMITED** | expand carefully; unify automatic evaluator first |
| Speaking practice | **PRACTICE-ONLY** | prompts/recording can expand, but do not assign level yet |
| Pronunciation | **PRACTICE-ONLY** | no unsupported proficiency claim |
| Diagnostic | **CONTROLLED** | balance coverage/difficulty; do not mass-add uncalibrated questions |

## 5. Academic expansion rules

Every new objective activity should have:

- immutable activity ID;
- curriculum version;
- one primary learning objective;
- canonical skill tag(s);
- CEFR target as curriculum metadata, not certification;
- explicit answer key;
- concise English explanation;
- optional Vietnamese support;
- plausible distractors;
- no copied textbook exercise;
- evidence weight appropriate to the task;
- compatibility with version-aware attempts.

Avoid:

- duplicate questions with cosmetic wording changes;
- multiple nearly identical tags;
- questions whose "correct" answer depends on ambiguous context;
- using AI judgment when a deterministic answer key is possible;
- adding a new tag without mapping it into the learner model.

## 6. Content expansion order

Recommended next content sequence while G1/G2 technical work continues:

1. Grammar A1/A2 breadth and repetition density.
2. Vocabulary A1/A2 practice density.
3. Reading A1/A2 passage/question density.
4. Listening A1/A2 with verified static audio.
5. Writing objective support activities.
6. B1 expansion after A1/A2 coverage is balanced.

The goal is not merely lesson count. Each important subskill should have enough distinct questions across contexts for repeated practice and reliable Error Bank/Suggested Practice behavior.

## 7. Academic QA remains NotebookLM

Gemini in the deployed application is an optional learner-facing AI provider.

Independent academic curriculum review continues to use the established NotebookLM workflow:

- permanent baseline project/rules sources;
- temporary per-batch audit packet;
- explicit PASS / REVISE / BLOCK reconciliation;
- corrected package only after audit.

Do not use learner-facing Gemini integration as a substitute for curriculum QA.

## 8. Firebase AI Logic decision

Firebase AI Logic is now the preferred AI-integration candidate to evaluate before building a custom proxy.

Current Google documentation states that Firebase AI Logic:

- provides Web client SDKs;
- routes requests through a Firebase proxy service;
- can use the Gemini Developer API free tier;
- keeps Gemini provider credentials on the server rather than embedding them in the web bundle;
- supports Firebase App Check to reduce abuse.

This fits the GitHub Pages architecture better than embedding a Gemini key or immediately maintaining a custom Worker.

Possible organization:

- one Google/Firebase account;
- one Firebase project for Self-Learning English;
- one Firebase project for Self-Learning Math;
- same architecture/provider contract in both apps.

Separate projects are preferred if we want clean quotas, App Check configuration, usage reporting and isolation. A single Firebase project remains technically possible but is not required.

No Firebase project needs to be created during G1. Add it only when the deterministic GitHub-only path is stable.

## 9. G1 acceptance gate

G1 is ready to advance when CI proves:

- Curriculum 1.6.1 loads from bundled JSON;
- at least one Grammar lesson runs without D1;
- attempt and draft survive browser repository recreation;
- deterministic scoring produces progress;
- learner state reloads from browser storage;
- existing Sites build still passes;
- version-aware and content-quality regressions still pass.

After that, proceed to:

- local course selection;
- local diagnostic objective path;
- local Error Bank/Skill Map parity;
- backup/restore UI;
- static GitHub Pages export.
