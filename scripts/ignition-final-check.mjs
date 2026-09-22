import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch(config.use.launchOptions);
browser.on('disconnected',()=>console.log('Browser disconnected'));
try{
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultTimeout(180000);page.setDefaultNavigationTimeout(120000);
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Page error: '+e.message);});page.on('crash',()=>console.log('PAGE CRASH'));page.on('close',()=>console.log('Page closed'));page.on('console',m=>{if(m.type()==='error')console.log('Console error: '+m.text());});
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.lighting==='hdr');
 const capture=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});console.log('Captured '+name);};
 await page.getByRole('searchbox').fill('trunk-side cylinder head');await page.locator('.part-button[data-part="eng-rear-head"]').click();
 await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.locator('[data-view="top"]').click();await capture('engine-head-gallery');
 await page.locator('#systems [data-assembly="ignition"]').click();await page.locator('#systems [data-assembly="plug-wires"]').click();
 await page.locator('.part-button[data-part="eng-spark-rear-1"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();
 await page.locator('.part-service-reference').scrollIntoViewIfNeeded();await capture('ignition-plug-reference');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.locator('#systems [data-system="cooling"]').click();await capture('vehicle-cooling-context');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('vehicle-after-ignition');
 await page.setViewportSize({width:390,height:500});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('ICM');
 const icm=page.locator('.part-button[data-part="eng-icm"]');await icm.scrollIntoViewIfNeeded();await capture('ignition-compact-menu');await icm.click();
 if(await page.locator('canvas').getAttribute('data-assembly')!=='distributor-detail')throw new Error('Compact menu did not open the distributor');
 const result={date:new Date().toISOString(),errors};await writeFile('artifacts/ignition-final-check.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
