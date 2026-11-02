# Self-Learning English — staging intake and Stage 3 QA audit

Date: 2026-11-02. Branch: `release/self-learning-english-qa-staging` ONLY.
Academic source ref: `content/self-learning-academic-development@8831530561010c519c501ced4147b76471d14ae4`.
Baseline: immutable v1.18.0, 109 lessons / 913 activities / 38 MP3.
This is a staging engineering audit, **not** academic approval or release authorization.

## Academic intake decision

| Packet | Source state | Staging disposition |
| --- | --- | --- |
| `SLE-S6-REA-A1-02-04-R1` (REA-A1-02/03/04, original 24 QIDs) | `ACADEMIC_REVIEW_PENDING` | HOLD; no academic PASS or reviewed cumulative importer JSON |
| `SLE-P01-A-PREA1-A1-ACADEMIC-R1-20261102` (U01–U07; U06 existing LIS-A1-01 reuse) | `ACADEMIC_REVIEW_PENDING` | HOLD; no academic PASS or importer-compatible package |
| `SLE-P01-SCHOOL-COMM-R1` and seven-unit authoring JSON | `CONTENT_DRAFT` | HOLD; 34 draft items (30 objective / 4 unassessed), not production IDs |

**Explicit `ACADEMIC_PASS` packets found in the reviewed content-branch checkpoint: 0.**
Therefore **0 lessons and 0 audio files were imported**; no intake commit, new curriculum version, release notes or rollback artifact is justified yet. No claim of independent plagiarism/originality clearance or production answer/tag validation is made for unapproved drafts. Existing IDs, keys, tags, historical attempts, source audio and rights register were not modified.

## Actual Stage 3 engineering changes in staging

- AI Tutor: bounded Markdown subset (paragraphs, line breaks, bold, ordered/unordered lists) rendered as escaped React text, not executable HTML; mobile list styling.
- Question-language routing: Vietnamese (including common unaccented prompts) receives a Vietnamese explanation with English examples; English prompts remain English. Existing App Check, 300-character question limit, 850-token response cap and knowledge-only lesson context are preserved.
- A focused dependency-free test was added to `pnpm qa:release` on this staging branch only; it checks Markdown parsing, literal hostile HTML, language heuristics and static integration. **No live Gemini or browser claim.**

| Gate | Result | Evidence or limit |
| --- | --- | --- |
| New pure helper unit assertions | **PASS** | 9 local Node 22 strip-types assertions, no external dependencies |
| GitHub staging source integration inspection | **PASS (static only)** | 8/8 checks for escaped rendering, question routing, privacy bounds, QA inclusion and CSS |
| Full regression / TypeScript / static Firebase build | **NOT_RUN** | No dependency-installed project environment in this run; no private Actions invoked |
| AI Tutor real Gemini / XSS browser / Vietnamese-English UI | **NOT_RUN** | Source-only tests are not a browser or provider response |
| Listening per-attempt option order, saved-order restore, actual MP3 and transcript gate | **NOT_RUN (browser)** | Existing source/test guards inspected; two real browser attempts not observed |
| Pronunciation `feet/fit/beat/bit` pilot MP3 and hearing validation | **NOT_RUN / ASSETS PENDING** | Four proposed audio assets lack measured duration/SHA and owner hearing approval in reviewed Stage 3 brief |
| Speaking historical evidence read-only projection | **NOT_RUN** | No runtime/record evidence of the proposed `language_preparation_knowledge` display; oral weight must remain 0 for new self-report |
| Stage 5 parent/learner QA | **ONGOING, NO NEW EVIDENCE IN REVIEWED CHECKPOINT** | Does not block separate Stage 6/7 content authoring |
| Offline airplane-mode QA | **NOT_VERIFIED (optional)** | No offline advertising or online blocking claim |

## Release boundary and next gates

1. Owner/NotebookLM must record independent verdicts and required fixes for the two pending academic packets; only explicit `ACADEMIC_PASS` with fixed source commit and valid cumulative schema can enter staging intake.
2. Validate Stage 3 code changes with dependency-installed TypeScript, full regression and Firebase static build; perform actual desktop/mobile browser checks for AI language, Listening shuffle/playback/restore and Speaking evidence display.
3. Create four rights-cleared Pronunciation pilot MP3s and obtain owner hearing QA before assessing new hearing questions. Preserve existing Listening rights and all historical attempts.
4. Only after an approved candidate exists, freeze version, reconcile IDs/keys/tags/media SHA, prepare release notes and a tested rollback against the unchanged v1.18.0 baseline. No automatic private Actions, merges, Firebase Preview/Production, Math, Auth/Rules, billing or student-data writes occurred in this cycle.
