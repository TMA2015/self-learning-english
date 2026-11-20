# SLE English Reference Library v2 — Wave 1: architecture and 38-item academic review packet

**Packet ID:** `SLE-REFERENCE-V2-W1-R1-20261120`  
**Review status:** DRAFT — independently NOT REVIEWED; **not approved for import or release**  
**Product:** Self-Learning English (SLE) GitHub/Firebase web app; **not** the separate in-chat English Tutor  
**Baseline:** English LIVE curriculum 1.28.0, 176 lessons / 1,224 activities; existing static Reference Library pilot 26 NotebookLM-approved entries  
**Tracking:** GitHub Issue #186; product decision: Reference Library first; Flashcards / Notes deferred  
**Normative baseline:** current SLE-MASTER-001 and current frozen English NotebookLM permanent sources; this packet is temporary, not a new project policy.

## 1. Why this wave exists

The current `content/reference-library-pilot-v1.json` contains just 26 items: 6 irregular verbs, 5 collocations, 4 phrasal verbs, 3 idioms, 4 common mistakes, 4 tips. Current `domain/reference-library.ts` accepts six `kind` values and basic search, A1–C2 and register filters; `app/reference-library.tsx` displays irregular verbs in a table and everything else as cards. There is no dedicated connector function table or frequency comparison scale. **All 26 previously reviewed entries and their IDs must remain unchanged.** The current related-lesson function matches by broad skill, not exact teaching objective, so it must never claim an exact lesson teaches a term when this has not been verified.

### Educational goal
Give a learner an accurate, quick, offline-first answer while composing or revising an original English sentence: "What are the three forms of this verb?", "Which connector takes a clause versus a noun phrase?", or "How frequently is *usually* compared with *rarely*?". Reference lookup is not a test, certification, generated essay or performance score.

## 2. Proposed v2 design — review concepts as well as entry text

| Family | Suggested kind | Required specialist fields | Suitable view |
|---|---|---|---|
| Irregular verbs | `irregular_verbs` (existing) | base, past form(s), participle form(s), example, meaning, pattern_group, pronunciation/variant caution where necessary | searchable A–Z table; detail rows, 320px horizontal scroll |
| Linking words | `writing_connectors` (NEW) | function, grammatical_type, pattern, sentence example, punctuation guidance, usage note, common_error, register | topic/function groups and contrasted side-by-side usage |
| Frequency expressions | `frequency_expressions` (NEW) | indefinite/definite type, qualitative rank only where relevant, position rule, example, meaning, caveat | contextual ordinal ladder plus separate counted-frequency expressions |

**Shared entry fields:** stable `id`; `kind`; `term`; original `meaning`; suggested learning `level` (instructional navigation, NOT certification); appropriate `register`; `example`; original `note`; optional curated `search_keywords`; `review_status` and `provenance` metadata. Do not copy commercial dictionary example sentences. IDs are stable, new v2 IDs do not repurpose earlier `REF-IRR-01`…`REF-TIP-04`; entries must not contain answer keys, learner content or score/evidence fields.

**Schema migration boundary:** v2 expands the selector/types and renderer only *after* academic reconciliation. Keep original 26 pilot unchanged and separately imported. Search all recognized form variants and synonyms locally with exact-term ranking; no external search requests or mandatory AI. Text display must not execute HTML. Reference categories and CEFR learning-guide tags are not mastery badges.

**Frequency visualization:** qualitative endpoints and broad, overlapping bands, never invented fixed percentages for usually/often/sometimes/rarely. Exact expressions such as "once a week" belong in a separate count/interval class, not on the same percentage axis. Adverb default position is before ordinary lexical main verbs and after forms of *be*; auxiliaries and sentence-fronted adverbs require appropriately qualified guidance, not a false absolute rule.

**Writing connector pedagogy:** grammar patterns outrank decorative phrase lists. Distinguish `because + clause` vs `because of + noun phrase`, `although + clause` vs `despite + noun/-ing`, and `but` vs `however` with actual punctuation. Explicitly warn that more linking words do not automatically improve writing quality.

**Cross-link policy:** an entry may link to an exact current lesson ID ONLY after verified topic overlap, review-safe lesson access and draft-save navigation. Otherwise label the link **related skill practice** or omit it. No pre-submission answer keys or Listening transcripts.

## 3. Wave 1 original authored items — 38 candidates

These are item-level REVIEW MATERIAL, not released reference entries. The reviewer must check all forms, grammatical patterns, examples, level tags, usage cautions and any register claims by item ID.

### 3A. Irregular verbs — 15 NEW entries (the six earlier pilot verbs are not repeated)

#### REF2-IRR-001 — be
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** exist or describe a state
- **Three forms:** base=be; past=was / were; past participle=been
- **Pattern group:** suppletive
- **Original example:** The classroom was quiet before the lesson.
- **Usage guidance:** Past simple changes with the subject: I/he/she/it was; you/we/they were. Present forms are am/is/are.
- **Common error / contrast:** Avoid *I were late* in an ordinary past statement; special hypothetical were is a separate advanced pattern.

#### REF2-IRR-002 — do
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** perform an activity
- **Three forms:** base=do; past=did; past participle=done
- **Pattern group:** vowel_change
- **Original example:** Mina did her homework before dinner.
- **Usage guidance:** Past simple did; past participle done normally follows an auxiliary such as have/has.
- **Common error / contrast:** Avoid *I have did*; distinguish main verb do from auxiliary do.

#### REF2-IRR-003 — have
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** possess or experience something
- **Three forms:** base=have; past=had; past participle=had
- **Pattern group:** same_past_participle
- **Original example:** We had a short meeting after school.
- **Usage guidance:** Have is also an auxiliary in perfect forms; the three-form table describes the lexical verb.
- **Common error / contrast:** Avoid *I have have breakfast yesterday*; a finished yesterday action normally takes had.

#### REF2-IRR-004 — come
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** move towards a place or speaker
- **Three forms:** base=come; past=came; past participle=come
- **Pattern group:** base_equals_participle
- **Original example:** My cousin came to our school festival.
- **Usage guidance:** The base and past participle are the same; came is the past simple.
- **Common error / contrast:** Avoid *has came*; use has come.

#### REF2-IRR-005 — take
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** get or carry something
- **Three forms:** base=take; past=took; past participle=taken
- **Pattern group:** vowel_change
- **Original example:** She took her umbrella on the trip.
- **Usage guidance:** Taken is the past participle: have taken.
- **Common error / contrast:** Avoid *have took*; use have taken.

#### REF2-IRR-006 — give
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** hand something to someone
- **Three forms:** base=give; past=gave; past participle=given
- **Pattern group:** vowel_change
- **Original example:** The teacher gave us useful advice.
- **Usage guidance:** Given is the past participle: has given.
- **Common error / contrast:** Avoid *have gave*; use have given.

#### REF2-IRR-007 — make
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** create or produce something
- **Three forms:** base=make; past=made; past participle=made
- **Pattern group:** same_past_participle
- **Original example:** We made a poster for the science fair.
- **Usage guidance:** Made is both the simple past and past participle.
- **Common error / contrast:** Remember make a decision and make progress; do not treat every noun combination as make.

#### REF2-IRR-008 — know
- **Kind:** irregular_verbs
- **Suggested level:** A2
- **Register:** neutral
- **Meaning:** have information or familiarity
- **Three forms:** base=know; past=knew; past participle=known
- **Pattern group:** vowel_change
- **Original example:** I knew the answer after reading the clue.
- **Usage guidance:** Known is the participle; have known may describe a state continuing to now.
- **Common error / contrast:** Avoid *have knew*.

#### REF2-IRR-009 — think
- **Kind:** irregular_verbs
- **Suggested level:** A2
- **Register:** neutral
- **Meaning:** have an idea or opinion
- **Three forms:** base=think; past=thought; past participle=thought
- **Pattern group:** -ought
- **Original example:** We thought the timetable was clear.
- **Usage guidance:** Thought is both the simple past and past participle.
- **Common error / contrast:** Avoid *thinked*; distinguish opinion think from planning/thinking about.

#### REF2-IRR-010 — teach
- **Kind:** irregular_verbs
- **Suggested level:** A2
- **Register:** neutral
- **Meaning:** help someone learn a skill or subject
- **Three forms:** base=teach; past=taught; past participle=taught
- **Pattern group:** -aught
- **Original example:** Our coach taught us a new warm-up routine.
- **Usage guidance:** Taught is both the simple past and past participle.
- **Common error / contrast:** Avoid *teached*; note the spelling differs from catch—caught.

#### REF2-IRR-011 — read
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** understand written words
- **Three forms:** base=read; past=read; past participle=read
- **Pattern group:** same_spelling_different_sound
- **Original example:** I read the whole story yesterday.
- **Usage guidance:** Written forms are identical, but base is pronounced /riːd/ and past/participle /red/.
- **Common error / contrast:** Past spelling alone cannot signal the tense; use context or audio.

#### REF2-IRR-012 — put
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** place something somewhere
- **Three forms:** base=put; past=put; past participle=put
- **Pattern group:** same_three
- **Original example:** I put the worksheet in my folder yesterday.
- **Usage guidance:** All three forms are spelled put.
- **Common error / contrast:** Avoid *putted* for the usual verb meaning place.

#### REF2-IRR-013 — eat
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** consume food
- **Three forms:** base=eat; past=ate; past participle=eaten
- **Pattern group:** vowel_change
- **Original example:** They ate lunch in the school garden.
- **Usage guidance:** Eaten is used after have/has in the perfect.
- **Common error / contrast:** Avoid *have ate*; use have eaten.

#### REF2-IRR-014 — speak
- **Kind:** irregular_verbs
- **Suggested level:** A2
- **Register:** neutral
- **Meaning:** say words or communicate orally
- **Three forms:** base=speak; past=spoke; past participle=spoken
- **Pattern group:** vowel_change
- **Original example:** She spoke to the librarian about the book.
- **Usage guidance:** Spoken is the past participle; spoke is the simple past.
- **Common error / contrast:** Avoid *have spoke*; use have spoken.

#### REF2-IRR-015 — find
- **Kind:** irregular_verbs
- **Suggested level:** A1
- **Register:** neutral
- **Meaning:** discover or locate something
- **Three forms:** base=find; past=found; past participle=found
- **Pattern group:** same_past_participle
- **Original example:** We found the missing pencil under the desk.
- **Usage guidance:** Found is both simple past and past participle.
- **Common error / contrast:** Distinguish find—found—found from found—founded—founded meaning establish.

### 3B. Writing linking words — 12 NEW entries

#### REF2-LNK-001 — but
- **Kind:** writing_connectors
- **Suggested level:** A1
- **Register:** neutral
- **Function:** contrast
- **Grammatical type:** coordinating conjunction
- **Construction / punctuation pattern:** independent clause + , but + independent clause
- **Original example:** The route was long, but the group enjoyed the walk.
- **Usage guidance:** Joins contrasting clauses within one sentence; a comma is common before but when both sides are independent clauses.
- **Avoid / compare:** Not interchangeable with however without changing punctuation.

#### REF2-LNK-002 — because
- **Kind:** writing_connectors
- **Suggested level:** A1
- **Register:** neutral
- **Function:** reason
- **Grammatical type:** subordinating conjunction
- **Construction / punctuation pattern:** main clause + because + finite clause
- **Original example:** I took a jacket because the room was cold.
- **Usage guidance:** Because introduces a clause with a subject and verb; the order can be reversed.
- **Avoid / compare:** Do not write *because of it was cold*.

#### REF2-LNK-003 — because of
- **Kind:** writing_connectors
- **Suggested level:** A2
- **Register:** neutral
- **Function:** reason
- **Grammatical type:** complex preposition
- **Construction / punctuation pattern:** main clause + because of + noun phrase / -ing phrase
- **Original example:** The match stopped because of the heavy rain.
- **Usage guidance:** It is followed by a noun phrase, pronoun or appropriate -ing phrase, not an ordinary finite clause.
- **Avoid / compare:** Contrast because + subject and verb.

#### REF2-LNK-004 — although
- **Kind:** writing_connectors
- **Suggested level:** A2
- **Register:** neutral
- **Function:** concession
- **Grammatical type:** subordinating conjunction
- **Construction / punctuation pattern:** Although + finite clause, + main clause
- **Original example:** Although it was raining, we still played outside.
- **Usage guidance:** Connects a concession to a main clause; a comma typically separates an initial subordinate clause.
- **Avoid / compare:** Do not double-link as *Although it rained, but we went out*.

#### REF2-LNK-005 — despite
- **Kind:** writing_connectors
- **Suggested level:** B1
- **Register:** neutral
- **Function:** concession
- **Grammatical type:** preposition
- **Construction / punctuation pattern:** Despite + noun phrase / -ing phrase, + main clause
- **Original example:** Despite the rain, the event continued.
- **Usage guidance:** Despite normally takes a noun phrase or -ing phrase; despite the fact that + clause is a distinct expanded structure.
- **Avoid / compare:** Do not write *despite it was raining*.

#### REF2-LNK-006 — however
- **Kind:** writing_connectors
- **Suggested level:** B1
- **Register:** neutral to formal
- **Function:** contrast
- **Grammatical type:** linking adverb
- **Construction / punctuation pattern:** Sentence A. However, sentence B.
- **Original example:** The test was difficult. However, everyone finished on time.
- **Usage guidance:** Connects independent sentences or suitably punctuated clauses; at sentence start it is often followed by a comma.
- **Avoid / compare:** Avoid the comma splice *The test was difficult, however we finished*.

#### REF2-LNK-007 — therefore
- **Kind:** writing_connectors
- **Suggested level:** B1
- **Register:** neutral to formal
- **Function:** result / inference
- **Grammatical type:** linking adverb
- **Construction / punctuation pattern:** Sentence A. Therefore, sentence B.
- **Original example:** The library was closed. Therefore, we studied at home.
- **Usage guidance:** Signals that the next statement is a conclusion or result supported by the first.
- **Avoid / compare:** Not a simple drop-in replacement for so with the same punctuation; do not infer certainty without evidence.

#### REF2-LNK-008 — for example
- **Kind:** writing_connectors
- **Suggested level:** A2
- **Register:** neutral
- **Function:** example
- **Grammatical type:** illustrating phrase
- **Construction / punctuation pattern:** general claim. For example, + specific illustration
- **Original example:** There are many free ways to practise English. For example, you can read short stories.
- **Usage guidance:** Introduce an actual example that supports the preceding point.
- **Avoid / compare:** One example does not prove every case; avoid repeating it without added detail.

#### REF2-LNK-009 — in addition
- **Kind:** writing_connectors
- **Suggested level:** B1
- **Register:** neutral to formal
- **Function:** addition
- **Grammatical type:** linking phrase
- **Construction / punctuation pattern:** Sentence A. In addition, sentence B.
- **Original example:** The club offers reading groups. In addition, it runs a weekly writing workshop.
- **Usage guidance:** Adds a genuinely new supporting point; commonly followed by a comma at the start of a sentence.
- **Avoid / compare:** Do not use it merely to make a short paragraph sound formal.

#### REF2-LNK-010 — first
- **Kind:** writing_connectors
- **Suggested level:** A1
- **Register:** neutral
- **Function:** sequence
- **Grammatical type:** sequencing adverb
- **Construction / punctuation pattern:** First, + step 1
- **Original example:** First, read the question and underline the key task.
- **Usage guidance:** Marks the opening step of a real procedure, plan or ordered explanation.
- **Avoid / compare:** Not every paragraph or essay needs numbered First/Second/Finally signposts.

#### REF2-LNK-011 — finally
- **Kind:** writing_connectors
- **Suggested level:** A2
- **Register:** neutral
- **Function:** sequence
- **Grammatical type:** sequencing adverb
- **Construction / punctuation pattern:** Finally, + last step
- **Original example:** Finally, check your paragraph for missing details.
- **Usage guidance:** Marks the last step of an ordered sequence; can also mean after a long wait in other contexts.
- **Avoid / compare:** Do not confuse last step with an unsupported conclusion.

#### REF2-LNK-012 — in conclusion
- **Kind:** writing_connectors
- **Suggested level:** B1
- **Register:** neutral to formal
- **Function:** conclusion / synthesis
- **Grammatical type:** linking phrase
- **Construction / punctuation pattern:** In conclusion, + genuine synthesis
- **Original example:** In conclusion, the class should keep the library open after school because more students could use it.
- **Usage guidance:** Reserve for a real summary or synthesis in an extended text; not a mandatory sentence opener.
- **Avoid / compare:** Avoid adding it to a two-sentence answer or repeating the introduction without insight.

### 3C. Frequency expressions — 11 NEW entries (do not convert these to fixed percentages)

#### REF2-FRQ-001 — always
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** endpoint_high
- **Default placement / pattern:** subject + always + main verb; be + always
- **Original example:** I always check my bag before school.
- **Usage guidance:** Normally suggests every relevant occasion; actual habitual claims can depend on context.
- **Common error / qualification:** Avoid treating this as a measured 100% statistic without counted evidence.

#### REF2-FRQ-002 — usually
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** high
- **Default placement / pattern:** subject + usually + main verb; be + usually
- **Original example:** We usually eat dinner together.
- **Usage guidance:** Describes a usual pattern with possible exceptions; frequency depends on the speaker's context.
- **Common error / qualification:** Do not assign a universal numerical percentage.

#### REF2-FRQ-003 — often
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** fairly_high
- **Default placement / pattern:** subject + often + main verb; be + often
- **Original example:** My brother often rides his bike after school.
- **Usage guidance:** Relatively frequent, but not an exact count; can appear in other positions for emphasis.
- **Common error / qualification:** Overlap with frequently and sometimes depends on circumstances.

#### REF2-FRQ-004 — sometimes
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** middle_variable
- **Default placement / pattern:** subject + sometimes + main verb; Sometimes, + clause
- **Original example:** I sometimes practise English before breakfast.
- **Usage guidance:** Some occasions but not all; also commonly occurs at the beginning or end of a clause.
- **Common error / qualification:** Not exactly half of the time.

#### REF2-FRQ-005 — occasionally
- **Kind:** frequency_expressions
- **Suggested level:** A2
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** infrequent_variable
- **Default placement / pattern:** subject + occasionally + main verb
- **Original example:** We occasionally visit the science museum.
- **Usage guidance:** Happens from time to time; sometimes and occasionally overlap in use.
- **Common error / qualification:** Do not force a strict ranking against sometimes for every context.

#### REF2-FRQ-006 — rarely
- **Kind:** frequency_expressions
- **Suggested level:** A2
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** low
- **Default placement / pattern:** subject + rarely + main verb; be + rarely
- **Original example:** The school bus rarely arrives late.
- **Usage guidance:** Means not often; may overlap with hardly ever depending on context.
- **Common error / qualification:** Avoid *do not rarely* for the intended meaning almost never in standard usage.

#### REF2-FRQ-007 — hardly ever
- **Kind:** frequency_expressions
- **Suggested level:** A2
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** very_low
- **Default placement / pattern:** subject + hardly ever + main verb
- **Original example:** I hardly ever watch television on weekdays.
- **Usage guidance:** Means almost never; it already has negative meaning and does not need another not.
- **Common error / qualification:** Avoid *I don't hardly ever watch* in standard classroom writing.

#### REF2-FRQ-008 — never
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** indefinite_frequency
- **Qualitative band:** endpoint_low
- **Default placement / pattern:** subject + never + main verb; be + never
- **Original example:** She never leaves her bicycle unlocked.
- **Usage guidance:** Expresses no occasions in the stated context; works with ordinary affirmative verb form.
- **Common error / qualification:** Avoid *I don't never go* in standard English.

#### REF2-FRQ-009 — once a week
- **Kind:** frequency_expressions
- **Suggested level:** A1
- **Register:** neutral
- **Type:** definite_frequency
- **Qualitative band:** count_based
- **Default placement / pattern:** verb phrase + once a week
- **Original example:** The drama club meets once a week.
- **Usage guidance:** Names an approximate recurring schedule of one time per week, unlike usually.
- **Common error / qualification:** Does not tell you what percentage of days the action happens.

#### REF2-FRQ-010 — twice a month
- **Kind:** frequency_expressions
- **Suggested level:** A2
- **Register:** neutral
- **Type:** definite_frequency
- **Qualitative band:** count_based
- **Default placement / pattern:** verb phrase + twice a month
- **Original example:** We visit the art gallery twice a month.
- **Usage guidance:** Names two occurrences per month; calendars and month lengths vary.
- **Common error / qualification:** Do not automatically equate with every two weeks.

#### REF2-FRQ-011 — every other day
- **Kind:** frequency_expressions
- **Suggested level:** A2
- **Register:** neutral
- **Type:** definite_frequency
- **Qualitative band:** interval_based
- **Default placement / pattern:** verb phrase + every other day
- **Original example:** I water the plants every other day.
- **Usage guidance:** Normally means on alternating days, roughly once every two days.
- **Common error / qualification:** Not the same as every day or twice a week.

## 4. Semantic and UX acceptance tests — proposed, NOT YET RUN

**A. Source/schema and regression:** 26 pilot entries remain byte/meaning-stable; exactly 38 new IDs unique across all 64; stable ID prefix; every entry has example, meaning, note and plausible suggested CEFR guide; verb forms/base + past + participle valid; only permitted reviewed variants; no unlicensed text or scores. Check all old tests and do not silently delete category types.

**B. Retrieval user stories:** typing `did` or `done` finds *do*; `thought` finds *think*; `despite` displays its noun/-ing pattern contrasted with *although*; `because of` does not suggest an ordinary finite clause; searching `usually` shows position with a main verb and *be*; `rarely` compared with `hardly ever` does not yield fake exact percentage values; `every other day` is correctly explained. Search in the offline static UI should never transmit the query to an API.

**C. Display:** 320px phone table horizontally scrolls with a visible scroll cue and accessible row headings; iPad/desktop show usable contrast, keyboard navigation and focus; topic group and status clearly visible; source provenance and suggested level not misrepresented; preexisting catalog links still guarded.

**D. Safety:** zero changes to curriculum versions, answer keys, 44 MP3s, Listening transcript access, learner attempts/grades, Auth, Firebase Math or any LIVE deployment. Code stage in an unmerged Draft PR only after academic approval.

## 5. Source-based verification pointers (NOT copied example text)
- Cambridge Dictionary, *Table of irregular verbs*: https://dictionary.cambridge.org/grammar/british-grammar/verbs-irregular-verbs
- Cambridge Dictionary, *Conjunctions: contrasting*: https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-contrasting
- Cambridge Dictionary, *Conjunctions: subordinating*: https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-subordinating
- British Council LearnEnglish, *How often*: https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/how-often
- British Council LearnEnglish Teens, *Adverbs of frequency*: https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/adverbs-frequency

These are verification leads only, not an import or permission to reproduce published worked examples. Every candidate example in Section 3 was independently authored for this packet; the reviewer should flag questionable claims rather than infer they have been externally vetted.

## 6. Independent NotebookLM review questions
1. **Architecture:** Is this a useful Reference Library taxonomy for A1–C2 English learners without introducing a quiz/score service? Any missing specialist data field or wrong UI grouping that must be fixed before implementation?
2. **Verbs:** Review **all 15 `REF2-IRR` entries individually**: past/participle, subject/tense variants, examples, pattern-group accuracy, common mistakes, CEFR guide tags. Cite exact IDs and corrected wording for any error.
3. **Writing:** Review **all 12 `REF2-LNK` entries individually**: grammar category, connector function, clause/phrase constraints, punctuation, register, meaningful example and learner-misleading shortcuts. Specifically check `because/because of`, `although/despite`, and `but/however`.
4. **Frequency:** Review **all 11 `REF2-FRQ` entries individually**: order/band nuance, adverb placement, impossible fixed percentages, negative-polarity problems and quantified frequency expressions. Is the qualitative ladder pedagogically defensible?
5. **Instructional integrity:** Does the set promote accurate composition and independent learner transfer rather than copied model-answer phrases or a fake CEFR/maturity score? Are the examples age-neutral enough for general SLE learners?
6. **Legacy stability:** Can v2 coexist with all 26 immutable original pilot items and the actual catalog; are any term duplicates, conflicting claims, unavailable exact-lesson links or implementation assumptions overlooked?
7. **Verdict:** Identify mandatory item-level fixes vs optional improvements, explicitly distinguish academic content verdict from schema/browser/production approvals.

## 7. Mandatory reviewer output
Return exactly these headings, using `PASS`, `PASS_WITH_REQUIRED_CHANGES`, `FAIL` or `INSUFFICIENT_EVIDENCE` as applicable:

1. **ACADEMIC_VERDICT** and **ACADEMIC_ADOPTION** (GO / NO_GO / CONDITIONAL).
2. **ENTRY_AUDIT_COUNTS:** irregular 15/15, connectors 12/12, frequency 11/11; explicitly show reviewed and failed counts.
3. **MANDATORY_CORRECTIONS:** exact ID, original problematic text, reason, replacement wording, necessary retest; `NONE` only if truly none.
4. **OPTIONAL_IMPROVEMENTS:** separate from blockers.
5. **SCHEMA_AND_UI_RECOMMENDATIONS:** technical design observations only (not validated browser QA).
6. **ENGINEERING_IMPLEMENTATION:** OUT_OF_SCOPE / NOT_TESTED until code exists.
7. **PRODUCTION_RELEASE:** NOT_AUTHORIZED. Academic PASS is not production authorization.

## 8. NotebookLM source handoff
**KEEP:** Only the current permanent English-project baseline sources already selected in the dedicated English Notebook, including the currently authoritative SLE-MASTER-001 (replace any superseded permanent copy); do not add this packet as permanent.

**REMOVE / DESELECT:** Any prior temporary Reference Library pilot or other old review-batch files currently selected. Preserve their GitHub archives outside active NotebookLM selection.

**ADD:** This single Markdown packet `SLE_REFERENCE_LIBRARY_V2_WAVE1_R1_20261120.md` as the ONLY new temporary source for this review.

**Short chat prompt (copy exactly):**  
> Review this Wave 1 Reference Library packet against the current permanent SLE sources. Audit every ID and answer all seven questions using the required verdict format. Require corrections where evidence is insufficient.

**After verdict:** reconcile required changes in the packet and machine data only outside NotebookLM; publish typed JSON and a Draft PR for code/QA only after a defensible academic decision and separate implementation approval. No automatic merge or deploy.

---

**Final footer:** Candidate data 15 + 12 + 11 = **38**; original reviewed pilot **26 unchanged**; projected total **64** *only if subsequently academically approved and integrated*. Wave 1 is a focused sample; the longer-term 100–150 irregular verb target remains separate and not yet authored.
