import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import * as T from 'three';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {createMaterials} from '../src/materials.js';
import {correctLegacyHandedness} from '../src/vehicle-frame.js';
import {createHeadlightDetail,buildHeadlightOverview} from '../src/headlight-detail.js';
import {createLightingDetail,buildLightingOverview} from '../src/lighting-detail.js';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const signature=m=>{const hash=createHash('sha256');for(const key of Object.keys(m.geometry.attributes).sort()){const a=m.geometry.attributes[key].array;hash.update(key).update(Buffer.from(a.buffer,a.byteOffset,a.byteLength));}if(m.geometry.index){const a=m.geometry.index.array;hash.update(Buffer.from(a.buffer,a.byteOffset,a.byteLength));}return hash.digest('hex');};
const count=groups=>{let meshes=0,triangles=0,geometryBytes=0;for(const g of groups.values())for(const m of g.children){meshes++;triangles+=(m.geometry.index?.count||m.geometry.attributes.position.count)/3;for(const a of Object.values(m.geometry.attributes))geometryBytes+=a.array.byteLength;geometryBytes+=m.geometry.index?.array.byteLength||0;}return{meshes,triangles,geometryBytes};};
const families=[];
for(const [family,create,build,owners]of [
 ['headlights',createHeadlightDetail,buildHeadlightOverview,['headlights','lighting-controls']],
 ['lighting',createLightingDetail,buildLightingOverview,['taillights','front-signals','marker-lamps','license-lamps','cabin-lamps']],
]){
 const full=create(),fullStats=count(full.groups),expected=new Map();
 for(const [id,g]of full.groups){expected.set(id,g.children.map(signature).sort());for(const m of g.children){m.geometry.dispose();m.material.dispose();}}full.root.clear();full.groups.clear();
 const overview=new Map(owners.map(id=>[id,new T.Group()])),started=performance.now();build(overview,createMaterials());correctLegacyHandedness(overview);const buildMs=performance.now()-started,actual=new Map();
 for(const g of overview.values())for(const m of g.children){const id=m.userData.detailPartId;assert(id,'missing source part identity');if(!actual.has(id))actual.set(id,[]);actual.get(id).push(signature(m));}
 for(const [id,hashes]of actual)assert.deepEqual(hashes.sort(),expected.get(id),id+' overview changed retained authored geometry');
 const overviewStats=count(overview);assert(overviewStats.triangles<fullStats.triangles*.85,family+' must actually reduce overview geometry');
 if(family==='headlights'){assert(actual.has('hl-left-cover')&&actual.has('hl-right-lens'));assert(!actual.has('hl-left-armature')&&!actual.has('hl-isolation-relay')&&!actual.has('hl-left-filaments'));}
 else{for(const id of ['lt-rear-left-outer-lens','lt-rear-left-red-lens','lt-rear-right-reverse-lens','lt-marker-front-left-lens'])assert(actual.has(id),id+' missing');assert(!actual.has('lt-rear-left-tail-socket')&&!actual.has('lt-front-left-bulb'));}
 families.push({family,retainedParts:actual.size,full:fullStats,overview:overviewStats,buildMs,geometryReduction:1-overviewStats.geometryBytes/fullStats.geometryBytes});
 for(const g of overview.values())for(const m of g.children){m.geometry.dispose();m.material.dispose();}
}
const report={date:new Date().toISOString(),sourceSha256:sourceFingerprint(),status:'passed',families,checks:['Every retained mesh matches the full-detail authored geometry byte for byte after LHD conversion','Curated outer lenses, optical grids, lamp covers and bezels retained','Hidden motor/relay/bulb/socket constructors omitted from overview','Overview geometry at least 15 percent lower in each family'],limits:'Node construction and geometry counters, not browser startup/FPS or native-device performance. Full detailed families remain available on demand.'};
const output='artifacts/lamp-overviews/'+report.date.replace(/[:.]/g,'-');await mkdir(output,{recursive:true});await writeFile(output+'/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,output},null,2));
