import {bankOffset} from './engine-layout.js';
import {l44Nominal} from './factory-specifications.js';
import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {exhaustParts,exhaustSections} from './exhaust-catalog.js';
export function exhaustMaterials(base=createMaterials()){const m={...base};for(const k of ['metal','zinc','iron','rubber','interior'])m[k]=base[k].clone();m.metal.roughness=.49;m.metal.bumpScale=.000025;m.zinc.roughness=.46;m.zinc.bumpScale=.000025;m.iron.color.set('#888b87');m.iron.roughness=.86;m.iron.bumpScale=.00006;m.interior.color.set('#b4b0a2');m.interior.bumpScale=.00012;m.rubber.bumpScale=.000035;return m;}
export function createExhaustDetail(){const root=new T.Group(),groups=new Map();for(const p of exhaustParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'fuel',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(exhaustSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,exhaustMaterials());buildExhaust(h);h.optimize();correctLegacyHandedness(groups);return{root,groups};}
function tools(h){
 const {add,tube,ring,cyl,box,surface,bolt}=h,{annulus,plate,spring}=mechanicalTools(h);
 function sleeve(id,r,b,l,p,mat='metal',axis=[1,0,0]){const m=annulus(id,r,b,l,p,mat);m.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis).normalize());return m;}
 function flange(id,p,axis,r=.024,span=.043,mat='metal',thickness=.005){
  const sh=new T.Shape();sh.moveTo(-span,-.011);sh.quadraticCurveTo(-span-.01,0,-span,.011);sh.quadraticCurveTo(0,r+.012,span,.011);sh.quadraticCurveTo(span+.01,0,span,-.011);sh.quadraticCurveTo(0,-r-.012,-span,-.011);
  for(const [x,rad] of [[0,r],[-span,.0045],[span,.0045]]){const hole=new T.Path();hole.absarc(x,0,rad,0,Math.PI*2,true);sh.holes.push(hole);}const g=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:false,curveSegments:32});g.translate(0,0,-thickness/2);const m=add(id,g,mat,p);m.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),new T.Vector3(...axis).normalize());return m;
 }
 function pipe(id,points,r=.025,mat='metal',flags={}){tube(id,points,r,mat,flags);const inner=add(id,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(24,points.length*5),r-.0015,10,false),mat,[0,0,0],[0,0,0],flags);inner.material.side=T.BackSide;for(const n of [0,points.length-1]){const p=points[n],near=points[n===0?1:n-1],axis=new T.Vector3(...p).sub(new T.Vector3(...near)).normalize();const m=sleeve(id,r,r-.0015,.002,p,mat,axis.toArray());Object.assign(m.userData,flags);}}
 function uClamp(id,p,r,axis=[1,0,0]){const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis).normalize()),at=([a,b,c])=>new T.Vector3(a,b,c).applyQuaternion(q).add(new T.Vector3(...p)).toArray();const pts=[[-.001,-r-.018,-r]];for(let i=0;i<=32;i++){const a=Math.PI*i/32;pts.push([0,Math.sin(a)*r,-Math.cos(a)*r]);}pts.push([0,-r-.018,r]);tube(id,pts.map(at),.003,'zinc');const saddle=box(id,[.011,.012,r*2+.014],at([0,-r-.009,0]),'zinc',[],{},.003);saddle.quaternion.copy(q);for(const s of [-1,1]){const m=add(id,new T.CylinderGeometry(.006,.006,.005,6),'zinc',at([0,-r-.020,s*r]));m.quaternion.copy(q);}}
 function tension(id,a,b,r=.008){const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av),length=v.length(),unit=v.clone().normalize();spring(id,av.clone().add(bv).multiplyScalar(.5).toArray(),r,Math.max(.012,length-.024),unit.toArray(),10,.0014,'zinc');const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(1,0,0),unit);for(const [p,s] of [[av,-1],[bv,1]]){const c=p.clone().addScaledVector(unit,-s*.006);const hook=ring(id,.006,.0014,c.toArray(),'zinc',[0,0,0]);hook.quaternion.copy(q);tube(id,[p.toArray(),p.clone().addScaledVector(unit,-s*.019).toArray()],.0014,'zinc');}}
 return{...mechanicalTools(h),sleeve,flange,pipe,uClamp,tension};
}
// Same primary geometry is used by the vehicle, exhaust explorer and engine
// explorer. These engine coordinates match the existing bank/head datum.
export function buildExhaustManifold(h,bank,ids){
 const {tube,ring,cyl,bolt}=h,{pipe,flange,sleeve}=tools(h),s=bank==='front'?-1:1;
 const portY=1.05+.315*Math.cos(Math.PI/6)-.099*.5,portZ=s*(.315*.5+.099*Math.cos(Math.PI/6)),y=portY-.04,z=portZ+s*.058;
 for(const x of [-l44Nominal.borePitch,0,l44Nominal.borePitch].map(x=>x+bankOffset(s))){
  const port=[x,portY,portZ],join=[x,y,z];pipe(ids.manifold,[port,[x,portY-.021,portZ+s*.034],join],.017);
  flange(ids.manifold,port,[0,0,s],.015,.028,'metal',.005);
  const f=flange(ids.gaskets,[x,portY,portZ-s*.003],[0,0,s],.0155,.028,'dark',.001);
  for(const dx of [-.028,.028])if(ids.bolts)bolt(ids.bolts,[x+dx,portY,portZ+s*.007],.004,'z');
  ring(ids.manifold,.0175,.001,[x,portY-.002,portZ+s*.006],'zinc',[0,0,0]);
 }
 pipe(ids.manifold,[[-.126,y,z],[.12,y,z],[.205,y,z]],.020);
 // Closed collector end; open outlet faces the driver-side crossover.
 cyl(ids.manifold,.020,.0015,[-.126,y,z],'metal');flange(ids.manifold,[.205,y,z],[1,0,0],.0185,.033);
 sleeve(ids.manifold,.021,.0185,.012,[.199,y,z],'metal');
}
const enginePlacement=new T.Matrix4().makeScale(1.6,.6856,1.3);enginePlacement.setPosition(-.11,-.2923,1.17);
export const exhaustDatum={manifoldOutlets:{front:[-.218,.55323,.77809],rear:[-.218,.55323,1.56191]},converter:[0,.264,.715],muffler:[0,.274,1.74]};
export function buildExhaust(h){
 // Build shared manifolds in temporary groups, then place at the vehicle bank
 // datum. All subsequent pipes are authored in the legacy vehicle frame.
 const ids=exhaustParts.filter(p=>p.section==='exhaust-manifolds'),local=new Map(ids.map(p=>[p.id,new T.Group()]));const mh=geometryTools(local,exhaustMaterials());for(const bank of ['front','rear'])buildExhaustManifold(mh,bank,{manifold:`ex-${bank}-manifold`,gaskets:`ex-${bank}-gaskets`,bolts:`ex-${bank}-bolts`});
 for(const [id,g] of local)for(const m of g.children){m.updateMatrix();m.geometry.applyMatrix4(m.matrix).applyMatrix4(enginePlacement);h.add(id,m.geometry,m.material);}
 buildCrossover(h);buildCatalyst(h);buildRear(h);
}
const crossRoutes={
 front:[[.218,.55323,.77809],[.30,.548,.783],[.35,.522,.85],[.37,.492,1.00]],
 rear:[[.218,.55323,1.56191],[.32,.55,1.56],[.37,.53,1.41],[.385,.518,1.17],[.37,.492,1.00]],
 outlet:[[.37,.492,1.00],[.39,.438,.94],[.39,.393,.90]],
 down:[[.39,.393,.90],[.39,.32,.84],[.36,.261,.735],[.265,.261,.715]],
 intermediate:[[-.265,.261,.715],[-.385,.260,.72],[-.48,.255,.81],[-.51,.252,1.15],[-.49,.266,1.46],[-.39,.312,1.67],[-.275,.315,1.74]],
};
export const exhaustRoutes=Object.fromEntries(Object.entries(crossRoutes).map(([k,points])=>[k,points.map(([x,y,z])=>[-x,y,z])]));
function buildCrossover(h){
 const {surface,box,bolt,tube,cyl}=h,{pipe,flange,sleeve,spring}=tools(h),id=k=>'ex-cross-'+k;
 for(const key of ['front','rear','outlet'])pipe(id('pipe'),crossRoutes[key],.024);
 for(const z of [.77809,1.56191]){flange(id('pipe'),[.225,.55323,z],[1,0,0],.022,.033);for(const dz of [-.033,.033]){cyl(id('manifold-bolts'),.004,.035,[.222,.55323,z+dz],'zinc');bolt(id('manifold-bolts'),[.246,.55323,z+dz],.007,'x');}}
 const p=[.39,.393,.90];flange(id('pipe'),p,[0,1,0],.023,.050);sleeve(id('seal'),.032,.023,.011,[p[0],p[1]-.008,p[2]],'dark',[0,1,0]);flange(id('front-pipe'),[p[0],p[1]-.015,p[2]],[0,1,0],.024,.050);pipe(id('front-pipe'),crossRoutes.down,.027);
 for(const x of [.34,.44]){cyl(id('joint-bolts'),.005,.077,[x,.362,.90],'zinc',[0,0,0]);bolt(id('joint-bolts'),[x,.325,.90],.009);spring(id('joint-springs'),[x,.351,.90],.012,.040,'y',7,.002,'zinc');}
 for(const [key,route] of [['front-shield',crossRoutes.front],['rear-shield',crossRoutes.rear]]){
  const path=new T.CatmullRomCurve3(route.map(p=>new T.Vector3(...p))),frames=path.computeFrenetFrames(60,false);
  surface(id(key),60,24,(u,v)=>{const p=path.getPoint(u),i=Math.min(60,Math.round(u*60)),a=v*Math.PI*1.65-Math.PI*.325;return p.addScaledVector(frames.normals[i],Math.cos(a)*.0315).addScaledVector(frames.binormals[i],Math.sin(a)*.0315).toArray();},'zinc');
  for(const u of [.24,.73]){const p=path.getPoint(u);box(id(key),[.023,.003,.037],[p.x,p.y+.034,p.z],'zinc',[],{},.002);bolt(id('shield-screws'),[p.x,p.y+.037,p.z],.004);}
 }
}
function capsuleShape(length,width){const sh=new T.Shape(),a=length/2-width/2,r=width/2;sh.moveTo(-a,-r);sh.lineTo(a,-r);sh.absarc(a,0,r,-Math.PI/2,Math.PI/2,false);sh.lineTo(-a,r);sh.absarc(-a,0,r,Math.PI/2,Math.PI*1.5,false);sh.closePath();return sh;}
function capPlate(h,id,length,width,thickness,y,z,mat='metal',holes=[]){const sh=capsuleShape(length,width);for(const [x,dy,r]of holes){const p=new T.Path();p.absarc(x,dy,r,0,Math.PI*2,true);sh.holes.push(p);}const geo=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:false,curveSegments:36});geo.rotateX(-Math.PI/2);return h.add(id,geo,mat,[0,y,z]);}
function catalystSkin(h,id,y,up,mat='metal'){
 const {surface,tube}=h;const sign=up?1:-1;
 // Capsule perimeter skirt meets a crown plate; dense patches keep formed
 // surfaces smooth and leave separate shells open on their mating sides.
 capPlate(h,id,.448,.188,.001,y,.715,mat,up?[]:[[.045,0,.011]]);
 const outline=capsuleShape(.448,.188).getPoints(64),pts=outline.map(p=>[p.x,y,.715-p.y]);tube(id,pts,.0022,mat);
 surface(id,128,12,(u,v)=>{const i=u*(outline.length-1),n=Math.floor(i),p=outline[n].clone().lerp(outline[Math.min(n+1,outline.length-1)],i-n);return[p.x*(1+.035*v),y-sign*(up?.030:.052)*v,.715-p.y*(1+.035*v)];},mat);
}
function buildCatalyst(h){
 const {surface,tube,box,cyl,bolt,ring,add}=h,{pipe,sleeve,uClamp}=tools(h),id=k=>'ex-cat-'+k;
 catalystSkin(h,id('wrap'),.321,true,'zinc');catalystSkin(h,id('upper'),.302,true);catalystSkin(h,id('lower'),.222,false);
 capPlate(h,id('top-insulation'),.406,.165,.006,.308,.715,'interior');capPlate(h,id('lower-insulation'),.406,.165,.004,.229,.715,'interior');
 // Drawn ends are separate early converter connections, not a later welded
 // front-pipe variant. The chamber’s internals are a labelled cutaway.
 for(const s of [-1,1])pipe(id('upper'),[[s*.265,.261,.715],[s*.22,.261,.715],[s*.191,.270,.715]],.029);
 for(const x of [-.135,-.067,0,.067,.135])tube(id('wrap'),[[x,.323,.65],[x,.328,.668],[x,.33,.715],[x,.328,.762],[x,.323,.780]],.005,'zinc');
 const holes=[];for(let x=-.175;x<=.175;x+=.014)for(let z=-.060;z<=.060;z+=.014)if(Math.abs(x)<.142||Math.hypot(Math.abs(x)-.142,z)<.08)holes.push([x,z,.003]);capPlate(h,id('support'),.403,.163,.002,.242,.715,'metal',holes);
 // Each grain remains native 3D, merged as a representative pellet-bed set.
 const sphere=new T.SphereGeometry(.0048,8,6);for(let ix=0;ix<25;ix++)for(let iz=0;iz<10;iz++){const x=-.168+ix*.014,z=-.058+iz*.013;if(Math.abs(x)>.133&&Math.hypot(Math.abs(x)-.133,z)>.071)continue;add(id('pellets'),sphere.clone(),'iron',[x,.252+Math.sin(ix*13+iz*7)*.0015,.715+z]);}sphere.dispose();
 sleeve(id('plug'),.017,.011,.008,[.045,.218,.715],'metal',[0,1,0]);cyl(id('plug'),.013,.003,[.045,.212,.715],'zinc',[0,0,0]);
 for(const [key,y,w]of [['floor-shield',.35,.245],['splash-shield',.195,.216]]){
  surface(id(key),72,32,(u,v)=>{const x=(u-.5)*.52,z=.715+(v-.5)*w;return[x,y+.016*(Math.abs(x)/.26)**8+.007*Math.cos(v*Math.PI*6)**10,z];},'zinc');for(const x of [-.22,.22])for(const dz of [-w*.42,w*.42])bolt(id('shield-screws'),[x,y+.008,.715+dz],.004);
 }
 for(const x of [-.243,.243])uClamp(id('shield-clamps'),[x,.263,.715],.030);
 uClamp(id('outlet-clamp'),[-.271,.261,.715],.03016);
}
function buildRear(h){
 const {surface,tube,ring,box,cyl,bolt}=h,{pipe,sleeve,uClamp,plate,tension}=tools(h),id=k=>'ex-rear-'+k;
 const y=.274,z=1.74;
 // Transverse oval shell and real inlet/outlet openings in its end faces.
 surface(id('muffler'),96,18,(u,v)=>{const a=u*Math.PI*2;return[(v-.5)*.55,y+.072*Math.cos(a),z+.112*Math.sin(a)];},'metal');
 for(const s of [-1,1]){
  const sh=new T.Shape();sh.absellipse(0,0,.112,.072,0,Math.PI*2,false,0);for(const dy of (s<0?[.041,-.026]:[-.026])){const hole=new T.Path();hole.absarc(0,dy,.025,0,Math.PI*2,true);sh.holes.push(hole);}const g=new T.ExtrudeGeometry(sh,{depth:.0018,bevelEnabled:false,curveSegments:48});g.rotateY(Math.PI/2);h.add(id('muffler'),g,'metal',[s*.275,y,z]);tube(id('muffler'),Array.from({length:97},(_,i)=>[s*.275,y+.072*Math.cos(i*Math.PI/48),z+.112*Math.sin(i*Math.PI/48)]),.003,'zinc');pipe(id('muffler'),[[s*.265,y-.026,z],[s*.322,y-.026,z]],.0254);
 }
 pipe(id('intermediate'),crossRoutes.intermediate,.03016);
 // Beaded formed rear-compartment shield.
 surface(id('shield'),72,30,(u,v)=>{const x=(u-.5)*.62;return[x,.31+(v-.5)*.21,1.595+.009*Math.cos(u*Math.PI*12)**8+.023*(2*v-1)**8];},'zinc');for(const x of [-.26,.26])for(const dy of [-.07,.07])bolt(id('shield-screws'),[x,.31+dy,1.63],.004,'z');
 for(const s of [-1,1]){
  const side=s>0?'left':'right',tail=id(side+'-tail');pipe(tail,[[s*.316,.248,1.74],[s*.41,.244,1.78],[s*.475,.240,1.885]],.0254);
  for(const offset of [-.037,.037]){const x=s*.51+offset;pipe(tail,[[s*.475,.240,1.875],[s*.48+offset,.240,1.925],[x,.240,1.965]],.025);
   for(const [value,mat]of [['bright','chrome'],['black','blackPaint']]){const flags={option:'exhaustFinish',value};surface(tail,48,14,(u,v)=>{const a=u*Math.PI*2,r=.028+.0015*Math.sin(v*Math.PI/2);return[x+r*Math.cos(a),.240+r*Math.sin(a),1.955+v*.094];},mat,flags);surface(tail,48,8,(u,v)=>{const a=u*Math.PI*2;return[x+.025*Math.cos(a),.240+.025*Math.sin(a),2.018+v*.031];},'dark',flags);ring(tail,.0272,.0023,[x,.240,2.049],mat,[0,0,0],flags);}
  }
  uClamp(id('tail-clamps'),[s*.326,.248,1.74],.0254);
  const hp=[s*.435,.335,1.798];plate(id(side+'-hanger'),[[.28,1.774],[.395,1.774],[.404,1.814],[.28,1.824]],[[.385,1.798,.0045],[.296,1.802,.0045]],.004,s*.435,'metal');box(id(side+'-hanger'),[.010,.063,.035],[s*.438,.332,1.798],'rubber',[],{},.006);for(const dy of [-.038,.051])bolt(id('hanger-bolts'),[s*.447,.335+dy,1.798],.006,'x');
  surface(id(side+'-fascia-shield'),32,20,(u,v)=>[s*.51+(u-.5)*.19,.307+.026*(2*u-1)**4,1.88+v*.11],'zinc');for(const dx of [-.063,.063])bolt(id('fascia-nuts'),[s*.51+dx,.328,1.944],.005);
  plate(id('spring-brackets'),[[.254,1.61],[.323,1.6],[.35,1.67],[.265,1.67]],[[.286,1.626,.007],[.327,1.639,.007]],.004,s*.421,'metal');for(const dz of [0,.028])bolt(id('spring-brackets'),[s*.428,.286,1.624+dz],.005,'x');
  for(let i=0;i<3;i++){const a=[s*(.32+i*.009),.287+i*.018,1.655+i*.018],b=[s*.419,.278+i*.023,1.627+i*.015];tension(id(side+'-springs'),a,b);ring(id('muffler'),.006,.0018,a,'metal');}
 }
}
