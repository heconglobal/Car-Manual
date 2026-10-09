import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import * as T from 'three';
import {encodeModel} from '../src/model-codec.js';
import {packAttribute} from '../src/model-buffer-codec.js';
import {decodeNativeModelStream} from '../src/stream-native-model.js';
import {loadVehicleAsset} from '../src/vehicle-asset-loader.js';
import {disposeModel} from '../src/model-resources.js';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(){
 const root=new T.Group(),group=new T.Group();group.name='nose';group.userData={partId:'nose',system:'body',spread:new T.Vector3(0,1,-.65)};root.add(group);
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(new Float32Array([0,0,0,1,0,0,0,1,0]),3));geometry.setIndex([0,1,2]);
 const material=new T.MeshStandardMaterial({color:'#a80912',polygonOffset:true,polygonOffsetFactor:-1}),mesh=new T.Mesh(geometry,material);
 mesh.userData={partId:'nose',materialName:'red',option:'powerWindows',value:false,original:{color:material.color.clone(),emissive:material.emissive.clone()}};group.add(mesh);
 const model={root,groups:new Map([['nose',group]])},native=encodeModel(model),length=new DataView(native.buffer).getUint32(8,true),end=12+length,start=end+(4-end%4)%4;
 const metadata=JSON.parse(new TextDecoder().decode(native.subarray(12,end))),data=native.slice(start),types={Float32Array,Uint16Array,Uint32Array};
 for(const g of metadata.groups)for(const m of g.meshes)for(const a of [...Object.values(m.attributes),m.index].filter(Boolean)){const values=new types[a.type](native.buffer,start+a.offset,a.length);data.set(packAttribute(values,a.itemSize),a.offset);a.packing='delta-byte-plane';}
 const json=new TextEncoder().encode(JSON.stringify(metadata)),offset=12+json.length,padding=(4-offset%4)%4,packed=new Uint8Array(offset+padding+data.length);
 packed.set(new TextEncoder().encode('FIEROV01'));new DataView(packed.buffer).setUint32(8,json.length,true);packed.set(json,12);packed.set(data,offset+padding);disposeModel(model);
 const compressed=gzipSync(packed),entry={format:1,precision:'native',compression:'gzip',packing:'delta-byte-plane',url:'/models/fixture.fiero',bytes:compressed.length,sha256:hash(compressed),decodedBytes:packed.length,decodedSha256:hash(packed),parts:1,meshes:1,triangles:1,validation:{nativeRoundTrip:true,exactPartBounds:true,nativeProperties:true}};
 return {compressed,entry};
}
const asset=fixture();
function response(bytes=asset.compressed,headers={},status=200){let offset=0;return new Response(new ReadableStream({pull(controller){if(offset===bytes.length){controller.close();return;}const end=Math.min(offset+17,bytes.length);controller.enqueue(bytes.subarray(offset,end));offset=end;}}),{status,headers});}
const run=(name,fn)=>test(name,{concurrency:false},fn);

await run('Verified compressed bytes stream into a configurable native model',async()=>{
 const progress=[],model=await loadVehicleAsset({entry:asset.entry,request:async()=>response(),onProgress:p=>progress.push(p)}),mesh=model.groups.get('nose').children[0];
 assert.equal(model.delivery,'prebuilt-native-stream');assert.equal(model.streamingStats.bytesConsumed,asset.entry.decodedBytes);assert.equal(model.deliveryStats.compressedBytes,asset.entry.bytes);
 assert.equal(model.deliveryStats.verifyMethod,'native');
 assert(progress.some(p=>p.phase==='download'&&p.completed===asset.entry.bytes));assert(progress.some(p=>p.phase==='decode'));assert.equal(progress.at(-1).phase,'complete');
 assert.equal(mesh.material.polygonOffset,true);assert.equal(mesh.material.polygonOffsetFactor,-1);assert.equal(mesh.visible,true);
 const positions=mesh.geometry.attributes.position.array.slice();model.configure({paint:'gray',powerWindows:true});assert.equal(mesh.visible,false);assert.equal(mesh.material.metalness,.72);assert.deepEqual(mesh.geometry.attributes.position.array,positions);assert.deepEqual(model.groups.get('nose').userData.spread.toArray(),[0,1,-.65]);
 model.configure({});assert.equal(mesh.visible,true);assert.equal(mesh.material.metalness,0);disposeModel(model);
});
await run('Integrity failure rejects before the decoder allocates resources',async()=>{
 let decoded=false;await assert.rejects(loadVehicleAsset({entry:{...asset.entry,sha256:'0'.repeat(64)},request:async()=>response(),decode:async()=>{decoded=true;}}),error=>error.workshopLoad&&/integrity/.test(error.message));assert.equal(decoded,false);
});
await run('HTTP failures and transformed or incomplete responses are explicit',async()=>{
 for(const [make,pattern]of [[()=>response(undefined,{},503),/downloaded/],[()=>response(undefined,{'content-encoding':'gzip'}),/transformed/],[()=>response(undefined,{'content-length':'1'}),/unexpected size/],[()=>response(asset.compressed.subarray(0,-1)),/interrupted/],[()=>response(new Uint8Array(asset.compressed.length+1)),/exceeds/]])await assert.rejects(loadVehicleAsset({entry:asset.entry,request:async()=>make()}),pattern);
});
await run('Unvalidated descriptors fail before downloading',async()=>{
 let requested=false;await assert.rejects(loadVehicleAsset({entry:{...asset.entry,validation:{nativeRoundTrip:true}},request:async()=>{requested=true;}}),/native validation/);assert.equal(requested,false);
});
await run('Rejected response headers cancel the unread download body',async()=>{
 let cancelled=false;const body=new ReadableStream({cancel(){cancelled=true;}});
 await assert.rejects(loadVehicleAsset({entry:asset.entry,request:async()=>new Response(body,{headers:{'content-length':'1'}})}),/unexpected size/);assert(cancelled);
});
await run('Abort cancels a pending compressed download without decoding',async()=>{
 const controller=new AbortController();let cancelled=false,decoded=false;
 const pending=loadVehicleAsset({entry:asset.entry,signal:controller.signal,request:async()=>new Response(new ReadableStream({cancel(){cancelled=true;}})),decode:async()=>{decoded=true;}});
 setTimeout(()=>controller.abort(),5);await assert.rejects(pending,{name:'AbortError'});assert(cancelled);assert.equal(decoded,false);
});
await run('Post-decode descriptor mismatch disposes the completed native model',async()=>{
 let model,geometryDisposed=false,materialDisposed=false;
 await assert.rejects(loadVehicleAsset({entry:{...asset.entry,meshes:2},request:async()=>response(),decode:async(...args)=>{model=await decodeNativeModelStream(...args);const mesh=model.groups.get('nose').children[0];mesh.geometry.addEventListener('dispose',()=>geometryDisposed=true);mesh.material.addEventListener('dispose',()=>materialDisposed=true);return model;}}),/verified asset descriptor/);
 assert(geometryDisposed&&materialDisposed);assert.equal(model.groups.size,0);assert.equal(model.root.children.length,0);
});
await run('Abort during streaming leaves no successful model or complete notification',async()=>{
 const controller=new AbortController();let complete=false;
 await assert.rejects(loadVehicleAsset({entry:asset.entry,request:async()=>response(),signal:controller.signal,onProgress:p=>{if(p.phase==='decode')controller.abort();if(p.phase==='complete')complete=true;}}),{name:'AbortError'});assert.equal(complete,false);
});
await run('Missing Web Crypto uses mandatory portable verification and still rejects tampering',async()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{value:{},configurable:true});
 try{
  const model=await loadVehicleAsset({entry:asset.entry,request:async()=>response()});assert.equal(model.deliveryStats.verifyMethod,'portable');assert.equal(model.groups.size,1);disposeModel(model);
  let decoded=false;await assert.rejects(loadVehicleAsset({entry:{...asset.entry,sha256:'0'.repeat(64)},request:async()=>response(),decode:async()=>{decoded=true;}}),/integrity/);assert.equal(decoded,false);
 }finally{if(previous)Object.defineProperty(globalThis,'crypto',previous);else delete globalThis.crypto;}
});
