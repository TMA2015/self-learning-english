/** Prevent late AI responses from crossing lesson boundaries.
 * Pure, local request identity; no learner data, grade, or network effects.
 */
export class LatestTutorRequest {
 private generation=0;
 begin(){return ++this.generation;}
 invalidate(){this.generation++;}
 isCurrent(ticket:number){return ticket===this.generation;}
}
