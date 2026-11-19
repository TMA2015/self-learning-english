# SLE — Foundation Writing: Detailed Authoring Wave 4 (U10–U12)

**Document ID:** `SLE-FW-AUTH-W4-DRAFT-20261118`  
**Prepared:** 18 November 2026  
**Status:** **NEW, NOT YET independently academically reviewed**; does not inherit Wave 1–3 PASS.  
**Governing source:** `SLE-MASTER-001 v1.2.1`, effective on SLE GitHub `main` after owner-approved PR #169.  
**Authoring architecture:** *Foundation Writing Academic Blueprint R2* — `GO_FOR_DETAILED_AUTHORING` after NotebookLM R2 PASS.  
**Prior authoring results:** Wave 1 `FW-U01..03` PASS; Wave 2 `FW-U04..06` PASS; Wave 3 `FW-U07..09` PASS (`REQUIRED_CHANGES: NONE`).  
**Scope:** complete pedagogical copy, fixed exercises, their exact keys/rationales, authored open tasks and ethical assessment principles for the final three Units. **No code change, implementation review, AI provider assessment, curriculum import, or Firebase deployment is requested.**  
**Project:** the SLE GitHub/Firebase website, not the separate ChatGPT-in-chat English Tutor.

## A. Shared academic contract

1. These are **Units**, not scheduled weeks. Learners can revisit, pause and learn without AI. An objective answer result, a saved draft, an AI opinion and an externally validated language level are different things. Do not convert one into another.
2. Each Unit has a distinct skill: U10 = editing **mechanics while protecting intended meaning**; U11 = revising **ideas, evidence, reader logic and flow**; U12 = independently transferring a complete process **across genres**. Do not require a long essay in each micro-lesson.
3. Each primary teacher model shows **Notice → Decide → Why → Reject/repair → Transfer principle** on its own prompt, **not reused** in Cycle A, Cycle B, transfer or any supplemental MCQ. All teaching prose shown as a demonstration must remain outside learner answer boxes.
4. **Closed-form Cycle A:** mark only the exact authored item against the exact fixed context and option set. If two readings or repairs are reasonable, do not manufacture a unique key; either constrain the facts/options or mark the item open and unscored. Explain *each* wrong option's actual misconception. No blanket penalty for choosing not to edit an already-correct sentence.
5. **Cycle B and transfer:** preserve learner ownership, immutable original `V1` and explicitly saved new `V2` when present. A change can be effective, ineffective or unnecessary. Auto-validate only field presence, version identity, confirmation of successful saving and safety limits; **not** grammar accuracy, quality, coverage, reader benefit or CEFR via count, regex, edit distance or word delta.
6. **Optional writing-specific AI Tutor** is the one learner-facing entry for personalized analysis of a *confirmed saved* writing artifact, triggered by learner click, **not automatically on opening, writing or saving**. Knowledge/Explain Tutor cannot receive draft assessment data. Its academic feedback contract requires `scores:null`, `level:null`, `evidence_weight:0`, at most **three exact verbatim quotes** from matched saved input, **0–2 supported strengths**, **0–2 actionable priorities**, questions for self-revision rather than a ghostwritten replacement. No external provider eligibility, request success or cost is being certified by this packet.
7. If AI is unavailable **after a successful local save**, the truthful message is: **“AI review is currently unavailable. Your draft is saved locally; you can continue editing or finish the lesson.”** If persistence failed, instead say **“AI review is unavailable and this draft has not been saved. Please copy your text before leaving.”** Never substitute generic checklist pretending to review quality.
8. All course-process states `PRACTICE_COMPLETED`, `AI_REVIEW_AVAILABLE` and `REVISION_SAVED`: `evidence_weight:0`, `proficiency_weight:0`. The named state must reflect what actually happened. Capstone completion is **recorded process participation**, not mastery. Keep historical `writingCourseV2`, `writingCourseV2B`, `writingCourseV2C` snapshots read-only; future Foundation Writing artifacts use distinct `foundationWriting.v1/...` versions if implementation is separately approved.
9. Optional A1 bridge = short plain-English meanings and examples; optional B1 stretch = evaluate nuance, evidence and audience needs. These are **support routes**, not CEFR placement or automatic grades. Suggested lengths are only guidance. Maintain readable focus order, keyboard and screen-reader alternatives to drag/reorder, and mobile controls roughly ≥44px where applicable.
10. An independent NotebookLM academic verdict may approve **content**. It cannot declare AI Tutor globally disallowed, determine provider terms, approve coding, or merge/deploy SLE. The historical Issue #114 is **CLOSED**; it is not a standing blanket prohibition.

## A1. Fixed-vs-open decision examples

| Decision | Safe automatic feedback | Must remain qualitative |
|---|---|---|
| Fixed sentence contains an explicitly incorrect past-tense form | Choose exact grammatical correction among four authored options; explain why | Whether a learner's unrelated autobiographical sentence is grammatically correct |
| Fixed short draft asserts an unsupported percentage | Identify that statement as unsupported **relative to provided facts** | Whether an original proposal's evidence or reader impact is convincing |
| Student saves an exact V1 and a distinct V2 | Report saved/not saved, timestamps, exact version identity | Claim that the draft is improved solely because characters changed |
| Student submits a strong V1 with reasoned no-change | Allow continuation; optional reviewer may affirm no repair needed | Force a correction or deduct credit for a zero-edit V2 |
| Student completes a new-genre public notice | Report that a notice artifact exists | Claim authentic transfer/mastery without trusted semantic review |

# U10 — Edit Language Mechanics Without Changing Meaning

**Unit ID:** `FW-U10` · **2 micro-lessons** (U10.1–U10.2); two distinct cycles `FW-U10-A/B`; transfer `FW-U10-T`.  
**Observable capability:** Identify justifiable tense, subject–verb agreement, article/reference and punctuation errors in a **known** fixed context; produce an independent edited copy while protecting who did what, when and why. Leave correct language correct.  
**Main student-owned artifact:** `v1.original`, `v2.edited`, `editNotes[]` (before excerpt / after excerpt / reason), `keptAsWritten[]`, `meaningCheck`.  
**Main practice genre:** Personal recount (language editing). No fabricated autobiographical facts.  
**Scaffold:** low; optional A1/B1 only.

## U10.1 — See what actually needs editing

**Teacher:** “Editing is not hunting for a mistake in every sentence. First find what the writer means. Fix a form only when there is a good reason. Do not change the story to make your revision look more impressive.”

**Primary independent teacher think-aloud `FW-U10-D01` — Pottery studio visit.**

**Prompt known to the teacher:** A student visited a pottery studio with an aunt *last Sunday*, watched a teacher demonstrate, and made a plate. Preserve those facts while editing the student's short recount.

**Original (display-only, immutable demo V1):**
> Last Sunday, I visit a small pottery studio with my aunt. The teacher showed us how to shape a bowl. My aunt make a cup, and I made a plate. We put our pieces on a shelf, and then we went home.

1. **Notice:** “Last Sunday” fixes the narrative in the past. The writer says **I** visited; the aunt **made** a cup; the teacher **showed** the process. I will not invent new activities.
2. **Decide:** `visit → visited`, because the visit was completed last Sunday. `make → made`, because the aunt's action also happened in the past. These are two *specific* edits, not an instruction to change every verb.
3. **Why:** “The teacher showed us…” and “We put our pieces…” already use appropriate past forms. Keep both intact. The sentence with “my aunt … and I made…” is grammatical after the one correction.
4. **Reject/repair:** Reject replacing “I” with “we”: that would change the narrator. Reject “the teacher will show”: that invents future timing. Reject gratuitously changing `put` to `putted` (incorrect irregular past form).
5. **Teacher edited V2:** “Last Sunday, I **visited** a small pottery studio with my aunt. The teacher showed us how to shape a bowl. My aunt **made** a cup, and I made a plate. We put our pieces on a shelf, and then we went home.”
6. **Transfer principle:** Record the original, change only what the evidence justifies, keep already-correct material, then compare meaning across versions. The teacher V2 is **not** prefilled into any active learner field.

**Mini-concept — What exactly counts as evidence?** A date like “last Sunday” helps establish tense; the actual singular/plural subject helps choose `was/were`; a noun's first mention helps choose `a/an` in a *specified* context. But writers may choose other natural structures. Do not declare a sentence wrong merely because it differs from the teacher's style.

**Optional A1 bridge:** `yesterday`, `last week` = completed time; `we were` vs `he was`. Explain `edited copy = your text after careful corrections`.  
**Optional B1 stretch:** Explain why the past form `put` looks identical to the present, and why copying a correct verb into V2 can be an intentional editorial decision.

## U10.2 — Protect meaning, including “no change needed”

**Teacher:** “Good editing can be a small change, or no change at all. Editing quality is not the number of corrections.”

**Short separate teaching contrast (unscored, not a Cycle A answer):** In “I borrowed a book. **The book** had a blue cover,” the second mention can naturally use `the` because the reader already knows which book. Replacing it with `a book` would reduce that reference clarity. In “We went home after the lesson,” no edit is necessary from the given facts. Ask: **Did my correction change the intended event or reader reference?**

**Meaning protection prompts, learner-facing:** “Who did the action? Did I keep the original time? Did I introduce facts the original did not say? Do I have evidence that this is wrong, or am I changing style?” These are **questions about the process**, not an automated checklist claiming to grade the answer. They never generate a numeric result.

## U10.3 — Cycle A: fixed-context editor (closed-form)

**Fixed prompt `FW-U10-A`:** “The following recount describes **a completed school visit last Friday**. Its facts are fixed: the class visited a science centre; the guide showed a Moon model; several friends felt excited *during* the talk; the narrator took notes. Choose the best option for the exact question; do not add new facts.”

**Fixed original excerpt (read-only):**
> Last Friday, our class visit a science centre. The guide showed us a model of the Moon. During the visit last Friday, my friends was excited to ask questions. We took notes after the talk.

**Four authored interactions — same short text, different decisions:**

**`FW-U10-A-TENSE`** — For “Last Friday, our class ___ a science centre,” select the correct form within the fixed completed-visit meaning.

| Option | Text | Key | Feedback |
|---|---|---|---|
| A | visits | — | Present simple describes a habit; the fixed trip was completed last Friday. |
| B | **visited** | **KEY** | Past simple accurately describes the completed event with “last Friday.” |
| C | visiting | — | Missing a finite verb; “our class visiting” cannot stand as this sentence. |
| D | will visit | — | Future meaning conflicts with the explicitly completed visit. |

**`FW-U10-A-AGREEMENT`** — Complete “During the visit last Friday, my friends ___ excited to ask questions.”

| Option | Text | Key | Feedback |
|---|---|---|---|
| A | was | — | `Friends` is plural; `was` does not agree. |
| B | is | — | Present singular verb conflicts with plural `friends` and past setting. |
| C | **were** | **KEY** | Plural past form matches `friends` during yesterday's talk. |
| D | be | — | Bare verb cannot form this past declarative clause. |

**`FW-U10-A-KEEP`** — The fixed sentence is “The guide showed us a model of the Moon.” No other fact changes. Which editing decision is appropriate?

| Option | Text | Key | Feedback |
|---|---|---|---|
| A | Change `showed` to `shows`. | — | Shifts the documented completed event into present tense. |
| B | Change `us` to `them`. | — | Changes who received the explanation. |
| C | Change `a model` to `many models`. | — | Invents a different number of exhibits. |
| D | **Keep the sentence unchanged.** | **KEY** | This form is already correct for the fixed past recount; editing need not force changes. |

**`FW-U10-A-MEANING`** — The original says “**We took notes after the talk.**” Which edited sentence best keeps both the subject and the order of events?

| Option | Text | Key | Feedback |
|---|---|---|---|
| A | **We took notes after the talk.** | **KEY** | Preserves the narrator's group and the time relationship; no edit required. |
| B | We took notes before the talk. | — | Changes **after** to **before**, altering the story. |
| C | The guide took notes after the talk. | — | Replaces `we` with `the guide`, a different actor. |
| D | We will take notes after the talk. | — | Turns the completed action into a future event. |

**Immediate practice feedback:** Show the exact option's explanation above; highlight source facts used to decide (Friday/during/the guide/we). Do **not** say that a learner who solved this fixed item now edits all original writing accurately. An incorrect choice offers one additional fixed sentence with a *different* verb but same concept, never the scored answer prefilled.

**Closed-form acceptance:** exactly one key per question as supplied; four rationales each. “Keep unchanged” is correct twice **for different, explicitly bounded purposes**; there is no artificial mistake requirement. Option order may shuffle while preserving stable IDs and key references.

## U10.4 — Cycle B: edit a learner-owned original recount

**Prompt `FW-U10-B` (not pottery/science centre):** “Write a short, truthful or clearly fictional recount of a small **weekend cooking experience** for a friend who missed it. Include what happened first, one action you or someone else performed, and how it ended. The experience can be simple; you are not required to claim a real personal event.”

**Stage 1 — V1:** Write **your own** recount (roughly 55–95 words as *guidance only*). Explicitly save as immutable `FW-U10-B/V1` (original text, prompt ID, timestamp, content version). No example copy/paste into the textbox.

**Stage 2 — bounded inspection:** Display V1 on the left (read-only), a fresh copy on the right (editable V2). **Choose one of these legitimate actions:** (a) make one or more justified corrections to tense, agreement, article/reference or punctuation; **or** (b) keep a section unchanged and explain why it is already correct. The learner **does not need to invent an error**. For a wholly sound V1, the learner may save a confirmed **no-change editorial decision**, without fabricating a different V2.

**Stage 3 — own change notes:** For every actual edit (if any), identify a precise before/after excerpt plus a brief reason linked to the intended meaning. If no edit, give one evidence-based reason for keeping the text. Optional `meaningCheck` asks whether the time, actor or event changed; this is a learner explanation, **not a machine-scored truth flag**.

**Stage 4 — save/retry:** Save V2 as a distinct immutable version **only if it truly differs**, otherwise preserve V1 and save a versioned `NO_CHANGE_JUSTIFIED` process note. If saving fails, preserve the visible editor and show copy/retry guidance; no AI eligible state. When V2 saved, show a two-column or stacked diff with accessible change summaries. Do not infer “better” from a nonempty diff.

**Review acceptance:** The software may verify V1 exists and save status, and that edit notes refer to actual submitted text; whether corrections are good or the story remains accurate requires optional trusted review. Avoid detecting tense with regex on free text. All learner-owned outputs are **unassessed for proficiency** unless a separate validated review is performed.

**Optional A1 bridge:** “First…, then…, after that…” are optional prompts, not mandatory keywords.  
**Optional B1 stretch:** Explain when switching tense might be deliberate (e.g., a general fact embedded in a past recount) and why a blanket `all verbs → past` rule can be wrong.

## U10.5 — Independent transfer `FW-U10-T`

**New prompt, new genre:** A student is preparing a short **community birdwatching club notice** and wants to check the language without accidentally changing the practical details. Here is the supplied factual brief: the walk is **next Saturday at 9:00 a.m.**, meets **outside the north gate**, and visitors should **bring water**; participation is *being planned*, not confirmed. Draft a 2–4-sentence notice using those facts, save its V1, then either edit one justifiable language issue or explain why no change is needed. Save V2 if changed and record the factual details preserved. This is student-generated and not deterministically graded for correct mechanics. No claim that the walk is approved.

**Independent transfer assessment boundary:** The saved notes and fixed fact labels prove *process participation*, not that punctuation, tense, register or factual accuracy were correct. A semantic reviewer must inspect the text for that judgment.

## U10.6 — AI Tutor Writing Review lens (academic only)

**Only after verified save and explicit click.** Ask the tutor to inspect **actual before/after excerpts** for mechanically evidenced improvements or to acknowledge a correct/no-change case. The tutor may quote at most three **exact** substrings; ask the learner, e.g., “Which completed-time clue supports that tense?” or “Did this change affect who acted?”. Never invent a grammar mistake, silently rewrite the recount, auto-apply corrections, or assign a score. `scores:null`, `level:null`; output is provisional advice.

# U11 — Revise Meaning, Reason & Flow

**Unit ID:** `FW-U11` · **2 micro-lessons**, two practice cycles, one transfer.  
**Observable capability:** Make a **meaningful**, evidence-grounded change to an idea, reason, detail, paragraph role or transition — or give a well-supported keep-decision for a section already sound. Distinguish language editing from revising what the text *says to the reader*.  
**Main artifact:** immutable `v1.original` and `v2.revised` (or justified retained section), `revisionTarget`, `beforeExcerpt`, `afterExcerpt`, `readerBenefitExplanation`, `unchangedReason` as applicable.  
**Main practice genre:** Environmental improvement proposal; practical choices, no invented percentages or approved budgets.  
**Scaffold:** low; optional A1/B1.

## U11.1 — Revise the idea, not just the surface

**Teacher:** “Fixing a tense is editing. Making your reader understand *why the idea matters and what someone could do* is revising. The best revision is not necessarily the longest.”

**Independent teacher model `FW-U11-D01` — Reusable workshop badges.**

**Scenario:** Propose a feasible way for a neighbourhood craft workshop to reuse name badges at successive sessions. The organizers have not approved anything. Do not invent figures on cost or waste.

**Weak demo V1 (display-only):**
> Weekend workshops should reuse their name badges. This is a wonderful idea. Everyone will love it. It will solve the problem completely.

1. **Notice:** The writer offers a broad position, but no method. “Everyone” and “completely” overclaim. The reader cannot see who collects badges or what happens next.
2. **Decide:** Replace vague praise with a specific, conditional process: *put a return box near the exit; check and store badges for a future session*. Keep the basic intention — reuse rather than throw away.
3. **Why:** A reader can now picture the action. “Could reduce the number of new badges needed” is more defensible than “will solve the problem completely.” No invented percentage or approval.
4. **Reject/repair:** Adding `Furthermore` before the vague praise would not provide evidence. Changing `wonderful` to `extremely wonderful` changes emphasis, not meaning. Repeating the suggestion in a second paragraph adds no new reader job.
5. **Teacher demo V2:** “The workshop team could place a clearly marked badge-return box by the exit. Volunteers could check and store returned badges for the next session. This might reduce the need for new badges. Would the organizers consider trying it at one workshop?”
6. **Transfer principle:** Select the most important *reader problem*, revise with a plausible reason and concrete action, and explain the gain. The model is a separate exercise, never an answer to U11 Cycle A/B/transfer.

**Notice the limitation:** Even the teacher's proposal remains a proposal, not a tested environmental result. The writing is improved in specificity; it does not prove real-world impact.

**Optional A1 bridge:** `reason = why`, `detail = how or what exactly`, `reader job = what this part helps the reader understand`.  
**Optional B1 stretch:** Replace an absolute promise with a conditional, assess trade-offs, distinguish plausible logic from verified evidence.

## U11.2 — Choose the highest-impact target; do not force changes

**Teacher:** “A useful revision can change the claim, add a missing reason, replace unsupported facts or reorder ideas for your reader. But if a sentence is clear and supported, keep it. You do not get points for unnecessary changes.”

**Distinct small non-scored illustration:** `We could ask residents to suggest two suitable times.` If the task really is to request times, this sentence may already be effective. A reviewer should not ask for a different synonym solely to create V2. By contrast, `This will improve everything by 80%.` needs evidence that the prompt does not give; responsibly revise or omit it.

**Priority rule:** When a text both lacks a crucial required detail and has an article mistake, normally repair the **missing reader information first**, then polish mechanics. A few mechanics corrections do not substitute for giving a good reason or a practical next step.

## U11.3 — Cycle A: choose a revision plan for a fixed weak draft

**Fixed prompt `FW-U11-A`:** “Write to families about a **possible reduction in paper school announcements**. Suggest an alternative, but **keep a way for families who need paper copies to obtain them**. The proposal has not been approved and there are no measured savings.”

**Fixed weak V1 (display-only):**
> We should stop printing school announcements. Paper is bad. This idea will save 90% of all paper. Every family can just look online. The school has already agreed.

**`FW-U11-A-PRIORITY`** — Which of these revision plans best addresses *the task's important weaknesses*, given exactly the stated facts?

| Option | Plan | Key | Rationale |
|---|---|---|---|
| A | Add “Furthermore” before every sentence. | — | Connector decoration does not address inaccessible notices or unsupported promises. |
| B | **Offer a digital option plus requested paper copies; remove invented 90% and approval claims.** | **KEY** | Keeps access for families needing paper and removes facts the prompt did not establish. |
| C | Delete mention of paper-copy access to keep the proposal short. | — | Violates an explicit reader-access requirement. |
| D | Replace “Paper is bad” with “Paper is extremely bad.” | — | Intensifies an empty claim without providing method or accurate evidence. |

**`FW-U11-A-EVIDENCE`** — Which phrase in the **fixed V1** is an unsupported quantitative claim?

| Option | Text | Key | Rationale |
|---|---|---|---|
| A | We should stop printing school announcements. | — | This is a proposal to discuss, not a measured statistic. It may be an overbroad proposal but is not the requested **quantitative** claim. |
| B | Paper is bad. | — | A vague judgment, not the percentage the question targets. |
| C | **This idea will save 90% of all paper.** | **KEY** | The prompt supplies no study or measurement for 90%; the number is unsupported. |
| D | Every family can just look online. | — | A faulty assumption about access, but not a percentage claim. |

**`FW-U11-A-KEEP`** — Consider this *separate sentence from a possible revised plan*: “Families who need a printed copy could request one from the school office.” The supplied task requires a paper-access route and gives no reason to treat this conditional suggestion as false. What should a conscientious reviser do **to this sentence**, on the evidence provided?

| Option | Decision | Key | Rationale |
|---|---|---|---|
| A | Rewrite it to “All families already receive an online notice.” | — | Changes purpose and invents universal internet access. |
| B | Remove it because every V2 must be shorter than V1. | — | Removes the requirement to serve families needing print copies. |
| C | Change “could” to “must”; permission was granted. | — | Falsely changes a proposal to a settled rule. |
| D | **Keep it as an appropriate possible access arrangement.** | **KEY** | It is relevant, conditional and addresses the task; unnecessary revision is not required. |

**`FW-U11-A-READER`** — Which revised sentence most directly gives the reader a practical next action **without claiming that the school has approved it**?

| Option | Text | Key | Rationale |
|---|---|---|---|
| A | **Could the school trial email notices while allowing families to request paper copies?** | **KEY** | Proposes an actionable, conditional approach and retains print access. |
| B | The school has already banned all paper notices. | — | Invents approval and contradicts the access requirement. |
| C | The digital world is very, very exciting. | — | General praise supplies no practicable next step. |
| D | Every family must install a phone app tomorrow. | — | Demands a new universal rule and ignores families needing printed notices. |

**Fixed feedback:** Mark only the best plan/key **within the supplied information**. Display a 2-column `V1 issue → reason for revision`, not a fake judgement that a learner's free essay is excellent. Optional open “write your own alternative” is saved and unscored; multiple good versions may exist.

## U11.4 — Cycle B: original environmental proposal, genuine V1→V2

**New prompt `FW-U11-B` — Reducing disposable cups at an outdoor community concert:** “Write to the volunteer coordinator suggesting **one realistic way** to use fewer disposable cups at a future concert, how people could take part, and one limitation or practical consideration. No waste numbers, budget, permission or current policy has been supplied; present all proposed actions conditionally.”

**Stage 1 — Independent V1:** Save the learner's own proposal; no teacher sample is inserted. Suggested 75–120 words are **guidance only**.  
**Stage 2 — Reader-first diagnosis:** Learner identifies (a) their core proposal, (b) one reader question their text must answer, and (c) one possible revision priority: clearer mechanism, supported reason, feasible limit, better paragraph flow, or an honest **no-change** for a portion that is already satisfactory. Do not use a one-size-fits-all checklist to claim a grade.  
**Stage 3 — V2:** Revise the student-owned text while retaining a read-only V1. A typical student may improve two meaningful places, but **no numeric edit quota** is used as quality evidence. If a selected segment genuinely needs no change, record that with a reason; if the *entire* V1 is already well matched, permit an explicit `KEEP_V1_WITH_REASON` rather than manufacturing a weak V2.  
**Stage 4 — Explain effect:** In learner words, name at least one actual changed excerpt (if changed), what the reader can understand now, and whether the intended action stayed the same. If keeping text, explain the evidence supporting that decision. Save versions atomically; no AI call during save.  
**Stage 5 — Optional Tutor:** `Compare V1↔V2` only after successful save and explicit click; ask whether the specific change improved reader understanding, not whether a changed word count proves development.

**A1 bridge:** Optional sentence starters “One possible step is…”, “This could help because…” — never prepopulate the learner's submission.  
**B1 stretch:** Consider a trade-off (cleaning reusable cups vs. access/volunteer capacity) without claiming an actual cost or waste reduction.

**Validity notes:** The software checks version identity, persistence and that an explanation was supplied, not the persuasiveness of the proposal. Even a formally complete V2 can have an unsupported or contradictory idea, which requires trusted semantic review. A good V1/justified unchanged part is never punished for not changing.

## U11.5 — Independent transfer `FW-U11-T`

**Different task/prompt:** “A community reading room wants to **reduce unnecessary electricity use** while remaining comfortable and safe. Write a short proposal to the room coordinator suggesting one small step, why it might help, and a practical limit (for example, access or safety). Save V1; identify the most consequential possible reader misunderstanding; revise one area if necessary or defend no change with a reason. Save an immutable comparison record.” No measurements, policy or approval are provided. **The learner writes all versions.**

**Review boundary:** A justified choice to retain a sound area is a legitimate exercise outcome. The program does not assign semantic accuracy on the basis of presence of “because,” number of replacements, environmental opinion or number of paragraphs.

## U11.6 — AI Tutor Writing Review lens (academic only)

Check *exact saved* V1/V2 for clarity of claim, evidence sufficiency and coherent next reader action. Ground every observation in a real quote (max three). If V2 is no better — or meaning changed wrongly — say so tentatively, with a question rather than a ghostwritten alternative. Recognize meaningful no-change decisions. Return 0–2 supported strengths, 0–2 priorities, `scores:null`, `level:null`; never write a replacement environmental proposal or fabricate approval/costs.

# U12 — Independent Capstone & New-Genre Transfer

**Unit ID:** `FW-U12` · **2 micro-lessons** (lightweight preparation and process autonomy), two distinct cycles, separate authentic transfer.  
**Observable capability:** Independently use **task analysis → idea selection → sensible plan → V1 draft → self-directed edit/revision → saved V2 or justified retain-decision**, then write for a different **audience and genre** without copying the proposal template.  
**Main artifacts:** `taskMap`, `ideaNotes`, `readerPlan`, `proposalV1`, `proposalV2` (if changed), `processReason`, `transferTaskMap`, `publicNotice`, `transferContrastNote`, all versioned/learner-owned.  
**Main genre:** Community proposal; **separate transfer genre:** public event notice.  
**Scaffold:** independent by default; accessible contextual hints by request, no hidden step quotas, no AI prerequisite.

## U12.1 — Put all steps to work, without following a script mechanically

**Teacher:** “You now have a toolbox, not a form you must fill in exactly the same way every time. Notice what this reader needs. Plan just enough. Draft, check, revise when necessary, and communicate clearly. A public notice is not the same thing as asking someone to approve a plan.”

**Independent teacher think-aloud `FW-U12-D01` — A local history photo-scanning table.**

**Teacher-only prompt:** “Write a short proposal to a community centre manager about a possible *photo-scanning table* during a local history afternoon. Suggest the purpose, a safe way to handle visitors' original photographs, and ask whether a trial could be considered. Do not claim it is approved or that the centre has scanning equipment.”

1. **Notice — four-part map:** `Topic = local-history photo-scanning idea`; `Task = propose a trial`; `Must Include = purpose + careful handling of originals + decision request`; `Boundary = community centre manager, unapproved, no verified equipment or promises`.
2. **Decide — idea and plan:** The reader needs (P1) a clear proposed activity, (P2) how it *might* work without endangering originals, and (P3) an honest request for feasibility. Short notes: `visitor brings photo voluntarily`; `volunteer handles only with consent`; `ask what equipment is available`.
3. **Why — teacher illustrative V1:** “The centre could consider a photo-scanning table during the local history afternoon. Visitors who choose to join might bring an old photograph. The organizers could first check whether a scanner and a trained helper would be available. Could the manager tell us whether a small supervised trial is possible?” This is a proposal; conditional language avoids invented readiness.
4. **Reject/repair — independent V2 decision:** The teacher notices “bring an old photograph” does not explicitly protect the original. Add “Visitors would keep control of their photographs, and no copying would happen without their permission.” The teacher does **not** claim a real consent system is already in place. A mechanically extra `Furthermore` or an invented 100% success rate would not improve the idea.
5. **Transfer principle:** In proposals, ask a decision-maker to consider a future action and explain feasibility. A **public notice** must instead provide confirmed event facts to readers; it must not announce a trial that has not been approved. **Do not copy this full example** into a learner activity: every Cycle and transfer below uses different facts.

**Originality protection:** The model is a teacher example only and uses neither the community-center proposal of Cycle B nor the public notice in the transfer. The teacher model does not predetermine the learner's preferred approach.

## U12.2 — Check your process without pretending to certify mastery

**Teacher:** “An independent learner can decide which step needs more time. The task map prevents missing a requirement; the plan keeps paragraphs useful; revisions should serve the reader. You may revisit any step. Practice completion is not a CEFR result.”

**Skill transfer contrast:** A *proposal* normally states a suggested future action, reasons, feasibility and a polite request for a decision. A *notice* normally tells the public confirmed what/when/where/what to do. Neither genre requires an identical paragraph count. A well-designed two-sentence notice may be enough; a persuasive proposal may need multiple distinct paragraph jobs. Choosing a genre after reading the task is itself an important writing decision.

**Optional A1 bridge:** Offer labels `who/what/when/where/action` as explanatory prompts only; meaning stays in the student's own words.  
**Optional B1 stretch:** Add a truthful feasibility/limitations sentence, tailor the notice for newcomers, avoid claims unsupported by the prompt.

## U12.3 — Cycle A: fixed capstone readiness, different task

**Fixed prompt `FW-U12-A` (new setting: community pool wayfinding):** “The pool coordinator invites suggestions to help **first-time visitors find the changing rooms**. Write a short **proposal to the coordinator**. Suggest **one sign**, **where to put it**, and **one reason it could help**. Do **not** announce that the sign is already approved.”

**Read-only 4-part task strip (learning reference, not a second exam):**

| Topic | Task | Must Include | Boundary |
|---|---|---|---|
| Finding changing rooms at a pool | Propose a sign to a coordinator | One sign; location; reason | Not yet approved; polite request, not a public announcement |

**`FW-U12-A-COVER`** — Which *fixed candidate* best covers the exact pool proposal requirements without inventing approval?

| Option | Candidate | Key | Rationale |
|---|---|---|---|
| A | “The pool is wonderful. Everyone loves swimming.” | — | General praise omits the sign, location and reason. |
| B | “The changing-room sign has already been installed, so visitors must follow it.” | — | Invents an installation and does not propose a location with a reason. |
| C | **“Could the pool consider putting a ‘Changing Rooms’ arrow beside the main entrance? It might help new visitors find the right corridor.”** | **KEY** | Names a sign and specific placement, gives a reasonable benefit and asks rather than asserting approval. |
| D | “I recommend new swimming costumes for every visitor.” | — | Changes the task from wayfinding to clothing. |

**`FW-U12-A-GENRE`** — The sign has **not** been approved. Which opening belongs in the requested *proposal* rather than an announcement?

| Option | Opening | Key | Rationale |
|---|---|---|---|
| A | **“Would you consider adding a direction sign for first-time visitors?”** | **KEY** | Politely asks the responsible decision-maker to consider an unapproved action. |
| B | “The pool's new direction sign opens today.” | — | Presents a future suggestion as a confirmed event. |
| C | “All visitors must obey the sign that staff installed.” | — | Invents both a command and an installation. |
| D | “Today's swimming lessons will end at four.” | — | Unrelated event information does not propose a sign. |

**`FW-U12-A-FACTS`** — Which detail does **not** come from the task and therefore must **not** be stated as a fact?

| Option | Detail | Key | Rationale |
|---|---|---|---|
| A | The intended reader is the pool coordinator. | — | The prompt explicitly identifies this reader. |
| B | The sign is proposed for first-time visitors. | — | The prompt directly states the visitor problem. |
| C | The suggestion should name where the sign might go. | — | The task explicitly requires a location. |
| D | **The coordinator has funded and approved the sign.** | **KEY** | Funding/approval are absent; the prompt explicitly says it has not been approved. |

**`FW-U12-A-PLAN`** — Which note set helps draft without writing the whole response or duplicating jobs?

| Option | Notes | Key | Rationale |
|---|---|---|---|
| A | P1: praise swimming; P2: repeat that swimming is nice. | — | No sign, location or reason; redundant roles. |
| B | **P1: propose arrow sign; beside entrance; P2: easier first visit; ask coordinator to consider.** | **KEY** | Flexible keywords separate idea/location from benefit/request, covering the prompt. |
| C | Write exactly five paragraphs, whatever the audience needs. | — | A paragraph quota is not a content plan. |
| D | Announce installation date and cost before they are known. | — | Invents facts and skips actual planning. |

**Cycle A feedback policy:** Every option's explanation is learner-visible. This tests *fixed decisions* and task interpretation on a clearly bounded prompt. It does **not** claim competence in an original capstone. Reordering these draft functions can be legitimate outside the fixed options.

## U12.4 — Cycle B: independent proposal capstone

**Fresh main prompt `FW-U12-B` — Multilingual storytelling evening (unapproved):**

> “A community centre is considering new ways for neighbours of different backgrounds to share stories. Write a **proposal to the centre coordinator** suggesting a possible **multilingual storytelling evening**. Explain one accessible activity, how first-time visitors could take part without pressure to speak, and one practical arrangement or limitation. Ask whether the centre would consider the idea. **Do not** invent an approved date, budget, volunteer team or participant count.”

**Independent workspace — each field is student-owned, never model-preloaded:**

1. `FW-U12-B-TASK`: Create a four-part map for **this new prompt**: Topic / Task / Must Include / Boundary. A read-only prompt strip can stay accessible; the actual map is the learner's own, not automatically graded for semantic correctness.
2. `FW-U12-B-IDEAS`: Record two or three plausible approaches; pick one and explain its likely benefit. **No forced rejection** of sensible ideas.
3. `FW-U12-B-PLAN`: Note a small number of distinct reader jobs (suggestion; accessible way to join; practical condition and decision request). Adjust the number and order for clarity; **no 5-paragraph quota**.
4. `FW-U12-B-V1`: Write and save an independent proposal in the learner's own words. Roughly 100–160 words is **guidance only**, not a condition for PASS, quality or language level. Version is immutable once saved. Don't invent claimed approval or participant statistics.
5. `FW-U12-B-EDIT-REVISE`: Reopen **a copy** as a working V2, attend to mechanics **and** meaning. Change only what is justified; if the original is already effective, record a concrete reason for retaining the sound text. The original V1 remains available read-only. A learner who has no meaningful revision should not be forced to fabricate changes.
6. `FW-U12-B-REFLECT`: Write a short **process note**: name a requirement met, identify a decision about intended readers, and explain one actual change or justified keep-decision. Be specific; no automatic grade or strength claim from the presence of this note.
7. `FW-U12-B-SAVE`: Save final V2 if changed, or V1 plus a `KEEP_V1_WITH_REASON` record if unchanged. Successful-save status only after storage confirms; refresh/resume should recover the exact version if the future implementation supports it. Learner can finish core practice without AI.
8. `FW-U12-B-AI`: Optionally click `Review with AI Tutor` on the **matching saved version**. No auto-run. Tutor may ask a specific question about actual task coverage and reader impact, but must not write a finished proposal or infer CEFR. A later edit invalidates the earlier result.

**Student agency:** Neither a particular view of multilingual events nor the literal phrase “without pressure” is a machine-scored criterion for original sentences. A good independent proposal could use several valid participation approaches, depending on feasibility and audience.

## U12.5 — Independent different-genre transfer `FW-U12-T`

**Distinct new prompt B — confirmed beginner chess taster public notice:**

> “The youth centre has **confirmed** a **beginner chess taster** for **Thursday, 4:00–5:00 p.m.**, in **Community Room 2**. Entry is **free**. Participants should **bring a pencil** and **sign up at reception by Tuesday**. Write a short **public notice for first-time visitors** using only these confirmed facts. Make the main action easy to find. Do not ask for permission, announce extra refreshments, change the date or invent an age limit.”

**Read-only task strip:** `Topic = beginner chess taster`; `Task = public notice`; `Must Include = Thursday 4–5 p.m., Community Room 2, free, bring pencil, sign up at reception by Tuesday`; `Boundary = confirmed event, public first-time visitors, no invented extras`.

**Independent action:** Write and save a 2–5-sentence (or concise formatted) notice. Include a title if helpful, but no fixed paragraph template. Then add a **transfer contrast note** explaining how this notice differs from the unapproved, persuasive proposal in Cycle B: *confirmed event information vs. consideration request*, audience, information order. Do **not** reuse the teacher's photo-scanning example or the pool sign proposal's language.

**Transfer integrity:** The system may log `publicNotice` present, `transferContrastNote` present and successful save. It may not declare the notice accurate, accessible, persuasive or a CEFR achievement from counts/keyword hits. If there is no substantive human/eligible AI review, show **“Capstone practice saved; writing quality not assessed.”** This should not block access to other Units.

## U12.6 — AI Tutor capstone lens (academic only)

On learner click, give grounded, provisional observations on (1) the **original** saved proposal's exact task coverage, (2) the *actual changes* from V1 to V2 or the reason a good passage was kept, and (3) whether the **different-genre notice** uses confirmed event facts without turning into a request. One or two prioritized questions; no finished replacement or one-shot answer text; max three exact learner quotes **from the relevant matching saved artifacts**. `scores:null`, `level:null`, no grade and no proficiency estimate. If AI is unavailable, the learner can complete and retain the capstone process without a false assessment claim.

## U10.7 — Four supplemental misconception-specific MCQ fixtures

### `FW-U10-F01` — one best answer under its fixed context

**Stem:** A student writes a recount about a completed trip *yesterday*: “Yesterday, I go to the aquarium with my uncle.” Which edit best preserves the fact and fixes the tense?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | Yesterday, I will go to the aquarium with my uncle. | — | Moves the trip to the future, contradicting the completed past event. |
| B | Yesterday, I go to the aquarium with my uncle, really. | — | Adds emphasis but leaves the tense error. |
| C | Yesterday, my uncle goes to the aquarium without me. | — | Changes both the subject and event facts. |
| D | Yesterday, I went to the aquarium with my uncle. | **KEY** | Uses the correct irregular past form and preserves who travelled together. |

**Authoring key:** `D`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U10-F02` — one best answer under its fixed context

**Stem:** A fixed caption says “These two maps **was** on the table yesterday.” Which choice repairs agreement without altering the number of maps?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | These two maps **were** on the table yesterday. | **KEY** | Plural subject “two maps” takes past “were”; other facts remain. |
| B | This map was on the table yesterday. | — | Changes two maps into one. |
| C | These two maps is on the table yesterday. | — | Uses a singular present verb for a plural past subject. |
| D | These two maps was on the table yesterday. | — | Leaves the agreement error unchanged. |

**Authoring key:** `A`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U10-F03` — one best answer under its fixed context

**Stem:** The fixed story has already introduced “a lantern” in sentence 1. Sentence 2 reads “___ lantern lit the path.” Which option gives the clearest reference to the same lantern?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | An | — | “An lantern” is grammatically wrong because “lantern” begins with a consonant sound. |
| B | Some | — | “Some lantern” does not fit the specified singular item. |
| C | The | **KEY** | The reader already knows which particular lantern is meant. |
| D | A | — | A new indefinite article may suggest a different lantern, losing the intended exact reference. |

**Authoring key:** `C`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U10-F04` — one best answer under its fixed context

**Stem:** A writer has a correct past-tense sentence: “We left the museum at noon.” The stated facts confirm this. What is the most justified editorial action?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | Replace “We” with “They” to show a change was made. | — | Changes the actors without evidence. |
| B | Keep it unchanged and note that it accurately reports the confirmed fact. | **KEY** | A correct sentence does not need a cosmetic edit. |
| C | Change “left” to “leave” because shorter verbs are better. | — | Breaks the completed past tense. |
| D | Add “therefore” before “at noon” to sound academic. | — | A decorative connector does not serve the sentence meaning. |

**Authoring key:** `B`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

## U11.7 — Four supplemental misconception-specific MCQ fixtures

### `FW-U11-F01` — one best answer under its fixed context

**Stem:** A draft asks for a new drinking-water point but says only “It is very good.” Which replacement provides the clearest *reason* without pretending a result was measured?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | It is very, very, very good. | — | Intensifies praise but offers no mechanism or reader benefit. |
| B | Furthermore, good means good. | — | Adds a connector and circular explanation. |
| C | Everyone has already agreed to it. | — | Invents agreement and still lacks a reason. |
| D | A nearby water point could make it easier for visitors to refill bottles during long visits. | **KEY** | Supplies a plausible mechanism with cautious language; does not invent measured impact. |

**Authoring key:** `D`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U11-F02` — one best answer under its fixed context

**Stem:** A student proposal claims: “This plan will reduce traffic by exactly 74%.” The task supplies no traffic study. Which revision is most defensible?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | Remove the exact claim and explain the plausible route by which the plan *might* help. | **KEY** | Avoids an unsupported statistic and invites a reasoned, conditional proposal. |
| B | Change 74% to 99% to sound more convincing. | — | Increases an unsupported claim. |
| C | Keep 74% because precise numbers always improve Writing. | — | Precision without evidence is not reliability. |
| D | Add “Obviously” before the claim. | — | A confidence word supplies no evidence. |

**Authoring key:** `A`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U11-F03` — one best answer under its fixed context

**Stem:** A complete proposal already explains one action, why it helps, and politely asks for a decision. Which sign best supports **not forcing** another change?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | The word count is less than 100, so it is automatically perfect. | — | Length alone cannot prove completeness or quality. |
| B | The learner added three connectors, so the proposal is complete. | — | Connectors are not evidence that reader needs are covered. |
| C | A reviewer can point to the required content and a sound reason for preserving the present wording. | **KEY** | A specific evidence-based no-change rationale is legitimate. |
| D | The learner has already spent five minutes editing. | — | Time spent is not evidence of writing quality. |

**Authoring key:** `C`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U11-F04` — one best answer under its fixed context

**Stem:** A V1 says “The plan will help families.” V2 says “The plan will **really** help families.” What can be concluded from this one change alone?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | The proposal is now fully supported. | — | Adding an adverb supplies no real evidence. |
| B | The change adds emphasis but has not yet supplied a mechanism or concrete reason. | **KEY** | Correctly distinguishes stylistic emphasis from substantive revision. |
| C | The writer has reached B1 level. | — | A single modification cannot establish proficiency. |
| D | The meaning is guaranteed more accurate. | — | Emphasis may even be less defensible; accuracy is not proven. |

**Authoring key:** `B`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

## U12.7 — Four supplemental misconception-specific MCQ fixtures

### `FW-U12-F01` — one best answer under its fixed context

**Stem:** A coordinator has *not* approved a proposed lunchtime music corner. Which opening fits a proposal rather than a public event notice?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | The music corner opens tomorrow, as officially confirmed. | — | Invents approval and a date. |
| B | Everyone must attend the new music corner. | — | Announces a compulsory unapproved activity. |
| C | Would you consider a short lunchtime music corner for interested students? | **KEY** | Requests consideration without presenting plans as confirmed facts. |
| D | Free music lessons start at noon next week. | — | Invents fees, schedule and event approval. |

**Authoring key:** `C`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U12-F02` — one best answer under its fixed context

**Stem:** A confirmed board-game evening notice states Friday 6 p.m., Hall B, and “sign up at reception.” Which draft covers exactly these confirmed public details?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | Board-game evening: Friday at 6 p.m. in Hall B. Sign up at reception. | **KEY** | States the confirmed what/when/where/action and no invented restrictions. |
| B | Would the manager consider a game event one day? | — | Proposal request rather than notice; omits confirmed facts. |
| C | Board games will be in Hall A and anyone can enter without signing up. | — | Changes the hall and contradicts the action requirement. |
| D | Guaranteed free snacks at our game event. | — | Invents food and omits time, venue and action. |

**Authoring key:** `A`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U12-F03` — one best answer under its fixed context

**Stem:** A learner has saved V1 of a capstone and made no changes because every required idea is already well supported. What is the most appropriate next record?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | Auto-assign C1 for a good-looking draft. | — | No validated proficiency evidence has been produced. |
| B | Replace the whole text with an AI sample. | — | Ghostwrites and destroys ownership. |
| C | Mark revision failure because every V2 must be longer. | — | Changes and length are not quality criteria. |
| D | Save a justified KEEP_V1 decision and preserve the immutable original. | **KEY** | Accurately records a valid no-change editorial decision without fabrication. |

**Authoring key:** `D`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

### `FW-U12-F04` — one best answer under its fixed context

**Stem:** What is the strongest evidence that a learner attempted *genre transfer* from proposal to public notice, before any trusted semantic assessment?

| Choice | Learner-visible option | Correct | Feedback explanation |
|---|---|---|---|
| A | A model produced a sample notice before the learner typed. | — | Model text is not student-owned transfer evidence. |
| B | The learner independently saved a new public notice plus a note identifying how its audience and purpose differ from the proposal. | **KEY** | Documents two distinct learner artifacts and a process contrast, without claiming certified quality. |
| C | The learner copied a proposal and changed the title to “Notice.” | — | Label change alone does not establish different audience/purpose writing. |
| D | The notice contains at least five transition words. | — | Connector count is unrelated to independent genre transfer. |

**Authoring key:** `B`. Shuffle choices by stable option ID only; keep explanation tied to its chosen text.

# D. Wave 4 academic completeness and acceptance ledger

## D1. Content counts & source provenance

| Content | U10 | U11 | U12 | Wave 4 total |
|---|---:|---:|---:|---:|
| Full micro-lessons | 2 | 2 | 2 | **6** |
| Distinct teacher think-aloud on a different scenario | 1 | 1 | 1 | **3** |
| Fixed Cycle A and generative Cycle B | 2 | 2 | 2 | **6 cycles** |
| Independent transfer tasks | 1 | 1 | 1 | **3** |
| Supplemental misconception-specific MCQs | 4 | 4 | 4 | **12** |
| Option-specific feedback rationales | 16 | 16 | 16 | **48** |
| Skill-specific AI Tutor assessment lenses | 1 | 1 | 1 | **3** |

**Additional authored Cycle A closed-form items:** `FW-U10-A-TENSE`, `FW-U10-A-AGREEMENT`, `FW-U10-A-KEEP`, `FW-U10-A-MEANING`; `FW-U11-A-PRIORITY`, `FW-U11-A-EVIDENCE`, `FW-U11-A-KEEP`, `FW-U11-A-READER`; `FW-U12-A-COVER`, `FW-U12-A-GENRE`, `FW-U12-A-FACTS`, `FW-U12-A-PLAN`. These are **12 further complete sets / 48 additional option explanations**, on top of the 12 supplemental MCQs above. NotebookLM must inspect both groups; “12 MCQs/48 rationales” alone would understate this packet.

**Sources:** All teaching prompts, fixtures and rationales in this Wave are newly authored and not copied from commercial writing banks. Prior Wave results establish *progression context*, not automatic review approval for these items. All scenarios are fictional, with no claim that a described community venue actually offers or funds an event.

## D2. Prompt-separation / anti-leakage audit

| Unit | Independent teacher demo | Fixed Cycle A | Learner-owned Cycle B | Independent transfer | Supplemental MCQ scenario families |
|---|---|---|---|---|---|
| U10 | Pottery-studio past recount | Completed science-centre visit recount | Weekend cooking recount | Future birdwatching notice | Aquarium visit; two maps; lantern reference; museum exit |
| U11 | Reusable workshop badges | Paper-school-announcement proposal with print-access constraint | Disposable cups at concert proposal | Reading-room electricity proposal | Water point; traffic reduction; complete proposal; unsupported adverb-only V2 |
| U12 | Local-history photo-scanning trial | Community pool wayfinding sign | Multilingual storytelling evening proposal | Confirmed beginner chess event notice | Lunchtime music corner; board-game evening; strong capstone retention; process/genre transfer |

**Explicit cross-wave non-leakage check:** Wave 1 (task mapping/reasons), Wave 2 (sentences/unity/outlines), Wave 3 (cohesion/register/integrated draft) are **not reused as answer prompts** here. Some venues of the same general class may recur across an entire 12-unit syllabus (school/centre/library), but no identical fact pattern, answer key or named role is deliberately recycled. Reviewer should name exact IDs if any actual leakage exists.

**Genre-distribution caveat:** Approved 12-unit design labels include: U01 request message; U02 suggestion; U03 school proposal; U04 notice; U05 recommendation; U06 event plan; U07 problem/solution explanation; U08 paired peer/formal request; U09 integrated formal request; U10 personal recount edit; U11 environmental proposal revision; U12 community proposal **plus distinct public notice transfer**. A **broad** classification may count U02 “community suggestion” as a proposal and exceed the Blueprint's ≤25% per genre condition (U02/U03/U11/U12 could be **4/12**). This packet therefore **does not certify that threshold**. Ask NotebookLM for a grounded taxonomy and a narrow corrective reclassification *only if the actual writing communicative actions overlap*, not a cosmetic rename. The U12 notice **transfer** cannot be counted as its main practice to hide an overrepresented proposal category. An observed >25% meaningful overlap requires authoring correction across the relevant Unit(s), not retroactive claims that a label change fixes it.

## D3. Save/version/evidence matrix

| Event / artifact | What the system may legitimately say | What it must not claim |
|---|---|---|
| Fixed Cycle A choice correct | A selected *provided* answer was correct in this bounded prompt | The learner can edit/revise independent original writing proficiently |
| `FW-U10-B/V1` saved, V2 corrected | Version saved, changed passage recorded | Every corrected form is good or no meaning changed without trusted review |
| `FW-U10-B NO_CHANGE_JUSTIFIED` saved | Valid edit decision recorded | Unchanged recount is definitely flawless |
| `FW-U11-B/V2` saved | Revised text and explanation saved | Semantic argument improved due to length or edit distance |
| `FW-U11-B KEEP_V1_WITH_REASON` saved | The learner retained V1 with a stated rationale | It is independently high quality |
| `FW-U12-B` proposal and `FW-U12-T` notice saved | Capstone artifacts and process note are present | CEFR mastery, assessed transfer or rubric score |
| `AI_REVIEW_AVAILABLE` | An opted-in, matching, validated Tutor response actually exists | A provider was used when there was only a mock or fallback |

**No automatic remediation requirement for a high-quality original**; auto-save alone is not a personal-quality review. A `NO_CHANGE_JUSTIFIED` process note counts as a saved editorial decision but is **not** a fabricated distinct V2. Distinguish `REVISION_SAVED` (distinct V2 actually saved) from `KEEP_V1_WITH_REASON` or `NO_CHANGE_JUSTIFIED` (no distinct V2). Do not force a ghost revision to satisfy a counter.

## D4. Final-course integration risks to review academically

- **Different kinds of work:** U10 improves form *without changing intended facts*; U11 improves communicative substance *with justified rationale*; U12 transfers a self-directed process into an actually different genre/audience. The teacher must not reward mere number of edits.
- **One-best-answer fidelity:** Constrain Cycle A contexts; any equally good interpretation or intentionally correct original must allow a correct keep decision. All 24 multi-choice items (12 embedded + 12 supplemental) must be inspected. Avoid formulaic distractors that accidentally teach a parody of bad writing.
- **Preserve independence:** U12 learner-owned V1 is not a paraphrase of the teacher model. Do not pre-fill V1, V2 or notice. Different genre transfer genuinely changes communicative action, not just title.
- **Honest end-of-course display:** `12 Units visited`, `12 Units practice completed` and `capstone mastered` are not interchangeable. If no trusted quality assessment occurred, the final panel must say so without scolding the learner.
- **Writing bank genre balance:** count actual authoring tasks using semantic purpose + reader, not file labels. Flag and correct >25% if warranted. No duplicate research or re-review of past accepted Unit content without concrete fault.

## D5. Required independent NotebookLM review questions — 15

1. **R-W4-01 (progression):** Are U10 mechanics, U11 substantive revision and U12 independent process/new-genre transfer clearly distinct and appropriately sequenced after U01–U09, without forcing repetitive essays?
2. **R-W4-02 (independence):** Are all three think-aloud demos independent of their Cycle A, Cycle B, transfer and supplemental MCQs, and do they truly model Notice → Decide → Why → Reject/repair → Transfer principle?
3. **R-W4-03 (U10 meaning protection):** Does U10 accurately teach past-tense/agreement/article/reference and preserve intended actors/times, including the valid already-correct/no-change pathway? Name any mechanically ambiguous correction.
4. **R-W4-04 (U10 Cycle A):** Check every exact fixed sentence and all four options/rationales of `FW-U10-A-TENSE/AGREEMENT/KEEP/MEANING`. Are all keys unique for these constraints, and do any options wrongly force editing correct text?
5. **R-W4-05 (U10 generative practice):** Does own recount editing retain immutable V1 and preserve meaning; is the no-change decision robust, and does the notice transfer test the skill without inventing event approval?
6. **R-W4-06 (U11 meaningful revision):** Does teacher demonstration explain a reader benefit with no invented environmental figures? Does it avoid conflating adverbs/connector changes with a genuine reason or feasible action?
7. **R-W4-07 (U11 Cycle A):** Audit `FW-U11-A-PRIORITY/EVIDENCE/KEEP/READER`: all keys, all rationales, factual constraints and potential alternative valid readings; explicitly test conditional wording of paper-access plan.
8. **R-W4-08 (U11 generative V1/V2):** Does U11 allow learner-owned substantive revision and a justified keep option without forced change quotas or pseudo-semantic scoring? Does the separate electricity proposal provide authentic transfer?
9. **R-W4-09 (U12 independent capstone):** Does the main proposal demand realistic independent task map, plan, V1, meaningful edit/revision/retention and process note, without ghostwriting, arbitrary time or length gates?
10. **R-W4-10 (U12 genre transfer):** Is the confirmed chess taster *public notice* truly a new communicative genre with specified time/place/action, unlike an unapproved proposal? Are all facts grounded and the learner's work independent?
11. **R-W4-11 (U12 Cycle A):** Audit `FW-U12-A-COVER/GENRE/FACTS/PLAN` for single-best answers, audience/approval truthfulness and reasonable alternative paragraph jobs.
12. **R-W4-12 (full item audit):** Individually verify **12 supplemental MCQs with 48 explanations AND 12 embedded Cycle A MCQs with 48 explanations** (total 24 four-option items / **96 rationales**), with any ambiguity cited by exact ID, option and proposed fix.
13. **R-W4-13 (honest evidence):** Are `V1`, `V2`, `NO_CHANGE_JUSTIFIED`, `KEEP_V1_WITH_REASON`, `PRACTICE_COMPLETED`, `REVISION_SAVED`, `AI_REVIEW_AVAILABLE` and capstone completion truthfully distinguishable, and is `scores:null / level:null` Tutor contract preserved?
14. **R-W4-14 (genre balance across 12 Units):** Does the proposed *actual main-practice* genre taxonomy respect the Blueprint ≤25% cap? Specifically, could U02, U03, U11, U12 form an overrepresented **proposal** family? Require a justified count and an exact, minimal authoring change if violated; a label-only rename is **not** sufficient.
15. **R-W4-15 (blocking corrections):** Identify required academic corrections (if any) with exact IDs/quotes/keys, corrected wording and retest, separating optional mobile/editor UI improvements. **Do not judge or block AI Tutor provider use, code merge, Firebase or production release.**

## D6. Required review outcome / authoring next action

**UNREVIEWED at time of authoring.** Do not infer NotebookLM PASS from successful local structure checks.

```text
PACKET_ID: SLE-FW-AUTH-W4-NBLM-R1-20261118
TARGET: SLE-FW-AUTH-W4-DRAFT-20261118
ACADEMIC_AUTHORING_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL
KEYS_AND_RATIONALES_AUDIT: PASS | FAIL | INSUFFICIENT_EVIDENCE
OPEN_RESPONSE_ASSESSMENT_INTEGRITY: PASS | FAIL | INSUFFICIENT_EVIDENCE
CROSS_UNIT_GENRE_BALANCE: PASS | REQUIRED_CHANGE | INSUFFICIENT_EVIDENCE
REQUIRED_CHANGES: NONE | exact IDs, quote, proposed fix, retest
OPTIONAL_IMPROVEMENTS: optional list only
NEW_FOUNDATION_WRITING_U10_U12_RELEASE_DECISION: NOT_REQUESTED
EXISTING_AI_TUTOR_IMPLEMENTATION_DEPLOYMENT: OUT_OF_SCOPE
```

**If PASS:** Academic authoring for all 12 Foundation Writing Units may be described as reviewed; that does not prove runtime implementation or API success. Then consolidate reviewed Unit assets for separate implementation planning and owner-scoped GitHub integration, keeping existing learner records isolated. **If REQUIRED_CHANGE:** repair exact Wave 4 faults and resubmit only affected units/keys (avoid needlessly re-reviewing Wave 1–3). **No NotebookLM provider or deployment decision is requested.**

## D7. NotebookLM source operations and handoff

**KEEP:** current permanent English-project baseline and `SLE-MASTER-001 v1.2.1` (replace older versions).  
**REMOVE:** previous temporary Wave 3 R1 packet and any older temporary Wave 1/Wave 2 packets, as well as superseded Wave 4 drafts if loaded.  
**ADD:** only the *single* human-readable Wave 4 NotebookLM packet (embedded in the document delivered to the reviewer). No raw JSON, standalone prompt file or duplicated blueprint attachment.  
**Short chat prompt:** “Independently review the current Foundation Writing Wave 4 (U10–U12) packet against the permanent academic sources. Audit every fixed key, explanation, open task and cross-unit genre balance. Answer all 15 questions and return the required academic verdict. Technical AI/deployment is out of scope.”
