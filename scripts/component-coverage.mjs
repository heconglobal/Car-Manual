import {writeFile} from 'node:fs/promises';
import {detailFamilies,detailMembers,detailParts,detailSectionById} from '../src/inspection-catalog.js';
import {remainingWork} from '../src/remaining-work.js';
import {parts} from '../src/data.js';
import {sourceFingerprint} from './source-fingerprint.mjs';
// Each family can participate in several requirements. This is an index of
// authored selections, never a claim that missing physical parts do not exist.
const areas={'headlight-system':[1],'lighting-system':[2],'charging-system':[3],'wiring-system':[4],engine:[5,6,13],transmission:[7],'braking-system':[8,9],'suspension-system':[9],'fuel-system':[11],'exhaust-system':[12],'cooling-system':[13],'hvac-system':[14],'body-system':[15,17]};
const requirements=remainingWork.flatMap((a,i)=>a.items.map((text,j)=>({id:`${String(i+1).padStart(2,'0')}.${j+1}`,area:a.name,text})));
const path=id=>{const out=[],seen=new Set();while(id){if(seen.has(id))throw Error('Cyclic section '+id);seen.add(id);const s=detailSectionById.get(id);out.unshift(s?.name||id);id=s?.parent;}return out.join(' → ');};
const inventory=Object.values(detailFamilies).map(f=>({id:f.id,name:f.name,checklistAreas:areas[f.id]||[],parts:detailMembers(f.id).map(p=>({id:p.id,name:p.name,section:p.section,scope:path(p.section),source:p.source||null,sourceUrl:p.sourceUrl||null,callout:p.callout??null,option:p.option||null,value:p.value??null,qualification:p.referenceNote||null}))}));
const report={generatedAt:new Date().toISOString(),sourceSha256:sourceFingerprint(),vehicleRecords:parts.length,detailSelections:detailParts.length,requirements:requirements.length,limits:'Selection inventory only. Grouped fasteners and service units may contain multiple physical pieces; overlapping vehicle/detail views are not additional parts. Source links and callouts identify references, not verified dimensions. Final completeness requires item 20.6: a drawing-by-drawing reconciliation of applicable GM callouts and service internals. All 20 areas retain unfinished requirements.',families:inventory,checklist:requirements};
await writeFile('artifacts/component-coverage.json',JSON.stringify(report,null,2)+'\n');
const clean=s=>String(s??'—').replaceAll('|','\\|').replaceAll('\n',' ');
let md='# Selectable component inventory and completeness review\n\n'+report.limits+'\n\n'+`**${parts.length} vehicle records, ${detailParts.length} detail selections, ${requirements.length} requirements across ${remainingWork.length} areas.** [Acceptance checklist](REMAINING-WORK.md) · [Machine-readable inventory](artifacts/component-coverage.json)\n\n`;
md+='## Areas without a dedicated complete explorer\n\nWheels/spare/tools (10), wipers/washer/defroster (16), seats/restraints/trim (18), options/interchange (19) and procedures/acceptance (20) currently span other views or have substantial missing detail. An empty dedicated-family mapping is not an accepted area.\n';
for(const f of inventory){md+=`\n## ${f.name} — ${f.parts.length} selections\n\nRelated checklist areas: ${f.checklistAreas.join(', ')}.\n\n| Part ID | Selection | Scope | Reference / callout |\n| --- | --- | --- | --- |\n`;for(const p of f.parts)md+=`| ${clean(p.id)} | ${clean(p.name)} | ${clean(p.scope)} | ${clean(p.source)}${p.callout!==null?' / '+p.callout:''} |\n`;}
await writeFile('COMPONENT-COVERAGE.md',md);console.log('Indexed '+detailParts.length+' selections; no requirements automatically accepted.');
