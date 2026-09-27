# P1 browser QA: managed preview identity blocker (2026-09-27)

**Observed in a supported Work run, per owner-supplied report:** Source checkout pinned to `1ee4202475cdc56788001d97ccb9881755b1939d`; `node tests/foundation-coaching.cjs`, `node tests/run.cjs`, `node tests/academic.cjs`, and production build passed. In managed preview, opening Foundation/Grammar returned `Sign in to use your learning path.` The browser could not obtain authenticated Sites identity; consequently UI/browser acceptance, historical records, and save/submit/reload were NOT verified. Preview stopped; no new release, migration, reset or reimport; live v8 unchanged.

> **Second Work attempt (owner-reported, 2026-09-27):** The current Work environment is managed-linux only; its browser cannot access portable localhost/loopback or the local mock sign-in route. No additional build/tests were run and no data/import/deployment was changed. Both managed authenticated browser QA and portable browser QA are unavailable **inside that Work session**. Do not send another Work run with the same preview instructions. P1 remains HOLD pending a different QA environment or an explicit owner-approved, controlled live-release exception.

## Why it happens

The Foundation GET endpoint calls `learnerKey(request)` and returns HTTP 401 with that message when trusted Sites identity headers are absent. The source `vite.config.ts` enables `sites({mockAuth: !managedLinux})`: managed-linux preview deliberately does not inject the local mock account, while the portable *loopback-only* development profile does. This identifies a testing-environment authentication boundary, not proof of a P1 application defect.

**Do not** add a production auth bypass, hard-code identity headers, force `mockAuth: true` in managed/hosted configuration, expose D1, or change production auth just to make preview work.

## Safe two-layer verification

### A. Isolated portable-loopback UI test (if environment permits)

Use the SAME feature source/commit in an isolated checkout with the project's **portable** execution profile, not a managed preview disguised as portable. Follow the existing README and Sites setup guidance for dependencies, local D1 and local authentication. Start `npm run dev` on localhost/127.0.0.1; visit `/signin-with-chatgpt?return_to=/` as a **top-level navigation**. The built-in local demo identity is `local_seedy` / `seedy@sites.test`; `ADMIN_EMAILS=seedy@sites.test` may be set in an ignored local environment file if the content importer is needed.

Apply the project's local D1 migrations only to the isolated local database, in order; import the original Foundation seed then the verified `1.0.2` candidate via admin preview/confirm (or a supported equivalent local fixture). Verify **on local disposable records only**:
- Grammar A2 new `1.0.2` attempt: eight separated example cards and ten questions; hints 1/2 appear only while started and never disclose the exact full answer.
- Desktop and narrow/mobile layout, Vietnamese support; other lessons' unlabeled examples.
- Submit and reload: scored result persists. A new attempt resets hint display; completed and historical version `1.0.0` attempts do not show `1.0.2` hints.
- Writing review and Diagnostic flows are verified by existing tests; local fixture data must not be presented as a production record verification.

If this profile is not available inside Work, report **portable QA unavailable**, rather than bypassing managed auth. Owner can run the same isolated local test later on the Windows computer; do not require them to disclose credentials or production data.

### B. Production-specific identity/data regression

The owner's prior real-account v8 checks already demonstrated Grammar v1.0.2 persistence across laptop, Writing `b81950` pending review and paused Diagnostic with six answers. After any future authorized code release, owner must revisit the *actual private Site* with normal ChatGPT sign-in and reconfirm those records, version strings, responsive teaching cards, hint behavior and a new disposable attempt.

Do not confuse successful local mock-auth testing with authenticated live account testing. Keep v8 available for code rollback and never roll back/rewrite D1 records as an automatic part of code rollback.

## Release decision

Four source/build checks passed; authenticated browser QA did not run. Current gate = **HOLD** until isolated portable UI testing succeeds and the owner explicitly authorizes a release path that includes immediate authenticated live smoke-test and rollback on failure. If Work cannot provide an authenticated staging/preview or portable browser, it should stop and state that limitation. Do not claim a preview pass or deploy by implication.
