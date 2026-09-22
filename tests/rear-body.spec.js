import { test, expect } from '@playwright/test';

test('rear glass, sail windows and deck vents are independent selectable assemblies',async({page})=>{
 test.setTimeout(180000);
 await page.goto('/');await page.waitForFunction(()=>window.__fiero);
 const ids=['rear-clip','rear-window','sail-left','sail-right','deck-vent-left','deck-vent-right'];
 const bounds=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),ids);
 for(const id of ids){expect(bounds[id]).not.toBeNull();for(let axis=0;axis<3;axis++)expect(bounds[id].max[axis]).toBeGreaterThan(bounds[id].min[axis]);}
 // The side appliques and the rear backlight occupy different planes.
 expect(bounds['sail-left'].max[0]).toBeLessThan(bounds['rear-window'].min[0]);
 expect(bounds['sail-right'].min[0]).toBeGreaterThan(bounds['rear-window'].max[0]);
 await page.getByRole('searchbox').fill('sail window');
 // Search includes descriptions, so the roof's related sail-window text can
 // also match. Both independently selectable applique results must appear.
 await expect(page.locator('.part-button[data-part^="sail-"]')).toHaveCount(2);
 await page.locator('[data-part="sail-left"].part-button').click();
 await expect(page.locator('.component-heading')).toContainText('Left sail window');
 await page.getByRole('button',{name:'Isolate',exact:true}).click();
 expect(await page.evaluate(()=>window.__fiero.getModelState().isolate)).toBe(true);
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.getByRole('searchbox').fill('vent grille');
 await expect(page.locator('.part-button[data-part^="deck-vent-"]')).toHaveCount(2);
 await page.locator('[data-part="deck-vent-right"].part-button').click();
 await expect(page.locator('.component-heading')).toContainText('Right engine-deck vent');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 const assembled=await page.evaluate(()=>window.__fiero.getPartBounds('deck-vent-right'));
 await page.locator('#explode').fill('50');
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const separated=await page.evaluate(()=>window.__fiero.getPartBounds('deck-vent-right'));
 expect(separated.min[1]-assembled.min[1]).toBeGreaterThan(.45);
 await page.locator('#explode').fill('0');
});
