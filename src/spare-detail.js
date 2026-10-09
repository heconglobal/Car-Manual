import * as T from 'three';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {createMaterials} from './materials.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {spareParts,spareSections} from './spare-catalog.js';
export const spareDimensions={beadDiameter:.381,beadWidth:.1016};
export const sparePlacement={center:[0,.45,-1.09],angle:.48};
export function spareWheelPoint(p){return new T.Vector3(...p).applyAxisAngle(new T.Vector3(1,0,0),sparePlacement.angle).add(new T.Vector3(...sparePlacement.center)).toArray();}
export function createSpareDetail(){const root=new T.Group(),groups=new Map();for(const p of spareParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:p.system,section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(spareSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,createMaterials());buildSpare(h);h.optimize();correctLegacyHandedness(groups);return{root,groups};}
export function buildVehicleSpare(groups,materials){const detail=new Map(spareParts.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,materials);buildSpare(h);h.optimize();for(const p of spareParts)for(const mesh of [...detail.get(p.id).children]){mesh.userData.detailPartId=p.id;mesh.userData.partId='spare-wheel';groups.get('spare-wheel').add(mesh);}}
export function buildSpare(h){
 const {add,box,cyl,tube,ring,label}=h,{annulus,plate}=mechanicalTools(h),id=k=>'sp-'+k;
 const flat=(key,outline,holes,y,thickness=.003,mat='dark')=>{
  const sh=new T.Shape();outline.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));sh.closePath();
  for(const hole of holes){const path=new T.Path();if(hole.length===3)path.absarc(hole[0],-hole[1],hole[2],0,Math.PI*2,true);else{hole.forEach(([x,z],i)=>i?path.lineTo(x,-z):path.moveTo(x,-z));path.closePath();}sh.holes.push(path);}
  const g=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:false,curveSegments:48});g.translate(0,0,-thickness/2);g.rotateX(-Math.PI/2);return add(id(key),g,mat,[0,y,0]);
 };
 const washer=(key,r,b,w,p,mat='zinc',axis=[0,1,0])=>{const m=annulus(id(key),r,b,w,p,mat);m.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis));return m;};
 const handScrew=(key,p,r=.014,length=.033)=>{cyl(id(key),r,.012,p,'plastic',[0,0,0]);for(let i=0;i<20;i++){const a=i*Math.PI/10;box(id(key),[.002,.009,.002],[p[0]+Math.cos(a)*r,p[1],p[2]+Math.sin(a)*r],'plastic');}cyl(id(key),.0038,length,[p[0],p[1]-length/2-.004,p[2]],'zinc',[0,0,0]);};
 h.mapAdded(()=>{
  const bead=spareDimensions.beadDiameter/2,half=spareDimensions.beadWidth/2;
  // Tire dimensions apart from the bead seat remain reconstructed.
  const tire=[[-half,.1905],[-.060,.215],[-.045,.254],[-.027,.267],[.027,.267],[.045,.254],[.060,.215],[half,.1905]];
  add(id('tire'),new T.LatheGeometry(tire.map(([y,r])=>new T.Vector2(r,y)),96),'rubber');
  for(const y of [-.018,0,.018])ring(id('tire'),.267,.0011,[0,y,0],'rubber',[Math.PI/2,0,0]);
  const profile=[[-half-.008,.199],[-half-.006,.202],[-half,.199],[-half,bead],[-.035,.184],[-.026,.178],[.026,.178],[.035,.184],[half,bead],[half,.199],[half+.006,.202],[half+.008,.199]];
  add(id('rim'),new T.LatheGeometry(profile.map(([y,r])=>new T.Vector2(r,y)),96),'dark');
  const outline=Array.from({length:96},(_,i)=>[Math.cos(i*Math.PI/48)*.179,Math.sin(i*Math.PI/48)*.179]),holes=[[0,0,.029]];
  for(let i=0;i<5;i++){
   const a=i*Math.PI*2/5;holes.push([Math.cos(a)*.05,Math.sin(a)*.05,.006]);
   holes.push(Array.from({length:24},(_,j)=>{const t=j*Math.PI/12,r=.122+Math.cos(t)*.036,angle=a+Math.sin(t)*.22;return[Math.cos(angle)*r,Math.sin(angle)*r];}));
  }
  flat('rim',outline,holes,.024,.003,'dark');washer('rim',.079,.068,.003,[0,.025,0],'dark');
  const vx=.136,vz=-.12;washer('valve',.007,.002,.011,[vx,.052,vz],'rubber');washer('valve',.0035,.0016,.024,[vx,.062,vz],'zinc');
  cyl(id('valve-core'),.0012,.011,[vx,.064,vz],'gold',[0,0,0]);cyl(id('valve-core'),.0005,.018,[vx,.068,vz],'metal',[0,0,0]);
  washer('valve-cap',.005,.0036,.008,[vx,.080,vz],'plastic');cyl(id('valve-cap'),.005,.002,[vx,.085,vz],'plastic',[0,0,0]);
  for(const [text,r,centre]of [['TEMPORARY USE ONLY',.235,0],['60 PSI',.231,Math.PI]])for(let i=0;i<text.length;i++){
   const a=centre+(i-(text.length-1)/2)*.047;const m=label(id('markings'),text[i],[.010,.014],[Math.sin(a)*r,.057,Math.cos(a)*r],[0,0,0],{background:'#111213',foreground:'#55595b',width:64,height:64,font:'bold 42px Arial'});
   // Labels are graphic reconstructions on the tire sidewall, not mold data.
   m.rotation.set(-Math.PI/2,0,-a);m.material.polygonOffset=true;m.material.polygonOffsetFactor=-1;
  }
 },spareWheelPoint);
 // Stowage arrangement from 1985 owner 3-8 / GM 2P08-009. The retaining rod
 // crosses the exposed spare; the wrench lies behind it beneath the jack.
 tube(id('retaining-rod'),[[.37,.493,-1.245],[.33,.539,-1.20],[0,.571,-1.13],[-.32,.541,-1.03],[-.40,.49,-1.0]],.004,'metal');
 for(const p of [[.37,.493,-1.245],[-.40,.49,-1.0]])washer('retaining-rod',.010,.0045,.004,p,'metal');handScrew('spare-bolt',[.37,.512,-1.245]);
 const jx=-.426,jz=-.985;
 const mount=[[jx-.070,jz-.175],[jx+.060,jz-.175],[jx+.07,jz+.175],[jx-.06,jz+.175]],openings=[[[jx-.038,jz-.11],[jx+.03,jz-.11],[jx+.03,jz-.06],[jx-.038,jz-.06]],[[jx-.038,jz+.06],[jx+.03,jz+.06],[jx+.03,jz+.11],[jx-.038,jz+.11]]];
 flat('bracket',mount,openings,.316,.003,'dark');
 for(const z of [jz-.166,jz+.166]){box(id('bracket'),[.09,.06,.003],[jx,.286,z],'dark');box(id('bracket'),[.09,.003,.035],[jx,.256,z+.012],'dark');}
 handScrew('jack-bolt',[jx,.448,jz],.015,.092);
 for(const y of [.314,.323])box(id('u-nut'),[.022,.002,.022],[jx,y,jz],'metal');box(id('u-nut'),[.002,.01,.022],[jx+.01,.318,jz],'metal');
 washer('bracket-nut',.008,.003,.007,[jx+.025,.263,jz+.17],'zinc');cyl(id('bracket-screw'),.0052,.004,[jx-.025,.263,jz-.155],'zinc',[0,0,0]);cyl(id('bracket-screw'),.003,.020,[jx-.025,.251,jz-.155],'zinc',[0,0,0]);
 // Exterior jack sections are construction subdivisions of one catalog item.
 flat('jack-base',[[jx-.047,jz-.039],[jx+.047,jz-.039],[jx+.047,jz+.039],[jx-.047,jz+.039]],[],.333,.003,'zinc');
 for(const dx of [-.044,.044])box(id('jack-base'),[.003,.015,.072],[jx+dx,.341,jz],'zinc');
 const ends=[[.346,jz],[.385,jz-.146],[.424,jz],[.385,jz+.146]],arm=(key,a,b)=>{
  const dy=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dy,dz),oy=dz/len*.010,oz=-dy/len*.010,outline=[[a[0]+oy,a[1]+oz],[b[0]+oy,b[1]+oz],[b[0]-oy,b[1]-oz],[a[0]-oy,a[1]-oz]];
  for(const dx of [-.026,.026])plate(id(key),outline,[[...a,.004],[...b,.004]],.0025,jx+dx,'zinc');
  const m=box(id(key),[.052,.0025,len-.024],[jx,(a[0]+b[0])/2,(a[1]+b[1])/2],'zinc');m.rotation.x=-Math.atan2(dy,dz);
 };
 arm('jack-lower-arms',ends[0],ends[1]);arm('jack-lower-arms',ends[0],ends[3]);arm('jack-upper-arms',ends[1],ends[2]);arm('jack-upper-arms',ends[3],ends[2]);
 for(const [y,z]of ends){cyl(id('jack-pins'),.004,.064,[jx,y,z],'zinc');for(const dx of [-.034,.034])cyl(id('jack-pins'),.007,.002,[jx+dx,y,z],'zinc');}
 // Open center groove receives the flange; no solid block bridges the slot.
 for(const dx of [-.021,.021])box(id('jack-head'),[.033,.006,.059],[jx+dx,.432,jz],'zinc');box(id('jack-head'),[.075,.006,.008],[jx,.416,jz+.026],'zinc');
 tube(id('jack-leg'),[[jx-.030,.400,jz-.017],[jx-.055,.350,jz-.035],[jx-.055,.340,jz+.067],[jx-.028,.389,jz+.042]],.004,'dark');
 cyl(id('jack-screw'),.0046,.334,[jx,.385,jz-.012],'metal',[Math.PI/2,0,0]);
 const helix=new T.CatmullRomCurve3(Array.from({length:1201},(_,i)=>{const t=i/1200,a=t*40*Math.PI*2;return new T.Vector3(jx+Math.cos(a)*.005,.385+Math.sin(a)*.005,jz-.168+t*.31);}));add(id('jack-screw'),new T.TubeGeometry(helix,1000,.0008,6,false),'metal');
 washer('jack-trunnion',.011,.005,.049,[jx,.385,jz+.146],'zinc',[1,0,0]);
 for(const z of [jz-.142,jz-.15,jz-.156])washer('jack-thrust',.010,.0048,.003,[jx,.385,z],'zinc',[0,0,1]);
 washer('jack-drive',.013,.007,.006,[jx,.385,jz-.195],'metal',[1,0,0]);tube(id('jack-drive'),[[jx,.385,jz-.177],[jx,.385,jz-.189]],.0045,'metal');
 tube(id('wrench'),[[-.42,.285,-.745],[-.37,.294,-.738],[.23,.302,-.730],[.27,.310,-.730],[.278,.335,-.730]],.0055,'metal');
 // Catalog 19.56 mm across-flat socket; hollow hex bore, reconstructed wall.
 const sh=new T.Shape();sh.absarc(0,0,.014,0,Math.PI*2,false);const hole=new T.Path(),r=.01956/Math.sqrt(3);for(let i=0;i<6;i++){const a=-i*Math.PI/3;i?hole.lineTo(Math.cos(a)*r,Math.sin(a)*r):hole.moveTo(Math.cos(a)*r,Math.sin(a)*r);}hole.closePath();sh.holes.push(hole);const socket=new T.ExtrudeGeometry(sh,{depth:.031,bevelEnabled:false,curveSegments:32});socket.rotateX(-Math.PI/2);add(id('wrench'),socket,'metal',[.278,.335,-.730]);box(id('wrench'),[.029,.004,.011],[-.425,.285,-.745],'metal');
 washer('wrench-clip',.009,.0058,.014,[-.37,.294,-.738],'plastic',[1,0,0]);box(id('wrench-clip'),[.025,.003,.023],[-.37,.282,-.738],'metal');
}
