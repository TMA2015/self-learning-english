# Foundation focused player / recent attempt UX — v13 follow-up (source only)

Owner report: v13 lesson catalog sits above the full lesson notes and quiz, producing extensive scrolling. Switching skill tabs clears the visible selection. Starter route's "Attempt saved" labels refer to predefined sample lesson IDs, not the learner's most recently selected lesson.

## Implemented behavior

- One active view at a time: Catalog → Lesson Overview → Practice/Results, within the existing single Site. No tab or Site identity change.
- Catalog includes skill-scoped Recent work from versioned server attempt records, plus clear per-lesson status badges. Other skills show only their own work; no duplicate-counting multiple attempts as multiple lessons.
- The seven Starter route cards select skill catalogs, not old sample lesson records. Their subtitle counts distinct tried lessons and does not imply CEFR attainment.
- Clicking any lesson opens a dedicated Overview, with its learning goals/rule/examples and explicit Start/Continue/View saved result; Practice omits the catalog and redundant overview above the quiz.
- An old scored attempt is read-only; Retake or revision creates a separate attempt. Explicit history stays per lesson; next step follows existing `course.sequence`.
- Returning to Catalog or switching skill calls the existing server saveDraft for a started attempt before leaving. On error stay in the current lesson with an alert. Server source, D1 schema, auth, curriculum 1.2.0, audio and assessment behavior unchanged.

## Owner acceptance and risk

1. Open **There is and there are** from Grammar. Confirm its Overview appears at the top without the entire catalog above it. Start; practice begins near the top.
2. Submit it; confirm current result. Switch to Reading then return; Recent work shows this very lesson, not the Starter sample GRA-A1-01; choose it and select View saved result.
3. Start a draft, type a response, switch skills, return; Recent work shows Draft · Resume with the original text.
4. Confirm 7 skill cards navigate to their own skill catalogs; A1/A2/B1 filtering still works. Check desktop and mobile.
5. Check version-aware history; older scores never silently become new attempts. Writing review remains pending, Listening guard and audio unchanged.
6. If save fails while returning to Catalog or switching via the seven cards, stay in the lesson and expose failure.

Scope is deliberately UI/read-only selectors. Global sidebar skill transitions now save draft **and refresh the server-backed Catalog** before clearing the selected lesson, covering the exact Grammar → Reading/Writing → Grammar navigation reported by the owner. A failed refresh preserves the loaded lesson and shows an error; browser behavior under a denied save/refresh still needs authenticated QA. No authenticated learner-browser QA has been performed in this repository-only pass. Do not deploy until CI, owner review and a controlled Site release are authorized.

## Staged QA after v13 source reconciliation (2026-09-27)

- Existing private Site remains v13, source `a0835699e878e0d41bb4fd6902848fc7e8bdea22`. This branch was staged against that source; no Site version was saved or deployed.
- Corrected a stale Catalog cache after saving a draft: returning to lessons or switching skills now refreshes Recent work after a successful draft save. With no active draft, normal skill navigation continues to reuse the cached catalog. Updated the old Batch 02 regression assertion to recognize the focused skill navigation label.
- Attempt navigation, branding, Catalog, Foundation results/coaching, content quality, Batch 02, curriculum coverage, application and academic checks passed. The managed Linux production build passed.
- Desktop preview rendered the existing Site shell and skill navigation. Its Foundation API returned `Sign in to use your learning path.`; therefore lesson opening, saved attempts, read-only submitted results, draft restoration, and authenticated skill-scoped Recent work remain **OWNER PENDING**. Mobile browser interaction also remains **OWNER PENDING**. Responsive CSS and navigation structure were inspected, but this is not a substitute for learner browser QA.
- Curriculum 1.2.0, learner records, authentication, D1 binding, Writing review, Listening audio and G Learning assets were not changed. No D1 action, import or deployment was performed.
