// Run the unchanged browser suite in resumable groups. Each raw Playwright
// report is archived before the next group can overwrite the live report.
import {execFileSync,spawn} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {regressionManifest,specs} from './regression-evidence.mjs';

const cli='node_modules/@playwright/test/cli.js';
const groups=[
 ['headlights-and-guide',['tests/headlights.spec.js','tests/service-guides.spec.js','tests/coolant-guide.spec.js']],
 ['body-brakes-options',['tests/body-hardware.spec.js','tests/brakes.spec.js','tests/configuration.spec.js']],
 ['electrical-ignition-hvac',['tests/electrical.spec.js','tests/ignition.spec.js','tests/hvac.spec.js']],
 ['engine-fuel-exhaust',['tests/engine-service.spec.js','tests/oil-pump.spec.js','tests/engine.spec.js','tests/fuel.spec.js','tests/exhaust.spec.js']],
 ['running-gear-rear-body',['tests/suspension.spec.js','tests/transmission-cooling.spec.js','tests/valve-gear.spec.js','tests/rear-body.spec.js']],
 ['workshop-viewer',['tests/workshop.spec.js','--grep','renders 3D vehicle|system filtering|camera presets|visibility, labels|direct 3D picking']],
 ['workshop-guides-mobile',['tests/workshop.spec.js','--grep-invert','renders 3D vehicle|system filtering|camera presets|visibility, labels|direct 3D picking']],
];
const list=args=>specs(JSON.parse(execFileSync(process.execPath,[cli,'test',...args,'--list','--reporter=json'],{encoding:'utf8',maxBuffer:8*1024*1024})).suites);
const required=list([]),covered=groups.flatMap(([,args])=>list(args));
assert.equal(new Set(covered.map(s=>s.id)).size,covered.length,'Batches must not overlap');
assert.deepEqual(covered.map(s=>s.id).sort(),required.map(s=>s.id).sort(),'Batches must cover every test');
const manifest=regressionManifest();
const path='artifacts/browser-batch-progress.json';
const progress={startedAt:new Date().toISOString(),sourceSha256:manifest.sourceSha256,applicationSha256:manifest.applicationSha256,status:'running',requiredTests:required.length,groups:[]};
const save=()=>writeFile(path,JSON.stringify(progress,null,2)+'\n');
await save();
for(const [name,args] of groups){
 assert.equal(regressionManifest().sourceSha256,manifest.sourceSha256,'Source changed during browser verification');
 const row={name,args,startedAt:new Date().toISOString(),status:'running'};
 progress.groups.push(row);await save();console.log('\nSTART BATCH '+name);
 const result=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['scripts/test-preserved.mjs',...args,'--fully-parallel','--workers=2'],{stdio:'inherit'});
  child.on('error',reject);child.on('exit',(code,signal)=>resolve({code,signal}));
 });
 row.finishedAt=new Date().toISOString();Object.assign(row,result);
 const report=JSON.parse(await readFile('artifacts/full-regression.json','utf8'));
 assert.equal(report.config.metadata.sourceSha256,manifest.sourceSha256,'Wrong report source');
 assert(Date.parse(report.stats.startTime)>=Date.parse(row.startedAt),'A terminated process left an old report');
 row.stats=report.stats;
 row.archive='artifacts/regression-history/'+report.stats.startTime.replaceAll(':','-')+'-'+manifest.sourceSha256.slice(0,12)+'.json';
 assert(JSON.parse(await readFile(row.archive,'utf8')).manifest.sourceSha256===manifest.sourceSha256,'Missing preserved batch evidence');
 row.status=result.code===0?'passed':'failed';await save();
 console.log('FINISH BATCH '+name+' '+row.status);
 if(result.code!==0){progress.status='failed';await save();process.exitCode=1;break;}
}
if(progress.groups.length===groups.length&&progress.groups.every(g=>g.status==='passed'))progress.status='passed';
progress.finishedAt=new Date().toISOString();await save();
console.log('BROWSER BATCHES '+progress.status);
