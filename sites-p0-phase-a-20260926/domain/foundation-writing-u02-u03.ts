import u02 from '../content/foundation-writing-u02.json';
import u03 from '../content/foundation-writing-u03.json';
import type {FoundationWritingV1} from './foundation-writing-u01';

export const REVIEWED_FOUNDATION_UNITS={'FW-U02':u02,'FW-U03':u03} as const;
export type NextUnitId=keyof typeof REVIEWED_FOUNDATION_UNITS;
export type IdeaStatus=''|'Fits'|'Needs clarification'|'Off-task';
export type Idea={text:string;fit:IdeaStatus;fitReason:string};
export type IdeaBank={ideas:Idea[];chosenIndex:string;rationale:string;setAside:string;concrete:string};
export type Chain={claim:string;reason:string;detail:string};
export type U02Draft={
 cycleASorts:Record<string,string>;revealCycleA:boolean;repairCard:string;repair:string;explanation:string;
 cycleBBank:IdeaBank;transferBank:IdeaBank;
 supplementalAnswers:Record<string,string>;revealSupplemental:Record<string,boolean>;
};
export type U03Draft={
 cycleARoles:Record<string,string>;revealCycleA:boolean;repairCard:string;repairA:string;
 cycleBDiagnoses:Record<string,string>;revealCycleB:boolean;weakChoice:string;weakRepair:string;
 chainA:Chain;chainB:Chain;transferA:Chain;transferB:Chain;
 supplementalAnswers:Record<string,string>;revealSupplemental:Record<string,boolean>;
};
export type NextDraft=U02Draft|U03Draft;
export type NextUnitVersion<T extends NextDraft=NextDraft>={
 version:number;savedAt:number;signature:string;draft:T;evidence_weight:0;proficiency_weight:0;
};
export type NextUnitWork<T extends NextDraft=NextDraft>={draft:T;versions:NextUnitVersion<T>[]};
export const blankIdea=():Idea=>({text:'',fit:'',fitReason:''});
export const blankBank=():IdeaBank=>({ideas:[blankIdea(),blankIdea(),blankIdea()],chosenIndex:'',rationale:'',setAside:'',concrete:''});
export const blankChain=():Chain=>({claim:'',reason:'',detail:''});
export const blankU02=():U02Draft=>({
 cycleASorts:{},revealCycleA:false,repairCard:'',repair:'',explanation:'',
 cycleBBank:blankBank(),transferBank:blankBank(),supplementalAnswers:{},revealSupplemental:{},
});
export const blankU03=():U03Draft=>({
 cycleARoles:{},revealCycleA:false,repairCard:'',repairA:'',
 cycleBDiagnoses:{},revealCycleB:false,weakChoice:'',weakRepair:'',
 chainA:blankChain(),chainB:blankChain(),transferA:blankChain(),transferB:blankChain(),
 supplementalAnswers:{},revealSupplemental:{},
});
export const emptyNextWork=(unit:NextUnitId):NextUnitWork=>({
 draft:unit==='FW-U02'?blankU02():blankU03(),versions:[],
});
export function nextUnitWork(state:FoundationWritingV1|undefined,unit:NextUnitId):NextUnitWork{
 if(state&&state.schemaVersion!==1)throw Error('Unknown Foundation Writing schema. Preserve learner data.');
 const work=state?.units?.[unit];
 if(!work)return emptyNextWork(unit);
 if(!work.draft||!Array.isArray(work.versions)||
  !work.versions.every(v=>v&&typeof v.signature==='string'&&v.draft))
  throw Error('Invalid Foundation Writing progress; preserve learner backup.');
 return work;
}
export const exactSignature=(draft:NextDraft):string=>JSON.stringify(draft);
export function appendNextVersion<T extends NextDraft>(work:NextUnitWork<T>,at:number):NextUnitWork<T>{
 if(!Number.isFinite(at)||at<=0)throw Error('Invalid save timestamp');
 const signature=exactSignature(work.draft),last=work.versions.at(-1);
 if(last?.signature===signature)return work;
 if(work.versions.length>=100)throw Error('100 versions reached. Preserve complete learner backup.');
 return {...work,versions:[...work.versions,{
  version:(last?.version??0)+1,savedAt:at,signature,
  draft:JSON.parse(signature) as T,evidence_weight:0,proficiency_weight:0,
 }]};
}
export function exactSavedNext(work:NextUnitWork):NextUnitVersion|null{
 const last=work.versions.at(-1);
 return last?.signature===exactSignature(work.draft)?last:null;
}
/** Only distinguishes literal duplicates. Semantic quality is NOT automatically judged. */
export const normalizedNote=(value:string):string=>value.trim().toLocaleLowerCase().replace(/[.,!?;:'"“”‘’()\s]+/g,'');
export function bankReady(bank:IdeaBank):boolean{
 const notes=bank.ideas.map(i=>i.text.trim()).filter(Boolean);
 if(notes.length<3||new Set(notes.map(normalizedNote)).size<3)return false;
 const index=Number(bank.chosenIndex);
 return Number.isInteger(index)&&index>=0&&index<bank.ideas.length&&
  !!bank.ideas[index]?.text.trim()&&!!bank.rationale.trim();
}
export function supplementalResult(unit:NextUnitId,id:string,selected:string){
 const item=REVIEWED_FOUNDATION_UNITS[unit].supplemental.find(x=>x.id===id);
 if(!item||!item.options.some(o=>o.id===selected))return null;
 return {correct:item.key===selected,key:item.key,
  explanations:item.options.map(o=>({id:o.id,text:o.text,reason:o.rationale,isKey:o.id===item.key}))};
}
const serialBank=(bank:IdeaBank):string=>[
 ...bank.ideas.map((idea,i)=>'Candidate '+(i+1)+': '+idea.text.trim()+' | Fit classification: '+idea.fit+' | Learner fit explanation: '+(idea.fitReason??'').trim()),
 'Chosen candidate: '+(Number(bank.chosenIndex)+1),
 'Reason for selecting: '+bank.rationale.trim(),
 'Optional set aside / trade-off: '+bank.setAside.trim(),
 'Original concrete development: '+bank.concrete.trim(),
].join('\n');
const serialChain=(label:string,chain:Chain):string=>
 [label+' claim: '+chain.claim.trim(),label+' reason: '+chain.reason.trim(),label+' detail: '+chain.detail.trim()].join('\n');
export type NextArtifact='cycleA'|'cycleB'|'transfer';
export function learnerNextArtifact(unit:NextUnitId,draft:NextDraft,artifact:NextArtifact){
 const source=REVIEWED_FOUNDATION_UNITS[unit];
 if(unit==='FW-U02'){
  const d=draft as U02Draft;
  if(artifact==='cycleA')return {unitId:unit,fixtureId:source.cycleA.id,task:source.cycleA.prompt,
   text:'Original repaired card '+d.repairCard+': '+d.repair.trim()+'\n'+
        'Own classification explanation: '+d.explanation.trim()};
  const bank=artifact==='cycleB'?d.cycleBBank:d.transferBank;
  return {unitId:unit,fixtureId:artifact==='cycleB'?source.cycleB.id:source.transfer.id,
   task:artifact==='cycleB'?source.cycleB.prompt:source.transfer.prompt,text:serialBank(bank)};
 }
 const d=draft as U03Draft;
 if(artifact==='cycleA')return {unitId:unit,fixtureId:source.cycleA.id,task:source.cycleA.prompt,
  text:'Original replacement for '+d.repairCard+': '+d.repairA.trim()};
 if(artifact==='cycleB')return {unitId:unit,fixtureId:source.cycleB.id,task:source.cycleB.prompt,
  text:'Own repair for '+d.weakChoice+': '+d.weakRepair.trim()+'\n'+
       serialChain('Chain A',d.chainA)+'\n'+serialChain('Chain B',d.chainB)};
 return {unitId:unit,fixtureId:source.transfer.id,task:source.transfer.prompt,
  text:serialChain('Transfer A',d.transferA)+'\n'+serialChain('Transfer B',d.transferB)};
}
export function eligibleNextArtifact(unit:NextUnitId,work:NextUnitWork,artifact:NextArtifact){
 if(!exactSavedNext(work))return null;
 const d=work.draft;
 if(unit==='FW-U02'){
  const value=d as U02Draft;
  if(artifact==='cycleA'&&(!['A2','A6'].includes(value.repairCard)||!value.repair.trim()||!value.explanation.trim()))return null;
  if(artifact==='cycleB'&&!bankReady(value.cycleBBank))return null;
  if(artifact==='transfer'&&!bankReady(value.transferBank))return null;
 }else{
  const value=d as U03Draft;
  if(artifact==='cycleA'&&(!['X1','X3'].includes(value.repairCard)||!value.repairA.trim()))return null;
  if(artifact==='cycleB'&&(!value.weakRepair.trim()||!['B-W1','B-W2','B-W3'].includes(value.weakChoice)))return null;
  const chains=artifact==='cycleB'?[value.chainA,value.chainB]:artifact==='transfer'?[value.transferA,value.transferB]:[];
  if(chains.some(c=>!c.claim.trim()||!c.reason.trim()||!c.detail.trim()))return null;
 }
 const info=learnerNextArtifact(unit,d,artifact);
 if(info.text.trim().length<20||info.text.length>7000)return null;
 return info;
}
export function nextProgress(unit:NextUnitId,work:NextUnitWork){
 const d=work.draft,exact=exactSavedNext(work)!==null;
 if(unit==='FW-U02'){
  const x=d as U02Draft;
  return {objectiveA:x.revealCycleA&&REVIEWED_FOUNDATION_UNITS[unit].cycleA.cards.every(c=>!!x.cycleASorts[c.id]),
   originalA:exact&&!!x.repair.trim()&&!!x.explanation.trim(),
   originalB:exact&&bankReady(x.cycleBBank),
   originalTransfer:exact&&bankReady(x.transferBank),
   extras:REVIEWED_FOUNDATION_UNITS[unit].supplemental.every(c=>!!x.revealSupplemental[c.id]&&!!x.supplementalAnswers[c.id]),
   evidence_weight:0 as const,proficiency_weight:0 as const};
 }
 const x=d as U03Draft;
 return {objectiveA:x.revealCycleA&&REVIEWED_FOUNDATION_UNITS[unit].cycleA.cards.every(c=>!!x.cycleARoles[c.id]),
  originalA:exact&&!!x.repairA.trim(),
  originalB:exact&&!!x.weakRepair.trim()&&[x.chainA,x.chainB].every(c=>!!c.claim.trim()&&!!c.reason.trim()&&!!c.detail.trim()),
  originalTransfer:exact&&[x.transferA,x.transferB].every(c=>!!c.claim.trim()&&!!c.reason.trim()&&!!c.detail.trim()),
  extras:REVIEWED_FOUNDATION_UNITS[unit].supplemental.every(c=>!!x.revealSupplemental[c.id]&&!!x.supplementalAnswers[c.id]),
  evidence_weight:0 as const,proficiency_weight:0 as const};
}
