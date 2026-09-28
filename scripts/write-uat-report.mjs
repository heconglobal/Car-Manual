import {readFile,writeFile} from 'node:fs/promises';
import {detailFamilies,detailMembers,detailParts} from '../src/inspection-catalog.js';
import {parts} from '../src/data.js';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {regressionManifest} from './regression-evidence.mjs';
const read=async name=>{try{return JSON.parse(await readFile('artifacts/'+name+'.json','utf8'));}catch{return null;}};
const [status,interior,body,exterior,visual,build]=await Promise.all(['acceptance-status','interior-audit','body-dimension-audit','exterior-reassessment-audit','visual-inspection-manifest','interior-i1-build'].map(read));
const manifest=regressionManifest(),same=r=>r?.sourceSha256===sourceFingerprint()||r?.applicationSha256===manifest.applicationSha256;
const text=`# Current development review — Interior I1 / Body R12

[Open the manual](http://localhost:5185/) · [Interior/reference comparison](http://localhost:5185/interior-review.html)

Interior I1 replaces the generic seats and cabin trim with a reconstruction based on the 1985 Pontiac showroom brochure, GM early seat/console/trim diagrams and MVMA cabin specifications. The working finish is grey cloth with headrest speakers; the original trim code remains unknown.

## Changes available for review

- Both bucket seats have distinct upholstery, foam with speaker cavities, frames, support wires, tracks, sliders, recliners, hinge pins and mounting hardware. Four separate floor nuts and four rail bolts are selectable per seat.
- Dashboard/map pocket, vertical end vents, four-speed console, storage door and fittings, ashtrays, Delco radio, door pulls/handles, carpet, sills, pillar garnish, headliner, visors and mirror are rebuilt or separately explorable.
- Belts, buckles and anchors, steering-wheel/column trim and driver controls are included. Existing instrument, HVAC, ECM, lighting, brake-pedal and parking-brake models are shared and linked to their component explorers.
- The Interior family has **313 selectable records/sets**, including alternatives and shared contexts. Open **Interior & controls → 1985 SE bucket seats → Explode this assembly**, then select a seat or another cabin subassembly. Individual fasteners can be isolated. This is a construction view, not a disassembly procedure.

[Specification and reconstruction record](../references/interior-i1-reconstruction.md) · [313-record source-linked inventory](../references/interior-i1-parts-inventory.csv)

## Verification scope

- Interior geometry audit: **${interior?.status||'missing'}**, ${interior?.checks?.length||0} check groups. It checks finite/owned geometry, identical native vehicle/explorer components, mirrored and contained upholstery, separate mounting hardware, left-hand-drive controls, nominal steering/back reference angles, option flags and static seat clearance. [Results](interior-audit.json).
- Published body envelope: **${body?.status||'missing'}**, ${body?.rows?.length||0} nominal dimensions. [Results](body-dimension-audit.json). R12 exterior interface audit: **${exterior?.status||'missing'}**, ${exterior?.checks?.length||0} groups. [Results](exterior-reassessment-audit.json). The exterior surfaces remain R12; moving door clips behind the interior panel and aligning reconstructed seat supports does not certify the frame.
- The full all-family model audit was attempted twice on the final source; both processes ended with signal-derived exit code 143 before producing a final result. Its linked JSON is the retained prior-source result. No final-source full-model pass is claimed. The focused audits above completed on the final source.
- Browser evidence: **${status?.browser?.passedTests||0}/${status?.browser?.requiredTests||0} current scenarios** have eligible passing reports. This bounded interior pass is not a full application regression. Failed attempts and earlier-source runs remain archived. [Details](browser-verification-notes.md).
- Visual review: **${same(visual)?visual.captures.length:0} current saved views opened and inspected**, with retained image hashes. [Manifest](visual-inspection-manifest.json). Screenshots are development appearance evidence, not factory tooling measurements or owner acceptance.
- Preserved production build: **${same(build)?build.status:'requires refresh'}**. Software Chromium is not a native-GPU performance or broad-device certification.

## Acceptance still open

**${status?.complete||0}/${status?.requirements||109} requirements accepted; ${status?.partial||0} partial and ${status?.open||0} open.** [Full checklist](../REMAINING-WORK.md).

The published 16.5° wheel angle and 26.5° design back angle guide this reconstruction. Effective leg/head/hip/shoulder room are SAE occupant-envelope values; they are not claimed as verified by measuring arbitrary cloth vertices. Cushion tooling, upholstery patterns, exact colours, hidden mechanisms, all production rivet/fastener quantities, original option identity, calibrated movement and physical service validation remain unverified. The model is ready for the owner's next appearance review, not certification as an exact showroom replica.

The app contains ${parts.length} vehicle assembly records and ${detailParts.length} detail selections across ${Object.keys(detailFamilies).length} families. Counts overlap between views and include sets.

| Explorer | Records / sets |
| --- | ---: |
${Object.values(detailFamilies).map(f=>`| ${f.name} | ${detailMembers(f.id).length} |`).join('\n')}

Current source: \`${sourceFingerprint()}\`.

[Acceptance evidence](../references/acceptance-evidence.json) · [Browser status](regression-summary.json) · [Model audit](model-audit.json) · [Checklist/test mapping](checklist-test-matrix.md)
`;
await writeFile('artifacts/current-UAT.md',text);await writeFile('artifacts/UAT-readiness.md',text.replace('# Current development review','# Acceptance and verification status'));console.log('Updated Interior I1 review; accepted='+!!status?.accepted);
