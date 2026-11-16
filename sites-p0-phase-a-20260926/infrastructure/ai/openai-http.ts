import type {AITutorProvider,TutorRequest} from '../../ai/contracts';
import {learnerExternalAiEnabled} from '../../domain/learner-external-ai-gate';
export class OpenAIHTTPProvider implements AITutorProvider {
 readonly available:boolean;
 constructor(private key?:string,private model='gpt-4.1-mini',private http:typeof fetch=fetch){this.available=!!key&&learnerExternalAiEnabled()}
 async generate(request:TutorRequest){
  // Defense in depth: deny before constructing any HTTP request, even if a
  // stale service instance was created under a different feature policy.
  if(!learnerExternalAiEnabled()||!this.available)return null;const response=await this.http('https://api.openai.com/v1/chat/completions',{method:'POST',signal:AbortSignal.timeout(25000),headers:{Authorization:`Bearer ${this.key}`,'Content-Type':'application/json'},body:JSON.stringify({model:this.model,temperature:request.temperature,response_format:{type:'json_object'},messages:[{role:'system',content:request.instructions},{role:'user',content:JSON.stringify(request.input)}]})});if(!response.ok)return null;const raw=await response.json() as {choices?:{message?:{content?:string}}[]};return {provider:'openai',model:this.model,result:JSON.parse(raw.choices?.[0]?.message?.content??'null')}}
}
