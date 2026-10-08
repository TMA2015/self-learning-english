# Writing Course v2-C — Weeks 7–12 Academic Design

Date: 2026-10-08  
Status: DESIGN ONLY — not implemented  
Base: `9a99f73eda9102fd69caa5b0fee869a012975175`  
Dependency: WCV2-B owner QA PASS

## 1. Scope

WCV2-C authors the academic content and interaction model for the second half of the 12-week Writing Coach:

- Week 7 — Paragraph Construction
- Week 8 — Connecting Ideas & Paragraphs
- Week 9 — Applied Grammar & Self-Editing
- Week 10 — Draft Revision & Self-Correction
- Week 11 — Guided Multi-Paragraph Challenge
- Week 12 — Independent Writing

This phase must complete the transition from scaffolded planning to increasingly independent writing.

Target learner:
- approximately age 10–14;
- Grade 5–8;
- approximately A2 to early B1 writing development.

AI remains optional.

## 2. Shared course rhythm

Weeks 7–12 continue the five-part rhythm:

1. Learn
2. Guided Practice
3. Main Practice
4. Feedback & Revision
5. Review

Typical total time:
- Weeks 7–10: approximately 25–35 minutes;
- Week 11: approximately 30–40 minutes;
- Week 12: approximately 35–45 minutes.

A learner may split a week into two sessions.

## 3. Active-work feedback policy

During active work, the system may provide:
- short explanation;
- guiding question;
- checklist;
- short hint;
- short sentence starter where academically justified;
- structural counts and presence checks;
- objective feedback on predetermined Guided Practice items.

During active work, the system must not provide:
- a full model answer to the current task;
- a complete rewritten learner response;
- a generated paragraph from the learner's outline;
- an automatic replacement draft;
- CEFR claims from rule-based checks;
- semantic-quality claims from keyword/string matching.

Full model comparison remains restricted to final Review after a saved learner-owned attempt and explicit reveal.

## 4. Deterministic fallback boundary

Free-form deterministic feedback may report only:
- required section present/missing;
- approximate word count;
- approximate sentence count;
- approximate paragraph count;
- visible punctuation/capitalization markers;
- explicit presence of a target connecting word when the lesson explicitly asks for it;
- whether a revision differs from the saved original at a surface level.

It must never claim:
- idea relevance;
- logical strength;
- semantic coherence;
- grammar correctness;
- quality of evidence;
- quality of paragraphing;
- CEFR level;
- Writing proficiency.

Use:
**Guided Check (Basic Structure)**

Keep:
“This check verifies required parts and words. It does not evaluate full meaning or grammar accuracy.”

For Weeks 7–12, add when useful:
“Meaning, organization quality and language accuracy need AI or teacher review.”

## 5. Evidence policy

### Objective Guided Practice
When an item has one predetermined correct answer:
- evidence weight 1;
- proficiency weight 0;
- practice evidence only.

Suggested tags:
- Week 7: `writing.paragraph_structure`
- Week 8: `writing.cohesion`
- Week 9: `writing.editing`
- Week 10: `writing.revision`
- Week 11: `writing.organization`
- Week 12: `writing.task_understanding` only if an objective readiness item is used.

### Free-form Main Practice / Revision
- evidence weight 0 for automated proficiency;
- proficiency weight 0;
- provisional;
- progress/completion only.

Only a valid AI/adult/rubric review may later add language-quality proficiency evidence.

## 6. Cross-week draft safety

Weeks 9 and 10 may reuse the learner's own earlier saved work.

Rules:
- earlier saved versions are immutable;
- “Use an earlier draft” creates a working copy;
- editing the working copy must never overwrite Week 7/8 originals;
- revision history must preserve before/after versions;
- if no earlier draft exists, the learner writes a short original draft first rather than receiving a complete model draft.

## 7. Week 7 — Paragraph Construction

### Goal

Build one connected paragraph from a main idea, support and a clear ending.

### Foundation link
Organize Writing + Write Clear Sentences

### Learn

Teach paragraph roles using learner-friendly language:

- **Opening / Main Point** — tells the reader the paragraph's main idea.
- **Support** — gives a reason, explanation or useful information.
- **Specific Support** — gives an example or concrete detail.
- **Closing Thought** — finishes the paragraph without merely copying the first sentence.

Avoid teaching a rigid “one perfect paragraph formula.”

Annotated example should show a paragraph about a school reading corner and label the role of each sentence.

Common mistake:
writing several correct sentences that do not build one central idea.

### Guided Practice

Use a different topic.

Objective items:
1. identify the best opening/main-point sentence;
2. choose which support sentence belongs with the main point;
3. identify an unrelated sentence;
4. order four predetermined sentences into a coherent paragraph.

### Main Practice

Prompt:

> Your school should have a quiet reading corner. Do you agree? Explain your answer.

Target:
- one paragraph;
- approximately 60–80 words;
- about 4–6 sentences;
- learner chooses their own support.

Optional compact planning strip:
- Main Point
- Support
- Specific Support
- Closing Thought

The planning strip may be collapsed and must not be mandatory after the learner begins drafting.

### Deterministic helper

Safe:
- draft present;
- approximate word count;
- approximate sentence count;
- whether the learner used multiple paragraph breaks when the task asks for one paragraph.

Unsafe:
- deciding whether sentences truly support the main point;
- deciding whether the paragraph is coherent.

### Review

Learner reflects:
- “My paragraph is mainly about …”
- “My strongest support is …”
- “My closing thought does …”

Full model comparison only after own saved attempt.

## 8. Week 8 — Connecting Ideas & Paragraphs

### Goal

Connect related ideas within and across two short paragraphs so the reader can follow the response.

### Foundation link
Organize Writing + Write Clear Sentences

### Learn

Teach simple reader signals:

Core:
- **First,**
- **Another reason is …**
- **For example,**
- **Overall,**

Optional extension:
- **However,** for contrast, only if the learner is ready.

Teach that connecting phrases help relationships; they do not replace good ideas.

Teach paragraph purpose:
- Paragraph 1: first main idea/support.
- Paragraph 2: another main idea/support or a clear next part.

Common mistake:
adding a connecting phrase to two ideas that are not actually related.

### Guided Practice

Objective items:
1. choose a phrase that introduces an example;
2. choose a phrase that adds another reason;
3. choose where a paragraph break should occur in a predetermined response;
4. order two short paragraph blocks.

### Main Practice

Prompt:

> Your school wants to improve break time. Suggest one change and explain why it would help students.

Target:
- two short paragraphs;
- approximately 80–100 words total;
- each paragraph has a clear job;
- at least one simple reader signal where useful.

Provide an optional paragraph-role reminder, not a full outline.

### Deterministic helper

Safe:
- approximate word count;
- approximate paragraph count;
- presence of at least one listed reader signal.

Unsafe:
- claiming the transition is semantically correct;
- claiming the paragraph break is logically ideal in free-form text.

### Review

- “Paragraph 1 does …”
- “Paragraph 2 does …”
- “I used ___ to help the reader follow …”

## 9. Week 9 — Applied Grammar & Self-Editing

### Goal

Use a short editing checklist on the learner's own saved draft without replacing their voice.

### Foundation link
Revise & Self-Edit

### Learn

Teach editing as a separate pass after meaning/content is in place.

Core checklist:
1. **Subject + verb** — check obvious agreement.
2. **Time / tense** — keep time reference consistent when the meaning requires it.
3. **a / an / the** — check common noun phrases.
4. **Capital letters + punctuation** — check sentence boundaries.

The lesson explains what to look for, but deterministic feedback does not certify correctness.

Common mistake:
trying to fix every word at the same time and losing the meaning of the sentence.

### Guided Practice

Use predetermined sentences only.

Objective items:
1. choose the correct verb form in a simple subject–verb example;
2. choose a consistent tense in a short context;
3. choose a/an/the in a controlled noun phrase;
4. identify punctuation/capitalization correction.

These are safely auto-scorable because the sentences are fixed and reviewed.

### Main Practice

Preferred path:
- learner chooses one saved Week 7 or Week 8 response;
- system creates an editable working copy;
- original remains immutable.

Fallback:
- if no suitable earlier saved draft exists, learner writes a short original paragraph first.

Editing workspace:
- Original snapshot (read-only)
- My edited version
- Checklist:
  - Subject + verb checked
  - Time / tense checked
  - a/an/the checked
  - capitals/punctuation checked

Do not require the learner to change something if they believe it is already correct.

### Deterministic helper

Safe:
- checklist completion;
- edited version present;
- surface-level statement “your edited version differs from the original” or “no surface change detected.”

Unsafe:
- claiming the new version is more grammatical;
- automatically correcting the draft.

### Review

- “One language feature I checked was …”
- “One change I made was …”
- “I kept this sentence because …”

## 10. Week 10 — Draft Revision & Self-Correction

### Goal

Revise meaning and organization, not only grammar.

### Foundation link
Revise & Self-Edit

### Learn

Teach the difference:

**Editing**
- fixes language form and mechanics.

**Revision**
- improves what the writing says and how it is organized.

Use a four-lens revision checklist:
- **Task** — did I answer what was asked?
- **Ideas** — did I explain the important idea enough?
- **Sentences** — can the reader follow each thought?
- **Words** — are any words too vague or repeated?

Common mistake:
changing small words while leaving a missing reason or unclear idea unchanged.

### Guided Practice

Predetermined examples:
1. choose a revision that adds missing support rather than only changing one adjective;
2. remove an unrelated sentence;
3. choose a clearer order for two support sentences;
4. choose which revision addresses the task more directly.

### Main Practice

Learner revises one of their own saved drafts:
- preferably Week 8 or Week 9;
- original is read-only;
- revised copy is separate.

Required:
- revised draft;
- “My main revision goal” selection:
  - Task
  - Ideas
  - Sentences
  - Words
- short note: “What I changed and why”

The learner may keep some sentences unchanged.

### Deterministic helper

Safe:
- required fields present;
- surface difference count / changed-vs-unchanged observation;
- word-count difference.

Unsafe:
- claiming the revision improved quality;
- deciding that the task is now fully answered.

### Review

Side-by-side:
- Before
- After
- Learner reflection

Do not automatically highlight a change as “better”; describe only visible changes unless reviewed by AI/teacher.

## 11. Week 11 — Guided Multi-Paragraph Challenge

### Goal

Combine the learned process into a supported 2–3 paragraph response with reduced scaffolding.

### Foundation link
All six Writing Foundations as optional references.

### Learn

Teach a short independent workflow:

1. Read and mark the task.
2. Plan 2–3 main points.
3. Draft.
4. Check task/support/organization.
5. Edit one language feature.

Use a process example, not a full answer to the Main Practice prompt.

### Guided Practice

Keep support light.

Objective readiness items on a different prompt:
1. identify what the task asks the writer to do;
2. identify one required support element;
3. choose the stronger of two outline structures for the fixed prompt;
4. identify an off-topic planning note.

### Main Practice

Prompt:

> Your school wants to make students' free time more useful. Suggest one change. Explain your reasons and give examples.

Target:
- approximately 100–140 words;
- 2–3 paragraphs;
- clear response to the task;
- reasons and examples.

Support:
- optional collapsed planning checklist;
- optional short reminder of the five-step process;
- no prefilled outline boxes by default.

No full sentence starters by default.

### Deterministic helper

Safe:
- approximate word count;
- approximate paragraph count;
- whether text is present;
- whether the learner marked their self-check boxes.

Unsafe:
- judging argument quality, task fulfillment or coherence.

### Review

Learner checks:
- “I answered the task.”
- “I supported my main idea(s).”
- “My paragraphs have different jobs.”
- “I revised at least one part.”

These are learner self-assessments, not deterministic grading.

Full model comparison may be revealed only after a complete saved attempt.

## 12. Week 12 — Independent Writing

### Goal

Plan, write, revise and review an independent response with minimal scaffolding.

### Foundation link
Foundations remain available but are not pushed unless requested.

### Learn

Very short reminder:
- choose your process;
- manage time;
- write first, then revise;
- use help only when needed.

Do not reteach all previous lessons.

### Guided Practice

This step should not become another heavy scaffold.

Recommended design:
**Optional Planning Scratchpad**

Learner may use:
- Task in my own words
- 2–3 idea notes
- one reminder for revision

No objective score is required for the scratchpad.

If an objective readiness check is retained, it must use a separate sample prompt and must not be required for Main Practice completion.

### Main Practice

Offer two age-appropriate prompts; learner chooses one.

Prompt A:
> Some students prefer learning from books, while others prefer learning by doing practical activities. Which helps you learn better? Explain your view with reasons and examples.

Prompt B:
> Your school can make one change to help students learn better. What change would you choose? Explain your reasons and examples.

Target:
- approximately 120–150 words;
- learner chooses paragraph structure;
- learner decides whether to use the scratchpad;
- no mandatory sentence starters;
- no mandatory outline fields.

### Feedback & Revision

Deterministic support:
- structural counts only;
- independent self-check checklist:
  - Task
  - Ideas
  - Organization
  - Sentences
  - Words

AI/teacher review may later enrich feedback but is not required to complete the week.

### Review

Learner writes:
- “What I did independently”
- “What I changed after reviewing”
- “What I want to practise next”

Model comparison:
- optional;
- after own complete saved attempt;
- clearly labeled as one possible response, not the correct answer.

## 13. Scaffolding fade across Weeks 7–12

Week 7:
medium support — optional compact paragraph plan.

Week 8:
medium-low support — paragraph-role reminder only.

Week 9:
targeted editing checklist using learner's own draft.

Week 10:
targeted revision checklist using learner's own draft.

Week 11:
low support — collapsed process checklist; no default outline fields.

Week 12:
minimal support — optional scratchpad; learner chooses process and structure.

The second half must feel visibly more independent than Weeks 1–6.

## 14. Vietnamese Support

English remains primary.

Optional micro-glosses only for abstract terms:
- paragraph — đoạn văn
- main point — ý chính
- support — ý hỗ trợ
- connecting phrase — cụm từ nối
- edit — sửa lỗi ngôn ngữ
- revise — chỉnh sửa nội dung
- draft — bản nháp
- independent writing — viết độc lập

Do not translate entire lessons by default.

## 15. Navigation

Preserve the owner-approved hierarchy:

Writing home  
→ English Writing Coach · 12 Weeks  
→ Week lesson subpages

Writing course subpages should return to:
**← English Writing Coach · 12 Weeks**

About this course / Writing Foundations remain:
**← Back to Writing**

All navigation must use save-before-leave protection.

## 16. Implementation boundary

After academic approval, WCV2-C implementation should include:
- Weeks 7–12 Learn;
- Weeks 7–12 Guided Practice / scratchpad as academically approved;
- Main Practice;
- Feedback & Revision;
- Review;
- local persistence;
- immutable earlier draft snapshots for Weeks 9–10;
- revision history;
- model-answer locks;
- progressive scaffolding fade;
- objective/practice vs proficiency separation;
- save-safe navigation.

Do not merge PR #55 merely to implement this stacked phase.

## 17. Acceptance criteria

Academic:
- progression from paragraph → connected paragraphs → editing → revision → guided challenge → independence is coherent;
- target lengths are appropriate and not treated as proficiency thresholds;
- Week 9 clearly distinguishes controlled grammar practice from free-form grammar judgment;
- Week 10 clearly distinguishes revision from editing;
- Week 11 reduces scaffolding;
- Week 12 is genuinely independent.

Safety:
- no pseudo-semantic deterministic grading;
- no auto-rewrite of learner drafts;
- no full model during active work;
- earlier learner drafts are immutable;
- free-form proficiency weight remains 0 without valid review.

Self-learning:
- enough explanation for a learner to continue without an adult at every step;
- help is optional and progressively reduced;
- Review promotes reflection instead of copying.
