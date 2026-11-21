# Self-Learning English — Reference Library Wave 2: Grammar Comparisons & Writing Toolkit, academic review R1

**PACKET_ID:** `SLE-REF-W2-GRAMMAR-WRITING-R1-20261121`  
**REVIEW_TARGET:** The **30 proposed reference entries** in §4 (20 Grammar + 10 Writing Toolkit), together with the taxonomy/learner-use decisions in §3.  
**STATE:** `ACADEMIC_DRAFT / NOTEBOOKLM_NOT_REVIEWED / NOT_IN_JSON / NOT_IN_PREVIEW / NOT_LIVE`  
**NORMATIVE SOURCE:** Current permanent `SLE-MASTER-001 v1.2.1` in the English Notebook; GitHub `sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md` at `main`. The reviewer must **check the actually selected source**, not trust this version label.  
**TRACKING:** SLE GitHub Issue #186 (Reference Library v2); owner priority is Reference Library before Notes or Flashcards.  
**BASE:** English Reference Library v2 on the GitHub `main` line, 2026-11-21; full curriculum v1.28.0, 176 lessons / 1,224 activities, 44 MP3. Academic design work only; no learner data access or runtime changes.

## 1. Source-grounded inventory and precise gap

GitHub's current Reference Library UI combines four authored JSON sources: the immutable 26-entry original pilot, the non-verb Wave 1 items (12 Writing Connectors + 11 Frequency), 30 additional approved Writing Connectors, and the 185-entry full irregular-verb corpus. Wave 1's original 15 reviewed verb IDs overlap that 185-item corpus and are **not counted twice**. **264 unique displayed lookup records = 191 irregular verbs + 42 Writing Connectors + 11 Frequency Expressions + 20 other original pilot entries.**

The original pilot's remaining 20 entries comprise 5 collocations, 4 phrasal verbs, 3 idioms, 4 common mistakes and 4 learning tips. Grammar overlaps already reviewed in the pilot are `REF-MIS-01 many vs much`, `REF-MIS-02 since vs for`, `REF-MIS-04 fewer vs less`, and `REF-TIP-03 Grammar: meaning before form`. Writing already includes 42 **linking expressions** and `REF-TIP-04 Writing: analyse the task`. These items **must stay unchanged** and are **not substitutes** for structured tense/determiner/conditionals comparison or a worked writing-planning toolkit.

The current `domain/reference-library.ts` recognizes eight reference kinds: six pilot kinds plus `writing_connectors` and `frequency_expressions`. The existing UI has specialized layouts for irregular verbs, connectors and frequency; other kinds use cards. **No `grammar_comparisons` or `writing_toolkit` kind currently exists in runtime.** This packet **proposes** those types and records; it does not claim they are implemented. Existing broad-skill lesson buttons must not be misrepresented as exact-topic lesson links.

**Current source-provenance caveat:** Some committed v2 JSON comments/fields still say `DRAFT_NOT_LIVE` even though PR #187 was merged. This is outdated descriptive metadata, not proof that the 264-item LIVE library was absent. Do not silently edit old reviewed records in this academic packet; track any provenance-label cleanup separately after QA.

## 2. Educational and safety boundaries

- Target a general self-learner; examples should also be comprehensible to a thoughtful lower-secondary learner. **Suggested A1/B1/etc. are navigation labels, not certification or mastery evidence.** No grading, no answer keys, no writing score, no AI call, no learner-state writes.
- Present **meaning/use → form/structure → genuinely independent illustration → contrast/error → limits or nuance**. A small lookup card is not a scored Core-1–4 lesson; it should still make the decision visible rather than simply name a rule.
- Proposed content is **English-first** and original. Examples are reference illustrations and must **not reproduce active scored items** or prompts from the LIVE curriculum. No pre-submit Listening transcript clues.
- Distinguish **grammatical error** from **stylistic preference**. Avoid absolute claims where dialect, register or discourse context varies. Preserve common UK/US usage differences where relevant. The reviewer must flag invented exceptions or over-generalized rules.
- Existing `REF-MIS-01`, `REF-TIP-04`, connectors, etc. remain immutable. New items must add a distinct *comparison or procedure*, not restate an existing definition under a new ID.
- **No exact-topic lesson button** is authorized yet. A candidate may mention a relevant curricular concept, but an actual link requires a verified ID, title, version, topic alignment and safe learner navigation; otherwise show no link or explicitly generic skill practice.
- Neither this packet nor an academic PASS authorizes JSON import, Firebase LIVE, Math/Auth changes, updating MP3, altering attempts or adding Flashcards/Notes.

## 3. Proposed product taxonomy / structured source fields — review as a DESIGN, not implemented code

The current generic `ReferenceEntry` has `term/meaning/example/note` plus specialist fields. Two new kinds are proposed, preserving original IDs/data and adding separate rendering:

| Proposed kind | Lookup question | Recommended display | Required new content fields |
| --- | --- | --- | --- |
| `grammar_comparisons` (`REF2-GRM-###`) | Which construction fits this intended meaning? | Side-by-side comparison where helpful; one compact explanation, an independent example, an error contrast | `id`, `concept`, `title`, `suggested_level`, `use_decision`, `patterns`, `example`, `contrast`, `watch_out`, `nuance`, `keywords`, `provenance` |
| `writing_toolkit` (`REF2-WTK-###`) | What should I decide or revise at this writing step? | Short procedure / checklist with an example on an unrelated prompt; no model answer to a live task | `id`, `process_step`, `title`, `suggested_level`, `purpose`, `steps`, `worked_micro_example`, `self_check`, `avoid`, `keywords`, `provenance` |

For both: `review_state` must be `PENDING` until NotebookLM; optional register for relevant Writing cases; no proficiency scores, learner telemetry or inferred CEFR. Stable ID must be distinct from all existing 264 entries. UI should favor mobile-readable 320px cards or horizontally scrollable comparisons, not force all items into the verb table. Search should include patterns, near-confusions and aliases, while preventing duplicate ID/term collisions. **Proposed names are design candidates, not approved engineering schema**; reviewer may require revisions.

**Review acceptance tasks:** searching `has been reading`, `although` or `because of` must not imply connectors are grammar-comparison records; “much vs many” should still surface the immutable existing common-mistake item; opening a new Grammar comparison should show use/contrast/exception; Writing Toolkit should not award a score or solve an active essay task. Test sample mobile widths 320px and iPad; no new backend.

## 4. Thirty original review candidates — all PENDING academic verdict

### Grammar Comparisons — 20 entries

#### REF2-GRM-001 — Present simple vs present continuous
- **Suggested navigation level:** A1–A2. **Concept:** habit/general pattern vs action in progress or temporary situation.
- **Use decision:** Choose the present simple for a recurring routine; the present continuous often emphasizes what is happening around now or is temporary.
- **Forms:** `subject + base verb (-s/-es for he/she/it)` vs `am/is/are + -ing`.
- **Original independent illustration:** *Maya takes the bus every weekday. Today she is walking to school.*
- **Compare / reasoning:** The first clause is a regular habit; the second describes today's exception.
- **Watch out / limits:** Avoid treating every `now` sentence as continuous: many state verbs normally take simple forms (*I know the answer*). Some state verbs vary by meaning (*I'm thinking about the problem*).
- **Search hints:** routine, temporary, now, -ing, present forms.

#### REF2-GRM-002 — Past simple vs present perfect
- **Suggested level:** A2–B1. **Concept:** finished-time narrative vs past event connected to the present or an unspecified life experience.
- **Use decision:** Explicit finished past times normally go with past simple; present perfect can connect a past event to present relevance without locating it at a finished time.
- **Forms:** `subject + V2` vs `have/has + past participle`.
- **Illustration:** *I visited Da Nang last July. I have visited Da Nang several times.*
- **Compare:** The first visit is dated; the second statement counts experience without saying when.
- **Watch out / limits:** Avoid *I have visited Da Nang last July* in standard teaching use. Present perfect use varies with dialect and context; do not claim all varieties express the contrast identically.
- **Search hints:** experience, last year, ever, present perfect, finished time.

#### REF2-GRM-003 — Past continuous alongside past simple
- **Suggested level:** A2. **Concept:** background ongoing activity and a shorter event in a narrative.
- **Use decision:** Past continuous can set the scene; past simple can report the event that happens during it.
- **Forms:** `was/were + -ing` alongside a simple-past clause.
- **Illustration:** *I was drawing a map when the lights went out.*
- **Compare:** Drawing was underway; the power cut is presented as an event.
- **Watch out / limits:** Not every clause with `when` requires a continuous tense. Two past continuous clauses may describe simultaneous ongoing activities.
- **Search hints:** interrupted action, while, when, background event.

#### REF2-GRM-004 — Present perfect simple vs continuous
- **Suggested level:** B1. **Concept:** completed results/number of outcomes vs duration or continuing activity.
- **Use decision:** Use perfect simple to foreground a result or amount; perfect continuous often emphasizes activity or duration.
- **Forms:** `have/has + participle` vs `have/has been + -ing`.
- **Illustration:** *I have read three chapters. I have been reading for an hour.*
- **Compare:** Three chapters focuses on output; an hour focuses on time spent.
- **Watch out / limits:** Both forms can overlap; continuous is not always appropriate with state verbs (*I have known her for years*). Do not equate continuous mechanically with “unfinished”.
- **Search hints:** have been doing, duration, since, for, result, completed.

#### REF2-GRM-005 — Will vs be going to for future reference
- **Suggested level:** A2. **Concept:** predictions and intentions, interpreted through context.
- **Use decision:** `will` commonly expresses an on-the-spot decision or prediction; `be going to` can signal a prior intention or a prediction based on present evidence.
- **Forms:** `will + base` vs `am/is/are going to + base`.
- **Illustration:** *I think our team will win. Look at those dark clouds—it is going to rain.*
- **Compare:** The second speaker points to present evidence.
- **Watch out / limits:** Both patterns can make predictions; these are tendencies, not an absolute ban on alternative choices.
- **Search hints:** intention, prediction, evidence, plans, future.

#### REF2-GRM-006 — Present continuous arrangements vs going-to intentions
- **Suggested level:** A2. **Concept:** scheduled personal arrangement vs intended action.
- **Use decision:** Present continuous often signals an arranged future event, especially with a time/place; going to can focus on intention.
- **Forms:** `am/is/are + -ing + future time` vs `be going to + base`.
- **Illustration:** *I'm meeting the club leader at three on Friday. I'm going to ask her about the project.*
- **Compare:** The meeting is an arrangement; the question is the speaker's intention.
- **Watch out / limits:** These expressions overlap; not every present continuous clause is future, and the arrangement meaning needs context.
- **Search hints:** appointments, future arrangements, plans, intention.

#### REF2-GRM-007 — A/an vs the: first and shared reference
- **Suggested level:** A1–A2. **Concept:** introducing one non-specific countable item vs identifying a particular one.
- **Use decision:** `a/an` often introduces one non-specific singular countable noun; `the` refers to an identifiable referent in context.
- **Forms:** `a/an + singular countable noun`; `the + noun phrase` where identifiable.
- **Illustration:** *I bought a notebook. The notebook has a blue cover.*
- **Compare:** The second mention points back to the already introduced notebook.
- **Watch out / limits:** `a/an` depends on pronunciation (*an hour*, *a university*). `the` has more uses than second mention; do not teach a fixed “first mention = a” rule for every context.
- **Search hints:** articles, first mention, specific, countable, an hour.

#### REF2-GRM-008 — No article vs the for general and specific groups
- **Suggested level:** A2. **Concept:** plural/uncountable nouns used generally vs identified referents.
- **Use decision:** A plural or uncountable noun can appear without an article when speaking generally; `the` can refer to a specific identifiable set or substance.
- **Forms:** `plural noun / uncountable noun` vs `the + noun`.
- **Illustration:** *Books can be expensive. The books on this desk are free.*
- **Compare:** First is general; second restricts the group.
- **Watch out / limits:** Some institutions, geographical names and generic uses of `the` follow additional patterns. Do not use this basic contrast as a universal article rule.
- **Search hints:** zero article, plural, general reference, definite article.

#### REF2-GRM-009 — Some vs any: neutral questions and offers
- **Suggested level:** A1–A2. **Concept:** unspecified quantities in statements, questions and requests.
- **Use decision:** `some` is common in affirmative statements and offers; `any` is common in neutral questions and negatives, but neither distribution is absolute.
- **Forms:** `some/any + plural countable or uncountable noun` in these common contexts.
- **Illustration:** *We have some fruit. Do we have any bread? Would you like some tea?*
- **Compare:** The last question is an offer, so `some` is natural.
- **Watch out / limits:** `any` can occur in affirmative free-choice meanings (*Choose any seat*); do not label it always negative.
- **Search hints:** offers, questions, some, any, negative.

#### REF2-GRM-010 — Each, every and all
- **Suggested level:** A2–B1. **Concept:** separate individuals, a whole set, and totality.
- **Use decision:** `each` often highlights members separately; `every` treats all members of a set generally; `all` can refer to the whole plural set.
- **Forms:** `each/every + singular countable noun` vs `all (the) + plural noun` where appropriate.
- **Illustration:** *Each student received a card. Every student needed a card. All the students joined the game.*
- **Compare:** The first distributes cards individually; the others describe the whole group from different perspectives.
- **Watch out / limits:** Avoid *every students* in this use. These are meaning tendencies, not perfect one-to-one translations.
- **Search hints:** determiners, agreement, whole group, individually.

#### REF2-GRM-011 — Few/a few and little/a little
- **Suggested level:** B1. **Concept:** quantity with countable plurals vs uncountable nouns, and the speaker's evaluation of sufficiency.
- **Use decision:** `a few/a little` often convey some quantity, potentially enough; `few/little` without `a` often emphasize scarcity.
- **Forms:** `few/a few + plural countable noun` vs `little/a little + uncountable noun`.
- **Illustration:** *We have a few minutes, so we can check the map. We have little time, so we need to leave now.*
- **Compare:** The first presents remaining time as usable; the second stresses shortage.
- **Watch out / limits:** Context and tone matter; `a few` does not guarantee a quantity is objectively sufficient. Do not merge with the pilot's separate `many vs much` reference.
- **Search hints:** countable, uncountable, scarcity, enough, a little.

#### REF2-GRM-012 — Must, have to and should
- **Suggested level:** A2–B1. **Concept:** strong obligation/necessity vs advice.
- **Use decision:** `must` and `have to` can express obligation or necessity; `should` normally gives advice or expectation rather than the same force of obligation.
- **Forms:** `must/should + base`; `have/has to + base`.
- **Illustration:** *Visitors must wear helmets on this ride. We have to register by Friday. You should drink water after a long walk.*
- **Compare:** The first two impose or report requirements; the third recommends an action.
- **Watch out / limits:** `must = personal` and `have to = external` is not a reliable absolute division; negative meanings need separate treatment (`mustn't` vs `don't have to`).
- **Search hints:** modal verbs, obligation, necessity, advice.

#### REF2-GRM-013 — Mustn't vs don't have to
- **Suggested level:** A2. **Concept:** prohibition vs absence of obligation.
- **Use decision:** `mustn't` normally prohibits; `don't have to` says an action is not required, without forbidding it.
- **Forms:** `must not / mustn't + base` vs `do/does not have to + base`.
- **Illustration:** *You mustn't enter the laboratory without permission. You don't have to stay after the meeting.*
- **Compare:** Entering the laboratory is forbidden in that condition; staying after the meeting is optional.
- **Watch out / limits:** Do not teach `mustn't` as the negative of “it is necessary”; dialect and politeness can change wording, but the basic meaning contrast is important.
- **Search hints:** don't have to, no need, forbidden, prohibition.

#### REF2-GRM-014 — Can and could in requests and ability
- **Suggested level:** A2. **Concept:** present ability and request politeness; contextual meanings of `could`.
- **Use decision:** `can` can report ability or ask for help; `could` may sound more tentative/polite in requests and can refer to past general ability.
- **Forms:** `can/could + base`; questions `Can/Could + subject + base...?`
- **Illustration:** *Can you show me the timetable? Could you show me the timetable, please?*
- **Compare:** Both are requests; the second is often more tentative, not automatically more grammatical.
- **Watch out / limits:** `could` is not a universal replacement for specific successful past actions; `was/were able to` and context may matter. Not all `could` uses are past.
- **Search hints:** ability, polite request, past ability, can, could.

#### REF2-GRM-015 — Zero conditional vs first conditional
- **Suggested level:** A2–B1. **Concept:** general consequences vs realistic future possibilities.
- **Use decision:** Zero conditional commonly states a general regularity; first conditional often discusses a plausible future condition and outcome.
- **Forms:** `if + present, present` vs `if + present, will + base` (typical patterns, not exclusive).
- **Illustration:** *If water freezes, it expands. If it rains tomorrow, we'll practise indoors.*
- **Compare:** One refers to a general pattern; the other to a particular future possibility.
- **Watch out / limits:** Other modal/imperative forms are possible; do not apply the simplistic ban “never use will after if” across every meaning or construction.
- **Search hints:** if, cause and effect, future possibility, zero, first conditional.

#### REF2-GRM-016 — Second conditional and imagined situations
- **Suggested level:** B1. **Concept:** hypothetical or unlikely situations rather than a stated actual plan.
- **Use decision:** Use the common second-conditional pattern to imagine a different present/future situation and its consequence.
- **Forms:** `if + past form, would + base`.
- **Illustration:** *If I had more free time, I would join the science club.*
- **Compare:** The speaker imagines having more free time; this is not a report that they currently do.
- **Watch out / limits:** Past-form syntax does not necessarily describe past time. `If I were...` is often preferred in formal hypothetical use, while `was` occurs in some contexts and dialects.
- **Search hints:** would, hypothetical, unreal, second conditional, if I were.

#### REF2-GRM-017 — Comparative adjectives: -er vs more
- **Suggested level:** A2. **Concept:** comparing two entities on one property.
- **Use decision:** Shorter adjectives often use `-er`; many longer adjectives use `more`, with lexical and spelling exceptions.
- **Forms:** `adjective-er + than` / `more + adjective + than`.
- **Illustration:** *This path is shorter than the other one. This plan is more reliable than the first plan.*
- **Compare:** The two patterns express comparison but attach different morphology.
- **Watch out / limits:** Avoid *more shorter* in a regular comparison. Some two-syllable adjectives permit variation; `good → better` is irregular.
- **Search hints:** comparison, -er, than, more, better, spelling.

#### REF2-GRM-018 — Gerund or to-infinitive after common verbs
- **Suggested level:** A2–B1. **Concept:** complement patterns selected by the main verb.
- **Use decision:** Verbs such as `enjoy` commonly take an `-ing` complement; verbs such as `hope` commonly take a `to`-infinitive.
- **Forms:** `enjoy + -ing` vs `hope + to + base`.
- **Illustration:** *I enjoy drawing city maps. I hope to visit the museum next week.*
- **Compare:** Both describe activities but the preceding verbs select different complements.
- **Watch out / limits:** Avoid *enjoy to draw* in standard use. Other verbs allow both with a difference in meaning (`remember`, `stop`) or little difference (`start`); this two-verb illustration is not a complete verb list.
- **Search hints:** gerund, -ing, infinitive, enjoy, hope, want.

#### REF2-GRM-019 — Defining relative clauses: who, which, that
- **Suggested level:** B1. **Concept:** identifying which person or thing is meant.
- **Use decision:** A defining relative clause adds information needed to identify its noun; `who` is commonly used for people, `which` for things, and `that` in many defining clauses.
- **Forms:** `noun + who/which/that + clause` in suitable subject/object roles.
- **Illustration:** *The student who designed the poster won a prize. The poster that she designed is on the wall.*
- **Compare:** Each clause narrows its preceding noun to a particular person or poster.
- **Watch out / limits:** Do not insert defining-clause commas here. Some **object** relatives may omit the pronoun; **subject** relatives generally cannot. Non-defining relative clauses follow different rules.
- **Search hints:** relative clause, who, which, that, defining, pronoun.

#### REF2-GRM-020 — Direct and embedded question word order
- **Suggested level:** B1. **Concept:** forming a polite embedded question without repeating main-question inversion.
- **Use decision:** Direct information questions may invert auxiliary and subject; embedded questions typically retain statement order inside the subordinate clause.
- **Forms:** `Where is + noun?` vs `Could you tell me where + noun + is?`
- **Illustration:** *Where is the community library? Could you tell me where the community library is?*
- **Compare:** The second is a request containing an embedded question, so *where the library is* has declarative order.
- **Watch out / limits:** Avoid *Could you tell me where is the library?* in ordinary embedded-question grammar. Not all direct questions use the same inversion pattern; check subject questions separately.
- **Search hints:** indirect questions, word order, auxiliary inversion, polite.

### Writing Toolkit — 10 entries

#### REF2-WTK-001 — Decide required content before optional detail
- **Suggested level:** A2. **Process step:** understand the task and select relevant ideas.
- **Purpose:** Apply **Topic / Task / Must Include / Boundary** to distinguish non-negotiable requirements from interesting extras; complement (do not duplicate) pilot `REF-TIP-04`.
- **Micro-procedure:** Underline intended reader, action, facts that must appear, tone/length limit; mark optional details separately.
- **Independent illustration:** For a fictional message asking a club leader to change a meeting room, mandatory facts are *which meeting, new room, day/time*; a long history of the club is optional and likely unnecessary.
- **Self-check:** Can the intended reader act on the message without requesting missing information?
- **Avoid / limits:** Do not treat every personal preference as a required detail. This is guidance, not automated evaluation of a learner's draft.
- **Search hints:** analyze task, audience, must include, boundary, instructions.

#### REF2-WTK-002 — Brainstorm and select, rather than list everything
- **Suggested level:** A2–B1. **Process step:** idea generation and relevance check.
- **Purpose:** Generate several plausible ideas and choose those that address the actual prompt.
- **Micro-procedure:** Produce 3–5 brief candidate ideas; test each against the topic, audience and goal; retain 2–3 that can be explained clearly.
- **Illustration:** For a fictional letter suggesting improvements to a school courtyard, *shade, seating, litter bins* are relevant; *the writer's favourite cartoon* is not unless directly connected.
- **Self-check:** Can I say in one sentence why each selected idea belongs in this response?
- **Avoid / limits:** More ideas do not automatically mean a better answer. Never auto-score idea quality by counting bullets.
- **Search hints:** brainstorming, selection, relevance, plan ideas.

#### REF2-WTK-003 — Give each paragraph one clear job
- **Suggested level:** A2–B1. **Process step:** organizing a text.
- **Purpose:** Prevent a paragraph from jumping between unrelated purposes.
- **Micro-procedure:** Label each planned paragraph's role before drafting: identify the situation, give a reason or example, ask for an action, or close appropriately.
- **Illustration:** In a fictional request to organize a recycling drive: paragraph 1 explains the request; paragraph 2 presents benefits and a feasible step; paragraph 3 asks for approval.
- **Self-check:** Does every sentence in the paragraph help its stated job?
- **Avoid / limits:** Paragraph number depends on text length and genre; a short message does not need a rigid three-paragraph template.
- **Search hints:** outline, paragraph function, organization, coherence.

#### REF2-WTK-004 — Topic sentence vs supporting detail
- **Suggested level:** B1. **Process step:** developing a paragraph.
- **Purpose:** Make the central point discoverable and support it with relevant specifics.
- **Micro-procedure:** State a focused point; choose one explanation and one concrete, related illustration; check the illustration truly supports the point.
- **Illustration:** *A quiet reading corner would help students concentrate. For example, soft seating away from the busy entrance could reduce distractions.*
- **Self-check:** Is the topic sentence narrower than “The school is good,” and does the next sentence actually explain it?
- **Avoid / limits:** Not every literary or narrative paragraph requires an explicit opening topic sentence.
- **Search hints:** topic sentence, main idea, support, focus.

#### REF2-WTK-005 — Example, reason and evidence are not identical
- **Suggested level:** B1. **Process step:** supporting a claim responsibly.
- **Purpose:** Distinguish an illustrative case, a causal explanation and verified external evidence.
- **Micro-procedure:** Name the point; label whether support is an example, a reason or sourced evidence; avoid inventing survey numbers or quotations.
- **Illustration:** *A library may be useful after school because some students need a quiet place to work* is a reason; *a student studying there after class* is an illustration, not a measured school-wide outcome.
- **Self-check:** Am I presenting an assumption as a proven fact?
- **Avoid / limits:** A plausible example alone does not establish that a claim is universally true; reference content must never fabricate an external citation.
- **Search hints:** evidence, example, reason, assertion, factual support.

#### REF2-WTK-006 — Claim → illustration → explanation
- **Suggested level:** B1. **Process step:** reasoning in an opinion paragraph.
- **Purpose:** Make the reasoning visible rather than stacking connectors.
- **Micro-procedure:** Offer a claim; give one concrete illustration; explicitly state how it helps justify the claim.
- **Illustration:** *A small garden could improve our courtyard. Students could grow herbs there. Caring for the plants would give them a practical shared responsibility.*
- **Self-check:** After the example, have I explained its relevance rather than assuming the reader will infer it?
- **Avoid / limits:** This is a flexible scaffold, not a universal paragraph formula or automatic argument-quality score.
- **Search hints:** claim, explain, support, argument, reasoning.

#### REF2-WTK-007 — Address a reasonable counterpoint
- **Suggested level:** B1–B2. **Process step:** balanced argument.
- **Purpose:** Recognize a relevant limitation without simply repeating the opposing view.
- **Micro-procedure:** State a genuine objection fairly; respond with a proportionate reason or condition.
- **Illustration:** *A school garden would need regular care. However, a rotating volunteer schedule could make the work manageable.*
- **Self-check:** Does my response address the objection, or merely restate my preference?
- **Avoid / limits:** This is a reasoning reference; using `however` does not by itself demonstrate a successful counterargument, and not every genre requires one.
- **Search hints:** counterargument, concession, balance, respond, objection.

#### REF2-WTK-008 — Match email register to audience and purpose
- **Suggested level:** A2–B1. **Process step:** choosing tone and request language.
- **Purpose:** Use language appropriate for a friend, classmate, teacher or community organizer without equating formality with quality.
- **Micro-procedure:** Identify relationship and purpose; choose greeting, request wording and sign-off that suit the situation.
- **Illustration:** To a club organizer, *Could you tell me whether the room is available on Tuesday?* may fit better than *Hey, give us that room!*
- **Self-check:** Would the intended reader regard the request as clear and respectful?
- **Avoid / limits:** Formality varies by culture and relationship; a friendly tone is not inherently incorrect. Do not score register automatically from greeting words alone.
- **Search hints:** formal, informal, email, request, audience, tone.

#### REF2-WTK-009 — Paraphrase without changing the claim
- **Suggested level:** B1–B2. **Process step:** revising expression responsibly.
- **Purpose:** Change wording or structure while preserving the original meaning, degree of certainty and important facts.
- **Micro-procedure:** Identify the source claim; rewrite in fresh language; compare actors, quantity, time and certainty between original and revision.
- **Illustration:** *Many students prefer quiet spaces to study* can be paraphrased as *Quiet study areas are popular with many students*, but **not** *Every student needs a silent room*.
- **Self-check:** Did I accidentally change *many* to *all*, *might* to *will*, or the time reference?
- **Avoid / limits:** Paraphrasing someone else's published wording may still require citation; this tool does not grant permission to reuse source text without attribution.
- **Search hints:** paraphrase, meaning, certainty, avoid exaggeration, revision.

#### REF2-WTK-010 — Revise for task response, clarity and correctness
- **Suggested level:** A2–B1. **Process step:** self-check and revision before submission.
- **Purpose:** Check more than spelling: required information, logical order, sentence readability and language accuracy.
- **Micro-procedure:** Check (1) required details; (2) paragraph focus; (3) misleading claims; (4) verb/article accuracy; (5) sentence punctuation. Revise one concrete issue at a time.
- **Illustration:** In a fictional event invitation, replacing *It starts later* with *It starts at 3 p.m. on Saturday* repairs a missing actionable detail.
- **Self-check:** Would a reader understand the purpose and the next action without guessing?
- **Avoid / limits:** This checklist is **self-guidance**, not a claim that writing was semantically graded or certified. Trusted review is still needed for quality judgments.
- **Search hints:** proofreading, revise, self-check, writing clarity, completeness.

## 5. Mandatory academic review questions — respond to all

1. **Source verification:** Can you actually verify the selected permanent master is `SLE-MASTER-001 v1.2.1` and current other English baseline sources? If not, specify the blocker and do **not** infer a PASS from this packet's label.
2. **Coverage:** Verify exactly **30/30 items by ID** (20 GRM, 10 WTK). Which items are wrong, ambiguous, over-generalized, unnatural or too complex for their *suggested* level?
3. **Pedagogy:** For every Grammar entry, check **use decision / structure / illustrative example / contrast / exception**. For every Writing entry, check **purpose / procedure / independent example / self-check / caution**.
4. **Grammar accuracy:** Pay special attention to aspect/time (GRM-001..006), article exceptions, some/any, each/every/all, deontic modality, `mustn't` vs `don't have to`, conditionals, comparative patterns, infinitive complements, relative clauses, embedded questions.
5. **Writing validity:** Confirm that WTK-001..010 teach topic analysis and evidence-based revision rather than producing generic template answers, inventing facts or treating length/connectors as achievement.
6. **Anti-duplication:** Does `REF2-GRM-011` provide genuinely different value from pilot `REF-MIS-01 many vs much`? Does WTK-001 add operational detail beyond `REF-TIP-04` rather than a duplicate lookup card? Are other aliases/near-terms inadvertently duplicative of 42 existing Connectors or 11 Frequency items?
7. **Register and level:** Which suggested A1/A2/B1/B2 navigation hints require correction? Are any grammar examples too difficult, unnatural or dialect-dependent without a note? These hints must **not** assert certified CEFR ability.
8. **Scope integrity:** Verify no active assessment answer, graded model essay, Listening pre-submit transcript, personal learner text, hidden key, score, proficiency badge or new AI requirement has slipped into these cards.
9. **Information design:** Are two specialist kinds and their fields enough to support readable comparison cards and writing procedures at mobile 320px? Identify any **mandatory** content/schema changes before engineering.
10. **Lesson-link policy:** Confirm that **no actual topic-linked lesson ID** is asserted in this packet. If future links are desirable, require independent catalog/topic verification. Broad-skill practice should stay clearly labeled generic.
11. **Minimal correction principle:** Separate **MANDATORY academic corrections** by ID and exact corrected wording from optional additions. Do not expand this review to unrelated Flashcards, Notes, AI, Math, site authentication or curriculum revisions.
12. **Release boundary:** Distinguish academic content verdict from **engineering CI, Preview Safari QA, owner approval and Firebase LIVE** (none are authorized by this review).

## 6. Required NotebookLM verdict format

Return the following structured report **in the NotebookLM answer**; do not create a new source document unless required to preserve a lengthy correction table.

```
PACKET_ID: SLE-REF-W2-GRAMMAR-WRITING-R1-20261121
CURRENT_STANDARD_VERIFIED: v1.2.1 | NOT_VERIFIED | OTHER:<exact version>
ACADEMIC_VERDICT: PASS | PASS_WITH_REQUIRED_CHANGES | FAIL | BLOCKED_SOURCE
ITEM_COVERAGE: GRM 20/20; WTK 10/10; TOTAL 30/30
ITEM_RESULTS: [list each ID with PASS | CORRECTION_REQUIRED and 1 concise rationale]
MANDATORY_CORRECTIONS: [ID; field; exact old text; replacement; justification] | NONE
OPTIONAL_IMPROVEMENTS: [ID/recommendation] | NONE
DUPLICATE_OR_OVERLAP_FINDINGS: [exact old/new ID pairs, decision] | NONE
SCHEMA_OR_UI_CONTENT_BLOCKERS: [required change and why] | NONE
CEFR_AND_REGISTER_CAUTION: PASS | CORRECTION_REQUIRED (details)
LESSON_LINK_VERDICT: NO_TOPIC_LINKS_AUTHORIZED
LEARNER_DATA_AND_SCORING_SCOPE: READ_ONLY_REFERENCE_ONLY
ENGINEERING_IMPLEMENTATION: NOT_TESTED / NOT_AUTHORIZED
PRODUCTION_RELEASE: NOT_AUTHORIZED
```

Any entry with a missing required field, inaccurate example or unresolved norm conflict is `CORRECTION_REQUIRED`, not tacitly PASS. If the master source is missing or outdated, use `BLOCKED_SOURCE` or a conditional result rather than inventing source compliance.

## 7. User's NotebookLM source operation — KEEP / REMOVE / ADD

**KEEP selected permanent sources:** the currently authoritative English Notebook permanent baselines, including **one** canonical `SLE-MASTER-001 v1.2.1` (verify actual version inside selected source); preserve other applicable current permanent academic framework sources. Do **not** simultaneously select outdated master revisions.

**REMOVE / deselect temporary sources:** last completed Reference Library v2 connector, irregular-verb, compatibility and wave-review temporary packets, plus other obsolete per-batch packets. Keep those archived outside NotebookLM active sources; do not delete their GitHub records. Do not remove permanent baselines.

**ADD exactly ONE temporary source:** `SLE_REF_W2_GRAMMAR_WRITING_R1_20261121.md` (this human-readable packet). No raw JSON and no separate long chat prompt.

**Short NotebookLM chat prompt:**
> Review the current Wave 2 Grammar/Writing packet against the permanent English sources. Answer all numbered questions and return the required verdict, with corrections by ID. Do not approve unsupported claims.

## 8. Post-verdict implementation gates (NOT YET SATISFIED)

If NotebookLM returns `PASS` or `PASS_WITH_REQUIRED_CHANGES` and all mandatory corrections are reconciled outside NotebookLM, then (and only then): create typed reviewed JSON for 30 records; update the Reference Library selector and add specialist card UIs without touching existing 264 IDs/text; build tests for duplicate/provenance safety, search aliases, content-per-ID parity, no learner writes, mobile 320px, and any verified topic lesson links; run exact-head full GitHub PR QA; create an **English-only Firebase Preview** for the owner to use on iPad; request explicit LIVE approval **separately**. No automatic merge, import, deployment or user-data migration.