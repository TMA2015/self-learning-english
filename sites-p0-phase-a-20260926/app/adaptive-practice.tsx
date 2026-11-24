'use client';
import {useEffect,useRef,type ReactNode} from 'react';

/** Presentation only. Never inspect answer keys, change option order or write learner records.
 * Match the approved Compact Practice v3.1 HTML: measure the longest rendered option
 * using the actual font and content width, then choose 4, 2 or 1 columns.
 */
export function practiceColumns(count:number,longest:number,available:number,gap=8){
 if(!Number.isFinite(longest)||!Number.isFinite(available)||longest>240)return 1;
 const needed=Math.max(90,Math.ceil(longest)+51);
 for(const n of [4,2])if(count>=n&&count%n===0&&(available-(n-1)*gap)/n>=needed)return n;
 return 1;
}
export function AdaptivePracticeGrid({className,children}:{className:string;children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const grid=ref.current;if(!grid)return;
  let active=true;
  const context=document.createElement('canvas').getContext('2d');
  const measure=()=>{
   if(!active||!context)return;
   const spans=Array.from(grid.querySelectorAll<HTMLElement>('.foundation-option-text'));
   if(!spans.length)return;
   const style=getComputedStyle(spans[0]);
   context.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
   const longest=Math.max(...spans.map(s=>/\r?\n/.test(s.textContent??'')?Infinity:context.measureText(s.textContent??'').width));
   const gap=Number.parseFloat(getComputedStyle(grid).columnGap)||8;
   const columns=practiceColumns(spans.length,longest,grid.clientWidth,gap);
   grid.style.setProperty('--practice-columns',String(columns));
   grid.dataset.practiceColumns=String(columns);
  };
  measure();
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  observer?.observe(grid);
  window.addEventListener('resize',measure);
  void document.fonts?.ready.then(()=>{if(active)measure()});
  return ()=>{active=false;observer?.disconnect();window.removeEventListener('resize',measure)};
 },[children]);
 return <div ref={ref} className={className} data-practice-adaptive="true">{children}</div>;
}
export type ShortPracticeMode={kind:'inline';before:string;after:string;wide:boolean}|{kind:'input'}|{kind:'textarea'};
/** The prompt and existing value are the sole inputs. Never infer an answer or
 * its length from accepted_answers. Ambiguous/multiple blanks and multiline
 * responses keep the original textarea.
 */
export function shortPracticeMode(prompt:string,value:string):ShortPracticeMode{
 if(/[\r\n]/.test(prompt)||/[\r\n]/.test(value))return {kind:'textarea'};
 const matches=Array.from(prompt.matchAll(/_{3,}/g));
 if(matches.length===1){
  const at=matches[0].index??0,len=matches[0][0].length;
  const before=prompt.slice(0,at),after=prompt.slice(at+len);
  if((before+after).trim().length===0)return {kind:'textarea'};
  // Some prompts explicitly ask for a phrase or more than one word.
  const wide=/\b(?:phrase|two words|three words|word or words)\b/i.test(prompt);
  return {kind:'inline',before,after,wide};
 }
 if(matches.length>1)return {kind:'textarea'};
 // Keep open-ended, sentence-level and ambiguous response formats unchanged.
 if(prompt.length>180||/\b(?:explain|rewrite|summari[sz]e|paragraph|sentences?|list|describe|give reasons?|write .* and .*|in your own words)\b/i.test(prompt))return {kind:'textarea'};
 return {kind:'input'};
}
const FORMAT='Answer format: enter only the missing word or phrase, not the whole sentence. Follow any specific form requested above.';
export function ShortPracticeResponse({mode,prompt,id,value,onChange}:{mode:Exclude<ShortPracticeMode,{kind:'textarea'}>;prompt:string;id:string;value:string;onChange:(value:string)=>void}){
 const hint=id+'-format';
 const input=<input className={mode.kind==='inline'?'foundation-inline-blank'+(mode.wide?' is-phrase':''):'foundation-short-input'} type="text"
  name={id} aria-label={prompt} aria-describedby={hint} value={value}
  autoComplete="off" autoCapitalize="none" spellCheck={false} onChange={e=>onChange(e.target.value)}/>;
 return <>
  {mode.kind==='inline'?<div className="foundation-inline-sentence">{mode.before}{input}{mode.after}</div>:input}
  <p id={hint} className="foundation-short-format">{FORMAT}</p>
 </>;
}
