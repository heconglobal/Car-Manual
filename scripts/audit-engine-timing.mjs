import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {v6BlockNominal,chevroletV6Blueprint} from '../src/factory-specifications.js';
import {timingLayout,camFollowers,pushrodGuidePoint} from '../src/engine-timing.js';

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
const meshes=id=>model.groups.get(id).children.filter(o=>o.isMesh);
const check=(name,passed,details={})=>checks.push({name,passed,...details});
// Inspect physical mesh vertices, not just a matching set of layout constants.
const vertices=id=>{const result=[];for(const m of meshes(id)){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++)result.push(new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld));}return result;};
const cover=meshes('eng-timing-cover');
for(const m of cover)m.material.side=T.DoubleSide;
// From every unique Y/Z chain vertex, the front ray must hit the inner cap
// and the rear ray must escape through the open shell, never a side wall.
const samples=new Map();for(const v of vertices('eng-chain')){const key=v.y.toFixed(5)+','+v.z.toFixed(5);if(!samples.has(key)||v.x<samples.get(key).x)samples.set(key,v);}
let blocked=0,frontMisses=0,minimumFrontGap=Infinity;
for(const v of samples.values()){
 const front=new T.Raycaster(v,new T.Vector3(-1,0,0)).intersectObjects(cover,false)[0];
 const back=new T.Raycaster(v,new T.Vector3(1,0,0)).intersectObjects(cover,false)[0];
 if(back&&back.distance<.1)blocked++;
 if(!front||Math.abs(front.point.x-(timingLayout.coverFront+.003))>.00002)frontMisses++;
 else minimumFrontGap=Math.min(minimumFrontGap,front.distance);
}
check('Chain mesh fits the open timing-cover cavity',blocked===0&&frontMisses===0,{sampledSections:samples.size,blockedRearRays:blocked,frontMisses,minimumFrontGapMetres:minimumFrontGap});
const gasket=new T.Box3().setFromObject(model.groups.get('eng-timing-cover-gasket'));
check('Gasket seats on rear cover flange',Math.abs(gasket.min.x-timingLayout.coverRear)<.000002,{gapMetres:gasket.min.x-timingLayout.coverRear});
// Four actual annular bearing bores meet four machined journals. Probe both
// radial directions to detect a missing bore, eccentricity or a shaft gap.
let journalFailures=0;
for(const x of timingLayout.bearingXs)for(const z of [-1,1]){
 const origin=new T.Vector3(x,cam.y,cam.z),direction=new T.Vector3(0,0,z);
 // DoubleSide is used only by this inspection so an inside-origin ray can
 // measure the outward-facing shaft surface as well as the bearing bore.
 for(const m of meshes('eng-camshaft'))m.material.side=T.DoubleSide;
 const shaft=new T.Raycaster(origin,direction).intersectObjects(meshes('eng-camshaft'),false).at(-1);
 for(const m of meshes('eng-cam-bearings'))m.material.side=T.DoubleSide;
 const bore=new T.Raycaster(origin,direction).intersectObjects(meshes('eng-cam-bearings'),false)[0];
 if(!shaft||!bore||Math.abs(shaft.distance-bore.distance)>.000002)journalFailures++;
}
check('Four bearing bores meet their concentric cam journals',journalFailures===0,{radialProbes:8,failures:journalFailures,limits:'Nominal visual contact; no manufactured running clearance is specified.'});
let followerFailures=0,pushrodFailures=0,guideFailures=0,smallestJournalGap=Infinity;
for(const f of camFollowers){
 const tag=`${f.bank}-${f.c}-${f.type}`,points=vertices('eng-lifter-'+tag),axis=f.axis;
 const lo=Math.min(...points.map(p=>p.dot(axis))),floor=points.filter(p=>Math.abs(p.dot(axis)-lo)<.000002);
 const box=new T.Box3().setFromPoints(floor),bottom=box.getCenter(new T.Vector3());
 const hit=new T.Raycaster(bottom.clone().addScaledVector(axis,.001),axis.clone().negate()).intersectObjects(meshes('eng-camshaft'),false)[0];
 if(!hit||Math.abs(hit.distance-.001)>.000025)followerFailures++;
 const seat=bottom.clone().addScaledVector(axis,.0285),pushrod=meshes('eng-pushrod-'+tag);
 const contact=new T.Raycaster(seat.clone().add(new T.Vector3(.02,0,0)),new T.Vector3(-1,0,0)).intersectObjects(pushrod,false)[0];
 if(!contact||contact.distance>.0201||contact.distance<.012)pushrodFailures++;
 const guide=meshes(`eng-pushrod-guide-${f.bank}-${f.c}`),point=pushrodGuidePoint(f),cross=new T.Vector3(0,-f.s*.5,Math.cos(Math.PI/6));
 for(const m of guide)m.material.side=T.DoubleSide;
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,origin=point.clone().add(new T.Vector3(Math.cos(a)*.0036,0,0)).addScaledVector(cross,Math.sin(a)*.0036).addScaledVector(axis,.004);
  const obstruction=new T.Raycaster(origin,axis.clone().negate(),0,.008).intersectObjects(guide,false)[0];if(obstruction)guideFailures++;
 }
 for(const bx of timingLayout.bearingXs)smallestJournalGap=Math.min(smallestJournalGap,Math.abs(f.x-bx)-.0055-timingLayout.bearingWidth/2);
}
check('All twelve flat tappets contact their cam lobes in the static pose',followerFailures===0,{failures:followerFailures,limits:'Reconstructed static pose; not a running cam-phase or valve-lift simulation.'});
check('All twelve pushrod lower ends reach their lifter seats',pushrodFailures===0,{failures:pushrodFailures});
check('All twelve pushrods pass through open guide forks',guideFailures===0,{probes:96,failures:guideFailures});
check('Cam lobes do not overlap the journal sleeves axially',smallestJournalGap>0,{minimumGapMetres:smallestJournalGap});
const lobeVertices=vertices('eng-camshaft').filter(p=>camFollowers.some(f=>Math.abs(p.x-f.x)<.005501));
const lobeRadius=Math.max(...lobeVertices.map(p=>Math.hypot(p.y-cam.y,p.z-cam.z)));
check('Cam lobes fit through the bearing-bore envelope',lobeRadius<timingLayout.journalRadius,{maximumLobeRadiusMetres:lobeRadius,bearingBoreRadiusMetres:timingLayout.journalRadius,limits:'Reconstructed insertion envelope; bearing and cam dimensions are not factory tolerance specifications.'});
for(const [id,y,r,n] of [['eng-cam-gear',cam.y,.056,40],['eng-crank-gear',crank.y,.028,20]]){
 const samples=new Map();for(const p of vertices(id))if(Math.abs(p.x-(timingLayout.x-.006))<.000002){const radius=Math.hypot(p.y-y,p.z);if(radius<r-.000001)continue;let a=Math.atan2(p.y-y,p.z);if(a<0)a+=Math.PI*2;samples.set(Math.round(a*1e5),radius>r+.0015);}
 const sequence=[...samples].sort((a,b)=>a[0]-b[0]).map(p=>p[1]),peaks=sequence.filter((v,i)=>v&&!sequence[(i+sequence.length-1)%sequence.length]).length;
 check(id+' mesh tooth count',peaks===n,{actual:peaks,expected:n,limits:'Replacement-based 40/20 reconstruction, not verification of original GM tooth profiles or original-part application.'});
}
if(sourceFingerprint()!==sourceSha256)throw new Error('Source changed during timing audit');
const passed=checks.every(c=>c.passed);
const report={reviewedAt:new Date().toISOString(),sourceSha256,status:passed?'passed':'failed',source:chevroletV6Blueprint,crankAxis:crank,camAxis:cam,checks,limits:'GM production-family centre separation plus selected reconstructed mesh fits, not a complete L44 timing or valve-train certification. Original sprocket application/tooling, chain pitch/tension/tooth engagement, cam phases, hydraulic preload, guide bores and full casting clearance remain unverified.',requiredCorrection:passed?null:'Resolve the failed physical-mesh checks before considering this coordinated timing correction verified.'};
await writeFile('artifacts/engine-timing-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!passed)process.exitCode=1;
