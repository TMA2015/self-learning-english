# Writing Course v2 — Pedagogy and UX Design

Date: 2026-10-06  
Status: DESIGN ONLY — no application implementation in this branch  
Base: `530b81d239d983567b70edf8e69882096af96743`

## 1. Product goal

Turn the current 12-week Writing path from an outline-plus-practice experience into a self-learning course that can still teach effectively when AI is unavailable.

AI is an enhancement layer, not the teaching foundation.

The course should help a learner:
1. understand a prompt;
2. generate and select ideas;
3. develop reasons and examples;
4. organize ideas;
5. write clear and increasingly accurate sentences;
6. build paragraphs and short multi-paragraph responses;
7. revise independently;
8. use feedback to improve rather than copy an answer.

## 2. Intended learner

Primary target:
- approximately age 10–14;
- Grade 5–8;
- approximately A2 to early B1 writing development.

Supported with extra scaffolding:
- A1+/A2 learners using Vietnamese Support.

The course is not an IELTS exam-preparation course and should not assign IELTS bands.

## 3. Course architecture

Writing becomes the skill/module. Inside Writing:

### A. About this course
A short orientation page answering:
- Who is this course for?
- What will I learn?
- How long does one lesson take?
- How should I use feedback?
- What does AI do?
- What happens when AI is unavailable?
- How is progress measured?
- What should I do if I am stuck?

### B. Writing Foundations
A reusable reference area, not a long mandatory prerequisite.

Foundation units:
1. Understand the task
   - topic
   - task type
   - key words
   - limits / scope
2. Build ideas
   - brainstorm
   - relevance
   - choose stronger ideas
3. Develop ideas
   - reason
   - detail
   - example
4. Organize writing
   - opening
   - logical order
   - ending
5. Write clear sentences
   - one clear thought
   - because / so
   - sentence clarity
6. Revise your writing
   - task check
   - idea check
   - sentence check
   - self-edit checklist

Foundations and weekly lessons link both ways:
- weekly lesson -> “Need help? Review …”
- foundation -> “Practise this skill in Week …”

### C. English Writing Coach · 12 Weeks
Each week uses the same learning rhythm:

1. **Learn** — 3–5 min
   - one concept
   - one annotated example
   - one common mistake
2. **Guided Practice** — 3–5 min
   - short objective or semi-objective exercise
   - immediate answer + explanation
3. **Main Practice** — 10–15 min
   - learner applies the skill to a new task
4. **Feedback & Revision** — 5–10 min
   - field-by-field feedback
   - learner revises independently
5. **Review**
   - one sentence: “What did I learn?”
   - optional link back to the relevant Foundation

### D. Independent Practice
Unlocked later:
- new prompts without step-by-step scaffolding;
- learner chooses whether to open Foundations;
- feedback follows the same schema as weekly practice.

### E. My Writing
A future-friendly area for:
- saved drafts;
- revisions;
- reviewed writing;
- recurring issues;
- improvement over time.

## 4. 12-week progression

Keep the existing progression; improve how each week teaches it.

| Week | Focus | Learn | Guided Practice | Main Practice | Foundation link |
|---|---|---|---|---|---|
| 1 | Question analysis | Topic, task, keywords, limits | Identify parts of a new prompt | Garden challenge | Understand the task |
| 2 | Relevance | On-topic vs off-topic ideas | Sort/select relevant ideas | School clubs challenge | Build ideas |
| 3 | Brainstorming | Generate before choosing | Compare strong vs weak ideas | Healthy lunch challenge | Build ideas |
| 4 | Idea development | Why? + useful detail | Expand one reason | Reading time challenge | Develop ideas |
| 5 | Examples | Specific example + connection | Match example to reason | Helping at home challenge | Develop ideas |
| 6 | Outline | Opinion → reason → detail → example → ending | Put parts in order | Outdoor learning challenge | Organize writing |
| 7 | Sentence clarity | One clear thought; because / so | Repair unclear sentences | Favorite place challenge | Write clear sentences |
| 8 | Grammar accuracy | Subject-verb, tense, articles | Short targeted corrections | School day challenge | Write clear sentences |
| 9 | Paragraph writing | Topic sentence + support | Build a paragraph from parts | Pets challenge | Organize writing |
| 10 | Linking paragraphs | Simple transitions; beginning/ending | Choose useful transitions | Screen time challenge | Organize writing |
| 11 | Revision | Check task, ideas, sentences | Diagnose a weak draft | Sports challenge | Revise your writing |
| 12 | Independent writing | Plan without prompts | Minimal planning check | My school challenge | All foundations |

## 5. Week 1 detailed model

### Week 1 — Read the question

Goal:
Learner can identify what the question is about, what action it requires, and what must stay inside the scope.

#### Learn
Prompt example:

> Some students think schools should have a small garden. Do you agree? Give reasons and an example.

Annotate:
- Topic: a small garden at school
- Task: say agree/disagree
- Must include: reasons + an example
- Scope/limit: school context

Show one off-topic example and explain why it is off-topic.

#### Guided Practice
Use a different prompt.

Questions:
- What is the topic?
- What must the writer do?
- Which phrase limits the answer?
- Which idea is off-topic?

Each answer gets:
- correct / incorrect;
- short explanation;
- one retry if incorrect.

#### Main Practice
Current Garden challenge, but feedback becomes field-by-field.

#### Review
Learner completes:
- “The topic is …”
- “The task is …”
- “I should avoid …”

## 6. Feedback v2 contract

The learner should never receive only a generic paragraph when the task has multiple fields.

For Question Analysis / Brainstorm / Outline, feedback is field-by-field.

Each feedback item should use:

- **status**: good | needs-work | missing
- **label**: field name
- **learnerEvidence**: short learner phrase or summary, never the whole answer
- **explanation**: why it works / what is missing
- **nextAction**: one specific thing to do next
- **hint**: optional
- **modelFragment**: optional short fragment, not a full answer

Example:

Topic  
✅ Good  
“small garden in School” identifies the main topic.  
Next: keep the answer focused on a garden at school.

Task  
⚠ Needs work  
You identified the topic, but the task also asks whether you agree or disagree.  
Next: add “say whether I agree or disagree.”

## 7. Progressive-help policy

Do not reveal a full model answer immediately.

Help levels:
1. explanation;
2. hint;
3. partial example / sentence starter;
4. model fragment;
5. full model answer only after the learner has attempted the task and explicitly chooses to reveal it, preferably in Review.

Examples:
- Hint: “Look for the action word in the question.”
- Sentence starter: “I agree because …”
- Model fragment: “Task: give an opinion + reasons + an example.”

The system should explain why an answer is useful, not only show what to write.

## 8. Guided fallback v2

When AI is unavailable, guided feedback must still teach.

Rules:
- use deterministic checks only where defensible;
- never pretend to understand semantics beyond deterministic evidence;
- provide field-by-field checks for structured stages;
- identify obvious missing required task elements;
- explain why;
- provide one actionable next step;
- offer a hint or partial example;
- do not assign CEFR or language proficiency from rule-based checks;
- clearly label guided fallback.

For free-form Writing, rule-based fallback may safely check:
- approximate length;
- obvious task-keyword presence;
- whether an opinion marker is present when required;
- whether a reason/example connector is present;
- paragraph/sentence count heuristics;
- basic checklist prompts.

It must not claim grammatical correctness unless a deterministic rule actually supports the claim.

## 9. AI feedback v2

AI uses the same visible feedback structure as guided fallback, but may add:
- semantic relevance;
- idea quality;
- explanation of language errors;
- targeted sentence-level corrections;
- personalized priorities from learner evidence.

The learner should not need to understand whether a card came from rule-based or AI logic to use it. Source remains clearly labelled, but pedagogical layout stays consistent.

## 10. Course Overview content

Required sections:

### What you will learn
A short explanation of the 12-week progression.

### Who this course is for
Approximate level and age range; explain that learners may go slower or faster.

### How each week works
Learn → Guided Practice → Main Practice → Feedback & Revision → Review.

### How to use feedback
Try first; read why; revise yourself; reveal more help only if needed.

### AI and guided feedback
AI may give deeper language feedback. If AI is unavailable, the course still provides guided learning.

### Time
Typical session: 15–30 minutes.
A week can be split across multiple sessions.

### Progress
Progress tracks completed learning/practice steps and reviewed evidence; completion is not the same as proficiency.

## 11. Navigation proposal

Writing landing:
- About this course
- Writing Foundations
- English Writing Coach · 12 Weeks
- Independent Practice (future)
- My Writing / Review (future)

12-week curriculum cards should show:
- week goal;
- Learn;
- Guided Practice;
- Main Practice;
- approximate time;
- progress / preview status.

## 12. Scope for first implementation

Phase WCV2-A:
- Course Overview page
- Writing Foundations index + 6 concise foundation units
- richer Week cards
- Week 1 Learn + Guided Practice
- Week 1 Main Practice reuses current practice flow
- Guided Feedback v2 for Week 1 Question Analysis
- deep links between Week 1 and “Understand the task”

Do not build Weeks 2–12 fully before validating Week 1.

Phase WCV2-B:
- expand Learn + Guided Practice across Weeks 2–6.

Phase WCV2-C:
- expand Weeks 7–12.

## 13. Acceptance criteria

Course orientation:
- a first-time learner can explain what the course teaches and how to use it;
- target level and time expectation are visible;
- AI is described as optional enhancement.

Week 1:
- Learn contains an annotated example;
- Guided Practice has at least 4 short checks with explanations;
- Main Practice remains learner-authored;
- each Question Analysis field receives specific feedback;
- feedback explains why and gives one next action;
- progressive help exists;
- learner work remains saved locally;
- AI failure does not block completion.

Academic:
- age-appropriate for 10–14;
- simple English;
- CEFR claims remain provisional and evidence-based;
- no copied textbook material;
- no full-answer dependency;
- progression supports independent writing by Week 12.

## 14. Non-goals

This design does not:
- turn the course into IELTS exam coaching;
- require AI to learn;
- replace Grammar/Reading modules;
- add account/cloud-sync requirements;
- modify Curriculum 1.11.0 foundation lesson bank;
- change Firebase architecture.
