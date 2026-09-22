import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {engineParts,engineSectionById} from './engine-catalog.js';

// Dedicated inspection model. H-19 / H-22 establish component relationships;
// local casting profiles and disassembly offsets are reconstructed, not CAD.
export function createEngineDetail(){
 const root=new T.Group(),groups=new Map(),materials=createMaterials();
 for(const p of engineParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'engine',section:p.section,spread:new T.Vector3(...p.spread)};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,materials),{box,cyl,tube,ring,bolt,surface,label,add}=h;
 const id=s=>`eng-${s}`,xAt=c=>(c-2)*.105;
 const crankY=1.05;
 const bankPoint=(x,y,z,s)=>[x,crankY+y*Math.cos(Math.PI/6)-z*s*.5,y*s*.5+z*Math.cos(Math.PI/6)];
 const sleeve=(key,r,length,pos,rot,mat='iron')=>{
  const geo=new T.CylinderGeometry(r,r,length,40,1,true);const mesh=add(id(key),geo,mat,pos,rot);mesh.material.side=T.DoubleSide;
 };
 const plate=(key,w,d,thickness,holes,pos,rot,mat='iron')=>{
  const shape=new T.Shape();shape.moveTo(-w/2,-d/2);shape.lineTo(w/2,-d/2);shape.lineTo(w/2,d/2);shape.lineTo(-w/2,d/2);shape.closePath();
  for(const [x,z,r] of holes){const hole=new T.Path();hole.absarc(x,z,r,0,Math.PI*2,true);shape.holes.push(hole);}
  const geo=new T.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false,curveSegments:28});geo.rotateX(-Math.PI/2);geo.translate(0,-thickness/2,0);add(id(key),geo,mat,pos,rot);
 };
 const halfShell=(key,outer,inner,width,pos,lower=false,mat='rotor')=>{
  const shape=new T.Shape();shape.absarc(0,0,outer,0,Math.PI,false);shape.lineTo(-inner,0);shape.absarc(0,0,inner,Math.PI,0,true);shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,curveSegments:24});geo.translate(0,0,-width/2);geo.rotateY(Math.PI/2);if(lower)geo.rotateX(Math.PI);add(id(key),geo,mat,pos);
 };
 // Open crankcase and two machined decks with real bore openings.
 box(id('block'),[.40,.14,.022],[0,1.04,-.123],'iron');box(id('block'),[.40,.14,.022],[0,1.04,.123],'iron');
 for(const x of [-.191,.191])box(id('block'),[.023,.18,.24],[x,1.09,0],'iron');
 for(const s of [-1,1]){
  const rot=[s*Math.PI/6,0,0];
  plate('block',.40,.118,.022,[1,2,3].map(c=>[xAt(c),0,.0445]),bankPoint(0,.27,0,s),rot);
  for(let c=1;c<=3;c++){
   sleeve('block',.0445,.172,bankPoint(xAt(c),.184,0,s),rot,'rotor');
   sleeve('block',.0505,.174,bankPoint(xAt(c),.184,0,s),rot,'iron');
   cyl(id('block'),.023,.008,[xAt(c),1.14,s*.132],'gold',[Math.PI/2,0,0]);
  }
 }
 for(let i=1;i<=4;i++){
  const x=-.165+(i-1)*.110;
  box(id('block'),[.023,.035,.24],[x,.986,0],'iron');
  halfShell(`main-cap-${i}`,.043,.029,.030,[x,crankY,0],true,'iron');
  for(const lower of [false,true])halfShell(`main-bearing-${i}`,.029,.0273,.026,[x,crankY+(lower?-.001:.001),0],lower);
  box(id(`main-cap-${i}`),[.032,.034,.112],[x,1.005,0],'iron');
  for(const z of [-.047,.047])bolt(id(`main-cap-${i}`),[x,.981,z],.006);
 }
 // Main journals and three shared crankpins; no running kinematics implied.
 cyl(id('crankshaft'),.027,.43,[0,crankY,0],'rotor');
 for(let c=1;c<=3;c++){
  const angle=(c-1)*Math.PI*2/3,cy=crankY+Math.cos(angle)*.038,cz=Math.sin(angle)*.038;
  cyl(id('crankshaft'),.023,.069,[xAt(c),cy,cz],'rotor');
  for(const dx of [-.039,.039]){
   box(id('crankshaft'),[.014,.09,.060],[xAt(c)+dx,crankY-.015,0],'iron',[angle,0,0],{},.018);
   cyl(id('crankshaft'),.038,.014,[xAt(c)+dx,crankY,0],'iron');
  }
 }
 for(const [bank,s] of [['front',-1],['rear',1]]){
  const rot=[s*Math.PI/6,0,0],at=(x,y,z=0)=>bankPoint(x,y,z,s);
  plate(`${bank}-head-gasket`,.412,.13,.002,[1,2,3].map(c=>[xAt(c),0,.0455]),at(0,.286),rot,'dark');
  plate(`${bank}-head`,.418,.143,.051,[1,2,3].flatMap(c=>[[-.023,.021],[.022,-.020]].map(([dx,z])=>[xAt(c)+dx,z,.018])),at(0,.317),rot,'iron');
  // Raised rocker-gallery walls meet the valve-cover seal, leaving an open
  // cavity around the valve gear rather than a floating cover.
  for(const z of [-.065,.065])box(id(`${bank}-head`),[.418,.061,.016],at(0,.373,z),'iron',rot);
  for(const x of [-.201,.201])box(id(`${bank}-head`),[.016,.061,.134],at(x,.373),'iron',rot);
  for(let c=1;c<=3;c++){
   // Exhaust-side port flanges and dark port mouths.
   box(id(`${bank}-head`),[.062,.050,.013],at(xAt(c),.315,s*.082),'iron',rot);
   cyl(id(`${bank}-head`),.015,.007,at(xAt(c),.315,s*.091),'dark',[Math.PI/2,0,0]);
   const port=at(xAt(c),.315,s*.099),join=[xAt(c),port[1]-.040,port[2]+s*.058];
   tube(id(`${bank}-exhaust`),[port,join,[.15,join[1],join[2]]],.017,'iron');
   ring(id(`${bank}-exhaust-gasket`),.019,.003,port,'dark',[0,0,0]);
  }
  const exhaustPort=at(0,.315,s*.099),collectorY=exhaustPort[1]-.040,collectorZ=exhaustPort[2]+s*.058;
  tube(id(`${bank}-exhaust`),[[.15,collectorY,collectorZ],[.19,collectorY-.015,collectorZ],[.19,collectorY-.065,collectorZ-s*.04]],.021,'iron');
  // Open perimeter seal beneath the valve cover.
  tube(id(`${bank}-cover-gasket`),[[-.211,.403,-.070],[.211,.403,-.070],[.211,.403,.070],[-.211,.403,.070],[-.211,.403,-.070]].map(([x,y,z])=>at(x,y,z)),.003,'rubber');
  // Hollow cover shell, flange and longitudinal machined ribs.
  box(id(`${bank}-cover`),[.434,.014,.148],at(0,.456),'red',rot,{},.02);
  for(const z of [-.068,.068])box(id(`${bank}-cover`),[.434,.047,.013],at(0,.433,z),'red',rot);
  for(const x of [-.210,.210])box(id(`${bank}-cover`),[.014,.047,.137],at(x,.433),'red',rot);
  for(const z of [-.045,-.015,.015,.045])box(id(`${bank}-cover`),[.367,.006,.009],at(0,.468,z),'alloy',rot);
  for(const x of [-.175,.175])for(const z of [-.062,.062])bolt(id(`${bank}-head-bolts`),at(x,.379,z),.006);
  if(s>0)cyl(id(`${bank}-cover`),.022,.016,at(.135,.477),'blackPaint',rot);
  for(let c=1;c<=3;c++){
   const tag=`${bank}-${c}`,x=xAt(c)+(s>0?.013:-.013),piston=at(x,.213);
   cyl(id(`piston-${tag}`),.0435,.048,piston,'alloy',rot);
   for(const dy of [-.004,.007,.018])ring(id(`piston-${tag}`),.0432,.0013,at(x,.213+dy),'dark',[Math.PI/2+s*Math.PI/6,0,0]);
   for(const dy of [-.004,.007,.018])ring(id(`rings-${tag}`),.044,.0013,at(x,.213+dy),'rotor',[Math.PI/2+s*Math.PI/6,0,0]);
   sleeve(`pin-${tag}`,.009,.073,piston,[0,0,Math.PI/2],'rotor');
   const small=at(x,.205),big=[x,crankY+.025,s*.014];
   tube(id(`rod-${tag}`),[big,small],.009,'metal');
   ring(id(`rod-${tag}`),.015,.006,small,'metal',[0,Math.PI/2,0]);
   halfShell(`rod-${tag}`,.031,.024,.023,big,false,'metal');
   halfShell(`rod-cap-${tag}`,.031,.024,.023,big,true,'metal');
   for(const lower of [false,true])halfShell(`rod-bearing-${tag}`,.024,.022,.020,[x,big[1]+(lower?-.0008:.0008),big[2]],lower);
   for(const z of [-.030,.030])bolt(id(`rod-cap-${tag}`),[x,big[1]-.031,big[2]+z],.004);
   for(const [type,dx] of [['intake',-.025],['exhaust',.025]]){
    const v=`${tag}-${type}`,vx=xAt(c)+dx,vz=s*.017;
    cyl(id(`valve-${v}`),type==='intake'?.018:.015,.004,at(vx,.298,vz),'rotor',rot);
    cyl(id(`valve-${v}`),.0034,.091,at(vx,.342,vz),'rotor',rot);
    const coil=[];for(let k=0;k<=100;k++){const a=k/100*Math.PI*12;coil.push(at(vx+Math.cos(a)*.011,.347+k/100*.042,vz+Math.sin(a)*.011));}
    tube(id(`spring-${v}`),coil,.002,'dark');cyl(id(`spring-${v}`),.013,.004,at(vx,.390,vz),'rotor',rot);
    box(id(`rocker-${v}`),[.019,.014,.060],at(vx,.408,-s*.007),'metal',rot,{},.009);bolt(id(`rocker-${v}`),at(vx,.420,-s*.007),.005);
    tube(id(`pushrod-${v}`),[at(vx,.135,-s*.038),at(vx,.406,-s*.037)],.0035,'rotor');
    cyl(id(`lifter-${v}`),.010,.035,at(vx,.131,-s*.038),'rotor',rot);
   }
   const plug=at(xAt(c),.325,s*.109);
   cyl(id(`spark-${tag}`),.007,.028,plug,'rotor',[Math.PI/2,0,0]);
   cyl(id(`spark-${tag}`),.006,.024,[plug[0],plug[1],plug[2]+s*.020],'white',[Math.PI/2,0,0]);
  }
 }
 // Three intake levels, separate fuel rail and six injector bodies.
 box(id('lower-intake'),[.354,.057,.127],[0,1.338,0],'metal',[],{},.012);
 for(const s of [-1,1])for(let c=1;c<=3;c++){
  const x=xAt(c),n=(s<0?0:3)+c;
  ring(id('intake-gaskets'),.020,.003,[x,1.333,s*.087],'dark',[Math.PI/2,0,0]);
  tube(id('middle-intake'),[[x,1.33,s*.085],[x,1.395,s*.09],[x,1.415,s*.037]],.024,'metal');
  tube(id('plenum'),[[x,1.413,s*.062],[x,1.477,s*.04],[x,1.486,0]],.027,'red');
  cyl(id(`injector-${n}`),.008,.048,[x,1.369,s*.072],'metal',[s*.25,0,0]);
  box(id(`injector-${n}`),[.014,.016,.020],[x,1.393,s*.072],'plastic');
  for(const y of [1.347,1.390])ring(id(`injector-${n}`),.008,.0018,[x,y,s*.072],'rubber',[Math.PI/2,0,0]);
 }
 box(id('plenum'),[.316,.054,.143],[0,1.5,0],'red',[],{},.025);
 label(id('plenum'),'FIERO',[.207,.060],[0,1.529,0],[-Math.PI/2,0,0],{background:'#a80912',foreground:'#d4d6d6',font:'italic bold 74px Arial'});
 for(const z of [-.054,.054])box(id('plenum'),[.255,.004,.005],[0,1.531,z],'alloy');
 sleeve('throttle',.026,.072,[.192,1.49,0],[0,0,Math.PI/2],'metal');
 cyl(id('throttle'),.024,.003,[.19,1.49,0],'gold',[0,0,Math.PI/2]);
 for(const z of [-.072,.072])tube(id('fuel-rail'),[[-.14,1.403,z],[.14,1.403,z]],.008,'metal');
 tube(id('fuel-rail'),[[.14,1.403,-.072],[.165,1.403,0],[.14,1.403,.072]],.008,'metal');cyl(id('fuel-rail'),.021,.026,[.167,1.406,0],'metal',[0,0,0]);
 // Cam-in-block, timing sprockets and actual repeated chain links.
 cyl(id('camshaft'),.014,.43,[0,1.181,0],'rotor');
 for(let i=0;i<12;i++){
  const shape=new T.Shape(),phase=i*Math.PI*.58;
  for(let j=0;j<=48;j++){const a=j/48*Math.PI*2,r=.018+.012*Math.max(0,Math.cos(a-phase))**4;const x=Math.cos(a)*r,y=Math.sin(a)*r;j?shape.lineTo(x,y):shape.moveTo(x,y);}
  shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:.011,bevelEnabled:true,bevelSize:.0007,bevelThickness:.0007,bevelSegments:2});geo.rotateY(Math.PI/2);add(id('camshaft'),geo,'rotor',[-.164+i*.029,1.181,0]);
 }
 for(const x of [-.177,-.060,.060,.177])sleeve('cam-bearings',.0165,.018,[x,1.181,0],[0,0,Math.PI/2],'gold');
 function gear(key,x,y,r){cyl(id(key),r,.015,[x,y,0],'metal');for(let i=0;i<32;i++){const a=i/32*Math.PI*2;box(id(key),[.016,.007,.008],[x,y+Math.cos(a)*r,Math.sin(a)*r],'rotor',[a,0,0]);}bolt(id(key),[x-.013,y,0],.008,'x');}
 gear('cam-gear',-.228,1.181,.056);gear('crank-gear',-.228,1.05,.028);
 const chain=new T.CatmullRomCurve3([[-.228,1.05,-.033],[-.228,1.181,-.061],[-.228,1.242,0],[-.228,1.181,.061],[-.228,1.05,.033],[-.228,1.017,0]].map(p=>new T.Vector3(...p)),true);
 for(let i=0;i<64;i++){const p=chain.getPointAt(i/64);ring(id('chain'),.0037,.0017,p.toArray(),'dark',[0,Math.PI/2,0]);}
 const cover=new T.Shape();cover.moveTo(-.069,-.098);cover.quadraticCurveTo(-.107,-.087,-.103,-.040);cover.lineTo(-.080,.095);cover.quadraticCurveTo(-.069,.149,0,.154);cover.quadraticCurveTo(.069,.149,.080,.095);cover.lineTo(.103,-.040);cover.quadraticCurveTo(.107,-.087,.069,-.098);cover.closePath();
 const seal=new T.Path();seal.absarc(0,-.047,.027,0,Math.PI*2,true);cover.holes.push(seal);
 const coverGeo=new T.ExtrudeGeometry(cover,{depth:.019,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:3,curveSegments:28});coverGeo.rotateY(Math.PI/2);add(id('timing-cover'),coverGeo,'metal',[-.270,1.097,0]);
 for(const [y,z] of [[1.023,-.077],[1.023,.077],[1.16,-.077],[1.16,.077],[1.225,-.047],[1.225,.047]])bolt(id('timing-cover'),[-.278,y,z],.0045,'x');
 ring(id('timing-cover'),.033,.007,[-.277,1.05,0],'metal',[0,Math.PI/2,0]);
 cyl(id('balancer'),.074,.037,[-.291,1.05,0],'dark');for(const x of [-.31,-.30,-.29])ring(id('balancer'),.072,.003,[x,1.05,0],'rubber',[0,Math.PI/2,0]);
 // Open oil pan, flange gasket, pump and pickup.
 // Open perimeter flange around the sump.
 for(const z of [-.124,.124])box(id('pan'),[.417,.012,.018],[0,.936,z],'metal');
 for(const x of [-.199,.199])box(id('pan'),[.018,.012,.242],[x,.936,0],'metal');
 for(const z of [-.110,.110])box(id('pan'),[.392,.108,.012],[0,.880,z],'metal');
 for(const x of [-.19,.19])box(id('pan'),[.012,.108,.217],[x,.880,0],'metal');
 box(id('pan'),[.391,.012,.225],[0,.826,0],'metal');bolt(id('pan'),[.13,.833,.122],.008,'z');
 tube(id('pan-gasket'),[[-.200,.947,-.121],[.200,.947,-.121],[.200,.947,.121],[-.200,.947,.121],[-.200,.947,-.121]],.003,'rubber');
 box(id('oil-pump'),[.060,.046,.054],[.105,.948,0],'iron');
 tube(id('pickup'),[[.105,.940,0],[.09,.877,0],[-.07,.861,0]],.008,'metal');cyl(id('pickup'),.036,.013,[-.073,.852,0],'dark',[0,0,0]);
 cyl(id('oil-filter'),.033,.084,[.134,1.013,-.177],'blackPaint',[0,0,.22]);
 cyl(id('distributor'),.015,.14,[.166,1.349,0],'metal',[0,0,0]);cyl(id('distributor'),.032,.027,[.166,1.416,0],'metal',[0,0,0]);
 box(id('rotor'),[.049,.009,.017],[.166,1.439,0],'plastic');box(id('rotor'),[.018,.003,.013],[.19,1.446,0],'gold');
 cyl(id('cap'),.037,.043,[.166,1.467,0],'plastic',[0,0,0]);for(let i=0;i<6;i++){const a=i*Math.PI/3;cyl(id('cap'),.007,.023,[.166+Math.cos(a)*.029,1.491,Math.sin(a)*.029],'plastic',[0,0,0]);}
 cyl(id('cap'),.007,.023,[.166,1.493,0],'plastic',[0,0,0]);
 // Engine-mounted accessories, with separate pulley and belt.
 cyl(id('water-pump'),.047,.045,[-.285,1.218,.076],'metal');tube(id('water-pump'),[[-.268,1.22,.076],[-.261,1.25,.139]],.016,'metal');
 cyl(id('water-pulley'),.060,.021,[-.322,1.218,.076],'dark');
 cyl(id('alternator'),.052,.099,[-.261,1.269,-.153],'metal');for(let i=0;i<12;i++){const a=i*Math.PI/6;box(id('alternator'),[.066,.012,.006],[-.26,1.269+Math.cos(a)*.052,-.153+Math.sin(a)*.052],'dark',[a,0,0]);}cyl(id('alternator'),.026,.019,[-.323,1.269,-.153],'dark');
 tube(id('belt'),[[-.339,1.03,-.076],[-.339,1.00,0],[-.339,1.19,.129],[-.339,1.28,.078],[-.339,1.298,-.153],[-.339,1.269,-.183],[-.339,1.03,-.076]],.004,'rubber');
 cyl(id('flywheel'),.132,.017,[.231,1.05,0],'rotor');for(let i=0;i<100;i++){const a=i/100*Math.PI*2;box(id('flywheel'),[.018,.006,.007],[.231,1.05+Math.cos(a)*.133,Math.sin(a)*.133],'metal',[a,0,0]);}
 for(let i=0;i<6;i++){const a=i*Math.PI/3;bolt(id('flywheel'),[.244,1.05+Math.cos(a)*.034,Math.sin(a)*.034],.005,'x');}
 ring(id('rear-seal'),.035,.005,[.207,1.05,0],'rubber',[0,Math.PI/2,0]);
 h.optimize();
 for(const p of engineParts){const g=groups.get(p.id);g.userData.assemblySpread=new T.Vector3(...engineSectionById.get(p.section).spread);}
 return {root,groups};
}
