# SLE Vocabulary Knowledge v2.3 — Wave 4 B2 — R0

Packet ID: `SLE-VOC-KNOWLEDGE-V23-W4-B2-R0-20261124`
Review authority: SLE-MASTER-001 v1.2.1 and current five permanent project baselines.
Implementation status: authoring-only / independent academic review pending.
Exact curriculum source: `sites-p0-phase-a-20260926/content/curriculum-1.28.0-candidate.json`, Git blob `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`. Four existing B2 Vocabulary lessons, immutable objectives and 29 original scored items reproduced in Appendix B. 48 proposed cards, four worked models, eight recalls (four exact constrained and four OPEN_UNSCORED), eight bilingual quick checks, four decks and four open transfers. No curricular change, import, grading, technical PASS or release authorization.

## Accepted pattern and B2 scope
Reuse approved Vocabulary v2.3 R1 design without new HTML. All overlay interactions are teaching-only, unscored, evidence_weight=0, no proficiency assessment, learner data or AI semantic grading. Exact constrained recall normalization: trim, casefold, collapse_spaces, strip_terminal_punctuation; no fuzzy match. Open prompts are self-comparison only. Flashcards project exact ordered cards, term on front and EN/VI meaning and example on back. Speech arrays list exact English term and example. Optional Web Speech: cancel, new SpeechSynthesisUtterance(exact English string), lang en-GB, rate 0.92, speak; no explicit voice assignment. No audio quality/offline claims. Preserve real Listening assets and all assessment safeguards.

B2-01 extends B1 evidence language to sampling, association, rival explanations and comparison; B2-02 distinguishes evaluation/recommendation/approval/action and word families; B2-03 distinguishes register/connotation without losing meaning; B2-04 maps lexical roles of argument and separates concerns from disproof. Target B2 general learners with clear self-study scaffolding. Review each exact baseline item; original score bank is read-only and remains unchanged even if reviewer finds pre-existing weaknesses.

## Appendix A — proposed overlay

### VOC-B2-01 — Use precise stance and evidence-aware language

**Immutable objectives (verbatim):**
- Identify degrees of certainty in reporting verbs.
- Qualify conclusions from a self-selected sample.
- Distinguish correlation from causation.
- Use concession language and propose a stronger follow-up test.

**Context EN:** A community repair café is evaluating whether a new booking system improves access. Read evidence carefully, distinguish reports from measured outcomes, and propose a stronger test.

**Context VI:** Một điểm sửa đồ cộng đồng đánh giá liệu hệ thống đặt lịch mới có cải thiện khả năng tiếp cận hay không. Hãy đọc bằng chứng cẩn thận, phân biệt lời kể với kết quả đo được và đề xuất phép thử tốt hơn.

**Notice EN:** Reporting verbs do not have a fixed certainty scale in every context: indicate can report strong or weak evidence depending on the claim. Distinguish an observed outcome, an interpretation and a causal claim. Despite + noun/-ing; although + clause. State who was sampled and what was measured.

**Notice VI:** Động từ tường thuật không có thang độ chắc chắn cố định trong mọi ngữ cảnh: indicate có thể đi với bằng chứng mạnh hoặc yếu tùy nhận định. Phân biệt kết quả quan sát, diễn giải và nhận định nhân quả. Despite + danh từ/V-ing; although + mệnh đề. Nêu rõ ai được khảo sát và đo điều gì.

#### Cards

**VOC-B2-01-CARD-01 — suggest that** (reporting chunk)
- Meaning EN: point towards a possible interpretation without establishing it conclusively
- Meaning VI: gợi ý rằng, cho thấy khả năng
- Example EN: The queue records suggest that some visitors prefer booking in advance.
- Example VI: Dữ liệu hàng chờ gợi ý rằng một số khách thích đặt lịch trước.
- Exact speech array: ["suggest that","The queue records suggest that some visitors prefer booking in advance."]

**VOC-B2-01-CARD-02 — indicate** (reporting verb)
- Meaning EN: point to a finding or possible conclusion, with force depending on the evidence
- Meaning VI: chỉ ra, cho thấy
- Example EN: The repair logs indicate a recurring shortage of spare parts.
- Example VI: Nhật ký sửa chữa cho thấy tình trạng thiếu phụ tùng lặp đi lặp lại.
- Exact speech array: ["indicate","The repair logs indicate a recurring shortage of spare parts."]

**VOC-B2-01-CARD-03 — establish** (reporting verb)
- Meaning EN: demonstrate a fact or conclusion with adequate supporting evidence
- Meaning VI: xác lập, chứng minh có căn cứ
- Example EN: The records establish that the café opened on six Saturdays.
- Example VI: Hồ sơ xác nhận điểm sửa đồ đã mở cửa sáu ngày thứ Bảy.
- Exact speech array: ["establish","The records establish that the café opened on six Saturdays."]

**VOC-B2-01-CARD-04 — prove** (reporting verb)
- Meaning EN: demonstrate that a specific claim is true through sufficient evidence or reasoning
- Meaning VI: chứng minh
- Example EN: A valid mathematical argument can prove a statement within its assumptions.
- Example VI: Một lập luận toán học hợp lệ có thể chứng minh một mệnh đề trong phạm vi các giả định.
- Exact speech array: ["prove","A valid mathematical argument can prove a statement within its assumptions."]

**VOC-B2-01-CARD-05 — self-selected sample** (noun phrase)
- Meaning EN: a group formed by people choosing for themselves whether to participate
- Meaning VI: mẫu tự chọn
- Example EN: A self-selected sample of repair volunteers may differ from occasional visitors.
- Example VI: Mẫu tình nguyện viên sửa đồ tự chọn có thể khác nhóm khách ghé không thường xuyên.
- Exact speech array: ["self-selected sample","A self-selected sample of repair volunteers may differ from occasional visitors."]

**VOC-B2-01-CARD-06 — representative sample** (noun phrase)
- Meaning EN: a sample that adequately reflects relevant characteristics of the target population
- Meaning VI: mẫu có tính đại diện
- Example EN: The organisers want a representative sample that includes visitors from different neighbourhoods.
- Example VI: Ban tổ chức muốn một mẫu có tính đại diện gồm khách từ nhiều khu phố.
- Exact speech array: ["representative sample","The organisers want a representative sample that includes visitors from different neighbourhoods."]

**VOC-B2-01-CARD-07 — correlation** (noun)
- Meaning EN: a statistical association between variables, not by itself evidence of cause
- Meaning VI: mối tương quan
- Example EN: A correlation between opening hours and bookings could reflect other influences.
- Example VI: Mối tương quan giữa giờ mở cửa và số lượt đặt lịch có thể phản ánh các yếu tố khác.
- Exact speech array: ["correlation","A correlation between opening hours and bookings could reflect other influences."]

**VOC-B2-01-CARD-08 — causation** (noun)
- Meaning EN: a relationship in which one factor produces or contributes to an outcome
- Meaning VI: quan hệ nhân quả
- Example EN: Showing causation requires more than noting a pattern in the booking data.
- Example VI: Chứng minh quan hệ nhân quả đòi hỏi nhiều hơn việc nhận thấy một quy luật trong dữ liệu đặt lịch.
- Exact speech array: ["causation","Showing causation requires more than noting a pattern in the booking data."]

**VOC-B2-01-CARD-09 — an alternative explanation** (noun phrase)
- Meaning EN: another plausible account of why an observed outcome occurred
- Meaning VI: một cách giải thích khác
- Example EN: An alternative explanation for fewer repairs is that fewer broken items were brought in.
- Example VI: Một cách giải thích khác cho việc số lượt sửa giảm là có ít đồ hỏng được mang đến hơn.
- Exact speech array: ["an alternative explanation","An alternative explanation for fewer repairs is that fewer broken items were brought in."]

**VOC-B2-01-CARD-10 — a potential confounding factor** (noun phrase)
- Meaning EN: a factor that may distort an observed relationship because it relates to the exposure and outcome
- Meaning VI: yếu tố gây nhiễu tiềm ẩn
- Example EN: A neighbourhood event could be a potential confounding factor if it affects both bookings and visitor numbers.
- Example VI: Một sự kiện khu phố có thể là yếu tố gây nhiễu tiềm ẩn nếu ảnh hưởng cả lượt đặt lịch và số khách.
- Exact speech array: ["a potential confounding factor","A neighbourhood event could be a potential confounding factor if it affects both bookings and visitor numbers."]

**VOC-B2-01-CARD-11 — does not necessarily imply** (qualification chunk)
- Meaning EN: does not make a conclusion inevitable or logically warranted
- Meaning VI: không nhất thiết hàm ý
- Example EN: A higher number of bookings does not necessarily imply easier access for everyone.
- Example VI: Số lượt đặt lịch cao hơn không nhất thiết hàm ý mọi người đều dễ tiếp cận hơn.
- Exact speech array: ["does not necessarily imply","A higher number of bookings does not necessarily imply easier access for everyone."]

**VOC-B2-01-CARD-12 — a comparison group** (noun phrase)
- Meaning EN: a group used as a reference when evaluating outcomes in another group
- Meaning VI: nhóm đối chiếu
- Example EN: The team could use a comparison group that keeps the existing system during the pilot.
- Example VI: Nhóm có thể dùng một nhóm đối chiếu tiếp tục sử dụng hệ thống cũ trong đợt thử nghiệm.
- Exact speech array: ["a comparison group","The team could use a comparison group that keeps the existing system during the pilot."]

#### Worked model
EN: A community tool library records 40 borrowing visits in May and 52 in June after adding an evening session. The records establish the change in visits during those months. An alternative explanation is a seasonal increase in gardening. Compare similar weeks and record borrowing opportunities before attributing the difference to the session. The data do not show whether individual users found access easier.

VI: Một thư viện dụng cụ ghi nhận 40 lượt mượn trong tháng Năm và 52 lượt trong tháng Sáu sau khi thêm buổi tối. Dữ liệu xác nhận chênh lệch trong hai tháng. Một cách giải thích khác là nhu cầu làm vườn tăng theo mùa. Hãy so sánh các tuần tương đương và ghi nhận cơ hội mượn trước khi quy chênh lệch cho buổi tối. Dữ liệu không cho thấy từng người dùng tiếp cận dễ hơn hay không.

#### Recall (unscored)
- VOC-B2-01-RECALL-01 — Use the exact lesson term for a statistical association: The reported ___ alone cannot establish a causal relationship. Exact accepted key: ["correlation"]. Self-feedback: reveal and compare exact target after attempting. VI: điền từ theo yêu cầu; tự đối chiếu với từ mục tiêu sau khi trả lời.
- VOC-B2-01-RECALL-02 — Describe a plausible alternative explanation for a rise in library use after a change in opening hours. `OPEN_UNSCORED`. No automated grade. Self-check: choose a suitable chunk, distinguish the roles or limits in the situation and compare with the worked model. VI: chọn cụm phù hợp, phân biệt vai trò hoặc giới hạn trong tình huống rồi tự đối chiếu với ví dụ.

#### Quick self-checks (unscored)

**VOC-B2-01-QC-01** — A museum finds that visitors who use an audio guide also spend longer inside. What other information would help investigate the relationship?
- A. Whether guide users already planned longer visits before choosing the guide
  - Correct — EN: Prior plans could influence both guide use and visit duration. VI: Kế hoạch có trước có thể ảnh hưởng cả việc dùng thiết bị hướng dẫn và thời gian tham quan.
- B. Whether all guide devices have the same colour
  - Not correct — EN: Device colour does not address the proposed relationship unless a relevant mechanism is established. VI: Màu thiết bị không giải thích mối quan hệ nếu chưa có cơ chế liên quan.
- C. Whether the entrance sign uses a large font
  - Not correct — EN: Font size alone does not address whether guide users had different plans. VI: Cỡ chữ không giải quyết việc người dùng thiết bị có kế hoạch khác hay không.
Key: A.

**VOC-B2-01-QC-02** — A volunteer group records the exact dates of seven repair sessions. Which claim can these records establish directly?
- A. The sessions permanently improved everyone's confidence.
  - Not correct — EN: Confidence was not measured. VI: Sự tự tin chưa được đo.
- B. The repair programme reduced all household waste.
  - Not correct — EN: Household waste was not measured. VI: Rác thải gia đình chưa được đo.
- C. Seven sessions took place on the recorded dates, assuming the records are accurate.
  - Correct — EN: This matches the scope of the date records. VI: Nhận định này phù hợp phạm vi hồ sơ ngày tháng.
Key: C.

#### Flashcard deck
Ordered source IDs: VOC-B2-01-CARD-01, VOC-B2-01-CARD-02, VOC-B2-01-CARD-03, VOC-B2-01-CARD-04, VOC-B2-01-CARD-05, VOC-B2-01-CARD-06, VOC-B2-01-CARD-07, VOC-B2-01-CARD-08, VOC-B2-01-CARD-09, VOC-B2-01-CARD-10, VOC-B2-01-CARD-11, VOC-B2-01-CARD-12. Exact projection, no independent rewriting. Front: term; back: meaning EN/VI, example EN/VI; speech arrays unchanged.

#### Transfer — OPEN_UNSCORED
Prompt: A sports equipment library reports increased borrowing after changing its membership form. Write a cautious evaluation with one alternative explanation, one limitation and one stronger comparison.

Self-check criteria: Use at least two evidence-aware chunks, distinguish observation from cause, name a relevant limit and propose a feasible comparison.

Hidden model EN: The records establish that borrowing increased during the observed period. A possible alternative explanation is the start of the sports season. The figures do not necessarily imply better access for all members. Comparable branches or periods, with similar seasonal conditions, would help test the change.

Hidden model VI: Hồ sơ xác nhận lượt mượn tăng trong giai đoạn quan sát. Một cách giải thích khác có thể là mùa thể thao bắt đầu. Số liệu không nhất thiết cho thấy mọi thành viên dễ tiếp cận hơn. Các chi nhánh hoặc giai đoạn tương đương với điều kiện mùa vụ giống nhau sẽ giúp kiểm tra thay đổi.

No automated semantic judgment, scored evidence or learner-data write.


### VOC-B2-02 — Collocations for balanced proposals and decisions

**Immutable objectives (verbatim):**
- Recognise natural formal collocations for evaluating a proposal; distinguish a concern from evidence of failure; select appropriate word families in a new context.

**Context EN:** A community garden committee is preparing a formal proposal for shared equipment. Distinguish a concern, a response, a decision and implementation; select the correct word family.

**Context VI:** Một ban quản lý vườn cộng đồng chuẩn bị đề xuất chính thức về thiết bị dùng chung. Phân biệt mối lo ngại, cách xử lý, quyết định và triển khai; chọn đúng dạng từ.

**Notice EN:** Use assess + object, an assessment of + noun, assessable + noun. Take measures is a common plural collocation; implement a measure is useful for one specific approved action. A response to a concern is not proof it has been resolved.

**Notice VI:** Dùng assess + tân ngữ, an assessment of + danh từ, assessable + danh từ. Take measures là cụm số nhiều thông dụng; implement a measure hữu ích khi nói về một hành động cụ thể đã được duyệt. Phản hồi mối lo ngại không chứng minh vấn đề đã được giải quyết.

#### Cards

**VOC-B2-02-CARD-01 — raise a concern** (verb chunk)
- Meaning EN: bring a possible difficulty to others' attention
- Meaning VI: nêu lên mối lo ngại
- Example EN: A gardener raised a concern about access to the storage area.
- Example VI: Một người làm vườn nêu lo ngại về việc tiếp cận khu lưu trữ.
- Exact speech array: ["raise a concern","A gardener raised a concern about access to the storage area."]

**VOC-B2-02-CARD-02 — address a concern** (verb chunk)
- Meaning EN: take a relevant step in response to a concern without necessarily resolving it
- Meaning VI: xử lý, phản hồi một mối lo ngại
- Example EN: The committee addressed a concern about noise by arranging a sound check.
- Example VI: Ban quản lý xử lý mối lo ngại về tiếng ồn bằng cách tổ chức kiểm tra âm thanh.
- Exact speech array: ["address a concern","The committee addressed a concern about noise by arranging a sound check."]

**VOC-B2-02-CARD-03 — reach a decision** (verb chunk)
- Meaning EN: settle what to do after consideration
- Meaning VI: đi đến quyết định
- Example EN: The committee reached a decision on the location of the new shelves.
- Example VI: Ban quản lý đã quyết định vị trí các kệ mới.
- Exact speech array: ["reach a decision","The committee reached a decision on the location of the new shelves."]

**VOC-B2-02-CARD-04 — consider an option** (verb chunk)
- Meaning EN: examine a possible course of action without committing to it
- Meaning VI: cân nhắc một phương án
- Example EN: The garden is considering an option that would keep the entrance unchanged.
- Example VI: Khu vườn đang cân nhắc phương án giữ nguyên lối vào.
- Exact speech array: ["consider an option","The garden is considering an option that would keep the entrance unchanged."]

**VOC-B2-02-CARD-05 — draw a distinction between** (verb chunk)
- Meaning EN: identify a meaningful difference between two concepts
- Meaning VI: phân biệt giữa
- Example EN: The proposal draws a distinction between initial cost and running cost.
- Example VI: Đề xuất phân biệt chi phí ban đầu và chi phí vận hành.
- Exact speech array: ["draw a distinction between","The proposal draws a distinction between initial cost and running cost."]

**VOC-B2-02-CARD-06 — acknowledge a limitation** (verb chunk)
- Meaning EN: recognise openly a boundary or weakness
- Meaning VI: thừa nhận một hạn chế
- Example EN: The designers acknowledge a limitation in the available storage space.
- Example VI: Những người thiết kế thừa nhận hạn chế về diện tích lưu trữ.
- Exact speech array: ["acknowledge a limitation","The designers acknowledge a limitation in the available storage space."]

**VOC-B2-02-CARD-07 — make a recommendation** (verb chunk)
- Meaning EN: propose a course of action for others to consider
- Meaning VI: đưa ra khuyến nghị
- Example EN: The working group made a recommendation about replacing damaged signs.
- Example VI: Nhóm công tác đưa ra khuyến nghị về việc thay biển bị hỏng.
- Exact speech array: ["make a recommendation","The working group made a recommendation about replacing damaged signs."]

**VOC-B2-02-CARD-08 — take measures to** (verb chunk)
- Meaning EN: carry out steps intended to achieve a goal or address a problem
- Meaning VI: thực hiện các biện pháp để
- Example EN: The garden will take measures to keep the shared paths accessible.
- Example VI: Khu vườn sẽ thực hiện các biện pháp để lối đi chung dễ tiếp cận.
- Exact speech array: ["take measures to","The garden will take measures to keep the shared paths accessible."]

**VOC-B2-02-CARD-09 — assess** (verb)
- Meaning EN: evaluate the quality, extent or significance of something
- Meaning VI: đánh giá
- Example EN: The volunteers assess the condition of the donated tools.
- Example VI: Các tình nguyện viên đánh giá tình trạng dụng cụ được tặng.
- Exact speech array: ["assess","The volunteers assess the condition of the donated tools."]

**VOC-B2-02-CARD-10 — assessment** (noun)
- Meaning EN: an evaluation or the process of evaluating something
- Meaning VI: sự đánh giá, bản đánh giá
- Example EN: The maintenance assessment identified two damaged handles.
- Example VI: Bản đánh giá bảo trì xác định hai tay cầm bị hỏng.
- Exact speech array: ["assessment","The maintenance assessment identified two damaged handles."]

**VOC-B2-02-CARD-11 — assessable** (adjective)
- Meaning EN: capable of being evaluated against appropriate evidence or criteria
- Meaning VI: có thể đánh giá được
- Example EN: The project sets assessable targets for equipment availability.
- Example VI: Dự án đặt ra các mục tiêu có thể đánh giá về mức độ sẵn có của thiết bị.
- Exact speech array: ["assessable","The project sets assessable targets for equipment availability."]

**VOC-B2-02-CARD-12 — implement a measure** (verb chunk)
- Meaning EN: put an agreed step or policy into effect
- Meaning VI: triển khai một biện pháp
- Example EN: The committee implemented a measure to label the tool shelves.
- Example VI: Ban quản lý triển khai một biện pháp dán nhãn kệ dụng cụ.
- Exact speech array: ["implement a measure","The committee implemented a measure to label the tool shelves."]

#### Worked model
EN: A local archive discusses two ways of protecting fragile posters. First, staff assess their condition. They recommend storage sleeves, but the recommendation is not yet an approved decision. Once approval is given, staff can implement a measure by fitting the sleeves. These stages distinguish evaluation, advice, approval and action.

VI: Một kho lưu trữ địa phương thảo luận hai cách bảo vệ áp phích dễ hỏng. Trước hết nhân viên đánh giá tình trạng. Họ khuyến nghị dùng túi bảo quản, nhưng khuyến nghị chưa phải quyết định được duyệt. Khi được phê duyệt, nhân viên có thể triển khai biện pháp bằng cách lắp túi. Các giai đoạn phân biệt đánh giá, khuyến nghị, phê duyệt và hành động.

#### Recall (unscored)
- VOC-B2-02-RECALL-01 — Use the adjective from the assess family: The maintenance targets must be ___ against agreed criteria. Exact accepted key: ["assessable"]. Self-feedback: reveal and compare exact target after attempting. VI: điền từ theo yêu cầu; tự đối chiếu với từ mục tiêu sau khi trả lời.
- VOC-B2-02-RECALL-02 — Describe the difference between a committee's recommendation and an implemented measure. `OPEN_UNSCORED`. No automated grade. Self-check: choose a suitable chunk, distinguish the roles or limits in the situation and compare with the worked model. VI: chọn cụm phù hợp, phân biệt vai trò hoặc giới hạn trong tình huống rồi tự đối chiếu với ví dụ.

#### Quick self-checks (unscored)

**VOC-B2-02-QC-01** — The archivist writes, 'The condition of each poster will be assessed.' Which related form can describe the same process as a noun?
- A. assess
  - Not correct — EN: Assess is a verb, not the noun required here. VI: Assess là động từ, không phải danh từ cần dùng.
- B. assessment
  - Correct — EN: Assessment names the process of evaluating condition. VI: Assessment gọi tên quá trình đánh giá tình trạng.
- C. assessable
  - Not correct — EN: Assessable is an adjective describing something that can be assessed. VI: Assessable là tính từ chỉ điều có thể đánh giá.
Key: B.

**VOC-B2-02-QC-02** — A community studio has an approved rule about storing materials and starts applying it today. Which phrase accurately describes this new stage?
- A. Question a measure
  - Not correct — EN: Questioning means examining or challenging a step, not applying it. VI: Question nghĩa là xem xét hoặc chất vấn, không phải áp dụng.
- B. Consider an unapproved option
  - Not correct — EN: Considering an option occurs before commitment. VI: Cân nhắc phương án diễn ra trước khi cam kết.
- C. Implement a measure
  - Correct — EN: Implementing puts an approved step into practice. VI: Implement nghĩa là đưa biện pháp đã duyệt vào thực tế.
Key: C.

#### Flashcard deck
Ordered source IDs: VOC-B2-02-CARD-01, VOC-B2-02-CARD-02, VOC-B2-02-CARD-03, VOC-B2-02-CARD-04, VOC-B2-02-CARD-05, VOC-B2-02-CARD-06, VOC-B2-02-CARD-07, VOC-B2-02-CARD-08, VOC-B2-02-CARD-09, VOC-B2-02-CARD-10, VOC-B2-02-CARD-11, VOC-B2-02-CARD-12. Exact projection, no independent rewriting. Front: term; back: meaning EN/VI, example EN/VI; speech arrays unchanged.

#### Transfer — OPEN_UNSCORED
Prompt: A community cooking centre wants to improve access to shared kitchen equipment. Draft a short formal plan that separates assessment, recommendation and implementation.

Self-check criteria: Use at least three formal chunks, a correct assess word form, and clearly distinguish stages without claiming an unmeasured outcome.

Hidden model EN: We should assess equipment availability first. The assessment may identify a shortage at busy times. The group can then make a recommendation to add a booking list. If approved, staff can implement the measure and review its effect.

Hidden model VI: Trước tiên cần đánh giá mức độ sẵn có của thiết bị. Bản đánh giá có thể phát hiện thiếu hụt vào giờ đông. Nhóm có thể khuyến nghị thêm danh sách đặt lịch. Nếu được duyệt, nhân viên có thể triển khai biện pháp và xem xét tác động.

No automated semantic judgment, scored evidence or learner-data write.


### VOC-B2-03 — Choose register and connotation for the audience

**Immutable objectives (verbatim):**
- Choose appropriately neutral, formal or informal vocabulary in messages to different audiences; recognise loaded connotations; revise exaggeration without removing necessary meaning.

**Context EN:** A youth science museum is preparing messages for friends, volunteers and a funding panel. Adapt vocabulary to audience and purpose without altering facts.

**Context VI:** Một bảo tàng khoa học dành cho thanh thiếu niên chuẩn bị thông điệp cho bạn bè, tình nguyện viên và hội đồng tài trợ. Điều chỉnh từ vựng theo người đọc và mục đích mà không thay đổi sự thật.

**Notice EN:** Register is not a ranking of good versus bad English. Cheap may be neutral in everyday price talk or negative in quality judgments. Substantial/marginal depend on the reference scale. Formal language should remain clear; remove unjustified emphasis, not the underlying concern.

**Notice VI:** Ngữ vực không phải bảng xếp hạng tiếng Anh tốt hay xấu. Cheap có thể trung tính khi nói giá cả đời thường hoặc mang nghĩa tiêu cực khi nói chất lượng. Substantial/marginal phụ thuộc thang so sánh. Ngôn ngữ trang trọng cần rõ ràng; bỏ nhấn mạnh thiếu căn cứ chứ không bỏ mối lo thực sự.

#### Cards

**VOC-B2-03-CARD-01 — register** (noun)
- Meaning EN: a style of language suited to a situation, relationship and purpose
- Meaning VI: ngữ vực
- Example EN: The museum uses a friendly register in messages to its volunteers.
- Example VI: Bảo tàng dùng ngữ vực thân thiện trong thông điệp gửi tình nguyện viên.
- Exact speech array: ["register","The museum uses a friendly register in messages to its volunteers."]

**VOC-B2-03-CARD-02 — connotation** (noun)
- Meaning EN: an additional association or attitude carried by a word beyond its basic meaning
- Meaning VI: sắc thái hàm nghĩa
- Example EN: The word boastful has a more critical connotation than confident.
- Example VI: Từ boastful có sắc thái phê phán hơn confident.
- Exact speech array: ["connotation","The word boastful has a more critical connotation than confident."]

**VOC-B2-03-CARD-03 — neutral wording** (noun phrase)
- Meaning EN: language that describes an issue without unnecessary approval or criticism
- Meaning VI: cách diễn đạt trung tính
- Example EN: Neutral wording helps the panel focus on the recorded findings.
- Example VI: Cách diễn đạt trung tính giúp hội đồng tập trung vào kết quả được ghi nhận.
- Exact speech array: ["neutral wording","Neutral wording helps the panel focus on the recorded findings."]

**VOC-B2-03-CARD-04 — inexpensive** (adjective)
- Meaning EN: costing relatively little, without necessarily implying poor quality
- Meaning VI: không đắt, giá phải chăng
- Example EN: The museum bought inexpensive notebooks for the activity desk.
- Example VI: Bảo tàng mua sổ giá phải chăng cho bàn hoạt động.
- Exact speech array: ["inexpensive","The museum bought inexpensive notebooks for the activity desk."]

**VOC-B2-03-CARD-05 — cheap** (adjective)
- Meaning EN: low in price; sometimes also implying poor quality or lack of care
- Meaning VI: rẻ, đôi khi hàm ý kém chất lượng
- Example EN: In a casual message, a friend said the train tickets were cheap.
- Example VI: Trong tin nhắn thân mật, một người bạn nói vé tàu rẻ.
- Exact speech array: ["cheap","In a casual message, a friend said the train tickets were cheap."]

**VOC-B2-03-CARD-06 — constructive criticism** (noun phrase)
- Meaning EN: criticism intended to help someone improve
- Meaning VI: phê bình mang tính xây dựng
- Example EN: The volunteer gave constructive criticism about the unclear labels.
- Example VI: Tình nguyện viên đưa ra góp ý mang tính xây dựng về nhãn khó hiểu.
- Exact speech array: ["constructive criticism","The volunteer gave constructive criticism about the unclear labels."]

**VOC-B2-03-CARD-07 — a substantial difference** (noun phrase)
- Meaning EN: a difference large or important enough to matter in context
- Meaning VI: một khác biệt đáng kể
- Example EN: The two delivery estimates show a substantial difference in cost for our small budget.
- Example VI: Hai dự toán giao hàng cho thấy chênh lệch chi phí đáng kể so với ngân sách nhỏ của chúng tôi.
- Exact speech array: ["a substantial difference","The two delivery estimates show a substantial difference in cost for our small budget."]

**VOC-B2-03-CARD-08 — limited** (adjective)
- Meaning EN: restricted in amount, extent or scope
- Meaning VI: hạn chế, có giới hạn
- Example EN: The exhibition has limited space for large models.
- Example VI: Triển lãm có không gian hạn chế cho các mô hình lớn.
- Exact speech array: ["limited","The exhibition has limited space for large models."]

**VOC-B2-03-CARD-09 — a marginal change** (noun phrase)
- Meaning EN: a very small change relative to a relevant comparison
- Meaning VI: một thay đổi rất nhỏ
- Example EN: A marginal change in the measured room temperature did not affect the demonstration.
- Example VI: Thay đổi rất nhỏ về nhiệt độ phòng đo được không ảnh hưởng buổi trình diễn.
- Exact speech array: ["a marginal change","A marginal change in the measured room temperature did not affect the demonstration."]

**VOC-B2-03-CARD-10 — tentative** (adjective)
- Meaning EN: not yet final or certain
- Meaning VI: tạm thời, chưa chắc chắn
- Example EN: The dates are tentative until the hall booking is confirmed.
- Example VI: Ngày tổ chức còn tạm thời cho đến khi việc đặt hội trường được xác nhận.
- Exact speech array: ["tentative","The dates are tentative until the hall booking is confirmed."]

**VOC-B2-03-CARD-11 — overstate** (verb)
- Meaning EN: describe something as stronger, larger or more certain than is justified
- Meaning VI: nói quá, phóng đại
- Example EN: We should not overstate the importance of one visitor's comment.
- Example VI: Không nên phóng đại tầm quan trọng của một nhận xét từ khách.
- Exact speech array: ["overstate","We should not overstate the importance of one visitor's comment."]

**VOC-B2-03-CARD-12 — retain the meaning** (verb chunk)
- Meaning EN: preserve the essential message when revising wording
- Meaning VI: giữ nguyên ý nghĩa
- Example EN: The editor changed the tone but retained the meaning of the notice.
- Example VI: Biên tập viên thay đổi giọng điệu nhưng giữ nguyên ý nghĩa thông báo.
- Exact speech array: ["retain the meaning","The editor changed the tone but retained the meaning of the notice."]

#### Worked model
EN: A community radio team tells friends, 'We're trying out a new recording corner next month.' Its funding note says, 'We plan to test a new recording space next month.' Both preserve the future plan and its provisional status. The second suits institutional readers without becoming more certain or more complicated.

VI: Một nhóm phát thanh cộng đồng nói với bạn bè rằng họ sẽ thử một góc thu âm mới vào tháng tới. Trong ghi chú gửi nhà tài trợ, nhóm viết rằng họ dự kiến thử nghiệm không gian thu âm mới vào tháng tới. Cả hai giữ nguyên kế hoạch tương lai và tính thử nghiệm. Câu thứ hai phù hợp người đọc tổ chức mà không tăng độ chắc chắn hay làm câu phức tạp hơn.

#### Recall (unscored)
- VOC-B2-03-RECALL-01 — Use the exact lesson noun for style suited to audience and purpose: A professional email may require a different ___ from a message to a friend. Exact accepted key: ["register"]. Self-feedback: reveal and compare exact target after attempting. VI: điền từ theo yêu cầu; tự đối chiếu với từ mục tiêu sau khi trả lời.
- VOC-B2-03-RECALL-02 — Explain how two different audiences might interpret the same evaluative adjective. `OPEN_UNSCORED`. No automated grade. Self-check: choose a suitable chunk, distinguish the roles or limits in the situation and compare with the worked model. VI: chọn cụm phù hợp, phân biệt vai trò hoặc giới hạn trong tình huống rồi tự đối chiếu với ví dụ.

#### Quick self-checks (unscored)

**VOC-B2-03-QC-01** — A book club has not confirmed its event date. Which wording is accurate for a notice to members?
- A. The date is tentative until the venue is confirmed.
  - Correct — EN: Tentative preserves the uncertain status of the date. VI: Tentative giữ đúng tính chưa chắc chắn của ngày tổ chức.
- B. The date is final and cannot change.
  - Not correct — EN: Final contradicts the fact that confirmation is pending. VI: Final mâu thuẫn với việc chưa xác nhận.
- C. The venue definitely has no problems.
  - Not correct — EN: The information gives no basis for such certainty about the venue. VI: Thông tin không cho phép chắc chắn như vậy về địa điểm.
Key: A.

**VOC-B2-03-QC-02** — An editor replaces 'She's boastful' with 'She is confident' in a witness's account. What should the editor check first?
- A. Whether the replacement contains more letters
  - Not correct — EN: Word length does not decide whether the meaning is preserved. VI: Độ dài từ không quyết định ý nghĩa có được giữ nguyên hay không.
- B. Whether the altered connotation changes the witness's intended attitude
  - Correct — EN: Boastful and confident can carry different attitudes; the revision may alter the account. VI: Boastful và confident có thể mang thái độ khác nhau; bản sửa có thể thay đổi lời kể.
- C. Whether every adjective should be removed
  - Not correct — EN: Removing all adjectives would not necessarily preserve the message. VI: Bỏ mọi tính từ không nhất thiết giữ nguyên thông điệp.
Key: B.

#### Flashcard deck
Ordered source IDs: VOC-B2-03-CARD-01, VOC-B2-03-CARD-02, VOC-B2-03-CARD-03, VOC-B2-03-CARD-04, VOC-B2-03-CARD-05, VOC-B2-03-CARD-06, VOC-B2-03-CARD-07, VOC-B2-03-CARD-08, VOC-B2-03-CARD-09, VOC-B2-03-CARD-10, VOC-B2-03-CARD-11, VOC-B2-03-CARD-12. Exact projection, no independent rewriting. Front: term; back: meaning EN/VI, example EN/VI; speech arrays unchanged.

#### Transfer — OPEN_UNSCORED
Prompt: Write two versions of a message about a community art class: one for a friend and one for the organisers. The new time is not confirmed and the group needs more information about room capacity.

Self-check criteria: Adapt register, retain both facts, avoid exaggeration and maintain the unconfirmed status of the plan.

Hidden model EN: Friend: We're thinking of changing the time, but it's not settled yet. We still need to check how many people the room can hold. Organisers: The proposed time remains tentative pending confirmation. We also need an assessment of room capacity.

Hidden model VI: Bạn bè: Chúng mình đang tính đổi giờ, nhưng chưa chốt. Vẫn cần kiểm tra phòng chứa được bao nhiêu người. Ban tổ chức: Giờ đề xuất vẫn tạm thời trong khi chờ xác nhận. Cũng cần đánh giá sức chứa phòng.

No automated semantic judgment, scored evidence or learner-data write.


### VOC-B2-04 — Words that clarify the structure of an argument

**Immutable objectives (verbatim):**
- Use argument-analysis vocabulary precisely: premise, qualification, counterclaim, implication, limitation, and conclusion; choose natural related word forms in context without confusing a concern with a refutation.

**Context EN:** A neighbourhood design group compares two proposals for a public reading space. Map each statement to its role in an argument and distinguish a logical challenge from a concern.

**Context VI:** Một nhóm thiết kế khu phố so sánh hai đề xuất về không gian đọc công cộng. Xác định vai trò từng mệnh đề trong lập luận và phân biệt phản bác logic với mối lo ngại.

**Notice EN:** A premise is a role in reasoning, not a guarantee of truth. A counterclaim does not by itself refute another claim; a concern may question its support. An implication may be logical or merely suggested depending on wording. Concession acknowledges a valid point without surrendering the entire position.

**Notice VI:** Tiền đề là vai trò trong lập luận, không bảo đảm đúng. Luận điểm phản đối không tự động bác bỏ luận điểm khác; một mối lo có thể chất vấn căn cứ của nó. Implication có thể là hệ quả logic hoặc hàm ý tùy cách diễn đạt. Concession thừa nhận điểm hợp lý mà không từ bỏ toàn bộ quan điểm.

#### Cards

**VOC-B2-04-CARD-01 — premise** (noun)
- Meaning EN: a proposition used as a basis for an argument, which itself may be true or false
- Meaning VI: tiền đề
- Example EN: The proposal rests on the premise that the courtyard will remain available.
- Example VI: Đề xuất dựa trên tiền đề rằng sân trong sẽ tiếp tục có thể sử dụng.
- Exact speech array: ["premise","The proposal rests on the premise that the courtyard will remain available."]

**VOC-B2-04-CARD-02 — assumption** (noun)
- Meaning EN: a proposition taken for granted in reasoning, sometimes without verification
- Meaning VI: giả định
- Example EN: The design team checks its assumption about the available storage.
- Example VI: Nhóm thiết kế kiểm tra giả định về chỗ lưu trữ có sẵn.
- Exact speech array: ["assumption","The design team checks its assumption about the available storage."]

**VOC-B2-04-CARD-03 — qualification** (noun)
- Meaning EN: a restriction or condition that narrows the scope or strength of a claim
- Meaning VI: điều kiện giới hạn, sự hạn định
- Example EN: The designer adds a qualification: the estimate excludes seasonal maintenance.
- Example VI: Nhà thiết kế thêm một giới hạn: dự toán không bao gồm bảo trì theo mùa.
- Exact speech array: ["qualification","The designer adds a qualification: the estimate excludes seasonal maintenance."]

**VOC-B2-04-CARD-04 — qualify a claim** (verb chunk)
- Meaning EN: limit or condition a statement to make its scope more accurate
- Meaning VI: giới hạn một nhận định
- Example EN: We should qualify a claim about noise reduction if we have tested only one material.
- Example VI: Cần giới hạn nhận định về giảm tiếng ồn nếu mới thử một loại vật liệu.
- Exact speech array: ["qualify a claim","We should qualify a claim about noise reduction if we have tested only one material."]

**VOC-B2-04-CARD-05 — counterclaim** (noun)
- Meaning EN: a claim offered in opposition to another claim
- Meaning VI: luận điểm phản đối
- Example EN: A resident's counterclaim is that the space is better suited to meetings than reading.
- Example VI: Luận điểm phản đối của một cư dân là không gian phù hợp với họp hơn đọc sách.
- Exact speech array: ["counterclaim","A resident's counterclaim is that the space is better suited to meetings than reading."]

**VOC-B2-04-CARD-06 — implication** (noun)
- Meaning EN: a consequence or conclusion that may follow from a statement or situation
- Meaning VI: hàm ý, hệ quả
- Example EN: One implication of closing the side entrance is a longer route for some readers.
- Example VI: Một hệ quả của việc đóng lối bên là đường đi dài hơn đối với một số người đọc.
- Exact speech array: ["implication","One implication of closing the side entrance is a longer route for some readers."]

**VOC-B2-04-CARD-07 — imply** (verb)
- Meaning EN: suggest or logically entail something, depending on context
- Meaning VI: hàm ý, kéo theo
- Example EN: The designer's statement may imply that the existing shelves will stay.
- Example VI: Phát biểu của nhà thiết kế có thể hàm ý các kệ hiện tại sẽ được giữ lại.
- Exact speech array: ["imply","The designer's statement may imply that the existing shelves will stay."]

**VOC-B2-04-CARD-08 — limitation** (noun)
- Meaning EN: a restriction or weakness affecting what can be claimed or done
- Meaning VI: hạn chế
- Example EN: A limitation of the sound test is the lack of measurements outdoors.
- Example VI: Một hạn chế của phép thử âm thanh là thiếu số đo ngoài trời.
- Exact speech array: ["limitation","A limitation of the sound test is the lack of measurements outdoors."]

**VOC-B2-04-CARD-09 — limit** (verb)
- Meaning EN: restrict the extent, scope or possibility of something
- Meaning VI: giới hạn
- Example EN: The opening hours limit access for some residents.
- Example VI: Giờ mở cửa giới hạn khả năng tiếp cận của một số cư dân.
- Exact speech array: ["limit","The opening hours limit access for some residents."]

**VOC-B2-04-CARD-10 — concession** (noun)
- Meaning EN: an acknowledgment of a valid point made by another side
- Meaning VI: sự nhượng bộ, thừa nhận một điểm hợp lý
- Example EN: The designer makes a concession about the cost of replacing the old seats.
- Example VI: Nhà thiết kế thừa nhận một điểm hợp lý về chi phí thay ghế cũ.
- Exact speech array: ["concession","The designer makes a concession about the cost of replacing the old seats."]

**VOC-B2-04-CARD-11 — refute** (verb)
- Meaning EN: demonstrate that a specific claim or argument is false
- Meaning VI: bác bỏ bằng lý lẽ hoặc bằng chứng
- Example EN: The signed inventory refutes the claim that no chairs were delivered.
- Example VI: Biên bản kiểm kê đã ký bác bỏ nhận định rằng không có ghế nào được giao.
- Exact speech array: ["refute","The signed inventory refutes the claim that no chairs were delivered."]

**VOC-B2-04-CARD-12 — conclusion** (noun)
- Meaning EN: a judgment or claim reached through reasoning from premises or evidence
- Meaning VI: kết luận
- Example EN: The panel's conclusion depends on its estimate of future demand.
- Example VI: Kết luận của hội đồng phụ thuộc vào ước tính nhu cầu tương lai.
- Exact speech array: ["conclusion","The panel's conclusion depends on its estimate of future demand."]

#### Worked model
EN: A community cinema argues that a second showing is affordable because the hall is available without an extra rental fee. That availability is a premise supporting the conclusion. Electricity and staffing still need checking: the absence of a rental charge does not establish affordability by itself. A reviewer can challenge the cost assumption while accepting that the hall is available.

VI: Một rạp chiếu cộng đồng lập luận rằng có thể chi trả cho suất chiếu thứ hai vì hội trường không mất thêm phí thuê. Việc hội trường có sẵn là tiền đề hỗ trợ kết luận. Vẫn cần kiểm tra chi phí điện và nhân sự: không mất tiền thuê chưa đủ để xác lập khả năng chi trả. Người đánh giá có thể chất vấn giả định chi phí trong khi vẫn chấp nhận hội trường có sẵn.

#### Recall (unscored)
- VOC-B2-04-RECALL-01 — Use the exact lesson verb from the qualification word family: To narrow its scope, the author should ___ the claim. Exact accepted key: ["qualify"]. Self-feedback: reveal and compare exact target after attempting. VI: điền từ theo yêu cầu; tự đối chiếu với từ mục tiêu sau khi trả lời.
- VOC-B2-04-RECALL-02 — Write a short argument with a premise and conclusion, then identify one assumption that needs checking. `OPEN_UNSCORED`. No automated grade. Self-check: choose a suitable chunk, distinguish the roles or limits in the situation and compare with the worked model. VI: chọn cụm phù hợp, phân biệt vai trò hoặc giới hạn trong tình huống rồi tự đối chiếu với ví dụ.

#### Quick self-checks (unscored)

**VOC-B2-04-QC-01** — A local publisher argues that printing a second edition is worthwhile because 200 readers have requested copies. Which part functions as support in the reasoning?
- A. The claim that a second edition is worthwhile
  - Not correct — EN: This is the proposed conclusion, not its stated support. VI: Đây là kết luận đề xuất, không phải căn cứ được nêu.
- B. The reported 200 requests
  - Correct — EN: The reported requests function as a premise for the conclusion; their accuracy and relevance still need checking. VI: Số lượt yêu cầu là tiền đề cho kết luận; vẫn cần kiểm tra độ chính xác và liên quan.
- C. The publisher's name
  - Not correct — EN: The name does not supply the stated reasoning. VI: Tên không cung cấp căn cứ lập luận đã nêu.
Key: B.

**VOC-B2-04-QC-02** — A volunteer questions whether a cost estimate includes delivery. What does this question establish by itself?
- A. The entire proposal has been disproved.
  - Not correct — EN: A question alone does not logically disprove the proposal. VI: Một câu hỏi tự nó không bác bỏ đề xuất về mặt logic.
- B. The estimate must be deliberately false.
  - Not correct — EN: No evidence of deliberate falsehood is given. VI: Không có bằng chứng về việc cố ý nói sai.
- C. There is a specific assumption worth checking.
  - Correct — EN: Delivery costs may be relevant, so the question identifies a checkable assumption. VI: Chi phí giao hàng có thể liên quan; câu hỏi xác định giả định có thể kiểm tra.
Key: C.

#### Flashcard deck
Ordered source IDs: VOC-B2-04-CARD-01, VOC-B2-04-CARD-02, VOC-B2-04-CARD-03, VOC-B2-04-CARD-04, VOC-B2-04-CARD-05, VOC-B2-04-CARD-06, VOC-B2-04-CARD-07, VOC-B2-04-CARD-08, VOC-B2-04-CARD-09, VOC-B2-04-CARD-10, VOC-B2-04-CARD-11, VOC-B2-04-CARD-12. Exact projection, no independent rewriting. Front: term; back: meaning EN/VI, example EN/VI; speech arrays unchanged.

#### Transfer — OPEN_UNSCORED
Prompt: A community workshop proposes lending tools because buying extra equipment is expensive. Write one premise, one tentative conclusion, one qualification and one counterclaim or concern. Explain what evidence would help decide.

Self-check criteria: Label each role accurately, keep assumptions distinct from observations, and avoid treating a concern as logical disproof.

Hidden model EN: Premise: Extra equipment would require a sizeable initial purchase. Conclusion: Lending may be a more affordable option. Qualification: This depends on maintenance and transport costs. Concern: Frequent repairs may reduce availability. Cost and maintenance records would help evaluate the proposal.

Hidden model VI: Tiền đề: Mua thêm thiết bị đòi hỏi khoản đầu tư ban đầu đáng kể. Kết luận: Cho mượn có thể là phương án dễ chi trả hơn. Giới hạn: Điều này phụ thuộc chi phí bảo trì và vận chuyển. Mối lo: Sửa chữa thường xuyên có thể giảm mức độ sẵn có. Hồ sơ chi phí và bảo trì sẽ giúp đánh giá đề xuất.

No automated semantic judgment, scored evidence or learner-data write.

## Appendix B — immutable baseline for leakage comparison ONLY (never render in Knowledge)

Exact source projection: question IDs, types, prompts, ordered options, answer objects, feedback and evidence weights. Do not modify or import these records. For the audit return every actual question ID, not just ranges or aggregate totals. Identify any pre-existing baseline issue separately, including ambiguous short-answer keys, key-position clustering or lexical claims, without requiring baseline mutation as overlay fix.

**Expected counts:** B2-01 8, B2-02 7, B2-03 7, B2-04 7; total 29. Exact IDs listed below.

### VOC-B2-01 — Use precise stance and evidence-aware language

Objectives:
- Identify degrees of certainty in reporting verbs.
- Qualify conclusions from a self-selected sample.
- Distinguish correlation from causation.
- Use concession language and propose a stronger follow-up test.

**VOC-B2-01-Q1** (single_choice)

Prompt: Only 18 of 240 invited pupils answer a voluntary online survey. What conclusion is justified?
- A. The result represents every pupil exactly.
- B. The respondents' views are useful but may not represent all pupils.
- C. Every non-respondent disagrees.
- D. The survey proves the programme works.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"A small self-selected sample can introduce response bias. Next step: Identify who answered and who did not."}

Evidence weight: 1


**VOC-B2-01-Q2** (single_choice)

Prompt: Which verb fits tentative evidence from an uncontrolled pilot?
- A. proves
- B. guarantees
- C. suggests
- D. certifies

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"Suggests signals an interpretation that is not yet certain. Next step: Choose a stronger verb only for stronger evidence."}

Evidence weight: 1


**VOC-B2-01-Q3** (single_choice)

Prompt: Attendance increases after two clubs change schedules. Which claim is cautious?
- A. The new schedules certainly caused the increase.
- B. Attendance rose after the changes, but other factors could have contributed.
- C. Every new schedule is perfect.
- D. Old schedules must have harmed attendance.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"Timing alone does not establish cause. Next step: Check for alternative influences."}

Evidence weight: 1


**VOC-B2-01-Q4** (single_choice)

Prompt: What does 'This does not necessarily mean it will work elsewhere' imply?
- A. It cannot possibly work anywhere else.
- B. One result does not guarantee success in every setting.
- C. It is certain to work in all settings.
- D. The result never occurred.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"Not necessarily avoids assuming transfer is guaranteed. Next step: Distinguish not guaranteed from impossible."}

Evidence weight: 1


**VOC-B2-01-Q5** (single_choice)

Prompt: Which sentence makes a grammatical, fair concession?
- A. Although flexibility helps, unequal access may limit participation.
- B. Although flexibility helps, but everyone must join.
- C. Online groups are always accessible.
- D. Internet access never matters.

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"Although introduces a benefit weighed against a relevant limitation. Next step: Avoid duplicated contrast linkers."}

Evidence weight: 1


**VOC-B2-01-Q6** (single_choice)

Prompt: In 'The findings indicate a need for further testing', indicate conveys what?
- A. A cautious signal from the evidence
- B. A legal guarantee
- C. An instruction to hide uncertainty
- D. Proof without data

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"Indicate describes a plausible direction of evidence. Next step: Match the verb to the study's strength."}

Evidence weight: 1


**VOC-B2-01-Q7** (short_answer)

Prompt: Use a cautious verb: 'The early results ___ that more testing is needed.'


Answer: {"accepted_answers":["suggest","indicate"],"normalization":["trim","casefold","collapse_spaces","strip_terminal_punctuation"]}

Feedback: {"explanation_en":"Suggest or indicate is suitably cautious for preliminary findings. Next step: Explain what evidence might justify a stronger verb."}

Evidence weight: 1


**VOC-B2-01-Q8** (short_answer)

Prompt: Complete a concession using one word: '___ this benefit, the pilot has important limits.'


Answer: {"accepted_answers":["despite"],"normalization":["trim","casefold","collapse_spaces","strip_terminal_punctuation"]}

Feedback: {"explanation_en":"Despite introduces a noun phrase before the contrasting point. Next step: Remember that despite takes a noun phrase."}

Evidence weight: 1


### VOC-B2-02 — Collocations for balanced proposals and decisions

Objectives:
- Recognise natural formal collocations for evaluating a proposal; distinguish a concern from evidence of failure; select appropriate word families in a new context.

**VOC-B2-02-Q1** (single_choice)

Prompt: Choose the most natural wording for a formal note: “The student panel ___ a concern about the accessibility of the online form.”
- A. lifted
- B. raised
- C. built
- D. arrived

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"Raise a concern is the conventional collocation for bringing a worry to attention. Misconception: Choosing a verb because its literal meaning seems related. Next step: Record the verb together with concern, not as an isolated synonym."}

Evidence weight: 1


**VOC-B2-02-Q2** (single_choice)

Prompt: A report says it must ___ a distinction between early opinions and measured results. Which verb completes the expression?
- A. draw
- B. grow
- C. earn
- D. deliver

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"Draw a distinction is a standard phrase for marking a conceptual difference. Misconception: Treating verbs with broadly positive meanings as interchangeable. Next step: Reuse the full chunk in a new sentence contrasting two types of evidence."}

Evidence weight: 1


**VOC-B2-02-Q3** (single_choice)

Prompt: The board has discussed three alternatives but has not voted. Which phrase best describes its state?
- A. It reached a final decision.
- B. It carried out a final decision.
- C. It is considering several options.
- D. It has confirmed all recommendations.

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"Considering options preserves the fact that no decision has been reached. Misconception: Using a decision verb before the decision exists. Next step: Separate discussion, recommendation, approval and implementation."}

Evidence weight: 1


**VOC-B2-02-Q4** (single_choice)

Prompt: Choose the best completion: “The report should ___ the limitations of the six-week observation period.”
- A. admit in
- B. recognise on
- C. take account for
- D. acknowledge

Answer: {"correct_option_id":"D"}

Feedback: {"explanation_en":"Acknowledge limitations means explicitly recognise boundaries in the evidence. Misconception: Building an unidiomatic phrase from a similar verb. Next step: Learn acknowledge + limitations as one useful reporting chunk."}

Evidence weight: 1


**VOC-B2-02-Q5** (single_choice)

Prompt: In “We need a more systematic ___ of the complaints,” which word form fits?
- A. assess
- B. assessment
- C. assessed
- D. assessingly

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"The determiner a and adjective systematic call for a noun, assessment. Misconception: Selecting a related word without checking sentence grammar. Next step: Identify the word class demanded by the words around the gap."}

Evidence weight: 1


**VOC-B2-02-Q6** (single_choice)

Prompt: Which sentence uses address a concern most precisely?
- A. The school addressed a concern by setting up an anonymous feedback channel.
- B. The school addressed a concern, so no complaints can exist now.
- C. The school addressed a concern by ignoring every report.
- D. The school addressed a concern is identical to disproving it.

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"A response mechanism is a concrete step that addresses a concern without asserting complete resolution. Misconception: Treating response as proof of success or treating inaction as a response. Next step: State the action taken and avoid claiming outcomes that were not measured."}

Evidence weight: 1


**VOC-B2-02-Q7** (single_choice)

Prompt: Which collocation best completes: “After comparing the evidence, the working group will ___ a recommendation to the head teacher.”
- A. catch
- B. hit
- C. make
- D. arrive

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"Make a recommendation is the expected formal collocation. Misconception: Substituting a verb that may collocate with other nouns. Next step: Practice the pair make a recommendation in a fresh sentence."}

Evidence weight: 1


### VOC-B2-03 — Choose register and connotation for the audience

Objectives:
- Choose appropriately neutral, formal or informal vocabulary in messages to different audiences; recognise loaded connotations; revise exaggeration without removing necessary meaning.

**VOC-B2-03-Q1** (single_choice)

Prompt: Which sentence is most appropriate in a formal report with limited feedback data?
- A. Our plan is insanely brilliant.
- B. Everybody will definitely love the change.
- C. Initial feedback was positive, although the sample was small.
- D. People who disagree are completely wrong.

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"The neutral sentence reports a finding while acknowledging its limited scope. Misconception: Mistaking confident adjectives for professional, justified claims. Next step: Keep one observation and one limitation in your summary."}

Evidence weight: 1


**VOC-B2-03-Q2** (single_choice)

Prompt: A committee wants to describe a service that costs relatively little, without suggesting poor quality. Which phrase is usually safer?
- A. a dirt-cheap service
- B. an inexpensive service
- C. a bargain-basement service
- D. a worthless low-cost service

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"Inexpensive is a relatively neutral descriptor of cost. Misconception: Ignoring the negative connotations of cheap or dismissive alternatives. Next step: Check whether a synonym changes the writer’s attitude."}

Evidence weight: 1


**VOC-B2-03-Q3** (single_choice)

Prompt: Which request best fits an email to a school administrator?
- A. Send us the data now, okay?
- B. You guys need to fix this stuff.
- C. Obviously, we deserve every detail.
- D. Could you share the attendance summary when it is available?

Answer: {"correct_option_id":"D"}

Feedback: {"explanation_en":"The wording is clear, courteous and specific without being excessively deferential. Misconception: Confusing casual peer language with suitable institutional register. Next step: Identify the audience before revising the opening request."}

Evidence weight: 1


**VOC-B2-03-Q4** (single_choice)

Prompt: A report recorded a rise from 42 to 44 responses. Which word most carefully avoids exaggeration if no wider context is given?
- A. a slight increase
- B. an enormous surge
- C. an unbelievable explosion
- D. a revolutionary change

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"A two-response increase is small in absolute terms; slight avoids unsupported drama. Misconception: Using dramatic synonyms to make modest numbers sound important. Next step: Pair the descriptive adjective with the number, not with enthusiasm."}

Evidence weight: 1


**VOC-B2-03-Q5** (single_choice)

Prompt: The public note should say that a plan is being tested rather than permanently adopted. Which word fits?
- A. guaranteed
- B. implemented permanently
- C. trialled
- D. settled forever

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"Trialled distinguishes a reversible test from a long-term commitment. Misconception: Collapsing testing and adoption into the same stage. Next step: Specify whether the action is proposed, tested, approved or completed."}

Evidence weight: 1


**VOC-B2-03-Q6** (single_choice)

Prompt: Which revision removes an unsupported insult while keeping an identifiable concern?
- A. The people who run this are clueless.
- B. The timetable lacks a clear explanation of its selection criteria.
- C. Only a fool would accept this timetable.
- D. Every participant knows the timetable is awful.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"The revised sentence raises a specific, checkable issue without attacking people. Misconception: Mistaking a strong personal insult for strong evidence. Next step: Turn an emotional judgment into a question that can be investigated."}

Evidence weight: 1


**VOC-B2-03-Q7** (single_choice)

Prompt: Which phrase makes a cautious recommendation rather than an instruction pretending the evidence is complete?
- A. There is no possible downside whatsoever.
- B. This must be implemented immediately for everyone.
- C. No further evaluation could ever be useful.
- D. A short trial may be appropriate while additional feedback is gathered.

Answer: {"correct_option_id":"D"}

Feedback: {"explanation_en":"May be appropriate and the proposed further feedback keep the recommendation proportionate. Misconception: Using categorical language when the evidence is partial. Next step: Match the strength of a recommendation to the quality of available data."}

Evidence weight: 1


### VOC-B2-04 — Words that clarify the structure of an argument

Objectives:
- Use argument-analysis vocabulary precisely: premise, qualification, counterclaim, implication, limitation, and conclusion; choose natural related word forms in context without confusing a concern with a refutation.

**VOC-B2-04-Q1** (single_choice)

Prompt: A report says, “The benefits may apply only to schools with reliable internet.” This sentence mainly adds a ...
- A. qualification
- B. congratulation
- C. guarantee
- D. contradiction of every prior figure

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"May apply only limits the scope of the earlier claim, so it is a qualification. Misconception: Mistaking a scope restriction for total rejection. Next step: Look for words that narrow rather than negate a statement."}

Evidence weight: 1


**VOC-B2-04-Q2** (single_choice)

Prompt: In “The argument rests on a false ___ about travel time,” which noun fits best?
- A. qualified
- B. imply
- C. premise
- D. conceding

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"A premise is a statement the reasoning depends on. Misconception: Selecting a related verb or adjective without checking function. Next step: Identify the claim that must be true for the conclusion to follow."}

Evidence weight: 1


**VOC-B2-04-Q3** (single_choice)

Prompt: Which sentence uses refute most carefully?
- A. One student dislikes the idea, so the whole statistical report is refuted.
- B. A single verified exception refutes the claim that every class submitted its form.
- C. A question alone refutes all possible explanations.
- D. A limited survey automatically refutes every alternative.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"One genuine exception disproves a universal every claim. Misconception: Treating objections or questions as full logical disproof. Next step: Find the precise word (e.g., every/always) a counterexample contradicts."}

Evidence weight: 1


**VOC-B2-04-Q4** (single_choice)

Prompt: Choose the most precise description: “The new estimate implies a higher cost, but that cost has not yet been paid.”
- A. An implication is the same as an observed payment.
- B. A qualified estimate must be false.
- C. The word implies proves a current transaction.
- D. An implication is a possible consequence, not necessarily an observed event.

Answer: {"correct_option_id":"D"}

Feedback: {"explanation_en":"A projected consequence can follow from assumptions without already occurring. Misconception: Equating projected impact with completed activity. Next step: Separate future consequence from a recorded observation."}

Evidence weight: 1


**VOC-B2-04-Q5** (single_choice)

Prompt: Which sentence shows a concession followed by a qualified criticism?
- A. The pilot produced useful feedback; however, the survey did not reach every class.
- B. The pilot is perfect and therefore cannot be questioned.
- C. The pilot is wrong because someone disagrees.
- D. The survey proves every student will benefit.

Answer: {"correct_option_id":"A"}

Feedback: {"explanation_en":"The writer acknowledges a genuine benefit while retaining a specific scope limitation. Misconception: Treating concession as total acceptance or criticism as blanket rejection. Next step: Build a sentence with one fair acknowledgment and one precise caveat."}

Evidence weight: 1


**VOC-B2-04-Q6** (single_choice)

Prompt: Which form correctly completes “The small sample ___ the report’s ability to generalise”?
- A. limitedness
- B. limitingly
- C. limits
- D. limitedly

Answer: {"correct_option_id":"C"}

Feedback: {"explanation_en":"The singular subject small sample needs the present-tense verb limits. Misconception: Using a word-family member with the wrong grammatical role. Next step: Check the subject and required finite verb form."}

Evidence weight: 1


**VOC-B2-04-Q7** (single_choice)

Prompt: Two reports make different recommendations but share the same measured figures. What is the most useful next analytical step?
- A. Assume one group secretly changed the figures.
- B. Examine their assumptions and priorities before treating the conclusions as contradictory facts.
- C. Ignore both recommendations because the numbers match.
- D. Declare the report with longer words correct.

Answer: {"correct_option_id":"B"}

Feedback: {"explanation_en":"Different values and assumptions may produce different recommendations from the same observations. Misconception: Confusing disagreement in interpretation with disagreement about observed facts. Next step: Separate observations, assumptions and final actions in a short ledger."}

Evidence weight: 1

## Eight required review questions
1. Are the contexts, objectives and B2 lexical/critical-thinking scope aligned and self-teachable, with meaningful progression from B1?
2. Audit each card for lexical precision, natural English and Vietnamese, register, examples, word-family form and exact speech arrays. Check that evidence-verb force is contextual and that connotation is not a fixed rule.
3. Do all worked models teach reasoning in independent situations, with accurate bilingual support and no unsupported causal or logical claim?
4. Are the four constrained recall keys uniquely defensible given the instructions, and four open recalls genuinely unscored?
5. Are eight quick checks distinct from scored items, with single defensible keys and actionable EN/VI feedback for all options?
6. Are decks exact ordered projections, transfer tasks independent and criteria usable, with hidden models and no semantic grading?
7. Compare all 29 baseline items against the entire overlay for prohibited near-identical stems, answers in the same contexts, copied scored options or feedback. Ordinary teaching of lexical targets is not leakage. Return an individual verdict for EVERY exact question ID (8/7/7/7). Report pre-existing findings separately; do not change baseline.
8. Is the approved template and scope followed? No audible quality, offline, engineering or production claims.

## Required verdict
```yaml
PACKET_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL
LESSON_VERDICTS:
- each exact lesson ID: PASS | FIX | FAIL and reason
CARD_VERDICTS:
- each card ID or complete explicit PASS ranges; exact replacement text for FIX
WORKED_MODEL_VERDICTS:
- each lesson ID: PASS | FIX
RECALL_VERDICTS:
- each recall ID, exact key or OPEN_UNSCORED, verdict
QUICK_SELF_CHECK_VERDICTS:
- each QC ID, key and verdict
TRANSFER_AND_FLASHCARD_VERDICTS:
- each lesson ID: PASS | FIX
SCORED_BANK_LEAKAGE_AUDIT:
- each lesson: exact compared count / expected count and leakage count
- all 29 exact question IDs: NO_LEAKAGE | LEAKAGE with explanation for any finding
PRE_EXISTING_SCORED_BANK_FINDINGS:
- exact IDs and explanation, separate from overlay findings
REQUIRED_CORRECTIONS: NONE | exact replacements with IDs
OPTIONAL_IMPROVEMENTS: NONE | specific suggestions
LEARNER_DATA_AND_SCORING_SCOPE: READ_ONLY_REFERENCE_AND_UNSCORED_TEACHING_OVERLAY
AUDIO_QUALITY_AND_ENGINEERING: OUT_OF_SCOPE / NOT_TESTED
PRODUCTION_RELEASE: NOT_AUTHORIZED
```
Then answer the eight questions. Academic PASS does not authorize merge, deployment or production activation.
