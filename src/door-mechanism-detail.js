import * as T from 'three';
import {mechanicalTools} from './mechanical-geometry.js';
import {doorMechanismParts} from './door-mechanism-catalog.js';
const catalog=new Map(doorMechanismParts.map(p=>[p.id,p]));

// Author in the same +X-left legacy/body frame as buildBodyHardware. Its caller
// applies bodyPoint and handedness once. Positions are construction references,
// not regulator calibration or production measurements.
export function buildDoorMechanisms(base){
 const h={...base};
 for(const name of ['add','box','cyl','tube','surface','ring'])h[name]=(id,...args)=>{
  const p=catalog.get(id);if(!p)throw new Error('Uncatalogued door mechanism '+id);
  const mesh=base[name](id,...args);Object.assign(mesh.userData,{detailPartId:id,...(p.option?{option:p.option,value:p.value}:{})});return mesh;
 };
 const {box,cyl,tube,ring,add}=h,{plate,annulus,spring}=mechanicalTools(h);
 for(const [side,s]of [['left',1],['right',-1]]){
  const id=k=>`bd-door-${side}-${k}`,x=s*.801,p=(y,z,dx=0)=>[x+s*dx,y,z];
  const fastener=(key,y,z,dx=0)=>{cyl(id(key),.004,.007,p(y,z,dx),'zinc');annulus(id(key),.007,.0042,.001,p(y,z,dx+.004),'zinc');};
  const channel=(key,y,z,length,vertical=false,dx=0)=>{
   // Open C channel, not a solid rectangular proxy. Opening faces the rollers.
   const centre=p(y,z,dx),dims=vertical?[.002,length,.022]:[.002,.022,length];box(id(key),dims,centre,'zinc');
   for(const edge of [-1,1])box(id(key),vertical?[.010,length,.002]:[.010,.002,length],p(y+(vertical?0:edge*.01),z+(vertical?edge*.01:0),dx+.004),'zinc');
  };
  const arm=(key,a,b,width=.024,dx=0)=>{
   const [ay,az]=a,[by,bz]=b,dy=by-ay,dz=bz-az,len=Math.hypot(dy,dz),uy=dy/len,uz=dz/len,r=width/2;
   plate(id(key),[[ay-uz*r,az+uy*r],[by-uz*r,bz+uy*r],[by+uz*r,bz-uy*r],[ay+uz*r,az-uy*r]],[[ay,az,.0035],[by,bz,.0035]],.003,x+s*dx,'zinc');
  };
  const clip=(key,y,z,dx=0)=>{annulus(id(key),.007,.003,.002,p(y,z,dx),'plastic');box(id(key),[.008,.013,.003],p(y+.006,z+.006,dx),'plastic');};
  const regulator=(key,powered)=>{
   arm(key,[.415,-.23],[.694,.27],.028,.005);arm(key,[.415,.27],[.694,-.23],.024,.013);
   annulus(id(key),.014,.004,.019,p(.5545,.02,.009),'zinc');
   for(const [y,z,dx]of [[.415,-.23,.005],[.694,.27,.005],[.415,.27,.013],[.694,-.23,.013]]){cyl(id(key),.005,.020,p(y,z,dx),'zinc');annulus(id(key),.010,.004,.006,p(y,z,.022),'plastic');}
   // A smooth sector records the presence and sweep; teeth are deliberately
   // not guessed from the low-resolution catalog drawing.
   const sh=new T.Shape();sh.moveTo(0,0);sh.absarc(0,0,.092,-1.35,.63,false);sh.lineTo(0,0);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:.004,bevelEnabled:false,curveSegments:24});g.rotateY(Math.PI/2);add(id(key),g,'metal',p(.5545,.02,-.002));
   plate(id(key),[[.466,-.27],[.51,-.30],[.596,.005],[.570,.05],[.52,.04]],[[.486,-.265,.004],[.577,.003,.004]],.003,x-s*.008,'zinc');
   if(!powered){cyl(id(key),.010,.038,p(.493,-.215,-.018),'metal');annulus(id(key),.025,.01,.009,p(.493,-.215,-.005),'zinc');}
  };
  regulator('manual-regulator',false);regulator('power-regulator',true);
  channel('glass-cam',.694,.02,.65,false,.027);
  // Figure 2P10-004 separates the belt trim retainer (11), outer seal (12,
  // already shared with the exterior), and inner seal (13). These lengths
  // and sections are reconstructed; no unverified clip pattern is added.
  channel('belt-trim-retainer',.780,.005,.79,false,-.014);
  box(id('inner-belt-seal'),[.005,.018,.79],p(.783,.005,-.037),'dark');
  box(id('inner-belt-seal'),[.008,.003,.79],p(.793,.005,-.031),'dark');
  channel('inner-cam',.415,.02,.66,false,.027);
  channel('guide-cam',.54,.42,.37,true,.030);
  channel('guide-retainer',.55,-.43,.39,true,.021);
  for(const [key,z]of [['rear-cam-support',.42],['guide-support',-.43]]){
   plate(id(key),[[.346,z-.031],[.388,z-.031],[.39,z+.032],[.348,z+.026]],[[.363,z,.0045]],.003,x+s*.02,'zinc');box(id(key),[.020,.003,.052],p(.385,z,.014),'zinc');fastener(key,.363,z,.027);
  }
  for(const [key,y,z]of [['glass-inner-stop',.719,.38],['front-glass-stop',.720,-.40]]){box(id(key),[.015,.025,.038],p(y,z,-.012),'zinc');box(id(key),[.012,.008,.032],p(y+.014,z,-.011),'rubber');fastener(key,y,z,-.022);}
  for(const z of [-.26,.29]){cyl(id('glass-rear-stops'),.012,.019,p(.719,z,.023),'plastic');fastener('glass-rear-stops',.719,z,.010);}
  for(const z of [-.37,.36]){
   plate(id('glass-stabilizers'),[[.736,z-.022],[.770,z-.022],[.774,z+.022],[.737,z+.026]],[[.746,z,.004]],.003,x-s*.016,'zinc');box(id('glass-stabilizers'),[.012,.009,.037],p(.777,z,-.010),'carpet');
  }
  const glassAttachments=[[-.31,.704],[.34,.704]];
  for(const [z,y]of glassAttachments){
   annulus(id('glass-bushings'),.008,.0035,.009,p(y,z,.033),'plastic');annulus(id('glass-bushing-retainers'),.009,.004,.002,p(y,z,.024),'zinc');
   cyl(id('glass-inner-buttons'),.011,.003,p(y,z,.020),'plastic');cyl(id('glass-outer-buttons'),.011,.003,p(y,z,.040),'plastic');
  }
  for(const z of [-.42,.42])cyl(id('glass-stabilizer-buttons'),.013,.007,p(.693,z,.039),'plastic');
  box(id('regulator-stop'),[.016,.014,.021],p(.354,.12,.012),'rubber');fastener('regulator-stop',.349,.12,.012);
  // Exterior motor can, separate reducer shell and folded mounting ears.
  cyl(id('window-motor'),.023,.096,p(.46,-.16,.008),'zinc',[Math.PI/2,0,0]);cyl(id('window-motor'),.024,.012,p(.46,-.21,.008),'dark',[Math.PI/2,0,0]);
  annulus(id('window-motor'),.038,.008,.021,p(.494,-.215,.004),'castAluminum');cyl(id('window-motor'),.036,.002,p(.494,-.215,-.008),'zinc');
  for(const [y,z]of [[.47,-.26],[.536,-.224],[.486,-.17]]){arm('window-motor',[.494,-.215],[y,z],.017,-.009);fastener('window-motor',y,z,-.014);}
  box(id('window-motor'),[.019,.015,.019],p(.45,-.208,.008),'plastic');
  // The existing latch shell/striker/outer-handle/key-cylinder rods remain
  // their shared body parts. Only previously absent external parts are added.
  tube(id('lock-overcenter-spring'),[p(.492,.480,.004),p(.505,.473,.004),p(.496,.467,.004),p(.478,.486,.004),p(.482,.501,.004)],.0011,'metal');
  clip('handle-rod-clip',.473,.499,.004);clip('inside-latch-clip',.481,.490,-.01);clip('remote-rod-clip',.635,-.284,-.029);clip('inside-lock-clip',.614,-.235,-.025);
  // Forked retainer leaves an actual slot around the cylinder neck.
  for(const z of [.489,.518])box(id('lock-cylinder-retainer'),[.002,.024,.008],p(.472,z,.035),'zinc');box(id('lock-cylinder-retainer'),[.002,.005,.037],p(.485,.504,.035),'zinc');
  spring(id('lock-return-spring'),p(.612,-.206,-.032),.006,.021,'x',5,.001,'metal');
  tube(id('inside-release-rod'),[p(.635,-.295,-.031),p(.636,-.26,-.03),p(.589,-.1,-.013),p(.531,.36,-.012),p(.486,.502,-.011)],.0018,'zinc');
  tube(id('inside-lock-rod'),[p(.614,-.246,-.026),p(.612,-.219,-.025),p(.578,-.10,-.021),p(.533,.34,-.018),p(.486,.488,-.004)],.0016,'zinc');
  plate(id('striker-anchor'),[[.461,.544],[.506,.544],[.506,.568],[.461,.568]],[[.485,.550,.0065]],.004,s*.749,'zinc');
  plate(id('power-lock-bellcrank'),[[.377,.220],[.384,.253],[.420,.261],[.417,.242],[.398,.237],[.400,.22]],[[.397,.24,.004]],.003,x-s*.004,'zinc');cyl(id('power-lock-bellcrank'),.005,.010,p(.397,.24,-.004),'zinc');
  tube(id('power-lock-rod'),[p(.348,.08,.005),p(.385,.08,.005),p(.407,.12,.003),p(.415,.25,-.004)],.0018,'zinc');
  box(id('power-lock-actuator'),[.028,.047,.071],p(.321,.08,.005),'plastic',[],{},.004);cyl(id('power-lock-actuator'),.010,.032,p(.361,.08,.005),'rubber',[0,0,0]);
  for(let i=0;i<5;i++)ring(id('power-lock-actuator'),.010,.0015,p(.348+i*.006,.08,.005),'rubber',[Math.PI/2,0,0]);cyl(id('power-lock-actuator'),.003,.030,p(.387,.08,.005),'zinc',[0,0,0]);
  plate(id('power-lock-bracket'),[[.289,.039],[.351,.039],[.351,.122],[.289,.122]],[[.299,.049,.004],[.299,.110,.004]],.002,x-s*.012,'zinc');for(const z of [.05,.11])fastener('power-lock-bracket',.299,z,-.016);
  box(id('power-lock-stop'),[.014,.016,.020],p(.392,.266,-.004),'rubber');
  // Independent panel attachment blocks, not the latch or door frame. The
  // drawing establishes distinct outlines/identities, not tooling or fits.
  box(id('outer-panel-block'),[.016,.046,.045],p(.530,.480,.029),'dark');
  annulus(id('outer-panel-block'),.017,.006,.012,p(.530,.480,.043),'dark');
  box(id('front-panel-block'),[.015,.034,.029],p(.447,-.433,.029),'dark');
  for(const z of [-.443,-.423])box(id('front-panel-block'),[.009,.006,.008],p(.466,z,.032),'dark');
 }
}
