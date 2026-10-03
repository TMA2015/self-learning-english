# NotebookLM Review Instructions — Grammar Wave 1B

Review ONE packet at a time. The three packet JSON sources are mirrored as TXT for NotebookLM because the current NotebookLM source uploader does not accept JSON.

Permanent Notebook sources remain the established seven project sources. Add only the selected packet TXT plus this review instruction as temporary sources for the current round.

## Required output

Audit all 40 activities in the selected packet individually. Also review the four lesson explanations, examples, objectives and prerequisites.

Return one structured JSON result. If the result may be too long for chat, export it as a JSON artifact.

Required shape:

```json
{
  "packet_id": "EXACT_PACKET_ID",
  "overall_verdict": "PASS | REVISIONS_REQUIRED | BLOCK",
  "lesson_reviews": [
    {
      "lesson_id": "GRA-...",
      "status": "PASS | REVISE | BLOCK",
      "lesson_level_findings": []
    }
  ],
  "item_reviews": [
    {
      "item_id": "GRA-...-Q1",
      "status": "PASS | REVISE | BLOCK",
      "issue": null,
      "correction": null
    }
  ],
  "dependency_and_overlap_findings": [],
  "tag_findings": [],
  "final_counts": {
    "pass": 0,
    "revise": 0,
    "block": 0
  }
}
```

Requirements:
- exactly one item review for every activity ID in the selected packet;
- no missing, duplicate or unexpected item IDs;
- do not give a blanket PASS without item-level inspection;
- REVISE/BLOCK must identify the exact problem and a concrete correction;
- do not silently rewrite the source;
- distinguish curricular target from learner proficiency certification.

## Common academic checks

For every lesson/item check:
- grammatical and semantic accuracy;
- A1/A2 target and suitability for a 12-year-old learner;
- guided -> independent -> transfer progression;
- clear prompt and answer format;
- one defensible MCQ key;
- no distractor that is also reasonably correct in the stated context;
- all genuinely intended short-answer variants;
- literal-gap validity: inserting an accepted answer exactly into the printed blank must yield a correctly spaced, grammatical sentence;
- correct explanation/feedback;
- original wording, no copied commercial exercise;
- source tag matches the exact evidence being tested;
- prerequisite and overlap logic.

## Packet A focus

Lessons:
- GRA-A1-09 demonstratives
- GRA-A1-10 object/possessive pronouns
- GRA-A1-11 imperatives/instructions
- GRA-A1-12 time prepositions

Specific risks:
- this/that/these/those must respect both number and contextual distance;
- object pronouns must not be confused with subject forms or possessive adjectives;
- possessive pronouns stand without a following noun;
- imperatives use base verb; negative imperative uses don't/do not + base verb;
- time-preposition examples should avoid regional-usage traps where possible.

Planned Packet A tags:
- grammar.demonstratives
- grammar.object_pronouns
- grammar.possessive_pronouns
- grammar.imperatives
- grammar.instructions
- grammar.prepositions_time

## Packet B focus

Lessons:
- GRA-A2-08 past continuous
- GRA-A2-10 present perfect just/already/yet
- GRA-A2-11 future-form choices
- GRA-A2-12 should/shouldn't

Specific risks:
- past continuous vs past simple should distinguish background/in-progress vs shorter interrupting event without claiming the distinction applies mechanically to every narrative;
- just/already/yet positions and participles must be correct and should not mix with explicit finished-past time;
- future forms are context-sensitive: do not claim will/going to/present continuous are always mutually exclusive in real English; contexts must make the pedagogical target defensible;
- should is advice, not the same force as must/have to;
- contraction fragments must not violate literal-gap spacing.

Planned Packet B tags:
- grammar.past_continuous
- grammar.past_simple
- grammar.present_perfect
- grammar.will_future
- grammar.future_plans
- grammar.present_continuous
- grammar.should_advice

## Packet C focus

Lessons:
- GRA-A2-13 modal possibility
- GRA-A2-14 zero/first conditionals
- GRA-A2-15 verb patterns
- GRA-A2-16 defining relative clauses

Specific risks:
- may/might/could overlap semantically; never force a single-choice distinction where multiple modals are genuinely valid;
- zero vs first conditional should be taught as useful patterns, not absolute descriptions of every conditional sentence;
- verb-pattern items must avoid verbs that naturally allow both infinitive and -ing if the item expects only one answer;
- relative clauses in this lesson should stay focused on defining clauses with who/which/that and avoid unnecessary B1 complexity;
- check that subject relative clauses do not repeat he/she/it.

Planned Packet C tags:
- grammar.modal_possibility
- grammar.conditionals
- grammar.verb_patterns
- grammar.relative_clauses

## Release boundary

Notebook review does NOT authorize:
- curriculum assembly;
- production import;
- Site deployment;
- learner-data changes;
- CEFR certification.
