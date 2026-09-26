import {test,expect} from '@playwright/test';
test('exterior wheel, roof and front panel interfaces render in close views',async({page})=>{
 test.setTimeout(480000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 for(const view of ['frontWheel','roof','frontClose']){
  await page.locator(`[data-review-view="${view}"]`).click();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('#model').screenshot({path:`artifacts/exterior-r8-${view}.png`});
 }
 expect(errors).toEqual([]);
});
