# Self-Learning English — Reference Library Wave 3: Vocabulary in Context + Reading/Listening Strategies, academic review R1

**PACKET_ID:** `SLE-REF-W3-CROSS-SKILL-VOCAB-R1-20261121`  
**REVIEW_TARGET:** Exactly **35 proposed static reference entries** in §4: seven clusters × five entries; plus taxonomy, anti-duplication and learner-safety design in §3.  
**STATE:** `ACADEMIC_DRAFT / NOTEBOOKLM_NOT_REVIEWED / NOT_IN_JSON / NOT_IN_PREVIEW / NOT_LIVE`  
**NORMATIVE SOURCE:** `SLE-MASTER-001 v1.2.1`, as checked in GitHub `main` on 2026-11-21; **NotebookLM must independently verify the version actually selected in its permanent English sources.**  
**TRACKING:** GitHub `TMA2015/self-learning-english` Issue #186, comprehensive Reference Library expansion; Wave 3 scope described in that issue.  
**BASE:** LIVE English merge commit `ce1f4603bc68368157c0dfbca5fc7098e88fe946` (owner-accepted Wave 2). Reference Library **294 unique reviewed entries**; current curriculum **v1.28.0**, **176 lessons / 1,224 activities**, **44 MP3**. All are read-only checkpoints.  
**IMPLEMENTATION AUTHORITY:** Academic review only. Neither this packet nor academic PASS authorizes source merging, curriculum editing, Firebase deployment, real learner-data access, or AI activation.

## 1. Verified starting point and target gap

The current 294-item Reference Library consists of **191 irregular verbs**, **42 Writing Connectors**, **11 Frequency Expressions**, **20 other original pilot cards**, **20 Grammar Comparisons**, and **10 Writing Toolkit guides**. Of the 20 other pilot cards: **5 collocations**, **4 phrasal verbs**, **3 idioms**, **4 common mistakes**, and **4 learning tips**. Wave 2 is already on LIVE and has passed owner desktop, iPad, historic Save/Resume and representative Listening spot-checks.

Issue #186 specifically places **Vocabulary and cross-skill references** in Wave 3: phrasal verbs, collocations, word families, easily confused words, idioms, Reading/Listening signposts and comprehension strategies. The purpose is to give learners authentic, usable **reference explanations**—not another lesson bank, quiz or unverified proficiency estimate. There is no specialized `word_families`, `confusable_words`, `reading_strategies` or `listening_strategies` category in the current selector. Existing `ReferenceSkill` also has no `listening` union member. Those are **engineering gaps**, not educational permission to rewrite any existing record.

**Deliberate exclusions from this review round:** an intensity/degree reference (`very`, `quite`, `rather`, `too`, `enough`), further idiom depth, CEFR assessment, exact-topic course linking and optional Flashcards/Notes remain candidate future batches. Frequency Expressions remain a separate conceptual axis from degree/intensity. Do not silently claim complete coverage of all Wave 3 needs after this first packet.

## 2. Educational and technical boundaries for this REVIEW

- Target independent English learners, including lower-secondary learners, with **suggested A1–B2 navigation hints**, never earned or certified CEFR levels. Do not assign grades or scores from reading these cards.
- **Vocabulary:** show the natural lexical pattern, actual meaning in context, an independent sample, a contrast or source of error, register/variety qualification and a self-check. Do not reduce a word family to “always add suffix X”. A multiword item's **separability**, object position and different senses must be correct.
- **Reading:** teach flexible gist, discourse, inference, reference tracking and evidence strategies. The short illustrations below are **new fictional micro-texts for unscored explanation**. They must not reproduce or pre-answer any active reading questions in the LIVE curriculum.
- **Listening:** teach purpose, gist, signposts, changed information and additional focused listens without inventing hearing evidence. The written illustrations below are **fictional descriptions of listening situations or post-submit teaching examples**, never actual MP3 transcripts, scored listening stimuli, keys or proof of listening proficiency. Before a scored submission, any hidden transcript and answer key remain concealed. A real-audio playback guard and missing-audio UNASSESSED rules stay untouched.
- **Existing content is immutable.** In particular, do not duplicate `REF-PHR-01 look up`, `REF-PHR-02 run out of`, `REF-PHR-03 turn down`, `REF-PHR-04 set up`, `REF-COL-01 catch a bus`, `REF-COL-02 take notes`, `REF-COL-03 make progress`, `REF-COL-04 meet a deadline`, `REF-COL-05 strong argument`, `REF-IDI-01 break the ice`, `REF-IDI-02 under the weather`, `REF-IDI-03 on the same page`, `REF-MIS-03 borrow vs lend`, `REF-MIS-04 fewer vs less`, `REF-TIP-01 Reading: gist before detail`, and `REF-TIP-02 Reading: evidence vs assumption`. Where a broader strategy is related, the **new actionable procedure and its distinct purpose** must be evident. NotebookLM should reject thin rewordings.
- All proposed cards are **static, read-only reference material**: no active assessment stems or answer keys, no learner notes, no audio upload, no personal data, no auto-replay transcript exposure, no scoring/AI calls. No cross-site Math/Firebase Auth or learner record change.
- Do **not** assert exact lesson-topic alignment. `LESSON_LINK_VERDICT: NO_TOPIC_LINKS_AUTHORIZED` unless a later independent technical/content crosswalk verifies an actual lesson ID and matching taught concept. It is safe to omit links entirely.

## 3. Proposed information architecture — academic review of a DESIGN, not an implemented feature

| Category and ID family | This batch | Existing catalog category? | Useful specialist fields / display |
| --- | ---: | --- | --- |
| `phrasal_verbs`: `REF3-PHR-001..005` | 5 | Yes: keep original 4 | lemma, meaning, object/separability pattern, independent context, alternative senses, register, caution |
| `collocations`: `REF3-COL-001..005` | 5 | Yes: keep original 5 | word partnership, grammar/preposition pattern, independent example, natural alternatives, caution |
| `word_families`: `REF3-WFM-001..005` | 5 | **New** | grouped lexical forms + parts of speech, meaning difference, useful construction, context, limits |
| `confusable_words`: `REF3-CNF-001..005` | 5 | **New** | two-word decision, contrast with distinct examples, grammar category, common error and exceptions |
| `idioms`: `REF3-IDI-001..005` | 5 | Yes: keep original 3 | figurative meaning, register, realistic original example, literal trap, variation/caution |
| `reading_strategies`: `REF3-REA-001..005` | 5 | **New** | when useful, short procedure, independent invented mini-text, reasoning, self-check, overreach caveat |
| `listening_strategies`: `REF3-LIS-001..005` | 5 | **New** | listening purpose, procedure for real audio, fictional teaching scenario, self-check, transcript/playback safeguards |
| **Total new** | **35** | Reuse 3 kinds; propose 4 kinds | Potential **329** total only **after** approval, implementation, QA and owner release |

**Stable fields for each drafted entry:** `id`, `suggested_level`, `register_or_mode`, `meaning_or_strategy`, `pattern_or_procedure`, `independent_illustration`, `contrast_or_reasoning`, `watch_out_or_limits`, `learner_self_check`, and `search_hints`. Specialist fields can be mapped to existing typed UI shapes or a new subtype only after independent review. Display *all* important usage caveats, not just title and a generic definition. The English-first static source should work without an account, AI or network after app load. Use distinct accessible labels and readable 320px cards, not a forced wide seven-column table.

**Engineering constraints to examine after PASS:** retain the 294 current IDs, source JSON bytes and category behavior; add four kinds without altering old category labels or history; extend the current `ReferenceSkill` union for Listening only as required by new UI while **prohibiting automatic related-lesson links** for new entries; search over forms, alternative phrases, confusions and comprehension procedures; test A1–B2 range filtering without claiming competence. Do not put written fictional Listening samples behind controls that could expose hidden scored material.

## 4. Thirty-five ORIGINAL academic candidates — each PENDING independent review

### A. Phrasal verbs — five new entries

#### REF3-PHR-001 — look after
- **Suggested level:** A2. **Register / mode:** neutral conversational English.
- **Meaning or strategy:** Care for a person, animal or thing for a period of time.
- **Pattern or procedure:** `look after + object`; the object normally follows the whole expression: `look after her`, not `look her after`.
- **Independent illustration:** *When their neighbours travelled, Salma looked after their two rabbits.*
- **Contrast or reasoning:** This describes providing care, not just briefly looking at the rabbits; it differs from **look up**, which can mean search for information (existing `REF-PHR-01`).
- **Watch out or limits:** In some contexts, *look after* also means deal with a task. Do not claim it always means childcare.
- **Learner self-check:** Can I name **who or what receives care** after the two-word verb?
- **Search hints:** care for, look after, look up, animal care, inseparable phrasal verb.

#### REF3-PHR-002 — put off
- **Suggested level:** B1. **Register / mode:** neutral.
- **Meaning or strategy:** Postpone an activity or event to a later time.
- **Pattern or procedure:** `put off + noun` or `put + pronoun + off`: *put off the trip / put it off*. The postponement sense is separable.
- **Independent illustration:** *The club put off its outdoor meeting because a storm was forecast.*
- **Contrast or reasoning:** The meeting is delayed, not necessarily cancelled; *cancel* would mean it will not take place as planned.
- **Watch out or limits:** *Put someone off* can instead mean discourage or repel them; surrounding context determines the sense. Not *put off it* for this object-pronoun pattern.
- **Learner self-check:** Can I replace the event with *it* and place *it* correctly?
- **Search hints:** postpone, delay, put it off, put off a meeting, separable.

#### REF3-PHR-003 — carry on
- **Suggested level:** A2–B1. **Register / mode:** neutral; especially common in British English.
- **Meaning or strategy:** Continue an activity already in progress.
- **Pattern or procedure:** `carry on + -ing` or `carry on with + noun`: *carry on drawing / carry on with the project*.
- **Independent illustration:** *Although the library was noisy, the volunteers carried on sorting donated books.*
- **Contrast or reasoning:** The work continues despite the interruption; this is different from starting a fresh task.
- **Watch out or limits:** *Carry on* has other meanings, including behave in an excited or disorderly way; avoid forcing a continuation reading in every context.
- **Learner self-check:** Does my sentence say **what continues**, and have I used `-ing` or `with` appropriately?
- **Search hints:** continue, keep going, carry on doing, carry on with, persistence.

#### REF3-PHR-004 — figure out
- **Suggested level:** B1. **Register / mode:** neutral to informal, frequent in speech.
- **Meaning or strategy:** Understand something or find a solution after thinking.
- **Pattern or procedure:** `figure out + noun` or `figure + pronoun + out`: *figure out the route / figure it out*.
- **Independent illustration:** *After comparing the two maps, Jun finally figured out which path led to the station.*
- **Contrast or reasoning:** *Figure out* suggests reaching an understanding or answer, not simply seeing the information.
- **Watch out or limits:** In formal writing, *determine*, *understand* or *solve* may sometimes suit the context better; the phrasal verb is not a universal synonym for all three.
- **Learner self-check:** Does the expression identify the **problem or information understood**, and is a pronoun placed between the verb and particle?
- **Search hints:** understand, solve, work out, figure it out, separable.

#### REF3-PHR-005 — take up
- **Suggested level:** A2–B1. **Register / mode:** neutral.
- **Meaning or strategy:** Begin a hobby or regular activity.
- **Pattern or procedure:** `take up + activity/noun`: *take up painting / take up a new sport*. With a pronoun: *take it up*.
- **Independent illustration:** *Last winter, Rosa took up birdwatching and started keeping a notebook of sightings.*
- **Contrast or reasoning:** This says a new interest started; *carry on* describes continuing an existing activity.
- **Watch out or limits:** *Take up* can also mean occupy time/space or accept an offer or challenge. The hobby sense is not appropriate in all sentences.
- **Learner self-check:** Does my example introduce a **new** regular interest, rather than a task that was already underway?
- **Search hints:** start a hobby, take up painting, activity, begin, take it up.

### B. Collocations — five new entries

#### REF3-COL-001 — make a decision
- **Suggested level:** A2–B1. **Register / mode:** neutral.
- **Meaning or strategy:** Choose between possible actions after considering options.
- **Pattern or procedure:** `make + a decision`; often `make a decision about/on something` or `decide to + verb`.
- **Independent illustration:** *After visiting both clubs, An decided to join the robotics club; she made the decision on Friday.*
- **Contrast or reasoning:** *Make a decision* is the idiomatic verb–noun partnership; `do a decision` is not ordinary standard usage.
- **Watch out or limits:** `Decide` is often simpler and more natural than a long noun phrase. The exact preposition depends on construction.
- **Learner self-check:** Can I rewrite my phrase naturally with the verb *decide* without changing meaning?
- **Search hints:** decide, choice, make a decision, decision about, decision on.

#### REF3-COL-002 — pay attention to
- **Suggested level:** A2. **Register / mode:** neutral.
- **Meaning or strategy:** Concentrate on information, a person or an activity.
- **Pattern or procedure:** `pay attention to + noun/-ing`; here `to` is a preposition: *pay attention to the signs / to how the speaker changes topic*.
- **Independent illustration:** *Before crossing the trail bridge, the hikers paid attention to the warning sign.*
- **Contrast or reasoning:** The words form a common partnership; *give attention to* occurs but differs in style and often emphasis.
- **Watch out or limits:** Do not use `to + base verb` just because the expression contains `to`. Other constructions, such as *draw attention to*, are separate collocations.
- **Learner self-check:** Is the thing I should notice clearly expressed after *to*?
- **Search hints:** focus, concentrate, pay attention to, sign, listen carefully.

#### REF3-COL-003 — take responsibility for
- **Suggested level:** B1. **Register / mode:** neutral to formal.
- **Meaning or strategy:** Accept a duty or acknowledge responsibility for an action or outcome.
- **Pattern or procedure:** `take responsibility for + noun/-ing`.
- **Independent illustration:** *After the exhibition, the class committee took responsibility for returning the borrowed tables.*
- **Contrast or reasoning:** This expression focuses on accepting duty; *be responsible for* can describe an existing duty without highlighting the act of accepting it.
- **Watch out or limits:** Responsibility can involve accountability or a practical assigned task. The expression does not imply someone is legally at fault.
- **Learner self-check:** Have I stated **what responsibility is accepted**, not just who is responsible?
- **Search hints:** responsibility, accept duty, accountable, take responsibility for, obligation.

#### REF3-COL-004 — do research on/into
- **Suggested level:** B1. **Register / mode:** neutral; *conduct research* is often more formal.
- **Meaning or strategy:** Investigate a question by gathering and examining information.
- **Pattern or procedure:** `do research on/into + topic`; *research* is usually uncountable in this general meaning.
- **Independent illustration:** *For the school exhibition, the group did research on how local trees survive long dry periods.*
- **Contrast or reasoning:** *Conduct research* is an alternative, especially in academic prose; `make a research` is not idiomatic for the general activity.
- **Watch out or limits:** *A study* or *a research project* can name one particular investigation; this does not make general *research* routinely countable.
- **Learner self-check:** Can I replace *do research* with *investigate* while keeping the intended meaning?
- **Search hints:** research, investigate, conduct research, do research on, research into.

#### REF3-COL-005 — draw a conclusion
- **Suggested level:** B1. **Register / mode:** neutral to formal.
- **Meaning or strategy:** Reach a reasoned judgement from available information or evidence.
- **Pattern or procedure:** `draw a conclusion from + evidence` or plural `draw conclusions`.
- **Independent illustration:** *The seedlings near the window grew taller; the class drew a cautious conclusion that light might have played a role.*
- **Contrast or reasoning:** The expression highlights an inference from observations rather than a mere preference.
- **Watch out or limits:** An observation alone may not establish causation. *Reach a conclusion* is also natural; do not force *draw* in every register.
- **Learner self-check:** Have I named the **evidence** and avoided a stronger conclusion than it supports?
- **Search hints:** conclude, evidence, infer, draw a conclusion, reach a conclusion.

### C. Word families — five new entries

#### REF3-WFM-001 — decide / decision / decisive
- **Suggested level:** B1. **Register / mode:** neutral.
- **Meaning or strategy:** Recognize related word forms without treating them as interchangeable.
- **Pattern or procedure:** Verb `decide (to do)`; noun `decision (about/on)`; adjective `decisive` = effective in settling a question or showing determination, depending on context.
- **Independent illustration:** *The team had to decide by noon. Their decision was final. A decisive vote ended the debate.*
- **Contrast or reasoning:** *Decision* names the choice; *decisive* describes an action, factor or person rather than being a noun form of *decide*.
- **Watch out or limits:** A `decided` change or a `decisive` change is not always the same thing; spelling relation does not guarantee identical meaning.
- **Learner self-check:** Can I mark the verb, noun and adjective in the three sentences?
- **Search hints:** decide, decision, decisive, word family, part of speech.

#### REF3-WFM-002 — succeed / success / successful
- **Suggested level:** A2–B1. **Register / mode:** neutral.
- **Meaning or strategy:** Express achievement using verb, noun and adjective patterns.
- **Pattern or procedure:** Verb `succeed in + -ing`; noun `success`; adjective `successful (in/at something)`.
- **Independent illustration:** *Linh succeeded in repairing the bicycle. The repair was a success, and her first test ride was successful.*
- **Contrast or reasoning:** The verb focuses on achieving an aim; the noun names the achievement or a successful event; the adjective describes its result.
- **Watch out or limits:** `Success` can be countable or uncountable according to meaning; *succeed to* can have a different formal meaning involving inheriting a position/title.
- **Learner self-check:** After *succeeded in*, did I use a noun or an `-ing` form?
- **Search hints:** succeed, success, successful, succeeded in, result.

#### REF3-WFM-003 — explain / explanation / explanatory
- **Suggested level:** B1. **Register / mode:** neutral; *explanatory* is often more academic.
- **Meaning or strategy:** Distinguish an act of explaining from an explanation and something that helps explain.
- **Pattern or procedure:** Verb `explain + something (to someone)`; noun `an explanation (of/for something)`; adjective `explanatory` before a noun.
- **Independent illustration:** *The guide explained the symbols to the visitors. Her explanation was clear, and the explanatory diagram was easy to follow.*
- **Contrast or reasoning:** *Explain* is a verb; *explanation* names the information or act; *explanatory* describes a diagram, note or method.
- **Watch out or limits:** In standard English, say *explain the rule to me*, not `explain me the rule`. `Explanatory` is not the ordinary past participle of the verb.
- **Learner self-check:** Can I change *explain the symbols* into *give an explanation of the symbols* naturally?
- **Search hints:** explain, explanation, explanatory, tell someone why, word forms.

#### REF3-WFM-004 — differ / difference / different
- **Suggested level:** A2–B1. **Register / mode:** neutral.
- **Meaning or strategy:** Compare things using related verb, noun and adjective forms.
- **Pattern or procedure:** Verb `differ from`; noun `a difference between`; adjective `different from` (other prepositions also occur by variety/context).
- **Independent illustration:** *The two routes differ in length. One difference between them is the number of stairs. They are also different in cost.*
- **Contrast or reasoning:** *Differ* reports variation as a verb; *difference* names a contrast; *different* describes something as unlike another.
- **Watch out or limits:** Prepositions vary by dialect and construction (*different from/to/than*). Do not mark every regional alternative as inherently wrong.
- **Learner self-check:** Does my sentence need a verb, a noun, or an adjective in the gap?
- **Search hints:** differ, difference, different, comparison, different from.

#### REF3-WFM-005 — create / creation / creative
- **Suggested level:** A2–B1. **Register / mode:** neutral.
- **Meaning or strategy:** Distinguish producing something from the product/process and the quality of originality.
- **Pattern or procedure:** Verb `create + object`; noun `creation` (the act or something made); adjective `creative` (showing imagination or inventiveness).
- **Independent illustration:** *The students created a small maze. Their creation entertained visitors, and the creative design used recycled boxes.*
- **Contrast or reasoning:** A created object is not automatically creative; the adjective says something about originality or invention.
- **Watch out or limits:** *Creative* can also describe a person or profession; it is not a universal replacement for *created*.
- **Learner self-check:** Am I describing **what was made** or **how imaginative it is**?
- **Search hints:** create, creation, creative, made, originality, word family.

### D. Commonly confused words — five new entries

#### REF3-CNF-001 — say vs tell
- **Suggested level:** A2. **Register / mode:** neutral.
- **Meaning or strategy:** Choose the reporting verb based on whether the message or listener is emphasized.
- **Pattern or procedure:** `say + something` / `say something to + person`; `tell + person + something` in the common reporting pattern.
- **Independent illustration:** *Noor said that the hall was closed. She told her brother the news.*
- **Contrast or reasoning:** *Said* can introduce the message without a direct-person object; *told* commonly names who received the information.
- **Watch out or limits:** Expressions such as *tell the truth* and *say hello* have their own patterns. Do not generalize that *tell* must always take a person immediately after it.
- **Learner self-check:** If I name the listener after *said*, do I need *to* in this construction?
- **Search hints:** said, told, report speech, say to someone, tell someone.

#### REF3-CNF-002 — job vs work
- **Suggested level:** A2. **Register / mode:** neutral.
- **Meaning or strategy:** Distinguish a specific role/task from the broader activity of working.
- **Pattern or procedure:** *A job* is often countable (*two part-time jobs*); *work* meaning employment or activity is usually uncountable (*a lot of work*).
- **Independent illustration:** *Eva found a weekend job at a museum. She enjoys the work but has a lot of work to finish before Friday.*
- **Contrast or reasoning:** *Job* may identify a position or task; *work* can describe the activity or responsibilities rather than one position.
- **Watch out or limits:** *Works* can be countable in special senses (artworks, engineering works); *a work* exists in certain contexts. Do not claim *work* is never countable.
- **Learner self-check:** Am I referring to one position/task or work as an amount of activity?
- **Search hints:** job, work, employment, countable, uncountable, occupation.

#### REF3-CNF-003 — fun vs funny
- **Suggested level:** A2. **Register / mode:** everyday; *fun* as an adjective is common informally.
- **Meaning or strategy:** Choose *fun* for enjoyment and *funny* for humour or something odd.
- **Pattern or procedure:** `have fun`, `a fun activity` (common informal adjective); `a funny story` = amusing or strange, depending on context.
- **Independent illustration:** *The science trail was fun, and the guide told a funny story about a runaway robot.*
- **Contrast or reasoning:** Enjoyment need not involve laughter; a joke can be funny even if an event is not generally enjoyable.
- **Watch out or limits:** *Funny* can mean suspicious or unusual, not only humorous. Calling a serious incident *funny* may communicate the wrong tone.
- **Learner self-check:** Do I mean “enjoyable”, “amusing” or “strange”?
- **Search hints:** fun, funny, enjoyable, amusing, strange, adjective.

#### REF3-CNF-004 — advice vs advise
- **Suggested level:** B1. **Register / mode:** neutral.
- **Meaning or strategy:** Distinguish the noun for guidance from the verb for giving guidance.
- **Pattern or procedure:** Noun `advice` (normally uncountable: *some advice, a piece of advice*); verb `advise + person + to-infinitive`.
- **Independent illustration:** *The coach gave Sam useful advice. She advised him to rest before the next race.*
- **Contrast or reasoning:** The noun names guidance; the verb describes the action of recommending something.
- **Watch out or limits:** Spelling differs (`-ce` vs `-se`) and the usual pronunciations differ in the final sound. Do not write `an advice` for a single ordinary suggestion.
- **Learner self-check:** Can I replace the word with “guidance” (noun) or “recommend” (verb)?
- **Search hints:** advice, advise, recommendation, noun vs verb, a piece of advice.

#### REF3-CNF-005 — actually vs currently
- **Suggested level:** B1. **Register / mode:** neutral.
- **Meaning or strategy:** Separate a correction or reality marker (*actually*) from a present-time marker (*currently*).
- **Pattern or procedure:** `actually` often means *in fact*; `currently` means *at present*, often with a situation that may change.
- **Independent illustration:** *I thought the art room was on the second floor, but it is actually on the first. It is currently closed for repairs.*
- **Contrast or reasoning:** The first adverb corrects a belief; the second reports the room's present status.
- **Watch out or limits:** *Actually* can also soften or introduce conversational remarks, not always contradiction. Do not use it as a synonym for *now*.
- **Learner self-check:** Am I correcting a fact or telling the reader what is true at this time?
- **Search hints:** actually, currently, in fact, at present, false friend, now.

### E. Idioms — five new entries

#### REF3-IDI-001 — once in a blue moon
- **Suggested level:** B1. **Register / mode:** informal conversational idiom.
- **Meaning or strategy:** Something happens very rarely.
- **Pattern or procedure:** Often used as an adverbial phrase: `I go there once in a blue moon`.
- **Independent illustration:** *Our neighbourhood holds a night-time telescope event only once in a blue moon.*
- **Contrast or reasoning:** It communicates rarity figuratively rather than a literal lunar schedule.
- **Watch out or limits:** It is **not** a mathematically fixed frequency or substitute for a measured interval. The existing Frequency Expressions ladder remains qualitative.
- **Learner self-check:** Could I replace it with *very rarely* without changing the intended meaning?
- **Search hints:** once in a blue moon, rare, hardly ever, idiom, frequency.

#### REF3-IDI-002 — a piece of cake
- **Suggested level:** A2–B1. **Register / mode:** informal.
- **Meaning or strategy:** A task is very easy for the speaker in the given situation.
- **Pattern or procedure:** `something is/was a piece of cake`.
- **Independent illustration:** *After practising the route all week, finding the museum was a piece of cake for Theo.*
- **Contrast or reasoning:** The idiom evaluates difficulty, not food or actual cake.
- **Watch out or limits:** It is informal and subjective; calling someone's difficult experience *a piece of cake* may sound dismissive.
- **Learner self-check:** Would *very easy* fit the sentence, and is an informal idiom suitable for the reader?
- **Search hints:** a piece of cake, easy, informal, difficulty, idiom.

#### REF3-IDI-003 — hit the books
- **Suggested level:** B1. **Register / mode:** informal.
- **Meaning or strategy:** Start studying seriously or devote concentrated time to studying.
- **Pattern or procedure:** `hit the books`; often a brief statement of intention: *I need to hit the books*.
- **Independent illustration:** *With the astronomy quiz next week, Dara decided to hit the books after dinner.*
- **Contrast or reasoning:** The phrase means study, not physically strike printed books.
- **Watch out or limits:** It is casual; it may not suit a formal study report or academic essay.
- **Learner self-check:** Is the context about serious study rather than a literal action?
- **Search hints:** hit the books, study, exam preparation, informal idiom.

#### REF3-IDI-004 — the last straw
- **Suggested level:** B1. **Register / mode:** neutral to informal.
- **Meaning or strategy:** The final additional problem that makes a difficult situation intolerable.
- **Pattern or procedure:** `the last straw` or `the final straw`, often with a preceding series of difficulties.
- **Independent illustration:** *Three printers had broken that week. When the last working printer jammed, it was the last straw for the team.*
- **Contrast or reasoning:** The final jam is not the only problem; it pushes a build-up of frustrations past a limit.
- **Watch out or limits:** Do not use it for any single minor inconvenience with no implied accumulation, unless exaggeration is deliberate.
- **Learner self-check:** Have I shown earlier difficulties that explain why this last event mattered?
- **Search hints:** last straw, final straw, frustration, accumulated problems, idiom.

#### REF3-IDI-005 — in hot water
- **Suggested level:** B1. **Register / mode:** informal.
- **Meaning or strategy:** In trouble or facing criticism or consequences for something.
- **Pattern or procedure:** `be/get in hot water (with someone)`.
- **Independent illustration:** *Milo got in hot water with the club organiser after changing the schedule without asking.*
- **Contrast or reasoning:** The person is in a difficult social situation, not literally in heated water.
- **Watch out or limits:** The degree of trouble depends on context; it does not necessarily imply legal trouble or danger.
- **Learner self-check:** Can I replace it with *in trouble* naturally, and is the tone informal enough?
- **Search hints:** in hot water, trouble, criticism, consequences, informal idiom.

### F. Reading strategies — five new entries

#### REF3-REA-001 — distinguish the main claim from an example
- **Suggested level:** A2–B1. **Register / mode:** unscored reading strategy.
- **Meaning or strategy:** Identify what a paragraph mainly asserts and what merely illustrates it; this is more specific than the existing pilot reminder `REF-TIP-01 gist before detail`.
- **Pattern or procedure:** (1) Ask what all sentences contribute to. (2) Identify the broader claim. (3) Label one supporting example. (4) Check that the claim does not overstate the paragraph.
- **Independent illustration:** *Small public gardens benefit city insects. For example, the new flower beds outside the library attract bees.* The first sentence makes the broad claim; the second gives one example.
- **Contrast or reasoning:** The mention of bees is evidence or illustration of a broader point, not necessarily the whole main idea.
- **Watch out or limits:** Not every paragraph begins with its main idea; in narrative writing, the central point may be implied.
- **Learner self-check:** Does my summary include the broader idea without being just a copy of the bee example?
- **Search hints:** main idea, claim, supporting detail, example, paragraph purpose.

#### REF3-REA-002 — follow contrast and concession in a text
- **Suggested level:** A2–B1. **Register / mode:** unscored reading strategy.
- **Meaning or strategy:** Notice when a writer introduces a competing fact or changes the expected direction of an argument.
- **Pattern or procedure:** Underline a cue (*but, however, although*), identify both ideas, then explain which limitation or change the cue signals.
- **Independent illustration:** *Although the path was longer, it had fewer steep steps.* The second clause presents a benefit that qualifies the disadvantage in the first.
- **Contrast or reasoning:** Knowing the word *although* is not enough; the reader must understand the relationship between the two parts.
- **Watch out or limits:** Discourse markers can be used in nuanced ways. The presence of *however* alone does not prove the author's final opinion.
- **Learner self-check:** Can I state both sides in my own words, including what is being conceded?
- **Search hints:** contrast, concession, although, however, opposing ideas, reading signal.

#### REF3-REA-003 — separate event order from cause
- **Suggested level:** B1. **Register / mode:** unscored reading strategy.
- **Meaning or strategy:** Avoid assuming that the event reported first caused the event reported next.
- **Pattern or procedure:** (1) Mark sequence words (*then, after*). (2) Look for explicit cause cues (*because, therefore*) or independent evidence. (3) If none exists, retain uncertainty.
- **Independent illustration:** *It rained during the afternoon. That evening, the science fair was postponed.* The order is clear; the short text does not explicitly establish why the fair was postponed.
- **Contrast or reasoning:** A plausible link between rain and postponement is not the same as a stated or well-supported cause.
- **Watch out or limits:** Writers sometimes imply causal links without using *because*. Do not deny evidence-based inference merely because a signal word is missing.
- **Learner self-check:** Which exact words or facts support the cause I am claiming?
- **Search hints:** cause, effect, sequence, after, because, inference, evidence.

#### REF3-REA-004 — resolve reference words in context
- **Suggested level:** A2–B1. **Register / mode:** unscored reading strategy.
- **Meaning or strategy:** Work out what *it, they, this, those* or similar references point to in a passage.
- **Pattern or procedure:** Look back to nearby candidates, check number and meaning, then reread the sentence with the likely noun substituted.
- **Independent illustration:** *Asha placed the new lens in a box because it was fragile.* Here *it* most naturally refers to the lens rather than the box, given the reason supplied.
- **Contrast or reasoning:** Grammar may narrow candidates, but meaning and context often settle the reference.
- **Watch out or limits:** Some pronoun references genuinely remain ambiguous; do not claim certainty when two readings are plausible.
- **Learner self-check:** Does substituting my chosen noun preserve the sentence's sense?
- **Search hints:** pronoun reference, it, they, this, referent, reading context.

#### REF3-REA-005 — make a limited inference from text evidence
- **Suggested level:** B1. **Register / mode:** unscored reading strategy.
- **Meaning or strategy:** Infer what is reasonably supported but not directly stated; this operationalises, rather than replaces, pilot `REF-TIP-02 evidence vs assumption`.
- **Pattern or procedure:** Separate (1) direct statement, (2) justified implication, and (3) attractive but unsupported guess; name at least one clue for the implication.
- **Independent illustration:** *The café chairs were stacked and the sign on the door read “Back at eight tomorrow.”* The café is probably closed now; the micro-text does not prove the owner is on holiday.
- **Contrast or reasoning:** “Closed now” is supported by several details; “on holiday” adds a story with no text evidence.
- **Watch out or limits:** Inference can remain probabilistic. An answer should not be described as definitely true when the clues allow alternatives.
- **Learner self-check:** Which detail supports my inference, and what stronger claim have I deliberately avoided?
- **Search hints:** inference, evidence, implied meaning, stated vs unstated, careful reading.

### G. Listening strategies — five new entries

**Important:** All examples here are **fictional descriptions for reading about the listening process**, NOT audio stimuli or existing transcripts. No learner should receive Listening credit for reading these cards. These cards are always accessible as generic reference guidance; a scored lesson's own hidden transcript, key and item-specific cues must remain inaccessible until that lesson's permitted post-submit state.

#### REF3-LIS-001 — decide the listening purpose before play
- **Suggested level:** A1–A2. **Register / mode:** unscored listening strategy.
- **Meaning or strategy:** Decide whether the task asks about overall situation, a detail, an intention or a change; listen with a clear purpose rather than trying to memorise all sounds.
- **Pattern or procedure:** (1) Read the legitimate task instructions. (2) Identify what type of information is needed. (3) Play the verified audio. (4) Refine attention on a later listen if necessary.
- **Independent illustration:** *Fictional teaching scenario:* A short museum announcement may require identifying **where to meet**, rather than memorising every item described in the announcement.
- **Contrast or reasoning:** Purposeful attention reduces overload; it does not guarantee a correct answer.
- **Watch out or limits:** Do not reveal a current lesson's hidden audio script, answer key, or any content clue masquerading as “help”. This description is not hearing evidence.
- **Learner self-check:** Before playing, can I say what **kind** of information I need without guessing the answer?
- **Search hints:** listening purpose, task instructions, focus, play audio, gist vs detail.

#### REF3-LIS-002 — use the first listen for gist
- **Suggested level:** A1–A2. **Register / mode:** unscored listening strategy.
- **Meaning or strategy:** Identify the main situation or topic before chasing every word.
- **Pattern or procedure:** After a genuine first listen, ask who is involved, what situation is occurring and the broad reason for the message; listen again for unresolved details as appropriate.
- **Independent illustration:** *Fictional teaching scenario:* During a short club announcement, a learner first recognises that a meeting arrangement is being discussed, without yet knowing its exact time.
- **Contrast or reasoning:** Gist is an overall understanding; one isolated familiar word may be misleading.
- **Watch out or limits:** This does not impose a compulsory number of plays or award Listening evidence without real playable audio and its playback guard.
- **Learner self-check:** Can I express the situation in one short phrase while keeping unknown details as unknown?
- **Search hints:** listening gist, first listen, main idea, announcement, overall situation.

#### REF3-LIS-003 — track a change of plan or contrast
- **Suggested level:** A2–B1. **Register / mode:** unscored listening strategy.
- **Meaning or strategy:** Detect when a speaker corrects an earlier choice or changes direction.
- **Pattern or procedure:** When genuine audio contains contrast language (*but, instead, actually, in the end*), notice the **later relevant information** and check whether it revises what came before.
- **Independent illustration:** *Invented post-submit teaching illustration, not an active transcript:* “We considered the garden, but we chose the library hall in the end.” The final location is the hall in this fictional example.
- **Contrast or reasoning:** A first-mentioned option may be rejected; focus on what the message finally commits to, where that is the task's purpose.
- **Watch out or limits:** This is a generic explanation only. Never display a current graded lesson's alternative choices or correct answer before submission; an isolated word such as *but* is not a complete answer.
- **Learner self-check:** In a fresh audio clip, can I distinguish an initial possibility from the final decision?
- **Search hints:** listening signposts, but, instead, actually, final plan, contrast.

#### REF3-LIS-004 — check numbers, time and corrected details
- **Suggested level:** A2–B1. **Register / mode:** unscored listening strategy.
- **Meaning or strategy:** Distinguish a number or time actually confirmed by a speaker from one that was replaced or misheard.
- **Pattern or procedure:** On verified audio, listen for the relevant quantity/unit, note whether the speaker corrects it, and make an additional focused listen where allowed.
- **Independent illustration:** *Invented post-submit teaching illustration:* A fictional speaker corrects “Thursday afternoon” to “Friday morning”; the correction, rather than the first time phrase, matters in that example.
- **Contrast or reasoning:** An early date can be a false lead when the speaker explicitly revises it.
- **Watch out or limits:** Accent, speech rate and numbers can be challenging; a written illustration cannot substitute for heard verification. Do not expose answer-specific timestamps or actual hidden scripts before a graded submission.
- **Learner self-check:** Did I hear a revision, and did I keep track of whether the unit was a date, time, amount or location?
- **Search hints:** listening details, time, date, correction, numbers, second listen.

#### REF3-LIS-005 — replay strategically and use transcripts only when allowed
- **Suggested level:** A2–B1. **Register / mode:** unscored listening strategy.
- **Meaning or strategy:** Use additional listens to resolve a concrete uncertainty; use a transcript as **post-submit feedback**, not a pre-answer shortcut.
- **Pattern or procedure:** (1) Identify the uncertain part after first listening. (2) Replay the available verified audio as the lesson permits. (3) Answer from actual hearing. (4) Review a transcript **only after submission where the lesson releases it**, checking how the missed wording sounds.
- **Independent illustration:** *Fictional teaching scenario:* A learner is confident about a message's topic but unsure about its meeting place; the next listen focuses on location words, not every sentence.
- **Contrast or reasoning:** Targeted replay can be more useful than unfocused repeated playback. Reading a transcript beforehand would instead test reading, not listening.
- **Watch out or limits:** No fixed number of plays proves proficiency. The supported audio player must still verify full playback for the relevant attempt; missing or invalid audio means **UNASSESSED** for Listening. Do not invent a transcript-release button if the runtime does not have one.
- **Learner self-check:** What specific uncertainty should my next real listen resolve?
- **Search hints:** replay, second listen, transcript after submit, audio guard, listening feedback.

## 5. Numbered independent NotebookLM review questions — answer all

1. **Permanent-source verification:** Is the selected English Notebook's active `SLE-MASTER-001` actually **v1.2.1** and are the five permanent English baseline sources present/current? Report any mismatch. A packet's own claim is not proof.
2. **Count and item-by-item audit:** Inspect all **35 IDs**: PHR 5/5, COL 5/5, WFM 5/5, CNF 5/5, IDI 5/5, REA 5/5, LIS 5/5. Return **PASS or CORRECTION_REQUIRED for each**, with a brief rationale; do not silently skip one.
3. **Phrasal-verb lexical accuracy:** Check every sense, separability, pronoun placement, verb + `-ing`/`with` patterns, register and dialect qualification (PHR-001..005). Flag overgeneralised statements.
4. **Collocation naturalness:** Check genuine word partnerships, natural prepositions, noun countability and authentic examples (COL-001..005); distinguish a rule from a preferred construction.
5. **Word-family grammar:** Check parts of speech, syntax, meaning drift, spelling and acceptable dialect constructions (WFM-001..005). Do not approve mechanical suffix rules that fail in context.
6. **Confusables and idioms:** Check natural contrasted usage, false absolutes, register/appropriateness, and the idioms' real figurative meanings (CNF-001..005; IDI-001..005). In particular, `once in a blue moon` has no fixed numerical frequency.
7. **Reading pedagogy and overlap:** Confirm the five Reading cards teach genuine main-claim/detail, concession, chronology vs cause, reference resolution and evidence-calibrated inference. For `REA-001` and `REA-005`, justify why they are actionable extensions rather than duplicates of the existing immutable `REF-TIP-01` and `REF-TIP-02`.
8. **Listening validity and leakage:** Confirm no written situation is presented as actual audio or as Listening evidence. Check gist/focus, changed plan, number correction, purposeful replay, audio-guard and **post-submit-only** transcript constraints. Any pre-submit key/source clue or score implied is a **mandatory blocker**.
9. **Anti-duplication across the 294 LIVE items:** Check explicit original pilot IDs listed in §2 and related new entries. Identify any new title/term/function that duplicates an existing item or one of the **42 Writing Connectors, 11 Frequency Expressions, 20 Grammar Comparisons, 10 Writing Toolkit**. Distinguish “related and complementary” from “unnecessary duplicate”.
10. **Level, register and accessibility:** Are suggested A1/A2/B1/B2 navigation hints reasonable, examples independent and lower-secondary-friendly, and all seven proposed specialist layouts clear enough for 320px mobile? The hints are not CEFR certificates or estimated abilities.
11. **Schema and release scope:** Is adding four kinds and a Listening reference skill technically appropriate **as a proposal**, without implying implementation? Keep old 294 IDs and bytes; no guessed lesson link; no learner state/notes, AI calls, active assessment keys, curriculum change, Math/Auth touch, or MP3 modification. State any **content/UI schema blocker** separately from academic errors.
12. **Corrections and verdict:** List mandatory changes by **ID, original field text, replacement, reason**, optional improvements separately. Return a conservative PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / BLOCKED_SOURCE. Academic approval is **not** engineering CI or LIVE release authority.

## 6. Required NotebookLM verdict format

Return **one answer in NotebookLM chat** (not an extra file unless a correction matrix is too long). Include every item result.

```text
PACKET_ID: SLE-REF-W3-CROSS-SKILL-VOCAB-R1-20261121
CURRENT_STANDARD_VERIFIED: v1.2.1 | NOT_VERIFIED | OTHER:<version>
ACADEMIC_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL | BLOCKED_SOURCE
ITEM_COVERAGE: PHR 5/5; COL 5/5; WFM 5/5; CNF 5/5; IDI 5/5; REA 5/5; LIS 5/5; TOTAL 35/35
ITEM_RESULTS: [all 35 IDs; PASS | CORRECTION_REQUIRED; concise rationale]
MANDATORY_CORRECTIONS: [ID; field; exact original; exact replacement; justification] | NONE
OPTIONAL_IMPROVEMENTS: [ID + suggestion] | NONE
DUPLICATE_OR_OVERLAP_FINDINGS: [existing ID + new ID + keep/merge/remove decision] | NONE
VOCABULARY_REGISTER_AND_LEVEL: PASS | CORRECTION_REQUIRED (details)
READING_INFERENCE_AND_EVIDENCE: PASS | CORRECTION_REQUIRED (details)
LISTENING_TRANSCRIPT_PLAYBACK_SAFETY: PASS | BLOCKED (details)
SCHEMA_OR_UI_CONTENT_BLOCKERS: [specific issue] | NONE
LESSON_LINK_VERDICT: NO_TOPIC_LINKS_AUTHORIZED
LEARNER_DATA_AND_SCORING_SCOPE: READ_ONLY_REFERENCE_ONLY
ENGINEERING_IMPLEMENTATION: NOT_TESTED / NOT_AUTHORIZED
PRODUCTION_RELEASE: NOT_AUTHORIZED
```

If a single entry lacks a required field, has a misleading example, or conflicts with selected permanent baselines, mark that ID `CORRECTION_REQUIRED`. If the authoritative source is absent, do not invent its presence or award an unconditional PASS.

## 7. NotebookLM source handoff — KEEP / REMOVE / ADD

**KEEP:** The five current permanent English baseline files and exactly one currently active `SLE-MASTER-001` source (verified v1.2.1 when actually selected). Retain any other genuinely current permanent project reference that the Notebook requires; do not select duplicate superseded master versions.

**REMOVE / deselect temporary sources:** The completed Wave 2 Grammar/Writing packet `SLE_REF_W2_GRAMMAR_WRITING_R1_20261121.md`, earlier connector/irregular verb review packets, and all obsolete temporary batch/QA source files. This means *remove from the active Notebook source selection*, **not** delete GitHub/archived evidence. Keep permanent sources unchanged.

**ADD exactly ONE temporary source:** `SLE_REF_W3_CROSS_SKILL_VOCAB_R1_20261121.md` (this human-readable Markdown). Do **not** upload JSON. No ZIP needed because there is only one new file.

**Short NotebookLM chat prompt:**
> Review the current Wave 3 Vocabulary/Reading/Listening packet against the permanent English sources. Answer all 12 review questions, give a result for each ID and return the required verdict. Require corrections for unsupported claims.

## 8. Post-review gates — NOT YET SATISFIED

Only after an independent academic `PASS`, or after every **mandatory** change from `PASS_WITH_REQUIRED_CHANGES` is reconciled and re-reviewed as required: prepare typed reviewed JSON; extend existing Reference Library with specialist cards/search while preserving all 294 previous IDs and source records; test word patterns, category counts, full-text search, exact-source parity, no Listening script/answer leakage, no learner data writes, responsive 320px/iPad; run exact-head full GitHub PR QA; deploy English-only **Preview** for real iPad/desktop acceptance; request separate explicit owner approval to merge and release LIVE. Never infer deployment permission from NotebookLM's academic verdict.