import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {encodeModel,decodeModel} from '../src/model-codec.js';
import {defaultConfiguration,sanitizeConfiguration} from '../src/configuration.js';
import {vehicleConfiguration} from '../src/vehicle-state.js';
import {auditNativeDelivery,captureNativeProperties} from './audit-native-delivery.mjs';

function models(){
 const root=new T.Group(),group=new T.Group(),material=new T.MeshStandardMaterial({polygonOffset:true,polygonOffsetFactor:-1});group.name='test-label';group.userData={partId:'test-label',system:'electrical',spread:new T.Vector3()};root.add(group);
 const mesh=new T.Mesh(new T.BoxGeometry(.2,.1,.03),material);mesh.userData={partId:'test-label',materialName:'dark',option:'headlights',value:true,original:{color:material.color.clone(),emissive:material.emissive.clone(),opacity:1,transparent:false,emissiveIntensity:1}};group.add(mesh);
 let configuration={...defaultConfiguration};const native={root,groups:new Map([['test-label',group]]),configure(input){configuration=sanitizeConfiguration(input);mesh.visible=configuration.headlights;mesh.material.color.copy(mesh.userData.original.color);},getConfiguration:()=>({...configuration})};native.configure(configuration);
 const decoded=decodeModel(encodeModel(native),()=>new T.Texture());Object.assign(decoded,vehicleConfiguration(decoded.groups));return {native,decoded};
}
test('independent delivery oracle checks every preview state and restores defaults',()=>{
 const {native,decoded}=models(),result=auditNativeDelivery(native,decoded);assert.equal(result.configurationCases,57);assert(result.nativeProperties&&result.exactPartBounds&&result.geometryUnchanged);assert.deepEqual(native.getConfiguration(),defaultConfiguration);assert.deepEqual(decoded.getConfiguration(),defaultConfiguration);
});
test('oracle rejects an omission even when a serializer could omit it on both round-trip sides',()=>{
 const {native,decoded}=models();decoded.groups.get('test-label').children[0].material.polygonOffset=false;
 assert.notDeepEqual(captureNativeProperties(native),captureNativeProperties(decoded));assert.throws(()=>auditNativeDelivery(native,decoded),/polygonOffset/);
});
test('oracle detects option-specific transform and buffer mutations',()=>{
 for(const kind of['transform','buffer']){const {native,decoded}=models(),configure=decoded.configure;decoded.configure=input=>{configure(input);if(input.powerWindows){const mesh=decoded.groups.get('test-label').children[0];if(kind==='transform')mesh.position.x=.1;else mesh.geometry.attributes.position.array[0]+=.001;}};
  assert.throws(()=>auditNativeDelivery(native,decoded),/powerWindows-true|geometry|transforms/);
 }
});
