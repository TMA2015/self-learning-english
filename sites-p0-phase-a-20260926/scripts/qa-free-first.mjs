import {spawnSync} from "node:child_process";
import path from "node:path";

const mode=process.argv.includes("--core")?"core":"full";
const root=process.cwd();

const coreTests=[
  "typescript-syntax.cjs",
  "run.cjs",
  "academic.cjs",
  "pedagogy-v1181.cjs",
  "speaking-prep-stage3.cjs",
  "stage3-notebooklm-remediation.cjs",
  "sle-release-safety.cjs",
  "speaking-notes-stage3.cjs",
  "ai-tutor-stage3.cjs",
  "ai-tutor-language-stage3.cjs",
  "ai-tutor-stale-request-stage3.cjs",
  "ai-tutor-markdown-stage3.cjs",
  "listening-option-order-stage3.cjs",
  "stage3-import-preview.cjs",
  "stage3-browser-storage-compact.cjs",
  "stage3-quota-readonly-fallback.cjs",
  "storage-retention-v2.cjs",
  "local-recovery-v2.cjs",
  "restore-v2-auto-retention-quota.cjs",
  "storage-chromium-smoke.cjs",
  "storage-ui-browser.cjs",
  "content-quality.cjs",
  "version-aware-attempt-ux.cjs",
  "practice-progress-p2a.cjs",
  "github-first-browser-storage.cjs",
  "github-first-g1-local-runtime.cjs",
  "browser-curriculum-upgrade.cjs",
  "automatic-curriculum-v120.cjs",
  "github-first-g2-backup-restore.cjs",
  "github-first-g2-course-selection.cjs",
  "github-first-g2-local-diagnostic.cjs",
  "g3-firebase-ai-provider-contract.cjs",
  "g3-firebase-browser-bridge.cjs",
  "listening-audio-manifest-coverage.cjs",
  "legacy-listening-kokoro-repair-preflight.cjs",
  "writing-step-feedback-ux.cjs",
  "pronunciation-runtime-audio.cjs",
];

const fullRegressionTests=[
  "writing-course-v2-a.cjs",
  "writing-course-v2-b.cjs",
  "writing-course-v2-c.cjs",
  "g3e-firebase-reliability.cjs",
  "issue64-task-b.cjs",
  "current-curriculum-audio-readiness.cjs",
  "issue66-writing-progress.cjs",
  "content-density-wave6-draft.cjs",
  "content-density-wave6-audio.cjs",
  "curriculum-1150-density-wave6.cjs",
  "assisted-review.cjs",
  "attempt-navigation-ui.cjs",
  "today-learning-path.cjs",
  "unit-guide-60.cjs",
  "lesson-status-course-cards-plan.cjs",
  "a2-unit-guide-pilot.cjs",
  "batch02-v11-release.cjs",
  "batch04-code-compat.cjs",
  "catalog-groups.cjs",
  "catalog-taxonomy-ui.cjs",
  "content-batch02.cjs",
  "course-v21-p1.cjs",
  "curriculum-13-compat-v15.cjs",
  "curriculum-160-grammar-a1a2.cjs",
  "curriculum-161-relative-that.cjs",
  "curriculum-170-grammar-b1-wave2a.cjs",
  "curriculum-180-grammar-b1-wave2b.cjs",
  "curriculum-190-grammar-b1-wave2c.cjs",
  "curriculum-1190-release.cjs",
  "curriculum-1200-release.cjs",
  "unit10-academic-candidate-v121.cjs",
  "unit10-audio-owner-receipts.cjs",
  "unit10-staged-manifest-safety.cjs",
  "c1c2-importer-compat.cjs",
  "c1c2-draft-source.cjs",
  "c1c2-authored-content-schema.cjs",
  "curriculum-1100-vocab-reading-b1-density-wave1.cjs",
  "curriculum-1110-listening-writing-density-wave2.cjs",
  "curriculum-batch02.cjs",
  "curriculum-coverage.cjs",
  "curriculum.cjs",
  "foundation-coaching.cjs",
  "foundation-results-ux.cjs",
  "g-learning-brand.cjs",
  "grammar-b1-wave2a-draft.cjs",
  "grammar-b1-wave2b-draft.cjs",
  "grammar-b1-wave2c-draft.cjs",
  "importer-capacity-150.cjs",
  "listening-retake-audio-readiness.cjs",
  "listening-submit-feedback.cjs",
  "listening-writing-density-wave2-draft.cjs",
  "ux-v20-lesson-navigation.cjs",
  "v20-route-draft-safety.cjs",
  "vocab-reading-b1-density-wave1-draft.cjs",
  "writing-nav-save-feedback.cjs",
  "writing-tutor.cjs",
];

const selected=[...new Set(mode==="core" ? coreTests : [...coreTests,...fullRegressionTests])];

for(const test of selected){
  const relative=path.join("tests",test);
  console.log("\n=== "+mode.toUpperCase()+" QA: "+relative+" ===");
  const result=spawnSync(process.execPath,[relative],{
    cwd:root,
    stdio:"inherit",
    env:{...process.env,QA_AGGREGATE:"1"},
  });
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}

console.log(JSON.stringify({
  result:"PASS",
  suite:mode,
  tests:selected.length,
  policy:"ci-free-first",
}));
