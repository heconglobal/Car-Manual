import * as T from 'three';
import {pumpInletEngine} from './powertrain-layout.js';

// Authored solid geometry. GM H-19/H-22 establish identities and relationships;
// local outlines are reconstructed. No photographs are used as part surfaces.
const Y=[0,0,0],X=[0,0,Math.PI/2];
function serviceTools(h){
 const id=k=>`eng-${k}`;
 const lathe=(k,profile,p,mat='zinc',rot=Y)=>h.add(id(k),new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),64),mat,p,rot);
 const plate=(k,shape,depth,p,mat='zinc',rot=Y,bevel=0)=>{
  const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:32});g.translate(0,0,-depth/2);return h.add(id(k),g,mat,p,rot);
 };
 const outline=(points,holes=[])=>{const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();for(const [x,y,r] of holes){const hole=new T.Path();hole.absarc(x,y,r,0,Math.PI*2,true);s.holes.push(hole);}return s;};
 const washer=(k,outer,inner,depth,p,mat='zinc',rot=Y)=>lathe(k,[[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]],p,mat,rot);
 const hex=(k,r,l,p,mat='zinc',rot=Y)=>h.add(id(k),new T.CylinderGeometry(r,r,l,6),mat,p,rot);
 const thread=(k,r,length,p,mat='zinc',axis=[0,1,0],pitch=.0016)=>{
  const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...axis)),points=[];
  const n=Math.ceil(length/pitch*24);for(let i=0;i<=n;i++){const y=i/n*length,a=y/pitch*Math.PI*2;points.push(new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r).applyQuaternion(q).add(new T.Vector3(...p)));}
  const g=new T.TubeGeometry(new T.CatmullRomCurve3(points),n,Math.min(.00035,pitch*.22),5,false);h.add(id(k),g,mat);
 };
 const bolt=(k,p,length=.02,axis='y',radius=.005,direction=-1)=>{h.bolt(id(k),p,radius,axis,'zinc');const q=p.slice(),j={x:0,y:1,z:2}[axis];q[j]+=direction*length/2;h.cyl(id(k),radius*.57,length,q,'zinc',axis==='x'?X:axis==='z'?[Math.PI/2,0,0]:Y);};
 return {id,lathe,plate,outline,washer,hex,thread,bolt};
}

export function buildThermostat(h){
 const {id,lathe,plate,outline,washer,bolt}=serviceTools(h);
 const C=[-.221,1.345,.050],at=(x,y,z=0)=>[C[0]+x,C[1]+y,C[2]+z];
 const flange=outline([[-.037,-.024],[.029,-.024],[.043,-.013],[.043,.018],[.028,.027],[-.033,.027],[-.042,.014],[-.042,-.012]],[[0,0,.017],[-.031,.008,.0044],[.031,-.007,.0044]]);
 plate('thermostat-housing',flange,.005,at(0,0),'blackPaint',[-Math.PI/2,0,0],.001);
 plate('thermostat-gasket',flange,.0012,at(0,-.0038),'dark',[-Math.PI/2,0,0]);
 // Lower neck is a drawn transition. Upper neck has a true side opening
 // into the hose outlet, so isolation does not reveal a solid black plug.
 lathe('thermostat-housing',[[.017,.002],[.019,.006],[.023,.026],[.024,.040],[.024,.045],[.022,.045],[.021,.026],[.017,.006],[.017,.002]],C,'blackPaint');
 const N=96,M=52,r=.024,inner=.022,lo=.045,hi=.128,cy=.095,port=.015,positions=[],uv=[],indices=[];
 for(const radius of [r,inner])for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){
  const a=i/N*Math.PI*2,y=lo+(hi-lo)*j/M;positions.push(...at(Math.cos(a)*radius,y,Math.sin(a)*radius));uv.push(i/N,j/M);
 }
 const layer=(N+1)*(M+1);
 for(let j=0;j<M;j++)for(let i=0;i<N;i++){
  const a=(i+.5)/N*Math.PI*2,y=lo+(hi-lo)*(j+.5)/M;
  if(Math.cos(a)<0&&(Math.sin(a)*r)**2+(y-cy)**2<port**2)continue;
  const v=j*(N+1)+i;indices.push(v,v+1,v+N+1,v+1,v+N+2,v+N+1);const b=v+layer;indices.push(b,b+N+1,b+1,b+1,b+N+1,b+N+2);
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();h.add(id('thermostat-housing'),geo,'blackPaint').material.side=T.DoubleSide;
 washer('thermostat-housing',.025,.022,.003,at(0,.125),'blackPaint');
 lathe('thermostat-housing',[[.0215,.126],[.027,.126],[.029,.130],[.029,.132],[.026,.134],[.023,.133],[.0215,.130],[.0215,.126]],C,'zinc');
 // Hollow hose neck, rolled retention bead and welded attachment fillet.
 lathe('thermostat-housing',[[.0138,0],[.0155,0],[.0155,.027],[.017,.029],[.017,.031],[.0155,.033],[.0155,.038],[.0138,.038],[.0138,0]],at(-.017,cy),'blackPaint',X);
 h.ring(id('thermostat-housing'),.0158,.0013,at(-.023,cy),'blackPaint',[0,Math.PI/2,0]);
 for(const [x,z] of [[-.031,.008],[.031,-.007]])bolt('thermostat-bolts',at(x,.005,-z),.020);
 // 93.22 mm overall and 43.69 mm seal OD are a MotoRad 211-195
 // replacement envelope, explicitly distinguished from original GM CAD.
 const seat=.068,bottom=seat-.024,top=bottom+.09322;
 washer('thermostat-element',.021845,.0163,.00478,at(0,seat),'silicone');
 lathe('thermostat-element',[[.008,seat-.004],[.016,seat-.004],[.0195,seat-.0015],[.0205,seat],[.0205,seat+.001],[.017,seat+.001],[.010,seat+.004],[.008,seat+.004],[.008,seat-.004]],C);
 lathe('thermostat-element',[[0,bottom],[.004,bottom],[.006,bottom+.004],[.006,seat-.007],[.004,seat-.004],[0,seat-.004]],C,'copper');
 h.cyl(id('thermostat-element'),.0018,.031,at(0,seat+.009),'zinc',Y);
 lathe('thermostat-element',[[0,seat-.007],[.010,seat-.007],[.014,seat-.003],[.014,seat-.001],[0,seat-.001]],C);
 const spring=[];for(let i=0;i<=168;i++){const a=i/168*Math.PI*12;spring.push(at(Math.cos(a)*.007,seat-.020+i/168*.014,Math.sin(a)*.007));}h.tube(id('thermostat-element'),spring,.00085,'zinc');
 // Thin stamped handle is a closed arch with a long open centre, not a rod.
 const handle=new T.Shape();handle.moveTo(-.017,seat+.001);handle.lineTo(-.017,top-.009);handle.quadraticCurveTo(-.017,top,-.008,top);handle.lineTo(.008,top);handle.quadraticCurveTo(.017,top,.017,top-.009);handle.lineTo(.017,seat+.001);handle.lineTo(.012,seat+.001);handle.lineTo(.012,top-.010);handle.quadraticCurveTo(.012,top-.005,.007,top-.005);handle.lineTo(-.007,top-.005);handle.quadraticCurveTo(-.012,top-.005,-.012,top-.010);handle.lineTo(-.012,seat+.001);handle.closePath();
 plate('thermostat-element',handle,.0012,C,'zinc',Y,.00025);
 const bridge=new T.Shape();bridge.moveTo(-.013,seat+.002);bridge.lineTo(-.010,seat+.019);bridge.quadraticCurveTo(0,seat+.030,.010,seat+.019);bridge.lineTo(.013,seat+.002);bridge.lineTo(.009,seat+.002);bridge.lineTo(.006,seat+.017);bridge.quadraticCurveTo(0,seat+.024,-.006,seat+.017);bridge.lineTo(-.009,seat+.002);bridge.closePath();
 plate('thermostat-element',bridge,.003,C,'zinc',[0,Math.PI/2,0],.00025);
 // Short lower cage struts leave the spring and copper capsule visible.
 for(const z of [-.010,.010])h.box(id('thermostat-element'),[.004,.021,.001],at(0,seat-.012,z),'zinc',Y,{},.0002);
 const capY=.138;
 lathe('thermostat-cap',[[.027,-.006],[.030,-.006],[.031,-.003],[.031,0],[.028,.002],[.024,.004],[0,.004],[0,.002],[.024,.002],[.028,0],[.029,-.003],[.027,-.004],[.027,-.006]],at(0,capY),'zinc');
 for(const s of [-1,1]){
  const ear=outline([[s*.020,-.012],[s*.039,-.009],[s*.043,-.004],[s*.043,.004],[s*.039,.009],[s*.020,.012]]);
  plate('thermostat-cap',ear,.0015,at(0,capY-.001),'zinc',[-Math.PI/2,0,0],.0008);
  h.box(id('thermostat-cap'),[.012,.005,.0015],at(s*.025,capY-.006,-s*.011),'zinc',Y,{},.0003);
  h.box(id('thermostat-cap'),[.014,.0015,.006],at(s*.025,capY-.009,-s*.009),'zinc',Y,{},.0003);
 }
 washer('thermostat-cap',.0265,.018,.0025,at(0,capY-.0045),'silicone');
 // Small embossed direction arrows are geometry, not a bitmap photograph.
 for(const s of [-1,1])plate('thermostat-cap',outline([[-.008,-.002],[.004,-.002],[.004,-.005],[.010,0],[.004,.005],[.004,.002],[-.008,.002]]),.00035,at(0,capY+.0045,s*.012),'zinc',[-Math.PI/2,0,s<0?Math.PI:0]);
}

export function buildOilService(h){
 const {id,lathe,plate,outline,washer,hex,thread,bolt}=serviceTools(h);
 // Guide tube follows a compound bend. A sweep of a ring preserves a real
 // bore at the open mouth and both ends of the guide tube.
 const path=new T.CatmullRomCurve3([[.076,.979,.113],[.076,1.050,.151],[.091,1.165,.209],[.097,1.295,.255],[.074,1.415,.271]].map(p=>new T.Vector3(...p)));
 const section=new T.Shape();section.absarc(0,0,.0047,0,Math.PI*2);const hole=new T.Path();hole.absarc(0,0,.0033,0,Math.PI*2,true);section.holes.push(hole);
 h.add(id('dipstick-tube'),new T.ExtrudeGeometry(section,{steps:96,bevelEnabled:false,extrudePath:path,curveSegments:20}),'zinc');
 const tip=path.getPoint(1),axis=path.getTangent(1),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),axis);
 const mouth=lathe('dipstick-tube',[[.0033,0],[.0047,0],[.006,.008],[.006,.011],[.0043,.011],[.0033,.003],[.0033,0]],tip.toArray());mouth.quaternion.copy(q);
 plate('dipstick-tube',outline([[-.007,-.010],[.018,-.010],[.022,-.005],[.022,.005],[.018,.010],[-.007,.010]],[[.015,0,.0033]]),.0015,[.097,1.292,.255],'zinc');
 bolt('dipstick-bolt',[.112,1.292,.259],.013,'z',.0045);
 const entry=path.getPoint(0);h.ring(id('dipstick-seal'),.0048,.0015,entry.toArray(),'silicone',[Math.PI/2,0,0]);
 // Flat rectangular blade follows the guide and extends into the sump.
 const bladeCurve=new T.CatmullRomCurve3([[.076,.851,.046],[.076,.929,.083],...path.getPoints(40).map(v=>v.toArray())].map(p=>new T.Vector3(...p)));
 const blade=outline([[-.0024,-.00035],[.0024,-.00035],[.0024,.00035],[-.0024,.00035]]);
 h.add(id('dipstick'),new T.ExtrudeGeometry(blade,{steps:100,bevelEnabled:false,extrudePath:bladeCurve}),'zinc');
 const stopper=lathe('dipstick',[[0,0],[.0034,0],[.0034,.010],[.006,.012],[.006,.015],[.003,.018],[0,.018]],tip.toArray(),'blackPaint');stopper.quaternion.copy(q);
 const handle=new T.Shape();handle.absellipse(0,.035,.012,.019,0,Math.PI*2,false,0);const ih=new T.Path();ih.absellipse(0,.035,.008,.014,0,Math.PI*2,true,0);handle.holes.push(ih);
 const hg=new T.ExtrudeGeometry(handle,{depth:.0018,bevelEnabled:true,bevelSize:.0004,bevelThickness:.0004,bevelSegments:2,curveSegments:32});hg.translate(0,0,-.0009);hg.applyQuaternion(q);h.add(id('dipstick'),hg,'zinc',tip.toArray());
 for(const y of [.877,.912])h.box(id('dipstick'),[.0048,.0007,.0004],[.076,y,.046+(y-.851)*.47],'dark');
 // Early large sender. This is deliberately the H-22 A/C pipe preview;
 // neither VIN nor a replacement catalogue proves the installed option.
 const S=[-.190,1.349,-.193];
 hex('oil-pressure-fitting',.009,.014,[.133,1.084,-.142],'gold',[Math.PI/2,0,0]);
 lathe('oil-pressure-fitting',[[.0025,0],[.0055,0],[.0055,.014],[.0025,.014],[.0025,0]],[.133,1.084,-.144],'gold',[Math.PI/2,0,0]);
 h.tube(id('oil-pressure-pipe'),[[.133,1.084,-.155],[.092,1.079,-.180],[-.134,1.095,-.196],[-.188,1.135,-.204],[-.190,1.326,-.193]],.0032,'zinc');
 hex('oil-pressure-pipe',.010,.018,[-.190,1.327,-.193],'gold');
 plate('oil-pressure-pipe',outline([[-.009,-.008],[.029,-.008],[.032,0],[.029,.009],[-.009,.009]],[[.023,0,.0035]]),.002,[-.190,1.323,-.193],'zinc',[Math.PI/2,0,0]);
 bolt('oil-pressure-bolt',[-.167,1.327,-.193],.035,'y',.005);
 thread('oil-pressure-sender',.0065,.011,[S[0],S[1]-.022,S[2]],'gold');hex('oil-pressure-sender',.013,.013,[S[0],S[1]-.010,S[2]],'zinc');
 lathe('oil-pressure-sender',[[0,-.017],[.007,-.017],[.007,-.003],[.020,.003],[.0215,.008],[.0215,.014],[.020,.015],[0,.015]],S,'zinc');
 lathe('oil-pressure-sender',[[0,.011],[.021,.011],[.0215,.019],[.021,.049],[.019,.061],[.014,.066],[.010,.066],[.010,.057],[0,.057]],S,'phenolic');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;h.box(id('oil-pressure-sender'),[.0025,.034,.002],[S[0]+Math.cos(a)*.021,S[1]+.033,S[2]+Math.sin(a)*.021],'phenolic',[0,-a,0],{},.0005);}
 washer('oil-pressure-sender',.0218,.0198,.002,[S[0],S[1]+.015,S[2]],'zinc');
 for(const [x,z] of [[-.005,-.004],[.005,-.004],[0,.005]])h.box(id('oil-pressure-sender'),[.003,.009,.0007],[S[0]+x,S[1]+.064,S[2]+z],'zinc');
 // Distributor-driven oil-pump shaft: a distinct six-sided steel part.
 hex('oil-pump-drive',.0041,.198,[.105,1.068,0],'rotor');washer('oil-pump-drive',.006,.004,.004,[.105,1.151,0],'zinc');
 const F=[.134,1.065,-.166],filterRot=[0,0,.22];
 washer('oil-filter-fitting',.010,.006,.024,F,'zinc',filterRot);
 // Thread axis follows the existing tilted filter.
 const axisFilter=new T.Vector3(0,1,0).applyEuler(new T.Euler(...filterRot)).toArray();
 thread('oil-filter-fitting',.0099,.020,[F[0]+.002,F[1]-.010,F[2]],'zinc',axisFilter);
 washer('oil-filter-bypass',.009,.004,.003,[.109,1.067,-.164],'zinc',filterRot);
 h.cyl(id('oil-filter-bypass'),.005,.005,[.109,1.069,-.164],'zinc',filterRot);
 const spring=[];for(let i=0;i<=72;i++){const a=i/72*Math.PI*8;spring.push([.109+Math.cos(a)*.004,1.072+i/72*.012,-.164+Math.sin(a)*.004]);}h.tube(id('oil-filter-bypass'),spring,.00065,'zinc');
 // 1985–86 rear end seal, separate from the two side-rail gaskets.
 const arc=new T.Shape();arc.absarc(0,0,.074,Math.PI,Math.PI*2);arc.lineTo(.066,0);arc.absarc(0,0,.066,Math.PI*2,Math.PI,true);arc.closePath();
 plate('pan-rear-seal',arc,.011,[.196,1.004,0],'silicone',[0,Math.PI/2,0]);
 for(const x of [-.172,-.115,-.054,.01,.074,.14,.177])for(const z of [-.121,.121])bolt('pan-bolts',[x,.945,z],.019,'y',.0042);
 bolt('pan-drain-plug',[.132,.845,-.109],.012,'z',.007);
}

export function buildTimingService(h){
 const {id,lathe,plate,outline,washer,bolt}=serviceTools(h);
 const seal=[-.277,1.05,0];
 washer('front-crank-seal',.028,.020,.008,seal,'zinc',X);
 lathe('front-crank-seal',[[.019,-.004],[.027,-.004],[.027,.004],[.022,.004],[.019,.001],[.019,-.004]],seal,'silicone',X);
 h.ring(id('front-crank-seal'),.022,.0006,[-.273,1.05,0],'zinc',[0,Math.PI/2,0]);
 const gasket=new T.Shape();gasket.moveTo(-.069,-.098);gasket.quadraticCurveTo(-.107,-.087,-.103,-.040);gasket.lineTo(-.080,.095);gasket.quadraticCurveTo(-.069,.149,0,.154);gasket.quadraticCurveTo(.069,.149,.080,.095);gasket.lineTo(.103,-.040);gasket.quadraticCurveTo(.107,-.087,.069,-.098);gasket.closePath();
 const inner=new T.Path();inner.moveTo(-.061,-.085);inner.lineTo(.061,-.085);inner.quadraticCurveTo(.090,-.082,.087,-.037);inner.lineTo(.065,.092);inner.quadraticCurveTo(.055,.134,0,.139);inner.quadraticCurveTo(-.055,.134,-.065,.092);inner.lineTo(-.087,-.037);inner.quadraticCurveTo(-.090,-.082,-.061,-.085);gasket.holes.push(inner);
 plate('timing-cover-gasket',gasket,.0015,[-.246,1.097,0],'dark',[0,Math.PI/2,0]);
 plate('timing-guide',outline([[-.021,-.046],[.015,-.042],[.019,.041],[-.020,.045]],[[.009,-.032,.003],[.010,.032,.003]]),.003,[-.217,1.132,.064],'zinc',[0,Math.PI/2,0]);
 h.box(id('timing-guide'),[.006,.075,.008],[-.225,1.132,.057],'phenolic',[.06,0,0],{},.003);
 const pointer=outline([[-.029,-.017],[.023,-.017],[.030,-.011],[.030,-.002],[.020,.007],[.012,.003],[.004,.009],[-.004,.006],[-.013,.012],[-.028,.003]],[[.021,-.010,.003]]);
 plate('timing-pointer',pointer,.0015,[-.307,1.108,.070],'zinc',[0,Math.PI/2,-.5]);bolt('timing-pointer',[-.307,1.125,.058],.010,'x',.0035);
}

export function buildWaterPump(h){
 const {id,lathe,plate,outline,washer,bolt}=serviceTools(h),C=[-.283,1.218,.076];
 const at=(x,y,z)=>[C[0]+x,C[1]+y,C[2]+z];
 // Cast volute, irregular bolt ears and machined rear flange replace the
 // former plain cylinder. Bearing/impeller internals are not invented here.
 const boundary=[[-.077,-.040],[-.069,-.060],[-.045,-.061],[-.025,-.053],[.015,-.052],[.035,-.068],[.052,-.063],[.058,-.043],[.051,-.020],[.064,.005],[.058,.034],[.073,.059],[.059,.074],[.038,.066],[.021,.052],[-.018,.055],[-.042,.068],[-.061,.059],[-.060,.034],[-.075,.018]];
 const holes=[[-.061,-.044,.0035],[.041,-.052,.0035],[.058,.058,.0035],[-.047,.053,.0035],[-.065,.009,.0035]];
 const contour=new T.CatmullRomCurve3(boundary.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal');
 const flange=outline(contour.getPoints(120).map(p=>[p.x,p.y]),[[0,0,.031],...holes]);
 plate('water-pump',flange,.007,at(.012,0,0),'castAluminum',[0,Math.PI/2,0],.0014);
 plate('water-pump-gasket',flange,.0015,at(.017,0,0),'dark',[0,Math.PI/2,0]);
 lathe('water-pump',[[.030,-.016],[.050,-.016],[.053,-.009],[.050,.002],[.040,.013],[.025,.024],[.018,.025],[.018,.040],[.013,.043],[.008,.043],[.008,.032],[.017,.020],[.024,.013],[.030,.005],[.030,-.016]],C,'castAluminum',X);
 h.cyl(id('water-pump'),.007,.048,at(-.033,0,0),'rotor',X);
 washer('water-pump',.024,.007,.006,at(-.041,0,0),'zinc',X);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;h.tube(id('water-pump'),[at(-.010,Math.cos(a)*.044,Math.sin(a)*.044),at(-.021,Math.cos(a)*.026,Math.sin(a)*.026)],.004,'castAluminum');}
 // Machined heater fitting socket and the early threaded hose nipple.
 const hosePos=at(.001,.042,.042);
 // Main coolant return neck, separate from the small threaded heater return.
 // Port envelope is reconstructed; both views and hose use this same datum.
 lathe('water-pump',[[.017,0],[.019,0],[.019,.057],[.0205,.059],[.0205,.061],[.019,.062],[.017,.062],[.017,0]],[pumpInletEngine[0],pumpInletEngine[1],pumpInletEngine[2]-.062],'castAluminum',[Math.PI/2,0,0]);
 h.cyl(id('water-pump'),.015,.034,hosePos,'castAluminum',Y);
 lathe('water-pump-fitting',[[.006,0],[.009,0],[.009,.015],[.011,.017],[.011,.020],[.009,.022],[.009,.029],[.006,.029],[.006,0]],[hosePos[0],hosePos[1]+.012,hosePos[2]],'zinc');
 for(const [z,y] of holes)bolt('water-pump-bolts',at(.006,y,-z),.035,'x',.0045,1);
 // Stamped dish pulley with an open hub hole and actual mounting holes.
 const pulleyX=-.053;
 lathe('water-pulley',[[.008,-.002],[.021,-.002],[.037,-.009],[.056,-.009],[.060,-.006],[.060,-.003],[.055,-.002],[.055,.005],[.060,.006],[.060,.009],[.056,.012],[.037,.011],[.020,.004],[.008,.004],[.008,-.002]],at(pulleyX,0,0),'blackPaint',X);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;bolt('water-pulley-bolts',at(pulleyX-.007,Math.cos(a)*.016,Math.sin(a)*.016),.016,'x',.004,1);}
}

export function buildEngineService(h){buildThermostat(h);buildOilService(h);buildTimingService(h);buildWaterPump(h);}
