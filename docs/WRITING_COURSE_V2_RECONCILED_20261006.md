# Writing Course v2 — Reconciled Academic Design

Date: 2026-10-06  
Status: APPROVED FOR WCV2-A IMPLEMENTATION AFTER PASS-WITH-CHANGES RECONCILIATION  
Base application checkpoint: `530b81d239d983567b70edf8e69882096af96743`  
Academic review verdict: PASS-WITH-CHANGES

## 1. Owner/product goal

Turn the current 12-week Writing path into a self-learning course that remains genuinely useful when AI is unavailable.

AI is an enhancement layer, not the teaching foundation.

The course should help learners:
1. understand a prompt;
2. generate and select relevant ideas;
3. develop reasons, details and examples;
4. write clear connected sentences;
5. organize paragraphs and responses;
6. revise independently;
7. use feedback to improve rather than copy.

## 2. Intended learner

Primary target:
- approximately age 10–14;
- Grade 5–8;
- approximately A2 to early B1 writing development.

Additional support:
- A1+/A2 learners may use Vietnamese Support micro-glosses.

This is not an IELTS band-scoring course.

## 3. Final module architecture

Writing module:

1. **About this course**
2. **Writing Foundations**
3. **English Writing Coach · 12 Weeks**
4. **Independent Practice** — future
5. **My Writing / Review** — future

### About this course

Must explain:
- what the learner will learn;
- who the course is for;
- how each week works;
- typical time;
- how to use feedback;
- how AI and guided feedback differ;
- what progress means;
- what to do when stuck.

Recommended timing language:
- approximately 25–35 minutes total per weekly module;
- may be split into two short sessions;
- Session A: Learn + Guided Practice;
- Session B: Main Practice + Feedback/Revision + Review.

### Writing Foundations

Foundations are **on-demand reference**, not a mandatory lock-step prerequisite.

Units:
1. Understand the Task
2. Build Ideas
3. Develop Ideas
4. Organize Writing
5. Write Clear Sentences
6. Revise & Self-Edit

Weekly lessons link to the relevant Foundation and Foundation units link back to practice weeks.

## 4. Learner-facing terminology

Use simple classroom language.

Prompt analysis model:

1. **Topic** — What is this about?
2. **Task / Action** — What must I do?
3. **Must Include** — What details are required?
4. **Boundary / Stay on Target** — What exact context must I stay within?

Avoid learner-facing term `Scope/Limit`.

Additional simplifications:
- `Field-by-Field Feedback` -> **Step-by-Step Helper**
- `Model Fragment` -> **Sentence Starter / Example Piece**
- if `Register` is ever introduced -> **Tone / Choosing Words**

Vietnamese Support may add micro-glosses:
- Topic -> Chủ đề chính
- Task -> Yêu cầu bài viết
- Boundary -> Phạm vi / giới hạn cần bám sát

## 5. Reconciled 12-week progression

### Phase 1 — Task Understanding & Idea Generation

**Week 1 — Prompt Analysis**
- Topic
- Task / Action
- Must Include
- Boundary / Stay on Target
- Main practice: Garden challenge

**Week 2 — Brainstorming & Relevance**
- generate several ideas;
- identify off-topic ideas;
- choose stronger relevant ideas;
- suggested quick activity: Off-Topic Spotter.

**Week 3 — Idea Development & Reasons**
- answer “Why?”;
- turn an opinion into a supported reason.

### Phase 2 — Evidence & Sentence Foundations

**Week 4 — Examples & Details**
- add specific supporting detail;
- connect example to reason.

**Week 5 — Sentence Clarity & Linkers**
- one clear thought per sentence;
- combine ideas with basic connectors such as because, so, but, although.

### Phase 3 — Structural Organization & Cohesion

**Week 6 — Outlining & Response Structure**
- opening -> reason -> detail/example -> ending.

**Week 7 — Paragraph Construction**
- topic sentence;
- supporting ideas;
- coherent single paragraph.

**Week 8 — Connecting Ideas & Paragraphs**
- first, also, however, in conclusion;
- simple flow between ideas/paragraphs.

**Week 9 — Applied Grammar & Self-Editing**
- subject-verb agreement;
- tense consistency;
- articles;
- edit grammar inside a real draft, not isolated drill only.

### Phase 4 — Synthesis & Independent Writing

**Week 10 — Draft Revision & Self-Correction**
- 4-point checklist: Task, Ideas, Sentences, Words.

**Week 11 — Guided Multi-Paragraph Challenge**
- approximately 100–140 words;
- reduced scaffolding;
- structured planning still available.

**Week 12 — Independent Writing**
- approximately 120–150 words;
- blank-canvas prompt;
- optional planning scratchpad;
- minimal scaffolding.

Scaffolding must fade across the 12 weeks rather than remain constant.

## 6. Weekly learning rhythm

Each week uses:

1. **Learn**
   - one clear concept;
   - annotated example;
   - common mistake.

2. **Guided Practice**
   - objective or semi-objective checks;
   - immediate correct/incorrect result;
   - short explanation;
   - retry allowed.

3. **Main Practice**
   - learner-authored response;
   - no full answer shown.

4. **Feedback & Revision**
   - Step-by-Step Helper;
   - explanation first;
   - learner revises own work.

5. **Review**
   - learner reflects on what was learned;
   - optional comparison material may unlock here.

## 7. Progressive-help guardrails

This is a hard implementation rule.

During:
- Guided Practice;
- Main Practice drafting;
- Feedback & Revision;

the system must NEVER reveal a complete model answer.

Allowed help during active work:
1. explanation;
2. guiding question;
3. sentence starter;
4. short model fragment / example piece.

Active-work model fragments should be short (target <=15 words) and must not complete the learner’s whole task.

A full model response may only be available:
- in the final Review step;
- after the learner has submitted a complete attempt;
- behind an explicit learner action such as “Compare with a model”.

The purpose is comparison and reflection, not copying.

## 8. Feedback v2 contract

For structured stages such as Prompt Analysis, Brainstorming and Outline, feedback is step-by-step.

Each feedback item:
- status: good | needs-work | missing
- learner-friendly label
- learner evidence: short phrase or safe summary
- explanation: why it works / what is missing
- next action: one specific improvement
- optional hint
- optional short sentence starter / example piece

Example:

**Topic**
Good  
“small garden in school” identifies the main subject.  
Next: keep your answer focused on a garden at school.

**Task / Action**
Needs work  
You found the topic, but the question also asks whether you agree or disagree.  
Next: add the action you must take.

## 9. Deterministic guided fallback boundaries

All deterministic non-AI feedback must be visibly labelled:

**Guided Check (Basic Structure)**

Required disclaimer:
“This check verifies required parts and words. It does not evaluate full meaning or grammar accuracy.”

Allowed deterministic checks:
- field completion;
- objective multiple-choice/classification answers;
- word-count range;
- explicit keyword/task-element presence;
- explicit linker presence such as because / so / however;
- sentence/paragraph count heuristics;
- checklist completion.

Prohibited deterministic claims:
- semantic relevance unless the item has a predetermined objective answer;
- argument quality;
- grammatical correctness;
- CEFR level;
- overall language proficiency;
- “good writing” based on keyword/count heuristics.

## 10. Evidence model

Keep three evidence layers separate.

### Progress evidence
Examples:
- module completion;
- attempts;
- submitted steps;
- review completed.

May update:
- dashboard;
- course progress;
- unlock status.

Must not affect CEFR estimate directly.

### Practice evidence
Objective Guided Practice / Prompt Analysis items with deterministic answers:
- **Evidence weight: 1**
- tag: `writing.task_understanding` or other exact subskill tag;
- may update Skill Map accuracy / suggested practice.

### Proficiency evidence
Free-form planning and writing:
- deterministic automated proficiency weight: **0**
- record completion/progress only unless reviewed by a verified rubric/AI/adult process;
- remain provisional until valid evaluation exists.

Rule-based fallback never produces CEFR proficiency evidence.

## 11. Week 1 pilot specification

### Week 1 — Prompt Analysis

Goal:
Learner identifies Topic, Task / Action, Must Include, and Boundary / Stay on Target.

### Learn
Use the school-garden example and annotate the four prompt parts.

Add one off-topic example and explain why it crosses the Boundary.

### Guided Practice
Use a different prompt.

At least four objective checks:
1. identify Topic;
2. identify Task / Action;
3. identify Must Include;
4. identify Boundary / off-topic idea.

Each item:
- deterministic answer;
- explanation;
- one retry;
- evidence weight 1;
- tag `writing.task_understanding`.

### Main Practice
Reuse current Garden challenge.

Do not auto-score free-form planning fields as proficiency.

### Step-by-Step Helper
Give feedback separately for:
- Topic;
- Task / Action;
- Must Include;
- Boundary / Stay on Target.

Guided fallback must not pretend to understand full semantics beyond safe rules.

### Review
Learner completes:
- “The topic is …”
- “The task is …”
- “To stay on target, I should …”

After the learner has completed the attempt, Review may offer:
**Compare with a model**
as a deliberate reveal action.

## 12. WCV2-A implementation scope

Implement only the pilot architecture:

1. Course Overview page
2. Writing Foundations index
3. six concise Foundation units
4. richer 12-week curriculum cards using the reconciled progression
5. Week 1 Learn
6. Week 1 Guided Practice
7. Week 1 Main Practice reusing current practice flow
8. Week 1 Step-by-Step Helper / Guided Feedback v2
9. strict progressive-help reveal guardrail
10. explicit evidence weights for Week 1 objective vs free-form work
11. deep links between Week 1 and Understand the Task

Do not fully author Weeks 2–12 yet.

## 13. Acceptance criteria for WCV2-A

Course:
- first-time learner can explain what the course is and how to use it;
- target learner and time expectations visible;
- AI clearly optional.

Week 1:
- annotated Learn example;
- at least four objective Guided Practice checks with explanations;
- Main Practice remains learner-authored;
- Topic / Task / Must Include / Boundary receive separate feedback;
- next action is specific;
- full model answer unavailable during active work;
- model comparison only after complete attempt in Review;
- local save preserved;
- AI failure does not block learning.

Evidence:
- objective Week 1 guided items use weight 1 practice evidence;
- free-form planning/writing uses weight 0 for deterministic proficiency;
- no deterministic CEFR scoring.

QA:
- existing G3-E lifecycle remains unchanged;
- Curriculum 1.11.0 foundation bank remains unchanged;
- no Listening asset changes;
- no Firebase/App Check/billing change.
