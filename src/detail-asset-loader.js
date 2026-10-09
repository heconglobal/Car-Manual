import manifest from './detail-manifest.js';
import {decodeModel} from './model-codec.js';
import {textureFromRecipe} from './materials.js';

const magic=bytes=>new TextDecoder().decode(bytes.subarray(0,8))==='FIEROV01';
async function verify(bytes,expected){
 if(!expected||!globalThis.crypto?.subtle)return;
 const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
 if(actual!==expected)throw new Error('Explorer geometry failed its integrity check');
}

// Prefetch two complete native families, not individual assemblies. Encoded
// staging buffers are relinquished when their persistent model is decoded.
export function createDetailAssetLoader(){
 const buffers=new Map(),pending=new Map(),measurements=new Map(),controller=new AbortController();
 let disposed=false;
 const entryFor=family=>{const entry=manifest.families[family];if(!entry||entry.precision!=='native')throw new Error('Unknown full-precision explorer '+family);return entry;};
 async function ensure(family){
  if(buffers.has(family))return;
  if(pending.has(family))return pending.get(family);
  const entry=entryFor(family),started=performance.now();
  const task=(async()=>{
   const response=await fetch((import.meta.env?.BASE_URL||'/')+entry.url.replace(/^\//,''),{signal:controller.signal});if(!response.ok)throw new Error('Explorer geometry could not be downloaded');
   const bytes=new Uint8Array(await response.arrayBuffer()),decoded=magic(bytes);
   if(bytes.byteLength!==(decoded?entry.decodedBytes:entry.bytes))throw new Error('Explorer geometry is incomplete');
   await verify(bytes,decoded?entry.decodedSha256:entry.sha256);
   if(disposed)return;
   buffers.set(family,{bytes,decoded});measurements.set(family,{source:'prebuilt-native',encodedBytes:entry.bytes,decodedBytes:entry.decodedBytes,prefetchMs:performance.now()-started,decodeMs:null});
  })();
  pending.set(family,task);
  try{await task;}finally{pending.delete(family);}
 }
 return {
  has:family=>!!manifest.families[family],
  prefetch:async()=>{await Promise.all(Object.keys(manifest.families).map(ensure));},
  async build(family){
   await ensure(family);if(disposed)throw new Error('Workshop closed before explorer loaded');
   const entry=entryFor(family),stored=buffers.get(family),started=performance.now();let bytes=stored.bytes;
   if(!stored.decoded){
    if(!globalThis.DecompressionStream)throw new Error('This browser cannot decompress the explorer geometry');
    bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    if(bytes.byteLength!==entry.decodedBytes)throw new Error('Decoded explorer geometry is incomplete');
    await verify(bytes,entry.decodedSha256);
   }
   if(disposed)throw new Error('Workshop closed before explorer loaded');
   const model=decodeModel(bytes,textureFromRecipe);model.delivery='prebuilt-native';
   measurements.get(family).decodeMs=performance.now()-started;buffers.delete(family);
   return model;
  },
  getStats:()=>({bufferedBytes:[...buffers.values()].reduce((n,v)=>n+v.bytes.byteLength,0),pendingFamilies:[...pending.keys()],families:Object.fromEntries([...measurements].map(([id,entry])=>[id,{...entry,bufferedBytes:buffers.get(id)?.bytes.byteLength||0}]))}),
  dispose(){disposed=true;controller.abort();buffers.clear();pending.clear();},
 };
}
