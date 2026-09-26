import content from "@/content/learning-content.json";
const exercise=content.exercises.find(e=>e.id==="garden-relevant-idea")!;
import {NextRequest,NextResponse} from "next/server";
import {learnerKey} from "../identity";
import {recordEvidence} from "@/db/learning-store";
import type {Evidence} from "@/app/learning-model";
export async function POST(request:NextRequest){const owner=learnerKey(request);if(!owner)return NextResponse.json({error:"Sign in to save practice."},{status:401});try{const body=await request.json() as {activityId?:string;answer?:string};if(body.activityId!=="garden-relevant-idea"||!['a','b'].includes(body.answer??""))return NextResponse.json({error:"Choose an answer first."},{status:400});const evidence:Evidence[]=[{id:`exercise-garden-relevance-${body.answer}`,activityId:"garden-relevant-idea",questionId:"garden-relevant-idea",source:"exercise",skill:"Writing",tag:"task-understanding",score:Number(body.answer===exercise.answer.correctOptionId),max:1,at:Date.now(),mode:"rubric",detail:"Identify an on-topic idea; this does not assign a Writing language level.",raw:body}];await recordEvidence(owner,evidence);return NextResponse.json({evidence,correct:body.answer===exercise.answer.correctOptionId})}catch{return NextResponse.json({error:"Practice could not be saved. Please retry."},{status:503})}}
