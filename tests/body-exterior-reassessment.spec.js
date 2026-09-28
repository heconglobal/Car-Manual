import {test,expect} from '@playwright/test';
test('exterior reassessment: full shell, moldings, grille construction and roof opening',async({page})=>{
 test.setTimeout(720000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/body-review.html');await page.waitForFunction(()=>window.__bodyReview&&document.querySelector('canvas').dataset.ready==='true');
 const capture=async(view,suffix='')=>{await page.locator(`[data-review-view="${view}"]`).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.locator('#model').screenshot({path:`artifacts/body-r12-${view}${suffix}.png`});};
 for(const view of ['windowCorner','deckVents','molding','driverElevation','rear','rearProfile','front','frontClose','rearElevation','plan','backlight'])await capture(view);
 await page.getByLabel('Reference',{exact:true}).selectOption('grilles');await page.waitForFunction(()=>document.querySelector('#photo').complete&&document.querySelector('#photo').naturalWidth>0);
 await page.getByLabel('Neutral panel material',{exact:true}).check();await capture('rear','-clay');await page.getByLabel('Neutral panel material',{exact:true}).uncheck();
 await page.getByLabel('Side glass',{exact:true}).selectOption('open');await capture('driverWindow','-open');
 for(const side of ['left','right']){
  const b=await page.evaluate(s=>Object.fromEntries(['door-glass-','a-pillar-seal-','upper-window-seal-','b-pillar-seal-','belt-seal-','deck-vent-'].map(prefix=>[prefix,window.__bodyReview.bounds(prefix+s)])),side);
  for(const [prefix,box]of Object.entries(b))expect(box.min.every(Number.isFinite),prefix+side).toBe(prefix!=='door-glass-');
 }
 await page.getByLabel('Roof panel',{exact:true}).selectOption('removed');await capture('sunroofClose','-removed');
 expect(errors).toEqual([]);
});
