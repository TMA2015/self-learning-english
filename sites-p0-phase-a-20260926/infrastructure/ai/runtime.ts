import {runtimeConfig,type RuntimeConfig} from '../runtime';
import {OpenAIHTTPProvider} from './openai-http';
import {GeminiHTTPProvider} from './gemini-http';
import {createTutorService} from '../../ai/service';
import type {AITutorProvider} from '../../ai/contracts';

// Provider selection belongs here, never in domain, content, data or components.
export function aiProvider(config:RuntimeConfig=runtimeConfig()):AITutorProvider{
  if(config.AI_PROVIDER==='gemini')return new GeminiHTTPProvider(config.GEMINI_API_KEY,config.GEMINI_MODEL);
  if(config.AI_PROVIDER==='openai')return new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
  // Backward compatible: existing OpenAI deployments remain unchanged. A new Gemini-only
  // deployment can opt in by configuring GEMINI_API_KEY without touching learner/content code.
  if(config.GEMINI_API_KEY&&!config.OPENAI_API_KEY)return new GeminiHTTPProvider(config.GEMINI_API_KEY,config.GEMINI_MODEL);
  return new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
}

export function tutorService(){return createTutorService(aiProvider())}
