import {ensureOverviewAsset} from './build-overview.mjs';
import {ensureDetailAssets} from './build-details.mjs';
import {ensureVehicleAsset} from './build-vehicle.mjs';
import {spawn} from 'node:child_process';
import {preserveFiles} from './preserve-files.mjs';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {localReferenceAssets,assertPublishableReference} from './local-reference-assets.mjs';
import {regressionManifest} from './regression-evidence.mjs';
const args=process.argv.slice(2),outIndex=args.indexOf('--outDir');
const output=outIndex>=0?args[outIndex+1]:(args.find(arg=>arg.startsWith('--outDir='))?.slice(9)||'dist');
if(!output||output.startsWith('--'))throw Error('Missing --outDir value');
console.log('Preserved previous build in '+await preserveFiles([output],'before-build'));
await ensureDetailAssets();
await ensureVehicleAsset();
await ensureOverviewAsset();
const manifest=regressionManifest(),startedAt=new Date().toISOString();
const code=await new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['node_modules/vite/bin/vite.js','build',...args,'--emptyOutDir','false'],{stdio:'inherit'});
 child.on('error',reject);child.on('exit',code=>resolve(code??1));
});
if(code===0){
 for(const file of localReferenceAssets){
  assertPublishableReference(file);const target=join(output,file);await mkdir(dirname(target),{recursive:true});await copyFile(file,target);
 }
 console.log('Published '+localReferenceAssets.length+' explicitly allowed project reference notes');
 const unchanged=regressionManifest().applicationSha256===manifest.applicationSha256;
 await writeFile(join(output,'build-manifest.json'),JSON.stringify({startedAt,finishedAt:new Date().toISOString(),sourceSha256:manifest.sourceSha256,applicationSha256:manifest.applicationSha256,status:unchanged?'passed':'invalid-source-change',localReferences:localReferenceAssets},null,2)+'\n');
 if(!unchanged)throw Error('Application changed during production build; preserved output cannot certify the new source');
}
process.exitCode=code;
