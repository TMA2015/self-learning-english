"use client";
import {useState} from 'react';
import {browserLearningEnabled} from '../infrastructure/browser/client-services';
import {exportLocalBackup,LOCAL_RESTORE_LIMITATION} from '../infrastructure/browser/local-backup';
import {exportLocalRecoveryV2,previewLocalRecoveryV2,restoreLocalRecoveryV2} from '../infrastructure/browser/local-recovery';
import {localAcademicRuntime} from '../infrastructure/browser/local-runtime';

type RetentionPreview=Awaited<ReturnType<Awaited<ReturnType<typeof localAcademicRuntime>>['academic']['previewRetention']>>;
type RecoveryPreview=Awaited<ReturnType<typeof previewLocalRecoveryV2>>;
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
   const file=await exportLocalRecoveryV2();
   download(file.text,file.filename);
   setFullBackupExported(true);
   setStatus('Complete V2 recovery JSON prepared ('+file.versions+' content versions, '+file.attempts+' attempts). Store it privately. Nothing was uploaded.');
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
   const {academic}=await localAcademicRuntime();
   await academic.compactRetention(retention.token,true);
   setRetention(null);setFullBackupExported(false);
   const checked=await academic.previewRetention();
   setStatus('Curriculum storage compacted safely. One current full version; '+checked.protectedLessonCount+' historical lessons protected. Saved attempts are unchanged. Keep the downloaded recovery JSON.');
  });
 }
 async function chooseRestore(file:File|undefined){
  setRestorePreview(null);setRecoveryText('');
  if(!file)return;
  await run(async()=>{
   const content=await file.text();
   const result=await previewLocalRecoveryV2(content);
   setRecoveryText(content);setRestorePreview(result);
   setStatus(result.valid
    ?'Recovery file verified. This will restore '+result.attempts+' attempts into an otherwise empty learner profile. Review before confirming.'
    :result.errors.join(' '));
  });
 }
 async function restore(){
  if(!recoveryText||!restorePreview?.valid)return;
  await run(async()=>{
   const result=await restoreLocalRecoveryV2(recoveryText,restorePreview.token,true);
   setStatus('Recovery verified: '+result.attempts+' attempts. Reload the page to see restored lessons.');
   setRestorePreview(null);setRecoveryText('');
  });
 }
 return <section className="panel progress-bottom" aria-label="On-device storage and recovery">
  <span className="eyebrow">ON-DEVICE STORAGE</span>
  <h2>Storage and recovery</h2>
  <p>Progress stays in this browser. No email, cloud account or personal data upload is required.</p>
  <p>Keep a <strong>complete V2 recovery file</strong> privately before changing content storage. The older reference-only JSON cannot restore historical lessons.</p>
  <div className="foundation-controls">
   <button className="secondary-button" disabled={busy} onClick={()=>void exportComplete()}>Download complete recovery JSON</button>
   <button className="secondary-button" disabled={busy} onClick={()=>void exportReference()}>Export old reference JSON</button>
   <button className="secondary-button" disabled={busy} onClick={()=>void inspect()}>Preview storage cleanup</button>
  </div>
  {retention&&<div className="foundation-storage-inspection" aria-label="Storage cleanup preview">
   <p><strong>Current curriculum:</strong> {retention.activeVersion}. Full historical versions: {retention.beforeVersions.length}; versions still required: {retention.retainedVersions.length}. Historical lessons with actual work: {retention.protectedLessonCount}.</p>
   <p>Estimated curriculum storage: {Math.ceil(retention.estimatedBeforeBytes/1024)} → {Math.ceil(retention.estimatedAfterBytes/1024)} KiB. Browser space varies.</p>
   <p>Only curriculum sources not used by saved attempts can be reduced. Actual attempts, scores and drafts are not deleted.</p>
   <button className="secondary-button" disabled={busy||!fullBackupExported}
    onClick={()=>void compact()}>Confirm compact storage (after recovery download)</button>
   {!fullBackupExported&&<small>Download the complete recovery JSON above before confirming.</small>}
  </div>}
  <hr/>
  <p><strong>Restore:</strong> Select a complete V2 recovery JSON on an otherwise empty learner profile. Existing work cannot be overwritten.</p>
  <label htmlFor="sle-v2-recovery-file">Recovery JSON file</label>
  <input id="sle-v2-recovery-file" type="file" accept=".json,application/json" disabled={busy}
   onChange={e=>void chooseRestore(e.target.files?.[0])}/>
  {restorePreview?.valid&&<div className="foundation-storage-inspection">
   <p>Verified backup from {restorePreview.exportedAt}: {restorePreview.attempts} attempts, {restorePreview.versions} content versions.</p>
   <button className="secondary-button" disabled={busy}
    onClick={()=>void restore()}>Confirm recovery into this empty profile</button>
  </div>}
  <p className="muted">Recovery is local to this browser. Do not reset browser storage unless you have verified and safely stored the V2 backup.</p>
  {status&&<p role="status" aria-live="polite">{status}</p>}
 </section>;
}
