import {NextRequest,NextResponse} from "next/server";
import {learnerKey} from "../identity";
import {recordEvidence} from "@/db/learning-store";
import {gardenRelevantIdeaResult} from "@/application/writing-practice";

export async function POST(request:NextRequest){
 const owner=learnerKey(request);
 if(!owner)return NextResponse.json({error:"Sign in to save practice."},{status:401});
 try{
  const body=await request.json() as {activityId?:string;answer?:string};
  if(body.activityId!=="garden-relevant-idea")return NextResponse.json({error:"Choose an answer first."},{status:400});
  const result=gardenRelevantIdeaResult(body.answer??"");
  await recordEvidence(owner,result.evidence);
  return NextResponse.json(result);
 }catch(e){
  if(e instanceof Error&&/Choose an answer/.test(e.message))return NextResponse.json({error:e.message},{status:400});
  return NextResponse.json({error:"Practice could not be saved. Please retry."},{status:503});
 }
}
