// Local comparison workspace: shares production geometry; omits concealed
// service assemblies and uses a simple lighting rig to make shape review fast.
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {parts} from './data.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {buildBody} from './body.js';
import {buildMechanics,buildInterior} from './mechanics.js';
import {buildVehicleLighting} from './lighting-detail.js';
import {buildVehicleHeadlights} from './headlight-detail.js';
import {buildVehicleExhaust} from './vehicle-exhaust.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {defaultConfiguration} from './configuration.js';
const host=document.querySelector('#model'),renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;host.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#d5d7d5');const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.5;
scene.add(new T.HemisphereLight('#fff9ef','#777e82',1.2));const key=new T.DirectionalLight('#fff7ec',2);key.position.set(4,7,-3);scene.add(key);
const root=new T.Group(),groups=new Map();for(const p of parts){const g=new T.Group();groups.set(p.id,g);root.add(g);}const mats=createMaterials(),h=geometryTools(groups,mats);
buildBody(h);buildMechanics(h);buildInterior(h);buildVehicleLighting(groups,mats);buildVehicleHeadlights(groups,mats);buildVehicleExhaust(groups,mats);h.optimize();correctLegacyHandedness(groups);
const config={...defaultConfiguration,roof:'glass',deck:'rack',headlights:true};
const visibleSystems=new Set(['body','interior']);for(const p of parts){const g=groups.get(p.id);g.visible=visibleSystems.has(p.system)||['wheels','tyres','tires','headlights','taillights','front-signals','marker-lamps','license-lamps','exhaust'].includes(p.id);g.traverse(m=>{if(!m.isMesh)return;m.visible=!m.userData.option||config[m.userData.option]===m.userData.value;});}
// Use the same alpha-glazing fallback as the manual on software renderers.
const gl=renderer.getContext(),debugInfo=gl.getExtension('WEBGL_debug_renderer_info');
if(debugInfo&&/SwiftShader|llvmpipe|Software/i.test(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)))root.traverse(m=>{
 if(!m.isMesh||!m.material.transmission)return;
 m.material.transmission=0;m.material.transparent=true;m.material.opacity=m.userData.materialName==='glass'?.22:.30;m.material.depthWrite=false;m.material.needsUpdate=true;
});
scene.add(root);const floor=new T.Mesh(new T.PlaneGeometry(30,30),new T.MeshBasicMaterial({color:'#d5d7d5'}));floor.rotation.x=-Math.PI/2;floor.position.y=-.006;scene.add(floor);
const camera=new T.PerspectiveCamera(35,1,.05,60),controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.62,0);controls.enableDamping=false;
const views={rear:{camera:[3.7,1.65,4.94],offset:.02,photo:'IMG_5461.jpg'},side:{camera:[7,1.15,1.2],offset:.13,photo:'IMG_5459.jpg'},front:{camera:[4.5,1.7,-5.0],offset:.02,photo:'IMG_5462.jpg'},straightRear:{camera:[0,1.1,5.5],offset:0,photo:'IMG_5461.jpg'},frontWheel:{camera:[2.0,.55,-1.1865],target:[.80,.307,-1.1865],offset:0,photo:'IMG_5459.jpg'},roof:{camera:[2.0,2.3,-.2],target:[0,1.0,.15],offset:0,photo:'IMG_5461.jpg'},frontClose:{camera:[1.8,1.2,-3.2],target:[0,.68,-1.10],offset:0,photo:'IMG_5462.jpg'}};
let queued=false;function render(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderer.render(scene,camera);});}function resize(){renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();render();}
function view(name){const v=views[name];camera.position.set(...v.camera);camera.setViewOffset(host.clientWidth,host.clientHeight,0,-host.clientHeight*v.offset,host.clientWidth,host.clientHeight);controls.target.set(...(v.target||[0,.62,0]));controls.update();document.querySelector('#photo').src='/references/owner-body-review/'+v.photo;render();}
controls.addEventListener('change',render);new ResizeObserver(resize).observe(host);
document.querySelector('#clay').addEventListener('change',e=>{root.traverse(m=>{if(!m.isMesh||m.userData.materialName!=='red')return;m.userData.reviewOriginal??=m.material;m.userData.reviewClay??=new T.MeshStandardMaterial({color:'#a8aeaa',roughness:.8,side:T.DoubleSide});m.material=e.target.checked?m.userData.reviewClay:m.userData.reviewOriginal;});render();});
for(const name of Object.keys(views)){const b=document.createElement('button');b.textContent={rear:'Rear quarter',side:'Side profile',front:'Front quarter',straightRear:'Straight rear',frontWheel:'Wheel detail',roof:'Roof and glazing',frontClose:'Hood and nose'}[name];b.dataset.reviewView=name;b.onclick=()=>view(name);document.querySelector('#views').append(b);}
window.__bodyReview={view,render,groups,bounds:id=>{root.updateMatrixWorld(true);const b=new T.Box3();groups.get(id).traverseVisible(m=>{if(m.isMesh)b.expandByObject(m);});return{min:b.min.toArray(),max:b.max.toArray()};}};resize();view('rear');renderer.domElement.dataset.ready='true';
