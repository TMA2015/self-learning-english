# SLE Reading Knowledge v2.3 — Pilot R0

Packet ID: SLE-REA-KNOWLEDGE-V23-PILOT-R0-20261125
Date: 2026-11-25 | Status: AUTHORING ONLY — INDEPENDENT REVIEW PENDING
Base: curriculum 1.28.0, Git blob `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`; LIVE code commit `3c6642d2fc588f1f73c475b06958f70671373dba` (Vocabulary routing corrective release).
Scope: REA-A1-01, REA-A2-05, REA-B1-03; 3 of 41 Reading lessons; 26 existing scored items compared. This is a proposal for a reusable Knowledge template, not new assessed material or an import package. Reading inventory: A1 9 lessons/55 items; A2 12/90; B1 10/72; B2 9/52; C1 1/8; total 41/277.

## Review contract

Use current permanent project sources. Preserve the exact versioned assessed passages, question IDs, prompts, ordered options, keys, feedback and evidence weights in Appendix B. Appendix B is reviewer-only and must never appear in Knowledge. The proposed learning content below uses independent miniature texts with distinct facts and situations. No assessed passage annotation, paraphrased answer, answer mapping, question-specific hint, or exposed scoring keys. Strategies may naturally generalise to the assessed skill; that alone is not answer leakage. All model, quick checks and transfer tasks are optional, unscored, evidence weight 0; no submissions, saved attempts or CEFR evidence. Open text uses a hidden model and criteria, not deterministic semantic grading. Only a selected quick-check option reveals its own feedback; model explanations in worked examples are visible after the relevant lens is selected, as deliberate instruction. No paid AI or new dependencies.

### Shared six-section template
1. Learning goal/context, aligned to canonical objectives but with no source-specific answers.
2. Reading strategy cards: 3–4 concise steps, EN default, optional VI explanation. A1 simple concrete instructions; A2 compare facts/conditions; B1 distinguish claim, reasons, concession and inference. B2/C1 later require additional argument/evidence scaffolds and separate review.
3. Independent worked text, labelled sentence IDs; learner selects a reading lens to highlight exact sentence(s), then sees the explanation. Highlight is not color-only: selected label + sentence identifier; no assessed text used.
4. Worked question: compare options against evidence; explain correct answer and each distractor. Distinguish stated facts, supported inference and not given.
5. Two quick checks using a second independent mini-text; options and feedback EN/VI; no correct answer exposed before selection. Retry permitted without evidence or score.
6. Independent transfer with a third new text and explicit response criteria; optional typed response stays in the mounted page only; model hidden until requested; no automatic grading.

Implementation acceptance later: current approved Knowledge by default even with older scored/draft attempts, archived notes optional; Practice retains its version, question order, answers, results and draft editability. Read-only source for Knowledge; no new attempt merely to view it. Include actual Foundation browser-local route tests for historical scored, historical draft and no-attempt paths, 375/768/960 widths, plus real device/owner acceptance. English-first and VI toggle apply consistently; responsive text, keyboard-accessible lenses/options, no horizontal overflow. Academic PASS is not technical/release PASS.

## Appendix A — Proposed learner-visible Knowledge (all evidence weight 0)

### REA-A1-01 — Read a short notice
**Goal EN:** Find the purpose of a short notice, its important details and a condition. Check the exact words before deciding.
**Goal VI:** Tìm mục đích, thông tin quan trọng và điều kiện trong thông báo ngắn. Đối chiếu từ ngữ trước khi chọn.
**Context EN:** A notice tells readers what is happening and what they need to know or do.
**Context VI:** Thông báo cho người đọc biết sự việc và những điều cần biết hoặc cần làm.

#### Strategy cards
- Gist / Ý chính: Read the whole notice once. Ask: What is this notice for? / Đọc toàn bộ một lượt. Hỏi: Thông báo này nhằm mục đích gì?
- Scan / Tìm nhanh: Look for the type of detail you need: a place, time, object or action. Read the words around it. / Tìm đúng loại thông tin: địa điểm, thời gian, đồ vật hoặc hành động. Đọc các từ xung quanh.
- Conditions / Điều kiện: Notice words such as only, if and not. They can change the meaning. / Chú ý only, if và not vì chúng có thể thay đổi ý nghĩa.
- Verify / Đối chiếu: Point to the line that supports your answer. If the text does not tell you, do not guess. / Chỉ ra câu làm bằng chứng. Không đoán nếu văn bản không cho biết.

#### Interactive worked text — independent model: Library drop box
S1. The town library has a new book-return box by the front door.
S2. You can use the box when the library is closed.
S3. Put library books in the box, but take DVDs to the desk when the library opens.
S4. Please do not leave your own books in the box.
Lens PURPOSE → S1: The notice introduces a return service. / Câu này giới thiệu dịch vụ trả sách.
Lens PLACE → S1: “by the front door” names the location. / Cụm này chỉ vị trí.
Lens CONDITION → S2, S3, S4: Check when the box can be used, what goes in it, and what must not go in it. / Xem khi nào dùng hộp, đồ vật nào được bỏ vào và đồ vật nào không được bỏ vào.

#### Worked question
A reader has a library DVD. What should they do?
A. Put it in the box. B. Take it to the desk when the library opens. C. Leave it beside the front door.
Model answer B. Evidence S3. A ignores the contrast after “but”; C confuses the location of the box with a permitted action.
VI: B đúng theo S3. A bỏ qua phần đối lập sau “but”; C nhầm vị trí của hộp với hành động được phép. The notice does not give the opening hour; do not invent one.

#### Quick checks — independent text: Park fountain
T1. The drinking fountain near the park gate is closed for repairs today.
T2. Visitors can use the fountain beside the café instead.
T3. The café sells drinks, but you do not have to buy one to use the fountain.
QC REA-A1-01-KQC01: What is the notice mainly for?
- A. To announce a new café. — Incorrect: the café is a location, not the reason for the notice. / Quán là mốc vị trí, không phải mục đích thông báo.
- B. To tell visitors about a closed fountain and an alternative. — Correct: T1 and T2 together give the purpose. / T1 và T2 cùng cho biết mục đích.
- C. To ask visitors to buy drinks. — Incorrect: T3 says purchase is not required. / T3 nói không bắt buộc mua.
Key B.
QC REA-A1-01-KQC02: Must a visitor buy a drink to use the other fountain?
- A. Yes, everyone must buy one. — Incorrect: “do not have to” means it is not required. / “Do not have to” nghĩa là không bắt buộc.
- B. Only children must buy one. — Incorrect: no special rule for children is stated. / Không có quy định riêng cho trẻ em.
- C. No. — Correct: T3 explicitly says a purchase is unnecessary. / T3 nói rõ không cần mua.
Key C.

#### Transfer — OPEN_UNSCORED
U1. The lift in the community centre is not working this morning. U2. Please use the stairs next to the reception desk. U3. If you cannot use the stairs, ask the receptionist for help.
Prompt EN: Write the purpose of the notice, where the stairs are, and what a visitor who cannot use stairs should do. Give one sentence ID as evidence for each.
VI: Viết mục đích thông báo, vị trí cầu thang và cách xử lý nếu khách không thể đi cầu thang. Ghi mã câu làm bằng chứng.
Criteria: purpose + location + conditional action, each grounded in U1–U3; no invented repair time or alternative route.
Hidden model EN: The notice tells visitors about a lift problem (U1) and what to do instead (U2–U3). The stairs are next to reception (U2). A visitor who cannot use them should ask the receptionist for help (U3).
Hidden model VI: Thông báo cho biết thang máy gặp sự cố và hướng dẫn cách xử lý (U1–U3). Cầu thang cạnh quầy lễ tân (U2). Người không thể đi cầu thang nên nhờ lễ tân giúp (U3).

### REA-A2-05 — Compare practical details across two notices
**Goal EN:** Compare two options using stated details and requirements. Choose an option only when the evidence supports all relevant needs.
**Goal VI:** So sánh hai lựa chọn dựa trên thông tin và yêu cầu được nêu. Chỉ chọn khi bằng chứng đáp ứng các nhu cầu liên quan.
**Context EN:** Two offers may look similar but differ in practical details and conditions.
**Context VI:** Hai lựa chọn có vẻ giống nhau nhưng có thể khác về thông tin và điều kiện thực tế.

#### Strategy cards
- Build columns / Lập cột: Put each source in its own column. Keep comparable facts on the same row. / Đặt mỗi nguồn vào một cột; thông tin cùng loại nằm cùng hàng.
- Read the small words / Đọc từ chỉ điều kiện: Separate must, may, if and included. Do not turn permission or an option into a requirement. / Phân biệt bắt buộc, được phép, điều kiện và thứ đã bao gồm; không biến lựa chọn thành yêu cầu.
- Apply constraints / Áp dụng ràng buộc: List the reader's needs first. Test every relevant one, not just the first match. / Liệt kê nhu cầu trước, kiểm tra từng điều kiện liên quan chứ không chỉ điều kiện đầu.
- Explain from both / Giải thích từ hai nguồn: Cite the relevant source(s); say “not stated” when a needed detail is absent. / Dẫn nguồn phù hợp; nói “không nêu” nếu thiếu dữ kiện.

#### Interactive worked text — independent model: Two community tours
Source A: S1. The river tour leaves at 10:00 and takes 45 minutes. S2. It costs £6; a guidebook is included. S3. Children under 12 must be with an adult.
Source B: S4. The history walk leaves at 11:00 and takes 30 minutes. S5. It costs £4; visitors may buy a guidebook for £2. S6. Children under 12 must also be with an adult.
Lens TIME → S1, S4: Compare departure with departure and duration with duration. / So sánh giờ xuất phát với nhau và thời lượng với nhau.
Lens COST → S2, S5: The guidebook is part of A's price but optional at extra cost in B. / Sách hướng dẫn đã gồm trong giá A; ở B có thể mua thêm.
Lens CONDITION → S3, S6: Both sources state the same age condition; do not invent a difference. / Cả hai nguồn có cùng điều kiện tuổi; không tự tạo khác biệt.
Worked comparison table (from model only): departure 10:00 | 11:00; duration 45 min | 30 min; basic price £6 | £4; guidebook included | optional £2; under 12 accompanied | accompanied. VI row labels: giờ xuất phát; thời lượng; giá cơ bản; sách hướng dẫn; điều kiện dưới 12 tuổi.

#### Worked question
An adult wants a trip leaving before 11:00 with a guidebook and a budget of £6. Which fits all three needs?
A. River tour. B. History walk. C. Both.
Model answer A: S1 and S2 establish all three conditions. B meets the price including optional book (S5) but fails the departure requirement (S4). C fails because B fails one constraint.
VI: A đáp ứng cả ba điều kiện theo S1–S2. B có thể mua thêm sách trong ngân sách nhưng xuất phát lúc 11:00, không phải trước 11:00. Vì vậy C sai.

#### Quick checks — independent text: Two bicycle rentals
T1. Shop North offers a bicycle for two hours for £8. T2. A helmet is included, but lights cost £2 extra.
T3. Shop South offers a bicycle for one hour for £5. T4. A helmet and lights are both included.
QC REA-A2-05-KQC01: Which shop offers two hours of bicycle use for no more than £8 if lights are not needed?
- A. South only. — Incorrect: South offers one hour (T3). / South chỉ cho thuê một giờ.
- B. Both. — Incorrect: South does not meet the duration requirement. / South không đáp ứng thời lượng.
- C. North only. — Correct: T1 gives two hours at £8. / T1 cho biết hai giờ với giá £8.
Key C.
QC REA-A2-05-KQC02: Which statement is supported by the notices?
- A. North includes lights at no extra cost. — Incorrect: T2 states a £2 extra charge. / T2 nói đèn mất thêm £2.
- B. South includes a helmet and lights in its price. — Correct: T4 explicitly says both are included. / T4 nêu rõ cả hai đã bao gồm.
- C. South rents bicycles for any number of hours. — Incorrect: only a one-hour offer is stated. / Chỉ nêu gói một giờ.
Key B.

#### Transfer — OPEN_UNSCORED
U1. The morning ferry leaves at 9:00, costs £7 and carries bicycles for £2 extra. U2. The afternoon ferry leaves at 14:00, costs £6 and does not carry bicycles. U3. Both journeys take 25 minutes.
Prompt EN: A traveller with a bicycle must arrive before noon and has £10. Recommend an option and explain why the other does not fit. Cite sentence IDs and calculate any extra cost.
VI: Khách có xe đạp cần đến trước buổi trưa, ngân sách £10. Đề xuất một lựa chọn, giải thích vì sao lựa chọn còn lại không phù hợp; dẫn mã câu và tính chi phí thêm.
Criteria: apply time including stated journey duration, bicycle rule and total cost; cite both sources; no assumptions about other departures.
Hidden model EN: The morning ferry fits: it arrives at 9:25 (U1, U3), carries bicycles and costs £9 in total (£7 + £2, U1). The afternoon ferry arrives too late and cannot carry bicycles (U2, U3).
Hidden model VI: Chuyến sáng phù hợp: đến lúc 9:25 (U1, U3), chở xe đạp và tổng giá £9 (U1). Chuyến chiều đến quá muộn và không chở xe đạp (U2, U3).

### REA-B1-03 — Read a qualified viewpoint
**Goal EN:** Identify a balanced claim, its supporting reason and limitation; infer a conclusion that stays within the evidence.
**Goal VI:** Xác định quan điểm có điều kiện, lý do hỗ trợ và giới hạn; suy luận kết luận không vượt quá bằng chứng.
**Context EN:** Writers can support an idea without claiming it works in every situation.
**Context VI:** Người viết có thể ủng hộ một ý tưởng mà không khẳng định ý tưởng đó đúng trong mọi hoàn cảnh.

#### Strategy cards
- Claim / Luận điểm: Ask what overall position the writer wants readers to accept, rather than picking an interesting example. / Hỏi người viết muốn người đọc chấp nhận quan điểm chung nào, không chỉ chọn ví dụ nổi bật.
- Reason and example / Lý do và ví dụ: A reason explains why; an example illustrates it. Neither automatically proves a universal claim. / Lý do giải thích vì sao; ví dụ minh họa. Cả hai không tự động chứng minh điều đúng với mọi trường hợp.
- Qualification / Giới hạn: Words such as although, yet, may and in some cases constrain a claim. Keep their force when summarising. / Các từ although, yet, may và in some cases giới hạn luận điểm. Giữ mức độ chắc chắn khi tóm tắt.
- Evidence-led inference / Suy luận dựa trên bằng chứng: Combine relevant clues, test a competing interpretation and reject a conclusion stronger than the source. / Kết hợp dấu hiệu liên quan, kiểm tra cách hiểu khác và loại kết luận mạnh hơn nguồn.

#### Interactive worked text — independent model: Reusable packaging
S1. A local market could reduce single-use packaging by offering reusable containers.
S2. Customers who return a container can use it again without buying another one.
S3. Although this approach may reduce waste, it requires a place to wash and store containers safely.
S4. The market should try the scheme with a small group of stalls before expanding it.
Lens CLAIM → S1, S4: The writer supports a limited trial of reusable containers, not immediate expansion. / Người viết ủng hộ thử nghiệm nhỏ, không phải mở rộng ngay.
Lens REASON → S2: Reuse is the stated mechanism; the passage gives no measured waste figures. / Tái sử dụng là cơ chế được nêu; đoạn không có số liệu rác đo được.
Lens QUALIFICATION → S3: A possible benefit is constrained by washing and storage requirements. / Lợi ích có thể đạt được nhưng bị giới hạn bởi yêu cầu vệ sinh và lưu trữ.
Lens INFERENCE → S3, S4: A trial could help establish whether the arrangement is workable; this is an inference, not a reported trial result. / Thử nghiệm có thể giúp đánh giá tính khả thi; đây là suy luận, không phải kết quả đã ghi nhận.

#### Worked question
Which summary is best supported?
A. Reusable containers will eliminate all market waste. B. The market should test reusable containers on a small scale because they may reduce waste but need suitable facilities. C. The writer rejects reusable containers because they must be washed. D. A trial has already proved that the scheme works.
Model answer B. S1 and S4 support the qualified recommendation; S2 gives a mechanism, S3 a practical limit. A changes “may” into certainty and exaggerates scope; C treats a limitation as rejection; D invents a completed trial.
VI: B giữ được đề xuất thử nghiệm và điều kiện. A tuyệt đối hóa lợi ích; C nhầm giới hạn với phản đối; D bịa kết quả thử nghiệm đã hoàn thành.

#### Quick checks — independent text: Repairing a public clock
T1. Repairing the town's old clock would preserve a familiar landmark. T2. Yet repair costs are uncertain because the internal parts have not been inspected. T3. The council should obtain an estimate before approving the work.
QC REA-B1-03-KQC01: What is the writer's position?
- A. Repair has no value. — Incorrect: T1 gives a benefit. / T1 nêu lợi ích.
- B. Repair should be approved immediately at any cost. — Incorrect: T2–T3 require a cost estimate first. / T2–T3 yêu cầu dự toán trước.
- C. Repair has a benefit, but the council should check likely costs first. — Correct: combines T1, T2 and T3. / Kết hợp đúng T1, T2, T3.
Key C.
QC REA-B1-03-KQC02: What does “Yet” do in T2?
- A. It introduces a limitation to the benefit described in T1. — Correct: uncertain costs limit the proposal. / Chi phí chưa chắc chắn giới hạn đề xuất.
- B. It proves the clock cannot be repaired. — Incorrect: the text states uncertainty, not impossibility. / Nguồn nêu sự chưa chắc chắn, không phải không thể sửa.
- C. It introduces the exact repair price. — Incorrect: no exact price is given. / Không có giá cụ thể.
Key A.

#### Transfer — OPEN_UNSCORED
U1. Planting trees along a busy street could make walking more pleasant in summer. U2. However, some sections have narrow pavements, so trees must not block access. U3. The council proposes inspecting the street before selecting planting locations.
Prompt EN: Summarise the writer's qualified recommendation in two sentences. Identify a supporting reason, a limitation and a cautious next step; cite the sentence IDs. State one conclusion the passage does not justify.
VI: Tóm tắt đề xuất có điều kiện trong hai câu. Xác định lý do, giới hạn và bước tiếp theo thận trọng; dẫn mã câu. Nêu thêm một kết luận nguồn không cho phép rút ra.
Criteria: preserve “could”; reason U1, access constraint U2 and proposed inspection U3; do not claim planting is approved, completed, or proven to reduce temperature.
Hidden model EN: Planting trees could improve summer walking conditions (U1), provided access is not blocked (U2). The council proposes inspecting the street before choosing sites (U3). The text does not establish that trees have already been planted.
Hidden model VI: Trồng cây có thể giúp việc đi bộ mùa hè dễ chịu hơn (U1), với điều kiện không cản lối đi (U2). Hội đồng đề xuất khảo sát đường trước khi chọn vị trí (U3). Văn bản không chứng minh cây đã được trồng.

## Appendix B — Reviewer-only frozen assessed source

Every item below is `single_choice`, evidence_weight 1. Options are in canonical A/B/C/D order, followed by canonical correct_option_id and explanation_en. This appendix is never rendered in Knowledge. Canonical source is the immutable blob above; transcription is for review, not a replacement seed. Compare the proposed teaching and all learner-visible feedback/models against every listed item.

### REA-A1-01 — A new art club at school
Objectives: Understand the main purpose of a short school notice. / Find useful details by matching the question to the meaning of the text. / Notice small conditions that change what a notice means. / Understand explicit details and simple paraphrased conditions without adding unstated facts.
Asset PASS-REA-A1-01 — Art club notice (display_to_learner true):
Our school has a new art club. It meets in Room 12 on Wednesdays after class. The club starts at three thirty and finishes at four thirty. Ms Hoa helps students draw, paint and make posters. You do not need to bring paint because the club has art materials. Bring your own pencil and a small notebook. Last week, eight students joined. They made colourful signs for the school garden. This week, the group will design a poster about saving water. New students can join at any time. To register, write your name on the list outside the library before Wednesday lunch.

- REA-A1-01-Q1: What is the main purpose of the notice? | A To sell art materials | B To invite students to an art club | C To announce a school holiday | D To move the library | Key B | The notice explains what the new club does and how students can join.
- REA-A1-01-Q2: Where does the club meet? | A Room 12 | B The canteen | C The sports field | D Room 30 | Key A | The second sentence identifies Room 12.
- REA-A1-01-Q3: On which day does the club meet? | A Monday | B Tuesday | C Wednesday | D Friday | Key C | The club meets on Wednesdays after class.
- REA-A1-01-Q4: What time does the club finish? | A 12:00 | B 15:00 | C 15:30 | D 16:30 | Key D | The notice says it finishes at four thirty, or 16:30.
- REA-A1-01-Q5: What should a new student bring? | A Paint and brushes only | B A pencil and a notebook | C A football and trainers | D A bottle of glue only | Key B | Paint is provided; a personal pencil and notebook are requested.
- REA-A1-01-Q6: What did students make last week? | A Posters about saving water | B Signs for the school garden | C Library cards | D New school uniforms | Key B | Last week's work was colourful garden signs; this week's poster has a different topic.
- REA-A1-01-Q7: Can someone join if they missed the first week? | A Yes, new students may join at any time. | B No, only the first eight students may join. | C Only if they bring paint. | D Only at the end of the year. | Key A | The notice explicitly welcomes new students at any time.
- REA-A1-01-Q8: How can students register? | A Phone Ms Hoa after school | B Write their name outside the library before Wednesday lunch | C Send a letter to the gym | D Tell the canteen worker | Key B | The last sentence gives the registration location and deadline.

### REA-A2-05 — Two club updates: compare practical details
Objectives: Find practical details in two short school notices. / Compare times, places and requirements across the notices. / Choose the best option for a simple learner need using textual evidence.
Asset TXT-CLUB-UPDATES-A2 — Club updates for next week (display_to_learner true):
Two clubs have changed their plans for next week. The Photography Club will now meet on Tuesday in Room 18 from 3:30 to 4:30. Students should bring a phone or camera if possible, but the club will provide paper for notes. New members are welcome and do not need to register before the meeting. The Cooking Club will meet on Wednesday in the school kitchen from 4:00 to 5:30. Students must register by Monday because the kitchen has only twelve places. They do not need to bring ingredients, but they should bring a notebook. Both clubs are free this month.

- REA-A2-05-Q1: Why was this text written? | A To give updated information about two clubs | B To explain how to cook a meal | C To describe a photography competition | D To compare two school subjects | Key A | The text gives changed times, places and requirements for two clubs.
- REA-A2-05-Q2: When does the Photography Club meet? | A Tuesday, 3:30–4:30 | B Wednesday, 4:00–5:30 | C Monday, 3:30–4:30 | D Tuesday, 4:00–5:30 | Key A | The Photography Club meets on Tuesday from 3:30 to 4:30.
- REA-A2-05-Q3: Where does the Cooking Club meet? | A In the school kitchen | B In Room 18 | C In the library | D In the sports hall | Key A | The Cooking Club meets in the school kitchen.
- REA-A2-05-Q4: Which club requires students to register before attending? | A Cooking Club | B Photography Club | C Both clubs | D Neither club | Key A | Cooking Club students must register by Monday.
- REA-A2-05-Q5: What should Cooking Club students bring? | A A notebook | B Ingredients | C A camera | D Paper for notes | Key A | The notice says ingredients are provided, but students should bring a notebook.
- REA-A2-05-Q6: Which club finishes later? | A Cooking Club | B Photography Club | C They finish at the same time | D The text does not say | Key A | Cooking Club finishes at 5:30; Photography Club finishes at 4:30.
- REA-A2-05-Q7: A student is free only on Tuesday and does not want to register in advance. Which club fits best? | A Photography Club | B Cooking Club | C Both clubs | D Neither club | Key A | Photography Club is on Tuesday and new members do not need to register first.
- REA-A2-05-Q8: What does 'provide' mean in 'the club will provide paper for notes'? | A give or make available | B ask students to buy | C remove | D write on | Key A | Provide means give or make something available for use.

### REA-B1-03 — Should study apps plan every session?
Objectives: Identify the writer's balanced main claim in a viewpoint text. / Distinguish supporting details from qualifications and limitations. / Infer the meaning and purpose of language used to qualify a claim.
Asset TXT-STUDY-APPS-B1 — Should study apps plan every session? (display_to_learner true):
Study apps can make it easier to organise homework. A learner can record a deadline, divide a large task into smaller steps and receive reminders before work is due. Some apps also show how much time has been spent on different subjects. These features can be useful, especially when several assignments have to be managed at once. However, an app cannot always decide what a learner should do next. A difficult maths problem may need more time than the original plan allowed, while a familiar vocabulary exercise may take less. Learners also differ: one person may work well with frequent reminders, while another may find them distracting. For this reason, a study plan should be treated as a guide rather than a set of fixed instructions. Checking progress is still valuable, but learners need to adjust the plan when the evidence changes. An app can support that process by making deadlines and study patterns visible. The final decision, though, still belongs to the learner.

- REA-B1-03-Q1: Which statement best represents the writer's main view? | A Study apps are useful planning tools, but learners still need to adjust their own plans. | B Study apps should make every decision for the learner. | C Reminders are harmful for every learner. | D Paper plans are always better than digital tools. | Key A | The writer supports study apps as tools but repeatedly limits what they should decide.
- REA-B1-03-Q2: Which feature does the writer say some apps provide? | A A record of time spent on different subjects | B Automatic answers to difficult maths questions | C A guarantee that homework will be easy | D A teacher for every subject | Key A | The first paragraph states that some apps show time spent on different subjects.
- REA-B1-03-Q3: Why might a difficult maths problem change the original plan? | A It may need more time than expected. | B Maths deadlines cannot be recorded. | C Apps do not allow maths homework. | D Every learner finishes maths at the same speed. | Key A | The writer directly says a difficult maths problem may need more time than planned.
- REA-B1-03-Q4: What does the text say about reminders? | A They may help one learner but distract another. | B They always improve concentration. | C They should be sent every five minutes. | D They are useful only for vocabulary. | Key A | The passage contrasts learners who benefit from frequent reminders with learners who find them distracting.
- REA-B1-03-Q5: In 'a guide rather than a set of fixed instructions', what does 'fixed' most nearly mean? | A not intended to change | B clearly printed | C repaired | D short and simple | Key A | The following sentence says learners need to adjust the plan, so fixed means not changing.
- REA-B1-03-Q6: What can be inferred from the examples of maths and vocabulary tasks? | A Useful plans need to respond to the actual difficulty and time a task requires. | B Every subject should receive exactly the same study time. | C Vocabulary is always easy and maths is always difficult. | D Learners should stop planning before they begin. | Key A | The examples show that actual task demands can differ from an initial estimate.
- REA-B1-03-Q7: Why does the writer use the word 'However' at the start of the second paragraph? | A To introduce a limitation to the benefits described earlier | B To repeat the same list of app features | C To change the topic to school rules | D To prove that apps are useless | Key A | However signals a contrast between the useful features and the limits of automated planning.
- REA-B1-03-Q8: According to the text, what evidence can an app make visible? | A Deadlines and study patterns | B A learner's future exam score with certainty | C The correct answer to every task | D Whether a teacher likes the learner | Key A | The final paragraph says an app can make deadlines and study patterns visible.
- REA-B1-03-Q9: What can be inferred about the writer's attitude toward learner independence? | A The writer believes learners should keep responsibility for final decisions. | B The writer thinks learners should obey the app without question. | C The writer believes planning has no value. | D The writer wants apps to remove all learner choices. | Key A | The final sentence explicitly keeps the final decision with the learner, supported by the earlier discussion of adjustment.
- REA-B1-03-Q10: In this text, what does 'adjust the plan' mean? | A change the plan when new information shows it is needed | B delete every deadline | C follow the original plan more strictly | D replace study with reminders | Key A | The surrounding sentences describe changing a plan when task time or learner needs differ from the original expectation.

## Required independent review questions
1. Is the shared template pedagogically appropriate for independent learners at A1/A2/B1? Assess scaffolding, cognitive load, bilingual accuracy, accessibility and the separation of worked example, QC and transfer. Do not approve B2/C1 unseen content.
2. For each lesson, verify alignment with canonical objectives; strategy cards, every lens (exact IDs and explanation), worked question and every distractor, both QC options/keys/feedback, transfer prompt, criteria, hidden EN/VI model. Flag gaps in vocabulary-in-context or time-sequence support where relevant. Is model reasoning warranted by the specific text rather than guesses?
3. Review all 26 original scored items against all learner-visible content, including hidden models and selected feedback. Output each exact ID and PASS / LEAK / UNCERTAIN, with brief reason. Counts must be 8/8/10. Independent skill instruction is permitted; direct/near-direct assessed answers or item-specific cues are not. Distinguish pre-existing bank issues (including all-A key patterns in A2-05 and B1-03; paragraph references where canonical body is a single string) from proposed overlay defects. Do not change original bank or assume runtime shuffling tested.
4. Verify all six quick-check keys and all distractor explanations; confirm evidence weight 0 and no semantic grading for the three open transfers. Check for missing details or overstated claims, including A2 ferry arrival arithmetic and B1 inference boundaries.
5. Is the six-section template suitable for owner design approval and later pilot implementation, provided any required corrections are made? Explicitly separate academic/pedagogical verdict from runtime/browser/LIVE QA.

## Required verdict format
PACKET_VERDICT: PASS / REVISE / FAIL
TEMPLATE_VERDICT: PASS / REVISE / FAIL (A1/A2/B1 only)
LESSON_VERDICTS: each of 3 exact IDs; strategy cards, lenses, model, QC1/QC2, transfer, EN/VI and objective alignment individually assessed.
QC_KEYS: REA-A1-01 KQC01/KQC02; REA-A2-05 KQC01/KQC02; REA-B1-03 KQC01/KQC02.
LEAKAGE_AUDIT: 26 individual rows with exact IDs, verdict and explanation; per-lesson counts 8,8,10; totals checked/PASS/LEAK/UNCERTAIN.
BASELINE_OBSERVATIONS: separately identify pre-existing issues; no automatic bank edits.
REQUIRED_CORRECTIONS: exact lesson/section, before → proposed correction, reason; NONE only when justified.
OPTIONAL_IMPROVEMENTS: separate.
ASSESSMENT_EVIDENCE: zero new scored items; zero evidence weight; 3 open transfers unscored.
ENGINEERING / BROWSER / PRODUCTION: NOT_TESTED / NOT_AUTHORIZED.
