// GM 22P H-7 (V56 luggage carrier), G-10 (pedestal spoiler), and the
// 1985 brochure. Surface sections and mounting coordinates are reconstructed.
export function buildSpoilers(h,deckHeight){
 const {surface,box,tube}=h,id='decklid';
 const rack={option:'deck',value:'rack'},wing={option:'deck',value:'wing'};
 // The carrier uses longitudinal deck slats and a small raised rear spoiler,
 // not a tubular rectangular basket or transverse cargo bars.
 for(const x of [-.48,-.24,0,.24,.48]){
  surface(id,36,10,(u,v)=>{
   const z=1.09+u*.71,a=v*2-1,end=Math.min(u*.71,(1-u)*.71),round=Math.max(0,1-end/.015);
   return [x+a*.015*Math.sqrt(1-round*round),deckHeight(z)+.011+.004*Math.sqrt(1-a*a),z];
  },'blackPaint',rack);
  for(const z of [1.14,1.67])box(id,[.024,.009,.050],[x,deckHeight(z)+.008,z],'rubber',[],rack,.004);
 }
 for(const s of [-1,1]){
  surface(id,30,16,(u,v)=>{
   const z=1.68+.17*u,y=deckHeight(z)+.009+.065*Math.sin(u*Math.PI/2);
   return [s*(.48+(v-.5)*.026),y,z];
  },'blackPaint',rack);
 }
 surface(id,56,18,(u,v)=>{const a=u*2-1;return [a*.505,.862+.009*Math.sin(v*Math.PI)-.010*a**8,1.780+.079*v-.012*a*a];},'blackPaint',rack);
 surface(id,56,12,(u,v)=>{const a=u*2-1;return [a*.505,.852-.003*Math.sin(v*Math.PI)-.010*a**8,1.780+.079*v-.012*a*a];},'blackPaint',rack);
 for(const v of [0,1])tube(id,Array.from({length:40},(_,i)=>{const a=i/39*2-1;return [a*.505,.857-.010*a**8,1.780+.079*v-.012*a*a];}),.005,'blackPaint',rack);
 // Swept, tapered pedestals with radiused edges and separate mounting feet.
 for(const s of [-1,1]){
  box(id,[.076,.009,.190],[s*.455,deckHeight(1.69)+.006,1.69],'rubber',[],wing,.018);
  surface(id,64,22,(u,v)=>{
   const a=u*Math.PI*2,z=1.695+.039*v,w=.034-.010*v,chord=.089-.018*v;
   return [s*.455+Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.48*w,deckHeight(1.69)+.010+v*.139,z+Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.48*chord];
  },'red',wing);
 }
 // Closed airfoil section, rounded leading edge and swept, lowered tips.
 const foil=(u,v,upper)=>{
  const a=u*2-1,tip=a**8,chord=.292-.026*tip;
  const half=5*.13*chord*(.2969*Math.sqrt(v)-.126*v-.3516*v*v+.2843*v**3-.1036*v**4);
  return [a*(.742-.013*(1-Math.sin(v*Math.PI))),.939-.038*tip+.007*Math.sin(v*Math.PI)+(upper?1:-1)*half,1.583-.064*tip+v*chord];
 };
 surface(id,100,56,(u,v)=>foil(u,v,true),'red',wing);
 surface(id,100,56,(u,v)=>foil(u,v,false),'red',wing);
 for(const u of [0,1])surface(id,56,6,(v,t)=>{const a=foil(u,v,false),b=foil(u,v,true);return a.map((x,i)=>x+(b[i]-x)*t);},'red',wing);
}
