"use client";
import {useState} from 'react';
import {browserLearningEnabled} from '../infrastructure/browser/client-services';
import {exportLocalBackup,LOCAL_RESTORE_LIMITATION} from '../infrastructure/browser/local-backup';
export function LocalBackupPanel(){
 const [busy,setBusy]=useState(false),[status,setStatus]=useState('');
 if(!browserLearningEnabled())return null;
 async function exportNow(){
  setBusy(true);setStatus('');
  try{
   const file=await exportLocalBackup();
   const url=URL.createObjectURL(new Blob([file.text],{type:file.mime}));
   const a=document.createElement('a');a.href=url;a.download=file.filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
   setStatus('Reference export prepared. Restore is not supported in this version.');
  }catch(e){setStatus(e instanceof Error?e.message:'Export failed.')}
  finally{setBusy(false)}
 }
 return <section className="panel progress-bottom" aria-label="On-device backup">
  <span className="eyebrow">ON-DEVICE DATA</span><h2>Local data export</h2>
  <p>Progress is saved in this browser. Keep this browser data to continue your work.</p>
  <p>{LOCAL_RESTORE_LIMITATION}</p>
  <button className="secondary-button" disabled={busy} onClick={()=>void exportNow()}>Export for reference</button>
  <button className="secondary-button" disabled>Restore unavailable</button>
  {status&&<p role="status" aria-live="polite">{status}</p>}
 </section>;
}
