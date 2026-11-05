import React from 'react';
import {createRoot} from 'react-dom/client';
import {LocalBackupPanel} from '../app/local-backup-panel';
import {BrowserLocalAcademicRepository} from '../infrastructure/storage/browser-local-repositories';
import {sourceDigest} from '../application/academic-service';
import {mapSeed,type Seed} from '../domain/academic';
import curriculum from '../content/curriculum-1.18.1-candidate.json';

const PREFIX='g-learning:english:v1';
const mode=new URL(location.href).searchParams.get('phase');
const report=(value:string,details:unknown)=>{
 document.getElementById('sle-test-result')!.textContent=value+' '+JSON.stringify(details);
 document.documentElement.setAttribute('data-sle-panel',value);
};
const assert=(value:unknown,message:string)=>{if(!value)throw new Error('UI ASSERT: '+message)};
const wait=async(fn:()=>boolean,message:string)=>{
 for(let n=0;n<400;n++){
  if(fn())return;
  await new Promise(resolve=>setTimeout(resolve,30));
 }
 throw Error('UI TIMEOUT: '+message);
};
const findButton=(caption:string)=>{
 return [...document.querySelectorAll('button')].find(b=>b.textContent?.includes(caption)) as HTMLButtonElement|undefined;
};
const action=async(caption:string)=>{
 const button=findButton(caption);
 assert(button&&!button.disabled,'Button missing or disabled: '+caption);
 button!.click();
};
const status=()=>document.querySelector('[role="status"]')?.textContent??'';
const upload=async(id:string,contents:string,filename:string)=>{
 const input=document.getElementById(id) as HTMLInputElement|null;
 assert(input&&!input.disabled,'File upload missing or disabled: '+id);
 const file=new File([contents],filename,{type:'application/json'});
 const transfer=new DataTransfer();
 transfer.items.add(file);
 input!.files=transfer.files;
 input!.dispatchEvent(new Event('change',{bubbles:true}));
};
const pkg=async(version:string)=>{
 const source={...(curriculum as Seed),schema_version:version};
 return {id:source.package_id,version,digest:await sourceDigest(source),
  source,bundle:mapSeed(source),at:Date.now()};
};
(async()=>{
 const key=PREFIX+':academic:packages';
 const savedFileKey='__sle-v2-ui-disposable-backup';
 const owner='local-family';
 const lessonId=(curriculum as Seed).lessons[0].id;
 let downloadBlob:Blob|null=null;
 const originalURL=URL.createObjectURL;
 const originalClick=HTMLAnchorElement.prototype.click;
 URL.createObjectURL=(blob:Blob|MediaSource)=>{downloadBlob=blob as Blob;return 'blob:mock-download'};
 HTMLAnchorElement.prototype.click=function(){};
 try{
  const repo=new BrowserLocalAcademicRepository(localStorage);
  if(mode==='backup'){
   localStorage.clear(); // LOCALHOST ONLY + unique Chrome QA temporary profile
   await repo.addPackage(await pkg('1.18.0'));
   const attempt={id:'ui-backup-historical-001',rootId:'ui-backup-historical-001',
     packageId:(curriculum as Seed).package_id,version:'1.18.0',lessonId,
     status:'started' as const,answers:{},createdAt:Date.now(),evidence:[]};
   await repo.start(owner,attempt);
   await repo.addPackage(await pkg('1.18.1'));
  }else if(mode==='recovery'){
   const file=localStorage.getItem(savedFileKey);
   assert(file,'Downloaded recovery file was not available after real Chrome restart');
   localStorage.clear(); // LOCALHOST ONLY + unique Chrome QA temporary profile
   await repo.addPackage(await pkg('1.18.1'));
   localStorage.setItem(savedFileKey,file!);
  }else throw Error('Unknown UI phase');
  const domRoot=createRoot(document.getElementById('app')!);
  domRoot.render(React.createElement(LocalBackupPanel));
  await wait(()=>!!findButton('Preview storage cleanup'),'panel mount');
  if(mode==='backup'){
   await action('Preview storage cleanup');
   await wait(()=>!!document.querySelector('.foundation-storage-inspection'),'retention preview');
   assert(findButton('Confirm compact storage')?.disabled,'Must not permit cleanup without verified saved backup');
   await action('Download complete recovery JSON');
   await wait(()=>status().includes('Complete V2 recovery JSON prepared'),'download action');
   assert(downloadBlob,'Download actually generated browser Blob');
   const content=await downloadBlob!.text();
   localStorage.setItem(savedFileKey,content);
   const rawFile=JSON.parse(content);
   assert(rawFile.schemaVersion===2&&rawFile.entries.length>0,'complete V2 file format');
   await upload('sle-v2-verify-file',content,'test-downloaded-recovery-v2.json');
   await wait(()=>status().includes('Saved recovery file verified'),'file selection and verification');
   assert(!findButton('Confirm compact storage')?.disabled,'Verified complete recovery must unlock cleanup');
   const before=localStorage.getItem(key)!.length;
   await action('Confirm compact storage');
   await wait(()=>status().includes('Curriculum storage compacted safely'),'compact UI finished');
   const doc=JSON.parse(localStorage.getItem(key)!);
   assert(doc.schema===2&&doc.records.length===2,'legacy archive plus current complete');
   assert(doc.records.filter((v:any)=>!v.archive).length===1,'one current full source');
   assert((await repo.attempts(owner)).length===1,'learner attempt intact');
   report('PASS_BACKUP_PANEL',{before,after:localStorage.getItem(key)!.length,
     attempts:1,savedFile:true,buttonGate:true});
  }else{
   const content=localStorage.getItem(savedFileKey)!;
   await upload('sle-v2-recovery-file',content,'test-downloaded-recovery-v2.json');
   await wait(()=>!!findButton('Confirm recovery into this empty profile'),'restore preview');
   assert(!findButton('Confirm recovery into this empty profile')?.disabled,'restore action available on empty learner profile');
   await action('Confirm recovery into this empty profile');
   await wait(()=>status().includes('Recovery verified:'),'restore UI finished');
   assert((await repo.attempts(owner)).length===1,'historical attempt restored through React UI');
   const lessons=await repo.packages();
   // Recovery faithfully restores the pre-compaction source file selected
   // by the parent. Older full packages may be compacted again only after
   // another explicit on-device verification, never during restore.
   assert(lessons.find(x=>x.version==='1.18.0')?.source.lessons.some(l=>l.id===lessonId),
    'version-pinned historical lesson restored from parent-selected backup');
   assert(localStorage.getItem(PREFIX+':recovery-pending-v2')===null,'no pending transaction marker');
   await upload('sle-v2-recovery-file',content,'test-downloaded-recovery-v2.json');
   await wait(()=>status().includes('already contains learner data'),'restore duplicate blocked');
   report('PASS_RESTORE_PANEL',{attempts:1,versions:lessons.length,duplicateBlocked:true});
  }
 }finally{
  URL.createObjectURL=originalURL;
  HTMLAnchorElement.prototype.click=originalClick;
 }
})().catch(error=>report('FAIL',{error:String(error),stack:String((error as Error).stack).slice(0,1500)}));
