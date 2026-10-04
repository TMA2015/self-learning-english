"use client";
import {useRef,useState} from 'react';
import {browserLearningEnabled} from '../infrastructure/browser/client-services';
import {
  LOCAL_BACKUP_MAX_BYTES,
  exportLocalBackup,
  previewLocalBackup,
  restoreLocalBackup,
  type LocalBackupFile,
  type LocalBackupPreview,
} from '../infrastructure/browser/local-backup';

function download(file:LocalBackupFile,name=file.filename){
  const url=URL.createObjectURL(new Blob([file.text],{type:file.mime}));
  const a=document.createElement('a');
  a.href=url;
  a.download=name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}

function preRestoreName(exportedAt:string){
  const stamp=exportedAt.replace(/[:.]/g,'-');
  return `g-learning-english-pre-restore-${stamp}.json`;
}

export function LocalBackupPanel(){
  const input=useRef<HTMLInputElement>(null);
  const [source,setSource]=useState('');
  const [preview,setPreview]=useState<LocalBackupPreview|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  if(!browserLearningEnabled())return null;

  async function exportNow(){
    setBusy(true);setStatus('');
    try{
      const file=await exportLocalBackup();
      download(file);
      setStatus(`Backup exported · ${file.counts.academicAttempts} lesson attempts · ${file.counts.evidence} evidence records.`);
    }catch(error){setStatus(error instanceof Error?error.message:'Backup export failed.')}
    finally{setBusy(false)}
  }

  async function choose(file:File|null){
    setPreview(null);setSource('');setStatus('');
    if(!file)return;
    if(file.size>LOCAL_BACKUP_MAX_BYTES){setStatus('Backup is too large. Maximum supported size is 5 MB.');return}
    setBusy(true);
    try{
      const text=await file.text();
      const result=await previewLocalBackup(text);
      setSource(text);setPreview(result);
      setStatus(result.valid?'Restore preview ready. No data has been changed.':result.errors.join(' '));
    }catch(error){setStatus(error instanceof Error?error.message:'Could not read this backup.')}
    finally{setBusy(false)}
  }

  async function restoreNow(){
    if(!preview?.valid||!source)return;
    setBusy(true);setStatus('');
    try{
      const result=await restoreLocalBackup(source,preview.token,true);
      download(result.preRestoreBackup,preRestoreName(result.preRestoreBackup.exportedAt));
      setStatus('Restore completed. A pre-restore safety backup was downloaded. Reloading…');
      setTimeout(()=>window.location.reload(),250);
    }catch(error){
      setStatus(error instanceof Error?error.message:'Restore failed. No conflicting data was overwritten.');
      try{setPreview(await previewLocalBackup(source))}catch{}
    }finally{setBusy(false)}
  }

  return <section className="panel progress-bottom" aria-label="On-device backup">
    <span className="eyebrow">ON-DEVICE DATA</span>
    <h2>Backup & restore</h2>
    <p>Browser mode saves progress on this device. Export a JSON backup regularly, especially before clearing browser data or moving to another device.</p>
    <div className="learning-choices">
      <button className="secondary-button" disabled={busy} onClick={()=>void exportNow()}>Export backup</button>
      <button className="secondary-button" disabled={busy} onClick={()=>input.current?.click()}>Choose backup to restore</button>
      <input
        ref={input}
        hidden
        type="file"
        accept=".json,application/json"
        onChange={event=>void choose(event.target.files?.[0]??null)}
      />
    </div>
    {preview&&<div className="notice" role="status">
      <strong>{preview.valid?'Safe restore preview':'Restore blocked'}</strong>
      <p>
        State: {preview.state} · Evidence: +{preview.evidence.add} / skip {preview.evidence.skip} / conflict {preview.evidence.conflict}
        {' · '}Assessments: +{preview.assessments.add} / skip {preview.assessments.skip} / conflict {preview.assessments.conflict}
        {' · '}Lesson attempts: +{preview.academic.add} / skip {preview.academic.skip} / conflict {preview.academic.conflict}
        {' · '}Active course: {preview.courseSelection}
      </p>
      <p className="muted">Backup identity never selects the target learner; restore always targets this local browser profile.</p>
      {preview.errors.length>0&&<p>{preview.errors.join(' ')}</p>}
      {preview.valid&&<button className="primary-button" disabled={busy} onClick={()=>void restoreNow()}>Restore this backup</button>}
    </div>}
    {status&&<p role="status" aria-live="polite">{status}</p>}
    <small>Restore never silently overwrites different learner state or conflicting immutable record IDs. A safety backup is created before any confirmed restore.</small>
  </section>;
}
