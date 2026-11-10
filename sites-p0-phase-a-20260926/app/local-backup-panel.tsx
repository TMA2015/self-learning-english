"use client";
import {useRef,useState} from 'react';
import {browserLearningEnabled} from '../infrastructure/browser/client-services';
import {exportLocalRecoveryV2,verifyLocalRecoveryV2,previewLocalRecoveryV2,restoreLocalRecoveryV2} from '../infrastructure/browser/local-recovery';
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
 const [backupExpected,setBackupExpected]=useState('');
 const [verifiedBackupName,setVerifiedBackupName]=useState('');
 const [selectedRestoreName,setSelectedRestoreName]=useState('');
 const verifyInput=useRef<HTMLInputElement>(null);
 const restoreInput=useRef<HTMLInputElement>(null);
 const potentialSavings=retention?Math.max(0,retention.estimatedBeforeBytes-retention.estimatedAfterBytes):0;
 const cleanupUseful=potentialSavings>=1024;
 if(!browserLearningEnabled())return null;
 async function run(action:()=>Promise<void>){
  setBusy(true);setStatus('');
  try{await action()}catch(e){setStatus(e instanceof Error?e.message:'Operation failed. Data was not intentionally cleared.')}
  finally{setBusy(false)}
 }
 async function exportComplete(){
  await run(async()=>{
   const file=await exportLocalRecoveryV2();
   download(file.text,file.filename);
   setBackupExpected((JSON.parse(file.text) as {sha256:string}).sha256);
   setFullBackupExported(false);
   setVerifiedBackupName('');
   setStatus('Complete V2 recovery JSON prepared ('+file.versions+' content versions, '+file.attempts+' attempts). Verify the saved file below before cleanup. Nothing was uploaded.');
  });
 }
 async function verifyDownloaded(file:File|undefined){
  setFullBackupExported(false);setVerifiedBackupName('');
  if(!file)return;
  await run(async()=>{
   const recovered=await verifyLocalRecoveryV2(await file.text());
   if(!backupExpected||recovered.sha256!==backupExpected)
    throw Error('Selected file is not the current downloaded backup. Download a new V2 recovery JSON and verify again.');
   setFullBackupExported(true);setVerifiedBackupName(file.name);
   setStatus('Saved recovery file verified against the current export. Compaction can now be confirmed.');
  });
 }
 async function inspect(){
  await run(async()=>{
   // Each cleanup session requires a fresh post-preview backup and verification.
   setBackupExpected('');setFullBackupExported(false);setVerifiedBackupName('');
   if(verifyInput.current)verifyInput.current.value='';
   const {academic}=await localAcademicRuntime();
   const summary=await academic.previewRetention();
   setRetention(summary);
   const saving=Math.max(0,summary.estimatedBeforeBytes-summary.estimatedAfterBytes);
   setStatus(saving<1024
    ?'Storage analysis complete. No meaningful space reduction is available; cleanup is not recommended. No data changed.'
    :'Storage analysis complete. The three safe cleanup steps are below. No data changed.');
  });
 }
 async function compact(){
  if(!retention||!fullBackupExported||!cleanupUseful)return;
  await run(async()=>{
   const current=await exportLocalRecoveryV2();
   if(!backupExpected||(JSON.parse(current.text) as {sha256:string}).sha256!==backupExpected)
    throw Error('Learner data changed since backup. Download and verify a fresh complete V2 recovery file.');
   const {academic}=await localAcademicRuntime();
   await academic.compactRetention(retention.token,true);
   setRetention(null);setFullBackupExported(false);setBackupExpected('');setVerifiedBackupName('');
   const checked=await academic.previewRetention();
   setStatus('Curriculum storage compacted safely. One current full version; '+checked.protectedLessonCount+' historical lessons protected. Saved attempts are unchanged. Keep the downloaded recovery JSON.');
  });
 }
 async function chooseRestore(file:File|undefined){
  setRestorePreview(null);setRecoveryText('');setSelectedRestoreName('');
  if(!file)return;
  await run(async()=>{
   const content=await file.text();
   const result=await previewLocalRecoveryV2(content);
   setRecoveryText(content);setRestorePreview(result);setSelectedRestoreName(file.name);
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
 return <section className="panel progress-bottom sle-storage-panel" aria-label="On-device storage and recovery">
  <span className="eyebrow">PARENT VIEW · ON-DEVICE STORAGE</span>
  <h2>Sao lưu, dọn dung lượng và khôi phục</h2>
  <p className="sle-storage-intro">Tiến độ được lưu riêng trong trình duyệt này, không tự đồng bộ giữa máy tính và iPad. Các chức năng dưới đây không gửi tệp lên máy chủ.</p>

  <div className="sle-storage-section" aria-label="Full progress backup">
   <div className="sle-storage-action-row">
    <button type="button" className="secondary-button" disabled={busy} onClick={()=>void exportComplete()}>Download complete recovery JSON</button>
    <p><strong>1. Sao lưu đầy đủ.</strong> Tải về tệp V2 chứa tiến độ, bài làm, điểm, bản nháp và nội dung bài học lịch sử để có thể khôi phục. Cất giữ tệp ở nơi an toàn; không cần làm lại mỗi khi website thêm bài.</p>
   </div>
  </div>

  <div className="sle-storage-section" aria-label="Storage cleanup">
   <div className="sle-storage-action-row">
    <button type="button" className="secondary-button" disabled={busy} onClick={()=>void inspect()}>Preview storage cleanup</button>
    <p><strong>2. Kiểm tra dung lượng có thể dọn.</strong> Chỉ xem trước số phiên bản, bài học phải giữ và dung lượng có thể giảm; chưa xóa hoặc sửa bất kỳ dữ liệu nào. Chỉ nên dọn khi có dung lượng thực sự tiết kiệm được.</p>
   </div>

   {retention&&<div className="foundation-storage-inspection sle-storage-preview" aria-label="Storage cleanup preview">
    <h3>Kết quả xem trước</h3>
    <p><strong>Curriculum hiện tại:</strong> {retention.activeVersion}. Số phiên bản đang có: {retention.beforeVersions.length}; cần giữ: {retention.retainedVersions.length}. Bài học lịch sử gắn với bài làm: {retention.protectedLessonCount}.</p>
    <p><strong>Dung lượng curriculum ước tính:</strong> {Math.ceil(retention.estimatedBeforeBytes/1024)} → {Math.ceil(retention.estimatedAfterBytes/1024)} KiB; có thể giảm khoảng {Math.round(potentialSavings/1024)} KiB. Dung lượng thực tế trên Safari có thể khác.</p>
    {!cleanupUseful
     ?<p className="sle-storage-no-savings" role="note"><strong>Chưa cần dọn:</strong> Không có dung lượng đáng kể để giảm. Những phiên bản/bài học cũ vẫn cần để mở các bài đã làm. Không cần tải tệp hoặc xác nhận dọn; xem trước không thay đổi dữ liệu.</p>
     :<div className="sle-cleanup-steps" aria-label="Three safe cleanup steps">
       <h3>Thực hiện theo thứ tự 3 bước</h3>
       <div className="sle-cleanup-step">
        <button type="button" className="secondary-button" disabled={busy} onClick={()=>void exportComplete()}>1. Tải file sao lưu đầy đủ</button>
        <p>Download complete recovery JSON. Đây là bản sao lưu trước khi dọn; giữ tệp vừa tải trên thiết bị.</p>
       </div>
       <div className="sle-cleanup-step">
        <button type="button" className="secondary-button" disabled={busy||!backupExpected}
         onClick={()=>verifyInput.current?.click()}>2. Chọn đúng file vừa tải</button>
        <p>Chọn lại tệp JSON ở bước 1 để kiểm tra SHA-256 và dữ liệu lịch sử. <strong>Không tải lên máy chủ.</strong></p>
        <input ref={verifyInput} id="sle-v2-verify-file" className="sle-storage-hidden-file" tabIndex={-1} aria-label="Select the complete V2 recovery file just downloaded"
         type="file" accept=".json,application/json" disabled={busy||!backupExpected}
         onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';void verifyDownloaded(file)}}/>
        {verifiedBackupName&&<small className="sle-storage-verified-file" role="note">Đã xác minh: {verifiedBackupName}</small>}
       </div>
       <div className="sle-cleanup-step">
        <button type="button" className="secondary-button" disabled={busy||!fullBackupExported}
         onClick={()=>void compact()}>3. Confirm compact storage</button>
        <p>Chỉ có thể xác nhận sau khi bước 2 kiểm tra thành công. Giữ nguyên tất cả bài làm, điểm số và nội dung lịch sử cần thiết.</p>
       </div>
      </div>}
   </div>}
  </div>

  <div className="sle-storage-section" aria-label="Restore into empty learner profile">
   <div className="sle-storage-action-row">
    <button type="button" className="secondary-button" disabled={busy}
     onClick={()=>restoreInput.current?.click()}>Choose recovery JSON file</button>
    <p><strong>3. Khôi phục dữ liệu (Restore).</strong> Chỉ dùng khi cần đưa bản sao lưu đầy đủ V2 vào <strong>hồ sơ học viên trống</strong>, ví dụ trên thiết bị mới. Không dùng Restore để cập nhật bài học; không được ghi đè bài làm đang có.</p>
   </div>
   <input ref={restoreInput} id="sle-v2-recovery-file" className="sle-storage-hidden-file" tabIndex={-1}
    aria-label="Choose a complete V2 recovery JSON for an empty learner profile"
    type="file" accept=".json,application/json" disabled={busy}
    onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';void chooseRestore(file)}}/>
   {selectedRestoreName&&<p className="sle-storage-filename">Tệp đã chọn: {selectedRestoreName}</p>}
   {restorePreview?.valid&&<div className="foundation-storage-inspection sle-restore-confirmation">
    <p>Đã kiểm tra bản sao lưu ngày {restorePreview.exportedAt}: {restorePreview.attempts} lượt làm bài, {restorePreview.versions} phiên bản học liệu.</p>
    <button type="button" className="secondary-button" disabled={busy}
     onClick={()=>void restore()}>Confirm recovery into this empty profile</button>
   </div>}
  </div>

  <p className="muted sle-storage-footnote">Các bài học mới được thêm tự động khi trình duyệt đủ chỗ. Nếu cập nhật bị chặn do thiếu dung lượng, tiến độ cũ phải được giữ nguyên; không xóa dữ liệu trang web để thử lại. Bản JSON tham chiếu cũ không khôi phục được nguồn bài lịch sử nên không còn là lựa chọn sao lưu chính.</p>
  {status&&<p role="status" aria-live="polite" className="sle-storage-status">{status}</p>}
 </section>;
}
