import u04 from '../content/foundation-writing-u04.json';
import u05 from '../content/foundation-writing-u05.json';
import u06 from '../content/foundation-writing-u06.json';
import type {FoundationWritingV1} from './foundation-writing-u01';

export const WAVE2_UNITS={'FW-U04':u04,'FW-U05':u05,'FW-U06':u06} as const;
export type Wave2Id=keyof typeof WAVE2_UNITS;
export type Sentences={s1:string;s2:string;s3:string;s4:string};
export type Wave2Answers={supplementalAnswers:Record<string,string>;supplementalReveal:Record<string,boolean>};
export type U04Draft=Wave2Answers & {
 relationAnswers:Record<string,string>;relationReveal:boolean;
 comboAnswers:Record<string,string>;comboReveal:boolean;
 explainJoin:string;noLink:string;
 notice:Sentences;repairAgent:string;repairRevised:string;repairWhy:string;
 transfer:Sentences;transferRelation:string;
};
export type U05Draft=Wave2Answers & {
 positions:Record<string,string>;orderReveal:boolean;orderWhy:string;cycleARepair:string;cycleAReflection:string;
 plan:{point:string;reason:string;detail:string};
 paragraph:string;sentenceJobQuote:string;sentenceJobRole:string;sentenceJobWhy:string;
 transferParagraph:string;transferDetailQuote:string;
};
export type OutlineRole={job:string;notes:string};
export type Outline={roles:OutlineRole[];orderRationale:string;overlapCheck:string};
export type U06Draft=Wave2Answers & {
 roleAnswers:Record<string,string>;roleReveal:boolean;repairCard:string;repairNote:string;repairWhy:string;
 outline:Outline;transferOutline:Outline;
};
export type Wave2Draft=U04Draft|U05Draft|U06Draft;
export type Wave2Version<T extends Wave2Draft=Wave2Draft>={
 version:number;savedAt:number;signature:string;draft:T;evidence_weight:0;proficiency_weight:0;
};
export type Wave2Work<T extends Wave2Draft=Wave2Draft>={draft:T;versions:Wave2Version<T>[]};
const emptySentences=():Sentences=>({s1:'',s2:'',s3:'',s4:''});
const emptyAnswers=():Wave2Answers=>({supplementalAnswers:{},supplementalReveal:{}});
export const blankRole=():OutlineRole=>({job:'',notes:''});
export const emptyOutline=():Outline=>({roles:[blankRole(),blankRole(),blankRole()],orderRationale:'',overlapCheck:''});
export const emptyU04=():U04Draft=>({...emptyAnswers(),relationAnswers:{},relationReveal:false,
 comboAnswers:{},comboReveal:false,explainJoin:'',noLink:'',
 notice:emptySentences(),repairAgent:'',repairRevised:'',repairWhy:'',
 transfer:emptySentences(),transferRelation:''});
export const emptyU05=():U05Draft=>({...emptyAnswers(),positions:{},orderReveal:false,
 orderWhy:'',cycleARepair:'',cycleAReflection:'',
 plan:{point:'',reason:'',detail:''},paragraph:'',sentenceJobQuote:'',sentenceJobRole:'',sentenceJobWhy:'',
 transferParagraph:'',transferDetailQuote:''});
export const emptyU06=():U06Draft=>({...emptyAnswers(),roleAnswers:{},roleReveal:false,
 repairCard:'',repairNote:'',repairWhy:'',outline:emptyOutline(),transferOutline:emptyOutline()});
export const emptyWave2Work=(unit:Wave2Id):Wave2Work=>({
 draft:unit==='FW-U04'?emptyU04():unit==='FW-U05'?emptyU05():emptyU06(),versions:[],
});
export function wave2Work(saved:FoundationWritingV1|undefined,unit:Wave2Id):Wave2Work{
 if(saved&&saved.schemaVersion!==1)throw Error('Unrecognized Foundation Writing schema; preserve learner backup');
 const w=saved?.units?.[unit];
 if(!w)return emptyWave2Work(unit);
 if(!w.draft||!Array.isArray(w.versions)||!w.versions.every(v=>
   v&&typeof v.signature==='string'&&!!v.draft&&v.evidence_weight===0&&v.proficiency_weight===0))
  throw Error('Invalid Foundation Writing Wave 2 work: do not overwrite saved learner data.');
 return w;
}
export const wave2Signature=(draft:Wave2Draft)=>JSON.stringify(draft);
export function appendWave2Version<T extends Wave2Draft>(work:Wave2Work<T>,timestamp:number):Wave2Work<T>{
 if(!Number.isFinite(timestamp)||timestamp<=0)throw Error('Invalid save timestamp');
 const signature=wave2Signature(work.draft);
 const last=work.versions.at(-1);
 if(last?.signature===signature)return work;
 if(work.versions.length>=100)throw Error('100 versions reached. Export a recovery backup before proceeding.');
 return {draft:work.draft,versions:[...work.versions,{
  version:(last?.version??0)+1,savedAt:timestamp,signature,
  draft:JSON.parse(signature) as T,evidence_weight:0,proficiency_weight:0,
 }]};
}
export function exactSavedWave2(work:Wave2Work):Wave2Version|null{
 const last=work.versions.at(-1);
 return last?.signature===wave2Signature(work.draft)?last:null;
}
export const fourFilled=(s:Sentences)=>Object.values(s).every(v=>!!v.trim());
export const quoteWithin=(paragraph:string,quote:string)=>quote.trim().length>0&&paragraph.includes(quote.trim());
export const outlineReady=(o:Outline)=>[3,4].includes(o.roles.length)&&
 o.roles.every(r=>!!r.job.trim()&&!!r.notes.trim())&&!!o.orderRationale.trim();
const outlineText=(outline:Outline)=>[
 ...outline.roles.map((role,i)=>'P'+(i+1)+' job: '+role.job.trim()+'\nP'+(i+1)+' keyword notes: '+role.notes.trim()),
 'Why this order: '+outline.orderRationale.trim(),
 'Paragraph overlap check: '+outline.overlapCheck.trim()
].join('\n');
const fourText=(s:Sentences)=>[s.s1,s.s2,s.s3,s.s4].map((x,i)=>'Sentence '+(i+1)+': '+x.trim()).join('\n');
export type Wave2Artifact='cycleA'|'cycleB'|'transfer';
export function learnerWave2Artifact(unit:Wave2Id,draft:Wave2Draft,artifact:Wave2Artifact){
 const c=WAVE2_UNITS[unit];
 if(unit==='FW-U04'){
  const d=draft as U04Draft;
  if(artifact==='cycleA')return {unitId:unit,fixtureId:c.cycleA.id,task:c.cycleA.prompt,
   text:'Why my chosen join works: '+d.explainJoin.trim()+
    '\nMy no-link rewrite: '+d.noLink.trim()};
  if(artifact==='cycleB')return {unitId:unit,fixtureId:c.cycleB.id,task:c.cycleB.prompt,
   text:fourText(d.notice)+'\nAgent I intended: '+d.repairAgent+
    '\nMy repaired sentence: '+d.repairRevised.trim()+'\nWhy: '+d.repairWhy.trim()};
  return {unitId:unit,fixtureId:c.transfer.id,task:c.transfer.prompt,
   text:fourText(d.transfer)+'\nRelation I chose: '+d.transferRelation.trim()};
 }
 if(unit==='FW-U05'){
  const d=draft as U05Draft;
  if(artifact==='cycleA')return {unitId:unit,fixtureId:c.cycleA.id,task:c.cycleA.prompt,
   text:'Original supporting sentence replacing X1: '+d.cycleARepair.trim()+
    '\nWhy this order helps: '+d.orderWhy.trim()+
    '\nFunction of S3 compared with S1: '+d.cycleAReflection.trim()};
  if(artifact==='cycleB')return {unitId:unit,fixtureId:c.cycleB.id,task:c.cycleB.prompt,
   text:'Own point note: '+d.plan.point.trim()+'\nOwn reason note: '+d.plan.reason.trim()+
    '\nOwn example note: '+d.plan.detail.trim()+'\nOriginal paragraph: '+d.paragraph.trim()+
    '\nExact quoted sentence: '+d.sentenceJobQuote.trim()+
    '\nSentence role: '+d.sentenceJobRole+'\nWhy: '+d.sentenceJobWhy.trim()};
  return {unitId:unit,fixtureId:c.transfer.id,task:c.transfer.prompt,
   text:'New original paragraph: '+d.transferParagraph.trim()+
    '\nExact supporting detail: '+d.transferDetailQuote.trim()};
 }
 const d=draft as U06Draft;
 if(artifact==='cycleA')return {unitId:unit,fixtureId:c.cycleA.id,task:c.cycleA.prompt,
  text:'My repaired card: '+d.repairCard+'\nOriginal distinct role note: '+d.repairNote.trim()+
   '\nWhy it differs: '+d.repairWhy.trim()};
 if(artifact==='cycleB')return {unitId:unit,fixtureId:c.cycleB.id,task:c.cycleB.prompt,text:outlineText(d.outline)};
 return {unitId:unit,fixtureId:c.transfer.id,task:c.transfer.prompt,text:outlineText(d.transferOutline)};
}
export function eligibleWave2Artifact(unit:Wave2Id,work:Wave2Work,artifact:Wave2Artifact){
 if(!exactSavedWave2(work))return null;
 if(unit==='FW-U04'){
  const d=work.draft as U04Draft;
  if(artifact==='cycleA'&&(!d.explainJoin.trim()||!d.noLink.trim()))return null;
  if(artifact==='cycleB'&&(!fourFilled(d.notice)||!['Ms. Lee','Mia'].includes(d.repairAgent)||
   !d.repairRevised.trim()||!d.repairWhy.trim()))return null;
  if(artifact==='transfer'&&(!fourFilled(d.transfer)||!d.transferRelation.trim()))return null;
 }
 if(unit==='FW-U05'){
  const d=work.draft as U05Draft;
  if(artifact==='cycleA'&&(!d.cycleARepair.trim()||!d.orderWhy.trim()||!d.cycleAReflection.trim()))return null;
  if(artifact==='cycleB'&&(!Object.values(d.plan).every(x=>!!x.trim())||!d.paragraph.trim()||
    !quoteWithin(d.paragraph,d.sentenceJobQuote)||!['point','reason','detail'].includes(d.sentenceJobRole)||
    !d.sentenceJobWhy.trim()))return null;
  if(artifact==='transfer'&&(!d.transferParagraph.trim()||
    !quoteWithin(d.transferParagraph,d.transferDetailQuote)))return null;
 }
 if(unit==='FW-U06'){
  const d=work.draft as U06Draft;
  if(artifact==='cycleA'&&(!['X1','X3'].includes(d.repairCard)||!d.repairNote.trim()||!d.repairWhy.trim()))return null;
  if(artifact==='cycleB'&&!outlineReady(d.outline))return null;
  if(artifact==='transfer'&&!outlineReady(d.transferOutline))return null;
 }
 const a=learnerWave2Artifact(unit,work.draft,artifact);
 return a.text.trim().length>=20&&a.text.length<=7000?a:null;
}
export function wave2ObjectiveResult(unit:Wave2Id,id:string,choice:string){
 const item=WAVE2_UNITS[unit].supplemental.find(x=>x.id===id);
 if(!item||!item.options.some(o=>o.id===choice))return null;
 return {correct:item.key===choice,key:item.key,
  rationales:item.options.map(o=>({id:o.id,text:o.text,reason:o.rationale,isKey:o.id===item.key}))};
}
export function wave2Progress(unit:Wave2Id,work:Wave2Work){
 const exact=!!exactSavedWave2(work),d=work.draft;
 const extras=WAVE2_UNITS[unit].supplemental.every(q=>!!d.supplementalAnswers[q.id]&&!!d.supplementalReveal[q.id]);
 if(unit==='FW-U04'){
  const v=d as U04Draft;const c=WAVE2_UNITS[unit].cycleA;
  return {cycleA:v.relationReveal&&c.relations.every(x=>!!v.relationAnswers[x.id])&&
    v.comboReveal&&c.choices.every(x=>!!v.comboAnswers[x.id]),
   ownCycleA:exact&&!!v.explainJoin.trim()&&!!v.noLink.trim(),
   ownCycleB:exact&&fourFilled(v.notice)&&!!v.repairRevised.trim()&&!!v.repairWhy.trim()&&!!v.repairAgent,
   transfer:exact&&fourFilled(v.transfer)&&!!v.transferRelation.trim(),extras};
 }
 if(unit==='FW-U05'){
  const v=d as U05Draft;const c=WAVE2_UNITS[unit].cycleA;
  return {cycleA:v.orderReveal&&c.cards.every(x=>!!v.positions[x.id]),
   ownCycleA:exact&&!!v.cycleARepair.trim()&&!!v.cycleAReflection.trim(),
   ownCycleB:exact&&!!v.paragraph.trim()&&quoteWithin(v.paragraph,v.sentenceJobQuote),
   transfer:exact&&!!v.transferParagraph.trim()&&quoteWithin(v.transferParagraph,v.transferDetailQuote),extras};
 }
 const v=d as U06Draft;const c=WAVE2_UNITS[unit].cycleA;
 return {cycleA:v.roleReveal&&c.cards.every(x=>!!v.roleAnswers[x.id]),
  ownCycleA:exact&&!!v.repairNote.trim()&&!!v.repairWhy.trim(),
  ownCycleB:exact&&outlineReady(v.outline),transfer:exact&&outlineReady(v.transferOutline),extras};
}
