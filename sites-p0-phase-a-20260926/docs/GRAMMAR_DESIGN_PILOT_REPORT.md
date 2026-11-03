# Grammar Lesson Design Integration Pilot — Phase 1

Status: focused automated QA and static build PASS; OWNER VISUAL QA PENDING. No deployment.

## Verified inputs
- Q2A ZIP: ca6255aa19c009bfb0443d68b904b77898100dad6b41276b7958656830719e77; 500 internal checksums PASS.
- Approved 40-lesson ZIP: 2b9a710670ed8d652991b8274ef4b3512f07477c45bde46d946fc36e352ec97f; both internal checksums PASS.
- Exactly 40 unique Grammar IDs: A1 12 / A2 16 / B1 12. IDs, baseline goals and all 40 canonical lesson hashes match 1.15.0.
- Recorded source packet digests and PASS verdicts retained. Original NotebookLM review packets were not supplied; their digests cannot independently be recomputed here.

## Preview design and isolation
Open /grammar-design-preview.html on the local static server. Three lesson choices only: GRA-A1-01, GRA-A2-11, GRA-B1-10.
Four core sections: learning goals, core meaning, usage, worked examples. Adaptive sections show the authored patterns, relative-clause distinctions, common mistakes, decision guide and reminders where supplied. No invented teaching content.
Vietnamese Support is off by default and opt-in. Text-only Markdown subset renders emphasis, lists, accessible tables and cards; no executable HTML. Responsive single-column layout below 700px; wide tables scroll within a labeled keyboard-focusable region.
The explicit preview ID grammar-design-pilot-v1 is bound to baseline 1.15.0 and its raw hash. No curriculum version was created or imported. The preview has no storage/API/AI calls, no assessment activity payload and no connection to attempt progress. All normal lesson screens remain unchanged. The other 37 designs are archived for provenance, not activated or imported into the renderer.

## Editorial projection
Three reviewer/operational fragments are omitted from learner display, recorded verbatim in GRAMMAR_PILOT_PROVENANCE.json:
- A2: parenthetical note identifying an example as not the assessed gap-fill.
- A2: sentence saying grading policy will be decided separately.
- B1: instruction to assess which examples should be included for B1.
Academic rules/examples otherwise retained; the original approved JSON remains unchanged in docs/reviews.

## Build compatibility
Initial nested-route export failed with RSC 308 under trailingSlash:true. Static-export next.config.ts now uses trailingSlash:false, emitting grammar-design-preview.html. The existing root index.html still emits correctly. Firebase files are unchanged. Non-static configuration is unchanged. This is a source-only preview; future Hosting clean-URL behavior needs its separate release check.

## QA
PASS grammar-design-pilot.cjs: all 40 IDs/goals/hashes; exactly 3 pilot records; 6 EN/VI server renders; core/adaptive structure; opt-in VI; no reviewer notes, assessment IDs or original prompts in lesson render; no storage/AI calls; responsive/accessibility source assertions.
PASS q2a-shared-ux: 21 seven-skill guard scenarios + 7 assertions.
PASS v20-route-draft-safety: 18 destinations, latest revision, rapid navigation, failed-save retry.
PASS attempt-navigation-ui.
PASS TypeScript --noEmit --incremental false.
PASS local static build after the documented export correction.
PASS Firebase static/security QA: 14 audio files; intended public Firebase key allowlist; no detected private key/service-account/direct Gemini key shapes.
PASS preview prerender, English-only default, no assessment IDs/key fields, local static resource references.
No full aggregate QA rerun. No browser visual PASS claimed.

## Preservation
Curriculum raw SHA256: 981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426
Canonical SHA256 remains 66663bb61cf60b266d25e8abd890e81ad27398d3ebee9b7cd5cd211de878b1e8.
All 14 MP3 files byte-identical. Grading, Error Bank, progress, historical attempts, audio runtime, Q2A guards and Gemini source untouched. No learner data read/written by the preview.
This remains a static/local app: hidden assessment data in the ordinary app UI is not a security guarantee against inspecting the baseline offline bundle. The new preview itself includes instructional content only.

## Windows visual review
Extract the build ZIP. Double-click START_GRAMMAR_PREVIEW.cmd (requires existing Python; no package installation). Open http://127.0.0.1:8765/grammar-design-preview.html . Keep terminal open; Ctrl+C stops it. Do not open via file://.
1. Switch among all three lessons; verify hierarchy and text.
2. Toggle Vietnamese Support; English remains primary.
3. Check desktop, 768px and 390px widths and browser zoom; tables should scroll internally without page overflow.
4. Tab through controls/table regions; check visible focus.
5. Confirm no assessment question IDs, reviewer inventories, or answer-key panel appears.
6. Confirm ordinary homepage still opens at /. Use an isolated browser profile for any normal app checks; do not invoke AI.
Stop for visual approval before the remaining 37 lessons. Rights clearance, authentic main ancestry and release/browser gates remain separate.

No GitHub Actions, commits, pushes, merges, deploy, Firebase changes, real AI or billing changes.

## Exact changed-file inventory (relative to source ZIP root)
- sites-p0-phase-a-20260926/app/globals.css
- sites-p0-phase-a-20260926/next.config.ts
- sites-p0-phase-a-20260926/app/grammar-design-preview/page.tsx
- sites-p0-phase-a-20260926/app/grammar-design-preview/preview.tsx
- sites-p0-phase-a-20260926/content/design-previews/grammar-pilot-v1.json
- sites-p0-phase-a-20260926/docs/reviews/GRAMMAR_PILOT_PROVENANCE.json
- sites-p0-phase-a-20260926/docs/reviews/grammar_40_approved_lesson_design.json
- sites-p0-phase-a-20260926/tests/grammar-design-pilot.cjs
- sites-p0-phase-a-20260926/docs/GRAMMAR_DESIGN_PILOT_REPORT.md
