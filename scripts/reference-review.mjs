import { chromium } from '@playwright/test';
import config from '../playwright.config.js';
import { writeFile } from 'node:fs/promises';
// Match the visible equipment in the four owner-provided reference images.
// This browser-only preset does not change the app's defaults or VIN record.
const browser=await chromium.launch(config.use.launchOptions);
try {
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(120000);
 await page.addInitScript(()=>localStorage.setItem('fiero-configuration-v2',JSON.stringify({roof:'glass',deck:'rack',headlights:true,rearDefrost:true})));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');
 await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 for(const view of process.argv.includes('--sills')?['side','rear']:['home','rear','side','top']){
  await page.locator(`[data-view="${view}"]`).click();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('#viewport').screenshot({path:`artifacts/reference-${view}.png`});
  console.log(`Captured ${view}`);
 }
 const fenderBounds=await page.evaluate(()=>['fender-left','fender-right','quarter-left','quarter-right'].map(id=>window.__fiero.getPartBounds(id)));
 const bodyWidthMm=(Math.max(...fenderBounds.map(b=>b.max[0]))-Math.min(...fenderBounds.map(b=>b.min[0])))*1000;
 const result={bodyWidthMm,date:new Date().toISOString(),errors,configuration:await page.evaluate(()=>window.__fiero.getState().configuration),headlamps:await page.evaluate(()=>window.__fiero.getPartBounds('headlights')),roof:await page.evaluate(()=>window.__fiero.getPartBounds('roof')),stats:await page.evaluate(()=>window.__fiero.getModelStats())};
 await writeFile(process.argv.includes('--sills')?'artifacts/reference-sills-final.json':'artifacts/reference-review.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
} finally {await browser.close();}
