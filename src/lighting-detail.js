import * as T from 'three';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {lightingParts,lightingSections} from './lighting-catalog.js';
import {electricalTools,bakeElectrical} from './electrical-geometry.js';
import {rearFace,frontFace} from './fascias.js';
export function lightingMaterials(base=createMaterials()){
 const m={...base};for(const key of['plastic','rubber','metal','dark']){m[key]=base[key].clone();m[key].bumpScale=.00003;}
 m.bulbGlass=new T.MeshPhysicalMaterial({color:'#e8efed',roughness:.08,metalness:0,transparent:true,opacity:.22,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 m.clearLens=new T.MeshPhysicalMaterial({color:'#c5d0c9',roughness:.18,metalness:0,transparent:true,opacity:.47,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 m.tailOuter=new T.MeshPhysicalMaterial({color:'#6f6965',roughness:.16,transparent:true,opacity:.29,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 m.tailRed=new T.MeshPhysicalMaterial({color:'#960d07',roughness:.20,transparent:true,opacity:.80,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 m.turnAmber=new T.MeshPhysicalMaterial({color:'#e38012',roughness:.20,transparent:true,opacity:.74,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 return m;
}
function makeGroups(){const root=new T.Group(),groups=new Map();for(const p of lightingParts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:'electrical',section:p.section,spread:new T.Vector3(...p.spread),assemblySpread:new T.Vector3()};groups.set(p.id,g);root.add(g);}return{root,groups};}
export function createLightingDetail(){const model=makeGroups(),h=geometryTools(model.groups,lightingMaterials());buildLighting(h,model.groups);h.optimize();correctLegacyHandedness(model.groups);return model;}
export function buildVehicleLighting(groups,materials){const d=makeGroups(),h=geometryTools(d.groups,lightingMaterials(materials));buildLighting(h,d.groups);h.optimize();for(const p of lightingParts){const owner=p.section.startsWith('lighting-rear-')?'taillights':p.section.startsWith('lighting-front-')?'front-signals':p.section.startsWith('lighting-marker-')?'marker-lamps':p.section.startsWith('lighting-license-')?'license-lamps':'cabin-lamps';for(const m of [...d.groups.get(p.id).children]){m.userData.partId=owner;groups.get(owner).add(m);}}}
export function buildLighting(h,groups){
 const {box,cyl,tube,ring}=h,{plate,frame,sleeve,screw,bulb,socket,lens,bowl}=electricalTools(h);
 function bake(scope,map){bakeElectrical(groups,lightingParts.filter(p=>p.section==='lighting-'+scope).map(p=>p.id),map);}
 for(const [side,s]of[['left',1],['right',-1]]){
  let scope='front-'+side,id=k=>`lt-${scope}-${k}`;
  bowl(id('housing'),.108,.045,.043,[0,0,-.004]);frame(id('housing'),.125,.061,.006,.005,[0,0,-.004],'plastic');
  for(const dx of[-.052,.052])plate(id('housing'),.017,.021,.004,[dx,0,-.007],'plastic',[[0,0,.002]]);
  lens(id('lens'),.118,.050,[0,0,.003],'turnAmber');frame(id('gasket'),.117,.051,.0025,.0015,[0,0,0],'rubber');
  bulb(id('bulb'),[0,0,-.045]);socket(id('socket'),[0,0,-.055]);for(const dx of[-.048,.048])screw(id('screws'),[dx,0,.006],.003,.025);
  frame(id('bracket'),.131,.068,.009,.003,[0,0,-.023],'dark');for(const dx of[-.059,.059])screw(id('bracket'),[dx,0,-.017],.003,.012);
  bake(scope,(x,y,z)=>{const p=frontFace(s*.557-x,.365+y);return[p[0],p[1],p[2]-.008-z];});
  for(const [end,cy,cz]of[['front',.520,-1.75],['rear',.562,1.78]]){
   scope=`marker-${end}-${side}`;id=k=>`lt-${scope}-${k}`;
   plate(id('housing'),.164,.030,.005,[0,0,-.008],'plastic',[[0,0,.006]],.004);frame(id('housing'),.164,.032,.003,.008,[0,0,-.006],'plastic',.004);
   lens(id('lens'),.157,.023,[0,0,.002],end==='front'?'turnAmber':'tailRed');frame(id('seal'),.165,.031,.002,.0015,[0,0,-.011],'rubber',.004);
   bulb(id('bulb'),[0,0,-.021],'194');socket(id('socket'),[0,0,-.026],false,true);for(const dx of[-.071,.071])screw(id('screws'),[dx,0,.005],.003,.018);
   bake(scope,(x,y,z)=>[s*(.849+z),cy+y,cz-s*x]);
  }
  scope='rear-'+side;id=k=>`lt-${scope}-${k}`;
  // Molded three-chamber rear body. The lens is clear/smoked outside with
  // separate red and reverse optics inside, as GM 2P02-002 illustrates.
  const centers=[-.245,0,.245];
  frame(id('housing'),.713,.118,.006,.025,[0,0,-.023],'plastic');
  plate(id('housing'),.695,.107,.003,[0,0,-.072],'plastic',centers.map(x=>[x,0,.012]));
  for(const x of centers)bowl(id('housing'),.226,.098,.055,[x,0,-.010]);
  for(const x of[-.125,.125])box(id('housing'),[.003,.107,.060],[x,0,-.038],'plastic');
  lens(id('outer-lens'),.717,.112,[0,0,.006],'tailOuter',false);
  // Keep the accepted grid pitch and outer rear contour.
  for(let i=0;i<38;i++)box(id('outer-lens'),[.0008,.090,.0008],[-.346+i*.0187,0,.0072],'lensGrid');
  for(let i=0;i<7;i++)box(id('outer-lens'),[.692,.0008,.0008],[0,-.044+i*.0147,.0072],'lensGrid');
  // Inboard chamber center depends on side; shell and bulb locations mirror.
  const reverse=-s*.245,turn=0,tail=s*.245;
  lens(id('red-lens'),.456,.101,[s*.1225,0,-.004],'tailRed');lens(id('reverse-lens'),.225,.101,[reverse,0,-.004],'clearLens');
  frame(id('seal'),.712,.111,.002,.0015,[0,0,.001],'rubber');
  for(const [key,x,type]of[['tail',tail,'2057'],['turn',turn,'2057'],['reverse',reverse,'1156']]){bulb(id(key+'-bulb'),[x,0,-.063],type);socket(id(key+'-socket'),[x,0,-.078],type==='2057');}
  for(const x of[-.280,0,.280]){screw(id('retainers'),[x,.070,-.023],.004,.075,'y');frame(id('retainers'),.015,.013,.003,.009,[x,-.060,-.027],'zinc',.002);plate(id('access-caps'),.025,.017,.003,[x,0,0],'plastic',[],.003);const m=groups.get(id('access-caps')).children.at(-1);m.rotation.x=-Math.PI/2;m.position.set(x,.079,-.023);}
  bake(scope,(x,y,z)=>{const p=rearFace(s*.376+x,.670+y);return[p[0],p[1],p[2]+z];});
  scope='license-'+side;id=k=>`lt-${scope}-${k}`;
  bowl(id('housing'),.057,.025,.018,[0,0,-.003]);frame(id('housing'),.071,.037,.005,.016,[0,0,-.006],'plastic',.003);lens(id('lens'),.058,.027,[0,0,.004]);bulb(id('bulb'),[0,0,-.018],'194');socket(id('socket'),[0,0,-.029],false,true);for(const x of[-.030,.030])screw(id('screws'),[x,0,.002],.0025,.013);
  bake(scope,(x,y,z)=>[s*.105+x,.451-z,2.005+y]);
 }
 let scope='dome',id=k=>`lt-${scope}-${k}`;
 const xs=[.104,.033,-.033,-.104],keys=['left-map','left-dome','right-dome','right-map'];
 frame(id('housing'),.313,.110,.011,.018,[0,0,-.007],'vinyl',.012);plate(id('housing'),.296,.093,.003,[0,0,-.020],'plastic',xs.map(x=>[x,.010,.011]));
 const trim=electricalTools(h).rounded(.313,.110,.012);for(let i=0;i<4;i++){const x=xs[i],w=i===0||i===3?.084:.045;for(const [cy,ww,hh]of[[.013,w,.060],[-.034,.024,.013]]){const hole=electricalTools(h).rounded(ww,hh,.003,T.Path);for(const curve of hole.curves){for(const k of ['v1','v2','v0'])if(curve[k]?.isVector2)curve[k].add(new T.Vector2(x,cy));}trim.holes.push(hole);}}
 const trimGeo=new T.ExtrudeGeometry(trim,{depth:.002,bevelEnabled:false,curveSegments:16});h.add(id('housing'),trimGeo,'vinyl',[0,0,.002]);
 for(let i=0;i<4;i++){const x=xs[i],key=keys[i],w=i===0||i===3?.083:.044;frame(id('housing'),w+.006,.066,.003,.016,[x,.013,-.003],'plastic',.006);bowl(id('housing'),w-.001,.057,.021,[x,.013,-.003],'chrome',.009);lens(id(key+'-lens'),w,.060,[x,.013,.005]);bulb(id(key+'-bulb'),[x,.013,-.025],'906');socket(id(key+'-socket'),[x,.013,-.031],false,true);box(id(key+'-switch'),[.023,.012,.008],[x,-.034,.003],'plastic',[],{},.002);tube(id(key+'-switch'),[[x-.007,-.034,-.017],[x,-.034,-.010],[x+.007,-.034,-.017]],.0007,'copper');}
 for(const x of[-.125,.125])for(const y of[-.041,.031])screw(id('screws'),[x,y,-.005],.003,.016);
 bake(scope,(x,y,z)=>[x,1.139-z,-.027+y]);
 // Option-specific lamps. The rear compartment is the luggage well aft of
 // the engine; the optional front lamp is inside the front compartment.
 for(const [key,p]of[['foot-left',[.45,.488,-.43]],['foot-right',[-.45,.488,-.43]],['front-compartment',[.51,.704,-.65]],['rear-compartment',[.20,.625,1.81]]]){
  scope='courtesy';id=k=>`lt-${scope}-${key}-${k}`;
  if(key==='rear-compartment'){
   frame(id('housing'),.072,.031,.004,.012,[0,0,0],'plastic',.004);lens(id('housing'),.064,.023,[0,0,.008]);
   const g=new T.LatheGeometry([[0,-.021],[.003,-.021],[.004,-.016],[.005,-.012],[.005,.012],[.004,.016],[.003,.021],[0,.021]].map(p=>new T.Vector2(...p)),24);g.rotateZ(Math.PI/2);h.add(id('bulb'),g,'bulbGlass',[0,0,-.002]);
   for(const s of[-1,1]){cyl(id('bulb'),.003,.007,[s*.020,0,-.002],'zinc');box(id('contacts'),[.002,.013,.014],[s*.025,0,-.003],'copper',[],{},.001);}tube(id('bulb'),[[-.016,0,-.002],[.016,0,-.002]],.00018,'zinc');
  }else{frame(id('housing'),.040,.030,.005,.007,[0,0,-.005],'zinc',.004);bulb(id('bulb'),[0,0,0],'168');socket(id('contacts'),[0,0,-.008],false,true);}
  tube(id('contacts'),[[.021,0,-.011],[.035,.01,-.028],[.070,.015,-.029]],.002,'wire');
  bakeElectrical(groups,['housing','bulb','contacts'].map(id),(x,y,z)=>[p[0]+x,p[1]-z,p[2]+y]);
 }
 scope='console';id=k=>`lt-${scope}-${k}`;
 for(const [side,s]of[['left',1],['right',-1]]){bulb(id(side+'-bulb'),[s*.070,0,0],'70');socket(id(side+'-socket'),[s*.070,0,-.010],false,true);}
 bake(scope,(x,y,z)=>[x,.416+z,-.24+y]);
 for(const p of lightingParts)if(p.option)for(const m of groups.get(p.id).children)Object.assign(m.userData,{option:p.option,value:p.value});
}
