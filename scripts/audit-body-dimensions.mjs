import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {bodyNominal as nominal,bodyStations as station,bodyPoint} from '../src/body-datums.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const baselineIndex=process.argv.indexOf('--baseline'),baseline=baselineIndex>=0?process.argv[baselineIndex+1]:null;
const {createBodyDetail}=await import(baseline?pathToFileURL(resolve(baseline,'body-detail.js')).href:'../src/body-detail.js');
const {defaultConfiguration}=await import('../src/configuration.js');
const {bodySurfaceOwners}=await import('../src/body-catalog.js');
const model=createBodyDetail();model.root.updateMatrixWorld(true);
const active=m=>!m.userData.option||defaultConfiguration[m.userData.option]===m.userData.value;
const meshes=(id,material)=>model.groups.get('bd-skin-'+id).children.filter(m=>m.isMesh&&active(m)&&(!material||m.userData.materialName===material));
function bounds(ids,material){const b=new T.Box3();for(const id of ids)for(const m of meshes(id,material))b.expandByObject(m);return b;}
function section(id,axis,value,material){const points=[];for(const m of meshes(id,material)){
 const a=m.geometry.attributes.position,ix=m.geometry.index;
 for(let i=0;i<(ix?.count||a.count);i+=3){const p=[0,1,2].map(k=>new T.Vector3().fromBufferAttribute(a,ix?ix.getX(i+k):i+k).applyMatrix4(m.matrixWorld));
  for(let j=0;j<3;j++){const v=p[j],w=p[(j+1)%3],d=v[axis]-value,e=w[axis]-value;if(Math.abs(d)<1e-8)points.push(v);if(d*e<0)points.push(v.clone().lerp(w,-d/(e-d)));}
 }}return points;}
const rows=[];
function measure(code,name,actual,target,tolerance=.00025){const delta=actual-target,passed=Math.abs(delta)<=tolerance;rows.push({code,name,actualMm:actual*1000,nominalMm:target*1000,errorMm:delta*1000,toleranceMm:tolerance*1000,status:passed?'passed':'failed'});}
const exteriorIds=bodySurfaceOwners.map(([id])=>id).filter(id=>!id.startsWith('mirror-')&&id!=='antenna'&&!id.startsWith('door-trim'));
const envelope=bounds(exteriorIds),cowl=section('glass','x',0,'glass').sort((a,b)=>a.z-b.z)[0],deck=section('rear-window','x',0,'glass').sort((a,b)=>a.y-b.y)[0];
assert(cowl&&deck,'Missing physical glass reference points');
measure('L103','Overall exterior length',envelope.max.z-envelope.min.z,nominal.length);
measure('L104','Front overhang',station.frontAxle-envelope.min.z,nominal.frontOverhang);
measure('L105','Rear overhang',envelope.max.z-station.rearAxle,nominal.rearOverhang);
measure('W103','Exterior width excluding mirrors and marker lamps',envelope.max.x-envelope.min.x,nominal.width);
// R7 withdraws the unsupported R5 equation of H102/H104 with the entire
// painted fascia minimum. Keep BOTH discrepancies in the report; do not
// redefine a pad or enlarge tolerance merely to obtain a passing row.
const unresolvedBumperReferences=[['H102','nose',nominal.frontBumperGround],['H104','rear-fascia',nominal.rearBumperGround]].map(([code,id,nominal])=>({code,publishedBumperGroundMm:nominal*1000,modeledFasciaMinimumMm:bounds([id]).min.y*1000,status:'unresolved',reason:'Physical measurement surface requires confirmation; apron contour reconstructed from production profile and photographs.'}));
measure('H101','Solid-roof body height',bounds(['roof','rear-clip']).max.y,nominal.height);
measure('L125','Cowl position aft of base grid',cowl.z-station.rearAxle+nominal.rearAxleBaseGrid,nominal.cowlBaseGrid);
measure('H114','Cowl height at vehicle centreline',cowl.y,nominal.cowlHeight);
measure('H138','Deck point height at vehicle centreline',deck.y,nominal.deckPointHeight);
measure('L123','Cowl-to-deck upper structure length',deck.z-cowl.z,nominal.upperStructureLength);
const doorSection=['door-left','door-right'].flatMap(id=>section(id,'z',station.seat,'red'));
measure('W117','Painted body width at front seating reference',Math.max(...doorSection.map(p=>p.x))-Math.min(...doorSection.map(p=>p.x)),nominal.seatSectionWidth,.0003);
for(const side of ['left','right']){
 const rocker=bounds(['rocker-'+side]);
 measure('H112-'+side,'Front rocker bottom, '+side,Math.min(...section('rocker-'+side,'z',rocker.min.z).map(p=>p.y)),nominal.rockerFront);
 measure('H111-'+side,'Rear rocker bottom, '+side,Math.min(...section('rocker-'+side,'z',rocker.max.z).map(p=>p.y)),nominal.rockerRear);
 measure('H133-'+side,'Painted closed door bottom, '+side,bounds(['door-'+side],'red').min.y,nominal.doorBottom);
}
for(const id of ['fender','quarter','door','rocker']){const a=bounds([id+'-left']),b=bounds([id+'-right']);assert(Math.abs(a.min.x+b.max.x)<.000001&&Math.abs(a.max.x+b.min.x)<.000001,id+' lost bilateral reference symmetry');}
// These anchor invariants protect wheel placement during upper-body correction.
for(const z of [station.frontAxle,station.rearAxle])for(const y of [.168,.308,.640])assert.equal(bodyPoint([0,y,z])[2],z);
const report={sourceSha256:baseline?null:sourceFingerprint(),baselineSource:baseline,reviewedAt:new Date().toISOString(),status:baseline?'historical-comparison':rows.every(r=>r.status==='passed')?'passed':'failed',source:'Pontiac 1985 MVMA PDF 22–23; definitions PDF 29 and 31',unresolvedBumperReferences,configuration:'Coupe/SE, solid roof, plain deck; manufacturer design load of two front occupants, no cargo',rows,referencePoints:{cowl:cowl.toArray(),deck:deck.toArray(),seatingStation:station.seat,bodyMin:envelope.min.toArray(),bodyMax:envelope.max.toArray()},limits:'Numerical mesh agreement with selected nominal references. Tolerances cover tessellation/numerical sampling, not manufacturing tolerances. Smooth connecting surfaces, glazing sections, panel gaps, hinge travel, body-shop datums, full concealed hardware, bumper ground-clearance interpretation and owner acceptance remain unverified. The generic key-sheet sedan drawing is not a Fiero silhouette template.'};
await writeFile(baseline?'artifacts/body-dimension-baseline.json':'artifacts/body-dimension-audit.json',JSON.stringify(report,null,2)+'\n');
console.table(rows.map(({code,actualMm,nominalMm,errorMm,status})=>({code,actualMm:+actualMm.toFixed(3),nominalMm,errorMm:+errorMm.toFixed(3),status})));
if(!baseline)assert.equal(report.status,'passed','Body nominal dimension mismatch');
