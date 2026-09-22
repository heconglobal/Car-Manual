import * as T from 'three';
import {geometryTools} from './geometry.js';
import {buildEngineControls} from './engine-controls.js';
import {buildIgnition} from './ignition.js';
import {engineMembers} from './engine-catalog.js';

// Share the inspection geometry with the vehicle; never substitute a second
// set of unrelated cylinders for the ignition assembly in the engine bay.
export function buildVehicleIgnition(vehicleGroups,materials){
 const detailParts=[...engineMembers('ignition'),...engineMembers('engine-controls')];
 const temporary=new Map(detailParts.map(p=>[p.id,new T.Group()]));
 const h=geometryTools(temporary,materials);buildIgnition(h);buildEngineControls(h);h.optimize();
 const transform=new T.Matrix4().makeScale(1.6,.6856,1.3);transform.setPosition(-.11,-.2923,1.17);
 for(const part of detailParts){
  const vehicleId=part.section==='engine-controls'?'engine-controls':part.section==='distributor-detail'?'distributor':part.section==='coil-detail'?'ignition-coil':'ignition-leads';
  for(const mesh of [...temporary.get(part.id).children]){
   mesh.updateMatrix();mesh.geometry.applyMatrix4(mesh.matrix);mesh.geometry.applyMatrix4(transform);
   mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);
   mesh.userData.partId=vehicleId;vehicleGroups.get(vehicleId).add(mesh);
  }
 }
}
