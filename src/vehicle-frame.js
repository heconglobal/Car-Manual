import * as T from 'three';
// Three.js is right-handed, Y-up. The nose points toward -Z, so the
// occupant's LEFT is -X (up × forward), and the passenger side is +X.
export const vehicleForward=new T.Vector3(0,0,-1);
export const vehicleUp=new T.Vector3(0,1,0);
export const vehicleLeft=new T.Vector3().crossVectors(vehicleUp,vehicleForward);

// Bake a placement, including a reflected corner, into a fresh geometry while
// keeping front faces and lighting normals consistent. Caller owns disposal.
export function transformedGeometry(original,transform){
 const geo=original.clone();geo.applyMatrix4(transform);
 if(transform.determinant()<0){
  if(geo.index){const a=geo.index.array;for(let i=0;i<a.length;i+=3)[a[i+1],a[i+2]]=[a[i+2],a[i+1]];geo.index.needsUpdate=true;}
  else for(const attr of Object.values(geo.attributes)){const a=attr.array,n=attr.itemSize;for(let i=0;i<attr.count;i+=3)for(let k=0;k<n;k++){const b=(i+1)*n+k,c=(i+2)*n+k;[a[b],a[c]]=[a[c],a[b]];}attr.needsUpdate=true;}
  if(geo.attributes.tangent){const a=geo.attributes.tangent;for(let i=0;i<a.count;i++)a.setW(i,-a.getW(i));}
 }
 return geo;
}

// The original procedural assets were authored with +X incorrectly called
// "left". Convert that legacy authoring frame once, at each model boundary.
// Bake transforms and reverse triangle winding rather than leaving a negative
// root scale. Keep text readable and explode offsets in the same final frame.
export function correctLegacyHandedness(groups){
 const reflection=new T.Matrix4().makeScale(-1,1,1),oldGeometries=new Set();
 for(const group of groups.values()){
  if(group.userData.frame==='US-LHD')throw new Error('Handedness conversion applied twice');
  group.updateMatrix();
  for(const mesh of group.children){
   if(!mesh.isMesh)continue;
   mesh.updateMatrix();const transform=new T.Matrix4().multiplyMatrices(reflection,group.matrix).multiply(mesh.matrix);
   oldGeometries.add(mesh.geometry);mesh.geometry=transformedGeometry(mesh.geometry,transform);
   // Diffuse maps here are authored labels (grain is a separate bump map).
   // Existing engine labels already carry a local correction; toggling it
   // composes the two reflections without reversing printed lettering.
   if(mesh.material.map){const map=mesh.material.map.clone();map.repeat.x*=-1;map.offset.x=1-map.offset.x;map.needsUpdate=true;mesh.material.map=map;}
   mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);mesh.updateMatrix();
   mesh.geometry.computeBoundingBox();
  }
  group.position.set(0,0,0);group.rotation.set(0,0,0);group.scale.set(1,1,1);group.updateMatrix();
  if(group.userData.spread)group.userData.spread.x*=-1;
  if(group.userData.assemblySpread)group.userData.assemblySpread.x*=-1;
  group.userData.frame='US-LHD';
 }
 oldGeometries.forEach(g=>g.dispose());
}
