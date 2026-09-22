import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions),start=Date.now(),errors=[],captures=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(240000);page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});
 const shot=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:'artifacts/'+name+'.png'});captures.push(name);console.log('Captured '+name);};
 await shot('headlights-nominal-closed');await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('[data-config="headlights"]').check();await page.getByRole('button',{name:'Exterior',exact:true}).click();await shot('headlights-nominal-raised');
 await page.getByRole('searchbox').fill('Sealed-beam glass lens');await page.locator('.part-button[data-part="hl-left-lens"]').click();await page.locator('#systems [data-assembly="headlight-left"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await shot('headlights-nominal-left-raised');
 let b=await page.evaluate(()=>window.__fiero.getPartBounds('hl-left-lens'));expect((b.min[1]+b.max[1])/2).toBeCloseTo(.709,4);expect((b.min[0]+b.max[0])/2).toBeCloseTo(-.511,4);
 await page.getByRole('button',{name:'Lower headlights',exact:true}).click();await shot('headlights-nominal-left-closed');await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('headlights-nominal-exploded');expect(errors).toEqual([]);
 await writeFile('artifacts/headlight-datum-review.json',JSON.stringify({date:new Date().toISOString(),status:'passed',seconds:(Date.now()-start)/1000,errors,captures},null,2)+'\n');
}finally{await browser.close();}
