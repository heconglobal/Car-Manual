import * as T from 'three';
import { parts } from './data.js';

// Schematic teaching geometry. Dimensions and clearances are not service data.
export function createVehicle() {
 const root = new T.Group();
 const groups = new Map();
 const mats = {
  red: new T.MeshStandardMaterial({ color: '#ae3026', metalness:.48, roughness:.3 }),
  dark: new T.MeshStandardMaterial({ color:'#20292b', metalness:.35, roughness:.5 }),
  metal: new T.MeshStandardMaterial({ color:'#9ca5a5', metalness:.78, roughness:.34 }),
  alloy: new T.MeshStandardMaterial({ color:'#cad2d2', metalness:.9, roughness:.22 }),
  rubber: new T.MeshStandardMaterial({ color:'#202224', roughness:.95 }),
  glass: new T.MeshStandardMaterial({ color:'#364f59', metalness:.35, roughness:.16, transparent:true, opacity:.72, side:T.DoubleSide }),
  interior: new T.MeshStandardMaterial({ color:'#615c53', roughness:.92 }),
  blue: new T.MeshStandardMaterial({ color:'#3d8ca0', metalness:.45, roughness:.4 }),
  amber: new T.MeshStandardMaterial({ color:'#c6984e', metalness:.45, roughness:.45 }),
  white: new T.MeshStandardMaterial({ color:'#e0e6d9', emissive:'#c9dcba', emissiveIntensity:.3 }),
  lamp: new T.MeshStandardMaterial({ color:'#9f211d', emissive:'#b81e17', emissiveIntensity:.3 }),
  wire: new T.MeshStandardMaterial({ color:'#d2aa49', roughness:.65 }),
 };
 for (const part of parts) { const g = new T.Group(); g.name = part.id; g.userData = { partId:part.id, system:part.system, spread:new T.Vector3(0,.2,0) }; root.add(g); groups.set(part.id,g); }
 function mesh(id, geometry, material, pos=[0,0,0], rot=[0,0,0]) {
  const m = new T.Mesh(geometry, mats[material].clone()); m.position.set(...pos); m.rotation.set(...rot); m.castShadow=true; m.receiveShadow=true; m.userData.partId=id;
  m.userData.original={opacity:m.material.opacity, transparent:m.material.transparent, color:m.material.color.clone()}; groups.get(id).add(m); return m;
 }
 const box=(id,size,pos,mat='metal',rot)=>mesh(id,new T.BoxGeometry(...size),mat,pos,rot);
 const cyl=(id,r,l,pos,mat='metal',rot=[0,0,Math.PI/2],r2=r)=>mesh(id,new T.CylinderGeometry(r,r2,l,24),mat,pos,rot);
 const tube=(id,points,r=.02,mat='metal')=>mesh(id,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,8,false),mat);
 function panel(id, points, width, x=0,mat='red') {
  const shape=new T.Shape(); points.forEach(([z,y],i)=>i?shape.lineTo(z,y):shape.moveTo(z,y)); shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:width,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2,steps:1});
  geo.rotateY(-Math.PI/2); geo.translate(x+width/2,0,0); return mesh(id,geo,mat);
 }
 function spring(id,x,z,low,high,r=.095) {
  const points=[];for(let i=0;i<=160;i++){const a=i/160*Math.PI*14;points.push([x+Math.cos(a)*r,low+(high-low)*i/160,z+Math.sin(a)*r]);}
  tube(id,points,.014,'dark'); cyl(id,.03,high-low+.12,[x,(low+high)/2,z],'metal',[0,0,0]);
 }
 // Coordinates: front -Z, driver left +X. Overall envelope is illustrative.
 box('spaceframe',[1.4,.10,2.25],[0,.35,.03],'dark');
 for(const x of [-.67,.67]) {box('spaceframe',[.08,.16,3.45],[x,.46,0],'metal');box('spaceframe',[.06,.43,.07],[x,.76,.61],'dark');}
 box('spaceframe',[1.4,.08,.10],[0,.55,-1.42],'metal');box('spaceframe',[1.4,.08,.10],[0,.55,1.43],'metal');
 panel('nose',[[-2.04,.44],[-2.04,.63],[-1.89,.76],[-1.73,.8],[-1.73,.48]],1.68);
 box('nose',[1.58,.047,.025],[0,.59,-2.056],'dark');
 panel('hood',[[-1.76,.805],[-.54,.94],[-.54,.89],[-1.76,.765]],1.28);
 panel('rear-fascia',[[1.76,.42],[2.04,.45],[2.04,.84],[1.76,.89]],1.68);
 box('rear-fascia',[1.66,.06,.02],[0,.59,2.054],'dark');
 function fender(id,x,z,rear=false) {
  const top=rear?.91:.87;
  const points=[[z-.53,.38],[z-.53,top-.03],[z+.53,top],[z+.53,.38],[z+.37,.38]];
  for(let i=0;i<=16;i++){const a=i/16*Math.PI;points.push([z+Math.cos(a)*.37,.37+Math.sin(a)*.37]);}
  points.push([z-.53,.38]);panel(id,points,.20,x);
 }
 fender('fender-left',.74,-1.18);fender('fender-right',-.74,-1.18);
 fender('quarter-left',.74,1.19,true);fender('quarter-right',-.74,1.19,true);
 for(const [id,x] of [['door-left',.765],['door-right',-.765]]) {
  panel(id,[[-.64,.39],[-.64,.88],[-.43,.93],[.58,.92],[.64,.84],[.64,.39]],.105,x);
  box(id,[.014,.035,1.22],[x+Math.sign(x)*.065,.59,0],'dark');
  box(id,[.016,.032,.13],[x+Math.sign(x)*.068,.84,.40],'dark');
  box(id,[.11,.08,.16],[x+Math.sign(x)*.10,.94,-.48],'red');
 }
 panel('roof',[[-.12,1.26],[.44,1.26],[.47,1.30],[-.13,1.30]],1.28);
 for(const x of [-.625,.625]) {
  tube('roof',[[x,.91,-.58],[x*.89,1.27,-.13]],.028,'red');
  panel('roof',[[.41,1.28],[.56,1.26],[1.02,.92],[.63,.91]],.09,x);
  tube('roof',[[x,.91,-.58],[x, .93,.65]],.019,'dark');
 }
 box('glass',[1.15,.018,.61],[0,1.085,-.335],'glass',[-.68,0,0]);
 box('glass',[1.16,.33,.018],[0,1.09,.49],'glass');
 for(const x of [-.64,.64])panel('glass',[[-.52,.945],[-.11,1.245],[.40,1.245],[.52,.945]],.009,x,'glass');
 panel('decklid',[[.65,.92],[1.78,.90],[1.78,.945],[.65,.965]],1.27);
 for(const x of [-.50,.50])for(let i=0;i<8;i++)box('decklid',[.20,.012,.026],[x,.971,.76+i*.038],'dark');
 // Engine castings and intake. V shape visible with body hidden.
 box('engine-block',[.54,.35,.43],[.16,.64,1.12],'dark');
 for(const z of [.96,1.29]) {
  box('heads',[.65,.14,.19],[.16,.85,z],'metal',[z<1.1?-.30:.30,0,0]);
  box('heads',[.66,.055,.18],[.16,.94,z],'red');
  for(let i=0;i<6;i++)box('heads',[.012,.015,.16],[-.10+i*.10,.975,z],'metal');
 }
 box('intake',[.48,.105,.29],[.15,1.055,1.12],'red');
 for(let i=0;i<5;i++)box('intake',[.025,.012,.25],[-.02+i*.075,1.115,1.12],'alloy');
 for(const x of [-.04,.16,.36])for(const z of [.95,1.3])tube('intake',[[x,.94,z],[x,1.04,z],[x,1.05,1.12]],.027,'metal');
 box('oil-pan',[.46,.12,.36],[.16,.39,1.12],'metal');
 cyl('air-cleaner',.165,.14,[.57,.84,.70],'dark',[0,0,0]);
 cyl('air-filter',.146,.105,[.57,.96,.70],'amber',[0,0,0]);
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2;cyl('air-filter',.003,.10,[.57+Math.cos(a)*.146,.96,.70+Math.sin(a)*.146],'white',[0,0,0]);}
 cyl('air-lid',.17,.023,[.57,1.027,.70],'dark',[0,0,0]);
 cyl('air-lid',.019,.025,[.57,1.051,.70],'metal',[0,0,0]);
 tube('intake-duct',[[.55,.91,.71],[.40,.99,.77],[.16,1.045,.91]],.065,'rubber');
 box('gearbox',[.36,.34,.46],[-.34,.65,1.13],'metal');
 for(let i=0;i<6;i++)box('gearbox',[.38,.015,.47],[-.34,.52+i*.051,1.13],'alloy');
 cyl('clutch',.22,.09,[-.105,.65,1.13],'metal');
 cyl('clutch',.17,.025,[-.17,.65,1.13],'dark');
 cyl('axles',.027,1.38,[0,.38,1.19],'metal');
 for(const x of [-.6,.6]) {cyl('axles',.069,.14,[x,.38,1.19],'rubber');for(let i=0;i<5;i++)cyl('axles',.075,.013,[x-.05+i*.025,.38,1.19],'dark');}
 tube('shift-linkage',[[0,.46,.1],[-.12,.48,.5],[-.38,.56,.78],[-.43,.76,1.12]],.014,'amber');
 // Structural and suspension assemblies.
 for(const x of [-.52,.52])box('cradle',[.09,.095,1.1],[x,.31,1.05],'dark');
 for(const z of [.52,1.55])box('cradle',[1.13,.095,.09],[0,.31,z],'dark');
 for(const x of [-1,1]) {
  for(const z of [-1.18,1.19]) {
   const id=z<0?'front-arms':'rear-arms';
   tube(id,[[x*.36,.32,z-.22],[x*.73,.35,z],[x*.36,.32,z+.22]],.025,'metal');
   if(z<0)tube(id,[[x*.42,.60,z-.14],[x*.69,.60,z],[x*.42,.60,z+.14]],.018,'metal');
  }
  spring('front-springs',x*.58,-1.18,.39,.75);spring('rear-struts',x*.62,1.19,.45,.88);
 }
 cyl('steering-rack',.035,1.27,[0,.45,-1.32],'metal');
 tube('stabilizer',[[-.70,.32,-1.14],[-.62,.28,-1.47],[.62,.28,-1.47],[.70,.32,-1.14]],.016,'dark');
 // Wheels use actual mesh geometry; no raster textures.
 for(const x of [-.79,.79])for(const z of [-1.18,1.19]) {
  const y=.34;
  mesh('wheels',new T.TorusGeometry(.255,.076,14,48),'rubber',[x,y,z],[0,Math.PI/2,0]);
  cyl('wheels',.217,.145,[x,y,z],'dark');
  for(const side of [-1,1]) {
   mesh('wheels',new T.TorusGeometry(.207,.012,8,40),'alloy',[x+side*.083,y,z],[0,Math.PI/2,0]);
   for(let i=0;i<16;i++){const a=i/16*Math.PI*2;box('wheels',[.019,.145,.018],[x+side*.085,y+Math.cos(a)*.123,z+Math.sin(a)*.123],'alloy',[a,0,0]);}
   cyl('wheels',.057,.018,[x+side*.088,y,z],'alloy');
  }
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2;box('wheels',[.14,.008,.022],[x,y+Math.cos(a)*.326,z+Math.sin(a)*.326],'rubber',[a,0,0]);}
  const rotorId=z<0?'front-rotors':'rear-rotors';
  cyl(rotorId,.173,.022,[x*.91,y,z],'metal');cyl(rotorId,.052,.10,[x*.9,y,z],'alloy');
  box('calipers',[.08,.16,.09],[x*.88,y+.03,z+.13],'dark');
 }
 cyl('master-cylinder',.12,.09,[.40,.70,-.59],'dark',[Math.PI/2,0,0]);
 box('master-cylinder',[.085,.07,.15],[.40,.77,-.73],'white');
 // Cooling, fuel, exhaust and electrics are schematic routes.
 box('radiator',[1.0,.39,.075],[0,.60,-1.73],'dark',[.12,0,0]);
 for(let i=0;i<25;i++)box('radiator',[.014,.34,.087],[-.46+i*.038,.60,-1.73],'metal',[.12,0,0]);
 cyl('radiator',.21,.045,[0,.60,-1.63],'dark',[Math.PI/2,0,0]);
 for(let i=0;i<5;i++)box('radiator',[.28,.035,.015],[0,.60,-1.60],'metal',[0,0,i*Math.PI/5]);
 for(const x of [-.65,.65])tube('coolant-pipes',[[x*.5,.63,-1.7],[x,.31,-1.40],[x,.27,.65],[x*.6,.70,1.04]],.026,'blue');
 cyl('thermostat',.048,.14,[.40,.91,1.34],'metal',[0,0,0]);
 cyl('thermostat',.063,.025,[.40,.99,1.34],'dark',[0,0,0]);
 box('fuel-tank',[.29,.19,1.34],[0,.32,-.16],'metal');
 tube('fuel-lines',[[.14,.37,-.5],[.19,.39,.5],[.22,.7,.74],[.20,.96,1.10]],.012,'amber');
 tube('exhaust',[[.35,.60,1.38],[.50,.35,1.43],[.35,.27,1.66],[0,.29,1.78]],.034,'metal');
 cyl('exhaust',.105,.66,[0,.29,1.78],'metal');
 for(const x of [-.48,.48])tube('exhaust',[[Math.sign(x)*.25,.29,1.78],[x,.29,1.87],[x,.29,2.07]],.035,'alloy');
 box('battery',[.23,.22,.18],[-.59,.78,.71],'dark');
 box('battery',[.24,.025,.19],[-.59,.90,.71],'rubber');
 for(const x of [-.65,-.53])cyl('battery',.013,.03,[x,.93,.71],x<-.6?'red':'metal',[0,0,0]);
 cyl('alternator',.09,.13,[.48,.58,1.31],'metal');
 cyl('alternator',.07,.02,[.56,.58,1.31],'dark');
 for(const x of [-.56,.56]) {box('headlights',[.25,.06,.29],[x,.815,-1.58],'red');box('headlights',[.21,.10,.045],[x,.88,-1.69],'white');}
 for(const x of [-.43,.43]){box('taillights',[.68,.115,.027],[x,.78,2.06],'dark');for(let i=0;i<6;i++)box('taillights',[.09,.077,.016],[x-.25+i*.1,.78,2.078],'lamp');}
 tube('harness',[[-.59,.86,.71],[-.43,.64,.55],[.48,.52,.43],[.49,.51,-.59],[.55,.69,-1.58]],.016,'wire');
 tube('harness',[[.48,.52,.43],[.59,.55,1.10],[.59,.66,1.87],[0,.7,2.0]],.014,'wire');
 // Cockpit.
 for(const x of [-.36,.36]) {
  box('seats',[.40,.13,.43],[x,.47,.08],'interior');
  box('seats',[.40,.45,.13],[x,.71,.29],'interior',[-.12,0,0]);
  box('seats',[.27,.16,.12],[x,.99,.32],'interior');
  for(const d of [-.18,.18])box('seats',[.055,.16,.39],[x+d,.53,.09],'interior');
 }
 box('dashboard',[1.26,.17,.24],[0,.86,-.52],'dark');
 box('dashboard',[.41,.14,.08],[.35,.95,-.38],'dark');
 for(const x of [.24,.43])cyl('dashboard',.057,.01,[x,.96,-.331],'metal',[Math.PI/2,0,0]);
 box('dashboard',[.20,.32,.11],[0,.69,-.38],'dark');
 mesh('steering-wheel',new T.TorusGeometry(.145,.015,10,32),'rubber',[.36,.89,-.22],[.30,0,0]);
 for(const a of [0,2.1,4.2])box('steering-wheel',[.022,.13,.024],[.36+Math.sin(a)*.06,.89+Math.cos(a)*.06,-.22],'metal',[.30,0,-a]);
 tube('steering-wheel',[[.36,.89,-.22],[.36,.73,-.59]],.02,'dark');
 box('shifter',[.19,.12,.68],[0,.50,-.07],'dark');
 cyl('shifter',.012,.16,[0,.64,-.13],'metal',[0,0,0]);
 mesh('shifter',new T.SphereGeometry(.035,16,12),'rubber',[0,.73,-.13]);
 for(const x of [.22,.35,.49])box('pedals',[.055,.075,.025],[x,.42,-.51],'rubber',[-.25,0,0]);
 // Keep the illustrative powertrain below the closed decklid.
 for(const g of groups.values())if(g.userData.system==='engine')for(const child of g.children)child.position.y-=.18;
 for(const id of ['gearbox','clutch'])for(const child of groups.get(id).children)child.position.y-=.13;
 for(const child of groups.get('thermostat').children)child.position.y-=.08;
 // Exploded offsets preserve part group identities and selection.
 for(const [id,g] of groups) {
  const s=g.userData.system;
  if(s==='body')g.userData.spread.set(id.includes('left')?.75:id.includes('right')?-.75:0,id==='spaceframe'?.02:1.0,id==='nose'?-.65:id==='rear-fascia'?.65:0);
  if(s==='engine')g.userData.spread.set(.05,.5,0);
  if(s==='drivetrain')g.userData.spread.set(-.45,.1,.15);
  if(s==='brakes')g.userData.spread.set(0,-.04,0);
  if(s==='interior')g.userData.spread.set(0,.5,0);
 }
 groups.get('air-lid').userData.spread.set(.10,1.10,0);
 groups.get('air-filter').userData.spread.set(.10,.78,0);
 groups.get('air-cleaner').userData.spread.set(.10,.38,0);
 groups.get('intake').userData.spread.set(.05,.86,0);
 groups.get('heads').userData.spread.set(.05,.65,0);
 groups.get('oil-pan').userData.spread.set(.05,-.22,0);
 return {root,groups};
}
