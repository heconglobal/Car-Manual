import * as T from 'three';
import { shoulderWidth, shoulderDrop } from './body-contours.js';
import {glazingSeal} from './window-seals.js';

const lerp=T.MathUtils.lerp;
const mix=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
const bezier=(a,b,c,d,t)=>a.map((x,i)=>x*(1-t)**3+3*b[i]*t*(1-t)**2+3*c[i]*t*t*(1-t)+d[i]*t**3);

// GM 22P H-8 and supplied IMG_5460: the small framed sail applique is
// forward of a broad painted rear roof pillar. The backlight is recessed
// under the rear roof header, rather than filling the whole buttress opening.
export function buildRearClip(h,deckHeight,roofPoint,sideWindow){
 const {surface,tube,label}=h,id='rear-clip';
 const header=u=>{const a=2*u-1;return [a*.596,1.138+.026*(1-a*a),.663-.020*(1-a*a)];};
 // Continue the roof's descending tangent, with no second crown at the back.
 const roofReturn=(u,v)=>{
  const a=roofPoint(u,1),b=header(u),p=mix(a,b,v);
  const entrySlope=-.056*(b[2]-a[2])/.592,exitSlope=-.025;
  p[1]=(2*v**3-3*v*v+1)*a[1]+(v**3-2*v*v+v)*entrySlope+(-2*v**3+3*v*v)*b[1]+(v**3-v*v)*exitSlope;
  return p;
 };
 surface(id,48,18,roofReturn);
 const backWidth=v=>{const r=.035,d=Math.min(v,1-v)*.270;return lerp(.532,.514,v)-(d<r?r-Math.sqrt(Math.max(0,r*r-(r-d)**2)):0);};
 const backlight=(u,v)=>[(2*u-1)*backWidth(v),lerp(.840,1.110,v)+.005*(1-(2*u-1)**2)*v,lerp(.742,.644,v)];
 surface('rear-window',44,32,backlight,'glass');
 // Rounded header reveal, with a visible painted lip above recessed glass.
 surface(id,44,16,(u,v)=>{const a=header(u),b=backlight(u,1),p=mix(a,b,v);p[2]+=.018*Math.sin(v*Math.PI);return p;});
 surface(id,40,10,(u,v)=>mix(backlight(u,0),[(2*u-1)*.551,.827,.771],v),'blackPaint');
 glazingSeal(h,'rear-window',backlight,[0,.35,1]);
 for(const s of [-1,1]){
  const signed=p=>[s*p[0],p[1],p[2]];
  const front=v=>mix([.812,.812,.605],roofReturn(1,0),v);
  const trailing=v=>bezier([.824,deckHeight(1.115)-.011,1.115],[.819,.830,1.005],[.694,1.110,.790],[.596,1.138,.663],v);
  const skin=(u,v)=>{
   const p=mix(front(v),trailing(v),u),root=mix(front(0),trailing(0),u);
   const t=T.MathUtils.clamp((root[0]-.654)/(shoulderWidth(root[2])-.654),0,1);
   const shoulderY=deckHeight(root[2])-shoulderDrop(root[2],true)*(1-Math.sqrt(1-t*t));
   p[0]+=.004*Math.sin(u*Math.PI)*Math.sin(v*Math.PI);
   p[1]+=.002*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)+(shoulderY-root[1])*(1-v);
   // Coons boundary correction: share the crown without the old fourth-power
   // pinch. The forward post is straight and the rear return rolls onto deck.
   const edge=roofReturn(1,u),oldTop=mix(front(1),trailing(1),u);
   for(let k=0;k<3;k++)p[k]+=(edge[k]-oldTop[k])*v;
   return signed(p);
  };
  // Broad, crowned C-pillar outer skin with a horizontal shoulder at its top.
  surface(id,44,36,skin);
  // Rounded inner buttress returning into the deck gutter.
  surface(id,44,28,(u,v)=>{
   const outer=skin(1,1-u),inner=[s*lerp(.596,.586,u),lerp(1.138,.827,u),lerp(.663,.783,u)];
   const p=mix(outer,inner,v);p[0]-=s*.008*Math.sin(v*Math.PI);p[1]+=.010*Math.sin(v*Math.PI)*Math.sin(u*Math.PI);p[2]+=.013*Math.sin(v*Math.PI)*(1-u);return p;
  });
  // Side reveal connects the rear glass to the painted pillar, closing the
  // recessed window well. It no longer reads as a full-width glass wall.
  surface('backlight-filler-'+(s>0?'left':'right'),32,16,(u,v)=>{
   const a=backlight(s>0?1:0,u),b=signed([lerp(.586,.596,u),lerp(.827,1.138,u),lerp(.783,.663,u)]);
   const p=mix(a,b,v);p[2]+=.009*Math.sin(v*Math.PI);return p;
  });
  // The B-pillar strip is distinct from the small triangular sail window.
  surface(id,24,8,(u,v)=>mix(sideWindow(s,1,u),skin(0,u),v),'windowTrim');
  const windowId=s>0?'sail-left':'sail-right';
  // Rounded triangle in the local C-pillar surface coordinates. This framed
  // applique is opaque on the notchback; it does not open into the cabin.
  // Draw the rounded applique in the physical elevation, then project back
  // onto the crowned pillar. A triangle drawn in loft UV coordinates bowed
  // its rear edge; Pontiac's p12 photograph shows an essentially straight edge.
  const corners=[[.038,.055],[.052,.925],[.790,.055]].map(([u,v])=>{const p=skin(u,v);return new T.Vector2(p[2],p[1]);});
  const centre=corners.reduce((p,q)=>p.add(q),new T.Vector2()).multiplyScalar(1/3),outline=new T.Shape();
  const rounded=corners.map((p,i)=>{const a=corners[(i+2)%3],b=corners[(i+1)%3],r=i===1?.013:.009;return{p,a:p.clone().lerp(a,r/p.distanceTo(a)),b:p.clone().lerp(b,r/p.distanceTo(b))};});
  outline.moveTo(rounded[0].a.x,rounded[0].a.y);
  for(const c of rounded){outline.lineTo(c.a.x,c.a.y);outline.quadraticCurveTo(c.p.x,c.p.y,c.b.x,c.b.y);}outline.closePath();
  const points=outline.getPoints(18);
  const panelPoint=(p,scale,offset)=>{
   const target=p.clone().sub(centre).multiplyScalar(scale).add(centre);let u=.3,v=.4;
   for(let i=0;i<10;i++){
    const q=skin(u,v),a=skin(u+.0001,v),b=skin(u,v+.0001),dy=target.y-q[1],dz=target.x-q[2];
    if(Math.hypot(dy,dz)<1e-9)break;
    const uy=(a[1]-q[1])/.0001,uz=(a[2]-q[2])/.0001,vy=(b[1]-q[1])/.0001,vz=(b[2]-q[2])/.0001,d=uy*vz-uz*vy;
    u=T.MathUtils.clamp(u+(dy*vz-dz*vy)/d,0,1);v=T.MathUtils.clamp(v+(uy*dz-uz*dy)/d,0,1);
   }
   const q=skin(u,v);q[0]+=s*offset;return q;
  };
  surface(windowId,72,18,(u,v)=>panelPoint(centre.clone().lerp(outline.getPointAt(u),v),1,.006),'sailGlass');
  // Linear segments preserve the molded triangle's rounded corners without
  // a spline shooting past the closed seam and producing black spikes.
  const rim=(scale,offset,r,mat)=>{const path=new T.CurvePath(),ps=points.map(p=>new T.Vector3(...panelPoint(p,scale,offset)));for(let i=0;i<ps.length-1;i++)path.add(new T.LineCurve3(ps[i],ps[i+1]));h.add(windowId,new T.TubeGeometry(path,192,r,8,true),mat);};
  rim(1.025,.007,.004,'rubber');rim(.965,.008,.0015,'dark');
  const badgePoint=skin(.36,.13),badge=panelPoint(new T.Vector2(badgePoint[2],badgePoint[1]),1,.010);
  label(windowId,'SE',[.035,.015],badge,[0,s*Math.PI/2,0],{background:'transparent',foreground:'#c1c4c4',font:'bold 68px Arial'});
 }
 for(let i=0;i<9;i++){
  const v=.13+i*.091;
  tube('rear-window',Array.from({length:28},(_,j)=>{const p=backlight(.035+j/27*.93,v);p[2]+=.001;return p;}),.00065,'gold',{option:'rearDefrost',value:true});
 }
}
