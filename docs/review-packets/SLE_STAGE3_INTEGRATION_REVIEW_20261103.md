# SLE Stage 3 v1.18.1 — Academic Integration Review Packet

**Packet ID:** SLE-STAGE3-INTEGRATION-20261103
**Date:** 2026-11-03 · **Target:** [GitHub PR #72](https://github.com/TMA2015/self-learning-english/pull/72) · **Base:** v1.18.0 / [PR #67](https://github.com/TMA2015/self-learning-english/pull/67)
**Policy:** SLE-MASTER-001 v1.0.0, canonical `docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md` (especially §§1–3, 5.2, 5.3, 5.4, 5.6, 5.7, 6–10). Use five permanent NotebookLM English baseline sources as additional academic references.
**Nature:** Independent academic *integration checkpoint*, not a request to re-grade all 109 lessons or to treat CI success as academic evidence.

## 1. Status and decision boundary

- Stage 3 candidate is an immutable new full curriculum version **1.18.1**, 109 lessons / 913 activities. Exactly `REA-A1-01` and `VOC-A1-01` have changes confined to objectives, explanations and worked examples; all existing activities, keys, tags, scores, audio, and the other 107 lessons remain unchanged from v1.18.0.
- PR #69 records an earlier Stage 3 academic **GO with required changes, production NO-GO**. The complete earlier verdict is not embedded here; this packet requests an integration-focused independent check of the actual visible teaching and assessment semantics.
- Stage 3 [GitHub Actions #41597525764](https://github.com/TMA2015/self-learning-english/actions/runs/41597525764): **72/72 deterministic regression tests PASS**, TypeScript/static build PASS, 38 existing MP3 in static build. These are **engineering** evidence only. No live Stage 3 deployment, live Gemini behavior, full mobile/browser UX or independent audio discrimination was proven.
- Import preview regression: from 1.18.0 to 1.18.1: `Add 0 / Update 2 / Skip 107 / Conflict 0` using the actual importer in simulated storage. Historical version-pinned attempts and source remain unmodified in that test.
- The two draft PRs #67 and #72 are **not merged as a production release**. Do not approve release merely from this packet.

## 2. Reading — exact Stage 3 revised teaching and preserved assessment

### REA-A1-01 — A new art club at school

**Module:** reading · **CEFR target:** undefined · **Unchanged item count:** 8

**Learning objectives:**
1. Understand the main purpose of a short school notice.
2. Find useful details by matching the question to the meaning of the text.
3. Notice small conditions that change what a notice means.
4. Understand explicit details and simple paraphrased conditions without adding unstated facts.

**English explanation (exact from curriculum):**

> Read a short notice once to understand its purpose. Read again to answer practical questions: when, where, what to bring and what to do. Check the full phrase, including words such as if, before and only. For an inference, combine clues carefully; the text may suggest something without saying it word for word. Highlighting text is an optional helper, not a requirement for answering.

**Vietnamese optional explanation (exact):**

> Đọc lượt đầu để hiểu thông báo nói về điều gì; lượt sau tìm thông tin theo nghĩa của câu hỏi. Chú ý if, before, only. Suy luận phải dựa trên thông tin, không tự thêm dữ kiện. Đánh dấu bằng chứng là hỗ trợ tùy chọn.

**Worked examples and self-practice (exact):**

1. MINI-NOTICE · The guitar group meets on Tuesdays at lunchtime. Come to Music Room 3. Bring your guitar if you have one. Beginners are welcome.

2. GIST DEMONSTRATION · First find the whole purpose: this mini-notice gives information about joining a guitar group.

3. DETAIL DEMONSTRATION · Music Room 3 is a place; Tuesdays at lunchtime tells us when. Match the kind of information to the question.

4. CONDITION DEMONSTRATION · If you have one does not mean every learner must already own a guitar.

5. INFERENCE DEMONSTRATION · Beginners are welcome suggests someone new to guitar could join. It does not promise a certain number of lessons.


**Assessed passage (unchanged, exact):**

**Art club notice**

> Our school has a new art club. It meets in Room 12 on Wednesdays after class. The club starts at three thirty and finishes at four thirty. Ms Hoa helps students draw, paint and make posters. You do not need to bring paint because the club has art materials. Bring your own pencil and a small notebook. Last week, eight students joined. They made colourful signs for the school garden. This week, the group will design a poster about saving water. New students can join at any time. To register, write your name on the list outside the library before Wednesday lunch.

**Existing scored activities, retained unchanged from 1.18.0:**

- **REA-A1-01-Q1** (single_choice; evidence weight 1; tags: reading.gist) — What is the main purpose of the notice?
   - A. To sell art materials
   - B. To invite students to an art club
   - C. To announce a school holiday
   - D. To move the library
   - **Answer:** Correct option **B**
   - **Feedback:** The notice explains what the new club does and how students can join.

- **REA-A1-01-Q2** (single_choice; evidence weight 1; tags: reading.detail) — Where does the club meet?
   - A. Room 12
   - B. The canteen
   - C. The sports field
   - D. Room 30
   - **Answer:** Correct option **A**
   - **Feedback:** The second sentence identifies Room 12.

- **REA-A1-01-Q3** (single_choice; evidence weight 1; tags: reading.detail) — On which day does the club meet?
   - A. Monday
   - B. Tuesday
   - C. Wednesday
   - D. Friday
   - **Answer:** Correct option **C**
   - **Feedback:** The club meets on Wednesdays after class.

- **REA-A1-01-Q4** (single_choice; evidence weight 1; tags: reading.detail) — What time does the club finish?
   - A. 12:00
   - B. 15:00
   - C. 15:30
   - D. 16:30
   - **Answer:** Correct option **D**
   - **Feedback:** The notice says it finishes at four thirty, or 16:30.

- **REA-A1-01-Q5** (single_choice; evidence weight 1; tags: reading.detail) — What should a new student bring?
   - A. Paint and brushes only
   - B. A pencil and a notebook
   - C. A football and trainers
   - D. A bottle of glue only
   - **Answer:** Correct option **B**
   - **Feedback:** Paint is provided; a personal pencil and notebook are requested.

- **REA-A1-01-Q6** (single_choice; evidence weight 1; tags: reading.detail) — What did students make last week?
   - A. Posters about saving water
   - B. Signs for the school garden
   - C. Library cards
   - D. New school uniforms
   - **Answer:** Correct option **B**
   - **Feedback:** Last week's work was colourful garden signs; this week's poster has a different topic.

- **REA-A1-01-Q7** (single_choice; evidence weight 1; tags: reading.inference) — Can someone join if they missed the first week?
   - A. Yes, new students may join at any time.
   - B. No, only the first eight students may join.
   - C. Only if they bring paint.
   - D. Only at the end of the year.
   - **Answer:** Correct option **A**
   - **Feedback:** The notice explicitly welcomes new students at any time.

- **REA-A1-01-Q8** (single_choice; evidence weight 1; tags: reading.detail) — How can students register?
   - A. Phone Ms Hoa after school
   - B. Write their name outside the library before Wednesday lunch
   - C. Send a letter to the gym
   - D. Tell the canteen worker
   - **Answer:** Correct option **B**
   - **Feedback:** The last sentence gives the registration location and deadline.


### Specific Reading integrity question

**Potential mismatch `REA-A1-01-Q7`:** the passage says *“New students can join at any time”*; Q7 asks whether someone may join after missing week one. The correct answer and the feedback explicitly repeat that permission, while its tag remains `reading.inference` (historical v1.18.0 metadata). Is this primarily an *explicit detail / paraphrase / condition* rather than an inference? Review whether retaining this tag inflates inference evidence or simply reflects basic direct inference. Do not change the old 1.18.0 package, earlier attempts or grades. If a tag correction is academically required, specify a future versioned remediation and exact tests.

## 3. Vocabulary — exact Stage 3 revised teaching and preserved assessment

### VOC-A1-01 — School places and classroom language

**Module:** vocabulary · **CEFR target:** undefined · **Unchanged item count:** 8

**Learning objectives:**
1. Understand useful school expressions from their context.
2. Notice which verbs and nouns naturally occur together.
3. Recall a useful phrase without always seeing answer options.
4. Practise using school expressions in simple spoken or written sentences (unscored self-practice).

**English explanation (exact from curriculum):**

> School words name places, classroom tools and actions. A library has books for reading; a canteen serves food; a science lab is a special room for practical science; a corridor connects classrooms. A ruler is used for measuring. To borrow something means to use it briefly and return it. If you miss an instruction, ask politely for the speaker to say it again. Notice natural verb–noun groups such as doing your homework instead of translating each word separately. First decide whether a situation calls for a place, an object or an action. Then use the context to choose an expression. The two missing-word questions practise recall with a clue; your own sentences are optional, unscored self-practice.

**Vietnamese optional explanation (exact):**

> Tên nơi chốn, dụng cụ và hành động ở trường cần được hiểu theo ngữ cảnh. Library gắn với sách đọc, canteen là nơi phục vụ đồ ăn, science lab dùng cho hoạt động khoa học và corridor nối các phòng học. Ruler dùng để đo; borrow là mượn tạm rồi trả. Khi chưa nghe rõ, hãy hỏi lại lịch sự. Chú ý cụm động từ–danh từ tự nhiên như doing your homework. Xác định trước câu hỏi cần nơi chốn, đồ vật hay hành động. Hai câu điền từ kiểm tra khả năng nhớ từ có gợi ý; việc tự đặt câu chỉ để luyện thêm, không được chấm điểm.

**Worked examples and self-practice (exact):**

1. SCHOOL PLACES · At break time, Noor buys a banana at the canteen. Later she returns a storybook to the library. One place serves food; the other has books.

2. SCHOOL PLACES · The corridor connects classrooms. Students read the safety signs when they enter the science lab for a practical science activity.

3. CLASSROOM TOOLS · Lin measures the width of a notebook with the ruler before a design project. Think about what each classroom tool is used for.

4. POLITE REQUESTS · Alex missed part of an instruction, so he asks, 'Sorry, could you say the last part again, please?' The teacher says it more slowly.

5. TEMPORARY USE · During group work, Sam borrows a coloured marker and returns it afterwards. The action is temporary, not taking something to keep.

6. SCHOOL ROUTINES · After football, Mei is doing her homework before dinner. Notice the verb that naturally goes with a school task.

7. WORKED STRATEGY · A classmate says, 'The science room is along the hall.' First identify that the message gives a place and a route, not a classroom object. Then match the meaning of the whole context instead of choosing a familiar word blindly.

8. UNSCORED SELF-PRACTICE · Cover the examples. Recall one school place, one classroom tool and one polite request, then write a new sentence of your own. This activity is for practice, not an automatic writing score.


**Existing scored activities, retained unchanged from 1.18.0:**

- **VOC-A1-01-Q1** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Where do students usually borrow books?
   - A. In the gym
   - B. In the library
   - C. In the canteen
   - D. In the playground
   - **Answer:** Correct option **B**
   - **Feedback:** Borrow books is associated with a library.

- **VOC-A1-01-Q2** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — A teacher speaks too quickly. Which request is polite?
   - A. Say it again now!
   - B. Repeat!
   - C. Could you repeat that, please?
   - D. I don't listen.
   - **Answer:** Correct option **C**
   - **Feedback:** Could you repeat that, please? is a polite request for repetition.

- **VOC-A1-01-Q3** (short_answer; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Complete: We eat lunch in the school ___.
   - **Answer:** Accepted: **canteen / cafeteria**; normalization: trim, casefold, collapse_spaces, strip_terminal_punctuation
   - **Feedback:** A canteen or cafeteria is a place where students eat at school.

- **VOC-A1-01-Q4** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Which item helps you draw a straight line?
   - A. A ruler
   - B. An eraser
   - C. A backpack
   - D. A notebook
   - **Answer:** Correct option **A**
   - **Feedback:** A ruler helps you draw or measure straight lines.

- **VOC-A1-01-Q5** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Which activity belongs in a science lab?
   - A. Performing a safe experiment
   - B. Borrowing novels
   - C. Playing a football match
   - D. Buying bus tickets
   - **Answer:** Correct option **A**
   - **Feedback:** A laboratory is a place for practical scientific work.

- **VOC-A1-01-Q6** (short_answer; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Complete: May I ___ your pencil for a minute?
   - **Answer:** Accepted: **borrow**; normalization: trim, casefold, collapse_spaces, strip_terminal_punctuation
   - **Feedback:** Borrow means use something temporarily and return it later.

- **VOC-A1-01-Q7** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — A notice says 'Keep the corridor clear'. What should you do?
   - A. Leave bags across the hallway
   - B. Make space for people to walk
   - C. Run through the classrooms
   - D. Close the library
   - **Answer:** Correct option **B**
   - **Feedback:** A corridor is a hallway; keeping it clear lets people walk safely.

- **VOC-A1-01-Q8** (single_choice; evidence weight 1; tags: vocabulary.meaning_in_context, vocabulary.collocations) — Choose the natural phrase.
   - A. make homework
   - B. do homework
   - C. catch homework
   - D. take homework
   - **Answer:** Correct option **B**
   - **Feedback:** English uses do homework.


### Specific Vocabulary questions

- Do the examples teach useful natural collocations and classroom phrases rather than only teaching the exact answer words?
- Do Q3 `canteen / cafeteria` and Q6 `borrow` have defensible, unambiguous sentence-fit keys for an A1 learner? Are allowed varieties appropriately tolerant?
- Is `UNSCORED SELF-PRACTICE` clearly an opportunity for use of learned phrases, not evidence of productive ability?

## 4. Speaking · Prepare & Practise — actual Stage 3 UI contract

**Existing lesson:** SPE-A2-02, *Explain a simple problem and ask for help*, CEFR target undefined; existing scored objective MCQs unchanged. Its current objectives are: State a simple problem clearly. / Add one useful detail or reason. / Make a polite request for help. / Give a short connected spoken response without reading a full script..

**User-visible new guide (transcribed from `app/speaking-preparation-guide.tsx`):**

- **Goal:** prepare ideas and polite expressions, then practise asking for help aloud; optional, no microphone, AI or account needed.
- **Situation:** a small school problem, ask an adult for help; problem + one detail + polite request.
- **Language toolkit:** Start politely — `Excuse me. / Could I ask you something?`; state the problem — `I can't find… / I've forgotten… / I'm not sure where…`; give a reason — `because… / so…`; ask for help — `Could you please help me? / Could you show me…?`; thank the person — `Thank you for your help.`
- **Independent worked model:** lost library card, need a book for homework: `Excuse me, I can't find my library card. I need a book for homework, so could you tell me what to do? Thank you.` The model explicitly marks the problem, detail and request.
- **New learner task:** forgot sports shoes; ask the PE teacher what to do before class. Learner types keywords only for problem / detail / polite request in three text fields (each max 160 chars).
- **Speak aloud:** about 20–40 seconds, using keywords instead of reading a script.
- **Self-report checkboxes:** `I tried to explain my problem clearly.` / `I tried to make a polite request.` / `I spoke from keywords rather than reading every word.`
- **Evidence boundary:** all notes/checks stay on the current screen; no saving, submission, scoring, microphone or CEFR Speaking level. Historical `SPE-A2-02` MCQ results are described as `Language preparation knowledge · Objective practice`, not a speaking assessment.
- **UX nuance for review:** the independent worked model `<details open>` is expanded on first display even though the learner is asked to close it before speaking. Decide whether this is pedagogically acceptable or should be collapsed by default; do not assume a live mobile check occurred.

## 5. Optional AI Tutor — scope, language, output and honesty

- Available on lesson knowledge/overview screens; never on active graded Foundation practice or Diagnostic. It is opt-in, invoked by learner click, and receives lesson title/focus and the question, not quiz answer keys, private data, arbitrary DOM selections or unsent writing drafts.
- Four quick prompts: **Explain simply** / **Another example** / **Why is it useful?** / **Key points**; 300-character custom question limit.
- Response language decision is deterministic: Vietnamese with or without diacritics should yield Vietnamese explanation with English target phrases; English questions should yield English explanation. Ambiguous cases default to English. The model receives trusted `responseLanguage` alongside input context.
- React `TeachingBlocks` renders bold, bullets, numbered lists and tables as escaped text components; no raw HTML execution. This does not guarantee factual AI output or compliance in live Gemini.
- A `LatestTutorRequest` generation token prevents late responses from a *previous lesson* from updating the new lesson. Static/React-SSR checks passed; live bilingual model response, accessibility, mobile layout and error/timeout behavior **NOT VERIFIED**.
- User-facing notice: AI can make mistakes; do not enter personal information; not for graded assessments; question sent only on ask.

## 6. Listening and Pronunciation boundaries

- **Listening:** deterministic tests execute actual production option-order code using `LIS-A1-01` (10 MCQs with canonical correct ID A), check option permutation and stable canonical key mapping. Full-playback/refresh behavior on a real browser/device remains **NOT TESTED** for this Stage 3 integration.
- **Pronunciation sample pilot:** four temporary MP3s for `feet / fit` and `beat / bit` were technically probed and parent listening was self-reported. They are **not included in the public app tree**; independent blinded identification, per-asset rights clearance and mobile blind-playback QA remain open. `PILOT-PRO-01/02` must stay **UNASSESSED / evidence_weight 0**. Existing `PRO-A2-01-v1.mp3` remains unchanged.

## 7. Numbered independent review questions

1. **EDU-01/02/03 (Reading):** Is the guitar mini-notice independent and appropriately scoped for A1? Does the revised pedagogy teach gist, detail, conditions and defensible inference without leaking active Art Club answers?
2. **ACA-02 / Reading tagging:** Is Q7 properly categorized `reading.inference`? If not, specify exact future-version correction, affected evidence label and test, explicitly preserving historical scores.
3. **VOC acceptance:** Is the School Chunks toolkit natural and varied? Are all 8 answers/feedback and both short-answer accepted forms correct, educationally fair and adequately supported?
4. **SPE acceptance:** Does the actual optional speaking guide implement meaningful preparation without creating false oral proficiency evidence? Should the worked model initially be collapsed?
5. **AI-01:** Are the opt-in, bilingual, escaped-rendering and scope boundaries academically safe as described? Identify what still requires an actual browser/model test rather than treating source tests as proven live behavior.
6. **LIS/MED-01:** Is the correct action to keep new pronunciation sample tasks unassessed and out of the release until independent listening, rights and browser QA pass? List the minimum required evidence.
7. **EDU-04:** Do objective feedback explanations identify the supporting text/rule and a useful next action? Identify any *required* improvements rather than merely cosmetic suggestions.
8. **DAT-01 / REL-01:** Do engineering results permit *technical QA acceptance only*, while keeping independent browser/mobile checks, NotebookLM verdict reconciliation and explicit owner production approval separate?

## 8. Required review verdict format

Return exactly these sections:

**ACADEMIC_VERDICT:** `PASS`, `PASS_WITH_REQUIRED_CHANGES`, or `FAIL`.
**RELEASE_VERDICT:** `GO` or `NO-GO` (production must be NO-GO while browser/rights/authorization gates are not verified).
**GATE_MATRIX:** concise statuses for `EDU-01/02/03/04`, `ACA-01/02`, `MOD-01`, `MED-01`, `AI-01`, `DAT-01`, `UX-01`, `REL-01`. Use `PASS`, `PASS_WITH_REQUIRED_CHANGES`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`.
**REQUIRED_CHANGES:** numbered; each entry must include exact lesson/item ID, defect, learning impact, proposed correction, historical/versioning effect, and retest evidence. Use `None` if truly none.
**OPTIONAL_IMPROVEMENTS:** separately.
**UNVERIFIED_CLAIMS:** list anything the supplied packet and permanent sources do not substantiate.
**NEXT_GATE:** identify the one next concrete gate after verdict reconciliation, without authorizing deploy.

**Conservative review rule:** Do not infer that GitHub Actions PASS proves a learner can use the Stage 3 UI in a real browser. Do not approve academic key/tag changes without reading exact questions and keeping source-version integrity.

## 9. NotebookLM source-set handoff

**KEEP (permanent sources):** current copies of `00_NOTEBOOK_ENGLISH_PERMANENT_v2.md` through `04_GRAMMAR_ADAPTIVE_ROADMAP_v2.md`, and the adopted canonical `SLE-MASTER-001 v1.0.0` if already present as a permanent source.
**REMOVE (temporary):** prior Stage 3/other batch review packets still active in this Notebook; do not deselect permanent sources.
**ADD (one temporary):** this file only, `SLE_STAGE3_INTEGRATION_REVIEW_20261103.md`. Do not upload raw curriculum JSON.

**Short NotebookLM chat prompt:** `Review the current temporary Stage 3 packet against the permanent English sources. Answer all 8 review questions and return the specified verdict and required corrections. Do not assume untested browser or audio gates pass.`

---
Source data extracted from the GitHub Stage 3 candidate blob SHA `7c4a9f1186fd11c47b8e1ee2951e5aad908102a3`; this packet is not itself a curriculum import or production release authorization.