import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness,transformedGeometry} from './vehicle-frame.js';
import {suspensionParts,suspensionSections,suspensionCorners} from './suspension-catalog.js';

export function suspensionMaterials(base=createMaterials()){
 const m={...base};for(const k of ['dark','blackPaint','rubber','castAluminum','rotor'])m[k]=base[k].clone();
 m.dark.color.set('#24282a');m.dark.roughness=.48;m.dark.metalness=.64;m.dark.bumpScale=.000025;
 m.blackPaint.roughness=.33;m.blackPaint.bumpScale=.000025;m.rubber.roughness=.77;m.rubber.bumpScale=.000025;m.castAluminum.roughness=.55;m.castAluminum.bumpScale=.000035;m.rotor.bumpScale=.000012;
 return m;
}
export function createSuspensionDetail(){
 const root=new T.Group(),groups=new Map();for(const p of suspensionParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'suspension',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(suspensionSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,suspensionMaterials());buildSuspension(h,groups);h.optimize();correctLegacyHandedness(groups);return {root,groups};
}
function place(groups,ids,matrix){for(const id of ids)for(const m of groups.get(id).children){m.updateMatrix();const old=m.geometry;m.geometry=transformedGeometry(old,matrix.clone().multiply(m.matrix));old.dispose();m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.set(1,1,1);}}
function roundedLoop(points,r=.012){
 const out=[];for(let i=0;i<points.length;i++){const b=new T.Vector2(...points[i]),a=new T.Vector2(...points[(i+points.length-1)%points.length]),c=new T.Vector2(...points[(i+1)%points.length]);const d=Math.min(r,b.distanceTo(a)*.27,b.distanceTo(c)*.27),entry=b.clone().addScaledVector(a.sub(b).normalize(),d),exit=b.clone().addScaledVector(c.sub(b).normalize(),d);const curve=new T.QuadraticBezierCurve(entry,b,exit);out.push(...curve.getPoints(5).map(p=>p.toArray()));}return out;
}
function chassisTools(h){
 const {add,cyl,ring,tube,surface,box}=h,{annulus,plate,spring,gear}=mechanicalTools(h);
 function axis(mesh,v){mesh.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...v).normalize());return mesh;}
 const sleeve=(id,r,b,w,pos,mat='rotor',v=[0,1,0])=>axis(annulus(id,r,b,w,pos,mat),v);
 const shaft=(id,r,l,pos,mat='zinc',v=[0,1,0])=>{const m=cyl(id,r,l,pos,mat);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...v).normalize());return m;};
 function lathe(id,profile,pos,mat='dark',v=[0,1,0]){const g=new T.LatheGeometry(profile.map(([y,r])=>new T.Vector2(r,y)),64);const m=add(id,g,mat,pos);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...v).normalize());return m;}
 function hex(id,pos,r=.009,w=.009,v=[0,1,0],bore=0){const sh=new T.Shape();for(let i=0;i<6;i++){const a=i*Math.PI/3;i?sh.lineTo(Math.cos(a)*r,Math.sin(a)*r):sh.moveTo(Math.cos(a)*r,Math.sin(a)*r);}sh.closePath();if(bore){const p=new T.Path();p.absarc(0,0,bore,0,Math.PI*2,true);sh.holes.push(p);}const g=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:true,bevelSize:.0004,bevelThickness:.0003,bevelSegments:2,curveSegments:16});g.translate(0,0,-w/2);g.rotateY(Math.PI/2);return axis(add(id,g,'zinc',pos),v);}
 function fastener(id,pos,l=.05,r=.006,v=[0,1,0]){hex(id,pos,r*1.55,r*.75,v);shaft(id,r,l,pos.map((n,i)=>n-v[i]*l/2),'zinc',v);sleeve(id,r*1.75,r*1.02,.0015,pos.map((n,i)=>n-v[i]*.004),'zinc',v);}
 function bushing(id,pos,r=.021,w=.043,v=[0,0,1]){sleeve(id,r,r*.44,w,pos,'rubber',v);sleeve(id,r*.46,r*.28,w+.007,pos,'rotor',v);sleeve(id,r+.001,r-.001,w-.004,pos,'dark',v);for(const s of [-1,1])sleeve(id,r+.002,r*.45,.003,pos.map((n,i)=>n+v[i]*s*w/2),'rubber',v);}
 function flat(id,outline,holes,y,thickness=.003,mat='dark'){
  const sh=new T.Shape();outline.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));sh.closePath();
  for(const hole of holes){const p=new T.Path();if(hole.length===3)p.absarc(hole[0],-hole[1],hole[2],0,Math.PI*2,true);else{hole.forEach(([x,z],i)=>i?p.lineTo(x,-z):p.moveTo(x,-z));p.closePath();}sh.holes.push(p);}
  const g=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:true,bevelSize:.0007,bevelThickness:.0005,bevelSegments:2,curveSegments:24});g.translate(0,0,-thickness/2);g.rotateX(-Math.PI/2);return add(id,g,mat,[0,y,0]);
 }
 function coil(id,pos,r,length,turns=6,wire=.0068){const curve=new T.CatmullRomCurve3(Array.from({length:turns*32+1},(_,i)=>{const u=i/(turns*32),a=u*turns*Math.PI*2;const pitch=Math.max(0,Math.min(1,(u-.04)/.92));return new T.Vector3(pos[0]+Math.cos(a)*r,pos[1]+pitch*length,pos[2]+Math.sin(a)*r);}));return add(id,new T.TubeGeometry(curve,turns*40,wire,12,false),'blackPaint');}
 function bellows(id,pos,r,l,v=[1,0,0],turns=8){const p=[];for(let i=0;i<=turns*8;i++){const u=i/(turns*8),fade=Math.min(1,u*12,(1-u)*12);p.push([(u-.5)*l,r*(.72+.28*fade*(.5-.5*Math.cos(u*turns*Math.PI*2)))]);}lathe(id,p,pos,'rubber',v);}
 function cotter(id,pos,v=[1,0,0]){const points=[[0,-.015,0],[0,.008,0],[.002,.010,0],[.004,.008,0],[.002,-.015,0],[-.004,-.019,0]];const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(...v));tube(id,points.map(p=>new T.Vector3(...p).applyQuaternion(q).add(new T.Vector3(...pos)).toArray()),.00065,'zinc');}
 return {axis,sleeve,shaft,lathe,hex,fastener,bushing,flat,coil,bellows,cotter,annulus,plate,spring,gear};
}
export function buildSuspension(h,groups){
 for(const c of suspensionCorners){buildArms(h,c);if(c.front){const pivot=new T.Vector3(.633,.430,0);const turn=new T.Matrix4().makeTranslation(...pivot.toArray()).multiply(new T.Matrix4().makeRotationX(Math.PI)).multiply(new T.Matrix4().makeTranslation(...pivot.clone().negate().toArray()));place(groups,suspensionParts.filter(p=>p.corner===c.id&&['upper-joint','upper-stud','upper-boot','upper-joint-fasteners','upper-joint-nut','upper-cotter'].includes(p.role)).map(p=>p.id),turn);buildFrontSpring(h,c);}else{buildRearStrut(h,c);const p=new T.Vector3(.649,.378,-.005),lean=new T.Matrix4().makeTranslation(...p.toArray()).multiply(new T.Matrix4().makeRotationZ(.058)).multiply(new T.Matrix4().makeTranslation(...p.clone().negate().toArray()));place(groups,suspensionParts.filter(q=>q.corner===c.id&&q.section.endsWith('-spring')&&!q.role.startsWith('knuckle')).map(q=>q.id),lean);buildRearToe(h,c);}const matrix=new T.Matrix4().makeScale(c.sign,1,1);matrix.setPosition(0,0,c.z);place(groups,suspensionParts.filter(p=>p.corner===c.id).map(p=>p.id),matrix);}
 buildStabilizer(h);buildRack(h);buildFrames(h);
}
function buildArms(h,c){
 const {tube,surface,box,cyl,add}=h,{flat,bushing,shaft,sleeve,hex,fastener,lathe,cotter}=chassisTools(h),id=k=>'su-'+c.id+'-'+k;
 for(const level of c.front?['upper','lower']:['lower']){
  const up=level==='upper',y=up?.425:.224,inner=up?.36:c.front?.30:.34,outer=c.front?.633:.647,span=up?.115:c.front?.175:.185;
  // Open pressed-steel A-arm: stamped web, turned flange and swaged eyes.
  const outline=roundedLoop([[inner-.025,-span-.028],[inner+.036,-span-.027],[outer-.053,-.059],[outer+.031,-.030],[outer+.037,.018],[outer+.013,.042],[outer-.044,.061],[inner+.034,span+.027],[inner-.025,span+.026],[inner-.025,span-.015],[inner+.035,span-.027],[inner+.048,-span+.027],[inner-.025,-span+.014]],.020);
  const window=roundedLoop([[inner+.085,-span+.043],[outer-.093,-.017],[outer-.093,.017],[inner+.085,span-.043]],.012);
  flat(id(level+'-arm'),outline,[window,[outer,0,up?.013:.022]],y,.0035);
  const edge=outline.map(([x,z])=>[x,y+.018,z]);edge.push(edge[0]);tube(id(level+'-arm'),edge,.0028,'dark');
  for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];surface(id(level+'-arm'),2,2,(u,v)=>[a[0]+(b[0]-a[0])*u,y+.017*v,a[1]+(b[1]-a[1])*u],'dark');}
  if(c.front&&!up){
   // Integral pressed spring pocket carries the bottom coil, with a real
   // center opening and a raised locating lip, as in the early factory figure.
   lathe(id('lower-arm'),[[0,.028],[0,.060],[.006,.076],[.012,.083],[.020,.085],[.019,.082],[.012,.080],[.004,.060],[.003,.028],[0,.028]],[.49,.232,0],'dark');
   for(const z of [-.06,.06])tube(id('lower-arm'),[[.398,y+.004,z],[.429,y+.010,z*.98],[.49,y+.012,z]],.006,'dark');
  }
  // Pressed strengthening swages follow the two load paths.
  for(const s of [-1,1])tube(id(level+'-arm'),[[inner+.035,y+.008,s*span],[inner+.16,y+.014,s*span*.52],[outer-.055,y+.006,s*.039]],.005,'dark');
  for(const s of [-1,1]){const z=s*span;sleeve(id(level+'-arm'),.024,.0212,.058,[inner,y,z],'dark',[0,0,1]);bushing(id(level+(s<0?'-bush-front':'-bush-rear')),[inner,y,z],.021,.054);}
  if(up){shaft(id(level+'-pivot-bolts'),.006,.338,[inner,y,0],'zinc',[0,0,1]);hex(id(level+'-pivot-bolts'),[inner,y,-.174],.009,.009,[0,0,1]);}
  else for(const s of [-1,1])fastener(id(level+'-pivot-bolts'),[inner,y,s*span+.048],.094,.006,[0,0,1]);
  for(const s of [-1,1]){const z=s*(span+.036);sleeve(id(level+'-pivot-washers'),.014,.0065,.003,[inner,y,z],'zinc',[0,0,1]);hex(id(level+'-pivot-nuts'),[inner,y,z+s*.009],.010,.009,[0,0,1],.006);}
  const jy=up?.430:.212;
  lathe(id(level+'-joint'),[[-.015,.009],[-.013,.020],[.002,.024],[.009,.023],[.012,.014],[.012,.008],[-.014,.008],[-.015,.009]],[outer,jy,0],'iron');
  const ball=add(id(level+'-stud'),new T.SphereGeometry(.011,24,16),'rotor',[outer,jy+.002,0]);shaft(id(level+'-stud'),.007,.040,[outer,jy+.025,0],'rotor');
  lathe(id(level+'-boot'),[[0,.021],[.005,.023],[.013,.018],[.019,.009],[.018,.007],[.013,.014],[.005,.020],[0,.021]],[outer,jy+.010,0],'rubber');
  if(up){flat(id(level+'-joint'),[[outer-.026,-.027],[outer+.025,-.026],[outer+.026,.027],[outer-.026,.027]],[[outer,0,.012]],jy+.006,.003,'iron');for(const dx of [-.020,.020])for(const z of [-.020,.020])shaft(id(level+'-joint-fasteners'),.004,.013,[outer+dx,jy+.003,z],'dark');}
  else if(c.front)sleeve(id(level+'-joint-fasteners'),.025,.022,.002,[outer,jy-.003],'zinc');
  else fastener(id(level+'-joint-fasteners'),[outer-.027,.243,.013],.057,.006,[1,0,0]);
  hex(id(level+'-joint-nut'),[outer,jy+.049,0],.010,.012,[0,1,0],.006);for(let n=0;n<6;n++){const a=n*Math.PI/3;box(id(level+'-joint-nut'),[.003,.004,.004],[outer+Math.cos(a)*.008,jy+.057,Math.sin(a)*.008],'zinc',[0,-a,0],{},.0002);}
  if(c.front)cotter(id(level+'-cotter'),[outer,jy+.057,0],[1,0,0]);else hex(id(level+'-cotter'),[outer+.032,.243,.013],.010,.009,[1,0,0],.006);
 }
}
function buildFrontSpring(h,c){
 const {tube,box}=h,{coil,lathe,sleeve,shaft,bushing,fastener,hex}=chassisTools(h),id=k=>'su-'+c.id+'-'+k,x=.49;
 coil(id('spring'),[x,.246,0],.068,.252,6,.0069);
 lathe(id('isolator'),[[-.004,.041],[-.004,.083],[.007,.083],[.012,.074],[.007,.061],[.007,.041],[-.004,.041]],[x,.513,0],'rubber');
 const sx=.556,sz=.112;
 lathe(id('shock-body'),[[0,.015],[.012,.023],[.145,.023],[.151,.020],[.156,.011],[.156,.008],[.01,.008],[0,.015]],[sx,.255,sz],'blackPaint');
 shaft(id('shock-rod'),.008,.170,[sx,.462,sz],'chrome');lathe(id('shock-rod'),[[0,.026],[.108,.026],[.112,.010],[.112,.008],[.108,.024],[0,.024],[0,.026]],[sx,.414,sz],'dark');
 for(const [key,y] of [['lower',.248],['upper',.54]]){sleeve(id(key==='lower'?'shock-body':'shock-rod'),.022,.015,.034,[sx,y,sz],'dark',[1,0,0]);bushing(id('shock-'+key+'-bush'),[sx,y,sz],.015,.034,[1,0,0]);fastener(id('shock-bolts'),[sx-.032,y,sz],.07,.005,[-1,0,0]);hex(id('shock-nuts'),[sx+.040,y,sz],.008,.008,[1,0,0],.005);}
 lathe(id('bumpstop'),[[0,.029],[.010,.029],[.036,.023],[.061,.009],[.063,0],[0,0],[0,.029]],[.532,.301,.044],'rubber',[0,-1,0]);
}
function buildRearStrut(h,c){
 const {tube,box}=h,{lathe,shaft,sleeve,coil,bellows,flat,hex,fastener}=chassisTools(h),id=k=>'su-'+c.id+'-'+k,x=.649,z=-.005;
 lathe(id('strut-body'),[[0,.025],[.017,.026],[.204,.026],[.213,.023],[.217,.015],[.217,.011],[.005,.011],[0,.025]],[x,.378,z],'blackPaint');
 // Bracket holes share the two carrier-ear centers from the brake explorer.
 for(const dx of [-.034,.033]){
  const plate=mechanicalTools(h).plate(id('strut-body'),[[.365,-.037],[.449,-.037],[.459,.024],[.37,.030]],[[.388,z,.007],[.423,z,.007]],.005,x+dx,'dark');
 }
 shaft(id('strut-rod'),.011,.180,[x,0.603,z],'chrome');shaft(id('strut-rod'),.007,.04,[x,0.730,z],'rotor');
 for(const y of [.388,.423]){fastener(id('knuckle-bolts'),[x-.047,y,z],.101,.007,[-1,0,0]);sleeve(id('knuckle-washers'),.014,.0075,.003,[x+.052,y,z],'zinc',[1,0,0]);hex(id('knuckle-nuts'),[x+.061,y,z],.012,.010,[1,0,0],.007);}
 const seat=(key,y,r,mat)=>lathe(id(key),[[0,.027],[0,r],[.006,r+.004],[.019,r+.005],[.018,r+.002],[.007,r],[.004,.027],[0,.027]],[x,y,z],mat);
 seat('lower-seat',.467,.086,'dark');seat('lower-isolator',.475,.078,'rubber');coil(id('spring'),[x,.487,z],.072,.175,5.5,.0073);
 bellows(id('dust-boot'),[x,0.592,z],.032,.132,[0,1,0],9);lathe(id('jounce'),[[0,.019],[.009,.026],[.021,.022],[.030,.025],[.048,.017],[.057,.015],[.057,.012],[0,.012],[0,.019]],[x,0.612,z],'rubber');
 seat('upper-isolator',0.669,.078,'rubber');seat('upper-seat',0.679,.084,'dark');sleeve(id('seat-washer'),.030,.0115,.006,[x,0.695,z],'zinc');
 lathe(id('mount'),[[-.012,.015],[-.010,.052],[.006,.061],[.019,.059],[.024,.031],[.024,.012],[-.012,.012],[-.012,.015]],[x,0.710,z],'rubber');
 const outline=Array.from({length:60},(_,i)=>{const a=i*Math.PI/30,r=.058+.012*Math.cos(a*3);return[x+Math.cos(a)*r,z+Math.sin(a)*r];});const holes=[[x,z,.016]];
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const p=[x+Math.cos(a)*.057,0.723,z+Math.sin(a)*.057];holes.push([p[0],p[2],.005]);shaft(id('mount'),.004,.04,[p[0],0.728,p[2]],'zinc');sleeve(id('mount-washers'),.009,.0045,.002,[p[0],0.748,p[2]],'zinc');hex(id('mount-nuts'),[p[0],0.755,p[2]],.007,.007,[0,1,0],.004);}
 flat(id('reinforcement'),outline,holes,0.741,.0025,'zinc');sleeve(id('mount-washer'),.020,.0075,.004,[x,0.738,z],'zinc');hex(id('shaft-nut'),[x,0.747,z],.011,.010,[0,1,0],.007);
}
function buildRearToe(h,c){
 const {tube,add}=h,{shaft,sleeve,lathe,bellows,hex,fastener,cotter}=chassisTools(h),id=k=>'su-'+c.id+'-'+k,z=-.109;
 shaft(id('toe-inner'),.007,.28,[.40,.262,z],'rotor',[1,0,0]);lathe(id('toe-inner-joint'),[[-.022,.010],[-.018,.022],[.019,.022],[.025,.010],[-.022,.010]],[.263,.262,z],'iron',[1,0,0]);
 bellows(id('toe-boot'),[.29,.262,z],.024,.07,[1,0,0],4);for(const x of [.257,.324])sleeve(id('toe-clamps'),.023,.0218,.002,[x,.262,z],'zinc',[1,0,0]);
 tube(id('toe-outer'),[[.495,.262,z],[.574,.262,z],[.613,.262,z]],.010,'dark');lathe(id('toe-outer'),[[-.014,.015],[-.008,.020],[.011,.018],[.017,.008],[-.014,.015]],[.613,.251,z],'iron');shaft(id('toe-outer'),.006,.044,[.613,.274,z],'rotor');
 lathe(id('toe-seal'),[[0,.019],[.007,.020],[.015,.008],[.013,.006],[0,.016],[0,.019]],[.613,.263,z],'rubber');hex(id('toe-jam'),[.493,.262,z],.010,.007,[1,0,0],.007);hex(id('toe-nut'),[.613,.301,z],.009,.009,[0,1,0],.006);cotter(id('toe-cotter'),[.613,.306,z]);
 fastener(id('toe-attachment'),[.263,.30,z],.063,.006,[0,1,0]);hex(id('toe-attachment'),[.263,.229,z],.010,.009,[0,1,0],.006);
}
function buildStabilizer(h){
 const {tube,box}=h,{sleeve,shaft,hex,fastener,lathe}=chassisTools(h),id=k=>'su-stab-'+k;
 tube(id('bar'),[[-.615,.262,-1.205],[-.58,.253,-1.36],[-.51,.253,-1.466],[-.39,.253,-1.49],[.39,.253,-1.49],[.51,.253,-1.466],[.58,.253,-1.36],[.615,.262,-1.205]],.0115,'blackPaint');
 for(const s of [-1,1]){
  const x=s*.375;box(id('bushings'),[.05,.040,.039],[x,.257,-1.49],'rubber',[],{},.011);sleeve(id('clamps'),.028,.025,.022,[x,.258,-1.49],'zinc',[1,0,0]);for(const z of [-1.519,-1.461]){box(id('clamps'),[.034,.003,.018],[x,.238,z],'zinc');fastener(id('bolts'),[x,.242,z],.023,.004,[0,1,0]);}
  const side=s===1?'left':'right',xx=s*.615,z=-1.205;shaft(id(side+'-bolt'),.005,.126,[xx,.253,z],'zinc');hex(id(side+'-bolt'),[xx,.187,z],.008,.006);sleeve(id(side+'-spacer'),.008,.0052,.036,[xx,.244,z],'zinc');
  for(const y of [.207,.221,.274,.288])lathe(id(side+'-grommets'),[[-.005,.0052],[-.005,.014],[0,.016],[.005,.014],[.005,.0052],[-.005,.0052]],[xx,y,z],'rubber');
  for(const y of [.200,.228,.267,.295])lathe(id(side+'-washers'),[[-.001,.0052],[-.001,.015],[.002,.016],[.003,.015],[.001,.0052],[-.001,.0052]],[xx,y,z],'zinc');hex(id(side+'-nut'),[xx,.307,z],.008,.009,[0,1,0],.005);
 }
}
function buildRack(h){
 const {add,box,tube,ring,surface}=h,{lathe,shaft,sleeve,hex,fastener,bellows,cotter,spring,gear}=chassisTools(h),id=k=>'su-rack-'+k,y=.294,z=-1.34;
 // Long hollow tube, driver-side pinion tower and machined bearing seats.
 lathe(id('housing'),[[-.375,.029],[-.354,.029],[-.345,.023],[.17,.023],[.19,.031],[.29,.033],[.335,.027],[.355,.027],[.355,.018],[-.375,.018],[-.375,.029]],[0,y,z],'castAluminum',[1,0,0]);
 for(const dz of [-.019,.019])tube(id('housing'),[[-.34,y+.011,z+dz],[.18,y+.011,z+dz]],.003,'castAluminum');
 const px=.254,pz=z+.030;lathe(id('housing'),[[-.025,.026],[.04,.026],[.059,.020],[.059,.013],[-.025,.013],[-.025,.026]],[px,y,pz],'castAluminum');
 shaft(id('rack'),.014,.855,[0,y,z],'rotor',[1,0,0]);for(let i=0;i<30;i++)box(id('rack'),[.003,.017,.004],[.095+i*.0064,y,z+.013],'rotor',[0,-.18,0],{},.0004);
 shaft(id('pinion'),.008,.119,[px,y+.061,pz],'rotor');const g=gear(id('pinion'),.017,.024,8,[0,0,0],.14,'rotor',.005);for(const m of g){m.rotation.z=Math.PI/2;m.position.set(px,y+.013,pz);}
 sleeve(id('bearing'),.014,.0085,.012,[px,y+.037,pz],'rotor');for(let n=0;n<14;n++){const a=n*Math.PI/7;shaft(id('bearing'),.0018,.010,[px+Math.cos(a)*.011,y+.037,pz+Math.sin(a)*.011],'rotor');}
 sleeve(id('seal'),.018,.0085,.004,[px,y+.059,pz],'rubber');ring(id('ring'),.018,.00085,[px,y+.064,pz],'dark',[Math.PI/2,0,0]);
 sleeve(id('bushing'),.019,.0144,.025,[-.348,y,z],'phenolic',[1,0,0]);ring(id('bushing-ring'),.020,.001,[-.369,y,z],'dark');
 lathe(id('housing'),[[0,.023],[.035,.023],[.036,.017],[0,.017],[0,.023]],[px,y,z+.009],'castAluminum',[0,0,1]);
 lathe(id('guide'),[[0,.015],[.020,.015],[.022,.011],[.018,.005],[0,.005],[0,.015]],[px,y,z+.014],'phenolic',[0,0,1]);spring(id('spring'),[px,y,z+.041],.010,.015,[0,0,1],4,.0012,'dark');hex(id('plug'),[px,y,z+.055],.021,.010,[0,0,1]);hex(id('locknut'),[px,y,z+.053],.026,.004,[0,0,1],.021);
 for(const x of [-.254,.194]){sleeve(id('mounts'),.034,.027,.035,[x,y,z],'rubber',[1,0,0]);sleeve(id('clamps'),.037,.034,.022,[x,y,z],'zinc',[1,0,0]);for(const zz of [z-.041,z+.041]){box(id('clamps'),[.032,.003,.027],[x,y-.022,zz],'zinc');fastener(id('bolts'),[x,y-.018,zz],.034,.005,[0,1,0]);}}
 for(const [side,s] of [['left',1],['right',-1]]){
  const rod=id(side+'-inner');shaft(rod,.007,.190,[s*.466,y,z],'rotor',[1,0,0]);lathe(rod,[[-.023,.010],[-.012,.023],[.013,.023],[.024,.010],[-.023,.010]],[s*.382,y,z],'dark',[1,0,0]);
  bellows(id(side+'-boot'),[s*.44,y,z],.035,.162,[1,0,0],8);for(const x of [s*.36,s*.52])sleeve(id(side+'-clamps'),Math.abs(x)<.4?.027:.011,Math.abs(x)<.4?.025:.009,.002,[x,y,z],'zinc',[1,0,0]);
  tube(id(side+'-outer'),[[s*.524,y,z],[s*.56,y,z],[s*.61,.270,-1.291]],.011,'dark');lathe(id(side+'-outer'),[[-.014,.015],[-.008,.020],[.009,.020],[.017,.007],[-.014,.015]],[s*.610,.257,-1.291],'iron');shaft(id(side+'-outer'),.006,.044,[s*.610,.281,-1.291],'rotor');
  lathe(id(side+'-seal'),[[0,.019],[.007,.02],[.015,.007],[.013,.0055],[0,.016],[0,.019]],[s*.610,.267,-1.291],'rubber');hex(id(side+'-jam'),[s*.522,y,z],.010,.008,[1,0,0],.007);hex(id(side+'-nut'),[s*.610,.311,-1.291],.009,.009,[0,1,0],.006);cotter(id(side+'-cotter'),[s*.610,.318,-1.291]);hex(id(side+'-grease'),[s*.610,.239,-1.291],.004,.004);shaft(id(side+'-grease'),.002,.007,[s*.610,.233,-1.291],'zinc');
 }
 // The separate hydraulic steering damper is on the passenger/right half.
 const dy=y-.025,dz=z-.077;lathe(id('damper'),[[-.17,.013],[-.16,.020],[.018,.020],[.025,.013],[-.17,.013]],[-.18,dy,dz],'blackPaint',[1,0,0]);shaft(id('damper'),.006,.19,[-.05,dy,dz],'chrome',[1,0,0]);
 for(const x of [-.373,.044]){sleeve(id('damper'),.017,.0065,.017,[x,dy,dz],'rubber',[0,0,1]);fastener(id('damper-studs'),[x,dy,dz-.015],.045,.005,[0,0,-1]);sleeve(id('damper-washers'),.011,.0055,.002,[x,dy,dz-.021],'zinc',[0,0,1]);hex(id('damper-nuts'),[x,dy,dz-.027],.008,.007,[0,0,1],.005);}
 sleeve(id('adapter'),.020,.014,.032,[-.382,y,z],'zinc',[1,0,0]);tube(id('adapter'),[[-.382,y,z],[-.373,dy,dz]],.011,'zinc');sleeve(id('boot-support'),.029,.015,.007,[-.36,y,z],'zinc',[1,0,0]);tube(id('housing'),[[.044,y,z],[.044,dy,dz]],.007,'castAluminum');
}
function buildFrames(h){
 const {box,tube,surface}=h,{flat,shaft,sleeve,bushing,hex,fastener,lathe}=chassisTools(h);
 // Two formed rails and contoured crossmembers. They are welded assemblies,
 // with mounts separate; not a solid rectangular frame envelope.
 for(const s of [-1,1]){
  const x=s*.49,points=[[x,.240,.64],[x,.222,.87],[x,.225,1.31],[x,.301,1.57]];
  for(const dx of [-.032,.032])surface('su-cradle-frame',36,4,(u,v)=>{const z=.64+u*.93,y=.222+.075*Math.pow(Math.max(0,(u-.64)/.36),1.3);return[x+dx,y+(v-.5)*.074,z];},'dark');
  for(const dy of [-.037,.037])surface('su-cradle-frame',36,3,(u,v)=>{const z=.64+u*.93,y=.222+.075*Math.pow(Math.max(0,(u-.64)/.36),1.3);return[x+(v-.5)*.064,y+dy,z];},'dark');
  bushing('su-cradle-front-bushings',[x,.235,.64],.044,.065,[1,0,0]);fastener('su-cradle-front-bolts',[x-s*.057,.235,.64],.114,.006,[-s,0,0]);
  for(const [key,y,r,w] of [['upper-cushions',.344,.060,.040],['lower-cushions',.280,.048,.026]])sleeve('su-cradle-'+key,r,.016,w,[x,y,1.57],'rubber');
  sleeve('su-cradle-spacers',.023,.007,.108,[x,.323,1.57],'zinc');lathe('su-cradle-retainers',[[-.004,.007],[-.004,.048],[.004,.052],[.006,.047],[.002,.007],[-.004,.007]],[x,.261,1.57],'zinc');fastener('su-cradle-rear-bolts',[x,.250,1.57],.145,.006,[0,-1,0]);hex('su-cradle-captive-nuts',[x,.389,1.57],.014,.01,[0,1,0],.006);box('su-cradle-captive-nuts',[.043,.004,.042],[x,.382,1.57],'dark');
  for(const zz of [1.0015,1.3715]){
   for(const dz of [-.035,.035]){const sh=new T.Shape();sh.moveTo(s*.30,.196);sh.lineTo(s*.30,.269);sh.lineTo(s*.49,.269);sh.lineTo(s*.49,.23);sh.lineTo(s*.38,.22);sh.lineTo(s*.38,.196);sh.closePath();const hole=new T.Path();hole.absarc(s*.34,.224,.0066,0,Math.PI*2,true);sh.holes.push(hole);const g=new T.ExtrudeGeometry(sh,{depth:.003,bevelEnabled:true,bevelSize:.001,bevelThickness:.0007,bevelSegments:2,curveSegments:20});h.add('su-cradle-frame',g,'dark',[0,0,zz+dz]);}
   flat('su-cradle-frame',[[s*.30,zz-.036],[s*.49,zz-.036],[s*.49,zz+.039],[s*.30,zz+.039]],[],.269,.003,'dark');
  }
  for(const dz of [-.175,.175]){
   const zz=-1.1865+dz;
   flat('su-crossmember-frame',[[s*.268,zz-.028],[s*.337,zz-.028],[s*.337,-1.1865+Math.sign(dz)*.062],[s*.268,-1.1865+Math.sign(dz)*.062]],[],.262,.004,'dark');
   for(const offset of [-.034,.034]){const sh=new T.Shape();sh.moveTo(s*.269,.196);sh.lineTo(s*.337,.196);sh.lineTo(s*.337,.266);sh.lineTo(s*.269,.266);sh.closePath();const hole=new T.Path();hole.absarc(s*.30,.224,.0065,0,Math.PI*2,true);sh.holes.push(hole);const g=new T.ExtrudeGeometry(sh,{depth:.003,bevelEnabled:true,bevelSize:.001,bevelThickness:.0007,bevelSegments:2});h.add('su-crossmember-frame',g,'dark',[0,0,zz+offset]);}
  }
  // Front coil towers join the crossmember and support the upper-arm axis.
  lathe('su-crossmember-frame',[[0,.045],[.06,.054],[.16,.079],[.165,.075],[.06,.049],[0,.040],[0,.045]],[s*.49,.349,-1.1865],'dark');
  for(const zz of [-1.304,-1.068])box('su-crossmember-frame',[.006,.072,.060],[s*.358,.410,zz],'dark',[],{},.002);
  for(const zz of [-1.37,-.94]){fastener('su-crossmember-upper-bolts',[s*.39,.364,zz],.049,.005,[0,1,0]);sleeve('su-crossmember-washers',.019,.0055,.003,[s*.39,.359,zz],'zinc');}
  tube('su-crossmember-braces',[[s*.20,.274,-1.36],[s*.32,.29,-1.13],[s*.48,.33,-.91]],.021,'dark');fastener('su-crossmember-lower-bolts',[s*.20,.300,-1.36],.05,.006,[0,1,0]);
  for(const dx of [-.026,.026])box('su-crossmember-shock-brackets',[.005,.068,.063],[s*.556+dx,.54,-1.0745],'dark',[],{},.003);
 }
 for(const z of [.79,1.52]){
  const top=z<1?.26:.32;
  flat('su-cradle-frame',[[-.51,z-.034],[.51,z-.034],[.51,z+.034],[-.51,z+.034]],[],top,.003);
  for(const dz of [-.034,.034]){
   const sh=new T.Shape();sh.moveTo(-.51,top);sh.lineTo(.51,top);sh.lineTo(.51,top-.075);sh.lineTo(-.51,top-.075);sh.closePath();
   for(let i=0;i<5;i++){const x=-.36+i*.18,pts=roundedLoop([[x-.044,top-.058],[x,top-.014],[x+.044,top-.058]],.009),hole=new T.Path();pts.forEach(([x,y],j)=>j?hole.lineTo(x,y):hole.moveTo(x,y));hole.closePath();sh.holes.push(hole);}
   const g=new T.ExtrudeGeometry(sh,{depth:.003,bevelEnabled:true,bevelSize:.001,bevelThickness:.0005,bevelSegments:2});h.add('su-cradle-frame',g,'dark',[0,0,z+dz]);
  }
 }
 surface('su-crossmember-frame',48,4,(u,v)=>{const x=(u-.5)*1.04,y=.246+.060*Math.pow(Math.abs(x)/.52,2);return[x,y,-1.1865+(v-.5)*.146];},'dark');for(const z of [-1.260,-1.113])surface('su-crossmember-frame',48,3,(u,v)=>{const x=(u-.5)*1.04;return[x,.246+.060*Math.pow(Math.abs(x)/.52,2)-v*.067,z];},'dark');
}
