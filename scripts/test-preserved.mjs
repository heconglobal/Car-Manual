import {spawn} from 'node:child_process';
import {readdir,readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {preserveFiles,runId} from './preserve-files.mjs';
import {regressionManifest} from './regression-evidence.mjs';

// Every invocation owns fresh Playwright result and HTML directories. Preserve
// root-level captures/reports before legacy test filenames are written again.
const inputs=await readdir('artifacts',{withFileTypes:true});
console.log('Preserved prior artifacts in '+await preserveFiles(inputs.filter(e=>e.isFile()).map(e=>'artifacts/'+e.name),'before-browser'));
const output='artifacts/test-runs/'+runId();await mkdir(output,{recursive:true});
const manifest=regressionManifest();await writeFile(output+'/manifest.json',JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
const result=await new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,FIERO_RUN_OUTPUT:output,PLAYWRIGHT_HTML_OUTPUT_DIR:output+'/html'}});
 child.on('error',reject);child.on('exit',(code,signal)=>resolve({code,signal}));
});
const report=JSON.parse(await readFile('artifacts/full-regression.json','utf8'));
const finished=regressionManifest();
if(report.config?.metadata?.sourceSha256!==manifest.sourceSha256||finished.sourceSha256!==manifest.sourceSha256||finished.applicationSha256!==manifest.applicationSha256||Date.parse(report.stats.startTime)<Date.parse(manifest.capturedAt))throw Error('Cannot attach evidence to a changed application or an old report');
await copyFile('artifacts/full-regression.json',output+'/report.json',1);
await mkdir('artifacts/regression-history',{recursive:true});
const archive='artifacts/regression-history/'+report.stats.startTime.replaceAll(':','-')+'-'+manifest.sourceSha256.slice(0,12)+'.json';
await writeFile(archive,JSON.stringify({manifest,report},null,2)+'\n',{flag:'wx'});
console.log('Preserved this run in '+output+' and '+archive);
process.exitCode=result.code??1;
