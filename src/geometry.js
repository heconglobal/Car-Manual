import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { textMaterial } from './materials.js';

export function geometryTools(groups,mats){
 let custom=0;
 function add(id,geometry,material='metal',pos=[0,0,0],rot=[0,0,0],flags={}){
  const mat=typeof material==='string'?mats[material].clone():material;
  const m=new T.Mesh(geometry,mat);m.position.set(...pos);m.rotation.set(...(rot.length===3?rot:[0,0,0]));m.castShadow=true;m.receiveShadow=true;
  m.userData={partId:id,materialName:typeof material==='string'?material:`custom${custom++}`,...flags,original:{opacity:mat.opacity,transparent:mat.transparent,color:mat.color.clone(),emissive:mat.emissive.clone(),emissiveIntensity:mat.emissiveIntensity}};
  groups.get(id).add(m);return m;
 }
 const box=(id,size,pos,mat='metal',rot=[0,0,0],flags={},radius=.012)=>add(id,Math.min(...size)<.006?new T.BoxGeometry(...size):new RoundedBoxGeometry(...size,2,Math.min(radius,Math.min(...size)*.3)),mat,pos,rot,flags);
 const cyl=(id,r,l,pos,mat='metal',rot=[0,0,Math.PI/2],r2=r,flags={})=>add(id,new T.CylinderGeometry(r,r2,l,48),mat,pos,rot,flags);
 const tube=(id,points,r=.015,mat='metal',flags={})=>add(id,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(24,Math.min(160,points.length*5)),r,10,false),mat,[0,0,0],[0,0,0],flags);
 function surface(id,nu,nv,fn,mat='red',flags={}){
  const positions=[],uv=[],indices=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){positions.push(...fn(i/nu,j/nv));uv.push(i/nu,j/nv);}
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;indices.push(a,c,b,b,c,d);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const mesh=add(id,g,mat,[0,0,0],[0,0,0],flags);mesh.material.side=T.DoubleSide;return mesh;
 }
 function profile(id,points,depth,x=0,mat='red',flags={}){
  const shape=new T.Shape();points.forEach(([z,y],i)=>i?shape.lineTo(z,y):shape.moveTo(z,y));shape.closePath();
  const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.005,bevelThickness:.004,bevelSegments:3,steps:1});g.rotateY(-Math.PI/2);g.translate(x+depth/2,0,0);return add(id,g,mat,[0,0,0],[0,0,0],flags);
 }
 function bolt(id,pos,r=.007,axis='y',mat='alloy'){
  const rot=axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0];
  add(id,new T.CylinderGeometry(r,r,r*.85,6),mat,pos,rot);
  const washer=pos.slice();washer[{x:0,y:1,z:2}[axis]]-=r*.5;add(id,new T.CylinderGeometry(r*1.3,r*1.3,r*.2,20),mat,washer,rot);
 }
 function label(id,text,size,pos,rot=[0,0,0],options={},flags={}){const mesh=add(id,new T.PlaneGeometry(...size),textMaterial(text,options),pos,rot,flags);mesh.userData.label=text;return mesh;}
 function ring(id,r,t,pos,mat='metal',rot=[0,Math.PI/2,0],flags={}){return add(id,new T.TorusGeometry(r,t,10,64),mat,pos,rot,flags);}
 function optimize(){
  for(const g of groups.values()){
   const buckets=new Map();
   for(const m of [...g.children]){
    if(!m.isMesh)continue;const key=JSON.stringify([m.userData.materialName,m.userData.option,m.userData.value,m.userData.finish,m.material.side,m.userData.detailPartId]);
    if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);
   }
   for(const batch of buckets.values()){
    if(batch.length<2)continue;const geos=batch.map(m=>{m.updateMatrix();const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(m.matrix);return geo;});
    const merged=mergeGeometries(geos,false);geos.forEach(g=>g.dispose());if(!merged)continue;
    const first=batch[0];const combined=new T.Mesh(merged,first.material);combined.userData=first.userData;combined.castShadow=true;combined.receiveShadow=true;
    for(const m of batch){g.remove(m);m.geometry.dispose();if(m!==first)m.material.dispose();}g.add(combined);
   }
  }
 }
 return {add,box,cyl,tube,surface,profile,bolt,label,ring,optimize};
}
