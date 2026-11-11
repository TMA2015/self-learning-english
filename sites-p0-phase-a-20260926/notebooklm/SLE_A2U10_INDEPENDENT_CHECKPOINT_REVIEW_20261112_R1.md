# SLE A2-U10 — Independent Unit Checkpoint Academic Review
**Packet ID:** SLE-A2U10-CHK-R1-20261112
**Status:** ACADEMIC PROPOSAL ONLY — NOTEBOOKLM VERDICT PENDING
**Review type:** Independent academic and assessment-design review
**Project:** Self-Learning English (G Learning), NOT the separate in-chat English Tutor
**Date:** 2026-11-12
**Normative baseline:** SLE-MASTER-001 v1.2.0 in main, canonical path sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md
**Product decision:** Issue #131; no new parallel page, separate scoring engine or paid dependency
**No implementation / no import / no merge / no production deploy / no real learner data touched**

## A. The question to resolve BEFORE implementation

The approved A2-U10 programme ALREADY has three cross-source transfer lessons:
- REA-A2-08 — Community events — compare conditions (4 reading MCQs).
- LIS-A2-07 — Mia's weekend needs — listen and decide (4 listening questions and 1 mixed-source inference question, all audio-dependent in the existing flow).
- WRI-A2-07 — Write Mia a helpful evidence-based reply (1 original open response; no automatic writing quality score).

Their shared original contexts cover schedules, venue, conditions, preference, evidence-supported recommendations and uncertainty. UnitBrowser already labels A2-U10 an integrated transfer checkpoint. Therefore the independent reviewer MUST first decide whether an ADDITIONAL checkpoint is educationally necessary or would merely duplicate the existing Unit-10 transfer lessons.

**Explicit design alternatives:**
- **A — Adopt an additional independent checkpoint:** only if it provides genuinely new transfer evidence beyond the three reviewed lessons and remains feasible with existing canonical storage/player/audio guards.
- **B — Do not add new questions:** show a read-only Unit-10 review summary or navigation over the three existing lessons, carefully distinguishing submitted work from independent mastery. This is NOT an independent examination or certificate.
- **C — Revise and re-review:** if the proposed extra items are duplicative, under-taught, invalid, too difficult, ambiguous, or impossible to implement without violating existing guards.

A PASS on the academic content does not grant engineering permission or media rights. The reviewer should pick A, B or C explicitly and explain the rationale.

## B. Provenance and current known status

Project references inspected on main (2026-11-12):
- SLE-MASTER-001 v1.2.0 — canonical standards file (blob SHA 0b04415e1b814177350a5c220e9fedb09f1b5abb).
- Unit definitions: content/sle-unit-catalog-v1.json; A2-U10 title "A2 integrated transfer checkpoint".
- Navigation assignment: content/sle-unit-navigation-map-v1.json (blob SHA 1ed9543d630acff889855ab75443c95d48e94300), confirmed_v121 maps REA-A2-08, LIS-A2-07, WRI-A2-07 to A2-U10.
- Previously reviewed original unit source: content/batches/unit10-a1a2b1-9-lessons-v121-draft.json (blob SHA a975d2fd198b48284cd8958ea6461fca7a69a839). Its dated internal NO-GO metadata was recorded BEFORE later media and deployment validation; it is not an up-to-date statement of production status.
- PR #117 later records NotebookLM acceptance, media checks and v1.21.0 English release. Verify the learner's actual imported browser catalog separately; a GitHub source is not proof of device import.
- Issue #131 approves an independent original multi-skill checkpoint pilot, honest unscored Writing, real-MP3 protection, and no CEFR mastery certificate.

No teaching content, answer key, old question ID, existing audio file or learner history in the current Unit-10 package is edited here. The new scenario below is entirely ORIGINAL material proposed specifically for this assessment pilot.

## C. Intended learner experience (A2 target; young learners)

**Goal, shown to learner:** "Use a short event notice and a friend's voice message to choose a suitable activity. Check time, equipment and whether a place is confirmed. Write a short reasoned reply."

Suggested duration: 20–30 minutes across one or two voluntary visits. No artificial timing gate.

**Four functional stages:**
1. Explain what the checkpoint checks: information from a written notice, facts from genuine audio, and a careful recommendation. State that it is practice evidence, NOT an official CEFR exam.
2. Brief independent strategy demonstration (section D), different context and facts from active checkpoint.
3. Independent practice: new reading source; genuine listening source after audio is prepared; eight objective single-choice items; optional open Writing. All audio-based scoring stays LOCKED until actual approved MP3 and verified playback in the correct attempt.
4. Post-submit: explanations with evidence and one next revision action. Report objective counts and pending Writing separately. Do not award Unit mastery, CEFR proficiency, or oral ability from these items.

**Data rule:** No new score store, no "unit pass" grade, no migration. Any future implementation MUST use stable globally unique IDs, the canonical existing lesson player, versioned cumulative content and saved attempt rules, or must come back for separately approved architecture review. Review IDs in this file are HUMAN-REVIEW MARKERS, not pre-approved importer/runtime lesson IDs.

## D. Independent worked demonstration — NOT from scored materials

**Model notice:** "The school book circle meets on Wednesday from 3:30 to 4:15 in Room 8. Everyone must bring one book to exchange."

**Different model speaker:** "I can come on Wednesday at four, but I do not have a book to bring."

**Think aloud:** The time overlaps, but the notice makes bringing a book compulsory. We should not conclude that this student can join successfully without first asking the organizer about the requirement. The model demonstrates how to combine TWO sources, check a condition, and avoid a promise. The model supplies no scored source name, event, date, answer choice or correct response below.

**Common mistake explained:** Wanting to attend does not erase an explicit rule. A recommendation must distinguish a wish, a known fact and something that needs checking.

Transition shown to learner: "Now read a DIFFERENT weekend notice and listen to Leo's message. Choose the best-supported answers. Your own answers will be checked only after submission."

## E. NEW source 1 — proposed Reading notice (original)

**Source ID (review-only):** A2U10-CHK-R1-TXT1
**Title:** Young Makers Weekend
**Learner-visible before Reading and integrated questions: YES**

> Three learning activities are taking place this weekend.
>
> **Bike Basics** — Saturday, 10:00–11:30 a.m., School Gym. Bring your own bicycle. Volunteers will show you how to check tyres and brakes, but they will not repair broken bikes. This session is free.
>
> **Park Photo Walk** — Sunday, 9:30–10:45 a.m., Riverside Park. Meet at the east gate. Bring a phone or camera. If there is heavy rain, the walk will be cancelled. Students under 16 must come with an adult.
>
> **Poster Studio** — Sunday, 2:00–3:30 p.m., Town Library Media Room. Make a simple digital poster for a school or community group. Laptops are provided and the session is free. Send the online form by Thursday at 6 p.m. There are only ten places. **Only people who receive a confirmation email have a place.** If you cannot come, please tell the library.

Academic review must assess reading load, naturalness, event timing, A2 level, age appropriateness and whether all conditions are explicit and consistent. The mention of "under 16" is relevant only to Photo Walk; it is NOT a restriction on Poster Studio.

## F. NEW source 2 — proposed Listening voice message (original SCRIPT ONLY)

**Source ID (review-only):** A2U10-CHK-R1-AUD1
**Proposed speaker:** Leo, young learner; ordinary clear English, no accent-based scoring.
**Audience-facing script visibility BEFORE submission:** NO
**Physical MP3:** NOT CREATED. No filename, SHA-256, duration, manifest receipt, codec validation, rights record or playback proof exists for this new audio.
**Audio-linked questions:** Must remain unavailable for scored Listening until MEDIA-01, asset provenance, owner hearing, full-player playback and transcript/answer leakage checks PASS.

> Hi, I'm Leo. Our school reading group needs a new poster, and I'd like to make one myself. I can go out on Sunday after lunch, but I help at home on Saturday. I don't have my own laptop. On Thursday morning I filled in the library's online form, but I haven't received any email from the library yet. I don't know if I have a place. Can you help me decide what to do next? I want to be sure before I go.

Academic review must check that all listener conclusions are audible without reading the text, that the speech is appropriate to A2, that words/times match the written source, and that no misleading assumption about guaranteed admission is introduced.

## G. NEW independent objective questions (8 items; all candidate IDs REVIEW-ONLY)

**Each question is single-choice with one defensible best answer.** Options are shown in authored order below ONLY for review. Runtime shuffle MUST preserve option IDs and the correct answer. Feedback must name the meaning/evidence, not "option A/B/C/D", to remain shuffle safe.

### READING — 3 objective items (source E only; may be reviewed academically without audio)

**R01 — A2U10-CHK-R1-R01 — gist**
What is the main purpose of the weekend notice?
- A. To invite students to a school examination.
- B. To describe different weekend activities where young people can learn skills.
- C. To announce that the town library is closing.
- D. To sell bicycles and laptops.
**Key: B.** The notice presents three distinct learning events, not a test, closure or sale.
**Wrong-answer diagnosis:** Confusing a detail in an event with the whole notice's communicative purpose.
**Next action:** Summarise each event in one short phrase, then describe the shared purpose.

**R02 — A2U10-CHK-R1-R02 — explicit condition**
What happens to the Park Photo Walk if there is heavy rain?
- A. It moves to the library.
- B. It starts at 2 p.m. instead.
- C. Students can attend without an adult.
- D. It is cancelled.
**Key: D.** The notice explicitly says the Photo Walk is cancelled in heavy rain.
**Wrong-answer diagnosis:** Inventing an alternative location, time or rule not stated in the notice.
**Next action:** Re-read the "If there is heavy rain" sentence and state the actual consequence.

**R03 — A2U10-CHK-R1-R03 — condition versus assumption**
Which statement about Poster Studio places is supported?
- A. Everyone who completes the form automatically has a place.
- B. A walk-in visitor can always join without registering.
- C. A place is confirmed only after a confirmation email arrives.
- D. Paying a fee guarantees a place.
**Key: C.** Places are limited and the organizer confirms attendance by email.
**Wrong-answer diagnosis:** Treating a submitted form or a fictional payment as an accepted booking.
**Next action:** Underline the difference between "send the form" and "receive a confirmation email".

### LISTENING — 3 objective items (source F genuine verified audio ONLY)

**L01 — A2U10-CHK-R1-L01 — purpose/gist**
Why does Leo want to join an activity?
- A. To make a poster for his school reading group.
- B. To buy a new bicycle.
- C. To take pictures of the park.
- D. To learn to repair a broken laptop.
**Key: A.** Leo says the reading group needs a new poster and he wants to make it.
**Wrong-answer diagnosis:** Substituting a notice detail for the speaker's stated goal.
**Next action:** After submission, replay the first two sentences and identify his aim.

**L02 — A2U10-CHK-R1-L02 — availability**
When can Leo go out?
- A. Friday evening.
- B. Saturday morning.
- C. Sunday after lunch.
- D. Sunday before ten.
**Key: C.** He says he is free only on Sunday after lunch and busy on Saturday.
**Wrong-answer diagnosis:** Confusing the event timetable with the speaker's availability.
**Next action:** After submission, replay his sentence about Sunday and Saturday.

**L03 — A2U10-CHK-R1-L03 — status of registration**
What does Leo say he has done?
- A. Paid a ticket price and received a reserved seat.
- B. Filled in a form on Thursday but not received a confirmation email.
- C. Registered on Friday after the deadline.
- D. Decided not to complete the form.
**Key: B.** He filled in a form Thursday morning and has not received an email.
**Wrong-answer diagnosis:** Turning a request into proof of success, or changing its date.
**Next action:** After submission, listen again for "Thursday morning" and "haven't received".

### INTEGRATED READING + LISTENING — 2 objective items (BOTH sources; genuine audio required)

**X01 — A2U10-CHK-R1-X01 — match a purpose, time and available equipment**
If Leo receives confirmation of a place, which event best matches what he wants and when he can go?
- A. Bike Basics on Saturday, because he has a bicycle ready.
- B. Park Photo Walk on Sunday morning, because it provides laptops.
- C. Park Photo Walk on Saturday afternoon, because it teaches digital posters.
- D. Poster Studio on Sunday afternoon, because he can make a poster using a provided laptop.
**Key: D.** The notice offers Sunday-afternoon poster work and laptops; Leo wants a poster, has no laptop and is free then.
**Wrong-answer diagnosis:** Selecting an event by title or just one source while ignoring time, goal or equipment.
**Next action:** Make a three-column list: Leo's goal, Leo's time, and which notice facts satisfy them.

**X02 — A2U10-CHK-R1-X02 — recommendation under uncertainty**
Before Leo goes to Poster Studio, what should he check?
- A. Whether the library has confirmed his place, because completing a form alone is not enough.
- B. Whether a compulsory fee has been paid, because the notice requires payment.
- C. Whether the Park Photo Walk has been moved indoors, because it provides laptops.
- D. Whether he has bought his own laptop, because the library does not provide any.
**Key: A.** Leo has submitted a form without receiving an email; the notice requires confirmation for a place.
**Wrong-answer diagnosis:** Converting a possibility into a guarantee or inventing a rule not supported by either source.
**Next action:** Identify one known fact from each source and one fact still unknown.

**Question-distribution and evidence caution:** 3 Reading + 3 Listening + 2 cross-source Listening-dependent objective items = 8 independent single-choice results ONLY if media gates pass. The cross-source items are not text-only Reading evidence. Some questions are similar to the previous A2-U10 skills; review MUST identify potential repetition and whether the extra checkpoint adds enough value.

## H. NEW open Writing task — UNASSESSED / PENDING TRUSTED REVIEW

**W01 — A2U10-CHK-R1-W01 (review-only, open response, no automatic quality score)**

> Write a helpful message to Leo of about 65–90 words. Recommend the activity that best matches his aim and availability, using facts from the notice and his voice message. Explain where and when he could go, what equipment is available, and ONE important thing he must check before going. Avoid promising that his place is guaranteed.

**Task analysis visible BEFORE writing:** Topic = a suitable weekend activity. Task = advise Leo in a helpful message. Must include = activity, time/location, purpose/equipment, relevant evidence from both sources, one check/condition. Boundary = do not invent accepted registration or a guaranteed place; friendly A2-appropriate tone; word range guides length only.

**Brainstorm/outline aid:** Goal -> suitable event -> two matching source facts -> limitation/next action -> friendly ending. This scaffold teaches process but DOES NOT assess writing quality.

**Response handling:** Save the original draft and submitted response via the existing attempt model if a later reviewed implementation can support it. Status remains Pending Review or Unassessed; evidence_weight=0 until independently trusted human/approved compliant review. No automatic scores from length, connectors, copied keywords, speech playback, or the eight MCQs. Keep version-pinned originals and revisions separate.

**Reviewer rubric (for later trusted adult feedback; no numeric grade specified here):**
1. Task response: correct activity and complete required details.
2. Evidence use: at least one true notice fact and one true voice-message fact.
3. Reasoning: recognizes unconfirmed place and recommends checking rather than promising.
4. Organization: a coherent, friendly, readable short message.
5. Language: comprehensibility and appropriate A2 vocabulary/grammar.
6. Revision guidance: one concrete priority for the learner's next draft.

Required safe fallback: "Your writing is saved but has not received a trusted language-quality review. Compare your message with the notice and what you heard, then revise one unclear sentence." Do not reveal or present a model response as the learner's independent answer before submission.

## I. Proposed result / navigation states (review, not implementation)

- **No audio asset:** Do not activate/scored-launch the integrated checkpoint or its Listening/cross-source questions. The reading-only source may be available as ordinary reading study if separately reviewed, but must not be represented as a completed integrated checkpoint.
- **Saved incomplete attempt:** Resume the same original version; do not create an automatic duplicate, infer playback, or expose transcript.
- **Verified audio + objective submission:** Show Reading 0–3, Listening 0–3 and integrated 0–2 as separate objective counts, plus exact wrong-item explanations and a next action. No aggregate "A2 mastered" label.
- **Writing submitted:** Status Pending Review/Unassessed, displayed independently of objective accuracy. No grade, no CEFR Writing claim.
- **Retake/new version:** Old graded answers/history remain immutable; no silent overwrites, no promotion of old results to the new checkpoint.
- **Unit entry:** Reuse existing Learn by Units / canonical player/Skill Library navigation; no second learner-profile store, new course or mandatory AI.
- **Accessibility:** Full question text, controls, error states and evidence are readable at >=320px, by keyboard and on iPad; listening transcript/key is hidden before scored submission; no decorative-only image requirement.
- **Publication:** No production content import until academic PASS (or required changes reconciled), valid production schema/IDs, real media/rights/MEDIA-01, exact-head QA, data safety, and explicit owner release approval.

## J. NUMBERED INDEPENDENT REVIEW QUESTIONS

1. **Necessity:** Because REA-A2-08, LIS-A2-07 and WRI-A2-07 ALREADY implement A2-U10 transfer, should the project add a distinct checkpoint, show a read-only summary instead, or revise this proposal? Choose A/B/C from section A. State whether the original three lessons already provide sufficient independent transfer.
2. **CEFR/age:** Is the notice, message, vocabulary, listening burden, task scope and 65–90-word guidance suitable for an A2-target young learner? Identify exact awkward, ambiguous or over-demanding wording.
3. **Originality/independence:** Are this assessment and model materially distinct from the prior Mia/Repair Café and the previous book-exchange demonstration? Identify any copying of active cues, over-scaffolding or circular item stems.
4. **Reading R01–R03:** Solve each from source E WITHOUT seeing the keyed response first. Are the correct answers uniquely defensible and distractors credible? List required changes by ID.
5. **Listening L01–L03:** Solve from script F. Are all intended clues genuinely audible without transcript, reliable under natural spoken pacing, and independent of reading? Identify exact required changes.
6. **Integration X01–X02:** Must the learner actually combine both sources to choose the keyed answer, or can one source alone or superficial option recognition solve the question? Are the inferences fair, conditional and nonduplicative?
7. **Feedback:** Is each post-submit explanation and remedial action specific, accurate and useful, without leaking hidden answer text pre-submit or treating correct MCQs as lasting mastery? Where do distractor misconceptions need more detail?
8. **Writing W01:** Is the prompt genuine independent production, with clear Topic/Task/Must Include/Boundary and fair trusted-review criteria? Could the phrase "equipment is available" induce inaccurate claims? Any missing source permissions?
9. **Assessment integrity:** Verify that 3 Reading + 3 Listening + 2 integrated are appropriately classified, audio credit is blocked without real media, and Writing receives zero automatic quality/evidence score. Identify any false CEFR/mastery implication.
10. **Implementation feasibility:** Identify which proposals can operate using the current canonical UnitBrowser/Foundation/player/importer/attempt history, and which require new schema, scoring engine, storage, access rules or an academic redesign. Mark unsupported engineering claims **NOT VERIFIED**.
11. **Failure modes / accessibility:** Identify edge cases in rain, session times, seat confirmation, working audio, shuffle, retake, transcript, missing device access, mobile/iPad layout, and shared-browser learner privacy.
12. **Minimum viable review-approved recommendation:** Give the smallest defensible pilot with exact source/item changes (IDs), what to keep, what to remove, what to verify before any code/import, and whether it should remain entirely read-only.

## K. REQUIRED REVIEWER VERDICT FORMAT

**Academic verdict:** PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE.
**Recommended design:** A (new independent checkpoint) / B (existing transfer lessons + summary only) / C (revise/re-review).
**Academic adoption:** GO / NO-GO — and why.
**Engineering implementation:** GO / NO-GO / CONDITIONAL, separate from academic approval.
**Audio/media readiness:** NOT READY, unless authoritative actual new-media evidence is supplied separately; never infer media readiness from the script.

For every Question 1–12: give a concise answer, relevant source anchor, severity (BLOCKER / REQUIRED / OPTIONAL) and exact suggested change if needed. Provide an ID-keyed correction table for all affected R/L/X/W questions. Finish with a revised minimum viable scope and a compact checklist. Do not issue a broad approval if source claims are unsupported. A PASS is an academic judgment only; it is NOT permission to merge, deploy, activate AI, fabricate MP3 or change learner history.

## L. NotebookLM source operations for this review

**KEEP:** The currently authoritative five permanent English academic baseline sources already present in the dedicated NotebookLM project, including the current canonical SLE-MASTER-001 where it is maintained. Keep only their newest authoritative versions. Do not duplicate SLE-MASTER-001 under another filename.

**REMOVE:** The previously selected temporary batch/review packet(s) and any superseded versions; do NOT remove frozen permanent sources.

**ADD:** This ONE Markdown packet: SLE_A2U10_INDEPENDENT_CHECKPOINT_REVIEW_20261112_R1.md. No ZIP, no raw JSON, no separate prompt file.

**Short NotebookLM chat instruction (not a separate source):**
Review the current temporary packet against the permanent project sources. Answer all 12 review questions and return the required verdict. Be conservative about duplicate checkpoint value and audio readiness.
