// Fast isolated-model diagnostics. Final acceptance still uses the main app.
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {runId} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';
const kind=process.argv[2]||'wipers',section=process.argv[3]||null;
const configuration=JSON.parse(process.argv[4]||'{}'),cameraDirection=JSON.parse(process.argv[5]||'[-1,0.70,-1.15]'),sourceSha256=sourceFingerprint();
if(!Array.isArray(cameraDirection)||cameraDirection.length!==3||!cameraDirection.every(Number.isFinite)||Math.hypot(...cameraDirection)===0)throw new Error('Camera direction must be a nonzero three-number array');
const directory='artifacts/family-diagnostics/'+runId()+'-'+kind;await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/home/hesh913/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',env:{...process.env,LD_LIBRARY_PATH:'/snap/chromium/current/usr/lib/x86_64-linux-gnu:/snap/gnome-46-2404/current/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5185/package.json');
 await page.setContent('<!doctype html><html><body style="margin:0;background:#e8edf0"><div id="label" style="position:absolute;top:20px;left:24px;font:18px system-ui;color:#22313a"></div></body></html>');
 const result=await page.evaluate(async({kind,section,configuration,cameraDirection})=>{
  const geometryModule=await(await fetch('/src/geometry.js')).text();
  const threeImport=geometryModule.match(/import \* as T from ["']([^"']+)["']/)?.[1];
  if(!threeImport)throw Error('Could not resolve the app Three.js instance');
  const T=await import(threeImport);
  const {detailMembers,detailAvailable}=await import('/src/inspection-catalog.js');
  const {defaultConfiguration}=await import('/src/configuration.js');
  const config={...defaultConfiguration,...configuration};let model,parts;
  if(kind==='doors'){
   const {doorMechanismParts}=await import('/src/door-mechanism-catalog.js');parts=doorMechanismParts;
   const {buildDoorMechanisms}=await import('/src/door-mechanism-detail.js');
   const {geometryTools}=await import('/src/geometry.js');const {createMaterials}=await import('/src/materials.js');
   const {bodyPoint}=await import('/src/body-datums.js');const {correctLegacyHandedness}=await import('/src/vehicle-frame.js');
   const root=new T.Group(),groups=new Map(parts.map(p=>{const g=new T.Group();g.userData={partId:p.id,spread:new T.Vector3(...p.spread)};root.add(g);return[p.id,g];}));
   const h=geometryTools(groups,createMaterials());h.mapAdded(()=>buildDoorMechanisms(h),bodyPoint);h.optimize();correctLegacyHandedness(groups);model={root,groups};
  }else{
   const options={wipers:['wiper','createWiperDetail','wiperParts'],spare:['spare','createSpareDetail','spareParts'],headlights:['headlight','createHeadlightDetail','headlightParts']};
   if(!options[kind])throw Error('Unknown diagnostic family '+kind);const [name,builder,catalog]=options[kind];
   parts=(await import('/src/'+name+'-catalog.js'))[catalog];model=(await import('/src/'+name+'-detail.js'))[builder]();
  }
  const members=section?new Set(detailMembers(section).map(p=>p.id)):new Set(parts.map(p=>p.id));
  for(const p of parts){const g=model.groups.get(p.id);g.visible=members.has(p.id)&&detailAvailable(p,config);g.traverse(m=>{if(!m.isMesh)return;if(m.userData.option)m.visible=config[m.userData.option]===m.userData.value;if(m.material.transmission){m.material.transmission=0;m.material.transparent=true;m.material.opacity=.30;m.material.depthWrite=false;}});}
  const scene=new T.Scene();scene.background=new T.Color('#e8edf0');scene.add(model.root,new T.HemisphereLight(0xffffff,0x53616d,2));
  for(const [position,intensity]of [[[-3,5,-4],3],[[4,2,3],1.5]]){const light=new T.DirectionalLight(0xffffff,intensity);light.position.set(...position);scene.add(light);}
  const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1280,960);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;document.body.append(renderer.domElement);
  const camera=new T.PerspectiveCamera(34,1280/960,.001,100);
  const render=async explode=>{
   for(const g of model.groups.values())g.position.copy(g.userData.spread||new T.Vector3()).multiplyScalar(explode);
   model.root.updateMatrixWorld(true);const bounds=new T.Box3();model.root.traverseVisible(m=>{if(!m.isMesh)return;m.geometry.computeBoundingBox();bounds.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld));});
   if(bounds.isEmpty())throw Error('No visible diagnostic geometry');const centre=bounds.getCenter(new T.Vector3()),radius=bounds.getSize(new T.Vector3()).length()/2;
   camera.position.copy(centre).addScaledVector(new T.Vector3(...cameraDirection).normalize(),radius/Math.sin(T.MathUtils.degToRad(17))*1.10);camera.lookAt(centre);camera.updateProjectionMatrix();
   document.querySelector('#label').textContent=kind+' · '+(section||'complete assembly')+' · '+(explode?'exploded':'assembled');renderer.render(scene,camera);
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  };
  window.__familyRender=render;await render(0);
  return {kind,section,configuration:config,cameraDirection,visible:parts.filter(p=>model.groups.get(p.id).visible).map(p=>p.id),triangles:renderer.info.render.triangles};
 },{kind,section,configuration,cameraDirection});
 await page.screenshot({path:directory+'/assembled.png'});
 await page.evaluate(()=>window.__familyRender(.65));await page.screenshot({path:directory+'/exploded.png'});
 const report={date:new Date().toISOString(),sourceSha256,unchanged:sourceFingerprint()===sourceSha256,...result,errors,directory,limits:'Isolated diagnostic renderer; neutral lighting, no vehicle context, no proof of factory tooling or physical operation. Captures must be opened before recording visual review.'};
 await writeFile(directory+'/report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}
