import * as T from 'three';
import {geometryTools} from './geometry.js';
import {suspensionParts} from './suspension-catalog.js';
import {buildSuspension,suspensionMaterials} from './suspension-detail.js';
export function buildVehicleSuspension(groups,materials){
 const detail=new Map(suspensionParts.map(p=>[p.id,new T.Group()]));const h=geometryTools(detail,suspensionMaterials(materials));buildSuspension(h,detail);h.optimize();
 const hidden=new Set(['rack','pinion','bearing','seal','ring','bushing','bushing-ring','guide','spring','plug']);
 for(const p of suspensionParts){if(p.section==='susp-rack'&&!p.side&&hidden.has(p.role))continue;
  const target=p.section==='susp-cradle'?'cradle':p.section==='susp-crossmember'?'front-crossmember':p.section==='susp-rack'?'steering-rack':p.section==='susp-stabilizer'?'stabilizer':p.corner.startsWith('f')?p.section.endsWith('-arms')?'front-arms':'front-springs':p.section.endsWith('-spring')?'rear-struts':'rear-arms';
  for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=target;groups.get(target).add(mesh);}
 }
}
