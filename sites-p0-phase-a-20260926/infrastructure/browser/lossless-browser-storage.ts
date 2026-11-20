/** Lossless, synchronous at-rest compression for English learner localStorage.
 * The existing V2 Recovery JSON remains UNCOMPRESSED and unchanged: callers
 * always see original JSON values via the wrapper, including historical keys.
 *
 * No third-party, CDN, network, browser worker, storage deletion or migration.
 * LZW over UTF-8 (bounded dictionary), base64 varint codes and exact prewrite
 * round-trip verification. The native localStorage.setItem remains atomic.
 *
 * NOT a replacement for long-term IndexedDB persistence or cloud sync.
 */
const MAGIC='~sle-lzw1~';
const MAX_UNPACKED_BYTES=25_000_000;
const ENGLISH='g-learning:english:v1:';
type BrowserStore=Pick<Storage,'getItem'|'setItem'|'removeItem'|'key'|'length'>;

function compressible(key:string){
 if(!key.startsWith(ENGLISH))return false;
 const suffix=key.slice(ENGLISH.length);
 return suffix==='academic:packages'
  ||/^owner:[^:]+:(academic-attempts|learner:[^:]+:(state|evidence|assessments|snapshots))$/.test(suffix);
}
function hash32(bytes:Uint8Array){
 let n=0x811c9dc5;
 for(const byte of bytes){n=Math.imul(n^byte,0x01000193)>>>0;}
 return n.toString(16).padStart(8,'0');
}
function encode(value:string):string{
 const bytes=new TextEncoder().encode(value);
 if(!bytes.length||bytes.length>MAX_UNPACKED_BYTES)return value;
 const dict=new Map<string,number>();
 let next=256,w=String.fromCharCode(bytes[0]);
 const out:number[]=[];
 function emit(number:number){
  while(number>=128){out.push((number&127)|128);number>>>=7;}
  out.push(number);
 }
 for(let i=1;i<bytes.length;i++){
  const current=String.fromCharCode(bytes[i]),both=w+current;
  if(dict.has(both)){w=both;continue;}
  emit(w.length===1?w.charCodeAt(0):dict.get(w)!);
  if(next<=65535)dict.set(both,next++);
  w=current;
 }
 emit(w.length===1?w.charCodeAt(0):dict.get(w)!);
 const blocks:string[]=[];
 for(let i=0;i<out.length;i+=8192)
  blocks.push(String.fromCharCode(...out.slice(i,i+8192)));
 const encoded=MAGIC+bytes.length+':'+hash32(bytes)+':'+btoa(blocks.join(''));
 // Store raw if compression is not beneficial; old raw data stays supported.
 return encoded.length<value.length?encoded:value;
}
function decode(value:string):string{
 if(!value.startsWith(MAGIC))return value;
 const match=/^~sle-lzw1~(\d+):([0-9a-f]{8}):([A-Za-z0-9+/]*={0,2})$/.exec(value);
 if(!match)throw Error('English storage compression header is invalid. Preserve browser data.');
 const expected=Number(match[1]);
 if(!Number.isSafeInteger(expected)||expected<1||expected>MAX_UNPACKED_BYTES)
  throw Error('English storage compression length is invalid. Preserve browser data.');
 let packed:string;
 try{packed=atob(match[3])}
 catch{throw Error('English storage compressed data is corrupted. Preserve browser data.')}
 let offset=0,next=256,previous:Uint8Array|null=null,produced=0;
 const dictionary:(Uint8Array|undefined)[]=[];
 const chunks:Uint8Array[]=[];
 function readCode():number{
  let shift=0,code=0,byte:number;
  do{
   if(offset>=packed.length||shift>21)throw Error('Truncated English storage. Preserve browser data.');
   byte=packed.charCodeAt(offset++);
   code|=(byte&127)<<shift;
   shift+=7;
  }while(byte&128);
  return code;
 }
 while(offset<packed.length){
  const code=readCode();
  let current:Uint8Array;
  if(code<256)current=Uint8Array.of(code);
  else if(code<next&&dictionary[code])current=dictionary[code]!;
  else if(code===next&&previous){
   current=new Uint8Array(previous.length+1);
   current.set(previous);current[previous.length]=previous[0];
  }else throw Error('Invalid English storage dictionary code. Preserve browser data.');
  produced+=current.length;
  if(produced>expected)throw Error('Expanded English storage exceeds verified length. Preserve browser data.');
  if(previous&&next<=65535){
   const nextEntry=new Uint8Array(previous.length+1);
   nextEntry.set(previous);nextEntry[previous.length]=current[0];
   dictionary[next++]=nextEntry;
  }
  chunks.push(current);previous=current;
 }
 if(produced!==expected)throw Error('English storage payload length mismatch. Preserve browser data.');
 const restored=new Uint8Array(produced);
 let pos=0;for(const chunk of chunks){restored.set(chunk,pos);pos+=chunk.length;}
 if(hash32(restored)!==match[2])throw Error('English storage checksum mismatch. Preserve browser data.');
 try{return new TextDecoder('utf-8',{fatal:true}).decode(restored)}
 catch{throw Error('English storage UTF-8 is invalid. Preserve browser data.')}
}
const cache=new WeakMap<object,BrowserStore>();
export function englishLosslessStore(native:BrowserStore):BrowserStore{
 if(cache.has(native as object))return cache.get(native as object)!;
 const wrapped:BrowserStore={
  get length(){return native.length;},
  key(index:number){return native.key(index);},
  getItem(key:string){
   const value=native.getItem(key);
   return value===null?null:compressible(key)?decode(value):value;
  },
  setItem(key:string,value:string){
   if(typeof value!=='string')throw Error('English storage writes require text.');
   const proposed=compressible(key)?encode(value):value;
   if(proposed!==value&&decode(proposed)!==value)
    throw Error('Lossless English storage verification failed; original value remains unchanged.');
   native.setItem(key,proposed);
  },
  removeItem(key:string){native.removeItem(key);}
 };
 cache.set(native as object,wrapped);
 cache.set(wrapped as object,wrapped);
 return wrapped;
}
/** Read-only estimate: storage engines may apply different quota accounting. */
export function estimateEnglishLocalStorage(native:BrowserStore):{utf16Bytes:number;keys:number}{
 let utf16Bytes=0,keys=0;
 for(let i=0;i<native.length;i++){
  const key=native.key(i);
  if(!key?.startsWith(ENGLISH))continue;
  const value=native.getItem(key);
  if(value===null)continue;
  keys++;utf16Bytes+=2*(key.length+value.length);
 }
 return {utf16Bytes,keys};
}
/** Use the codec on real browser Storage only. Unit-test fake storage retains
 * its established raw-string contract unless the test opts into the wrapper.
 */
export function englishNativeBrowserStore(store:BrowserStore):BrowserStore{
 return typeof Storage!=='undefined'&&store instanceof Storage
  ?englishLosslessStore(store):store;
}
export const __storageCodecTest={encode,decode,compressible};
