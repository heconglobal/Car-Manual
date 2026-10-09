import {waitForViewer,evaluateViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {doorMechanismParts} from '../src/door-mechanism-catalog.js';

test('door mechanisms expose original-year window hardware and mutually exclusive manual, power and lock previews',async({page})=>{
 test.setTimeout(720000);page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(240000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const output='artifacts/completion-doors-browser/'+new Date().toISOString().replace(/[:.]/g,'-');await mkdir(output,{recursive:true});
 const capture=async name=>{await evaluateViewer(page,()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await waitForViewer(page);await page.screenshot({path:`${output}/${name}.png`});console.log(`Captured ${output}/${name}.png`);};
 const select=async id=>{
  const part=doorMechanismParts.find(part=>part.id===id);expect(part,id+' catalog identity').toBeTruthy();
  // Reset before selecting: resetting afterwards deliberately clears the
  // inspector and cannot test the selected component's factory attribution.
  if(await page.locator('.sidebar').evaluate(el=>el.classList.contains('mobile-open')))await page.getByRole('button',{name:'Close assemblies',exact:true}).click();
  // Reset keeps the current assembly, whose search is scoped to its members.
  // Return to vehicle before searching another side or mechanism scope.
  const currentScope=await page.locator('canvas').getAttribute('data-assembly');
  if(currentScope&&currentScope!==part.section){
   await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await waitForViewer(page);
   await expect(page.locator('canvas')).toHaveAttribute('data-assembly','');
  }
  await page.getByRole('button',{name:'Reset view',exact:true}).click();
  const menu=page.getByRole('button',{name:'Open assemblies',exact:true});if(await menu.isVisible())await menu.click();
  await page.getByRole('searchbox').fill(part.name);
  await page.locator(`.part-button[data-part="${id}"]`).click();await waitForViewer(page);
  await expect(page.locator('canvas')).toHaveAttribute('data-assembly',part.section);
  await expect(page.locator('canvas')).toHaveAttribute('data-selected',id);
 };
 const visible=()=>evaluateViewer(page,()=>window.__fiero.getVisibleParts());
 const expectScope=async(side,family,options={powerWindows:false,powerLocks:false})=>{
  const expected=doorMechanismParts.filter(part=>part.section===`body-door-${side}-${family}`&&(!part.option||part.value===options[part.option])).map(part=>part.id).sort();
  expect((await visible()).sort()).toEqual(expected);
 };
 const expectGeometry=async id=>{
  const bounds=await evaluateViewer(page,id=>window.__fiero.getPartBounds(id),id);expect(bounds,id+' has actual visible meshes').toBeTruthy();
  expect([...bounds.min,...bounds.max].every(Number.isFinite)).toBe(true);
  for(let axis=0;axis<3;axis++)expect(bounds.max[axis]-bounds.min[axis],id+' nonzero bounds').toBeGreaterThan(0);
  expect(id.includes('-left-')?bounds.max[0]<0:bounds.min[0]>0).toBe(true);
 };
 const config=async(key,value)=>{await page.getByRole('button',{name:'Configure',exact:true}).click();await page.locator(`[data-config="${key}"]`).setChecked(value);await page.locator('[data-tab="component"]').click();};
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:240000});
 await select('bd-door-left-manual-regulator');await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-door-left-window');
 let ids=await visible();await expectScope('left','window');expect(ids).toContain('bd-door-left-manual-regulator');expect(ids).not.toContain('bd-door-left-power-regulator');expect(ids).not.toContain('bd-door-left-window-motor');
 const bounds=await evaluateViewer(page,()=>window.__fiero.getPartBounds('bd-door-left-manual-regulator'));expect(bounds.max[0]).toBeLessThan(0);await capture('driver-manual-window');
 await page.getByRole('button',{name:'Explode assembly',exact:true}).click();await capture('driver-manual-window-exploded');
 for(const [key,number]of [['belt-trim-retainer','20352607'],['inner-belt-seal','20320535'],['power-lock-stop','20269755'],['outer-panel-block','20505072'],['front-panel-block','20505073']]){
  const id='bd-door-left-'+key;await select(id);await expect(page.locator('#inspector-content')).toContainText(number);await expectGeometry(id);
  await page.getByRole('button',{name:'Isolate',exact:true}).click();await waitForViewer(page);expect(await visible()).toEqual([id]);await expectGeometry(id);
  if(key==='power-lock-stop')await expect(page.locator('#inspector-content')).toContainText('Regulator variant unverified');
 }
 await select('bd-door-right-front-panel-block');await expectScope('right','panel');await expectGeometry('bd-door-right-front-panel-block');await expectGeometry('bd-door-right-outer-panel-block');await capture('passenger-panel-attachment-blocks');
 await select('bd-door-left-glass-bushings');await expect(page.locator('#inspector-content')).toContainText('20562754');await expect(page.locator('#inspector-content')).toContainText('1984 steel-type');await page.getByRole('button',{name:'Isolate',exact:true}).click();expect(await visible()).toEqual(['bd-door-left-glass-bushings']);
 await config('powerWindows',true);await select('bd-door-left-window-motor');await expect(page.locator('#inspector-content')).toContainText('unresolved annotation');
 ids=await visible();await expectScope('left','window',{powerWindows:true,powerLocks:false});expect(ids).toContain('bd-door-left-power-regulator');expect(ids).toContain('bd-door-left-window-motor');expect(ids).not.toContain('bd-door-left-manual-regulator');expect(ids).toContain('bd-door-left-power-lock-stop');await expectGeometry('bd-door-left-power-lock-stop');await capture('driver-power-window');
 await select('bd-door-right-window-motor');expect((await evaluateViewer(page,()=>window.__fiero.getPartBounds('bd-door-right-window-motor'))).min[0]).toBeGreaterThan(0);await capture('passenger-power-window');
 await config('powerLocks',true);await select('bd-door-left-power-lock-stop');await expectGeometry('bd-door-left-power-lock-stop');await expectScope('left','window',{powerWindows:true,powerLocks:true});
 await select('bd-door-left-power-lock-actuator');await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','body-door-left-lock');ids=await visible();await expectScope('left','lock',{powerWindows:true,powerLocks:true});expect(ids).toContain('bd-door-left-power-lock-bellcrank');expect(ids).toContain('bd-door-left-power-lock-bracket');expect(ids).not.toContain('bd-door-left-power-lock-stop');await capture('driver-power-lock');
 await config('powerLocks',false);ids=await visible();await expectScope('left','lock',{powerWindows:true,powerLocks:false});expect(ids.some(id=>id.includes('power-lock'))).toBe(false);await capture('driver-manual-lock');
 await page.setViewportSize({width:390,height:700});await page.getByRole('button',{name:'Open assemblies',exact:true}).click();await select('bd-door-right-inner-belt-seal');await page.getByRole('button',{name:'Isolate',exact:true}).click();await page.getByRole('button',{name:'Focus part',exact:true}).click();await waitForViewer(page);await expectGeometry('bd-door-right-inner-belt-seal');expect(await visible()).toEqual(['bd-door-right-inner-belt-seal']);await expect(page.locator('#inspector-content')).toContainText('20320534');await page.locator('canvas').scrollIntoViewIfNeeded();await waitForViewer(page);await capture('mobile-inner-belt-seal');expect(await evaluateViewer(page,()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
