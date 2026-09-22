import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessRegression} from './regression-evidence.mjs';
const required=[{id:'one',file:'one.spec.js',title:'one'},{id:'two',file:'two.spec.js',title:'two'}];
const current={applicationSha256:'app',testFiles:{'one.spec.js':'one-v1','two.spec.js':'two-v2'}};
function run(time,outcomes,{app='app',version='two-v2',validManifest=true}={}){
 return {path:'run-'+time,manifest:{applicationSha256:app,sourceSha256:'snapshot',newestInputMtime:Date.parse('2026-09-22T00:00:00Z'),testFiles:{'one.spec.js':'one-v1','two.spec.js':version}},report:{config:{metadata:{sourceSha256:validManifest?'snapshot':'different'}},stats:{startTime:`2026-09-22T00:00:0${time}Z`},errors:[],suites:[{specs:required.filter(s=>s.id in outcomes).map(s=>({...s,tests:[{status:outcomes[s.id]==='passed'?'expected':'unexpected',expectedStatus:'passed',results:[{status:outcomes[s.id]}]}]}))}]}};
}
test('unchanged application combines full baseline with corrected test-file rerun',()=>{
 const result=assessRegression(required,[run(1,{one:'passed',two:'failed'},{version:'two-v1'}),run(2,{two:'passed'})],current);
 assert.equal(result.passed,true);assert.equal(result.passedTests,2);assert.equal(result.outcomes[0].report,'run-1');assert.equal(result.outcomes[1].report,'run-2');
});
test('changed application or mismatched snapshot invalidates apparently passing evidence',()=>{
 for(const options of [{app:'old-app'},{validManifest:false}])assert.equal(assessRegression(required,[run(1,{one:'passed',two:'passed'},options)],current).passed,false);
});
test('a modified test requires a new run even if its title is unchanged',()=>{
 const result=assessRegression(required,[run(1,{one:'passed',two:'passed'},{version:'two-v1'})],current);
 assert.equal(result.passedTests,1);assert.deepEqual(result.missingTests,['two.spec.js: two']);
});
test('a newer failure or skip supersedes an earlier passing result',()=>{
 for(const status of ['failed','skipped','interrupted'])assert.equal(assessRegression(required,[run(1,{one:'passed',two:'passed'}),run(2,{two:status})],current).passed,false);
});
test('missing tests, report errors and flaky retries cannot pass acceptance',()=>{
 assert.equal(assessRegression(required,[run(1,{one:'passed'})],current).passed,false);
 const errors=run(1,{one:'passed',two:'passed'});errors.report.errors=[{message:'runner error'}];assert.equal(assessRegression(required,[errors],current).passed,false);
 const flaky=run(1,{one:'passed',two:'passed'});flaky.report.suites[0].specs[0].tests[0].results.unshift({status:'failed'});assert.equal(assessRegression(required,[flaky],current).passed,false);
});
test('assets edited after a run started invalidate a newly attached manifest',()=>{
 const edited=run(1,{one:'passed',two:'passed'});edited.manifest.newestInputMtime=Date.parse('2026-09-22T00:00:02Z');
 assert.equal(assessRegression(required,[edited],current).passed,false);
 delete edited.manifest.newestInputMtime;
 assert.equal(assessRegression(required,[edited],current).passed,false);
});
