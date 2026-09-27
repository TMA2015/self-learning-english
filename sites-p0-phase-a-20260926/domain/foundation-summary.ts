/** A presentation-only summary of results already graded on the server.
 * Never derives CEFR or scores open responses from their existence/length.
 */
export type FoundationResult={correct:boolean|null};
export type FoundationSummary={correct:number;total:number;incorrect:number;reviewOnly:number;percent:number|null};
export function summarizeFoundationResults(results:readonly FoundationResult[]|null|undefined):FoundationSummary{
 const rows=results??[];
 const correct=rows.filter(row=>row.correct===true).length;
 const incorrect=rows.filter(row=>row.correct===false).length;
 const total=correct+incorrect;
 return {correct,total,incorrect,reviewOnly:rows.filter(row=>row.correct===null).length,percent:total?Math.round(100*correct/total):null};
}
