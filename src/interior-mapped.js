import * as T from 'three';
import {interiorParts} from './interior-catalog.js';
import {buildInteriorNative} from './interior-geometry.js';
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
