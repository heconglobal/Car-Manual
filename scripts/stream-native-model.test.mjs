import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as T from 'three';
import {encodeModel,decodeModel} from '../src/model-codec.js';
import {packAttribute} from '../src/model-buffer-codec.js';
import {decodeNativeModelStream} from '../src/stream-native-model.js';

const types={Float32Array,Uint32Array,Uint16Array,Uint8Array,Int16Array,Int8Array};
const factory=recipe=>{const texture=new T.Texture();texture.userData.recipe=structuredClone(recipe);return texture;};
function fixture(){
 const texture=factory({kind:'fixture',meaning:'texture properties and material references'});texture.repeat.set(2,3);texture.offset.set(.25,.5);texture.wrapS=T.RepeatWrapping;texture.anisotropy=4;
 const material=new T.MeshPhysicalMaterial({color:'#ac1328',ior:1.52,transparent:true,opacity:.72,side:T.DoubleSide,roughness:.37,map:texture});
 const root=new T.Group(),groups=new Map();
 for(let i=0;i<2;i++){
  const g=new T.Group();g.name='owner-'+i;g.position.set(i,.25,0);g.rotation.z=.25;g.scale.set(1,1.5,1);g.visible=i===0;g.userData={spread:new T.Vector3(1,2,3),assemblySpread:new T.Vector3(3,2,1),marker:'group'};
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array([0,0,0,1,0,0,0,1,0]),3));
  const uv=new Float32Array(6);new Uint32Array(uv.buffer).set([0x80000000,0,0x7fc00001,0x7f800000,0x3f800000,0xff800000]);geo.setAttribute('uv',new T.BufferAttribute(uv,2));
  geo.setAttribute('color',new T.BufferAttribute(new Uint8Array([255,0,0,0,255,0,0,0,255]),3,true));geo.setIndex(new T.BufferAttribute(new Uint16Array([0,1,2]),1));geo.addGroup(0,3,0);geo.setDrawRange(0,3);
  const m=new T.Mesh(geo,material);m.position.set(0,i,0);m.rotation.x=.2;m.scale.set(1,.5,2);m.visible=i===0;m.castShadow=true;m.receiveShadow=false;
  m.userData={owner:g.name,original:{color:material.color.clone(),emissive:material.emissive.clone()},marker:'mesh'};g.add(m);root.add(g);groups.set(g.name,g);
 }
 return {root,groups};
}
function parse(bytes){const length=new DataView(bytes.buffer,bytes.byteOffset).getUint32(8,true),end=12+length;return {meta:JSON.parse(new TextDecoder().decode(bytes.subarray(12,end))),start:end+(4-end%4)%4};}
function container(meta,data){const metadata=new TextEncoder().encode(JSON.stringify(meta)),start=12+metadata.length,pad=(4-start%4)%4,bytes=new Uint8Array(start+pad+data.length);bytes.set(new TextEncoder().encode('FIEROV01'));new DataView(bytes.buffer).setUint32(8,metadata.length,true);bytes.set(metadata,12);bytes.set(data,start+pad);return bytes;}
function pack(bytes,change=()=>{}){const {meta,start}=parse(bytes),data=bytes.slice(start);for(const g of meta.groups)for(const m of g.meshes)for(const a of [...Object.values(m.attributes),m.index].filter(Boolean)){const C=types[a.type],values=new C(bytes.buffer,bytes.byteOffset+start+a.offset,a.length);data.set(packAttribute(values,a.itemSize),a.offset);a.packing='delta-byte-plane';}change(meta,data);return container(meta,data);}
function chunks(bytes,size,{errorAt=Infinity}={}){let offset=0,cancelled=false;const stream=new ReadableStream({pull(controller){if(offset>=errorAt){controller.error(new Error('upstream failed'));return;}if(offset>=bytes.length){controller.close();return;}const end=Math.min(offset+size,bytes.length,errorAt);controller.enqueue(bytes.slice(offset,end));offset=end;},cancel(){cancelled=true;}},{highWaterMark:1});return {stream,wasCancelled:()=>cancelled};}
function cleanup(model){const materials=new Set(),textures=new Set();model.root.traverse(m=>{if(!m.isMesh)return;m.geometry.dispose();materials.add(m.material);for(const value of Object.values(m.material))if(value?.isTexture)textures.add(value);});for(const m of materials)m.dispose();for(const t of textures)t.dispose();model.root.clear();model.groups.clear();}
async function run(name,fn){await test(name,{concurrency:false},fn);}
const original=fixture(),native=encodeModel(original,{compact:false}),packed=pack(native);cleanup(original);
for(const size of [1,3,13,65536])await run('Exact bytes across '+size+'-byte input boundaries',async()=>{
 const input=chunks(packed,size),streamed=await decodeNativeModelStream(input.stream,factory,{yieldIntervalMs:0,yieldTask:()=>Promise.resolve()});
 assert.deepEqual(encodeModel(streamed,{compact:false}),native);const regular=decodeModel(packed,factory);assert.deepEqual(encodeModel(streamed,{compact:false}),encodeModel(regular,{compact:false}));assert.equal(streamed.streamingStats.attributesDecoded,8);assert(!input.wasCancelled());cleanup(streamed);cleanup(regular);
});
await run('Explicit polygon-offset metadata matches regular decoder',async()=>{
 const bytes=pack(native,meta=>Object.assign(meta.materials[0].properties,{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:2}));
 const streamed=await decodeNativeModelStream(chunks(bytes,31).stream,factory),regular=decodeModel(bytes,factory);
 for(const key of ['polygonOffset','polygonOffsetFactor','polygonOffsetUnits'])assert.equal(streamed.groups.get('owner-0').children[0].material[key],regular.groups.get('owner-0').children[0].material[key]);
 assert.equal(streamed.groups.get('owner-0').children[0].material.polygonOffset,true);cleanup(streamed);cleanup(regular);
});
await run('Unpacked native arrays preserve independent exact backing stores',async()=>{
 const model=await decodeNativeModelStream(chunks(native,17).stream,factory);assert.deepEqual(encodeModel(model,{compact:false}),native);const buffers=[];model.root.traverse(m=>{if(m.isMesh)buffers.push(...Object.values(m.geometry.attributes).map(a=>a.array.buffer),m.geometry.index.array.buffer);});assert.equal(new Set(buffers).size,buffers.length);cleanup(model);
});
async function rejectsClean(bytes,pattern,options={}){
 const input=chunks(bytes,31),observed={geometries:0,materials:0,textures:0},restorers=[];
 for(const [kind,proto]of [['geometries',T.BufferGeometry.prototype],['materials',T.Material.prototype],['textures',T.Texture.prototype]]){const previous=proto.dispose;proto.dispose=function(...args){observed[kind]++;return previous.apply(this,args);};restorers.push(()=>{proto.dispose=previous;});}
 let error;try{await decodeNativeModelStream(input.stream,factory,options);}catch(caught){error=caught;}finally{for(const restore of restorers)restore();}
 assert(error,'Expected stream rejection');assert.match(error.message,pattern);assert.deepEqual(error.streamingStats.created,error.streamingStats.disposed);assert.deepEqual(observed,error.streamingStats.disposed);assert(!input.stream.locked);return {error,input};
}
await run('Truncated second mesh disposes completed and partial resources',async()=>{const {error}=await rejectsClean(packed.subarray(0,packed.length-7),/Truncated/);assert(error.streamingStats.created.geometries>=2);assert(error.streamingStats.created.materials>0);assert(error.streamingStats.created.textures>0);});
await run('Quantized input rejected before native allocations',async()=>{const {error}=await rejectsClean(pack(native,meta=>{meta.groups[0].meshes[0].attributes.position.quantization={min:[0,0,0],max:[1,1,1]};}),/Quantization/);assert.equal(error.streamingStats.created.geometries,0);});
await run('Overlapping or nonsequential attributes rejected',async()=>{await rejectsClean(pack(native,meta=>{meta.groups[0].meshes[0].attributes.uv.offset=0;}),/layout/);});
await run('Unsupported packing rejected',async()=>{await rejectsClean(pack(native,meta=>{meta.groups[0].meshes[0].index.packing='lossy-unknown';}),/packing/);});
await run('Attribute and stream chunk memory limits enforced',async()=>{await rejectsClean(packed,/attribute exceeds/,{maxAttributeBytes:8});await rejectsClean(packed,/chunk exceeds/,{maxStreamChunkBytes:8});});
await run('Trailing data rejects and cleans completed model',async()=>{const bytes=new Uint8Array(packed.length+1);bytes.set(packed);await rejectsClean(bytes,/trailing/);});
await run('Abort after first mesh cancels stream and disposes resources',async()=>{const controller=new AbortController();const {error,input}=await rejectsClean(packed,/stop after first mesh/,{signal:controller.signal,yieldIntervalMs:0,yieldTask:()=>Promise.resolve(),onProgress:p=>{if(p.meshesDecoded===1)controller.abort(new Error('stop after first mesh'));}});assert.equal(error.streamingStats.meshesDecoded,1);assert(input.wasCancelled());});
await run('Abort unblocks a pending read and releases stream lock',async()=>{const controller=new AbortController();let cancelled=false;const stream=new ReadableStream({cancel(){cancelled=true;}});const pending=decodeNativeModelStream(stream,factory,{signal:controller.signal});setTimeout(()=>controller.abort(),5);await assert.rejects(pending,{name:'AbortError'});assert(cancelled);assert(!stream.locked);});
await run('Upstream error cleans partial geometry',async()=>{const input=chunks(packed,31,{errorAt:packed.length-8});let error;try{await decodeNativeModelStream(input.stream,factory);}catch(e){error=e;}assert.match(error.message,/upstream failed/);assert.deepEqual(error.streamingStats.created,error.streamingStats.disposed);assert(error.streamingStats.created.geometries>=2);assert(!input.stream.locked);});
await run('Progress callback error also cleans owned allocations',async()=>{await rejectsClean(packed,/observer failed/,{yieldIntervalMs:0,yieldTask:()=>Promise.resolve(),onProgress:p=>{if(p.meshesDecoded===1)throw new Error('observer failed');}});});
