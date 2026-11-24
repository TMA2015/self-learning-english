# Wave 3A rebuilt — owner and independent academic acceptance (2026-11-24)

Owner approved the compact diagram HTML. Independent NotebookLM packet verdict PASS, all 7 lessons and 14 Quick Self-Checks PASS, no required or optional corrections. Academic-only; no release authorization.

Exact HTML Git blob c92687117ac8d043f5c73b85130a302ab904acd6; canonical extracted sections Git blob 966ba611b182ad841856782323ae5b83392d8f02. Immutable curriculum 1.28.0 blob 9d931a6930b8cd3ed918db1fa22e8708b7a9f884. Seven lessons, 52 sections, 14 checks, 78 scored items untouched. Engineering screen of 290 scored fields: 1 exact common formula match ("is going to", a distractor of Q1, not its answer); 10 near flags adjudicated as common grammatical frames or task instructions, distinct contexts. No unresolved scenario or answer leakage in this screen. No semantic-exhaustiveness claim.

## Owner diagram standard (all SLE lessons)
Simple diagrams ~360px max width and ~150px height, compact cards ~520px max, text visually consistent with surrounding 12–14px UI, caption 13px; adapt complex diagrams to preserve legibility, no clipping or excessive space. Central shared Grammar CSS applied in this PR, future skill renderers must also follow this standard; do not assume unrelated renderers are already migrated. Test 375/768/960px in actual React fixture, including earlier waves. No scoring, curriculum, Math, Auth, learner record, audio, Firebase changes. Stacked after Wave 3B #235; #236 QA carrier never merge.

## Reviewed source
# SLE-GRA-KNOWLEDGE-V23-W3A-A2-REBUILT-20261124

## Review scope
New authoring candidate reconstructed from immutable curriculum 1.28.0 Git blob `9d931a6930b8cd3ed918db1fa22e8708b7a9f884`; this is NOT recovery of the earlier unreviewed Wave 3A HTML. Review only GRA-A2-01–07. Wave 3B and other waves are out of scope. Visual acceptance must be obtained separately. Normative baseline: SLE-MASTER-001 v1.2.1 and permanent project sources. No changes to 78 scored baseline activities, learner records, scoring, or runtime. No engineering or release authorization.

## Review questions
1. Does each lesson match its source objectives and A2 self-study level?
2. Are all grammar rules, examples, spelling guidance and exceptions accurate and natural?
3. Are the diagram meanings and captions accurate without implying rigid time or comparison rules?
4. Check all 14 Quick Self-Checks for single defensible keys, plausible distractors and feedback.
5. Check potential scored-item overlap; identify any remaining leakage. Full immutable-bank engineering screen remains separate unless bank evidence is supplied.
6. Confirm the candidate is an unscored teaching overlay, not a change to the assessed bank.
7. Check English/Vietnamese meaning parity.
8. Assess the flexible numbered teaching sequence, unnumbered Remember and learner progression.

## Required verdict
PACKET_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE
LESSON_VERDICTS: one verdict per GRA-A2-01–07
QUICK_SELF_CHECK_VERDICTS: one per QC ID, include exact key text
REQUIRED_CORRECTIONS: exact lesson, section, original and proposed replacement; NONE if none
OPTIONAL_IMPROVEMENTS: ...
SCORED_BANK_LEAKAGE_AUDIT: specify verified scope and any missing evidence
ENGINEERING_IMPLEMENTATION: OUT_OF_SCOPE / NOT_TESTED
PRODUCTION_RELEASE: NOT_AUTHORIZED

## Candidate content

---

## GRA-A2-01 — Present simple or present continuous?

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Choose a form for a routine, a current action or a temporary situation.
- ✓Build positive statements, negatives and questions.
- ✓Recognise common state verbs and use only the requested gap answer.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Think about the meaning first. Present simple often describes habits, facts and states; present continuous often describes an action in progress or a temporary activity around now. Time words help, but do not decide the form on their own.
Chọn thì theo ý nghĩa: hiện tại đơn thường diễn tả thói quen, sự thật và trạng thái; hiện tại tiếp diễn thường diễn tả hành động đang diễn ra hoặc hoạt động tạm thời quanh hiện tại. Từ chỉ thời gian chỉ là dấu hiệu.

### 3. See the Routine & the Current Action
Vietnamese title: Quan sát sơ đồ
Diagram accessible description: Repeated events on different days contrasted with an action around now
Diagram labels: Repeated habit, Now, Activity in progress
Repeated habit
Now
Activity in progress
Repeated events versus an activity in progress; the activity may extend around now.
Việc lặp lại so với hoạt động đang diễn ra; hoạt động có thể kéo dài quanh hiện tại.

### 4. Compare the Two Present Forms
Vietnamese title: So sánh hai thì hiện tại
| Pattern | Present simple | Present continuous |
| --- | --- | --- |
| Positive | I/you/we/they + base verb; he/she/it + verb-s/es | Subject + am/is/are + verb-ing |
| Negative | Subject + don’t/doesn’t + base verb | Subject + am/is/are + not + verb-ing |
| Question | Do/Does + subject + base verb? | Am/Is/Are + subject + verb-ing? |
| Typical meaning | Habit, fact or state | Action now or temporary activity |

### 5. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Routine
Rosa collects stamps on Fridays.
Why:
A repeated habit: use collects for Rosa.
Thói quen lặp lại; chủ ngữ Rosa dùng collects.
2. Happening now
Rosa is sorting her stamps at the moment.
Why:
The action is in progress: is + sorting.
Hành động đang diễn ra: is + sorting.
3. Temporary activity
Our neighbour is working at another shop this month.
Why:
The situation is temporary around now.
Tình huống tạm thời quanh hiện tại.
4. State
I believe your story.
Why:
Believe in this meaning usually takes the simple form.
Believe với nghĩa tin tưởng thường dùng hiện tại đơn.
5. Question and negative
Does Omar repair bikes? — No, he doesn’t.
Why:
Do/does takes a base verb; the short answer uses does.
Sau do/does dùng nguyên mẫu; câu đáp ngắn dùng does.

### 6. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ He doesn’t collects shells.
✓ He doesn’t collect shells.
Why:
Doesn’t already carries the subject agreement.
Doesn’t đã thể hiện sự hòa hợp với chủ ngữ.
✗ The girls is painting a banner.
✓ The girls are painting a banner.
Why:
Use are with a plural subject.
Chủ ngữ số nhiều dùng are.

### Remember
Ask: regular habit or state, happening now, or temporary? In a gap-fill, enter only the missing word or phrase when requested.
Hỏi: thói quen/trạng thái, đang diễn ra hay tạm thời? Nếu đề yêu cầu điền chỗ trống, chỉ nhập phần thiếu.

### 7. Quick Self-Check

**GRA-A2-01-QC1:** Every morning, Ben ___ his plants.
- A. water
- B. waters [KEY]
- C. is water
Feedback: Every morning describes a routine; Ben takes waters.
Vietnamese feedback: Every morning chỉ thói quen; Ben dùng waters.

**GRA-A2-01-QC2:** For this week only, Jo ___ in a different office.
- A. works every year
- B. is working [KEY]
- C. are working
Feedback: The situation is temporary; Jo takes is working.
Vietnamese feedback: Tình huống tạm thời; Jo dùng is working.

---

## GRA-A2-02 — Past simple forms, negatives and questions

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Use regular and irregular past forms for finished events.
- ✓Use did/didn’t with the base verb.
- ✓Distinguish past be (was/were) from action verbs.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Use the past simple for finished events in the past. Ordinary action verbs use past forms in positive sentences, but did/didn’t + base verb in questions and negatives. Past be has its own patterns.
Quá khứ đơn diễn tả sự việc đã kết thúc trong quá khứ. Động từ thường ở câu khẳng định dùng dạng quá khứ; câu hỏi/phủ định dùng did/didn’t + nguyên mẫu. Be có mẫu riêng.

### 3. Build Past Action Sentences & Past Be
Vietnamese title: Lập câu với động từ thường và be
| Pattern | Action verb | Past be |
| --- | --- | --- |
| Positive | Subject + past verb (opened / found) | I/he/she/it was; you/we/they were |
| Negative | Subject + didn’t + base verb | Subject + was not / were not |
| Question | Did + subject + base verb? | Was/Were + subject ...? |
| Short answer | Yes, ... did. / No, ... didn’t. | Yes, ... was/were. / No, ... wasn’t/weren’t. |
Common past spelling: close → closed; carry → carried. Irregular forms must be learnt, e.g. find → found.
Chính tả: close → closed; carry → carried. Học riêng các dạng bất quy tắc, ví dụ find → found.

### 4. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Regular past
Ari repaired his scooter last Thursday.
Why:
Repair is regular: add -ed.
Repair có quy tắc: thêm -ed.
2. Irregular past
The dog caught the ball a minute ago.
Why:
Catch has the irregular past form caught.
Catch có dạng quá khứ bất quy tắc caught.
3. Negative
I didn’t lock the gate.
Why:
After didn’t, use lock, not locked.
Sau didn’t dùng lock, không dùng locked.
4. Question
Did Lina finish the puzzle?
Why:
Did comes before the subject; finish remains in base form.
Did đứng trước chủ ngữ; finish ở nguyên mẫu.
5. Past be
The playground was empty. Were the doors open?
Why:
Was and were describe past states; no did.
Was/were mô tả trạng thái quá khứ; không thêm did.

### 5. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ We didn’t caught the train.
✓ We didn’t catch the train.
Why:
Use base verb after didn’t.
Sau didn’t dùng nguyên mẫu.
✗ Did the garden was quiet?
✓ Was the garden quiet?
Why:
A basic past-be question starts with was/were.
Câu hỏi với be quá khứ bắt đầu bằng was/were.

### Remember
Choose action verb or past be first. With did/didn’t, return the action verb to its base form.
Trước hết chọn động từ thường hay be quá khứ. Sau did/didn’t đưa động từ về nguyên mẫu.

### 6. Quick Self-Check

**GRA-A2-02-QC1:** Yesterday, Kim ___ the broken shelf.
- A. fixes
- B. fixed [KEY]
- C. fix
Feedback: A finished past event uses the past form fixed.
Vietnamese feedback: Việc đã kết thúc dùng fixed.

**GRA-A2-02-QC2:** Which asks about a past state?
- A. Did the windows were open?
- B. Was the windows open?
- C. Were the windows open? [KEY]
Feedback: Windows is plural; use were before the subject.
Vietnamese feedback: Windows số nhiều; đưa were lên trước chủ ngữ.

---

## GRA-A2-03 — Countability, some/any, much/many

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Recognise countable and uncountable nouns in context.
- ✓Choose much/many and some/any by meaning.
- ✓Count containers or portions when needed.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Countable nouns name separate items; uncountable nouns usually name an amount, substance or idea in a particular meaning. Many goes with plural countable nouns; much with uncountable nouns. Some and any also depend on the speaker’s intention.
Danh từ đếm được chỉ từng vật; danh từ không đếm được thường chỉ lượng, chất hoặc ý niệm theo nghĩa cụ thể. Many đi với danh từ đếm được số nhiều; much đi với danh từ không đếm được. Some/any còn tùy mục đích nói.

### 3. Choose a Quantity Expression
Vietnamese title: Chọn từ chỉ số lượng
| Pattern | Form / meaning | Example / use |
| --- | --- | --- |
| Countable | one lemon / several lemons | How many + plural noun? |
| Uncountable | a little salt / a lot of salt | How much + uncountable noun? |
| Some | Ordinary positive statement | Also often in offers or requests |
| Any | Neutral question or negative | Choose by context, not punctuation alone |

### 4. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Count separate items
There are six crayons in the box.
Why:
Crayons are individual objects.
Crayons là các vật riêng lẻ.
2. Measure a substance
We need some oil for the pan.
Why:
Oil is usually uncountable as a substance.
Oil theo nghĩa chất lỏng thường không đếm được.
3. Compare quantities
How many spoons? How much honey?
Why:
Spoons are countable; honey is an amount.
Spoons đếm được; honey chỉ lượng.
4. Neutral question and negative
Is there any soap? There isn’t any soap.
Why:
Any is natural in these contexts.
Any tự nhiên trong các ngữ cảnh này.
5. Offer and containers
Would you like some lemonade? We have three cups of lemonade.
Why:
Some works in an offer; count the cups, not the liquid.
Some dùng được trong lời mời; đếm cốc, không đếm chất lỏng.

### 5. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ How many sugar is in the bowl?
✓ How much sugar is in the bowl?
Why:
Sugar is uncountable in this meaning.
Sugar theo nghĩa này không đếm được.
✗ We need two toothpaste.
✓ We need two tubes of toothpaste.
Why:
Count the containers, not the substance.
Đếm ống, không đếm kem đánh răng.

### Remember
First identify the noun meaning. Then choose the quantity word. Some is natural in offers; any is common in neutral questions and negatives.
Xác định nghĩa danh từ trước, rồi chọn từ chỉ lượng. Some thường dùng trong lời mời; any thường dùng trong câu hỏi trung tính và phủ định.

### 6. Quick Self-Check

**GRA-A2-03-QC1:** How ___ jam is in this jar?
- A. many
- B. much [KEY]
- C. an
Feedback: Jam as a substance is uncountable: much.
Vietnamese feedback: Jam theo nghĩa chất không đếm được: much.

**GRA-A2-03-QC2:** Offering a drink: “Would you like ___ tea?”
- A. many
- B. a few
- C. some [KEY]
Feedback: Some is natural in an offer of a drink.
Vietnamese feedback: Some tự nhiên trong lời mời đồ uống.

---

## GRA-A2-04 — Comparatives and superlatives

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Compare two people or things with a comparative.
- ✓Identify an extreme in a defined group using a superlative.
- ✓Choose common spelling patterns and irregular forms.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
A comparative compares two things, often using than. A superlative picks out an extreme in a defined group. Short adjectives often use -er/-est; longer adjectives often use more/most. Some adjectives have irregular forms.
So sánh hơn thường đối chiếu hai đối tượng với than. So sánh nhất chỉ mức cao nhất hoặc thấp nhất trong nhóm xác định. Tính từ ngắn thường thêm -er/-est, tính từ dài thường dùng more/most; có dạng bất quy tắc.

### 3. See the Comparison
Vietnamese title: Quan sát sơ đồ
Diagram accessible description: Two columns compared and one tallest column in a group of three
Diagram labels: Taller of two, Tallest in the group
Taller of two
Tallest in the group
Comparative: compare two. Superlative: pick an extreme in a group.
So sánh hơn: đối chiếu hai. So sánh nhất: chọn mức cực trị trong nhóm.

### 4. Compare Forms & Spelling
Vietnamese title: So sánh dạng và chính tả
| Adjective | Comparative | Superlative |
| --- | --- | --- |
| Short: cold | colder | coldest |
| Ends in silent e: nice | nicer | nicest |
| Consonant + y: happy | happier | happiest |
| Common short CVC: big | bigger | biggest |
| Longer: comfortable | more comfortable | most comfortable |
| Irregular: good / bad | better / worse | best / worst |

### 5. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Two objects
This ladder is longer than that one.
Why:
Compare two ladders: longer + than.
So sánh hai chiếc thang: longer + than.
2. Defined group
The purple flower is the smallest of the five.
Why:
One flower is at an extreme in a group.
Một bông hoa ở mức cực trị trong nhóm.
3. Long adjective
This chair is more comfortable than the wooden chair.
Why:
Use more with comfortable.
Dùng more với comfortable.
4. Spelling
The blue balloon is bigger than the pink one.
Why:
Big doubles g before -er.
Big gấp đôi g trước -er.
5. Irregular
Of the three routes, this is the worst for cycling.
Why:
Bad has the irregular superlative worst.
Bad có dạng so sánh nhất bất quy tắc worst.

### 6. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ The river is more deeper here.
✓ The river is deeper here.
Why:
Do not combine more with -er.
Không dùng more cùng -er.
✗ This is the most cheapest ticket.
✓ This is the cheapest ticket.
Why:
Do not combine most with -est.
Không dùng most cùng -est.

### Remember
Two things: comparative, often with than. One extreme in a defined group: usually the + superlative. Check spelling and irregular forms.
Hai đối tượng: so sánh hơn, thường có than. Một đối tượng nổi bật trong nhóm: thường dùng the + so sánh nhất. Kiểm tra chính tả và bất quy tắc.

### 7. Quick Self-Check

**GRA-A2-04-QC1:** The orange kite is ___ than the green kite.
- A. smallest
- B. smaller [KEY]
- C. more smaller
Feedback: Two kites are compared: use smaller.
Vietnamese feedback: So sánh hai diều: smaller.

**GRA-A2-04-QC2:** Of the four boxes, the white one is the ___.
- A. largest [KEY]
- B. larger
- C. more large
Feedback: One extreme in four boxes: largest.
Vietnamese feedback: Một hộp lớn nhất trong bốn hộp: largest.

---

## GRA-A2-05 — Future intentions with be going to

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Describe a prior future intention or a prediction based on present evidence.
- ✓Make positive, negative and question forms.
- ✓Distinguish a specific plan from a habit and an arranged appointment.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Use am/is/are going to + base verb for a prior intention or a prediction supported by current evidence. For an arranged future event, present continuous can also be natural. Future forms depend on context.
Dùng am/is/are going to + nguyên mẫu cho dự định đã có hoặc dự đoán dựa trên dấu hiệu hiện tại. Hiện tại tiếp diễn cũng có thể tự nhiên khi nói về một lịch hẹn đã sắp xếp. Chọn theo ngữ cảnh.

### 3. Build Going To Statements & Questions
Vietnamese title: Lập câu với going to
| Pattern | Form / meaning | Example / use |
| --- | --- | --- |
| Positive | Subject + am/is/are going to + base verb | I am going to cook. |
| Negative | Subject + am/is/are not going to + base verb | He isn’t going to cook. |
| Question | Am/Is/Are + subject + going to + base verb? | Are you going to cook? |
| Short answer | Yes + subject + be / No + subject + be + not (or contraction) | Yes, I am. / No, I’m not. |

### 4. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Prior intention
I’m going to learn a new dance this holiday.
Why:
The decision exists before speaking.
Dự định đã có trước khi nói.
2. Negative plan
Nia isn’t going to enter the race.
Why:
Put not after be.
Thêm not sau be.
3. Ask a plan
Is Dan going to repair the clock?
Why:
Move is before the subject.
Đưa is lên trước chủ ngữ.
4. Visible evidence
That pile of books is slipping. It’s going to slide off the desk.
Why:
The prediction is supported by what we see now.
Dự đoán dựa trên dấu hiệu đang thấy.
5. Habit vs plan
We usually hike nearby, but next weekend we’re going to explore a new trail.
Why:
Usually marks a habit; the second part is a specific intention.
Usually chỉ thói quen; vế sau là dự định cụ thể.
6. Arranged event
I’m having lunch with Tom at one tomorrow; we agreed on the time.
Why:
An organised arrangement can use present continuous.
Lịch hẹn đã thống nhất có thể dùng hiện tại tiếp diễn.

### 5. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ Omar going to draw a map.
✓ Omar is going to draw a map.
Why:
Do not omit be.
Không bỏ be.
✗ They are going to dancing.
✓ They are going to dance.
Why:
Use a base verb after going to.
Sau going to dùng nguyên mẫu.

### Remember
Check the correct be and base verb. A prior intention or visible evidence often supports going to; a fixed arrangement may use present continuous.
Kiểm tra be và nguyên mẫu. Dự định đã có hoặc dấu hiệu hiện tại thường phù hợp going to; lịch hẹn có thể dùng hiện tại tiếp diễn.

### 6. Quick Self-Check

**GRA-A2-05-QC1:** Sara decided yesterday to learn chess. She ___ learn chess.
- A. going to
- B. is going to [KEY]
- C. is going
Feedback: A prior intention uses is going to + base verb.
Vietnamese feedback: Dự định đã có dùng is going to + nguyên mẫu.

**GRA-A2-05-QC2:** Which is a correctly formed negative intention?
- A. I am not going to draw. [KEY]
- B. I not going to draw.
- C. I am not going to drawing.
Feedback: Use am + not + going to + base verb.
Vietnamese feedback: Dùng am + not + going to + nguyên mẫu.

---

## GRA-A2-06 — Rules: must, must not and have to

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Distinguish required, forbidden and optional actions.
- ✓Use must/must not and have to/has to.
- ✓Ask about necessity and use do/does not have to.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Must and have to can express an obligation. Must not means an action is forbidden. Don’t/doesn’t have to means the action is not required; it may still be allowed. Read the meaning of the notice first.
Must và have to có thể diễn tả sự bắt buộc. Must not nghĩa là bị cấm. Don’t/doesn’t have to nghĩa là không bắt buộc, vẫn có thể được phép. Đọc ý nghĩa thông báo trước.

### 3. Required, Forbidden or Optional?
Vietnamese title: Bắt buộc, bị cấm hay tùy chọn?
| Pattern | Form / meaning | Example / use |
| --- | --- | --- |
| Required | must + base verb / have to or has to + base verb | You must return the book. |
| Forbidden | must not / mustn’t + base verb | You mustn’t climb the fence. |
| Optional | don’t/doesn’t have to + base verb | You don’t have to bring lunch. |
| Ask about necessity | Do/Does + subject + have to + base verb? | Does Mia have to book online? |

### 4. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Obligation
At this pottery class, everyone must clean their tools.
Why:
The class requires this action.
Lớp học yêu cầu hành động này.
2. Prohibition
You mustn’t pick the flowers in this garden.
Why:
The action is not allowed.
Hành động bị cấm.
3. No necessity
The guide provides binoculars. You don’t have to bring your own.
Why:
Bringing your own is not required.
Không bắt buộc mang ống nhòm riêng.
4. Subject agreement
Eli has to finish the form before the lesson.
Why:
Use has to with he/she/it.
He/she/it dùng has to.
5. Question
Does Leo have to take off his shoes here?
Why:
After does, use have to, not has to.
Sau does dùng have to, không dùng has to.

### 5. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ You mustn’t bring a towel. Towels are provided and your own is allowed.
✓ You don’t have to bring a towel. Towels are provided.
Why:
Optional does not mean forbidden.
Không bắt buộc không có nghĩa bị cấm.
✗ She must to lock the cupboard.
✓ She must lock the cupboard.
Why:
Must takes a base verb without to.
Sau must dùng nguyên mẫu không to.

### Remember
Must not = forbidden. Don’t have to = not necessary. After do/does, use have to.
Must not = bị cấm. Don’t have to = không bắt buộc. Sau do/does dùng have to.

### 6. Quick Self-Check

**GRA-A2-06-QC1:** The sign says “No bicycles on the bridge.” Which matches?
- A. You must not cycle across the bridge. [KEY]
- B. You don’t have to cycle across the bridge.
- C. You must cycle across the bridge.
Feedback: No bicycles means cycling is forbidden.
Vietnamese feedback: No bicycles nghĩa là cấm đi xe đạp.

**GRA-A2-06-QC2:** Which question asks about a requirement?
- A. Does he has to tidy up?
- B. Do he has to tidy up?
- C. Does he have to tidy up? [KEY]
Feedback: Does + subject + have to + base verb.
Vietnamese feedback: Does + chủ ngữ + have to + nguyên mẫu.

---

## GRA-A2-07 — Present continuous: form and use

### 1. What you will learn
Vietnamese title: Mục tiêu bài học
- ✓Match am/is/are to the subject and add the -ing verb.
- ✓Build negatives and questions.
- ✓Apply common -ing spelling changes and recognise ongoing or temporary activities.

### 2. The Core Idea
Vietnamese title: Ý cốt lõi
Present continuous uses two parts: am/is/are + verb-ing. It often describes an action now or a temporary activity around the present. Change be for the subject and check -ing spelling.
Hiện tại tiếp diễn có hai phần: am/is/are + V-ing. Thường dùng cho hành động đang diễn ra hoặc hoạt động tạm thời quanh hiện tại. Đổi be theo chủ ngữ và kiểm tra chính tả -ing.

### 3. See the Activity on a Timeline
Vietnamese title: Quan sát sơ đồ
Diagram accessible description: An ongoing activity around the present, with now inside the activity
Diagram labels: Activity around now, NOW
Activity around now
NOW
The activity is in progress now or around the present time.
Hoạt động đang diễn ra ngay lúc này hoặc quanh thời điểm hiện tại.

### 4. Build the Sentence & Spell -ing Forms
Vietnamese title: Lập câu và viết dạng -ing
| Pattern | Form / meaning | Example / use |
| --- | --- | --- |
| Positive | I am / he is / we are + verb-ing | He is sketching. |
| Negative | Subject + am/is/are + not + verb-ing | He isn’t sketching. |
| Question | Am/Is/Are + subject + verb-ing? | Is he sketching? |
| Most verbs | Add -ing | jump → jumping |
| Silent final e | Usually drop e, then add -ing | bake → baking |
| Common short stressed CVC verbs | Often double the final consonant | hop → hopping |
These are common spelling patterns, not rules for every verb.
Đây là các mẫu chính tả thường gặp, không áp dụng máy móc cho mọi động từ.

### 5. How to Use in Context
Vietnamese title: Cách dùng qua ví dụ thực tế
1. Now
The gardener is digging a hole.
Why:
An action is in progress now.
Hành động đang diễn ra.
2. Around now
I’m learning to play the drums this month.
Why:
Temporary activity around the present, not necessarily at this second.
Hoạt động tạm thời quanh hiện tại, không nhất thiết đúng lúc này.
3. Negative
We aren’t using the large table.
Why:
Put not after are.
Thêm not sau are.
4. Question
Is the baby sleeping?
Why:
Move is before the subject.
Đưa is lên trước chủ ngữ.
5. Spelling
The children are clapping. Nina is skating.
Why:
Clap doubles p; skate drops silent e.
Clap gấp đôi p; skate bỏ e câm.

### 6. Common Mistakes to Avoid
Vietnamese title: Lỗi sai thường gặp
✗ The boys is laughing.
✓ The boys are laughing.
Why:
Plural subject takes are.
Chủ ngữ số nhiều dùng are.
✗ I am peel an apple.
✓ I am peeling an apple.
Why:
The main verb needs -ing after be.
Động từ chính cần -ing sau be.

### Remember
Check both parts: matching be + the -ing form. A time word such as today is only a clue; ask whether the activity is in progress or temporary.
Kiểm tra cả hai phần: be phù hợp + dạng -ing. Từ today chỉ là dấu hiệu; xem hoạt động đang diễn ra hay tạm thời.

### 7. Quick Self-Check

**GRA-A2-07-QC1:** Complete: The girls ___ a tent at the moment.
- A. is putting up
- B. are putting up [KEY]
- C. are put up
Feedback: Girls is plural: are + putting up.
Vietnamese feedback: Girls số nhiều: are + putting up.

**GRA-A2-07-QC2:** Choose the -ing form of tap.
- A. taping
- B. tappping
- C. tapping [KEY]
Feedback: Tap is a short consonant-vowel-consonant verb: double p.
Vietnamese feedback: Tap có mẫu phụ âm-nguyên âm-phụ âm ngắn: gấp đôi p.
