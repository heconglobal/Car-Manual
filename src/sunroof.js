import * as T from 'three';

export const roofPoint=(u,v)=>{const a=2*u-1;return [a*(.606+.004*Math.sin(v*Math.PI)),1.192-.028*a*a-.007*(2*v-1)**4,T.MathUtils.lerp(-.104,.488,v)+.030*a**4*(1-v)-.010*a**4*v];};
export function sunroofGlassPoint(u,v){const d=Math.min(v,1-v)*.73,inset=d<.060?.037*(1-Math.sqrt(Math.max(0,1-(1-d/.060)**2))):0,p=roofPoint(.14+inset+u*(.72-2*inset),.13+v*.73);p[1]+=.001;return p;}

// Rounded rectangles in the same UV space as the painted roof aperture.
function contour(t,bounds){
 const [l,r,f,b]=bounds,rx=.045,rz=.070,q=Math.min(7,Math.floor(t*8)),a=t*8-q;
 const corners=[[r-rx,f+rz,-Math.PI/2],[r-rx,b-rz,0],[l+rx,b-rz,Math.PI/2],[l+rx,f+rz,Math.PI]];
 if(q%2){const [x,z,start]=corners[(q-1)/2];return[x+rx*Math.cos(start+a*Math.PI/2),z+rz*Math.sin(start+a*Math.PI/2)];}
 const lines=[[[l+rx,f],[r-rx,f]],[[r,f+rz],[r,b-rz]],[[r-rx,b],[l+rx,b]],[[l,b-rz],[l,f+rz]]];
 return lines[q/2][0].map((x,i)=>T.MathUtils.lerp(x,lines[q/2][1][i],a));
}

export function buildSunroof(h){
 const {surface,box,cyl,add}=h,glassFlags={option:'roof',value:'glass'};
 const point=(u,v,dy=0)=>{const p=roofPoint(u,v);p[1]+=dy;return p;};
 const annulus=(id,u,v,dy,outer,inner,height,flags,mat='rubber')=>{
  const g=new T.Shape();g.absarc(0,0,outer,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);g.holes.push(hole);
  const geo=new T.ExtrudeGeometry(g,{depth:height,bevelEnabled:false,curveSegments:24});geo.rotateX(-Math.PI/2);add(id,geo,mat,point(u,v,dy),[0,0,0],flags);
 };
 const frame=(id,outer,inner,dy,thickness,mat,flags)=>{
  for(const layer of [0,thickness])surface(id,256,2,(u,v)=>{const a=contour(u,outer),b=contour(u,inner);return point(T.MathUtils.lerp(a[0],b[0],v),T.MathUtils.lerp(a[1],b[1],v),dy-layer);},mat,flags);
  for(const edge of [outer,inner])surface(id,256,2,(u,v)=>point(...contour(u,edge),dy-v*thickness),mat,flags);
 };
 // A finite glass edge makes the removed panel inspectable from below.
 surface('sunroof-glass',40,36,(u,v)=>{const p=sunroofGlassPoint(u,v);p[1]-=.0035;return p;},'glass',glassFlags);
 for(const edge of [0,1,2,3])surface('sunroof-glass',64,2,(u,v)=>{const p=sunroofGlassPoint(edge===0?u:edge===1?1:edge===2?1-u:0,edge===0?0:edge===1?u:edge===2?1:1-u);p[1]-=v*.0035;return p;},'glass',glassFlags);
 for(const [side,u]of [['left',.72],['right',.28]]){
  const id='sunroof-hinge-'+side;
  // Formed strap follows the underside of the panel and turns into the header.
  surface(id,8,16,(a,b)=>{const v=.065+b*.145,dy=b<.38?-.012: T.MathUtils.lerp(-.012,-.007,(b-.38)/.62);return point(u+(a-.5)*.021,v,dy);},'blackPaint',glassFlags);
  for(const edge of [-1,1])surface(id,2,16,(a,b)=>{const v=.065+b*.145,dy=b<.38?-.012:T.MathUtils.lerp(-.012,-.007,(b-.38)/.62);return point(u+edge*.0105,v,dy-a*.002);},'blackPaint',glassFlags);
  annulus('sunroof-hinge-bushing-'+side,u,.184,-.006,.0085,.003,.007,glassFlags);
  cyl(id,.0025,.013,point(u,.184,-.002),'zinc',[0,0,0],.0025,glassFlags);
  cyl('sunroof-hinge-nuts',.006,.005,point(u,.184,.0035),'blackPaint',[0,0,0],.006,glassFlags);
 }
 for(const u of [.477,.523]){
  annulus('sunroof-glass-bushings',u,.819,-.006,.0065,.0023,.007,glassFlags);
  cyl('sunroof-handle-screws',.0035,.005,point(u,.819,.005),'blackPaint',[0,0,0],.0035,glassFlags);
  cyl('sunroof-handle-screws',.002,.016,point(u,.819,-.005),'zinc',[0,0,0],.002,glassFlags);
 }
 box('sunroof-glass-handle',[.074,.010,.025],point(.5,.813,-.014),'blackPaint',[],glassFlags,.003);
 // Handle is a hollow loop, with open space between its two side rails.
 for(const s of [-1,1]){
  box('sunroof-glass-handle',[.006,.011,.049],point(.5+s*.024,.854,-.027),'blackPaint',[.27,0,0],glassFlags,.002);
  cyl('sunroof-glass-handle',.004,.008,point(.5+s*.029,.821,-.022),'zinc',[0,0,Math.PI/2],.004,glassFlags);
 }
 box('sunroof-glass-handle',[.059,.010,.008],point(.5,.894,-.023),'blackPaint',[],glassFlags,.003);
 for(const value of ['glass','removed']){
  const flags={option:'roof',value};
  frame('sunroof-finish-lace',[.108,.892,.09,.902],[.14,.86,.13,.86],-.010,.005,'rubber',flags);
  frame('sunroof-headliner-retainer',[.096,.904,.076,.920],[.124,.876,.114,.88],-.018,.003,'dark',flags);
  // Stepped seal bed below the existing round contact lip; aperture stays open.
  frame('sunroof-seal',[.123,.877,.111,.879],[.139,.861,.128,.862],-.004,.006,'rubber',flags);
  surface('sunroof-air-deflector',64,6,(u,v)=>point(.16+u*.68,.088+v*.033,-.003-.008*Math.sin(u*Math.PI)-v*.006),'blackPaint',flags);
  for(const u of [.17,.83])box('sunroof-air-deflector',[.014,.008,.027],point(u,.107,-.011),'blackPaint',[],flags,.002);
  box('sunroof-latch-spacer',[.080,.008,.041],point(.5,.923,-.017),'rubber',[],flags,.002);
  // An open escutcheon surrounds, rather than intersects, the release button.
  for(const s of [-1,1])box('sunroof-latch-housing',[.010,.020,.044],point(.5+s*.030,.923,-.032),'blackPaint',[],flags,.003);
  for(const v of [.890,.956])box('sunroof-latch-housing',[.063,.016,.008],point(.5,v,-.032),'blackPaint',[],flags,.002);
  box('sunroof-release-button',[.043,.010,.023],point(.5,.927,-.039),'dark',[],flags,.003);
  for(const u of [.470,.530]){
   cyl('sunroof-latch-screws',.0035,.005,point(u,.921,-.045),'zinc',[0,0,0],.0035,flags);
   cyl('sunroof-latch-screws',.002,.024,point(u,.921,-.030),'zinc',[0,0,0],.002,flags);
  }
  for(const u of [.23,.77])for(const v of [.085,.913]){
   const id='sunroof-trim-retainers';box(id,[.018,.002,.013],point(u,v,-.024),'zinc',[],flags);
   for(const s of [-1,1])box(id,[.002,.009,.013],point(u+s*.0065,v,-.020),'zinc',[0,0,s*.18],flags);
  }
 }
}
