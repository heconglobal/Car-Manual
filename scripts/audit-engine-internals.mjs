import assert from 'node:assert/strict';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {camFollowers} from '../src/engine-timing.js';
import {engineMembers} from '../src/engine-catalog.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createEngineDetail}=await import('../src/engine-detail.js');
const model=createEngineDetail({legacyFrame:true});model.root.updateMatrixWorld(true);
const checks=[];
function check(name,fn){try{const details=fn();checks.push({name,passed:true,...details});}catch(e){checks.push({name,passed:false,error:e.message});}}
const meshes=id=>{const out=[];model.groups.get(id)?.traverse(o=>{if(o.isMesh){o.material.side=T.DoubleSide;out.push(o);}});assert.ok(out.length,'Missing mesh '+id);return out;};
const verts=id=>meshes(id).flatMap(o=>{const a=o.geometry.attributes.position;return Array.from({length:a.count},(_,i)=>new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld));});
for(const f of camFollowers){
 const tag=`${f.bank}-${f.c}-${f.type}`,scope=`lifter-${tag}`,id=k=>`eng-lifter-${k}-${tag}`,body=`eng-lifter-${tag}`;
 const q=new T.Quaternion().setFromEuler(new T.Euler(f.s*Math.PI/6,0,0)),inv=q.clone().invert();
 const local=v=>v.clone().sub(f.centre).applyQuaternion(inv),world=v=>new T.Vector3(...v).applyQuaternion(q).add(f.centre);
 const ray=(part,p,d)=>new T.Raycaster(world(p),new T.Vector3(...d).applyQuaternion(q)).intersectObjects(meshes(part),false);
 check(scope+' complete inventory and finite, contained meshes',()=>{
  const parts=engineMembers(scope);assert.equal(parts.length,9);assert.deepEqual(parts.map(p=>p.callout).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
  for(const part of parts){assert.ok(part.sourceUrl.endsWith('#page=292'));for(const v of verts(part.id).map(local)){assert.ok(v.toArray().every(Number.isFinite));assert.ok(Math.hypot(v.x,v.z)<=.01001,'Radial envelope '+part.id);assert.ok(v.y>=-.01751&&v.y<=.01751,'Axial envelope '+part.id);}}
  return {selections:parts.length};
 });
 check(scope+' open bore, coaxial oil feed and seat passages',()=>{
  const floor=ray(body,[0,.03,0],[0,-1,0])[0];assert.ok(floor);assert.ok(Math.abs(local(floor.point).y+.0143)<2e-6,'Closed foot beneath an open bore');
  for(const [part,farWall]of [[body,-.0073],[id('plunger'),-.0052]]){const hit=ray(part,[.02,.001,0],[-1,0,0])[0];assert.ok(hit);assert.ok(Math.abs(local(hit.point).x-farWall)<2e-6,'Radial oil opening blocked: '+part);}
  for(const key of ['metering-valve','pushrod-seat'])assert.equal(ray(id(key),[0,.03,0],[0,-1,0]).length,0,'Central oil passage '+key);
 });
 check(scope+' moving pieces fit the body bore and ball seat',()=>{
  for(const key of ['plunger','metering-valve','pushrod-seat','plunger-spring','check-retainer','check-spring','check-ball'])for(const v of verts(id(key)).map(local))assert.ok(Math.hypot(v.x,v.z)<.007301,'Internal part clips bore: '+key);
  const ballBounds=new T.Box3();verts(id('check-ball')).map(local).forEach(v=>ballBounds.expandByPoint(v));
  const centre=ballBounds.getCenter(new T.Vector3());assert.ok(Math.abs(centre.y+.0073944)<2e-6);
  const seatDistance=Math.hypot(.0008,-.0065-centre.y);assert.ok(Math.abs(seatDistance-.0012)<2e-6,'Ball tangent to inlet-seat edge');
 });
}
check('Water-pump construction selections and shaft alignment',()=>{
 assert.equal(engineMembers('water-pump-detail').length,10);
 for(const key of ['hub','bearing','seal','impeller']){const id='eng-water-pump-'+key,vs=verts(id);assert.ok(vs.every(v=>v.toArray().every(Number.isFinite)));const bounds=new T.Box3().setFromPoints(vs),c=bounds.getCenter(new T.Vector3());assert.ok(Math.hypot(c.y-1.218,c.z-.076)<.00001,key+' shaft concentricity');}
 const hub=new T.Box3().setFromPoints(verts('eng-water-pump-hub'));
 assert.ok(Math.abs(hub.min.x-(-.283-.0513))<.00001,'Hub flange/pulley axial seat');
 let faceVertices=0;for(const m of meshes('eng-water-pump-hub')){const p=m.geometry.attributes.position,n=m.geometry.attributes.normal,normalMatrix=new T.Matrix3().getNormalMatrix(m.matrixWorld);for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);if(Math.abs(v.x-hub.min.x)<1e-7){const normal=new T.Vector3().fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);assert.ok(normal.x<-.9999,'Machined hub face has a tilted shading normal');faceVertices++;}}}assert.ok(faceVertices>30,'Missing planar hub face');

});
check('Impeller fits open rear chamber and has a shaft bore',()=>{
 const vs=verts('eng-water-pump-impeller');let maxRadius=0;for(const v of vs){maxRadius=Math.max(maxRadius,Math.hypot(v.y-1.218,v.z-.076));assert.ok(v.x>-.283&&v.x<-.283+.016,'Impeller beyond chamber end');}assert.ok(maxRadius<.030,'Impeller touches rear opening');
 const hit=new T.Raycaster(new T.Vector3(-.20,1.218,.076),new T.Vector3(-1,0,0)).intersectObjects(meshes('eng-water-pump-impeller'),false);assert.equal(hit.length,0,'Solid impeller shaft bore');return {maxRadiusMetres:maxRadius};
});
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:checks.every(c=>c.passed)?'passed':'failed',limits:'Checks reconstructed geometry and selection coverage; not production tolerances, original pump internals, hydraulic calibration or approval of overhaul procedures.',checks};
await writeFile('artifacts/engine-internals-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.status!=='passed')process.exitCode=1;
