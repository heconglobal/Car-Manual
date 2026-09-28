import {test,expect} from '@playwright/test';
test('pillar and rear bumper review uses shared geometry and original Pontiac references',async({page})=>{
 test.setTimeout(480000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 for(const reference of ['catalog','structure','profile','cad']){
  await page.getByLabel('Reference',{exact:true}).selectOption(reference);
  await page.waitForFunction(()=>{const i=document.querySelector('#photo');return i.complete&&i.naturalWidth>0;});
 }
 const capture=async(view,suffix='')=>{await page.locator(`[data-review-view="${view}"]`).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.locator('#model').screenshot({path:`artifacts/body-r11-${view}${suffix}.png`});};
 for(const view of ['driverElevation','pillarProfile','windowCorner','rearProfile','rear','backlight'])await capture(view);
 await page.getByLabel('Side glass',{exact:true}).selectOption('open');await capture('pillarProfile','-open');
 expect(await page.evaluate(()=>window.__bodyReview.bounds('door-glass-left').min.every(Number.isFinite))).toBe(false);
 expect(await page.evaluate(()=>window.__bodyReview.bounds('a-pillar-seal-left').min.every(Number.isFinite))).toBe(true);
 expect(errors).toEqual([]);
});
