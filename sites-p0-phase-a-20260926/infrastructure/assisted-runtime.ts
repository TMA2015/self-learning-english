import {runtimeConfig} from './runtime';
import {D1LearningRepository} from './storage/d1-repository';
import {D1WritingRepository} from './storage/d1-writing-repository';
import {D1AssistedReviewRepository} from './storage/d1-assisted-review';
import {assistedReview} from '../application/assisted-review';
export function accountReviews(ownerId:string){const {DB}=runtimeConfig();return assistedReview(new D1LearningRepository(DB),new D1WritingRepository(DB),new D1AssistedReviewRepository(DB),{ownerId,learnerId:'primary'})}
