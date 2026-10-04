import type {AITutorProvider} from '../../ai/contracts';
import {OpenAIHTTPProvider} from './openai-http';
import {GeminiHTTPProvider} from './gemini-http';

export type AIProviderRuntimeConfig={
  AI_PROVIDER?:'openai'|'gemini';
  OPENAI_API_KEY?:string;
  AI_MODEL?:string;
  GEMINI_API_KEY?:string;
  GEMINI_MODEL?:string;
};

export function createAIProvider(config:AIProviderRuntimeConfig):AITutorProvider{
  if(config.AI_PROVIDER==='gemini')return new GeminiHTTPProvider(config.GEMINI_API_KEY,config.GEMINI_MODEL);
  if(config.AI_PROVIDER==='openai')return new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
  if(config.GEMINI_API_KEY&&!config.OPENAI_API_KEY)return new GeminiHTTPProvider(config.GEMINI_API_KEY,config.GEMINI_MODEL);
  return new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
}
