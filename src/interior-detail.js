import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {bodyPoint} from './body-datums.js';
import {interiorParts,interiorSections} from './interior-catalog.js';
import {buildInteriorNative,buildInteriorTrimRetainers} from './interior-geometry.js';
import {createWiringDetail} from './wiring-detail.js';
import {createHvacDetail} from './hvac-detail.js';
import {createBrakeDetail} from './brake-detail.js';
import {createHeadlightControls} from './headlight-detail.js';
import {createLightingDetail} from './lighting-detail.js';
const byId=new Map(interiorParts.map(p=>[p.id,p]));
// Map the exact detail builder into the vehicle's assembly groups. Keeping
// detailPartId prevents the geometry merger from erasing the shared identity.
export function buildMappedInterior(h){
 const mapped={...h};
 for(const name of ['add','box','cyl','tube','surface','profile','bolt','label','ring'])mapped[name]=(id,...args)=>{
  const p=byId.get(id);if(!p)throw new Error('Uncatalogued interior mesh '+id);
  const tagged=(flags={})=>({...flags,detailPartId:id,...(p.option?{option:p.option,value:p.value}:{})});
  // bolt creates two meshes and intentionally has no return value. Route it
  // through this wrapper's add, so both the head and washer retain identity.
  if(name==='bolt'){const [pos,r=.007,axis='y',mat='alloy']=args,rot=axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0];mapped.add(id,new T.CylinderGeometry(r,r,r*.85,6),mat,pos,rot);const washer=pos.slice();washer[{x:0,y:1,z:2}[axis]]-=r*.5;mapped.add(id,new T.CylinderGeometry(r*1.3,r*1.3,r*.2,20),mat,washer,rot);return;}
  const m=h[name](p.vehiclePart,...args);Object.assign(m.userData,tagged());return m;
 };
 buildInteriorNative(mapped,{doorPanels:false});
}
export function createInteriorDetail({shared=true}={}){
 const root=new T.Group(),groups=new Map();
 for(const p of interiorParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'interior',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(interiorSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,createMaterials());buildInteriorNative(h);
 for(const s of [-1,1])h.mapAdded(()=>buildInteriorTrimRetainers(h,s,'in-door-'+(s>0?'left':'right')+'-retainers'),bodyPoint);
 for(const p of interiorParts)for(const m of groups.get(p.id).children){m.userData.detailPartId=p.id;if(p.option)Object.assign(m.userData,{option:p.option,value:p.value});}
 h.optimize();correctLegacyHandedness(groups);
 if(shared){
  const transfers=[
   [createHeadlightControls,()=> 'in-shared-light-controls'],
   [createWiringDetail,p=>p.section==='wiring-cluster'?'in-shared-cluster':p.section==='wiring-ecm'?'in-shared-ecm':null],
   [createHvacDetail,p=>p.partId==='hv-center-outlet'?'in-shared-center-outlet':p.section==='hvac-controls'?'in-shared-heater':p.section==='hvac-ducts'?'in-shared-outlets':null],
   [createBrakeDetail,p=>p.section==='brake-pedal'?'in-shared-brake':p.partId==='br-park-lever'?'in-parking-lever':p.partId==='br-park-boot'?'in-parking-boot':null],
   [createLightingDetail,p=>p.section==='lighting-dome'?'in-shared-dome':null],
  ];
  for(const [create,target] of transfers){const model=create();for(const g of model.groups.values()){
   const id=target(g.userData);
   for(const m of [...g.children])if(id){m.userData.sharedDetailId=m.userData.partId;m.userData.partId=id;groups.get(id).add(m);}else{m.geometry?.dispose();m.material?.dispose();}
  }}
 }
 return{root,groups};
}
