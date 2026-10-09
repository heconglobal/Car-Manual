// Actual triangle contact, including coplanar and edge-only intersections.
// The BVH is only a conservative candidate filter; boxes never decide contact.
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
const points=t=>[t.slice(0,3),t.slice(3,6),t.slice(6,9)];
const edges=p=>[sub(p[1],p[0]),sub(p[2],p[1]),sub(p[0],p[2])];
export function triangleAreaSquared(t){const p=points(t),n=cross(sub(p[1],p[0]),sub(p[2],p[0]));return dot(n,n)/4;}
export function trianglesContact(a,b,tolerance=1e-7){
 const p=points(a),q=points(b),u=edges(p),v=edges(q),n=cross(u[0],u[1]),m=cross(v[0],v[1]);
 if(dot(n,n)<1e-28||dot(m,m)<1e-28)return false;
 const axes=[n,m,...u.flatMap(e=>v.map(f=>cross(e,f))),...u.map(e=>cross(n,e)),...v.map(e=>cross(m,e))];
 for(const axis of axes){const length=Math.hypot(...axis);if(length<1e-18)continue;
  const ap=p.map(x=>dot(x,axis)),bp=q.map(x=>dot(x,axis)),allowance=tolerance*length;
  if(Math.max(...ap)<Math.min(...bp)-allowance||Math.max(...bp)<Math.min(...ap)-allowance)return false;
 }
 return true;
}
const boundsOf=t=>{const b=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<9;i++)b[i%3]=Math.min(b[i%3],t[i]),b[i%3+3]=Math.max(b[i%3+3],t[i]);return b;};
const union=(a,b)=>a.map((v,i)=>i<3?Math.min(v,b[i]):Math.max(v,b[i]));
const overlaps=(a,b,e)=>a.slice(0,3).every((v,i)=>v<=b[i+3]+e&&a[i+3]>=b[i]-e);
export function triangleTree(triangles){
 const records=triangles.map((triangle,index)=>({triangle,index,bounds:boundsOf(triangle)}));
 function build(rows){if(!rows.length)return null;const bounds=rows.reduce((b,r)=>union(b,r.bounds),rows[0].bounds);
  if(rows.length<=12)return {bounds,rows};
  const spans=bounds.slice(0,3).map((v,i)=>bounds[i+3]-v),axis=spans.indexOf(Math.max(...spans));
  rows.sort((a,b)=>a.bounds[axis]+a.bounds[axis+3]-b.bounds[axis]-b.bounds[axis+3]);const middle=Math.floor(rows.length/2);
  return {bounds,left:build(rows.slice(0,middle)),right:build(rows.slice(middle))};
 }
 return build(records);
}
// Column-major affine matrix, matching THREE.Matrix4.elements.
export function transformPoint(p,m){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];}
const transformTriangle=(t,m)=>points(t).flatMap(p=>transformPoint(p,m));
const transformBounds=(b,m)=>{let result=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<8;i++){const p=transformPoint([b[i&1?3:0],b[i&2?4:1],b[i&4?5:2]],m);result=union(result,[...p,...p]);}return result;};
export function firstTreeContact(moving,fixed,matrix,{tolerance=1e-7}={}){
 if(!moving||!fixed)return null;const transformedBounds=new Map(),transformedTriangles=new Map();
 const box=node=>{if(!transformedBounds.has(node))transformedBounds.set(node,transformBounds(node.bounds,matrix));return transformedBounds.get(node);};
 const triangle=row=>{if(!transformedTriangles.has(row))transformedTriangles.set(row,transformTriangle(row.triangle,matrix));return transformedTriangles.get(row);};
 const queue=[[moving,fixed]];let trianglePairs=0;
 while(queue.length){const [a,b]=queue.pop();if(!overlaps(box(a),b.bounds,tolerance))continue;
  if(a.rows&&b.rows){for(const x of a.rows)for(const y of b.rows){const tx=triangle(x);if(!overlaps(boundsOf(tx),y.bounds,tolerance))continue;trianglePairs++;if(trianglesContact(tx,y.triangle,tolerance))return {movingTriangleIndex:x.index,fixedTriangleIndex:y.index,movingTriangle:tx,fixedTriangle:y.triangle,trianglePairs};}}
  else if(a.rows){queue.push([a,b.left],[a,b.right]);}
  else if(b.rows){queue.push([a.left,b],[a.right,b]);}
  else {queue.push([a.left,b.left],[a.left,b.right],[a.right,b.left],[a.right,b.right]);}
 }
 return null;
}
