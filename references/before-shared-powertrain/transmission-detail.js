import {m17Nominal} from './factory-specifications.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {transmissionParts,transmissionSections} from './transmission-catalog.js';
// Legacy builder +X runs from the engine toward the outboard end.
// vehicle-frame.js converts it to physical -X / driver side at the boundary.
// 76 mm shaft spacing is the factory family designation. Remaining local
// dimensions, tooth profiles and casting contours are visual reconstructions.
export const transaxleDatum={input:[.59,0],output:[.514,0],differential:[.424,.064],vehicleOffset:[.16,-.12,1.1225]};
export function transmissionMaterials(base=createMaterials()){
 const mats={...base};for(const k of ['castAluminum','rotor','iron','rubber'])mats[k]=base[k].clone();
 mats.castAluminum.roughness=.57;mats.castAluminum.metalness=.72;
 mats.rotor.bumpScale=.000025;mats.iron.bumpScale=.00006;mats.rubber.bumpScale=.00005;
 return mats;
}
export function createTransmissionDetail(){
 const root=new T.Group(),groups=new Map(),mats=transmissionMaterials();
 for(const p of transmissionParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'drivetrain',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(transmissionSections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}
 const h=geometryTools(groups,mats);buildTransmission(h);h.optimize();correctLegacyHandedness(groups);return {root,groups};
}
export function buildTransmission(h){
 const {add,box,cyl,tube,surface,ring,bolt}=h,{annulus,plate,gear,bearing,spline,spring,arc}=mechanicalTools(h),id=s=>'tx-'+s;
 const [iy,iz]=transaxleDatum.input,[oy,oz]=transaxleDatum.output,[dy,dz]=transaxleDatum.differential;
 const I=x=>[x,iy,iz],O=x=>[x,oy,oz],D=x=>[x,dy,dz];
 // Lobed perimeter follows the clutch, shaft train and differential volumes.
 const centre=[.519,.022];
 function outline(circles,n=128){return Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2,uy=Math.cos(a),uz=Math.sin(a);let r=0;for(const [y,z,rad] of circles){const py=y-centre[0],pz=z-centre[1],dot=py*uy+pz*uz,disc=rad*rad-py*py-pz*pz+dot*dot;if(disc>=0)r=Math.max(r,dot+Math.sqrt(disc));}return [centre[0]+uy*r,centre[1]+uz*r];});}
 const mouth=outline([[iy,iz,.174],[dy,dz,.115]]),seam=outline([[iy,iz,.084],[oy,oz,.09],[dy,dz,.115]]),end=outline([[iy,iz,.066],[oy,oz,.077]]);
 const blend=(a,b,t)=>a.map((p,i)=>p.map((v,j)=>v+(b[i][j]-v)*t));
 function shell(key,sections){
  for(const inner of [false,true])surface(id(key),128,sections.length*8,(u,v)=>{const si=Math.min(sections.length-2,Math.floor(v*(sections.length-1))),t=v*(sections.length-1)-si,ss=sections[si],ee=sections[si+1],j=Math.floor(u*128)%128,j2=(j+1)%128,f=u*128-Math.floor(u*128);const pt=[0,1].map(k=>(ss[1][j][k]*(1-f)+ss[1][j2][k]*f)*(1-t)+(ee[1][j][k]*(1-f)+ee[1][j2][k]*f)*t);if(inner){const l=Math.hypot(pt[0]-centre[0],pt[1]-centre[1]);pt[0]-=(pt[0]-centre[0])/l*.0045;pt[1]-=(pt[1]-centre[1])/l*.0045;}return[ss[0]+(ee[0]-ss[0])*t,...pt];},'castAluminum');
  for(const [x,shape] of [sections[0],sections.at(-1)])surface(id(key),128,1,(u,v)=>{const j=Math.floor(u*128)%128,j2=(j+1)%128,f=u*128-Math.floor(u*128);const pt=shape[j].map((q,k)=>q*(1-f)+shape[j2][k]*f),l=Math.hypot(pt[0]-centre[0],pt[1]-centre[1]);return[x,pt[0]-(pt[0]-centre[0])/l*.0045*v,pt[1]-(pt[1]-centre[1])/l*.0045*v];},'rotor');
 }
 shell('bellhousing',[[0,mouth],[.035,mouth],[.115,seam]]);
 // Machined inner web with open input/output/differential bearing seats.
 plate(id('bellhousing'),seam,[[iy,iz,.020],[oy,oz,.025],[dy,dz,.038]],.008,.113);
 shell('case',[[.12,seam],[.17,blend(seam,end,.65)],[.34,end],[.395,blend(end,end,0)]]);
 plate(id('case'),end,[[iy,iz,.012],[oy,oz,.012]],.008,.395);
 for(const [key,x,shape] of [['bellhousing',.006,mouth],['case',.12,seam]]){
  tube(id(key),[...shape,shape[0]].map(([y,z])=>[x,y,z]),.005,'castAluminum');
  for(let i=0;i<12;i++){const [y,z]=shape[Math.floor(i*shape.length/12)];annulus(id(key),.009,.0035,.011,[x,y,z],'castAluminum');if(key==='case')bolt(id('case-bolts'),[x+.012,y,z],.005,'x','zinc');}
 }
 for(let i=0;i<12;i++){const j=Math.floor(i*128/12),a=seam[j],b=end[j];tube(id('case'),[[.13,...a],[.18,a[0]*.35+b[0]*.65,a[1]*.35+b[1]*.65],[.37,...b]],.003,'castAluminum');}
 for(const x of [.20,.275,.35])tube(id('case'),[...end,end[0]].map(([y,z])=>[x,y+.001,z]),.002,'castAluminum');
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2;tube(id('bellhousing'),[[.102,iy+Math.cos(a)*.04,Math.sin(a)*.04],[.045,iy+Math.cos(a)*.13,Math.sin(a)*.13],[.015,iy+Math.cos(a)*.163,Math.sin(a)*.163]],.003,'castAluminum');}
 cyl(id('vent'),.006,.025,[.25,.668,.012],'plastic',[0,0,0]);cyl(id('vent'),.008,.005,[.25,.682,.012],'plastic',[0,0,0]);
 box(id('magnet'),[.020,.005,.016],[.20,.423,.012],'dark');
 for(const [y,z] of [[.646,-.065],[.405,.15]])cyl(id('dowels'),.0035,.023,[.118,y,z],'rotor');
 for(const [key,y,z,axis] of [['drain',.371,.065,'y'],['fill',.49,.16,'z'],['case-plug',.53,-.077,'z']])bolt(id(key),[.153,y,z],.009,axis,'zinc');
 annulus(id('drain-washer'),.011,.007,.001,[.153,.378,.065],'zinc',[0,0,Math.PI/2]);annulus(id('fill-washer'),.012,.009,.001,[.153,.49,.153],'pickupPlastic',[0,Math.PI/2,0]);
 for(const x of [.03,.205])annulus(id('axle-seals'),.029,.019,.009,D(x),'rubber');
 annulus(id('input-seal'),.018,.011,.005,I(.074),'rubber');annulus(id('input-retainer'),.023,.012,.014,I(.089),'castAluminum');annulus(id('input-retainer'),.016,.011,.053,I(.055),'rotor');annulus(id('retainer-seal'),.024,.021,.0018,I(.100),'rubber');
 for(let i=0;i<4;i++){const a=i*Math.PI/2;bolt(id('retainer-screws'),[.078,iy+Math.cos(a)*.025,Math.sin(a)*.025],.004,'x');}
 cyl(id('speed-sensor'),.016,.033,[.148,.492,.142],'castAluminum',[0,0,0]);box(id('speed-sensor'),[.019,.019,.012],[.148,.516,.142],'plastic');annulus(id('speed-seal'),.016,.014,.002,[.148,.476,.142],'rubber',[0,0,Math.PI/2]);for(const m of gear(id('speed-gear'),.012,.013,22,[0,0,0],.32,'pickupPlastic',.003)){m.geometry.rotateZ(Math.PI/2);m.geometry.translate(.148,.452,.142);}cyl(id('speed-gear'),.004,.04,[.148,.474,.142],'rotor',[0,0,0]);box(id('speed-retainer'),[.043,.003,.013],[.16,.480,.142],'zinc');bolt(id('speed-retainer'),[.183,.485,.142],.004);
 // The shaft order follows section 7B1-4, with 1/2 on the output and 3/4 on input.
 cyl(id('input-shaft'),.010,.39,I(.195),'rotor');spline(id('input-shaft'),.012,.051,14,I(.025));
 for(const [x,r,n] of [[.17,.019,18],[.26,.027,24]])gear(id('input-shaft'),r,.024,n,I(x),.22);
 cyl(id('output-shaft'),.012,.30,O(.247),'rotor');spline(id('output-shaft'),.015,.18,20,O(.24));gear(id('output-shaft'),.025,.026,m17Nominal.finalPinionTeeth,O(.115),-.2);
 for(const [key,x,r,n,axis,helix] of [['first-output',.17,.060,56,O,-.22],['second-output',.26,.052,48,O,-.22],['third-output',.304,.0435,38,O,-.22],['fourth-output',.365,.0355,32,O,-.22],['third-input',.304,.0345,30,I,.22],['fourth-input',.365,.043,38,I,.22]]){gear(id(key),r,.021,n,axis(x),helix);annulus(id(key),r*.74,.013,.023,axis(x));}
 for(const [key,x,axis] of [['sync34',.336,I],['sync12',.216,O]]){spline(id(key),.026,.025,36,axis(x));annulus(id(key),.030,.024,.024,axis(x));for(const s of [-1,1])annulus(id(key),.033,.026,.005,axis(x+s*.010));}
 for(const [key,x,axis] of [['block3',.318,I],['block4',.351,I],['block1',.195,O],['block2',.240,O]]){gear(id(key),.029,.004,36,axis(x),0,'gold',.022);annulus(id(key),.025,.022,.008,axis(x),'gold');}
 for(const [tag,x,axis] of [['34',.336,I],['12',.216,O]]){
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2,p=axis(x);box(id('keys'+tag),[.018,.004,.004],[p[0],p[1]+Math.cos(a)*.023,p[2]+Math.sin(a)*.023],'rotor',[a,0,0],{},.001);}
  for(const s of [-1,1])ring(id('springs'+tag),.020,.00065,axis(x+s*.007),'dark');annulus(id('retainer'+tag),.016,.013,.001,axis(x+.015),'dark');
 }
 annulus(id('third-retainer'),.016,.013,.001,O(.321),'dark');
 for(const [key,x,r,axis] of [['input-bearing',.108,.024,I],['input-end-bearing',.388,.022,I],['output-bearing',.11,.029,O],['output-end-bearing',.388,.026,O]])bearing(id(key),r,.011,.014,axis(x));
 for(const [key,x,r,axis] of [['input-shim',.097,.025,I],['input-shield',.399,.023,I],['input-sleeve',.402,.014,I],['output-shim',.098,.030,O],['output-shield',.094,.031,O],['output-retainer',.091,.032,O],['output-end-shield',.400,.027,O],['output-sleeve',.403,.016,O]])annulus(id(key),r,.012,.0017,axis(x),'zinc');
 const R=x=>[x,.648,.058];cyl(id('reverse-shaft'),.006,.15,R(.234),'rotor');gear(id('reverse-gear'),.026,.027,28,R(.21),0);annulus(id('reverse-spacer'),.011,.006,.027,R(.25));bolt(id('reverse-bolt'),R(.145),.004,'x');
 // Open differential carrier: windows reveal bevel pinions and side gears.
 for(const x of [.065,.17])annulus(id('diff-carrier'),.049,.019,.014,D(x),'iron');
 for(const s of [-1,1])surface(id('diff-carrier'),36,12,(u,v)=>{const a=s>0?u*.9-.45:u*.9+Math.PI-.45;const r=.043+.008*Math.sin(v*Math.PI);return [.068+v*.10,dy+Math.cos(a)*r,dz+Math.sin(a)*r];},'iron');
 gear(id('ring-gear'),.090,.023,m17Nominal.finalRingTeeth,D(.104),.18,'rotor',.040);annulus(id('ring-gear'),.075,.040,.009,D(.123),'iron');
 for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt(id('ring-bolts'),[.132,dy+Math.cos(a)*.057,dz+Math.sin(a)*.057],.005,'x');}
 for(const x of [.05,.19])bearing(id('diff-bearings'),.031,.019,.014,D(x));annulus(id('diff-shim'),.032,.020,.0015,D(.201),'zinc');gear(id('speed-drive'),.036,.009,38,D(.036),.10,'pickupPlastic',.02);
 cyl(id('diff-pin'),.005,.086,D(.12),'rotor',[0,0,0]);bolt(id('diff-pin-screw'),[.12,dy+.052,dz],.003);annulus(id('diff-pin-washer'),.0045,.002,.001,[.12,dy+.048,dz],'zinc',[0,0,Math.PI/2]);
 for(const s of [-1,1]){
  const p=D(.12+s*.026);gear(id('side-gears'),.025,.012,16,p,0,'rotor',.012);annulus(id('side-washers'),.027,.013,.0015,D(.12+s*.034),'gold');
  // Bevel pinion tapers; radial tooth pads are tilted with the gear axis.
  const p2=[.12,dy+s*.022,dz];cyl(id('spider-gears'),.014,.016,p2,'rotor',[0,0,0],.023);for(let j=0;j<12;j++){const a=j*Math.PI/6;box(id('spider-gears'),[.005,.012,.008],[.12+Math.cos(a)*.017,dy+s*.022,dz+Math.sin(a)*.017],'rotor',[0,-a,.18],{},.001);}
  annulus(id('spider-washers'),.024,.006,.0015,[.12,dy+s*.034,dz],'gold',[0,0,Math.PI/2]);
 }
 // Two individual forks, shared rail and external detent mechanism.
 for(const [key,x,y] of [['fork34',.336,iy],['fork12',.216,oy]]){arc(id(key),.034,.005,[x,y,0],-.5,Math.PI+.5);tube(id(key),[[x,y+.026,.018],[x,.666,.025],[x,.681,.008]],.004,'castAluminum');annulus(id(key),.008,.004,.009,[x,.681,.008],'castAluminum');}
 cyl(id('fork-rail'),.004,.22,[.275,.681,.008],'rotor');cyl(id('shift-shaft'),.006,.17,[.25,.712,.008],'rotor');annulus(id('shift-seal'),.010,.006,.006,[.31,.712,.008],'rubber');
 box(id('detent-lever'),[.035,.009,.023],[.23,.700,.007],'iron');spring(id('detent-spring'),[.23,.716,.007],.006,.022,'y',5,.001);bolt(id('detent-bolt'),[.23,.734,.007],.005);
 box(id('interlock'),[.025,.019,.021],[.252,.688,.01],'iron');annulus(id('shift-shim'),.009,.006,.0015,[.29,.712,.008]);tube(id('reverse-lever'),[[.23,.707,-.020],[.23,.675,-.030],[.21,.65,.045]],.004,'iron');cyl(id('reverse-stud'),.005,.032,[.23,.687,-.02],'rotor',[0,0,0]);spring(id('inhibitor'),[.27,.707,-.027],.007,.020,'x',6);for(const x of [.257,.283])annulus(id('inhibitor'),.009,.004,.002,[x,.707,-.027]);for(const x of [.22,.27])cyl(id('roll-pins'),.0017,.021,[x,.696,.017],'dark',[0,0,0]);bolt(id('rail-screw'),[.390,.681,.008],.003,'x');box(id('oil-guide'),[.031,.002,.050],[.36,.653,.035],'plastic',[.2,0,0],{},.001);
 // Clutch has two friction faces, spring hub and slotted diaphragm cover.
 annulus(id('flywheel'),.145,.018,.020,I(-.018),'iron');annulus(id('flywheel'),.125,.019,.003,I(-.006),'rotor');gear(id('flywheel'),.149,.010,142,I(-.025),0,'rotor',.132);
 annulus(id('disc'),m17Nominal.clutchFacingOuter/2,m17Nominal.clutchFacingInner/2,.004,I(.008),'dark');spline(id('disc'),.017,.030,14,I(.008));annulus(id('disc'),.061,.017,.002,I(.008),'zinc');
 for(const s of [-1,1])for(let i=0;i<16;i++){const a=i/16*Math.PI*2;arc(id('disc'),(m17Nominal.clutchFacingOuter+m17Nominal.clutchFacingInner)/4,.0018,I(.008+s*.003),a+.022,a+Math.PI/8-.022,'rubber',(m17Nominal.clutchFacingOuter-m17Nominal.clutchFacingInner)/4-.001);for(const r of [.081,.10])cyl(id('disc'),.0018,.0008,[.008+s*.004,iy+Math.cos(a+.10)*r,Math.sin(a+.10)*r],'copper');}
 for(let i=0;i<6;i++){const a=i*Math.PI/3;spring(id('disc'),[.008,iy+Math.cos(a)*.044,Math.sin(a)*.044],.005,.021,[0,-Math.sin(a),Math.cos(a)],5,.0013);}
 annulus(id('pressure'),m17Nominal.clutchFacingOuter/2,.076,.015,I(.026),'iron');annulus(id('pressure'),.121,.094,.011,I(.040),'zinc');
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2;surface(id('pressure'),3,8,(u,v)=>{const r=.027+v*.066,ang=a+(u-.5)*.22;return[.059-v*.017,iy+Math.cos(ang)*r,Math.sin(ang)*r];},'dark');}
 for(let i=0;i<6;i++){const a=i*Math.PI/3;surface(id('pressure'),8,12,(u,v)=>{const ang=a+(u-.5)*.25,r=.113;return[.016+v*.024,iy+Math.cos(ang)*r,Math.sin(ang)*r];},'zinc');bolt(id('cover-bolts'),[.025,iy+Math.cos(a)*.119,Math.sin(a)*.119],.005,'x');bolt(id('flywheel-bolts'),[-.003,iy+Math.cos(a)*.028,Math.sin(a)*.028],.005,'x');}
 bearing(id('release-bearing'),.034,.017,.019,I(.077));annulus(id('release-bearing'),.027,.017,.022,I(.074),'dark');
 arc(id('release-fork'),.035,.007,I(.082),-.6,Math.PI+.6,'iron');cyl(id('release-fork'),.007,.19,[.083,.66,-.015],'rotor',[0,0,0]);for(const y of [.575,.742])annulus(id('fork-bearings'),.011,.007,.012,[.083,y,-.015],'gold',[0,0,Math.PI/2]);annulus(id('fork-seal'),.012,.007,.005,[.083,.755,-.015],'rubber',[0,0,Math.PI/2]);
}
