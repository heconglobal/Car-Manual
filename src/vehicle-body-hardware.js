import * as T from 'three';
import {geometryTools} from './geometry.js';
import {bodyParts} from './body-catalog.js';
import {buildBodyHardware,bodyMaterials} from './body-detail.js';
export function buildVehicleBodyHardware(groups,materials){const catalog=bodyParts.filter(p=>!p.surface),detail=new Map(catalog.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,bodyMaterials(materials));buildBodyHardware(h);h.optimize();for(const p of catalog)for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=p.vehiclePart;groups.get(p.vehiclePart).add(mesh);}}
