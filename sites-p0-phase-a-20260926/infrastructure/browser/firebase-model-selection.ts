export const DEFAULT_WRITING_AI_MODEL='gemini-3.5-flash';
export const WRITING_AI_MODEL_KEY='english_writing_ai_model';
export const REMOTE_MODEL_FETCH_INTERVAL_MS=12*60*60*1000;
export function validWritingModel(value:unknown):value is string{
  return typeof value==='string'&&/^gemini-[a-zA-Z0-9][a-zA-Z0-9.-]{0,100}$/.test(value);
}
/** One background fetch per session. Writing clicks never wait for Remote Config. */
export class CachedWritingModel{
  private started=false;
  private value:string;
  constructor(defaultValue=DEFAULT_WRITING_AI_MODEL){this.value=validWritingModel(defaultValue)?defaultValue:DEFAULT_WRITING_AI_MODEL}
  get model(){return this.value}
  refreshOnce(load:()=>Promise<unknown>){
    if(this.started)return;
    this.started=true;
    void Promise.resolve().then(load).then(value=>{if(validWritingModel(value))this.value=value},()=>{/* retain safe local default */});
  }
}
