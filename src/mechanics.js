import { buildWheelFace } from './wheels.js';
import * as T from 'three';
import {engineToVehicle,transmissionAttachment,installationAngle} from './powertrain-layout.js';
import {upperEngineDrop} from './engine-layout.js';
import { buildStructure } from './structure.js';

export function buildMechanics(h){
 const {add,box,cyl,tube,surface,profile,bolt,label,ring}=h;
 buildStructure(h);
 // Engine exterior geometry comes from the same builder as its explorer.
 // Air cleaner: close-fitting can, pleated paper element and stamped lid.
 cyl('air-cleaner',.117,.155,[.568,.534,.783],'blackPaint',[0,0,0]);
 ring('air-cleaner',.118,.007,[.568,.609,.783],'dark',[Math.PI/2,0,0]);
 cyl('air-filter',.106,.065,[.568,.607,.783],'amber',[0,0,0]);
 for(let i=0;i<64;i++){const a=i/64*Math.PI*2;box('air-filter',[.002,.062,.008],[.568+Math.cos(a)*.105,.607,.783+Math.sin(a)*.105],'amber',[0,-a,0]);}
 for(const y of [.572,.642])ring('air-filter',.102,.007,[.568,y,.783],'rubber',[Math.PI/2,0,0]);
 cyl('air-lid',.119,.015,[.568,.657,.783],'blackPaint',[0,0,0],.111);
 cyl('air-lid',.016,.012,[.568,.673,.783],'dark',[0,0,0]);
 box('air-lid',[.039,.007,.012],[.568,.681,.783],'alloy');
 const throttleInlet=engineToVehicle([.228,1.49-upperEngineDrop,0]);
 tube('intake-duct',[[.47,.59,.783],[.39,.64,.80],[.30,.68,.89],[throttleInlet[0]+.045,throttleInlet[1],throttleInlet[2]],throttleInlet],.027,'rubber');
 for(let i=0;i<7;i++)ring('intake-duct',.028,.003,[.37-i*.013,.65+i*.004,.82+i*.011],'rubber',[0,-.5,-.1]);
 // Clutch and transaxle: cast bell, case lobes, ribs and fasteners.
 // Independent, unequal halfshafts from the left-mounted differential.
 for(const [side,inner,outer] of [['left',.365,.70],['right',.19,-.70]]){
  const innerZ=1.1865; tube('axles',[[inner,.304,innerZ],[outer,.307,1.1865]],.013,'rotor');
  for(const [x,scale] of [[inner,1],[outer,.86]]){
   cyl('axles',.036*scale,.056,[x,.305,innerZ],'dark');
   for(let i=0;i<6;i++)ring('axles',(.026+Math.sin(i/5*Math.PI)*.010)*scale,.003,[x+(i-2.5)*.010,.305,innerZ],'rubber');
   for(const dx of [-.029,.029])ring('axles',.028*scale,.0018,[x+dx,.305,innerZ],'zinc');
  }
 }
 tube('shift-linkage',[[.045,.4,.0],[.03,.36,.46],[.31,.42,.8],transmissionAttachment([.43,.55,1.15])],.009,'rubber');
 tube('shift-linkage',[[-.045,.4,.0],[.12,.37,.44],[.39,.45,.8],transmissionAttachment([.46,.55,1.19])],.009,'rubber');
 box('shift-linkage',[.073,.017,.105],transmissionAttachment([.43,.56,1.16]),'metal',[installationAngle,0,0]);
 // Suspension and steering surfaces are shared with their component explorer.
 // Lathed tire sidewalls and machined 14-inch wheels at factory axle spacing.
 const tireProfile=[[-.102,.178],[-.112,.191],[-.109,.239],[-.096,.29],[-.079,.305],[.079,.305],[.096,.29],[.109,.239],[.112,.191],[.102,.178]];
 for(const s of [-1,1])for(const z of [-1.1865,1.1865]){
  const x=s*(z<0?.734:.746),y=.307;
  const tireGeo=new T.LatheGeometry(tireProfile.map(([a,r])=>new T.Vector2(r,a)),96);tireGeo.rotateZ(Math.PI/2);add('wheels',tireGeo,'rubber',[x,y,z]);
  buildWheelFace(h,x,y,z,s);
  for(const [r,offset] of [[.218,.111],[.26,.105],[.29,.096]])ring('wheels',r,.0006,[x+s*offset,y,z],'rubber');
  // A continuous road-tire crown with recessed grooves, not raised teeth.
  // Tread pattern is illustrative; its envelope retains the 307 mm radius.
  surface('wheels',528,32,(u,v)=>{
   const a=u*Math.PI*2,edge=Math.sin(v*Math.PI)**.35;
   const transverse=Math.max(0,Math.cos((u*88+Math.abs(v-.5)*.45)*Math.PI*2))**16;
   const channel=Math.max(...[.24,.50,.76].map(c=>Math.exp(-(((v-c)/.022)**2))));
   const r=.305+edge*(.002-.0013*Math.max(transverse,channel));
   return[x+(v-.5)*.158,y+Math.cos(a)*r,z+Math.sin(a)*r];
  },'rubber');
  // Tire markings on the outboard sidewall, each character follows the arc.
  const text='P215/60 R14';for(let i=0;i<text.length;i++){const a=(i-text.length/2)*.073*s;label('wheels',text[i],[.014,.018],[x+s*.113,y+Math.cos(a)*.267,z+Math.sin(a)*.267],[0,s*Math.PI/2,a*s],{background:'#111213',foreground:'#3d4143',width:64,height:64,font:'bold 48px Arial'});}
 }
 // Rotors, hubs, calipers and hydraulic components share the brake explorer
 // surfaces through buildVehicleBrakes rather than duplicate coarse proxies.
 // Front service compartment: factory DIY manual, printed 2-4 and 2-14.
 box('spaceframe',[1.09,.030,.87],[0,.261,-1.14],'plastic',[],{},.015);
 for(const s of [-1,1])profile('spaceframe',[[-1.58,.275],[-1.58,.45],[-.77,.55],[-.71,.28]],.023,s*.554,'plastic');
 const spareCentre=new T.Vector3(0,.45,-1.09),spareRotation=.48;
 const sparePoint=p=>new T.Vector3(...p).applyAxisAngle(new T.Vector3(1,0,0),spareRotation).add(spareCentre).toArray();
 const spareProfile=[[-.052,.159],[-.058,.205],[-.045,.254],[-.027,.267],[.027,.267],[.045,.254],[.058,.205],[.052,.159]];
 const spareTire=new T.LatheGeometry(spareProfile.map(([a,r])=>new T.Vector2(r,a)),72);add('spare-wheel',spareTire,'rubber',spareCentre.toArray(),[spareRotation,0,0]);
 cyl('spare-wheel',.164,.065,spareCentre.toArray(),'dark',[spareRotation,0,0]);
 ring('spare-wheel',.161,.005,sparePoint([0,.038,0]),'metal',[Math.PI/2+spareRotation,0,0]);
 cyl('spare-wheel',.064,.015,sparePoint([0,.04,0]),'metal',[spareRotation,0,0]);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cyl('spare-wheel',.023,.002,sparePoint([Math.cos(a)*.118,.037,Math.sin(a)*.118]),'rubber',[spareRotation,0,0]);}
 cyl('spare-wheel',.012,.115,spareCentre.toArray(),'metal',[spareRotation,0,0]);
 box('spare-wheel',[.09,.012,.027],sparePoint([0,.064,0]),'dark',[spareRotation,0,0]);
 box('spare-wheel',[.08,.057,.29],[-.45,.335,-1.03],'metal',[0,.1,.05]);
 tube('spare-wheel',[[-.49,.368,-1.15],[-.42,.40,-1.05],[-.49,.368,-.91]],.012,'dark');
 cyl('clutch-hydraulics',.023,.14,[.59,.578,-.737],'metal',[Math.PI/2,0,0]);
 cyl('clutch-hydraulics',.033,.081,[.59,.632,-.728],'reservoir',[0,0,0]);
 cyl('clutch-hydraulics',.037,.013,[.59,.678,-.728],'plastic',[0,0,0]);
 tube('clutch-hydraulics',[[.59,.56,-.80],[.60,.32,-.76],[.61,.25,.55],[.48,.36,.80],transmissionAttachment([.45,.53,1.09])],.003,'metal');
 cyl('clutch-hydraulics',.021,.132,transmissionAttachment([.45,.541,1.13]),'metal',[Math.PI/2+installationAngle,0,0]);
 cyl('clutch-hydraulics',.011,.067,transmissionAttachment([.45,.541,1.224]),'alloy',[Math.PI/2+installationAngle,0,0]);
 box('clutch-hydraulics',[.074,.017,.069],transmissionAttachment([.45,.518,1.14]),'dark',[installationAngle,0,0]);
 box('washer-reservoir',[.16,.155,.245],[.43,.43,-1.24],'reservoir',[],{},.034);
 cyl('washer-reservoir',.031,.024,[.43,.518,-1.29],'plastic',[0,0,0]);
 cyl('washer-reservoir',.017,.055,[.50,.412,-1.15],'plastic',[0,0,0]);
 tube('washer-reservoir',[[.5,.437,-1.15],[.54,.52,-.96],[.54,.71,-.67],[.30,.81,-.59]],.003,'rubber');
 // Detailed thermostat assembly is shared with the engine explorer.
 // Exhaust geometry is shared with its dedicated component explorer.
 // Battery, charging components, power harness and optional equipment.
 // Battery, starter and generator are shared with their detail explorer.
 tube('harness',[[-.58,.66,.79],[-.45,.62,.64],[.54,.52,.58],[.55,.32,-.59],[.59,.48,-1.55]],.014,'wire');
 for(const x of [-.10,.11,.31])tube('harness',[[.54,.52,.58],[x,.60,.8],[x,.74,1.05]],.006,'wire');
 for(let i=0;i<8;i++)box('harness',[.020,.023,.008],[.55,.34,-.45+i*.095],'rubber');
 // Optional compressor and condenser are attached to related existing records.
 cyl('ac-compressor',.069,.17,engineToVehicle([-.24,1.03,-.18]),'metal',[0,0,Math.PI/2],.069,{option:'airConditioning',value:true});
 cyl('ac-compressor',.067,.034,engineToVehicle([-.34,1.03,-.18]),'dark',[0,0,Math.PI/2],.067,{option:'airConditioning',value:true});
 box('radiator',[.64,.30,.027],[0,.456,-1.78],'metal',[-.13,0,0],{option:'airConditioning',value:true});
 tube('coolant-pipes',[engineToVehicle([-.24,1.03,-.18]),[-.51,.28,.8],[-.49,.18,-1.45],[-.25,.4,-1.79]],.009,'metal',{option:'airConditioning',value:true});
 cyl('shift-linkage',.057,.070,[.59,.637,1.64],'dark',[Math.PI/2,0,0],.057,{option:'cruise',value:true});
 tube('shift-linkage',[[.59,.637,1.64],[.42,.72,1.48],[.01,.82,1.20]],.006,'rubber',{option:'cruise',value:true});
}

export function buildInterior(h){
 const {box,cyl,tube,surface,profile,label,ring,add}=h;
 for(const s of [-1,1]){
  const x=s*.36;
  // Contoured cushion, lateral bolsters and integrated headrest bucket seats.
  box('seats',[.395,.103,.41],[x,.329,.11],'interior',[-.06,0,0],{},.046);
  const outline=new T.Shape();outline.moveTo(-.173,.36);outline.lineTo(.173,.36);outline.lineTo(.173,.69);outline.quadraticCurveTo(.17,.78,.121,.82);outline.lineTo(.121,.928);outline.quadraticCurveTo(.12,.96,.092,.961);outline.lineTo(-.092,.961);outline.quadraticCurveTo(-.12,.96,-.121,.928);outline.lineTo(-.121,.82);outline.quadraticCurveTo(-.17,.78,-.173,.69);outline.closePath();
  const back=new T.ExtrudeGeometry(outline,{depth:.09,bevelEnabled:true,bevelSize:.018,bevelThickness:.023,bevelSegments:5,curveSegments:16});const vertex=back.attributes.position;
  for(let i=0;i<vertex.count;i++)vertex.setZ(i,vertex.getZ(i)+.264+(vertex.getY(i)-.35)*.13);back.computeVertexNormals();add('seats',back,'interior',[x,0,0]);
  for(const dx of [-.155,.155]){
   box('seats',[.067,.17,.386],[x+dx,.38,.11],'vinyl',[-.11,0,0],{},.029);
   box('seats',[.078,.42,.113],[x+dx,.624,.291],'vinyl',[-.14,0,dx*-.2],{},.03);
   tube('seats',[[x+dx*.76,.373,-.073],[x+dx*.76,.359,.25],[x+dx*.79,.65,.29],[x+dx*.77,.837,.336]],.0017,'dark');
  }
  for(let i=0;i<6;i++)tube('seats',[[x-.113+i*.046,.377,-.065],[x-.113+i*.046,.351,.25],[x-.113+i*.046,.752,.322]],.0013,'vinyl');
  for(const dx of [-.061,.061]){box('seats',[.075,.078,.007],[x+dx,.912,.320],'vinyl',[-.13,0,0],{option:'speakerSeats',value:true},.012);for(let i=0;i<8;i++)box('seats',[.065,.001,.003],[x+dx,.881+i*.009,.314+i*.0012],'interior',[],{option:'speakerSeats',value:true});}
  box('seats',[.03,.035,.032],[x-s*.21,.38,.28],'dark');box('seats',[.022,.012,.025],[x-s*.21,.400,.28],'red');
  tube('seats',[[s*.63,.98,.43],[s*.63,.65,.4],[s*.61,.35,.2]],.014,'rubber');
  box('pedals',[.36,.009,.40],[x,.238,-.25],'interior',[],{option:'floorMats',value:true},.020);
 }
 box('dashboard',[1.27,.132,.218],[0,.721,-.545],'vinyl',[],{},.038);
 box('dashboard',[1.16,.19,.105],[0,.598,-.505],'vinyl');
 // The original 1985 instrument pod is shared with the wiring explorer.
 box('dashboard',[.197,.31,.127],[0,.572,-.455],'plastic',[-.05,0,0],{},.012);
 box('dashboard',[.176,.281,.006],[0,.574,-.382],'metal');
 // Vent outlets are shared with the HVAC explorer.
 for(const variant of ['am','amfm','cassette','equalizer']){
  const flags={option:'radio',value:variant};box('dashboard',[.153,.068,.013],[0,.535,-.373],'dark',[],flags);
  label('dashboard',variant==='am'?'AM  850':'FM  98.5',[.076,.021],[0,.548,-.363],[0,0,0],{background:'#112027',foreground:'#aaa994',font:'48px monospace'},flags);
  for(const s of [-1,1])cyl('dashboard',.011,.011,[s*.061,.518,-.362],'plastic',[Math.PI/2,0,0],.011,flags);
  if(['cassette','equalizer'].includes(variant))box('dashboard',[.081,.008,.007],[0,.515,-.361],'plastic',[],flags);
  if(variant==='equalizer')for(let i=0;i<5;i++)box('dashboard',[.004,.021,.004],[-.034+i*.017,.494,-.36],'alloy',[],flags);
 }
 // Option-specific HVAC controls are shared with their explorer.
 // Steering wheel rim and separate spokes, with a wrapped-finish variant.
 for(const mode of ['formula','leather']){
  const flags={option:'steeringWheel',value:mode};ring('steering-wheel',.159,.014,[.346,.739,-.196],mode==='leather'?'vinyl':'rubber',[.28,0,0],flags);
  for(const a of [.93,3.14,5.35])box('steering-wheel',[.037,.121,.020],[.346+Math.sin(a)*.071,.739+Math.cos(a)*.071,-.196],'dark',[.28,0,-a],flags,.008);
  cyl('steering-wheel',.05,.024,[.346,.739,-.185],'plastic',[Math.PI/2+.28,0,0],.05,flags);
 }
 tube('steering-wheel',[[.346,.739,-.20],[.346,.62,-.49]],.022,'dark');
 tube('steering-wheel',[[.382,.70,-.26],[.555,.71,-.26]],.006,'dark');
 box('steering-wheel',[.043,.013,.017],[.554,.71,-.26],'plastic',[],{option:'cruise',value:true});
 // Centre console, boot folds, gear knob, window and mirror controls.
 box('shifter',[.253,.116,.69],[0,.362,.027],'vinyl',[],{},.016);
 box('shifter',[.192,.006,.242],[0,.424,-.157],'metal');
 for(let i=0;i<5;i++)box('shifter',[.10-i*.014,.015,.10-i*.014],[0,.443+i*.012,-.175],'rubber',[],{},.009);
 cyl('shifter',.009,.085,[0,.529,-.175],'alloy',[0,0,0]);
 add('shifter',new T.SphereGeometry(.026,32,24),'vinyl',[0,.577,-.175]);
 for(const s of [-1,1])box('shifter',[.026,.014,.040],[s*.07,.433,.08],'dark',[],{option:'powerWindows',value:true});
 cyl('shifter',.014,.011,[0,.438,.18],'dark',[0,0,0],.014,{option:'powerMirrors',value:true});
 for(const [role,x,w,height] of [['accelerator',.226,.035,.095],['clutch',.46,.061,.054]]){
  tube('pedals',[[x,.52,-.56],[x,.30,-.47]],.009,'metal');box('pedals',[w,height,.018],[x,.282,-.457],'rubber',[-.4,0,0],{},.008);
  for(let i=0;i<5;i++)box('pedals',[w*.88,.002,.003],[x,.262+i*.010,-.445],'dark',[-.4,0,0],{},.0006);
 }
 // Lower column and driver-side rack pinion; asymmetric LHD geometry.
 tube('steering-wheel',[[.346,.62,-.49],[.35,.46,-.68],[.36,.36,-1.31]],.014,'dark');
 cyl('steering-rack',.034,.080,[.36,.369,-1.32],'castAluminum',[.5,0,0]);

 for(const s of [-1,1])box('dashboard',[.242,.013,.116],[s*.304,1.111,-.087],'vinyl',[0,0,0],{},.008);
 box('dashboard',[.135,.003,.064],[-.30,1.10,-.087],'chrome',[],{option:'vanityMirror',value:true});
 // Courtesy lamps are supplied by the shared lighting builder.
}
