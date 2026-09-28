import * as T from 'three';
import {seatDatum,seatBackPoint,seatCushionPoint,buildDoorTrimSkin} from './interior-surfaces.js';
import {bodyPoint} from './body-datums.js';
import {aPost} from './glazing-contours.js';
import {roofPoint} from './sunroof.js';
import {cutPanelAperture} from './panel-aperture.js';
import {backWidth} from './interior-surfaces.js';
import {cabinNominal} from './factory-specifications.js';
const lerp=T.MathUtils.lerp;
export function cabinTools(h){
 const {add,box,cyl,tube,surface,ring}=h;
 function frame(id,w,ht,wall,depth,p,mat='plastic',rot=[0,0,0]){
  const shape=new T.Shape();shape.moveTo(-w/2,-ht/2);shape.lineTo(w/2,-ht/2);shape.lineTo(w/2,ht/2);shape.lineTo(-w/2,ht/2);shape.closePath();
  const hole=new T.Path();hole.moveTo(-w/2+wall,-ht/2+wall);hole.lineTo(-w/2+wall,ht/2-wall);hole.lineTo(w/2-wall,ht/2-wall);hole.lineTo(w/2-wall,-ht/2+wall);hole.closePath();shape.holes.push(hole);
  const geo=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:Math.min(.002,wall/3),bevelThickness:.001,bevelSegments:2});geo.translate(0,0,-depth/2);return add(id,geo,mat,p,rot);
 }
 function screw(id,p,axis='y',r=.003){const rot=axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0];cyl(id,r*1.7,.002,p,'zinc',rot);const q=p.slice(),k={x:0,y:1,z:2}[axis];q[k]-=.009;cyl(id,r*.7,.018,q,'zinc',rot);const size=[r*2.1,.0006,.0007];if(axis==='x'){size[0]=.0006;size[1]=r*2.1;}if(axis==='z'){size[1]=r*2.1;size[2]=.0006;}const top=p.slice();top[k]+=.0011;box(id,size,top,'dark',[],{},0);}
 function spring(id,p,r,length,axis='z',turns=8,wire=.0008){tube(id,Array.from({length:97},(_,i)=>{const t=i/96,a=t*Math.PI*2*turns,q=[Math.cos(a)*r,Math.sin(a)*r,(t-.5)*length];if(axis==='x')return[p[0]+q[2],p[1]+q[1],p[2]+q[0]];if(axis==='y')return[p[0]+q[0],p[1]+q[2],p[2]+q[1]];return p.map((v,k)=>v+q[k]);}),wire,'zinc');}
 function shell(id,point,mat,nu=32,nv=38){const front=surface(id,nu,nv,(u,v)=>point(u,v,false),mat);surface(id,nu,nv,(u,v)=>point(u,v,true),mat);for(const u of [0,1])surface(id,nv,5,(v,t)=>{const a=point(u,v,false),b=point(u,v,true);return a.map((x,i)=>lerp(x,b[i],t));},mat);for(const v of [0,1])surface(id,nu,5,(u,t)=>{const a=point(u,v,false),b=point(u,v,true);return a.map((x,i)=>lerp(x,b[i],t));},mat);return front;}
 function belt(id,points,width=.045,mat='clothBolster'){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));surface(id,60,4,(u,v)=>{const p=curve.getPoint(u);return[p.x+(v-.5)*width,p.y,p.z];},mat);}
 return{frame,screw,spring,shell,belt};
}
export function buildInteriorNative(h,{doorPanels=true}={}){for(const s of [1,-1]){h.mapAdded(()=>buildSeat(h,s),(p,m)=>{const id=m.userData.detailPartId||m.userData.partId;return /-back-(frame|springs|foam|cover)$|-rear-cover$|-speaker-/.test(id)||id.endsWith('-listing')&&p[1]>.36?[p[0],p[1],p[2]-(id.endsWith('-back-frame')?.012:0)-.052+(p[1]-.365)*(Math.tan(cabinNominal.backAngle*Math.PI/180)-.29)]:p;});buildBelt(h,s);h.mapAdded(()=>buildDoor(h,s,doorPanels),bodyPoint);}buildDash(h);buildConsole(h);buildRadio(h);buildTrim(h);buildSteering(h);buildPedals(h);}
function buildSeat(h,s){
 const {box,cyl,tube,surface,ring,bolt}=h,{frame,screw,spring,shell}=cabinTools(h),side=s>0?'left':'right',id=k=>'in-seat-'+side+'-'+k,x=s*seatDatum.centre;
 frame(id('pan'),.414,.425,.019,.022,[x,.287,.101],'dark',[Math.PI/2,0,0]);
 for(const dx of [-.18,.18])box(id('pan'),[.018,.038,.43],[x+dx,.306,.101],'dark',[],{},.003);
 for(const z of [-.075,.293])box(id('pan'),[.371,.030,.012],[x,.305,z],'dark',[],{},.003);
 for(let i=0;i<5;i++)tube(id('cushion-springs'),Array.from({length:41},(_,j)=>[x-.17+j/40*.34,.322+Math.sin(j/40*Math.PI*12)*.003,-.065+i*.081]),.0016,'zinc');
 for(const dx of [-.132,.132])tube(id('back-frame'),[[x+dx,.35,.303],[x+dx*1.25,.69,.410],[x+dx*.83,.946,.501],[x+dx*.70,1.005,.508]],.011,'dark');
 for(const [y,w]of [[.39,.143],[.69,.166],[.855,.126],[1.005,.092]])tube(id('back-frame'),[[x-w,y,.303+(y-.35)*.30],[x+w,y,.303+(y-.35)*.30]],.010,'dark');
 for(let i=0;i<6;i++){const y=.435+i*.069,z=.308+(y-.35)*.30;tube(id('back-springs'),[[x-.143,y,z],[x-.05,y+.009,z-.012],[x+.05,y-.009,z-.012],[x+.143,y,z]],.0016,'zinc');}
 shell(id('cushion-foam'),(u,v,rear)=>seatCushionPoint(s,u,v,rear,.008),'seatFoam');
 const foamFront=shell(id('back-foam'),(u,v,rear)=>seatBackPoint(s,u,v,rear,.009),'seatFoam');
 for(const dx of [-.065,.065]){
  const face=(xx,yy)=>{const v=((yy-.365)/.670-.0135)/.973,u=((xx-x)/(backWidth(yy)-.009)+1)/2;return seatBackPoint(s,u,v,false,.009);},outline=Array.from({length:48},(_,i)=>[x+dx+.041*Math.cos(i*Math.PI/24),.949+.041*Math.sin(i*Math.PI/24)]);
  cutPanelAperture(foamFront,outline,face);
  surface(id('back-foam'),48,10,(u,v)=>{const a=u*Math.PI*2,q=face(x+dx+.041*Math.cos(a),.949+.041*Math.sin(a));q[2]=lerp(q[2],.501+(q[1]-.949)*.29,v);return q;},'seatFoam');
  surface(id('back-foam'),48,10,(u,v)=>[x+dx+.041*v*Math.cos(u*Math.PI*2),.949+.041*v*Math.sin(u*Math.PI*2),.501+.041*v*Math.sin(u*Math.PI*2)*.29],'seatFoam');
 }
 shell(id('cushion-cover'),(u,v,rear)=>seatCushionPoint(s,u,v,rear),'clothBolster');
 surface(id('cushion-cover'),30,36,(u,v)=>{const p=seatCushionPoint(s,.20+.60*u,.025+.690*v);p[1]+=.0018;return p;},'clothInsert');
 for(const v of [.025,.50,.715])tube(id('cushion-cover'),Array.from({length:28},(_,i)=>{const p=seatCushionPoint(s,.20+.60*i/27,v);p[1]+=.0022;return p;}),.00085,'clothBolster');
 for(const u of [.20,.80])tube(id('cushion-cover'),Array.from({length:30},(_,i)=>{const p=seatCushionPoint(s,u,.025+.690*i/29);p[1]+=.0025;return p;}),.0011,'clothInsert');
 for(const sign of [-1,1])ring(id('pivot-bushes'),.0095,.002,[x+sign*.206,.365,.302],'pickupPlastic',[0,Math.PI/2,0]);
 tube(id('stereo-harness'),[[x,.30,.295],[x+s*.08,.265,.25],[x+s*.11,.243,.16],[x+s*.07,.244,.09]],.003,'wire');box(id('stereo-harness'),[.023,.011,.030],[x+s*.07,.244,.09],'plastic',[],{},.002);
 // Cloth envelope is continuous; the light inset follows the same contour.
 surface(id('back-cover'),40,64,(u,v)=>seatBackPoint(s,u,v),'clothBolster');
 for(const u of [0,1])surface(id('back-cover'),64,10,(v,t)=>{const a=seatBackPoint(s,u,v),b=seatBackPoint(s,u,v,true);return a.map((x,i)=>lerp(x,b[i],t));},'clothBolster');
 for(const v of [0,1])surface(id('back-cover'),40,8,(u,t)=>{const a=seatBackPoint(s,u,v),b=seatBackPoint(s,u,v,true);return a.map((x,i)=>lerp(x,b[i],t));},'clothBolster');
 surface(id('back-cover'),28,36,(u,v)=>{const vv=.045+.668*v,span=.65-.12*T.MathUtils.smoothstep(v,.75,1),p=seatBackPoint(s,.5+(u-.5)*span,vv);p[2]-=.0018;return p;},'clothInsert');
 for(const v of [.045,.713])tube(id('back-cover'),Array.from({length:30},(_,i)=>{const span=.65-.12*T.MathUtils.smoothstep((v-.045)/.668,.75,1),p=seatBackPoint(s,.5+(i/29-.5)*span,v);p[2]-=.0022;return p;}),.0009,'clothBolster');
 for(const e of [-1,1])tube(id('back-cover'),Array.from({length:36},(_,i)=>{const t=i/35,p=seatBackPoint(s,.5+e*(.65-.12*T.MathUtils.smoothstep(t,.75,1))/2,.045+.668*t);p[2]-=.0022;return p;}),.0011,'clothInsert');
 surface(id('rear-cover'),34,48,(u,v)=>{const p=seatBackPoint(s,u,v,true);p[2]+=.001;return p;},'clothBolster');
 tube(id('rear-cover'),[[x-.175,.386,.352],[x,.382,.354],[x+.175,.386,.352]],.0015,'dark');
 for(const z of [-.090,.29])tube(id('listing'),[[x-.17,.317,z],[x+.17,.317,z]],.0015,'zinc');
 for(const dx of [-.135,.135])tube(id('listing'),[[x+dx,.39,.295],[x+dx,.80,.408]],.0013,'zinc');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;ring(id('hog-rings'),.004,.0008,[x+.17*Math.cos(a),.310,.10+.18*Math.sin(a)],'zinc',[Math.PI/2,0,0]);}
 for(const [where,dx]of [['inner',-s*.146],['outer',s*.146]]){
  const xx=x+dx;
  for(const d of [-.011,.011])box(id('track-'+where),[.003,.018,.445],[xx+d,.256,.096],'zinc',[],{},.001);
  box(id('track-'+where),[.026,.003,.445],[xx,.247,.096],'zinc',[],{},.001);
  box(id('slider-'+where),[.020,.007,.395],[xx,.269,.096],'dark',[],{},.001);
  for(const d of [-.008,.008])box(id('slider-'+where),[.003,.014,.395],[xx+d,.267,.096],'dark',[],{},.001);
  if(where==='outer')for(let i=0;i<19;i++)box(id('slider-'+where),[.004,.004,.006],[xx+s*.013,.263,-.078+i*.019],'zinc',[],{},.0005);
 }
 tube(id('adjust-handle'),[[x+s*.146,.263,-.100],[x+s*.15,.267,-.184],[x+s*.082,.268,-.203]],.004,'zinc');box(id('adjust-handle'),[.065,.016,.019],[x+s*.080,.267,-.203],'dark',[],{},.006);
 tube(id('adjust-wire'),[[x-s*.145,.265,-.05],[x-s*.09,.278,-.09],[x+s*.09,.278,-.09],[x+s*.145,.265,-.05]],.0014,'zinc');spring(id('adjust-spring'),[x+s*.163,.268,.03],.004,.062,'z',9);
 for(const [i,d]of [[0,-s*.146],[1,s*.146],[2,-s*.146],[3,s*.146]]){const z=i<2?-.091:.289;bolt(id('floor-nut-'+i),[x+d,.255,z],.007,'y','zinc');screw(id('rail-bolt-'+i),[x+d,.294,z],'y',.004);}
 for(const [k,sign]of [['recliner',s],['inner-hinge',-s]]){
  const xx=x+sign*.208;h.profile(id(k),[[.235,.31],[.345,.32],[.392,.47],[.367,.51],[.288,.405]],.010,xx,'dark');cyl(id(k),.029,.012,[xx,.365,.30],'zinc');
 }
 h.profile(id('recliner-cover'),[[.22,.304],[.375,.317],[.407,.434],[.375,.464],[.301,.393],[.233,.387]],.022,x+s*.221,'cabinVinyl');
 h.profile(id('hinge-protector'),[[.302,.368],[.402,.493],[.429,.484],[.384,.365]],.018,x+s*.216,'cabinVinyl');box(id('recliner-knob'),[.026,.032,.065],[x+s*.248,.396,.267],'dashTop',[.12,0,0],{},.010);
 for(let i=0;i<2;i++){const sign=i?s:-s;cyl(id('pivot-'+i),.008,.035,[x+sign*.206,.365,.302],'zinc');cyl(id('pivot-'+i),.012,.003,[x+sign*.228,.365,.302],'zinc');screw(id('cover-screw-'+i),[x+s*.235,.339+i*.084,.244+i*.115],'x',.0025);}
 for(const [speaker,dx]of [['inner',-s*.065],['outer',s*.065]]){
  const key='speaker-'+speaker+'-',p=[x+dx,.949,.439];
  ring(id(key+'basket'),.038,.002,[p[0],p[1],p[2]],'dark',[0,0,0]);cyl(id(key+'basket'),.038,.018,[p[0],p[1],p[2]+.012],'dark',[Math.PI/2,0,0],.025);
  surface(id(key+'cone'),36,10,(u,v)=>{const a=u*Math.PI*2,r=.007+v*.029;return[p[0]+r*Math.cos(a),p[1]+r*Math.sin(a),p[2]-.001+.008*(1-v)];},'carpet');cyl(id(key+'cone'),.009,.004,[p[0],p[1],p[2]+.005],'dark',[Math.PI/2,0,0]);
  cyl(id(key+'magnet'),.024,.017,[p[0],p[1],p[2]+.030],'dark',[Math.PI/2,0,0]);
  tube(id(key+'leads'),[[p[0],p[1]-.029,p[2]+.020],[p[0]+dx*.3,.72,.422],[x+s*.12,.38,.342]],.001,'wireWhite');
  // Small perforations on a broad cloth face, not raised rectangular grilles.
  for(let row=0;row<10;row++)for(let col=0;col<7;col++){const xx=dx+(col-3)*.006,yy=.913+row*.008,v=(yy-.365)/.670,u=(xx/(.148)+1)/2;if((col-3)**2/13+(row-4.5)**2/28>1)continue;const q=seatBackPoint(s,u,v);q[2]-=.0011;cyl(id(key+'cone'),.0008,.0004,q,'clothBolster',[Math.PI/2,0,0]);}
 }
}
function buildBelt(h,s){
 const {box,cyl,tube,bolt}=h,{frame,belt}=cabinTools(h),side=s>0?'left':'right',id=k=>'in-belt-'+side+'-'+k,x=s*.64;
 box(id('retractor'),[.059,.080,.067],[x,.326,.453],'dark',[],{},.005);cyl(id('retractor'),.027,.051,[x,.326,.453],'zinc');
 belt(id('webbing'),[[x,.333,.445],[x,.688,.435],[s*.624,.986,.432],[s*.607,.942,.419],[s*.605,.67,.405],[s*.606,.365,.271]],.043);
 frame(id('guide'),.059,.039,.007,.008,[s*.622,.975,.430],'zinc');box(id('guide-cover'),[.070,.048,.021],[s*.622,.985,.451],'cabinVinyl',[],{},.012);
 frame(id('latchplate'),.049,.051,.007,.003,[s*.605,.605,.404],'zinc');
 const bx=s*.153;box(id('buckle'),[.042,.055,.036],[bx,.406,.230],'plastic',[-.25,0,0],{},.007);box(id('button'),[.030,.009,.025],[bx,.435,.230],'red',[-.25,0,0],{},.002);
 tube(id('buckle-stalk'),[[s*.195,.266,.264],[s*.177,.329,.257],[bx,.391,.235]],.010,'plastic');
 box(id('retractor-cover'),[.077,.117,.079],[x,.339,.469],'cabinVinyl',[],{},.008);
 tube(id('warning-wire'),[[bx,.398,.245],[s*.181,.303,.284],[s*.16,.254,.189],[s*.14,.27,.13]],.0016,'wire');
 for(const [i,p]of [[0,[s*.622,.981,.455]],[1,[x,.304,.483]],[2,[s*.613,.267,.256]],[3,[s*.193,.267,.264]]])bolt(id('bolt-'+i),p,.008,i===3?'y':'z','zinc');
}
function buildDash(h){
 const {box,surface,tube,cyl}=h,{frame,screw}=cabinTools(h),id=k=>'in-dash-'+k;
 // Rounded pad top, swept cowl edge and shallow vertical face. The centre
 // and passenger openings remain empty for their real components.
 surface(id('pad'),64,24,(u,v)=>{const x=(u-.5)*1.36;return[x,.785+.018*Math.sin(v*Math.PI)-.011*(Math.abs(x)/.68)**5,lerp(-.666,-.474,v)+.025*(Math.abs(x)/.68)**4];},'dashTop');
 surface(id('pad'),64,12,(u,v)=>{const x=(u-.5)*1.36;return[x,lerp(.783,.752,v)-.011*(Math.abs(x)/.68)**5,-.471+.010*Math.sin(v*Math.PI/2)+.025*(Math.abs(x)/.68)**4];},'cabinVinyl');
 surface(id('pad'),48,12,(u,v)=>{const x=(u-.5)*1.36;return[x,lerp(.785,.641,v)-.011*(Math.abs(x)/.68)**5,-.666+.025*(Math.abs(x)/.68)**4];},'dashTop');
 surface(id('pad'),32,12,(u,v)=>[-.574+.466*u,.618+.013*Math.sin(v*Math.PI),-.535+.067*v],'cabinVinyl');
 frame(id('accessory-panel'),.052,.181,.013,.006,[.096,.824,-.356],'consoleTrim');
 box(id('accessory-panel'),[.028,.063,.005],[.096,.784,-.357],'consoleTrim',[],{},.002);
 box(id('accessory-panel'),[.028,.066,.005],[.096,.854,-.357],'consoleTrim',[],{option:'rearDefrost',value:false},.002);
 box(id('defrost-switch'),[.026,.048,.030],[.096,.854,-.361],'plastic',[],{},.003);box(id('defrost-switch'),[.022,.032,.007],[.096,.855,-.342],'dashTop',[.1,0,0],{},.002);
 frame(id('column-filler'),.180,.069,.016,.012,[.345,.709,-.407],'cabinVinyl');
 for(let i=0;i<6;i++){const x=-.61+i*.244;box(id('mount-unuts'),[.015,.004,.013],[x,.777,-.651],'plastic',[],{},.002);box(id('mount-unuts'),[.015,.004,.013],[x,.771,-.651],'plastic',[],{},.002);}
 // Passenger map pocket has a recessed black upper mouth and raised lip.
 frame(id('pad'),.462,.137,.026,.048,[-.341,.687,-.493],'cabinVinyl');
 box(id('pocket'),[.410,.093,.007],[-.341,.683,-.539],'dashTop');
 box(id('pocket'),[.410,.006,.075],[-.341,.639,-.505],'dashTop');
 for(const x of [-.545,-.137])box(id('pocket'),[.006,.093,.075],[x,.683,-.505],'dashTop');
 box(id('pocket-lip'),[.411,.047,.014],[-.341,.659,-.461],'cabinVinyl',[],{},.007);
 box(id('pad'),[.435,.058,.082],[.34,.661,-.494],'cabinVinyl',[],{},.012);
 for(const [side,s]of [['left',1],['right',-1]]){
  frame(id(side+'-end'),.096,.194,.017,.045,[s*.622,.680,-.452],'cabinVinyl');
  box(id(side+'-end'),[.094,.033,.091],[s*.622,.776,-.478],'cabinVinyl',[],{},.008);
  const x=s*.475,z=-.579;
  frame(id(side+'-grille'),.222,.083,.006,.004,[x,.804,z],'dashTop',[Math.PI/2,0,0]);
  for(let i=0;i<27;i++)box(id(side+'-grille'),[.003,.003,.069],[x-.103+i*.0079,.804,z],'dashTop',[],{},.0008);
  const oval=(u,v)=>{const a=u*Math.PI*2,r=.16+.84*v;return[x+Math.cos(a)*.098*r,.793-.025*(1-v),z+Math.sin(a)*.029*r];};surface(id(side+'-speaker-cone'),52,12,oval,'carpet');
  surface(id(side+'-speaker-basket'),52,8,(u,v)=>{const a=u*Math.PI*2;return[x+Math.cos(a)*lerp(.055,.106,v),lerp(.752,.797,v),z+Math.sin(a)*lerp(.020,.034,v)];},'dark');
  cyl(id(side+'-speaker-magnet'),.028,.026,[x,.741,z],'dark',[0,0,0]);
  box(id(side+'-speaker-plug'),[.022,.015,.012],[x+s*.076,.766,z+.025],'plastic',[],{},.002);tube(id(side+'-speaker-plug'),[[x+s*.07,.763,z+.025],[x+s*.065,.744,z+.037],[x-s*.06,.715,z+.050]],.0015,'wireWhite');
 }
 tube(id('carrier'),[[-.64,.663,-.546],[-.35,.650,-.546],[0,.650,-.546],[.35,.650,-.546],[.64,.663,-.546]],.015,'dark');
 for(const x of [-.57,-.12,.12,.55])box(id('carrier'),[.033,.110,.010],[x,.691,-.550],'dark',[],{},.002);
 box(id('lower-trim'),[.393,.015,.165],[.355,.574,-.485],'dashTop',[-.22,0,0],{},.006);
 for(let i=0;i<6;i++)screw(id('screw-'+i),[-.61+i*.244,.787,-.651],'y',.003);
}
function buildConsole(h){
 const {box,cyl,surface,tube,ring,label}=h,{frame,screw,spring}=cabinTools(h),id=k=>'in-console-'+k;
 // Open skeleton under the console trim; no filled block in the cabin.
 frame(id('skeleton'),.218,.925,.012,.024,[0,.316,.015],'plastic',[Math.PI/2,0,0]);
 for(const z of [-.34,-.04,.29,.47])box(id('skeleton'),[.210,.024,.016],[0,.325,z],'plastic',[],{},.003);
 for(const x of [-.10,.10])box(id('skeleton'),[.015,.269,.040],[x,.458,-.392],'plastic',[-.06,0,0],{},.003);
 frame(id('front'),.227,.291,.025,.097,[0,.573,-.428],'cabinVinyl');
 // Separate trim bars create three real apertures, without overlaying a solid plate.
 for(const x of [-.095,.095])box(id('face'),[.014,.276,.005],[x,.576,-.374],'consoleTrim');
 for(const [y,ht]of [[.717,.016],[.645,.010],[.573,.010],[.477,.017]])box(id('face'),[.185,ht,.005],[0,y,-.374],'consoleTrim');
 for(const x of [-.13,.13])h.profile(id('shift-surround'),[[-.366,.426],[-.299,.415],[.133,.415],[.211,.449],[.211,.320],[-.366,.320]],.027,x,'cabinVinyl');
 for(const z of [-.348,.154])box(id('shift-surround'),[.265,.080,.024],[0,.370,z],'cabinVinyl',[],{},.008);
 // A continuous plate with only the actual boot, tray and switch apertures.
 const plate=new T.Shape();plate.moveTo(-.1145,-.144);plate.lineTo(.1145,-.144);plate.lineTo(.1145,.354);plate.lineTo(-.1145,.354);plate.closePath();
 for(const [x,z,w,d]of [[-.015,-.179,.096,.120],[-.070,-.040,.052,.059],[.070,-.040,.052,.059],[-.053,.054,.038,.046],[.053,.054,.038,.046]]){const q=new T.Path();q.moveTo(x-w/2,-z-d/2);q.lineTo(x-w/2,-z+d/2);q.lineTo(x+w/2,-z+d/2);q.lineTo(x+w/2,-z-d/2);q.closePath();plate.holes.push(q);}
 const plateGeo=new T.ExtrudeGeometry(plate,{depth:.005,bevelEnabled:false});plateGeo.rotateX(-Math.PI/2);h.add(id('shift-plate'),plateGeo,'consoleTrim',[0,.420,0]);
 frame(id('boot-ring'),.096,.120,.008,.003,[-.015,.428,-.179],'dark',[Math.PI/2,0,0]);
 surface(id('boot'),56,20,(u,v)=>{const a=u*Math.PI*2,r=lerp(.058,.011,v)*(1+.05*Math.sin(v*Math.PI*5+Math.cos(a*3)));return[-.015+Math.cos(a)*r*.78,.431+.108*v+.006*Math.sin(a*3)*Math.sin(v*Math.PI),-.179+Math.sin(a)*r];},'vinyl');
 cyl(id('lever'),.008,.124,[-.015,.527,-.179],'zinc',[.08,0,0]);cyl(id('lever'),.024,.043,[-.015,.396,-.179],'dark',[0,0,Math.PI/2]);
 // Tapered grip, not a ball. Horizontal cap retains the four-speed identity.
 const knob=new T.LatheGeometry([[.0,.017],[.007,.023],[.039,.027],[.062,.024],[.072,.018]].map(([y,r])=>new T.Vector2(r,y)),40);h.add(id('knob'),knob,'cabinVinyl',[-.015,.557,-.179]);
 cyl(id('knob'),.018,.002,[-.015,.630,-.179],'consoleTrim',[0,0,0]);label(id('knob'),'R  1  3\n   2  4',[.028,.026],[-.015,.6315,-.179],[-Math.PI/2,0,0],{background:'transparent',foreground:'#d1d0c8',font:'42px Arial',width:256,height:256});
 tube(id('knob-clip'),[[-.029,.567,-.184],[-.033,.566,-.177],[-.015,.566,-.170],[.003,.566,-.177],[-.001,.567,-.184]],.0012,'zinc');
 // Broad armrest transitions into the upright storage face, as in the brochure.
 surface(id('rear-pad'),28,32,(u,v)=>{const z=lerp(.169,.515,v),x=(u-.5)*.285;return[x,.466+.022*T.MathUtils.smoothstep(v,0,1)-.008*(2*u-1)**6,z];},'cabinVinyl');
 for(const s of [-1,1]){
  h.profile(id('rear-pad'),[[.166,.323],[.169,.465],[.510,.488],[.530,.789],[.628,.799],[.654,.346]],.018,s*.143,'cabinVinyl');
  // Solid shell side excludes the separately removable ECM cooling grille.
  box(id('rear-pad'),[.014,.152,.270],[s*.141,.394,.328],'cabinVinyl',[],{},.006);
 }
 surface(id('rear-pad'),28,18,(u,v)=>[(u-.5)*.285,.791+.005*Math.sin(Math.PI*v)-.005*(2*u-1)**6,.527+.106*v],'cabinVinyl');
 frame(id('rear-pad'),.291,.317,.021,.063,[0,.640,.552],'cabinVinyl');
 box(id('storage'),[.245,.249,.006],[0,.646,.623],'dashTop');
 for(const x of [-.121,.121])box(id('storage'),[.006,.249,.066],[x,.646,.594],'dashTop');
 for(const y of [.524,.769])box(id('storage'),[.245,.006,.066],[0,y,.594],'dashTop');
 box(id('storage-door'),[.245,.259,.012],[0,.642,.514],'cabinVinyl',[-.06,0,0],{},.014);
 box(id('storage-latch'),[.045,.016,.012],[0,.755,.502],'dashTop',[],{},.004);
 for(const x of [-.052,.052])box(id('storage-hinge'),[.048,.003,.022],[x,.513,.529],'zinc');tube(id('storage-hinge'),[[-.081,.513,.517],[.081,.513,.517]],.002,'zinc');
 spring(id('storage-spring'),[0,.756,.532],.003,.014,'x',5,.0006);box(id('storage-striker'),[.032,.011,.010],[0,.765,.554],'zinc',[],{},.002);
 tube(id('storage-strap'),[[.112,.716,.561],[.105,.682,.548],[.112,.650,.527]],.003,'rubber');
 frame(id('shift-seal'),.221,.490,.008,.002,[0,.417,-.105],'rubber',[Math.PI/2,0,0]);
 for(const x of [-.096,.096])for(const z of [-.29,.105]){box(id('shift-clips'),[.009,.012,.016],[x,.410,z],'zinc',[],{},.001);box(id('carpet-retainers'),[.025,.008,.016],[x*1.25,.303,z],'plastic',[],{},.002);}
 for(const [side,s]of [['left',1],['right',-1]]){box(id(side+'-carpet-support'),[.010,.037,.890],[s*.126,.313,.054],'plastic',[],{},.003);box(id(side+'-carpet-support'),[.032,.004,.890],[s*.116,.295,.054],'plastic',[],{},.002);}
 frame(id('lighter-plate'),.052,.038,.010,.003,[.063,.460,.179],'consoleTrim',[Math.PI/2,0,0]);
 cyl(id('lighter-lamp'),.003,.009,[.080,.442,.182],'chrome',[0,0,0]);cyl(id('lighter-lamp'),.004,.005,[.080,.435,.182],'plastic',[0,0,0]);
 // Cigar lighter is in the sloping forward edge of the rear console.
 ring(id('lighter-socket'),.010,.0015,[.063,.460,.179],'zinc',[Math.PI/2,0,0]);cyl(id('lighter-socket'),.011,.032,[.063,.441,.179],'zinc',[0,0,0]);
 cyl(id('lighter'),.009,.015,[.063,.461,.179],'dashTop',[0,0,0]);label(id('lighter'),'◉',[.014,.014],[.063,.469,.179],[-Math.PI/2,0,0],{background:'transparent',foreground:'#bbbdb7',font:'40px Arial'});ring(id('lighter-retainer'),.012,.0016,[.063,.425,.179],'zinc',[Math.PI/2,0,0]);
 for(const [side,s]of [['left',1],['right',-1]]){
  const x=s*.070,z=-.040;
  frame(id(side+'-ashtray'),.050,.057,.003,.015,[x,.411,z],'zinc',[Math.PI/2,0,0]);box(id(side+'-ashtray'),[.048,.003,.055],[x,.402,z],'zinc');box(id(side+'-ashtray-door'),[.052,.004,.059],[x,.427,z],'dashTop',[],{},.002);
  spring(id(side+'-ashtray-spring'),[x,.421,z+.029],.002,.013,'x',6,.0005);
  frame(id(side+'-vent'),.128,.149,.006,.006,[s*.153,.603,.574],'dashTop',[0,Math.PI/2,0]);
  for(let i=0;i<11;i++)box(id(side+'-vent'),[.006,.003,.112],[s*.153,.539+i*.012,.574],'dashTop',[],{},.0006);
  box(id('window-'+side),[.038,.018,.046],[s*.053,.431,.054],'dark',[],{},.004);box(id('window-'+side),[.029,.008,.032],[s*.053,.443,.054],'plastic',[-.10,0,0],{},.004);
  box(id('blank-'+side),[.044,.005,.052],[s*.053,.427,.054],'consoleTrim',[],{},.002);
 }
 box(id('mirror-switch'),[.052,.012,.036],[0,.435,.106],'plastic',[],{},.004);cyl(id('mirror-switch'),.010,.005,[0,.444,.106],'dark',[0,0,0]);
 const screws=[[-.096,.689,-.369],[.096,.689,-.369],[-.096,.496,-.369],[.096,.496,-.369],[-.097,.427,-.306],[.097,.427,-.306],[-.107,.427,.111],[.107,.427,.111],[-.124,.780,.558],[.124,.780,.558]];
 screws.forEach((p,i)=>screw(id('screw-'+i),p,i<4?'z':'y',.0025));
}
function buildRadio(h){
 const {box,cyl,label,tube,ring}=h,{frame,screw}=cabinTools(h),id=k=>'in-radio-'+k;
 frame(id('case'),.163,.068,.002,.128,[0,.528,-.460],'zinc');box(id('case'),[.163,.068,.003],[0,.528,-.525],'zinc');
 for(const variant of ['am','amfm','cassette','equalizer']){
  const f={option:'radio',value:variant};box(id('face'),[.162,.070,.006],[0,.528,-.374],'plastic',[],f,.003);
  label(id('face'),variant==='am'?'AM  850':'FM  98.5',[.070,.015],[0,.545,-.369],[0,0,0],{background:'#151b1c',foreground:'#c58b48',font:'42px monospace'},f);
  for(let i=0;i<5;i++)box(id('face'),[.012,.007,.004],[-.034+i*.017,.517,-.368],'plastic',[],f,.001);
  if(['cassette','equalizer'].includes(variant))box(id('face'),[.073,.007,.002],[0,.530,-.369],'dark',[],f,0);
  if(variant==='equalizer')for(let i=0;i<5;i++)box(id('face'),[.003,.012,.003],[-.031+i*.0155,.499,-.368],'zinc',[],f,0);
 }
 for(let i=0;i<2;i++){const x=i?-.066:.066;cyl(id('knob-'+i),.011,.012,[x,.531,-.361],'plastic',[Math.PI/2,0,0]);ring(id('knob-'+i),.011,.001,[x,.531,-.354],'chrome',[0,0,0]);}
 frame(id('bracket'),.178,.083,.010,.019,[0,.526,-.479],'dark');
 for(let i=0;i<4;i++)screw(id('screw-'+i),[(i%2?1:-1)*.089,i<2?.558:.498,-.378],'z',.0025);
 box(id('plugs'),[.051,.023,.020],[.036,.516,-.537],'plastic',[],{},.002);tube(id('plugs'),[[-.060,.528,-.529],[-.08,.52,-.565],[-.10,.56,-.573]],.003,'wire');
}
export function buildInteriorTrimRetainers(h,s,id){const {screw}=cabinTools(h);for(const [y,z]of [[.36,-.48],[.51,-.52],[.69,-.50],[.35,-.16],[.34,.16],[.37,.43],[.53,.48],[.70,.46],[.74,.14]]){h.cyl(id,.004,.017,[s*.752,y,z],'plastic',[0,0,Math.PI/2]);h.cyl(id,.007,.003,[s*.742,y,z],'plastic',[0,0,Math.PI/2]);}}
function buildDoor(h,s,includePanel){
 const {box,tube,cyl,surface,ring}=h,{screw}=cabinTools(h),side=s>0?'left':'right',id=k=>'in-door-'+side+'-'+k;
 if(includePanel)buildDoorTrimSkin(h,id('panel'),s);
 // Long armrest with an inclined leading pull, as shown in the 1985 SE brochure.
 box(id('armrest'),[.071,.045,.411],[s*.686,.553,.119],'cabinVinyl',[],{},.016);
 surface(id('armrest'),36,36,(u,v)=>{const a=v*Math.PI*2,y=.713-.159*u,z=-.230+.171*u;return[s*(.713-.028*Math.sin(u*Math.PI/2))+.016*Math.cos(a),y+.0168*Math.sin(a),z+.0156*Math.sin(a)];},'cabinVinyl');
 for(const u of [0,1])surface(id('armrest'),36,8,(v,t)=>{const a=v*Math.PI*2;return[s*(.713-.028*Math.sin(u*Math.PI/2))+.016*t*Math.cos(a),.713-.159*u+.0168*t*Math.sin(a),-.230+.171*u+.0156*t*Math.sin(a)];},'cabinVinyl');
 box(id('armrest-bracket'),[.023,.059,.307],[s*.732,.548,.09],'dark',[],{},.002);
 cyl(id('crank-bearing'),.025,.002,[s*.730,.576,-.342],'cabinVinyl');
 for(const z of [.03,.39]){box(id('pocket-clips'),[.008,.018,.012],[s*.733,.398,z],'zinc',[],{},.001);box(id('armrest-nuts'),[.005,.012,.012],[s*.742,.551,z-.10],'zinc',[],{},.002);}
 box(id('armrest-plug'),[.008,.018,.018],[s*.675,.592,-.155],'cabinVinyl',[],{},.003);
 box(id('upper-bracket'),[.008,.052,.035],[s*.733,.688,-.207],'zinc',[],{},.002);
 // Cup walls leave the centre recess visible from inside the car.
 box(id('handle-cup'),[.007,.080,.152],[s*.724,.692,-.376],'dark',[],{},.006);
 for(const y of [.650,.734])box(id('handle-cup'),[.017,.007,.166],[s*.714,y,-.376],'dashTop');
 for(const z of [-.458,-.294])box(id('handle-cup'),[.017,.080,.007],[s*.714,.692,z],'dashTop');
 box(id('handle'),[.014,.015,.088],[s*.704,.674,-.380],'dashTop',[],{},.005);cyl(id('handle'),.009,.012,[s*.711,.683,-.338],'zinc');
 box(id('lock-slider'),[.012,.017,.026],[s*.704,.717,-.327],'dashTop',[],{},.003);
 surface(id('water-shield'),22,16,(u,v)=>[s*.755,lerp(.309,.757,v),lerp(-.548,.496,u)],'rubber');
 // Retainers are supplied by the Body builder in the complete vehicle.
 tube(id('crank'),[[s*.722,.576,-.342],[s*.693,.576,-.342],[s*.687,.540,-.383]],.005,'dashTop');cyl(id('crank'),.014,.019,[s*.683,.538,-.387],'dashTop');cyl(id('crank'),.022,.010,[s*.720,.576,-.342],'cabinVinyl');
 ring(id('crank-clip'),.008,.001,[s*.729,.576,-.342],'zinc',[0,Math.PI/2,0]);
 surface(id('pocket'),32,16,(u,v)=>{const z=lerp(-.012,.432,u),y=lerp(.328,.465,v);return[s*(.726-.023*Math.sin(u*Math.PI)*Math.sin(v*Math.PI/2)),y,z];},'cabinVinyl');
 for(const u of [0,1])surface(id('pocket'),12,4,(v,t)=>[s*(.726-.008*t),lerp(.328,.465,v),u?.432:-.012],'cabinVinyl');
 tube(id('pocket'),Array.from({length:32},(_,i)=>[s*(.726-.025*Math.sin(i/31*Math.PI)),.465,-.012+i/31*.444]),.003,'cabinVinyl');
 for(let i=0;i<2;i++)screw(id('armrest-screw-'+i),[s*.676,.532,-.037+i*.286],'x',.003);screw(id('handle-screw'),[s*.706,.690,-.423],'x',.0025);
}
function buildTrim(h){
 const {surface,box,tube,cyl,label}=h,{frame,screw}=cabinTools(h),id=k=>'in-trim-'+k;
 for(const s of [-1,1]){const side=s>0?'left':'right';
  surface(id('bulkhead'),22,26,(u,v)=>[s*lerp(.161,.642,u),lerp(.257,.808,v),.579+.084*v], 'carpet');
  surface(id(side+'-carpet'),32,40,(u,v)=>{const x=lerp(.157,.654,u),z=lerp(-.589,.546,v);return[s*x,.226+.017*(2*u-1)**8+.139*T.MathUtils.smoothstep(-z,.390,.589),z];},'carpet');
  surface(id(side+'-underlay'),24,30,(u,v)=>{const x=lerp(.168,.645,u),z=lerp(-.585,.54,v);return[s*x,.222+.014*(2*u-1)**8+.137*T.MathUtils.smoothstep(-z,.390,.589),z];},'headlining');
  box(id(side+'-mat'),[.337,.006,.378],[s*.392,.238,-.245],'carpet',[],{},.018);
  box(id(side+'-sill'),[.094,.014,1.104],[s*.687,.323,-.015],'dashTop',[],{},.004);for(let i=0;i<4;i++)screw(id(side+'-sill-screw-'+i),[s*.687,.332,-.505+i*.327],'y',.0025);
  label(id(side+'-sill'),'FIERO',[.18,.036],[s*.687,.331,-.015],[-Math.PI/2,0,0],{background:'transparent',foreground:'#7b8281',font:'48px Arial'});
  h.mapAdded(()=>{
   surface(id(side+'-a-pillar'),44,8,(u,v)=>{const p=aPost(u);return[s*(p[0]-.020-.016*v),p[1]-.009,p[2]+.015+.014*v];},'cabinVinyl');
   surface(id(side+'-b-pillar'),20,26,(u,v)=>[s*lerp(.646,.682,u),lerp(.313,1.101,v),lerp(.494,.571,u)+.041*(1-v)],'cabinVinyl');
  },bodyPoint);
  surface(id(side+'-lower-garnish'),12,18,(u,v)=>[s*(.655+.025*u),.320+.31*v,-.555+.025*u+.046*(1-v)],'cabinVinyl');
  const x=s*.317;
  box(id(side+'-visor'),[.273,.016,.130],[x,1.114,-.196],'headlining',[0,0,s*.035],{},.011);
  tube(id(side+'-visor-pivot'),[[s*.464,1.134,-.244],[s*.460,1.116,-.249],[s*.344,1.116,-.249]],.004,'zinc');box(id(side+'-visor-pivot'),[.049,.006,.038],[s*.464,1.135,-.244],'cabinVinyl',[],{},.009);
  box(id(side+'-visor-clip'),[.018,.021,.019],[s*.187,1.124,-.243],'cabinVinyl',[],{},.004);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;screw(id(side+'-visor-screw-'+i),[s*.464+.015*Math.cos(a),1.131,-.244+.011*Math.sin(a)],'y',.002);}
 }
 // Follow the installed roof skin, then offset down into the cabin.
 for(const mode of ['solid','glass','removed']){
  const f={option:'roof',value:mode},patch=(u0,u1,v0,v1)=>surface(id('headliner'),28,24,(u,v)=>{const p=bodyPoint(roofPoint(lerp(u0,u1,u),lerp(v0,v1,v)));p[1]-=.023;return p;},'headlining',f);
  if(mode==='solid')patch(.04,.96,.04,.96);else{patch(.04,.125,.04,.96);patch(.875,.96,.04,.96);patch(.125,.875,.04,.115);patch(.125,.875,.895,.96);}
 }
 box(id('vanity'),[.131,.003,.064],[-.317,1.103,-.196],'chrome',[],{},.005);
 box(id('mirror'),[.195,.061,.019],[0,1.030,-.387],'dashTop',[-.14,0,0],{},.012);box(id('mirror'),[.181,.048,.002],[0,1.030,-.376],'chrome',[-.14,0,0],{},.009);
 tube(id('mirror-stem'),[[0,1.031,-.398],[0,1.054,-.425],[0,1.074,-.428]],.006,'dark');box(id('mirror-button'),[.024,.030,.006],[0,1.074,-.432],'zinc',[-.66,0,0],{},.003);
}
function buildSteering(h){
 const {box,cyl,tube,ring,label,surface}=h,{screw,spring}=cabinTools(h),id=k=>'in-steering-'+k,centre=new T.Vector3(.345,.720,-.186),tilt=cabinNominal.steeringAngle*Math.PI/180;
 const at=p=>new T.Vector3(...p).applyAxisAngle(new T.Vector3(1,0,0),tilt).add(centre).toArray();
 for(const mode of ['formula','leather']){
  const f={option:'steeringWheel',value:mode},mat=mode==='leather'?'dashTop':'cabinVinyl';ring(id('rim'),.169,.013,centre.toArray(),mat,[tilt,0,0],f);
  for(const angle of [-Math.PI/2,Math.PI/2,Math.PI]){
   const a=[Math.sin(angle)*.041,Math.cos(angle)*.041,0],b=[Math.sin(angle)*.158,Math.cos(angle)*.158,0];
   surface(id('rim'),20,8,(u,v)=>at([lerp(a[0],b[0],u)+(v-.5)*.038*Math.cos(angle),lerp(a[1],b[1],u)-(v-.5)*.038*Math.sin(angle),-.008+.010*Math.sin(u*Math.PI)]),'alloy',f);
  }
 }
 cyl(id('horn'),.043,.019,at([0,0,.016]),'plastic',[Math.PI/2+tilt,0,0]);label(id('horn'),'FIERO',[.049,.013],at([0,0,.027]),[tilt,0,0],{background:'transparent',foreground:'#7e8585',font:'42px Arial'});
 ring(id('contact'),.035,.002,at([0,0,.005]),'copper',[tilt,0,0]);spring(id('contact'),at([0,0,.009]),.006,.012,'z',4,.0007);h.bolt(id('nut'),at([0,0,.009]),.009,'z','zinc');
 // Column shroud remains behind the steering wheel, not through the horn pad.
 const start=[.345,.675,-.290],end=[.345,.617,-.486];tube(id('column'),[start,end,[.35,.46,-.68],[.36,.36,-1.31]],.017,'dark');
 for(const [k,sign]of [['upper-shroud',1],['lower-shroud',-1]])surface(id(k),36,30,(u,v)=>{const a=v*Math.PI+(sign<0?Math.PI:0),p=start.map((x,i)=>lerp(x,end[i],u));return[p[0]+.046*Math.cos(a),p[1]+.038*Math.sin(a),p[2]];},'dashTop');
 tube(id('stalk'),[[.389,.679,-.304],[.48,.690,-.313],[.533,.687,-.303]],.004,'dark');box(id('stalk'),[.046,.015,.016],[.532,.687,-.303],'dashTop',[],{},.005);box(id('stalk'),[.037,.006,.004],[.53,.696,-.303],'plastic',[],{option:'cruise',value:true},.002);
 cyl(id('ignition'),.013,.028,[.294,.692,-.332],'zinc');box(id('ignition'),[.004,.002,.013],[.278,.692,-.332],'dark');
 box(id('hazard'),[.022,.009,.018],[.302,.711,-.355],'plastic',[],{},.003);
 for(let i=0;i<3;i++)screw(id('screw-'+i),[.318+i*.026,.634,-.326-i*.032],'y',.0025);
}
function buildPedals(h){
 const {box,cyl,tube}=h,{spring}=cabinTools(h),id=k=>'in-pedal-'+k;
 tube(id('clutch-arm'),[[.478,.620,-.491],[.473,.529,-.486],[.463,.291,-.467]],.009,'dark');box(id('clutch-arm'),[.058,.049,.005],[.463,.282,-.463],'dark',[-.4,0,0],{},.004);
 box(id('clutch-pad'),[.062,.054,.010],[.463,.282,-.454],'rubber',[-.4,0,0],{},.006);for(let i=0;i<5;i++)box(id('clutch-pad'),[.053,.002,.003],[.463,.263+i*.010,-.443],'rubber',[-.4,0,0],{},.001);
 cyl(id('clutch-pivot'),.007,.059,[.478,.620,-.491],'zinc');for(const x of [.465,.49])cyl(id('clutch-pivot'),.009,.011,[x,.620,-.491],'pickupPlastic');spring(id('clutch-spring'),[.501,.620,-.491],.011,.017,'x',5,.0012);
 tube(id('accelerator'),[[.231,.481,-.525],[.230,.320,-.481]],.006,'dark');box(id('accelerator'),[.035,.098,.014],[.23,.289,-.468],'rubber',[-.32,0,0],{},.006);
 for(let i=0;i<8;i++)box(id('accelerator'),[.027,.002,.003],[.23,.254+i*.011,-.455-i*.003],'rubber');
 tube(id('throttle-cable'),[[.231,.481,-.525],[.238,.494,-.562],[.206,.486,-.605],[.153,.33,-.60],[.145,.27,-.22]],.003,'wire');cyl(id('throttle-cable'),.004,.012,[.231,.481,-.525],'zinc');
}
