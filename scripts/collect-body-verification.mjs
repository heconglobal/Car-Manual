// Collect independently completed runs when a long batch cannot finish.
import {readFile,writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
const sourceSha256=sourceFingerprint(),results=[];
for(const [script,file] of [['audit-exterior','exterior-audit'],['audit-body-dimensions','body-dimension-audit'],['audit-rear-body','rear-body-surface-audit'],['audit-front-clearance','front-clearance-audit'],['audit-exterior-fit','exterior-fit-audit']]){
 const path='artifacts/'+file+'.json';let report;try{report=JSON.parse(await readFile(path,'utf8'));}catch{}
 const current=report?.sourceSha256===sourceSha256,status=current&&report?.status==='passed'?'passed':'failed';
 results.push({script,status,currentSource:current,report:path,completedAt:report?.reviewedAt||report?.date||null});
}
const unchanged=sourceFingerprint()===sourceSha256,status=unchanged&&results.every(r=>r.status==='passed')?'passed':'failed';
await preserveFiles(['artifacts/body-geometry-verification.json'],'before-collecting-body-audits');
await writeFile('artifacts/body-geometry-verification.json',JSON.stringify({sourceSha256,finishedAt:new Date().toISOString(),unchanged,status,scope:'Five targeted body/clearance audits; not full aggregate vehicle verification.',execution:'Independently completed source-stamped reports, collected without rerunning or inferring checks.',results},null,2)+'\n');
console.log(JSON.stringify({sourceSha256,status,results},null,2));if(status!=='passed')process.exitCode=1;
