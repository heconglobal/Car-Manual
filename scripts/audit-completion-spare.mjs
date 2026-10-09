import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {spareParts} from '../src/spare-catalog.js';
import {createSpareDetail,spareWheelPoint} from '../src/spare-detail.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {root,groups}=createSpareDetail();root.updateMatrixWorld(true);let vertices=0,meshes=0;
for(const p of spareParts){const g=groups.get(p.id);assert(g.children.length,p.id+' empty');for(const m of g.children){meshes++;vertices+=m.geometry.attributes.position.count;assert.equal(m.userData.partId,p.id);assert(m.geometry.attributes.position.array.every(Number.isFinite),p.id+' nonfinite');assert(m.matrixWorld.determinant()>0,p.id+' negative transform');}}
assert.equal(new Set(spareParts.map(p=>p.id)).size,spareParts.length);
const world=p=>{const v=spareWheelPoint(p);v[0]*=-1;return new T.Vector3(...v);},direction=new T.Vector3(0,-Math.cos(.48),-Math.sin(.48));
const rimHit=(x,z)=>new T.Raycaster(world([x,.18,z]),direction,0,.35).intersectObjects(groups.get('sp-rim').children,false);
assert.equal(rimHit(0,0).length,0,'compact rim center must be open');
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;assert.equal(rimHit(Math.cos(a)*.05,Math.sin(a)*.05).length,0,'lug hole obstructed');assert.equal(rimHit(Math.cos(a)*.122,Math.sin(a)*.122).length,0,'ventilation hole obstructed');}
assert(rimHit(.06,0).length,'wheel center web missing');
// Check actual geometry has both sourced 15-inch bead seats at 4-inch width.
const beadPoints=[];for(const m of groups.get('sp-rim').children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3(-a.getX(i),a.getY(i),a.getZ(i)).sub(new T.Vector3(0,.45,-1.09)).applyAxisAngle(new T.Vector3(1,0,0),-.48),r=Math.hypot(p.x,p.z);if(Math.abs(r-.1905)<1e-6)beadPoints.push(p.y);}}
assert(beadPoints.some(y=>Math.abs(y-.0508)<1e-6)&&beadPoints.some(y=>Math.abs(y+.0508)<1e-6),'15×4 inch bead seats missing');
const catalog=k=>spareParts.find(p=>p.id==='sp-'+k);assert.equal(catalog('rim').partNumber,'9590503');assert.equal(catalog('bracket').partNumber,'10041843');assert.equal(catalog('jack-bolt').partNumber,'10030929');assert.equal(catalog('wrench').partNumber,'14036400');assert.equal(catalog('wrench-clip').partNumber,null);assert.match(catalog('tire').serviceReference.rows[0][1],/415 kPa \/ 60 psi/);assert(spareParts.filter(p=>p.section==='spare-jack').every(p=>p.callout===3&&p.partNumber==='10030932'));
const b=id=>new T.Box3().setFromObject(groups.get(id));assert(b('sp-jack-base').min.x>0,'jack must remain on passenger side');assert(b('sp-retaining-rod').getSize(new T.Vector3()).x>.75,'retaining rod must span spare compartment');assert(b('sp-wrench').max.z>b('sp-tire').max.z,'wrench must lie behind spare');
const jackHead=new T.Raycaster(new T.Vector3(.426,.50,-.985),new T.Vector3(0,-1,0),0,.075).intersectObjects(groups.get('sp-jack-head').children,false);assert.equal(jackHead.length,0,'jack head groove obstructed');
const headBounds=b('sp-jack-head');assert(headBounds.max.y<.445,'jack exceeds stored height');
for(const p of spareParts){const box=b(p.id);assert(box.min.y>.24&&box.max.y<.65,p.id+' outside compartment height envelope');assert(box.min.z> -1.45&&box.max.z<-.68,p.id+' outside compartment length envelope');}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',parts:spareParts.length,meshes,vertices,checks:['All selectable components contain finite native geometry','Positive LHD-transformed geometry','Sourced 15-inch bead diameter and 4-inch bead-seat width','Open wheel center, five lug holes and five ventilation holes','Original 1985–88 catalog identities and owner compact-spare pressure','Separate stowage rod across compartment, behind-tire wrench and passenger-side jack','Open jack-head flange groove and static compartment envelope'],limits:'Original tire size/condition, wheel offset/bolt-circle/tooling, full jack internals/load rating/threads/engagement, precise stowage/hood/sunroof clearance and physical validation remain unverified.'};
const output='artifacts/completion-spare/'+report.date.replace(/[:.]/g,'-');await mkdir(output,{recursive:true});await writeFile(output+'/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
