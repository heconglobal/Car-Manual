// Reconstructed static connections and brake-hose separation. This is not an
// articulated suspension simulation or a production fit/clearance certificate.
import assert from 'node:assert/strict';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
const startedAt=new Date().toISOString(),sourceSha256=sourceFingerprint();
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createBrakeDetail,brakeRoutes}=await import('../src/brake-detail.js');
const {brakeCorners}=await import('../src/brake-catalog.js');
const {createCoolingDetail,coolantRoutes}=await import('../src/cooling-detail.js');
const {createFuelDetail,fuelRoutes,fuelCouplerRoutes,fuelFilterSeats}=await import('../src/fuel-detail.js');
const {engineToVehicle,pumpInletEngine,transmissionToVehicle,transaxleDatum}=await import('../src/powertrain-layout.js');
const models={brakes:createBrakeDetail(),cooling:createCoolingDetail(),fuel:createFuelDetail()},checks=[];
for(const model of Object.values(models))model.root.updateMatrixWorld(true);
const point=p=>new T.Vector3(...p),distance=(a,b)=>point(a).distanceTo(point(b)),physical=([x,y,z])=>[-x,y,z];
function check(name,fn){try{checks.push({name,passed:true,...fn()});}catch(error){checks.push({name,passed:false,error:error.message});}}
function vertices(model,id){const out=[];const group=model.groups.get(id);assert(group,'Missing '+id);group.traverse(mesh=>{if(!mesh.isMesh)return;const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++)out.push(new T.Vector3().fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld));});assert(out.length,'Empty '+id);return out;}
function connected(name,a,b){check(name,()=>{const gapMetres=distance(a,b);assert(gapMetres<1e-8,'Disconnected endpoints: '+gapMetres+' m');return{gapMetres};});}
for(const [pipe,hose]of [['front-left-pipe','hose-fl'],['front-right-pipe','hose-fr'],['rear-left-pipe','hose-rl'],['rear-right-pipe','hose-rr']])connected('Brake line / flexible hose: '+hose,brakeRoutes[pipe].at(-1),brakeRoutes[hose][0]);
for(const pipe of ['rear-left-pipe','rear-right-pipe'])connected('Brake rear junction: '+pipe,brakeRoutes['rear-feed'].at(-1),brakeRoutes[pipe][0]);
for(const corner of brakeCorners){
 connected('Brake hose / caliper banjo: '+corner.id,brakeRoutes['hose-'+corner.id].at(-1),[-corner.sign*(corner.front?.609:.611),.295,corner.z+(corner.front?.098:-.098)]);
 check('Static brake hose / actual rotor friction-band separation: '+corner.id,()=>{
  const rotor=vertices(models.brakes,'br-'+corner.id+'-rotor');
  // Derive the friction annulus from the rotor mesh independently of its
  // catalog diameter. A radial cut excludes the central hub casting.
  const band=rotor.filter(p=>Math.hypot(p.y-.307,p.z-corner.z)>.09);
  const minX=Math.min(...band.map(p=>p.x)),maxX=Math.max(...band.map(p=>p.x));
  const inner=.072,outer=Math.max(...band.map(p=>Math.hypot(p.y-.307,p.z-corner.z)));
  const points=vertices(models.brakes,'br-hose-'+corner.id);let minimum=Infinity;
  for(const p of points){const radial=Math.hypot(p.y-.307,p.z-corner.z),axial=Math.max(minX-p.x,p.x-maxX,0),ring=Math.max(inner-radial,radial-outer,0);minimum=Math.min(minimum,Math.hypot(axial,ring));}
  assert(minimum>.002,'Hose touches friction band: '+minimum+' m');
  return{hoseVertices:points.length,minimumVertexDistanceMetres:minimum,rotorAxialRange:[minX,maxX],rotorOuterRadius:outer,limits:'Hose vertices versus reconstructed solid friction annulus at the static pose. Does not check full rotor/hub, tire, steering/suspension travel, flex or minimum hose bend radius.'};
 });
}
for(const [a,ai,b,bi]of [['front-inlet',-1,'pipe-left',0],['front-outlet',-1,'pipe-right',0],['pipe-left',-1,'rear-coupler',-1],['rear-coupler',0,'crossover',-1],['crossover',0,'rear-inlet',-1],['pipe-right',-1,'rear-outlet',0]])connected('Coolant route connection: '+a+' / '+b,coolantRoutes[a].at(ai),coolantRoutes[b].at(bi));
connected('Coolant outlet hose / engine pump inlet',coolantRoutes['rear-outlet'].at(-1),physical(engineToVehicle(pumpInletEngine)));
for(const circuit of ['feed','return'])connected('Fuel hard pipe / flexible coupler: '+circuit,fuelRoutes[circuit].at(-1),fuelCouplerRoutes[circuit][0]);
connected('Fuel return coupler / engine hose',fuelCouplerRoutes.return.at(-1),fuelRoutes['return-hose'][0]);
connected('Fuel feed coupler / filter inlet',fuelCouplerRoutes.feed.at(-1),fuelFilterSeats.inlet);
connected('Fuel filter outlet / engine feed hose',fuelFilterSeats.outlet,fuelRoutes['feed-hose'][0]);
check('Fuel filter fitting seats meet the independently constructed filter mesh',()=>{
 const vs=vertices(models.fuel,'fu-line-filter');const samples=[];
 for(const [name,seat]of Object.entries(fuelFilterSeats)){
  const plane=vs.filter(p=>Math.abs(p.z-seat[2])<1e-7);assert(plane.length>8,name+' has no filter end face');
  const radial=plane.map(p=>Math.hypot(p.x-seat[0],p.y-seat[1]));
  assert(Math.min(...radial)>=.0029&&Math.max(...radial)<=.0051,name+' is not at the small open filter neck');
  samples.push({name,vertices:plane.length,minRadius:Math.min(...radial),maxRadius:Math.max(...radial)});
 }
 return{samples};
});
check('Fuel and coolant route sampling is finite and remains off the ground',()=>{
 let samples=0,minY=Infinity;for(const [family,routes]of [['fuel',fuelRoutes],['cooling',coolantRoutes],['brakes',brakeRoutes]])for(const [name,route]of Object.entries(routes)){
  const curve=new T.CatmullRomCurve3(route.map(point));for(let i=0;i<=200;i++){const p=curve.getPoint(i/200);assert(p.toArray().every(Number.isFinite),family+' '+name);assert(p.y>.05,family+' '+name+' crosses ground');minY=Math.min(minY,p.y);samples++;}
 }
 return{samples,minCentrelineHeightMetres:minY,limits:'Sampled route centreline versus z=ground datum; excludes tube radius, shields, body collisions, thermal clearance and dynamic movement.'};
});
connected('Engine flywheel / transmission input axis',engineToVehicle([.231,1.05,0]),transmissionToVehicle([-.018,...transaxleDatum.input]));
const unchanged=sourceFingerprint()===sourceSha256;
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,unchanged,status:unchanged&&checks.every(c=>c.passed)?'passed':'failed',scope:'Reconstructed static circuit continuity and selected geometric interfaces',checks,remaining:['Measured engine/transaxle/cradle mounting hard points and complete mount inventory','Calibrated steering angles and suspension travel, joint paths, stops and tire/body clearance','Brake-hose attachment movement, flex length, bend radius and interference throughout calibrated travel','Fuel/coolant hose and cable routes against all body, heat-shield, exhaust and powertrain surfaces','Original 1985 fitting dimensions, factory clearances and physical workshop validation']};
await preserveFiles(['artifacts/assembly-interface-audit.json'],'before-assembly-interface-audit');
await writeFile('artifacts/assembly-interface-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));for(const model of Object.values(models))model.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
if(report.status!=='passed')process.exitCode=1;
