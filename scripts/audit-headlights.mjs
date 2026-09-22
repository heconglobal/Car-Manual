import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createHeadlightDetail,headlightHoodPoint}=await import('../src/headlight-detail.js');
const {headlightParts}=await import('../src/headlight-catalog.js');
const {root,groups}=createHeadlightDetail();root.updateMatrixWorld(true);
const clearances=[];
for(const [id,g]of groups){
 let excess=-Infinity,where;assert(g.children.length,id+' missing geometry');
 for(const m of g.children){
  assert(m.geometry.attributes.position.array.every(Number.isFinite),id+' nonfinite geometry');
  assert.equal(m.userData.partId,id);assert(m.matrixWorld.determinant()>0,id+' negative scale');
  if(m.userData.option&&m.userData.value!==false)continue;
  const a=m.geometry.attributes.position;
  for(let i=0;i<a.count;i++){
   const x=a.getX(i),y=a.getY(i),z=a.getZ(i);
   if(Math.abs(x)>.659||z< -1.786||z>-.61)continue;
   const hoodY=headlightHoodPoint((x/.659+1)/2,(z+1.786)/1.176)[1],d=y-hoodY;
   if(d>excess){excess=d;where=[x,y,z];}
  }
 }
 // Outer cover edge is intentionally a small raised lip above the hood skin.
 // All mechanism vertices must remain beneath it; allow only mesh tolerance.
 if(!id.endsWith('-cover'))clearances.push({id,maxAboveHood:excess,where});
}
// The original gear has recessed cushion pockets, not open windows. Ray
// checks verify a backing web at a pocket and an actual open shaft bore.
for(const side of ['left','right']){
 const x=side==='left'?-.355:.355,s=side==='left'?-1:1,gear=groups.get('hl-'+side+'-output-gear');
 const hit=(g,y,z)=>new T.Raycaster(new T.Vector3(x+s*.12,y,z),new T.Vector3(-s,0,0)).intersectObjects(g.children,false);
 assert(hit(gear,.542+.016/Math.sqrt(2),-1.467+.016/Math.sqrt(2)).length,'gear cushion pocket requires backing web');
 assert.equal(hit(gear,.542,-1.467).length,0,'output-gear shaft bore must remain open');
 assert(hit(groups.get('hl-'+side+'-housing'),.542+.015,-1.467).length,'gearcase needs a back wall behind the gear');
}
const collisions=clearances.filter(p=>p.maxAboveHood>.0025);
console.log(JSON.stringify(collisions,null,2));assert.equal(collisions.length,0,'closed headlight hardware protrudes through hood');
assert.equal(headlightParts.length,groups.size);
await writeFile('artifacts/headlight-clearance-audit.json',JSON.stringify({date:new Date().toISOString(),parts:headlightParts.length,closedHoodInterference:'passed',toleranceMetres:.0025,maximum:clearances.reduce((a,b)=>a.maxAboveHood>b.maxAboveHood?a:b)},null,2)+'\n');
console.log('Passed headlight finite geometry, picking IDs, positive transforms and closed-hood contour clearance.');
