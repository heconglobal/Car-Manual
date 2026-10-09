import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {headlightHoodPoint,headlightCoverPoint,headlightCoverPose,headlightLinkPose,headlightPose,headlightLinkage} from '../src/headlight-kinematics.js';
import * as T from 'three';
import {headlightParts} from '../src/headlight-catalog.js';
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
let maxDistanceError=0,maxHingeError=0,maxLinkError=0;
for(const side of [-1,1]){
 const x=side*.511,samples=Array.from({length:25},(_,i)=>[(i%5)/4,Math.floor(i/5)/4]);
 const closed=samples.map(([u,v])=>headlightCoverPoint(x,u,v));
 for(const [i,[u,v]]of samples.entries()){
  const expected=headlightHoodPoint(((x+(u-.5)*.258)/.659+1)/2,(-1.685+v*.31+1.786)/1.176);expected[1]+=.001;assert(distance(closed[i],expected)<1e-12,'closed cover no longer follows hood');
 }
 for(let step=0;step<=1000;step++){
  const lift=step/1000,posed=samples.map(([u,v])=>headlightCoverPoint(x,u,v,lift));
  for(let i=0;i<samples.length;i++)for(let j=i+1;j<samples.length;j++)maxDistanceError=Math.max(maxDistanceError,Math.abs(distance(closed[i],closed[j])-distance(posed[i],posed[j])));
  for(const [i,[u,v]]of samples.entries())maxDistanceError=Math.max(maxDistanceError,Math.abs(distance(posed[i],headlightCoverPoint(x,u,v,lift,.014))-.014));
  const hinge=[x,headlightPose.coverPivotY,headlightPose.coverPivotZ];maxHingeError=Math.max(maxHingeError,distance(hinge,headlightCoverPose(hinge,lift)));
  const link=headlightLinkPose(lift);maxLinkError=Math.max(maxLinkError,Math.abs(distance(link.motor,link.crank)-headlightLinkage.crankRadius),Math.abs(distance(link.bucket,link.crank)-headlightLinkage.linkLength));
 }
 // Keep a restrained raised silhouette while retaining the curved cover.
 for(const [u,v]of samples){const p=headlightCoverPoint(x,u,v,1);assert(p[1]<.87&&p[1]>.69,'raised cover outside intended envelope');}
}
assert(maxDistanceError<1e-12,'cover or its thickness changes during travel');assert(maxHingeError<1e-12,'cover hinge moves');assert(maxLinkError<1e-12,'bucket linkage changes length');
// Check the actual raised lamp meshes, not just abstract linkage points. The
// previous audit missed the bezel/aim hardware projecting through the lid.
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createHeadlightDetail}=await import('../src/headlight-detail.js');const {root,groups}=createHeadlightDetail();root.updateMatrixWorld(true);
let raisedMeshVertices=0,minimumRaisedClearance=Infinity;const critical=[];
for(const [side,centerX]of [['left',-.511],['right',.511]])for(const p of headlightParts.filter(p=>p.section===`headlight-${side}-lamp`&&!p.id.endsWith('pivot-bolts'))){
 let worst=null;
 for(const m of groups.get(p.id).children){if(m.userData.value!==true)continue;const a=m.geometry.attributes.position;
  for(let i=0;i<a.count;i++){
   const x=a.getX(i),y=a.getY(i),z=a.getZ(i),u=(x-centerX)/.258+.5;if(u<0||u>1)continue;
   if(z<headlightCoverPoint(centerX,u,0,1,.003)[2]||z>headlightCoverPoint(centerX,u,1,1,.003)[2])continue;
   let lo=0,hi=1;for(let k=0;k<20;k++){const v=(lo+hi)/2;if(headlightCoverPoint(centerX,u,v,1,.003)[2]<z)lo=v;else hi=v;}
   const clearance=headlightCoverPoint(centerX,u,(lo+hi)/2,1,.003)[1]-y;raisedMeshVertices++;
   if(!worst||clearance<worst.clearance)worst={id:p.id,clearance,position:[x,y,z]};
  }
 }
 if(!worst)continue;assert(worst.clearance>.005,p.id+' penetrates raised lid or loses 5 mm reconstructed clearance');minimumRaisedClearance=Math.min(minimumRaisedClearance,worst.clearance);
 // Confirm each part's critical point against the generated cover triangles.
 const cover=groups.get(`hl-${side}-cover`).children.filter(m=>m.userData.value===true);
 const hits=new T.Raycaster(new T.Vector3(...worst.position),new T.Vector3(0,1,0),0,1).intersectObjects(cover,false);assert(hits.length,p.id+' raised cover mesh missing above critical point');assert(hits[0].distance>.005,p.id+' actual raised cover mesh clips hardware');critical.push({...worst,meshClearance:hits[0].distance});
}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',sides:2,posesPerSide:1001,surfaceSamplesPerPose:25,maxDistanceError,maxHingeError,maxLinkError,raisedMeshVertices,minimumRaisedClearance,critical,checks:['Closed cover preserves the shared hood contour','Cover curvature, edge lengths and local attachment depth remain rigid throughout sampled motion','Independent cover hinge stays fixed','Bucket crank/link retain fixed lengths','Raised-cover envelope remains below 870 mm','Actual raised lamp/bucket/bezel/aim vertices retain at least 5 mm clearance beneath the cover; critical points ray-checked against actual cover triangles'],limits:'All cover/bucket axes, angles, motor stops and linkage dimensions except the sourced lamp-center datums remain reconstructed. The raised endpoint clears the tested hardware; complete moving cover/bucket contact, spring load, production dimensions and vehicle operation remain unverified.'};
const output='artifacts/completion-headlight/'+report.date.replace(/[:.]/g,'-');await mkdir(output,{recursive:true});await writeFile(output+'/cover-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
