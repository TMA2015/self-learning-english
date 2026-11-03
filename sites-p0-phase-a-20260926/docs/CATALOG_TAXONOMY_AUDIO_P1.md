# Self-Learning English — Catalog grouping & Listening audio QA (source-only handoff)

Date: 2026-09-27. This is a proposed **application/UI improvement**, not a curriculum import or Site release.

## Verified starting point

- Existing private Self-Learning English Site is on v12, with owner-confirmed curriculum 1.2.0 import: Add 8 / Update 0 / Skip 21 / Conflict 0; export of 29 lessons is available.
- The owner-provided live export `foundation-1.2.0.json` was compared locally to the exact `curriculum-1.2.0-safe-import.json`: parsed JSON equals; 29 lessons, 190 unique activities. Different raw-file SHA-256 reflects serialization/formatting only. Do not reimport.
- The exact content source-of-truth is `content/releases/curriculum-1.2.0-production-import.json` from Draft PR #7, **not** the historical candidate JSON.
- This branch derives from `curriculum-v12-production-reconcile-20260927` (PR #7); it must not merge PR #7 or any other PR merely to deploy the Site.
- Source audio manifest `content/foundation-audio.json` points to two existing v1 MP3 files. Their first MPEG audio frames identify MP3 MPEG-2 Layer III, 16,000 Hz mono, 64 kbps. This is a low-fidelity source setting, but no listening/acoustic diagnosis of clipping or distortion has been completed.

## Metadata: `content/lesson-groups-v1.json`

- External, non-invasive catalog metadata. Seven skill domains; every current lesson has exactly one **primary** group and a stable ID. The active curriculum is immutable.
- The group and CEFR are independent filters; the recommended learning order is still `course.sequence`. Never use catalog groups to imply a formal prerequisite, mastery, CEFR certification, or a locked course.
- Show grouping in Grammar now. For other skills, use grouping only where there are >=4 lessons and >=2 nonempty groups; otherwise keep the current simple cards/CEFR filters. Empty future groups remain hidden.
- Display English title by default; Vietnamese title only under Vietnamese Support.
- Render compact collapsible sections with lesson count, clear progress indicator when actual measured progress is available, stable keyboard/focus behavior, and unchanged lesson links.
- Preserve existing score summary, fast skill-tab navigation, open-response review, AI tutor and learner state.

## Audio regeneration, not superficial transcoding

Affected lessons:
- `LIS-A2-01`: `AUD-LIBRARY-A2`, old URL `/foundation-audio/LIS-A2-01-v1.mp3`, reported duration 24.804 s.
- `LIS-B1-01`: `AUD-COMMUTE-B1`, old URL `/foundation-audio/LIS-B1-01-v1.mp3`, reported duration 40.032 s.

Generate genuinely new, clean speech directly from the **unchanged exact script** in the immutable production snapshot. Distinct voices for Woman/Man and Host/Guest. Prefer age-appropriate, clearly articulated, natural, accent-consistent English; conversational turn breaks, not one flat voice. Do not add music, distracting noise or effects. Do not use a TTS/transcode pipeline that merely upsamples the current 16 kHz MP3 or changes its header. No new paid service/API key without owner's approval.

Suggested final delivery: MP3, original-quality source >= 44.1 kHz where available, 128–192 kbps (or comparable transparent speech encoding), peak below -1 dBFS/true-peak-safe, natural consistent loudness and no audible clipping, distortion, harsh sibilance or robotic artifacts. Technical settings alone do not establish listening quality; **human listening QA is required**. Provide downloadable v2 samples for owner review before switching production.

For each regenerated file:
1. Validate every word, number, negation and speaker turn against `audio_asset.source_text`; no paraphrases that change answer evidence.
2. Listen on headphones and ordinary laptop/mobile speakers at normal and reduced playback speed.
3. Verify accurate elapsed duration with `ffprobe`; the signed-out/stale cached v1 URL must not accidentally be served as v2.
4. Keep old files for rollback and introduce versioned v2 URLs in `content/foundation-audio.json` **only after approval**. Set accurate durations and keep source text exact.
5. Maintain the existing no-audio/no-credit rule, no transcript before submission, and completed-playback guard. Run full playback, replay and speed-change regression tests; don't claim a listening score solely from button clicks.

## Other screenshot issue

The owner screenshot shows visible header **AI English Tutor** even though the private Site is named **Self-Learning English**. Before implementing branding corrections, determine whether this is stale browser assets or actual deployed UI. Do not change Site project ID, URL, private access settings, auth or DB binding. Fix app branding only if the current deployed build truly differs.

## Required validation / no-production-change boundary

- Verify manifest coverage against the 29-lesson production snapshot, exactly one group/lesson; reject unknown/duplicate IDs; verify module and bilingual label; keep category empty-state and navigation accessible.
- Run existing academic/content, coaching, result/tab, and full application suites plus production build. Independently validate the exact v2 audio, timing and mobile/browser playback.
- Do not mutate curriculum `1.2.0` or D1, don't import/migrate/reset, don't alter learner profiles or attempts, don't create a new Site and don't deploy a new Site until owner approves the proposed changes and audio samples.
