'use strict';
/** Issue #103 R0; public curriculum + synthetic attempts only. No browser data. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),crypto=require('node:crypto');
const {buildPublicInventory,stable,revisionFor,files}=
 require('../scripts/storage-r0-public-inventory.cjs');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const oldHashes=files.map(f=>sha(f.path));
const result=buildPublicInventory();
assert.equal(result.gate,'SLE_ISSUE103_R0_PUBLIC_SOURCE_INVENTORY');
assert.deepEqual(result.inputVersions,['1.23.0','1.24.0','1.25.0']);
assert.equal(result.activeLessonCount,154);
assert.equal(result.lessonCopiesByVersion.at(-1).count,154);
assert(result.lessonCopiesByVersion[0].count<result.lessonCopiesByVersion[1].count);
assert(result.lessonCopiesByVersion[1].count<result.activeLessonCount);
assert.equal(result.syntheticAttemptCount,73);
assert.equal(result.syntheticScored,52);
assert.equal(result.syntheticDrafts,21);
assert.equal(result.distinctProtectedVersionLessonPairs,15);
assert.equal(result.normalizedAliasCount,15);
assert(result.totalLessonCopies>result.distinctRevisionHashesAcrossAllReleases);
assert(result.repeatedIdenticalRevisionCopies>0);
assert(result.normalizedStoredRevisionBlobs>=result.activeLessonCount);
assert(result.normalizedStoredRevisionBlobs<=result.distinctRevisionHashesAcrossAllReleases);
assert(result.potentialPayloadSavingsVsThreeFullUtf16>0);
assert(Number.isInteger(result.potentialPayloadSavingsVsV2Utf16),
 'R0 must report signed V2 delta even when normalized metadata costs more');
assert.equal(result.privateRecovery,'NOT_ACCESSED');
assert.equal(result.audioBinaryDigests,'NOT_VERIFIED');
assert.equal(result.learnerDataChanged,false);
assert.deepEqual(files.map(f=>sha(f.path)),oldHashes,'R0 must not modify any source');
assert.equal(stable({b:[{z:1,a:2}],a:3}),stable({a:3,b:[{a:2,z:1}]}));
const original=JSON.parse(fs.readFileSync(files[2].path,'utf8'));
const writing=original.lessons.find(l=>l.activities?.some(q=>q.rubric_id));
assert(writing,'Need original writing rubric lesson');
const rel={source:original};
const a=revisionFor(rel,writing);
const modified=structuredClone(original);
const edited=modified.lessons.find(l=>l.id===writing.id);
edited.activities.find(q=>q.rubric_id).prompt+=' revised';
const b=revisionFor({source:modified},edited);
assert.notEqual(a.revision,b.revision,'A question prompt edit must create a new revision');
const changedRubric=structuredClone(original);
const w=changedRubric.lessons.find(l=>l.id===writing.id);
const id=w.activities.find(q=>q.rubric_id).rubric_id;
changedRubric.rubrics[id]={...changedRubric.rubrics[id],r0_test_revision:'changed'};
assert.notEqual(a.revision,revisionFor({source:changedRubric},w).revision,
 'Referenced rubric edits require a new revision');
delete changedRubric.rubrics[id];
assert.throws(()=>revisionFor({source:changedRubric},w),/Missing rubric/);
console.log(JSON.stringify({
 result:'PASS',
 gate:result.gate,
 inputVersions:result.inputVersions,
 totalLessonCopies:result.totalLessonCopies,
 distinctLessonIds:result.distinctLessonIds,
 distinctRevisionHashesAcrossAllReleases:result.distinctRevisionHashesAcrossAllReleases,
 repeatedIdenticalRevisionCopies:result.repeatedIdenticalRevisionCopies,
 normalizedStoredRevisionBlobs:result.normalizedStoredRevisionBlobs,
 aliases:result.normalizedAliasCount,
 syntheticHistory:73,scored:52,drafts:21,
 sizes:result.sizes,
 savingsVsFull:result.potentialPayloadSavingsVsThreeFullUtf16,
 savingsVsV2:result.potentialPayloadSavingsVsV2Utf16,
 originalFilesUnchanged:true,
 revisedPromptChangesHash:true,revisedRubricChangesHash:true,
 missingRubricFailsClosed:true,
 Safari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',
 productionIntegration:false,deploy:false
}));
