// Independent native-state oracle. Compare the original model BEFORE encoding
// with delivered geometry and behavior; a codec round trip alone can omit the
// same native property twice and still report success.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {defaultConfiguration,options,paints} from '../src/configuration.js';

const sha=value=>createHash('sha256').update(value).digest('hex');
const transient=new Set(['id','uuid','version','_listeners']);
function plain(value,path){
 if(value===undefined||typeof value==='function')return undefined;
 if(value===null||typeof value==='string'||typeof value==='boolean')return value;
 if(typeof value==='number')return Number.isFinite(value)?value:String(value);
 if(value.isColor||value.isVector2||value.isVector3||value.isVector4||value.isQuaternion||value.isEuler||value.isMatrix3||value.isMatrix4)return value.toArray();
 if(Array.isArray(value))return value.map((v,i)=>plain(v,path+'.'+i));
 if(Object.getPrototypeOf(value)===Object.prototype)return Object.fromEntries(Object.keys(value).sort().flatMap(key=>{const result=plain(value[key],path+'.'+key);return result===undefined?[]:[[key,result]];}));
 throw Error('Unsupported native render property '+path+': '+(value.constructor?.name||typeof value));
}
function textureProperties(texture){
 const result={};
 for(const key of Object.keys(texture).sort()){
  if(transient.has(key)||['source','image'].includes(key))continue;
  const value=plain(texture[key],'texture.'+key);if(value!==undefined)result[key]=value;
 }
 // Recipes describe the actual procedural pixels; the offline canvas is a
 // stub. Preserve image dimensions, but do not mistake stub pixels for a
 // rendered-image comparison. Identical texture instances may be deduplicated.
 const image=texture.image;result.imageSize=image?{width:image.width??null,height:image.height??null,depth:image.depth??null}:null;
 assert(texture.userData?.recipe,'Native delivery texture must have a procedural recipe');
 return result;
}
function materialProperties(material,textureCache){
 assert(!Array.isArray(material),'Material-array delivery is unsupported');
 const result={};
 for(const key of Object.keys(material).sort()){
  if(transient.has(key))continue;const value=material[key];
  if(value?.isTexture){if(!textureCache.has(value))textureCache.set(value,textureProperties(value));result[key]=textureCache.get(value);continue;}
  const normalized=plain(value,'material.'+key);if(normalized!==undefined)result[key]=normalized;
 }
 return result;
}
const transform=node=>({position:node.position.toArray(),quaternion:node.quaternion.toArray(),scale:node.scale.toArray(),matrix:node.matrix.toArray(),matrixWorld:node.matrixWorld.toArray(),matrixAutoUpdate:node.matrixAutoUpdate,matrixWorldAutoUpdate:node.matrixWorldAutoUpdate});
function renderProperties(node){
 const userData=Object.fromEntries(Object.entries(node.userData).filter(([key])=>!['surfaceMaterial','ghostMaterial'].includes(key)));
 return {name:node.name,visible:node.visible,castShadow:node.castShadow,receiveShadow:node.receiveShadow,frustumCulled:node.frustumCulled,renderOrder:node.renderOrder,layers:node.layers.mask,userData:plain(userData,'object.userData'),transform:transform(node)};
}
const boxData=box=>box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()};
export function captureNativeProperties(model){
 model.root.updateMatrixWorld(true);const materials=new Map(),textures=new Map();
 const material=object=>{if(!materials.has(object))materials.set(object,materialProperties(object,textures));return materials.get(object);};
 return {configuration:model.getConfiguration?.()??null,root:renderProperties(model.root),groups:[...model.groups].map(([id,group])=>{
  assert.equal(group.parent,model.root,'Native delivery groups must be direct root children');const bounds=new T.Box3(),visibleBounds=new T.Box3(),meshes=[];
  for(const mesh of group.children){
   assert(mesh.isMesh&&!mesh.isSkinnedMesh,'Native delivery meshes must be direct children');assert.equal(mesh.children.length,0,'Nested mesh children are not supported');
   if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);bounds.union(box);if(model.root.visible&&group.visible&&mesh.visible)visibleBounds.union(box);
   meshes.push({...renderProperties(mesh),material:material(mesh.material),surfaceMaterial:mesh.userData.surfaceMaterial?material(mesh.userData.surfaceMaterial):null});
  }
  return {id,...renderProperties(group),bounds:boxData(bounds),visibleBounds:boxData(visibleBounds),meshes};
 })};
}
export function modelGeometryFingerprint(model){
 const hash=createHash('sha256');let bytes=0,meshes=0,triangles=0;
 for(const [id,group]of model.groups)for(const [index,mesh]of group.children.entries()){
  assert(mesh.isMesh,'Native fingerprint requires direct mesh children');const geometry=mesh.geometry;meshes++;triangles+=(geometry.index?.count??geometry.attributes.position.count)/3;
  assert.equal(Object.keys(geometry.morphAttributes).length,0,'Morph attributes need a separate delivery contract');
  hash.update(JSON.stringify({id,index,groups:geometry.groups,drawRange:plain(geometry.drawRange,'geometry.drawRange')}));
  for(const [key,attribute]of [...Object.entries(geometry.attributes).sort(([a],[b])=>a.localeCompare(b)),['index',geometry.index]].filter(([,a])=>a)){
   assert(!attribute.isInterleavedBufferAttribute,'Interleaved attributes need a separate delivery contract');const data=new Uint8Array(attribute.array.buffer,attribute.array.byteOffset,attribute.array.byteLength);
   hash.update(JSON.stringify({key,type:attribute.array.constructor.name,itemSize:attribute.itemSize,normalized:attribute.normalized,length:attribute.array.length}));hash.update(data);bytes+=data.byteLength;
  }
 }
 return {sha256:hash.digest('hex'),bytes,meshes,triangles};
}
const transformFingerprint=state=>sha(JSON.stringify({root:state.root.transform,groups:state.groups.map(g=>({id:g.id,transform:g.transform,meshes:g.meshes.map(m=>m.transform)}))}));
function differences(expected,actual,path='',rows=[]){
 if(rows.length>=8||Object.is(expected,actual))return rows;
 if(expected===null||actual===null||typeof expected!=='object'||typeof actual!=='object'){rows.push({path,expected,actual});return rows;}
 for(const key of new Set([...Object.keys(expected),...Object.keys(actual)])){differences(expected[key],actual[key],path?path+'.'+key:key,rows);if(rows.length>=8)break;}return rows;
}
export function nativeConfigurationCases(){
 const choices=Object.fromEntries(Object.entries(defaultConfiguration).map(([key,value])=>{const option=options.find(o=>o.key===key),values=typeof value==='boolean'?[false,true]:key==='paint'?paints.map(p=>p.id):option?.choices?.map(c=>c[0])??(key==='windows'?['closed','open']:key==='studio'?['light','dark']:[]);assert(values.length,'No supported configuration values for '+key);return [key,values];}));
 return [{name:'default',input:{...defaultConfiguration}},...Object.entries(choices).flatMap(([key,values])=>values.map(value=>({name:key+'-'+value,input:{...defaultConfiguration,[key]:value}}))),{name:'combined-all-last-values',input:Object.fromEntries(Object.entries(choices).map(([key,values])=>[key,values.at(-1)]))},{name:'return-to-default',input:{...defaultConfiguration}}];
}
export function auditNativeDelivery(nativeModel,decodedModel,{onProgress=()=>{}}={}){
 assert.equal(typeof nativeModel.configure,'function','Expected original native configure closure');assert.equal(typeof decodedModel.configure,'function','Attach the candidate configuration adapter before comparison');
 nativeModel.configure(defaultConfiguration);decodedModel.configure(defaultConfiguration);
 const initial=captureNativeProperties(nativeModel),geometry=modelGeometryFingerprint(nativeModel),transformsSha256=transformFingerprint(initial),initialSha256=sha(JSON.stringify(initial)),results=[];
 assert.deepEqual(modelGeometryFingerprint(decodedModel),geometry,'Delivered native buffers/index/groups/draw ranges differ before configuration');
 try{
  for(const {name,input}of nativeConfigurationCases()){
   nativeModel.configure(input);decodedModel.configure(input);
   for(const [label,model]of [['original',nativeModel],['delivered',decodedModel]]){
    assert.deepEqual(model.getConfiguration(),input,label+' configuration differs in '+name);const detached=model.getConfiguration();detached.paint='__must_not_leak__';assert.deepEqual(model.getConfiguration(),input,label+' getConfiguration leaked a mutable reference');
   }
   const expected=captureNativeProperties(nativeModel),actual=captureNativeProperties(decodedModel),expectedSha256=sha(JSON.stringify(expected)),actualSha256=sha(JSON.stringify(actual));
   assert.equal(actualSha256,expectedSha256,name+' differs from actual native properties: '+JSON.stringify(differences(expected,actual)));
   assert.deepEqual(modelGeometryFingerprint(nativeModel),geometry,name+' changed original native geometry');assert.deepEqual(modelGeometryFingerprint(decodedModel),geometry,name+' changed delivered native geometry');
   assert.equal(transformFingerprint(expected),transformsSha256,name+' changed original native transforms');assert.equal(transformFingerprint(actual),transformsSha256,name+' changed delivered native transforms');
   if(name==='return-to-default')assert.equal(expectedSha256,initialSha256,'Original default state was not restored');
   results.push({name,nativeStateSha256:expectedSha256,deliveredStateSha256:actualSha256});onProgress({name,completed:results.length,total:nativeConfigurationCases().length});
  }
 }finally{nativeModel.configure(defaultConfiguration);decodedModel.configure(defaultConfiguration);}
 return {nativeProperties:true,exactPartBounds:true,configurationEquivalent:true,configurationCases:results.length,geometryUnchanged:true,transformsUnchanged:true,defaultRestored:true,getConfigurationCopySemantics:true,geometry,transformsSha256,initialStateSha256:initialSha256,cases:results,limits:'Independent original-native versus delivered properties for every supported preview value, combined state and default return. Includes material/texture properties, procedural recipes/image dimensions, mesh/group render flags, metadata, original colors, exact buffers/UVs/transforms and all-owner/visible bounds. Transient IDs/UUIDs/version counters and offline canvas pixels are excluded; identical texture instances may be shared. This is not a rendered-pixel, GPU-performance or physical-vehicle test.'};
}
