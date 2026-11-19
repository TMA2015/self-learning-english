import source from '../content/foundation-writing-u01.json';
import type {NextUnitWork,U02Draft,U03Draft} from './foundation-writing-u02-u03';
import type {Wave2Work,U04Draft,U05Draft,U06Draft} from './foundation-writing-u04-u06';
import type {Wave3Work} from './foundation-writing-u07-u09';
import type {Wave4Work} from './foundation-writing-wave4-readiness';

export const FOUNDATION_WRITING_SCHEMA=1 as const;
export const FOUNDATION_U01='FW-U01' as const;
export const FOUNDATION_U01_SOURCE=source;

export type TaskMap={topic:string;task:string;mustInclude:string;boundary:string;commitment:string};
export type U01Draft={
 cycleALabels:Record<string,string>;
 cycleAMap:TaskMap;
 cycleBChoice:string;
 repair:string;
 reflection:string;
 transferMap:TaskMap;
 supplementalAnswers:Record<string,string>;
 revealCycleA:boolean;
 revealCycleB:boolean;
 revealSupplemental:Record<string,boolean>;
};
export type U01Version={
 version:number; savedAt:number; signature:string; draft:U01Draft;
 evidence_weight:0; proficiency_weight:0;
};
export type U01Work={draft:U01Draft;versions:U01Version[]};
export type FoundationWritingV1={schemaVersion:1; units:{'FW-U01'?:U01Work;'FW-U02'?:NextUnitWork<U02Draft>;'FW-U03'?:NextUnitWork<U03Draft>;'FW-U04'?:Wave2Work<U04Draft>;'FW-U05'?:Wave2Work<U05Draft>;'FW-U06'?:Wave2Work<U06Draft>;'FW-U07'?:Wave3Work;'FW-U08'?:Wave3Work;'FW-U09'?:Wave3Work;'FW-U10'?:Wave4Work;'FW-U11'?:Wave4Work;'FW-U12'?:Wave4Work}};

export const newTaskMap=():TaskMap=>({topic:'',task:'',mustInclude:'',boundary:'',commitment:''});
export const newU01Draft=():U01Draft=>({
 cycleALabels:{},cycleAMap:newTaskMap(),cycleBChoice:'',
 repair:'',reflection:'',transferMap:newTaskMap(),
 supplementalAnswers:{},revealCycleA:false,revealCycleB:false,revealSupplemental:{},
});
export const emptyU01Work=():U01Work=>({draft:newU01Draft(),versions:[]});
export const emptyFoundationWritingV1=():FoundationWritingV1=>({schemaVersion:1,units:{}});

export function u01Work(value:FoundationWritingV1|undefined):U01Work{
 if(value&&value.schemaVersion!==1)throw Error('Unrecognized Foundation Writing version: preserve the original saved state.');
 const saved=value?.units?.['FW-U01'];
 if(!saved)return emptyU01Work();
 if(!saved.draft||!Array.isArray(saved.versions))throw Error('Invalid Foundation Writing progress: preserve your backup and do not overwrite.');
 return saved;
}
export const u01Signature=(draft:U01Draft):string=>JSON.stringify(draft);
export function appendU01Version(work:U01Work,at:number):U01Work{
 if(!Number.isFinite(at)||at<=0)throw Error('Invalid save timestamp');
 const signature=u01Signature(work.draft);
 const last=work.versions.at(-1);
 if(last?.signature===signature)return work; // no redundant duplicate version
 if(work.versions.length>=100)throw Error('100 saved versions reached. Export a full recovery backup before proceeding.');
 const draft=JSON.parse(JSON.stringify(work.draft)) as U01Draft;
 return {draft:work.draft,versions:[...work.versions,{
  version:(last?.version??0)+1,savedAt:at,signature,draft,
  evidence_weight:0,proficiency_weight:0,
 }]};
}
export function lastSavedU01(work:U01Work):U01Version|null{
 return work.versions.at(-1)??null;
}
export function exactSavedU01(work:U01Work):U01Version|null{
 const last=lastSavedU01(work);
 return last?.signature===u01Signature(work.draft)?last:null;
}
export const TASK_MAP_KEYS=['topic','task','mustInclude','boundary','commitment'] as const;
export const mapHasWriting=(map:TaskMap)=>TASK_MAP_KEYS.some(key=>map[key].trim().length>0);
export function u01Progress(work:U01Work){
 const d=work.draft;
 return {
  tagsChecked:d.revealCycleA&&source.cycleA.chunks.every(c=>typeof d.cycleALabels[c.id]==='string'&&!!d.cycleALabels[c.id]),
  cycleAMapSaved:!!work.versions.length&&TASK_MAP_KEYS.every(k=>d.cycleAMap[k].trim().length>0)&&exactSavedU01(work)!==null,
  openingChecked:d.revealCycleB&&!!d.cycleBChoice,
  cycleBRepairSaved:!!work.versions.length&&!!d.repair.trim()&&!!d.reflection.trim()&&exactSavedU01(work)!==null,
  transferSaved:!!work.versions.length&&TASK_MAP_KEYS.every(k=>d.transferMap[k].trim().length>0)&&exactSavedU01(work)!==null,
  supplementalChecked:source.supplemental.every(item=>d.revealSupplemental[item.id]&&!!d.supplementalAnswers[item.id]),
  evidence_weight:0 as const,proficiency_weight:0 as const,
 };
}
export function objectiveResult(itemId:string,choice:string):{correct:boolean;key:string;explanations:{id:string;text:string;reason:string;isKey:boolean}[]}|null{
 const item=source.supplemental.find(row=>row.id===itemId);
 if(!item||!item.options.some(option=>option.id===choice))return null;
 return {
  correct:item.key===choice,
  key:item.key,
  explanations:item.options.map(option=>({
   id:option.id,text:option.text,reason:option.rationale,isKey:option.id===item.key,
  })),
 };
}
export type U01Artifact='cycleA'|'cycleB'|'transfer';
export function learnerU01Artifact(draft:U01Draft,artifact:U01Artifact):{fixtureId:string;task:string;text:string}{
 if(artifact==='cycleB')return {
  fixtureId:source.cycleB.id,task:source.cycleB.prompt,
  text:['Learner repair: '+draft.repair.trim(),'Learner reflection: '+draft.reflection.trim()].join('\n'),
 };
 const map=artifact==='transfer'?draft.transferMap:draft.cycleAMap;
 const fixture=artifact==='transfer'?source.transfer:source.cycleA;
 return {fixtureId:fixture.id,task:fixture.prompt,
  text:TASK_MAP_KEYS.map(k=>k+': '+map[k].trim()).join('\n')};
}
export function eligibleU01Artifact(work:U01Work,artifact:U01Artifact):{fixtureId:string;task:string;text:string}|null{
 if(!exactSavedU01(work))return null;
 const result=learnerU01Artifact(work.draft,artifact);
 if(result.text.trim().length<20||result.text.length>7000)return null;
 if(artifact==='cycleB'&&!work.draft.repair.trim())return null;
 if(artifact!=='cycleB'&&!mapHasWriting(artifact==='transfer'?work.draft.transferMap:work.draft.cycleAMap))return null;
 return result;
}
