import {buildMappedInterior} from './interior-mapped.js';
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
 // Spare, jack and stowage hardware share the dedicated native explorer.
 cyl('clutch-hydraulics',.023,.14,[.59,.578,-.737],'metal',[Math.PI/2,0,0]);
 cyl('clutch-hydraulics',.033,.081,[.59,.632,-.728],'reservoir',[0,0,0]);
 cyl('clutch-hydraulics',.037,.013,[.59,.678,-.728],'plastic',[0,0,0]);
 tube('clutch-hydraulics',[[.59,.56,-.80],[.60,.32,-.76],[.61,.25,.55],[.48,.36,.80],transmissionAttachment([.45,.53,1.09])],.003,'metal');
 cyl('clutch-hydraulics',.021,.132,transmissionAttachment([.45,.541,1.13]),'metal',[Math.PI/2+installationAngle,0,0]);
 cyl('clutch-hydraulics',.011,.067,transmissionAttachment([.45,.541,1.224]),'alloy',[Math.PI/2+installationAngle,0,0]);
 box('clutch-hydraulics',[.074,.017,.069],transmissionAttachment([.45,.518,1.14]),'dark',[installationAngle,0,0]);
 // Detailed thermostat assembly is shared with the engine explorer.
 // Exhaust geometry is shared with its dedicated component explorer.
 // Battery, charging components, power harness and optional equipment.
 // Battery, starter and generator are shared with their detail explorer.
 tube('harness',[[-.58,.66,.79],[-.45,.62,.64],[.54,.52,.58],[.55,.32,-.59],[.59,.48,-1.55]],.014,'wire');
 for(const x of [-.10,.11,.31])tube('harness',[[.54,.52,.58],[x,.60,.8],[x,.74,1.05]],.006,'wire');
 for(let i=0;i<8;i++)box('harness',[.020,.023,.008],[.55,.34,-.45+i*.095],'rubber');
 // C60 refrigeration geometry is shared with its dedicated detail explorer.
 cyl('shift-linkage',.057,.070,[.59,.637,1.64],'dark',[Math.PI/2,0,0],.057,{option:'cruise',value:true});
 tube('shift-linkage',[[.59,.637,1.64],[.42,.72,1.48],[.01,.82,1.20]],.006,'rubber',{option:'cruise',value:true});
}

export function buildInterior(h){
 buildMappedInterior(h);
 // Existing manual-rack input remains with its suspension assembly.
 h.cyl('steering-rack',.034,.080,[.36,.369,-1.32],'castAluminum',[.5,0,0]);
}
