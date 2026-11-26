'use strict';
// #251 research only. Deterministic synthetic model of read-await-write and cooperative lock.
// NOT production storage code. The allWritersCooperate flag is a modeled precondition, NOT detectable proof.
// Version order in fixture is append order; actual adapter must use compareVersions and revalidate storage/recovery.
// Pilot defers opted-in retention rather than silently changing its behavior; full solution needs coordinated attempt/retention/recovery tests.
function clone(x){return JSON.parse(JSON.stringify(x))}

function fixture(){return {packages:[{version:"1.28.0",digest:"base",lessons:["L1","L2"]}],attempts:[{id:"old",version:"1.28.0",lesson:"L1",score:1}],marker:false,retention:false,quota:false,writes:0}}

function next(version="1.28.1",digest="next"){return {version,digest,lessons:["L1","L2"]}}

function covers(s){return s.attempts.every(a=>s.packages.some(p=>p.version===a.version&&p.lessons.includes(a.lesson)))}

function oldPrepare(s,p){return [...clone(s.packages),clone(p)]}

function oldWrite(s,rows){s.packages=rows;s.writes++}

function lockedQueue(){let tail=Promise.resolve();return fn=>{const p=tail.then(fn);tail=p.catch(()=>{});return p}}

async function guardedAdd(s,p,expected,lock,allWritersCooperate){
 if(!lock||!allWritersCooperate)return "UNAVAILABLE";
 return lock(async()=>{
  if(s.marker)return "RECOVERY";
  if(s.retention)return "RETENTION_NOT_PROVEN";
  const current=s.packages.at(-1);
  const same=s.packages.find(x=>x.version===p.version);
  if(same)return same.digest===p.digest?"ALREADY":"CONFLICT";
  if(!current||current.version!==expected.version||current.digest!==expected.digest)return "CONFLICT";
  const rows=[...clone(s.packages),clone(p)];
  if(!covers({...s,packages:rows}))return "MISSING_SOURCE";
  if(s.quota)return "QUOTA";
  oldWrite(s,rows);
  return s.packages.some(x=>x.version===p.version&&x.digest===p.digest)&&covers(s)?"ADDED":"UNKNOWN";
 })
}

async function cases(){
 const results=[];const base={version:"1.28.0",digest:"base"};const check=(name,pass,detail)=>results.push({name,pass:!!pass,detail});
 // Model of current read-await-write, not executed production TS.
 {
 const s=fixture(),a=oldPrepare(s,next()),b=oldPrepare(s,next("1.28.2","later"));
 oldWrite(s,a);s.attempts.push({id:"new",version:"1.28.1",lesson:"L2"});oldWrite(s,b);
 check("uncoordinated-lost-source-witness",!covers(s),"Expected race witness: version 1.28.1 overwritten after new attempt");
 }
 {
 const s=fixture(),a=oldPrepare(s,next()),b=oldPrepare(s,next("1.28.1","different"));
 oldWrite(s,a);oldWrite(s,b);
 check("uncoordinated-immutable-conflict-witness",s.packages.at(-1).digest==="different","Expected stale write replaces same-version digest");
 }
 {
 const s=fixture(),lock=lockedQueue(),old=JSON.stringify(s.attempts);
 const r=await guardedAdd(s,next(),base,lock,true);
 check("add-preserves-history",r==="ADDED"&&covers(s)&&JSON.stringify(s.attempts)===old&&s.writes===1,"One additive write");
 }
 {
 const s=fixture(),lock=lockedQueue(),r=await Promise.all([guardedAdd(s,next(),base,lock,true),guardedAdd(s,next("1.28.2","later"),base,lock,true)]);
 check("serialized-stale-writer",r.join(",")==="ADDED,CONFLICT"&&s.writes===1&&covers(s),"Second request rechecks predecessor");
 }
 {
 const s=fixture(),lock=lockedQueue(),r=await Promise.all([guardedAdd(s,next(),base,lock,true),guardedAdd(s,next(),base,lock,true)]);
 check("duplicate-idempotent",r.join(",")==="ADDED,ALREADY"&&s.writes===1,"Same version/digest no extra write");
 }
 {
 const s=fixture(),lock=lockedQueue(),r=await Promise.all([guardedAdd(s,next(),base,lock,true),guardedAdd(s,next("1.28.1","different"),base,lock,true)]);
 check("same-version-conflict",r.join(",")==="ADDED,CONFLICT"&&s.writes===1,"First immutable digest stays");
 }
 for(const [name,expected,mutate,lockAvailable,cooperative] of [
 ["quota","QUOTA",s=>s.quota=true,true,true],
 ["recovery-marker","RECOVERY",s=>s.marker=true,true,true],
 ["retention-opted-in","RETENTION_NOT_PROVEN",s=>s.retention=true,true,true],
 ["no-lock","UNAVAILABLE",()=>{},false,true],
 ["legacy-tab-uncooperative","UNAVAILABLE",()=>{},true,false],
 ["broken-old-source","MISSING_SOURCE",s=>s.attempts.push({id:"broken",version:"1.27.0",lesson:"L1"}),true,true]
 ]){
 const s=fixture();mutate(s);const before=JSON.stringify(s);
 const r=await guardedAdd(s,next(),base,lockAvailable?lockedQueue():null,cooperative);
 check(name,r===expected&&before===JSON.stringify(s),"No changes to any modeled key");
 }
 {
 const s=fixture(),lock=lockedQueue();
 const recovery=lock(async()=>{s.marker=true;});const update=guardedAdd(s,next(),base,lock,true);await recovery;
 check("recovery-wins-lock",await update==="RECOVERY"&&s.writes===0,"Marker rechecked after lock acquisition");
 }
 {
 const s=fixture(),lock=lockedQueue();await guardedAdd(s,next(),base,lock,true);
 const stale=oldPrepare(fixture(),next("1.28.2","later"));
 s.attempts.push({id:"new",version:"1.28.1",lesson:"L2"});oldWrite(s,stale);
 check("bypassing-lock-still-unsafe",!covers(s),"Expected witness: lock only works when every writer participates");
 }
 return results;
}

cases().then(rows=>{console.log(JSON.stringify({gate:'RESEARCH_STORAGE_SERIALIZATION_MODEL',pass:rows.filter(r=>r.pass).length,total:rows.length,rows,browser:'NOT_TESTED',deployment:'NOT_AUTHORIZED'},null,2));if(!rows.every(r=>r.pass))process.exitCode=1;}).catch(e=>{console.error(e);process.exitCode=1;});
