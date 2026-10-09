import assert from 'node:assert/strict';
import * as T from 'three';
import {mkdir,writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {runId} from './preserve-files.mjs';
const sourceSha256=sourceFingerprint(),startedAt=new Date().toISOString();
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {chargingParts}=await import('../src/charging-catalog.js');
const {createChargingDetail}=await import('../src/charging-detail.js');
const battery=chargingParts.filter(p=>p.section==='charging-battery'),callouts=new Set(battery.map(p=>p.callout));
for(let n=1;n<=10;n++)assert(callouts.has(n),'GM battery figure callout '+n+' missing');
const part=battery.find(p=>p.id==='ch-battery-ground-bolt');assert.equal(part.callout,8);assert(part.sourceUrl.endsWith('#page=67'));assert(part.serviceReference.rows.some(row=>row[1]==='12337828'));
const model=createChargingDetail();model.root.updateMatrixWorld(true);const group=model.groups.get(part.id),bounds=new T.Box3().setFromObject(group),centre=bounds.getCenter(new T.Vector3());
assert(bounds.min.x>0,'Ground branch attachment must stay on the passenger side');
assert(Math.abs(centre.x-.655)<1e-6&&Math.abs(centre.z-.83)<1e-6,'Ground bolt does not meet body branch');
assert(bounds.min.y<=.581001&&bounds.max.y>=.605999,'Ground bolt lacks its nominal shank/head envelope');
let vertices=0;group.traverse(m=>{if(!m.isMesh)return;assert.equal(m.userData.partId,part.id);assert(m.matrixWorld.determinant()>0);assert(m.geometry.attributes.position.array.every(Number.isFinite));vertices+=m.geometry.attributes.position.count;});assert(vertices>100);
// A vertical ray must pass through the cable's actual annular eyelet at the
// bolt axis. Then an offset ray must hit the eyelet's wall: no solid washer.
const cable=model.groups.get('ch-negative-cable').children;for(const m of cable)m.material.side=T.DoubleSide;
const centreHits=new T.Raycaster(new T.Vector3(.655,.604,.83),new T.Vector3(0,-1,0),0,.008).intersectObjects(cable,false);assert.equal(centreHits.length,0,'Ground eyelet blocks tapping-bolt shank');
const wallHits=new T.Raycaster(new T.Vector3(.660,.604,.83),new T.Vector3(0,-1,0),0,.008).intersectObjects(cable,false);assert(wallHits.length,'Missing ground eyelet annulus');
assert.equal(sourceFingerprint(),sourceSha256,'Source changed during battery attachment check');
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,status:'passed',batterySelections:battery.length,distinctDrawingCallouts:[...callouts].filter(Number.isFinite).sort((a,b)=>a-b),partId:part.id,vertices,checks:['All ten battery mounting drawing callouts attributed','Ground bolt is distinct from cable and side-terminal hardware','Native finite positive-handed geometry at the body branch eyelet','Open cable eyelet clears the nominal tapping shank'],limits:'Callout attribution and reconstructed attachment fit only. Exact tooling, full cable routing, current GM supersessions, installed fastening torque, electrical bond performance and vehicle-wide quantities require separate evidence.'};
const output='artifacts/completion-battery/'+runId();await mkdir(output,{recursive:true});await writeFile(output+'/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
model.root.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});
