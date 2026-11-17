import {
 verifyR4tSegmentedResearchBackup,type R4tPacket
} from '../../domain/lesson-revision-segmented-backup-r4t';
import {
 restoreR4uVerifiedParts,inspectR4uRestoredFullArchive,R4V_DB
} from '../storage/r4u-segmented-disposable-restore';

/**
 * R4v: NON-PRODUCTION local-only download/choose/preview/restore pilot.
 * This is a custom one-File binary envelope for the already validated R4t
 * 46-part research archive. Not compatible with V2/V3 production backups.
 * No remote uploads, no production routes, no automatic browser migration.
 *
 * Real Safari performance, File/Files save behavior and peak RAM UNTESTED.
 */
export const R4V_FILE_EXTENSION='.slepack';
const MAGIC='SLEPK001'; // fixed 8-byte ASCII marker
const HEADER_BYTES=12,MAX_MANIFEST=4_000_000;
const MAX_TOTAL_BYTES=260_000_000,MAX_PARTS=512,MAX_PART_BYTES=1_000_000;
type Item={index:number;bytes:number};
const error=(s:string)=>Error('R4v local research file rejected: '+s);
const encoder=new TextEncoder();
const hasOnlySafeLength=(n:unknown,max:number)=>Number.isSafeInteger(n)&&
 (n as number)>0&&(n as number)<=max;
export async function buildR4vSingleFile(
 packet:R4tPacket
):Promise<Blob>{
 await verifyR4tSegmentedResearchBackup(packet);
 const manifestBytes=encoder.encode(packet.manifestText);
 if(!hasOnlySafeLength(manifestBytes.length,MAX_MANIFEST))
  throw error('Manifest too large');
 const head=new ArrayBuffer(HEADER_BYTES);
 const bytes=new Uint8Array(head);
 bytes.set(encoder.encode(MAGIC));
 new DataView(head).setUint32(8,manifestBytes.length,false);
 const blob=new Blob([head,packet.manifestText,...packet.parts.map(p=>p.text)],{
  type:'application/octet-stream'
 });
 if(blob.size>MAX_TOTAL_BYTES)throw error('Archive size is too large');
 return blob;
}
/** Validate framing and every original source BEFORE returning any restore data. */
export async function inspectR4vSingleFile(file:Blob):Promise<{
 packet:R4tPacket;size:number;lessons:number;attempts:number;partCount:number
}>{
 if(!(file instanceof Blob)||file.size<HEADER_BYTES||
  file.size>MAX_TOTAL_BYTES)
  throw error('Missing, empty or oversized selected File');
 const header=await file.slice(0,HEADER_BYTES).arrayBuffer();
 const raw=new Uint8Array(header);
 const magic=String.fromCharCode(...Array.from(raw.slice(0,8)));
 if(magic!==MAGIC)throw error('Unexpected File format');
 const mLength=new DataView(header).getUint32(8,false);
 if(!hasOnlySafeLength(mLength,MAX_MANIFEST)||
  HEADER_BYTES+mLength>file.size)
  throw error('Truncated or oversized manifest');
 const manifestText=await file.slice(
  HEADER_BYTES,HEADER_BYTES+mLength).text();
 let parsed:unknown;
 try{parsed=JSON.parse(manifestText)}catch{throw error('Unreadable manifest')}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))
  throw error('Malformed manifest');
 const m=parsed as {parts?:unknown};
 if(!Array.isArray(m.parts)||!m.parts.length||m.parts.length>MAX_PARTS)
  throw error('Invalid part inventory');
 const specs:Item[]=[];
 let expectedTotal=HEADER_BYTES+mLength;
 for(let i=0;i<m.parts.length;i++){
  const spec=m.parts[i] as Item|undefined;
  if(!spec||spec.index!==i||!hasOnlySafeLength(spec.bytes,MAX_PART_BYTES))
   throw error('Invalid part length/order');
  expectedTotal+=spec.bytes;
  if(!Number.isSafeInteger(expectedTotal)||expectedTotal>MAX_TOTAL_BYTES)
   throw error('Part inventory exceeds size limit');
  specs.push(spec);
 }
 // Prevent reading any chunk if the File is truncated or has trailing junk.
 if(expectedTotal!==file.size)
  throw error('Missing, truncated or additional bytes');
 let offset=HEADER_BYTES+mLength;
 const parts:R4tPacket['parts']=[];
 for(const spec of specs){
  const end=offset+spec.bytes;
  parts.push({index:spec.index,text:await file.slice(offset,end).text()});
  offset=end;
 }
 const packet={manifestText,parts};
 const verified=await verifyR4tSegmentedResearchBackup(packet);
 if(verified.bytes!==file.size-HEADER_BYTES)
  throw error('Verified source bytes differ from selected File');
 return {packet,size:file.size,lessons:verified.activeLessons,
  attempts:verified.attempts,partCount:verified.partCount};
}
type Preview=Awaited<ReturnType<typeof inspectR4vSingleFile>>;
/** An actual DOM-based pilot; user selection is never inferred as consent to restore. */
export function mountR4vIsolatedDemoUI(
 root:HTMLElement,source:R4tPacket,factory:IDBFactory
):{getLastExportBlob():Blob|null}{
 root.replaceChildren();
 const h=document.createElement('h2');
 h.textContent='Bản thử sao lưu Self-Learning English (dữ liệu giả lập)';
 const notice=document.createElement('p');
 notice.textContent='Chỉ dùng để kiểm tra. Không dùng với bài làm thật. Không gửi dữ liệu lên mạng.';
 const exportButton=document.createElement('button');
 exportButton.type='button';
 exportButton.dataset.r4v='export';
 exportButton.textContent='1. Tải bản sao lưu mẫu';
 const fileInput=document.createElement('input');
 fileInput.type='file';
 fileInput.accept='.slepack,application/octet-stream';
 fileInput.dataset.r4v='file';
 fileInput.setAttribute('aria-label','Chọn bản sao lưu mẫu');
 const previewButton=document.createElement('button');
 previewButton.type='button';
 previewButton.dataset.r4v='restore';
 previewButton.textContent='3. Khôi phục vào hồ sơ thử nghiệm trống';
 previewButton.disabled=true;
 const status=document.createElement('p');
 status.dataset.r4v='status';
 status.dataset.state='IDLE';
 status.setAttribute('aria-live','polite');
 status.textContent='Chọn tệp chỉ để kiểm tra; khôi phục cần thao tác xác nhận riêng.';
 root.appendChild(h);
 root.appendChild(notice);
 root.appendChild(exportButton);
 root.appendChild(fileInput);
 root.appendChild(previewButton);
 root.appendChild(status);
 let lastExport:Blob|null=null,selected:Preview|null=null;
 let generation=0,restoring=false,finished=false;
 function state(code:string,message:string){
  status.dataset.state=code;
  status.textContent=message;
 }
 exportButton.addEventListener('click',()=>{
  void (async()=>{
   state('EXPORTING','Đang kiểm tra bản sao lưu mẫu...');
   exportButton.disabled=true;
   try{
    const blob=await buildR4vSingleFile(source);
    lastExport=blob;
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download='SLE-SYNTHETIC-ONLY'+R4V_FILE_EXTENSION;
    link.dataset.r4v='download';
    root.appendChild(link);
    link.click();
    // Revoke after the browser is given an opportunity to start download.
    setTimeout(()=>{URL.revokeObjectURL(url);link.remove()},2000);
    state('EXPORTED','Đã chuẩn bị tệp sao lưu mẫu. Chọn tệp để kiểm tra trước khi khôi phục.');
   }catch(e){
    state('EXPORT_FAILED','Không thể tạo tệp mẫu: '+String(e));
   }finally{exportButton.disabled=false}
  })();
 });
 fileInput.addEventListener('change',()=>{
  void (async()=>{
   if(restoring||finished)return;
   const token=++generation;
   selected=null;previewButton.disabled=true;
   const file=fileInput.files?.[0];
   if(!file){state('NO_FILE','Chưa chọn tệp.');return}
   state('VERIFYING','Đang kiểm tra đầy đủ tệp, chưa ghi dữ liệu...');
   try{
    const result=await inspectR4vSingleFile(file);
    if(token!==generation)return;
    selected=result;
    previewButton.disabled=false;
    state('FILE_VERIFIED','Đã kiểm tra: '+result.lessons+
     ' bài giả lập, '+result.attempts+' bài làm, '+result.partCount+
     ' phần. Chưa khôi phục.');
   }catch(e){
    if(token!==generation)return;
    state('FILE_INVALID','Tệp bị từ chối, chưa ghi dữ liệu: '+String(e));
   }
  })();
 });
 previewButton.addEventListener('click',()=>{
  void (async()=>{
   if(restoring||finished||!selected)return;
   restoring=true;
   fileInput.disabled=true;
   previewButton.disabled=true;
   exportButton.disabled=true;
   const accepted=selected;
   state('RESTORING','Đang khôi phục vào hồ sơ GIẢ LẬP trống...');
   try{
    const committed=await restoreR4uVerifiedParts(
     factory,accepted.packet,false,R4V_DB);
    if(committed.status!=='COMMITTED')throw error('Restore was not committed');
    const inspected=await inspectR4uRestoredFullArchive(factory,R4V_DB);
    if(inspected.lessons!==accepted.lessons||
     inspected.attempts!==accepted.attempts||
     inspected.parts!==accepted.partCount)
     throw error('Post-restore counts differ from original selected File');
    finished=true;
    state('RESTORE_OK','Khôi phục và đối chiếu thành công '+
     inspected.lessons+' bài, '+inspected.attempts+
     ' bài làm giả lập. Bản dữ liệu cũ không thay đổi.');
   }catch(e){
    state('RESTORE_FAILED','Khôi phục bị từ chối: '+String(e));
   }finally{
    restoring=false;
    if(!finished){fileInput.disabled=false;exportButton.disabled=false}
   }
  })();
 });
 return {getLastExportBlob:()=>lastExport};
}
