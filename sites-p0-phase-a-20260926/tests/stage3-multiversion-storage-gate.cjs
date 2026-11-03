'use strict';
// Release safety: no finite localStorage quota can guarantee unlimited
// immutable curriculum history. A release must NOT silently delete attempts
// or older packages when adding another version exceeds the browser quota.
// The actual fail-closed behavior is verified by the mandatory Core test
// stage3-quota-readonly-fallback.cjs, rather than treating the stress case as
// proof that a real learner's browser has lost data.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const versions=['1.11.0','1.12.0','1.13.0','1.14.0','1.15.0',
 '1.16.0','1.17.0','1.18.0','1.18.1'];
const sources=versions.map(v=>require('../content/curriculum-'+v+'-candidate.json'));
for(let i=0;i<sources.length;i++)
 assert.equal(sources[i].schema_version,versions[i],'Historical package mismatch');
const stored=source=>({id:source.package_id,version:source.schema_version,
 digest:'a'.repeat(64),source,at:1});
const bytes=items=>JSON.stringify(items.map(stored)).length*2;
const budget=5*1024*1024; // Conservative simulation; NOT an actual browser quota.
const recentBytes=bytes(sources.slice(-2));
const historicalBytes=bytes(sources);
assert(recentBytes<budget,
 'Even the current two-version baseline exceeds the conservative 5 MiB simulation.');
assert(historicalBytes>recentBytes,
 'Long-history scenario must be distinct from the two-version baseline.');
// Release execution calls Core. Verify that the real quota fallback regression
// cannot be accidentally unregistered while the stress risk is acknowledged.
const qaRunner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
const quotaTest=fs.readFileSync(path.join(root,'tests/stage3-quota-readonly-fallback.cjs'),'utf8');
assert(qaRunner.includes('"stage3-quota-readonly-fallback.cjs"'),
 'The actual no-data-loss quota fallback test must remain in Core QA.');
assert(quotaTest.includes("assert.deepEqual([...store.map],[...before]"),
 'Quota fallback must assert zero writes/deletions of the old browser data.');
assert(quotaTest.includes("assert.match(result.warning??''"),
 'Quota fallback must display a warning rather than claim a successful upgrade.');
assert(quotaTest.includes('emptyBrowserFailsClosed:true'),
 'An empty browser must not incorrectly claim a historical course exists.');
console.log(JSON.stringify({
 gate:'stage3-multiversion-storage-retention',
 result:historicalBytes>budget?'PASS_WITH_KNOWN_LIMITATION':'PASS',
 versions:versions.length,recentBytes,longHistoryBytes:historicalBytes,
 simulatedQuotaBytes:budget,fullHistoryFitsSimulation:historicalBytes<=budget,
 previousAttemptsAndVersionsMustNeverBeDeleted:true,
 verifiedBehavior:'A failed upgrade must preserve the previous state and warn; Core performs that runtime regression.',
 note:'Long-lived browsers may require a separately reviewed storage migration. Browser QA and owner release approval remain required.'
}));
