import { NextRequest, NextResponse } from "next/server";
import { learnerKey } from "../identity";
import { makeDiagnostic, nextQuestion, recordAnswer, writingPrompts, type Attempt, type ListeningAttempt, type ListeningResult } from "@/app/learning-model";
import {coreListening} from "@/app/core-listening";
import {recordAssessment,getAssessment,hash} from "@/db/learning-store";
import { listeningTasks } from "@/app/listening-bank";
import { reviewWriting } from "../writing-review";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
 const owner=learnerKey(request);if(!owner)return NextResponse.json({error:"Sign in to finish the assessment."},{status:401});
 try{
 const body=await request.json() as {version?:number;sessionId?:string;attempts?:{id:string;answer:string}[];writing?:string;writing2?:string;listening?:ListeningAttempt[]};
 const version=body.version===4?4:body.version===3?3:2;const sessionId=typeof body.sessionId==="string"&&body.sessionId.length<=100?body.sessionId:await hash(body);const existing=await getAssessment(owner,sessionId);if(existing?.result)return NextResponse.json({result:existing.result,attempts:existing.attempts,writingReviews:existing.writingReviews});
 const texts=[body.writing??"",...(version>=3?[body.writing2??""]:[])];
 if(!Array.isArray(body.attempts)||body.attempts.length>90)return NextResponse.json({error:"Assessment answers could not be read. Your saved draft is unchanged. Please reload it and retry.",code:"invalid_answers"},{status:400});
 const minimumWords=version>=3?40:30;
 for(let i=0;i<texts.length;i++){const t=texts[i];if(typeof t!=="string"||t.length>5000)return NextResponse.json({error:`Writing sample ${i+1} must contain text of at most 5,000 characters.`,code:"invalid_writing"},{status:400});const count=t.trim().split(/\s+/).filter(Boolean).length;if(count<minimumWords)return NextResponse.json({error:`Writing sample ${i+1} has ${count} words. Add at least ${minimumWords-count} more before submitting.`,code:"short_writing"},{status:400});}
 let validated:Attempt[]=[];
 for(const [index,answer] of body.attempts.entries()){const expected=nextQuestion(validated,version);if(!answer||!expected||expected.id!==answer.id||typeof answer.answer!=="string"||!/^[0-2]$/.test(answer.answer))return NextResponse.json({error:`Saved answer ${index+1} does not match assessment version ${version}. Your draft is preserved; no result has been recorded. Please report this message so the saved attempt can be checked.`,code:"sequence_mismatch",questionNumber:index+1,assessmentVersion:version},{status:400});validated=recordAnswer(validated,expected,Number(answer.answer));}
 if(nextQuestion(validated,version))return NextResponse.json({error:`The assessment still needs another question after ${validated.length} saved answers. Reload to resume; your draft has not been deleted.`,code:"incomplete_assessment"},{status:400});
 const audioTasks=version===4?coreListening:listeningTasks;let listening:ListeningResult|undefined;
 if(body.listening?.length){if(body.listening.length!==audioTasks.length||body.listening.some((a,i)=>a.id!==audioTasks[i].id||!Number.isInteger(a.answer)||a.answer<0||a.answer>2||a.played!==true))return NextResponse.json({error:"Finish all Listening questions, or skip this optional section."},{status:400});const subskills:ListeningResult["subskills"]={};let correct=0;body.listening.forEach((a,i)=>{const q=audioTasks[i],ok=Number(a.answer===q.correct);correct+=ok;subskills[q.tag]??={correct:0,total:0};subskills[q.tag].correct+=ok;subskills[q.tag].total++});listening={correct,total:audioTasks.length,confidence:"low",subskills,note:"Synthetic speech screen; confidence remains low. Natural accents and conversation are not fully assessed.",evidence:version===4?body.listening.map((a,i)=>({id:`listen-${sessionId}-${a.id}`,activityId:`listen-${sessionId}`,source:"listening",skill:"Listening",tag:coreListening[i].tag,level:coreListening[i].level,score:Number(a.answer===coreListening[i].correct),max:1,at:Date.now(),mode:"rubric",questionId:a.id,raw:a})):undefined};}
 const ratings=await Promise.all(texts.map((t,i)=>reviewWriting(t,writingPrompts[i])));
 const result=makeDiagnostic(validated,texts.join("\n\n"),Date.now()-1,ratings.filter((r):r is NonNullable<typeof r>=>!!r),listening);
 await recordAssessment(owner,{version,sessionId,startedAt:result.at,finishedAt:result.at,attempts:validated,writing:texts[0],writing2:texts[1],listening:body.listening,result,writingReviews:ratings});
 return NextResponse.json({result,attempts:validated,writingReviews:ratings,writingAI:ratings.every(Boolean)});
 }catch{return NextResponse.json({error:"Assessment could not be completed. Your answers are still saved in your draft."},{status:503});}
}
