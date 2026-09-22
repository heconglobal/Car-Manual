import * as T from 'three';
import { buildHeadlamps } from './lighting.js';
import { buildFascias } from './fascias.js';
import { buildSpoilers } from './spoilers.js';

// Reconstructed surfaces from the 1985 factory brochure and DIY illustrations.
// Documented envelope / axle spacing anchor the model; panel contours are not CAD.
export function buildBody(h){
 const {add,box,cyl,tube,surface,profile,bolt,label,ring}=h;
 const lerp=T.MathUtils.lerp;
 buildFascias(h);
 // Hood curves crown gently. The perimeter gap is real geometry.
 const hoodPoint=(u,v)=>{const z=lerp(-1.786,-.61,v);const a=u*2-1;return [a*.659,lerp(.625,.818,v)+.013*(1-a*a)+.007*Math.sin(v*Math.PI),z];};
 const hoodPatch=(xmin,xmax,zmin,zmax,nu,nv)=>surface('hood',nu,nv,(u,v)=>hoodPoint((lerp(xmin,xmax,u)/.659+1)/2,(lerp(zmin,zmax,v)+1.786)/1.176));
 // Open apertures remain visible when the headlamps are raised.
 hoodPatch(-.659,.659,-1.786,-1.692,48,6);
 hoodPatch(-.659,.659,-1.368,-.61,48,32);
 hoodPatch(-.38,.38,-1.692,-1.368,30,18);
 hoodPatch(-.659,-.65,-1.692,-1.368,2,18);
 hoodPatch(.65,.659,-1.692,-1.368,2,18);
 for(const u of [0,1])tube('hood',Array.from({length:24},(_,i)=>hoodPoint(u,i/23)),.0022,'rubber');
 for(const v of [0,1])tube('hood',Array.from({length:24},(_,i)=>hoodPoint(i/23,v)),.0022,'rubber');
 // Nose crest — surface decal authored as geometry, not a photograph.
 profile('hood',[[-1.82,.63],[-1.79,.633],[-1.80,.624]],.023,0,'dark');
 const deckHeight=z=>{const t=T.MathUtils.clamp((z-.57)/1.295,0,1);return lerp(.815,.780,t)+.006*Math.sin(t*Math.PI);};
 function upper(z,rear){return rear?deckHeight(z):lerp(.625,.818,(z+1.79)/1.18)+.007*Math.sin((z+1.79)/1.18*Math.PI);}
 function fender(id,s,zmin,zmax,centre,rear){
  const edge=z=>{const d=z-centre;return Math.abs(d)<.339?.308+Math.sqrt(.339**2-d*d):.245;};
  const edgeWidth=z=>.806+.061*Math.exp(-(((z-centre)/.405)**4));
  surface(id,80,24,(u,v)=>{const z=lerp(zmin,zmax,u),y0=edge(z),top=upper(z,rear)-.036;return [s*(lerp(edgeWidth(z),.835,v)+.009*Math.sin(v*Math.PI)),lerp(y0,top,v),z];});
  surface(id,64,24,(u,v)=>{const z=lerp(zmin,zmax,u),inner=rear?.654:.663;return [s*(inner+(.835-inner)*Math.sin(v*Math.PI/2)),upper(z,rear)-.036*(1-Math.cos(v*Math.PI/2)),z];});
  const arch=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI,z=centre+Math.cos(a)*.339;arch.push([s*edgeWidth(z),.308+Math.sin(a)*.339,z]);}tube(id,arch,.005,'red');
  const trimY=z=>rear?.517+.046*T.MathUtils.smoothstep(z,.59,1.865):.520;
  const zRanges=[[zmin,centre-.34],[centre+.34,zmax]];for(const [a,b] of zRanges)if(b>a)tube(id,Array.from({length:16},(_,i)=>{const t=i/15,z=lerp(a,b,t);return [s*(.837+.012*Math.sin(t*Math.PI)),trimY(z),z];}),.010,'rubber');
 }
 fender('fender-left',1,-1.788,-.627,-1.1865,false);fender('fender-right',-1,-1.788,-.627,-1.1865,false);
 fender('quarter-left',1,.59,1.865,1.1865,true);fender('quarter-right',-1,.59,1.865,1.1865,true);
 for(const s of [-1,1]){
  const front=s>0?'fender-left':'fender-right',rear=s>0?'quarter-left':'quarter-right';
  box(front,[.012,.028,.16],[s*.843,.520,-1.75],'indicator');
  box(rear,[.015,.029,.14],[s*.843,.562,1.78],'lamp');
  // Rear roof sail panels and recessed quarter-window trim.
  const tri=(a,b,c,u,v)=>a.map((x,i)=>x*(1-u)+u*(b[i]*(1-v)+c[i]*v));
  const a=[s*.607,1.165,.483],b=[s*.813,.819,1.175],c=[s*.805,.817,.484];
  surface('roof',28,28,(u,v)=>tri(a,b,c,u,v),'red');
  const inset=(wa,wb,wc)=>a.map((x,i)=>x*wa+b[i]*wb+c[i]*wc+(i===0?s*.004:0));
  surface('roof',22,22,(u,v)=>tri(inset(.84,.06,.10),inset(.07,.81,.12),inset(.08,.09,.83),u,v),'blackPaint');
  surface('roof',28,16,(u,v)=>{const z=lerp(.48,1.176,u),x=lerp(.607,.813,u);return [s*lerp(.578,x,v),lerp(lerp(1.165,.819,u),lerp(1.165,.819,u)-.005,v),z];});
  // SE fuel filler door is on the driver-side rear sail / quarter area.
  if(s>0){cyl(rear,.05,.004,[.851,.710,.93],'red');ring(rear,.049,.0017,[.854,.710,.93],'rubber');}
 }
 // Door skins have a belt crease, lower tumblehome, handles and mirrors.
 for(const s of [-1,1]){
  const id=s>0?'door-left':'door-right';
  surface(id,32,28,(u,v)=>{const z=lerp(-.619,.582,u);const y=lerp(.245,.778,v);return [s*(.798+.029*Math.sin(v*Math.PI*.5)+.012*Math.sin(v*Math.PI)+.004*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)),y,z];});
  surface(id,32,12,(u,v)=>[s*lerp(.827,.788,v),lerp(.778,.812,v),lerp(-.619,.582,u)]);
  box(id,[.013,.028,1.19],[s*.846,.517,-.017],'rubber');
  box(id,[.035,.057,1.24],[s*.804,.229,-.012],'blackPaint',[],{},.01);
  box(id,[.008,.033,.13],[s*.836,.699,.412],'rubber');
  box(id,[.010,.011,.103],[s*.842,.705,.408],'dark');
  cyl(id,.009,.007,[s*.842,.657,.453],'chrome');
  tube(id,[[s*.827,.786,-.47],[s*.89,.803,-.48]],.018,'blackPaint');
  box(id,[.126,.071,.144],[s*.899,.828,-.49],'blackPaint',[0,s*-.12,0],{},.025);
  box(id,[.098,.051,.005],[s*.903,.828,-.414],'chrome',[0,s*-.12,0],{},.011);
  tube(id,[[s*.799,.808,-.607],[s*.814,.811,.568]],.005,'rubber');
  box(id,[.024,.033,1.13],[s*.752,.223,-.017],'alloy');
  // Interior panels retain selectable door identity.
  box(id,[.05,.42,1.05],[s*.748,.53,-.03],'vinyl');
  box(id,[.053,.12,.91],[s*.716,.438,.0],'interior');
  box(id,[.12,.075,.38],[s*.666,.59,.16],'vinyl');
  box(id,[.010,.05,.13],[s*.704,.69,-.08],'dark');
  box(id,[.014,.016,.075],[s*.693,.70,-.08],'alloy');
  tube(id,[[s*.695,.58,-.26],[s*.643,.58,-.26],[s*.643,.62,-.23]],.01,'dark',{option:'powerWindows',value:false});
  box(id,[.054,.14,.40],[s*.69,.34,.24],'interior',[],{option:'mapPockets',value:true},.017);
 }
 // Windshield curvature, rubber seals and roof frame.
 const windshield=(u,v)=>{const a=u*2-1;return [a*lerp(.773,.586,v),lerp(.817,1.148,v)+.012*(1-a*a),lerp(-.612,-.092,v)-.028*(1-a*a)];};
 surface('glass',40,28,windshield,'glass');
 for(const u of [0,1])tube('roof',Array.from({length:22},(_,i)=>windshield(u,i/21)),.020,'red');
 for(const v of [0,1])tube('glass',Array.from({length:28},(_,i)=>windshield(i/27,v)),.010,'rubber');
 const roofPoint=(u,v)=>{const a=u*2-1;return [a*.606,1.166+.026*(1-a*a)-.011*(v-.3)**2,lerp(-.074,.482,v)];};
 surface('roof',36,10,(u,v)=>{const a=windshield(u,1),b=roofPoint(u,0);return a.map((x,i)=>lerp(x,b[i],v));});
 surface('roof',36,8,(u,v)=>{const a=roofPoint(u,1),b=[(u*2-1)*.599,1.134,.507];return a.map((x,i)=>lerp(x,b[i],v));});
 surface('roof',40,26,roofPoint,'red',{option:'roof',value:'solid'});
 // A framed, physically open sunroof — not glass pasted on an opaque roof.
 for(const key of ['glass','removed']){
  const flags={option:'roof',value:key};
  surface('roof',8,26,(u,v)=>roofPoint(u*.13,v),'red',flags);
  surface('roof',8,26,(u,v)=>roofPoint(.87+u*.13,v),'red',flags);
  surface('roof',32,6,(u,v)=>roofPoint(.13+u*.74,v*.12),'red',flags);
  surface('roof',32,6,(u,v)=>roofPoint(.13+u*.74,.87+v*.13),'red',flags);
  for(const u of [.13,.87])tube('roof',Array.from({length:20},(_,i)=>roofPoint(u,.12+i/19*.75)),.006,'rubber',flags);
 }
 surface('roof',28,22,(u,v)=>{const p=roofPoint(.14+u*.72,.13+v*.73);p[1]+=.001;return p;},'glass',{option:'roof',value:'glass'});
 surface('glass',36,12,(u,v)=>[(u*2-1)*.58,lerp(.823,1.134,v),.499+.006*(1-(u*2-1)**2)],'glass');
 for(const s of [-1,1]){
  const side=(u,v)=>{const z=lerp(-.592,.471,u),rise=T.MathUtils.clamp(u/.47,0,1),top=lerp(.827,1.145,rise);return [s*lerp(.782,lerp(.773,.603,rise),v),lerp(.815,top,v),z];};
  surface('glass',36,18,side,'glass',{option:'windows',value:'closed'});
  tube('glass',Array.from({length:25},(_,i)=>side(i/24,1)),.006,'rubber');
  tube('roof',[[s*.603,1.155,-.072],[s*.614,1.158,.477]],.019,'red');
  tube('roof',[[s*.614,1.158,.477],[s*.795,.817,.477]],.013,'rubber');
 }
 for(let i=0;i<10;i++)tube('glass',[[-.55,.85+i*.026,.51],[.55,.85+i*.026,.51]],.0008,'gold',{option:'rearDefrost',value:true});
 // Wiper arms, blade housings and cowl slots.
 for(const s of [-1,1]){
  tube('glass',[[s*.18,.839,-.60],[s*.39,.857,-.575],[s*.50,.868,-.553]],.004,'dark');
  tube('glass',[[s*.33,.854,-.59],[s*.55,.873,-.544]],.008,'rubber');
 }
 // Rear decklid + individually recessed side vent slats.
 surface('decklid',38,30,(u,v)=>{const a=u*2-1,z=lerp(.57,1.865,v);return [a*.65,deckHeight(z)+.012*(1-a*a),z];});
 for(const s of [-1,1]){
  box('decklid',[.238,.009,.46],[s*.503,deckHeight(.813)+.009,.813],'dark',[-.02,0,0]);
  for(let i=0;i<12;i++){const z=.602+i*.037;box('decklid',[.228,.008,.018],[s*.503,deckHeight(z)+.011,z],'blackPaint',[-.22,0,0]);}
 }
 // Quarter-panel air intake: a characteristic detail on the driver's side.
 box('quarter-left',[.012,.115,.22],[.842,.605,.735],'rubber',[0,0,0],{},.006);
 for(let i=0;i<5;i++)box('quarter-left',[.016,.009,.196],[.851,.56+i*.021,.735],'blackPaint');
 buildHeadlamps(h,hoodPoint);
 buildSpoilers(h,deckHeight);
}
