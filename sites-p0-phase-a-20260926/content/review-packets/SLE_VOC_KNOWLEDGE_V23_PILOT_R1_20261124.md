# SLE-VOC-KNOWLEDGE-V23-PILOT-R1-20261124

## Targeted reconciliation review

R0 independent verdict: PASS_WITH_REQUIRED_CHANGES. VOC-A2-01 and VOC-B1-02 PASS; VOC-A1-01 requires two corrected examples and matching speech strings. All other cards, six recall tasks, six quick checks, flashcards, transfer and 29 baseline items were reviewed PASS; zero leakage and no pre-existing bank findings. This round is a targeted retest, not a new design review. Candidate HTML `SLE_Vocabulary_Knowledge_v2.3_Pilot_R1.html` SHA-256 `e6d2773266a5c637c59cc0e6d97f7ef670d139d0a44ecd7b99970c9c7f4892dd`. R0 HTML SHA-256 `db0853b7d4cf741f5d3050dca9b422e5c089723930bc352bb708fe86a73cc398`; R0 packet SHA-256 `a3543ea8d8f9c551f44537bb8e99d29a8832c299e98158948cc9934a974da551`. Base curriculum 1.28.0, Git blob `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`, production commit `63b3912134ca3bc0097d7c39805358ff2825990f`. SLE-MASTER-001 v1.2.1. Owner accepted visual design and audible default TTS on tested device only. No website integration or deployment.

## Exact corrections

- VOC-A1-01-CARD-10: old example: A student cannot follow a long instruction. New example: When the guide spoke fast, Minh asked, "Sorry, could you speak more slowly?" The example speaker string and mini-flashcard example are synchronized to the new sentence; the term, meaning and VI translation are unchanged.
- VOC-A1-01-CARD-11: old example: A student has finished an art project. New example: After finishing her model, Lan asked, "Could you show me where to put this?" The example speaker string and mini-flashcard example are synchronized to the new sentence; the term, meaning and VI translation are unchanged.
- VOC-A1-01-CARD-06: optional R0 improvement applied: exact term speech string "borrow   from  " → "borrow from" (spacing only). Displayed term and example unchanged.

## Review questions (targeted)

1. Verify CARD-10 and CARD-11 use the target request naturally in an age/level-appropriate context. Check both exact speech arrays and corresponding flashcard examples in Appendix A. Are the R0 required corrections resolved without new ambiguity or direct scored-bank leakage?
2. Verify CARD-06 normalized spoken text preserves the intended lexical pattern. Do not certify audible quality from text.
3. Confirm all other R0 PASS findings can be carried forward, subject to the stated unchanged scope. Flag any new issue introduced by the three edits; do not reopen unrelated content without specific evidence. Appendix B is unchanged from R0, for leakage cross-check only.

## Required verdict

PACKET_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE
RETEST_VERDICTS: VOC-A1-01-CARD-10, CARD-11, CARD-06 (including exact speech strings and affected flashcards)
LESSON_VERDICTS: VOC-A1-01; VOC-A2-01 and VOC-B1-02 (carry forward if warranted)
SCORED_BANK_LEAKAGE_AUDIT: changes only, against immutable Appendix B; state limits
REQUIRED_CORRECTIONS: NONE or exact ID, original, replacement, reason and retest scope
OPTIONAL_IMPROVEMENTS: separate
LEARNER_DATA_AND_SCORING_SCOPE: READ_ONLY_REFERENCE_AND_UNSCORED_TEACHING_OVERLAY
AUDIO_QUALITY_AND_ENGINEERING: OUT_OF_SCOPE / NOT_TESTED
PRODUCTION_RELEASE: NOT_AUTHORIZED

## Boundaries

Read-only notes; no scored bank, attempts, scores or canonical curriculum changes. No assessed Listening audio changes. Exact accepted `speak(text)` behavior unchanged (en-GB, 0.92, no explicit voice selection). Open production tasks remain unscored. Permanent sources unchanged; replace temporary R0 packet with this R1 packet. Appendix A contains the full corrected content, Appendix B the unchanged 29 reference items.

## Appendix A — Exact pilot content

## VOC-A1-01 — School places and classroom language

Learning goal Choose a school place, object or action from its meaning, and ask for help politely. Chọn đúng nơi chốn, đồ vật hoặc hành động ở trường; biết hỏi lại lịch sự. Context A new student joins your class. Help her find places, use classroom tools and understand instructions. Một bạn mới vào lớp. Hãy giúp bạn tìm nơi cần đến, sử dụng dụng cụ và hiểu lời hướng dẫn.

### 1 Places at school Nơi chốn ở trường

**VOC-A1-01-CARD-01 — library**
- Meaning: a place for reading and using books
- Vietnamese: thư viện
- Example: Our reading club meets in the library on Friday.
- Exact speech texts: ["library", "Our reading club meets in the library on Friday."]

**VOC-A1-01-CARD-02 — canteen / cafeteria**
- Meaning: a place that serves food
- Vietnamese: căng tin / nhà ăn
- Example: There is a queue at the cafeteria during break.
- Exact speech texts: ["canteen, cafeteria", "There is a queue at the cafeteria during break."]

**VOC-A1-01-CARD-03 — science lab**
- Meaning: a room for practical science
- Vietnamese: phòng thí nghiệm
- Example: Our group wears safety glasses in the science lab.
- Exact speech texts: ["science lab", "Our group wears safety glasses in the science lab."]

**VOC-A1-01-CARD-04 — corridor / hallway**
- Meaning: a passage connecting rooms
- Vietnamese: hành lang
- Example: The art room is at the end of the hallway.
- Exact speech texts: ["corridor, hallway", "The art room is at the end of the hallway."]

### 2 Objects and actions Đồ vật và hành động

**VOC-A1-01-CARD-05 — ruler**
- Meaning: a tool for measuring or marking lengths
- Vietnamese: thước kẻ
- Example: I measure the edge of a paper model with a ruler.
- Exact speech texts: ["ruler", "I measure the edge of a paper model with a ruler."]

**VOC-A1-01-CARD-06 — borrow … from …**
- Meaning: use something temporarily and return it
- Vietnamese: mượn … từ …
- Example: Ella borrows a coloured marker from her friend.
- Exact speech texts: ["borrow from", "Ella borrows a coloured marker from her friend."]

**VOC-A1-01-CARD-07 — lend … to …**
- Meaning: give someone something temporarily
- Vietnamese: cho … mượn
- Example: Ella’s friend lends a marker to her.
- Exact speech texts: ["lend   to  ", "Ella’s friend lends a marker to her."]

**VOC-A1-01-CARD-08 — do homework**
- Meaning: complete schoolwork outside class
- Vietnamese: làm bài tập về nhà
- Example: On Sundays, Jay does his homework before dinner.
- Exact speech texts: ["do homework", "On Sundays, Jay does his homework before dinner."]

**VOC-A1-01-CARD-09 — hand in a worksheet**
- Meaning: give completed work to the teacher
- Vietnamese: nộp phiếu bài tập
- Example: We hand in our worksheets before the bell.
- Exact speech texts: ["hand in a worksheet", "We hand in our worksheets before the bell."]

Giver Receiver lends to borrows from One temporary loan, two viewpoints. Solid arrow: the item moves from giver to receiver. Dashed arrow: the receiver borrows from the giver (the source). Cùng một việc cho mượn: người đưa đồ dùng lend, người nhận dùng borrow.

### 3 Ask for help Hỏi lại lịch sự

**VOC-A1-01-CARD-10 — Sorry, could you speak more slowly?**
- Meaning: ask for slower speech
- Vietnamese: Xin lỗi, thầy/cô có thể nói chậm hơn không?
- Example: When the guide spoke fast, Minh asked, "Sorry, could you speak more slowly?"
- Exact speech texts: ["Sorry, could you speak more slowly?", "When the guide spoke fast, Minh asked, \"Sorry, could you speak more slowly?\""]

**VOC-A1-01-CARD-11 — Could you show me where to put this?**
- Meaning: ask someone to show you a place
- Vietnamese: Bạn có thể chỉ mình đặt cái này ở đâu không?
- Example: After finishing her model, Lan asked, "Could you show me where to put this?"
- Exact speech texts: ["Could you show me where to put this?", "After finishing her model, Lan asked, \"Could you show me where to put this?\""]

### 4 Worked example Ví dụ có hướng dẫn

A friend gives you a spare blue marker to use for five minutes. Who borrows it? You receive it for a short time: you borrow it from your friend. Your friend lends it to you. Decide who receives and who gives. Người nhận để dùng tạm là người mượn; người đưa đồ là người cho mượn.

### 5 Mini Flashcards (optional) Thẻ ôn từ ngay trong bài

Optional, unscored flashcards. Front: word/phrase. Back: meaning, example, optional Vietnamese. Deck in order:

- 1. library → a place for reading and using books; thư viện; Our reading club meets in the library on Friday.
- 2. canteen / cafeteria → a place that serves food; căng tin / nhà ăn; There is a queue at the cafeteria during break.
- 3. science lab → a room for practical science; phòng thí nghiệm; Our group wears safety glasses in the science lab.
- 4. corridor / hallway → a passage connecting rooms; hành lang; The art room is at the end of the hallway.
- 5. ruler → a tool for measuring or marking lengths; thước kẻ; I measure the edge of a paper model with a ruler.
- 6. borrow … from … → use something temporarily and return it; mượn … từ …; Ella borrows a coloured marker from her friend.
- 7. lend … to … → give someone something temporarily; cho … mượn; Ella’s friend lends a marker to her.
- 8. do homework → complete schoolwork outside class; làm bài tập về nhà; On Sundays, Jay does his homework before dinner.
- 9. hand in a worksheet → give completed work to the teacher; nộp phiếu bài tập; We hand in our worksheets before the bell.
- 10. Sorry, could you speak more slowly? → ask for slower speech; Xin lỗi, thầy/cô có thể nói chậm hơn không?; When the guide spoke fast, Minh asked, "Sorry, could you speak more slowly?"
- 11. Could you show me where to put this? → ask someone to show you a place; Bạn có thể chỉ mình đặt cái này ở đâu không?; After finishing her model, Lan asked, "Could you show me where to put this?"

### 6 Recall without looking Tự nhớ không nhìn đáp án

**VOC-A1-01-RECALL-01** — Your teacher asks you to give her a finished drawing. Recall the two-word verb for giving in completed work.
- Check: ["hand in"]
- Hint: Think of the phrase for giving finished work to a teacher.
- Model: hand in

**VOC-A1-01-RECALL-02** — You give your friend a marker for five minutes. Say a sentence with lend.
- Check: OPEN_UNSCORED (model comparison only)
- Hint: None
- Model: I lend my friend a marker. / I lend a marker to my friend.

### 7 Quick Self-Check Tự kiểm tra nhanh

**VOC-A1-01-QC-01** — 1. Your teacher collects finished drawings. Which phrase describes giving yours to her?
- A. hand in my drawing [KEY] — EN: Hand in means give completed work to the teacher. | VI: Hand in là nộp bài đã hoàn thành.
- B. borrow my drawing [DISTRACTOR] — EN: Borrow means receive temporarily. | VI: Borrow là nhận để dùng tạm.
- C. lend my drawing [DISTRACTOR] — EN: Lend means give temporarily, not submit work. | VI: Lend là cho mượn tạm, không phải nộp bài.

**VOC-A1-01-QC-02** — 2. You give a friend your coloured marker until the bell. Which sentence matches?
- A. I lend my marker to my friend. [KEY] — EN: You are the giver, so lend fits. | VI: Bạn là người đưa đồ nên dùng lend.
- B. I borrow a marker from my friend. [DISTRACTOR] — EN: Borrow describes the receiver, not the giver. | VI: Borrow nói về người nhận, không phải người đưa.
- C. I keep my marker. [DISTRACTOR] — EN: The marker is being given temporarily. | VI: Bạn đang đưa bút cho người khác dùng tạm.

### 8 Use it in a new situation Vận dụng vào ngữ cảnh mới

Imagine a new classmate wants to join an art club. Say one sentence about a school place and one polite question asking for help. Self-check criteria Check: Is the place suitable? Is the question polite and clear? Your own sentences may differ. One possible model: The music room is next to the hall. Could you tell me where the club meets? Other natural answers are possible. Open response · self-practice only · no automatic score.

Remember Learn meaning, notice the whole phrase or word form, recall it, then use it in a different context. Hiểu nghĩa, chú ý cả cụm hoặc dạng từ, tự nhớ rồi vận dụng trong ngữ cảnh khác.

## VOC-A2-01 — Daily routines and useful phrases

Learning goal Recognise and recall natural routine chunks; choose a phrase that fits a new situation. Nhận biết, nhớ và chọn cụm từ tự nhiên phù hợp với tình huống sinh hoạt. Context Plan a busy day with school, travel, shared activities and chores. Learn the whole phrase rather than translating each word separately. Lập kế hoạch cho một ngày có học tập, đi lại, hoạt động chung và việc nhà. Học cả cụm từ.

### 1 Morning and travel Buổi sáng và đi lại

**VOC-A2-01-CARD-01 — make breakfast**
- Meaning: prepare the morning meal
- Vietnamese: chuẩn bị bữa sáng
- Example: On a camping trip, Nia makes breakfast for her group.
- Exact speech texts: ["make breakfast", "On a camping trip, Nia makes breakfast for her group."]

**VOC-A2-01-CARD-02 — make the bed**
- Meaning: arrange the bedding neatly
- Vietnamese: dọn giường
- Example: Leo makes his bed when he stays at his cousin’s house.
- Exact speech texts: ["make the bed", "Leo makes his bed when he stays at his cousin’s house."]

**VOC-A2-01-CARD-03 — brush your teeth**
- Meaning: clean your teeth with a toothbrush
- Vietnamese: đánh răng
- Example: After a snack, I brush my teeth before the trip.
- Exact speech texts: ["brush your teeth", "After a snack, I brush my teeth before the trip."]

**VOC-A2-01-CARD-04 — catch / miss a bus**
- Meaning: get on in time / arrive too late
- Vietnamese: kịp / lỡ xe buýt
- Example: The match ended early, so the fans caught the last bus.
- Exact speech texts: ["catch a bus, miss a bus", "The match ended early, so the fans caught the last bus."]

**VOC-A2-01-CARD-05 — routine**
- Meaning: a regular way of doing things
- Vietnamese: thói quen, nếp sinh hoạt
- Example: Our club has a different routine on Saturdays.
- Exact speech texts: ["routine", "Our club has a different routine on Saturdays."]

### 2 Study, rest and shared activities Học tập, nghỉ ngơi và hoạt động chung

**VOC-A2-01-CARD-06 — do homework**
- Meaning: complete schoolwork
- Vietnamese: làm bài tập
- Example: We do homework in the study club on rainy afternoons.
- Exact speech texts: ["do homework", "We do homework in the study club on rainy afternoons."]

**VOC-A2-01-CARD-07 — take a break**
- Meaning: pause an activity to rest
- Vietnamese: nghỉ giải lao
- Example: The choir takes a break between rehearsals.
- Exact speech texts: ["take a break", "The choir takes a break between rehearsals."]

**VOC-A2-01-CARD-08 — go for a walk**
- Meaning: walk for pleasure or exercise
- Vietnamese: đi dạo
- Example: My neighbours go for a walk beside the lake.
- Exact speech texts: ["go for a walk", "My neighbours go for a walk beside the lake."]

**VOC-A2-01-CARD-09 — take turns**
- Meaning: alternate in a shared activity
- Vietnamese: thay phiên nhau
- Example: At the music club, two drummers take turns practising.
- Exact speech texts: ["take turns", "At the music club, two drummers take turns practising."]

**VOC-A2-01-CARD-10 — take notes**
- Meaning: write down important information
- Vietnamese: ghi chép
- Example: The visitors take notes during the museum tour.
- Exact speech texts: ["take notes", "The visitors take notes during the museum tour."]

### 3 Household phrases Cụm từ về việc nhà

**VOC-A2-01-CARD-11 — wash / do the dishes**
- Meaning: clean used plates and other dishes
- Vietnamese: rửa bát đĩa
- Example: We do the dishes after our picnic lunch.
- Exact speech texts: ["wash the dishes, do the dishes", "We do the dishes after our picnic lunch."]

**VOC-A2-01-CARD-12 — set / lay the table**
- Meaning: prepare the table for a meal
- Vietnamese: bày bàn ăn
- Example: Our host lays the table for a family celebration.
- Exact speech texts: ["set the table, lay the table", "Our host lays the table for a family celebration."]

### 4 Worked example Ví dụ có hướng dẫn

A student council needs to organise an event. Make a plan or do a plan? Make a plan is the natural chunk. The noun plan pairs with make when you create it. Learn the verb and noun together. Make a plan là lập kế hoạch. Học cặp động từ và danh từ, không dịch từng từ.

### 5 Mini Flashcards (optional) Thẻ ôn từ ngay trong bài

Optional, unscored flashcards. Front: word/phrase. Back: meaning, example, optional Vietnamese. Deck in order:

- 1. make breakfast → prepare the morning meal; chuẩn bị bữa sáng; On a camping trip, Nia makes breakfast for her group.
- 2. make the bed → arrange the bedding neatly; dọn giường; Leo makes his bed when he stays at his cousin’s house.
- 3. brush your teeth → clean your teeth with a toothbrush; đánh răng; After a snack, I brush my teeth before the trip.
- 4. catch / miss a bus → get on in time / arrive too late; kịp / lỡ xe buýt; The match ended early, so the fans caught the last bus.
- 5. routine → a regular way of doing things; thói quen, nếp sinh hoạt; Our club has a different routine on Saturdays.
- 6. do homework → complete schoolwork; làm bài tập; We do homework in the study club on rainy afternoons.
- 7. take a break → pause an activity to rest; nghỉ giải lao; The choir takes a break between rehearsals.
- 8. go for a walk → walk for pleasure or exercise; đi dạo; My neighbours go for a walk beside the lake.
- 9. take turns → alternate in a shared activity; thay phiên nhau; At the music club, two drummers take turns practising.
- 10. take notes → write down important information; ghi chép; The visitors take notes during the museum tour.
- 11. wash / do the dishes → clean used plates and other dishes; rửa bát đĩa; We do the dishes after our picnic lunch.
- 12. set / lay the table → prepare the table for a meal; bày bàn ăn; Our host lays the table for a family celebration.

### 6 Recall without looking Tự nhớ không nhìn đáp án

**VOC-A2-01-RECALL-01** — Your team wants to organise a picnic. Recall the natural phrase meaning create a plan.
- Check: ["make a plan"]
- Hint: Think of the verb used when creating a plan.
- Model: make a plan

**VOC-A2-01-RECALL-02** — You write down key information during a talk. Recall the two-word phrase.
- Check: ["take notes"]
- Hint: Think of the verb that goes with notes.
- Model: take notes

### 7 Quick Self-Check Tự kiểm tra nhanh

**VOC-A2-01-QC-01** — 1. During a workshop, Sam writes key ideas in a notebook. Which phrase describes this action?
- A. take notes [KEY] — EN: Take notes means write down important information. | VI: Take notes là ghi lại các thông tin quan trọng.
- B. do notes [DISTRACTOR] — EN: Do is not the natural verb here. | VI: Do không kết hợp tự nhiên với notes ở đây.
- C. catch notes [DISTRACTOR] — EN: Catch is not the natural verb here. | VI: Catch không phù hợp với nghĩa ghi chép.

**VOC-A2-01-QC-02** — 2. You need to create a list of things for a trip. Choose the natural chunk.
- A. make a list [KEY] — EN: Make a list is a natural phrase for creating a list. | VI: Make a list là lập danh sách.
- B. do a list [DISTRACTOR] — EN: Use make when creating a list. | VI: Dùng make khi tạo danh sách.
- C. catch a list [DISTRACTOR] — EN: Catch does not express creating a list. | VI: Catch không có nghĩa lập danh sách.

### 8 Use it in a new situation Vận dụng vào ngữ cảnh mới

Plan a Saturday club event. Write two new sentences using different routine chunks, one before the event and one after. Self-check criteria Check: Does the verb fit its noun? Do the two sentences form a sensible order? One possible model: Before the event, I make a list of supplies. After the event, we tidy the room. Other natural answers are possible. Open response · self-practice only · no automatic score.

Remember Learn meaning, notice the whole phrase or word form, recall it, then use it in a different context. Hiểu nghĩa, chú ý cả cụm hoặc dạng từ, tự nhớ rồi vận dụng trong ngữ cảnh khác.

## VOC-B1-02 — Word families for study and communication

Learning goal Select a related word form by checking both its grammatical role and its meaning. Chọn dạng từ cùng họ dựa vào vai trò ngữ pháp và nghĩa trong ngữ cảnh. Context You are editing a school project report. The idea may be clear, but the sentence still needs the correct noun, verb, adjective or adverb. Khi sửa báo cáo dự án, ý có thể đúng nhưng câu vẫn cần đúng danh từ, động từ, tính từ hoặc trạng từ.

### 1 Word families in context Họ từ trong ngữ cảnh

**VOC-B1-02-CARD-01 — V decide → N decision**
- Meaning: verb: choose; noun: a choice
- Vietnamese: quyết định (động từ / danh từ)
- Example: The club will decide tomorrow. Its decision will affect the schedule.
- Exact speech texts: ["decide, decision", "The club will decide tomorrow. Its decision will affect the schedule."]

**VOC-B1-02-CARD-02 — V improve → N improvement**
- Meaning: verb: become or make better; noun: a change for the better
- Vietnamese: cải thiện → sự cải thiện
- Example: Mina wants to improve her drawing. Her teacher notices an improvement.
- Exact speech texts: ["improve, improvement", "Mina wants to improve her drawing. Her teacher notices an improvement."]

**VOC-B1-02-CARD-03 — V communicate → N communication**
- Meaning: verb: share information; noun: the process of sharing information
- Vietnamese: giao tiếp → sự giao tiếp
- Example: We communicate through short messages. Clear communication avoids confusion.
- Exact speech texts: ["communicate, communication", "We communicate through short messages. Clear communication avoids confusion."]

**VOC-B1-02-CARD-04 — Adj effective → Adv effectively**
- Meaning: adjective: producing the intended result; adverb: in an effective way
- Vietnamese: hiệu quả → một cách hiệu quả
- Example: The new timetable is effective. It helps us organise rehearsals effectively.
- Exact speech texts: ["effective, effectively", "The new timetable is effective. It helps us organise rehearsals effectively."]

### 2 Expand the pattern Mở rộng cách nhận biết

**VOC-B1-02-CARD-05 — V develop → N development**
- Meaning: verb: grow or create gradually; noun: the process or result
- Vietnamese: phát triển → sự phát triển
- Example: The team develops a prototype during the first stage of development.
- Exact speech texts: ["develop, development", "The team develops a prototype during the first stage of development."]

**VOC-B1-02-CARD-06 — V rely → Adj reliable**
- Meaning: verb: depend; adjective: dependable
- Vietnamese: dựa vào → đáng tin cậy
- Example: The weather sensor is reliable when it is calibrated.
- Exact speech texts: ["rely, reliable", "The weather sensor is reliable when it is calibrated."]

**VOC-B1-02-CARD-07 — V inform → N information → Adj informative**
- Meaning: verb: tell; noun: facts; adjective: giving useful information
- Vietnamese: thông báo → thông tin → giàu thông tin
- Example: The museum guide is informative, so visitors learn a great deal.
- Exact speech texts: ["inform, information, informative", "The museum guide is informative, so visitors learn a great deal."]

**VOC-B1-02-CARD-08 — V/N help → Adj helpful → Adv helpfully**
- Meaning: verb/noun: give support; adjective: useful; adverb: in a helpful way
- Vietnamese: giúp đỡ → hữu ích → một cách hữu ích
- Example: A helpful classmate labelled our boxes.
- Exact speech texts: ["help, helpful, helpfully", "A helpful classmate labelled our boxes."]

**VOC-B1-02-CARD-09 — N/V care → Adj careful → Adv carefully**
- Meaning: noun/verb: attention or concern; adjective: taking care; adverb: with care
- Vietnamese: sự quan tâm → cẩn thận → một cách cẩn thận
- Example: The volunteers carefully carried the glass model.
- Exact speech texts: ["care, careful, carefully", "The volunteers carefully carried the glass model."]

**VOC-B1-02-CARD-10 — V succeed → N success → Adj successful**
- Meaning: verb: achieve a goal; noun: achievement; adjective: achieving a goal
- Vietnamese: thành công (động từ / danh từ / tính từ)
- Example: The team hopes to succeed at the fair. A successful event takes planning.
- Exact speech texts: ["succeed, success, successful", "The team hopes to succeed at the fair. A successful event takes planning."]

### 3 Worked example Ví dụ có hướng dẫn

Edit this sentence: “The volunteers worked ___ during the event.” Choose patient or patiently. Worked is an action. Here the missing word tells how the volunteers worked, so an adverb is appropriate: patiently. Then check the meaning: they stayed calm while working. Suffixes are clues, not automatic rules. Ô trống mô tả cách làm việc nên cần trạng từ patiently. Kiểm tra cả vai trò và nghĩa, không chỉ nhìn hậu tố.

### 4 Mini Flashcards (optional) Thẻ ôn từ ngay trong bài

Optional, unscored flashcards. Front: word/phrase. Back: meaning, example, optional Vietnamese. Deck in order:

- 1. decide, decision → verb: choose; noun: a choice; quyết định (động từ / danh từ); The club will decide tomorrow. Its decision will affect the schedule.
- 2. improve, improvement → verb: become or make better; noun: a change for the better; cải thiện → sự cải thiện; Mina wants to improve her drawing. Her teacher notices an improvement.
- 3. communicate, communication → verb: share information; noun: the process of sharing information; giao tiếp → sự giao tiếp; We communicate through short messages. Clear communication avoids confusion.
- 4. effective, effectively → adjective: producing the intended result; adverb: in an effective way; hiệu quả → một cách hiệu quả; The new timetable is effective. It helps us organise rehearsals effectively.
- 5. develop, development → verb: grow or create gradually; noun: the process or result; phát triển → sự phát triển; The team develops a prototype during the first stage of development.
- 6. rely, reliable → verb: depend; adjective: dependable; dựa vào → đáng tin cậy; The weather sensor is reliable when it is calibrated.
- 7. inform, information, informative → verb: tell; noun: facts; adjective: giving useful information; thông báo → thông tin → giàu thông tin; The museum guide is informative, so visitors learn a great deal.
- 8. help, helpful, helpfully → verb/noun: give support; adjective: useful; adverb: in a helpful way; giúp đỡ → hữu ích → một cách hữu ích; A helpful classmate labelled our boxes.
- 9. care, careful, carefully → noun/verb: attention or concern; adjective: taking care; adverb: with care; sự quan tâm → cẩn thận → một cách cẩn thận; The volunteers carefully carried the glass model.
- 10. succeed, success, successful → verb: achieve a goal; noun: achievement; adjective: achieving a goal; thành công (động từ / danh từ / tính từ); The team hopes to succeed at the fair. A successful event takes planning.

### 5 Recall without looking Tự nhớ không nhìn đáp án

**VOC-B1-02-RECALL-01** — Recall the adverb formed from patient.
- Check: ["patiently"]
- Hint: The worked example describes how someone acts.
- Model: patiently

**VOC-B1-02-RECALL-02** — Write one sentence using a noun and one using an adjective from a word family.
- Check: OPEN_UNSCORED (model comparison only)
- Hint: None
- Model: The club values creativity. Its members are creative.

### 6 Quick Self-Check Tự kiểm tra nhanh

**VOC-B1-02-QC-01** — 1. The group listened ___ while the visitor explained the plan. Choose the form.
- A. attentive [DISTRACTOR] — EN: Adjective: describes a person or thing. | VI: Cần trạng từ chỉ cách lắng nghe, không phải tính từ.
- B. attention [DISTRACTOR] — EN: Noun: the act of paying attention. | VI: Attention là danh từ, không phù hợp ở chỗ trống.
- C. attentively [KEY] — EN: Adverb: describes how they listened. | VI: Attentively là trạng từ chỉ cách lắng nghe.

**VOC-B1-02-QC-02** — 2. The class needs a ___ timetable for the science fair. Choose the form.
- A. flexible [KEY] — EN: An adjective describes the timetable and means it can adapt. | VI: Flexible là tính từ bổ nghĩa cho timetable.
- B. flexibility [DISTRACTOR] — EN: A noun names a quality. | VI: Flexibility là danh từ, không phải tính từ.
- C. flexibly [DISTRACTOR] — EN: An adverb normally describes how something is done. | VI: Flexibly là trạng từ, không trực tiếp bổ nghĩa cho timetable.

### 7 Use it in a new situation Vận dụng vào ngữ cảnh mới

Write two sentences about a school project using two forms from one word family. Underline the words mentally and explain their different roles. Self-check criteria Check: Do the forms fit the sentence? Do both sentences preserve the intended meaning? Several answers are possible. One possible model: Our club values creativity (noun). We use creative (adjective) ideas in our posters. Other natural answers are possible. Open response · self-practice only · no automatic score.

Remember Learn meaning, notice the whole phrase or word form, recall it, then use it in a different context. Hiểu nghĩa, chú ý cả cụm hoặc dạng từ, tự nhớ rồi vận dụng trong ngữ cảnh khác.

## Appendix B — Immutable scored bank reference (NOT learner-visible)

All IDs use the lesson ID prefix + the Q suffix. Short-answer normalization: trim, casefold, collapse_spaces, strip_terminal_punctuation. No canonical item is edited in this review. Transcription preserves prompts, option order and key identifiers as fetched. Existing feedback is for comparison, not newly approved pedagogy.

## VOC-A1-01 — School places and classroom language
Objectives:
- Understand useful school expressions from their context.
- Notice which verbs and nouns naturally occur together.
- Recall a useful phrase without always seeing answer options.
- Practise using school expressions in simple spoken or written sentences (unscored self-practice).

ID suffix | Prompt | Options (if any) | Key / accepted answers | Existing feedback
--- | --- | --- | --- | ---
Q1 | Where do students usually borrow books? | A: In the gym / B: In the library / C: In the canteen / D: In the playground | B | Borrow books is associated with a library.
Q2 | A teacher speaks too quickly. Which request is polite? | A: Say it again now! / B: Repeat! / C: Could you repeat that, please? / D: I don't listen. | C | Could you repeat that, please? is a polite request for repetition.
Q3 | Complete: We eat lunch in the school ___. | Short answer | canteen / cafeteria | A canteen or cafeteria is a place where students eat at school.
Q4 | Which item helps you draw a straight line? | A: A ruler / B: An eraser / C: A backpack / D: A notebook | A | A ruler helps you draw or measure straight lines.
Q5 | Which activity belongs in a science lab? | A: Performing a safe experiment / B: Borrowing novels / C: Playing a football match / D: Buying bus tickets | A | A laboratory is a place for practical scientific work.
Q6 | Complete: May I ___ your pencil for a minute? | Short answer | borrow | Borrow means use something temporarily and return it later.
Q7 | A notice says 'Keep the corridor clear'. What should you do? | A: Leave bags across the hallway / B: Make space for people to walk / C: Run through the classrooms / D: Close the library | B | A corridor is a hallway; keeping it clear lets people walk safely.
Q8 | Choose the natural phrase. | A: make homework / B: do homework / C: catch homework / D: take homework | B | English uses do homework.

## VOC-A2-01 — Daily routines and useful phrases
Objectives:
- Understand common routine phrases
- Choose natural verb–noun combinations

ID suffix | Prompt | Options (if any) | Key / accepted answers | Existing feedback
--- | --- | --- | --- | ---
Q1 | Choose the natural phrase. | A: do breakfast / B: make breakfast / C: take breakfast / D: catch breakfast | B | We normally say make breakfast.
Q2 | If you catch the bus, you ___. | A: drive it yourself / B: board it in time / C: repair it / D: walk next to it | B | Catch a bus means get on it before it leaves.
Q3 | Complete: I need to ___ a short break. | Short answer | take | Take a break is the conventional phrase.
Q4 | Which phrase means exercise by walking outside? | A: go for a walk / B: make a walk / C: do a walk / D: take a walking | A | Go for a walk is the standard phrase.
Q5 | Choose the best meaning of routine. | A: a surprising event / B: a regular way of doing things / C: a difficult exam / D: a special celebration | B | A routine is a regularly repeated set of actions.
Q6 | Before bed, Linh always ___ her teeth. Select one natural verb. | A: does / B: brushes / C: makes / D: takes | B | Brushes her teeth is the natural routine collocation.
Q7 | The bus left just before An arrived at the stop. Select one sentence that accurately describes what happened. | A: An caught the bus. / B: An drove the bus. / C: An missed the bus. / D: An changed the bus. | C | An missed the bus because it left before An arrived; catch the bus would mean boarding it.
Q8 | Two pupils use one school tablet. One uses it for ten minutes, then the other uses it. Select one natural phrase for this routine. | A: make turns / B: take turns / C: do turns / D: catch turns | B | Take turns means use or do something one after the other.
Q9 | Complete with one natural verb ONLY: Please ___ the dishes after dinner; I will dry them. | Short answer | wash / do | Wash the dishes and do the dishes are both standard collocations in this context.
Q10 | Complete with ONE verb ONLY: Every morning I ___ my bed before going to school. | Short answer | make | Make my bed means arrange the sheets and bedding neatly.
Q11 | Complete with ONE verb ONLY: We ___ the table before dinner by putting plates and forks in their places. | Short answer | set / lay | Set the table and lay the table are both natural phrases for arranging it before a meal.

## VOC-B1-02 — Word families for study and communication
Objectives:
- Recognize common noun, verb, adjective and adverb forms in familiar word families.
- Use suffix clues such as -tion, -ment, -ive and -ly to choose a form that fits a sentence.
- Use word-family knowledge together with sentence meaning rather than relying on spelling alone.

ID suffix | Prompt | Options (if any) | Key / accepted answers | Existing feedback
--- | --- | --- | --- | ---
Q1 | Choose the correct form: The team made an important ___ before the meeting ended. | A: decision / B: decide / C: decisive / D: deciding | A | After an important, a noun is needed; decision is the noun in this word family.
Q2 | Choose the correct form: Regular feedback can lead to a clear ___. | A: improvement / B: improve / C: improved / D: improvingly | A | A clear requires a noun; improvement names the positive change.
Q3 | Which word best completes the sentence? Good ___ is especially important when a group works online. | A: communication / B: communicate / C: communicative / D: communicatingly | A | The sentence needs a noun naming the process of sharing information.
Q4 | Choose the best form: The students divided the work ___ and finished on time. | A: effectively / B: effective / C: effect / D: effectiveness | A | The blank describes how they divided the work, so the adverb effectively fits.
Q5 | In this sentence, what does 'reliable' most nearly mean? 'We need a reliable source before we include the fact in our report.' | A: able to be trusted / B: very entertaining / C: difficult to read / D: recently invented | A | A reliable source is one that can be trusted.
Q6 | Complete with the noun form of develop: The project showed steady ___ over three months. | Short answer | development | Development is the noun form that fits after steady.
Q7 | Choose the correct form: Her explanation was clear and ___. | A: informative / B: information / C: inform / D: informatively | A | The sentence coordinates two adjectives after was: clear and informative.
Q8 | Which word best fits? The instructions were so ___ that everyone completed the task correctly. | A: helpful / B: help / C: helpfully / D: helpfulness | A | An adjective is needed after were so; helpful describes the instructions.
Q9 | Complete with the adverb form of careful: Please read the final paragraph ___. | Short answer | carefully | Carefully is the adverb that describes how to read.
Q10 | Which pair belongs to the same word family and is used correctly? | A: success · successful / B: success · succeedly / C: successful · successment / D: succeed · successfulnessly | A | Success is a noun and successful is the related adjective.
