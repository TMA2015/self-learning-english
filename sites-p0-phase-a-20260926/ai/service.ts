import {validateTeachingRating} from "./teaching-validation";
import registry from './prompts/registry.json';
import rubric from '../content/writing-rubric.json';
import type {AITutor,AITutorProvider,TutorPurpose} from './contracts';
import type {EvaluationMetadata} from '../domain/ai-metadata';
import {validateRating} from './validation';
export function createTutorService(provider:AITutorProvider):AITutor{
 function invalidResponse():null{provider.reportFailure?.('invalid-response');return null}

 async function run(purpose:TutorPurpose,input:Record<string,unknown>,context:Record<string,string>,temperature:number):Promise<EvaluationMetadata|null>{if(!provider.available)return null;const prompt=registry[purpose];if(prompt.status==='reserved')return null;const instructions=prompt.system.replace(/\{\{(\w+)\}\}/g,(_,key)=>context[key]??'');try{const result=await provider.generate({schemaVersion:1,purpose,promptVersion:prompt.version,instructions,input,temperature});return result?{provider:result.provider,model:result.model,promptId:purpose,promptVersion:prompt.version,timestamp:new Date().toISOString(),structuredResult:result.result}:null}catch{return null}}
 return {available:provider.available,async teachWriting(text,task,context){const evaluation=await run("writing-teaching",{task,studentWriting:text,learnerContext:context},{},0);if(!evaluation)return null;const rating=validateTeachingRating(evaluation.structuredResult,text);return rating?{...rating,evaluation:{...evaluation,structuredResult:rating}}:invalidResponse()},async evaluateWriting(text,task){const evaluation=await run('writing-evaluation',{task,studentWriting:text},{criteria:rubric.criteria.join(', ')},0);if(!evaluation)return null;const rating=validateRating(evaluation.structuredResult,text);if(!rating)return invalidResponse();return {...rating,evaluation:{...evaluation,structuredResult:rating}}},async coach(stage,task,answer,learnerContext){const evaluation=await run(stage==='foundation-writing'?'foundation-writing-review':stage==='brainstorm'?'brainstorming-coaching':stage==='revision'?'revision-coaching':stage==='any-topic'?'any-topic-writing':'feedback',{stage,task,studentAnswer:answer,learnerContext,...(['any-topic','foundation-writing'].includes(stage)?{responseLanguage:learnerContext?.responseLanguage==='vi'?'vi':'en'}:{})},{task,stage},.3);if(!evaluation)return null;const raw=evaluation.structuredResult;if(!raw||typeof raw!=='object')return invalidResponse();const r=raw as Record<string,unknown>;if(typeof r.summary!=='string'||(stage==='foundation-writing'? !['strengths','improvements'].every(k=>Array.isArray(r[k])&&(r[k] as unknown[]).every(x=>typeof x==='string')) : typeof r.exercise!=='string'||!['strengths','improvements','tags'].every(k=>Array.isArray(r[k])&&(r[k] as unknown[]).every(x=>typeof x==='string'))))return invalidResponse();if(stage==='foundation-writing'){
  const submitted=answer&&typeof answer==='object'&&!Array.isArray(answer)?answer as Record<string,unknown>:null;
  const text=typeof submitted?.text==='string'?submitted.text:'';
  const strengths=r.strengths as string[],improvements=r.improvements as string[];
  const quotes=r.quotes,questions=r.questions;
  const allowedFixtures:Record<string,readonly string[]>={
    'FW-U01':['FW-U01-A','FW-U01-B','FW-U01-T'],
    'FW-U02':['FW-U02-A','FW-U02-B','FW-U02-T'],
    'FW-U03':['FW-U03-A','FW-U03-B','FW-U03-T'],
    'FW-U04':['FW-U04-A','FW-U04-B','FW-U04-T'],
    'FW-U05':['FW-U05-A','FW-U05-B','FW-U05-T'],
    'FW-U06':['FW-U06-A','FW-U06-B','FW-U06-T'],
    'FW-U07':['FW-U07-A','FW-U07-B','FW-U07-T'],
    'FW-U08':['FW-U08-A','FW-U08-B','FW-U08-T'],
    'FW-U09':['FW-U09-A','FW-U09-B','FW-U09-T'],
  };
  const unitId=typeof submitted?.unitId==='string'?submitted.unitId:'';
  if(!Object.hasOwn(allowedFixtures,unitId)||
     !allowedFixtures[unitId].includes(String(submitted?.fixtureId))||
     text.length<20||text.length>7000||r.scores!==null||r.level!==null||
     typeof r.summary!=='string'||!r.summary.trim()||
     strengths.length>2||improvements.length>2||
     !Array.isArray(quotes)||quotes.length>3||
     !quotes.every(q=>typeof q==='string'&&q.length>0&&text.includes(q))||
     !Array.isArray(questions)||questions.length<1||questions.length>2||
     !questions.every(q=>typeof q==='string'&&q.trim().length>0)||
     typeof r.nextAction!=='string'||!r.nextAction.trim())return invalidResponse();
  return {...evaluation,structuredResult:{
    summary:r.summary,strengths,improvements,quotes,questions,nextAction:r.nextAction,
    scores:null,level:null,canEstimateLevel:false,
  }};
 }
 if(stage==='any-topic'){
  // Strict qualitative contract: uncalibrated Writing must never be accepted with numeric grading.
  const draft=(answer&&typeof answer==='object'&&!Array.isArray(answer)?(answer as Record<string,unknown>).draft:null);
  const corrections=r.corrections;
  if(typeof draft!=='string'||r.scores!==null||r.level!==null||r.canEstimateLevel!==false||
     !Array.isArray(corrections)||corrections.length>3||
     (r.strengths as string[]).length>3||(r.improvements as string[]).length>3||
     corrections.some(c=>{
       if(!c||typeof c!=='object')return true;
       const row=c as Record<string,unknown>;
       return typeof row.original!=='string'||!row.original||!draft.includes(row.original)||
              typeof row.why!=='string'||!row.why.trim()||typeof row.hint!=='string'||!row.hint.trim();
     }))return invalidResponse();
  return {...evaluation,structuredResult:{summary:r.summary,strengths:r.strengths,
    improvements:r.improvements,exercise:r.exercise,tags:r.tags,
    corrections:(corrections as Array<{original:string;why:string;hint:string}>)
      .map(c=>({original:c.original,why:c.why,hint:c.hint})),
    scores:null,level:null,canEstimateLevel:false}};
 }
 return {...evaluation,structuredResult:{summary:r.summary,strengths:(r.strengths as string[]).slice(0,3),improvements:(r.improvements as string[]).slice(0,3),exercise:r.exercise,tags:r.tags,corrections:[],scores:stage!=='revision'&&r.scores&&typeof r.scores==='object'&&Object.values(r.scores).every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=10)?r.scores:null}}}};
}

