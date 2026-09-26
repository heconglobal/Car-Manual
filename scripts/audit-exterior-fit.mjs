import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {bodyPoint} from '../src/body-datums.js';
import {exteriorBeltHeight} from '../src/body-contours.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createMaterials}=await import('../src/materials.js');
const {geometryTools}=await import('../src/geometry.js');
const {parts}=await import('../src/data.js');
const {buildBody}=await import('../src/body.js');
const {buildMechanics}=await import('../src/mechanics.js');
const {correctLegacyHandedness}=await import('../src/vehicle-frame.js');
const root=new T.Group(),groups=new Map(parts.map(p=>{const g=new T.Group();root.add(g);return[p.id,g];}));
const h=geometryTools(groups,createMaterials());buildBody(h);buildMechanics(h);h.optimize();correctLegacyHandedness(groups);root.updateMatrixWorld(true);
const checks=[],ray=new T.Raycaster();
const check=(name,fn)=>{const measurements=fn();checks.push({name,status:'passed',measurements});};
const cast=(id,p,d)=>{ray.set(new T.Vector3(...p),new T.Vector3(...d));return ray.intersectObjects(groups.get(id).children,false);};
check('Side molding remains above its body skin across the full ribbed section',()=>{
 let samples=0,minStandOff=Infinity;
 for(const side of ['left','right'])for(const [trim,panel,stations]of [
  ['door-molding','door',[-.50,-.25,0,.25,.54]],['front-molding','fender',[-1.60,-.83,-.70]],['rear-molding','quarter',[.64,.74,.83,1.55,1.65]]]){
  const sign=side==='left'?-1:1;
  for(const z of stations)for(const dy of [-.007,0,.007]){
   const p=bodyPoint([0,exteriorBeltHeight(z)+dy,z]);p[0]=sign*1.1;
   const d=[-sign,0,0],skin=cast(panel+'-'+side,p,d)[0],molding=cast(trim+'-'+side,p,d)[0];
   assert(skin&&molding,`${trim}-${side} missing at ${z}/${dy}`);
   const stand=skin.distance-molding.distance;assert(stand>0,`${trim}-${side} buried by ${-stand*1000} mm at ${z}/${dy}`);minStandOff=Math.min(minStandOff,stand);samples++;
  }
 }
 return{samples,minStandOffMm:minStandOff*1000};
});
check('Installed molding centres follow one straight side elevation',()=>{
 const start=bodyPoint([0,exteriorBeltHeight(-1.65),-1.65]),end=bodyPoint([0,exteriorBeltHeight(1.65),1.65]);let error=0;
 for(let i=0;i<=100;i++){const z=-1.65+3.3*i/100,p=bodyPoint([0,exteriorBeltHeight(z),z]),expected=start[1]+(end[1]-start[1])*(p[2]-start[2])/(end[2]-start[2]);error=Math.max(error,Math.abs(p[1]-expected));}
 assert(error<.001);return{maxDeviationMm:error*1000};
});
check('Intake opening is below the uninterrupted quarter molding and clear of paint',()=>{
 let samples=0;
 for(const z of [.66,.72,.79])for(const dy of [-.110,-.075,-.045]){const p=bodyPoint([-1.1,exteriorBeltHeight(z)+dy,z]);assert.equal(cast('quarter-left',p,[1,0,0]).length,0,'paint across intake');samples++;}
 const box=new T.Box3().setFromObject(groups.get('side-intake')),molding=new T.Box3().setFromObject(groups.get('rear-molding-left'));assert(box.max.y<molding.min.y-.008);return{samples,upperClearanceMm:(molding.min.y-box.max.y)*1000};
});
check('Tread remains within the shallow road-tire radius envelope',()=>{
 const a=groups.get('wheels').children.filter(m=>m.userData.materialName==='rubber');let maxRadius=0;
 for(const m of a){const p=m.geometry.attributes.position;for(let i=0;i<p.count;i++){const z=p.getZ(i),cz=z<0?-1.1865:1.1865;maxRadius=Math.max(maxRadius,Math.hypot(p.getY(i)-.307,z-cz));}}
 assert(maxRadius<.310,'tread projects beyond a shallow road-tire envelope');return{maximumRadiusMm:maxRadius*1000};
});
// Build the option parts without merging so the actual contact surfaces can
// be checked independently; production still uses this same builder.
const {buildSpoilers}=await import('../src/spoilers.js');
const {deckHeight}=await import('../src/body-contours.js');
const optionGroups=new Map(['deck-carrier','deck-wing'].map(id=>[id,new T.Group()]));
const oh=geometryTools(optionGroups,createMaterials());let contacts;
oh.mapAdded(()=>{contacts=buildSpoilers(oh,deckHeight);},bodyPoint);
for(const g of optionGroups.values())g.updateMatrixWorld(true);
for(const [name,legs,foils,topOnly]of [
 ['Carrier supports meet the swept spoiler underside',contacts.carrierSupports,contacts.carrierFoils,false],
 ['Wing pedestals end inside the lower foil skin',contacts.wingPedestals,contacts.wingFoils,true]
])check(name,()=>{
 let samples=0,maxFitError=0;
 for(const m of legs){const p=m.geometry.attributes.position,uv=m.geometry.attributes.uv;
  for(let i=0;i<p.count;i++){if(topOnly&&uv.getY(i)<.999)continue;
   ray.set(new T.Vector3(p.getX(i),1.4,p.getZ(i)),new T.Vector3(0,-1,0));const hit=ray.intersectObjects(foils,false)[0];if(!hit)continue;
   const error=Math.abs(p.getY(i)-hit.point.y);maxFitError=Math.max(maxFitError,error);samples++;
  }
 }
 assert(samples>30,'insufficient physical contact samples');assert(maxFitError<.002,`${name}: ${maxFitError*1000} mm`);
 return{samples,maxFitErrorMm:maxFitError*1000};
});
const report={sourceSha256:sourceFingerprint(),reviewedAt:new Date().toISOString(),status:'passed',checks,limits:'Interface and silhouette regressions on actual shared geometry. Reconstruction checks, not production tooling or factory tolerance certification.'};
await writeFile('artifacts/exterior-fit-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
