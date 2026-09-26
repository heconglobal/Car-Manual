import {test,expect} from '@playwright/test';
import {exteriorParts} from '../src/exterior-catalog.js';

test('revised exterior renders from every side and keeps independent option geometry',async({page})=>{
 test.setTimeout(480000);page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(240000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');
 await page.waitForFunction(()=>document.querySelector('canvas').dataset.lighting==='hdr');
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 for(const view of ['home','front','side','passenger','rear','top']){
  const button=page.locator(`[data-view="${view}"]`);await expect(button).toHaveCount(1);
  await button.click();await settle();await page.locator('#viewport').screenshot({path:`artifacts/exterior-v3-${view}.png`});console.log('Exterior view '+view);
 }
 const bounds=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),exteriorParts.filter(p=>!p.option&&p.id!=='sunroof-seal').map(p=>p.id));
 for(const p of exteriorParts.filter(p=>!p.option&&p.id!=='sunroof-seal')){expect(bounds[p.id],p.id).not.toBeNull();expect(bounds[p.id].max.every(Number.isFinite)).toBe(true);}
 expect(bounds.antenna.min[0]).toBeGreaterThan(0);
 expect(bounds['fuel-door'].max[0]).toBeLessThan(0);
 expect(errors).toEqual([]);
});

test('exterior service pieces select, isolate, explode and return on desktop and mobile',async({page})=>{
 test.setTimeout(480000);page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(240000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');
 for(const [id,scope]of [['mirror-left','body-door-left'],['front-pad-left','body-front-panels'],['fuel-door','body-rear-panels'],['wiper-blade-left','body-glazing']]){
  await page.getByRole('searchbox').fill(exteriorParts.find(p=>p.id===id).name);await page.locator(`.part-button[data-part="${id}"]`).click();
  await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-assembly',scope);
  await page.locator(`.part-button[data-part="bd-skin-${id}"]`).click();const assembled=await page.evaluate(id=>window.__fiero.getPartBounds('bd-skin-'+id),id);await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await expect.poll(async()=>{const exploded=await page.evaluate(id=>window.__fiero.getPartBounds('bd-skin-'+id),id);return Math.hypot(...exploded.min.map((v,i)=>v-assembled.min[i]));},{timeout:30000}).toBeGreaterThan(.04);await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();
  expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['bd-skin-'+id]);
  await page.screenshot({path:`artifacts/exterior-v3-isolated-${id}.png`});
  await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.getByRole('searchbox').fill('');
 }
 await page.getByRole('searchbox').fill('Front fascia');await page.locator('.part-button[data-part="nose"]').click();await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await page.screenshot({path:'artifacts/exterior-v3-front-exploded.png'});
 await page.locator('#systems [data-assembly="body-door-left"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await page.screenshot({path:'artifacts/exterior-v3-door-exploded.png'});
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.setViewportSize({width:390,height:740});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('Driver quarter air-intake grille');await page.locator('.part-button[data-part="side-intake"]').click();await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-rear-panels');
 await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.locator('.part-button[data-part="bd-skin-side-intake"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await page.screenshot({path:'artifacts/exterior-v3-mobile-intake.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});

test('exterior roof and deck alternatives render independently',async({page})=>{
 test.setTimeout(300000);page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(240000);await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.getByRole('button',{name:'Configure',exact:true}).click();await expect(page.locator('.part-button[data-part="sunroof-glass"]')).toHaveCount(0);await page.locator('#config-deck').selectOption('rack');await page.locator('#config-roof').selectOption('glass');await page.locator('[data-config="headlights"]').check();
 await page.locator('[data-view="rear"]').click();await settle();await page.locator('#viewport').screenshot({path:'artifacts/exterior-v3-carrier.png'});
 await page.locator('[data-view="home"]').click();await settle();await page.locator('#viewport').screenshot({path:'artifacts/exterior-v3-raised.png'});
 await page.locator('#config-deck').selectOption('wing');expect(await page.evaluate(()=>window.__fiero.getPartBounds('deck-carrier'))).toBeNull();expect(await page.evaluate(()=>window.__fiero.getPartBounds('deck-wing'))).not.toBeNull();await page.locator('[data-view="rear"]').click();await settle();await page.locator('#viewport').screenshot({path:'artifacts/exterior-v3-wing.png'});

});
