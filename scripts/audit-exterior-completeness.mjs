// Explicit exterior inventory and installed interfaces, independent of a
// catalog's self-reported part count. This does not certify concealed hardware.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
import {bodyPoint} from '../src/body-datums.js';
import {sideWindow,rail,aPost} from '../src/glazing-contours.js';
import {verticalSurfaceIndex} from './vertical-surface-index.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createBodyDetail}=await import('../src/body-detail.js');
const {createLightingDetail}=await import('../src/lighting-detail.js');
const body=createBodyDetail(),lighting=createLightingDetail();body.root.updateMatrixWorld(true);lighting.root.updateMatrixWorld(true);
const pairs=prefix=>['left','right'].map(side=>prefix+'-'+side);
const regions=[
 ['Front fascia','GM 22P PDF237, items16/47',['nose',...pairs('front-pad'),'front-fascia-molding','front-plate-mount','front-deflector','nose-emblem']],
 ['Hood and fenders','GM 22P PDF237, items1/7',['hood',...pairs('fender'),...pairs('front-molding')]],
 ['Doors and fittings','GM 22P PDF300/336',['door-left','door-right',...pairs('door-glass'),...pairs('handle'),...pairs('door-lock'),...pairs('door-molding'),...pairs('belt-seal'),...pairs('mirror'),...pairs('mirror-glass'),...pairs('mirror-mount')]],
 ['Roof and windshield','GM 22P PDF336, items26–29/36',['roof','glass',...pairs('a-pillar-seal'),...pairs('upper-window-seal'),...pairs('windshield-belt-filler'),'sunroof-glass','sunroof-seal']],
 ['Notchback and backlight','GM 22P PDF336, items3/24/26/39',['rear-clip','rear-window',...pairs('sail'),...pairs('b-pillar-seal'),...pairs('backlight-filler')]],
 ['Rear quarters and sills','GM 22P PDF336, items6/9/13/17/23',[...pairs('quarter'),...pairs('rocker'),...pairs('rear-molding'),'fuel-door','fuel-door-hinge','side-intake']],
 ['Rear deck and alternatives','GM 22P PDF332/336/343',['decklid',...pairs('deck-vent'),'deck-carrier','deck-wing']],
 ['Rear fascia','GM 22P PDF336, item38',['rear-fascia',...pairs('rear-pad'),'rear-fascia-molding','rear-plate-mount','rear-emblems']],
 ['External equipment','GM 22P PDF281/284',['antenna','cowl-grille',...pairs('wiper-arm'),...pairs('wiper-blade')]],
];
const inventory=[];for(const [region,source,ids]of regions)for(const id of ids){const group=body.groups.get('bd-skin-'+id);assert(group?.children.length,id+' missing');const b=new T.Box3().setFromObject(group);assert(!b.isEmpty()&&b.min.toArray().every(Number.isFinite)&&b.max.toArray().every(Number.isFinite),id);inventory.push({region,id,source,status:'present',bounds:{min:b.min.toArray(),max:b.max.toArray()}});}
for(const side of ['left','right'])for(const scope of ['front','rear','marker-front','marker-rear','license']){const id='lt-'+scope+'-'+side+'-'+(scope==='rear'?'outer-lens':'lens'),g=lighting.groups.get(id);assert(g?.children.length,id);inventory.push({region:'Exterior lighting',id,source:'GM 22P PDF72 / 1985 DIY lamps',status:'present'});}
const checks=[];function check(name,fn){checks.push({name,...fn(),status:'passed'});}
check('Ten opening seals/retainers/fillers are bilateral, independently selectable and stay with the body',()=>{
 const added=['a-pillar-seal','upper-window-seal','b-pillar-seal','windshield-belt-filler','backlight-filler'];
 for(const prefix of added){const gs=pairs(prefix).map(id=>body.groups.get('bd-skin-'+id));const bs=gs.map(g=>new T.Box3().setFromObject(g));assert(Math.abs(bs[0].min.x+bs[1].max.x)<1e-6,prefix);assert(Math.abs(bs[0].max.y-bs[1].max.y)<1e-6,prefix);for(const g of gs)for(const m of g.children){assert(!m.userData.option,'Body trim must not disappear with lowered glass');assert.equal(m.userData.partId,g.name);}}
 return{parts:10};
});
check('Seal mesh reaches the real side-glass top and rear boundaries',()=>{
 let samples=0,worst=0;for(const s of [-1,1])for(const [prefix,path]of [['a-pillar-seal',u=>{const p=aPost(u);p[0]*=s;return p;}],['upper-window-seal',u=>{const p=rail(u);p[0]*=s;return p;}],['b-pillar-seal',u=>sideWindow(s,1,u)]]){
  const g=body.groups.get('bd-skin-'+prefix+'-'+(s>0?'left':'right')),vertices=[];for(const m of g.children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++)vertices.push(new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld));}
  for(let i=0;i<=20;i++){const p=bodyPoint(path(i/20));p[0]*=-1;const v=new T.Vector3(...p),d=Math.sqrt(Math.min(...vertices.map(q=>q.distanceToSquared(v))));assert(d<.009,prefix+' leaves a gap');worst=Math.max(worst,d);samples++;}
 }
 return{samples,maxBoundaryDistanceMm:worst*1000};
});
check('Four wheelhouse liners and their fore/aft returns are present behind the wheel lips',()=>{
 let vertices=0;for(const side of ['left','right'])for(const end of ['front','rear']){
 const id='bd-'+end+'-liner-'+side,g=body.groups.get(id),cz=end==='front'?-1.1865:1.1865;assert(g?.children.length,id);const b=new T.Box3().setFromObject(g);assert(b.min.y<.246&&b.max.y>.65,'liner lacks lower returns/crown');
 for(const m of g.children){const a=m.geometry.attributes.position;assert(a.array.every(Number.isFinite));vertices+=a.count;}assert(side==='left'?b.max.x<-.58:b.min.x>.58);assert(b.min.z<cz-.34&&b.max.z>cz+.34);
 }
 return{liners:4,vertices};
});
check('Hidden roof attachment hardware is beneath the installed solid skin',()=>{
 const height=verticalSurfaceIndex(body.groups.get('bd-skin-roof').children.filter(m=>m.userData.materialName==='red'&&(!m.userData.option||m.userData.value==='solid')));let samples=0,minimum=Infinity;
 for(const m of body.groups.get('bd-roof-fasteners').children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld),ys=height(p.x,p.z);if(!ys.length)continue;const d=Math.max(...ys)-p.y;assert(d>.010,'roof hardware pierces skin');minimum=Math.min(minimum,d);samples++;}}
 assert(samples>100);return{samples,minimumCoverMm:minimum*1000};
});
check('Upper fender/quarter fasteners are concealed by the actual painted panels',()=>{
 let samples=0,minimum=Infinity;
 for(const side of ['left','right'])for(const end of ['front','rear']){
  const panel=(end==='front'?'fender-':'quarter-')+side,height=verticalSurfaceIndex(body.groups.get('bd-skin-'+panel).children.filter(m=>m.userData.materialName==='red'));
  for(const m of body.groups.get('bd-'+end+'-panel-fasteners-'+side).children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);if(Math.abs(p.x)>.75)continue;const ys=height(p.x,p.z);assert(ys.length,'upper attachment must have a skin over it');const d=Math.max(...ys)-p.y;assert(d>.006,'panel fastener pierces paint');minimum=Math.min(minimum,d);samples++;}}
 }
 assert(samples>100);return{samples,minimumCoverMm:minimum*1000};
});
check('Four marker lenses clear the curved panel at central and end sightlines',()=>{
 let samples=0,minimum=Infinity,maximum=0;const ray=new T.Raycaster();
 for(const side of ['left','right'])for(const end of ['front','rear']){
  const sg=side==='left'?-1:1,cz=end==='front'?-1.75:1.78,cy=end==='front'?.530:.644;
  const lens=lighting.groups.get('lt-marker-'+end+'-'+side+'-lens').children;
  const panels=[end==='front'?'nose':'rear-fascia',end+'-fascia-molding',(end==='front'?'fender-':'quarter-')+side].flatMap(id=>body.groups.get('bd-skin-'+id).children);
  for(const dz of [-.074,-.070,-.055,-.045,-.030,-.015,0,.045,.070]){
   const p=bodyPoint([sg*1.1,cy,cz+dz]);ray.set(new T.Vector3(...p),new T.Vector3(-sg,0,0));const l=ray.intersectObjects(lens,false)[0],b=ray.intersectObjects(panels,false)[0];assert(l&&b,'missing marker/panel sightline');const d=b.distance-l.distance;assert(d>.004&&d<.019,'marker intersects or floats off body');minimum=Math.min(minimum,d);maximum=Math.max(maximum,d);samples++;
  }
 }
 return{samples,minimumStandOffMm:minimum*1000,maximumStandOffMm:maximum*1000};
});
// The label count is a scoped inventory, not proof of an exhaustive vehicle BOM.
const report={sourceSha256:sourceFingerprint(),date:new Date().toISOString(),status:'passed',scope:'Visible exterior panels, fittings and lighting; ten newly separate glazing parts; installed body hardware interfaces.',inventory,checks,openItems:['Production panel lofts, local radii and manufacturing tolerances','Exact weatherstrip cross sections and body-alignment hard points','Concealed regulator/lock/fuel-release mechanisms and exhaustive fastener bill','Original roof/deck equipment and first/second-design badges','H102/H104 physical bumper ground-reference interpretation','Owner visual acceptance'],limits:'Presence checks establish actual finite meshes and specific interfaces, not exact factory tooling or complete hidden mechanisms.'};
await preserveFiles(['artifacts/exterior-completeness-audit.json'],'before-exterior-completeness-audit');await writeFile('artifacts/exterior-completeness-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({sourceSha256:report.sourceSha256,status:report.status,inventoryEntries:inventory.length,checks},null,2));
