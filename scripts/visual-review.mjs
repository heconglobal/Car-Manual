import { chromium } from '@playwright/test';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions);
const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(90000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5185/');
await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr',{},{timeout:60000});
for(const view of ['home','side','rear','front']){
 await page.locator(`[data-view="${view}"]`).click();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.locator('#viewport').screenshot({path:`artifacts/review-${view}.png`});
}
console.log(JSON.stringify({errors,stats:await page.evaluate(()=>window.__fiero.getModelStats())}));
await browser.close();
