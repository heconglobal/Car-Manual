import * as T from 'three';
import { buildHeadlamps } from './lighting.js';

// Reconstructed surfaces from the 1985 factory brochure and DIY illustrations.
// Documented envelope / axle spacing anchor the model; panel contours are not CAD.
export function buildBody(h){
 const {add,box,cyl,tube,surface,profile,bolt,label,ring}=h;
 const lerp=T.MathUtils.lerp;
 // SE bumper-pad nose: curved across the car and tapered in plan.
 const noseSection=new T.SplineCurve([[.245,-1.86],[.275,-1.983],[.405,-2.028],[.502,-2.027],[.551,-1.976],[.603,-1.865],[.625,-1.79]].map(p=>new T.Vector2(...p)));
 const nosePoint=(u,v)=>{const a=u*2-1,p=noseSection.getPoint(v),w=lerp(.78,.835,v);return [a*w,p.x+.013*(1-a*a)-.036*Math.abs(a)**6*v,p.y+.058*Math.abs(a)**6*(1-v)];};
 surface('nose',64,48,nosePoint);
 // Wrap both corners back to the fender; all boundary heights share the loft.
 for(const s of [-1,1])surface('nose',20,48,(u,v)=>{const p=nosePoint(s>0?1:0,v),t=T.MathUtils.clamp((p[1]-.245)/.344,0,1);return [lerp(p[0],s*(.8065+.0285*t+.009*Math.sin(t*Math.PI)),u)+s*.005*Math.sin(u*Math.PI),p[1],lerp(p[2],-1.790,u)];});
 surface('nose',32,8,(u,v)=>[(u*2-1)*.78,.27,lerp(-1.86,-1.79,v)],'dark');
 for(const s of [-1,1]){
  box('nose',[.59,.083,.021],[s*.454,.484,-2.029],'rubber',[0,s*-.047,0],{},.022);
  box('nose',[.12,.032,.008],[s*.54,.483,-2.042],'indicator');
  box('nose',[.204,.046,.012],[s*.53,.312,-1.999],'dark',[.24,0,0]);
  for(let i=0;i<3;i++)box('nose',[.185,.003,.005],[s*.53,.299+i*.011,-2.008],'plastic');
 }
 box('nose',[.245,.065,.017],[0,.362,-2.026],'dark');
 label('nose','PONTIAC',[.145,.023],[0,.29,-2.014],[0,Math.PI,0],{background:'#18191b',foreground:'#979ba0',font:'bold 54px Arial'});
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
 function upper(z,rear){return rear?lerp(.814,.787,(z-.59)/(1.942-.59)):lerp(.625,.818,(z+1.79)/1.18);}
 function fender(id,s,zmin,zmax,centre,rear){
  const edge=z=>{const d=z-centre;return Math.abs(d)<.339?.308+Math.sqrt(.339**2-d*d):.245;};
  const edgeWidth=z=>.806+.061*Math.exp(-(((z-centre)/.405)**4));
  surface(id,80,24,(u,v)=>{const z=lerp(zmin,zmax,u),y0=edge(z),top=upper(z,rear)-.036;return [s*(lerp(edgeWidth(z),.835,v)+.009*Math.sin(v*Math.PI)),lerp(y0,top,v),z];});
  surface(id,64,24,(u,v)=>{const z=lerp(zmin,zmax,u);return [s*(.663+(.835-.663)*Math.sin(v*Math.PI/2)),upper(z,rear)-.036*(1-Math.cos(v*Math.PI/2)),z];});
  const arch=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI,z=centre+Math.cos(a)*.339;arch.push([s*edgeWidth(z),.308+Math.sin(a)*.339,z]);}tube(id,arch,.005,'red');
  const zRanges=[[zmin,centre-.34],[centre+.34,zmax]];for(const [a,b] of zRanges)if(b>a)tube(id,[[s*.84,.513,a],[s*.854,.514,(a+b)/2],[s*.842,.514,b]],.014,'rubber');
 }
 fender('fender-left',1,-1.788,-.627,-1.1865,false);fender('fender-right',-1,-1.788,-.627,-1.1865,false);
 fender('quarter-left',1,.59,1.942,1.1865,true);fender('quarter-right',-1,.59,1.942,1.1865,true);
 for(const s of [-1,1]){
  const front=s>0?'fender-left':'fender-right',rear=s>0?'quarter-left':'quarter-right';
  box(front,[.012,.028,.16],[s*.843,.55,-1.75],'indicator');
  box(rear,[.015,.029,.14],[s*.843,.532,1.80],'lamp');
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
  surface(id,32,28,(u,v)=>{const z=lerp(-.619,.582,u);const y=lerp(.245,.778,v);return [s*(.798+.029*Math.sin(v*Math.PI*.5)+.012*Math.sin(v*Math.PI)),y,z];});
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
 surface('decklid',38,30,(u,v)=>{const a=u*2-1;return [a*.65,lerp(.815,.781,v)+.012*(1-a*a),lerp(.57,1.943,v)];});
 for(const s of [-1,1]){
  box('decklid',[.238,.018,.46],[s*.503,.84,.813],'dark',[-.02,0,0]);
  for(let i=0;i<12;i++)box('decklid',[.228,.012,.018],[s*.503,.853,.602+i*.037],'blackPaint',[-.22,0,0]);
 }
 // Quarter-panel air intake: a characteristic detail on the driver's side.
 box('quarter-left',[.012,.115,.22],[.842,.605,.735],'rubber',[0,0,0],{},.006);
 for(let i=0;i<5;i++)box('quarter-left',[.016,.009,.196],[.851,.56+i*.021,.735],'blackPaint');
 // Rear fascia and authentic notchback lamp arrangement.
 const rearPoint=(u,v)=>{const a=u*2-1;return [a*(.803+.032*Math.sin(v*Math.PI/2)),lerp(.245,.787,v)+.013*(1-a*a)*v-.036*Math.abs(a)**6*v,2.018-.055*(1-v)**2-.055*Math.abs(a)**6];};
 surface('rear-fascia',48,28,rearPoint);
 surface('rear-fascia',48,12,(u,v)=>{const p=rearPoint(u,1);p[2]=lerp(1.949,p[2],v);return p;});
 for(const s of [-1,1])surface('rear-fascia',12,28,(u,v)=>{const p=rearPoint(s>0?1:0,v);p[2]=lerp(1.945,p[2],u);return p;});
 box('rear-fascia',[1.59,.074,.038],[0,.48,2.018],'rubber');
 box('rear-fascia',[.34,.15,.014],[0,.335,2.003],'dark');
 label('rear-fascia','PONTIAC',[.28,.08],[0,.335,2.014],[0,0,0],{background:'#d8d9d0',foreground:'#34393b',font:'bold 52px Arial',border:true});
 box('taillights',[1.46,.163,.018],[0,.682,2.020],'blackPaint');
 for(const s of [-1,1]){
  box('taillights',[.565,.127,.011],[s*.406,.687,2.034],'lamp',[],{},.013);
  box('taillights',[.074,.103,.010],[s*.141,.687,2.036],'white');
  for(let i=0;i<26;i++)box('taillights',[.001,.119,.002],[s*.406-.267+i*.021,.688,2.041],'dark');
  for(let i=0;i<5;i++)box('taillights',[.552,.001,.002],[s*.406,.638+i*.024,2.041],'dark');
 }
 label('taillights','PONTIAC',[.225,.035],[0,.694,2.031],[0,0,0],{background:'#111416',foreground:'#a5abad',font:'bold 47px Arial'});
 label('rear-fascia','Fiero 2M6',[.16,.025],[.59,.557,2.030],[0,0,0],{background:'transparent',foreground:'#c7c8c5',font:'italic 62px Arial'});
 buildHeadlamps(h,hoodPoint);
 // Accessory geometry belongs to the decklid for selection / explosion.
 for(const s of [-1,1]){
  tube('decklid',[[s*.48,.82,1.12],[s*.48,.87,1.17],[s*.48,.86,1.78],[s*.48,.81,1.84]],.014,'blackPaint',{option:'deck',value:'rack'});
  for(const z of [1.2,1.76])box('decklid',[.044,.048,.08],[s*.48,.827,z],'rubber',[],{option:'deck',value:'rack'});
  profile('decklid',[[1.66,.798],[1.71,1.012],[1.83,1.015],[1.77,.795]],.055,s*.44,'red',{option:'deck',value:'wing'});
 }
 for(const z of [1.24,1.48,1.72])tube('decklid',[[-.48,.865,z],[0,.875,z],[.48,.865,z]],.012,'blackPaint',{option:'deck',value:'rack'});
 surface('decklid',48,18,(u,v)=>{const a=u*2-1;return [a*.738,1.007+.033*Math.sin(v*Math.PI)-.016*a*a,1.64+v*.28-.024*a*a];},'red',{option:'deck',value:'wing'});
 surface('decklid',48,12,(u,v)=>{const a=u*2-1;return [a*.738,.994-.010*Math.sin(v*Math.PI)-.016*a*a,1.64+v*.28-.024*a*a];},'red',{option:'deck',value:'wing'});
}
