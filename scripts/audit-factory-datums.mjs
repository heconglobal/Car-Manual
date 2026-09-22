import assert from 'node:assert/strict';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createEngineDetail}=await import('../src/engine-detail.js');
const {engineParts}=await import('../src/engine-catalog.js');
const {createTransmissionDetail}=await import('../src/transmission-detail.js');
const {createWiringDetail}=await import('../src/wiring-detail.js');
const {clusterWarnings,instrumentParts}=await import('../src/instrument-catalog.js');
const engine=createEngineDetail(),trans=createTransmissionDetail(),wiring=createWiringDetail();
for(const m of[engine,trans,wiring])m.root.updateMatrixWorld(true);
const b=(m,id)=>new T.Box3().setFromObject(m.groups.get(id)),c=(m,id)=>b(m,id).getCenter(new T.Vector3());
for(const bank of['front','rear'])for(let position=1;position<=3;position++){
 const cylinder=(position-1)*2+(bank==='rear'?1:2);
 for(const prefix of['piston','spark','wire']){
  const p=engineParts.find(p=>p.id===`eng-${prefix}-${bank}-${position}`);assert.equal(p.cylinder,cylinder,p.id+' cylinder identity');assert(p.name.includes('cylinder '+cylinder),p.id+' visible number');
 }
 if(position<3)for(const prefix of['piston','spark'])assert(Math.abs(c(engine,`eng-${prefix}-${bank}-${position}`).x-c(engine,`eng-${prefix}-${bank}-${position+1}`).x-.1118)<.00001,prefix+' nominal pitch');
 const origin=c(engine,`eng-piston-${bank}-${position}`);
 const boreWalls=engine.groups.get('eng-block').children.filter(o=>o.userData.materialName==='rotor');
 for(const direction of[-1,1]){
  const hit=new T.Raycaster(origin,new T.Vector3(direction,0,0)).intersectObjects(boreWalls,false)[0];
  assert(hit&&Math.abs(hit.distance-.0445)<.0002,`piston ${bank}-${position} is not centered in its 89 mm bore`);
 }
}
assert(c(engine,'eng-spark-rear-1').x>c(engine,'eng-spark-rear-3').x,'cylinder 1 must be toward passenger/pulley end');
assert(c(engine,'eng-spark-front-1').z<0&&c(engine,'eng-spark-rear-1').z>0,'cabin/trunk bank mapping');
function toothPeaks(id,x,y,z,outer){
 const samples=new Map();trans.groups.get(id).traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)if(Math.abs(p.getX(i)-x)<1e-6){const yy=p.getY(i)-y,zz=p.getZ(i)-z,r=Math.hypot(yy,zz);if(r<outer*.89||r>outer*1.01)continue;let a=Math.atan2(zz,yy);if(a<0)a+=Math.PI*2;const key=Math.round(a*1e6);samples.set(key,Math.max(samples.get(key)||0,r));}});
 const profile=[...samples].sort((a,b)=>a[0]-b[0]).map(([,r])=>r>outer*.975);assert(profile.length>100,id+' missing tooth sample row');return profile.filter((v,i)=>v&&!profile[(i+profile.length-1)%profile.length]).length;
}
assert.equal(toothPeaks('tx-ring-gear',-.104,.424,.064,.090),84,'factory final-drive ring tooth count');
assert.equal(toothPeaks('tx-output-shaft',-.115,.514,0,.025),23,'factory final-drive pinion tooth count');
let radius=0;trans.groups.get('tx-disc').traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++)radius=Math.max(radius,Math.hypot(a.getY(i)-.59,a.getZ(i)));});assert(Math.abs(radius*2-.232)<.00003,'clutch-facing overall OD');
assert(c(wiring,'wr-cluster-speed-face').x<c(wiring,'wr-cluster-tach-face').x,'speedometer must be left of tach from cabin');
assert(c(wiring,'wr-cluster-temperature-face').y>c(wiring,'wr-cluster-fuel-face').y,'temperature above fuel');
const oil=b(wiring,'wr-cluster-oil-face'),tach=b(wiring,'wr-cluster-tach-face');assert(oil.min.x>tach.min.x&&oil.max.x<tach.max.x&&oil.min.y>tach.min.y&&oil.max.y<tach.max.y,'oil scale must be inside tach face');
assert.equal(clusterWarnings.length,10);for(const w of clusterWarnings){assert(wiring.groups.get('wr-cluster-warning-'+w.key).children.length);assert(wiring.groups.get('wr-cluster-bulb-'+w.key).children.length);}
for(const p of instrumentParts){const g=wiring.groups.get(p.id);assert(g.children.length,p.id);assert(b(wiring,p.id).max.x<0,p.id+' driver position');g.traverse(o=>{if(o.isMesh)assert(o.geometry.attributes.position.array.every(Number.isFinite),p.id);});}
const report={date:new Date().toISOString(),status:'passed',checks:['six piston centers ray-checked against their cylinder bore walls','111.8 mm cylinder pitch at piston and plug centers','physical cylinder bank numbering and LHD pulley end','84 ring / 23 pinion teeth counted from mesh sections','232 mm clutch facing envelope','1985 gauge ordering and embedded oil scale','ten separate indicator windows and bulb units'],limits:'Selected nominal dimensions and layout only; not complete casting, full harness, kinematic or service certification.'};
await writeFile('artifacts/factory-datums-audit.json',JSON.stringify(report,null,2)+'\n');console.log(report);
