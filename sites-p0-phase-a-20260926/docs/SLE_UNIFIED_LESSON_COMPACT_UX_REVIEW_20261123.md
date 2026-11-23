# SLE Foundation lessons — compact and consistent layout pilot

**2026-11-23 · Review Draft, not LIVE**  
**Reason:** The owner accepted the compact 14px Listening Dictation look but reported that regular Listening lessons use larger text, overly tall choices and excessive vertical scroll. The owner wants a consistent visual language across lessons, not a one-off Listening-only patch.

## Verified current implementation

Source `app/foundation.tsx` uses the same `foundation-question` fieldset for all skill lesson activities: a question prompt, `single_choice` radio options, or an answer textarea. Existing `app/globals.css` uses a ~16.8px legend, stacked radio option cards with at least 48px height, ~0.5rem vertical margins and generously spaced question fieldsets.

The user-approved `app/listening-dictation.css` displays content at about 14px. In this pilot, use that scale for the ordinary Foundation question and keep headings slightly larger.

## First visual-only iteration

- **All Foundation lesson skills:** prompt ~14.5px, answers ~14px, more compact fieldset/reading/learning notes, consistent whitespace.
- **Single-choice questions:** two option cards per row when Foundation panel width > 490px; one column when narrower. Cards retain at least **44px** height for touch. Longer choices (>72 source characters) span the full width automatically; no truncation, answer order preserved.
- **Listening:** compact explanatory wrapper and full-recording button, no new audio seeking/sticky panel. Keep all playback verification logic untouched.
- **Writing:** keep editable textarea at 16px to avoid iOS focus-zoom. Do not force long free-writing response panels into two columns.
- **Reading:** reduce body padding and font to 14.5px without hiding or collapsing the passage.
- **Dictation:** currently approved compact layout and 9/7/6 original MP3 turn playback stay completely unchanged.
- **Data:** same questions, option IDs, academic answer key, randomized option order, scoring/evidence, draft saves, playback completion requirement, transcripts, privacy and existing learner records.

**Out of scope:** Diagnostic test, specialist writing editor, custom Grammar Design Pilot, dashboard, learning content reordering, audio/transcript changes and Firebase configuration. These have distinct interfaces and must be reviewed separately to achieve full-site consistency.

## User-reported question order problem

Some late-listed Listening questions ask about information heard at the beginning of the recording. This is an **academic question-sequencing issue**, not a CSS one. This patch deliberately preserves source order to prevent invalidating attempt IDs or historical answers. A separate read-only audit should find questions whose order diverges from narration and recommend per-lesson changes for NotebookLM academic review; only versioned/content-compatible changes may later be imported.

## Acceptance gates

1. Source/static QA should pass on exact draft SHA, including unchanged source audio/attempt checks.
2. Real desktop browser: wide Foundation player shows **2 short answers per row**; long ones span; no overflow.
3. iPad portrait/split: uses available width; small width becomes **1 column** with no horizontal scrolling.
4. Radio/keyboard and previously saved drafts work unchanged. Touch targets >=44px, focus clearly visible.
5. Listening full-track still requires completion before scored submission; Dictation remains after submission only.
6. Writing iPad input remains 16px.
7. Visual review by owner on a Preview/QA screen; separate explicit authorization before any LIVE release.

Do not infer user approval of the updated layout from the previous acceptance of Dictation.
