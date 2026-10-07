# Writing Course v2-B — Reconciled Academic Design

Date: 2026-10-07  
Status: ACADEMICALLY CLEARED FOR WCV2-B IMPLEMENTATION  
Base application checkpoint: `2c1b615c68eac03702b6745f1860f413f10e8964`  
NotebookLM verdict: PASS-WITH-CHANGES

## 1. Scope

Implement Weeks 2–6 only:

- Week 2 — Brainstorming & Relevance
- Week 3 — Idea Development & Reasons
- Week 4 — Examples & Details
- Week 5 — Sentence Clarity & Linkers
- Week 6 — Outlining & Response Structure

Weeks 7–12 remain preview-only.

The high-level Weeks 2–6 order is academically approved and remains unchanged.

## 2. Shared lesson rhythm

Each week keeps:

Learn → Guided Practice → Main Practice → Feedback & Revision → Review

Typical total time:
- approximately 25–35 minutes;
- may be split into two short sessions.

## 3. Shared active-work help policy

Allowed during active work:
- explanation;
- guiding question;
- short hint;
- short sentence starter / example piece;
- deterministic answer checking for objective Guided Practice.

Not allowed during active work:
- full model answer;
- full corrected learner response;
- answer reveal that completes the task;
- CEFR claim from rule-based checks;
- semantic-quality or argument-quality claim from keyword/string matching.

Full model comparison remains restricted to final Review after a complete learner attempt and explicit reveal action.

## 4. Deterministic fallback boundary — mandatory

Free-form deterministic checks may verify only:
- required field populated;
- approximate word/sentence count;
- explicit target connecting-word presence;
- punctuation/capitalization presence as a structural observation;
- required structural component present.

They must never claim:
- semantic relevance;
- logical strength;
- quality of a reason/example;
- grammatical correctness;
- overall coherence;
- CEFR proficiency.

Use the existing learner-facing label:
**Guided Check (Basic Structure)**

Keep the existing disclaimer:
“This check verifies required parts and words. It does not evaluate full meaning or grammar accuracy.”

Where useful, add:
“Meaning and reasoning quality need AI or teacher review.”

Objective Guided Practice remains safely auto-scorable only when there is a predetermined single correct target.

## 5. Evidence policy

### Objective Guided Practice
- evidence weight: 1
- proficiency weight: 0
- practice evidence only
- may update subskill practice accuracy

Suggested subskill tags:
- Week 2: `writing.task_understanding` / relevance practice
- Weeks 3–4: `writing.idea_development`
- Week 5: `writing.cohesion`
- Week 6: `writing.organization`

### Free-form Main Practice
- deterministic proficiency weight: 0
- provisional
- progress/completion only
- must not change CEFR estimates automatically

## 6. Week 2 — Brainstorming & Relevance

### Goal
Generate several ideas, reject off-topic ideas, and select one or two ideas that answer the prompt.

### Learner-facing language
Prefer:
- **Sticking to the Topic** instead of abstract “Relevance” inside explanations;
- **Off-topic** remains acceptable with optional Vietnamese micro-gloss.

### Learn
Teach:
1. Generate several ideas.
2. Ask: “Does this answer the exact task?”
3. Choose an idea you can explain.

Example prompt:
> Your school wants one new lunchtime club. Suggest a club and explain why students would enjoy it.

Examples:
- drawing club — on topic;
- chess club — on topic;
- changing the school uniform — off-topic;
- music club — on topic.

Explain in one sentence why the off-topic choice does not answer the prompt.

### Guided Practice
Prompt:
> Your class wants one activity for a rainy afternoon. Choose an activity and give one reason.

Objective items:
1. identify an on-topic idea;
2. identify an off-topic idea;
3. choose which idea is easier to explain;
4. match an idea with a predetermined suitable reason.

The **Off-Topic Spotter** is approved.

Each answer should receive a brief explanation of why it matches or crosses the prompt boundary.

### Main Practice
Prompt:
> Your school can add one new after-school activity. What activity should it add? Give reasons.

Fields:
- My possible ideas
- One idea I will reject
- My best main idea
- Why this idea fits the task

Deterministic helper:
- may check completion;
- may check whether “best main idea” exactly matches one of the learner’s own listed ideas if implementation can do so safely;
- must not decide semantic relevance of arbitrary free text.

### Review
- “An idea stays on topic when …”
- “I rejected … because …”
- “My strongest idea is …”

## 7. Week 3 — Idea Development & Reasons

### Goal
Turn an opinion/main idea into a reason and a short explanation.

### Learner-facing labels
Use:
- **My Opinion / Main Idea**
- **My Reason**
- **How / Why it Matters**

Avoid rigid learner-facing “Point → Why → Explanation” terminology as a required formula.

### Learn
Conceptual structure:
Opinion/Main Idea → Reason → How/Why it Matters

Teach the logic, but vary sentence openings so learners do not copy a fixed template.

Weak:
> A reading club is good because it is a good club.

Better:
> A reading club is useful because students can discover books they might not choose alone.

### Guided Practice
Prompt:
> Students should have ten minutes of quiet reading at school.

Objective items:
1. choose a real reason instead of repetition;
2. identify a sentence that explains why;
3. match a point to a predetermined logical reason;
4. choose the explanation that best develops a predetermined reason.

### Main Practice
Prompt:
> Your class should have one short outdoor learning activity each week. Do you agree? Give reasons.

Fields:
- My Opinion / Main Idea
- My Reason
- How / Why it Matters
- Optional extra supporting note

The fourth field should not become a rigid requirement if the first three already show complete planning.

### Review
- “My main idea is …”
- “My reason is …”
- “This matters because …”

## 8. Week 4 — Examples & Details

### Goal
Support a reason with useful evidence without forcing artificial duplication.

### Learner-facing definitions
Use:
- **Extra Information**: an extra fact, explanation, or rule.
- **Example**: a specific instance, person, event, or situation.

Examples:
- Extra Information: “It takes about 15 minutes to care for the plants.”
- Example: “Group A waters tomato plants on Fridays.”

### Learn
Conceptual structure:
Reason → Supporting Evidence

Supporting Evidence may be:
- Extra Information;
- an Example;
- or both.

Do not teach learners that every short response must contain two separate mandatory evidence types.

### Guided Practice
Prompt:
> Students should help keep their classroom tidy.

Objective items:
1. select supporting extra information;
2. select a useful specific example;
3. identify an unrelated example;
4. match a predetermined reason with suitable evidence.

### Main Practice
Prompt:
> Students should spend some class time learning practical life skills. Do you agree? Give a reason and an example.

Core required fields:
- My Reason
- Supporting Evidence (Extra Information or Example)

Optional extension:
- Add another piece of evidence
- Explain the connection

Do not penalize a learner for not filling separate Detail and Example fields when one appropriate support block satisfies the task.

### Deterministic helper
May check:
- core fields populated;
- optional presence of explicit example marker such as “for example”.

Must not claim:
- that the evidence is semantically strong;
- that the evidence actually supports the reason based only on keywords.

### Review
- “My reason is …”
- “My supporting evidence is …”
- “This helps my reason because …” (reflection, not a mandatory Main Practice field)

## 9. Week 5 — Sentence Clarity & Linkers

### Goal
Write 3–5 connected sentences and use simple connecting words appropriately.

### Learner-facing term
Prefer:
**Connecting Word**
instead of technical **Linker** in learner-facing instructions.

### Core connecting words
Required teaching:
- because — reason
- so — result
- but — contrast

### Optional challenge
**although** is NOT a core requirement.

It may appear only as:
**Optional Challenge / Extension Connecting Word**

If shown, teach a simple pattern and punctuation example. Do not include `although` in required Guided Practice scoring or Main Practice completion.

### Guided Practice
Core objective items:
1. choose because vs so;
2. choose but for contrast;
3. identify a clear structural sentence vs a run-on;
4. combine two predetermined short sentences with an appropriate core connecting word.

Optional challenge item may introduce although separately and must not count against core completion.

### Main Practice
Prompt:
> Describe a school activity you enjoy and explain why you enjoy it.

Target:
- 3–5 connected sentences;
- approximately 35–50 words as a useful target, not a strict penalty threshold;
- at least one reason;
- at least one core connecting word where appropriate.

Provide a collapsible help drawer with short starters such as:
- “I enjoy … because …”
- “We wanted to … so …”

These are optional supports, not model answers.

### Deterministic helper
Safe structural observations:
- approximate sentence count;
- approximate word count;
- capital at sentence start;
- terminal punctuation presence;
- explicit presence of because / so / but.

Unsafe:
- grammar correctness;
- semantic coherence;
- whether the connector expresses the right meaning in free text.

### Review
- “I used ___ to show a reason/result/contrast.”
- “One sentence I improved was …”

## 10. Week 6 — Outlining & Response Structure

### Goal
Organize a short response before drafting while keeping the outline lightweight.

### Learner-facing instruction — mandatory
**“Use short notes and key words — about 3–7 words per box. Save full sentences for drafting.”**

### Learn
Outline structure:
1. Opening / opinion
2. Reason
3. Extra Information or Example
4. Ending

Example outline must use fragments, not polished sentences:

- Opening: school reading club
- Reason: discover new books
- Example: monthly book recommendations
- Ending: more interesting lunchtimes

### Guided Practice
Objective items:
1. order outline parts;
2. identify an opening note;
3. identify an example note;
4. remove an unrelated outline note.

### Main Practice
Prompt:
> Your school has money for one improvement. What should it choose? Explain your answer.

Fields:
- Opening / opinion note
- Reason note
- Supporting evidence note
- Ending note

Encourage 3–7 words per box.
Do not require polished grammar in outline fragments.

### Review
- “My response begins with …”
- “My main support is …”
- “My ending reminds the reader …”

Optional bridge:
a simple preview may stack the learner’s outline fragments vertically to show how the plan will feed Week 7. It must not auto-convert the outline into a written paragraph.

## 11. Scaffolding fade

Week 2:
high support — generate/filter/select.

Week 3:
high-medium — opinion/reason/explanation.

Week 4:
medium — reason + flexible evidence.

Week 5:
medium-low — free connected sentences with optional collapsible starters.

Week 6:
compact structural planning using fragments.

The support should visibly decrease across the block.

## 12. Vietnamese Support

English remains primary.

Optional micro-glosses:
- sticking to the topic — ý bám sát đề
- off-topic — lạc đề
- reason — lý do
- extra information — chi tiết hỗ trợ
- example — ví dụ
- connecting word — từ nối
- outline — dàn ý

Do not translate complete lessons by default.

## 13. WCV2-A navigation follow-up

When implementing WCV2-B, add a consistent:

**← Back to Writing**

action to:
- About this course
- Writing Foundations
- Week Learn
- Guided Practice
- Week Review
- new Week 2–6 subpages where appropriate.

Do not create a separate hotfix solely for this.

## 14. Implementation scope

WCV2-B should implement:
- Week 2–6 Learn content;
- Week 2–6 Guided Practice;
- Week 2–6 Main Practice;
- week-specific structural helpers;
- Week 2–6 Review;
- local persistence;
- practice/proficiency evidence separation;
- progressive-help/model-answer guardrails;
- Back-to-Writing navigation polish.

Do not implement Weeks 7–12.

## 15. Acceptance criteria

- order remains Weeks 2 → 3 → 4 → 5 → 6;
- `although` is optional only;
- no pseudo-semantic deterministic grading;
- Week 4 does not force separate Detail + Example entries;
- Week 6 uses 3–7 word outline fragments;
- objective Guided Practice remains explainable and auto-scorable;
- free-form Main Practice remains proficiency weight 0 without valid review;
- sentence starters remain optional/collapsible;
- full models remain locked until Review;
- WCV2-A local-save and review-lock behavior remains intact.
