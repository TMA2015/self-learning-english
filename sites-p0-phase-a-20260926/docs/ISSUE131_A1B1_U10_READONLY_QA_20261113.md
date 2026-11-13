# Issue #131 — A1/B1 Unit10 read-only transfer summary

Status: DEVELOPMENT PASS WITH BROWSER BLOCKERS; Draft review only. No production approval.

## Source and academic provenance

- Base main: `4e727310cecd2ae5107134f08a804f64c10c42db` (rechecked remotely before implementation).
- Standard: canonical `SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md`, SLE-MASTER-001 v1.2.0. Its historical release counts do not override the current package.
- Technical handoff: `SLE_A1_B1_U10_READONLY_TECHNICAL_HANDOFF_20261113.md` (Library file `libfile_9fce6d29652c8191b672d49ac0557d98`).
- Original packet: `SLE_UNIT10_A1_B1_TRANSFER_SUMMARY_NOTEBOOKLM_R2_20261113.md` (Library file `libfile_4a7e750745a88191865fddef7a2e160d`), packet ID `SLE-U10-A1B1-TRANSFER-SUMMARY-R2-20261113`.
- Owner supplied ACADEMIC PASS / no required corrections. Original packet remains a pre-review proposal; the owner verdict and handoff supply its subsequent review status.
- EXACT_COPY_RECONCILIATION: PASS. Both pre-start paragraphs and all eight repair strings extracted verbatim from sections 5.2–5.3. Only the approved `*if*` emphasis is rendered as React `<em>`. No reviewer-only scripts, keys or assessment inventory copied into this overlay.

## Scope and read-only schema

A1-U10: REA-A1-05, LIS-A1-06, WRI-A1-05. B1-U10: REA-B1-07, LIS-B1-08, WRI-B1-08. No inferred IDs or fallback to another Unit.

The new domain projection consumes existing catalog and AcademicAttempt values. It adds no persisted schema or write path. It selects the latest saved submission separately from unfinished drafts and exposes the saved content version. Missing catalog entries cannot be opened by the recommendation. Stored objective booleans are deduplicated, excluding null and format-only outcomes. Writing contributes zero objective counts and evidence weight zero; approved status alone is insufficient to claim trusted review without an adult-review record.

The recommendation reopens the exact saved attempt when reviewing mistakes, or the draft when resuming. The three normal Unit lesson buttons and existing guards remain unchanged. Repair copy is gated on the corresponding lesson's saved submission; draft-only Writing does not reveal post-submit guidance. Both complete objective result sets (4 Reading / 5 Listening) are required for the final Writing reminder. No Unit score, new grading, mastery threshold, CEFR certification, transcript or answer key is introduced.

## Validation on the proposed source tree

| Gate | Result |
|---|---|
| A1/B1 synthetic projection and React SSR | PASS, 36 checks |
| Existing A2-U10 regression | PASS; domain and test byte-identical |
| Unit guide canonical navigation | PASS (historical fixture reports 132; current schema gate below reports 154) |
| v1.25 reviewed schema/source parity | PASS, 154 lessons / 1,125 activities |
| Version-aware attempts | PASS |
| v1.25 synthetic storage upgrade | PASS; 73 historical attempts preserved, quota failure closed |
| Direct review/navigation contract | PASS |
| Listening submit + retake readiness | PASS |
| Unit10 receipts, staged manifest | PASS metadata, source and bytes; not playback evidence |
| Strict audio rights | PASS, 44/44 approved |
| TypeScript | PASS (fixed an inference-only unit ID narrowing error in new module) |
| Firebase static build | PASS |
| Firebase static/security gate | PASS, 44 audio assets; no direct Gemini secret emitted |
| MEDIA-01 real browser | BLOCKED: Chromium could not start |
| Actual browser layout at 320px, keyboard interaction | NOT_TESTED |
| Real iPhone/iPad Safari | NOT_TESTED |

Exact browser blocker: `FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`; subsequent `ptrace: Operation not permitted`. No security bypass attempted. SSR verifies rendering and disclosure gates, not real browser behavior. Responsive rules wrap text/buttons; visual acceptance is still pending.

## Preservation

Curriculum v1.25.0 SHA-256: `a002a2009049555555a5e8d42777f7038301141f575564602049aced49c835ea`. All 44 MP3 files compared byte-for-byte against base main and unchanged. Curriculum package, audio manifests, A2 projection/test, grading, academic service and storage implementation are not edited. Only synthetic in-memory fixtures were used; no learner import, mutation or real AI request occurred.

## Remaining owner/release gates

Run the exact Draft HEAD in a browser-capable environment: A1/B1 missing-source, blank, draft, saved-wrong, retake and trusted-review states; reopen the correct historical version; verify 320px width and keyboard navigation; verify real Listening playback/transcript enforcement via MEDIA-01. Confirm A2 unchanged visually. Real Safari remains separate. Do not infer release approval from academic PASS or local static QA.

No GitHub Actions manually triggered; commit uses `[skip ci]`. No merge, deployment, Firebase/security/billing changes, curriculum/audio edits or learner writes. Final exact commit and Draft PR are reported in the handoff response to avoid self-referential commit hashes in this file.
