import type {AITutorProvider,ProviderResult,TutorRequest} from '../../ai/contracts';

/**
 * SLE free-first Writing AI — Cloudflare Workers AI binding adapter.
 *
 * This adapter does not fetch URLs or carry credentials. Only the server's
 * `env.AI` binding can invoke inference. No request/response/prompt logging.
 * Enabling the binding is a separate Owner-controlled deployment decision.
 *
 * The pinned model is listed as supporting JSON Mode. Output is still
 * schema-validated by the existing tutor service; no claim of accuracy follows
 * from successful JSON parsing.
 */
export const SLE_WORKERS_AI_WRITING_MODEL='@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export type WorkersAIMessage={role:'system'|'user';content:string};
export type WorkersAIInput={
 messages:WorkersAIMessage[];
 response_format:{type:'json_object'};
 temperature:number;
 max_tokens:number;
 stream:false;
};

/** Minimal type boundary; avoids Cloudflare model-specific generated types. */
export interface WorkersAIRunner{
 run(model:string,input:WorkersAIInput):Promise<unknown>;
}

type WorkersAIReply={
 response?:unknown;
 choices?:{message?:{content?:unknown}}[];
};

export class WorkersAIProvider implements AITutorProvider{
 readonly available:boolean;
 readonly model=SLE_WORKERS_AI_WRITING_MODEL;

 constructor(private readonly binding?:WorkersAIRunner|null){
  this.available=!!binding&&typeof binding.run==='function';
 }

 async generate(request:TutorRequest):Promise<ProviderResult|null>{
  if(!this.available||!this.binding)return null;
  if(request.schemaVersion!==1||typeof request.instructions!=='string'||
    request.instructions.length>16000||!Number.isFinite(request.temperature)||
    request.temperature<0||request.temperature>1)return null;
  let input:string;
  try{input=JSON.stringify(request.input)}catch{return null}
  if(!input||input.length>12000)return null;

  try{
   const result=await this.binding.run(this.model,{
    messages:[
     {role:'system',content:request.instructions+
      '\nReturn ONLY a valid JSON object matching the requested fields. Never include Markdown code fences.'},
     {role:'user',content:input},
    ],
    response_format:{type:'json_object'},
    temperature:request.temperature,
    max_tokens:1800,
    stream:false,
   });
   let value:unknown=result;
   if(value&&typeof value==='object'){
    const output=value as WorkersAIReply;
    if(output.response!==undefined)value=output.response;
    else if(output.choices?.[0]?.message)value=output.choices[0].message.content;
   }
   if(typeof value==='string'){
    if(value.length>24000)return null;
    value=JSON.parse(value);
   }
   if(!value||typeof value!=='object'||Array.isArray(value))return null;
   return {provider:'cloudflare-workers-ai',model:this.model,result:value};
  }catch{
   // Quota, timeouts, malformed output and model errors are all fail-closed.
   // Never log learner prompts, third-party errors, or credentials.
   return null;
  }
 }
}
