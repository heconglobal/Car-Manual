import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
import {instrumentParts} from '../src/instrument-catalog.js';
const browser=await chromium.launch(config.use.launchOptions),start=Date.now(),errors=[],captures=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(240000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});
 const shot=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:'artifacts/'+name+'.png'});captures.push(name);console.log('Captured '+name);};
 await page.getByRole('searchbox').fill('1985 instrument cluster');await page.locator('.part-button[data-part="instrument-cluster"]').click();await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await shot('instruments-assembled');
 expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(instrumentParts.map(p=>p.id).sort());
 const speed=await page.evaluate(()=>window.__fiero.getPartBounds('wr-cluster-speed-face')),tach=await page.evaluate(()=>window.__fiero.getPartBounds('wr-cluster-tach-face'));expect(speed.max[0]).toBeLessThan(tach.min[0]);
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('instruments-exploded');
 await page.locator('.part-button[data-part="wr-cluster-oil-face"]').click();await expect(page.locator('.part-service-reference')).toContainText('Tachometer with oil-pressure gauge');await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await shot('instruments-oil-scale');
 await page.locator('#systems [data-assembly="wiring-ecm"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await shot('wiring-ecm-assembled-review');await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('wiring-ecm-exploded-review');
 await page.setViewportSize({width:390,height:700});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.locator('#systems [data-assembly="wiring-cluster"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await shot('instruments-mobile');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 await writeFile('artifacts/instrument-review.json',JSON.stringify({date:new Date().toISOString(),status:'passed',parts:instrumentParts.length,seconds:(Date.now()-start)/1000,errors,captures},null,2)+'\n');
}finally{await browser.close();}
