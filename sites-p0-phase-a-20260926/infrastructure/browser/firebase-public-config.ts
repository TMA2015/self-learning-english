export type FirebasePublicAIConfig={
  apiKey:string;
  authDomain:string;
  projectId:string;
  appId:string;
  appCheckSiteKey:string;
  geminiModel:string;
};

const defaults:FirebasePublicAIConfig={
  // Firebase Web config and the Fraud Defense site key are public browser configuration.
  // Never put a Gemini Developer API key or service-account credential here.
  apiKey:'AIzaSyAnCa-t04dmwFHLARYN77o866tomq4RUBg',
  authDomain:'roadmap-toan-ai.firebaseapp.com',
  projectId:'roadmap-toan-ai',
  appId:'1:789845564404:web:26cfae781851ee7758b7a1',
  appCheckSiteKey:'6Ldewt4tAAAAAJFi38svQlInntj2htUFqJg690aD',
  geminiModel:'gemini-3.8-flash',
};

function clean(value:string|undefined){return (value??'').trim()}

export function readFirebasePublicAIConfig():FirebasePublicAIConfig|null{
  const config:FirebasePublicAIConfig={
    apiKey:clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)||defaults.apiKey,
    authDomain:clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)||defaults.authDomain,
    projectId:clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)||defaults.projectId,
    appId:clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)||defaults.appId,
    appCheckSiteKey:clean(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY)||defaults.appCheckSiteKey,
    geminiModel:clean(process.env.NEXT_PUBLIC_GEMINI_MODEL)||defaults.geminiModel,
  };
  if(Object.values(config).some(value=>!value))return null;
  if(!/^[a-z][a-z0-9-]{4,40}$/.test(config.projectId))return null;
  if(!/^1:\d+:web:[a-f0-9]+$/i.test(config.appId))return null;
  if(!/^[A-Za-z0-9._:-]{1,120}$/.test(config.geminiModel))return null;
  return config;
}

export function firebaseAppCheckDebugEnabled(){
  return process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG==='1';
}

export const FIREBASE_HOSTING_SITE='g-learning-english';
