import {test,expect} from '@playwright/test';
import vehicleManifest from '../src/vehicle-manifest.js';

test('a failed complete-vehicle download shows recovery without claiming a WebGL failure',async({page},testInfo)=>{
 test.setTimeout(90000);let attempts=0;const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**'+vehicleManifest.url,route=>{attempts++;return route.abort('failed');});
 await page.goto('/',{waitUntil:'domcontentloaded',timeout:60000});
 await expect(page.locator('#loading')).toContainText('The complete vehicle could not load',{timeout:30000});
 await expect(page.locator('#loading')).not.toContainText('Enable WebGL');
 await expect(page.locator('#loading')).toContainText('Check the connection and reload.');
 await expect(page.locator('#render-status')).toHaveText('Workshop download unavailable');
 await expect(page.locator('#viewport')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('#viewport canvas')).toHaveCount(0);
 await expect(page.getByRole('searchbox')).toBeEnabled();
 await page.screenshot({path:testInfo.outputPath('vehicle-download-recovery.png')});
 await page.getByRole('button',{name:'Reload workshop',exact:true}).click();
 await expect.poll(()=>attempts,{timeout:30000}).toBe(2);
 await expect(page.locator('#loading')).toContainText('The complete vehicle could not load');
 expect(errors).toEqual([]);
});

test('the complete native vehicle verifies and loads when Web Crypto is unavailable',async({page},testInfo)=>{
 test.setTimeout(900000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 // Emulate the missing API on HTTP LAN origins. This localhost test does not
 // establish physical-phone or real insecure-origin network performance.
 await page.addInitScript(()=>Object.defineProperty(globalThis.crypto,'subtle',{configurable:true,value:undefined}));
 await page.goto('/',{timeout:600000});
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true'||document.querySelector('#render-status')?.textContent.includes('unavailable'),null,{timeout:600000});
 await expect(page.locator('#render-status')).not.toContainText('unavailable');
 const evidence=await page.evaluate(()=>({subtleAvailable:!!globalThis.crypto?.subtle,loading:window.__fiero.getLoadingStats(),distributor:window.__fiero.getPartBounds('distributor')}));
 expect(evidence.subtleAvailable).toBe(false);expect(evidence.loading.vehicleDelivery).toBe('prebuilt-native-stream');
 expect(evidence.loading.initialization.vehicleAsset.verifyMethod).toBe('portable');expect(evidence.loading.initialization.vehicleAsset.streaming.bytesConsumed).toBe(vehicleManifest.decodedBytes);expect(evidence.loading.initialization.vehicleAsset.streaming.groupsDecoded).toBe(vehicleManifest.parts);expect(evidence.loading.initialization.vehicleAsset.streaming.meshesDecoded).toBe(vehicleManifest.meshes);expect(evidence.distributor).not.toBeNull();
 await testInfo.attach('portable-integrity-loading',{body:Buffer.from(JSON.stringify(evidence,null,2)),contentType:'application/json'});
 await page.screenshot({path:testInfo.outputPath('portable-integrity-complete-vehicle.png')});expect(errors).toEqual([]);
});
