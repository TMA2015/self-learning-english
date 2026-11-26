import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {downloadVerifiedContent} from './content-release-transport.mjs';
const origin='https://example.test',version='1.28.1';
const bytes=Buffer.from(JSON.stringify({schema_version:version,lesson:'Café — học tiếng Anh'}));
function pinFor(b){const rawSha256=createHash('sha256').update(b).digest('hex');return {version,rawSha256,byteLength:b.length,path:`/content-releases/${version}/${rawSha256}.json`};}
const pin=pinFor(bytes);let calls=0;
function response(b=bytes,{status=200,type='application/json; charset=utf-8',url=origin+pin.path,redirected=false}={}){const r=new Response(b,{status,headers:{'content-type':type}});Object.defineProperties(r,{url:{value:url},redirected:{value:redirected}});return r;}
const good=async(url,opt)=>{calls++;assert.equal(url,origin+pin.path);assert.equal(opt.credentials,'omit');assert.equal(opt.redirect,'error');assert.equal(opt.cache,'no-store');return response();};
const rows=[];async function test(name,fn){await fn();rows.push(name);}
const reject=(p,fetcher=good,o=origin,timeoutMs=1000)=>assert.rejects(()=>downloadVerifiedContent(o,p,{fetcher,timeoutMs}));
await test('valid bytes and UTF-8',async()=>{const r=await downloadVerifiedContent(origin,pin,{fetcher:good});assert.equal(r.source.lesson,'Café — học tiếng Anh');assert.equal(r.digest,pin.rawSha256);assert.deepEqual(Buffer.from(r.bytes),bytes);});
await test('untrusted path rejected before fetch',async()=>{const n=calls;await reject({...pin,path:'https://evil.test/a'});assert.equal(calls,n);});
await test('oversize pin before fetch',async()=>{const n=calls;await reject({...pin,byteLength:8_000_001});assert.equal(calls,n);});
await test('HTTP origin rejected',()=>reject(pin,good,'http://example.test'));
await test('origin with path rejected',()=>reject(pin,good,origin+'/x'));
await test('redirected response',()=>reject(pin,async()=>response(bytes,{redirected:true})));
await test('different response origin',()=>reject(pin,async()=>response(bytes,{url:'https://evil.test/a'})));
await test('not found',()=>reject(pin,async()=>response(bytes,{status:404})));
await test('partial response',()=>reject(pin,async()=>response(bytes,{status:206})));
await test('HTML fallback',()=>reject(pin,async()=>response(bytes,{type:'text/html'})));
await test('truncated payload',()=>reject(pin,async()=>response(bytes.subarray(0,-1))));
await test('stream limit and cancellation',async()=>{let canceled=false;const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(bytes.length+1));},cancel(){canceled=true;}});await reject(pin,async()=>response(stream));assert(canceled);});
await test('same-length tamper',()=>{const b=Buffer.from(bytes);b[b.length-2]^=1;return reject(pin,async()=>response(b));});
await test('valid hash but invalid UTF-8',()=>{const b=Buffer.from([0xff]);const p=pinFor(b);return reject(p,async()=>response(b,{url:origin+p.path}));});
await test('valid hash but invalid JSON',()=>{const b=Buffer.from('{');const p=pinFor(b);return reject(p,async()=>response(b,{url:origin+p.path}));});
await test('valid hash but wrong version',()=>{const b=Buffer.from('{"schema_version":"1.28.2"}');const p=pinFor(b);return reject(p,async()=>response(b,{url:origin+p.path}));});
await test('offline fetch',()=>reject(pin,async()=>{throw Error('offline');}));
await test('timeout aborts fetch',async()=>{let aborted=false;await reject(pin,async(_url,{signal})=>new Promise((_,fail)=>signal.addEventListener('abort',()=>{aborted=true;fail(Error('abort'));},{once:true})),origin,10);assert(aborted);});
console.log(JSON.stringify({pass:rows.length,total:18,rows,actualWebCrypto:true,actualResponseStreams:true,network:'MOCKED',storage:'NOT_TOUCHED'}));
