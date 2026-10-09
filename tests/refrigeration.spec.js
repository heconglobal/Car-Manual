import {waitForViewer,evaluateViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
import {refrigerationParts} from '../src/hvac-refrigeration-catalog.js';
test('C60 refrigeration exposes compressor, condenser and separate pipe branches and recovers when disabled',async({page})=>{
 test.setTimeout(480000);page.setDefaultTimeout(60000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/',{timeout:240000});await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('#config-airConditioning').check();
 await page.getByRole('searchbox').fill('L44 compressor pivot');await page.locator('.part-button[data-part="hv-ac-compressor-pivot"]').click();
 await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','hvac-compressor');
 await expect(page.locator('#inspector-content a').first()).toHaveAttribute('href',/#page=269$/);
 await page.locator('#systems [data-assembly="hvac-refrigeration"]').click();
 const visible=await evaluateViewer(page,()=>window.__fiero.getVisibleParts());expect(visible.sort()).toEqual(refrigerationParts.map(p=>p.id).sort());
 for(const id of ['hv-ac-compressor-clutch','hv-ac-condenser-tubes','hv-ac-underbody-tubes','hv-ac-front-liquid-tube']){
  await page.locator(`.part-button[data-part="${id}"]`).click();await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-selected',id);
  expect(await evaluateViewer(page,id=>window.__fiero.getPartBounds(id),id)).not.toBeNull();
 }
 await waitForViewer(page);await page.screenshot({path:'artifacts/refrigeration-full-circuit.png'});
 await page.locator('#systems [data-assembly="hvac-compressor"]').click();
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await waitForViewer(page);await page.screenshot({path:'artifacts/refrigeration-compressor-exploded.png'});
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('#config-airConditioning').uncheck();
 await page.locator('[data-tab="component"]').click();await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','hvac-system');
 expect(await evaluateViewer(page,()=>window.__fiero.getVisibleParts())).not.toContain('hv-ac-compressor-body');
 expect((await evaluateViewer(page,()=>window.__fiero.getVisibleParts())).length).toBeGreaterThan(10);expect(errors).toEqual([]);
});
