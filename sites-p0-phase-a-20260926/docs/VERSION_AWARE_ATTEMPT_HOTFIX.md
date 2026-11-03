# Version-aware current practice hotfix

Baseline: deployed Sites v27 `0a84b8f889102192eed0f3f29958d8fea0d40fb4`; GitHub PR24 checkpoint `960eb41a64a217babdf3472e6684109b38ffc4b5`. Foundation UI and attempt-navigation baseline files match.

Scope: older saved attempts disclose original/current content versions; continue and result actions retain the selected record; submitted Writing revisions retain parentId; separate current-practice action creates a root without parentId. Old scored/unassessed work offers current practice without a duplicate retake. Same-version UI stays simple. History shows root/revision and stored content version.

No academic-service or persistence changes. Existing save-before-leave remains. A root creation waits for confirmLatestDraft for a started draft; save failure prevents creation. No historical regrading, curriculum import, database migration or authentication change.

Validation: new version-aware-attempt-ux test plus academic, content-quality, curriculum, attempt-navigation-ui, ux-v20-lesson-navigation, v20-route-draft-safety, writing-nav-save-feedback, writing-tutor, course-v21-p1, practice-progress-p2a, foundation-results-ux, foundation-coaching, listening-retake-audio-readiness, listening-submit-feedback and run PASS. TypeScript and production build PASS.

Release gate BLOCKED: supervised preview shows Sign in to save progress and Sign in to view practice progress. Valid Sites learner identity is unavailable at the preview origin. No identity bypass attempted. No QA root created and no historical owner attempt changed. Owner-specific historical/current UI path remains unverified, so do not deploy under the current authorization.

Required QA: WRI-A2-01 historical content1.0.0 has3 activities, unchanged answers/history; explicit current practice creates separate root content1.5.0 with7 activities; no submission needed. VOC-A2-01 and REA-A2-01 each11. Test old draft save failure prevents root creation; history versions; same-version simple actions; desktop/mobile controls. Snapshot historical record before/after.

Rollback application: exact saved Sites v27 source above; code-only rollback, preserving imported curriculum1.5.0 and learner records.
