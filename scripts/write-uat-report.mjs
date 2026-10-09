import {readFile,writeFile} from 'node:fs/promises';
import {detailFamilies,detailMembers,detailParts} from '../src/inspection-catalog.js';
import {parts,tours} from '../src/data.js';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {regressionManifest} from './regression-evidence.mjs';
import {preserveFiles} from './preserve-files.mjs';
const read=async path=>{try{return JSON.parse(await readFile(path,'utf8'));}catch{return null;}};
const sourceSha256=sourceFingerprint(),manifest=regressionManifest();
const [status,geometry,visual,build,sources]=await Promise.all(['artifacts/acceptance-status.json','artifacts/geometry-verification.json','artifacts/visual-inspection-manifest.json','dist/build-manifest.json','references/completion-source-audit.json'].map(read));
const same=r=>r?.sourceSha256===sourceSha256||r?.applicationSha256===manifest.applicationSha256;
const currentStatus=same(status)?status:null;
const label=r=>same(r)?r.status||'recorded':'requires current-source verification';
const calloutRegister=await read('references/completion-callout-register.json');
const calloutRows=calloutRegister?.figures?.reduce((total,figure)=>total+figure.callouts.length,0)??'unverified';
const geometryLabel=currentStatus?.allGeometry?.passed?'passed (identical application; original audit source retained)':label(geometry);
const text=`# Current development and acceptance review

[Open the manual](http://localhost:5185/) · [Remaining requirements](../REMAINING-WORK.md)

The current application contains **${parts.length} vehicle assembly records and ${detailParts.length} detail selections across ${Object.keys(detailFamilies).length} families**, with ${tours.length} guides and orientation tours. Counts include grouped hardware, option alternatives and components shared between views; they are not a reconciled factory parts count.

## Work available for review

| Priority | Implementation and evidence | Acceptance boundary |
| --- | --- | --- |
| Application verification | Preserved build, inventory-driven browser batches, checkpointed geometry audits and explicit screenshot review. | Only completed reports matching current application inputs count. |
| Factory sources and callouts | Preserved year library, source/page audit, independent ${calloutRows}-row register covering battery, master cylinder, gearbox, wipers, spare/jack, doors and distributor, with unresolved rows recorded. | Full 1985 S-8510P and unresolved identities remain open. |
| Headlights | Rigid cover construction, linkage checks and actual cover/bucket triangle-contact tests at 41 poses per side supplement the early motor, aiming and relay breakdown. | Sampling does not establish continuous clearance, factory pivots or physical adjustment. |
| Mechanical interfaces | Fuel coupler continuity, battery ground hardware, static hose/shaft/route checks and a source-corrected 35-tooth speedometer drive gear. | Static modeled clearance does not establish full suspension travel, calibrated fit or measured routing. |
| Service procedures | Thirteen source-checked service guides, including eleven new maintenance procedures, plus three orientation tours. | Physical workshop validation is pending; each guide records applicability and prerequisites. |
| Missing assemblies and appearance | Door regulators/locks, wipers/washer, spare/jack/tools and C60 refrigeration now have selectable construction detail. | Remaining internals, production tooling and owner appearance acceptance stay open. |

Browser startup prepares the complete vehicle in stages and downloads full-precision Body/Engine payloads. Opened explorers remain cached for the session, so return navigation does not repeatedly reconstruct them. Mobile layouts hide camera presets, group secondary tools and reserve space around the model for controls. [Loading and memory measurements](../references/browser-loading.md) record the higher resident-memory tradeoff and identify the renderer, host and viewport; a simulated mobile viewport is not a physical-phone benchmark.

## Verification recorded for this application

- Build: **${label(build)}**. [Build manifest](../dist/build-manifest.json).
- Geometry suite: **${geometryLabel}**. [Audit results](geometry-verification.json).
- Browser scenarios: **${currentStatus?.browser?.passedTests??0}/${currentStatus?.browser?.requiredTests??'inventory pending'} eligible passes**. [Per-test evidence](regression-summary.json).
- Visual review: **${same(visual)?visual.captures.length:0} current recorded captures**. Current byte integrity is checked by the acceptance report. [Manifest](visual-inspection-manifest.json).
- Source audit: **${label(sources)}**. [Reference/page results](../references/completion-source-audit.json). Valid page references do not by themselves certify every shape, part number or procedure.

No stale report is presented here as a current pass. Prior reports, failed attempts and earlier captures remain preserved. [Full acceptance status](acceptance-status.json).

## Owner validation and remaining requirements

**${currentStatus?.complete??0}/${currentStatus?.requirements??109} requirements accepted${currentStatus?`; ${currentStatus.partial} partial and ${currentStatus.open} open`:''}.** The owner has the vehicle and plans to validate it later. Published specifications, software behavior, reconstructed geometry and physical acceptance are tracked separately.

The model is useful for construction and appearance review; it is not yet a complete measured replica or a physically validated repair manual. Exploded views do not certify collision-free removal paths. Original options, exact tooling, operating clearances and complete hidden construction remain open wherever supporting evidence is absent.

[Year library](../references/year-library/README.md) · [Cross-year application findings](../references/completion-multiyear-applicability.md) · [Independent callout register](../references/completion-callout-register.json) · [Service evidence](../references/completion-service-evidence.json)

| Explorer | Records / sets |
| --- | ---: |
${Object.values(detailFamilies).map(f=>`| ${f.name} | ${detailMembers(f.id).length} |`).join('\n')}

Current source: \`${sourceSha256}\`.
`;
if(sourceFingerprint()!==sourceSha256)throw Error('Source changed while writing review; retry after changes stop');
await preserveFiles(['artifacts/current-UAT.md','artifacts/UAT-readiness.md'],'before-review-refresh');
await writeFile('artifacts/current-UAT.md',text);await writeFile('artifacts/UAT-readiness.md',text.replace('# Current development and acceptance review','# Acceptance and verification status'));
console.log('Updated development review; accepted='+!!currentStatus?.accepted);
