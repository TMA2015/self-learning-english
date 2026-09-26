# P0 build-only recovery — no live database changes

Status: production is still Site version 6, `a6d5c697c423737d708452aebeed3ccf8b903bdd`. The current P0 source snapshot is on branch `sites-source-snapshot-20260926` at commit `6e4688ab40357cf1ea2a457c7e8e33baf954a6d1`, nested under `sites-source-snapshot-20260926/`.

## Why this is separate

The Sites tools have not exposed a complete export/backup of the managed live D1. The app's admin JSON export is **current-account-only**, as shown in `app/api/admin/export/route.ts` and `application/export-learner.ts`; it is not a database backup. A retained Site version 6 is a code/artifact rollback, not a backup of live records. Do not describe either as a full backup.

**Build and preview do not require a live data backup if they use an isolated database and do not modify production.** Do not let a missing live D1 backup prevent this read-only/offline stage.

## Phase A — next Work task, approved scope

1. Verify the current checkout contains the exact intended P0 changes from the snapshot. Retain existing project settings and rollback version 6.
2. Remove temporary synthetic/test identity overrides from **production source**, not just the tests. Verify trusted Site identity and administrator checks remain authoritative. Local-only fixtures stay non-executable, and no QA admin address/credentials remain in production configuration.
3. Build/package the existing P0 code with the supported Sites build workflow. Fix only blockers required for this build; do not refactor.
4. Use managed preview with **isolated local/test D1**, applying migrations there in order as needed. Do not point it at live D1. Test a representative authenticated learner flow: catalog=13, Grammar objective feedback and reload, one Listening audio gate, existing Writing/Assisted Review visible.
5. Report build artifact identifier, source/version and scope of isolated preview checks. If blocked, report first concrete failure and stop.

**Do not** apply production migrations, publish/deploy, reset/clear live data, run full assessment simulations, generate content, or claim live success in Phase A.

## Phase B — independent production release gate (do not perform automatically)

Prior to any live D1 migration, determine whether a provider-supported complete D1 backup/export or verified point-in-time recovery mechanism is actually available for this managed database. Do not assume generic Cloudflare Wrangler access to a Sites-owned database.

If full backup is unavailable, produce a brief, auditable risk report **without querying personally identifiable record contents**:
- Existing table names / migration state, row counts, number of distinct owner scopes; no owner IDs or content in report.
- Whether the current-account export can be successfully downloaded and its sections/record counts checked without printing personal data.
- Exact SQL effects of pending `0004` and `0005` (new tables and initial seed only; inspect actual SQL rather than assuming).
- Whether version 6 can run against the additive migrated schema; whether the supported Sites release mechanism offers rollback for code and DB independently.
- Consequences of failure between migration and deploy, or of restoring code only.

Then present safe alternatives and remaining risks for explicit owner approval. If no adequate recovery for existing personal data can be established, do not automatically apply production migrations or publish. Do not build a broad administrator data-export endpoint or enumerate private accounts merely to bypass the missing backup tool.

## Gate for honest completion

A passing managed preview is **not** proof that the private live URL is deployed or that the real learner's Diagnostic HTTP 400 is fixed. Real-account Assessment triage is a separate follow-up that preserves its existing draft and captures only status and safe error code/position.

## Phase A checkpoint verified in GitHub
- Branch: `sites-p0-phase-a-20260926`; commit: `2c9bcc0ccdfb0b266134613d4c268abbde3ab8c3`.
- Source and checkpoint manifest are under `sites-p0-phase-a-20260926/`. Compared with the earlier source snapshot, shared Git blobs are unchanged; local QA fixture files are absent.
- Reported package: `p0-phase-a-20260926.tar.gz`, SHA-256 `d60027d83f85bea2954b594763d28f7c9f814a482666ec47608351e796f1f446`. The archive itself is not in the GitHub source branch; its digest has not been independently rechecked here.
- Managed preview lacked authenticated Sites identity; authenticated learner flows remain unverified in this run. Use the existing portable localhost-only mock sign-in for isolated testing when available; never enable it on a public server or production. Otherwise document the coverage gap rather than bypassing production authentication.
- Live Site remains version 6. Production D1 backup, migrations and deployment remain separately gated.
