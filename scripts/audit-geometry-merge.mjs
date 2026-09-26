import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {geometryTools} from '../src/geometry.js';
import {correctLegacyHandedness} from '../src/vehicle-frame.js';
import {sourceFingerprint} from './source-fingerprint.mjs';

// Compare actual expanded triangle attributes with the previous merge's
// reference operation. Includes transformed indexed/nonindexed geometry,
// material/option/detail identity, smooth normals, UV seams and >65k vertices.
const groups=new Map(['one','two'].map(id=>[id,new T.Group()]));
const h=geometryTools(groups,{metal:new T.MeshStandardMaterial(),other:new T.MeshStandardMaterial()});
for(let i=0;i<30;i++){
 const geo=i%3===0?new T.SphereGeometry(.1,20,12):i%3===1?new T.BoxGeometry(.2,.1,.05).toNonIndexed():new T.TorusGeometry(.1,.01,8,32);
 h.add(i<20?'one':'two',geo,i%2?'metal':'other',[i*.003,.01,-.02],[.13*i,.31,-.2],{option:'sample',value:i%4<2,detailPartId:'detail-'+(i%2)});
}
h.add('two',new T.PlaneGeometry(.3,.4,260,260).toNonIndexed(),'other');
h.add('two',new T.PlaneGeometry(.2,.3,8,8),'other');
const bucket=m=>JSON.stringify([m.userData.materialName,m.userData.option,m.userData.value,m.userData.detailPartId,m.material.side]);
function records(bakeReference=false){
 const result={};
 for(const [id,g]of groups){const buckets=new Map();for(const m of g.children){m.updateMatrix();const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();if(bakeReference||!m.matrix.equals(new T.Matrix4()))geo.applyMatrix4(m.matrix);const key=bucket(m);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(geo);}
  for(const [key,geos]of buckets){const hash=createHash('sha256');let triangles=0;for(const geo of geos){triangles+=geo.attributes.position.count/3; }
   // Attribute-major order is independent of whether meshes were merged.
   for(const name of Object.keys(geos[0].attributes).sort()){hash.update(name);for(const geo of geos)hash.update(Buffer.from(geo.attributes[name].array.buffer));}
   result[id+key]={triangles,sha256:hash.digest('hex')};geos.forEach(g=>g.dispose());
  }
 }return result;
}
const vertexCount=()=>[...groups.values()].reduce((n,g)=>n+g.children.reduce((a,m)=>a+m.geometry.attributes.position.count,0),0);
const before=records(true),storedBefore=vertexCount();h.optimize();const after=records(),storedAfter=vertexCount();assert.deepEqual(after,before,'merge changed triangle positions / normals / UVs or bucket identity');
const root=new T.Group();for(const g of groups.values())root.add(g);correctLegacyHandedness(groups);root.updateMatrixWorld(true);
for(const g of groups.values())for(const m of g.children){assert(m.geometry.index,'indexed merge lost');assert(m.matrixWorld.determinant()>0);assert(m.geometry.index.array.every(i=>i<m.geometry.attributes.position.count));}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',buckets:Object.keys(before).length,triangles:Object.values(before).reduce((n,r)=>n+r.triangles,0),storedBefore,storedAfter,checks:'Expanded triangle positions, normals and UVs are byte-identical to the former reference operation; material, option and detail IDs preserved; index bounds and positive transforms after handedness conversion checked.'};
await writeFile('artifacts/geometry-merge-audit.json',JSON.stringify(report,null,2)+'\n');console.log(report);
