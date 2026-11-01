# AQ2 Final Completion — local validation PASS

## Recovery and scope
Resumed existing AQ2 source; verified every file against the blocked source ZIP SHA-256 `3464ce0d50f67e56014d2bff284f34a059c4ea85b2383640715943b221fbe9cf`. Prior workspace, evidence and blocked ZIP preserved. Review 02 applies exactly four feedback replacements; no other academic changes in this final phase.

Overall 1.17.0 candidate contains six approved MC item revisions and thirteen position-neutral feedback revisions from Reviews 01/02. Canonical question/option IDs, keys, tags, evidence weights, all 850 activities, 100 lessons and domain counts preserved. PRO-A2-02 guided practice unchanged; Q5 evidence weight 0. Baseline curriculum 1.15.0/1.16.0 and all 14 MP3s byte-identical to verified Q2B source.

## Behavior
New 1.17+ attempts persist secure Fisher-Yates option order as canonical IDs in the initial attempt record. Saved order survives refresh, drafts, navigation and idempotent retries. Grading remains canonical-ID based; no position-based scoring. Old attempts and revisions pinned to pre-1.17 content keep source order. Missing/invalid new-version ordering fails closed with a preservation message. No automatic old-attempt rewrite, regrade or data reset.

## Validation
- Expanded wording gate: PASS across 674 MC; zero blockers. Exact exceptions refer to reading passages or contextual comparison, not displayed options.
- AQ2: PASS; 674 MC / 16,176 permutations / service grading across 100 isolated lesson attempts. Draft restoration, canonical correctness, invalid orders, retries, immutable history, quota failures and package upgrade covered.
- Distribution: 67,400 fixed-seed placements: A 16,761 / B 16,998 / C 16,789 / D 16,852. No exact small-lesson balance requirement.
- Q2B: PASS, 153 short answers / 205 accepted variants / 1,312 negative checks; format-only evidence and denominators preserved.
- Q2A shared UX, Issue #64 storage safeguards, Listening submit/retake, pronunciation runtime, Writing navigation/save, G3-E fake-transport tests and current 9/9 Listening + 5/5 Pronunciation readiness: PASS. 11 focused commands total; full aggregate not rerun.
- TypeScript: PASS. Local Firebase static build: PASS. Static security/audio check: PASS; all 14 output MP3s match approved source bytes, expected public Firebase key allowlist unchanged, no direct Gemini key/private key patterns detected.
- One command was initially invoked outside the app directory and did not run; corrected working directory, gate PASS. No application fix was needed in this final phase.
- Dry-run importer against 1.16: Add 0 / Update 12 / Skip 88 / Conflict 0. Local isolated-memory operation only.

## Remaining limitations
Owner Windows/browser QA PENDING. No live Firebase, real Gemini or production learner verification claimed. Static client curriculum is inspectable by a technically knowledgeable user; the UI hides keys/feedback before submission but is not a secure high-stakes exam server. Shuffle addresses position bias, not all semantic content leakage; future content still needs academic review. Existing storage quotas/disabled restore/recording limitations remain.
Candidate 1.17 has not been remotely published/imported. This source-only lineage has no new Git commit. Existing rights/ancestry/release gates remain separate. Do not roll back old UI onto 1.17 attempts; preserve data and use the compatible candidate.
Historical AQ2_BLOCKED_REPORT.md in source is retained as provenance; THIS final report supersedes its status.

No commits, pushes, merges, Actions, deployments, remote imports, real AI calls, Firebase/security/Remote Config/model or billing changes.

## Candidate identity
Raw SHA-256: `9c7583ae059ca8fc8eba1f5abefeaefff7b1728d79e9e73f344a517a9e6c9333`

Canonical SHA-256: `6b6f1cbacb30bb2d322112e7d2e518012c7b00d18434902fbd1ad29afd502fb4`

Byte size: 1001158

## Changed files versus Q2B
- `AQ2_BLOCKED_REPORT.md`
- `sites-p0-phase-a-20260926/app/foundation.tsx`
- `sites-p0-phase-a-20260926/app/structured-grammar.tsx`
- `sites-p0-phase-a-20260926/application/academic-service.ts`
- `sites-p0-phase-a-20260926/content/curriculum-1.17.0-candidate.json`
- `sites-p0-phase-a-20260926/docs/AQ2_APPROVED_REVISIONS.json`
- `sites-p0-phase-a-20260926/docs/qa/AQ2_POSITION_BLOCKERS.json`
- `sites-p0-phase-a-20260926/docs/qa/AQ2_RESULTS.json`
- `sites-p0-phase-a-20260926/domain/academic.ts`
- `sites-p0-phase-a-20260926/domain/option-order.ts`
- `sites-p0-phase-a-20260926/infrastructure/browser/local-runtime.ts`
- `sites-p0-phase-a-20260926/tests/assessment-position-wording.cjs`
- `sites-p0-phase-a-20260926/tests/assessment-quality-aq2.cjs`
- `sites-p0-phase-a-20260926/tests/firebase-hosting-static.cjs`
- `sites-p0-phase-a-20260926/tests/issue64-task-b.cjs`
