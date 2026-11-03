import {normalizeAnswer,type SeedActivity} from './academic';
/** Not semantic grading. Accept only exact reconstruction of an unambiguous supplied gap context. */
export function gapContext(prompt:string):string|null{
 if((prompt.match(/___/g)??[]).length!==1)return null;
 const quoted=[...prompt.matchAll(/“([^”]*___[^”]*)”/g)];
 let text=quoted.length===1?quoted[0][1]:prompt;
 if(!quoted.length){
  // Remove an explicit instruction prefix, never arbitrary sentence context.
  const instruction=text.match(/^(?:.*?\b(?:Complete|Write)\b[^:]*):\s*/i);
  if(instruction)text=text.slice(instruction[0].length);
  else return null; // Context extraction is uncertain: ordinary grading remains in force.
  text=text.replace(/\s+(?:Enter|Use)\b.*$/,'');
 }
 // Parentheses immediately following the gap are supplied inflection cues only.
 text=text.replace(/___\s*\([A-Za-z /'’+-]+\)/,'___');
 // A trailing inflection cue is not part of the sentence.
 text=text.replace(/\s+\([A-Za-z /'’+-]+\)\s*$/,'');
 if(/[()→]/.test(text)||!/[A-Za-z]/.test(text.replace('___','')))return null;
 return text.trim();
}
const formatText=(s:string)=>s.trim().replace(/[‘’]/g,"'").replace(/\s+/g,' ').replace(/[.!?]$/,'').toLowerCase();
export function answerFormat(q:SeedActivity,answer:string,module:string):'accepted'|'format-only'|'ordinary'{
 if(q.type!=='short_answer'||!['grammar','vocabulary'].includes(module))return 'ordinary';
 const accepted=q.answer?.accepted_answers??[];
 if(accepted.some(s=>normalizeAnswer(s)===normalizeAnswer(answer)))return 'accepted';
 const context=gapContext(q.prompt);if(!context)return 'ordinary';
 for(const value of accepted){
  // Contracted suffixes attach to the preceding subject without introducing a space.
  const completed=context.replace(/\s*___/,value.startsWith("'")||value.startsWith('’')?value:(context.startsWith('___')?'':' ')+value);
  const expectedEnd=completed.trim().match(/[.!?]$/)?.[0],actualEnd=answer.trim().match(/[.!?]$/)?.[0];
  if(expectedEnd&&actualEnd&&expectedEnd!==actualEnd)continue;
  if(formatText(answer)===formatText(completed))return 'format-only';
 }
 return 'ordinary';
}
export const FORMAT_MESSAGE='This response matches the supplied sentence, but this question asks for only the missing word or phrase. Edit your answer, or submit it as unscored format-only work. No credit or knowledge-error evidence will be assigned.';
