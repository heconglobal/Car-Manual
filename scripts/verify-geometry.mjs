import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {preserveFiles} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';
const exec=promisify(execFile),sourceSha256=sourceFingerprint(),startedAt=new Date().toISOString();
const scripts=['audit-model','audit-exterior','audit-body-dimensions','audit-rear-body','audit-powertrain','audit-factory-datums','audit-engine-timing','audit-engine-internals','audit-oil-pump','audit-headlights','audit-headlight-electrical','audit-geometry-merge','audit-wiring','audit-front-clearance','audit-distribution'];
let previous=null;
if(process.argv.includes('--retry-failed')){
 previous=JSON.parse(await readFile('artifacts/geometry-verification.json','utf8'));
 if(previous.sourceSha256!==sourceSha256||!previous.unchanged||previous.results.length!==scripts.length||scripts.some(name=>!previous.results.some(r=>r.script===name)))throw Error('Cannot reuse geometry results from changed inputs or a different check set');
}
await preserveFiles(['artifacts/geometry-verification.json','artifacts/geometry-check-logs'],'before-geometry-checks');
await mkdir('artifacts/geometry-check-logs',{recursive:true});const results=[];
for(const name of scripts){
 const prior=previous?.results.find(r=>r.script===name);if(prior?.status==='passed'){results.push({...prior,retainedFrom:previous.startedAt});console.log(name+': retained current-source pass');continue;}
 const started=Date.now();let status='passed',code=0,output='';
 try{const r=await exec(process.execPath,['scripts/'+name+'.mjs'],{maxBuffer:8*1024*1024});output=r.stdout+r.stderr;}
 catch(e){status='failed';code=e.code;output=(e.stdout||'')+(e.stderr||'')+'\n'+e.message;}
 const log='artifacts/geometry-check-logs/'+name+'.log';await writeFile(log,output);
 results.push({script:name,status,exitCode:code,durationMs:Date.now()-started,log});console.log(name+': '+status+' ('+((Date.now()-started)/1000).toFixed(1)+'s)');
}
const unchanged=sourceFingerprint()===sourceSha256,passed=unchanged&&results.every(r=>r.status==='passed');
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,unchanged,status:passed?'passed':'failed',results};
await writeFile('artifacts/geometry-verification.json',JSON.stringify(report,null,2)+'\n');
console.log('Geometry verification: '+report.status);if(!passed)process.exitCode=1;
