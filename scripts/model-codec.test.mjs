import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {encodeModel,decodeModel} from '../src/model-codec.js';

test('overview round trip retains every vertex, material, texture pose and picking identity',()=>{
 const root=new T.Group(),group=new T.Group();group.userData={partId:'test-part',system:'body',spread:new T.Vector3(-.2,.4,.1),frame:'US-LHD'};root.add(group);
 const texture=new T.Texture();texture.userData.recipe={kind:'text',text:'PONTIAC',options:{width:64,height:16}};texture.repeat.set(-1,1);texture.offset.set(1,0);
 const material=new T.MeshPhysicalMaterial({color:'#923e21',roughness:.4,metalness:.2,map:texture,clearcoat:.7,transmission:.1}),geometry=new T.BoxGeometry(.7,.4,.2),mesh=new T.Mesh(geometry,material);mesh.position.set(-.5,.7,.2);mesh.userData={partId:'test-part',materialName:'red',option:'headlights',value:false,original:{color:material.color.clone(),emissive:material.emissive.clone(),opacity:1,transparent:false,emissiveIntensity:1}};group.add(mesh);
 const encoded=encodeModel({root,groups:new Map([['test-part',group]])}),recipes=[],decoded=decodeModel(encoded,recipe=>{recipes.push(recipe);return new T.Texture();}),actual=decoded.groups.get('test-part').children[0];
 assert.deepEqual([...actual.geometry.attributes.position.array],[...geometry.attributes.position.array]);assert.deepEqual([...actual.geometry.index.array],[...geometry.index.array]);assert.deepEqual(actual.position.toArray(),mesh.position.toArray());assert.deepEqual(decoded.groups.get('test-part').userData.spread.toArray(),[-.2,.4,.1]);assert.equal(actual.userData.partId,'test-part');assert(actual.userData.original.color.isColor);assert.equal(actual.material.clearcoat,.7);assert.equal(actual.material.transmission,.1);assert.equal(actual.material.ior,material.ior);assert.equal(actual.material.reflectivity,material.reflectivity);assert.deepEqual(actual.material.map.repeat.toArray(),[-1,1]);assert.deepEqual(actual.material.map.offset.toArray(),[1,0]);assert.equal(recipes[0].text,'PONTIAC');
 const expectedBox=new T.Box3().setFromObject(root),actualBox=new T.Box3().setFromObject(decoded.root);assert(actualBox.equals(expectedBox));
});
test('truncated and foreign overview buffers fail instead of displaying corrupt geometry',()=>{
 assert.throws(()=>decodeModel(new TextEncoder().encode('garbage')),/Unsupported/);
 const bad=new Uint8Array(12);bad.set(new TextEncoder().encode('FIEROV01'));new DataView(bad.buffer).setUint32(8,100,true);assert.throws(()=>decodeModel(bad),/Truncated/);
});
test('compact overview coordinates stay within one quantization step and retain normals',()=>{
 const root=new T.Group(),g=new T.Group(),geometry=new T.SphereGeometry(2.1,24,12),material=new T.MeshStandardMaterial(),mesh=new T.Mesh(geometry,material);root.add(g);g.add(mesh);g.userData={partId:'shell',spread:new T.Vector3()};mesh.userData={partId:'shell',original:{color:material.color,emissive:material.emissive,opacity:1}};
 const encoded=encodeModel({root,groups:new Map([['shell',g]])},{compact:true}),decoded=decodeModel(encoded,()=>new T.Texture()).groups.get('shell').children[0].geometry;
 const original=geometry.attributes.position,actual=decoded.attributes.position;for(let i=0;i<original.array.length;i++)assert(Math.abs(original.array[i]-actual.array[i])<4.2/65535+1e-6);
 assert.equal(decoded.attributes.normal.normalized,true);assert.equal(decoded.attributes.normal.array.BYTES_PER_ELEMENT,2);assert.deepEqual([...decoded.index.array],[...geometry.index.array]);
});

test('full precision delivery preserves group transforms, visibility, face groups and draw ranges',()=>{
 const root=new T.Group(),group=new T.Group(),geometry=new T.BoxGeometry(.3,.5,.7),mesh=new T.Mesh(geometry,new T.MeshStandardMaterial());
 root.add(group);group.add(mesh);group.position.set(.2,.3,.4);group.rotation.set(.1,.2,.3);group.scale.set(2,3,4);group.visible=false;geometry.setDrawRange(6,24);
 const actual=decodeModel(encodeModel({root,groups:new Map([['piece',group]])}),()=>new T.Texture()).groups.get('piece');
 assert.deepEqual(actual.position.toArray(),group.position.toArray());assert.deepEqual(actual.quaternion.toArray(),group.quaternion.toArray());assert.deepEqual(actual.scale.toArray(),group.scale.toArray());assert.equal(actual.visible,false);
 assert.deepEqual(actual.children[0].geometry.groups,geometry.groups);assert.deepEqual(actual.children[0].geometry.drawRange,{start:6,count:24});
});

test('delivery rejects unsupported material arrays and nested meshes rather than dropping them',()=>{
 const root=new T.Group(),group=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(),[new T.MeshStandardMaterial()]);root.add(group);group.add(mesh);const model={root,groups:new Map([['piece',group]])};
 assert.throws(()=>encodeModel(model),/Unsupported model material/);
 mesh.material=new T.MeshStandardMaterial();const nested=new T.Group();group.add(nested);nested.add(mesh);assert.throws(()=>encodeModel(model),/direct children/);
});

test('native material depth bias survives delivery, including individually nondefault settings',()=>{
 for(const C of[T.MeshStandardMaterial,T.MeshPhysicalMaterial])for(const settings of[
  {polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:2},
  {polygonOffset:true,polygonOffsetFactor:0,polygonOffsetUnits:0},
  {polygonOffset:false,polygonOffsetFactor:-2,polygonOffsetUnits:0},
  {polygonOffset:false,polygonOffsetFactor:0,polygonOffsetUnits:3},
 ])for(const compact of[false,true]){
  const root=new T.Group(),group=new T.Group(),native=new C(settings);root.add(group);group.add(new T.Mesh(new T.BoxGeometry(),native));
  const bytes=encodeModel({root,groups:new Map([['label',group]])},{compact}),decoded=decodeModel(bytes,()=>new T.Texture()).groups.get('label').children[0].material;
  // Compare the real pre-encoding material, not another encoding that could
  // omit the same properties and create a false round-trip success.
  for(const key of['polygonOffset','polygonOffsetFactor','polygonOffsetUnits'])assert.equal(decoded[key],native[key],C.name+' lost '+key);
  const size=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(8,true),meta=JSON.parse(new TextDecoder().decode(bytes.subarray(12,12+size)));
  assert.deepEqual(Object.fromEntries(Object.keys(settings).map(key=>[key,meta.materials[0].properties[key]])),settings);
 }
});

test('default material payload remains byte-identical to the pre-depth-bias format',()=>{
 const root=new T.Group(),group=new T.Group();root.add(group);group.add(new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial()));
 const bytes=encodeModel({root,groups:new Map([['legacy-part',group]])},{compact:false});
 // Captured from the preserved encoder before adding polygon-offset support.
 assert.equal(bytes.byteLength,2348);assert.equal(createHash('sha256').update(bytes).digest('hex'),'b40f79bdc20399387c513fc604c18181e47631f8c575d650fd0b4990099e96c3');
 assert.deepEqual(encodeModel(decodeModel(bytes,()=>new T.Texture()),{compact:false}),bytes);
});
