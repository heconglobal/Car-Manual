import {readFile,writeFile} from 'node:fs/promises';
import {remainingWork} from '../src/remaining-work.js';
import {sourceFingerprint} from './source-fingerprint.mjs';

// These links describe the coverage of each test, not acceptance of every
// requirement in the associated area. No test result closes a checklist item.
const coverage=[
 ['headlights.spec.js','service-guides.spec.js','configuration.spec.js'],
 ['electrical.spec.js'],
 ['electrical.spec.js'],
 ['electrical.spec.js'],
 ['ignition.spec.js'],
 ['engine.spec.js','engine-service.spec.js','valve-gear.spec.js'],
 ['transmission-cooling.spec.js'],
 ['brakes.spec.js'],
 ['suspension.spec.js'],
 ['configuration.spec.js'],
 ['fuel.spec.js'],
 ['exhaust.spec.js'],
 ['transmission-cooling.spec.js','engine-service.spec.js'],
 ['hvac.spec.js'],
 ['body-hardware.spec.js','configuration.spec.js'],
 [],
 ['body-hardware.spec.js','rear-body.spec.js','configuration.spec.js'],
 ['transmission-cooling.spec.js','configuration.spec.js'],
 ['configuration.spec.js','hvac.spec.js'],
 ['workshop.spec.js','service-guides.spec.js'],
];
const limits=[
 'Selection, nested explosion, cover pose, mobile controls and the headlamp guide are covered. Exact motor internals, production hard points, operating stops, optics and complete circuits are not.',
 'Lamp selection, option visibility and assembled/exploded presentation are covered. Original optical tooling and complete working circuits are not.',
 'Battery/starter/alternator selection and breakdown are covered. Original casting dimensions, exact drive teeth, full cables and live electrical operation are not.',
 'Fuse/ECM/cluster selection, the EST terminal table and mobile navigation are covered. Complete harness topology and pin-by-pin circuit operation are not.',
 'Module, coil, distributor and ignition-part selection/explosion are covered. Exact variant geometry and every wire route remain unverified.',
 'Engine navigation, internals, selected service parts and valve-gear presentation are covered. Complete internal fits, measured castings and operating kinematics are not; the known cam/crank datum discrepancy remains open.',
 'Gear/shaft/differential/clutch selection and return navigation are covered. Case contours, every tooth profile, synchronizer engagement and hydraulic mechanisms are not.',
 'Front/rear caliper, rotor, master-cylinder and parking-brake breakdown/navigation are covered. Full hydraulic behavior, calibrated valve internals, measured castings and swept hose clearances are not.',
 'Early front/rear suspension and manual rack selection/explosion are covered. WS6 rates, measured mounting points, full articulation and column mechanisms are not.',
 'The wheel preview control is covered. This is not a tire/wheel dimensional test or an inspection of jack/spare/tool internals.',
 'Tank/sender/pump/filter/canister selection and explosion are covered. Tank baffles, sender calibration, pressure/flow, exact routing and full service procedures are not.',
 'Complete exhaust and crossover/manifold selection and explosion are covered. Exact production bends, internal baffles and installed thermal clearance are not.',
 'Circuit/pipe/radiator/fan selection and engine cooling-part access are covered. Fan/pump internals, complete factory fill/bleed guide and every clearance are not.',
 'C41/C60 preview switching, applicable part visibility and selection are covered. Calibrated door travel, complete control circuits and the refrigeration system are not.',
 'Door skin/glass/trim/hinge selection and option previews are covered. Missing regulator, latch, lock and mirror internals are not tested.',
 'There is no dedicated wiper/washer/defroster detail or mechanism regression. Whole-car rendering does not substitute for it.',
 'Panel/hinge/vent/torque-rod selection, body configuration and rear geometry presentation are covered. Measured panel sections, all hidden structure, gaps and full hinge travel are not.',
 'Driver-control handedness and cabin preview visibility are covered. Seat/retractor/recliner/column/pedal internal mechanisms are not.',
 'Preview changes, persistence, invalid saved values and some option-specific visibility are covered. This does not establish the original build sheet or compatibility of every swap.',
 'General search, selection, camera, visibility, guides, source links, feedback export and mobile presentation are covered. Full physical fidelity, complete procedures and broad device performance remain open.',
];
if(coverage.length!==remainingWork.length||limits.length!==remainingWork.length)throw new Error('Coverage map must include every checklist area');
const status=JSON.parse(await readFile('artifacts/acceptance-status.json','utf8'));
const current=sourceFingerprint();
if(status.sourceSha256!==current)throw new Error('Refresh acceptance-status before writing the coverage matrix');
const rows=remainingWork.map((area,index)=>{
 const files=coverage[index];
 const outcomes=status.browser.outcomes.filter(o=>files.includes(o.file));
 for(const file of files)if(!outcomes.some(o=>o.file===file))throw new Error('Missing scenario inventory: '+file);
 return {area:index+1,name:area.name,requirements:status.items.filter(i=>i.area===area.name),testFiles:files,scenarios:outcomes.map(o=>({title:o.title,file:o.file,passed:o.passed,report:o.report})),coverageAndLimits:limits[index]};
});
const report={generatedAt:new Date().toISOString(),sourceSha256:current,accepted:status.accepted,requirements:status.requirements,complete:status.complete,partial:status.partial,open:status.open,browserPassed:status.browser.passed,note:'Test scenarios overlap areas. Counts must not be summed as unique tests. Passing browser tests do not establish factory dimensions, physical operation, complete part coverage or owner acceptance.',areas:rows};
await writeFile('artifacts/checklist-test-matrix.json',JSON.stringify(report,null,2)+'\n');
const text=['# Checklist and test coverage',
 `Generated ${report.generatedAt}. Source \`${current}\`.`,
 `**${status.complete}/${status.requirements} requirements accepted; ${status.partial} partial and ${status.open} open.** Current browser regression: ${status.browser.passedTests}/${status.browser.requiredTests} passing scenarios.`,
 report.note,
 ...rows.flatMap(row=>[
  `## ${row.area}. ${row.name}`,
  row.coverageAndLimits,
  row.testFiles.length?`Related test files: ${row.testFiles.map(f=>`[${f}](../tests/${f})`).join(', ')}. ${row.scenarios.filter(s=>s.passed).length}/${row.scenarios.length} associated scenarios currently pass.`:'No dedicated browser scenario exists for this area.',
  '| Requirement | Status | Remaining acceptance work |\n| --- | --- | --- |\n'+row.requirements.map(r=>`| ${r.id} | ${r.status} | ${r.remaining.replaceAll('|','\\|')} |`).join('\n'),
 ]),
 '[Original requirements](../REMAINING-WORK.md) · [Acceptance evidence](../references/acceptance-evidence.json) · [Current verification report](current-UAT.md)',
].join('\n\n')+'\n';
await writeFile('artifacts/checklist-test-matrix.md',text);
console.log('Mapped all '+rows.length+' areas / '+status.requirements+' requirements without changing their acceptance states.');
