# Week 2 Optional AI — Persistence Integration R1

Base: PR #160, 4fd5d6f5f20fcd2b4e489537adeecd6067abede0.
Authority: SLE-MASTER-001 v1.2.0 on main. RELEASE NO_GO.

## Existing boundary
HomeClient saveNow calls client-services.saveLearnerState. Browser mode uses localLearningRuntime and its browser persistence only. Server mode PUTs /api/state; trusted Sites identity scopes the existing LearningService/D1 repository. GET /api/state restores that same account. /api/writing-week2-ai reads the same db/learning-store facade. A Firebase static origin does not gain the Sites server route or identity merely because local save succeeds.

No sync, new database, identity scheme, migration, or provider activation is introduced. Browser-only AI review is explicitly unavailable. The existing server mode remains the only supported candidate route, requiring separately verified trusted Sites dispatch, persistence and provider authorization.

## Corrections
- Browser-local saved work cannot enable the AI request button; explain the missing authenticated server save without uploading any local notes.
- Server checks current fields as well as submission signature, current history index and own-work confirmation. A retained old submission cannot authorize advice on a changed draft.
- Re-read server state after inference; concurrent saved changes reject the stale response. This is a read consistency check, not a transaction or lock: a later change after the final read is still possible; the existing client identity check remains necessary.
- No changes to canonical teaching, MCQs, completion, state schema or history. No AI advice persisted.

## Focused evidence
writing-week2-persistence-r1.cjs executes real state and AI route handlers, real SitesAuthentication and learningService with isolated BrowserLocalLearningRepository storage and a fake provider. Nine cases cover missing identity, unsaved state, PUT/GET/signature parity, blank reject, account isolation, modified snapshot, newer saved version/history, unavailable provider, concurrent change and browser-local UI guard.
This is synthetic handler/service integration, NOT actual trusted gateway, D1 or browser E2E. Publicly supplied oai-authenticated headers are not authentication; the Sites dispatcher must supply/sanitize them. No change to this existing contract is made.

## Remaining gates
Exact-head full QA, TypeScript, build and browser execution outcomes must be reported separately. Passing synthetic tests is not approval to enable the provider. Real authenticated integration, physical device QA, provider/privacy/cost approval and owner release approval remain open. Do not merge or deploy this PR or its dependencies.

## R2 fail-closed configuration
Only the explicit value `NEXT_PUBLIC_LEARNING_RUNTIME=server` may enable the optional AI UI, and only for successfully saved work. Browser, unset, empty and unknown values disable both the button and its request handler. A legitimate authenticated Sites build must explicitly set `server`; this public build selector is NOT authentication and does not bypass the server identity, snapshot or provider gates. No environment/provider setting is activated by this patch.

The runtime R2 test invokes actual component handlers with synthetic hooks/fetch, including forced invocation of disabled controls and delayed stale responses. This is separate from the existing real HomeClient/CDP test, which runs browser-local persistence at true 320/375/768/1280px viewports and now asserts that a saved plan cannot enable the optional AI button or send HTTP writes. Server-mode component tests are not authenticated Sites/D1 browser evidence.
