'use strict';
/** Source-accurate parent-turn navigation, never a shortcut to verified timings. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const ids=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const turns=[9,7,6],fragments=[18,13,10];
const manifest=require('../content/foundation-audio.json');
const raw=cp.execFileSync(process.execPath,['scripts/build-listening-segment-audit.cjs',...ids],
 {cwd:root,encoding:'utf8',timeout:30000});
const generated=JSON.parse(raw);
assert.equal(generated.result,'PASS');
assert.equal(generated.productionEnabled,false);
assert.equal(generated.verifiedSegmentCount,0);
let total=0;
for(let k=0;k<ids.length;k++){
 const id=ids[k],html=fs.readFileSync(path.join(root,
  '.sites-runtime/listening-segment-audit',id+'-offline-audit.html'),'utf8');
 const match=html.match(/const auditData=(\{[\s\S]*?\});/);
 assert(match,id+' data not present');
 const data=JSON.parse(match[1]);
 assert.equal(data.lessonId,id);
 assert.equal(data.sha256,manifest[id].sha256);
 assert.equal(data.sourceTurnCount,turns[k]);
 assert.equal(data.lines.length,fragments[k]);
 assert.equal(data.turnMap.length,fragments[k]);
 assert.equal(data.turnMap.at(-1).turnIndex,turns[k]);
 assert.equal(data.turnMap[0].turnIndex,1);
 const sourceTurns=manifest[id].source.replace(/\r\n?/g,'\n')
  .split(/\n+/).map(x=>x.trim()).filter(Boolean);
 const grouped=new Map();
 for(let i=0;i<data.lines.length;i++){
  const m=data.turnMap[i];
  assert(Number.isInteger(m.turnIndex)&&m.turnIndex>0&&m.turnIndex<=turns[k]);
  assert.equal(m.turnLineId,'L'+m.turnIndex);
  assert(Number.isInteger(m.sentenceInTurn)&&m.sentenceInTurn>0);
  assert(Number.isInteger(m.turnSentenceCount)&&m.turnSentenceCount>=m.sentenceInTurn);
  if(!grouped.has(m.turnIndex))grouped.set(m.turnIndex,[]);
  grouped.get(m.turnIndex).push({text:data.lines[i],m});
 }
 assert.equal(grouped.size,turns[k]);
 for(let i=0;i<sourceTurns.length;i++){
  const subset=grouped.get(i+1);
  assert(subset.length>0);
  assert(subset.every((x,j)=>x.m.sentenceInTurn===j+1&&
   x.m.turnSentenceCount===subset.length));
  assert.equal(subset.map(x=>x.text).join(' '),sourceTurns[i],
   'No transcript or speaker label loss when flattening a parent turn: '+id);
 }
 assert(html.includes('Optional: import reviewed-later speaker-TURN suggestions'));
 assert(html.includes('value.reviewLevel!=="SPEAKER_TURN_ONLY"'));
 assert(html.includes('value.explicitlyNotSentenceAligned!==true'));
 assert(html.includes('value.assetSha256!==auditData.sha256'));
 assert(html.includes('value.lessonId!==auditData.lessonId'));
 assert(html.includes('value.segments.length!==maxTurn'));
 assert(html.includes('suggestedTurns=proposed; // NEVER copy into sentence rows'));
 assert(html.includes('replayLine=null; // no sentence replay can be marked checked'));
 assert(html.includes('I listened — confirm this exact sentence/turn'));
 assert(html.includes('rows[replayLine].replayCompleted=true'));
 assert(!html.includes('rows[replayLine].replayChecked=true'),
  'Audio stopping cannot silently confer manual QA PASS');
 assert(html.includes('row.replayChecked=true;update()'),
  'Manual confirmation required independently of audio event');
 assert(html.includes('row.replayCompleted=false')||
  html.includes('rows[selected].replayCompleted=false'));
 assert(html.includes('rows[i].replayChecked=false'));
 assert(html.includes('status:"CANDIDATE_UNVERIFIED",productionEnabled:false'));
 const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(script.length,1);
 assert.doesNotThrow(()=>new vm.Script(script[0][1],{filename:id+'-review.js'}));
 assert(!/\bfetch\(|XMLHttpRequest|sendBeacon|\/api\/foundation/.test(html));
 total+=data.lines.length;
}
assert.equal(total,41);
const oldTurnBuilder=fs.readFileSync(path.join(root,'scripts/build-listening-turn-audit.cjs'),'utf8');
assert(!oldTurnBuilder.includes('verifiedSegments='));
const learner=fs.readFileSync(path.join(root,'app/listening-dictation.tsx'),'utf8');
assert(learner.includes('disabled={!enabledSegments}'));
assert(!learner.includes('turnMap'));
const runner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
assert(runner.includes('listening-turn-to-sentence-audit.cjs'));
console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_TURN_TO_SENTENCE_OFFLINE_QA',
 lessons:ids,speakerTurns:22,sentenceFragments:41,
 sourceTextExact:true,suggestedTurnRangesCannotPopulateSentenceTimestamps:true,
 postReplayHumanConfirmationRequired:true,
 verifiedSegments:0,productionPlayerChanges:0,externalWrites:0}));
