# GitHub-first G2 — Local Data Portability + Static Pages Parity

Status: **TECHNICAL CHECKPOINT PASS — PUBLICATION NOT YET AUTHORIZED**

Date: 2026-10-04  
Baseline curriculum: **1.11.0**  
PR: **#42**  
Validated head before publication decision: `3f7cb5bbcb02fe2e8961ed5cdf40bf257b4e02a8`

## Acceptance result

All ten PR workflows pass:
- GitHub-first G2 Backup QA;
- GitHub-first G2 Static Export QA;
- GitHub-first G1 Local Runtime QA;
- GitHub-first Free Platform QA;
- Writing navigation and draft feedback;
- Learning Evidence v21 P2A;
- Course v21 P1;
- Focused Foundation player;
- UX v20 Lesson IDs/navigation;
- G Learning English branding.

## Browser-local capabilities now working

The GitHub-first browser runtime can operate without Sites/D1 for the core learner path:

- Curriculum 1.11.0;
- deterministic Grammar/Vocabulary/Reading;
- real MP3 Listening with playback-before-score safeguards;
- learner evidence and progress ledger;
- My Courses selection with isolated revision/idempotency state;
- adaptive Diagnostic objective scoring;
- Diagnostic Writing remains **Not assessed** without AI;
- 12-week Writing analysis/brainstorm/outline/draft/revision guided path;
- deterministic Writing mini-practice;
- Parent View;
- learner JSON backup/restore.

## Backup / restore contract

File:
`g-learning-english-backup-v1.json`

The historical internal envelope remains:
`ai-english-tutor.learner / schemaVersion 1`

This identifier is retained for backward compatibility; it is not product branding.

Browser restore:
1. limits JSON to 5 MB;
2. validates the portable envelope;
3. previews state/evidence/assessment/snapshot/academic-attempt changes;
4. never trusts source `learnerId` to choose the target profile;
5. preserves active-course selection;
6. blocks different target learner state;
7. blocks conflicting immutable record IDs;
8. requires the exact preview token plus explicit confirmation;
9. creates a pre-restore safety backup before mutation;
10. makes exact repeat restore idempotent.

Server/admin restore keeps its stricter historical learner-ID rule by default.

## Static export

The app now has a dedicated static build profile:

- `GITHUB_PAGES_EXPORT=1`
- `NEXT_PUBLIC_LEARNING_RUNTIME=browser`
- `NEXT_PUBLIC_BASE_PATH=/<pages-project>`

The static profile:
- avoids Sites/Cloudflare Worker runtime;
- prerenders the root learning route;
- skips server-only API routes;
- prefixes framework/public/audio/brand assets with the configured project path;
- stages one flattened GitHub Pages artifact;
- includes `.nojekyll`;
- includes all 5 current Listening MP3 files;
- scans staged text assets for Google/OpenAI key-shaped secrets;
- verifies no duplicated project path.

The base path is parameterized. It can target either:
- the current repository name, if private GitHub Pages is available for the account; or
- a separate public artifact-only repository, if free Pages requires public visibility.

## Security / data boundary

Static publication contains curriculum, UI code and public audio assets only.

It does **not** publish:
- learner localStorage data;
- learner backups;
- D1 data;
- API keys;
- Firebase/Gemini secrets;
- authenticated Sites data.

No Sites/D1 production mutation is part of G2.

## Publication boundary

No public repository has been created and no GitHub Pages site has been published by this checkpoint.

GitHub documentation states:
- public repositories can use Pages on GitHub Free;
- private repositories require GitHub Pro/Team/Enterprise for Pages.

Therefore publication is intentionally a separate owner-visible decision because a public artifact repository would make the static learning site publicly reachable even though the source repository remains private.

## Next work after publication choice

1. publish the validated static artifact using the chosen Pages target;
2. perform owner QA on desktop + iPad/iPhone;
3. add optional shared Gemini gateway for Writing/Speaking assistance;
4. keep deterministic learning functional when AI is unavailable.
