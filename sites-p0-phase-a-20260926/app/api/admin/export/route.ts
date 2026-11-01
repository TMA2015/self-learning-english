import {D1AcademicRepository} from "@/infrastructure/storage/d1-academic";
import {D1AssistedReviewRepository} from "@/infrastructure/storage/d1-assisted-review";
import {D1WritingRepository} from "@/infrastructure/storage/d1-writing-repository";
import {NextRequest,NextResponse} from 'next/server';
import {principal} from '../../identity';
import {runtimeConfig} from '@/infrastructure/runtime';
import {D1LearningRepository} from '@/infrastructure/storage/d1-repository';
import {exportLearner} from '@/application/export-learner';
export async function GET(request:NextRequest){const user=principal(request);if(!user)return NextResponse.json({error:'Sign in required.'},{status:401});if(!user.roles.includes('admin'))return NextResponse.json({error:'Administrator access required.'},{status:403});try{const data=await exportLearner(new D1LearningRepository(runtimeConfig().DB),{ownerId:user.accountId,learnerId:'primary'},new D1WritingRepository(runtimeConfig().DB),new D1AssistedReviewRepository(runtimeConfig().DB),new D1AcademicRepository(runtimeConfig().DB));return new NextResponse(JSON.stringify(data,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="ai-english-tutor-learner.json"','Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Export unavailable. No learner data changed.'},{status:503})}}
