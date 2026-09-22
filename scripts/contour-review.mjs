import { chromium } from '@playwright/test';
import config from '../playwright.config.js';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch(config.use.launchOptions);
try {
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');
 await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const capture=async(name,view)=>{
  await page.locator(`[data-view="${view}"]`).click();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('#viewport').screenshot({path:`artifacts/contour-${name}.png`});
  console.log(`Captured ${name}`);
 };
 await capture('body-side','side');await capture('roof-rear','rear');await capture('roof-top','top');
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 const closed=await page.evaluate(()=>window.__fiero.getPartBounds('headlights'));
 await page.locator('[data-config="headlights"]').check();
 await capture('headlights-front','home');await capture('headlights-side','side');
 const raised=await page.evaluate(()=>window.__fiero.getPartBounds('headlights'));
 await page.locator('#config-deck').selectOption('wing');
 await capture('wing-rear','rear');await capture('wing-side','side');
 const result={date:new Date().toISOString(),errors,closed,raised,wing:await page.evaluate(()=>window.__fiero.getPartBounds('decklid')),roof:await page.evaluate(()=>window.__fiero.getPartBounds('roof')),stats:await page.evaluate(()=>window.__fiero.getModelStats())};
 await writeFile('artifacts/contour-review.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
} finally {await browser.close();}
