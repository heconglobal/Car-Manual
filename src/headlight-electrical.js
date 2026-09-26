import * as T from 'three';
import {actuatorTerminals,isolationTerminals,relayPlacements,motorLeadMaterials} from './headlight-electrical-data.js';

// Native construction geometry in the legacy authoring frame; handedness is
// converted once by the enclosing model. Tooling dimensions are reconstructed.
const rect=(w,d)=>[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]];
function coil(h,id,p,r,length,turns,wireRadius,mat='copper'){
 const points=Array.from({length:turns*12+1},(_,i)=>{const u=i/(turns*12),a=u*turns*Math.PI*2;return new T.Vector3(p[0]+Math.cos(a)*r,p[1]+(u-.5)*length,p[2]+Math.sin(a)*r);});
 h.add(id,new T.TubeGeometry(new T.CatmullRomCurve3(points),turns*16,wireRadius,6,false),mat);
}
function diode(h,id,p){
 h.cyl(id,.00115,.005,p,'phenolic');h.cyl(id,.00119,.00055,[p[0]-.0017,p[1],p[2]],'zinc');
 for(const s of[-1,1])h.tube(id,[[p[0]+s*.0025,p[1],p[2]],[p[0]+s*.005,p[1],p[2]],[p[0]+s*.006,p[1]-.004,p[2]]],.00025,'zinc');
}
function receptacle(h,id,p){
 const [x,y,z]=p;
 // Open folded socket, spring tongue, seam, conductor crimp and insulation wings.
 h.box(id,[.0047,.006,.0003],[x,y,z-.0008],'zinc');
 for(const s of[-1,1])h.box(id,[.0003,.006,.0018],[x+s*.0022,y,z],'zinc');
 h.box(id,[.0037,.0045,.00025],[x,y-.0001,z+.0007],'zinc',[.09,0,0]);
 h.box(id,[.002,.003,.0003],[x,y-.004,z-.0008],'zinc');
 // Continuous stamped spine joins both crimp zones to the receptacle.
 // Without this strip the insulation-support wings floated below the tail.
 h.box(id,[.002,.007,.0003],[x,y-.0065,z-.0008],'zinc');
 for(const s of[-1,1]){
  h.box(id,[.00035,.0028,.0018],[x+s*.001,y-.006,z],'copper',[0,s*.35,0]);
  h.box(id,[.00035,.002,.0023],[x+s*.0015,y-.009,z],'zinc',[0,s*.3,0]);
 }
}
function socket(h,lt,id,latch,contacts,terminals,p){
 const [x,y,z]=p,groups=Object.groupBy(terminals,t=>t.cavity.split(' ')[0]);
 for(const row of Object.values(groups)){
  const min=Math.min(...row.map(t=>t.x)),max=Math.max(...row.map(t=>t.x)),cx=x+(min+max)/2,cz=z+row[0].z;
  // Cavities stay open at both ends; partitions are actual solid geometry.
  lt.plate(id,rect(max-min+.009,.010),row.map(t=>rect(.006,.004).map(([a,b])=>[a+t.x-(min+max)/2,b])),.010,[cx,y-.034,cz],'plastic','y');
  h.box(latch,[.003,.011,.001],[cx,y-.032,cz+.006],'plastic',[],{},.0003);
  h.box(latch,[.004,.0015,.002],[cx,y-.027,cz+.0055],'plastic',[],{},.0003);
  for(const t of row)receptacle(h,contacts,[x+t.x,y-.030,z+t.z]);
 }
}
function stripedWire(h,id,points,r,material,stripe=false){
 h.tube(id,points,r,material);
 if(stripe)h.tube(id,points.map(([x,y,z])=>[x,y+r*.91,z]),r*.27,'wireWhite');
}
export function motorDisconnect(side){const s=side==='left'?1:-1;return[s*.277,.544,-1.331];}

export function buildHeadlightRelays(h,lt){
 const {box,cyl,tube}=h,{plate,frame,sleeve,screw}=lt,id=k=>'hl-'+k;
 for(const key of['left','right','isolation']){
  const isolation=key==='isolation',s=key==='right'?-1:1,[x,y,z]=relayPlacements[key],w=isolation?.041:.029,d=.032;
  const prefix=isolation?'isolation':key+'-relay',part=k=>id(prefix+'-'+k),cover=id(isolation?'isolation-relay':key+'-relay'),terminals=isolation?isolationTerminals:actuatorTerminals;
  // Hollow cover, closed roof and molded rim; no solid block hiding internals.
  const shell=frame(cover,w,d,.0013,.037,[x,y+.001,z],'plastic');shell.rotation.x=Math.PI/2;
  box(cover,[w,.0015,d],[x,y+.020,z],'plastic',[],{},.001);
  const rim=frame(cover,w+.001,d+.001,.002,.002,[x,y-.018,z],'plastic');rim.rotation.x=Math.PI/2;
  const holes=terminals.map(t=>rect(.0055,.0016).map(([a,b])=>[a+t.x,b+t.z]));
  plate(part('base'),rect(w+.002,d+.001),holes,.003,[x,y-.021,z],'phenolic','y');
  const cx=x-.006,cy=y+.001;
  sleeve(part('coil'),.0052,.0024,.014,[cx,cy,z],'pickupPlastic','y');
  for(const e of[-1,1])sleeve(part('coil'),.0071,.0024,.001,[cx,cy+e*.0075,z],'pickupPlastic','y');
  coil(h,part('coil'),[cx,cy,z],.00565,.013,24,.00025);
  for(const e of[-1,1])tube(part('coil'),[[cx+.0057,cy+e*.006,z],[cx+.009,cy+e*.006,z-.004],[cx+.009,y-.019,z-.004]],.00025,'copper');
  cyl(part('core'),.0022,.019,[cx,cy+.001,z],'rotor',[0,0,0]);
  box(part('core'),[.002,.028,.011],[cx-.0057,y-.003,z],'zinc');
  box(part('core'),[.013,.002,.011],[cx,y-.016,z],'zinc');
  box(part('armature'),[.018,.001,.010],[x-.002,y+.012,z],'zinc',[0,0,-.045]);
  cyl(part('armature'),.0009,.010,[cx-.005,y+.011,z],'zinc',[Math.PI/2,0,0]);
  coil(h,part('armature'),[cx-.005,y+.003,z+.006],.0012,.010,7,.00015,'zinc');
  for(const e of[-1,1]){
   const cz=z+e*.008;
   box(part('contacts'),[.002,.015,.003],[x+.007,y-.007,cz],'copper',[0,0,-.12]);
   for(const dx of[.004,.010]){
    box(part('contacts'),[.001,.017,.004],[x+dx,y-.006,cz],'copper');
    cyl(part('contacts'),.0015,.0006,[x+dx+(dx<.007?.0007:-.0007),y+.001,cz],'zinc');
   }
  }
  box(part('contacts'),[.003,.002,.021],[x+.0065,y+.004,z],'phenolic');
  box(part('contacts'),[.002,.006,.003],[x+.0065,y+.008,z],'phenolic');
  diode(h,part('diode'),[x-.001,y-.013,z+.011]);
  if(isolation)diode(h,id('isolation-steering-diode'),[x+.009,y+.008,z-.011]);
  for(const t of terminals){
   const tid=part('terminal-'+t.key);
   box(tid,[.0048,.012,.0007],[x+t.x,y-.024,z+t.z],'zinc');
   box(tid,[.003,.006,.0007],[x+t.x,y-.015,z+t.z],'copper');
  }
  if(isolation)socket(h,lt,id('isolation-socket'),part('socket-latches'),part('socket-contacts'),terminals,[x,y,z]);
  else{
   socket(h,lt,id(key+'-relay-socket'),part('socket-latches'),part('socket-contacts'),terminals.filter(t=>t.key.startsWith('c1')),[x,y,z]);
   socket(h,lt,part('motor-socket'),part('socket-latches'),part('socket-contacts'),terminals.filter(t=>t.key.startsWith('c2')),[x,y,z]);
  }
  for(const t of terminals){
   if(!isolation&&t.key.startsWith('c2'))continue; // These are the motor's green/gray conductors.
   let points=[[x+t.x,y-.039,z+t.z],[x+t.x,y-.055,z+t.z],[s*.342+t.x,.500,-1.34+t.z]];
   if(isolation&&['c2-b','c2-c'].includes(t.key)){
    const side=t.key==='c2-b'?'right':'left',[dx,dy,dz]=motorDisconnect(side),endS=side==='left'?1:-1;
    const join=[x+t.x,.512,-1.284];
    points=[[x+t.x,y-.039,z+t.z],[x+t.x,y-.055,z+t.z],join];
    stripedWire(h,id('isolation-'+side+'-output'),[join,[.34,.49,-1.355],...(side==='right'?[[0,.48,-1.39],[-.34,.49,-1.355]]:[]),[dx-endS*.025,dy-.014,dz+.025],[dx,dy,dz+.013]],.00145,t.material,t.stripe);
   }
   stripedWire(h,part('pigtails'),points,.00145,t.material,t.stripe);
  }
  const bracket=id(isolation?'isolation-bracket':key+'-relay-bracket');
  plate(bracket,rect(w+.008,.058),[[0,.023,.003]],.0015,[x,y,z+.019],'zinc');
  screw(bracket,[x,y+.023,z+.0215],.004);
  // Bracket wraps outside the plug cavities rather than crossing the terminals.
  for(const e of[-1,1])box(bracket,[.003,.002,.025],[x+e*(w/2+.002),y-.023,z+.004],'zinc');
 }
 for(const s of[-1,1]){
  const side=s===1?'left':'right',gid=id(side+'-ground');
  sleeve(gid,.006,.003,.001,[s*.663,.475,-1.518],'zinc','y');screw(gid,[s*.663,.477,-1.518],.004,'y');
  tube(gid,[[s*.663,.475,-1.518],[s*.631,.466,-1.49],[s*.56,.473,-1.38],[s*.34,.500,-1.34]],.002,'wire');
 }
 tube(id('forward-harness'),[[.57,.53,-1.25],[.47,.507,-1.29],[.34,.5,-1.34],[0,.48,-1.39],[-.34,.5,-1.34],[-.54,.51,-1.30]],.006,'wire');
 for(const s of[-1,1])tube(id('forward-harness'),[[s*.34,.50,-1.34],[s*.39,.48,-1.48],[s*.43,.58,-1.56],[s*.45,.67,-1.46]],.004,'wire');
 for(const x of[-.28,0,.28]){box(id('forward-harness'),[.017,.009,.020],[x,.486,-1.388],'plastic',[],{},.002);screw(id('forward-harness'),[x,.492,-1.388],.002,'y');}
 // GM 8A-201-9 D locates C/D in the front lighting harness, inboard of
 // the brake master cylinder. This is distinct from the rear battery link B.
 for(const [i,key]of ['c','d'].entries()){
  const x=.295+i*.024,y=.527,z=-.810,part=suffix=>id('link-'+key+'-'+suffix);
  tube(part('insulation'),[[x,y,z],[x+.003,y-.003,z-.035],[x,y,z-.070]],.0013,'wireRed');
  tube(part('conductor'),[[x,y,z+.004],[x+.003,y-.003,z-.035],[x,y,z-.074]],Math.sqrt(.35/Math.PI)/1000,'copper');
  for(const end of[z,z-.070]){
   sleeve(part('splices'),.0017,.0006,.006,[x,y,end],'copper','z');
   sleeve(part('splices'),.0024,.0018,.010,[x,y,end],'rubber','z');
  }
  const side=key==='c'?1:-1;
  tube(part('feed'),[[x,y,z-.075],[x,.511,-1.08],[.34,.50,-1.34],...(side<0?[[0,.48,-1.39]]:[]),[side*.342-.009,.500,-1.348]],.00145,'wireRed');
  tube(part('feed'),[[x,y,z+.005],[x+.004,y+.004,z+.034],[.334+i*.008,.535,-.731]],.00145,'wireRed');
 }
}

export function buildHeadlightMotorLeads(h,lt,side,s){
 const {box,tube,cyl}=h,{frame,sleeve}=lt,id=k=>'hl-'+side+'-'+k,x=s*.351,z=-1.403,sx=x-s*.013,sy=.579;
 const [rx,ry,rz]=relayPlacements[side],[dx,dy,dz]=motorDisconnect(side);
 for(const [i,color]of ['white','green','gray'].entries()){
  const offset=(i-1)*.005,start=[sx-s*.003,sy-.011,z+offset];let end,way;
  if(color==='white'){end=[dx,dy,dz-.012];way=[x-s*.055,.532,-1.368];}
  else{const t=actuatorTerminals.find(t=>t.color===color);end=[rx+t.x,ry-.039,rz+t.z];way=[x-s*.021,.517,-1.346+offset];}
  tube(id('lead-'+color),[start,[x-s*.041,.557,z+offset],way,end],.00145,motorLeadMaterials[color]);
  sleeve(id('lead-grommet'),.0025,.0015,.005,start,'rubber');
 }
 // Short hollow protective sleeve, separate from the colored conductors.
 sleeve(id('motor-leads'),.0083,.0063,.013,[x-s*.036,.557,z],'rubber');
 for(const e of[-1,1]){
  frame(id('disconnect'),.010,.008,.0015,.011,[dx,dy,dz+e*.006],'plastic');
  box(id('disconnect'),[.003,.001,.009],[dx,dy+.005,dz+e*.005],'plastic',[],{},.0003);
 }
 box(id('disconnect'),[.004,.002,.002],[dx,dy+.004,dz],'plastic',[],{},.0003);
 box(id('disconnect-contacts'),[.004,.00065,.010],[dx,dy,dz-.003],'zinc');
 // The one-cavity disconnect lies along Z rather than the relay's Y axis.
 box(id('disconnect-contacts'),[.0048,.0003,.007],[dx,dy-.001,dz+.005],'zinc');
 for(const e of[-1,1])box(id('disconnect-contacts'),[.0003,.002,.007],[dx+e*.00225,dy,dz+.005],'zinc');
 box(id('disconnect-contacts'),[.0038,.0003,.005],[dx,dy+.0008,dz+.005],'zinc');
 for(const e of[-1,1]){cyl(id('disconnect-contacts'),.0012,.003,[dx,dy,dz+e*.011],'copper',[Math.PI/2,0,0]);}
 // Functional breaker representation near the brush carrier; not a measured
 // replacement part or a claimed disassembly instruction for the sealed unit.
 box(id('motor-breaker'),[.002,.008,.012],[sx-s*.003,sy-.018,z],'pickupPlastic');
 box(id('motor-breaker'),[.0005,.003,.012],[sx-s*.0045,sy-.018,z],'copper');
 cyl(id('motor-breaker'),.0013,.001,[sx-s*.005,sy-.018,z+.004],'zinc');
}
