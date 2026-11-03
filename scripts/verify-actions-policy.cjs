#!/usr/bin/env node
'use strict';
// Executable subset of the sole canonical policy:
// sites-p0-phase-a-20260926/docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'.github/workflows');
const files=fs.readdirSync(dir).filter(x=>/\.ya?ml$/.test(x)).sort();
assert.deepEqual(files,['english-manual-release-qa.yml','english-pr-qa.yml'],
 'Exactly one PR QA and one English LIVE release workflow are allowed');
const pr=fs.readFileSync(path.join(dir,'english-pr-qa.yml'),'utf8');
const live=fs.readFileSync(path.join(dir,'english-manual-release-qa.yml'),'utf8');
function triggers(src){
 const lines=src.split(/\r?\n/),start=lines.findIndex(x=>/^on:\s*$/.test(x));
 assert(start>=0,'Missing on:');
 const events=[];
 for(let i=start+1;i<lines.length;i++){
  if(lines[i].trim()&&!/^\s/.test(lines[i]))break;
  const m=/^  ([\w-]+):/.exec(lines[i]);if(m)events.push(m[1]);
 }
 return events;
}
assert.deepEqual(triggers(pr),['pull_request']);
assert.deepEqual(triggers(live),['push']);
assert(pr.includes('branches: [main]'));
assert(live.includes('branches: [main]'));
assert(live.includes("'sites-p0-phase-a-20260926/**'"));
assert(live.includes("contains(github.event.head_commit.message, '[release-english]')"),
 'LIVE must require the owner release marker');
assert(!/secrets\.|channelId:\s*live|action-hosting-deploy|firebaseServiceAccount/.test(pr),
 'PR QA cannot access secrets or deploy');
assert(/cancel-in-progress:\s*true/.test(pr));
assert(/target: english/.test(live)&&/channelId: live/.test(live));
assert(/projectId: roadmap-toan-ai/.test(live));
assert(!/PREVIEW_STAGE3_1181|sle-stage3-1181-qa|workflow_dispatch:/.test(live));
const qa=live.indexOf('run: pnpm qa:release'),deploy=live.indexOf('name: Deploy Firebase Hosting English LIVE only');
assert(qa>=0&&deploy>qa,'Full QA must precede English LIVE deployment');
console.log('CI_POLICY_PASS: single PR QA + owner-authorized main LIVE release, no Preview');
