import {runtimeConfig} from '../runtime';
import {createTutorService} from '../../ai/service';
import {createAIProvider} from './provider-factory';

// Hosting composition only. Provider selection itself is portable and reusable by a future shared proxy.
export function tutorService(){return createTutorService(createAIProvider(runtimeConfig()))}
