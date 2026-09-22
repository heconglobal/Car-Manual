import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {v6BlockNominal,chevroletV6Blueprint} from '../src/factory-specifications.js';

globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createEngineDetail}=await import('../src/engine-detail.js');
const sourceSha256=sourceFingerprint(),model=createEngineDetail({legacyFrame:true});
model.root.updateMatrixWorld(true);
// Measure the actual shaft end circles. Bounds of the complete cam/lobe or
// crank/counterweight assembly cannot reliably identify its rotational axis.
function shaftAxis(id){
 const group=model.groups.get(id),bounds=new T.Box3().setFromObject(group),end=new T.Box3(),point=new T.Vector3();let samples=0;
 group.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;
  for(let i=0;i<a.count;i++){
   point.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);
   if(Math.abs(point.x-bounds.max.x)<1e-6){end.expandByPoint(point);samples++;}
  }
 });
 if(samples<20||end.isEmpty())throw new Error('Missing end-circle geometry for '+id);
 const centre=end.getCenter(new T.Vector3());
 return {y:centre.y,z:centre.z,samples};
}
const crank=shaftAxis('eng-crankshaft'),cam=shaftAxis('eng-camshaft');
const actual=Math.hypot(cam.y-crank.y,cam.z-crank.z),expected=v6BlockNominal.camHeight;
const checks=[{name:'Camshaft/crankshaft centre separation',actualMetres:actual,expectedMetres:expected,toleranceMetres:.000002,passed:Math.abs(actual-expected)<.000002}];
for(const id of ['eng-cam-bearings','eng-cam-gear']){
 const centre=new T.Box3().setFromObject(model.groups.get(id)).getCenter(new T.Vector3());
 const error=Math.hypot(centre.y-cam.y,centre.z-cam.z);
 checks.push({name:id+' concentric with camshaft',errorMetres:error,toleranceMetres:.000002,passed:error<.000002});
}
if(sourceFingerprint()!==sourceSha256)throw new Error('Source changed during timing audit');
const passed=checks.every(c=>c.passed);
const report={reviewedAt:new Date().toISOString(),sourceSha256,status:passed?'passed':'failed',source:chevroletV6Blueprint,crankAxis:crank,camAxis:cam,checks,limits:'GM production-family nominal, not a complete L44 timing or valve-train certification. Tooth counts/profiles, chain pitch/tension, cam phases, lifter interfaces and cover clearance still need verification.',requiredCorrection:passed?null:'Correct the shaft, bearings, sprocket, chain, cover and associated valve-gear interfaces coherently. Moving only the shaft would create new assembly errors.'};
await writeFile('artifacts/engine-timing-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!passed)process.exitCode=1;
