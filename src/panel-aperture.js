import * as T from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

// Clip a convex opening from a tessellated panel in its authored XY plane.
// Edge intersections are reprojected onto the actual panel, so the opening
// follows the lamp silhouette instead of deleting whole grid triangles.
export function cutPanelAperture(mesh,outline,face,axes=[0,1]){
 const area=outline.reduce((sum,p,i)=>{const q=outline[(i+1)%outline.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
 const ring=area>0?outline:[...outline].reverse();
 const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),lo=[Math.min(...xs),Math.min(...ys)],hi=[Math.max(...xs),Math.max(...ys)];
 const old=mesh.geometry,a=old.attributes.position,ix=old.index,out=[];
 const emit=poly=>{for(let j=1;j<poly.length-1;j++){const p=poly[0],q=poly[j],r=poly[j+1];if(Math.abs((q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]))<1e-12)continue;for(const v of [p,q,r])out.push(...face(v[0],v[1]));}};
 for(let i=0;i<ix.count;i+=3){
  let poly=[0,1,2].map(k=>axes.map(axis=>a.array[ix.getX(i+k)*3+axis]));
  if(poly.every(p=>p[0]<lo[0])||poly.every(p=>p[0]>hi[0])||poly.every(p=>p[1]<lo[1])||poly.every(p=>p[1]>hi[1])){emit(poly);continue;}
  for(let k=0;k<ring.length&&poly.length;k++){
   const p=ring[k],q=ring[(k+1)%ring.length],d=v=>(q[0]-p[0])*(v[1]-p[1])-(q[1]-p[1])*(v[0]-p[0]);
   const inner=[],outer=[];
   for(let j=0;j<poly.length;j++){
    const v=poly[j],w=poly[(j+1)%poly.length],dv=d(v),dw=d(w),inside=dv>=0;
    (inside?inner:outer).push(v);
    if(inside!==(dw>=0)){const t=dv/(dv-dw),hit=[v[0]+(w[0]-v[0])*t,v[1]+(w[1]-v[1])*t];inner.push(hit);outer.push(hit);}
   }
   emit(outer);poly=inner;
  }
 }
 const geometry=new T.BufferGeometry(),n=out.length/3;
 geometry.setAttribute('position',new T.Float32BufferAttribute(out,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(n*2),2));
 geometry.setIndex(Array.from({length:n},(_,i)=>i));
 // Share the cut intersections and untouched grid vertices before normals;
 // otherwise every triangle becomes a separate flat-shaded paint facet.
 const smooth=mergeVertices(geometry,1e-6);smooth.computeVertexNormals();mesh.geometry=smooth;geometry.dispose();old.dispose();
}
