'use strict';
// Prevent accidental use of Firebase LIVE or Math while preparing Stage 3 QA.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const workflow=fs.readFileSync(path.join(__dirname,'../../.github/workflows/english-manual-release-qa.yml'),'utf8');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'../firebase.json'),'utf8'));
const rc=JSON.parse(fs.readFileSync(path.join(__dirname,'../.firebaserc'),'utf8'));
assert.equal(config.hosting.target,'english');
assert.equal(config.hosting.public,'dist/client');
assert.deepEqual(rc.targets?.['roadmap-toan-ai']?.hosting?.english,['g-learning-english']);
assert.equal(rc.projects.default,'roadmap-toan-ai');
assert.match(workflow,/^on:\s*\n\s{2}workflow_dispatch:/m,'Preview must be manually dispatched only');
assert(!/^\s{2}(push|pull_request|schedule|workflow_run|pull_request_target):/m.test(workflow),
 'Secret-bearing Hosting workflow must never use automatic PR/push/event triggers');
const preview=workflow.match(/      - name: Deploy Stage 3 to disposable English Hosting preview channel[^]*?(?=\n      - name: Preview HTTP smoke)/);
assert(preview,'No independent Stage 3 preview job step');
assert(preview[0].includes("github.ref_name == 'integration/sle-stage3-pilot-v1181-20261102'"));
assert(preview[0].includes("inputs.confirm == 'PREVIEW_STAGE3_1181'"));
assert.match(preview[0],/\n          target: english\n/);
assert.match(preview[0],/\n          channelId: sle-stage3-1181-qa\n/);
assert.match(preview[0],/\n          expires: 7d\n/);
assert(!/channelId:\s*live/.test(preview[0]),'Preview must not deploy LIVE');
const live=workflow.match(/      - name: Deploy LIVE Firebase Hosting[^]*?(?=\n      - name: Deploy Stage 3)/);
assert(live,'Missing separately guarded LIVE action');
assert(live[0].includes("github.ref_name == 'release/nov2026-content-v1.18.0'"));
assert(live[0].includes("inputs.confirm == 'DEPLOY_ENGLISH_V1180'"));
assert.match(live[0],/\n          channelId: live\n/);
const qa=workflow.match(/      - name: Full QA, TypeScript and Firebase static production build[^]*?(?=\n      - name: Verify exact release artifacts)/);
assert(qa&&qa[0].includes('pnpm qa:release'),'Preview must follow the full release QA');
const summary=workflow.match(/      - name: Record QA, deployment and smoke outcomes even on failure[^]*/);
assert(summary&&summary[0].includes('PREVIEW_OUTCOME')&&summary[0].includes('PREVIEW_SMOKE_OUTCOME'),
 'Distinguish preview deployment from LIVE and static-smoke outcomes');
console.log(JSON.stringify({result:'PASS',gate:'stage3-preview-hosting-safety',
 previewTarget:'english',previewChannel:'sle-stage3-1181-qa',previewOnly:true,
 liveOnlyRequiresReleaseBranchAndExplicitApproval:true,credentialFreePRQA:true}));
