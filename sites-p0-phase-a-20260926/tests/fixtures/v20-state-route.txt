import {NextRequest,NextResponse} from "next/server";
import {learnerKey} from "../identity";
import {readState,importLegacy,rebuild,saveState,getAssessment} from "@/db/learning-store";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){const owner=learnerKey(request);if(!owner)return NextResponse.json({error:"Sign in to load your private progress."},{status:401});try{const previous=await readState(owner);await importLegacy(owner,previous);const rebuilt=await rebuild(owner,previous??{});const state=previous||rebuilt.evidence?.length?rebuilt:null;return NextResponse.json({state,storage:"persistent"},{headers:{"Cache-Control":"no-store"}})}catch{return NextResponse.json({error:"Progress could not be loaded. Please retry before editing."},{status:503})}}
export async function PUT(request:NextRequest){const owner=learnerKey(request);if(!owner)return NextResponse.json({error:"Sign in to save progress."},{status:401});try{const body=await request.json() as Record<string,any>;if(!body||typeof body!=="object"||Array.isArray(body))return NextResponse.json({error:"Invalid progress data."},{status:400});if(JSON.stringify(body).length>2000000)return NextResponse.json({error:"This work is too long to save."},{status:413});const previous=await readState(owner);await importLegacy(owner,previous);
 // Mastery and evidence are rebuilt from account-scoped server records. Other saved
 // fields (including the complete Writing workflow) retain their original shape.
 if(body.diagnosticV2?.result){const canonical=await getAssessment(owner,body.diagnosticV2.sessionId??String(body.diagnosticV2.startedAt));if(canonical?.result)body.diagnosticV2={...body.diagnosticV2,...canonical};else body.diagnosticV2={...body.diagnosticV2,result:undefined}}
 const state=await rebuild(owner,{...previous,...body});await saveState(owner,state);return NextResponse.json({ok:true,storage:"persistent",learnerModel:state.learnerModel,learningPlan:state.learningPlan});
 }catch{return NextResponse.json({error:"Saving failed. Keep this page open and retry."},{status:503})}}
