# GitHub-first G2 — Backup / Restore before Static Pages

Status: **BACKUP/RESTORE IMPLEMENTED — STATIC PARITY NEXT**

Date: 2026-10-04  
Baseline curriculum: **1.11.0**

## Why backup comes before GitHub Pages

Browser-local progress is useful only if the learner can carry and recover it.

Before enabling a static GitHub Pages build, browser mode must provide:
- learner-controlled export;
- validated restore preview;
- no silent overwrite;
- explicit target identity;
- automatic pre-restore safety backup;
- deterministic round-trip tests.

## Reused portability core

G2 does not create a second learner-data format.

It reuses:
- `application/export-learner.ts`;
- `application/restore-learner.ts`;
- `domain/portable-data.ts`;
- existing repository contracts;
- browser-local Learning and Academic repositories.

Current file name:
`g-learning-english-backup-v1.json`

The underlying schema remains backward-compatible:
`ai-english-tutor.learner / schemaVersion 1`.

The historical schema identifier is intentionally not renamed because it is a data compatibility contract, not product branding.

## Browser restore rules

Local restore:
1. accepts at most 5 MB of JSON;
2. validates the portable envelope;
3. previews state/evidence/assessment/snapshot/academic-attempt changes;
4. never uses `learnerId` from the file to choose the target profile;
5. targets the explicit local browser scope `local-family / primary`;
6. refuses different existing learner state;
7. refuses conflicting immutable evidence, assessment or attempt IDs;
8. requires the exact preview token plus explicit confirmation;
9. creates a complete pre-restore backup before mutation;
10. exact repeated restore is idempotent.

Server/admin restore keeps its stricter historical learner-ID check by default. The identity bypass exists only when the caller explicitly requests local target-owned mapping.

## UI

Browser mode exposes **Backup & restore** in Parent View.

The learner/family can:
- Export backup;
- choose a JSON backup;
- inspect a non-mutating restore preview;
- restore only when the preview is conflict-free.

After a successful restore, the automatically created pre-restore safety backup is downloaded and the app reloads.

## G2 backup acceptance gate

Automated QA proves:
- state and unknown legacy fields round-trip;
- academic attempts round-trip;
- source learner identity cannot redirect the target;
- default/server identity validation remains strict;
- exact second restore is safe/idempotent;
- conflicting local state is rejected before mutation;
- malformed/unsupported/oversized backups are rejected;
- production build and all G1 browser-runtime regressions still pass.

## Static parity remaining work

Do **not** turn on `output: "export"` yet.

Current direct server dependencies still to reconcile for browser mode:
- My Courses selection (`/api/course`);
- Diagnostic submission (`/api/diagnostic`);
- capabilities/admin-only routes;
- server-only admin/review utilities.

Next order:
1. move My Courses selection to browser-local state;
2. move deterministic Diagnostic objective path to browser services;
3. hide/replace server-only admin functions in static mode;
4. add a dedicated static-build configuration;
5. add GitHub Pages build/deploy workflow;
6. run mobile/offline/static parity QA.

No Sites/D1 data is mutated by G2 browser backup QA.
