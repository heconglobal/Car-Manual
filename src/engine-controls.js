import {bankOffset} from './engine-layout.js';
import {l44Nominal} from './factory-specifications.js';
import * as T from 'three';
const manual='https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf';
const rows=[
 ['tps','Throttle position sensor (TPS)','Molded rotary sensor on the throttle shaft, with two mounting ears and a three-terminal connector.',68,[.12,.06,-.15]],
 ['iac','Idle air control valve (IAC)','Threaded stepper-valve exterior with hex, O-ring, spring and conical pintle. Internal motor components remain grouped.',80,[.13,-.09,.13]],
 ['throttle-gasket','Throttle-body gasket','Thin gasket with the main bore and mounting holes. The outline is reconstructed, not a cutting template.',79,[.09,0,0]],
 ['cold-start-injector','Cold-start injector','Separate cold-start valve with electrical connector and mounting flange, in addition to the six port injectors.',83,[.12,.12,-.10]],
 ['cold-start-pipe','Cold-start fuel tube & body','Formed metal fuel tube and valve body joining the fuel rail to the cold-start injector. Connections follow figure 30; route and length are approximate.',83,[.13,.05,.08]],
 ['cold-start-seals','Cold-start valve O-ring set','Three seals represented as a separate grouped set at the valve, body and tube.',83,[.15,.09,.02]],
 ['fuel-feed-return','Engine fuel feed & return lines','Two formed metal lines at the fuel-rail block, with hex fittings. These stop at the engine boundary; the complete tank-to-engine route remains schematic.',84,[0,.10,-.20]],
 ['fuel-test-port','Fuel-pressure test fitting & cap','Rail test connection and protective cap, following figure 31.',83,[0,.18,0]],
 ['injector-harness','Port-injector harness','Six connector bodies, branch leads and a corrugated main conduit. Circuit pinouts and the complete engine loom are not represented.',7,[0,.22,-.10]],
 ['map','Manifold absolute pressure sensor (MAP)','Rectangular molded sensor with mounting ears, three-terminal connector and vacuum nipple, following figure 9.',67,[-.16,.17,0]],
 ['map-bracket','MAP sensor bracket','Formed mounting support near the plenum. Local dimensions remain approximate.',7,[-.16,.08,0]],
 ['map-hose','MAP vacuum hose','Short molded hose between the MAP nipple and manifold vacuum. Route is reconstructed.',67,[-.15,.11,.10]],
 ['pcv','PCV valve & grommet','Crankcase ventilation valve and rubber cover grommet, grouped. The exact replacement calibration has not been verified.',7,[.08,.16,.20]],
 ['pcv-hose','PCV vacuum hose','Formed crankcase-ventilation hose from the valve-cover PCV fitting to the intake. Exact bends and hose specification remain unmeasured.',7,[0,.23,.17]],
 ['egr-valve','EGR valve','Vacuum diaphragm canister, stem support and ported mounting flange. This is the vacuum-operated L44 arrangement.',93,[.23,.07,.12]],
 ['egr-tube','EGR transfer tube','Flanged tube linking the EGR outlet and intake, with a corrugated flexible section. Tube length and shielding remain approximate.',93,[.16,.15,.15]],
 ['egr-gaskets','EGR flange gaskets','Grouped EGR port gaskets, modeled separately from the tube and valve.',93,[.14,-.04,.18]],
 ['egr-solenoid','EGR vacuum-control solenoid','Solenoid, diagnostic-switch base, filter housing and mounting bracket, grouped from figure 42. Further internal breakdown remains to be modeled.',94,[-.25,.06,-.16]],
 ['vacuum-lines','EGR control vacuum lines','Separate hose runs between the intake, control solenoid and valve. Routes are illustrative; this is not a verified hose-installation diagram.',94,[0,.23,-.19]],
 ['coolant-sensor','ECM coolant-temperature sensor','Threaded sensor, hex and two-terminal connector. Separate from the dash gauge sender and fan switch.',67,[-.12,.04,-.11]],
 ['cold-start-switch','Cold-start thermal-time switch','Threaded thermal switch and electrical connector for the cold-start circuit.',85,[-.11,.08,.09]],
];
export const engineControlParts=rows.map(([key,name,description,page,spread])=>({id:`eng-${key}`,name,description,section:'engine-controls',system:'engine',location:'Engine intake and control components',spread,source:`1985 Pontiac 6E3 · PDF page ${page}`,sourceUrl:`${manual}#page=${page}`,aliases:`sensor tune up vacuum fuel lines hoses ${key.replaceAll('-',' ')}`,referenceNote:'Factory diagrams establish component identity and connections. Dimensions, routing and connector details are reconstructed.'}));

export function buildEngineControls(h){
 const {add,box,cyl,tube,ring,bolt}=h,id=k=>`eng-${k}`,Y=[0,0,0];
 const lathe=(key,profile,pos,mat='zinc',axis=[0,1,0])=>{
  const g=new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),48);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...axis).normalize()));return add(id(key),g,mat,pos);
 };
 const plate=(key,outline,thickness,pos,mat,holes=[],rot=Y)=>{
  const s=new T.Shape();outline.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();
  holes.forEach(([x,y,r])=>{const p=new T.Path();p.absarc(x,y,r,0,Math.PI*2,true);s.holes.push(p);});
  const g=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:thickness>.003,bevelSize:.001,bevelThickness:.001,bevelSegments:2,curveSegments:24});g.translate(0,0,-thickness/2);return add(id(key),g,mat,pos,rot);
 };
 const hex=(key,r,len,pos,mat='zinc',rot=Y)=>add(id(key),new T.CylinderGeometry(r,r,len,6),mat,pos,rot);
 const fitting=(key,p,axis='y')=>{hex(key,.006,.009,p,'zinc',axis==='x'?[0,0,Math.PI/2]:Y);};
 // Throttle shaft sensor: shaped ears and actual central pivot boss.
 const tps=[.195,1.49,-.042];
 plate('tps',[[-.025,-.013],[-.030,-.007],[-.023,.006],[-.013,.016],[.012,.016],[.025,.005],[.029,-.007],[.020,-.015]],.011,tps,'phenolic',[[-.023,-.006,.0028],[.021,-.006,.0028]]);
 cyl(id('tps'),.012,.006,[.195,1.49,-.049],'phenolic',[Math.PI/2,0,0]);
 box(id('tps'),[.016,.013,.016],[.195,1.473,-.044],'phenolic');
 for(let i=0;i<3;i++)box(id('tps'),[.0015,.004,.004],[.190+i*.005,1.466,-.048],'zinc');
 // IAC below the throttle bore; long conical pintle enters the casting.
 const I=[.188,1.443,.034];
 lathe('iac',[[0,-.011],[.005,-.011],[.003,-.020],[.002,-.023],[0,-.023]],I,'zinc');
 lathe('iac',[[0,0],[.010,0],[.011,.005],[.011,.025],[.009,.028],[0,.028]],I,'zinc');
 hex('iac',.013,.007,I);ring(id('iac'),.008,.001,I,'rubber',[Math.PI/2,0,0]);
 box(id('iac'),[.019,.015,.018],[I[0],I[1]+.034,I[2]],'phenolic');
 for(let i=0;i<4;i++)box(id('iac'),[.001,.003,.0015],[I[0]-.004+(i%2)*.008,I[1]+.043,I[2]-.004+Math.floor(i/2)*.008],'zinc');
 const spring=[];for(let i=0;i<=60;i++){const a=i/60*Math.PI*10;spring.push([I[0]+Math.cos(a)*.004,I[1]-.003-i/60*.013,I[2]+Math.sin(a)*.004]);}tube(id('iac'),spring,.00065,'zinc');
 plate('throttle-gasket',[[-.038,-.03],[.038,-.03],[.038,.03],[-.038,.03]],.0013,[.159,1.49,0],'dark',[[0,0,.026],[-.031,0,.003],[.031,0,.003]],[0,Math.PI/2,0]);
 // Cold-start assembly uses a fuel line; it is separate from idle-air bypass.
 const S=[.152,1.352,.034];
 lathe('cold-start-injector',[[0,-.019],[.004,-.019],[.007,-.007],[.012,0],[.012,.020],[.008,.026],[0,.026]],S,'zinc');
 plate('cold-start-injector',[[-.022,-.012],[.018,-.012],[.021,0],[.015,.013],[-.022,.013]],.003,[S[0],S[1],S[2]],'zinc',[[-.016,0,.003]],[Math.PI/2,0,0]);
 box(id('cold-start-injector'),[.016,.014,.017],[S[0],S[1]+.013,S[2]+.016],'phenolic');
 tube(id('cold-start-pipe'),[[.11,1.403,-.072],[.17,1.396,-.09],[.20,1.36,-.05],[.20,1.337,.034],[.155,1.337,.034]],.0032,'zinc');
 fitting('cold-start-pipe',[.11,1.403,-.072]);
 cyl(id('cold-start-pipe'),.010,.018,[.152,1.334,.034],'zinc',Y);
 for(const [r,p] of [[.008,[.152,1.345,.034]],[.006,[.152,1.329,.034]],[.004,[.11,1.400,-.072]]])ring(id('cold-start-seals'),r,.0011,p,'rubber',[Math.PI/2,0,0]);
 for(const [z,r] of [[-.045,.0048],[-.068,.004]]){
  tube(id('fuel-feed-return'),[[-.035,1.409,z],[-.045,1.450,z],[-.17,1.456,z],[-.22,1.42,z-.035],[-.23,1.30,z-.04]],r,'zinc');
  fitting('fuel-feed-return',[-.035,1.414,z]);fitting('fuel-feed-return',[-.23,1.302,z-.04]);
 }
 lathe('fuel-test-port',[[0,0],[.004,0],[.004,.017],[.006,.017],[.006,.024],[0,.024]],[-.025,1.406,-.028],'zinc');
 cyl(id('fuel-test-port'),.0065,.009,[-.025,1.437,-.028],'phenolic',Y);fitting('fuel-test-port',[-.025,1.410,-.028]);
 // Main injector loom and six distinct plug bodies.
 tube(id('injector-harness'),[[-.15,1.405,-.092],[0,1.41,-.10],[.14,1.405,-.092]],.006,'wire');
 for(let i=0;i<55;i++){const x=-.15+i*.0054;ring(id('injector-harness'),.006,.001,[x,1.407,-.096],'silicone');}
 for(const s of [-1,1])for(let c=1;c<=3;c++){
  const x=((c-2)*l44Nominal.borePitch+bankOffset(s));box(id('injector-harness'),[.015,.016,.017],[x,1.402,s*.072],'phenolic');
  tube(id('injector-harness'),[[x,1.409,-.096],[x+.015,1.42,0],[x,1.412,s*.072]],.0025,'wire');
  box(id('injector-harness'),[.009,.002,.019],[x,1.410,s*.072],'zinc');
 }
 // MAP: flanged package, vacuum nipple and keyed three-terminal socket.
 const M=[-.126,1.550,-.016];
 plate('map',[[-.043,-.018],[.043,-.018],[.045,.011],[.036,.019],[-.036,.019],[-.045,.011]],.014,M,'phenolic',[[-.035,0,.003],[.035,0,.003]],[Math.PI/2,0,0]);
 box(id('map'),[.051,.003,.026],[M[0],M[1]+.009,M[2]],'phenolic');
 box(id('map'),[.023,.010,.013],[M[0],M[1]-.005,M[2]-.020],'phenolic');
 for(let i=0;i<3;i++)box(id('map'),[.0014,.002,.005],[M[0]-.006+i*.006,M[1]-.005,M[2]-.027],'zinc');
 cyl(id('map'),.0035,.016,[M[0]+.018,M[1]-.014,M[2]+.013],'phenolic',Y);
 plate('map-bracket',[[-.044,-.017],[.044,-.017],[.044,.017],[-.044,.017]],.002,[M[0],M[1]-.013,M[2]],'zinc',[[-.035,0,.003],[.035,0,.003]],[Math.PI/2,0,0]);
 for(const x of [-.161,-.091]){box(id('map-bracket'),[.012,.017,.002],[x,1.531,-.028],'zinc');bolt(id('map-bracket'),[x,1.556,-.016],.004);}
 tube(id('map-hose'),[[-.108,1.53,-.003],[-.109,1.512,.023],[-.074,1.505,.027]],.0034,'silicone');
 // PCV valve and hose at the trunk-side cover, away from the oil cap.
 const P=[-.13,1.457,.214];
 lathe('pcv',[[.004,-.014],[.007,-.014],[.009,-.005],[.009,.008],[.0055,.012],[.0055,.032],[.004,.032],[.004,-.014]],P,'zinc');
 ring(id('pcv'),.010,.0032,[P[0],P[1]-.004,P[2]],'rubber',[Math.PI/2,0,0]);
 tube(id('pcv-hose'),[[-.13,1.482,.214],[-.13,1.51,.212],[-.095,1.51,.180],[-.065,1.483,.086],[-.045,1.476,.065]],.0065,'silicone');
 // EGR diaphragm and open stem support; ported flange below it.
 const E=[.262,1.313,.175];
 lathe('egr-valve',[[0,.035],[.027,.035],[.031,.039],[.032,.043],[.028,.046],[.021,.058],[.009,.064],[0,.064]],E,'zinc');
 ring(id('egr-valve'),.031,.0014,[E[0],E[1]+.042,E[2]],'zinc',[Math.PI/2,0,0]);
 cyl(id('egr-valve'),.004,.030,[E[0],E[1]+.020,E[2]],'zinc',Y);
 for(const dx of [-.016,.016])box(id('egr-valve'),[.006,.029,.020],[E[0]+dx,E[1]+.016,E[2]],'iron');
 const flange=[[-.033,-.019],[.033,-.019],[.038,0],[.033,.019],[-.033,.019],[-.038,0]];
 plate('egr-valve',flange,.009,E,'iron',[[0,0,.010],[-.027,0,.003],[.027,0,.003]],[Math.PI/2,0,0]);
 tube(id('egr-valve'),[[E[0],E[1]+.060,E[2]],[E[0]-.016,E[1]+.065,E[2]]],.0028,'zinc');
 const egrPath=[[.262,1.310,.175],[.277,1.338,.139],[.258,1.405,.10],[.167,1.458,.06],[.083,1.466,.055]];
 tube(id('egr-tube'),egrPath,.011,'zinc');
 for(let i=0;i<14;i++)ring(id('egr-tube'),.0115,.0016,[.163-i*.0048,1.459+i*.00045,.059-i*.00025],'zinc');
 for(const p of [egrPath[0],egrPath.at(-1)]){plate('egr-tube',flange.map(([x,y])=>[x*.75,y*.75]),.003,p,'zinc',[[0,0,.009],[-.02,0,.003],[.02,0,.003]],[Math.PI/2,0,0]);plate('egr-gaskets',flange.map(([x,y])=>[x*.75,y*.75]),.001,[p[0],p[1]-.003,p[2]],'dark',[[0,0,.009],[-.02,0,.003],[.02,0,.003]],[Math.PI/2,0,0]);}
 const V=[-.244,1.422,-.072];
 box(id('egr-solenoid'),[.058,.007,.040],V,'zinc');
 cyl(id('egr-solenoid'),.016,.047,[V[0],V[1]+.021,V[2]],'phenolic');
 cyl(id('egr-solenoid'),.018,.017,[V[0]-.032,V[1]+.021,V[2]],'plastic');
 box(id('egr-solenoid'),[.032,.014,.030],[V[0]+.003,V[1]+.037,V[2]],'phenolic');
 for(const x of [-.260,-.229])bolt(id('egr-solenoid'),[x,1.466,-.072],.003);
 for(const z of [-.081,-.064])cyl(id('egr-solenoid'),.003,.012,[-.209,1.441,z],'phenolic');
 tube(id('vacuum-lines'),[[-.204,1.441,-.081],[-.168,1.442,-.099],[-.03,1.464,-.12],[.08,1.480,-.064]],.0029,'silicone');
 tube(id('vacuum-lines'),[[-.204,1.441,-.064],[-.17,1.420,-.110],[.18,1.418,-.12],[.29,1.404,.10],[.27,1.380,.175],[.246,1.378,.175]],.0029,'silicone');
 for(const [key,p] of [['coolant-sensor',[-.155,1.343,-.040]],['cold-start-switch',[-.15,1.353,.032]]]){
  lathe(key,[[0,-.018],[.004,-.018],[.006,-.009],[.008,-.005],[.008,.004],[.006,.008],[0,.008]],p,'gold');hex(key,.010,.008,p,'gold');
  box(id(key),[.014,.016,.014],[p[0],p[1]+.016,p[2]],'phenolic');for(const dx of [-.003,.003])box(id(key),[.0015,.003,.002],[p[0]+dx,p[1]+.025,p[2]],'zinc');
 }
}
