import { chromium } from '@playwright/test';
import config from '../playwright.config.js';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch(config.use.launchOptions);
const prefix=process.argv.includes('--roof-tail')?'roof-tail':'rear-body';
try {
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(120000);
 await page.addInitScript(()=>localStorage.setItem('fiero-configuration-v2',JSON.stringify({roof:'glass',deck:'clean',headlights:false,rearDefrost:true})));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');
 await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 for(const view of ['rear','side','home','top']){
  await page.locator(`[data-view="${view}"]`).click();await settle();
  await page.locator('#viewport').screenshot({path:`artifacts/${prefix}-${view}.png`});console.log(`Captured ${view}`);
  if(view==='rear'){
   await page.locator('canvas').focus();await page.keyboard.press('+');await page.keyboard.press('+');await settle();
   await page.locator('#viewport').screenshot({path:`artifacts/${prefix}-detail.png`});console.log('Captured rear detail');
  }
 }
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 await page.locator('#config-deck').selectOption('rack');
 await page.locator('[data-view="rear"]').click();await settle();
 await page.locator('#viewport').screenshot({path:`artifacts/${prefix}-carrier.png`});console.log('Captured carrier');
 const ids=['roof','rear-fascia','exhaust','rear-clip','rear-window','sail-left','sail-right','decklid','deck-vent-left','deck-vent-right','taillights','fender-left','fender-right','quarter-left','quarter-right'];
 const bounds=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),ids);
 const result={date:new Date().toISOString(),errors,bounds,partCount:await page.evaluate(()=>window.__fiero.partCount),stats:await page.evaluate(()=>window.__fiero.getModelStats())};
 await writeFile(`artifacts/${prefix}-review.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
} finally {await browser.close();}
