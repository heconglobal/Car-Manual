import * as T from 'three';
import {packAttribute,unpackAttribute} from './model-buffer-codec.js';
const magic='FIEROV01',arrayTypes={Float32Array,Uint32Array,Uint16Array,Uint8Array,Int16Array,Int8Array};
const scalars=['opacity','transparent','side','metalness','roughness','emissiveIntensity','depthWrite','depthTest','alphaTest','toneMapped','wireframe','clearcoat','clearcoatRoughness','transmission','thickness','ior','attenuationDistance','envMapIntensity','reflectivity','bumpScale','flatShading','forceSinglePass','vertexColors'];
const colors=['color','emissive','attenuationColor'];
function userData(data){const result={...data};for(const key of ['spread','assemblySpread'])if(data[key])result[key]=data[key].toArray();if(data.original)result.original={...data.original,color:data.original.color.toArray(),emissive:data.original.emissive.toArray()};return result;}
function restoreData(data){const result={...data};for(const key of ['spread','assemblySpread'])if(data[key])result[key]=new T.Vector3().fromArray(data[key]);if(data.original)result.original={...data.original,color:new T.Color().fromArray(data.original.color),emissive:new T.Color().fromArray(data.original.emissive)};return result;}

// Compact typed buffers retain every overview vertex and part identity. This is
// a local build artifact format, not a simplifier or a replacement for sources.
export function encodeModel(model,{compact=false}={}){
 const blocks=[],materials=[],textures=[],materialIndex=new Map(),textureIndex=new Map();let length=0;
 function attribute(a,key){
  let quantization=null;
  if(compact&&key==='position'){const min=Array(a.itemSize).fill(Infinity),max=Array(a.itemSize).fill(-Infinity);for(let i=0;i<a.array.length;i++){const k=i%a.itemSize;min[k]=Math.min(min[k],a.array[i]);max[k]=Math.max(max[k],a.array[i]);}const values=Uint16Array.from(a.array,(v,i)=>{const k=i%a.itemSize;return max[k]===min[k]?0:Math.round((v-min[k])/(max[k]-min[k])*65535);});quantization={min,max};a=new T.BufferAttribute(values,a.itemSize);}
  else if(compact&&key==='normal')a=new T.BufferAttribute(Int16Array.from(a.array,v=>Math.round(Math.max(-1,Math.min(1,v))*32767)),a.itemSize,true);
  else if(compact&&key==='uv'&&a.array.every(v=>v>=0&&v<=1))a=new T.BufferAttribute(Uint16Array.from(a.array,v=>Math.round(v*65535)),a.itemSize,true);
  if(a.isInterleavedBufferAttribute||!arrayTypes[a.array.constructor.name])throw Error('Unsupported overview buffer');
  const padding=(4-length%4)%4;if(padding){blocks.push(new Uint8Array(padding));length+=padding;}
  const data=compact?packAttribute(a.array,a.itemSize):new Uint8Array(a.array.buffer,a.array.byteOffset,a.array.byteLength),entry={offset:length,length:a.array.length,type:a.array.constructor.name,itemSize:a.itemSize,normalized:a.normalized,quantization,packing:compact?'delta-byte-plane':null};blocks.push(data);length+=data.byteLength;return entry;
 }
 function texture(t){
  if(!t.userData.recipe)throw Error('Overview texture has no procedural recipe');
  const entry={recipe:t.userData.recipe,repeat:t.repeat.toArray(),offset:t.offset.toArray(),wrapS:t.wrapS,wrapT:t.wrapT,colorSpace:t.colorSpace,anisotropy:t.anisotropy},key=JSON.stringify(entry);
  if(!textureIndex.has(key)){textureIndex.set(key,textures.length);textures.push(entry);}return textureIndex.get(key);
 }
 function material(m){
  if(Array.isArray(m)||!['MeshStandardMaterial','MeshPhysicalMaterial'].includes(m?.type))throw Error('Unsupported model material');
  if(materialIndex.has(m))return materialIndex.get(m);const entry={type:m.type,properties:{},textures:{}};
  for(const key of scalars)if(m[key]!==undefined&&Number.isFinite(m[key])||typeof m[key]==='boolean')entry.properties[key]=m[key];
  // Native label surfaces use depth bias to avoid z-fighting. Retain the
  // complete setting when nondefault, while old default-only payloads keep
  // their exact encoding when decoded and encoded again.
  if(m.polygonOffset||m.polygonOffsetFactor!==0||m.polygonOffsetUnits!==0){
   entry.properties.polygonOffset=m.polygonOffset;
   entry.properties.polygonOffsetFactor=m.polygonOffsetFactor;
   entry.properties.polygonOffsetUnits=m.polygonOffsetUnits;
  }
  for(const key of colors)if(m[key])entry.properties[key]=m[key].toArray();
  for(const [key,value] of Object.entries(m))if(value?.isTexture)entry.textures[key]=texture(value);
  const index=materials.length;materials.push(entry);materialIndex.set(m,index);return index;
 }
 const groups=[];
 model.root.updateMatrix();if(!model.root.matrix.equals(new T.Matrix4()))throw Error('Model root transform must be identity');
 for(const [id,g] of model.groups){
  if(g.parent!==model.root)throw Error('Model groups must be direct root children');
  const meshes=[];g.traverse(o=>{if(o===g)return;if(!o.isMesh||o.isSkinnedMesh||o.parent!==g)throw Error('Model meshes must be direct children');
   if(Object.keys(o.geometry.morphAttributes).length)throw Error('Unsupported model morph attributes');
   const attributes=Object.fromEntries(Object.entries(o.geometry.attributes).map(([key,a])=>[key,attribute(a,key)]));
   meshes.push({attributes,index:o.geometry.index?attribute(o.geometry.index):null,geometryGroups:o.geometry.groups.map(group=>({...group})),drawRange:{...o.geometry.drawRange},material:material(o.material),userData:userData(o.userData),position:o.position.toArray(),quaternion:o.quaternion.toArray(),scale:o.scale.toArray(),visible:o.visible,castShadow:o.castShadow,receiveShadow:o.receiveShadow});
  });groups.push({id,userData:userData(g.userData),position:g.position.toArray(),quaternion:g.quaternion.toArray(),scale:g.scale.toArray(),visible:g.visible,meshes});
 }
 const meta=new TextEncoder().encode(JSON.stringify({version:1,groups,materials,textures})),start=12+meta.byteLength,padding=(4-start%4)%4,output=new Uint8Array(start+padding+length);
 output.set(new TextEncoder().encode(magic));new DataView(output.buffer).setUint32(8,meta.byteLength,true);output.set(meta,12);let offset=start+padding;for(const block of blocks){output.set(block,offset);offset+=block.byteLength;}return output;
}
export function decodeModel(bytes,makeTexture){
 const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
 if(new TextDecoder().decode(data.subarray(0,8))!==magic)throw Error('Unsupported overview asset');
 const metaLength=new DataView(data.buffer,data.byteOffset,data.byteLength).getUint32(8,true),end=12+metaLength;
 if(end>data.byteLength)throw Error('Truncated overview metadata');const meta=JSON.parse(new TextDecoder().decode(data.subarray(12,end))),start=end+(4-end%4)%4;
 if(meta.version!==1)throw Error('Unsupported overview version');
 const textures=meta.textures.map(entry=>{const t=makeTexture(entry.recipe);t.repeat.fromArray(entry.repeat);t.offset.fromArray(entry.offset);Object.assign(t,{wrapS:entry.wrapS,wrapT:entry.wrapT,colorSpace:entry.colorSpace,anisotropy:entry.anisotropy});t.needsUpdate=true;return t;});
 const materials=meta.materials.map(entry=>{const C=entry.type==='MeshPhysicalMaterial'?T.MeshPhysicalMaterial:T.MeshStandardMaterial,m=new C();for(const [key,value]of Object.entries(entry.properties)){if(key==='reflectivity'&&entry.properties.ior!==undefined)continue; // Physical reflectivity is derived from IOR; its setter would round the original IOR.
 if(colors.includes(key))m[key].fromArray(value);else m[key]=value;}for(const [key,index]of Object.entries(entry.textures))m[key]=textures[index];return m;});
 function attribute(entry){const C=arrayTypes[entry.type];if(!C||entry.offset<0||entry.length<0||start+entry.offset+entry.length*C.BYTES_PER_ELEMENT>data.byteLength)throw Error('Invalid overview buffer');if(entry.packing&&entry.packing!=='delta-byte-plane')throw Error('Unsupported overview packing');const values=entry.packing?unpackAttribute(data.subarray(start+entry.offset,start+entry.offset+entry.length*C.BYTES_PER_ELEMENT),C,entry.itemSize):new C(data.buffer,data.byteOffset+start+entry.offset,entry.length);if(entry.quantization){const {min,max}=entry.quantization;return new T.BufferAttribute(Float32Array.from(values,(v,i)=>{const k=i%entry.itemSize;return min[k]+v/65535*(max[k]-min[k]);}),entry.itemSize);}return new T.BufferAttribute(values,entry.itemSize,entry.normalized);}
 const root=new T.Group(),groups=new Map();
 for(const entry of meta.groups){const g=new T.Group();g.name=entry.id;g.userData=restoreData(entry.userData);if(entry.position)g.position.fromArray(entry.position);if(entry.quaternion)g.quaternion.fromArray(entry.quaternion);if(entry.scale)g.scale.fromArray(entry.scale);g.visible=entry.visible??true;root.add(g);groups.set(entry.id,g);
  for(const mesh of entry.meshes){const geometry=new T.BufferGeometry();for(const [key,a]of Object.entries(mesh.attributes))geometry.setAttribute(key,attribute(a));if(mesh.index)geometry.setIndex(attribute(mesh.index));for(const group of mesh.geometryGroups||[])geometry.addGroup(group.start,group.count,group.materialIndex);if(mesh.drawRange)geometry.setDrawRange(mesh.drawRange.start,mesh.drawRange.count??Infinity);geometry.computeBoundingBox();geometry.computeBoundingSphere();const m=new T.Mesh(geometry,materials[mesh.material]);m.userData=restoreData(mesh.userData);m.position.fromArray(mesh.position);m.quaternion.fromArray(mesh.quaternion);m.scale.fromArray(mesh.scale);Object.assign(m,{visible:mesh.visible,castShadow:mesh.castShadow,receiveShadow:mesh.receiveShadow});g.add(m);}
 }
 return {root,groups};
}
