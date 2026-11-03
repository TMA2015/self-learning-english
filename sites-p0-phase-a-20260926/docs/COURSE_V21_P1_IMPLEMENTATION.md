# v21-P1 implementation handoff (staged only)

Baseline: deployed Sites v20 source `7ffc690ba63461322eff7d259b483531c224e053`. Architecture: PR #20 checkpoint `af05a4d429647d906cb5f533294c7c5f4872c830`. PR #19 and Batch05 are excluded.

## Scope

My Courses shows a virtual compatibility view of the existing English Writing Coach. It does not create an enrollment on read. Week 1 has four saved process stages; Weeks 2–12 remain previews. The existing Writing state, drafts, feedback, Saved Writing revisions, Foundation Catalog and versioned attempts remain in their original stores.

Explicit Set active / Continue / Clear active use `POST /api/course`. The authenticated principal comes from Sites identity, never request JSON. `GET /api/course` directly reads the legacy primary row and isolated selection row without calling `importLegacy`, `rebuild`, or `snapshot`. The course projection has no evidence writes.

## Persistence and rollback

The existing `learner_states` table requires no schema change. Selection is stored under `course:v1:<trusted principal>`; normal v20 learner rows are keyed by `user:<id>` or `email:<address>`. Each selection row contains `courseV1`, active ID (nullable), monotone revision and last request ID. Initial insert uses `ON CONFLICT DO NOTHING`; subsequent writes use `UPDATE ... WHERE payload=<observed exact payload>`. A failed compare returns 409 with the latest revision; retrying the same request ID and target is idempotent. A stale broad Writing PUT addresses only the legacy row. New `/api/state` PUT explicitly ignores client-provided `courseV1`.

Code-only rollback target is the saved v20 application source. v20 reads the normal learner row and retains unknown fields through its `rebuild` spread and Writing save. It does not address the isolated selection row. Re-deploying v20 hides My Courses but does not delete selection, Writing history, Foundation attempts or evidence. A later P1-forward deployment can read the same selection row. Do not delete or restore learner rows during rollback.

## Limits and gates

Only Writing is shown as the virtual P1 course. This does not publish A1/A2 templates, run placement or generate AI courses. A future enrollment engine needs its own approved persistence contract and release. Clean-draft navigation optimization is excluded; the v20 Foundation save-before-leave guard remains. Legacy Writing changes are explicitly saved before new route transitions, and a failed save blocks navigation.

Deterministic local tests use a fake D1 implementation and no production records. Authenticated preview has a separate origin from production; if it cannot carry identity, browser QA is owner pending. Before production release, verify desktop/mobile selection, reload, Writing Week 1 and preview weeks, all sidebar routes, draft-save failure and restored history with an authorized test account. Do not infer live curriculum counts or digest from this code-only staging.
