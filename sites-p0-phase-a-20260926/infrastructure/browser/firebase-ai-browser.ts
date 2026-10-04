import {getApps,initializeApp} from 'firebase/app';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import {getAI,getGenerativeModel,GoogleAIBackend} from 'firebase/ai';
import {createTutorService} from '../../ai/service';
import type {AITutor} from '../../ai/contracts';
import {
  FirebaseAILogicProvider,
  type FirebaseAILogicGenerateInput,
  type FirebaseAILogicTransport,
} from '../ai/firebase-ai-logic-provider';
import {
  firebaseAppCheckDebugEnabled,
  readFirebasePublicAIConfig,
  type FirebasePublicAIConfig,
} from './firebase-public-config';

const APP_NAME='self-learning-english-ai';
const REQUEST_TIMEOUT_MS=20_000;
const MIN_REQUEST_GAP_MS=1_200;

let aiInstance:ReturnType<typeof getAI>|null=null;
let appCheckReady=false;
let cachedTutor:AITutor|null=null;

function localDebugAllowed(){
  if(typeof location==='undefined')return false;
  return ['localhost','127.0.0.1','::1'].includes(location.hostname);
}

function ensureAI(config:FirebasePublicAIConfig){
  if(typeof window==='undefined')throw new Error('Firebase AI Logic is browser-only.');
  const app=getApps().find(candidate=>candidate.name===APP_NAME)??initializeApp({
    apiKey:config.apiKey,
    authDomain:config.authDomain,
    projectId:config.projectId,
    appId:config.appId,
  },APP_NAME);

  if(!appCheckReady){
    if(firebaseAppCheckDebugEnabled()&&localDebugAllowed()){
      (globalThis as typeof globalThis&{FIREBASE_APPCHECK_DEBUG_TOKEN?:boolean|string}).FIREBASE_APPCHECK_DEBUG_TOKEN=true;
    }
    initializeAppCheck(app,{
      provider:new ReCaptchaEnterpriseProvider(config.appCheckSiteKey),
      isTokenAutoRefreshEnabled:true,
    });
    appCheckReady=true;
  }

  aiInstance??=getAI(app,{backend:new GoogleAIBackend()});
  return aiInstance;
}

async function withTimeout<T>(promise:Promise<T>):Promise<T>{
  let timer:ReturnType<typeof setTimeout>|undefined;
  try{
    return await Promise.race([
      promise,
      new Promise<never>((_,reject)=>{
        timer=setTimeout(()=>reject(new Error('AI request timed out.')),REQUEST_TIMEOUT_MS);
      }),
    ]);
  }finally{
    if(timer)clearTimeout(timer);
  }
}

class FirebaseBrowserAILogicTransport implements FirebaseAILogicTransport{
  readonly available=true;
  readonly model:string;
  private inFlight=false;
  private lastStartedAt=0;

  constructor(private readonly config:FirebasePublicAIConfig){
    this.model=config.geminiModel;
  }

  async generateJSON(input:FirebaseAILogicGenerateInput):Promise<unknown>{
    if(this.inFlight)throw new Error('AI request already in progress.');
    const elapsed=Date.now()-this.lastStartedAt;
    if(this.lastStartedAt&&elapsed<MIN_REQUEST_GAP_MS)throw new Error('AI cooldown active.');

    this.inFlight=true;
    this.lastStartedAt=Date.now();
    try{
      const ai=ensureAI(this.config);
      const model=getGenerativeModel(ai,{
        model:this.model,
        systemInstruction:input.systemInstruction,
        generationConfig:{
          responseMimeType:input.responseMimeType,
          maxOutputTokens:1200,
        },
      });
      const generated=await withTimeout(model.generateContent(JSON.stringify(input.userPayload)));
      return JSON.parse(generated.response.text());
    }finally{
      this.inFlight=false;
    }
  }
}

export function browserTutorConfigured(){
  return readFirebasePublicAIConfig()!==null;
}

export function browserTutorService():AITutor{
  if(cachedTutor)return cachedTutor;
  const config=readFirebasePublicAIConfig();
  if(!config){
    cachedTutor=createTutorService(new FirebaseAILogicProvider({
      available:false,
      model:'unconfigured',
      async generateJSON(){return null},
    }));
    return cachedTutor;
  }
  cachedTutor=createTutorService(
    new FirebaseAILogicProvider(new FirebaseBrowserAILogicTransport(config)),
  );
  return cachedTutor;
}
