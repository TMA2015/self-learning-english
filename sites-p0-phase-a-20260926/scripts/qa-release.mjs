import {spawnSync} from "node:child_process";

const root=process.cwd();
const pnpm=process.platform==="win32"?"pnpm.cmd":"pnpm";

function run(command,args,env=process.env){
  console.log("\n=== "+[command,...args].join(" ")+" ===");
  const result=spawnSync(command,args,{cwd:root,stdio:"inherit",env});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}

// Keep local pnpm qa:release self-contained, not dependent on GitHub workflow gates.
run(process.execPath,["tests/stage3-release-activation-gate.cjs"]);
run(process.execPath,["tests/stage3-multiversion-storage-gate.cjs"]);
run(process.execPath,["tests/nov-2026-content-preflight.cjs"]);

// Draft-only diagnostic preflight: run real browser and media checks BEFORE the
// mandatory rights gate. This does NOT permit or trigger any release.
// Without this, rights PENDING stops CI before browser tests can produce evidence.
// No extra browser data is touched: the tests use disposable localhost profiles.
const rights=JSON.parse((await import("node:fs")).readFileSync("content/audio-rights-register.json","utf8"));
if(rights.unit10_draft_assets?.candidate_version==="1.21.0"){
  run(process.execPath,["tests/unit10-audio-owner-receipts.cjs","--require-media"]);
  run(process.execPath,["tests/unit10-staged-manifest-safety.cjs"]);
  run(process.execPath,["tests/unit10-academic-candidate-v121.cjs"]);
  // Verify version-pinned old attempts and atomic quota failures during the
  // proposed 1.20.0 -> 1.21.0 upgrade (no production storage touched).
  run(process.execPath,["tests/unit10-real-upgrade-retention.cjs"]);
  // Chrome loads the three exact MP3 bytes over localhost and must emit ended.
  // This is media-codec evidence, NOT the complete product-player MEDIA-01 gate.
  run(process.execPath,["tests/unit10-chrome-audio-codec.cjs"]);
  // QA-only: real FoundationDemo + real browser-local AcademicService with
  // v1.21.0 seeded into a throwaway localhost Chrome profile.
  // Never imports into any production browser, nor tests the live site.
  run(process.execPath,["tests/unit10-media01-real-browser.cjs"]);
  // Actual native Chrome Back/Forward and full reload restore only a saved
  // Listening attempt in a disposable localhost profile. No live data touched.
  run(process.execPath,["tests/browser-navigation-real-browser-119.cjs"]);
  // Full Home navigation (not a routing mock) including Writing week/step,
  // browser Back/Forward, cross-skill transitions and actual full reload.
  run(process.execPath,["tests/browser-navigation-home-real-browser-119.cjs"]);
  run(process.execPath,["tests/storage-chromium-smoke.cjs"]);
  run(process.execPath,["tests/storage-ui-browser.cjs"]);
}
run(process.execPath,["tests/audio-rights-release-gate.cjs","--require-clearance"]);
run(process.execPath,["tests/writing-ai-on-demand.cjs"]);
run(process.execPath,["tests/english-tutor-knowledge-only.cjs"]);
run(pnpm,["run","qa:full"]);
run(pnpm,["exec","tsc","--noEmit","--incremental","false"]);

const hostingEnv={
  ...process.env,
  STATIC_EXPORT:"1",
  NEXT_PUBLIC_LEARNING_RUNTIME:"browser",
  NEXT_PUBLIC_BASE_PATH:"",
};
run(pnpm,["run","build"],hostingEnv);
run(process.execPath,["tests/firebase-hosting-static.cjs"],hostingEnv);

console.log(JSON.stringify({
  result:"PASS",
  suite:"release",
  hosting:"firebase",
  githubActionsRequired:false,
}));
