import * as T from 'three';
import {geometryTools} from './geometry.js';
import {exhaustParts} from './exhaust-catalog.js';
import {buildExhaust,exhaustMaterials} from './exhaust-detail.js';
export function buildVehicleExhaust(groups,materials){const detail=new Map(exhaustParts.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,exhaustMaterials(materials));buildExhaust(h);h.optimize();for(const g of detail.values())for(const mesh of [...g.children]){mesh.userData.partId='exhaust';groups.get('exhaust').add(mesh);}}
