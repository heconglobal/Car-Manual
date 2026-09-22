import assert from 'node:assert/strict';
import {readFile,readdir,stat,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files=(await readdir('dist',{recursive:true})).filter(f=>!f.endsWith('/'));
const records=[];
for(const file of files){
 const path='dist/'+file;if(!(await stat(path)).isFile())continue;
 assert(!/\.(pdf|jpe?g|png|webp|avif|gif|gltf|glb|obj|fbx)$/i.test(file),'Unexpected scan/photo/imported-model asset in distribution: '+file);
 const buffer=await readFile(path);
 records.push({file,bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')});
}
const notices=await readFile('dist/THIRD-PARTY-NOTICES.txt','utf8');
assert(notices.includes((await readFile('node_modules/three/LICENSE','utf8')).trim()),'Three.js MIT notice must accompany the bundled library');
assert(notices.includes('https://polyhaven.com/a/studio_small_09'),'HDR source attribution missing');
assert.equal(notices,await readFile('public/THIRD-PARTY-NOTICES.txt','utf8'));
assert((await readFile('dist/assets/studio_small_09_1k.hdr')).equals(await readFile('public/assets/studio_small_09_1k.hdr')),'Lighting asset differs from reviewed asset');
const report={date:new Date().toISOString(),status:'passed',checks:['No distributed manual scans, component photos or downloaded vehicle meshes','Three.js license included in distribution','HDR source notice and identical lighting asset retained'],files:records,limits:'File-content and packaging checks only; not a legal opinion or certification of all model/reference provenance.'};
await writeFile('artifacts/distribution-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
