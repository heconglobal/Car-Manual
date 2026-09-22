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
 const settled=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.getByRole('searchbox').fill('space frame');await page.locator('[data-part="spaceframe"].part-button').click();
 await page.getByRole('button',{name:'Isolate',exact:true}).click();
 await settled();await page.locator('#viewport').screenshot({path:'artifacts/review-spaceframe.png'});
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.getByRole('button',{name:'Configure',exact:true}).click();
 await page.locator('[data-config="headlights"]').check();
 await settled();await page.locator('#viewport').screenshot({path:'artifacts/review-headlights-raised.png'});
 await page.getByRole('searchbox').fill('headlamp');await page.locator('[data-part="headlights"].part-button').click();
 await page.getByRole('button',{name:'Isolate',exact:true}).click();
 await page.getByRole('button',{name:'Focus part',exact:true}).click();
 await settled();await page.locator('#viewport').screenshot({path:'artifacts/review-headlamp-detail.png'});
 const result={date:new Date().toISOString(),errors,stats:await page.evaluate(()=>window.__fiero.getModelStats()),headlamps:await page.evaluate(()=>window.__fiero.getPartBounds('headlights'))};
 await writeFile('artifacts/detail-review.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
 if(errors.length)process.exitCode=1;
} finally {await browser.close();}
