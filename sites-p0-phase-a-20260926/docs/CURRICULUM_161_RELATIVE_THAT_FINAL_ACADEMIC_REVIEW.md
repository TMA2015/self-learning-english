# Curriculum 1.6.1 Relative-Clause Hotfix — Final Academic Review

Packet: `GRAMMAR-1601-RELATIVE-THAT-HOTFIX-20261003`

## Independent academic audit

NotebookLM independently reviewed:
- GRA-A2-16 lesson objectives;
- English explanation;
- Vietnamese support;
- examples;
- all 10 activities GRA-A2-16-Q1 through Q10.

Final verdict:
- 10 PASS
- 0 REVISE
- 0 BLOCK
- overall: **PASS**

## Verified correction

For:
`The coach ___ works with our team is from Da Nang.`

Both:
- `who`
- `that`

are valid subject relative pronouns in a defining relative clause referring to a person.

Therefore GRA-A2-16-Q5 correctly accepts:
```json
["who", "that"]
```

The revised lesson objective/explanation is also approved:
- who or that for people in defining relative clauses;
- which or that for things;
- that is limited here to defining relative clauses and is often more informal;
- no repeated subject pronoun after the relative pronoun.

The reviewer also verified that no other GRA-A2-16 MCQ becomes ambiguous and that Q6 correctly accepts both `which` and `that` for a thing antecedent.

## Final academic status

**PASS**

No further content correction is required before Preview.

## Release boundary

This review authorizes the academic content of the 1.6.1 hotfix candidate only.

It does NOT itself authorize production import.

Next gate:
1. final hash-locked CI;
2. authenticated Preview against live Curriculum 1.6.0;
3. require Add 0 / Update 1 / Skip 58 / Conflict 0;
4. verify only GRA-A2-16 is updated;
5. stop before Import for owner authorization.
