import {test,expect} from '@playwright/test';
import {detailMembers,detailPartById} from '../src/inspection-catalog.js';

test('twenty-step coolant guide crosses engine and radiator scopes, preserves cap order and returns safely',async({page})=>{
 test.setTimeout(540000);page.setDefaultTimeout(60000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true');
 await page.getByRole('searchbox').fill('radiator');await page.locator('.part-button[data-part="radiator"]').click();
 await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();
 const before=await page.evaluate(()=>window.__fiero.getState());
 await page.locator('[data-tab="tours"]').click();await page.locator('[data-tour="coolant-replacement"]').click();
 await expect(page.locator('.tour-progress button')).toHaveCount(20);
 await expect(page.locator('#inspector-content')).toContainText('3/16-inch');
 await expect(page.locator('#inspector-content')).toContainText('Let the engine and radiator cool');
 const expectedParts=['eng-thermostat-housing','eng-thermostat-cap','eng-thermostat-cap','eng-thermostat-element','eng-thermostat-cap','cool-drain','eng-thermostat-housing','cool-pipe-drains','cool-pressure-cap','eng-thermostat-cap','cool-rear-inlet','cool-pipe-drains','cool-recovery-tank','eng-thermostat-housing','eng-thermostat-cap','cool-recovery-tank','eng-thermostat-housing','eng-thermostat-housing','eng-thermostat-element','cool-recovery-tank'];
 for(let i=0;i<20;i++){
  await expect(page.locator('.tour-progress .current')).toHaveText(String(i+1));
  await expect(page.locator('canvas')).toHaveAttribute('data-selected',expectedParts[i]);
  const state=await page.evaluate(()=>window.__fiero.getState());
  expect(detailMembers(state.assembly).some(p=>p.id===expectedParts[i])).toBe(true);
  expect(state.configuration.headlights).toBe(before.configuration.headlights);
  expect(detailPartById.has(expectedParts[i])).toBe(true);
  await expect(page.locator('#inspector-content a')).toHaveAttribute('href',new RegExp('#page='+(i<4?47:i<11?48:49)+'$'));
  if(i===3)await expect(page.locator('.step-description')).toContainText('reinstall it at step 19');
  if(i===8){
   await page.getByRole('button',{name:'Inspect this part',exact:true}).click();
   expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['cool-pressure-cap']);
   await page.screenshot({path:'artifacts/coolant-guide-pressure-cap.png'});
   await page.getByRole('button',{name:'Show assembly',exact:true}).click();
  }
  if(i===11){await expect(page.locator('.step-description')).toContainText('12 N·m');await expect(page.locator('.step-description')).toContainText('does not apply');}
  if(i===12)await expect(page.locator('.step-description')).toContainText('soap and water');
  if(i===13){await expect(page.locator('.step-description')).toContainText('50%');await expect(page.locator('.step-description')).toContainText('70%');}
  if(i===15)await expect(page.locator('.step-description')).toContainText('3 liters');
  if(i===16){await expect(page.locator('.step-description')).toContainText('3 minutes');await expect(page.locator('.step-description')).toContainText('15–20 seconds');}
  if(i===17)await expect(page.locator('.step-description')).toContainText('cool before opening');
  if(i===18){
   await page.setViewportSize({width:390,height:700});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.locator('canvas').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/coolant-guide-mobile-thermostat.png',fullPage:true});
  }
  await page.locator('[data-action="next-step"]').click();
 }
 const after=await page.evaluate(()=>window.__fiero.getState());
 for(const key of ['assembly','assemblyExplode','selected','system','query','isolate'])expect(after[key]).toEqual(before[key]);
 expect(after.configuration).toEqual(before.configuration);
 // Direct navigation, going back and cancelling must restore the same context.
 await page.locator('[data-tour="coolant-replacement"]').click();
 await page.locator('.tour-progress [data-step="12"]').click();await expect(page.locator('canvas')).toHaveAttribute('data-selected','cool-recovery-tank');
 await page.locator('[data-action="prev-step"]').click();await expect(page.locator('canvas')).toHaveAttribute('data-selected','cool-pipe-drains');
 await page.locator('[data-action="exit-tour"]').click();await expect(page.locator('canvas')).toHaveAttribute('data-assembly',before.assembly);
 expect(errors).toEqual([]);
});
