# SLE F2 — Bulk 12-Lesson Academic Authoring Packet R1

**Packet ID:** `SLE-F2-BULK12-A1A2B1-AUTHORED-20261109-R1`  
**Review target:** Twelve proposed lessons; thirty-four objective Reading MCQs; six unscored Writing tasks (40 total assessed activities).  
**Review scope:** `AUTHORED_CONTENT_ITEM_LEVEL` (independent academic quality; not JSON/schema/CI/live approval).  
**Project:** Self-Learning English — G Learning; CEFR 60 thematic Unit Framework.  
**Current LIVE base:** `curriculum-1.24.0-candidate.json`, **142 lessons / 1,085 activities**, main `2dab3d72bf36b6c3befe9e423ff2e7315fc3dbb3`.  
**Proposed candidate after academic/engineering gates:** `1.25.0`, **154 lessons / 1,125 activities**; never construct or deploy from this packet alone.  
**Status:** ACADEMIC AUTHORING R1 — NOT NotebookLM-approved; NOT integrated/merged/deployed.  
**Authoring rule:** permanent `SLE-MASTER-001` and current 60-unit framework supersede this temporary packet if conflicting.  

## A. Review mandate and source authority

NotebookLM must independently test **every proposed MCQ and Writing task** for correctness, level, evidence, originality, option uniqueness, source support, ambiguity, leakage from pre-submit instruction, CORE-1..4 pedagogy, and quality of post-submit feedback. Do not give a bulk PASS merely because counts match. Preserve distinct outcome categories: **academic item PASS ≠ machine schema PASS ≠ release GO ≠ measured student CEFR**.

Sources to use: (1) permanent English master academic and assessment standards including SLE-MASTER-001; (2) permanent current CEFR 60-Unit Framework; (3) this single temporary authored packet. The baseline extracts below are included only to justify transfer novelty and do not prove whole-curriculum uniqueness; return `INSUFFICIENT_EVIDENCE` where more data are genuinely necessary.

**Hard academic boundaries:**
- Reading: each question is a deterministic `single_choice`, exactly four options, one uniquely correct key, valid reading skill tag, `evidence_weight:1`; explanatory feedback is **post-submission only**, never presented as a pre-submit answer.
- Writing: `extended_response`, `answer:null`, `evidence_weight:0`, `review_mode:assisted_ai_or_human`, level-specific existing rubric, word range guidance with `not_a_quality_score:true`. No automatic quality score, CEFR award or semantic grading simply because text exists.
- Teaching: CORE-1 purposeful situation, CORE-2 **independent** worked model (different facts/story), CORE-3 learner practice using the assessed source, CORE-4 post-submit feedback plus an actionable next step. Writing must use Topic–Task–Must Include–Boundary analysis and a practical outline before drafting.
- No actual personal information, invented real results, new Listening transcripts masquerading as audio, new MP3 requests, media/rights issues or live app changes. This is an English-only content pack. `MED-01: NOT_APPLICABLE` (no new audio).
- Release safety is separate: tech must preserve 142 existing lesson objects, rubrics, prior course order, score/draft/review evidence and 44 existing MP3s. The importer currently caps at **150** lessons: 154 is blocked pending separate tested capacity change. Source package intentionally contains no importer override.

## B. Verified six-Unit coverage and non-duplication baseline

| Primary Unit | Current mapped baseline lesson excerpts | Framework’s independent transfer gap | Proposed additions |
|---|---|---|---|
| **A1-U03 — School, time and routines** (P0) | VOC-A1-01 — School places and classroom language (8 activities); GRA-A1-12 — Prepositions of time: at, on and in (10 activities) | Read an unfamiliar school timetable and explain an activity’s day, start time and location; distinguish a lesson from an after-school event. | `REA-A1-08` + `WRI-A1-08` |
| **A1-U06 — Home, town and directions** (P0) | GRA-A1-05 — There is and there are (10 activities); GRA-A1-06 — Prepositions of place (10 activities); VOC-A1-03 — Places in town and simple directions (8 activities) | Read a simple unfamiliar town layout and follow a two-step route instead of selecting isolated place prepositions. | `REA-A1-09` + `WRI-A1-09` |
| **A2-U02 — Past events and simple stories** (P0) | GRA-A2-02 — Past simple forms, negatives and questions (10 activities); GRA-A2-08 — Past continuous and interrupted actions (10 activities); PRO-A2-02 — Word stress in two-syllable words (5 activities); PRO-A2-03 — Three regular past -ed endings (6 activities) | Interpret a multi-event account, distinguish background from a new event, and write a coherent past narrative. | `REA-A2-11` + `WRI-A2-10` |
| **A2-U04 — Choices, comparisons and reasons** (P0) | GRA-A2-04 — Comparatives and superlatives (10 activities); LIS-A2-03 — Choosing a class at the sports centre (8 activities) | Compare real conditions, costs, time and equipment; recommend an option for a person with explicit needs. | `REA-A2-12` + `WRI-A2-11` |
| **B1-U01 — Connected narratives and experiences** (P0) | GRA-B1-01 — Past simple and present perfect (6 activities); GRA-B1-02 — Present perfect simple or continuous (10 activities); GRA-B1-03 — Past perfect and narrative order (10 activities); GRA-B1-04 — Past habits with used to and would (10 activities) | Read and retell a connected narrative by reconstructing the order of past events, including earlier actions, background and corrected assumptions. | `REA-B1-09` + `WRI-B1-10` |
| **B1-U05 — Hypotheticals and responsible advice** (P1) | GRA-B1-05 — Modal deduction: must, might and can’t (10 activities); GRA-B1-06 — Second conditional: imaginary situations (10 activities); GRA-B1-07 — Wish and if only for present situations (10 activities) | Apply hypothetical conditions and evidence limits to responsible advice about a choice before decision, not just complete forms. | `REA-B1-10` + `WRI-B1-11` |

These are six **real mapped** Unit gaps identified by comparing the current 1.24 manifest against the Framework. Existing lessons are **not claimed to be defective**. Objective baseline activities largely teach forms/terminology or a different modality; transfer target checks genuine application using new contexts. The use of a source text about a school, town, garden, arts centre, exhibition or courtyard is authored content in this packet and must be audited as new; do not claim external field-test results.

## C. Full source-authored lessons (12 lessons / 40 proposed activities)

### A1-U03: REA-A1-08 — New School Timetable — Classes and Club
**Primary Unit:** `A1-U03`; **module:** `reading`; **CEFR:** `A1`; **estimated minutes:** 22; **questions:** 5.  
**Learning objectives:**
- Find explicit days, start times and rooms in a two-part school timetable.
- Distinguish a normal lesson from an after-school club and notice one missing detail.
- Choose a question that asks for information the texts do not give.

**CORE-1 — Meaningful situation and task**
A new student needs to understand a class schedule and a club notice. Read the day, time and place together: an activity with the same name can be a lesson or a club on another day. Do not assume a starting time is also the finishing time.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — A community swimming pool notice says: Tuesday, beginners, 4:00 p.m., Pool B. A separate note says a family swim is on Sunday at 10:00 a.m. The beginners class is not the family session. Since the notice does not say when Tuesday’s class ends, a polite question is: “What time does the beginners class finish?” This example is NOT about the school timetable.

**CORE-3 — Independent assessed reading**
Read SOURCE A as the regular morning timetable and SOURCE B as the separate after-school notice. For each question, underline the day, time and room in the relevant source. Treat “not given” as different from “probably”.

**SOURCE A — School morning timetable (learner-visible `reading_asset` body)**
```text
MONDAY
8:00 a.m. — Maths — Room 2
9:00 a.m. — Reading — Room 5
10:15 a.m. — Art — Room 3

WEDNESDAY
8:00 a.m. — Science — Lab 1
9:00 a.m. — Music — Room 4
10:15 a.m. — PE — Playground

All times on this card are START times.
```

**SOURCE B — After-school club note (learner-visible `reading_asset` body)**
```text
Art Club meets on Wednesday at 3:30 p.m. in Room 3. You do not need to bring your own paint. Ask the teacher if you want to know when the club finishes. The club is separate from Monday's Art lesson.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-A1-08`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-A1-08-Q1 — Which activity starts at 9:00 a.m. on Monday?**
- **A.** Science in Lab 1
- **B.** Art in Room 3
- **C.** Reading in Room 5
- **D.** Music in Room 4
- **Answer key:** `C`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A places Reading in Room 5 at 9:00 a.m. on Monday; the other options use a different activity, time or day. **Next step:** Check day, start time and room as a single set.

**REA-A1-08-Q2 — Where does Science begin on Wednesday?**
- **A.** Lab 1
- **B.** Room 5
- **C.** Playground
- **D.** Room 3
- **Answer key:** `A`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A lists Wednesday Science at 8:00 a.m. in Lab 1. The other places belong to other lessons. **Next step:** Use the Wednesday row, not the Monday row.

**REA-A1-08-Q3 — When does the after-school Art Club meet?**
- **A.** Monday at 10:15 a.m.
- **B.** Wednesday at 9:00 a.m.
- **C.** Monday at 3:30 p.m.
- **D.** Wednesday at 3:30 p.m.
- **Answer key:** `D`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE B says Art Club meets Wednesday at 3:30 p.m., separately from the Monday Art lesson. **Next step:** Distinguish the club notice from the morning timetable.

**REA-A1-08-Q4 — Which statement describes a regular morning lesson, not the after-school club?**
- **A.** Art Club needs students to bring paint.
- **B.** Art starts at 10:15 a.m. on Monday in Room 3.
- **C.** Art Club meets on Monday at 3:30 p.m.
- **D.** Art Club ends at 4:00 p.m.
- **Answer key:** `B`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The Monday Art entry is in SOURCE A’s morning timetable. SOURCE B identifies Wednesday Art Club as a separate after-school event; its end time is not stated. **Next step:** Look for which source labels the activity.

**REA-A1-08-Q5 — Which question asks for a detail NOT provided in either source?**
- **A.** What time does Wednesday Music finish?
- **B.** Where does Monday Reading start?
- **C.** When does Wednesday Art Club start?
- **D.** Where does Wednesday Science start?
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A explicitly provides start times only, not Music’s finishing time. The other three facts are written in the sources. **Next step:** Ask about an actual missing fact instead of repeating a known one.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### A1-U03: WRI-A1-08 — Explain a School Morning and Ask One Question
**Primary Unit:** `A1-U03`; **module:** `writing`; **CEFR:** `A1`; **estimated minutes:** 20; **activity:** one pending-review extended response.
**Learning objectives:**
- Select exact time and room facts from the timetable without mixing days.
- Write a short friendly message with one useful question about missing information.
- Review accuracy and politeness before saving a draft for trusted feedback.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: the school timetable and club notice. TASK: explain two confirmed details to a new student and ask one question. MUST INCLUDE: correct Monday Reading fact, correct Wednesday Art Club fact, the class-versus-club distinction and one missing-finish-time question. BOUNDARY: 35–50 words, friendly tone, no invented time or personal information. Word range is planning guidance, never a quality score.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — A town library poster says the children’s reading group begins on Saturday at 10 a.m. in the upstairs room but does not give an ending time. A useful message might say: “The reading group starts at ten on Saturday in the upstairs room. Could you tell me when it finishes?” This model does not use the school timetable.

**CORE-3 — Outline and independent draft**
Write: greeting → two accurate day/time/place details → clarify club versus class → one question. Check the day names before submitting; a friendly ending is optional.

**WRI-A1-08-Q1 — Exact learner task (`prompt`)**
> Write 35–50 words to a fictional new student. Use SOURCE A and SOURCE B: say when and where Monday Reading starts; say when and where Wednesday Art Club starts; explain that Art Club is different from Monday Art; and ask one polite question about a finishing time not given in the notices. Do not invent the answer or include real student names or contact details.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-A1-08-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-A1`.
- `skill_tags: [writing.task_understanding, writing.organization, writing.grammar, writing.vocabulary]`.
- `word_range_guidance: {min:35, max:50, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
Check that the message has no unsupported finishing time. Await trusted review and revise a linked copy if feedback arrives; Save/Resume must retain the original attempt and no automatic Writing CEFR claim is generated.

### A1-U06: REA-A1-09 — Brook Town — Follow a Short Route
**Primary Unit:** `A1-U06`; **module:** `reading`; **CEFR:** `A1`; **estimated minutes:** 22; **questions:** 5.  
**Learning objectives:**
- Identify positions of places from a written map key.
- Follow short east/north and south directions from a given starting point.
- Distinguish a described route from a guessed travel distance or time.

**CORE-1 — Meaningful situation and task**
A written map key can tell you where to go even without a picture. Begin at the stated place; follow the street order, and only then turn north or south. Do not invent distances, crossing points or walking times.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — In a small garden, the tool shed is east of the gate and the fountain is north of the shed. From the gate, walk east to the shed, then north to the fountain. This demonstration is about a garden, NOT Brook Town.

**CORE-3 — Independent assessed reading**
Read SOURCE A for the relative positions of places, then SOURCE B for the named route. Use the words east, north and south consistently and answer using only the text.

**SOURCE A — Brook Town written map key (learner-visible `reading_asset` body)**
```text
Along River Street, from WEST to EAST, these places appear in this order:
BUS STOP → LIBRARY → BAKERY → CLINIC.
The park is immediately NORTH of the library.
The café is immediately SOUTH of the bakery.
The school is immediately NORTH of the clinic.
On this written map, EAST means RIGHT and NORTH means UP. The places on River Street are on the same straight road. No distances or travel times are shown.
```

**SOURCE B — Visitor help note (learner-visible `reading_asset` body)**
```text
To reach the park from the bus stop, travel EAST along River Street until you reach the library. From the library, turn NORTH to the park. To reach the clinic from the bus stop, continue EAST past the library and the bakery. Ask a helper if you need the walking time: the map key does not provide it.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-A1-09`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-A1-09-Q1 — Which place comes directly after the bus stop when travelling east on River Street?**
- **A.** The library
- **B.** The clinic
- **C.** The school
- **D.** The café
- **Answer key:** `A`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A lists the library immediately after the bus stop from west to east. **Next step:** Follow the stated order from the chosen starting point.

**REA-A1-09-Q2 — Where is the park relative to the library?**
- **A.** South of the library
- **B.** West of the library
- **C.** North of the library
- **D.** East of the clinic
- **Answer key:** `C`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A places the park immediately north of the library. **Next step:** Read the relation between the exact two named places.

**REA-A1-09-Q3 — From the bus stop, which two directions reach the park using SOURCE B?**
- **A.** West, then south
- **B.** East to the library, then north
- **C.** North, then east to the clinic
- **D.** South to the café, then west
- **Answer key:** `B`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE B says go east to the library before turning north to the park. **Next step:** Separate the first move from the second turn.

**REA-A1-09-Q4 — A visitor is at the bakery. Which direction reaches the café?**
- **A.** North
- **B.** West
- **C.** East
- **D.** South
- **Answer key:** `D`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A puts the café immediately south of the bakery. **Next step:** Use the place directly above or below the destination.

**REA-A1-09-Q5 — Which fact cannot be found from either source?**
- **A.** The exact walking time from the bus stop to the park
- **B.** The road order of the library and bakery
- **C.** The direction of the school from the clinic
- **D.** The direction to the park from the library
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The sources explicitly say they give no distances or travel times. The other location facts are provided. **Next step:** Do not turn a route description into a guessed time.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### A1-U06: WRI-A1-09 — Send Clear Directions to the Park
**Primary Unit:** `A1-U06`; **module:** `writing`; **CEFR:** `A1`; **estimated minutes:** 20; **activity:** one pending-review extended response.
**Learning objectives:**
- Explain a two-step route from a fixed starting point.
- Use place names and directional words in order.
- Avoid asserting unsupported travel times.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: the Brook Town visitor map. TASK: send a helpful written direction. MUST INCLUDE: correct bus-stop start, River Street, library, east movement then north turn, and honest note about unknown walking time. BOUNDARY: 35–50 words, clear and polite, no estimated minutes or invented map places.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — A community garden visitor starts at a gate, walks straight to a greenhouse, and then turns left towards a fountain. A direction message says: “Go straight to the greenhouse. Turn left there to find the fountain.” The garden has no connection with Brook Town.

**CORE-3 — Outline and independent draft**
Start → first direction and landmark → second turn and destination → what the map does not say. Verify that “north” comes after reaching the library.

**WRI-A1-09-Q1 — Exact learner task (`prompt`)**
> Write 35–50 words to a fictional visitor. Starting at the Brook Town bus stop, explain how to reach the park. Name River Street and the library, give the east-then-north route in order, and add one friendly sentence saying that the exact walking time is not shown. Do not invent street names, distances or real personal information.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-A1-09-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-A1`.
- `skill_tags: [writing.task_understanding, writing.organization, writing.grammar, writing.vocabulary]`.
- `word_range_guidance: {min:35, max:50, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
Read the instructions aloud and check the east/north sequence; await trusted Writing review, not a machine-generated language score.

### A2-U02: REA-A2-11 — Garden Open Day — What Happened First?
**Primary Unit:** `A2-U02`; **module:** `reading`; **CEFR:** `A2`; **estimated minutes:** 25; **questions:** 6.  
**Learning objectives:**
- Read a short past event account for exact time order.
- Differentiate an ongoing background action from an interrupting event.
- Check the organiser note against a diary without inventing consequences.

**CORE-1 — Meaningful situation and task**
A true-to-source recount places finished events in time order. Past continuous describes an action in progress; a past-simple event can interrupt it. When reading two sources, use their times before drawing a conclusion.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — At a youth concert, the helpers were arranging chairs at 5:00 when the lights went off. At 5:10 the lights returned and the singer began at 5:30. The model shows ongoing action + interruption and later steps. This is NOT the garden event.

**CORE-3 — Independent assessed reading**
Use SOURCE A for the diary times and SOURCE B to check the organiser’s summary. Draw a five-event timeline before answering; do not confuse the plan with what happened.

**SOURCE A — Noor’s open-day diary (learner-visible `reading_asset` body)**
```text
SATURDAY, 8:30 a.m. — I arrived at the community garden. Volunteers were putting up signs.
9:00 a.m. — Rain started while Mia was carrying boxes to the outdoor tables.
9:20 a.m. — We moved the tables into the hall.
10:00 a.m. — The rain stopped, and our visitors arrived.
11:00 a.m. — We planted seedlings with the visitors.
12:10 p.m. — We packed away the tools.
```

**SOURCE B — Organiser’s note (learner-visible `reading_asset` body)**
```text
We did NOT cancel the garden open day. After the rain began, we moved the tables indoors before the visitors arrived. The visitors came at 10:00 a.m., and the planting activity took place later. We did not count the number of seedlings planted.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-A2-11`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-A2-11-Q1 — What were volunteers doing when Noor arrived at 8:30 a.m.?**
- **A.** Packing away tools
- **B.** Putting up signs
- **C.** Planting with visitors
- **D.** Moving the tables indoors
- **Answer key:** `B`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A says volunteers were putting up signs at Noor’s arrival. The other actions happened later. **Next step:** Pair the time stamp with its ongoing action.

**REA-A2-11-Q2 — What started while Mia was carrying boxes?**
- **A.** A concert
- **B.** The visitors’ planting
- **C.** The rain
- **D.** The open-day lunch
- **Answer key:** `C`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** At 9:00 a.m. rain started while Mia was carrying boxes, a new event interrupting an ongoing action. **Next step:** Look for “while” plus the past-simple interruption.

**REA-A2-11-Q3 — Which event happened before the visitors arrived?**
- **A.** The team moved tables into the hall
- **B.** The tools were packed away
- **C.** The seedlings were planted with visitors
- **D.** The event was cancelled
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Tables moved indoors at 9:20, before the visitors arrived at 10:00. The other events were later or did not happen. **Next step:** Check 9:20 against 10:00 on the timeline.

**REA-A2-11-Q4 — Which sequence matches SOURCE A?**
- **A.** Rain → Noor arrived → visitors → tables moved
- **B.** Visitors → rain → tables moved → packing away
- **C.** Noor arrived → visitors → rain → planting
- **D.** Noor arrived → rain → tables moved → visitors
- **Answer key:** `D`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The times are 8:30 arrival, 9:00 rain, 9:20 moving tables, and 10:00 visitors. **Next step:** Build the order using exact times rather than word order alone.

**REA-A2-11-Q5 — Which claim does SOURCE B explicitly reject?**
- **A.** The team moved the tables indoors
- **B.** The event was cancelled because of the rain
- **C.** The visitors arrived at 10:00
- **D.** The planting happened after visitors arrived
- **Answer key:** `B`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The organiser says the team did NOT cancel the event. Both sources describe the move indoors and later planting. **Next step:** Notice explicit negative statements.

**REA-A2-11-Q6 — Which sentence best represents the timing of the rain and Mia’s task?**
- **A.** Mia has carried boxes since the rain starts.
- **B.** Mia will carry boxes after the rain began.
- **C.** Mia was carrying boxes when the rain started.
- **D.** Mia carries boxes every time it rains.
- **Answer key:** `C`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The diary reports a background activity in progress and an interrupting rain event in the past. **Next step:** Use the time relation, not an isolated tense rule.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### A2-U02: WRI-A2-10 — Write a Short Garden Open-Day Recount
**Primary Unit:** `A2-U02`; **module:** `writing`; **CEFR:** `A2`; **estimated minutes:** 27; **activity:** one pending-review extended response.
**Learning objectives:**
- Plan and tell a past event story in chronological order.
- Explain an ongoing action interrupted by rain using while or when.
- Avoid inventing a cancelled event or a seedling count.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: a community garden open day. TASK: recount the event to a class newsletter. MUST INCLUDE: 8:30 arrival, Mia/rain relation, 9:20 move, 10:00 visitors, planting, outcome. BOUNDARY: 70–95 words, a factual chronology, no invented number of seedlings or cancellation claim. Length alone does not determine quality.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — A school sports team reached the field at two. The coach was checking the equipment when a ball rolled into a nearby pond. A helper collected another ball, and practice started later. The model shows timeline and when/while, but it is not the garden open-day account.

**CORE-3 — Outline and independent draft**
Make a five-event timeline and group it into beginning → interruption → response → continuation → ending. Check past simple versus past continuous.

**WRI-A2-10-Q1 — Exact learner task (`prompt`)**
> Write 70–95 words for a fictional class newsletter about the garden open day. Include Noor’s arrival, the rain starting while Mia was carrying boxes, the move to the hall, the visitors arriving, and the planting activity. Give a clear time order and one accurate while/when sentence. Do not say the event was cancelled, invent a seedling total, or add real names or addresses.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-A2-10-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-A2`.
- `skill_tags: [writing.task_understanding, writing.idea_development, writing.organization, writing.grammar, writing.vocabulary]`.
- `word_range_guidance: {min:70, max:95, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
After human/assisted review, repair one order or tense error using a new linked revision; the saved original draft and its evidence remain intact.

### A2-U04: REA-A2-12 — Choose an Arts Workshop — Compare the Facts
**Primary Unit:** `A2-U04`; **module:** `reading`; **CEFR:** `A2`; **estimated minutes:** 25; **questions:** 6.  
**Learning objectives:**
- Compare time, price, duration and equipment information across two options.
- Match a learner’s stated constraints to an available option.
- Make a cautious recommendation without inventing quality ratings.

**CORE-1 — Meaningful situation and task**
A good recommendation depends on a person’s real needs. Compare each option using the same criteria: day, price, duration and equipment. “Cheaper” does not automatically mean “better for everyone”; an option must match the learner’s actual schedule and budget.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — A public library offers a Friday board-game hour for $2 with games provided, and a Sunday drawing session for $3 where pencils are required. A learner free only on Sunday could choose drawing if they have pencils. This example is not an arts-workshop assessment.

**CORE-3 — Independent assessed reading**
Read SOURCE A as workshop facts and SOURCE B as Sam’s constraints. Keep “the option costs less” distinct from “the option meets Sam’s needs”. Do not invent places or ratings.

**SOURCE A — Arts centre workshop notice (learner-visible `reading_asset` body)**
```text
WOOD CRAFT: Thursday, 4:00–5:00 p.m.; $6 per session; tools included; ages 11 and above.
DIGITAL PHOTOGRAPHY: Saturday, 10:00–11:30 a.m.; $4 per session; bring a camera. A camera can be borrowed free if requested at least 48 hours before the session; ages 11 and above.
The notice does not rate the quality of either class. The centre does not offer the two classes at any other times.
```

**SOURCE B — Sam’s message (learner-visible `reading_asset` body)**
```text
I am 12. I can attend ONLY on Saturday mornings. I can spend no more than $5 per class, and I do not own a camera. I can contact the centre several days before a class if equipment can be borrowed. I would like to try a practical creative activity.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-A2-12`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-A2-12-Q1 — Which workshop has the lower session price?**
- **A.** Wood Craft at $6
- **B.** Both cost $6
- **C.** Digital Photography at $4
- **D.** Neither workshop has a stated price
- **Answer key:** `C`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Photography costs $4, compared with $6 for Wood Craft; both prices are explicitly stated. **Next step:** Compare the same price unit for both choices.

**REA-A2-12-Q2 — Which workshop has the longer session?**
- **A.** Digital Photography is 90 minutes; Wood Craft is 60 minutes.
- **B.** Wood Craft is 90 minutes; Photography is 60 minutes.
- **C.** They each last exactly one hour.
- **D.** The timetable does not show either duration.
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Photography runs 10:00–11:30 (90 minutes), while Wood Craft runs 4:00–5:00 (60 minutes). **Next step:** Subtract starting time from finishing time for each option.

**REA-A2-12-Q3 — Which option fits Sam’s day and price limit, if equipment is arranged correctly?**
- **A.** Thursday Wood Craft, because tools are included
- **B.** Either class, because Sam is 12
- **C.** Thursday Wood Craft, because it is shorter
- **D.** Saturday Digital Photography, if Sam requests a camera in advance
- **Answer key:** `D`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Only Photography runs Saturday morning within $5. Sam can borrow a camera free if requested 48 hours ahead. **Next step:** Check every constraint before recommending.

**REA-A2-12-Q4 — What must Sam do to use a borrowed camera?**
- **A.** Pay an extra $6 at the session
- **B.** Request it at least 48 hours before the session
- **C.** Bring a wood-craft toolkit
- **D.** Attend on Thursday evening
- **Answer key:** `B`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The notice requires a free camera loan request at least 48 hours before the photography session. **Next step:** Do not omit a condition printed in a notice.

**REA-A2-12-Q5 — Which comparison is directly supported by SOURCE A?**
- **A.** Wood Craft costs more but includes tools.
- **B.** Digital Photography has higher teacher ratings.
- **C.** Wood Craft meets on Saturday morning.
- **D.** Both workshops provide free cameras.
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Wood Craft costs $6 and includes tools; Photography costs $4, and its camera may be borrowed only after advance request. No ratings are provided. **Next step:** Choose a comparison of facts, not assumed quality.

**REA-A2-12-Q6 — Why is Wood Craft unsuitable for Sam’s current constraints?**
- **A.** It requires every student to bring tools.
- **B.** It is only for adults over 18.
- **C.** It is on Thursday and costs more than Sam’s $5 limit.
- **D.** Its instructor is not available at the centre.
- **Answer key:** `C`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Wood Craft is Thursday 4–5 p.m. and costs $6; Sam can attend Saturday mornings only and has a $5 limit. **Next step:** State the exact constraints that fail.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### A2-U04: WRI-A2-11 — Recommend the Right Workshop for Sam
**Primary Unit:** `A2-U04`; **module:** `writing`; **CEFR:** `A2`; **estimated minutes:** 27; **activity:** one pending-review extended response.
**Learning objectives:**
- Select relevant, source-supported criteria for a recommendation.
- Compare two options without inventing quality claims.
- Include the advance equipment condition and a useful next step.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: choosing an arts workshop. TASK: recommend the most suitable class for Sam. MUST INCLUDE: a choice, correct day/price and duration comparison, Sam’s constraints, camera borrowing requirement and next action. BOUNDARY: 70–95 words, helpful tone and source-only facts; do not claim that either teacher is better without evidence.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — A town library offers a free Saturday reading group, whereas a Monday bookbinding session costs $5 and requires scissors. Someone available on Saturday with no money for materials should choose the reading group; the choice follows access constraints, not a claim that reading is more enjoyable for everyone.

**CORE-3 — Outline and independent draft**
Outline choice → two evidence-backed comparisons → Sam-specific reason → equipment condition → next step. Check the 48-hour rule and distinguish more expensive from better.

**WRI-A2-11-Q1 — Exact learner task (`prompt`)**
> Write a 70–95 word reply to fictional Sam recommending an arts workshop. Compare the two options using exact days, prices and one duration fact. Explain why one fits Sam’s schedule and budget. Mention the camera-loan condition and give a practical next step. Do not invent course quality ratings, discounts or personal contact information.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-A2-11-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-A2`.
- `skill_tags: [writing.task_understanding, writing.idea_development, writing.organization, writing.cohesion, writing.vocabulary]`.
- `word_range_guidance: {min:70, max:95, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
After trusted review, replace unsupported adjectives with verifiable criteria. No automatic Writing semantic or CEFR score.

### B1-U01: REA-B1-09 — Exhibition Morning — The Missing Labels
**Primary Unit:** `B1-U01`; **module:** `reading`; **CEFR:** `B1`; **estimated minutes:** 29; **questions:** 6.  
**Learning objectives:**
- Reconstruct an earlier-than-past action from past perfect.
- Connect background activity, later events and the final exhibition opening.
- Distinguish what two witnesses recorded from an unsupported accusation.

**CORE-1 — Meaningful situation and task**
A clear narrative distinguishes what had already happened, what someone was doing during another event, and what happened later. Past perfect helps explain why a discovery makes sense. Two written accounts may confirm an outcome without proving a person is to blame.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — Before a charity cycle ride, Mia had placed the water bottles in a bag. When volunteers arrived, she was fixing a sign, and the bottles were still inside her bag. The event began once the bottles had been unpacked. The model shows earlier preparation, ongoing action and resolution; it is NOT about exhibition labels.

**CORE-3 — Independent assessed reading**
Read SOURCE A as Alex’s first-person account and SOURCE B as a brief organiser record. Draw a Friday → Saturday timeline; check who did what before making any causal accusation.

**SOURCE A — Alex’s exhibition diary (learner-visible `reading_asset` body)**
```text
On Friday afternoon, I printed the exhibition labels and put them in an envelope. That evening, I checked the guest list, but I left the envelope on the kitchen table.
On Saturday, I arrived at the community hall at 8:00 a.m. and discovered the labels were missing. I realised I had left the envelope at home. While I was calling my sister at 8:10, she found it on the kitchen table. She brought the envelope to the hall at 8:45. We put the labels beside the displays before visitors arrived at 9:00.
When I was younger, I used to keep all exhibition materials in one folder. This year I had separated the labels from the other papers.
```

**SOURCE B — Organiser’s short report (learner-visible `reading_asset` body)**
```text
The Saturday exhibition opened on time at 9:00 a.m. The labels were in place before the visitors came in. Alex printed the labels on Friday; his sister delivered the envelope on Saturday morning. The report does not say that Alex’s sister printed the labels or that visitors saw the temporary problem.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-B1-09`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-B1-09-Q1 — What had Alex done before Saturday morning?**
- **A.** Printed the labels and left their envelope at home
- **B.** Asked his sister to print new labels on Saturday
- **C.** Opened the exhibition to visitors
- **D.** Moved the labels into a new folder at the hall
- **Answer key:** `A`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Alex printed the labels on Friday and left the envelope on his kitchen table before arriving on Saturday. **Next step:** Connect the earlier Friday actions with Saturday’s discovery.

**REA-B1-09-Q2 — What was Alex doing when his sister found the envelope?**
- **A.** Checking the Saturday guest list
- **B.** Putting labels beside the displays
- **C.** Calling his sister
- **D.** Greeting the 9:00 visitors
- **Answer key:** `C`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A says she found the envelope while Alex was calling her at 8:10. **Next step:** Look for the ongoing background action marked by “while”.

**REA-B1-09-Q3 — Which order best matches the diary?**
- **A.** Visitors arrived → sister delivered → labels were printed
- **B.** Labels printed Friday → missing Saturday → sister delivered → visitors arrived
- **C.** Sister delivered → labels printed → Alex arrived → visitors arrived
- **D.** Labels missing → guests arrived → sister called → labels printed
- **Answer key:** `B`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Friday printing came before Saturday’s discovery; the sister arrived at 8:45 and visitors at 9:00. **Next step:** Build the timeline before selecting a sequence.

**REA-B1-09-Q4 — What does “I had left the envelope at home” explain?**
- **A.** That Alex had not printed anything on Friday
- **B.** That the guests had already seen the missing labels
- **C.** That his sister had taken the envelope on Friday
- **D.** Why Alex could not find the printed labels when he arrived
- **Answer key:** `D`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The earlier action of leaving the envelope on the table explains the later discovery at the hall. **Next step:** Ask which earlier event caused the later problem.

**REA-B1-09-Q5 — Which conclusion would be unsupported by either source?**
- **A.** The exhibition opened at 9:00 a.m.
- **B.** Alex used to keep exhibition materials together.
- **C.** Visitors saw the missing labels and complained.
- **D.** Alex’s sister brought the envelope at 8:45.
- **Answer key:** `C`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Both sources confirm the labels were in place before visitors arrived; neither reports complaints or visitors seeing the problem. **Next step:** Separate an imagined consequence from a recorded fact.

**REA-B1-09-Q6 — Which statement correctly distinguishes Alex’s past habit from this year’s situation?**
- **A.** Alex used to keep materials together, but this year he separated the labels.
- **B.** Alex has never organised an exhibition before this year.
- **C.** Alex always stores labels at the community hall.
- **D.** Alex’s sister used to print every exhibition label.
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Alex says he used to keep all materials in one folder, but this year the labels were separate. Other claims are not in the text. **Next step:** Check whose habit is described and whether it changed.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### B1-U01: WRI-B1-10 — Retell the Exhibition Problem Accurately
**Primary Unit:** `B1-U01`; **module:** `writing`; **CEFR:** `B1`; **estimated minutes:** 31; **activity:** one pending-review extended response.
**Learning objectives:**
- Reconstruct a coherent narrative with multiple time relationships.
- Use earlier-past and background-time markers meaningfully.
- Avoid inventing a complaint or blaming an unsupported person.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: a community exhibition. TASK: give a reliable connected event account. MUST INCLUDE: Friday printing, earlier forgotten envelope, Saturday discovery, while-calling episode, 8:45 delivery and 9:00 opening. BOUNDARY: 120–160 words, clear chronological evidence with no unsupported consequences or personal data.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — For a charity bike ride, organisers had filled water bottles on Friday. On Saturday morning, a volunteer was checking signs when the bottles were found in a storage cupboard. The team delivered them before riders arrived. This shows earlier past and later resolution without providing wording about exhibition labels.

**CORE-3 — Outline and independent draft**
Plan four paragraphs or clear stages: prior preparation → problem discovered → explanation and response → outcome. Use past perfect only for truly earlier events; do not add a visitor reaction absent from both sources.

**WRI-B1-10-Q1 — Exact learner task (`prompt`)**
> Write 120–160 words for a fictional exhibition team explaining what happened to the labels. Include Friday preparation, the envelope left at home, Saturday discovery, the phone call and the sister’s delivery, and the opening outcome. Show the order using suitable past forms (including at least one earlier-past relation and one while/when clause). You may mention Alex’s changed habit. Do not invent visitor complaints, rewrite who printed the labels, or include real addresses.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-B1-10-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-B1`.
- `skill_tags: [writing.task_understanding, writing.idea_development, writing.organization, writing.cohesion, writing.vocabulary]`.
- `word_range_guidance: {min:120, max:160, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
After trusted review, highlight one misleading time relation or unsupported inference and improve a revised draft; original attempt and source version remain preserved.

### B1-U05: REA-B1-10 — Courtyard Project — What Could the Council Do?
**Primary Unit:** `B1-U05`; **module:** `reading`; **CEFR:** `B1`; **estimated minutes:** 29; **questions:** 6.  
**Learning objectives:**
- Separate a proposed possibility from an approved action.
- Evaluate two options using budget, safety, time and purpose.
- Identify the qualified next step without asserting uncertain outcomes as fact.

**CORE-1 — Meaningful situation and task**
Responsible advice uses facts, conditions and uncertainty correctly. A choice that might help is not the same as a choice the council has already approved. When several needs compete, a clear proposal states which need comes first, what conditions must be met and what still needs checking.

**CORE-2 — Different-scenario independent worked model (pre-submit)**
INDEPENDENT MODEL — A community club could buy extra bike racks for $80 or a new notice board for $50. If the club chose the racks, it might reduce clutter, but nobody has measured the number of bicycles yet. The responsible next step is to count bicycles and check safety before promising a result. This demonstration is NOT about the courtyard projects.

**CORE-3 — Independent assessed reading**
Read the proposed projects in SOURCE A and the decision note in SOURCE B. Mark FACT, POSSIBILITY, CONDITION and UNDECIDED; avoid claiming a vote or a safe installation has already happened.

**SOURCE A — Student council project options (learner-visible `reading_asset` body)**
```text
The school council has a maximum budget of $120 for ONE courtyard project this term.
OPTION A — Portable shade sails: $110. School staff estimate installation could take two days AFTER safety approval. They may offer shade near outdoor reading seats, but installation depends on weather and staff availability.
OPTION B — Small rainwater tank: $115. It might support garden watering in dry weeks. A licensed installer is required and cannot attend until next month. The tank does NOT provide shade.
Outdoor reading sessions begin next Friday. Some students have requested shade for those sessions. Garden volunteers also say watering is difficult in dry months.
```

**SOURCE B — Chair’s decision note (learner-visible `reading_asset` body)**
```text
The council will vote on Tuesday. No project has been approved yet. Before buying either option, the caretaker must confirm that the proposed site and equipment are safe. If staff approved the shade sails and conditions were suitable, installation might finish in time for Friday, but there is no guarantee. The tank cannot be installed this week and would not solve the immediate shade problem.
```

**Machine contract (post-review only):** `reading_asset.id: TXT-REA-B1-10`; `display_to_learner:true`; `type: single_choice`; `evidence_weight:1`; source labels remain visible.

**REA-B1-10-Q1 — Which statement is already confirmed by the sources?**
- **A.** The shade sails have been installed.
- **B.** The council has a $120 maximum budget and will vote on Tuesday.
- **C.** The rainwater tank was approved yesterday.
- **D.** The caretaker has confirmed that both projects are safe.
- **Answer key:** `B`; **tag:** `skill_tags:[reading.detail]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A gives the $120 budget and SOURCE B schedules the vote for Tuesday. The other statements wrongly treat proposals as completed decisions. **Next step:** Label proposals and confirmed facts separately.

**REA-B1-10-Q2 — Which conditional recommendation is consistent with the two sources?**
- **A.** If the council voted for the tank, it would give shade next Friday.
- **B.** If staff approved shade sails, they must already be installed.
- **C.** If students wished for shade, no safety check would be needed.
- **D.** If the council chose shade sails and safety approval came in time, they might help by Friday.
- **Answer key:** `D`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The note permits a conditional possibility for shade sails if approval and conditions work, not a guaranteed result. **Next step:** Use if plus a realistic condition and qualified outcome.

**REA-B1-10-Q3 — Why is the rainwater tank not a direct answer to the immediate shade request?**
- **A.** It provides no shade and cannot be installed this week.
- **B.** It costs more than the $120 budget.
- **C.** It has already been removed from the site.
- **D.** Students have voted to cancel the reading sessions.
- **Answer key:** `A`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** SOURCE A says the tank does not give shade; SOURCE B says the installer cannot attend this week. **Next step:** Match an option to the actual stated need and time frame.

**REA-B1-10-Q4 — Which statement would go beyond the evidence?**
- **A.** The council has two proposals.
- **B.** Shade sails would cost $110.
- **C.** The courtyard shade project has definitely been approved and will work by Friday.
- **D.** The caretaker must confirm safety before purchase.
- **Answer key:** `C`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The vote has not occurred, safety is unconfirmed and Friday completion is only possible, not guaranteed. **Next step:** Watch for unjustified certainty such as “definitely”.

**REA-B1-10-Q5 — Which next step is most responsible before the council buys anything?**
- **A.** Spend the full budget before the vote.
- **B.** Ask the caretaker to check safety and confirm staff feasibility before deciding.
- **C.** Assume the rainwater tank will arrive tomorrow.
- **D.** Promise students that shade is guaranteed next Friday.
- **Answer key:** `B`; **tag:** `skill_tags:[reading.author_purpose]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** The decision note explicitly requires a safety check; feasibility must be assessed rather than promised before approval. **Next step:** Connect source limits to an actionable check.

**REA-B1-10-Q6 — Which statement fairly compares the two purposes?**
- **A.** Both choices provide guaranteed shade by next Friday.
- **B.** The rainwater tank costs less and gives instant shade.
- **C.** Neither project could ever help the school.
- **D.** Shade sails target the nearer reading-seat need; the tank might help garden watering later.
- **Answer key:** `D`; **tag:** `skill_tags:[reading.inference]`; **weight:** `1`.
- **CORE-4 post-submit explanation (`explanation_en`):** Only the sails may address shade soon, conditionally. The tank might help watering later but has no immediate shade benefit. **Next step:** Compare timing and goals without declaring one option universally better.

**CORE-4 — Feedback/revision principle:** After submission, feedback may identify the evidence that supports the keyed answer and a specific next action. Explain the answer independently of option letter and shuffling; do not award a CEFR level from five or six practice answers.

### B1-U05: WRI-B1-11 — Write a Responsible Council Recommendation
**Primary Unit:** `B1-U05`; **module:** `writing`; **CEFR:** `B1`; **estimated minutes:** 32; **activity:** one pending-review extended response.
**Learning objectives:**
- Make a balanced recommendation with two verifiable project details.
- Use a hypothetical if-clause and appropriate uncertainty language.
- Propose a practical safety/feasibility check before a decision.

**CORE-1 — Topic, Task, Must Include, Boundary**
TOPIC: the student council’s courtyard project. TASK: propose a responsible choice for next Friday. MUST INCLUDE: a reasoned position, correct budget and project amounts, a fair other-option comparison, an if-clause, explicit uncertainty and a safety check. BOUNDARY: 120–160 words; no invented votes, guaranteed outcomes, additional funding or personal identifiers.

**CORE-2 — Different-scenario independent model (pre-submit)**
INDEPENDENT MODEL — A youth club could spend $70 on a bike rack or $40 on extra chairs. If the club chose the bike rack, the entrance might become tidier, but the club has not counted how many bikes arrive. A responsible memo would request a bike count and a safety check before purchasing. No courtyard price or shade fact is used in this example.

**CORE-3 — Outline and independent draft**
Claim → precise need → comparison with evidence → hypothetical condition and limitation → safety/feasibility next step. Keep “might help” distinct from “has been approved”.

**WRI-B1-11-Q1 — Exact learner task (`prompt`)**
> Write 120–160 words to a fictional school council before its Tuesday vote. Recommend which courtyard project should be prioritised for the next-Friday reading sessions, compare the other project fairly, and include the exact budget, prices and timing constraints. Write at least one cautious if-clause, explain why a result cannot yet be guaranteed, and propose a safety/feasibility next step. Do not claim that a vote, installation or caretaker approval has already happened.

**Machine contract for this assessed task (post-review only):**
- `id: WRI-B1-11-Q1`; `type: extended_response`; `answer: null`; `evidence_weight: 0`; `review_mode: assisted_ai_or_human`; `rubric_id: RUBRIC-WRITING-B1`.
- `skill_tags: [writing.task_understanding, writing.idea_development, writing.organization, writing.cohesion, writing.vocabulary]`.
- `word_range_guidance: {min:120, max:160, not_a_quality_score:true}`.
- **Pending feedback:** “Saved for trusted review. Your draft is not automatically given a Writing quality score or CEFR level. Word count helps with planning but is not a grade.”

**CORE-4 — Self-check, trusted review and revision**
After trusted feedback, revise one unsupported claim or unclear if-clause without deleting original attempts or treating a word count as a proficiency score.

## D. Consolidated activity inventory / independent review checklist

| Unit | Reading lesson | Objective MCQs | Reading keys (in order) | Writing lesson | Open tasks |
|---|---|---:|---|---|---:|
| A1-U03 | `REA-A1-08` | 5 | `C A D B A` | `WRI-A1-08` | 1 |
| A1-U06 | `REA-A1-09` | 5 | `A C B D A` | `WRI-A1-09` | 1 |
| A2-U02 | `REA-A2-11` | 6 | `B C A D B C` | `WRI-A2-10` | 1 |
| A2-U04 | `REA-A2-12` | 6 | `C A D B A C` | `WRI-A2-11` | 1 |
| B1-U01 | `REA-B1-09` | 6 | `A C B D C A` | `WRI-B1-10` | 1 |
| B1-U05 | `REA-B1-10` | 6 | `B D A C B D` | `WRI-B1-11` | 1 |
| **Total** | **6 Reading lessons** | **34** | | **6 Writing lessons** | **6** |

There are **40** new activity IDs, one per question/task. All lesson and activity IDs shown are provisional pending fresh collision check at integration. Writing prompts must not count as scored objective items. Worked example texts should not appear as test keys before submission.

## E. Mandatory independent reviewer questions

1. Coverage: Do these six Unit selections and 12 lessons address the stated independent transfer gaps without incorrectly claiming mastery/completion of whole Units?
2. Novelty: Are the six assessment scenarios sufficiently distinct from the mapped baseline lesson themes and one another? Specify any suspected overlaps or insufficient excerpts.
3. A1-U03: Are timetable and after-school-club facts, times and rooms internally consistent, and do all five keys uniquely follow from the source?
4. A1-U06: Are the west/east ordering, north/south positions and two-step directions unambiguous, with no inferred distances or times?
5. A2-U02: Are the garden diary and organiser note aligned in chronology? Do when/while and past continuous/past simple questions have uniquely supported answers?
6. A2-U04: Are all monetary and duration calculations correct? Does the chosen recommendation truly meet Sam’s budget, schedule and equipment-borrowing conditions?
7. B1-U01: Is narrative order, past perfect, past habit, observer scope, and the distinction between fact and invented accusation correct?
8. B1-U05: Are the project prices, $120 limit, unapproved vote, hypothetical timing and safety constraints consistent? Does the recommended next step avoid overclaiming?
9. Reading QA: Audit EACH of the 34 MCQs: exact unique key, four meaningful distractors, CEFR calibration, accepted tag, weight 1, post-submit evidence and Next step; list any ID with a defect.
10. Writing QA: Audit EACH of the six tasks: Topic/Task/Must Include/Boundary, level-calibrated ranges, independent model, sufficient source facts, zero-weight/null answer/trusted review contract, and no semantic scoring.
11. Non-leakage and pedagogy: Do the 12 lessons implement Core 1–4 in a way an independent child can use without seeing assessed answers in the pre-submit models?
12. Technical/release separation: Confirm that current 150-lesson cap blocks 154 until separately QA-validated; no new audio, no learner data, no release GO from this academic packet.

## F. Required reviewer verdict format

Return: **PACKET_VERDICT** `PASS | PASS_WITH_REQUIRED_CHANGES | FAIL | INSUFFICIENT_EVIDENCE`; **REVIEW_SCOPE** `AUTHORED_CONTENT_ITEM_LEVEL`; **ITEM AUDIT** for ALL 40 exact IDs (may group by lesson, but keys and issue-specific reasons must be auditable); **REQUIRED CHANGES** table (`Fix ID | Exact item/section | defect | exact correction | severity | retest requirement`); **OPTIONAL IMPROVEMENTS** clearly non-blocking; **ANSWERS 1–12** to Section E questions; and **READY FOR MACHINE SCHEMA DRAFT** `YES/NO` plus **PRODUCTION RELEASE STATUS** `NO_GO`. A PASS permits machine drafting only; it cannot authorize schema-cap change, GitHub merge or Firebase deploy.

## G. NotebookLM source operations and short chat

**KEEP:** active permanent English SLE master academic standard, current 60-unit curriculum framework, current independent academic review rules; exclude duplicates/superseded references.

**REMOVE:** completed temporary A1-U08/A2-U07 1.24 R1 packet and all older temporary batch review packets. Keep completed audit verdicts archived outside the active NotebookLM source set.

**ADD:** only `SLE_BULK12_A1A2B1_NOTEBOOKLM_R1_20261109.md` as the current temporary source.

**NotebookLM chat (short):** “Review the current 12-lesson temporary packet against permanent English sources. Audit all 40 items and answer Section E (1–12). Return the required verdict and any exact blocking fixes.”

**Scope remains:** content authoring only. No JSON, CI, import, deploy or revision-store change is approved by a NotebookLM academic PASS alone.
