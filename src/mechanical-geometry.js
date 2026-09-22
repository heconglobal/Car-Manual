import * as T from 'three';
// Native solid surfaces. Gear teeth are a visual helical reconstruction, not
// involute tooling data. All sizes are metres; axle/shaft direction is +X.
export function mechanicalTools(h){
 const {add,surface,cyl,ring,tube}=h;
 function annulus(id,outer,inner,width,pos,mat='rotor',rot=[0,0,0]){
  const shape=new T.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);
  const g=new T.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,curveSegments:48});g.translate(0,0,-width/2);g.rotateY(Math.PI/2);return add(id,g,mat,pos,rot);
 }
 function plate(id,outline,holes,thickness,x,mat='castAluminum'){
  const shape=new T.Shape();outline.forEach(([y,z],i)=>i?shape.lineTo(-z,y):shape.moveTo(-z,y));shape.closePath();
  for(const [y,z,r] of holes){const hole=new T.Path();hole.absarc(-z,y,r,0,Math.PI*2,true);shape.holes.push(hole);}
  const g=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false,curveSegments:32});g.translate(0,0,-thickness/2);g.rotateY(Math.PI/2);return add(id,g,mat,[x,0,0]);
 }
 function gear(id,r,width,teeth,pos,helix=.22,mat='rotor',bore=.010){
  const meshes=[annulus(id,r*.90,bore,width,pos,mat)];
  const n=teeth*8;
  // Extruded, twisted trapezoidal teeth have machined roots and bevelled edges.
  meshes.push(surface(id,n,8,(u,v)=>{const phase=(u*teeth)%1;const profile=phase<.18?0:phase<.35?(phase-.18)/.17:phase<.65?1:phase<.82?(.82-phase)/.17:0;const bevel=Math.min(1,v*12,(1-v)*12);const rad=r*.90+r*.10*profile*(.75+.25*bevel);const a=u*Math.PI*2+(v-.5)*helix;return [pos[0]+(v-.5)*width,pos[1]+Math.cos(a)*rad,pos[2]+Math.sin(a)*rad];},mat));
  for(const s of [-1,1])meshes.push(surface(id,n,1,(u,v)=>{const phase=(u*teeth)%1;const p=phase<.18?0:phase<.35?(phase-.18)/.17:phase<.65?1:phase<.82?(.82-phase)/.17:0;const a=u*Math.PI*2+s*helix/2;const rad=r*.89+v*(r*(.90+.075*p)-r*.89);return[pos[0]+s*width/2,pos[1]+Math.cos(a)*rad,pos[2]+Math.sin(a)*rad];},mat));
  return meshes;
 }
 function bearing(id,r,bore,width,pos){
  annulus(id,r,r*.84,width,pos,'rotor');annulus(id,bore*1.27,bore,width,pos,'rotor');
  const centre=(r*.84+bore*1.27)/2,roll=(r*.84-bore*1.27)*.43;
  for(let i=0;i<16;i++){const a=i*Math.PI/8;cyl(id,roll,width*.86,[pos[0],pos[1]+centre*Math.cos(a),pos[2]+centre*Math.sin(a)],'alloy');}
  for(const s of [-1,1])annulus(id,r*.86,bore*1.25,.0008,[pos[0]+s*width*.38,pos[1],pos[2]],'gold');
 }
 function spline(id,r,width,count,pos,mat='rotor'){gear(id,r,width,count,pos,0,mat,r*.35);}
 function spring(id,pos,r,length,axis='x',turns=6,wire=.0012,mat='dark'){
  tube(id,Array.from({length:turns*16+1},(_,i)=>{const u=i/(turns*16),a=u*turns*Math.PI*2;const p=[(u-.5)*length,Math.cos(a)*r,Math.sin(a)*r];if(Array.isArray(axis)){const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis).normalize());return new T.Vector3(...p).applyQuaternion(q).add(new T.Vector3(...pos)).toArray();}return axis==='y'?[pos[0]+p[1],pos[1]+p[0],pos[2]+p[2]]:pos.map((v,k)=>v+p[k]);}),wire,mat);
 }
 function arc(id,r,width,pos,start=-.7,end=Math.PI+.7,mat='castAluminum',halfWidth=.004){
  const sh=new T.Shape();sh.absarc(0,0,r+halfWidth,start,end,false);sh.lineTo(Math.cos(end)*(r-halfWidth),Math.sin(end)*(r-halfWidth));sh.absarc(0,0,r-halfWidth,end,start,true);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:width,bevelEnabled:true,bevelSize:.001,bevelThickness:.0007,bevelSegments:2,curveSegments:48});g.translate(0,0,-width/2);g.rotateY(Math.PI/2);return add(id,g,mat,pos);
 }
 return {annulus,plate,gear,bearing,spline,spring,arc};
}
