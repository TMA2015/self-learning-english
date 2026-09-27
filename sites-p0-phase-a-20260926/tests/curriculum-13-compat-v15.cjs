'use strict';
// Controlled code-only preflight for the EXISTING v15 Site. This does not import 1.3.0.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'content/lesson-groups-v1.json'),'utf8'));
const previous=JSON.parse(fs.readFileSync(path.join(root,'content/releases/curriculum-1.2.0-production-import.json'),'utf8'));
const academic=fs.readFileSync(path.join(root,'domain/academic.ts'),'utf8');
const groups=catalog.groups;
assert.equal(catalog.taxonomy_version,'1.1.0');
assert.equal(catalog.source_content_version,'1.3.0');
assert.equal(previous.schema_version,'1.2.0');
assert.equal(previous.lessons.length,29);
assert.equal(previous.lessons.flatMap(l=>l.activities).length,190);
const previousById=new Map(previous.lessons.map(l=>[l.id,l]));
const expectedNew=['GRA-A1-07','GRA-A2-02','GRA-A2-03','GRA-A2-04','VOC-A2-02','REA-A1-03','WRI-A1-03'];
const batch04New=['GRA-A1-08','GRA-A2-05','GRA-A2-06','VOC-A1-04','VOC-A2-03','REA-A1-04','REA-A2-04','WRI-A1-04','WRI-A2-03'];
const batch04Groups={'GRA-A1-08':'GRA-FOUND','GRA-A2-05':'GRA-TENSE','GRA-A2-06':'GRA-FOUND','VOC-A1-04':'VOC-DAILY','VOC-A2-03':'VOC-DAILY','REA-A1-04':'REA-NOTICES','REA-A2-04':'REA-MESSAGES','WRI-A1-04':'WRI-PARAGRAPHS','WRI-A2-03':'WRI-MESSAGES'};
const batch03Groups={'GRA-A1-07':'GRA-FOUND','GRA-A2-02':'GRA-TENSE','GRA-A2-03':'GRA-FOUND','GRA-A2-04':'GRA-COMPARISON','VOC-A2-02':'VOC-TRAVEL','REA-A1-03':'REA-MESSAGES','WRI-A1-03':'WRI-PARAGRAPHS'};
const assigned=new Map();
for(const [module,rows] of Object.entries(groups)){
 assert.ok(rows.every(x=>x.title.en&&x.title.vi),'bilingual group title: '+module);
 for(const row of rows)for(const id of row.lesson_ids){
  assert.ok(!assigned.has(id),'duplicate group membership: '+id);
  assert.equal(id.slice(0,3),({grammar:'GRA',vocabulary:'VOC',reading:'REA',writing:'WRI',listening:'LIS',speaking:'SPE',pronunciation:'PRO'})[module],id+' unexpected skill group');
  assigned.set(id,{module,group:row.id});
 }
}
assert.equal(assigned.size,45,'29 legacy + 7 Batch03 + 9 Batch04 future lessons');
assert.deepEqual([...assigned.keys()].filter(id=>!previousById.has(id)).sort(),[...expectedNew,...batch04New].sort());
const originalGroup=new Map([
 ['GRA-A1-01','GRA-FOUND'],['GRA-A1-02','GRA-FOUND'],['GRA-A1-04','GRA-FOUND'],['GRA-A1-05','GRA-FOUND'],
 ['GRA-A1-03','GRA-TENSE'],['GRA-A2-01','GRA-TENSE'],['GRA-B1-01','GRA-TENSE'],['GRA-A1-06','GRA-PLACE'],
 ['VOC-A1-01','VOC-SCHOOL-TOWN'],['VOC-A1-03','VOC-SCHOOL-TOWN'],['VOC-A1-02','VOC-DAILY'],['VOC-A2-01','VOC-DAILY'],['VOC-B1-01','VOC-THEMES'],
 ['REA-A1-01','REA-NOTICES'],['REA-A1-02','REA-NOTICES'],['REA-A2-02','REA-NOTICES'],['REA-A2-01','REA-INFO'],['REA-A2-03','REA-INFO'],['REA-B1-01','REA-ARGUMENT'],
 ['WRI-A1-02','WRI-MESSAGES'],['WRI-A2-01','WRI-MESSAGES'],['WRI-A2-02','WRI-MESSAGES'],['WRI-A1-01','WRI-PARAGRAPHS'],['WRI-B1-01','WRI-PARAGRAPHS'],
 ['LIS-A2-01','LIS-DIALOGUE'],['LIS-B1-01','LIS-DISCUSSION'],
 ['SPE-A2-01','SPE-EVERYDAY'],['SPE-B1-01','SPE-OPINION'],
 ['PRO-A2-01','PRO-VOWEL']
]);
assert.equal(originalGroup.size,29);
for(const id of previousById.keys())assert.equal(assigned.get(id)?.group,originalGroup.get(id),'old grouping changed '+id);
for(const [id,group] of Object.entries(batch03Groups))assert.equal(assigned.get(id)?.group,group,'1.3 group changed '+id);
for(const [id,group] of Object.entries(batch04Groups))assert.equal(assigned.get(id)?.group,group,'Batch04 group incorrect '+id);
const targetTagMappings={
 'grammar.modals_can':'modals-can','grammar.countability':'countability','grammar.quantifiers':'quantifiers','grammar.comparison':'comparison'
};
for(const [tag,slug] of Object.entries(targetTagMappings)){
 const entry="'"+tag+"':'"+slug+"'";
 assert.ok(academic.includes(entry),'missing runtime tag mapping '+entry);
 assert.equal(academic.split("'"+tag+"'").length-1,1,'duplicate runtime tag '+tag);
}
for(const id of expectedNew)assert.ok(assigned.has(id));
assert.ok(assigned.get('GRA-A2-04').group==='GRA-COMPARISON');
assert.ok(assigned.get('REA-A1-03').group==='REA-MESSAGES');
assert.ok(assigned.get('WRI-A1-03').group==='WRI-PARAGRAPHS');
assert.equal(catalog.organization_policy.skill_is_primary_nav,true);
assert.equal(catalog.organization_policy.course_sequence_is_independent_recommended_route,true);
console.log('PASS: Batch03 compatibility retained, 45 catalog IDs grouped without changes to 36 prior memberships; code-only preflight, not import or browser QA.');
