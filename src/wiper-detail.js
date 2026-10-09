import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {electricalTools} from './electrical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {buildWiperSide} from './exterior.js';
import {wiperParts} from './wiper-catalog.js';

// Legacy authoring frame, converted exactly once at each model boundary.
// These are reconstruction datums, never published factory coordinates.
export const wiperDatums={motor:[-.06,.736,-.657],pivots:{left:[.16,.805,-.609],right:[-.48,.805,-.609]},pump:[.43,.325,-1.24],valve:[.49,.397,-1.10]};
const remapArms=h=>Object.fromEntries(Object.entries(h).map(([key,fn])=>[key,typeof fn==='function'?(id,...args)=>fn('ww-'+id.replace('wiper-',''),...args):fn]));
export function createWiperDetail(){
 const root=new T.Group(),groups=new Map();
 for(const p of wiperParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'electrical',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3()};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,createMaterials());buildWiperHardware(h);applyWiperOptions(groups);h.optimize();correctLegacyHandedness(groups);
 return {root,groups};
}
function applyWiperOptions(groups){for(const p of wiperParts)if(p.option)groups.get(p.id).traverse(m=>{if(m.isMesh)Object.assign(m.userData,{option:p.option,value:p.value});});}
export function buildVehicleWipers(groups,materials){
 const detail=new Map(wiperParts.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,materials);
 buildWiperHardware(h);applyWiperOptions(detail);h.optimize();
 for(const p of wiperParts){
  // Exterior arms/blades are already built from the identical shared function.
  if(/^ww-(arm|blade)-/.test(p.id))continue;
  const owner=p.section==='wiper-washer'?'washer-reservoir':'wiper-mechanism';
  for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=owner;mesh.userData.detailPartId=p.id;groups.get(owner).add(mesh);}
 }
}
export function buildWiperHardware(h){
 const {box,cyl,tube,surface,add,bolt}=h,{sleeve,frame,plate}=electricalTools(h),id=k=>'ww-'+k;
 for(const side of ['left','right'])buildWiperSide(remapArms(h),side);
 const [x,y,z]=wiperDatums.motor;
 const crankEnd=[x+.033,y+.030,z+.043];
 const rod=(key,a,b,r=.004,mat='zinc')=>tube(id(key),[a,b],r,mat);
 // Die-cast standard housing: open gear recess, rim and three mounting ears.
 frame(id('motor-housing'),.104,.114,.006,.036,[x,y,z],'castAluminum',.038);
 plate(id('motor-housing'),.104,.114,.004,[x,y,z-.020],'castAluminum',[[0,0,.007]],.038);
 for(const [dx,dy] of [[-.060,-.037],[.056,-.041],[.041,.060]]){
  sleeve(id('motor-housing'),.014,.009,.007,[x+dx,y+dy,z],'castAluminum');
  sleeve(id('motor-mounts'),.010,.004,.012,[x+dx,y+dy,z],'rubber');
  bolt(id('motor-mounts'),[x+dx,y+dy,z+.010],.006,'z');
 }
 sleeve(id('motor-seal'),.012,.006,.007,[x,y,z-.025],'rubber');
 sleeve(id('motor-gear'),.039,.006,.009,[x,y,z-.004],'pickupPlastic');
 cyl(id('motor-gear'),.006,.068,[x,y,z+.010],'zinc',[Math.PI/2,0,0]);
 // Offset park cam is distinct from the unsupported reduction tooth profile.
 sleeve(id('motor-gear'),.015,.007,.006,[x+.006,y,z+.004],'pickupPlastic');
 for(const dz of [-.011,.003])sleeve(id('motor-washers'),.013,.0064,.001,[x,y,z+dz],'zinc');
 box(id('motor-park'),[.011,.031,.006],[x-.035,y+.025,z+.005],'phenolic',[],{},.002);
 rod('motor-park',[x-.030,y+.020,z+.010],[x-.009,y+.010,z+.010],.0018,'copper');
 plate(id('motor-cover'),.108,.118,.003,[x,y,z+.020],'plastic',[],.033);
 // Motor shaft is parallel to X and tangent to the reconstructed gear pocket.
 const cy=y+.047,cz=z-.004,ax=x+.101;
 sleeve(id('motor-field'),.028,.024,.091,[ax,cy,cz],'blackPaint','x');
 cyl(id('motor-field'),.027,.003,[ax+.046,cy,cz],'blackPaint');
 for(const sign of [-1,1]){
  surface(id('motor-field'),28,3,(u,v)=>{const a=(u-.5)*1.8+(sign===1?0:Math.PI);return[ax+(v-.5)*.074,cy+Math.cos(a)*.022,cz+Math.sin(a)*.022];},'iron');
 }
 cyl(id('motor-armature'),.017,.060,[ax,cy,cz],'iron');
 cyl(id('motor-armature'),.0035,.165,[ax-.018,cy,cz],'zinc');
 cyl(id('motor-armature'),.010,.013,[ax-.038,cy,cz],'copper');
 // Broad copper bundles indicate winding construction without turn-count claims.
 for(let i=0;i<8;i++){const a=i*Math.PI/4;rod('motor-armature',[ax-.029,cy+Math.cos(a)*.016,cz+Math.sin(a)*.016],[ax+.029,cy+Math.cos(a)*.016,cz+Math.sin(a)*.016],.0025,'copper');}
 cyl(id('motor-armature'),.006,.032,[x+.019,cy,cz],'zinc');
 for(const bx of [ax-.050,ax+.045]){
  sleeve(id('motor-bearings'),.008,.0037,.005,[bx,cy,cz],'gold','x');
  const m=frame(id('motor-bearing-straps'),.027,.022,.003,.002,[bx,cy,cz],'zinc',.008);m.rotation.y=Math.PI/2;
 }
 const holder=sleeve(id('motor-brush-holder'),.023,.012,.006,[ax-.040,cy,cz],'phenolic','x');
 for(const a of [0,Math.PI*.67,Math.PI*1.33]){
  box(id('motor-brush-holder'),[.007,.009,.007],[ax-.040,cy+Math.cos(a)*.015,cz+Math.sin(a)*.015],'dark',[],{},.001);
 }
 box(id('motor-brush-holder'),[.013,.005,.008],[ax-.040,cy+.024,cz],'zinc',[],{},.001);
 // Pulse service unit has its own cover/board space; exact circuit is unknown.
 frame(id('pulse-motor'),.120,.117,.006,.041,[x,y,z],'castAluminum',.025);
 plate(id('pulse-motor'),.120,.117,.004,[x,y,z-.023],'castAluminum',[[0,0,.007]],.025);
 sleeve(id('pulse-motor'),.028,.024,.095,[ax,cy,cz],'blackPaint','x');
 cyl(id('pulse-motor'),.027,.003,[ax+.048,cy,cz],'blackPaint');
 cyl(id('pulse-motor'),.006,.068,[x,y,z+.010],'zinc',[Math.PI/2,0,0]);
 for(const [dx,dy] of [[-.066,-.037],[.064,-.041],[.041,.066]]){
  sleeve(id('pulse-motor'),.014,.004,.009,[x+dx,y+dy,z],'rubber');bolt(id('pulse-motor'),[x+dx,y+dy,z+.009],.006,'z');
 }
 plate(id('pulse-board'),.097,.084,.0015,[x,y,z+.010],'wireGreen',[],.004);
 frame(id('pulse-board'),.040,.014,.002,.014,[x-.025,y+.050,z+.020],'plastic',.003);
 plate(id('pulse-cover'),.123,.120,.003,[x,y,z+.025],'plastic',[],.026);
 for(const dx of [-.043,.043])bolt(id('pulse-cover'),[x+dx,y-.046,z+.030],.003,'z');
 rod('motor-crank',[x,y,z+.043],crankEnd,.007);
 sleeve(id('motor-crank'),.012,.0065,.006,[x,y,z+.043],'zinc');
 bolt(id('motor-nut'),[x,y,z+.051],.008,'z');
 for(const [side,p] of Object.entries(wiperDatums.pivots)){
  const key='pivot-'+side,[px,py,pz]=p;
  const mount=plate(id(key),.063,.040,.004,[px,py-.014,pz],'zinc',[[-.022,0,.004],[.022,0,.004]],.012);mount.rotation.x=Math.PI/2;
  sleeve(id(key),.012,.006,.034,p,'castAluminum','y');
  cyl(id(key),.005,.048,[px,py+.004,pz],'zinc',[0,0,0]);
  const endpoint=[px+.028,py-.023,pz+.015];
  rod(key,[px,py-.023,pz],endpoint,.006);
  rod('link-'+side,crankEnd,endpoint,.005);
  for(const pt of [crankEnd,endpoint])sleeve(id('joint-'+side),.009,.0055,.009,pt,'pickupPlastic','y');
 }
 box(id('link-deflector'),[.18,.003,.037],[-.15,.800,-.600],'plastic',[.14,0,0],{},.004);
 buildWasher(h);
}
function buildWasher(h){
 const {surface,cyl,tube,box}=h,{sleeve}=electricalTools(h),id=k=>'ww-washer-'+k;
 const cx=.43,cz=-1.24,power=n=>Math.sign(n)*Math.abs(n)**.42;
 const outline=(u,scale=1)=>[cx+.078*power(Math.cos(u*Math.PI*2))*scale,cz+.119*power(Math.sin(u*Math.PI*2))*scale];
 for(const inner of [false,true])surface(id('bottle'),64,6,(u,v)=>{const p=outline(u,inner?.964:1);return[p[0],.351+v*.139,p[1]];},'reservoir');
 surface(id('bottle'),64,5,(u,v)=>{const p=outline(u),a=u*Math.PI*2;return[T.MathUtils.lerp(p[0],cx+.030*Math.cos(a),v),.490+v*.028,T.MathUtils.lerp(p[1],cz-.05+.030*Math.sin(a),v)];},'reservoir');
 surface(id('bottle'),64,5,(u,v)=>{const p=outline(u,v);return[p[0],.352,p[1]];},'reservoir');
 sleeve(id('bottle'),.030,.026,.016,[cx,.518,cz-.05],'reservoir','y');
 cyl(id('cap'),.032,.014,[cx,.534,cz-.05],'plastic',[0,0,0]);
 const [px,py,pz]=wiperDatums.pump;
 cyl(id('pump'),.016,.040,[px,py,pz],'plastic',[0,0,0]);
 sleeve(id('pump'),.008,.004,.025,[px,py+.025,pz],'plastic','y');
 sleeve(id('pump-seal'),.011,.008,.007,[px,.351,pz],'rubber','y');
 const outlet=[px+.023,py+.004,pz];sleeve(id('pump'),.006,.003,.023,[px+.012,py+.004,pz],'plastic','x');
 box(id('pump'),[.015,.008,.013],[px,py-.023,pz],'plastic',[],{},.001);
 const [vx,vy,vz]=wiperDatums.valve;
 sleeve(id('check-valve'),.010,.003,.037,[vx,vy,vz],'plastic','z');
 tube(id('feed-hose'),[outlet,[.50,.36,-1.18],[vx,vy,vz-.0185]],.0035,'rubber');
 const junction=[.42,.700,-.665];
 tube(id('branches'),[[vx,vy,vz+.0185],[.53,.49,-.96],[.52,.66,-.72],junction],.0035,'rubber');
 for(const nx of [-.42,.28]){
  const tip=[nx,.805,-.654];
  tube(id('branches'),[junction,[nx,.752,-.672],[nx,.798,-.664]],.003,'rubber');
  const nozzle=sleeve(id('nozzles'),.005,.0015,.018,tip,'plastic','z');nozzle.rotation.x=-.22;
 }
}
