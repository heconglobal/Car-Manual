import * as T from 'three';
// Small electrical parts in a local frame: +Z faces the lens / user. The
// builders bake this frame into vehicle coordinates before optimization.
export function electricalTools(h){
 const {add,box,cyl,tube,surface}=h;
 function rounded(w,ht,r=.005,Path=T.Shape){const s=new Path(),x=-w/2,y=-ht/2;r=Math.min(r,w/3,ht/3);s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+ht-r);s.quadraticCurveTo(x+w,y+ht,x+w-r,y+ht);s.lineTo(x+r,y+ht);s.quadraticCurveTo(x,y+ht,x,y+ht-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
 function plate(id,w,ht,d,p,mat='plastic',holes=[],radius=.005){const s=rounded(w,ht,radius);for(const hole of holes){const path=new T.Path();path.absarc(hole[0],hole[1],hole[2],0,Math.PI*2,true);s.holes.push(path);}const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:Math.min(.0005,d/4),bevelThickness:Math.min(.0004,d/4),bevelSegments:2,curveSegments:16});g.translate(0,0,-d/2);return add(id,g,mat,p);}
 function frame(id,w,ht,wall,d,p,mat='plastic',radius=.008){const s=rounded(w,ht,radius);s.holes.push(rounded(w-2*wall,ht-2*wall,Math.max(.001,radius-wall),T.Path));const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.00035,bevelThickness:.0003,bevelSegments:2,curveSegments:16});g.translate(0,0,-d/2);return add(id,g,mat,p);}
 function sleeve(id,r,b,l,p,mat='zinc',axis='z'){const sh=new T.Shape();sh.absarc(0,0,r,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,b,0,Math.PI*2,true);sh.holes.push(hole);const g=new T.ExtrudeGeometry(sh,{depth:l,bevelEnabled:false,curveSegments:32});g.translate(0,0,-l/2);if(axis==='x')g.rotateY(Math.PI/2);if(axis==='y')g.rotateX(Math.PI/2);return add(id,g,mat,p);}
 function screw(id,p,r=.003,length=.012,axis='z'){
  const sh=new T.Shape();sh.absarc(0,0,r,0,Math.PI*2,false);const recess=new T.Path();for(let i=0;i<=72;i++){const a=-i/72*Math.PI*2,rr=r*(.40+.11*Math.cos(6*a));i?recess.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):recess.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}recess.closePath();sh.holes.push(recess);
  const g=new T.ExtrudeGeometry(sh,{depth:.002,bevelEnabled:true,bevelSize:.0002,bevelThickness:.0002,bevelSegments:2,curveSegments:24});if(axis==='x')g.rotateY(Math.PI/2);if(axis==='y')g.rotateX(-Math.PI/2);add(id,g,'zinc',p);
  const rot=axis==='z'?[Math.PI/2,0,0]:axis==='x'?[0,0,Math.PI/2]:[0,0,0],k={x:0,y:1,z:2}[axis],q=[...p];q[k]-=length/2;cyl(id,r*.50,length,q,'zinc',rot);const bottom=[...p];bottom[k]-=.0002;cyl(id,r*.52,.0004,bottom,'dark',rot);
 }
 function bulb(id,p,type='2057'){
  const big=['2057','1156'].includes(type),r=big?.013:type==='906'?.0075:type==='70'?.0032:.005,base=big?.015:type==='906'?.011:.008;
  const profile=[[0,base+.027*(big?1:.53)],[r*.65,base+.024*(big?1:.53)],[r,.014*(big?1:.6)+base],[r*.85,base+.003],[r*.50,base],[r*.48,base-.002]].reverse().map(([a,b])=>new T.Vector2(a,b));
  const g=new T.LatheGeometry(profile,32);g.rotateX(Math.PI/2);add(id,g,'bulbGlass',p);
  // Lathe's axis above is +Y -> +Z; the clear envelope projects toward lens.
  if(big){cyl(id,.0075,base,[p[0],p[1],p[2]+base/2],'zinc',[Math.PI/2,0,0]);for(const s of[-1,1])cyl(id,.0013,.003,[p[0]+s*.0075,p[1],p[2]+(type==='2057'?(s===1?.004:.010):.005)],'zinc');cyl(id,.0068,.002,[p[0],p[1],p[2]-.001],'phenolic',[Math.PI/2,0,0]);for(const dx of(type==='2057'?[-.003,.003]:[0]))cyl(id,.0018,.001,[p[0]+dx,p[1],p[2]-.0025],'copper',[Math.PI/2,0,0]);}
  else {box(id,[r*1.4,r*.65,base],[p[0],p[1],p[2]+base/2],'bulbGlass',[],{},.001);for(const s of[-1,1])tube(id,[[p[0]+s*r*.45,p[1]-r*.35,p[2]+base],[p[0]+s*r*.45,p[1]-r*.35,p[2]],[p[0]+s*r*.45,p[1]+r*.35,p[2]],[p[0]+s*r*.45,p[1]+r*.35,p[2]+base]],.00025,'zinc');}
  const z=p[2]+base+(big?.012:.006),filaments=type==='2057'?[-.002,.002]:[0];
  for(const dy of filaments){tube(id,[[p[0]-r*.25,p[1]+dy,p[2]+base],[p[0]-r*.48,p[1]+dy,z],[p[0]+r*.48,p[1]+dy,z],[p[0]+r*.25,p[1]+dy,p[2]+base]],.0003,'zinc');tube(id,Array.from({length:33},(_,i)=>[p[0]-r*.43+r*.86*i/32,p[1]+dy+Math.sin(i/32*Math.PI*12)*.00035,z+Math.cos(i/32*Math.PI*12)*.00035]),.00012,'metal');}
 }
 function socket(id,p,dual=true,wedge=false){const r=wedge?.0085:.013;sleeve(id,r,wedge?.004:.0078,.017,p,'plastic');h.ring(id,r+.001,.0012,[p[0],p[1],p[2]+.007],'rubber',[0,0,0]);for(const s of[-1,1])box(id,[.006,.003,.004],[p[0]+s*r,p[1],p[2]+.004],'plastic',[],{},.001);for(let i=0;i<(wedge?2:dual?3:2);i++)tube(id,[[p[0]-.004+i*.004,p[1],p[2]-.008],[p[0]-.004+i*.004,p[1]-.015,p[2]-.025],[p[0]+.025,p[1]-.018+i*.004,p[2]-.030]],.0011,i===0?'wire':'wireTan');}
 function lens(id,w,ht,p,mat='clearLens',grid=true){plate(id,w,ht,.002,p,mat,[],.008);if(grid){const nx=Math.max(4,Math.round(w/.008)),ny=Math.max(2,Math.round(ht/.009));for(let i=1;i<nx;i++)box(id,[.00065,ht-.008,.001],[p[0]-w/2+i*w/nx,p[1],p[2]-.0014],mat,[],{},.0002);for(let i=1;i<ny;i++)box(id,[w-.008,.00065,.001],[p[0],p[1]-ht/2+i*ht/ny,p[2]-.0014],mat,[],{},.0002);}}
 function bowl(id,w,ht,depth,p,mat='chrome',hole=.009){surface(id,48,10,(u,v)=>{const a=u*Math.PI*2,co=Math.cos(a),si=Math.sin(a),dx=Math.sign(co)*Math.abs(co)**.42*w/2,dy=Math.sign(si)*Math.abs(si)**.42*ht/2;return[p[0]+hole*co*(1-v)+dx*v,p[1]+hole*si*(1-v)+dy*v,p[2]-depth*(1-v*v)];},mat);}
 return{rounded,plate,frame,sleeve,screw,bulb,socket,lens,bowl};
}
export function bakeElectrical(groups,ids,map){for(const id of ids){const g=groups.get(id);for(const m of g.children){if(!m.isMesh)continue;m.updateMatrix();m.geometry.applyMatrix4(m.matrix);const p=m.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,...map(p.getX(i),p.getY(i),p.getZ(i)));p.needsUpdate=true;m.geometry.computeVertexNormals();m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.set(1,1,1);}}}
