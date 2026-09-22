import {bankOffset} from './engine-layout.js';
import {l44Nominal} from './factory-specifications.js';
import * as T from 'three';
import {estCircuits} from './ignition-catalog.js';

// Authored solid geometry. GM K-13 establishes the distributor stack;
// 1985 6E3 figure 38 establishes circuit topology. Dimensions are reconstructed.
export const distributorOrigin=[.244,1.377,.020];
export const coilOrigin=[.360,1.372,-.105];
const Y=[0,0,0],flat=[Math.PI/2,0,0];
export function sparkPlugPose(bank,c){
 const s=bank==='front'?-1:1;
 return {position:[((c-2)*l44Nominal.borePitch+bankOffset(s)),1.05+.325*Math.cos(Math.PI/6)-.109*.5,s*(.325*.5+.109*Math.cos(Math.PI/6)-.045)],axis:[0,.22,s*.976]};
}

export function buildIgnition(h){
 const {add,box,cyl,tube,ring,bolt}=h,id=k=>`eng-${k}`;
 const D=distributorOrigin,C=coilOrigin;
 const at=(p,o=D)=>p.map((v,i)=>v+o[i]);
 const lathe=(key,profile,pos,mat='zinc',axis=[0,1,0],segments=64)=>{
  const geo=new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),segments);
  geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...axis).normalize()));
  return add(id(key),geo,mat,pos);
 };
 const annulus=(key,outer,inner,depth,pos,mat='zinc')=>lathe(key,[[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]],pos,mat);
 const plate=(key,outline,depth,pos,mat='zinc',holes=[])=>{
  const s=new T.Shape();outline.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();
  for(const [x,z,r] of holes){const hole=new T.Path();hole.absarc(x,z,r,0,Math.PI*2,true);s.holes.push(hole);}
  const geo=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.00065,bevelThickness:.00045,bevelSegments:2,curveSegments:32});
  geo.rotateX(Math.PI/2);geo.translate(0,depth/2,0);return add(id(key),geo,mat,pos);
 };
 const screw=(key,pos,r=.0027,length=.015)=>{
  cyl(id(key),r*.57,length,[pos[0],pos[1]-length/2,pos[2]],'zinc',Y);
  cyl(id(key),r,r*.72,pos,'zinc',Y);
  box(id(key),[r*1.45,.0003,.00055],[pos[0],pos[1]+r*.37,pos[2]],'dark');
  annulus(key,r*1.3,r*.6,.0007,[pos[0],pos[1]-.0015,pos[2]]);
 };
 const springPin=(key,r,len,pos,rot=Y)=>{
  const shape=new T.Shape();shape.absarc(0,0,r,.12,Math.PI*2-.12,false);shape.lineTo(Math.cos(-.12)*r*.57,Math.sin(-.12)*r*.57);shape.absarc(0,0,r*.57,Math.PI*2-.12,.12,true);shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:len,bevelEnabled:false,curveSegments:24});geo.translate(0,0,-len/2);add(id(key),geo,'dark',pos,rot);
 };
 // Open, cast distributor base; the module sits on the flat metal extension.
 plate('distributor',[[-.048,-.036],[-.030,-.046],[.030,-.046],[.048,-.034],[.049,.043],[-.049,.043]],.006,at([0,0,0]),'castAluminum',[[0,-.006,.0073],[-.044,.033,.0025],[.044,-.030,.0025]]);
 lathe('distributor',[[.0073,-.188],[.013,-.188],[.013,-.165],[.012,-.163],[.012,-.130],[.020,-.130],[.021,-.124],[.020,-.120],[.014,-.120],[.014,-.035],[.020,-.016],[.022,-.006],[.0073,-.006],[.0073,-.188]],at([0,0,-.006]),'castAluminum');
 annulus('distributor',.021,.014,.007,at([0,-.124,-.006]));
 annulus('distributor',.011,.0073,.014,at([0,.011,-.006]));
 for(const [x,z] of [[-.044,.033],[.044,-.030]])annulus('distributor',.005,.0025,.015,at([x,.009,z]),'castAluminum');
 // Shaft, keyed rotor end and six rotating fingers.
 lathe('distributor-shaft',[[0,-.219],[.0066,-.219],[.0066,.035],[.005,.037],[.005,.054],[0,.054]],at([0,0,-.006]));
 box(id('distributor-shaft'),[.009,.008,.007],at([0,.053,-.006]),'zinc');
 annulus('distributor-shaft',.019,.0066,.003,at([0,.033,-.006]),'zinc');
 // Pickup winding, spool lips, leads and connector.
 annulus('pickup-coil',.0205,.0114,.010,at([0,.016,-.006]),'pickupPlastic');
 for(const y of [.010,.022])annulus('pickup-coil',.022,.0114,.002,at([0,y,-.006]),'pickupPlastic');
 for(let j=0;j<7;j++)ring(id('pickup-coil'),.0207,.00038,at([0,.012+j*.0013,-.006]),'copper',flat);
 for(const [dx,mat] of [[-.002,'wireGreen'],[.002,'wireWhite']])tube(id('pickup-coil'),[at([-.017,.016,.001+dx]),at([-.031,.014,.007+dx]),at([-.025,.013,.018+dx]),at([-.018+dx,.010,.022])],.0011,mat);
 box(id('pickup-coil'),[.009,.005,.004],at([-.018,.010,.021]),'pickupPlastic',Y,{},.001);
 annulus('pickup-retainer',.021,.0114,.0012,at([0,.024,-.006]));
 annulus('pole-piece',.025,.0114,.002,at([0,.006,-.006]),'zinc');
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3+.12,shape=[[-.004,.022],[-.003,.026],[.003,.026],[.004,.022]];
  const mesh=plate('pole-piece',shape,.021,[0,0,0]);mesh.rotation.y=a;mesh.position.set(...at([0,.019,-.006]));
  const tooth=plate('distributor-shaft',[[-.005,.014],[-.003,.023],[.003,.023],[.005,.014]],.004,[0,0,0]);tooth.rotation.y=a+Math.PI/6;tooth.position.set(...at([0,.032,-.006]));
 }
 plate('pickup-shield',[[-.028,-.031],[.028,-.031],[.029,-.014],[.022,-.009],[-.022,-.009],[-.029,-.014]],.001,at([0,.035,0]),'zinc');
 box(id('pickup-shield'),[.056,.007,.001],at([0,.038,-.032]),'zinc');
 // ICM: metal plate, stepped molded package, two fixing holes, 2+4+2 blades.
 const M=at([0,.008,.029]);
 plate('icm',[[-.037,-.011],[-.031,-.016],[.029,-.016],[.037,-.009],[.037,.011],[-.037,.011]],.0018,M,'zinc',[[-.031,0,.0024],[.031,0,.0024]]);
 plate('icm',[[-.027,-.010],[-.020,-.015],[.020,-.015],[.027,-.009],[.027,.010],[-.027,.010]],.006,at([0,.004,0],M),'phenolic');
 for(const [start,n] of [[-.022,2],[.002,4]]){
  const w=n*.006+.002;
  box(id('icm'),[w,.007,.003],at([start+(n-1)*.003,.002,.005],M),'phenolic');
  for(const x of [start-.004,start+(n-1)*.006+.004])box(id('icm'),[.002,.007,.008],at([x,.002,.013],M),'phenolic');
  for(let i=0;i<n;i++)box(id('icm'),[.0022,.0007,.010],at([start+i*.006,.002,.012],M),'zinc');
 }
 for(const x of [-.019,-.013])box(id('icm'),[.0022,.0007,.006],at([x,.002,-.016],M),'zinc');
 // Oval shrouds around the two external module connectors, as shown in
 // the separate-coil HEI/EST factory drawing (1986 6D-24, figure 27A).
 for(const [x,w] of [[-.019,.018],[.011,.029]]){
  const capsule=(width,height)=>{const s=new T.Shape(),r=height/2;s.moveTo(-width/2+r,-r);s.lineTo(width/2-r,-r);s.absarc(width/2-r,0,r,-Math.PI/2,Math.PI/2,false);s.lineTo(-width/2+r,r);s.absarc(-width/2+r,0,r,Math.PI/2,Math.PI*1.5,false);return s;};
  const shape=capsule(w,.012),inner=capsule(w-.003,.009);shape.holes.push(new T.Path(inner.getPoints(24)));
  const geo=new T.ExtrudeGeometry(shape,{depth:.008,bevelEnabled:true,bevelSize:.0004,bevelThickness:.0004,bevelSegments:2,curveSegments:24});add(id('icm'),geo,'phenolic',at([x,.001,.014],M));
 }
 h.label(id('icm'),'+ C     G B R E',[.051,.007],at([0,.008,.004],M),[-Math.PI/2,0,0],{background:'transparent',foreground:'#b5b2a4',font:'bold 44px Arial'});
 for(const x of [-.031,.031])screw('icm-screws',at([x,.0045,0],M),.003,.014);
 // Keyed, cupped rotor with a stamped conductive strip and centre spring.
 lathe('rotor',[[.005,.033],[.011,.033],[.013,.039],[.029,.039],[.030,.043],[.027,.047],[.008,.047],[.005,.043],[.005,.033]],at([0,0,-.006]),'phenolic');
 plate('rotor',[[-.008,-.008],[.024,-.008],[.034,-.005],[.034,.005],[.024,.008],[-.008,.008]],.004,at([0,.045,-.006]),'phenolic');
 plate('rotor',[[-.007,-.003],[.034,-.003],[.035,.003],[-.007,.003]],.0007,at([0,.049,-.006]),'copper');
 tube(id('rotor'),[at([-.006,.049,-.006]),at([0,.055,-.006]),at([.008,.049,-.006])],.001,'zinc');
 cyl(id('rotor'),.002,.001,at([.015,.050,-.006]),'zinc',Y);
 // Hollow cap wall and roof, open underneath with six internal contacts.
 lathe('cap',[[.040,.005],[.044,.005],[.044,.013],[.042,.016],[.041,.061],[.038,.068],[.009,.071],[.007,.068],[.007,.062],[.037,.062],[.038,.059],[.039,.012],[.040,.005]],at([0,0,-.006]),'phenolic');
 plate('cap',[[-.050,-.036],[-.029,-.045],[.030,-.045],[.050,-.033],[.050,.043],[-.050,.043]],.003,at([0,.007,0]),'phenolic',[[0,-.006,.039],[-.044,.033,.0025],[.044,-.030,.0025]]);
 // Molded skirt over the module, with an open face for its connectors.
 for(const x of [-.043,.043])box(id('cap'),[.003,.027,.019],at([x,.020,.038]),'phenolic',Y,{},.001);
 box(id('cap'),[.087,.003,.022],at([0,.034,.038]),'phenolic',Y,{},.001);
 for(const x of [-.026,.026])tube(id('cap'),[at([x,.061,.024]),at([x,.040,.037]),at([x,.034,.045])],.0018,'phenolic');
 const tower=(key,pos,axis=[0,1,0])=>{
  lathe(key,[[.005,0],[.0087,0],[.0082,.004],[.0072,.006],[.0072,.021],[.0065,.023],[.0049,.023],[.0049,0]],pos,'phenolic',axis);
  lathe(key,[[.0034,.005],[.0049,.005],[.0049,.017],[.0034,.017],[.0034,.005]],pos,'copper',axis);
 };
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3,p=at([Math.cos(a)*.029,.065,-.006+Math.sin(a)*.029]);tower('cap',p);
  box(id('cap'),[.006,.014,.004],at([Math.cos(a)*.036,.057,-.006+Math.sin(a)*.036]),'copper',[0,Math.PI/2-a,0],{},.001);
  for(const dy of [.019,.025,.031,.037,.043,.049])box(id('cap'),[.0012,.002,.005],at([Math.cos(a)*.042,dy,-.006+Math.sin(a)*.042]),'phenolic',[0,-a,0]);
 }
 tower('cap',at([0,.069,-.006]));cyl(id('cap'),.0025,.013,at([0,.059,-.006]),'dark',Y);
 for(const [x,z] of [[-.044,.033],[.044,-.030]]){
  annulus('cap',.005,.0025,.045,at([x,.030,z]),'phenolic');screw('cap-screws',at([x,.054,z]),.003,.054);
 }
 ring(id('distributor-seal'),.0135,.0017,at([0,-.153,-.006]),'rubber',flat);
 annulus('distributor-washer',.014,.0068,.0017,at([0,-.188,-.006]));
 annulus('distributor-tang-washer',.014,.0068,.0018,at([0,-.191,-.006]));
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;box(id('distributor-tang-washer'),[.004,.004,.002],at([Math.cos(a)*.013,-.194,-.006+Math.sin(a)*.013]),'zinc',[0,-a,0]);}
 // Helical teeth cut into a continuous gear silhouette rather than loose blocks.
 const gearShape=new T.Shape(),n=13;
 for(let j=0;j<=n*6;j++){const a=j/(n*6)*Math.PI*2,r=[.011,.011,.014,.014,.012,.011][j%6];j?gearShape.lineTo(Math.cos(a)*r,Math.sin(a)*r):gearShape.moveTo(r,0);}
 const hole=new T.Path();hole.absarc(0,0,.0067,0,Math.PI*2,true);gearShape.holes.push(hole);
 const gearGeo=new T.ExtrudeGeometry(gearShape,{depth:.021,steps:12,bevelEnabled:false,curveSegments:32});
 const gp=gearGeo.attributes.position;for(let i=0;i<gp.count;i++){const x=gp.getX(i),y=gp.getY(i),z=gp.getZ(i),a=z/.021*.35;gp.setXYZ(i,x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),z);}
 gearGeo.rotateX(Math.PI/2);gearGeo.computeVertexNormals();add(id('distributor-gear'),gearGeo,'iron',at([0,-.192,-.006]));
 springPin('distributor-roll-pin',.0023,.028,at([0,-.204,-.006]),[0,Math.PI/2,0]);
 springPin('distributor-housing-pin',.0015,.012,at([-.024,.004,.028]));
 plate('distributor-clamp',[[-.025,-.015],[.022,-.014],[.028,-.005],[.025,.016],[-.025,.016]],.004,at([.022,-.120,-.006]),'dark',[[.017,0,.004],[0,0,.0135]]);
 bolt(id('distributor-clamp'),at([.042,-.115,-.006]),.006);
 // Remote E-core coil, reconstructed from the separate-coil factory drawing.
 // Lamination frames have an open winding window, not a solid rectangular core.
 const core=new T.Shape();core.moveTo(-.036,-.031);core.lineTo(.036,-.031);core.lineTo(.036,.031);core.lineTo(-.036,.031);core.closePath();
 const window=new T.Path();window.moveTo(-.026,-.022);window.lineTo(-.026,.022);window.lineTo(.026,.022);window.lineTo(.026,-.022);window.closePath();core.holes.push(window);
 for(let i=0;i<20;i++){
  const geo=new T.ExtrudeGeometry(core,{depth:.0017,bevelEnabled:false});add(id('ignition-coil'),geo,'iron',at([0,0,-.019+i*.002],C));
 }
 const winding=new T.Shape();winding.moveTo(-.025,-.024);winding.quadraticCurveTo(-.030,-.020,-.027,-.009);winding.lineTo(-.023,.024);winding.quadraticCurveTo(0,.031,.023,.024);winding.lineTo(.027,-.009);winding.quadraticCurveTo(.030,-.020,.025,-.024);winding.closePath();
 const windingGeo=new T.ExtrudeGeometry(winding,{depth:.052,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:3,curveSegments:32});add(id('ignition-coil'),windingGeo,'phenolic',at([0,0,-.026],C));
 tower('ignition-coil',at([0,.009,.028],C),[0,0,1]);
 for(const x of [-.014,.014]){
  const base=at([x,-.026,.025],C);
  box(id('ignition-coil'),[.022,.017,.003],base,'phenolic');
  for(const y of [-.009,.009])box(id('ignition-coil'),[.022,.003,.014],at([0,y,.006],base),'phenolic');
  for(const xx of [-.011,.011])box(id('ignition-coil'),[.003,.016,.014],at([xx,0,.006],base),'phenolic');
  for(const xx of [-.005,.005])box(id('ignition-coil'),[.003,.002,.009],at([xx,0,.006],base),'zinc');
 }
 const bracket=new T.Shape();bracket.moveTo(-.046,-.040);bracket.lineTo(.046,-.040);bracket.lineTo(.046,.045);bracket.quadraticCurveTo(.046,.054,.035,.054);bracket.lineTo(-.035,.054);bracket.quadraticCurveTo(-.046,.054,-.046,.045);bracket.closePath();
 for(const x of [-.033,.033]){const p=new T.Path();p.absarc(x,.043,.0045,0,Math.PI*2,true);bracket.holes.push(p);}
 const bg=new T.ExtrudeGeometry(bracket,{depth:.002,bevelEnabled:true,bevelSize:.0006,bevelThickness:.0004,bevelSegments:2,curveSegments:32});add(id('coil-bracket'),bg,'dark',at([0,0,-.030],C));
 box(id('coil-bracket'),[.092,.002,.037],at([0,-.040,-.010],C),'dark');
 for(const x of [-.032,.032]){bolt(id('coil-fasteners'),at([x,.023,.026],C),.004,'z');cyl(id('coil-fasteners'),.002,.056,at([x,.023,0],C),'zinc',[Math.PI/2,0,0]);}
 // Harness connector blocks have recessed terminal faces and latch ribs.
 const connector=(key,p,n,mat='plastic')=>{
  const width=n*.005+.004;
  box(id(key),[width,.009,.012],p,mat,Y,{},.002);
  box(id(key),[width-.003,.004,.001],at([0,0,-.0062],p),'dark');
  for(let i=0;i<n;i++)box(id(key),[.0016,.002,.0006],at([(i-(n-1)/2)*.005,0,-.0068],p),'zinc');
  box(id(key),[width*.65,.0018,.010],at([0,.006,.001],p),mat);
 };
 const primaryStart=at([-.019,.010,.054]),primaryEnd=at([-.014,-.026,.046],C);
 connector('coil-primary-harness',primaryStart,2);connector('coil-primary-harness',primaryEnd,2);
 for(const [dx,mat] of [[-.002,'wireWhite'],[.002,'wirePink']])tube(id('coil-primary-harness'),[at([dx,0,0],primaryStart),at([-.025+dx,.020,.085]),[.29,1.40,-.035],at([-.028,-.034,.060+dx],C),at([dx,0,0],primaryEnd)],.0017,mat);
 const est=at([.012,.010,.054]);connector('est-harness',est,4);
 for(const [i,c] of estCircuits.entries()){
  const points=[at([(i-1.5)*.005,0,0],est),at([.034+i*.004,-.009,.074]),[.29+i*.004,1.327,.048],[.29+i*.004,1.305,-.05]];
  tube(id('est-'+c.key),points,.0013,c.base);
  if(c.stripe)tube(id('est-'+c.key),points.map(p=>[p[0]-.00124,p[1],p[2]]),.00024,c.stripe);
 }
 const feed=at([.014,-.026,.046],C);connector('coil-feed-harness',feed,2,'zinc');
 for(const [dz,mat] of [[-.003,'wirePink'],[.003,'wireWhite']])tube(id('coil-feed-harness'),[feed,at([-.073,-.020,.030+dz],C),at([-.040,-.055,.050+dz],C),at([.005,-.066,.052+dz],C)],.0017,mat);
 const F=at([.052,-.050,.028],C);
 lathe('tach-filter',[[0,-.017],[.009,-.017],[.010,-.014],[.010,.014],[.008,.017],[0,.017]],F,'zinc');
 for(const y of [-.013,.013])ring(id('tach-filter'),.010,.0007,at([0,y,0],F),'zinc',flat);
 plate('tach-filter',[[-.009,-.006],[.022,-.006],[.026,0],[.022,.006],[-.009,.006]],.0015,at([0,-.012,0],F),'zinc',[[.018,0,.0025]]);
 for(const dz of [-.003,.003])tube(id('tach-filter'),[at([0,.017,dz],F),at([0,.029,dz],F),at([-.018,.034,dz],F),at([-.032,.023,dz],F)],.0013,'wireWhite');
 connector('tach-filter',at([-.033,.023,0],F),2);
 // Plugs and individual HT leads, with modeled boots, lips and terminals.
 function plug(key,pose){
  const axis=new T.Vector3(...pose.axis).normalize(),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),axis),origin=new T.Vector3(...pose.position);
  const p=(x,y,z)=>new T.Vector3(x,y,z).applyQuaternion(q).add(origin).toArray();
  const insulator=[[0,.017],[.005,.017],[.005,.029]];
  for(let i=0;i<5;i++)insulator.push([.005,.030+i*.003],[.0061,.031+i*.003],[.0061,.0318+i*.003],[.005,.033+i*.003]);
  insulator.push([.0045,.047],[.0042,.051],[0,.051]);lathe(key,insulator,pose.position,'ceramic',pose.axis,48);
  lathe(key,[[0,-.014],[.0065,-.014],[.0069,-.012],[.0069,.002],[.008,.004],[.0085,.006],[.0075,.009],[.0075,.015],[.005,.018],[0,.018]],pose.position,'zinc',pose.axis,48);
  const hex=new T.CylinderGeometry(.0092,.0092,.009,6);hex.applyQuaternion(q);add(id(key),hex,'zinc',p(0,.011,0));
  const thread=[];for(let k=0;k<=240;k++){const a=k/240*Math.PI*2*10;thread.push(p(Math.cos(a)*.0070,-.013+k/240*.015,Math.sin(a)*.0070));}
  tube(id(key),thread,.00038,'zinc');
  lathe(key,[[0,.050],[.0025,.050],[.0025,.054],[.0035,.055],[.0035,.061],[.0025,.062],[0,.062]],pose.position,'zinc',pose.axis,40);
  lathe(key,[[0,-.017],[.0027,-.017],[.0035,-.011],[0,-.011]],pose.position,'ceramic',pose.axis,32);
  const electrode=new T.CylinderGeometry(.001,.001,.004,24);electrode.applyQuaternion(q);add(id(key),electrode,'zinc',p(0,-.017,0));
  // A flat bent ground strap, with its inner face 1.1 mm from the centre
  // electrode tip (1985 Pontiac DIY 2-22). Other proportions are inferred.
  const strap=new T.Shape();strap.moveTo(.0052,-.012);strap.lineTo(.0064,-.012);strap.lineTo(.0064,-.0188);strap.quadraticCurveTo(.0064,-.0213,.0039,-.0213);strap.lineTo(0,-.0213);strap.lineTo(0,-.0201);strap.lineTo(.0039,-.0201);strap.quadraticCurveTo(.0052,-.0201,.0052,-.0188);strap.closePath();
  const strapGeo=new T.ExtrudeGeometry(strap,{depth:.0022,bevelEnabled:false,curveSegments:12});strapGeo.translate(0,0,-.0011);strapGeo.applyQuaternion(q);add(id(key),strapGeo,'zinc',pose.position);
 }
 const boot=(key,p,axis,length=.037)=>lathe(key,[[.0038,0],[.0085,0],[.0087,.004],[.0074,.007],[.0070,length-.009],[.006,length-.004],[.004,length],[.0038,length],[.0038,0]],p,'silicone',axis,40);
 for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++){
  const key=`wire-${bank}-${c}`,pose=sparkPlugPose(bank,c);plug(`spark-${bank}-${c}`,pose);
  const axis=new T.Vector3(...pose.axis).normalize(),P=new T.Vector3(...pose.position);
  const bootStart=P.clone().addScaledVector(axis,.021).toArray(),end=P.clone().addScaledVector(axis,.081).toArray();boot(key,bootStart,pose.axis,.061);
  const slot=(s<0?0:3)+(c-1),a=slot*Math.PI/3,cap=at([Math.cos(a)*.029,.077,-.006+Math.sin(a)*.029]);
  boot(key,cap,[0,1,0],.037);
  tube(id(key),[at([0,.034,0],cap),at([-.018,.060,s*.013],cap),[((c-2)*l44Nominal.borePitch+bankOffset(s)),1.468,s*.19],[((c-2)*l44Nominal.borePitch+bankOffset(s)),1.415,s*.29],end],.0035,'silicone');
 }
 const coilTop=at([0,.009,.044],C),capTop=at([0,.083,-.006]);
 boot('coil-lead',coilTop,[0,0,1]);boot('coil-lead',capTop,[0,1,0]);
 tube(id('coil-lead'),[at([0,0,.035],coilTop),at([-.025,.040,.068],coilTop),at([.025,.067,-.012],capTop),at([0,.035,0],capTop)],.0035,'silicone');
 for(const s of [-1,1])for(const x of [-.07,.065]){
  plate('wire-separators',[[-.011,-.014],[.011,-.014],[.011,.014],[-.011,.014]],.004,[x,1.465,s*.19],'plastic',[[-.005,-.006,.0037],[.005,.006,.0037]]);
 }
}
