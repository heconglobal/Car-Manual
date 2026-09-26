import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {regressionManifest,specs,assessRegression} from './regression-evidence.mjs';
import {remainingWork} from '../src/remaining-work.js';
import {assessVisualEvidence} from './visual-evidence.mjs';
const evidence=JSON.parse(await readFile('references/acceptance-evidence.json','utf8'));
const optionalJson=async path=>{try{return JSON.parse(await readFile(path,'utf8'));}catch{return null;}};
const browser=await optionalJson('artifacts/full-regression.json');
const geometry=await optionalJson('artifacts/model-audit.json');
const dimensionalReview=await optionalJson('artifacts/cross-view-scale-review.json');
const timingReview=await optionalJson('artifacts/engine-timing-audit.json');
const internalReview=await optionalJson('artifacts/engine-internals-audit.json');
const oilPumpReview=await optionalJson('artifacts/oil-pump-audit.json');
const exteriorReview=await optionalJson('artifacts/exterior-audit.json');
const rearBodyReview=await optionalJson('artifacts/rear-body-surface-audit.json');
const bodyDimensions=await optionalJson('artifacts/body-dimension-audit.json');
const allGeometry=await optionalJson('artifacts/geometry-verification.json');
const visual=await optionalJson('artifacts/visual-inspection-manifest.json');
const rows=remainingWork.flatMap((area,i)=>area.items.map((requirement,j)=>{const id=`${String(i+1).padStart(2,'0')}.${j+1}`,record=evidence.items[id]||{};return{id,area:area.name,requirement,status:record.status||'open',evidence:record.evidence||[],remaining:record.remaining||requirement};}));
for(const id of Object.keys(evidence.items))if(!rows.some(r=>r.id===id))throw new Error('Unknown acceptance ID '+id);
for(const row of rows)if(row.status==='complete'&&!row.evidence.length)throw new Error('Missing completion evidence for '+row.id);
const complete=rows.filter(r=>r.status==='complete').length;
// Allow the same Playwright inventory to be generated in a separate process
// when the execution environment restricts synchronous child processes.
const inventoryArg=process.argv.indexOf('--inventory');
const inventory=JSON.parse(inventoryArg>=0?await readFile(process.argv[inventoryArg+1],'utf8'):(await promisify(execFile)(process.execPath,['node_modules/@playwright/test/cli.js','test','--list','--reporter=json'],{encoding:'utf8',maxBuffer:8*1024*1024})).stdout);
if(inventory.config?.metadata?.sourceSha256!==sourceFingerprint())throw new Error('Test inventory is stale or missing its source fingerprint; regenerate it from the current Playwright configuration.');
const required=specs(inventory.suites),current=regressionManifest(),runs=[];
for(const name of await readdir('artifacts/regression-history').catch(()=>[])){
 if(!name.endsWith('.json'))continue;
 const path='artifacts/regression-history/'+name,record=await optionalJson(path);
 if(record?.report&&record?.manifest)runs.push({...record,path});
}
if(browser?.config?.metadata?.sourceSha256===current.sourceSha256)runs.push({report:browser,manifest:current,path:'artifacts/full-regression.json'});
const assessed=assessRegression(required,runs,current),sourceSha256=sourceFingerprint();
// Test-only edits do not alter geometry or pixels. Retain each artifact's
// original source hash; an archived run manifest proves identical app inputs.
const compatibleApplication=artifact=>artifact?.sourceSha256===sourceSha256||runs.some(r=>r.manifest.sourceSha256===artifact?.sourceSha256&&r.manifest.applicationSha256===current.applicationSha256&&r.report.config?.metadata?.sourceSha256===r.manifest.sourceSha256);
const geometryExact=geometry?.sourceSha256===sourceSha256;
const geometryCurrent=geometryExact||runs.some(r=>r.manifest.sourceSha256===geometry?.sourceSha256&&r.manifest.applicationSha256===current.applicationSha256&&r.report.config?.metadata?.sourceSha256===r.manifest.sourceSha256);
const browserStatus={...assessed,currentSource:assessed.passed,applicationSha256:current.applicationSha256,runs:[...new Set(assessed.outcomes.filter(o=>o.report).map(o=>o.report))],basis:'Latest result for every current test file on the identical application, dependencies and Playwright configuration. A changed app invalidates all old runs; a changed test invalidates results from that test file. Raw failed and successful runs remain archived.'};
const dimensionalReviewCurrent=compatibleApplication(dimensionalReview);
const dimensionalReviewPassed=dimensionalReviewCurrent&&dimensionalReview?.status==='passed';
const timingReviewCurrent=compatibleApplication(timingReview);
const timingReviewPassed=timingReviewCurrent&&timingReview?.status==='passed';
const internalReviewPassed=compatibleApplication(internalReview)&&internalReview?.status==='passed';
const allGeometryPassed=compatibleApplication(allGeometry)&&allGeometry?.unchanged&&allGeometry?.status==='passed';
const visualIntegrity=await assessVisualEvidence(visual,current.applicationSha256);
const visualCurrent=visualIntegrity.passed;
const report={generatedAt:new Date().toISOString(),accepted:complete===rows.length&&assessed.passed&&geometryCurrent&&dimensionalReviewPassed&&timingReviewPassed&&internalReviewPassed&&allGeometryPassed&&visualCurrent,criteria:'Every item completed with evidence and all software checks passed on the current application and test files; model presence alone does not establish dimensional or visual acceptance.',sourceSha256,requirements:rows.length,complete,partial:rows.filter(r=>r.status==='partial').length,open:rows.filter(r=>r.status==='open').length,browser:browserStatus,geometry:geometry?{date:geometry.date,currentSource:geometryCurrent,exactSnapshot:geometryExact,detailParts:geometry.detailParts,vehicleAssemblies:geometry.models.vehicle.parts}:null,dimensionalReview:{currentSource:dimensionalReviewCurrent,passed:dimensionalReviewPassed,status:dimensionalReview?.status||'missing',report:'artifacts/cross-view-scale-review.json',basis:'Actual shared-vertex comparisons and selected deck-plane, bank-stagger, containment, shaft, route-join, belt and decklid-clearance checks; independent of browser interaction results.'},rearBody:{passed:compatibleApplication(rearBodyReview)&&rearBodyReview?.status==='passed',checks:rearBodyReview?.checks?.length||0,opticalSamples:rearBodyReview?.opticalSamples?.length||0,lampDatums:rearBodyReview?.lampDatums?.length||0,report:'artifacts/rear-body-surface-audit.json'},bodyDimensions:{currentSource:compatibleApplication(bodyDimensions),passed:compatibleApplication(bodyDimensions)&&bodyDimensions?.status==='passed',checks:bodyDimensions?.rows?.length||0,unresolvedReferences:bodyDimensions?.unresolvedBumperReferences||[],report:'artifacts/body-dimension-audit.json',basis:'Selected published nominal dimensions measured on the reconstructed body mesh; not factory surface/tooling certification.'},exterior:{passed:compatibleApplication(exteriorReview)&&exteriorReview?.status==='passed',checks:exteriorReview?.checks?.length||0,bodySelections:exteriorReview?.bodySelections||0,report:'artifacts/exterior-audit.json'},oilPump:{passed:compatibleApplication(oilPumpReview)&&oilPumpReview?.status==='passed',status:oilPumpReview?.status||'missing',report:'artifacts/oil-pump-audit.json'},engineInternals:{passed:internalReviewPassed,status:internalReview?.status||'missing',report:'artifacts/engine-internals-audit.json'},allGeometry:{passed:!!allGeometryPassed,report:'artifacts/geometry-verification.json'},visual:{currentSource:!!visualCurrent,integrity:visualIntegrity,report:'artifacts/visual-inspection-manifest.json'},engineTiming:{currentSource:timingReviewCurrent,passed:timingReviewPassed,status:timingReview?.status||'missing',report:'artifacts/engine-timing-audit.json'},checklistSha256:createHash('sha256').update(await readFile('src/remaining-work.js')).digest('hex'),items:rows};
await writeFile('artifacts/regression-summary.json',JSON.stringify(browserStatus,null,2)+'\n');
await writeFile('artifacts/acceptance-status.json',JSON.stringify(report,null,2)+'\n');
let md='# Remaining 3D model and repair-manual work\n\nAcceptance requires every item below to be finished and tested. These are model/manual development tasks, not repairs diagnosed on the owner’s car. Native 3D, factory-new appearance and US left-hand drive remain required.\n\n'+`**${complete} / ${rows.length} requirements accepted.** Partial modeling and software tests do not close measured-geometry, factory-application or validated-procedure requirements. See [evidence ledger](references/acceptance-evidence.json) and [machine-readable status](artifacts/acceptance-status.json).\n`;
for(const [i,area]of remainingWork.entries()){md+=`\n## ${i+1}. ${area.name}\n\n${area.stage}.\n\n`;for(const row of rows.filter(r=>r.area===area.name)){md+=`- [${row.status==='complete'?'x':' '}] **${row.id}** ${row.requirement}\n`;if(evidence.items[row.id])md+=`  Progress: ${evidence.items[row.id].progress} Remaining: ${row.remaining}\n`;}}
await writeFile('REMAINING-WORK.md',md);
console.log(JSON.stringify({accepted:report.accepted,complete,requirements:rows.length,partial:report.partial,open:report.open,browser:{passed:report.browser.passed,passedTests:report.browser.passedTests,requiredTests:report.browser.requiredTests,missingTests:report.browser.missingTests}},null,2));
if(process.argv.includes('--require-complete')&&!report.accepted)process.exitCode=1;
