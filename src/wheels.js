import * as T from 'three';

// 14 x 6 Hi-Tech wheel, visually reconstructed from the 1985 brochure and
// DIY 3-3. Five broad spokes, parallel fins and a recessed machined face.
export function buildWheelFace(h,x,y,z,s){
 const {add,cyl,ring,surface,bolt}=h,id='wheels',fx=x+s*.093;
 const barrel=new T.LatheGeometry([[.168,-.076],[.176,-.076],[.180,-.069],[.176,.057],[.183,.076],[.171,.076],[.166,.059]].map(([r,a])=>new T.Vector2(r,a)),80);
 barrel.rotateZ(Math.PI/2);add(id,barrel,'wheelAlloy',[x,y,z]);
 const wheelPoint=(a,r,depth)=>[fx+s*depth,y+Math.cos(a)*r,z+Math.sin(a)*r];
 surface(id,96,16,(u,v)=>wheelPoint(u*Math.PI*2,.155+.027*v,.007+.009*Math.sin(v*Math.PI)-.013*v),'wheelAlloy');
 ring(id,.181,.0025,[fx-s*.004,y,z],'wheelAlloy');
 ring(id,.158,.002,[fx+s*.008,y,z],'wheelAlloy');
 // Individual cast members leave open windows, with recessed dark sidewalls.
 function member(points,angle){
  const shape=new T.Shape();points.forEach(([a,b],i)=>i?shape.lineTo(a,b):shape.moveTo(a,b));shape.closePath();
  const g=new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSize:.0011,bevelThickness:.001,bevelSegments:3,steps:1});
  // A shallow dish brings the spoke roots forward of the rim.
  // Cast depth is uniform across each planar machined member.
  const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)+.005);
  g.computeVertexNormals();g.rotateZ(-angle);g.rotateY(s*Math.PI/2);
  add(id,g,'wheelAlloy',[fx-s*.008,y,z],[0,0,0],{finish:'wheel'});
 }
 for(let i=0;i<5;i++){
  const a=i*Math.PI*2/5;
  member([[-.016,.039],[.016,.039],[.012,.160],[-.012,.160]],a);
  for(const offset of [.043,.073,.103]){
   const lo=offset/Math.tan(Math.PI*2/5)+.014,hi=Math.sqrt(.158**2-offset**2);
   member([[offset-.0024,lo],[offset+.0024,lo+.002],[offset+.0024,hi-.002],[offset-.0024,hi+.002]],a);
  }
 }
 cyl(id,.039,.020,[fx+s*.009,y,z],'wheelAlloy');
 cyl(id,.025,.008,[fx+s*.023,y,z],'wheelAlloy');
 ring(id,.025,.0014,[fx+s*.028,y,z],'wheelAlloy');
 // Recessed five-lug bores on the 100 mm bolt circle.
 for(let i=0;i<5;i++){
  const a=i*Math.PI*2/5+.38,py=y+Math.cos(a)*.050,pz=z+Math.sin(a)*.050;
  cyl(id,.0095,.0015,[fx-s*.003,py,pz],'dark');
  bolt(id,[fx,py,pz],.0065,'x');
 }
 const va=.77; cyl(id,.0035,.013,wheelPoint(va,.157,.013),'rubber');
}
