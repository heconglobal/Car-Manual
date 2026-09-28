import {test,expect} from '@playwright/test';
test('1985 SE interior: shared seats, cockpit and removable trim render in focused views',async({page})=>{
 test.setTimeout(600000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/interior-review.html');await expect(page.locator('canvas')).toHaveAttribute('data-ready','true',{timeout:240000});
 for(const name of ['cabin','seats','driver','seatSide','seatBack','dashboard','console','door','trim','steering','pedals']){await page.getByLabel('Interior view').selectOption(name);await page.locator('#model').screenshot({path:`artifacts/interior-i1-${name}.png`});}
 await page.getByLabel('Interior view').selectOption('driver');await page.locator('#explode').check();await page.locator('#model').screenshot({path:'artifacts/interior-i1-seat-exploded.png'});
 await page.getByLabel('Interior view').selectOption('console');await page.locator('#model').screenshot({path:'artifacts/interior-i1-console-exploded.png'});
 await page.locator('#explode').uncheck();await page.getByLabel('Interior view').selectOption('cabin');await page.locator('#trim').selectOption('tan');await page.locator('#model').screenshot({path:'artifacts/interior-i1-tan.png'});
 expect(errors).toEqual([]);
});
