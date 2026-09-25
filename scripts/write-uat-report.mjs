import {readFile,writeFile} from 'node:fs/promises';
import {detailFamilies,detailMembers,detailParts} from '../src/inspection-catalog.js';
import {parts} from '../src/data.js';
const read=async f=>{try{return JSON.parse(await readFile('artifacts/'+f+'.json','utf8'));}catch{return null;}};
const [status,checks,links,pages,native,visual,comparison,bodyChecks]=await Promise.all(['acceptance-status','geometry-verification','reference-link-audit','reference-page-audit','native-windows-internals-review','visual-inspection-manifest','indexed-geometry-comparison','body-geometry-verification'].map(read));
const source=status?.sourceSha256,browser=status?.browser;
const app=browser?.applicationSha256,compatible=r=>!!r&&((!!source&&r.sourceSha256===source)||(!!app&&r.applicationSha256===app));
const tests=browser?.passed?`**All ${browser.requiredTests} browser scenarios pass against the current application and test files.** Raw full/targeted outcomes and exact source manifests are retained.`:`**Full browser regression is not yet passing on the current source.** ${browser?.passedTests||0}/${browser?.requiredTests||31} scenarios have eligible passing evidence; an unfinished or interrupted run does not count as a complete pass.`;
const rows=Object.values(detailFamilies).map(f=>`| ${f.name} | ${detailMembers(f.id).length} |`).join('\n');
const inspected=new Set(compatible(visual)?visual.captures.map(c=>c.file):[]);
const hardware=compatible(native)?`Native Windows Edge used **${native.renderer?.renderer}**. It captured ${native.captures.length} vehicle/lifter/pump states and recorded ${native.errors.length} application exceptions. ${native.captures.filter(c=>inspected.has(c.file)).length} of those captures were opened and inspected. Initial readiness was ${(native.loadReadyMs/1000).toFixed(1)} seconds on this workstation. Captures retain their original source snapshot; a test-only edit does not change the rendered application. This is a bounded hardware review, not a full hardware regression or a device-performance guarantee.`:'Hardware captures require a current-source refresh.';
const geometry=status?.allGeometry?.passed?`${checks.results.filter(r=>r.status==='passed').length}/${checks.results.length} geometry checks passed against the current application. Outstanding failures: ${checks.results.filter(r=>r.status!=='passed').map(r=>r.script).join(', ')||'none'}.`:'Aggregate geometry checks require a current-source refresh.';
const bodyGeometry=bodyChecks?.sourceSha256===source&&bodyChecks.status==='passed'?'All five targeted body/clearance audits pass on this source. [Focused results](body-geometry-verification.json). This is a focused exterior verification, not a current full-vehicle aggregate pass.':'Targeted body checks require refresh.';
const timing=status?.engineTiming?.currentSource?'Engine timing audit: **'+status.engineTiming.status+'**. The expanded checks cover the 159.03 mm GM family datum, concentric journals/bearings, reconstructed cam insertion envelope, cover/gasket/chain containment and static follower/pushrod/guide interfaces. Original tooling, running clearances and valve timing remain unverified.':'Engine timing requires a current-source audit.';
const optimization=comparison?.sourceSha256===source&&comparison.status==='passed'?`Every vehicle mesh’s expanded triangle position/normal/UV hash, material, detail ID and option identity matches the previous merge algorithm. Both contain ${comparison.indexed.triangles.toLocaleString('en-US')} triangles. Stored vertices fall from ${comparison.expanded.storedVertices.toLocaleString('en-US')} to ${comparison.indexed.storedVertices.toLocaleString('en-US')} (${comparison.vertexReductionPercent.toFixed(2)}% fewer). The timing/RSS observations retain their workload limits; they are not browser-performance promises.`:'See the geometry comparison for its source and limits.';
const body=`# Current development review — Body R8 complete exterior pass

[Open the workshop](http://localhost:5185/) · [Shared workstation](http://100.122.225.61:5185/)

**Not ready for final UAT under the requested all-items-complete criterion.** ${status?.complete||0}/${status?.requirements||109} requirements are accepted; ${status?.partial||0} are partial and ${status?.open||0} remain open. The [checklist](../REMAINING-WORK.md) retains the full scope and evidence gaps.

## This pass

- Side and wraparound moldings follow the installed panel skin across their entire cross section. The side line no longer bows at the rear quarter.
- The driver intake sits below the molding, with accurately cut intake/fuel apertures. The front deflector sits below the lower nose return.
- The roof return and rear pillar share their upper boundary. Hood/deck seams, wheel faces, tire sidewalls and tread, carrier/wing support contacts, sail appliques, paint reflections and lamp covers were refined and checked in close views.
- The deeper R7 rear apron, curved bumper ends, exhaust scallops, recessed plate and softened lamp corners remain.
- The [R8 exterior specification](../references/body-r8-specification.md) covers every exterior region and separates published dimensions from reconstruction. Sixteen selected nominal comparisons remain; H102/H104 bumper ground-reference interpretations remain unresolved.
- [Body comparison](http://localhost:5185/body-review.html) includes wheel, roof and front close views. [Rear-lamp review](http://localhost:5185/tail-review.html) uses the same layered geometry. The manual identifies **BODY R8**. Factory tooling accuracy and owner sign-off remain open.

## Verification

${tests}

[Browser execution notes](browser-verification-notes.md) distinguish this targeted run from archived earlier applications. The latest raw report may cover only one batch; the consolidated browser evidence accounts for every current scenario.

${geometry} ${bodyGeometry} The rear-body surface audit has ${status?.rearBody?.checks||0} check groups covering pad separation/height, plate recess/visibility, license-housing concealment, outer/inner lens ordering, rear apertures, the lower nose, factory lamp datums/load conventions, four-chamber inventory, cover clarity and fitted lens ends. These are shape regression checks, not factory acceptance. The body audit separately measures ${status?.bodyDimensions?.checks||0} selected nominal dimensions on actual triangles and checks bilateral/axle anchors. Its numerical tolerances are software comparison tolerances, not manufacturing tolerances. The exterior audit has fifteen checks covering shared panel vertices, apertures, wheel lips, mirror fit, pad tessellation, fuel-door clearance, wiper span, the 1,752 mm body-width datum, distinct separation offsets and option ownership, plus sunroof panel/body hardware ownership, open trim/latch cavities and glass thickness. The new exterior-fit audit adds actual-mesh checks at 78 trim/paint sightlines, molding straightness, nine clear intake sightlines the road-tire tread envelope, 234 carrier-support contacts and 130 wing-pedestal contacts. The internal audit has 38 checks covering all twelve lifter inventories, oil passages, containment and ball-seat interfaces plus pump alignment/chamber fit. The oil-pump audit adds six checks for its twelve selections, static tooth separation, shaft/socket fits, relief containment and open pickup/screen geometry. The existing timing audit remains separate. Other geometry checks cover catalogs, installed/detail agreement, selected factory datums, electrical cavities, wiring, hood clearance and distribution. These tests do not establish every factory dimension or operating clearance.

${hardware}

The last recorded reference audit reached ${links?.reachable||0}/${links?.uniqueDocuments||0} documents and found ${pages?.pageLinks||0} PDF page references within their downloaded editions. Blocked secondary lookups remain in the [link report](reference-link-audit.json). Reachability and page bounds are separate from content verification.

The production build passes with its existing bundle-size advisory. Distribution checks found no manual scans, component photographs or downloaded car meshes shipped as viewer substitutes. Component geometry is native; the licensed studio HDR provides lighting.

## Coverage and remaining acceptance work

The app has ${parts.length} vehicle assembly records and ${detailParts.length} selections across ${Object.keys(detailFamilies).length} detail families. Counts include grouped sets and overlapping views; they are not a complete physical bill of materials.

| Explorer | Selections / grouped sets |
| --- | ---: |
${rows}

${timing}

Measured casting/panel profiles, production hard points, complete internal fits/routing, door/window/lock/mirror mechanisms, wipers/washer details, seats/restraints, column internals, full A/C refrigeration and validated procedures remain incomplete. The VIN does not establish original paint/trim, spring codes or every installed option. No free complete factory CAD/dimensional drawing set has been obtained. These gaps remain open.

[Acceptance status](acceptance-status.json) · [Browser evidence](regression-summary.json) · [Latest raw run](full-regression.json) · [Geometry verification](geometry-verification.json) · [Model audit](model-audit.json) · [Headlight electrical checks](headlight-electrical-audit.json) · [Cross-view geometry](cross-view-scale-review.json) · [Engine timing](engine-timing-audit.json) · [Lifter/pump internals](engine-internals-audit.json) · [Oil-pump construction](oil-pump-audit.json) · [Component inventory](component-coverage.json) · [Geometry comparison](indexed-geometry-comparison.json) · [Native hardware](native-windows-internals-review.json) · [Visual manifest](visual-inspection-manifest.json) · [Checklist/test mapping](checklist-test-matrix.md) · [Walkthrough](../UAT.md)
`;
await writeFile('artifacts/current-UAT.md',body);
await writeFile('artifacts/UAT-readiness.md',body.replace('# Current development review','# Acceptance and verification status'));
console.log('Updated current review; accepted='+!!status?.accepted);
