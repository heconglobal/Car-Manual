import * as T from 'three';

// 1985 brochure and GM 22P H-8: formed roof skin, separate sail applique,
// recessed backlight. Local curves are reconstructed, not tooling coordinates.
export function buildGreenhouse(h,deckHeight){
 const {surface,tube,label}=h,lerp=T.MathUtils.lerp;
 const blend=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
 const bezier=(a,b,c,d,t)=>a.map((x,i)=>x*(1-t)**3+3*b[i]*t*(1-t)**2+3*c[i]*t*t*(1-t)+d[i]*t**3);
 const windshield=(u,v)=>{const a=2*u-1,corner=.022*Math.exp(-v*55)+.032*Math.exp(-(1-v)*55);return [a*(lerp(.773,.583,v)-corner),lerp(.817,1.145,v)+(.012+.012*v)*(1-a*a),lerp(-.612,-.118,v)-.028*(1-a*a)-.006*Math.sin(v*Math.PI)];};
 const aPost=t=>[lerp(.787,.619,t)+.003*Math.sin(t*Math.PI),lerp(.818,1.132,t)+.007*Math.sin(t*Math.PI),lerp(-.591,-.052,t)-.008*Math.sin(t*Math.PI)];
 const rail=t=>bezier([.619,1.132,-.052],[.603,1.166,.018],[.610,1.155,.409],[.623,1.136,.470],t);
 const roofPoint=(u,v)=>{const a=2*u-1;return [a*(.606+.004*Math.sin(v*Math.PI)),1.192-.028*a*a-.007*(2*v-1)**4,lerp(-.104,.488,v)+.030*a**4*(1-v)-.010*a**4*v];};
 surface('glass',48,32,windshield,'glass');
 for(const s of [-1,1]){
  const signed=p=>[s*p[0],p[1],p[2]];
  // Broad radiused A-post skins replace the old round rods.
  surface('roof',32,12,(u,v)=>{const p=blend(windshield(s>0?1:0,u),signed(aPost(u)),v);p[0]+=s*.004*Math.sin(v*Math.PI);p[1]+=.003*Math.sin(v*Math.PI);return p;});
  tube('glass',Array.from({length:32},(_,i)=>windshield(s>0?1:0,i/31)),.004,'rubber');
  surface('roof',12,8,(u,v)=>blend(blend(windshield(s>0?1:0,1),roofPoint(s>0?1:0,0),u),signed(aPost(1)),v));
  const top=u=>u<.48?aPost(u/.48):rail((u-.48)/.52);
  const side=(u,v)=>{const p=blend([.787,.814,lerp(-.591,.572,u)],top(u),v);p[0]+=.009*Math.sin(v*Math.PI)*Math.sin(u*Math.PI);return signed(p);};
  surface('glass',56,28,side,'glass',{option:'windows',value:'closed'});
  tube('glass',Array.from({length:56},(_,i)=>side(i/55,1)),.004,'rubber');
  // Rolled roof shoulders share the side-window opening and roof perimeter.
  surface('roof',36,16,(u,v)=>{const p=blend(roofPoint(s>0?1:0,u),signed(rail(u)),v);p[0]+=s*.006*Math.sin(v*Math.PI);p[1]+=.006*Math.sin(v*Math.PI);return p;});
  const sailTop=u=>bezier([.606,1.157,.488],[.674,1.143,.658],[.787,.825,1.067],[.835,deckHeight(1.181)-.019,1.181],u);
  const sail=(u,v)=>{const z=lerp(.607,1.181,u),p=blend([lerp(.813,.835,u),deckHeight(z)-.005,z],sailTop(u),v);p[0]+=.012*Math.sin(v*Math.PI)*Math.sin(u*Math.PI);p[1]+=.006*Math.sin(v*Math.PI);return signed(p);};
  surface('roof',48,32,sail);
  // Curved inner buttress returns to the recessed backlight/deck gutter.
  surface('roof',48,24,(u,v)=>{const p=blend(signed(sailTop(u)),[s*.585,deckHeight(lerp(.53,1.181,u))+.003,lerp(.53,1.181,u)],v);p[0]-=s*.016*Math.sin(v*Math.PI);p[1]+=.012*Math.sin(v*Math.PI);return p;});
  // Black B-pillar applique and curved quarter-window/sail insert.
  surface('roof',24,12,(u,v)=>{const p=blend(side(1,u),sail(0,u),v);p[0]+=s*.003*Math.sin(v*Math.PI);return p;},'blackPaint');
  const quarter=(u,v)=>{const a=lerp(.04,.60,u),bottom=sail(a,0)[1],height=sail(a,1)[1]-bottom,topY=lerp(sail(.04,.90)[1],sail(.60,.075)[1],u),topV=T.MathUtils.clamp((topY-bottom)/height,.075,1);const p=sail(a,lerp(.075,topV,v));p[0]+=s*.003;return p;};
  surface('roof',40,24,quarter,'blackPaint');
  for(const v of [0,1])tube('roof',Array.from({length:32},(_,i)=>quarter(i/31,v)),.002,'rubber');
  const badge=quarter(.70,.12);badge[0]+=s*.003;
  label('roof','SE',[.027,.012],badge,[0,s*Math.PI/2,0],{background:'transparent',foreground:'#b7b9bb',font:'bold 68px Arial'});
 }
 for(const v of [0,1])tube('glass',Array.from({length:40},(_,i)=>windshield(i/39,v)),.006,'rubber');
 surface('roof',48,12,(u,v)=>{const p=blend(windshield(u,1),roofPoint(u,0),v);p[1]+=.006*Math.sin(v*Math.PI);return p;});
 surface('roof',48,12,(u,v)=>{const p=blend(roofPoint(u,1),[(2*u-1)*.583,1.117+.009*(1-(2*u-1)**2),.529],v);p[1]+=.006*Math.sin(v*Math.PI);return p;});
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
 // Rounded backlight corners sit inside the rolled painted surround.
 const backWidth=v=>{const d=Math.min(v*.294,(1-v)*.294),r=.040;return lerp(.584,.566,v)-(d<r?r-Math.sqrt(Math.max(0,r*r-(r-d)**2)):0);};
 const backlight=(u,v)=>[(2*u-1)*backWidth(v),lerp(.823,1.117,v)+.009*(1-(2*u-1)**2)*v,lerp(.535,.525,v)];
 surface('glass',48,36,backlight,'glass');
 for(const side of [-1,1]){
  surface('roof',36,16,(u,v)=>{const a=backlight(side>0?1:0,u),b=[side*lerp(.803,.606,u),lerp(.817,1.157,u),lerp(.607,.488,u)],p=blend(a,b,v);p[2]+=.014*Math.sin(v*Math.PI);return p;});
  tube('glass',Array.from({length:36},(_,i)=>backlight(side>0?1:0,i/35)),.005,'rubber');
 }
 for(const v of [0,1])tube('glass',Array.from({length:36},(_,i)=>backlight(i/35,v)),.005,'rubber');
 for(let i=0;i<10;i++)tube('glass',[[-.55,.85+i*.026,.538],[.55,.85+i*.026,.538]],.0008,'gold',{option:'rearDefrost',value:true});
}
