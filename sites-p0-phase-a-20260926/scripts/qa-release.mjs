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
