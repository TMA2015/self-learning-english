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

## Source data for item-level review

The following JSON is exactly the same candidate content submitted in `content/reference-library-pilot-v1.json`. The source-format markers let automated QA assert packet/source parity.

BEGIN_REFERENCE_LIBRARY_JSON
```json
{
  "packet_id": "SLE-REFERENCE-LIBRARY-PILOT-R1-20261112",
  "review_status": "NOTEBOOKLM_REVIEW_PENDING",
  "source": "original authored reference material; no external commercial source",
  "notice": "Suggested CEFR levels are learning-guide tags, not CEFR certification. These entries have no quiz keys or scoring evidence.",
  "entries": [
    {
      "id": "REF-IRR-01",
      "kind": "irregular_verbs",
      "level": "A1",
      "register": "neutral",
      "term": "go",
      "meaning": "move to another place",
      "example": "Yesterday we went to the sports centre after lunch.",
      "note": "go — went — gone; use went for the simple past; gone commonly follows have/has.",
      "skill": "grammar",
      "forms": {
        "base": "go",
        "past": "went",
        "participle": "gone"
      }
    },
    {
      "id": "REF-IRR-02",
      "kind": "irregular_verbs",
      "level": "A1",
      "register": "neutral",
      "term": "see",
      "meaning": "notice something with your eyes",
      "example": "I saw a colourful bird outside my window.",
      "note": "see — saw — seen; avoid 'have saw' in standard English.",
      "skill": "grammar",
      "forms": {
        "base": "see",
        "past": "saw",
        "participle": "seen"
      }
    },
    {
      "id": "REF-IRR-03",
      "kind": "irregular_verbs",
      "level": "A2",
      "register": "neutral",
      "term": "buy",
      "meaning": "get something by paying for it",
      "example": "Nina bought a second-hand dictionary last week.",
      "note": "buy — bought — bought; the past and past participle are the same.",
      "skill": "grammar",
      "forms": {
        "base": "buy",
        "past": "bought",
        "participle": "bought"
      }
    },
    {
      "id": "REF-IRR-04",
      "kind": "irregular_verbs",
      "level": "A2",
      "register": "neutral",
      "term": "write",
      "meaning": "make words on paper or a screen",
      "example": "We have written three short reviews this month.",
      "note": "write — wrote — written; use the participle after have/has.",
      "skill": "grammar",
      "forms": {
        "base": "write",
        "past": "wrote",
        "participle": "written"
      }
    },
    {
      "id": "REF-IRR-05",
      "kind": "irregular_verbs",
      "level": "A2",
      "register": "neutral",
      "term": "choose",
      "meaning": "decide between possibilities",
      "example": "The class chose a new team name on Monday.",
      "note": "choose — chose — chosen; don't confuse present choose with past chose.",
      "skill": "grammar",
      "forms": {
        "base": "choose",
        "past": "chose",
        "participle": "chosen"
      }
    },
    {
      "id": "REF-IRR-06",
      "kind": "irregular_verbs",
      "level": "B1",
      "register": "neutral",
      "term": "grow",
      "meaning": "become larger or develop",
      "example": "The plants have grown quickly in the sunny room.",
      "note": "grow — grew — grown; grown often follows have/has.",
      "skill": "grammar",
      "forms": {
        "base": "grow",
        "past": "grew",
        "participle": "grown"
      }
    },
    {
      "id": "REF-COL-01",
      "kind": "collocations",
      "level": "A1",
      "register": "neutral",
      "term": "catch a bus",
      "meaning": "get onto a bus you planned to travel on",
      "example": "If we leave now, we can catch the early bus.",
      "note": "We usually say catch a bus, not take hold of a bus.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-COL-02",
      "kind": "collocations",
      "level": "A2",
      "register": "neutral",
      "term": "take notes",
      "meaning": "write short points while listening or reading",
      "example": "I take notes during science videos to remember key ideas.",
      "note": "Take notes is a common verb–noun combination.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-COL-03",
      "kind": "collocations",
      "level": "A2",
      "register": "neutral",
      "term": "make progress",
      "meaning": "improve or move towards a goal",
      "example": "Her reading is difficult, but she is making progress.",
      "note": "We say make progress; progress is normally uncountable here.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-COL-04",
      "kind": "collocations",
      "level": "B1",
      "register": "neutral",
      "term": "meet a deadline",
      "meaning": "finish work by the required time",
      "example": "The team divided the tasks so they could meet the deadline.",
      "note": "Meet a deadline means finish on time, not meet a person.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-COL-05",
      "kind": "collocations",
      "level": "B1",
      "register": "neutral",
      "term": "strong argument",
      "meaning": "reasoning supported by good reasons or evidence",
      "example": "Their proposal gives a strong argument for a quieter library.",
      "note": "Strong describes the quality of reasoning, not speaking loudly.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-PHR-01",
      "kind": "phrasal_verbs",
      "level": "A2",
      "register": "neutral",
      "term": "look up",
      "meaning": "search for information in a reference source",
      "example": "You can look up a new word in a dictionary.",
      "note": "Separable: look the word up is possible; look up the word is also possible.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-PHR-02",
      "kind": "phrasal_verbs",
      "level": "A2",
      "register": "neutral",
      "term": "run out of",
      "meaning": "have no more of something left",
      "example": "We ran out of paper before the art lesson finished.",
      "note": "Run out of something does not mean run outdoors.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-PHR-03",
      "kind": "phrasal_verbs",
      "level": "B1",
      "register": "neutral",
      "term": "turn down",
      "meaning": "reject an offer or request",
      "example": "Kai turned down the invitation because he had another plan.",
      "note": "Turn down is also used for lowering volume; context changes its meaning.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-PHR-04",
      "kind": "phrasal_verbs",
      "level": "B1",
      "register": "neutral",
      "term": "set up",
      "meaning": "organize or prepare something so it can start",
      "example": "Students set up a small exhibition in the hallway.",
      "note": "Set up can be separable: set the display up.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-IDI-01",
      "kind": "idioms",
      "level": "B1",
      "register": "informal",
      "term": "break the ice",
      "meaning": "help people feel more relaxed when first meeting",
      "example": "A simple question about music helped break the ice at the club.",
      "note": "This is figurative: no real ice needs to break.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-IDI-02",
      "kind": "idioms",
      "level": "B1",
      "register": "informal",
      "term": "under the weather",
      "meaning": "feeling slightly ill",
      "example": "I felt under the weather, so I rested after school.",
      "note": "A conversational idiom, not a medical diagnosis.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-IDI-03",
      "kind": "idioms",
      "level": "B2",
      "register": "neutral",
      "term": "on the same page",
      "meaning": "agree on the basic understanding or plan",
      "example": "Before starting, the group checked they were on the same page.",
      "note": "Common in teamwork; it is not about reading one literal page.",
      "skill": "vocabulary"
    },
    {
      "id": "REF-MIS-01",
      "kind": "common_mistakes",
      "level": "A2",
      "register": "neutral",
      "term": "many vs much",
      "meaning": "many with countable plural nouns; much with uncountable nouns",
      "example": "How many pencils do you need? How much water is left?",
      "note": "Ask whether the noun can be counted as individual items.",
      "skill": "grammar"
    },
    {
      "id": "REF-MIS-02",
      "kind": "common_mistakes",
      "level": "A2",
      "register": "neutral",
      "term": "since vs for",
      "meaning": "since names a starting point; for gives a duration",
      "example": "I have lived here since 2022. I have lived here for four years.",
      "note": "Since and for express different kinds of time information.",
      "skill": "grammar"
    },
    {
      "id": "REF-MIS-03",
      "kind": "common_mistakes",
      "level": "A2",
      "register": "neutral",
      "term": "borrow vs lend",
      "meaning": "borrow means receive temporarily; lend means give temporarily",
      "example": "Can I borrow your ruler? Yes, I can lend it to you.",
      "note": "Check who receives the object and who gives it.",
      "skill": "grammar"
    },
    {
      "id": "REF-MIS-04",
      "kind": "common_mistakes",
      "level": "B1",
      "register": "neutral",
      "term": "fewer vs less",
      "meaning": "fewer usually modifies countable plurals; less usually modifies uncountable nouns",
      "example": "This version has fewer errors and needs less time.",
      "note": "These are useful general writing conventions; some real-world usage varies.",
      "skill": "grammar"
    },
    {
      "id": "REF-TIP-01",
      "kind": "learning_tips",
      "level": "A1",
      "register": "neutral",
      "term": "Reading: gist before detail",
      "meaning": "first identify what the whole passage is about",
      "example": "Before checking dates, read the headline and ask what the notice is for.",
      "note": "A gist answer should describe the main message, not repeat one small fact.",
      "skill": "reading"
    },
    {
      "id": "REF-TIP-02",
      "kind": "learning_tips",
      "level": "B1",
      "register": "neutral",
      "term": "Reading: evidence vs assumption",
      "meaning": "separate what a text supports from what you only suppose",
      "example": "If a poster says places are limited, do not assume every applicant is accepted.",
      "note": "Point to an actual sentence before making a strong inference.",
      "skill": "reading"
    },
    {
      "id": "REF-TIP-03",
      "kind": "learning_tips",
      "level": "A2",
      "register": "neutral",
      "term": "Grammar: meaning before form",
      "meaning": "decide what a sentence needs to express before choosing a grammar pattern",
      "example": "If an action ended yesterday, check whether a simple past form is appropriate.",
      "note": "Compare meanings first; then check forms and common exceptions.",
      "skill": "grammar"
    },
    {
      "id": "REF-TIP-04",
      "kind": "learning_tips",
      "level": "A2",
      "register": "neutral",
      "term": "Writing: analyse the task",
      "meaning": "identify Topic, Task, Must Include and Boundary before drafting",
      "example": "For a school invitation, note who will read it and which details they need.",
      "note": "Brainstorm useful ideas, outline briefly, then check whether the final text answers the task.",
      "skill": "writing"
    }
  ]
}
```
END_REFERENCE_LIBRARY_JSON

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
