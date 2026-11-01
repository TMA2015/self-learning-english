# Writing / Listening / Speaking / Pronunciation Evidence Density Audit

Status: ACTIVE PLANNING  
Date: 2026-10-04  
Baseline: Curriculum 1.10.0

## Current module density

Writing:
- 8 lessons / 40 activities
- A1: 4 lessons / 20 activities
- A2: 3 lessons / 17 activities
- B1: 1 lesson / 3 activities
- `writing.cohesion`: only 1 evidence item in the entire curriculum

Listening:
- 2 lessons / 10 activities
- A1: 0 lessons / 0 activities
- A2: 1 lesson / 5 activities
- B1: 1 lesson / 5 activities
- gist: 2
- detail: 6
- inference: 1
- speaker intention: 1

Speaking:
- 2 lessons / 4 activities
- no A1 lesson
- objective evidence is very thin
- meaningful speaking assessment still depends on recording plus AI/human review

Pronunciation:
- 1 lesson / 3 activities
- A2 only
- real pronunciation evidence depends on audio model + recording; no automatic pronunciation score is allowed

## Priority decision

### Priority 1 — Listening

Listening is the largest deterministic gap:
- no A1 evidence at all;
- only 10 activities across the entire curriculum;
- playback safeguards already exist;
- listening can be objectively scored without AI when real playback occurs.

Next expansion should add:
1. one A1 listening lesson;
2. one A2 listening lesson;
3. one B1 listening lesson;
4. keep transcript hidden until submission;
5. preserve the rule: no real playback -> no listening score.

### Priority 2 — B1 Writing objective support

B1 Writing has only three activities:
- two objective support items;
- one extended response requiring AI/human review.

Before AI integration, the platform can still provide deterministic preparation:
- task analysis;
- idea relevance;
- paragraph organization;
- cohesion/linkers;
- register;
- grammar/vocabulary choices.

The weakest current writing tag is `writing.cohesion`, with only one item.

### Defer — Speaking and Pronunciation expansion

Speaking and Pronunciation remain important, but their most meaningful evidence requires:
- microphone/recording;
- real audio models;
- AI or human review.

Do not inflate these modules with text-only questions merely to increase lesson counts.

## Recommended Wave 2

Base: Curriculum 1.10.0  
Proposed target after independent academic PASS: Curriculum 1.11.0

Lessons:
- LIS-A1-01 — A school club announcement
- LIS-A2-02 — A changed plan for Saturday
- LIS-B1-02 — Discussing a group-project problem
- WRI-B1-02 — Build a clear opinion paragraph

Design:
- about 38–40 activities;
- no new runtime tags;
- three real-playback listening assets;
- deterministic Writing support plus one unscored extended response;
- historical 1.10.0 lessons remain immutable.

## Success criteria

Listening:
- add A1 coverage;
- materially increase detail evidence;
- increase inference and speaker-intention evidence at appropriate levels;
- every keyed answer must be supported by the audio source;
- transcript stays hidden until submission.

Writing:
- materially increase B1 objective evidence;
- add multiple cohesion items;
- extended response remains evidence weight 0 until AI/human review;
- no automatic CEFR claim.

No Sites/D1 import or deployment is authorized by this planning document.
