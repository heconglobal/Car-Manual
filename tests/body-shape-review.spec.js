import {test,expect} from '@playwright/test';
test('rear bumper has separated tall pads and a recessed full-height plate; shared body renders in reference views',async({page})=>{
 test.setTimeout(480000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 const b=await page.evaluate(()=>Object.fromEntries(['rear-pad-left','rear-pad-right','rear-plate-mount'].map(id=>[id,window.__bodyReview.bounds(id)])));
 expect(b['rear-pad-left'].max[0]).toBeLessThan(-.16);expect(b['rear-pad-right'].min[0]).toBeGreaterThan(.16);
 for(const id of ['rear-pad-left','rear-pad-right']){expect(b[id].max[1]-b[id].min[1]).toBeGreaterThan(.15);expect(b[id].max[1]).toBeGreaterThan(.49);}
 expect(b['rear-plate-mount'].max[1]-b['rear-plate-mount'].min[1]).toBeGreaterThan(.17);
 expect(b['rear-plate-mount'].max[2]).toBeLessThan(Math.min(b['rear-pad-left'].max[2],b['rear-pad-right'].max[2])-.018);
 for(const name of ['rear','side','front','straightRear']){await page.locator(`[data-review-view="${name}"]`).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/body-shape-${name}.png`,fullPage:true});}
 await page.locator('#clay').check();await page.locator('[data-review-view="side"]').click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:'artifacts/body-shape-side-neutral.png',fullPage:true});expect(errors).toEqual([]);
});
