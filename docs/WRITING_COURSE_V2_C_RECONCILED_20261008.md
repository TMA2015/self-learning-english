# Writing Course v2-C — Reconciled Academic Design

Date: 2026-10-08  
Status: ACADEMICALLY CLEARED FOR WCV2-C IMPLEMENTATION  
Base application checkpoint: `9a99f73eda9102fd69caa5b0fee869a012975175`  
NotebookLM verdict: PASS-WITH-CHANGES

## 1. Scope

Implement Weeks 7–12 only:

- Week 7 — Paragraph Construction
- Week 8 — Connecting Ideas & Paragraphs
- Week 9 — Applied Grammar & Self-Editing
- Week 10 — Draft Revision & Self-Correction
- Week 11 — Guided Multi-Paragraph Challenge
- Week 12 — Independent Writing

The high-level Weeks 7–12 order is academically approved and remains unchanged.

## 2. Shared lesson rhythm

Weeks 7–11 retain:

Learn → Guided Practice → Main Practice → Feedback & Revision → Review

Week 12 uses:

Learn → Optional Self-Readiness / Scratchpad → Main Practice → Feedback & Revision → Review

The Week 12 readiness step is optional and must never block Main Practice.

## 3. Shared active-work help policy

Allowed during active work:
- short explanations;
- guiding questions;
- checklists;
- short hints;
- optional sentence starters where justified;
- structural counts/presence checks;
- objective checking for predetermined Guided Practice items.

Not allowed during active work:
- full model answer for the current Main Practice task;
- complete rewritten learner response;
- generated paragraph from learner notes;
- automatic replacement draft;
- CEFR claims from rule-based checks;
- semantic-quality, coherence, relevance, grammar-quality, or argument-quality claims from string/keyword heuristics.

## 4. Post-submission model labeling — mandatory

Every post-submission model display in Weeks 7–12 must be labeled exactly:

**One Possible Sample Response (Not the Only Way)**

The learner must first:
- complete/save their own required attempt;
- enter Review;
- explicitly choose to reveal the sample.

The sample must never be described as “the correct answer”.

## 5. Deterministic fallback boundary — mandatory

Free-form deterministic checks may report only:
- required section present/missing;
- approximate word count;
- approximate sentence count;
- approximate paragraph count;
- visible punctuation/capitalization markers;
- explicit presence of a lesson-target connecting word where relevant;
- checklist completion;
- surface text-difference facts.

They must never claim:
- idea relevance;
- logical strength;
- semantic coherence;
- grammar correctness;
- quality of evidence;
- paragraph quality;
- revision quality;
- improvement quality;
- CEFR level;
- Writing proficiency.

Use:
**Guided Check (Basic Structure)**

Keep:
“This check verifies required parts and words. It does not evaluate full meaning or grammar accuracy.”

For Weeks 7–12, add where relevant:
“Meaning, organization quality and language accuracy need AI or teacher review.”

For Before/After comparisons, use wording equivalent to:

**Surface changes detected: X words modified. Guided Check verifies structure only; full meaning, style and grammar accuracy need AI or teacher review.**

If no surface change is detected, state that fact neutrally. Never say the revision is better/worse.

## 6. Evidence policy

### Objective Guided Practice
Only fixed-context items with defensible predetermined answers:
- evidence weight 1;
- proficiency weight 0;
- kind: practice.

Suggested tags:
- Week 7: `writing.paragraph_structure`
- Week 8: `writing.cohesion`
- Week 9: `writing.grammar_accuracy` or existing compatible grammar/editing practice tag
- Week 10: `writing.revision`
- Week 11: `writing.organization`

Week 12 optional scratchpad/readiness:
- must not carry required scored evidence;
- scratchpad is progress-only/unscored;
- any optional fixed-context readiness item, if implemented at all, must be skippable and must not block Main Practice.

### Free-form work
All free-form drafts, edits, revisions and capstone writing:
- evidence weight 0 for automated proficiency;
- proficiency weight 0;
- provisional;
- progress/completion only.

## 7. Cross-week draft safety

Weeks 9 and 10 may reuse the learner’s saved Week 7/8/9 work.

Mandatory:
- original saved drafts are immutable;
- selecting an earlier draft creates a working copy;
- edits/revisions create a new snapshot;
- before/after history remains available;
- no edit may overwrite the source snapshot.

If no suitable earlier learner draft exists, provide two fallback choices:

### Choice A — Write a short fallback draft
- one simple prompt;
- one paragraph;
- approximately 40–60 words;
- learner-authored.

### Choice B — Load Sample Student Draft
- one click;
- clearly labeled **Sample Student Draft — practice text, not your own writing**;
- fixed reviewed text;
- separate prompt from the learner’s current Main Practice task;
- may be used only to practise editing/revision skills;
- must not be presented as a model answer;
- must not enter the learner-owned writing portfolio as their own work;
- remains proficiency weight 0.

A sample-draft path may complete the editing/revision practice activity, but it must remain visibly distinguished from learner-authored work.

## 8. Week 7 — Paragraph Construction

### Goal
Build one connected paragraph from a main idea and support.

### Foundation links
Organize Writing + Write Clear Sentences

### Learn
Teach:
- **Opening / Main Point** — introduces the paragraph’s main idea.
- **Support** — gives a reason, explanation or useful information.
- **Specific Support** — adds a concrete example/detail.
- **Optional Wrap-Up** — may finish the paragraph naturally when useful.

Mandatory academic correction:
**Wrap-Up / Closing Thought is optional.**

Teach explicitly:
A short paragraph may end naturally on a strong support sentence or specific example. Learners should not add a repetitive ending just to fill a formula.

Annotated example:
school reading corner, with sentence roles identified.

### Guided Practice
Fixed-context items:
1. best opening/main-point sentence;
2. support sentence matching the fixed main point;
3. unrelated sentence;
4. order four predetermined sentences into a coherent paragraph.

### Main Practice
Prompt:
> Your school should have a quiet reading corner. Do you agree? Explain your answer.

Target guidance:
- one paragraph;
- approximately 60–80 words;
- about 4–6 sentences;
- not a proficiency threshold.

Optional collapsed planning strip:
- Main Point
- Support
- Specific Support
- Optional Wrap-Up

Completion must not require the Wrap-Up field.

### Deterministic helper
Safe:
- draft present;
- approximate words/sentences;
- paragraph-break count as a structural observation.

Unsafe:
- claiming unity/coherence/support quality.

### Review
- My paragraph is mainly about …
- My strongest support is …
- I ended my paragraph by … / I chose not to add a separate wrap-up because …

Post-submission sample label:
**One Possible Sample Response (Not the Only Way)**

## 9. Week 8 — Connecting Ideas & Paragraphs

### Goal
Write two short paragraphs with distinct jobs and simple reader signals.

### Learn
Core reader signals:
- First,
- Another reason is …
- For example,
- Overall,

Optional extension:
- However,

Teach paragraph breaks by **job/purpose**, not sentence count.

Example concept:
- Paragraph 1 = first reason/support;
- Paragraph 2 = second reason/support or clearly different next part.

Optional visual paragraph-bridge diagram is accepted.

### Guided Practice
Fixed-context items:
1. example signal;
2. adding-another-reason signal;
3. paragraph break in a fixed response;
4. order two fixed paragraph blocks.

### Main Practice
Prompt:
> Your school wants to improve break time. Suggest one change and explain why it would help students.

Target:
- two short paragraphs;
- approximately 80–100 words total;
- at least one simple reader signal where useful.

No rigid paragraph-by-sentence-count rule.

### Deterministic helper
Structural counts/presence only.
No semantic transition or paragraph-quality judgment.

## 10. Week 9 — Applied Grammar & Self-Editing

### Goal
Use a 4-point editing checklist on a working copy.

### Learn
Core checklist:
1. Subject + verb
2. Time / tense
3. a / an / the
4. Capitals + punctuation

Teach:
**Checked, no change needed** is a valid outcome.

Never force a visible edit.

### Guided Practice
Fixed reviewed sentences only:
- subject–verb form;
- tense consistency in fixed context;
- article choice;
- punctuation/capitalization.

These may be objective practice evidence.

### Main Practice source choices
Preferred:
- copy one learner-owned Week 7/8 draft into a Week 9 working copy.

Fallback:
- write a short 40–60 word learner-authored paragraph; OR
- load a clearly labeled fixed Sample Student Draft for practice.

Workspace:
- Source / Original snapshot (read-only)
- My edited version
- checklist toggles

Checklist toggles are accepted as an optional UX improvement.

### Completion
Learner may:
- make one or more edits; OR
- explicitly mark **Checked, no change needed** after completing the checklist.

### Deterministic helper
May state:
- checklist completion;
- whether edited text differs at surface level;
- approximate surface-change count.

Must never state:
- “grammar is correct”;
- “all errors fixed”;
- “this version is better”.

## 11. Week 10 — Draft Revision & Self-Correction

### Goal
Revise meaning/organization separately from editing mechanics.

### Learn
Distinguish:

**Editing**
language form/mechanics.

**Revision**
what the writing says and how it is organized.

Four lenses:
- Task
- Ideas
- Sentences
- Words

### Guided Practice
Fixed-context items:
1. add missing support vs cosmetic adjective change;
2. remove unrelated sentence;
3. improve fixed support order;
4. choose revision that addresses a fixed task more directly.

### Main Practice source choices
Preferred:
- learner-owned Week 8/9 draft copied into a new working revision.

Fallback:
- short 40–60 word learner-authored paragraph; OR
- clearly labeled fixed Sample Student Draft used only for revision practice.

Required:
- revised version;
- main revision goal;
- short note: What I changed and why.

Learner may keep sentences unchanged.

### Before/After
Show:
- source snapshot;
- revised working copy;
- learner reflection.

Automated comparison reports surface facts only.

Never label the revised version “better” without valid human/AI review.

## 12. Week 11 — Guided Multi-Paragraph Challenge

### Goal
Write 2–3 paragraphs with reduced scaffolding.

### Learn
Short independent workflow:
1. Read/mark task
2. Plan 2–3 points
3. Draft
4. Check task/support/organization
5. Edit one language feature

### Guided Practice
Brief fixed-context readiness items on a different prompt:
1. identify task action;
2. identify required support;
3. choose stronger fixed outline structure;
4. identify off-topic fixed planning note.

No planning field is mandatory in Main Practice.

### Main Practice
Prompt:
> Your school wants to make students’ free time more useful. Suggest one change. Explain your reasons and give examples.

Target:
- 100–140 words;
- 2–3 paragraphs;
- guidance only, not proficiency threshold.

Support:
- optional collapsed checklist;
- no prefilled outline boxes;
- no default full sentence starters.

## 13. Week 12 — Independent Writing

### Goal
Plan, write, revise and review with minimal scaffolding.

### Learn
Very short reminder only:
- choose your process;
- manage time;
- write first;
- revise after drafting;
- use help only when needed.

### Optional Self-Readiness / Planning Scratchpad

Mandatory academic correction:
This step is **optional and skippable**.

Learner may use:
- Task in my own words
- 2–3 idea notes
- one revision reminder

Rules:
- no score;
- no proficiency evidence;
- no required completion;
- learner may go directly to Main Practice.

If any optional objective readiness item is retained:
- separate sample prompt;
- fixed correct answer;
- completely skippable;
- cannot block Main Practice or Review.

### Main Practice
Learner chooses Prompt A or B.

Prompt A:
> Some students prefer learning from books, while others prefer learning by doing practical activities. Which helps you learn better? Explain your view with reasons and examples.

Prompt B:
> Your school can make one change to help students learn better. What change would you choose? Explain your reasons and examples.

Target:
- approximately 120–150 words;
- learner chooses structure;
- scratchpad optional;
- no mandatory outline;
- no mandatory sentence starters.

### Feedback & Revision
Structural counts + independent self-check only:
- Task
- Ideas
- Organization
- Sentences
- Words

### Review
Reflections:
- What I did independently
- What I changed after reviewing
- What I want to practise next

Optional post-submission sample:
**One Possible Sample Response (Not the Only Way)**

Only after saved learner attempt + explicit reveal.

## 14. Scaffolding fade

Week 7:
medium — optional compact paragraph plan.

Week 8:
medium-low — paragraph-role reminder.

Week 9:
targeted editing checklist, learner draft preferred.

Week 10:
targeted revision lenses, learner draft preferred.

Week 11:
low — optional collapsed process checklist.

Week 12:
minimal — optional scratchpad/self-readiness only.

The second half must visibly feel more independent than Weeks 1–6.

## 15. Vietnamese Support

English primary.

Optional micro-glosses:
- paragraph — đoạn văn
- main point — ý chính
- support — ý hỗ trợ
- connecting phrase — cụm từ nối
- edit — sửa lỗi ngôn ngữ
- revise — chỉnh sửa nội dung
- draft — bản nháp
- independent writing — viết độc lập

## 16. Navigation

Writing home  
→ English Writing Coach · 12 Weeks  
→ Week lesson subpages

Week lesson subpages:
**← English Writing Coach · 12 Weeks**

About / Foundations:
**← Back to Writing**

All use save-before-leave protection.

## 17. Implementation scope

Implement:
- Weeks 7–12 flows;
- Week 12 optional/skippable readiness;
- Week 9/10 immutable-copy workflow;
- short fallback draft path;
- optional Sample Student Draft path with source labeling;
- revision/edit histories;
- model locks + exact sample-response label;
- structural-only deterministic feedback;
- evidence separation;
- local persistence;
- save-safe navigation.

Do not change Firebase/AI provider configuration.

## 18. Acceptance criteria

- order stays Weeks 7 → 8 → 9 → 10 → 11 → 12;
- Week 7 wrap-up is optional;
- Week 12 readiness/scratchpad is optional and unscored;
- Weeks 9/10 fallback learner draft is only 40–60 words;
- optional Sample Student Draft is clearly not learner-owned and not a model answer to the current task;
- earlier learner drafts are immutable;
- “Checked, no change needed” is valid in Week 9;
- all models are labeled **One Possible Sample Response (Not the Only Way)**;
- diff helpers report surface facts only;
- no pseudo-semantic deterministic grading;
- free-form proficiency weight remains 0;
- Week 12 remains genuinely independent.
