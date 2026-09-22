import {chromium} from '@playwright/test';
import config from '../playwright.config.js';
import {writeFile} from 'node:fs/promises';
const results=[];
for(const mode of [
 {name:'headless-default',headless:true,args:['--ignore-gpu-blocklist']},
 {name:'x11-egl',headless:false,args:['--ozone-platform=x11','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=gl-egl']},
 {name:'x11-d3d12',headless:false,args:['--ozone-platform=x11','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=gl-egl'],env:{GALLIUM_DRIVER:'d3d12'}},
].filter(mode=>!process.argv.includes('--d3d12-only')||mode.name==='x11-d3d12')){
 let browser;
 try{
  browser=await chromium.launch({...config.use.launchOptions,headless:mode.headless,timeout:20000,args:['--no-sandbox',...mode.args],env:{...config.use.launchOptions.env,...mode.env,LD_LIBRARY_PATH:'/usr/lib/x86_64-linux-gnu:/usr/lib/wsl/lib:'+(config.use.launchOptions.env?.LD_LIBRARY_PATH||'')}});
  const page=await browser.newPage();page.setDefaultTimeout(12000);
  await page.setContent('<canvas width="32" height="32"></canvas>');
  const info=await page.evaluate(()=>{
   const gl=document.querySelector('canvas').getContext('webgl2');
   if(!gl)return {webgl2:false};
   const e=gl.getExtension('WEBGL_debug_renderer_info');
   const renderer=e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
   gl.clearColor(.3,.4,.5,1);gl.clear(gl.COLOR_BUFFER_BIT);const pixel=new Uint8Array(4);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
   return {webgl2:true,renderer,vendor:e?gl.getParameter(e.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),software:/SwiftShader|llvmpipe|Software/i.test(renderer),pixel:Array.from(pixel),error:gl.getError()};
  });
  results.push({mode:mode.name,...info});console.log(JSON.stringify(results.at(-1)));
  if(info.webgl2&&!info.software)break;
 }catch(error){results.push({mode:mode.name,error:error.message});console.log(mode.name+': '+error.message.slice(0,600));}
 finally{await browser?.close();}
}
const result={date:new Date().toISOString(),results,hardwareAvailable:results.some(r=>r.webgl2&&!r.software),limits:'A small WebGL context probe only. Does not test the workshop, certify visual fidelity or benchmark a user device.'};
await writeFile(process.argv.includes('--d3d12-only')?'artifacts/hardware-d3d12-probe.json':'artifacts/hardware-probe.json',JSON.stringify(result,null,2)+'\n');
