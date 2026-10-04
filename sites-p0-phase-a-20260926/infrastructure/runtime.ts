// The only composition root that knows the hosting environment.
import {env} from 'cloudflare:workers';
import {D1LearningRepository} from './storage/d1-repository';
import {learningService} from '../application/learning-service';

export type RuntimeConfig={
  DB:D1Database;
  AI_PROVIDER?:'openai'|'gemini';
  OPENAI_API_KEY?:string;
  AI_MODEL?:string;
  GEMINI_API_KEY?:string;
  GEMINI_MODEL?:string;
  ADMIN_EMAILS?:string;
};

export function runtimeConfig(){return env as unknown as RuntimeConfig}
export function learnerStore(ownerId:string){const {DB}=runtimeConfig();if(!DB)throw Error('Persistent storage unavailable');return learningService(new D1LearningRepository(DB),{ownerId,learnerId:'primary'})}
