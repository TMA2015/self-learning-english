# SLE Curriculum Inventory v0.1 — audited source dataset (2026-11-04)
**Status:** SOURCE-LEVEL INVENTORY; NOT AN INDEPENDENT ACADEMIC VERDICT; NOT A RELEASE AUTHORIZATION.
**Canonical observed source:** `sites-p0-phase-a-20260926/content/curriculum-1.18.1-candidate.json`, Git blob `7c4a9f1186fd11c47b8e1ee2951e5aad908102a3` on GitHub `main` as observed 2026-11-04. Source package version `1.18.1`; file content may not identify exact deployed learner state. This inventory does not mutate content.
**Governing standard:** SLE-MASTER-001 v1.1.0. Grammar prerequisite metadata is taken from `content/grammar-roadmap-v1.json`, which identifies itself as planning metadata, **not automatically enforced by the runtime**. Non-grammar prerequisites have no complete source mapping in the inspected `course.prerequisites` (empty array).
## 1. Reproducible source-level audit
- Lessons: **109**; activities **913**; unique activity IDs **913**; duplicated activity IDs **0**.
- CEFR target distribution: A1 30; A2 42; B1 37; B2 **0**.
- Domains: grammar 40; vocabulary 14; reading 15; listening 18; writing 11; speaking 6; pronunciation 5.
- Activity types: single_choice 737; short_answer 153; extended_response 23. Evidence weights: weight>0 890; weight=0 23.
- Structural probe (has title, ≥1 objective, English explanation, ≥1 example, ≥1 activity): Flagged: REA-A2-01, REA-B1-01, LIS-A2-01, LIS-B1-01, SPE-A2-01, SPE-B1-01, LIS-A1-01, LIS-A2-02, LIS-B1-02, VOC-A2-05, VOC-B1-05, REA-A2-06, REA-B1-05, LIS-A2-03, LIS-B1-04, LIS-A1-03, LIS-A1-04, LIS-A1-05, LIS-A2-04, LIS-A2-05, LIS-A2-06, LIS-B1-05, LIS-B1-06, LIS-B1-07. These checks are **not** proof of conceptual or item-level pedagogical quality.
- Course sequence references 109 lesson entries; unique references 109. Course prerequisite array is 0 entries (missing lesson-level dependencies must not be fabricated).
### 1.1 Distribution matrix — lesson count / activity count
| Module | A1 | A2 | B1 | B2 | Total |
|---|---:|---:|---:|---:|---:|
| grammar | 12/124 | 16/168 | 12/116 | 0/0 | 40 |
| vocabulary | 4/32 | 5/47 | 5/41 | 0/0 | 14 |
| reading | 4/32 | 6/55 | 5/43 | 0/0 | 15 |
| listening | 5/36 | 6/44 | 7/57 | 0/0 | 18 |
| writing | 4/20 | 4/24 | 3/22 | 0/0 | 11 |
| speaking | 1/5 | 2/7 | 3/14 | 0/0 | 6 |
| pronunciation | 0/0 | 3/14 | 2/12 | 0/0 | 5 |
## 2. Per-lesson inventory (all 109 source lessons)
**Interpretation:** `objective` is the first authored objective, not an independently verified outcome; `tags` are observed item-level labels, **not CEFR competence proof**. The illustrative prerequisite column is populated only when explicit grammar roadmap metadata exists. `n` = all activities, including unassessed tasks.
### A1
#### grammar (12 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `GRA-A1-01` | Be: am, is and are | 10 | Use am, is and are with the right subject. | grammar.be_forms, grammar.subject_verb_agreement | none specified |
| `GRA-A1-02` | Pronouns and possessive adjectives | 10 | Use I, you, he, she, it, we and they as subjects. | grammar.possessives, grammar.pronouns | none specified |
| `GRA-A1-03` | Present simple: everyday routines | 10 | Describe repeated habits using the present simple. | grammar.present_simple, grammar.subject_verb_agreement | GRA-A1-01, GRA-A1-02 |
| `GRA-A1-04` | A, an and regular plurals | 10 | Choose a or an before a singular countable noun from its starting sound. | grammar.articles, grammar.plural_nouns | GRA-A1-01 |
| `GRA-A1-05` | There is and there are | 10 | Use there is for one item and there are for several items. | grammar.be_forms, grammar.there_is_are | GRA-A1-01, GRA-A1-04 |
| `GRA-A1-06` | Prepositions of place | 10 | Use in, on and under to describe simple positions. | grammar.prepositions_place | GRA-A1-05 |
| `GRA-A1-07` | Can, can't and basic requests | 10 | Express simple present ability using can and can't. | grammar.modals_can | GRA-A1-01 |
| `GRA-A1-08` | Question words and basic question order | 14 | Choose who, what, where, when, why or how according to the information needed. | grammar.question_formation | GRA-A1-01, GRA-A1-03 |
| `GRA-A1-09` | This, that, these and those | 10 | Choose this/that for one thing and these/those for more than one thing. | grammar.demonstratives | GRA-A1-04 |
| `GRA-A1-10` | Object pronouns and possessive pronouns | 10 | Use me/you/him/her/it/us/them after verbs and prepositions. | grammar.object_pronouns, grammar.possessive_pronouns | GRA-A1-02 |
| `GRA-A1-11` | Imperatives and everyday instructions | 10 | Use the base verb for positive instructions. | grammar.imperatives, grammar.instructions | GRA-A1-01 |
| `GRA-A1-12` | Prepositions of time: at, on and in | 10 | Use at with clock times and selected fixed times such as night. | grammar.prepositions_time | GRA-A1-03 |
#### vocabulary (4 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `VOC-A1-01` | School places and classroom language | 8 | Understand useful school expressions from their context. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A1-02` | Daily activities and frequency | 8 | Name common actions in a school-day routine. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A1-03` | Places in town and simple directions | 8 | Recognise familiar town places from their purpose. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A1-04` | Family, rooms and everyday belongings | 8 | Understand common family relationships from short statements. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
#### reading (4 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `REA-A1-01` | A new art club at school | 8 | Understand the main purpose of a short school notice. | reading.detail, reading.gist, reading.inference | not mapped |
| `REA-A1-02` | A class visit to the science museum | 8 | Understand the main purpose of a simple trip notice. | reading.detail, reading.gist | not mapped |
| `REA-A1-03` | A message about an art-club visit | 8 | Identify the sender's purpose in a short personal message. | reading.detail, reading.gist | not mapped |
| `REA-A1-04` | Friday timetable and a room change | 8 | Read a simple school notice for times, places and instructions. | reading.detail, reading.gist | not mapped |
#### listening (5 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `LIS-A1-01` | A school club announcement | 10 | Understand the main purpose of a short school announcement. | listening.detail, listening.gist | not mapped |
| `LIS-A1-02` | A classroom change for Thursday | 8 | Understand the main purpose of a short school announcement. | listening.detail, listening.gist | not mapped |
| `LIS-A1-03` | The Bakery Order | 6 | Understand the main purpose of a short spoken recording. | listening.detail | not mapped |
| `LIS-A1-04` | My New Neighbour | 6 | Understand the main purpose of a short spoken recording. | listening.detail | not mapped |
| `LIS-A1-05` | The Missing Hat | 6 | Understand the main purpose of a short spoken recording. | listening.detail | not mapped |
#### writing (4 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `WRI-A1-01` | Introduce yourself in a short paragraph | 5 | Identify what a short self-introduction must include. | writing.grammar, writing.idea_development, writing.organization, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A1-02` | Write a friendly invitation message | 5 | Identify the recipient and the details requested in a short invitation. | writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A1-03` | Describe a familiar person or place | 5 | Identify the reader and required points in a short description. | writing.grammar, writing.idea_development, writing.organization, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A1-04` | Write about a typical school day | 5 | Identify four required details in a routine-writing prompt. | writing.grammar, writing.idea_development, writing.organization, writing.task_understanding, writing.vocabulary | not mapped |
#### speaking (1 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `SPE-A1-01` | Introduce yourself and ask a simple question | 5 | Give a short introduction using basic personal information chosen by the learner. | speaking.fluency, speaking.intelligibility, speaking.organization, speaking.task_response, speaking.vocabulary | not mapped |
### A2
#### grammar (16 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `GRA-A2-01` | Present simple or present continuous? | 10 | Decide whether a sentence describes a routine, an action happening now or a temporary arrangement. | grammar.present_continuous, grammar.present_simple, grammar.stative_verbs, grammar.subject_verb_agreement | GRA-A1-03, GRA-A2-07 |
| `GRA-A2-02` | Past simple forms, negatives and questions | 10 | Use regular and common irregular verbs for finished past events. | grammar.be_forms, grammar.past_simple | GRA-A1-01, GRA-A1-03 |
| `GRA-A2-03` | Countability, some/any, much/many | 10 | Distinguish common countable and uncountable nouns in everyday contexts. | grammar.countability, grammar.quantifiers | GRA-A1-04 |
| `GRA-A2-04` | Comparatives and superlatives | 10 | Use comparative forms with than for two people or things. | grammar.comparison | GRA-A1-01 |
| `GRA-A2-05` | Future intentions with be going to | 14 | Express a simple future intention using be going to plus a base verb. | grammar.future_plans | GRA-A1-01, GRA-A1-03 |
| `GRA-A2-06` | Rules: must, must not and have to | 14 | Identify required, forbidden and optional actions from everyday notices. | grammar.modals_obligation | GRA-A1-07 |
| `GRA-A2-07` | Present continuous: form and use | 10 | Build present-continuous statements with am, is or are plus verb-ing. | grammar.present_continuous, grammar.subject_verb_agreement | GRA-A1-01 |
| `GRA-A2-08` | Past continuous and interrupted actions | 10 | Build past-continuous statements with was/were + verb-ing. | grammar.past_continuous, grammar.past_simple | GRA-A2-02, GRA-A2-07 |
| `GRA-A2-09` | Present perfect: experiences with ever and never | 10 | Build present-perfect experience statements with have or has plus a past participle. | grammar.past_simple, grammar.present_perfect | GRA-A2-02 |
| `GRA-A2-10` | Present perfect: just, already and yet | 10 | Use just and already with the present perfect in common positions. | grammar.past_simple, grammar.present_perfect | GRA-A2-09 |
| `GRA-A2-11` | Choosing future forms: will, going to and present continuous | 10 | Use will for spontaneous decisions and simple predictions. | grammar.future_plans, grammar.present_continuous, grammar.will_future | GRA-A2-05, GRA-A2-07 |
| `GRA-A2-12` | Advice with should and shouldn't | 10 | Give simple advice with should + base verb. | grammar.should_advice | GRA-A1-07 |
| `GRA-A2-13` | Possibility with may, might and could | 10 | Use may/might/could + base verb to express present or future possibility. | grammar.modal_possibility | GRA-A1-07 |
| `GRA-A2-14` | Zero and first conditionals | 10 | Use the zero conditional for general results with present simple in both clauses. | grammar.conditionals | GRA-A1-03, GRA-A2-11 |
| `GRA-A2-15` | Common verb patterns: to-infinitive and -ing | 10 | Use to-infinitive after common verbs such as want, plan, hope and decide. | grammar.verb_patterns | GRA-A1-03 |
| `GRA-A2-16` | Defining relative clauses: who, which and that | 10 | Use who or that to identify a person with a defining relative clause. | grammar.relative_clauses | GRA-A1-08 |
#### vocabulary (5 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `VOC-A2-01` | Daily routines and useful phrases | 11 | Understand common routine phrases | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A2-02` | Travel and event collocations in context | 8 | Recognise frequent travel and event word partnerships in context. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A2-03` | Shopping, prices and polite requests | 12 | Understand common shop vocabulary such as price, receipt, size and refund. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A2-04` | Feelings, reactions and useful adjective pairs | 8 | Use common adjective–preposition combinations for feelings and reactions. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-A2-05` | Food preparation and simple instructions | 8 | understand common food-preparation verbs in everyday instructions; | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
#### reading (6 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `REA-A2-02` | A class book exchange | 8 | Find the purpose and details of a short event announcement. | reading.author_purpose, reading.detail, reading.gist, reading.inference | not mapped |
| `REA-A2-01` | A garden for everyone | 11 | Identify a text’s main idea | reading.detail, reading.gist, reading.inference | not mapped |
| `REA-A2-03` | A garden project changes its plan | 8 | Identify the main purpose of a school project update. | reading.detail, reading.gist, reading.inference | not mapped |
| `REA-A2-04` | An event update: compare plans and conditions | 12 | Read an updated message for purpose and revised arrangements. | reading.author_purpose, reading.detail, reading.inference | not mapped |
| `REA-A2-05` | Two club updates: compare practical details | 8 | Find practical details in two short school notices. | reading.detail, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
| `REA-A2-06` | Which club fits you? | 8 | find key details across short club notices; | reading.detail, reading.gist, reading.inference | not mapped |
#### listening (6 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `LIS-A2-01` | A workshop at the library | 5 | Understand key details in a short conversation | listening.detail, listening.gist | not mapped |
| `LIS-A2-02` | A changed plan for Saturday | 10 | Understand the purpose of a short conversation about a changed plan. | listening.detail, listening.inference, listening.speaker_intention | not mapped |
| `LIS-A2-03` | Choosing a class at the sports centre | 8 | understand the main purpose of a short everyday conversation; | listening.detail, listening.gist, listening.inference | not mapped |
| `LIS-A2-04` | Changing Trains After a Delay | 7 | Understand the main purpose of a short spoken recording. | listening.detail, listening.gist | not mapped |
| `LIS-A2-05` | An Art Exhibition Reminder | 7 | Understand the main purpose of a short spoken recording. | listening.detail, listening.gist | not mapped |
| `LIS-A2-06` | Repairing a Bicycle | 7 | Understand the main purpose of a short spoken recording. | listening.detail, listening.inference | not mapped |
#### writing (4 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `WRI-A2-01` | Write a helpful email | 7 | Respond to every part of a practical prompt | writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A2-02` | Describe a school event in an email | 5 | Identify the audience and three content requirements of an email task. | writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A2-03` | Recommend a club with reasons | 5 | Identify the audience, choice and two requested reasons. | writing.grammar, writing.idea_development, writing.organization, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-A2-04` | Reply to a message and solve a small problem | 7 | Identify every practical point in a short message task. | writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
#### speaking (2 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `SPE-A2-01` | Talk about your routine | 2 | Give a short connected response | speaking.fluency, speaking.intelligibility, speaking.organization, speaking.task_response | not mapped |
| `SPE-A2-02` | Explain a simple problem and ask for help | 5 | State a simple problem clearly. | speaking.fluency, speaking.intelligibility, speaking.organization, speaking.task_response, speaking.vocabulary | not mapped |
#### pronunciation (3 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `PRO-A2-01` | Hear and practise /iː/ and /ɪ/ | 3 | Notice a common vowel contrast | pronunciation.intelligibility, pronunciation.sound_awareness | not mapped |
| `PRO-A2-02` | Hear stress in common two-syllable words | 5 | Notice which syllable is stronger in common two-syllable words. | pronunciation.intelligibility, pronunciation.sound_awareness | not mapped |
| `PRO-A2-03` | Hear the three common -ed endings | 6 | Recognise the common /t/, /d/ and /ɪd/ pronunciations of regular past-tense -ed. | pronunciation.intelligibility, pronunciation.sound_awareness | not mapped |
### B1
#### grammar (12 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `GRA-B1-01` | Past simple and present perfect | 6 | Use past simple with a finished past time | grammar.past_simple, grammar.present_perfect | GRA-A2-02, GRA-A2-09, GRA-A2-10 |
| `GRA-B1-02` | Present perfect simple or continuous? | 10 | Choose present perfect simple when a completed result or number is important. | grammar.present_perfect, grammar.present_perfect_continuous | GRA-A2-09, GRA-A2-10, GRA-A2-07 |
| `GRA-B1-03` | Past perfect and narrative order | 10 | Use had + past participle for an action completed before another past time or action. | grammar.narrative_order, grammar.past_perfect | GRA-A2-02, GRA-A2-08 |
| `GRA-B1-04` | Past habits with used to and would | 10 | Use used to for past states or repeated actions that are no longer true. | grammar.used_to, grammar.would_past_habit | GRA-A2-02 |
| `GRA-B1-05` | Modal deduction: must, might and can't | 10 | Use must for a strong positive deduction based on present evidence. | grammar.modal_deduction | GRA-A2-13, GRA-A2-06 |
| `GRA-B1-06` | Second conditional: imaginary situations | 10 | Use if + past simple and would + base verb for imaginary or unlikely present/future situations. | grammar.second_conditional | GRA-A2-14 |
| `GRA-B1-07` | Wish and if only for present situations | 10 | Use wish + past form to express that a present situation is different from what you want. | grammar.wish_present | GRA-B1-06 |
| `GRA-B1-08` | Passive voice in the present and past | 10 | Form the present simple passive with am/is/are + past participle. | grammar.passive_voice | GRA-A2-02, GRA-A1-01 |
| `GRA-B1-09` | Reported statements and questions | 10 | Report basic statements after a past reporting verb using an appropriate backshift. | grammar.reported_questions, grammar.reported_speech | GRA-A2-02, GRA-A1-08 |
| `GRA-B1-10` | Defining and non-defining relative clauses | 10 | Distinguish defining relative clauses from non-defining clauses that add extra information. | grammar.non_defining_relative_clauses, grammar.relative_clauses | GRA-A2-16 |
| `GRA-B1-11` | Gerunds and infinitives after common verbs | 10 | Use -ing forms after common verbs such as enjoy, avoid, finish and suggest. | grammar.gerund_infinitive | GRA-A2-15 |
| `GRA-B1-12` | Indirect questions and question tags | 10 | Use statement word order after an indirect-question opener. | grammar.indirect_questions, grammar.question_tags | GRA-A1-08 |
#### vocabulary (5 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `VOC-B1-01` | Talking about sustainable choices | 5 | Use common environmental collocations | vocabulary.collocations, vocabulary.meaning_in_context, vocabulary.word_formation | not mapped |
| `VOC-B1-02` | Word families for study and communication | 10 | Recognize common noun, verb, adjective and adverb forms in familiar word families. | vocabulary.meaning_in_context, vocabulary.word_formation | not mapped |
| `VOC-B1-03` | Collocations for plans, problems and decisions | 10 | Use common B1 collocations connected with plans, decisions and problem solving. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-B1-04` | Verbs for explaining evidence and change | 8 | Use common B1 verbs for describing evidence, causes and changes. | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
| `VOC-B1-05` | Learning goals, progress and feedback | 8 | understand common B1 collocations used to talk about learning and improvement; | vocabulary.collocations, vocabulary.meaning_in_context | not mapped |
#### reading (5 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `REA-B1-01` | What makes practice effective? | 5 | Distinguish the writer’s claim from a qualification | reading.author_purpose, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
| `REA-B1-02` | A repair café comes to school | 10 | Identify the main purpose of an informative school text. | reading.author_purpose, reading.detail, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
| `REA-B1-03` | Should study apps plan every session? | 10 | Identify the writer's balanced main claim in a viewpoint text. | reading.author_purpose, reading.detail, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
| `REA-B1-04` | Why some study breaks work better | 10 | Identify the writer's main claim and supporting contrast. | reading.author_purpose, reading.detail, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
| `REA-B1-05` | Can short breaks help you learn? | 8 | identify the main claim of a balanced informational text; | reading.detail, reading.gist, reading.inference, reading.vocabulary_in_context | not mapped |
#### listening (7 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `LIS-B1-01` | Choosing a reliable journey | 5 | Understand speaker attitude and comparisons | listening.detail, listening.gist, listening.inference, listening.speaker_intention | not mapped |
| `LIS-B1-02` | Discussing a group-project problem | 10 | Identify the main problem and proposed solution in a planning conversation. | listening.detail, listening.gist, listening.inference, listening.speaker_intention | not mapped |
| `LIS-B1-03` | Planning a study-group session | 10 | Identify the main problem and agreed solution in a planning conversation. | listening.detail, listening.gist, listening.inference, listening.speaker_intention | not mapped |
| `LIS-B1-04` | Planning a student podcast episode | 8 | identify the main problem and proposed compromise in a planning discussion; | listening.detail, listening.gist, listening.inference, listening.speaker_intention | not mapped |
| `LIS-B1-05` | A Library of Things | 8 | Understand the main purpose of a short spoken recording. | listening.detail, listening.gist, listening.inference, listening.speaker_intention | not mapped |
| `LIS-B1-06` | What We Learned from a Pop-Up Sale | 8 | Understand the main purpose of a short spoken recording. | listening.detail, listening.gist, listening.inference | not mapped |
| `LIS-B1-07` | Checking a Photo Before Sharing | 8 | Understand the main purpose of a short spoken recording. | listening.detail, listening.inference, listening.speaker_intention | not mapped |
#### writing (3 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `WRI-B1-01` | Develop an opinion paragraph | 3 | State a clear opinion | writing.cohesion, writing.grammar, writing.idea_development, writing.organization, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-B1-02` | Build a clear opinion paragraph | 10 | Analyse an opinion prompt and choose relevant ideas. | writing.cohesion, writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
| `WRI-B1-03` | Compare two options and recommend one | 9 | Select relevant comparison criteria from a practical brief. | writing.cohesion, writing.grammar, writing.idea_development, writing.organization, writing.register, writing.task_understanding, writing.vocabulary | not mapped |
#### speaking (3 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `SPE-B1-01` | Explain and support an opinion | 2 | Give an opinion with reasons | speaking.fluency, speaking.idea_development, speaking.task_response, speaking.vocabulary | not mapped |
| `SPE-B1-02` | Compare two options and answer a follow-up | 6 | Compare two options using relevant criteria. | speaking.fluency, speaking.idea_development, speaking.task_response, speaking.vocabulary | not mapped |
| `SPE-B1-03` | Explain a problem and propose a practical solution | 6 | Describe a practical problem clearly. | speaking.fluency, speaking.idea_development, speaking.task_response, speaking.vocabulary | not mapped |
#### pronunciation (2 lessons)
| ID | Title | n | Intended learning outcome (source) | Skill tags observed | Prerequisites explicitly mapped |
|---|---|---:|---|---|---|
| `PRO-B1-01` | Use sentence stress to show the important idea | 6 | Notice that content words often carry stronger sentence stress. | pronunciation.intelligibility, pronunciation.sound_awareness | not mapped |
| `PRO-B1-02` | Use intonation to ask, check and confirm | 6 | Notice common rising and falling intonation patterns in short questions. | pronunciation.intelligibility, pronunciation.sound_awareness | not mapped |
## 3. Skill-tag activity frequencies (descriptive only)
| Tag | Tagged activity count |
|---|---:|
| `grammar.articles` | 10 |
| `grammar.be_forms` | 22 |
| `grammar.comparison` | 10 |
| `grammar.conditionals` | 10 |
| `grammar.countability` | 10 |
| `grammar.demonstratives` | 10 |
| `grammar.future_plans` | 18 |
| `grammar.gerund_infinitive` | 10 |
| `grammar.imperatives` | 7 |
| `grammar.indirect_questions` | 5 |
| `grammar.instructions` | 3 |
| `grammar.modal_deduction` | 10 |
| `grammar.modal_possibility` | 10 |
| `grammar.modals_can` | 10 |
| `grammar.modals_obligation` | 14 |
| `grammar.narrative_order` | 5 |
| `grammar.non_defining_relative_clauses` | 6 |
| `grammar.object_pronouns` | 5 |
| `grammar.passive_voice` | 10 |
| `grammar.past_continuous` | 10 |
| `grammar.past_perfect` | 9 |
| `grammar.past_simple` | 18 |
| `grammar.plural_nouns` | 10 |
| `grammar.possessive_pronouns` | 5 |
| `grammar.possessives` | 10 |
| `grammar.prepositions_place` | 10 |
| `grammar.prepositions_time` | 10 |
| `grammar.present_continuous` | 18 |
| `grammar.present_perfect` | 28 |
| `grammar.present_perfect_continuous` | 5 |
| `grammar.present_simple` | 15 |
| `grammar.pronouns` | 10 |
| `grammar.quantifiers` | 8 |
| `grammar.question_formation` | 14 |
| `grammar.question_tags` | 5 |
| `grammar.relative_clauses` | 14 |
| `grammar.reported_questions` | 6 |
| `grammar.reported_speech` | 4 |
| `grammar.second_conditional` | 10 |
| `grammar.should_advice` | 10 |
| `grammar.stative_verbs` | 1 |
| `grammar.subject_verb_agreement` | 29 |
| `grammar.there_is_are` | 10 |
| `grammar.used_to` | 7 |
| `grammar.verb_patterns` | 10 |
| `grammar.will_future` | 3 |
| `grammar.wish_present` | 10 |
| `grammar.would_past_habit` | 4 |
| `listening.detail` | 100 |
| `listening.gist` | 26 |
| `listening.inference` | 35 |
| `listening.speaker_intention` | 16 |
| `pronunciation.intelligibility` | 5 |
| `pronunciation.sound_awareness` | 21 |
| `reading.author_purpose` | 7 |
| `reading.detail` | 84 |
| `reading.gist` | 28 |
| `reading.inference` | 39 |
| `reading.vocabulary_in_context` | 16 |
| `speaking.fluency` | 6 |
| `speaking.idea_development` | 10 |
| `speaking.intelligibility` | 3 |
| `speaking.organization` | 5 |
| `speaking.task_response` | 14 |
| `speaking.vocabulary` | 7 |
| `vocabulary.collocations` | 75 |
| `vocabulary.meaning_in_context` | 83 |
| `vocabulary.word_formation` | 10 |
| `writing.cohesion` | 8 |
| `writing.grammar` | 20 |
| `writing.idea_development` | 21 |
| `writing.organization` | 21 |
| `writing.register` | 12 |
| `writing.task_understanding` | 27 |
| `writing.vocabulary` | 16 |
## 4. Actionable inventory observations
1. **No B2 authored in 1.18.1.** Planned Wave B proposes two B2 lessons, but they are not counted here and have no confirmed academic verdict in accessible records.
2. **Domain imbalance:** grammar 40 versus vocabulary 14, reading 15, listening 18, writing 11, speaking 6, pronunciation 5. Lesson counts alone are **not** CEFR coverage percentages.
3. **Assessment imbalance:** 737 MCQs + 153 short-answer versus 23 extended responses. Open responses require the independent review and evidence rules in SLE-MASTER-001; they are not automatically graded as proficiency.
4. **Prerequisite gap:** `course.prerequisites` is empty. Grammar roadmap contains some advisory dependencies; no complete verified dependency graph exists for the other domains. Build this in the Framework as **proposed**, then review.
5. **Reading and Listening subskills:** tag frequencies count items, not balanced independent sample sets, text genre diversity, or semantic coverage. A later expert audit must review passages, options, worked examples and audio.
6. **Speaking/Pronunciation evidence:** written/checkbox/phrase choices and IPA awareness cannot be projected as validated oral ability. Runtime historical projection and physical MP3 QA remain separate gates.
7. **Forward-only tag issue:** observed `REA-A1-01-Q7` remains tagged `reading.inference` although its prompt is explicit-detail retrieval. Reclassification must be separately reviewed and applied prospectively in a versioned candidate, preserving 1.18.1 attempts.
## 5. Separation of statuses
- **RELEASED BASE:** curriculum 1.18.1 (109 / 913) per merged 2026-11-03 release evidence; this document audits the corresponding repository candidate blob. Actual live import state requires separate runtime verification.
- **ACADEMICALLY APPROVED, NOT RELEASED:** Writing Wave A (6 / 48, 42 objective + six open responses), NotebookLM PASS, no mandatory changes.
- **PENDING EXTERNAL VERDICT:** Vocabulary + Reading Wave B (6 / 48); do not claim PASS without its actual independent review response.
- **PROPOSED ONLY:** cumulative 1.19.0 (121 / 1009) and forward-only tag change; no assembled/validated package or production deployment is claimed.
## 6. Next gates
Confirm Wave B source and verdict; reconcile exact required corrections; build immutable 1.19.0 candidate, validate all old lesson equivalence except specifically reviewed forward-only changes, run exact-head PR QA, request owner release / perform English-only deployment checks. Separately review Framework v0.1 before declaring a learning pathway complete.
