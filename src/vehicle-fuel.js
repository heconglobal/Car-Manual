import * as T from 'three';
import {geometryTools} from './geometry.js';
import {fuelParts} from './fuel-catalog.js';
import {buildFuel,fuelMaterials} from './fuel-detail.js';
export function buildVehicleFuel(groups,materials){
 const detail=new Map(fuelParts.map(p=>[p.id,new T.Group()]));const h=geometryTools(detail,fuelMaterials(materials));buildFuel(h);h.optimize();
 const owners={'fuel-tank':'fuel-tank','fuel-sender':'fuel-pump','fuel-filler':'fuel-filler','fuel-plumbing':'fuel-lines','fuel-vapor':'fuel-vapor'};
 for(const p of fuelParts){const target=owners[p.section];for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=target;groups.get(target).add(mesh);}}
}
