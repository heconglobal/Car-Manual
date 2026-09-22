import * as T from 'three';
import { shoulderWidth, shoulderDrop } from './body-contours.js';

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
 surface(id,48,18,(u,v)=>{
  const a=roofPoint(u,1),b=header(u),p=mix(a,b,v);
  const entrySlope=-.056*(b[2]-a[2])/.592,exitSlope=-.025;
  p[1]=(2*v**3-3*v*v+1)*a[1]+(v**3-2*v*v+v)*entrySlope+(-2*v**3+3*v*v)*b[1]+(v**3-v*v)*exitSlope;
  return p;
 });
 const backWidth=v=>{const r=.035,d=Math.min(v,1-v)*.242;return lerp(.532,.514,v)-(d<r?r-Math.sqrt(Math.max(0,r*r-(r-d)**2)):0);};
 const backlight=(u,v)=>[(2*u-1)*backWidth(v),lerp(.860,1.102,v)+.005*(1-(2*u-1)**2)*v,lerp(.728,.644,v)];
 surface('rear-window',44,32,backlight,'glass');
 // Rounded header reveal, with a visible painted lip above recessed glass.
 surface(id,44,16,(u,v)=>{const a=header(u),b=backlight(u,1),p=mix(a,b,v);p[2]+=.018*Math.sin(v*Math.PI);return p;});
 surface(id,40,10,(u,v)=>mix(backlight(u,0),[(2*u-1)*.551,.827,.771],v),'blackPaint');
 for(const v of [0,1])tube('rear-window',Array.from({length:44},(_,i)=>backlight(i/43,v)),.004,'rubber');
 for(const s of [-1,1]){
  const signed=p=>[s*p[0],p[1],p[2]];
  const front=v=>[lerp(.812,.613,v),lerp(.812,1.157,v),lerp(.605,.480,v)];
  const trailing=v=>bezier([.824,deckHeight(1.215)-.011,1.215],[.819,.818,1.085],[.694,1.110,.790],[.596,1.138,.663],v);
  const skin=(u,v)=>{
   const p=mix(front(v),trailing(v),u),root=mix(front(0),trailing(0),u);
   const t=T.MathUtils.clamp((root[0]-.654)/(shoulderWidth(root[2])-.654),0,1);
   const shoulderY=deckHeight(root[2])-shoulderDrop(root[2],true)*(1-Math.sqrt(1-t*t));
   p[0]+=.012*Math.sin(u*Math.PI)*Math.sin(v*Math.PI);
   p[1]+=.003*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)+(shoulderY-root[1])*(1-v)**4;
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
  surface(id,32,16,(u,v)=>{
   const a=backlight(s>0?1:0,u),b=signed([lerp(.586,.596,u),lerp(.827,1.138,u),lerp(.783,.663,u)]);
   const p=mix(a,b,v);p[2]+=.009*Math.sin(v*Math.PI);return p;
  });
  tube('rear-window',Array.from({length:32},(_,i)=>backlight(s>0?1:0,i/31)),.004,'rubber');
  // The B-pillar strip is distinct from the small triangular sail window.
  surface(id,24,8,(u,v)=>mix(sideWindow(s,1,u),skin(0,u),v),'blackPaint');
  const windowId=s>0?'sail-left':'sail-right';
  // Rounded triangle in the local C-pillar surface coordinates. This framed
  // applique is opaque on the notchback; it does not open into the cabin.
  const outline=new T.Shape();outline.moveTo(.055,.070);
  outline.quadraticCurveTo(.022,.070,.025,.120);
  outline.lineTo(.025,.862);outline.quadraticCurveTo(.025,.919,.079,.919);
  outline.quadraticCurveTo(.115,.918,.133,.864);
  outline.lineTo(.447,.111);outline.quadraticCurveTo(.471,.070,.413,.070);outline.closePath();
  const points=outline.getPoints(18),centre=new T.Vector2(.165,.365);
  const panelPoint=(p,scale,offset)=>{const uv=p.clone().sub(centre).multiplyScalar(scale).add(centre);uv.x*=lerp(1.16,1.32,uv.y);const q=skin(uv.x,uv.y);q[0]+=s*offset;return q;};
  surface(windowId,72,18,(u,v)=>panelPoint(centre.clone().lerp(outline.getPointAt(u),v),1,.006),'sailGlass');
  tube(windowId,points.map(p=>panelPoint(p,1.025,.007)),.006,'rubber');
  tube(windowId,points.map(p=>panelPoint(p,.965,.008)),.0015,'dark');
  const badge=panelPoint(new T.Vector2(.339,.116),1,.010);
  label(windowId,'SE',[.035,.015],badge,[0,s*Math.PI/2,0],{background:'transparent',foreground:'#c1c4c4',font:'bold 68px Arial'});
 }
 for(let i=0;i<9;i++){
  const v=.13+i*.091;
  tube('rear-window',Array.from({length:28},(_,j)=>{const p=backlight(.035+j/27*.93,v);p[2]+=.001;return p;}),.00065,'gold',{option:'rearDefrost',value:true});
 }
}
