'use strict';
/** Exact source-level preflight for the four human-reviewed REA/LIS pilot lessons.
 * Academic review of new teaching text is separate and still required. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const baseline=require('../content/curriculum-1.18.1-candidate.json');
const current=require('../content/curriculum-1.20.0-candidate.json');
const ids=['REA-A2-01','REA-B1-01','LIS-A2-01','LIS-B1-01'];
let count=0;
for(const id of ids){
 const old=baseline.lessons.find(l=>l.id===id);
 const next=current.lessons.find(l=>l.id===id);
 assert(old&&next,'Original lesson missing: '+id);
 assert.deepEqual(next,old,'Approved 1.20.0 differs from old 1.18.1 for '+id+
  '; reconcile source first; do NOT silently overwrite an old scored lesson');
 assert(Array.isArray(next.activities)&&next.activities.length>=5);
 count+=next.activities.length;
 if(id.startsWith('LIS-')){
  assert(next.audio_asset?.source_text,'Listening source script must be present');
  assert(next.audio_asset?.requires_real_playback,'Text-only hearing must never be scored');
 }
}
assert.equal(count,26,'Original 26 scored questions changed without review');
const packet=fs.readFileSync(path.join(__dirname,
 '../content/review-packets/SLE_REA_LIS_CORE2_PILOT_NOTEBOOKLM_20261106.md'),'utf8');
assert(packet.includes('SLE-MASTER-001 **v1.2.0**'));
assert(packet.includes('CONTENT_IMPORT_READY = NO'));
for(const id of ids)assert(packet.includes(id),'Academic packet missing '+id);
console.log(JSON.stringify({result:'PASS',gate:'reading-listening-source-immutability',
 pilotLessons:4,unchangedScoredItems:26,academicReview:'PENDING',studentDataTouched:false}));
