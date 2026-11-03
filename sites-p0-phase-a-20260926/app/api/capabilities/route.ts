import { NextRequest,NextResponse } from "next/server";
import { learnerKey,isAdministrator } from "../identity";
import { aiAvailable } from "../writing-review";
export async function GET(request:NextRequest){if(!learnerKey(request))return NextResponse.json({error:"Sign in to check assessment services."},{status:401});return NextResponse.json({isAdmin:isAdministrator(request),writingAI:aiAvailable(),speakingEvaluation:false,speechToText:false,pronunciationEvaluation:false,audioStorage:false,listening:"browser-speech-synthesis"},{headers:{"Cache-Control":"no-store"}});}
