import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {writeFile} from 'node:fs/promises';
import {regressionManifest} from './regression-evidence.mjs';
import {engineParts} from '../src/engine-catalog.js';
const manifest=regressionManifest(),startedAt=new Date().toISOString(),captures=[];
const browser=await chromium.launch(config.use.launchOptions);
const detailOnly=process.argv.includes('--details');
try{
 const page=await browser.newPage({viewport:{width:1600,height:1060},reducedMotion:'reduce'});
 page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(240000);
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log(e.message);});
 await page.goto('http://127.0.0.1:5185/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 if(!detailOnly){await page.getByRole('button',{name:'Reset view',exact:true}).click();await settle();
 await page.screenshot({path:'artifacts/engine-assembled.png'});captures.push('engine-assembled.png');console.log('Captured assembled engine');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
 await page.screenshot({path:'artifacts/engine-exploded.png'});captures.push('engine-exploded.png');console.log('Captured exploded engine');}
 for(const section of (detailOnly?['head-front','timing']:['head-front','short-block','timing'])){
  await page.locator(`#systems [data-assembly="${section}"]`).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
  await page.screenshot({path:`artifacts/engine-${section}.png`});captures.push(`engine-${section}.png`);console.log(`Captured ${section}`);
 }
 const engineStats=await page.evaluate(()=>window.__fiero.getModelStats());
 const extraCaptures=[];
 if(process.argv.includes('--include-electrical')){
  for(const [family,scopes] of [['charging-system',['charging-battery','charging-starter','charging-alternator']],['lighting-system',['lighting-rear-left','lighting-front-left','lighting-dome']]]){
   await page.locator('#systems [data-assembly="'+family+'"]').click();
   for(const scope of scopes){
    await page.locator('#systems [data-assembly="'+scope+'"]').click();
    await page.getByRole('button',{name:'Reset view',exact:true}).click();await settle();
    const a=scope+'-assembled.png';await page.screenshot({path:'artifacts/'+a});extraCaptures.push(a);console.log('Captured '+a);
    await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
    const e=scope+'-exploded.png';await page.screenshot({path:'artifacts/'+e});extraCaptures.push(e);console.log('Captured '+e);
   }
  }
 }
 const current=regressionManifest();
 if(current.applicationSha256!==manifest.applicationSha256||current.newestInputMtime>Date.parse(startedAt))throw new Error('Source changed during visual capture.');
 const result={date:new Date().toISOString(),startedAt,sourceSha256:manifest.sourceSha256,applicationSha256:manifest.applicationSha256,errors,engineParts:engineParts.length,captures,extraCaptures,engineStats,renderProfile:await page.locator('canvas').getAttribute('data-render-profile'),scope:await page.evaluate(()=>window.__fiero.getState().assembly),stats:await page.evaluate(()=>window.__fiero.getModelStats()),status:errors.length?'failed':'captured for visual inspection',limits:'Captures and interaction checks do not certify exact casting geometry or all internal clearances.'};
 await writeFile(`artifacts/engine-${detailOnly?'detail-final-':''}review.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
