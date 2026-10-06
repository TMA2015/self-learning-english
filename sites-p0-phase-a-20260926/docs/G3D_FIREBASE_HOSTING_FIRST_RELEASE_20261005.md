# G3-D Firebase Hosting first-release gate — 2026-10-05

Status: **READY FOR AUTHENTICATION — PREVIEW ONLY**

## Target

- Firebase project: `roadmap-toan-ai` / G-Learning
- Hosting deploy target: `english`
- Hosting site: `g-learning-english`
- Build output: `dist/client`
- Source repository remains private.
- No live deployment is authorized by this workflow.

## Multi-site safety

The repository uses a Firebase Hosting deploy target so the English workflow cannot accidentally deploy to the default Math/project Hosting site:

- `.firebaserc`: `english -> g-learning-english`
- `firebase.json`: `target: english`

## Preview workflow

`.github/workflows/g3-d-firebase-hosting-preview.yml` is manual-only (`workflow_dispatch`).

It:
1. installs frozen dependencies;
2. runs the Firebase browser contract;
3. runs the regression suite;
4. runs TypeScript;
5. builds the static browser/local artifact;
6. deploys only target `english` to preview channel `g3-d-first-release`.

The workflow requires one GitHub Actions secret:

`FIREBASE_SERVICE_ACCOUNT_ROADMAP_TOAN_AI`

The secret must contain the Firebase/GCP service-account JSON used only for Hosting deployment. Do not commit the JSON file to this repository.

## Owner gate after preview exists

Before any live release:
- open the preview URL;
- verify Home/Catalog/Curriculum/Foundation/Listening/Writing;
- verify local save survives reload;
- verify one App-Check-protected Writing AI request;
- verify deterministic Writing feedback still works when AI is unavailable;
- confirm no Math Hosting site was modified.

Only after owner QA passes should a separate live deployment workflow be introduced or authorized.
