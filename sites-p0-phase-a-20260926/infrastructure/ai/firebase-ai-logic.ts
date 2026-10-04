import type {AITutorProvider,ProviderResult,TutorPurpose,TutorRequest} from '../../ai/contracts';

const allowedPurposes=new Set<TutorPurpose>([
  'writing-evaluation',
  'feedback',
  'error-explanation',
  'learning-plan-recommendations',
  'brainstorming-coaching',
  'speaking-evaluation',
  'writing-teaching',
]);

export type FirebaseAIModelLike={
  generateContent(input:{
    contents:{role:'user';parts:{text:string}[]}[];
  }):Promise<{response:{text():string|Promise<string>}}>;
};

export type FirebaseAIModelFactory=(config:{
  model:string;
  systemInstruction:string;
  generationConfig:{
    temperature:number;
    responseMimeType:'application/json';
  };
})=>FirebaseAIModelLike;

export type FirebaseAILogicProviderConfig={
  model:string;
  factory?:FirebaseAIModelFactory;
  maxInstructionChars?:number;
  maxInputChars?:number;
};

export class FirebaseAILogicProvider implements AITutorProvider{
  readonly available:boolean;
  private readonly maxInstructionChars:number;
  private readonly maxInputChars:number;

  constructor(private readonly config:FirebaseAILogicProviderConfig){
    this.available=typeof config.factory==='function'&&/^[A-Za-z0-9._:-]{1,120}$/.test(config.model);
    this.maxInstructionChars=config.maxInstructionChars??16_000;
    this.maxInputChars=config.maxInputChars??24_000;
  }

  async generate(request:TutorRequest):Promise<ProviderResult|null>{
    if(!this.available||!this.config.factory)return null;
    if(!allowedPurposes.has(request.purpose))return null;
    if(typeof request.instructions!=='string'||request.instructions.length>this.maxInstructionChars)return null;
    if(!Number.isFinite(request.temperature)||request.temperature<0||request.temperature>1)return null;

    let serialized:string;
    try{serialized=JSON.stringify(request.input)}
    catch{return null}
    if(serialized.length>this.maxInputChars)return null;

    try{
      const model=this.config.factory({
        model:this.config.model,
        systemInstruction:request.instructions,
        generationConfig:{
          temperature:request.temperature,
          responseMimeType:'application/json',
        },
      });
      const generated=await model.generateContent({
        contents:[{
          role:'user',
          parts:[{text:serialized}],
        }],
      });
      const text=await generated.response.text();
      const result=JSON.parse(text);
      if(result===null||result===undefined)return null;
      return {
        provider:'firebase-ai-logic-gemini',
        model:this.config.model,
        result,
      };
    }catch{
      return null;
    }
  }
}
