# Self-Learning English v14 follow-up: Writing navigation and draft-save confirmation

Scope: app presentation and existing draft-save feedback only. No curriculum import, schema/D1 operation, auth change, audio regeneration, separate Site, or PR merge. This branch starts at the approved **v14 GitHub checkpoint** `578186add8d1da567820fef4f1cd3a7a573ef639`; the deployed Sites source SHA reported by Work is `926a20dfb0941ec86d4d46f2bbb33e7e06cd688c`.

## Owner screenshots

1. Writing shows the existing 12-week Writing Coach dashboard **before** the seven skill-navigation cards; other skill views put the cards near the top.
2. Foundation practice draft restoration succeeds, but no clearly visible save confirmation appears by the Save draft button; generic header "Saved across devices" is not proof that the current Foundation response has been saved.

## Source changes

- Retain the separate 12-week Writing Coach and its progress. Render it as an optional compact catalog section **after** the shared seven-card skill navigation, but **before** Writing's lesson catalog. Never repeat its hero above the learner's selected lesson Overview, Practice or Results. Existing Writing week buttons still navigate to their existing 12-week routes.
- The Foundation draft has explicit visible feedback near the player header and Save draft/Submit controls: dirty, saving, server-confirmed saved local time, restored, and save failed with manual retry. Confirmation occurs **only after** the `/api/foundation` draft request succeeds, and only when its captured revision still matches the latest learner input. Server writes are serialized so an older autosave cannot overwrite a newer draft. An unsuccessful request must never display a successful-save timestamp.
- Preserve successful draft-before-leave behavior and the exact single-refresh v14 skill transition guard, versioned read-only submitted results, Writing review, Listening playback/evidence safeguards and G Learning branding.
- Header "Saved across devices" belongs to other app state. Do not change it into an invented Foundation save confirmation.

## Owner acceptance after controlled release

1. Open Writing: seven skill cards appear first, then the 12-week Writing Coach and Writing catalog; no duplicate large Writing heading. Open a Writing lesson: only Overview or Practice, not the 12-week dashboard above it.
2. Open Grammar and enter a response. See "Unsaved changes", "Saving draft…" and then "All changes saved · [local time]". Do not see saved confirmation before the server responds.
3. Save draft manually; change skills using the sidebar and seven cards; return and resume the same response. No duplicate Catalog request regression. Recent Work remains skill-scoped.
4. Simulate a failed draft request in a safe test environment: show "Save failed · Retry save" and do not navigate away as if the draft had been saved.
5. Check small-screen and desktop layouts. Submitted work remains read-only; no automatic restart or changed score.

Repository/CI checks are not substitutes for authenticated browser QA. Stage/validate before owner-controlled deployment; production stays v14 until approved.
