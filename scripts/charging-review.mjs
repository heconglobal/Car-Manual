import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
import {chargingParts} from '../src/charging-catalog.js';
import {detailMembers} from '../src/inspection-catalog.js';
const browser=await chromium.launch(config.use.launchOptions),start=Date.now();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(180000);const errors=[],images=[],captures=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:240000});
 const shot=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});captures.push(name);console.log('Captured '+name);};
 const reset=()=>page.getByRole('button',{name:'Reset view',exact:true}).click();
 await shot('vehicle-hood-clearance-fixed');
 await page.getByRole('searchbox').fill('Delco Freedom battery');await page.locator('.part-button[data-part="ch-battery-case"]').click();await reset();await shot('charging-battery-assembled');
 expect((await page.evaluate(()=>window.__fiero.getPartBounds('ch-battery-case'))).min[0]).toBeGreaterThan(0);
 for(const scope of['charging-battery','charging-starter','charging-alternator']){
  await page.locator('#systems [data-assembly="'+scope+'"]').click();await reset();expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers(scope).map(p=>p.id).sort());await shot(scope+'-assembled');await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot(scope+'-exploded');
 }
 await page.locator('.part-button[data-part="ch-alt-rotor"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await shot('charging-claw-rotor');
 await page.locator('.part-button[data-part="ch-alt-rear"]').click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await shot('charging-rear-frame');
 await page.setViewportSize({width:390,height:700});await page.evaluate(()=>scrollTo(0,0));await shot('charging-mobile-generator');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('searchbox').fill('Dome / map lamp carrier');await page.locator('.part-button[data-part="lt-dome-housing"]').click();await reset();await shot('lighting-dome-refined');
 expect(errors).toEqual([]);expect(images).toEqual([]);
 await writeFile('artifacts/charging-review.json',JSON.stringify({date:new Date().toISOString(),seconds:(Date.now()-start)/1000,status:'passed',parts:chargingParts.length,errors,images,captures},null,2)+'\n');
}finally{await browser.close();}
