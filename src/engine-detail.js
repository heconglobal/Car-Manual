import {bankOffset,headStackCorrection,upperEngineDrop} from './engine-layout.js';
import {buildFlywheel} from './transmission-detail.js';
import {engineOffset} from './powertrain-layout.js';
import {buildEngineDrive} from './engine-drive.js';
import {l44Nominal,v6BlockNominal} from './factory-specifications.js';
import {buildAlternator,chargingMaterials,chargingDatums} from './charging-detail.js';
import {chargingParts} from './charging-catalog.js';
import {buildExhaustManifold} from './exhaust-detail.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {buildValveHardware} from './engine-valvetrain.js';
import {buildEngineService} from './engine-service.js';
import {buildEngineControls} from './engine-controls.js';
import {buildValveCover,buildCylinderHead,buildOilPan,refineBlockCasting} from './engine-castings.js';
import * as T from 'three';
import {buildIgnition} from './ignition.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {engineParts,engineSectionById} from './engine-catalog.js';

// Dedicated inspection model. H-19 / H-22 establish component relationships;
// local casting profiles and disassembly offsets are reconstructed, not CAD.
export function createEngineDetail({legacyFrame=false}={}){
 const root=new T.Group(),groups=new Map(),materials=createMaterials();
 // Engine castings have fine foundry grain, and their enamel is less glossy
 // than the body paint. Keep the accepted vehicle paint materials unchanged.
 materials.iron.bumpScale=.00010;materials.metal.bumpScale=.00012;materials.rotor.bumpScale=.00003;
 materials.castAluminum.roughness=.55;
 materials.red.roughness=.42;materials.red.clearcoat=.22;materials.red.clearcoatRoughness=.36;
 for(const p of engineParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'engine',section:p.section,spread:new T.Vector3(...p.spread)};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,materials),{box,cyl,tube,ring,bolt,surface,label,add}=h;
 const id=s=>`eng-${s}`,xAt=c=>(c-2)*l44Nominal.borePitch;
 const crankY=1.05;
 const bankPoint=(x,y,z,s)=>[x+bankOffset(s),crankY+y*Math.cos(Math.PI/6)-z*s*.5,y*s*.5+z*Math.cos(Math.PI/6)];
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
  plate('block',.40,.118,.022,[1,2,3].map(c=>[xAt(c),0,.0445]),bankPoint(0,v6BlockNominal.deckHeight-.011,0,s),rot);
  for(let c=1;c<=3;c++){
   sleeve('block',.0445,.172,bankPoint(xAt(c),v6BlockNominal.deckHeight-.086,0,s),rot,'rotor');
   sleeve('block',.0505,.174,bankPoint(xAt(c),v6BlockNominal.deckHeight-.086,0,s),rot,'iron');
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
  plate(`${bank}-head-gasket`,.412,.13,.002,[1,2,3].map(c=>[xAt(c),0,.0455]),at(0,v6BlockNominal.deckHeight+.001),rot,'dark');
  buildCylinderHead(h,bank,s,at);
  for(let c=1;c<=3;c++){
   // Exhaust-side port flanges and dark port mouths.
   box(id(`${bank}-head`),[.062,.050,.013],at(xAt(c),.315,s*.082),'iron',rot);
   cyl(id(`${bank}-head`),.015,.007,at(xAt(c),.315,s*.091),'dark',[Math.PI/2,0,0]);
  }
  buildExhaustManifold(h,bank,{manifold:id(`${bank}-exhaust`),gaskets:id(`${bank}-exhaust-gasket`)});
  // Open perimeter seal beneath the valve cover.
  tube(id(`${bank}-cover-gasket`),[[-.211,.403,-.070],[.211,.403,-.070],[.211,.403,.070],[-.211,.403,.070],[-.211,.403,-.070]].map(([x,y,z])=>at(x,y,z)),.003,'rubber');
  buildValveCover(h,bank,s,at);
  buildValveHardware(h,bank,s,at);
  for(const x of [-.175,.175])for(const z of [-.062,.062])bolt(id(`${bank}-head-bolts`),at(x,.379,z),.006);
  if(s>0)cyl(id(`${bank}-cover`),.022,.016,at(.135,.477),'blackPaint',rot);
  for(let c=1;c<=3;c++){
   const tag=`${bank}-${c}`,x=xAt(c)+bankOffset(s),piston=at(x-bankOffset(s),.213);
   cyl(id(`piston-${tag}`),.0435,.048,piston,'alloy',rot);
   for(const dy of [-.004,.007,.018])sleeve(`piston-${tag}`,.04351,.003,at(x-bankOffset(s),.213+dy),rot,'dark');
   // Flat ring sections fit within the bore; the old torus representation
   // protruded through the cylinder wall. Section sizes remain reconstructed.
   for(const dy of [-.004,.007,.018]){
    const sh=new T.Shape();sh.absarc(0,0,l44Nominal.bore/2-.0001,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,.0432,0,Math.PI*2,true);sh.holes.push(hole);
    const geo=new T.ExtrudeGeometry(sh,{depth:.0015,bevelEnabled:false,curveSegments:48});geo.translate(0,0,-.00075);geo.rotateX(-Math.PI/2);add(id(`rings-${tag}`),geo,'rotor',at(x-bankOffset(s),.213+dy),rot);
   }
   sleeve(`pin-${tag}`,.009,.073,piston,[0,0,Math.PI/2],'rotor');
   const small=at(x-bankOffset(s),.205-.044),big=[x,crankY+.025,s*.014];
   tube(id(`rod-${tag}`),[big,small],.009,'metal');
   ring(id(`rod-${tag}`),.015,.006,small,'metal',[0,Math.PI/2,0]);
   halfShell(`rod-${tag}`,.031,.024,.023,big,false,'metal');
   halfShell(`rod-cap-${tag}`,.031,.024,.023,big,true,'metal');
   for(const lower of [false,true])halfShell(`rod-bearing-${tag}`,.024,.022,.020,[x,big[1]+(lower?-.0008:.0008),big[2]],lower);
   for(const z of [-.030,.030])bolt(id(`rod-cap-${tag}`),[x,big[1]-.031,big[2]+z],.004);
   for(const [type,dx] of [['intake',-.025],['exhaust',.025]]){
    const v=`${tag}-${type}`,vx=xAt(c)+dx,vz=s*.017;
    const vr=type==='intake'?.018:.015;
    const valveProfile=[[0,-.002],[vr*.88,-.002],[vr,-.0006],[vr,.001],[vr*.86,.0028],[vr*.64,.005],[.0065,.009],[.004,.015],[.0034,.022],[.0034,.083],[0,.083]];
    add(id(`valve-${v}`),new T.LatheGeometry(valveProfile.map(p=>new T.Vector2(...p)),48),'rotor',at(vx,.315,vz),rot);
    const coil=[];for(let k=0;k<=100;k++){const a=k/100*Math.PI*12;coil.push(at(vx+Math.cos(a)*.011,.347+k/100*.042,vz+Math.sin(a)*.011));}
    tube(id(`spring-${v}`),coil,.002,'dark');
    tube(id(`pushrod-${v}`),[at(vx,.145,-s*.038),at(vx,.406-headStackCorrection,-s*.037)],.0035,'rotor');
    for(const p of [at(vx,.145,-s*.038),at(vx,.406-headStackCorrection,-s*.037)])add(id(`pushrod-${v}`),new T.SphereGeometry(.0035,16,12),'rotor',p);
    const lifterProfile=[[0,-.0175],[.0095,-.0175],[.010,-.016],[.010,-.002],[.0091,-.001],[.0091,.003],[.010,.004],[.010,.015],[.0095,.0175],[.004,.0175],[.0035,.012],[0,.011],[0,-.0175]];
    add(id(`lifter-${v}`),new T.LatheGeometry(lifterProfile.map(p=>new T.Vector2(...p)),48),'rotor',at(vx,.131,-s*.038),rot);
   }

  }
 }
 // Three intake levels, separate fuel rail and six injector bodies.
 box(id('lower-intake'),[.354,.057,.127],[0,1.338,0],'metal',[],{},.012);
 for(const s of [-1,1])for(let c=1;c<=3;c++){
  const x=xAt(c)+bankOffset(s),n=(s<0?0:3)+c;
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
 box(id('throttle'),[.065,.022,.056],[.19,1.453,0],'castAluminum',[],{},.008);
 for(const z of [-.033,.033])box(id('throttle'),[.029,.020,.016],[.17,1.49,z],'castAluminum');
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
 // Drawn, stepped oil-pan shell with an open sump.
 buildOilPan(h);
 for(const z of [-.121,.121])box(id('pan-gasket'),[.395,.002,.013],[0,.943,z],'dark',[],{},.001);
 box(id('oil-pump'),[.060,.046,.054],[.105,.948,0],'iron');
 tube(id('pickup'),[[.105,.940,0],[.12,.861,0],[.06,.835,0]],.008,'metal');cyl(id('pickup'),.036,.013,[.060,.826,0],'dark',[0,0,0]);
 cyl(id('oil-filter'),.033,.084,[.134,1.013,-.177],'blackPaint',[0,0,.22]);
 buildIgnition(h);
 buildEngineControls(h);
 refineBlockCasting(h,bankPoint);
 // Engine-mounted accessories, with separate pulley and belt.
 buildEngineService(h);
 const altParts=chargingParts.filter(p=>p.section==='charging-alternator'),altGroups=new Map(altParts.map(p=>[p.id,new T.Group()]));const ah=geometryTools(altGroups,chargingMaterials(materials));buildAlternator(ah,altGroups);ah.optimize();
 for(const g of altGroups.values())for(const m of [...g.children]){m.geometry.translate(...engineOffset.map(v=>-v));m.userData.partId='eng-alternator';groups.get('eng-alternator').add(m);}
 buildEngineDrive(h);
 buildFlywheel(h,id('flywheel'),[.231,crankY,0]);
 ring(id('rear-seal'),.035,.005,[.207,1.05,0],'rubber',[0,Math.PI/2,0]);
 h.optimize();
 // Shared construction datums. Whole parts move rigidly; measured diameters,
 // threads and circular cross-sections are unchanged in the car.
 for(const p of engineParts){
  let delta=[0,0,0];
  const bank=p.id.includes('-front')?-1:p.id.includes('-rear')?1:0;
  if((p.section.startsWith('head-')||p.section.startsWith('valve-'))&&!/^eng-(front|rear)-exhaust/.test(p.id)&&!/^eng-(lifter|pushrod)-(front|rear)/.test(p.id)&&!p.id.includes('head-gasket'))delta=[0,-upperEngineDrop,-bank*headStackCorrection*.5];
  if(p.section==='induction'||p.section==='engine-controls'||['distributor-detail','coil-detail','plug-wires','thermostat-detail'].includes(p.section))delta=[0,-upperEngineDrop,0];
  if(p.id==='eng-pcv')delta[2]=-.045;
  if(/^eng-(piston|rings|pin)-(front|rear)/.test(p.id))delta=[0,-.044*Math.cos(Math.PI/6),-bank*.022];
  for(const mesh of groups.get(p.id).children){
   mesh.updateMatrix();mesh.geometry.applyMatrix4(mesh.matrix).translate(...delta);
   mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);
  }
 }
 for(const p of engineParts){const g=groups.get(p.id);g.userData.assemblySpread=new T.Vector3(...engineSectionById.get(p.section).spread);}
 if(!legacyFrame)correctLegacyHandedness(groups);
 return {root,groups};
}
