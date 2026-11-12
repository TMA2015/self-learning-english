# SLE — Independent academic review packet: curriculum-wide lesson-source continuity

**Packet ID:** SLE-FLOW-14-WRITING-v1.0 · 2026-11-12  
**Baseline:** SLE-MASTER-001 v1.2.0 and imported curriculum **1.25.0**  
**Working Draft:** GitHub PR #145 (DO NOT MERGE/DEPLOY); issue #146  
**Type:** one human-readable temporary NotebookLM academic review source; NOT new learner content.

## Review context and non-negotiable boundaries

The owner tested the released learning site on desktop/iPhone and found that source-dependent Writing required switching among independent Reading/Listening/Writing lessons, harming concentration and task continuity. PR #145 proposes one common single-screen bundle: read original notice, listen to original audio only when required, and write within the existing Writing player. The original assessed Reading/Listening lessons remain accessible as OPTIONAL activities.

- **No new task, score, rubrics, answer keys, wording, lesson IDs or canonical audio.** All task prompts and original material below are quoted from the existing imported curriculum and original source manifests.
- **No AI assessment claim.** The separate Writing Draft & Self-Check remains a generic offline editor/checklist.
- Reference Listening audio in Writing must **not** mark the graded Listening lesson completed; the original assessed Listening gate and full-playback requirement remain intact.
- Audio transcript excerpts below are **reviewer-only evidence**. Do not expose them on the student-facing Writing screen or before scored Listening submission.
- Proposed linkage has **14** source-dependent Writing lessons, of which **3** require both a Reading passage and a spoken source; **11** require Reading only. Other 17 Writing tasks have self-contained prompts.
- The independent reviewer must verify source choice and learner-facing teaching sequence. Passing automated UI/CI tests is NOT academic approval.

## Full-catalog evidence summary

| Module | Imported lessons | Source completeness finding |
|---|---:|---|
| Grammar | 40 | Objective and short-answer practice; separate pedagogical design, no external source asset expected by this workflow |
| Vocabulary | 18 | Objective and short-answer practice; separate pedagogical design |
| Reading | 33 | All carry a learner-visible original reading passage |
| Listening | 21 | All carry an original audio source and corresponding manifest-backed MP3 |
| Writing | 31 | 14 source-dependent; 17 stand-alone writing prompts |
| Speaking | 6 | Separate recording/speaking review contract, out of scope for this source-linkage fix |
| Pronunciation | 5 | Separate pronunciation/recording contract, out of scope |
| **Total** | **154** | Source linkage issue concerns 14 Writing lessons; **not** a blanket verdict on all learning UX |

## Source selection rule

Only pair original Reading/Listening passages needed to answer the Writing prompt. Do **not** automatically use other lessons merely because they belong to the same Unit. B1-U02 has an unrelated Reading lesson, for example. All selections must preserve the current lesson's original version and meaningful assessment boundaries.

## Detailed teacher-review evidence for all 14 tasks

### WRI-A1-05 · Invite a friend using two sources (A1-U10)

**Writing assignment:** Write a friendly message of about 30–50 words to Alex inviting them to one Saturday activity. Say which event you choose, when and where it starts, and one thing Alex should bring or does not need to bring. Use fictional names; do not write a real address or phone number.

**Required Reading:** REA-A1-05 — Saturday Garden Morning — read a new notice (asset TXT-REA-A1-05).

> Our school garden is open this Saturday from 9:00 to 10:30 in the morning. Meet at the small gate near the gym. We will plant flowers and water vegetables. You do not need to bring tools; the club has them. Bring a bottle of water and wear comfortable shoes. New students can join. If it rains, meet in Room 6 and make plant labels instead. Tell Ms Mai by Friday if you plan to come.

**Required spoken source:** LIS-A1-06 — Saturday music workshop — listen and compare. Original MP3: `/foundation-audio/LIS-A1-06-v1.mp3`, duration 22.2 seconds. **Reviewer-only narration (never shown as student transcript before scored Listening submission):**

> Good morning, everyone. The school music room is open for a short song workshop this Saturday. Please come to Music Room 2 at eleven o'clock. We will practise two easy songs. Bring a pencil. You do not need to bring an instrument because our school has drums and keyboards. The workshop ends at twelve o'clock. To join, write your name on the music list near the office by Friday.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A1-05's target CEFR level, and that an answer is possible without inventing information.

### WRI-A2-07 · Write Mia a helpful evidence-based reply (A2-U10)

**Writing assignment:** Write Mia a helpful reply of about 65–90 words. Recommend one event and explain two reasons from the written notice and her message. Include where and when to go and one important limitation or condition. Do not promise that a repair will succeed.

**Required Reading:** REA-A2-08 — Community events — compare conditions (asset TXT-REA-A2-08).

> Riverside Clean-up — Saturday, 9:00–11:00 a.m. Meet at the footbridge. The team provides rubbish bags and gloves. Please wear closed shoes. If there is heavy rain, the clean-up will be cancelled. Young volunteers can join with a responsible adult.   Repair Café — Sunday, 2:00–4:00 p.m. Bring a small broken household item or bag to the Community Hall. Volunteer helpers can examine simple problems, including some broken zips. They cannot guarantee that every item can be repaired. A donation is welcome but is not required. Please stay with your item while a volunteer examines it.   Seed Swap — Sunday, 10:00–11:00 a.m. Meet at the community garden. Exchange spare seeds or ask for advice about growing plants in small spaces. Entry is free; if you have no seeds, you can still ask questions.

**Required spoken source:** LIS-A2-07 — Mia's weekend needs — listen and decide. Original MP3: `/foundation-audio/LIS-A2-07-v1.mp3`, duration 25.15 seconds. **Reviewer-only narration (never shown as student transcript before scored Listening submission):**

> Hi! Can you help me choose something to do this weekend? The zip on my school bag is broken, and I'd rather repair the bag than buy a new one. I can only go out on Sunday afternoon, after two. My aunt can come with me. I'd like to be indoors because the weather might be rainy. I don't mind making a small donation, but I don't want to pay a fixed entry fee. Could you tell me which event would be useful? And please let me know if they can definitely fix the bag.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A2-07's target CEFR level, and that an answer is possible without inventing information.

### WRI-B1-08 · Write a balanced school-pilot recommendation (B1-U10)

**Writing assignment:** Write a 130–170 word recommendation for the school council. Choose one eight-week room pilot. Summarise a useful point for each proposal, use at least one relevant fact from the written briefing and one distinct idea or qualification from the spoken comment, explain a limitation of your preferred proposal, and suggest one realistic way to evaluate the pilot. Your recommendation may differ from the speaker's position if it is well supported.

**Required Reading:** REA-B1-07 — One-room pilot — evaluate source evidence (asset TXT-REA-B1-07).

> The school has enough staff funding to run one eight-week after-school room pilot. The council must select one plan and review its value before asking for a permanent space.   Proposal Q: Quiet Study Zone. The library annex could offer 20 desks on Tuesday and Thursday afternoons. A staff member would supervise independent study. This may help students who cannot work quietly at home. However, group presentations and lively collaboration would not be allowed in this room.   Proposal P: Project Studio. An unused classroom could open on three afternoons each week. Movable tables would support group projects and short presentations. However, supervising equipment and managing noise could cost more staff time.   In a recent questionnaire of 100 students, 62 selected an interest in quiet study and 51 selected an interest in group projects. Students could select both interests, so the figures must not be added together as if the two groups were separate. The questionnaire gives useful feedback but does not prove how many students would attend either room regularly.

**Required spoken source:** LIS-B1-08 — Student council viewpoint — listen and evaluate. Original MP3: `/foundation-audio/LIS-B1-08-v1.mp3`, duration 39.625 seconds. **Reviewer-only narration (never shown as student transcript before scored Listening submission):**

> I think the Quiet Study Zone is the more practical first pilot. Students have told me that a calm place after class would help them prepare for assessments, and the annex already has desks. Still, we must be careful about the questionnaire. It was sent just before exam week, when students might have been thinking more about silent study than they usually do. I also see the value of a Project Studio for teamwork. Because we can fund only one room, I'd begin with the quiet annex and ask students how often they actually use it. After four weeks, we could collect feedback from students who wanted a project room, too. Then the council would have better evidence before choosing any permanent plan.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-B1-08's target CEFR level, and that an answer is possible without inventing information.

### WRI-A1-06 · Write a polite Sports Day snack request (A1-U05)

**Writing assignment:** Write 25–40 words to a fictional helper at the Sports Day Snack Table. Ask politely for items shown on the menu, state the quantities and thank the helper. Do not use real personal details.

**Required Reading:** REA-A1-06 — Sports Day Snack Table — read a menu (asset TXT-REA-A1-06).

> Sports Day Snack Table — Saturday
> 
> a pear — $2
> an egg wrap — $3
> two bananas — $4 (price for both bananas together)
> a yogurt — $1
> 
> All prices are for the full menu line. Students can choose one line or more. Please ask politely at the table.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A1-06's target CEFR level, and that an answer is possible without inventing information.

### WRI-A2-08 · Ask Harbour Market for an order correction (A2-U03)

**Writing assignment:** Write 55–80 words to Harbour Market about the club's picnic order. Explain the difference between the cup packs on the receipt and the packs ordered/received; request a clear correction and finish politely. Do not include real personal information.

**Required Reading:** REA-A2-09 — Club Picnic Order — check two sources (asset TXT-REA-A2-09).

> SOURCE 1 — HARBOUR MARKET: CLUB PICNIC RECEIPT
> 
> 1 carton of juice — $4 each — $4
> 2 bags of rice — $3 each — $6
> 3 packs of paper cups — $2 each — $6
> TOTAL PAID: $16
> 
> SOURCE 2 — CUSTOMER MESSAGE
> 
> Hello. I ordered two packs of paper cups, and I received two, but my receipt lists three. We have some rice for the picnic, but we don't have any spare cup packs. We don't need much more juice. Could you check how many cup packs you charged us for, please? I think the total should be lower. Thank you.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A2-08's target CEFR level, and that an answer is possible without inventing information.

### WRI-B1-09 · Write a cautious library recommendation (B1-U02)

**Writing assignment:** Write 120–160 words to the fictional community library team. Recommend whether and how to offer reminders. Use the two written sources: include the exact September/October observation, one access concern, one reason the change does not prove causation, and a fair next step. Organise a clear Claim → Reason → Evidence → Limitation → Action paragraph. Do not invent research or include real personal information.

**Required Reading:** REA-B1-08 — Library Reminders — What Does the Evidence Show? (asset TXT-REA-B1-08).

> SOURCE A — Student suggestion
> 
> Some students forget their books when they are busy with other homework. A short reminder before the return date could help us plan. I recommend offering optional library reminders, but students should be able to choose email or a paper note. Not everyone has a phone. The library could ask readers which method they prefer.
> 
> SOURCE B — Librarian's note
> 
> In September, 40 borrowed books were returned late. In October, after a trial email reminder was introduced, 25 books were returned late. The change looks encouraging. However, the library also extended its opening hours in October, and we did not record which readers opened the emails. These two months alone cannot show that the reminders caused the reduction. We should compare several more weeks, record which options readers choose, and keep a paper alternative.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-B1-09's target CEFR level, and that an answer is possible without inventing information.

### WRI-A1-07 · Ask a Museum Helper for Missing Information (A1-U08)

**Writing assignment:** Write 35–50 words to a fictional City Museum helper. Ask politely (1) where to return the audio guide and (2) what languages the guide offers. Include one correct instruction from the museum cards and thank the helper. Do not invent the missing answers or use real personal information.

**Required Reading:** REA-A1-07 — Museum Audio Guide — Read, Follow, Ask (asset TXT-REA-A1-07).

> SOURCE A — CITY MUSEUM AUDIO GUIDE CARD
> 
> Pick up a free audio guide at the Welcome Desk in Room 1.
> First, choose a tour on the screen. Then press the green Play button.
> Keep the guide inside the museum. Do not use it in the café.
> Bring the guide back before 4:00 p.m.
> 
> SOURCE B — VISITOR HELP CARD
> 
> A helper is at the Welcome Desk in Room 1. Ask the helper about things you cannot find on the guide card, including the exact return place and which languages the guide offers.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A1-07's target CEFR level, and that an answer is possible without inventing information.

### WRI-A2-09 · Write a Clear Photo Club Progress Message (A2-U07)

**Writing assignment:** Write 70–95 words to the fictional photo club organiser. Use the chat and update in REA-A2-10. Include one true experience (ever/never), one completed action at a stated past time, one just/already completed task, one not-yet-completed task, and a realistic next action with the supplied deadline. Be clear about who did what; do not invent facts or use real personal information.

**Required Reading:** REA-A2-10 — Photography Club — Experience and Progress Update (asset TXT-REA-A2-10).

> SOURCE A — PHOTO CLUB CHAT, THURSDAY AFTERNOON
> 
> Tara: I have never joined an organised club photo walk. I visited Green Park with my cousin last Sunday and took three photos. I've just uploaded those three photos to our shared folder. I haven't written the captions yet.
> 
> Sam: I've already made the exhibition poster. I made the title card on Monday. I've never tried photographing at night.
> 
> SOURCE B — ORGANISER UPDATE, THURSDAY 4:00 P.M.
> 
> We have already checked the poster size. Tara's three photos are in the shared folder, but her captions have not arrived yet. Please send the captions by Friday at 5:00 p.m. The exhibition opens on Saturday.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A2-09's target CEFR level, and that an answer is possible without inventing information.

### WRI-A1-08 · Explain a School Morning and Ask One Question (A1-U03)

**Writing assignment:** Write 35–50 words to a fictional new student. Use SOURCE A and SOURCE B: say when and where Monday Reading starts; say when and where Wednesday Art Club starts; explain that Art Club is different from Monday Art; and ask one polite question about a finishing time not given in the notices. Do not invent the answer or include real student names or contact details.

**Required Reading:** REA-A1-08 — New School Timetable — Classes and Club (asset TXT-REA-A1-08).

> SOURCE A — School morning timetable
> 
> MONDAY
> 8:00 a.m. — Maths — Room 2
> 9:00 a.m. — Reading — Room 5
> 10:15 a.m. — Art — Room 3
> 
> WEDNESDAY
> 8:00 a.m. — Science — Lab 1
> 9:00 a.m. — Music — Room 4
> 10:15 a.m. — PE — Playground
> 
> All times on this card are START times.
> 
> SOURCE B — After-school club note
> 
> Art Club meets on Wednesday at 3:30 p.m. in Room 3. You do not need to bring your own paint. Ask the teacher if you want to know when the club finishes. The club is separate from Monday's Art lesson.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A1-08's target CEFR level, and that an answer is possible without inventing information.

### WRI-A1-09 · Send Clear Directions to the Park (A1-U06)

**Writing assignment:** Write 35–50 words to a fictional visitor. Starting at the Brook Town bus stop, explain how to reach the park. Name River Street and the library, give the east-then-north route in order, and add one friendly sentence saying that the exact walking time is not shown. Do not invent street names, distances or real personal information.

**Required Reading:** REA-A1-09 — Brook Town — Follow a Short Route (asset TXT-REA-A1-09).

> SOURCE A — Brook Town written map key
> 
> Along River Street, from WEST to EAST, these places appear in this order:
> BUS STOP → LIBRARY → BAKERY → CLINIC.
> The park is immediately NORTH of the library.
> The café is immediately SOUTH of the bakery.
> The school is immediately NORTH of the clinic.
> On this written map, EAST means RIGHT and NORTH means UP. The places on River Street are on the same straight road. No distances or travel times are shown.
> 
> SOURCE B — Visitor help note
> 
> To reach the park from the bus stop, travel EAST along River Street until you reach the library. From the library, turn NORTH to the park. To reach the clinic from the bus stop, continue EAST past the library and the bakery. Ask a helper if you need the walking time: the map key does not provide it.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A1-09's target CEFR level, and that an answer is possible without inventing information.

### WRI-A2-10 · Write a Short Garden Open-Day Recount (A2-U02)

**Writing assignment:** Write 70–95 words for a fictional class newsletter about the garden open day. Include Noor’s arrival, the rain starting while Mia was carrying boxes, the move to the hall, the visitors arriving, and the planting activity. Give a clear time order and one accurate while/when sentence. Do not say the event was cancelled, invent a seedling total, or add real names or addresses.

**Required Reading:** REA-A2-11 — Garden Open Day — What Happened First? (asset TXT-REA-A2-11).

> SOURCE A — Noor’s open-day diary
> 
> SATURDAY, 8:30 a.m. — I arrived at the community garden. Volunteers were putting up signs.
> 9:00 a.m. — Rain started while Mia was carrying boxes to the outdoor tables.
> 9:20 a.m. — We moved the tables into the hall.
> 10:00 a.m. — The rain stopped, and our visitors arrived.
> 11:00 a.m. — We planted seedlings with the visitors.
> 12:10 p.m. — We packed away the tools.
> 
> SOURCE B — Organiser’s note
> 
> We did NOT cancel the garden open day. After the rain began, we moved the tables indoors before the visitors arrived. The visitors came at 10:00 a.m., and the planting activity took place later. We did not count the number of seedlings planted.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A2-10's target CEFR level, and that an answer is possible without inventing information.

### WRI-A2-11 · Recommend the Right Workshop for Sam (A2-U04)

**Writing assignment:** Write a 70–95 word reply to fictional Sam recommending an arts workshop. Compare the two options using exact days, prices and one duration fact. Explain why one fits Sam’s schedule and budget. Mention the camera-loan condition and give a practical next step. Do not invent course quality ratings, discounts or personal contact information.

**Required Reading:** REA-A2-12 — Choose an Arts Workshop — Compare the Facts (asset TXT-REA-A2-12).

> SOURCE A — Arts centre workshop notice
> 
> WOOD CRAFT: Thursday, 4:00–5:00 p.m.; $6 per session; tools included; ages 11 and above.
> DIGITAL PHOTOGRAPHY: Saturday, 10:00–11:30 a.m.; $4 per session; bring a camera. A camera can be borrowed free if requested at least 48 hours before the session; ages 11 and above.
> The notice does not rate the quality of either class. The centre does not offer the two classes at any other times.
> 
> SOURCE B — Sam’s message
> 
> I am 12. I can attend ONLY on Saturday mornings. I can spend no more than $5 per class, and I do not own a camera. I can contact the centre several days before a class if equipment can be borrowed. I would like to try a practical creative activity.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-A2-11's target CEFR level, and that an answer is possible without inventing information.

### WRI-B1-10 · Retell the Exhibition Problem Accurately (B1-U01)

**Writing assignment:** Write 120–160 words for a fictional exhibition team explaining what happened to the labels. Include Friday preparation, the envelope left at home, Saturday discovery, the phone call and the sister’s delivery, and the opening outcome. Show the order using suitable past forms (including at least one earlier-past relation and one while/when clause). You may mention Alex’s changed habit. Do not invent visitor complaints, rewrite who printed the labels, or include real addresses.

**Required Reading:** REA-B1-09 — Exhibition Morning — The Missing Labels (asset TXT-REA-B1-09).

> SOURCE A — Alex’s exhibition diary
> 
> On Friday afternoon, I printed the exhibition labels and put them in an envelope. That evening, I checked the guest list, but I left the envelope on the kitchen table.
> On Saturday, I arrived at the community hall at 8:00 a.m. and discovered the labels were missing. I realised I had left the envelope at home. While I was calling my sister at 8:10, she found it on the kitchen table. She brought the envelope to the hall at 8:45. We put the labels beside the displays before visitors arrived at 9:00.
> When I was younger, I used to keep all exhibition materials in one folder. This year I had separated the labels from the other papers.
> 
> SOURCE B — Organiser’s short report
> 
> The Saturday exhibition opened on time at 9:00 a.m. The labels were in place before the visitors came in. Alex printed the labels on Friday; his sister delivered the envelope on Saturday morning. The report does not say that Alex’s sister printed the labels or that visitors saw the temporary problem.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-B1-10's target CEFR level, and that an answer is possible without inventing information.

### WRI-B1-11 · Write a Responsible Council Recommendation (B1-U05)

**Writing assignment:** Write 120–160 words to a fictional school council before its Tuesday vote. Recommend which courtyard project should be prioritised for the next-Friday reading sessions, compare the other project fairly, and include the exact budget, prices and timing constraints. Write at least one cautious if-clause, explain why a result cannot yet be guaranteed, and propose a safety/feasibility next step. Do not claim that a vote, installation or caretaker approval has already happened.

**Required Reading:** REA-B1-10 — Courtyard Project — What Could the Council Do? (asset TXT-REA-B1-10).

> SOURCE A — Student council project options
> 
> The school council has a maximum budget of $120 for ONE courtyard project this term.
> OPTION A — Portable shade sails: $110. School staff estimate installation could take two days AFTER safety approval. They may offer shade near outdoor reading seats, but installation depends on weather and staff availability.
> OPTION B — Small rainwater tank: $115. It might support garden watering in dry weeks. A licensed installer is required and cannot attend until next month. The tank does NOT provide shade.
> Outdoor reading sessions begin next Friday. Some students have requested shade for those sessions. Garden volunteers also say watering is difficult in dry months.
> 
> SOURCE B — Chair’s decision note
> 
> The council will vote on Tuesday. No project has been approved yet. Before buying either option, the caretaker must confirm that the proposed site and equipment are safe. If staff approved the shade sails and conditions were suitable, installation might finish in time for Friday, but there is no guarantee. The tank cannot be installed this week and would not solve the immediate shade problem.

**Spoken source:** None required by this Writing prompt. Do not insert other Listening lessons from the Unit.

**Review task:** Verify that the listed source(s) provide all required facts, that no unrelated source was selected, that the order is appropriate to WRI-B1-11's target CEFR level, and that an answer is possible without inventing information.

## Standalone Writing lessons — must not force unrelated media

- **WRI-A1-01** — Introduce yourself in a short paragraph; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-01** — Write a helpful email; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-01** — Develop an opinion paragraph; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A1-02** — Write a friendly invitation message; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-02** — Describe a school event in an email; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A1-03** — Describe a familiar person or place; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A1-04** — Write about a typical school day; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-03** — Recommend a club with reasons; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-02** — Build a clear opinion paragraph; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-04** — Reply to a message and solve a small problem; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-03** — Compare two options and recommend one; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-05** — Read the task before writing; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-A2-06** — Brainstorm ideas that answer the question; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-04** — Explain a reason and support it with an example; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-05** — Make an outline before your opinion draft; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-06** — Link ideas clearly, not mechanically; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.
- **WRI-B1-07** — Revise a draft for task, clarity and tone; the writing task supplies the topic and essential facts or asks the learner to invent a fictional response.

## Specific review questions

1. **Pairing correctness** — For each of the 14 entries, are the REA and optional LIS sources the correct canonical materials for the Writing prompt? In particular, confirm REA-B1-08 (not REA-B1-06) for WRI-B1-09, and no unrelated LIS for WRI-A1-06/WRI-A2-11.
2. **Source sufficiency** — Can a learner answer every factual requirement from what is displayed and/or the prompt itself? Flag any missing condition, conflicting time/location, ambiguity or impossible instruction with lesson ID and quoted source fact.
3. **Pedagogical flow** — Does one continuous Read → [Listen] → Write task with the original question below the sources improve learner independence? Should A1 tasks receive any additional, clearly non-answer-revealing directions?
4. **Assessment integrity** — Is replaying reference audio within Writing without awarding the independent Listening score academically sound, provided the original scored Listening lesson remains separately assessed?
5. **Source provenance and transcript safety** — Does the description correctly prevent showing protected Listening transcripts, answer cues or scores before genuine Listening submission? Do not equate audio playback with independent Listening mastery.
6. **Scope completeness** — Are 14 affected / 17 independent Writing tasks justified by the canonical sources and prompts? Identify exceptions or false positives.
7. **Other learner-flow risks** — From this packet, identify any broader curriculum navigation/dependency patterns worth a *separate* audit. Do not declare unrelated modules fully reviewed without their underlying lesson materials.
8. **Release readiness** — List REQUIRED corrections vs optional ideas. No new academic content or rubric changes may be approved silently.

## Required response format

- **Packet verdict:** PASS / PASS WITH REQUIRED FIXES / FAIL.
- **Coverage:** state number of source-backed Writing tasks actually reviewed (expect 14) and number of standalone cases inspected (expect 17).
- **Per-task matrix:** Writing ID; source pairing PASS/FAIL; factual sufficiency PASS/FAIL; flow/level PASS/FAIL; required correction if any.
- **Cross-cutting issues:** source/audio integrity, age/CEFR scaffolding, misleading AI or Listening score claims, and any unsupported assumptions.
- **Required before deployment:** concise numbered blocking corrections, if any. Optional future improvements must be clearly labeled nonblocking.
- Do not approve unsupported source assignments or infer Listening competence from a reference playback.

**End of temporary independent review packet.**
