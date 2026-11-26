'use strict';
// EXPERIMENTAL: offline scope proof only. Not registered in release policy or runtime.
function canonical(v){return Array.isArray(v)?v.map(canonical):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v}
function same(a,b){return JSON.stringify(canonical(a))===JSON.stringify(canonical(b))}
function verify(base,next,patch,manifest,trust){
 const reject=reason=>({ok:false,reason});
 const expectedKeys=["schema","scope","baseVersion","contentVersion","baseStatus","contentStatus","baseGitBlob","contentGitBlob","patchGitBlob","receiptGitBlob","reviewCommit","reviewBlob","lessons","activities","changes"].sort();
 if(!manifest||!same(Object.keys(manifest).sort(),expectedKeys)||!same(manifest,trust))return reject("untrusted-manifest");
 if(manifest.schema!==1||manifest.scope!=="reading-wording-only")return reject("scope");
 const parts=v=>typeof v==="string"&&/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v)?v.split(".").map(Number):null;
 const x=parts(base.schema_version),y=parts(next.schema_version);
 if(!x||!y||![...x,...y].every(Number.isSafeInteger)||x[0]!==y[0]||x[1]!==y[1]||y[2]!==x[2]+1||base.schema_version!==manifest.baseVersion||next.schema_version!==manifest.contentVersion)return reject("version");
 if(base.status!==manifest.baseStatus||next.status!==manifest.contentStatus)return reject("status");
 if(patch.status!=="ACADEMIC_PASS_TECHNICAL_QA_PENDING"||patch.review_commit!==manifest.reviewCommit||patch.review_blob!==manifest.reviewBlob||patch.base_git_blob!==manifest.baseGitBlob||patch.base_version!==manifest.baseVersion||patch.proposed_version!==manifest.contentVersion||!same(patch.metadata_changes,["schema_version","status"]))return reject("review");
 if(!Array.isArray(base.lessons)||!Array.isArray(next.lessons)||base.lessons.length!==manifest.lessons||next.lessons.length!==manifest.lessons||!Array.isArray(patch.changes)||patch.changes.length!==manifest.changes||!patch.changes.length)return reject("count");
 if([base,next].some(s=>s.lessons.some(l=>!Array.isArray(l.activities))||s.lessons.reduce((n,l)=>n+l.activities.length,0)!==manifest.activities||new Set(s.lessons.map(l=>l.id)).size!==s.lessons.length||new Set(s.lessons.flatMap(l=>l.activities.map(q=>q.id))).size!==manifest.activities))return reject("identity");
 const reversed=JSON.parse(JSON.stringify(next)),seen=new Set(),changed=new Set();
 for(const ch of patch.changes){
  if(!ch||!["prompt","feedback.explanation_en"].includes(ch.field)||typeof ch.before!=="string"||typeof ch.after!=="string"||!ch.after.trim()||ch.before===ch.after)return reject("field");
  const key=[ch.lesson_id,ch.item_id,ch.field].join(":");if(seen.has(key))return reject("duplicate");seen.add(key);
  const old=base.lessons.find(l=>l.id===ch.lesson_id),cur=reversed.lessons.find(l=>l.id===ch.lesson_id);
  if(!old||!cur||old.module!=="reading"||cur.module!=="reading")return reject("lesson");
  const before=old.activities.find(q=>q.id===ch.item_id),after=cur.activities.find(q=>q.id===ch.item_id);
  if(!before||!after||before.type!=="single_choice"||after.type!==before.type||before.answer?.correct_option_id!==ch.key||!same(before.answer,after.answer))return reject("answer");
  const read=q=>ch.field==="prompt"?q.prompt:q.feedback?.explanation_en;
  if(read(before)!==ch.before||read(after)!==ch.after)return reject("wording");
  if(ch.field==="prompt")after.prompt=ch.before;else after.feedback.explanation_en=ch.before;
  changed.add(ch.lesson_id);
 }
 reversed.schema_version=base.schema_version;reversed.status=base.status;
 if(!same(reversed,base))return reject("out-of-scope");
 return {ok:true,changedLessons:[...changed].sort(),changes:seen.size,lessonCount:manifest.lessons,activityCount:manifest.activities};
}
function cases(base,next,patch,manifest){
 const clone=x=>JSON.parse(JSON.stringify(x)),q=s=>s.lessons.find(l=>l.id==="REA-B2-05").activities[0];
 const tests=[["approved",true,()=>{}],["answer",false,n=>q(n).answer.correct_option_id="A"],["choice",false,n=>q(n).options[0].text="changed"],["wording",false,n=>q(n).prompt+="!" ],["item-id",false,n=>q(n).id+="X"],["evidence",false,n=>q(n).evidence_weight=99],["order",false,n=>n.lessons.reverse()],["added",false,n=>n.lessons.push(clone(n.lessons[0]))],["rubric",false,n=>n.rubrics.extra={}],["package",false,n=>n.package_id+="X"],["version",false,n=>n.schema_version="1.28.2"],["media",false,n=>n.lessons.find(l=>l.module==="listening").audio_asset.source_text+="!"],["unknown",false,n=>n.extra=true],["status",false,n=>n.status="approved"],["manifest",false,(n,p,m)=>m.contentGitBlob="0".repeat(40)],["receipt",false,(n,p,m)=>m.receiptGitBlob="0".repeat(40)],["patch-duplicate",false,(n,p)=>p.changes[1]=clone(p.changes[0])],["patch-review",false,(n,p)=>p.review_commit="0".repeat(40)],["patch-field",false,(n,p)=>p.changes[0].field="answer"],["manifest-extra",false,(n,p,m)=>m.extra=true]];
 return tests.map(([name,expected,mutate])=>{const n=clone(next),p=clone(patch),m=clone(manifest);mutate(n,p,m);const result=verify(base,n,p,m,manifest);return {name,expected,observed:result.ok,reason:result.reason??"accepted",pass:result.ok===expected}});
}
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const trust={
  "schema": 1,
  "scope": "reading-wording-only",
  "baseVersion": "1.28.0",
  "contentVersion": "1.28.1",
  "baseStatus": "notebooklm_b2_62of62_pass_technical_QA_PENDING_NO_LIVE_RELEASE",
  "contentStatus": "reading_baseline_wording_notebooklm_pass_technical_QA_PENDING_NO_LIVE_RELEASE",
  "baseGitBlob": "9d931a6930b8cd3ed918db1fa22e8708b7a9f884",
  "contentGitBlob": "ef69d4a9d4ed13fb3de7702ce6600e062c1039f2",
  "patchGitBlob": "ab8c7d187164a2576ffcebb54506dc221d0eb249",
  "receiptGitBlob": "819f1e2f2ada34097bfd40165f15641696d12d95",
  "reviewCommit": "c950924631c99e734ade8102c11080e337f38137",
  "reviewBlob": "595c72ba7ad0cc79026dd7c3abd77b293cbbac6c",
  "lessons": 176,
  "activities": 1224,
  "changes": 10
};
const load=(file,expected)=>{const b=fs.readFileSync(path.join(root,file));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),expected,'Untrusted immutable Git blob: '+file);return b};
const baseBytes=load('content/curriculum-1.28.0-candidate.json',trust.baseGitBlob),nextBytes=load('content/curriculum-1.28.1-candidate.json',trust.contentGitBlob),patchBytes=load('content/review-packets/SLE_REA_BASELINE_WORDING_PATCH_20261126.json',trust.patchGitBlob);
load('content/review-packets/SLE_REA_BASELINE_WORDING_PASS_RECEIPT_20261126.md',trust.receiptGitBlob);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'research/content-release-manifest-prototype.json'),'utf8'));
const base=JSON.parse(baseBytes),next=JSON.parse(nextBytes),patch=JSON.parse(patchBytes);
const result=verify(base,next,patch,manifest,trust);assert.equal(result.ok,true,JSON.stringify(result));
const results=cases(base,next,patch,trust);assert(results.every(x=>x.pass),JSON.stringify(results));
console.log(JSON.stringify({gate:'EXPERIMENTAL_CONTENT_RELEASE_MANIFEST',result:'PASS',...result,cases:results,baseRawSha256:crypto.createHash('sha256').update(baseBytes).digest('hex'),contentRawSha256:crypto.createHash('sha256').update(nextBytes).digest('hex'),deployment:'NOT_AUTHORIZED',runtime:'NOT_TESTED'},null,2));
