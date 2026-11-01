import {NextRequest,NextResponse} from 'next/server';
import {principal} from '../../identity';
import content from '@/content/learning-content.json';
export async function GET(request:NextRequest){const user=principal(request);if(!user)return NextResponse.json({error:'Sign in required.'},{status:401});if(!user.roles.includes('admin'))return NextResponse.json({error:'Administrator access required.'},{status:403});return new NextResponse(JSON.stringify(content,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="ai-english-tutor-content.json"','Cache-Control':'no-store'}})}
