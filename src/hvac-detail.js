import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {hvacParts,hvacSections} from './hvac-catalog.js';
export function hvacMaterials(base=createMaterials()){const m={...base};for(const k of ['plastic','rubber','metal','dark','copper'])m[k]=base[k].clone();m.plastic.bumpScale=.000035;m.plastic.roughness=.53;m.rubber.bumpScale=.00004;m.metal.bumpScale=.00005;m.dark.bumpScale=.00002;m.copper.roughness=.37;return m;}
export function createHvacDetail(){const root=new T.Group(),groups=new Map();for(const p of hvacParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'cooling',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(hvacSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,hvacMaterials());buildHvac(h);for(const p of hvacParts)if(p.option)for(const mesh of groups.get(p.id).children)Object.assign(mesh.userData,{option:p.option,value:p.value});h.optimize();correctLegacyHandedness(groups);return{root,groups};}
const pfx=k=>'hv-'+k;
function hvacTools(h){
 const {add,box,tube,surface}=h;
 function contour(outline){return outline.flatMap((p,i)=>{const a=outline[(i+outline.length-1)%outline.length],b=outline[(i+1)%outline.length],la=Math.hypot(a[0]-p[0],a[1]-p[1]),lb=Math.hypot(b[0]-p[0],b[1]-p[1]),r=Math.min(.009,la*.18,lb*.18),u=[p[0]+(a[0]-p[0])*r/la,p[1]+(a[1]-p[1])*r/la],v=[p[0]+(b[0]-p[0])*r/lb,p[1]+(b[1]-p[1])*r/lb];return Array.from({length:5},(_,k)=>{const t=k/4;return [0,1].map(d=>(1-t)**2*u[d]+2*(1-t)*t*p[d]+t*t*v[d]);});});}

 function rounded(x0,y0,x1,y1,r=.008,Path=T.Shape){const s=new Path();s.moveTo(x0+r,y0);s.lineTo(x1-r,y0);s.quadraticCurveTo(x1,y0,x1,y0+r);s.lineTo(x1,y1-r);s.quadraticCurveTo(x1,y1,x1-r,y1);s.lineTo(x0+r,y1);s.quadraticCurveTo(x0,y1,x0,y1-r);s.lineTo(x0,y0+r);s.quadraticCurveTo(x0,y0,x0+r,y0);return s;}
 function sheet(id,outline,holes,z,thickness=.003,mat='plastic',flags={}){const sh=new T.Shape();contour(outline).forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();for(const hole of holes){if(hole.length===3){const hp=new T.Path();hp.absarc(...hole,0,Math.PI*2,true);sh.holes.push(hp);}else sh.holes.push(rounded(...hole,.004,T.Path));}const g=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:true,bevelSize:.001,bevelThickness:.0007,bevelSegments:2,curveSegments:24});g.translate(0,0,-thickness/2);return add(id,g,mat,[0,0,z],[],flags);}
 function frame(id,w,height,wall,depth,p,mat='plastic',flags={}){const [x,y,z]=p;return sheet(id,[[x-w/2,y-height/2],[x+w/2,y-height/2],[x+w/2,y+height/2],[x-w/2,y+height/2]],[[x-w/2+wall,y-height/2+wall,x+w/2-wall,y+height/2-wall]],z,depth,mat,flags);}
 function sleeve(id,r,b,l,p,mat='zinc',axis=[0,0,1],flags={}){const a=new T.Shape();a.absarc(0,0,r,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,b,0,Math.PI*2,true);a.holes.push(hole);const g=new T.ExtrudeGeometry(a,{depth:l,bevelEnabled:false,curveSegments:40});g.translate(0,0,-l/2);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),new T.Vector3(...axis).normalize()));return add(id,g,mat,p,[],flags);}
 function rim(id,outline,z,r=.003,mat='plastic',flags={}){const points=contour(outline).map(([x,y])=>new T.Vector3(x,y,z)),curve=new T.CurvePath();for(let i=0;i<points.length;i++)curve.add(new T.LineCurve3(points[i],points[(i+1)%points.length]));return add(id,new T.TubeGeometry(curve,points.length*3,r,8,true),mat,[0,0,0],[],flags);}
 function walls(id,outline,z0,z1,mat='plastic',flags={}){const points=contour(outline);for(let k=0;k<points.length;k++){const a=points[k],b=points[(k+1)%points.length];surface(id,1,5,(u,v)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,z0+(z1-z0)*v],mat,flags);}rim(id,outline,z0,.002,mat,flags);rim(id,outline,z1,.002,mat,flags);}
 // Four continuous walls and open ends. Cross sections can taper, bend and
 // turn; no black disks masquerade as openings.
 function duct(id,sections,mat='plastic',flags={}){for(let j=0;j<sections.length-1;j++){const a=sections[j],b=sections[j+1];for(let side=0;side<4;side++)surface(id,8,3,(u,v)=>{const sec=a.map((n,k)=>n+(b[k]-n)*u),[x,y,z,w,he]=sec;return side===0?[x+(v-.5)*w,y+he/2,z]:side===1?[x+w/2,y+(v-.5)*he,z]:side===2?[x+(.5-v)*w,y-he/2,z]:[x-w/2,y+(.5-v)*he,z];},mat,flags);}for(const a of [sections[0],sections.at(-1)])frame(id,a[3]+.004,a[4]+.004,.003,.007,a.slice(0,3),mat,flags);}
 return{rounded,sheet,frame,sleeve,rim,walls,duct};
}
// Shared heater geometry is also used by the coolant-circuit explorer. This
// prevents the earlier coarse core from remaining superimposed in the car.
export function buildHvacCore(h,ids={core:'hv-core',tanks:'hv-core-tanks',seals:'hv-core-seals'}){
 const {box,tube,surface}=h;
 for(const ac of [false,true]){
  const flags={option:'airConditioning',value:ac},cx=ac?-.267:-.250,cy=.574,z=-.539,w=ac?.177:.159,ht=ac?.174:.155,d=ac?.034:.044;
  for(let j=0;j<24;j++){const y=cy-ht/2+j*ht/23;box(ids.core,[w,.002,d],[cx,y,z],'copper',[],flags,.001);if(j<23)surface(ids.core,144,2,(u,v)=>[cx-w/2+w*u,y+ht/46+Math.sin(u*Math.PI*144)*ht/58,z-d/2+d*v],'copper',flags);}
  for(const s of [-1,1]){box(ids.tanks,[.025,ht+.013,d+.006],[cx+s*(w/2+.012),cy,z],'copper',[],flags,.010);box(ids.seals,[.014,ht+.025,.009],[cx+s*(w/2+.026),cy,z+d/2+.003],'rubber',[],flags,.002);box(ids.seals,[w+.05,.008,.009],[cx,cy+s*(ht/2+.007),z+d/2+.003],'rubber',[],flags,.002);}
  // Different neck pairs share the early engine circuit; the shape is a
  // reference reconstruction rather than a measured replacement core.
  for(const [i,x]of [[0,cx-w/2-.012],[1,cx+w/2+.012]]){const points=[[x,cy+.040,z],[x,cy+.060,z-.025],[i?-.19:-.35,.642,-.618],[i?-.19:-.35,.642,-.678]];tube(ids.tanks,points,i?.008:.009,'copper',flags);const end=points.at(-1);h.ring(ids.tanks,i?.0088:.0098,.001,end,'copper',[0,0,0],flags);}
 }
}
export function buildHvac(h){buildHvacCore(h);buildModule(h);buildBlower(h);buildDucts(h);buildControls(h);buildEvaporator(h);}
function buildModule(h){
 const {box,cyl,tube,bolt,surface}=h,{sheet,frame,sleeve,rim,walls,duct}=hvacTools(h),id=pfx;
 const outline=[[-.701,.541],[-.692,.682],[-.663,.721],[-.610,.739],[-.552,.727],[-.491,.692],[-.141,.692],[-.113,.650],[-.112,.466],[-.246,.443],[-.382,.462],[-.479,.489],[-.659,.502]];
 sheet(id('case'),outline,[[-.604,.621,.072],[-.377,.479,-.155,.660]],-.655,.004);walls(id('case'),outline,-.655,-.566);rim(id('case'),outline,-.651,.0035);
 // Fan scroll surrounding a circular wheel, with an open discharge to the
 // core chamber. A planar mounting plate alone would conceal its shape.
 for(const skin of [0,.003])surface(id('case'),96,10,(u,v)=>{const a=-.30+u*Math.PI*1.82,r=.074+.013*u+skin;return[-.604+Math.cos(a)*r,.621+Math.sin(a)*r,-.654-.12*v];},'plastic');
 frame(id('case'),.231,.190,.007,.011,[-.266,.566,-.565]);for(const x of [-.381,-.155])box(id('case'),[.009,.187,.015],[x,.568,-.606],'plastic',[],{},.003);
 sheet(id('cover'),[[-.387,.468],[-.148,.468],[-.142,.663],[-.376,.670]],[],-.493,.003);rim(id('cover'),[[-.386,.469],[-.148,.469],[-.146,.664],[-.377,.669]],-.489,.003);
 for(const x of [-.367,-.166])box(id('cover'),[.005,.142,.009],[x,.563,-.487],'plastic',[],{},.002);
 frame(id('cover-seal'),.233,.191,.009,.003,[-.266,.565,-.500],'rubber');
 sheet(id('tube-seal'),[[-.383,.618],[-.158,.618],[-.158,.666],[-.383,.666]],[[-.350,.642,.010],[-.190,.642,.009]],-.650,.008,'rubber');
 box(id('core-clamp'),[.222,.013,.003],[-.267,.594,-.510],'zinc',[],{},.001);for(const x of [-.378,-.156])box(id('core-clamp'),[.015,.022,.018],[x,.59,-.517],'zinc',[],{},.002);
 const door=box(id('temperature-door'),[.202,.160,.002],[-.269,.568,-.601],'dark',[0,.20,0],{},.001);for(const s of [-1,1])box(id('temperature-door'),[.008,.158,.003],[-.269+s*.099,.568,-.601-s*.020],'rubber',[],{},.001);
 tube(id('temperature-shaft'),[[-.392,.493,-.616],[-.14,.493,-.616]],.003,'zinc');box(id('temperature-shaft'),[.027,.009,.003],[-.120,.493,-.616],'zinc',[0,.35,0],{},.002);cyl(id('temperature-shaft'),.004,.013,[-.108,.493,-.610],'zinc',[0,0,0]);sleeve(id('case-seal'),.077,.070,.005,[-.604,.621,-.672],'rubber');
 // Upper chamber open toward the defroster duct and rear cabin distributor.
 duct(id('distributor'),[[-.348,.711,-.607,.389,.062],[-.335,.736,-.539,.350,.065],[-.308,.724,-.471,.305,.061]]);
 box(id('distributor'),[.003,.063,.127],[-.381,.728,-.537],'plastic');
 const top=frame(id('distributor-cover'),.378,.136,.020,.004,[-.338,-.539,0]);top.geometry.rotateX(Math.PI/2);top.position.set(0,.762,0);
 // Top surfaces leave the defrost throat open.
 for(const x of [-.496,-.164])box(id('distributor-cover'),[.054,.004,.136],[x,.762,-.539],'plastic',[],{},.002);
 box(id('vent-door'),[.152,.058,.003],[-.247,.723,-.511],'dark',[.28,0,0],{},.001);box(id('defrost-door'),[.146,.005,.082],[-.427,.749,-.537],'dark',[.10,0,0],{},.001);
 tube(id('door-shafts'),[[-.520,.748,-.537],[-.336,.748,-.537]],.003,'zinc');tube(id('door-shafts'),[[-.333,.724,-.511],[-.148,.724,-.511]],.003,'zinc');for(const [x,y,z]of [[-.526,.748,-.537],[-.142,.724,-.511]])box(id('door-shafts'),[.008,.025,.005],[x,y+.01,z],'zinc',[.3,0,0],{},.002);
 sheet(id('cable-bracket'),[[-.146,.505],[-.117,.502],[-.097,.535],[-.117,.548]],[[-.123,.524,.004]],-.615,.002,'zinc');
 for(const [x,y,z]of [[-.371,.480,-.486],[-.164,.480,-.486],[-.371,.657,-.486],[-.164,.657,-.486],[-.690,.548,-.664],[-.676,.689,-.664],[-.541,.708,-.664],[-.123,.637,-.664]])bolt(id('fasteners'),[x,y,z],.004,'z');
 for(const [key,p]of [['inlet-actuator',[-.523,.730,-.602]],['mode-actuator',[-.123,.726,-.529]]]){box(id(key),[.041,.052,.020],p,'plastic',[],{},.009);cyl(id(key),.018,.023,[p[0],p[1]-.005,p[2]-.006],'plastic',[Math.PI/2,0,0]);for(const y of [-.032,.032]){sleeve(id(key),.006,.002,.004,[p[0],p[1]+y,p[2]],'plastic');bolt(id(key),[p[0],p[1]+y,p[2]+.004],.003,'z');}box(id(key),[.018,.013,.010],[p[0]+.026,p[1],p[2]],'plastic');}
 tube(id('actuator-links'),[[-.523,.721,-.611],[-.540,.746,-.611],[-.526,.759,-.537]],.002,'zinc');tube(id('actuator-links'),[[-.123,.727,-.537],[-.142,.735,-.534],[-.143,.737,-.511]],.002,'zinc');for(const p of [[-.526,.759,-.537],[-.143,.737,-.511]])sleeve(id('actuator-links'),.004,.002,.002,p,'zinc');
}
function buildBlower(h){
 const {add,box,cyl,tube,bolt,surface,ring}=h,{sheet,sleeve,frame}=hvacTools(h),{spring}=mechanicalTools(h),id=pfx,x=-.604,y=.621;
 sheet(id('blower-cover'),[[x-.080,y-.049],[x-.072,y+.058],[x-.047,y+.077],[x+.051,y+.077],[x+.081,y+.019],[x+.067,y-.069],[x-.043,y-.079]],[[x,y,.066]],-.782,.004);
 sleeve(id('blower-cover'),.070,.065,.012,[x,y,-.779],'plastic');
 // A squirrel-cage wheel: 42 curved sheet vanes rather than radial paddles.
 for(let i=0;i<42;i++){const a=i*Math.PI*2/42;for(const skin of [-1,1])surface(id('wheel'),7,4,(u,v)=>{const r=.051+u*.012,angle=a+.09*Math.sin(u*Math.PI/2);return[x+Math.cos(angle)*r,y+Math.sin(angle)*r,-.757+v*.061+skin*.0002];},'dark');}
 sleeve(id('wheel'),.064,.051,.003,[x,y,-.757],'dark');sleeve(id('wheel'),.064,.020,.004,[x,y,-.696],'dark');cyl(id('wheel'),.014,.033,[x,y,-.706],'dark',[Math.PI/2,0,0]);
 sleeve(id('wheel-washer'),.009,.0035,.0014,[x,y,-.687],'zinc');bolt(id('wheel-nut'),[x,y,-.683],.006,'z');
 sleeve(id('motor-gasket'),.055,.046,.002,[x,y,-.790],'rubber');
 cyl(id('motor'),.041,.085,[x,y,-.850],'zinc',[Math.PI/2,0,0]);cyl(id('motor'),.043,.010,[x,y,-.894],'dark',[Math.PI/2,0,0]);cyl(id('motor'),.014,.008,[x,y,-.901],'dark',[Math.PI/2,0,0]);cyl(id('motor'),.003,.094,[x,y,-.754],'zinc',[Math.PI/2,0,0]);
 sleeve(id('motor'),.055,.026,.004,[x,y,-.794],'zinc');for(let i=0;i<3;i++){const a=i*Math.PI*2/3+.35,px=x+Math.cos(a)*.057,py=y+Math.sin(a)*.057;sheet(id('motor'),[[px-.011,py-.010],[px+.011,py-.010],[px+.012,py+.010],[px-.012,py+.010]],[[px,py,.0035]],-.794,.004,'zinc');bolt(id('motor-screws'),[px,py,-.800],.004,'z');}for(const dx of [-.027,.027])bolt(id('motor'),[x+dx,y,-.901],.003,'z');
 tube(id('cooling-hose'),[[x+.031,y-.020,-.88],[x+.045,y-.045,-.86],[x+.058,y-.070,-.816],[x+.056,y-.050,-.779]],.006,'rubber');
 sleeve(id('ground'),.005,.002,.001,[x-.041,y-.023,-.879],'zinc');tube(id('ground'),[[x-.041,y-.023,-.88],[x-.057,y-.033,-.861],[x-.070,y-.028,-.821]],.002,'wire');bolt(id('ground'),[x-.041,y-.023,-.88],.002,'z');
 frame(id('connector'),.021,.016,.003,.019,[x-.030,y+.034,-.878],'plastic');for(const dx of [-.004,.004]){box(id('connector'),[.002,.006,.008],[x-.030+dx,y+.034,-.870],'zinc',[],{},.001);tube(id('connector'),[[x-.030+dx,y+.034,-.880],[x-.062+dx,y+.050,-.853],[x-.072+dx,y+.038,-.812]],.002,dx<0?'wire':'wirePurple');}
 const rx=-.456,ry=.664,rz=-.709;sheet(id('resistor'),[[rx-.027,ry-.020],[rx+.027,ry-.020],[rx+.027,ry+.020],[rx-.027,ry+.020]],[[rx-.020,ry,.0025],[rx+.020,ry,.0025]],rz,.003,'phenolic');
 for(const ac of [false,true]){const flags={option:'airConditioning',value:ac};for(let i=0;i<(ac?3:2);i++){const py=ry-.012+i*.011;for(const dx of [-.013,.013])box(id('resistor'),[.002,.003,.021],[rx+dx,py,rz+.012],'zinc',[],flags,.001);tube(id('resistor'),Array.from({length:100},(_,j)=>{const u=j/99,a=u*(8+i*2)*Math.PI*2;return[rx-.013+u*.026,py+Math.cos(a)*.0027,rz+.024+Math.sin(a)*.0027];}),.0005,'zinc',flags);}box(id('resistor'),[.021,.016,.020],[rx,ry,rz-.012],'plastic',[],flags,.003);}
 frame(id('resistor-seal'),.054,.040,.006,.002,[rx,ry,rz+.003],'rubber');
 box(id('relay'),[.030,.040,.029],[-.468,.700,-.665],'plastic',[],{},.004);sheet(id('relay'),[[-.49,.678],[-.448,.678],[-.448,.728],[-.49,.728]],[[-.469,.721,.003]],-.649,.002,'zinc');for(let i=0;i<4;i++)box(id('relay'),[.003,.010,.001],[-.478+i*.006,.675,-.657],'zinc',[],{},.001);
}
function buildDucts(h){
 const {box,tube,bolt}=h,{duct,frame,sheet}=hvacTools(h),id=pfx;
 frame(id('module-gasket'),.582,.284,.009,.004,[-.407,.590,-.581],'rubber');
 duct(id('defrost-duct'),[[0,.744,-.570,.640,.035],[0,.758,-.594,1.08,.022],[0,.771,-.615,1.095,.013]]);
 // Divider leaves two long windshield throats, with open ends and real lips.
 box(id('defrost-duct'),[.046,.023,.053],[0,.761,-.591],'plastic',[],{},.004);
 for(const s of [-1,1])frame(id('defrost-seal'),.508,.022,.003,.002,[s*.280,.771,-.619],'rubber');
 duct(id('dash-duct'),[[0,.691,-.566,1.070,.052],[0,.689,-.505,1.145,.049],[0,.699,-.455,1.166,.044]]);
 // Branches reach the outlets without filling their openings.
 for(const x of [-.514,.514]){duct(id('dash-duct'),[[x,.699,-.454,.137,.042],[x,.718,-.431,.142,.046]]);frame(id('duct-foam'),.150,.052,.006,.006,[x,.718,-.431],'rubber');}
 duct(id('dash-duct'),[[0,.690,-.493,.149,.042],[0,.678,-.388,.149,.042]]);
 for(const [key,x,y,z,w]of [['left-outlet',.514,.718,-.422,.150],['right-outlet',-.514,.718,-.422,.150],['center-outlet',0,.678,-.376,.156]]){frame(id(key),w,.052,.006,.018,[x,y,z],'plastic');for(let i=0;i<4;i++)box(id(key),[w-.014,.0023,.021],[x,y-.015+i*.01,z+.004],'dark',[.12,0,0],{},.001);box(id(key),[.011,.006,.007],[x+.021,y-.005,z+.017],'plastic',[],{},.001);}
 duct(id('floor-duct'),[[-.231,.522,-.491,.163,.039],[-.136,.447,-.472,.244,.037]]);for(const s of [-1,1])duct(id('floor-duct'),[[-.136+s*.073,.447,-.472,.092,.037],[-.136+s*.135,.405,-.415,.072,.040]]);
 for(const x of [-.56,-.32,.32,.56])bolt(id('duct-fasteners'),[x,.733,-.481],.003);for(const x of [-.50,.50])bolt(id('duct-fasteners'),[x,.781,-.618],.003);
}
function buildControls(h){
 const {box,cyl,tube,bolt,label}=h,{sheet,frame,sleeve}=hvacTools(h),id=pfx,cx=0,cy=.612,z=-.365;
 frame(id('control-housing'),.161,.067,.005,.053,[cx,cy,z-.029],'plastic');for(const s of [-1,1]){sheet(id('control-housing'),[[s*.089-.009,cy-.025],[s*.089+.009,cy-.025],[s*.089+.009,cy+.025],[s*.089-.009,cy+.025]],[[s*.089,cy,.003]],z-.024,.004,'plastic');bolt(id('control-screws'),[s*.089,cy,z-.020],.003,'z');}
 for(const ac of [false,true]){
  const f={option:'airConditioning',value:ac};sheet(id('control-face'),[[-.079,cy-.033],[.079,cy-.033],[.079,cy+.033],[-.079,cy+.033]],[[.053,cy-.002,.012],[-.066,cy-.022,.030,cy-.015],...(ac?Array.from({length:7},(_,i)=>[.022-i*.014,cy+.012,.0048]):[[-.066,cy+.005,.030,cy+.011]])],z,.002,'dark',f);
  // Text sits on physical face surfaces; no reference photos or billboards.
  label(id('control-face'),'COLD                      HOT',[.096,.008],[-.017,cy-.009,z+.002],[0,0,0],{font:'42px Arial',background:'#191c1e',foreground:'#c9cec9'},f);
  if(ac){for(const [i,text]of ['OFF','MAX','NORM','BI-LEV','VENT','HTR','DEF'].entries())label(id('control-face'),text,[.012,.0055],[.022-i*.014,cy+.025,z+.002],[0,0,0],{width:256,height:96,font:'48px Arial',background:'#191c1e',foreground:'#c9cec9'},f);}else label(id('control-face'),'VENT   BI-LEV   HTR   DEF',[.102,.008],[-.017,cy+.024,z+.002],[0,0,0],{font:'42px Arial',background:'#191c1e',foreground:'#c9cec9'},f);
  label(id('control-face'),ac?'LO    HI':'OFF LO HI',[.028,.007],[.053,cy+.015,z+.002],[0,0,0],{font:'42px Arial',background:'#191c1e',foreground:'#c9cec9'},f);
  box(id('control-face'),[.119,.002,.003],[-.010,cy+.030,z-.002],'pickupPlastic',[],f,.001);
 }
 box(id('fan-switch'),[.029,.028,.030],[.053,cy-.002,z-.040],'phenolic',[],{},.004);cyl(id('fan-switch'),.003,.038,[.053,cy-.002,z-.008],'zinc',[Math.PI/2,0,0]);for(const x of [.044,.053,.062])box(id('fan-switch'),[.004,.012,.001],[x,cy-.021,z-.049],'zinc',[],{},.001);
 cyl(id('fan-knob'),.011,.014,[.053,cy-.002,z+.009],'plastic',[Math.PI/2,0,0]);for(let i=0;i<20;i++){const a=i*Math.PI/10;box(id('fan-knob'),[.0012,.003,.010],[.053+Math.cos(a)*.0108,cy-.002+Math.sin(a)*.0108,z+.009],'dark',[0,0,a-Math.PI/2],{},.0005);}box(id('fan-knob'),[.002,.010,.002],[.053,cy+.000,z+.017],'white',[],{},.0005);
 sleeve(id('knob-spring'),.0045,.003,.006,[.053,cy-.002,z+.002],'zinc');
 box(id('temperature-slider'),[.012,.009,.012],[.009,cy-.018,z+.006],'plastic',[],{},.002);box(id('temperature-slider'),[.005,.003,.047],[.009,cy-.018,z-.020],'zinc',[],{},.001);tube(id('temperature-slider'),[[.009,cy-.018,z-.042],[-.012,cy-.018,z-.059]],.002,'zinc');
 tube(id('temperature-cable'),[[-.012,cy-.018,z-.059],[-.077,.602,-.452],[-.114,.568,-.530],[-.116,.502,-.604]],.003,'rubber');tube(id('temperature-cable'),[[-.116,.502,-.604],[-.108,.493,-.610]],.0008,'zinc');
 cyl(id('control-lamp'),.004,.013,[-.062,cy+.027,z-.034],'plastic',[Math.PI/2,0,0]);cyl(id('control-lamp'),.003,.009,[-.062,cy+.027,z-.023],'white',[Math.PI/2,0,0]);
 box(id('mode-slider'),[.012,.009,.012],[-.031,cy+.008,z+.006],'plastic',[],{},.002);box(id('mode-slider'),[.004,.003,.043],[-.031,cy+.008,z-.019],'zinc',[],{},.001);
 for(const end of [[-.525,.758,-.537],[-.144,.738,-.511]])tube(id('mode-slider'),[[-.031,cy+.008,z-.043],[-.09,.645,-.457],[-.18,.690,-.54],[end[0],end[1],end[2]]],.0025,'rubber');
 for(let i=0;i<7;i++){const x=.022-i*.014;cyl(id('mode-buttons'),.0044,.018,[x,cy+.012,z+.007],'plastic',[Math.PI/2,0,0]);box(id('mode-buttons'),[.009,.009,.006],[x,cy+.012,z-.009],'plastic',[],{},.002);}box(id('mode-buttons'),[.103,.014,.019],[-.020,cy+.012,z-.020],'phenolic',[],{},.003);
}
function buildEvaporator(h){
 const {add,box,cyl,tube,ring,surface,bolt}=h,{sheet,frame,sleeve,walls}=hvacTools(h),id=pfx,cx=-.437,cy=.568,cz=-.730,w=.151,ht=.193;
 for(let j=0;j<27;j++){const y=cy-ht/2+j*ht/26;box(id('evaporator'),[w,.0022,.070],[cx,y,cz],'metal',[],{},.001);if(j<26)surface(id('evaporator'),110,2,(u,v)=>[cx-w/2+u*w,y+ht/52+Math.sin(u*Math.PI*110)*.0025,cz-.034+v*.068],'metal');}
 for(const s of [-1,1])box(id('evaporator'),[.013,ht+.008,.075],[cx+s*(w/2+.006),cy,cz],'metal',[],{},.004);
 const outline=[[cx-.098,cy-.111],[cx+.091,cy-.111],[cx+.108,cy-.075],[cx+.102,cy+.116],[cx-.095,cy+.116]];
 sheet(id('evaporator-cover'),outline,[],cz-.071,.004);walls(id('evaporator-cover'),outline,cz-.071,cz+.025);for(let i=0;i<4;i++)box(id('evaporator-cover'),[.006,.182,.006],[cx-.065+i*.043,cy,cz-.077],'plastic',[],{},.002);
 frame(id('evaporator-seal'),w+.031,ht+.025,.009,.005,[cx,cy,cz+.032],'rubber');
 sleeve(id('drain'),.010,.006,.024,[cx,cy-.126,cz+.006],'rubber',[0,1,0]);tube(id('drain'),[[cx,cy-.12,cz+.006],[cx,cy-.15,cz+.003],[cx,cy-.16,cz-.03]],.007,'rubber');sleeve(id('drain'),.012,.007,.003,[cx,cy-.113,cz+.006],'rubber',[0,1,0]);
 const ax=-.526,ay=.595,az=-.899;
 // Spun shell with domed shoulders and a continuous rolled center seam.
 const profile=[[-.103,.009],[-.099,.026],[-.093,.035],[-.082,.039],[.077,.039],[.091,.035],[.099,.020],[.101,.008]];add(id('accumulator'),new T.LatheGeometry(profile.map(([y,r])=>new T.Vector2(r,y)),64),'alloy',[ax,ay,az]);ring(id('accumulator'),.0395,.0017,[ax,ay-.010,az],'zinc',[Math.PI/2,0,0]);for(const dx of [-.022,.022]){sleeve(id('accumulator'),.008,.005,.027,[ax+dx,ay+.105,az],'alloy',[0,1,0]);sleeve(id('accumulator'),.011,.007,.010,[ax+dx,ay+.121,az],'zinc',[0,1,0]);}
 sleeve(id('accumulator-bracket'),.043,.040,.020,[ax,ay-.032,az],'zinc',[0,1,0]);box(id('accumulator-bracket'),[.060,.003,.070],[ax,ay-.110,az],'zinc',[],{},.003);box(id('accumulator-bracket'),[.054,.122,.003],[ax,ay-.050,az+.044],'zinc',[],{},.003);for(const y of [ay-.08,ay])bolt(id('accumulator-bracket'),[ax,y,az+.049],.004,'z');
 cyl(id('cycling-switch'),.013,.027,[ax-.026,ay+.092,az-.010],'plastic',[0,0,0]);cyl(id('cycling-switch'),.011,.009,[ax-.026,ay+.075,az-.010],'zinc',[0,0,0]);frame(id('cycling-switch'),.021,.016,.003,.012,[ax-.026,ay+.110,az-.010],'plastic');
 const ox=-.351,oy=.652,oz=-.817;sleeve(id('orifice'),.0042,.0013,.039,[ox,oy,oz],'pickupPlastic');for(const dz of [-.016,.016])sleeve(id('orifice'),.0052,.0035,.0017,[ox,oy,oz+dz],'rubber');for(let j=0;j<10;j++){const a=j*Math.PI/5;tube(id('orifice'),[[ox+Math.cos(a)*.0041,oy+Math.sin(a)*.0041,oz-.019],[ox+Math.cos(a)*.0041,oy+Math.sin(a)*.0041,oz+.019]],.00025,'zinc');}for(let j=0;j<12;j++)ring(id('orifice'),.0042,.0002,[ox,oy,oz-.018+j*.0033],'zinc',[0,0,0]);
 for(const [i,points]of [[0,[[cx-.065,.655,cz],[cx-.065,.697,-.775],[ax+.022,ay+.14,az],[ax+.022,ay+.119,az]]],[1,[[cx+.067,.649,cz],[ox,oy,oz],[ox,.64,-.880]]]]){tube(id('evaporator-pipes'),points,i?.006:.010,'alloy');for(const p of [points[0],points.at(-1)])sleeve(id('evaporator-pipes'),i?.008:.013,i?.006:.010,.012,p,'zinc');}
}
