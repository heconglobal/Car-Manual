import * as T from 'three';
import {geometryTools} from './geometry.js';
import {hvacParts} from './hvac-catalog.js';
import {buildHvac,hvacMaterials} from './hvac-detail.js';
export function buildVehicleHvac(groups,materials){const detail=new Map(hvacParts.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,hvacMaterials(materials));buildHvac(h);for(const p of hvacParts)if(p.option)for(const mesh of detail.get(p.id).children)Object.assign(mesh.userData,{option:p.option,value:p.value});h.optimize();for(const p of hvacParts){const target=p.vehiclePart||(p.section==='hvac-controls'?'hvac-controls':p.section==='hvac-ducts'?'hvac-ducts':'hvac-module');if(!groups.has(target))throw new Error('Missing HVAC vehicle owner '+target);for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=target;mesh.userData.detailPartId=p.id;groups.get(target).add(mesh);}}}
