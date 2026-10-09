import manifest from './vehicle-manifest.js';
import {decodeNativeModelStream} from './stream-native-model.js';
import {textureFromRecipe} from './materials.js';
import {vehicleConfiguration} from './vehicle-state.js';
import {disposeModel} from './model-resources.js';
import {hashBytesSha256} from './sha256.js';

const abortError=signal=>signal?.reason instanceof Error?signal.reason:new DOMException('Workshop loading cancelled','AbortError');
const checkAbort=signal=>{if(signal?.aborted)throw abortError(signal);};
const shaPattern=/^[a-f0-9]{64}$/;

function validateManifest(entry){
 if(entry?.format!==1||entry.precision!=='native'||entry.compression!=='gzip'||entry.packing!=='delta-byte-plane')throw new Error('The complete vehicle asset has an unsupported format.');
 if(!entry.url||!entry.url.endsWith('.fiero')||!shaPattern.test(entry.sha256)||!shaPattern.test(entry.decodedSha256))throw new Error('The complete vehicle asset descriptor is incomplete.');
 for(const key of ['bytes','decodedBytes','parts','meshes','triangles'])if(!Number.isSafeInteger(entry[key])||entry[key]<1)throw new Error('The complete vehicle asset descriptor is invalid.');
 if(!entry.validation?.nativeRoundTrip||!entry.validation?.exactPartBounds||!entry.validation?.nativeProperties)throw new Error('The complete vehicle asset has not passed native validation.');
}

// Keep one compressed allocation. Decode only after the entire compressed file
// has passed its SHA check; never allocate its complete inflated transport.
async function readCompressed(response,entry,signal,onProgress){
 try{
 if(!response.ok)throw new Error('The complete vehicle could not be downloaded. Check the connection and reload.');
 if(!response.body?.getReader)throw new Error('This browser cannot stream the complete vehicle.');
 const encoding=response.headers.get('content-encoding');
 // Fetch decodes HTTP transport compression; verify the resulting model bytes below.
 const declared=response.headers.get('content-length');
 if((!encoding||encoding==='identity')&&declared!==null&&Number(declared)!==entry.bytes)throw new Error('The complete vehicle download has an unexpected size.');
 }catch(error){try{await response.body?.cancel(error);}catch{}throw error;}
 const reader=response.body.getReader(),bytes=new Uint8Array(entry.bytes);let offset=0,lastProgress=-Infinity;
 const aborted=()=>{void reader.cancel(abortError(signal)).catch(()=>{});};
 signal?.addEventListener('abort',aborted,{once:true});
 try{
  checkAbort(signal);
  while(true){
   const result=await reader.read();checkAbort(signal);if(result.done)break;
   if(!(result.value instanceof Uint8Array)||offset+result.value.byteLength>bytes.length)throw new Error('The complete vehicle download exceeds its verified size.');
   bytes.set(result.value,offset);offset+=result.value.byteLength;
   if(performance.now()-lastProgress>=100||offset===bytes.length){lastProgress=performance.now();onProgress({phase:'download',label:'Downloading the complete vehicle',completed:offset,total:bytes.length,detail:`${(offset/1e6).toFixed(1)} / ${(bytes.length/1e6).toFixed(1)} MB`});}
  }
  if(offset!==bytes.length)throw new Error('The complete vehicle download was interrupted. Reload to retry.');
  return bytes;
 }catch(error){try{await reader.cancel(error);}catch{}throw error;}
 finally{signal?.removeEventListener('abort',aborted);reader.releaseLock();}
}

function compressedStream(input,signal){
 let bytes=input,offset=0;
 return new ReadableStream({
  pull(controller){
   checkAbort(signal);
   if(offset===bytes.length){bytes=null;controller.close();return;}
   const end=Math.min(offset+64*1024,bytes.length);controller.enqueue(bytes.subarray(offset,end));offset=end;
  },
  cancel(){bytes=null;},
 },{highWaterMark:64*1024,size:chunk=>chunk.byteLength});
}

export async function loadVehicleAsset({signal,onProgress=()=>{},entry=manifest,request=globalThis.fetch,makeTexture=textureFromRecipe,decode=decodeNativeModelStream}={}){
 const started=performance.now();let model=null,compressed=null;
 try{
  checkAbort(signal);validateManifest(entry);
  if(!globalThis.DecompressionStream)throw new Error('This browser cannot decompress the complete vehicle. Use a browser with gzip streaming support.');
  onProgress({phase:'download',label:'Downloading the complete vehicle',completed:0,total:entry.bytes,detail:`0.0 / ${(entry.bytes/1e6).toFixed(1)} MB`});
  let response;
  try{response=await request((import.meta.env?.BASE_URL||'/')+entry.url.replace(/^\//,''),{signal});}catch(error){checkAbort(signal);throw new Error('The complete vehicle could not be downloaded. Check the connection and reload.',{cause:error});}
  compressed=await readCompressed(response,entry,signal,onProgress);
  const downloadMs=performance.now()-started,verifyStarted=performance.now();
  onProgress({phase:'verify',label:'Checking the vehicle download',completed:0,total:null});
  let verifyMethod=null,lastVerifyProgress=-Infinity;
  const digest=await hashBytesSha256(compressed,{signal,onProgress:state=>{
   verifyMethod=state.implementation;
   if(performance.now()-lastVerifyProgress<100&&state.completed!==state.total)return;
   lastVerifyProgress=performance.now();onProgress({phase:'verify',label:'Checking the vehicle download',completed:state.completed,total:state.total,detail:`${Math.round(100*state.completed/state.total)}%`});
  }});
  checkAbort(signal);if(digest!==entry.sha256)throw new Error('The complete vehicle download failed its integrity check. Reload to retry.');
  const verifyMs=performance.now()-verifyStarted,decodeStarted=performance.now();
  const stream=compressedStream(compressed,signal).pipeThrough(new DecompressionStream('gzip'));compressed=null;
  let lastProgress=-Infinity;
  model=await decode(stream,makeTexture,{signal,onProgress:state=>{
   if(performance.now()-lastProgress<100&&state.phase!=='complete')return;
   lastProgress=performance.now();onProgress({phase:'decode',label:'Preparing every vehicle component',completed:state.bytesConsumed,total:entry.decodedBytes,detail:`${state.meshesDecoded} / ${entry.meshes} meshes`,streaming:state});
  }});
  checkAbort(signal);
  let meshes=0,triangles=0;model.root.traverse(object=>{if(object.isMesh){meshes++;triangles+=(object.geometry.index?.count??object.geometry.attributes.position.count)/3;}});
  if(model.streamingStats.bytesConsumed!==entry.decodedBytes||model.groups.size!==entry.parts||meshes!==entry.meshes||triangles!==entry.triangles)throw new Error('The complete vehicle differs from its verified asset descriptor.');
  const decodeMs=performance.now()-decodeStarted,configureStarted=performance.now();
  Object.assign(model,vehicleConfiguration(model.groups));
  model.delivery='prebuilt-native-stream';
  model.deliveryStats={url:entry.url,compressedBytes:entry.bytes,decodedBytes:entry.decodedBytes,downloadMs,verifyMs,verifyMethod,decodeMs,configureMs:performance.now()-configureStarted,durationMs:performance.now()-started,streaming:model.streamingStats};
  onProgress({phase:'complete',label:'Complete vehicle ready',completed:entry.meshes,total:entry.meshes});checkAbort(signal);
  return model;
 }catch(error){
  if(model)disposeModel(model);
  if(error&&typeof error==='object'&&error.name!=='AbortError')error.workshopLoad=true;
  throw error;
 }finally{compressed=null;}
}
