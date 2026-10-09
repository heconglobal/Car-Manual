import assert from 'node:assert/strict';
import {readFile,readdir,stat,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {localReferenceAssets,localSourceAssetPath,assertPublishableReference} from './local-reference-assets.mjs';
import {sources} from '../src/data.js';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
import {regressionManifest} from './regression-evidence.mjs';
import {overviewInputs} from './build-overview.mjs';
import {generatedOverviewDescriptors,inspectGeneratedOverview} from './generated-overview-evidence.mjs';
import {detailInputs} from './build-details.mjs';
import {generatedDetailDescriptors,inspectGeneratedDetail} from './generated-details-evidence.mjs';
import {vehicleInputs} from './build-vehicle.mjs';
import {generatedVehicleDescriptors,inspectGeneratedVehicle} from './generated-vehicle-evidence.mjs';
import {parts} from '../src/data.js';
import {nativeConfigurationCases} from './audit-native-delivery.mjs';
import {bodyParts} from '../src/body-catalog.js';
import {engineParts} from '../src/engine-catalog.js';
const sourceSha256=sourceFingerprint();
const buildManifest=JSON.parse(await readFile('dist/build-manifest.json','utf8'));
assert.equal(buildManifest.status,'passed','Production build did not finish on unchanged inputs');
assert.equal(buildManifest.applicationSha256,regressionManifest().applicationSha256,'Production build is stale; run npm run build before verification');
const files=(await readdir('dist',{recursive:true})).filter(f=>!f.endsWith('/'));
const records=[];
const generatedDescriptors=await generatedOverviewDescriptors(),detailDescriptors=await generatedDetailDescriptors(),vehicleDescriptors=await generatedVehicleDescriptors(),generatedOverviews=[],generatedDetails=[],generatedVehicles=[];
for(const file of files){
 const path='dist/'+file;if(!(await stat(path)).isFile())continue;
 assert(!/\.(pdf|jpe?g|png|webp|avif|gif|gltf|glb|obj|fbx)$/i.test(file),'Unexpected scan/photo/imported-model asset in distribution: '+file);
 const buffer=await readFile(path);
 if(file.startsWith('models/')){
  const descriptor=generatedDescriptors.get(file)||detailDescriptors.get(file)||vehicleDescriptors.get(file);assert(descriptor,'Model payload lacks a preserved native generator descriptor: '+file);
  assert(buffer.equals(await readFile('public/'+file)),'Distributed model differs from generated public payload: '+file);
  if(vehicleDescriptors.has(file))generatedVehicles.push(inspectGeneratedVehicle(buffer,descriptor));
  else if(detailDescriptors.has(file))generatedDetails.push(inspectGeneratedDetail(buffer,descriptor));
  else generatedOverviews.push(inspectGeneratedOverview(buffer,descriptor));
 }
 records.push({file,bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')});
}
const notices=await readFile('dist/THIRD-PARTY-NOTICES.txt','utf8');
assert(notices.includes((await readFile('node_modules/three/LICENSE','utf8')).trim()),'Three.js MIT notice must accompany the bundled library');
assert(notices.includes('https://polyhaven.com/a/studio_small_09'),'HDR source attribution missing');
assert.equal(notices,await readFile('public/THIRD-PARTY-NOTICES.txt','utf8'));
assert((await readFile('dist/assets/studio_small_09_1k.hdr')).equals(await readFile('public/assets/studio_small_09_1k.hdr')),'Lighting asset differs from reviewed asset');
for(const file of localReferenceAssets){assertPublishableReference(file);assert((await readFile('dist/'+file)).equals(await readFile(file)),'Published authored reference differs from source: '+file);}
const localSources=[];for(const source of sources){const path=localSourceAssetPath(source.url);if(path===null)continue;assertPublishableReference(path);assert((await stat('dist/'+path)).isFile(),'Missing local source link '+source.url);localSources.push({id:source.id,url:source.url,path});}
for(const record of records.filter(r=>r.file.startsWith('references/')))assertPublishableReference(record.file);
const activeOverview=generatedOverviews.find(row=>row.descriptor==='src/overview-manifest.js');assert(activeOverview,'Active authored overview payload is missing');
assert.equal(activeOverview.sourceInputsSha256,(await overviewInputs()).sha256,'Authored overview is stale relative to its source builders');
const activeVehicle=generatedVehicles.find(row=>row.descriptor==='src/vehicle-manifest.js');assert(activeVehicle,'Active native vehicle payload is missing');
assert.equal(activeVehicle.sourceInputsSha256,(await vehicleInputs()).sha256,'Native vehicle is stale relative to its source builders');
assert.deepEqual([...activeVehicle.partIds].sort(),parts.map(part=>part.id).sort(),'Packaged vehicle owners differ from current catalog');
assert.equal(activeVehicle.validation.configurationCases,nativeConfigurationCases().length,'Vehicle configuration coverage differs from currently supported choices');
const activeDetailInputs=(await detailInputs()).sha256,detailCatalogs={'body-system':bodyParts,engine:engineParts};
for(const record of [...detailDescriptors.values()].filter(row=>row.descriptor==='src/detail-manifest.js')){
 const packaged=generatedDetails.find(row=>row.file===record.manifest.url.slice(1));assert(packaged,'Active authored detail payload is missing: '+record.manifest.family);
 assert.equal(packaged.sourceInputsSha256,activeDetailInputs,'Authored detail is stale relative to its source builders');
 assert.deepEqual([...packaged.partIds].sort(),detailCatalogs[packaged.family].map(part=>part.id).sort(),'Packaged detailed part identities differ from the complete current catalog');
}
assert.equal(sourceFingerprint(),sourceSha256,'Source changed during distribution checks');
const report={date:new Date().toISOString(),sourceSha256,status:'passed',buildManifest,checks:['Production build matches unchanged current application inputs','No distributed manual scans, component photos or downloaded vehicle meshes','Every model payload matches a preserved native generator descriptor, compressed hash, format and geometry inventory','Active authored overview matches its current source builders; older generated outputs remain preserved','Every active authored detail retains native unquantized buffers, exact catalog identities and recorded native round-trip/bounds validation','Complete native vehicle preserves exact original bits after lossless packing, all owners and recorded native rendering/configuration equivalence','Three.js license included in distribution','HDR source notice and identical lighting asset retained','Explicitly allowed authored notes are byte-identical to source','Every local source URL resolves to an explicitly published reference'],localSources,generatedOverviews,generatedDetails,generatedVehicles,files:records,limits:'File-content and packaging checks only; not a legal opinion or certification of all model/reference provenance.'};
await preserveFiles(['artifacts/distribution-audit.json'],'before-distribution-audit');
await writeFile('artifacts/distribution-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
