import * as T from 'three';
import {headlightHoodPoint} from './headlight-detail.js';
import { buildFascias } from './fascias.js';
import { buildSpoilers } from './spoilers.js';
import { buildGreenhouse } from './greenhouse.js';
import { buildDecklid } from './decklid.js';
import { shoulderWidth, shoulderDrop, rearLowerRise } from './body-contours.js';

// Reconstructed surfaces from the 1985 factory brochure and DIY illustrations.
// Documented envelope / axle spacing anchor the model; panel contours are not CAD.
export function buildBody(h){
 const {add,box,cyl,tube,surface,profile,bolt,label,ring}=h;
 const lerp=T.MathUtils.lerp;
 buildFascias(h);
 // Hood curves crown gently. The perimeter gap is real geometry.
 const hoodPoint=headlightHoodPoint;
 const hoodPatch=(xmin,xmax,zmin,zmax,nu,nv)=>surface('hood',nu,nv,(u,v)=>hoodPoint((lerp(xmin,xmax,u)/.659+1)/2,(lerp(zmin,zmax,v)+1.786)/1.176));
 // Open apertures remain visible when the headlamps are raised.
 hoodPatch(-.659,.659,-1.786,-1.692,48,6);
 hoodPatch(-.659,.659,-1.368,-.61,48,32);
 hoodPatch(-.376,.376,-1.692,-1.368,30,18);
 hoodPatch(-.659,-.646,-1.692,-1.368,2,18);
 hoodPatch(.646,.659,-1.692,-1.368,2,18);
 for(const u of [0,1])tube('hood',Array.from({length:24},(_,i)=>hoodPoint(u,i/23)),.0022,'rubber');
 for(const v of [0,1])tube('hood',Array.from({length:24},(_,i)=>hoodPoint(i/23,v)),.0022,'rubber');
 // Nose crest — surface decal authored as geometry, not a photograph.
 profile('hood',[[-1.82,.63],[-1.79,.633],[-1.80,.624]],.023,0,'dark');
 const deckHeight=z=>{const t=T.MathUtils.clamp((z-.57)/1.295,0,1);return lerp(.815,.780,t)+.006*Math.sin(t*Math.PI);};
 function upper(z,rear){return rear?deckHeight(z):lerp(.625,.818,(z+1.79)/1.18)+.019*Math.sin((z+1.79)/1.18*Math.PI);}
 const sideWidth=(z,y,centre,rear)=>{const q=T.MathUtils.clamp((y-.245)/(upper(z,rear)-shoulderDrop(z,rear)-.245),0,1),flare=Math.exp(-(((z-centre)/.42)**4));return .783+(.052+shoulderWidth(z)-.835)*q+(.030+.032*flare)*Math.sin(q*Math.PI);};
 function fender(id,s,zmin,zmax,centre,rear){
  const edge=z=>{const d=z-centre;return Math.abs(d)<.339?.308+Math.sqrt(.339**2-d*d):.245;};
  surface(id,96,40,(u,v)=>{const z=lerp(zmin-(rear?.074*(1-v)**2:0),zmax,u),y=lerp(edge(z),upper(z,rear)-shoulderDrop(z,rear),v);return [s*sideWidth(z,y,centre,rear),y+(rear?rearLowerRise(z,y):0),z];});
  surface(id,64,24,(u,v)=>{const z=lerp(zmin,zmax,u),inner=rear?.654:.663;return [s*(inner+(shoulderWidth(z)-inner)*Math.sin(v*Math.PI/2)),upper(z,rear)-shoulderDrop(z,rear)*(1-Math.cos(v*Math.PI/2)),z];});
  const arch=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI,z=centre+Math.cos(a)*.339;arch.push([s*sideWidth(z,.308+Math.sin(a)*.339,centre,rear),.308+Math.sin(a)*.339,z]);}tube(id,arch,.005,'red');
  const trimY=z=>rear?.517+.046*T.MathUtils.smoothstep(z,.59,1.865):.520;
  const zRanges=[[zmin,centre-.34],[centre+.34,zmax]];for(const [a,b] of zRanges)if(b>a)tube(id,Array.from({length:16},(_,i)=>{const t=i/15,z=lerp(a,b,t);return [s*(sideWidth(z,trimY(z),centre,rear)+.004),trimY(z),z];}),.010,'rubber');
 }
 fender('fender-left',1,-1.788,-.627,-1.1865,false);fender('fender-right',-1,-1.788,-.627,-1.1865,false);
 fender('quarter-left',1,.59,1.865,1.1865,true);fender('quarter-right',-1,.59,1.865,1.1865,true);
 for(const s of [-1,1]){
  const front=s>0?'fender-left':'fender-right',rear=s>0?'quarter-left':'quarter-right';
  // SE fuel filler door is on the driver-side rear sail / quarter area.
  if(s>0){
   const cap=(a,r)=>{const y=.710+Math.cos(a)*r,z=.93+Math.sin(a)*r;return [sideWidth(z,y,1.1865,true)+.002,y,z];};
   surface(rear,64,12,(u,v)=>cap(u*Math.PI*2,.049*v));
   tube(rear,Array.from({length:65},(_,i)=>cap(i/64*Math.PI*2,.049)),.0016,'rubber');
  }
 }
 // Door skins have a belt crease, lower tumblehome, handles and mirrors.
 for(const s of [-1,1]){
  const id=s>0?'door-left':'door-right';
  const skin=(u,v)=>{const z=lerp(-.619,.582-.074*(1-v)**2,u),y=lerp(.245,.778,v);return [s*(.783+.044*v+.039*Math.sin(v*Math.PI)+.010*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)),y,z];};
  surface(id,48,40,skin);
  surface(id,32,12,(u,v)=>[s*(.788+.039*Math.cos(v*Math.PI/2)+.004*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)),.778+.034*Math.sin(v*Math.PI/2),lerp(-.619,.582,u)]);
  for(const dy of [-.008,0,.008])tube(id,Array.from({length:40},(_,i)=>{const p=skin(i/39,(.517+dy-.245)/.533);p[0]+=s*.004;return p;}),.005,'rubber');
  // Formed sill: rolled lip, convex outer face and a tucked-under return.
  surface(s>0?'rocker-left':'rocker-right',48,28,(u,v)=>{const a=v*Math.PI,z=lerp(-.844,.844,u);return [s*(.761+.046*Math.sin(a)+.004*Math.sin(u*Math.PI)),.230+.031*Math.cos(a),z];},'blackPaint');
  tube(s>0?'rocker-left':'rocker-right',Array.from({length:32},(_,i)=>[s*.796,.251,lerp(-.836,.836,i/31)]),.003,'rubber');
  for(const u of [0,1])tube(id,Array.from({length:32},(_,i)=>skin(u,i/31)),.002,'rubber');
  box(id,[.008,.033,.13],[s*.852,.477,.412],'rubber');
  box(id,[.010,.011,.103],[s*.858,.491,.408],'dark');
  cyl(id,.009,.007,[s*.858,.472,.505],'chrome');
  tube(id,[[s*.827,.786,-.47],[s*.89,.803,-.48]],.018,'blackPaint');
  box(id,[.126,.071,.144],[s*.899,.828,-.49],'blackPaint',[0,s*-.12,0],{},.025);
  box(id,[.098,.051,.005],[s*.903,.828,-.414],'chrome',[0,s*-.12,0],{},.011);
  tube(id,[[s*.799,.808,-.607],[s*.814,.811,.568]],.005,'rubber');
  box(id,[.024,.033,1.13],[s*.752,.223,-.017],'alloy');
  // Interior trim separates from the door skin and its hardware.
  const trimId=s>0?'door-trim-left':'door-trim-right';
  box(trimId,[.05,.42,1.05],[s*.748,.53,-.03],'vinyl');
  box(trimId,[.053,.12,.91],[s*.716,.438,.0],'interior');
  box(trimId,[.12,.075,.38],[s*.666,.59,.16],'vinyl');
  box(trimId,[.010,.05,.13],[s*.704,.69,-.08],'dark');
  box(trimId,[.014,.016,.075],[s*.693,.70,-.08],'alloy');
  tube(trimId,[[s*.695,.58,-.26],[s*.643,.58,-.26],[s*.643,.62,-.23]],.01,'dark',{option:'powerWindows',value:false});
  box(trimId,[.054,.14,.40],[s*.69,.34,.24],'interior',[],{option:'mapPockets',value:true},.017);
 }
 buildGreenhouse(h,deckHeight);
 // Wiper arms, blade housings and cowl slots.
 for(const s of [-1,1]){
  tube('glass',[[s*.18,.839,-.60],[s*.39,.857,-.575],[s*.50,.868,-.553]],.004,'dark');
  tube('glass',[[s*.33,.854,-.59],[s*.55,.873,-.544]],.008,'rubber');
 }
 buildDecklid(h,deckHeight);
 // Quarter-panel air intake: a characteristic detail on the driver's side.
 surface('quarter-left',24,12,(u,v)=>{const y=.551+.109*v,z=.637+.196*u;return [sideWidth(z,y,1.1865,true)+.002,y,z];},'rubber');
 for(let i=0;i<5;i++)tube('quarter-left',Array.from({length:18},(_,j)=>{const y=.56+i*.021,z=.637+.196*j/17;return [sideWidth(z,y,1.1865,true)+.006,y,z];}),.004,'blackPaint');
 buildSpoilers(h,deckHeight);
}
