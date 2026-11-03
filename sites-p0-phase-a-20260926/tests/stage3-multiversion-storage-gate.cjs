'use strict';
// Stage 3 release safety: true long-lived family profiles may contain many
// immutable curriculum versions. The 2-version test is not a sufficient quota
// guarantee. This gate intentionally fails until a backwards-compatible,
// non-deleting, device-tested storage plan can retain every referenced version.
// No browser data is read or changed here.
const assert=require('node:assert/strict');
const versions=['1.11.0','1.12.0','1.13.0','1.14.0','1.15.0',
 '1.16.0','1.17.0','1.18.0','1.18.1'];
const sources=versions.map(v=>require('../content/curriculum-'+v+'-candidate.json'));
for(let i=0;i<sources.length;i++){
 assert.equal(sources[i].schema_version,versions[i],'Missing/mismatched historical package');
}
const toStored=source=>({
 id:source.package_id,version:source.schema_version,
 digest:'a'.repeat(64),source,at:1
});
const serialize=sources=>JSON.stringify(sources.map(toStored));
const latestTwo=serialize(sources.slice(-2));
const longHistory=serialize(sources);
const budget=5*1024*1024;
// Simulate a conservative device accounting of 2 bytes per JS code unit.
// Real browser quotas differ: exceeding this simulation is a release-risk
// finding, NOT a claim that a particular user's device is already full.
const recentBytes=latestTwo.length*2;
const longHistoryBytes=longHistory.length*2;
assert(recentBytes<budget,'Even two source-only versions exceed the simulated 5 MiB budget.');
const report={
 gate:'stage3-multiversion-storage-retention',
 result:longHistoryBytes<=budget?'PASS':'BLOCKED',
 versions:versions.length,recentBytes,longHistoryBytes,simulatedQuotaBytes:budget,
 originalAttemptsAndOldVersionsMustBePreserved:true,
 note:'Only source snapshots counted; learner attempts and other localStorage keys require additional headroom.'
};
console.log(JSON.stringify(report));
assert(longHistoryBytes<=budget,
 'STAGE3 STORAGE NO-GO: multi-version family history exceeds conservative localStorage capacity. '+
 'Do not delete old packages/attempts or silently claim upgrade PASS. '+
 'Provide and validate a reversible, backwards-compatible archive/compression or IndexedDB migration, '+
 'then update this gate to exercise the actual storage adapter.');
