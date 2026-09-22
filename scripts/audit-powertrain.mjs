import assert from 'node:assert/strict';
import {verticalSurfaceIndex} from './vertical-surface-index.mjs';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createVehicle}=await import('../src/model.js'),{createEngineDetail}=await import('../src/engine-detail.js');
const {engineParts}=await import('../src/engine-catalog.js'),{engineVehicleOwner}=await import('../src/vehicle-engine.js');
const {transmissionPlacement,enginePlacement,engineOffset,transmissionToVehicle,engineToVehicle,transaxleDatum}=await import('../src/powertrain-layout.js');
const {createTransmissionDetail}=await import('../src/transmission-detail.js');
const {createExhaustDetail,exhaustDatum,exhaustRoutes,manifoldOutlet}=await import('../src/exhaust-detail.js');
const {createChargingDetail}=await import('../src/charging-detail.js');
const {v6BlockNominal}=await import('../src/factory-specifications.js');
const {bankOffset}=await import('../src/engine-layout.js');
const {driveBeltPoints,drivePulleys}=await import('../src/engine-drive.js');
const initialSource=sourceFingerprint(),engine=createEngineDetail(),car=createVehicle(),trans=createTransmissionDetail(),exhaust=createExhaustDetail(),charging=createChargingDetail();
for(const model of [engine,car,trans,exhaust,charging])model.root.updateMatrixWorld(true);
const bounds=(model,id)=>new T.Box3().setFromObject(model.groups.get(id)),centre=(model,id)=>bounds(model,id).getCenter(new T.Vector3());
const reflection=v=>new T.Vector3(-v[0],v[1],v[2]),offset=reflection(engineOffset);
let vertices=0,maxError=0,sharedParts=0;
// Compare actual mesh vertices by retained detail identity, not only metadata
// or bounding boxes. Both builds independently bake their final LHD frame.
for(const p of engineParts){const owner=engineVehicleOwner(p);if(!owner)continue;
 const a=engine.groups.get(p.id).children,b=car.groups.get(owner).children.filter(m=>m.userData.detailPartId===p.id);
 assert.equal(b.length,a.length,p.id+' installed surface count');sharedParts++;
 for(let j=0;j<a.length;j++){
  assert.equal(a[j].geometry.attributes.position.count,b[j].geometry.attributes.position.count,p.id+' topology');
  const aa=a[j].geometry.attributes.position,bb=b[j].geometry.attributes.position;
  for(let i=0;i<aa.count;i++){
   const expected=new T.Vector3().fromBufferAttribute(aa,i).applyMatrix4(a[j].matrixWorld).add(offset),actual=new T.Vector3().fromBufferAttribute(bb,i).applyMatrix4(b[j].matrixWorld),error=expected.distanceTo(actual);
   maxError=Math.max(maxError,error);assert(error<.000002,p.id+' changed shape when installed');vertices++;
  }
 }
}
for(const matrix of [enginePlacement,transmissionPlacement]){const scale=new T.Vector3().setFromMatrixScale(matrix);assert(scale.distanceTo(new T.Vector3(1,1,1))<1e-10);assert(Math.abs(matrix.determinant()-1)<1e-10);}
// Factory deck planes are checked by a ray against the constructed block.
const deckChecks=[];
for(const side of [-1,1]){
 const normal=new T.Vector3(0,Math.cos(Math.PI/6),side*.5),origin=reflection([bankOffset(side),1.05+.26*Math.cos(Math.PI/6)-.052*side*.5,.26*side*.5+.052*Math.cos(Math.PI/6)]);
 const hit=new T.Raycaster(origin,normal.clone().negate()).intersectObjects(engine.groups.get('eng-block').children,false)[0];
 assert(hit,'missing deck face');const measured=.26-hit.distance;
 assert(Math.abs(measured-v6BlockNominal.deckHeight)<.00001,'224 mm deck-height ray');deckChecks.push({side,measured});
}
assert(Math.abs(centre(engine,'eng-piston-front-1').x-centre(engine,'eng-piston-rear-1').x+.044)<.000001,'44 mm stagger, odd bank toward passenger pulley');
const clutchAxis=transmissionToVehicle([-.018,...transaxleDatum.input]),flywheelAxis=engineToVehicle([.231,1.05,0]);assert(new T.Vector3(...clutchAxis).distanceTo(new T.Vector3(...flywheelAxis))<1e-9,'flywheel/input axis');
const diff=transmissionToVehicle([0,...transaxleDatum.differential]);assert(Math.abs(diff[1]-.304)<1e-9&&Math.abs(diff[2]-1.1865)<1e-9,'differential axle datum');
const size=(model,id)=>bounds(model,id).getSize(new T.Vector3());assert(size(engine,'eng-flywheel').distanceTo(size(trans,'tx-flywheel'))<.000001,'shared flywheel surface envelope');
for(const bank of ['front','rear']){
 const expected=reflection(engineToVehicle(manifoldOutlet(bank)));assert(expected.distanceTo(new T.Vector3(...exhaustRoutes[bank][0]))<1e-9,bank+' exhaust route must start at real outlet');
 const e=bounds(engine,'eng-'+bank+'-exhaust').translate(offset),x=bounds(exhaust,'ex-'+bank+'-manifold');assert(e.min.distanceTo(x.min)<.000002&&e.max.distanceTo(x.max)<.000002,bank+' manifold consistent across explorers');
}
const altBox=new T.Box3();for(const [id,g]of charging.groups)if(id.startsWith('ch-alt-'))altBox.union(new T.Box3().setFromObject(g));const engineAlt=bounds(engine,'eng-alternator').translate(offset);assert(engineAlt.min.distanceTo(altBox.min)<.000002&&engineAlt.max.distanceTo(altBox.max)<.000002,'alternator shared placement');
// Sample all upper exterior meshes against the closed deck, including the
// native inner reinforcement. Not a complete collision/production fit audit.
const deck=car.groups.get('decklid').children.filter(x=>x.isMesh),deckClearance=[],verticalHits=verticalSurfaceIndex(deck);
for(const mesh of deck)mesh.material.side=T.DoubleSide; // conservative physical surfaces, independent of rendering culling
// Cross-check the accelerated vertical intersections against Three.js rays.
for(let x=-.3;x<=.3;x+=.15)for(let z=.85;z<=1.5;z+=.2){
 const rays=new T.Raycaster(new T.Vector3(x,1.7,z),new T.Vector3(0,-1,0)).intersectObjects(deck,false),ys=verticalHits(x,z);
 assert.equal(!!rays.length,!!ys.length,'vertical index coverage');if(rays.length)assert(Math.abs(rays.at(-1).point.y-ys[0])<1e-7,`vertical index intersection at ${x},${z}: ${rays.at(-1).point.y} / ${ys[0]}`);
}
// Both inlet AND exhaust valve gear must remain under their assembled cover.
let valveVertices=0;
for(const p of engineParts.filter(p=>p.section.startsWith('valve-'))){const side=p.section.includes('-front-')?-1:1;engine.groups.get(p.id).traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const y=(a.getY(i)-1.05)*Math.cos(Math.PI/6)+a.getZ(i)*side*.5;assert(y<.365,p.id+' protrudes through the valve-cover roof');valveVertices++;}});}
const beltPoints=driveBeltPoints();for(const pulley of drivePulleys){let contact=0;for(const [,y,z]of beltPoints){const distance=Math.hypot(y-pulley.y,z-pulley.z);assert(distance>=pulley.r-.00002,'belt crosses pulley interior');if(Math.abs(distance-pulley.r)<.00002)contact++;}assert(contact>8,pulley.id+' has no belt wrap');}
console.log('Shared vertices, deck planes, valve covers, shaft axes, manifold outlets and belt wrap passed.');
for(const id of ['intake','heads','thermostat','distributor','ignition-coil','ignition-leads','engine-controls','alternator','air-lid']){
 let min=Infinity,samples=0;
 car.groups.get(id).traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position,step=Math.max(1,Math.floor(a.count/120));
 for(let i=0;i<a.count;i+=step){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);if(p.y<.65)continue;const hits=verticalHits(p.x,p.z);if(!hits.length)continue;min=Math.min(min,hits[0]-p.y);samples++;}});
 if(samples)assert(min>.002,id+' sampled deck interference '+min);deckClearance.push({id,samples,minGap:Number.isFinite(min)?min:null});
}
assert(bounds(car,'oil-pan').min.y>.1,'sump below reconstructed ground envelope');
assert.equal(sourceFingerprint(),initialSource,'source changed during geometry audit');
const report={reviewedAt:new Date().toISOString(),sourceSha256:initialSource,status:'passed',sharedParts,valveVerticesChecked:valveVertices,verticesCompared:vertices,maximumVertexErrorMetres:maxError,checks:['unit-scale rigid placement in vehicle','shared engine/clutch flywheel','44 mm bank stagger and 224 mm deck planes','engine/clutch/input-axis alignment','differential retained at rear axle datum','manifold/crossover endpoints and shared manifold envelopes','shared alternator position','sampled closed-deck clearance','both banks intake/exhaust gear under valve covers','continuous accessory belt wrap around all three pulley envelopes'],deckChecks,deckClearance,limits:'Cross-view consistency and listed datums only. Installed powertrain angle, mount locations, casting profiles, full cradle/shaft/cable/hose interfaces, internal fit and all motion remain reconstructed or unverified.'};
await writeFile('artifacts/cross-view-scale-review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
