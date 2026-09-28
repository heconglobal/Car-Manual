import {test,expect} from '@playwright/test';
test('window seal close views retain body seals with door and roof glass removed',async({page})=>{
 test.setTimeout(480000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 const capture=async(view,suffix='')=>{await page.locator(`[data-review-view="${view}"]`).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.locator('#model').screenshot({path:`artifacts/seals-r11-${view}${suffix}.png`});};
 for(const view of ['driverWindow','passengerWindow','windowCorner','windshield','backlight','sunroofClose'])await capture(view);
 await page.getByLabel('Side glass',{exact:true}).selectOption('open');
 const bounds=await page.evaluate(()=>Object.fromEntries(['door-glass-left','door-glass-right','a-pillar-seal-left','upper-window-seal-left','b-pillar-seal-left','belt-seal-left','a-pillar-seal-right','upper-window-seal-right','b-pillar-seal-right','belt-seal-right'].map(id=>[id,window.__bodyReview.bounds(id)])));
 for(const [id,b]of Object.entries(bounds))expect(b.min.every(Number.isFinite),id).toBe(!id.startsWith('door-glass'));
 await capture('driverWindow','-open');await capture('passengerWindow','-open');
 await page.getByLabel('Roof panel',{exact:true}).selectOption('removed');await capture('sunroofClose','-removed');
 const seal=await page.evaluate(()=>window.__bodyReview.bounds('sunroof-seal'));expect(seal.min.every(Number.isFinite)).toBe(true);expect(errors).toEqual([]);
});
