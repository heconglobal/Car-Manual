import {test,expect} from '@playwright/test';
import {detailMembers,detailAvailable} from '../src/inspection-catalog.js';
import {defaultConfiguration} from '../src/configuration.js';
import {fusePositions} from '../src/wiring-catalog.js';

test('lighting and charging assemblies expose native parts, option lamps and correct lamp interfaces',async({page})=>{
 test.setTimeout(900000);page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(240000);
 const errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:240000});
 const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.getByRole('searchbox').fill('Delco Freedom battery');await page.locator('.part-button[data-part="ch-battery-case"]').click();
 for(const scope of ['charging-battery','charging-starter','charging-alternator']){
  await page.locator(`#systems [data-assembly="${scope}"]`).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
  expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers(scope).map(p=>p.id).sort());
  const first=detailMembers(scope).find(p=>p.spread.some(Boolean));const before=await page.evaluate(id=>window.__fiero.getPartBounds(id),first.id);await page.locator('#explode').fill('100');await settle();const after=await page.evaluate(id=>window.__fiero.getPartBounds(id),first.id);expect(after).not.toEqual(before);
 }
 await page.locator('.part-button[data-part="ch-alt-rotor"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['ch-alt-rotor']);
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('searchbox').fill('LH reading lens');await page.locator('.part-button[data-part="lt-dome-left-map-lens"]').click();
 for(const scope of ['lighting-dome','lighting-front-left','lighting-rear-left','lighting-marker-front-left','lighting-license-left','lighting-console']){
  await page.locator(`#systems [data-assembly="${scope}"]`).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers(scope).filter(p=>detailAvailable(p,defaultConfiguration)).map(p=>p.id).sort());await page.locator('#explode').fill('100');await settle();
 }
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('[data-config="lampGroup"]').check();await page.locator('[data-tab="component"]').click();await page.locator('#systems [data-assembly="lighting-courtesy"]').click();expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).length).toBe(12);
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator('[data-config="lampGroup"]').uncheck();await expect(page.locator('canvas')).toHaveAttribute('data-assembly','lighting-system');expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers('lighting-system').filter(p=>detailAvailable(p,defaultConfiguration)).map(p=>p.id).sort());expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).some(id=>id.startsWith('lt-courtesy-'))).toBe(false);expect(errors).toEqual([]);expect(images).toEqual([]);
});

test('1985 fuse layout, ECM connectors, flashers and verified EST circuits are inspectable on desktop and mobile',async({page})=>{
 test.setTimeout(900000);page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(240000);
 const errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true',null,{timeout:240000});
 const shot=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:'artifacts/'+name+'.png'});};
 await page.getByRole('searchbox').fill('Fuse-block molded carrier');await page.locator('.part-button[data-part="wr-fuse-carrier"]').click();await page.getByRole('button',{name:'Reset view',exact:true}).click();
 expect((await page.evaluate(()=>window.__fiero.getPartBounds('wr-fuse-carrier'))).max[0]).toBeLessThan(0);await shot('wiring-fuses-assembled');
 for(const f of fusePositions){await page.locator(`.part-button[data-part="wr-fuse-${f.number}"]`).click();await expect(page.locator('.part-service-reference')).toContainText(`${f.amps} A`);await expect(page.locator('.part-service-reference')).toContainText(f.label);}
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot('wiring-fuses-exploded');
 for(const scope of ['wiring-ecm','wiring-junction','wiring-flashers','wiring-cluster']){
  await page.locator(`#systems [data-assembly="${scope}"]`).click();await page.getByRole('button',{name:'Reset view',exact:true}).click();expect((await page.evaluate(()=>window.__fiero.getVisibleParts())).sort()).toEqual(detailMembers(scope).map(p=>p.id).sort());await shot(scope+'-assembled');if(scope==='wiring-flashers'){ expect((await page.evaluate(()=>window.__fiero.getPartBounds('wr-turn-flasher'))).max[0]).toBeLessThan(0);expect((await page.evaluate(()=>window.__fiero.getPartBounds('wr-hazard-flasher'))).min[0]).toBeGreaterThan(0);}await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await shot(scope+'-exploded');
 }

 await page.locator('.part-button[data-part="wr-cluster-oil-face"]').click();await expect(page.locator('.part-service-reference')).toContainText('Tachometer with oil-pressure gauge');
 const gauges=await page.evaluate(()=>Object.fromEntries(['speed-face','tach-face','oil-face','temperature-face','fuel-face'].map(k=>[k,window.__fiero.getPartBounds('wr-cluster-'+k)])));
 expect(gauges['speed-face'].max[0]).toBeLessThan(gauges['tach-face'].min[0]);expect(gauges['temperature-face'].min[1]).toBeGreaterThan(gauges['fuel-face'].min[1]);
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.getByRole('searchbox').fill('circuit 430');await page.locator('.part-button[data-part="eng-est-c"]').click();await expect(page.locator('.part-service-reference')).toContainText('Purple / white');await expect(page.locator('.part-service-reference')).toContainText('ECM B5');await page.getByRole('button',{name:'Isolate',exact:true}).click();expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['eng-est-c']);await shot('ignition-est-reference-lead');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await page.setViewportSize({width:390,height:700});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('ECM C510');await page.locator('.part-button[data-part="wr-ecm-plug-cd"]').click();await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await shot('wiring-ecm-mobile');expect(errors).toEqual([]);expect(images).toEqual([]);
});
