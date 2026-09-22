import * as T from 'three';

export function buildCylinderHead(h,bank,s,at){
 const id=`eng-${bank}-head`,rot=[s*Math.PI/6,0,0];
 // H-22 shows a scalloped cast gallery around the rocker gear, not a stack
 // of rectangular plates. The machined face remains planar.
 const outline=(inset=0)=>{
  const sh=new T.Shape(),w=.208-inset,d=.070-inset,r=.013;
  sh.moveTo(-w+r,-d);sh.lineTo(w-r,-d);sh.quadraticCurveTo(w,-d,w,-d+r);sh.lineTo(w,d-r);sh.quadraticCurveTo(w,d,w-r,d);sh.lineTo(-w+r,d);sh.quadraticCurveTo(-w,d,-w,d-r);sh.lineTo(-w,-d+r);sh.quadraticCurveTo(-w,-d,-w+r,-d);return sh;
 };
 const face=outline();
 for(let c=1;c<=3;c++)for(const [dx,z] of [[-.025,s*.017],[.025,s*.017]]){
  const hole=new T.Path();hole.absarc((c-2)*.105+dx,z,.014,0,Math.PI*2,true);face.holes.push(hole);
 }
 const base=new T.ExtrudeGeometry(face,{depth:.043,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:3,curveSegments:24});base.rotateX(-Math.PI/2);h.add(id,base,'iron',at(0,.291),rot);
 const N=128,levels=[[.333,0],[.349,.001],[.375,.003],[.400,.003],[.400,.013],[.372,.013],[.347,.012],[.335,.011]],positions=[],uv=[],indices=[];
 for(let j=0;j<levels.length;j++){
  const [y,inset]=levels[j],points=outline(inset).getSpacedPoints(N);
  for(let i=0;i<=N;i++){
   const p=points[i],castLobe=Math.exp(-(((p.x+.105)/.040)**2))+Math.exp(-((p.x/.040)**2))+Math.exp(-(((p.x-.105)/.040)**2));
   const weight=Math.max(0,1-Math.abs(y-.367)/.04),z=p.y+Math.sign(p.y)*.004*castLobe*weight;
   positions.push(...at(p.x,y,z));uv.push(i/N,j/(levels.length-1));
  }
 }
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+1,c=a+N+1;indices.push(a,b,c,b,c+1,c);}
 const wall=new T.BufferGeometry();wall.setAttribute('position',new T.Float32BufferAttribute(positions,3));wall.setAttribute('uv',new T.Float32BufferAttribute(uv,2));wall.setIndex(indices);wall.computeVertexNormals();h.add(id,wall,'iron').material.side=T.DoubleSide;
 for(let c=1;c<=3;c++)for(const dx of [-.025,.025]){
  const x=(c-2)*.105+dx;
  h.cyl(id,.014,.010,at(x,.337,s*.017),'iron',rot);
  h.ring(id,.006,.0015,at(x,.344,s*.017),'rotor',[Math.PI/2+s*Math.PI/6,0,0]);
 }
 for(const x of [-.18,-.052,.053,.18])for(const z of [-.052,.052])h.cyl(id,.010,.049,at(x,.361,z),'iron',rot);
 // Cast end pads and core-plug recesses retain a distinct machined edge.
 for(const x of [-.208,.208]){
  h.cyl(id,.021,.003,at(x,.352,0),'iron');
  h.cyl(id,.015,.003,at(x+Math.sign(x)*.002,.352,0),'dark');
 }
}

export function buildOilPan(h){
 // H-19 lower-engine illustration: shallow timing-end shelf transitioning
 // into a deeper sump. Local stamp dimensions remain reconstructed.
 const id='eng-pan',N=80,M=64;
 const smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
 const profile=(x,inner=false)=>{
  const floor=.888-.075*smooth((x+.10)/.12)+(inner?.002:0),end=smooth((Math.abs(x)-.174)/.024),width=.112-end*.008-(inner?.002:0);
  return new T.CatmullRomCurve3([
   [x,.936,width],[x,.927,width-.003],[x,floor+.024,width-.014],[x,floor+.006,width-.028],
   [x,floor,0],[x,floor+.006,-width+.028],[x,floor+.024,-width+.014],[x,.927,-width+.003],[x,.936,-width],
  ].map(p=>new T.Vector3(...p)),false,'centripetal');
 };
 for(const inner of [false,true]){
  const rows=Array.from({length:N+1},(_,i)=>profile(-.198+i/N*.396,inner));
  h.surface(id,N,M,(u,v)=>rows[Math.round(u*N)].getPoint(v).toArray(),'blackPaint');
 }
 // End walls are drawn stampings, open across their upper rim.
 for(const x of [-.198,.198]){
  const shape=new T.Shape();profile(x).getPoints(M).forEach((p,i)=>i?shape.lineTo(p.z,p.y):shape.moveTo(p.z,p.y));shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:.0025,bevelEnabled:true,bevelSize:.002,bevelThickness:.001,bevelSegments:2,curveSegments:24});geo.rotateY(Math.PI/2);h.add(id,geo,'blackPaint',[x,0,0]);
 }
 for(const z of [-.119,.119])h.box(id,[.41,.005,.022],[0,.938,z],'blackPaint',[],{},.002);
 for(const x of [-.198,.198])h.box(id,[.024,.005,.238],[x,.938,0],'blackPaint',[],{},.002);
 for(const x of [-.172,-.115,-.054,.01,.074,.14,.177])for(const z of [-.121,.121]){
  h.cyl(id,.006,.002,[x,.942,z],'blackPaint',[0,0,0]);
 }
 // Pressed bead and drain reinforcement, grouped with the pan in this pass.
 for(const z of [-.068,.068])h.tube(id,[[-.17,.885,z],[-.12,.883,z],[-.06,.856,z],[.025,.811,z],[.15,.811,z]],.003,'blackPaint');
 const boss=new T.Shape();boss.absarc(0,0,.011,0,Math.PI*2);const bore=new T.Path();bore.absarc(0,0,.0045,0,Math.PI*2,true);boss.holes.push(bore);h.add(id,new T.ExtrudeGeometry(boss,{depth:.006,bevelEnabled:false,curveSegments:24}),'blackPaint',[.132,.845,-.107]);
}

// These surfaces refine the GM illustration reconstruction; they are not
// dimensioned CAD. One hollow cover shell is used for each bank.
export function buildValveCover(h,bank,s,at){
 const id=`eng-${bank}-cover`,rot=[s*Math.PI/6,0,0];
 const contour=(w,d,r)=>{
  const shape=new T.Shape();shape.moveTo(-w+r,-d);shape.lineTo(w-r,-d);shape.quadraticCurveTo(w,-d,w,-d+r);shape.lineTo(w,d-r);shape.quadraticCurveTo(w,d,w-r,d);shape.lineTo(-w+r,d);shape.quadraticCurveTo(-w,d,-w,d-r);shape.lineTo(-w,-d+r);shape.quadraticCurveTo(-w,-d,-w+r,-d);return shape;
 };
 const levels=[[.402,.216,.075,.022],[.408,.218,.076,.023],[.413,.211,.070,.024],[.444,.205,.064,.026],[.461,.187,.052,.028],[.455,.184,.048,.026],[.440,.200,.058,.024],[.410,.205,.064,.021],[.403,.211,.068,.022]];
 const N=96,positions=[],uv=[],indices=[];
 for(let j=0;j<levels.length;j++){
  const [y,w,d,r]=levels[j],points=contour(w,d,r).getSpacedPoints(N);
  for(let i=0;i<=N;i++){const p=points[i];positions.push(...at(p.x,y,p.y));uv.push(i/N,j/levels.length);}
 }
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+1,c=a+N+1,d=c+1;indices.push(a,b,c,b,d,c);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const shell=h.add(id,geo,'red');shell.material.side=T.DoubleSide;
 const roof=new T.ExtrudeGeometry(contour(.187,.052,.028),{depth:.006,bevelEnabled:false,curveSegments:24});roof.rotateX(Math.PI/2);h.add(id,roof,'red',at(0,.461),rot);
 // Narrow machined fin faces on the cast upper pad.
 for(const z of [-.033,-.011,.011,.033]){
  h.box(id,[.343,.004,.005],at(0,.464,z),'alloy',rot,{},.002);
  for(const x of [-.1715,.1715])h.cyl(id,.0025,.004,at(x,.464,z),'alloy',rot);
 }
 for(const x of [-.172,.172])for(const z of [-.061,.061]){
  h.cyl(id,.010,.006,at(x,.409,z),'red',rot);h.bolt(id,at(x,.413,z),.0045);
 }
}

export function refineBlockCasting(h,bankPoint){
 // Cast webs around each bore, core-plug rims and end bosses reduce the flat
 // block silhouette while keeping the open crankcase and cylinder bores.
 for(const s of [-1,1])for(let c=1;c<=3;c++){
  const x=(c-2)*.105;
  for(const dx of [-.046,.046])h.tube('eng-block',[bankPoint(x+dx,.09,s*.032,s),bankPoint(x+dx,.16,s*.052,s),bankPoint(x+dx,.245,s*.057,s)],.007,'iron');
  h.ring('eng-block',.0238,.0028,[x,1.14,s*.137],'iron',[0,0,0]);
  h.box('eng-block',[.068,.028,.018],[x,1.07,s*.135],'iron',[s*.18,0,0],{},.009);
 }
 // Distributor support at the flywheel end of the intake valley.
 const shape=new T.Shape();shape.moveTo(-.07,-.034);shape.lineTo(.020,-.034);shape.quadraticCurveTo(.042,-.025,.042,0);shape.quadraticCurveTo(.042,.032,.018,.035);shape.lineTo(-.07,.041);shape.closePath();
 const hole=new T.Path();hole.absarc(0,0,.014,0,Math.PI*2,true);shape.holes.push(hole);
 const geo=new T.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:3,curveSegments:32});geo.rotateX(Math.PI/2);h.add('eng-lower-intake',geo,'castAluminum',[.244,1.267,.014]);
 h.tube('eng-lower-intake',[[.17,1.339,0],[.213,1.296,.015],[.229,1.256,.014]],.021,'castAluminum');
}
