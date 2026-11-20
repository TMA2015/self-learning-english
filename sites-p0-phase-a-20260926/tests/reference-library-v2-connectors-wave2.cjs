'use strict';
/** SLE Reference v2 — NotebookLM-approved Writing Connectors Wave 2.
 * Verifies exact source-to-JSON parity, all 30 new IDs, legacy preservation.
 * No network, no learner data, no release action.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const packet=read('notebooklm/SLE_REFERENCE_LIBRARY_V2_WRITING_CONNECTORS_W2_R1_20261120.md');
const w2=JSON.parse(read('content/reference-library-v2-writing-connectors-wave2-reviewed.json'));
const w1=JSON.parse(read('content/reference-library-v2-wave1-reviewed.json'));
const pilot=JSON.parse(read('content/reference-library-pilot-v1.json'));
const ui=read('app/reference-library.tsx');
assert(packet.includes('SLE-REF-V2-CONNECTORS-W2-R1-20261120'),'source packet ID');
assert.equal(w2.review_status,'NOTEBOOKLM_PASS_30_OF_30');
assert.equal(w2.review_standard,'SLE-MASTER-001 v1.2.1');
assert.equal(w2.runtime_state,'DRAFT_NOT_LIVE');
assert.equal(w2.entries.length,30);
const old=w1.entries.filter(e=>e.kind==='writing_connectors');
assert.equal(old.length,12);
assert.equal(pilot.entries.length,26,'immutable pilot count');
const all=[...old,...w2.entries];
assert.equal(new Set(all.map(e=>e.id)).size,42);
assert.equal(new Set(all.map(e=>e.term.toLowerCase())).size,42,'no connector duplicates');
assert.equal(old.find(e=>e.term==='in addition')?.id,'REF2-LNK-009');
for(let i=0;i<w2.entries.length;i++){
 const e=w2.entries[i];
 assert.equal(e.id,'REF2-LNK-'+String(i+13).padStart(3,'0'),'stable ID sequence');
 assert.equal(e.kind,'writing_connectors');
 assert.equal(e.skill,'writing');
 assert(['A1','A2','B1','B2'].includes(e.level),e.id+': level');
 assert(['neutral','informal','formal','neutral to formal'].includes(e.register),e.id+': register');
 const begin='### '+e.id+' — '+e.term;
 const start=packet.indexOf(begin);
 assert(start>=0,e.id+': missing in Markdown packet');
 const next=packet.indexOf('\n### REF2-LNK-',start+begin.length);
 const end=next<0?packet.indexOf('\n## 3.',start):next;
 assert(end>start,e.id+': missing source end');
 const section=packet.slice(start,end);
 const f={}; for(const match of section.matchAll(/^- \*\*([^*]+):\*\* (.+)$/gm))f[match[1]]=match[2];
 const fields={
  'Kind':e.kind,'Suggested level':e.level,'Register':e.register,
  'Function':e.function,'Grammatical type':e.grammatical_type,
  'Construction / punctuation pattern':e.construction,
  'Meaning':e.meaning,'Original example':e.example,
  'Usage guidance':e.note,'Avoid / compare':e.common_error
 };
 for(const [field,value] of Object.entries(fields)){
  assert.equal(f[field],value,e.id+': source-to-JSON mismatch: '+field);
 }
 assert(!('score' in e)&&!('answer' in e)&&!('learner_id' in e));
}
assert.equal(w2.entries[0].term,'furthermore');
assert.equal(w2.entries[1].term,'moreover');
assert(w2.entries.some(e=>e.term==='nevertheless'));
assert(w2.entries.some(e=>e.term==='consequently'));
assert(ui.includes("import connectorWaveTwo from '../content/reference-library-v2-writing-connectors-wave2-reviewed.json'"),'UI uses reviewed Wave2 only');
assert(ui.includes('...connectorWaveTwo.entries'),'UI integrates approved candidates');
assert(!/\blocalStorage\.setItem\s*\(|\bindexedDB\.open\s*\(/.test(ui),'read-only UI');
console.log(JSON.stringify({result:'PASS',gate:'reference-v2-connectors-wave2',
 sourceParity:'30/30',wave2Approved:30,originalApproved:12,combinedConnectors:42,
 idCollisions:0,termCollisions:0,noLearnerWrites:true,productionDeploy:false}));
