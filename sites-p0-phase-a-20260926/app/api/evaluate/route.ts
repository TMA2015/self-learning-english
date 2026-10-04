import { NextRequest, NextResponse } from "next/server";
import {recordEvidence,readState,rebuild} from "@/db/learning-store";
import {writingEvidence,type WritingRating} from "@/app/learning-model";
import {tutorService} from "@/infrastructure/ai/runtime";
import {task} from "@/app/content";
import {POST as submitWriting} from "../writing/route";
import { learnerKey } from "../identity";
import {guidedWritingFeedback} from "@/application/guided-writing";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const owner=learnerKey(request);if (!owner) return NextResponse.json({error:"Sign in to get feedback."},{status:401});
  let input: {stage?:string;answer?:unknown};
  try { input=await request.json(); } catch { return NextResponse.json({error:"Invalid answer."},{status:400}); }
  const stage = String(input.stage||"");
  if (!["analysis","brainstorm","outline","writing","revision"].includes(stage)) return NextResponse.json({error:"Invalid learning step."},{status:400});
  const answer=JSON.stringify(input.answer ?? {}).slice(0,12000);
  async function respond(payload:any){
    const raw=input.answer as Record<string,string>;
    if(!raw||typeof raw!=="object"||Object.values(raw).some(v=>typeof v!=="string"))return NextResponse.json({error:"Invalid answer fields."},{status:400});
    const index=["analysis","brainstorm","outline","writing","revision"].indexOf(stage);
    const evidence=writingEvidence(Math.min(index,3),raw,Date.now(),payload.rating as WritingRating|undefined).map(e=>({...e,raw:{stage,answer:raw},evaluation:payload.evaluation??payload.rating?.evaluation,...(stage==="revision"?{id:`revision-${e.id}`,source:"revision" as const,activityId:"school-garden-revision",provisional:true}:{} )}));
    try{await recordEvidence(owner!,evidence)}catch{return NextResponse.json({error:"Evidence could not be saved. Your text is still here; retry."},{status:503})}
    return NextResponse.json({...payload,evidence});
  }
  if(stage==="revision")return respond({mode:"guided",feedback:{...guidedWritingFeedback("writing",input.answer as Record<string,string>),summary:"Revision saved as new evidence. A sentence alone is not a full Writing proficiency assessment."}});
  if(stage==="writing"){
    const text=(input.answer as {writing?:unknown})?.writing;
    const response=await submitWriting(new NextRequest(request.url,{method:"POST",headers:request.headers,body:JSON.stringify({text,kind:"draft"})}));
    const data=await response.json() as any;if(!response.ok)return NextResponse.json(data,{status:response.status});
    const rating=data.evaluation.rating,s=rating?.scores;
    return NextResponse.json({...data,submissionId:data.submission.id,evaluationStatus:data.evaluation.status,mode:rating?"ai":"guided",rating,feedback:rating?{...rating,scores:{task:s["task-understanding"],ideas:s["idea-development"],organization:s.organization,grammar:s["grammar-accuracy"],vocabulary:s.vocabulary,sentences:s["sentence-quality"]}}:{summary:data.evaluation.reason??"Submission saved; evaluation pending.",strengths:[],improvements:[],corrections:[],tags:[],scores:null,exercise:"Check that your reason has a supporting example. AI-generated practice will appear after a successful review."}});
  }
  let learnerContext:Record<string,unknown>|undefined;
  if(tutorService().available){try{const saved=await readState(owner);const current=await rebuild(owner,saved??{});learnerContext={estimatedCEFR:current.learnerModel?.displayLevel??"insufficient evidence",subskills:current.learnerModel?.subskills??{},previousErrors:current.learnerModel?.errorTags??[],goals:current.profile?.goal??"Develop independent writing"}}catch{return NextResponse.json({error:"Learner context could not be loaded. Your text is still here; retry."},{status:503})}}
  const evaluation=await tutorService().coach(stage,task,input.answer,learnerContext);
  return evaluation?respond({mode:"ai",feedback:evaluation.structuredResult,evaluation}):respond({mode:"guided",feedback:guidedWritingFeedback(stage,input.answer as Record<string,string>)});
}
