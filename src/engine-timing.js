import * as T from 'three';
import {v6BlockNominal,l44Nominal} from './factory-specifications.js';
import {bankOffset,headStackCorrection} from './engine-layout.js';

// Only the centre separation is a GM figure-11 nominal. Profiles, journal
// sizes, lobe phases and the assembled static pose are reconstructions.
export const timingLayout={crankY:1.05,camY:1.05+v6BlockNominal.camHeight,x:-.228,
 camRadius:.061,crankRadius:.033,coverY:1.097,coverFront:-.270,coverRear:-.204,
 bearingXs:[-.19,-.0625,.0535,.185],bearingWidth:.014,journalRadius:.024};
// Reconstructed roof allowance encloses the relocated chain, including its
// plate corners. It is a checked model envelope, not a GM cover dimension.
const lift=timingLayout.camY-1.181+.018;
export function timingCoverOutline(inner=false){
 const s=new T.Shape();
 if(!inner){s.moveTo(-.069,-.098);s.quadraticCurveTo(-.107,-.087,-.103,-.040);s.lineTo(-.080,.095+lift);s.quadraticCurveTo(-.069,.149+lift,0,.154+lift);s.quadraticCurveTo(.069,.149+lift,.080,.095+lift);s.lineTo(.103,-.040);s.quadraticCurveTo(.107,-.087,.069,-.098);}
 else{s.moveTo(-.061,-.085);s.lineTo(.061,-.085);s.quadraticCurveTo(.090,-.082,.087,-.037);s.lineTo(.065,.092+lift);s.quadraticCurveTo(.055,.134+lift,0,.139+lift);s.quadraticCurveTo(-.055,.134+lift,-.065,.092+lift);s.lineTo(-.087,-.037);s.quadraticCurveTo(-.090,-.082,-.061,-.085);}
 s.closePath();return s;
}

// Analytic external tangents join the unequal sprocket envelopes. Unlike
// the old spline, the straight runs cannot bow through the tooth rims.
export function timingChainPath(){
 const {camY,crankY,camRadius:R,crankRadius:r,x}=timingLayout;
 const angle=Math.acos(-(R-r)/(camY-crankY));
 const at=(y,r,a)=>new T.Vector3(x,y+r*Math.cos(a),r*Math.sin(a));
 const points=[];
 for(let i=0;i<=96;i++)points.push(at(camY,R,-angle+2*angle*i/96));
 points.push(at(crankY,r,angle));
 for(let i=1;i<=64;i++)points.push(at(crankY,r,angle+(2*Math.PI-2*angle)*i/64));
 points.push(points[0].clone());
 const path=new T.CurvePath();for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(points[i-1],points[i]));
 return path;
}

const ordered=[];
for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++)for(const [type,dx] of [['intake',-.025],['exhaust',.025]])ordered.push({bank,s,c,type,valveX:(c-2)*l44Nominal.borePitch+dx+bankOffset(s)});
ordered.sort((a,b)=>a.valveX-b.valveX);
export const camFollowers=ordered.map((v,i)=>{
 const x=-.164+i*.029,phase=i*Math.PI*.58,points=[];
 for(let j=0;j<96;j++){const a=j/96*Math.PI*2,r=.015+.008*Math.max(0,Math.cos(a-phase))**4;points.push([Math.cos(a)*r,Math.sin(a)*r]);}
 // Extruded local (u,v) becomes world (z=-u,y=v). Find the cam's support
 // plane normal to this bank's flat tappet, rather than guessing its height.
 const axis=new T.Vector3(0,Math.cos(Math.PI/6),v.s*.5);
 const support=points.reduce((best,[u,y])=>{const p=new T.Vector3(x,timingLayout.camY+y,-u),d=(p.y-timingLayout.camY)*axis.y+p.z*axis.z;return !best||d>best.d?{p,d}:best;},null);
 const bottom=support.p.clone(),centre=bottom.clone().addScaledVector(axis,.0175),seat=centre.clone().addScaledVector(axis,.011);
 return {...v,x,phase,points,axis,bottom,centre,seat};
});

export function pushrodGuidePoint(f){
 const y=.404-headStackCorrection,z=-f.s*.037;
 const upper=new T.Vector3(f.valveX,timingLayout.crankY+y*Math.cos(Math.PI/6)-z*f.s*.5,y*f.s*.5+z*Math.cos(Math.PI/6));
 const origin=new T.Vector3(bankOffset(f.s),timingLayout.crankY,0),lowerY=f.seat.clone().sub(origin).dot(f.axis);
 const t=(.351-headStackCorrection-lowerY)/(y-lowerY);
 return f.seat.clone().lerp(upper,t);
}

export function buildEngineTiming(h){
 const id=k=>'eng-'+k,{camY,crankY,x,bearingXs,bearingWidth,journalRadius}=timingLayout;
 h.cyl(id('camshaft'),.014,.43,[0,camY,0],'rotor');
 // Reconstructed locating nose and mounting flange join the timing sprocket
 // to the shaft. GM 6A2 figure 20 supplies the three-bolt arrangement.
 h.cyl(id('camshaft'),.010,.026,[-.222,camY,0],'rotor');
 h.cyl(id('camshaft'),.024,.007,[-.2145,camY,0],'rotor');
 h.cyl(id('crankshaft'),.017,.041,[-.2325,crankY,0],'rotor');
 for(const f of camFollowers){
  const s=new T.Shape();f.points.forEach(([u,v],i)=>i?s.lineTo(u,v):s.moveTo(u,v));s.closePath();
  const g=new T.ExtrudeGeometry(s,{depth:.011,bevelEnabled:false});g.translate(0,0,-.0055);g.rotateY(Math.PI/2);h.add(id('camshaft'),g,'rotor',[f.x,camY,0]);
 }
 for(const bx of bearingXs){
  h.cyl(id('camshaft'),journalRadius,bearingWidth,[bx,camY,0],'rotor');
  const profile=[[journalRadius,-bearingWidth/2],[journalRadius+.0015,-bearingWidth/2],[journalRadius+.0015,bearingWidth/2],[journalRadius,bearingWidth/2],[journalRadius,-bearingWidth/2]];
  h.add(id('cam-bearings'),new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),64),'gold',[bx,camY,0],[0,0,Math.PI/2]);
 }
 // 40/20 uses the researched S506/S511 replacement tooth quantities and
 // correct 2:1 relationship. Original GM tooling and fit are NOT established.
 for(const [key,y,r,n] of [['cam-gear',camY,.056,40],['crank-gear',crankY,.028,20]]){
  const shape=new T.Shape();
  for(let i=0;i<n*8;i++){const a=i/(n*8)*Math.PI*2,rr=r+(i%8>=2&&i%8<=5?.003:0);i?shape.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):shape.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}shape.closePath();
  const hole=new T.Path();hole.absarc(0,0,key==='cam-gear'?.010:.017,0,Math.PI*2,true);shape.holes.push(hole);
  if(key==='cam-gear'){
   for(let i=0;i<8;i++){const a=i*Math.PI/4,p=new T.Path();p.absarc(Math.cos(a)*.038,Math.sin(a)*.038,.008,0,Math.PI*2,true);shape.holes.push(p);}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,p=new T.Path();p.absarc(Math.cos(a)*.017,Math.sin(a)*.017,.003,0,Math.PI*2,true);shape.holes.push(p);h.bolt(id(key),[x-.008,y+Math.sin(a)*.017,-Math.cos(a)*.017],.004,'x');}
  }
  const geo=new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:false,curveSegments:64});geo.translate(0,0,-.006);geo.rotateY(Math.PI/2);h.add(id(key),geo,'metal',[x,y,0]);
 }
 // Pin-connected flat plates replace disconnected torus loops. Link count
 // is illustrative; this is not a chain pitch, tension or tooth-mesh solver.
 const path=timingChainPath(),count=64;
 for(let i=0;i<count;i++){
  const a=path.getPointAt(i/count),b=path.getPointAt((i+1)/count),mid=a.clone().add(b).multiplyScalar(.5),length=a.distanceTo(b),angle=Math.atan2(b.z-a.z,b.y-a.y);
  for(const side of [-1,1])h.box(id('chain'),[.0015,length+.003,.0048],[x+side*.0075,mid.y,mid.z],'dark',[angle,0,0],{},.001);
  h.cyl(id('chain'),.0016,.018,a.toArray(),'rotor');
 }
 const outer=timingCoverOutline(),opening=timingCoverOutline(true),seal=new T.Path();seal.absarc(0,crankY-timingLayout.coverY,.027,0,Math.PI*2,true);
 const face=outer.clone();face.holes.push(seal);
 const cap=new T.ExtrudeGeometry(face,{depth:.003,bevelEnabled:false,curveSegments:48});cap.rotateY(Math.PI/2);h.add(id('timing-cover'),cap,'metal',[timingLayout.coverFront,timingLayout.coverY,0]);
 // Open rear shell and matching flange: the chain sits inside the cavity.
 const wall=outer.clone();wall.holes.push(opening);
 const shell=new T.ExtrudeGeometry(wall,{depth:timingLayout.coverRear-timingLayout.coverFront-.003,bevelEnabled:false,curveSegments:48});shell.rotateY(Math.PI/2);h.add(id('timing-cover'),shell,'metal',[timingLayout.coverFront+.003,timingLayout.coverY,0]);
 for(const [y,z] of [[1.023,-.077],[1.023,.077],[1.16,-.077],[1.16,.077],[1.225+lift,-.047],[1.225+lift,.047]])h.bolt(id('timing-cover'),[-.274,y,z],.0045,'x');
 h.ring(id('timing-cover'),.033,.007,[-.277,crankY,0],'metal',[0,Math.PI/2,0]);
}
