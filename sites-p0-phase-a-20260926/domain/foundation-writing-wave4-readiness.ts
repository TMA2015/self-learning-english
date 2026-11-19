/**
 * Foundation Writing U10–U12: source-independent, QA-only save contract.
 * This module does not contain learner-facing content or activate any unit.
 * It depends on an immutable, actually saved U09 Draft V1 from PR #174.
 */
export type Wave4Id='FW-U10'|'FW-U11'|'FW-U12';
export type Wave4Draft={cycleAAnswers:Record<string,string>;cycleAOwn?:Record<string,string>;cycleB:Record<string,string>;
 transfer:Record<string,string>;extrasAnswers:Record<string,string>;
 revisionDecision?:''|'NO_CHANGE_JUSTIFIED'|'KEEP_V1_WITH_REASON'|'REVISION_SAVED';
 revisionReason?:string};
export type Version={version:number;savedAt:number;signature:string;draft:Wave4Draft;
 evidence_weight:0;proficiency_weight:0};
export type Wave4Work={draft:Wave4Draft;versions:Version[]};
export type Scope={schemaVersion:1;units:Record<string,unknown>};
export type Staged={unit:Wave4Id;before:Scope;after:Scope;previous:Wave4Work;
 work:Wave4Work;firstDraft:string;addedVersion:boolean};
export type Objective={id:string;stem?:string;key:string;options:{id:string;text:string;rationale:string}[]};
export const reviewedKeys:Readonly<Record<string,string>>=Object.freeze({
 'FW-U10-A-TENSE':'B','FW-U10-A-AGREEMENT':'C','FW-U10-A-KEEP':'D','FW-U10-A-MEANING':'A',
 'FW-U10-F01':'D','FW-U10-F02':'A','FW-U10-F03':'C','FW-U10-F04':'B',
 'FW-U11-A-PRIORITY':'B','FW-U11-A-EVIDENCE':'C','FW-U11-A-KEEP':'D','FW-U11-A-READER':'A',
 'FW-U11-F01':'D','FW-U11-F02':'A','FW-U11-F03':'C','FW-U11-F04':'B',
 'FW-U12-A-COVER':'C','FW-U12-A-GENRE':'A','FW-U12-A-FACTS':'D','FW-U12-A-PLAN':'B',
 'FW-U12-F01':'C','FW-U12-F02':'A','FW-U12-F03':'D','FW-U12-F04':'B'
});
const ids:Wave4Id[]=['FW-U10','FW-U11','FW-U12'];
const obj=(x:unknown):x is Record<string,unknown>=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const stringMap=(x:unknown)=>obj(x)&&Object.values(x).every(v=>typeof v==='string');
const signature=(x:unknown)=>JSON.stringify(x);
function validDraft(x:unknown):x is Wave4Draft{return obj(x)&&stringMap(x.cycleAAnswers)&&
 (x.cycleAOwn===undefined||stringMap(x.cycleAOwn))&&stringMap(x.cycleB)&&stringMap(x.transfer)&&stringMap(x.extrasAnswers)&&
 (x.revisionReason===undefined||typeof x.revisionReason==='string')&&
 (x.revisionDecision===undefined||['','NO_CHANGE_JUSTIFIED','KEEP_V1_WITH_REASON','REVISION_SAVED'].includes(String(x.revisionDecision)))}
function validWork(x:unknown):x is Wave4Work{
 if(!obj(x)||!validDraft(x.draft)||!Array.isArray(x.versions))return false;
 let prev=0,lastAt=0;
 for(const row of x.versions){
  if(!obj(row)||!Number.isInteger(row.version)||row.version!==prev+1||
   typeof row.savedAt!=='number'||!Number.isFinite(row.savedAt)||row.savedAt<=0||row.savedAt<lastAt||
   !validDraft(row.draft)||row.signature!==signature(row.draft)||
   row.evidence_weight!==0||row.proficiency_weight!==0)return false;
  prev=row.version as number;lastAt=row.savedAt as number;
 }
 return true;
}
export function auditObjectives(items:Objective[]){
 const errors:string[]=[],seen=new Set<string>();let rationales=0;
 for(const item of items){
  if(!item||typeof item.id!=='string'){errors.push('bad row');continue;}
  if(seen.has(item.id))errors.push(item.id+': duplicate');seen.add(item.id);
  if(reviewedKeys[item.id]!==item.key)errors.push(item.id+': key not approved');
  if(!Array.isArray(item.options)||item.options.length!==4){errors.push(item.id+': four options required');continue;}
  const optIds=new Set(item.options.map(x=>x.id)),texts=new Set<string>();
  if(optIds.size!==4||!'ABCD'.split('').every(x=>optIds.has(x)))errors.push(item.id+': option IDs');
  for(const o of item.options){
   if(!o||typeof o.text!=='string'||!o.text.trim()||
    texts.has(o.text.trim().toLowerCase()))errors.push(item.id+': option text');
   else texts.add(o.text.trim().toLowerCase());
   if(typeof o?.rationale!=='string'||!o.rationale.trim())errors.push(item.id+': missing rationale');
   else rationales++;
  }
 }
 if(seen.size!==24||items.length!==24||Object.keys(reviewedKeys).some(x=>!seen.has(x)))errors.push('missing or extra item');
 if(rationales!==96)errors.push('missing rationale');
 return {pass:errors.length===0,errors,items:items.length,rationales};
}
/** Reject unknown historical scopes; never silently invent the U09 baseline. */
export function checkedScope(value:unknown):{scope:Scope;firstDraft:string}{
 if(!obj(value)||value.schemaVersion!==1||!obj(value.units))throw Error('Unknown Foundation Writing schema');
 const scope=value as Scope,u09=scope.units['FW-U09'];
 // Units are self-paced; U09 is NOT a mandatory prerequisite for U10–U12.
 // If U09 is present, protect its actual saved Draft V1 exactly.
 let firstDraft='';
 if(u09!==undefined){
  if(!obj(u09)||!Array.isArray(u09.versions))throw Error('Invalid U09 history; preserve learner data');
  if(u09.firstDraftV1!==undefined){
   const first=u09.firstDraftV1;
   if(!obj(first)||typeof first.text!=='string'||!first.text.trim()||
     !Number.isInteger(first.version)||typeof first.savedAt!=='number'||
     !Number.isFinite(first.savedAt)||first.savedAt<=0||
     !u09.versions.some((v:unknown)=>obj(v)&&v.version===first.version&&v.savedAt===first.savedAt&&
       obj(v.draft)&&obj(v.draft.cycleB)&&v.draft.cycleB.draftV1===first.text))
     throw Error('U09 saved Draft V1 identity mismatch');
   firstDraft=first.text;
  }
 }
 for(const unit of ids)if(scope.units[unit]!==undefined&&!validWork(scope.units[unit]))
   throw Error('Invalid Wave 4 history: do not overwrite');
 return {scope,firstDraft};
}
const blank=():Wave4Work=>({draft:{cycleAAnswers:{},cycleAOwn:{},cycleB:{},transfer:{},extrasAnswers:{}},versions:[]});
export function wave4Work(scope:Scope|undefined,unit:Wave4Id):Wave4Work{
 if(!scope)return blank();
 checkedScope(scope);
 return (scope.units[unit]??blank()) as Wave4Work;
}
/** Editing is pure and does not claim a successful save. */
export function edit(scope:Scope,unit:Wave4Id,draft:Wave4Draft):Scope{
 checkedScope(scope);
 if(!ids.includes(unit)||!validDraft(draft))throw Error('Invalid Wave 4 edit');
 const prior=(scope.units[unit]??blank()) as Wave4Work;
 // First nonempty, successfully saved original is immutable even after later edits.
 const firstV1=prior.versions.find(v=>typeof v.draft.cycleB.draftV1==='string'&&
   v.draft.cycleB.draftV1.trim());
 if(firstV1&&draft.cycleB.draftV1!==firstV1.draft.cycleB.draftV1)
  throw Error('Saved original Draft V1 is immutable; edit V2 instead');
 return {...scope,units:{...scope.units,[unit]:{...prior,draft}}};
}
/** Candidate only. Must persist AND read back before claiming success or enabling AI. */
export function stage(scope:Scope,unit:Wave4Id,at:number):Staged{
 const {firstDraft}=checkedScope(scope);
 if(!ids.includes(unit)||!Number.isFinite(at)||at<=0)throw Error('Invalid Wave 4 save request');
 const previous=(scope.units[unit]??blank()) as Wave4Work;
 const current=previous.draft,decision=current.revisionDecision;
 const v1=current.cycleB.draftV1?.trim()??'';
 const v2=(unit==='FW-U10'?current.cycleB.editedV2:current.cycleB.revisedV2)?.trim()??'';
 if(decision==='REVISION_SAVED'&&(!v1||!v2||v1===v2))
  throw Error('A changed V2 must actually differ from saved V1');
 if((decision==='NO_CHANGE_JUSTIFIED'||decision==='KEEP_V1_WITH_REASON')&&
   (!(current.revisionReason??'').trim()||(v2&&v2!==v1)))
  throw Error('Keep/no-change requires an explanation and cannot claim a changed V2');
 const priorOriginal=previous.versions.find(v=>typeof v.draft.cycleB.draftV1==='string'&&
   v.draft.cycleB.draftV1.trim()===v1);
 if((v2&&v1!==v2)||decision==='REVISION_SAVED'||decision==='NO_CHANGE_JUSTIFIED'||decision==='KEEP_V1_WITH_REASON'){
  if(!priorOriginal)throw Error('Save the independent V1 first before revision or keep decision');
  if(v2&&!decision)throw Error('Record why the edited V2 differs from V1');
 }
 const sig=signature(previous.draft),last=previous.versions.at(-1);
 if(!last||last.signature!==sig){
  if(previous.versions.length>=100)throw Error('Version limit reached; export backup');
  if(last&&at<last.savedAt)throw Error('Non-monotonic save time');
 }
 const next:Wave4Work=last?.signature===sig?previous:{draft:previous.draft,versions:[...previous.versions,
  {version:(last?.version??0)+1,savedAt:at,signature:sig,
   draft:JSON.parse(sig) as Wave4Draft,evidence_weight:0,proficiency_weight:0}]};
 const after:Scope={...scope,units:{...scope.units,[unit]:next}};
 return {unit,before:scope,after,previous,work:next,firstDraft,addedVersion:next!==previous};
}
/** Independent persisted readback proof, not just a resolved save promise. */
export function verifyReadback(s:Staged,stored:unknown):boolean{
 let record:{scope:Scope;firstDraft:string};
 try{record=checkedScope(stored);}catch{return false;}
 const {scope,firstDraft}=record;
 if(firstDraft!==s.firstDraft)return false;
 if(signature(scope.units[s.unit])!==signature(s.work))return false;
 const siblings=(x:Scope)=>Object.fromEntries(Object.entries(x.units).filter(([id])=>id!==s.unit));
 return signature(siblings(scope))===signature(siblings(s.before));
}
/** On failed write, remove only our matching phantom snapshot; keep current unsaved text. */
export function rollback(current:Scope,s:Staged):{scope:Scope;rolledBack:boolean}{
 if(!s.addedVersion||current.schemaVersion!==1)return {scope:current,rolledBack:false};
 const w=current.units[s.unit];if(!validWork(w)||signature(w.versions)!==signature(s.work.versions))
  return {scope:current,rolledBack:false};
 const restored={...w,versions:s.previous.versions};
 return {scope:{...current,units:{...current.units,[s.unit]:restored}},rolledBack:true};
}
/** Only exact saved revisions can be supplied to a future, separately implemented AI route. */
export function eligibleArtifact(unit:Wave4Id,work:Wave4Work,fixture:string,required:string[]):string|null{
 if(!ids.includes(unit)||!validWork(work)||!['B','T'].some(x=>fixture===unit+'-'+x)||
  !Array.isArray(required)||!required.length||new Set(required).size!==required.length)return null;
 const latest=work.versions.at(-1);if(!latest||latest.signature!==signature(work.draft))return null;
 const fields=fixture.endsWith('-B')?latest.draft.cycleB:latest.draft.transfer;
 if(!required.every(k=>typeof fields[k]==='string'&&fields[k].trim()))return null;
 const text=required.map(k=>k+': '+fields[k].trim()).join('\n');
 return text.length>=20&&text.length<=7000?text:null;
}
