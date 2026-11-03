import {AcademicError,compareVersions,type AcademicAttempt,type SeedActivity} from './academic';
export type OptionOrder={version:1;questions:Record<string,string[]>};
export const optionOrderEnabled=(version:string)=>compareVersions(version,'1.17.0')>=0;
/** Rejection sampling avoids modulo bias. No answer keys are read. */
function randomIndex(n:number){const limit=Math.floor(0x100000000/n)*n;let x:number;do{x=crypto.getRandomValues(new Uint32Array(1))[0]}while(x>=limit);return x%n}
export function createOptionOrder(activities:SeedActivity[],pick:(n:number)=>number=randomIndex):OptionOrder{
 const questions:Record<string,string[]>={};
 for(const q of activities.filter(q=>q.type==='single_choice')){
  const ids=(q.options??[]).map(o=>o.id);
  if(!ids.length||new Set(ids).size!==ids.length)throw new AcademicError('Invalid lesson options.');
  for(let i=ids.length-1;i>0;i--){const j=pick(i+1);if(!Number.isInteger(j)||j<0||j>i)throw new AcademicError('Invalid option randomizer.');[ids[i],ids[j]]=[ids[j],ids[i]]}
  questions[q.id]=ids;
 }
 return {version:1,questions};
}
export function validateOptionOrder(activities:SeedActivity[],attempt:Pick<AcademicAttempt,'version'|'optionOrder'>){
 const order=attempt.optionOrder;
 // Legacy content keeps source order, including new revisions of old work.
 if(order===undefined&&!optionOrderEnabled(attempt.version))return;
 const qs=activities.filter(q=>q.type==='single_choice');
 if(!order||order.version!==1||!order.questions||Object.keys(order.questions).length!==qs.length)throw new AcademicError('Saved option order is unavailable. Keep this draft and contact the project owner.');
 for(const q of qs){const ids=order.questions[q.id],options=q.options??[];if(!Array.isArray(ids)||ids.length!==options.length||new Set(ids).size!==ids.length||ids.some(id=>!options.some(o=>o.id===id)))throw new AcademicError('Saved option order is invalid. Keep this draft and contact the project owner.');}
}
export function orderedOptions(q:Pick<SeedActivity,'id'|'options'>,attempt:Pick<AcademicAttempt,'optionOrder'>){
 const ids=attempt.optionOrder?.questions[q.id];
 return ids?ids.map(id=>q.options!.find(o=>o.id===id)!):q.options;
}
