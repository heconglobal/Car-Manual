// Regressions for visible defects that earlier nominal-dimension checks missed.
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
const baseline=process.env.FIERO_EXTERIOR_BASELINE,src=f=>pathToFileURL(resolve(baseline||'.','src',f));
const [{geometryTools},{buildGreenhouse},{buildStructure},{buildExterior},{buildDecklid},{bodyPoint},{deckHeight,exteriorBeltHeight},{rail,aPost,windshield}]=await Promise.all(['geometry.js','greenhouse.js','structure.js','exterior.js','decklid.js','body-datums.js','body-contours.js','glazing-contours.js'].map(f=>import(src(f))));
const groups=new Map(),get=groups.get.bind(groups);groups.get=id=>{if(!groups.has(id))groups.set(id,new T.Group());return get(id);};
const material=new T.MeshStandardMaterial({side:T.DoubleSide}),h=geometryTools(groups,new Proxy({},{get:()=>material}));h.label=()=>{};
h.mapAdded(()=>{buildGreenhouse(h,deckHeight);buildExterior(h);buildDecklid(h,deckHeight);},bodyPoint);buildStructure(h);
for(const g of groups.values())g.updateMatrixWorld(true);
const ray=new T.Raycaster(),checks=[];
const check=(name,fn)=>{try{checks.push({name,status:'passed',...fn()});}catch(e){checks.push({name,status:'failed',error:e.message});}};
const ensure=(a,details)=>{if(!a)throw Error(JSON.stringify(details));};
check('Steel roof channels remain behind the exterior roof skin',()=>{
 let samples=0,exposed=0,worst=0;const examples=[];
 // Vertical sightlines across the steel side-rail width, inside painted roof
 // shoulders. This detects rails sticking above the roof even with clear glass.
 for(const s of [-1,1])for(let i=2;i<=22;i++)for(const dx of [-.055,-.04,-.025]){
  const p=rail(i/24),q=bodyPoint([s*(p[0]+dx),1.4,p[2]]);ray.set(new T.Vector3(...q),new T.Vector3(0,-1,0));ray.far=.35;
  const skin=ray.intersectObject(groups.get('roof'),true).filter(h=>!h.object.userData.option||h.object.userData.value==='solid')[0],steel=ray.intersectObject(groups.get('spaceframe'),true)[0];
  if(!skin||!steel)continue;samples++;const protrusion=skin.distance-steel.distance;worst=Math.max(worst,protrusion);
  if(protrusion>.0005){exposed++;if(examples.length<5)examples.push({side:s,t:i/24,dx,protrusionMm:protrusion*1000});}
 }
 ensure(samples>80&&exposed===0,{samples,exposed,worstMm:worst*1000,examples});return{samples,exposed,worstProtrusionMm:worst*1000};
});
check('Side moldings reach each wheel opening without long bare-panel gaps',()=>{
 let samples=0,misses=0;const examples=[];
 for(const s of [-1,1])for(const rear of [false,true])for(const direction of [-1,1])for(const dy of [-.008,0,.008]){
  const centre=rear?1.1865:-1.1865;let lo=0,hi=.339;
  for(let i=0;i<40;i++){const d=(lo+hi)/2,z=centre+direction*d,edge=.308+Math.sqrt(.339**2-d*d);if(edge>exteriorBeltHeight(z)+dy)lo=d;else hi=d;}
  const z=centre+direction*((lo+hi)/2+.008),p=bodyPoint([s*1.1,exteriorBeltHeight(z)+dy,z]);ray.set(new T.Vector3(...p),new T.Vector3(-s,0,0));ray.far=.4;
  const id=(rear?'rear':'front')+'-molding-'+(s>0?'left':'right');samples++;
  if(!ray.intersectObject(groups.get(id),true).length){misses++;examples.push({id,direction,dy,z});}
 }
 ensure(misses===0,{samples,misses,examples});return{samples,misses,distanceFromWheelOpeningMm:8};
});
check('Steel A-pillars remain behind the sloping painted pillar lands',()=>{
 let samples=0,exposed=0;const examples=[];
 const land=(s,t,u)=>{const a=windshield(s>0?1:0,t),b=aPost(t);b[0]*=s;const p=a.map((x,k)=>T.MathUtils.lerp(x,b[k],u));p[0]+=s*.004*Math.sin(u*Math.PI);p[1]+=.003*Math.sin(u*Math.PI);return new T.Vector3(...bodyPoint(p));};
 for(const s of [-1,1])for(let i=2;i<40;i++)for(const u of [.2,.5,.8]){
  const t=i/40,p=land(s,t,u),n=land(s,t,u+.0001).sub(p).cross(land(s,t+.0001,u).sub(p)).normalize();if(n.dot(new T.Vector3(s,.4,-.4))<0)n.negate();
  ray.set(p.clone().addScaledVector(n,.06),n.clone().negate());ray.far=.12;const skin=ray.intersectObject(groups.get('roof'),true)[0],steel=ray.intersectObject(groups.get('spaceframe'),true)[0];samples++;
  if(!skin||(steel&&steel.distance<skin.distance-.0005)){exposed++;if(examples.length<6)examples.push({s,t,u,protrusionMm:skin&&steel?(skin.distance-steel.distance)*1000:null});}
 }
 ensure(exposed===0,{samples,exposed,examples});return{samples,exposed};
});
check('Deck grilles have inclined transverse vanes and a separate perforated screen',()=>{
 const measurements=[];
 for(const side of ['left','right']){
  const g=groups.get('deck-vent-'+side),faces=g.children.filter(m=>{m.geometry.computeBoundingBox();const b=m.geometry.boundingBox,dz=b.max.z-b.min.z,dx=b.max.x-b.min.x;return dx>.19&&dx>4*dz&&b.max.y-b.min.y>.014;});
  const screen=g.children.find(m=>{const p=m.geometry.attributes.position;return p.count>10000&&m.geometry.boundingBox.max.y-m.geometry.boundingBox.min.y<.045;});
  measurements.push({side,transverseInclinedFaces:faces.length,screenVertices:screen?.geometry.attributes.position.count||0});
 }
 ensure(measurements.every(m=>m.transverseInclinedFaces>=28&&m.screenVertices>10000),measurements);return{measurements,basis:'Installed original 1985 notchback grille photograph and loose P37 part. Orientation/construction regression, not a dimensioned casting.'};
});
const report={sourceSha256:baseline?null:sourceFingerprint(),harnessSha256:sourceFingerprint(),baseline:baseline||null,reviewedAt:new Date().toISOString(),status:checks.every(c=>c.status==='passed')?'passed':'failed',checks,limits:'Visible-interface regressions. These checks do not establish exact GM panel tooling, grille dimensions or factory acceptance.'};
const file='artifacts/exterior-reassessment-'+(baseline?'r11-baseline':'audit')+'.json';await preserveFiles([file],'before-exterior-reassessment-audit');await writeFile(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.status!=='passed'&&!baseline)process.exitCode=1;
