import { test, expect } from '@playwright/test';
import { parts, sources } from '../src/data.js';

test('renders 3D vehicle without runtime errors or external image requests',async({page})=>{
 const errors=[];const images=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');await expect(page.locator('#viewport canvas')).toBeVisible();await page.waitForFunction(count=>window.__fiero?.partCount===count,parts.length);
 await page.waitForTimeout(1600);expect(errors).toEqual([]);expect(images).toEqual([]);
 const pixels=await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2');const arr=new Uint8Array(4*50*50);gl.readPixels(Math.floor(c.width/2)-25,Math.floor(c.height/2)-25,50,50,gl.RGBA,gl.UNSIGNED_BYTE,arr);return new Set(arr).size;});expect(pixels).toBeGreaterThan(10);
 await page.screenshot({path:'artifacts/desktop-overview.png'});
});

test('system filtering, global search, focus, isolation and reset work',async({page})=>{
 // Includes nine separately rendered systems on the software WebGL runner.
 test.setTimeout(360000);
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();
 for(const id of ['body','engine','drivetrain','suspension','brakes','cooling','fuel','electrical','interior']){
  await page.locator(`[data-system="${id}"]`).click();await expect(page.locator('canvas')).toHaveAttribute('data-system',id);expect(await page.locator('.part-button').count()).toBeGreaterThan(0);
 }
 await page.getByRole('searchbox').fill('radiator');await expect(page.locator('.part-button')).toHaveCount(2);
 await page.locator('.part-button[data-part="radiator"]').click();await expect(page.locator('.component-heading')).toContainText('Radiator & fan');await expect(page.locator('canvas')).toHaveAttribute('data-selected','radiator');
 await page.getByRole('button',{name:'Isolate',exact:true}).click();expect(await page.evaluate(()=>window.__fiero.getModelState().isolate)).toBe(true);
 await page.getByRole('button',{name:'Show context',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();
 await page.getByRole('button',{name:'Reset view',exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-system','all');await expect(page.locator('canvas')).toHaveAttribute('data-selected','');await expect(page.getByRole('searchbox')).toHaveValue('');
 await page.getByRole('searchbox').fill('nonexistent-part-xyz');await expect(page.locator('.empty-state')).toBeVisible();await page.locator('#clear-search').click();await expect(page.locator('.part-button')).toHaveCount(parts.length);
});

test('camera presets and keyboard controls update the viewer',async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();
 for(const view of ['front','rear','side','top','home']){await page.locator(`[data-view="${view}"]`).click();await expect(page.locator(`[data-view="${view}"]`)).toHaveAttribute('aria-pressed','true');}
 await page.locator('canvas').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('+');
});

test('visibility, labels, wireframe and exploded views work',async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();
 for(const [action,key] of [['body','hideBody'],['labels','labels'],['wireframe','wireframe']]){await page.locator(`[data-action="${action}"]`).click();expect(await page.evaluate(k=>window.__fiero.getModelState()[k],key)).toBe(true);await page.locator(`[data-action="${action}"]`).click();}
 await page.locator('#explode').fill('65');await expect(page.locator('#explode-value')).toHaveText('65%');expect(await page.evaluate(()=>window.__fiero.getModelState().explode)).toBe(.65);
 await page.locator('[data-action="body"]').click();await page.waitForTimeout(1500);await page.screenshot({path:'artifacts/exploded-chassis.png'});
});

test('direct 3D picking selects a part',async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.waitForTimeout(1200);
 const rect=await page.locator('canvas').boundingBox();let selected=false;
 for(const [x,y] of [[.50,.51],[.52,.57],[.45,.55],[.60,.55],[.42,.48]]){await page.mouse.click(rect.x+rect.width*x,rect.y+rect.height*y);selected=await page.evaluate(()=>!!window.__fiero.getState().selected);if(selected)break;}
 expect(selected).toBe(true);await expect(page.locator('.component-heading')).toBeVisible();
});

for(const id of ['orientation','air-cleaner','suspension'])test(`${id} tour advances, goes back, and finishes`,async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();
  await page.locator('[data-tab="tours"]').click();await page.locator(`#inspector-content [data-tour="${id}"]`).click();await expect(page.locator('.tour-progress .current')).toHaveText('1');
  await expect(page.locator('.notice')).toContainText('not a validated repair procedure');
  await page.locator('[data-action="next-step"]').click();await page.locator('[data-action="prev-step"]').click();await expect(page.locator('.tour-progress .current')).toHaveText('1');
  for(let i=1;i<5;i++)await page.locator('[data-action="next-step"]').click();await expect(page.locator('.tour-progress .current')).toHaveText('5');await page.locator('[data-action="next-step"]').click();await expect(page.locator('.tour-card')).toHaveCount(3);
});

test('specification provenance and source dialog remain accessible',async({page})=>{
 await page.goto('/');await page.locator('[data-tab="specs"]').click();await expect(page.locator('#inspector-content')).toContainText('Pending factory verification');await expect(page.locator('#inspector-content')).toContainText('2.8 litres');
 await expect(page.locator('#inspector-content')).toContainText('2,373 mm');await expect(page.locator('#inspector-content')).toContainText('Factory DIY');
 await page.getByRole('button',{name:'View sources & coverage'}).click();await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('.source-card')).toHaveCount(sources.length);await expect(page.locator('dialog')).toContainText('have not yet been imported or verified');await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
 await page.getByRole('searchbox').fill('plenum');await page.locator('.part-button[data-part="intake"]').click();await expect(page.locator('#inspector-content')).toContainText('10033120');await expect(page.locator('#inspector-content')).toContainText('1985–86 L44');
});

test('UAT feedback persists, is safely rendered, and exports valid JSON',async({page})=>{
 await page.goto('/');await page.locator('[data-tab="uat"]').click();await page.locator('[data-check="0"]').check();await page.locator('#feedback').fill('<script>window.compromised=true</script> Orbit is smooth.');await page.getByRole('button',{name:'Save note',exact:true}).click();await expect(page.locator('.saved-notes')).toContainText('<script>');expect(await page.evaluate(()=>window.compromised)).toBeUndefined();
 await page.reload();await page.locator('[data-tab="uat"]').click();await expect(page.locator('[data-check="0"]')).toBeChecked();await expect(page.locator('.saved-notes')).toContainText('Orbit is smooth.');
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="export"]').click();const download=await downloadPromise;expect(download.suggestedFilename()).toBe('fiero-uat-feedback.json');const stream=await download.createReadStream();let body='';for await(const chunk of stream)body+=chunk;const data=JSON.parse(body);expect(data.notes).toHaveLength(1);expect(data.checkedItems).toHaveLength(1);expect(data.vehicle.vin).toBe('1G2PF3796FP217611');
});

test('mobile layout renders without overflow and opens assembly navigation',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Open assemblies'}).click();await expect(page.locator('.sidebar')).toHaveClass(/mobile-open/);await page.getByRole('searchbox').fill('air filter');await page.locator('.part-button[data-part="air-filter"]').click();await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/);await expect(page.locator('.component-heading')).toContainText('Air filter element');await page.waitForTimeout(1200);await page.screenshot({path:'artifacts/mobile-explorer.png',fullPage:true});
});
