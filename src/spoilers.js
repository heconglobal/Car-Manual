// GM 22P H-7 (V56 luggage carrier), G-10 (pedestal spoiler), and the
// 1985 brochure. Surface sections and mounting coordinates are reconstructed.
export function buildSpoilers(h,deckHeight){
 const {surface,box,tube}=h,id='decklid';
 const rack={option:'deck',value:'rack'},wing={option:'deck',value:'wing'};
 // The carrier uses longitudinal deck slats and a small raised rear spoiler,
 // not a tubular rectangular basket or transverse cargo bars.
 for(const x of [-.54,-.27,0,.27,.54]){
  surface(id,36,10,(u,v)=>{
   const z=1.325+u*.475,a=v*2-1,end=Math.min(u*.475,(1-u)*.475),round=Math.max(0,1-end/.015);
   return [x+a*.015*Math.sqrt(1-round*round),deckHeight(z)+.011+.004*Math.sqrt(1-a*a),z];
  },'blackPaint',rack);
  for(const z of [1.37,1.67])box(id,[.024,.009,.050],[x,deckHeight(z)+.008,z],'rubber',[],rack,.004);
 }
 // Curved integral end supports have thickness and closed side faces.
 for(const s of [-1,1]){
  const support=(u,v,edge)=>{const z=1.67+.19*u,base=deckHeight(z)+.008,top=base+.059*Math.sin(u*Math.PI/2);return [s*(.54+edge*.016),base+(top-base)*v,z];};
  for(const edge of [-1,1])surface(id,30,10,(u,v)=>support(u,v,edge),'blackPaint',rack);
  surface(id,30,8,(u,v)=>{const p=support(u,1,2*v-1);p[1]+=.004*Math.sin(v*Math.PI);return p;},'blackPaint',rack);
 }
 const rackFoil=(u,v,top)=>{const a=2*u-1;return [a*.565,(top?.862+.009*Math.sin(v*Math.PI):.842-.004*Math.sin(v*Math.PI))-.010*a**8,1.780+.079*v-.012*a*a];};
 surface(id,56,18,(u,v)=>rackFoil(u,v,true),'blackPaint',rack);
 surface(id,56,18,(u,v)=>rackFoil(u,v,false),'blackPaint',rack);
 for(const v of [0,1])surface(id,56,8,(u,t)=>{const a=rackFoil(u,v,false),b=rackFoil(u,v,true),p=a.map((x,i)=>x+(b[i]-x)*t);p[2]+=(v===0?-1:1)*.004*Math.sin(t*Math.PI);return p;},'blackPaint',rack);
 for(const u of [0,1])surface(id,24,10,(v,t)=>{const a=rackFoil(u,v,false),b=rackFoil(u,v,true),p=a.map((x,i)=>x+(b[i]-x)*t);p[0]+=(u===0?-1:1)*.004*Math.sin(t*Math.PI);return p;},'blackPaint',rack);
 // Swept, tapered pedestals with radiused edges and separate mounting feet.
 for(const s of [-1,1]){
  box(id,[.076,.009,.190],[s*.455,deckHeight(1.69)+.006,1.69],'rubber',[],wing,.018);
  surface(id,64,22,(u,v)=>{
   const a=u*Math.PI*2,z=1.695+.039*v,w=.032-.014*v,chord=.089-.009*v;
   return [s*.455+Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.80*w,deckHeight(1.69)+.010+v*.139,z+Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.78*chord];
  },'red',wing);
 }
 // Closed airfoil section, rounded leading edge and swept, lowered tips.
 const foil=(u,v,upper)=>{
  const a=u*2-1,tip=a**6,chord=.292-.041*tip;
  const half=5*.115*chord*(.2969*Math.sqrt(v)-.126*v-.3516*v*v+.2843*v**3-.1015*v**4);
  return [a*(.742-.017*(1-Math.sin(v*Math.PI))),.939-.047*tip+.007*Math.sin(v*Math.PI)+(upper?1:-1)*half,1.583-.035*tip+v*chord];
 };
 surface(id,100,56,(u,v)=>foil(u,v,true),'red',wing);
 surface(id,100,56,(u,v)=>foil(u,v,false),'red',wing);
 surface(id,100,4,(u,t)=>{const a=foil(u,1,false),b=foil(u,1,true);return a.map((x,i)=>x+(b[i]-x)*t);},'red',wing);
 for(const u of [0,1])surface(id,56,6,(v,t)=>{const a=foil(u,v,false),b=foil(u,v,true);const p=a.map((x,i)=>x+(b[i]-x)*t);p[0]+=(u===0?-1:1)*.006*Math.sin(t*Math.PI)*Math.sin(v*Math.PI);return p;},'red',wing);
}
