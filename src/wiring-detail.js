import {buildInstruments,instrumentMaterials} from './instrument-detail.js';
import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {electricalTools,bakeElectrical} from './electrical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {wiringParts,fusePositions} from './wiring-catalog.js';
export const wiringDatums={fuses:[.53,.531,-.473],ecm:[0,.539,.457],junction:[-.653,.658,.943],turn:[.45,.596,-.438],convenience:[-.36,.529,-.480]};
function materials(base=createMaterials()){
 const m=instrumentMaterials(base);for(const [amps,color]of[[5,'#a88752'],[10,'#bc302a'],[20,'#d8b731'],[25,'#dadbd1']])m['fuse'+amps]=new T.MeshPhysicalMaterial({color,roughness:.24,transmission:.26,thickness:.0015,transparent:true,opacity:.78});
 m.pcb=new T.MeshStandardMaterial({color:'#796e42',roughness:.66});return m;
}
function makeGroups(){const root=new T.Group(),groups=new Map();for(const p of wiringParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'electrical',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3()};groups.set(p.id,g);root.add(g);}return{root,groups};}
export function createWiringDetail(){const model=makeGroups(),h=geometryTools(model.groups,materials());buildWiring(h,model.groups);h.optimize();correctLegacyHandedness(model.groups);return model;}
export function buildVehicleWiring(groups,mats){const model=makeGroups(),h=geometryTools(model.groups,materials(mats));buildWiring(h,model.groups);h.optimize();for(const p of wiringParts){const owner={'wiring-cluster':'instrument-cluster','wiring-fuses':'fuse-panel','wiring-ecm':'ecm','wiring-junction':'power-junction','wiring-flashers':'flashers'}[p.section];for(const m of [...model.groups.get(p.id).children]){m.userData.partId=owner;groups.get(owner).add(m);}}}
function buildWiring(h,groups){buildFuses(h,groups);buildEcm(h,groups);buildJunction(h,groups);buildFlashers(h,groups);buildInstruments(h,groups);}
function buildFuses(h,groups){
 const {add,box,cyl,tube,label}=h,{rounded,plate,frame,sleeve,screw}=electricalTools(h),id=k=>'wr-'+k;
 const positions=fusePositions.map(f=>({...f,x:(f.col-1.5)*.030,y:.051-f.row*.023}));
 const outline=rounded(.128,.140,.006);
 for(const f of positions){
  const path=new T.Path(rounded(.024,.010,.001).getPoints(12).map(p=>new T.Vector2(p.x+f.x,p.y+f.y)));outline.holes.push(path);
 }
 for(const [x,y]of[[-.053,-.018],[.027,-.018],[-.053,-.044],[-.038,-.044],[.014,-.044],[.028,-.044]])outline.holes.push(new T.Path(rounded(.010,.013,.001).getPoints(8).map(p=>new T.Vector2(p.x+x,p.y+y))));
 const geo=new T.ExtrudeGeometry(outline,{depth:.009,bevelEnabled:true,bevelSize:.0005,bevelThickness:.0005,bevelSegments:2,curveSegments:12});geo.translate(0,0,-.012);add(id('fuse-carrier'),geo,'plastic');
 frame(id('fuse-carrier'),.135,.147,.003,.022,[0,0,-.012],'plastic',.005);
 for(const f of positions){
  const k=id('fuse-'+f.number),p=[f.x,f.y,.004];
  frame(id('fuse-carrier'),.027,.015,.0014,.012,[f.x,f.y,-.005],'plastic',.002);
  // The panel face is +Z; blade insertion is along -Z.
  if(f.breaker){box(k,[.024,.010,.020],[f.x,f.y,.007],'zinc',[],{},.002);label(k,'30',[.017,.007],[f.x,f.y,.0176],[0,0,0],{background:'transparent',foreground:'#262e32',font:'bold 48px Arial'});}
  else{
   box(k,[.019,.006,.015],[f.x,f.y,.004],'fuse'+f.amps,[],{},.001);box(k,[.021,.008,.004],[f.x,f.y,.013],'fuse'+f.amps,[],{},.001);
   label(k,String(f.amps),[.009,.0045],[f.x,f.y,.0152],[0,0,0],{background:'transparent',foreground:'#202628',font:'bold 52px Arial'});
   tube(k,[[f.x-.006,f.y,.005],[f.x-.003,f.y,.005],[f.x-.001,f.y,.000],[f.x+.001,f.y,.000],[f.x+.003,f.y,.005],[f.x+.006,f.y,.005]],.0004,'zinc');
  }
  for(const dx of[-.006,.006]){
   const blade=new T.Shape();blade.moveTo(-.0028,-.018);blade.lineTo(.0028,-.018);blade.lineTo(.0028,.009);blade.lineTo(-.0028,.009);blade.closePath();const g=new T.ExtrudeGeometry(blade,{depth:.0007,bevelEnabled:false});g.rotateX(Math.PI/2);add(k,g,'zinc',[f.x+dx,f.y,0]);
   if(!f.breaker)box(k,[.003,.003,.001],[f.x+dx,f.y,.0152],'zinc');
   const socket=frame(id('fuse-contacts'),.008,.004,.001,.012,[f.x+dx,f.y,-.018],'copper',.001);
  }
  label(id('fuse-carrier'),f.label,[.025,.0045],[f.x,f.y-.009,-.0018],[0,0,0],{background:'transparent',foreground:'#ddd5ba',font:'bold 48px Arial'});
 }
 // Hinge support, inward release tabs, empty five-position spare holder.
 for(const x of[-.070,.070]){plate(id('fuse-bracket'),.019,.075,.003,[x,.030,-.034],'zinc',[[0,.025,.003]],.002);sleeve(id('fuse-bracket'),.005,.0025,.014,[x,.074,-.015],'zinc','x');screw(id('fuse-mounts'),[x,.055,-.031],.004,.016);}
 cyl(id('fuse-pivot'),.0025,.161,[0,.074,-.015],'zinc');
 for(const x of[-.072,.072]){box(id('fuse-latches'),[.025,.020,.003],[x,-.013,-.011],'plastic',[],{},.001);for(let i=0;i<4;i++)box(id('fuse-latches'),[.001,.018,.001],[x-.008+i*.005,-.013,-.009],'plastic');}
 box(id('fuse-spares'),[.145,.019,.013],[0,-.088,-.006],'plastic',[],{},.002);
 for(let i=0;i<5;i++){const x=(i-2)*.026;frame(id('fuse-spares'),.024,.010,.0015,.010,[x,-.088,.004],'plastic',.001);}
 for(const [x,y,w,ht]of[[-.028,.036,.063,.026],[.038,.025,.043,.043],[-.035,-.032,.050,.044]])frame(id('fuse-rear-plugs'),w,ht,.004,.024,[x,y,-.032],'plastic',.003);
 const p=wiringDatums.fuses,k=Math.SQRT1_2;bakeElectrical(groups,wiringParts.filter(p=>p.section==='wiring-fuses').map(p=>p.id),(x,y,z)=>[p[0]+x,p[1]+y*k-z*k,p[2]+y*k+z*k]);
}
function buildEcm(h,groups){
 const {add,box,cyl,tube,label,bolt}=h,{rounded,plate,frame,sleeve,screw}=electricalTools(h),id=k=>'wr-'+k;
 // Horizontal authoring frame. Installation transform turns the case upright
 // in the console, with connector plugs leaving its lower end.
 plate(id('ecm-base'),.175,.219,.002,[0,0,-.017],'zinc',[],.005);frame(id('ecm-base'),.180,.224,.002,.033,[0,0,0],'zinc',.006);
 // Leave an open connector edge rather than closing plugs into a solid box.
 // The side-wall mesh above is replaced by three separate folded returns.
 const g=groups.get(id('ecm-base'));const last=g.children.at(-1);g.remove(last);last.geometry.dispose();last.material.dispose();
 for(const x of[-.089,.089])box(id('ecm-base'),[.002,.222,.034],[x,0,0],'zinc');box(id('ecm-base'),[.177,.002,.034],[0,.110,0],'zinc');
 const sh=rounded(.179,.223,.004);sh.holes.push(new T.Path(rounded(.106,.041,.002).getPoints(12).map(p=>new T.Vector2(p.x,p.y+.041))));const geo=new T.ExtrudeGeometry(sh,{depth:.0015,bevelEnabled:false,curveSegments:12});add(id('ecm-lid'),geo,'zinc',[0,0,.017]);
 plate(id('ecm-cover'),.117,.049,.0015,[0,.041,.020],'zinc',[[-.052,0,.002],[.052,0,.002]],.002);for(const x of[-.052,.052])screw(id('ecm-screws'),[x,.041,.022],.003,.009);
 for(const x of[-.082,.082])for(const y of[-.088,.088])screw(id('ecm-screws'),[x,y,.019],.003,.025);
 box(id('ecm-board'),[.162,.198,.0016],[0,0,-.006],'pcb',[],{},.001);
 for(const [key,x,w,n]of[['ecm-prom',.022,.059,12],['ecm-calpak',-.039,.023,4]]){
  frame(id(key),w+.006,.020,.002,.006,[x,.041,.006],'pickupPlastic',.001);box(id(key),[w,.014,.004],[x,.041,.006],'phenolic',[],{},.001);
  for(const s of[-1,1])for(let i=0;i<n;i++)box(id(key),[.0012,.007,.0005],[x-w*.43+i*w*.86/(n-1),.041+s*.010,.003],'zinc');
  frame(id('ecm-sockets'),w+.004,.022,.003,.004,[x,.041,-.001],'plastic',.001);
 }
 const header=(key,x,cols,rows,pitch=.0045)=>{
  const w=(cols+1)*pitch,y=-.088;frame(id(key),w,.017,.002,.019,[x,y,.001],'plastic',.002);
  for(let row=0;row<2;row++)for(let i=0;i<cols;i++){const xx=x+(i-(cols-1)/2)*pitch,yy=y+(row-.5)*.005;frame(id(key),.0038,.0043,.00065,.011,[xx,yy,.004],'plastic',.0006);}
  label(id(key),rows,[w*.73,.005],[x,y+.012,.011],[0,0,0],{background:'transparent',foreground:'#dfdcc8',font:'bold 40px Arial'});
 };
 header('ecm-header-ab',.045,12,'A / B');header('ecm-header-cd',-.034,16,'C / D');
 for(const [key,x,n,tag]of[['ecm-plug-ab',.045,12,'C509'],['ecm-plug-cd',-.034,16,'C510']]){
  const w=(n+1)*.0045;frame(id(key),w,.019,.002,.023,[x,-.112,.001],'plastic',.002);
  for(let row=0;row<2;row++)for(let i=0;i<n;i++)frame(id(key),.0038,.0043,.0006,.010,[x+(i-(n-1)/2)*.0045,-.112+(row-.5)*.005,.005],'plastic',.0005);
  box(id(key),[w*.40,.010,.002],[x,-.112,.015],'plastic',[],{},.001);label(id(key),tag,[w*.66,.005],[x,-.112,.0161],[0,0,0],{background:'transparent',foreground:'#c5bd9a',font:'bold 44px Arial'});
 }
 frame(id('ecm-mount'),.202,.242,.014,.004,[0,0,-.024],'frame',.008);for(const x of[-.094,.094])for(const y of[-.10,.10]){sleeve(id('ecm-mount'),.007,.003,.004,[x,y,-.025],'zinc');screw(id('ecm-mount-bolts'),[x,y,-.027],.004,.013,'z',1);}
 // Both connectors leave the open lower edge of the case, in the board
 // plane. Rotate their cavity axes to that edge before installing the ECM.
 for(const key of ['ecm-header-ab','ecm-header-cd'])bakeElectrical(groups,[id(key)],(x,y,z)=>[x,-.104-z,y+.088]);
 for(const key of ['ecm-plug-ab','ecm-plug-cd'])bakeElectrical(groups,[id(key)],(x,y,z)=>[x,-.128-z,y+.112]);
 const p=wiringDatums.ecm;bakeElectrical(groups,wiringParts.filter(p=>p.section==='wiring-ecm').map(p=>p.id),(x,y,z)=>[p[0]-x,p[1]+y,p[2]-z]);
}
function buildJunction(h,groups){
 const {box,tube,cyl,bolt}=h,{plate,sleeve,screw}=electricalTools(h),id=k=>'wr-'+k,[x,y,z]=wiringDatums.junction;
 box(id('junction-base'),[.076,.029,.019],[x,y,z],'plastic',[],{},.003);
 for(const dx of[-.024,.024]){sleeve(id('junction-base'),.010,.004,.005,[x+dx,y,z+.010],'plastic');cyl(id('junction-studs'),.0035,.023,[x+dx,y,z+.013],'copper',[Math.PI/2,0,0]);bolt(id('junction-studs'),[x+dx,y,z+.023],.006,'z');sleeve(id('junction-leads'),.008,.004,.0015,[x+dx,y,z+.019],'zinc');tube(id('junction-leads'),[[x+dx,y,z+.020],[x+dx,y-.07,z+.055],[x+.12+dx,y-.12,z+.09]],.003,'wirePink');}
 plate(id('junction-mount'),.090,.044,.002,[x,y,z-.012],'zinc',[[-.04,0,.0025],[.04,0,.0025]],.003);for(const dx of[-.04,.04])screw(id('junction-mount'),[x+dx,y,z-.013],.004,.014,'z',1);
 for(const [key,p]of[['ground-body',[-.655,.60,.83]],['ground-engine',[-.16,.612,1.07]]]){for(let i=0;i<2;i++){sleeve(id(key),.008,.004,.001,[p[0],p[1]+i*.0015,p[2]],'zinc','y');tube(id(key),[[p[0]-.007,p[1],p[2]],[p[0]-.04,p[1]-.02+i*.008,p[2]+.03]],.0017,'wire');}bolt(id(key),[p[0],p[1]+.004,p[2]],.006);}
}
function buildFlashers(h,groups){
 const {box,tube,cyl,label}=h,{frame,sleeve}=electricalTools(h),id=k=>'wr-'+k;
 for(const [key,origin]of[['turn-flasher',wiringDatums.turn],['hazard-flasher',wiringDatums.convenience]]){
  const [x,y,z]=origin;cyl(id(key),.016,.029,[x,y,z],'zinc',[0,0,0]);sleeve(id(key),.0168,.015,.003,[x,y-.013,z],'zinc','y');cyl(id(key),.015,.002,[x,y-.015,z],'phenolic',[0,0,0]);for(const s of[-1,1])box(id(key),[.006,.009,.0008],[x+s*.006,y-.020,z],'zinc');
 }
 const [x,y,z]=wiringDatums.turn;sleeve(id('turn-flasher-clip'),.018,.0168,.017,[x,y,z],'zinc','y');box(id('turn-flasher-clip'),[.016,.002,.030],[x,y,z-.023],'zinc');box(id('turn-flasher-plug'),[.028,.014,.015],[x,y-.025,z],'plastic',[],{},.002);for(const dx of[-.006,.006])tube(id('turn-flasher-plug'),[[x+dx,y-.031,z],[x+dx,y-.055,z-.025],[x+.030,y-.058,z-.030]],.0017,'wire');
 const [cx,cy,cz]=wiringDatums.convenience;frame(id('convenience-base'),.11,.040,.006,.008,[cx+.02,cy-.029,cz],'plastic',.004);
 box(id('horn-relay'),[.027,.031,.024],[cx+.053,cy,cz],'dark',[],{},.003);for(const dx of[-.007,0,.007])box(id('horn-relay'),[.004,.009,.0008],[cx+.053+dx,cy-.020,cz],'zinc');
 for(const dx of[0,.053]){box(id('convenience-plugs'),[.025,.015,.019],[cx+dx,cy-.031,cz],'plastic',[],{},.002);for(const dz of[-.005,.005])tube(id('convenience-plugs'),[[cx+dx,cy-.038,cz+dz],[cx+dx,cy-.048,cz-.03],[cx+.02,cy-.055,cz-.04]],.0017,'wire');}
}
