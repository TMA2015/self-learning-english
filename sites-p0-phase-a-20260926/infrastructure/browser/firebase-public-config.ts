export type FirebasePublicAIConfig={
  apiKey:string;
  authDomain:string;
  projectId:string;
  appId:string;
  appCheckSiteKey:string;
  geminiModel:string;
};

function clean(value:string|undefined){return (value??'').trim()}

export function readFirebasePublicAIConfig():FirebasePublicAIConfig|null{
  const config:FirebasePublicAIConfig={
    apiKey:clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain:clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId:clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    appId:clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    appCheckSiteKey:clean(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY),
    geminiModel:clean(process.env.NEXT_PUBLIC_GEMINI_MODEL),
  };
  if(Object.values(config).some(value=>!value))return null;
  if(!/^[a-z][a-z0-9-]{4,40}$/.test(config.projectId))return null;
  if(!/^[A-Za-z0-9._:-]{1,120}$/.test(config.geminiModel))return null;
  return config;
}
