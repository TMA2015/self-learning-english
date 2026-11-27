import {spawnSync} from "node:child_process";
import {fullTests,successorPreflight,foundationWritingChecks,qaTestArgs} from "./qa-free-first.mjs";

const root=process.cwd();
const pnpm=process.platform==="win32"?"pnpm.cmd":"pnpm";

function run(command,args,env=process.env){
  console.log("\n=== "+[command,...args].join(" ")+" ===");
  const result=spawnSync(command,args,{cwd:root,stdio:"inherit",env});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}

// One execution per test in this release invocation. The strict media receipt
// mode also satisfies its ordinary source-only invocation later in fullTests.
const completed=new Map();
function test(name,args=[],aggregate=false){
  if(completed.has(name)){
    if(args.some(arg=>!completed.get(name).includes(arg)))throw Error("Test requires stronger flags: "+name);
    return;
  }
  run(process.execPath,["tests/"+name,...args],aggregate?{...process.env,QA_AGGREGATE:"1"}:process.env);
  completed.set(name,args);
}
// Keep local pnpm qa:release self-contained, not dependent on GitHub workflow gates.
test("stage3-release-activation-gate.cjs");
// Cheap/current gates first, then remaining release and browser checks once.
for(const name of [...new Set([...successorPreflight,"typescript-syntax.cjs","current-curriculum-integrity.cjs","current-curriculum-audio-readiness.cjs","lesson-overview.cjs","foundation-coaching.cjs","ux-v20-lesson-navigation.cjs","stage3-notebooklm-remediation.cjs","pronunciation-runtime-audio.cjs"])])test(name,[],true);
// Fail early on the current Foundation Writing course before unrelated expensive browser/media tests.
for(const name of foundationWritingChecks)test(name,[],true);
test("stage3-multiversion-storage-gate.cjs");
test("nov-2026-content-preflight.cjs");

// Draft-only diagnostic preflight: run real browser and media checks BEFORE the
// mandatory rights gate. This does NOT permit or trigger any release.
// Without this, rights PENDING stops CI before browser tests can produce evidence.
// No extra browser data is touched: the tests use disposable localhost profiles.
const rights=JSON.parse((await import("node:fs")).readFileSync("content/audio-rights-register.json","utf8"));
if(rights.unit10_draft_assets?.candidate_version==="1.21.0"){
  test("unit10-audio-owner-receipts.cjs", ["--require-media"]);
  test("unit10-staged-manifest-safety.cjs");
  test("unit10-academic-candidate-v121.cjs");
  // Verify version-pinned old attempts and atomic quota failures during the
  // proposed 1.20.0 -> 1.21.0 upgrade (no production storage touched).
  test("unit10-real-upgrade-retention.cjs");
  // Chrome loads the three exact MP3 bytes over localhost and must emit ended.
  // This is media-codec evidence, NOT the complete product-player MEDIA-01 gate.
  test("unit10-chrome-audio-codec.cjs");
  // QA-only: real FoundationDemo + real browser-local AcademicService with
  // v1.21.0 seeded into a throwaway localhost Chrome profile.
  // Never imports into any production browser, nor tests the live site.
  test("unit10-media01-real-browser.cjs");
  test("storage-chromium-smoke.cjs");
  test("storage-ui-browser.cjs");
}
test("audio-rights-release-gate.cjs", ["--require-clearance"]);
test("writing-ai-on-demand.cjs");
test("english-tutor-knowledge-only.cjs");
for(const name of fullTests)test(name,qaTestArgs(name),true);
if(fullTests.some(name=>!completed.has(name)))throw Error("Incomplete full QA");
console.log(JSON.stringify({result:"PASS",suite:"full",tests:fullTests.length,uniqueReleaseTests:completed.size}));
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
