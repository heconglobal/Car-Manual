import * as T from 'three';
import {alternatorEngine,engineToVehicle,starterVehicle} from './powertrain-layout.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {electricalTools,bakeElectrical} from './electrical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {chargingParts} from './charging-catalog.js';
export const chargingDatums={battery:[-.58,.650,.790],alternator:engineToVehicle(alternatorEngine),starter:starterVehicle};
export function chargingMaterials(base=createMaterials()){const m={...base};for(const k of['plastic','rubber','metal','iron','castAluminum']){m[k]=base[k].clone();m[k].bumpScale=.00006;}m.cableRed=new T.MeshStandardMaterial({color:'#9d3330',roughness:.65});m.insulation=new T.MeshStandardMaterial({color:'#9b6d3f',roughness:.65});return m;}
function makeGroups(){const root=new T.Group(),groups=new Map();for(const p of chargingParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'electrical',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3()};groups.set(p.id,g);root.add(g);}return{root,groups};}
export function createChargingDetail(){const model=makeGroups(),h=geometryTools(model.groups,chargingMaterials());buildCharging(h,model.groups);h.optimize();correctLegacyHandedness(model.groups);return model;}
export function buildVehicleCharging(groups,materials){const d=makeGroups(),h=geometryTools(d.groups,chargingMaterials(materials));buildCharging(h,d.groups);h.optimize();for(const p of chargingParts){const owner=p.section==='charging-battery'?'battery':p.section==='charging-starter'?'starter':'alternator';groups.get(owner).scale.set(1,1,1);for(const m of [...d.groups.get(p.id).children]){m.userData.partId=owner;groups.get(owner).add(m);}}}
export function buildCharging(h,groups){buildBattery(h);buildStarter(h,groups);buildAlternator(h,groups);}
function buildBattery(h){
 const {box,cyl,tube,ring,label,surface,bolt}=h,{plate,frame,sleeve,screw}=electricalTools(h),id=k=>'ch-'+k,[x,y,z]=chargingDatums.battery;
 box(id('battery-case'),[.231,.181,.169],[x,y,z],'plastic',[],{},.005);
 for(const sy of[-1,1])box(id('battery-case'),[.240,.012,.015],[x,y-.087,z+sy*.083],'plastic',[],{},.002);
 for(const dx of[-.109,.109])box(id('battery-case'),[.015,.015,.167],[x+dx,y-.085,z],'plastic',[],{},.002);
 box(id('battery-lid'),[.240,.016,.177],[x,y+.098,z],'plastic',[],{},.003);
 for(const dx of[-.058,.058])box(id('battery-lid'),[.106,.003,.122],[x+dx,y+.108,z-.005],'plastic',[],{},.004);
 for(const sx of[-1,1]){box(id('battery-lid'),[.011,.004,.051],[x+sx*.112,y+.108,z],'dark',[],{},.001);for(let j=0;j<5;j++)box(id('battery-lid'),[.006,.001,.001],[x+sx*.113,y+.111,z-.020+j*.01],'plastic');}
 label(id('battery-lid'),'DELCO FREEDOM',[.161,.048],[x,y+.111,z-.015],[-Math.PI/2,0,0],{background:'#1d2528',foreground:'#c2c5ba',font:'bold 46px Arial'});
 // Recessed side ports replace the erroneous top-post battery.
 for(const [dx,positive]of[[-.075,true],[.075,false]]){
  sleeve(id('battery-terminals'),.018,.010,.011,[x+dx,y+.035,z+.087],'plastic');sleeve(id('battery-terminals'),.010,.004,.008,[x+dx,y+.035,z+.091],'metal');
  label(id('battery-terminals'),positive?'+':'−',[.014,.014],[x+dx,y+.066,z+.087],[0,0,0],{background:'transparent',foreground:'#999d94',font:'bold 64px Arial'});
 }
 cyl(id('battery-indicator'),.009,.003,[x+.081,y+.112,z+.047],'dark',[0,0,0]);cyl(id('battery-indicator'),.0035,.001,[x+.081,y+.114,z+.047],'wireGreen',[0,0,0]);
 // Drain holes, side returns and formed lower support are actual openings.
 const tray=plate(id('battery-tray'),.258,.193,.004,[0,0,0],'frame',[[-.075,0,.010],[.075,0,.010]],.006);tray.rotation.x=-Math.PI/2;tray.position.set(x,y-.104,z);
 for(const sx of[-1,1])box(id('battery-tray'),[.005,.031,.196],[x+sx*.127,y-.091,z],'frame',[],{},.003);for(const sz of[-1,1])box(id('battery-tray'),[.25,.021,.004],[x,y-.095,z+sz*.097],'frame',[],{},.002);
 box(id('battery-retainer'),[.049,.022,.031],[x+.087,y-.080,z+.098],'plastic',[.15,0,0],{},.003);cyl(id('battery-retainer-bolt'),.004,.083,[x+.087,y-.066,z+.103],'zinc',[0,0,0]);bolt(id('battery-retainer-bolt'),[x+.087,y-.023,z+.103],.006);
 box(id('battery-heat-shield'),[.003,.202,.198],[x+.130,y+.018,z],'plastic',[],{},.004);box(id('battery-heat-shield'),[.128,.202,.003],[x+.066,y+.018,z-.100],'plastic',[],{},.004);
 for(const dy of[-.03,.057])box(id('battery-heat-shield'),[.006,.009,.137],[x+.132,y+dy,z],'plastic',[],{},.003);
 for(const zz of[-.08,.08])screw(id('battery-shield-screws'),[x+.128,y-.062,z+zz],.004,.020,'x');
 const support=frame(id('battery-support'),.071,.135,.012,.004,[0,0,0],'frame',.008);support.rotation.x=.25;support.position.set(x+.09,y-.162,z+.064);box(id('battery-support'),[.070,.005,.095],[x+.09,y-.225,z+.055],'frame',[],{},.003);
 const pos=[x-.075,y+.035,z+.097],neg=[x+.075,y+.035,z+.097];
 for(const [key,p,mat]of[['positive-cable',pos,'cableRed'],['negative-cable',neg,'rubber']]){sleeve(id(key),.016,.006,.010,p,mat);bolt(id(key),[p[0],p[1],p[2]+.008],.006,'z');}
 tube(id('positive-cable'),[pos,[-.66,.658,.94],[-.54,.50,.91],[-.40,.397,.87],[-.18,.39,.87],[starterVehicle[0]-.086,starterVehicle[1]+.078,starterVehicle[2]+.014]],.006,'rubber');
 tube(id('negative-cable'),[neg,[-.48,.634,.94],[-.32,.62,1.05],[-.16,.612,1.07]],.006,'rubber');sleeve(id('negative-cable'),.009,.004,.002,[-.16,.612,1.07],'zinc','y');bolt(id('negative-cable'),[-.16,.616,1.07],.005);
 tube(id('negative-cable'),[neg,[-.53,.60,.84],[-.655,.60,.83]],.003,'wire');sleeve(id('negative-cable'),.007,.003,.002,[-.655,.60,.83],'zinc','y');bolt(id('negative-cable'),[-.655,.603,.83],.004);
 // Parallel diagonal braid strands give the flat ground strap its woven form.
 const points=[[-.20,.613,1.02],[-.24,.648,.87],[-.32,.645,.70],[-.36,.630,.612]];
 for(let i=0;i<7;i++)tube(id('ground-strap'),points.map((p,j)=>[p[0]+(i-3)*.0012,p[1]+Math.sin(j*Math.PI/2+i)*.0006,p[2]]),.00045,'zinc');
 for(const p of[points[0],points.at(-1)]){sleeve(id('ground-strap'),.009,.004,.0015,p,'zinc','y');bolt(id('ground-strap'),[p[0],p[1]+.003,p[2]],.005);}
}
function buildStarter(h,groups){
 const {add,box,cyl,tube,ring,surface,bolt}=h,{plate,frame,sleeve,screw}=electricalTools(h),{spring}=mechanicalTools(h),id=k=>'ch-'+k;
 sleeve(id('starter-yoke'),.052,.047,.129,[0,0,0],'dark');for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5]){const x=Math.cos(a)*.047,y=Math.sin(a)*.047;box(id('starter-field'),[.021,.009,.092],[x,y,0],'iron',[0,0,a-Math.PI/2],{},.003);const coil=frame(id('starter-field'),.035,.110,.005,.008,[0,0,0],'insulation',.010);coil.rotation.set(Math.PI/2,a-Math.PI/2,0);coil.position.set(x*.90,y*.90,0);}
 cyl(id('starter-armature'),.009,.260,[0,0,.028],'rotor',[Math.PI/2,0,0]);cyl(id('starter-armature'),.035,.094,[0,0,-.005],'iron',[Math.PI/2,0,0]);
 for(let j=0;j<24;j++){const a=j*Math.PI/12;for(const z of[-.040,.030])tube(id('starter-armature'),[[Math.cos(a)*.028,Math.sin(a)*.028,z],[Math.cos(a+.20)*.033,Math.sin(a+.20)*.033,z+(z<0?-.013:.013)],[Math.cos(a+.40)*.028,Math.sin(a+.40)*.028,-z-.010]],.0013,'copper');}
 for(let j=0;j<24;j++){const a=j*Math.PI/12;box(id('starter-armature'),[.0048,.002,.030],[Math.cos(a)*.019,Math.sin(a)*.019,-.074],'copper',[0,0,a-Math.PI/2],{},.0003);}
 sleeve(id('starter-carrier'),.047,.023,.005,[0,0,-.078],'phenolic');
 for(let j=0;j<4;j++){const a=j*Math.PI/2,x=Math.cos(a)*.026,y=Math.sin(a)*.026;box(id('starter-brushes'),[.014,.010,.019],[x,y,-.078],'dark',[0,0,a],{},.001);tube(id('starter-brushes'),[[x*1.1,y*1.1,-.08],[x*1.6,y*1.6,-.073],[x*1.5,y*1.5,-.053]],.001,'copper');const f=frame(id('starter-carrier'),.019,.014,.002,.022,[x,y,-.078],'zinc',.001);f.rotation.z=a;const v=[Math.cos(a)*.039,Math.sin(a)*.039,-.078];spring(id('starter-brush-springs'),v,.003,.012,[Math.cos(a),Math.sin(a),0],5,.0006,'zinc');screw(id('starter-brush-springs'),[x*1.6,y*1.6,-.083],.0025,.008);}
 sleeve(id('starter-end'),.052,.009,.009,[0,0,-.096],'castAluminum');sleeve(id('starter-end'),.018,.009,.018,[0,0,-.104],'castAluminum');for(const x of[-.039,.039])screw(id('starter-through-bolts'),[x,.020,-.107],.004,.190,'z',1);
 sleeve(id('starter-nose'),.054,.046,.020,[0,0,.074],'castAluminum');sleeve(id('starter-nose'),.019,.009,.022,[0,0,.165],'castAluminum');
 // Open lower engagement window with two cast ribs, not a filled cone.
 surface(id('starter-nose'),64,16,(u,v)=>{const a=.12+u*(Math.PI-.24),r=.050*(1-v)+.018*v;return[Math.cos(a)*r,Math.sin(a)*r,.084+.079*v];},'castAluminum');
 for(const s of[-1,1])tube(id('starter-nose'),[[s*.047,.006,.078],[s*.041,.006,.105],[s*.018,.003,.164]],.006,'castAluminum');
 plate(id('starter-nose'),.117,.024,.027,[0,.042,.094],'castAluminum',[[-.044,0,.005],[.044,0,.005]],.006);
 for(const z of[-.105,.167])sleeve(id('starter-bushings'),.012,.009,.016,[0,0,z],'gold');
 sleeve(id('starter-drive'),.025,.010,.030,[0,0,.103],'rotor');sleeve(id('starter-drive'),.029,.010,.007,[0,0,.087],'rotor');
 const pinion=new T.Shape();for(let i=0;i<80;i++){const a=i/80*Math.PI*2,r=[.014,.014,.018,.018,.018,.018,.014,.014][i%8];i?pinion.lineTo(Math.cos(a)*r,Math.sin(a)*r):pinion.moveTo(Math.cos(a)*r,Math.sin(a)*r);}pinion.closePath();const hole=new T.Path();hole.absarc(0,0,.009,0,Math.PI*2,true);pinion.holes.push(hole);const geo=new T.ExtrudeGeometry(pinion,{depth:.025,bevelEnabled:true,bevelSize:.0006,bevelThickness:.0006,bevelSegments:2,curveSegments:24});add(id('starter-drive'),geo,'rotor',[0,0,.120]);
 spring(id('starter-drive-spring'),[0,0,.077],.013,.026,[0,0,1],6,.0014,'zinc');for(const z of[.147,.151,.155])sleeve(id('starter-retainers'),.013,.009,.002,[0,0,z],'zinc');
 // Fork straddles the clutch collar and rises to the solenoid plunger.
 for(const s of[-1,1])tube(id('starter-fork'),[[s*.027,-.010,.086],[s*.029,.022,.086],[s*.017,.053,.079],[s*.006,.071,.061]],.003,'zinc');cyl(id('starter-fork'),.003,.048,[0,.037,.080],'zinc');
 const sy=.078;sleeve(id('solenoid-case'),.026,.019,.087,[0,sy,.006],'dark');sleeve(id('solenoid-case'),.0185,.0105,.072,[0,sy,.006],'insulation');for(const z of[-.039,.051])sleeve(id('solenoid-case'),.030,.010,.004,[0,sy,z],'zinc');
 cyl(id('solenoid-plunger'),.010,.080,[0,sy,.028],'rotor',[Math.PI/2,0,0]);sleeve(id('solenoid-plunger'),.012,.006,.012,[0,sy,.072],'zinc');spring(id('solenoid-return'),[0,sy,.045],.014,.050,[0,0,1],7,.0012,'zinc');
 cyl(id('solenoid-contact'),.018,.003,[0,sy,-.044],'copper',[Math.PI/2,0,0]);cyl(id('solenoid-contact'),.003,.040,[0,sy,-.026],'pickupPlastic',[Math.PI/2,0,0]);
 cyl(id('solenoid-cap'),.026,.022,[0,sy,-.057],'phenolic',[Math.PI/2,0,0]);for(const x of[-.014,.014]){cyl(id('solenoid-cap'),.004,.029,[x,sy,-.079],'copper',[Math.PI/2,0,0]);bolt(id('solenoid-cap'),[x,sy,-.086],.006,'z');}cyl(id('solenoid-cap'),.0025,.018,[0,sy+.016,-.078],'zinc',[Math.PI/2,0,0]);
 for(const x of[-.021,.021])screw(id('solenoid-fasteners'),[x,sy,.052],.003,.017);
 for(const x of[-.044,.044]){cyl(id('starter-mount-bolts'),.0045,.052,[x,.027,.095],'zinc',[0,0,0]);bolt(id('starter-mount-bolts'),[x,.002,.095],.007);}
 tube(id('starter-leads'),[[.014,sy,-.086],[.022,.064,-.091],[.031,.025,-.067]],.003,'copper');tube(id('starter-leads'),[[0,sy+.016,-.078],[.012,sy+.034,-.092],[.077,sy+.04,-.087]],.0018,'wirePurple');
 const p=chargingDatums.starter;bakeElectrical(groups,chargingParts.filter(p=>p.section==='charging-starter').map(p=>p.id),(x,y,z)=>[p[0]+z,p[1]+y,p[2]-x]);
}
export function buildAlternator(h,groups){
 const {add,box,cyl,tube,ring,surface,bolt}=h,{plate,frame,sleeve,screw}=electricalTools(h),{spring}=mechanicalTools(h),id=k=>'ch-'+k;
 function ventFrame(key,z,front){
  sleeve(id(key),.072,.066,.024,[0,0,z],'castAluminum');sleeve(id(key),.025,.012,.024,[0,0,z+(front?.006:-.007)],'castAluminum');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;surface(id(key),6,4,(u,v)=>{const r=.024+u*.043,ang=a+(v-.5)*.085;return[Math.cos(ang)*r,Math.sin(ang)*r,z+(front?.010:-.010)+Math.sin(u*Math.PI)*.004];},'castAluminum');}
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5]){const x=Math.cos(a)*.063,y=Math.sin(a)*.063;sleeve(id(key),.007,.003,.028,[x,y,z],'castAluminum');}
 }
 ventFrame('alt-front',.032,true);ventFrame('alt-rear',-.060,false);
 const lug=plate(id('alt-front'),.037,.041,.031,[0,-.085,.015],'castAluminum',[[0,0,.006]],.010);const ear=plate(id('alt-front'),.025,.037,.022,[.049,.066,.034],'castAluminum',[[0,0,.0045]],.008);
 sleeve(id('alt-stator'),.071,.054,.033,[0,0,-.011],'iron');for(let j=0;j<36;j++){const a=j*Math.PI/18,r=.057;const pts=[[-.033,.053],[-.029,.064],[.012,.064],[.018,.053]].map(([z,r],k)=>[Math.cos(a+(k>1?.10:0))*r,Math.sin(a+(k>1?.10:0))*r,z]);tube(id('alt-stator'),pts,.0026,'copper');}
 cyl(id('alt-rotor'),.008,.203,[0,0,.007],'rotor',[Math.PI/2,0,0]);
 for(const s of[-1,1]){
  sleeve(id('alt-rotor'),.041,.009,.009,[0,0,-.010+s*.023],'iron');
  for(let i=0;i<6;i++){const a=i*Math.PI/3+(s===1?Math.PI/6:0);surface(id('alt-rotor'),12,8,(u,v)=>{const angle=a+(v-.5)*(.43*(1-u)+.08*u),r=.038+Math.sin(u*Math.PI)*.008;return[Math.cos(angle)*r,Math.sin(angle)*r,-.010+s*(.022-.045*u)];},'iron');}
 }
 sleeve(id('alt-field'),.031,.013,.037,[0,0,-.010],'insulation');for(let i=0;i<16;i++)ring(id('alt-field'),.030,.0008,[0,0,-.026+i*.002],'copper',[0,0,0]);
 for(const z of[-.069,-.078]){sleeve(id('alt-slip-rings'),.012,.008,.007,[0,0,z],'copper');sleeve(id('alt-slip-rings'),.010,.008,.010,[0,0,z],'phenolic');}
 for(const [key,z,r]of[['alt-front-bearing',.046,.022],['alt-rear-bearing',-.074,.014]]){
  sleeve(id(key),r,r-.004,.009,[0,0,z],'rotor');sleeve(id(key),.011,.008,.009,[0,0,z],'rotor');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;add(id(key),new T.SphereGeometry((r-.015)/2+.0012,12,8),'alloy',[Math.cos(a)*(r+.007)/2,Math.sin(a)*(r+.007)/2,z]);}
 }
 sleeve(id('alt-bearing-retainer'),.030,.013,.002,[0,0,.053],'zinc');for(let i=0;i<3;i++){const a=i*Math.PI*2/3;screw(id('alt-bearing-retainer'),[Math.cos(a)*.026,Math.sin(a)*.026,.055],.0025,.008);}
 for(const [z,r]of[[.059,.014],[.072,.013],[-.086,.010]])sleeve(id('alt-collars'),r,.008,.006,[0,0,z],'zinc');
 sleeve(id('alt-fan'),.060,.009,.002,[0,0,.063],'zinc');for(let i=0;i<11;i++){const a=i*Math.PI*2/11;surface(id('alt-fan'),8,3,(u,v)=>{const r=.026+u*.033,ang=a+u*.20;return[Math.cos(ang)*r,Math.sin(ang)*r,.063+v*.013*Math.sin(u*Math.PI*.7)];},'zinc');}
 // Dish pulley with open center and two flanges bordering the belt groove.
 for(const [z,r]of[[.080,.033],[.087,.030],[.094,.033]])sleeve(id('alt-pulley'),r,.008,.003,[0,0,z],'dark');sleeve(id('alt-pulley'),.016,.008,.018,[0,0,.082],'dark');sleeve(id('alt-pulley-nut'),.014,.008,.002,[0,0,.098],'zinc');bolt(id('alt-pulley-nut'),[0,0,.102],.012,'z');
 box(id('alt-regulator'),[.042,.031,.008],[-.031,.029,-.058],'phenolic',[],{},.002);for(const s of[-1,1]){plate(id('alt-regulator'),.010,.013,.002,[-.031+s*.024,.029,-.058],'zinc',[[0,0,.002]]);screw(id('alt-regulator'),[-.031+s*.024,.029,-.065],.0025,.010);}
 for(const s of[-1,1]){const sh=new T.Shape();sh.absarc(0,0,.056,s>0?3.35:.2,s>0?6.03:2.93,false);sh.absarc(0,0,.032,s>0?6.03:2.93,s>0?3.35:.2,true);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:.005,bevelEnabled:false,curveSegments:24});add(id('alt-rectifier'),g,s>0?'zinc':'phenolic',[0,0,-.050]);for(let i=0;i<3;i++){const a=(s>0?3.65:.55)+i*.78;cyl(id('alt-rectifier'),.0055,.009,[Math.cos(a)*.044,Math.sin(a)*.044,-.053],'dark',[Math.PI/2,0,0]);tube(id('alt-rectifier'),[[Math.cos(a)*.044,Math.sin(a)*.044,-.049],[Math.cos(a)*.030,Math.sin(a)*.030,-.045]],.0008,'copper');}}
 box(id('alt-diode-trio'),[.041,.010,.006],[.005,-.025,-.060],'phenolic',[],{},.002);for(let i=0;i<3;i++)tube(id('alt-diode-trio'),[[-.011+i*.013,-.025,-.060],[-.011+i*.013,-.012,-.060],[.035,-.014+i*.008,-.046]],.0008,'copper');
 box(id('alt-brush-holder'),[.027,.020,.025],[0,.020,-.074],'pickupPlastic',[],{},.002);for(const z of[-.069,-.078]){box(id('alt-brushes'),[.005,.011,.005],[0,.012,z],'dark',[],{},.0006);spring(id('alt-brushes'),[0,.025,z],.0022,.009,'y',5,.0005,'zinc');}
 cyl(id('alt-capacitor'),.006,.025,[.036,.028,-.058],'metal',[Math.PI/2,0,0]);tube(id('alt-capacitor'),[[.036,.028,-.045],[.041,.012,-.045],[.044,-.015,-.052]],.0008,'wire');
 sleeve(id('alt-output'),.009,.0035,.013,[.044,-.015,-.077],'pickupPlastic');cyl(id('alt-output'),.0035,.030,[.044,-.015,-.088],'copper',[Math.PI/2,0,0]);bolt(id('alt-output'),[.044,-.015,-.101],.006,'z');
 frame(id('alt-plug'),.023,.016,.003,.016,[-.032,.047,-.082],'plastic',.002);for(const x of[-.038,-.026])tube(id('alt-plug'),[[x,.047,-.089],[x,.067,-.111],[x+.04,.086,-.124]],.0015,'wire');tube(id('alt-plug'),[[.044,-.015,-.104],[.068,-.012,-.109],[.080,.037,-.105],[.07,.10,-.130]],.004,'rubber');
 for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])screw(id('alt-through-bolts'),[Math.cos(a)*.063,Math.sin(a)*.063,-.084],.0035,.142,'z',1);
 // Curved adjustment slot and open ribbed bracket, separate from the case.
 const bracket=new T.Shape();bracket.moveTo(-.040,-.113);bracket.lineTo(.091,-.085);bracket.lineTo(.113,.090);bracket.lineTo(.065,.112);bracket.lineTo(-.018,.083);bracket.closePath();const opening=new T.Path();opening.moveTo(-.011,-.058);opening.lineTo(.065,-.045);opening.lineTo(.073,.061);opening.lineTo(.025,.060);opening.closePath();bracket.holes.push(opening);
 for(const [x,y,r]of[[0,-.085,.006],[.085,.083,.0055],[-.018,.063,.0055]]){const hole=new T.Path();hole.absarc(x,y,r,0,Math.PI*2,true);bracket.holes.push(hole);}
 const slot=new T.Path();slot.absarc(0,0,.082,.53,1.11,false);slot.absarc(0,0,.072,1.11,.53,true);slot.closePath();bracket.holes.push(slot);const bg=new T.ExtrudeGeometry(bracket,{depth:.009,bevelEnabled:true,bevelSize:.0018,bevelThickness:.001,bevelSegments:3,curveSegments:32});add(id('alt-bracket'),bg,'castAluminum',[0,0,-.002]);
 for(const [a,b]of[[[-.025,-.098],[.090,-.073]],[[.096,-.07],[.101,.08]],[[.092,.09],[-.015,.071]]])tube(id('alt-bracket'),[[...a,.009],[...b,.009]],.003,'castAluminum');
 cyl(id('alt-pivot-bolt'),.005,.085,[0,-.085,.014],'zinc',[Math.PI/2,0,0]);bolt(id('alt-pivot-bolt'),[0,-.085,.061],.008,'z');sleeve(id('alt-pivot-bolt'),.009,.005,.039,[0,-.085,-.010],'zinc');
 bolt(id('alt-adjust-bolt'),[.049,.066,.052],.007,'z');cyl(id('alt-adjust-bolt'),.004,.044,[.049,.066,.030],'zinc',[Math.PI/2,0,0]);
 for(const [x,y]of[[.085,.083],[-.018,.063]])screw(id('alt-bracket-bolts'),[x,y,.013],.006,.031);
 plate(id('alt-heat-shield'),.141,.145,.0015,[0,0,-.111],'zinc',[[0,0,.024],[.044,-.015,.011]],.025);for(const x of[-.060,.060])box(id('alt-heat-shield'),[.002,.10,.018],[x,0,-.103],'zinc');
 const p=chargingDatums.alternator;bakeElectrical(groups,chargingParts.filter(p=>p.section==='charging-alternator').map(p=>p.id),(x,y,z)=>[p[0]-z,p[1]+y,p[2]+x]);
}
