import {runtimeConfig} from '../runtime';
import {OpenAIHTTPProvider} from './openai-http';
import {WorkersAIProvider,type WorkersAIRunner} from './workers-ai-provider';
import {createTutorService} from '../../ai/service';
import type {AITutorProvider} from '../../ai/contracts';

// Provider selection belongs on the SERVER, never in the lesson content or browser.
// Until the Owner explicitly binds AI and selects Workers AI, prior OpenAI behaviour
// remains unchanged. An explicitly selected but absent AI binding FAILS CLOSED:
// do not fall back to a potentially billable OpenAI request.
export type WritingAIConfig=ReturnType<typeof runtimeConfig>&{
  AI?:WorkersAIRunner;
  SLE_WRITING_AI_PROVIDER?:string;
};

export function selectWritingAIProvider(config:WritingAIConfig):AITutorProvider{
 if(config.SLE_WRITING_AI_PROVIDER==='cloudflare-workers-ai')return new WorkersAIProvider(config.AI);
 return new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL);
}

export function tutorService(){
 const config=runtimeConfig() as WritingAIConfig;
 return createTutorService(selectWritingAIProvider(config));
}
