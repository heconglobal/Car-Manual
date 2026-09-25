import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {estimatedCurbRise,exteriorLampNominal,bodyPoint} from '../src/body-datums.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
import {rearFace} from '../src/fascias.js';
const arg=process.argv.indexOf('--baseline'),baseline=arg<0?null:process.argv[arg+1];
const src=file=>pathToFileURL(resolve(baseline||'src',file)).href;
const {createBodyDetail}=await import(src('body-detail.js')),{createLightingDetail}=await import(src('lighting-detail.js'));
const body=createBodyDetail(),lighting=createLightingDetail();body.root.updateMatrixWorld(true);lighting.root.updateMatrixWorld(true);
const bounds=id=>new T.Box3().setFromObject(body.groups.get('bd-skin-'+id));
const checks=[],samples=[];
function check(name,fn){try{fn();checks.push({name,status:'passed'});}catch(e){checks.push({name,status:'failed',error:e.message});}}
check('Split rear pads are tall, raised above the lower fascia and separated across the plate opening',()=>{
 const left=bounds('rear-pad-left'),right=bounds('rear-pad-right');assert(left.max.x<-.16&&right.min.x>.16,'pads bridge the plate opening');for(const b of [left,right]){assert(b.getSize(new T.Vector3()).y>.15,'rear pad remains a thin strip');assert(b.max.y>.49,'rear pad positioned too low');}
});
check('Rear plate mounting area has full height and sits behind the bumper-pad faces',()=>{const p=bounds('rear-plate-mount');assert(p.getSize(new T.Vector3()).y>.17,'flattened plate mounting area');assert(p.max.z<Math.min(bounds('rear-pad-left').max.z,bounds('rear-pad-right').max.z)-.018,'plate recess flattened into pads');});
check('Curved outer rear lenses cover the internal red/reverse optics at sampled face positions',()=>{
 const ray=new T.Raycaster();let blocked=0;
 for(const [side,s]of [['left',-1],['right',1]])for(const x of [.10,.30,.52,.66])for(const y of [.666,.706,.746]){
  ray.set(new T.Vector3(s*x,y,2.4),new T.Vector3(0,0,-1));
  const outer=lighting.groups.get('lt-rear-'+side+'-outer-lens').children.filter(m=>m.userData.materialName==='tailOuter');
  const inner=['red-lens','reverse-lens'].flatMap(k=>lighting.groups.get('lt-rear-'+side+'-'+k).children);
  const a=ray.intersectObjects(outer,false)[0],b=ray.intersectObjects(inner,false)[0];
  const clear=!!a&&!!b&&a.point.z>b.point.z+.0005;
  samples.push({side,x:s*x,y,outerZ:a?.point.z??null,innerZ:b?.point.z??null,clearanceMm:a&&b?(a.point.z-b.point.z)*1000:null,status:clear?'passed':'failed'});if(!clear)blocked++;
 }
 assert.equal(blocked,0,'outer cap cuts behind inner optics or leaves an opening');
});
check('Rear painted fascia leaves the sampled lamp faces open',()=>{const ray=new T.Raycaster();for(const s of [-1,1])for(const x of [.15,.38,.61])for(const y of [.667,.742]){ray.set(new T.Vector3(s*x,y,2.4),new T.Vector3(0,0,-1));assert.equal(ray.intersectObjects(body.groups.get('bd-skin-rear-fascia').children,false).length,0,'paint blocks the taller rear lamp aperture');}});
check('Lower centre nose has a formed bumper face instead of the old deeply tucked point',()=>{const ray=new T.Raycaster(new T.Vector3(0,.325,-2.4),new T.Vector3(0,0,1)),hit=ray.intersectObjects(body.groups.get('bd-skin-nose').children,false)[0];assert(hit,'missing lower front surface');assert(hit.point.z-bounds('nose').min.z<.15,'lower nose is tucked more than the reconstruction bound');});
check('The planar registration plate remains visible through the fascia recess',()=>{
 const group=body.groups.get('bd-skin-rear-plate-mount'),plate=group.children.filter(m=>m.userData.label==='PONTIAC');assert(plate.length,'missing planar plate face');
 for(const x of [-.12,0,.12])for(const y of [.374,.438,.502]){const ray=new T.Raycaster(new T.Vector3(x,y,2.4),new T.Vector3(0,0,-1)),hit=ray.intersectObjects(plate,false)[0];assert(hit,'plate graphic missing at sample');const obstructed=ray.intersectObjects([...body.groups.get('bd-skin-rear-fascia').children,...group.children.filter(m=>!plate.includes(m))],false).some(h=>h.point.z>hit.point.z+.0001);assert(!obstructed,'curved fascia/backing covers flat plate');}
});
check('License-light housings remain behind the painted upper recess edge',()=>{
 let sampled=0;
 for(const side of ['left','right'])for(const m of lighting.groups.get('lt-license-'+side+'-housing').children){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld);if(p.y<=.54)continue;sampled++;const face=bodyPoint(rearFace(p.x,p.y));assert(p.z<face[2]-.002,'license housing protrudes through fascia above plate');}}
 assert(sampled>0,'upper housing was not sampled');
});
const lampDatums=[];
const bulbCentre=id=>{const b=new T.Box3();for(const m of lighting.groups.get(id).children)if(m.userData.materialName==='bulbGlass')b.expandByObject(m);assert(!b.isEmpty(),id);return b.getCenter(new T.Vector3());};
check('Front and rear direction-indicator bulb offsets follow the 1985 coupe table',()=>{
 for(const side of ['left','right'])for(const [id,target]of [['lt-front-'+side+'-bulb',exteriorLampNominal.frontTurnOffset],['lt-rear-'+side+'-turn-bulb',exteriorLampNominal.rearTurnOffset]]){
  const p=bulbCentre(id),actual=Math.abs(p.x);lampDatums.push({id,quantity:'absolute lateral offset',actualMm:actual*1000,nominalMm:target*1000,basis:'MVMA PDF26, independent of load-height approximation'});assert(Math.abs(actual-target)<.0003,id+' lateral offset');
 }
});
check('Outside tail bulbs retain the specified lateral location and documented load conversion',()=>{
 for(const side of ['left','right']){const id='lt-rear-'+side+'-tail-bulb',p=bulbCentre(id),curb=p.y+estimatedCurbRise(p.z);
  lampDatums.push({id,quantity:'absolute lateral offset',actualMm:Math.abs(p.x)*1000,nominalMm:exteriorLampNominal.tailOutside*1000,basis:'MVMA PDF26'});
  lampDatums.push({id,quantity:'height after estimated curb conversion',actualMm:curb*1000,nominalMm:exteriorLampNominal.tailCurb*1000,basis:'Published curb datum; interpolated load conversion, not exact suspension geometry'});
  assert(Math.abs(Math.abs(p.x)-exteriorLampNominal.tailOutside)<.0003,id+' lateral offset');assert(Math.abs(curb-exteriorLampNominal.tailCurb)<.002,id+' load convention');
 }
});
check('Marker bulbs use source curb heights with an explicit reconstructed load correction',()=>{
 for(const side of ['left','right'])for(const [end,target]of [['front',exteriorLampNominal.frontMarkerCurb],['rear',exteriorLampNominal.rearMarkerCurb]]){const id='lt-marker-'+end+'-'+side+'-bulb',p=bulbCentre(id),actual=p.y+estimatedCurbRise(p.z);lampDatums.push({id,quantity:'height after estimated curb conversion',actualMm:actual*1000,nominalMm:target*1000,basis:'Published curb datum; interpolated load conversion, not exact suspension geometry'});assert(Math.abs(actual-target)<.002,id+' load convention');}
});
check('Each rear lamp has three red-chamber bulbs and a separate reverse bulb with matching sockets',()=>{
 for(const side of ['left','right']){
  const centers=['reverse','inner-stop','turn','tail'].map(key=>{const stem='lt-rear-'+side+'-'+key;assert(lighting.groups.get(stem+'-bulb')?.children.length,stem+' bulb missing');assert(lighting.groups.get(stem+'-socket')?.children.length,stem+' socket missing');return Math.abs(bulbCentre(stem+'-bulb').x);});
  for(let i=1;i<centers.length;i++)assert(centers[i]-centers[i-1]>.10,'bulb chambers overlap or ordering is wrong');
 }
});
check('Outer covers transmit the inner optics and the optical grid belongs to the inner inserts',()=>{
 for(const side of ['left','right']){
  const outer=lighting.groups.get('lt-rear-'+side+'-outer-lens').children;
  const clear=outer.filter(m=>m.userData.materialName==='tailOuter');assert(clear.length);
  for(const m of clear){assert(m.material.transparent&&m.material.opacity<.4,'near-opaque outer cover obscures inner lenses');assert(!m.material.depthWrite,'outer cover blocks later transparent geometry');}
  assert(!outer.some(m=>['lensGrid','tailGrid'].includes(m.userData.materialName)),'grid still sits on outside cover');
  for(const key of ['red-lens','reverse-lens'])assert(lighting.groups.get('lt-rear-'+side+'-'+key).children.some(m=>m.userData.materialName==='tailGrid'),'missing inner optical structure');
 }
});
check('Wider tapered lens ends are visible through the fitted fascia apertures',()=>{
 for(const side of [-1,1])for(const [x,y]of [[.735,.657],[.745,.706],[.745,.747],[.026,.657],[.026,.747]]){
  const ray=new T.Raycaster(new T.Vector3(side*x,y,2.4),new T.Vector3(0,0,-1));
  assert.equal(ray.intersectObjects(body.groups.get('bd-skin-rear-fascia').children,false).length,0,'paint remains across lamp perimeter');
 }
});
check('Rear painted apron continues below the pads and meets both quarter lower edges',()=>{
 const fascia=bounds('rear-fascia');assert(fascia.min.y<.26,'rear apron remains cropped at bumper datum');
 for(const side of ['left','right']){const pad=bounds('rear-pad-'+side);assert(pad.min.y-fascia.min.y>.08,'missing painted lower skirt');}
 const ray=new T.Raycaster();for(const x of [-.65,0,.65]){ray.set(new T.Vector3(x,.280,2.4),new T.Vector3(0,0,-1));assert(ray.intersectObjects(body.groups.get('bd-skin-rear-fascia').children,false).length,'lower apron has an opening');}
});
check('Upper lamp corners roll into the top edge rather than retaining square outer corners',()=>{
 for(const side of ['left','right']){const sign=side==='left'?-1:1,outer=lighting.groups.get('lt-rear-'+side+'-outer-lens').children.filter(m=>m.userData.materialName==='tailOuter');
 const ray=new T.Raycaster(new T.Vector3(sign*.763,.761,2.4),new T.Vector3(0,0,-1));assert.equal(ray.intersectObjects(outer,false).length,0,'upper outboard corner remains too square');
 ray.set(new T.Vector3(sign*.725,.752,2.4),new T.Vector3(0,0,-1));assert(ray.intersectObjects(outer,false).length,'rounded corner removes too much lamp face');}
});
const {createExhaustDetail}=await import('../src/exhaust-detail.js');
const exhaust=createExhaustDetail();exhaust.root.updateMatrixWorld(true);
check('Rear outlet scallops clear the twin pipes and shields remain behind the painted apron',()=>{
 for(const side of [-1,1])for(const x of [.473,.547]){
  const ray=new T.Raycaster(new T.Vector3(side*x,.272,2.4),new T.Vector3(0,0,-1));
  assert.equal(ray.intersectObjects(body.groups.get('bd-skin-rear-fascia').children,false).length,0,'paint intersects twin-outlet clearance');
 }
 for(const id of ['ex-rear-left-fascia-shield','ex-rear-right-fascia-shield','ex-rear-fascia-nuts'])for(const m of exhaust.groups.get(id).children){const a=m.geometry.attributes.position;
  for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld),face=bodyPoint(rearFace(p.x,p.y));assert(p.z<face[2]-.005,id+' protrudes through lower fascia');}
 }
});
const status=checks.every(c=>c.status==='passed')?'passed':'failed';
const report={sourceSha256:baseline?null:sourceFingerprint(),baselineSource:baseline,reviewedAt:new Date().toISOString(),status,checks,opticalSamples:samples,lampDatums,limits:'Factory-reference bulb offsets, explicit approximate load conversion, shape regression and actual mesh overlap checks. These do not certify factory panel sections, optics, gaps or original hardware dimensions.'};
await writeFile('artifacts/rear-body-surface-'+(baseline?'baseline':'audit')+'.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!baseline&&status!=='passed')process.exitCode=1;
