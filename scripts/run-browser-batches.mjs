// Inventory-driven, resumable browser checks. Only archived, source-compatible
// passing reports are skipped; interrupted console output is never evidence.
import {execFileSync,spawn} from 'node:child_process';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {regressionManifest,specs,assessRegression} from './regression-evidence.mjs';
import {planBrowserBatches} from './browser-batch-plan.mjs';
import {preserveFiles} from './preserve-files.mjs';

const argv=process.argv.slice(2),option=name=>{
 const index=argv.indexOf(name);if(index<0)return null;
 assert(argv[index+1]&&!argv[index+1].startsWith('--'),'Missing value for '+name);
 return argv[index+1];
};
const inventoryPath=option('--inventory'),batchSize=Number(option('--batch-size')||2),dryRun=argv.includes('--dry-run');
assert(Number.isSafeInteger(batchSize)&&batchSize>0&&batchSize<=2,'Batch size must be 1 or 2');
const manifest=regressionManifest();
let inventory;
try{
 const json=inventoryPath?await readFile(inventoryPath,'utf8'):execFileSync(process.execPath,['node_modules/@playwright/test/cli.js','test','--list','--reporter=json'],{encoding:'utf8',maxBuffer:8*1024*1024});
 inventory=JSON.parse(json);
}catch(error){throw new Error('Cannot read Playwright inventory. Generate it directly with node node_modules/@playwright/test/cli.js test --list --reporter=json > /tmp/fiero-test-inventory-current.json, then use --inventory /tmp/fiero-test-inventory-current.json.',{cause:error});}
assert.equal(inventory.config?.metadata?.sourceSha256,manifest.sourceSha256,'Stale test inventory; regenerate it for the current source');
assert(!inventory.errors?.length,'Playwright inventory contains collection errors');
const required=specs(inventory.suites);assert(required.length,'Empty Playwright inventory');
const history=async()=>{
 const runs=[];
 for(const name of await readdir('artifacts/regression-history').catch(error=>{if(error.code==='ENOENT')return [];throw error;})){
  if(!name.endsWith('.json'))continue;
  const path='artifacts/regression-history/'+name,record=JSON.parse(await readFile(path,'utf8'));
  if(record.report&&record.manifest)runs.push({...record,path});
 }
 return runs;
};
const initial=assessRegression(required,await history(),manifest),passedIds=new Set(initial.outcomes.filter(row=>row.passed).map(row=>row.id));
const batches=planBrowserBatches(required,passedIds,batchSize);
const summary={sourceSha256:manifest.sourceSha256,applicationSha256:manifest.applicationSha256,requiredTests:required.length,retainedPasses:passedIds.size,pendingTests:required.length-passedIds.size,batchSize,batches};
if(dryRun){console.log(JSON.stringify(summary,null,2));process.exit(0);}
const path='artifacts/browser-batch-progress.json';
console.log('Preserved previous progress in '+await preserveFiles([path],'before-browser-batches'));
const progress={...summary,startedAt:new Date().toISOString(),status:'running',groups:[]};
const save=()=>writeFile(path,JSON.stringify(progress,null,2)+'\n');
const assertUnchanged=()=>{const now=regressionManifest();assert.equal(now.sourceSha256,manifest.sourceSha256,'Source changed during browser verification');assert.equal(now.applicationSha256,manifest.applicationSha256,'Application assets changed during browser verification');};
await save();
try{
 for(const batch of batches){
  assertUnchanged();
  const row={...batch,startedAt:new Date().toISOString(),status:'running'};progress.groups.push(row);await save();
  console.log('START BATCH '+batch.name+' ('+batch.ids.length+' tests)');
  const result=await new Promise((resolve,reject)=>{
   const child=spawn('npm',['test','--',...batch.args,'--workers=1'],{stdio:'inherit'});
   child.on('error',reject);child.on('exit',(code,signal)=>resolve({code,signal}));
  });
  row.finishedAt=new Date().toISOString();Object.assign(row,result);
  assertUnchanged();
  const report=JSON.parse(await readFile('artifacts/full-regression.json','utf8'));
  assert.equal(report.config?.metadata?.sourceSha256,manifest.sourceSha256,'Wrong report source');
  assert(Date.parse(report.stats?.startTime)>=Date.parse(row.startedAt),'A terminated process left an old report');
  assert.deepEqual(specs(report.suites).map(s=>s.id).sort(),[...batch.ids].sort(),'Batch report must contain exactly its selected tests');
  row.archive='artifacts/regression-history/'+report.stats.startTime.replaceAll(':','-')+'-'+manifest.sourceSha256.slice(0,12)+'.json';
  const archived=JSON.parse(await readFile(row.archive,'utf8'));
  assert.equal(archived.manifest?.sourceSha256,manifest.sourceSha256,'Missing preserved batch evidence');
  assert.equal(archived.manifest.applicationSha256,manifest.applicationSha256,'Wrong archived application');
  assert.deepEqual(archived.report,report,'Archived report differs from the completed report');
  const assessed=assessRegression(required.filter(s=>batch.ids.includes(s.id)),[{...archived,path:row.archive}],manifest);
  row.stats=report.stats;row.status=result.code===0&&assessed.passed?'passed':'failed';await save();
  console.log('FINISH BATCH '+batch.name+' '+row.status);
  if(row.status!=='passed')throw Error('Browser batch failed: '+batch.name+'; retained reports can be resumed after diagnosis');
 }
 assertUnchanged();
 const final=assessRegression(required,await history(),manifest);
 progress.passedTests=final.passedTests;progress.missingTests=final.missingTests;
 assert(final.passed,'Completed batches do not cover every current test');
 progress.status='passed';
}catch(error){progress.status='failed';progress.error=error.message;process.exitCode=1;console.error(error.stack);}
progress.finishedAt=new Date().toISOString();await save();console.log('BROWSER BATCHES '+progress.status);
