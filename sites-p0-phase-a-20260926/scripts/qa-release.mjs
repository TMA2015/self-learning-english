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
run(process.execPath,["tests/nov-2026-content-preflight.cjs"]);
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
