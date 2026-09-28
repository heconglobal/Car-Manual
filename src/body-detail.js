import * as T from 'three';
import {buildInteriorTrimRetainers} from './interior-geometry.js';
import {buildDoorOpeningWeatherstrip} from './window-seals.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {mechanicalTools} from './mechanical-geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {parts} from './data.js';
import {buildBody} from './body.js';
import {bodyParts,bodySections,bodySurfaceOwners} from './body-catalog.js';
import {sideWidth,fenderTopHeight,deckHeight} from './body-contours.js';
import {deckVentPoint} from './decklid.js';
import {roofPoint} from './sunroof.js';
import {bodyPoint} from './body-datums.js';
export function bodyMaterials(base=createMaterials()){const m={...base};for(const k of ['metal','dark','rubber','blackPaint','zinc'])m[k]=base[k].clone();m.metal.bumpScale=.00003;m.dark.bumpScale=.000025;m.zinc.bumpScale=.00002;m.rubber.bumpScale=.00003;m.blackPaint.roughness=.45;return m;}
export function createBodyDetail(){const root=new T.Group(),groups=new Map();for(const p of bodyParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'body',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3(...(bodySections.find(s=>s.id===p.section).spread||[0,0,0]))};groups.set(p.id,g);root.add(g);}const h=geometryTools(groups,bodyMaterials());
 const skins=new Map(parts.map(p=>[p.id,new T.Group()])),sh=geometryTools(skins,bodyMaterials());buildBody(sh);sh.optimize();for(const [owner]of bodySurfaceOwners)for(const m of [...skins.get(owner).children]){m.userData.partId='bd-skin-'+owner;groups.get('bd-skin-'+owner).add(m);}for(const g of skins.values())for(const m of g.children){m.geometry.dispose();m.material.dispose();}
 buildBodyHardware(h);h.optimize();correctLegacyHandedness(groups);return{root,groups};}
function tools(h){
 const {add,tube,box,ring,cyl,bolt,surface}=h,{annulus,plate,spring}=mechanicalTools(h);
 function sleeve(id,r,b,l,p,mat='zinc',axis=[0,1,0]){const m=annulus(id,r,b,l,p,mat);m.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...axis).normalize());return m;}
 function roundedPath(x0,y0,x1,y1,r=.015,Path=T.Shape){const sh=new Path();sh.moveTo(x0+r,y0);sh.lineTo(x1-r,y0);sh.quadraticCurveTo(x1,y0,x1,y0+r);sh.lineTo(x1,y1-r);sh.quadraticCurveTo(x1,y1,x1-r,y1);sh.lineTo(x0+r,y1);sh.quadraticCurveTo(x0,y1,x0,y1-r);sh.lineTo(x0,y0+r);sh.quadraticCurveTo(x0,y0,x0+r,y0);return sh;}
 function flat(id,outline,holes,y,mat='dark',height=()=>0){const sh=new T.Shape();outline.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));sh.closePath();for(const [x0,z0,x1,z1]of holes)sh.holes.push(roundedPath(x0,-z1,x1,-z0,.022,T.Path));const g=new T.ExtrudeGeometry(sh,{depth:.004,bevelEnabled:true,bevelSize:.004,bevelThickness:.002,bevelSegments:3,curveSegments:24});g.rotateX(-Math.PI/2);const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,a.getY(i)+height(a.getX(i),a.getZ(i)));g.computeVertexNormals();return add(id,g,mat,[0,y,0]);}
 function link(id,a,b,width=.030,thickness=.004,normal=[1,0,0],mat='zinc',slot=false){const va=new T.Vector3(...a),vb=new T.Vector3(...b),dir=vb.clone().sub(va),length=dir.length(),sh=roundedPath(-width/2,-length/2,width/2,length/2,width*.45);for(const y of [-length/2+width*.5,length/2-width*.5]){const p=new T.Path();p.absarc(0,y,.004,0,Math.PI*2,true);sh.holes.push(p);}if(slot&&length>.1)sh.holes.push(roundedPath(-width*.17,-length/2+width,width*.17,length/2-width,width*.13,T.Path));const g=new T.ExtrudeGeometry(sh,{depth:thickness,bevelEnabled:true,bevelSize:.0005,bevelThickness:.0005,bevelSegments:2,curveSegments:24});g.translate(0,0,-thickness/2);const n=new T.Vector3(...normal).normalize(),v=dir.normalize(),w=new T.Vector3().crossVectors(v,n).normalize();n.crossVectors(w,v).normalize();g.applyMatrix4(new T.Matrix4().makeBasis(w,v,n));return add(id,g,mat,va.add(vb).multiplyScalar(.5).toArray());}
 function latch(id,p){const [x,y,z]=p;plate(id,[[y-.022,z-.018],[y+.022,z-.018],[y+.030,z+.013],[y+.018,z+.030],[y-.022,z+.025]],[[y+.012,z+.012,.009]],.003,x-.025,'zinc');plate(id,[[y-.022,z-.018],[y+.022,z-.018],[y+.030,z+.013],[y+.018,z+.030],[y-.022,z+.025]],[[y+.012,z+.012,.009]],.003,x+.025,'zinc');box(id,[.052,.003,.043],[x,y+.026,z+.003],'zinc',[],{},.003);const sh=new T.Shape();sh.absarc(0,0,.018,.35,Math.PI*1.83,false);sh.lineTo(.009,-.006);sh.absarc(0,0,.009,-.60,.35,true);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:false,curveSegments:32});g.rotateY(Math.PI/2);add(id,g,'metal',[x-.003,y,z+.007]);cyl(id,.004,.058,[x,y,z+.007],'zinc');link(id,[x-.026,y,z+.007],[x-.026,y+.021,z-.016],.013,.003,[1,0,0],'metal');spring(id,[x+.018,y,z+.007],.007,.012,'x',5,.001,'dark');}
 function clip(id,p,axis='y'){bolt(id,p,.004,axis,'dark');const idx={x:0,y:1,z:2}[axis],q=p.slice();q[idx]-=.008;cyl(id,.0024,.014,q,'dark',axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0]);}
 function seal(id,points,r=.007){const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),true,'centripetal');const m=add(id,new T.TubeGeometry(path,180,r,10,true),'rubber');return m;}
 return{...mechanicalTools(h),sleeve,roundedPath,flat,link,latch,clip,seal};
}
export function buildBodyHardware(h){h.mapAdded(()=>{buildHood(h);buildDeck(h);for(const s of [-1,1])buildDoor(h,s);buildPanelHardware(h);},bodyPoint);}
function buildHood(h){
 const {box,cyl,tube,bolt,surface}=h,{flat,link,plate,latch,seal,sleeve}=tools(h),id=k=>'bd-hood-'+k;
 flat(id('inner'),[[-.635,-1.76],[.635,-1.76],[.635,-.645],[-.635,-.645]],[[-.35,-1.69,.35,-1.405],[-.632,-1.684,-.384,-1.376],[.384,-1.684,.632,-1.376],[-.57,-1.29,.57,-.698]],0,'dark',(x,z)=>.601+(z+1.786)/1.176*.193+.005*(1-(x/.659)**2));
 // Hinge straps sit ahead of the headlamp wells. Both hinge axes are forward.
 for(const s of [-1,1]){
  const hinge=id((s>0?'left':'right')+'-hinge'),x=s*.548;
  plate(hinge,[[.50,-1.794],[.55,-1.814],[.617,-1.767],[.603,-1.725]],[[.523,-1.778,.0045],[.586,-1.764,.0045]],.005,x,'metal');
  link(hinge,[x,.59,-1.766],[x,.644,-1.646],.035,.005,[1,0,0],'metal');cyl(hinge,.006,.055,[x,.59,-1.766],'zinc');
  for(const z of [-1.691,-1.642])bolt(id('hinge-bolts'),[x,.625+(z+1.691)*.12,z],.006);
  for(const y of [.516,.546])bolt(id('hinge-nuts'),[x+s*.012,y,-1.786],.006,'x');
 }
 // Mechanical slotted stay in the closed position; no gas cylinder.
 const x=-.576,a=[x,.588,-1.51],b=[x,.714,-.891];link(id('stay'),a,b,.032,.003,[1,0,0],'zinc',true);link(id('stay'),[x+.006,.626,-1.33],[x+.006,.720,-.868],.014,.003,[1,0,0],'metal',true);
 for(const [p,key,dy]of [[a,'stay-nuts',-.008],[b,'stay-bolts',.008]]){box(id('stay'),[.046,.005,.059],p,'zinc',[.2,0,0],{},.003);for(const dz of [-.021,.021])bolt(id(key),[p[0],p[1]+dy,p[2]+dz],.005);}
 const lp=[0,.76,-.641];latch(id('latch'),lp);for(const x of [-.040,.040])bolt(id('latch-bolts'),[x,.758,-.655],.006);
 box(id('striker'),[.084,.005,.032],[0,.801,-.640],'zinc',[],{},.003);link(id('striker'),[-.014,.801,-.641],[-.014,.770,-.641],.020,.004,[1,0,0]);link(id('striker'),[.014,.801,-.641],[.014,.770,-.641],.020,.004,[1,0,0]);tube(id('striker'),[[-.014,.770,-.641],[.014,.770,-.641]],.004,'zinc');for(const x of [-.032,.032])bolt(id('striker-nuts'),[x,.805,-.64],.006);
 tube(id('release-cable'),[[.59,.54,-.60],[.59,.69,-.632],[.46,.744,-.664],[.15,.744,-.664],[.027,.75,-.648]],.003,'rubber');cyl(id('release-cable'),.005,.024,[.037,.75,-.648],'zinc');
 const points=[[-.52,.70,-.79],[-.50,.628,-1.48],[0,.613,-1.52],[.50,.628,-1.48],[.52,.70,-.79],[0,.736,-.76]];seal(id('seal'),points,.0065);
 for(const x of [-.592,.592]){cyl(id('bumpers'),.012,.014,[x,.782,-.690],'rubber',[0,0,0]);cyl(id('bumpers'),.004,.020,[x,.766,-.690],'zinc',[0,0,0]);}
}
function buildDeck(h){
 const {box,cyl,tube,ring,bolt,surface}=h,{flat,link,plate,latch,seal,sleeve}=tools(h),id=k=>'bd-deck-'+k;
 flat(id('inner'),[[-.300,.80],[.300,.80],[.316,1.20],[.624,1.20],[.624,1.835],[-.624,1.835],[-.624,1.20],[-.316,1.20]],[[-.26,.859,.26,1.139],[-.54,1.287,.54,1.757]],0,'dark',(x,z)=>.788-(z-.774)*.028);
 for(const s of [-1,1]){
  const side=s>0?'left':'right',hinge=id(side+'-hinge'),x=s*.32;
  plate(hinge,[[.681,.739],[.76,.729],[.785,.762],[.727,.818],[.681,.810]],[[.706,.751,.0045],[.756,.763,.006]],.005,x,'metal');
  link(hinge,[x,.756,.763],[x,.784,.942],.038,.005,[1,0,0],'metal');link(hinge,[x,.756,.763],[x,.699,.80],.029,.005,[1,0,0],'metal');cyl(hinge,.006,.052,[x,.756,.763],'zinc');
  for(const z of [.872,.931])bolt(id('lid-bolts'),[x,.785,z],.006);bolt(id('body-nuts'),[x+s*.01,.706,.751],.006,'x');
  // Crossed rods have two distinct elevations and opposite hinge ends.
  const dy=s>0?0:-.014,rod=[[s*.32,.705,.803],[s*.33,.684,.774],[s*.40,.701,.714],[s*.31,.746+dy,.714],[-s*.34,.746+dy,.714],[-s*.405,.746+dy,.756],[-s*.407,.721+dy,.775]];
  tube(id(side+'-rod'),rod,.004,'blackPaint');tube(id('rod-sleeves'),[[s*.10,.746+dy,.714],[-s*.21,.746+dy,.714]],.007,'rubber');
  link(id('rod-hooks'),[-s*.404,.699+dy,.743],[-s*.404,.753+dy,.755],.024,.004,[1,0,0],'metal');cyl(id('rod-pins'),.003,.039,[-s*.405,.729+dy,.76],'zinc');
 }
 const lp=[0,.732,1.80];latch(id('latch'),lp);for(const x of [-.035,.035])bolt(id('latch-bolts'),[x,.761,1.80],.005);
 box(id('striker'),[.092,.004,.04],[0,.693,1.80],'zinc',[],{},.003);tube(id('striker'),[[-.020,.696,1.80],[-.020,.716,1.80],[.020,.716,1.80],[.020,.696,1.80]],.0038,'zinc');for(const x of [-.038,.038])bolt(id('striker-bolts'),[x,.697,1.80],.005);
 sleeve(id('lock-cylinder'),.010,.0025,.041,[0,.771,1.825],'zinc');box(id('lock-cylinder'),[.006,.003,.018],[0,.790,1.825],'metal');sleeve(id('lock-seal'),.012,.009,.002,[0,.793,1.825],'rubber');
 const ret=plate(id('lock-retainer'),[[.751,1.806],[.780,1.805],[.783,1.844],[.752,1.847]],[[.767,1.825,.010]],.002,0,'metal');ret.geometry.rotateZ(Math.PI/2);ret.geometry.translate(.767,.767,0);
 // Retainer is horizontal around the vertical barrel.
 for(const x of [-.019,.019])bolt(id('lock-screws'),[x,.764,1.825],.004);tube(id('lock-shaft'),[[0,.752,1.825],[0,.741,1.825],[0,.735,1.807]],.002,'zinc');
 seal(id('trunk-seal'),[[-.55,.76,1.55],[-.575,.755,1.67],[-.55,.750,1.80],[0,.751,1.815],[.55,.750,1.80],[.575,.755,1.67],[.55,.76,1.55],[0,.764,1.54]],.0075);
 for(const x of [-.573,.573]){cyl(id('bumpers'),.010,.014,[x,.755,1.791],'rubber',[0,0,0]);cyl(id('bumpers'),.003,.019,[x,.739,1.791],'zinc',[0,0,0]);}
 for(const s of [-1,1]){
  const side=s>0?'left':'right';
  for(const v of [.025,.986]){const a=deckVentPoint(s,.08,v,deckHeight),b=deckVentPoint(s,.92,v,deckHeight);box('bd-vent-'+side+'-retainer',[Math.abs(a[0]-b[0]),.008,.020],[(a[0]+b[0])/2,a[1]-.020,a[2]],'dark',[],{},.003);}
  for(const u of [.12,.88]){const p=deckVentPoint(s,u,.986,deckHeight),id='bd-vent-'+side+'-fasteners';cyl(id,.005,.003,[p[0],p[1]+.005,p[2]],'dark',[0,0,0]);cyl(id,.002,.018,[p[0],p[1]-.006,p[2]],'zinc',[0,0,0]);sleeve(id,.006,.0025,.002,[p[0],p[1]+.002,p[2]],'zinc');box(id,[.006,.0006,.0012],[p[0],p[1]+.0067,p[2]],'rubber',[],{},0);}
 }
}
function buildDoor(h,s){
 const {box,cyl,tube,bolt,surface,ring}=h,{plate,link,sleeve,spring,latch,seal,clip}=tools(h),side=s>0?'left':'right',id=k=>'bd-door-'+side+'-'+k,x=s*.758;
 const outline=[[.282,-.573],[.282,.477],[.37,.544],[.751,.544],[.776,-.552]],holes=[[.46,-.33,.10],[.53,.15,.13],[.70,.13,.045]];
 plate(id('inner-frame'),outline,holes,.005,s*.777,'dark');for(const y of [.291,.762])tube(id('inner-frame'),[[s*.777,y,-.548],[s*.777,y,.476]],.006,'dark');
 for(const [where,y]of [['upper',.671],['lower',.391]]){
  const body=id(where+'-body'),door=id(where+'-door'),pin=id(where+'-pin'),z=-.588;
  plate(body,[[y-.038,z-.043],[y+.038,z-.043],[y+.037,z+.012],[y-.037,z+.012]],[[y-.022,z-.025,.0045],[y+.022,z-.025,.0045]],.005,x,'metal');
  plate(door,[[y-.025,z-.004],[y+.025,z-.004],[y+.037,z+.057],[y-.037,z+.057]],[[y-.019,z+.039,.0045],[y+.019,z+.039,.0045]],.005,x+s*.019,'metal');
  for(const dy of [-.028,.028])sleeve(body,.012,.005,.015,[x+s*.010,y+dy,z+.004],'metal');sleeve(door,.012,.005,.031,[x+s*.010,y,z+.004],'metal');cyl(pin,.0047,.087,[x+s*.010,y,z+.004],'zinc',[0,0,0]);cyl(pin,.008,.004,[x+s*.010,y+.045,z+.004],'zinc',[0,0,0]);
  for(const dy of [-.022,.022]){bolt(id('hinge-bolts'),[x-s*.007,y+dy,z-.025],.006,'x');bolt(id('hinge-bolts'),[x+s*.027,y+dy,z+.039],.006,'x');}
 }
 spring(id('hinge-spring'),[x+s*.022,.386,-.535],.014,.042,[0,0,1],7,.0022,'dark');
 // Shared stamped latch shape is rotated to place the striker entry on the
 // rear door edge; these are static relationship views, not lock simulations.
 latch(id('latch'),[s*.784,.485,.520]);cyl(id('striker'),.007,.036,[s*.776,.485,.550],'zinc');sleeve(id('striker'),.018,.004,.002,[s*.755,.485,.550],'zinc',[1,0,0]);
 tube(id('handle-rod'),[[s*.835,.489,.41],[s*.817,.470,.421],[s*.804,.467,.502]],.0016,'zinc');tube(id('lock-rod'),[[s*.835,.472,.503],[s*.814,.449,.505],[s*.796,.472,.510]],.0016,'zinc');
 buildDoorOpeningWeatherstrip(h,id('seal'),s);
 buildInteriorTrimRetainers(h,s,id('trim-retainers'));
}
function buildPanelHardware(h){
 const {surface,tube,box,bolt,cyl}=h,{clip}=tools(h);
 for(const s of [-1,1]){
  const side=s>0?'left':'right';for(const [front,z]of [[true,-1.1865],[false,1.1865]]){
   const key=(front?'front':'rear'),id='bd-'+key+'-liner-'+side;
   const edge=a=>{const zz=z+.344*Math.cos(a),y=.308+.344*Math.sin(a);return[s*(sideWidth(zz,y,z,!front)-.018),y,zz];};
   surface(id,96,20,(u,v)=>{const a=u*Math.PI,p=edge(a);p[0]=s*T.MathUtils.lerp(.595,Math.abs(p[0]),v);return p;},'plastic');
   // Vertical front/rear ends continue to the lower panel; no open slot.
   for(const direction of [-1,1])surface(id,18,16,(u,v)=>{const y=T.MathUtils.lerp(.245,.308,u),zz=z+direction*.344;return[s*T.MathUtils.lerp(.595,sideWidth(zz,y,z,!front)-.018,v),y,zz];},'plastic');
   // Rolled outer fixing flange sits behind, clear of the painted wheel lip.
   surface(id,96,6,(u,v)=>{const a=u*Math.PI,p=edge(a);p[1]+=.018*v*Math.sin(a);p[2]+=.018*v*Math.cos(a);return p;},'plastic');
   // The inboard liner wall closes the view above the tire. A transverse
   // arch alone left a direct sightline to bright suspension/inner panels.
   surface(id,96,10,(u,v)=>{const a=u*Math.PI,r=.312+.052*v;return[s*.595,.307+r*Math.sin(a),z+r*Math.cos(a)];},'plastic');
   for(const a of [.16,.64,1.13,1.63,2.15,2.72])clip('bd-'+key+'-panel-fasteners-'+side,[s*.827,.307+.342*Math.sin(a),z+.342*Math.cos(a)],'x');
   for(const dz of [-.47,.39]){const zz=z+dz;clip('bd-'+key+'-panel-fasteners-'+side,[s*.72,fenderTopHeight(.72,zz,!front)-.012,zz]);}
  }
  box('bd-rocker-'+side+'-retainers',[.008,.025,1.60],[s*.775,.239,0],'dark',[],{},.003);for(let i=0;i<7;i++)clip('bd-rocker-'+side+'-retainers',[s*.789,.237,-.74+i*.247],'x');
 }
 for(const [key,z,y]of [['front',-1.789,.604],['rear',1.867,.73]]){tube('bd-'+key+'-fascia-retainers',[[-.70,y-.018,z],[-.35,y,z],[.35,y,z],[.70,y-.018,z]],.007,'dark');for(let i=0;i<8;i++)clip('bd-'+key+'-fascia-retainers',[-.65+i*.186,y+.01,z]);}
 for(const u of [.045,.955])for(const v of [.12,.50,.84]){const p=roofPoint(u,v);p[1]-=.020;bolt('bd-roof-fasteners',p,.006,'y','zinc');}
 // 1985 rear-roof figure 6-15: four side-rail bolts, six frame bolts,
 // three fuel-pocket bolts, two pillar bolts and three roof nuts.
 for(const s of [-1,1]){for(const z of [1.26,1.61])bolt('bd-clip-side-bolts',[s*.659,.748,z],.005);for(const z of [.68,.94,1.17])bolt('bd-clip-side-bolts',[s*.65,.777,z],.005);bolt('bd-clip-pillar-bolts',[s*.612,.923,.58],.005,'x');}
 for(const x of [-.43,0,.43])bolt('bd-clip-roof-nuts',[x,1.137,.49],.006);
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bolt('bd-clip-fuel-pocket-bolts',[.826,.710+Math.cos(a)*.04,.93+Math.sin(a)*.04],.004,'x');}
}
