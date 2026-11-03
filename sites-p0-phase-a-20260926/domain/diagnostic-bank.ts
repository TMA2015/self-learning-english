import questions from "../content/questions-v3.json";
import tags from "../content/skills-v3.json";
export type CoreSkill = "Grammar"|"Vocabulary"|"Reading";
export type BankQuestion = {id:string;skill:CoreSkill;level:"A1"|"A2"|"B1";tag:string;prompt:string;passage?:string;options:[string,string,string];correct:number;hintVi:string};
export const subskillCatalog=tags;
export const bank=questions as BankQuestion[];
export const TOTAL_QUESTIONS=60;
export function selectQuestion(attempts:{id:string;skill:CoreSkill;correct:boolean}[]):BankQuestion|null{
 for(const skill of ["Grammar","Vocabulary","Reading"] as const){
  const tags=subskillCatalog[skill],done=attempts.filter(a=>a.skill===skill);
  const anchors=bank.filter(q=>q.skill===skill&&q.level==="A2");
  const pending=anchors.find(q=>!done.some(a=>a.id===q.id));if(pending)return pending;
  const anchorRows=done.filter(a=>anchors.some(q=>q.id===a.id));
  const rate=anchorRows.filter(a=>a.correct).length/anchors.length;
  for(const tag of tags){const branch=bank.filter(q=>q.skill===skill&&q.tag===tag&&(rate>=.75?q.level==="B1":rate<=.4?q.level==="A1":q.level!=="A2"));
   const chosen=rate>.4&&rate<.75?[branch[0],branch[3]]:branch;
   const next=chosen.find(q=>!done.some(a=>a.id===q.id));if(next)return next;
  }
 }return null;
}
// Stable option order varies by item so position patterns cannot supply the answers.
for(const question of bank){let hash=0;for(const c of question.id)hash=(Math.imul(hash,31)+c.charCodeAt(0))>>>0;const rotation=hash%3;const order=[rotation,(rotation+1)%3,(rotation+2)%3];const old=question.options;question.options=order.map(i=>old[i]) as [string,string,string];question.correct=order.indexOf(question.correct);}
