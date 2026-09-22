import * as T from 'three';
import {transmissionPlacement} from './powertrain-layout.js';
import {geometryTools} from './geometry.js';
import {transmissionParts} from './transmission-catalog.js';
import {buildTransmission,transaxleDatum,transmissionMaterials} from './transmission-detail.js';
import {coolingParts} from './cooling-catalog.js';
import {buildCooling,coolingMaterials} from './cooling-detail.js';
// Share the exact authored surfaces; only picking ownership changes in the
// whole-vehicle view. Placement is in the legacy authoring frame; the complete
// vehicle and every inspection model receive the same final LHD conversion.
export function buildVehiclePowertrain(groups,materials){
 const trans=new Map(transmissionParts.map(p=>[p.id,new T.Group()]));
 const th=geometryTools(trans,transmissionMaterials(materials));buildTransmission(th);th.optimize();
 const transform=transmissionPlacement;
 for(const p of transmissionParts){
  const target=p.section==='trans-clutch'?'clutch':'gearbox',destination=groups.get(target);destination.scale.set(1,1,1);
  // Exterior housings conceal internals in the car; keep the detailed internals
  // for the explorer to avoid drawing invisible gear teeth every vehicle frame.
  if(!['trans-case','trans-clutch','trans-selector'].includes(p.section))continue;
  for(const mesh of [...trans.get(p.id).children]){mesh.updateMatrix();mesh.geometry.applyMatrix4(mesh.matrix);mesh.geometry.applyMatrix4(transform);mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.userData.partId=target;destination.add(mesh);}
 }
 const cool=new Map(coolingParts.map(p=>[p.id,new T.Group()]));const ch=geometryTools(cool,coolingMaterials(materials));buildCooling(ch);ch.optimize();
 for(const p of coolingParts){if(['cool-heater-core','cool-heater-tanks','cool-heater-seals'].includes(p.id)){for(const mesh of cool.get(p.id).children){mesh.geometry.dispose();mesh.material.dispose();}continue;}const target=p.section==='cool-radiator'||p.id==='cool-pressure-cap'?'radiator':p.section==='cool-recovery'?'coolant-reservoir':'coolant-pipes';for(const mesh of [...cool.get(p.id).children]){mesh.userData.partId=target;groups.get(target).add(mesh);}}
}
