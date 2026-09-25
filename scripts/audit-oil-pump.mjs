import assert from 'node:assert/strict';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {engineMembers} from '../src/engine-catalog.js';
import {oilPumpLayout as L} from '../src/engine-oil-pump.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createEngineDetail}=await import('../src/engine-detail.js');
const model=createEngineDetail({legacyFrame:true});model.root.updateMatrixWorld(true);
const checks=[],check=(name,fn)=>{try{checks.push({name,passed:true,...fn()});}catch(e){checks.push({name,passed:false,error:e.message});}};
const meshes=key=>{const a=[];model.groups.get('eng-'+key).traverse(o=>{if(o.isMesh){o.material.side=T.DoubleSide;a.push(o);}});return a;};
const verts=key=>meshes(key).flatMap(m=>Array.from({length:m.geometry.attributes.position.count},(_,i)=>new T.Vector3().fromBufferAttribute(m.geometry.attributes.position,i).applyMatrix4(m.matrixWorld)));
const ray=(key,p,d,far=Infinity)=>new T.Raycaster(new T.Vector3(...p),new T.Vector3(...d),0,far).intersectObjects(meshes(key),false);
const bounds=key=>new T.Box3().setFromPoints(verts(key));
check('Twelve selections reconcile figure 23 construction callouts',()=>{
 const parts=engineMembers('oil-pump-detail');assert.equal(parts.length,12);
 assert.deepEqual([...new Set(parts.map(p=>p.callout).filter(Number.isInteger))].sort(),[1,2,3,4,5,6,7]);
 for(const p of parts){assert.ok(p.sourceUrl.endsWith('#page=338'));assert.ok(meshes(p.id.slice(4)).length);assert.ok(verts(p.id.slice(4)).every(v=>v.toArray().every(Number.isFinite)));}
 return {selections:parts.length,newSelections:9};
});
check('Actual gear meshes fit the open pocket with axial end clearance',()=>{
 for(const [key,x]of [['oil-pump-drive-gear',L.driveX],['oil-pump-driven-gear',L.idlerX]]){
  for(const v of verts(key).filter(v=>v.y<.962)){
   assert.ok(Math.hypot(v.x-x,v.z)<=L.tipRadius+1e-7);
   assert.ok(v.y>L.bodyBottom,'Gear below cover face');assert.ok(v.y<.963,'Gear through pocket roof');
  }
  for(let n=0;n<48;n++){
   const a=n*Math.PI/24,p=[x+Math.cos(a)*.011,.930,Math.sin(a)*.011];
   const hit=ray('oil-pump',p,[0,1,0])[0];assert.ok(hit);assert.ok(Math.abs(hit.point.y-.963)<1e-6,'Housing closes the gear pocket');
  }
 }
});
check('Static tooth envelopes do not intersect',()=>{
 // Test the actual extruded tooth outlines against the opposite gear at its
 // mid-plane, independently of the formula used to author either profile.
 for(const [a,b]of [['oil-pump-drive-gear','oil-pump-driven-gear'],['oil-pump-driven-gear','oil-pump-drive-gear']]){
  const points=new Map();for(const v of verts(a)){if(v.y<.962)points.set(v.x.toFixed(8)+','+v.z.toFixed(8),v);}
  for(const v of points.values())assert.equal(ray(b,[v.x,.936,v.z],[0,1,0],.028).length,0,'Gear overlap at '+v.toArray());
 }
 return {pose:'Static only; no operating tooth contact or ratio certification'};
});
check('Drive coupling socket, idler bore and roof shaft passage remain open',()=>{
 assert.equal(ray('oil-pump',[L.driveX,.99,0],[0,-1,0],.052).length,0,'Drive bore blocked');
 const seat=ray('oil-pump-drive-gear',[L.driveX,.99,0],[0,-1,0])[0];assert.ok(seat);assert.ok(Math.abs(seat.point.y-.969)<1e-6,'Socket not open to its seat');
 assert.equal(ray('oil-pump-driven-gear',[L.idlerX,.98,0],[0,-1,0],.06).length,0,'Idler bore blocked');
 for(const v of verts('oil-pump-drive').filter(v=>v.y<.979&&v.y>.969))assert.equal(ray('oil-pump-drive-gear',[v.x,.982,v.z],[0,-1,0],.012).length,0,'Intermediate shaft clips socket');
});
check('Relief piston, spring and pin fit their open sleeve',()=>{
 for(const key of ['oil-pump-relief-piston','oil-pump-relief-spring'])for(const v of verts(key))assert.ok(Math.hypot(v.y-.932,v.z+.027)<.005,'Relief part clips sleeve');
 assert.equal(ray('oil-pump-cover',[.075,.932,-.027],[1,0,0],.08).length,0,'Relief bore occluded');
 assert.ok(bounds('oil-pump-relief-spring').max.x<bounds('oil-pump-relief-piston').min.x);
 assert.ok(bounds('oil-pump-relief-pin').max.x<bounds('oil-pump-relief-spring').min.x,'Pin intersects spring');
});
check('Cover inlet, screen gaps and pickup shell are real openings',()=>{
 assert.equal(ray('oil-pump-cover',[.124,.92,.009],[0,1,0],.02).length,0,'Cover inlet blocked');
 assert.equal(ray('pickup',[L.screen[0],.84,0],[0,1,0],.033).length,0,'Shell inlet blocked');
 assert.equal(ray('pickup-screen',[L.screen[0]+.001,.84,.001],[0,1,0],.03).length,0,'Screen gaps opaque');
 assert.ok(ray('pickup-screen',[L.screen[0],.84,.001],[0,1,0],.03).length>0,'Missing screen wires');
 const shell=bounds('pickup'),screen=bounds('pickup-screen');assert.ok(screen.min.y>=shell.min.y-1e-6);assert.ok(screen.max.y<shell.min.y+.002);
 const hit=ray('pan',[L.screen[0],screen.min.y-.001,0],[0,-1,0])[0];assert.ok(hit,'Missing sump beneath screen');assert.ok(screen.min.y-hit.point.y>.003,'Screen intersects sump');
 return {reconstructedScreenToSumpGapMm:(screen.min.y-hit.point.y)*1000};
});
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:checks.every(c=>c.passed)?'passed':'failed',limits:'Actual-mesh checks on reconstructed static geometry. Does not verify original dimensions, oil flow, pressure calibration, operating tooth engagement or a repair procedure.',checks};
await writeFile('artifacts/oil-pump-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.status!=='passed')process.exitCode=1;
