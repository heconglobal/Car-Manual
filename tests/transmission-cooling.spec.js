import {test,expect} from '@playwright/test';
import {detailMembers} from '../src/inspection-catalog.js';

test('four-speed internals, cooling circuit and US left-hand-drive layout remain coherent',async({page})=>{
 test.setTimeout(540000);
 const errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');await page.waitForFunction(()=>window.__fiero);
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const capture=async name=>{await settle();await page.screenshot({path:`artifacts/${name}.png`});console.log('Captured '+name);};
 const bounds=await page.evaluate(()=>Object.fromEntries(['steering-wheel','master-cylinder','gearbox','battery','thermostat','coolant-reservoir'].map(id=>[id,window.__fiero.getPartBounds(id)])));
 for(const id of ['steering-wheel','gearbox'])expect(bounds[id].max[0]).toBeLessThan(0);
 for(const id of ['battery','thermostat','coolant-reservoir'])expect(bounds[id].min[0]).toBeGreaterThan(0);
 expect((bounds['master-cylinder'].min[0]+bounds['master-cylinder'].max[0])/2).toBeLessThan(0); // This vehicle group also contains cross-car brake lines.
 await expect(page.locator('#drive-layout')).toContainText('US LEFT-HAND DRIVE');
 await page.locator('#systems [data-system="drivetrain"]').click();await page.locator('.part-button[data-part="gearbox"]').click();
 await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();
 await expect(page.locator('canvas')).toHaveAttribute('data-assembly','transmission');
 await expect(page.locator('.part-button')).toHaveCount(detailMembers('transmission').length);
 await expect(page.locator('#stage-kicker')).toContainText('FOUR-SPEED');
 await expect(page.locator('#explode')).toHaveAccessibleName('Transmission exploded view');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('transmission-assembled');
 const before=await page.evaluate(()=>window.__fiero.getPartBounds('tx-case'));
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await settle();
 const after=await page.evaluate(()=>window.__fiero.getPartBounds('tx-case'));
 expect(after.min[0]-before.min[0]).toBeCloseTo(-.63,3);await capture('transmission-exploded');
 for(const [scope,name] of [['trans-input','transmission-input'],['trans-differential','transmission-differential'],['trans-clutch','transmission-clutch']]){
  await page.locator(`#systems [data-assembly="${scope}"]`).click();
  expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers(scope).map(p=>p.id).sort());
  await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture(name+'-assembled');
  await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture(name+'-exploded');
 }
 await page.locator('.part-button[data-part="tx-disc"]').click();
 await expect(page.locator('#inspector-content')).toContainText('1985–86 V6');
 await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('transmission-clutch-disc');
 expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['tx-disc']);
 // Switch family without losing the saved complete-vehicle context.
 await page.locator('#systems [data-assembly="cooling-system"]').click();
 await expect(page.locator('.part-button')).toHaveCount(detailMembers('cooling-system').length);
 await expect(page.locator('#explode')).toHaveAccessibleName('Cooling exploded view');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('cooling-complete-circuit');
 await page.locator('#systems [data-assembly="cool-radiator"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('cooling-radiator-assembled');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('cooling-radiator-exploded');
 await page.locator('.part-button[data-part="cool-fan-blade"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await capture('cooling-fan-blade');
 await page.locator('#systems [data-assembly="cool-pipes"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
 const pipeBounds=await page.evaluate(()=>Object.fromEntries(['cool-pipe-left','cool-pipe-right','cool-crossover'].map(id=>[id,window.__fiero.getPartBounds(id)])));
 expect(pipeBounds['cool-pipe-left'].max[0]).toBeLessThan(0);expect(pipeBounds['cool-pipe-right'].min[0]).toBeGreaterThan(0);expect(pipeBounds['cool-crossover'].min[0]).toBeLessThan(0);expect(pipeBounds['cool-crossover'].max[0]).toBeGreaterThan(0);
 await page.locator('#systems [data-assembly="engine"]').click();await expect(page.locator('.part-button')).toHaveCount(detailMembers('engine').length);
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();
 await expect(page.locator('canvas')).toHaveAttribute('data-selected','gearbox');
 expect(await page.evaluate(()=>window.__fiero.getState().system)).toBe('drivetrain');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.locator('[data-tab="config"]').click();await page.getByRole('button',{name:'Cabin',exact:true}).click();await page.locator('[data-view="top"]').click();await capture('vehicle-lhd-cockpit');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await capture('vehicle-after-transmission-cooling');
 // Visually review the driver-seat ordering and lettering after conversion.
 await page.locator('[data-tab="config"]').click();await page.getByRole('button',{name:'Cabin',exact:true}).click();
 expect(await page.evaluate(()=>window.__fiero.getState().camera)).toBe('cabin');await capture('lhd-driver-seat');
 await page.locator('[data-view="front"]').click();await capture('lhd-controls-from-front');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.locator('[data-view="rear"]').click();await capture('lhd-rear-lettering');
 await page.locator('#systems [data-system="engine"]').click();await page.locator('.part-button[data-part="intake"]').click();await page.locator('[data-action="isolate"]').click();await page.locator('[data-view="top"]').click();await settle();await page.locator('[data-action="focus"]').click();await capture('lhd-intake-lettering');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.locator('[data-view="side"]').click();await capture('lhd-driver-side');
 await page.locator('[data-view="passenger"]').click();await capture('lhd-passenger-side');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 // Global discovery and all six view controls on a small mobile screen.
 await page.setViewportSize({width:390,height:700});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('radiator fan blade');
 await page.locator('.part-button[data-part="cool-fan-blade"]').click();await expect(page.locator('canvas')).toHaveAttribute('data-assembly','cool-radiator');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/);
 const overlap=await page.evaluate(()=>{const a=document.querySelector('.view-tools').getBoundingClientRect(),b=document.querySelector('.camera-views').getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});expect(overlap).toBe(false);
 await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await settle();await page.screenshot({path:'artifacts/cooling-mobile.png',fullPage:true});
 expect(errors).toEqual([]);expect(images).toEqual([]);
});
