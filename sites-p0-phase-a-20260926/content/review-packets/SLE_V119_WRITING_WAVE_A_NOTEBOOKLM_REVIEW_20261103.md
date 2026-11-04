# SLE v1.19.0 — Writing First: Academic Review Packet (Wave A)

**Packet ID:** `SLE-V119-WRI-WAVEA-20261103`  
**Status:** `INDEPENDENT_NOTEBOOKLM_ACADEMIC_PASS_20261104` — content approved, no mandatory fixes; production NO-GO until Wave B and technical QA  
**Source authority:** `SLE-MASTER-001 v1.1.0` on `TMA2015/self-learning-english/main`  
**Base package:** `1.18.1` (109 lessons / 913 activities, per verified current release; no historical item mutation)  
**Planned version:** `1.19.0` (not yet imported or deployed)  
**Wave A:** 6 Writing lessons × 8 activities = **48 activities** (42 deterministic single-choice scaffolds; 6 independent review-required responses)  
**Remaining planned v1.19.0 scope:** 3 Vocabulary + 3 Reading lessons (Wave B, not yet academically authored or approved). The final version target is 12 new lessons, not six.  
**Learning audience:** lower-secondary learners working toward A2–B1 objectives; CEFR tags are *instructional targets*, not placement or certification.  
**Rights:** all model texts, tasks and distractors in this packet are newly authored original examples; no third-party reading passage or media is copied; no audio needed in this Writing wave.  
**Implementation boundary:** no deploy, no import, no learner data operations until academic verdict and implementation QA. Do not insert these draft IDs in a released curriculum yet.  

## Independent review reconciliation — 2026-11-04

**Packet ID:** SLE-V119-WRI-WAVEA-20261103. **NotebookLM verdict:** PASS. **Academic adoption:** GO. **Production release:** NO-GO pending Wave B, full 1.19.0 candidate composition, regression QA and owner release authorization.

All six Writing lessons `WRI-A2-05`, `WRI-A2-06`, `WRI-B1-04`, `WRI-B1-05`, `WRI-B1-06`, `WRI-B1-07` received per-lesson PASS. **Required changes: NONE**. The independent review confirmed all 42 objective MCQ keys, six independent extended responses, task/model independence, position-neutral feedback, reasonable A2→B1 writing progression and no auto-scored Writing CEFR claims. Two **optional** ideas (non-blocking): B1 qualification chunks in Wave B Vocabulary and a future compact 4-step UI visual indicator. No change to Wave A instructional or scored items was made during reconciliation. Full review verdict was supplied by the owner after NotebookLM review, and is distinct from build/browser/production verification.

**Next current temporary review source:** `SLE_V119_VOC_REA_WAVE_B_NOTEBOOKLM_REVIEW_20261104.md`. The previous Wave A packet is now a retained audit source, not a second live standard.

## 1. Scope, sequencing and avoid-duplication rationale

Reviewed legacy lessons already include `WRI-A2-04` (reply to changed practical message) and `WRI-B1-03` (compare two course options and recommend one). This wave instead teaches the **process** of task analysis, idea selection, reason/example development, outlining, meaning-based cohesion, and revision. The previous separate 12-week Writing Coach is a *reference for progression*, not a second active standard. Avoid copying its garden-writing challenge or any current scored item into a new model.

| Order | Proposed ID (collision check required before import) | Teaching target | Prerequisite | 7 scored + 1 reviewed |
| --- | --- | --- | --- | --- |
| 1 | `WRI-A2-05` | Four-part task analysis: Topic / Task / Must Include / Boundary | `WRI-A2-04` | 8 |
| 2 | `WRI-A2-06` | Relevance, specific action, useful reason | `WRI-A2-05` | 8 |
| 3 | `WRI-B1-04` | Claim → why → specific plausible example → link back | `WRI-B1-02` | 8 |
| 4 | `WRI-B1-05` | Purposeful paragraph ordering: claim, two reasons, qualification, close | `WRI-B1-03`, `WRI-B1-04` | 8 |
| 5 | `WRI-B1-06` | Cohesion by meaning: addition, contrast, example, result, reference | `WRI-B1-05` | 8 |
| 6 | `WRI-B1-07` | A practical three-pass self-edit: task, logic, language | `WRI-B1-04`, `WRI-B1-05`, `WRI-B1-06` | 8 |

**Runtime tag map:** `writing.task_understanding`, `writing.idea_development`, `writing.organization`, `writing.cohesion`, `writing.register`, `writing.grammar`, `writing.vocabulary` are already accepted by the existing `domain/academic.ts` mapping. `writing.cohesion` maps to the Writing organisation evidence dimension; `writing.register` to the vocabulary dimension. Do **not** invent a new numerical Writing proficiency metric from MCQs. Deterministic items measure recognition/selection of writing strategies; six free-text responses have `answer: null`, `review_mode: assisted_ai_or_human`, `evidence_weight: 0`, and require an actual, grounded rubric review.

**Cross-skill Wave B planning only:** three new Vocabulary lessons should teach useful phrases for ideas, reasons and respectful recommendations (recognition + retrieval + new-context application); three new Reading lessons should use original A2/B1 texts for gist, evidence and inferred author purpose without duplicating Writing active prompts. Exact IDs, passages, keys, scaffolds and source reviews will be drafted after this Writing review, before full `1.19.0` composition.

**Forward-only academic correction:** `REA-A1-01-Q7` has a documented issue #75 concerning its `reading.detail` classification. Apply only in a new, reviewed cumulative version (do not alter historical 1.18.1 or past scores); review separately for semantic/evidence consequences. This draft does NOT claim it is fixed.

## 2. Source-to-content transformation rules

- Each worked model uses **a different** scenario than the independent assessed task. No copying scored stems into notes, example or Tutor context before Submit.
- Every MCQ below has exactly one intended correct answer; labels A–D are editorial display only, not assumed runtime order. The actual candidate should bind keys to stable option IDs and shuffle safely.
- The `Next step` after each answer addresses an identifiable mistake; answer keys and rationales appear here for **NotebookLM review**, not in the student pre-submit UI.
- Each independent writing task is submitted and saved as `pending_review`, **not** auto-scored for semantic proficiency. Word range is guidance, never quality or CEFR evidence.
- Existing saved attempts remain immutable. Wave A new IDs are provisional until checked against the full 1.18.1 package during composition.

## 3.1 `WRI-A2-05` — Read the task before writing

**Module:** Writing | **Target:** A2 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-A2-04

### CORE 1 — Learning goals & context
- Identify the writer’s topic and purpose in a short task.
- List two to three compulsory content points without inventing extra requirements.
- Notice the reader, length and tone before drafting.

**Main technique:** Four-part task analysis: Topic / Task / Must Include / Boundary

### CORE 2 — Clear teaching and independent worked model
Use four boxes. TOPIC names what the writing is about. TASK tells you the action (invite, explain, request, recommend). MUST INCLUDE lists each detail you have to cover. BOUNDARY names the reader, tone and any word/format limit. Read the task twice: once for purpose, once to tick each requirement. Do not treat background details as instructions.

**Worked demonstration (separate prompt):** Independent worked demo — A youth centre newsletter asks: “Write a short notice inviting students to a free astronomy evening. Say WHEN it begins (Friday, 5:30 p.m.), WHERE to meet (community hall), and WHAT to bring (a notebook). Use a friendly tone. Write 50–70 words.”

**Teacher thinking:** TOPIC = astronomy evening; TASK = invite students; MUST INCLUDE = Friday 5:30, community hall, notebook; BOUNDARY = students, friendly notice, 50–70 words. The newsletter does NOT request a ticket price or contact number. Outline: invitation → time/place → what to bring → welcome.

**Worked model:**

> Join our free astronomy evening this Friday at 5:30 p.m. We will meet at the community hall and learn to recognise some bright stars. Please bring a notebook to write down interesting things you notice. Everyone is welcome, including beginners. We hope to see you there! Please arrive a few minutes early so we can begin together.

**Why it works:** The model answers every requested practical point, keeps the friendly notice format and avoids unsupported information. It is NOT a model answer for the independent task below.

**Typical mistake and correction:** Common mistake: adding an invented fee or missing one required detail because it appeared in the middle of the instructions. Repair: mark each Must Include point and tick it before submission.

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-A2-05-Q1` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A task says: “Tell a new classmate about the lunchtime drawing club.” What is the TOPIC?
- A. The lunchtime drawing club
- B. A formal job application
- C. The classmate’s test score
- D. A school lunch menu
**Key:** A — The lunchtime drawing club
**Post-submit rationale:** The topic is the drawing club, not the action or an unrelated school activity.
**Next step after a mistake:** Do not confuse the reader with the topic.

#### `WRI-A2-05-Q2` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A task says: “Write a message asking a friend to help carry books.” What is the TASK?
- A. Explain the history of books
- B. Ask a friend for help
- C. Describe your favourite book
- D. Write a report to the school
**Key:** B — Ask a friend for help
**Post-submit rationale:** “Asking” is the requested writing action.
**Next step after a mistake:** Identify the action verb in the instructions.

#### `WRI-A2-05-Q3` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A club asks for a reply including the event day, room and one item to bring. What is compulsory?
- A. A long story about last year
- B. Only the event day
- C. The three named practical details
- D. The teacher’s private telephone number
**Key:** C — The three named practical details
**Post-submit rationale:** All three details are required; other material cannot replace them.
**Next step after a mistake:** Count all specified requirements.

#### `WRI-A2-05-Q4` · `writing.register` · `single_choice` · `evidence_weight: 1`
**Question:** The reader is a close friend and the task says “friendly text message.” Which opening fits?
- A. Dear Sir or Madam,
- B. By order of the headteacher,
- C. Please find attached my report.
- D. Hi Noor, are you free on Saturday?
**Key:** D — Hi Noor, are you free on Saturday?
**Post-submit rationale:** The greeting matches a friend and a short, informal message.
**Next step after a mistake:** Check the audience before choosing the tone.

#### `WRI-A2-05-Q5` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A notice task says “Write 60–80 words.” Which statement is correct?
- A. The range is a boundary, not an automatic writing-quality score.
- B. Exactly 80 words always earns full marks.
- C. A 59-word response has no meaning.
- D. Longer writing is necessarily more accurate.
**Key:** A — The range is a boundary, not an automatic writing-quality score.
**Post-submit rationale:** Length guides the task format; it cannot measure quality by itself.
**Next step after a mistake:** Do not turn length guidance into a proficiency score.

#### `WRI-A2-05-Q6` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** A message task provides a meeting time and place. Which note is most useful before writing?
- A. Meeting? Place? Maybe.
- B. What to say → confirmed time → confirmed place → friendly end
- C. Write only the greeting and hope for the best.
- D. Add an invented price to make it interesting.
**Key:** B — What to say → confirmed time → confirmed place → friendly end
**Post-submit rationale:** The brief outline protects the two required practical points.
**Next step after a mistake:** An outline should follow the actual prompt.

#### `WRI-A2-05-Q7` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** Before sending a reply, which self-check matters most?
- A. Did I use five difficult adjectives?
- B. Did I exceed the maximum word limit?
- C. Can I tick every compulsory point in the question?
- D. Did I add unrelated information to sound clever?
**Key:** C — Can I tick every compulsory point in the question?
**Post-submit rationale:** Matching each requirement to an actual part of the draft checks task completion.
**Next step after a mistake:** Highlight where you answered each requirement.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-A2-05-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing, distinct prompt: A friend named Maya wants information about your school's weekend birdwatching group. Write Maya a friendly message explaining WHAT the group does, WHEN it meets (Saturday, 9:00 a.m.), WHERE students meet (school garden gate), and WHAT to bring (a pencil). Ask if Maya would like to join. Aim for 70–100 words. Do not give private addresses, phone numbers or invented prices.

**Review-required rubric (no inferred CEFR):** Adult/AI review only, 0–4 task rubric: (1) all four required details and question to Maya; (2) clear, friendly message for the correct reader; (3) understandable sequence; (4) meaning and basic language accuracy. Mark missing task detail separately from grammar mistakes. AI/human reviewer should quote the actual phrase needing correction. No auto CEFR from the text or word count.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: compare the first draft with the four boxes; underline one phrase for each Must Include point. If a box is empty, revise before asking for review.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 3.2 `WRI-A2-06` — Brainstorm ideas that answer the question

**Module:** Writing | **Target:** A2 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-A2-05

### CORE 1 — Learning goals & context
- Generate several possible ideas without drafting full paragraphs.
- Reject ideas that do not answer the actual prompt.
- Select two workable ideas and connect each to a clear reason.

**Main technique:** Relevance, specific action, useful reason

### CORE 2 — Clear teaching and independent worked model
Write the exact task at the top. Brainstorm 4–5 short ideas; do not judge them immediately. Then test each idea: Does it answer the prompt? Can I explain WHY it helps? Is it realistic in this context? Keep the best two, not all five. Turn each into an IDEA → REASON pair. Personal facts and invented statistics are not needed.

**Worked demonstration (separate prompt):** Independent worked demo — “Suggest two rainy-day activities for a school club and explain why they are suitable indoors.” Brainstorm: board games; short play rehearsal; outdoor football; baking with hot ovens; quiz. Reject football (not indoor) and baking (extra safety/equipment demands).

**Teacher thinking:** Keep IDEA 1 = board games; REASON = groups can play without going outside. IDEA 2 = short play rehearsal; REASON = everyone can take a role even if it rains. Outline: suggestion → board games + why → rehearsal + why → polite close.

**Worked model:**

> For rainy days, our club could organise board games in the classroom. Small groups could play together, so no one needs to go outside. We could also rehearse a short play. Every member could choose a role, and we would use a room that is already available. Both activities would give us something enjoyable to do indoors.

**Why it works:** The two selected actions fit the indoor requirement and each has a plausible reason. The demo does not give the answers to the independent task.

**Typical mistake and correction:** Common mistake: collecting many impressive-sounding ideas that do not answer the question. Repair: cross out one off-topic item and replace it with an IDEA → REASON pair.

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-A2-06-Q1` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A prompt asks for ways to make a classroom quieter. Which idea is directly relevant?
- A. Paint the basketball court blue.
- B. Give groups a clear indoor voice-level reminder.
- C. Change the school bus timetable.
- D. Buy new football shirts.
**Key:** B — Give groups a clear indoor voice-level reminder.
**Post-submit rationale:** An indoor reminder addresses noise inside the classroom.
**Next step after a mistake:** Choose ideas that change the named situation.

#### `WRI-A2-06-Q2` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which is a useful reason for placing labelled recycling bins near classrooms?
- A. Because recycling is a word.
- B. Because bins have colours.
- C. So students can sort paper and plastic more easily.
- D. So nobody ever needs a lesson.
**Key:** C — So students can sort paper and plastic more easily.
**Post-submit rationale:** The reason explains how the action can help; it is not just a repeated noun.
**Next step after a mistake:** Ask how or why the proposed action helps.

#### `WRI-A2-06-Q3` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** A brainstorm includes four ideas. When should you choose the final two?
- A. Before reading the prompt
- B. After checking relevance and explaining the likely benefit
- C. Only after writing a complete essay
- D. By picking the longest words
**Key:** B — After checking relevance and explaining the likely benefit
**Post-submit rationale:** Selection follows idea generation and a relevance test.
**Next step after a mistake:** Brainstorm first, filter second.

#### `WRI-A2-06-Q4` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A prompt asks for two safe outdoor lunchtime activities. Which should be rejected?
- A. A supervised nature walk
- B. A playground ball game with rules
- C. A supervised garden activity
- D. Watching a film in a dark indoor cinema
**Key:** D — Watching a film in a dark indoor cinema
**Post-submit rationale:** The cinema activity does not satisfy the outdoor boundary.
**Next step after a mistake:** Check boundary conditions in the task.

#### `WRI-A2-06-Q5` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which pair shows an idea followed by a useful reason?
- A. Put signs by the taps → this can remind pupils to turn off water.
- B. Put signs by the taps → signs are signs.
- C. Put signs by the taps → I like everything.
- D. Put signs by the taps → the school is old.
**Key:** A — Put signs by the taps → this can remind pupils to turn off water.
**Post-submit rationale:** The reason identifies the reminder mechanism and matches the proposed action.
**Next step after a mistake:** Reason should connect causally to the idea.

#### `WRI-A2-06-Q6` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** A student writes “We should organise a reading circle because it would help us share book recommendations.” Which statement is best?
- A. It includes no real idea.
- B. It explains a relevant idea with a realistic benefit.
- C. It is automatically B2 Writing.
- D. It is off-topic in any situation.
**Key:** B — It explains a relevant idea with a realistic benefit.
**Post-submit rationale:** The sentence links a suggestion to a reason; proficiency depends on the full task and assessment.
**Next step after a mistake:** Do not infer CEFR from one good sentence.

#### `WRI-A2-06-Q7` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which revision is most useful when a draft has four ideas but explains none?
- A. Replace every word with a longer synonym.
- B. Add two more unrelated ideas.
- C. Keep the best two ideas and explain a benefit for each.
- D. Remove all reasons.
**Key:** C — Keep the best two ideas and explain a benefit for each.
**Post-submit rationale:** Fewer developed ideas communicate more than an unsupported list.
**Next step after a mistake:** Choose depth and relevance over sheer count.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-A2-06-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing: Your school library asks students how to make the library more welcoming at break time. Suggest TWO realistic changes, explain why each would help students, and finish with a friendly recommendation. Aim for 80–110 words. Use no invented survey data or private student details.

**Review-required rubric (no inferred CEFR):** Review 0–4 per criterion: (1) two relevant library changes; (2) explained benefit for each; (3) understandable connected message; (4) natural A2 language and tone. Do not count merely listing ideas as fully developed reasoning. Open writing is PENDING REVIEW (weight 0) until actual human/approved AI rubric review.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: circle two ideas, draw an arrow from each to its benefit, and remove one sentence that does not serve the reader.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 3.3 `WRI-B1-04` — Explain a reason and support it with an example

**Module:** Writing | **Target:** B1 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-B1-02

### CORE 1 — Learning goals & context
- Distinguish a claim from a reason and an illustration.
- Build a short reason chain without inventing evidence.
- Write one developed paragraph that answers a practical question.

**Main technique:** Claim → why → specific plausible example → link back

### CORE 2 — Clear teaching and independent worked model
A strong paragraph does more than announce an opinion. Start with the CLAIM, explain WHY it matters, add a SPECIFIC and plausible example (not a fake statistic), then LINK the example back to the question. A hypothetical example should be labelled as hypothetical. Avoid repeating the same claim in three sentences. Distinguish evidence you were given from an example you invented for illustration.

**Worked demonstration (separate prompt):** Independent worked demo — “Should the youth centre run a free beginner photography workshop?” Claim: a photography workshop could help beginners take clearer pictures. Why: short guided practice introduces useful camera choices. Example (hypothetical): a student might learn to avoid blurry photos by holding a camera steadily. Link: a workshop is worth trying.

**Teacher thinking:** Teacher thinking: CLAIM = photography can become easier; WHY = guided practice shows basic techniques; EXAMPLE = a possible steadier camera hold; LINK = the youth centre could offer a workshop. No claims of measured impact.

**Worked model:**

> A free beginner photography workshop could help students feel more confident taking pictures. For example, a student might learn to hold a camera steadily so that a photo is less likely to look blurry. Trying this technique with a teacher could make practice easier. For this reason, a short workshop could be a useful activity for beginners.

**Why it works:** The example is clearly hypothetical (“might”) and supports the reason instead of making an unsupported statistical claim.

**Typical mistake and correction:** Common mistake: “It is good because it is good.” Repair: replace repetition with a mechanism: what changes, for whom and why does that matter?

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-B1-04-Q1` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which part is a CLAIM rather than a supporting reason?
- A. It may save travel time because the bus comes only once an hour.
- B. A bike rack could be useful at the school entrance.
- C. For example, my friend sometimes cycles to school.
- D. This could help students arrive on time.
**Key:** B — A bike rack could be useful at the school entrance.
**Post-submit rationale:** The bike-rack sentence states the proposed position; the others provide explanation or illustration.
**Next step after a mistake:** Separate what you believe from why you believe it.

#### `WRI-B1-04-Q2` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** A writer says “Reading clubs help because they are helpful.” What is missing?
- A. An additional exclamation mark
- B. A longer title
- C. A clear mechanism or benefit
- D. A quotation from a celebrity
**Key:** C — A clear mechanism or benefit
**Post-submit rationale:** Repeating helpful does not explain how a reading club helps students.
**Next step after a mistake:** Ask “what exactly improves and why?”

#### `WRI-B1-04-Q3` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which example is responsibly presented as hypothetical?
- A. Exactly 92% of students will enjoy it.
- B. Research proves every child loves it.
- C. All clubs improve all grades.
- D. For example, a younger student might practise reading aloud with a friend.
**Key:** D — For example, a younger student might practise reading aloud with a friend.
**Post-submit rationale:** “Might” signals an illustrative possibility, not a measured fact.
**Next step after a mistake:** Do not present invented figures as evidence.

#### `WRI-B1-04-Q4` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** Which sequence makes one reason easiest to understand?
- A. Claim → explanation → specific example → link to the question
- B. Example → new unrelated topic → claim → no link
- C. Unrelated statistic → conclusion → title
- D. Claim → same claim repeated → same claim repeated
**Key:** A — Claim → explanation → specific example → link to the question
**Post-submit rationale:** The sequence explains a reason and shows its application.
**Next step after a mistake:** Use a brief causal chain rather than repetition.

#### `WRI-B1-04-Q5` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** A proposal is about outdoor exercise. Which sentence acknowledges a sensible limitation?
- A. Every pupil can safely run everywhere.
- B. However, not everyone has a safe outdoor space nearby.
- C. The idea cannot have any limitation.
- D. Exercise must replace all school lessons.
**Key:** B — However, not everyone has a safe outdoor space nearby.
**Post-submit rationale:** The sentence recognises a real constraint without rejecting the entire idea.
**Next step after a mistake:** Acknowledge limits that matter to the reader.

#### `WRI-B1-04-Q6` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** Which sentence best links an example back to a reason?
- A. This is a sentence with an example.
- B. Anyway, I enjoy pizza.
- C. This example shows how a short reminder could reduce wasted water.
- D. Nobody needs to check the result.
**Key:** C — This example shows how a short reminder could reduce wasted water.
**Post-submit rationale:** The sentence explicitly connects the example to the water-saving reason.
**Next step after a mistake:** After an example, state what it illustrates.

#### `WRI-B1-04-Q7` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** A school asks whether to offer a beginner coding club. Which argument is most developed?
- A. It is good. It is very good.
- B. Coding club now. Great club.
- C. Everyone will get a perfect job.
- D. A beginner club could help interested students try simple projects; for example, they might design a small quiz together.
**Key:** D — A beginner club could help interested students try simple projects; for example, they might design a small quiz together.
**Post-submit rationale:** The final option provides a realistic benefit and a specific illustrative activity.
**Next step after a mistake:** Develop a reason using realistic consequences.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-B1-04-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing: Your school wants to encourage more students to walk or cycle to school *where safe and practical*. Write a short opinion response describing TWO possible benefits, explain why each might matter, and provide ONE clearly hypothetical or personal example without claiming that all students can travel this way. Aim for 120–160 words. Acknowledge one reasonable limitation (for example, distance or safe routes).

**Review-required rubric (no inferred CEFR):** Rubric 0–4: (1) addresses the safety/practicality boundary and task; (2) two genuinely developed reasons; (3) one concrete, honestly framed example; (4) coherent, reasonably accurate B1 language and realistic limitation. Extended text is not auto-scored or auto-assigned CEFR.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: label your own draft C (claim), W (why), E (example), L (link). Revise any paragraph with C–C–C rather than C–W–E–L.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 3.4 `WRI-B1-05` — Make an outline before your opinion draft

**Module:** Writing | **Target:** B1 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-B1-03, WRI-B1-04

### CORE 1 — Learning goals & context
- Select a defensible position relevant to the writer and reader.
- Organise two reasons without duplicating them.
- Write an outline which can guide a full response.

**Main technique:** Purposeful paragraph ordering: claim, two reasons, qualification, close

### CORE 2 — Clear teaching and independent worked model
Read the issue and decide whether you agree, disagree or partly agree. Write one sentence summarising your position. Make a two-reason outline: reason 1 → explanation/example; reason 2 → explanation/example. Include a sensible limitation or qualification if useful. Finish by answering the question, not starting a new unrelated idea. An outline is a tool, not a rubric-scored essay by itself.

**Worked demonstration (separate prompt):** Independent worked demo — “Should pupils help plan the school sports day?” Position: yes, alongside teachers. Reason 1: pupils know which activities interest their peers; e.g. they can suggest games. Reason 2: involvement may encourage participation; e.g. a short ideas form. Limit: teachers must still check safety, time and available equipment. Closing: combine student suggestions and staff decisions.

**Teacher thinking:** Teacher thinking: I agree with student suggestions but think staff must make final decisions. Outline: viewpoint → enjoyable activities → participation benefit → safety/time condition → consistent final judgement.

**Worked model:**

> Pupils should have a chance to suggest activities for school sports day, although teachers should make the final decisions. Students can recommend games that interest their classmates. For instance, an ideas form might collect suggestions from different age groups. In addition, inviting suggestions could help more pupils feel involved. However, staff must check that the activities are safe and fit the timetable. A shared planning process would therefore be a sensible approach.

**Why it works:** Each paragraph function has a role: position, first reason, second reason, qualification and conclusion. The example question differs from the independent prompt.

**Typical mistake and correction:** Common mistake: list three arguments in the introduction and introduce different reasons later. Repair: draft a two-reason outline first and check that each paragraph matches it.

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-B1-05-Q1` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** An opinion essay says “I partly agree.” Which outline is most consistent?
- A. Only arguments in favour, followed by “I completely disagree.”
- B. One benefit, one limitation, then a conditional conclusion
- C. Three unrelated facts about the topic
- D. A greeting without an opinion
**Key:** B — One benefit, one limitation, then a conditional conclusion
**Post-submit rationale:** A balanced position needs reasoning for both the benefit and the qualification.
**Next step after a mistake:** Outline and conclusion must agree.

#### `WRI-B1-05-Q2` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which pair offers two clearly DIFFERENT reasons for a school garden?
- A. It is good; it is nice.
- B. It is enjoyable; it is fun.
- C. Students could learn about plants; they could also practise working together.
- D. Gardens are plants; plants are gardens.
**Key:** C — Students could learn about plants; they could also practise working together.
**Post-submit rationale:** Learning about plants and teamwork are distinct potential benefits.
**Next step after a mistake:** Avoid paraphrasing one reason as a second.

#### `WRI-B1-05-Q3` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** Where should a brief qualification usually appear in a short opinion response?
- A. Inside an unrelated personal story
- B. Before reading the question
- C. Only in the title
- D. After developing the main reasons and before the final judgement
**Key:** D — After developing the main reasons and before the final judgement
**Post-submit rationale:** A limitation can refine a position once the supporting reasons are clear.
**Next step after a mistake:** Position the caveat to support, not derail, the reasoning.

#### `WRI-B1-05-Q4` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** Which conclusion matches the position “I support optional clubs, but not compulsory participation”?
- A. Optional clubs can help interested pupils, so I would keep joining voluntary.
- B. Every student must join even if they dislike it.
- C. Nobody should ever have a club.
- D. Clubs have many words in their names.
**Key:** A — Optional clubs can help interested pupils, so I would keep joining voluntary.
**Post-submit rationale:** The conclusion preserves the original condition.
**Next step after a mistake:** Check that conclusion and position are consistent.

#### `WRI-B1-05-Q5` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** A student has written four paragraphs with three repeated examples. What should the student do first?
- A. Add a fifth repeated example
- B. Check the outline and replace repetition with a different relevant reason
- C. Delete the task question
- D. Change all linkers to moreover
**Key:** B — Check the outline and replace repetition with a different relevant reason
**Post-submit rationale:** A revised outline will identify redundant content and help develop a second distinct reason.
**Next step after a mistake:** Structure before cosmetic changes.

#### `WRI-B1-05-Q6` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which topic sentence signals a paragraph about convenience?
- A. I like blue notebooks.
- B. There are many schools.
- C. A lunchtime club could be convenient because pupils would not need an extra journey.
- D. Everything has advantages.
**Key:** C — A lunchtime club could be convenient because pupils would not need an extra journey.
**Post-submit rationale:** The sentence announces a concrete convenience-based reason.
**Next step after a mistake:** Make the paragraph topic specific.

#### `WRI-B1-05-Q7` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** Which planning action should happen BEFORE drafting an opinion essay?
- A. Wait until the last sentence to choose a view
- B. Count difficult vocabulary words
- C. Copy an unrelated model paragraph
- D. Write a position and two distinct supporting reasons
**Key:** D — Write a position and two distinct supporting reasons
**Post-submit rationale:** A clear position and non-repeated reasons give the draft direction.
**Next step after a mistake:** Plan the argument before adding sentences.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-B1-05-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing: Some students think schools should organise an **optional lunchtime reading circle** once a week. Do you agree, partly agree, or disagree? Write an opinion response explaining TWO different reasons and one specific example, recognise one possible difficulty, and end with a consistent conclusion. Aim for 130–170 words. Do not invent survey results or claim participation must be compulsory.

**Review-required rubric (no inferred CEFR):** Rubric 0–4: clear viewpoint; two distinct reasons; coherent ordering with a relevant qualification; independent example; appropriate language, not length-only. Mark any inconsistent position explicitly. Extended writing remains pending human/validated AI review, evidence weight 0.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: compare the planned two reasons with your two body paragraphs. Underline the sentence that qualifies your position and the final sentence that answers the exact question.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 3.5 `WRI-B1-06` — Link ideas clearly, not mechanically

**Module:** Writing | **Target:** B1 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-B1-05

### CORE 1 — Learning goals & context
- Choose connectors because of the relationship between ideas.
- Avoid repeated or contradictory linkers.
- Use reference words without confusing the reader.

**Main technique:** Cohesion by meaning: addition, contrast, example, result, reference

### CORE 2 — Clear teaching and independent worked model
First decide the logical relationship: ADDITION (also, in addition), CONTRAST (however, although), EXAMPLE (for example), CAUSE (because), RESULT (therefore, as a result). A linking word should reveal a real connection. At B1, use a few accurate connectors rather than adding one at the start of every sentence. Make “this”, “it” and “they” point to a clear noun or idea.

**Worked demonstration (separate prompt):** Independent worked demo — two options for a class science exhibition: “An indoor display protects equipment from rain. An outdoor display offers more space. Most posters are made of paper. The group prefers indoors.” Select relationship: contrast indoor/outdoor → however; explanation/justification → because. Avoid “therefore” to introduce the contrary fact.

**Teacher thinking:** Teacher thinking: I have two competing features, so I need a contrast word; then I have a reason for the chosen option, so I need a causal explanation. My pronoun must point to indoors, not outdoors.

**Worked model:**

> An indoor exhibition would protect equipment from rain. An outdoor display, however, could provide more space. Because many posters are made of paper, the group prefers the indoor option. This choice would keep the displays safer in wet weather.

**Why it works:** “However” contrasts, “because” explains, and “this choice” refers unambiguously to the indoor option. No connector is added just to sound advanced.

**Typical mistake and correction:** Common mistake: “Although the room is small, but it is useful.” Repair: “Although the room is small, it is useful” or “The room is small, but it is useful.” Do not use although and but for the same clause relation.

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-B1-06-Q1` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** Choose the correct link: “The room is small. ___, it is quiet enough for a study group.”
- A. Therefore
- B. For example
- C. However
- D. Because
**Key:** C — However
**Post-submit rationale:** However signals the contrast between limited size and useful quietness.
**Next step after a mistake:** Choose a connector for meaning, not sophistication.

#### `WRI-B1-06-Q2` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** Choose the correct link: “We added signs ___ visitors could find the entrance.”
- A. although
- B. however
- C. for example
- D. so that
**Key:** D — so that
**Post-submit rationale:** So that introduces the intended purpose.
**Next step after a mistake:** Distinguish purpose from contrast.

#### `WRI-B1-06-Q3` · `writing.grammar` · `single_choice` · `evidence_weight: 1`
**Question:** Which sentence avoids a doubled contrast linker?
- A. Although the bus is late, we still have enough time.
- B. Although the bus is late, but we still have enough time.
- C. Although the bus late, we still enough time.
- D. However although the bus is late, but we still have time.
**Key:** A — Although the bus is late, we still have enough time.
**Post-submit rationale:** Use although with its dependent clause and a main clause; do not add but.
**Next step after a mistake:** One contrast structure is enough.

#### `WRI-B1-06-Q4` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** “The club bought new board games. They are easy to store.” What does “They” most clearly refer to?
- A. The club
- B. The new board games
- C. The pupils
- D. The storage room
**Key:** B — The new board games
**Post-submit rationale:** The plural pronoun points to the board games; there is one clear plural noun.
**Next step after a mistake:** Check reference words against their noun.

#### `WRI-B1-06-Q5` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** Which revision best links evidence to a conclusion?
- A. The club can borrow tools. Also, my shoes are blue.
- B. The club can borrow tools. Nevertheless it must be free therefore.
- C. The club can borrow tools, so a small pilot session may not need to buy much equipment.
- D. The club can borrow tools because they are words.
**Key:** C — The club can borrow tools, so a small pilot session may not need to buy much equipment.
**Post-submit rationale:** A resource mentioned in the first clause supplies a practical reason for the tentative cost conclusion.
**Next step after a mistake:** Make the second sentence a consequence of the first.

#### `WRI-B1-06-Q6` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** Which sentence shows an example rather than a contrast?
- A. The room is large; however, it is noisy.
- B. The room is quiet because the doors are closed.
- C. The room is quiet; therefore, we can study.
- D. Students might share materials; for example, one group could lend scissors to another.
**Key:** D — Students might share materials; for example, one group could lend scissors to another.
**Post-submit rationale:** For example introduces a specific illustration.
**Next step after a mistake:** Identify whether you are illustrating or opposing an idea.

#### `WRI-B1-06-Q7` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** A draft begins five consecutive sentences with “Moreover”. What is the best improvement?
- A. Keep only meaningful additions and vary sentence structure.
- B. Replace all five with “Nevertheless” even without contrast.
- C. Add five more “Moreover” sentences.
- D. Remove all reasons from the paragraph.
**Key:** A — Keep only meaningful additions and vary sentence structure.
**Post-submit rationale:** Cohesion comes from coherent ideas and accurate transitions, not connector repetition.
**Next step after a mistake:** Revise the argument instead of decorating every sentence.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-B1-06-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing: A community centre is considering a **weekend repair club for families**. Write a short, balanced recommendation about whether it should try a pilot session. Give two reasons, one realistic example, one limitation, and a conclusion. Use only connectors that express the intended relationship. Aim for 130–170 words. Do not invent formal statistics, prices or personal information.

**Review-required rubric (no inferred CEFR):** Rubric 0–4: addresses pilot-session task; logically developed ideas; clear reference and correct cohesion; appropriate balanced tone and language. Grade connector meaning, not number of linking words. Draft remains unscored pending human/validated AI review.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: circle each connector, label its function (addition, contrast, reason, result, example), and remove one that does not truly fit.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 3.6 `WRI-B1-07` — Revise a draft for task, clarity and tone

**Module:** Writing | **Target:** B1 | **Estimated time:** 25–35 min | **Prerequisites:** WRI-B1-04, WRI-B1-05, WRI-B1-06

### CORE 1 — Learning goals & context
- Detect a missed required point and revise meaning first.
- Fix unclear reference or unsupported claims before polishing words.
- Identify one realistic revision priority after submitting a draft.

**Main technique:** A practical three-pass self-edit: task, logic, language

### CORE 2 — Clear teaching and independent worked model
Revise in three passes. PASS 1 — TASK: tick each required point, audience and length/register boundary. PASS 2 — IDEAS: remove off-topic content, ensure examples support claims and each “this/they/it” refers clearly. PASS 3 — LANGUAGE: fix confusing grammar, punctuation and over-formal/casual tone. Do not erase a strong idea just because its wording needs editing. Never assume an automatic word counter knows whether the argument is true or relevant.

**Worked demonstration (separate prompt):** Independent worked demo — a short message to the science teacher requesting permission to display a student project: “Hi! Our group have made a poster about recycling. This will change everything. I hope you are well. Our group wants to put it near the classroom door because more classmates could see it. Thanks!” Checklist: request permission explicitly; correct “our group has”; replace exaggerated claim; remove filler. Revised: “Hello Ms Lee, our group has made a recycling poster. Could we display it near the classroom door? More classmates could see it there. Thank you for considering our request.”

**Teacher thinking:** Teacher thinking: PASS 1 finds the missing permission request. PASS 2 removes the impossible promise “change everything”. PASS 3 corrects “group have” to “group has” and adopts a respectful register. All changes answer the task.

**Worked model:**

> Hello Ms Lee, our group has made a recycling poster. Could we display it near the classroom door? More classmates could see it there. Thank you for considering our request.

**Why it works:** “Could we display it…?” directly completes the request. The revision corrects agreement, removes an unsupported absolute claim and keeps a polite school-appropriate tone. It does not promise a measurable effect without evidence.

**Typical mistake and correction:** Common mistake: fixing commas while missing the central request. Repair: Task first, meaning second, grammar third. A correction should be traceable to a concrete criterion.

### CORE 3 — Seven objective strategy questions (review keys)

#### `WRI-B1-07-Q1` · `writing.task_understanding` · `single_choice` · `evidence_weight: 1`
**Question:** A prompt requires “ask permission to use a room”. A draft only describes the room. What should you fix FIRST?
- A. Change every verb to the past tense.
- B. Add a clear permission request.
- C. Count how many adjectives you used.
- D. Invent a price for the room.
**Key:** B — Add a clear permission request.
**Post-submit rationale:** The draft has not fulfilled the key writing action; fix task response before polishing style.
**Next step after a mistake:** Check the main action verb in the prompt.

#### `WRI-B1-07-Q2` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** “Every student loves the new club.” The writer has no survey evidence. Which revision is safer?
- A. All students definitely love it.
- B. Everyone in the world enjoys this.
- C. Some students may enjoy the club because it offers a new activity.
- D. Exactly 100% of students love it.
**Key:** C — Some students may enjoy the club because it offers a new activity.
**Post-submit rationale:** The revision avoids an unsupported universal claim while giving a plausible reason.
**Next step after a mistake:** Replace absolute claims with appropriately cautious language.

#### `WRI-B1-07-Q3` · `writing.cohesion` · `single_choice` · `evidence_weight: 1`
**Question:** “The class met the coach after the teacher spoke to the organiser, and she gave a schedule.” Which edit improves an unclear “she”?
- A. Remove the schedule from the task.
- B. Add many new characters.
- C. Write “it gave a schedule”.
- D. Name the person who gave the schedule.
**Key:** D — Name the person who gave the schedule.
**Post-submit rationale:** The pronoun has several possible referents; naming the speaker removes ambiguity.
**Next step after a mistake:** Check every reference word for a clear antecedent.

#### `WRI-B1-07-Q4` · `writing.organization` · `single_choice` · `evidence_weight: 1`
**Question:** Which ordering is sensible for a final self-edit?
- A. Task requirements → logic and support → language accuracy
- B. Vocabulary synonyms → new topic → task
- C. Punctuation only → ignore task → submit
- D. Insert five linkers → remove all reasons
**Key:** A — Task requirements → logic and support → language accuracy
**Post-submit rationale:** The most consequential errors are missed requirements and faulty logic; surface language comes later.
**Next step after a mistake:** Prioritise meaning before style.

#### `WRI-B1-07-Q5` · `writing.register` · `single_choice` · `evidence_weight: 1`
**Question:** Which opening suits a polite school email?
- A. HEY! DO THIS NOW!
- B. Dear Headteacher, I would like to suggest a quiet study space.
- C. Yo teacher, listen up.
- D. I demand a room immediately.
**Key:** B — Dear Headteacher, I would like to suggest a quiet study space.
**Post-submit rationale:** The opening is respectful, clear and suited to a school request.
**Next step after a mistake:** Match the reader and purpose.

#### `WRI-B1-07-Q6` · `writing.grammar` · `single_choice` · `evidence_weight: 1`
**Question:** A writer replaces “The students was ready” with “The students were ready.” What type of change is this?
- A. Task point added
- B. Example removed
- C. Subject–verb agreement corrected
- D. Register changed to informal
**Key:** C — Subject–verb agreement corrected
**Post-submit rationale:** Plural students takes were in this past-time sentence.
**Next step after a mistake:** Identify the actual edit rather than overclaiming its effect.

#### `WRI-B1-07-Q7` · `writing.idea_development` · `single_choice` · `evidence_weight: 1`
**Question:** Which revision note gives usable evidence of improvement?
- A. It is perfect now.
- B. I added many words.
- C. Everything is better.
- D. I changed “everyone will benefit” to “some learners may benefit” because the draft had no evidence for “everyone”.
**Key:** D — I changed “everyone will benefit” to “some learners may benefit” because the draft had no evidence for “everyone”.
**Post-submit rationale:** The note names the original phrase, edit and reason; another reader can verify it.
**Next step after a mistake:** Make revision choices specific and grounded.

### CORE 3b — Original independent writing (NOT automatically graded)

#### `WRI-B1-07-Q8` · `extended_response` · `answer: null` · `evidence_weight: 0`
**Task:** Independent writing: Write a polite email to your headteacher suggesting a **quiet study space at lunchtime**. Explain who might benefit, give two practical features, suggest how students could share the room fairly and acknowledge one possible limitation. Aim for 130–170 words. Then add a separate 3-line revision note: (1) one task detail checked, (2) one idea improved, (3) one language correction. Do not add names, phone numbers or private information.

**Review-required rubric (no inferred CEFR):** Review rubric 0–4: task completion and register; realistic development/limitations; organisation and clear references; grammar/vocabulary/sentence clarity; revision note identifies meaningful changes. Do not auto-score language proficiency from the checklist or word count. Feedback must identify specific text spans and feasible next revision.

**Pending state:** `Submitted · Awaiting adult/approved AI review`. No invented rubric score before qualified review. Scored objective items are **writing-strategy knowledge**, not proof that the learner wrote a competent essay.

### CORE 4 — Feedback and progression
**Learner self-check/transfer:** Transfer: keep your original draft, apply one concrete edit per pass, then compare versions. A saved draft is practice evidence; an adult/validated review is required for any semantic rubric score.
**Progress rule:** Store draft/resume and actual objective answers. Show review status separately from MCQ accuracy. Suggest the next Writing lesson only after showing misconceptions and allowing targeted practice.

---

## 4. Independent NotebookLM review requirements

Review against the five current permanent English academic baselines **and** the current single `SLE-MASTER-001 v1.1.0`. Treat this packet only as a temporary review source; it is not authority to deploy.

1. Are all six targets genuinely additive to existing `WRI-A2-04`, `WRI-B1-03`, and the 12-week Writing Coach rather than redundant?
2. Is the A2→B1 sequence and each prerequisite realistic for an early-teen independent learner? Are word counts useful guidance without level inflation?
3. Do all six worked demos teach a transparent method and avoid answer leakage to active scored items/independent writing tasks?
4. For each of 42 MCQs, is the keyed answer uniquely best, with other distractors plausible and the post-submit rationale accurate even after option shuffling?
5. Do all feedback and Next step statements address real misconceptions instead of simply repeating the key?
6. Is the model language, register, grammar, tone and cultural context accurate, inclusive and level appropriate?
7. Do the six open-writing tasks genuinely ask independent application? Do their rubrics and pending-review labels avoid fabricated semantic grades and CEFR claims?
8. Are the existing accepted `writing.*` tags appropriate for each MCQ? Are there any mistaken evidence-weight or source classification assumptions?
9. Is the A2–B1 progression suitable for 6 lessons, or must a missing foundational A1 step be inserted?
10. Do any examples rely on unverified factual claims, private learner data, copyrighted materials or unsafe instructions?
11. What required changes (exact lesson and Q ID, replacement text, retest) are needed before transforming this content into candidate JSON?
12. Is the proposed Wave B 3 Vocabulary + 3 Reading scope coherent with Writing emphasis, and is the forward-only `REA-A1-01-Q7` correction safe to bundle after independent review?

### Required review verdict format

`PACKET_VERDICT`: `PASS` / `PASS_WITH_REQUIRED_CHANGES` / `FAIL` / `INSUFFICIENT_EVIDENCE`

**Summary:** educational strengths, risks and level judgement.  
**Per-lesson decision:** each of 6 lesson IDs + `PASS`, `REVISE`, or `BLOCK`, with specific concern.  
**Required fixes:** table of `ID | original wording | problem | exact correction | severity | retest`.  
**Optional suggestions:** separate from required fixes.  
**Evidence boundary:** explicitly say that this academic review is NOT a code/import/browser QA or a CEFR certification.  
**Final condition:** if any required fix remains, final status cannot be `PASS`.  

## 5. NotebookLM source handoff

- **KEEP:** the current permanent five English academic v2 baseline sources (`00_...` to `04_...`) and current `SLE-MASTER-001 v1.1.0` (replace any prior master revision, do not select two).
- **REMOVE:** all prior temporary Stage 3, Wave 6, older Writing packets and expired source-only review files from the active Notebook source selection; do not remove long-lived permanent reference documents.
- **ADD:** only this `SLE_V119_WRITING_WAVE_A_NOTEBOOKLM_REVIEW_20261103.md` source for the current academic review.

**Short NotebookLM chat request (send in chat, no long pasted prompt):** “Review the current v1.19 Writing packet against permanent English sources. Answer all numbered questions and return the required verdict. Require changes where evidence is insufficient.”

**After verdict:** fix required issues in the same temporary packet; then prepare the machine JSON and Wave B material, compose a new immutable 1.19.0, run existing PR QA, and release only after explicit authorization. Do not create a new active standard or Preview site.
