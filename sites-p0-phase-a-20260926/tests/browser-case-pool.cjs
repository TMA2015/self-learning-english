'use strict';
// Bounded independent browser cases; drain in-flight work before fixture cleanup.
// No retry, no skipped case, no change to the browser assertion or profile.
const assert=require('node:assert/strict');
async function runCases(tasks,limit=2){
 assert(Number.isInteger(limit)&&limit>=1&&limit<=2);
 const results=new Array(tasks.length);
 let next=0,failed=false,error;
 async function worker(){
  while(!failed&&next<tasks.length){
   const index=next++;
   try{results[index]=await tasks[index]();}
   catch(e){if(!failed){failed=true;error=e;}}
  }
 }
 await Promise.all(Array.from({length:Math.min(limit,tasks.length)},worker));
 if(failed)throw error;
 assert.equal(next,tasks.length);
 return results;
}
module.exports={runCases};
if(require.main===module)(async()=>{
 const order=await runCases([async()=>1,async()=>2,async()=>3]);
 assert.deepEqual(order,[1,2,3]);
 let active=0,peak=0,done=0;
 await runCases(Array.from({length:6},()=>async()=>{peak=Math.max(peak,++active);await new Promise(r=>setTimeout(r,10));active--;done++;}));
 assert.equal(peak,2);assert.equal(done,6);
 let drained=false,unstarted=true;
 await assert.rejects(runCases([async()=>{throw Error('expected');},async()=>{await new Promise(r=>setTimeout(r,20));drained=true;},async()=>{unstarted=false;}]),/expected/);
 assert(drained&&unstarted);
 console.log('BROWSER_CASE_POOL_SELF_TEST_PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
