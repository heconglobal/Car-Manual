import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {encodeModel,decodeModel} from '../src/model-codec.js';
import {disposeModel} from '../src/model-resources.js';

export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function auditDetailDelivery(model){
 assert.deepEqual(Object.keys(model).sort(),['groups','root'],'Model-specific behavior needs a dedicated delivery contract');
 model.root.updateMatrixWorld(true);
 const bounds=new Map();let meshes=0,triangles=0;
 for(const [id,group] of model.groups){
  assert.equal(group.name,id);const box=new T.Box3().setFromObject(group);
  bounds.set(id,box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()});
  group.traverse(mesh=>{if(mesh.isMesh){meshes++;triangles+=(mesh.geometry.index?.count||mesh.geometry.attributes.position.count)/3;}});
 }
 let at=performance.now();const encoded=encodeModel(model,{compact:false}),encodingMs=performance.now()-at;
 at=performance.now();const decoded=decodeModel(encoded,recipe=>{const texture=new T.Texture();texture.userData.recipe=recipe;return texture;}),decodingMs=performance.now()-at;
 try{
  assert.equal(sha256(encodeModel(decoded,{compact:false})),sha256(encoded),'Native typed buffers and encoded identities, materials, texture recipes and transforms must round-trip exactly');
  for(const [id,group] of decoded.groups){const box=new T.Box3().setFromObject(group),actual=box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()};assert.deepEqual(actual,bounds.get(id),'Exact native part bounds: '+id);}
 }finally{disposeModel(decoded);}
 return{encoded,parts:model.groups.size,meshes,triangles,validation:{nativeRoundTrip:true,exactPartBounds:true},timings:{encodingMs,decodingMs}};
}
