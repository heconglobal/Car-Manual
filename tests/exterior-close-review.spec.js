import {test,expect} from '@playwright/test';
test('exterior interfaces and five orthographic elevations render with installed body hardware',async({page})=>{
 test.setTimeout(480000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 for(const view of ['driverElevation','passengerElevation','frontElevation','rearElevation','plan','frontWheel','roof','frontClose']){
  await page.locator(`[data-review-view="${view}"]`).click();
  if(['driverElevation','passengerElevation','frontElevation','rearElevation','plan'].includes(view))expect(await page.evaluate(()=>window.__bodyReview.projection())).toBe('OrthographicCamera');
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('#model').screenshot({path:`artifacts/exterior-r9-${view}.png`});
 }
 expect(errors).toEqual([]);
});
