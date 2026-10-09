// Lossless native geometry delivery. Input is an already-decompressed, bounded-
// chunk ReadableStream; never retain the complete inflated transport.
// onProgress is synchronous; this decoder owns cooperative asynchronous yields.
// The caller verifies compressed integrity and owns disposal after success.
import * as T from 'three';
import {unpackAttribute} from './model-buffer-codec.js';

const types={Float32Array,Uint32Array,Uint16Array,Uint8Array,Int16Array,Int8Array};
const colors=new Set(['color','emissive','attenuationColor']);
const nextTask=()=>globalThis.scheduler?.yield?globalThis.scheduler.yield():new Promise(resolve=>setTimeout(resolve,0));
const fail=message=>{throw new Error(message);};
const integer=(value,min=0)=>Number.isSafeInteger(value)&&value>=min;
const vector=(value,length)=>Array.isArray(value)&&value.length===length&&value.every(Number.isFinite);
function restoreData(data){
 const result={...data};
 for(const key of ['spread','assemblySpread'])if(data[key])result[key]=new T.Vector3().fromArray(data[key]);
 if(data.original)result.original={...data.original,color:new T.Color().fromArray(data.original.color),emissive:new T.Color().fromArray(data.original.emissive)};
 return result;
}

export async function decodeNativeModelStream(stream,makeTexture,{
 signal,onProgress=()=>{},yieldTask=nextTask,yieldIntervalMs=8,
 maxMetadataBytes=16*1024*1024,maxAttributeBytes=32*1024*1024,
 maxStreamChunkBytes=1024*1024,
}={}){
 if(!stream?.getReader||typeof makeTexture!=='function')fail('A readable byte stream and texture factory are required');
 if(!Number.isFinite(yieldIntervalMs)||yieldIntervalMs<0)fail('Invalid yield interval');
 for(const limit of [maxMetadataBytes,maxAttributeBytes,maxStreamChunkBytes])if(!integer(limit,1))fail('Invalid streaming limit');
 const reader=stream.getReader(),root=new T.Group(),groups=new Map();
 const owned={geometries:[],materials:[],textures:[]};
 const stats={bytesConsumed:0,chunksRead:0,maxChunkBytes:0,maxPackedAttributeBytes:0,
  totalAttributeBytes:0,attributesDecoded:0,meshesDecoded:0,groupsDecoded:0,yields:0,
  maxUnpackMs:0,maxBoundsMs:0,maxSyncSliceMs:0,
  created:{geometries:0,materials:0,textures:0},disposed:{geometries:0,materials:0,textures:0}};
 const started=performance.now();let lastYield=started,pending=null,pendingOffset=0,cancelled=false;
 const snapshot=()=>({...stats,created:{...stats.created},disposed:{...stats.disposed},elapsedMs:performance.now()-started});
 const check=()=>{if(signal?.aborted)throw signal.reason instanceof Error?signal.reason:new DOMException('Model decoding aborted','AbortError');};
 const cancel=async reason=>{if(cancelled)return;cancelled=true;try{await reader.cancel(reason);}catch{/* Keep the original decoding error. */}};
 const aborted=()=>{void cancel(signal.reason);};
 signal?.addEventListener('abort',aborted,{once:true});
 async function checkpoint(phase,force=false){
  check();const elapsed=performance.now()-lastYield;
  if(force||elapsed>=yieldIntervalMs){
   stats.maxSyncSliceMs=Math.max(stats.maxSyncSliceMs,elapsed);
   onProgress({phase,...snapshot()});check();stats.yields++;
   await yieldTask();check();lastYield=performance.now();
  }
 }
 async function take(length){
  check();const out=new Uint8Array(length);let filled=0;
  while(filled<length){
   if(!pending){
    const result=await reader.read();check();
    if(result.done)fail('Truncated native model stream');
    if(!(result.value instanceof Uint8Array))fail('Native model stream must contain Uint8Array chunks');
    if(result.value.byteLength>maxStreamChunkBytes)fail('Native model stream chunk exceeds configured limit');
    if(!result.value.byteLength)continue;
    pending=result.value;pendingOffset=0;stats.chunksRead++;stats.maxChunkBytes=Math.max(stats.maxChunkBytes,pending.length);
   }
   const count=Math.min(length-filled,pending.length-pendingOffset);
   out.set(pending.subarray(pendingOffset,pendingOffset+count),filled);filled+=count;pendingOffset+=count;stats.bytesConsumed+=count;
   if(pendingOffset===pending.length){pending=null;pendingOffset=0;}
   await checkpoint('reading');
  }
  return out;
 }
 async function padding(length){if(length&&(await take(length)).some(value=>value!==0))fail('Nonzero native model padding');}
 const own=(kind,item)=>{owned[kind].push(item);stats.created[kind]++;return item;};
 function validateMetadata(meta){
  if(meta.version!==1||!Array.isArray(meta.groups)||!Array.isArray(meta.materials)||!Array.isArray(meta.textures))fail('Unsupported native model metadata');
  const ids=new Set();let cursor=0;
  function entry(a,index=false){
   const Type=types[a?.type];
   if(!Type||!integer(a.offset)||!integer(a.length)||!integer(a.itemSize,1)||a.length%a.itemSize||typeof a.normalized!=='boolean')fail('Invalid native model attribute');
   if(a.quantization!=null)fail('Quantization is forbidden in the native streaming decoder');
   if(a.packing!==null&&a.packing!==undefined&&a.packing!=='delta-byte-plane')fail('Unsupported native model packing');
   if(index&&(a.itemSize!==1||!['Uint8Array','Uint16Array','Uint32Array'].includes(a.type)))fail('Unsupported native model index');
   const bytes=a.length*Type.BYTES_PER_ELEMENT;
   if(!integer(bytes)||bytes>maxAttributeBytes)fail('Native model attribute exceeds configured limit');
   const expected=cursor+(4-cursor%4)%4;
   if(a.offset!==expected)fail('Unsupported native model layout: attributes must follow declared order without overlap');
   cursor=expected+bytes;if(!Number.isSafeInteger(cursor))fail('Native model layout is too large');
  }
  for(const g of meta.groups){
   if(typeof g.id!=='string'||ids.has(g.id)||!Array.isArray(g.meshes)||!g.userData)fail('Invalid native model group');ids.add(g.id);
   for(const [key,n]of [['position',3],['quaternion',4],['scale',3]])if(g[key]&&!vector(g[key],n))fail('Invalid native group transform');
   for(const m of g.meshes){
    if(!m.attributes||!m.attributes.position||!m.userData||!integer(m.material)||m.material>=meta.materials.length)fail('Invalid native model mesh');
    for(const [key,n]of [['position',3],['quaternion',4],['scale',3]])if(!vector(m[key],n))fail('Invalid native mesh transform');
    for(const a of Object.values(m.attributes))entry(a);if(m.index)entry(m.index,true);
    for(const range of m.geometryGroups||[])if(!integer(range.start)||!integer(range.count)||!integer(range.materialIndex))fail('Invalid native geometry group');
    if(m.drawRange&&(!integer(m.drawRange.start)||(m.drawRange.count!==null&&!integer(m.drawRange.count))))fail('Invalid native draw range');
   }
  }
  for(const m of meta.materials){
   if(!['MeshStandardMaterial','MeshPhysicalMaterial'].includes(m.type)||!m.properties||!m.textures)fail('Unsupported native material');
   for(const [key,value]of Object.entries(m.properties))if(colors.has(key)&&!vector(value,3))fail('Invalid native material color');
   for(const index of Object.values(m.textures))if(!integer(index)||index>=meta.textures.length)fail('Invalid native material texture reference');
  }
  for(const t of meta.textures)if(!t.recipe||!vector(t.repeat,2)||!vector(t.offset,2))fail('Invalid native texture metadata');
  return cursor;
 }
 try{
  check();const header=await take(12);
  if(new TextDecoder().decode(header.subarray(0,8))!=='FIEROV01')fail('Unsupported native model stream');
  const metadataBytes=new DataView(header.buffer).getUint32(8,true);
  if(!metadataBytes||metadataBytes>maxMetadataBytes)fail('Native model metadata exceeds configured limit');
  const meta=JSON.parse(new TextDecoder().decode(await take(metadataBytes)));
  await padding((4-(12+metadataBytes)%4)%4);
  const totalDataBytes=validateMetadata(meta);stats.expectedDataBytes=totalDataBytes;stats.metadataBytes=metadataBytes;
  await checkpoint('metadata',true);
  for(const entry of meta.textures){
   const t=own('textures',makeTexture(entry.recipe));
   t.repeat.fromArray(entry.repeat);t.offset.fromArray(entry.offset);
   Object.assign(t,{wrapS:entry.wrapS,wrapT:entry.wrapT,colorSpace:entry.colorSpace,anisotropy:entry.anisotropy});t.needsUpdate=true;
   await checkpoint('textures');
  }
  for(const entry of meta.materials){
   const C=entry.type==='MeshPhysicalMaterial'?T.MeshPhysicalMaterial:T.MeshStandardMaterial,m=own('materials',new C());
   for(const [key,value]of Object.entries(entry.properties)){
    if(key==='reflectivity'&&entry.properties.ior!==undefined)continue;
    if(colors.has(key))m[key].fromArray(value);else m[key]=value;
   }
   for(const [key,index]of Object.entries(entry.textures))m[key]=owned.textures[index];
   await checkpoint('materials');
  }
  let cursor=0;
  async function attribute(entry){
   await padding(entry.offset-cursor);const Type=types[entry.type],size=entry.length*Type.BYTES_PER_ELEMENT;
   const packed=await take(size),begin=performance.now();
   const values=entry.packing?unpackAttribute(packed,Type,entry.itemSize):new Type(packed.buffer);
   stats.maxUnpackMs=Math.max(stats.maxUnpackMs,performance.now()-begin);stats.maxPackedAttributeBytes=Math.max(stats.maxPackedAttributeBytes,size);
   stats.totalAttributeBytes+=size;stats.attributesDecoded++;cursor=entry.offset+size;
   return new T.BufferAttribute(values,entry.itemSize,entry.normalized);
  }
  for(const entry of meta.groups){
   const g=new T.Group();g.name=entry.id;g.userData=restoreData(entry.userData);
   if(entry.position)g.position.fromArray(entry.position);if(entry.quaternion)g.quaternion.fromArray(entry.quaternion);if(entry.scale)g.scale.fromArray(entry.scale);
   g.visible=entry.visible??true;root.add(g);groups.set(entry.id,g);
   for(const mesh of entry.meshes){
    check();const geometry=own('geometries',new T.BufferGeometry());
    for(const [key,a]of Object.entries(mesh.attributes)){geometry.setAttribute(key,await attribute(a));await checkpoint('attributes');}
    if(mesh.index){geometry.setIndex(await attribute(mesh.index));await checkpoint('attributes');}
    for(const group of mesh.geometryGroups||[])geometry.addGroup(group.start,group.count,group.materialIndex);
    if(mesh.drawRange)geometry.setDrawRange(mesh.drawRange.start,mesh.drawRange.count??Infinity);
    const boundsStarted=performance.now();geometry.computeBoundingBox();geometry.computeBoundingSphere();stats.maxBoundsMs=Math.max(stats.maxBoundsMs,performance.now()-boundsStarted);
    const m=new T.Mesh(geometry,owned.materials[mesh.material]);m.userData=restoreData(mesh.userData);
    m.position.fromArray(mesh.position);m.quaternion.fromArray(mesh.quaternion);m.scale.fromArray(mesh.scale);
    Object.assign(m,{visible:mesh.visible,castShadow:mesh.castShadow,receiveShadow:mesh.receiveShadow});g.add(m);stats.meshesDecoded++;
    await checkpoint('meshes');
   }
   stats.groupsDecoded++;await checkpoint('groups');
  }
  if(cursor!==totalDataBytes)fail('Native model data length differs from declared layout');
  if(pending)fail('Unexpected trailing native model bytes');
  while(true){const end=await reader.read();check();if(end.done)break;if(!(end.value instanceof Uint8Array)||end.value.byteLength)fail('Unexpected trailing native model bytes');}
  await checkpoint('complete',true);
  return {root,groups,streamingStats:snapshot()};
 }catch(error){
  for(const kind of ['geometries','materials','textures'])for(const item of owned[kind]){try{item.dispose();}catch{/* Cleanup remaining independent allocations. */}stats.disposed[kind]++;}
  root.clear();groups.clear();pending=null;await cancel(error);
  if(error&&typeof error==='object')try{error.streamingStats=snapshot();}catch{/* A caller may supply a frozen abort reason. */}
  throw error;
 }finally{signal?.removeEventListener('abort',aborted);reader.releaseLock();}
}
