import {runtimeConfig} from './runtime';
import {D1LearningRepository} from './storage/d1-repository';
import {D1WritingRepository} from './storage/d1-writing-repository';
import {tutorService} from './ai/runtime';
import {writingTutor} from '../application/writing-tutor';
export function learnerWriting(ownerId:string){const {DB}=runtimeConfig();return writingTutor(new D1LearningRepository(DB),new D1WritingRepository(DB),{ownerId,learnerId:'primary'},tutorService())}
