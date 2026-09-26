# P0 archive independent verification — 2026-09-27

Status: **static artifact integrity and GitHub asset matches passed; runtime learner testing and production release remain unverified**.

## Uploaded archive
- Received filename: `p0-phase-a-20260926.tar(1).gz` (local duplicate suffix is not a change in archive identity).
- Expected artifact name in Work report: `p0-phase-a-20260926.tar.gz`.
- File size: **1,132,027 bytes**.
- SHA-256: `d60027d83f85bea2954b594763d28f7c9f814a482666ec47608351e796f1f446` — matches Work's Phase A report and `PHASE_A_CHECKPOINT.json`.
- Gzip integrity: passed.
- Tar entries: 126 total, 106 regular files, 20 directories; no symlinks/nonregular types, no duplicate entries, no absolute paths or path traversal.
- Top-level archive directory is `dist/`. No learner database, `.env`, secret or learner-record paths observed.

## Key contents
- Vite server manifest resolves `app/api/foundation/route.ts`, `app/api/diagnostic/route.ts` and `app/api/admin/foundation-reviews/route.ts`.
- Server bundle includes distinct Assessment validation feedback and Foundation login message. Client bundle includes Foundation Demo and API request paths. Temporary `batch_a_role` and `batch-a-check` strings were not found in compiled JS.
- Both static Foundation MP3 assets exist.
- Production migration files `0004` and `0005` are present. SQL inspection: 0004 creates `assisted_review_packets` and `writing_approvals`; 0005 creates `academic_attempts`, `academic_packages`, then inserts seed instructional content. Neither file contains a destructive DROP/DELETE/TRUNCATE/ALTER/UPDATE SQL statement.
- Both SQL files and both MP3 assets have exactly the **same Git blob SHA-1** as the corresponding files on checkpoint commit `2c9bcc0ccdfb0b266134613d4c268abbde3ab8c3`.

| Artifact member | Git blob SHA-1 (matches checkpoint source) |
| --- | --- |
| `dist/.openai/drizzle/0004_jittery_wendell_vaughn.sql` | `ec7245001ada55a109d3fc395c52544518e3251d` |
| `dist/.openai/drizzle/0005_lonely_kitty_pryde.sql` | `5e1faba1542390dab2d5227f2ca5c7510d753c53` |
| `dist/client/foundation-audio/LIS-A2-01-v1.mp3` | `f807fdb98df8052fa4a7b0fbd330926235cc715b` |
| `dist/client/foundation-audio/LIS-B1-01-v1.mp3` | `9181ef4d347ddc3682559442ce401c068f664da8` |

## Not established
Static archive checks do **not** verify that all JS functions behave correctly, that a signed-in learner can finish the flow, or that Site-hosted authentication works after deployment. This archive has not been published to the Site and does not contain a live D1 backup. Version 6 remains production until separately verified otherwise. The real learner's Assessment HTTP 400 is unresolved.

## Next gate
Do not request a new build without a source change. Preserve this original checksum. Run a focused authenticated end-to-end flow only in an available supported isolated loopback environment, or record the coverage gap for the owner's manual check after an explicitly authorized release. Production migration/deployment still requires a separate decision about incomplete D1 backup/recovery and risk acceptance. Never present a code rollback as a database backup.
