// Focused Batch A checks only. Does not run the assessment simulation suite.
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','application/academic-service.ts','--outDir','.sites-runtime/pronunciation-runtime-tests','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});fs.writeFileSync('.sites-runtime/pronunciation-runtime-tests/package.json','{"type":"commonjs"}');
const {academicService}=require('../.sites-runtime/pronunciation-runtime-tests/application/academic-service.js');const {validateSeed,mapSeed}=require('../.sites-runtime/pronunciation-runtime-tests/domain/academic.js');const seed=require('../content/academic-seed-v1.json');
class Store{p=[];a=new Map();e=new Map();states=new Map();async packages(){return structuredClone(this.p)}async addPackage(v){const old=this.p.find(x=>x.version===v.version);if(old){assert.equal(old.digest,v.digest);return}this.p.push(structuredClone(v))}async attempts(o){return structuredClone(this.a.get(o)??[])}async start(o,v){const a=this.a.get(o)??[];if(!a.some(x=>x.id===v.id))a.push(structuredClone(v));this.a.set(o,a)}async saveDraft(o,id,p){const a=this.a.get(o).find(x=>x.id===id);if(a.status==='started')Object.assign(a,structuredClone(p))}async finish(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='started'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}async approve(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='pending_review'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}async readState(s){return this.states.get(s.ownerId)??null}async readEvidence(s){return this.e.get(s.ownerId)??[]}async appendEvidence(s,v){const a=this.e.get(s.ownerId)??[];for(const e of v)if(!a.some(x=>x.id===e.id))a.push(e);this.e.set(s.ownerId,a)}async readAssessments(){return []}async legacyImported(){return true}async markLegacyImported(){}async appendSnapshot(){} }
(async()=>{
 const db=new Store(),s=academicService(db,db,'local-fixture'),pkg=require('../content/curriculum-1.15.0-candidate.json'),manifest=require('../content/pronunciation-audio.json');
 const p=await s.preview(pkg);assert.deepEqual(p.errors,[]);await s.importPackage(pkg,p.token,true);
 for(const id of ['PRO-A2-01','PRO-A2-02','PRO-A2-03','PRO-B1-01','PRO-B1-02']){
  const before=JSON.stringify(db);const v=await s.lesson(id);assert.equal(JSON.stringify(db),before);
  assert.deepEqual(v.pronunciationAudio,{url:manifest[id].url,duration:manifest[id].duration});assert.equal(v.audio,null);
  assert(fs.existsSync('public'+v.pronunciationAudio.url));assert(v.lesson.activities.every(q=>!q.answer&&!q.feedback));
  const a=await s.start(id,'fixture-'+id);const snapshot=JSON.stringify(db);
  await s.lesson(id,a.version);await assert.rejects(()=>s.play(a.id),/No audio available/);assert.equal(JSON.stringify(db),snapshot);
  assert.equal((await db.attempts('local-fixture')).find(x=>x.id===a.id).playbackCompleted,undefined);
  const l=pkg.lessons.find(l=>l.id===id);await s.draft(a.id,Object.fromEntries(l.activities.map(q=>[q.id,q.type==='extended_response'?'My own planning note':q.answer.correct_option_id??q.answer.accepted_answers[0]])));
  const result=await s.submit(a.id);assert.equal(result.status,'pending_review');assert.equal(result.evidence.length,0);
  for(const q of l.activities.filter(q=>q.type==='extended_response'))assert.equal(q.evidence_weight,0);
 }
 const pro=db.p[0].source.lessons.find(l=>l.id==='PRO-A2-03');pro.module='speaking';assert.equal((await s.lesson(pro.id)).pronunciationAudio,null);pro.module='pronunciation';pro.audio_model.text[0]+=' mismatch';assert.equal((await s.lesson(pro.id)).pronunciationAudio,null);
 pro.id='PRO-UNKNOWN';assert.equal((await s.lesson(pro.id)).pronunciationAudio,null);
 const lis=await s.lesson('LIS-A2-01');const lm=require('../content/foundation-audio.json')['LIS-A2-01'];assert.deepEqual(lis.audio,{url:lm.url,duration:lm.duration});assert.equal(lis.pronunciationAudio,null);
 const a=await s.start('LIS-A2-01','listening-fixture');await assert.rejects(()=>s.submit(a.id));const token=await s.play(a.id);await assert.rejects(()=>s.play(a.id,token.token));await assert.rejects(()=>s.transcript(a.id));
 const ui=fs.readFileSync('app/foundation.tsx','utf8');const block=ui.split('aria-label="Pronunciation model audio"')[1].split('</section>')[0];assert(block.includes('controls'));assert(block.includes('src={pronunciationAudio.url}'));assert(!/onPlay|onEnded|playToken|playbackCompleted|api\(/.test(block));assert(block.includes('No real audio model is available'));assert(block.includes('no automatic pronunciation score'));assert(!ui.includes('Audio word models are not included in this preview'));
 console.log('PASS: pronunciation resolution/parity, safe fallback, no evidence or playback mutation, unchanged Listening token gates, UI controls without scoring callbacks.');
})().catch(e=>{console.error(e);process.exitCode=1});
