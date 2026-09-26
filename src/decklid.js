import * as T from 'three';

// The 1985 raised-center lid and the removable side grilles are separate
// panels. Shapes follow supplied rear-quarter views; local heights are inferred.
export function buildDecklid(h,deckHeight){
 const {surface,tube,box,cyl}=h,lerp=T.MathUtils.lerp;
 const centreWidth=z=>.377+.021*T.MathUtils.smoothstep(z,.775,1.18);
 const lidPoint=(x,z)=>{
  const hump=.027*T.MathUtils.smoothstep(z,.765,.87)*(1-T.MathUtils.smoothstep(z,1.015,1.34));
  const across=1-T.MathUtils.smoothstep(Math.abs(x),.270,.410);
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
  tube('decklid',[lidPoint(s*.398,1.185),lidPoint(s*.650,1.185)],.0022,'rubber');
  const id=s>0?'deck-vent-left':'deck-vent-right';
  const vent=(u,v)=>{const z=lerp(.778,1.174,v),inner=centreWidth(z)+.007,outer=lerp(.558,.644,T.MathUtils.smoothstep(v,0,1));return [s*lerp(inner,outer,u),deckHeight(z)+.004,z];};
  for(const u of [0,1])tube(id,Array.from({length:24},(_,i)=>vent(u,i/23)),.006,'blackPaint');
  for(const v of [0,1])tube(id,Array.from({length:18},(_,i)=>vent(i/17,v)),.006,'blackPaint');
  // Louvres have actual spaces between them and are not laid over a red lid.
  for(let i=0;i<14;i++){
   const v=.045+i*.069,a=vent(.035,v),b=vent(.965,v),length=Math.abs(b[0]-a[0]);
   box(id,[length,.008,.017],[(a[0]+b[0])/2,a[1]-.003,a[2]],'blackPaint',[-.18,0,0],{},.003);
  }
  for(const v of [.075,.90]){const p=vent(.88,v);p[1]+=.006;cyl(id,.004,.003,p,'dark',[0,0,0]);}
 }
 for(const z of [.774,1.861])surface('decklid',48,4,(u,v)=>{const p=lidPoint((u*2-1)*(z<1?.377:.650),z);p[1]-=.006*v;return p;});
 for(const z of [.774,1.861])tube('decklid',Array.from({length:42},(_,i)=>lidPoint((2*i/41-1)*(z<1?.377:.650),z)),.0022,'rubber');
 // Small center lock at the rear lip, with no copied photographic texture.
 cyl('decklid',.009,.004,[0,deckHeight(1.825)+.014,1.825],'dark',[0,0,0]);
}
