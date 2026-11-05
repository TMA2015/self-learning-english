'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const out='.sites-runtime/issue64-b';execFileSync(process.execPath,['node_modules/typescript/bin/tsc','infrastructure/browser/local-backup.ts','--outDir',out,'--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});fs.writeFileSync(out+'/package.json','{"type":"commonjs"}');
const backup=require('../'+out+'/infrastructure/browser/local-backup.js'),runtime=require('../'+out+'/infrastructure/browser/local-runtime.js');
class Storage{constructor(){this.map=new Map();this.fail=false;this.reads=0;this.writes=0}getItem(k){this.reads++;return this.map.get(k)??null}setItem(k,v){this.writes++;if(this.fail)throw new DOMException('quota','QuotaExceededError');this.map.set(k,String(v))}removeItem(){throw Error('No deletion')}}
(async()=>{
 const s=new Storage();global.window={localStorage:s};s.map.set('existing-test-data','keep');
 for(const input of ['invalid JSON','{}',JSON.stringify({schemaVersion:1,academicRecords:[{version:'1.11.0'}]}),JSON.stringify({schemaVersion:1,academicRecords:[{version:'1.15.0'}]})]){
  await assert.rejects(()=>backup.previewLocalBackup(input),/temporarily unavailable/);await assert.rejects(()=>backup.restoreLocalBackup(input,'token',true),/temporarily unavailable/);
 }
 assert.equal(s.reads,0);assert.equal(s.writes,0);assert.equal(s.map.get('existing-test-data'),'keep');
 const r=await runtime.localAcademicRuntime();assert.deepEqual((await r.academic.packages()).map(p=>p.version),['1.18.1']);const cat=await r.service.catalog();assert.equal(cat.lessons.length,109);
 await r.service.start('GRA-A1-01','task-b-draft');await r.service.draft('task-b-draft',{});const before=JSON.stringify([...s.map]);s.fail=true;
 let success=false;await assert.rejects(async()=>{await r.service.draft('task-b-draft',{});success=true},/Could not save:.*no storage space/);assert.equal(success,false);assert.equal(JSON.stringify([...s.map]),before);s.fail=false;
 const ui=fs.readFileSync('app/local-backup-panel.tsx','utf8');
 assert(!ui.includes('restoreLocalBackup('),'Legacy reference-only JSON must never become directly restorable');
 assert(ui.includes('previewLocalRecoveryV2(')&&ui.includes('restoreLocalRecoveryV2('),
  'Complete V2 file requires integrity check and explicit fresh-profile recovery');
 assert(ui.includes('fullBackupExported'),'Compaction must require a complete recovery download first');
 assert(ui.includes('type="file"'),'V2 recovery is an explicit file-based action');
 const player=fs.readFileSync('app/foundation.tsx','utf8');assert(player.includes('editable&&!browserLearningEnabled()&&(recordingNow?'));assert(player.includes('recordings cannot be saved'));
 console.log('PASS: all restore inputs blocked before any storage read/write; fresh install only 1.18.1; current draft save works; quota rejects without success or last-good loss; legacy V1 restore blocked; V2 recovery separately integrity-gated; browser recording disabled.');
})().catch(e=>{console.error(e);process.exitCode=1});
