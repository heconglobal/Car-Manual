import {mkdtemp,cp,symlink,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {sourceFingerprint} from './source-fingerprint.mjs';
const run=promisify(execFile),sourceSha256=sourceFingerprint(),sandbox=await mkdtemp(join(tmpdir(),'fiero-index-compare-'));
const probe=`import * as T from 'three';
import {createHash} from 'node:crypto';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createVehicle}=await import('./src/model.js');
const start=performance.now(),model=createVehicle(),constructionMs=performance.now()-start;
let meshes=0,triangles=0,storedVertices=0;const parts={};
for(const [id,g]of model.groups){const rows=[];g.traverse(m=>{if(!m.isMesh)return;meshes++;storedVertices+=m.geometry.attributes.position.count;triangles+=(m.geometry.index?.count||m.geometry.attributes.position.count)/3;
 const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry,hash=createHash('sha256');
 for(const name of Object.keys(geo.attributes).sort())hash.update(name).update(Buffer.from(geo.attributes[name].array.buffer));
 rows.push({id:m.userData.detailPartId||null,option:m.userData.option||null,value:m.userData.value??null,material:m.userData.materialName,sha256:hash.digest('hex')});if(geo!==m.geometry)geo.dispose();});parts[id]=rows;
}
console.log(JSON.stringify({constructionMs,meshes,triangles,storedVertices,maxRssKiB:process.resourceUsage().maxRSS,parts}));`;
try{
 await cp('src',join(sandbox,'src'),{recursive:true});await symlink(join(process.cwd(),'node_modules'),join(sandbox,'node_modules'),'dir');
 await writeFile(join(sandbox,'package.json'),' {"type":"module"}\n');await writeFile(join(sandbox,'probe.mjs'),probe);
 const optimized=JSON.parse((await run(process.execPath,['probe.mjs'],{cwd:sandbox,maxBuffer:8*1024*1024})).stdout);
 const path=join(sandbox,'src/geometry.js'),code=await readFile(path,'utf8'),start=code.indexOf('    if(batch.length<2)continue;const geos='),end=code.indexOf('\n    const merged=',start);assert(start>0&&end>start);
 const reference="    if(batch.length<2)continue;const geos=batch.map(m=>{m.updateMatrix();const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(m.matrix);return geo;});";
 await writeFile(path,code.slice(0,start)+reference+code.slice(end));
 const previous=JSON.parse((await run(process.execPath,['probe.mjs'],{cwd:sandbox,maxBuffer:8*1024*1024})).stdout);
 assert.deepEqual(optimized.parts,previous.parts,'Whole-car geometry or selection/option/material identity changed');
 assert.equal(optimized.triangles,previous.triangles);assert.equal(optimized.meshes,previous.meshes);assert(optimized.storedVertices<previous.storedVertices);
 assert.equal(sourceFingerprint(),sourceSha256,'Source changed during comparison');
 const {parts:a,...indexed}=optimized,{parts:b,...expanded}=previous;
 const report={date:new Date().toISOString(),sourceSha256,status:'passed',indexed,expanded,vertexReductionPercent:(1-indexed.storedVertices/expanded.storedVertices)*100,geometryCheck:'Every vehicle mesh expanded triangle position, normal and UV hash, material bucket, detail ID, option and value matches the previous merge algorithm. Same current source in separate processes; only merge indexing differs.',limits:'Sequential single Node construction samples with stubbed canvas. Other workstation load is not controlled. Timing/RSS are observations, not isolated device or browser benchmarks.'};
 await writeFile('artifacts/indexed-geometry-comparison.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await rm(sandbox,{recursive:true,force:true});}
