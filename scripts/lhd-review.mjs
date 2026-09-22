import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions);
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(180000);page.setDefaultNavigationTimeout(120000);
 const errors=[],captures=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const capture=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});captures.push(name);console.log('Captured '+name);};
 await page.locator('[data-tab="config"]').click();await page.getByRole('button',{name:'Cabin',exact:true}).click();await capture('lhd-driver-seat');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('vehicle-after-cabin-camera-fix');
 const report={date:new Date().toISOString(),errors,captures};await writeFile('artifacts/lhd-review.json',JSON.stringify(report,null,2)+'\n');if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
