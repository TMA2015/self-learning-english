# SLE B2 Unit Completion — Batch 02 / Independent Academic Review Packet

**Packet ID:** `SLE-B2-U08U09-B02-INTERACTION-R2-20261121`  
**Status:** ORIGINAL 22 ACTIVITIES ACADEMICALLY REVIEWED (NotebookLM R1 PASS, owner-supplied); INTERACTION ADDENDUM R9 NOT YET EXPLICITLY REVIEWED. R2 is a focused interaction-design review packet only. Neither machine import nor release is authorised.  
**Scope:** Six original proposed lessons, **22 activities = 20 four-option objective Reading questions + 2 explicitly unscored Writing tasks**, two currently empty thematic Units. An additional interaction design appendix proposes optional *unscored* learning widgets; it introduces zero new canonical activities/grades and no UI implementation approval.  
**Target Units:** `B2-U08 — Explaining and facilitating discussions`; `B2-U09 — Society, technology and global challenges`. These titles match the repository's adopted `sle-unit-catalog-v1.json` on Draft PR #196 HEAD `5f1ada096ee843a60ad490446a2662483edb3f1b`.  
**Baseline / source freeze:** The **LIVE** English curriculum is `v1.28.0`, 176 lessons / 1,224 activities. A separate **unmerged Draft PR #196**, exact HEAD `5f1ada096ee843a60ad490446a2662483edb3f1b`, stages reviewed `v1.29.0`, 184 lessons / 1,256 activities (+8/+32). This packet is **successor authoring only**; do not combine, merge, import or call it v1.30.0 until the actual base branch and IDs have been rechecked.  
**Academic authority:** permanent `SLE-MASTER-001 v1.2.1` and `SLE_MASTER_CURRICULUM_FRAMEWORK_v1.0` in the dedicated English NotebookLM, plus current project content standards. Workflow: `NOTEBOOKLM_REVIEW_WORKFLOW_RULES_v1.0.md`.  
**Provenance:** All fictional scenarios, readings, exchanges and numerical data below were newly authored for this packet; they are **not empirical claims**. No third-party audio, transcript, web source, or copyrighted extract is used.  
**Hard bounds:** No AI assessment, new audio asset, learner-data write, CEFR certification, answer exposure before submission, scoring of open responses, Speech/Listening evidence claim, or new Unit-level score. The discussion simulations below are *read written dialogue*, not measured speaking/listening. All graded questions must have exactly one answer even after options are shuffled. No related-lesson link is authorised by this draft.


## R2 reviewer reconciliation — READ THIS FIRST

**Why this R2 exists.** A previous NotebookLM response reported `PACKET_ID: SLE-B2-U08U09-B02-R1-20261121` and `ACADEMIC_VERDICT: PASS`, auditing all six lessons, 20/20 objective items and 2/2 unscored Writing tasks, with `MUST_FIX: NONE` and `GO_FOR_MACHINE_CANDIDATE`. However the reviewer did **not** report the required `INTERACTION_DESIGN_VERDICT` / `INTERACTION_PILOT_PRIORITY` from the newer, interactive-source packet `SLE-B2-U08U09-B02-R1I-20261121`; the response instead said it answered 12 review questions, whereas the interactive packet has R1–R9 and specifically asks for an R9 decision. Therefore the original 22-item academic PASS can be recorded, but **R9 design approval must remain PENDING** rather than being inferred.

**Source fidelity:** The six original lesson sections (all 20 keys, their feedback, both Writing prompts and source texts) in this packet were compared byte-for-byte with the text-only R1 packet and are unchanged. The new material is the optional interaction-design addendum A2 and this R2 review instruction. No new scored activity IDs have been added.

**Current technical preflight (not reviewer evidence):** On 2026-11-21, read-only GitHub blob checks found **no collisions** for the six proposed lesson IDs `REA-B2-11`, `REA-B2-12`, `WRI-B2-10`, `REA-B2-13`, `REA-B2-14`, `WRI-B2-11`, nor their `-Q` item IDs, in either released/main cumulative v1.28.0 (176 lessons/1,224 items, blob `9d931a69...`) or unmerged PR #196 candidate v1.29.0 (184 lessons/1,256 items, blob `015b2467...`). Repeat exact-head collision checks at machine generation; this does not reserve IDs or authorise branch changes. PR #196 remains Draft/unmerged and LIVE remains v1.28.0.

**R2 independent review scope — answer precisely:**
1. Evaluate *all six* A2 lesson→widget mappings. Are the guided actions genuinely pedagogically relevant, clear, and independent from the scored source and keys? Name each Lesson ID and return PASS or CHANGE with exact correction.
2. Approve or correct the proposed first two reusable primitives (`CardSortBoard`, `ResponsePlanner`) versus later `EvidenceHighlighter`, `ConceptMapWorkspace`, `MicroRepairCard` and `VersionDiffViewer`. Consider iPad touch, keyboard alternative, 320px layout, screen-reader labels and static fallback.
3. Check that interaction actions are **unscored practice**, never CEFR proficiency evidence, graded MCQs, Writing quality judgments, or a second attempt ledger. Enforce pre-submit key concealment, separate fictional guided examples and no misleading “saved” claims for ephemeral graph nodes.
4. Decide `INTERACTION_DESIGN_VERDICT`, `INTERACTION_PILOT_PRIORITY`, `INTERACTION_SEMANTIC_SCORING`, and `INTERACTION_UI_IMPLEMENTATION` as separate fields, **even when ACADEMIC_VERDICT for the original 22 items was already PASS**.
5. Distinguish MUST_FIX design changes (exact row/lesson, replacement text) from optional suggestions. Do not re-audit 22 existing answers unless you observe a contradiction, but do review their context to check whether any interaction reveals an active answer.

**Required R2 verdict (please use these exact fields):**

```text
PACKET_ID: SLE-B2-U08U09-B02-INTERACTION-R2-20261121
BASE_CONTENT_ACADEMIC_R1: PASS_REPORTED_BY_OWNER (6/6 lessons; 20/20 MCQ; 2/2 Writing)
INTERACTION_DESIGN_VERDICT: PASS_CONCEPT_ONLY | PASS_WITH_CHANGES | REJECT
LESSON_INTERACTION_AUDIT: REA-B2-11 [...]; REA-B2-12 [...]; WRI-B2-10 [...]; REA-B2-13 [...]; REA-B2-14 [...]; WRI-B2-11 [...]
INTERACTION_PILOT_PRIORITY: [one or two primitives and reasoning]
INTERACTION_SEMANTIC_SCORING: NOT_AUTHORIZED
INTERACTION_UI_IMPLEMENTATION: NOT_AUTHORIZED_BY_ACADEMIC_PASS
MUST_FIX_INTERACTION: NONE | [exact change(s)]
OPTIONAL_IMPROVEMENTS: NONE | [specific suggestions]
MACHINE_ID_GATE: RECHECK_AT_EXACT_GITHUB_HEAD
PRODUCTION_RELEASE: NOT_AUTHORIZED
```

All six lesson sections and Addendum A2 follow for direct audit. The historical R1 prompt/format below remains evidence of the original review; the **R2 verdict template above supersedes the earlier all-content verdict template** for this focused follow-up. Do not mistake R2 concept approval for React/JSON/schema/QA approval.

---

## A. Proposed manifest and collision guard

| Proposed lesson ID | Unit | Skill | Core focus | Items |
|---|---|---|---|---:|
| `REA-B2-11` | B2-U08 | Reading | Separate positions from evidence in a chaired discussion | 5 MCQ |
| `REA-B2-12` | B2-U08 | Reading | Recognise clarification, repair and conditional agreement | 5 MCQ |
| `WRI-B2-10` | B2-U08 | Writing | Produce an accurate, neutral meeting brief | 1 unscored |
| `REA-B2-13` | B2-U09 | Reading | Evaluate an access-to-technology pilot | 5 MCQ |
| `REA-B2-14` | B2-U09 | Reading | Compare technology and environmental trade-offs | 5 MCQ |
| `WRI-B2-11` | B2-U09 | Writing | Draft a qualified technology-policy recommendation | 1 unscored |
| **Total** | **2 Units** | | **6 lessons** | **22** |

**Collision check before any machine candidate:** At the inspected 1.29 Draft Unit map, B2-U08/U09 contain no mapped lessons; earlier Batch01 added `REA-B2-10`, `WRI-B2-08`, `WRI-B2-09`. The six **proposed** IDs above follow this observed sequence, but new parallel branches or automations may have reserved them. Re-run full **lesson ID, activity ID, rubric, tag and Unit map** checks against then-current `main` and all active academic Drafts before integration. No claim is made that those IDs are permanently reserved. The two unmapped advanced pilots `REA-C1-01` and `VOC-C2-01` remain untouched.

**Pedagogical sequence:** B2-U08 builds reading-based interaction analysis and a written meeting record. B2-U09 transfers critical reading to choices involving technology, participation and environmental trade-offs. Practising written interaction analysis cannot replace actual Speaking or Listening assessment. Learners may choose different defensible conclusions in open Writing; any keyed question must be answerable from the supplied text alone.

---

## 1. REA-B2-11 — Distinguish positions, evidence and decisions (`B2-U08`)

**CORE-1: Learning goal and context.** Identify the issue, each participant's qualified position, the evidence offered, unresolved questions and the chair's actual decision in a written meeting record. B2; suggested 25–30 minutes.

**CORE-2: Independent teaching.** A useful discussion map has five columns: *speaker / claim / support / limitation / follow-up*. A chair may record an option as worth testing without approving it permanently. Distinguish an observation (what happened), a preference (what someone wants) and a decision (what is authorised). **Separate mini-model:** At a library meeting, one person says evening opening attracted 12 visitors; another notes extra staffing was required. The chair approves a second trial, not permanent evening opening. **Mistake to avoid:** treating the loudest or last speaker as the group's unanimous view.

**CORE-3: Original assessed written discussion record (fictional).**

> **Harbourview Youth Centre: Discussion on a shared study room**  
> **Chair, Mina:** “Our decision today is whether to test a quiet study room for four afternoons, not whether to redesign the whole building.”  
> **Arun, student representative:** “Several classmates have told me they need somewhere to work before the bus arrives. In an informal message poll, 34 of 51 respondents said they would probably use a quiet room. I favour a trial, although the poll went only to two clubs.”  
> **Bea, centre manager:** “We could use Room Three, but an adult must supervise it. The current rota can cover Tuesdays and Thursdays; adding two more days would require changes we have not agreed.”  
> **Leo, music-group representative:** “I support quieter space in principle. But Room Three is also where our group stores its equipment. We would need a secure alternative before it could be used.”  
> **Mina:** “So the request is supported by some potential users, but the poll does not establish demand across the centre, and the room has staffing and storage constraints. Is a two-day trial, rather than a four-day commitment, acceptable as a starting point?”  
> **Arun:** “Yes, provided the feedback form is open to people outside those two clubs.”  
> **Bea:** “I can schedule two days with the existing rota. I cannot promise a third.”  
> **Leo:** “I can accept the trial if the equipment is moved securely before the first session.”  
> **Mina:** “Recorded decision: plan a Tuesday/Thursday trial **conditional on a secure equipment plan**. We will publish an open feedback form and review attendance and staffing after two weeks. No permanent room allocation has been agreed.”

**REA-B2-11-Q1.** What did the group actually agree to?  
A. A permanent quiet room on all four afternoons  
B. A conditional two-day trial followed by review  
C. Immediate cancellation of the music group  
D. A centre-wide vote before any preparation  
**Key:** B. **Rationale:** The record authorises only a Tuesday/Thursday trial subject to secure storage. **Likely misconception:** reading the initial four-day proposal as the final decision. **Repair:** contrast the opening question with the final recorded decision.

**REA-B2-11-Q2.** What is the strongest limitation of Arun's poll?  
A. It was distributed only within two clubs  
B. It was conducted before the meeting  
C. It contained an odd number of respondents  
D. It mentioned a quiet study room  
**Key:** A. **Rationale:** The sampling route limits generalisation beyond those clubs. **Likely misconception:** treating 34 of 51 as a representative centre-wide estimate. **Repair:** identify who could not receive the poll.

**REA-B2-11-Q3.** Which statement best describes Leo's position?  
A. He rejects every form of quiet study space  
B. He wants the room permanently reserved for music  
C. He will accept the trial if the equipment is securely relocated  
D. He believes supervision is unnecessary  
**Key:** C. **Rationale:** His support is conditional on a storage solution. **Likely misconception:** confusing an operational concern with opposition to the aim. **Repair:** highlight the words marking conditions.

**REA-B2-11-Q4.** What makes Bea's statement a constraint rather than a preference?  
A. She thinks students will not attend  
B. She wants to cancel the trial  
C. She dislikes Tuesday sessions  
D. She can verify staffing for only two specified days  
**Key:** D. **Rationale:** Rota coverage sets a practical boundary on what can be offered. **Likely misconception:** assuming agreeing in principle means all scheduling is feasible. **Repair:** separate resourcing facts from attitudes.

**REA-B2-11-Q5.** Which evidence would best inform the next review?  
A. The chair's personal enthusiasm alone  
B. Attendance plus open feedback and actual staffing demands  
C. A repeat poll restricted to the same two clubs  
D. The number of chairs already in Room Three  
**Key:** B. **Rationale:** These measures test reach, demand and feasibility. **Likely misconception:** choosing one convenient measure that ignores the discussed limitations. **Repair:** connect each planned measure to one unresolved question.

**CORE-4: Unscored transfer.** Summarise the final decision in two sentences: what will happen and what remains conditional. Do not report this written summary as Speaking/Listening evidence.

---

## 2. REA-B2-12 — Clarify, repair and qualify agreement (`B2-U08`)

**CORE-1: Learning goal.** Infer why speakers ask for clarification, reformulate a proposal, and express cautious agreement in a written exchange; distinguish these pragmatic moves from agreement on all details. B2; suggested 25–30 minutes.

**CORE-2: Independent teaching.** Read moves by purpose, not just by formula: “Do you mean ...?” tests an interpretation; “In other words ...” restates; “I could support that if ...” marks conditional support; “Let's record ...” creates an actionable note. **Separate mini-model:** A volunteer asks, “Should the workshop be longer?” The organiser replies, “Do you mean each meeting, or the number of meetings?” This repairs ambiguity rather than opposing a workshop. **Mistake to avoid:** interpreting every question as disagreement.

**CORE-3: Original assessed exchange (fictional written conversation).**

> **Oakridge Community Festival: Draft planning chat**  
> **Rosa:** “We need a more accessible programme this year. I suggest moving most performances earlier.”  
> **Tariq:** “When you say ‘earlier’, do you mean the event should begin before noon, or that the evening acts should finish sooner? Those have different effects on volunteers.”  
> **Rosa:** “Good question. I mean ending the two late sets by 8 p.m., not starting everything before lunch.”  
> **June:** “That could help families who travel by bus. But the last bus schedule changes on Sundays; we should check it rather than assume 8 p.m. is enough.”  
> **Tariq:** “I could support an 8 p.m. finish if the sound team confirms that the programme fits and if we publish clear transport information.”  
> **Rosa:** “Perhaps I made the proposal sound settled. It is a working option until we hear from the sound team.”  
> **June:** “Can we also ask people who couldn't attend last year? Feedback from last year's visitors might miss the very people we want to reach.”  
> **Tariq:** “Agreed on asking them. That doesn't mean we have agreed which survey method will reach them.”  
> **Rosa:** “Then the note should say: explore an 8 p.m. end time; verify sound and transport constraints; invite views from previous non-attenders. We have not approved the final programme.”

**REA-B2-12-Q1.** What is Tariq doing in his first contribution?  
A. Objecting to any programme changes  
B. Asking for the meaning of an ambiguous proposal  
C. Promising the sound team will work longer  
D. Accepting an early morning start  
**Key:** B. **Rationale:** He distinguishes two meanings of “earlier.” **Likely misconception:** taking clarification as resistance. **Repair:** restate both interpretations.

**REA-B2-12-Q2.** What does Rosa revise in her third contribution?  
A. The festival's target audience  
B. Her belief that buses matter  
C. The idea that the timing proposal has already been settled  
D. The sound team's technical plan  
**Key:** C. **Rationale:** She explicitly changes the status of the suggestion to a working option. **Likely misconception:** reading a possible time as an approved commitment. **Repair:** mark certainty words in the proposal.

**REA-B2-12-Q3.** Which condition is part of Tariq's willingness to support the 8 p.m. end?  
A. Sound-team feasibility and clear transport information  
B. Mandatory attendance by previous visitors  
C. A guaranteed earlier first performance  
D. Cancelling all Sunday performances  
**Key:** A. **Rationale:** Both feasibility and information are explicit conditions. **Likely misconception:** isolating one part of a paired condition. **Repair:** identify each occurrence of “if.”

**REA-B2-12-Q4.** Why does June propose contacting previous non-attenders?  
A. To confirm that last year's visitors disliked the programme  
B. To replace all practical planning with voting  
C. To prove the 8 p.m. end would solve transport problems  
D. To reduce selection bias in feedback about accessibility  
**Key:** D. **Rationale:** Existing attendees may not represent those excluded. **Likely misconception:** treating a visitor survey as a complete population sample. **Repair:** compare who responded with who is missing.

**REA-B2-12-Q5.** Which conclusion is supported by the final planning note?  
A. All participants approved the final timetable  
B. An 8 p.m. finish remains under investigation  
C. The sound team rejected the proposal  
D. The festival must begin before noon  
**Key:** B. **Rationale:** The note identifies verification tasks and withholds final approval. **Likely misconception:** assuming a summary of action items is a binding decision. **Repair:** look for explicit approval language.

**CORE-4: Unscored transfer.** Classify the moves “clarify / qualify / repair / record next action” and explain one example in your own words. This is written reading-pragmatics work, not a validated live interaction.

---

## 3. WRI-B2-10 — Write a neutral meeting brief (`B2-U08`)

**CORE-1: Learning goal.** Write a concise, accurate meeting brief that retains divergent positions, conditions and follow-up ownership without inventing consensus. B2; 30–40 minutes.

**CORE-2: Teach the process.** Record *purpose → options raised → evidence/concerns → limited agreement → unresolved questions → named actions*. Use neutral reporting verbs and modal precision: *suggested, questioned, would support if, provisionally agreed*. **Independent demonstration:** In a museum planning group, one speaker favours weekend hours; the finance officer can fund a three-week pilot but not a permanent extension; the chair requests attendance figures. A correct brief does not say “The museum voted to open every weekend.” **Pitfall:** polishing disagreement away to create a nicer narrative.

**CORE-3: Original assessed meeting sources (fictional).**

**Source A — Notes from a student newspaper meeting.** The Rivergate School newspaper may introduce a fortnightly student interview page. Maya supports a pilot because 19 students submitted potential interview topics via a voluntary form shared on the paper's social feed. Evan notes the form reached mainly current readers and suggests asking non-readers what they would find useful. Selin, the safeguarding lead, requires interview consent and a review process for quotations before publication. No policy or interview page has yet been approved.

**Source B — Chair's action log.** The editorial team agreed **only** to design one unpublished sample interview page. Maya will draft neutral sample questions; Evan will propose a broader feedback route; Selin will provide an approval checklist. The sample page must not be published or include real student interviews until consent and editorial review arrangements have been confirmed. A decision about a recurring section will follow an audience test.

**WRI-B2-10-Q1 (extended response; UNSCORED).** Write a **170–230-word** neutral meeting brief for the school principal. Include the proposal, at least two distinguishable viewpoints, one sampling limitation, the consent/review safeguard, the exact limited decision, and all three action owners. End with what is *not* yet approved. Do not claim the form proves school-wide demand. Write coherent prose, not merely a bullet list.

**Assessment safeguard:** Use existing reviewed `RUBRIC-WRITING-B2` *by reference* only; `answer:null`, `evidence_weight:0`, `pending_review`, no numeric score or CEFR declaration from rule-based checks. Word count is guidance only.

**CORE-4: Self-check before optional trusted review.** Can the principal distinguish a proposal from a decision? Is every action assigned to the right person? Did the brief preserve both consent and audience uncertainty? Trusted feedback should focus on fulfilment, coherence, accurate stance/reporting verbs, register and sentence control; no pseudo-speaking score.

---

## 4. REA-B2-13 — Evaluate a digital access pilot (`B2-U09`)

**CORE-1: Learning goal.** Evaluate claims about access, inclusion and implementation from a short technology-service report without confusing use with impact. B2; 25–30 minutes.

**CORE-2: Independent teaching.** Separate *reach* (who used a service), *outcome* (what changed), *exclusion* (who might not have been reached) and *implementation* (costs/constraints). **Different-topic mini-model:** A sports booking website receives 80 visits, but no one records whether bookings increased or whether visitors without smartphones could use it. Visits alone do not prove equitable access. **Pitfall:** turning a digital activity measure into proof of learning or fairness.

**CORE-3: Original assessed source (fictional).**

> **Northbank Library: Digital help-desk pilot report**  
> For six Saturdays, Northbank Library offered a staffed desk to help residents use its online catalogue and reserve materials. The purpose was to test demand and identify barriers, not to certify that participants had become confident internet users. The desk registered 83 visits. Staff did not record unique visitors, and 21 visits involved help with an online reservation. Some people returned more than once.  
> A voluntary exit form received 31 responses. Twenty-seven respondents described the support as useful, but people who left without completing the form are not represented. Staff also heard from six walk-in visitors who did not own a suitable device at home. The desk had a library tablet available, although it could be used by one visitor at a time.  
> The pilot was busy on two rainy weekends, when other public facilities were closed. The report cannot determine whether this raised demand or merely shifted when people visited. Staff said the single tablet and the need for patient one-to-one guidance slowed the queue on some days.  
> The report recommends a further limited trial with a better method for counting unique users, an optional feedback route for non-users, clearer signs about the tablet, and a rota that protects other library duties. It does not recommend removing the paper catalogue or making online reservations compulsory. Decisions about expanding the desk should consider workload and whether residents without personal devices can still access services.

**REA-B2-13-Q1.** Why does the report avoid claiming that 83 people used the desk?  
A. Reservations can only be made on weekdays  
B. The exit form included only 31 responses  
C. Visits may include repeat users  
D. Some weekends were rainy  
**Key:** C. **Rationale:** The count is of visits, not unique people. **Misconception:** interpreting a service count as a population count. **Repair:** label the unit of measurement.

**REA-B2-13-Q2.** Which statement about the 27 positive exit responses is best supported?  
A. They indicate favourable feedback among a self-selected subset  
B. They prove that most library users can now reserve materials alone  
C. They represent every Saturday visitor  
D. They show residents no longer need printed catalogues  
**Key:** A. **Rationale:** Only some visitors chose to complete the voluntary form. **Misconception:** generalising an optional exit survey to everyone. **Repair:** name the sampling boundary.

**REA-B2-13-Q3.** Which barrier most directly affects residents without suitable home devices?  
A. The pilot took place on Saturdays  
B. The single shared tablet could serve only one person at a time  
C. Some users reserved books online  
D. The report did not record individual names  
**Key:** B. **Rationale:** Device availability limits equitable access and throughput. **Misconception:** treating a digital service as equally usable by all. **Repair:** ask what non-device owners require.

**REA-B2-13-Q4.** What can the report legitimately say about the rainy weekends?  
A. Rain permanently doubled demand  
B. Rain had no possible effect on attendance  
C. The desk should open only in bad weather  
D. Use was high on two rainy weekends, but the cause is uncertain  
**Key:** D. **Rationale:** The passage explicitly avoids causal attribution. **Misconception:** claiming a cause from a coincidence. **Repair:** distinguish an observation from an explanation.

**REA-B2-13-Q5.** Which decision is consistent with the report's recommendation?  
A. Replace all printed catalogues with mandatory online booking  
B. Announce that the pilot has eliminated the digital divide  
C. Continue a bounded trial while monitoring access and staff workload  
D. Close the desk because the figures cannot prove proficiency  
**Key:** C. **Rationale:** The source supports further evaluation with inclusion and capacity safeguards. **Misconception:** assuming uncertain evidence demands either permanent rollout or cancellation. **Repair:** look for proportionate next steps.

**CORE-4: Transfer, unscored.** Identify two measures the next pilot should collect and explain which uncertainty each resolves. No proficiency claim.

---

## 5. REA-B2-14 — Compare technology and environmental trade-offs (`B2-U09`)

**CORE-1: Learning goal.** Compare two short, plausible technology-policy proposals while distinguishing observed benefits, costs and unmeasured longer-term effects. B2; suggested 30 minutes.

**CORE-2: Independent teaching.** Make an evidence grid: *proposal / reported benefit / cost or limitation / missing evidence / conditional choice*. A comparison is not a contest to find a universally 'green' option. **Different-topic mini-model:** Digital newsletters may save printing, but email access is uneven. A school might pilot a digital-first newsletter while keeping paper copies available and measuring actual uptake. **Pitfall:** claiming that a technology is always more sustainable or more inclusive without a relevant comparison.

**CORE-3: Two fictional source briefs for one small council decision.**

> **Source A — Street-light control pilot.** Glenford Council tested motion-sensitive dimming on 14 path lights for eight evenings. The maintenance team recorded lower electricity use on the tested nights than on a comparison set of ordinary evenings, but the periods were short and weather and pedestrian traffic differed. Two residents reported that lights brightened too slowly at a junction, and the trial team has not yet assessed how the system performs in winter. Staff propose adjusting the sensors before deciding whether to expand the trial. Purchasing sensors would have an upfront cost; future maintenance needs have not been measured.
>
> **Source B — Pathway resurfacing proposal.** Another team argues that repairing uneven surfaces should be the immediate priority because several residents have reported difficulty using the path. A preliminary inspection identified three damaged sections. The proposed repair would not directly reduce lighting electricity use. Its cost estimate is provisional, and there has been no systematic access audit of all paths. The team recommends a full inspection and prioritising the most hazardous sections before committing the full budget.
>
> **Decision note.** The council has resources to begin planning only one project next month. Neither document measures long-term environmental outcomes or demonstrates that the other proposal is unnecessary. Any choice should specify what will be checked before wider investment.

**REA-B2-14-Q1.** What limits the strength of Source A's electricity-use comparison?  
A. The pilot had no working lights  
B. It involved only residents who completed a survey  
C. The council measured resurfacing at the same time  
D. The periods were short and not directly equivalent in conditions  
**Key:** D. **Rationale:** Variation in duration/conditions weakens causal conclusions. **Misconception:** treating an early comparison as a controlled long-term estimate. **Repair:** identify uncontrolled variables.

**REA-B2-14-Q2.** Which concern is specific to how the dimming system operated?  
A. Some lights brightened too slowly near a junction  
B. No damage was found on any path  
C. All residents preferred resurfacing  
D. Electricity use was never recorded  
**Key:** A. **Rationale:** The reported slow response is an operational safety/usability issue. **Misconception:** confusing a system flaw with unrelated path damage. **Repair:** separate device performance from surface condition.

**REA-B2-14-Q3.** What does Source B *not* claim?  
A. There are three inspected sections with damage  
B. More systematic access evidence is needed  
C. Resurfacing will directly reduce lighting electricity use  
D. Its current budget estimate is provisional  
**Key:** C. **Rationale:** The passage explicitly says resurfacing would not directly reduce lighting consumption. **Misconception:** attributing a benefit of one proposal to the other. **Repair:** make a separate benefit column for each source.

**REA-B2-14-Q4.** Which shared limitation applies to both briefs?  
A. Neither identifies any practical problem  
B. Neither supplies complete evidence for long-term outcomes and costs  
C. Both are final procurement authorisations  
D. Both reject future inspection  
**Key:** B. **Rationale:** Both proposals have provisional evidence and unresolved future costs/effects. **Misconception:** assuming one early brief is conclusively superior. **Repair:** identify what remains unmeasured in each.

**REA-B2-14-Q5.** Which decision statement best respects the sources?  
A. Dimming is certainly safer and cheaper over a full year  
B. Resurfacing will remove the need for any lighting  
C. The council must approve permanent expenditure immediately  
D. The council may prioritise one next investigation while documenting risks and missing evidence for both  
**Key:** D. **Rationale:** The decision note permits bounded planning, not absolute conclusions. **Misconception:** equating a priority choice with proof that the alternative has no merit. **Repair:** write an evidence-limited conditional recommendation.

**CORE-4: Unscored transfer.** Give one potential reason to prioritise each proposal and one piece of information the council still needs. Fair comparison earns practice feedback only.

---

## 6. WRI-B2-11 — Write a qualified community technology recommendation (`B2-U09`)

**CORE-1: Learning goal.** Write a balanced recommendation across two sources, distinguishing access, convenience, workload and uncertainty. B2; 30–40 minutes.

**CORE-2: Independent teaching.** Open with the decision, report the strongest warranted evidence on both sides, distinguish proposed from measured benefits, consider excluded users, and end with a reversible next step plus useful evaluation measures. **Independent demonstration:** A school considers digital lunch menus; a careful proposal allows paper alternatives, tests ease of access and measures cost before declaring success. Do not borrow facts or examples from the scored sources below. **Pitfall:** making the recommendation sound decisive by erasing people who may be disadvantaged.

**CORE-3: New assessed source bundle (fictional; distinct from the reading texts).**

**Source A — Municipal notice-board trial.** Larchfield Community Centre tried a QR-code notice board for one month. The QR link was scanned 146 times, but the centre did not record unique users, reading completion or attendance at activities. Visitors could still ask staff for a printed timetable. Staff reported that updating a single digital schedule was convenient but correcting an incorrect event time required a second check of printed notices.

**Source B — Accessibility consultation note.** In a short voluntary consultation, several older visitors and two young people without reliable mobile data said they preferred a clearly displayed paper timetable. Others valued being able to check changes on their phones. These comments are useful but not a representative survey. The centre has not estimated how many staff hours a dual-format system would require or measured whether it improves event participation.

**WRI-B2-11-Q1 (extended response; UNSCORED).** Write **190–250 words** to the centre's management committee recommending whether and how to continue digital notices. You may support digital-first, dual-format or a cautious pause, provided the reasoning is fair. Include: an accurate limitation of the 146 scans; one benefit and one access concern; a response to a plausible counterargument; a conditional next step with *two distinct measures* for a future trial; and a statement of what is not yet known. Do not add invented results or automatically infer user proficiency.

**Assessment safeguard:** Existing reviewed `RUBRIC-WRITING-B2` by reference; `answer:null`; `evidence_weight:0`; no automatic rubric scores or CEFR claim; `pending_review` until independently trusted human/adult review where supported. Any optional AI assistance must obey the separately validated age/privacy and assessment policy; it cannot create authoritative grades.

**CORE-4: Self-check and recovery.** Highlight every number and state what it counts. Have you considered people without reliable mobile access? Do your two evaluation measures address different uncertainties? After trusted qualitative feedback, revise the claim that currently overstates the evidence.

---

## A2. Interactive learning experience addendum — proposed, independently review before implementation

**Why this addendum exists:** The owner reiterated the 2026-11-21 preference to reuse NotebookLM-recommended interaction designs rather than make every lesson a sequence of MCQs. This addendum adapts the prior academic **SLE Learning Experience Framework v1.0 / Writing Coach Week 2 pilot**; the current canonical SLE-MASTER-001 v1.2.1 retains precedence. Earlier React prototype PRs #153 (pedagogical Week 2) and #155 (visual drag/mind map) were **closed without merge**, so they are DESIGN REFERENCES, not an installed runtime dependency or release evidence.

**Scope separation:** The **20 keyed MCQs and 2 unscored Writing tasks above are the complete canonical activity manifest for this round**. Every visual exercise below is a *proposed optional learning scaffold*, not a new item ID or a score-bearing response. If a future implementation wants to grade one, it must receive an additional independently reviewed prompt, key, feedback, schema, scoring policy and preservation QA. Do not convert an inferred text highlight, a draft-planning move or an interesting drag action into evidence of proficiency. No new audio or network service is needed.

| Lesson | Candidate interaction | Direct learner action | Honest feedback and reviewed data boundary |
|---|---|---|---|
| `REA-B2-11` | `CardSortBoard` (positions / evidence / constraints / decisions) | Place four independently-authored discussion-note cards into four categories, using touch or keyboard controls | Compare with reviewed categories **after** checking, then proceed to the five existing MCQs; never pre-sort the scored Harbourview passage into ready-made answers |
| `REA-B2-12` | `CardSortBoard` (clarification / reformulation / conditional agreement / final action) | Classify pragmatic moves from a **separate fictional planning conversation**, then explain in plain language why a question is not necessarily disagreement | Authored explanations only; learner's free-text rationale is unscored, and Oakridge MCQ answers remain hidden until submit |
| `WRI-B2-10` | `ResponsePlanner` | Fill editable **proposal → distinct viewpoints → sampling/consent limits → recorded decision → action owner** slots before drafting the neutral brief | Learner owns the final prose; slots are planning support, not automatic content scoring or a substitute for the existing Writing answer |
| `REA-B2-13` | `EvidenceHighlighter` | Highlight a precise sentence supporting *one independently modelled* conclusion, with an optional self-check showing the author's chosen evidence span | Literal-span match is not a reliable CEFR inference score; no scored-item answer highlight/revealed key before submission |
| `REA-B2-14` | `CardSortBoard` (measured / proposed / unknown / trade-off) | Sort short independent claims about an unrelated community project, then reflect on unsupported certainty | Non-scored guided rehearsal; avoid copying assessment data or assuming one desirable policy answer |
| `WRI-B2-11` | `ResponsePlanner` plus optional `ConceptMapWorkspace` (later) | Build a claim-evidence-limitation-counterargument-next-step outline, then write an original recommendation; optional post-save `VersionDiffViewer` highlights revisions | Plain learner text remains authoritative; no silent overwrite of saved drafts, no inferred Writing proficiency or false persistence promise for graph nodes |

**Reusable post-check support:** `MicroRepairCard` can present one reviewed misconception and a **fresh independent context** only *after* an incorrect objective response is submitted. Existing Study Notebook's unscored flashcards may link to separately reviewed reference entries, but no extra CEFR outcome is inferred from Again/Practised. These are design proposals, not proof that the current SLE player supports them.

**Implementation order proposed for separate engineering work (not part of academic verdict):** (i) pilot two reusable primitives, **keyboard/touch-compatible CardSortBoard** and **ResponsePlanner**, each with static text fallback; (ii) native Chromium/mobile and physical iPad Safari acceptance, exact-source feedback and Save/Resume compatibility; (iii) consider EvidenceHighlighter, ConceptMapWorkspace, ConceptTimeline and VersionDiffViewer later only if their usability and storage costs are justified. Existing canonical attempts, schema, answer IDs and historical versions are immutable. No mandatory AI, third-party drag/drop library, new scoring ledger or browser-storage migration. Real learner-authored text must not be sent to an additional Gemini route without independently validated provider eligibility/privacy approval.

**Reviewer decision requested:** Is each proposed interaction pedagogically suited to its lesson and genuinely independent of scored practice? Which are most valuable to prototype first? Identify any source/key leak, keyboard/touch accessibility, misleading grading or save-state caveats. Mark academically acceptable concepts separately from untested technical implementation.

---

## B. Mandatory item-level academic review questions

**R1.** Check the 6-lesson manifest, mapping to B2-U08 / B2-U09, progression, level suitability, and clarity for independent learners. Assess this as written-text practice, **not** a surrogate for actual Speaking/Listening performance.

**R2.** Audit **all 20 MCQs individually**: full passage support, one defensible key, four plausible choices, errors/ambiguities, shuffle safety, difficulty, explanation and repair guidance. Return **every question ID** in the audit result. A four-choice format must not conceal two equally defensible answers.

**R3.** Audit each reading source for internal logic, sufficiency of evidence, overstated causal inference, unrealistic decision claims, and good separation between teacher demonstration and scored source. Flag anything a B2 learner cannot determine from the provided text.

**R4.** Audit both Writing sources and prompts, including accuracy, age-appropriate fictional content, credible audience/genre, multiple defensible positions, word guidance, originality of learner response, and genuinely unscored status. Do not present formula/word count as semantic grading or CEFR evidence.

**R5.** Confirm no lesson answers, answer keys, Listening transcript, or private data are exposed before submission. Source snippets used for the assessed *reading* tasks are intentional; keys and post-submit feedback are not.

**R6.** Confirm thematic coherence and transfer to B2-U08/U09, noting the limits of no audio and no live speaking. If the Framework's outcomes require actual Listening/Speaking, classify the current written tasks as partial coverage and specify the remaining gap; do not invent evidence.

**R7.** Check whether the six proposed IDs and activity naming pattern are reasonable as candidates, **without claiming collision freedom against unprovided future GitHub branches**. If ID reservation or version sequencing is uncertain, mark the machine gate explicitly pending.

**R8.** Separate **MUST_FIX** corrections from optional enhancements. Specify exact replacement wording and affected IDs for any required correction. Avoid approving unsupported academic/assessment claims.

**R9.** Review the **A2 interactive learning experience addendum** against the previously reviewed SLE Learning Experience Framework and current permanent sources. Evaluate the six proposed lesson-widget mappings, independence from the assessed passages, iPad/keyboard accessibility, evidence and scoring honesty, preservation of canonical drafts/attempts, and prioritisation of a small free-first pilot. The interaction addendum does **not** add scored activity IDs or grant React implementation approval. Report an explicit `INTERACTION_DESIGN_VERDICT` separately from the 22-item academic audit.

## C. Required reviewer verdict format

Return:

```
PACKET_ID: SLE-B2-U08U09-B02-INTERACTION-R2-20261121
ACADEMIC_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL
LESSONS_AUDITED: x/6
OBJECTIVE_ITEMS_AUDITED: x/20
UNSCORED_WRITING_AUDITED: x/2
UNIT_OUTCOME_VERDICT: B2-U08 [status]; B2-U09 [status]
WRITTEN_VS_SPEAKING_LISTENING_EVIDENCE: [clear boundary and residual gaps]
ITEM_AUDIT: [explicit IDs REA-B2-11-Q1..Q5, REA-B2-12-Q1..Q5, REA-B2-13-Q1..Q5, REA-B2-14-Q1..Q5, each PASS/ISSUE]
WRITING_AUDIT: WRI-B2-10-Q1 [status]; WRI-B2-11-Q1 [status]
INTERACTION_DESIGN_VERDICT: PASS_CONCEPT_ONLY | PASS_WITH_CHANGES | REJECT
INTERACTION_PILOT_PRIORITY: [one or two recommended primitives, with rationale]
INTERACTION_SEMANTIC_SCORING: NOT_AUTHORIZED
INTERACTION_UI_IMPLEMENTATION: NOT_AUTHORIZED_BY_ACADEMIC_PASS
MUST_FIX: NONE | [numbered exact lesson/activity replacements and reason]
OPTIONAL_IMPROVEMENTS: NONE | [numbered suggestions]
ID_AND_MACHINE_GATE: RECHECK_AGAINST_CURRENT_REPO_REQUIRED
ACADEMIC_IMPORT_GATE: GO_FOR_MACHINE_CANDIDATE | BLOCKED_PENDING_CORRECTIONS
NO_LIVE_RELEASE_AUTHORIZATION: TRUE
```

**Important:** Even an academic PASS only authorises a *proposed* machine-readable candidate **after** ID/version revalidation against the current repository. It does not grant permission to merge, deploy, import into a real browser, change learner history or score a free response.

## D. NotebookLM source handoff (for the human operator)

**KEEP:** Current authoritative permanent SLE English baseline sources including `SLE-MASTER-001 v1.2.1`, Master Curriculum Framework v1.0, and the single current NotebookLM workflow-rules source if selected. Do not activate two competing standards versions.

**REMOVE:** Previous temporary review packet(s), especially the closed `SLE-B2C1-BRIDGE-B01-R1-20261121` packet from the active NotebookLM source set; archive outside NotebookLM if needed. Do not remove permanent sources or GitHub source history.

**ADD:** This **single Markdown file only**, `SLE_B2_U08_U09_BATCH02_INTERACTION_REVIEW_R2_20261121.md`. If the original text-only R1 Batch02 source was already uploaded, **REMOVE/replace it**, not select both versions at once.

**Short NotebookLM chat prompt** (paste only this, not the long questions):

> Review the R2 reconciliation and Addendum A2 against permanent English sources. Return the **R2 interaction-design verdict**, auditing all six lesson mappings. Report any must-fix changes; do not presume the UI is implemented.

**Source-selection warning:** If an older Batch02 R1 or superseded LEF design is also present, do not select duplicate temporary versions alongside this one. Keep one current authoritative permanent standard.

**Post-review owner handoff:** Return NotebookLM's full verdict to the project coordinator. Reconcile all MUST_FIX in this Markdown file first; rerun the review if necessary. Only then validate base version, six lesson IDs, 22 activity IDs, tagged subskills, rubric, content schema, and old-lesson immutability for a separate Draft candidate. This authoring packet has **no implementation or LIVE authority**.