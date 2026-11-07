"use client";
import {useState} from 'react';
import {browserLearningEnabled} from '../infrastructure/browser/client-services';
import {exportLocalBackup,LOCAL_RESTORE_LIMITATION} from '../infrastructure/browser/local-backup';
import {exportLocalRecoveryV2,verifyLocalRecoveryV2,previewLocalRecoveryV2,restoreLocalRecoveryV2} from '../infrastructure/browser/local-recovery';
import {exportHybridRecoveryV2,previewHybridRecoveryV2,restoreHybridRecoveryV2} from '../infrastructure/browser/hybrid-local-recovery';
import {hybridStorageEnabled} from '../infrastructure/browser/hybrid-storage-mode';
import {browserCurriculumVault} from '../infrastructure/storage/indexeddb-curriculum-vault';
import {localAcademicRuntime} from '../infrastructure/browser/local-runtime';

type RetentionPreview=Awaited<ReturnType<Awaited<ReturnType<typeof localAcademicRuntime>>['academic']['previewRetention']>>;
type RecoveryPreview=Awaited<ReturnType<typeof previewLocalRecoveryV2>>;
const activeExport=()=>hybridStorageEnabled()
 ?exportHybridRecoveryV2(window.localStorage,browserCurriculumVault())
 :exportLocalRecoveryV2();
const activePreview=(text:string)=>hybridStorageEnabled()
 ?previewHybridRecoveryV2(text,window.localStorage,browserCurriculumVault())
 :previewLocalRecoveryV2(text);
const activeRestore=(text:string,token:string,confirmed:boolean)=>hybridStorageEnabled()
 ?restoreHybridRecoveryV2(text,token,confirmed,window.localStorage,browserCurriculumVault())
 :restoreLocalRecoveryV2(text,token,confirmed);
function download(text:string,filename:string){
 const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=filename;
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),0);
}
export function LocalBackupPanel(){
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('');
 const [retention,setRetention]=useState<RetentionPreview|null>(null);
 const [recoveryText,setRecoveryText]=useState('');
 const [restorePreview,setRestorePreview]=useState<RecoveryPreview|null>(null);
 const [fullBackupExported,setFullBackupExported]=useState(false);
 const [backupExpected,setBackupExpected]=useState('');
 if(!browserLearningEnabled())return null;
 async function run(action:()=>Promise<void>){
  setBusy(true);setStatus('');
  try{await action()}catch(e){setStatus(e instanceof Error?e.message:'Operation failed. Data was not intentionally cleared.')}
  finally{setBusy(false)}
 }
 async function exportReference(){
  await run(async()=>{const file=await exportLocalBackup();
   download(file.text,file.filename);
   setStatus('Learner-only reference JSON exported. '+LOCAL_RESTORE_LIMITATION);
  });
 }
 async function exportComplete(){
  await run(async()=>{
   const file=await activeExport();
   download(file.text,file.filename);
   setBackupExpected((JSON.parse(file.text) as {sha256:string}).sha256);
   setFullBackupExported(false);
   setStatus('Complete V2 recovery JSON prepared ('+file.versions+' content versions, '+file.attempts+' attempts). Verify the saved file below before cleanup. Nothing was uploaded.');
  });
 }
 async function verifyDownloaded(file:File|undefined){
  setFullBackupExported(false);
  if(!file)return;
  await run(async()=>{
   const recovered=await verifyLocalRecoveryV2(await file.text());
   if(!backupExpected||recovered.sha256!==backupExpected)
    throw Error('Selected file is not the current downloaded backup. Download a new V2 recovery JSON and verify again.');
   setFullBackupExported(true);
   setStatus('Saved recovery file verified against the current export. Compaction can now be confirmed.');
  });
 }
 async function inspect(){
  await run(async()=>{
   const {academic}=await localAcademicRuntime();
   const summary=await academic.previewRetention();
   setRetention(summary);
   setStatus('Storage analysis complete. No data changed.');
  });
 }
 async function compact(){
  if(!retention||!fullBackupExported)return;
  await run(async()=>{
   const current=await activeExport();
   if(!backupExpected||(JSON.parse(current.text) as {sha256:string}).sha256!==backupExpected)
    throw Error('Learner data changed since backup. Download and verify a fresh complete V2 recovery file.');
   const {academic}=await localAcademicRuntime();
   await academic.compactRetention(retention.token,true);
   setRetention(null);setFullBackupExported(false);setBackupExpected('');
   const checked=await academic.previewRetention();
   setStatus('Curriculum storage compacted safely. One current full version; '+checked.protectedLessonCount+' historical lessons protected. Saved attempts are unchanged. Keep the downloaded recovery JSON.');
  });
 }
 async function chooseRestore(file:File|undefined){
  setRestorePreview(null);setRecoveryText('');
  if(!file)return;
  await run(async()=>{
   const content=await file.text();
   const result=await activePreview(content);
   setRecoveryText(content);setRestorePreview(result);
   setStatus(result.valid
    ?'Recovery file verified. This will restore '+result.attempts+' attempts into an otherwise empty learner profile. Review before confirming.'
    :result.errors.join(' '));
  });
 }
 async function restore(){
  if(!recoveryText||!restorePreview?.valid)return;
  await run(async()=>{
   const result=await activeRestore(recoveryText,restorePreview.token,true);
   setStatus('Recovery verified: '+result.attempts+' attempts. Reload the page to see restored lessons.');
   setRestorePreview(null);setRecoveryText('');
  });
 }
 return <section className="panel progress-bottom" aria-label="On-device storage and recovery">
  <span className="eyebrow">ON-DEVICE STORAGE</span>
  <h2>Storage and recovery</h2>
  <p>Progress stays in this browser. No email, cloud account or personal data upload is required.</p>
  <p>Keep a <strong>complete V2 recovery file</strong> privately before changing content storage. The older reference-only JSON cannot restore historical lessons.</p>
  {hybridStorageEnabled()&&<p className="muted">Staged IndexedDB curriculum vault: complete V2 backups include both stored lesson versions and learner work. Automatic cleanup of old browser data is disabled.</p>}
  <div className="foundation-controls">
   <button className="secondary-button" disabled={busy} onClick={()=>void exportComplete()}>Download complete recovery JSON</button>
   <button className="secondary-button" disabled={busy} onClick={()=>void exportReference()}>Export old reference JSON</button>
   {!hybridStorageEnabled()&&<button className="secondary-button" disabled={busy} onClick={()=>void inspect()}>Preview storage cleanup</button>}
  </div>
  <label htmlFor="sle-v2-verify-file">Verify downloaded complete recovery file (before cleanup)</label>
  <input id="sle-v2-verify-file" type="file" accept=".json,application/json" disabled={busy||!backupExpected}
   onChange={e=>void verifyDownloaded(e.target.files?.[0])}/>
  {!hybridStorageEnabled()&&retention&&<div className="foundation-storage-inspection" aria-label="Storage cleanup preview">
   <p><strong>Current curriculum:</strong> {retention.activeVersion}. Full historical versions: {retention.beforeVersions.length}; versions still required: {retention.retainedVersions.length}. Historical lessons with actual work: {retention.protectedLessonCount}.</p>
   <p>Estimated curriculum storage: {Math.ceil(retention.estimatedBeforeBytes/1024)} → {Math.ceil(retention.estimatedAfterBytes/1024)} KiB. Browser space varies.</p>
   <p>Only curriculum sources not used by saved attempts can be reduced. Actual attempts, scores and drafts are not deleted.</p>
   <button className="secondary-button" disabled={busy||!fullBackupExported}
    onClick={()=>void compact()}>Confirm compact storage (after recovery download)</button>
   {!fullBackupExported&&<small>Download and re-select the saved V2 recovery JSON above to verify it before confirming.</small>}
  </div>}
  <hr/>
  <p className="muted">Approved new lessons are added automatically when the site updates and this browser has enough storage. Do not download curriculum JSON files or use Restore to update lessons.</p>
  <p><strong>Restore:</strong> Select a complete V2 recovery JSON on an otherwise empty learner profile. Existing work cannot be overwritten.</p>
  <label htmlFor="sle-v2-recovery-file">Recovery JSON file</label>
  <input id="sle-v2-recovery-file" type="file" accept=".json,application/json" disabled={busy}
   onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';void chooseRestore(file)}}/>
  {restorePreview?.valid&&<div className="foundation-storage-inspection">
   <p>Verified backup from {restorePreview.exportedAt}: {restorePreview.attempts} attempts, {restorePreview.versions} content versions.</p>
   <button className="secondary-button" disabled={busy}
    onClick={()=>void restore()}>Confirm recovery into this empty profile</button>
  </div>}
  <p className="muted">Recovery is local to this browser. Do not reset browser storage unless you have verified and safely stored the V2 backup.</p>
  {status&&<p role="status" aria-live="polite">{status}</p>}
 </section>;
}
