import assert from 'node:assert/strict';
import * as T from 'three';
import {mkdir,writeFile} from 'node:fs/promises';
import {runId} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {refrigerationParts} from '../src/hvac-refrigeration-catalog.js';
import {refrigerationLayout,refrigerationRoutes} from '../src/hvac-refrigeration.js';
import {detailAvailable} from '../src/inspection-catalog.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createHvacDetail}=await import('../src/hvac-detail.js');
const startedAt=new Date().toISOString(),sourceSha256=sourceFingerprint(),model=createHvacDetail();model.root.updateMatrixWorld(true);
let vertices=0;const checks=[];
for(const p of refrigerationParts){
 assert.equal(detailAvailable(p,{airConditioning:false}),false,p.id+' leaks into C41');
 assert.equal(detailAvailable(p,{airConditioning:true}),true,p.id+' absent from C60');
 assert(!p.sourceUrl.includes('1986_Fiero_Service'),p.id+' original catalog link lost');
 const group=model.groups.get(p.id),bounds=new T.Box3().setFromObject(group);
 assert(!bounds.isEmpty(),p.id+' has no geometry');
 assert(bounds.min.toArray().every(Number.isFinite)&&bounds.max.toArray().every(Number.isFinite),p.id+' invalid bounds');
 group.traverse(mesh=>{if(!mesh.isMesh)return;assert(mesh.matrixWorld.determinant()>0);assert(mesh.geometry.attributes.position.array.every(Number.isFinite));assert.equal(mesh.userData.option,'airConditioning');assert.equal(mesh.userData.value,true);vertices+=mesh.geometry.attributes.position.count;});
}
checks.push('Every C60 selection has finite positive-handed geometry and is excluded from C41');
const final=p=>[-p[0],p[1],p[2]],routes=refrigerationRoutes(),ends=routes.flatMap(r=>[r.points[0],r.points.at(-1)]);
const close=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]))<1e-9;
for(const [label,point] of Object.entries(refrigerationLayout)){
 if(label==='compressorCenter')continue;
 const n=ends.filter(p=>close(p,point)).length;
 assert.equal(n,['rearDischarge','rearSuction','frontDischarge','frontSuction'].includes(label)?2:1,label+' disconnected or branched unexpectedly');
}
checks.push('Suction, discharge and liquid branches meet their named junctions without swapping compressor or front endpoints');
const rear=model.groups.get('hv-ac-compressor-rear').children;
for(const mesh of rear)mesh.material.side=T.DoubleSide;
for(const label of ['compressorDischarge','compressorSuction']){
 const p=final(refrigerationLayout[label]);
 const start=new T.Vector3(p[0]-.040,p[1],p[2]);
 const hits=new T.Raycaster(start,new T.Vector3(1,0,0),0,.09).intersectObjects(rear,false);
 assert.equal(hits.length,0,label+' rear head port is blocked');
}
checks.push('Actual rear-head port mesh has open suction and discharge bores');
const pulley=model.groups.get('hv-ac-compressor-pulley'),bearing=model.groups.get('hv-ac-compressor-bearing'),clutch=model.groups.get('hv-ac-compressor-clutch');
assert(pulley!==bearing&&bearing!==clutch);
const pb=new T.Box3().setFromObject(pulley),bb=new T.Box3().setFromObject(bearing);
assert(pb.containsBox(bb),'Pulley bearing envelope outside pulley');
const condenser=new T.Box3().setFromObject(model.groups.get('hv-ac-condenser-tubes'));
assert(condenser.max.z< -1.80,'Condenser must be ahead of the radiator in this reconstructed vehicle frame');
checks.push('Separate pulley/bearing/clutch construction; condenser remains at the front radiator plane');
assert.equal(sourceFingerprint(),sourceSha256,'Source changed during refrigeration audit');
const output='artifacts/completion-refrigeration/'+runId();await mkdir(output,{recursive:true});
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,status:'passed',selections:refrigerationParts.length,vertices,routeBranches:routes.length,checks,
 limits:'Checks apply to authored geometry and explicit source references. They do not establish installed DA-6/HR-6 variant, original pulley dimensions, calibrated pressures/charge, hose serviceability, actual refrigerant, body clearance, thermal behavior or physical workshop validation.'};
await writeFile(output+'/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
model.root.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});
