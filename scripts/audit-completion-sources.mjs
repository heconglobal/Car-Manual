import {readFile,writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import {parts,sources} from '../src/data.js';
import {detailParts,detailFamilies} from '../src/inspection-catalog.js';
import {serviceGuides} from '../src/service-guides.js';
import {preserveFiles} from './preserve-files.mjs';
import {sourceFingerprint} from './source-fingerprint.mjs';

const outputs=['references/completion-source-audit.json','references/completion-selection-evidence.csv','references/completion-service-evidence.json'];
await preserveFiles(outputs,'before-completion-source-audit');
const mappings=[
 ['1985_Fiero_Do_It_Yourself.pdf','1985-fiero-diy.pdf','original-1985'],
 ['1985+Fiero+Owners+Manual.pdf','1985-owners-boomtastic.pdf','original-1985'],
 ['1985_Fiero_Owners_Manual.pdf','1985-owners.pdf','unusable-download'],
 ['1985_Fiero_6E3_Emissions_and_Drivability.pdf','1985-fiero-6e3.pdf','original-1985-L44-section'],
 ['Illustrations_CD.pdf','fiero-parts-cd.pdf','factory-multi-year-catalog'],
 ['Illustrations_P22.pdf','fiero-22p-parts.pdf','factory-multi-year-catalog'],
 ['1986_Fiero_Service_Manual.pdf','1986-service.pdf','adjacent-year-1986'],
 ['1985-86+Pontiac+Fiero.PDF','1985-86-specifications.pdf','original-factory-specifications'],
 ['1985-Pontiac-Fiero-Cdn.pdf','1985-fiero-brochure.pdf','original-1985-Canadian-brochure'],
 ['Chevrolet_60V6_Power_Manual.pdf','chevrolet-60v6-power.pdf','GM-related-engine-reference'],
];
const documents=JSON.parse((await promisify(execFile)('python3',['-c',`import fitz,json,sys,hashlib,pathlib
out={}
for name in json.loads(sys.argv[1]):
 p=pathlib.Path('references')/name
 try:
  with fitz.open(p) as doc:
   out[name]={'pages':len(doc),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'usable':len(doc)>0}
 except Exception as e:out[name]={'usable':False,'error':str(e)}
print(json.dumps(out))`,JSON.stringify([...new Set(mappings.map(m=>m[1]))])],{encoding:'utf8'})).stdout);
const sourceSha256=sourceFingerprint();
const match=url=>mappings.find(([key])=>url?.includes(key));
const knownLimits={
 'headlight-system':'Original actuator gear/contact variants, measured pivots/stops, original connector faces and aiming/service evidence remain separate checks.',
 'lighting-system':'Lamp optical tooling, harness terminal details, local dimensions and actual option content remain unverified.',
 'charging-system':'Original battery/alternator/starter identity and ratings require installed labels; internal winding and local casting detail are reconstructed.',
 'wiring-system':'VIN does not identify ECM calibration, all harness terminals or installed equipment. Several supporting location views are explicitly adjacent-year.',
 engine:'Original casting/part variants, dimensional tolerances, all passages, complete fastener quantities and accessory internals remain unverified. Published nominal values do not establish full measured geometry.',
 transmission:'Owner reports four-speed. Installed gearbox code, speedometer gear variant, shift cable geometry, shim thicknesses and bearing fits require further evidence.',
 'braking-system':'Original casting identities, complete hose travel, piston internals, hydraulic calibration and torque/service sequences require separate verification.',
 'suspension-system':'Owner reports WS6. Actual spring tags/rates, bushing stiffness, measured pivots and full-travel interference remain unverified.',
 'fuel-system':'Original pump/sender calibration, dimensions, tank internals and exact tube/hose routing require further evidence.',
 'exhaust-system':'SE black versus selected bright tailpipe appearance is explicit. Original exhaust measurements, catalyst/muffler internals and full hot-movement clearance remain unverified.',
 'cooling-system':'Original fan/cap/hose variants, measured pipe bends and complete fluid-path validation require physical checks.',
 'hvac-system':'C41/C60 variants must follow the actual vehicle equipment. Original compressor identity, refrigerant system routing/charge and internals remain unresolved.',
 'body-system':'Tooling surfaces, fastener inventory, seals, hidden mechanisms and original trim options require further evidence and owner appearance approval.',
 'interior-system':'Original trim/RPO codes, upholstery patterns, hidden mechanisms and full hardware count are unresolved; appearance approval remains owner-held.',
 'wiper-system':'Standard/pulse application is a source-backed preview. Actual installed equipment, connector/pump variants and measured linkage travel remain unverified.',
 'spare-system':'Actual compact-spare label, wheel/retainer/jack condition and dimensional fit must be checked on the vehicle.',
};
const selections=detailParts.map(p=>{
 const mapping=match(p.sourceUrl),page=Number(p.sourceUrl?.match(/#page=(\d+)/)?.[1])||null;
 return {id:p.id,family:p.family,section:p.section,name:p.name,source:p.source||null,sourceUrl:p.sourceUrl||null,document:mapping?.[1]||null,pdfPage:page,
  sourceClass:mapping?.[2]||(p.sourceUrl?'unclassified-reference':'source-label-only'),
  callout:p.callout??null,calloutNamespace:'Only the explicitly cited source drawing; page alone may contain multiple figures.',
  groupedSelection:/\b(set|pair|assembly|assemblies|kit|bolts|screws|nuts|washers|grommets|bearings|seals|keys|springs|contacts|terminals)\b/i.test(p.name),
  physicalQuantity:null,geometryEvidence:'reconstructed; selected published nominal values may apply',
  actualVehicleVariant:'not established by this catalog entry',option:p.option||null,optionValue:p.value??p.values??null,
  evidenceQualification:p.referenceNote||p.description||null};
});
const links=[];
function collect(value,owner){
 if(typeof value==='string'&&/^https?:\/\//.test(value)){
  const mapping=match(value),page=Number(value.match(/#page=(\d+)/)?.[1])||null;
  if(mapping&&page)links.push({owner,url:value,document:mapping[1],page,valid:documents[mapping[1]].usable&&page<=documents[mapping[1]].pages});
 }else if(Array.isArray(value))value.forEach(v=>collect(v,owner));
 else if(value&&typeof value==='object')Object.values(value).forEach(v=>collect(v,owner));
}
for(const p of [...parts,...detailParts,...sources,...serviceGuides])collect(p,p.id);
const register=JSON.parse(await readFile('references/completion-callout-register.json','utf8'));
const modelIds=new Set(detailParts.map(p=>p.id));
const figureChecks=register.figures.map(f=>({
 id:f.id,title:f.title,sourceUrl:f.sourceUrl,application:f.application,reviewedCallouts:f.callouts.length,
 rows:f.callouts.map(([callout,name,ids,qualification])=>({callout,name,modelIds:ids,allModelIdsExist:ids.every(id=>modelIds.has(id)),qualification,physicalQuantity:null})),
}));
const missingIds=figureChecks.flatMap(f=>f.rows.filter(r=>!r.allModelIdsExist).map(r=>({figure:f.id,...r})));
const invalidLinks=links.filter(l=>!l.valid);
const report={generatedAt:new Date().toISOString(),sourceSha256,status:missingIds.length||invalidLinks.length?'failed':'passed',
 meaning:'Passed means the indexed part IDs and locally mapped PDF page bounds are consistent. It does not accept unresolved source, geometry, original-equipment, workshop or owner-review requirements.',
 documents,vehicleRecords:parts.length,detailedSelections:selections.length,linkedPageChecks:links.length,invalidLinks,missingIds,
 families:Object.values(detailFamilies).map(f=>{
  const rows=selections.filter(p=>p.family===f.id);
  const byClass={};for(const r of rows)byClass[r.sourceClass]=(byClass[r.sourceClass]||0)+1;
  return {id:f.id,name:f.name,selections:rows.length,withCallout:rows.filter(r=>r.callout!==null).length,withoutCallout:rows.filter(r=>r.callout===null).map(r=>r.id),withoutSourceUrl:rows.filter(r=>!r.sourceUrl).map(r=>r.id),groupedSelectionCandidates:rows.filter(r=>r.groupedSelection).map(r=>r.id),sourceClasses:byClass,remaining:knownLimits[f.id]||f.coverage,coverageDescription:f.coverage};
 }),reviewedFigures:figureChecks,
 acquisition:{full1985ServiceManual:{identifier:'S-8510P',status:'not-acquired',publisherUrl:'https://www.detroitironis.com/1985-pontiac-fiero-service-manual-print.html',publisherPageCount:1146,note:'Publisher identifies the chassis/body factory reprint. No validated free complete primary PDF located in this research pass. A purchase listing is not source-content verification.'},
  originalOptions:{status:'owner/vehicle-evidence-required',known:'VIN identity and owner-reported four-speed/WS6 profile are recorded in src/data.js.',needed:['Service Parts Identification label / RPO codes','Paint and trim codes','Spring tags','Installed gearbox ID and speedometer gears','Starter/alternator/distributor/ECM labels','Compressor and fan identification if equipped']},
  corruptDownload:{file:'references/1985-owners.pdf',status:documents['1985-owners.pdf'].usable?'inspect-edition':'zero-page-unusable-preserved',preferredFile:'references/1985-owners-boomtastic.pdf',note:'Do not replace the archive silently. Existing ownersSource already links the usable 107-page Boomtastic edition; PDF page numbers refer to that edition.'},
  secondaryLead:{url:'https://charm.li/Pontiac/1985/Fiero%20V6-173%202.8L/',status:'research-lead-only',note:'Compiled repair tree includes generic/other-application entries and later bulletins. Each primary GM diagram and application must be verified individually; the tree is not accepted as the complete original S8510P.'}},
 limits:register.scope,
};
const reviewedDIY=[2,3,4,9,10,11,12,15,16,17,19,21,22,23,24,25,26,27,30,31,32,39,40,41,42,53,54,55,57,59,60,61];
const evidencePages=[];
for(const page of reviewedDIY){
 const path=`references/service-source-review-20261001/diy-pdf-${String(page).padStart(2,'0')}.png`;
 evidencePages.push({page,path,sha256:createHash('sha256').update(await readFile(path)).digest('hex'),reviewed:true});
}
const serviceEvidence={generatedAt:report.generatedAt,sourceSha256,primaryDocument:{file:'references/1985-fiero-diy.pdf',...documents['1985-fiero-diy.pdf']},reviewedPages:evidencePages,
 guides:serviceGuides.map(g=>({id:g.id,title:g.title,stepCount:g.steps.length,source:g.source,sourceUrl:g.sourceUrl,applicability:g.applicability,validation:g.validation,
  references:g.steps.map((s,i)=>({step:i+1,part:s.part,assembly:s.assembly??g.assembly??null,pdfPage:s.page,url:s.sourceUrl})),
  physicalLimits:g.caution})),
 note:'The new source review adds eleven procedures to the two previously checked guides. Pages 37–38 and 47–49 supporting the existing guides were reviewed in earlier project records, not re-claimed as newly opened here. Final inspection checks that extend the factory sequence are editorial completion checks. No physical workshop validation is claimed.'};
const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const fields=['id','family','section','name','source','sourceUrl','document','pdfPage','sourceClass','callout','groupedSelection','physicalQuantity','geometryEvidence','actualVehicleVariant','option','optionValue','evidenceQualification'];
await writeFile(outputs[0],JSON.stringify(report,null,2)+'\n');
await writeFile(outputs[1],fields.map(quote).join(',')+'\n'+selections.map(p=>fields.map(k=>quote(Array.isArray(p[k])?p[k].join(';'):p[k])).join(',')).join('\n')+'\n');
await writeFile(outputs[2],JSON.stringify(serviceEvidence,null,2)+'\n');
console.log(JSON.stringify({status:report.status,families:report.families.length,selections:selections.length,sourcePageChecks:links.length,figures:figureChecks.map(f=>({id:f.id,callouts:f.reviewedCallouts,withoutIndependentSelection:f.rows.filter(r=>!r.modelIds.length).length})),invalidLinks,missingIds,serviceGuides:serviceGuides.length,serviceSteps:serviceGuides.reduce((n,g)=>n+g.steps.length,0),fullFactoryManualAcquired:false}));
if(report.status==='failed')process.exitCode=1;
