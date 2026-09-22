import * as T from 'three';
import {electricalTools,bakeElectrical} from './electrical-geometry.js';
import {clusterWarnings,instrumentParts} from './instrument-catalog.js';
export const clusterDatum=[.345,.823,-.358];
export function instrumentMaterials(base){return{...base,bulbGlass:base.headlampGlass.clone(),instrumentLens:new T.MeshPhysicalMaterial({color:'#ffffff',roughness:.10,transmission:.97,thickness:.0015,ior:1.49,envMapIntensity:.25,side:T.DoubleSide}),instrumentTrim:new T.MeshStandardMaterial({color:'#686e70',roughness:.57,metalness:.18}),instrumentFace:new T.MeshStandardMaterial({color:'#171b1b',roughness:.82}),instrumentWhite:new T.MeshStandardMaterial({color:'#e0ddd0',roughness:.68}),instrumentAmber:new T.MeshStandardMaterial({color:'#d77b2c',roughness:.62}),instrumentRed:new T.MeshStandardMaterial({color:'#53241f',roughness:.56}),instrumentGreen:new T.MeshStandardMaterial({color:'#244431',roughness:.56}),instrumentBlue:new T.MeshStandardMaterial({color:'#233744',roughness:.56}),instrumentFlex:new T.MeshStandardMaterial({color:'#797444',roughness:.63})};}
export function buildInstruments(h,groups){
 const {add,box,cyl,tube,label,surface}=h,{rounded,frame,plate,sleeve,screw,bulb}=electricalTools(h),id=k=>'wr-cluster-'+k;
 const dialY=-.010,speedX=.111,tachX=-.111;
 // Separate open back shell, top cover and mounting carrier; the underside
 // relief leaves space for the steering column rather than filling the pod.
 frame(id('shell'),.413,.195,.007,.082,[0,0,-.051],'plastic',.021);
 box(id('shell'),[.411,.006,.085],[0,.093,-.045],'plastic',[],{},.008);
 for(const x of[-.112,.112])box(id('shell'),[.172,.006,.072],[x,-.091,-.048],'plastic',[],{},.005);
 frame(id('cover'),.425,.202,.004,.030,[0,0,-.095],'vinyl',.023);
 box(id('cover'),[.413,.005,.106],[0,.101,-.046],'vinyl',[],{},.008);
 for(const x of[-.212,.212])box(id('cover'),[.005,.178,.089],[x,0,-.043],'vinyl',[],{},.010);
 const trim=rounded(.401,.178,.009);
 for(const x of[speedX,tachX]){const p=new T.Path();p.absarc(x,dialY,.056,0,Math.PI*2,true);trim.holes.push(p);}
 const rectHole=(shape,x,y,w,ht)=>{shape.holes.push(new T.Path(rounded(w,ht,.0015).getPoints(8).map(p=>new T.Vector2(p.x+x,p.y+y))));};
 for(const y of[.033,-.020])rectHole(trim,0,y,.043,.037);
 for(const w of clusterWarnings)rectHole(trim,w.x,w.y,.021,.015);
 rectHole(trim,speedX,.056,.063,.014);rectHole(trim,tachX,.056,.060,.014);
 const trimGeo=new T.ExtrudeGeometry(trim,{depth:.002,bevelEnabled:true,bevelSize:.0007,bevelThickness:.0003,bevelSegments:2,curveSegments:32});add(id('bezel'),trimGeo,'instrumentTrim',[0,0,.008]);
 frame(id('bezel'),.410,.187,.004,.009,[0,0,.011],'plastic',.011);
 plate(id('lens'),.398,.176,.0015,[0,0,.020],'instrumentLens',[],.009);
 const carrier=rounded(.393,.173,.010);
 for(const x of[speedX,tachX]){const p=new T.Path();p.absarc(x,dialY,.050,0,Math.PI*2,true);carrier.holes.push(p);}
 for(const y of[.033,-.020])rectHole(carrier,0,y,.038,.030);
 const carrierGeo=new T.ExtrudeGeometry(carrier,{depth:.004,bevelEnabled:false,curveSegments:24});add(id('carrier'),carrierGeo,'plastic',[0,0,-.014]);
 frame(id('flex'),.386,.165,.015,.0006,[0,0,-.098],'instrumentFlex',.009);
 for(const x of[-.165,0,.165])box(id('flex'),[.026,.153,.0006],[x,0,-.098],'instrumentFlex',[],{},.002);
 for(const x of[-.145,.145]){frame(id('plugs'),.039,.025,.005,.030,[x,.017,-.119],'plastic',.003);for(let i=0;i<5;i++)box(id('flex'),[.003,.016,.0003],[x-.010+i*.005,.017,-.0975],'copper');}
 for(const [x,y]of[[-.193,.073],[.193,.073],[-.193,-.072],[.193,-.072],[0,.080]]){sleeve(id('shell'),.006,.0025,.015,[x,y,-.018],'plastic');screw(id('mounts'),[x,y,.014],.0035,.023);}
 function text(k,txt,w,ht,p,color='#dddacb'){label(id(k),txt,[w,ht],p,[0,0,0],{width:256,height:64,background:'transparent',foreground:color,font:'bold 48px Arial'});}
 function disc(k,x,y,r,z,mat='instrumentFace'){cyl(id(k),r,.001,[x,y,z],mat,[Math.PI/2,0,0]);}
 function tick(k,x,y,r,a,length=.005,mat='instrumentWhite',z=.004){tube(id(k),[[x-Math.sin(a)*r,y+Math.cos(a)*r,z],[x-Math.sin(a)*(r-length),y+Math.cos(a)*(r-length),z]],.00045,mat);}
 function pointer(k,x,y,length,a,z=.009){const sh=new T.Shape();sh.moveTo(-.0012,-.008);sh.lineTo(.0012,-.008);sh.lineTo(.00045,length);sh.lineTo(-.00045,length);sh.closePath();const geo=new T.ExtrudeGeometry(sh,{depth:.0008,bevelEnabled:false});geo.rotateZ(a);add(id(k),geo,'instrumentAmber',[x,y,z]);cyl(id(k),.0034,.0018,[x,y,z+.001],'plastic',[Math.PI/2,0,0]);}
 function casing(k,x,y,r=.046){sleeve(id(k),r,r-.003,.034,[x,y,-.043],'zinc');disc(k,x,y,r,-.061,'instrumentFlex');for(const dx of[-.021,.021]){box(id(k),[.004,.009,.008],[x+dx,y-.031,-.067],'zinc');}}
 for(const [kind,x,max]of[['speed',speedX,85],['tach',tachX,6]]){
  disc(kind+'-face',x,dialY,.055,-.002);const n=kind==='speed'?17:12;
  for(let i=0;i<=n;i++){const a=(-135+i/n*270)*Math.PI/180;tick(kind+'-face',x,dialY,.050,a,i%2===0?.006:.0035);if(i%2===0||i===n){const v=kind==='speed'?i*5:i/2;text(kind+'-face',String(v),.010,.006,[x-Math.sin(a)*.040,dialY+Math.cos(a)*.040,.004]);}}
  if(kind==='speed')for(let n=20;n<=140;n+=20){const a=(-135+n/140*270)*Math.PI/180;text('speed-face',String(n),.008,.0048,[x-Math.sin(a)*.029,dialY+Math.cos(a)*.029,.004],'#a6aa9f');}
  text(kind+'-face',kind==='speed'?'MPH':'R.P.M.',.025,.006,[x,dialY+.016,.004]);text(kind+'-face',kind==='speed'?'km/h':'× 1000',.025,.005,[x,dialY+.007,.004]);
  pointer(kind+'-pointer',x,dialY,.043,-135*Math.PI/180);casing(kind+'-unit',x,dialY);
 }
 // Odometer and trip displays use individual drum faces in an open carrier.
 function counter(key,x,y,digits){frame(id(key),digits*.009+.007,.013,.0018,.008,[x,y,.001],'plastic',.0015);for(let i=0;i<digits;i++){const xx=x+(i-(digits-1)/2)*.009;box(id(key),[.008,.010,.007],[xx,y,0],'instrumentFace',[],{},.001);text(key,'0',.0065,.008,[xx,y,.0042]);}}
 counter('odometer',speedX,.056,6);counter('trip',speedX,-.056,4);
 cyl(id('trip-reset'),.003,.030,[speedX,-.079,.005],'zinc',[Math.PI/2,0,0]);cyl(id('trip-reset'),.005,.008,[speedX,-.079,.024],'plastic',[Math.PI/2,0,0]);
 plate(id('tach-face'),.060,.014,.001,[tachX,.056,.001],'instrumentFace',[],.002);
 // Early oil-pressure scale is inside the tach's lower sector.
 const oilY=-.042;disc('oil-face',tachX,oilY,.022,.005);
 for(let i=0;i<=8;i++){const a=(-65+i/8*130)*Math.PI/180;tick('oil-face',tachX,oilY-.008,.023,a,i%4===0?.004:.0025,'instrumentWhite',.006);if(i%4===0)text('oil-face',String(i*10),.007,.0045,[tachX-Math.sin(a)*.027,oilY-.008+Math.cos(a)*.027,.006]);}
 pointer('oil-pointer',tachX,oilY-.008,.020,-65*Math.PI/180,.010);casing('oil-unit',tachX,oilY,.020);
 for(const [kind,y,labels]of[['temperature',.033,['100','220','260']],['fuel',-.020,['E','½','F']]]){
  plate(id(kind+'-face'),.044,.038,.001,[0,y,-.001],'instrumentFace',[],.002);
  for(let i=0;i<9;i++){const a=(-68+i/8*136)*Math.PI/180;tick(kind+'-face',0,y-.010,.019,a,i%4===0?.004:.0025);}
  for(let i=0;i<3;i++){const a=(-68+i*68)*Math.PI/180;text(kind+'-face',labels[i],kind==='fuel'?.006:.009,.005,[-Math.sin(a)*.019,y-.010+Math.cos(a)*.020,.006]);}
  text(kind+'-face',kind==='fuel'?'UNLEADED':'°F',.025,.0045,[0,y+.012,.006]);pointer(kind+'-pointer',0,y-.010,.015,-68*Math.PI/180);casing(kind+'-unit',0,y,.017);
 }
 for(const w of clusterWarnings){
  const mat={red:'instrumentRed',green:'instrumentGreen',blue:'instrumentBlue',amber:'instrumentAmber'}[w.color];
  plate(id('warning-'+w.key),.021,.015,.001,[w.x,w.y,.005],mat,[],.0015);
  for(const [i,line]of w.text.split('\n').entries())text('warning-'+w.key,line,.017,w.text.includes('\n')?.0045:.0055,[w.x,w.y+(w.text.includes('\n')?.0025-i*.005:0),.006],'#b6afa0');
  sleeve(id('shell'),.010,.007,.030,[w.x,w.y,-.018],'plastic');
  sleeve(id('bulb-'+w.key),.008,.0045,.006,[w.x,w.y,-.039],'plastic');bulb(id('bulb-'+w.key),[w.x,w.y,-.040],'194');
 }
 for(const [x,y]of[[-.158,.027],[-.069,-.057],[0,.073],[.069,-.057],[.158,.027]]){sleeve(id('illumination'),.008,.0045,.006,[x,y,-.084],'plastic');bulb(id('illumination'),[x,y,-.085],'194');}
 // Rigid installation tilt; final vehicle-frame conversion gives true LHD.
 const a=-.12,c=Math.cos(a),s=Math.sin(a),p=clusterDatum;
 bakeElectrical(groups,instrumentParts.map(p=>p.id),(x,y,z)=>[p[0]+x,p[1]+y*c-z*s,p[2]+y*s+z*c]);
}
