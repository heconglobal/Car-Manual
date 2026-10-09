import {waitForViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
import vehicleManifest from '../src/vehicle-manifest.js';
import detailManifest from '../src/detail-manifest.js';
const ready=async page=>{await page.goto('/',{timeout:600000});await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas')?.dataset.ready==='true'||document.querySelector('#render-status')?.textContent.includes('unavailable'),null,{timeout:600000});await expect(page.locator('#render-status')).not.toContainText('unavailable');await waitForViewer(page);};
const open=async(page,scope)=>{if(scope==='wiper-motor'&&!await page.locator(`#systems [data-assembly="${scope}"]`).count()){await page.getByRole('searchbox').fill('Armature, commutator');await page.locator('.part-button[data-part="ww-motor-armature"]').click();}else await page.locator(`#systems [data-assembly="${scope}"]`).click();await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly',scope);await page.evaluate(()=>window.__fiero.whenIdle());};
const stats=page=>page.evaluate(()=>window.__fiero.getLoadingStats());
const resident=(current,initial)=>{
 expect(current.strategy).toBe('persistent');expect(current.models).toBe(initial.models);expect([...current.detailFamilies].sort()).toEqual([...initial.detailFamilies].sort());
 expect(current.initialization.completed).toBe(current.initialization.total);expect(current.initialization.total).toBeGreaterThan(0);
 expect(current.initialization.buildCount).toBe(initial.initialization.buildCount);expect(current.geometryBytes).toBe(initial.geometryBytes);
 expect(current.loading).toBe(false);expect(current.lastError).toBeNull();
};

test('startup completes the whole vehicle and preloads explorer modules and native assets',async({page},testInfo)=>{
 test.setTimeout(900000);
 const requested=[],errors=[];page.on('request',request=>requested.push(request.url()));page.on('pageerror',e=>errors.push(e.message));await ready(page);
 const initial=await stats(page);resident(initial,initial);expect(initial.models).toBe(1);expect(initial.detailFamilies).toEqual([]);expect(initial.initialization.buildCount).toBe(1);expect(initial.level).toBe('vehicle:all');expect(initial.vehicleChunk).toBe('all');expect(initial.overviewSource).toBe('native-full');expect(initial.labelCount).toBe(0);
 expect(initial.vehicleDelivery).toBe('prebuilt-native-stream');expect(requested.filter(url=>new URL(url).pathname===vehicleManifest.url)).toHaveLength(1);
 const asset=initial.initialization.vehicleAsset;expect(asset.compressedBytes).toBe(vehicleManifest.bytes);expect(asset.decodedBytes).toBe(vehicleManifest.decodedBytes);expect(asset.streaming.bytesConsumed).toBe(vehicleManifest.decodedBytes);expect(asset.streaming.groupsDecoded).toBe(vehicleManifest.parts);expect(asset.streaming.meshesDecoded).toBe(vehicleManifest.meshes);expect(asset.streaming.maxChunkBytes).toBeLessThanOrEqual(1024*1024);expect(asset.streaming.yields).toBeGreaterThan(0);
 for(const module of ['transmission-detail','brake-detail','cooling-detail','wiring-detail','charging-detail','fuel-detail','exhaust-detail','suspension-detail','wiper-detail','spare-detail','interior-detail','lighting-detail','headlight-detail','hvac-detail'])expect(requested.some(url=>url.includes('/src/'+module+'.js')),module+' loaded before ready').toBe(true);
 expect(initial.detailAssets.pendingFamilies).toEqual([]);
 for(const family of ['body-system','engine']){
  const entry=detailManifest.families[family],loaded=initial.detailAssets.families[family];
  expect(requested.filter(url=>new URL(url).pathname===entry.url),family+' downloaded once before ready').toHaveLength(1);
  expect(loaded.source).toBe('prebuilt-native');expect(loaded.encodedBytes).toBe(entry.bytes);expect(loaded.decodedBytes).toBe(entry.decodedBytes);expect(loaded.bufferedBytes).toBeGreaterThan(0);expect(loaded.decodeMs).toBeNull();
 }
 const bounds=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),['distributor','steering-wheel','master-cylinder','gearbox','battery','thermostat','coolant-reservoir']);
 for(const [id,bound]of Object.entries(bounds)){expect(bound,id+' present on initial complete vehicle').not.toBeNull();expect([...bound.min,...bound.max].every(Number.isFinite),id+' finite bounds').toBe(true);}
 for(const id of ['steering-wheel','gearbox'])expect(bounds[id].max[0]).toBeLessThan(0);
 for(const id of ['battery','thermostat','coolant-reservoir'])expect(bounds[id].min[0]).toBeGreaterThan(0);
 expect((bounds['master-cylinder'].min[0]+bounds['master-cylinder'].max[0])/2).toBeLessThan(0);
 await page.screenshot({path:testInfo.outputPath('complete-vehicle.png')});expect(errors).toEqual([]);
});

test('detailed families build once and remain cached across navigation without model fetches',async({page})=>{
 test.setTimeout(900000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
 const initial=await stats(page),requests=[];page.on('request',request=>{if(/\/src\/.*\.js(?:\?|$)|\/models\/.*\.(?:bin\.gz|fiero)(?:\?|$)/.test(request.url()))requests.push(request.url());});
 await open(page,'wiper-motor');const first=await stats(page);expect(first.models).toBe(initial.models+1);expect(first.detailFamilies).toEqual(['wiper-system']);expect(first.initialization.buildCount).toBe(initial.initialization.buildCount+1);expect(first.geometryBytes).toBeGreaterThan(initial.geometryBytes);expect(first.level).toBe('detail:wiper-system');
 const armature=await page.evaluate(()=>window.__fiero.getPartBounds('ww-motor-armature'));expect(armature).not.toBeNull();expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toContain('ww-motor-armature');
 await open(page,'spare-system');const second=await stats(page);expect(second.models).toBe(first.models+1);expect([...second.detailFamilies].sort()).toEqual(['spare-system','wiper-system']);expect(second.initialization.buildCount).toBe(first.initialization.buildCount+1);expect(second.geometryBytes).toBeGreaterThan(first.geometryBytes);expect(second.level).toBe('detail:spare-system');
 expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toContain('sp-valve-cap');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await waitForViewer(page);
 const returned=await stats(page);resident(returned,second);expect(returned.level).toBe('vehicle:all');expect(returned.labelCount).toBe(0);
 await open(page,'wiper-motor');resident(await stats(page),second);expect(await page.evaluate(()=>window.__fiero.getPartBounds('ww-motor-armature'))).toEqual(armature);
 await open(page,'spare-system');await page.locator('.part-button[data-part="sp-valve-cap"]').click();await waitForViewer(page);
 await expect(page.locator('canvas')).toHaveAttribute('data-selected','sp-valve-cap');await expect(page.locator('canvas')).toHaveAttribute('data-assembly','spare-system');resident(await stats(page),second);
 expect(requests).toEqual([]);expect(errors).toEqual([]);
});
