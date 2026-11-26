// #251: read-only transport; never imports curriculum or writes browser storage.
const MAX_BYTES=8_000_000;
const HEX=/^[a-f0-9]{64}$/;
const VERSION=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export async function downloadVerifiedContent(origin,pin,{fetcher=globalThis.fetch,cryptoProvider=globalThis.crypto,timeoutMs=15000}={}){
 if(typeof origin!=='string'||new URL(origin).origin!==origin||!origin.startsWith('https://'))throw Error('origin');
 if(!pin||typeof pin.version!=='string'||!VERSION.test(pin.version)||typeof pin.rawSha256!=='string'||!HEX.test(pin.rawSha256)||!Number.isSafeInteger(pin.byteLength)||pin.byteLength<=0||pin.byteLength>MAX_BYTES)throw Error('pin');
 const path=`/content-releases/${pin.version}/${pin.rawSha256}.json`;
 if(pin.path!==path)throw Error('path');
 if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)throw Error('timeout-config');
 const url=origin+path,controller=new AbortController();let reader,response,complete=false;
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  response=await fetcher(url,{method:'GET',credentials:'omit',redirect:'error',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
  if(!response.ok||response.status!==200||response.redirected||response.url!==url)throw Error('response');
  if(!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type')??'')||!response.body)throw Error('media-type');
  reader=response.body.getReader();const bytes=new Uint8Array(pin.byteLength);let offset=0;
  while(true){const {done,value}=await reader.read();if(controller.signal.aborted)throw Error('timeout');if(done)break;
   if(!(value instanceof Uint8Array)||value.length>bytes.length-offset)throw Error('size');
   bytes.set(value,offset);offset+=value.length;
  }
  if(offset!==bytes.length)throw Error('length');
  const digest=Array.from(new Uint8Array(await cryptoProvider.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(controller.signal.aborted)throw Error('timeout');if(digest!==pin.rawSha256)throw Error('digest');
  const source=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(!source||source.schema_version!==pin.version)throw Error('version');
  complete=true;return {bytes,source,digest};
 }finally{
  clearTimeout(timer);
  if(!complete){controller.abort();try{if(reader)void reader.cancel().catch(()=>{});else if(response?.body)void response.body.cancel().catch(()=>{});}catch{}}
  try{reader?.releaseLock();}catch{}
 }
}
