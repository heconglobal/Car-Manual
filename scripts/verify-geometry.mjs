// Small sequential audits persist a checkpoint after every completed check.
// Resume only against identical application source AND identical audit code.
import {spawn} from 'node:child_process';
import {writeFile,mkdir,readFile,readdir,stat,open} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {preserveFiles,runId} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';
const sourceSha256=sourceFingerprint(),startedAt=new Date().toISOString();
const checks=[
 ['audit-model','model-audit'],['audit-exterior','exterior-audit'],['audit-body-dimensions','body-dimension-audit'],['audit-rear-body','rear-body-surface-audit'],
 ['audit-powertrain','cross-view-scale-review'],['audit-factory-datums','factory-datums-audit'],['audit-engine-timing','engine-timing-audit'],['audit-engine-internals','engine-internals-audit'],['audit-oil-pump','oil-pump-audit'],
 ['audit-headlights','headlight-clearance-audit'],['audit-headlight-electrical','headlight-electrical-audit'],['audit-electrical','electrical-geometry-audit'],['audit-handedness',null],['audit-geometry-merge','geometry-merge-audit'],['audit-wiring','wiring-audit'],['audit-front-clearance','front-clearance-audit'],['audit-distribution','distribution-audit'],
 ['audit-interior','interior-audit'],['audit-exterior-fit','exterior-fit-audit'],['audit-exterior-completeness','exterior-completeness-audit'],['audit-window-seals','window-seal-audit'],['audit-pillar-profile','pillar-profile-audit'],['audit-exterior-reassessment','exterior-reassessment-audit'],['audit-assembly-interfaces','assembly-interface-audit'],
 ['audit-lamp-overviews',null],['audit-headlight-motion',null],
];
// Source-page/BOM research has its own evidence lifecycle and Python/network
// requirements; keep that audit separate from model construction checks.
for(const file of (await readdir('scripts')).filter(name=>/^audit-completion-.*\.mjs$/.test(name)&&name!=='audit-completion-sources.mjs').sort())checks.push([file.slice(0,-4),null]);
const fingerprint=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
const reportDirectory={
 'audit-lamp-overviews':'lamp-overviews',
 'audit-headlight-motion':'headlight-motion',
 'audit-completion-battery':'completion-battery','audit-completion-doors':'completion-doors',
 'audit-completion-headlight-cover':'completion-headlight','audit-completion-refrigeration':'completion-refrigeration',
 'audit-completion-spare':'completion-spare','audit-completion-wipers':'completion-wipers',
};
const freshReport=async(script,started)=>{
 const directory='artifacts/'+reportDirectory[script];
 if(!reportDirectory[script])throw Error('No report location registered for '+script);
 const candidates=[];
 for(const name of await readdir(directory,{recursive:true}))if(name.endsWith('.json')){
  const path=directory+'/'+name,info=await stat(path);if(info.mtimeMs>=started)candidates.push(path);
 }
 if(candidates.length!==1)throw Error('Expected one fresh report for '+script+', found '+candidates.length);
 return candidates[0];
};
// Helpers can change the result just as the entrypoint can. Bind resumable
// evidence to all audit/verification helpers instead of trusting a filename.
const auditFingerprint=async()=>{
 const auditInputs=(await readdir('scripts')).filter(name=>/\.mjs$/.test(name)&&!name.endsWith('.test.mjs')).sort();
 const auditDigest=createHash('sha256');for(const name of auditInputs)auditDigest.update(name+'\0').update(await readFile('scripts/'+name)).update('\0');return auditDigest.digest('hex');
};
const auditCodeSha256=await auditFingerprint();
let previous=null;
if(process.argv.includes('--retry-failed')){
 try{previous=JSON.parse(await readFile('artifacts/geometry-verification.json','utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(previous&&(previous.sourceSha256!==sourceSha256||previous.auditCodeSha256!==auditCodeSha256))throw Error('Cannot retain geometry checks after source or audit code changed; run without --retry-failed');
}
await preserveFiles(['artifacts/geometry-verification.json'],'before-geometry-checks');
const logDirectory='artifacts/geometry-check-logs/'+runId();await mkdir(logDirectory,{recursive:true});
const results=checks.map(([script,artifact])=>({script,artifact:artifact?'artifacts/'+artifact+'.json':null,status:'pending'}));
const report={startedAt,sourceSha256,auditCodeSha256,unchanged:true,status:'running',results};
const save=()=>writeFile('artifacts/geometry-verification.json',JSON.stringify(report,null,2)+'\n');await save();
for(const row of results){
 if(sourceFingerprint()!==sourceSha256){report.unchanged=false;report.error='Source changed during geometry verification';break;}
 if(await auditFingerprint()!==auditCodeSha256){report.unchanged=false;report.error='Audit code changed during geometry verification';break;}
 row.scriptSha256=await fingerprint('scripts/'+row.script+'.mjs');
 const prior=previous?.results.find(r=>r.script===row.script);
 if(prior?.status==='passed'&&prior.scriptSha256===row.scriptSha256){
  // A preserved log proves the process completed; mutable root artifacts do
  // not become new evidence just because an old exit code was zero.
  const logHash=await fingerprint(prior.log).catch(()=>null);
  const artifactHash=prior.artifact?await fingerprint(prior.artifact).catch(()=>null):null;
  if(logHash===prior.logSha256&&(!prior.artifact||artifactHash===prior.artifactSha256)){
   Object.assign(row,prior,{retainedFrom:previous.startedAt});await save();console.log(row.script+': retained current-source pass');continue;
  }
 }
 if(row.artifact)await preserveFiles([row.artifact],'before-'+row.script);
 const started=Date.now();Object.assign(row,{status:'running',startedAt:new Date().toISOString(),log:logDirectory+'/'+row.script+'.log'});await save();let output='';
 const log=await open(row.log,'wx');
 try{
  const result=await new Promise((resolve,reject)=>{
   const child=spawn(process.execPath,['scripts/'+row.script+'.mjs'],{stdio:['ignore',log.fd,log.fd]});
   child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));
  });
  row.exitCode=result.code;row.signal=result.signal;row.status=result.code===0?'passed':'failed';
 }catch(error){row.status='failed';row.exitCode=error.code??null;row.evidenceError=error.message;}
 finally{await log.close();}
 output=await readFile(row.log,'utf8');
 if(row.status==='passed'){
  try{
   if(!row.artifact&&reportDirectory[row.script])row.artifact=await freshReport(row.script,started);
   if(!row.artifact&&!output.trim())throw Error('Audit has neither a fresh report nor a completion log');
   if(row.artifact){
    const info=await stat(row.artifact),data=JSON.parse(await readFile(row.artifact,'utf8'));
    if(info.mtimeMs<started)throw Error('Audit left an older artifact instead of completing this run');
    if(data.sourceSha256&&data.sourceSha256!==sourceSha256)throw Error('Artifact source differs from frozen verification source');
    if(data.status&&data.status!=='passed')throw Error('Audit report status is '+data.status);
   }
  }catch(error){row.status='failed';row.evidenceError=error.message;output+='\n'+error.stack;}
 }
 row.durationMs=Date.now()-started;row.finishedAt=new Date().toISOString();await writeFile(row.log,output);row.logSha256=await fingerprint(row.log);
 if(row.artifact)row.artifactSha256=await fingerprint(row.artifact).catch(()=>null);
 if(sourceFingerprint()!==sourceSha256){row.status='invalid-source-change';report.unchanged=false;report.error='Source changed during '+row.script;}
 if(await auditFingerprint()!==auditCodeSha256){row.status='invalid-audit-code-change';report.unchanged=false;report.error='Audit code changed during '+row.script;}
 await save();console.log(row.script+': '+row.status+' ('+(row.durationMs/1000).toFixed(1)+'s)');
 if(!report.unchanged)break;
}
report.unchanged=report.unchanged&&sourceFingerprint()===sourceSha256&&await auditFingerprint()===auditCodeSha256;
report.status=report.unchanged&&results.every(r=>r.status==='passed')?'passed':'failed';report.finishedAt=new Date().toISOString();await save();
console.log('Geometry verification: '+report.status);if(report.status!=='passed')process.exitCode=1;
