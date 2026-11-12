import contracts from '../content/writing-source-contracts-v1.json';

export type WritingSourceContract={
 unit:string;
 readingLessonId:string;
 readingAssetId:string;
 listeningLessonId?:string;
};

/** Explicit, academically auditable source links for integrated Writing work.
 * The canonical source text and audio are NEVER duplicated here.
 * New imported lessons must pass the all-catalog source audit before release.
 */
const sourceMap=contracts.lessons as Record<string,WritingSourceContract>;
export function writingSourceContractFor(lessonId:string):WritingSourceContract|null{
 return Object.prototype.hasOwnProperty.call(sourceMap,lessonId)?sourceMap[lessonId]:null;
}
export function writingSourceContractIds():string[]{
 return Object.keys(sourceMap);
}
