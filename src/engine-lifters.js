import * as T from 'three';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
import {camFollowers} from './engine-timing.js';
import {cylinderNumber} from './factory-specifications.js';

export const lifterSource='https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=292';
export const lifterReferenceNote='GM adjacent-year 1986 General Engine Mechanical, figure 46, identifies the flat-tappet construction. Dimensions, oil-port size, spring rates, preload and leak-down calibration are reconstructed or unverified. Internal selections explain construction; they do not imply parts interchange between lifters.';
export const lifterSections=[],lifterInternalParts=[];
const rows=[
 ['plunger-spring','plunger spring',2,.035,'Separate compression spring below the plunger, surrounding the check-valve cage.'],
 ['check-retainer','ball-check retainer',3,.060,'Open three-leg retainer and spring seat beneath the plunger.'],
 ['check-spring','ball-check spring',4,.085,'Small spring beneath the check ball, separate from the main plunger spring.'],
 ['check-ball','check ball',5,.110,'Separate spherical valve on the plunger inlet seat.'],
 ['plunger','plunger',6,.145,'Hollow plunger with an annular oil groove, open radial feed and lower check-valve passage.'],
 ['metering-valve','oil-metering valve',7,.170,'Thin separate metering disc beneath the pushrod seat, with an open central passage.'],
 ['pushrod-seat','pushrod seat',8,.195,'Separate concave pushrod seat with an oil passage through its base.'],
 ['retainer-ring','retainer ring',9,.220,'Split wire retaining ring in the lifter-body groove.'],
];
for(const f of camFollowers){
 const tag=`${f.bank}-${f.c}-${f.type}`,section=`lifter-${tag}`,cylinder=cylinderNumber(f.bank,f.c),label=`${f.s<0?'Cabin':'Trunk'}-side cylinder ${cylinder} ${f.type} lifter`,base=[(f.c-2)*.075,-.09,-f.s*.15];
 lifterSections.push({id:section,parent:`valve-${tag}`,name:`Cylinder ${cylinder} ${f.type} hydraulic lifter`,spread:[0,.30,f.s*.42]});
 for(const [key,name,callout,offset,description] of rows)lifterInternalParts.push({id:`eng-lifter-${key}-${tag}`,section,system:'engine',name:`${label} ${name}`,description,spread:base.map((v,i)=>v+f.axis.getComponent(i)*offset),cylinder,callout,source:'GM 1986 · 6A-20 figure 46',sourceUrl:lifterSource,referenceNote:lifterReferenceNote,location:`L44 cylinder ${cylinder} ${f.type} flat tappet`,aliases:`hydraulic tappet lifter rebuild ${key.replaceAll('-',' ')}`});
}

// A cylindrical wall with one true radial opening. The circular boundary is
// constructed explicitly: there is no dark disc painted over a solid wall.
export function portedSleeve(h,id,{inner,outer,low,high,portY,portRadius,at,material='rotor'}){
 for(const r of [outer,inner]){
  const alpha=Math.asin(portRadius/r);
  h.surface(id,96,1,(u,v)=>{const a=alpha+(2*Math.PI-2*alpha)*u;return at(r*Math.cos(a),low+(high-low)*v,r*Math.sin(a));},material);
  for(const top of [false,true])h.surface(id,48,1,(u,v)=>{
   const a=u*Math.PI,z=-portRadius*Math.cos(a),edge=portY+(top?1:-1)*portRadius*Math.sin(a),y=edge+((top?high:low)-edge)*v;
   return at(Math.sqrt(r*r-z*z),y,z);
  },material);
 }
 h.surface(id,96,1,(u,v)=>{const a=u*2*Math.PI,z=portRadius*Math.cos(a),y=portY+portRadius*Math.sin(a),r=inner+(outer-inner)*v;return at(Math.sqrt(r*r-z*z),y,z);},material);
}

export function buildHydraulicLifter(h,f){
 const tag=`${f.bank}-${f.c}-${f.type}`,body=`eng-lifter-${tag}`,id=k=>`eng-lifter-${k}-${tag}`,rot=[f.s*Math.PI/6,0,0];
 const rotation=new T.Euler(...rot),at=(x,y,z)=>new T.Vector3(x,y,z).applyEuler(rotation).add(f.centre).toArray();
 const lathe=(key,profile,material='rotor')=>{const raw=new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),96);raw.scale(1000,1000,1000);const g=toCreasedNormals(raw,Math.PI/4);g.scale(.001,.001,.001);raw.dispose();return h.add(key,g,material,f.centre.toArray(),rot);};
 const spring=(key,r,wire,low,high,turns)=>{const points=[];for(let i=0;i<=turns*32;i++){const t=i/(turns*32),a=t*turns*2*Math.PI;points.push(at(r*Math.cos(a),low+(high-low)*t,r*Math.sin(a)));}h.tube(key,points,wire,'dark');};
 // Closed foot, open bore, annular feed groove and retaining-ring groove.
 lathe(body,[[0,-.0175],[.0095,-.0175],[.010,-.016],[.010,-.002],[.0091,-.001],[.0073,-.001],[.0073,-.0143],[0,-.0143],[0,-.0175]]);
 lathe(body,[[.0073,.003],[.0091,.003],[.010,.004],[.010,.015],[.0095,.0175],[.0073,.0175],[.0073,.0156],[.0077,.0156],[.0077,.0145],[.0073,.0145],[.0073,.003]]);
 portedSleeve(h,body,{inner:.0073,outer:.0091,low:-.001,high:.003,portY:.001,portRadius:.001,at});
 // Main spring surrounds the smaller check-valve mechanism.
 spring(id('plunger-spring'),.0048,.0005,-.0138,-.007,5);
 lathe(id('check-retainer'),[[.001,-.0112],[.0027,-.0112],[.0027,-.0107],[.001,-.0107],[.001,-.0112]],'zinc');
 lathe(id('check-retainer'),[[.0029,-.0069],[.0037,-.0069],[.0037,-.0065],[.0029,-.0065],[.0029,-.0069]],'zinc');
 for(let i=0;i<3;i++){const a=i*2*Math.PI/3;h.tube(id('check-retainer'),[at(.0025*Math.cos(a),-.01095,.0025*Math.sin(a)),at(.0034*Math.cos(a),-.009,.0034*Math.sin(a)),at(.0034*Math.cos(a),-.0067,.0034*Math.sin(a))],.0003,'zinc');}
 spring(id('check-spring'),.00075,.00016,-.0105,-.00876,4);
 h.add(id('check-ball'),new T.SphereGeometry(.0012,32,24),'rotor',at(0,-.0073944,0));
 // Hollow plunger, with a small lower passage closed by the separate ball.
 lathe(id('plunger'),[[.0008,-.0065],[.0071,-.0065],[.0071,-.001],[.0067,-.001],[.0052,-.001],[.0052,-.0045],[.0008,-.0045],[.0008,-.0065]]);
 lathe(id('plunger'),[[.0052,.003],[.0067,.003],[.0071,.0038],[.0071,.0065],[.0052,.0065],[.0052,.003]]);
 portedSleeve(h,id('plunger'),{inner:.0052,outer:.0067,low:-.001,high:.003,portY:.001,portRadius:.001,at});
 lathe(id('metering-valve'),[[.0007,.0065],[.0066,.0065],[.0066,.0068],[.0007,.0068],[.0007,.0065]],'zinc');
 const bowl=[];for(let i=0;i<=32;i++){const r=.00075+(.0036-.00075)*i/32;bowl.push([r,.011-Math.sqrt(.0036**2-r*r)]);}
 lathe(id('pushrod-seat'),[[.00075,.0068],[.0071,.0068],[.0071,.0145],[.0045,.0145],[.0036,.011],...bowl.reverse().slice(1),[.00075,.0068]]);
 const clip=new T.TorusGeometry(.0072,.0005,12,80,Math.PI*2-.4);clip.rotateX(Math.PI/2);clip.rotateY(.2);clip.translate(0,.015,0);clip.applyMatrix4(new T.Matrix4().makeRotationFromEuler(rotation));
 h.add(id('retainer-ring'),clip,'dark',f.centre.toArray());
}
