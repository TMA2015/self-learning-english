import { NextRequest, NextResponse } from "next/server";
import {recordEvidence,readState,rebuild} from "@/db/learning-store";
import {writingEvidence,type WritingRating} from "@/app/learning-model";
import {tutorService} from "@/infrastructure/ai/runtime";
import {task} from "@/app/content";
import {POST as submitWriting} from "../writing/route";
import { learnerKey } from "../identity";
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
  if(stage==="revision")return respond({mode:"guided",feedback:{...guided("writing",answer),summary:"Revision saved as new evidence. A sentence alone is not a full Writing proficiency assessment."}});
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
  return evaluation?respond({mode:"ai",feedback:evaluation.structuredResult,evaluation}):respond({mode:"guided",feedback:guided(stage,answer)});
}
function guided(stage:string, raw:string) {
  let a:Record<string,string>={}; try{a=JSON.parse(raw);}catch{}
  const all=Object.values(a).join(" ").trim();
  const words=all.split(/\s+/).filter(Boolean).length;
  const initial = {summary:"I have read your work. Check the suggestions before moving on.",strengths:[] as string[],improvements:[] as string[],exercise:"",scores:null as null|Record<string,number>,corrections:[] as {original:string,revised:string,why:string,tag:string}[],tags:[] as string[]};
  if (!all || words<4) {initial.summary="Write a little more so that feedback can be useful.";initial.improvements=["Add at least one clear idea of your own."];return initial;}
  if(stage==="analysis") {
    initial.strengths=["You tried to break the question into parts."];
    if (!/garden/i.test(all)) initial.improvements.push("Name the topic: a small school garden.");
    if (!/agree|disagree/i.test(all)) initial.improvements.push("State the task: say whether you agree or disagree.");
    if (!/school/i.test(all)) initial.improvements.push("Keep the scope on a garden at school.");
    if (!initial.improvements.length) initial.improvements=["Check that each reason is connected to school life."];
    initial.exercise="Write one sentence beginning: I agree because…";
  } else if(stage==="brainstorm") {
    initial.strengths=["You thought of your own ideas before asking for hints."];
    initial.improvements=[words<16?"Add another reason and a specific school example.":"Choose your strongest two ideas and explain how each helps students."];
    initial.exercise="Choose one idea and add: For example, students can…";
  } else if(stage==="outline") {
    initial.strengths=["You organized ideas before writing."];
    initial.improvements=["Check the order: opinion → reason → example → ending. Make each example support its reason."];
    initial.exercise="Write an opening sentence that clearly gives your opinion.";
  } else {
    initial.strengths=["You completed a draft with your own ideas."];
    if(words<35) initial.improvements.push("Add a reason and a concrete example to develop this short draft.");
    if (!/because|so|for example|such as/i.test(all)) initial.improvements.push("Connect a reason with because or add an example with For example.");
    if (!/garden/i.test(all)) initial.improvements.push("Mention the school garden to show that you are answering the question.");
    if (!initial.improvements.length) initial.improvements=["Check each reason: have you explained it or given an example?"];
    initial.exercise="Add a sentence explaining your strongest reason. Start with Because…";
  }
  return initial;
}
