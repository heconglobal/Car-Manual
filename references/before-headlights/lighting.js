// Factory DIY 2-28 / 2-29 and GM 22P K-17 / K-18 establish the
// cover, bezel, sealed-beam, retaining ring and first-generation actuator layout.
// Local dimensions and linkage positions remain reconstructed, not measured.
export function buildHeadlamps(h,hoodPoint){
 const {box,cyl,tube,surface}=h;
 const id='headlights',up={option:'headlights',value:true},down={option:'headlights',value:false};
 const signedPower=(n,p)=>Math.sign(n)*Math.abs(n)**p;
 const outline=(angle,w,h)=>[w/2*signedPower(Math.cos(angle),1/3),h/2*signedPower(Math.sin(angle),1/3)];
 for(const s of [-1,1]){
  const x=s*.515,cy=.753,z=-1.660;
  surface(id,14,16,(u,v)=>{const p=hoodPoint(((x+(u-.5)*.258)/.659+1)/2,(-1.685+v*.31+1.786)/1.176);p[1]+=.001;return p;},'red',down);
  box(id,[.268,.008,.318],[x,.668,-1.53],'rubber',[-.163,0,0],down,.006);

  // Hinged cover keeps the same panel size as the closed hood aperture.
  // Raising its leading edge reveals the lamp; it is not a flat pod roof.
  const coverPoint=(u,v)=>[x+(u-.5)*.258,.711+Math.sin(.46)*.318*(1-v),-1.375-Math.cos(.46)*.318*(1-v)];
  surface(id,18,24,(u,v)=>{const p=coverPoint(u,v);p[1]+=.003*Math.sin(u*Math.PI);return p;},'red',up);
  surface(id,18,12,(u,v)=>{const p=coverPoint(u,v);p[1]-=.005;return p;},'dark',up);
  for(const u of [0,1])tube(id,Array.from({length:16},(_,i)=>coverPoint(u,i/15)),.0025,'red',up);
  tube(id,[coverPoint(0,0),coverPoint(.5,0),coverPoint(1,0)],.003,'red',up);

  // Rounded bezel is an actual open frame surrounding the recessed lamp.
  surface(id,96,10,(u,v)=>{const a=u*Math.PI*2,outer=outline(a,.240,.194),inner=outline(a,.204,.146);return [x+outer[0]*(1-v)+inner[0]*v,cy+outer[1]*(1-v)+inner[1]*v,z+.014*Math.sin(v*Math.PI)];},'plastic',up);
  // Curved side cheeks descend to the rear hinge, as in DIY figure 2.
  for(const edge of [-1,1])surface(id,28,16,(u,v)=>{
   const bottom=.653+.061*u,top=.851*(1-u)+.714*u;
   return [x+edge*(.120-.005*u+.002*Math.sin(v*Math.PI)),bottom+(top-bottom)*v,z+.285*u];
  },'plastic',up);
  surface(id,24,8,(u,v)=>[x+(u-.5)*.235,.656+.058*v,z+.283*v],'plastic',up);

  // Chrome sealed-beam bowl, retaining lip, and convex patterned glass.
  surface(id,96,20,(u,v)=>{const a=u*Math.PI*2,p=outline(a,.198,.140);return [x+p[0]*v,cy+p[1]*v,z+.018+.062*(1-v*v)];},'chrome',up);
  const rim=Array.from({length:97},(_,i)=>{const p=outline(i/96*Math.PI*2,.203,.145);return [x+p[0],cy+p[1],z+.002];});
  tube(id,rim,.0022,'alloy',up);
  surface(id,96,16,(u,v)=>{const a=u*Math.PI*2,p=outline(a,.198,.140);return [x+p[0]*v,cy+p[1]*v,z-.004*(1-v*v)];},'headlampGlass',up);
  // Authored optical flutes: subtle glass relief, not opaque silver bars.
  for(let i=-11;i<=11;i++){
   const dx=i*.0082,half=.066*Math.pow(1-Math.pow(Math.abs(dx)/.099,6),1/6);
   tube(id,Array.from({length:9},(_,j)=>{const dy=-half+j/8*half*2;return [x+dx,cy+dy,z-.004*(1-Math.max((dx/.099)**2,(dy/.070)**2))-.0005];}),.00065,'headlampFlute',up);
  }
  for(let i=-3;i<=3;i++)tube(id,[[x-.09,cy+i*.017,z-.001],[x,cy+i*.017,z-.0045],[x+.09,cy+i*.017,z-.001]],.0005,'headlampFlute',up);
  // Bulb shield visible within the reflector; the lamps are unlit.
  cyl(id,.011,.023,[x,cy,z+.054],'alloy',[Math.PI/2,0,0],.008,up);
  for(const edge of [-1,1]){
   cyl(id,.0035,.002,[x+edge*.108,cy+.081,z-.001],'alloy',[Math.PI/2,0,0],.0035,up);
   box(id,[.005,.0008,.0006],[x+edge*.108,cy+.081,z-.0022],'dark',[],up);
  }

  // Fixed first-generation motor/gearcase, rear hinge and schematic crank.
  // These remain below the hood when the lamps are closed.
  const mx=x-s*.151;
  box(id,[.038,.118,.093],[mx,.545,-1.404],'metal',[],{},.016);
  cyl(id,.026,.090,[mx,.626,-1.404],'dark',[0,0,0]);
  cyl(id,.030,.010,[mx,.675,-1.404],'plastic',[0,0,0]);
  for(let k=0;k<12;k++){const a=k*Math.PI/6;box(id,[.003,.009,.003],[mx+Math.cos(a)*.029,.676,-1.404+Math.sin(a)*.029],'dark');}
  tube(id,[[x-.116,.700,-1.375],[x+.116,.700,-1.375]],.007,'metal');
  tube(id,[[mx,.580,-1.415],[x-s*.112,.680,-1.49],[x-s*.112,.713,-1.558]],.006,'metal',up);
  tube(id,[[mx,.580,-1.415],[x-s*.112,.590,-1.49],[x-s*.112,.627,-1.59]],.006,'metal',down);
 }
}
