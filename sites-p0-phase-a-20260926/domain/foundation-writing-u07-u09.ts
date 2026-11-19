import u07 from '../content/foundation-writing-u07.json';
import u08 from '../content/foundation-writing-u08.json';
import u09 from '../content/foundation-writing-u09.json';
import type {FoundationWritingV1} from './foundation-writing-u01';

export const WAVE3_UNITS={'FW-U07':u07,'FW-U08':u08,'FW-U09':u09} as const;
export type Wave3Id=keyof typeof WAVE3_UNITS;
export type Wave3Artifact='cycleA'|'cycleB'|'transfer';
export type Wave3Draft={
 cycleAAnswers:Record<string,string>;cycleAReveal:boolean;
 cycleAOrder:string;cycleAOrderReveal:boolean;
 cycleACover:string[];cycleACoverReveal:boolean;
 cycleAOwn:Record<string,string>;cycleB:Record<string,string>;
 transfer:Record<string,string>;
 extrasAnswers:Record<string,string>;extrasReveal:Record<string,boolean>;
};
export type Wave3Version={
 version:number;savedAt:number;signature:string;draft:Wave3Draft;
 evidence_weight:0;proficiency_weight:0;
};
export type FirstDraftV1={text:string;version:number;savedAt:number};
export type Wave3Work={draft:Wave3Draft;versions:Wave3Version[];firstDraftV1?:FirstDraftV1};
const ownKeys:{[K in Wave3Id]:readonly string[]}={
 'FW-U07':['repair','reason'],
 'FW-U08':['repair','reason'],
 'FW-U09':['repair','reason']
};
export const blankWave3Draft=():Wave3Draft=>({
 cycleAAnswers:{},cycleAReveal:false,cycleAOrder:'',cycleAOrderReveal:false,
 cycleACover:[],cycleACoverReveal:false,cycleAOwn:{},cycleB:{},transfer:{},
 extrasAnswers:{},extrasReveal:{}
});
export const emptyWave3Work=():Wave3Work=>({draft:blankWave3Draft(),versions:[]});
export function wave3Work(scope:FoundationWritingV1|undefined,unit:Wave3Id):Wave3Work{
 if(scope&&scope.schemaVersion!==1)throw Error('Unknown Foundation Writing version: preserve learner data.');
 const work=scope?.units?.[unit];
 if(!work)return emptyWave3Work();
 if(!work.draft||!Array.isArray(work.versions)||
   !work.versions.every(v=>v&&Number.isInteger(v.version)&&typeof v.signature==='string'&&
    v.draft&&v.evidence_weight===0&&v.proficiency_weight===0))
   throw Error('Invalid Foundation Writing Wave 3 history; do not overwrite.');
 if(unit==='FW-U09'&&work.firstDraftV1&&
  !work.versions.some(v=>v.version===work.firstDraftV1?.version&&
   v.draft.cycleB.draftV1===work.firstDraftV1?.text))
   throw Error('Original U09 Draft V1 identity mismatch; preserve learner backup.');
 return work;
}
export const wave3Signature=(draft:Wave3Draft):string=>JSON.stringify(draft);
export function appendWave3Version(work:Wave3Work,now:number,unit:Wave3Id):Wave3Work{
 if(!Number.isFinite(now)||now<=0)throw Error('Invalid save time');
 const signature=wave3Signature(work.draft);
 const prev=work.versions.at(-1);
 if(prev?.signature===signature)return work;
 if(work.versions.length>=100)throw Error('Version retention limit; export a learner backup.');
 const version=(prev?.version??0)+1;
 const snap:Wave3Version={version,savedAt:now,signature,
   draft:JSON.parse(signature) as Wave3Draft,evidence_weight:0,proficiency_weight:0};
 let firstDraftV1=work.firstDraftV1;
 if(unit==='FW-U09'&&!firstDraftV1&&snap.draft.cycleB.planRoles?.trim()&&snap.draft.cycleB.draftV1?.trim()&&snap.draft.cycleB.commitmentNote?.trim()){
  firstDraftV1={text:snap.draft.cycleB.draftV1,version,savedAt:now};
 }
 return {...work,versions:[...work.versions,snap],...(firstDraftV1?{firstDraftV1}:{})};
}
export function exactSavedWave3(work:Wave3Work):Wave3Version|null{
 const v=work.versions.at(-1);
 return v?.signature===wave3Signature(work.draft)?v:null;
}
export function supplementalWave3Result(unit:Wave3Id,id:string,choice:string){
 const item=WAVE3_UNITS[unit].extras.find(q=>q.id===id);
 if(!item||!item.options.some(x=>x.id===choice))return null;
 return {correct:item.key===choice,key:item.key,rationales:item.options};
}
export function cycleAWave3Result(unit:Wave3Id,id:string,choice:string){
 if(unit==='FW-U09'){
  const c=WAVE3_UNITS['FW-U09'].cycleA.cards.find(x=>x.id===id);
  return c&&WAVE3_UNITS['FW-U09'].cycleA.labels.includes(choice)?
   {correct:c.key===choice,key:c.key,rationale:c.rationale}:null;
 }
 const list=unit==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.objective:
  WAVE3_UNITS['FW-U08'].cycleA.objective;
 const q=list.find(x=>x.id===id);
 return q&&q.options.some(x=>x.id===choice)?
  {correct:q.key===choice,key:q.key,rationales:q.options}:null;
}
export function coverWave3Result(unit:Wave3Id,selected:string[]){
 if(unit!=='FW-U09')return null;
 const required=WAVE3_UNITS['FW-U09'].cycleA.cover.key;
 return {correct:selected.length===required.length&&
  required.every(x=>selected.includes(x)),expected:required};
}
const ownTask=(unit:Wave3Id,artifact:Wave3Artifact)=>{
 const c=WAVE3_UNITS[unit];
 return artifact==='cycleA'?c.cycleA.prompt:artifact==='cycleB'?c.cycleB.prompt:c.transfer.prompt;
};
const ownFixture=(unit:Wave3Id,artifact:Wave3Artifact)=>{
 const c=WAVE3_UNITS[unit];
 return artifact==='cycleA'?c.cycleA.id:artifact==='cycleB'?c.cycleB.id:c.transfer.id;
};
export function wave3Required(unit:Wave3Id,artifact:Wave3Artifact){
 const c=WAVE3_UNITS[unit];
 return artifact==='cycleA'?ownKeys[unit]:
 artifact==='cycleB'?c.cycleB.fields.map(f=>f.key):c.transfer.fields.map(f=>f.key);
}
export function wave3Artifact(unit:Wave3Id,draft:Wave3Draft,artifact:Wave3Artifact){
 const fields=artifact==='cycleA'?draft.cycleAOwn:artifact==='cycleB'?draft.cycleB:draft.transfer;
 const required=wave3Required(unit,artifact);
 return {unitId:unit,fixtureId:ownFixture(unit,artifact),task:ownTask(unit,artifact),
 text:required.map(key=>key+': '+(fields[key]??'').trim()).join('\n')+
  (artifact==='cycleB'&&unit==='FW-U09'?'\n[Draft V1 is learner-owned; no automatic scoring.]':'')};
}
export function eligibleWave3Artifact(unit:Wave3Id,work:Wave3Work,artifact:Wave3Artifact){
 if(!exactSavedWave3(work))return null;
 const fields=artifact==='cycleA'?work.draft.cycleAOwn:
  artifact==='cycleB'?work.draft.cycleB:work.draft.transfer;
 if(!wave3Required(unit,artifact).every(key=>typeof fields[key]==='string'&&!!fields[key].trim()))return null;
 const a=wave3Artifact(unit,work.draft,artifact);
 return a.text.length>=20&&a.text.length<=7000?a:null;
}
export function wave3Progress(unit:Wave3Id,work:Wave3Work){
 const d=work.draft,source=WAVE3_UNITS[unit];
 const fixed=unit==='FW-U09'?
  WAVE3_UNITS['FW-U09'].cycleA.cards.every(c=>!!d.cycleAAnswers[c.id]):
  (unit==='FW-U07'?WAVE3_UNITS['FW-U07'].cycleA.objective:
    WAVE3_UNITS['FW-U08'].cycleA.objective).every(c=>!!d.cycleAAnswers[c.id]);
 return {cycleA:fixed&&d.cycleAReveal&&(
  unit==='FW-U09'?d.cycleACoverReveal:
  !!d.cycleAOrder&&d.cycleAOrderReveal),
  ownA:!!eligibleWave3Artifact(unit,work,'cycleA'),
  ownB:!!eligibleWave3Artifact(unit,work,'cycleB'),
  transfer:!!eligibleWave3Artifact(unit,work,'transfer'),
  extras:source.extras.every(q=>!!d.extrasAnswers[q.id]&&!!d.extrasReveal[q.id]),
  evidence_weight:0 as const,proficiency_weight:0 as const};
}
