import * as T from 'three';
import { buildRearClip } from './rear-clip.js';

// 1985 brochure and GM 22P H-8: formed roof skin, separate sail applique,
// recessed backlight. Local curves are reconstructed, not tooling coordinates.
export function buildGreenhouse(h,deckHeight){
 const {surface,tube}=h,lerp=T.MathUtils.lerp;
 const blend=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
 const bezier=(a,b,c,d,t)=>a.map((x,i)=>x*(1-t)**3+3*b[i]*t*(1-t)**2+3*c[i]*t*t*(1-t)+d[i]*t**3);
 const windshield=(u,v)=>{const a=2*u-1,corner=.022*Math.exp(-v*55)+.032*Math.exp(-(1-v)*55);return [a*(lerp(.773,.583,v)-corner),lerp(.817,1.145,v)+(.012+.012*v)*(1-a*a),lerp(-.612,-.118,v)-.028*(1-a*a)-.006*Math.sin(v*Math.PI)];};
 const aPost=t=>[lerp(.787,.619,t)+.003*Math.sin(t*Math.PI),lerp(.818,1.132,t)+.007*Math.sin(t*Math.PI),lerp(-.591,-.052,t)-.008*Math.sin(t*Math.PI)];
 const rail=t=>bezier([.619,1.132,-.052],[.603,1.166,.018],[.610,1.155,.409],[.623,1.136,.470],t);
 const roofPoint=(u,v)=>{const a=2*u-1;return [a*(.606+.004*Math.sin(v*Math.PI)),1.192-.028*a*a-.007*(2*v-1)**4,lerp(-.104,.488,v)+.030*a**4*(1-v)-.010*a**4*v];};
 const windowTop=u=>u<.48?aPost(u/.48):rail((u-.48)/.52);
 const sideWindow=(s,u,v)=>{const p=blend([.787,.814,lerp(-.591,.572,u)],windowTop(u),v);p[0]+=.009*Math.sin(v*Math.PI)*Math.sin(u*Math.PI);p[0]*=s;return p;};
 surface('glass',48,32,windshield,'glass');
 for(const s of [-1,1]){
  const signed=p=>[s*p[0],p[1],p[2]];
  // Broad radiused A-post skins replace the old round rods.
  surface('roof',32,12,(u,v)=>{const p=blend(windshield(s>0?1:0,u),signed(aPost(u)),v);p[0]+=s*.004*Math.sin(v*Math.PI);p[1]+=.003*Math.sin(v*Math.PI);return p;});
  tube('glass',Array.from({length:32},(_,i)=>windshield(s>0?1:0,i/31)),.004,'rubber');
  surface('roof',12,8,(u,v)=>blend(blend(windshield(s>0?1:0,1),roofPoint(s>0?1:0,0),u),signed(aPost(1)),v));
  const side=(u,v)=>sideWindow(s,u,v);
  surface('glass',56,28,side,'glass',{option:'windows',value:'closed'});
  tube('glass',Array.from({length:56},(_,i)=>side(i/55,1)),.004,'rubber');
  // Rolled roof shoulders share the side-window opening and roof perimeter.
  surface('roof',36,16,(u,v)=>{const p=blend(roofPoint(s>0?1:0,u),signed(rail(u)),v);p[0]+=s*.006*Math.sin(v*Math.PI);p[1]+=.006*Math.sin(v*Math.PI);return p;});

 }
 for(const v of [0,1])tube('glass',Array.from({length:40},(_,i)=>windshield(i/39,v)),.006,'rubber');
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
  const perimeter=[];
  for(const [cx,cy,start] of [[.175,.190,Math.PI],[.825,.190,1.5*Math.PI],[.825,.800,0],[.175,.800,.5*Math.PI]]){
   for(let i=0;i<=12;i++){const a=start+i/12*Math.PI/2;perimeter.push(roofPoint(cx+.045*Math.cos(a),cy+.070*Math.sin(a)));}
  }
  // Linear interpolation along straight edges avoids Catmull-Rom overshoot.
  const rim=new T.CurvePath();for(let i=0;i<perimeter.length;i++)rim.add(new T.LineCurve3(new T.Vector3(...perimeter[i]),new T.Vector3(...perimeter[(i+1)%perimeter.length])));
  h.add('roof',new T.TubeGeometry(rim,192,.003,6,true),'rubber',[0,0,0],[0,0,0],flags);
 }
 surface('roof',40,36,(u,v)=>{const d=Math.min(v,1-v)*.73,inset=d<.060?.037*(1-Math.sqrt(Math.max(0,1-(1-d/.060)**2))):0;const p=roofPoint(.14+inset+u*(.72-2*inset),.13+v*.73);p[1]+=.001;return p;},'glass',{option:'roof',value:'glass'});
 buildRearClip(h,deckHeight,roofPoint,sideWindow);
}
