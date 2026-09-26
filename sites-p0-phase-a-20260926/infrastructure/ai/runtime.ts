import {runtimeConfig} from '../runtime';
import {OpenAIHTTPProvider} from './openai-http';
import {createTutorService} from '../../ai/service';
// Provider selection belongs here, never in domain, content, data or components.
export function tutorService(){const config=runtimeConfig();return createTutorService(new OpenAIHTTPProvider(config.OPENAI_API_KEY,config.AI_MODEL))}
