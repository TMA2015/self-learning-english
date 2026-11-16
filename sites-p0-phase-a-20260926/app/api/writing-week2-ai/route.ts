import {NextRequest,NextResponse} from 'next/server';
import {learnerKey} from '../identity';
import {readState} from '@/db/learning-store';
import {runtimeConfig} from '@/infrastructure/runtime';
import {OpenAIHTTPProvider} from '@/infrastructure/ai/openai-http';
import {reviewWeek2SavedPlan,validateWeek2SavedAIInput} from '@/application/writing-week2-ai-feedback';
import type {WritingBlockState} from '@/domain/writing-course-v2-b';
import {weekWork} from '@/domain/writing-course-v2-b';

export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
const unavailable='AI feedback isn\u2019t available right now. Your plan is saved; you can still edit or finish the lesson.';

// Authenticated server-only endpoint. The browser must never receive an API key.
// No persistence or scoring happens here. A saved snapshot is authoritative,
// not a client-supplied "saved=true" flag.
export async function POST(request:NextRequest){
 const owner=learnerKey(request);
 if(!owner)return NextResponse.json({error:'Sign in to request AI feedback.'},{status:401,headers});
 const length=Number(request.headers.get('content-length')??0);
 if(!Number.isFinite(length)||length>9000)return NextResponse.json({error:'Invalid request size.'},{status:413,headers});

 let input:unknown;
 try{input=await request.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400,headers})}
 const checked=validateWeek2SavedAIInput(input);
 if(!checked)return NextResponse.json({error:'Save a valid Week 2 plan first.'},{status:400,headers});

 const config=runtimeConfig() as ReturnType<typeof runtimeConfig>&{SLE_WEEK2_AI_FEEDBACK_ENABLED?:string};
 // Separate owner-controlled readiness switch: no surprise paid API requests.
 if(config.SLE_WEEK2_AI_FEEDBACK_ENABLED!=='true')return NextResponse.json({error:unavailable},{status:503,headers});

 try{
  const previous=await readState(owner) as {writingCourseV2B?:WritingBlockState}|null;
  const saved=weekWork(previous?.writingCourseV2B,2);
  const submission=saved.submission;
  const index=saved.history.findIndex(h=>h.signature===checked.signature&&h.at===submission?.at);
  if(!submission||submission.signature!==checked.signature||
    JSON.stringify(submission.fields)!==checked.signature||!saved.confirmedOwnWork||
    index+1!==checked.version){
   return NextResponse.json({error:'This plan has changed. Save the current version before requesting AI feedback.'},
    {status:409,headers});
  }
  const provider=new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
  const feedback=await reviewWeek2SavedPlan(provider,checked);
  if(!feedback)return NextResponse.json({error:unavailable},{status:503,headers});
  return NextResponse.json({feedback},{status:200,headers});
 }catch{
  // No prompt text, provider exception or account identifiers in logs.
  return NextResponse.json({error:unavailable},{status:503,headers});
 }
}
