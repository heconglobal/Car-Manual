// Portable SHA-256 asset integrity for HTTP LAN origins without Web Crypto.
// SHA-256 compression and padding follow FIPS180-4 sections4.1.2,4.2.2,5,6.2.
// Callers keep input bytes unchanged until hashing completes. No input copy is
// made by the fallback; it retains only a64-byte tail and64-word work schedule.
const K=new Uint32Array([
 0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
 0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
 0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
 0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
 0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
 0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
 0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
 0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
]);
const rotate=(word,bits)=>(word>>>bits)|(word<<(32-bits));
const initial=()=>new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
const hex=words=>Array.from(words,value=>value.toString(16).padStart(8,'0')).join('');
const checkBytes=bytes=>{if(!(bytes instanceof Uint8Array))throw new TypeError('SHA-256 requires Uint8Array bytes');};

// Encode the original length as64 big-endian bits, including the512MiB rollover
// of the low32 bit word. Number-safe byte counts are deliberately enforced.
export function sha256LengthBytes(byteLength){
 if(!Number.isSafeInteger(byteLength)||byteLength<0)throw new RangeError('Invalid SHA-256 byte length');
 const bytes=new Uint8Array(8),view=new DataView(bytes.buffer);
 view.setUint32(0,Math.floor(byteLength/0x20000000),false);
 view.setUint32(4,(byteLength%0x20000000)*8,false);
 return bytes;
}

export class Sha256{
 constructor(){this.state=initial();this.schedule=new Uint32Array(64);this.tail=new Uint8Array(64);this.tailLength=0;this.byteLength=0;this.result=null;}
 compress(bytes,offset){
  const w=this.schedule;
  for(let i=0;i<16;i++){const j=offset+i*4;w[i]=(bytes[j]<<24)|(bytes[j+1]<<16)|(bytes[j+2]<<8)|bytes[j+3];}
  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2],s0=rotate(x,7)^rotate(x,18)^(x>>>3),s1=rotate(y,17)^rotate(y,19)^(y>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}
  let [a,b,c,d,e,f,g,h]=this.state;
  for(let i=0;i<64;i++){
   const sum1=rotate(e,6)^rotate(e,11)^rotate(e,25),choose=(e&f)^(~e&g),t1=(h+sum1+choose+K[i]+w[i])>>>0;
   const sum0=rotate(a,2)^rotate(a,13)^rotate(a,22),majority=(a&b)^(a&c)^(b&c),t2=(sum0+majority)>>>0;
   h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
  }
  const values=[a,b,c,d,e,f,g,h];for(let i=0;i<8;i++)this.state[i]=(this.state[i]+values[i])>>>0;
 }
 update(bytes){
  checkBytes(bytes);if(this.result!==null)throw new Error('SHA-256 digest is already finalized');
  if(!Number.isSafeInteger(this.byteLength+bytes.length))throw new RangeError('SHA-256 input length exceeds safe byte counting');
  this.byteLength+=bytes.length;let offset=0;
  if(this.tailLength){const count=Math.min(64-this.tailLength,bytes.length);this.tail.set(bytes.subarray(0,count),this.tailLength);this.tailLength+=count;offset=count;if(this.tailLength===64){this.compress(this.tail,0);this.tailLength=0;}}
  for(;offset+64<=bytes.length;offset+=64)this.compress(bytes,offset);
  if(offset<bytes.length){this.tail.set(bytes.subarray(offset),0);this.tailLength=bytes.length-offset;}
  return this;
 }
 digest(){
  if(this.result!==null)return this.result;
  const final=new Uint8Array(this.tailLength<56?64:128);final.set(this.tail.subarray(0,this.tailLength));final[this.tailLength]=0x80;final.set(sha256LengthBytes(this.byteLength),final.length-8);
  for(let offset=0;offset<final.length;offset+=64)this.compress(final,offset);
  this.result=hex(this.state);return this.result;
 }
}

const nextTask=()=>globalThis.scheduler?.yield?globalThis.scheduler.yield():new Promise(resolve=>setTimeout(resolve,0));
const abortError=signal=>signal?.reason instanceof Error?signal.reason:new DOMException('Asset integrity check cancelled','AbortError');
const checkAbort=signal=>{if(signal?.aborted)throw abortError(signal);};
async function abortable(promise,signal){
 if(!signal)return promise;
 checkAbort(signal);let abort;
 const cancelled=new Promise((resolve,reject)=>{abort=()=>reject(abortError(signal));signal.addEventListener('abort',abort,{once:true});});
 try{return await Promise.race([promise,cancelled]);}finally{signal.removeEventListener('abort',abort);}
}

export async function hashBytesSha256(bytes,{signal,yieldTask=nextTask,preferNative=true,onProgress=()=>{}}={}){
 checkBytes(bytes);checkAbort(signal);if(typeof yieldTask!=='function'||typeof onProgress!=='function')throw new TypeError('Invalid SHA-256 callbacks');
 const subtle=globalThis.crypto?.subtle;
 if(preferNative&&typeof subtle?.digest==='function'){
  // Native digest cannot itself be cancelled; stop waiting promptly on abort.
  // Its underlying operation may retain a native input copy until completion.
  const result=await abortable(subtle.digest('SHA-256',bytes),signal);checkAbort(signal);
  onProgress({completed:bytes.length,total:bytes.length,implementation:'native'});checkAbort(signal);
  return Array.from(new Uint8Array(result),value=>value.toString(16).padStart(2,'0')).join('');
 }
 const hasher=new Sha256();let lastYield=performance.now();
 for(let offset=0;offset<bytes.length;offset+=64*1024){
  checkAbort(signal);const end=Math.min(offset+64*1024,bytes.length);hasher.update(bytes.subarray(offset,end));
  if(performance.now()-lastYield>=8){onProgress({completed:end,total:bytes.length,implementation:'portable'});checkAbort(signal);await abortable(Promise.resolve().then(yieldTask),signal);checkAbort(signal);lastYield=performance.now();}
 }
 checkAbort(signal);const result=hasher.digest();onProgress({completed:bytes.length,total:bytes.length,implementation:'portable'});checkAbort(signal);return result;
}
