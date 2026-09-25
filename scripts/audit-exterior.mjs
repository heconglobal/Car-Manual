import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createBodyDetail}=await import('../src/body-detail.js');
const {bodyParts,bodySurfaceOwners}=await import('../src/body-catalog.js');
const {exteriorParts}=await import('../src/exterior-catalog.js');
const {sunroofHardware}=await import('../src/sunroof-catalog.js');
const {createMaterials}=await import('../src/materials.js');
const {geometryTools}=await import('../src/geometry.js');
const {buildBody}=await import('../src/body.js');
const {correctLegacyHandedness}=await import('../src/vehicle-frame.js');
const {parts}=await import('../src/data.js');
const model=createBodyDetail();model.root.updateMatrixWorld(true);
const bounds=id=>new T.Box3().setFromObject(model.groups.get('bd-skin-'+id));
const {createFuelDetail}=await import('../src/fuel-detail.js');
const checks=[];
function check(name,fn){fn();checks.push({name,status:'passed'});}
check('Every exterior selection contains finite independently owned geometry',()=>{
 for(const p of exteriorParts){const id='bd-skin-'+p.id,g=model.groups.get(id);assert(g?.children.length,id);g.traverse(m=>{if(!m.isMesh)return;assert.equal(m.userData.partId,id);assert(m.geometry.attributes.position.array.every(Number.isFinite));});assert(bounds(p.id).getSize(new T.Vector3()).length()>.001);}
 assert.equal(new Set(bodyParts.map(p=>p.id)).size,bodyParts.length);
});
check('Vehicle and Body explorer share every revised skin and exterior part',()=>{
 const groups=new Map(parts.map(p=>[p.id,new T.Group()])),h=geometryTools(groups,createMaterials());buildBody(h);h.optimize();correctLegacyHandedness(groups);
 for(const [id]of bodySurfaceOwners){const meshes=groups.get(id).children,detail=model.groups.get('bd-skin-'+id).children;assert.equal(meshes.length,detail.length,id);for(let i=0;i<meshes.length;i++)assert.deepEqual(meshes[i].geometry.attributes.position.array,detail[i].geometry.attributes.position.array,id+' diverged');}
});
check('Painted panel width retains the documented 1752 mm body envelope',()=>{
 const b=new T.Box3();for(const id of ['fender-left','fender-right','quarter-left','quarter-right','door-left','door-right'])b.union(bounds(id));assert(Math.abs(b.getSize(new T.Vector3()).x-1.752)<.001,'panel-width datum drifted');
});
check('Fuel door and intake occupy real openings in the driver quarter skin',()=>{
 const ray=new T.Raycaster(),meshes=model.groups.get('bd-skin-quarter-left').children;
 for(const [y,z]of [[.710,.93],[.525,.720]]){ray.set(new T.Vector3(-1.2,y,z),new T.Vector3(1,0,0));assert.equal(ray.intersectObjects(meshes,false).length,0,'paint blocks exterior opening');}
 assert(bounds('fuel-door').max.x<0);assert(bounds('side-intake').max.x<0);assert(bounds('antenna').min.x>0);
});
check('Fuel cap and grip fit behind the closed fuel door',()=>{
 const fuel=createFuelDetail();fuel.root.updateMatrixWorld(true);const cap=new T.Box3().setFromObject(fuel.groups.get('fu-filler-cap')),door=bounds('fuel-door');assert(cap.min.x>door.max.x+.002,'fuel cap protrudes through quarter door');
});
check('Both wheel openings have smooth circular lips and inward returns',()=>{
 for(const side of ['left','right'])for(const rear of [false,true]){const id=(rear?'quarter-':'fender-')+side,g=model.groups.get('bd-skin-'+id),cz=rear?1.1865:-1.1865,sign=side==='left'?-1:1;
  const rays=new T.Raycaster();for(let i=1;i<20;i++){const a=i/20*Math.PI;rays.set(new T.Vector3(sign*1.2,.308+.328*Math.sin(a),cz+.328*Math.cos(a)),new T.Vector3(-sign,0,0));assert.equal(rays.intersectObjects(g.children,false).length,0,id+' skin intrudes into opening');}
 }
});
check('Mirror glasses stay recessed in their shells, outside door glass',()=>{
 for(const side of ['left','right']){const shell=bounds('mirror-'+side),glass=bounds('mirror-glass-'+side),window=bounds('door-glass-'+side);assert(shell.containsBox(glass),side+' glass outside rim');assert(glass.min.z>shell.min.z+.07);assert(side==='left'?glass.max.x<window.min.x:glass.min.x>window.max.x);}
});
check('Front pads and fascia leave the park/turn apertures open',()=>{
 for(const side of ['left','right']){const x=side==='left'?-.500:.500,ray=new T.Raycaster(new T.Vector3(x,.410,-2.3),new T.Vector3(0,0,1));const meshes=['nose','front-pad-'+side].flatMap(id=>model.groups.get('bd-skin-'+id).children);assert.equal(ray.intersectObjects(meshes,false).length,0,'front turn lamp blocked');assert(bounds('front-pad-'+side).getSize(new T.Vector3()).z>.025);}
});
check('Curved bumper pad faces retain dense tessellation after wrapping',()=>{
 for(const end of ['front','rear'])for(const side of ['left','right']){const g=model.groups.get('bd-skin-'+end+'-pad-'+side);let longest=0;for(const m of g.children){const a=m.geometry.attributes.position,ix=m.geometry.index;if(!ix)continue;for(let i=0;i<ix.count;i+=3){const p=[0,1,2].map(k=>new T.Vector3().fromBufferAttribute(a,ix.getX(i+k)));longest=Math.max(longest,p[0].distanceTo(p[1]),p[1].distanceTo(p[2]),p[2].distanceTo(p[0]));}}assert(longest<.06,end+' pad contains fascia-crossing cap triangles');}
});
check('Wiper blade spans follow the nominal 18-inch envelope',()=>{
 for(const side of ['left','right'])assert(Math.abs(bounds('wiper-blade-'+side).getSize(new T.Vector3()).x-.4572)<.006);
});
check('Exterior service pieces have distinct explosion offsets',()=>{
 for(const ids of [['mirror-left','mirror-glass-left','mirror-mount-left'],['mirror-right','mirror-glass-right','mirror-mount-right'],['fuel-door','fuel-door-hinge'],['wiper-arm-left','wiper-blade-left']]){const offsets=ids.map(id=>model.groups.get('bd-skin-'+id).userData.spread);for(let i=0;i<offsets.length;i++)for(let j=i+1;j<offsets.length;j++)assert(offsets[i].distanceTo(offsets[j])>.06,'exterior pieces remain stacked in explosion');}
});
check('Roof glass and deck alternatives retain separate identities and option flags',()=>{
 for(const [id,option,value]of [['sunroof-glass','roof','glass'],['deck-wing','deck','wing'],['deck-carrier','deck','rack']])for(const m of model.groups.get('bd-skin-'+id).children){assert.equal(m.userData.option,option);assert.equal(m.userData.value,value);}
 for(const m of model.groups.get('bd-skin-sunroof-seal').children)assert(['glass','removed'].includes(m.userData.value));
 const plain=bounds('decklid');assert(bounds('deck-wing').max.y>plain.max.y+.07);
});
check('Sunroof panel hardware follows the glass; body hardware survives removal',()=>{
 for(const p of sunroofHardware){const values=new Set(model.groups.get('bd-skin-'+p.id).children.map(m=>{assert.equal(m.userData.option,'roof');return m.userData.value;}));assert.deepEqual([...values].sort(),(p.values||[p.value]).slice().sort(),p.id);assert(!values.has('solid'));}
 assert.equal(sunroofHardware.length,16);
 const a=bounds('sunroof-hinge-left'),b=bounds('sunroof-hinge-right');assert(Math.abs(a.min.x+b.max.x)<1e-6);assert(a.max.x<-.20&&b.min.x>.20);
 for(const side of ['left','right']){const bushing=bounds('sunroof-hinge-bushing-'+side),nut=bounds('sunroof-hinge-nuts'),hinge=bounds('sunroof-hinge-'+side);assert(Math.abs(nut.min.y-bushing.max.y)<.00001,'hinge nut floats above bushing');assert(hinge.max.y>nut.min.y&&hinge.min.y<bushing.min.y,'hinge attachment stem does not span the bushing');}
});
check('Sunroof trim, seal and latch housing leave their physical openings clear',()=>{
 const ray=new T.Raycaster(new T.Vector3(0,1.4,.19),new T.Vector3(0,-1,0));
 for(const id of ['sunroof-seal','sunroof-finish-lace','sunroof-headliner-retainer'])assert.equal(ray.intersectObjects(model.groups.get('bd-skin-'+id).children,false).length,0,id+' obstructs roof aperture');
 const button=bounds('sunroof-release-button').getCenter(new T.Vector3());ray.set(new T.Vector3(button.x,1.4,button.z),new T.Vector3(0,-1,0));assert.equal(ray.intersectObjects(model.groups.get('bd-skin-sunroof-latch-housing').children,false).length,0,'release button buried in housing');
});
check('Sunroof glass has separated upper and lower surfaces and independent hardware',()=>{
 const ray=new T.Raycaster(new T.Vector3(.1,1.4,.19),new T.Vector3(0,-1,0)),hits=ray.intersectObjects(model.groups.get('bd-skin-sunroof-glass').children,false);const ys=[...new Set(hits.map(h=>h.point.y.toFixed(6)))].map(Number).sort();assert.equal(ys.length,2);assert(Math.abs(ys[1]-ys[0]-.0035)<.00001);
 const ids=['sunroof-glass','sunroof-glass-handle','sunroof-glass-bushings','sunroof-handle-screws'];const spreads=ids.map(id=>model.groups.get('bd-skin-'+id).userData.spread);for(let i=0;i<spreads.length;i++)for(let j=i+1;j<spreads.length;j++)assert(spreads[i].distanceTo(spreads[j])>.08);
});
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',bodySelections:bodyParts.length,exteriorSelections:exteriorParts.length,checks,limits:'Actual reconstructed mesh checks; not measured factory tooling, crash structure, calibrated mechanism motion or owner acceptance.'};
await writeFile('artifacts/exterior-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
