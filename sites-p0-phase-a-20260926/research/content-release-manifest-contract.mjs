// #251 pre-publication verifier; independentEvidence MUST be derived by trusted owner-gated CI from exact reviewed Git sources, never from pointer or HTTP. This module does not establish that authority, perform cryptography, authorize future releases, or activate content.
function createManifest(evidence){
 const hex=(v,n)=>typeof v==='string'&&v.length===n&&/^[0-9a-f]+$/.test(v);
 const ver=v=>typeof v==='string'&&/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v)?v.split('.').map(Number):[];
 const count=n=>Number.isSafeInteger(n)&&n>0;
 if(!evidence||evidence.scope!=='reading-wording-only'||evidence.academicVerdict!=='PASS'||!hex(evidence.sourceCommit,40)||!hex(evidence.reviewCommit,40)||!hex(evidence.reviewBlob,40)||!hex(evidence.reviewReceiptSha256,64)||!hex(evidence.patchSha256,64)||typeof evidence.compatibilityId!=='string'||!/^[a-z0-9-]{1,80}$/.test(evidence.compatibilityId))throw Error('review-evidence');
 const {base,successor:s}=evidence;
 if(!base||!s||![base,s].every(p=>hex(p.gitBlob,40)&&hex(p.rawSha256,64)&&hex(p.canonicalSha256,64)&&count(p.byteLength)&&p.byteLength<=8000000&&count(p.lessons)&&p.lessons<=250&&count(p.activities)&&p.activities<=p.lessons*24))throw Error('package-evidence');
 const a=ver(base.version),b=ver(s.version);
 if(a.length!==3||b.length!==3||![...a,...b].every(Number.isSafeInteger)||a[0]!==b[0]||a[1]!==b[1]||b[2]-a[2]!==1||base.lessons!==s.lessons||base.activities!==s.activities||base.rawSha256===s.rawSha256||base.canonicalSha256===s.canonicalSha256)throw Error('wording-only-scope');
 return {schema:1,scope:evidence.scope,baseVersion:base.version,baseCanonicalSha256:base.canonicalSha256,version:s.version,rawSha256:s.rawSha256,canonicalSha256:s.canonicalSha256,byteLength:s.byteLength,path:'/content-releases/'+s.version+'/'+s.rawSha256+'.json',lessons:s.lessons,activities:s.activities,compatibilityId:evidence.compatibilityId,sourceCommit:evidence.sourceCommit,reviewCommit:evidence.reviewCommit,reviewBlob:evidence.reviewBlob,reviewReceiptSha256:evidence.reviewReceiptSha256,patchSha256:evidence.patchSha256};
}

function verifyManifest(pointer,independentEvidence){
 try{
  const expected=createManifest(independentEvidence);
  if(!pointer||typeof pointer!=='object'||Array.isArray(pointer)||Object.keys(pointer).length!==Object.keys(expected).length||!Object.keys(expected).every(k=>Object.hasOwn(pointer,k)&&pointer[k]===expected[k]))return {ok:false,reason:'manifest-mismatch'};
  return {ok:true,manifest:expected};
 }catch{return {ok:false,reason:'invalid-independent-evidence'};}
}

function runCases(evidence){
 const good=createManifest(evidence),clone=x=>JSON.parse(JSON.stringify(x)),h='0'.repeat(64);
 const tests=[
 ['exact independently supplied evidence',true,(p,e)=>{}],
 ['changed raw hash and matching path',false,p=>{p.rawSha256=h;p.path='/content-releases/'+p.version+'/'+h+'.json';}],
 ['canonical digest changed',false,p=>{p.canonicalSha256=h;}],
 ['base hash changed',false,p=>{p.baseCanonicalSha256=h;}],
 ['missing field',false,p=>{delete p.reviewReceiptSha256;}],
 ['extra claim',false,p=>{p.approved=true;}],
 ['external path',false,p=>{p.path='https://other.invalid/a.json';}],
 ['path traversal',false,p=>{p.path='/content-releases/../a.json';}],
 ['wrong compatibility',false,p=>{p.compatibilityId='unknown-runtime';}],
 ['wrong receipt',false,p=>{p.reviewReceiptSha256=h;}],
 ['wrong source commit',false,p=>{p.sourceCommit='0'.repeat(40);}],
 ['wrong count',false,p=>{p.lessons++;}],
 ['wrong length',false,p=>{p.byteLength++;}],
 ['absent independent approval',false,(p,e)=>{delete e.academicVerdict;}],
 ['required changes not PASS',false,(p,e)=>{e.academicVerdict='PASS_WITH_REQUIRED_CHANGES';}],
 ['version gap even with changed pointer',false,(p,e)=>{e.successor.version='1.28.3';p.version='1.28.3';p.path='/content-releases/1.28.3/'+p.rawSha256+'.json';}],
 ['added lesson even with changed pointer',false,(p,e)=>{e.successor.lessons++;p.lessons++;}],
 ['oversize evidence',false,(p,e)=>{e.successor.byteLength=8000001;p.byteLength=8000001;}],
 ['identical base and successor digest',false,(p,e)=>{e.successor.canonicalSha256=e.base.canonicalSha256;p.canonicalSha256=e.base.canonicalSha256;}],
 ['unsupported scope',false,(p,e)=>{p.scope=e.scope='append-only';}],
 ['unsafe numeric version',false,(p,e)=>{e.base.version='1.28.9007199254740992';e.successor.version='1.28.9007199254740993';}],
 ['missing trusted evidence',false,(p,e)=>{delete e.base;}]
 ];
 return tests.map(([name,want,change])=>{const p=clone(good),e=clone(evidence);change(p,e);const observed=verifyManifest(p,e).ok;return {name,expected:want,actual:observed,pass:observed===want};});
}

export {createManifest,verifyManifest,runCases};
