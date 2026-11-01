import cefr from "../content/cefr.json";
import {coreBank,coreCatalog,type CoreSkill,type CoreQuestion} from "./core-bank";
export const ENGINE_VERSION="cefr-screen-4.0";
export const scale=cefr.scale as ("Pre-A1"|"A1"|"A2"|"B1"|"B2")[];
export type ResponseEvidence={id:string;tag:string;level?:string;score:number;max:number;weight?:number;at?:number};
export type ConfidenceParts={coverage:number;amount:number;precision:number;stability:number;ceilingCap:boolean;contradictionRate:number;inconsistencyCap:boolean};
export function estimateEvidence(rows:ResponseEvidence[],tags:string[]){
 const valid=rows.filter(e=>scale.includes(e.level as typeof scale[number])&&e.max>0);
 const grid=Array.from({length:17},(_,i)=>i/4);
 const logs=grid.map(theta=>valid.reduce((sum,e)=>{const difficulty=scale.indexOf(e.level as typeof scale[number]);const p=1/3+.62/(1+Math.exp(-1.6*(theta-difficulty)));return sum+(e.weight??1)*((e.score/e.max)*Math.log(p)+(1-e.score/e.max)*Math.log(1-p))},-.12*(theta-2)**2));
 const top=Math.max(...logs),weights=logs.map(x=>Math.exp(x-top)),total=weights.reduce((a,b)=>a+b,0),distribution=weights.map(x=>x/total),mean=grid.reduce((s,x,i)=>s+x*distribution[i],0),variance=grid.reduce((s,x,i)=>s+(x-mean)**2*distribution[i],0),sd=Math.sqrt(variance);
 const count=valid.reduce((n,e)=>n+(e.weight??1),0),coverage=tags.filter(tag=>valid.filter(e=>e.tag===tag).length>=2).length/Math.max(1,tags.length),amount=Math.min(1,count/(tags.length*4));
 const first=valid.slice(0,-4),recent=valid.slice(-4);const rate=(r:ResponseEvidence[])=>r.length?r.reduce((s,e)=>s+e.score/e.max,0)/r.length:0;
 const stability=valid.length<8?0:Math.max(0,1-Math.abs(rate(first)-rate(recent)));const precision=Math.max(0,1-sd/1.1),ceilingCap=mean>3.65||mean<.35;
 let comparisons=0,inversions=0;for(let i=0;i<valid.length;i++)for(let j=i+1;j<valid.length;j++){const a=valid[i],b=valid[j];const da=scale.indexOf(a.level as typeof scale[number]),db=scale.indexOf(b.level as typeof scale[number]);if(da===db||(a.score/a.max>=.5)===(b.score/b.max>=.5))continue;comparisons++;const easy=da<db?a:b,hard=da<db?b:a;if(easy.score/easy.max<.5&&hard.score/hard.max>=.5)inversions++}
 const contradictionRate=comparisons?inversions/comparisons:0,inconsistencyCap=comparisons>=8&&contradictionRate>.45;
 const parts:ConfidenceParts={coverage:Math.round(coverage*100),amount:Math.round(amount*100),precision:Math.round(precision*100),stability:Math.round(stability*100),ceilingCap,contradictionRate:Math.round(contradictionRate*100),inconsistencyCap};
 const confidencePercent=valid.length?Math.min(inconsistencyCap?59:ceilingCap?75:95,Math.round(100*(.4*coverage+.25*amount+.25*precision+.1*stability))):0;
 const confidence:"high"|"moderate"|"low"=confidencePercent>=80?"high":confidencePercent>=60?"moderate":"low";
 const base=Math.min(4,Math.max(0,Math.round(mean))),offset=mean-base;
 const displayLevel=scale[base]+(base>0&&base<4&&count>=12&&confidencePercent>=60?(offset>.22?"+":offset<-.22?"−":""):"");
 return {level:scale[base],displayLevel,confidence,confidencePercent,confidenceParts:parts,mean,sd,range:[Math.max(0,mean-1.28*sd),Math.min(4,mean+1.28*sd)].map(x=>scale[Math.round(x)]).join("–"),coverage:Math.round(coverage*100),evidenceCount:valid.length,percent:Math.round(rate(valid)*100),distribution:grid.map((ability,i)=>({ability,weight:Math.round(distribution[i]*1000)/1000}))};
}
export type AdaptiveAnswer={id:string;skill:CoreSkill;level:string;tag:string;correct:boolean};
function asEvidence(rows:AdaptiveAnswer[]):ResponseEvidence[]{return rows.map(r=>({...r,score:Number(r.correct),max:1}))}
function targetDifficulty(rows:AdaptiveAnswer[]){let target=2;for(let i=0;i+4<=rows.length;i+=4){const block=rows.slice(i,i+4),success=block.filter(a=>a.correct).length;target=Math.max(1,Math.min(4,target+(success>=3?1:success<=1?-1:0)))}return target}
export function adaptiveStatus(attempts:AdaptiveAnswer[]){
 return (["Grammar","Vocabulary","Reading"] as CoreSkill[]).map(skill=>{const rows=attempts.filter(a=>a.skill===skill),tags=coreCatalog[skill],estimate=estimateEvidence(asEvidence(rows),tags),round=Math.min(...tags.map(t=>rows.filter(a=>a.tag===t).length));
 const stop=round>=5?"Question limit reached; remaining uncertainty is retained":round>=3&&estimate.confidencePercent>=80?"Coverage complete and confidence high":round>=4&&estimate.confidencePercent>=75?"Standard evidence target reached":"More balanced evidence needed";
 return {skill,count:rows.length,minimum:tags.length*3,maximum:tags.length*5,round,finished:round>=5||round>=3&&estimate.confidencePercent>=80||round>=4&&estimate.confidencePercent>=75,stop,target:targetDifficulty(rows),estimate};
 });
}
export function adaptiveQuestion(attempts:AdaptiveAnswer[]):CoreQuestion|null{
 const status=adaptiveStatus(attempts);const active=status.find(s=>!s.finished);if(!active)return null;
 const rows=attempts.filter(a=>a.skill===active.skill),tags=coreCatalog[active.skill];
 // Rotate across subskills and never immediately repeat the failed tag.
 const candidates=tags.map((tag,i)=>({tag,i,count:rows.filter(a=>a.tag===tag).length})).sort((a,b)=>a.count-b.count||a.i-b.i);
 for(const {tag} of candidates){const pool=coreBank.filter(q=>q.skill===active.skill&&q.tag===tag&&!rows.some(a=>a.id===q.id));pool.sort((a,b)=>Math.abs(scale.indexOf(a.level)-active.target)-Math.abs(scale.indexOf(b.level)-active.target)||a.id.localeCompare(b.id));if(pool[0])return pool[0]}
 return null;
}
