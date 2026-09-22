import * as T from 'three';
// Spatial index for vertical ray/triangle intersections. Uses the actual
// transformed mesh triangles, including undersides; excludes vertical faces.
export function verticalSurfaceIndex(meshes,cell=.025){
 const bins=new Map(),key=(x,z)=>`${x},${z}`;
 for(const mesh of meshes){
  if(!mesh.isMesh)continue;const p=mesh.geometry.attributes.position,indices=mesh.geometry.index;
  for(let i=0;i<(indices?.count||p.count);i+=3){
   const v=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,indices?indices.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld));
   const [a,b,c]=v,den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(den)<1e-14)continue;
   const t={a,b,c,den},loX=Math.floor(Math.min(...v.map(v=>v.x))/cell),hiX=Math.floor(Math.max(...v.map(v=>v.x))/cell),loZ=Math.floor(Math.min(...v.map(v=>v.z))/cell),hiZ=Math.floor(Math.max(...v.map(v=>v.z))/cell);
   for(let x=loX;x<=hiX;x++)for(let z=loZ;z<=hiZ;z++){const k=key(x,z);if(!bins.has(k))bins.set(k,[]);bins.get(k).push(t);}
  }
 }
 return (x,z)=>{
  const hits=[];for(const {a,b,c,den}of bins.get(key(Math.floor(x/cell),Math.floor(z/cell)))||[]){
   const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/den,w=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/den,v=1-u-w;
   if(Math.min(u,w,v)>=-1e-9)hits.push(u*a.y+w*b.y+v*c.y);
  }
  return hits.sort((a,b)=>a-b);
 };
}
