import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions),started=Date.now();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(120000);const errors=[],captures=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:180000});
 const capture=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});captures.push(name);console.log('Captured '+name);};
 await page.getByRole('searchbox').fill('early actuator gearcase');await page.locator('.part-button[data-part="hl-left-housing"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('headlight-motor-final-assembled');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('headlight-motor-final-exploded');
 await page.locator('.part-button[data-part="hl-left-output-gear"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('headlight-gear-final-pockets');
 await page.locator('.part-button[data-part="hl-left-housing"]').click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('headlight-gearcase-final-cavity');
 await page.locator('#systems [data-assembly="headlight-right"]').click();await page.locator('#systems [data-assembly="headlight-right-motor"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('headlight-rh-motor-final-exploded');
 await page.setViewportSize({width:390,height:700});await page.evaluate(()=>scrollTo(0,0));await capture('headlight-mobile-final-canvas');expect(errors).toEqual([]);
 await writeFile('artifacts/headlight-final-review.json',JSON.stringify({date:new Date().toISOString(),seconds:(Date.now()-started)/1000,errors,captures,status:'passed'},null,2)+'\n');
}finally{await browser.close();}
