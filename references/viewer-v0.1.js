import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createVehicle } from './model.js';
import { parts } from './data.js';

export function createViewer(container, onSelect) {
 const scene=new T.Scene();scene.background=new T.Color('#e8e9e4');scene.fog=new T.Fog('#e8e9e4',13,25);
 const camera=new T.PerspectiveCamera(37,1,.03,60);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 renderer.domElement.setAttribute('aria-label','Interactive 3D model of the 1985 Pontiac Fiero. Drag to orbit, scroll to zoom. Components can also be selected in the assembly list.');
 renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;container.prepend(renderer.domElement);
 const pmrem=new T.PMREMGenerator(renderer);const env=new RoomEnvironment();const envMap=pmrem.fromScene(env,.05);scene.environment=envMap.texture;env.dispose();pmrem.dispose();
 scene.add(new T.HemisphereLight('#fff8e8','#777e82',2.2));
 const sun=new T.DirectionalLight('#fff4df',2.2);sun.position.set(4,8,-3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.035;scene.add(sun);
 const fill=new T.DirectionalLight('#c1d6e7',1.3);fill.position.set(-4,3,3);scene.add(fill);
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-.018;floor.receiveShadow=true;scene.add(floor);
 const grid=new T.GridHelper(20,80,'#abb4b1','#c8ceca');grid.position.y=-.015;grid.material.transparent=true;grid.material.opacity=.29;scene.add(grid);
 const {root,groups}=createVehicle();scene.add(root);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.45;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.92;controls.target.set(0,.58,0);
 const presets={home:[5.4,3.1,-6.0],front:[.1,1.65,-7.1],rear:[4.6,2.8,5.8],side:[7.6,1.7,0],top:[0,7.8,.001]};
 camera.position.set(...presets.home);
 let cameraGoal=null,targetGoal=null,current={system:'all',selected:null,hideBody:false,isolate:false,explode:0,labels:false,wireframe:false},frame=0,disposed=false,dirty=true;
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const labelLayer=document.createElement('div');labelLayer.className='model-labels';container.append(labelLayer);
 const labels=new Map();
 for(const part of parts) {
  const el=document.createElement('button');el.type='button';el.className='model-label';el.textContent=part.name;el.dataset.part=part.id;el.addEventListener('click',e=>{e.stopPropagation();onSelect(part.id);});el.hidden=true;labelLayer.append(el);labels.set(part.id,el);
 }
 const highlight=new T.Box3Helper(new T.Box3(),0xb84a31);highlight.visible=false;highlight.material.transparent=true;highlight.material.opacity=.6;scene.add(highlight);
 const raycaster=new T.Raycaster(),mouse=new T.Vector2();let down=null;
 function pointer(event) {const rect=renderer.domElement.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);const candidates=[];for(const g of groups.values())if(g.visible&&(current.system==='all'||g.userData.system===current.system))g.traverse(o=>{if(o.isMesh)candidates.push(o)});return raycaster.intersectObjects(candidates,false)[0];}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};cameraGoal=null;targetGoal=null;});
 renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<5){const hit=pointer(e);if(hit)onSelect(hit.object.userData.partId);}down=null;});
 renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=pointer(e)?'pointer':'grab';});
 renderer.domElement.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();cameraGoal=null;targetGoal=null;
  const delta=camera.position.clone().sub(controls.target);const spherical=new T.Spherical().setFromVector3(delta);
  if(e.key==='ArrowLeft')spherical.theta-=.1;if(e.key==='ArrowRight')spherical.theta+=.1;if(e.key==='ArrowUp')spherical.phi-=.1;if(e.key==='ArrowDown')spherical.phi+=.1;
  if(e.key==='+'||e.key==='=')spherical.radius*=.9;if(e.key==='-')spherical.radius*=1.1;spherical.phi=T.MathUtils.clamp(spherical.phi,.02,Math.PI*.92);spherical.radius=T.MathUtils.clamp(spherical.radius,.45,12);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));
 });
 function update(next) {
  dirty=true;
  current={...current,...next};
  for(const [id,g] of groups) {
   const active=current.system==='all'||g.userData.system===current.system;
   g.visible=!(current.hideBody&&g.userData.system==='body'&&id!=='spaceframe');
   if(current.isolate)g.visible=g.visible&&(current.selected?id===current.selected:active);
   g.traverse(o=>{if(!o.isMesh)return;const original=o.userData.original;const ghost=!active&&!current.isolate;const selected=id===current.selected;
    o.material.color.copy(original.color);o.material.emissive.set(selected?'#bd532e':'#000000');o.material.emissiveIntensity=selected?.22:0;
    o.material.opacity=ghost?.075:original.opacity;o.material.transparent=ghost||original.transparent;o.material.depthWrite=!ghost&&original.opacity===1;o.material.wireframe=current.wireframe;o.castShadow=!ghost;o.material.needsUpdate=true;
   });
  }
  renderer.domElement.dataset.system=current.system;renderer.domElement.dataset.selected=current.selected||'';
 }
 function view(name) {cameraGoal=new T.Vector3(...(presets[name]||presets.home));targetGoal=new T.Vector3(0,.58,0);}
 function focus(id) {
  const g=groups.get(id);if(!g)return;root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(g);const centre=bounds.getCenter(new T.Vector3());const size=bounds.getSize(new T.Vector3()).length();
  const direction=camera.position.clone().sub(controls.target).normalize();targetGoal=centre;cameraGoal=centre.clone().addScaledVector(direction,T.MathUtils.clamp(size*2.1,1.1,7));
 }
 function resize() {const {width,height}=container.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);dirty=true;}
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 const overviewLabels=['engine-block','radiator','wheels','steering-wheel'];const temp=new T.Vector3(),bounds=new T.Box3();
 let lastTime=performance.now();
 function animate(){if(disposed)return;frame=requestAnimationFrame(animate);const now=performance.now();const dt=Math.min((now-lastTime)/1000,.5);lastTime=now;const cameraBlend=reducedMotion?1:1-Math.exp(-7*dt);const partBlend=reducedMotion?1:1-Math.exp(-10*dt);
  let moving=!!cameraGoal||!!targetGoal;
  for(const g of groups.values()){const goal=g.userData.spread.clone().multiplyScalar(current.explode);if(g.position.distanceToSquared(goal)>.000001){g.position.lerp(goal,partBlend);moving=true;}else g.position.copy(goal);}
  if(cameraGoal){camera.position.lerp(cameraGoal,cameraBlend);if(camera.position.distanceTo(cameraGoal)<.004)cameraGoal=null;}if(targetGoal){controls.target.lerp(targetGoal,cameraBlend);if(controls.target.distanceTo(targetGoal)<.004)targetGoal=null;}
  const orbitChanged=controls.update();if(!dirty&&!moving&&!orbitChanged)return;dirty=false;root.updateMatrixWorld(true);
  if(current.selected&&groups.get(current.selected).visible){highlight.box.setFromObject(groups.get(current.selected));highlight.visible=true;}else highlight.visible=false;
  const rect=container.getBoundingClientRect();let shown=0;
  for(const part of parts){const el=labels.get(part.id),g=groups.get(part.id);const eligible=current.labels&&g.visible&&(part.id===current.selected||(current.system==='all'?overviewLabels.includes(part.id):part.system===current.system&&shown<6));
   if(!eligible){el.hidden=true;continue;}shown++;bounds.setFromObject(g);bounds.getCenter(temp);temp.y=bounds.max.y+.07;temp.project(camera);el.hidden=temp.z>1||temp.z< -1||Math.abs(temp.x)>.93||Math.abs(temp.y)>.88;if(!el.hidden){el.style.left=`${(temp.x*.5+.5)*rect.width}px`;el.style.top=`${(-temp.y*.5+.5)*rect.height}px`;el.classList.toggle('selected',part.id===current.selected);}
  }
  renderer.render(scene,camera);
 }
 update(current);animate();
 return {update,view,focus,resize,getState:()=>({...current}),getPartCount:()=>groups.size,dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [o.material].flat())m.dispose();});envMap.dispose();renderer.dispose();}};
}
