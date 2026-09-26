import {l44Nominal,cylinderNumber} from './factory-specifications.js';
import * as T from 'three';
import {camFollowers,pushrodGuidePoint,timingLayout} from './engine-timing.js';
import {bankOffset} from './engine-layout.js';
const gm='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=17';
export const valveHardwareParts=[];
function part(id,section,name,description,spread,callout){valveHardwareParts.push({id:`eng-${id}`,section,system:'engine',name,description,spread,callout,location:section.includes('front')?'Cabin-side cylinder head':'Trunk-side cylinder head',source:'GM 22P · H-22',sourceUrl:gm,aliases:'valve gear cylinder head rebuild '+id.replaceAll('-',' '),referenceNote:'GM H-23 distinguishes the exhaust stem shield from the retained intake stem seal. Local profiles, installed heights and fastener dimensions are reconstructed; no clearance or torque specification is implied.'});}
for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++){
 const section=`head-${bank}`,label=`${s<0?'Cabin':'Trunk'}-side cylinder ${cylinderNumber(bank,c)}`,dx=(c-2)*.075;
 part(`pushrod-guide-${bank}-${c}`,section,`${label} pushrod guide plate`,'Formed paired guide plate with stud openings and two open pushrod slots. Cylinder identity follows the Pontiac bank layout; this guide-plate shape remains reconstructed.',[dx,.085,-s*.12],65);
 for(const type of ['intake','exhaust']){
  const tag=`${bank}-${c}-${type}`,name=`${label} ${type}`,valveSection=`valve-${tag}`;
  part(`spring-retainer-${tag}`,valveSection,`${name} spring retainer`,'Separate stepped steel spring cap with a tapered keeper bore.',[dx,.225,s*.17],43);
  part(`valve-keepers-${tag}`,valveSection,`${name} split keeper pair`,'Two tapered half-cone keys at the valve-stem groove, grouped as a pair.',[dx,.275,s*.17],42);
  part(`stem-o-ring-${tag}`,valveSection,`${name} valve-stem oil seal`,'Small separate annular stem seal beneath the retainer.',[dx+.035,.185,s*.17],45);
  if(type==='exhaust')part(`stem-shield-${tag}`,valveSection,`${name} stem-oil shield`,'Thin steel umbrella shield surrounding the upper exhaust spring and valve stem.',[dx-.035,.20,s*.17],44);
  else part(`stem-seal-${tag}`,valveSection,`${name} retained stem seal`,'Separate intake valve-stem seal with a retaining band at the guide boss.',[dx-.035,.12,s*.17],47);
  part(`rocker-stud-${tag}`,valveSection,`${name} rocker stud`,'Threaded rocker support stud through the guide plate, with a hex shoulder.',[dx,.11,-s*.10],66);
  part(`rocker-nut-${tag}`,valveSection,`${name} rocker adjusting nut`,'Separate self-locking-style hex nut with an open bore. Adjustment is not specified by the animation.',[dx,.37,s*.17],68);
 }
}

export function buildValveHardware(h,bank,s,at){
 const rot=[s*Math.PI/6,0,0],id=k=>`eng-${k}`;
 const lathe=(key,points,pos,mat='rotor')=>h.add(id(key),new T.LatheGeometry(points.map(p=>new T.Vector2(...p)),48),mat,at(...pos),rot);
 const extrude=(key,shape,depth,pos,mat='zinc')=>{
  const geo=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.00025,bevelThickness:.00025,bevelSegments:2,curveSegments:24});geo.rotateX(Math.PI/2);geo.translate(0,depth/2,0);return h.add(id(key),geo,mat,at(...pos),rot);
 };
 const hole=(shape,x,z,r)=>{const path=new T.Path();path.absarc(x,z,r,0,Math.PI*2,true);shape.holes.push(path);};
 for(let c=1;c<=3;c++){
  const cx=(c-2)*l44Nominal.borePitch,pivotZ=-s*.007;
  // One stamped guide locates both pushrods for this cylinder position.
  // Its two slots remain open so the plate is not a solid block around rods.
  // Cut the two open forks around the actual sloping pushrod paths. Keeping
  // the former fixed slots after relocating the cam trapped rods in metal.
  const slots=camFollowers.filter(f=>f.bank===bank&&f.c===c).map(f=>{
   const p=pushrodGuidePoint(f);return {x:p.x-bankOffset(s)-cx,z:((p.y-timingLayout.crankY)*(-s*.5)+p.z*Math.cos(Math.PI/6))*s};
  }).sort((a,b)=>a.x-b.x);
  const shape=new T.Shape(),points=[[-.046,-.064]];
  for(const p of slots)points.push([p.x-.0055,-.064],[p.x-.0055,p.z+.006],[p.x+.0055,p.z+.006],[p.x+.0055,-.064]);
  points.push([.046,-.064],[.046,.008],[-.046,.008]);
  points.forEach(([x,z],i)=>i?shape.lineTo(x,z*s):shape.moveTo(x,z*s));shape.closePath();for(const x of [-.025,.025])hole(shape,x,pivotZ,.0045);
  extrude(`pushrod-guide-${bank}-${c}`,shape,.002,[cx,.351,0]);
  for(const [type,dx] of [['intake',-.025],['exhaust',.025]]){
   const tag=`${bank}-${c}-${type}`,x=cx+dx,z=s*.017;
   lathe(`spring-retainer-${tag}`,[[.0038,-.003],[.009,-.003],[.013,-.001],[.013,.001],[.009,.003],[.0043,.003],[.0038,-.003]],[x,.390,z]);
   // Split collets have a real stem bore and a gap between the two keys.
   for(const phase of [0,Math.PI]){
    const geo=new T.LatheGeometry([[.0034,-.003],[.0038,-.003],[.0045,.003],[.0034,.003],[.0034,-.003]].map(p=>new T.Vector2(...p)),24,phase+.055,Math.PI-.11);
    h.add(id(`valve-keepers-${tag}`),geo,'rotor',at(x,.391,z),rot);
   }
   h.ring(id(`stem-o-ring-${tag}`),.0036,.0006,at(x,.385,z),'silicone',[Math.PI/2+s*Math.PI/6,0,0]);
   if(type==='exhaust')lathe(`stem-shield-${tag}`,[[.0037,.001],[.011,.001],[.014,-.002],[.014,-.010],[.0135,-.010],[.0135,-.003],[.0105,.0004],[.0037,.0004],[.0037,.001]],[x,.387,z],'zinc');
   else{
    lathe(`stem-seal-${tag}`,[[.0034,-.006],[.007,-.006],[.007,.001],[.0055,.004],[.0034,.004],[.0034,-.006]],[x,.348,z],'silicone');
    lathe(`stem-seal-${tag}`,[[.0065,-.005],[.0075,-.005],[.0075,0],[.0065,0],[.0065,-.005]],[x,.348,z],'zinc');
    h.ring(id(`stem-seal-${tag}`),.0046,.00045,at(x,.351,z),'zinc',[Math.PI/2+s*Math.PI/6,0,0]);
   }
   // Shoulder and two threaded portions of the rocker support stud.
   h.cyl(id(`rocker-stud-${tag}`),.0037,.078,at(x,.387,pivotZ),'rotor',rot);
   h.add(id(`rocker-stud-${tag}`),new T.CylinderGeometry(.0062,.0062,.006,6),'zinc',at(x,.358,pivotZ),rot);
   for(const [lo,hi] of [[.349,.355],[.398,.427]]){
    const points=[],turns=(hi-lo)/.0017;for(let i=0;i<=Math.ceil(turns*20);i++){const t=i/Math.ceil(turns*20),a=t*turns*Math.PI*2;points.push(at(x+Math.cos(a)*.0039,lo+(hi-lo)*t,pivotZ+Math.sin(a)*.0039));}h.tube(id(`rocker-stud-${tag}`),points,.00028,'rotor');
   }
   const nut=new T.Shape();for(let i=0;i<6;i++){const a=i*Math.PI/3;i?nut.lineTo(Math.cos(a)*.0065,Math.sin(a)*.0065):nut.moveTo(Math.cos(a)*.0065,Math.sin(a)*.0065);}nut.closePath();hole(nut,0,0,.0039);extrude(`rocker-nut-${tag}`,nut,.007,[x,.414,pivotZ]);
   // Hollow stamped rocker: shaped bottom, open stud slot and raised side
   // flanges. The spherical fulcrum remains grouped with the service arm.
   // Smooth, constant-thickness drawn channel. Sampling the curved bed
   // directly avoids bending a few large triangles across the stud opening.
   const halfWidth=z=>.0065+.003*Math.cos(z/.029*Math.PI/2);
   const bed=(x,z)=>.400+.003*(z/.029)**2+.007*(Math.abs(x)/halfWidth(z))**5;
   const slotWidth=z=>Math.abs(z)<.008?.0045*Math.sqrt(1-(z/.008)**2):0;
   for(const side of [-1,1])for(const bottom of [false,true])h.surface(id(`rocker-${tag}`),80,14,(u,v)=>{
    const rz=-.029+u*.058,inner=slotWidth(rz),rx=side*(inner+(halfWidth(rz)-inner)*v);
    return at(x+rx,bed(rx,rz)-(bottom?.0017:0),pivotZ+rz);
   },'zinc');
   for(const side of [-1,1])h.surface(id(`rocker-${tag}`),80,2,(u,v)=>{
    const rz=-.029+u*.058,rx=side*halfWidth(rz);return at(x+rx,bed(rx,rz)-v*.0017,pivotZ+rz);
   },'zinc');
   for(const rz of [-.029,.029])h.surface(id(`rocker-${tag}`),24,2,(u,v)=>{
    const rx=(u*2-1)*halfWidth(rz);return at(x+rx,bed(rx,rz)-v*.0017,pivotZ+rz);
   },'zinc');
   h.surface(id(`rocker-${tag}`),64,2,(u,v)=>{
    const a=u*Math.PI*2,rx=.0045*Math.sin(a),rz=.008*Math.cos(a);return at(x+rx,bed(rx,rz)-v*.0017,pivotZ+rz);
   },'zinc');
   // Machined contact pads are small curved faces, not roller rockers.
   lathe(`rocker-${tag}`,[[0,-.003],[.004,-.003],[.005,-.001],[.005,.001],[0,.001]],[x,.401,pivotZ+s*.024],'rotor');
   lathe(`rocker-${tag}`,[[.0025,0],[.0045,0],[.005,.003],[.0038,.006],[0,.007],[0,.005],[.0025,.003],[.0025,0]],[x,.404,pivotZ-s*.030],'rotor');
   lathe(`rocker-${tag}`,[[.004,-.004],[.006,-.003],[.007,0],[.006,.004],[.004,.005],[.004,-.004]],[x,.405,pivotZ],'rotor');
  }
 }
}
