import * as T from 'three';
import {geometryTools} from './geometry.js';
import {engineServiceParts} from './engine-service-catalog.js';
import {buildThermostat} from './engine-service.js';

// Use the same thermostat surfaces in the vehicle and component explorer.
// Coordinates match the other shared engine service geometry.
export function buildVehicleService(groups,materials){
 const parts=engineServiceParts.filter(p=>p.section==='thermostat-detail');
 const local=new Map(parts.map(p=>[p.id,new T.Group()]));
 const h=geometryTools(local,materials);buildThermostat(h);h.optimize();
 const transform=new T.Matrix4().makeScale(1.6,.6856,1.3);transform.setPosition(-.11,-.2923,1.17);
 const destination=groups.get('thermostat');destination.scale.set(1,1,1);
 for(const group of local.values())for(const mesh of [...group.children]){
  mesh.updateMatrix();mesh.geometry.applyMatrix4(mesh.matrix);mesh.geometry.applyMatrix4(transform);
  mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);mesh.userData.partId='thermostat';destination.add(mesh);
 }
}
