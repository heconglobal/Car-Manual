import * as T from 'three';
import {bodyPoint} from './body-datums.js';

// 1985 factory DIY, printed 1-4 / 1-5: welded steel space frame.
// Reconstructed formed members and panel layout; not measured body-shop data.
export function buildStructure(h){h.mapAdded(()=>buildAuthoredStructure(h),bodyPoint);}
function buildAuthoredStructure(h){
 const {box,cyl,tube,surface,bolt}=h,id='spaceframe';
 // Sweep a flanged hat section. Unlike round tubing, this has webs,
 // shoulders and flat weld flanges visible in the factory structure drawing.
 function channel(points,width=.064,depth=.036,flange=.012){
  const section=[[-width/2-flange,0],[-width/2,0],[-width/2,depth],[width/2,depth],[width/2,0],[width/2+flange,0]];
  const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
  for(let edge=0;edge<section.length-1;edge++)surface(id,Math.max(12,points.length*6),2,(u,v)=>{
   const p=path.getPoint(u),t=path.getTangent(u),normal=new T.Vector3(0,t.z,-t.y).normalize();
   const a=section[edge],b=section[edge+1];
   p.x+=a[0]+(b[0]-a[0])*v;p.addScaledVector(normal,a[1]+(b[1]-a[1])*v);return p.toArray();
  },'frame');
 }
 // Separate stamped floor pans and raised central tunnel.
 for(const s of [-1,1]){
  surface(id,22,22,(u,v)=>{const x=.17+u*.475,z=-.64+v*1.20,edge=Math.abs(u-.5)*2;return [s*x,.196+.025*edge**8+.013*Math.cos(v*Math.PI*10)**8,z];},'frame');
  channel([[s*.687,.225,-.63],[s*.687,.225,.0],[s*.687,.225,.59]],.11,.10,.018);
  // Lower sill pinch-weld flange, seat support channels and mounting pads.
  box(id,[.005,.030,1.20],[s*.746,.213,-.022],'frame',[],{},.002);
  for(const z of [-.32,.27]){
   box(id,[.455,.048,.075],[s*.409,.235,z],'frame',[],{},.008);
   for(const x of [.265,.558]){box(id,[.047,.004,.048],[s*x,.264,z],'frame');bolt(id,[s*x,.270,z],.005);}
  }
  // A-pillar, roof side rail and broad B-pillar surround the open aperture.
  channel([[s*.707,.273,-.627],[s*.728,.585,-.610],[s*.744,.781,-.598],[s*.659,.963,-.338],[s*.569,1.119,-.075]],.041,.023,.010);
  channel([[s*.569,1.119,-.075],[s*.582,1.126,.19],[s*.585,1.116,.464]],.049,.025,.010);
  channel([[s*.707,.273,.590],[s*.718,.550,.587],[s*.716,.769,.563],[s*.653,.948,.514],[s*.585,1.116,.464]],.080,.043,.016);
  // Door jamb mounting faces. No filled wall across the door/window opening.
  for(const y of [.42,.67]){box(id,[.036,.086,.038],[s*.728,y,-.599],'frame');bolt(id,[s*.751,y,-.599],.007,'x');}
  box(id,[.026,.062,.047],[s*.712,.675,.561],'frame');
  // Front upper rails and wheelhouse aprons wrap the wheel openings.
  channel([[s*.620,.585,-1.785],[s*.637,.642,-1.38],[s*.664,.700,-.96],[s*.720,.748,-.646]],.059,.031,.012);
  channel([[s*.490,.325,-1.79],[s*.490,.325,-1.32],[s*.517,.360,-.70]],.089,.061,.015);
  surface(id,64,16,(u,v)=>{
   const z=-1.78+u*1.13,d=z+1.1865;
   const low=Math.abs(d)<.357?.307+Math.sqrt(.357**2-d*d):.315;
   const high=.602+.168*u;
   return [s*(.747-.030*v),low+(Math.max(high,low+.018)-low)*v,z];
  },'frame');
  // Inner curved wheelhouse has clearance outside the tire envelope.
  surface(id,48,12,(u,v)=>{const a=u*Math.PI;return [s*(.638+v*.139),.307+Math.sin(a)*.350,-1.1865+Math.cos(a)*.350];},'frame');
  // Rear rails, wheelhouse and strut-tower shoulders, below exterior panels.
  channel([[s*.552,.353,.64],[s*.552,.353,1.18],[s*.560,.353,1.89]],.100,.100,.015);
  channel([[s*.684,.706,.57],[s*.705,.706,1.18],[s*.712,.704,1.87]],.061,.034,.011);
  surface(id,52,12,(u,v)=>{const a=u*Math.PI;return [s*(.625+v*.146),.307+Math.sin(a)*.351,1.1865+Math.cos(a)*.351];},'frame');
  surface(id,40,12,(u,v)=>{const a=u*Math.PI*2,r=.104+.039*(1-v);return [s*.628+Math.cos(a)*r,.519+.206*v,1.1865+Math.sin(a)*r];},'frame');
  const tower=new T.Shape();tower.absarc(0,0,.111,0,Math.PI*2,false);
  const opening=new T.Path();opening.absarc(0,0,.029,0,Math.PI*2,true);tower.holes.push(opening);
  for(let k=0;k<3;k++){const a=k*Math.PI*2/3,hole=new T.Path();hole.absarc(s*Math.cos(a)*.057,-Math.sin(a)*.057,.0055,0,Math.PI*2,true);tower.holes.push(hole);}
  const plate=new T.ExtrudeGeometry(tower,{depth:.003,bevelEnabled:false,curveSegments:36});plate.rotateX(-Math.PI/2);h.add(id,plate,'frame',[s*.628,.731,1.1815]);
  // Strut-mount studs and nuts belong to the shared suspension geometry.
 }
 // Tunnel sides are folded into the floor, with a radiused raised crown.
 surface(id,20,32,(u,v)=>{const a=(u-.5)*Math.PI;return [Math.sin(a)*.164,.215+Math.cos(a)*.156,-.675+v*1.31];},'frame');
 // Cowl/firewall and rear bulkhead with shallow pressings and window surround.
 box(id,[1.31,.386,.022],[0,.505,-.676],'frame',[],{},.008);
 box(id,[1.32,.573,.023],[0,.508,.567],'frame',[],{},.010);
 for(const s of [-1,1])for(const z of [-.69,.582]){
  for(let i=0;i<3;i++)box(id,[.40,.012,.009],[s*.40,.35+i*.119,z],'frame',[],{},.003);
  tube(id,[[s*.20,.34,z],[s*.40,.51,z],[s*.60,.67,z]],.004,'frame');
  tube(id,[[s*.60,.34,z],[s*.40,.51,z],[s*.20,.67,z]],.004,'frame');
 }
 box(id,[1.30,.061,.083],[0,.758,-.660],'frame',[],{},.010);
 box(id,[1.22,.043,.047],[0,.799,.545],'frame',[],{},.010);
 box(id,[1.15,.025,.038],[0,1.133,.478],'frame',[],{},.006);
 box(id,[1.12,.025,.032],[0,1.125,-.066],'frame',[],{},.006);
 // Radiator support and rear crossmember are folded sheet sections.
 for(const z of [-1.784,1.884]){
  box(id,[1.39,.114,.073],[0,.433,z],'frame',[],{},.009);
  for(const s of [-1,1])for(const x of [.22,.56]){box(id,[.115,.027,.003],[s*x,.430,z+(z<0?-.038:.038)],'dark',[],{},.004);}
  box(id,[1.42,.006,.100],[0,.490,z],'frame');
 }
 // Front support mounting flanges; coordinates are illustrative.
 for(const s of [-1,1])for(const z of [-1.52,-.70,.62,1.67]){
  box(id,[.119,.006,.092],[s*.61,z<0?.473:.471,z],'frame');
  bolt(id,[s*.61,z<0?.481:.479,z],.007);
 }
}
