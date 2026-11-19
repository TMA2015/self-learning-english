/**
 * Foundation Writing Wave 4 source intake. NO learner-facing U10–U12 content is
 * shipped by this file. The authored Markdown must be independently verified
 * against its original bytes before mapping to this schema.
 */
import {auditObjectives,reviewedKeys,type Objective,type Wave4Id} from './foundation-writing-wave4-readiness';
export const WAVE4_SOURCE_NAME='SLE_FOUNDATION_WRITING_AUTHORING_WAVE4_U10-U12_DRAFT_20261118.md';
export const WAVE4_SOURCE_SHA256='cca51171781dc535c6a4080107b0204561b850cfcaf33e089fce2eb184468083';
export const WAVE4_NOTEBOOKLM_VERDICT='SLE-FW-AUTH-W4-NBLM-R1-20261118';
export type TaskStrip={topic:string;task:string;mustInclude:string;boundary:string};
export type OwnField={key:string;label:string;requiredForAI?:boolean};
export type Stage={id:string;prompt:string;taskStrip:TaskStrip;fields:OwnField[]};
export type Wave4Lesson={
 id:Wave4Id;title:string;outcome:string;minutes:string;
 source:{document:string;sha256:string;notebooklm:string;verdict:'PASS';requiredChanges:'NONE'};
 teaching:{lessons:[string,string];demo:{id:string;prompt:string;steps:[string,string][]};
  a1:string;b1:string};
 cycleA:{id:string;prompt:string;taskStrip:TaskStrip;items:Objective[];ownFields:OwnField[]};
 cycleB:Stage;transfer:Stage;extras:Objective[];
};
const ids:Wave4Id[]=['FW-U10','FW-U11','FW-U12'];
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const words=(x:unknown,min=1)=>typeof x==='string'&&x.trim().length>=min;
const taskStrip=(x:unknown)=>record(x)&&['topic','task','mustInclude','boundary'].every(k=>words(x[k],8));
const fields=(x:unknown)=>Array.isArray(x)&&x.length>=1&&x.every(
 (f:unknown)=>record(f)&&words(f.key)&&/^[a-z][a-zA-Z0-9]*$/.test(String(f.key))&&words(f.label,5)&&
 (f.requiredForAI===undefined||typeof f.requiredForAI==='boolean')
)&&new Set(x.map((f:OwnField)=>f.key)).size===x.length;
const ownStage=(x:unknown,expectedId:string)=>record(x)&&x.id===expectedId&&words(x.prompt,25)&&
 taskStrip(x.taskStrip)&&fields(x.fields);
export type ContentVerdict={pass:boolean;errors:string[];lessons:number;objectives:number;rationales:number;
 sourceVerifiedByByteHash:false};
/**
 * Enforces IDs, objective answer/rationale counts, source provenance metadata,
 * independently worked teaching, task-map coverage and generative field structure.
 * Does NOT claim semantic fidelity: the original Markdown bytes must be checked
 * separately by a SHA-256 program and a human source-to-UI review.
 */
export function validateWave4Bundle(input:unknown):ContentVerdict{
 const errors:string[]=[];let objectives=0,rationales=0;
 if(!Array.isArray(input)||input.length!==3)
  return {pass:false,errors:['exactly three U10–U12 content records are required'],
   lessons:Array.isArray(input)?input.length:0,objectives:0,rationales:0,sourceVerifiedByByteHash:false};
 const found=new Set<string>();
 for(const row of input){
  if(!record(row)||!ids.includes(row.id as Wave4Id)){errors.push('invalid unit ID');continue;}
  const id=row.id as Wave4Id;
  if(found.has(id))errors.push(id+' duplicated');found.add(id);
  if(!words(row.title,8)||!words(row.outcome,20)||!words(row.minutes))errors.push(id+' goal/title/time missing');
  const meta=row.source;
  if(!record(meta)||meta.document!==WAVE4_SOURCE_NAME||meta.sha256!==WAVE4_SOURCE_SHA256||
   meta.notebooklm!==WAVE4_NOTEBOOKLM_VERDICT||meta.verdict!=='PASS'||
   meta.requiredChanges!=='NONE')errors.push(id+' source/academic provenance mismatch');
  const t=row.teaching;
  if(!record(t)||!Array.isArray(t.lessons)||t.lessons.length!==2||
   !t.lessons.every((s:unknown)=>words(s,30))||!words(t.a1,5)||!words(t.b1,5)||
   !record(t.demo)||t.demo.id!==id+'-D01'||!words(t.demo.prompt,25)||
   !Array.isArray(t.demo.steps)||t.demo.steps.length<5||
   !t.demo.steps.every((p:unknown)=>Array.isArray(p)&&p.length===2&&words(p[0])&&words(p[1],12)))
   errors.push(id+' independent worked teaching missing');
  const a=row.cycleA,b=row.cycleB,tr=row.transfer;
  if(!record(a)||a.id!==id+'-A'||!words(a.prompt,25)||!taskStrip(a.taskStrip)||
   !fields(a.ownFields))errors.push(id+' Cycle A/Task Map/own explanation missing');
  if(!ownStage(b,id+'-B'))errors.push(id+' Cycle B generative work missing');
  if(!ownStage(tr,id+'-T'))errors.push(id+' independent transfer missing');
  if(record(t)&&record(t.demo)&&record(a)&&record(b)&&record(tr)){
   const prompts=[t.demo.prompt,a.prompt,b.prompt,tr.prompt];
   if(prompts.every(x=>typeof x==='string')&&new Set(prompts.map(x=>String(x).trim())).size!==4)
    errors.push(id+' worked model reuses an active task verbatim');
  }
  const local=[...(record(a)&&Array.isArray(a.items)?a.items:[]),
   ...(Array.isArray(row.extras)?row.extras:[])];
  if(!record(a)||!Array.isArray(a.items)||a.items.length!==4||
   !Array.isArray(row.extras)||row.extras.length!==4)
   errors.push(id+' requires 4 embedded and 4 supplemental objective items');
  objectives+=local.length;
  if(local.some(q=>!record(q)||!words(q.stem,20)))errors.push(id+' original learner-facing question stems missing');
  for(const q of local)if(record(q)&&Array.isArray(q.options))
   rationales+=q.options.filter((o:unknown)=>record(o)&&words(o.rationale)).length;
  const expect=Object.keys(reviewedKeys).filter(k=>k.startsWith(id+'-'));
  if(expect.length!==8||local.length!==8||
   new Set(local.map((q:unknown)=>record(q)?q.id:'')).size!==8||
   !expect.every(k=>local.some((q:unknown)=>record(q)&&q.id===k)))
   errors.push(id+' objective IDs missing/cross-unit');
 }
 if(found.size!==3)errors.push('missing one or more Wave 4 units');
 if(objectives!==24||rationales!==96)errors.push('expected 24 objective items and 96 option rationales');
 const all=input.flatMap((x:unknown)=>record(x)?[
  ...(record(x.cycleA)&&Array.isArray(x.cycleA.items)?x.cycleA.items:[]),
  ...(Array.isArray(x.extras)?x.extras:[])]:[]);
 const audit=auditObjectives(all as Objective[]);
 if(!audit.pass)errors.push(...audit.errors.map(x=>'objectives: '+x));
 return {pass:errors.length===0,errors,lessons:found.size,objectives,rationales,sourceVerifiedByByteHash:false};
}
