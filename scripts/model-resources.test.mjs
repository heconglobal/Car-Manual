import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {disposeModel,allocationStats} from '../src/model-resources.js';
import {createLatestModelRequest} from '../src/latest-model-request.js';

test('eviction releases owned buffers, materials and textures while protecting retained shared resources',()=>{
 const retained=new T.Group(),root=new T.Group(),map=new T.Texture(),material=new T.MeshStandardMaterial({map}),geometry=new T.BoxGeometry();
 retained.add(new T.Mesh(geometry,material));root.add(new T.Mesh(geometry,material));
 const ownedGeometry=new T.SphereGeometry(),ownedMap=new T.Texture(),ownedMaterial=new T.MeshStandardMaterial({map:ownedMap});root.add(new T.Mesh(ownedGeometry,ownedMaterial));
 const disposed=[];for(const [name,value]of Object.entries({map,material,geometry,ownedGeometry,ownedMap,ownedMaterial}))value.addEventListener('dispose',()=>disposed.push(name));
 const model={root,groups:new Map([['part',root]])};assert(allocationStats([model]).geometryBytes>0);
 disposeModel(model,[retained]);assert.deepEqual(disposed.sort(),['ownedGeometry','ownedMap','ownedMaterial'].sort());assert.equal(root.children.length,0);assert.equal(model.groups.size,0);
 disposeModel({root:retained});assert.equal(new Set(disposed).size,6);
});
test('late module arrivals are never allocated after a newer selection or return',async()=>{
 const request=createLatestModelRequest(),allocated=[],published=[];let finishOld;
 const old=request.run(()=>new Promise(resolve=>finishOld=resolve),builder=>{allocated.push(builder);return builder;},model=>published.push(model));
 await request.run(async()=> 'new',builder=>{allocated.push(builder);return builder;},model=>published.push(model));
 finishOld('old');assert.equal(await old,false);assert.deepEqual(allocated,['new']);assert.deepEqual(published,['new']);
 let finishCancelled;const cancelled=request.run(()=>new Promise(resolve=>finishCancelled=resolve),()=>{throw Error('cancelled request allocated');},()=>{});request.cancel();finishCancelled('cancelled');assert.equal(await cancelled,false);
});
