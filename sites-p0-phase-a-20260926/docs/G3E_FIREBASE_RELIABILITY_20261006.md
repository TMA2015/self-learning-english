# G3-E — Firebase AI reliability and safe observability

Implementation baseline: PR #44 HEAD `5d23e23fa7dba57f3a7c1db27cc51026bac5e35d`.
Implementation only: no deployment, real AI request, billing/security change or learner-data operation.

## Request lifecycle

A 20-second client deadline returns deterministic guided feedback. It does not cancel the Firebase SDK request. The transport holds its lock until that original promise settles, including late rejection. Further clicks receive request-pending fallback without another generateContent call. No automatic retry or secondary-model invocation is added. The ordinary application remains usable. Late AI success is discarded and never retroactively replaces saved guided feedback. The lock is per browser application instance, not cross-tab coordination.

## Safe observations

Provider return compatibility is retained (`result | null`), with an optional typed diagnostic observer. Only fixed provider, classification and phase enums are emitted. No raw exception, learner writing, token, key, header, prompt or response is logged by this observer or persisted in learner state. Structured schema rejection is explicitly classified by the tutor validation layer.

Classifications: client-timeout, backend-overload (including INTERNAL), deadline-exceeded, quota-rate-limit, app-check-permission, invalid-response, unknown-provider-error, request-pending, cooldown and unavailable. Classification is best-effort from the SDK code/message, not a claim of console verification. Diagnostic sink failures cannot interrupt fallback. The learner sees only simple AI-unavailable / guided-feedback wording.

## Remote Config

English-only parameter: `english_writing_ai_model`. It is public operational configuration, not a secret. Default: `gemini-3.5-flash`; a valid explicit NEXT_PUBLIC_GEMINI_MODEL remains supported. `gemini-3.8-flash` is retained as a valid model selection. Two observed production requests to 3.8 failed downstream (INTERNAL overload; DEADLINE_EXCEEDED at ~2m59s). Remote Config supports operational selection without a new application release, rather than automatic per-request model fallback.

Use the existing English Firebase App, never the Math App. One background fetch/activate per browser session; Firebase minimum fetch interval 12 hours, fetch timeout 5 seconds. Writing does not wait for configuration fetch; unavailable/unsupported/invalid Remote Config retains local default. A successful refresh applies to the next explicit request, never changes an in-flight model. No real-time listener, per-click fetch, Analytics, additional Firebase project or billing enablement.

No Firebase Console parameter is created/published in this implementation. Model availability and a real App-Check-protected success remain owner release gates; this patch does not claim the proposed default has been live-tested.

## QA and release boundaries

Run frozen install, focused G3-E test, qa:core, qa:full and qa:release locally. The new test is included in core/full/release. Mocked timers/promises/SDK dependencies only: no real AI or Remote Config calls. Preserve App Check setup, registered app/project IDs, all curriculum/audio and storage code.

Future authorized browser QA: successful structured Writing feedback; overload fallback; 20-second fallback with subsequent click prevented while SDK request remains pending; eventual unlocking; preserved local Writing after reload; Remote Config default and operational selection. Never weaken App Check or send repeated live test requests. No deployment or merge is authorized here.

## Local verification — 2026-10-06

- Frozen dependency install: PASS (lockfile unchanged).
- Focused G3-E: 11/11 deterministic cases PASS, zero live AI/Remote Config calls.
- qa:core: 15/15 commands PASS.
- qa:full: 49/49 commands PASS.
- qa:release: PASS, including 49/49 commands, TypeScript, Firebase static build and static/security QA.
- Non-blocking build warnings: duplicate nextConfig source; chunks exceeding 500 kB.
- Exact baseline blob audit: academic content, Listening audio and storage files unchanged; App Check initialization block unchanged.
- Three GitHub workflows remain manual-only. No Actions, deployment, merge, billing/configuration or learner-data operation occurred.
- Future real App-Check-protected success and browser lifecycle/Remote Config QA remain PENDING; do not infer live success from mocks.
