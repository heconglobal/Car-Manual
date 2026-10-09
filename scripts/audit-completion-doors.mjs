import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {doorMechanismParts,doorMechanismSections} from '../src/door-mechanism-catalog.js';
import {buildDoorMechanisms} from '../src/door-mechanism-detail.js';
import {geometryTools} from '../src/geometry.js';
import {createMaterials} from '../src/materials.js';
import {bodyPoint} from '../src/body-datums.js';
import {correctLegacyHandedness} from '../src/vehicle-frame.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const root=new T.Group(),groups=new Map(doorMechanismParts.map(p=>{const g=new T.Group();g.userData={partId:p.id,spread:new T.Vector3(...p.spread)};root.add(g);return[p.id,g];}));
const h=geometryTools(groups,createMaterials());h.mapAdded(()=>buildDoorMechanisms(h),bodyPoint);h.optimize();correctLegacyHandedness(groups);root.updateMatrixWorld(true);
assert.equal(new Set(doorMechanismParts.map(p=>p.id)).size,doorMechanismParts.length);
let vertices=0,meshes=0;
for(const p of doorMechanismParts){
 assert(doorMechanismSections.some(s=>s.id===p.section),p.id+' missing section');
 const g=groups.get(p.id);assert(g.children.length,p.id+' empty');
 for(const m of g.children){meshes++;vertices+=m.geometry.attributes.position.count;assert(m.geometry.attributes.position.array.every(Number.isFinite),p.id+' invalid geometry');assert.equal(m.userData.partId,p.id);assert.equal(m.userData.detailPartId,p.id);assert(m.matrixWorld.determinant()>0,p.id+' negative scale');assert.equal(m.userData.option,p.option);assert.equal(m.userData.value,p.value);}
 const b=new T.Box3().setFromObject(g),isLeft=p.id.includes('-left-');assert(isLeft?b.max.x<-.72:b.min.x>.72,p.id+' wrong body side');assert(b.min.y>.27&&b.max.y<.82,p.id+' outside door vertical envelope');assert(b.min.z>-.61&&b.max.z<.60,p.id+' outside door longitudinal envelope');
}
// Application facts independently transcribed from PDF 301–302, avoiding a
// test that merely compares the catalog to itself.
for(const [side,manual,electric]of [['left','20302331','20311753'],['right','20302330','20311752']]){
 const part=k=>doorMechanismParts.find(p=>p.id===`bd-door-${side}-${k}`);
 assert.equal(part('manual-regulator').partNumber,manual);assert.equal(part('manual-regulator').value,false);
 assert.equal(part('power-regulator').partNumber,electric);assert.equal(part('power-regulator').value,true);
 assert.equal(part('window-motor').option,'powerWindows');assert.match(part('window-motor').description,/unresolved annotation/);
 assert.equal(part('glass-bushings').partNumber,'20562754');assert.match(part('glass-bushings').description,/1984 steel-type/);
 for(const key of ['power-lock-actuator','power-lock-bracket','power-lock-bellcrank','power-lock-rod']){assert.equal(part(key).option,'powerLocks');assert.equal(part(key).value,true);}
 assert.equal(part('belt-trim-retainer').partNumber,side==='left'?'20352607':'20352606');
 assert.match(part('belt-trim-retainer').description,/1986–88 retainers are RH 20350876 \/ LH 20350877/);
 assert.equal(part('inner-belt-seal').partNumber,side==='left'?'20320535':'20320534');
 for(const [key,number]of [['outer-panel-block','20505072'],['front-panel-block','20505073']]){assert.equal(part(key).partNumber,number);assert.equal(part(key).section,`body-door-${side}-panel`);}
 assert.equal(part('power-lock-stop').partNumber,'20269755');assert.equal(part('power-lock-stop').section,`body-door-${side}-window`);
 assert.match(part('power-lock-stop').description,/regulator variant.*unverified/i);
 for(const key of ['belt-trim-retainer','inner-belt-seal','outer-panel-block','front-panel-block','power-lock-stop'])assert.equal(part(key).option,undefined,key+' unsupported option binding');
 // An open channel must admit its roller near its mouth and retain a back.
 const sign=side==='left'?-1:1,ray=(x,y,z,far)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(-sign,0,0),0,far).intersectObjects(groups.get(`bd-door-${side}-glass-cam`).children,false);
 const [,,z]=bodyPoint([0,.694,.02]),[,y]=bodyPoint([0,.694,.02]);assert.equal(ray(sign*.840,y,z,.008).length,0,'glass cam mouth blocked');assert(ray(sign*.840,y,z,.02).length,'glass cam has no back');
}
// Mirror placement is evaluated after the actual datum and handedness mapping.
for(const p of doorMechanismParts.filter(p=>p.id.includes('-left-'))){
 const a=new T.Box3().setFromObject(groups.get(p.id)),b=new T.Box3().setFromObject(groups.get(p.id.replace('-left-','-right-')));
 // Both sides use the same listed return spring, including its winding hand;
 // tessellated helix ends therefore need a 0.1 mm envelope tolerance.
 const tolerance=p.id.endsWith('lock-return-spring')?.0001:.00001;
 for(const [v,w]of [[a.min.x,-b.max.x],[a.max.x,-b.min.x],[a.min.y,b.min.y],[a.max.y,b.max.y],[a.min.z,b.min.z],[a.max.z,b.max.z]])assert(Math.abs(v-w)<tolerance,p.id+' asymmetric placement');
}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',parts:doorMechanismParts.length,sections:doorMechanismSections.length,meshes,vertices,checks:['Nonempty finite selectable native geometry','Positive transforms and correct LHD side after body remap','Per-door vertical and longitudinal packaging envelope','Mutually exclusive manual/power regulator option identity','AU3 electric-lock option flags','1985–88 glass bushing and LH/RH regulator catalog identities','Open glass-cam mouth with retaining back wall','Mirrored reconstructed placement'],limits:'Static reconstructed packaging only. Glass attachments, exact factory profiles, complete latch/motor internals, motion and glass/door collision, adjustment, electrical wiring and physical vehicle validation remain unverified.'};
const stamp=report.date.replace(/[:.]/g,'-'),output=`artifacts/completion-doors/${stamp}`;await mkdir(output,{recursive:true});await writeFile(output+'/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
