import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {inventory,verifyInventory} from '../scripts/hosting-snapshot-inventory.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const hex=/^[a-f0-9]{64}$/;
const version=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
// Initial isolated assembly only. Caller must independently establish trusted
// snapshot identity and approved pin. This function neither authorizes nor deploys.
export function assembleInitialSnapshot({baseline,expected,payload,pin,destination}){
 const base=fs.realpathSync(baseline),target=path.resolve(destination);
 const parent=fs.realpathSync(path.dirname(target)),dest=path.join(parent,path.basename(target));
 if(dest===base||dest.startsWith(base+path.sep)||base.startsWith(dest+path.sep))throw Error('Destination overlaps baseline');
 if(fs.existsSync(dest))throw Error('Destination exists');
 if(!pin||Object.keys(pin).sort().join(',')!=='byteLength,rawSha256,version'||typeof pin.version!=='string'||!version.test(pin.version)||typeof pin.rawSha256!=='string'||!hex.test(pin.rawSha256)||!Number.isSafeInteger(pin.byteLength)||pin.byteLength<1||pin.byteLength>8_000_000)throw Error('Invalid externally supplied pin');
 if(!Buffer.isBuffer(payload)||payload.length!==pin.byteLength||sha(payload)!==pin.rawSha256)throw Error('Payload integrity mismatch');
 const parsed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(payload));
 if(!parsed||parsed.schema_version!==pin.version)throw Error('Payload version mismatch');
 const before=verifyInventory(base,expected);
 // Narrow first pilot: never overwrite a prior release namespace or pointer.
 if(fs.existsSync(path.join(base,'content-releases')))throw Error('Existing release namespace requires separate gate');
 const immutable=`content-releases/${pin.version}/${pin.rawSha256}.json`;
 const pointer='content-releases/current.json';
 const pointerBytes=Buffer.from(JSON.stringify({schema:1,...pin,path:'/'+immutable})+'\n');
 fs.mkdirSync(dest,{mode:0o700});
 try{
  for(const e of before.entries){const out=path.join(dest,e.path);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(base,e.path),out,fs.constants.COPYFILE_EXCL);}
  fs.mkdirSync(path.dirname(path.join(dest,immutable)),{recursive:true});
  fs.writeFileSync(path.join(dest,immutable),payload,{flag:'wx'});
  fs.writeFileSync(path.join(dest,pointer),pointerBytes,{flag:'wx'});
  const after=inventory(dest),oldPaths=new Set(before.entries.map(e=>e.path));
  const original=after.entries.filter(e=>oldPaths.has(e.path));
  if(JSON.stringify(original)!==JSON.stringify(before.entries))throw Error('Original static assets changed');
  const added=after.entries.filter(e=>!oldPaths.has(e.path));
  const expectedAdded=[{path:immutable,bytes:payload.length,sha256:sha(payload)},{path:pointer,bytes:pointerBytes.length,sha256:sha(pointerBytes)}].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
  if(JSON.stringify(added)!==JSON.stringify(expectedAdded))throw Error('Unapproved assembly delta');
  verifyInventory(base,expected);
  return {scope:'ISOLATED_ASSEMBLY_NOT_LIVE',originalFiles:before.files,originalBytes:before.bytes,baselineInventorySha256:before.inventorySha256,assembledInventorySha256:after.inventorySha256,added,outputFiles:after.files,outputBytes:after.bytes};
 }catch(error){fs.rmSync(dest,{recursive:true,force:true});throw error;}
}
