import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {sourceFingerprint} from './source-fingerprint.mjs';
const digest=files=>{const h=createHash('sha256');for(const f of [...files].sort())h.update(f+'\0').update(readFileSync(f)).update('\0');return h.digest('hex');};
export function regressionManifest(){
 const tests=readdirSync('tests',{recursive:true}).filter(f=>/\.js$/.test(f));
 const testFiles=Object.fromEntries(tests.filter(f=>f.endsWith('.spec.js')).map(f=>[f,digest(['tests/'+f])]));
 const applicationFiles=['index.html','package.json','package-lock.json','playwright.config.js',...readdirSync('src',{recursive:true}).filter(f=>/\.(js|css)$/.test(f)).map(f=>'src/'+f),...readdirSync('public',{recursive:true}).map(f=>'public/'+f).filter(f=>statSync(f).isFile()),...tests.filter(f=>!f.endsWith('.spec.js')).map(f=>'tests/'+f)];
 return {capturedAt:new Date().toISOString(),sourceSha256:sourceFingerprint(),applicationSha256:digest(applicationFiles),testFiles,newestInputMtime:Math.max(...[...applicationFiles,...tests.map(f=>'tests/'+f)].map(f=>statSync(f).mtimeMs))};
}
export const specs=suites=>(suites||[]).flatMap(s=>[...(s.specs||[]),...specs(s.suites)]);
export function assessRegression(required,runs,current){
 const chosen=new Map();
 for(const run of [...runs].sort((a,b)=>Date.parse(a.report.stats?.startTime||0)-Date.parse(b.report.stats?.startTime||0))){
  const {report,manifest}=run;
  if(!manifest||manifest.applicationSha256!==current.applicationSha256||report.config?.metadata?.sourceSha256!==manifest.sourceSha256)continue;
  // The legacy report hash does not include public assets or index.html.
  // Refuse to attach a present-day manifest to a run predating any input edit.
  if(!Number.isFinite(manifest.newestInputMtime)||!Number.isFinite(Date.parse(report.stats?.startTime))||manifest.newestInputMtime>Date.parse(report.stats.startTime))continue;
  for(const spec of specs(report.suites)){
   if(!current.testFiles[spec.file]||manifest.testFiles[spec.file]!==current.testFiles[spec.file])continue;
   chosen.set(spec.id,{spec,run});
  }
 }
 const outcomes=required.map(spec=>{
  const selected=chosen.get(spec.id),tests=selected?.spec.tests;
  const passed=!!tests?.length&&tests.every(t=>t.expectedStatus==='passed'&&t.status==='expected'&&t.results?.length&&t.results.every(r=>r.status==='passed'))&&!selected.run.report.errors?.length;
  return {id:spec.id,file:spec.file,title:spec.title,passed,report:selected?.run.path||null,startTime:selected?.run.report.stats?.startTime||null};
 });
 return {passed:outcomes.length>0&&outcomes.every(o=>o.passed),requiredTests:outcomes.length,passedTests:outcomes.filter(o=>o.passed).length,missingTests:outcomes.filter(o=>!o.passed).map(o=>o.file+': '+o.title),outcomes};
}
