import {tutorService} from '@/infrastructure/ai/runtime';
export {validateRating} from '@/ai/validation';
export const aiAvailable=()=>tutorService().available;
export const reviewWriting=(text:string,prompt:string)=>tutorService().evaluateWriting(text,prompt);
