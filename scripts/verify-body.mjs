// Focused body regression. This does not claim a complete vehicle audit.
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir,writeFile} from 'node:fs/promises';
import {preserveFiles,runId} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';
const exec=promisify(execFile),sourceSha256=sourceFingerprint(),startedAt=new Date().toISOString(),results=[];
await preserveFiles(['artifacts/body-geometry-verification.json','artifacts/exterior-audit.json','artifacts/body-dimension-audit.json','artifacts/rear-body-surface-audit.json','artifacts/front-clearance-audit.json','artifacts/exterior-fit-audit.json'],'before-focused-body-audits');
const dir='artifacts/body-check-logs/'+runId();await mkdir(dir,{recursive:true});
for(const script of ['audit-exterior','audit-body-dimensions','audit-rear-body','audit-front-clearance','audit-exterior-fit']){
 let status='passed',exitCode=0,output='';const start=Date.now();
 try{const r=await exec(process.execPath,['scripts/'+script+'.mjs'],{maxBuffer:8*1024*1024});output=r.stdout+r.stderr;}
 catch(e){status='failed';exitCode=e.code;output=(e.stdout||'')+(e.stderr||'')+String(e);}
 const log=dir+'/'+script+'.log';await writeFile(log,output);results.push({script,status,exitCode,durationMs:Date.now()-start,log});console.log(script+': '+status);
}
const unchanged=sourceFingerprint()===sourceSha256,status=unchanged&&results.every(r=>r.status==='passed')?'passed':'failed';
await writeFile('artifacts/body-geometry-verification.json',JSON.stringify({sourceSha256,startedAt,finishedAt:new Date().toISOString(),unchanged,status,scope:'Five targeted body/clearance audits; not full aggregate vehicle verification.',results},null,2)+'\n');
if(status!=='passed')process.exitCode=1;
