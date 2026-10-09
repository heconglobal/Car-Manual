import {waitForViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {Matrix4,Vector3} from 'three';

test('mobile viewer keeps essential controls reachable and secondary tools compact',async({page},testInfo)=>{
 test.setTimeout(900000);page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(600000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const captureDir=testInfo.outputPath('mobile-controls');await mkdir(captureDir,{recursive:true});
 const ready=async()=>{await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});await page.evaluate(()=>window.__fiero.whenIdle());};
 const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const capture=async name=>{await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:`${captureDir}/${name}.png`,fullPage:true});};
 const framed=async(ids)=>{
  await waitForViewer(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const snapshot=await page.evaluate(ids=>({camera:window.__fiero.getCamera(),bounds:(ids||window.__fiero.getVisibleParts()).map(id=>({id,bounds:window.__fiero.getPartBounds(id)}))}),ids);
  const {camera}=snapshot,rect=camera.safeViewport,projection=new Matrix4().fromArray(camera.projectionMatrix).multiply(new Matrix4().fromArray(camera.matrixWorldInverse));
  expect(rect.mobile).toBe(true);const viewport=page.viewportSize();expect(rect.bottom-rect.top).toBeGreaterThan(viewport.height>viewport.width?180:80);
  const tools=await page.locator('.view-tools').boundingBox(),explode=await page.locator('.explode-control').boundingBox();expect(tools.x+tools.width).toBeLessThanOrEqual(explode.x);
  for(const {id,bounds} of snapshot.bounds){expect(bounds,id).not.toBeNull();for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]){
   const p=new Vector3(x,y,z).applyMatrix4(projection),px=(p.x+1)*rect.width/2,py=(1-p.y)*rect.height/2;
   expect(px,`${id} left clear edge`).toBeGreaterThanOrEqual(rect.left-1);expect(px,`${id} right clear edge`).toBeLessThanOrEqual(rect.right+1);
   expect(py,`${id} below title/tools`).toBeGreaterThanOrEqual(rect.top-1);expect(py,`${id} above bottom controls`).toBeLessThanOrEqual(rect.bottom+1);
  }}
 };
 const compactControls=async()=>{
  await expect(page.getByRole('group',{name:'Camera views'})).toBeHidden();
  for(const name of ['Open assemblies','Reset view','More view tools']){
   const button=page.getByRole('button',{name,exact:true});await expect(button).toBeVisible();
   const box=await button.boundingBox(),viewport=page.viewportSize();
   expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
   expect(box.x).toBeGreaterThanOrEqual(0);expect(box.y).toBeGreaterThanOrEqual(0);
   expect(box.x+box.width).toBeLessThanOrEqual(viewport.width);expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
  }
  await noOverflow();
 };
 await page.setViewportSize({width:320,height:740});await page.goto('/');await ready();
 await expect(page.getByRole('group',{name:'Camera views'})).toBeHidden();
 for(const action of ['body','labels','wireframe','fullscreen'])await expect(page.locator(`.view-tools [data-action="${action}"]`)).toBeHidden();
 for(const name of ['Open assemblies','Reset view','More view tools']){
  const button=page.getByRole('button',{name,exact:true});await expect(button).toBeVisible();
  const box=await button.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
 }
 await noOverflow();await framed();await capture('320-compact');
 for(const [width,height,label]of [[844,390,'844-landscape'],[768,1024,'768-tablet']]){
  await page.setViewportSize({width,height});await compactControls();
  if(height===390){
   expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
   const canvas=await page.locator('canvas').boundingBox();expect(canvas.height).toBeGreaterThanOrEqual(220);expect(canvas.y+canvas.height).toBeLessThanOrEqual(height);
  }
  await framed();await capture(label+'-compact');
  await page.getByRole('button',{name:'More view tools',exact:true}).click();
  await expect(page.getByRole('button',{name:'Wireframe',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Component labels',exact:true}).click();
  await expect(page.getByRole('button',{name:'More view tools',exact:true})).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button',{name:'More view tools',exact:true}).click();await page.getByRole('button',{name:'Component labels',exact:true}).click();
 }
 await page.setViewportSize({width:320,height:740});
 await page.getByRole('button',{name:'More view tools',exact:true}).click();
 await expect(page.getByRole('button',{name:'Close view tools',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('button',{name:'Wireframe',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'More view tools',exact:true})).toBeFocused();
 await expect(page.getByRole('button',{name:'Wireframe',exact:true})).toBeHidden();
 await page.getByRole('button',{name:'More view tools',exact:true}).click();await page.getByRole('button',{name:'Component labels',exact:true}).click();
 await expect(page.locator('[data-action="labels"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('button',{name:'More view tools',exact:true})).toHaveAttribute('aria-expanded','false');
 await page.getByRole('button',{name:'More view tools',exact:true}).click();await page.getByRole('button',{name:'Component labels',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'More view tools',exact:true}).click();await noOverflow();await capture('390-tools-open');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('Valve dust cap');await page.locator('.part-button[data-part="sp-valve-cap"]').click();
 await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','spare-wheel');await page.evaluate(()=>window.__fiero.whenIdle());
 await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/);await expect(page.locator('canvas')).toHaveAttribute('data-selected','sp-valve-cap');
 const back=page.getByRole('button',{name:'Back to vehicle',exact:false});await expect(back).toBeVisible();
 const checkHeadingSpacing=async()=>{
  const backBox=await back.boundingBox(),toolbarBox=await page.locator('.view-tools').boundingBox(),heading=await page.locator('#stage-subtitle').isVisible()?page.locator('#stage-subtitle'):page.locator('#stage-title'),headingBox=await heading.boundingBox();
  expect(headingBox.y+headingBox.height).toBeLessThanOrEqual(Math.min(backBox.y,toolbarBox.y));
  expect(backBox.y+backBox.height<=toolbarBox.y||backBox.x+backBox.width<=toolbarBox.x||toolbarBox.x+toolbarBox.width<=backBox.x).toBe(true);
 };
 await checkHeadingSpacing();await noOverflow();await framed(['sp-valve-cap']);await capture('390-selected-part');
 await page.setViewportSize({width:320,height:740});await checkHeadingSpacing();await noOverflow();await framed(['sp-valve-cap']);await capture('320-selected-part');
 for(const [width,height,label]of [[844,390,'844-landscape'],[768,1024,'768-tablet']]){
  await page.setViewportSize({width,height});await compactControls();await checkHeadingSpacing();await expect(back).toBeVisible();
  const backBox=await back.boundingBox();expect(backBox.y+backBox.height).toBeLessThanOrEqual(height);
  if(height===390)expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
  await framed(['sp-valve-cap']);await capture(label+'-selected-part');
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Guides',exact:true}).click();expect(await page.locator('.tour-card').count()).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Inspect',exact:true}).click();await back.click();await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','');await page.evaluate(()=>window.__fiero.whenIdle());
 await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await page.getByRole('searchbox').fill('Driver lower hinge pin');await page.locator('.part-button[data-part="bd-door-left-lower-pin"]').click();await waitForViewer(page);
 await page.locator('#inspector-content [data-action="isolate"]').click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await framed(['bd-door-left-lower-pin']);await page.locator('canvas').scrollIntoViewIfNeeded();await capture('390-hinge-pin');await back.click();await waitForViewer(page);
 // Guides frame a complete scope even though one instruction part is selected.
 for(const [tour,step,name] of [['headlight-replacement','8','390-headlamp-guide'],['coolant-replacement','18','390-thermostat-guide']]){
  await page.getByRole('button',{name:'Guides',exact:true}).click();await page.locator(`[data-tour="${tour}"]`).click();await waitForViewer(page);await page.locator(`.tour-progress [data-step="${step}"]`).click();
  await framed();await page.locator('canvas').scrollIntoViewIfNeeded();await capture(name);await page.locator('[data-action="exit-tour"]').click();
 }
 await page.setViewportSize({width:1440,height:1000});await expect(page.getByRole('group',{name:'Camera views'})).toBeVisible();await expect(page.getByRole('button',{name:'More view tools',exact:true})).toBeHidden();
 for(const action of ['body','labels','wireframe','fullscreen'])await expect(page.locator(`.view-tools [data-action="${action}"]`)).toBeVisible();
 await noOverflow();expect(errors).toEqual([]);
});
