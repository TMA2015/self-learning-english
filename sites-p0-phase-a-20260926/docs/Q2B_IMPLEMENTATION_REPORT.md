# Q2B Cross-Skill Grading & Format Handling

Status: IMPLEMENTED; focused automated QA / TypeScript / static build / static security PASS. Owner Windows browser QA PENDING. No production release.

## Exact source and preservation
Source-only baseline: ENGLISH_GRAMMAR_FULL_VERIFIED_SOURCE.zip
SHA-256: adad7c589b4a406a376ef37119269e011391665e30dcafcfc1b192a06032551a.
Verified ZIP and all internal checksums before restoring an isolated Q2B copy. Original workspace and backups preserved unchanged. No new Git commit.
Curriculum 1.15.0 raw SHA-256: 981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426.
Curriculum 1.16.0 raw SHA-256: a030ff32387b500745fa3f646b6c68fe8bb329ae64c0323ffe6e3a3960c78c29.
Both curriculum files, all 850 activities/answer keys and all 14 audio assets are byte-identical to baseline. Normal browser runtime remains 1.16.0. No curriculum version/content change.

## Detection and submission contract
All 153 Grammar/Vocabulary short-answer items (125 / 28) and all 205 accepted-answer variants use the unchanged normalizeAnswer/accepted-answer contract.
An accepted answer is checked first and retains its existing score. A noncompliant answer is never automatically corrected or awarded credit.
The new classifier only recognizes exact reconstruction of a single supplied gap context with an existing accepted answer. It removes explicit instruction prefixes and tightly constrained parenthesized inflection cues; it does not infer sentence meaning. It tolerates case/spacing, straight/curly apostrophes and omitted terminal punctuation, but rejects changing explicit terminal punctuation. Subject, tense, negation, verb-form changes, extra alternatives or words do not match.
143 items have an extractable context; 10 deliberately retain ordinary grading. This is bounded recognition, not a promise to recognize every valid sentence paraphrase.
Before submission, the latest draft is saved. A read-only, account/version-scoped check returns question IDs only, without keys or corrected answers. The learner can edit or explicitly submit anyway. Edits invalidate the confirmation; a draft revision change during asynchronous saving/checking blocks submission; a synchronous in-flight guard prevents duplicate clicks. Save failures do not advance to submission.
On final submission the service independently recomputes classification from the stored version and answers; the UI cannot award/exclude scores by passing a claimed classification.

## Downstream policy
Confirmed format-only responses persist as `correct: null`, `outcome: format-only`, with an explanation and no knowledge tags/evidence. They earn no credit and are not an adult-review task.
- Accuracy numerator and denominator: excluded.
- Scored unique-question coverage: excluded.
- Per-skill/per-tag accuracy, repeated mistakes, recommendations: excluded.
- Error Bank and provisional estimates: no new evidence emitted; an explicit defensive format-only evidence marker is also excluded from learner inference/Error Bank.
- Attempt remains saved/submitted and counts as participation/attempted lesson, not mastery. No course completion/proficiency award is introduced.
- A later compliant response is a new attempt and is scored normally.
- Existing scored attempts are immutable and are neither relabeled nor regraded. Historical incorrect results continue contributing their original statistics; Q2B does not retroactively remove them.

## Validation
- q2b-answer-format PASS: 153 activities, 205 variants, 143 exact contexts, 10 ordinary-only contexts, 1,312 negative checks; service preflight and submission, no credit/evidence for format-only, historical results/idempotence, denominators/coverage/repeats, corrected retake, ordinary tense error, evidence exclusion, quota-failed draft and UI confirmation contracts.
- PASS: academic; practice-progress-p2a; foundation-results-ux; q2a-shared-ux; v20-route-draft-safety; attempt-navigation-ui; grammar-curriculum-upgrade; browser-curriculum-upgrade; issue64-task-b; content-quality; curriculum; pronunciation-runtime-audio; listening-submit-feedback; listening-retake-audio-readiness; g3e-firebase-reliability (9 tests, fake transports); writing-nav-save-feedback.
- Listening source-locator assertion initially failed because submit() acquired a confirmation parameter. Only the two test locators were adapted to submit(; all original safety assertions retained and rerun PASS. No Listening behavior change.
- TypeScript --noEmit --incremental false PASS.
- Static production build PASS; Firebase static security/audio gate PASS; all14 built MP3s byte-identical, no private key/service account/direct Gemini API configuration found. Existing public Firebase key allowlist unchanged.
- No full aggregate QA rerun. No real browser visual/interaction PASS claimed. Static build retains the inherited non-blocking vinext config-source warning.

## Conservative exclusions and academic review boundary
Ordinary-only items: GRA-A2-03-Q4, GRA-A2-03-Q6, GRA-A2-03-Q10, VOC-A2-02-Q2, GRA-A1-08-Q2, GRA-A2-07-Q5, GRA-A2-07-Q6, GRA-B1-06-Q2, GRA-B1-06-Q7, GRA-B1-07-Q7.
The coverage JSON records all153 IDs individually. No new accepted answers, instruction changes or academic judgments were implemented. Recognizing additional sentence paraphrases, accepting contractions forbidden by a full-form instruction, rewriting prompts, or redefining grammar correctness requires separate academic/NotebookLM approval. Merely extracting further exact contexts can be considered as a separately tested technical extension.

## Owner Windows QA
Use an isolated browser profile; run START_WINDOWS.cmd and open http://127.0.0.1:8765/. Do not request AI.
1. Grammar GRA-A2-11 Q6: enter `I will help you` and answer the other items. Submit: format prompt appears, draft remains editable, no result recorded yet. Edit to `will help`; submit normally and verify correct.
2. New attempt: keep `I will help you`, choose Submit anyway. Verify Format-only / Unscored, no credit; scored denominator is one smaller and the format count is visible in Practice performance.
3. Negative: `I would help you`, `He will help you`, `I will not help you`, `I will helps you`, and `I will help you or carry them` must not receive confirmed format-only treatment. Ordinary grading applies.
4. Vocabulary VOC-A1-01 Q3: full `We eat lunch in the school canteen` prompts format correction; `canteen` remains correct.
5. Refresh/reopen draft; same-skill and different-skill navigation preserve edits. Rapid submit clicks must not duplicate attempts. An unsuccessful save must not show Submission saved.
6. Verify Error Bank/repeated mistakes do not gain a new entry for the format-only response, while a genuinely wrong response still counts. Historical 1.15/1.16 results remain unchanged.
7. Check Listening full-playback/transcript safeguards, Writing navigation and 40-lesson structured Grammar presentation. No AI calls.

## Remaining limitations
Exact matching intentionally misses valid paraphrases and partially reproduced contexts; uncertain answers remain ordinary scored responses. Existing historical misclassifications are not repaired. Browser quota and disabled restore limitations remain; no data migration/reset added. Owner browser QA and separate rights/release/ancestry gates remain pending.
No Actions, commits, pushes, merges, deploys, remote imports, real Gemini calls, Firebase/security/Remote Config/model or billing changes.

## Exact changed files
- `sites-p0-phase-a-20260926/infrastructure/browser/client-services.ts`
- `sites-p0-phase-a-20260926/docs/qa/Q2B_FORMAT_COVERAGE.json`
- `sites-p0-phase-a-20260926/domain/learning-model.ts`
- `sites-p0-phase-a-20260926/domain/foundation-summary.ts`
- `sites-p0-phase-a-20260926/domain/practice-progress.ts`
- `sites-p0-phase-a-20260926/domain/answer-format.ts`
- `sites-p0-phase-a-20260926/domain/academic.ts`
- `sites-p0-phase-a-20260926/tests/listening-retake-audio-readiness.cjs`
- `sites-p0-phase-a-20260926/tests/q2b-answer-format.cjs`
- `sites-p0-phase-a-20260926/tests/listening-submit-feedback.cjs`
- `sites-p0-phase-a-20260926/application/academic-service.ts`
- `sites-p0-phase-a-20260926/app/platform.tsx`
- `sites-p0-phase-a-20260926/app/foundation.tsx`
- `sites-p0-phase-a-20260926/app/practice-progress.tsx`
- `sites-p0-phase-a-20260926/app/api/foundation/route.ts`
