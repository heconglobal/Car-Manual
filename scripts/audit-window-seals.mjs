// Contact and clear-pane tests against actual meshes, including the inner
// weatherstrip which is visible through transparent glass. Not seal tooling.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
import {sideWindow,windshield} from '../src/glazing-contours.js';
import {sunroofGlassPoint} from '../src/sunroof.js';
import {bodyPoint} from '../src/body-datums.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const baseline=process.env.FIERO_SEAL_BASELINE,root=baseline?resolve(baseline):process.cwd();
const {createBodyDetail}=await import(pathToFileURL(resolve(root,'src/body-detail.js')));
const model=createBodyDetail();model.root.updateMatrixWorld(true);
const group=id=>model.groups.get(id.startsWith('bd-')?id:'bd-skin-'+id);
const meshes=ids=>ids.flatMap(id=>group(id).children);
const world=p=>{const q=bodyPoint(p);q[0]*=-1;return new T.Vector3(...q);};
const point=(fn,u,v)=>world(fn(u,v));
const normal=(fn,u,v,outward)=>{const e=.0001,clamp=T.MathUtils.clamp,du=point(fn,clamp(u+e,0,1),v).sub(point(fn,clamp(u-e,0,1),v)),dv=point(fn,u,clamp(v+e,0,1)).sub(point(fn,u,clamp(v-e,0,1)));const n=du.cross(dv).normalize();if(n.dot(new T.Vector3(...outward))<0)n.negate();return n;};
const ray=new T.Raycaster(),failures=[],checks=[];
function check(name,fn){try{checks.push({name,...fn(),status:'passed'});}catch(e){failures.push(e.message);checks.push({name,status:'failed',message:e.message});}}
const shoot=(p,n,objects,far=.10)=>{ray.set(p.clone().addScaledVector(n,.035),n.clone().negate());ray.near=0;ray.far=far;return ray.intersectObjects(objects,false);};
check('Both side-window clear areas are free of crossing outer or inner weatherstrips',()=>{
 let samples=0,obstructions=0;const examples=[];
 for(const s of [-1,1]){
  const side=s>0?'left':'right',fn=(u,v)=>sideWindow(s,u,v),objects=meshes(['a-pillar-seal-'+side,'upper-window-seal-'+side,'b-pillar-seal-'+side,'belt-seal-'+side,'bd-door-'+side+'-seal']);
  const boundary=[];for(let i=0;i<=150;i++)for(const [u,v]of [[i/150,0],[i/150,1],[0,i/150],[1,i/150]])boundary.push(point(fn,u,v));
  for(let i=1;i<32;i++)for(let j=1;j<20;j++){
   const u=i/32,v=j/20,p=point(fn,u,v);if(Math.min(...boundary.map(q=>p.distanceTo(q)))<.014)continue;
   const hits=shoot(p,normal(fn,u,v,[-s,0,0]),objects);samples++;
   if(hits.length){obstructions++;if(examples.length<8)examples.push({side,u,v,part:hits[0].object.userData.partId});}
  }
 }
 assert.equal(obstructions,0,JSON.stringify({obstructions,samples,examples}));return{samples,obstructions};
});
check('Outer side seals and belt lips cover the actual pane boundary on both sides',()=>{
 let samples=0,misses=0,roundoffRetries=0,maxRoundoffShift=0;const examples=[];
 for(const s of [-1,1]){
  const side=s>0?'left':'right',fn=(u,v)=>sideWindow(s,u,v),objects=meshes(['a-pillar-seal-'+side,'upper-window-seal-'+side,'b-pillar-seal-'+side,'belt-seal-'+side]);
  for(let i=0;i<=100;i++)for(const [u,v]of [[i/100,1],[1,i/100],[i/100,0]]){
   const p=point(fn,u,v);samples++;if(shoot(p,normal(fn,u,v,[-s,0,0]),objects,.05).length)continue;
   // A double-precision ray exactly on a Float32 cap edge can miss by a few
   // nanometres. Retry just inside that edge, at most 0.5 micrometre away.
   // R11's two corner misses disappear after a 1.36-nanometre displacement;
   // this is numerical edge ownership, not a millimetre-scale contact gap.
   const eu=T.MathUtils.clamp(u,1e-7,1-1e-7),ev=T.MathUtils.clamp(v,1e-7,1-1e-7),q=point(fn,eu,ev),shift=q.distanceTo(p);
   if(shift<.0000005&&shoot(q,normal(fn,eu,ev,[-s,0,0]),objects,.05).length){roundoffRetries++;maxRoundoffShift=Math.max(maxRoundoffShift,shift);continue;}
   misses++;if(examples.length<8)examples.push({side,u,v});
  }
 }
 assert.equal(misses,0,JSON.stringify({misses,samples,examples}));return{samples,misses,roundoffRetries,maxRoundoffShiftMicrometres:maxRoundoffShift*1e6};
});
check('Windshield and backlight moldings form continuous coverage over actual mesh edges',()=>{
 let samples=0,misses=0;const examples=[];
 for(const [id,outward]of [['glass',[0,.8,-.6]],['rear-window',[0,.35,1]]]){
  const g=group(id),seal=g.children.filter(m=>m.userData.materialName==='rubber');
  for(const m of g.children.filter(m=>m.userData.materialName==='glass')){
   const a=m.geometry.attributes.position,n=m.geometry.attributes.normal,ix=m.geometry.index,edges=new Map();
   for(let i=0;i<ix.count;i+=3){const tri=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];for(let k=0;k<3;k++){const u=tri[k],v=tri[(k+1)%3],key=[Math.min(u,v),Math.max(u,v)].join(',');const e=edges.get(key)||{u,v,count:0};e.count++;edges.set(key,e);}}
   for(const {u,v,count}of edges.values())if(count===1){const p=new T.Vector3().fromBufferAttribute(a,u).lerp(new T.Vector3().fromBufferAttribute(a,v),.5).applyMatrix4(m.matrixWorld),nn=new T.Vector3().fromBufferAttribute(n,u).add(new T.Vector3().fromBufferAttribute(n,v)).normalize();if(nn.dot(new T.Vector3(...outward))<0)nn.negate();samples++;if(!shoot(p,nn,seal,.05).length){misses++;if(examples.length<8)examples.push({id,p:p.toArray()});}}
  }
 }
 assert.equal(misses,0,JSON.stringify({misses,samples,examples}));return{samples,misses};
});
check('Sunroof seal contacts every glass edge and covers the aperture clearance',()=>{
 const seal=group('sunroof-seal').children.filter(m=>m.userData.value==='glass');let samples=0,misses=0;const examples=[];
 for(let i=0;i<=60;i++)for(const [u,v]of [[i/60,0],[1,i/60],[i/60,1],[0,i/60]]){samples++;const p=point(sunroofGlassPoint,u,v);if(!shoot(p,normal(sunroofGlassPoint,u,v,[0,1,0]),seal,.05).length){misses++;if(examples.length<6)examples.push({u,v});}}
 assert.equal(misses,0,JSON.stringify({misses,samples,examples}));
 const roof=group('roof').children.filter(m=>m.userData.value==='glass'),glass=group('sunroof-glass').children;
 for(const s of [-1,1])for(const v of [.25,.4,.55,.7])for(const offset of [.002,.006,.010,.014]){const p=point(sunroofGlassPoint,s>0?1:0,v);p.x-=s*offset;samples++;assert(shoot(p,new T.Vector3(0,1,0),[...roof,...glass,...seal],.05).length,'daylight in sunroof side clearance');}
 const centre=point(sunroofGlassPoint,.5,.5);assert.equal(shoot(centre,new T.Vector3(0,1,0),seal,.05).length,0,'seal obstructs roof opening');return{samples,misses};
});
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),baseline:baseline||null,status:failures.length?'failed':'passed',checks,limits:'Actual-mesh contact and clear-pane tests. Reconstructed section widths, factory weatherstrip tooling, compression and water sealing remain unmeasured.'};
const file=baseline?'artifacts/window-seal-r9-baseline-audit.json':'artifacts/window-seal-audit.json';await preserveFiles([file],'before-window-seal-audit');await writeFile(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
