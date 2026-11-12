# Self-Learning English — Reference Library pilot academic review R1

**Review ID:** SLE-REFERENCE-LIBRARY-PILOT-R1-20261112  
**Status:** NEW CONTENT — NOTEBOOKLM REVIEW PENDING; no release authorization  
**Normative:** SLE-MASTER-001 v1.2.0 from main (existing permanent baseline); Issue #131  
**Scope:** 26 original standalone reference cards/table entries across six categories. No curriculum import or scoring changes.

## Question for reviewer

Does this draft genuinely help young English learners find accurate reference information in context rather than just memorize lists? Does each suggested CEFR *learning-guide tag* and register label fit the expression? Judge all entries individually and require exact corrections by ID.

## Product constraints

- This is an optional **static lookup resource in the existing SLE website**, not a new course, assessment, mastery badge, CEFR certificate, AI tool, or second learning-history store.
- Search and filters should operate locally after the static bundle loads. Do not send query text, learner words or identities to an external provider. No extra cloud service, API key, cookies or new storage.
- Irregular verbs display base / past / past participle, plus an original example and usage caveat.
- Collocations, phrasal verbs, idioms, common mistakes and Reading/Grammar/Writing tips have original example + why/how note. Avoid incorrect claims of absolute grammar rules where usage is variable.
- Lesson buttons use **only the current imported catalog**. They are labeled *related skill practice*; the precise entry may not be taught in the linked lesson. Never display an unavailable lesson as a live link.
- All entries are English-first. Render text safely, be readable at >=320px and on iPad. No images necessary for a lookup-table pilot.
- This is NOT a complete irregular-verb list or exhaustive B2 reference. Suggested CEFR bands indicate learning complexity only, not proficiency evidence.
- Prohibit any disclosure of active Foundation answer keys, transcripts, future listening audio, attempts, student drafts or scoring criteria in the Reference Library.
- After reviewer PASS / PASS_WITH_REQUIRED_CHANGES, reconcile literal entry text and levels in this one JSON source, then rerun exact-head QA. If FAIL, keep route out of production.

## Item-by-item human-readable academic review source

The following 26 Markdown entries mirror the actual static JSON candidate exactly. All IDs, term forms, levels, register labels, original examples, meanings and notes are present. They are **not yet independently reviewed**. GitHub retains the machine JSON separately; NotebookLM receives ONLY this human-readable Markdown packet.

### REF-IRR-01 — go
- **Category:** irregular_verbs
- **Suggested learning level:** A1
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** move to another place
- **Original example:** Yesterday we went to the sports centre after lunch.
- **Usage note:** go — went — gone; use went for the simple past; gone commonly follows have/has.
- **Irregular forms:** base=go; past=went; past participle=gone

### REF-IRR-02 — see
- **Category:** irregular_verbs
- **Suggested learning level:** A1
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** notice something with your eyes
- **Original example:** I saw a colourful bird outside my window.
- **Usage note:** see — saw — seen; avoid 'have saw' in standard English.
- **Irregular forms:** base=see; past=saw; past participle=seen

### REF-IRR-03 — buy
- **Category:** irregular_verbs
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** get something by paying for it
- **Original example:** Nina bought a second-hand dictionary last week.
- **Usage note:** buy — bought — bought; the past and past participle are the same.
- **Irregular forms:** base=buy; past=bought; past participle=bought

### REF-IRR-04 — write
- **Category:** irregular_verbs
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** make words on paper or a screen
- **Original example:** We have written three short reviews this month.
- **Usage note:** write — wrote — written; use the participle after have/has.
- **Irregular forms:** base=write; past=wrote; past participle=written

### REF-IRR-05 — choose
- **Category:** irregular_verbs
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** decide between possibilities
- **Original example:** The class chose a new team name on Monday.
- **Usage note:** choose — chose — chosen; don't confuse present choose with past chose.
- **Irregular forms:** base=choose; past=chose; past participle=chosen

### REF-IRR-06 — grow
- **Category:** irregular_verbs
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** become larger or develop
- **Original example:** The plants have grown quickly in the sunny room.
- **Usage note:** grow — grew — grown; grown often follows have/has.
- **Irregular forms:** base=grow; past=grew; past participle=grown

### REF-COL-01 — catch a bus
- **Category:** collocations
- **Suggested learning level:** A1
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** get onto a bus you planned to travel on
- **Original example:** If we leave now, we can catch the early bus.
- **Usage note:** We usually say catch a bus, not take hold of a bus.

### REF-COL-02 — take notes
- **Category:** collocations
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** write short points while listening or reading
- **Original example:** I take notes during science videos to remember key ideas.
- **Usage note:** Take notes is a common verb–noun combination.

### REF-COL-03 — make progress
- **Category:** collocations
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** improve or move towards a goal
- **Original example:** Her reading is difficult, but she is making progress.
- **Usage note:** We say make progress; progress is normally uncountable here.

### REF-COL-04 — meet a deadline
- **Category:** collocations
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** finish work by the required time
- **Original example:** The team divided the tasks so they could meet the deadline.
- **Usage note:** Meet a deadline means finish on time, not meet a person.

### REF-COL-05 — strong argument
- **Category:** collocations
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** reasoning supported by good reasons or evidence
- **Original example:** Their proposal gives a strong argument for a quieter library.
- **Usage note:** Strong describes the quality of reasoning, not speaking loudly.

### REF-PHR-01 — look up
- **Category:** phrasal_verbs
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** search for information in a reference source
- **Original example:** You can look up a new word in a dictionary.
- **Usage note:** Separable: look the word up is possible; look up the word is also possible.

### REF-PHR-02 — run out of
- **Category:** phrasal_verbs
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** have no more of something left
- **Original example:** We ran out of paper before the art lesson finished.
- **Usage note:** Run out of something does not mean run outdoors.

### REF-PHR-03 — turn down
- **Category:** phrasal_verbs
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** reject an offer or request
- **Original example:** Kai turned down the invitation because he had another plan.
- **Usage note:** Turn down is also used for lowering volume; context changes its meaning.

### REF-PHR-04 — set up
- **Category:** phrasal_verbs
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** organize or prepare something so it can start
- **Original example:** Students set up a small exhibition in the hallway.
- **Usage note:** Set up can be separable: set the display up.

### REF-IDI-01 — break the ice
- **Category:** idioms
- **Suggested learning level:** B1
- **Register:** informal
- **Related skill:** vocabulary
- **Meaning or strategy:** help people feel more relaxed when first meeting
- **Original example:** A simple question about music helped break the ice at the club.
- **Usage note:** This is figurative: no real ice needs to break.

### REF-IDI-02 — under the weather
- **Category:** idioms
- **Suggested learning level:** B1
- **Register:** informal
- **Related skill:** vocabulary
- **Meaning or strategy:** feeling slightly ill
- **Original example:** I felt under the weather, so I rested after school.
- **Usage note:** A conversational idiom, not a medical diagnosis.

### REF-IDI-03 — on the same page
- **Category:** idioms
- **Suggested learning level:** B2
- **Register:** neutral
- **Related skill:** vocabulary
- **Meaning or strategy:** agree on the basic understanding or plan
- **Original example:** Before starting, the group checked they were on the same page.
- **Usage note:** Common in teamwork; it is not about reading one literal page.

### REF-MIS-01 — many vs much
- **Category:** common_mistakes
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** many with countable plural nouns; much with uncountable nouns
- **Original example:** How many pencils do you need? How much water is left?
- **Usage note:** Ask whether the noun can be counted as individual items.

### REF-MIS-02 — since vs for
- **Category:** common_mistakes
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** since names a starting point; for gives a duration
- **Original example:** I have lived here since 2022. I have lived here for four years.
- **Usage note:** Since and for express different kinds of time information.

### REF-MIS-03 — borrow vs lend
- **Category:** common_mistakes
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** borrow means receive temporarily; lend means give temporarily
- **Original example:** Can I borrow your ruler? Yes, I can lend it to you.
- **Usage note:** Check who receives the object and who gives it.

### REF-MIS-04 — fewer vs less
- **Category:** common_mistakes
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** fewer usually modifies countable plurals; less usually modifies uncountable nouns
- **Original example:** This version has fewer errors and needs less time.
- **Usage note:** These are useful general writing conventions; some real-world usage varies.

### REF-TIP-01 — Reading: gist before detail
- **Category:** learning_tips
- **Suggested learning level:** A1
- **Register:** neutral
- **Related skill:** reading
- **Meaning or strategy:** first identify what the whole passage is about
- **Original example:** Before checking dates, read the headline and ask what the notice is for.
- **Usage note:** A gist answer should describe the main message, not repeat one small fact.

### REF-TIP-02 — Reading: evidence vs assumption
- **Category:** learning_tips
- **Suggested learning level:** B1
- **Register:** neutral
- **Related skill:** reading
- **Meaning or strategy:** separate what a text supports from what you only suppose
- **Original example:** If a poster says places are limited, do not assume every applicant is accepted.
- **Usage note:** Point to an actual sentence before making a strong inference.

### REF-TIP-03 — Grammar: meaning before form
- **Category:** learning_tips
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** grammar
- **Meaning or strategy:** decide what a sentence needs to express before choosing a grammar pattern
- **Original example:** If an action ended yesterday, check whether a simple past form is appropriate.
- **Usage note:** Compare meanings first; then check forms and common exceptions.

### REF-TIP-04 — Writing: analyse the task
- **Category:** learning_tips
- **Suggested learning level:** A2
- **Register:** neutral
- **Related skill:** writing
- **Meaning or strategy:** identify Topic, Task, Must Include and Boundary before drafting
- **Original example:** For a school invitation, note who will read it and which details they need.
- **Usage note:** Brainstorm useful ideas, outline briefly, then check whether the final text answers the task.

## Independent academic audit questions

1. Verify all six irregular verbs (three forms, tense/aspect explanation, example accuracy and implied usage restrictions).
2. Verify all five collocations, including natural word combinations, age/topic appropriateness and correctness of claims.
3. Verify four phrasal verbs, separability and polysemy notes, register, idiomatic usage and meaningful original examples.
4. Verify three idioms and whether B1/B2/register tags are credible, clearly figurative and appropriate for children.
5. Verify four common mistake cards: defensible distinctions and non-absolute caveats, especially fewer/less and since/for.
6. Verify four learning-strategy tips for Reading, Grammar and Writing, correct procedure and independently useful example.
7. Check the 26 entries have distinct definitions and examples, no misleading near-duplicates, awkward British/American variants or accidental copyrighted textbook quotations.
8. Are suggested CEFR guide-level and register labels well calibrated, and is the "not CEFR certification" wording sufficient?
9. Are any reference examples too similar to active scored question stems/transcripts, creating practical answer leakage? If so list exact IDs and replacements, without relying on unverified broad negative claims.
10. Is the proposed product useful independently at first visit, even without AI, without a previously imported catalog, and without learner data?
11. Assess related-skill link semantics: a dynamically available Grammar/Vocabulary/Reading/Writing lesson may be related by skill, but cannot be described as teaching the exact entry without checked semantic evidence.
12. Give smallest viable correction set and whether UI/technical deployment should remain blocked pending real iPad/browser acceptance.

## Required reviewer output

`ACADEMIC_VERDICT: PASS / PASS_WITH_REQUIRED_CHANGES / FAIL / INSUFFICIENT_EVIDENCE`  
`ACADEMIC_ADOPTION: GO / NO-GO`  
`ENGINEERING_IMPLEMENTATION: GO / CONDITIONAL / NO-GO` (separately, no false UI certification)  

Return a per-ID correction table with BLOCKER/REQUIRED/OPTIONAL, exact replacement text, and explanation. Treat unreviewed entry tags and register claims conservatively. Do not assert actual browser/Ipad PASS or new content published. Passing this proposal does not authorize merge/deploy.

## NotebookLM source handoff

KEEP the newest authoritative permanent English baseline sources, including the canonical SLE-MASTER-001; REMOVE the previous temporary batch packet(s); ADD **only this Markdown file**. Do not also add the JSON as a second temporary source.

**Chat prompt:** Please independently audit all 26 item IDs in the current temporary Reference Library pilot packet using the permanent English sources. Return the requested verdict and exact ID-keyed changes.
