import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {regressionManifest} from './regression-evidence.mjs';
import {writeFile} from 'node:fs/promises';
const manifest=regressionManifest(),startedAt=new Date().toISOString();
const browser=await chromium.launch(config.use.launchOptions),page=await browser.newPage({viewport:{width:1500,height:1000},reducedMotion:'reduce'}),errors=[],captures=[];
page.setDefaultTimeout(180000);page.setDefaultNavigationTimeout(240000);page.on('pageerror',e=>errors.push(e.message));
const capture=async n=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:'artifacts/'+n+'.png'});captures.push(n+'.png');console.log(n);};
try{
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');
 await capture('shared-powertrain-whole-car');
 await page.locator('#systems [data-system="engine"]').click();await page.locator('.part-button[data-part="engine-block"]').click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await page.locator('[data-view="rear"]').click();await capture('shared-powertrain-installed');
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('shared-powertrain-engine');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('shared-powertrain-engine-exploded');
 const current=regressionManifest();if(current.applicationSha256!==manifest.applicationSha256)throw new Error('Changed source during captures');
 await writeFile('artifacts/shared-powertrain-review.json',JSON.stringify({startedAt,finishedAt:new Date().toISOString(),...manifest,errors,captures,status:errors.length?'failed':'captured, pending visual inspection'},null,2)+'\n');if(errors.length)process.exitCode=1;
}finally{await browser.close();}
