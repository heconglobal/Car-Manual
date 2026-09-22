import {lampNominal,mvma1985} from './factory-specifications.js';
import {headlightPose,headlightLinkPose} from './headlight-kinematics.js';
export {headlightPose} from './headlight-kinematics.js';
import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {headlightParts,headlightSections} from './headlight-catalog.js';

export function headlightHoodPoint(u,v){const a=u*2-1;return[a*.659,.625+.193*v+.013*(1-a*a)+.019*Math.sin(v*Math.PI)+.007*Math.exp(-(((Math.abs(a*.659)-.42)/.055)**2))*Math.sin(v*Math.PI),-1.786+1.176*v];}
export function headlightMaterials(base=createMaterials()){
 const m={...base};for(const k of ['plastic','dark','metal','rubber','phenolic']){m[k]=base[k].clone();m[k].bumpScale=.000025;}m.plastic.roughness=.45;m.dark.roughness=.39;
 m.wireRed=new T.MeshStandardMaterial({color:'#9b352c',roughness:.68});m.wireBlue=new T.MeshStandardMaterial({color:'#345784',roughness:.68});m.headlightNylon=new T.MeshStandardMaterial({color:'#c9c4a0',roughness:.48});m.headlightCushion=new T.MeshStandardMaterial({color:'#709765',roughness:.68});return m;
}
export function createHeadlightDetail(){const root=new T.Group(),groups=new Map();for(const p of headlightParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'electrical',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(headlightSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,headlightMaterials());buildHeadlights(h,groups);h.optimize();correctLegacyHandedness(groups);return{root,groups};}
export function buildVehicleHeadlights(groups,materials){const detail=new Map(headlightParts.map(p=>[p.id,new T.Group()])),h=geometryTools(detail,headlightMaterials(materials));buildHeadlights(h,detail);h.optimize();for(const p of headlightParts){const owner=p.section==='headlight-controls'?'lighting-controls':'headlights';for(const mesh of [...detail.get(p.id).children]){mesh.userData.partId=owner;groups.get(owner).add(mesh);}}}
function lampTools(h){
 const {add,tube,cyl,box}=h;
 function path(points,Shape=T.Shape){const sh=new Shape();for(let i=0;i<points.length;i++){const p=points[i],prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];const a=p.map((n,k)=>n+(prev[k]-n)*.12),b=p.map((n,k)=>n+(next[k]-n)*.12);if(!i)sh.moveTo(...a);else sh.lineTo(...a);sh.quadraticCurveTo(...p,...b);}sh.closePath();return sh;}
 function plate(id,points,holes,depth,pos=[0,0,0],mat='dark',axis='z'){
  const sh=path(points);for(const hole of holes){if(hole.length===3){const p=new T.Path();p.absarc(...hole,0,Math.PI*2,true);sh.holes.push(p);}else sh.holes.push(path(hole,T.Path));}
  const geo=new T.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelSize:.00055,bevelThickness:.0004,bevelSegments:2,curveSegments:24});geo.translate(0,0,-depth/2);if(axis==='x')geo.rotateY(Math.PI/2);if(axis==='y')geo.rotateX(Math.PI/2);return add(id,geo,mat,pos);
 }
 function sleeve(id,r,b,d,p,mat='metal',axis='x'){const sh=new T.Shape();sh.absarc(0,0,r,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,b,0,Math.PI*2,true);sh.holes.push(hole);const geo=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false,curveSegments:40});geo.translate(0,0,-d/2);if(axis==='x')geo.rotateY(Math.PI/2);if(axis==='y')geo.rotateX(Math.PI/2);return add(id,geo,mat,p);}
 function frame(id,w,ht,wall,d,p,mat='zinc'){const outer=[[-w/2,-ht/2],[w/2,-ht/2],[w/2,ht/2],[-w/2,ht/2]],inner=[[-w/2+wall,-ht/2+wall],[w/2-wall,-ht/2+wall],[w/2-wall,ht/2-wall],[-w/2+wall,ht/2-wall]];return plate(id,outer,[inner],d,p,mat);}
 function screw(id,p,r=.003,axis='z',cross=true){const rot=axis==='z'?[Math.PI/2,0,0]:axis==='x'?[0,0,Math.PI/2]:[0,0,0];cyl(id,r,.0018,p,'zinc',rot);const v=axis==='z'?2:axis==='x'?0:1,head=[...p];head[v]-=.001;for(let i=0;i<(cross?2:1);i++){const size=axis==='z'?[r*1.4,.0006,.0003]:axis==='x'?[.0003,.0006,r*1.4]:[r*1.4,.0003,.0006];if(i){const a=axis==='z'?0:axis==='x'?2:0,b=axis==='y'?2:1;[size[a],size[b]]=[size[b],size[a]];}box(id,size,head,'dark');}}
 function rod(id,a,b,width=.014,thickness=.003,mat='zinc'){const v=new T.Vector3(...b).sub(new T.Vector3(...a)),geo=new T.BoxGeometry(thickness,v.length(),width);geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize()));add(id,geo,mat,a.map((n,i)=>(n+b[i])/2));for(const p of[a,b])sleeve(id,width*.55,width*.20,thickness+.001,p,mat);}
 return{plate,sleeve,frame,screw,rod};
}
const signedPower=(n,p)=>Math.sign(n)*Math.abs(n)**p;
const outline=(a,w,h)=>[w/2*signedPower(Math.cos(a),1/3),h/2*signedPower(Math.sin(a),1/3)];
export function buildHeadlights(h,groups){for(const [side,s]of [['left',1],['right',-1]]){buildLamp(h,side,s);lowerBucket(groups,side);buildDoor(h,groups,side,s);buildMotor(h,side,s);duplicateClosedBucket(groups,side);}buildRelays(h);buildControls(h);}
// Retain the sealed beam's upright aiming plane while lowering the whole
// bucket and its fixed pivot to the sourced bulb-center height. Do not squash
// the lamp or tilt its optical axis simply to reduce the pop-up silhouette.
function lowerBucket(groups,side){
 for(const p of headlightParts.filter(p=>p.section===`headlight-${side}-lamp`))for(const m of groups.get(p.id).children){m.updateMatrix();m.geometry.applyMatrix4(m.matrix);m.geometry.translate(0,lampNominal.bulbCenterHeight-.753,0);m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.set(1,1,1);}
}
function buildLamp(h,side,s){
 const {box,cyl,tube,surface,ring}=h,{plate,sleeve,frame,screw}=lampTools(h),{spring}=mechanicalTools(h),id=k=>'hl-'+side+'-'+k,x=s*lampNominal.bulbCenterOffset,cy=.753,z=-1.648;
 surface(id('upper-bezel'),96,8,(u,v)=>{const a=u*Math.PI*2,o=outline(a,.240,.194),n=outline(a,.204,.146);return[x+o[0]*(1-v)+n[0]*v,cy+o[1]*(1-v)+n[1]*v,z+.014*Math.sin(v*Math.PI)];},'plastic');
 for(const edge of[-1,1])surface(id('upper-bezel'),28,16,(u,v)=>{const bottom=.653+.061*u,top=.851*(1-u)+.714*u;return[x+edge*(.120-.005*u+.002*Math.sin(v*Math.PI)),bottom+(top-bottom)*v,z+.273*u];},'plastic');
 surface(id('lower-bezel'),24,8,(u,v)=>[x+(u-.5)*.235,.656+.058*v,z+.271*v],'plastic');tube(id('lower-bezel'),[[x-.116,.656,z],[x,.654,z],[x+.116,.656,z]],.0025,'plastic');
 surface(id('reflector'),96,22,(u,v)=>{const p=outline(u*Math.PI*2,.198,.140);return[x+p[0]*v,cy+p[1]*v,z+.018+.062*(1-v*v)];},'chrome');
 surface(id('lens'),96,20,(u,v)=>{const p=outline(u*Math.PI*2,.198,.140);return[x+p[0]*v,cy+p[1]*v,z-.004*(1-v*v)];},'headlampGlass');
 tube(id('lens'),Array.from({length:97},(_,i)=>{const p=outline(i/96*Math.PI*2,.198,.140);return[x+p[0],cy+p[1],z+.001];}),.0015,'headlampFlute');
 for(let i=-11;i<=11;i++){const dx=i*.0082,half=.066*Math.pow(1-Math.pow(Math.abs(dx)/.099,6),1/6);tube(id('lens'),Array.from({length:9},(_,j)=>{const dy=-half+j/8*half*2;return[x+dx,cy+dy,z-.004*(1-Math.max((dx/.099)**2,(dy/.070)**2))-.0005];}),.00065,'headlampFlute');}
 for(let i=-3;i<=3;i++)tube(id('lens'),[[x-.09,cy+i*.017,z-.001],[x,cy+i*.017,z-.0045],[x+.09,cy+i*.017,z-.001]],.0005,'headlampFlute');
 cyl(id('filaments'),.011,.018,[x,cy,z+.047],'alloy',[Math.PI/2,0,0],.008);cyl(id('filaments'),.005,.016,[x,cy,z+.070],'headlampGlass',[Math.PI/2,0,0]);for(const dy of[-.003,.003]){tube(id('filaments'),[[x-.007,cy+dy,z+.045],[x-.007,cy+dy,z+.064],[x-.003,cy+dy,z+.076]],.0006,'zinc');tube(id('filaments'),[[x+.007,cy+dy,z+.045],[x+.007,cy+dy,z+.064],[x+.003,cy+dy,z+.076]],.0006,'zinc');spring(id('filaments'),[x,cy+dy,z+.045],.0008,.014,'x',8,.00015,'metal');}
 cyl(id('terminals'),.018,.005,[x,cy,z+.081],'phenolic',[Math.PI/2,0,0]);for(const [dx,dy]of[[-.009,0],[.009,0],[0,.01]])box(id('terminals'),[.005,.001,.013],[x+dx,cy+dy,z+.09],'zinc');
 frame(id('socket'),.037,.030,.005,.023,[x,cy,z+.102],'plastic');for(const [i,dx]of[-.009,0,.009].entries())tube(id('socket'),[[x+dx,cy,z+.11],[x+dx,cy-.026,z+.134],[x-s*.070+dx,.687,-1.438]],.0017,i===0?'wire':i===1?'headlightCushion':'headlightNylon');
 for(const [key,w,ht,pz]of [['retaining-ring',.207,.149,z-.001],['mounting-ring',.208,.150,z+.025]]){surface(id(key),96,4,(u,v)=>{const a=u*Math.PI*2,o=outline(a,w,ht),n=outline(a,w-.007,ht-.007);return[x+o[0]*(1-v)+n[0]*v,cy+o[1]*(1-v)+n[1]*v,pz];},'zinc');tube(id(key),Array.from({length:97},(_,i)=>{const p=outline(i/96*Math.PI*2,w,ht);return[x+p[0],cy+p[1],pz+.002];}),.0016,'zinc');}
 for(const [dx,dy]of[[-.079,-.072],[.079,-.072],[-.079,.072],[.079,.072]]){box(id('retaining-ring'),[.014,.009,.002],[x+dx,cy+dy,z],'zinc');screw(id('ring-screws'),[x+dx,cy+dy,z-.0025]);}
 for(const [dx,dy]of[[.030,.089],[-s*.111,0]]){
  plate(id('mounting-ring'),[[-.01,-.011],[.01,-.011],[.009,.011],[-.009,.011]],[[0,0,.004]],.0015,[x+dx,cy+dy,z+.026],'zinc');
  cyl(id('aim-screws'),.0018,.035,[x+dx,cy+dy,z+.036],'zinc',[Math.PI/2,0,0]);screw(id('aim-screws'),[x+dx,cy+dy,z+.018],.004);for(let j=0;j<12;j++)ring(id('aim-screws'),.002,.0003,[x+dx,cy+dy,z+.025+j*.002],'zinc',[0,0,0]);box(id('aim-anchors'),[.012,.012,.010],[x+dx,cy+dy,z+.049],'headlightNylon',[],{},.002);
 }
 const sp=[x+s*.088,cy-.061,z+.037];spring(id('aim-spring'),sp,.003,.031,[0,0,1],10,.0006,'zinc');tube(id('aim-spring'),[[sp[0],sp[1],sp[2]-.016],[sp[0]-.007*s,sp[1]-.008,sp[2]-.026],[sp[0]-.009*s,sp[1]-.004,sp[2]-.026]],.0007,'zinc');
 plate(id('bucket'),[[-.115,-.086],[.115,-.086],[.115,.093],[-.115,.093]],[[0,0,.067],[.030,.089,.003],[-s*.111,0,.003]],.002,[x,cy,z+.055],'dark');
 for(const edge of[-1,1]){plate(id('bucket'),[[.01,-.012],[-.18,-.04],[-.23,-.020],[-.23,.003],[-.15,.011],[.01,.052]],[[-.22,0,.005]],.003,[x+edge*.105,.700,-1.595],'dark','x');cyl(id('pivot-bolts'),.004,.025,[x+edge*.117,.700,-1.375],'zinc');sleeve(id('pivot-bolts'),.008,.004,.0015,[x+edge*.12,.700,-1.375],'zinc');screw(id('pivot-bolts'),[x+edge*.126,.700,-1.375],.006,'x');}
 tube(id('bucket'),[[x-s*.105,.700,-1.375],[x-s*.128,.700,-1.465]],.004,'dark');sleeve(id('bucket'),.008,.003,.005,[x-s*.128,.700,-1.465],'dark');
 for(const edge of[-1,1]){screw(id('bezel-screws'),[x+edge*.108,cy+.081,z-.001],.0035);screw(id('bezel-screws'),[x+edge*.120,.691,-1.51],.0035,'x');}
}
// Duplicate all moving bucket pieces through one rigid transform. The door
// has its own poses, and fixed pivots, brackets, motors and relays stay put.
function duplicateClosedBucket(groups,side){const moving=headlightParts.filter(p=>p.section===`headlight-${side}-lamp`&& !p.id.endsWith('pivot-bolts'));const {pivotY:y,pivotZ:z,closedAngle:a}=headlightPose;const matrix=new T.Matrix4().makeTranslation(0,y,z).multiply(new T.Matrix4().makeRotationX(a)).multiply(new T.Matrix4().makeTranslation(0,-y,-z));for(const p of moving)for(const m of [...groups.get(p.id).children]){m.userData.option='headlights';m.userData.value=true;const down=m.clone();down.geometry=m.geometry.clone();down.material=m.material.clone();down.userData={...m.userData,original:{...m.userData.original,color:m.userData.original.color.clone(),emissive:m.userData.original.emissive.clone()},value:false};m.updateMatrix();down.geometry.applyMatrix4(m.matrix).applyMatrix4(matrix);down.position.set(0,0,0);down.rotation.set(0,0,0);down.scale.set(1,1,1);groups.get(p.id).add(down);}}
function buildDoor(h,groups,side,s){
 const {box,cyl,tube,surface}=h,{plate,sleeve,screw,rod}=lampTools(h),{spring}=mechanicalTools(h),id=k=>'hl-'+side+'-'+k,x=s*lampNominal.bulbCenterOffset,mx=x-s*.160;
 for(const raised of[false,true]){
  const f={option:'headlights',value:raised};
  const cp=(u,v)=>{if(raised)return[x+(u-.5)*.258,.711+Math.sin(headlightPose.coverRaisedAngle)*.318*(1-v)+.003*Math.sin(u*Math.PI),-1.375-Math.cos(headlightPose.coverRaisedAngle)*.318*(1-v)];const p=headlightHoodPoint(((x+(u-.5)*.258)/.659+1)/2,(-1.685+v*.31+1.786)/1.176);p[1]+=.001;return p;};
  surface(id('cover'),18,24,cp,'red',f);surface(id('cover'),18,12,(u,v)=>{const p=cp(u,v);p[1]-=.003;return p;},'dark',f);for(const u of[0,1])tube(id('cover'),Array.from({length:16},(_,i)=>cp(u,i/15)),.002,'red',f);
  // Narrow structural ribs leave the filler open; no opaque block fills the
  // headlight cavity in the closed pose.
  for(const u of[.08,.92])tube(id('filler'),Array.from({length:16},(_,i)=>{const p=cp(u,.07+i/15*.86);p[1]-=.009;return p;}),.004,'plastic',f);
  for(const v of[.10,.62,.90])tube(id('filler'),Array.from({length:10},(_,i)=>{const p=cp(.08+i/9*.84,v);p[1]-=.009;return p;}),.004,'plastic',f);
  for(const u of[.11,.89])for(const v of[.15,.85]){const p=cp(u,v);p[1]-=.01;cyl(id('cover-fasteners'),.003,.007,p,'plastic',[0,0,0],.003,f);}
  for(const u of[.22,.78]){const p=cp(u,.72);p[1]-=.014;box(id('filler'),[.017,.008,.025],p,'rubber',[],f,.003);}
  for(const u of[.12,.88]){const pts=[cp(u,.7),cp(u,.92),[x+(u-.5)*.258,.705,-1.368]];pts[0][1]-=.015;pts[1][1]-=.009;tube(id('hinge'),pts,.005,'dark',f);}
  const pose=headlightLinkPose(raised?1:0),linkX=x-s*.128,a=[linkX,...pose.motor],b=[linkX,...pose.crank],c=[linkX,...pose.bucket];
  for(const key of['crank','link','link-clip']){const before=groups.get(id(key)).children.length;if(key==='crank')rod(id(key),a,b,.017);if(key==='link')rod(id(key),b,c,.015);if(key==='link-clip'){sleeve(id(key),.006,.003,.0015,b,'zinc');tube(id(key),[[b[0]+s*.002,b[1]-.005,b[2]-.004],[b[0]+s*.002,b[1]+.006,b[2]],[b[0]+s*.002,b[1]-.005,b[2]+.004]],.0008,'zinc');}for(const m of groups.get(id(key)).children.slice(before))Object.assign(m.userData,f);}
 }
 tube(id('hinge'),[[x-.110,.704,-1.372],[x+.110,.704,-1.372]],.0045,'dark');spring(id('door-spring'),[x+s*.091,.699,-1.372],.008,.022,'x',8,.0011,'dark');tube(id('door-spring'),[[x+s*.085,.699,-1.38],[x+s*.085,.693,-1.386],[x+s*.085,.688,-1.407]],.0011,'dark');
 for(const dx of[-.105,.105]){
  plate(id('mount'),[[-.025,-.052],[-.005,-.060],[.025,-.060],[.13,-.135],[.26,-.145],[.27,-.113],[.20,-.088],[.005,.006],[-.015,-.025],[-.025,-.033]],[[-.015,-.044,.0045],[.012,-.020,.005],[.225,-.127,.006]],.003,[x+dx,.700,-1.39],'dark','x');
  box(id('mount'),[.040,.003,.057],[x+dx,.625,-1.444],'dark',[],{},.003);for(const z of[-1.421,-1.467])screw(id('mount-bolts'),[x+dx,.629,z],.005,'y');
 }
 box(id('mount'),[.227,.003,.035],[x,.604,-1.447],'dark',[],{},.003);plate(id('mount'),[[-.072,-.018],[.070,-.018],[.070,.019],[-.072,.019]],[[0,0,.016]],.003,[mx,.548,-1.415],'dark','x');
 for(const [y,z]of[[.491,-1.416],[.590,-1.487],[.660,-1.42]])screw(id('mount-bolts'),[mx-s*.027,y,z],.004,'x');
}
// The general gear helper includes the cylinder at the tooth roots. Keep
// only one root surface here so the pale plastic does not shimmer in close-up.
function headlightGear(h,...args){
 const meshes=mechanicalTools(h).gear(...args),m=meshes[0],original=m.geometry,g=original.index?original.toNonIndexed():original,rootRadius=args[1]*.90;
 const arrays=Object.fromEntries(Object.keys(g.attributes).map(k=>[k,[]])),p=g.attributes.position,n=g.attributes.normal;
 for(let i=0;i<p.count;i+=3){let outer=true;for(let j=0;j<3;j++)outer&&=Math.abs(Math.hypot(p.getY(i+j),p.getZ(i+j))-rootRadius)<.000001&&Math.abs(n.getX(i+j))<.01;if(outer)continue;for(const [key,a]of Object.entries(g.attributes))for(let j=0;j<3;j++)for(let k=0;k<a.itemSize;k++)arrays[key].push(a.array[(i+j)*a.itemSize+k]);}
 const clean=new T.BufferGeometry();for(const [key,a]of Object.entries(g.attributes))clean.setAttribute(key,new T.Float32BufferAttribute(arrays[key],a.itemSize));m.geometry=clean;if(g!==original)g.dispose();original.dispose();return meshes;
}
function buildMotor(h,side,s){
 const {add,box,cyl,tube,ring,surface}=h,{plate,sleeve,screw}=lampTools(h),{annulus}=mechanicalTools(h),gear=(...args)=>headlightGear(h,...args),id=k=>'hl-'+side+'-'+k,x=s*lampNominal.bulbCenterOffset-s*.160,z=-1.403,gy=.542,gz=-1.467;
 // Outline follows the opened early motor reference: vertical armature at
 // the rear, large output gear forward, smaller metal intermediate below.
 const boundary=[[-.028,.128],[.023,.128],[.031,.101],[.030,.022],[.027,-.052],[.010,-.070],[-.018,-.069],[-.065,-.036],[-.083,-.033],[-.096,-.020],[-.103,-.003],[-.101,.014],[-.092,.029],[-.077,.037],[-.059,.038],[-.042,.030],[-.032,.031],[-.028,.068]];
 // Local plate X maps to -Z; local Y to vehicle Y.
 const contour=boundary.map(([a,b])=>[-a,b]);
 const holes=[[ -(gz-z),gy-.542,.005 ],[0,.074,.023],[.031,-.032,.003]];
 plate(id('housing'),contour,holes,.003,[x-s*.016,.542,z],'plastic','x');plate(id('case-half'),contour,[[ -(gz-z),0,.005],[0,.074,.023]],.003,[x+s*.017,.542,z],'plastic','x');
 // Outer molded wall; open case remains inspectable when the opposite half
 // is separated. Coordinates stay in the original LHD authoring frame.
 for(let i=0;i<boundary.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length];surface(id('housing'),5,4,(u,v)=>[x-.015+.031*v,.542+a[1]+(b[1]-a[1])*u,z+a[0]+(b[0]-a[0])*u],'plastic');}
 for(const [yy,zz]of [[.668,z-.022],[.655,z+.026],[.594,z+.029],[.491,z+.017],[.478,z-.014],[.514,gz-.027],[.559,gz-.030],[.584,gz-.005]]){
  for(const edge of[-1,1])sleeve(id(edge===s?'case-half':'housing'),.006,.002,.006,[x+edge*.014,yy,zz],'plastic');cyl(id('case-rivets'),.0018,.044,[x,yy,zz],'zinc');for(const edge of[-1,1])cyl(id('case-rivets'),.0035,.0015,[x+edge*.023,yy,zz],'zinc');
 }
 // Hollow field can reveals the wound rotor in the exploded motor view.
 sleeve(id('field'),.025,.022,.050,[x,.622,z],'zinc','y');for(const a0 of[0,Math.PI])surface(id('field'),24,4,(u,v)=>{const a=a0-.95+u*1.9;return[x+Math.cos(a)*.021,.599+v*.046,z+Math.sin(a)*.021];},'dark');
 cyl(id('armature'),.0028,.177,[x,.594,z],'rotor',[0,0,0]);cyl(id('armature'),.015,.039,[x,.622,z],'rotor',[0,0,0]);
 for(let i=0;i<9;i++){const a=i*Math.PI*2/9;for(let w=0;w<3;w++)tube(id('armature'),[[x+Math.cos(a-.15)*(.014+w*.0007),.602,z+Math.sin(a-.15)*(.014+w*.0007)],[x+Math.cos(a)*.018,.597,z+Math.sin(a)*.018],[x+Math.cos(a+.15)*(.014+w*.0007),.642,z+Math.sin(a+.15)*(.014+w*.0007)],[x+Math.cos(a)*.018,.647,z+Math.sin(a)*.018],[x+Math.cos(a-.15)*(.014+w*.0007),.602,z+Math.sin(a-.15)*(.014+w*.0007)]],.0005,'copper');}
 cyl(id('armature'),.009,.016,[x,.584,z],'phenolic',[0,0,0]);for(let i=0;i<12;i++){const a=i*Math.PI/6;surface(id('armature'),5,2,(u,v)=>[x+Math.cos(a+u*.46)*.0092,.576+v*.016,z+Math.sin(a+u*.46)*.0092],'copper');}
 // Worm relief follows the vertical shaft. It is explicitly not a verified
 // gear pitch/ratio or a contact-mechanics simulation.
 tube(id('armature'),Array.from({length:161},(_,i)=>{const u=i/160,a=u*9*Math.PI*2;return[x+Math.cos(a)*.005,.492+u*.045,z+Math.sin(a)*.005];}),.0012,'rotor');
 for(const y of[.660,.571,.484])sleeve(id('bearings'),.006,.003,.006,[x,y,z],'gold','y');
 cyl(id('knob'),.026,.014,[x,.677,z],'plastic',[0,0,0]);cyl(id('knob'),.009,.010,[x,.689,z],'plastic',[0,0,0]);for(let i=0;i<18;i++){const a=i*Math.PI/9;box(id('knob'),[.004,.012,.004],[x+Math.cos(a)*.025,.677,z+Math.sin(a)*.025],'plastic',[],{},.001);}
 sleeve(id('housing'),.008,.004,.008,[x-s*.010,gy,gz],'plastic');sleeve(id('housing'),.006,.003,.008,[x-s*.010,.510,-1.434],'plastic');cyl(id('intermediate'),.003,.036,[x,.510,-1.434],'rotor');
 gear(id('intermediate'),.023,.009,42,[x,.510,-1.434],.06,'rotor',.003);gear(id('intermediate'),.009,.008,16,[x+s*.008,.510,-1.434],.03,'rotor',.003);
 // Recessed radial gear pockets accept four individual cushions and the steel
 // cage. The color/material follow the original plastic gear, not the
 // replacement alloy gear visible in one supplier reference photograph.
 gear(id('output-gear'),.031,.012,44,[x,gy,gz],.16,'headlightNylon',.022);
 annulus(id('output-gear'),.028,.004,.002,[x-s*.005,gy,gz],'headlightNylon');
 sleeve(id('output-gear'),.010,.004,.013,[x,gy,gz],'headlightNylon');for(let i=0;i<4;i++){const a=i*Math.PI/2;const m=box(id('output-gear'),[.012,.014,.004],[x,gy+Math.cos(a)*.016,gz+Math.sin(a)*.016],'headlightNylon',[-a,0,0],{},.001);const b=a+Math.PI/4;box(id('bumper-'+(i+1)),[.009,.010,.013],[x+s*.001,gy+Math.cos(b)*.015,gz+Math.sin(b)*.015],'headlightCushion',[-b,0,0],{},.003);}
 const cage=[[-.021,-.013],[-.012,-.021],[.012,-.021],[.021,-.013],[.016,-.005],[.016,.005],[.021,.013],[.012,.021],[-.012,.021],[-.021,.013],[-.016,.005],[-.016,-.005]];
 plate(id('drive-plate'),cage,[[0,0,.004]],.0025,[x+s*.009,gy,gz],'dark','x');for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;box(id('drive-plate'),[.006,.010,.003],[x+s*.004,gy+Math.cos(a)*.014,gz+Math.sin(a)*.014],'dark',[-a,0,0],{},.001);}
 cyl(id('output-shaft'),.004,.071,[x+s*.009,gy,gz],'rotor');for(const edge of[-1,1])sleeve(id('output-shaft'),.007,.004,.007,[x+edge*.019,gy,gz],'gold');
 // Side access cover and two sprung carbon brushes at the commutator.
 const sx=x-s*.013,sy=.579;
 plate(id('switch'),[[-.021,-.016],[.021,-.016],[.021,.016],[-.021,.016]],[[0,0,.008]],.003,[sx,sy,z],'phenolic','x');
 for(const e of[-1,1]){box(id('brushes'),[.007,.006,.004],[x,sy,z+e*.010],'dark',[],{},.001);tube(id('brushes'),[[x,sy,z+e*.012],[sx-s*.002,sy,z+e*.023],[sx-s*.002,sy+.014,z+e*.023]],.0007,'zinc');box(id('switch'),[.003,.018,.006],[sx,sy+.004,z+e*.021],'copper');cyl(id('switch'),.002,.003,[sx-s*.002,sy+.014,z+e*.021],'zinc');}
 box(id('switch'),[.003,.008,.010],[sx,sy-.018,z],'phenolic',[],{},.001);tube(id('switch'),[[sx,sy-.011,z-.012],[sx-s*.004,sy-.018,z],[sx,sy-.011,z+.012]],.0007,'copper');
 plate(id('switch-cover'),[[-.028,-.022],[.028,-.022],[.030,.016],[.020,.025],[-.025,.025]],[],.003,[x-s*.028,sy,z],'plastic','x');for(const [dy,dz]of[[-.018,-.023],[-.018,.023],[.021,0]])screw(id('switch-screws'),[x-s*.031,sy+dy,z+dz],.0025,'x');
 for(const [i,dz]of[-.009,0,.009].entries())tube(id('motor-leads'),[[sx,sy-.012,z+dz],[x-s*.041,sy-.016,z+dz],[x-s*.053,.532,-1.368+dz],[x-s*.074,.558,-1.33+dz]],.0016,i===0?'wireBlue':i===1?'headlightCushion':'wire');
 box(id('motor-leads'),[.014,.010,.025],[x-s*.074,.558,-1.339],'plastic',[],{},.003);box(id('motor-leads'),[.022,.014,.025],[x-s*.074,.558,-1.322],'plastic',[],{},.003);
}
function buildRelays(h){
 const {box,cyl,tube}=h,{plate,frame,sleeve,screw}=lampTools(h),id=k=>'hl-'+k;
 for(const [side,s]of[['left',1],['right',-1]]){
  const x=s*.405,y=.606,z=-1.29;
  box(id(side+'-relay'),[.029,.040,.032],[x,y,z],'plastic',[],{},.004);box(id(side+'-relay'),[.031,.006,.033],[x,y-.021,z],'phenolic',[],{},.002);
  plate(id(side+'-relay-bracket'),[[-.02,-.028],[.02,-.028],[.017,.031],[-.017,.031]],[[0,.023,.003]],.0015,[x,y,z+.019],'zinc');screw(id(side+'-relay-bracket'),[x,y+.023,z+.022],.004);box(id(side+'-relay-bracket'),[.034,.002,.027],[x,y-.028,z+.007],'zinc');
  frame(id(side+'-relay-socket'),.029,.016,.003,.030,[x,y-.034,z],'plastic');for(let i=0;i<4;i++)tube(id(side+'-relay-socket'),[[x-.01+i*.006,y-.039,z],[x-.01+i*.006,y-.075,z+.026],[s*.342+i*.006,.500,-1.34]],.0018,i===0?'wireRed':'wire');
  sleeve(id(side+'-ground'),.006,.003,.001,[s*.663,.475,-1.518],'zinc','y');screw(id(side+'-ground'),[s*.663,.477,-1.518],.004,'y');tube(id(side+'-ground'),[[s*.663,.475,-1.518],[s*.631,.466,-1.49],[s*.56,.473,-1.38],[s*.34,.500,-1.34]],.002,'wire');
 }
 box(id('isolation-relay'),[.041,.039,.032],[.472,.588,-1.230],'plastic',[],{},.004);plate(id('isolation-bracket'),[[-.028,-.030],[.028,-.030],[.018,.035],[-.018,.035]],[[0,.027,.003]],.0015,[.472,.588,-1.209],'zinc');screw(id('isolation-bracket'),[.472,.615,-1.206],.004);box(id('isolation-bracket'),[.040,.009,.028],[.472,.562,-1.230],'phenolic',[],{},.002);
 tube(id('forward-harness'),[[.57,.53,-1.25],[.47,.507,-1.29],[.34,.5,-1.34],[0,.48,-1.39],[-.34,.5,-1.34],[-.54,.51,-1.30]],.006,'wire');tube(id('forward-harness'),[[.472,.560,-1.230],[.49,.53,-1.23],[.47,.507,-1.29]],.004,'wire');for(const s of[-1,1])tube(id('forward-harness'),[[s*.34,.50,-1.34],[s*.39,.48,-1.48],[s*.43,.58,-1.56],[s*.45,.67,-1.46]],.004,'wire');
 for(const x of[-.28,0,.28]){box(id('forward-harness'),[.017,.009,.020],[x,.486,-1.388],'plastic',[],{},.002);screw(id('forward-harness'),[x,.492,-1.388],.002,'y');}
}

function buildControls(h){
 const {box,cyl,tube,label}=h,{frame,plate,sleeve,screw}=lampTools(h),id=k=>'hl-'+k,x=.608,y=.824,z=-.356;
 plate(id('control-bezel'),[[-.031,-.088],[.031,-.088],[.031,.083],[-.031,.083]],[[[-.023,-.009],[.023,-.009],[.023,.055],[-.023,.055]],[[-.009,-.065],[.009,-.065],[.009,-.025],[-.009,-.025]]],.004,[x,y,z],'metal');
 frame(id('switch-case'),.048,.072,.004,.037,[x,y+.022,z-.021],'plastic');box(id('switch-case'),[.047,.068,.003],[x,y+.022,z-.041],'phenolic',[],{},.002);
 for(const sy of[-1,1])box(id('switch-case'),[.018,.009,.004],[x,y+.022+sy*.042,z-.006],'plastic',[],{},.002);
 box(id('switch-rocker'),[.039,.042,.011],[x,y+.030,z+.004],'plastic',[.09,0,0],{},.003);
 label(id('switch-rocker'),'LIGHTS',[.027,.006],[x,y+.029,z+.010],[0,0,0],{background:'transparent',foreground:'#b9b8b0',font:'45px Arial'});
 box(id('park-button'),[.039,.012,.009],[x,y+.001,z+.004],'plastic',[],{},.002);
 label(id('park-button'),'PARK',[.024,.0045],[x,y+.002,z+.009],[0,0,0],{background:'transparent',foreground:'#b9b8b0',font:'45px Arial'});
 box(id('switch-contacts'),[.034,.052,.003],[x,y+.023,z-.032],'phenolic',[],{},.001);
 for(const dx of[-.011,0,.011]){box(id('switch-contacts'),[.005,.030,.001],[x+dx,y+.030,z-.029],'copper');cyl(id('switch-contacts'),.002,.001,[x+dx,y+.014,z-.028],'zinc',[Math.PI/2,0,0]);}
 box(id('switch-contacts'),[.023,.005,.002],[x,y+.005,z-.025],'zinc');
 frame(id('switch-plug'),.041,.062,.004,.016,[x,y+.024,z-.054],'plastic');
 for(const dx of[-.012,0,.012])for(const dy of[-.018,.018]){frame(id('switch-plug'),.010,.014,.0015,.011,[x+dx,y+.024+dy,z-.055],'plastic');box(id('switch-plug'),[.004,.001,.008],[x+dx,y+.024+dy,z-.054],'copper');}
 for(const dx of[-.024,.024])for(const dy of[-.078,.073])screw(id('control-screws'),[x+dx,y+dy,z+.004],.003,'z');
 const wy=y-.046;cyl(id('panel-dimmer'),.020,.013,[x,wy,z-.007],'plastic');
 for(let i=0;i<36;i++){const a=i/36*Math.PI*2;box(id('panel-dimmer'),[.013,.0015,.002],[x,wy+Math.sin(a)*.020,z-.007+Math.cos(a)*.020],'dark',[-a,0,0],{},.0003);}
 frame(id('dimmer-carrier'),.033,.051,.004,.028,[x,wy,z-.020],'plastic');sleeve(id('dimmer-carrier'),.009,.003,.001,[x+.009,wy,z-.007],'copper');tube(id('dimmer-carrier'),[[x+.012,wy-.018,z-.019],[x+.012,wy,z-.012],[x+.012,wy+.010,z-.012]],.0006,'copper');
 // Remote illumination transistor: stamped heat sink, insulated mounting,
 // metal package and short wires. This is separate from the beam switch.
 const tx=.533,ty=.589,tz=-.503;box(id('panel-transistor'),[.066,.038,.002],[tx,ty,tz],'zinc',[],{},.001);
 for(const dx of[-.030,.030])box(id('panel-transistor'),[.002,.039,.018],[tx+dx,ty,tz+.008],'zinc');
 box(id('panel-transistor'),[.039,.020,.002],[tx,ty,tz+.003],'pickupPlastic',[],{},.004);cyl(id('panel-transistor'),.010,.006,[tx,ty,tz+.007],'zinc',[Math.PI/2,0,0]);for(const dx of[-.016,.016])screw(id('panel-transistor'),[tx+dx,ty,tz+.005],.0025);
 const bx=.381,by=.616,bz=-.462;
 box(id('beam-switch'),[.020,.024,.052],[bx,by,bz],'pickupPlastic',[],{},.003);box(id('beam-switch'),[.022,.003,.050],[bx,by+.014,bz],'zinc');cyl(id('beam-switch'),.004,.013,[bx,by,bz+.031],'plastic',[Math.PI/2,0,0]);
 tube(id('beam-rod'),[[bx,by,bz+.037],[bx,.633,-.418],[.381,.684,-.293],[.389,.708,-.265]],.0018,'zinc');
 frame(id('beam-plug'),.026,.017,.003,.026,[bx,by-.019,bz-.004],'plastic');for(let i=0;i<3;i++)box(id('beam-plug'),[.005,.001,.013],[bx-.008+i*.008,by-.022,bz-.004],'copper');
 box(id('beam-mount'),[.035,.002,.071],[bx,by+.017,bz-.005],'zinc');for(const dz of[-.032,.027])screw(id('beam-mount'),[bx,by+.020,bz+dz],.003,'y');
 tube(id('control-wiring'),[[x,y+.020,z-.066],[.594,.742,-.467],[.516,.63,-.526],[.39,.55,-.536]],.005,'wire');
 tube(id('control-wiring'),[[bx,by-.030,bz],[.392,.565,-.479],[.39,.55,-.536]],.004,'wire');
 tube(id('control-wiring'),[[tx,ty,tz-.008],[.520,.557,-.520],[.39,.55,-.536]],.0035,'wire');
}
