// #251 historical replay only, not runtime activation or future manifest authority.
// No storage API, network request, import token or importPackage call.
import {sourceDigest, type academicService} from '../../application/academic-service';
import {compareVersions,mapSeed,validateSeed,type Seed,type AcademicPackage} from '../../domain/academic';
import {validateContent} from '../../domain/content-model';
type ReadOnlyService=Pick<ReturnType<typeof academicService>,'packages'|'preview'>;
const baselineDigest='fd233ca59c720ddb3b1dc42ad8d951624261b4b7002b3ab0767a9cf167fea50f';
const candidateDigest='5eaab191b2de845cfac20ac7b3aaaf3a1fde1279fd37813d4f26a407b330ea23';
const rawDigest='d95402089159b81af1ef99d5d797f0914fe21a4a498f1ab31053eba0f059e251';
const byteLength=1650627;
const changedIds=['REA-B2-05','REA-B2-06','REA-B2-07','REA-B2-08','REA-B2-09'];
type Result={status:'PREVIEW_ONLY';version:'1.28.1';updates:5;unchanged:171}|{status:'RETAIN_EXISTING';reason:string};
const retain=(reason:string):Result=>({status:'RETAIN_EXISTING',reason});
const signature=(rows:AcademicPackage[])=>JSON.stringify(rows.map(p=>[p.version,p.digest]).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0));
export async function previewReviewedContentReplay(input:Uint8Array,service:ReadOnlyService):Promise<Result>{
 try{
  if(!(input instanceof Uint8Array)||input.byteLength!==byteLength)return retain('length');
  const bytes=new Uint8Array(input); // own immutable-for-this-operation copy
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==rawDigest)return retain('raw-digest');
  const source:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(validateSeed(source).length)return retain('schema');
  const candidate=source as Seed;
  if(candidate.schema_version!=='1.28.1'||candidate.lessons.length!==176||candidate.lessons.reduce((n,l)=>n+l.activities.length,0)!==1224)return retain('scope');
  if(await sourceDigest(candidate)!==candidateDigest)return retain('canonical-digest');
  if(validateContent(mapSeed(candidate)).length)return retain('mapped-content');
  const rows=await service.packages();
  if(rows.some(p=>!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(p.version))||new Set(rows.map(p=>p.version)).size!==rows.length)return retain('invalid-local-versions');
  const latest=[...rows].sort((a,b)=>compareVersions(b.version,a.version))[0];
  if(!latest)return retain('missing-baseline');
  if(latest.version==='1.28.1')return retain(latest.digest===candidateDigest?'already-current':'immutable-conflict');
  if(latest.version!=='1.28.0'||latest.digest!==baselineDigest)return retain('unrecognized-baseline');
  if(latest.source.schema_version!==latest.version||await sourceDigest(latest.source)!==baselineDigest)return retain('baseline-source-mismatch');
  const snapshot=signature(rows);
  const check=await service.preview(candidate);
  if(check.errors.length||check.digest!==candidateDigest||check.version!=='1.28.1'||check.counts.add!==0||check.counts.update!==5||check.counts.skip!==171||check.counts.conflict!==0)return retain('preview-mismatch');
  if(JSON.stringify(check.rows.filter(r=>r.action==='update').map(r=>r.id).sort())!==JSON.stringify(changedIds))return retain('changed-id-mismatch');
  const after=await service.packages();
  if(signature(after)!==snapshot)return retain('baseline-changed');
  const current=after.find(p=>p.version==='1.28.0');
  if(!current||await sourceDigest(current.source)!==baselineDigest)return retain('baseline-source-changed');
  // Do not return a confirmation token or candidate source; no activation capability.
  return {status:'PREVIEW_ONLY',version:'1.28.1',updates:5,unchanged:171};
 }catch{return retain('read-only-preview-failed');}
}
