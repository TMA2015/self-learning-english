import {getApps,initializeApp} from 'firebase/app';
import {FirebaseRequestLifecycle} from '../ai/firebase-request-lifecycle';
import {SafeProviderError,type ProviderDiagnostic} from '../../ai/provider-diagnostics';
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
let lastAIFailure:ProviderDiagnostic['classification']|null=null;
function safeDiagnostic(event:ProviderDiagnostic){
  // Never retain the student's answer, provider exception, or any token.
  if(event.phase==='fallback')lastAIFailure=event.classification;
  console.info('[English AI]',event);
}
export function resetAIFailure(){lastAIFailure=null}
export function readAIFailure(){return lastAIFailure}

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

class FirebaseBrowserAILogicTransport implements FirebaseAILogicTransport{
  readonly available=true;
  private readonly lifecycle=new FirebaseRequestLifecycle(safeDiagnostic);
  private selectedModel:string;
  get model(){return this.selectedModel}

  constructor(private readonly config:FirebasePublicAIConfig){
    this.selectedModel=config.geminiModel;
  }

  async generateJSON(input:FirebaseAILogicGenerateInput):Promise<unknown>{
    return this.lifecycle.run(async()=>{
      const ai=ensureAI(this.config);
      this.selectedModel=this.config.geminiModel;
      const model=getGenerativeModel(ai,{
        model:this.model,
        systemInstruction:input.systemInstruction,
        generationConfig:{
          responseMimeType:input.responseMimeType,
          maxOutputTokens:1200,
        },
      });
      const generated=await model.generateContent(JSON.stringify(input.userPayload));
      try{return JSON.parse(generated.response.text())}catch{throw new SafeProviderError('invalid-response')}
    });
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
    new FirebaseAILogicProvider(new FirebaseBrowserAILogicTransport(config),safeDiagnostic),
  );
  return cachedTutor;
}

