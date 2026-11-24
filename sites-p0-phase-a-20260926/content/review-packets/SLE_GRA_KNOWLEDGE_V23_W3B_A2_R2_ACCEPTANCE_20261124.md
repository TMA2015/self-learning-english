# Wave 3B R2 academic acceptance — 2026-11-24

Owner approved R1 visual layout. Independent NotebookLM R1 PASS (8/8 lessons, 16/16 self-checks); full scored-bank leakage screening remained outside its scope. Targeted reconciliation R2 independent PASS, 3/3 replacements, R1 approval retained, no mandatory or optional corrections. Reviewed only GRA-A2-09–16, not Wave 3A. Production not authorized.

- A2-14: If butter gets warm enough, it melts. (Q1 overlap removed.)
- A2-12: You should to pack a snack. → You should pack a snack. (Q1 near overlap removed.)
- A2-12: Should I bring a map? (Q7 scenario overlap removed.)
- Engineering preflight: canonical curriculum Git blob 9d931a6930b8cd3ed918db1fa22e8708b7a9f884; 80 scored items / 356 prompt, option and filled fields. Zero exact/contained sentence matches in screened examples, table/diagram cells, mistakes, QC prompts/options and completed gaps. One adjudicated shared grammar frame A2-11-Q9: She is going to join / She is going to practise tonight, different lexical scenario. Not a semantic exhaustive guarantee.
- Original R2 HTML Git blob 59b7462bb8ac56ee52d0088f3b8b9d4eb74f6d94, SHA256 6e5e7704123fc6949d41e87140ab001d1a4a4387baca7236f7cf2c814f2fac82. Canonically sorted extracted sections Git blob 5674b42d629f9472bf72eceacbccc9d8e39ff049, independently matched from HTML and staged JSON. 58 sections, 34 examples, 16 unscored quick checks, 2 SVGs. Engineering/browser QA remains separate.

## Reconciliation source text

# SLE-GRA-KNOWLEDGE-V23-W3B-A2-R2-20261124 — targeted academic reconciliation

**Status:** R1 received Owner visual PASS and independent NotebookLM PASS (8 lessons, 16 checks, no academic changes), with scored-bank leakage audit NOT_VERIFIED. R2 is a proposed text-only correction, not yet independently approved. No implementation/merge/deploy. Baseline curriculum 1.28.0, Git blob `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`; normative SLE-MASTER-001 v1.2.1.

**R1 HTML SHA-256:** `daa7d2c05b0310da217fd05e4af4795db7a38cad833e0dc70dbf5ed282416d7b`
**R2 source HTML:** `SLE_Grammar_Knowledge_v23_Wave3B_A2_Review_R2.html`
**R2 SHA-256:** `6e5e7704123fc6949d41e87140ab001d1a4a4387baca7236f7cf2c814f2fac82`

## Reconciliation findings and exact replacements

A normalized exact/substring and token-trigram comparison of extracted contextual teaching sentences, wrong/right pairs, selected formula-table examples, check stems and sentence options against the 80 same-lesson scored items (prompts, options and accepted-answer expansions) was followed by examination of the returned scored items. This is a lexical screening plus contextual review, not proof of all possible semantic overlap. Shared grammar patterns and generic answers are expected; reproducing a scored sentence is not. The R1 audit found one direct correct-option match and two related A2-12 near overlaps that are conservatively removed. A2-11 generic 'She is going to' overlap is an expected grammar frame, with different verbs and contexts.

| Lesson / section | R1 text | Proposed R2 text | Scored-bank evidence |
| --- | --- | --- | --- |
| GRA-A2-14 / 5 / example 2 | If water freezes, it becomes ice. | If butter gets warm enough, it melts. | GRA-A2-14-Q1 correct option A, exact R1 match; new sentence uses a different physical fact. |
| GRA-A2-12 / 5 / mistake 1 | You should to rest. → You should rest. | You should to pack a snack. → You should pack a snack. | GRA-A2-12-Q1 option A 'You should rest for a while.' and distractor B 'You should to rest for a while.'; remove shared near-identical correction pair. |
| GRA-A2-12 / 4 / example 3 | Should I take an umbrella? | Should I bring a map? | GRA-A2-12-Q7 option A 'You should take an umbrella; it may rain.'; preventive separation of same lexical situation. |

### Exact relevant baseline items (reviewer-only; not learner-facing)

- GRA-A2-14-Q1: Choose the zero conditional sentence about a general fact. A. If water freezes, it becomes ice. [KEY]; B. If water will freeze, it becomes ice.; C. If water freezes, it will becomes ice.; D. If water freeze, it becomes ice.
- GRA-A2-12-Q1: Your friend has a headache after a long day. Which advice is grammatically correct? A. You should rest for a while. [KEY]; B. You should to rest for a while.; C. You should resting for a while.; D. You should rested for a while.
- GRA-A2-12-Q7: Which sentence is advice rather than a school rule? A. You should take an umbrella; it may rain. [KEY]; B. Students must wear their ID cards in the exam room.; C. You must not use your phone during the test.; D. Visitors have to sign in at reception.
- GRA-A2-11-Q9: Which future sentence is grammatically correct? A. She is going to practise tonight. [KEY]; B. She going to practise tonight.; C. She will practises tonight.; D. She is going practise tonight. The teaching sentence 'She is going to join.' shares the necessary grammatical frame but not the scored sentence or context.

## Targeted review questions

1. Are the three targeted replacements grammatically accurate, natural, A2-appropriate, consistent with the existing English/Vietnamese explanations and prior accepted objectives?
2. Do the replacements resolve the disclosed direct and near overlaps without weakening the teaching function? Distinguish expected shared grammar patterns from direct answer disclosure. Review only the supplied evidence; do not claim a fresh exhaustive scored-bank audit from these four item excerpts.
3. Does the R1 Academic PASS remain valid for the unchanged content, including the 16 Quick Self-Checks? Require exact edits if necessary. No Wave 3A, engineering, browser or production verdict is requested.

## Required verdict format

PACKET_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE

- R2 replacement verdicts: three entries keyed by lesson and section.
- Disclosed overlap reconciliation: PASS / REQUIRED_CHANGES / INSUFFICIENT_EVIDENCE.
- Unchanged R1 academic scope: retained / not retained, with reason.
- Required corrections: exact text, or NONE.
- Optional improvements: list or NONE.
- Full scored-bank verification: engineering screening outside NotebookLM; no broader independent claim beyond supplied evidence.
- ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED.
- PRODUCTION_RELEASE: NOT_AUTHORIZED.

## Full R2 teaching text for context

Only the four sentence strings listed above are changed; all other instructional text, bilingual support and quiz content is identical to R1. Baseline graded questions are not part of this overlay.

## GRA-A2-09 — Present perfect: ever and never

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Talk about experiences up to now.
* ✓Ask about experiences.
* ✓Contrast experiences with a finished past time.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

Life experience without a stated finished past time → have/has + past participle. Ever commonly appears in experience questions; never means not at any time up to now.

Vietnamese: Hiện tại hoàn thành diễn tả trải nghiệm đến hiện tại mà không nêu thời điểm quá khứ đã kết thúc. Ever thường dùng trong câu hỏi; never nghĩa là chưa từng.

### 3. Compare Experience & Finished Past Time

*Vietnamese heading:* So sánh trải nghiệm và thời điểm quá khứ

| Pattern | Meaning / use |
| --- | --- |
| **have/has + past participle** | write → written; give → given; choose → chosen |
| **Have/Has + subject + ever + participle?** | Ask about experience. |
| **have/has + never + participle** | Say an experience has not happened. |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Experience

I have painted a mural.

**Why:** The experience matters, not its date.

Vietnamese: Điều quan trọng là trải nghiệm, không phải ngày xảy ra.

#### 2. Ever

Has Lin ever caught a fish?

**Why:** Has + subject + ever + participle.

Vietnamese: Has + chủ ngữ + ever + quá khứ phân từ.

#### 3. Never

They have never slept in a tent.

**Why:** Never already expresses a negative meaning.

Vietnamese: Never đã mang nghĩa phủ định.

#### 4. Finished past

I painted a mural in 2024.

**Why:** A finished past time: use past simple.

Vietnamese: Thời điểm quá khứ đã kết thúc: dùng quá khứ đơn.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ She has wrote a poem.

✓ She has written a poem.

**Why:** Use the past participle.

Vietnamese: Dùng quá khứ phân từ.

✗ We have arrived yesterday.

✓ We arrived yesterday.

**Why:** Yesterday is a finished past time.

Vietnamese: Yesterday là thời điểm quá khứ đã kết thúc.

### Remember

Experience or a finished dated event? Check the auxiliary and participle.

Vietnamese: Phân biệt trải nghiệm và sự kiện có thời điểm đã kết thúc. Kiểm tra trợ động từ và quá khứ phân từ.

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-09-QC1** — 1. Complete with the past participle: Has your cousin ever ___ (write) a song?

- A. written **[KEY]**
- B. wrote
- C. write

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): After has, use written.
Vietnamese feedback: Sau has, dùng written.

**GRA-A2-09-QC2** — 2. The visit happened in 2023. Which sentence fits?

- A. We have visited the zoo in 2023.
- B. We visited the zoo in 2023. **[KEY]**
- C. We have visit the zoo in 2023.

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): A stated finished past time normally takes past simple.
Vietnamese feedback: Thời điểm quá khứ đã kết thúc thường đi với quá khứ đơn.

## GRA-A2-10 — Present perfect: just, already and yet

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Use just for very recent events.
* ✓Use already for events completed before now.
* ✓Use yet in common questions and negatives.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

Just = a very short time ago; already = before now, sometimes earlier than expected; yet = up to now, commonly in questions and negatives. These are common positions, not universal rules.

Vietnamese: Just: vừa mới; already: đã rồi; yet: chưa/đã…chưa. Vị trí nêu ở đây là cách dùng thường gặp.

### 3. Compare Just, Already & Yet

*Vietnamese heading:* So sánh just, already và yet

| Pattern | Meaning / use |
| --- | --- |
| **have/has + just/already + participle** | Common middle position. |
| **Have/Has + subject + participle + yet?** | Common question pattern. |
| **haven’t/hasn’t + participle + yet** | Common negative pattern. |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Just

The lights have just gone out.

**Why:** A very recent event.

Vietnamese: Sự kiện vừa mới xảy ra.

#### 2. Already

Nora has already watered the plants.

**Why:** The job is done before now.

Vietnamese: Công việc đã hoàn thành trước hiện tại.

#### 3. Yet: question

Has the film started yet?

**Why:** Ask whether an expected event has happened.

Vietnamese: Hỏi sự kiện mong đợi đã xảy ra chưa.

#### 4. Yet: negative

I haven’t printed the ticket yet.

**Why:** The expected action has not happened so far.

Vietnamese: Việc mong đợi vẫn chưa xảy ra.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ He has just went outside.

✓ He has just gone outside.

**Why:** Use the participle gone.

Vietnamese: Dùng quá khứ phân từ gone.

✗ I hasn’t booked a seat yet.

✓ I haven’t booked a seat yet.

**Why:** I takes have, not has.

Vietnamese: I đi với have, không đi với has.

### Remember

A finished time such as last Friday normally calls for past simple in this context.

Vietnamese: Thời điểm đã kết thúc như last Friday thường dùng quá khứ đơn trong ngữ cảnh này.

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-10-QC1** — 1. The door opened a few seconds ago. Complete: The shop has ___ opened.

- A. yet
- B. just **[KEY]**
- C. never

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Just describes a very recent action.
Vietnamese feedback: Just diễn tả hành động vừa mới xảy ra.

**GRA-A2-10-QC2** — 2. Complete: We haven’t sent the invitation ___.

- A. already
- B. just
- C. yet **[KEY]**

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Yet commonly ends a negative statement about an expected action.
Vietnamese feedback: Yet thường đứng cuối câu phủ định về việc mong đợi.

## GRA-A2-11 — Choosing future forms

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Choose a future form by situation.
* ✓Build all three patterns correctly.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

English future forms overlap. Will often expresses an immediate decision or prediction; going to often expresses a prior intention or prediction based on current evidence; present continuous often highlights an arrangement.

Vietnamese: Will thường dùng cho quyết định ngay lúc nói hoặc dự đoán; going to cho dự định đã có/dấu hiệu hiện tại; hiện tại tiếp diễn cho lịch hẹn đã sắp xếp. Các cách dùng có thể giao nhau.

### 3. Choose the Future Form

*Vietnamese heading:* Chọn dạng diễn đạt tương lai

| Pattern | Meaning / use |
| --- | --- |
| **will + base verb** | I will join. |
| **am/is/are going to + base verb** | She is going to join. |
| **am/is/are + verb-ing** | We are joining at noon. |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Immediate decision

“I need a pencil.” “I’ll lend you one.”

**Why:** The offer is made now.

Vietnamese: Lời đề nghị được đưa ra ngay lúc nói.

#### 2. Prior intention

I’m going to grow herbs this spring.

**Why:** The intention existed before speaking.

Vietnamese: Dự định có từ trước lúc nói.

#### 3. Evidence

That glass is shaking. It’s going to fall.

**Why:** Visible evidence suggests a prediction.

Vietnamese: Dấu hiệu nhìn thấy được làm cơ sở dự đoán.

#### 4. Arrangement

We’re visiting the dentist at 3 tomorrow.

**Why:** A specific appointment is arranged.

Vietnamese: Cuộc hẹn cụ thể đã được sắp xếp.

#### 5. Prediction

I think our team will win.

**Why:** A prediction; no present evidence is specified.

Vietnamese: Một dự đoán; không nêu dấu hiệu hiện tại.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ He will brings a notebook.

✓ He will bring a notebook.

**Why:** Use the base form.

Vietnamese: Dùng động từ nguyên mẫu.

✗ They going to plant flowers.

✓ They are going to plant flowers.

**Why:** Include be.

Vietnamese: Không bỏ động từ be.

### Remember

Read the whole context; do not treat the three forms as mutually exclusive rules.

Vietnamese: Đọc toàn bộ ngữ cảnh; ba dạng không phải quy tắc loại trừ nhau.

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-11-QC1** — 1. Complete using will: “I’m thirsty.” “I ___ (get) you some water.”

- A. will get **[KEY]**
- B. will getting
- C. will gets

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Will takes a base verb.
Vietnamese feedback: Sau will dùng động từ nguyên mẫu.

**GRA-A2-11-QC2** — 2. Which form best highlights an agreed appointment?

- A. Present continuous **[KEY]**
- B. Past simple
- C. Present perfect

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Present continuous often highlights a future arrangement.
Vietnamese feedback: Hiện tại tiếp diễn thường nhấn mạnh kế hoạch đã sắp xếp.

## GRA-A2-12 — Advice with should and shouldn’t

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Give positive and negative advice.
* ✓Ask for advice.
* ✓Distinguish advice from rules.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

Should + base verb recommends an action; shouldn’t advises against it. Must can express a stronger requirement.

Vietnamese: Should + nguyên mẫu: nên; shouldn’t: không nên. Must có thể diễn tả yêu cầu bắt buộc.

### 3. Build Advice & Advice Questions

*Vietnamese heading:* Cấu trúc lời khuyên và câu hỏi

| Pattern | Meaning / use |
| --- | --- |
| **should + base verb** | You should read. |
| **should not / shouldn’t + base verb** | You shouldn’t rush. |
| **Should + subject + base verb?** | Should we wait? |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Advice

You should label your folders.

**Why:** A helpful suggestion.

Vietnamese: Lời gợi ý hữu ích.

#### 2. Negative advice

You shouldn’t share your password.

**Why:** Advice against an action.

Vietnamese: Khuyên không thực hiện một hành động.

#### 3. Question

Should I bring a map?

**Why:** Ask for advice.

Vietnamese: Xin lời khuyên.

#### 4. Rule versus advice

You must show your ticket to enter; you should arrive early.

**Why:** A requirement contrasts with a recommendation.

Vietnamese: Phân biệt yêu cầu bắt buộc và lời khuyên.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ You should to pack a snack.

✓ You should pack a snack.

**Why:** No to after should.

Vietnamese: Không thêm to sau should.

✗ Should she brings a pen?

✓ Should she bring a pen?

**Why:** Use the base verb.

Vietnamese: Dùng động từ nguyên mẫu.

### Remember

Is the speaker recommending something or stating a requirement?

Vietnamese: Người nói đang khuyên hay nêu yêu cầu bắt buộc?

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-12-QC1** — 1. Complete: You should ___ your work before handing it in.

- A. checking
- B. to check
- C. check **[KEY]**

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Should takes the base form.
Vietnamese feedback: Sau should dùng động từ nguyên mẫu.

**GRA-A2-12-QC2** — 2. Which is a question asking for advice?

- A. Should we leave now? **[KEY]**
- B. We should leave now.
- C. We shouldn’t leave now.

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Put Should before the subject.
Vietnamese feedback: Đặt Should trước chủ ngữ.

## GRA-A2-13 — Possibility with may, might and could

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Express uncertain possibilities.
* ✓Form modal phrases and negative possibilities.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

May, might and could can express possibility. Their meanings overlap: do not assign fixed probability percentages. May not / might not can express negative possibility in context.

Vietnamese: May/might/could + nguyên mẫu diễn tả khả năng chưa chắc chắn. Không gán xác suất cố định. Might not/may not có thể diễn tả khả năng không xảy ra.

### 3. Build Possibility with Modals

*Vietnamese heading:* Diễn tả khả năng bằng động từ khuyết thiếu

| Pattern | Meaning / use |
| --- | --- |
| **may/might/could + base verb** | It may work. |
| **may not / might not + base verb** | It might not work. |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. May

The museum may close early.

**Why:** Closing is possible, not certain.

Vietnamese: Việc đóng cửa có thể xảy ra nhưng chưa chắc chắn.

#### 2. Might

Ella might join the choir.

**Why:** Her decision is not certain.

Vietnamese: Quyết định của Ella chưa chắc chắn.

#### 3. Could

The noise could come from upstairs.

**Why:** One possible explanation.

Vietnamese: Một cách giải thích có thể đúng.

#### 4. Negative possibility

The picnic might not happen tomorrow.

**Why:** The event is uncertain, not prohibited.

Vietnamese: Sự kiện chưa chắc xảy ra; không phải bị cấm.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ The train might arrives late.

✓ The train might arrive late.

**Why:** A modal takes the base verb.

Vietnamese: Sau động từ khuyết thiếu dùng nguyên mẫu.

✗ It could to snow.

✓ It could snow.

**Why:** No to in this pattern.

Vietnamese: Không thêm to trong cấu trúc này.

### Remember

Possible, not certain. If a task specifies a modal, follow that instruction.

Vietnamese: Có thể, không chắc chắn. Nếu đề yêu cầu động từ khuyết thiếu cụ thể, hãy làm theo.

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-13-QC1** — 1. Choose the correct modal pattern.

- A. She may to call.
- B. She may calls.
- C. She may call. **[KEY]**

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): May takes a base verb.
Vietnamese feedback: Sau may dùng động từ nguyên mẫu.

**GRA-A2-13-QC2** — 2. “The club might not open today” means…

- A. It is certain to open.
- B. It is possible that it will not open. **[KEY]**
- C. Opening is forbidden.

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Might not expresses negative possibility here.
Vietnamese feedback: Might not ở đây diễn tả khả năng sự việc không xảy ra.

## GRA-A2-14 — Zero and first conditionals

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Distinguish regular results from realistic future possibilities.
* ✓Use the basic zero and first conditional patterns.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

Zero conditional often describes a regular result or general fact. First conditional often describes a realistic future possibility and its result. The lesson focuses on basic patterns.

Vietnamese: Loại 0: kết quả thường xuyên/sự thật. Loại 1: khả năng thực tế trong tương lai. Đây là hai mẫu cơ bản.

### 3. See the Condition & Result

*Vietnamese heading:* Sơ đồ điều kiện và kết quả

Diagram: Condition → Result. Caption: If-clause → result clause. Accessible label: If-clause → result clause.

### 4. Compare the Conditional Patterns

*Vietnamese heading:* So sánh cấu trúc câu điều kiện

| Pattern | Meaning / use |
| --- | --- |
| **If + present simple → present simple** | Zero: regular result. |
| **If + present simple → will + base verb** | First: possible future result. |

### 5. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Regular result

If I forget my glasses, I find reading difficult.

**Why:** This is a repeated situation.

Vietnamese: Tình huống lặp lại.

#### 2. General fact

If butter gets warm enough, it melts.

**Why:** A general physical result.

Vietnamese: Kết quả vật lý thường đúng.

#### 3. Future possibility

If the weather improves tomorrow, we will cycle to school.

**Why:** One possible future event and result.

Vietnamese: Một khả năng tương lai và kết quả tương ứng.

#### 4. Reversed order

We will take a taxi if the train is cancelled.

**Why:** Same relation; normally no comma with if-clause last.

Vietnamese: Đổi thứ tự mệnh đề; thường không có dấu phẩy khi if đứng sau.

### 6. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ If she will finish early, we will leave.

✓ If she finishes early, we will leave.

**Why:** In this basic first conditional, the if-clause uses present simple.

Vietnamese: Trong mẫu điều kiện loại 1 cơ bản, mệnh đề if dùng hiện tại đơn.

✗ If the bell ring, we go inside.

✓ If the bell rings, we go inside.

**Why:** A singular subject takes rings.

Vietnamese: Chủ ngữ số ít dùng rings.

### Remember

Choose meaning first; the word if alone does not identify the conditional type.

Vietnamese: Chọn theo ý nghĩa trước; chỉ từ if không đủ để xác định loại câu.

### 7. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-14-QC1** — 1. Every day, this is what happens: If the alarm rings, the dog ___.

- A. barks **[KEY]**
- B. bark
- C. will barking

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): A regular result uses present simple; dog takes barks.
Vietnamese feedback: Kết quả thường xuyên dùng hiện tại đơn; dog đi với barks.

**GRA-A2-14-QC2** — 2. A possible plan for tomorrow: If the pool is open, we ___.

- A. will swim **[KEY]**
- B. will swimming
- C. will swims

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): The basic first conditional uses will + base verb in the result.
Vietnamese feedback: Mệnh đề kết quả của mẫu loại 1 cơ bản dùng will + nguyên mẫu.

## GRA-A2-15 — Common verb patterns: to-infinitive and -ing

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Learn frequent verb patterns as chunks.
* ✓Choose to-infinitive or -ing according to the first verb.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

The first verb often determines the form of the next verb. Want, plan, hope and decide commonly take to + base verb in these patterns; enjoy and finish take -ing.

Vietnamese: Học theo cụm động từ: want/plan/hope/decide + to V; enjoy/finish + V-ing trong các mẫu đang học.

### 3. Compare To-infinitive & -ing Patterns

*Vietnamese heading:* So sánh mẫu to + V và V-ing

| Pattern | Meaning / use |
| --- | --- |
| **want / plan / hope / decide + to + base verb** | Learn the whole chunk. |
| **enjoy / finish + verb-ing** | Learn the whole chunk. |

### 4. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Want

I want to design a poster.

**Why:** Want + to + base verb.

Vietnamese: Want + to + nguyên mẫu.

#### 2. Plan and hope

We plan to camp; I hope to see the stars.

**Why:** Both use to + base verb here.

Vietnamese: Cả hai dùng to + nguyên mẫu trong ngữ cảnh này.

#### 3. Decide

He decided to repair the lamp.

**Why:** Decide + to + base verb.

Vietnamese: Decide + to + nguyên mẫu.

#### 4. Enjoy

Lia enjoys making bracelets.

**Why:** Enjoy + -ing.

Vietnamese: Enjoy + V-ing.

#### 5. Finish

They finished folding the paper.

**Why:** Finish + -ing.

Vietnamese: Finish + V-ing.

### 5. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ I enjoy to draw maps.

✓ I enjoy drawing maps.

**Why:** Enjoy takes -ing in this meaning.

Vietnamese: Enjoy đi với V-ing trong nghĩa này.

✗ We hope seeing you.

✓ We hope to see you.

**Why:** Hope takes to + base verb here.

Vietnamese: Hope đi với to + nguyên mẫu ở đây.

### Remember

Other verbs can allow multiple patterns; learn each separately.

Vietnamese: Các động từ khác có thể đi với nhiều mẫu; hãy học từng mẫu riêng.

### 6. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-15-QC1** — 1. Complete: I decided ___ the red fabric.

- A. choosing
- B. to choose **[KEY]**
- C. choose

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Decide + to + base verb.
Vietnamese feedback: Decide + to + nguyên mẫu.

**GRA-A2-15-QC2** — 2. Complete: She enjoys ___ clay models.

- A. to make
- B. make
- C. making **[KEY]**

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Enjoy + -ing.
Vietnamese feedback: Enjoy + V-ing.

## GRA-A2-16 — Defining relative clauses: who, which and that

### 1. What you will learn

*Vietnamese heading:* Mục tiêu bài học

* ✓Identify people and things using defining subject relative clauses.
* ✓Avoid repeating the subject.

### 2. The Core Idea

*Vietnamese heading:* Ý cốt lõi

A defining clause gives information needed to identify a person or thing. In the subject-relative patterns here, use who/that for people and which/that for things; the relative word itself is the subject.

Vietnamese: Mệnh đề quan hệ xác định giúp nhận ra người/vật nào. Người: who/that; vật: which/that. Không lặp chủ ngữ khi từ quan hệ đã làm chủ ngữ.

### 3. See How the Clause Identifies

*Vietnamese heading:* Sơ đồ xác định người hoặc vật

Diagram: Noun → Identifying clause. Caption: Person or thing → who / which / that + verb. Accessible label: Person or thing → who / which / that + verb.

### 4. Choose the Relative Word

*Vietnamese heading:* Chọn từ quan hệ phù hợp

| Pattern | Meaning / use |
| --- | --- |
| **person + who/that + verb** | The person who cooks… |
| **thing + which/that + verb** | The lamp that shines… |

### 5. How to Use in Context

*Vietnamese heading:* Cách dùng qua ví dụ thực tế

#### 1. Person

The woman who fixes bicycles lives nearby.

**Why:** Who identifies the woman.

Vietnamese: Who giúp xác định người phụ nữ.

#### 2. Person with that

The boy that carries the drum is my friend.

**Why:** That is also possible here.

Vietnamese: That cũng có thể dùng ở đây.

#### 3. Thing

The machine which cuts paper is noisy.

**Why:** Which identifies the thing.

Vietnamese: Which giúp xác định vật.

#### 4. Thing with that

The box that contains the tools is heavy.

**Why:** That can refer to a thing.

Vietnamese: That cũng có thể chỉ vật.

### 6. Common Mistakes to Avoid

*Vietnamese heading:* Lỗi sai thường gặp

✗ The child who he reads aloud is my cousin.

✓ The child who reads aloud is my cousin.

**Why:** Who is the subject; omit he.

Vietnamese: Who đã là chủ ngữ; bỏ he.

✗ The bike that it has a basket is blue.

✓ The bike that has a basket is blue.

**Why:** That is the subject; omit it.

Vietnamese: That đã là chủ ngữ; bỏ it.

### Remember

This lesson covers defining subject relative clauses, not every kind of relative clause. Both who/that or which/that may be valid.

Vietnamese: Bài này chỉ xét mệnh đề quan hệ xác định mà từ quan hệ làm chủ ngữ. Who/that hoặc which/that đều có thể đúng.

### 7. Quick Self-Check

*Vietnamese heading:* Tự kiểm tra nhanh, không tính điểm

Try these before starting practice. This is unscored and is not saved to your results.

**GRA-A2-16-QC1** — 1. Which pair can identify a person in this pattern?

- A. which / when
- B. who / that **[KEY]**
- C. where / which

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): Who or that can introduce a defining clause about a person.
Vietnamese feedback: Who hoặc that có thể mở đầu mệnh đề xác định về người.

**GRA-A2-16-QC2** — 2. Choose the sentence without a repeated subject.

- A. The robot that it moves is small.
- B. The robot that moves is small. **[KEY]**
- C. The robot which it moves is small.

Feedback (shared explanation; wrong answer prefixed “Try again.”, correct answer prefixed “✓”): That is already the subject of moves.
Vietnamese feedback: That đã làm chủ ngữ của moves.
