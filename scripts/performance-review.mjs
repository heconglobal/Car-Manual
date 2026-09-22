import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions),start=Date.now(),timings={},errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(45000);page.setDefaultNavigationTimeout(240000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});timings.initialReady=(Date.now()-start)/1000;
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 let t=Date.now();await settle();timings.settle=(Date.now()-t)/1000;
 await page.screenshot({path:'artifacts/performance-vehicle-desktop.png'});
 t=Date.now();await page.setViewportSize({width:390,height:700});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('Driver lower hinge pin');await page.locator('.part-button[data-part="bd-door-left-lower-pin"]').click();await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-door-left');timings.mobileSelection=(Date.now()-t)/1000;
 await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await settle();await page.screenshot({path:'artifacts/performance-mobile-selection.png'});
 await page.setViewportSize({width:1440,height:1000});t=Date.now();await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await settle();timings.returnVehicle=(Date.now()-t)/1000;
 expect(errors).toEqual([]);const report={date:new Date().toISOString(),status:'passed',profile:await page.locator('canvas').getAttribute('data-render-profile'),timings,seconds:(Date.now()-start)/1000,errors};await writeFile('artifacts/performance-review.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await browser.close();}
