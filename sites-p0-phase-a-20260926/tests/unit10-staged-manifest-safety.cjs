'use strict';
const assert=require('node:assert/strict');
const validate=require('./helpers/staged-listening-manifest.cjs');
const original=require('../content/foundation-audio.json');
const lessons=require('../content/curriculum-1.18.1-candidate.json').lessons.filter(l=>l.module==='listening');
const copy=()=>JSON.parse(JSON.stringify(original));
assert.deepEqual(validate(original,lessons).sort(),['LIS-A1-06','LIS-A2-07','LIS-B1-08']);
for(const mutate of [m=>delete m[lessons[0].id],m=>m.UNKNOWN=m['LIS-A1-06'],m=>delete m['LIS-A1-06'],m=>m['LIS-A1-06'].source+=' changed',m=>m['LIS-A1-06'].url='/bad.mp3',m=>m['LIS-A1-06'].sha256='0'.repeat(64),m=>m['LIS-A1-06'].duration=0]){const m=copy();mutate(m);assert.throws(()=>validate(m,lessons));}
assert.throws(()=>validate(original,lessons,()=>Buffer.from('corrupt')));
assert.throws(()=>validate(original,lessons,undefined,()=>false));
console.log('PASS staged manifest: 3 exact assets; missing current/unknown/missing file/corrupt bytes/source/URL/hash/duration rejected');
