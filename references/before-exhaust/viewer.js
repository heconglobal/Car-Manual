import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { textMaterial } from './materials.js';
import { createVehicle } from './model.js';
import { parts } from './data.js';
import {createEngineDetail} from './engine-detail.js';
import {detailParts,detailPartById,inDetailSection,familyFor} from './inspection-catalog.js';
import {createTransmissionDetail} from './transmission-detail.js';
import {createCoolingDetail} from './cooling-detail.js';
import {createSuspensionDetail} from './suspension-detail.js';
import {createFuelDetail} from './fuel-detail.js';
import {createBrakeDetail} from './brake-detail.js';

export function createViewer(container, onSelect) {
 const scene=new T.Scene();scene.background=new T.Color('#dededb');scene.fog=new T.Fog('#dededb',12,22);
 const camera=new T.PerspectiveCamera(37,1,.03,60);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
 const gl=renderer.getContext(),debugInfo=gl.getExtension('WEBGL_debug_renderer_info');const softwareRenderer=debugInfo&&/SwiftShader|llvmpipe|Software/i.test(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,softwareRenderer?1:2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.VSMShadowMap;
 renderer.shadowMap.autoUpdate=false;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
 renderer.domElement.setAttribute('aria-label','Interactive 3D model of the 1985 Pontiac Fiero. Drag to orbit, scroll to zoom. Components can also be selected in the assembly list.');
 renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;container.prepend(renderer.domElement);
 const pmrem=new T.PMREMGenerator(renderer);const env=new RoomEnvironment();let envMap=pmrem.fromScene(env,.015);scene.environment=envMap.texture;env.dispose();
 scene.environmentRotation.set(.4,.65,0);
 const hemisphere=new T.HemisphereLight('#e9f2ff','#595654',.55);scene.add(hemisphere);
 const sun=new T.DirectionalLight('#fff5e7',1.3);sun.position.set(-3,7,-4);sun.castShadow=true;sun.shadow.mapSize.set(softwareRenderer?1024:2048,softwareRenderer?1024:2048);sun.shadow.camera.left=-4;sun.shadow.camera.right=4;sun.shadow.camera.top=4;sun.shadow.camera.bottom=-4;sun.shadow.normalBias=.003;sun.shadow.radius=10;sun.shadow.blurSamples=8;scene.add(sun,sun.target);
 const fill=new T.DirectionalLight('#d0deff',.55);fill.position.set(4,3,4);scene.add(fill);
 const floor=new T.Mesh(new T.PlaneGeometry(40,40),new T.MeshStandardMaterial({color:'#dededb',roughness:.57,metalness:.07}));floor.rotation.x=-Math.PI/2;floor.position.y=-.008;floor.receiveShadow=true;scene.add(floor);
 const grid=new T.GridHelper(12,48,'#9da7a5','#bcc4c1');grid.position.y=-.005;grid.material.transparent=true;grid.material.opacity=.18;grid.visible=false;scene.add(grid);
 const {root,groups,configure}=createVehicle();scene.add(root);
 let inspection=null;const inspections=new Map();
 const builders={'fuel-system':createFuelDetail,'suspension-system':createSuspensionDetail,engine:createEngineDetail,transmission:createTransmissionDetail,'cooling-system':createCoolingDetail,'braking-system':createBrakeDetail};
 const currentGroups=()=>current.assembly?inspection.groups:groups;
 const currentParts=()=>current.assembly?detailParts.filter(p=>p.family===familyFor(current.assembly).id):parts;
 const currentRoot=()=>current.assembly?inspection.root:root;
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:4});
 const composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));
 const occlusion=new SSAOPass(scene,camera,1,1,16);occlusion.kernelRadius=.13;occlusion.minDistance=.000025;occlusion.maxDistance=.004;composer.addPass(occlusion);
 const output=new OutputPass();composer.addPass(output);
 const dimensions=new T.Group();scene.add(dimensions);
 const dimensionLine=(points)=>{const g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));dimensions.add(new T.Line(g,new T.LineBasicMaterial({color:'#617b72'})));};
 dimensionLine([[1.04,.03,-2.041],[1.15,.03,-2.041],[1.15,.03,2.041],[1.04,.03,2.041]]);
 dimensionLine([[-.99,.03,-1.1865],[-1.1,.03,-1.1865],[-1.1,.03,1.1865],[-.99,.03,1.1865]]);
 dimensionLine([[-.876,.03,-2.22],[-.876,.03,-2.30],[.876,.03,-2.30],[.876,.03,-2.22]]);
 for(const [text,pos,size] of [['4,082 mm',[1.28,.04,0],[.72,.14]],['2,373 mm',[-1.25,.04,0],[.72,.14]],['1,752 mm',[0,.04,-2.45],[.72,.14]]]){const m=new T.Mesh(new T.PlaneGeometry(...size),textMaterial(text,{background:'#dededb',foreground:'#516c62',font:'54px monospace'}));m.position.set(...pos);m.rotation.x=-Math.PI/2;dimensions.add(m);}dimensions.visible=false;
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.06;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.92;controls.target.set(0,.58,0);
 const presets={home:[-4.9,2.35,-6.1],front:[.1,1.30,-7.1],rear:[-4.6,2.25,5.8],side:[-7.6,1.35,0],passenger:[7.6,1.35,0],top:[0,7.8,.001]};
 camera.position.set(...presets.home);
 let cameraGoal=null,targetGoal=null,current={system:'all',selected:null,hideBody:false,isolate:false,explode:0,labels:false,wireframe:false},frame=0,disposed=false,dirty=true;
 let lastConfiguration='',inspectionRadius=.1;
 new HDRLoader().load('/assets/studio_small_09_1k.hdr',texture=>{if(disposed){texture.dispose();return;}const next=pmrem.fromEquirectangular(texture);texture.dispose();envMap.dispose();envMap=next;scene.environment=next.texture;scene.environmentIntensity=.85;pmrem.dispose();dirty=true;renderer.domElement.dataset.lighting='hdr';},undefined,()=>{pmrem.dispose();renderer.domElement.dataset.lighting='fallback';});
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const labelLayer=document.createElement('div');labelLayer.className='model-labels';container.append(labelLayer);
 const labels=new Map();
 for(const part of [...parts,...detailParts]) {
  const el=document.createElement('button');el.type='button';el.className='model-label';el.textContent=part.name;el.dataset.part=part.id;el.addEventListener('click',e=>{e.stopPropagation();onSelect(part.id);});el.hidden=true;labelLayer.append(el);labels.set(part.id,el);
 }
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
 function update(next) {
  dirty=true;
  renderer.shadowMap.needsUpdate=true;
  if(next.assembly){const family=familyFor(next.assembly).id;if(!inspections.has(family)){const model=builders[family]();inspections.set(family,model);scene.add(model.root);}inspection=inspections.get(family);}
  current={...current,...next};
  controls.minDistance=current.assembly?.012:.45;camera.near=current.assembly?.001:.03;camera.updateProjectionMatrix();
  root.visible=!current.assembly;floor.visible=!current.assembly;for(const [family,model] of inspections)model.root.visible=!!current.assembly&&family===familyFor(current.assembly).id;
  for(const el of labels.values())el.hidden=true;
  const serialized=JSON.stringify(current.configuration||{});if(serialized!==lastConfiguration){configure(current.configuration||{});lastConfiguration=serialized;}
  const dark=current.configuration?.studio==='dark';scene.background.set(dark?'#22282c':'#dededb');scene.fog.color.copy(scene.background);floor.material.color.set(dark?'#292e32':'#dededb');dimensions.visible=!current.assembly&&!!current.configuration?.dimensions;grid.visible=dimensions.visible;
  container.closest('.stage').dataset.studio=dark?'dark':'light';
  for(const [id,g] of currentGroups()) {
   const active=!!current.assembly||current.system==='all'||g.userData.system===current.system;
   g.visible=current.assembly?inDetailSection(detailPartById.get(id),current.assembly):!(current.hideBody&&g.userData.system==='body'&&id!=='spaceframe');
   if(current.isolate)g.visible=g.visible&&(current.selected?id===current.selected:active);
   g.traverse(o=>{if(!o.isMesh)return;const original=o.userData.original;const ghost=!active&&!current.isolate;
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
    o.material.opacity=ghost?.075:original.opacity;o.material.transparent=transparent;o.material.depthWrite=!ghost&&original.opacity===1;o.material.wireframe=current.wireframe;o.castShadow=!ghost&&!['glass','headlampGlass','headlampFlute','lensGrid'].includes(o.userData.materialName);
   });
  }
  renderer.domElement.dataset.system=current.system;renderer.domElement.dataset.selected=current.selected||'';
  renderer.domElement.dataset.assembly=current.assembly||'';renderer.domElement.dataset.driveLayout='LHD';
  fitInspectionShadow();
 }
 function fitInspectionShadow(){
  const sc=sun.shadow.camera;
  if(!current.assembly){
   sun.target.position.set(0,0,0);sc.left=-4;sc.right=4;sc.top=4;sc.bottom=-4;sc.near=.5;sc.far=500;sun.shadow.normalBias=.003;sun.shadow.radius=10;
  }else{
   inspection.root.updateMatrixWorld(true);const b=new T.Box3();
   for(const g of inspection.groups.values())if(g.visible){const p=visibleBounds(g);p.translate(engineGoal(g).sub(g.position));b.union(p);}
   if(b.isEmpty())return;
   // Reserve shadow texels for the inspected part rather than a car-sized
   // region. This reveals connector recesses and casting relief at close range.
   const centre=b.getCenter(new T.Vector3()),radius=Math.max(.03,b.getSize(new T.Vector3()).length()/2)*1.18;
   inspectionRadius=radius;sun.target.position.copy(centre);const distance=sun.position.distanceTo(centre);
   sc.left=-radius;sc.right=radius;sc.top=radius;sc.bottom=-radius;sc.near=Math.max(.1,distance-radius);sc.far=distance+radius;
   sun.shadow.normalBias=T.MathUtils.clamp(radius*.0007,.00002,.0007);sun.shadow.radius=2;
  }
  sun.target.updateMatrixWorld();sc.updateProjectionMatrix();renderer.shadowMap.needsUpdate=true;
 }
 function setCameraFov(value){camera.fov=value;camera.updateProjectionMatrix();dirty=true;}
 function view(name) {
  if(current.assembly){frameAssembly(name);return;}
  setCameraFov(name==='cabin'?60:37);
  if(name==='cabin'){cameraGoal=new T.Vector3(-.346,.99,.32);targetGoal=new T.Vector3(-.25,.75,-.43);return;}
  cameraGoal=new T.Vector3(...(presets[name]||presets.home));targetGoal=new T.Vector3(0,.58,0);
 }
 function engineGoal(g){const goal=g.userData.spread.clone();if(current.assembly===familyFor(current.assembly).id)goal.add(g.userData.assemblySpread);return goal.multiplyScalar(current.assemblyExplode||0);}
 function inspectionDirection(name){
  if(name!=='home')return presets[name]||presets.home;
  const family=familyFor(current.assembly).id;
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
  if(family==='cooling-system')return[-.95,.6,1.5];
  if(current.assembly==='water-pump-detail')return[.9,.65,1.15];
  if(['coil-detail','distributor-detail'].includes(current.assembly))return[-.9,.8,1.6];
  return presets.home;
 }
 function frameAssembly(name){
  if(!current.assembly||!inspection)return;
  setCameraFov(37);
  const bounds=new T.Box3();inspection.root.updateMatrixWorld(true);
  for(const g of inspection.groups.values())if(g.visible){const b=visibleBounds(g);b.translate(engineGoal(g).sub(g.position));bounds.union(b);}
  if(bounds.isEmpty())return;
  const centre=bounds.getCenter(new T.Vector3()),radius=bounds.getSize(new T.Vector3()).length()/2;
  const angle=Math.min(camera.fov*Math.PI/360,Math.atan(Math.tan(camera.fov*Math.PI/360)*camera.aspect));
  const distance=Math.max(.18,radius/Math.sin(angle)*1.13);
  const direction=name?new T.Vector3(...inspectionDirection(name)).normalize():camera.position.clone().sub(controls.target).normalize();
  targetGoal=centre;cameraGoal=centre.clone().addScaledVector(direction,distance);
 }
 function focus(id) {
  const g=currentGroups().get(id);if(!g)return;currentRoot().updateMatrixWorld(true);const bounds=visibleBounds(g);if(bounds.isEmpty())return;if(current.assembly)bounds.translate(engineGoal(g).sub(g.position));const centre=bounds.getCenter(new T.Vector3());const size=bounds.getSize(new T.Vector3()).length();
  const direction=id.startsWith('eng-rocker-')?new T.Vector3(-.55,1.2,id.includes('-front-')?-1:1).normalize():id==='eng-icm'?new T.Vector3(-.6,1.2,1.7).normalize():camera.position.clone().sub(controls.target).normalize();targetGoal=centre;cameraGoal=centre.clone().addScaledVector(direction,T.MathUtils.clamp(size*2.1,current.assembly?.028:1.1,7));
 }
 function resize() {const {width,height}=container.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);composer.setSize(width,height);dirty=true;}
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 const overviewLabels=['engine-block','radiator','wheels','steering-wheel'];const temp=new T.Vector3(),bounds=new T.Box3();
 let finishFirstFrame;const ready=new Promise(resolve=>{finishFirstFrame=resolve;});
 let lastTime=performance.now();
 function animate(){if(disposed)return;frame=requestAnimationFrame(animate);const now=performance.now();const dt=Math.min((now-lastTime)/1000,.5);lastTime=now;const cameraBlend=reducedMotion?1:1-Math.exp(-7*dt);const partBlend=reducedMotion?1:1-Math.exp(-10*dt);
  let moving=!!cameraGoal||!!targetGoal;
  for(const g of currentGroups().values()){const goal=current.assembly?engineGoal(g):g.userData.spread.clone().multiplyScalar(current.explode);if(g.position.distanceToSquared(goal)>.000001){g.position.lerp(goal,partBlend);moving=true;renderer.shadowMap.needsUpdate=true;}else g.position.copy(goal);}
  if(cameraGoal){camera.position.lerp(cameraGoal,cameraBlend);if(camera.position.distanceTo(cameraGoal)<.004)cameraGoal=null;}if(targetGoal){controls.target.lerp(targetGoal,cameraBlend);if(controls.target.distanceTo(targetGoal)<.004)targetGoal=null;}
  const orbitChanged=controls.update();if(!dirty&&!moving&&!orbitChanged)return;dirty=false;currentRoot().updateMatrixWorld(true);
  if(current.selected&&currentGroups().get(current.selected)?.visible){visibleBounds(currentGroups().get(current.selected),highlight.box);highlight.visible=!highlight.box.isEmpty();}else highlight.visible=false;
  const rect=container.getBoundingClientRect();let shown=0;
  for(const part of currentParts()){const el=labels.get(part.id),g=currentGroups().get(part.id);const eligible=current.labels&&g.visible&&(part.id===current.selected||(current.assembly?shown<6:current.system==='all'?overviewLabels.includes(part.id):part.system===current.system&&shown<6));
   if(!eligible){el.hidden=true;continue;}shown++;visibleBounds(g,bounds);if(bounds.isEmpty()){el.hidden=true;continue;}bounds.getCenter(temp);temp.y=bounds.max.y+.07;temp.project(camera);el.hidden=temp.z>1||temp.z< -1||Math.abs(temp.x)>.93||Math.abs(temp.y)>.88;if(!el.hidden){el.style.left=`${(temp.x*.5+.5)*rect.width}px`;el.style.top=`${(-temp.y*.5+.5)*rect.height}px`;el.classList.toggle('selected',part.id===current.selected);}
  }
  occlusion.enabled=!current.wireframe&&(current.assembly?(current.assemblyExplode||0)<.01:current.system==='all'&&!current.isolate&&!current.hideBody&&current.explode<.01);
  // Contact shading follows part scale; a car-sized kernel overwhelms tiny
  // service hardware. Depth thresholds are normalized to the camera range.
  occlusion.kernelRadius=current.assembly?T.MathUtils.clamp(inspectionRadius*.10,.001,.016):.13;
  occlusion.minDistance=current.assembly?.000001:.000025;occlusion.maxDistance=current.assembly?occlusion.kernelRadius*1.5/(camera.far-camera.near):.004;
  renderer.shadowMap.enabled=!current.wireframe;
  if(current.wireframe)renderer.render(scene,camera);else composer.render();
  if(finishFirstFrame){renderer.domElement.dataset.ready='true';finishFirstFrame();finishFirstFrame=null;}
 }
 update(current);
 // Give the document load event and the UI a chance to complete before the
 // first heavy draw. Keep the visible loading state until that draw succeeds.
 const start=()=>{if(!disposed)frame=requestAnimationFrame(animate);};
 if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
 function getPartBounds(id){const g=detailPartById.has(id)?inspections.get(detailPartById.get(id).family)?.groups.get(id):groups.get(id);if(!g)return null;scene.updateMatrixWorld(true);const b=visibleBounds(g);return b.isEmpty()?null:{min:b.min.toArray(),max:b.max.toArray()};}
 return {ready,update,view,focus,frameAssembly,resize,getCamera:()=>({position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov}),restoreCamera:s=>{setCameraFov(s.fov??37);cameraGoal=new T.Vector3(...s.position);targetGoal=new T.Vector3(...s.target);dirty=true;},getVisibleParts:()=>[...currentGroups()].filter(([,g])=>g.visible).map(([id])=>id),getState:()=>({...current}),getPartCount:()=>groups.size,getPartBounds,getModelStats:()=>{let meshes=0,triangles=0;currentRoot().traverseVisible(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;}});return{meshes,triangles};},dispose(){disposed=true;window.removeEventListener('load',start);cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of new Set([...[o.material].flat(),o.userData.surfaceMaterial,o.userData.ghostMaterial,o.userData.wireMaterial].filter(Boolean)))m.dispose();});occlusion.dispose();output.dispose();composer.dispose();envMap.dispose();pmrem.dispose();renderer.dispose();}};
}
