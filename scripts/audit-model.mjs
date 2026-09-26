import {sourceFingerprint} from './source-fingerprint.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as T from 'three';
// Texture creation is stubbed for a geometry-only audit. Browser checks cover
// rendering/materials separately; this does not pretend to be a render test.
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {engineParts,engineMembers,engineSectionById}=await import('../src/engine-catalog.js');
const {parts}=await import('../src/data.js');
const {createEngineDetail}=await import('../src/engine-detail.js');
const {createTransmissionDetail,transaxleDatum}=await import('../src/transmission-detail.js');
const {createCoolingDetail,coolantRoutes}=await import('../src/cooling-detail.js');
const {transmissionParts}=await import('../src/transmission-catalog.js');
const {coolingParts}=await import('../src/cooling-catalog.js');
const {wiringParts}=await import('../src/wiring-catalog.js');
const {createWiringDetail}=await import('../src/wiring-detail.js');
const {chargingParts}=await import('../src/charging-catalog.js');
const {createChargingDetail}=await import('../src/charging-detail.js');
const {lightingParts}=await import('../src/lighting-catalog.js');
const {createLightingDetail}=await import('../src/lighting-detail.js');
const {headlightParts}=await import('../src/headlight-catalog.js');
const {createHeadlightDetail,headlightPose}=await import('../src/headlight-detail.js');
const {hvacParts}=await import('../src/hvac-catalog.js');
const {createHvacDetail}=await import('../src/hvac-detail.js');
const {bodyParts,bodySurfaceOwners}=await import('../src/body-catalog.js');
const {createBodyDetail}=await import('../src/body-detail.js');
const {exhaustParts}=await import('../src/exhaust-catalog.js');
const {createExhaustDetail,exhaustRoutes}=await import('../src/exhaust-detail.js');
const {fuelParts}=await import('../src/fuel-catalog.js');
const {createFuelDetail,fuelRoutes}=await import('../src/fuel-detail.js');
const {suspensionParts,suspensionCorners}=await import('../src/suspension-catalog.js');
const {createSuspensionDetail}=await import('../src/suspension-detail.js');
const {brakeParts,brakeCorners,brakeDimensions}=await import('../src/brake-catalog.js');
const {createBrakeDetail,brakeRoutes,parkingCableRoutes}=await import('../src/brake-detail.js');
const {detailParts,detailSections,detailMembers,detailSectionById}=await import('../src/inspection-catalog.js');
const {createVehicle}=await import('../src/model.js');
const vehicleModel=createVehicle();
const brakeModel=createBrakeDetail();
const suspensionModel=createSuspensionDetail();
const fuelModel=createFuelDetail();
const exhaustModel=createExhaustDetail();
const bodyModel=createBodyDetail();
const hvacModel=createHvacDetail();
const headlightModel=createHeadlightDetail();
const results={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),models:{}};
for(const [name,model,catalog] of [['wiring',createWiringDetail(),wiringParts],['engine',createEngineDetail(),engineParts],['transmission',createTransmissionDetail(),transmissionParts],['cooling',createCoolingDetail(),coolingParts],['brakes',brakeModel,brakeParts],['suspension',suspensionModel,suspensionParts],['fuel',fuelModel,fuelParts],['exhaust',exhaustModel,exhaustParts],['body',bodyModel,bodyParts],['charging',createChargingDetail(),chargingParts],['lighting',createLightingDetail(),lightingParts],['headlights',headlightModel,headlightParts],['hvac',hvacModel,hvacParts],['vehicle',vehicleModel,parts]]){
 assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length,'duplicate catalog IDs');
 assert.equal(model.groups.size,catalog.length);
 let meshes=0,triangles=0;
 model.root.updateMatrixWorld(true);
 for(const part of catalog){
  const group=model.groups.get(part.id);assert(group,part.id+' missing');assert(group.children.length,part.id+' empty');
  const bounds=new T.Box3().setFromObject(group);assert(!bounds.isEmpty(),part.id+' empty bounds');
  assert(bounds.getSize(new T.Vector3()).length()>.0001,part.id+' degenerate');
  group.traverse(m=>{if(!m.isMesh)return;meshes++;const p=m.geometry.attributes.position;triangles+=(m.geometry.index?.count||p.count)/3;assert(p.array.every(Number.isFinite),part.id+' has nonfinite vertices');assert.equal(m.userData.partId,part.id,'picking ID differs from catalog');});
  if(name==='engine')assert(engineSectionById.has(part.section),part.id+' orphaned section');
 }
 results.models[name]={parts:catalog.length,meshes,triangles};
}
// Headlight end poses retain lamp components in both configurations. Fixed
// motor/relay hardware must not disappear or change sides with the pose.
const visibleHeadBounds=(model,id,raised)=>{const g=model.groups.get(id);g.traverse(o=>{if(o.isMesh)o.visible=!o.userData.option||o.userData.value===raised;});const b=new T.Box3();model.root.updateMatrixWorld(true);g.traverseVisible(o=>{if(o.isMesh){o.geometry.computeBoundingBox();b.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});return b;};
for(const side of ['left','right']){
 const key='hl-'+side+'-',driver=side==='left';
 const closed=visibleHeadBounds(headlightModel,key+'lens',false),raised=visibleHeadBounds(headlightModel,key+'lens',true);
 assert(Math.abs(raised.getCenter(new T.Vector3()).y-.709)<.0001,'1985 nominal raised bulb-center height');
 assert(Math.abs(Math.abs(raised.getCenter(new T.Vector3()).x)-.511)<.0001,'1985 nominal lateral bulb-center offset');
 assert(raised.getCenter(new T.Vector3()).y-closed.getCenter(new T.Vector3()).y>.15,'lamp must actually rotate below the hood');
 assert.equal(headlightParts.filter(p=>p.id.startsWith(key+'bumper-')).length,4,'early gear needs four individual cushions');
 for(const p of headlightParts.filter(p=>p.id.startsWith(key))){const bounds=new T.Box3().setFromObject(headlightModel.groups.get(p.id));assert(driver?bounds.max.x<0:bounds.min.x>0,p.id+' wrong side');}
 const pivot=visibleHeadBounds(headlightModel,key+'pivot-bolts',true).getCenter(new T.Vector3());assert(Math.abs(pivot.y-headlightPose.pivotY)<.008,'bucket hinge datum');
 for(const component of ['lens','reflector','mounting-ring','upper-bezel','bucket','cover','filler','crank','link']){const poses=new Set(headlightModel.groups.get(key+component).children.map(m=>m.userData.value));assert(poses.has(true)&&poses.has(false),key+component+' missing a pose');}
 for(const component of ['housing','output-gear','switch','relay'])for(const m of headlightModel.groups.get(key+component).children)assert(!m.userData.option,key+component+' should be fixed');
}
assert(new T.Box3().setFromObject(headlightModel.groups.get('hl-isolation-relay')).max.x<0,'isolation relay must be driver-side');
const allClosed=visibleHeadBounds(vehicleModel,'headlights',false),allRaised=visibleHeadBounds(vehicleModel,'headlights',true);
assert(allRaised.max.y<.82,'lower nominal headlight profile');assert(allRaised.max.y-allClosed.max.y>.08,'raised cover must stand clear of its closed pose');
results.headlights='passed: dual poses, real bucket rotation, early four-cushion gears, fixed motors/relays, independent cover, LHD identity and low raised envelope';
// Heater and blower stay on the passenger side in actual vehicle coordinates.
const hb=id=>new T.Box3().setFromObject(hvacModel.groups.get('hv-'+id));
for(const id of ['core','core-tanks','case','motor','wheel','accumulator','evaporator'])assert(hb(id).min.x>0,'HVAC '+id+' must be on passenger side');
const wheelCentre=hb('wheel').getCenter(new T.Vector3()),motorBox=hb('motor');
assert(Math.abs(wheelCentre.x-.604)<.0001&&Math.abs(wheelCentre.y-.621)<.0001,'blower wheel datum');
assert(motorBox.min.z<hb('wheel').min.z,'motor must project forward from the blower wheel');
assert(hb('left-outlet').max.x<0&&hb('right-outlet').min.x>0,'cabin outlet sides');
assert(hb('fan-knob').max.x<0,'control blower knob must remain at the driver side');
for(const id of ['core','core-tanks','core-seals','control-face','resistor']){
 const choices=new Set(hvacModel.groups.get('hv-'+id).children.filter(m=>m.userData.option==='airConditioning').map(m=>m.userData.value));assert(choices.has(true)&&choices.has(false),id+' lacks distinct C41 / C60 preview geometry');
}
for(const p of hvacParts.filter(p=>p.option))hvacModel.groups.get(p.id).traverse(m=>{if(m.isMesh){assert.equal(m.userData.option,p.option);assert.equal(m.userData.value,p.value);}});
assert(hvacParts.find(p=>p.id==='hv-mode-slider').value===false,'standard heater uses mechanical mode control');
assert(hvacParts.find(p=>p.id==='hv-mode-actuator').value===true,'C60 mode control must be electric');
for(const id of ['hvac-module','hvac-controls','hvac-ducts'])assert(vehicleModel.groups.has(id),'missing HVAC whole-car owner');
// A source-equivalent core is shared with cooling, but is owned only once
// in the whole car; the old core at x=.39 must not remain in the pipe group.
const pipeMeshes=vehicleModel.groups.get('coolant-pipes').children;
assert(!pipeMeshes.some(m=>m.userData.materialName==='copper'),'duplicate core left in coolant pipes');

// Every numbered callout in the inspected GM L44 distributor drawing is
// represented, including retaining parts that would be easy to omit.
const callouts=new Set(engineMembers('distributor-detail').map(p=>p.callout).filter(Boolean));
for(let n=1;n<=17;n++)assert(callouts.has(n),'GM distributor callout '+n+' missing');
for(const [scope,numbers] of [['thermostat-detail',[86,87,88,89,90]],['dipstick-detail',[40,41,42,43]]]){
 const found=new Set(engineMembers(scope).map(p=>p.callout));for(const n of numbers)assert(found.has(n),scope+' callout '+n+' missing');
}
// The catalog has different intake/exhaust stem-seal arrangements. A generic
// duplicated seal at all twelve valves would silently misrepresent H-23.
for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++)for(const type of ['intake','exhaust']){
 const members=engineMembers(`valve-${bank}-${c}-${type}`),codes=new Set(members.map(p=>p.callout));
 assert.equal(members.length,19,'valve gear service inventory');
 for(const n of [42,43,45,66,68])assert(codes.has(n),'valve gear callout '+n+' missing');
 assert(codes.has(type==='intake'?47:44),'wrong stem seal variant');
 assert(!codes.has(type==='intake'?44:47),'intake/exhaust seals confused');
}
// Derive left from the actual nose-to-tail geometry and world up. This would
// catch the old +X="left" assumption even if every label agreed with it.
const centre=id=>new T.Box3().setFromObject(vehicleModel.groups.get(id)).getCenter(new T.Vector3());
for(const id of ['steering-wheel','master-cylinder','clutch-hydraulics','air-cleaner','gearbox','sail-left'])assert(centre(id).x<0,id+' must be on vehicle left / driver side');
for(const id of ['battery','thermostat','coolant-reservoir','sail-right'])assert(centre(id).x>0,id+' must be on vehicle right / passenger side');
const forward=centre('nose').sub(centre('rear-fascia')).setY(0).normalize();
const actualLeft=new T.Vector3().crossVectors(new T.Vector3(0,1,0),forward);
assert(centre('steering-wheel').dot(actualLeft)>0,'steering wheel must be left when facing the actual nose');
assert(centre('battery').dot(actualLeft)<0,'battery must be passenger-side in the same physical frame');
const labels=vehicleModel.groups.get('instrument-cluster').children.filter(m=>m.userData.label);
const labelX=text=>new T.Box3().setFromObject(labels.find(m=>m.userData.label===text)).getCenter(new T.Vector3()).x;
assert(labelX('MPH')<labelX('R.P.M.'),'speedometer must remain left of tachometer after conversion');
assert(new T.Box3().setFromObject(vehicleModel.groups.get('steering-wheel')).min.x<-.55,'turn-signal stalk must extend to driver left');
assert(centre('radiator').z<0);assert(centre('gearbox').z>0);
for(const id of ['gearbox','clutch','steering-wheel'])assert(vehicleModel.groups.get(id).matrixWorld.determinant()>0,id+' must not be mirrored');
assert(Math.abs(Math.hypot(...transaxleDatum.input.map((v,i)=>v-transaxleDatum.output[i]))-.076)<1e-9);
assert(coolantRoutes['pipe-left'].every(p=>p[0]<0));assert(coolantRoutes['pipe-right'].every(p=>p[0]>0));
assert(coolantRoutes['front-inlet'][0][1]>coolantRoutes['front-outlet'][0][1]);
assert(coolantRoutes.crossover[0][0]>0&&coolantRoutes.crossover.at(-1)[0]<0,'manual crossover must cross from right to left');
// Measure the actual solid friction-band vertices, excluding the hub/hat.
// This catches accidental use of the same thickness at front and rear.
for(const c of brakeCorners){
 const group=brakeModel.groups.get('br-'+c.id+'-rotor'),xs=[],ys=[];
 group.traverse(m=>{if(!m.isMesh)return;const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i)-.307,z=a.getZ(i)-c.z;if(Math.hypot(y,z)>.080){xs.push(a.getX(i));ys.push(y);}}});
 const thickness=Math.max(...xs)-Math.min(...xs),diameter=Math.max(...ys)-Math.min(...ys);
 assert(Math.abs(thickness-(c.front?brakeDimensions.frontThickness:brakeDimensions.rearThickness))<.000001,c.id+' incorrect friction-band thickness');
 assert(Math.abs(diameter-brakeDimensions.diameter)<.000001,c.id+' incorrect disc diameter');
 const housing=new T.Box3().setFromObject(brakeModel.groups.get('br-'+c.id+'-housing')),bleeder=new T.Box3().setFromObject(brakeModel.groups.get('br-'+c.id+'-bleeder'));
 assert((c.side==='left'?housing.max.x<0:housing.min.x>0),c.id+' incorrect vehicle side');
 assert(bleeder.max.y>.35,c.id+' bleeder must be above the piston bore');
 const members=detailMembers('brake-'+c.id+'-caliper'),codes=new Set(members.map(p=>p.callout));
 for(const n of c.front?[1,2,3,4,5,6,7,8,9,10,11,12,13]:[1,2,3,4,5,6,7,14,15,16,17,18,19,20,21,22,23,24,25])assert(codes.has(n),c.id+' factory caliper callout '+n+' missing');
 if(c.front)assert(!members.some(p=>p.role==='actuator'),'front caliper must not inherit rear parking actuator');
}
assert(brakeRoutes['hose-fl'].every(p=>p[0]<0)&&brakeRoutes['hose-fr'].every(p=>p[0]>0));
assert(brakeRoutes['hose-rl'].every(p=>p[0]<0)&&brakeRoutes['hose-rr'].every(p=>p[0]>0));
assert(parkingCableRoutes['front-cable'].every(p=>p[0]<0),'parking lever cable must remain on driver side');
for(const id of ['br-master-body','br-booster-front-shell','br-park-lever','br-pedal-pad'])assert(new T.Box3().setFromObject(brakeModel.groups.get(id)).max.x<0,id+' must remain driver-side');
results.brakes='passed: measured nominal friction bands, distinct front/rear caliper callouts, upward bleeders, corner identity and left-hand-drive controls';
const bodyBounds=id=>new T.Box3().setFromObject(bodyModel.groups.get(id));
for(const side of ['left','right']){
 const driver=side==='left',hinge=bodyBounds('bd-door-'+side+'-upper-pin'),rocker=bodyBounds('bd-skin-rocker-'+side);
 assert(driver?hinge.max.x<0:hinge.min.x>0,'door hinge side');
 assert(driver?rocker.max.x<0:rocker.min.x>0,'rocker side');
 const hood=bodyBounds('bd-skin-hood'),hoodLength=hood.max.z-hood.min.z,frontHinge=bodyBounds('bd-hood-'+side+'-hinge'),hoodStriker=bodyBounds('bd-hood-striker');
 // Compare with the measured panel, not the old reconstruction's 900 mm gap.
 assert(frontHinge.max.z<hood.min.z+hoodLength/3,'hood hinge must remain in the forward third');
 assert(hoodStriker.min.z>hood.max.z-hoodLength/3&&hoodStriker.max.z<hood.max.z,'hood striker must remain in the rear third');
 assert(frontHinge.max.y<hood.max.y,'hood hinge must remain below the upper panel');
 assert(bodyBounds('bd-deck-'+side+'-hinge').max.z<bodyBounds('bd-deck-latch').min.z-.7,'rear lid hinges must precede its latch');
 const rod=bodyBounds('bd-deck-'+side+'-rod');assert(rod.min.x<0&&rod.max.x>0,'each deck torque rod crosses the engine bay');
 assert(rod.max.y<bodyBounds('bd-skin-rear-window').min.y,'torque rods must remain below backlight');
}
assert(bodyBounds('bd-hood-release-cable').min.x<-.5,'hood release remains driver-side');
assert(bodyBounds('bd-clip-fuel-pocket-bolts').max.x<0,'fuel pocket retaining bolts remain driver-side');
for(const [owner]of bodySurfaceOwners)assert(parts.some(p=>p.id===owner&&p.assembly),'shared body surface lacks vehicle exploration entry');
assert(bodyBounds('bd-deck-lock-retainer').getCenter(new T.Vector3()).distanceTo(bodyBounds('bd-deck-lock-cylinder').getCenter(new T.Vector3()))<.035,'lock retainer must sit around barrel');
results.body='passed: shared surface ownership, independent rocker/glass/trim groups, forward hood and deck hinges, LHD release, crossed torque rods below backlight, lock retainer alignment';
const eb=id=>new T.Box3().setFromObject(exhaustModel.groups.get(id));
assert(eb('ex-rear-left-tail').max.x<0,'driver tailpipe must remain on -X');
assert(eb('ex-rear-right-tail').min.x>0,'passenger tailpipe must remain on +X');
assert(exhaustRoutes.front.every(p=>p[0]<0)&&exhaustRoutes.rear.every(p=>p[0]<0),'crossover must join at the driver end');
assert(exhaustRoutes.intermediate.every(p=>p[0]>0),'intermediate pipe must wrap around passenger side');
assert(eb('ex-cat-pellets').min.y>eb('ex-cat-support').max.y,'pellet bed must sit above its support');
assert(eb('ex-cat-pellets').max.y<eb('ex-cat-upper').max.y,'pellet bed must stay inside upper chamber');
assert(eb('ex-cat-lower-insulation').min.y>eb('ex-cat-lower').min.y,'lower insulation must sit inside shell');
assert.equal(exhaustParts.filter(p=>p.id.startsWith('ex-cat-')&&p.sourceUrl.includes('#page=706')).length,8,'single-bed factory cutaway components');
for(const side of ['left','right'])assert(exhaustParts.some(p=>p.id===`ex-rear-${side}-springs`),'separate spring support sides');
results.exhaust='passed: early pellet-bed inventory/order, driver crossover, passenger intermediate pipe, independent left/right tailpipes and spring hangers';
const fb=id=>new T.Box3().setFromObject(fuelModel.groups.get(id));
assert(fb('fu-filler-cap').max.x<0,'fuel filler must be driver-side');
assert(fb('fu-vapor-canister').max.x<0,'vapor canister must be driver-side');
assert(fb('fu-line-filter').min.x>0,'fuel filter must remain on passenger side of the tunnel');
const tank=fb('fu-tank-upper').union(fb('fu-tank-lower'));
assert(tank.containsBox(fb('fu-sender-pump')),'pump must fit inside the tank envelope');
assert(tank.containsBox(fb('fu-sender-strainer')),'strainer must fit inside the tank envelope');
assert(fuelRoutes.feed!==fuelRoutes.return,'feed and return need separate routes');
assert(!fuelParts.some(p=>p.name.includes('expansion tank')),'do not import the later auxiliary vapor tank');
results.fuel='passed: driver filler/canister, separate feed/return, passenger filter, pump/strainer within early tank envelope';
// Independent front shocks must remain outside the coil; original manual
// steering has a passenger-side damper and a driver-side pinion tower.
const sb=id=>new T.Box3().setFromObject(suspensionModel.groups.get(id));
for(const c of suspensionCorners){
 const spring=sb('su-'+c.id+'-spring'),arm=sb('su-'+c.id+'-lower-arm');
 assert(c.sign===1?spring.max.x<0:spring.min.x>0,c.id+' spring on wrong vehicle side');
 assert(spring.min.y>arm.min.y,c.id+' coil must be above lower arm');
 if(c.front){const shock=sb('su-'+c.id+'-shock-body');assert(shock.min.z>spring.max.z,c.id+' front shock must be outside the coil');const joint=sb('su-'+c.id+'-upper-joint'),stud=sb('su-'+c.id+'-upper-stud');assert(stud.min.y<joint.min.y,c.id+' upper stud must point toward the knuckle');}
 else {assert(detailMembers('susp-'+c.id+'-spring').length===19,'early strut stack incomplete');const mount=sb('su-'+c.id+'-reinforcement').getCenter(new T.Vector3());assert(Math.abs(mount.y-.7404)<.003,'strut reinforcement must meet body tower');assert(Math.abs(Math.abs(sb('su-'+c.id+'-mount-washer').getCenter(new T.Vector3()).x)-.628)<.003,'strut must incline inward to body tower');}
}
assert(sb('su-rack-pinion').max.x<0,'pinion must be driver-side');
assert(sb('su-rack-damper').getCenter(new T.Vector3()).x>0,'steering damper must be passenger-side');
assert(!suspensionParts.some(p=>p.id.includes('rear-stabilizer')),'do not invent an original rear stabilizer');
results.suspension='passed: separate front shocks, corner sides, upper-joint orientation, rear strut inventory, manual rack asymmetry';
assert.equal(new Set(detailParts.map(p=>p.id)).size,detailParts.length);
assert.equal(new Set(detailSections.map(p=>p.id)).size,detailSections.length);
for(const s of detailSections){assert(detailMembers(s.id).length,s.id+' is empty');if(s.parent)assert(detailSectionById.has(s.parent),s.id+' parent missing');}
for(const p of parts)if(p.assembly)assert(detailSectionById.has(p.assembly),p.id+' vehicle entry broken');
for(const p of detailParts){assert(detailSectionById.has(p.section),p.id+' orphaned');assert(detailMembers(p.family).some(q=>q.id===p.id),p.id+' wrong family');}
results.hvac='passed: passenger-side module, coaxial blower, LHD outlets/control knob, C41/C60 geometry alternatives, electric C60 mode control and no duplicate whole-car core';
results.leftHandDrive='passed: signed component positions, front/rear and positive determinant';
results.detailParts=detailParts.length;
results.ignitionParts=engineMembers('ignition').length;results.engineControls=engineMembers('engine-controls').length;
await writeFile('artifacts/model-audit.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
