import * as T from 'three';
import {headlightHoodPoint} from './headlight-detail.js';
import { buildFascias } from './fascias.js';
import { buildSpoilers } from './spoilers.js';
import { buildGreenhouse } from './greenhouse.js';
import { buildDecklid } from './decklid.js';
import { shoulderWidth, shoulderDrop, lowerPanelHeight, deckHeight, panelUpper as upper, sideWidth, doorSkin } from './body-contours.js';
import {buildExterior} from './exterior.js';
import {cutPanelAperture} from './panel-aperture.js';
import {exteriorBeltHeight} from './body-contours.js';
import {bodyPoint,bodyNominal} from './body-datums.js';

// Reconstructed surfaces from the 1985 factory brochure and DIY illustrations.
// Documented envelope / axle spacing anchor the model; panel contours are not CAD.
export function buildBody(h){h.mapAdded(()=>buildAuthoredBody(h),bodyPoint);}
function buildAuthoredBody(h){
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
 for(const u of [0,1])surface('hood',40,4,(t,v)=>{const p=hoodPoint(u,t);p[1]-=.005*v;return p;});
 for(const u of [0,1])tube('hood',Array.from({length:96},(_,i)=>hoodPoint(u,i/95)),.0022,'rubber');
 for(const v of [0,1])tube('hood',Array.from({length:96},(_,i)=>hoodPoint(i/95,v)),.0022,'rubber');
 function fender(id,s,zmin,zmax,centre,rear){
  const edge=z=>{const d=z-centre;return Math.abs(d)<.339?.308+Math.sqrt(.339**2-d*d):.245;};
  // Split at the arch spring points so the vertical ends are exact edges.
  for(const [a,b]of [[zmin,centre-.339],[centre-.339,centre+.339],[centre+.339,zmax]]){
   const mesh=surface(id,64,40,(u,v)=>{let z=lerp(a,b,u);if(rear&&a===zmin)z-=.074*(1-v)**2*(1-u);const isArch=a===centre-.339,y=lerp(isArch?.308+Math.sqrt(Math.max(0,.339**2-(z-centre)**2)):lowerPanelHeight(z,rear),upper(z,rear)-shoulderDrop(z,rear),v);return [s*sideWidth(z,y,centre,rear),y,z];});
   if(rear&&s>0){
    const face=(z,y)=>[sideWidth(z,y,centre,rear),y,z];
    cutPanelAperture(mesh,Array.from({length:64},(_,i)=>{const a=i/64*Math.PI*2;return [.93+Math.sin(a)*.0505,.710+Math.cos(a)*.0505];}),face,[2,1]);
    const opening=[[.633,0],[.827,0],[.827,1],[.633,1]].map(([z,v])=>[z,exteriorBeltHeight(z)-.133+.103*v]);
    cutPanelAperture(mesh,opening,face,[2,1]);
   }
  }
  surface(id,64,24,(u,v)=>{const z=lerp(zmin,zmax,u),inner=rear?.654:.663;return [s*(inner+(shoulderWidth(z)-inner)*Math.sin(v*Math.PI/2)),upper(z,rear)-shoulderDrop(z,rear)*(1-Math.cos(v*Math.PI/2)),z];});
  // Rolled wheel lip has a real inward return and smooth circular opening.
  surface(id,80,8,(u,v)=>{const a=u*Math.PI,z=centre+Math.cos(a)*.339,y=.308+Math.sin(a)*.339;return [s*(sideWidth(z,y,centre,rear)-.013*v),y-.002*Math.sin(v*Math.PI),z];});
  for(const direction of [-1,1])surface(id,12,6,(u,v)=>{const z=centre+direction*.339,y=lerp(.245,.308,u);return [s*(sideWidth(z,y,centre,rear)-.013*v),y,z];});
  // Panel seam returns replace a visually open paper-thin edge.
  for(const z of [zmin,zmax])surface(id,28,5,(u,v)=>{const y=lerp(lowerPanelHeight(z,rear),upper(z,rear)-shoulderDrop(z,rear),u),zz=z-(rear&&z===zmin?.074*(1-u)**2:0);return [s*(sideWidth(zz,y,centre,rear)-.010*v),y,zz];});

 }
 fender('fender-left',1,-1.788,-.627,-1.1865,false);fender('fender-right',-1,-1.788,-.627,-1.1865,false);
 fender('quarter-left',1,.59,1.865,1.1865,true);fender('quarter-right',-1,.59,1.865,1.1865,true);
 // Door skins have a belt crease, lower tumblehome, handles and mirrors.
 for(const s of [-1,1]){
  const id=s>0?'door-left':'door-right';
  const skin=(u,v)=>doorSkin(s,u,v);
  surface(id,48,40,skin);
  surface(id,32,12,(u,v)=>[s*(.788+.039*Math.cos(v*Math.PI/2)+.004*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)),.778+.034*Math.sin(v*Math.PI/2),lerp(-.619,.582,u)]);
  // Formed sill: rolled lip, convex outer face and a tucked-under return.
  surface(s>0?'rocker-left':'rocker-right',48,28,(u,v)=>{const a=v*Math.PI,z=lerp(-.8475,.8475,u),bottom=lerp(bodyNominal.rockerFront,bodyNominal.rockerRear,u);return [s*(.797+.027*Math.sin(a)+.002*Math.sin(u*Math.PI)),lerp(.261,bottom,(1-Math.cos(a))/2),z];},'blackPaint');
  tube(s>0?'rocker-left':'rocker-right',Array.from({length:32},(_,i)=>[s*.796,.251,lerp(-.836,.836,i/31)]),.003,'rubber');
  for(const u of [0,1])tube(id,Array.from({length:48},(_,i)=>{const p=skin(u,i/47);p[0]-=s*.0025;return p;}),.002,'rubber');
  for(const u of [0,1])surface(id,32,6,(t,v)=>{const p=skin(u,t);p[0]-=s*.010*v;return p;});
  // Recessed jamb backing closes sightlines through the panel gap.
  for(const edge of [0,1])surface(id,48,3,(u,v)=>{const p=skin(edge,u);p[0]-=s*.006;p[2]+=edge?.010*v:-.010*(1-v);return p;},'rubber');
  surface(id,48,5,(u,v)=>{const p=skin(u,0);p[0]-=s*.013*v;return p;});
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
 buildDecklid(h,deckHeight);
 buildExterior(h);
 buildSpoilers(h,deckHeight);
}
