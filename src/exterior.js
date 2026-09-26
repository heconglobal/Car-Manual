import * as T from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {sideWidth,doorAt,exteriorBeltHeight} from './body-contours.js';
const lerp=T.MathUtils.lerp;

// Closed molded cross-section, not three round wires laid on the paint.
export function rubMolding(h,id,path,normal,height=.021){
 const standOff=id.endsWith('-fascia-molding')?.001:.0005;
 const section=[[-1,0],[-.91,.003],[-.64,.0048],[-.30,.0034],[0,.0042],[.30,.0034],[.64,.0048],[.91,.003],[1,0]];
 h.surface(id,64,section.length-1,(u,v)=>{const n=Math.round(v*(section.length-1)),q=section[n],p=path(u,q[0]*height/2);const dir=normal(u);return p.map((x,i)=>x+dir[i]*(standOff+q[1]));},'blackPaint');
 for(const u of [0,1])h.surface(id,2,section.length-1,(_,v)=>{const q=section[Math.round(v*(section.length-1))],p=path(u,q[0]*height/2),dir=normal(u);return p.map((x,i)=>x+dir[i]*(standOff+q[1]*_));},'blackPaint');
}
function roundRect(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
export function formedPatch(h,id,face,cx,cy,w,height,depth,mat='blackPaint',holes=[]){
 const shape=roundRect(w,height,Math.min(.012,height*.20));
 for(const [x,y,ww,hh]of holes){const hole=roundRect(ww,hh,.004);for(const curve of hole.curves)for(const key of ['v0','v1','v2'])if(curve[key])curve[key].add(new T.Vector2(x-cx,y-cy));shape.holes.push(hole);}
 const raw=new T.ExtrudeGeometry(shape,{depth:Math.abs(depth),bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:3,curveSegments:16});
 // Tessellate BEFORE wrapping. Long triangulated caps otherwise cut straight
 // through the curved fascia and expose large red triangular patches.
 const input=raw.attributes.position,positions=[];
 for(let i=0;i<input.count;i+=3){const a=new T.Vector3().fromBufferAttribute(input,i),b=new T.Vector3().fromBufferAttribute(input,i+1),c=new T.Vector3().fromBufferAttribute(input,i+2),n=Math.max(1,Math.ceil(Math.max(a.distanceTo(b),b.distanceTo(c),c.distanceTo(a))/.016));
  const at=(u,v)=>a.clone().addScaledVector(b.clone().sub(a),u/n).addScaledVector(c.clone().sub(a),v/n);
  for(let u=0;u<n;u++)for(let v=0;v<n-u;v++){positions.push(...at(u,v).toArray(),...at(u+1,v).toArray(),...at(u,v+1).toArray());if(u+v<n-1)positions.push(...at(u+1,v).toArray(),...at(u+1,v+1).toArray(),...at(u,v+1).toArray());}
 }
 raw.dispose();const dense=new T.BufferGeometry();dense.setAttribute('position',new T.Float32BufferAttribute(positions,3));const g=mergeVertices(dense,1e-6);dense.dispose();g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
 const a=g.attributes.position;for(let i=0;i<a.count;i++){const p=face(cx+a.getX(i),cy+a.getY(i));p[2]+=Math.sign(depth)*(.003+a.getZ(i));a.setXYZ(i,...p);}g.computeVertexNormals();const m=h.add(id,g,mat);m.material.side=T.DoubleSide;return m;
}
function removeTriangles(mesh,predicate){const g=mesh.geometry,a=g.attributes.position,ix=g.index,keep=[];for(let i=0;i<ix.count;i+=3){const p=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)],v=p.map(j=>new T.Vector3().fromBufferAttribute(a,j));if(!predicate(v[0].add(v[1]).add(v[2]).multiplyScalar(1/3)))keep.push(...p);}g.setIndex(keep);g.computeVertexNormals();}
export {removeTriangles};

export function buildExterior(h){
 const {surface,tube,cyl,box,add,profile}=h;
 for(const [side,s]of [['left',1],['right',-1]]){
  const normal=()=>[s,0,0];
  // Handle lies in the protective molding; the pocket sits below it.
  const dp=(z,y,offset=0)=>{const p=doorAt(s,z,y);p[0]+=s*offset;return p;};
  for(const [a,b]of [[-.614,.342],[.482,.570]])rubMolding(h,'door-molding-'+side,(u,dy=0)=>dp(lerp(a,b,u),exteriorBeltHeight(lerp(a,b,u))+dy),normal);
  const handle='handle-'+side,handleRise=exteriorBeltHeight(.414)-.520;
  surface(handle,28,12,(u,v)=>{const z=lerp(.348,.478,u),y=lerp(.475,.506,v)+handleRise;return dp(z,y,.001+.002*Math.sin(v*Math.PI));},'dark');
  surface(handle,28,12,(u,v)=>{const z=lerp(.351,.475,u),y=.515+(v-.5)*.019+handleRise;return dp(z,y,.005+.006*Math.sin(v*Math.PI));},'blackPaint');
  tube(handle,Array.from({length:24},(_,i)=>dp(lerp(.349,.477,i/23),.477+handleRise,.004)),.0014,'red');
  const key=dp(.508,.483+handleRise,.003);cyl('door-lock-'+side,.008,.003,key,'chrome');box('door-lock-'+side,[.004,.002,.009],[key[0]+s*.002,key[1],key[2]],'dark',[],{},.0005);
  rubMolding(h,'belt-seal-'+side,(u,dy=0)=>[s*.800,.803+dy,lerp(-.590,.557,u)],normal,.014);
  surface('belt-seal-'+side,48,5,(u,v)=>[s*lerp(.798,.784,v),.808+.001*Math.sin(v*Math.PI),lerp(-.590,.557,u)],'rubber');
  for(const rear of [false,true]){
   const id=(rear?'rear':'front')+'-molding-'+side,centre=rear?1.1865:-1.1865;
   const ranges=rear?[[.599,.901],[1.48,1.695]]:[[-1.663,-1.482],[-.891,-.628]];
   for(const [a,b]of ranges)rubMolding(h,id,(u,dy=0)=>{const z=lerp(a,b,u),y=exteriorBeltHeight(z)+dy;return [s*sideWidth(z,y,centre,rear),y,z];},normal);
  }
  // Tapered mirror shell; rear-facing glass has its own closed rim and carrier.
  const shell='mirror-'+side,glass='mirror-glass-'+side,mount='mirror-mount-'+side;
  profile(mount,[[-.547,.807],[-.486,.803],[-.479,.850],[-.512,.884]],.009,s*.809,'rubber');
  surface(mount,32,12,(u,v)=>{const a=u*Math.PI*2;return [s*(.808+.063*v),.828+.009*v+.013*Math.sin(a),-.501+.027*Math.cos(a)];},'blackPaint');
  const perimeter=(a,scale=1)=>{const x=Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.55,y=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.60;return [s*(.893+.074*x*scale),.859+.040*y*scale,-.437+.009*x];};
  surface(shell,64,20,(u,v)=>{const p=perimeter(u*Math.PI*2),q=[s*.885,.850,-.550];return [lerp(q[0],p[0],.62+.38*Math.sin(v*Math.PI/2)),lerp(q[1],p[1],.65+.35*Math.sin(v*Math.PI/2)),lerp(q[2],p[2],v)];},'blackPaint');
  surface(shell,64,14,(u,v)=>{const p=perimeter(u*Math.PI*2);return [lerp(s*.885,p[0],.62*v),lerp(.850,p[1],.65*v),-.568+.018*v*v];},'blackPaint');
  surface(shell,64,5,(u,v)=>{const p=perimeter(u*Math.PI*2,1-.12*v);p[2]-=.006*v;return p;},'blackPaint');
  surface(glass,64,12,(u,v)=>{const p=perimeter(u*Math.PI*2,.87*v);p[2]-=.008+.002*(1-v*v);return p;},'chrome');
  // Both blades park across the base of the glass (not a V pointing outward).
  const pivotX=side==='left'?.16:-.48,midX=pivotX+.14;
  cyl('wiper-arm-'+side,.011,.011,[pivotX,.838,-.609],'blackPaint',[0,0,0]);
  tube('wiper-arm-'+side,[[pivotX,.844,-.609],[pivotX+.055,.852,-.591],[midX,.861,-.568]],.0045,'blackPaint');
  const blade='wiper-blade-'+side,start=midX-.2286,end=midX+.2286;
  const bladePoint=t=>[lerp(start,end,t),.850+.010*Math.sin(t*Math.PI),-.568+.012*Math.sin(t*Math.PI)];
  tube(blade,Array.from({length:40},(_,i)=>bladePoint(i/39)),.0022,'rubber');
  for(const [a,b,lift]of [[.08,.92,.012],[.08,.46,.007],[.54,.92,.007]])tube(blade,Array.from({length:18},(_,i)=>{const t=i/17,p=bladePoint(lerp(a,b,t));p[1]+=lift*Math.sin(t*Math.PI)+.004;return p;}),.002,'blackPaint');
  for(const t of [.08,.27,.46,.54,.73,.92]){const p=bladePoint(t);box(blade,[.011,.008,.009],[p[0],p[1]+.004,p[2]],'dark',[],{},.001);}
 }
 // Intake aperture is cut from the quarter; grating sits inside its lip.
 const intake=(u,v,depth=0)=>{const z=.633+.194*u,y=exteriorBeltHeight(z)-.133+.103*v;return [sideWidth(z,y,1.1865,true)+depth,y,z];};
 for(const v of [0,1])tube('side-intake',Array.from({length:20},(_,i)=>intake(i/19,v,-.004)),.003,'blackPaint');
 for(const u of [0,1])tube('side-intake',Array.from({length:12},(_,i)=>intake(u,i/11,-.004)),.003,'blackPaint');
 surface('side-intake',22,10,(u,v)=>intake(u,v,-.022),'dark');
 for(let i=0;i<5;i++)surface('side-intake',24,4,(u,v)=>intake(.025+.95*u,.10+i*.185+v*.070,-.003-v*.016),'blackPaint');
 const fuel=(a,r,depth=0)=>{const y=.710+Math.cos(a)*r,z=.93+Math.sin(a)*r;return [sideWidth(z,y,1.1865,true)+depth,y,z];};
 surface('fuel-door',64,14,(u,v)=>fuel(u*Math.PI*2,.0475*v,.001),'red');
 surface('fuel-door',64,4,(u,v)=>fuel(u*Math.PI*2,.0475,-.005*v),'red');
 surface('fuel-door-hinge',64,12,(u,v)=>fuel(u*Math.PI*2,.0515,-.083*v),'dark');
 surface('fuel-door-hinge',64,8,(u,v)=>fuel(u*Math.PI*2,lerp(.035,.0515,v),-.083),'dark');
 const fp=fuel(Math.PI/2,.036,-.01);box('fuel-door-hinge',[.008,.027,.014],fp,'zinc',[],{},.001);cyl('fuel-door-hinge',.002,.029,fp,'zinc',[0,0,0]);
 // Cowl grille has open longitudinal slots and individual nozzle bodies.
 box('cowl-grille',[1.28,.004,.012],[0,.818,-.604],'blackPaint',[],{},.002);
 box('cowl-grille',[1.28,.004,.010],[0,.824,-.571],'blackPaint',[],{},.002);
 for(let i=0;i<=68;i++)box('cowl-grille',[.004,.004,.032],[-.63+i*1.26/68,.821,-.588],'blackPaint',[-.18,0,0],{},.001);
 for(const x of [-.31,.31]){box('cowl-grille',[.016,.009,.016],[x,.829,-.605],'blackPaint',[],{},.003);cyl('cowl-grille',.0013,.002,[x,.832,-.597],'dark',[Math.PI/2,0,0]);}
 // Antenna is on the passenger fender in the photographed US-LHD car.
 box('antenna',[.035,.006,.055],[-.747,.813,-.681],'rubber',[],{},.005);
 cyl('antenna',.007,.025,[-.747,.828,-.681],'blackPaint',[0,0,0]);
 const mast=new T.CylinderGeometry(.0010,.0021,.635,12);add('antenna',mast,'dark',[-.747,1.153,-.681]);
 cyl('antenna',.0021,.006,[-.747,1.473,-.681],'dark',[0,0,0]);
}
