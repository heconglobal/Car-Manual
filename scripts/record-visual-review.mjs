// Call only with captures that have actually been opened and inspected.
// This records evidence; it does not perform or certify visual inspection.
import {readFile,writeFile,stat} from 'node:fs/promises';
import {basename} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {regressionManifest} from './regression-evidence.mjs';
import {preserveFiles} from './preserve-files.mjs';
const current=regressionManifest(),path='artifacts/visual-inspection-manifest.json';
let prior;try{prior=JSON.parse(await readFile(path,'utf8'));}catch{}
if(prior?.sourceSha256!==current.sourceSha256)prior=null;
const captures=new Map((prior?.captures||[]).map(c=>[c.file,c]));
assert(process.argv.length>2,'Supply only filenames of images actually inspected.');
for(const name of process.argv.slice(2)){
 assert.equal(basename(name),name,'Use a capture filename, not an arbitrary path');
 const file='artifacts/'+name,s=await stat(file);assert(s.mtimeMs>=current.newestInputMtime,name+' predates the current application / test files');
 captures.set(name,{file:name,sha256:createHash('sha256').update(await readFile(file)).digest('hex'),capturedAt:s.mtime.toISOString(),reviewedAt:new Date().toISOString()});
}
const report={reviewedAt:new Date().toISOString(),sourceSha256:current.sourceSha256,applicationSha256:current.applicationSha256,status:'Development visual inspection; not final dimensional or photorealistic acceptance',captures:[...captures.values()],limits:'Explicitly recorded after opening these captures. Passing screenshots do not prove complete physical parts, original tooling, electrical operation, all devices or owner acceptance.'};
await preserveFiles([path],'before-recording-visual-review');
await writeFile(path,JSON.stringify(report,null,2)+'\n');console.log('Recorded '+report.captures.length+' inspected current-source captures.');
