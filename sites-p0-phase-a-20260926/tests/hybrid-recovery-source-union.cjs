'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/hybrid-recovery-source-union';
cp.execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
 'domain/recovery-source-union.ts','--outDir',out,'--module','commonjs',
 '--target','es2022','--resolveJsonModule','--esModuleInterop',
 '--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {reconcileRecoverySources}=require('../'+out+'/domain/recovery-source-union.js');
const a=require('../content/curriculum-1.18.1-candidate.json');
const b=require('../content/curriculum-1.20.0-candidate.json');
const row=(source)=>({id:source.package_id,version:source.schema_version,
 digest:'original-digest-'+source.schema_version,source,at:1});
const old=row(a),latest=row(b);
const first=a.lessons[0],second=a.lessons[1];
const saved=[
 {version:old.version,lessonId:first.id},
 {version:old.version,lessonId:second.id},
 {version:latest.version,lessonId:b.lessons[0].id},
];
const subset={...old,source:{...a,lessons:[first]},archive:'referenced-lessons'};
const both=reconcileRecoverySources([subset,latest],[old],saved);
assert.equal(both.versions,2);
assert.equal(both.attempts,3);
assert.equal(both.protectedLessons,3);
assert.equal(both.records.find(x=>x.version===old.version).source.lessons.length,a.lessons.length);
assert.equal(both.portablePackageDocument.schema,2);
const secondSubset={...old,source:{...a,lessons:[second]},archive:'referenced-lessons'};
const archived=reconcileRecoverySources([subset],[secondSubset,latest],saved);
assert.equal(archived.records.find(x=>x.version===old.version).source.lessons.length,2);
assert.throws(()=>reconcileRecoverySources([subset,latest],[],
 [{version:old.version,lessonId:'MISSING_OLD_LESSON'}]),/missing original/);
const changed={...first,title:'Tampered after scoring'};
const corrupted={...old,source:{...a,lessons:[changed]},archive:'referenced-lessons'};
assert.throws(()=>reconcileRecoverySources([subset,latest],[corrupted],saved),
 /immutable version content differs/);
const forgedDigest={...old,digest:'another-same-version-digest'};
assert.throws(()=>reconcileRecoverySources([old,latest],[forgedDigest],saved),
 /immutable version content differs/);
console.log(JSON.stringify({result:'PASS',gate:'hybrid-recovery-source-union',
 protectedAttempts:3,compatibleArchiveToFull:true,
 missingHistoricLessonBlocked:true,tamperedLessonBlocked:true,
 digestConflictBlocked:true,actualBrowserRestore:'NOT_TESTED',productionWrites:0}));
