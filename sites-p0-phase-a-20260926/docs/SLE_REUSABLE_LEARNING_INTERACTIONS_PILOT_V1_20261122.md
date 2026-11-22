# SLE Reusable Learning Interactions — Pilot v1 (2026-11-22)

**Scope:** Self-Learning English only; part of the existing unified SLE authoring → QA → approved release process, **not a new project branch of work**. Draft source, not deployed.

## Owner-approved goal
Move beyond an MCQ-only student experience by reusing simple, deterministic learning interactions across Vocabulary, Grammar, Reading, Writing, and Listening as appropriate to the learning outcome. Build each interaction as a reusable React primitive with independent instructional sample data, rather than copying an exercise-specific widget for every lesson. **No paid AI required to practise.**

## First implemented product primitives
1. **CardSortBoard** — responsive keyboard/iPad-touch-friendly native selectors; optional live *my choices* category board, then explicit **Check** to show each reviewed key/rationale. Selections remain controlled by the existing lesson draft. This is *not* drag and drop; do not advertise draggable cards until separately tested. Pilot: **FW-U02 Practice A** (six relevance cards) and **FW-U03 Practice A** (six claim/reason/detail/weak-link cards).
2. **ResponsePlanner** — a configurable ordered series of learner-authored fields plus on-demand read-only outline preview. Counts filled fields only, does not semantically grade writing or create/generate a response. Pilot: **FW-U03 Practice B** (two original Claim → Reason → Detail chains) and **Transfer** (two separate original chains). The existing exact input names are retained.

### Existing-review / data safety
- The 12 fixed cards, all keys, explanations, cases and authored FW-U02/U03 source JSON stay byte-identical.
- No new scored activities, answer keys, CEFR calculations, attempts, Firebase provider calls or content-version change. Fixed reviewed answer feedback continues to appear **only after Check**.
- The pre-existing `cycleASorts`, `cycleARoles`, `revealCycleA`, `chainA`, `chainB`, `transferA`, `transferB` field shapes and save/signature/reload protections are preserved.
- Shared controls have no persistence; parent lesson remains the only owner of answers and saves. No localStorage or browser network access inside primitives.
- Native controls are provided for touch, keyboard and assistive technology, with a layout that can collapse on narrow widths. Real physical iPad Safari still requires user acceptance.
- Original student responses remain unscored / optional saved-only AI review. The previews and field counts **are not proof of quality or proficiency**.
- The original academic Foundation Writing material previously passed NotebookLM. This PR changes only student presentation and preserves the fixed activity meaning; under SLE-MASTER-001 §9, no new academic packet is needed for unchanged educational content. If future cross-skill widgets add/change assessed meaning, independent review is required.

## Verification and gates
- `tests/learning-interactions-contract.cjs` registered in mandatory core QA: two components, old schema/fixture keys, no independent storage/grade, no premature answer reveal, no existing source changes.
- Extended real React/Chromium `foundation-writing-u02-u03-browser-entry.tsx`: control input, learner grouping, key reveal/re-edit, two ResponsePlanner instances, live outline from learner's own text, and existing Save/Reload/AI-click safeguards.
- PR → main runs the normal SLE `qa` job. TypeScript, static build and existing media and saved-learner regression must all pass on exact PR HEAD before any owner review.
- **Draft only**. Never self-merge or Firebase deploy; no Math/Auth, production learner data, curriculum imports or AI provider changes.

## Next controlled expansions (not part of this PR)
- Apply **CardSortBoard** to the independently reviewed B2-U08/U09 lessons after their runtime-version gates pass: `REA-B2-11`, `REA-B2-12`, `REA-B2-14` (independent model cards only; graded passages remain protected).
- Apply **ResponsePlanner** to `WRI-B2-10/11` with Claim / Evidence / Limitations / Counterclaim / Next action, without overwriting the approved Writing rubric or grading open text.
- Add **EvidenceHighlighter** for Reading and Vocabulary context; reuse documented text spans, not inference-score by simple string matching.
- Separately deliver **Dictation** using existing SLE MP3 + verified sentence offsets for any eligible Listening lesson (Issue #209); no TTS replacements, leaked scored transcript, or automatically certified listening/CEFR levels. Karaoke/Shadowing are later enhancements.
