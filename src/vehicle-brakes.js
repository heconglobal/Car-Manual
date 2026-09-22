import * as T from 'three';
import {geometryTools} from './geometry.js';
import {brakeParts} from './brake-catalog.js';
import {buildBrakes,brakeMaterials} from './brake-detail.js';

export function buildVehicleBrakes(groups,materials){
 const detail=new Map(brakeParts.map(p=>[p.id,new T.Group()]));
 const h=geometryTools(detail,brakeMaterials(materials));buildBrakes(h,detail);h.optimize();
 const hiddenCaliper=new Set(['piston','piston-seal','balance-spring','thrust-washer','shaft-seal','check-valve']);
 const masterVisible=new Set(['body','reservoir','cover','grommets','mounting-nuts']);
 const boosterVisible=new Set(['boot','check-valve','check-grommet','rear-shell','front-shell','input-rod','mounting']);
 for(const p of brakeParts){
  if(p.section.endsWith('-caliper')&&hiddenCaliper.has(p.role))continue;
  if(p.section==='brake-master'&&!masterVisible.has(p.role))continue;
  if(p.section==='brake-booster'&&!boosterVisible.has(p.role))continue;
  const target=p.corner?p.section.endsWith('-caliper')?'calipers':p.corner.startsWith('f')?'front-rotors':'rear-rotors':p.section==='brake-lines'?'brake-lines':p.section==='brake-parking'?'parking-brake':p.section==='brake-pedal'?'pedals':'master-cylinder';
  for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=target;groups.get(target).add(mesh);}
 }
}
