import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch(config.use.launchOptions);
const detailOnly=process.argv.includes('--details');
try{
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(90000);
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 if(!detailOnly){await page.getByRole('button',{name:'Reset view',exact:true}).click();await settle();
 await page.screenshot({path:'artifacts/engine-assembled.png'});console.log('Captured assembled engine');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
 await page.screenshot({path:'artifacts/engine-exploded.png'});console.log('Captured exploded engine');}
 for(const section of (detailOnly?['head-front','timing']:['head-front','short-block','timing'])){
  await page.locator(`#systems [data-assembly="${section}"]`).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
  await page.screenshot({path:`artifacts/engine-${section}.png`});console.log(`Captured ${section}`);
 }
 const result={date:new Date().toISOString(),errors,engineParts:await page.evaluate(()=>window.__fiero.enginePartCount),scope:await page.evaluate(()=>window.__fiero.getState().assembly),stats:await page.evaluate(()=>window.__fiero.getModelStats())};
 await writeFile(`artifacts/engine-${detailOnly?'detail-final-':''}review.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
