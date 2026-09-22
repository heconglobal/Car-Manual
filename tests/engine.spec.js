import {test,expect} from '@playwright/test';
import {engineParts,engineMembers} from '../src/engine-catalog.js';

test('engine has independent explosion, selectable internals, subassembly navigation and vehicle return',async({page})=>{
 test.setTimeout(300000);
 const errors=[],images=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');await page.waitForFunction(()=>window.__fiero);
 await page.locator('#explode').fill('25');
 await page.getByRole('searchbox').fill('cylinder block');
 await page.locator('.part-button[data-part="engine-block"]').click();
 const prior=await page.evaluate(()=>window.__fiero.getState());
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();
 await expect(page.locator('canvas')).toHaveAttribute('data-assembly','engine');
 await expect(page.locator('.part-button')).toHaveCount(engineParts.length);
 expect(await page.evaluate(()=>window.__fiero.getVisibleParts().length)).toBe(engineParts.length);
 const missing=await page.evaluate(ids=>ids.filter(id=>!window.__fiero.getPartBounds(id)),engineParts.map(p=>p.id));expect(missing).toEqual([]);
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const assembled=await page.evaluate(()=>window.__fiero.getPartBounds('eng-plenum'));
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const exploded=await page.evaluate(()=>window.__fiero.getPartBounds('eng-plenum'));
 expect(exploded.min[1]-assembled.min[1]).toBeGreaterThan(.9);
 expect(await page.evaluate(()=>window.__fiero.getState().explode)).toBe(.25);
 // Focus the plenum, select a different item without moving the camera, then
 // pick the visible plenum in the canvas. This exercises mesh selection.
 await page.locator('.part-button[data-part="eng-plenum"]').click();
 await page.getByRole('button',{name:'Focus part',exact:true}).click();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.locator('.part-button[data-part="eng-crankshaft"]').click();
 const rect=await page.locator('canvas').boundingBox();let picked=false;
 for(const [x,y] of [[.50,.50],[.50,.48],[.48,.50],[.52,.50]]){
  await page.mouse.click(rect.x+rect.width*x,rect.y+rect.height*y);
  picked=await page.evaluate(()=>window.__fiero.getState().selected==='eng-plenum');if(picked)break;
 }
 expect(picked).toBe(true);
 await page.getByRole('searchbox').fill('crankshaft');
 await page.locator('.part-button[data-part="eng-crankshaft"]').click();
 await page.getByRole('button',{name:'Isolate',exact:true}).click();
 expect(await page.evaluate(()=>window.__fiero.getVisibleParts())).toEqual(['eng-crankshaft']);
 await page.getByRole('button',{name:'Show context',exact:true}).click();
 await page.locator('#systems [data-assembly="head-front"]').click();
 await expect(page.locator('.part-button')).toHaveCount(engineMembers('head-front').length);
 const visible=await page.evaluate(()=>window.__fiero.getVisibleParts());
 expect(visible.sort()).toEqual(engineMembers('head-front').map(p=>p.id).sort());
 await page.getByRole('searchbox').fill('intake valve');
 await page.locator('.part-button[data-part="eng-valve-front-1-intake"]').click();
 await expect(page.locator('.component-heading')).toContainText('intake valve');
 await page.getByRole('button',{name:'Reset view',exact:true}).click();
 await expect(page.locator('#explode')).toHaveValue('0');
 await expect(page.locator('canvas')).toHaveAttribute('data-assembly','head-front');
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();
 const returned=await page.evaluate(()=>window.__fiero.getState());
 expect(returned.assembly).toBeNull();expect(returned.selected).toBe(prior.selected);expect(returned.explode).toBe(.25);expect(returned.query).toBe(prior.query);
 await expect(page.locator('#explode')).toHaveValue('25');
 expect(errors).toEqual([]);expect(images).toEqual([]);
});

test('engine explorer supports mobile navigation and return without overflow',async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width:390,height:844});
 await page.goto('/');await page.waitForFunction(()=>window.__fiero);
 await page.getByRole('button',{name:'Explore engine components',exact:true}).click();
 await page.getByRole('button',{name:'Open assemblies',exact:true}).click();
 await page.locator('#systems [data-assembly="timing"]').click();
 await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/);
 await expect(page.locator('canvas')).toHaveAttribute('data-assembly','timing');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();
 await page.screenshot({path:'artifacts/engine-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();
 await expect(page.locator('canvas')).toHaveAttribute('data-assembly','');
});
