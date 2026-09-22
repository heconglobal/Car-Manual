import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch(config.use.launchOptions);
try{
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultTimeout(180000);page.setDefaultNavigationTimeout(120000);
 const errors=[],captures=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Page error:',e.message);});page.on('crash',()=>console.log('PAGE CRASH'));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const capture=async name=>{await settle();await page.screenshot({path:`artifacts/${name}.png`});captures.push({name,stats:await page.evaluate(()=>window.__fiero.getModelStats())});console.log('Captured '+name);};
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('service-complete-engine');
 await page.locator('#systems [data-assembly="head-rear"]').click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('service-cylinder-head-exploded');
 await page.locator('#systems [data-assembly="valve-rear-2-intake"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.locator('.part-button[data-part="eng-rocker-rear-2-intake"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('service-final-rocker');
 await page.locator('#systems [data-assembly="accessories"]').click();await page.locator('#systems [data-assembly="water-pump-detail"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('service-final-pump');
 await page.locator('#systems [data-assembly="thermostat-detail"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.locator('.part-button[data-part="eng-thermostat-housing"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await page.locator('[data-view="top"]').click();await capture('service-filler-neck-bore');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('vehicle-after-engine-service');
 const report={date:new Date().toISOString(),errors,captures};await writeFile('artifacts/service-final-review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
