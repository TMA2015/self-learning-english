import {analysisHelper,currentAnalysis} from '../domain/writing-course-v2';
export type GuidedWritingFeedback={summary:string;strengths:string[];improvements:string[];exercise:string;scores:null;corrections:{original:string;revised:string;why:string;tag:string}[];tags:string[]};

// Counts and explicit words are structure checks, never semantic or grammar judgments.
export function guidedWritingFeedback(stage:string,answer:Record<string,string>):GuidedWritingFeedback{
 const values=Object.values(stage==='analysis'?currentAnalysis(answer):answer),all=values.join(' ').trim();
 const words=all.split(/\s+/).filter(Boolean).length;
 const feedback:GuidedWritingFeedback={summary:`Basic structure: ${values.filter(s=>s.trim()).length}/${values.length} fields filled; ${words} words saved.`,strengths:[],improvements:[],exercise:'Check one required part against the prompt.',scores:null,corrections:[],tags:[]};
 if(stage==='analysis'){
  const items=analysisHelper(answer);
  feedback.strengths=items.filter(i=>i.status==='good').map(i=>`${i.label}: required words found; check their meaning yourself.`);
  feedback.improvements=items.filter(i=>i.status!=='good').map(i=>`${i.label}: ${i.nextAction}`);
  feedback.exercise='Read your Boundary. Does it name the school-garden context?';
 }else if(stage==='brainstorm'){
  feedback.improvements=['Check your chosen ideas against the task yourself. Add a reason and example.'];
  feedback.exercise='Ask: how could classmates take part?';
 }else if(stage==='outline'){
  feedback.improvements=['Check that each required field is filled. Review your opinion, reasons, example and ending.'];
  feedback.exercise='Which required part still needs a place in your plan?';
 }else{
  if(words<35)feedback.improvements.push('This draft has fewer than 35 words. Review whether all required parts are present.');
  if(!/\b(because|so|for example|such as)\b/i.test(all))feedback.improvements.push('No listed linker was found. Consider because, so or for example where useful.');
  if(!/\bgarden\b/i.test(all))feedback.improvements.push('The word garden was not found. Check your response against the prompt yourself.');
  feedback.exercise='Check one reason. What short example could support it?';
 }
 if(!feedback.improvements.length)feedback.improvements=['Use the checklist to review meaning and language yourself or with an adult.'];
 return feedback;
}
