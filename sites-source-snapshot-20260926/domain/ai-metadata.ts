/** Only normalized application JSON is retained; never vendor response objects. */
export type EvaluationMetadata={provider:string;model:string;promptVersion:string;promptId:string;timestamp:string;structuredResult:unknown};
