import { test, expect } from '@playwright/test';

test('preview choices change geometry, persist, and leave the VIN record intact',async({page})=>{
 // Physical-material shader compilation, captures and a full reload run on
 // software WebGL in CI; keep time for the persistence assertions afterwards.
 test.setTimeout(540000);
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const closed=await page.evaluate(()=>window.__fiero.getPartBounds('headlights'));
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 await page.locator('[data-config="headlights"]').check();
 const raised=await page.evaluate(()=>window.__fiero.getPartBounds('headlights'));
 expect(raised.max[1]-closed.max[1]).toBeGreaterThan(.12);
 // Prevent the previous overly tall pod from returning. This is a visual
 // reconstruction regression bound, not a claimed factory measurement.
 expect(raised.max[1]).toBeLessThan(.89);
 const plainDeck=await page.evaluate(()=>window.__fiero.getPartBounds('decklid'));
 await page.locator('#config-deck').selectOption('wing');
 const wingDeck=await page.evaluate(()=>window.__fiero.getPartBounds('decklid'));
 expect(wingDeck.max[1]-plainDeck.max[1]).toBeGreaterThan(.075);
 expect(wingDeck.max[1]).toBeLessThan((await page.evaluate(()=>window.__fiero.getPartBounds('roof'))).max[1]-.15);
 await page.locator('#config-roof').selectOption('glass');
 const glazed=await page.evaluate(()=>window.__fiero.getModelStats().triangles);
 await page.locator('#config-roof').selectOption('removed');
 expect(await page.evaluate(()=>window.__fiero.getModelStats().triangles)).toBeLessThan(glazed);
 const before=await page.evaluate(()=>window.__fiero.getModelStats().triangles);
 await page.locator('#config-airConditioning').check();
 expect(await page.evaluate(()=>window.__fiero.getModelStats().triangles)).toBeGreaterThan(before);
 await page.getByRole('button',{name:'White paint',exact:true}).click();
 await page.locator('[data-config="studio"]').selectOption('dark');
 await expect(page.locator('.stage')).toHaveAttribute('data-studio','dark');
 await page.screenshot({path:'artifacts/configuration-preview.png'});
 await page.reload();await page.waitForFunction(()=>window.__fiero);
 await page.locator('[data-tab="config"]').click();
 await expect(page.getByRole('button',{name:'White paint',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#config-deck')).toHaveValue('wing');
 await expect(page.locator('#config-airConditioning')).toBeChecked();
 await expect(page.locator('[data-config="headlights"]')).toBeChecked();
 await page.locator('[data-tab="specs"]').click();
 await expect(page.locator('#inspector-content')).toContainText('Original 4-speed manual');
 await expect(page.locator('#inspector-content')).toContainText('WS6');
 await expect(page.locator('body')).toContainText('1G2PF3796FP217611');
 await page.locator('[data-tab="config"]').click();
 await page.getByRole('button',{name:'Reset preview choices',exact:true}).click();
 await expect(page.getByRole('button',{name:'Red paint',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#config-deck')).toHaveValue('clean');
 await expect(page.locator('[data-config="headlights"]')).not.toBeChecked();
 const plenum=await page.evaluate(()=>window.__fiero.getPartBounds('intake'));
 expect(plenum.max[1]).toBeLessThan(.78);
 const gearbox=await page.evaluate(()=>window.__fiero.getPartBounds('gearbox'));
 expect(gearbox.max[0]).toBeLessThan(-.15);
});

test('invalid saved preview values recover to supported choices',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('fiero-configuration-v2',JSON.stringify({paint:'invalid',roof:'unknown',headlights:'yes',vin:'invalid',studio:'invalid'})));
 await page.goto('/');await page.waitForFunction(()=>window.__fiero);
 await page.locator('[data-tab="config"]').click();
 await expect(page.getByRole('button',{name:'Red paint',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#config-roof')).toHaveValue('solid');
 await expect(page.locator('[data-config="headlights"]')).not.toBeChecked();
 await expect(page.locator('.stage')).toHaveAttribute('data-studio','light');
});
