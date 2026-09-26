import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createHeadlightDetail}=await import('../src/headlight-detail.js');
const {headlightParts}=await import('../src/headlight-catalog.js');
const {detailMembers}=await import('../src/inspection-catalog.js');
const {root,groups}=createHeadlightDetail();root.updateMatrixWorld(true);
const bounds=id=>new T.Box3().setFromObject(groups.get(id));
const ray=(id,origin,direction,far=Infinity)=>new T.Raycaster(new T.Vector3(...origin),new T.Vector3(...direction),0,far).intersectObjects(groups.get(id).children,false);
// Independent expected schematic values: this deliberately does not import the
// data table consumed by the builder/catalog under test.
const expected=[
 ['left',-.405,.606,-1.290,5],['right',.405,.606,-1.290,5],['isolation',-.472,.588,-1.230,6],
];
let openCavities=0,terminalBlades=0;
for(const [key,x,y,z,count]of expected){
 const prefix=key==='isolation'?'hl-isolation':'hl-'+key+'-relay',cover=key==='isolation'?'hl-isolation-relay':prefix;
 const members=detailMembers('headlight-'+key+'-relay'),blades=members.filter(p=>p.id.includes('-terminal-'));
 assert.equal(blades.length,count,key+' terminal count');terminalBlades+=blades.length;
 const b=blades.find(p=>p.id.endsWith('c1-b'));assert.match(b.description,key==='isolation'?/C100 J9/:/isolation relay/);assert.match(b.name,key==='isolation'?/yellow/:/pink/);
 assert.match(b.referenceNote,/adjacent-year/);assert.match(b.referenceNote,/not a back-probing diagram/);
 // The cover is an actual cup, not a filled proxy. Only the roof should stop
 // a ray through the open bottom; check it from the exterior as well.
 assert.equal(ray(cover,[x,y-.030,z],[0,1,0],.045).length,0,key+' hollow cover');
 assert(ray(cover,[x,y+.05,z],[0,-1,0],.04).length,key+' closed roof');
 const positions=[[-.009,-.008],[0,-.008],[.009,-.008],...(key==='isolation'?[[-.009,.008],[0,.008],[.009,.008]]:[[-.0045,.008],[.0045,.008]])];
 for(const [dx,dz]of positions){
  const socket=key==='isolation'?'hl-isolation-socket':prefix+(dz<0?'-socket':'-motor-socket');
  assert.equal(ray(socket,[x-dx,y-.06,z+dz],[0,1,0],.06).length,0,key+' connector cavity obstructed');
  assert.equal(ray(prefix+'-base',[x-dx,y-.04,z+dz],[0,1,0],.04).length,0,key+' base blade aperture obstructed');openCavities++;
  for(const offset of [.004,.006,.008,.009])assert(ray(prefix+'-socket-contacts',[x-dx,y-.030-offset,z+dz-.005],[0,0,1],.006).length,key+' terminal crimp spine has a gap');
 }
 const inside=bounds(cover).expandByScalar(.0005);
 for(const suffix of ['coil','core','armature','contacts','diode'])assert(inside.containsBox(bounds(prefix+'-'+suffix)),key+' '+suffix+' protrudes through the relay shell');
 for(const p of members){assert(groups.get(p.id).children.length,p.id+' empty');assert.equal(key==='right'?bounds(p.id).min.x>0:bounds(p.id).max.x<0,true,p.id+' wrong LHD side');}
}
for(const side of ['left','right'])for(const [color,material]of [['white','wireWhite'],['green','wireGreen'],['gray','wireGray']]){
 const id='hl-'+side+'-lead-'+color;assert(groups.get(id).children.every(m=>m.userData.materialName===material),id+' wrong conductor color');
}
const stripe=groups.get('hl-isolation-pigtails').children.filter(m=>m.userData.materialName==='wireWhite');
assert(stripe.length,'RH dark-blue/white conductor stripe missing');
for(const key of ['c','d']){const b=bounds('hl-link-'+key+'-conductor');assert(b.max.x<0&&b.max.z<-.7&&b.min.z>-.95,'fusible link must be in the LH front harness, not the rear battery junction');assert.equal(detailMembers('headlight-power').filter(p=>p.id.startsWith('hl-link-'+key+'-')).length,4);}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',headlightParts:headlightParts.length,nestedRelays:3,terminalBlades,openCavities,checks:'All 16 schematic terminal identities, native open connector/base cavities, hollow relay covers, enclosed coil/core/armature/contact/diode bounds, distinct WHT/GRN/GRY motor conductors, RH blue/white stripe, and LHD sides. Checks establish reconstructed geometry and catalog behavior, not measured factory tooling or electrical simulation.'};
await writeFile('artifacts/headlight-electrical-audit.json',JSON.stringify(report,null,2)+'\n');console.log(report);
