import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceGuides,batteryReplacement,sparkPlugReplacement,airFilterReplacement,manualFluidReplacement} from '../src/service-guides.js';
import {parts} from '../src/data.js';
import {detailParts,detailSectionById,inDetailSection} from '../src/inspection-catalog.js';

test('every service step names an existing part in its actual selectable scope',()=>{
 const byId=new Map([...parts,...detailParts].map(p=>[p.id,p]));
 assert.equal(new Set(serviceGuides.map(g=>g.id)).size,serviceGuides.length);
 for(const guide of serviceGuides){
  assert.ok(guide.tools&&guide.caution&&guide.applicability&&guide.prerequisites,guide.id);
  assert.equal(guide.validation.sourceChecked,true);
  assert.equal(guide.validation.workshopValidated,false);
  for(const step of guide.steps){
   const part=byId.get(step.part);assert.ok(part,`${guide.id}: ${step.part}`);
   const scope=step.assembly??guide.assembly;
   if(scope){assert.ok(detailSectionById.has(scope),scope);assert.ok(inDetailSection(part,scope),`${part.id} not in ${scope}`);}
   assert.ok(Number.isInteger(step.page)&&step.page>=1&&step.page<=66,`${guide.id}: PDF page`);
   assert.equal(new URL(step.sourceUrl).hash,`#page=${step.page}`);
  }
 }
});

test('battery disconnect and reconnect keep the factory polarity sequence',()=>{
 const titleOrder=batteryReplacement.steps.map(s=>s.title);
 assert.ok(titleOrder.indexOf('Disconnect negative first')<titleOrder.indexOf('Disconnect positive'));
 assert.ok(titleOrder.indexOf('Reconnect positive first')<titleOrder.indexOf('Reconnect negative and close access'));
 const positive=batteryReplacement.steps.find(s=>s.title==='Reconnect positive first');
 assert.match(positive.text,/12 N·m/);assert.equal(positive.page,40);
});

test('V6 and four-speed guides retain engine-specific values and exclude the L4 separator',()=>{
 assert.match(sparkPlugReplacement.steps.find(s=>s.title==='Set the V6 gap').text,/1\.1 mm \(0\.045 inch\)/);
 assert.match(sparkPlugReplacement.steps.find(s=>s.title==='Start by hand, then torque').text,/15 N·m/);
 assert.match(airFilterReplacement.caution,/four-cylinder engine, not this V6/);
 assert.match(manualFluidReplacement.steps.find(s=>s.title==='Refill the four-speed').text,/2\.8 liters \(5\.9 US pints\)/);
 assert.match(manualFluidReplacement.steps.find(s=>s.title==='Check the physical level marks').text,/engine off/);
});
