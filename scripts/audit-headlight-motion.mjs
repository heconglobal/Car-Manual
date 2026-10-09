import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {headlightParts} from '../src/headlight-catalog.js';
import {headlightPose} from '../src/headlight-kinematics.js';
import {triangleAreaSquared,triangleTree,firstTreeContact,transformPoint} from './triangle-contact.mjs';
const startedAt=new Date().toISOString(),sourceSha256=sourceFingerprint();
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createHeadlightDetail}=await import('../src/headlight-detail.js');
const {root,groups}=createHeadlightDetail();root.updateMatrixWorld(true);
const rotation=(angle,y,z)=>new T.Matrix4().makeTranslation(0,y,z).multiply(new T.Matrix4().makeRotationX(angle)).multiply(new T.Matrix4().makeTranslation(0,-y,-z));
const stats={degenerateTriangles:0,canonicalTriangles:0,movingParts:0,coverFeatures:0};
function triangles(meshes){const result=[];
 for(const mesh of meshes){const geometry=mesh.geometry,position=geometry.attributes.position,index=geometry.index;const count=index?.count??position.count;
  for(let i=0;i<count;i+=3){const triangle=[];for(let j=0;j<3;j++){const k=index?index.getX(i+j):i+j;triangle.push(...transformPoint([position.getX(k),position.getY(k),position.getZ(k)],mesh.matrixWorld.elements));}
   if(triangleAreaSquared(triangle)<1e-28){stats.degenerateTriangles++;continue;}result.push(triangle);
  }
 }stats.canonicalTriangles+=result.length;return result;
}
const feature=(id,role,meshes)=>{assert(meshes.length,id+' '+role+' has no canonical meshes');const t=triangles(meshes);assert(t.length,id+' '+role+' has no triangles');return {id,role,triangles:t.length,tree:triangleTree(t)};};
const sides=[];
for(const side of['left','right']){
 const bucket=headlightParts.filter(p=>p.section===`headlight-${side}-lamp`&&!p.id.endsWith('pivot-bolts')).map(p=>feature(p.id,'moving bucket',groups.get(p.id).children.filter(m=>m.isMesh&&m.userData.option==='headlights'&&m.userData.value===true)));
 const cover=[];
 for(const suffix of['cover','filler','cover-fasteners','hinge']){const id=`hl-${side}-${suffix}`,meshes=groups.get(id).children.filter(m=>m.isMesh&&m.userData.option==='headlights'&&m.userData.value===false);
  for(const materialName of new Set(meshes.map(m=>m.userData.materialName)))cover.push(feature(id,materialName,meshes.filter(m=>m.userData.materialName===materialName)));
 }
 stats.movingParts+=bucket.length;stats.coverFeatures+=cover.length;sides.push({side,bucket,cover});
}
// The actual canonical meshes are retained in these trees. No reduced-detail
// proxy or part box decides a collision, and no geometry is rebuilt per pose.
const contacts=[],samples=[],toleranceMetres=1e-7,steps=40;
// Two non-production controls establish that the real meshes, motion groups
// and broad/narrow phases can expose a collision. No application mesh changes.
const negativeControls=[];
for(const {side,bucket,cover}of sides){
 const oldCover=rotation(.48,headlightPose.coverPivotY,headlightPose.coverPivotZ).invert();let oldHit=null;
 for(const part of bucket){for(const target of cover){const hit=firstTreeContact(part.tree,target.tree,oldCover.elements,{tolerance:toleranceMetres});if(hit){oldHit={bucketPart:part.id,coverPart:target.id,coverFeature:target.role,...hit};break;}}if(oldHit)break;}
 negativeControls.push({side,control:'earlier 0.48-radian raised cover transform',detected:!!oldHit,witness:oldHit});
 // Align centroids of real, nondegenerate bucket and plastic-rib triangles.
 // This deliberately misplaced rib/bucket pairing must be rejected even
 // though their other native geometry and retained part identities are real.
 const part=bucket.find(p=>p.id.endsWith('upper-bezel')),rib=cover.find(p=>p.id.endsWith('filler')&&p.role==='plastic');
 const first=node=>node.rows?node.rows[0].triangle:first(node.left);
 const center=t=>[0,1,2].map(i=>(t[i]+t[i+3]+t[i+6])/3),a=center(first(part.tree)),b=center(first(rib.tree));
 const shifted=new T.Matrix4().makeTranslation(...b.map((v,i)=>v-a[i]));
 const hit=firstTreeContact(part.tree,rib.tree,shifted.elements,{tolerance:toleranceMetres});
 negativeControls.push({side,control:'actual bucket/rib triangle centroids deliberately superposed',detected:!!hit,witness:hit&&{bucketPart:part.id,coverPart:rib.id,coverFeature:rib.role,...hit}});
}
for(let step=0;step<=steps;step++){
 const lift=step/steps;
 const bucket=rotation(headlightPose.closedAngle*(1-lift),headlightPose.pivotY,headlightPose.pivotZ);
 const cover=rotation(headlightPose.coverRaisedAngle*lift,headlightPose.coverPivotY,headlightPose.coverPivotZ);
 const relative=cover.clone().invert().multiply(bucket);let count=0;
 for(const {side,bucket:parts,cover:features}of sides)for(const part of parts)for(const target of features){
  const hit=firstTreeContact(part.tree,target.tree,relative.elements,{tolerance:toleranceMetres});if(!hit)continue;
  count++;contacts.push({side,lift,bucketPart:part.id,coverPart:target.id,coverFeature:target.role,...hit,witnessFrame:'closed cover / final US-LHD frame',worldMovingTriangle:Array.from({length:3},(_,i)=>transformPoint(hit.movingTriangle.slice(i*3,i*3+3),cover.elements)).flat(),worldFixedTriangle:Array.from({length:3},(_,i)=>transformPoint(hit.fixedTriangle.slice(i*3,i*3+3),cover.elements)).flat()});
 }
 samples.push({lift,contactPairs:count});console.log('Headlight motion '+step+'/'+steps+': '+count+' contacting part/feature pairs');
}
const unchanged=sourceFingerprint()===sourceSha256;
const inputFiles=['src/headlight-detail.js','src/headlight-kinematics.js','src/headlight-catalog.js','src/geometry.js','src/vehicle-frame.js','scripts/audit-headlight-motion.mjs','scripts/triangle-contact.mjs'];
const inputs=await Promise.all(inputFiles.map(async path=>({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')})));
const pairSummary=[...new Set(contacts.map(c=>[c.bucketPart,c.coverPart,c.coverFeature].join('|')))].map(key=>{const hits=contacts.filter(c=>[c.bucketPart,c.coverPart,c.coverFeature].join('|')===key);return {bucketPart:hits[0].bucketPart,coverPart:hits[0].coverPart,coverFeature:hits[0].coverFeature,firstLift:Math.min(...hits.map(c=>c.lift)),lastLift:Math.max(...hits.map(c=>c.lift)),sampleCount:hits.length};});
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,unchanged,status:unchanged&&!contacts.length&&negativeControls.every(c=>c.detected)?'passed':'failed',inputs,stats,posesPerSide:steps+1,toleranceMetres,samples,pairSummary,contacts,negativeControls,contactExclusions:[],scopeExclusions:['Bucket pivot-bolts are fixed; they are not part of the rotating bucket.','Unflagged hinge crossbar, cover spring and fixed mounting structure are outside this moving cover/bucket check.','Crank/link joint motion, motor internals, flexible harness deformation and physical contact-driven cover timing are not checked.'],limits:'Actual authored triangle surface intersections at 41 reconstructed poses per side, including lid, underside ribs/pads/fasteners and moving hinge arms. No cover-to-bucket contact is silently exempted, including rubber pads whose intended mating surface is unverified. Near contacts within 0.1 micrometre are reported as contacts. This is sampled surface evidence, not continuous clearance, closed-solid containment, factory calibration, spring-force analysis or physical operation validation.'};
const output='artifacts/headlight-motion/'+startedAt.replace(/[:.]/g,'-');await mkdir(output,{recursive:true});await writeFile(output+'/motion-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,output,stats,pairSummary},null,2));
assert(unchanged,'source changed during headlight motion audit');assert.equal(contacts.length,0,'reconstructed moving headlight surfaces contact; inspect saved part/pose witnesses');
assert(negativeControls.every(c=>c.detected),'headlight motion audit failed to detect an injected native-mesh collision');
