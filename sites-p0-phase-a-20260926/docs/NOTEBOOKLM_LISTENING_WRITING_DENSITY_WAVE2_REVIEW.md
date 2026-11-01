# NotebookLM Review Packet — Listening + B1 Writing Density Wave 2

Packet ID: `EN-LIS-WRI-DENSITY-W2-20261004`

Status: **ACADEMIC PASS — CURRICULUM 1.11.0 RELEASE-CANDIDATE QA**

## Sources

Keep the five current Self-Learning English v2 permanent NotebookLM sources.

Temporary source:
- remove `EN-VOC-REA-B1-DENSITY-W1-20261004.md`;
- add only `content/review-packets/EN-LIS-WRI-DENSITY-W2-20261004.md`.

Do not upload the JSON batch to NotebookLM.

## Scope

Review exactly four lessons / 40 activities:

- LIS-A1-01 — A school club announcement
- LIS-A2-02 — A changed plan for Saturday
- LIS-B1-02 — Discussing a group-project problem
- WRI-B1-02 — Build a clear opinion paragraph

Base: Curriculum 1.10.0  
Proposed target after PASS: Curriculum 1.11.0

No new runtime tag is proposed.

## Why this wave

Baseline audit found:
- Listening had only 2 lessons / 10 activities and no A1 coverage;
- B1 Writing had only 1 lesson / 3 activities;
- `writing.cohesion` had only one evidence item in the whole curriculum;
- Speaking and Pronunciation remain better deferred until recording/AI support is available.

## Special checks

Listening:
- every keyed answer must be supported by the source audio text;
- CEFR level must fit A1/A2/B1;
- distinguish detail from inference and speaker intention correctly;
- no accidental second correct option;
- source text must sound natural when spoken aloud;
- transcript remains after-submission only;
- real playback is mandatory for listening credit;
- fallback must never award listening evidence from transcript-only work.

Writing:
- deterministic support tasks must genuinely prepare the B1 extended response;
- cohesion/linker items must reflect the intended relationship;
- register, vocabulary, grammar and organization items must be unambiguous;
- the final extended response must remain AI/human-reviewed only;
- evidence weight for the extended response must remain 0;
- no automatic CEFR score.

## Review result — 2026-10-04

Verdict: **PASS**

NotebookLM reviewed all 4 lessons / 40 activities against the five permanent Self-Learning English v2 sources. No academic correction was required.

Confirmed PASS:
- all 30 Listening keys are grounded in the exact audio source text;
- A1/A2/B1 progression and gist/detail/inference/speaker-intention tags;
- real playback required and transcript revealed only after submission;
- transcript-only work never earns Listening credit;
- B1 Writing scaffold from task analysis through cohesion, organization, register, grammar and vocabulary;
- final extended response remains AI/human-reviewed with evidence weight 0;
- CEFR appropriateness, Vietnamese support, originality and safety.

No new runtime tag is introduced.

Production import/deploy remains unauthorized pending release-candidate QA and owner authorization.

## Required verdict

Return exactly `PASS` or `REVISIONS_REQUIRED`.

For every issue, give the exact lesson/activity ID, the precise issue and a concrete correction. Silence does not mean PASS.
