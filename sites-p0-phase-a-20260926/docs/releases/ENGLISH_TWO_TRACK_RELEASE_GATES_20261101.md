# English release staging — two-track operating policy

**Date:** 2026-11-01  
**Branch:** `release/self-learning-english-qa-staging` (prepared from approved English release branch; NOT production).  
**Other independent branch:** `content/self-learning-academic-development`.  
**Owner request:** Stage 6 and Stage 7 content authoring proceed independently of continuous learner QA. Review packets may queue in GitHub while owner is absent; do not deploy without review/approval.

## Release staging role

- Keep the actual `release/nov2026-content-v1.18.0` / Firebase production state intact.
- Intake only content **explicitly marked academic PASS** with a fixed commit and validated cumulative JSON package, together with rights-cleared audio assets.
- Read any Stage 6/Stage 7 unreviewed packets as proposals only. Do not silently mark them PASS, import them, start private GitHub Actions or publish on Firebase.
- Assemble dependency and release-readiness reports; identify required academic/human review and browser QA; prepare rollback and test plan.
- Browser QA is ongoing for every release, not a global blocking prerequisite for unrelated content authoring.
- Technical/pedagogical Stage 3 outstanding: safe AI markdown and Vietnamese language alignment, new pronunciation audio, real option shuffle+playback browser verification, read-only Speaking metadata projection. Offline airplane-mode readiness is currently **unverified and optional**; be transparent without blocking normal online website unless owner makes it mandatory.
- Never touch Math Hosting, billing, Auth/Rules, and old learner attempts.
- Use manual only English GitHub Action workflows; no auto-trigger private minutes.
- Source implementation should be versioned and tested; owner must explicitly authorize any production deployment/merge. When absent, stop after QA-ready staging and record pending decisions.

## Change states

1. `CONTENT_DRAFT`: authored, unreviewed.
2. `ACADEMIC_REVIEW_PENDING`: one consolidated NotebookLM review Markdown file for owner handoff.
3. `ACADEMIC_PASS`: explicit verdict recorded, with all required changes resolved.
4. `TECHNICAL_QA_PENDING`: code/media/content integration testing.
5. `RELEASE_READY`: QA, media provenance, browser and rollback confirmed.
6. `PRODUCTION_DEPLOYED`: only when owner-authorized Firebase English production release is actually verified.

Never collapse these states or imply a review verdict is permission to deploy. Do not promise successful deployment without actually verifying live website.

## Working separation
The content branch owns academic packets and cumulative content candidates. The release branch owns staging reports, test plans and integration checks. Owner human QA always feeds back into prioritized defect work. Cross-branch intake is by fixed reviewed commit and explicit reconciliation, not blind automatic merges.
