const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../content');
const course=JSON.parse(fs.readFileSync(path.join(root,'curriculum-1.2.0-candidate.json'),'utf8'));
const map=JSON.parse(fs.readFileSync(path.join(root,'curriculum-coverage-v1.json'),'utf8'));
assert.equal(map.content_candidate_version,course.schema_version);
assert.equal(map.rules.dependencies_are_advisory_not_enforced_in_live_player,true);
assert.equal(map.rules.do_not_infer_proficiency_from_node_completion,true);
const lessonById=new Map(course.lessons.map(x=>[x.id,x]));
const graph=new Map(map.nodes.map(x=>[x.lesson_id,x]));
assert.equal(graph.size,course.lessons.length,'Every lesson needs a unique map entry');
assert.equal(map.nodes.length,course.lessons.length,'Duplicate curriculum map entries');
const allowed=new Set(['batch01','batch02','demo-upgraded','seed-demo']);
for(const node of map.nodes){
 const l=lessonById.get(node.lesson_id);
 assert(l,'Missing lesson '+node.lesson_id);
 assert(allowed.has(node.origin),'Unknown origin '+node.lesson_id);
 assert(node.concepts.length>0,'No concepts '+node.lesson_id);
 assert.equal(new Set(node.prerequisite_lesson_ids).size,node.prerequisite_lesson_ids.length,'Duplicate prerequisites '+node.lesson_id);
 for(const p of node.prerequisite_lesson_ids){
  assert(lessonById.has(p),'Unknown prerequisite '+p+' of '+node.lesson_id);
  assert.notEqual(p,node.lesson_id,'Self-dependency '+p);
 }
}
const visited=new Set(),active=new Set();
function dfs(id){
 assert(!active.has(id),'Prerequisite cycle at '+id);
 if(visited.has(id))return;
 active.add(id);
 for(const p of graph.get(id).prerequisite_lesson_ids)dfs(p);
 active.delete(id);visited.add(id);
}
for(const id of lessonById.keys())dfs(id);
const expectedOrigins={batch01:8,batch02:8,'demo-upgraded':1,'seed-demo':12};
for(const [key,n] of Object.entries(expectedOrigins))assert.equal(map.nodes.filter(x=>x.origin===key).length,n,key);
const gapIds=new Set();
for(const gap of map.known_gaps){
 assert(!lessonById.has(gap.id),'A planned gap has been published in the candidate '+gap.id);
 assert(!gapIds.has(gap.id),'Duplicate gap '+gap.id);
 gapIds.add(gap.id);
 assert(gap.name&&gap.reason&&gap.precedes.length,'Incomplete gap '+gap.id);
 for(const dependent of gap.precedes)assert(lessonById.has(dependent),'Missing dependent '+dependent);
}
console.log(JSON.stringify({result:'PASS',mappedLessons:graph.size,prerequisiteGraph:'acyclic',knownGaps:gapIds.size,authoringOnly:true}));
