import * as T from 'three';
import {windshield,aPost,rail,sideWindow} from './glazing-contours.js';
import { buildRearClip } from './rear-clip.js';
import { buildSunroof, roofPoint, sunroofGlassPoint } from './sunroof.js';
import {buildOpeningSeals,glazingSeal,windshieldRevealSection} from './window-seals.js';

// 1985 brochure and GM 22P H-8: formed roof skin, separate sail applique,
// recessed backlight. Local curves are reconstructed, not tooling coordinates.
export function buildGreenhouse(h,deckHeight){
 const {surface,tube}=h,lerp=T.MathUtils.lerp;
 const blend=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
 const bezier=(a,b,c,d,t)=>a.map((x,i)=>x*(1-t)**3+3*b[i]*t*(1-t)**2+3*c[i]*t*t*(1-t)+d[i]*t**3);
 surface('glass',48,32,windshield,'glass');
 for(const s of [-1,1]){
  const signed=p=>[s*p[0],p[1],p[2]];
  // Broad radiused A-post skins replace the old round rods.
  surface('roof',32,12,(u,v)=>{const p=blend(windshield(s>0?1:0,u),signed(aPost(u)),v);p[0]+=s*.004*Math.sin(v*Math.PI);p[1]+=.003*Math.sin(v*Math.PI);return p;});
  surface('roof',12,8,(u,v)=>blend(blend(windshield(s>0?1:0,1),roofPoint(s>0?1:0,0),u),signed(aPost(1)),v));
  const side=(u,v)=>sideWindow(s,u,v);
  surface(s>0?'door-glass-left':'door-glass-right',100,32,side,'glass',{option:'windows',value:'closed'});
  // GM 22P 2P12-012 items 26–29: separate retainers/seals and belt fillers.
  // These are body-mounted; they remain when the door glass is lowered.
  const sideName=s>0?'left':'right';
  buildOpeningSeals(h,s);
  surface('windshield-belt-filler-'+sideName,12,10,(u,v)=>blend(blend(windshield(s>0?1:0,0),signed(aPost(0)),u),[s*.790,.808,-.550],v),'windowTrim');
  // Rolled roof shoulders share the side-window opening and roof perimeter.
  surface('roof',36,16,(u,v)=>{const p=blend(roofPoint(s>0?1:0,u),signed(rail(u)),v);p[0]+=s*.006*Math.sin(v*Math.PI);p[1]+=.006*Math.sin(v*Math.PI);return p;});

  // Close the rear end of the rolled roof shoulder onto the rear clip.
  // Previously a 20 mm triangular opening exposed the seal/structure.
  surface('roof',12,4,(u,v)=>{const p=blend(roofPoint(s>0?1:0,1),signed(rail(1)),u);p[2]+=.004*v;p[1]-=.004*v;return p;});
 }
 glazingSeal(h,'glass',windshield,[0,.8,-.6],{section:windshieldRevealSection});
 surface('roof',48,12,(u,v)=>{const p=blend(windshield(u,1),roofPoint(u,0),v);p[1]+=.006*Math.sin(v*Math.PI);return p;});

 surface('roof',48,32,roofPoint,'red',{option:'roof',value:'solid'});
 for(const key of ['glass','removed']){
  const flags={option:'roof',value:key};
  surface('roof',8,32,(u,v)=>roofPoint(u*.13,v),'red',flags);
  surface('roof',8,32,(u,v)=>roofPoint(.87+u*.13,v),'red',flags);
  surface('roof',36,8,(u,v)=>roofPoint(.13+u*.74,v*.12),'red',flags);
  surface('roof',36,8,(u,v)=>roofPoint(.13+u*.74,.87+v*.13),'red',flags);
  // Painted corner returns round the physically open aperture.
  for(const su of [-1,1])for(const sv of [-1,1])surface('roof',10,14,(u,v)=>{
   const dv=.070*v,du=.045*(1-Math.sqrt(Math.max(0,1-(1-v)**2)))*u;
   return roofPoint(su<0?.13+du:.87-du,sv<0?.12+dv:.87-dv);
  },'red',flags);
 }
 surface('sunroof-glass',40,36,sunroofGlassPoint,'glass',{option:'roof',value:'glass'});
 buildSunroof(h);
 buildRearClip(h,deckHeight,roofPoint,sideWindow);
}
