import * as T from 'three';

export const deckCentreWidth=z=>.320+.018*T.MathUtils.smoothstep(z,.775,1.18);
// 1985–88 P37 grille: transverse vanes in a flat cast perimeter, with a
// separate screen beneath. Installed original-part photos establish the axes;
// a loose part's listing orientation must not determine its installed axes.
export function deckVentPoint(s,u,v,deckHeight){
 const z=T.MathUtils.lerp(.778,1.174,v),inner=deckCentreWidth(z)+.007,outer=T.MathUtils.lerp(.574,.644,T.MathUtils.smoothstep(v,0,1));
 return[s*T.MathUtils.lerp(inner,outer,u),deckHeight(z)+.004,z];
}
function buildDeckGrille(h,s,deckHeight){
 const id=s>0?'deck-vent-left':'deck-vent-right',at=(u,v,dy=0)=>{const p=deckVentPoint(s,u,v,deckHeight);p[1]+=dy;return p;};
 const strip=(u0,u1,v0,v1)=>{
  for(const dy of [0,-.004])h.surface(id,24,4,(u,v)=>at(T.MathUtils.lerp(u0,u1,u),T.MathUtils.lerp(v0,v1,v),dy),'windowTrim');
  for(const u of [u0,u1])h.surface(id,24,2,(a,b)=>at(u,T.MathUtils.lerp(v0,v1,a),-.004*b),'windowTrim');
  for(const v of [v0,v1])h.surface(id,24,2,(a,b)=>at(T.MathUtils.lerp(u0,u1,a),v,-.004*b),'windowTrim');
 };
 strip(0,.034,0,1);strip(.966,1,0,1);strip(.034,.966,0,.024);strip(.034,.966,.976,1);
 // Each vane has a narrow crown and a deep inclined face, not a solid bar.
 // Fourteen vanes are visible in the photographed original P37 part.
 const section=[[0,-.001],[.12,0],[.27,-.001],[.88,-.018],[.88,-.021],[.19,-.004],[0,-.003]];
 for(let i=0;i<14;i++)for(let k=0;k<section.length-1;k++)h.surface(id,40,2,(u,v)=>{
  const a=section[k],b=section[k+1],q=T.MathUtils.lerp(a[0],b[0],v),dy=T.MathUtils.lerp(a[1],b[1],v);
  return at(.035+.930*u,.026+(i+q)*.948/14,dy);
 },'windowTrim');
 // Perforated screen retains actual open cells; no painted panel under it.
 const positions=[],radius=.0052,wall=.00065;
 for(let row=0;row<45;row++)for(let col=0;col<38;col++){
  const z=.790+row*radius*1.5,x=.333+(col+(row%2)/2)*radius*Math.sqrt(3),v=(z-.778)/.396;
  if(v<.030||v>.970)continue;
  const a=at(0,v),b=at(1,v),u=(x-Math.abs(a[0]))/(Math.abs(b[0])-Math.abs(a[0]));
  if(u<.045||u>.955)continue;
  const ring=[];for(let k=0;k<6;k++){const angle=k*Math.PI/3;ring.push([[s*(x+radius*Math.sin(angle)),deckHeight(z)-.022,z+radius*Math.cos(angle)],[s*(x+(radius-wall)*Math.sin(angle)),deckHeight(z)-.022,z+(radius-wall)*Math.cos(angle)]]);}
  for(let k=0;k<6;k++){const a=ring[k],b=ring[(k+1)%6];positions.push(...a[0],...b[0],...a[1],...a[1],...b[0],...b[1]);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(positions.length/3*2),2));g.computeVertexNormals();const screen=h.add(id,g,'windowTrim');screen.material.side=T.DoubleSide;
 // Rear captive-fastener lands. The separate hardware builder supplies the
 // heads, washers and stems, so there are no overlapping duplicate fasteners.
 for(const u of [.12,.88]){const p=at(u,.986,.001);h.box(id,[.024,.003,.023],p,'windowTrim',[],{},.004);}
}

// The 1985 raised-center lid and the removable side grilles are separate
// panels. Shapes follow supplied rear-quarter views; local heights are inferred.
export function buildDecklid(h,deckHeight){
 const {surface,tube,box,cyl}=h,lerp=T.MathUtils.lerp;
 const centreWidth=deckCentreWidth;
 const lidPoint=(x,z)=>{
  const hump=.037*T.MathUtils.smoothstep(z,.765,.87)*(1-T.MathUtils.smoothstep(z,1.015,1.34));
  const across=1-T.MathUtils.smoothstep(Math.abs(x),.235,.348);
  return [x,deckHeight(z)+.010*(1-(x/.65)**2)+hump*across,z];
 };
 surface('decklid',48,34,(u,v)=>{const z=lerp(.774,1.185,v);return lidPoint((2*u-1)*centreWidth(z),z);});
 surface('decklid',64,36,(u,v)=>lidPoint((2*u-1)*.650,lerp(1.185,1.861,v)));
 // Real panel perimeter and a small return at the raised forward section.
 for(const s of [-1,1]){
  const edge=Array.from({length:34},(_,i)=>{const z=lerp(.774,1.185,i/33);return lidPoint(s*centreWidth(z),z);});
  tube('decklid',edge,.0022,'rubber');
  surface('decklid',34,6,(u,v)=>{const z=lerp(.774,1.185,u),p=lidPoint(s*centreWidth(z),z);p[1]-=.012*v;return p;});
  tube('decklid',Array.from({length:32},(_,i)=>{const p=lidPoint(s*.650,lerp(1.185,1.861,i/31));p[1]-=.001;return p;}),.0018,'rubber');
  tube('decklid',[lidPoint(s*centreWidth(1.185),1.185),lidPoint(s*.650,1.185)],.0022,'rubber');
  buildDeckGrille(h,s,deckHeight);
 }
 for(const z of [.774,1.861])surface('decklid',48,4,(u,v)=>{const p=lidPoint((u*2-1)*(z<1?centreWidth(z):.650),z);p[1]-=.006*v;return p;});
 for(const z of [.774,1.861])tube('decklid',Array.from({length:42},(_,i)=>lidPoint((2*i/41-1)*(z<1?centreWidth(z):.650),z)),.0022,'rubber');
 // Small center lock at the rear lip, with no copied photographic texture.
 cyl('decklid',.009,.004,[0,deckHeight(1.825)+.014,1.825],'dark',[0,0,0]);
}
