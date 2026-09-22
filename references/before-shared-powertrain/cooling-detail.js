import {buildHvacCore} from './hvac-detail.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {coolingParts,coolingSections} from './cooling-catalog.js';
// Legacy builder coordinates use +X for the driver side. The model boundary
// corrects this to physical -X left, -Z front. Hoses retain distinct routes.
const legacyCoolantRoutes={
 'pipe-left':[[.64,.235,-1.25],[.665,.205,-1.10],[.665,.205,.53],[.58,.27,.81]],
 'pipe-right':[[-.64,.235,-1.25],[-.665,.205,-1.10],[-.665,.205,.53],[-.57,.27,.81]],
 'front-inlet':[[.442,.5373,-1.6988],[.52,.534,-1.58],[.60,.40,-1.43],[.64,.235,-1.25]],
 'front-outlet':[[-.442,.2567,-1.6621],[-.49,.274,-1.55],[-.60,.27,-1.43],[-.64,.235,-1.25]],
 'rear-inlet':[[-.55,.695,1.235],[-.57,.65,1.15],[-.49,.59,1.02],[-.43,.55,.92]],
 'crossover':[[-.43,.55,.92],[-.19,.53,.82],[.22,.50,.79],[.45,.42,.78]],
 'rear-coupler':[[.45,.42,.78],[.50,.39,.78],[.56,.33,.79],[.58,.27,.81]],
 'rear-outlet':[[-.57,.27,.81],[-.53,.31,.89],[-.50,.38,1.02],[-.49,.46,1.12]],
};
export const coolantRoutes=Object.fromEntries(Object.entries(legacyCoolantRoutes).map(([id,points])=>[id,points.map(([x,y,z])=>[-x,y,z])]));
export function coolingMaterials(base=createMaterials()){
 const mats={...base};for(const k of ['rubber','plastic','rotor'])mats[k]=base[k].clone();
 mats.rubber.bumpScale=.00008;mats.plastic.bumpScale=.00008;mats.rotor.bumpScale=.000025;
 return mats;
}
export function createCoolingDetail(){
 const root=new T.Group(),groups=new Map(),mats=coolingMaterials();
 for(const p of coolingParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'cooling',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(coolingSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,mats);buildCooling(h);h.optimize();correctLegacyHandedness(groups);return {root,groups};
}
export function buildCooling(h){
 const {add,box,cyl,tube,surface,ring,bolt}=h,{annulus,spring}=mechanicalTools(h),id=s=>'cool-'+s;
 // Position the intact reconstructed radiator package below the closed
 // hood; the former upper support and filler neck visibly pierced the skin.
 // Local datums are visual fit corrections, not measured factory coordinates.
 const y0=.400,z0=-1.70,tip=-.13;
 const rad=(x,y,z)=>[x,y0+y*Math.cos(tip)-z*Math.sin(tip),z0+y*Math.sin(tip)+z*Math.cos(tip)];
 // Flattened tubes and folded fins, with open air passages through the core.
 for(let j=0;j<32;j++){
  const y=-.16+j*.0103;box(id('core'),[.704,.0026,.034],rad(0,y,0),'dark',[tip,0,0],{},.001);
  if(j<31)surface(id('core'),280,2,(u,v)=>rad(-.349+u*.698,y+.00515+Math.sin(u*Math.PI*280)*.00365,(v-.5)*.032),'dark');
 }
 for(const s of [-1,1]){
  const key=s>0?'tank-left':'tank-right',x=s*.386;
  // Open inner face, curved outer wall, end closures and molded reinforcing ribs.
  surface(id(key),40,36,(u,v)=>{const a=-Math.PI/2+u*Math.PI;return rad(x+s*Math.cos(a)*.038,(v-.5)*.375,Math.sin(a)*.042);},'plastic');
  for(const e of [-1,1])surface(id(key),40,10,(u,v)=>{const a=-Math.PI/2+u*Math.PI;return rad(x+s*Math.cos(a)*.038*v,e*.1875,Math.sin(a)*.042*v);},'plastic');
  for(let j=0;j<8;j++)tube(id(key),Array.from({length:32},(_,i)=>{const a=-Math.PI/2+i/31*Math.PI;return rad(x+s*Math.cos(a)*.039,-.16+j*.044,Math.sin(a)*.043);}),.0018,'plastic');
  const boundary=[rad(x,-.181,-.039),rad(x,.181,-.039),rad(x,.187,.035),rad(x,-.187,.035),rad(x,-.181,-.039)];tube(id('tank-seals'),boundary,.0022,'rubber');
  box(id('headers'),[.013,.383,.087],rad(s*.361,0,0),'dark',[tip,0,0],{},.002);
  for(let j=0;j<16;j++)for(const z of [-.047,.047])box(id('headers'),[.022,.006,.004],rad(s*.376,-.173+j*.023,z),'zinc',[tip,0,0],{},.001);
  const hoseY=s>0?.136:-.147;annulus(id(key),.019,.016,.065,rad(s*.410,hoseY,.019),'plastic');ring(id(key),.019,.0015,rad(s*.438,hoseY,.019),'plastic');
 }
 for(const s of [-1,1]){box(id('rails'),[.715,.012,.058],rad(0,s*.178,0),'dark',[tip,0,0],{},.003);for(const z of [-.032,.032])box(id('rails'),[.711,.018,.003],rad(0,s*.173,z),'dark',[tip,0,0],{},.001);for(const x of [-.32,.32])box(id('isolators'),[.066,.028,.074],rad(x,s*.199,0),'rubber',[tip,0,0],{},.006);}
 box(id('upper-support'),[.86,.013,.087],rad(0,.225,0),'frame',[tip,0,0],{},.004);for(const x of [-.40,.40])bolt(id('upper-support'),rad(x,.237,0),.007);
 // Rectangular shroud blends into a true round fan opening.
 const fy=y0,fz=-1.606,fr=.174;
 surface(id('fan-shroud'),120,20,(u,v)=>{const a=u*Math.PI*2,c=Math.cos(a),s=Math.sin(a),r0=Math.min(.335/Math.max(Math.abs(c),.0001),.174/Math.max(Math.abs(s),.0001)),r=r0+(fr-r0)*v;return [Math.cos(a)*r,fy+Math.sin(a)*r,fz-.051+v*.042];},'plastic');
 annulus(id('fan-shroud'),.183,.176,.045,[0,fy,fz],'plastic',[0,Math.PI/2,0]);
 for(const x of [-.326,.326])for(const y of [-.168,.168]){box(id('fan-shroud'),[.024,.025,.012],[x,fy+y,fz-.041],'plastic');bolt(id('fan-fasteners'),[x,fy+y,fz-.029],.004,'z');}
 const bladeZ=fz+.012;
 cyl(id('fan-blade'),.046,.030,[0,fy,bladeZ],'plastic',[Math.PI/2,0,0]);
 for(let i=0;i<5;i++){
  const base=i*Math.PI*2/5;
  for(const skin of [-1,1])surface(id('fan-blade'),22,18,(u,v)=>{const r=.043+u*.122,a=base+u*.48+(v-.5)*(.45+u*.14);return[Math.cos(a)*r,fy+Math.sin(a)*r,bladeZ+(v-.5)*.036+Math.sin(u*Math.PI)*.007+skin*.001];},'plastic');
  tube(id('fan-blade'),Array.from({length:18},(_,j)=>{const u=j/17,r=.045+u*.10,a=base+u*.48;return[Math.cos(a)*r,fy+Math.sin(a)*r,bladeZ-.006];}),.002,'plastic');
 }
 cyl(id('fan-motor'),.041,.082,[0,fy,fz+.065],'zinc',[Math.PI/2,0,0]);cyl(id('fan-motor'),.043,.008,[0,fy,fz+.109],'dark',[Math.PI/2,0,0]);cyl(id('fan-motor'),.005,.040,[0,fy,fz+.009],'rotor',[Math.PI/2,0,0]);for(const x of [-.028,.028])bolt(id('fan-motor'),[x,fy,fz+.116],.003,'z');box(id('fan-motor'),[.025,.015,.018],[.025,fy-.025,fz+.103],'plastic');
 annulus(id('fan-support'),.051,.043,.012,[0,fy,fz+.095],'dark',[0,Math.PI/2,0]);
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3+.5;tube(id('fan-support'),[[Math.cos(a)*.048,fy+Math.sin(a)*.048,fz+.095],[Math.cos(a)*.12,fy+Math.sin(a)*.12,fz+.07],[Math.cos(a)*.186,fy+Math.sin(a)*.186,fz-.037]],.009,'dark');bolt(id('fan-fasteners'),[Math.cos(a)*.052,fy+Math.sin(a)*.052,fz+.11],.004,'z');}
 bolt(id('fan-fasteners'),[0,fy,bladeZ-.022],.007,'z');box(id('fan-connector'),[.023,.021,.025],[.17,fy-.10,fz+.09],'plastic');for(const s of [-1,1])tube(id('fan-connector'),[[.026+s*.003,fy-.026,fz+.105],[.09,fy-.06,fz+.12],[.17+s*.003,fy-.10,fz+.09]],.002,s>0?'wireGreen':'wire');
 // Passenger-side pressure cap, drain and overflow bottle.
 annulus(id('tank-right'),.024,.019,.032,[-.382,.607,-1.719],'plastic',[0,0,Math.PI/2]);tube(id('tank-right'),[[-.36,.601,-1.713],[-.338,.602,-1.70]],.004,'plastic');
 cyl(id('pressure-cap'),.030,.009,[-.382,.629,-1.719],'zinc',[0,0,0]);box(id('pressure-cap'),[.075,.007,.018],[-.382,.631,-1.719],'zinc',[],{},.003);annulus(id('pressure-cap'),.020,.008,.003,[-.382,.606,-1.719],'rubber',[0,0,Math.PI/2]);spring(id('pressure-cap'),[-.382,.614,-1.719],.009,.017,'y',5,.001,'zinc');
 cyl(id('drain'),.008,.017,[-.409,.212,-1.675],'plastic',[0,0,0]);box(id('drain'),[.025,.005,.008],[-.409,.202,-1.675],'plastic',[],{},.002);
 box(id('recovery-tank'),[.205,.205,.156],[-.47,.446,-1.462],'reservoir',[-.1,0,0],{},.045);box(id('recovery-tank'),[.154,.142,.008],[-.47,.450,-1.378],'reservoir',[-.1,0,0],{},.024);for(const y of [.405,.465])tube(id('recovery-tank'),[[-.53,y,-1.370],[-.44,y,-1.37]],.0014,'reservoir');annulus(id('recovery-tank'),.022,.017,.032,[-.47,.557,-1.48],'reservoir',[0,0,Math.PI/2]);cyl(id('recovery-cap'),.026,.014,[-.47,.581,-1.48],'plastic',[0,0,0]);for(let i=0;i<20;i++){const a=i*Math.PI/10;box(id('recovery-cap'),[.003,.011,.003],[-.47+Math.cos(a)*.026,.581,-1.48+Math.sin(a)*.026],'plastic',[0,-a,0],{},.001);}
 tube(id('recovery-hose'),[[-.338,.602,-1.70],[-.32,.579,-1.62],[-.395,.564,-1.51],[-.465,.574,-1.48]],.004,'rubber');for(const x of [-.55,-.39]){box(id('recovery-bracket'),[.031,.090,.008],[x,.48,-1.551],'zinc',[-.1,0,0],{},.004);bolt(id('recovery-bracket'),[x,.509,-1.546],.004,'z');}
 for(const [key,points] of Object.entries(legacyCoolantRoutes)){
  const hard=key.startsWith('pipe-')||key==='crossover',r=hard?.017:.021;tube(id(key),points,r,hard?'blue':'rubber');
  for(const end of [0,points.length-1]){const p=points[end],q=points[end===0?1:end-1],dir=new T.Vector3(...p).sub(new T.Vector3(...q)).normalize();const rot=new T.Euler().setFromQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(1,0,0),dir));const rr=[rot.x,rot.y,rot.z];
   // Open neck lip and clamp hardware, oriented along each individual route.
   if(hard)annulus(id(key),r+.001,r-.0015,.005,p,'zinc',rr);else{annulus(id('clamps'),r+.0018,r+.0006,.009,p,'zinc',rr);box(id('clamps'),[.008,.007,.016],[p[0],p[1]+r+.003,p[2]],'zinc',[],{},.002);}
  }
 }
 for(const s of [-1,1]){
  for(const z of [-.68,.38]){arcBracket(s,z);}
  bolt(id('pipe-drains'),[s*.665,.182,.43],.005,'y','zinc');
 }
 function arcBracket(s,z){annulus(id('pipe-supports'),.022,.018,.022,[s*.665,.205,z],'rubber',[0,Math.PI/2,0]);box(id('pipe-supports'),[.062,.006,.025],[s*.665,.182,z],'zinc',[],{},.002);for(const x of [-.024,.024])bolt(id('pipe-supports'),[s*.665+x,.185,z],.003);}
 // Same option-specific core as the heater explorer; early engine return.
 buildHvacCore(h,{core:id('heater-core'),tanks:id('heater-tanks'),seals:id('heater-seals')});
 for(const [i,x] of [[0,-.14],[1,-.18]]){
  tube(id('heater-pipes'),[[x,.31,-.56],[x,.215,-.36],[x,.215,.54],[x-.04,.35,.73]],i?.008:.009,'blue');
  tube(id('heater-hoses'),[[i?-.19:-.35,.642,-.678],[i?-.20:-.35,.44,-.65],[x,.31,-.56]],.011,'rubber');
 }
 tube(id('heater-hoses'),[[-.18,.35,.73],[-.21,.48,.88],[-.28,.64,1.10]],.011,'rubber');tube(id('heater-hoses'),[[-.22,.35,.73],[-.43,.38,.85],[-.52,.52,1.11]],.010,'rubber');
}
