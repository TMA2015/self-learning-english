import {runtimeConfig} from '../runtime';
import {OpenAIHTTPProvider} from './openai-http';
import {createTutorService} from '../../ai/service';
import {learnerExternalAiEnabled} from '../../domain/learner-external-ai-gate';
// Provider selection belongs here, never in domain, content, data or components.
export function tutorService(){const config=runtimeConfig();return createTutorService(new OpenAIHTTPProvider(learnerExternalAiEnabled()?config.OPENAI_API_KEY:undefined,config.AI_MODEL))}
