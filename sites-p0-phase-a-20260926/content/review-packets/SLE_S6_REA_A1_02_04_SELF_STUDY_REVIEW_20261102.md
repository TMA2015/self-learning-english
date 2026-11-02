# Self-Learning English — Stage 6 A1 Reading Self-Study Upgrade: Three Existing Lessons

**Packet ID:** `SLE-S6-REA-A1-02-04-R1`  
**Created:** 2026-11-02  
**Status:** `ACADEMIC_REVIEW_PENDING` — standalone NotebookLM review source; not approved, imported or deployed.  
**Source:** immutable curriculum `1.18.0` (109 lessons / 913 activities), read from GitHub candidate blob `2f93506f673d9a82372750921fa69cbbae1ea353`.  
**Proposed future version:** TBD after review; no modifications to `1.18.0` source, 24 existing question IDs, original answers, historical attempts or scores.

## Why this batch exists

The Stage 6 coverage audit flagged all 15 Reading lessons as MCQ-only. Here we examined the **actual content** of three A1 Reading lessons (`REA-A1-02`, `REA-A1-03`, `REA-A1-04`), not merely their counts. Their original worked examples include exact details that reappear as scored answers, so a learner can succeed by copying the example instead of reading the passage. The changes below replace the entire learner-visible explanation and examples with **different mini-texts**, preserve the original assessment and supply self-study repair feedback.

**Four required teaching stages in every proposal:** (1) Goal/context, (2) strategy + independent worked demonstration, (3) existing independent scored practice, (4) specific feedback and optional new practice. Hints/evidence highlighting must remain optional. Reading comprehension is not a speaking or CEFR certification claim.

**Integration rule:** For a new approved immutable curriculum version, REPLACE `lesson.explanation` and `lesson.examples` for the three lesson IDs, never append the new models beneath the legacy leaking examples. The assessment passage and all eight original QIDs/keys per lesson remain exactly unchanged. Reviewer-only keys and rationales in this packet MUST NEVER be shown in the learner-facing pre-submission UI.

## Academic questions for NotebookLM

1. Do the replacement demonstrations avoid direct and semantic leakage of each **existing** quiz answer while still teaching a transferable reading strategy?
2. Are the new mini-texts, vocabulary and conditional reasoning appropriate to A1 students without parent help?
3. Does each explanation model the distinction between gist, details, changed plans, materials and deadlines clearly?
4. Do the optional hints and post-submission repairs support self-study without giving away answers before Submit?
5. Are any existing QIDs ambiguous, mislabeled or too difficult for A1? Flag with precise evidence; do not silently change their keys.
6. Can a learner understand each task on a mobile device? Are the bilingual support texts accurate and concise?
7. Is a short independent transfer exercise needed before the packet earns an academic PASS, or are the existing eight scored questions sufficient?
8. Separate `ACADEMIC_GO` from `PRODUCTION_GO`; the latter is NO until integration, regression and browser QA.

**Verdict format:** `PACKET_VERDICT = PASS / PASS_WITH_REQUIRED_CHANGES / FAIL`, per-lesson decision, required vs optional changes, answer-leak findings, self-study sufficiency, and academic/production GO decisions.

## REA-A1-02 — A class visit to the science museum (A1)

**Proposed disposition:** `ENHANCE` (subject to review)  
**Actual old-example problem:** Old worked examples directly reveal the assessed meeting time (8:30), departure time (8:45), required items and lunch provider; four of eight questions are substantially answered before submission.  
**Source reading asset:** `PASS-REA-A1-02`; keep the following original assessed passage unchanged.

> Class 6B is visiting the City Science Museum on Saturday. Everyone will meet at the school gate at eight thirty in the morning. The bus leaves at eight forty-five, so please arrive on time. Bring a small bottle of water, a notebook and a pencil. You do not need to bring lunch: the school will provide sandwiches and fruit. The museum visit begins with a short show about the planets. After that, students will explore the energy room in small groups. At noon, the group will eat in the museum garden. The bus will return to school at three o'clock. Parents can collect students at the main gate. If you cannot join the trip, please tell your class teacher by Thursday.

### Learner-facing replacement (stage 1–2)

**Goal/context:** Understand the main purpose of a simple trip notice. Find departure, meeting and return times without mixing them up. Identify what the school provides and what learners bring. Support answers with the appropriate sentence.

**English strategy:** A notice about a group visit may contain several different times. Read once for the purpose. On the next reading, put each time next to its action: meet, leave, return or tell. Do not choose a number until you know which action the question asks about. Also compare what visitors bring with what organisers provide. Look for the exact sentence before you answer; highlighting is optional.

**Vietnamese support:** Một thông báo chuyến đi có thể có nhiều mốc giờ khác nhau. Đọc lượt đầu để hiểu mục đích; lượt sau nối từng mốc với hành động: tập trung, xuất phát, trở về hoặc báo cho người phụ trách. Phân biệt đồ người tham gia phải mang và đồ ban tổ chức chuẩn bị. Không bắt buộc tô sáng văn bản.

**New worked examples (complete replacement; do not append):**

1. INDEPENDENT MINI-NOTICE (not the museum text): The nature club is taking a walk on Wednesday. Meet beside the gym at 9:10 a.m. The coach leaves at 9:25 a.m. Bring a hat; the organisers will provide drinking water. We return at 1:20 p.m. Tell Ms Hoa by Monday if you cannot join.
2. GIST · This is information about a nature-club outing, not a request to buy a ticket.
3. TIME STRATEGY · The group meets at 9:10, but the coach leaves at 9:25. Match the verb to the question; the first time is not automatically the departure time.
4. BRING/PROVIDE · Visitors bring a hat. Organisers provide drinking water. These are different responsibilities.
5. DEADLINE · By Monday describes the latest time to tell Ms Hoa; it is not the day of the outing.

### Independent practice (stage 3)

Keep **all eight existing questions and answer keys** in the new package. No question or scoring changes are authorised by this packet.

**Optional closed hint, before submit:** Find the verb in the question: meet, leave, bring, provide, see, eat or tell. Then reread the matching sentence in the assessed notice.

### Feedback and remediation (stage 4)

**After Submit only:** After submission, return to the assessed passage and mark the sentence that supports your answer. For wrong time answers, write two separate labels: MEET and LEAVE. For wrong material answers, make two columns: BRING and PROVIDED. Do not copy a model example as evidence for the quiz.

**Original existing question inventory (reviewer-only; do not show keys before Submit):**

| QID | Question | Existing options | Key | Existing feedback rationale | Existing tag |
| --- | --- | --- | :---: | --- | --- |
| `REA-A1-02-Q1` | What is the notice mainly about? | A. A science museum class trip / B. A regular school lunch menu / C. A new sports club / D. A cancelled science lesson | **A** | The first sentence introduces Class 6B's visit to the museum. | reading.gist |
| `REA-A1-02-Q2` | What time must students meet at the school gate? | A. 8:15 a.m. / B. 8:30 a.m. / C. 8:45 a.m. / D. 3:00 p.m. | **B** | The meeting time is eight thirty. Eight forty-five is when the bus leaves. | reading.detail |
| `REA-A1-02-Q3` | When does the bus leave for the museum? | A. 8:30 a.m. / B. 8:45 a.m. / C. 12:00 p.m. / D. 3:00 p.m. | **B** | The notice explicitly says the bus leaves at eight forty-five. | reading.detail |
| `REA-A1-02-Q4` | Which item should students bring? | A. A notebook and pencil / B. A full lunch box / C. A telescope / D. A school uniform for changing | **A** | The notice asks students to bring water, a notebook and a pencil. | reading.detail |
| `REA-A1-02-Q5` | What will the school provide? | A. A camera / B. A notebook / C. Sandwiches and fruit / D. Museum tickets for parents | **C** | The school provides sandwiches and fruit for lunch. | reading.detail |
| `REA-A1-02-Q6` | What will the group see first at the museum? | A. The energy room / B. A planet show / C. The museum shop / D. The garden | **B** | The visit begins with a short show about the planets. | reading.detail |
| `REA-A1-02-Q7` | Where will the students eat at noon? | A. At the school gate / B. In the bus / C. In the museum garden / D. In the energy room | **C** | The group will eat in the museum garden at noon. | reading.detail |
| `REA-A1-02-Q8` | What should a student do if they cannot attend? | A. Tell the teacher by Thursday / B. Arrive at school at noon / C. Ask the bus driver on Saturday / D. Bring a separate lunch | **A** | The final sentence asks students to tell their class teacher by Thursday. | reading.detail |

**Leakage audit note:** The model and assessed text are both outing notices, but no model sentence repeats the assessed times, place, equipment, food, show or deadline.


## REA-A1-03 — A message about an art-club visit (A1)

**Proposed disposition:** `ENHANCE` (subject to review)  
**Actual old-example problem:** Old examples disclose the assessed purpose, exact 9:30 meeting time, library meeting point, materials, rain plan and Thursday reply deadline, strongly leaking six or more of eight keys.  
**Source reading asset:** `PASS-REA-A1-03`; keep the following original assessed passage unchanged.

> Hi Minh,
> Our art club is meeting at the community hall on Saturday at 10 a.m. I planned to take the bus with you, but my father can give us a lift. Please meet me outside the school library at 9:30 a.m. Bring a pencil and your sketchbook. You don't need to bring paints because the club will provide them. We will design postcards for a local exhibition. After the activity, we can have lunch in the park if it is dry. If it rains, we will eat in the hall instead. I must leave by 2 p.m. to visit my grandmother. Could you reply by Thursday so I can tell the club leader how many people are coming?
> See you,
> Lan

### Learner-facing replacement (stage 1–2)

**Goal/context:** Identify the sender's purpose in a short personal message. Find an explicit meeting time and location. Distinguish items the reader must bring from items supplied by the club. Follow a simple changed plan and reply deadline.

**English strategy:** In a personal message, find who is writing and what they want the reader to do. Separate the event's start time from the time friends meet. Watch but for a changed idea, if for a condition and by for a reply deadline. Do not assume that a possible plan is already confirmed. For each answer, match the question to a full phrase in the message. Underlining is optional.

**Vietnamese support:** Trong tin nhắn, xác định người viết và việc người nhận cần làm. Phân biệt giờ bắt đầu hoạt động với giờ hẹn gặp. But báo thay đổi ý định; if nêu điều kiện; by là hạn trả lời. Kế hoạch có thể thực hiện chưa chắc đã được xác nhận. Gạch chân chỉ là hỗ trợ tùy chọn.

**New worked examples (complete replacement; do not append):**

1. INDEPENDENT MINI-MESSAGE (not the art-club text): Hi Sam! The cooking workshop starts on Sunday at 11:00. Let's meet near the fountain at 10:40. Please bring a clean apron; the organisers have bowls. We can sit outside if the weather is warm, but stay indoors if it is windy. Please reply by Tuesday. See you, Jo.
2. PURPOSE · Jo is arranging a cooking workshop with Sam.
3. TWO TIMES · The workshop begins at 11:00; the friends meet at 10:40. Read the verb attached to each time.
4. BRING/PROVIDE · Sam brings an apron, while the organisers supply bowls.
5. CONDITION/DEADLINE · If it is windy, the plan changes to indoors; by Tuesday sets a reply deadline.

### Independent practice (stage 3)

Keep **all eight existing questions and answer keys** in the new package. No question or scoring changes are authorised by this packet.

**Optional closed hint, before submit:** Is the question about the activity, meeting point, materials, changed plan or reply deadline? Look for starts, meet, bring, provide, if, but or by.

### Feedback and remediation (stage 4)

**After Submit only:** After submission, identify the exact sentence in the assessed message. If you confused the event time with the meeting time, label both. If you treated 'can' as a final decision, compare it with language such as 'will'. If a condition changes a plan, read both parts of the if-sentence.

**Original existing question inventory (reviewer-only; do not show keys before Submit):**

| QID | Question | Existing options | Key | Existing feedback rationale | Existing tag |
| --- | --- | --- | :---: | --- | --- |
| `REA-A1-03-Q1` | Why does Lan write to Minh? | A. To arrange their visit to an art-club activity / B. To arrange lunch only, not the club visit / C. To ask Minh to buy paints for the club / D. To announce that the library meeting place has changed to the park | **A** | Lan's main purpose is to arrange an art-club visit and receive Minh's reply. Lunch and supplies are supporting details; the message says the club provides paints and the meeting place is still the library. | reading.gist |
| `REA-A1-03-Q2` | Where should Minh meet Lan? | A. Inside the community hall / B. Outside the school library / C. At Minh's home / D. In the city park | **B** | The message explicitly gives outside the school library as their meeting point. | reading.detail |
| `REA-A1-03-Q3` | When should the two friends meet? | A. At 9:30 a.m. / B. At 10:00 a.m. / C. At 2:00 p.m. / D. At 8:30 a.m. | **A** | The meeting is at 9:30 a.m., before the club starts at 10 a.m. | reading.detail |
| `REA-A1-03-Q4` | What alternative to taking the bus does Lan mention? | A. Taking a train / B. Walking alone / C. Her father can give them a lift / D. A bus supplied by the art club | **C** | Lan says her father can give them a lift. Can describes an available alternative; the message does not confirm a final travel decision or state a vehicle type. | reading.detail |
| `REA-A1-03-Q5` | Which items should Minh bring? | A. Paints and a chair / B. A pencil and sketchbook / C. A camera and lunch / D. A new uniform and shoes | **B** | The message asks Minh to bring a pencil and his sketchbook. | reading.detail |
| `REA-A1-03-Q6` | Does Minh need to bring paints? | A. Yes, he must buy new paints. / B. No, the club will provide them. / C. Yes, because the club has no paints. / D. No, because nobody will paint or draw. | **B** | The message states the club provides the paints, so bringing them is unnecessary. | reading.detail |
| `REA-A1-03-Q7` | What will happen if it rains after the activity? | A. They will eat in the hall. / B. They will eat in the park anyway. / C. The friends must return to school immediately. / D. The event starts two hours earlier. | **A** | The conditional plan says they will eat in the hall if it rains. | reading.detail |
| `REA-A1-03-Q8` | What is the latest day Lan asks Minh to reply? | A. Saturday / B. Friday / C. Thursday / D. Sunday | **C** | The message says reply by Thursday so Lan can confirm numbers with the leader. | reading.detail |

**Leakage audit note:** The new mini-message uses a cooking workshop, Sunday, a fountain, an apron, bowls, windy weather and Tuesday; none of the art-club quiz-specific times, places, materials or deadline are modelled.


## REA-A1-04 — Friday timetable and a room change (A1)

**Proposed disposition:** `ENHANCE` (subject to review)  
**Actual old-example problem:** Old worked examples reproduce assessed Room 12, Room 15, Lab 1, Science notebook, Thursday deadline and main purpose; they disclose key answers for most questions.  
**Source reading asset:** `PASS-REA-A1-04`; keep the following original assessed passage unchanged.

> FRIDAY CLASS NOTICE
> On Friday, Class 6B has English from 8:00 to 8:45 in Room 12. At 9:00, students will go to the school library for a short reading activity. The library activity ends at 9:40. Science usually starts at 10:00 in Lab 1, but this Friday it will take place in Room 15 because Lab 1 is closed for cleaning. Please bring your science notebook, but leave the large experiment box at home. After lunch, art club begins at 1:30 p.m. in the community hall. Students who want to join art club should write their names on Ms Lan’s list before Thursday afternoon. Parents can collect students outside the school gate at 3:00 p.m.

### Learner-facing replacement (stage 1–2)

**Goal/context:** Read a simple school notice for times, places and instructions. Distinguish the normal timetable from one stated exception. Identify an activity deadline. Match each answer to explicit evidence in the notice.

**English strategy:** A timetable notice may describe the normal plan and a special change. First identify the day or event. Next read each time, place and instruction with its activity. Words such as usually, but and this week help you choose the current plan instead of the old one. Notice deadlines separately from event times. For each question, use the whole sentence rather than a familiar number. Highlighting is optional.

**Vietnamese support:** Thông báo lịch học có thể nêu lịch thông thường và thay đổi đặc biệt. Hãy nối giờ, địa điểm và hướng dẫn với đúng hoạt động. Usually/but/this week giúp phân biệt lịch cũ với lịch mới. Hạn đăng ký không phải giờ bắt đầu hoạt động. Không bắt buộc đánh dấu bằng chứng.

**New worked examples (complete replacement; do not append):**

1. INDEPENDENT MINI-NOTICE (not the Friday class text): MONDAY SPORTS UPDATE. Basketball usually meets on Court A at 2:15 p.m., but this Monday it will meet on Court C because Court A is being repaired. Bring trainers; leave heavy bags at home. To join the swimming group, add your name to the list by Sunday evening.
2. GIST · The message changes one part of Monday's sports activities.
3. NORMAL VS UPDATED · Court A is the usual place; Court C is the correct place for this Monday.
4. REASON · The change happens because Court A is being repaired.
5. ACTION/DEADLINE · Bring trainers, leave heavy bags at home and join the swimming list by Sunday evening.

### Independent practice (stage 3)

Keep **all eight existing questions and answer keys** in the new package. No question or scoring changes are authorised by this packet.

**Optional closed hint, before submit:** Find the activity named in the question, then choose the information after but / this week for an exception. Check whether a time is for an event, a deadline or collection.

### Feedback and remediation (stage 4)

**After Submit only:** After submission, compare the normal plan with the special plan in two columns. If you chose the normal room, reread the phrase after 'but this Friday'. For instruction errors, separate BRING, LEAVE and SIGN UP. Use only the assessed notice as evidence.

**Original existing question inventory (reviewer-only; do not show keys before Submit):**

| QID | Question | Existing options | Key | Existing feedback rationale | Existing tag |
| --- | --- | --- | :---: | --- | --- |
| `REA-A1-04-Q1` | What is the main purpose of the notice? | A. To explain Friday’s school schedule and changes / B. To advertise a new restaurant / C. To announce that school is closed all week / D. To describe a holiday trip | **A** | The notice lists Friday activities, rooms, required items and one change. | reading.gist |
| `REA-A1-04-Q2` | Where is the English lesson? | A. Room 12 / B. Room 15 / C. Lab 1 / D. The community hall | **A** | The notice states that English is in Room 12. | reading.detail |
| `REA-A1-04-Q3` | What happens at 9:00? | A. Students go to the school library. / B. Science begins in Lab 1. / C. Art club begins. / D. Parents collect students. | **A** | The reading activity in the library begins at 9:00. | reading.detail |
| `REA-A1-04-Q4` | Where will Science take place THIS Friday? | A. Lab 1 / B. Room 12 / C. Room 15 / D. The library | **C** | Lab 1 is closed for cleaning; Science moves to Room 15. | reading.detail |
| `REA-A1-04-Q5` | Why is Science in a different room? | A. Lab 1 is being cleaned. / B. The teacher is away. / C. Students have a school trip. / D. Room 12 is too small. | **A** | The notice gives cleaning as the reason for the room change. | reading.detail |
| `REA-A1-04-Q6` | Which item should students bring for Science? | A. Their science notebook / B. The large experiment box / C. Art paints / D. A football | **A** | The notice says to bring the science notebook and leave the experiment box at home. | reading.detail |
| `REA-A1-04-Q7` | What must an interested student do before Thursday afternoon? | A. Write their name on Ms Lan’s list. / B. Arrive at the hall at 3:00 p.m. / C. Bring an experiment box. / D. Send a payment receipt. | **A** | The sign-up deadline for art club is before Thursday afternoon. | reading.detail |
| `REA-A1-04-Q8` | When can parents collect students? | A. Friday at 8:00 a.m. / B. Friday at 9:40 a.m. / C. Friday at 1:30 p.m. / D. Friday at 3:00 p.m. | **D** | The final sentence says collection is outside the gate at 3:00 p.m. | reading.detail |

**Leakage audit note:** The new example has different day, activity, courts, reason, items and deadline. No existing assessed room number, time or material is repeated.

## Deterministic source/content QA (2026-11-02)

- PASS: all three source lesson IDs found; exactly 8 objective questions each (24 QIDs), all unique.
- PASS: every existing key ID resolves to one of the original options; no answers, keys or original question objects have been changed.
- PASS: each new replacement example set has at least four teaching blocks and a different independent mini-text.
- PASS (limited literal check): no complete existing correct-option text of more than eight characters appears verbatim in the new worked-example blocks. This **does not prove** zero semantic leakage; NotebookLM must judge meaning and test actual learner UI.
- NOT RUN: curriculum import validator, TypeScript/build, browser preview, mobile QA, historical-attempt version-resolution, deployment. This is Markdown authoring on the content branch only.
- NOT RUN: independent academic review. `ACADEMIC_REVIEW_PENDING`.

## Integration and preservation checklist

- Version a full cumulative curriculum candidate only after academic review; do not treat this Markdown packet as importable JSON.
- Replace both `explanation` and `examples` in a **new** version for each lesson, with no old example cards left in any other UI path.
- Preserve source reading passages, stable lesson/QIDs, existing option order/key mapping, skill tags, feedback keys, evidence weights, prior attempts and v1.18.0 hashes.
- Ensure learner-facing worked examples appear before practice, but the reviewer-only answer table is never rendered.
- Verify no model mini-text is accidentally substituted for the assessed passage.
- Confirm optional hints do not become mandatory and no evidence-highlight requirement blocks submission.
- Run full English-only QA in the separate release-staging workstream after academic PASS; no Math, Firebase or learner-history changes.
