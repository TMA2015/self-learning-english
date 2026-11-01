# Intelligence-core validation — 25 September 2026

Engine: `cefr-screen-4.0`. Validation was completed before private deployment.
All learner-facing estimates are screening estimates, not certification.

## Adaptive selection and stopping

Start each objective skill near A2. Every four responses in that skill: 3–4 correct
moves target difficulty up one level; 0–1 correct moves down one; two correct holds.
Bounds are A1–B2. Selection rotates through the least-tested subskills and selects
an unused nearest-level item. A single wrong answer never directly triggers a level
move or repeated drilling of its tag. Stable IDs allow server replay and resume.

Grammar has 8 tags; Vocabulary and Reading have 5 each. All 18 tags receive at least
3 responses before that skill can finish. Stop that skill at:
- at least 3 per tag and confidence ≥80%; or
- at least 4 per tag and confidence ≥75%; or
- 5 per tag, retaining remaining uncertainty rather than claiming certainty.

Core range: 54–90 objective items, with two Writing samples (minimum 40 words each).
Optional synthetic Listening adds 15 tasks across 5 tags. Thirty to forty-five minutes
is a design target, not a measured completion-time claim. Older in-progress versions
retain their 12/60-item policy for compatibility; new assessments are adaptive v4.

## Evidence minimums, estimates and confidence

No objective skill CEFR appears until every catalog subskill has at least 2 scored
responses; assessment completion uses the stricter 3–5 rule above. No overall estimate
appears until Grammar, Vocabulary and Reading all meet coverage. Speaking and
Pronunciation have no score. Listening is unassessed without sufficient optional
answers, and synthetic Listening confidence is always capped at 59% (low).

Objective estimation: ordinal grid θ=0…4 in steps of .25 (Pre-A1…B2), a weak central
log prior `-.12*(θ-2)^2`, and item likelihood
`p = 1/3 + .62 / (1 + exp(-1.6*(θ - itemDifficulty)))`.
Normalize log likelihoods, take posterior mean/standard deviation, round the mean
for the base CEFR label. With ≥12 items and confidence ≥60%, an intermediate interior
mean offset beyond ±.22 displays a +/− qualifier. This model and item difficulties
are instructional assumptions, not empirically calibrated IRT parameters.

Confidence is a separate evidence index:
`40% coverage + 25% amount + 25% precision + 10% stability`.
Coverage: fraction of tags with ≥2 responses. Amount: weighted count / (4 × tags),
capped at one. Precision: max(0, 1 − posterior SD / 1.1). Stability (after 8 items):
one minus the absolute accuracy difference between the final four and preceding
items. Confidence is rounded, capped at 95%; bank edges mean<.35 or>3.65 cap at75.
With ≥8 cross-difficulty opposite-outcome comparisons and >45% easier-wrong/harder-
correct inversions, confidence is capped at59. High≥80; moderate≥60; otherwise low.

Overall averages assessed skill abilities, excludes unassessed skills, and labels
its partial scope. Confidence averages measured skills and is multiplied by .85
when Writing is unavailable. Different skills keep independent estimates.
Later objective evidence contributes in groups of three. Latest revisions replace
the same Writing task's contribution but all original events remain in the ledger.

Writing proficiency uses validated AI language judgments only, across six criteria.
Length/process checks never produce a Writing CEFR. Without AI the exact message is
**Provisional – AI language evaluation unavailable**. A distinct AI-reviewed task is
one proficiency observation, not six independent observations. Confidence starts low
and is capped at75; repeated revisions do not create independent tasks. No live AI
credential is present, so real provider quality remains unverified.

## Simulated learner results

Deterministic weak = all incorrect, mixed = two of every three correct, strong = all
correct. These are synthetic stress patterns, not measurements of real learners.

| Pattern | Questions | A1 / A2 / B1 / B2 items | Overall estimate | Confidence |
| --- | ---: | --- | --- | ---: |
| Consistently weak | 72 | 36 / 36 / 0 / 0 | Pre-A1 | Moderate, 64% |
| Mixed | 82 | 0 / 30 / 34 / 18 | B1 | Low, 56% |
| Consistently strong | 72 | 0 / 18 / 36 / 18 | B2 | Moderate, 64% |

Weak and strong have equal lengths because both reach conservative boundary caps,
but follow different difficulty paths. Mixed needs more evidence. Across 100 seeded
paths: minimum55, maximum90. Not everyone receives60; not every pattern must have a
unique length. Tests verify no repeated question IDs, balanced coverage, legacy
compatibility, 34 subskills, one-answer protection and revision deduplication.

## Persistence, isolation and interruption checks

Local D1 integration exercised the real API handlers with separate synthetic account
identities. It did not modify the real learner's account. Results:

- Diagnostic, state save, Writing coaching, revision and existing mini practice: HTTP200.
- Original Writing draft, revision, analysis, completion and demo history retained.
- Account B could not see Account A's evidence/profile or draft; B's draft stayed intact.
- Client-posted state evidence did not replace server canonical evidence.
- Saved a paused assessment after17 responses; a fresh state request restored the
  exact session and selected the same next question.
- Repeated completed-session submission did not duplicate evidence.
- Too-short assessment rejected400; unauthenticated inspector rejected401.
- Authenticated non-administrator inspector/export rejected403; anonymous export401.
- D1-backed JSON export retained all canonical evidence and the original Writing draft.
- Inspector replay returned one trace row for every response in the saved assessment.
- Profile contained34 subskills; Writing remained provisional; Speaking unassessed.
- Revision and exercise evidence were stored and two mastery snapshots were generated.

The user previously confirmed a same-account cross-device save test passed. This
milestone verifies server-backed save/reload and account boundaries locally; it does
not claim a new physical two-device production test. Production trusts identity
headers only at the Sites dispatcher boundary. There is no client-provided account
selector. Simultaneous editing still uses last-save-wins for the legacy draft blob.

Browser UI inspection confirmed separate Skill Map fields: Estimated CEFR, Accuracy,
Evidence count and Confidence, plus provisional/unassessed states. The full existing
navigation and Writing workspace remain. Administrator-only Assessment Inspector
replays each response, subskill contribution, CEFR before/after, confidence before/
after, components and stopping reason. Old sessions explicitly identify legacy replay
limitations. Snapshot history and raw events remain available separately.

## Portability verification and reproducibility

Run `node tests/run.cjs` and `node node_modules/typescript/bin/tsc --noEmit`.
Tests compile the domain/application/AI service for plain Node, outside Cloudflare.
An in-memory repository proves replacement and isolation contracts; JSON round-trip
retains unknown legacy fields. A fresh target repository restores the fixture using
explicit target ownership. An independent provider fixture proves service replacement;
an HTTP mock checks vendor response normalization. API keys never enter exported data.

Live OpenAI/Gemini evaluation, a deployed alternative database/host, natural-speech
listening validity, and pronunciation/fluency scoring were not tested. No capability
is marked working based only on a fixture. The current bank has126 core items and
no C1/C2 coverage. Confidence needs empirical calibration before higher-stakes use.
Question banks are bundled client-side for this family learning screen, so this is
not a secure, proctored or cheat-resistant examination.

The local integration harness was removed before packaging. Only authenticated,
administrator-restricted read-only inspection/export endpoints remain.

CEFR reference: Council of Europe [level descriptions](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions)
and [illustrative descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).
The numerical estimation/confidence policy above is this application's own screening
implementation, not a Council of Europe scoring formula.

## Milestone 3 addendum

See `MILESTONE_3.md` for export authorization, twelve controlled Writing cases,
ten D1-backed submissions, revision/history isolation and hint-reveal UI checks.
Live AI correctness/relevance remains explicitly unverified: no runtime provider
credential is configured. Existing adaptive test results above remain unchanged.

## Milestone 3B addendum

See `MILESTONE_3B.md` for assisted review verification: 23 actual local D1/API checks,
including simultaneous conflicting approvals, imported-draft visibility, account
isolation, revision history and export compatibility. `tests/assisted-review.cjs`
adds portable coordinator/schema/privacy/evidence/content tests. Existing adaptive
patterns and Writing fixtures still pass. Administrator write routes now exist for
review preparation/import/approval; the earlier read-only-tools description applies
to the portability milestone, not these new explicitly authorized operations.
All external-assistant feedback in automated QA is a clearly identified synthetic
fixture. No external assistant was contacted and no live AI quality claim is made.
