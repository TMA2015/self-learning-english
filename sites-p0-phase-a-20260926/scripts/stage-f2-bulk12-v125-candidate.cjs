'use strict';
/**
 * F2 Bulk12 v1.25: source-integrity gated, DRY-RUN-ONLY academic composer.
 * Requires the exact approved Markdown + manually reconciled JSON.
 * SHA-256 proves source possession, NOT semantic parity of JSON to Markdown.
 * Never merges, imports, deploys or mutates learner data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const PACKET='SLE_BULK12_A1A2B1_NOTEBOOKLM_R1_20261109.md';
const PACKET_ID='SLE-F2-BULK12-A1A2B1-AUTHORED-20261109-R1';
const SHA256='5de3c0c2b7f85420a804f5c6201b07912776501584bb598e0446fd26301da5c9';
const expected=[
 ['A1-U03','REA-A1-08','reading','A1','CADBA'],
 ['A1-U03','WRI-A1-08','writing','A1',''],
 ['A1-U06','REA-A1-09','reading','A1','ACBDA'],
 ['A1-U06','WRI-A1-09','writing','A1',''],
 ['A2-U02','REA-A2-11','reading','A2','BCADBC'],
 ['A2-U02','WRI-A2-10','writing','A2',''],
 ['A2-U04','REA-A2-12','reading','A2','CADBAC'],
 ['A2-U04','WRI-A2-11','writing','A2',''],
 ['B1-U01','REA-B1-09','reading','B1','ACBDCA'],
 ['B1-U01','WRI-B1-10','writing','B1',''],
 ['B1-U05','REA-B1-10','reading','B1','BDACBD'],
 ['B1-U05','WRI-B1-11','writing','B1','']
];
const unitMap=Object.fromEntries([...new Set(expected.map(x=>x[0]))].map(u=>[u,expected.filter(x=>x[0]===u).map(x=>x[1])]));
const activityCount=p=>p.lessons.reduce((n,l)=>n+l.activities.length,0);
const sha256=x=>crypto.createHash('sha256').update(x).digest('hex');
function checkPacket(packetPath){
 assert(fs.existsSync(packetPath),'SOURCE_MISSING: original Markdown packet required: '+PACKET);
 const hash=sha256(fs.readFileSync(packetPath));
 assert.equal(hash,SHA256,'SOURCE_SHA_MISMATCH: cannot alter reviewed source bytes');
 return hash;
}
function validateAuthored(authored){
 assert(authored&&typeof authored==='object'&&!Array.isArray(authored),'Complete authored JSON required');
 assert.equal(authored.packet_id,PACKET_ID);
 assert.equal(authored.source_packet_sha256,SHA256,'JSON provenance must match exact Markdown');
 assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
 assert.equal(authored.academic_disposition,'GO_FOR_MACHINE_SCHEMA_DRAFT');
 assert.equal(authored.production,'NO_GO_PENDING_TECHNICAL_CI_AND_OWNER_RELEASE');
 assert.deepEqual(authored.unit_assignments,unitMap);
 assert.deepEqual(authored.lessons?.map(l=>l.id),expected.map(x=>x[1]));
 const seen=new Set();let objective=0,writing=0;
 for(let i=0;i<expected.length;i++){
  const [unit,id,mod,cefr,keys]=expected[i],l=authored.lessons[i];
  assert.equal(l.module,mod,id+': module mismatch');
  assert.equal(l.cefr_target,cefr);
  assert.equal(l.activities?.length,keys.length||1,id+': item count');
  assert(l.objectives?.length>=2&&l.explanation?.en?.length>250&&l.examples?.length>=2,id+': CORE learning support');
  for(const core of ['CORE-1','CORE-2','CORE-3','CORE-4'])assert(l.explanation.en.includes(core),id+': missing '+core);
  assert(!l.audio_asset,id+': no audio authorized in this reviewed batch');
  if(mod==='reading'){
   assert(l.reading_asset?.display_to_learner===true,id+': missing visible reading asset');
   assert(/SOURCE A/i.test(l.reading_asset.body)&&/SOURCE B/i.test(l.reading_asset.body),id+': missing source text');
  }
  const band=cefr==='A1'?[35,50]:cefr==='A2'?[70,95]:[120,160];
  for(let j=0;j<l.activities.length;j++){
   const q=l.activities[j],qid=id+'-Q'+(j+1);
   assert.equal(q.id,qid,'Canonical item mismatch');assert(!seen.has(q.id),qid+': duplicate');seen.add(q.id);
   assert(typeof q.prompt==='string'&&q.prompt.trim().length>10,qid+': prompt missing');
   assert(Array.isArray(q.skill_tags)&&q.skill_tags.length>0&&q.skill_tags.every(t=>t.startsWith(mod+'.')),qid+': tags');
   if(mod==='reading'){
    assert.equal(q.type,'single_choice');assert.deepEqual(q.options?.map(o=>o.id),['A','B','C','D']);
    assert(q.options.every(o=>typeof o.text==='string'&&o.text.trim()),qid+': missing full options');
    assert.equal(q.answer?.correct_option_id,keys[j],qid+': reviewer key mismatch');
    assert.equal(q.evidence_weight,1);
    assert(typeof q.feedback?.explanation_en==='string'&&q.feedback.explanation_en.includes('Next step:'),qid+': feedback');
    objective++;
   }else{
    assert.equal(q.type,'extended_response');assert.equal(q.answer,null);
    assert.equal(q.evidence_weight,0);assert.equal(q.review_mode,'assisted_ai_or_human');
    assert.equal(q.rubric_id,'RUBRIC-WRITING-'+cefr);
    assert.deepEqual(q.word_range_guidance,{min:band[0],max:band[1],not_a_quality_score:true});
    writing++;
   }
  }
 }
 assert.deepEqual([objective,writing,seen.size],[34,6,40]);
 return {objective,writing,activities:seen.size};
}
function compose(packetPath,authoredPath,baselinePath){
 checkPacket(packetPath);
 assert(fs.existsSync(authoredPath),'MACHINE_DRAFT_MISSING: full item-level JSON reconciliation required');
 const authored=JSON.parse(fs.readFileSync(authoredPath,'utf8'));
 const counts=validateAuthored(authored);
 const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
 assert.equal(baseline.schema_version,'1.24.0');
 assert.deepEqual([baseline.lessons.length,activityCount(baseline)],[142,1085]);
 const oldLessons=new Set(baseline.lessons.map(l=>l.id));
 const oldItems=new Set(baseline.lessons.flatMap(l=>l.activities.map(q=>q.id)));
 for(const l of authored.lessons){
  assert(!oldLessons.has(l.id),'LESSON_COLLISION: '+l.id);
  for(const q of l.activities)assert(!oldItems.has(q.id),'ITEM_COLLISION: '+q.id);
 }
 const next=structuredClone(baseline);
 next.schema_version='1.25.0';next.status='notebooklm_bulk12_pass_qa_pending_NO_LIVE_RELEASE';
 next.lessons.push(...structuredClone(authored.lessons));
 next.course.sequence.push(...authored.lessons.map(l=>l.id));
 assert.deepEqual([next.lessons.length,activityCount(next)],[154,1125]);
 assert.deepEqual(next.lessons.slice(0,142),baseline.lessons);
 assert.deepEqual(next.course.sequence.slice(0,142),baseline.course.sequence);
 assert.deepEqual(next.rubrics,baseline.rubrics);
 for(const k of Object.keys(baseline).filter(k=>!['schema_version','status','lessons','course'].includes(k)))
  assert.deepEqual(next[k],baseline[k],'Immutable root field: '+k);
 for(const k of Object.keys(baseline.course).filter(k=>k!=='sequence'))
  assert.deepEqual(next.course[k],baseline.course[k],'Immutable course field: '+k);
 assert(Buffer.byteLength(JSON.stringify(next))<=5_000_000,'Existing UI 5 MB package limit exceeded');
 return {next,counts};
}
function main(args){
 const flag=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
 const packet=flag('--packet'),authored=flag('--authored');
 if(!packet||!authored){console.error('SOURCE_REQUIRED: --packet ORIGINAL.md --authored RECONCILED.json');process.exitCode=2;return}
 const {next,counts}=compose(path.resolve(packet),path.resolve(authored),
  path.join(root,'content/curriculum-1.24.0-candidate.json'));
 // Only an ignored local output, never content/, production, Firebase, or learner storage.
 const output=path.join(root,'.sites-runtime/f2-bulk12-v125/curriculum-v1.25.0-DRY-RUN-NO-IMPORT.json');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(next,null,2)+'\n');
 console.log(JSON.stringify({result:'DRY_RUN_ONLY',sourceHashVerified:true,
  semanticParity:'MANUAL_SOURCE_RECONCILIATION_STILL_REQUIRED',schema:'RUNTIME_VALIDATION_PENDING',
  lessons:154,activities:1125,readingObjective:counts.objective,unscoredWriting:counts.writing,
  newMP3:0,productionImport:false,deploy:false,output:path.relative(root,output)}));
}
if(require.main===module){try{main(process.argv.slice(2))}catch(e){console.error('NO_CANDIDATE_WRITTEN:',e.message);process.exitCode=1}}
module.exports={PACKET,SHA256,PACKET_ID,expected,unitMap,checkPacket,validateAuthored,compose};
