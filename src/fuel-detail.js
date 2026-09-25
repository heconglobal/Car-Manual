import * as T from 'three';
import {engineToVehicle} from './powertrain-layout.js';
import {upperEngineDrop} from './engine-layout.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {fuelParts,fuelSections} from './fuel-catalog.js';
import {bodyPoint} from './body-datums.js';
export function fuelMaterials(base=createMaterials()){
 const m={...base};for(const k of ['metal','rubber','plastic','interior','reservoir'])m[k]=base[k].clone();m.metal.roughness=.44;m.metal.bumpScale=.00003;m.rubber.bumpScale=.000025;m.plastic.bumpScale=.000025;m.reservoir.transparent=false;m.reservoir.opacity=1;m.interior.color.set('#c3af82');m.interior.bumpScale=.00014;return m;
}
export function createFuelDetail(){const root=new T.Group(),groups=new Map();for(const p of fuelParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'fuel',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(fuelSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,fuelMaterials());buildFuel(h);h.optimize();correctLegacyHandedness(groups);return{root,groups};}
function fuelTools(h){
 const {add,cyl,tube,ring,box}=h,{annulus,plate}=mechanicalTools(h);
 function sleeve(id,r,b,w,pos,mat='metal',axis=[0,1,0]){const m=annulus(id,r,b,w,pos,mat);m.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis).normalize());return m;}
 function lathe(id,points,pos,mat='metal',axis=[0,1,0]){const g=new T.LatheGeometry(points.map(([y,r])=>new T.Vector2(r,y)),64);const m=add(id,g,mat,pos);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...axis).normalize());return m;}
 function clamp(id,pos,r,axis=[0,1,0]){sleeve(id,r+.001,r,.005,pos,'zinc',axis);box(id,[.010,.008,.006],[pos[0]+r+.003,pos[1],pos[2]],'zinc',[],{},.002);cyl(id,.002,.012,[pos[0]+r+.004,pos[1],pos[2]],'zinc',[Math.PI/2,0,0]);}
 function hose(id,points,r=.004,mat='rubber'){tube(id,points,r,mat);for(const p of [points[0],points.at(-1)]){const near=p===points[0]?points[1]:points.at(-2),v=new T.Vector3(...p).sub(new T.Vector3(...near)).normalize().toArray();sleeve(id,r+.001,r*.65,.01,p,mat,v);}}
 return {sleeve,lathe,clamp,hose,plate};
}
export const fuelDatum={tankSender:[0,.416,.35],filler:bodyPoint([-.795,.708,.93]),filter:[.235,.326,.63],canister:[-.55,.645,1.42]};
export function buildFuel(h){buildTank(h);buildSender(h);h.mapAdded(()=>buildFiller(h),bodyPoint);buildPlumbing(h);buildVapor(h);}
function tankShape(scale=1){const sh=new T.Shape(),x=.142*scale,z0=-.80,z1=.63,r=.037;sh.moveTo(-x+r,-z0);sh.lineTo(x-r,-z0);sh.quadraticCurveTo(x,-z0,x,-z0-r);sh.lineTo(x,-z1+r);sh.quadraticCurveTo(x,-z1,x-r,-z1);sh.lineTo(-x+r,-z1);sh.quadraticCurveTo(-x,-z1,-x,-z1+r);sh.lineTo(-x,-z0-r);sh.quadraticCurveTo(-x,-z0,-x+r,-z0);return sh;}
const tankTop=z=>.286+.130*T.MathUtils.smoothstep(z,-.17,.14);
function buildTank(h){
 const {add,surface,tube,box,cyl,bolt}=h,{sleeve}=fuelTools(h),outline=tankShape().getPoints(96).map(v=>[v.x,-v.y]);
 for(const upper of [true,false]){
  const id='fu-tank-'+(upper?'upper':'lower'),sh=tankShape(.985);if(upper){const hole=new T.Path();hole.absarc(0,-.35,.052,0,Math.PI*2,true);sh.holes.push(hole);}
  // Subdivide the planar skin before bending its crown. A single long
  // triangulation across the step produces spurious diagonal creases.
  const flat=new T.ShapeGeometry(sh,48).toNonIndexed(),raw=flat.attributes.position,vertices=[];
  function split(a,b,c){
   const ab=a.distanceToSquared(b),bc=b.distanceToSquared(c),ca=c.distanceToSquared(a);
   if(Math.max(ab,bc,ca)<.035**2){vertices.push(...a.toArray(),...b.toArray(),...c.toArray());return;}
   if(ab>=bc&&ab>=ca){const m=a.clone().add(b).multiplyScalar(.5);split(a,m,c);split(m,b,c);}
   else if(bc>=ca){const m=b.clone().add(c).multiplyScalar(.5);split(a,b,m);split(a,m,c);}
   else{const m=c.clone().add(a).multiplyScalar(.5);split(a,b,m);split(m,b,c);}
  }
  for(let n=0;n<raw.count;n+=3)split(new T.Vector3().fromBufferAttribute(raw,n),new T.Vector3().fromBufferAttribute(raw,n+1),new T.Vector3().fromBufferAttribute(raw,n+2));
  flat.dispose();let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g=mergeVertices(g,1e-6);const uv=[];for(let n=0;n<g.attributes.position.count;n++)uv.push((g.attributes.position.getX(n)+.15)/.30,(g.attributes.position.getY(n)+.63)/1.43);g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.rotateX(-Math.PI/2);
  const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),z=a.getZ(i),crown=.006*(1-(x/.145)**2);a.setY(i,upper?tankTop(z)+crown:.165-crown);}g.computeVertexNormals();const skin=add(id,g,'metal');skin.material.side=T.DoubleSide;
  for(let n=0;n<outline.length-1;n++){const a=outline[n],b=outline[n+1];surface(id,Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.018)),10,(u,v)=>{const x=T.MathUtils.lerp(a[0],b[0],u),z=T.MathUtils.lerp(a[1],b[1],u),target=upper?tankTop(z):.167;return[x*(1-.023*Math.sin(v*Math.PI)),T.MathUtils.lerp(.220,target,v),z];},'metal');}
  const seam=outline.map(([x,z])=>[x*1.035,upper?.221:.218,z]);tube(id,seam,.003,'zinc');
 }
 // Pressed crown beads stop clear of the actual sender aperture.
 for(const z of [-.62,-.38,.13,.56])for(const dx of [-.065,.065])tube('fu-tank-upper',[[dx-.037,tankTop(z)+.005,z],[dx,tankTop(z)+.008,z],[dx+.037,tankTop(z)+.005,z]],.0025,'metal');
 sleeve('fu-tank-upper',.059,.052,.005,[0,.421,.35],'zinc');for(let i=0;i<3;i++){const a=i*Math.PI*2/3;box('fu-tank-upper',[.014,.004,.008],[Math.cos(a)*.057,.426,.35+Math.sin(a)*.057],'metal',[0,-a,0],{},.001);}
 for(const [name,z] of [['front',-.51],['rear',.38]]){
  const route=[[-.17,.243,z],[-.154,.18,z],[-.130,.151,z],[.130,.151,z],[.154,.18,z],[.17,.243,z]];
  const curve=new T.CatmullRomCurve3(route.map(p=>new T.Vector3(...p)));surface('fu-tank-'+name+'-strap',60,4,(u,v)=>{const p=curve.getPoint(u);return[p.x,p.y,p.z+(v-.5)*.036];},'dark');
  for(const x of [-.167,.167]){box('fu-tank-'+name+'-strap',[.025,.003,.042],[x,.244,z],'dark');cyl('fu-tank-strap-bolts',.004,.055,[x,.228,z],'zinc',[0,0,0]);box('fu-tank-strap-bolts',[.022,.004,.006],[x,.255,z],'zinc');bolt('fu-tank-strap-nuts',[x,.211,z],.007);}
 }
 for(const z of [-.60,-.12,.18,.53])box('fu-tank-top-pads',[.095,.004,.058],[0,tankTop(z)+.009,z],'rubber',[],{},.002);
 for(const s of [-1,1])for(const z of [-.53,.36])box('fu-tank-side-pads',[.006,.048,.042],[s*.150,.230,z],'rubber',[],{},.002);
 surface('fu-tank-reinforcement',28,10,(u,v)=>{const x=(u-.5)*.43,z=-.20+(v-.5)*.14;return[x,.145+.015*(Math.abs(x)/.215)**5+.005*Math.cos(v*Math.PI*4)**8,z];},'dark');for(const x of [-.204,.204])bolt('fu-tank-reinforcement-bolts',[x,.151,-.20],.008);
}
function buildSender(h){
 const {box,cyl,tube,ring,bolt}=h,{sleeve,lathe}=fuelTools(h),id=k=>'fu-sender-'+k,z=.35;
 cyl(id('plate'),.050,.003,[0,.427,z],'zinc',[0,0,0]);sleeve(id('gasket'),.054,.046,.003,[0,.424,z],'rubber');sleeve(id('lock-ring'),.059,.043,.002,[0,.431,z],'zinc');
 for(let n=0;n<3;n++){const a=n*Math.PI*2/3;box(id('lock-ring'),[.018,.008,.007],[Math.cos(a)*.054,.435,z+Math.sin(a)*.054],'zinc',[0,-a,0],{},.001);}
 for(const [x,r,endX,endZ] of [[-.018,.00476,-.015,.54],[.015,.00397,.015,.54],[.032,.0032,.035,.52]])tube(id('plate'),[[x,x<0?.384:.225,z],[x,.385,z],[x,.443,z+.005],[endX,.455,z+.05],[endX,.455,endZ]],r,'zinc');
 // Sender support and lower pump saddle, with the motor can a separate part.
 box(id('plate'),[.012,.181,.003],[.022,.311,z-.018],'zinc');sleeve(id('plate'),.023,.0185,.009,[-.018,.218,z],'zinc');tube(id('plate'),[[.022,.23,z-.018],[.022,.212,z],[-.018,.212,z]],.003,'zinc');
 lathe(id('separator'),[[-.024,.025],[-.023,.039],[.004,.041],[.006,.039],[-.020,.036],[-.021,.025],[-.024,.025]],[0,.417,z],'reservoir');
 lathe(id('pump'),[[-.054,.009],[-.05,.017],[-.044,.018],[.036,.018],[.044,.014],[.050,.006],[.057,.006],[.057,.003],[-.054,.003],[-.054,.009]],[-.018,.277,z],'zinc');
 for(const y of [.235,.311])sleeve(id('pump'),.0185,.0175,.004,[-.018,y,z],'metal');cyl(id('pump'),.003,.008,[-.026,.327,z],'gold',[0,0,0]);cyl(id('pump'),.003,.008,[-.010,.327,z],'gold',[0,0,0]);
 sleeve(id('coupler'),.010,.005,.052,[-.018,.36,z],'rubber');sleeve(id('pump-pad'),.024,.012,.013,[-.018,.218,z],'rubber');
 box(id('strainer'),[.119,.011,.045],[.024,.197,z],'interior',[],{},.005);sleeve(id('strainer'),.012,.006,.014,[-.018,.207,z],'pickupPlastic');tube(id('strainer'),[[-.035,.198,z-.022],[.082,.198,z-.022],[.084,.198,z+.022],[-.035,.198,z+.022],[-.035,.198,z-.022]],.0014,'pickupPlastic');
 cyl(id('level-body'),.024,.014,[.025,.286,z-.005],'pickupPlastic');box(id('level-body'),[.012,.033,.043],[.026,.287,z],'pickupPlastic',[],{},.003);cyl(id('level-body'),.004,.019,[.025,.286,z-.005],'zinc');
 tube(id('float-arm'),[[.037,.286,z-.005],[.055,.286,z-.005],[.065,.300,z-.025],[.057,.316,z-.105],[.057,.327,z-.135]],.0014,'zinc');lathe(id('float'),[[-.029,0],[-.028,.011],[-.025,.017],[-.022,.019],[.022,.019],[.025,.017],[.028,.011],[.029,0]], [.057,.327,z-.135],'gold',[1,0,0]);
 for(const [x,material] of [[-.026,'wireWhite'],[-.010,'wire']])tube(id('wires'),[[x,.331,z],[x-.007,.374,z-.020],[x-.007,.424,z-.020],[x,.438,z-.023]],.0012,material);box(id('plate'),[.026,.009,.019],[-.01,.436,z-.020],'phenolic',[],{},.002);
}
function buildFiller(h){
 const {surface,tube,box,cyl,bolt}=h,{sleeve,lathe,clamp,hose}=fuelTools(h),id=k=>'fu-filler-'+k;
 const neck=[[.776,.708,.93],[.744,.685,.925],[.67,.572,.90],[.48,.489,.81],[.28,.429,.69],[.18,.415,.64]];
 hose(id('neck'),neck,.024,'metal');hose(id('neck'),neck.map(p=>[p[0]-.018,p[1]+.025,p[2]-.018]),.0065,'metal');
 sleeve(id('neck'),.034,.022,.023,[.776,.708,.93],'zinc',[1,0,0]);
 lathe(id('cap'),[[-.025,.021],[-.006,.022],[0,.034],[.007,.035],[.016,.026],[.020,.020],[.020,0],[-.025,0],[-.025,.021]],[.788,.708,.93],'plastic',[1,0,0]);box(id('cap'),[.018,.014,.052],[.814,.708,.93],'plastic',[],{},.007);
 sleeve(id('seal'),.028,.021,.003,[.791,.708,.93],'rubber',[1,0,0]);sleeve(id('insulator'),.048,.025,.011,[.750,.705,.93],'rubber',[1,0,0]);sleeve(id('plate'),.055,.039,.002,[.744,.705,.93],'zinc',[1,0,0]);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bolt(id('plate'),[.742,.705+Math.cos(a)*.048,.93+Math.sin(a)*.048],.004,'x');}
 hose(id('hose'),[[.18,.415,.64],[.12,.403,.638],[.07,.393,.637]],.025);hose(id('vent-hose'),[[.16,.440,.622],[.105,.432,.625],[.04,.429,.634]],.0075);
 for(const [p,r] of [[[.173,.412,.64],.025],[[.072,.393,.638],.025],[[.155,.439,.623],.0075],[[.046,.429,.633],.0075]])clamp(id('clamps'),p,r,[1,0,0]);
 tube(id('ground'),[[.69,.587,.90],[.67,.62,.87],[.70,.66,.87]],.0018,'metal');sleeve(id('ground'),.005,.0025,.001,[.70,.66,.87],'zinc',[1,0,0]);
}
const routes={
 feed:[[-.015,.455,.54],[-.10,.419,.60],[-.20,.32,.565]],return:[[.015,.455,.54],[-.09,.414,.57],[-.16,.32,.62],[-.20,.34,.70]],
 'feed-hose':[[-.235,.326,.680],[-.28,.37,.73],[-.30,.48,.75],[-.34,.49,.89],engineToVehicle([-.23,1.30-upperEngineDrop,-.085])],
 'return-hose':[[-.20,.34,.70],[-.23,.41,.76],[-.33,.48,.87],engineToVehicle([-.23,1.30-upperEngineDrop,-.108])],
};
export const fuelRoutes=Object.fromEntries(Object.entries(routes).map(([k,p])=>[k,p.map(([x,y,z])=>[-x,y,z])]));
function buildPlumbing(h){
 const {box,cyl,tube,bolt}=h,{hose,clamp,sleeve,lathe,plate}=fuelTools(h),id=k=>'fu-line-'+k;
 for(const [key,p] of Object.entries(routes))hose(id(key),p,key.startsWith('feed')?.00476:.00397,key.endsWith('hose')?'rubber':'metal');
 for(const [p,r] of [[[[-.20,.32,.565],[-.235,.326,.585]],.00476],[[[-.20,.34,.70],[-.21,.36,.72]],.00397]]){hose(id('couplers'),p,r+.002);for(const point of p)clamp(id('clamps'),point,r+.002,[0,0,1]);}
 const pos=[-.235,.326,.63];lathe(id('filter'),[[-.051,.005],[-.043,.012],[-.039,.024],[-.035,.026],[.035,.026],[.039,.024],[.043,.012],[.051,.005],[.051,.003],[-.051,.003],[-.051,.005]],pos,'zinc',[0,0,1]);
 for(const z of [.594,.666])sleeve(id('filter'),.0267,.025,.003,[-.235,.326,z],'metal',[0,0,1]);for(const z of [.579,.681]){sleeve(id('seals'),.0058,.0035,.0015,[-.235,.326,z],'rubber',[0,0,1]);h.add(id('filter'),new T.CylinderGeometry(.010,.010,.011,6),'zinc',[-.235,.326,z],[Math.PI/2,0,0]);}
 sleeve(id('filter-bracket'),.028,.026,.027,pos,'dark',[0,0,1]);box(id('filter-bracket'),[.04,.003,.068],[-.254,.300,.63],'dark',[],{},.002);for(const z of [.607,.653])bolt(id('fasteners'),[-.264,.306,z],.004);
 for(const p of [[-.105,.416,.60],[-.153,.32,.62],[-.284,.39,.744],[-.225,.62,.94]]){clamp(id('pipe-clips'),p,.006,[0,1,0]);box(id('pipe-clips'),[.025,.004,.012],[p[0]+.012,p[1],p[2]],'zinc');bolt(id('fasteners'),[p[0]+.023,p[1]+.003,p[2]],.003);}
 plate(id('shield'),[[.28,.59],[.39,.59],[.41,.64],[.35,.71],[.28,.71]],[[.30,.61,.004]],.002,-.293,'zinc');
}
function buildVapor(h){
 const {box,cyl,tube,ring,bolt}=h,{sleeve,lathe,clamp,hose}=fuelTools(h),id=k=>'fu-vapor-'+k,x=.55,y=.645,z=1.42;
 lathe(id('canister'),[[-.065,.049],[-.06,.054],[.067,.054],[.073,.050],[.077,.019],[.077,0],[.072,0],[.070,.047],[-.065,.047],[-.065,.049]],[x,y,z],'plastic');
 for(const dy of [-.052,.060])sleeve(id('canister'),.055,.051,.004,[x,y+dy,z],'plastic');for(const dz of [-.022,0,.022]){cyl(id('canister'),.007,.025,[x,y+.079,z+dz],'plastic',[0,0,0]);cyl(id('canister'),.0027,.001,[x,y+.092,z+dz],'dark',[0,0,0]);}
 cyl(id('filter'),.047,.008,[x,y-.066,z],'interior',[0,0,0]);sleeve(id('bracket'),.058,.055,.031,[x,y-.012,z],'dark');box(id('bracket'),[.035,.044,.010],[x+.062,y-.012,z],'dark',[],{},.003);for(const dy of [-.015,.015])bolt(id('bracket'),[x+.063,y+dy,z+.007],.004,'z');
 const vapor=[[.035,.455,.52],[.17,.435,.60],[.40,.46,.61],[.53,.52,.84],[.55,.54,1.21],[x,.60,z+.08]];
 // The early car has no later auxiliary vapor expansion tank.
 vapor[vapor.length-1]=[x,.60,z+.08];hose(id('vapor-pipe'),vapor,.00318,'metal');hose(id('vapor-hose'),[[x,.60,z+.08],[x+.05,.68,z+.08],[x,.737,z+.022]],.0045);
 hose(id('purge'),[[x,.737,z],[.48,.76,1.37],[.27,.76,1.23],[.12,.84,1.20]],.005);hose(id('purge'),[[x,.737,z-.022],[.46,.77,1.34],[.25,.775,1.20],[.13,.843,1.18]],.0028);
 for(const p of [[.40,.46,.61],[.53,.52,.84],[.55,.54,1.21],[x,.728,z+.022]])clamp(id('clips'),p,.004,[0,1,0]);
 const rp=[.49,.63,.615];box(id('relay'),[.034,.041,.030],rp,'plastic',[],{},.004);box(id('relay'),[.038,.004,.034],[rp[0],rp[1]+.019,rp[2]],'plastic');box(id('relay-bracket'),[.058,.069,.003],[rp[0],rp[1],rp[2]-.020],'zinc',[],{},.002);for(const dx of [-.022,.022])bolt(id('relay-bracket'),[rp[0]+dx,rp[1]+.025,rp[2]-.017],.003,'z');box(id('relay-connector'),[.029,.017,.025],[rp[0],rp[1]-.027,rp[2]],'plastic',[],{},.003);
 for(let i=0;i<4;i++)tube(id('relay-connector'),[[rp[0]-.009+i*.006,rp[1]-.034,rp[2]],[rp[0]-.009+i*.006,rp[1]-.076,rp[2]+.01],[rp[0]-.04,rp[1]-.096,rp[2]+.05]],.0012,i%2?'wire':'wireWhite');
}
