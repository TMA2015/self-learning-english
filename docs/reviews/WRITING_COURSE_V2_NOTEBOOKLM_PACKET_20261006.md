# NotebookLM Academic Review Packet — Writing Course v2

Packet ID: EN-WRITING-COURSE-V2-DESIGN-20261006  
Review type: independent academic/pedagogical review  
Implementation status: NOT IMPLEMENTED  
Base application checkpoint: `530b81d239d983567b70edf8e69882096af96743`

## Review objective

Review the proposed Self-Learning English Writing Course v2 design for:
- pedagogical soundness;
- age appropriateness;
- CEFR appropriateness;
- self-learning usability;
- scaffolding quality;
- feedback design;
- progression toward independent writing;
- risk of over-helping or answer copying;
- clarity when AI is unavailable.

## Learner context

Primary learner:
- approximately age 10–14;
- Grade 5–8;
- target approximately A2 to early B1 writing development.

Optional Vietnamese Support exists but public learning content is English-first.

The platform must remain useful without AI.

## Current 12-week sequence to preserve unless reviewer finds a strong academic reason to change it

1. Read the question — Question analysis
2. Stay on topic — Relevance
3. Ideas that matter — Brainstorming
4. Explain your ideas — Idea development
5. Examples from life — Examples
6. Build an outline — Organization
7. Clear sentences — Sentence quality
8. Accurate sentences — Grammar
9. A strong paragraph — Paragraph writing
10. Link paragraphs — Organization
11. Revise your draft — Self-editing
12. Write independently — Independent writing

## Proposed architecture

Writing module contains:
1. About this course
2. Writing Foundations
3. English Writing Coach · 12 Weeks
4. Independent Practice (future)
5. My Writing / Review (future)

Each week:
Learn → Guided Practice → Main Practice → Feedback & Revision → Review.

Writing Foundations:
- Understand the task
- Build ideas
- Develop ideas
- Organize writing
- Write clear sentences
- Revise your writing

## Proposed feedback policy

Structured stages use field-by-field feedback.

Each field:
- status: good / needs-work / missing
- evidence from learner response
- explanation
- next action
- optional hint
- optional model fragment

Help is progressive:
1. explanation
2. hint
3. partial example / sentence starter
4. model fragment
5. full model only after learner attempt and explicit reveal

Guided fallback must remain educational without pretending to perform AI semantic/grammar assessment.

## Questions for reviewer

Please answer all of the following.

### A. Overall course architecture
1. Is Course Overview + Foundations + weekly Learn/Practice a sound structure for self-learning?
2. Is any layer redundant or too complex for age 10–14?
3. Should Foundations be optional reference, required sequence, or partly required?

### B. 12-week progression
4. Is the current progression pedagogically coherent from A2 toward early B1?
5. Should any weeks be reordered, merged, or split?
6. Are Weeks 7–10 too language/organization heavy relative to idea development?

### C. Weekly lesson pattern
7. Is Learn → Guided Practice → Main Practice → Feedback & Revision → Review appropriate?
8. Is 15–30 minutes per session realistic?
9. What should be required before a learner advances?

### D. Feedback
10. Is field-by-field feedback appropriate for Question Analysis, Brainstorm and Outline?
11. What should feedback include to help learning without doing the task for the learner?
12. At what point should a model answer or model fragment be revealable?
13. What types of feedback should deterministic fallback avoid?

### E. Age and CEFR
14. Is A2 → early B1 an appropriate target description?
15. Is the proposed content suitable for Grade 5–8 / age 10–14?
16. What language simplifications are needed?

### F. Week 1
17. Is the proposed Week 1 sequence academically sound?
18. What exact concepts should a child learn when analysing a prompt?
19. Is “topic / task / must include / scope” a good four-part model, or should terminology change?

### G. Assessment and progression
20. What evidence should count as learning progress versus proficiency evidence?
21. Which Week 1 activities can be auto-scored safely?
22. Which should remain practice-only / provisional?

## Required verdict format

Return:

- **PACKET VERDICT:** PASS / PASS-WITH-CHANGES / REVISIONS-REQUIRED
- Executive summary
- Strengths
- Required changes
- Optional improvements
- Week-by-week progression comments
- Feedback-design comments
- CEFR/age comments
- Week 1 detailed recommendations
- Final recommended architecture
- Any academic risks or misleading claims

Do not rewrite the entire course unless necessary. Prefer precise corrections and rationale.
