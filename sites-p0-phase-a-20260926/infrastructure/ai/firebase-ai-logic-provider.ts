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

/**
 * Provider adapter for Firebase AI Logic / Gemini Developer API.
 *
 * This file deliberately does not import the Firebase SDK. The browser SDK bridge
 * is a thin infrastructure detail added only after a Firebase project and App
 * Check are configured. English/Math can reuse the same transport contract.
 */
export class FirebaseAILogicProvider implements AITutorProvider{
  readonly available:boolean;

  constructor(private readonly transport:FirebaseAILogicTransport){
    this.available=transport.available;
  }

  async generate(request:TutorRequest):Promise<ProviderResult|null>{
    if(!this.available)return null;
    const result=await this.transport.generateJSON({
      systemInstruction:request.instructions,
      userPayload:request.input,
      temperature:request.temperature,
      responseMimeType:'application/json',
    });
    return {
      provider:'firebase-ai-logic',
      model:this.transport.model,
      result,
    };
  }
}
