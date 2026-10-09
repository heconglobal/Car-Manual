import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync,createGunzip} from 'node:zlib';
import {Readable} from 'node:stream';
import {dirname,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {preserveFiles} from './preserve-files.mjs';
import {packNativeContainer,restoredNativeIdentity,sha256} from './native-model-packing.mjs';
import {auditNativeDelivery} from './audit-native-delivery.mjs';
import {encodeModel} from '../src/model-codec.js';
import {decodeNativeModelStream} from '../src/stream-native-model.js';
import {vehicleConfiguration} from '../src/vehicle-state.js';
import {textureFromRecipe} from '../src/materials.js';
import {disposeModel} from '../src/model-resources.js';

const descriptor='src/vehicle-manifest.js';
export async function vehicleInputs(){
 const files=new Set(['package-lock.json','scripts/build-vehicle.mjs']);
 async function visit(file){
  if(files.has(file))return;files.add(file);
  const source=await readFile(file,'utf8');
  for(const match of source.matchAll(/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g)){
   const target=relative(process.cwd(),resolve(dirname(file),match[1]));
   if(!/^(src|scripts)\//.test(target))throw Error('Unexpected native vehicle dependency: '+target);
   await visit(target);
  }
 }
 for(const file of ['src/model.js','src/model-codec.js','src/stream-native-model.js','src/vehicle-state.js','src/model-resources.js','scripts/native-model-packing.mjs','scripts/audit-native-delivery.mjs'])await visit(file);
 const sorted=[...files].sort(),hash=createHash('sha256');for(const file of sorted)hash.update(file+'\0').update(await readFile(file)).update('\0');
 return{files:sorted,sha256:hash.digest('hex')};
}
export async function ensureVehicleAsset(){
 const inputs=await vehicleInputs();let previous;
 try{const source=await readFile(descriptor,'utf8');previous=JSON.parse(source.slice(source.indexOf('{'),source.lastIndexOf('}')+1));}catch{}
 if(previous?.inputsSha256===inputs.sha256){
  try{const bytes=await readFile('public'+previous.url);if(bytes.length===previous.bytes&&sha256(bytes)===previous.sha256){console.log('Full native vehicle asset is current');return previous;}}catch{}
 }
 const originalDocument=globalThis.document;
 globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
 const started=performance.now(),startedAt=new Date().toISOString();let native,decoded;
 try{
  const {createVehicle}=await import('../src/model.js');
  native=createVehicle();const constructionMs=performance.now()-started;
  console.log('Native vehicle constructed in '+Math.round(constructionMs)+' ms; validating delivery');
  const raw=encodeModel(native,{compact:false}),nativeSha256=sha256(raw),packed=packNativeContainer(raw);
  assert.deepEqual(restoredNativeIdentity(packed),{sha256:nativeSha256,bytes:raw.length},'Packed vehicle must restore every native byte');
  const compressed=gzipSync(packed,{level:6}),hash=sha256(compressed),decodeStarted=performance.now();
  const gunzip=Readable.from([compressed]).pipe(createGunzip());
  const stream=Readable.toWeb(gunzip,{strategy:{highWaterMark:65536,size:chunk=>chunk.byteLength}});
  decoded=await decodeNativeModelStream(stream,textureFromRecipe);
  const decodingMs=performance.now()-decodeStarted;
  assert.equal(decoded.streamingStats.bytesConsumed,packed.length,'Stream must consume exactly the packed vehicle');
  assert.equal(sha256(encodeModel(decoded,{compact:false})),nativeSha256,'Stream decoder must restore native bytes');
  Object.assign(decoded,vehicleConfiguration(decoded.groups));
  const independent=await auditNativeDelivery(native,decoded);
  assert.equal(independent.nativeProperties,true);assert.equal(independent.exactPartBounds,true);
  let meshes=0,triangles=0;for(const group of native.groups.values())group.traverse(mesh=>{if(mesh.isMesh){meshes++;triangles+=(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3;}});
  assert.equal((await vehicleInputs()).sha256,inputs.sha256,'Vehicle generator inputs changed during generation');
  const manifest={format:1,precision:'native',compression:'gzip',packing:'delta-byte-plane',url:'/models/vehicle-'+hash.slice(0,24)+'.fiero',bytes:compressed.length,sha256:hash,decodedBytes:packed.length,decodedSha256:sha256(packed),nativeBytes:raw.length,nativeSha256,inputsSha256:inputs.sha256,parts:native.groups.size,meshes,triangles,generatedAt:new Date().toISOString(),validation:{nativeRoundTrip:true,exactPartBounds:true,nativeProperties:true,configurationCases:independent.configurationCases},timings:{constructionMs,decodingMs,totalMs:performance.now()-started}};
  await mkdir('public/models',{recursive:true});let exists=false;try{await stat('public'+manifest.url);exists=true;}catch{}
  if(!exists)await writeFile('public'+manifest.url,compressed,{flag:'wx'});else assert.equal(sha256(await readFile('public'+manifest.url)),hash,'Existing content-addressed vehicle differs; retained without overwrite');
  const folder='artifacts/vehicle-generation/'+startedAt.replaceAll(':','-');await mkdir(folder,{recursive:true});
  await writeFile(folder+'/validation.json',JSON.stringify({status:'passed',startedAt,inputs,manifest,independent,streaming:decoded.streamingStats,limits:'Authored native delivery equivalence, not measured factory geometry or physical vehicle validation.'},null,2)+'\n',{flag:'wx'});
  await preserveFiles([descriptor],'before-vehicle-regeneration');
  await writeFile(descriptor,'// Generated by scripts/build-vehicle.mjs; previous assets remain preserved.\nexport default '+JSON.stringify(manifest,null,2)+';\n');
  console.log(JSON.stringify({manifest,report:folder+'/validation.json'},null,2));return manifest;
 }finally{if(native)disposeModel(native);if(decoded)disposeModel(decoded);if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await ensureVehicleAsset();
