'use strict';
/** Byte-level original-authoring provenance + 24 MCQ / 96 rationale exact editorial parity. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const sourceName='SLE_FOUNDATION_WRITING_AUTHORING_WAVE4_U10-U12_DRAFT_20261118.md';
const original=fs.readFileSync(path.join(root,'docs/foundation-writing',sourceName));
const actual=crypto.createHash('sha256').update(original).digest('hex');
const expected='cca51171781dc535c6a4080107b0204561b850cfcaf33e089fce2eb184468083';
assert.equal(original.length,68935,'Exact NotebookLM-reviewed authoring bytes');
assert.equal(actual,expected,'Do not retype, trim or rewrite the immutable original');
const markdown=original.toString('utf8'),lines=markdown.split('\n');
const data=require('../content/foundation-writing-wave4-reviewed.json');
const norm=s=>String(s||'').replace(/\*\*/g,'').replace(/\x60/g,'')
 .replace(/(^|\n)> ?/g,'$1').replace(/\*(\S.*?)\*/g,'$1').trim();
const parsed={};
for(let i=0;i<lines.length;i++){
 const a=lines[i].match(/^\*\*\x60(FW-U1[012]-A-[A-Z]+)\x60\*\*\s*—\s*(.*)$/);
 const b=lines[i].match(/^### \x60(FW-U1[012]-F\d{2})\x60/);
 if(!a&&!b)continue;
 const id=(a||b)[1],stem=b?lines.slice(i+1,i+8).find(x=>x.startsWith('**Stem:**'))?.slice(9).trim():a[2];
 assert(stem,'Source question must have a real learner-facing stem: '+id);
 const options=[];
 for(let j=i+1;j<Math.min(i+27,lines.length);j++){
  const c=lines[j].split('|').slice(1,-1).map(x=>x.trim());
  if(c.length===4&&/^[ABCD]$/.test(c[0]))options.push({id:c[0],text:norm(c[1]),rationale:norm(c[3]),key:c[2].includes('KEY')});
  if(options.length===4)break;
 }
 assert.equal(options.length,4,id+': full original A–D set');
 assert.equal(options.filter(o=>o.key).length,1,id+': unique original key');
 assert(!parsed[id],id+': repeated ID');parsed[id]={stem:norm(stem),options,key:options.find(o=>o.key).id};
}
assert.equal(Object.keys(parsed).length,24,'24 original fixed+supplemental questions');
assert.equal(data.length,3,'Three reviewed Wave4 units');
let items=0,rationales=0;
for(const unit of data){
 assert(['FW-U10','FW-U11','FW-U12'].includes(unit.id),'Only original unit IDs');
 assert.equal(unit.source.document,sourceName);
 assert.equal(unit.source.sha256,expected);
 assert.equal(unit.source.notebooklm,'SLE-FW-AUTH-W4-NBLM-R1-20261118');
 assert.equal(unit.source.verdict,'PASS');
 assert.equal(unit.teaching.demo.id,unit.id+'-D01');
 assert(unit.teaching.demo.steps.length>=5);
 const local=[...unit.cycleA.items,...unit.extras];
 assert.equal(local.length,8);
 for(const item of local){
  items++;const reference=parsed[item.id];assert(reference,'Missing authored original '+item.id);
  assert.equal(item.stem,reference.stem,item.id+': exact learner-facing question stem');
  assert.equal(item.key,reference.key,item.id+': NotebookLM-reviewed key');
  assert.equal(item.options.length,4);
  for(let i=0;i<4;i++){
   const out=item.options[i],ref=reference.options[i];
   assert.equal(out.id,ref.id,item.id+': option stable ID');
   assert.equal(out.text,ref.text,item.id+': exact reviewed option');
   assert.equal(out.rationale,ref.rationale,item.id+': original rationale not condensed');
   rationales++;
  }
 }
 assert(markdown.includes(unit.title),'Unit title from frozen original');
 assert(unit.cycleB.prompt.length>250,'Learner-owned cycle B instructions substantive');
 assert(unit.transfer.prompt.length>175,'Independent transfer source instructions substantive');
}
assert.equal(items,24);assert.equal(rationales,96);
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_EXACT_SOURCE_CONTENT_PARITY',
 source:sourceName,bytes:original.length,sha256:actual,units:3,objectiveItems:items,exactOriginalOptionsAndRationales:rationales,
 teachingDemos:3,productionWrites:0,realProviderCalls:0,releaseDecision:'REQUIRES_UI_AND_STORAGE_QA'}));
