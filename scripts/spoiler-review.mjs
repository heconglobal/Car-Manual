import { chromium } from '@playwright/test';
import config from '../playwright.config.js';
import { writeFile } from 'node:fs/promises';
const detailOnly=process.argv.includes('--detail-only');
const browser=await chromium.launch(config.use.launchOptions);
try {
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');
 await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 const bounds={};
 for(const option of detailOnly?['rack','wing']:['clean','rack','wing']){
  await page.locator('#config-deck').selectOption(option);
  bounds[option]=await page.evaluate(()=>window.__fiero.getPartBounds('decklid'));
  for(const view of detailOnly?['rear']:option==='clean'?['home','rear']:['rear','side']){
   await page.locator(`[data-view="${view}"]`).click();
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await page.locator('#viewport').screenshot({path:`artifacts/exterior-${option}-${view}.png`});
  }
 }
 const result={date:new Date().toISOString(),errors,bounds,nose:await page.evaluate(()=>window.__fiero.getPartBounds('nose')),rear:await page.evaluate(()=>window.__fiero.getPartBounds('rear-fascia')),stats:await page.evaluate(()=>window.__fiero.getModelStats())};
 await writeFile(detailOnly?'artifacts/spoiler-final-review.json':'artifacts/spoiler-review.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
} finally {await browser.close();}
