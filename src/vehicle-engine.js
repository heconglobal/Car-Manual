import {createEngineDetail} from './engine-detail.js';
import {engineParts} from './engine-catalog.js';
import {enginePlacement} from './powertrain-layout.js';

// Keep source identities for cross-view geometry checks. Hidden rotating and
// valve internals remain accessible in the detailed explorer without adding
// their render cost to every whole-car frame.
export function engineVehicleOwner(p){
 if(p.section==='distributor-detail')return 'distributor';
 if(p.section==='coil-detail')return 'ignition-coil';
 if(p.section==='plug-wires')return 'ignition-leads';
 if(p.section==='engine-controls')return 'engine-controls';
 if(p.section==='thermostat-detail')return 'thermostat';
 if(p.section==='induction')return 'intake';
 if(p.id==='eng-alternator'||p.id==='eng-flywheel'||p.id.includes('exhaust'))return null; // separate shared builders
 if(/^eng-(front|rear)-(head|cover)(-gasket|-bolts)?$/.test(p.id))return 'heads';
 if(p.section==='oil-pump-detail')return ['eng-oil-pump','eng-pickup','eng-pickup-screen','eng-oil-pump-cover','eng-oil-pump-cover-bolts','eng-oil-pump-mount-bolt','eng-oil-pump-drive'].includes(p.id)?'oil-pan':null;
 if(p.section==='lubrication'||p.section==='dipstick-detail'||p.section==='oil-pressure-detail')return 'oil-pan';
 if(p.id==='eng-block'||['eng-timing-cover','eng-balancer','eng-crank-pulley','eng-belt','eng-front-crank-seal','eng-timing-pointer','eng-rear-seal'].includes(p.id)||p.section==='water-pump-detail')return 'engine-block';
 return null;
}
export function buildVehicleEngine(groups){
 const detail=createEngineDetail({legacyFrame:true});
 for(const p of engineParts){
  const owner=engineVehicleOwner(p);
  for(const mesh of [...detail.groups.get(p.id).children]){
   if(!owner){mesh.geometry.dispose();mesh.material.dispose();continue;}
   mesh.updateMatrix();mesh.geometry.applyMatrix4(mesh.matrix).applyMatrix4(enginePlacement);
   mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);
   mesh.userData.partId=owner;mesh.userData.detailPartId=p.id;
   groups.get(owner).add(mesh);
  }
 }
}
