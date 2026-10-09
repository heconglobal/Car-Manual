import {waitForViewer,evaluateViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
import {additionalServiceGuides} from '../src/service-guides.js';

const groups=[
 ['engine maintenance',['engine-oil-check','engine-oil-replacement','air-filter-replacement','spark-plug-replacement']],
 ['fluid checks and replacement',['manual-fluid-check','manual-fluid-replacement','brake-fluid-check','clutch-fluid-check']],
 ['battery and wipers',['battery-replacement','wiper-blade-replacement','wiper-refill-replacement']],
];
for(const [label,ids] of groups)test(`1985 ${label} guides highlight every part and restore the prior view`,async({page})=>{
 test.setTimeout(480000);page.setDefaultTimeout(60000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/',{timeout:240000});
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});
 await page.getByRole('searchbox').fill('radiator');
 await page.locator('.part-button[data-part="radiator"]').click();
 const before=await evaluateViewer(page,()=>window.__fiero.getState());
 await page.locator('[data-tab="tours"]').click();
 for(const id of ids){
  const guide=additionalServiceGuides.find(g=>g.id===id);
  await page.locator(`[data-tour="${id}"]`).click();
  await expect(page.locator('#inspector-content h2')).toHaveText(guide.title);
  for(let i=0;i<guide.steps.length;i++){
   const step=guide.steps[i];
   await expect(page.locator('.step-title')).toHaveText(step.title);
   await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-selected',step.part);
   await expect(page.locator('#inspector-content a')).toHaveAttribute('href',step.sourceUrl);
   const actual=await evaluateViewer(page,part=>({scope:window.__fiero.getState().assembly||null,bounds:window.__fiero.getPartBounds(part),visible:window.__fiero.getVisibleParts()}),step.part);
   expect(actual.scope).toBe(step.assembly||guide.assembly||null);
   expect(actual.bounds,`${id} step ${i+1} geometry`).not.toBeNull();
   expect(actual.visible,`${id} step ${i+1} visibility`).toContain(step.part);
   if(i===0){
    await page.getByRole('button',{name:'Inspect this part',exact:true}).click();
    expect(await evaluateViewer(page,()=>window.__fiero.getVisibleParts())).toEqual([step.part]);
    await page.getByRole('button',{name:'Show assembly',exact:true}).click();
   }
   await page.locator('[data-action="next-step"]').click();
  }
  const after=await evaluateViewer(page,()=>window.__fiero.getState());
  for(const key of ['assembly','selected','query','explode','isolate'])expect(after[key]).toEqual(before[key]);
  expect(after.configuration).toEqual(before.configuration);
 }
 expect(errors).toEqual([]);
});
