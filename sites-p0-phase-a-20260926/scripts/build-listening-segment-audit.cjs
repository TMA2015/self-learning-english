'use strict';
/**
 * Generate local, OFFLINE HTML QA tools for the approved Listening pilots.
 * Output is deliberately under .sites-runtime, never public or Firebase dist.
 * Timings must be replayed against the exact original SHA-verified MP3.
 * There is no automatic verification, production integration or graded evidence.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const allowed=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
function sourceLines(){
 const source=fs.readFileSync(path.join(root,'domain/listening-dictation.ts'),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
 }}).outputText;
 const exports={};const module={exports};
 vm.runInNewContext(js,{module,exports:module.exports,Math,Set,Map,Number,String,Error},{timeout:2000});
 return module.exports.splitDictationLines;
}
const split=sourceLines();
const template=fs.readFileSync(path.join(root,'tools/listening-segment-audit.template.html'),'utf8');
if(!template.includes('const auditData=__LESSON_DATA__;'))throw Error('QA template placeholder missing');
const requested=process.argv.slice(2);
const ids=requested.length?requested:allowed;
const out=path.join(root,'.sites-runtime/listening-segment-audit');
fs.mkdirSync(out,{recursive:true});
const created=[];
for(const id of ids){
 if(!allowed.includes(id))throw Error('Not a three-pilot, reviewed-source Listening lesson: '+id);
 const item=manifest[id];
 if(!item?.source||!item.url?.startsWith('/foundation-audio/')||!item.sha256||
  !Number.isFinite(item.duration))throw Error(id+' missing approved source / real media metadata');
 const audio=path.join(root,'public',item.url.slice(1));
 if(!fs.existsSync(audio))throw Error('Missing actual original MP3: '+id);
 const bytes=fs.readFileSync(audio);
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 if(hash!==item.sha256)throw Error('Original MP3 SHA mismatch: '+id);
 if(bytes.length<10000)throw Error('Audio file unexpectedly short: '+id);
 const lines=split(item.source);
 if(lines.length<2)throw Error('Cannot provide line segmentation for: '+id);
 const data={lessonId:id,url:item.url,sha256:item.sha256,
  duration:item.duration,lines};
 const safe=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028');
 const html=template.replace('__LESSON_DATA__',safe);
 if(html.includes('__LESSON_DATA__'))throw Error('Unexpected placeholder remained');
 const filename=path.join(out,id+'-offline-audit.html');
 fs.writeFileSync(filename,html,'utf8');
 created.push({lessonId:id,lines:lines.length,mp3Sha:item.sha256,
  htmlRelativePath:path.relative(root,filename)});
}
console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_SEGMENT_OFFLINE_AUDIT_BUILD',
 outputs:created,verifiedSegmentCount:0,productionEnabled:false,
 physicalListeningQA:'NOT_YET_DONE',noFirebaseWrites:true}));
