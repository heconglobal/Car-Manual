import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import config from '../playwright.config.js';
import {detailMembers} from '../src/inspection-catalog.js';
const browser=await chromium.launch(config.use.launchOptions),start=Date.now();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(180000);const errors=[],images=[],captures=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:240000});
 const shot=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/${name}.png`});captures.push(name);console.log('Captured '+name);};
 const reset=()=>page.getByRole('button',{name:'Reset view',exact:true}).click();
 await shot('lighting-front-vehicle');
 await page.getByRole('searchbox').fill('Driver light-control bezel');await page.locator('.part-button[data-part="hl-control-bezel"]').click();await reset();await shot('lighting-dash-controls');
 for(const id of ['hl-switch-rocker','hl-panel-dimmer','hl-beam-switch','hl-beam-rod'])expect((await page.evaluate(id=>window.__fiero.getPartBounds(id),id)).max[0]).toBeLessThan(0);
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('lighting-dash-controls-exploded');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('searchbox').fill('Divided rear reflector');await page.locator('.part-button[data-part="lt-rear-left-housing"]').click();await reset();await shot('lighting-rear-left-assembled');
 expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers('lighting-rear-left').map(p=>p.id).sort());
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('lighting-rear-left-exploded');
 await page.locator('.part-button[data-part="lt-rear-left-tail-bulb"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await shot('lighting-2057-bulb');await expect(page.locator('#inspector-content')).toContainText('2057');
 for(const scope of ['lighting-front-left','lighting-marker-front-left','lighting-dome','lighting-console']){
  await page.locator('#systems [data-assembly="'+scope+'"]').click();await reset();await shot(scope+'-assembled');await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot(scope+'-exploded');
 }
 await page.locator('#systems [data-assembly="lighting-dome"]').click();await reset();await page.setViewportSize({width:390,height:700});await page.evaluate(()=>scrollTo(0,0));await shot('lighting-dome-mobile');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);expect(images).toEqual([]);
 await writeFile('artifacts/lighting-review.json',JSON.stringify({date:new Date().toISOString(),seconds:(Date.now()-start)/1000,status:'passed',errors,images,captures},null,2)+'\n');
}finally{await browser.close();}
