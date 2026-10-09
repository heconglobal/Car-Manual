import {waitForViewer,evaluateViewer} from './viewer-ready.js';
import { test, expect } from '@playwright/test';

test('preview choices change geometry, persist, and leave the VIN record intact',async({page})=>{
 // Physical-material shader compilation, captures and a full reload run on
 // software WebGL in CI; keep time for the persistence assertions afterwards.
 test.setTimeout(540000);
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const closed=await evaluateViewer(page,()=>window.__fiero.getPartBounds('headlights'));
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 await page.locator('[data-config="headlights"]').check();
 const raised=await evaluateViewer(page,()=>window.__fiero.getPartBounds('headlights'));
 expect(raised.max[1]-closed.max[1]).toBeGreaterThan(.08);
 // The rigid cover's reconstructed 0.62-radian stop clears the raised bucket.
 // Match its current authored endpoint and envelope, not a factory dimension.
 expect(raised.max[1]).toBeCloseTo(.84971344,4);
 expect(raised.max[1]).toBeLessThan(.87);
 const plainDeck=await evaluateViewer(page,()=>window.__fiero.getPartBounds('decklid'));
 await page.locator('#config-deck').selectOption('wing');
 const wingDeck=await evaluateViewer(page,()=>window.__fiero.getPartBounds('deck-wing'));
 expect(await evaluateViewer(page,()=>window.__fiero.getPartBounds('decklid'))).toEqual(plainDeck);
 // These reconstructed endpoints lie at different longitudinal stations:
 // the forward engine hump is not the deck beneath the rear-mounted wing.
 // The native exterior audit checks clearance at nine matching stations.
 expect(plainDeck.max[1]).toBeCloseTo(.89744806,4);
 expect(wingDeck.max[1]).toBeCloseTo(.96348011,4);
 expect(wingDeck.max[1]).toBeLessThan((await evaluateViewer(page,()=>window.__fiero.getPartBounds('roof'))).max[1]-.15);
 await page.locator('#config-roof').selectOption('glass');
 const glazed=await evaluateViewer(page,()=>window.__fiero.getModelStats().triangles);
 await page.locator('#config-roof').selectOption('removed');
 expect(await evaluateViewer(page,()=>window.__fiero.getModelStats().triangles)).toBeLessThan(glazed);
 // Compare the actual installed C60 option meshes while viewing cooling.
 await page.locator('#systems [data-system="cooling"]').click();await evaluateViewer(page,()=>window.__fiero.whenIdle());
 expect(await evaluateViewer(page,()=>window.__fiero.getLoadingStats().level)).toBe('vehicle:all');
 const before=await evaluateViewer(page,()=>window.__fiero.getModelStats().triangles);
 await page.locator('#config-airConditioning').check();
 await evaluateViewer(page,()=>window.__fiero.whenIdle());
 expect(await evaluateViewer(page,()=>window.__fiero.getModelStats().triangles)).toBeGreaterThan(before);
 await page.getByRole('button',{name:'Exterior',exact:true}).click();await evaluateViewer(page,()=>window.__fiero.whenIdle());
 await page.getByRole('button',{name:'White paint',exact:true}).click();
 await page.locator('[data-config="studio"]').selectOption('dark');
 await expect(page.locator('.stage')).toHaveAttribute('data-studio','dark');
 await waitForViewer(page);await page.screenshot({path:'artifacts/configuration-preview.png'});
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
 await page.locator('#systems [data-system="engine"]').click();await evaluateViewer(page,()=>window.__fiero.whenIdle());
 const plenum=await evaluateViewer(page,()=>window.__fiero.getPartBounds('intake'));expect(plenum).not.toBeNull();
 expect(plenum.max[1]).toBeLessThan(.78);
 await page.locator('#systems [data-system="drivetrain"]').click();await evaluateViewer(page,()=>window.__fiero.whenIdle());
 const gearbox=await evaluateViewer(page,()=>window.__fiero.getPartBounds('gearbox'));expect(gearbox).not.toBeNull();
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
