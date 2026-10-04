import type {AITutorProvider,TutorRequest} from '../../ai/contracts';

type GeminiGenerateContentResponse={
  candidates?:Array<{content?:{parts?:Array<{text?:string}>}}>
};

export class GeminiHTTPProvider implements AITutorProvider {
  readonly available:boolean;
  constructor(
    private key?:string,
    private model='gemini-3.8-flash',
    private http:typeof fetch=fetch
  ){this.available=!!key}

  async generate(request:TutorRequest){
    if(!this.available)return null;
    const endpoint=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`;
    try{
      const response=await this.http(endpoint,{
        method:'POST',
        signal:AbortSignal.timeout(25000),
        headers:{
          'x-goog-api-key':this.key!,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          systemInstruction:{parts:[{text:request.instructions}]},
          contents:[{
            role:'user',
            parts:[{text:JSON.stringify(request.input)}]
          }],
          generationConfig:{
            temperature:request.temperature,
            responseMimeType:'application/json'
          }
        })
      });
      if(!response.ok)return null;
      const raw=await response.json() as GeminiGenerateContentResponse;
      const text=raw.candidates?.[0]?.content?.parts?.map(part=>part.text??'').join('').trim();
      if(!text)return null;
      return {provider:'google-gemini',model:this.model,result:JSON.parse(text)};
    }catch{
      return null;
    }
  }
}
