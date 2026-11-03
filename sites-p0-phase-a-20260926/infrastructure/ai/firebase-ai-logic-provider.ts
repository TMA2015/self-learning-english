import {classifyProviderFailure,emitSafeDiagnostic,type DiagnosticSink,type ProviderFailure} from '../../ai/provider-diagnostics';
import type {AITutorProvider,ProviderResult,TutorRequest} from '../../ai/contracts';

export type FirebaseAILogicGenerateInput={
  systemInstruction:string;
  userPayload:Record<string,unknown>;
  temperature:number;
  responseMimeType:'application/json';
};

export interface FirebaseAILogicTransport{
  readonly available:boolean;
  readonly model:string;
  generateJSON(input:FirebaseAILogicGenerateInput):Promise<unknown>;
}

const MAX_INSTRUCTION_CHARS=16_000;
const MAX_INPUT_CHARS=24_000;

export class FirebaseAILogicProvider implements AITutorProvider{
  readonly available:boolean;

  constructor(private readonly transport:FirebaseAILogicTransport,private readonly diagnostics?:DiagnosticSink){
    this.available=transport.available;
  }

  reportFailure(classification:ProviderFailure){emitSafeDiagnostic(this.diagnostics,classification)}

  async generate(request:TutorRequest):Promise<ProviderResult|null>{
    if(!this.available){this.reportFailure('unavailable');return null}
    if(typeof request.instructions!=='string'||request.instructions.length>MAX_INSTRUCTION_CHARS)return null;
    if(!Number.isFinite(request.temperature)||request.temperature<0||request.temperature>1)return null;
    let serialized:string;
    try{serialized=JSON.stringify(request.input)}catch{return null}
    if(serialized.length>MAX_INPUT_CHARS)return null;

    try{
      const result=await this.transport.generateJSON({
        systemInstruction:request.instructions,
        userPayload:request.input,
        temperature:request.temperature,
        responseMimeType:'application/json',
      });
      if(result===null||result===undefined){this.reportFailure('invalid-response');return null}
      return {provider:'firebase-ai-logic',model:this.transport.model,result};
    }catch(error){
      this.reportFailure(classifyProviderFailure(error));
      return null;
    }
  }
}

