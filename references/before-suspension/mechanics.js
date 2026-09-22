import { buildWheelFace } from './wheels.js';
import * as T from 'three';
import { buildStructure } from './structure.js';

export function buildMechanics(h){
 const {add,box,cyl,tube,surface,profile,bolt,label,ring}=h;
 buildStructure(h);
 // V6 block and separated heads / valve covers.
 box('engine-block',[.50,.28,.37],[.11,.49,1.17],'iron');
 cyl('engine-block',.16,.51,[.11,.45,1.17],'iron');
 for(const z of [.99,1.34]){
  box('engine-block',[.54,.19,.19],[.11,.61,z],'iron',[z<1.1?-.35:.35,0,0]);
  box('heads',[.59,.105,.21],[.11,.713,z],'metal',[z<1.1?-.31:.31,0,0]);
  box('heads',[.592,.052,.197],[.11,.779,z],'red',[z<1.1?-.25:.25,0,0],{finish:'enginePaint'},.024);
  for(let i=0;i<4;i++){const dz=-.054+i*.036,a=z<1.1?-.25:.25;box('heads',[.48,.006,.008],[.11,.779+.026*Math.cos(a)-dz*Math.sin(a)+.003,z+.026*Math.sin(a)+dz*Math.cos(a)],'alloy',[a,0,0]);}
  for(const x of [-.15,.37])for(const dz of [-.074,.074])bolt('heads',[x,.813,z+dz],.006);
  for(let i=0;i<3;i++){
   const x=-.065+i*.17;cyl('engine-block',.040,.020,[x,.53,z<1.1?.957:1.383],'gold',[Math.PI/2,0,0]);
  }
 }
 box('intake',[.405,.061,.215],[.12,.889,1.17],'red',[],{finish:'enginePaint'},.023);
 for(const x of [-.05,.12,.29])for(const z of [1.01,1.33]){
  tube('intake',[[x,.741,z],[x,.797,z],[x,.819,1.17]],.028,'metal');
  tube('intake',[[x,.809,z],[x,.863,z<1.17?z+.05:z-.05],[x,.875,1.17]],.037,'red',{finish:'enginePaint'});
 }
 label('intake','FIERO',[.245,.072],[.12,.922,1.17],[-Math.PI/2,0,0],{background:'#ae181b',foreground:'#d1d4d5',font:'italic bold 75px Arial'});
 for(const z of [1.077,1.264])box('intake',[.30,.004,.007],[.12,.923,z],'alloy');
 cyl('intake',.041,.093,[-.135,.87,1.17],'metal');
 for(const z of [1.06,1.28])for(const x of [-.025,.27])bolt('intake',[x,.923,z],.005);
 cyl('heads',.031,.023,[.29,.824,1.335],'blackPaint',[0,0,0]);
 label('heads','OIL',[.030,.016],[.29,.838,1.335],[-Math.PI/2,0,0],{font:'bold 65px Arial',foreground:'#c4c1b0'});
 box('oil-pan',[.43,.13,.28],[.11,.273,1.17],'metal',[],{},.035);
 box('oil-pan',[.50,.018,.35],[.11,.34,1.17],'metal');
 for(let i=0;i<6;i++)for(const z of [.998,1.34])bolt('oil-pan',[-.095+i*.08,.35,z],.004);
 bolt('oil-pan',[.12,.226,1.315],.01,'z');
 cyl('engine-block',.039,.085,[.36,.34,1.0],'dark',[0,0,.28]);
 // Accessory pulleys, a continuous belt path and cast brackets.
 const pulleys=[[.43,1.15,.087],[.59,1.36,.071],[.70,1.0,.062]];
 for(const [y,z,r] of pulleys){cyl('engine-block',r,.034,[.413,y,z],'dark');ring('engine-block',r,.007,[.434,y,z],'rubber');bolt('engine-block',[.441,y,z],.009,'x');}
 tube('engine-block',[[.447,.43,1.062],[.447,.346,1.14],[.447,.392,1.215],[.447,.587,1.434],[.447,.66,1.36],[.447,.75,1.037],[.447,.727,.944],[.447,.645,.974],[.447,.43,1.062]],.008,'rubber');
 // Air cleaner: close-fitting can, pleated paper element and stamped lid.
 cyl('air-cleaner',.117,.155,[.568,.674,.783],'blackPaint',[0,0,0]);
 ring('air-cleaner',.118,.007,[.568,.749,.783],'dark',[Math.PI/2,0,0]);
 cyl('air-filter',.106,.065,[.568,.747,.783],'amber',[0,0,0]);
 for(let i=0;i<64;i++){const a=i/64*Math.PI*2;box('air-filter',[.002,.062,.008],[.568+Math.cos(a)*.105,.747,.783+Math.sin(a)*.105],'amber',[0,-a,0]);}
 for(const y of [.712,.782])ring('air-filter',.102,.007,[.568,y,.783],'rubber',[Math.PI/2,0,0]);
 cyl('air-lid',.119,.015,[.568,.797,.783],'blackPaint',[0,0,0],.111);
 cyl('air-lid',.016,.012,[.568,.813,.783],'dark',[0,0,0]);
 box('air-lid',[.039,.007,.012],[.568,.821,.783],'alloy');
 tube('intake-duct',[[.47,.73,.783],[.34,.773,.8],[.24,.83,.98],[.19,.87,1.09],[.135,.87,1.17]],.038,'rubber');
 for(let i=0;i<7;i++)ring('intake-duct',.039,.004,[.33-i*.013,.784+i*.007,.82+i*.023],'rubber',[0,-.5,-.1]);
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
 tube('shift-linkage',[[.045,.4,.0],[.03,.36,.46],[.31,.42,.8],[.43,.55,1.15]],.009,'rubber');
 tube('shift-linkage',[[-.045,.4,.0],[.12,.37,.44],[.39,.45,.8],[.46,.55,1.19]],.009,'rubber');
 box('shift-linkage',[.073,.017,.105],[.43,.56,1.16],'metal');
 // Cradle, wishbones, steering and coils.
 for(const s of [-1,1]){
  box('cradle',[.084,.082,1.07],[s*.51,.23,1.12],'dark');
  for(const z of [.61,1.61]){cyl('cradle',.06,.055,[s*.51,.255,z],'rubber',[0,0,0]);bolt('cradle',[s*.51,.288,z],.012);}
 }
 for(const z of [.64,1.56])box('cradle',[1.08,.08,.082],[0,.23,z],'dark');
 function spring(id,x,z,low,high,r=.068){
  const points=[];for(let i=0;i<=192;i++){const a=i/192*Math.PI*13;points.push([x+Math.cos(a)*r,low+(high-low)*i/192,z+Math.sin(a)*r]);}tube(id,points,.008,'dark');
  cyl(id,.021,high-low+.07,[x,(low+high)/2,z],'alloy',[0,0,0]);cyl(id,.034,(high-low)*.53,[x,low+(high-low)*.21,z],'dark',[0,0,0]);
  for(const y of [low,high]){cyl(id,r+.015,.014,[x,y,z],'dark',[0,0,0]);bolt(id,[x,y+.014,z],.009);}
 }
 for(const s of [-1,1]){
  for(const z of [-1.1865,1.1865]){
   const id=z<0?'front-arms':'rear-arms';tube(id,[[s*.31,.242,z-.19],[s*.69,.283,z],[s*.31,.242,z+.19]],.026,'dark');
   box(id,[.24,.018,.12],[s*.44,.243,z],'dark',[0,s*.10,0]);
   for(const dz of [-.19,.19]){cyl(id,.035,.064,[s*.32,.244,z+dz],'rubber',[Math.PI/2,0,0]);bolt(id,[s*.32,.244,z+dz+.037],.007,'z');}
   cyl(id,.045,.039,[s*.67,.3,z],'metal',[0,0,0]);
   if(z<0)tube(id,[[s*.39,.47,z-.12],[s*.65,.47,z],[s*.39,.47,z+.12]],.019,'dark');
  }
  spring('front-springs',s*.55,-1.1865,.305,.60);spring('rear-struts',s*.63,1.1865,.39,.755,.076);
 }
 cyl('steering-rack',.033,.79,[0,.33,-1.34],'metal');
 cyl('steering-rack',.012,1.31,[0,.33,-1.34],'alloy');
 for(const s of [-1,1]){
  for(let i=0;i<8;i++)ring('steering-rack',.036,.006,[s*(.40+i*.018),.33,-1.34],'rubber');
  tube('steering-rack',[[s*.56,.33,-1.34],[s*.70,.33,-1.20]],.011,'metal');
 }
 tube('stabilizer',[[-.65,.25,-1.17],[-.56,.219,-1.45],[.56,.219,-1.45],[.65,.25,-1.17]],.0115,'dark');
 for(const s of [-1,1]){box('stabilizer',[.05,.04,.038],[s*.39,.221,-1.45],'rubber');bolt('stabilizer',[s*.39,.245,-1.45],.006);}
 // Lathed tire sidewalls and machined 14-inch wheels at factory axle spacing.
 const tireProfile=[[-.102,.178],[-.112,.191],[-.109,.239],[-.096,.29],[-.079,.307],[.079,.307],[.096,.29],[.109,.239],[.112,.191],[.102,.178]];
 for(const s of [-1,1])for(const z of [-1.1865,1.1865]){
  const x=s*(z<0?.734:.746),y=.307;
  const tireGeo=new T.LatheGeometry(tireProfile.map(([a,r])=>new T.Vector2(r,a)),96);tireGeo.rotateZ(Math.PI/2);add('wheels',tireGeo,'rubber',[x,y,z]);
  buildWheelFace(h,x,y,z,s);
  for(const r of [.218,.26,.29])ring('wheels',r,.0009,[x+s*.111,y,z],'rubber');
  // Dense shallow tread blocks, visually unlike the original chunky prototype.
  for(let i=0;i<88;i++){const a=i/88*Math.PI*2;for(const offset of [-.053,.053])box('wheels',[.079,.004,.008],[x+offset,y+Math.cos(a)*.307,z+Math.sin(a)*.307],'rubber',[a,0,.18*Math.sign(offset)],{},.001);}
  // Tire markings on the outboard sidewall, each character follows the arc.
  const text='P215/60 R14';for(let i=0;i<text.length;i++){const a=(i-text.length/2)*.073;label('wheels',text[i],[.014,.018],[x+s*.113,y+Math.cos(a)*.267,z+Math.sin(a)*.267],[0,s*Math.PI/2,a*s],{background:'#111213',foreground:'#3d4143',width:64,height:64,font:'bold 48px Arial'});}
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
 tube('clutch-hydraulics',[[.59,.56,-.80],[.60,.32,-.76],[.61,.25,.55],[.48,.36,.80],[.45,.53,1.09]],.003,'metal');
 cyl('clutch-hydraulics',.021,.132,[.45,.541,1.13],'metal',[Math.PI/2,0,0]);
 cyl('clutch-hydraulics',.011,.067,[.45,.541,1.224],'alloy',[Math.PI/2,0,0]);
 box('clutch-hydraulics',[.074,.017,.069],[.45,.518,1.14],'dark');
 box('washer-reservoir',[.16,.155,.245],[.43,.43,-1.24],'reservoir',[],{},.034);
 cyl('washer-reservoir',.031,.024,[.43,.518,-1.29],'plastic',[0,0,0]);
 cyl('washer-reservoir',.017,.055,[.50,.412,-1.15],'plastic',[0,0,0]);
 tube('washer-reservoir',[[.5,.437,-1.15],[.54,.52,-.96],[.54,.71,-.67],[.30,.81,-.59]],.003,'rubber');
 // Detailed thermostat assembly is shared with the engine explorer.
 // Fuel and exhaust: stamped tank, heat shields, formed tubes and twin outlets.
 box('fuel-tank',[.265,.177,1.32],[0,.28,-.11],'metal',[],{},.034);
 for(const z of [-.55,.35])box('fuel-tank',[.282,.011,.04],[0,.184,z],'dark');
 tube('fuel-lines',[[.09,.385,.35],[.15,.4,.56],[-.24,.60,.87],[-.16,.69,1.06]],.006,'metal');
 for(const z of [.958,1.38])for(const x of [.06,-.11,-.28])tube('exhaust',[[x,.55,z],[x,.43,z<1.1?.92:1.44],[.34,.39,1.43]],.021,'iron');
 tube('exhaust',[[.34,.39,1.43],[.48,.25,1.57],[.29,.22,1.71],[0,.22,1.73]],.028,'metal');
 box('exhaust',[.59,.14,.20],[0,.24,1.745],'metal',[],{},.046);
 for(const s of [-1,1])for(const offset of [-.037,.037]){
  const x=s*.51+offset;
  tube('exhaust',[[s*.24,.24,1.73],[s*.48+offset,.235,1.89],[x,.240,1.965]],.025,'metal');
  // Larger hollow tips with a rolled lip and a recessed dark bore.
  surface('exhaust',48,14,(u,v)=>{const a=u*Math.PI*2,r=.028+.0015*Math.sin(v*Math.PI/2);return [x+r*Math.cos(a),.240+r*Math.sin(a),1.955+v*.094];},'chrome');
  surface('exhaust',48,8,(u,v)=>{const a=u*Math.PI*2,r=.025;return [x+r*Math.cos(a),.240+r*Math.sin(a),2.018+v*.031];},'dark');
  ring('exhaust',.0272,.0023,[x,.240,2.049],'chrome',[0,0,0]);
  cyl('exhaust',.025,.002,[x,.240,2.018],'dark',[Math.PI/2,0,0]);
 }
 // Battery, charging components, power harness and optional equipment.
 box('battery',[.225,.192,.157],[-.58,.652,.79],'plastic',[],{},.009);box('battery',[.238,.028,.17],[-.58,.757,.79],'dark');
 for(const x of [-.642,-.518]){cyl('battery',.013,.022,[x,.784,.79],'metal',[0,0,0]);tube('battery',[[x,.795,.79],[x,.793,.91],[x+.03,.68,1.06]],.008,x<-.6?'red':'rubber');}
 label('battery','DELCO',[.122,.043],[-.58,.687,.708],[0,Math.PI,0],{background:'#161a1c',foreground:'#ddddcf',font:'bold italic 60px Arial'});
 for(const z of [.735,.81,.845])box('battery',[.16,.008,.005],[-.58,.777,z],'plastic');
 cyl('alternator',.073,.10,[.46,.59,1.36],'metal');
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2;box('alternator',[.09,.009,.015],[.46,.59+Math.cos(a)*.071,1.36+Math.sin(a)*.071],'metal',[a,0,0]);}
 cyl('alternator',.033,.017,[.53,.59,1.36],'dark');
 tube('harness',[[-.58,.66,.79],[-.45,.62,.64],[.54,.52,.58],[.55,.32,-.59],[.59,.48,-1.55]],.014,'wire');
 for(const x of [-.10,.11,.31])tube('harness',[[.54,.52,.58],[x,.60,.8],[x,.74,1.05]],.006,'wire');
 for(let i=0;i<8;i++)box('harness',[.020,.023,.008],[.55,.34,-.45+i*.095],'rubber');
 // Optional compressor and condenser are attached to related existing records.
 cyl('alternator',.069,.17,[.43,.38,.93],'metal',[0,0,Math.PI/2],.069,{option:'airConditioning',value:true});
 cyl('alternator',.067,.034,[.53,.38,.93],'dark',[0,0,Math.PI/2],.067,{option:'airConditioning',value:true});
 box('radiator',[.64,.30,.027],[0,.456,-1.78],'metal',[-.13,0,0],{option:'airConditioning',value:true});
 tube('coolant-pipes',[[.42,.40,.94],[.51,.28,.8],[.49,.18,-1.45],[.25,.4,-1.79]],.009,'metal',{option:'airConditioning',value:true});
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
 box('dashboard',[.431,.195,.12],[.345,.820,-.425],'plastic',[-.12,0,0],{},.018);
 box('dashboard',[.395,.151,.008],[.345,.82,-.356],'metal',[-.12,0,0],{},.006);
 function gauge(x,y,z,labelText,max){
  cyl('dashboard',.054,.009,[x,y,z],'dark',[Math.PI/2,0,0]);
  ring('dashboard',.052,.0017,[x,y,z+.008],'alloy',[0,0,0]);
  for(let i=0;i<15;i++){const a=(-.77+i/14*1.54)*Math.PI;box('dashboard',[.0014,.007,.002],[x+Math.sin(a)*.044,y+Math.cos(a)*.044,z+.009],'white',[0,0,-a],{},.0004);}
  box('dashboard',[.002,.035,.002],[x+.009,y+.013,z+.010],'indicator',[0,0,-.58]);
  label('dashboard',labelText,[.041,.010],[x,y-.021,z+.011],[0,0,0],{width:256,height:64,foreground:'#bebcb0',font:'50px Arial'});
 }
 // Preserve the original instrument ordering after the final LHD conversion:
 // speedometer to the driver's left, tachometer to the right (1985 brochure p4).
 gauge(.427,.825,-.345,'MPH',85);gauge(.247,.825,-.345,'RPM',6);
 for(const x of [.325,.359])box('dashboard',[.020,.032,.004],[x,.838,-.342],'dark');
 box('dashboard',[.197,.31,.127],[0,.572,-.455],'plastic',[-.05,0,0],{},.012);
 box('dashboard',[.176,.281,.006],[0,.574,-.382],'metal');
 for(const s of [-1,1]){
  box('dashboard',[.15,.054,.012],[s*.514,.718,-.426],'plastic');
  for(let i=0;i<5;i++)box('dashboard',[.129,.003,.015],[s*.514,.697+i*.009,-.419],'dark');
 }
 box('dashboard',[.155,.049,.011],[0,.678,-.376],'plastic');
 for(let i=0;i<5;i++)box('dashboard',[.146,.002,.014],[0,.660+i*.009,-.369],'dark');
 for(const variant of ['am','amfm','cassette','equalizer']){
  const flags={option:'radio',value:variant};box('dashboard',[.153,.068,.013],[0,.535,-.373],'dark',[],flags);
  label('dashboard',variant==='am'?'AM  850':'FM  98.5',[.076,.021],[0,.548,-.363],[0,0,0],{background:'#112027',foreground:'#aaa994',font:'48px monospace'},flags);
  for(const s of [-1,1])cyl('dashboard',.011,.011,[s*.061,.518,-.362],'plastic',[Math.PI/2,0,0],.011,flags);
  if(['cassette','equalizer'].includes(variant))box('dashboard',[.081,.008,.007],[0,.515,-.361],'plastic',[],flags);
  if(variant==='equalizer')for(let i=0;i<5;i++)box('dashboard',[.004,.021,.004],[-.034+i*.017,.494,-.36],'alloy',[],flags);
 }
 box('dashboard',[.137,.038,.008],[0,.613,-.365],'dark');
 label('dashboard','COLD   ━━━━━   HOT',[.12,.014],[0,.623,-.359],[0,0,0],{font:'42px Arial',foreground:'#b6bdc0'});
 box('dashboard',[.013,.012,.006],[.027,.606,-.355],'alloy');
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
 for(const s of [-1,1])box('dashboard',[.052,.018,.025],[s*.45,.495,-.43],'white',[],{option:'lampGroup',value:true});
}
