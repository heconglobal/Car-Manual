import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
const browser=await chromium.launch(config.use.launchOptions);
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(45000);page.setDefaultNavigationTimeout(120000);
 const errors=[],captures=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:180000});
 const capture=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});captures.push(name);console.log('Captured '+name);};
 const scope=async id=>page.locator(`#systems [data-assembly="${id}"]`).click(),reset=()=>page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.getByRole('searchbox').fill('Heater control head');await page.locator('.part-button[data-part="hvac-controls"]').click();await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await reset();
 await page.locator('.part-button[data-part="hv-control-face"]').click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('hvac-c41-face-refined');
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('#config-airConditioning').check();await page.locator('[data-tab="component"]').click();await capture('hvac-c60-face-refined');
 await scope('hvac-evaporator');await reset();await capture('hvac-case-rim-refined');await scope('hvac-module');await reset();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('hvac-heater-rim-refined');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('button',{name:'Configure',exact:true}).click();await page.getByRole('button',{name:'Cabin',exact:true}).click();await capture('hvac-controls-in-cabin');
 const report={date:new Date().toISOString(),errors,captures};await writeFile('artifacts/hvac-review.json',JSON.stringify(report,null,2)+'\n');if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
