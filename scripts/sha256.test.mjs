import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash,randomBytes} from 'node:crypto';
import {Sha256,sha256LengthBytes,hashBytesSha256} from '../src/sha256.js';

const oracle=bytes=>createHash('sha256').update(bytes).digest('hex'),encode=value=>new TextEncoder().encode(value);
const run=(name,fn)=>test(name,{concurrency:false},fn);
async function withCrypto(value,fn){const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{configurable:true,value});try{return await fn();}finally{if(descriptor)Object.defineProperty(globalThis,'crypto',descriptor);else delete globalThis.crypto;}}
// Offline NIST CAVP byte-oriented cases: empty and SHA padding boundaries.
// https://csrc.nist.gov/Projects/Cryptographic-Algorithm-Validation-Program/Secure-Hashing
const officialVectors=[{"length":0,"message":"00","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"length":56,"message":"2d52447d1244d2ebc28650e7b05654bad35b3a68eedc7f8515306b496d75f3e73385dd1b002625024b81a02f2fd6dffb6e6d561cb7d0bd7a","sha256":"cfb88d6faf2de3a69d36195acec2e255e2af2b7d933997f348e09f6ce5758360"},{"length":63,"message":"e2f76e97606a872e317439f1a03fcd92e632e5bd4e7cbc4e97f1afc19a16fde92d77cbe546416b51640cddb92af996534dfd81edb17c4424cf1ac4d75aceeb","sha256":"18041bd4665083001fba8c5411d2d748e8abbfdcdfd9218cb02b68a78e7d4c23"},{"length":64,"message":"5a86b737eaea8ee976a0a24da63e7ed7eefad18a101c1211e2b3650c5187c2a8a650547208251f6d4237e661c7bf4c77f335390394c37fa1a9f9be836ac28509","sha256":"42e61e174fbb3897d6dd6cef3dd2802fe67b331953b06114a65c772859dfc1aa"}];
await run('Official NIST empty and padding-boundary vectors',async()=>{
 for(const {length,message,sha256} of officialVectors){const bytes=Buffer.from(message,'hex').subarray(0,length);assert.equal(await hashBytesSha256(bytes,{preferNative:false}),sha256);}
});
await run('Official abc, two-block message and million-a examples',async()=>{
 for(const [bytes,expected]of [[encode('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],[encode('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'),'248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],[new Uint8Array(1000000).fill(97),'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0']])assert.equal(await hashBytesSha256(bytes,{preferNative:false}),expected);
 return {vectors:3};
});
await run('Padding boundaries, offset subarrays and randomized incremental chunks match Node',async()=>{
 const lengths=[0,1,2,3,7,31,32,55,56,57,63,64,65,119,120,121,127,128,129,255,256,257,1023,1024,1025,4095,4096,4097,65535,65536,65537];
 for(let i=0;i<40;i++)lengths.push(randomBytes(2).readUInt16BE()%8192);
 let total=0;
 for(const length of lengths){const storage=randomBytes(length+37),bytes=storage.subarray(17,17+length),expected=oracle(bytes),hasher=new Sha256();
  let offset=0;while(offset<bytes.length){const count=Math.min(1+(offset*31+17)%137,bytes.length-offset);hasher.update(bytes.subarray(offset,offset+count));offset+=count;}
  assert.equal(hasher.digest(),expected);assert.equal(await hashBytesSha256(bytes,{preferNative:false}),expected);assert.equal(await hashBytesSha256(bytes),expected);assert.equal(hasher.digest(),expected);assert.throws(()=>hasher.update(new Uint8Array()),/finalized/);total+=length;
 }
 return {cases:lengths.length,bytesTested:total};
});
await run('Big-endian bit length covers low-word rollover and safe upper boundary',async()=>{
 const values=[0,1,55,56,63,64,0x1fffffff,0x20000000,0x20000001,0xffffffff,0x100000000,Number.MAX_SAFE_INTEGER];
 for(const length of values){const expected=Buffer.alloc(8);expected.writeBigUInt64BE(BigInt(length)*8n);assert.deepEqual(Buffer.from(sha256LengthBytes(length)),expected);}
 for(const length of [-1,1.5,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>sha256LengthBytes(length),/length/);
 return {cases:values.length,qualification:'Length encoding rollover verified against BigInt; no512MiB allocation or digest was performed.'};
});
await run('Missing or incomplete crypto selects verified portable fallback',async()=>{
 for(const crypto of [undefined,{}, {subtle:{}}])await withCrypto(crypto,async()=>{const progress=[],bytes=encode('LAN asset');assert.equal(await hashBytesSha256(bytes,{onProgress:p=>progress.push(p)}),oracle(bytes));assert.equal(progress.at(-1).implementation,'portable');});
});
await run('Native fast path is used when available and preserves error failures',async()=>{
 const progress=[],bytes=encode('native asset');assert.equal(await hashBytesSha256(bytes,{onProgress:p=>progress.push(p)}),oracle(bytes));assert.equal(progress.at(-1).implementation,'native');
 await withCrypto({subtle:{digest(){return Promise.reject(new Error('native digest failed'));}}},async()=>{await assert.rejects(hashBytesSha256(bytes),/native digest failed/);});
});
await run('Cancellation rejects before work and during portable yielding',async()=>{
 const pre=new AbortController();pre.abort();await assert.rejects(hashBytesSha256(encode('abc'),{signal:pre.signal,preferNative:false}),{name:'AbortError'});
 const controller=new AbortController();let yielded=0;await assert.rejects(hashBytesSha256(new Uint8Array(1024*1024),{preferNative:false,signal:controller.signal,yieldTask:()=>{yielded++;controller.abort();}}),{name:'AbortError'});assert(yielded>0);
});
await run('Abort releases a pending native digest or user yield promptly',async()=>{
 const controller=new AbortController();let settle;
 await withCrypto({subtle:{digest(){return new Promise(resolve=>{settle=resolve;});}}},async()=>{const result=hashBytesSha256(encode('abc'),{signal:controller.signal});setTimeout(()=>controller.abort(),5);await assert.rejects(result,{name:'AbortError'});settle(new ArrayBuffer(32));});
 const other=new AbortController();let entered=false;const result=hashBytesSha256(new Uint8Array(1024*1024),{preferNative:false,signal:other.signal,yieldTask:()=>{entered=true;setTimeout(()=>other.abort(),5);return new Promise(()=>{});}});await assert.rejects(result,{name:'AbortError'});assert(entered);
});
await run('Invalid byte inputs and callbacks fail explicitly',async()=>{
 await assert.rejects(hashBytesSha256('abc'),/Uint8Array/);await assert.rejects(hashBytesSha256(new Uint8Array(),{yieldTask:7}),/callbacks/);await assert.rejects(hashBytesSha256(new Uint8Array(),{onProgress:7}),/callbacks/);
});
