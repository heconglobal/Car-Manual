import * as T from 'three';
import {engineToVehicle} from './powertrain-layout.js';

const C=engineToVehicle([-.24,1.03,-.18]);
const local=([x,y,z])=>[C[0]+x,C[1]+y,C[2]+z];
export const refrigerationLayout={
 compressorCenter:C,compressorDischarge:local([.098,.025,-.021]),compressorSuction:local([.098,-.009,.020]),
 rearDischarge:[-.52,.245,.77],rearSuction:[-.555,.245,.77],frontDischarge:[-.52,.245,-.79],frontSuction:[-.555,.245,-.79],
 condenserInlet:[-.325,.615,-1.823],condenserOutlet:[-.325,.309,-1.823],
 accumulatorOutlet:[-.548,.714,-.899],evaporatorInlet:[-.351,.64,-.880],
};
const id=k=>'hv-ac-'+k;

function annulus(h,key,outer,inner,length,position,material='alloy',axis=[1,0,0]){
 const sh=new T.Shape();sh.absarc(0,0,outer,0,Math.PI*2,false);
 const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);sh.holes.push(hole);
 const geo=new T.ExtrudeGeometry(sh,{depth:length,bevelEnabled:false,curveSegments:32});geo.translate(0,0,-length/2);
 geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),new T.Vector3(...axis).normalize()));
 return h.add(id(key),geo,material,position);
}
function plate(h,key,outline,holes,x,thickness=.006,material='castAluminum'){
 const sh=new T.Shape();outline.forEach(([y,z],i)=>i?sh.lineTo(-z,y):sh.moveTo(-z,y));sh.closePath();
 for(const [y,z,r] of holes){const p=new T.Path();p.absarc(-z,y,r,0,Math.PI*2,true);sh.holes.push(p);}
 const geo=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:false,curveSegments:24});geo.translate(0,0,-thickness/2);geo.rotateY(Math.PI/2);geo.translate(C[0]+x,C[1],C[2]);
 return h.add(id(key),geo,material);
}
function fitting(h,key,p,r=.009,axis=[0,0,1]){
 annulus(h,key,r,r*.63,.016,p,'zinc',axis);
 const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...axis).normalize());
 // The union nut has an open bore, so only the annular tube is on its axis.
 for(let n=0;n<6;n++){
  const a=n*Math.PI/3,vec=new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r).applyQuaternion(q);
  const mesh=h.box(id(key),[r*.83,.007,.002],[p[0]+vec.x,p[1]+vec.y,p[2]+vec.z],'zinc');
  mesh.quaternion.copy(q).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-a));
 }
}
function compressor(h){
 const {add,box,bolt,tube}=h;
 annulus(h,'compressor-body',.064,.051,.139,local([0,0,0]),'castAluminum');
 for(const side of [-1,1]){
  const key=side<0?'compressor-front':'compressor-rear',x=side*.083;
  if(side<0)annulus(h,key,.065,.018,.023,local([x,0,0]),'castAluminum');
  else plate(h,key,Array.from({length:64},(_,i)=>{const a=i*Math.PI/32;return[Math.cos(a)*.065,Math.sin(a)*.065];}),[[.025,-.021,.007],[-.009,.020,.010]],x,.023);
  if(side<0)annulus(h,key,.025,.012,.040,local([-.106,0,0]),'castAluminum');
  for(let n=0;n<3;n++){
   const a=n*Math.PI*2/3+.35,y=Math.cos(a)*.060,z=Math.sin(a)*.060;
   annulus(h,key,.015,.0055,.025,local([x,y,z]),'castAluminum');
   if(side>0){bolt(id('compressor-through-bolts'),local([.102,y,z]),.006,'x');h.cyl(id('compressor-through-bolts'),.003,.171,local([0,y,z]),'zinc');}
  }
  h.ring(id('compressor-head-seals'),.055,.0024,local([side*.071,0,0]),'rubber');
 }
 annulus(h,'compressor-coil',.051,.027,.021,local([-.111,0,0]),'dark');
 box(id('compressor-coil'),[.024,.017,.020],local([-.105,.051,.008]),'plastic');
 tube(id('compressor-coil'),[local([-.105,.053,.008]),local([-.09,.075,.022]),local([-.060,.073,.030])],.0028,'wire');
 // Native hollow pulley with an inset belt groove and real bearing opening.
 const profile=[[.021,-.017],[.061,-.017],[.067,-.013],[.067,-.008],[.061,-.004],[.061,.004],[.067,.008],[.067,.013],[.061,.017],[.021,.017],[.021,-.017]];
 add(id('compressor-pulley'),new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),64),'blackPaint',local([-.137,0,0]),[0,0,Math.PI/2]);
 annulus(h,'compressor-bearing',.020,.012,.027,local([-.137,0,0]),'zinc');
 add(id('compressor-bearing-ring'),new T.TorusGeometry(.020,.001,8,40,Math.PI*1.8),'zinc',local([-.154,0,0]),[0,Math.PI/2,0]);
 annulus(h,'compressor-clutch',.052,.037,.006,local([-.162,0,0]),'zinc');
 annulus(h,'compressor-clutch',.021,.010,.011,local([-.163,0,0]),'zinc');
 for(let n=0;n<3;n++){
  const a=n*Math.PI*2/3;
  tube(id('compressor-clutch'),[local([-.163,Math.cos(a)*.017,Math.sin(a)*.017]),local([-.164,Math.cos(a+.10)*.033,Math.sin(a+.10)*.033]),local([-.162,Math.cos(a+.17)*.046,Math.sin(a+.17)*.046])],.006,'zinc');
 }
 bolt(id('compressor-shaft-nut'),local([-.176,0,0]),.008,'x');
 fitting(h,'compressor-relief',local([.098,-.037,-.020]),.009,[1,0,0]);
 annulus(h,'compressor-switch',.012,.005,.019,local([.105,.016,.042]),'plastic');
 box(id('compressor-switch'),[.015,.021,.016],local([.118,.016,.042]),'plastic');
 plate(h,'compressor-pivot',[[-.044,-.066],[.048,-.066],[.105,-.018],[.092,.068],[.042,.074],[-.034,.066]],[[-.025,-.045,.007],[.060,.043,.007],[.075,-.022,.007]],.035,.009);
 plate(h,'compressor-rear-bracket',[[-.050,-.056],[.045,-.054],[.079,-.018],[.059,.060],[-.044,.059]],[[-.028,-.034,.006],[.032,-.033,.006],[.037,.038,.006]],.105,.006,'zinc');
 // A curved slot remains genuinely open through the adjustment bracket.
 const sh=new T.Shape();sh.moveTo(-.075,-.065);sh.lineTo(.060,-.065);sh.lineTo(.080,-.043);sh.lineTo(.061,-.011);sh.lineTo(-.070,-.024);sh.closePath();
 const slot=new T.Path();slot.absellipse(.003,-.043,.043,.006,0,Math.PI*2,true);sh.holes.push(slot);
 const geo=new T.ExtrudeGeometry(sh,{depth:.005,bevelEnabled:false,curveSegments:32});geo.rotateY(Math.PI/2);geo.translate(C[0]-.076,C[1],C[2]);add(id('compressor-adjuster'),geo,'zinc');
 for(const p of [[.122,-.028,-.034],[.122,.032,-.033],[.122,.037,.038],[-.084,-.025,-.043]])bolt(id('compressor-mounts'),local(p),.006,'x');
 // Convex envelope of the two pulley circles forms a closed visual belt.
 const crank=engineToVehicle([-.377,1.05,0]),compressorPulley=local([-.137,0,0]),beltX=compressorPulley[0];
 const crankProfile=[[.023,-.012],[.076,-.012],[.081,-.008],[.081,-.004],[.076,0],[.081,.004],[.081,.008],[.077,.013],[.050,.030],[.025,.033],[.023,-.012]];
 add(id('crank-groove'),new T.LatheGeometry(crankProfile.map(p=>new T.Vector2(...p)),64),'blackPaint',[beltX,crank[1],crank[2]],[0,0,Math.PI/2]);
 const points=[[crank[1],crank[2],.076],[C[1],C[2],.061]].flatMap(([y,z,r])=>Array.from({length:96},(_,i)=>{const a=i*Math.PI/48;return[y+Math.cos(a)*r,z+Math.sin(a)*r];})).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const half=ps=>{const r=[];for(const p of ps){while(r.length>1&&cross(r.at(-2),r.at(-1),p)<=0)r.pop();r.push(p);}r.pop();return r;};
 const hull=[...half(points),...half([...points].reverse())],path=new T.CurvePath();
 for(let n=0;n<hull.length;n++){const a=hull[n],b=hull[(n+1)%hull.length];path.add(new T.LineCurve3(new T.Vector3(beltX,...a),new T.Vector3(beltX,...b)));}
 add(id('compressor-belt'),new T.TubeGeometry(path,320,.0034,8,true),'rubber');
 box(id('compressor-splash-shield'),[.265,.004,.176],local([-.025,-.094,0]),'blackPaint',[],{},.003);
 for(const side of [-1,1])box(id('compressor-splash-shield'),[.004,.039,.176],local([-.025+side*.132,-.076,0]),'blackPaint',[],{},.003);
}
function condenser(h){
 const {box,tube,surface,bolt}=h,z=-1.823,x0=-.300,x1=.300,y0=.309,step=.306/15;
 for(let n=0;n<16;n++){
  const y=y0+n*step;tube(id('condenser-tubes'),[[x0,y,z],[0,y,z],[x1,y,z]],.0036,'blackPaint');
  if(n<15){const right=n%2===0,x=right?x1:x0;const points=Array.from({length:15},(_,k)=>{const a=-Math.PI/2+k*Math.PI/14;return[x+(right?1:-1)*Math.cos(a)*step/2,y+step/2+Math.sin(a)*step/2,z];});tube(id('condenser-tubes'),points,.0036,'blackPaint');}
  if(n<15)surface(id('condenser-fins'),180,2,(u,v)=>[x0+(x1-x0)*u,y+step/2+Math.sin(u*Math.PI*90)*.006,z-.010+v*.020],'dark');
 }
 // Both physical ports share the passenger-side end of the even-pass core.
 tube(id('condenser-tubes'),[[x0,y0,z],refrigerationLayout.condenserOutlet],.0036,'blackPaint');
 tube(id('condenser-tubes'),[[x0,y0+15*step,z],refrigerationLayout.condenserInlet],.0036,'blackPaint');
 for(const s of [-1,1]){
  box(id('condenser-frame'),[.018,.342,.022],[s*.318,.462,z],'blackPaint',[],{},.002);
  box(id('condenser-frame'),[.648,.017,.022],[0,.462+s*.170,z],'blackPaint',[],{},.002);
  box(id('condenser-seal'),[.022,.337,.014],[s*.332,.462,z+.025],'rubber',[],{},.002);
  box(id('condenser-seal'),[.672,.018,.014],[0,.462+s*.178,z+.025],'rubber',[],{},.002);
  for(const y of [.324,.60]){
   annulus(h,'condenser-frame',.013,.005,.004,[s*.333,y,z],'blackPaint',[0,0,1]);
   bolt(id('condenser-mounts'),[s*.333,y,z-.011],.005,'z');
   annulus(h,'condenser-mounts',.008,.0035,.010,[s*.333,y,z+.008],'rubber',[0,0,1]);
   h.cyl(id('condenser-retainers'),.005,.009,[s*.33,y,z+.031],'plastic',[Math.PI/2,0,0]);
  }
 }
}
export function refrigerationRoutes(){
 const l=refrigerationLayout;
 return [
  {id:id('compressor-hoses'),name:'discharge-flex',radius:.007,material:'rubber',points:[l.compressorDischarge,[C[0]+.16,C[1]+.04,C[2]-.04],[-.49,.32,.89],l.rearDischarge]},
  {id:id('compressor-hoses'),name:'suction-flex',radius:.011,material:'rubber',points:[l.compressorSuction,[C[0]+.16,C[1]-.04,C[2]+.05],[-.57,.31,.93],l.rearSuction]},
  {id:id('underbody-tubes'),name:'discharge-underbody',radius:.007,material:'alloy',points:[l.rearDischarge,[-.52,.245,.38],[-.52,.245,-.42],l.frontDischarge]},
  {id:id('underbody-tubes'),name:'suction-underbody',radius:.011,material:'alloy',points:[l.rearSuction,[-.555,.245,.38],[-.555,.245,-.42],l.frontSuction]},
  {id:id('front-discharge-tube'),name:'front-discharge',radius:.007,material:'alloy',points:[l.frontDischarge,[-.52,.30,-1.16],[-.48,.43,-1.55],[-.41,.615,-1.79],l.condenserInlet]},
  {id:id('front-liquid-tube'),name:'front-liquid',radius:.0055,material:'alloy',points:[l.condenserOutlet,[-.40,.315,-1.69],[-.43,.35,-1.32],[-.365,.51,-1.04],l.evaporatorInlet]},
  {id:id('front-suction-tube'),name:'front-suction',radius:.011,material:'alloy',points:[l.accumulatorOutlet,[-.573,.734,-.930],[-.590,.66,-.948],[-.58,.39,-.90],l.frontSuction]},
 ];
}
function lines(h){
 const l=refrigerationLayout;
 for(const route of refrigerationRoutes()){
  h.tube(route.id,route.points,route.radius,route.material);
  for(const endpoint of [route.points[0],route.points.at(-1)])fitting(h,route.id.slice(6),endpoint,route.radius*1.25,[0,0,1]);
 }
 // Open paired-port manifold; each seal belongs to its own identified branch.
 for(const [n,p] of [l.compressorDischarge,l.compressorSuction].entries()){
  annulus(h,'compressor-manifold',n?.016:.012,n?.009:.006,.017,p,'alloy');
  h.ring(id('compressor-port-seals'),n?.010:.007,.0015,[p[0]-.009,p[1],p[2]],'rubber');
 }
 h.box(id('compressor-manifold'),[.014,.043,.013],local([.097,.008,.001]),'alloy',[],{},.002);
 h.bolt(id('compressor-manifold'),local([.111,.008,.001]),.005,'x');
 for(const p of [l.frontDischarge,l.frontSuction,l.rearDischarge,l.rearSuction,l.condenserInlet,l.condenserOutlet,l.accumulatorOutlet,l.evaporatorInlet])h.ring(id('line-joint-seals'),p===l.accumulatorOutlet?.011:.007,.0011,p,'rubber',[0,0,0]);
 for(const z of [-.61,-.05,.53]){
  for(const [x,r] of [[-.52,.007],[-.555,.011]])annulus(h,'line-clamps',r+.004,r+.0007,.014,[x,.245,z],'zinc',[0,0,1]);
  h.box(id('line-clamps'),[.078,.003,.021],[-.539,.261,z],'zinc',[],{},.001);
  h.bolt(id('line-clamps'),[-.579,.261,z],.004,'y');
 }
 h.box(id('front-line-clip'),[.071,.004,.027],[-.55,.257,-.83],'zinc',[],{},.001);
 for(const [x,r] of [[-.52,.007],[-.555,.011]])annulus(h,'front-line-clip',r+.004,r+.001,.018,[x,.245,-.83],'zinc',[0,0,1]);
 h.box(id('line-shield'),[.106,.003,.29],[-.545,.275,.66],'blackPaint',[],{},.002);
 for(const x of [-.598,-.492])h.box(id('line-shield'),[.003,.039,.29],[x,.256,.66],'blackPaint',[],{},.002);
}
export function buildRefrigeration(h){compressor(h);condenser(h);lines(h);}
