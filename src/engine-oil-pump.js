import * as T from 'three';

// GM 1986 6A2-21 figure 23 establishes the construction, not these dimensions.
// Static reconstructed envelope; tooth count/profile and pressure calibration
// must not be interpreted as original L44 manufacturing or service data.
export const oilPumpLayout={driveX:.105,idlerX:.129,z:0,gearY:.950,gearHeight:.023,teeth:10,rootRadius:.0094,tipRadius:.0142,boreRadius:.0148,bodyBottom:.937,bodyTop:.967,screen:[.071,.857,0],screenRadius:.024};
export const oilPumpSource='https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=338';
export const oilPumpReferenceNote='Adjacent-year GM 1986 L44 drawing, 6A2-21 figure 23, establishes construction relationships. Original 1985 casting dimensions, gear tooth count/profile, clearances, pickup position and relief calibration remain unverified. This construction view is not an overhaul procedure.';
export const oilPumpParts=[
 ['oil-pump-drive-gear','Oil-pump drive gear and shaft','Separate spur gear and shaft with an open hexagonal coupling socket. Ten displayed teeth and the static mesh are reconstructed, not a verified original tooth count.',[0,-.10,.06],2],
 ['oil-pump-driven-gear','Oil-pump driven gear','Separate idler gear with an open journal bore. Reconstructed tooth profile and dimensions; operating engagement is unverified.',[.06,-.10,-.06],2],
 ['oil-pump-cover','Oil-pump cover and relief bore','Separate lower cover, inlet opening and hollow pressure-relief sleeve. Internal oil galleries and original casting tooling remain incomplete.',[0,-.20,0],3],
 ['oil-pump-relief-piston','Oil-pump pressure-relief piston','Separate sliding piston in the cover relief bore. Original land profile and working clearance remain unmeasured.',[.12,-.20,-.03],4],
 ['oil-pump-relief-spring','Oil-pump pressure-relief spring','Separate helical spring behind the relief piston. Turn count, wire diameter, preload and pressure setting are illustrative.',[-.07,-.20,-.03],5],
 ['oil-pump-relief-pin','Oil-pump relief-spring retaining pin','Separate transverse retaining pin at the open spring end of the relief bore.',[-.14,-.20,-.05],6],
 ['oil-pump-cover-bolts','Oil-pump cover screw set','Four separately modeled screws grouped in one selection, following the four screws shown in figure 23. Original thread and length remain unverified.',[0,-.28,0],7],
 ['oil-pump-mount-bolt','Oil-pump mounting bolt','Single pump-to-rear-bearing-cap attachment represented with an open mounting ear. Production mounting position and fastener dimensions remain unverified.',[.08,.08,.07],null],
 ['pickup-screen','Oil-pickup strainer screen','Separate woven-wire screen and rolled perimeter inside the pickup shell. Mesh spacing, original screen construction and sump clearance require measurement.',[-.09,-.12,.05],null],
].map(([key,name,description,spread,callout])=>({id:`eng-${key}`,section:'oil-pump-detail',system:'engine',name,description,spread,callout,location:'L44 oil-pump construction',source:'GM 1986 · 6A2-21 figure 23',sourceUrl:oilPumpSource,referenceNote:oilPumpReferenceNote,aliases:`oil lubrication pump pickup strainer relief ${key.replaceAll('-',' ')}`}));

export function buildOilPump(h){
 const L=oilPumpLayout,id=k=>`eng-${k}`;
 const circle=(x,z,r)=>{const p=new T.Path();p.absarc(x,-z,r,0,Math.PI*2,true);return p;};
 const plate=(key,shape,y,height,mat='iron')=>{const g=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);return h.add(id(key),g,mat,[0,y,0]);};
 const ring=(key,ro,ri,y,height,x,z=0,mat='rotor')=>{const s=new T.Shape();s.absarc(x,-z,ro,0,Math.PI*2);s.holes.push(circle(x,z,ri));return plate(key,s,y,height,mat);};
 const capsule=(r)=>{const s=new T.Shape();s.absarc(L.idlerX,0,r,-Math.PI/2,Math.PI/2);s.absarc(L.driveX,0,r,Math.PI/2,Math.PI*1.5);s.closePath();return s;};
 const screwPoints=[[.094,-.016],[.140,-.016],[.094,.016],[.140,.016]];
 // A single union boundary avoids overlapping holes in the gear pocket.
 const pocket=()=>{const p=new T.Path(),a=Math.acos((L.idlerX-L.driveX)/(2*L.boreRadius));p.absarc(L.driveX,0,L.boreRadius,a,Math.PI*2-a,false);p.absarc(L.idlerX,0,L.boreRadius,Math.PI+a,Math.PI*3-a,false);p.closePath();return p;};
 const wall=capsule(.021);wall.holes.push(pocket());
 for(const [x,z]of screwPoints)wall.holes.push(circle(x,z,.002));
 plate('oil-pump',wall,L.bodyBottom,.026);
 const roof=capsule(.021);roof.holes.push(circle(L.driveX,0,.0052));
 plate('oil-pump',roof,.963,.004);
 ring('oil-pump',.009,.0052,.967,.007,L.driveX,0,'iron');
 // Fixed journal for the idler; the driven gear remains independently removable.
 h.cyl(id('oil-pump'),.0035,.025,[L.idlerX,.9505,0],'rotor',[0,0,0]);
 const ear=new T.Shape();ear.moveTo(.131,-.010);ear.lineTo(.160,-.010);ear.quadraticCurveTo(.170,0,.160,.010);ear.lineTo(.131,.010);ear.closePath();ear.holes.push(circle(.157,0,.0043));plate('oil-pump',ear,.963,.005);
 h.cyl(id('oil-pump-mount-bolt'),.0037,.026,[.157,.970,0],'zinc',[0,0,0]);
 h.add(id('oil-pump-mount-bolt'),new T.CylinderGeometry(.006,.006,.005,6),'zinc',[.157,.9585,0]);
 // Narrow rounded teeth are illustrative. Opposite half-pitch phases leave
 // visible backlash at this static pose, without claiming involute gearing.
 for(const [key,x,phase]of [['oil-pump-drive-gear',L.driveX,0],['oil-pump-driven-gear',L.idlerX,Math.PI/L.teeth]]){
  const s=new T.Shape();for(let i=0;i<=L.teeth*32;i++){const a=i/(L.teeth*32)*Math.PI*2,r=L.rootRadius+(L.tipRadius-L.rootRadius)*Math.pow((1+Math.cos((a-phase)*L.teeth))/2,2);const px=x+r*Math.cos(a),py=r*Math.sin(a);i?s.lineTo(px,py):s.moveTo(px,py);}s.closePath();
  if(key==='oil-pump-driven-gear')s.holes.push(circle(x,0,.00365));
  plate(key,s,L.gearY-L.gearHeight/2,L.gearHeight,'rotor');
 }
 h.cyl(id('oil-pump-drive-gear'),.005,.029,[L.driveX,.9545,0],'rotor',[0,0,0]);
 const socket=new T.Shape();socket.absarc(L.driveX,0,.005,0,Math.PI*2);const hex=new T.Path();for(let i=0;i<=6;i++){const a=i*Math.PI/3,pt=[L.driveX+Math.sin(a)*.0042,Math.cos(a)*.0042];i?hex.lineTo(...pt):hex.moveTo(...pt);}socket.holes.push(hex);plate('oil-pump-drive-gear',socket,.969,.010,'rotor');
 const cover=capsule(.021);for(const [x,z]of screwPoints)cover.holes.push(circle(x,z,.0022));cover.holes.push(circle(.124,.009,.0056));plate('oil-pump-cover',cover,.928,.009);
 for(const [x,z]of screwPoints){h.cyl(id('oil-pump-cover-bolts'),.0018,.021,[x,.9355,z],'zinc',[0,0,0]);h.add(id('oil-pump-cover-bolts'),new T.CylinderGeometry(.0034,.0034,.003,6),'zinc',[x,.9265,z]);}
 // Relief sleeve is open at the spring end. Two half sleeves leave a real
 // transverse opening for the retaining pin, rather than burying it in metal.
 const lathe=(key,profile,pos,mat='iron')=>h.add(id(key),new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),48),mat,pos,[0,0,-Math.PI/2]);
 for(const [a,b]of [[.084,.0868],[.0892,.149]])lathe('oil-pump-cover',[[.005,a],[.008,a],[.008,b],[.005,b],[.005,a]],[0,.932,-.027]);
 // Collar pieces connect the sleeve while retaining the pin's vertical slot.
 for(const z of [-.0335,-.0205])h.box(id('oil-pump-cover'),[.0024,.004,.003],[.088,.932,z],'iron');
 h.cyl(id('oil-pump-relief-piston'),.0048,.013,[.139,.932,-.027],'rotor',[0,0,Math.PI/2]);
 const spring=[];for(let i=0;i<=160;i++){const t=i/160,a=t*Math.PI*14;spring.push([.0897+t*.0422,.932+Math.cos(a)*.0037,-.027+Math.sin(a)*.0037]);}h.tube(id('oil-pump-relief-spring'),spring,.00055,'zinc');
 h.cyl(id('oil-pump-relief-pin'),.0011,.018,[.088,.932,-.027],'zinc',[0,0,0]);
 // Open annular pickup tube follows a curved path into the cover inlet.
 const path=new T.CatmullRomCurve3([[.124,.931,.009],[.125,.905,.009],[.149,.893,.007],[.120,.897,0],[.080,.897,0],[.071,.887,0],[.071,.873,0]].map(p=>new T.Vector3(...p)));
 const annulus=new T.Shape();annulus.absarc(0,0,.0055,0,Math.PI*2);annulus.holes.push(circle(0,0,.0043));h.add(id('pickup'),new T.ExtrudeGeometry(annulus,{steps:72,bevelEnabled:false,extrudePath:path,curveSegments:24}),'zinc');
 const [sx,sy,sz]=L.screen;
 const shell=[[.0225,0],[.025,0],[.025,.005],[.0235,.013],[.010,.018],[.0055,.019],[.0055,.0175],[.010,.0165],[.022,.0115],[.0235,.004],[.0225,.0015],[.0225,0]];
 h.add(id('pickup'),new T.LatheGeometry(shell.map(p=>new T.Vector2(...p)),64),'zinc',[sx,sy,sz]);
 ring('pickup-screen',.023,.022,sy,.001,sx,sz,'zinc');
 // Real wires with open spaces, not an opaque screen-texture disc.
 for(let i=-10;i<=10;i++){const d=i*.002,r=.022,length=Math.sqrt(r*r-d*d)*2;h.cyl(id('pickup-screen'),.00022,length,[sx+d,sy+.0004,sz],'zinc',[Math.PI/2,0,0]);h.cyl(id('pickup-screen'),.00022,length,[sx,sy+.00085,sz+d],'zinc',[0,0,Math.PI/2]);}
}
