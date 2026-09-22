import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness,transformedGeometry} from './vehicle-frame.js';
import {brakeParts,brakeSections,brakeCorners,brakeDimensions} from './brake-catalog.js';

// Author alongside the existing legacy builders (+X left); convert exactly
// once at the model boundary. Corner surfaces are shared with the whole car.
export function brakeMaterials(base=createMaterials()){
 const m={...base};for(const k of ['castAluminum','rotor','iron','rubber','plastic','metal','blackPaint','reservoir'])m[k]=base[k].clone();
 m.castAluminum.roughness=.59;m.castAluminum.metalness=.72;m.castAluminum.bumpScale=.000035;
 m.rotor.roughness=.42;m.rotor.bumpScale=.000009;m.iron.bumpScale=.00008;
 m.reservoir.transparent=false;m.reservoir.opacity=1;m.reservoir.roughness=.58;
 m.rubber.bumpScale=.000025;m.plastic.bumpScale=.00002;m.metal.bumpScale=.000035;
 m.friction=new T.MeshStandardMaterial({color:'#383a39',roughness:.96,metalness:.03,bumpMap:base.iron.bumpMap,bumpScale:.000055});
 return m;
}
export function createBrakeDetail(){
 const root=new T.Group(),groups=new Map();
 for(const p of brakeParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'brakes',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(brakeSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,brakeMaterials());buildBrakes(h,groups);h.optimize();correctLegacyHandedness(groups);return{root,groups};
}
function place(groups,ids,matrix){
 for(const id of ids)for(const mesh of groups.get(id).children){mesh.updateMatrix();const transform=matrix.clone().multiply(mesh.matrix),old=mesh.geometry;mesh.geometry=transformedGeometry(old,transform);old.dispose();mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);}
}
function brakeTools(h){
 const {add,box,cyl,tube}=h,{annulus,plate,spring,arc}=mechanicalTools(h);
 const lathe=(id,profile,mat='rotor',pos=[0,0,0])=>{const g=new T.LatheGeometry(profile.map(([x,r])=>new T.Vector2(r,x)),80);g.rotateZ(-Math.PI/2);return add(id,g,mat,pos);};
 function thread(id,pos,r,width,turns,hand=-1){const curve=new T.CatmullRomCurve3(Array.from({length:turns*12+1},(_,i)=>{const u=i/(turns*12),a=hand*u*turns*Math.PI*2;return new T.Vector3(pos[0]+(u-.5)*width,pos[1]+Math.cos(a)*r,pos[2]+Math.sin(a)*r);}));return add(id,new T.TubeGeometry(curve,turns*12,.0003,5,false),'zinc');}
 function hex(id,r,l,pos,mat='zinc',bore=0){
  const sh=new T.Shape();for(let i=0;i<6;i++){const a=i*Math.PI/3;i?sh.lineTo(Math.cos(a)*r,Math.sin(a)*r):sh.moveTo(Math.cos(a)*r,Math.sin(a)*r);}sh.closePath();
  if(bore){const hole=new T.Path();hole.absarc(0,0,bore,0,Math.PI*2,true);sh.holes.push(hole);}
  const g=new T.ExtrudeGeometry(sh,{depth:l,bevelEnabled:true,bevelSize:.0004,bevelThickness:.0003,bevelSegments:2,curveSegments:20});g.translate(0,0,-l/2);g.rotateY(Math.PI/2);return add(id,g,mat,pos);
 }
 function bolt(id,pos,r=.005,l=.03,direction=-1){cyl(id,r*.6,l,[pos[0]+direction*l/2,...pos.slice(1)],'zinc');hex(id,r,r*.75,pos);annulus(id,r*1.18,r*.65,.001,[pos[0]+direction*.002,...pos.slice(1)],'zinc');}
 function taperedBearing(id,x,outer,inner,width){
  lathe(id,[[x-width/2,inner],[x+width/2,inner],[x+width/2,inner+.003],[x-width/2,inner+.006],[x-width/2,inner]],'rotor');
  for(let i=0;i<18;i++){const a=i*Math.PI/9,r=(outer+inner)/2;const mesh=cyl(id,.0028,width*.81,[x,Math.cos(a)*r,Math.sin(a)*r],'rotor');mesh.rotateZ(Math.cos(a)*.13);mesh.rotateY(Math.sin(a)*.13);}
  for(const e of [-1,1])annulus(id,outer-.002,inner+.003,.0008,[x+e*width*.44,0,0],'gold');
 }
 function crescent(id,outer,inner,thickness,x,direction=1,start=-.68,end=.68,mat='iron'){
  const points=[];for(let i=0;i<=32;i++){const a=start+(end-start)*i/32;points.push([Math.sin(a)*outer,direction*Math.cos(a)*outer]);}
  for(let i=32;i>=0;i--){const a=start+(end-start)*i/32;points.push([Math.sin(a)*inner,direction*Math.cos(a)*inner]);}
  return plate(id,points,[],thickness,x,mat);
 }
 return {annulus,plate,spring,arc,lathe,hex,bolt,taperedBearing,crescent,thread};
}
export function buildBrakes(h,groups){
 for(const c of brakeCorners){buildCorner(h,c);const matrix=new T.Matrix4().makeScale(c.sign,1,1);matrix.setPosition(c.sign*(c.front?.700:.702),.307,c.z);place(groups,brakeParts.filter(p=>p.corner===c.id).map(p=>p.id),matrix);}
 buildMaster(h);buildBooster(h);
 const unit=new T.Matrix4().makeRotationY(Math.PI/2);unit.setPosition(.43,.60,-.65);
 place(groups,brakeParts.filter(p=>['brake-master','brake-booster'].includes(p.section)).map(p=>p.id),unit);
 buildLines(h);buildParking(h);buildPedal(h);
}
function buildCorner(h,c){
 const {add,box,cyl,tube,ring,surface}=h,{annulus,plate,spring,lathe,hex,bolt,taperedBearing,crescent,thread}=brakeTools(h);
 const id=k=>'br-'+c.id+'-'+k,d=c.front?1:-1,R=brakeDimensions.diameter/2,t=c.front?brakeDimensions.frontThickness:brakeDimensions.rearThickness,cz=d*.098;
 // The early discs are solid: no invented ventilation slots or drilled faces.
 annulus(id('rotor'),R,.072,t,[0,0,0],'rotor');
 if(c.front){
  lathe(id('rotor'),[[-t/2,.071],[t/2,.073],[.031,.059],[.034,.057],[.063,.038],[.067,.035],[.067,.025],[.013,.028],[-t/2,.028],[-t/2,.071]],'iron');
  annulus(id('rotor'),.063,.030,.007,[.032,0,0],'rotor');
  for(const [key,x,r,b,w] of [['inner-bearing',.007,.029,.014,.016],['outer-bearing',.055,.024,.010,.014]]){
   taperedBearing(id(key),x,r,b,w);lathe(id(key.replace('bearing','race')),[[x-w/2,r+.002],[x+w/2,r+.002],[x+w/2,r-.002],[x-w/2,r],[x-w/2,r+.002]],'rotor');
  }
  annulus(id('grease-seal'),.030,.0145,.005,[-.005,0,0],'rubber');annulus(id('grease-seal'),.030,.026,.004,[-.005,0,0],'zinc');
  annulus(id('spindle-washer'),.019,.0105,.002,[.066,0,0],'zinc');box(id('spindle-washer'),[.002,.003,.005],[.066,.010,0],'zinc',[],{},.0002);
  hex(id('spindle-nut'),.014,.011,[.074,0,0],'zinc',.009);for(let n=0;n<6;n++){const a=n*Math.PI/3;box(id('spindle-nut'),[.004,.005,.005],[.082,Math.cos(a)*.011,Math.sin(a)*.011],'zinc',[a,0,0],{},.0003);}
  tube(id('cotter'),[[.080,-.018,0],[.081,.008,0],[.083,.011,0],[.085,.008,0],[.081,-.018,0],[.076,-.021,0]],.00075,'zinc');
  lathe(id('grease-cap'),[[.068,.028],[.073,.029],[.087,.027],[.097,.021],[.101,.002],[.100,0],[.096,.018],[.086,.025],[.072,.027],[.068,.027],[.068,.028]],'zinc');
  // Spindle and nonuniform knuckle webs; upper/lower pivots remain reconstructed.
  lathe(id('spindle'),[[-.044,.027],[-.017,.027],[-.017,.014],[.035,.014],[.035,.010],[.083,.009],[.084,0],[-.044,0],[-.044,.027]],'iron');
  plate(id('spindle'),[[-.091,-.011],[-.071,.015],[-.036,.024],[.040,.020],[.098,.006],[.102,-.013],[.074,-.026],[.03,-.035],[-.026,-.033],[-.070,-.035]],[[0,0,.010]],.026,-.055,'iron');
  for(const y of [-.085,.091]){const m=annulus(id('spindle'),.023,.008,.032,[-.067,y,-.014],'iron');m.rotateZ(Math.PI/2);}
  tube(id('spindle'),[[-.065,-.025,0],[-.105,-.037,-.075],[-.09,-.037,-.105]],.013,'iron');
  const arm=annulus(id('spindle'),.016,.007,.015,[-.09,-.037,-.105],'iron');arm.rotateZ(Math.PI/2);
  plate(id('bracket'),[[-.077,.078],[-.071,.114],[-.057,.121],[-.047,.115],[-.037,.071],[.037,.071],[.047,.115],[.057,.121],[.071,.114],[.077,.078],[.048,.052],[-.048,.052]],[[.060,.098,.006],[-.060,.098,.006]],.013,-.055,'iron');
  for(const y of [-.048,.048])bolt(id('bracket-bolts'),[-.078,y,.060],.008,.030,1);
 }else{
  // Separate mounting hat; no integral spindle-bearing hub on the rear disc.
  lathe(id('rotor'),[[-t/2,.072],[t/2,.072],[.031,.065],[.034,.064],[.034,.060],[.029,.060],[-t/2,.066],[-t/2,.072]],'iron');
  const holes=[[0,0,.029]];for(let n=0;n<5;n++){const a=n*Math.PI*2/5;holes.push([Math.cos(a)*.05,Math.sin(a)*.05,.0065]);}
  const outline=Array.from({length:72},(_,i)=>[Math.cos(i*Math.PI/36)*.064,Math.sin(i*Math.PI/36)*.064]);plate(id('rotor'),outline,holes,.004,.032,'rotor');
  plate(id('hub'),Array.from({length:60},(_,i)=>{const a=i*Math.PI/30,r=.047+.010*(.5+.5*Math.cos(a*5));return[Math.cos(a)*r,Math.sin(a)*r];}),[[0,0,.014]],.009,.024,'rotor');
  lathe(id('hub'),[[-.049,.032],[-.015,.033],[.019,.036],[.024,.028],[.040,.028],[.041,.021],[.028,.016],[-.049,.016],[-.049,.032]],'rotor');
  for(const x of [-.038,-.009])annulus(id('hub'),.0335,.022,.002,[x,0,0],'rubber');
  const tri=[[-.044,-.039],[.040,-.047],[.055,.022],[.010,.053],[-.047,.029]];plate(id('hub'),tri,[[0,0,.016]],.009,-.037,'iron');
  for(let n=0;n<3;n++){const a=n*Math.PI*2/3+.4;bolt(id('hub-bolts'),[-.067,Math.cos(a)*.046,Math.sin(a)*.046],.008,.041,1);}
  hex(id('axle-nut'),.017,.015,[.049,0,0],'zinc',.010);annulus(id('axle-nut'),.019,.010,.003,[.039,0,0],'zinc');
  annulus(id('knuckle-seal'),.032,.019,.005,[-.056,0,0],'rubber');
  plate(id('knuckle'),[[-.083,-.025],[-.067,.025],[-.015,.045],[.055,.036],[.083,.015],[.078,-.035],[.030,-.042],[-.039,-.041]],[[0,0,.034]],.032,-.055,'iron');
  const lowerBoss=annulus(id('knuckle'),.021,.008,.030,[-.055,-.083,0],'iron');lowerBoss.rotateZ(Math.PI/2);
  for(const x of [-.078,-.028])plate(id('knuckle'),[[.025,-.027],[.127,-.027],[.131,.017],[.024,.035]],[[.081,-.005,.007],[.116,-.005,.007]],.010,x,'iron');
  tube(id('knuckle'),[[-.054,-.018,-.021],[-.087,-.045,-.085],[-.089,-.045,-.109]],.012,'iron');const toe=annulus(id('knuckle'),.015,.006,.014,[-.089,-.045,-.109],'iron');toe.rotateZ(Math.PI/2);
  for(const y of [-.060,.060]){annulus(id('knuckle'),.013,.005,.022,[-.060,y,cz],'iron');tube(id('knuckle'),[[-.054,y*.48,0],[-.055,y,cz]],.012,'iron');}
 }
 // Disc shields are open where the caliper passes; shallow concentric pressings.
 const start=d>0?.73:Math.PI+.73,end=start+Math.PI*2-1.46;
 crescent(id('shield'),.130,.043,.0009,-.014,1,start,end,'zinc');
 for(const r of [.052,.126])tube(id('shield'),Array.from({length:90},(_,i)=>{const a=start+(end-start)*i/89;return[-.015,Math.sin(a)*r,Math.cos(a)*r];}),.0012,'zinc');
 for(let n=0;n<3;n++){const a=1+n*2;bolt(id('shield-bolts'),[-.023,Math.cos(a)*.042,Math.sin(a)*.042],.004,.013,1);}
 for(let n=0;n<5;n++){const a=n*Math.PI*2/5,y=Math.cos(a)*.05,z=Math.sin(a)*.05;cyl(id('studs'),.0057,.034,[.047,y,z],'zinc');cyl(id('studs'),.009,.004,[.028,y,z],'iron');thread(id('studs'),[.047,y,z],.0058,.022,11,-c.sign);}
 // Caliper piston bore and arched bridge. Pad cavity remains physically open.
 const bore=c.front?.0245:.024;
 lathe(id('housing'),[[-.083,.025],[-.078,.036],[-.030,.035],[-.020,.031],[-.020,bore],[-.074,bore],[-.077,.009],[-.083,.009],[-.083,.025]],'castAluminum',[0,0,cz]);
 if(c.front)cyl(id('housing'),.024,.004,[-.080,0,cz],'castAluminum');
 for(const y of [-.053,.053]){
  annulus(id('housing'),.013,.007,.068,[-.037,y,cz],'castAluminum');
  // Curved shoulders join the bore shell to the guide eyes and outer fingers.
  tube(id('housing'),[[-.062,y*.45,cz],[-.047,y*.84,cz+d*.020],[-.024,y,cz+d*.024],[.028,y*.78,cz+d*.020]],.012,'castAluminum');
  annulus(id('housing'),.0082,.0069,.001,[-.072,y,cz],'rotor');
 }
 for(const y of [-.022,.022])box(id('housing'),[.087,.025,.016],[-.011,y,d*.135],'castAluminum',[0,0,0],{},.008);
 // A continuous outer casting with a relieved pad window, rather than four
 // disconnected rounded blocks. Curves follow the early factory caliper figure.
 const cheek=new T.Shape();cheek.moveTo(-.028,-.055);cheek.quadraticCurveTo(-.029,-.064,-.019,-.064);cheek.lineTo(.021,-.055);cheek.quadraticCurveTo(.031,-.05,.031,-.036);cheek.lineTo(.031,.036);cheek.quadraticCurveTo(.031,.05,.021,.055);cheek.lineTo(-.019,.064);cheek.quadraticCurveTo(-.029,.064,-.028,.055);cheek.lineTo(-.028,.026);cheek.bezierCurveTo(.003,.025,.003,-.025,-.028,-.026);cheek.closePath();
 const outer=new T.ExtrudeGeometry(cheek,{depth:.020,bevelEnabled:true,bevelSize:.002,bevelThickness:.0015,bevelSegments:3,curveSegments:24});
 // Shape coordinates are radial and vertical; orient local +X through the pad.
 outer.translate(0,0,-.010);outer.rotateY(Math.PI/2);if(d>0)outer.rotateY(Math.PI);add(id('housing'),outer,'castAluminum',[.031,0,cz]);
 for(const y of [-.046,.046])box(id('housing'),[.006,.016,.038],[.044,y,cz],'castAluminum',[],{},.002);
 const pistonRear=-.064,pistonFront=-(t/2+.011);
 lathe(id('piston'),[[pistonRear,bore-.0002],[pistonFront,bore-.0002],[pistonFront,.020],[pistonRear+.003,.020],[pistonRear+.003,0],[pistonRear,0],[pistonRear,bore-.0002]],'rotor',[0,0,cz]);
 if(!c.front){
  cyl(id('piston'),.020,.002,[pistonFront,0,cz],'rotor');for(const y of [-.010,.010])cyl(id('piston'),.003,.001,[pistonFront+.0012,y,cz],'dark');
 }
 annulus(id('piston-seal'),bore+.0012,bore-.0002,.0022,[-.034,0,cz],'rubber');
 lathe(id('piston-boot'),[[-.027,bore+.001],[-.023,bore+.004],[-.019,bore+.0045],[-.017,bore+.002],[-.015,bore+.001],[-.015,bore-.0001],[-.018,bore+.0003],[-.021,bore+.003],[-.024,bore+.0025],[-.027,bore-.0001],[-.027,bore+.001]],'rubber',[0,0,cz]);
 const back=t/2+.010,lining=t/2+.0045;
 for(const [key,face] of [['pad-inner',-1],['pad-outer',1]]){
  crescent(id(key),.124,.074,.003,face*back,d,-.61,.61,'dark');
  for(const [a,b] of [[-.56,-.018],[.018,.56]])crescent(id(key),.119,.079,.007,face*lining,d,a,b,'friction');
  for(const y of [-.064,.064])box(id(key),[.003,.012,.015],[face*back,y,d*.096],'dark',[],{},.002);
  if(face===1)for(const y of [-.050,.050])tube(id(key),[[face*back,y,d*.101],[face*(back+.008),y,d*.111],[face*(back+.015),y,d*.103]],.0013,'zinc');
 }
 for(const y of [-.053,.053]){
  bolt(id('guide-bolts'),[-.083,y,cz],.007,.082,1);annulus(id('guide-sleeves'),.0068,.004,.055,[-.040,y,cz],'rotor');
  annulus(id('guide-bushings'),.009,.0069,.005,[-.068,y,cz],'rubber');annulus(id(c.front?'guide-small-bushings':'guide-bushings'),.0085,.0069,.004,[-.013,y,cz],'rubber');
  lathe(id('guide-covers'),[[-.081,.009],[-.078,.010],[-.074,.009],[-.074,.007],[-.080,.007],[-.081,.009]],'rubber',[0,y,cz]);
 }
 // Bleed nipple is above the piston on every corner, including mirrored sides.
 const bp=[-.055,.032,cz];const bgroup=[];
 for(const mesh of [cyl(id('bleeder'),.003,.018,bp,'zinc',[0,0,0]),hex(id('bleeder'),.005,.005,[-.055,.042,cz]),cyl(id('bleeder'),.0028,.008,[-.055,.050,cz],'zinc',[0,0,0])])bgroup.push(mesh);
 bgroup[1].rotateZ(Math.PI/2);cyl(id('bleeder'),.001,.0005,[-.055,.0542,cz],'dark',[0,0,0]);
 const cap=lathe(id('bleeder-cap'),[[0,.0034],[.008,.0037],[.012,.0025],[.013,0],[.011,0],[.008,.0025],[0,.0025],[0,.0034]],'rubber');cap.rotation.z=Math.PI/2;cap.position.set(-.055,.049,cz);
 if(c.front){for(const a of [0,2*Math.PI/3,4*Math.PI/3])tube(id('pad-spring'),[[-.025,Math.cos(a)*.018,cz+Math.sin(a)*.018],[-.022,Math.cos(a)*.022,cz+Math.sin(a)*.022],[-.017,Math.cos(a)*.017,cz+Math.sin(a)*.017],[-.017,0,cz]],.0011,'zinc');}
 else tube(id('pad-spring'),Array.from({length:100},(_,i)=>{const a=i/99*Math.PI*2,r=.022+.002*Math.cos(a*3);return[-.011,Math.cos(a)*r,cz+Math.sin(a)*r];}),.0009,'zinc');
 tube(id('wear-tab'),[[back,.058,d*.104],[back+.006,.058,d*.108],[.001,.065,d*.114]],.0012,'zinc');
 if(!c.front)buildRearActuator(h,id,cz,bore);
}

function buildRearActuator(h,id,cz,bore){
 const {box,cyl,tube,ring}=h,{annulus,plate,spring,lathe,hex,bolt,thread}=brakeTools(h);
 lathe(id('actuator'),[[-.104,.0045],[-.092,.007],[-.069,.007],[-.067,.011],[-.063,.011],[-.060,.006],[-.033,.006],[-.029,.004],[-.029,0],[-.104,0],[-.104,.0045]],'rotor',[0,0,cz]);
 thread(id('actuator'),[-.048,0,cz],.0061,.024,13);
 spring(id('balance-spring'),[-.046,0,cz],.0165,.032,'x',7,.0012,'dark');
 annulus(id('thrust-washer'),.012,.0067,.0015,[-.069,0,cz],'rotor');annulus(id('shaft-seal'),.010,.0067,.002,[-.072,0,cz],'rubber');
 cyl(id('check-valve'),.0032,.007,[-.016,0,cz],'phenolic');cyl(id('check-valve'),.001,.002,[-.010,0,cz],'rubber');
 annulus(id('lever-seal'),.014,.007,.003,[-.085,0,cz],'rubber');annulus(id('lever-washer'),.0145,.007,.0012,[-.089,0,cz],'zinc');
 plate(id('lever'),[[-.044,cz-.016],[-.031,cz-.023],[.010,cz-.014],[.043,cz-.037],[.050,cz-.033],[.046,cz-.019],[.012,cz+.011],[-.031,cz+.004]],[[0,cz,.006],[-.034,cz-.011,.003],[.041,cz-.024,.003]],.004,-.094,'zinc');
 hex(id('lever-nut'),.009,.006,[-.099,0,cz],'zinc',.0045);
 plate(id('cable-bracket'),[[-.062,cz-.039],[-.050,cz-.045],[-.031,cz-.030],[-.035,cz-.020],[-.052,cz-.020],[-.052,cz+.013],[-.063,cz+.013]],[[ -.054,cz+.002,.004]],.003,-.060,'zinc');
 box(id('cable-bracket'),[.038,.014,.003],[-.078,-.051,cz-.040],'zinc',[],{},.001);
 bolt(id('cable-bracket-bolt'),[-.071,-.055,cz+.002],.006,.019,1);
 spring(id('return-spring'),[-.094,-.046,cz-.031],.006,.039,[0,.65,-.76],9,.001,'dark');
 tube(id('return-spring'),[[-.094,-.030,cz-.045],[-.096,-.022,cz-.049],[-.096,-.018,cz-.044]],.001,'dark');
 tube(id('return-spring'),[[-.094,-.061,cz-.016],[-.094,-.066,cz-.011],[-.088,-.062,cz-.008]],.001,'dark');
}

function buildMaster(h){
 const {box,cyl,tube,ring,surface}=h,{annulus,plate,spring,lathe,hex}=brakeTools(h),id=k=>'br-master-'+k;
 // Local +X points forward along the master/booster axis. Open cast body,
 // stepped quick-take-up bore and independent reservoir feeds.
 lathe(id('body'),[[.064,.023],[.082,.025],[.095,.022],[.235,.018],[.249,.015],[.250,.006],[.244,.006],[.243,.0127],[.104,.0127],[.104,.019],[.066,.019],[.064,.023]],'castAluminum');
 plate(id('body'),[[-.022,-.041],[.019,-.041],[.027,-.024],[.025,.027],[.013,.042],[-.013,.042],[-.025,.023]],[[0,0,.019],[0,-.032,.0042],[0,.032,.0042]],.009,.068,'castAluminum');
 for(const x of [.122,.203]){const boss=annulus(id('body'),.019,.012,.031,[x,.024,0],'castAluminum');boss.rotateZ(Math.PI/2);annulus(id('grommets'),.0135,.009,.010,[x,.043,0],'rubber',[0,0,Math.PI/2]);
  cyl(id('body'),.011,.030,[x,-.001,-.024],'castAluminum',[Math.PI/2,0,0]);const port=annulus(id('body'),.010,.005,.003,[x,0,-.040],'rotor',[0,Math.PI/2,0]);
 }
 // Hollow reservoir: four tapered walls, dividing wall and a molded floor.
 const x0=.161,y0=.084,length=.135,width=.078;
 for(const side of [-1,1]){
  surface(id('reservoir'),16,12,(u,v)=>[x0+(u-.5)*(length-.016+.016*v),.052+v*.062,side*(.029+v*.010)],'reservoir');
  surface(id('reservoir'),16,12,(u,v)=>[x0+side*(.059+.009*v),.052+v*.062,(u-.5)*(.058+.020*v)],'reservoir');
 }
 box(id('reservoir'),[.118,.003,.058],[x0,.053,0],'reservoir',[],{},.008);box(id('reservoir'),[.003,.053,.062],[.170,.080,0],'reservoir',[],{},.001);
 tube(id('reservoir'),[[.093,.113,-.039],[.229,.113,-.039],[.229,.113,.039],[.093,.113,.039],[.093,.113,-.039]],.0025,'reservoir');
 for(const x of [.122,.203]){const neck=annulus(id('reservoir'),.010,.007,.018,[x,.048,0],'reservoir');neck.rotateZ(Math.PI/2);}
 for(const x of [.112,.135,.19,.213])box(id('reservoir'),[.004,.031,.002],[x,.078,-.036],'reservoir',[],{},.001);
 box(id('cover'),[.147,.007,.090],[x0,.123,0],'zinc',[],{},.007);for(const z of [-.042,.042])box(id('cover'),[.140,.009,.002],[x0,.119,z],'zinc',[],{},.001);for(const x of [.105,.216])box(id('cover'),[.005,.003,.07],[x,.128,0],'zinc',[],{},.001);
 for(const x of [.130,.196]){box(id('diaphragm'),[.062,.002,.078],[x,.115,0],'rubber',[],{},.004);surface(id('diaphragm'),24,12,(u,v)=>{const a=u*Math.PI*2;return[x+Math.cos(a)*(.025-.008*v),.114-v*.022,Math.sin(a)*(.033-.008*v)];},'rubber');box(id('diaphragm'),[.034,.002,.050],[x,.092,0],'rubber',[],{},.004);}
 lathe(id('primary'),[[.073,.010],[.078,.0184],[.090,.0184],[.094,.0121],[.113,.0121],[.115,.008],[.080,.008],[.080,.004],[.073,.004],[.073,.010]],'rotor');
 annulus(id('primary'),.0188,.014,.002,[.087,0,0],'rubber');spring(id('primary'),[.13,0,0],.008,.034,'x',7,.0009,'dark');
 lathe(id('secondary'),[[.147,.008],[.152,.0121],[.177,.0121],[.183,.007],[.188,.007],[.188,0],[.147,0],[.147,.008]],'rotor');
 for(const [key,x] of [['secondary-seal',.153],['primary-seal',.178]])lathe(id(key),[[x-.002,.010],[x+.002,.0128],[x+.002,.010],[x-.002,.008],[x-.002,.010]],'rubber');
 annulus(id('retainer'),.011,.004,.0015,[.186,0,0],'zinc');spring(id('spring'),[.213,0,0],.009,.049,'x',9,.001,'dark');
 const sr=mechanicalTools(h).arc(id('lock-ring'),.019,.0016,[.069,0,0],.17,Math.PI*2-.17,'dark',.0009);for(const s of [-1,1])annulus(id('lock-ring'),.002,.0008,.0016,[.069,s*.004,.019],'dark');
 cyl(id('take-up-valve'),.006,.013,[.121,.023,0],'gold',[0,0,0]);ring(id('take-up-valve'),.0065,.0008,[.121,.030,0],'rubber',[Math.PI/2,0,0]);spring(id('take-up-valve'),[.121,.034,0],.0035,.009,'y',4,.00045,'zinc');
 for(const z of [-.032,.032])hex(id('mounting-nuts'),.007,.006,[.077,0,z],'zinc',.004);
}

function buildBooster(h){
 const {box,cyl,tube,ring,surface}=h,{annulus,plate,spring,lathe,hex}=brakeTools(h),id=k=>'br-booster-'+k;
 // Two stamped shells enclose TWO diaphragms; a single generic drum would
 // miss the distinguishing tandem construction shown in GM04-255.
 lathe(id('rear-shell'),[[-.058,.020],[-.052,.046],[-.043,.080],[-.025,.100],[-.017,.103],[-.012,.103],[-.012,.099],[-.024,.098],[-.041,.079],[-.050,.045],[-.055,.020],[-.058,.020]],'blackPaint');
 lathe(id('front-shell'),[[-.012,.103],[.001,.103],[.021,.100],[.040,.087],[.054,.057],[.059,.019],[.056,.019],[.051,.055],[.037,.085],[.019,.098],[.001,.101],[-.012,.101],[-.012,.103]],'blackPaint');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;box(id('front-shell'),[.015,.009,.009],[-.005,Math.cos(a)*.101,Math.sin(a)*.101],'blackPaint',[a,0,0],{},.002);}
 for(const [key,x] of [['primary-diaphragm',-.029],['secondary-diaphragm',.018]]){
  lathe(id(key),[[x-.002,.017],[x+.003,.063],[x+.011,.079],[x+.012,.089],[x+.008,.096],[x+.001,.097],[x-.003,.092],[x+.005,.086],[x+.004,.080],[x-.003,.063],[x-.004,.017],[x-.002,.017]],'rubber');
 }
 for(const [key,x] of [['primary-plate',-.028],['secondary-plate',.017]]){
  const holes=[[0,0,.016]];for(let n=0;n<6;n++){const a=n*Math.PI/3;holes.push([Math.cos(a)*.041,Math.sin(a)*.041,.007]);}
  plate(id(key),Array.from({length:72},(_,i)=>[Math.cos(i*Math.PI/36)*.077,Math.sin(i*Math.PI/36)*.077]),holes,.0015,x,'zinc');
  for(let n=0;n<8;n++){const a=n*Math.PI/4;tube(id(key),[[x-.001,Math.cos(a)*.018,Math.sin(a)*.018],[x-.004,Math.cos(a)*.047,Math.sin(a)*.047],[x-.002,Math.cos(a)*.068,Math.sin(a)*.068]],.0016,'zinc');}
 }
 lathe(id('divider'),[[-.004,.017],[-.003,.066],[.003,.085],[.001,.096],[-.004,.099],[-.006,.099],[-.002,.094],[.001,.085],[-.005,.066],[-.006,.017],[-.004,.017]],'zinc');
 for(const [key,x,r,b,w,mat] of [
  ['front-seal',.055,.019,.010,.004,'rubber'],['primary-bearing',-.050,.022,.015,.012,'phenolic'],['secondary-bearing',-.003,.019,.013,.008,'phenolic'],
  ['reaction-retainer',.023,.014,.009,.002,'zinc'],['head-silencer',-.036,.016,.010,.006,'rubber'],['diaphragm-retainer',-.030,.019,.015,.003,'zinc'],
  ['reaction-disc',.028,.010,0,.004,'rubber'],['reaction-piston',.020,.009,.003,.014,'rotor'],['body-retainer',.009,.025,.012,.002,'zinc'],
  ['reaction-bumper',-.007,.011,.006,.004,'rubber'],['retaining-ring',-.057,.016,.014,.0015,'dark'],['filter',-.079,.015,.006,.012,'rubber'],
  ['input-silencer',-.085,.017,.008,.003,'rubber'],['valve-retainer',-.065,.013,.007,.002,'zinc'],['valve-o-ring',-.063,.009,.007,.0015,'rubber'],
 ]){if(b)annulus(id(key),r,b,w,[x,0,0],mat);else cyl(id(key),r,w,[x,0,0],mat);}
 lathe(id('reaction-body'),[[-.014,.014],[.007,.014],[.008,.023],[.012,.023],[.012,.010],[-.014,.008],[-.014,.014]],'phenolic');
 for(let n=0;n<10;n++){const a=n*Math.PI/5;box(id('reaction-body'),[.019,.003,.003],[-.003,Math.cos(a)*.015,Math.sin(a)*.015],'phenolic',[a,0,0],{},.001);}
 lathe(id('power-piston'),[[-.071,.014],[-.026,.016],[-.014,.024],[.005,.024],[.010,.019],[.010,.012],[-.029,.009],[-.071,.009],[-.071,.014]],'phenolic');
 spring(id('return-spring'),[.031,0,0],.028,.047,'x',5,.0021,'dark');spring(id('air-spring'),[-.023,0,0],.007,.019,'x',7,.0008,'zinc');
 cyl(id('output-rod'),.004,.054,[.055,0,0],'rotor');cyl(id('output-rod'),.006,.012,[.031,0,0],'rotor');
 cyl(id('input-rod'),.004,.126,[-.107,0,0],'rotor');cyl(id('input-rod'),.007,.020,[-.054,0,0],'rotor');
 const eye=annulus(id('input-rod'),.009,.004,.006,[-.171,0,0],'zinc');eye.rotateY(Math.PI/2);
 const bootProfile=[];for(let i=0;i<=24;i++){const x=-.089+i*.0015,r=.0135+(i%4<2?.003:0);bootProfile.push([x,r]);}bootProfile.push([-.053,.013],[-.089,.013],bootProfile[0]);lathe(id('boot'),bootProfile,'rubber');
 // Offset front vacuum inlet with an angled plastic check valve.
 const check=[.035,.050,-.047];cyl(id('check-valve'),.012,.023,check,'plastic');tube(id('check-valve'),[[.035,.050,-.047],[.046,.063,-.047],[.046,.080,-.047]],.005,'plastic');annulus(id('check-grommet'),.014,.010,.004,[.022,.050,-.047],'rubber');
 for(const y of [-.045,.045])for(const z of [-.038,.038]){cyl(id('mounting'),.004,.031,[-.061,y,z],'zinc');hex(id('mounting'),.007,.006,[-.069,y,z],'zinc',.004);}
 for(const z of [-.032,.032])cyl(id('mounting'),.004,.035,[.069,0,z],'zinc');
}

const lineRoutes={
 'front-left-pipe':[[.363,.54,-.86],[.41,.49,-.88],[.48,.41,-1.05],[.50,.43,-1.17]],
 'front-right-pipe':[[.337,.54,-.86],[.33,.40,-1.04],[.05,.36,-1.09],[-.32,.36,-1.09],[-.49,.40,-1.10],[-.50,.43,-1.17]],
 'rear-feed':[[.345,.515,-.82],[.27,.37,-.88],[-.28,.31,-.88],[-.45,.255,-.58],[-.45,.255,.51],[-.52,.40,.78],[-.53,.49,.86]],
 'rear-left-pipe':[[-.53,.49,.86],[-.53,.55,.70],[.15,.55,.70],[.52,.54,.78],[.56,.46,.97]],
 'rear-right-pipe':[[-.53,.49,.86],[-.56,.48,.91],[-.56,.46,.97]],
 'hose-fl':[[.50,.43,-1.17],[.56,.48,-1.18],[.63,.445,-1.14],[.63,.335,-1.09],[.609,.295,-1.0885]],
 'hose-fr':[[-.50,.43,-1.17],[-.56,.48,-1.18],[-.63,.445,-1.14],[-.63,.335,-1.09],[-.609,.295,-1.0885]],
 'hose-rl':[[.56,.46,.97],[.595,.50,1.02],[.64,.44,1.155],[.64,.34,1.16],[.611,.295,1.0885]],
 'hose-rr':[[-.56,.46,.97],[-.595,.50,1.02],[-.64,.44,1.155],[-.64,.34,1.16],[-.611,.295,1.0885]],
 'vacuum-pipe':[[.383,.43,-.68],[.22,.26,-.47],[.22,.26,.60],[.18,.44,.78]],
};
export const brakeRoutes=Object.fromEntries(Object.entries(lineRoutes).map(([key,points])=>[key,points.map(([x,y,z])=>[-x,y,z])]));
function buildLines(h){
 const {add,box,cyl,tube,ring,bolt:verticalBolt}=h,{annulus,plate,spring,hex,bolt,lathe}=brakeTools(h),id=k=>'br-'+k;
 // Combination valve retains distinct master, front and rear circuit ports.
 box(id('valve'),[.074,.039,.040],[.35,.535,-.832],'gold',[],{},.008);
 for(const x of [.320,.380]){cyl(id('valve'),.017,.014,[x,.535,-.832],'gold');hex(id('valve'),.015,.008,[x+(x>.35?.008:-.008),.535,-.832],'gold');}
 cyl(id('valve'),.006,.027,[.35,.564,-.827],'plastic',[0,0,0]);box(id('valve'),[.016,.011,.013],[.35,.581,-.827],'plastic',[],{},.003);
 for(const [x,y,z] of [[.363,.54,-.86],[.337,.54,-.86],[.345,.515,-.82]]){const m=annulus(id('valve'),.007,.0025,.010,[x,y,z],'gold',[0,Math.PI/2,0]);}
 box(id('valve-bracket'),[.10,.003,.08],[.377,.562,-.82],'zinc',[],{},.003);box(id('valve-bracket'),[.004,.05,.08],[.423,.587,-.82],'zinc',[],{},.003);
 for(const x of [.34,.398])verticalBolt(id('valve-bracket'),[x,.569,-.820],.004);
 for(const [i,x] of [[0,.122],[1,.203]])tube(id('master-pipes'),[[.39,.60,-.65-x],[.37,.60,-.65-x],[.31+i*.08,.56,-.89],[.326+i*.047,.546,-.834]],.00238125,'zinc');
 box(id('rear-junction'),[.024,.024,.022],[-.53,.49,.86],'gold',[],{},.004);verticalBolt(id('rear-junction'),[-.53,.507,.86],.004);
 for(const [key,points] of Object.entries(lineRoutes)){
  const flexible=key.startsWith('hose-'),r=key==='vacuum-pipe'?.00476:flexible?.0053:.00238125;
  tube(id(key),points,r,flexible?'rubber':'zinc');
  if(key==='vacuum-pipe')continue;
  for(const end of [0,points.length-1]){
   const p=points[end],q=points[end===0?1:end-1],dir=new T.Vector3(...p).sub(new T.Vector3(...q)).normalize();
   const mesh=hex(id(key),flexible?.007:.0055,flexible?.022:.009,p,'zinc',r*.55);mesh.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),dir);
   if(flexible){const collar=annulus(id(key),.0072,.0052,.016,p,'zinc');collar.quaternion.copy(mesh.quaternion);}
  }
 }
 for(const c of brakeCorners){
  const x=c.sign*(c.front?.609:.611),z=c.z+(c.front?.098:-.098),p=[x,.295,z];
  const hose='br-hose-'+c.id;annulus(hose,.009,.005,.006,p,'zinc');
  for(const dx of [-.004,.004])annulus(id('banjos'),.009,.005,.001,[x+c.sign*dx,.295,z],'copper');
  bolt(id('banjos'),[x-c.sign*.009,.295,z],.008,.020,c.sign);
  const mount=lineRoutes['hose-'+c.id][0];
  box(id('hose-brackets'),[.036,.030,.002],mount,'zinc',[],{},.003);box(id('hose-brackets'),[.036,.003,.017],[mount[0],mount[1]-.014,mount[2]+.008],'zinc',[],{},.003);
  tube(id('hose-brackets'),[[mount[0]-.011,mount[1]+.014,mount[2]-.003],[mount[0]-.011,mount[1]-.009,mount[2]-.003],[mount[0]+.011,mount[1]-.009,mount[2]-.003],[mount[0]+.011,mount[1]+.014,mount[2]-.003]],.0012,'dark');
  verticalBolt(id('hose-brackets'),[mount[0],mount[1]-.010,mount[2]+.009],.003);
 }
 for(const z of [-.47,-.06,.35]){box(id('pipe-clips'),[.034,.004,.012],[-.45,.251,z],'zinc',[],{},.001);verticalBolt(id('pipe-clips'),[-.43,.253,z],.003);}
 for(const x of [-.35,0,.38]){box(id('pipe-clips'),[.013,.004,.025],[x,.548,.70],'zinc',[],{},.001);verticalBolt(id('pipe-clips'),[x,.551,.713],.003);}
 tube(id('vacuum-hoses'),[[.383,.680,-.696],[.383,.64,-.72],[.383,.52,-.70],[.383,.43,-.68]],.006,'rubber');
 tube(id('vacuum-hoses'),[[.18,.44,.78],[.18,.49,.80],[.18,.52,.845]],.006,'rubber');tube(id('vacuum-hoses'),[[.18,.52,.94],[.18,.65,.98],[.10,.71,1.035]],.006,'rubber');
 const filter=lathe(id('vacuum-filter'),[[-.045,.005],[-.030,.005],[-.027,.017],[.026,.017],[.030,.005],[.047,.005],[.047,.003],[-.045,.003],[-.045,.005]],'plastic');filter.rotation.y=-Math.PI/2;filter.position.set(.18,.52,.892);ring(id('vacuum-filter'),.018,.0015,[.18,.52,.892],'plastic',[0,0,0]);
 for(const z of [.846,.938])annulus(id('vacuum-hoses'),.0068,.0061,.006,[.18,.52,z],'zinc',[0,Math.PI/2,0]);
}

const parkingRoutes={
 'front-cable':[[.605,.286,.18],[.612,.28,.38],[.655,.44,.61],[.673,.54,.86],[.646,.38,1.22],[.57,.225,1.47],[.34,.225,1.49]],
 'left-cable':[[.32,.225,1.49],[.51,.22,1.49],[.583,.22,1.39],[.613,.255,1.23],[.608,.263,1.046]],
 'right-cable':[[.30,.225,1.49],[-.25,.225,1.49],[-.48,.225,1.47],[-.582,.22,1.37],[-.608,.263,1.046]],
};
export const parkingCableRoutes=Object.fromEntries(Object.entries(parkingRoutes).map(([key,points])=>[key,points.map(([x,y,z])=>[-x,y,z])]));
function buildParking(h){
 const {box,cyl,tube,profile,ring,surface}=h,{annulus,plate,hex,bolt,thread}=brakeTools(h),id=k=>'br-park-'+k;
 for(const [key,points] of Object.entries(parkingRoutes)){
  tube(id(key),points,.0038,'rubber');
  for(const [i,p] of points.entries())if(i===0||i===points.length-1){cyl(id(key),.006,.020,p,'zinc');tube(id(key),[p,[p[0]-.015,p[1],p[2]]],.0017,'zinc');}
 }
 for(const x of [.592,.618])profile(id('lever'),[[.225,.269],[.235,.319],[.184,.347],[.130,.337],[.120,.29],[.08,.27]],.004,x,'zinc');
 cyl(id('lever'),.016,.037,[.604,.317,.174],'zinc');
 profile(id('lever'),[[.19,.311],[.193,.335],[-.10,.36],[-.12,.347],[-.10,.335]],.016,.605,'dark');
 box(id('lever'),[.028,.030,.097],[.605,.35,-.078],'vinyl',[-.055,0,0],{},.010);cyl(id('lever'),.007,.008,[.605,.35,-.13],'zinc',[Math.PI/2,0,0]);
 surface(id('boot'),50,16,(u,v)=>{const a=u*Math.PI*2,r=1-v*.5;return[.605+Math.cos(a)*.035*r,.267+v*.075,.16+Math.sin(a)*.093*r];},'vinyl');
 box(id('switch'),[.020,.017,.030],[.628,.294,.208],'plastic',[],{},.004);cyl(id('switch'),.003,.008,[.624,.307,.207],'zinc',[0,0,0]);
 for(const z of [.102,.220]){const m=hex(id('bolts'),.007,.005,[.605,.279,z],'zinc');m.rotateZ(Math.PI/2);cyl(id('bolts'),.004,.025,[.605,.264,z],'zinc',[0,0,0]);}
 // Slotted equalizer and threaded draw stud, with distinct cable ends.
 const eq=plate(id('equalizer'),[[-.012,-.026],[.012,-.026],[.015,.023],[-.015,.023]],[[0,-.012,.004],[0,.014,.004]],.003,.32,'zinc');eq.position.y=.225;eq.position.z=1.49;
 cyl(id('equalizer'),.003,.087,[.335,.225,1.49],'zinc');hex(id('equalizer'),.006,.006,[.335,.225,1.49],'zinc',.003);thread(id('equalizer'),[.34,.225,1.49],.0031,.024,13);
 for(const p of [[.662,.49,.72],[.661,.49,1.02],[.45,.225,1.49],[-.20,.225,1.49]]){box(id('clips'),[.022,.003,.019],p,'zinc',[],{},.001);tube(id('clips'),[[p[0]-.005,p[1],p[2]-.005],[p[0]-.007,p[1]-.008,p[2]],[p[0]+.007,p[1]-.008,p[2]],[p[0]+.005,p[1],p[2]+.005]],.001,'zinc');}
 const grommet=annulus(id('grommet'),.013,.004,.017,[.614,.278,.38],'rubber');grommet.rotateY(Math.PI/2);
}

function buildPedal(h){
 const {box,cyl,tube,ring}=h,{annulus,plate,hex}=brakeTools(h),id=k=>'br-pedal-'+k;
 const arm=plate(id('arm'),[[.641,-.505],[.637,-.477],[.558,-.465],[.309,-.445],[.265,-.446],[.257,-.472],[.305,-.478],[.552,-.491],[.612,-.511]],[[.622,-.49,.008]],.007,.34,'dark');
 const positions=arm.geometry.attributes.position;for(let i=0;i<positions.count;i++)positions.setX(i,positions.getX(i)+.09*T.MathUtils.clamp((positions.getY(i)-.53)/.05,0,1));positions.needsUpdate=true;arm.geometry.computeVertexNormals();
 box(id('arm'),[.056,.046,.003],[.34,.282,-.463],'dark',[-.4,0,0],{},.005);
 box(id('pad'),[.061,.054,.010],[.34,.282,-.455],'rubber',[-.4,0,0],{},.008);for(let i=0;i<5;i++)box(id('pad'),[.052,.002,.002],[.34,.262+i*.010,-.445],'rubber',[-.4,0,0],{},.0005);
 cyl(id('pivot'),.007,.10,[.43,.622,-.49],'zinc');for(const x of [.416,.444])annulus(id('pivot'),.010,.007,.010,[x,.622,-.49],'pickupPlastic');hex(id('pivot'),.011,.006,[.488,.622,-.49],'zinc',.006);
 cyl(id('arm'),.004,.022,[.43,.60,-.479],'zinc');ring(id('pushrod-retainer'),.006,.0008,[.443,.60,-.479],'zinc');tube(id('pushrod-retainer'),[[.443,.596,-.482],[.443,.590,-.488],[.443,.601,-.485]],.0008,'zinc');
 cyl(id('switch'),.007,.035,[.422,.574,-.503],'pickupPlastic',[Math.PI/2,0,0]);cyl(id('switch'),.0025,.012,[.422,.574,-.480],'zinc',[Math.PI/2,0,0]);box(id('switch'),[.021,.019,.018],[.422,.574,-.526],'plastic',[],{},.003);for(const x of [.418,.426])box(id('switch'),[.002,.005,.009],[x,.574,-.538],'zinc',[],{},.0003);
}
