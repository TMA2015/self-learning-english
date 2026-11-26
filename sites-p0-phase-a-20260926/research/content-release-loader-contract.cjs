'use strict';
// #251 RESEARCH ONLY. Synthetic dependency-contract proof; not registered, not runtime, not deployment authorization.
// authorize must be independently trustworthy: a pointer cannot approve itself. Trust mechanism remains undecided.
// compareAndAdd must provide atomic conflict/quota semantics and confirmed readback; actual browser/multi-tab implementation NOT proven.
// Existing bundled fallback must be installed and readable before this optional update check. Never delete learner data.
// All hash/decoder/validation/transport operations in these cases are mocks, not cryptographic or browser QA.
function comparePatch(a,b){const parse=v=>typeof v==="string"&&/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v)?v.split(".").map(Number):null;const x=parse(a),y=parse(b);if(!x||!y||![...x,...y].every(Number.isSafeInteger))return null;for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]<y[i]?-1:1;return 0}

async function gate(pointer,deps){
 const no=reason=>({status:"RETAIN_EXISTING",reason});
 const hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
 const keys=["schema","scope","baseVersion","baseCanonicalSha256","version","rawSha256","canonicalSha256","byteLength","path","compatibilityId"].sort().join(",");
 const valid=x=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).sort().join(",")===keys&&x.schema===1&&x.scope==="reading-wording-only"&&comparePatch(x.baseVersion,x.version)===-1&&x.baseVersion.split(".").slice(0,2).join(".")===x.version.split(".").slice(0,2).join(".")&&Number(x.version.split(".")[2])===Number(x.baseVersion.split(".")[2])+1&&hex(x.baseCanonicalSha256)&&hex(x.rawSha256)&&hex(x.canonicalSha256)&&Number.isSafeInteger(x.byteLength)&&x.byteLength>0&&x.byteLength<=deps.maxBytes&&x.path===`/content-releases/${x.version}/${x.rawSha256}.json`&&typeof x.compatibilityId==="string"&&/^[a-z0-9-]{1,80}$/.test(x.compatibilityId);
 const same=(a,b)=>valid(a)&&valid(b)&&Object.keys(a).every(k=>a[k]===b[k]);
 try{
  if(!valid(pointer))return no("invalid-pointer");
  const trusted=await deps.authorize(pointer);
  if(!same(pointer,trusted))return no("untrusted-manifest");
  const old=await deps.current();
  if(!old||!hex(old.digest)||comparePatch(old.version,pointer.version)===null)return no("invalid-local-baseline");
  const cmp=comparePatch(old.version,pointer.version);
  if(cmp>0)return no("newer-local");
  if(cmp===0)return no(old.digest===pointer.canonicalSha256?"already-current":"immutable-conflict");
  if(old.version!==pointer.baseVersion||old.digest!==pointer.baseCanonicalSha256)return no("unrecognized-base");
  // Adapter must enforce same-origin/no redirects and streamed size cap BEFORE allocating all bytes.
  const bytes=await deps.download(pointer.path,pointer.byteLength);
  if(!(bytes instanceof Uint8Array)||bytes.byteLength!==pointer.byteLength)return no("length");
  if(await deps.rawDigest(bytes)!==pointer.rawSha256)return no("raw-digest");
  const source=await deps.decode(bytes);
  if(!source||source.schema_version!==pointer.version)return no("version");
  if(!(await deps.validateAndMap(source)))return no("schema-map");
  if(await deps.canonicalDigest(source)!==pointer.canonicalSha256)return no("canonical-digest");
  if(!(await deps.verifyCompatibility(old,source,trusted)))return no("projection");
  // This interface is a required transactional contract, NOT an assertion that localStorage has CAS.
  const outcome=await deps.compareAndAdd({expectedVersion:old.version,expectedDigest:old.digest,source,digest:pointer.canonicalSha256});
  if(outcome!=="ADDED")return no(outcome==="QUOTA"?"quota":outcome==="CONFLICT"?"concurrent-change":"commit-not-confirmed");
  return {status:"ACTIVATED",version:pointer.version};
 }catch(e){return no("dependency-failure")}
}

async function runCases(){
 const h=c=>c.repeat(64), good={schema:1,scope:"reading-wording-only",baseVersion:"1.28.0",baseCanonicalSha256:h("a"),version:"1.28.1",rawSha256:h("b"),canonicalSha256:h("c"),byteLength:3,path:`/content-releases/1.28.1/${h("b")}.json`,compatibilityId:"proof-001"};
 const tests=[
 ["approved","ACTIVATED",()=>{}],["untrusted","untrusted-manifest",(p,d)=>d.authorize=async()=>null],
 ["joint-tamper","untrusted-manifest",(p,d)=>{p.rawSha256=h("d");p.path=`/content-releases/1.28.1/${h("d")}.json`}],
 ["extra-field","invalid-pointer",p=>p.extra=true],["external-url","invalid-pointer",p=>p.path="https://other.example/a.json"],
 ["path-traversal","invalid-pointer",p=>p.path="/content-releases/../a.json"],["oversize","invalid-pointer",p=>p.byteLength=1001],
 ["version-jump","invalid-pointer",p=>p.version="1.28.2"],["offline","dependency-failure",(p,d)=>d.download=async()=>{throw Error("offline")}],
 ["truncated","length",(p,d)=>d.download=async()=>new Uint8Array(2)],["tampered-bytes","raw-digest",(p,d)=>d.rawDigest=async()=>h("d")],
 ["invalid-json","dependency-failure",(p,d)=>d.decode=async()=>{throw Error("bad JSON")}],
 ["wrong-package-version","version",(p,d)=>d.decode=async()=>({schema_version:"1.28.2"})],
 ["invalid-schema","schema-map",(p,d)=>d.validateAndMap=async()=>false],
 ["canonical-mismatch","canonical-digest",(p,d)=>d.canonicalDigest=async()=>h("d")],
 ["unverified-projection","projection",(p,d)=>d.verifyCompatibility=async()=>false],
 ["newer-local","newer-local",(p,d)=>d.current=async()=>({version:"1.28.2",digest:h("d")})],
 ["same-version","already-current",(p,d)=>d.current=async()=>({version:"1.28.1",digest:h("c")})],
 ["same-version-conflict","immutable-conflict",(p,d)=>d.current=async()=>({version:"1.28.1",digest:h("d")})],
 ["missing-predecessor","unrecognized-base",(p,d)=>d.current=async()=>({version:"1.27.0",digest:h("a")})],
 ["base-digest-conflict","unrecognized-base",(p,d)=>d.current=async()=>({version:"1.28.0",digest:h("d")})],
 ["quota","quota",(p,d)=>d.outcome="QUOTA"],["concurrent-update","concurrent-change",(p,d)=>d.outcome="CONFLICT"],
 ["unknown-write","commit-not-confirmed",(p,d)=>d.outcome="UNKNOWN"]
 ];
 const results=[];
 for(const [name,expected,mutate] of tests){
  const p={...good};let calls=0,stored=false;const deps={maxBytes:1000,outcome:"ADDED",authorize:async()=>({...good}),current:async()=>({version:"1.28.0",digest:h("a")}),download:async()=>new Uint8Array([1,2,3]),rawDigest:async()=>h("b"),decode:async()=>({schema_version:"1.28.1"}),validateAndMap:async()=>true,canonicalDigest:async()=>h("c"),verifyCompatibility:async()=>true,compareAndAdd:async()=>{calls++;if(deps.outcome==="ADDED")stored=true;return deps.outcome}};
  mutate(p,deps);const observed=await gate(p,deps);const actual=observed.reason??observed.status;const expectedCalls=["approved","quota","concurrent-update","unknown-write"].includes(name)?1:0;
  results.push({name,expected,actual,commitCalls:calls,stored,pass:actual===expected&&calls===expectedCalls&&stored===(name==="approved")});
 }
 return results;
}

runCases().then(rows=>{console.log(JSON.stringify({gate:'RESEARCH_CONTENT_LOADER_CONTRACT',pass:rows.filter(r=>r.pass).length,total:rows.length,rows,runtime:'NOT_TESTED',deployment:'NOT_AUTHORIZED'},null,2));if(!rows.every(r=>r.pass))process.exitCode=1;}).catch(e=>{console.error(e);process.exitCode=1;});
