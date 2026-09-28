import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createInteriorDetail,buildMappedInterior}=await import('../src/interior-detail.js');
const {interiorParts,interiorSections}=await import('../src/interior-catalog.js');
const {parts}=await import('../src/data.js');
const {createMaterials}=await import('../src/materials.js');
const {geometryTools}=await import('../src/geometry.js');
const {correctLegacyHandedness}=await import('../src/vehicle-frame.js');
const {buildDoorTrimSkin}=await import('../src/interior-surfaces.js');
const {bodyPoint}=await import('../src/body-datums.js');
const {cabinNominal}=await import('../src/factory-specifications.js');
const {detailSectionById}=await import('../src/inspection-catalog.js');
const {root,groups}=createInteriorDetail();root.updateMatrixWorld(true);
const checks=[];function check(name,fn){checks.push({name,status:'passed',...fn()});}
const bounds=id=>new T.Box3().setFromObject(groups.get(id));
check('Every catalogued cabin part has finite independently owned geometry',()=>{
 assert.equal(new Set(interiorParts.map(p=>p.id)).size,interiorParts.length);let meshes=0,vertices=0;
 for(const p of interiorParts){const g=groups.get(p.id);assert(g.children.length,p.id+' missing');assert(interiorSections.some(s=>s.id===p.section),p.id+' unscoped');const b=bounds(p.id);assert(!b.isEmpty()&&b.getSize(new T.Vector3()).length()>.001,p.id+' empty');for(const m of g.children){assert.equal(m.userData.partId,p.id);assert(m.geometry.attributes.position.array.every(Number.isFinite),p.id);meshes++;vertices+=m.geometry.attributes.position.count;}if(p.relatedAssembly)assert(detailSectionById.has(p.relatedAssembly),p.relatedAssembly);}
 return{parts:interiorParts.length,meshes,vertices};
});
check('Whole vehicle and Interior explorer use identical native component meshes',()=>{
 const vehicleGroups=new Map(parts.map(p=>[p.id,new T.Group()])),h=geometryTools(vehicleGroups,createMaterials());buildMappedInterior(h);
 for(const s of [-1,1])h.mapAdded(()=>buildDoorTrimSkin(h,'door-trim-'+(s>0?'left':'right'),s),bodyPoint);
 h.optimize();correctLegacyHandedness(vehicleGroups);let compared=0;
 const hashes=meshes=>meshes.map(m=>{const h=createHash('sha256');for(const a of ['position','normal','uv'])h.update(Buffer.from(m.geometry.attributes[a].array.buffer));if(m.geometry.index)h.update(Buffer.from(m.geometry.index.array.buffer));h.update(JSON.stringify([m.userData.option,m.userData.value]));return h.digest('hex');}).sort();
 for(const p of interiorParts){if(p.sharedVehicle)continue;const list=vehicleGroups.get(p.vehiclePart).children.filter(m=>p.doorSkin?!m.userData.detailPartId:m.userData.detailPartId===p.id);assert.deepEqual(hashes(list),hashes(groups.get(p.id).children),p.id+' diverged');compared++;}
 return{compared};
});
check('Both integrated-headrest seats retain contained foam and mirrored upholstery envelopes',()=>{
 const measurements=[];
 for(const side of ['left','right']){const id=k=>'in-seat-'+side+'-'+k,back=bounds(id('back-cover')).union(bounds(id('rear-cover'))),cushion=bounds(id('cushion-cover'));
  assert(back.clone().expandByScalar(.0001).containsBox(bounds(id('back-foam'))),side+' back foam exposed');assert(cushion.clone().expandByScalar(.0001).containsBox(bounds(id('cushion-foam'))),side+' cushion foam exposed');
  assert(back.max.y<1.08&&back.max.y>1.00,'headrest envelope');assert(cushion.min.z<0&&back.min.z>0,'seat must face forward');
  const materials=new Set(groups.get(id('back-cover')).children.map(m=>m.userData.materialName));assert(materials.has('clothInsert')&&materials.has('clothBolster'));assert(!materials.has('vinyl'),'seat cover is cloth');
  measurements.push({side,cushionWidthMm:cushion.getSize(new T.Vector3()).x*1000,cushionDepthMm:cushion.getSize(new T.Vector3()).z*1000,backHeightMm:back.getSize(new T.Vector3()).y*1000});
 }
 const a=bounds('in-seat-left-back-cover'),b=bounds('in-seat-right-back-cover');assert(Math.abs(a.min.x+b.max.x)<1e-6&&Math.abs(a.max.y-b.max.y)<1e-6);return{measurements,basis:'Reconstructed packaging/appearance bounds, not published GM cushion dimensions.'};
});
check('Seat frames and foam stay in front of the rear cloth envelope',()=>{
 const ray=new T.Raycaster();let samples=0,min=Infinity;
 for(const side of ['left','right'])for(const type of ['back-frame','back-foam'])for(const m of groups.get('in-seat-'+side+'-'+type).children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i+=Math.max(1,Math.floor(a.count/300))){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);if(p.y<.40||p.y>1.01)continue;ray.set(new T.Vector3(p.x,p.y,2),new T.Vector3(0,0,-1));const hits=ray.intersectObject(groups.get('in-seat-'+side+'-rear-cover'),true);assert(hits.length,type+' lies outside rear cloth outline');const clearance=hits[0].point.z-p.z;assert(clearance>.0005,type+' shows through rear cover');min=Math.min(min,clearance);samples++;}}
 return{samples,minimumConcealmentMm:min*1000,basis:'Sampled actual mesh vertices against rear-cloth rays; static reconstructed fit, not production tolerances.'};
});
check('Four speaker recesses are cut into the foam and retain clearance behind the magnets',()=>{
 const ray=new T.Raycaster(),samples=[];
 for(const side of ['left','right'])for(const where of ['inner','outer']){const id='in-seat-'+side+'-',cone=bounds(id+'speaker-'+where+'-magnet').getCenter(new T.Vector3()),foam=groups.get(id+'back-foam');ray.set(new T.Vector3(cone.x,cone.y,-1),new T.Vector3(0,0,1));const hits=ray.intersectObject(foam,true);assert(hits.length,'missing cavity back');const cover=groups.get(id+'back-cover'),cloth=ray.intersectObject(cover,true);assert(cloth.length,'headrest cloth missing');const depth=hits[0].point.z-cloth[0].point.z;assert(depth>.04,'speaker opening closed by foam');assert(bounds(id+'speaker-'+where+'-magnet').max.z<hits[0].point.z,'magnet intersects cavity back');samples.push({side,where,depthMm:depth*1000});}
 return{samples,limits:'Reconstructed static recesses; speaker tooling, acoustic response and foam specifications remain unmeasured.'};
});
check('Each seat retains separate tracks, four floor nuts, four rail bolts and recliner pivots',()=>{
 let fasteners=0;for(const side of ['left','right']){const id=k=>'in-seat-'+side+'-'+k;for(let i=0;i<4;i++)for(const type of ['floor-nut','rail-bolt']){assert(groups.get(id(type+'-'+i)).children.length);fasteners++;}
  for(const rail of ['inner','outer']){const a=bounds(id('track-'+rail)),b=bounds(id('slider-'+rail));assert(a.intersectsBox(b),'rail coupling lost');}
  for(let i=0;i<2;i++)assert(groups.get(id('pivot-'+i)).children.length);assert.notDeepEqual(groups.get(id('cushion-cover')).userData.spread.toArray(),groups.get(id('cushion-foam')).userData.spread.toArray());
 }return{individualMountFasteners:fasteners,limits:'Reconstructed installed coordinates; no factory torque/fastener-grade claim.'};
});
check('Driver controls and parking brake remain on the left; end vents clear the instrument pod',()=>{
 for(const id of ['in-steering-rim','in-pedal-clutch-pad','in-pedal-accelerator','in-parking-lever'])assert(bounds(id).max.x<0,id+' wrong side');
 const cluster=bounds('in-shared-cluster'),outlets=groups.get('in-shared-outlets').children.filter(m=>m.userData.sharedDetailId==='hv-left-outlet');assert(outlets.length);const b=new T.Box3();for(const m of outlets)b.expandByObject(m);assert(b.max.x<cluster.min.x-.015,'driver vent overlaps cluster');assert(b.getSize(new T.Vector3()).y>b.getSize(new T.Vector3()).x*1.7,'end vent must be vertical');
 return{driverVentPodGapMm:(cluster.min.x-b.max.x)*1000};
});
check('Factory steering angle and design-back reference are retained by the installed meshes',()=>{
 const rim=groups.get('in-steering-rim'),points=[];for(const m of rim.children){if(m.userData.value!=='formula'||!['cabinVinyl','dashTop'].includes(m.userData.materialName))continue;const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++)points.push(new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld));}
 const top=points.reduce((a,b)=>b.y>a.y?b:a),bottom=points.reduce((a,b)=>b.y<a.y?b:a),angle=Math.atan2(top.z-bottom.z,top.y-bottom.y)*180/Math.PI;assert(Math.abs(angle-cabinNominal.steeringAngle)<.3,'steering rim angle');
 const g=groups.get('in-seat-left-rear-cover'),ps=[];for(const m of g.children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);if(Math.abs(p.x+.383)<.002&&p.y>.50&&p.y<.80)ps.push(p);}}
 const lo=ps.reduce((a,b)=>b.y<a.y?b:a),hi=ps.reduce((a,b)=>b.y>a.y?b:a),back=Math.atan2(hi.z-lo.z,hi.y-lo.y)*180/Math.PI;assert(Math.abs(back-cabinNominal.backAngle)<.1,'seat back reference angle');
 return{steeringAngleDegrees:angle,backReferenceAngleDegrees:back,source:'Pontiac 1985 MVMA PDF 23, H18/L40',limits:'The design angle guides the reconstructed back axis; it does not validate foam tooling or an SAE occupant-envelope measurement.'};
});
check('Configuration-dependent cabin pieces carry the correct visibility identity',()=>{
 let parts=0;for(const p of interiorParts.filter(p=>p.option)){for(const m of groups.get(p.id).children){assert.equal(m.userData.option,p.option,p.id);assert.equal(m.userData.value,p.value,p.id);}parts++;}
 const roofModes=new Set(groups.get('in-trim-headliner').children.map(m=>m.userData.value));assert.deepEqual([...roofModes].sort(),['glass','removed','solid']);return{optionParts:parts};
});
check('Both seats clear the centre armrest and door pulls in the installed model',()=>{
 const consoleBox=bounds('in-console-rear-pad');let minimum=Infinity;
 for(const side of ['left','right']){const seat=bounds('in-seat-'+side+'-cushion-cover'),door=bounds('in-door-'+side+'-armrest'),sign=side==='left'?-1:1;const gap=sign<0?consoleBox.min.x-seat.max.x:seat.min.x-consoleBox.max.x;assert(gap>.002,'seat touches console: '+gap);minimum=Math.min(minimum,gap);const doorGap=sign<0?seat.min.x-door.max.x:door.min.x-seat.max.x;assert(doorGap>.002,'seat touches door pull');minimum=Math.min(minimum,doorGap);}
 return{minimumEnvelopeGapMm:minimum*1000,limits:'Static envelopes with a 2 mm numerical separation margin, not a factory clearance tolerance. Travel not calibrated.'};
});
const report={sourceSha256:sourceFingerprint(),date:new Date().toISOString(),status:'passed',checks,inventory:interiorParts.map(p=>({id:p.id,section:p.section,sourceUrl:p.sourceUrl,callout:p.callout,shared:!!p.sharedVehicle,relatedAssembly:p.relatedAssembly||null})),limits:'Native geometry, ownership, source-linked inventory and static interface checks. Local seat/trim tooling, original trim code, exhaustive fastener quantities, concealed mechanisms, calibrated motion and restraint performance remain unverified.'};
await preserveFiles(['artifacts/interior-audit.json'],'before-interior-audit');await writeFile('artifacts/interior-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({sourceSha256:report.sourceSha256,status:report.status,checks},null,2));
