import {loadWorkshop} from './workshop-loader.js';
import {framedDistance} from './mobile-framing.js';
import {disposeModel,allocationStats} from './model-resources.js';
import {interiorColor} from './interior-surfaces.js';
import {paints} from './configuration.js';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { textMaterial } from './materials.js';
import { parts } from './data.js';
import {detailParts,detailPartById,inDetailSection,familyFor,detailAvailable} from './inspection-catalog.js';

export async function createViewer(container, onSelect) {
 let disposed=false,frame=0;const cleanup=[];
 function release(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);for(const dispose of cleanup.reverse())try{dispose();}catch{}cleanup.length=0;container.setAttribute('aria-busy','false');}
 try{
 const startupStarted=performance.now();
 const loadingElement=container.querySelector('#loading'),loadingText=loadingElement?.querySelector('span');
 const progress=document.createElement('progress');progress.setAttribute('aria-label','Workshop geometry loading');loadingElement?.append(progress);
 loadingElement?.setAttribute('role','status');loadingElement?.setAttribute('aria-live','polite');container.setAttribute('aria-busy','true');
 const startupController=new AbortController(),cancelStartup=()=>{startupController.abort(new DOMException('Workshop page closed','AbortError'));release();};
 window.addEventListener('pagehide',cancelStartup,{once:true});
 cleanup.push(()=>{window.removeEventListener('pagehide',cancelStartup);startupController.abort(new DOMException('Workshop closed','AbortError'));});
 const updateProgress=({label,completed,total,detail})=>{
  if(startupController.signal.aborted)return;
  if(loadingText)loadingText.textContent=detail?`${label} · ${detail}`:label+'…';
  if(total){progress.max=total;progress.value=completed;}else progress.removeAttribute('value');
 };
 const paintProgress=async state=>{
  updateProgress(state);
  // Outer stages paint explicitly; the stream decoder yields between batches
  // and sends synchronous progress without queuing animation-frame promises.
  await new Promise((resolve,reject)=>{
   let nextFrame,timer;const signal=startupController.signal;
   const abort=()=>{cancelAnimationFrame(nextFrame);clearTimeout(timer);reject(signal.reason);};
   if(signal.aborted){abort();return;}signal.addEventListener('abort',abort,{once:true});
   nextFrame=requestAnimationFrame(()=>{timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},0);});
  });
 };
 const workshop=await loadWorkshop(paintProgress,{signal:startupController.signal,onProgress:updateProgress});
 const {vehicle,inspections,builders,detailAssets,initialization,familyBuildCounts}=workshop;
 cleanup.push(()=>{detailAssets.dispose();const models=[vehicle,...inspections.values()],owner=new T.Group();for(const model of models)owner.add(model.root);disposeModel({root:owner});for(const model of models){model.root.clear();model.groups.clear();}inspections.clear();builders.clear();});
 await paintProgress({label:'Preparing the first view',completed:1,total:1});
 const scene=new T.Scene();scene.background=new T.Color('#dededb');scene.fog=new T.Fog('#dededb',12,22);
 cleanup.push(()=>disposeModel({root:scene},[vehicle.root,...[...inspections.values()].map(model=>model.root)]));
 const camera=new T.PerspectiveCamera(37,1,.03,60);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
 cleanup.push(()=>{renderer.dispose();renderer.domElement.remove();});
 const gl=renderer.getContext(),debugInfo=gl.getExtension('WEBGL_debug_renderer_info');const softwareRenderer=debugInfo&&/SwiftShader|llvmpipe|Software/i.test(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
 // Software GL cannot sustain the additional full-scene passes used by
 // transmission, variance shadows, MSAA and SSAO at the same time. Keep the
 // complete geometry and PBR surfaces, with a cheaper raster path on that
 // renderer. Hardware rendering retains the studio-quality settings.
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,softwareRenderer?1:2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=softwareRenderer?T.PCFSoftShadowMap:T.VSMShadowMap;
 renderer.transmissionResolutionScale=softwareRenderer?.5:1;
 renderer.domElement.dataset.renderProfile=softwareRenderer?'software':'studio';
 renderer.shadowMap.autoUpdate=false;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
 renderer.domElement.setAttribute('aria-label','Interactive 3D model of the 1985 Pontiac Fiero. Drag to orbit, scroll to zoom. Components can also be selected in the assembly list.');
 renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;container.prepend(renderer.domElement);
 const pmrem=new T.PMREMGenerator(renderer);cleanup.push(()=>pmrem.dispose());const env=new RoomEnvironment();let envMap;try{envMap=pmrem.fromScene(env,.015);}finally{env.dispose();}cleanup.push(()=>envMap.dispose());scene.environment=envMap.texture;
 scene.environmentRotation.set(.4,.65,0);
 const hemisphere=new T.HemisphereLight('#e9f2ff','#595654',.55);scene.add(hemisphere);
 const sun=new T.DirectionalLight('#fff5e7',1.3);sun.position.set(-3,7,-4);sun.castShadow=true;sun.shadow.mapSize.set(softwareRenderer?1024:2048,softwareRenderer?1024:2048);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.003;sun.shadow.radius=10;sun.shadow.blurSamples=8;scene.add(sun,sun.target);
 const fill=new T.DirectionalLight('#d0deff',.55);fill.position.set(4,3,4);scene.add(fill);
 const floor=new T.Mesh(new T.PlaneGeometry(40,40),new T.MeshStandardMaterial({color:'#dededb',roughness:.57,metalness:.07}));floor.rotation.x=-Math.PI/2;floor.position.y=-.008;floor.receiveShadow=true;scene.add(floor);
 const grid=new T.GridHelper(12,48,'#9da7a5','#bcc4c1');grid.position.y=-.005;grid.material.transparent=true;grid.material.opacity=.18;grid.visible=false;scene.add(grid);
 function prepareSoftwareSurfaces(model){
  if(!softwareRenderer)return;
  model.traverse(o=>{if(!o.isMesh||!o.material.transmission)return;
   // Alpha glazing avoids a second complete scene render on software GL.
   // Keep PBR reflections and all lens/filament geometry; hardware uses IOR.
   const m=o.material;m.transmission=0;m.transparent=true;
   m.opacity=m.opacity<1?m.opacity:o.userData.materialName==='instrumentLens'?.08:o.userData.materialName==='glass'?.22:.30;
   m.depthWrite=false;m.needsUpdate=true;
   if(o.userData.original)Object.assign(o.userData.original,{opacity:m.opacity,transparent:true});
  });
 }
 const vehiclePartById=new Map(parts.map(p=>[p.id,p]));
 const {root,groups,configure}=vehicle;
 prepareSoftwareSurfaces(root);scene.add(root);
 for(const model of inspections.values()){prepareSoftwareSurfaces(model.root);model.root.visible=false;scene.add(model.root);}
 let inspection=null;
 const currentGroups=()=>current.assembly?inspection.groups:groups;
 const currentParts=()=>current.assembly?detailParts.filter(p=>p.family===familyFor(current.assembly).id):parts;
 const currentRoot=()=>current.assembly?inspection.root:root;
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:softwareRenderer?0:4});
 let composer;cleanup.push(()=>composer?composer.dispose():target.dispose());composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));
 const occlusion=new SSAOPass(scene,camera,1,1,16);cleanup.push(()=>occlusion.dispose());occlusion.kernelRadius=.13;occlusion.minDistance=.000025;occlusion.maxDistance=.004;composer.addPass(occlusion);
 const output=new OutputPass();cleanup.push(()=>output.dispose());composer.addPass(output);
 const antialias=new ShaderPass(FXAAShader);cleanup.push(()=>antialias.dispose());antialias.enabled=!!softwareRenderer;composer.addPass(antialias);
 const dimensions=new T.Group();scene.add(dimensions);
 const dimensionLine=(points)=>{const g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));dimensions.add(new T.Line(g,new T.LineBasicMaterial({color:'#617b72'})));};
 dimensionLine([[1.04,.03,-2.1105],[1.15,.03,-2.1105],[1.15,.03,1.9715],[1.04,.03,1.9715]]);
 dimensionLine([[-.99,.03,-1.1865],[-1.1,.03,-1.1865],[-1.1,.03,1.1865],[-.99,.03,1.1865]]);
 dimensionLine([[-.876,.03,-2.22],[-.876,.03,-2.30],[.876,.03,-2.30],[.876,.03,-2.22]]);
 for(const [text,pos,size] of [['4,082 mm',[1.28,.04,0],[.72,.14]],['2,373 mm',[-1.25,.04,0],[.72,.14]],['1,752 mm',[0,.04,-2.45],[.72,.14]]]){const m=new T.Mesh(new T.PlaneGeometry(...size),textMaterial(text,{background:'#dededb',foreground:'#516c62',font:'54px monospace'}));m.position.set(...pos);m.rotation.x=-Math.PI/2;dimensions.add(m);}dimensions.visible=false;
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.06;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.92;controls.target.set(0,.58,0);
 cleanup.push(()=>controls.dispose());
 const presets={home:[-4.9,2.35,-6.1],front:[.1,1.30,-7.1],rear:[-4.6,2.25,5.8],side:[-7.6,1.35,0],passenger:[7.6,1.35,0],top:[0,7.8,.001]};
 const portraitScale=(aspect=camera.aspect)=>Math.max(1,.95/aspect);
 const vehiclePreset=name=>{const centre=new T.Vector3(0,.58,0);return centre.clone().add(new T.Vector3(...(presets[name]||presets.home)).sub(centre).multiplyScalar(portraitScale()));};
 camera.position.copy(vehiclePreset('home'));
 let cameraGoal=null,targetGoal=null,current={system:'all',selected:null,hideBody:false,isolate:false,explode:0,labels:false,wireframe:false},dirty=true;
 let safeViewport=null,lastCanvasWidth=0,lastCanvasHeight=0,framingPart=null;
 let lastConfiguration='',inspectionRadius=.1,lastViewKey='',lastSceneKey='';
 new HDRLoader().load(`${import.meta.env.BASE_URL}assets/studio_small_09_1k.hdr`,texture=>{if(disposed){texture.dispose();return;}const next=pmrem.fromEquirectangular(texture);texture.dispose();envMap.dispose();envMap=next;scene.environment=next.texture;scene.environmentIntensity=.85;pmrem.dispose();dirty=true;renderer.domElement.dataset.lighting='hdr';},undefined,()=>{if(disposed)return;pmrem.dispose();renderer.domElement.dataset.lighting='fallback';});
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const labelLayer=document.createElement('div');labelLayer.className='model-labels';container.append(labelLayer);
 cleanup.push(()=>labelLayer.remove());
 const labels=new Map();
 function labelFor(part){
  if(labels.has(part.id))return labels.get(part.id);
  const el=document.createElement('button');el.type='button';el.className='model-label';el.textContent=part.name;el.dataset.part=part.id;el.addEventListener('click',e=>{e.stopPropagation();onSelect(part.id);});el.hidden=true;labelLayer.append(el);labels.set(part.id,el);return el;
 }
 function clearLabels(){for(const el of labels.values())el.remove();labels.clear();}
 const highlight=new T.Box3Helper(new T.Box3(),0xb84a31);highlight.visible=false;highlight.material.transparent=true;highlight.material.opacity=.6;scene.add(highlight);
 const raycaster=new T.Raycaster(),mouse=new T.Vector2();let down=null;
 function pointer(event) {const rect=renderer.domElement.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);const candidates=[];for(const g of currentGroups().values())if(g.visible&&(current.assembly||current.system==='all'||g.userData.system===current.system))g.traverse(o=>{if(o.isMesh&&o.visible)candidates.push(o)});return raycaster.intersectObjects(candidates,false)[0];}
 function visibleBounds(g,target=new T.Box3()){target.makeEmpty();g.traverseVisible(o=>{if(o.isMesh){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();target.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});return target;}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};cameraGoal=null;targetGoal=null;});
 renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<5){const hit=pointer(e);if(hit)onSelect(hit.object.userData.partId);}down=null;});
 renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=pointer(e)?'pointer':'grab';});
 renderer.domElement.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();cameraGoal=null;targetGoal=null;
  const delta=camera.position.clone().sub(controls.target);const spherical=new T.Spherical().setFromVector3(delta);
  if(e.key==='ArrowLeft')spherical.theta-=.1;if(e.key==='ArrowRight')spherical.theta+=.1;if(e.key==='ArrowUp')spherical.phi-=.1;if(e.key==='ArrowDown')spherical.phi+=.1;
  if(e.key==='+'||e.key==='=')spherical.radius*=.9;if(e.key==='-')spherical.radius*=1.1;spherical.phi=T.MathUtils.clamp(spherical.phi,.02,Math.PI*.92);spherical.radius=T.MathUtils.clamp(spherical.radius,current.assembly?.012:.45,12);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));
 });
 const familyLoads=new Map();
 let desired={...current},loading=false,pendingKey=null,pendingLoad=Promise.resolve(),pendingCamera=[],requestVersion=0,lastLoadMs=0,lastError=null;
 cleanup.push(()=>{requestVersion++;familyLoads.clear();clearLabels();});
 const status=document.createElement('div');status.className='model-loading';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
 status.style.cssText='position:absolute;left:50%;bottom:76px;transform:translateX(-50%);max-width:calc(100% - 32px);padding:10px 14px;border-radius:10px;background:#f5f3ee;color:#273336;box-shadow:0 2px 16px #0002;font:13px/1.4 system-ui;z-index:4;text-align:center';container.append(status);
 cleanup.push(()=>status.remove());
 function setLoading(value){loading=value;renderer.domElement.dataset.loading=String(value);container.setAttribute('aria-busy',String(value));}
 function restoreCamera(s){if(loading){pendingCamera.push(()=>restoreCamera(s));return;}framingPart=s.framingPart||null;setCameraFov(s.fov??37);refreshSafeViewport();cameraGoal=new T.Vector3(...s.position);targetGoal=new T.Vector3(...s.target);if(!current.assembly&&current.camera!=='cabin')cameraGoal.sub(targetGoal).multiplyScalar(portraitScale()/portraitScale(s.aspect??camera.aspect)).add(targetGoal);if(safeViewport?.mobile)frameMobileCurrent(cameraGoal.clone().sub(targetGoal).normalize());dirty=true;}
 function getLoadingStats(){return {strategy:'persistent',level:current.assembly?'detail:'+familyFor(current.assembly).id:'vehicle:all',overviewSource:'native-full',vehicleDelivery:vehicle.delivery,requested:desired.assembly?'detail:'+familyFor(desired.assembly).id:'vehicle:all',loading,lastError,lastLoadMs,initialization,detailAssets:detailAssets.getStats(),familyBuildCounts:{...familyBuildCounts},detailFamilies:[...inspections.keys()],vehicleChunk:'all',labelCount:labels.size,...allocationStats([vehicle,...inspections.values()]),renderer:{...renderer.info.memory},jsHeapBytes:performance.memory?.usedJSHeapSize??null};}
 async function getInspection(family){
  if(inspections.has(family))return inspections.get(family);
  if(familyLoads.has(family))return familyLoads.get(family);
  const load=(async()=>{
   const started=performance.now(),builder=builders.get(family);if(!builder)throw new Error('Unknown workshop family '+family);
   const model=await builder();
   if(disposed){disposeModel(model);return null;}
   prepareSoftwareSurfaces(model.root);model.root.visible=false;inspections.set(family,model);scene.add(model.root);
   familyBuildCounts[family]=(familyBuildCounts[family]||0)+1;initialization.buildCount++;lastLoadMs=performance.now()-started;
   return model;
  })();
  familyLoads.set(family,load);
  try{return await load;}finally{familyLoads.delete(family);}
 }
 function update(next){
  desired={...desired,...next};const family=desired.assembly?familyFor(desired.assembly).id:null;
  if(loading&&pendingKey===family)return pendingLoad;
  if(!family||inspections.has(family)){
   requestVersion++;pendingKey=null;pendingCamera=[];lastError=null;setLoading(false);status.hidden=true;applyUpdate(desired);pendingLoad=Promise.resolve();return pendingLoad;
  }
  const version=++requestVersion;pendingKey=family;pendingCamera=[];lastError=null;setLoading(true);status.hidden=false;status.textContent='Preparing this explorer for the first time…';
  const wasInspection=!!current.assembly;
  applyUpdate({...desired,assembly:null,system:'all',selected:null,isolate:false,hideBody:false,explode:0});
  if(wasInspection){camera.position.copy(vehiclePreset('home'));controls.target.set(0,.58,0);cameraGoal=null;targetGoal=null;}
  pendingLoad=(async()=>{
   // Only first use constructs a family. Paint its status first; subsequent
   // visits are immediate cached-root swaps and never release/rebuild models.
   await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
   if(disposed||version!==requestVersion)return;
   const model=await getInspection(family);
   if(!model||disposed||version!==requestVersion)return;
   pendingKey=null;setLoading(false);status.hidden=true;lastViewKey='';lastSceneKey='';applyUpdate(desired);
   const commands=pendingCamera;pendingCamera=[];for(const command of commands)command();dirty=true;
  })().catch(error=>{
   if(version!==requestVersion||disposed)return;
   pendingKey=null;setLoading(false);lastError=String(error.message||error);pendingCamera=[];
   status.replaceChildren(document.createTextNode('This explorer could not load. '));const retry=document.createElement('button');retry.type='button';retry.textContent='Reload workshop';retry.style.cssText='font:inherit;min-height:36px;padding:3px 12px';retry.addEventListener('click',()=>location.reload());status.append(retry);status.hidden=false;
  });
  return pendingLoad;
 }
 function applyUpdate(next) {
  const merged={...current,...next};
  const sceneKey=JSON.stringify([merged.assembly,merged.system,merged.hideBody,merged.isolate,merged.isolate?merged.selected:null,merged.explode,merged.assemblyExplode,merged.wireframe,merged.configuration]);
  const viewKey=JSON.stringify([sceneKey,merged.selected,merged.labels]);
  // Typing in search, changing inspector tabs and opening the mobile menu
  // do not change the 3D scene. Avoid redrawing millions of hidden surfaces
  // for each UI update, especially while a user is trying to select a part.
  if(viewKey===lastViewKey){current=merged;return;}
  const sceneChanged=sceneKey!==lastSceneKey;lastViewKey=viewKey;lastSceneKey=sceneKey;
  dirty=true;
  if(sceneChanged)renderer.shadowMap.needsUpdate=true;
  if(merged.assembly){const family=familyFor(merged.assembly).id;inspection=inspections.get(family);if(!inspection)throw new Error('Workshop family was not initialized: '+family);}
  current=merged;
  controls.minDistance=current.assembly?.012:.45;camera.near=current.assembly?.001:.03;camera.updateProjectionMatrix();
  root.visible=!current.assembly;floor.visible=!current.assembly;for(const [family,model] of inspections)model.root.visible=!!current.assembly&&family===familyFor(current.assembly).id;
  for(const el of labels.values())el.hidden=true;
  const serialized=JSON.stringify(current.configuration||{});if(serialized!==lastConfiguration){configure(current.configuration||{});lastConfiguration=serialized;}
  const dark=current.configuration?.studio==='dark';scene.background.set(dark?'#22282c':'#dededb');scene.fog.color.copy(scene.background);floor.material.color.set(dark?'#292e32':'#dededb');dimensions.visible=!current.assembly&&!!current.configuration?.dimensions;grid.visible=dimensions.visible;
  container.closest('.stage').dataset.studio=dark?'dark':'light';
  for(const [id,g] of currentGroups()) {
   const active=!!current.assembly||current.system==='all'||g.userData.system===current.system||current.system==='interior'&&['instrument-cluster','lighting-controls','hvac-controls','hvac-ducts','ecm','cabin-lamps'].includes(id);
   g.visible=current.assembly?inDetailSection(detailPartById.get(id),current.assembly)&&detailAvailable(detailPartById.get(id),current.configuration):detailAvailable(vehiclePartById.get(id),current.configuration)&&!(current.hideBody&&g.userData.system==='body'&&id!=='spaceframe');
   if(current.isolate)g.visible=g.visible&&(current.selected?id===current.selected:active);
   g.traverse(o=>{if(!o.isMesh)return;const original=o.userData.original;
    if(current.assembly&&o.userData.option)o.visible=current.configuration?.[o.userData.option]===o.userData.value;
    if(current.assembly&&['interior-system','body-system','headlight-system','lighting-system'].includes(familyFor(current.assembly).id)){const mat=o.userData.surfaceMaterial||o.material;if(o.userData.materialName==='red'){const paint=paints.find(p=>p.id===current.configuration?.paint)||paints[0];original.color.set(paint.color);mat.metalness=paint.metalness;}if(o.userData.materialName==='interior')original.color.set(current.configuration?.interior==='tan'?'#9b7a50':'#555b60');if(o.userData.materialName==='vinyl')original.color.set(current.configuration?.interior==='tan'?'#604931':'#2e3338');}const cabinColor=interiorColor(o.userData.materialName,current.configuration);if(cabinColor){original.color.set(cabinColor);(o.userData.surfaceMaterial||o.material).color.set(cabinColor);}const ghost=!active&&!current.isolate;
    o.userData.surfaceMaterial??=o.material;
    if(current.wireframe){o.userData.wireMaterial??=new T.MeshBasicMaterial({wireframe:true,side:T.DoubleSide});o.material=o.userData.wireMaterial;}
    else if(ghost){
     // Context is a faint silhouette. Cache a simple material instead of
     // recompiling physical/transmission shaders as each system is selected.
     o.userData.ghostMaterial??=new T.MeshBasicMaterial({color:original.color,transparent:true,opacity:.075,depthWrite:false,side:o.userData.surfaceMaterial.side,forceSinglePass:true});
     o.material=o.userData.ghostMaterial;
    }else o.material=o.userData.surfaceMaterial;
    o.material.color.copy(original.color);o.material.emissive?.copy(original.emissive);o.material.emissiveIntensity=original.emissiveIntensity;
    const transparent=ghost||original.transparent;
    if(o.material.transparent!==transparent||o.material.wireframe!==current.wireframe)o.material.needsUpdate=true;
    o.material.opacity=ghost?.075:original.opacity;o.material.transparent=transparent;o.material.depthWrite=!ghost&&original.opacity===1;o.material.wireframe=current.wireframe;o.castShadow=!ghost&&!['glass','headlampGlass','headlampFlute','lensGrid','tailOuter'].includes(o.userData.materialName);
   });
  }
  renderer.domElement.dataset.system=current.system;renderer.domElement.dataset.selected=current.selected||'';
  renderer.domElement.dataset.assembly=current.assembly||'';renderer.domElement.dataset.driveLayout='LHD';
  if(sceneChanged)fitInspectionShadow();
 }
 function fitInspectionShadow(){
  const sc=sun.shadow.camera;
  if(!current.assembly){
   sun.target.position.set(0,0,0);sc.left=-4;sc.right=4;sc.top=4;sc.bottom=-4;sc.near=.5;sc.far=20;sun.shadow.bias=-.00015;sun.shadow.normalBias=.005;sun.shadow.radius=10;
  }else{
   inspection.root.updateMatrixWorld(true);const b=new T.Box3();
   for(const g of inspection.groups.values())if(g.visible){const p=visibleBounds(g);p.translate(engineGoal(g).sub(g.position));b.union(p);}
   if(b.isEmpty())return;
   // Reserve shadow texels for the inspected part rather than a car-sized
   // region. This reveals connector recesses and casting relief at close range.
   const centre=b.getCenter(new T.Vector3()),radius=Math.max(.03,b.getSize(new T.Vector3()).length()/2)*1.18;
   inspectionRadius=radius;sun.target.position.copy(centre);const distance=sun.position.distanceTo(centre);
   sc.left=-radius;sc.right=radius;sc.top=radius;sc.bottom=-radius;sc.near=Math.max(.1,distance-radius);sc.far=distance+radius;
   sun.shadow.bias=-.00002;sun.shadow.normalBias=T.MathUtils.clamp(radius*.0007,.00002,.0007);sun.shadow.radius=2;
  }
  sun.target.updateMatrixWorld();sc.updateProjectionMatrix();renderer.shadowMap.needsUpdate=true;
 }
 function setCameraFov(value){camera.fov=value;camera.updateProjectionMatrix();dirty=true;}
 function view(name) {
  if(loading){pendingCamera.push(()=>view(name));return;}
  framingPart=null;
  if(current.assembly){frameAssembly(name);return;}
  setCameraFov(name==='cabin'?60:37);
  if(name==='cabin'){cameraGoal=new T.Vector3(-.346,.99,.32);targetGoal=new T.Vector3(-.25,.75,-.43);return;}
  refreshSafeViewport();if(safeViewport?.mobile){frameMobileCurrent(new T.Vector3(...(presets[name]||presets.home)).sub(new T.Vector3(0,.58,0)).normalize(),false);return;}
  cameraGoal=vehiclePreset(name);targetGoal=new T.Vector3(0,.58,0);
 }
 function engineGoal(g){const goal=g.userData.spread.clone();if(current.assembly===familyFor(current.assembly).id)goal.add(g.userData.assemblySpread);return goal.multiplyScalar(current.assemblyExplode||0);}
 function inspectionDirection(name){
  if(name!=='home')return presets[name]||presets.home;
  const family=familyFor(current.assembly).id;
  if(family==='interior-system')return current.assembly==='interior-dashboard'||current.assembly==='interior-radio'||current.assembly==='interior-console'?[.8,.55,1.8]:current.assembly==='interior-door-left'?[1.8,.5,.4]:current.assembly==='interior-door-right'?[-1.8,.5,.4]:[-1.2,.7,-1.8];
  if(family==='suspension-system'){
   const corner=current.assembly.match(/^susp-([fr][lr])(?:-|$)/)?.[1];
   if(corner)return[corner[1]==='l'?-1.4:1.4,.9,corner[0]==='f'?-.9:.9];
   if(current.assembly==='susp-rack')return[-1,.9,-1.6];
  }
  if(family==='braking-system'){
   const corner=current.assembly.match(/^brake-([fr][lr])(?:-|$)/)?.[1];
   if(corner)return[corner[1]==='l'?-1.6:1.6,.85,corner[0]==='f'?.9:-.9];
   if(['brake-master','brake-booster','brake-hydraulics'].includes(current.assembly))return[-1.5,.9,-1.2];
  }
  if(family==='wiring-system')return current.assembly==='wiring-cluster'?[.15,.1,2]:current.assembly==='wiring-ecm'?[1.1,.6,-1.8]:current.assembly==='wiring-fuses'?[-.5,-.8,1.5]:[-.8,.7,1.8];
  if(family==='charging-system')return current.assembly==='charging-alternator'?[1.7,.6,.8]:current.assembly==='charging-starter'?[-1.5,.7,-1.1]:[1.1,.8,1.5];
  if(family==='lighting-system')return current.assembly.includes('front-')?[-.6,.4,-1.8]:current.assembly.includes('marker-')?[current.assembly.endsWith('left')?-1.8:1.8,.5,.4]:['lighting-dome','lighting-courtesy','lighting-console'].includes(current.assembly)?[-.7,-1.5,.8]:[-.6,.5,1.8];
  if(current.assembly==='headlight-controls')return[-.7,.45,1.8];
  if(family==='headlight-system')return current.assembly.endsWith('-motor')?[current.assembly.includes('-left-')?-1.6:1.6,.9,-1.0]:[-.8,.6,-1.7];
  if(family==='hvac-system')return current.assembly==='hvac-controls'?[-.7,.5,1.7]:[1.1,.6,-1.6];
  if(family==='cooling-system')return[-.95,.6,1.5];
  if(current.assembly==='water-pump-detail')return[.9,.65,1.15];
  if(['coil-detail','distributor-detail'].includes(current.assembly))return[-.9,.8,1.6];
  return presets.home;
 }
 function frameAssembly(name){
  if(loading){pendingCamera.push(()=>frameAssembly(name));return;}
  if(!current.assembly||!inspection)return;
  framingPart=null;
  setCameraFov(37);
  const bounds=new T.Box3();inspection.root.updateMatrixWorld(true);
  for(const g of inspection.groups.values())if(g.visible){const b=visibleBounds(g);b.translate(engineGoal(g).sub(g.position));bounds.union(b);}
  if(bounds.isEmpty())return;
  const centre=bounds.getCenter(new T.Vector3()),radius=bounds.getSize(new T.Vector3()).length()/2;
  const angle=Math.min(camera.fov*Math.PI/360,Math.atan(Math.tan(camera.fov*Math.PI/360)*camera.aspect));
  const distance=Math.max(.18,radius/Math.sin(angle)*1.13);
  const direction=name?new T.Vector3(...inspectionDirection(name)).normalize():camera.position.clone().sub(controls.target).normalize();
  refreshSafeViewport();if(safeViewport?.mobile){frameMobileBounds(bounds,direction,.18);return;}
  targetGoal=centre;cameraGoal=centre.clone().addScaledVector(direction,distance);
 }
 function focus(id) {
  if(loading){pendingCamera.push(()=>focus(id));return;}

  const g=currentGroups().get(id);if(!g)return;currentRoot().updateMatrixWorld(true);const bounds=visibleBounds(g);if(bounds.isEmpty())return;if(current.assembly)bounds.translate(engineGoal(g).sub(g.position));const centre=bounds.getCenter(new T.Vector3());const size=bounds.getSize(new T.Vector3()).length();
  framingPart=id;
  const direction=id.startsWith('eng-rocker-')?new T.Vector3(-.55,1.2,id.includes('-front-')?-1:1).normalize():id==='eng-icm'?new T.Vector3(-.6,1.2,1.7).normalize():camera.position.clone().sub(controls.target).normalize();refreshSafeViewport();if(safeViewport?.mobile){frameMobileBounds(bounds,direction,current.assembly?.028:.45);return;}targetGoal=centre;cameraGoal=centre.clone().addScaledVector(direction,T.MathUtils.clamp(size*2.1,current.assembly?.028:1.1,7)*portraitScale());
 }
 function refreshSafeViewport(){
  const canvas=container.getBoundingClientRect(),stage=container.closest('.stage'),mobile=window.matchMedia('(max-width:960px)').matches;
  let top=8,bottom=canvas.height-8;
  if(mobile){
   for(const selector of ['.stage-heading','.assembly-return']){const el=stage.querySelector(selector);if(el?.getClientRects().length)top=Math.max(top,el.getBoundingClientRect().bottom-canvas.top+10);}
   for(const selector of ['.view-tools','.stage-bottom','.stage-footnote']){const el=stage.querySelector(selector);if(el?.getClientRects().length)bottom=Math.min(bottom,el.getBoundingClientRect().top-canvas.top-10);}
  }
  const next={mobile,left:8,right:canvas.width-8,top:mobile?top:8,bottom:mobile?bottom:canvas.height-8,width:canvas.width,height:canvas.height};
  const changed=JSON.stringify(next)!==JSON.stringify(safeViewport);safeViewport=next;
  if(mobile)camera.setViewOffset(canvas.width,canvas.height,0,canvas.height/2-(top+bottom)/2,canvas.width,canvas.height);else camera.clearViewOffset();
  return changed;
 }
 function frameMobileBounds(bounds,direction,minimum=.18){
  const {width,height,left,right,top,bottom}=safeViewport;
  const distance=Math.max(minimum,framedDistance(bounds,direction,camera.fov,camera.aspect,(right-left)/width,Math.max(1,bottom-top)/height));
  targetGoal=bounds.getCenter(new T.Vector3());cameraGoal=targetGoal.clone().addScaledVector(direction,distance);
  // Fitting a narrow usable screen can move the complete car farther away.
  controls.maxDistance=Math.max(12*portraitScale(),distance*1.5);camera.far=Math.max(60,distance*3);scene.fog.near=Math.max(12*portraitScale(),distance*1.5);scene.fog.far=Math.max(22*portraitScale(),distance*2.5);camera.updateProjectionMatrix();dirty=true;
 }
 function frameMobileCurrent(direction=camera.position.clone().sub(controls.target).normalize(),selected=true){
  if(loading||current.assembly&&!inspection)return;
  const bounds=new T.Box3();currentRoot().updateMatrixWorld(true);
  for(const [id,g] of currentGroups())if(g.visible&&(!selected||!framingPart||id===framingPart)){
   const b=visibleBounds(g);b.translate(current.assembly?engineGoal(g).sub(g.position):g.userData.spread.clone().multiplyScalar(current.explode).sub(g.position));bounds.union(b);
  }
  if(!bounds.isEmpty())frameMobileBounds(bounds,direction,current.assembly?.028:.45);
 }
 // Recalculate when mobile titles wrap or controls appear, as well as rotate.
 function resize(){
  if(disposed)return;
  const {width,height}=container.getBoundingClientRect();if(!width||!height)return;
  const previousAspect=camera.aspect,wasMobile=safeViewport?.mobile,sizeChanged=width!==lastCanvasWidth||height!==lastCanvasHeight;camera.aspect=width/height;
  const safeChanged=refreshSafeViewport();if(!sizeChanged&&!safeChanged)return;
  if(safeViewport.mobile&&current.camera!=='cabin')frameMobileCurrent();
  else if(wasMobile){if(framingPart)focus(framingPart);else if(current.assembly)frameAssembly();else view(current.camera||'home');controls.maxDistance=12*portraitScale();camera.far=60;scene.fog.near=12*portraitScale();scene.fog.far=22*portraitScale();}
  else if(!current.assembly&&current.camera!=='cabin'){const scale=portraitScale()/portraitScale(previousAspect);camera.position.sub(controls.target).multiplyScalar(scale).add(controls.target);if(cameraGoal)cameraGoal.sub(targetGoal||controls.target).multiplyScalar(scale).add(targetGoal||controls.target);}
  camera.updateProjectionMatrix();
  if(sizeChanged){renderer.setSize(width,height);composer.setSize(width,height);const ratio=renderer.getPixelRatio();antialias.uniforms.resolution.value.set(1/(width*ratio),1/(height*ratio));lastCanvasWidth=width;lastCanvasHeight=height;}
  dirty=true;
 }
 const observer=new ResizeObserver(resize);cleanup.push(()=>observer.disconnect());observer.observe(container);for(const selector of ['.stage-heading','.assembly-return','.view-tools','.stage-bottom']){const el=container.closest('.stage').querySelector(selector);if(el)observer.observe(el);}resize();
 const overviewLabels=['engine-block','radiator','wheels','steering-wheel'];const temp=new T.Vector3(),bounds=new T.Box3();
 let finishFirstFrame,rejectFirstFrame;const ready=new Promise((resolve,reject)=>{finishFirstFrame=resolve;rejectFirstFrame=reject;});
 ready.catch(()=>{}); // Setup may fail before the caller receives this promise.
 cleanup.push(()=>{if(rejectFirstFrame){rejectFirstFrame(startupController.signal.reason||new DOMException('Workshop closed before the first view','AbortError'));rejectFirstFrame=null;finishFirstFrame=null;}});
 let lastTime=performance.now();
 function animate(){if(disposed)return;try{frame=requestAnimationFrame(animate);const now=performance.now();const dt=Math.min((now-lastTime)/1000,.5);lastTime=now;const cameraBlend=reducedMotion?1:1-Math.exp(-7*dt);const partBlend=reducedMotion?1:1-Math.exp(-10*dt);
  let moving=!!cameraGoal||!!targetGoal;
  for(const g of currentGroups().values()){const goal=current.assembly?engineGoal(g):g.userData.spread.clone().multiplyScalar(current.explode);if(g.position.distanceToSquared(goal)>.000001){g.position.lerp(goal,partBlend);moving=true;renderer.shadowMap.needsUpdate=true;}else g.position.copy(goal);}
  if(cameraGoal){camera.position.lerp(cameraGoal,cameraBlend);if(camera.position.distanceTo(cameraGoal)<.004)cameraGoal=null;}if(targetGoal){controls.target.lerp(targetGoal,cameraBlend);if(controls.target.distanceTo(targetGoal)<.004)targetGoal=null;}
  const orbitChanged=controls.update();if(!dirty&&!moving&&!orbitChanged)return;dirty=false;currentRoot().updateMatrixWorld(true);
  if(current.selected&&currentGroups().get(current.selected)?.visible){visibleBounds(currentGroups().get(current.selected),highlight.box);highlight.visible=!highlight.box.isEmpty();}else highlight.visible=false;
  const rect=container.getBoundingClientRect();let shown=0;
  for(const part of currentParts()){const g=currentGroups().get(part.id);let el=labels.get(part.id);const eligible=current.labels&&g?.visible&&(part.id===current.selected||(current.assembly?shown<6:current.system==='all'?overviewLabels.includes(part.id):part.system===current.system&&shown<6));
   if(!eligible){if(el)el.hidden=true;continue;}el=labelFor(part);shown++;visibleBounds(g,bounds);if(bounds.isEmpty()){el.hidden=true;continue;}bounds.getCenter(temp);temp.y=bounds.max.y+.07;temp.project(camera);el.hidden=temp.z>1||temp.z< -1||Math.abs(temp.x)>.93||Math.abs(temp.y)>.88;if(!el.hidden){el.style.left=`${(temp.x*.5+.5)*rect.width}px`;el.style.top=`${(-temp.y*.5+.5)*rect.height}px`;el.classList.toggle('selected',part.id===current.selected);}
  }
  occlusion.enabled=!softwareRenderer&&!current.wireframe&&(current.assembly?(current.assemblyExplode||0)<.01:current.system==='all'&&!current.isolate&&!current.hideBody&&current.explode<.01);
  // Contact shading follows part scale; a car-sized kernel overwhelms tiny
  // service hardware. Depth thresholds are normalized to the camera range.
  occlusion.kernelRadius=current.assembly?T.MathUtils.clamp(inspectionRadius*.10,.001,.016):.13;
  occlusion.minDistance=current.assembly?.000001:.000025;occlusion.maxDistance=current.assembly?occlusion.kernelRadius*1.5/(camera.far-camera.near):.004;
  renderer.shadowMap.enabled=!current.wireframe;
  if(current.wireframe)renderer.render(scene,camera);else composer.render();
  if(finishFirstFrame){renderer.domElement.dataset.ready='true';setLoading(loading);initialization.firstFrameMs=performance.now()-startupStarted;finishFirstFrame();finishFirstFrame=null;rejectFirstFrame=null;window.removeEventListener('pagehide',cancelStartup);}
 }catch(error){if(rejectFirstFrame){rejectFirstFrame(error);rejectFirstFrame=null;finishFirstFrame=null;release();}else{release();throw error;}}
 }
 update(current);
 // Give the document load event and the UI a chance to complete before the
 // first heavy draw. Keep the visible loading state until that draw succeeds.
 const start=()=>{if(!disposed)frame=requestAnimationFrame(animate);};
 cleanup.push(()=>window.removeEventListener('load',start));
 if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
 function getPartBounds(id){const g=detailPartById.has(id)?inspections.get(detailPartById.get(id).family)?.groups.get(id):groups.get(id);if(!g)return null;scene.updateMatrixWorld(true);const b=visibleBounds(g);return b.isEmpty()?null:{min:b.min.toArray(),max:b.max.toArray()};}
 return {ready,update,view,focus,frameAssembly,resize,whenIdle:()=>pendingLoad,getLoadingStats,getCamera:()=>{camera.updateMatrixWorld();return{position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov,aspect:camera.aspect,projectionMatrix:camera.projectionMatrix.toArray(),matrixWorldInverse:camera.matrixWorldInverse.toArray(),safeViewport:{...safeViewport},framingPart};},restoreCamera:restoreCamera,getVisibleParts:()=>[...currentGroups()].filter(([,g])=>g.visible&&g.children.length).map(([id])=>id),getState:()=>({...current}),getPartCount:()=>groups.size,getPartBounds,getModelStats:()=>{let meshes=0,triangles=0;currentRoot().traverseVisible(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;}});return{meshes,triangles};},dispose:release};
 }catch(error){release();throw error;}
}
