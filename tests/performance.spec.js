import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {sourceFingerprint} from '../scripts/source-fingerprint.mjs';

test('desktop and mobile viewport performance is measured with renderer identity',async({page},testInfo)=>{
 test.setTimeout(900000);page.setDefaultNavigationTimeout(600000);const sourceSha256=sourceFingerprint(),errors=[],startedAt=new Date().toISOString(),timings={};
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  window.__fieroLongTasks=[];
  if(PerformanceObserver.supportedEntryTypes.includes('longtask'))new PerformanceObserver(list=>window.__fieroLongTasks.push(...list.getEntries().map(e=>({startTime:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
 });
 const start=performance.now();await page.goto('/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:600000});timings.coldReadyMs=performance.now()-start;
 const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const renderer=await page.locator('canvas').evaluate(canvas=>{
  const gl=canvas.getContext('webgl2'),info=gl.getExtension('WEBGL_debug_renderer_info');
  return{profile:canvas.dataset.renderProfile,vendor:info?gl.getParameter(info.UNMASKED_VENDOR_WEBGL):null,renderer:info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):null,version:gl.getParameter(gl.VERSION),userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,deviceMemoryGiB:navigator.deviceMemory??null,devicePixelRatio,viewport:{width:innerWidth,height:innerHeight},buffer:{width:canvas.width,height:canvas.height}};
 });
 const geometry=await page.evaluate(()=>window.__fiero.getModelStats());
 const initialAllocation=await page.evaluate(()=>window.__fiero.getLoadingStats());
 const orbit=[];
 for(let i=0;i<6;i++){
  const duration=await page.locator('canvas').evaluate(canvas=>new Promise(resolve=>{const t=performance.now();canvas.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(performance.now()-t)));}));orbit.push(duration);
 }
 const folder=testInfo.outputPath('performance');await mkdir(folder,{recursive:true});
 await page.screenshot({path:folder+'/desktop.png'});
 await page.setViewportSize({width:390,height:700});
 let at=performance.now();await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('Driver lower hinge pin');await page.locator('.part-button[data-part="bd-door-left-lower-pin"]').click();await page.evaluate(()=>window.__fiero.whenIdle());await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-door-left');await settle();timings.mobileDetailReadyMs=performance.now()-at;
 const detailAllocation=await page.evaluate(()=>window.__fiero.getLoadingStats());
 await page.getByRole('button',{name:'Isolate',exact:true}).click();at=performance.now();await page.getByRole('button',{name:'Focus part',exact:true}).click();await settle();timings.mobileFocusMs=performance.now()-at;
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:folder+'/mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});at=performance.now();await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await settle();timings.returnVehicleMs=performance.now()-at;
 const returnedAllocation=await page.evaluate(()=>window.__fiero.getLoadingStats());
 at=performance.now();await page.getByRole('searchbox').fill('Driver lower hinge pin');await page.locator('.part-button[data-part="bd-door-left-lower-pin"]').click();await page.evaluate(()=>window.__fiero.whenIdle());await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-door-left');await settle();timings.cachedDetailReadyMs=performance.now()-at;
 const revisitedAllocation=await page.evaluate(()=>window.__fiero.getLoadingStats()),unchanged=sourceFingerprint()===sourceSha256;
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>({name:e.name,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,duration:e.duration})));
 const longTasks=await page.evaluate(()=>window.__fieroLongTasks),report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,unchanged,status:unchanged?'measured':'invalid-source-change',renderer,geometry,allocations:{initial:initialAllocation,detail:detailAllocation,returned:returnedAllocation,revisited:revisitedAllocation},resources,timings,orbitRedrawSamplesMs:orbit,longTasks:{count:longTasks.length,totalMs:longTasks.reduce((sum,t)=>sum+t.duration,0),longestMs:Math.max(0,...longTasks.map(t=>t.duration))},errors,limits:'One Chromium run on this host with software WebGL when detected. Mobile is a 390×700 viewport on the same host, not a physical phone. Redraw samples include two animation-frame callbacks and are not continuous-animation FPS. Passing confirms completed interactions without runtime errors, not a native-device speed budget or owner usability acceptance.'};
 await writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n');await testInfo.attach('renderer-and-performance',{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
 console.log('PERFORMANCE_REPORT '+folder+'/report.json');
 expect(errors).toEqual([]);expect(unchanged).toBe(true);expect(initialAllocation.overviewSource).toBe('native-full');expect(initialAllocation.models).toBe(1);expect(initialAllocation.initialization.completed).toBe(initialAllocation.initialization.total);expect(returnedAllocation.models).toBe(detailAllocation.models);expect(returnedAllocation.geometryBytes).toBe(detailAllocation.geometryBytes);expect(revisitedAllocation.initialization.buildCount).toBe(detailAllocation.initialization.buildCount);expect(revisitedAllocation.familyBuildCounts['body-system']).toBe(1);expect(revisitedAllocation.geometryBytes).toBe(detailAllocation.geometryBytes);
});
