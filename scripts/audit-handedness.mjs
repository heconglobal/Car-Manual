import assert from 'node:assert/strict';
import * as T from 'three';
import {correctLegacyHandedness,vehicleForward,vehicleLeft} from '../src/vehicle-frame.js';
assert.deepEqual(vehicleForward.toArray(),[0,0,-1]);assert.equal(vehicleLeft.x,-1);
for(const indexed of [true,false])for(const legacyScale of [1,-1]){
 const g=new T.Group();g.scale.x=legacyScale;g.userData={spread:new T.Vector3(.3,.2,.1),assemblySpread:new T.Vector3(.4,0,0)};
 let geometry=new T.BoxGeometry(.2,.3,.4);if(!indexed)geometry=geometry.toNonIndexed();
 const map=new T.Texture();map.repeat.x=legacyScale;map.offset.x=legacyScale===1?0:1;
 const m=new T.Mesh(geometry,new T.MeshStandardMaterial({map}));m.position.x=.5;g.add(m);
 correctLegacyHandedness(new Map([['fixture',g]]));g.updateMatrixWorld(true);
 const centre=new T.Box3().setFromObject(g).getCenter(new T.Vector3());assert(Math.abs(centre.x+.5*legacyScale)<1e-7);
 assert(g.matrixWorld.determinant()>0);assert(m.matrixWorld.determinant()>0);
 assert.equal(g.userData.spread.x,-.3);assert.equal(g.userData.assemblySpread.x,-.4);
 assert.equal(m.material.map.repeat.x,-legacyScale);assert.equal(m.material.map.offset.x,legacyScale===1?1:0);
 const p=m.geometry.attributes.position,n=m.geometry.attributes.normal,ix=m.geometry.index;
 for(let i=0;i<(ix?.count||p.count);i+=3){const ids=[0,1,2].map(j=>ix?ix.getX(i+j):i+j),v=ids.map(j=>new T.Vector3().fromBufferAttribute(p,j));const normal=new T.Vector3().subVectors(v[1],v[0]).cross(new T.Vector3().subVectors(v[2],v[0])).normalize();assert(normal.dot(new T.Vector3().fromBufferAttribute(n,ids[0]))>.99,'face winding and lighting normal disagree');}
 assert.throws(()=>correctLegacyHandedness(new Map([['fixture',g]])),/twice/);
}
console.log('Handedness audit passed: occupant-side basis, indexed/nonindexed winding, prior mirrored groups, readable map parity, explosion offsets and duplicate-conversion guard.');
