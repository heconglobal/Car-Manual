import {formedPatch,rubMolding} from './exterior.js';
import * as T from 'three';
import {bodyNominal} from './body-datums.js';
import {tailLampOutline} from './tail-lamp-shape.js';
import {cutPanelAperture} from './panel-aperture.js';
import { shoulderWidth, shoulderDrop, exteriorBeltHeight, fasciaProfile, sideWidth, frontLampMount } from './body-contours.js';

// GM 22P G-13 / G-19 and the 1985 SE brochure: rounded bumper-pad
// fascias. Cross sections are reconstructed contours, not measured tooling.
const lerp=T.MathUtils.lerp;
const clamp=T.MathUtils.clamp;
function section(stations){
 return y=>{
  let i=0;while(i<stations.length-2&&y>stations[i+1][0])i++;
  const a=stations[i],b=stations[i+1],t=clamp((y-a[0])/(b[0]-a[0]),0,1);
  const before=stations[Math.max(0,i-1)],after=stations[Math.min(stations.length-1,i+2)];
  const ma=(b[1]-before[1])/(b[0]-before[0]),mb=(after[1]-a[1])/(after[0]-a[0]);
  return (2*t**3-3*t*t+1)*a[1]+(t**3-2*t*t+t)*(b[0]-a[0])*ma+(-2*t**3+3*t*t)*b[1]+(t**3-t*t)*(b[0]-a[0])*mb;
 };
}
const frontSection=section([[.270,-1.947],[.292,-1.964],[.315,-1.976],[.365,-1.994],[.465,-2.011],[.517,-2.029],[.548,-2.020],[.599,-1.920],[.625,-1.790]]);
// Distinct bumper crown, sloping painted bridge and raked lamp panel.
// The previous single swollen section erased the separation visible in IMG_5461.
const rearSection=section([[.245,1.894],[.270,1.925],[.305,1.953],[.333,1.970],[.365,1.993],[.440,2.007],[.500,2.010],[.542,1.987],[.625,1.951],[.644,1.939],[.777,1.884],[.816,1.867]]);
function crown(x,inner,rear){
 const a=Math.abs(x);
 if(a<=inner)return .012*(1-(a/inner)**2);
 const z=rear?1.867:-1.790,t=clamp((a-inner)/(shoulderWidth(z)-inner),0,1);
 return -shoulderDrop(z,rear)*(1-Math.sqrt(1-t*t));
}
function width(v,rear){
 // Solve the fascia edge on the same transverse section as the adjacent
 // fender/quarter. Independent width curves left a protruding lower corner.
 const z=rear?1.867:-1.790,top=rear?.816:.625,bottom=rear?fasciaProfile.rearLower:fasciaProfile.frontLower;
 let x=shoulderWidth(z);for(let i=0;i<16;i++){const y=lerp(bottom,top+crown(x,rear?.650:.659,rear),v);x=sideWidth(z,y,rear?1.1865:-1.1865,rear);}
 return x;
}
function point(x,y,rear){
 const top=rear?.816:.625,bottom=rear?fasciaProfile.rearLower:fasciaProfile.frontLower,join=rear?1.867:-1.790;
 const v=clamp((y-bottom)/(top+crown(x,rear?.650:.659,rear)-bottom),0,1);
 const z=(rear?rearSection:frontSection)(lerp(bottom,top,v));
 const w=width(v,rear),corner=rear?.560:.560,q=clamp((Math.abs(x)-corner)/(w-corner),0,1);
 // An elliptical corner meets the adjoining side panel tangentially.
 const turn=1-Math.sqrt(Math.max(0,1-q*q));
 const bow=(rear?-1:1)*.018*(Math.abs(x)/w)**2*(1-turn);
 let finalZ=lerp(z,join,turn)+bow;
 // Recess the plate into the painted centre bridge; do not join the two pads
 // with a flat black strip. Tapered walls remain part of the fascia mesh.
 if(rear){const across=1-T.MathUtils.smoothstep(Math.abs(x),.148,.180),vertical=T.MathUtils.smoothstep(y,.335,.355)*(1-T.MathUtils.smoothstep(y,.505,.543));finalZ-=.047*across*vertical;}
 return [x,y,finalZ];
}
// Clearance scallops above each twin outlet; local dimensions are inferred.
function apronBottom(x,rear){
 if(!rear)return fasciaProfile.frontLower;
 const q=Math.abs(Math.abs(x)-.510)/.115;
 return fasciaProfile.rearLower+(q<1?.043*Math.sqrt(1-q*q):0);
}
export const frontFace=(x,y)=>point(x,y,false);
export const rearFace=(x,y)=>point(x,y,true);
// The registration plate is planar inside the sculpted fascia recess.
export const rearPlateFace=(x,y)=>[x,y,rearFace(0,.438)[2]];

export function buildFascias(h){
 const {surface,tube,box,label}=h;
 for(const rear of [false,true]){
  const id=rear?'rear-fascia':'nose',top=rear?.816:.625,bottom=rear?fasciaProfile.rearLower:fasciaProfile.frontLower;
  const mesh=surface(id,112,64,(u,v)=>{const x=(u*2-1)*width(v,rear),y=lerp(apronBottom(x,rear),top+crown(x,rear?.650:.659,rear),v);return point(x,y,rear);});
  // Turn the apron under the body, retaining a formed lower edge.
  surface(id,112,6,(u,v)=>{const x=(u*2-1)*width(0,rear),p=point(x,apronBottom(x,rear),rear);return [p[0]*(1-.008*v),p[1]+.004*(1-Math.cos(v*Math.PI/2)),p[2]+(rear?-1:1)*.026*Math.sin(v*Math.PI/2)];});
  // Open lamp apertures: opaque fascia must not occupy reflector chambers.
  const geo=mesh.geometry,pos=geo.attributes.position,idx=geo.index,keep=[];
  for(let i=0;i<idx.count;i+=3){const a=idx.getX(i),b=idx.getX(i+1),c=idx.getX(i+2),x=Math.abs((pos.getX(a)+pos.getX(b)+pos.getX(c))/3),y=(pos.getY(a)+pos.getY(b)+pos.getY(c))/3;const lamp=false;const plate=rear&&x<.158&&y>.355&&y<.520;if(!lamp&&!plate)keep.push(a,b,c);}
  geo.setIndex(keep);geo.computeVertexNormals();
  if(!rear)for(const side of [-1,1]){const cx=side*.500,cy=frontLampMount.height;cutPanelAperture(mesh,[[-.091,-.043],[.091,-.043],[.091,.043],[-.091,.043]].map(([x,y])=>[x+cx,y+cy]),frontFace);}
  if(rear)for(const side of [-1,1])cutPanelAperture(mesh,tailLampOutline(.002).map(([x,y])=>[side*x,y]),rearFace);
 }
 // Closed pads stand proud of the flexible fascia and contain real apertures.
 for(const rear of [false,true]){
  const face=rear?rearFace:frontFace,end=rear?'rear':'front',sign=rear?1:-1;
  rubMolding(h,end+'-fascia-molding',(u,dy=0)=>face(lerp(-.827,.827,u),exteriorBeltHeight(rear?1.78:-1.75)+dy-(rear?.012*(1-T.MathUtils.smoothstep(Math.abs(lerp(-.827,.827,u)),.65,.80)):0)),u=>{const x=lerp(-.827,.827,u),turn=Math.max(0,(Math.abs(x)-.59)/.237);return [Math.sign(x)*turn,0,sign*(1-turn)];},.022);
  for(const side of ['left','right']){
   const s=side==='left'?1:-1,cx=s*.480,cy=rear?.440:.410;
   const holes=rear?[[s*.635,.436,.092,.039]]:[[s*.500,frontLampMount.height,frontLampMount.openingWidth,frontLampMount.openingHeight]];
   formedPatch(h,end+'-pad-'+side,face,cx,cy,.610,rear?.186:.146,sign*.018,'rubber',holes);
   if(rear)formedPatch(h,end+'-pad-'+side,face,s*.635,.436,.093,.040,.003,'dark');
  }
  formedPatch(h,end+'-plate-mount',rear?rearPlateFace:face,0,rear?.438:.389,rear?.334:.270,rear?.200:.138,sign*.002,'dark');
  for(const x of [-.112,.112]){const p=(rear?rearPlateFace:face)(x,rear?.503:.423);p[2]+=sign*.008;h.bolt(end+'-plate-mount',p,.003,'z','zinc');}
 }
 const plate=rearFace(0,.438);
 label('rear-plate-mount','PONTIAC',[.300,.150],[0,plate[1],plate[2]+.009],[0,0,0],{background:'#d8d9d0',foreground:'#34393b',font:'bold 52px Arial',border:true});
 label('rear-emblems','P O N T I A C',[.41,.024],[0,.574,rearFace(0,.574)[2]+.003],[Math.atan((rearFace(0,.575)[2]-rearFace(0,.573)[2])/.002),0,0],{background:'transparent',foreground:'#756965',font:'48px Arial'});
 const badge=rearFace(.50,.798),badgeSlope=(rearFace(.50,.799)[2]-rearFace(.50,.797)[2])/.002;
 label('rear-emblems','Fiero 2M6',[.158,.023],[badge[0],badge[1]+.001,badge[2]+.002],[Math.atan(badgeSlope),0,0],{background:'transparent',foreground:'#c7c8c5',font:'italic 62px Arial'});
 surface('front-deflector',72,8,(u,v)=>{const x=(u*2-1)*.772,p=frontFace(x,fasciaProfile.frontLower);return [x,p[1]-.002-v*.024,p[2]+.032+v*.012];},'rubber');
 // Seat the badge on the sloped nose instead of letting a flat crest cross it.
 const crest=(x,z)=>{let lo=.58,hi=.645;for(let i=0;i<30;i++){const y=(lo+hi)/2;if(frontFace(x,y)[2]<z)lo=y;else hi=y;}return[x,(lo+hi)/2+.0008,z];};
 surface('nose-emblem',16,12,(u,v)=>crest((u*2-1)*.017*(1-.68*v),-1.822+v*.038),'chrome');
 surface('nose-emblem',16,12,(u,v)=>{const p=crest((u*2-1)*.014*(1-.68*v),-1.819+v*.032);p[1]+=.001;return p;},'dark');
}
