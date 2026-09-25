import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {parts} from './data.js';
import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {buildBody} from './body.js';
import {createLightingDetail} from './lighting-detail.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
const host=document.querySelector('#model'),renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;host.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#d9dcda');const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.7;
scene.add(new T.HemisphereLight('#fffaf3','#777c80',1.6));const light=new T.DirectionalLight('#fff7ed',2.3);light.position.set(-3,5,5);scene.add(light);
const body=new T.Group(),groups=new Map();for(const p of parts){const g=new T.Group();groups.set(p.id,g);body.add(g);}const h=geometryTools(groups,createMaterials());buildBody(h);h.optimize();correctLegacyHandedness(groups);scene.add(body);
const lighting=createLightingDetail();scene.add(lighting.root);
const rearIds=new Set(['rear-fascia','rear-pad-left','rear-pad-right','rear-plate-mount','rear-fascia-molding','rear-emblems','quarter-left','quarter-right','decklid','deck-vent-left','deck-vent-right','rear-clip','rear-window','sail-left','sail-right','roof']);
for(const [id,g]of groups){g.visible=rearIds.has(id);g.traverse(m=>{if(m.isMesh&&m.userData.option)m.visible=false;});}
const camera=new T.PerspectiveCamera(35,1,.02,30),controls=new OrbitControls(camera,renderer.domElement);let queued=false;
function render(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderer.render(scene,camera);});}
function view(name){
 const detail=name==='lamp'||name==='exploded';body.visible=!detail;
 for(const [id,g]of lighting.groups){g.visible=detail?id.startsWith('lt-rear-left-'):id.startsWith('lt-rear-')||id.startsWith('lt-license-');g.position.set(0,0,0);if(name==='exploded'&&g.visible)g.position.copy(g.userData.spread).multiplyScalar(1.3);}
 const views={straight:[[0,.77,4.25],[0,.71,1.86]],quarter:[[-2.7,1.5,4.2],[0,.74,1.6]],lamp:[[-.43,.83,3.24],[-.40,.71,1.90]],exploded:[[-1.15,1.19,3.18],[-.40,.73,1.90]]};
 camera.position.set(...views[name][0]);controls.target.set(...views[name][1]);controls.update();renderer.domElement.dataset.view=name;render();
}
function resize(){renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();render();}
new ResizeObserver(resize).observe(host);controls.addEventListener('change',render);document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
window.__tailReview={view,groups:lighting.groups,bodyGroups:groups,render};resize();view('straight');renderer.domElement.dataset.ready='true';
