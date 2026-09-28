import * as T from 'three';
// Tessellate long cap triangles before a nonlinear body-surface projection.
// Otherwise their corners fit while the flat triangle cuts through the skin.
export function tessellateForWrap(geometry,maxEdge=.012){
 const a=geometry.attributes.position,uv=geometry.attributes.uv,ix=geometry.index,positions=[],coords=[];
 for(let i=0;i<(ix?.count||a.count);i+=3){
  const ids=[0,1,2].map(k=>ix?ix.getX(i+k):i+k),p=ids.map(j=>new T.Vector3().fromBufferAttribute(a,j));
  const t=ids.map(j=>uv?new T.Vector2().fromBufferAttribute(uv,j):new T.Vector2());
  const n=Math.max(1,Math.ceil(Math.max(p[0].distanceTo(p[1]),p[1].distanceTo(p[2]),p[2].distanceTo(p[0]))/maxEdge));
  const emit=(u,v)=>{const w=[1-(u+v)/n,u/n,v/n];for(let k=0;k<3;k++)positions.push(p.reduce((sum,q,j)=>sum+q.getComponent(k)*w[j],0));for(let k=0;k<2;k++)coords.push(t.reduce((sum,q,j)=>sum+q.getComponent(k)*w[j],0));};
  for(let u=0;u<n;u++)for(let v=0;v<n-u;v++){emit(u,v);emit(u+1,v);emit(u,v+1);if(u+v<n-1){emit(u+1,v);emit(u+1,v+1);emit(u,v+1);}}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(coords,2));g.computeVertexNormals();return g;
}
