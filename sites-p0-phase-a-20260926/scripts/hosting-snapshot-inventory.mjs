import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const order=(a,b)=>a<b?-1:a>b?1:0;
// Raw build inventory, not proof of deployed Firebase bytes or authorization.
export function inventory(root){
 const base=path.resolve(root),entries=[];
 if(!fs.lstatSync(base).isDirectory())throw Error('Build root must be a real directory');
 function walk(dir,parts){
  for(const name of fs.readdirSync(dir).sort(order)){
   if(!name||name==='.'||name==='..'||/[\\\x00-\x1f\x7f]/.test(name))throw Error('Unsafe snapshot path');
   const full=path.join(dir,name),next=[...parts,name],stat=fs.lstatSync(full);
   if(stat.isDirectory()){walk(full,next);continue;}
   if(!stat.isFile())throw Error('Non-regular snapshot entry: '+next.join('/'));
   const bytes=fs.readFileSync(full);
   if(bytes.length!==stat.size)throw Error('Snapshot changed during inventory');
   entries.push({path:next.join('/'),bytes:bytes.length,sha256:sha256(bytes)});
  }
 }
 walk(base,[]);entries.sort((a,b)=>order(a.path,b.path));
 if(!entries.length)throw Error('Empty snapshot');
 if(!entries.some(e=>e.path==='index.html'&&e.bytes>0))throw Error('Missing nonempty index.html');
 if(!entries.some(e=>e.path.endsWith('.js')&&e.bytes>0))throw Error('Missing nonempty JavaScript');
 return {schema:1,scope:'raw-static-build',files:entries.length,bytes:entries.reduce((n,e)=>n+e.bytes,0),inventorySha256:sha256(JSON.stringify(entries)),entries};
}
export function verifyInventory(root,expected){
 const observed=inventory(root);
 if(JSON.stringify(observed)!==JSON.stringify(expected))throw Error('Snapshot parity mismatch');
 return observed;
}
function main(){
 const [root,output]=process.argv.slice(2);
 if(!root||!output)throw Error('Usage: node scripts/hosting-snapshot-inventory.mjs BUILD_ROOT OUTPUT_JSON');
 const base=fs.realpathSync(root),target=path.resolve(output),parent=fs.realpathSync(path.dirname(target));
 const actualTarget=path.join(parent,path.basename(target));
 if(actualTarget===base||actualTarget.startsWith(base+path.sep))throw Error('Inventory must stay outside build');
 const result=inventory(root);
 fs.writeFileSync(actualTarget,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 verifyInventory(root,result);
 console.log(JSON.stringify({gate:'HOSTING_RAW_BUILD_INVENTORY',files:result.files,bytes:result.bytes,sha256:result.inventorySha256,deployParity:'NOT_VERIFIED',retainedArtifact:'NOT_VERIFIED'}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
