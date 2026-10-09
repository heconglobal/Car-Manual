import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import * as T from 'three';
import {encodeModel,decodeModel} from '../src/model-codec.js';
import {disposeModel} from '../src/model-resources.js';

// A delivery feasibility audit only. It does not change the browser loader.
const selected=process.argv.slice(2);
const builders={body:['../src/body-detail.js','createBodyDetail'],engine:['../src/engine-detail.js','createEngineDetail']};
if(!selected.length||selected.some(key=>!builders[key]))throw Error('Usage: node scripts/profile-prebuilt-details.mjs body [engine]');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function inputs(){
 const files=(await readdir('src')).filter(name=>name.endsWith('.js')&&!['viewer.js','main.js','overview-manifest.js','detail-loaders.js'].includes(name)).map(name=>'src/'+name).sort();
 const hash=createHash('sha256');for(const file of files)hash.update(file+'\0').update(await readFile(file)).update('\0');return hash.digest('hex');
}
const inputsSha256=await inputs(),folder='artifacts/detail-delivery-pilot/'+new Date().toISOString().replaceAll(':','-');
await mkdir(folder,{recursive:true});
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const identity=new T.Matrix4();
const totals=[];
for(const key of selected){
 const [moduleName,exportName]=builders[key],module=await import(moduleName),started=performance.now(),model=module[exportName](),constructionMs=performance.now()-started;
 assert.deepEqual(Object.keys(model).sort(),['groups','root'],'Models with behavior closures need a separate loader contract');
 model.root.updateMatrixWorld(true);assert(model.root.matrix.equals(identity),'Root transform must be identity');
 let meshes=0,triangles=0;const bounds={};
 for(const [id,group] of model.groups){
  assert.equal(group.parent,model.root);assert(group.matrix.equals(identity),'Group transform must be identity: '+id);
  assert.equal(group.visible,true,'Group visibility must be explicit in codec before delivery: '+id);
  const box=new T.Box3().setFromObject(group);bounds[id]=box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()};
  group.traverse(mesh=>{
   if(mesh===group)return;
   assert(mesh.isMesh,'Non-mesh hierarchy needs explicit codec support: '+id);assert.equal(mesh.parent,group);
   assert(!Array.isArray(mesh.material),'Material arrays need explicit codec support');
   assert(['MeshStandardMaterial','MeshPhysicalMaterial'].includes(mesh.material.type),'Unsupported material type');
   assert.equal(Object.keys(mesh.geometry.morphAttributes).length,0,'Morphs need explicit codec support');
   assert(!mesh.isSkinnedMesh,'Skins need explicit codec support');
   meshes++;triangles+=(mesh.geometry.index?.count||mesh.geometry.attributes.position.count)/3;
  });
 }
 let at=performance.now();const bytes=encodeModel(model,{compact:false}),encodingMs=performance.now()-at;
 at=performance.now();const compressed=gzipSync(bytes,{level:9}),compressionMs=performance.now()-at;
 at=performance.now();const decoded=decodeModel(bytes,recipe=>{const texture=new T.Texture();texture.userData.recipe=recipe;return texture;}),decodingMs=performance.now()-at;
 const roundtrip=encodeModel(decoded,{compact:false});
 if(digest(roundtrip)!==digest(bytes)){
  const metadata=buffer=>JSON.parse(new TextDecoder().decode(buffer.subarray(12,12+new DataView(buffer.buffer,buffer.byteOffset,buffer.byteLength).getUint32(8,true))));
  const a=metadata(bytes),b=metadata(roundtrip),differences=[];
  function compare(x,y,path=''){
   if(differences.length>=20)return;
   if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const key of new Set([...Object.keys(x),...Object.keys(y)]))compare(x[key],y[key],path+'.'+key);}
   else if(x!==y)differences.push({path,native:x,decoded:y});
  }
  compare(a,b);console.log(JSON.stringify({family:key,metadataDifferences:differences,nativeBytes:bytes.length,roundtripBytes:roundtrip.length}));
 }
 assert.equal(digest(roundtrip),digest(bytes),'All encoded attributes, indices, mesh transforms, options, explosion vectors, materials and texture recipes must survive exactly');
 for(const [id,group] of decoded.groups){const box=new T.Box3().setFromObject(group),actual=box.isEmpty()?null:{min:box.min.toArray(),max:box.max.toArray()};assert.deepEqual(actual,bounds[id],'Exact native bounds: '+id);}
 assert.equal(await inputs(),inputsSha256,'Geometry inputs changed during pilot');
 const payloadSha256=digest(compressed),path=folder+'/'+key+'-'+payloadSha256.slice(0,24)+'.bin.gz';
 await writeFile(path,compressed,{flag:'wx'});
 const report={family:key,generatedAt:new Date().toISOString(),inputsSha256,status:'passed',precision:'native typed attributes and indices, no quantization',groups:model.groups.size,meshes,triangles,bytes:compressed.byteLength,decodedBytes:bytes.byteLength,sha256:payloadSha256,decodedSha256:digest(bytes),path,timings:{constructionMs,encodingMs,compressionMs,decodingMs},checks:['No unsupported hierarchy, transforms, skinning, morphs, geometry ranges or material arrays','Byte-identical decode/re-encode of every typed attribute, index and encoded metadata','Exact per-part native and decoded bounds'],limits:'Node export and decode timing only. Browser canvas-texture creation, transfer, first draw and total process RAM require a separate browser run.'};
 await writeFile(folder+'/'+key+'.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(report));totals.push(report);
 disposeModel(model);disposeModel(decoded);
}
await writeFile(folder+'/summary.json',JSON.stringify(totals,null,2)+'\n',{flag:'wx'});
